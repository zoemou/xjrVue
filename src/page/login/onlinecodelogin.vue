<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="phone">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.phone"
        auto-complete="off"
        placeholder="请输入手机号码"
      >
        <i slot="prefix" class="icon-shouji"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="请输入6位数的验证码"
      >
        <i slot="prefix" class="icon-yanzhengma" style="margin-top: 6px"></i>
        <template slot="append">
          <span
            @click="handleSend()"
            v-if="time"
            class="msg-text"
            :class="[{ display: msgKey }]"
            >{{ msgText }}</span
          >

          <span v-if="!time" class="msg-text" :class="[{ display: msgKey }]">{{
            clock
          }}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        size="small"
        type="primary"
        @click.native.prevent="handleLogin"
        class="login-submit"
        >登录
      </el-button>
      <el-button class="login_btn" @click.native.prevent="dialogVisible = true" >还没帐号？立即注册</el-button>

      <!-- <el-button
        size="small"
        type="primary"
        @click.native.prevent="dialogVisible = true"
        class="login-submit"
        >注册
      </el-button> -->
    </el-form-item>

    <el-dialog v-dialogDrag
      class="companiesuser-form custom-form"
      title="注册"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
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
import { isvalidatemobile } from "@/util/validate";
import { mapGetters } from "vuex";
import { getValidateCode } from "@/api/user";

import { loginUrl } from "@/config/env";
var request = window.axios;

export default {
  name: "codelogin",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(this.$t(isvalidatemobile(value)[1])));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length != 6) {
        callback(new Error("请输入6位数的验证码"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      registerForm: {
        tel: "",
        companyName: "",
        name: "",
        password: "",
      },
      time: true,
      clock: 60,
      msgText: "",
      msgTime: "",
      msgKey: false,
      loginForm: {
        phone: "",
        code: "",
      },
      registerRules: {
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
            message: "请输入正确的手机号码或者座机号",
          },
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
        phone: [
          { required: true, trigger: "change", validator: validatePhone },
        ],
        code: [{ required: true, trigger: "change", validator: validateCode }],
      },
    };
  },
  created() {
    this.msgText = this.config.MSGINIT;
    this.msgTime = this.config.MSGTIME;
  },
  mounted() {},
  computed: {
    ...mapGetters(["tagWel"]),
    config() {
      return {
        MSGINIT: "获取验证码",
        MSGSCUCCESS: "发送成功",
        MSGTIME: 10,
      };
    },
  },
  props: [],
  methods: {
    registerSubmit() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          request({
            url: loginUrl + "/register",
            method: "post",
            data: this.registerForm,
          }).then((result) => {
            if (result.data.code === 200) {
              this.$message.success("注册成功！");
            }
            this.dialogVisible = false;
          });
        }
      });
    },
    handleSend() {
      if (this.msgKey) return;

      request({
        url: loginUrl + "/login/send?tel=" + this.loginForm.phone,
        method: "get",
      }).then((res) => {
        if (res.data.code === 666) {
          this.$message.error("号码不存在，请注册!");
          this.dialogVisible = true;
        }
        if (res.data.code === 777) {
          this.$message.error("验证码错误!");
        }

        if (res.data.code === 200) {
          this.$message.success("发送成功!");
          this.time = false;

          setInterval(() => {
            this.clock--;
            if (this.clock === 0) {
              window.clearInterval();
              this.time = true;
            }
          }, 1000);
        }
      });
    },
    // getValidateCode(mobile) {
    //
    // },
    /**
     * @description 手机登入 btn 登入
     *
     * */
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          request({
            url: loginUrl + "/login/phone",
            method: "get",
            params: {
              tel: this.loginForm.phone,
              msm: this.loginForm.code,
            },
          }).then((res) => {
            if (res.data.code === 666) {
              this.$message.error("号码不存在，请注册!");
            }
            if (res.data.code === 777) {
              this.$message.error("验证码错误!");
            }

            if (res.data.code === 200) {
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
          });
        }
      });
    },
  },
};
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.msg-text.display {
  color: #ccc;
}
.login_btn{
  font-size:14px;
  color:#999;
  text-align: right;
  border:none;
  width:100%;
}
.login_btn:hover{
     cursor: pointer;
  color: #317cf8 ;
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
