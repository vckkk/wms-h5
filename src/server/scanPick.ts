import request from "./request";


// export const scanSku = (params: any) => {
//   return request("/api/v1/order-operation/get-order-detail-by-order-name-position",{
//     params
//   })
// }

export const scanOrder = (params: any) => {
  return request("/api/v1/order-operation/scan-order-name-code", {
    params
  })
}

export const scanSku = (params:any) => {
  return request("/api/v1/order-operation/get-order-detail-by-order-index", {
    params
  })
}

export const pickOrder = (params: any) => {
  return request("/api/v1/order-operation/update-aggregation-status",{
    method: "POST",
    data: params
  })
}