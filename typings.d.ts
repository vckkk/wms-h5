import 'umi/typings';

declare global {
  interface Window {
    wx: any
  }
}

interface CustomWindow extends Window {
  wx: any; // 根据实际情况定义类型
}

declare const window: CustomWindow;