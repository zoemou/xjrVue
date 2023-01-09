<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('workFlow.userButtonSetting.tabFlowBtn')" name="first">
        <el-button size="small" @click="openForm">{{$t('workFlow.userButtonSetting.addBtn')}}</el-button>
        <el-table :data="btns" style="width: 100%;">
          <el-table-column :label="$t('workFlow.userButtonSetting.tableName')">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.check"
                :disabled="scope.row.disabled"
              ></el-checkbox>
              <el-button type="text" size="small">{{
                $t(scope.row.key)
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('workFlow.userButtonSetting.tableCode')" prop="val"> </el-table-column>
          <el-table-column :label="$t('workFlow.userButtonSetting.tableOperate')" width="200">
            <template slot-scope="scope">
              <el-select v-if="scope.row.act ===-1||scope.row.act == 1||scope.row.act == 3" v-model="scope.row.act">
                <el-option :key="0" :label="$t('workFlow.userButtonSetting.optionSelect')" :value="-1"></el-option>
                <el-option
                  :key="1"
                  :label="$t('workFlow.userButtonSetting.optionAllow')"
                  :value="1"
                ></el-option>
                <el-option
                  :key="2"
                  :label="$t('workFlow.userButtonSetting.optionOnlyAllowed')"
                  :value="3"
                ></el-option>
              </el-select>
              <span v-else-if="scope.row.act == 2">
                <el-button
                  size="small"
                  type="text"
                  @click="editBtn(scope.$index)"
                  >{{$t('tableOperationModule.editorBtn')}}</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  @click="deleteBtn(scope.$index)"
                  >{{$t('tableOperationModule.deleteBtn')}}</el-button
                >
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('workFlow.userButtonSetting.tabFunctionBtn')" name="second">
        <el-table :data="functionBtns" style="width: 100%;">
          <el-table-column :label="$t('workFlow.userButtonSetting.tableName')">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.check"
                :disabled="scope.row.disabled"
              ></el-checkbox>
              <el-button type="text" size="small">{{
               $t(scope.row.key) 
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('workFlow.userButtonSetting.tableCode')" prop="val"> </el-table-column>
          <el-table-column :label="$t('workFlow.userButtonSetting.tableOperate')" width="200">
            <span>-</span>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-dialogDrag
      :title="title"
      :visible.sync="showBtnForm"
      width="60%"
      :modal="false"
      :before-close="handleClose"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <el-form
        v-if="showBtnForm"
        :model="btnForm"
        :rules="rules"
        ref="btnForm"
        label-width="75px"
      >
        <el-form-item :label="$t('workFlow.userButtonSetting.btnName')" prop="key">
          <el-input v-model="btnForm.key"></el-input>
        </el-form-item>
        <el-form-item :label="$t('workFlow.userButtonSetting.btnCode')" prop="val">
          <el-input v-model="btnForm.val"></el-input>
        </el-form-item>
        <el-form-item :label="$t('workFlow.userButtonSetting.scriptTask')">
          <el-radio-group v-model="btnForm.type">
            <el-radio label="script">{{$t('workFlow.userButtonSetting.radioScript')}}</el-radio>
            <el-radio label="sql">{{$t('workFlow.Approver.titleSql')}}</el-radio>
            <el-radio label="api">API</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('workFlow.userButtonSetting.scriptFormat')" v-if="btnForm.type == 'script'">
          <el-select v-model="btnForm.info.taskscript.scriptformat">
            <el-option :label="$t('workFlow.userButtonSetting.optionSelect')" value=""></el-option>
            <el-option label="JavaScript" value="JavaScript"></el-option>
            <el-option label="Groovy" value="Groovy"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('workFlow.userButtonSetting.executeScript')" v-if="btnForm.type == 'script'">
          <el-input
            v-model="btnForm.info.taskscript.scripttext"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>

         <el-form-item :label="$t('workFlow.userButtonSetting.database')" v-if="btnForm.type == 'sql'">
            <el-select
              v-model="btnForm.info.tasksql.iframeData.F_ObjId"
              :placeholder="$t('workFlow.userButtonSetting.placeholderSelect')"
            >
              <el-option-group
                v-for="group in databasetableOptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.F_DatabaseLinkId"
                  :label="item.F_DBAlias||item.F_DBName"
                  :value="item.F_DatabaseLinkId"
                >
                </el-option>
              </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('workFlow.userButtonSetting.Sql')" v-if="btnForm.type == 'sql'">
          <span
              >
              <em class="sql-edit-button-click" @click="openSqlDialog"
                >{{$t('workFlow.userButtonSetting.editBtn')}}</em
              ></span
            >
            <el-input
              v-model="btnForm.info.tasksql.iframeData.sql"
              type="textarea"
              :rows="4"
              disabled
            ></el-input>
        </el-form-item>

         <div v-if="btnForm.type == 'api'">
           <div class="flex-box bt fw">
              <span class="flex-item opr el-icon-plus" @click="addApi"></span>
              <span class="flex-item">{{$t('workFlow.userButtonSetting.tableOperate')}}</span>
              <span class="flex-item">{{$t('workFlow.userButtonSetting.tableApiAddress')}}</span>
              <span class="flex-item">{{$t('workFlow.userButtonSetting.tableRequestWay')}}</span>
              <span class="flex-item"></span>
            </div>
            <div
              v-for="(item, index) in btnForm.info.taskapi.iframeData"
              :key="index"
              class="bt"
            >
              <div class="flex-box bt">
                <span class="flex-item opr" @click="delApi(index)">{{$t('tableOperationModule.deleteBtn')}}</span>
                <span class="flex-item opr" @click="addApiParams(index)"
                  >{{$t('workFlow.userButtonSetting.addParameterBtn')}}</span
                >
                <span class="flex-item">
                  <el-input v-model="item.apiUrl"></el-input>
                </span>
                <span class="flex-item">
                  <el-select v-model="item.method">
                    <el-option label="post" value="post"></el-option>
                    <el-option label="get" value="get"></el-option>
                  </el-select>
                </span>
              </div>
              <div>
                <div v-if="item.params.length > 0">
                  <div class="flex-box bt fw">
                    <span class="flex-item"></span>
                    <span class="flex-item"></span>
                    <span class="flex-item">{{$t('workFlow.userButtonSetting.tablePName')}}</span>
                    <span class="flex-item">{{$t('workFlow.userButtonSetting.tablePValue')}}</span>
                    <span class="flex-item">{{$t('workFlow.userButtonSetting.tableOperate')}}</span>
                  </div>
                  <div
                    class="flex-box bt"
                    v-for="(sbuItem, subIndex) in item.params"
                    :key="subIndex"
                  >
                    <span class="flex-item"></span>
                    <span
                      class="flex-item opr"
                      @click="delApiParams(index, subIndex)"
                      >{{$t('tableOperationModule.deleteBtn')}}</span
                    >
                    <span class="flex-item"
                      ><el-input v-model="sbuItem.name"></el-input
                    ></span>
                    <span class="flex-item">{{ sbuItem.params }}</span>
                    <span
                      class="flex-item opr"
                      @click="openApiDialog(index, subIndex)"
                      >{{$t('workFlow.userButtonSetting.addPValueBtn')}}</span
                    >
                  </div>
                </div>
              </div>
            </div>
        </div>
        <el-dialog v-dialogDrag
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="80%"
        append-to-body
        :close-on-click-modal="false"
        @closed="closeDialog"
      >
        <ApiRules
          v-if="dialogVisible && dialogType == 'Api'"
          :ruleNameList.sync="apiParamsTemplateData"
          :ruleTreelist="apiRuleTreelist"
          :ruleBtnList="ruleBtnList"
          :ruleTip="apiRuleTip"
        ></ApiRules>
        <SqlRules
          v-if="dialogVisible && dialogType == 'Sql'"
          :iframeData.sync="btnForm.info.tasksql.iframeData"
          :ruleTreelist="sqlRuleTreelist"
          :ruleTip="sqlRuleTip"
          ref = 'sqlRules'
        ></SqlRules>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
          <el-button size="small" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
        </span>
      </el-dialog>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SqlRules from "./../SqlRulesConfig";
import ApiRules from "./../ApiRulesConfig";
import { getDatabaseTableTree } from "@/api/databasemanage/databasetable";
import {
  scriptSqlTasksTree,
  scriptSqlRuleTip,
  scriptApiTasksTree,
  scriptApiRuleTip,
} from "./../../../data/rules";
import { changeVariableSourceList } from "./../../../common/util/variable";

export default {
  props: {
    fkbuttonpopu: {
      type: Array,
      default: () => {
        return [];
      }
    },
    functionButton: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
    components: {
    SqlRules,
    ApiRules,
  },
  data() {
    return {
      title:this.$t('workFlow.userButtonSetting.addBtn'),
      activeName: "first",
      sqlRuleMaplist:new Map(),
      showBtnForm: false,
      btnForm: {},
      rules: {
        key: [{ required: true, message:this.$t('workFlow.userButtonSetting.hintBtnName'), trigger: "blur" }],
        val: [{ required: true, message:this.$t('workFlow.userButtonSetting.hintBtnCode'), trigger: "blur" }]
      },
      btns: [],
      functionBtns: [],
      editIndex:0,
      dialogTitle: "",
      dialogType: "",
      dialogVisible: false,
      ruleBtnList: [],
      sqlRuleTreelist: [],
      sqlRuleTip: scriptSqlRuleTip,
      apiRuleTreelist: [],
      apiRuleTip: scriptApiRuleTip,
      apiParamsTemplateData: [],
      databasetableOptions: [],
    };
  },
  mounted() {
    this.btns = this.fkbuttonpopu;
    this.functionBtns = this.functionButton;
    this.getDataBaseTableList();
    let variableSourcelist = changeVariableSourceList({needButton:false});
    let variableTasksList = [...scriptSqlTasksTree,...variableSourcelist];
    let mapList = new Map();
    variableTasksList.forEach((ele,index) => {
      if(ele.children&&ele.children.length>0){
        if(ele.type=='resource'){//表单
          ele.children.forEach((item,itemIndex) => {
            if(item.children&&item.children.length>0){
              item.children.forEach((child,childIndex) => {
                let {children,drag,variableValueList,...value} = {...ele,...item,...child};
                let key = ele.label+'.'+item.label+'.'+child.label+'.'+index+'-'+itemIndex+'-'+childIndex;
                mapList.set(key,value);
                variableTasksList[index].children[itemIndex].children[childIndex].markKey = key;
              });
            }
        });
        }else{
          ele.children.forEach((item,itemIndex) => {
          let key = ele.label+'.'+item.label;
          mapList.set(key,item);
          variableTasksList[index].children[itemIndex].markKey = key;
        });
        }
      }
     
    });
    this.sqlRuleMaplist = mapList;
    this.sqlRuleTreelist = variableTasksList;
    this.apiRuleTreelist = variableTasksList;
  },
  methods: {
    getDataBaseTableList(){
       getDatabaseTableTree().then((res) => {
      if (res.data.success) {
        let obj = res.data.data;
        for (let [key, value] of Object.entries(obj)) {
          this.databasetableOptions.push({ label: key, options: value });
        }
      }
    });
    },
    openForm() {
      this.title = this.$t('workFlow.userButtonSetting.addBtn');
      const DefaultInfo = {
          taskscript: {
            scriptformat: "",
            scripttext: ""
          },
          taskapi: {
            iframeData: []
          },
          tasksql: {
            iframeData: {
              F_ObjId: "",
              html: "",
              sql: "",
              text: null,
              templateData: []
            }
          }
  };
      this.editIndex = 0;
      this.btnForm = {
        key: "",
        val: "",
        type: "script",
        info: DefaultInfo
      };
      this.showBtnForm = true;
    },
    handleClose() {
      this.showBtnForm = false;
    },
    handleSubmit() {
      this.$refs["btnForm"].validate(valid => {
        if (valid) {
          let info = {};
          if(this.btnForm.type=='script'){
            info = this.btnForm.info.taskscript;
          }else if(this.btnForm.type=='sql'){
            info = this.btnForm.info.tasksql;
          }else if(this.btnForm.type=='api'){
            info = this.btnForm.info.taskapi;
          }
          const btnInfo = {
            key: this.btnForm.key,
            val: this.btnForm.val,
            check: true,
            disabled: false,
            act: 2,
            type:this.btnForm.type,
            info
          };
          if(this.editIndex){
            this.btns[this.editIndex] = btnInfo;
          }else{
            this.btns.push(btnInfo);
          }
          this.showBtnForm = false;
        } else {
          return false;
        }
      });
    },
    editBtn(index) {
      this.title = this.$t('workFlow.userButtonSetting.editBtnTitle');
      this.editIndex = index;
      let tempFormInfo = this.btns[index];
      let info =tempFormInfo.info;
      const taskscript= {
        scriptformat: "",
        scripttext: ""
      };
      const taskapi={
        iframeData: []
      };
      const tasksql= {
        iframeData: {
          F_ObjId: "",
          html: "",
          sql: "",
          text: null,
          templateData: []
        }
      };
      if(tempFormInfo.type=='script'){
        this.btnForm = {
          key: tempFormInfo.key,
          val: tempFormInfo.val,
          type: tempFormInfo.type,
          info: {
            taskscript:info,
            taskapi,
            tasksql
          }
        };
      }else if(tempFormInfo.type=='sql'){
        this.btnForm = {
          key: tempFormInfo.key,
          val: tempFormInfo.val,
          type: tempFormInfo.type,
          info: {
            taskscript,
            taskapi,
            tasksql:info
          }
        };
      }else if(tempFormInfo.type=='api'){
        this.btnForm = {
          key: tempFormInfo.key,
          val: tempFormInfo.val,
          type: tempFormInfo.type,
          info: {
            taskscript,
            taskapi:info,
            tasksql
          }
        };
      } 
      this.showBtnForm = true;
    },
    deleteBtn(index) {
      this.btns.splice(index, 1);
    },
    submitDialog() {
      if (this.dialogType == "Sql") {
        let tasksqlText  = this.$refs.sqlRules.getTasksqlText();
        let arr = tasksqlText.split('%');
        let finalSql = '';
        let templateData = [];
        arr.forEach((ele,index) => {
          let beforeText = '';
            if(index%2){
              beforeText = arr[index-1];
              let val =  this.sqlRuleMaplist.get(ele);
              finalSql += beforeText+' '+ele+' ';
              if(val){
                templateData.push({beforeText,...val});
              }
            }
        });
        if(arr[arr.length-1]){
          let text = arr[arr.length-1];
          finalSql += ' '+text+' ';//最后一个字符串切割的
          templateData.push({
                name: text,
                beforeText:text,
                id: '',
                type:'text'
              });
        }
        finalSql = finalSql.replace(/\n/g,' ');
        this.btnForm.info.tasksql.iframeData.text = tasksqlText;
        this.btnForm.info.tasksql.iframeData.templateData = templateData;
        this.btnForm.info.tasksql.iframeData.sql = finalSql;
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.userButtonSetting.hintEditSuccess'),
          type: "success",
        });
      }
      if (this.dialogType == "Api") {
        let index = this.editApiIndex;
        let subIndex = this.editApiSubIndex;
        this.btnForm.info.taskapi.iframeData[index].params[
          subIndex
        ].templateData = this.apiParamsTemplateData;
        this.btnForm.info.taskapi.iframeData[index].params[
          subIndex
        ].params = this.apiParamsTemplateData
          .map((element) => {
            return element.name;
          })
          .join(".");
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.userButtonSetting.hintAddPValueSuccess'),
          type: "success",
        });
      }
      this.closeDialog();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openSqlDialog() {
      this.dialogTitle = this.$t('workFlow.userButtonSetting.sqlConfigTitle');
      this.dialogType = "Sql";
      this.dialogVisible = true;
    },
    openApiDialog(index, subIndex) {
      this.dialogTitle = this.$t('workFlow.userButtonSetting.apiConfigTitle');
      this.dialogType = "Api";
      this.editApiIndex = index;
      this.editApiSubIndex = subIndex;
      this.apiParamsTemplateData = this.btnForm.info.taskapi.iframeData[
        index
      ].params[subIndex].templateData;
      this.dialogVisible = true;
    },
    addApi() {
      let defaultJson = {
        apiUrl: "",
        method: "post",
        params: [],
      };
      this.btnForm.info.taskapi.iframeData.push(defaultJson);
    },
    delApi(index) {
      if (
        this.btnForm.info.taskapi.iframeData &&
        this.btnForm.info.taskapi.iframeData.length > 0
      ) {
        this.btnForm.info.taskapi.iframeData.splice(index, 1);
      }
    },
    addApiParams(index) {
      let defaultJson = {
        name: "",
        templateData: [],
        params: "",
      };
      this.btnForm.info.taskapi.iframeData[index].params.push(defaultJson);
    },
    delApiParams(index, subindex) {
      if (
        this.btnForm.info.taskapi.iframeData &&
        this.btnForm.info.taskapi.iframeData.length > 0 &&
        this.btnForm.info.taskapi.iframeData[index].params.length > 0
      ) {
        this.btnForm.info.taskapi.iframeData[index].params.splice(subindex, 1);
      }
    },
  }
};
</script>
<style scoped>
.el-form-item{
  height: 50px;
}
</style>
<style lang="scss" scoped>
.el-form{
  min-height: 500px;
  .el-select{
    width: 100%;
  }
  .el-radio__label{
    font-size: 12px;
  }
}

.sql-edit-button-click {
  font-style: normal;
  text-decoration: underline;
}
.flex-box {
  display: flex;
  .flex-item {
    flex-basis: 18%;
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
</style>
