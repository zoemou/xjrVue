<template>
  <div>
    <el-form
      :rules="btnRules"
      ref="exportForm"
      :model="exportForm"
      label-width="80px"
    >
      <el-form-item prop="f_column" :label="$t('importAndExport.excelExport.labelName')">
        <el-input
          :placeholder="$t('importAndExport.excelExport.placeholderName')"
          size="small"
          v-model="exportForm.f_column"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    exportForm: {
      type: Object,
      default: ()=>{
        return {
          f_column:""
        }
      }
    },
  },
  data() {
    return {
      btnRules: {
        f_column: [
          { required: true, message: this.$t('importAndExport.excelExport.placeholderName'), trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs['exportForm'].validate((valid) => {
        return valid;
      });
    }
  },
};
</script>

<style lang="scss" scoped></style>
