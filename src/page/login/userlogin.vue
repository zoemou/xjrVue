<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        :placeholder="$t('login.username')"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        :placeholder="$t('login.password')"
      >
        <i
          class="el-icon-view el-input__icon" 
		  style="font-size: 18px;"
          slot="suffix"
          @click="showPassword"
        ></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <!--<el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    :maxlength="code.len"
                    v-model="loginForm.code"
                    auto-complete="off"
                    :placeholder="$t('login.code')">
            <i slot="prefix"
               class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <span class="login-code-img"
                  @click="refreshCode"
                  v-if="code.type == 'text'">{{code.value}}</span>
            <img :src="code.src"
                 class="login-code-img"
                 @click="refreshCode"
                 v-else />
            &lt;!&ndash; <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> &ndash;&gt;
          </div>
        </el-col>
      </el-row>

    </el-form-item>-->

    <el-form-item>
      <el-button
        type="primary"
        size="small"
        @click.native.prevent="handleLogin"
        class="login-submit"
        >{{ $t("login.submit") }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
/*import { randomLenNum } from "@/util/util";*/
import { mapGetters } from "vuex";
export default {
  name: "userlogin",
  data() {
    /*const validateCode = (rule, value, callback) => {
      if (this.code.value != value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("???????????????????????????"));
      } else {
        callback();
      }
    };*/
    return {
      loginForm: {
        username: "system",
        password: "000000",
        /*        code: "",
        redomStr: ""*/
      },
      checked: false,
      /* code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },*/
      loginRules: {
        username: [
          { required: true, message: "??????????????????", trigger: "blur" },
        ],
        password: [
          { required: true, message: "???????????????", trigger: "blur" },
          /*{ min: 6, message: "?????????????????????6???", trigger: "blur" }*/
        ],
        /*code: [
          { required: true, message: "??????????????????", trigger: "blur" },
          { min: 4, max: 4, message: "??????????????????4???", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateCode }
        ]*/
      },
      passwordType: "password",
    };
  },
  created() {
    /*this.refreshCode();*/
  },
  mounted() {},
  computed: {
    ...mapGetters(["tagWel"]),
  },
  props: [],
  methods: {
    /*refreshCode() {
      this.loginForm.redomStr = randomLenNum(this.code.len, true);
      this.code.type == "text"
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`);
      this.loginForm.code = this.code.value;
    },*/
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
            //?????????????????? ??????????????????
            let loginBackPath = window.localStorage.getItem('loginBackPath');
            if(loginBackPath){
              this.$router.push({ path: loginBackPath });
              window.localStorage.setItem('loginBackPath',"");//????????????????????????
            }else{
              for (var i = 0; i < this.tagWel.length; i++) {
                this.$router.push({ path: this.tagWel[i].value });
              }
            }
            /* this.$router.push({ path: this.tagWel.value }); */
          });
        }
      });
    },
  },
};
</script>

<style>
</style>
