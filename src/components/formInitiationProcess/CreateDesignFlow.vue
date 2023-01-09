<template>
  <div class="inline">
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('workFlow.WFDesign.titleAddFlow')"
      :append-to-body="true"
      :visible.sync="visible"
      width="80%"
      :fullscreen="true"
      :before-close="closeDialog"
      custom-class="bpmn-box"
    >
      <BpmnModeler
        v-if="visible"
        :modulesId="modulesId"
        :isEdit="false"
        :json="bpmnJsonData"
        @save="saveDialog"
      ></BpmnModeler>
    </el-dialog>
    <NextNodeApprovedBy
      v-if="nextNodeDialogVisible"
      :candidateInfo="candidateInfo"
      @submit="confirmMemberDialog"
    ></NextNodeApprovedBy>
  </div>
</template>

<script>
import {
  setSpecialInitiationProcess,
  resetBpmnModuleAll
} from "@/views/WorkFlow/components/bpmn/common/util/modelId";
import { postCreateProcess } from "@/api/workFlow/WFLaunch";
import {
  postAgainCandidate
} from "@/api/workFlow/WFProcess";
import BpmnModeler from "@/views/WorkFlow/components/bpmn/Bpmn";
import NextNodeApprovedBy from "@/views/WorkFlow/components/flow/NextNodeApprovedBy/Index";
import { newModel } from "@/api/bpmn";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rowPrimaryKey: {
      type: String,
      default: () => {
        return 'F_Id';
      }
    },
    scheme: {
      type: Object,
      default: () => {
        return { id: "", name: "", type: 0, url: "", F_UrlAddress: "" };
      }
    }
  },
  components: {
    BpmnModeler,
    NextNodeApprovedBy
  },
  data() {
    return {
      loading: null,
      visible: false,
      modulesId: "",
      nwfSchemeInfoId: "",
      bpmnJsonData: {},
      formData: {
        userJson: [], // 下一节点审批人
        keyValue: [] // 表单信息 ( 表单实例ID ,表单设计ID )
      },
      nextNodeDialogVisible: false, //选择下一节点审批人弹窗
      candidateInfo:[]
    };
  },
  beforeDestroy() {
    setSpecialInitiationProcess(false);
  },
  created() {
    this.createDesignFlow();
  },
  methods: {
    /* 发起流程 */
    async createDesignFlow() {
      try {
        setSpecialInitiationProcess(true);
        let res = await newModel();
        if (res.data.success) {
          this.modulesId = res.data.data;
        }
        this.visible = true;
      } catch (error) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.WFDesign.hintGetFailed'),
          type: "warning"
        });
      }
    },
    close() {
      this.visible = false;
      resetBpmnModuleAll();
      this.$emit("closedCreateFlow");
    },
    closeDialog() {
      this.close();
    },
    saveDialog(res) {
      this.loading = this.$loading({
        lock: true,
        text:this.$t('deletePrompt.saving'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      if (res.data.success) {
        this.nwfSchemeInfoId = res.data.data; //得到流程设计id
        this.initFormData();
        this.createFlow();
      } else {
        this.$notify({
          title:this.$t('workFlow.createFLow.hintError'),
          message:this.$t('deletePrompt.processDesignFailed'),
          type: "warning"
        });
      }
      
    },
    initFormData() {
      let formIdParams = {
        F_FormId: this.scheme.id,
        F_Type: this.scheme.type,
        F_Url: this.scheme.url,
        F_UrlAddress: this.scheme.F_UrlAddress
      };
      let formInstanceId = this.row[this.rowPrimaryKey];
      let temp = {
        F_Id: formInstanceId, // 表单实例ID
        F_FormId: formIdParams.F_FormId, // 表单设计ID
        F_Type: formIdParams.F_Type,
        F_UrlAddress: formIdParams.F_UrlAddress
      };
      this.formData.keyValue.push(temp);
    },
    // 发起流程
    async createFlow() {
      this.loading = this.$loading({
        lock: true,
        text:this.$t('deletePrompt.initiatingProcess'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let nwfSchemeInfoId = this.nwfSchemeInfoId;
      let params = {
        F_Id: nwfSchemeInfoId, //流程任务id
        relationTaskList: JSON.stringify([]), // 关联前置任务数据
        keyValue: JSON.stringify(this.formData.keyValue), // 表单信息 ( 表单实例ID ,表单设计ID )
        userJson: JSON.stringify(this.formData.userJson) //下一节点审批人
      };
      try {
        let result = await postCreateProcess(params);
        let res = result.data;
        if (res.success) {
          if (res.data.retCode && res.data.retCode == 2) {
            //无对应处理人 情况处理
            this.nextNodeDialogVisible = true;
            this.candidateInfo = (res.data&&res.data.CandidateInfo)?res.data.CandidateInfo:[];
            this.loading.close();
            this.$notify({
              title:this.$t('workFlow.createFLow.hintError'),
              message:this.$t('deletePrompt.noCounterpart'),
              type: "warning"
            });
          } else {
            this.loading.close();
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.initiationProcessSuccessful'),
              type: "success"
            });
            this.close();//关闭弹窗
          }
        } else {
          this.loading.close();
          this.$notify({
            title:this.$t('workFlow.createFLow.hintError'),
            message:this.$t('deletePrompt.initiationProcessFailed'),
            type: "warning"
          });
        }
      } catch (error) {
        this.loading.close();
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.initiationProcessFailed'),
          type: "warning"
        });
      }
    },
    //保存下一节点审批人
    async confirmMemberDialog(memberList) {
      if (memberList.length > 0) {
        this.nextNodeDialogVisible = false;
        try {
           this.loading = this.$loading({
          lock: true,
          text:this.$t('workFlow.WFMenu.hintSubmit'),
          spinner: "el-icon-loading",
          background: "rgba(255, 255, 255, 0.7)"
        });
         await postAgainCandidate(memberList);
         this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.initiationProcessSuccessful'),
              type: "success"
            });
          this.close();//关闭弹窗
          this.loading.close();
        } catch (error) {
          this.loading.close();
        }
      } else {
        this.$notify({
          title:this.$t('workFlow.createFLow.hintError'),
          message:this.$t('workFlow.createFLow.hintSelectHandler'),
          type: "warning"
        });
        this.loading.close();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.inline {
  display: inline;
  margin: 0 10px;
}
</style>
