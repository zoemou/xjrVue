<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.taskscript.isActvate">
        <el-radio :label="false">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="true">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formInfo.taskscript.isActvate">
      <label>{{ $t("workFlow.userButtonSetting.scriptFormat") }}</label>
      <el-select v-model="formInfo.taskscript.scriptformat">
        <el-option
          :label="$t('workFlow.userButtonSetting.optionSelect')"
          value=""
        ></el-option>
        <el-option label="JavaScript" value="JavaScript"></el-option>
        <el-option label="Groovy" value="Groovy"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="formInfo.taskscript.isActvate">
      <label>{{ $t("workFlow.userButtonSetting.executeScript") }}</label>
      <el-input
        v-model="formInfo.taskscript.scripttext"
        type="textarea"
        :rows="4"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
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
