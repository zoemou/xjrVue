<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top ref="top" />
    </div>

    <div class="avue-layout">
       <!-- 左侧导航栏 -->
      <div v-show="!isTopMenu" class="avue-left">
        <sidebar />
		<div class="avueLayoutResize" title="收缩侧边栏"> ⋮</div>
      </div>
	  
      <div class="avue-main" :class="{'avue-main--fullscreen':!isMenu}">
        <!-- 顶部标签卡 -->
        <div style="position: relative;overflow: hidden;height: 100%;">
			<tags />
			<transition name="fade-scale">
			  <search class="avue-view"
			          v-show="isSearch"></search>
			</transition>
			<!-- 主体视图层 -->
			<div style="height:calc(100% - 56px);overflow-y:auto;overflow-x:hidden;box-sizing: border-box;"
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
    </div>
    <!-- <el-footer class="avue-footer">
      <img src="/svg/logo.svg"
           alt=""
           class="logo">
      <p class="copyright">© 2018 Avue designed by smallwei</p>
    </el-footer> -->
    <div class="avue-shade"
         @click="showCollapse"></div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import search from "./search";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import { validatenull } from "@/util/validate";
import { calcDate } from "@/util/date.js";
import { getStore } from "@/util/store.js";
export default {
  components: {
    top,
    tags,
    search,
    sidebar
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
	this.dragControllerDiv()
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
    },
	dragControllerDiv() {
	    var resize = document.getElementsByClassName('avueLayoutResize');
	    var left = document.getElementsByClassName('avue-left');		
	    var box = document.getElementsByClassName('avue-main');
		// var contain=document.getElementsByClassName('avue-contail');
		// let type='default';
		// for(var i = 0;i <contain.length;i++){
		// 　　if(contain[i].classList.contains('avue--collapse')==true){
		// 	  type='collapse'
		//     }		
		// }
		
	    for (let i = 0; i < resize.length; i++) {
	        // 鼠标按下事件
	        resize[i].onmousedown = function (e) {
	            //颜色改变提醒
	            resize[i].style.background = '#818181';
	            var startX = e.clientX;
	            resize[i].left = resize[i].offsetLeft;
	            // 鼠标拖动事件
	            document.onmousemove = function (e) {
	
	                var endX = e.clientX;
	                var moveLen = resize[i].left +(endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
	                
					//if(type=='default'){
						if (moveLen < 208) moveLen = 208; // 左边区域的最小宽度
					// }else{
					// 	if (moveLen < 60) moveLen = 60; // 左边区域的最小宽度
					// }
	                
	                //if (moveLen > 800) moveLen = 800; //左边区域最大宽度为800px
	
	                resize[i].style.left = moveLen+'px'; // 设置左侧区域的宽度
	
	                //for (let j = 0; j < left.length; j++) {
	                    left[i].style.width = moveLen + 'px';
	                    box[i].style.paddingLeft= moveLen+5+'px'; // 右边区域的宽度
	                //}
	            };
	            // 鼠标松开事件
	            document.onmouseup = function (evt) {
	                //颜色恢复
	                resize[i].style.background = '#000';
	                document.onmousemove = null;
	                document.onmouseup = null;
	                resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
	            };
	            resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
	            return false;
	        };
	    }
	}
  }
};
</script>
<style scoped>
	/*拖拽区div样式*/
	.avueLayoutResize {
		cursor: col-resize;
		position: relative;
		bottom: 45%;
		background-color: #000;
		border-radius: 10px;
		margin-top: -50px;
		width: 5px;
		height: 50px;
		line-height: 50px;
		font-size:16px;
		color: white;
		left: 208px;
	}
	/*拖拽区鼠标悬停样式*/
	.avueLayoutResize:hover {
		color: #444444;
	}
	.avue--collapse .avueLayoutResize{
		display: none;
	}
</style>