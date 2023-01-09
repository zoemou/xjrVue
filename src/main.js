import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router/router";
import "./permission"; // 权限
import "./error"; // 日志
import "./cache"; //页面缓冲
import store from "./store";
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import Element from "element-ui";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import i18n from "./lang"; // Internationalization
import "./styles/common.scss";
// import '@/BI/styles/common.scss'
import basicBlock from "./components/basic-block/main";
import basicContainer from "./components/basic-container/main";

import MainFixed from './page/main/MainFixed';
import MainContent from './page/main/MainContent';

import crudCommon from "@/mixins/crud.js";

//弹窗移动
import './util/dialog'


//代码编辑器
import VueCodeMirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
Vue.use(VueCodeMirror);

//报表
// import "@grapecity/activereports/styles/ar-js-ui.css";
// import "@grapecity/activereports/styles/ar-js-designer.css"
// import "@grapecity/activereports-localization/dist/designer/zh-locale";

//打印组件
import Print from "vue-print-nb";
Vue.use(Print);

// import BaiduMap from 'vue-baidu-map'

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: '6soScnf1XkrNGCTM5nOC6NiYItfwlpkr'
// })

// import BaiduMap from "@/components/vue-baidu-map/components";
// Vue.use(BaiduMap, { ak: "Ed4bVc7VmxSbaNnWV2uS32TauSuWqxO9" }); //6soScnf1XkrNGCTM5nOC6NiYItfwlpkr



window.$crudCommon = crudCommon;

Vue.use(router);

Vue.use(VueAxios, axios);
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value),
});
Vue.use(window.AVUE, {
  i18n: (key, value) => i18n.t(key, value),
});

// Vue.use(AVUE,{ locale:'en' });


//注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.component("basicBlock", basicBlock);

Vue.component("MainFixed", MainFixed);
Vue.component("MainContent", MainContent);
// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;
//创建中央控制总线  Bus
Vue.prototype.$event = new Vue();

//每次更改版本清理缓存
const VUE_APP_VERSION = require('../package.json').version
const versionCache = localStorage.getItem("app_version")
if(VUE_APP_VERSION !== versionCache){
  localStorage.clear();
  localStorage.setItem("app_version",VUE_APP_VERSION);
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");


Element.Dialog.props.closeOnPressEscape.default = false

import Tinymce from "@/components/tinymce/index.vue";
Vue.component("tinymce", Tinymce);
import { loadScriptQueue } from "@/utils/loadScript";
const childAttrs = {
  file: "",
  dialog: ' width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false"',
};
window.addEventListener("message", init, false);

function buildLinks(links) {
  let strs = "";
  links.forEach((url) => {
    strs += `<link href="${url}" rel="stylesheet">`;
  });
  return strs;
}

function init(event) {
  const $previewApp = document.getElementById("app");
  if (event.data.type === "refreshFrame") {
    const code = event.data.data;
    const attrs = childAttrs[code.generateConf.type];
    let links = "";

    if (Array.isArray(code.links) && code.links.length > 0) {
      links = buildLinks(code.links);
    }

    $previewApp.innerHTML = `${links}<style>${code.css}</style><div id="preapp"></div>`;

    if (Array.isArray(code.scripts) && code.scripts.length > 0) {
      loadScriptQueue(code.scripts, () => {
        newVue(attrs, code.js, code.html, $previewApp);
      });
    } else {
      newVue(attrs, code.js, code.html, $previewApp);
    }
  }
}

function newVue(attrs, main, html, $previewApp) {
  main = eval(`(${main})`);

  main.template = `<div>${html}</div>`;

  new Vue({
    components: {
      child: main,
    },
    data() {
      return {
        visible: true,
        activeTab: 'web'
      };
    },
    i18n,
    template: `<div><el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="web">
                <span slot="label">
                  <i class="el-icon-document"/>
                  {{$t('webPreview')}}
                </span>
              </el-tab-pane>
              <el-tab-pane name="phone">
                <span slot="label">
                  <i class="el-icon-document"/>
                  {{$t('mobilePreview')}}
                </span>
              </el-tab-pane>
            </el-tabs>
            <div v-show="activeTab==='web'" id="editorweb" class="tab-editor"><child ${attrs}/></div>
	<div v-show="activeTab==='phone'" id="editorphone" class="tab-editor"><child ${attrs}/></div></div>`,
  }).$mount($previewApp.querySelector("#preapp"));
}

/* window['test'] = function(event,$previewApp){
  init(event,$previewApp);
} */

// import SelectUser from "@/components/selectUser/index.vue";
import SelectUser from "@/components/codeParser/SelectUser";
import FilterableDataList from '@/components/generator/clientComponents/FilterableDataList.vue';
import avueTableDataList from '@/components/generator/clientComponents/avueTableDataList';
import SelectArea from "@/components/codeParser/SelectArea";
import OpinionComonent from "@/components/codeParser/OpinionComonent";
import customUpload from "@/components/codeParser/Upload";
import customInformationBody from "@/components/codeParser/InformationBody";
import customAssoPopup from "@/components/codeParser/custom/table/AssoPopup";
import customAssoSelect from "@/components/codeParser/custom/table/AssoSelect";
import customMutiplePopup from "@/components/codeParser/custom/table/MutiplePopup";
import customInputTip from "@/components/codeParser/custom/table/InputTip";
import cascader from "@/components/codeParser/cascader";
import inputTreeLoad from "@/components/codeParser/InputTreeLoad";

Vue.component("xjr-select-user", SelectUser);
Vue.component("xjr-opinion-comonent", OpinionComonent);
Vue.component("avue-filterable-data-list", FilterableDataList);
Vue.component("avue-table-data-list", avueTableDataList);
Vue.component("xjr-custom-upload", customUpload);
Vue.component("avue-select-user", SelectUser);
Vue.component("avue-select-area", SelectArea);
Vue.component("avue-information-body", customInformationBody);
Vue.component("avue-asso-select", customAssoSelect);
Vue.component("avue-asso-popup", customAssoPopup);
Vue.component("avue-mutiple-popup", customMutiplePopup);
Vue.component("avue-input-tip", customInputTip);
Vue.component("xjr-cascader", cascader);
Vue.component("avue-load-tree", inputTreeLoad);

import title from "@/components/title/index";
Vue.component("xjr-title", title);
import CustomButton from "@/components/codeParser/CustomButton";
Vue.component("avue-custom-button", CustomButton);
// 自动隐藏控制台输出
if (
  window.location.hostname != "127.0.0.1" &&
  window.location.hostname != "localhost" &&
  window.location.hostname.split(".")[0] != "192"
) {
  console.log = function () { };
}
console.warn = function () { };
import { dateFormat, dayFormat } from '@/util/date'
Vue.prototype.mydateFormat = dateFormat
Vue.prototype.mydayFormat = dayFormat

import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
// import 'echarts/theme/macarons'

//开启调试
Vue.config.devtools = true;
