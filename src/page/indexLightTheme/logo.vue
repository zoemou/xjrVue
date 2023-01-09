<template>
  <div class="avue-logo">
 <a style="display: block;"  target="_blank" :href="website.link"> 
	<img class="logo_dark"  src="/img/logo_white.png"/>
	
    <transition name="fade">
      <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span>
    </transition>
	
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span class="avue-logo_title"
              key="1">{{website.indexTitle}} </span>
      </template>
    </transition-group>
	
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

<style lang="scss">
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
  height: 56px;
  // line-height: 70px;
  font-size: 16px;
  overflow: hidden;
  box-sizing: border-box;
  color: #fff;
  z-index: 1024;
  background: #0775e6;
  &_title {
    display:inline-block ;
    font-weight:bolder;
    font-size: 16px;
	color: #fff;
	padding-left: 8px;
	float: left;
  }
 .logo_dark{
	 padding-left: 30px;
	 display: inline-block;
	 float: left;
	 margin-top: 20px;
	 
 }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
  
}
.avue--collapse .avue-logo .logo_dark{
	padding-left: 20px;
}
</style>