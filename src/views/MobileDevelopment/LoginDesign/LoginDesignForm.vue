<template>
  <div class="main-container">
    <el-steps
        :active="active"
        finish-status="success"
        simple
        style="margin-bottom: 10px"
    >
      <template v-for="(item, index) in FDsteps">
        <el-step :key="index" :title="item"></el-step>
      </template>
    </el-steps>
    <div class="formBox">
      <CodeStepOne
          v-if="active === 0"
          ref="stepOne"
          @getCurStep="getCurStep"
      ></CodeStepOne>
      <CodeStepTwo
          v-if="active === 1"
          ref="stepTwo"
      ></CodeStepTwo>
      <CodeStepThree
          v-if="active == 2"
          ref="stepThree"
      ></CodeStepThree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="backStepOne()" v-if="active != 0"
      >{{$t('mobileDev.loginDesignForm.returnBtn')}}</el-button
      >
      <el-button size="mini" type="primary" @click="prev()" v-if="active != 0"
      >{{$t('mobileDev.loginDesignForm.previousBtn')}}</el-button
      >
      <el-button size="mini" type="primary" @click="next()" v-if="active != 0&&active != 2"
      >{{$t('mobileDev.loginDesignForm.nextStepBtn')}}</el-button
      >
      <el-button
          size="mini"
          type="primary"
          @click="saveFormSubmit"
          v-if="active !=0"
      >{{$t('mobileDev.loginDesignForm.saveBtn')}}</el-button
      >
      <el-button
          size="mini"
          type="primary"
          @click="codeFormSubmit()"
          v-if="active == 2"
      >{{$t('mobileDev.loginDesignForm.completeBtn')}}</el-button
      >
    </span>

    <el-dialog v-dialogDrag
        :title="$t('mobileDev.loginDesignForm.saveTemplateModal.modalTitle')"
        :append-to-body="true"
        :visible.sync="templateVisible"
        :close-on-click-modal="false"
        width="50%"
        style="padding: 10px 20px"
    >
      <div class="baseinfo-form">
        <el-form
            :rules="rules"
            ref="schemeForm"
            :model="LoginAllStep.stepOne"
            label-width="80px"
            :validate-on-rule-change="false"
        >
          <el-form-item prop="F_Name" :label="$t('mobileDev.loginDesignForm.saveTemplateModal.labelName')">
            <el-input
                :placeholder="$t('mobileDev.loginDesignForm.saveTemplateModal.placeholderName')"
                size="small"
                v-model="LoginAllStep.stepOne.F_Name"
            ></el-input>
          </el-form-item>          
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="" @click="templateVisible=false"
        >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button size="mini" type="primary" @click="saveCodeScheme()"
        >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CodeStepOne from './LoginDesignStepOne.vue';
import CodeStepTwo from './LoginDesignStepTwo.vue';
import CodeStepThree from './LoginDesignStepThree.vue';
import {mapGetters} from "vuex";
import { createPhoneLoginCode ,buildPhoneWebCodeByDraft,editPhoneWebCode} from '@/api/code/code.js';
import { getStore } from "@/util/store";
export default {
  name: 'CodeForm',
  components: {
    CodeStepOne,
    CodeStepTwo,
    CodeStepThree
  },
  computed: {
    ...mapGetters(['LoginAllStep','loginActiveData'])
  },
  data () {
    return {
      templateVisible: false,
      active:0,
      FDsteps: [this.$t('mobileDev.loginDesignForm.stepOne'), this.$t('mobileDev.loginDesignForm.stepTwo'), this.$t('mobileDev.loginDesignForm.stepThree')],
      diogbaseData:[],
      param: {        
        stepTwo: {}
      },
      rules: {
        F_Name: [
          { required: true, message:this.$t('mobileDev.loginDesignForm.saveTemplateModal.placeholderName'), trigger: 'blur' },
        ]
      }
    };
  },
  created () {
		/* 获取主题开始 */
  	  let themeName = getStore({ name: "themeName" }) || "default";
  	  this.themeName = themeName;
  	  /* 获取主题结束 */
  },
  methods: {
    saveFormSubmit(){
      this.templateVisible=true;
    },
    backStepOne(){
      this.active = 0;
    },
    getCurStep(title){
      this.active=title;
    },
    prev () {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next () {
      if (this.active == 0) {

      }else if (this.active == 1) {
        this.active++;
      } else {
        if (this.active++ > 2) this.active = 0;
      }
    },
    codeFormSubmit () {    
        const { LoginAllStep } = this;
        createPhoneLoginCode(LoginAllStep.stepThree).then((res) => {
          if (res.data.success) {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('mobileDev.loginDesignForm.Hint.codeSuccess'),
              type: 'success',
            });
            //删除暗色兼容样式类
            let bodyClass = document.body.className.split(' ');
            bodyClass.filter((item,idx)=>{
              return item == 'original' && (bodyClass.splice(idx,1));
            });
            document.body.className = bodyClass.join(' ');
            this.$emit('finish', true);//关闭当前窗口
          } else {
            this.$notify({
              title:this.$t('deletePrompt.Error'),
              message: res.data.msg,
              type: 'error',
            });
          }       
        });
    },
    saveCodeScheme(){
      this.$refs['schemeForm'].validate((valid) => {
        if (!valid) return;
        const { LoginAllStep } = this;
        LoginAllStep.stepOne.F_Scheme=JSON.stringify({
          stepTwo:LoginAllStep.stepTwo
        })
        if(LoginAllStep.stepOne.F_Id){
          //修改
          
          editPhoneWebCode(LoginAllStep.stepOne).then((res) => {
            if (res.data.success) {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message:this.$t('mobileDev.loginDesignForm.Hint.reviseSuccess'),
                type: 'success',
              });
              this.templateVisible=false;
              this.$emit('finish', true);
            } else {
              this.$notify({
                title:this.$t('deletePrompt.Error'),
                message: res.data.msg,
                type: 'error',
              });
            }        
          });
        }else{
          buildPhoneWebCodeByDraft(LoginAllStep.stepOne).then((res) => {
            if (res.data.success) {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message:this.$t('mobileDev.loginDesignForm.Hint.saveSuccess'),
                type: 'success',
              });
              this.templateVisible=false;
              this.$emit('finish', true);
            } else {
              this.$notify({
                title:this.$t('deletePrompt.Error'),
                message: res.data.msg,
                type: 'error',
              });
            }        
          });
        }
      }) 
    }
    
  }
};
</script>

<style scoped>
.main-container {
  height: 100%;
}

.el-form-item{
  margin-top: 20px;
}
.formBox {
  height: calc(100% - 102px);
}

.el-steps--simple {
  padding: 8px 20px;
}
.eveningTheme .el-dialog .el-dialog__body .main-container .el-steps--simple {
    background: #F5F7FA;
}

</style>
