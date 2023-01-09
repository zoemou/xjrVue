<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.tasksql.isActvate">
        <el-radio :label="false">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="true">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formInfo.tasksql.isActvate">
      <label>{{ $t("workFlow.userButtonSetting.database") }}</label>
      <!-- <el-select v-model="formInfo.tasksql.iframeData.F_ObjId">
              <el-option label="===请选择===" value=""></el-option>
            </el-select> -->
      <el-select
        v-model="formInfo.tasksql.iframeData.F_ObjId"
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
    <el-form-item v-if="formInfo.tasksql.isActvate">
      <label
        >{{ $t("workFlow.userButtonSetting.Sql") }}
        <em class="sql-edit-button-click" @click="openSqlDialog">{{
          $t("workFlow.userButtonSetting.editBtn")
        }}</em></label
      >
      <el-input
        v-model="formInfo.tasksql.iframeData.sql"
        type="textarea"
        :rows="4"
        disabled
      ></el-input>
    </el-form-item>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
	  class="param-dialog-box"
    >
      <SqlRules
        v-if="dialogVisible"
        :iframeData.sync="formInfo.tasksql.iframeData"
        :ruleTreelist="sqlRuleTreelist"
        :ruleTip="sqlRuleTip"
        ref="sqlRules"
      ></SqlRules>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="submitDialog">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SqlRules from "./../SqlRulesConfig";
import { changeVariableSourceList } from "./../../../common/util/variable";
import { scriptSqlTasksTree, scriptSqlRuleTip } from "./../../../data/rules";
import { getProcessParametersData } from "./../../../common/util/properties";
import { getDatabaseTableTree } from "@/api/databasemanage/databasetable";
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    SqlRules
  },
  data() {
    return {
      dialogTitle: "",
      dialogVisible: false,
      sqlRuleMaplist: new Map(),
      sqlRuleTreelist: [],
      sqlRuleTip: scriptSqlRuleTip,
      databasetableOptions: []
    };
  },
  async mounted() {
    let res = await getDatabaseTableTree();
    if (res.data && res.data.success) {
      let obj = res.data.data;
      for (let [key, value] of Object.entries(obj)) {
        this.databasetableOptions.push({ label: key, options: value });
      }
    }

    let variableSourcelist = changeVariableSourceList({ needButton: false,needHideComponents:true });
    //增加流程参数
    let variableRulesList = getProcessParametersData();
    let scriptSqlTasksList = [
      ...scriptSqlTasksTree,
      ...variableRulesList,
      ...variableSourcelist
    ];
    let mapList = new Map();
    scriptSqlTasksList.forEach((ele, index) => {
      if (ele.children && ele.children.length > 0) {
        if (ele.type == "resource") {
          //表单
          ele.children.forEach((item, itemIndex) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((child, childIndex) => {
                let { children, drag, variableValueList, ...value } = {
                  ...ele,
                  ...item,
                  ...child
                };
                let key =
                  ele.label +
                  "." +
                  item.label +
                  "." +
                  child.label +
                  "." +
                  index +
                  "-" +
                  itemIndex +
                  "-" +
                  childIndex;
                mapList.set(key, value);
                scriptSqlTasksList[index].children[itemIndex].children[
                  childIndex
                ].markKey = key;
                if(child&&child.children&&child.children.length>0){
                  child.children.forEach((c2,i2) => {
                    let key =
                        ele.label +
                        "." +
                        item.label +
                        "." +
                        child.label +
                        "." +
                        c2.label +
                        "." +
                        index +
                        "-" +
                        itemIndex +
                        "-" +
                        childIndex+
                        "-" +
                        i2;
                        mapList.set(key, c2);
                        scriptSqlTasksList[index].children[itemIndex].children[
                          childIndex
                        ].children[i2].markKey = key;
                    });
                    
                }
              });
              
            }
          });
        } else {
          ele.children.forEach((item, itemIndex) => {
            let key = ele.label + "." + item.label;
            mapList.set(key, item);
            scriptSqlTasksList[index].children[itemIndex].markKey = key;
          });
        }
      }
    });
    this.sqlRuleMaplist = mapList;
    this.sqlRuleTreelist = scriptSqlTasksList;
  },
  methods: {
    submitDialog() {
      let tasksqlText = this.$refs.sqlRules.getTasksqlText();
      let arr = tasksqlText.split("``");
      let finalSql = "";
      let templateData = [];
      arr.forEach((ele, index) => {
        let beforeText = "";
        if (index % 2) {
          beforeText = arr[index - 1];
          let val = this.sqlRuleMaplist.get(ele);
          finalSql += beforeText + " " + ele + " ";
          if (val) {
            templateData.push({ beforeText, ...val, afterText: "" });
          }
        }
      });
      if (arr[arr.length - 1]) {
        let text = arr[arr.length - 1];
        finalSql += " " + text + " "; //最后一个字符串切割的
        templateData.push({
          beforeText: text,
          afterText: "",
          name: "",
          id: "",
          type: "text"
        });
      }
      finalSql = finalSql.replace(/\n/g, " ");
      this.formInfo.tasksql.iframeData.text = tasksqlText;
      this.formInfo.tasksql.iframeData.templateData = templateData;
      this.formInfo.tasksql.iframeData.sql = finalSql;
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("workFlow.userButtonSetting.hintEditSuccess"),
        type: "success"
      });
      this.closeDialog();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openSqlDialog() {
      this.dialogTitle = this.$t("workFlow.userButtonSetting.sqlConfigTitle");
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.sql-edit-button-click {
  font-style: normal;
  text-decoration: underline;
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
