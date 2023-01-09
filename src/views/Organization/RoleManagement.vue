<template>
  <div class="main-container page-fixed">
    <main-content :title="contentTitle" :paddingLeft="0" padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.Keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 5px;"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchRoles"
            >{{ $t("searchModule.searchBtn") }}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{
            $t("searchModule.searchReset")
          }}</el-button>
        </div>
      </div>
      <div slot="table">
        <avue-crud
          :data="rolesList"
          :option="option"
          stripe
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @row-click="handleCurrentRowChange"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              v-if="hasButtonPermission('add')"
              @click="showFormDialog('add')"
              >{{ $t("buttonModule.addBtn") }}</el-button
            >
            <el-button
              v-if="hasButtonPermission('addmember')"
              
              size="small"
              @click="addUser"
              >{{ $t("orgRoleManagement.addMemberBtn") }}</el-button
            >
            <el-button
              v-if="hasButtonPermission('lookmember')"
              
              size="small"
              @click="lookUser"
              >{{ $t("orgRoleManagement.viewMemberBtn") }}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('authorizefunc')"
              @click="setAuthorize"
              >{{ $t("orgRoleManagement.setAuthorizeBtn") }}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('authorizeapp')"
              @click="openAppAuthorizeDialog"
              >{{$t('orgRoleManagement.appSetAuthorizeBtn')}}</el-button
            >
            <!-- {{ $t("orgRoleManagement.appSetAuthorizeBtn")}} -->
            <el-button
              
              size="small"
                v-if="hasButtonPermission('authorizeappdata')"
               @click="setDataAuthorize('app')"
              >{{$t('appDataAuthorization')}}</el-button
            >
            <el-button
             
              size="small"
              v-if="hasButtonPermission('authorizedata')"
              @click="setDataAuthorize('pc')"
              >{{ $t("orgRoleManagement.dataAuthorizeBtn") }}</el-button
            ><!---dataAuthorize-->
			<el-button			 
			  size="small"
			  v-if="hasButtonPermission('authorizeInterface')"
			  @click="setInterfaceAuthorize"
			  >{{ $t("interfaceAuthorization") }}</el-button
			>
            <el-button
              
              size="small"
              v-if="hasButtonPermission('authorizeindex')"
              @click="setIndexAuthorize"
              >{{ $t("orgRoleManagement.indexAuthorizeBtn") }}</el-button
            ><!---indexAuthorize-->
          </template>
          <template slot="F_EnabledMark" slot-scope="scope">
            <avue-switch
              disabled
              active-color="#13ce66"
              inactive-color="#a29e9e"
              v-model="scope.row.F_EnabledMark"
              :dic="swichDic"
            ></avue-switch>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('modify')"
              @click="showFormDialog('edit', scope.row)"
             
              >{{ $t("tableOperationModule.editorBtn") }}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              v-if="hasButtonPermission('delete')"
              @click="deleteRowDepartment(scope.row)"
             
              >{{ $t("tableOperationModule.deleteBtn") }}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>

    <!-- 新增 -->
    <el-dialog
      v-dialogDrag
      :title="$t('orgRoleManagement.addMemberModal.modalTitle')"
      :append-to-body="true"
      :visible.sync="addUserDialog"
      :close-on-click-modal="false"
      width="1065px"
    >
      <SelectUser
        v-if="addUserDialog"
        ref="addPesonelRef"
        :selectedList="selectedList"
        :sourceName="'RoleManagement'"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button 
        size="mini" 
        type="primary" 
        @click="confirmMemberDialog()" 
        :loading="flagAddUser"
        >{{flagAddUser?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>

    <!-- AddMember -->
    <el-dialog
      v-dialogDrag
      :title="$t('orgRoleManagement.viewMemberModal.modalTitle')"
      :append-to-body="true"
      :visible.sync="lookUserDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="luDClose"
    >
      <List type="user" :list="userList" @clickSelected="getSelectUser"></List>
    </el-dialog>

    <!-- 功能授权 -->
    <el-dialog
      v-dialogDrag
      :title="$t('orgRoleManagement.setAuthorizeModal.modalTitle')"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="9vh"
      :visible.sync="authorizeVisible"
      width="80%"
      :before-close="closeAuthorizeDialog"
	  class="authorizedialog"
    >
      <authorize-select-tree
        ref="authorizeTreeRef"
        v-if="authorizeVisible"
        :objectType="objectType"
        :objectId="objectId"
      ></authorize-select-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizeDialog">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button 
        size="mini" 
        type="primary" 
        @click="confirmAuthorizeDialog" 
        :loading="flagAuthorDialog"
        >{{flagAuthorDialog?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
    <!-- APP功能授权 -->
    <AppAuthorize v-if="appAuthorizeVisible" @close="appAuthorizeVisible=false" :objectType="objectType" :objectId="objectId"></AppAuthorize>
    <!-- 新增-->
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleClose"
    >
      <div class="companiesuser-form custom-form" v-if="dialogVisible">
        <el-form
          :model="rolesForm"
          :rules="rules"
          ref="roleForm"
          label-width="70px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24" v-show="hasFormPermission('F_EnCode')">
            <el-form-item
              :label="$t('orgRoleManagement.addModal.labelRoleNum')"
              prop="F_EnCode"
            >
              <el-input
                :placeholder="
                  $t('orgRoleManagement.addModal.placeholderRoleNum')
                "
                size="small"
                v-model="rolesForm.F_EnCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_FullName')">
            <el-form-item
              :label="$t('orgRoleManagement.addModal.labelRoleName')"
              prop="F_FullName"
            >
              <el-input
                :placeholder="
                  $t('orgRoleManagement.addModal.placeholderRoleName')
                "
                size="small"
                v-model="rolesForm.F_FullName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_EnabledMark')">
            <el-form-item label="">
              <el-checkbox
                v-model="rolesForm.F_EnabledMark"
                :true-label="1"
                :false-label="0"
                >{{ $t("orgRoleManagement.addModal.Efficient") }}</el-checkbox
              >
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_Description')">
            <el-form-item
              :label="$t('orgRoleManagement.addModal.labelRoleRemark')"
            >
              <el-input
                type="textarea"
                :placeholder="
                  $t('orgRoleManagement.addModal.placeholderRemark')
                "
                size="small"
                :autosize="{ minRows: 4, maxRows: 10 }"
                maxlength="800"
                show-word-limit
                v-model="rolesForm.F_Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button 
        size="mini" 
        type="primary" 
        @click="confirmDialog()" 
        :loading="flagRoleManage"
        >
        {{flagRoleManage?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
        </el-button>
      </span>
    </el-dialog>
    <!--数据权限 弹窗-->
    <database-auth
      :conf="databaseAuthConf"
      :visible="databaseAuthVisible"
      :databaseAuthType="databaseAuthType"
      v-if="databaseAuthVisible"
      v-on:onHandler="databaseAuthHandler"
    ></database-auth>
    <!--首页授权 弹窗-->
    <index-auth
      :conf="indexAuthConf"
      :visible="indexAuthVisible"
      v-if="indexAuthVisible"
      v-on:onHandler="indexAuthHandler"
    ></index-auth>
	<!--接口授权 弹窗-->
	<interface-auth
	  :conf="InterfaceAuthConf"	
	  :objectType="1"
	  v-if="InterfaceAuthVisible"
	  :visible.sync="InterfaceAuthVisible"
	  @onHandler="InterfaceAuthHandler"	  
	></interface-auth>
	
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import AuthorizeSelectTree from "./components/AuthorizeSelectTree";
import AppAuthorize from "./components/app/AppAuthorize";//App功能授权
import SelectUser from "@/components/organization/SelectUser";
import List from "@/components/organization/components/List";
import databaseAuth from "./components/DatabaseAuth";
import indexAuth from "./components/IndexAuth";
import InterfaceAuth from "./components/InterfaceAuth";
import { deepClone,formValidateNotice } from "@/util/util";
import {
  getRoles,
  addRoles,
  modifyRoles,
  deleteRoles,
  lookUser,
  addUser
} from "@/api/organization/role";

import { postAuthorizes } from "@/api/organization/index";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getStore } from "@/util/store";
import {validateLength} from "@/api/organization/validateFunc";
export default {
  name: "RoleManagement",
  mixins: [authorizeMixin, tableOptionMixin,displayColumnsMixin],
  components: {
    List,
    MainContent,
    AuthorizeSelectTree,
    AppAuthorize,
    SelectUser,
    databaseAuth,
    indexAuth,
	InterfaceAuth
  },
  data() {
    return {
      flagRoleManage: false,
      flagAddUser:false,
      flagAuthorDialog: false,
      flagAppAuthorDialog: false,
      contentTitle: "角色列表",
      dialogType: "add",
      searchParam: { Keyword: "" },
      rolesList: [],
      userList: [],
      objectId: "",
      objectType: 1,
      flag: false,
      dialogVisible: false,
      dialogTitle:this.$t('orgRoleManagement.Hint.addRole'),
      lookUserDialog: false,
      addUserDialog: false,
      selectedList: [],
      rolesForm: {
        F_EnCode: "",
        F_FullName: "",
        F_Description: "",
        F_Category: 1,
        F_SortCode: 0,
        F_EnabledMark: 0
      },
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      swichDic: [
        {
          label: "",
          value: 0
        },
        {
          label: "",
          value: 1
        }
      ],
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        companyId: "",
        indexLabel: this.$t("orgRoleManagement.tabNum"),
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t("orgRoleManagement.tabRoleNumber"),
            prop: "F_EnCode",
            width: "100"
          },
          {
            sortable: true,
            label: this.$t("orgRoleManagement.tabRoleName"),
            prop: "F_FullName",
            minWidth: "95",
			align:'left'
          },
          {
            sortable: true,
            label: this.$t("orgRoleManagement.tabCreateTime"),
            prop: "F_CreateDate",
            width: "140"
          },
          {
            sortable: true,
            label: this.$t("orgRoleManagement.tabFounder"),
            prop: "F_CreateUserName",
            width: "100"
          },
          {
            label: this.$t("orgRoleManagement.tabEffective"),
            prop: "F_EnabledMark",
            slot: true,
            width: "80"
          },
          {
            sortable: true,
            label: this.$t("orgRoleManagement.tabRoleDescription"),
            prop: "F_Description",
            minWidth: "95",
			align:'left'
          }
        ]
      },
      rules: {
        F_EnCode: [
          {
            required: true,
            message: this.$t("orgRoleManagement.addModal.placeholderRoleNum"),
            trigger: "change"
          },
          {
            validator:validateLength,
            trigger:"change"
          }
        ],
        F_FullName: [
          {
            required: true,
            message: this.$t("orgRoleManagement.addModal.placeholderRoleName"),
            trigger: "change"
          },
          {
            validator:validateLength,
            trigger:"change"
          }
        ]
      },
      authorizeVisible: false,
      databaseAuthConf: {
        title: this.$t("orgRoleManagement.dataAuthorizeBtn"),
        width: "60%",
        parentId: "",
        type: "1",
        defaultExpandAll: true
      },
      databaseAuthVisible: false,
      databaseAuthType:'pc',
      indexAuthConf: {
        title: this.$t("orgRoleManagement.indexAuthorizeBtn"),
        width: "69%",
        parentId: ""
      },
      indexAuthVisible: false,
      appAuthorizeVisible: false,
      appDatabaseAuthVisible:false,
	  InterfaceAuthVisible:false,
	  InterfaceAuthConf: ""
    };
  },
  created() {
    this.getRolesList();
  },
  mounted(){
	  let themeName = getStore({ name: "themeName" }) || "default";
	  if((themeName == "eveningTheme" && window.screen.width<1076)||(themeName != "eveningTheme" &&window.screen.width<1076)){
	    this.computedHeight =32;
	  }
	  this.changeBodyHeight();
  	},
  methods: {
    handleRowDBLClick (row, event) {
      if(this.hasButtonPermission('modify')&&this.openDoubleClickEdit){
        this.showFormDialog('edit', row)
      }
    },
    /* 获取角色列表 */
    getRolesList() {
      let params = {
        limit: this.page.currentPage,
        size: this.page.pageSize,
        Keyword: this.searchParam.Keyword
      };
      getRoles(params).then(res => {
        this.page.total = res.data.data.Total;
        this.rolesList = res.data.data.Rows;
      });
    },
    showFormDialog(type, row = {}) {
      this.dialogType = type;
      if (type == "add") {
        this.roleSpecialPostId = "";
        this.dialogTitle = this.$t("orgRoleManagement.addModal.modalTitle");
        this.rolesForm = {
          F_EnCode: "",
          F_FullName: "",
          F_Description: "",
          F_Category: 1,
          F_SortCode: 0,
          F_EnabledMark: 1
        };
      } else {
        this.dialogTitle = this.$t("orgRoleManagement.editModal.modalTitle");
        this.rolesForm = deepClone(row);
        this.objectId = row.F_RoleId;
      }
      this.dialogVisible = true;
    },
    confirmDialog() {
      this.flagRoleManage = true;  
      if (
        this.rolesForm.F_EnCode == "system" ||
        this.rolesForm.F_FullName == "超级管理员"
      ) {
        if (this.rolesForm.F_EnabledMark == 0) {
          this.flagRoleManage = true;
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t("orgRoleManagement.Hint.notSet"),
            type: "warning"
          });
          this.flagRoleManage = false;
          return;
        }
      }
      this.$refs["roleForm"].validate((valid,object) => {
        if (valid) {
          if (this.dialogType == "add") {
            this.flagRoleManage = true;
            addRoles(this.rolesForm).then(res => {
              this.dialogVisible = false;
              this.showNotify(res, this.$t("orgRoleManagement.Hint.addRole"));
            }).finally(()=>{
              this.flagRoleManage = false;
            });
          } else {
            modifyRoles(this.rolesForm.F_RoleId, this.rolesForm).then(res => {
              this.dialogVisible = false;
              this.showNotify(
                res,
                this.$t("orgRoleManagement.Hint.modifyRole")
              );
            }).finally(()=>{
              this.flagRoleManage = false;
            });
          }
        } else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagRoleManage = false;
          return false;
        }
      });
    },
    deleteRowDepartment(row) {
      this.$confirm(
        this.$t("orgRoleManagement.Hint.whetherDeleteRole"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          deleteRoles(row.F_RoleId).then(res => {
            this.showNotify(
              res,
              this.$t("deleteRole")
            );
          });
        })
        .catch(() => {});
    },
    showNotify(res, msg) {
      if (res.data.success) {
        this.getRolesList();
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("workFlow.WFMenu.hintSuccess"),
          type: "success"
        });
      } else {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("deletePrompt.hintFailure"),
          type: "warning"
        });
      }
      this.closeDialog();
    },
    setCurrent(row) {
      this.$refs.crud.setCurrentRow(row);
    },
    handleCurrentRowChange(val) {
	  this.rolesForm=deepClone(val)
      this.objectId = val.F_RoleId;
    },
    /* 删除角色 */
    deleteRoles() {
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          deleteRoles(this.rolesForm.F_RoleId, this.rolesForm).then(() => {
            this.getRolesList();
            this.$notify({
              title: this.$t("deletePrompt.successTitle"),
              message: this.$t("deletePrompt.successDeleted"),
              type: "success"
            });
          });
        })
        .catch(() => {});
    },
    /* 功能授权 */
    setAuthorize() {	  
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
	  if(this.rolesForm.F_EnCode=='system'){
		  this.$message({
		    message: this.$t("superAdministratorNotAllowAuthorization"),
		    type: "warning"
		  });
		  return;
	  }
      this.authorizeVisible = true;
    },
    closeAuthorizeDialog() {
      this.flagAuthorDialog = false;
      this.authorizeVisible = false;
    },
    openAppAuthorizeDialog() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
	  if(this.rolesForm.F_EnCode=='system'){
		  this.$message({
			message: this.$t("superAdministratorNotAllowAuthorization"),
			type: "warning"
		  });
		  return;
	  }
       this.appAuthorizeVisible = true;  
    },
    appDatabaseAuthHandler() {
      this.appDatabaseAuthVisible = false;
    },
    setappDatabaseAuth() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
      if(this.rolesForm.F_EnCode=='system'){
        this.$message({
        message: this.$t("superAdministratorNotAllowAuthorization"),
        type: "warning"
        });
        return;
      }
      this.appDatabaseAuthVisible = true;
    },
    closeDialog() {
      this.flagRoleManage = false;
      this.dialogVisible = false;
    },
    handleClose() {
      this.$refs["roleForm"].resetFields();
      this.dialogVisible = false;
    },
    searchRoles() {
      this.page.currentPage = 1;
      this.getRolesList();
    },
    searchReset() {
      this.searchParam.Keyword = "";
      this.page.currentPage = 1;
      this.getRolesList();
    },
    lookUser() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
      } else {
        this.lookUserDialog = true;
        lookUser(this.objectId).then(res => {
          this.userList = res.data.data;
          this.lookUserDialog = true;
        });
      }
    },
    luDClose() {
      this.lookUserDialog = false;
    },
    addUser() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
      } else {
        lookUser(this.objectId).then(res => {
          this.selectedList = res.data.data;
          this.addUserDialog = true;
        });
      }
    },
    cancelMemberDialog() {
      this.addUserDialog = false;
    },
    /*添加成员按钮 */
    confirmMemberDialog() {
      this.flagAddUser = true;
      let userIds = this.$refs.addPesonelRef.pushParentData().map(ele => {
        return ele.F_UserId;
      });
      let params = { userIds: userIds, roleId: this.objectId };
      addUser(params).then(res => {
        if (res.data.success) {
          this.$notify({
            title: this.$t("deletePrompt.successTitle"),
            message: this.$t("orgRoleManagement.Hint.addSuccess"),
            type: "success"
          });
        } else {
          this.$notify({
            title: this.$t("deletePrompt.failureTitle"),
            message: this.$t("orgRoleManagement.Hint.addFailed"),
            type: "warning"
          });
        }
        // this.flagAddUser = false;
        this.memberDialogVisible = false;
      }).finally(() => {
        this.flagAddUser = false;
      });
      
      this.cancelMemberDialog();
    },
    /* 分页 */
    sortChange() {
      this.getRolesList();
    },
    onPageLoad() {
      this.getRolesList();
    },
    getSelectUser(index) {},
    confirmAuthorizeDialog() {
      this.flagAuthorDialog = true;
      let obj = this.$refs.authorizeTreeRef.allCheckChange();
      postAuthorizes(this.objectId, this.objectType, obj).then(res => {
        this.showNotify(res, this.$t("orgRoleManagement.setAuthorizeBtn"));
        this.closeAuthorizeDialog();
      });
    },
    setDataAuthorize(databaseAuthType) {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
	  if(this.rolesForm.F_EnCode=='system'){
		  this.$message({
			message: this.$t("superAdministratorNotAllowAuthorization"),
			type: "warning"
		  });
		  return;
	  }
      this.databaseAuthConf.parentId = this.objectId;
      this.databaseAuthType = databaseAuthType;
      this.databaseAuthVisible = true;
      console.log('this.databaseAuthVisible',this.databaseAuthVisible);
    },
	setInterfaceAuthorize(){
		if (this.objectId === "") {
		  this.$message({
		    message: this.$t("deletePrompt.hintSelectData"),
		    type: "warning"
		  });
		  return;
		}
		this.InterfaceAuthConf = this.rolesForm;
		this.InterfaceAuthVisible = true;
	},
    databaseAuthHandler() {
      this.databaseAuthVisible = false;
      this.databaseAuthType = 'pc';
    },
    setIndexAuthorize() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
      this.indexAuthConf.parentId = this.objectId;
      this.indexAuthVisible = true;
    },
    indexAuthHandler() {
      this.indexAuthVisible = false;
    },
	InterfaceAuthHandler(){
		this.InterfaceAuthVisible = false;
	}
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
div /deep/ .el-checkbox__label {
  font-size: 12px;
}
div /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  font-size: 12px !important;
}

.authorizedialog /deep/.el-dialog {
    height: calc(100% - 18vh);
    margin-bottom: 0;
}
.authorizedialog /deep/.el-dialog__body{
	height: calc(100% - 114px);
}
@media screen and (max-width: 1076px) {
	  div /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}
.interFaceDialog ::v-deep .el-dialog{
	height: calc(100% - 240px);
}
.interFaceDialog ::v-deep .el-dialog__body{
	height: calc(100% - 110px);
}

</style>
