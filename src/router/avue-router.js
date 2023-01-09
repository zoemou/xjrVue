import { getStore } from "@/util/store";
import website from "@/config/website";

//获取主题名字
let themeName = getStore({ name: "themeName" }) || website.defaultTheme;

let RouterPlugin = function () {
  this.$router = null;
  this.$store = null;
};
RouterPlugin.install = function (vue, option = {}) {
  this.$router = option.router;
  this.$store = option.store;
  this.$vue = new vue({
    i18n: option.i18n
  });

  function isURL(s) {
    if (s.includes("html")) return true;
    return /^http[s]?:\/\/.*/.test(s);
  }

  function objToform(obj) {
    let result = [];
    Object.keys(obj).forEach(ele => {
      result.push(`${ele}=${obj[ele]}`);
    });
    return result.join("&");
  }
  this.$router.$avueRouter = {
    //全局配置
    $website: this.$store.getters.website,
    routerList: [],
    group: "",
    meta: {},
    safe: this,
    // 设置标题
    setTitle: title => {
      const defaultTitle = this.$vue.$t("title");
      title = title ? `${title}——${defaultTitle}` : defaultTitle;
      document.title = title;
    },
    closeTag: value => {
      let tag = value || this.$store.getters.tag;
      if (typeof value === "string") {
        tag = this.$store.getters.tagList.filter(ele => ele.value === value)[0];
      }
      this.$store.commit("DEL_TAG", tag);
    },
    generateTitle: (title, key) => {
      if (!key) return title;
      const hasKey = this.$vue.$t(key);
      // const hasKey = this.$vue.$t('route.' + key)

      if (hasKey) {
        // $t :this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = this.$vue.$t(key);
        // const translatedTitle = this.$vue.$t('route.' + key)

        return translatedTitle;
      }
      return title;
    },
    //处理路由
    getPath: function (params = {}, meta = {}) {
      let { src } = params;
      let result = src || "/";
      if (isURL(src)) {
        result = `/myiframe/urlPath?${objToform(Object.assign(meta, params))}`;
        // result = `/myiframe/urlPath`
      }
      return result;
    },
    //正则处理路由
    vaildPath: function (list, path) {
      let result = false;
      list.forEach(ele => {
        if (new RegExp("^" + ele + ".*", "g").test(path)) {
          result = true;
        }
      });
      return result;
    },
    //设置路由值
    getValue: function (route) {
      let value = "";
      if (route.query.src) {
        value = route.query.src;
      } else {
        value = route.path;
      }
      return value;
    },
    //动态路由
    formatRoutes: function (aMenu = [], first) {
      const aRouter = [];
      const propsConfig = this.$website.menu.props; //获取到路由  数据结构 的字段
      const propsDefault = {
        label: propsConfig.label || "label",
        path: propsConfig.path || "path",
        icon: propsConfig.icon || "icon",
        children: propsConfig.children || "children",
        meta: propsConfig.meta || "meta",
        target: propsConfig.target || "target"
      };

      if (aMenu.length === 0) return;
      for (let i = 0; i < aMenu.length; i++) {

        const oMenu = aMenu[i];
        //oMenu[propsDefault.path]=oMenu[propsDefault.path]?oMenu[propsDefault.path]:'';
        if (this.routerList.includes(oMenu[propsDefault.path])) break;
        let path = (() => {
          if (first) {
            //如果是第一次进入循环
            //第一级路由 默认替换掉/index
            return oMenu[propsDefault.path] != null
              ? oMenu[propsDefault.path].replace("/index", "")
              : "";
          } else {
            return oMenu[propsDefault.path];
          }
        })(),
          component = oMenu.component,
          name = oMenu[propsDefault.label],
          icon = oMenu[propsDefault.icon],
          children = oMenu[propsDefault.children],
          target = oMenu[propsConfig.target] || "",
          meta = oMenu[propsDefault.meta] || {};

        meta = Object.assign(
          meta,
          (function () {
            if (option.keepAlive === true) {
              return {
                keepAlive: true
              };
            }
          })()
        );
        const isChild = children && children.length !== 0;
        const oRouter = {
          path: path,
          component(resolve) {
            // 判断是否为首路由
            if (first) {
              switch (themeName) {
                case "default":
                  require(["../page/index"], resolve);
                  break;
                case "lightTheme":
                  require(["../page/indexLightTheme"], resolve);
                  break;
                case "darkTheme":
                  require(["../page/indexDarkTheme"], resolve);
                  break;
                case "simpleTheme":
                  require(["../page/indexSimpleTheme"], resolve);
                  break;
                case "eveningTheme":
                  require(["../page/indexEveningTheme"], resolve);
                  break;
              }
              return;
              // 判断是否为多层路由
            } else if (isChild && !first) {
              switch (themeName) {
                case "default":
                  require(["../page/index/layout"], resolve);
                  break;
                case "lightTheme":
                  require(["../page/indexLightTheme/layout"], resolve);
                  break;
                case "darkTheme":
                  require(["../page/indexDarkTheme/layout"], resolve);
                  break;
                case "simpleTheme":
                  require(["../page/indexSimpleTheme/layout"], resolve);
                  break;
                case "eveningTheme":
                  require(["../page/indexEveningTheme/layout"], resolve);
                  break;
              }
              //require(['../page/index/layout'], resolve)
              return;
              // 判断是否为最终的页面视图
            } else {
              require([`../${component}.vue`], resolve);
            }
          },
          name: name,
          icon: icon,
          meta: meta,
          target: target,
          redirect: (() => {
            if (!isChild && first && !isURL(path)) return `${path}/index`;
            else return "";
          })(),
          // 处理是否为一级路由
          children: !isChild
            ? (() => {
              if (first) {
                if (!isURL(path)) oMenu[propsDefault.path] = `${path}/index`;
                return [
                  {
                    component(resolve) {
                      require([`../${component}.vue`], resolve);
                    },
                    icon: icon,
                    name: name,
                    meta: meta,
                    target: target,
                    path: "index"
                  }
                ];
              }
              return [];
            })()
            : (() => {
              return this.formatRoutes(children, false);
            })()
        };
        aRouter.push(oRouter);
      }
      if (first) {
        if (!this.routerList.includes(aRouter[0][propsDefault.path])) {
          this.safe.$router.addRoutes(aRouter);
          this.routerList.push(aRouter[0][propsDefault.path]);
        }
      } else {
        return aRouter;
      }
    }
  };
};
export default RouterPlugin;
