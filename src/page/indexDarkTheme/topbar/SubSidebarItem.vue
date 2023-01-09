<template>
 <div id="menuDom" style="white-space: nowrap;width: 100%;
   overflow-x: auto;
   overflow-y: hidden;
   height: 100%;">
   <div v-if="validatenull(menu)"
				class="avue-sidebar--tip" style="color: #ccc;
    line-height: 87px;
    background: rgba(255,255,255,.1);
    width: 100px;
    text-align: center;">{{$t('menuTip')}}</div>
    <template v-for="(item,index) in menu">
      <li class="el-menu-item" v-if="item.target=='open'" @click="openBlankUrl(item)">
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
       class="sub-item-menu-box"
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
      domObj: {}
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
  mounted() {
    this.$nextTick(()=>{
      this.domObj = document.getElementById('menuDom');
      if (this.domObj.attachEvent) { // IE
        this.domObj.attachEvent('onmousewheel', this.mouseScroll)
      } else if (this.domObj.addEventListener) {
        this.domObj.addEventListener('mousewheel', this.mouseScroll, false)
      }
    })
  },
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
    mouseScroll(event){
      let detail = event.wheelDelta || event.detail
      let moveForwardStep = -1
      let moveBackStep = 1
      let step = 0
      step = detail > 0 ? moveForwardStep * 100 : moveBackStep * 100
      event.preventDefault() // 阻止浏览器默认事件
      this.domObj.scrollLeft = this.domObj.scrollLeft + step;
    },
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
          query: item.query,
        });
      }
    },
  },
};
</script>

<style scoped>
.el-submenu,.el-menu-item{
  display: inline-block;
}
.el-menu--horizontal div .el-submenu .el-submenu__title i,.el-menu--horizontal div .el-menu-item i{
  display: block;
  text-align: center;
  margin-right: 0px!important;
  padding-right: 0px!important;
  line-height: 10px;
}
/deep/.el-submenu__title,/deep/.el-menu-item{
  line-height: 0!important;
  height: auto!important;
}
.el-submenu__title span{
  vertical-align:baseline!important;
}
.el-menu--horizontal>div>li>i:nth-child(1){
  padding-top:10px;
  box-sizing: border-box;
  line-height:10px!important;
}
.el-menu--horizontal>div>li>span:nth-child(2){
  display: block;
  margin-top:28px;
  font-size: 12px!important;
  padding-bottom:12px;
  position: relative;
  top: -14px;
}
.el-menu--horizontal>div>li>div>i:nth-child(1){
  margin-top: 15px;
  padding-top:10px;
  box-sizing: border-box;
}
.el-menu--horizontal>div>li>div>span:nth-child(2){
  font-size: 12px!important;
}
.el-menu--horizontal>div>li>span,.el-menu--horizontal>div>li>i{
  line-height: 0px!important;
}
.el-menu > .el-submenu{
  height: 100px!important;
}
.el-submenu__title i,.el-submenu__title span{
  color: rgba(255,255,255,0.7)!important;
}
.el-submenu__title span{
  display: block;
  height: 18px;
  line-height: 26px;
}
/deep/ .el-submenu__title i{
  color:rgba(255,255,255,0.7)!important;
}
/deep/ .el-submenu__title{
  background-color: transparent!important;
  padding-bottom: 5px;
  height: auto!important;
}
/deep/ .el-submenu__title:hover,/deep/ .el-menu-item:hover{
  background-color: rgba(39,87,233,0.1)!important;
}
/*箭头图标样式*/
/deep/ .el-icon-arrow-down{
  position: static!important;
  margin-right: 0px!important;
  display: block;
  text-align: center;
  padding-right:0!important;
  margin-top: 2px;
}
/*下级菜单样式 写在公共样式 index.scss 里，全局样式 为提升优先级*/

/*操作区域变大 导航栏的二级操作框需要放大。当前需要移入或点击文字才会出现三级目录，需要把可操作按钮扩大到蓝色显示框（三级目录的可操作区域一样扩大到蓝色区域 )*/
.sub-item-menu-box{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}
/deep/ .sub-item-menu-box .el-menu--horizontal .el-menu--popup div{
	display: inline-block;
	width: auto!important;
}
</style>