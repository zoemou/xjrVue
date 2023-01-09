<template>
  <div>
    <elDialog
      v-if="dialogvisible"
      :visible.sync="dialogvisible"
      :title="dialogTitle"
      :append-to-body="true"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="true"
      :destroy-on-close="true"
      :before-close="closeDialog"
    >
      <CreateFLow
        :nwfSchemeInfoId="nwfSchemeInfoId"
        :infoList="infoList"
        :processInfoFormsData="processInfoFormsData"
        :deploymentId="deploymentId"
        @closeDialog="closeDialog"
      ></CreateFLow>
    </elDialog>
  </div>
</template>

<script>
import { getCreateFormFlowInfo } from "@/api/bpmn.js";
import CreateFLow from "@/views/WorkFlow/components/CreateFLow"; //流程发起组件
export default {
  components: {
    CreateFLow
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      }
    },
    scheme: {
      type: Object,
      default: () => {
        return { id: "", name: "", type: 0, url: "", F_UrlAddress: "" };
      }
    },
    formType: {
      type: String,
      default: () => {
        return "0"; // 0 自定义表单 2 系统表单
      }
    },
    UrlAddress: {
      type: String,
      default: () => {
        return ""; 
      }
    },
    rowPrimaryKey: {
      type: String,
      default: () => {
        return 'F_Id';
      }
    },
  },
  data() {
    return {
      infoList: [],
      nwfSchemeInfoId: "",
      dialogvisible: false,
      dialogTitle:this.$t('forme.editModal.initiationProcessBtn'),
      processInfoFormsData: {},
      deploymentId:'',//流程信息中 json2xml接口中需要带的deploymentId 参数
    };
  },
  created() {
    this.deploymentId = this.row['deploymentId'];
    if (this.formType == "0") {
      if (this.row && this.row.nwfSchemeinfoId) {
        let formParams = {
          nwfSchemeinfoId: this.row.nwfSchemeinfoId,
          F_Id: this.row[this.rowPrimaryKey],
          F_FormId: this.row.F_FormId,
          F_Type: 0,
          F_UrlAddress: ""
        };
        this.initCustomFormData(formParams);
      } else {
        this.$message(this.$t('unbound'));
      }
    } else if (this.formType == "2") {
      if (this.row && this.row.nwfSchemeinfoId) {
        let formParams = {
          nwfSchemeinfoId: this.row.nwfSchemeinfoId,
          F_Id: this.row[this.rowPrimaryKey],
          F_FormId: this.row.formId,
          F_Type: 2,
          F_UrlAddress: this.UrlAddress
        };
         this.initSystemFormData(formParams);
      } else {
        this.$message(this.$t('unbound'));
      }
    } else {
      this.$message(this.$t('abnormalOperation'));
    }
  },
  methods: {
    async initCustomFormData(formParams) {
      try {
        let res = await getCreateFormFlowInfo(formParams);
        if (res && res.data && res.data.data && res.data.data.length) {
          if (res.data.data.length > 0) {
            let tempData = res.data.data[0];
            let formId = tempData.formId;
            this.processInfoFormsData[formId] = {
              rowId:"",
              formData:{}
            };
            this.processInfoFormsData[formId].type = 0;
            this.processInfoFormsData[formId].rowId =  this.row[this.rowPrimaryKey];
            this.processInfoFormsData[formId].formData = tempData.formData;
            let nwfSchemeInfo = tempData.nwfSchemeInfo;
            let { F_Id, F_Name, F_Category, F_Code } = nwfSchemeInfo;
            this.dialogTitle = this.$t('forme.editModal.initiationProcessBtn') +"【" + F_Name + "】";
            this.nwfSchemeInfoId = F_Id;
            //增加暗色主题，保留样式类
            document.body.className = document.body.className + " original";
            this.infoList = [
              { title:this.$t('workFlow.WFLaunch.stampCode'), value: F_Code },
              { title:this.$t('workFlow.WFLaunch.stampName'), value: F_Name },
              { title:this.$t('workFlow.WFLaunch.stampCategory'), value: F_Category }
            ];
            this.dialogvisible = true;
          }
        }else{
          this.$message(this.$t('processDataFailed'));
        }
      } catch (error) {
        this.$message(this.$t('processFailed'));
      }
    },
    async initSystemFormData(formParams) {
      try {
        let res = await getCreateFormFlowInfo(formParams);
        if (res && res.data && res.data.data && res.data.data.length) {
          if (res.data.data.length > 0) {
            let tempData = res.data.data[0];
             let formId = tempData.formId;
            this.processInfoFormsData[formId] = {
              rowId:"",
              formData:{}
            };
            this.processInfoFormsData[formId].type = 2;
            this.processInfoFormsData[formId].rowId =  this.row[this.rowPrimaryKey];
            this.processInfoFormsData[formId].formData = tempData.formData;
            let nwfSchemeInfo = tempData.nwfSchemeInfo;
            let { F_Id, F_Name, F_Category, F_Code } = nwfSchemeInfo;
            this.dialogTitle =this.$t('workFlow.createFLow.hintLaunchFlow') +"【" + F_Name + "】";
            this.nwfSchemeInfoId = F_Id;
            //增加暗色主题，保留样式类
            document.body.className = document.body.className + " original";
            this.infoList = [
              { title:this.$t('workFlow.WFLaunch.stampCode'), value: F_Code },
              { title:this.$t('workFlow.WFLaunch.stampName'), value: F_Name },
              { title:this.$t('workFlow.WFLaunch.stampCategory'), value: F_Category }
            ];
            this.dialogvisible = true;
          }
        }else{
          this.$message(this.$t('processDataFailed'));
        }
      } catch (error) {
        this.$message(this.$t('processFailed'));
      }
    },
    closeDialog() {
      this.dialogvisible = false;
      this.$emit("closedCreateFlow");
    }
  }
};
</script>

<style lang="scss" scoped></style>
