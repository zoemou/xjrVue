<template>
  <div class="sql-box">
    <el-form-item>
      <label>{{$t('workFlow.selectSql.database')}}</label>
      <el-select v-model="ObjId" :placeholder="$t('workFlow.selectSql.placeholderSelect')">
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
    <el-form-item>
      <label>{{$t('workFlow.selectSql.formField')}}</label>
      <el-select v-model="fileds"  ref="variableSourceSelect">
        <el-option :value="fileds" :label="fileds">
          <el-tree
            :data="sourceList"
            :props="sourceDefaultProps"
            accordion
            @node-click="changeVariableSource"
          >
          </el-tree>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <label>{{$t('workFlow.selectSql.sqlStatement')}}</label>
    </el-form-item>
    <CodemirrorSql style="width:100%;height:200px;"
           :placeholder="$t('fillSqlEg')"
            v-model="sql"
            ref="sql"
          ></CodemirrorSql>
    <el-form-item>
      <label
        >{{$t('workFlow.selectSql.hintSqlConfig')}}<em class="mark-em"
          >{{$t('workFlow.selectSql.hintProhibitUse')}}</em
        ><br />
          {{$t('workFlow.selectSql.hintCanNotNotPass')}}
      </label>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="testSql" size="mini"
        >{{$t('workFlow.selectSql.queryResultsBtn')}}</el-button
      >
    </el-form-item>
    <el-form-item>
      <label
        >{{$t('workFlow.selectSql.hintPrecautions')}}<em class="mark-em"
          >{{$t('workFlow.selectSql.hintUnableApprove')}}</em
        ></label
      >
    </el-form-item>
    <el-form-item>
      <avue-empty :desc="$t('deletePrompt.noData')" v-if="userIdData.length == 0"></avue-empty>
      <avue-crud
        v-else
        :data="userIdData"
        :option="option"
        :page.sync="page"
        @on-load="onLoad"
      ></avue-crud>
    </el-form-item>
  </div>
</template>

