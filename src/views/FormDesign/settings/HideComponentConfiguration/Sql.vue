<template>
  <div class="config-box">
    <div class="el-input form-rule-box" @click="openDialog()">
      <span class="rule-item" v-if="sqlConfig.sql">{{ sqlConfig.sql }}</span>
      <span class="rule-item" v-else>{{$t("workFlow.selectSql.hintSqlStatement")}}</span>
      <i class="el-icon-more click-icon"></i>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="visible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
      class="dialog-box"
    >
       <div slot="title">
        {{ $t("workFlow.userButtonSetting.sqlConfigTitle") }}
      </div>
    <SqlConfig v-if="visible" :sqlConfig.sync="config" ref="sql"></SqlConfig>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog()">{{
        $t("buttonModule.modalCancelBtn")
      }}</el-button>
      <el-button type="primary" @click="submitDialog()" size="small">{{
        $t("buttonModule.modalSureBtn")
      }}</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/util/util';
import SqlConfig from './SqlConfig.vue';
  export default {
    props: {
    sqlConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
    components: {
      SqlConfig,
    },
    data() {
      return {
        notifyIndex:1,
        visible: false,
        config:{
           database: "",
           field: "",
           sql: "",
        }
      }
    },
    
    methods: {
      openDialog() {
        this.notifyIndex = 1;
        this.config = deepClone(this.sqlConfig);
        this.visible = true;
      },
      closeDialog(){
        this.visible = false;
      },
      notifyError(message){
        this.$notify({
            type: 'warning',
            title:this.$t('editorModule.warn'),
            message,
            offset: 100*this.notifyIndex,
            duration:2000+(this.notifyIndex*1000)
          });
        this.notifyIndex++;
    },
      submitDialog(){
        let validate = true;
        let config = this.$refs.sql.getForm();
        if(!config.database){
          this.notifyError(this.$t('workFlow.selectSql.hintSelectData'));
          validate = false;
        }
        if(!config.sql){
          this.notifyError(this.$t('workFlow.selectSql.hintSqlStatement'));
          validate = false;
        }
         if(!config.field){
          this.notifyError(this.$t('selectBindField'));
          validate = false;
        }
        if(validate){
          this.closeDialog();
          this.$emit('submitSql',config);
        }
        
       
      }
    },
  }
</script>

<style lang="scss" scoped>
.config-box{
  height: 30px;
}
.click-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #606266;
  z-index: 2;
  background-color: #fff;
}
.form-rule-box {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
  position: relative;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  .rule-item{
    display: inline-block;
    text-align: left;
    color: #606266;
    padding-left: 15px;
    overflow: hidden;
    text-overflow: inherit;
    white-space: nowrap;
    width: 200px;
  }
}
</style>