<template>
  <div class="login-container">
    <top-color v-show="false"></top-color>

    <div class="login-weaper animated bounceInDown">
      <div class="login_logo">
        <img src="/img/login_logo.png" />
      </div>

      <div class="login-left">
        <!-- <div class="login-time">
           {{time}}
         </div> -->
        <div class="login_pic">
          <img class="img" src="/img/login_pic.png" alt="" />
        </div>
      </div>
      <div class="login-border">
        <div class="login-main">
          <!-- <h4 class="login-title">
             {{ $t('login.title') }}{{website.title}}

           </h4> -->
          <div v-if="website.tenantEnabled">
            <tenantUserLogin v-if="activeName === 'user'"></tenantUserLogin>
            <tenantCodeLogin
              v-else-if="activeName === 'code'"
            ></tenantCodeLogin>
            <forgetPass v-else-if="activeName === 'forget'"></forgetPass>
          </div>
          <div v-else>
            <codeLogin v-if="activeName === 'code'"></codeLogin>
            <userLogin v-else-if="activeName === 'user'"></userLogin>
            <forgetPass v-else-if="activeName === 'forget'"></forgetPass>
          </div>
          <!--<thirdLogin v-else-if="activeName==='third'"></thirdLogin>
          <faceLogin v-else-if="activeName==='face'"></faceLogin>-->

          <div class="submit_btn">
            <!--			  <input type="submit"  value="获取验证码"/>-->
          </div>

          <div class="login-menu" v-show="activeName != 'forget'">
            <a href="#" @click.stop="activeName = 'user'">{{
              $t("login.userLogin")
            }}</a>
            <a href="#" @click.stop="activeName = 'code'">{{
              $t("login.phoneLogin")
            }}</a>
            <!--      <a href="#"
                     @click.stop="activeName='face'">{{ $t('login.faceLogin') }}</a>
                  <a href="#"
                     @click.stop="activeName='third'">{{ $t('login.thirdLogin') }}</a>-->
          </div>

          <a
            class="f_passworld"
            href="#"
            @click="activeName = 'forget'"
            v-show="activeName != 'forget'"
            >{{$t('forgetPass.forgetPWD')}}</a
          >
          <a
            class="f_passworld"
            href="#"
            @click="activeName = historyCode"
            v-show="activeName == 'forget'"
            >{{$t('forgetPass.returnLogin')}}</a
          >
        </div>
      </div>
      <div class="login_foot">{{ website.copyright }}</div>
      <div class="login_rwm">
        <a href=""><img src="img/login_rwm.png"/></a>
      </div>
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin";
import tenantUserLogin from "./tenantuserlogin";

import codeLogin from "./codelogin";
import thirdLogin from "./thirdlogin";
import faceLogin from "./facelogin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date";
import { validatenull } from "@/util/validate";
import topLang from "@/page/index/top/top-lang";
import topColor from "@/page/index/top/top-color";
import tenantCodeLogin from "./tenantcodelogin";
import forgetPass from "./forgetPass";
import website from '@/config/website'
import { getStore } from '@/util/store'
export default {
  name: "login",
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
    faceLogin,
    topLang,
    topColor,
    tenantUserLogin,
    tenantCodeLogin,
    forgetPass
  },
  data() {
    return {
      time: "",
      activeName: "code",
      historyCode: "code"
    };
  },
  watch: {
    $route() {
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
  created() {

    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  mounted() {
     this.$store.commit("SET_THEME_NAME", getStore({ name: 'themeName' })|| website.defaultTheme);
     this.$store.commit("SET_MENULAYOUT", ['lightTheme','default'].includes(getStore({ name: 'themeName' })||website.defaultTheme) ? false : true);
  },
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    getTime() {
      this.time = dateFormat(new Date());
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
