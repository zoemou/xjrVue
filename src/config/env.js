// 配置编译环境和线上环境之间的切换
let baseUrl = 'http://192.168.0.114:2828'; //http://192.168.0.139:8099   http://192.168.0.142:2828
let flowableUrl = "http://localhost:2828"; //net工作流模块请求地址 java不需要
let loginUrl = "http://114.116.210.204:7410" //在线登录界面
let SSOUrl = []//["http://192.168.0.139:7755"] //需要单点登录的域名
let BIUrl = "http://114.116.210.204:2424";
let previewUrl = 'http://114.116.210.204:8012/onlinePreview?url='; // 文件在线 预览页面
let iconfontVersion = ['567566_pwc3oottzol'];
let iconfontUrl = ``;
let codeUrl = `${baseUrl}/code`
const env = process.env

if (env.NODE_ENV == 'development') {
  // baseUrl = `http://119.3.78.210:8282`; // 开发环境地址
  baseUrl = `http://192.168.0.154:2828`; // 开发环境地址 
  window.baseUrl = `http://192.168.0.154:2828`;
  // baseUrl = `http://192.168.0.114:2828`; // 开发环境地址 
  flowableUrl = "http://192.168.0.114:2828";//net工作流模块请求地址
} else if (env.NODE_ENV == 'production') {
  loginUrl = "http://114.116.210.204:7410" //在线登录界面
  flowableUrl = "http://localhost:2828";//net工作流模块请求地址 java不需要
  baseUrl = `http://114.116.210.204:2828`; //生产环境地址
  SSOUrl = ["http://114.116.210.204:2424"]// //需要单点登录的域名
  BIUrl = "http://114.116.210.204:2424" //BI项目部署地址
  previewUrl = 'http://114.116.210.204:8012/onlinePreview?url='; // 文件在线 预览页面
} else if (env.NODE_ENV == 'test') {
  baseUrl = `http://119.3.78.210:8282`; //测试环境地址
  loginUrl = "http://119.3.78.210:7410" //在线登录界面
  flowableUrl = "http://localhost:8282";//net工作流模块请求地址 java不需要
}
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env,
  loginUrl,
  flowableUrl,
  SSOUrl,
  BIUrl,
  previewUrl
}