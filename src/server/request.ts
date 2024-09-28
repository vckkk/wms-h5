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



const request = extend({ use: [errorHandle],prefix: "http://121.40.24.145/dev" });
request.interceptors.response.use(async (res, req): Promise<any> => {
  const t = await res.clone().json();
  if(t?.success === false){
    Toast.show({
      icon: 'fail',
      content: t?.error_message,
      duration: 2000
    })
  }

  return res
})

export default request ;