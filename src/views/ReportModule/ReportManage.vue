<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <el-tree :data="reportTree" :props="defaultProps" node-key="F_Id" ref="cTree" :default-expand-all="true"
                 current-node-key @node-click="handleNodeClick"></el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="205" :padding-top="40" :search="false">
      <div slot="table">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="openForm('dataForm')">{{$t('buttonModule.addBtn')}}</el-button>
        <el-button size="small" icon="el-icon-edit" @click="editForm()">{{$t('tableOperationModule.editorBtn')}}</el-button>
        <el-button size="small" icon="el-icon-delete" @click="deleteForm()">{{$t('tableOperationModule.deleteBtn')}}</el-button>
        <iframe :style="defaultStyle" id="reportIframe" frameborder="0" :src="reportIframe"></iframe>
      </div>
    </main-content>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">
        <el-form :rules="rules" ref="dataForm" :model="dataForm" label-width="75px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="F_Code" :label="$t('reportModule.reportManage.labelRCode')">
                <el-input v-model="dataForm.F_Code" :placeholder="$t('reportModule.reportManage.placeholderRCode')" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="F_Name" :label="$t('reportModule.reportManage.labelRName')">
                <el-input v-model="dataForm.F_Name" :placeholder="$t('reportModule.reportManage.placeholderRName')" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="F_Type" :label="$t('reportModule.reportManage.labelRType')">
                <el-select v-model="dataForm.F_Type" :placeholder="$t('reportModule.reportManage.placeholderRType')" size="small" style="width: 100%">
                  <el-option v-for="item in reportType" :key="item.F_ItemId" :label="item.F_ItemName"
                             :value="item.F_ItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="F_SortCode" :label="$t('reportModule.reportRelease.labelSort')">
                <el-input v-model="dataForm.F_SortCode" :placeholder="$t('reportModule.reportRelease.placeholderSort')" size="small" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_File" :label="$t('reportModule.reportRelease.labelRptFileId')">
                <el-select v-model="dataForm.F_File" :placeholder="$t('reportModule.reportRelease.placeholderRptFileId')" size="small" style="width: 100%">
                  <el-option v-for="item in reportFile" :key="item.Id" :label="item.Name"
                             :value="item.Name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('reportModule.reportRelease.tabRemark')">
                <el-input v-model="dataForm.F_Description" type="textarea" :placeholder="$t('reportModule.reportManage.placeholderRemark')" size="small"></el-input>
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
  </div>
</template>

<script>
  import { flowableUrl } from '@/config/env';
  import MainFixed from '../../page/main/MainFixed';
  import MainContent from '../../page/main/MainContent';
  import {
    getReportTree,
    getReportFile,
    getReportType,
    addReport,
    modifyReport,
    deleteReport
  } from '@/api/report/reportmanage';
  export default {
    name: 'ReportManage',
    components: { MainContent, MainFixed },
    data () {
      return {
        fixedTitle: this.$t('reportModule.reportRelease.fixedTitle'),
        contentTitle: '报表数据',
        defaultProps: { children: 'children', label: 'F_Name' },
        dialogVisible: false,
        dialogTitle: '',
        dataForm: { F_Code: '', F_Name: '', F_Type: '', F_SortCode: '', F_File: '', F_Description: '', F_Id: '' },
        rules: {
          F_Code: [{ required: true, message: this.$t('reportModule.reportManage.placeholderRCode'), trigger: 'blur' }],
          F_Name: [{ required: true, message: this.$t('reportModule.reportManage.placeholderRName'), trigger: 'blur' }],
          F_Type: [{ required: true, message: this.$t('reportModule.reportManage.hintRType'), trigger: 'blur' }],
          F_File: [{ required: true, message: this.$t('reportModule.reportRelease.hintRptFileId'), trigger: 'blur' }],
        },
        reportTree: [],
        reportFile: [],
        reportType: [],
        reportIframe: '',
        defaultStyle:'height: 700px;width: 100%;'
      };
    },
    created () {
      this.getReportTree();
      this.getReportFile();
      this.getReportType();
    },
    methods: {
      /* 左侧树 */
      getReportTree () {
        getReportTree().then(res => {
          this.reportTree = res.data.data;

          /* 左侧树形菜单默认选中第一个 */
          this.$nextTick(function () {
            if (res.data.data[0].children.length > 0) {
              this.$refs.cTree.setCurrentKey(res.data.data[0].children[0].F_Id);
              this.reportIframe = flowableUrl + '/ureport/preview?_u=xjrsoft:' + res.data.data[0].children[0].F_File;
            }
          });
        });
      },
      /* 报表文件下拉框 */
      getReportFile () {
        getReportFile().then(res => {
          this.reportFile = res.data.data;
        });
      },
      /* 报表类型下拉框 */
      getReportType () {
        getReportType('ReportSort').then(res => {
          this.reportType = res.data.data;
        });
      },
      /* 选择树形菜单加载信息 */
      handleNodeClick (data) {

        this.dataForm = { ...data };

        this.reportIframe = flowableUrl + '/ureport/preview?_u=xjrsoft:' + data.F_File;

      },
      /* 新增 */
      openForm (formName) {

        this.flag = true;
        this.dataForm = {};
        this.dialogVisible = true;
        this.dialogTitle =this.$t('reportModule.reportRelease.dialogTitle.addTitle');
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      /* 编辑 */
      editForm () {
        this.flag = false;
        this.dialogVisible = true;

        this.dialogTitle =  this.$t('reportModule.reportRelease.dialogTitle.editorTitle');
      },
      /* 删除 */
      deleteForm () {
        this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          if (this.dataForm.F_Id == undefined) return;
          deleteReport(this.dataForm.F_Id).then(() => {
            this.getReportTree();
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
            if (this.flag) {
              addReport(this.dataForm).then(() => {
                this.dialogVisible = false;
                this.getReportTree();
              });
            } else {
              modifyReport(this.dataForm.F_Id, this.dataForm).then(() => {
                this.dialogVisible = false;
                this.getReportTree();
              });
            }
          } else {
            return false;
          }
        });
      },
      /* 取消弹窗 */
      cancelForm () {

        this.dialogVisible = false;
        // this.$refs[formName].resetFields();
      },

    }
  }
</script>
