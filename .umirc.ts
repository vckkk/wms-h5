import { defineConfig } from "umi";
import path from 'path'
import request from './src/server/request';

export default defineConfig({
  title: "商品分拣",
  routes: [
    { path: "/", component: "index" },
    { path: "/pick", component: "@/pages/pick", title:"商品分拣" },
    { path: "/printPackage", component: "@/pages/outStore/print", title:"打印面单" },
    { path: "/*", component: "@/pages/404"}
  ],
  npmClient: 'yarn',
  extraPostCSSPlugins: [
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // 视口宽度，对应设计稿的宽度，一般是 375 或 750
      // viewportHeight: 1334, // 视口高度，根据 750 设备的宽度来指定，一般指定 1334 也可以不配置
      unitPrecision: 3, // 指定 `px` 转换为视口单位值的小数位数
      viewportUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
      selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视口单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于 `1px` 不转换为视口单位，你也可以设置为你想要的值
      mediaQuery: true, // 允许在媒体查询中转换 `px`
    }),
  ],
  alias: {
    '@': path.resolve(__dirname, 'src'), // 设置别名以便于引用项目中的资源文件等。
  },
  headScripts:[
    {
      src: "https://res.wx.qq.com/open/js/jweixin-1.6.0.js",
      type: "text/javascript"
    }
  ],
});
