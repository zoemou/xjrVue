<template>
	<div class="dark">
		<div class="avue-sidebar">
			<logo></logo>
			<div class="head-line-bg">
				<div class="head-line-box"></div>
			</div>
			<el-scrollbar style="height:100%;width: 100%; padding-left: 142px; box-sizing: border-box;">
				
			<div class="menu-bar">
				<ul class="el-menu-fixed">
					<!-- <li class="el-menu-item" @click="toDesktop">
						<el-tooltip class="item" effect="dark" content="我的桌面" placement="bottom">
							<i class="fa fa-desktop " style="color: #05ac87!important; font-size: 22px;"></i>
						</el-tooltip>
					</li> -->
					<li class="el-menu-item" @click="toIndex">
						<el-tooltip class="item" effect="dark" content="首页" placement="bottom">
							<i class="fa fa-home" style="color: #02a7f0!important; font-size: 24px;"></i>
						</el-tooltip>
					</li>
					<li class="el-menu-item" @click="toHot">
						<el-tooltip class="item" effect="dark" content="热门功能" placement="bottom">
							<i class="fa fa-gear" style="color: #761bca!important; font-size: 24px;"></i>
						</el-tooltip>
					</li>
				</ul>
				<el-menu unique-opened
					:default-active="nowTagValue"
					mode="horizontal"
					:show-timeout="200"
					:collapse="keyCollapse"
					collapse-transition="false"
					@open="openMenuFun">
				<sidebar-item :menu="menu"
							:screen="screen"
							first
							:props="website.menu.props"
							:collapse="keyCollapse"></sidebar-item>
							
			</el-menu>
			
			</div>
			</el-scrollbar>
		</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  inject: ["index"],
  data () {
    return {};
  },
  created () {
    this.index.openMenu(this.sysCategory)
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "menuId","sysCategory"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted () { },
  methods: {
	  	openMenuFun(index,indexPath){
	  	},
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
	.eveningTheme .avue-sidebar{
		background-color: #030028!important;
		padding:0px!important;
		height: 100px!important;
		position: relative!important;
		left: 0px!important;
		top:0px!important;
		z-index:1!important;
		padding:0px 400px 0px 0px!important;
		box-sizing:border-box!important;
	}
	/*菜单栏*/
	.el-dropdown-menu__item--divided:before, 
	.el-menu, .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
	.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
	.el-menu--horizontal>.el-submenu .el-submenu__title:hover {
		background-color:transparent;
	}
	.el-dropdown-menu__item--divided:before, 
	.el-menu, .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
	.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
	.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
		background-color: transparent !important;
	}
	.head-line-bg {
		width: 145px!important;
		height: 100px!important;
		position: fixed!important;
		z-index: 4!important;
	}
	.head-line-box {
		border-bottom: 1px solid rgba(39,87,233,1)!important;
		height: 1px!important;
		width: 169px!important;
		position: absolute!important;
		top: 49px!important;
		left: -13px!important;
		transform: rotate(-30deg)!important;
		-ms-transform: rotate(-30deg)!important;
		-webkit-transform: rotate(-30deg)!important;
		z-index: 4!important;
	}
	.el-menu--collapse .el-menu .el-submenu,
    .el-menu--popup {
      min-width: auto!important;
    }
    .el-menu--horizontal {
		border-right: none!important;
		width:calc(100% - 120px)!important;	
		left: 0px!important;
		height: 88px!important;
		box-sizing: border-box!important;
		border-top: 1px solid rgba(39,87,233,1)!important;
		top:8px!important;
    }
	.el-menu.el-menu--horizontal {
		border-bottom: none!important;
	}
	.menu-bar{
		display: flex;
	}
	.menu-bar .el-menu-fixed{
		display: flex;
		border-right: none!important;
		width: 130px!important;
		left: 0px!important;
		height: 88px!important;
		-webkit-box-sizing: border-box!important;
		box-sizing: border-box!important;
		border-top: 1px solid rgba(39,87,233,1)!important;
		top: 8px!important;
		margin: 8px 0px;
		padding-left: 0px;
	}
	.menu-bar .el-menu-fixed .el-menu-item{
		height: 80px !important;
		line-height: 80px !important;
		position: relative !important;
		-webkit-box-sizing: border-box !important;
		white-space: nowrap !important;
		list-style: none !important;
		background-color: transparent !important;
		vertical-align: inherit !important;
	}
	/*滚动条设置*/
	::-webkit-scrollbar{
		width: 10px;
		height: 10px;
	}
	::-webkit-scrollbar-track{
		border-radius: 10px;
		background-color: rgb(3,0,40);
	}
	::-webkit-scrollbar-thumb{
		border-radius: 10px;
		background-color: rgba(255,255,255,0.1);
	}
</style>
