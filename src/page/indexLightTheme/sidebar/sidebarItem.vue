<template>
  <div class="menu-wrapper">
    <div v-for="(item,itemIndex) in menu" :key="itemIndex">
      <div class="el-menu-item" v-if="item.target=='open'" @click="openBlankUrl(item)">
            <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{generateTitle(item)}}</span>
          </div>
      <el-menu-item
        v-else-if="validatenull(item[childrenKey])&&item['target']!='expand' && vaildRoles(item)"
        :index="item.moduleId"
        @click="open(item)"
        :key="item[labelKey]"
        :class="{'is-active':vaildAvtive(item)}"
      >
        <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{generateTitle(item)}}</span>
      </el-menu-item>
      <el-submenu
        v-else-if="(!validatenull(item[childrenKey])||item['target']=='expand')&&vaildRoles(item)"
        :index="item.moduleId"
        :key="item[labelKey]"
      >
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title" :class="{'el-menu--display':collapse && first}">{{generateTitle(item)}}</span>
        </template>
        <div v-for="(child,cindex) in item[childrenKey]" :key="cindex">
          <div class="el-menu-item" v-if="child.target=='open'" @click="openBlankUrl(child)">
              <i :class="child[iconKey]"></i>
            <span >{{generateTitle(child)}}</span>
          </div>
          <el-menu-item
            :index="child.moduleId"
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
        </div>
      </el-submenu>
    </div>
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
<style scoped>
  .el-menu--display,
  .el-menu--display+.el-submenu__icon-arrow {
      display: none;
  }
  .el-menu--vertical .el-submenu__title i,.el-menu--vertical  .el-menu-item i,.el-menu--vertical  .avue-sidebar .el-menu--vertical .el-menu-item span,.el-menu--vertical .avue-sidebar .el-menu--vertical .el-submenu__title span,.el-menu--vertical .el-submenu__title{
    color:#363f44!important;
  }
  .el-menu--vertical .el-menu{
    background-color: #fff!important;
  }
  .el-menu--vertical .el-menu--popup, .el-menu--vertical .el-menu-item i, .el-menu--vertical .el-menu--popup .el-menu--vertical .el-menu-item span,.el-menu--vertical .el-menu--popup .licollapseght .el-menu-item:hover i, .el-menu--vertical .el-menu--popup .el-menu--vertical .el-menu-item:hover span{
   /* color:#363f44!important; */
  }
  .el-menu--vertical .el-submenu__title:hover,.el-submenu .el-menu--vertical .el-menu-item:hover,.el-menu--vertical .el-menu li:hover{
    /* background-color: #f6f8f8!important; */
  }
  .el-menu--vertical .el-submenu__title i.el-submenu__icon-arrow{
    right: 10px!important;
    color: #6493ac!important;
  }
  .el-menu--vertical .menu_title{
    padding-left: 20px!important;
    font-size: 12px!important;
    color: #98a6ad!important;
    margin-top: 25px!important;
  }
  .el-menu--vertical .el-scrollbar__view{
    height: auto!important;
    margin-top: 80px!important;
  }
  .el-menu--vertical /deep/ .el-menu-item{
    height: 45px!important;
    line-height: 45px!important;
    background-color: #fff!important;
  }
  .el-menu--vertical /deep/ ..el-submenu__title{
    background-color: #fff!important;
  }
</style>

