import  { extend } from "umi-request";
import {Toast} from 'antd-mobile';
const errorHandle = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      // 401 清除token信息并跳转到登录页面
      // history.replace('/login');
    }
    console.log(error);
  }
}

const getApiPrefixByDomain = () => {
  const host = window.location?.host;
  if (host === 'www.countmeout.top') {
    return 'http://112.124.63.126';
  }
  return 'http://112.124.63.126/dev';
}

const request = extend({ use: [errorHandle],prefix: getApiPrefixByDomain() });
request.interceptors.response.use(async (res, req): Promise<any> => {
  const t = await res.clone().json();
  if(t?.success === false){
    const s = Toast.show({
      icon: 'fail',
      content: t?.error_message,
      duration:0
    })
    setTimeout(() => {
      s.close()
    }, 2000)
  }
  return t
})

export default request ;