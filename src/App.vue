<template>
  <div id="app">
    <router-view v-if="isRouterAlive&&$route.path!='/'" />
	<div class="avue-home" v-else>
		<div class="avue-home__main">
			<img class="avue-home__loading" src="/svg/loading-spin.svg" alt="loading">
			<div class="avue-home__title">
				{{$t('loadingTranslation')}}
			</div>
			<div class="avue-home__sub-title">  
				{{$t('pleaseWaitPatiently')}}
			</div>
		</div>
		<div class="avue-home__footer"></div>
	</div>
  <loading :show="loadingShow" v-if="isRouterAlive&&$route.path!='/'"/>
	<!-- <keep-alive>
	    <router-view v-if="$route.meta.keepAlive">
	    </router-view>
	</keep-alive>
	
	<router-view v-if="!$route.meta.keepAlive">
	</router-view> -->
  </div>
</template>

<script>
import i18n from "./lang";
import { getStore } from "@/util/store";
// import jp from './lang/jp'
import { setStore } from "./util/store";
import { getLanguageType } from "@/api/language/type";
import { getTranslationByType,getDefaultLgType } from "@/api/language/translation";
import Loading from '@/components/loading'
// import defaultLg from "@/lang/zh-CN"
var Avue = window.AVUE;
export default {
  name: "app",
  components:{ Loading },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
	  getDefaultLgType().then(async res => {
		  let defaultType=res?.data?.data?.F_Code || "zh-CN";
		  setStore({
		    name: "mainLanguage",
		    content: defaultType
		  });
		  //如果没有选择过翻译 默认使用中文
		  i18n.locale = getStore({ name: "language" }) || defaultType;
		  //设置vuex 缓存所选语言类型
		  this.$store.commit("SET_LANGUAGE", i18n.locale);
		  const lgMarkList = getStore({ name: "lg-mark-" + i18n.locale });
		  //判断是否有翻译缓存
		  if (!lgMarkList) {
		  		await this.getLanguageType();
		  } else {
		  		i18n.setLocaleMessage(i18n.locale, lgMarkList);
		  }
		  
	  })
	  
	  
    


    //根据当前所选语言  获取翻译
    // const local = await getTranslationByType(i18n.locale);
    // const elLocal = await import("element-ui/lib/locale/lang/" + i18n.locale);

    // const allLg = Object.assign(local.data.data,defaultLg)
    //   let obj = {
    //       ...allLg,
    //       ...elLocal.default,
    //       ...Avue.locale[i18n.locale]
    //     };
    //     i18n.setLocaleMessage(i18n.locale, obj);

    // this.reload()

    // i18n.locale =  "zh";
    // this.$store.commit("SET_LANGUAGE", i18n.locale);
    // this.reload()

    //   // i18n.setLocaleMessage('jp',jp)
    //   // setStore({name:'language',content : 'jp'});
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    async getLanguageType() {
      let res = await getLanguageType();
      let data = res.data.data || [];
      for (let i = 0; i < data.length; i++) {
        let it = data[i];

        const elLocal = await import("element-ui/lib/locale/lang/" + it.F_Code);

        const local = await getTranslationByType(it.F_Code);
		console.log("ttttttttttttttttttt",local)
        const langObj = local.data.data;

        // const allLg = Object.assign(local.data.data,defaultLg)
        let obj = {
          ...JSON.parse(langObj),
          ...elLocal.default,
          //...Avue.locale[i18n.locale]
        };

        setStore({ name: "lg-mark-" + it.F_Code, content: obj });
        if (i18n.locale == it.F_Code) i18n.setLocaleMessage(i18n.locale, obj);
      }
    },
    beforeunloadHandler (e) {
      if(!this.$store.state.user.changeSystem)  {
        console.log(e,"beforeunloadHandler",this.$store.state.user.changeSystem );
        e = e || window.event
        if (e) {
          e.returnValue = '关闭提示'
        }
        return '关闭提示'
      }
      
    },
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.beforeunloadHandler)
  },
  computed: {
    loadingShow() {
      return this.$store.state.common.showLoading
    },
  }
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto; // 代码生成器iframe滚动
}


