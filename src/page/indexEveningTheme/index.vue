<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top ref="top" />
       <topbar v-show="isTopMenu" />
    </div>

    <div class="avue-layout">
      <div class="avue-main"
           :class="{'avue-main--fullscreen':!isMenu}">
        <!-- 顶部标签卡 -->
        <tags />
        <transition name="fade-scale">
          <search class="avue-view"
                  v-show="isSearch"></search>
        </transition>
        <!-- 主体视图层 -->
        <div style="height:calc(100% - 57px);overflow-y:auto;overflow-x:hidden;box-sizing: border-box;"
             id="avue-view"
             v-show="!isSearch">
          <keep-alive>
            <router-view class="avue-view"
                         v-if="$route.meta.keepAlive" style="height:100%;" />
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.keepAlive" style="height:100%;" />
        </div>
      </div>
    </div>
    <div class="avue-shade"
         @click="showCollapse"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "../index/tags";
import search from "../index/search";
import top from "./top/";
import topbar from "./topbar/"
import admin from "@/util/admin";
import { validatenull } from "@/util/validate";
import { calcDate } from "@/util/date.js";
import { getStore } from "@/util/store.js";
export default {
  components: {
    top,
    tags,
    search,
    topbar
  },
  name: "index",
  provide () {
    return {
      index: this
    };
  },
  data () {
    return {
      //搜索控制
      isSearch: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: ""
    };
  },
  created () {
    //实时检测刷新token
    this.refreshToken();
  },
  mounted () {
    this.init();
  },
  computed: mapGetters(["isMenu", "isLock", "isCollapse", "website", "menu","isTopMenu"]),
  props: [],
  methods: {
    showCollapse () {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init () {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    //打开菜单
    openMenu (item) { //parentId	
      this.$store.dispatch("GetMenu", item).then(data => {
        if (data.length !== 0) {
			
          this.$router.$avueRouter.formatRoutes(data, true);
        }
        //当点击顶部菜单做的事件
        // if (!this.validatenull(item)) {
        //   let itemActive = {},
        //     childItemActive = 0;
        //   //vue-router路由
        //   if (item.path) {
        //     itemActive = item;
        //   } else {
        //     if (this.menu[childItemActive].length == 0) {
        //       itemActive = this.menu[childItemActive];
        //     } else {
        //       itemActive = this.menu[childItemActive].children[childItemActive];
        //     }
        //   }
        //   this.$store.commit('SET_MENUID', item);
        //   this.$router.push({
        //     path: this.$router.$avueRouter.getPath({
        //       name: itemActive.label,
        //       src: itemActive.path
        //     }, itemActive.meta)
        //   });
        // }

      });
    },
    // 10分钟检测一次token
    refreshToken () {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "token",
          debug: true
        }) || {};
        const date = calcDate(token.datetime, new Date().getTime());
        if (validatenull(date)) return;
        if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
            .dispatch("RefeshToken")
            .then(() => {
              this.refreshLock = false;
            })
            .catch(() => {
              this.refreshLock = false;
            });
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.avue-header{
	padding-left: 308px!important;
}
.avue-main{
	padding-left: 0!important;
}
.avue-layout{
	height: calc(100% - 100px);
}
</style>	