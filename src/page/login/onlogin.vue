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
        <div class="login_pic"><img class="img" src="/img/login_pic.png" alt=""></div>

      </div>
      <div class="login-border">
        <div class="login-main">
          <!-- <h4 class="login-title">
             {{ $t('login.title') }}{{website.title}}

           </h4> -->
          <codeLogin v-if="activeName==='code'"></codeLogin>
          <userLogin v-else-if="activeName==='user'"></userLogin>
          <!--<thirdLogin v-else-if="activeName==='third'"></thirdLogin>
          <faceLogin v-else-if="activeName==='face'"></faceLogin>-->


          <div class="submit_btn">
            <!--			  <input type="submit"  value="获取验证码"/>-->
          </div>

          <div class="login-menu">
            <a href="#" @click.stop="activeName='user'">帐号登录</a>
            <a href="#" @click.stop="activeName='code'">手机登录</a>
            <!--      <a href="#"
                     @click.stop="activeName='face'">{{ $t('login.faceLogin') }}</a>
                  <a href="#"
                     @click.stop="activeName='third'">{{ $t('login.thirdLogin') }}</a>-->
          </div>

         

        </div>
      </div>
      <div class="login_foot">{{website.copyright}}</div>
      <!-- <div class="login_rwm">
        <a href=""><img src="img/login_rwm.png"></a>
      </div> -->
    </div>
  </div>
</template>
<script>
import userLogin from './onlineuserlogin';
import codeLogin from './onlinecodelogin';
import thirdLogin from './thirdlogin';
import faceLogin from './facelogin';
import { mapGetters } from 'vuex';
import { dateFormat } from '@/util/date';
import { validatenull } from '@/util/validate';
import topLang from '@/page/index/top/top-lang';
import topColor from '@/page/index/top/top-color';

export default {
  name: 'login',
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
      time: '',
      activeName: 'code'
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
              this.socialForm.state === 'WX' ? '微信' : 'QQ'
          }登录中,请稍后。。。`,
          spinner: 'el-icon-loading'
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
    ...mapGetters(['website'])
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