<template>
  <el-dialog
    v-dialogDrag
    :title="diologTitle"
    :append-to-body="true"
    :visible="true"
    :close-on-click-modal="false"
    width="60%"
    hight="60%"
    :before-close="handleClose"
    style="padding: 10px 20px"
  >
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-bottom: 10px"
    >
      <el-step :title="$t('menuManagement.addModal.stepOne')"></el-step>
      <el-step :title="$t('menuManagement.addModal.stepTwo')"></el-step>
      <el-step :title="$t('listInfor')"></el-step>
      <el-step :title="$t('menuManagement.addModal.stepFour')"></el-step>
    </el-steps>
    <div class="baseinfo-form">
      <component
        :is="getComponent"
        :menuParams.sync="menuParams"
        ref="menu"
      ></component>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="active != 0"
        @click="previousStep"
        size="mini"
        type="primary"
        :loading="flagFunc"
        >{{$t('workFlow.Step1.stepBackBtn')}}</el-button
      >
      <el-button
        v-if="active != 3"
        @click="nextStep"
        size="mini"
        type="primary"
        :loading="flagFunc"
        >{{$t('workFlow.Step1.nextStepBtn')}}</el-button
      >
      <el-button
        @click="userFormSubmit"
        size="mini"
        type="primary"
        :loading="flagFunc"
        >{{ flagFunc ? $t("workFlow.WFMenu.hintSubmit") : $t('code.codeForm.completeBtn') }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import Basic from "./menu/Basic.vue";
import Buttons from "./menu/Buttons.vue";
import Columns from "./menu/Columns.vue";
import Forms from "./menu/Forms.vue";
import { addFunc, updateFunc ,getFuncInfo } from "@/api/organization/mobileFunc";
export default {
  components: {
    Basic,
    Buttons,
    Columns,
    Forms,
  },
  props: {
    FuncId: {
      type: String,
    },
    funcType: {
      type: Number,
    },
  },
  data() {
    return {
      flagFunc: false,
      active: 0,
      menuParams: {
        function: {
          F_Name: "",
          F_Type: null,
          F_TypeName: null,
          F_SortCode: "",
          F_Url: "",
          F_Icon: "",
        },
        buttonList: [],
        columnList: [],
        formList: [],
      },
    };
  },
  computed: {
    getComponent() {
      switch (this.active) {
        case 0:
          return "Basic";
        case 1:
          return "Buttons";
        case 2:
          return "Columns";
        case 3:
          return "Forms";
        default:
          return "Basic";
      }
    },
    diologTitle(){
        return this.FuncId?this.$t('editMobileFunction'):this.$t("addedMobileFunction");
    }
  },
  async created () {
    if(this.FuncId){
        try {
          let res = await getFuncInfo(this.FuncId);
          if(res.data.success){
            this.menuParams = {...this.menuParams,...res.data.data};
          }
        } catch (error) {}
    }
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", false);
    },
    handleSuccess() {
      this.$emit("closeDialog", true);
    },
    previousStep() {
      this.active--;
    },
    async nextStep() {
      if (this.active == 0) {
        try {
          let validate = await this.$refs.menu.validateForm();
          if (validate) this.active++;
        } catch (error) {}
      } else {
        this.active++;
      }
    },
    showMessage(type, status) {
      let msg =
        type == "add"
          ? status == "ok"
            ? this.$t("addedMobileMenuSuccessfully")
            : this.$t("failedToAddMobileMenu")
          : status == "ok"
          ? this.$t("modifiedMobileMenuSuccessfully")
          : this.$t("failedToModifyMobileMenu");
      this.$notify({
        title: this.$t("deletePrompt.successTitle"),
        message: msg,
        type: status == "ok" ? "success" : "error",
      });
      this.flagFunc = false;
    },
    async userFormSubmit() {
    let validate = false;
    if (this.active == 0) {
        try {
          validate = await this.$refs.menu.validateForm();
        } catch (error) {}
    }else{
        validate = true;
    }
    if(validate){
        this.flagFunc = true;
        try {
            if (this.FuncId) {// 修改
            let result = await updateFunc(this.FuncId, this.menuParams);
            let res = result.data;
            if (res.success) {
            this.showMessage("edit", "ok");
            this.handleSuccess();
            } else {
            this.showMessage("edit", "no");
            }
        } else { // 添加
            let result = await addFunc(this.menuParams);
            let res = result.data;
            if (res.success) {
            this.showMessage("add", "ok");
            this.handleSuccess();
            } else {
            this.showMessage("add", "no");
            }
        }
        } catch (error) {
            this.flagFunc = false;
        }
    }
      
    },
  },
};
</script>

<style lang="scss" scoped>
.baseinfo-form{
    height: 310px;
}
</style>
