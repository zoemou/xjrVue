<template>
  <div>
    <el-form-item class="button-box">
      <el-button size="small" @click="openDialog('SelectPost')">{{$t('workFlow.Approver.postBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectRole')">{{$t('workFlow.Approver.roleBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectUser')">{{$t('workFlow.Approver.personnelBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectNodes')"
        >{{$t('workFlow.Approver.nodeApproverBtn')}}</el-button
      >
      <el-button size="small" @click="openDialog('SelectSuperiorLeaders')"
        >{{$t('workFlow.Approver.superiorsBtn')}}</el-button
      >
      <el-button size="small" @click="openDialog('SelectFormFelds')"
        >{{$t('workFlow.Approver.formFieldBtn')}}</el-button
      >
      <el-button size="small" @click="openDialog('SelectCompanySpecialPost')"
        >{{$t('workFlow.Approver.roleCompanyBtn')}}</el-button
      >
      <el-button size="small" @click="openDialog('SelectDepartmentSpecialPost')"
        >{{$t('workFlow.Approver.roleDepartBtn')}}</el-button
      >
      <el-button size="small" @click="openDialog('SelectSql')"
        >{{$t('workFlow.Approver.sqlBtn')}}</el-button
      >
    </el-form-item>
    <el-form-item class="table-box">
      <avue-crud
        :data="selectedTableData"
        :option="tableOption"
        @row-del="rowDel"
      ></avue-crud>
    </el-form-item>
    <el-dialog v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogVisible = false"
	  class="approverDialog"
    >
      <component
        :is="componentName"
        v-if="dialogVisible"
        :selectedList="selectedList"
        :ref="dialogType"
        :type="specialType"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="small" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import SelectUser from "@/components/organization/SelectUser";
import SelectPost from "@/components/organization/SelectPost";
import SelectRole from "@/components/organization/SelectRole";
import SelectNodes from "./select/SelectNodes";
import SelectSuperiorLeaders from "./select/SelectSuperiorLeaders";
import SelectFormFelds from "./select/SelectFormFelds";
import SelectCompanySpecialPost from "./select/SelectSpecialPost";
import SelectDepartmentSpecialPost from "./select/SelectSpecialPost";
import SelectSql from "./select/SelectSql";
export default {
  components: {
    SelectUser,
    SelectPost,
    SelectRole,
    SelectNodes,
    SelectSuperiorLeaders,
    SelectFormFelds,
    SelectCompanySpecialPost,
    SelectDepartmentSpecialPost,
    SelectSql,
  },
  props: {
    assignment: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    let self = this;
    return {
      dialogTitle: "标题",
      dialogVisible: false,
      dialogType: "",
      specialType: 1,
      componentName: "",
      submitSelectList: {},
      selectedTableData: [],
      selectedList: [],
      selectedUserList: [],
      selectedPostList: [],
      selectedRoleList: [],
      selectedNodeList: [],
      selectedSuperiorLeadersList: [],
      selectFormFeldsList: [],
      selectCompanySpecialPostList: [],
      selectDepartmentSpecialPostList: [],
      selectSqlList: [],
      tableOption: {
        defaultSort: {
          prop: "F_ObjType",
          order: "ascending",
        },
        border: true,
        page: false,
        align: "center",
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        refreshBtn: false,
        columnBtn: false,
        column: [
          {
            label:this.$t('workFlow.Approver.tabType'),
            prop: "F_ObjType",
            formatter: function (value) {
              return self.getTitle(value.F_ObjType);
            },
          },
          {
            label:this.$t('workFlow.Approver.tabName'),
            prop: "F_ObjName",
          },
        ],
      },
    };
  },
  watch: {
    selectedTableData: function (val) {
      if (val === "") {
        val = null;
      }
      this.assignment.FKtableEM = val;
    },
  },
  mounted() {
    this.selectedTableData = this.assignment.FKtableEM;
    this.getInitData();
  },
  methods: {
    openDialog(type) {
      this.dialogType = type;
      this.getComponent();
      this.dialogVisible = true;
    },
    getTitle(type) {
      switch (type) {
        case "1":
          return this.$t('workFlow.Approver.postBtn');
        case "2":
          return this.$t('workFlow.Approver.roleBtn');
        case "3":
          return this.$t('workFlow.Approver.personnelBtn');
        case "4":
          return this.$t('workFlow.Approver.titleNode');
        case "5":
          return this.$t('workFlow.Approver.superiorsBtn');
        case "6":
          return this.$t('workFlow.Approver.formFieldBtn');
        case "7":
          return this.$t('workFlow.Approver.roleCompanyBtn');
        case "8":
          return this.$t('workFlow.Approver.roleDepartBtn');
        case "9":
          return this.$t('workFlow.Approver.titleSql');
        default:
          break;
      }
    },
    getComponent() {
      this.selectedList = [];
      switch (this.dialogType) {
        case "SelectUser":
          this.dialogTitle = this.getTitle("3");
          this.selectedList = this.selectedUserList;
          this.submitSelectList = "selectedUserList";
          break;
        case "SelectPost":
          this.dialogTitle = this.getTitle("1");
          this.selectedList = this.selectedPostList;
          this.submitSelectList = "selectedPostList";
          break;
        case "SelectRole":
          this.dialogTitle = this.getTitle("2");
          this.selectedList = this.selectedRoleList;
          this.submitSelectList = "selectedRoleList";
          break;
        case "SelectNodes":
          this.dialogTitle = this.getTitle("4");
          this.selectedList = this.selectedNodeList;
          this.submitSelectList = "selectedNodeList";
          break;
        case "SelectSuperiorLeaders":
          this.dialogTitle = this.getTitle("5");
          this.selectedList = this.selectedSuperiorLeadersList;
          this.submitSelectList = "selectedSuperiorLeadersList";
          break;
        case "SelectFormFelds":
          this.dialogTitle = this.getTitle("6");
          this.selectedList = this.selectFormFeldsList;
          this.submitSelectList = "selectFormFeldsList";
          break;
        case "SelectCompanySpecialPost":
          this.dialogTitle = this.getTitle("7");
          this.specialType = 1;
          this.selectedList = this.selectCompanySpecialPostList;
          this.submitSelectList = "selectCompanySpecialPostList";
          break;
        case "SelectDepartmentSpecialPost":
          this.dialogTitle = this.getTitle("8");
          this.specialType = 2;
          this.selectedList = this.selectDepartmentSpecialPostList;
          this.submitSelectList = "selectDepartmentSpecialPostList";
          break;
        case "SelectSql":
          this.dialogTitle = this.getTitle("9");
          this.selectedList = this.selectSqlList;
          this.submitSelectList = "selectSqlList";
          break;

        default:
          break;
      }
      this.componentName = this.dialogType;
    },
    getInitData() {
      this.selectedTableData.forEach((element) => {
        let temp = element;
        if (element.F_ObjType == "1") {
          temp.F_PostId = temp.F_ObjId;
          temp.F_Name = temp.F_ObjName;
          this.selectedPostList.push(temp);
        }
        if (element.F_ObjType == "2") {
          temp.F_RoleId = temp.F_ObjId;
          temp.F_FullName = temp.F_ObjName;
          this.selectedRoleList.push(temp);
        }
        if (element.F_ObjType == "3") {
          temp.F_UserId = temp.F_ObjId;
          temp.F_RealName = temp.F_ObjName;
          this.selectedUserList.push(temp);
        }
        if (element.F_ObjType == "4") {
          temp.value = temp.F_ObjId;
          temp.label = temp.F_ObjName;
          this.selectedNodeList.push(temp);
        }
        if (element.F_ObjType == "5") {
          temp.id = temp.resourceId ? temp.resourceId + temp.value : temp.value;
          temp.value = temp.F_ObjId;
          temp.label = temp.F_ObjName;
          this.selectedSuperiorLeadersList.push(temp);
        }
        if (element.F_ObjType == "6") {
          temp.id = element.resourceId + element.formId + element.fieldId;
          this.selectFormFeldsList.push(temp);
        }
        if (element.F_ObjType == "7") {
          this.selectCompanySpecialPostList.push(temp);
        }
        if (element.F_ObjType == "8") {
          this.selectDepartmentSpecialPostList.push(temp);
        }
        if (element.F_ObjType == "9") {
          this.selectSqlList.push(temp);
        }
      });
    },
    rowDel(form, index) {
      if (form.F_ObjType == "1") {
        this.selectedPostList = this.selectedPostList.filter((ele) => {
          return ele.F_PostId != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "2") {
        this.selectedRoleList = this.selectedRoleList.filter((ele) => {
          return ele.F_RoleId != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "3") {
        this.selectedUserList = this.selectedUserList.filter((ele) => {
          return ele.F_UserId != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "4") {
        this.selectedNodeList = this.selectedNodeList.filter((ele) => {
          return ele.value != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "5") {
        let id = form.resourceId
            ? form.resourceId + form.F_ObjId
            : form.F_ObjId;
        this.selectedSuperiorLeadersList = this.selectedSuperiorLeadersList.filter(
          (ele) => {
            return ele.F_ObjId != id;
          }
        );
      }
      if (form.F_ObjType == "6") {
        this.selectFormFeldsList = this.selectFormFeldsList.filter((ele) => {
          return ele.id != form.id;
        });
      }
      if (form.F_ObjType == "7") {
        this.selectCompanySpecialPostList = this.selectCompanySpecialPostList.filter(
          (ele) => {
            return ele.F_Id != form.F_Id;
          }
        );
      }
      if (form.F_ObjType == "8") {
        this.selectDepartmentSpecialPostList = this.selectDepartmentSpecialPostList.filter(
          (ele) => {
            return ele.F_Id != form.F_Id;
          }
        );
      }
      if (form.F_ObjType == "9") {
        this.selectSqlList = this.selectSqlList.filter((ele) => {
          return ele.F_Id != form.F_Id;
        });
      }
      this.$notify({
        title:this.$t('deletePrompt.promptTitle'),
        message:this.$t('deletePrompt.successDeleted'),
        type: "success",
      });
      this.selectedTableData.splice(index, 1);
    },
    submitDialog() {
      var obj = this.$refs[this.dialogType].pushParentData();
      this[this.submitSelectList] = obj;
      this.changeTableList();
      if(obj?.length>0){
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: `添加${this.dialogTitle}审批人成功！`,
          type: "success",
        });
      }
      this.dialogVisible = false;
    },
    changeTableList() {
      this.selectedTableData = [];
      this.selectedPostList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_PostId,
          F_ObjName: element.F_Name,
          F_ObjType: "1",
          check: true,
        });
      });
      this.selectedRoleList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_RoleId,
          F_ObjName: element.F_FullName,
          F_ObjType: "2",
          check: true,
        });
      });
      this.selectedUserList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_UserId,
          F_ObjName: element.F_RealName,
          F_ObjType: "3",
          check: true,
        });
      });
      this.selectedNodeList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.value,
          F_ObjName: element.label,
          F_ObjType: "4",
          check: true,
        });
      });

      this.selectedSuperiorLeadersList.forEach((element) => {
        if (element.resourceId) {
          this.selectedTableData.push({
            F_Id: uuidv4(),
            F_ObjId: element.value,
            F_ObjName: element.resourceName + "-" + element.label,
            resourceId: element.resourceId,
            resourceName: element.resourceName,
            F_ObjType: "5",
            check: true,
          });
        } else {
          this.selectedTableData.push({
            F_Id: uuidv4(),
            F_ObjId: element.value,
            F_ObjName: element.label,
            F_ObjType: "5",
            check: true,
          });
        }
      });

      this.selectFormFeldsList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjType: "6",
          check: true,
          ...element,
        });
      });

      this.selectCompanySpecialPostList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjType: "7",
          check: true,
          ...element,
        });
      });

      this.selectDepartmentSpecialPostList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjType: "8",
          check: true,
          ...element,
        });
      });

      this.selectSqlList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjType: "9",
          check: true,
          ...element,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.button-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .el-button + .el-button {
    margin: 0; //重置默认样式
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .el-button--small,
  .el-button--small.is-round {
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
.table-box {
  padding: 2px 0;
}
</style>
<style scoped>
.item-box /deep/ .el-form-item__content,
.item-box /deep/ .el-checkbox,
.item-box /deep/ .el-checkbox__label {
  font-size: 12px;
}
.approverDialog /deep/ .el-dialog{
	height: calc(100% - 30vh);
}
.approverDialog /deep/ .el-dialog__body{
	height: calc(100% - 110px);
	overflow: auto;
}
</style>
