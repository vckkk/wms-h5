import { useRef, useState}  from 'react'
import { Button, Image, ImageViewer,Toast, Result }from 'antd-mobile'
import styles from './index.less'
import { getRealStr } from '@/utils'
interface Props { 
  code?: string
  name?: string
  isShow?: boolean,
  setSkuInfo:(info:any)=>{}
  onFocusHandle:()=>{}
}

const SkuInfo = (props:Props) => {
  const { setSkuInfo,onFocusHandle, code } = props;
  const [viewVisible, setViewVisible] = useState(false)
  const [result, setResult] = useState<any>({})

    // 分拣扫码
  const onScanPickHandle = () => {
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res:any) {
        pickSku2Cell(getRealStr(res.resultStr))
      },
      error: function(){
        Toast.show({
          icon: 'fail',
          content: '扫码失败,请重试',
        })
      }
    })
  }

  const pickSku2Cell = (code:string = 'success') => {
    // fetch 
    if (code === 'success'){
      setResult({status: 'success',title: "放入成功"})
    } else {
      setResult({status: 'error',title: "放入错误"})
    }
  }

  const backToScan = () => {
    setSkuInfo({})
    onFocusHandle()
  }

  return (
    <div>
      {
        result.status ?
        <Result
          className={styles.result}
          status={result.status}
          title={result.title}
          description={
            result?.status === 'success' ? <Button color='primary' onClick={backToScan} block>重新扫码</Button>: <Button color='danger' onClick={()=>setResult({})} block>返回</Button>
          }
        />
        : <div>
            <Image fit='fill'  height={220} onClick={()=>setViewVisible(true)} src='https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'/>
            <div>
              <h3>订单号-行号</h3>
              <div>{code}</div>
              <div>xxx</div>
              <div>xxx</div>
              <div>xxx</div>
            </div>
            <ImageViewer 
              visible={viewVisible} 
              image='https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
              onClose={()=>{
                setViewVisible(false)
              }}
              />
            <div className={styles.btmOpt}>
              <Button color='primary' fill='outline' onClick={()=>setSkuInfo({})}>返回</Button>
              <Button color='primary' onClick={onScanPickHandle}>分拣扫码</Button>
              {/* <Button color='primary' onClick={() => pickSku2Cell()}>拣货扫扫码</Button> */}
            </div>
        </div>
      }

    </div>
  )
} 

export default SkuInfo