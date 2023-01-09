<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.User.approvalComponent") }}</label>
      <el-radio-group
        v-model="formInfo.fkrelationregion.relationformem"
        @change="relationChange"
      >
        <el-radio :label="2">{{ $t("workFlow.User.radioUnrelated") }}</el-radio>
        <el-radio :label="1">{{ $t("workFlow.User.radioAssociate") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="formInfo.fkrelationregion.relationformem == 1">
      <el-form-item>
        <label>{{ $t("workFlow.User.approvalDisplay") }}</label>
        <el-radio-group v-model="formInfo.fkrelationregion.showapproval">
          <el-radio :label="2">{{ $t("workFlow.User.radioShowAll") }}</el-radio>
          <el-radio :label="1">{{
            $t("workFlow.User.radioShowResult")
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.User.signatureVerify") }}</label>
        <el-radio-group v-model="formInfo.fkrelationregion.needpassword">
          <el-radio :label="2">{{
            $t("workFlow.User.radioNeedPassword")
          }}</el-radio>
          <el-radio :label="1">{{
            $t("workFlow.User.radioUseDirectly")
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.User.associatedComponent") }}</label>
        <el-select
          v-if="isChangeFkrelationregion"
          v-model="formInfo.fkrelationregion.approvalcomponents"
          multiple
          :placeholder="$t('workFlow.User.selectAssociatedComponent')"
        >
          <el-option
            v-for="item in approvalComponentsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </template>
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
    },
    approvalComponentsOptions:{
      type:Array,
      default:()=>{
        return []
      }
    },
    isChangeFkrelationregion:false
  },
  methods: {
    relationChange() {
      if (this.formInfo.fkrelationregion.relationformem == 2) {
        this.formInfo.fkrelationregion.approvalcomponents = [];
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
