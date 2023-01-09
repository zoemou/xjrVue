<template>
  <div>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.templateNum")
        }}<em class="form-required">*</em></label
      >
      <el-input v-model="formInfo.F_Code"></el-input>
    </el-form-item>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.templateName")
        }}<em class="form-required">*</em></label
      >
      <el-input v-model="formInfo.F_Name"></el-input>
    </el-form-item>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.templateClassify")
        }}<em class="form-required">*</em></label
      >
      <el-select
        v-model="formInfo.F_Category"
        :placeholder="$t('workFlow.Process.placeholderSelect')"
        :disabled="isSpecialInitiationProcessDisabled"
      >
        <el-option
          v-for="item in processCategory"
          :key="item.F_ItemDetailId"
          :label="item.F_ItemName"
          :value="item.F_ItemDetailId"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.Process.namingRule") }}</label>
      <div class="el-input form-rule-box" @click="openDialog('Rules')">
        <template
          v-if="
            formInfo.ruleName &&
              formInfo.ruleName != '' &&
              formInfo.ruleName.length > 0
          "
        >
          <span
            v-for="(item, index) in formInfo.ruleName"
            :key="index"
            class="rule-item"
            >{{ item.name }}</span
          ></template
        >
        <template v-else
          ><span class="rule-item">{{
            $t("workFlow.Process.hintRule")
          }}</span></template
        >
      </div>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.Process.automaticRule") }}</label>
      <el-select
        v-model="formInfo.F_Agree"
        :placeholder="$t('workFlow.Process.placeholderSelectRule')"
        @change="changeAgree"
      >
        <el-option
          :label="$t('workFlow.Process.placeholderSelectRule')"
          value=""
        ></el-option>
        <el-option
          :label="$t('workFlow.Process.optionOne')"
          value="1"
        ></el-option>
        <el-option
          :label="$t('workFlow.Process.optionTwo')"
          value="2"
        ></el-option>
        <el-option
          :label="$t('workFlow.Process.optionThree')"
          value="3"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.designatedApprover") }}
        <em class="form-required">*</em></label
      >
      <el-radio-group v-model="formInfo.F_Assign" @change="changeAssign">
        <el-radio :label="true">{{ $t("workFlow.Process.radioYes") }}</el-radio>
        <el-radio :label="false">{{ $t("workFlow.Process.radioNo") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.Process.noCorrespond") }}</label>
      <el-select
        v-model="formInfo.F_Handle"
        :placeholder="$t('workFlow.Process.selectNoCorrespond')"
        @change="changeHandle"
      >
        <el-option
          :label="$t('workFlow.Process.optionAdmin')"
          value="1"
        ></el-option>
        <el-option
          :label="$t('workFlow.Process.optionPreviousNode')"
          value="2"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item>
      <label
        >{{ $t("workFlow.Process.myTask")
        }}<em class="form-required">*</em></label
      >
      <el-radio-group v-model="formInfo.F_Mark">
        <el-radio :label="1">{{ $t("workFlow.Process.radioAllow") }}</el-radio>
        <el-radio :label="2">{{
          $t("workFlow.Process.radioProhibit")
        }}</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.mobile")
        }}<em class="form-required">*</em></label
      >
      <el-radio-group v-model="formInfo.F_IsInApp">
        <el-radio :label="1">{{ $t("workFlow.Process.radioShow") }}</el-radio>
        <el-radio :label="2">{{ $t("workFlow.Process.radioHide") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.whetherInherit")
        }}<em class="form-required">*</em></label
      >
      <el-radio-group
        v-model="formInfo.isInheritStartNode"
        :disabled="isSpecialInitiationProcessDisabled"
      >
        <el-radio :label="false">{{
          $t("workFlow.Process.radioNotInherited")
        }}</el-radio>
        <el-radio :label="true">{{
          $t("workFlow.Process.radioInherited")
        }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.Process.remark") }}</label>
      <el-input
        v-model="formInfo.F_Description"
        type="textarea"
        :rows="4"
        :placeholder="$t('workFlow.Process.placeholderRemark')"
      ></el-input>
    </el-form-item>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
      class="dialog-box"
    >
      <Rules
        v-if="dialogVisible"
        ref="rules"
        :ruleNameList="formInfo.ruleName"
        :ruleTreelist="ruleTreelist"
        :ruleBtnList="ruleBtnList"
        :ruleTip="ruleTip"
      ></Rules>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button type="primary" @click="submitDialog" size="mini">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  processTasksTree,
  processTasksBtnList,
  processRuleTip
} from "./../../../data/rules";
import Rules from "./../RulesConfig";
export default {
  components: {
    Rules
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isSpecialInitiationProcessDisabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      dialogTitle: "标题",
      dialogVisible: false,
      ruleTreelist: processTasksTree,
      ruleBtnList: processTasksBtnList,
      ruleTip: processRuleTip
    };
  },
  computed: {
    processCategory() {
      return this.$store.state.workflow.workflowCategory;
    }
  },
  methods: {
    changeAgree(val){
      if(val==""){
      }else{
         this.formInfo.F_Assign = false;
         this.formInfo.F_Handle = "1";
      }
    },
    changeAssign(val){
      if(val){
        this.formInfo.F_Agree = "";
      }
    },
    changeHandle(val){
      if(val=="2"){
        this.formInfo.F_Agree = "";
      }
    },
    openDialog() {
      this.dialogTitle = this.$t("workFlow.Process.namingRule");
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    submitDialog() {
      this.formInfo.ruleName = this.$refs.rules.getRuleList();
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("workFlow.Process.addSuccess"),
        type: "success"
      });
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.rule-item {
  color: #606266;
  padding-left: 15px;
}

.form-rule-box {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
}
.mb-20 {
  margin-bottom: 10px !important; //强制更换el-form-item margin
}
</style>
