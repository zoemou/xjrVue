<template>
  <div>
    <el-steps finish-status="success" simple :active="stepData.activeStep">
      <el-step :title="$t('workFlow.menuForm.titleBasicInfor')"></el-step>
      <el-step :title="$t('workFlow.menuForm.titleDeploy')"></el-step>
      <el-step :title="$t('workFlow.menuForm.titleAccess')"></el-step>
      <el-step v-if="stepData.templateType == 1" :title="$t('workFlow.menuForm.titleFieldDeploy')"></el-step>
      <el-step v-if="stepData.templateType == 1" :title="$t('workFlow.menuForm.titleQueryDeploy')"></el-step>
      <el-step v-if="stepData.templateType == 1" :title="$t('workFlow.menuForm.titleFieldAccess')"></el-step>
    </el-steps>
    <div class="content-box">
      <component
        :is="componentsName"
        :stepData.sync="stepData"
        :isEdit="isEdit"
        @finish="submit"
      ></component>
    </div>
  </div>
</template>

<script>
import Step1 from "./menu/Step1.vue";
import Step2 from "./menu/Step2.vue";
import Step3 from "./menu/Step3.vue";
import Step4 from "./menu/Step4.vue";
import Step5 from "./menu/Step5.vue";
import Step6 from "./menu/Step6.vue";
export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isEdit:false,
      isValid: false,
      stepData: {
        templateType: 1,
        activeStep: 0,
        fieldOptions: [],
				searchFields:[],
        step1: {
          F_NwfRelationCode: "",
          F_NwfRelationName: "",
          F_EnCode: "",
          F_FullName: "",
          F_ParentId: "",
          F_Icon: "",
          F_SortCode: "",
          F_Description: "",
		  F_LgMarkName:"",
		  F_LgMarkCode:""
        },
        step2: [],
        step3: {
          userType: 1,
          authorityData: [],
        },
        step4: { isPage: true, pageSize: "10", fields: [] },
        step5: {},
        step6: {
          userType: 1,
          authorityData: [],
        },
      },
    };
  },
  computed: {
    componentsName() {
      return "Step" + (this.stepData.activeStep + 1);
    },
  },
  created() {
    this.isEdit = false;
    if (JSON.stringify(this.formData) != "{}") {
      this.isEdit = true;
      let {
        F_NwfRelationCode,
        F_NwfRelationName,
        F_EnCode,
        F_FullName,
        F_ParentId,
        F_Icon,
        F_SortCode,
        F_Description,
        F_SettingJson,
        F_NwfSchemeType,
		F_LgMarkName,
		F_LgMarkCode,
    F_SubSystemId
      } = this.formData;

      F_SettingJson = F_SettingJson ? JSON.parse(F_SettingJson) : {};
      this.stepData.step1 = {
        F_NwfRelationCode,
        F_NwfRelationName,
        F_EnCode,
        F_FullName,
        F_ParentId:F_ParentId?F_ParentId:0,
        F_Icon,
        F_SortCode,
        F_Description,
		F_LgMarkName,
		F_LgMarkCode,
    F_SubSystemId
      };
      let {
        step2 = [],
        step3 = {
          userType: 1,
          authorityData: [],
        },
        step4 = { isPage: true, pageSize: "10", fields: [] },
        step5 = {},
        step6 = {
          userType: 1,
          authorityData: [],
        },
      } = F_SettingJson;
      this.stepData.templateType = F_NwfSchemeType ? F_NwfSchemeType : 2; //1是绑定了单个的流程(多三个步骤)  2是绑定多个流程
      this.stepData.step2 = step2;
      this.stepData.step3 = step3;
			step4.fields.forEach(o=>{
				if(o.showNode==undefined){
					o.showNode=0
				}
			})
      this.stepData.step4 = step4;
      this.stepData.step5 = step5;
      this.stepData.step6 = step6;
    }
  },
  methods: {
    submit() {
      let { activeStep, templateType, ...finishData } = this.stepData;
      let { step1, step2, step3, step4, step5, step6 } = finishData;
      let formData = {};
      let settingJson = {};
      if (templateType == 1) {
        settingJson = { step2, step3, step4, step5, step6 };
      } else {
        settingJson = { step2, step3 };
      }
      let { F_NwfRelationCode, F_NwfRelationName, ...otherParams } = step1;
      let xjrNwfRelation = {
        F_NwfRelationCode,
        F_NwfRelationName,
        F_SettingJson: JSON.stringify(settingJson),
      };
      formData = { xjrNwfRelation, xjrBaseModule: otherParams };
      this.$emit("submit", formData);
    },
  },
};
</script>

<style scoped>
.content-box {
  height: 500px;
}
.footer {
  padding: 10px 20px 20px;
  text-align: right;
  display: block;
}
@media screen and (max-width: 1370px) {
	div /deep/ .content-box{
	   height: 400px!important;
	   padding-bottom: 100px;
	 }
	
	} 	
</style>
