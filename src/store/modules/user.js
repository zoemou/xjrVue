import {
  setToken,
  removeToken
} from "@/util/auth";
import {
  setStore,
  getStore,removeStore
} from "@/util/store";
import Cookies from "js-cookie";
import website from "@/config/website";
import {
  SSOUrl
} from "@/config/env.js";

var inFifteenMinutes = new Date(new Date().getTime() + website.tokenTime * 1000);
import {
  isURL,
  validatenull
} from "@/util/validate";
// import { encryption, deepClone } from '@/util/util'
import {
  deepClone
} from "@/util/util";
import webiste from "@/config/website";
import { getSubSystem } from "@/api/system/subSystem";
import { getSystemFormScheme } from "@/api/bpmn";
import {
  loginByUsername,
  loginByJava,
  getUserInfo,
  getMenu,
  getTopMenu,
  logout,
  refeshToken,
  loginByPhone,
  getUserPermission,
} from "@/api/user";
import i18n from "@/lang";

function addPath (ele,commit, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;

  if(ele.allowExpand==1){commit('SET_MENUCOLLAPSE',ele.moduleId)}

  const propsDefault = {
    label: propsConfig.label || "label",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
    target: propsConfig.target || "target",
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$");
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index";
  } else {
    ele[propsDefault.children] &&
      ele[propsDefault.children].forEach((child) => {
        if (!isURL(child[propsDefault.path])) {
          child[propsDefault.path] = `${ele[propsDefault.path]}${child[propsDefault.path] ? child[propsDefault.path] : "index"
            }`;
        }
        addPath(child,commit);
      });
  }
}

