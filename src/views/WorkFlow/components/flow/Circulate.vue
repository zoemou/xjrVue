<template>
  <div>
    <div class="button-box">
      <el-button size="small" @click="openDialog('SelectPost')">{{$t('workFlow.Circulate.postBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectRole')">{{$t('workFlow.Circulate.roleBtn')}}</el-button>
      <el-button size="small" @click="openDialog('SelectUser')">{{$t('workFlow.Circulate.userBtn')}}</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="selectedTableData"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="F_ObjType"
          :label="$t('workFlow.Circulate.labelType')"
          width="150"
          :formatter="formatter"
          >
        </el-table-column>
        <el-table-column
          prop="F_ObjName"
          :label="$t('workFlow.Circulate.labelName')"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('workFlow.Circulate.labelOperate')"
          width="100">
          <template slot-scope="scope">
             <el-button 
            v-if="!cannotDeleteIds.includes(scope.row.F_ObjId)"
            @click="rowDel(scope.row,scope.$index)" type="text" size="small">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            <span 
            v-else></span>
          </template>
        </el-table-column>
      </el-table>
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
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import SelectUser from "@/components/organization/SelectUser";
import SelectPost from "@/components/organization/SelectPost";
import SelectRole from "@/components/organization/SelectRole";
import { deepClone } from '@/util/util';
export default {
  components: {
    SelectUser,
    SelectPost,
    SelectRole,
  },
  props: {
    processInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
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
      cannotDeleteIds:[]
    };
  },
  watch: {
    selectedTableData: function (val) {
      if (val === "") {
        val = null;
      }
      this.formData.forwarderList = val;
    },
  },
  mounted() {
    let tableList = deepClone(this.processInfo.forwarderList);
    this.selectedTableData = deepClone(tableList);
    this.cannotDeleteIds = tableList.map(ele=>{
      return ele.F_ObjId;
    });
    this.getInitData();
  },
  methods: {
    formatter(row, column) {
        return this.getTitle(row.F_ObjType);
    },
    getTitle(type) {
      switch (type) {
        case "1":
          return this.$t('workFlow.Circulate.postBtn');
        case "2":
          return this.$t('workFlow.Circulate.roleBtn');
        case "3":
          return this.$t('workFlow.Circulate.userBtn');
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
      this.selectedPostList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_PostId,
          F_ObjName: element.F_Name,
          F_ObjType: "1",
        });
      });
      this.selectedRoleList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_RoleId,
          F_ObjName: element.F_FullName,
          F_ObjType: "2",
        });
      });
      this.selectedUserList.forEach((element) => {
        this.selectedTableData.push({
          F_Id: uuidv4(),
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
.el-table{
  font-size: 12px;
}
</style>
