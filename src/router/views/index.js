import Layout from '@/page/index'
import lightLayout from '@/page/indexLightTheme'
import darkLayout from '@/page/indexDarkTheme'
import simpleLayout from '@/page/indexSimpleTheme'
import eveningLayout from '@/page/indexEveningTheme'
import { getStore } from '@/util/store'
import website from '@/config/website'
import i18n from "@/lang";

/**
 * 根据主题  改变layout component
 * **/
let themeName = getStore({ name: 'themeName' }) || website.defaultTheme;
let layout = null;
switch (themeName) {
  case 'default': layout = Layout; break;
  case 'lightTheme': layout = lightLayout; break;
  case 'darkTheme': layout = darkLayout; break;
  case 'simpleTheme': layout = simpleLayout; break;
  case 'eveningTheme': layout = eveningLayout; break;
}

var routes = [{
  path: '/wel',
  redirect: '/wel/index',
  children: [
    {
      path: 'index',
      name: '首页',
      meta: {
        i18n: 'route.dashboard',
        keepAlive: true
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/index')
    },
    {
      path: 'dashboard',
      name: '控制台',
      meta: {
        i18n: 'route.dashboard',
        menu: false,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
    },
    {
      path: '/403-no-columns',
      component: () =>
        import( /* webpackChunkName: "403-no-columns" */ '@/views/wel/errorPage.vue'),
      name: 'no-columns',
      meta: {
        isTab: false,
      }
    },
    {
      path: 'hotFunc',
      name: '热门功能',
      meta: {
        i18n: 'route.hotfunc'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/hotFunc')
    },
    {
      path: 'myDesktop',
      name: '我的桌面',
      meta: {
        i18n: 'route.desktop'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/myDesktop')
    }
  ]
}, {
  path: '/form-detail',
  children: [{
    path: 'index',
    name: '详情页',
    meta: {
      i18n: 'route.detail'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/form-detail')
  }]
}, {
  path: '/info',
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'route.info'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/user/info')
  }, {
    path: 'setting',
    name: '个人设置',
    meta: {
      i18n: 'route.setting'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/user/setting')
  }]
}]
let existLayoutRoute = ['/wel', '/form-detail', '/info'];
routes.map((item) => {
  if (existLayoutRoute.indexOf(item.path) > -1) {
    item.component = layout;
  }
})
export default routes