
import { Link, Outlet, useLocation } from 'umi';
import { Avatar, NavBar, Picker, SafeArea, Toast } from 'antd-mobile'
import { useEffect, useRef, useState } from "react";
// import { getAccessToken, getTicket } from '../server/sign';
import Crypto from "crypto-js"
import styles from './index.less';
import { getSign, getUsers } from '@/server/sign';
import VConsole from 'vconsole'


const node_env = process.env.NODE_ENV


export default function Layout() {
  const [token, setToken] = useState(null)
  const [sign, setSign] = useState<any>(null)
  const [pickerVisible, setPickerVisible] = useState(false);
  const timestamp = useRef(Math.round(+new Date() / 1000))
  const [userList, setUserList] = useState<Array<any>>([])

  const location = useLocation()
  useEffect(()=>{
    const ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf('micromessenger') !== -1  || node_env === "development") {
      //在微信中
      // getAccessToken().then(res => {
      //   setToken(res.access_token)
      //   console.log(timestamp.current,1);
      //   getTicket({access_token: res.access_token, type:"jsapi"}).then(res => {
      //     const o = `jsapi_ticket=${res.ticket}&noncestr=nonceStrnonceStr&timestamp=${timestamp.current}&url=http://www.countmeout.top/`
      //     const sign = Crypto.SHA1(o).toString();
      //     setSign(sign);
      //   })
      // })
      getSign({url: window.location.href}).then(res => {
        setSign(res?.result)
      })
      const host = window.location?.host;
      if (host !== 'www.countmeout.top') {
        const vConsole = new VConsole({ theme: 'dark' });
      }
    } else {
      //不在微信中
      // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx25ee9435260b2b40&redirect_uri=http://www.countmeout.top/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    }
    getUsers().then(res => {
      if(res?.result.length > 0) {
        setUserList(res.result)
        localStorage.setItem("users", JSON.stringify(res?.result.map(i => {
          return { label: i?.name, value: i?.id }
        })))
      }
    })
  },[])

  useEffect(()=>{
    if(!pickerVisible && !localStorage.getItem("username")){
      Toast.show({content: '请先登录', position: 'top'})
      setPickerVisible(true)
    }
  },[pickerVisible])

  useEffect(()=>{
    if(window.wx && sign){
      window.wx.config({
        debug: false,
        // appId: "wx25ee9435260b2b40",
        // timestamp: timestamp.current,
        // nonceStr: "nonceStrnonceStr",
        // signature: sign,
        jsApiList:["scanQRCode"],
        ...sign,
        nonceStr: sign.noncestr
      })
      window.wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        window.wx.checkJsApi({
          jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res:any) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          console.log(res,"res");
          }
        })
      });
      window.wx.error(function(res:any){
        console.error(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      }); 
    }
  },[sign])

  const onCloseHandle = () => {
    if(!localStorage.getItem("userId")){
      setPickerVisible(true)
    } else {
      setPickerVisible(false)
    }
  }
  return (
    <div>
      <SafeArea position='top' />
      <div className={styles.container}>
        {
          location.pathname === '/' && 
          <div className={styles.nav}>
            <div className={styles.avatar}>
              <Avatar src="" style={{'--border-radius': '50%', '--size': '11vw'}} />
              <span onClick={() => setPickerVisible(true)}>{localStorage.getItem("username") || '未登录'}</span>
            </div>
          </div>
        }
        <Outlet />
        <Picker 
          visible={pickerVisible} 
          value={[localStorage.getItem("userId")]} 
          onConfirm={(v:Array<any>) => {
          localStorage.setItem("userId", v?.[0].toString())
          localStorage.setItem("username", userList.find((i: any) => i?.id === v[0])?.name)
        }} 
          closeOnMaskClick={false} 
          cancelText={null} 
          onClose={onCloseHandle} 
          columns={[localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users") || '[]') : []]} 
        />
      </div>
      <SafeArea position='bottom' />
    </div>
  );
}
