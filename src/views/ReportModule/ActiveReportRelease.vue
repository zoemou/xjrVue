<template>
  <div class="main-container" style="height: 100%; padding: 0 10px;">

    <main-content :title="contentTitle" :paddingLeft="0" padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                    style="width: 200px; margin-right: 10px"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud ref="cuTable" :data="tableData" :option="option" stripe :page.sync="page" @on-load="onPageLoad"
                   @sort-change="sortChange">
          <template slot-scope="scope" slot="menuLeft">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openForm('dataForm')">{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="primary" size="mini" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="danger" size="mini" @click="deleteForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">
        <el-form :rules="rules" ref="dataForm" :model="dataForm" label-width="75px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="F_EnCode" :label="$t('reportModule.reportRelease.labelMenuNum')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderMenuNum')" size="small" v-model="dataForm.F_EnCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="F_FullName" :label="$t('reportModule.reportRelease.labelMenuName')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderMenuName')" size="small" v-model="dataForm.F_FullName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_ParentId" :label="$t('reportModule.reportRelease.tabParMenu')">
                <avue-input-tree default-expand-all v-model="dataForm.F_ParentId" :placeholder="$t('reportModule.reportRelease.placeholderSelectSuper')" type="tree"
                                 :dic="parentTree" size="small" style="width: 100%"></avue-input-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_RptFileId" :label="$t('reportModule.reportRelease.labelRptFileId')">
                <el-select v-model="dataForm.F_RptFileId" :placeholder="$t('reportModule.reportRelease.placeholderRptFileId')" size="small" style="width: 100%">
                  <el-option v-for="item in reportFile" :key="item.Id" :label="item.F_Name"
                             :value="item.F_Id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="F_SortCode" :label="$t('reportModule.reportRelease.labelSort')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderSort')" size="small" type="number" v-model="dataForm.F_SortCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="F_Icon" :label="$t('reportModule.reportRelease.labelIcon')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderIcon')" size="small" v-model="dataForm.F_Icon">
                  <i slot="suffix" class="el-icon-more" @click="selectMoreIcon"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('reportModule.reportRelease.labelFuncDesc')">
                <el-input type="textarea" :placeholder="$t('reportModule.reportRelease.placeholderFuncDesc')" size="small"
                          v-model="dataForm.F_Description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm('dataForm')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button size="mini" type="primary" @click="formSubmit('dataForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
            </span>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('reportModule.reportRelease.dialogTitle.selectIconTitle')" :append-to-body="true" :visible.sync="IconVisible" width="80%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <FontHtml v-on:childByValue="childByValue"></FontHtml>
    </el-dialog>
  </div>
</template>

<script>
  import MainFixed from '../../page/main/MainFixed';
  import MainContent from '../../page/main/MainContent';
  import { FormatTree, getOrder } from '../../util/util.js';
  import { getMenuTree } from '@/api/systemManagement/menu';
  import { getReportContent } from '@/api/report/reportcontentmanager';
  import { getReportRelease, addReportRelease, modifyReportRelease, deleteReportRelease } from '@/api/report/activereportrelease';
  import FontHtml from '../FontAwesome.vue';

  export default {
    name: 'ActiveReportRelease',
    components: { MainContent, MainFixed, FontHtml },
    data () {
      return {
        fixedTitle:this.$t('reportModule.reportRelease.fixedTitle'),
        contentTitle: '报表数据',
        defaultProps: { children: 'children', label: 'F_FullName' },
        dialogVisible: false,
        IconVisible: false,
        dialogTitle: '',
        searchParam: { limit: 1, size: 20, keyword: null, order: null, orderfield: null },
        page: { pageSize: 20, total: 0, currentPage: 1 },
        option: {
          highlightCurrentRow: true,
          stripe: true,
          addBtn: false,
          menuWidth: 150,
          maxHeight: 550,
          border: true,
          page: false,
          index: true,
          indexLabel: '序号',
          align: 'center',
          menuAlign: 'center',
          delBtn: false,
          editBtn: false,
          column: [{ sortable: true, label: this.$t('reportModule.reportRelease.labelMenuNum'), prop: 'F_EnCode' },
            { sortable: true, label:this.$t('reportModule.reportRelease.labelMenuName'), prop: 'F_FullName' },
            { sortable: true, label: this.$t('reportModule.reportRelease.tabParMenu'), prop: 'F_ModuleName' },
            { sortable: true, label:this.$t('reportModule.reportRelease.tabBouReport'), prop: 'F_RptFileId' },
            { sortable: true, label:this.$t('reportModule.reportRelease.tabRemark'), prop: 'F_Description' }]
        },
        dataForm: {
          F_EnCode: '',
          F_FullName: '',
          F_ParentId: '',
          F_SortCode: '',
          F_Icon: '',
          F_RptFileId: '',
          F_Description: '',
          F_Component : 'views/ReportModule/ActiveReportView',
          F_Id: ''
        },
        rules: {
          F_EnCode: [{ required: true, message: this.$t('reportModule.reportRelease.placeholderMenuNum'), trigger: 'blur' }],
          F_FullName: [{ required: true, message:this.$t('reportModule.reportRelease.placeholderMenuName'), trigger: 'blur' }],
          F_ParentId: [{ required: true, message:this.$t('reportModule.reportRelease.hintParMenu'), trigger: 'blur' }],
          F_RptFileId: [{ required: true, message:this.$t('reportModule.reportRelease.hintRptFileId'), trigger: 'blur' }],
        },
        reportFile: [],
        tableData: [],
        parentTree: [],
      };
    },
    created () {
      this.getMenuTree();
      this.getReportContent();
      this.getData(this.searchParam);
    },
    methods: {
      /* 上级树 */
      getMenuTree () {
        getMenuTree().then(res => {
          this.parentTree = FormatTree(res.data.data, 'F_ModuleId', 'F_FullName', 'children');
        });
      },
      /* 报表文件下拉 */
      getReportContent () {
        getReportContent().then(res => {
          this.reportFile = res.data.data;
        });
      },
      /* 获取数据 */
      getData (params) {
        getReportRelease(params).then(res => {
          this.tableData = res.data.data.Rows;
          this.page.total = res.data.data.Total;
        });
      },
      /* 新增 */
      openForm (formName) {
        this.flag = true;
        this.dataForm = {};
        this.dialogVisible = true;
        this.dialogTitle = this.$t('reportModule.reportRelease.dialogTitle.addTitle');
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      /* 编辑 */
      editForm (row) {
        this.flag = false;
        this.dialogVisible = true;
        this.dialogTitle = this.$t('reportModule.reportRelease.dialogTitle.editorTitle');
        this.dataForm = row;
      },
      /* 删除 */
      deleteForm (row) {
        this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText:this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deleteReportRelease(row.F_Id).then(() => {
            this.getData(this.searchParam);
            this.$notify({ title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
          this.$notify({ title:this.$t('deletePrompt.failureTitle'), message: this.$t('deletePrompt.failedDeleted'), type: 'warning' });
        });
      },
      /* 提交表单 */
      formSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dataForm.F_Component = 'views/ReportModule/ActiveReportView'
            if (this.flag) {
              addReportRelease(this.dataForm).then(() => {
                this.dialogVisible = false;
                this.getData(this.searchParam);
              });
            } else {
              modifyReportRelease(this.dataForm.F_Id, this.dataForm).then(() => {
                this.dialogVisible = false;
                this.getData(this.searchParam);
              });
            }
          } else {
            return false;
          }
        });
      },
      /* 取消弹窗 */
      cancelForm (formName) {
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
      },
      /* 关闭弹窗 */
      handleClose (done) {
        this.$refs['dataForm'].resetFields();
        done();
      },
      /* 页面加载 */
      onPageLoad (page) {
        this.searchParam.limit = page.currentPage;
        this.searchParam.size = page.pageSize;
        this.getData(this.searchParam);
      },
      /* 查询 */
      searchData () {
        this.searchParam.limit = 1;
        this.searchParam.order = null;
        this.searchParam.orderfield = null;
        this.getData(this.searchParam);
      },
      /* 查询表单重置 */
      searchReset () {
        this.searchParam.keyword = null;
        this.getData(this.searchParam);
      },
      sortChange (data) {
        this.searchParam.order = getOrder(data.order);
        this.searchParam.orderfield = data.prop;
        this.getData(this.searchParam);
      },
      selectMoreIcon () {
        this.IconVisible = true;
      },
      childByValue: function (childValue) {
        // childValue就是子组件传过来的值
        this.dataForm.F_Icon = childValue;
        this.IconVisible = false;
      }
    }
  };
</script>