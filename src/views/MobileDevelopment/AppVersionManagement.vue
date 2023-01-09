<template>
  <div class="main-container">
    <main-content :title="contentTitle" :paddingLeft="0" padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.keyword"
            size="small"
            :placeholder="$t('enterTheVersionNameVersionNumberToQuery')"
            style="width: 250px; margin-right: 5px;"
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
          :data="versionList"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          :page.sync="page"
          @row-dblclick="handleRowDBLClick"
          @on-load="getVersionList"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              v-if="hasButtonPermission('add')"
              @click="showFormDialog('add')"
            >{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('view')"
              @click="showFormDialog('view', scope.row)"
            >{{$t('workFlow.schemeFormIndex.tabView')}}</el-button>
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
              @click="deleteVersion(scope.row)"
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
      width="50%"
      :before-close="closeDialog"
    >
      <div class="versionInfo-form">
        <VersionInfo v-if="dialogVisible" ref="versionInfo" @flagStatus="changeFlag" @submitVersion="submitVersion" :type="dialogType" :versionId="versionId" :showNotify="showNotify"></VersionInfo>
      </div>
      <span slot="footer" class="dialog-footer" v-show="dialogType !== 'view'">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confirmDialog"
          :loading="flagBtn"
        >{{flagBtn?$t('workFlow.WFMenu.hintSubmit'):$t('submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import { getVersionList, deleteVersionInfo } from '@/api/mobileBuild/version'
import VersionInfo from "./components/VersionInfo.vue";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: "AppVersionManagement",
  mixins: [authorizeMixin, tableOptionMixin,displayColumnsMixin],
  components: {
    MainContent,
    VersionInfo
  },
  data() {
    return {
      versionList:[],
      flagBtn: false,
      mainLoading: false, 
      contentTitle: "版本管理",
      searchParam: { keyword: null },
      dialogType: "",
      versionId:'',
      dialogVisible: false,
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
      },
      option: {
        indexLabel: this.$t('dataItem.tableNumber'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        highlightCurrentRow: true,
        addBtn: false,
        menuWidth: 150,
        index: true,
        rowKey: "F_Id",
        page: true,
        simplePage:false,
        column: [
          {
            label: this.$t('appVersionNumber'),
            prop: "F_Version",
            sortable: true,
          },
          {
            label: this.$t('appVersionName'),
            prop: "F_Name",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t('Notice.labelReleaTime'),
            prop: "F_CreateDate",
            sortable: true,
          },
          {
            label: this.$t('publisher'),
            prop: "F_CreateUserName",
            sortable: true,
          },
          {
            label: this.$t('changelog'),
            prop: "F_UpdateLog",
            align: "left",
            sortable: true,
          }
        ],
      },
    };
  },
  created() {
    this.getVersionList();
  },
  computed: {
    dialogTitle(){
      let title = ''
      switch (this.dialogType) {
        case 'add':
          title = this.$t('Notice.dialogTitle.Add')
          break;
        case 'edit':
          title = this.$t('Notice.dialogTitle.Edit')
          break;
        case 'view':
          title = this.$t('crud.viewTitle')
          break;
      }
      return `${title}`+' '+this.$t('appVersion')
    }
  },
  methods: {
    handleRowDBLClick(row, event) {
      if (this.hasButtonPermission("modify")) {
        this.showFormDialog("edit", row);
      }
    },
    searchMenu() {
      this.page.currentPage = 1
      this.getVersionList();
    },
    onPageLoad() {
      this.getVersionList();
    },
    searchReset() {
      this.page.currentPage = 1
      this.searchParam.keyword = null;
      this.getVersionList();
    },
    async getVersionList() {
      let params = {
        limit: this.page.currentPage,
        size: this.page.pageSize,
        keyword:this.searchParam.keyword
      }
      try {
        const res = await getVersionList(params)
        const data = res.data.data
        this.versionList = data.Rows
        this.page.total = data.Total
      } catch (err) {
        console.log(err)
      }
      
    },
    showFormDialog(type,row) {
      this.dialogType = type
      this.versionId = row?.F_Id || ''
      this.dialogVisible = true
    },
    submitVersion() {
      this.closeDialog()
      this.getVersionList()
    },
    deleteVersion(row) {
      this.$confirm(
        this.$t('areYouSureYouWantDeleteVersion'),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          deleteVersionInfo(row.F_Id).then((res) => {
            this.showNotify(
              res,
              this.$t('deleteVersion')
            );
            this.getVersionList()
          });
        })
        .catch(() => {});
    },
    confirmDialog() {
      this.$refs.versionInfo.versionInfoSubmit()
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
    },
    changeFlag(status) {
      this.flagBtn = status
    },
    closeDialog() {
      this.dialogVisible = false;
      this.flagBtn = false;
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
@media screen and (max-width: 1370px) {
  div /deep/.el-dialog {
    margin-top: 8vh !important;
  }
}
</style>
