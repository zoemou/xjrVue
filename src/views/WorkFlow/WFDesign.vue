<template>
  <div class="main-container" :style="{ padding: elTree.showLeftTree ? '0 10px' : '0' }">
    <MainFixed :title="fixedTitle" v-if="elTree.showLeftTree">
      <div slot="list">
        <elTree
          :data="elTree.data"
          :props="elTree.props"
          :node-key="elTree.nodeKey"
          ref="leftListTree"
          :default-expand-all="false"
          @node-click="elTree.NodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <i class="icon-liucheng"></i>
            <span>{{ data.F_ItemName}}</span>
          </span>
        </elTree>
      </div>
    </MainFixed>
    <main-content
      :title="contentTitle"
      :paddingLeft="elTree.showLeftTree ? 205 : 210"
      :padding-top="94"
    >
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="search.Keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right:5px;"
          ></el-input>
          <el-select
            v-model="search.Category"
            :placeholder="$t('workFlow.WFDesign.placeholderSelectType')"
            style="width: 200px; margin-right:5px;"
            v-if="elTree.showLeftTree == false"
          >
            <el-option
              v-for="item in elTree.data"
              :key="item.F_ItemValue"
              :label="item.F_ItemName"
              :value="item.F_ItemValue"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="getList"
          >{{$t('searchModule.searchBtn')}}</el-button>
          <el-button
            icon="el-icon-circle-close"
            size="small"
            @click="searchReset"
          >{{$t ('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table" style="height: 100%; overflow: overlay;" v-loading="mainLoading">
        <avue-crud
          ref="tableList"
          :data="tableList"
          :option="option"
          @row-click="handleCurrentRowChange"
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @on-load="onPageLoad"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="activitiView()"
              v-if="hasButtonPermission('add')"
            >{{$t('buttonModule.addBtn')}}</el-button>
            <el-button
              size="small"
              @click="showBmp"
              v-if="hasButtonPermission('preview')"
            >{{$t('workFlow.WFDesign.previewBtn')}}</el-button>
            <el-button
              size="small"
              @click="updateStatus(1)"
              v-if="hasButtonPermission('enable')"
            >{{$t('workFlow.WFDesign.enableBtn')}}</el-button>
            <el-button
              size="small"
              @click="updateStatus(0)"
              v-if="hasButtonPermission('disenable')"
            >{{$t('workFlow.WFDesign.stopBtn')}}</el-button>
            <el-button
              size="small"
              @click="hisVersionList"
              v-if="hasButtonPermission('history')"
            >{{$t('workFlow.WFDesign.viewHistoryBtn')}}</el-button>
            <el-button
              size="small"
              @click="exportFlow('bpmn')"
              v-if="hasButtonPermission('export')"
            >{{$t('workFlow.WFDesign.exportCommonBtn')}}</el-button>
            <el-button
              size="small"
              @click="importFlow('bpmn')"
              v-if="hasButtonPermission('import')"
            >{{$t('workFlow.WFDesign.importCommonBtn')}}</el-button>
            <el-button
              size="small"
              @click="exportFlow('flow')"
              v-if="hasButtonPermission('exportFlow')"
            >{{$t('workFlow.WFDesign.exportFlowBtn')}}</el-button>
            <el-button
              size="small"
              @click="importFlow('flow')"
              v-if="hasButtonPermission('importFlow')"
            >{{$t('workFlow.WFDesign.importFlowBtn')}}</el-button>
            <el-button
              size="small"
              @click="CategoryFlowList"
              v-if="hasButtonPermission('category')"
            >{{$t('workFlow.WFDesign.classifyManageBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              @click="activitiView(scope.row.F_ModelId)"
              v-if="hasButtonPermission('modify')"
            >{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button
              type="opr-danger"
              size="mini"
              @click="deleteForm(scope.row)"
              v-if="hasButtonPermission('delete')"
            >{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="dialog.title"
      :append-to-body="true"
      :visible.sync="dialog.visible"
      :width="dialog.width"
      :fullscreen="dialog.fullscreen"
      :before-close="closeDialog"
      :custom-class="dialog.component == 'BpmnModeler' ? 'bpmn-box' : ''"
    >
      <HistoryList
        v-if="dialog.component == 'HistoryList' && dialog.visible"
        :id="clickRow.F_Id"
        :title="clickRow.F_Name"
        @close="closeDialog"
      ></HistoryList>
      <ImportFlow
        v-if="dialog.component == 'importFlow' && dialog.visible"
        :importType="importType"
        @createBpmn="createBpmn"
      ></ImportFlow>
      <BpmnView
        v-if="dialog.component == 'BpmnView' && dialog.visible"
        :deploymentId="deploymentId"
      ></BpmnView>
      <BpmnModeler
        v-if="dialog.component == 'BpmnModeler' && dialog.visible"
        :modulesId="modulesId"
        :isEdit="bpmnIsEdit"
        :isImport="bpmnIsImport"
        :json="bpmnJsonData"
        @save="closeDialog"
      ></BpmnModeler>
      <CategoryList v-if="dialog.component == 'CategoryList' && dialog.visible"></CategoryList>
    </el-dialog>
  </div>
</template>
<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import {
  registerBpmnModule,
  resetBpmnModuleAll,
} from "./components/bpmn/common/util/modelId";
import { newModel, getInfo } from "@/api/bpmn";
import {
  getQueryNwfSchemeInfo,
  deleteNwfScheme,
  patchStart,
  patchStop,
} from "@/api/workFlow/WFDesign";
import ImportFlow from "./components/ImportFlow.vue";
import BpmnView from "./components/BpmnView.vue";
import CategoryList from "./components/CategoryList.vue";
import HistoryList from "./components/HistoryList.vue";
import BpmnModeler from "./components/bpmn/Bpmn";
import { baseUrl } from "@/config/env";
import request from "@/router/axios";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getStore } from "@/util/store";
import website from "@/config/website";
export default {
  name: "WFDesign",
  props: {
    showLeftTree: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [tableOptionMixin, authorizeMixin,displayColumnsMixin],
  components: {
    MainContent,
    MainFixed,
    ImportFlow,
    BpmnView,
    CategoryList,
    HistoryList,
    BpmnModeler,
  },
  data() {
    let self = this;
    return {
      mainLoading: false,
      dialog: {
        title: "标题",
        visible: false,
        component: "",
        width: "30%",
        fullscreen: false,
      },
      modulesId: "",
      importType: "bpmn",
      bpmnIsEdit: false,
      bpmnIsImport: false,
      bpmnJsonData: {},
      fixedTitle: this.$t("workFlow.WFDesign.fixedTitle"),
      contentTitle: "模板列表",
      clickRow: { F_Id: "" },
      search: {
        Keyword: "",
        Category: "",
      },
      elTree: {
        data: [],
        nodeKey: "F_ItemDetailId",
        defaultCheckedIndex: 0,
        props: {
          label: "F_ItemName",
          children: null,
          disabled: null,
          isLeaf: null,
        },
        showLeftTree: this.showLeftTree,
        NodeClick: function (data, element, component) {
          self.clickRow.F_Id = "";
          self.contentTitle = data.contentTitle || data.label;
          self.search.Keyword = null;
          self.search.Category = data.F_ItemDetailId;
          self.getList();
        },
      },
      iframeSrc: "",
      deploymentId: "",
      tableList: [],
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      option: {
        menuWidth: 150,
        highlightCurrentRow: true,
        stripe: false,
        border: false,
        page: true,
        index: true,
        indexLabel: this.$t("workFlow.WFDesign.tabNum"),
        align: "center",
        menuAlign: "center",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t("workFlow.WFDesign.tabCode"),
            prop: "F_Code",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("workFlow.WFDesign.tabName"),
            prop: "F_Name",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("workFlow.WFDesign.tabCategory"),
            prop: "F_Category",
            width: "120",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("workFlow.WFDesign.tabFlowState"),
            prop: "F_EnabledMark",
            width: "100",
            align: "left",
            sortable: true,
            formatter: function (row) {
              return row.F_EnabledMark === 1
                ? self.$t("custmerForm.tableEnable")
                : self.$t("buttonModule.deactivateBtn");
            },
          },
          {
            label: this.$t("workFlow.WFDesign.tabCreateUser"),
            prop: "F_CreateUserName",
            width: "110",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("workFlow.WFDesign.tabCreateDate"),
            prop: "F_CreateDate",
            width: "140",
            align: "left",
            sortable: true,
          },
          {
            label: this.$t("workFlow.WFDesign.tabRemarks"),
            prop: "F_Description",
            align: "left",
            sortable: true,
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleRowDBLClick(row, event) {
      if (this.hasButtonPermission("modify") && this.openDoubleClickEdit) {
        this.activitiView(row.F_ModelId);
      }
    },
    async init() {
      let resData = await this.$store.dispatch("updatewWorkFlowCategory");
      this.elTree.data = resData;
    },
    handleCurrentRowChange(row, event, column) {
      this.clickRow = row;
    },
    onPageLoad(page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.getList();
    },
    async getList() {
      this.clickRow.F_Id = "";
      // this.mainLoading = true;
      let params = {
        Limit: this.page.currentPage,
        Size: this.page.pageSize,
      };
      try {
        let res = await getQueryNwfSchemeInfo({ ...params, ...this.search });
        if (res.data.success) {
          this.tableList = res.data.data.Rows;
          this.page.total = res.data.data.Total;
        } else {
          this.tableList = [];
          this.page.total = 0;
        }
      } catch (error) {
        this.tableList = [];
        this.page.total = 0;
      }
      // this.mainLoading = false;
    },
    searchReset() {
      this.search.Keyword = null;
      this.getList();
    },
    async activitiView(modulesId = "") {
      this.$store.commit("SET_ALL_FORM", []);
      // this.mainLoading = true;
      registerBpmnModule();
      try {
        if (modulesId) {
          this.bpmnIsEdit = true;
          this.bpmnIsImport = false;
          let res = await getInfo(modulesId);
          if (res.data.success) {
            this.bpmnJsonData = res.data.data;
            let json = res.data.data.json;
            let childShapes = JSON.parse(json).childShapes;

            childShapes.forEach((o) => {
              if (o.properties?.tableData?.length > 0) {
                o.properties.tableData.forEach((it) => {
                  this.$store.dispatch("addAllForm", { obj: it, id: "" });
                });
              }
              if (o.childShapes?.length > 0) {
                o.childShapes.forEach((x) => {
                  if (x.properties?.tableData?.length > 0) {
                    x.properties.tableData.forEach((it) => {
                      this.$store.dispatch("addAllForm", { obj: it, id: "" });
                    });
                  }
                });
              }
            });
          } else {
            this.$notify({
              title: this.$t("deletePrompt.promptTitle"),
              message: this.$t("workFlow.WFDesign.hintGetFailed"),
              type: "warning",
            });
            // this.mainLoading = false;
            return false;
          }
        } else {
          let res = await newModel();
          modulesId = res.data.data;
          this.bpmnIsEdit = false;
        }
        this.modulesId = modulesId;
        this.dialog.title = this.bpmnIsEdit
          ? this.$t("workFlow.WFDesign.titleEditFlow")
          : this.$t("workFlow.WFDesign.titleAddFlow");
        this.openDialog({
          title: this.dialog.title,
          component: "BpmnModeler",
          width: "80%",
          fullscreen: true,
        });
      } catch (error) {}
      //添加兼容样式类
      document.body.className = document.body.className + " original";
      // this.mainLoading = false;
    },
    deleteForm() {
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          deleteNwfScheme(this.clickRow.F_Id).then((res) => {
            if (res.data.success) {
              this.getList();
              this.$notify({
                title: this.$t("deletePrompt.promptTitle"),
                message: this.$t("deletePrompt.successDeleted"),
                type: "success",
              });
            } else {
              this.$notify({
                title: this.$t("deletePrompt.promptTitle"),
                message: this.$t("deletePrompt.failedDeleted"),
                type: "warning",
              });
            }
          });
        })
        .catch(() => {});
    },
    showBmp() {
      if (this.clickRow.F_Id === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning",
        });
        return;
      }
      this.deploymentId = this.clickRow.F_DeploymentId;
      this.openDialog({
        title: this.$t("workFlow.WFDesign.titlePreview") + this.clickRow.F_Name,
        component: "BpmnView",
        width: "100%",
        fullscreen: true,
      });
    },
    CategoryFlowList() {
      this.openDialog({
        title: this.$t("workFlow.WFDesign.titleFlowManage"),
        component: "CategoryList",
        width: "50%",
      });
    },
    openDialog({ title, component, width, fullscreen = false }) {
      this.dialog.width = width;
      this.dialog.title = title;
      this.dialog.component = component;
      this.dialog.visible = true;
      this.dialog.fullscreen = fullscreen;
    },
    updateStatus(status) {
      if (this.clickRow.F_Id === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning",
        });
        return;
      }
      if (this.clickRow.F_EnabledMark == 1 && status == 1) {
        this.$message({
          message: this.$t("workFlow.WFDesign.hintFlowEnabled"),
          type: "warning",
        });
        return;
      }
      if (this.clickRow.F_EnabledMark == 0 && status == 0) {
        this.$message({
          message: this.$t("workFlow.WFDesign.hintFlowStop"),
          type: "warning",
        });
        return;
      }
      let title =
        status == 0
          ? this.$t("workFlow.WFDesign.labelStop")
          : this.$t("workFlow.WFDesign.enableBtn");
      this.$confirm(
        this.$t("workFlow.WFDesign.hintSure") +
          `${title}` +
          this.$t("workFlow.WFDesign.hintWF"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          this.patchFlow(status);
        })
        .catch(() => {});
    },
    async patchFlow(status) {
      let res = {};
      if (status == 0) {
        res = await patchStop(this.clickRow.F_Id);
      } else {
        res = await patchStart(this.clickRow.F_Id);
      }
      if (res.data.success) {
        this.$notify({
          title: this.$t("deletePrompt.successTitle"),
          message: this.$t("workFlow.WFDesign.hintSuccess"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("deletePrompt.failureTitle"),
          message: this.$t("workFlow.WFDesign.hintFailure"),
          type: "warning",
        });
      }
      this.getList();
    },
    hisVersionList() {
      if (this.clickRow.F_Id === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning",
        });
        return;
      }
      this.openDialog({
        title:
          this.$t("workFlow.WFDesign.titleHistoryRecord") +
          this.clickRow.F_Name,
        component: "HistoryList",
        width: "50%",
      });
    },
    exportFlow(type) {
      if (this.clickRow.F_Id === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning",
        });
        return;
      }
      let fileUrl =
        baseUrl +
        "/workflow-scheme-info/" +
        (type == "bpmn" ? "process-xml" : "process-json") +
        "?id=" +
        this.clickRow.F_Id;
      this.download(fileUrl, this.clickRow.F_Name);
    },
    download(fileUrl, fileName) {
      const loading = this.$loading({
        lock: true,
        text: this.$t("workFlow.WFDesign.hintDownload"),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      request({
        url: fileUrl,
        method: "get",
      }).then((res) => {
        const ct = res.data;
        let url = window.URL.createObjectURL(
          new Blob([ct], {
            type: "application/octet-stream;charset=utf-8",
          })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      });
    },
    importFlow(type) {
      this.importType = type;
      this.openDialog({
        title:
          type == "bpmn"
            ? this.$t("workFlow.WFDesign.titleImportCommon")
            : this.$t("workFlow.WFDesign.titleImportFlow"),
        component: "importFlow",
        width: "800px",
      });
    },
    async createBpmn(json) {
      this.closeDialog();
      registerBpmnModule();
      this.bpmnJsonData = json;
      try {
        let res = await newModel();
        let modulesId = res.data.data;
        if (modulesId) {
          this.modulesId = modulesId;
          this.dialog.title = this.$t("workFlow.WFDesign.titleImportFlowDes");
          this.bpmnIsImport = true;
          this.bpmnIsEdit = true;
          this.openDialog({
            title: this.dialog.title,
            component: "BpmnModeler",
            width: "80%",
            fullscreen: true,
          });
        }
      } catch (error) {}
    },
    closeDialog() {
      if (this.dialog.component == "BpmnModeler") {
        resetBpmnModuleAll();
      }
      if (this.dialog.component == "CategoryList") {
        this.elTree.data = this.$store.state.workflow.workflowCategory;
      }
      this.dialog.title = "";
      this.dialog.fullscreen = false;
      this.dialog.visible = false;
      this.dialog.component = "";
      this.dialog.width = "30%";
      //删除兼容样式类
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      //系统表单依赖localStorage清空
      window.localStorage.setItem("lookSystemForm", 0);
      this.getList();
    },
  },
};
</script>

<style scoped>
div /deep/ .custom-tree-node span {
  font-size: 14px;
  padding-left: 10px;
}
div /deep/ .custom-tree-node i {
  font-size: 12px !important;
}
/* @media screen and (max-width: 1606px) {
	 div  /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	} */
</style>
<style lang="css" scoped>
::v-deep .el-dialog.is-fullscreen.bpmn-box .el-dialog__body {
  height: calc(100% - 60px);
  overflow: hidden;
  padding: 0;
}
.bpmn-box .el-dialog__body {
  padding: 0;
}
.bpmn-box .el-dialog__header {
  padding: 0;
  border: 0;
  height: 50px;
}
.bpmn-box .el-dialog__title {
  height: 50px;
  line-height: 50px;
  margin-left: 10px;
}
</style>
