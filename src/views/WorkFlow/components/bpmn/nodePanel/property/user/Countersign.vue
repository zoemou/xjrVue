<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.User.multiInstanceType") }}</label>
      <el-select v-model="formInfo.multiinstance_type">
        <el-option
          :label="$t('workFlow.User.optionNull')"
          value="None"
        ></el-option>
        <el-option
          :label="$t('workFlow.User.optionSynchronize')"
          value="Parallel"
        ></el-option>
        <el-option
          :label="$t('workFlow.User.optionOrder')"
          value="Sequential"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.User.addSubtract") }}</label>
      <el-radio-group
        v-model="formInfo.fksignature"
        :disabled="formInfo.multiinstance_type == 'None' ? true : false"
      >
        <el-radio label="1">{{ $t("workFlow.User.allowOption") }}</el-radio>
        <el-radio label="0">{{ $t("workFlow.User.allowProhibit") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.User.completeCondition") }}</label>
      <el-select
        v-model="condition.type"
        :disabled="formInfo.multiinstance_type == 'None' ? true : false"
      >
        <el-option
          :label="$t('workFlow.User.optionAll')"
          value="all"
        ></el-option>
        <el-option
          :label="$t('workFlow.User.optionSingle')"
          value="single"
        ></el-option>
        <el-option
          :label="$t('workFlow.User.optionPercent')"
          value="percent"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="condition.type == 'percent'">
      <label>{{ $t("workFlow.User.percent") }}</label>
      <el-input
        v-model="condition.percent"
        type="number"
        :disabled="formInfo.multiinstance_type == 'None' ? true : false"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.User.personnelList") }}</label>
      <el-table
        :data="formInfo.usertaskassignment.assignment.FKtableEM"
        style="width: 100%;"
      >
        <el-table-column
          prop="check"
          :label="$t('workFlow.User.tableSelect')"
          width="120"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.check"
              :disabled="formInfo.multiinstance_type == 'None' ? true : false"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="F_ObjType"
          :label="$t('workFlow.User.tableType')"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ typeName(scope.row.F_ObjType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="F_ObjName"
          :label="$t('workFlow.User.tableName')"
        >
        </el-table-column>
      </el-table>
    </el-form-item>
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
    }
  },
  data() {
    return {
      condition: {
        type: "all",
        percent: ""
      }
    };
  },
  watch: {
    "condition.type": function(val) {
      this.formInfo.multiinstance_condition = val;
    },
    "condition.percent": function(val) {
      this.formInfo.multiinstance_condition = this.condition.type + "," + val;
    },
    "formInfo.multiinstance_type": function(val) {
      if (val == "None") {
        this.formInfo.multiinstance_collection = "";
        this.formInfo.multiinstance_variable = "";
        this.formInfo.usertaskassignment.assignment.assignee = "";
      } else {
        this.formInfo.multiinstance_collection = "${usernamelist}";
        this.formInfo.multiinstance_variable = "username";
        this.formInfo.usertaskassignment.assignment.assignee = "${username}";
      }
    }
  },
  mounted() {
    this.condition = {
        type: "all",
        percent: ""
    }
    let whiteCondition = ["all", "single"];
    if (whiteCondition.includes(this.formInfo.multiinstance_condition)) {
      this.condition.type = this.formInfo.multiinstance_condition;
    } else {
      let tempArr = this.formInfo.multiinstance_condition.split(",");
      this.condition.type = "percent";
      this.condition.percent = tempArr.length > 1 ? tempArr[1] : 0;
    }
  },
  methods: {
    typeName(typeNumber) {
      let typeName = "";
      switch (typeNumber) {
        case "1":
          typeName = "岗位";
          break;
        case "2":
          typeName = "角色";
          break;
        case "3":
          typeName = "用户";
          break;
        case "4":
          typeName = "节点";
          break;
        case "5":
          typeName = "上级";
          break;
        case "6":
          typeName = "字段";
          break;
        case "7":
          typeName = "公司";
          break;
        case "8":
          typeName = "部门";
          break;
        case "9":
          typeName = "SQL语句指定人员";
          break;
        default:
          break;
      }
      return typeName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
