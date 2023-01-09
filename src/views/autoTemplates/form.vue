<template>
  <div class="custom-form">
    <FormParser
      :conf="processInfo"
      :formData="formChildrenData"
      :isEdit="isEdit"
      :F_FormId="F_FormId"
      :F_FormName="F_FormName"
      :eventData="eventData"
      ref="parsers"
    />
    <div v-if="hasSubmitButton" class="form-button-center">
      <el-button type="primary" @click="submitForm" size="mini"  :loading="submitLoading">
        {{submitLoading?$t('workFlow.WFMenu.hintSubmit'):$t('submit')}}</el-button>
        <el-button type="primary" @click="cancelForm" size="mini" >
        {{$t('cancel')}}</el-button>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "@/config/env";
import request from "@/router/axios";
import FormParser from "@/components/codeParser/FormParser";
export default {
  components: { FormParser },
  props: [
    "keyValue",
    "isEdit",
    "hasSubmitButton",
    "disabled",
    "F_FormId",
    "processInfo",
    "formChildrenData",
    "F_FormName",
    "eventData"
  ],
  data() {
    return {
      submitLoading: false
    }
  },
  methods: {
    cancelForm(){
      this.$emit("onChange", true);
    },
    async submitForm() {
      this.submitLoading = true;
      let newObj = await this.$refs["parsers"].submitForm();
      if (!newObj){
        this.submitLoading = false;
        return;
      }
      for (const argumentsKey in newObj) {
        if(argumentsKey.includes('$')) {
           delete newObj[argumentsKey]
        }
        if (newObj[argumentsKey] instanceof String) {
          let obj = JSON.parse(newObj[argumentsKey]);
          newObj[argumentsKey] = obj;
        }
        if (newObj[argumentsKey].length) {
          newObj[argumentsKey].forEach(item => {
            for (const keys in item) {
              if (keys.endsWith('_Name')) {
                delete item[keys]
              }
            }
          });
        }
      }
      try {
        //编辑
        let res = { success: false };
        if (this.keyValue) {
          res = await request({
            url: `${baseUrl}/form-scheme/${this.F_FormId}/instance-form-list/${this.keyValue}`,
            method: "put",
            data: newObj
          });
          if (res && res.data && res.data.success) {
          this.submitLoading = false;
          this.$notify({
            title:this.$t('deletePrompt.successTitle'),
            message:this.$t('workFlow.userButtonSetting.hintEditSuccess'),
            type: "success"
          });
           await this.$refs["parsers"].submitFormEvent();//表单事件  提交
          this.$emit("onChange", true);
        }
        } else {
          // 新增
          res = await request({
            url: `${baseUrl}/form-scheme/${this.F_FormId}/instance-form-list`,
            method: "post",
            data: newObj
          });
          if (res && res.data && res.data.success) {
          this.submitLoading = false;
          this.$notify({
            title:this.$t('deletePrompt.successTitle'),
            message:this.$t('BI.listMap.hintAddSuccess'),
            type: "success"
          });
          await this.$refs["parsers"].submitFormEvent();//表单事件  提交
          this.$emit("onChange", true);
        }
        }
        
      } catch (error) {
        this.submitLoading = false;
      }
    }
  }
};
</script>
<style></style>
