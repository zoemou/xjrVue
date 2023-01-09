import Layout from "@/page/index";
import lightLayout from "@/page/indexLightTheme";
import darkLayout from "@/page/indexDarkTheme";
import simpleLayout from "@/page/indexSimpleTheme";
import eveningLayout from "@/page/indexEveningTheme";
import { getStore } from "@/util/store";
import website from "@/config/website";

/**
 * 根据主题  改变layout component
 * **/
let themeName = getStore({ name: "themeName" }) || website.defaultTheme;
let layoutObj = {
  path: "/myiframe",
  redirect: "/myiframe",
  children: [
    {
      path: ":routerPath",
      name: "iframe",
      component: () =>
        (/* webpackChunkName: "myiframe" */ "@/components/iframe/main"),
      props: true
    }
  ]
};
switch (themeName) {
  case "default":
    layoutObj.component = Layout;
    break;
  case "lightTheme":
    layoutObj.component = lightLayout;
    break;
  case "darkTheme":
    layoutObj.component = darkLayout;
    break;
  case "simpleTheme":
    layoutObj.component = simpleLayout;
    break;
  case "eveningTheme":
    layoutObj.component = eveningLayout;
    break;
}
var routes = [
  {
    path: "/login",
    name: "登录页",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/page/login/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/lock",
    name: "锁屏页",
    component: () => import(/* webpackChunkName: "lock" */ "@/page/lock/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  // 表单设计 运行 iframe空页面
  {
    path: "/quick-development/preview.html",
    component: () =>
      import(
        /* webpackChunkName: "quick-development-preview" */ "@/components/error-page/empty"
      )
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "error-page-404" */ "@/components/error-page/404"),
    name: "404",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/403",
    component: () =>
      import(/* webpackChunkName: "error-page-403" */ "@/components/error-page/403"),
    name: "403",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },

  {
    path: "/500",
    component: () =>
      import(/* webpackChunkName: "error-page-500" */ "@/components/error-page/500"),
    name: "500",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/",
    name: "主页",
    redirect: "/wel"
  },
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/parser",
    name: "parser",
    component: () =>
      import(
        /* webpackChunkName: "parser" */ "@/components/parser/example/Index.vue"
      )
  },
  {
    path: "/tinymce",
    name: "tinymce",
    component: () =>
      import(
        /* webpackChunkName: "tinymce" */ "@/components/tinymce/example/Index.vue"
      )
  },
  {
    path: "*/bi/view/:id",
    name: "view",
    component: () => import(/* webpackChunkName: "page" */ "@/views/BI/preview")
  },
  {
    path: "*/bi/view/:id/index",
    name: "view",
    component: () => import(/* webpackChunkName: "page" */ "@/views/BI/preview")
  },
  {
    path: "*/bi/navigate",
    name: "view",
    component: () => import(/* webpackChunkName: "page" */ "@/views/BI/navigate")
  },
  {
    path: "*/centerboard",
    name: "中心看板",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/centerboard/index")
  },
  {
    path: "*/projectboard",
    name: "项目看板",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/centerboard/index2")
  },
  {
    path: "*/report-frame/:id",
    name: "report",
    component: () =>
      import(
        /* webpackChunkName: "variable-log" */ "@/views/ReportModule/ReportFrame.vue"
      ),
    meta: {
      keepAlive: true,
      isTab: true,
      isAuth: false
    }
  },
  {
    path: "/message-link/:operation/:id",
    name: "message-link",
    meta: {
      isTab: false
    },
    component: () =>
      import(
        /* webpackChunkName: "message-link" */ "@/views/MessageLink/Index.vue"
      )
  }
];

//加入layout 组件
routes.push(layoutObj);
export default routes;