/*固定分页 样式重写 （page-fixed div下的分页）*/
.page-fixed .avue-crud__pagination {
  display: flex;
  justify-content: flex-end;
  // position: fixed;
  text-align: center;
  // bottom: 10px;
  // right: 20px;
  // width: calc(100% - 650px);
  background-color: #fff;
  z-index: 1000;
  padding: 0;
  padding: 0;
}
.page-fixed .avue-crud__pagination .el-pager {
  font-weight: 400;
}
.page-fixed .avue-crud__pagination .el-pagination__total {
  margin-top: 2px;
}
.page-fixed .el-pagination__editor.el-input .el-input__inner {
  height: 24px;
  line-height: 24px;
}
.page-fixed
  .avue-crud__pagination
  .el-pagination
  .el-select
  .el-input
  .el-input__inner {
  height: 26px;
  line-height: 26px;
}
/* 表单鉴权页面 需要自适应排列 */
.custom-form .el-form {
  display: flex;
  flex-wrap: wrap;
  // min-height: 400px;
}
.custom-form .el-select {
  width: 100%;
}
.custom-form .manager-box {
  display: flex;
}
.custom-form .ml-10 {
  margin-left: 10px;
}
/* 系统表单 iframe弹窗 工作流相关 */
.work-form-dialog {
  width: 100% !important; /*因为media.scss中强制了98% */
}
.work-form-dialog .is-fullscreen {
  width: 100% !important; /*因为media.scss中强制了98% */
}
.work-form-dialog .el-dialog__header {
  display: none; /*系统表单 不需要header */
}
// 因为avue 打包css 中 强制左边 right: 25px !important; 导致计数器 显示样式不对
.is-error .el-input-number__decrease,
.is-error .el-input-number__increase,
.is-success .el-input-number__decrease,
.is-success .el-input-number__increase {
  right: 1px !important;
}
.form-span-button {
  color: #409eff;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 8px;
  font-size: 12px;
  border-radius: 3px;
}
.avueFormNoLable .el-form-item__content{
    margin-left:0 !important;
}
.avueFormNoInputBorder .el-input--small input{
  border: none !important;
}
.avueFormNoInputBorder .el-textarea__inner{
  border: none !important;
}
.avueFormNoInputBorder .el-input-number__decrease{
  border: none !important;
  background-color: transparent !important;;
}
.avueFormNoInputBorder .el-input-number__increase{
  border: none !important;
  background-color: transparent !important;;
}
.avueFormNoInputBorder .el-input.is-disabled .el-input__inner{
  background-color: transparent !important;
}
.avueFormNoInputBorder .el-color-picker__trigger{
  border: none !important;
}
.avueFormNoInputBorder .el-input-group__append{
   background-color: transparent !important;
   border: none !important;
}
.avueFormNoInputBorder  .el-date-editor.el-input__inner{
   border: none !important;
}
.subTableForm .el-table .cell{
  text-align: left;
  display: block;
}
.subTableForm .el-table .el-textarea{
  height: 120px;
}
.custom-form .avue-dynamic .el-table__empty-block{
  border-bottom: 1px solid #EBEEF5;
}
.custom-form{
  padding: 10px;
}
.custom-form .avue-form .el-row{
  width: 100%;
}
.avueFormTitleNoWrap .el-table th>.cell{
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
}
.avueFormTitleWrap .el-table th>.cell{
    overflow: hidden;
    text-overflow: clip;
    white-space: pre-wrap;
}
.avueFormNoBorder .avue-crud .el-table__row td{
  border-right: none !important;
}
.avueFormNoBorder .avue-crud .el-table th.is-leaf{
  border-right: none !important;
}

.avueFormNoIndex .el-table__row{
   td:first-child {
     .cell{
       span{
         div{
            visibility:hidden;
          }
       }
     }
   }
}

.popper-box {
 max-width: 50%;
}
.table-row-box .el-form-item__label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block !important;
  width: 200px !important;
  text-align: left;
}
.avue-form .el-collapse-item__wrap{
  border:none;
}

.avue-sidebar{
  scrollbar-color:#2b3b4b #001529 ; /* 第一个方块颜色，第二个轨道颜色(用于更改火狐浏览器样式) */
	scrollbar-width: thin;
  /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
  -ms-overflow-style: none;
}
// learunui.css滚动条样式有冲突 ，重置回来
::-webkit-scrollbar{
	width: 7px;
	height: 7px;
}
::-webkit-scrollbar-thumb{
background-clip: border-box;
}

.main-wrap-container .avue-crud__search{
  display: block !important;
  height: 30px;
}
.main-no-wrap-container .avue-crud__search{
  display: block !important;
  height: 0;
}

 /* 左侧菜单按钮超出隐藏 */
 .avue-crud__left .el-button--small span{
  display: inline-block;
  max-width:80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.avue-crud .avue-crud__left .el-button{
  z-index: 8;//比搜索层级高一点
}

// .custom-loading{
//   font-size:36px;
// }
// 编辑器的禁用样式

.tinymce-box[readonly="readonly"] + .tox .tox-edit-area__iframe[allowtransparency="true"]{
  background-color: #F5F7FA
}

.form-button-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
