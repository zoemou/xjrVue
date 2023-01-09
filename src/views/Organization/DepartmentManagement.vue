<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle" :resize="true">
      <div slot="list" v-loading="treeLoading">
        <!-- <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="F_CompanyId"
          ref="cTree"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        > -->
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="F_CompanyId"
          ref="cTree"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i class="el-icon-office-building"></i>
            <span>{{ data.F_FullName}}</span>
          </span>
        </el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="205" padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 5px;"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchMenu"
          >{{$t('searchModule.searchBtn')}}</el-button>
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="searchReset"
          >{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table" v-loading="mainLoading">
        <avue-crud
          ref="crud"
          :data="departments"
          :option="option"
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @tree-load="treeLoad"
          @row-click="rowClick"
          @row-update="rowUpdate"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              v-if="hasButtonPermission('add')"
              @click="showFormDialog('add')"
            >{{$t('buttonModule.addBtn')}}</el-button>
            <el-button
              size="small"
              v-if="hasButtonPermission('addmember')"
              @click="showMemberDialog"
            >{{$t('orgDepartManagement.staffingBtn')}}</el-button>
            <el-button
              size="small"
              v-if="hasButtonPermission('roleconfigure')"
              @click="setDialogVisible = true"
            >{{$t('orgDepartManagement.approvalRoleBtn')}}</el-button>
            <OrgImport type="department"></OrgImport>
          </template>
          <template slot="F_Nature" slot-scope="scope">
            <el-tag
              type="opr-primary"
              size="mini"
              @click="showFormDialog('role', scope.row)"
            >{{$t('orgDepartManagement.viewRoleBtn')}}</el-tag>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('modify')"
              @click="showFormDialog('edit', scope.row)"
            >{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button
              type="opr-danger"
              size="mini"
              v-if="hasButtonPermission('delete')"
              @click="deleteRowDepartment(scope.row)"
            >{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>

    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="closeDialog"
    >
      <div class="companiesuser-form">
        <el-tabs v-if="dialogVisible">
          <el-tab-pane
            :label="$t('orgDepartManagement.addModal.tabBasicInfor')"
            v-if="showBasicTab"
          >
            <department-form-dialog
              ref="dialogForm"
              :departmentForm.sync="departmentFormList"
              :formEnCodeList="formEnCodeList"
              :parentIdList="parentIdList[departmentFormList.F_DepartmentId]"
            ></department-form-dialog>
          </el-tab-pane>
          <el-tab-pane :label="$t('orgDepartManagement.addModal.tabRoleInfor')" v-if="companyId">
            <role-of-information
              ref="roleRef"
              :id="companyId"
              :roleSpecialPostId="departmentId"
              :roleType="roleType"
            ></role-of-information>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confirmDialog"
          :loading="flagDep"
        >{{flagDep?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
        <LoadingMask v-if="loading"></LoadingMask>
      </span>
    </el-dialog>
    <role-configuration
      v-if="setDialogVisible"
      :dialogVisible.sync="setDialogVisible"
      :roleType="roleType"
      @closeSetDialog="closeSetDialog"
    ></role-configuration>
    <!-- 人员配置弹出框 -->
    <el-dialog
      v-dialogDrag
      :title="$t('orgDepartManagement.staffingModal.modalTitle')"
      :append-to-body="true"
      :visible.sync="memberDialogVisible"
      :close-on-click-modal="false"
      width="60%"
      style="padding: 10px 20px;"
    >
      <SelectUser v-if="memberDialogVisible" ref="addPesonelRef" :selectedList="selectedList" :parentCompany="{'F_CompanyId':companyId}" :sourceName="'DepartmentManagement'"></SelectUser>
      <!-- <SelectDepartmentUser
        v-if="memberDialogVisible"
        ref="addPesonelRef"
        :selectedList="selectedList"
        :companyId="companyId"
      ></SelectDepartmentUser> -->
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="default"
          @click="cancelMemberDialog()"
        >{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confirmMemberDialog()"
          :loading="flagMemDialog"
        >{{flagMemDialog?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
      <LoadingMask v-if="loading"></LoadingMask>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import DepartmentFormDialog from "./components/DepartmentFormDialog.vue";
import RoleConfiguration from "./components/RoleConfiguration.vue";
import RoleOfInformation from "./components/RoleOfInformation.vue";
import LoadingMask from "./components/LoadingMask.vue";
import OrgImport from "./components/OrgImport.vue";
import SelectUser from "@/components/organization/SelectUser";
import SelectDepartmentUser from "@/components/organization/SelectDepartmentUser";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { deepClone, formValidateNotice } from "@/util/util";
import {
  addDepartment,
  editDepartment,
  getDepartments,
  deleteDepartment,
  addDepartmentsSpecialPostUser,
  getDepartmentUser,
  getLowerDepartment
} from "@/api/organization/department";
import { getLowerCompanies } from "@/api/organization/company";

export default {
  name: "DepartmentManagement",
  mixins: [authorizeMixin, tableOptionMixin,displayColumnsMixin],
  components: {
    MainFixed,
    MainContent,
    DepartmentFormDialog,
    RoleConfiguration,
    RoleOfInformation,
    SelectUser,
    // SelectDepartmentUser,
    LoadingMask,
    OrgImport,
  },
  data() {
    return {
      flagMemDialog: false,
      flagDep: false,
      loading: true,
      treeLoading: false, 
      mainLoading: false, 
      fixedTitle: this.$t("orgDepartManagement.fixedTitle"),
      contentTitle: "部门列表",
      companiesTree: [],
      departments: [],
      departmentFormList: {},
      dialogTitle: this.$t("orgDepartManagement.addModal.modalTitle"),
      dialogType: "add",
      dialogVisible: false,
      showBasicTab: false,
      setDialogVisible: false,
      memberDialogVisible: false,
      selectedList: [],
      roleType: 2, //角色信息为部门
      departmentId: "",
      maps: new Map(),
      parentId: "",//修改刷新页面使用
      parentIdList:{},
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      searchParam: { keyword: null },
      defaultProps: {
        children: "children",
        label: "F_FullName",
      },
      option: {
        indexLabel: this.$t("orgDepartManagement.tabNum"),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        border: false,
        index: true,
        rowKey: "F_DepartmentId",
        menuWidth: 150,
        page: true,
        companyId: "",
        lazy:true,
        column: [
          {
            label: this.$t("orgDepartManagement.tabName"),
            prop: "F_FullName",
            minwidth: "400",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("orgDepartManagement.tabCode"),
            prop: "F_EnCode",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("orgDepartManagement.tabAbbreviation"),
            prop: "F_ShortName",
            width: "150",
            align: "left",
            sortable: true,
          },
          // {
          //   label: "部门性质",
          //   prop: "F_Nature",
          // },
          {
            label: this.$t("orgDepartManagement.tabApproveRole"),
            prop: "F_Nature",
            width: "140",
            slot: true,
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("orgDepartManagement.tabPrincipal"),
            prop: "F_Manager",
            width: "100",
            align: "left",
            sortable: true,
          },
          //        {
          //          label:this.$t('orgDepartManagement.tabOuterPhone'),
          //          prop: "F_OuterPhone",
          // width:'150',
          // align:'left'
          //        },
          //        {
          //          label:this.$t('orgDepartManagement.tabInnerPhone'),
          //          prop: "F_InnerPhone",
          // width:'150',
          // align:'left'
          //        },
          {
            label: this.$t("orgDepartManagement.tabDescription"),
            prop: "F_Description",
            align: "left",
            sortable: true,
          },
        ],
      },
    };
  },
  created() {
  },
  mounted() {
    if (window.screen.width < 1142) {
      this.computedHeight = 32;
    }
    this.changeBodyHeight();
  },
  methods: {
    handleRowDBLClick(row, event) {
      if (this.hasButtonPermission("modify") && this.openDoubleClickEdit) {
        this.showFormDialog("edit", row);
      }
    },
    async loadNode(node, resolve) {
      try {
        const id = node.data.F_CompanyId || '0'
        let res = await getLowerCompanies(id);
        if (res.data.success) {
          if (node.data.F_CompanyId) {
            resolve(res.data.data)
          } else {
            this.companiesTree = res.data.data;
            if (this.companiesTree.length > 0) {
              this.companyId = res.data.data[0].F_CompanyId;
              this.treeLoad()
              this.$nextTick(function () {
                this.$refs.cTree.setCurrentKey(this.companyId);
              })
            }
          }
        }
      } catch (error) {}
    },
    searchMenu() {
      this.getDepartments(this.companyId);
    },
    searchReset() {
      this.searchParam.keyword = null;
      this.treeLoad();
    },
    handleNodeClick(data) {
      this.departmentId = "";
      this.searchParam.keyword = null;
      this.companyId = data.F_CompanyId;
      // this.getDepartments(data.F_CompanyId);
      this.treeLoad()
    },
    async getDepartments(id) {
      try {
        let res = await getDepartments(id, this.searchParam);
        if (res.data.success) {
          this.departments = res.data.data;
        }
      } catch (error) { }
    },
    async treeLoad(tree, treeNode, resolve) {
      try {
        const id = tree ? tree.F_DepartmentId : 0
        let res = await getLowerDepartment(this.companyId, id);
        if (id !== 0) this.maps.set(id, { tree, treeNode, resolve }) // 将当前选中节点数据存储到maps中            
        if (res.data.success) {
          res.data.data.map(item => {
            item['hasChildren'] = true
          })
          if (tree) {     
            resolve(res.data.data)
            res.data.data.map(item => {
              let parentIds = []
              if (item.F_ParentId in this.parentIdList) {
                parentIds = [item.F_ParentId,...this.parentIdList[item.F_ParentId]]
              } else {
                parentIds = [item.F_ParentId]
              }
              this.parentIdList[item.F_DepartmentId] = parentIds
            })
          } else {
            this.departments = res.data.data;
          }
        }
      } catch (error) {}
    },
    showFormDialog(type, row) {
      this.loading = false;
      this.dialogType = type;
      if (type == "add") {
        this.dialogTitle = this.$t("orgDepartManagement.addModal.modalTitle");
        this.departmentFormList = {
          F_DepartmentId: "",
          F_FullName: "",
          F_EnCode: "",
          F_ShortName: "",
          F_Nature: "",
          F_ParentId: "",
          F_Manager: "",
          F_OuterPhone: "",
          F_InnerPhone: "",
          F_Email: "",
          F_Fax: "",
          F_Description: "",
          postUserJson: {},
          F_mobile: "",
          F_CompanyId: this.companyId,
        };
        this.departmentId = "";
        this.showBasicTab = true;
      } else if (type == "role") {
        this.dialogTitle = this.$t("orgDepartManagement.addModal.modalTitle");
        this.departmentFormList = deepClone(row);
        this.departmentFormList.F_CompanyId = this.companyId;
        this.departmentId = this.departmentFormList.F_DepartmentId;
        this.showBasicTab = false;
      } else {
        this.dialogTitle = this.$t("orgDepartManagement.editTitle");
        this.departmentFormList = deepClone(row);
        this.departmentFormList.F_CompanyId = this.companyId;
        this.departmentId = this.departmentFormList.F_DepartmentId;
        this.showBasicTab = true;
        this.parentId = row.F_ParentId
      }
      this.departmentFormList.postJsonList = {};
      this.dialogVisible = true;
    },
    confirmDialog() {
      this.flagDep = true;
      this.loading = true;
      if (this.dialogType == "add") {
        this.add();
      } else if (this.dialogType == "role") {
        this.roleDialog();
      } else {
        this.edit();
      }
    },
    add() {
      this.loading = false;
      this.$refs.dialogForm.$refs.departmentForm.validate((valid, object) => {
        if (valid) {
          this.departmentFormList.F_CompanyId = this.companyId;
          let tempJson = {};
          this.$refs.roleRef.postJsonList.forEach((element) => {
            tempJson[element.F_Id] = element.memberIdsList;
          });
          this.departmentFormList.postUserJson = tempJson;
          addDepartment(this.departmentFormList)
            .then((res) => {
              this.showNotify(
                res,
                this.$t("orgDepartManagement.Hint.addDepart")
              );
              this.updateTable(this.departmentFormList.F_ParentId || '0')
            })
            .finally(() => {
              this.flagDep = false;
            });
        } else {
          formValidateNotice(object, this, this.formEnCodeList);
          this.flagDep = false;
          return false;
        }
      });
    },
    edit() {
      this.loading = false;
      this.$refs.dialogForm.$refs.departmentForm.validate((valid) => {
        if (valid) {
          let tempJson = {};
          this.$refs.roleRef.postJsonList.forEach((element) => {
            tempJson[element.F_Id] = element.memberIdsList;
          });
          this.departmentFormList.postUserJson = tempJson;
          let params = {
            ...this.departmentFormList,
            ...{ F_CompanyId: this.companyId },
          };
          editDepartment(this.departmentFormList.F_DepartmentId, params)
            .then((res) => {
              this.showNotify(
                res,
                this.$t("orgDepartManagement.Hint.modifyDepart")
              );
              this.updateTable(this.departmentFormList.F_ParentId || '0')
              if (this.departmentFormList.F_ParentId !== this.parentId) this.updateTable(this.parentId)
            })
            .finally(() => {
              this.flagDep = false;
            });
        } else {
          this.flagDep = false;
          return false;
        }
      });
    },
    roleDialog() {
      let tempJson = {};
      this.$refs.roleRef.postJsonList.forEach((element) => {
        tempJson[element.F_Id] = element.memberIdsList;
      });
      this.departmentFormList.postUserJson = tempJson;
      let params = {
        ...this.departmentFormList,
        ...{ F_CompanyId: this.companyId },
      };
      editDepartment(this.departmentFormList.F_DepartmentId, params).then(
        (res) => {
          this.showNotify(res, this.$t("orgDepartManagement.Hint.modifyRole"));
        }
      );
    },
    showNotify(res, msg) {
      if (res.data.success) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("workFlow.WFMenu.hintSuccess"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("deletePrompt.hintFailure"),
          type: "warning",
        });
      }
      this.loading = false;
      this.closeDialog();
    },
    setCurrent(row) {
      this.$refs.crud.setCurrentRow(row);
    },
    deleteRowDepartment(row) {
      this.$confirm(
        this.$t("orgDepartManagement.Hint.confirmWhetherDelete"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          deleteDepartment(row.F_DepartmentId).then((res) => {
            this.updateTable(row.F_ParentId)
            this.showNotify(
              res,
              this.$t("orgDepartManagement.Hint.deleteDepart")
            );
          });
        })
        .catch(() => {});
    },

    closeDialog() {
      this.dialogVisible = false;
      this.flagDep = false;
    },
    setDialog() {
      this.setDialogVisible = true;
    },
    closeSetDialog() {
      this.departmentId = "";
      this.setDialogVisible = false;
    },
    rowClick(row) {
      this.departmentId = row.F_DepartmentId;
    },
    showMemberDialog() {
      if (!this.departmentId) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("deletePrompt.operationHint"),
          type: "warning",
        });
        return false;
      }
      this.loading = true;
      let param = {};
      getDepartmentUser(this.departmentId, param).then((res) => {
        if (res.data.success) {
          this.selectedList = res.data.data;
          this.memberDialogVisible = true;
        } else {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t("orgDepartManagement.Hint.fetchFailed"),
            type: "warning",
          });
          this.memberDialogVisible = false;
        }
        this.loading = false;
      });
    },
    cancelMemberDialog() {
      this.flagMemDialog = false;
      this.memberDialogVisible = false;
    },
    confirmMemberDialog() {
      let data = this.$refs.addPesonelRef.pushParentData();
      let userIds = data.map((ele) => {
        return ele.F_UserId;
      });
      this.flagMemDialog = true;
      let params = { departmentId: this.departmentId, userIds: userIds };
      addDepartmentsSpecialPostUser(params).then((res) => {
        this.cancelMemberDialog();
        this.showNotify(
          res,
          this.$t("companyManager.companyFormDialog.Modal.Title")
        );
      });
    },
    updateTable(id) { // 在删除或者添加操作成功之后，调用此函数
      if(id ==='0') this.treeLoad()
      if(!this.maps.has(id)) return
      const { tree, treeNode, resolve} = this.maps.get(id)
      this.$set(this.$refs.crud.$refs.table.store.states.lazyTreeNodeMap, id, [])
      this.treeLoad(tree, treeNode, resolve)
    },
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
.el-tag--mini {
  /* margin-right: 10px; */
  cursor: pointer;
}

div /deep/ .el-form div:nth-child(odd) .el-form-item .el-form-item__label {
  width: 70px !important;
}
div /deep/ .el-form div:nth-child(odd) .el-form-item .el-form-item__content {
  margin-left: 70px !important;
}

@media screen and (max-width: 1370px) {
  div /deep/.el-dialog {
    margin-top: 8vh !important;
  }
}
div /deep/ .custom-tree-node span {
  font-size: 14px;
  padding-left: 10px;
}
div /deep/ .custom-tree-node i {
  font-size: 12px;
}

@media screen and (max-width: 1142px) {
  /deep/ .avue-crud__left {
    margin-left: 5px !important;
    float: left;
    margin-top: 40px;
  }
}
</style>
