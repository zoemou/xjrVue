/**
 * 全站权限配置
 *
 */
import router from './router/router';
import store from './store';
import {
  validatenull
} from '@/util/validate';
import {
  getToken
} from '@/util/auth';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getStore } from './util/store';
NProgress.configure({
  showSpinner: false
});
let flag = 0;
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
  if(to.path=='/wel/index'&&from.path=='/'){
    store.commit('SET_TAG_LIST', []);
    //store.commit('SET_CATEGORY', 0);
  }
  // if(to.path==router.$avueRouter.$website.chilIndex){
  //   store.commit('SET_CATEGORY', 1);
  // }

  const meta = to.meta || {};
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
  store.commit('SET_IS_MENU', isMenu === undefined);
  if (getToken() || getStore({name:'token'})) {
    if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
      next({
        path: lockPage
      });
    } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
		
      next({
        path: '/'
      });
    } else {
      //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      // if (store.getters.roles.length === 0) {
      //   store.dispatch('GetUserInfo').then(() => {
      //     next({ ...to, replace: true })
      //   }).catch(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       next({ path: '/login' })
      //     })
      //   })
      // } else {
      const value = to.query.src || to.fullPath;
      const label = to.query.name || to.name;
      const meta = to.meta || router.$avueRouter.meta || {};
      const i18n = to.query.i18n;
      const target = to.query.target || router.$avueRouter.target || '';

      if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
        store.commit('ADD_TAG', {
          label: label,
          value: value,
          params: to.params,
          query: to.query,
          target: target,
          meta: (() => {
            if (!i18n) {
              return meta;
            }
            return {
              i18n: i18n
            };
          })(),
          group: router.$avueRouter.group || []
        });
      } 
      else if (flag === 0) {
        flag = 1;
        // value.includes("preview.html") || location.reload();
        value.includes("preview.html") 
      }
      next();
    }
  } else {
		
    //判断是否需要认证，没有登录访问去登录页
    if (meta.isAuth === false) {
      if (to.path !== '/login') { //如果没有权限直接走登录页
			
			  
        next({
          path: '/login'
        });
      }else{
				store.commit('ADD_TAG', {
				  label: to.name,
				  value: '',
				  params: to.params,
				  query: to.query,
				  target: '',
				  meta: (() => {
				    if (!to.query.i18n) {
				      return to.meta;
				    }
				    return {
				      i18n: to.query.i18n
				    };
				  })(),
				  group: router.$avueRouter.group || []
				});

        next();
      }
    } else {
			
      // 保存登录前登录返回地址
      window.localStorage.setItem('loginBackPath',to.path);
      next('/login');
    }
  }
});

router.afterEach(() => {
  NProgress.done();
	
  let title = store.getters.tag.label;
  let i18n = store.getters.tag.meta.i18n;
  title = router.$avueRouter.generateTitle(title, i18n);
  //根据当前的标签也获取label的值动态设置浏览器标题
  router.$avueRouter.setTitle(title);
});