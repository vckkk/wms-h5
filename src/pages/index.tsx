import { useRef, useState}  from 'react'
import {Button, Image, SearchBar, ImageViewer,Toast }from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import "@/global.css"
import styles from './index.less'
import SkuInfo from './components/skuInfo';
const Scan = () => {
  const searchRef = useRef<any>(null)
  const [skuCode, setSkuCode] = useState(1)
  const onFocusHandle = () => {
    // 调用wx扫码获取code
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        console.log(res,"res");
        setSkuCode(res.resultStr)
        // 接口请求sku信息
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

  const onPickScanHandle = () => {
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        console.log(res.resultStr,"res");
        //接口请求，分拣成功或失败
      },
      error: function(){
        Toast.show({
          icon: 'fail',
          content: '扫码失败,请重试',
        })
      }
      
    });
  }
  return (
    <div className={styles.content}>
      <SearchBar />
      <div>
        
        <span className={styles.font}>123</span>
        <SkuInfo code="xxx" />
      </div>

    </div>
  )
}

export default Scan