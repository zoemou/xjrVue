<template>
  <el-form size="small" label-width="90px">
    <el-form-item :label="$t('code.rightPanel.formName')">
      <el-input
        v-model="formConf.formRef"
        :disabled="true"
        :placeholder="$t('code.rightPanel.placeholderFormName')"
      />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.formModel')">
      <el-input
        v-model="formConf.formModel"
        :disabled="true"
        :placeholder="$t('code.rightPanel.placeholderFormModel')"
      />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.validationModel')">
      <el-input
        v-model="formConf.formRules"
        :disabled="true"
        :placeholder="$t('code.rightPanel.placeholderValidationModel')"
      />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.compSize')">
      <el-radio-group v-model="formConf.size">
        <el-radio-button label="medium">
          {{ $t("code.rightPanel.medium") }}
        </el-radio-button>
        <el-radio-button label="small">
          {{ $t("code.rightPanel.small") }}
        </el-radio-button>
        <el-radio-button label="mini">
          {{ $t("code.rightPanel.mini") }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.popupSize')">
      <el-radio-group v-model="formConf.formSize">
        <el-radio-button label="fullscreen">
          {{ $t("code.rightPanel.fullScreen") }}
        </el-radio-button>
        <el-radio-button label="medium">
          {{ $t("code.rightPanel.bigScreen") }}
        </el-radio-button>
        <el-radio-button label="small">
          {{ $t("code.rightPanel.middleScreen") }}
        </el-radio-button>
        <el-radio-button label="mini">
          {{ $t("code.rightPanel.smallScreen") }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.labelAlignment')">
      <el-radio-group v-model="formConf.labelPosition">
        <el-radio-button label="left">
          {{ $t("code.codeStepFour.alignLeft") }}
        </el-radio-button>
        <el-radio-button label="right">
          {{ $t("code.codeStepFour.alignRight") }}
        </el-radio-button>
        <el-radio-button label="top">
          {{ $t("code.rightPanel.alignTop") }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.labelWidth')">
      <el-input
        v-model.number="formConf.labelWidth"
        type="number"
        :placeholder="$t('code.rightPanel.placeholderLabelWidth')"
      />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.gridInterval')">
      <el-input-number
        v-model="formConf.gutter"
        :min="0"
        :disabled="true"
        :placeholder="$t('code.rightPanel.gridInterval')"
      />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.disableForm')">
      <el-switch v-model="formConf.disabled" />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.formBtn')">
      <el-switch v-model="formConf.formBtns" :disabled="true" />
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.showNoSelected')">
      <el-switch v-model="formConf.unFocusedComponentBorder" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
   props: [ 'formConf'],
};
</script>

<style lang="scss" scoped>
.el-radio-button__inner, .el-radio-group{
  display: flex;
}
</style>
