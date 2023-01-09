<template>
	<div class="light">
	<div class="avue-sidebar">
		
		<!-- <el-scrollbar style="height: calc(100% - 85px);padding-top: 56px;"> -->
			<div v-show="!keyCollapse">
				<p class="menu_title">Common menu</p>
				<ul class="el-menu">
					<li class="el-menu-item" @click="toIndex">
						<i class="fa fa-home" style="color: #4fc6fa!important; font-size: 18px;"></i>
						<span class="" slot="title"><b>首页</b></span>
					</li>
					<li class="el-menu-item" @click="toHot">
						<i class="fa fa-gear" style="color: #af84fa!important; font-size: 18px;"></i>
						<span class="" slot="title"><b>热门功能</b></span>
					</li>
				</ul>
				<p class="menu_title">Function menu</p>
			</div>
			<div v-show="keyCollapse">
				<ul class="el-menu">
					<li class="el-menu-item" @click="toDesktop">
						<i class="fa fa-desktop " style="color: #4ad9b9!important; font-size: 14px;"></i>
					</li>
					<li class="el-menu-item" @click="toIndex">
						<i class="fa fa-home" style="color: #4fc6fa!important; font-size: 18px;"></i>
					</li>
					<li class="el-menu-item" @click="toHot">
						<i class="fa fa-gear" style="color: #af84fa!important; font-size: 18px;"></i>
					</li>
				</ul>
			</div>
		<div v-if="validatenull(menu)"
			class="avue-sidebar--tip" style="color: #fff;
    font-weight: bold;
    padding-left: 65px;">{{$t('menuTip')}}</div>
		<el-menu unique-opened :default-openeds="menuCollapse"
				:default-active="nowTagValue"
				mode="vertical"
				:show-timeout="200"
				:collapse="keyCollapse">
			<sidebar-item :menu="menu"
						:screen="screen"
						first
						:props="website.menu.props"
						:collapse="keyCollapse"></sidebar-item>
		</el-menu>
		<!-- </el-scrollbar> -->
		<!-- <el-link :underline="false" icon="fa fa-exchange" style="text-align:center;width: 100%;line-height: 50px;color: #fff;" @click="changeSystem()">{{sysCategory==0?'切换至子系统':'切换至主系统'}}</el-link> -->

	</div>
  	</div>
</template>

<script>
import { mapGetters } from "vuex";

import sidebarItem from "./sidebarItem";
import {
  isURL,
  validatenull
} from "@/util/validate";
import webiste from "@/config/website";
function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;

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
          child[propsDefault.path] = `${ele[propsDefault.path]}${
            child[propsDefault.path] ? child[propsDefault.path] : "index"
          }`;
        }
        addPath(child);
      });
  }
}
export default {
  name: "sidebar",
  components: { sidebarItem },
  inject: ["index"],
  data () {
    return {};
  },
  created () {
    this.index.openMenu(this.sysCategory)
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "menuId", "sysCategory", "allSystem", "systemId", "tagList","menuCollapse"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted () {
	  setTimeout(()=>{
	    let haveMainSystem = this.allSystem.find(item=>{return item.F_Id == '0'});
	    if(!haveMainSystem && this.allSystem.length && this.systemId == '0'){
	      this.$store.commit('SET_SYSTEMID',this.allSystem[0].F_Id);
	      let url = this.allSystem[0].F_IndexUrl;
	      this.$store.commit('SET_INDEX_URL',url);
	      this.$event.$emit('noMainSystemExec');
	    }
	  },500);
  },
  methods: {
	toDesktop(){
		this.$router.push({path: '/wel/myDesktop'});
	},
	toIndex(){
		this.$router.push({path: '/wel/index'});
	},
	toHot(){
		this.$router.push({path: '/wel/hotFunc'});
	}
  }
};
</script>
<style scoped>
.light{
	height: 100%;
}
.light .avue-sidebar{
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
}
.light /deep/ .el-submenu__title i,
.light /deep/ .el-menu-item i{
	color:#fff !important;
}
.light /deep/ .el-menu{
	background-color: transparent !important;
	border-right: 0;
}
.light /deep/ .el-submenu__title:hover,
.light /deep/ .el-menu-item:hover{
	background-color: #698bfb !important;
	border-radius: 25px 0px 0px 25px;
}

.light .menu_title{
	padding-left: 30px!important;
	font-size: 12px!important;
	color: rgba(255,255,255,0.5)!important;
	margin-top: 25px!important;
}

.light /deep/ .el-menu-item{
	height: 50px!important;
	line-height: 50px!important;
	color: #fff;
	background-color: transparent!important;
	border-radius: 25px 0px 0px 25px;
}
.light /deep/.el-submenu__title i,
.light /deep/.el-menu-item i{
	padding-right: 5px;
}
/deep/ .el-menu-item [class^=icon-],/deep/ .el-submenu [class^=icon-]{
	width: 12px;
	font-size: 16px!important;
}
/deep/ .icon-caidan{
	margin-right: 5px;
}
</style>