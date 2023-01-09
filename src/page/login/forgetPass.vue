<template>
        <div>
            <el-form class="login-form"
                status-icon
                :rules="loginRules"
                ref="loginForm"
                :model="loginForm">
            <el-form-item prop="phone">
                <el-input size="small"
                        v-model="loginForm.phone"
                        autocomplete="off"
                        :placeholder="$t('login.phone')">
                    <i slot="prefix"
                    class="icon-shouji"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="small"
                        v-model="loginForm.code"
                        autocomplete="off"
                        :placeholder="$t('login.code')">
                    <i slot="prefix"
                    class="icon-yanzhengma"
                    style="margin-top:6px;"></i>
                    <template slot="append">
            <span @click="handleSend(loginForm.phone)"
                    class="msg-text"
                    :class="[{display:msgKey}]">{{msgText}}</span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="pass" v-if="isValidCode">
                <el-input size="small"
                          type="password"
                        v-model="loginForm.pass"
                        autocomplete="off"
                        :placeholder="$t('forgetPass.resetPWD')"
                        show-password>
                    <i slot="prefix"
                    class="icon-mima"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="rePass" v-if="isValidCode">
                <el-input size="small"
                        type="password"
                        v-model="loginForm.rePass"
                        autocomplete="off"
                        :placeholder="$t('forgetPass.twoResetPWD')"
                        show-password>
                    <i slot="prefix"
                    class="icon-mima"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small"
                        type="primary"
                        @click.native.prevent="submit(btnTextBySts)"
                        class="login-submit">{{btnTextBySts}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {isvalidatemobile} from "@/util/validate";
    import {mapGetters} from "vuex";
    import {getValidateCode, resetPass} from '@/api/user';
    import md5 from 'js-md5'
    export default {
        name: 'forgetPass',
        data(){
            const validatePhone = (rule, value, callback) => {
                if (isvalidatemobile(value)[0]) {
                    callback(new Error(isvalidatemobile(value)[1]));
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
                btnTextBySts: this.$t('forgetPass.submitCodeBtn'),
                isValidCode: false,  //验证码是否验证成功
                loginForm: {
                    phone: "",
                    code: "",
                    pass: "",
                    rePass: ""
                },
                loginRules: {
                    phone: [{required: true, trigger: "change", validator: validatePhone}],
                    code: [{required: true, trigger: "change", validator: validateCode}],
                    pass: [{required: true, trigger: "change"}],
                    rePass: [{required: true, trigger: "change",validator: this.rePassValid}]
                } 
            }
        },
        created(){
            this.msgText = this.config.MSGINIT;
            this.msgTime = this.config.MSGTIME;
        },
        computed: {
            ...mapGetters(["tagWel"]),
            config() {
                return {
                    MSGINIT: this.$t("login.msgText"),
                    MSGSCUCCESS: this.$t("login.msgSuccess"),
                    MSGTIME: 30
                };
            }
        },
        methods: {
            rePassValid(){
                return this.loginForm.pass === this.loginForm.rePass ? true : false;
            },
            handleSend(mobile) {
                if (this.msgKey) return;
                if (!this.loginForm.phone){
                    this.$message({
                        title: this.$t('deletePrompt.Error'),
                        message: this.$t('forgetPass.hintSentSuccess'),
                        type: 'error'
                    });
                }
                getValidateCode(mobile).then(res => {
                    this.$message({
                        title:this.$t('deletePrompt.successTitle'),
                        message:this.$t('forgetPass.hintSentSuccess'),
                        type: 'success'
                    });
                    this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                    this.msgKey = true;
                    this.isValidCode = true;
                    this.btnTextBySts = this.$t('forgetPass.loginAgainBtn');

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
            submit(name){
                let params = {};
                params.mobile = this.loginForm.phone;
                params.code = this.loginForm.code;
                params.password = md5(this.loginForm.pass);

                resetPass(params)
                .then((res)=>{
                    if(res.data.code == 0){
                        this.$message({
                            title:this.$t('deletePrompt.successTitle'),
                            message: this.$t('forgetPass.hintLoginAgain'),
                            type: 'success'
                        });
                    }
                })
                .catch((err)={})
            }
        }
    }
</script>
<style>

</style>