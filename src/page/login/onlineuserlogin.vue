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
        placeholder="请输入手机号码"
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
        placeholder="请输入密码"
      >
        <i
          class="el-icon-view el-input__icon"
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
        >登录</el-button
      >
      <el-button class="login_btn"  @click.native.prevent="dialogVisible = true">还没帐号？立即注册</el-button>

       <!-- <el-button
        type="primary"
        size="small"
        @click.native.prevent="dialogVisible = true"
        class="login-submit"
        >注册</el-button
      > -->

    </el-form-item>

    <el-dialog v-dialogDrag
      class="companiesuser-form custom-form"
      title="注册"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div v-if="dialogVisible">
        <el-form
          :rules="registerRules"
          ref="registerForm"
          :model="registerForm"
          label-width="80px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24">
            <el-form-item prop="tel" label="手机号码">
              <el-input
                placeholder="请填写手机号码"
                size="small"
                v-model="registerForm.tel"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="companyName" label="公司名称">
              <el-input
                placeholder="公司名称"
                size="small"
                v-model="registerForm.companyName"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="name" label="联系人">
              <el-input
                placeholder="联系人"
                size="small"
                v-model="registerForm.name"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="password" label="密码">
              <el-input
                placeholder="密码"
                size="small"
                v-model="registerForm.password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>

        <span slot="footer" class="dialog-footer foot_btn">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="registerSubmit"
            >确 定</el-button
          >
        </span>
         <div class="clear"></div>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
/*import { randomLenNum } from "@/util/util";*/
import { mapGetters } from "vuex";
import { loginUrl } from "@/config/env";
var request = window.axios;
export default {
  name: "userlogin",
  data() {
    /*const validateCode = (rule, value, callback) => {
      if (this.code.value != value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };*/
    return {
      dialogVisible: false,
      registerForm: {
        tel: "",
        companyName: "",
        name: "",
        password: "",
      },
      loginForm: {
        username: "",
        password: "",
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
      registerRules:{
         tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '请输入正确的手机号码或者座机号', }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          /*{ min: 6, message: "密码长度最少为6位", trigger: "blur" }*/
        ],
        name: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          /*{ min: 6, message: "密码长度最少为6位", trigger: "blur" }*/
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          /*{ min: 6, message: "密码长度最少为6位", trigger: "blur" }*/
        ],
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          /*{ min: 6, message: "密码长度最少为6位", trigger: "blur" }*/
        ],
        /*code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" },
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
    registerSubmit(){
       this.$refs.registerForm.validate((valid) => {
        if (valid) {

          request({
            url: loginUrl + "/register",
            method: "post",
            data: this.registerForm,
          }).then(result=>{

            if(result.data.code === 200){
              this.$message.success("注册成功！");
            }
            this.dialogVisible = false;

          })

        }
       });
     
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          request({
            url: loginUrl + "/login",
            method: "get",
            params: {
              tel: this.loginForm.username,
              password: this.loginForm.password,
            },
          }).then((result) => {
            //如果登录成功  则使用默认账户登录
            if (result.data.code === 200) {
              this.$store
                .dispatch("LoginByUsername", {
                  username: "system",
                  password: "000000",
                })
                .then(() => {
                  //登录前是否有 登录返回地址
                  let loginBackPath = window.localStorage.getItem('loginBackPath');
                  if(loginBackPath){
                      this.$router.push({ path: loginBackPath });
                      window.localStorage.setItem('loginBackPath',"");//登录返回地址置空
                  }else{
                      for (var i = 0; i < this.tagWel.length; i++) {
                      this.$router.push({ path: this.tagWel[i].value });
                    }
                  }
                  
                });
            }
            //没有注册
            if (result.data.code === 666) {
              this.$message.error("号码不存在，请注册!");
              this.dialogVisible = true;
            }
            //密码错误
            if (result.data.code === 111) {
              this.$message.error("密码错误");
            }
          });
        }
      });
    },
  },
};
</script>

<style>
.login_btn{
  font-size:14px;
  color:#999;
  text-align: right;
  text-align: right;
  border:none;
}
.login_btn:hover{
  color: #317cf8 ;
  cursor: pointer;
}
.login-menu,.submit_btn{
  margin-top:0px;
}
.foot_btn{
    float: right;
}
.clear{
    clear:both;
}
</style>
