<template>
  <div class="simple">
    <div class="avue-sidebar">
      <logo></logo>
      <el-scrollbar style="height:100%;width: 100%;">
        <el-menu unique-opened
                :default-active="nowTagValue"
                mode="horizontal"
                :show-timeout="200"
                :collapse="keyCollapse">
          <sidebar-item :menu="menu"
                        :screen="screen"
                        first
                        :props="website.menu.props"
                        :collapse="keyCollapse"></sidebar-item>
        </el-menu>
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
  methods: {}
};
</script>
<style lang="scss" scoped>
  .simple{
    .avue-sidebar{
      background-color: #0288ce!important;
      padding:0px!important;
      height: 64px;
      position: relative;
      left: 0px;
      top:0px;
      z-index:1;
      padding:0px 388px 0px 0px!important;
      box-sizing:border-box;
    }
    .el-menu--horizontal{
      height: 100%;
      width: 100%;
    }
    .el-scrollbar{
      overflow: visible!important;
    }
    .el-scrollbar__wrap{
      width: 100%;
      overflow-y: hidden;
    }
    ::v-deep .el-scrollbar__view{
      width: 100%;
    }
  }
  .el-dropdown-menu__item--divided:before, .el-menu, .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      background-color:transparent;
  }
  .el-dropdown-menu__item--divided:before, .el-menu, .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover{
      background-color: transparent !important;
  }
</style>
