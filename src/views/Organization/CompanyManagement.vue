<template>
  <div class="main-container">
    <main-content :title="contentTitle" :paddingLeft="0" padding-top="94">
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
          :data="companies"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @tree-load="treeLoad"
          @row-click="rowClick"
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
              v-if="hasButtonPermission('roleconfigure')"
              size="small"
              @click="setDialogVisible = true"
            >{{$t('companyManager.approvalRoleBtn')}}</el-button>
          </template>
          <template slot="F_Nature" slot-scope="scope">
            <el-tag
              type="primary"
              size="mini"
              v-if="hasButtonPermission('role')"
              @click="showFormDialog('role', scope.row)"
            >{{$t('companyManager.checkRole')}}</el-tag>
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
              @click="deleteRowCompany(scope.row)"
            >{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>

    <!-- 用于添加公司的对话框 -->
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
          <el-tab-pane :label="$t('companyManager.titleBasicInformation')" v-if="showBasicTab">
            <company-form-dialog
              ref="dialogForm"
              :companyForm.sync="companyFormList"
              :formEnCodeList="formEnCodeList"
              :parentIdList="parentIdList[companyFormList.F_CompanyId]"
            ></company-form-dialog>
          </el-tab-pane>
          <el-tab-pane :label="$t('companyManager.titleRoleInformation')">
            <role-of-information
              ref="roleRef"
              :id="companyId"
              :roleSpecialPostId="roleSpecialPostId"
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
          :loading="flagBtn"
        >{{flagBtn?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
        <LoadingMask v-if="loading"></LoadingMask>
      </span>
    </el-dialog>
    <role-configuration
      v-if="setDialogVisible"
      :dialogVisible.sync="setDialogVisible"
      :roleType="roleType"
      @closeSetDialog="closeSetDialog"
    ></role-configuration>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import RoleConfiguration from "./components/RoleConfiguration.vue";
import RoleOfInformation from "./components/RoleOfInformation.vue";
import CompanyFormDialog from "./components/CompanyFormDialog.vue";
import LoadingMask from "./components/LoadingMask.vue";
import { getLowerCompanies, getAllCompanies } from "@/api/organization/company";
import {
  addCompany,
  editCompany,
  deleteCompany,
} from "@/api/organization/company";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { deepClone, formValidateNotice } from "@/util/util";
export default {
  name: "CompanyManagement",
  mixins: [authorizeMixin, tableOptionMixin,displayColumnsMixin],
  components: {
    MainContent,
    CompanyFormDialog,
    RoleConfiguration,
    RoleOfInformation,
    LoadingMask,
  },
  data() {
    return {
      flagBtn: false,
      loading: false,
      mainLoading: false, 
      fixedTitle: this.$t("companyManager.fixedTitle"),
      contentTitle: "公司列表",
      companies: [],
      searchParam: { keyword: null },
      companyFormList: {},
      dialogTitle: this.$t("companyManager.modalTitleInsert"),
      dialogType: "add",
      roleType: 1, //角色信息为公司
      roleSpecialPostId: "",
      dialogVisible: false,
      showBasicTab: false,
      setDialogVisible: false,
      memberDialogVisible: false,
      selectedList: [],
      companyId: "",
      parentId: "",//修改刷新页面使用
      maps: new Map(),
      parentIdList:{},
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      defaultProps: {
        children: "children",
        label: "F_FullName",
      },
      option: {
        indexLabel: this.$t("companyManager.tabNum"),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        highlightCurrentRow: true,
        addBtn: false,
        border: false,
        index: true,
        rowKey: "F_CompanyId",
        menuWidth: 150,
        page: true,
        companyId: "",
        stripe: false,
        lazy:true,
        column: [
          {
            label: this.$t("companyManager.tabCompanyName"),
            prop: "F_FullName",
            align: "left",
            minwidth: "400",
            sortable: true,
          },
          {
            label: this.$t("companyManager.tabCompanyCode"),
            prop: "F_EnCode",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("companyManager.tabCompanyAbbreviation"),
            prop: "F_ShortName",
            align: "left",
            sortable: true,
          },
          // {
          //   label: "公司性质",
          //   prop: "F_Nature",
          // },
          {
            label: this.$t("companyManager.tabApprovalRole"),
            prop: "F_Nature",
            width: "110",
            slot: true,
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("companyManager.tabManager"),
            prop: "F_Manager",
            width: "110",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("companyManager.tabBusinessScope"),
            prop: "F_BusinessScope",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("companyManager.tabFoundedTime"),
            prop: "F_FoundedTime",
            width: "180",
            align: "left",
            sortable: true,
          },
        ],
      },
    };
  },
  created() {
    this.treeLoad();
  },
  methods: {
    handleRowDBLClick(row, event) {
      if (this.hasButtonPermission("modify") && this.openDoubleClickEdit) {
        this.showFormDialog("edit", row);
      }
    },
    searchMenu() {
      this.getAllCompanies();
    },
    searchReset() {
      this.searchParam.keyword = null;
      this.treeLoad();
    },
    async treeLoad(tree, treeNode, resolve) {
      try {
        const id = tree ? tree.F_CompanyId : 0
        let res = await getLowerCompanies(id);
        if(id !==0) this.maps.set(id, { tree, treeNode, resolve }) // 将当前选中节点数据存储到maps中            
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
              this.parentIdList[item.F_CompanyId] = parentIds
            })
          } else {
            this.companies = res.data.data;
          }
        }
      } catch (error) {}
    },
    async getAllCompanies() {
      try {
        let res = await getAllCompanies(this.searchParam);
        if (res.data.success) {
          this.companies = res.data.data;
        }
      } catch (error) { }
    },
    showFormDialog(type, row) {
      this.loading = false;
      this.dialogType = type;
      if (type == "add") {
        this.roleSpecialPostId = "";
        this.dialogTitle = this.$t("companyManager.modalTitleInsert");
        this.companyFormList = {
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
          F_CompanyId: "",
          F_ParentName:""
        };
        this.showBasicTab = true;
      } else if (type == "role") {
        this.dialogTitle = this.$t("companyManager.modalTitleViewRoles");
        this.companyFormList = deepClone(row);
        this.companyId = row.F_CompanyId;
        this.roleSpecialPostId = row.F_CompanyId;
        this.showBasicTab = false;
      } else {
        this.dialogTitle = this.$t("companyManager.modalTitleEdit");
        this.companyFormList = deepClone(row);
        this.companyId = this.companyFormList.F_CompanyId;
        this.roleSpecialPostId = row.F_CompanyId;
        this.showBasicTab = true;
        this.parentId = row.F_ParentId
      }
      this.dialogVisible = true;
    },
    confirmDialog() {
      this.flagBtn = true;
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
      this.$refs.dialogForm.$refs.companyForm.validate((valid, object) => {
        if (valid) {
          this.companyFormList.postUserJson = {};
          this.companyFormList.F_CompanyId = this.companyId;
          let tempJson = {};
          this.$refs.roleRef.postJsonList.forEach((element) => {
            tempJson[element.F_Id] = element.memberIdsList;
          });
          this.companyFormList.postUserJson = tempJson;
          addCompany(this.companyFormList)
            .then((res) => {
              this.showNotify(res, this.$t("newCompany"));
              this.updateTable(this.companyFormList.F_ParentId || '0')
            })
            .finally(() => {
              //try...catch错误捕获机制可以 promise提供的finally更好
              this.flagBtn = false;
            });
        } else {
          formValidateNotice(object, this, this.formEnCodeList);
          this.flagBtn = false;
          return false;
        }
      });
    },
    edit() {
      this.loading = false;
      this.$refs.dialogForm.$refs.companyForm.validate((valid) => {
        if (valid) {
          let tempJson = {};
          this.$refs.roleRef.postJsonList.forEach((element) => {
            tempJson[element.F_Id] = element.memberIdsList;
          });
          this.companyFormList.postUserJson = tempJson;
          let params = {
            ...this.companyFormList,
            ...{ F_CompanyId: this.companyId },
          };
          editCompany(this.companyFormList.F_CompanyId, params)
            .then((res) => {
              this.showNotify(res, this.$t("modifyCompany"));
              this.updateTable(this.companyFormList.F_ParentId || '0')
              if (this.companyFormList.F_ParentId !== this.parentId) this.updateTable(this.parentId)
            })
            .finally(() => {
              this.flagBtn = false;
            });
        } else {
          this.flagBtn = false;
          return false;
        }
      });
    },
    roleDialog() {
      let tempJson = {};
      this.$refs.roleRef.postJsonList.forEach((element) => {
        tempJson[element.F_Id] = element.memberIdsList;
      });
      this.companyFormList.postUserJson = tempJson;
      let params = {
        ...this.companyFormList,
        ...{ F_CompanyId: this.companyId },
      };
      editCompany(this.companyFormList.F_CompanyId, params).then((res) => {
        this.showNotify(res, this.$t("orgDepartManagement.Hint.modifyRole"));
      });
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
    deleteRowCompany(row) {
      this.$confirm(
        this.$t("companyManager.modalDeleteCompanyPrompt"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          deleteCompany(row.F_CompanyId).then((res) => {
            this.updateTable(row.F_ParentId)
            this.showNotify(
              res,
              this.$t("companyManager.modalDeleteCompanyText")
            );
          });
        })
        .catch(() => {});
    },
    updateTable(id) { // 在删除或者添加操作成功之后，调用此函数
        if(id==='0') this.treeLoad()
        if(!this.maps.has(id)) return
        const { tree, treeNode, resolve } = this.maps.get(id)
        this.$set(this.$refs.crud.$refs.table.store.states.lazyTreeNodeMap, id, [])
        this.treeLoad(tree, treeNode, resolve)
    },
    closeDialog() {
      this.dialogVisible = false;
      this.flagBtn = false;
    },
    setDialog() {
      if (!this.companyId) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("companyManager.modalSelectContentPrompt"),
          type: "warning",
        });
        return false;
      }
      this.setDialogVisible = true;
    },
    closeSetDialog() {
      this.companyId = "";
      this.setDialogVisible = false;
    },
    rowClick(row) {
      this.companyId = row.F_CompanyId;
      this.roleSpecialPostId = row.F_CompanyId;
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
  margin-right: 10px;
  cursor: pointer;
}
@media screen and (max-width: 1370px) {
  div /deep/.el-dialog {
    margin-top: 8vh !important;
  }
  .companiesuser-form /deep/.el-tabs__content {
    max-height: 380px;
    overflow: scroll;
  }
}

/deep/ .el-dialog__body .avue-crud .el-input--small input {
  height: 20px;
  line-height: 20px;
}
</style>
