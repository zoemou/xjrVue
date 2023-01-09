<template>
  <div>
    <div class="button-box">
      <el-button size="small" @click="openDialog('SelectPost')">岗位</el-button>
      <el-button size="small" @click="openDialog('SelectRole')">角色</el-button>
      <el-button size="small" @click="openDialog('SelectUser')">人员</el-button>
    </div>
    <div class="table-box">
      <avue-crud
        :data="selectedTableData"
        :option="tableOption"
        @row-del="rowDel"
      ></avue-crud>
    </div>
    <el-dialog v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
    >
      <component
        :is="componentName"
        v-if="dialogVisible"
        :selectedList="selectedList"
        :ref="dialogType"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import SelectUser from "@/components/organization/SelectUser";
import SelectPost from "@/components/organization/SelectPost";
import SelectRole from "@/components/organization/SelectRole";
export default {
  components: {
    SelectUser,
    SelectPost,
    SelectRole
  },
  props: {
    processInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },formData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    let self = this;
    return {
      dialogTitle: "标题",
      dialogVisible: false,
      dialogType: "",
      componentName: "",
      selectedTableData: [],
      selectedList: [],
      submitSelectList: [],
      selectedUserList: [],
      selectedPostList: [],
      selectedRoleList: [],
      tableOption: {
        defaultSort: {
          prop: "F_ObjType",
          order: "ascending"
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
            label: "类型",
            prop: "F_ObjType",
            formatter: function(value) {
              return self.getTitle(value.F_ObjType);
            }
          },
          {
            label: "名称",
            prop: "F_ObjName"
          }
        ]
      }
    };
  },
  watch: {
    selectedTableData: function(val) {
      if (val === "") {
        val = null;
      }
      this.formData.forwarderList = val;
    }
  },
  mounted() {
    this.selectedTableData = this.processInfo.forwarderList;
    this.getInitData();
  },
  methods: {
    getTitle(type) {
      switch (type) {
        case "1":
          return "岗位";
        case "2":
          return "角色";
        case "3":
          return "人员";
        default:
          break;
      }
    },
    getComponent() {
      this.selectedList = [];
      switch (this.dialogType) {
        case "SelectUser":
          this.dialogTitle = this.getTitle("1");
          this.selectedList = this.selectedUserList;
          this.submitSelectList = "selectedUserList";
          break;
        case "SelectPost":
          this.dialogTitle = this.getTitle("2");
          this.selectedList = this.selectedPostList;
          this.submitSelectList = "selectedPostList";
          break;
        case "SelectRole":
          this.dialogTitle = this.getTitle("3");
          this.selectedList = this.selectedRoleList;
          this.submitSelectList = "selectedRoleList";
          break;
        default:
          break;
      }
      this.componentName = this.dialogType;
    },
    getInitData() {
      this.selectedTableData.forEach(element => {
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
      if (form.F_ObjType == "1") {
        this.selectedPostList = this.selectedPostList.filter(ele => {
          return ele.F_PostId != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "2") {
        this.selectedRoleList = this.selectedRoleList.filter(ele => {
          return ele.F_RoleId != form.F_ObjId;
        });
      }
      if (form.F_ObjType == "3") {
        this.selectedUserList = this.selectedUserList.filter(ele => {
          return ele.F_UserId != form.F_ObjId;
        });
      }
      this.selectedTableData.splice(index, 1);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openDialog(type) {
      this.dialogType = type;
      this.getComponent();
      this.dialogVisible = true;
    },
    submitDialog() {
      var obj = this.$refs[this.dialogType].pushParentData();
      this[this.submitSelectList] = obj;
      this.changeTableList();
      this.dialogVisible = false;
    },
    changeTableList() {
      this.selectedTableData = [];
      this.selectedPostList.forEach(element => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_PostId,
          F_ObjName: element.F_Name,
          F_ObjType: "1"
        });
      });
      this.selectedRoleList.forEach(element => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_RoleId,
          F_ObjName: element.F_FullName,
          F_ObjType: "2"
        });
      });
      this.selectedUserList.forEach(element => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_UserId,
          F_ObjName: element.F_RealName,
          F_ObjType: "3"
        });
      });
    }
  }
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
