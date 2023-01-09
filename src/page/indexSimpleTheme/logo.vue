<template>
  <div class="avue-logo">
 <a style="display: block;  color: #fff;"  target="_blank" :href="website.link"> 
	<img class="logo_white" style=" display: inline-block;" src="/img/logo_white.png">
	
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
              key="1">{{website.indexTitle}}</span>
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
  background-color: #0288ce;
  font-size:15px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  &_title {
    display:inline-block ;
    text-align: center;
    font-weight: 600;
    font-size: 15px;
	color: #fff;
	padding-left: 8px;
  }
  .logo_white{
	float: left;
	padding-top:22px;
	padding-left: 56px;
	box-sizing: border-box;
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