const user = {
  state: {
    userInfo: getStore({
      name: "userInfo"
    }) || {},
    userFrom: {
      username: null,
      password: null,
    },
    permission: {},
    roles: [],
    menuId: getStore({
      name: "menuId"
    }) || [],
    menu: getStore({
      name: "menu"
    }) || [],
    menuAll: getStore({
      name: "menuAll"
    }) || [],
    systemFormMenuAll: getStore({
      name: "systemFormMenuAll"
    }) || [],
    token: getStore({
      name: "token"
    }) || "",
    allSystem: getStore({
      name: 'allSystem'
    }) || [],
    systemId: getStore({
      name: 'systemId'
    }) || '',
    curIndexUrl: getStore({
      name: 'curIndexUrl'
    }) || '',
    markList:getStore({
      name: "markList"
    }) || "",
		menuCollapse:[],
    changeSystem:false
  },
  actions: {
    //?????????????????????
    LoginByUsername ({
      commit
    }, userInfo) {
      // const user = encryption({
      //   data: userInfo,
      //   type: 'Aes',
      //   key: 'avue',
      //   param: ['useranme', 'password']
      // });
      return new Promise((resolve) => {
        loginByUsername(userInfo).then((result) => {
          var res = result.data;
          

          // if (!res.data) {
          //   Message({
          //     message: res.msg + " (" + res.code + ")",
          //     type: "error",
          //     duration: 5 * 1000,
          //   });
          //   return false;
          // }

          const data = res.data;
          // const menu = data.Menus;

          SSOUrl.forEach(item => {
            // ???????????????iframe, ??????????????????
            const iframe = document.createElement("iframe");
            iframe.src = `${item}/localstorage.html`;
            iframe.style.display = 'none';
            document.body.append(iframe);

            // ??????postMessage()???????????????????????? 
            setTimeout(function () {
              let info = {
                userInfo: data.UserInfo,
                token: data.Token
              }
              iframe.contentWindow.postMessage(info, item);
            }, 2000);

            // ??????iframe 
            setTimeout(function () {
              iframe.remove();
            }, 4000);
          })

          commit("SET_TOKEN", data.Token);
          commit("SET_USERINFO", data.UserInfo);
          commit("DEL_ALL_TAG");
          commit("CLEAR_LOCK");
          commit('SET_SYSTEMID', '0');
          commit('SET_INDEX_URL', '');
          commit('SET_ALLSYSTEM', []);
          resolve(res.data);
          // localStorage.setItem('menu', JSON.stringify(data.Menus))

          //net?????????????????????
          if (webiste.netFlowableEnable) {

            setStore({
              name: "flowabletoken",
              content: data.FlowableToken
            });
          }
	
	// 		  setStore({
	// 			name: "language",
	// 			content: getStore({ name: 'language' })
	// 		  });
	
          
          setStore({
            name: "userInfo",
            content: data.UserInfo
          });

        });
      });
    },
    //?????????????????????
    LoginByPhone ({
      commit
    }, userInfo) {
      return new Promise((resolve) => {
        loginByPhone(userInfo).then((res) => {
          // const data = res.data.data;
          // commit('SET_TOKEN', data);
          // commit('DEL_ALL_TAG');
          // commit('CLEAR_LOCK');
          // resolve();
          const {
            data: {
              Token,
              UserInfo: {
                F_UserId,
                F_Mobile
              },
              FlowableToken
            },
            code,
            data: {
              UserInfo
            },
          } = res.data;
          if (code) return;
          commit("SET_TOKEN", Token);
          commit("SET_USERINFO", UserInfo);
          commit("DEL_ALL_TAG");
          commit("CLEAR_LOCK");
          commit('SET_SYSTEMID', '0');
          commit('SET_INDEX_URL', '');
          commit('SET_ALLSYSTEM', []);
          resolve(res.data);

          SSOUrl.forEach(item => {
            // ???????????????iframe, ??????????????????
            const iframe = document.createElement("iframe");
            iframe.src = `${item}/localstorage.html`;
            iframe.style.display = 'none';
            document.body.append(iframe);

            // ??????postMessage()???????????????????????? 
            setTimeout(function () {
              let info = {
                userInfo: data.UserInfo,
                token: data.Token
              }
              iframe.contentWindow.postMessage(info, item);
            }, 2000);

            // ??????iframe 
            setTimeout(function () {
              iframe.remove();
            }, 4000);
          })


          //net?????????????????????
          if (webiste.netFlowableEnable) {
            setStore({
              name: "flowabletoken",
              content: FlowableToken
            });
          }

			 //  setStore({
				// name: "language",
				// content: getStore({ name: 'language' })
			 //  });
          
          setStore({
            name: "userInfo",
            content: UserInfo
          });


        });
      });
    },
    GetUserInfo ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data;
            commit("SET_USERINFO", data.userInfo);
            commit("SET_ROLES", data.roles);
            // commit("SET_PERMISSION", data.permission);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    GetUserPermission ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserPermission()
          .then((res) => {
            const tempData = res.data.data;
            let ApiUserPermission = [];
            tempData.forEach((ele) => {
              const {
                moduleid,
                ...otherParams
              } = ele;
              ApiUserPermission.push([moduleid, otherParams]);
            });
            const userPermission = new Map(ApiUserPermission);
            commit("SET_PERMISSION", userPermission);
            resolve(userPermission);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    //??????token
    RefeshToken ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        refeshToken(state.refeshToken)
          .then((res) => {
            const data = res.data.data;
            commit("SET_TOKEN", data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // ??????
    LogOut ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit("SET_TOKEN", "");
          commit("SET_MENUID", {});
          commit("SET_MENUALL", []);
          commit("SET_MENU", []);
          commit("SET_TAG_LIST", []);
          //commit('SET_CATEGORY', 0);
          commit("SET_ROLES", []);
          commit("SET_PERMISSION", []);
          commit("DEL_ALL_TAG", []);
          commit("CLEAR_LOCK");
          commit('SET_SYSTEMID', '0');
          commit('SET_INDEX_URL', '');
          commit('SET_ALLSYSTEM', []);
          commit('SET_LG_MARK', []);
          removeStore({name: "language"});
          let defaultType=getStore({ name: "mainLanguage" }) || "zh-CN";		  
          //???????????????????????????
          const lgMarkList = getStore({ name: "lg-mark-" + defaultType });
          i18n.setLocaleMessage(defaultType, lgMarkList);
  
          setStore({
            name: 'userInfo',
            content: {}
          })
          removeToken();
          resolve();
        })
        
      });
    },
    //??????session
    FedLogOut ({
      commit
    }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        commit("SET_MENUID", {});
        commit("SET_MENUALL", []);
        commit("SET_MENU", []);



        //commit('SET_CATEGORY', 0);
        commit("SET_TAG_LIST", []);
        commit("SET_ROLES", []);
        commit("DEL_ALL_TAG");
        commit("CLEAR_LOCK");
		removeStore({name: "language"});
		  let defaultType=getStore({ name: "mainLanguage" }) || "zh-CN";
		  //???????????????????????????
		  const lgMarkList = getStore({ name: "lg-mark-" + defaultType });
		  i18n.setLocaleMessage(defaultType, lgMarkList);

        removeToken();
        resolve();
      });
    },
    GetTopMenu () {
      return new Promise((resolve) => {
        getTopMenu().then((res) => {
          const data = res.data.data || [];
          resolve(data);
        });
      });
    },
    GetSubSystem () {
      return new Promise((resolve) => {
        getSubSystem()
          .then(res => {
            if (res.data.code == 0) {
              let system = res.data.data || [];
              resolve(system);
            }
          })
      })
    },
    GetSystemFormMenuList () {
      return new Promise((resolve) => {
        getSystemFormScheme()
          .then(res => {
            if (res.data.code == 0) {
              let system = res.data.data || [];
              resolve(system);
            }
          })
      })
    },
    //??????????????????
    GetMenu ({
      state,
      commit,
      dispatch
    }, parentId) {
      return new Promise((resolve) => {
				dispatch('GetSubSystem').then(data => {
					//????????????????????????
					commit("SET_ALLSYSTEM", data);
					if(data.length>0){
						state.systemId=state.systemId||data[0].F_Id
						//??????????????????id
						commit("SET_SYSTEMID", state.systemId);
						getMenu(state.systemId).then((res) => {
							const menus = res.data.data;
							let menu =[]
							if(menus&&menus.length>0){
								menu = deepClone(menus);
							}
							menu.forEach((ele) => {
								addPath(ele,commit, true);
							});
							
							//???????????????
							commit("SET_MENUALL", menu);
							commit("SET_MENU", menu);
							
							dispatch('GetSystemFormMenuList').then(datas => {
								commit("SET_SYSTEM_FORM_MENU_ALL", datas);
							})
							resolve(menu);
						}); 
					}
				})        
      });
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      setStore({
        name: "token",
        content: state.token
      });
    },
    SET_INDEX_URL: (state, url) => {
      state.curIndexUrl = url;
      setStore({
        name: "curIndexUrl",
        content: state.curIndexUrl,
        type: "session"
      });
    },
    SET_FLOWABLE_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      setStore({
        name: "flowabletoken",
        content: state.token
      });
    },
    SET_MENUID (state, menuId) {
      state.menuId = menuId;
      setStore({
        name: "menuId",
        content: state.menuId,
        type: "session"
      });
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
	  setStore({
	    name: "userInfo",
	    content: state.userInfo
	  });
    },
    SET_MENUALL: (state, menuAll) => {
      state.menuAll = menuAll;
      setStore({
        name: "menuAll",
        content: state.menuAll
      });
    },
    SET_SYSTEM_FORM_MENU_ALL: (state, systemFormMenuAll) => {
      state.systemFormMenuAll = systemFormMenuAll;
      setStore({
        name: "systemFormMenuAll",
        content: state.systemFormMenuAll
      });
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
      setStore({
        name: "menu",
        content: state.menu
      });
      if (validatenull(menu)) return;
      //????????????????????????
      let menuAll = state.menuAll;
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];
      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.label == item2.label && item1.path == item2.path) {
            flag = false;
          }
        }
        if (flag) newMenu.push(item1);
      }
      state.menuAll = newMenu;
      setStore({
        name: "menuAll",
        content: state.menuAll,
        type: "session"
      });
    },
    SET_SYSTEMID: (state, systemId) => {
      state.systemId = systemId;
      if (validatenull(systemId)) return;
      setStore({
        name: "systemId",
        content: state.systemId,
        type: "session"
      });
    },
    SET_ALLSYSTEM: (state, systemList) => {
      let menuListObj = [{ 'F_Id': '0', 'F_Name': '?????????', 'F_IndexUrl': '','F_LgMarkCode':'MainSystem' }];

      if (systemList instanceof Array && systemList.length) {   //system instanceof Array
        //??????????????????????????????????????????????????????,???????????????????????????????????????
        menuListObj = [];
        systemList.map(item => {
          let _obj = {};
          _obj.F_Name = item.F_Name;
          _obj.F_Id = item.F_Id;
          _obj.F_IndexUrl = item.F_IndexUrl;
		  _obj.F_LgMarkCode = item.F_LgMarkCode;
          menuListObj.push(_obj);
        });
      }
      state.allSystem = menuListObj;

      if (!menuListObj.length) return;
      setStore({
        name: "allSystem",
        content: menuListObj,
        type: "session"
      });
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission;
    },
    SET_LG_MARK (state, markList) {
      state.markList = markList;
      setStore({ name: 'markList', content: state.markList })
    },
		SET_MENUCOLLAPSE: (state, menuCollapse) => {		
		  state.menuCollapse.push(menuCollapse);
		},
  },
};
export default user;