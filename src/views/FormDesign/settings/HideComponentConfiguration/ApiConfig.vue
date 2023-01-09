<template>
  <div class="api-config-box">
    <div class="el-input form-rule-box" @click="openApiDialog()">
      <span class="rule-item" v-if="apiConfig.F_UrlAddress">{{ apiConfig.F_UrlAddress }}</span>
      <span class="rule-item" v-else>{{$t('fillInterfaceConfig')}}</span>
      <i class="el-icon-more click-icon"></i>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="apiVisible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeApiDialog"
      class="dialog-box"
    >
      <div slot="title">
        {{ $t("apiConfig") }}
      </div>
      <div class="content">
        <el-form
          :model="configData"
          :rules="rule"
          class="demo-form-inline"
          label-width="80px"
          ref="apiForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('interfaceManage.addModal.labelAddress')" prop="F_UrlAddress">
                <el-input
                  v-model="configData.F_UrlAddress"
                  :placeholder="$t('interfaceManage.addModal.placeholderAddress')"
                  suffix-icon="el-icon-more"
                  @focus="getAllInterface"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('reqType')" prop="RequestMethod">
                 <el-select v-model="configData.RequestMethod" placeholder="" disabled>
                   <el-option label="GET" :value="0"></el-option>
                   <el-option label="POST" :value="1"></el-option>
                   <el-option label="PUT" :value="2"></el-option>
                   <el-option label="PATCH" :value="3"></el-option>
                   <el-option label="DELETE" :value="4"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
         
            <InterfaceList
              v-if="listVisible"
              :configData="configData"
              :visible.sync="listVisible"
              @changeData="changeData"
            ></InterfaceList>
          
          <ApiInputParams
            v-if="apiVisible"
            :configData.sync="configData"
            :allComponents="allComponents"
            :isTableChild="isTableChild"
            v-bind="$attrs"
            :nodeType="nodeType"
          ></ApiInputParams>
          <el-col :span="24">
            <el-form-item :label="$t('assignField')" prop="field">
               <el-select
                  v-model="configData.field"
                  :placeholder="$t('pleaseSelectAnAssignmentField')"
                >
                  <el-option
                    v-for="item in configData.inputList"
                    :key="item.F_OutputKey"
                    :label="item.F_OutputKey"
                    :value="item.F_OutputKey"
                  >
                  </el-option>
                </el-select>

            </el-form-item>
          </el-col>
           </el-row>
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeApiDialog()">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button type="primary" @click="submitApiDialog()" size="small">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InterfaceList from "@/components/apiConfiguration/InterfaceList";
import ApiInputParams from "@/components/apiConfiguration/ApiInputParams.vue";
import {
  getInterfaceDetail,
} from "@/api/systemManagement/interface";
import { deepClone } from '@/utils';
export default {
  props: ["activeData", "allComponents","apiConfig","isTableChild","isFormEvent","nodeType"],
  components: {
    InterfaceList,
    ApiInputParams,
  },
  data() {
    return {
      apiVisible: false,
      listVisible: false,
      rule: {
        F_UrlAddress: [
          {
            required: true,
            message: this.$t("selectInterfaceAddress"),
            trigger: "change",
          },
        ],
      },
      configData:{
        url:"",
        field:"",
        F_UrlAddress:"",
        RequestMethod:"",
      }
    };
  },
  methods: {
    openApiDialog() {
      this.configData = deepClone(this.apiConfig);
      this.apiVisible = true;
    },
    closeApiDialog() {
      this.apiVisible = false;
    },
    submitApiDialog() {
       this.$refs['apiForm'].validate((valid) => {
          if (valid) {
            let message = '';
            if(this.configData.apiInputParams.length>0){
              for (let index = 0; index < this.configData.apiInputParams.length; index++) {
                let element = this.configData.apiInputParams[index];
                if(element.paramType=='formData'){
                  if(!element.params.id||element.params.id==''){
                     message=this.$t('selectApiParameterValue');
                   break;
                  }
                }
              }
            }
            if(this.configData.outputs.length>0){
              for (let index = 0; index < this.configData.outputs.length; index++) {
                let element = this.configData.outputs[index];
                if(!element.outputKey){
                  // API出参赋值组件-API输出参数未选择
                     message=this.$t('apiOutputParameterAssignComp-ApiOutputParaNotSelect');
                   break;
                }
                if(!element.formId){
                  //API出参赋值组件-表单组件未选择
                  message=this.$t('apiOutputParameterAssignComp-FormCompNotSelect');
                   break;
                }
              }
            }
            if(message){
              this.$notify({
                title: this.$t('deletePrompt.failureTitle'),
                message: message,
                type: "warning"
              });
            }else{
              this.$emit('submitApiDialog',this.configData);
               this.apiVisible = false;
            }
          } else {
            return false;
          }
        });
    },
    getAllInterface() {
      this.listVisible = true;
    },
    changeData(row){
      this.configData.apiInputParams = [];
      this.configData.apiOutputParams = [];
      this.configData.inputList = [];
      this.configData.outputs = [];
      this.configData.type = 0;
       this.configData.url = '';
      this.configData.F_UrlAddress = "";
      if(row.F_Id){
        getInterfaceDetail(row.F_Id).then(res=>{
        let data = res.data.data;
        if(data.F_UrlAddress){
          let defaultUrl = '/xjr-interface-info/execute/';
          this.configData.id = row.F_Id;
          this.configData.url = defaultUrl+row.F_Id;
          this.configData.F_UrlAddress = data.F_UrlAddress;
        }
        if(data.F_IsCustomize==1){
          this.configData.type = 1;
        }else{
          if(data.F_RequestMethod){
          this.configData.type = data.F_RequestMethod;
          }
        }
         this.configData.RequestMethod = data.F_RequestMethod;
        if(data.F_Params&&data.F_Params.length>0){
          let temp =  data.F_Params.filter(item=>{
            return item.isChecked;
          });
         if(temp.length>0){
            this.configData.apiInputParams =temp.map(ele=>{
            ele.paramType = 'value';
            ele.params = {};
            return ele;
          });
         }
        }
        if(data.F_Outputs){
          this.configData.apiOutputParams = data.F_Outputs.filter(ele=>{
            return ele.F_SettingJson;
          });
          this.configData.inputList = data.F_Outputs.filter(ele=>{
            return ele.F_Type==0;
          });
        }
      });
      }
      
    }
  },
};
</script>

<style lang="scss" scoped>
.content{
  height: 500px;
  overflow: auto;
}
.api-config-box{
  height: 30px;
}
.click-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #606266;
  z-index: 2;
  background-color: #fff;
}
.form-rule-box {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
  position: relative;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  .rule-item{
    display: inline-block;
    text-align: left;
    color: #606266;
    padding-left: 15px;
    overflow: hidden;
    text-overflow: inherit;
    white-space: nowrap;
    width: 200px;
  }
}
.head_desc{
  font-size: 12px;
  color: #606266;
  padding-left: 20px;
  line-height: 20px;
  padding-top:5px;
}
.title{
  font-weight: 700;
  border-bottom: 1px solid #e4e7ed;
}
</style>
