<template>
  <div>
    <el-form-item class="mb-20">
      <el-button size="mini" @click="addParameters">{{$t('workFlow.userButtonSetting.addParameterBtn')}}</el-button>
      <el-button size="mini" type="primary" plain @click="submitForm">{{$t('forgetPass.submitBtn')}}</el-button>
    </el-form-item>
    <el-form-item>
      <div class="flex-box bt fw">
        <span class="flex-item">{{$t('workFlow.userButtonSetting.tablePName')}}</span>
        <span class="flex-item">{{$t('parameterType')}}</span>
        <span class="flex-item">{{$t('workFlow.userButtonSetting.tablePValue')}}</span>
        <span class="flex-item"></span>
      </div>
      <div v-for="(item, index) in parameters" :key="index" class="bt">
        <div class="flex-box bt">
          <span class="flex-item">
            <el-input v-model="item.name"></el-input>
          </span>
          <span class="flex-item">
            <el-select v-model="item.type">
              <el-option :label="$t('workFlow.zh.value')" value="value"></el-option>
              <el-option :label="$t('workFlow.zh.variable')" value="variable"></el-option>
              <el-option :label="$t('quoteSql')" value="sql"></el-option>
              <el-option :label="$t('quoteApi')" value="api"></el-option>
            </el-select>
          </span>
          <span class="flex-item">
            <el-input
              v-if="item.type == 'value'"
              v-model="item.info.taskvalue.value"
            ></el-input>
            <el-input
              v-else
              v-model="item.showValue"
              :placeholder="$t('setParameterValue')"
              suffix-icon="el-icon-more"
              @focus="openParameterDialog(index)"
            ></el-input>
          </span>
          <span class="flex-item opr" @click="delParameters(index)">{{$t('forme.editModal.deleteBtn')}}</span>
        </div>
      </div>
    </el-form-item>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
      class="param-dialog-box"
    >
      <Rules
        v-if="dialogVisible && dialogType == 'VariableRules'"
        ref="rules"
        :ruleNameList="variableRulesList"
        :ruleTreelist="ruleTreelist"
        :ruleTip="ruleTip"
      ></Rules>
      <SqlConfig
        v-if="dialogVisible && dialogType == 'SqlConfig'"
        ref="SqlConfig"
        :sqlConfig="sqlConfig"
      >
      </SqlConfig>
      <ApiConfig
        v-if="dialogVisible && dialogType == 'ApiConfig'"
        ref="ApiConfig"
        :apiConfig="apiConfig"
      >
      </ApiConfig>
      <span slot="footer" class="dialog-footer" v-if="dialogButtonVisible">
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
import Rules from "./../RulesConfig";
import SqlConfig from "./components/SqlConfig";
import ApiConfig from "./components/ApiConfig";
import {
  processTasksTree,
  processTasksBtnList,
  processRuleTip
} from "./../../../data/rules";
import { deepClone } from '@/util/util';
export default {
  components: {
    Rules,
    SqlConfig,
    ApiConfig
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data() {
    return {
      ids:[],
      dialogTitle: "标题",
      dialogVisible: false,
      dialogType: "",
      dialogButtonVisible: true,
      ruleTreelist: processTasksTree,
      ruleBtnList: processTasksBtnList,
      ruleTip: processRuleTip,
      variableRulesList: [],
      parameterIndex: -1,
      sqlConfig: {},
      apiConfig: {},
      parameters:[]
    };
  },
  created () {
    if(this.formInfo.parameters&&this.formInfo.parameters.length>0){
      this.parameters = deepClone(this.formInfo.parameters);
      this.parameters.forEach(ele => {
        this.ids.push(ele.id);
      });
    }
  },
  methods: {
    randomString(length){
      let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = 'xjr';
      for (let i = length; i > 0; --i) {
         result += str[Math.floor(Math.random() * str.length)];
      }
       
      return result;
    },
    setId(){
      let id = this.randomString(12);
      if(this.ids.includes(id)){
        return this.setId();
      }else{
        this.ids.push(id);
        return id;
      }
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openDialog(type) {
      this.dialogType = type;
      switch (type) {
        case "VariableRules":
          this.dialogTitle = this.$t('addProParaParaValueVar');
          break;
        case "SqlConfig":
          this.dialogTitle = this.$t('addFlowParaParaValueSql');
          break;
        case "ApiConfig":
          this.dialogTitle = this.$t('apiConfig');
          break;
        default:
          break;
      }
      this.dialogButtonVisible = true;
      this.dialogVisible = true;
    },
    submitDialog() {
      if (this.dialogType == "VariableRules") {
        this.submitVariableRules();
      } else if (this.dialogType == "SqlConfig") {
        this.submitSqlConfig();
      } else if (this.dialogType == "ApiConfig") {
        this.submitApiConfig();
      }
    },
    submitVariableRules() {
      let iframeData = this.$refs.rules.getRuleList();
      let value = "";
      if (iframeData && Array.isArray(iframeData) && iframeData.length > 0) {
        value = iframeData
          .map(ele => {
            return ele.name;
          })
          .join("-");
      }
      this.parameters[this.parameterIndex].info.taskvariable = {
        value,
        iframeData
      };
      this.parameters[this.parameterIndex].showValue = value;
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("workFlow.Process.addSuccess"),
        type: "success"
      });
      this.dialogVisible = false;
    },
    submitSqlConfig() {
      let form = this.$refs.SqlConfig.getForm();
      if (form && form.database && form.field && form.sql) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Process.addSuccess"),
          type: "success"
        });
        this.parameters[this.parameterIndex].showValue = form.sql;
        this.parameters[this.parameterIndex].info.tasksql = form;
        this.dialogVisible = false;
      } else {
        if (!form.database || form.database == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('noDatabaseSelect'),
            type: "warning"
          });
        } else if (!form.sql || form.sql == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('noSqlFill'),
            type: "warning"
          });
        } else if (!form.field || form.field == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message:this.$t('noDataFieldSelect'),
            type: "warning"
          });
        }
      }
    },
    submitApiConfig() {
      let config = this.$refs.ApiConfig.getConfig();
      if (config && config.apiUrl) {
        // let params = [];
        // if (config.params && config.params.length > 0) {
        //   params = config.params.filter(ele => { return ele.paramValType===''||ele.paramValue==='' });
        // }
        // if (params.length > 0) {
        //     this.$notify({
        //       title: this.$t("deletePrompt.promptTitle"),
        //       message: this.$t('parameterValueTypeParameterValueCannotNull'),
        //       type: "warning"
        //     });
        // } else {
			this.$notify({
			  title: this.$t("deletePrompt.promptTitle"),
			  message: this.$t("workFlow.Process.addSuccess"),
			  type: "success"
			});
			this.parameters[this.parameterIndex].showValue = config.apiUrl;
			this.parameters[this.parameterIndex].info.taskapi = config;
			this.dialogVisible = false;         
        //}
      }
    },
    delAssociatedTasks(index) {
      if (
        this.formInfo.relevanceTask.tableData &&
        this.formInfo.relevanceTask.tableData.length > 0
      ) {
        this.formInfo.relevanceTask.tableData.splice(index, 1);
      }
    },
    addParameters() {
      let id = this.setId();
      let defaultJson = {
        id: id, //生成唯一id
        name: '', //参数名
        type: "variable", //参数类型
        showValue: "", //参数显示值
        info: {
          taskvalue: {
            value: ""
          },
          taskvariable: null,
          taskapi: null,
          tasksql: null
        }
      };
      this.parameters.push(defaultJson);
    },
    openParameterDialog(index) {
      this.parameterIndex = index;
      let type = this.parameters[index].type;
      this.parameters[this.parameterIndex].info.showValue = "";
      if (type === "variable") {
        this.variableRulesList = [];
        if (
          this.parameters[index].info &&
          this.parameters[index].info.taskvariable &&
          this.parameters[index].info.taskvariable.iframeData
        ) {
          this.variableRulesList = this.parameters[
            index
          ].info.taskvariable.iframeData;
        }
        this.openDialog("VariableRules");
      } else if (type === "sql") {
        this.sqlConfig = {};
        if (
          this.parameters[index].info &&
          this.parameters[index].info.tasksql &&
          this.parameters[index].info.tasksql
        ) {
          this.sqlConfig = this.parameters[index].info.tasksql;
        }
        this.openDialog("SqlConfig");
      } else if (type === "api") {
        this.apiConfig = {};
        if (
          this.parameters[index].info &&
          this.parameters[index].info.taskapi &&
          this.parameters[index].info.taskapi
        ) {
          this.apiConfig = this.parameters[index].info.taskapi;
        }
        this.openDialog("ApiConfig");
      }
    },
    delParameters(index) {
      if (this.parameters && this.parameters.length > 0) {
        this.parameters.splice(index, 1);
      }
    },
    submitForm(){
      if(this.parameters.length>0){
        let nameParameters =this.parameters.filter((ele)=>{
          return ele.name
        });
         if(nameParameters.length==this.parameters.length){
           this.formInfo.parameters = this.parameters;
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('addProParaSuccess'),
            type: "success"
          });
        }else{
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('paraNameNoEmpty'),
            type: "warning"
          });
        }
      }else{
        this.formInfo.parameters = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  .flex-item {
    flex-basis: 24%;
    line-height: 40px;
    height: 40px;
    margin-left: 1%;
    margin-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.bt {
  border-bottom: 1px solid #e4e4e4;
}
.fw {
  font-weight: 700;
}
.opr {
  color: #02a7f0;
  cursor: pointer;
}
.param-dialog-box{
	::v-deep .el-dialog{
		height: calc(100% - 30vh);
		.el-dialog__body{
			height: calc(100% - 120px);
		}
	}
} 
</style>
