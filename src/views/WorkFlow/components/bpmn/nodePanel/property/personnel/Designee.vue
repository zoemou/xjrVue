<template>
  <div>
    <el-form-item class="button-box">
      <el-button size="small" @click="openDialog('SelectPost')">{{$t('workFlow.Approver.postBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectRole')">{{$t('workFlow.Approver.roleBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectUser')">{{$t('workFlow.Approver.personnelBtn')}}</el-button>
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
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
    >
      <SelectRole
        v-if="dialogVisible && dialogType == 'SelectRole'"
        :selectedList="selectedRoleList"
        ref="SelectRole"
      ></SelectRole>
      <SelectPost
        v-if="dialogVisible && dialogType == 'SelectPost'"
        :selectedList="selectedPostList"
        ref="SelectPost"
      ></SelectPost>
      <SelectUser
        v-if="dialogVisible && dialogType == 'SelectUser'"
        :selectedList="selectedUserList"
        ref="SelectUser"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRandomNumber } from "./../../../common/util/util";
import SelectUser from "@/components/organization/SelectUser";
import SelectPost from "@/components/organization/SelectPost";
import SelectRole from "@/components/organization/SelectRole";
export default {
  components: {
    SelectUser,
    SelectPost,
    SelectRole,
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
	const _this = this;   
    return {
      dialogTitle: "标题",
      dialogVisible: false,
      dialogType: "",
      selectedTableData: [],
      selectedUserList: [],
      selectedPostList: [],
      selectedRoleList: [],
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
            label: this.$t('workFlow.Approver.tabType'),
            prop: "F_ObjType",
            formatter: function (value) {
              if (value.F_ObjType == "1") {
                return _this.$t('workFlow.Circulate.postBtn');
              } else if (value.F_ObjType == "2") {
                return  _this.$t('workFlow.selectAuthority.roleBtn');
              } else if (value.F_ObjType == "3") {
                return  _this.$t('workFlow.Approver.personnelBtn');
              } else {
                return _this.$t('workFlow.User.optionNull');
              }
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
      this.formInfo.schemeAuthList = val;
    },
  },
  mounted() {
    this.selectedTableData = this.formInfo.schemeAuthList.filter((ele) => {
      return ele.F_ObjType != "4";
    });
    this.getInitData();
  },
  methods: {
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
      });
    },
    rowDel(form, index) {
      this.$notify({
        title:this.$t('deletePrompt.promptTitle'),
        message:this.$t('deletePrompt.successDeleted'),
        type: "success",
      });
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

      this.selectedTableData.splice(index, 1);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openDialog(type) {
      this.changeDialogType(type);
      this.dialogVisible = true;
    },
    changeDialogType(type) {
      this.dialogType = type;
      switch (type) {
        case "SelectUser":
          this.dialogTitle = this.$t('workFlow.Approver.personnelBtn');
          break;
        case "SelectPost":
          this.dialogTitle = this.$t('workFlow.Approver.postBtn');
          break;
        case "SelectRole":
          this.dialogTitle =this.$t('workFlow.Approver.roleBtn');
          break;
        default:
          break;
      }
    },
    submitDialog() {
      switch (this.dialogType) {
        case "SelectUser":
          this.submitSelectUser();
          break;
        case "SelectPost":
          this.submitSelectPost();
          break;
        case "SelectRole":
          this.submitSelectRole();
          break;
        default:
          break;
      }
      this.dialogVisible = false;
    },
    submitSelectRole() {
      var obj = this.$refs.SelectRole.pushParentData();
      this.selectedRoleList = obj;
      this.changeTableList();
      if (obj?.length > 0) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('codeRule.addModal.addDialog.dialogTitle')+`${this.dialogTitle}`+this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
      }
    },
    submitSelectUser() {
      var obj = this.$refs.SelectUser.pushParentData();
      this.selectedUserList = obj;
      this.changeTableList();
      if (obj?.length > 0) {
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message: this.$t('codeRule.addModal.addDialog.dialogTitle')+`${this.dialogTitle}`+this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
      }
    },
    submitSelectPost() {
      var obj = this.$refs.SelectPost.pushParentData();
      this.selectedPostList = obj;
      this.changeTableList();
      if (obj?.length > 0) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('codeRule.addModal.addDialog.dialogTitle')+`${this.dialogTitle}`+this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
      }
    },
    changeTableList() {
      this.selectedTableData = [];
      this.selectedPostList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: getRandomNumber(),
          F_ObjId: element.F_PostId,
          F_ObjName: element.F_Name,
          F_ObjType: "1",
        });
      });
      this.selectedRoleList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: getRandomNumber(),
          F_ObjId: element.F_RoleId,
          F_ObjName: element.F_FullName,
          F_ObjType: "2",
        });
      });
      this.selectedUserList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: getRandomNumber(),
          F_ObjId: element.F_UserId,
          F_ObjName: element.F_RealName,
          F_ObjType: "3",
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
