import request from "./request";

// 云图打印面单
export const printPDF = (params: any) => {
  console.log(params,"params");
  return request(`/api/v1/order-operation/print-pdf-by-order-name?order_name=${params.order_name}`,{
    method: "POST"
  })
}