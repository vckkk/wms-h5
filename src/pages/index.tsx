import { useRef, useState}  from 'react'
import {Button, Image, SearchBar, ImageViewer,Toast }from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import "@/global.css"
import styles from './index.less'
import SkuInfo from './components/SkuInfo/index';
const Scan = () => {
  const searchRef = useRef<any>(null)
  const [skuCode, setSkuCode] = useState<string>("")
  const [skuInfo, setSkuInfo] = useState<any>({})
  
  // sku扫码
  const onFocusHandle = () => {
    // 调用wx扫码获取code
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        // 接口请求sku信息
        // setSkuCode(res.resultStr)
        setSkuInfo({code: res.resultStr})
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


  // const onPickScanHandle = () => {
  //   window.wx.scanQRCode({
  //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
  //     // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
  //     success: function (res:any) {
  //       //接口请求，分拣成功或失败
  //       getSkuInfo()
  //     },
  //     error: function(){
  //       Toast.show({
  //         icon: 'fail',
  //         content: '扫码失败,请重试',
  //       })
  //     }
      
  //   });
  // }
  
  //控件search
  const onSearchHandle = () => {
    getSkuInfo()
  }
  const getSkuInfo = () => {
    //fetch 后清空value
    const loading = Toast.show({
      icon: 'loading',
    })
    setTimeout(() => {
      setSkuCode("")
      setSkuInfo({code: skuCode})
      loading.close()
    },300)

  }
  return (
    <div className={styles.content}>
      {!skuInfo.code && <SearchBar placeholder='商品条码' style={{'--height': '32px',}} searchIcon={<ScanningOutline onClick={onFocusHandle} />} value={skuCode} onChange={setSkuCode} ref={searchRef}  onSearch={onSearchHandle}/>}
      <div>  
        {
          skuInfo.code ? 
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