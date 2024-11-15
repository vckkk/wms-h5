import { useEffect, useRef, useState}  from 'react'
import { Button, Image, SearchBar, ImageViewer,Toast, SpinLoading }from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import { getRealStr } from '@/utils'
import "@/global.css"
import styles from './index.less'
import SkuInfo from '@/pages/components/SkuInfo/index';
import { scanOrder, scanSku, scanPurchase } from '@/server/scanPick';
import { useSearchParams, useParams } from 'umi'

const Scan = () => {
  const searchRef = useRef<any>(null)
  const [orderId, setOrderId] = useState<any>("")
  const [orderName, setOrderName] = useState<any>({})
  const [skuInfo, setSkuInfo] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [params] = useSearchParams()
  const [step, setStep] = useState<number>(1)

  // 订单扫码、sku
  const onFocusHandle = () => {
    // 调用wx扫码获取code
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        // 接口请求sku信息
        const realStr = getRealStr(res.resultStr)
        // setSkuCode(realStr)
        orderName.order_name ? getSkuInfo(realStr) : getOrder(realStr)
      },
      error: function(){
        Toast.show({
          icon: 'fail',
          content: '扫码失败,请重试',
        })
      }
    });
    searchRef?.current?.blur()
  }

  // 支持外部跳转
  useEffect(() => {
    // console.log(params);
    let queryParams:any = {};
    // 将所有查询参数添加到对象中
    for (const [key, value] of params) {
      queryParams[key] = value;
    }
    if(queryParams.order_name && queryParams.order_index) {
      setOrderName({order_name: queryParams.order_name})
      getSkuInfo(queryParams.order_index, queryParams.order_name)
    }
  },[params])
  
  //控件search
  const onSearchHandle = () => {
    orderName.order_name ? getSkuInfo(orderId) : getOrder()
  }
  const getOrder = (params?: string) => {
    //fetch 后清空value
    setLoading(true)
    scanOrder({"order_name": params || orderId}).then((res:any) => {
      setOrderId("")
      if(res.success === true) {
        setOrderName(res?.result)
      } else {
        setOrderName({})
      }
    }).finally(() => {
      setLoading(false)
    })
  }


  const getSkuInfo = (code: string, name?: string) => {
    // 合并短码扫码 step1 扫描单号不变， step2 正常流程扫sku即order_index 合并流程：此时扫描的信息为M开头，即调用新接口，下一个页面只展示供应商信息
    const isPurchase = code.toLocaleUpperCase().startsWith('M');
    setLoading(true)
    if(isPurchase) {
      scanPurchase({purchase_index: code}).then((res: any)=>{
        if(res.success === true) {
          setSkuInfo(res?.result)
        } else {
          setSkuInfo({})
        }
      }).finally(() => {
        setLoading(false)
        setOrderId("")
      })

      return
    }
    scanSku({"order_index": code, "order_name": orderName.order_name || name}).then((res:any) => {
      if(res.success === true) {
        setSkuInfo(res?.result)
      } else {
        setSkuInfo({})
      }
    }).finally(() => {
      setLoading(false)
      setOrderId("")
    })
  }

  useEffect(() => {
    if(skuInfo.ext_sku || skuInfo.purchase_index) {
      setStep(2) // SKU页面
    } else {
      setStep(1) // 订单页面
    }
  },[skuInfo])
  return (
    <div className={styles.content}>
      { step===1 && <SearchBar placeholder={orderName?.order_name? '请扫描商品':'请扫描订单号'} style={{'--height': '32px',}} searchIcon={<ScanningOutline onClick={onFocusHandle} />} value={orderId} onChange={setOrderId} ref={searchRef}  onSearch={onSearchHandle}/>}
      {loading && <SpinLoading  style={{ '--size': '48px' , margin: '240px auto'}} /> }
      {orderName.order_name && step	=== 1 && 
        <div className={styles.orderName}>
          <div className={styles.orderNameTitle}>{orderName.order_name}</div>
          <div>履约进度: {orderName.approved_count ||0}/{orderName.total_rows||0}</div>
        </div>
      }
      <div>  
        {
          step === 2 && 
          <SkuInfo {...skuInfo} orderName={orderName} setSkuInfo={setSkuInfo} onFocusHandle={onFocusHandle} getOrder={getOrder} /> 
        }
        { step === 1 && <div className={styles.btmScan}>
          <Button size='large' color='primary' disabled={orderName.status === 1} style={{"--border-radius": "50%"}} onClick={onFocusHandle}>
            <ScanningOutline />
          </Button>
        </div>
        }
      </div>
      {/* <Button  color='primary' onClick={()=> getSkuInfo("15367")} block>测试</Button> */}
      {orderName.order_name && step	=== 1  && <Button className={styles.btnBack} size='large' color='primary' onClick={()=>setOrderName({})} block>返回</Button>}
    </div>
  )
}

export default Scan