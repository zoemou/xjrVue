/**
 * 全局配置文件
 */
const env = process.env;
let errorLogSwitch = true;
if (env.NODE_ENV == "production") {
  errorLogSwitch = false;
}
export default {
  version: "V 3.0.0.3", //版本号
  title: "LEARUNSOFT",
  logo: "XJR",
  refreshInterval: 60000, //消息刷新间隔时间
  key: "avue", //配置主键,目前用于存储
  indexTitle: "LEARUNSOFT", //菜单树标题
  platformName: "", //平台名称
  copyright: "Copyright © 力软信息技术（苏州）有限公司, All Rights Reserved. ", //公司备案信息
  link: "http://www.xjrsoft.com", //logo 图点击跳转
  logoImg: "/img/logo_white.png", //菜单树log图片地址  将图片放入/public下就行了
  biTitle: "力软信息", //bi大屏的标题
  biName: "可视化数据大屏", //bi大屏的描述
  lockPage: "/lock",
  tokenTime: 60000000, //token过期时间
  Authorization: "Authorization",
  netFlowableEnable: false, //net版本需要打开 java 默认关闭
  tenantEnabled: false, //租户开关
  errorLogSwitch: errorLogSwitch,
  defaultTheme: "default", //default,lightTheme,darkTheme,simpleTheme,eveningTheme
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [400],
  chilIndex: "/wel/hotFunc", //子系统首页(必须是路由里的页面)
  proVersion: false, // 是否为专业版
  genCodePath: `Customer`, //为代码生成器 前端文件输出目录  在 /src/viwes（这两级文件夹不用写） 下 的文件夹
  //配置首页不可关闭
  isFirstPage: true,
  isTheDemoEnvironment: false, //是否为演示环境
  applicationPlatformId: "17d444b953948c6d79d679f46a95af12", //子系统应用平台F_Id
  businessPlatformId: "7d4711c8c12c8bcc9254fd903ebc147d", //子系统业务平台F_Id
  fistPage: [
    {
      label: "首页",
      value: "/wel/index",
      params: {},
      query: {},
      meta: {
        i18n: "route.dashboard",
        keepAlive: true,
      },
      group: [],
      target: "",
      close: false,
    },
    // {
    //   label: "热门功能",
    //   value: "/wel/hotFunc",
    //   params: {},
    //   query: {},
    //   meta: {
    //     i18n: 'hotfunc',
    //     keepAlive: false
    //   },
    //   group: [],
    //   target: "",
    //   close: false
    // }
  ],

  //配置菜单的属性
  menu: {
    iconDefault: "icon-caidan",
    /* props: {
      label: 'F_FullName',
      path: 'F_UrlAddress',
      icon: 'F_Icon',
      children: 'children'
    } */
    props: {
      label: "label",
      path: "path",
      icon: "icon",
      children: "children",
      target: "target",
    },
  },
};
/*
{
    label: "我的桌面",
    value: "/wel/myDesktop",
    params: {},
    query: {},
    meta: {
      i18n: 'desktop',
      keepAlive: true
    },
    group: [],
    target: "",
    close: false
  }, 
*/
