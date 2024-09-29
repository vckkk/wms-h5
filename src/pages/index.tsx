import { useRef, useState}  from 'react'
import {Button, Image, SearchBar, ImageViewer,Toast, SpinLoading }from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import { getRealStr } from '@/utils'
import "@/global.css"
import styles from './index.less'
import SkuInfo from './components/SkuInfo/index';
import { scanSku } from '@/server/scanPick';
const Scan = () => {
  const searchRef = useRef<any>(null)
  const [skuCode, setSkuCode] = useState<string>("")
  const [skuInfo, setSkuInfo] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  // sku扫码
  const onFocusHandle = () => {
    // 调用wx扫码获取code
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        // 接口请求sku信息
        const realStr = getRealStr(res.resultStr)
        // setSkuCode(realStr)
        getSkuInfo(realStr)
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
    getSkuInfo()
  }
  const getSkuInfo = (params?: string) => {
    //fetch 后清空value
    setLoading(true)
    scanSku({"order_name_position": params || skuCode}).then((res:any) => {
      setSkuCode("")
      if(res.success === true) {
        setSkuInfo(res?.result)
      } else {
        setSkuInfo({})
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <div className={styles.content}>
      {!skuInfo.ext_sku && <SearchBar placeholder='商品条码' style={{'--height': '32px',}} searchIcon={<ScanningOutline onClick={onFocusHandle} />} value={skuCode} onChange={setSkuCode} ref={searchRef}  onSearch={onSearchHandle}/>}
      {loading && <SpinLoading  style={{ '--size': '48px' , margin: '240px auto'}} /> }
      <div>  
        {
          skuInfo.ext_sku  ? 
          <SkuInfo {...skuInfo} setSkuInfo={setSkuInfo} onFocusHandle={onFocusHandle} /> 
          : 
          <div className={styles.btmScan}>
            <Button size='large' color='primary' style={{"--border-radius": "50%"}} onClick={onFocusHandle}>
              <ScanningOutline />
            </Button>
        </div>
        }
      </div>

    </div>
  )
}

export default Scan