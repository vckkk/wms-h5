import React, { useState, useRef, useEffect } from 'react'
import { SearchBar, Toast, Button } from 'antd-mobile'
import { ScanningOutline } from 'antd-mobile-icons';
import { getRealStr } from '@/utils'
import { printPDF } from '@/server/print';

import styles from './index.less'

const Print = () => {
  const [orderName, setOrderName] = useState<any>(null)
  const searchRef = useRef<any>(null)

  useEffect(() => {
    // console.log(searchRef);
    if(searchRef.current){
      searchRef.current.focus()
    }
  },[searchRef])
  const onFocusHandle = () => {
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      success: function(res: any) {
        const realStr = getRealStr(res.resultStr)
        setOrderName(realStr)
        printHandle()
      },
      error: function(){
        Toast.show({
          icon: 'fail',
          content: '扫码失败,请重试',
        })
      }
    })
  }

  const printHandle = () => {

    if(!orderName) {
      Toast.show({
        icon: 'fail',
        content: "请扫描单号",
      })
      return 
    }
    printPDF({order_name: orderName}).then(res => {
      Toast.show({
        icon: 'success',
        content: '打印成功',
      })
    }).finally(()=>{
      setOrderName("")
      searchRef?.current?.blur()
    })
  }
  return (
    <div>
      <SearchBar placeholder="请输入" value={orderName} onChange={setOrderName} ref={searchRef} onSearch={printHandle}  searchIcon={<ScanningOutline  onClick={onFocusHandle} />} clearable />
      <div className={styles.btmScan}>
        <Button size='large' color='primary' style={{"--border-radius": "50%"}} onClick={onFocusHandle}>
          <ScanningOutline />
        </Button>
      </div>
    </div>
  )
}

export default Print