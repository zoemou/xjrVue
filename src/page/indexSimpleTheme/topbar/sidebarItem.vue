<template>
 <div style="white-space: nowrap;width: 100%;
   overflow-x: auto;
   overflow-y: hidden;
   height: 100%;">
   <div v-if="validatenull(menu)"
            class="avue-sidebar--tip" style="color: #ccc;
    line-height:62px;
    background: rgba(255,255,255,.1);
    width: 100px;
    text-align: center;">{{$t('menuTip')}}</div>
    <template v-for="item in menu">
      <li  class="el-menu-item"
      v-if="item.target=='open'" 
      @click="openBlankUrl(item)"
      >
       <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{generateTitle(item)}}</span>
      </li>
      <el-menu-item
        v-else-if="validatenull(item[childrenKey])&&item['target']!='expand' && vaildRoles(item)"
        :index="item[pathKey]"
        @click="open(item)"
        :key="item[labelKey]"
        :class="{'is-active':vaildAvtive(item)}"
      >
        <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{generateTitle(item)}}</span>
      </el-menu-item>
      <el-submenu
        v-else-if="(!validatenull(item[childrenKey])||item['target']=='expand')&&vaildRoles(item)"
        :index="item[pathKey]"
        :key="item[labelKey]"
      >
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title" :class="{'el-menu--display':collapse && first}">{{generateTitle(item)}}</span>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
           <li  class="el-menu-item"
            v-if="child.target=='open'" 
            @click="openBlankUrl(child)"
            >
            <i :class="child[iconKey]"></i>
              <span slot="title" :alt="child[pathKey]">{{generateTitle(child)}}</span>
            </li>
          <el-menu-item
            :index="child[pathKey]+cindex"
            @click="open(child)"
            :class="{'is-active':vaildAvtive(child)}"
            v-else-if="validatenull(child[childrenKey])&&child['target']!='expand'"
            :key="child[labelKey]"
          >
            <i :class="child[iconKey]"></i>
            <span slot="title">{{generateTitle(child)}}</span>
          </el-menu-item>
          <sidebar-item
            v-else
            :menu="[child]"
            :key="cindex"
            :props="props"
            :screen="screen"
            :collapse="collapse"
          ></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";

import Cookies from "js-cookie";
import { BI_URL } from "@/config/env";

