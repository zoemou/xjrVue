/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router';
import i18n from "@/lang";
import {
  serialize
} from '@/util/util'
import {
  getToken
} from '@/util/auth'
import {
  Message
} from 'element-ui'
import website from '@/config/website';
import {
  baseUrl, flowableUrl
} from '@/config/env'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
import {
  getStore
} from "@/util/store";

axios.defaults.timeout = 20000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
// axios.defaults.withCredentials = true;
// NProgress Configuration
// NProgress.configure({
//   showSpinner: false
// });
//设置头部
axios.defaults.headers['post']['Content-Type'] = 'application/json';
axios.defaults.headers['put']['Content-Type'] = 'application/json';
axios.defaults.headers['patch']['Content-Type'] = 'application/json';
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  // NProgress.start() // start progress bar
  // 展示 loading 效果
  const unShowLoading = ['xjr-oa-message', 'unread-count']
  const urlName = config.url.split('/').pop()
  if (unShowLoading.indexOf(urlName) === -1) {
    store.commit('SET_LOADING', true)
  }
  const meta = (config.meta || {});

  //用于BI替换接口地址的值  请勿删除
  if (config.url.indexOf("${BASE_URL}") > -1) {
    config.url = config.url.replace("${BASE_URL}", baseUrl)
  }

  var menuArry = getStore({ name: 'menuAll' })

  config.headers['ModuleId'] = findMenu(menuArry, window.location.pathname.replace(baseUrl, ''))
  config.headers["LgType"] = getStore({ name: "language" }) || "zh-CN";

  const isToken = meta.isToken === false;

  if ((getToken() || getStore({ name: 'token' })) && !isToken) {
    //用于工作流token替换接口地址的值  请勿删除
    if (config.url.search("workflow-") > -1 && website.netFlowableEnable) {
      config.url = config.url.replace(baseUrl, flowableUrl) //工作流 替换请求地址
      config.headers[website.Authorization] = 'Bearer ' + getStore({ name: 'flowabletoken' }) // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    } else {
      config.headers[website.Authorization] = 'Bearer ' + (getToken() ?? getStore({ name: 'token' })) // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    // axios.defaults.headers['Content-Type'] = 'application/json';
    config.data = serialize(config.data);
  }
  return config
}, error => {

  return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
  // NProgress.done();
  // 关闭 loading 效果
  store.commit('SET_LOADING', false)
  const status = Number(res.data.code) || 0;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.msg || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 10401) store.dispatch('LogOut').then(() => router.push({
    path: '/login'
  }));
  // 如果请求为非0否者默认统一处理
  if (status !== 0 && status !== 200) {
    if (message == 'Task id is null') { //表单发起流程：流程发起后，错误提醒
      Message({
        message: i18n.t('hintFlowInvalid'),
        type: 'error'
      })
    } else {
      Message({
        message: message,
        type: 'error'
      })
    }

    return Promise.reject(res)
  }
  return res;
}, error => {
  // NProgress.done();
  // 关闭 loading 效果
  store.commit('SET_LOADING', false)
  Message({
    message: i18n.t('hintRequestTimeout'),
    type: 'error'
  })
  return Promise.reject(new Error(error));
})

function findMenu(arry = [], url) {
  if (!arry || !Array.isArray(arry)) return
  let moduleId = '';
  arry.forEach(item => {
    if (moduleId) return;

    if (item.path === url) {
      moduleId = item?.meta?.moduleid
    }
    else {
      let id = findMenu(item?.children, url)
      if (id)
        moduleId = id
    }

  })
  return moduleId
}

export default axios;