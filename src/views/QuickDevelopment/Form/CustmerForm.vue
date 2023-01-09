<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">
    <main-fixed :title="$t('custmerForm.fixedTitle')"   :resize="true">
      <div slot="list">
        <el-tree :data="dataItem" :props="defaultProps" node-key="F_ItemDetailId"  ref="dTree" :default-expand-all="true"
                 @node-click="handleNodeClick">
			<span class="custom-tree-node" slot-scope="{ data }">
				<i class="el-icon-document-remove"></i>
				<span>{{ data.F_ItemName}}</span>
			</span>
		</el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle+' - '+(title||'所有分类')" :paddingLeft="205" :padding-top="94">
      <div class="search-box"   slot="search">  
          <el-input
            v-model="keyword"
              size="small"
              clearable
              :style="{ width: '200px' }"
              :placeholder="$t('searchModule.searchPlaceholder')"
            ></el-input>
          <el-button
          class="search-btn"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="search()"
              >{{ $t("searchModule.searchBtn") }}</el-button
            >
      </div>
      <div slot="table">
          <avue-crud ref="tableData" :data="tableData" :option="option" :page.sync="page" 
                     :showColumn="showColumn" :isSaveColumns="true" @on-load="onPageLoad"
                     @sort-change="sortChange" @selection-change="selectionChange" @size-change='sizeChange'
                     @row-click="rowClick" @current-row-change="handleCurrentRowChange" @row-dblclick="handleRowDBLClick">
            <template slot="menuLeft">

              <listDialog :visible.sync="dialogVisible" @search="search"></listDialog>
              <formDesign :key="indexKey" :visible.sync="dialogVisibleFormDesign" :designData="designData" @close="formDesignClose" :controllerType="controllerType"></formDesign>
 
              <el-button type="primary" icon="el-icon-plus" size="small" @click="add" v-if="hasButtonPermission('add')">{{$t('custmerForm.addBtn')}}</el-button>
              <el-button size="small" @click="deleteTableData" v-if="hasButtonPermission('deleteTableData')">{{$t('custmerForm.batchDeletionBtn')}}</el-button>
              <el-button size="small" @click="view" v-if="hasButtonPermission('view')">{{$t('custmerForm.previewFormBtn')}}</el-button>
              <el-button size="small" @click="enable" v-if="hasButtonPermission('enable')">{{$t('custmerForm.enableFormBtn')}}</el-button>
              <el-button size="small" @click="disenable" v-if="hasButtonPermission('disenable')">{{$t('custmerForm.disableFormBtn')}}</el-button>
              <el-button size="small" @click="history" v-if="hasButtonPermission('history')">{{$t('custmerForm.viewHistoryBtn')}}</el-button>
              <el-button size="small" @click="dataItemType" v-if="hasButtonPermission('dataItemType')">{{$t('custmerForm.classifiedManagementBtn')}}</el-button>
			  <el-button size="small" @click="createCode" v-if="hasButtonPermission('createCode')">{{$t('custmerForm.generatedCodeBtn')}}</el-button>
            </template>

            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click.stop="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click.stop="deleteTableData(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>
      </div>
    </main-content>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('custmerForm.previewTitle')" :append-to-body="true" :visible.sync="historyDialogView" width="50%"
               :before-close="historyCloseView" style="padding: 10px 20px;">
      <div class="test-form text_form_box" label-width="60px">
        <FormParser v-if="historyDialogView" :conf="formConf" fromPage="preview"/>
      </div>
    </el-dialog>
    
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('custmerForm.viewHistory.modalTitle')" :append-to-body="true" :visible.sync="historyDialog" 
               :before-close="historyClose" style="padding: 10px 20px;" class="history-dialog">
      <div class="table">
        <avue-crud ref="historyData" :data="historyData" :option="historyOption" :page.sync="page"
                   @row-click="historyRowClick">
          <template slot="menuLeft">
            <el-button type="primary" size="small" @click="hsitoryView">{{$t('custmerForm.previewTitle')}}</el-button>
            <!-- <el-button type="success" size="small" @click="updateHistory">{{$t('custmerForm.viewHistory.updateBtn')}}</el-button> -->
          </template>
        </avue-crud>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('custmerForm.classifiedManagement.modalTitle')" :append-to-body="true" :visible.sync="typeDialog" :before-close="typeClose"
               style="padding: 10px 20px;">
      <div class="table sort_management">
        <avue-crud ref="dataItem" :data="dataItemTable" :option="itmeOption" @row-click="currentItemRow">
          <template slot="menuLeft"> 
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openItemDialog">{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="F_EnabledMark">
            <el-tag type="success" effect="dark" size="small" v-if="scope.row.F_EnabledMark === 1">{{$t('custmerForm.classifiedManagement.tableEffective')}}</el-tag>
            <el-tag type="danger" effect="dark" size="small" v-if="scope.row.F_EnabledMark === 0">{{$t('custmerForm.classifiedManagement.tableInvalid')}}</el-tag>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="opr-primary" size="mini" @click="editItemForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="opr-danger" size="mini" @click="deleteItemForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>

        <el-dialog v-dialogDrag :close-on-click-modal="false" :title="itemDilaogTitle" :append-to-body="true" :visible.sync="itemDialog" width="25%"
                   :before-close="itemClose">
          <div class="form" v-if="itemDialog">
            <el-form ref="dataItemForm" :rules="rules" :model="dataItemForm" label-width="95px">
              <el-form-item :label="$t('custmerForm.classifiedManagement.addModal.Name')" prop="F_ItemName">
                <el-input v-model="dataItemForm.F_ItemName" :placeholder="$t('custmerForm.classifiedManagement.addModal.placeholderName')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('custmerForm.classifiedManagement.addModal.Code')" prop="F_ItemValue">
                <el-input v-model="dataItemForm.F_ItemValue" :placeholder="$t('custmerForm.classifiedManagement.addModal.placeholderCode')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('custmerForm.classifiedManagement.tableSequence')" prop="F_SortCode">
                <el-input v-model="dataItemForm.F_SortCode" :placeholder="$t('custmerForm.classifiedManagement.addModal.placeholderSequence')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('custmerForm.tableRemark')">
                <el-input type="textarea" :placeholder="$t('custmerForm.classifiedManagement.addModal.placeholderRemark')" size="small" :autosize="{ minRows: 4, maxRows: 4}"
                          v-model="dataItemForm.F_Description"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="itemClose">{{$t('buttonModule.modalCancelBtn')}}</el-button>
              <el-button size="mini" type="primary" @click="submitForm('dataItemForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </el-dialog>

    <div v-if="codeVisible">
        <CodeForm class="code-build-box"
         :key="controllerType"
         :baseDataEditor="baseDataEditor"
         :controllerType="controllerType" 
         @finish="handleClose"
        @close="handleClose"
        ></CodeForm>
      </div>
  </div>
</template>

<script>
import MainFixed from '../../../page/main/MainFixed';
import MainContent from '../../../page/main/MainContent';
import { getDataItem, addDataItem, editDataItem, deleteDataItem } from '@/api/system/dataitem';
import {
  getFormSchemeByPage,
  deleteFormScheme,
  setEnable,
  getFormSchemeHistory,
  setDefault,
  addFormScheme,
  updateFormScheme,
  getFormSchemeInfo,
  getFormSchemeSchemeId,
  getFormSchemeInfoFn
} from '@/api/code/form';
import CodeStepOne from '../Code/CodeStepOne.vue';
import CodeStepTwo from '../Code/CodeStepTwo.vue';
import FormParser from '@/components/codeParser/FormParser';
import listDialog from './list-dialog';
import formDesign from './form-design';
import store from '@/store';
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { deepClone } from '@/util/util';
import CodeForm from '../Code/CodeForm.vue';
import {
  beautifierConf
} from '@/utils/index';
import loadBeautifier from '@/utils/loadBeautifier';
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from '@/components/generator/html';
import { makeUpJs } from '@/components/generator/js';
import { makeUpCss } from '@/components/generator/css';
import { getStore } from "@/util/store";
export default {
  name: 'CustmerForm',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainFixed, MainContent, CodeStepOne, CodeStepTwo, FormParser, listDialog, formDesign,CodeForm },
  provide () {
    return {
      newActive: this.active,
      F_Id: this.formId
    };
  },
  data () {
    return {
      contentTitle: '模板数据',
      controllerType: 0,
      indexKey: 0,
      subTitle: '',
      title:'',
      keyword: '',
      page: { pageSize: 20, total: 0, currentPage: 1 },
      order: { order: 'desc', prop: '' },
      tableData: [],
      dataItem: [],
      selectedId: [],
      dialogVisible: false,
      dialogVisibleFormDesign: false,
	  codeVisible:false,
	  baseDataEditor:{
		  F_CodeSchema:'',
		  F_Id:'',
		  F_Catalog:'',
		  F_Name:'',
		  F_Description:''
	  },
      designData: {},
      F_Id: '',
      formId: '',
      F_SchemeId: '',
      active: 0,
      defaultProps: { children: 'children', label: 'F_ItemName' },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('custmerForm.tableNumber'),
        selection: true,
        align: 'center',
        menuAlign: 'center',
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          { label:this.$t('custmerForm.tableName'), prop: 'F_Name', sortable: true ,align: 'left'},
          { sortable: true, label:this.$t('custmerForm.tableSort'), prop: 'F_Category',minWidth:'80',align: 'left' },
          {
            sortable: true, label:this.$t('custmerForm.tableStatus'), prop: 'F_EnabledMark',minWidth:'70',align: 'left',
            formatter: row => {
              return row.F_EnabledMark === 1 ? this.$t('custmerForm.tableEnable') :this.$t('custmerForm.tableDisable');
            }
          },
          { sortable: true, label: this.$t('custmerForm.tableFounder'), prop: 'F_CreateUserName',minWidth:'100',align: 'left' },
          { sortable: true, label: this.$t('custmerForm.tableCreateTime'), prop: 'F_CreateDate',minWidth:"140",align: 'left' },
          { sortable: true, label: this.$t('custmerForm.tableRemark'), prop: 'F_Description',align: 'left' }
        ]
      },
      formRules: {
        F_Name: [{ required: true, message:this.$t('custmerForm.classifiedManagement.Hint.formName'), trigger: 'blur' }],
        F_Category: [{ required: true, message:this.$t('custmerForm.classifiedManagement.Hint.formCategory'), trigger: 'change' }],
      },
      historyDialogView: false,
      historyDialog: false,
      historyData: [],
      F_HistoryId: '',
      historyOption: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        maxHeight: 550,
        border: true,
        page: true,
        index: true,
        indexLabel:this.$t('custmerForm.tableNumber'),
        align: 'center',
        menuAlign: 'center',
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menu: false,
        column: [
          {
            label:this.$t('custmerForm.tableStatus'), prop: 'F_EnabledMark',
            formatter: row => {
              return row.F_EnabledMark === 1 ? this.$t('custmerForm.viewHistory.tableFormal') :this.$t('custmerForm.viewHistory.tableDraft');
            }
          }, {
            label:this.$t('custmerForm.viewHistory.tableVersion'), prop: 'F_Id',
            formatter: row => {
              return row.F_Id == this.F_SchemeId ? this.$t('custmerForm.viewHistory.tableCurrentVersion') : '';
            }
          },
          { label:this.$t('custmerForm.tableFounder') , prop: 'F_CreateUserName' },
          { label: this.$t('custmerForm.tableCreateTime') , prop: 'F_CreateDate' }
        ]
      },
      flag: false,
      typeDialog: false,
      itemDialog: false,
      dataItemTable: [],
      dataItemForm: { F_ParentId: 0, F_ItemId: '', F_EnabledMark: 1 },
      rules: {
        F_ItemName: [{ required: true, message:this.$t('custmerForm.classifiedManagement.Hint.formCategoryName'), trigger: 'blur' }],
        F_ItemValue: [{ required: true, message:this.$t('custmerForm.classifiedManagement.Hint.formCategoryCode'), trigger: 'blur' }],
        F_SortCode: [{ required: true, message:this.$t('custmerForm.classifiedManagement.addModal.placeholderSequence'), trigger: 'blur' }],
      },
      itmeOption: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        maxHeight: 550,
        border: true,
        page: true,
        index: true,
        indexLabel:this.$t('custmerForm.tableNumber'),
        align: 'center',
        menuAlign: 'center',
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          { label: this.$t('custmerForm.classifiedManagement.tableName'), prop: 'F_ItemName' },
          { label: this.$t('custmerForm.classifiedManagement.tableCode'), prop: 'F_ItemValue' },
          { label: this.$t('custmerForm.classifiedManagement.tableSimpleSpelling'), prop: 'F_SimpleSpelling' },
          { label: this.$t('custmerForm.classifiedManagement.tableSequence'), prop: 'F_SortCode' },
          { label: this.$t('custmerForm.classifiedManagement.tableWhetherEffective'), prop: 'F_EnabledMark',
            formatter: (row) => {
              return row.F_EnabledMark == 1 ? this.$t('custmerForm.classifiedManagement.tableEffective') : this.$t('custmerForm.classifiedManagement.tableInvalid');
            }, },
          { label: this.$t('custmerForm.tableRemark'), prop: 'F_Description' },
        ]
      },

      baseData: {
        step1: {
          F_DbId: '',
          list: [],
        },
        step2: []
      },
      formDesignJson: {},
      menuForm: {
        F_Category: '',
      },
      F_Category: [],
      formConf: {}, // 预览表单 JSON 数据
      keyTestForm: +new Date(), // 请求后，更新表单
      itemDilaogTitle:'新增表单分类'
    };
  },
  created () {
    this.getDataItem('FormSort');
  },
  mounted(){
	
  	},
  methods: {
    handleRowDBLClick (row, event) {
		 if(this.hasButtonPermission('modify')&&this.openDoubleClickEdit){
		   this.editForm(row)
		 }
	  },
	handleCurrentRowChange(row){
	  this.$refs.tableData.toggleSelection([row]);
	},
    handleNodeClick (data) {
      this.subTitle = data.F_ItemValue;
      this.title = data.F_ItemName;
      this.keyword = null;
      this.search();
    },
    getDataItem (code) {
      getDataItem(code).then(res => {
        this.dataItem = res.data.data;
        this.dataItemTable = this.dataItem;
        this.F_Category = this.dataItem;
      });
    },
    search () {
      let param = {
        'Category': this.subTitle, 'limit': this.page.currentPage, 'size': this.page.pageSize,
        'keyword': this.keyword, 'order': this.order.order, 'orderfield': this.order.prop
      };
      getFormSchemeByPage(param).then(res => {        
        this.page.total = res.data.data.Total;
        this.tableData = res.data.data.Rows;
      });
    },
    onPageLoad (page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.search();
    },
    sortChange (val) {
      this.order.order = val.order === 'ascending' ? 'asc' : 'desc';
      this.order.prop = val.prop;
      this.search();
    },
    sizeChange (page) {
      this.page.pageSize = page;
      this.search();
    },
    selectionChange (list) {
      this.selectedId = [];
      list.forEach(o => this.selectedId.push(o.F_Id));
    },
    rowClick ({ F_Id, F_SchemeId }) {
      this.F_Id = F_Id;
      store.state.FD.F_Id = F_Id
      this.F_SchemeId = F_SchemeId;
    },
    formDesignClose(){
      this.search();
    },
    add () {
      this.dialogVisible = true;
      store.state.FD.F_Id = ''; // 重置表单id
      store.state.FD.DbLinkId = ''
      //添加兼容样式类
      document.body.className = document.body.className + ' original';

      this.menuForm = { F_Category: '' };

      this.$refs['menuForm']?.resetFields('F_Category');
      this.baseData = {
        step1: {
          F_DbId: '',
          list: [],
        },
        step2: []
      };
      this.F_Id = '';
      this.active = 0;
    },
    handleClose () {
      //删除兼容样式类
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');

      this.codeVisible = false;
      this.active = 0;
    },
    // prev () {
    //   --this.active < 0 && (this.active = 0);
    // },
    // next () {
    //   this.active === 0 ? this.$refs['menuForm'].validate(valid => valid && this.active++)
    //       : this.active === 1 && this.$refs['stepOne'].validateData() && this.active++;
    // },
    async editForm ({ F_Id }) {
      const { data: { data, code } } = await getFormSchemeInfoFn(F_Id);
      // .then(() => {
      if (code) return;
      this.designData = data;
      this.controllerType = data.Scheme.F_Type
      this.$store.commit("SET_F_ID", F_Id);
      this.$store.commit("SET_CONTROLLER_TYPE",  this.controllerType);
      //增加暗色主题兼容类
      document.body.className = document.body.className + ' original';
      this.dialogVisibleFormDesign = true;
      this.indexKey++
      // this.menuForm = data.SchemeInfo;
      // let scheme = JSON.parse(data.Scheme.F_Scheme);
      //
      // this.baseData.step1.F_DbId = scheme.dbLinkId;
      // this.baseData.step1.list = scheme.dbTable;
      // this.baseData.step2 = scheme.data.fields || [];
      // });
      this.active = 0;
    },
    onChildValue (val) {
      if (this.active === 1) {
        this.baseData.step1.F_DbId = val.F_DbId;
        this.baseData.step1.list = val.list;
      } else if (this.active === 2) {
        this.baseData.step2 = val.items;
        this.formDesignJson.data = val.json;
      }
    },
    submitBtn () {
      let res = this.$refs['stepTwo'].validateData();
      if (res) {
        // 保存代码生成器一致格式
        this.baseData.step1.F_DbId && (this.formDesignJson.dbLinkId = this.baseData.step1.F_DbId);
        this.baseData.step1.list && (this.formDesignJson.dbTable = this.baseData.step1.list);

        const json = this.formDesignJson;

        this.menuForm.F_Type = 0;
        this.menuForm.F_UrlAddress = '';
        const baseInfoForm = {
          scheme: { F_Type: 0, F_Scheme: JSON.stringify(json) },
          schemeInfo: this.menuForm
        };
        this.F_Id
            ? updateFormScheme(this.F_Id, baseInfoForm).then(() => {
              this.dialogVisible = false;
              this.search();
              this.F_Id = '';
            })
            : addFormScheme(baseInfoForm).then(() => {
              this.dialogVisible = false;
              this.search();
            });
        this.active = 0;

      }
    },
    deleteTableData ({ F_Id }) {
      F_Id && (this.selectedId = [], this.selectedId.push(F_Id));
      const { selectedId } = this;
      selectedId.length <= 0
          ? this.$notify({ title:this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.selectDeleteData'), type: 'warning' })
          : this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
            confirmButtonText:this.$t('buttonModule.modalSureBtn'),
            cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
            type: 'warning'
          }).then(() => {
            deleteFormScheme(selectedId).then(({ data: { code } }) => {
              if (code) return;
              this.selectedId = [];
              this.search();
              this.$notify({ title: this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
            });
          }).catch(() => {
            
          });
    },
    // 历史记录-预览
    hsitoryView () {
      this.preview(this.F_HistoryId);
    },
    // 预览表单
    view () {
      this.preview(this.F_SchemeId);
    },
    async preview (id) {
      if (id) {
        this.formConf = {};
        try {
           const { data: { data, success } } = await getFormSchemeSchemeId(id);
           if(success&&data){
              const datum = JSON.parse(data.F_Scheme);
              this.formConf = datum.data;
              this.keyTestForm = +new Date();
              this.historyDialogView = true;
           }else{
             this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.dataAcquisitionFailed'), type: 'warning' });
           }
        } catch (error) {
          this.$notify({ title: this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.dataAcquisitionFailed'), type: 'warning' });
        }
      } else this.$notify({ title: this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.operationHint'), type: 'warning' });
    },
    enable () {
      this.F_Id
          ? setEnable(this.F_Id, 1).then(res => {
            if (!res.data.code) {
              this.search();
              this.F_Id = '';
              this.$notify({ title: this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.enableSuccessful'), type: 'success' });
            } else this.$notify({ title: this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.enableFailure'), type: 'warning' });
          })
          : this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.operationHint'), type: 'warning' });
    },
    disenable () {
      this.F_Id
          ? setEnable(this.F_Id, 0).then(res => {
            if (!res.data.code) {
              this.search();
              this.F_Id = '';
              this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.disableSuccessful'), type: 'success' });
            } else this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.disableFailure'), type: 'warning' });
          })
          : this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.operationHint'), type: 'warning' });
    },
    history () {
      if (this.F_Id) {
        this.historyDialog = true;
        this.getHistoryData();
      } else this.$notify({ title:this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.operationHint'), type: 'warning' });
    },
	async createCode(row){
		if (this.F_Id) {
		  const { data: { data, code } } = await getFormSchemeInfoFn(this.F_Id);
		  if (code) return;
		  this.controllerType = 3;
      this.$store.commit("SET_CONTROLLER_TYPE",  this.controllerType);
      //自定义表单生成代码时，需要模板类型
      this.$store.commit("SET_CUSTOM_CONTROLLER_TYPE",  data.Scheme.F_Type);
       
		  
		  let F_Scheme=JSON.parse(data.Scheme.F_Scheme);
		  F_Scheme.baseInfo={};
		  F_Scheme.colData={};
		  F_Scheme.formData=F_Scheme.data.fields;
		  F_Scheme.queryData=[];
		  F_Scheme.totalData=[];
		  F_Scheme.moduleData={};
		  F_Scheme.codeContent={};
		  let type = 'file';
		  loadBeautifier((btf) => {
			const script = vueScript(makeUpJs(F_Scheme.data, type));
			const html = vueTemplate(makeUpHtml(F_Scheme.data, type));
			const css = cssStyle(makeUpCss(F_Scheme.data));
			F_Scheme.step2Html=btf.html(html + script + css, beautifierConf.html);
			this.baseDataEditor.F_CodeSchema=JSON.stringify(F_Scheme);
			this.baseDataEditor.F_Id='';
			this.codeVisible=true;
		  });
		  
		
		} else this.$notify({ title:this.$t('deletePrompt.promptTitle'), message:this.$t('companyManager.modalSelectContentPrompt'), type: 'warning' });
	},

    getHistoryData () {
      getFormSchemeHistory(this.F_Id).then(res => {
        this.historyData = res.data.data;
      });
    },
    historyClose () {
      this.historyDialog = false;
    },
    historyCloseView () {
      this.historyDialogView = false;
    },
    historyRowClick (row) {
      this.F_HistoryId = row.F_Id;
    },
    updateHistory () {
      this.F_HistoryId
          ? setDefault(this.F_Id, this.F_HistoryId).then(res => {
            if (res.data.code) {
              //刷新历史表格没用，要刷新父页面表格
              //this.getHistoryData();
              this.historyDialog = false;
              this.search();
              this.F_HistoryId = '';
              this.$notify({ title:this.$t('deletePrompt.promptTitle'), message:this.$t('deletePrompt.updateSuccessful'), type: 'success' });
            } else this.$notify({ title: this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.updateFailure'), type: 'warning' });
          })
          : this.$notify({ title: this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.operationHint'), type: 'warning' });
    },

    dataItemType () {
      this.typeDialog = true;
    },
    typeClose () {
      this.typeDialog = false;
    },
    openItemDialog () {
      this.itemDialog = true;
      this.itemDilaogTitle = this.$t('custmerForm.classifiedManagement.addModal.titleAddForm');
      this.dataItemForm = {};
      this.flag = true;
      this.dataItemForm.F_ParentId = 0;
      this.dataItemForm.F_ItemCode="FormSort";
      if(this.dataItem&&this.dataItem.length>0&&this.dataItem[0].F_ItemId){
        this.dataItemForm.F_ItemId = this.dataItem[0].F_ItemId;
      }
      this.dataItemForm.F_EnabledMark = 1;
    },
    itemClose () {
      this.itemDialog = false;
    },
    editItemForm (row) {
      this.itemDialog = true;
      this.itemDilaogTitle = this.$t('custmerForm.classifiedManagement.addModal.titleEditForm');
      this.flag = false;
      this.dataItemForm = deepClone(row);
    },
    deleteItemForm (row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText: this.$t('buttonModule.modalCancelBtn'), type: 'warning'
      }).then(() => {
        deleteDataItem(row.F_ItemDetailId).then(() => {
          this.getDataItem('FormSort');
          this.$notify({ title: this.$t('deletePrompt.successTitle'), message: this.$t('deletePrompt.successDeleted'), type: 'success' });
        });
      }).catch(() => {
        this.$notify({ title: this.$t('deletePrompt.failureTitle'), message: this.$t('deletePrompt.failedDeleted'), type: 'warning' });
      });
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        valid
            ? this.flag
            ? addDataItem(this.dataItemForm).then(() => {
              this.itemDialog = false;
              this.getDataItem('FormSort');
            })
            : editDataItem(this.dataItemForm.F_ItemDetailId, this.dataItemForm).then(() => {
              this.itemDialog = false;
              this.getDataItem('FormSort');
            })
            : false;

      });
    },
    currentItemRow(){

    },
  },
}
</script>

<style scoped>
.main-container {
  height: 100%;
}
div /deep/ .avue-crud__menu {
   min-height: 40px;
}
.formBox {
  height: calc(100% - 114px);
}

@media screen and (max-width: 1370px) {
   .sort_management {
   	height: 400px;
   	margin-bottom: 10px;
	overflow: scroll;
   }
}
.sort_management div /deep/ .avue-crud__pagination{
	 display: none!important;
  }
.el-form /deep/ .el-form-item{
  min-height: 40px;
}
.form > .el-form > .el-form-item{
	margin-bottom: 12px!important;
}
.text_form_box{
	height: 600px;
	padding-bottom: 20px;
	overflow-y: auto;
	overflow-x: hidden;
}
@media screen and (max-width: 1370px) {
	.text_form_box{
		height: 400px;
	}
}
div /deep/ .el-tag{
	margin: 0px 0px 5px 5px;
}

div /deep/ .el-dialog__body .avue-crud .avue-crud__pagination{
	position: relative;
	margin-top: 15px;
	padding: 10px 0px 0px 0px;
}
.history-dialog /deep/ .el-dialog{
	min-width: 720px;
}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}
div /deep/ .avue-crud .avue-crud__tip{
		display: none;
	}
div /deep/ .avue-crud__left{
	height: auto;
	display: block;
	margin-left:5px!important;
}	
.history-dialog /deep/ .el-dialog__body .avue-crud__left{
	float: left;
}
.history-dialog /deep/ .el-dialog__body .avue-crud__right{
	float: right;
}
.sort_management /deep/.avue-crud__left{
	float: left;
}
.sort_management /deep/.avue-crud__right{
	float: right;
}
.code-build-box{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2001;
  background-color: #fff;
}
.search-box{
  display: flex;
}
.search-btn{
  margin-left:4px;
}
</style>
