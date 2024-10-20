import { useRef, useState}  from 'react'
import {Button, Image, SearchBar, ImageViewer,Toast, SpinLoading }from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import { getRealStr } from '@/utils'
import "@/global.css"
import styles from './index.less'
import SkuInfo from './components/SkuInfo/index';
import { scanOrder, scanSku } from '@/server/scanPick';
const Scan = () => {
  const searchRef = useRef<any>(null)
  const [orderId, setOrderId] = useState<any>("")
  const [orderName, setOrderName] = useState<any>()
  const [skuInfo, setSkuInfo] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
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
        orderName ? getSkuInfo(realStr) : getOrder(realStr)
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
  
  //控件search
  const onSearchHandle = () => {
    getOrder()
  }
  const getOrder = (params?: string) => {
    //fetch 后清空value
    setLoading(true)
    scanOrder({"order_name": params || orderId}).then((res:any) => {
      setOrderId("")
      if(res.success === true) {
        setOrderName(res?.result)
      } else {
        setOrderName(null)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const getSkuInfo = (code: string) => {
    setLoading(true)
    scanSku({"order_index": code, "order_name": orderName}).then((res:any) => {
      if(res.success === true) {
        setSkuInfo(res?.result)
      } else {
        setSkuInfo
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <div className={styles.content}>
      {!skuInfo.ext_sku && <SearchBar placeholder='请扫描订单号' style={{'--height': '32px',}} searchIcon={<ScanningOutline onClick={onFocusHandle} />} value={orderId} onChange={setOrderId} ref={searchRef}  onSearch={onSearchHandle}/>}
      {loading && <SpinLoading  style={{ '--size': '48px' , margin: '240px auto'}} /> }
      {orderName && !skuInfo.ext_sku && <div className={styles.orderName}>当前订单号：{orderName}</div>}
      <div>  
        {
          skuInfo.ext_sku  && 
          <SkuInfo {...skuInfo} orderName={orderName} setSkuInfo={setSkuInfo} onFocusHandle={onFocusHandle} /> 
        }
        { !skuInfo.ext_sku && <div className={styles.btmScan}>
          <Button size='large' color='primary' style={{"--border-radius": "50%"}} onClick={onFocusHandle}>
            <ScanningOutline />
          </Button>
        </div>
        }
      </div>
      {/* <Button  color='primary' onClick={()=> getSkuInfo("15367")} block>测试</Button> */}
      {orderName && !skuInfo.ext_sku  && <Button className={styles.btnBack} size='large' color='primary' onClick={()=>setOrderName("")} block>返回</Button>}
    </div>
  )
}

export default Scan