<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">
    <MainContent :title="contentTitle" :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            class="search-input"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchData"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="cuTable"
          :data="tableData"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="showDialog('add')"
              v-if="hasButtonPermission('add')"
              >{{$t('buttonModule.addBtn')}}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              @click="showDialog('edit', scope.row)"
              v-if="hasButtonPermission('modify')"
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button type="opr-danger" size="mini" 
              @click="deleteForm(scope.row)"
              v-if="hasButtonPermission('delete')"
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </MainContent>

    <elDialog
      v-if="elDialog.visible"
      :visible.sync="elDialog.visible"
      :title="elDialog.title"
      width="60%"
      :close-on-click-modal="false"
      :fullscreen="elDialog.fullscreen"
      :append-to-body="true"
    >
      <component
        v-if="elDialog.visible"
         v-loading="loading"
        :is="elDialog.componentName"
        :formData="dataForm"
        @submit="confirmDialog"
        @closeDialog="closeDialog"
      />
    </elDialog>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import {
  addDelegate,
  editDelegate,
  getDelegate,
  deleteDelegate,
} from "@/api/workFlow/WFDelegate";
import DelegateForm from "./components/DelegateForm";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: "WFDelegate",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent, DelegateForm },
  data() {
    return {
      loading:false,
      contentTitle: "流程委托",
      searchParam: { limit: 1, size: 20, keyword: null },
      page: { pageSize: 20, total: 0, currentPage: 1 },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('tableOperationModule.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabEntrusted'), prop: "F_ToUserName",align: 'left', },
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabStartDate'), prop: "F_BeginDate",width:"140",align: 'left',},
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabEndDate'), prop: "F_EndDate" ,width:"140",align: 'left',},
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabPrincipal'), prop: "F_CreateUserName",width:"100",align: 'left', },
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabCreateDate'), prop: "F_CreateDate" ,width:"140",align: 'left',},
          { sortable: true, label:this.$t('workFlow.WFDelegate.tabDescr'), prop: "F_Description",align: 'left', },
        ],
      },
      tableData: [],
      elDialog: {
        type: "",
        visible: false,
        title: "弹框示题",
        componentName: "DelegateForm",
      },
      dataForm: {},
    };
  },
  created() {

  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.showDialog('edit', row)
      }
    },
    async getList() {
      let res = await getDelegate(this.searchParam);
      if (res.data&&res.data.success) {
        this.tableData = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      }
    },
    showDialog(formName, row = {}) {
      if (formName == "add") {
        this.elDialog.title =this.$t('workFlow.WFDelegate.titleAddFlow');
        this.dataForm = {
          F_ToUserId: "",
          F_ToUserName: "",
          F_BeginDate: "",
          F_EndDate: "",
          F_Description: "",
          F_SchemeInfo: [],
          F_Id: "",
        };
      } else {
         this.elDialog.title = this.$t('workFlow.WFDelegate.titleEditFlow');
        this.dataForm = row;
      }
      this.elDialog.type = formName;
      this.elDialog.visible = true;
    },
    deleteForm(row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      })
        .then(() => {
          deleteDelegate(row.F_Id).then((res) => {
            if (res.data&&res.data.success) {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message:this.$t('deletePrompt.successDeleted'),
                type: "success",
              });
              this.getList();
            } else {
              this.$notify({
                title:this.$t('deletePrompt.failureTitle'),
                message:this.$t('deletePrompt.failedDeleted'),
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          // this.$notify({ title: "失败", message: "删除失败", type: "warning" });
        });
    },
    onPageLoad(page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
			this.page.currentPage=page.currentPage;
			this.page.pageSize=page.pageSize;
      this.getList();
    },
    searchData() {
      this.getList();
    },
    searchReset() {
      this.searchParam = { limit: 1, size: 20, keyword: null };
      this.getList();
    },
    async confirmDialog(data) {
      this.loading = true;
      let res = { code: 0, data: { data: [], success: false } };
      try {
        if (this.elDialog.type === "add") {
          res = await addDelegate(data);
        } else {
          res = await editDelegate(data);
        }
        if (res.data.success) {
          this.elDialog.visible = false;
          this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message:this.$t('deletePrompt.hintSuccess'),
            type: "success",
          });
           this.getList();
        }
        this.loading = false;
      } catch (error) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.hintFailure'),
          type: "warning",
        });
        this.loading = false;
      }
    },
    closeDialog() {
      this.elDialog.visible = false;
    },
  },
};
</script>
<style scoped>
.search-input {
  width: 200px;
  margin-right: 10px;
}
@media screen and (max-width: 1370px) {
	div /deep/ .el-dialog{
		margin-top: 5vh!important;
	}
}
div /deep/ .el-dialog{
	margin-top: 10vh!important;
}
</style>
