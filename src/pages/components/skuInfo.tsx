import { useRef, useState}  from 'react'
import { Button, Image, ImageViewer }from 'antd-mobile'

interface Props { 
  code?: string
  name?: string
  isShow?: boolean,

}
const SkuInfo = (props:Props) => {
  const [viewVisible, setViewVisible] = useState(false)
  return (
    <div>
      <Image style={{"--width": "200px"}}  onClick={()=>setViewVisible(true)} src='https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'/>
      <ImageViewer 
        visible={viewVisible} 
        image='https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
        onClose={()=>{
          setViewVisible(false)
        }}
        />
        {/* <div> */}
          <Button color='primary' fill='outline'>返回</Button>
          <Button color='primary'>分拣扫扫码</Button>
        {/* </div> */}
    </div>
  )
} 

export default SkuInfo