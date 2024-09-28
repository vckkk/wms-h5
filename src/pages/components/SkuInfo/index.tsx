import { useRef, useState}  from 'react'
import { Button, Image, ImageViewer,Toast, Result,Tag }from 'antd-mobile'
import styles from './index.less'
import { getRealStr } from '@/utils'
interface Props { 
  ext_sku: string
  aggregation_status: string
  ext_skuinfos: string
  image_url: string
  order_id: string
  order_name: string
  position: number
  purchase_id:string
  quality_check_operator: number
  quantity: number
  variant_id: string
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
            <Image fit='fill'  height={220} onClick={()=>setViewVisible(true)} src={props?.image_url} />
            <div style={{fontSize: 18}}>
              <h3>{props?.order_name} - {props?.position}</h3>
              <div>{props.ext_sku}</div>
              <div>数量：{props?.quantity}</div>
              <div>变体名：
                {
                  props?.ext_skuinfos && JSON.parse(props?.ext_skuinfos).map((item:any)=>{
                    return <span>{item?.name}-{item?.value}</span>
                  })
                }
              </div>
              <div style={{display:'flex', alignItems:'center'}}>分拣状态：{props?.aggregation_status === "unfinished" ? <Tag style={{fontSize: 17}} color='danger'>未分拣</Tag> : <Tag style={{fontSize: 17}} color='success'>已分拣</Tag>}</div>
              <div>分拣人：{props?.quality_check_operator} </div>
            </div>
            <ImageViewer 
              visible={viewVisible} 
              image={props?.image_url}
              onClose={()=>{
                setViewVisible(false)
              }}
              />
            <div className={styles.btmOpt}>
              <Button color='primary' fill='outline' onClick={()=>setSkuInfo({})}>返回</Button>
              <Button color='primary' disabled={props?.aggregation_status !== "unfinished"} onClick={onScanPickHandle}>分拣扫码</Button>
              {/* <Button color='primary' onClick={() => pickSku2Cell()}>拣货扫扫码</Button> */}
            </div>
        </div>
      }

    </div>
  )
} 

export default SkuInfo