<script>
import { NodeName } from "./../../../../lang/zh";
import { getDatabaseTableTree } from "@/api/databasemanage/databasetable";
import { getDbLinksTestSql } from "@/api/databasemanage/databaselink";
import { v4 as uuidv4 } from "uuid";
import CodemirrorSql from "@/components/common/CodemirrorSql";
export default {
  components: {
    CodemirrorSql
  },
  props: {
    selectedList: {
      type: Array
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      ObjId: "",
      fileds: "",
      sql: "",
      sourceList: [],
      sourceDefaultProps: {
        children: "children",
        label: "label"
      },
      templateData: [],
      databasetableOptions: [],
      page: {
        pageSize: 5,
        pagerCount: 5
      },
      userIdAllData: [],
      userIdData: [],
      option: {
        addBtn: false,
        editBtn: false,
        menu: false,
        refreshBtn: false,
        columnBtn: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "UserId",
            prop: "F_UserId"
          }
        ]
      },
      sql:"",
      sqlRuleMaplist:new Map()
    };
  },
  mounted() {
    getDatabaseTableTree().then(res => {
      if (res.data.success) {
        let obj = res.data.data;
        for (let [key, value] of Object.entries(obj)) {
          this.databasetableOptions.push({ label: key, options: value });
        }
      }
    });

    let info = this.$store.state.bpmn.info;
    let options = [];
    for (let value of info.values()) {
      let showNodeTypes = ["bpmn:StartEvent", "bpmn:UserTask"];
      let id = value.id;
      let name = value.name;
      let type = value.type;
      let resourceName = NodeName[type] + (name ? "-" + name : "");
      if (showNodeTypes.includes(type)) {
        let tableData = value.tableData;
        let tempJson = {
          id: id,
          label: resourceName,
          type: "resource",
          children: []
        };
        let children = this.getFormSourceChildren(id, resourceName, tableData);
        if (children.length > 0) {
          tempJson.children = children;
          options.push(tempJson);
        }
      }
    }
    this.sourceList = options;
  },
  methods: {
    getFormSourceChildren(resourceId, resourceName, tableData) {
      let children = [];
      tableData.forEach((ele1,index1) => {
        let formName = ele1.F_Name;
        let formId = ele1.F_Id;
        let subJson = {
          id: resourceId + formId,
          label: formName,
          type: "form",
          children: []
        };
        if (ele1.children.length > 0) {
          ele1.children.forEach((ele2,index2) => {
            if (ele2.fieldsId) {
              let markId = resourceId + formId + ele2.fieldsId;
              subJson.children.push({
                id: markId,
                beforeText: "",
                afterText: "",
                bindTable:ele2.bindTable,
                label: ele2.fieldsName,
                F_ObjId: ele2.fieldsId,
                F_ObjName:
                  resourceName + "•" + formName + "•" + ele2.fieldsName,
                fieldId: ele2.fieldsId,
                fieldName: ele2.fieldsName,
                resourceId,
                resourceName,
                formName,
                formId,
                index1,
                index2,
                type: "condition"
              });
            }
          });
        }
        children.push(subJson);
      });
      return children;
    },
    changeVariableSource(value) {
      let type = value.type;
      if (!value.children) {
        if (type == "condition") {
          let name = value.resourceName + "-" + value.formName + "-" + value.label+ "-" + value.index1 + '-' + value.index2;
          let temp = {
            type,
            beforeText: "",
            afterText: "",
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            bindTable:value.bindTable,
            formId: value.formId,
            formName: value.formName,
            fieldId: value.fieldId,
            fieldName: value.label,
            name,
          };
          this.sqlRuleMaplist.set(name,temp);
          this.$refs.sql.insertVariable('``'+name+'``');
           this.$refs.variableSourceSelect.handleClose();
        }
      }
    },
    testSql() {
      if (!this.ObjId) {
        this.$message(this.$t('workFlow.selectSql.hintSelectData'));
        return false;
      }
      let sql = this.sql;
      
      if (!sql || sql == "") {
        this.$message(this.$t('workFlow.selectSql.hintSqlStatement'));
        return false;
      }
      let param = { id: this.ObjId, sql: sql };
      getDbLinksTestSql(this.ObjId, param).then(res => {
        if (res.data.success) {
          this.page.total = res.data.data.length;
          this.userIdAllData = res.data.data;
          this.userIdData = this.getPageList(this.page.pageSize, 1);
        } else {
          this.$message("测试失败：" + res.data.msg);
          return false;
        }
      });
    },
    getPageList(pageSize, currentPage) {
      var skipNum = (currentPage - 1) * pageSize;
      var newArr =
        skipNum + pageSize >= this.userIdAllData.length
          ? this.userIdAllData.slice(skipNum, this.userIdAllData.length)
          : this.userIdAllData.slice(skipNum, skipNum + pageSize);
      return newArr;
    },
    onLoad(page) {
      this.userIdData = this.getPageList(this.page.pageSize, page.currentPage);
    },
    pushParentData() {
      let result = [];
      if (!this.ObjId) {
        this.$message(this.$t('workFlow.selectSql.hintSelectData'));
        return result;
      }
      if (this.sql == "") {
        this.$message(this.$t('workFlow.selectSql.hintSqlStatement'));
        return result;
      }

      let arr = this.sql.split("``");
      let finalSql = "";
      let templateData = [];
      arr.forEach((ele, index) => {
        let beforeText = "";
        if (index % 2) {
          beforeText = arr[index - 1];
          let val = this.sqlRuleMaplist.get(ele);
          finalSql += beforeText + " " + ele + " ";
          if (val) {
            templateData.push({ ...val,beforeText,  afterText: "" });
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
      result = this.selectedList;
      result.push({
        F_Id: uuidv4(),
        F_ObjId: this.ObjId,
        F_ObjName: finalSql,
        templateData
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.sql-box {
  .el-tag {
    font-size: 14px;
    margin-right: 10px;
  }
  .edit-div {
    font-size: 14px;
    cursor: move;
  }
  .min-w {
    min-width: 10px;
  }
  .mark-em {
    color: red;
  }
  .leave2 {
    margin-left: 10px;
  }
  .leave3 {
    margin-left: 20px;
  }
  .el-form-item {
    margin: 0;
  }
  .border-box {
    border: 1px solid #dcdfe6;
  }
  .rule-box {
    display: flex;
    flex-wrap: wrap;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    .flex-box {
      display: flex;
    }
  }
  .el-tree {
    flex-basis: 20%;
    border-right: 1px solid #dcdfe6;
  }
  .drag-panel {
    flex-basis: 80%;
  }
  .el-form-item__content {
    line-height: 30px;
    font-size: 12px;
    text-align: left;
  }
  .el-input,
  .el-select {
    position: relative;
    font-size: 12px;
    display: inline-block;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
}
</style>
<style scoped>
.sql-box /deep/ .el-form-item__content,
.sql-box /deep/ .el-checkbox,
.sql-box /deep/ .el-checkbox__label {
  font-size: 12px;
}
</style>
