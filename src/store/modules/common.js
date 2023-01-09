import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'
const common = {
  state :  {
    language: getStore({ name: 'language' }) || 'zh-CN',
    isCollapse: false, 
    isFullScren: false, //全屏
    isMenu: false,//顶部菜单
    isShade: false,
    screen: -1,
    isLock: getStore({ name: 'isLock' }) || false,
    showTag: true, //标签
    showDebug: false, //错误页面
    showCollapse: true, //
    showSearch: true, //搜索
    showLock: true,//锁屏
    showFullScren: true,//全屏
    showTheme: true,//换肤
    showMenu: true,//顶部菜单
    showColor: false,//换颜色
    showLanguage:true,//翻译
    showNotice : true,//通知栏
    colorName: getStore({ name: 'colorName' }) || '#409EFF',
    themeName: getStore({ name: 'themeName' }) || website.defaultTheme,
    lockPasswd: getStore({ name: 'lockPasswd' }) || '',
    website: website,
    //sysCategory:getStore({ name: 'sysCategory' }) || 0,
    isTopMenu: getStore({ name: 'isTopMenu' }) || false,
    showLoading:false,//全局loading
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    // SET_CATEGORY: (state, active) => {
    //   state.sysCategory = active;
    //   setStore({
    //     name: 'sysCategory',
    //     content: active
    //   })
    // },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_SHOW_DEBUG: (state, status) => {
      state.showDebug = status;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName;
      setStore({
        name: 'colorName',
        content: state.colorName,
      })
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
    SET_MENULAYOUT: (state, isTopMenu) => {
      state.isTopMenu = isTopMenu;
      setStore({
        name: 'isTopMenu',
        content: state.isTopMenu,
      })
    },
    SET_LOADING(state, data) {
      state.showLoading = data
    },
  }
}
export default common