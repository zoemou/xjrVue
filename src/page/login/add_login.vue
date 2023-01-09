<template>
	
  <div class="login-container">
	 
    <top-color v-show="false"></top-color>
	
	
    <div class="login-weaper animated bounceInDown">
		<div class="login_logo">
			<img src="/img/login_logo.png"/>
		</div>
		
		
      <div class="login-left">
       <!-- <div class="login-time">
          {{time}}
        </div> -->
       <div class="login_pic"> <img class="img" src="/img/login_pic.png"alt=""></div>
        
      </div>
      <div class="login-border">
        <div class="login-main">
         <!-- <h4 class="login-title">
            {{ $t('login.title') }}{{website.title}}
            
          </h4> -->
          <userLogin v-if="activeName==='user'"></userLogin>
          <codeLogin v-else-if="activeName==='code'"></codeLogin>
         		 
		 
		  <a class="f_passworld" href="#">忘记密码？</a>
		  		   
        </div>	
      </div>	  
	 <div class="login_foot">{{website.copyright}} </div>
	 <div class="login_rwm">
		 <a href=""><img src="img/login_rwm.png"></a>
	 </div>		
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import thirdLogin from "./thirdlogin";
import faceLogin from "./facelogin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date";
import { validatenull } from "@/util/validate";
import topLang from "@/page/index/top/top-lang";
import topColor from "@/page/index/top/top-color";
export default {
  name: "login",
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
    faceLogin,
    topLang,
    topColor
  },
  data () {
    return {
      time: "",
      activeName: "user"
    };
  },
  watch: {
    $route () {
      const params = this.$route.query;
      this.socialForm.state = params.state;
      this.socialForm.code = params.code;
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${
            this.socialForm.state === "WX" ? "微信" : "QQ"
            }登录中,请稍后。。。`,
          spinner: "el-icon-loading"
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
    }
  },
  created () {
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  mounted () { },
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    getTime () {
      this.time = dateFormat(new Date());
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>