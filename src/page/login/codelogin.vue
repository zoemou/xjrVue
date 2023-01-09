<template>
    <el-form class="login-form"
             status-icon
             :rules="loginRules"
             ref="loginForm"
             :model="loginForm"
             label-width="0">
        <el-form-item prop="phone">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.phone"
                      auto-complete="off"
                      :placeholder="$t('login.phone')">
                <i slot="prefix"
                   class="icon-shouji"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="code">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.code"
                      auto-complete="off"
                      :placeholder="$t('login.code')">
                <i slot="prefix"
                   class="icon-yanzhengma"
                   style="margin-top:6px;"></i>
                <template slot="append">
          <span @click="handleSend(loginForm.phone)"
                class="msg-text"
                :class="[{display:msgKey}]">{{config.MSGINIT}}</span>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click.native.prevent="handleLogin"
                       class="login-submit">{{$t('login.submit')}}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {isvalidatemobile} from "@/util/validate";
    import {mapGetters} from "vuex";
    import {getValidateCode} from '@/api/user'

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
                    callback(new Error(this.$t('forgetPass.errorVerCode')));
                } else {
                    callback();
                }
            };
            return {
                msgText: "",
                msgTime: "",
                msgKey: false,
                loginForm: {
                    phone: "",
                    code: ""
                },
                loginRules: {
                    phone: [{required: true, trigger: "change", validator: validatePhone}],
                    code: [{required: true, trigger: "change", validator: validateCode}]
                }
            };
        },
        created() {
            this.msgText = this.config.MSGINIT;
            this.msgTime = this.config.MSGTIME;
        },
        mounted() {			
        },
        computed: {
            ...mapGetters(["tagWel"]),
            config() {
                return {
                    MSGINIT: this.$t("login.msgText"),
                    MSGSCUCCESS: this.$t("login.msgSuccess"),
                    MSGTIME: 10
                };
            }
        },
        props: [],
        methods: {
            handleSend(mobile) {
                if (this.msgKey) return;
                getValidateCode(mobile).then(res => {
                    this.$notify({
                        title:this.$t('deletePrompt.successTitle'),
                        message:this.$t("forgetPass.hintSentSuccess"),
                        type: 'success'
                    });
                    this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                    this.msgKey = true;


                    const time = setInterval(() => {
                        this.msgTime--;
                        this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                        if (this.msgTime == 0) {
                            this.msgTime = this.config.MSGTIME;
                            this.msgText = this.config.MSGINIT;
                            this.msgKey = false;
                            clearInterval(time);
                        }
                    }, 1000);
                })
            },
            // getValidateCode(mobile) {
            //
            // },
            /**
             * @description 手机登入 btn 登入
             *
             * */
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.$store.dispatch("LoginByPhone", this.loginForm).then(res => {
                            const {code} = res;
                            if (code) return;
                            //登录前是否有 登录返回地址
                            let loginBackPath = window.localStorage.getItem('loginBackPath');
                            if(loginBackPath){
                                this.$router.push({ path: loginBackPath });
                                window.localStorage.setItem('loginBackPath',"");//登录返回地址置空
                            }else{
                                for (let i = 0; i < this.tagWel.length; i++) {
                                    this.$router.push({path: this.tagWel[i].value});
                                }
                            }
                            // this.$router.push({ path: 'wel/index' });
                        });
                    }
                });
            }
        }
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
</style>
