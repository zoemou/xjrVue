<template>
  <el-form
    ref="menuForm"
    :model="menuForm"
    label-width="80px"
    class="form-box"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item prop="F_Name" :label="$t('formDesign.labelName')">
          <el-input
            :placeholder="$t('custmerForm.classifiedManagement.Hint.formName')"
            size="small"
            v-model="menuForm.F_Name"
            @blur="checkMenuForm"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="F_Category" :label="$t('formDesign.labelSort')">
          <el-select
            v-model="menuForm.F_Category"
            :placeholder="$t('formDesign.placeholderSelectSort')"
            size="small"
            style="width: 100%"
            @change="checkMenuForm"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.F_ItemDetailId"
              :label="item.F_ItemName"
              :value="item.F_ItemValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item :label="$t('formDesign.labelFunctionDescription')">
          <el-input
            type="textarea"
            :placeholder="$t('formDesign.placeholderWriteFunctionDescription')"
            size="small"
            v-model="menuForm.F_Description"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    categoryList: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    menuForm: {
      type: Object,
      default: ()=>{
        return {
        F_Category: '',
        F_Name: ''
      }
      }
    },
  },
  methods: {
    checkMenuForm(){
      this.$emit('checkMenuForm')
    },
  },
};
</script>

<style lang="scss" scoped>
.form-box{
  padding: 20px;
}
</style>
