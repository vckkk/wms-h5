import request from "./request";


export const scanSku = (params: any) => {
  return request("/api/v1/order-operation/get-order-detail-by-order-name-position",{
    params
  })
}

