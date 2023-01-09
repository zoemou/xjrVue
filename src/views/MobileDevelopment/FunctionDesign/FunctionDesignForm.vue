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
      <CodeStepFour
          v-if="active == 3"
          ref="stepFour"
      ></CodeStepFour>
      <CodeStepFive
          v-if="active == 4"
          ref="stepFive"
      ></CodeStepFive>
      <CodeStepSix
          v-if="active == 5"
          ref="stepSix"
      ></CodeStepSix>
      <CodeStepSeven
          v-if="active == 6"
          ref="stepSeven"
      ></CodeStepSeven>
      <CodeStepEight
          v-if="active == 7"
          ref="stepEight"
      ></CodeStepEight>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="backStepOne()" v-if="active != 0"
      >{{$t('mobileDev.loginDesignForm.returnBtn')}}</el-button
      >
      <el-button size="mini" type="primary" @click="prev()" v-if="active != 0"
      >{{$t('mobileDev.loginDesignForm.previousBtn')}}</el-button
      >
      <el-button size="mini" type="primary" @click="next()" v-if="active != 0&&active != 7"
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
          v-if="active == 7"
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
            :model="MDAllStepData.stepOne"
            label-width="80px"
            :validate-on-rule-change="false"
        >
          <el-form-item prop="F_Name" :label="$t('mobileDev.loginDesignForm.saveTemplateModal.labelName')">
            <el-input
                :placeholder="$t('mobileDev.loginDesignForm.saveTemplateModal.placeholderName')"
                size="small"
                v-model="MDAllStepData.stepOne.F_Name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="F_Type" :label="$t('mobileDev.functionDesignForm.labelTemClassif')">
            <el-select v-model="MDAllStepData.stepOne.F_Type" :placeholder="$t('mobileDev.functionDesignForm.placeholderSelect')" style="width:100%">
							<el-option
                v-for="item in diogbaseData"
                :key="item.F_ItemDetailId"
                :label="item.label"
                :value="item.F_ItemDetailId">
                </el-option>
              </el-select>
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
import CodeStepOne from './FunctionDesignStepOne.vue';
import CodeStepTwo from './FunctionDesignStepTwo.vue';
import CodeStepThree from './FunctionDesignStepThree.vue';
import CodeStepFour from './FunctionDesignStepFour.vue';
import CodeStepFive from './FunctionDesignStepFive.vue';
import CodeStepSix from './FunctionDesignStepSix.vue';
import CodeStepSeven from './FunctionDesignStepSeven.vue';
import CodeStepEight from './FunctionDesignStepEight.vue';
import {mapGetters} from "vuex";
import { buildPhoneWebCode ,buildPhoneWebCodeByDraft,editPhoneWebCode} from '@/api/code/code.js';
import { deepClone } from '@/util/util';
import {mobileCategory} from '@/components/mobileDesign/config';
// import store from '@/store/index';
export default {
  name: 'CodeForm',
  components: {
    CodeStepOne,
    CodeStepTwo,
    CodeStepThree,
    CodeStepFour,
    CodeStepFive,
    CodeStepSix,
    CodeStepSeven,
    CodeStepEight
  },
  props: ['listTemplateController'],
  computed: {
    ...mapGetters(['MDAllStepData','MFFormList'])
  },
  data () {
    return {
      templateVisible: false,
      active:0,
      FDsteps: [this.$t('mobileDev.functionDesignForm.stepOne'),this.$t('mobileDev.functionDesignForm.stepTwo'),this.$t('mobileDev.functionDesignForm.stepThree'), this.$t('mobileDev.functionDesignForm.stepFour'),this.$t('mobileDev.functionDesignForm.stepFive'), this.$t('mobileDev.functionDesignForm.stepSix'),this.$t('mobileDev.functionDesignForm.stepSeven'),this.$t('mobileDev.functionDesignForm.stepEight')],
      diogbaseData:mobileCategory,
      // menuForm: {
      //   F_Name: '',
      //   F_Catalog: '',
      //   F_CreateDate:''
      // },
      rules: {
        F_Name: [
          { required: true, message:this.$t('mobileDev.functionDesignForm.hintTemName'), trigger: 'blur' },
        ],
        F_Type: [
          { required: true, message: this.$t('mobileDev.functionDesignForm.hintTemClassif'), trigger: 'change' },
        ],
      },
      param: {        
        stepTwo: {},
        stepThree: [],
        stepFour: [],
        stepFive: {},     
        stepSix: {},
        stepEight:{}
      }
    };
  },
  created () {

  },
  methods: {

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
        this.$refs.stepTwo.submitData();
        let curList = this.MDAllStepData.stepTwo.list;
        curList.forEach(item => {
          if (item.parentName == 1) {
            item.field = '';
            item.relationName = '';
            item.relationField = '';
          }
        });
        if (curList.length <= 0) {
          this.$message({
            message:this.$t('mobileDev.functionDesignForm.hintSelectData'),
            type: 'error'
          });
          return false;
        } else {
          let temp = [...curList];
          temp = temp.filter(function (item) {
            return item.parentName == 0;
          });
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].field == '') {
              this.$message({
                message: this.$t('mobileDev.formRightSide.placeholderSelectTable') +'[' + temp[i].name + ']'+this.$t('associatedFields'),
                type: 'error'
              });
              return false;
            } else if (temp[i].relationName == '') {
              this.$message({
                message:this.$t('mobileDev.formRightSide.placeholderSelectTable')+'[' + temp[i].name + ']'+this.$t('associativeTable'),
                type: 'error'
              });
              return false;
            } else if (temp[i].relationField == '') {
              this.$message({
                message:this.$t('mobileDev.formRightSide.placeholderSelectTable') +'[' + temp[i].name + ']'+this.$t('fieldAssociatedTable'),
                type: 'error'
              });
              return false;
            }
          }
        }
        this.active++;
      } else if (this.active == 2) {
        let MFFormList=this.MDAllStepData.stepThree;
        if(MFFormList.length<=0){
          this.$message({
            message: this.$t('mobileDev.functionDesignForm.hintMinOne'),
            type: 'error'
          });
          return false;
        }
        for(let i=0;i<MFFormList.length;i++){
          const el = MFFormList[i];          
          if(el.type!='title'){
            if(el.table==""){
              this.$message({
                message:this.$t('pleaseGive') +'[' + MFFormList[i].name + ']'+this.$t('componentBindTable'),
                type: 'error'
              });
              return false;
            }
            if(el.field==""){
              this.$message({
                message: this.$t('pleaseGive') +'[' + MFFormList[i].name + ']'+this.$t('componentBindinField'),
                type: 'error'
              });
              return false;
            }
            for (let y = i+1; y < MFFormList.length; y++) {
	            const val = MFFormList[y];
	            if( el.field == val.field ) {
                if(el.field==""){
                  this.$message({
                    message: el.name + this.$t('and') +val.name+this.$t('bindFieldCannotEmpty'),
                    type: 'error'
                  });
                }else{
                  this.$message({
                    message: el.name + this.$t('and') +val.name+this.$t('bindFieldCannotRepeated'),
                    type: 'error'
                  });
                }               
                return false;
              }
            }
          }
        }
        this.active++;
      } else if (this.active == 3) {
        for(let i=0;i<this.MDAllStepData.stepFour.length;i++){
          const el = this.MDAllStepData.stepFour[i];
          if(el.type=="xjrTimeSearch"&&el.field==""){
            this.$message({
              message: this.$t('pleaseGive') +'[' + el.name+']'+this.$t('mobileDev.formRightSide.labelBindField'),
              type: 'error'
            });
            return false;
          }
        }
        this.active++;
      } else if (this.active == 4) {
        this.active++;
      } else if (this.active == 5) {
        let res = this.$refs['stepSix'].validateData();
        if (res) {
          this.active++;
        }
      } else {
        if (this.active++ > 7) this.active = 0;
      }

    },
    codeFormSubmit () {
      let res = this.$refs['stepEight'].validateData();
      if (res) {
        const { MDAllStepData, param } = this;
        param.stepTwo.DbId = MDAllStepData.stepTwo.F_DbId;
        param.stepTwo.list = MDAllStepData.stepTwo.list;
        param.stepThree=MDAllStepData.stepThree
        param.stepFour=MDAllStepData.stepFour;
        param.stepFive = MDAllStepData.stepFive;
        param.stepSix = MDAllStepData.stepSix;
        param.stepSeven=MDAllStepData.stepSeven;
        param.stepEight = MDAllStepData.stepEight;
        buildPhoneWebCode(param).then((res) => {
          if (res.data.success) {
            this.$notify({
              title: this.$t('deletePrompt.successTitle'),
              message: this.$t('mobileDev.loginDesignForm.Hint.codeSuccess'),
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

      }
    },
    saveFormSubmit(){
      this.templateVisible=true;
    },
    formatItemDate(obj){
      if(obj.type=="date"){
        obj.dbdefault=obj.dateformat==0?this.mydayFormat(new Date(obj.dbdefault)):this.mydateFormat(new Date(obj.dbdefault))
      }
      if(obj.type=="daterange"){
        obj.dbdefault=obj.dbdefault.map(o=>{
          return obj.dateformat==0?this.mydayFormat(new Date(o)):this.mydateFormat(new Date(o))
        })
      }  
    },
    saveCodeScheme(){
      this.$refs['schemeForm'].validate((valid) => {
        if (!valid) return;
        const { MDAllStepData, param } = this;
        if(this.active==1){this.$refs.stepTwo.submitData();}
        if(MDAllStepData.stepTwo.F_DbId)  param.stepTwo.DbId = MDAllStepData.stepTwo.F_DbId;
        if(MDAllStepData.stepTwo.list.length>0)  param.stepTwo.list = MDAllStepData.stepTwo.list;

        if(MDAllStepData.stepThree.length>0){
          param.stepThree=[]
          MDAllStepData.stepThree.forEach((it) => {
            let obj=deepClone(it)
            delete obj.listStyle;
            this.formatItemDate(obj)       
            param.stepThree.push(obj);
          }); 
        }  
        if(MDAllStepData.stepFour.length>0){
          param.stepFour=[]
          MDAllStepData.stepFour.forEach((it) => {
            let obj=deepClone(it)
            delete obj.listStyle; 
            this.formatItemDate(obj)            
            param.stepFour.push(obj);
          }); 
        }
        param.stepFive={
          btn:MDAllStepData.stepFive.btn
        }
        if(MDAllStepData.stepFive?.list?.length>0){
          param.stepFive.list=[]
          MDAllStepData.stepFive.list.forEach((it) => {
            let obj=deepClone(it)            
            this.formatItemDate(obj)             
            param.stepFive.list.push(obj);
          }); 
        }
        if(this.active==5) this.$refs['stepSix'].saveData()
        param.stepSix = MDAllStepData.stepSix;     
        param.stepEight = MDAllStepData.stepEight;
        this.MDAllStepData.stepOne.F_Scheme=JSON.stringify(param)
        
        if(this.MDAllStepData.stepOne.F_Id){
          //修改
          
          editPhoneWebCode(this.MDAllStepData.stepOne).then((res) => {
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
          buildPhoneWebCodeByDraft(this.MDAllStepData.stepOne).then((res) => {
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

.formBox {
  height: calc(100% - 100px);
}

.el-steps--simple {
  padding: 8px 20px;
  margin: 10px 0px 0px 0px!important;
}
@media screen and (max-width: 1370px) {
  .formBox {
    height: calc(100% - 90px);
  }
  
  /deep/ .el-steps--simple {
    padding: 2px 20px;
  }
}

.el-form-item{
  margin-top: 20px;
}
</style>
