import request from "./request";
import { APP_ID, SK } from '@/CONST'
//https://api.weixin.qq.com/cgi-bin
export const getAccessToken = () => request.get("http://www.countmeout.top/bff/api/token", {
  params: {
    grant_type: "client_credential",
    appid: APP_ID,
    secret: SK
  }
}) 

//https://api.weixin.qq.com/cgi-bin/ticket
export const getTicket = (params: any) => request.get("http://www.countmeout.top/bff/api/ticket/getticket",{
  params
})