export default {
  name: "sidebarItem",
  data() {
    return {
      config: config,
    };
  },
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["roles"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    targetKey() {
      return this.props.target || this.config.propsDefault.target;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        (item.meta || {}).i18n
      );
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    openBlankUrl(item){
       let routeData = this.$router.resolve({
        name: item[this.labelKey],
        query: { target: "open" },
        params: {},
      });
      //判断是否外链
      let reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
      if(!reg.test(routeData.href)){
        window.open(item.path, "_blank");
      }else{
        window.open(routeData.href, "_blank");
      }
    },
    open(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.$avueRouter.meta = item.meta;
      this.$router.$avueRouter.target = item.target;
      if (item.target == "open") {

        let routeData = this.$router.resolve({
          name: item[this.labelKey],
          query: { target: "open" },
          params: {},
        });
        window.open(routeData.href, "_blank");
      } else {

        
      const d ={
          path: this.$router.$avueRouter.getPath(
            {
              name: item[this.labelKey],
              src: item[this.pathKey],
            },
          ),
          query: item.query ,
        }

        
        this.$router.push({
          path: this.$router.$avueRouter.getPath(
            {
              name: item[this.labelKey],
              src: item[this.pathKey],
            },
          ),
          query: item.query ,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
	.el-submenu,.el-menu-item{
		display: inline-block;
		
	}
	.el-menu--horizontal div .el-submenu .el-submenu__title i,.el-menu--horizontal div .el-menu-item i{
		display: block;
		text-align: center;
		margin: 0px auto !important;
		padding-right: 0px!important;
	}
	.el-menu--popup div li .el-submenu__title i,.el-menu--popup div li .el-submenu__title span{
		display: inline-block!important;
	}
	.el-menu--popup div li .el-submenu__title i:nth-child(3){
		float: right;
	}
	.el-menu--popup div li .el-submenu__title span{
		padding-left: 10px;
	}
	::v-deep.el-submenu__title,::v-deep.el-menu-item{
		line-height: 0!important;
		height: auto!important;
	}
	
	.el-submenu__title span{
		vertical-align:baseline!important;
	}
	
	.el-menu--horizontal>div>li>i:nth-child(1){
		padding-top:7px;
		box-sizing: border-box;
	}
	.el-menu--horizontal>div>li>div>span:nth-child(2){
		font-size: 12px!important;
    color: rgba(255,255,255,0.7)!important;
	}
	.el-menu--horizontal>div>li>div>i:nth-child(1){
		padding-top:10px!important;
    color: rgba(255,255,255,0.7)!important;
	}
	
	.el-menu--horizontal>div>li>i:nth-child(1){
		padding-top:10px;
		box-sizing: border-box;
		line-height:10px!important;
    color: rgba(255,255,255,0.7)!important;
	}
	.el-menu--horizontal>div>li>span:nth-child(2){
		display: block;
		margin-top:28px;
		font-size: 12px!important;
		padding-bottom:12px;
		position: relative;
		top: -14px;
    color: rgba(255,255,255,0.7)!important;
	}
	.el-menu--horizontal>div>li>span,.el-menu--horizontal>div>li>i{
		line-height: 0px!important;
    color: rgba(255,255,255,0.7)!important;
	}
	
	.el-menu--horizontal .el-menu--popup li{
		display: block;
		text-align: left;
	}
	.el-menu > .el-submenu{
		height: 64px!important;
	}
	 .el-submenu__title i,.el-submenu__title span{
		color: rgba(255,255,255,0.7)!important;
	}
	.el-submenu__title span{
		display: block;
		height: 18px;
		
		line-height: 18px;
	}
	::v-deep .el-submenu__title i{
		color:rgba(255,255,255,0.7)!important;
	}
	.el-menu--popup-right-start>li>i{
		display: inline!important;
	}
	
	.el-menu--popup-right-start>li>span{
		padding-left: 10px!important;
	}
	::v-deep .el-icon-arrow-down{
		position: static!important;
		margin-right: 0px!important;
		display: block;
		text-align: center;
		padding-right:0!important;
		margin-top: 2px;
	}
	.el-submenu__title:hover i,.el-submenu__title:hover span{
		color: rgba(255,255,255,1)!important;
	}
	::-webkit-scrollbar-thumb{
		background-color:rgba(255,255,255,0.3);
	}
	.el-scrollbar__bar.is-horizontal{
		z-index:9;
		cursor: pointer;
	}
	.el-menu-item, ::v-deep .el-submenu__title{
		background-color: #0288ce!important;
	}
	.el-menu-item:hover,::v-deep .el-submenu__title:hover,.el-menu--horizontal > div > li:hover{
		background-color: #007bbb!important;
	}
	
	.el-menu--horizontal>div>li{
		height: 64px!important;
	}
	
	::v-deep .el-submenu__title{
		height: auto!important;
	}
	.el-menu--popup .el-menu-item.is-active,.avue-sidebar .el-menu-item.is-active{
		background-color: #0171ac!important;
	}
	.avue-sidebar .el-menu-item.is-active:before{
		width: 0px!important;
	}
	.el-menu--popup-bottom-start>div{
		line-height: 36px!important;
	}
  .el-menu--popup .el-menu-item i, .el-menu--popup .el-menu-item span, .el-menu--popup .el-menu-item:hover i, .el-menu--popup .el-menu-item:hover span{
    color:rgba(255,255,255,0.7)!important;
  }
</style>