<template>
  <div>
    <div class="form-box">
      <el-form label-position="top" class="box-form-item">
        <el-form-item>
          <label>{{$t('workFlow.schemeFormIndex.tabFormType')}}<em class="form-required">*</em></label>
          <el-select
            :placeholder="$t('workFlow.selectSql.placeholderSelect')"
            v-model="scheme.type"
            @change="changeSchemeType"
          >
            <el-option :label="$t('workFlow.formInitiationProcessDialog.typeCusForm')" :key="0" :value="0"></el-option>
            <el-option :label="$t('workFlow.formInitiationProcessDialog.typeSysForm')" :key="2" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <label>{{$t('workFlow.schemeFormDialog.formSelect')}}<em class="form-required">*</em></label>
          <el-select
            v-model="scheme.name"
            :placeholder="$t('workFlow.selectSql.placeholderSelect')"
            value-key="label"
            @change="changeScheme"
            filterable
          >
            <el-option
              v-for="item in selectSchemeList"
              :key="item.F_Id"
              :label="item.F_Name"
              :value="item.F_Id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <label>{{$t('workFlow.schemeFormDialog.formPreview')}} <em class="form-required">*</em></label>
          <div class="el-select">
            <el-button size="small" @click="preview">{{$t('workFlow.schemeFormDialog.previewBtn')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <label>{{$t('workFlow.schemeFormIndex.tabFormID')}} <em class="form-required">*</em></label>
          <el-input v-model="scheme.id" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <label>{{$t('workFlow.schemeFormIndex.tabFormName')}}</label>
          <el-input v-model="scheme.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.schemeFormDialog.previewBtn')"
      :visible.sync="previewVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closedDialog"
       width="60%"
      append-to-body
    >
      <div class="form-box scroll-box" v-if="previewVisible && scheme.type == 0">
        <FormParser :conf="conf" fromPage="preview"></FormParser>
      </div>
      <div class="form-box scroll-box wrap" v-if="previewVisible && scheme.type == 2">
       <SystemForm   type='1' :componentUrl='previewUrl'></SystemForm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FormParser from "@/components/codeParser/FormParser"; //导入解析组件
import SystemForm from '@/components/codeParser/SystemForm.vue';
import {splitComponent} from "@/config/codeParser.js";
export default {
  components: {
    FormParser,
    SystemForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scheme: {
      type: Object
    },
    selectSchemeList: {
      type: Array
    },
        component: {
      type: String,
      default: ""
    },
  },
  created() {
    this.previewVisible = false;
  },
  data() {
    return {
      previewVisible: false,
      conf:{},
      previewUrl:''
    };
  },
  methods: {
    preview() {
      this.conf = this.scheme.schemeInfoData;
      if(this.scheme&&this.scheme.id){
         if(this.scheme.component){
        this.previewUrl = splitComponent(this.scheme.component);
        }
        this.previewVisible = true;
      }else{
        this.$message(this.$t('workFlow.formInitiationProcessDialog.selectForm'));
      }
    },
    changeSchemeType() {
      this.$emit("changeSchemeType");
    },
    changeScheme(value) {
      this.$emit("changeScheme", value);
    },
    closedDialog(){
      this.previewVisible = false;
    }
  }
};
</script>

<style lang="css" scoped>
.form-box{
	padding: 0 20px 0 0;
}
.form-box /deep/ .el-select {
  width: 100%;
}
.form-box .box-form-item /deep/ .el-form-item__content {
  display: flex;
  font-size: 12px;
}
.form-box /deep/ .el-form-item__content label {
  width: 85px;
}
.scroll-box{
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 600px;
}
.wrap {
  display: flex;
  min-height: 600px;
}
.iframe-box {
  width: 100%;
  border: 0;
}
.iframe-box /deep/ .el-dialog__header {
  display: none;
}
</style>
