<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.formInitiationProcess.isOpen">
        <el-radio :label="0">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="1">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="formInfo.formInitiationProcess.isOpen">
      <el-form-item>
        <label>{{ $t("workFlow.Process.selectForm") }}</label>
        <FormInitiationProcessDialog
          :formInfo.sync="formInfo"
        ></FormInitiationProcessDialog>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.pointsNote") }}</label>
        <div>
          <div>{{ $t("workFlow.Process.noteOne") }}</div>
          <div>{{ $t("workFlow.Process.noteTwo") }}</div>
          <div>{{ $t("workFlow.Process.noteThree") }}</div>
          <div>{{ $t("workFlow.Process.noteFour") }}</div>
          <div>{{ $t("workFlow.Process.noteFive") }}</div>
        </div>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import FormInitiationProcessDialog from "./../schemeform/FormInitiationProcessDialog";
export default {
  components: {
    FormInitiationProcessDialog
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
