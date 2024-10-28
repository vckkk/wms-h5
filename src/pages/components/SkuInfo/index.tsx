import { useRef, useState}  from 'react'
import { Button, Image, ImageViewer,Toast, Result,Tag, Input }from 'antd-mobile'
import styles from './index.less'
import { getRealStr } from '@/utils'
import { pickOrder, scanOrder } from '@/server/scanPick'
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
  aggregation_time: string
  quantity: number
  order_index: number
  variant_id: string
  isShow?: boolean,
  setSkuInfo:(info:any)=>{}
  onFocusHandle:()=>{}
  orderName: any
  aggregation_operator: any
  getOrder: (params:any) => {}
}

const SkuInfo = (props:Props) => {
  const { setSkuInfo,getOrder } = props;
  const [viewVisible, setViewVisible] = useState(false)
  const [result, setResult] = useState<any>({})
  const [testStr, setTestStr] = useState<any>("")
    // 分拣扫码
  const onScanPickHandle = () => {
    // 先确认放入
    pickSku2Cell()
  }

  const pickSku2Cell = () => {
    // fetch aggregation_operator
    pickOrder({order_index: props?.order_index, order_name: props?.orderName.order_name, aggregation_operator: localStorage.getItem("userId") || null }).then(res => {
      if (res.success === true){
        scanOrder({order_name: props?.orderName.order_name}).then((res:any) => {
          if(res.success === true && res.result?.status === 1) {
            Toast.show({content: '分拣完成，当前订单已履约完成！'})
            setSkuInfo({})
            getOrder(props?.orderName.order_name)
            return 
          } 
        })
        props.onFocusHandle()
      } else {
        setResult({status: 'error',title: `放入错误,${res.error_message}`})
      }
    })
  }

  const backToScan = () => {
    setSkuInfo({})
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
            <Image fit='fill'  height={300} onClick={()=>setViewVisible(true)} src={props?.image_url} />
            <div style={{fontSize: 18}}>
              <div className={styles.skuName}>{props?.order_name}-{props?.position}</div>
              <div>SKU编码：{props.ext_sku}</div>
              <div>数量：{props?.quantity}</div>
              <div>变体名：
                {
                  props?.ext_skuinfos && JSON.parse(props?.ext_skuinfos).map((item:any)=>{
                    return <span>{item?.name}-{item?.value}</span>
                  })
                }
              </div>
              <div style={{display:'flex', alignItems:'center'}}>分拣状态：{props?.aggregation_status === "unfinished" ? <Tag style={{fontSize: 17}} color='danger'>未分拣</Tag> : <Tag style={{fontSize: 17}} color='success'>已分拣</Tag>}</div>
              <div>分拣人：{JSON.parse(localStorage.getItem("users") || "[]")?.find(i => +i.value === +props?.aggregation_operator)?.label || '-'} </div>
              <div>分拣时间：{props?.aggregation_time ? new Date(props?.aggregation_time).toLocaleString() : "-"}</div>
            </div>
            <ImageViewer 
              visible={viewVisible} 
              image={props?.image_url}
              onClose={()=>{
                setViewVisible(false)
              }}
              />
            <div className={styles.btmOpt}>
              <Button color='primary' fill='outline' onClick={()=>{
                setSkuInfo({});
                getOrder(props?.orderName.order_name)
              }}>返回</Button>
              <Button color='primary' disabled={props?.aggregation_status === "finished"} onClick={onScanPickHandle}>确认，继续扫</Button>
              {/* <Button color='primary' onClick={() => pickSku2Cell(testStr)}>拣货扫扫码</Button> */}
            </div>
        </div>
      }

    </div>
  )
} 

export default SkuInfo