<template>
  <div class="avue-logo">
 <a style="display: block;  color: #fff; text-align: center;" target="_blank" :href="website.link"> 
	<!-- <img class="logo_white" style=" display: inline-block;" :src="website.logoImg"/> -->
	<img class="logo_white" style=" display: inline-block;" src="../../../public/img/newLogo.png"/>
    <!-- <transition name="fade">
      <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span>
    </transition> -->
	
   <!-- <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span class="avue-logo_title"
              key="1">{{website.indexTitle}} </span>
      </template>
    </transition-group> -->
	
	</a>
  </div>
  
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["website", "keyCollapse"])
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 208px;
  height: 64px;
  line-height: 64px;
  background-color: #07093E;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 999;//与桌面设计新增配置弹出框样式冲突，将z-index: 1024;改为了z-index: 999;
  &_title {
    display:inline-block ;
    text-align: center;
    font-weight: 300;
    font-size: 20px;
	color: #fff;
	padding-left: 8px;
    float: none;
  }
  .logo_white{
	 
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>