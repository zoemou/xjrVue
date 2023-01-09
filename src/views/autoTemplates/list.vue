<template>
  <div
    class="main-container"
    :class="wrap?'main-wrap-container':'main-no-wrap-container'" id="search-mixin-id"
    v-if="showList"
    v-loading="loading"
    :element-loading-text="$t('deletePrompt.hardLoading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <main-content :title="contentTitle">
      <div slot="search"  v-if="showSearchBox">
        <SearchBox 
        :searchParamsList="searchParamsList" 
        :searchParam.sync="searchParam" 
        @searchBoxParams="searchBoxParams" 
        @searchReset="searchReset"
        ></SearchBox>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <avue-crud
          ref="autoTemplatesTable"
          :data="listData"
          @selection-change="selectionChange"
		  @current-row-change="handleCurrentRowChange"
          id="printTable"
          :option="option"
          stripe
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot-scope="scope" slot="menu">
          <!-- 发起审批 以及 发起临时流程 根据审批状态显示 scope.row.flowStatus 0 没有关联任何流程模板  1 未发起 2 审批中 3 审批完成-->
          <template v-if="scope.row.flowStatus&&scope.row.flowStatus==2">
            <span v-if="hasBtns(createFormFlowBtnName) && hasButtonPermission(createFormFlowBtnName)" class="form-span-button">{{$t('workFlow.Process.labelApproval')}}</span>
            <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-view"
                v-if="hasBtns(viewBtnName) && hasButtonPermission(viewBtnName)"
                @click.stop="viewForm(scope.row)"
                >{{$t('forme.editModal.viewBtn')}}</el-button
              >
          </template>
          <template v-else-if="scope.row.flowStatus&&scope.row.flowStatus==3">
            <span v-if="hasBtns(createFormFlowBtnName) && hasButtonPermission(createFormFlowBtnName)" class="form-span-button">{{$t('forme.editModal.approvalComplete')}}</span>
            <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-view"
                v-if="hasBtns(viewBtnName) && hasButtonPermission(viewBtnName)"
                @click.stop="viewForm(scope.row)"
                >{{$t('forme.editModal.viewBtn')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-edit"
                v-if="hasBtns(modifyBtnName) && hasButtonPermission(modifyBtnName)"
                @click.stop="editForm(scope.row)"
                >{{$t('forme.editModal.editBtn')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-delete"
                v-if="hasBtns(deleteBtnName) && hasButtonPermission(deleteBtnName)"
                @click.stop="deleteForm(scope.row)"
                >{{$t('forme.editModal.deleteBtn')}}</el-button
              >
          </template>
          <template v-else>
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-guide"
                v-if="scope.row.flowStatus&&scope.row.flowStatus==1&&hasBtns(createFormFlowBtnName) && hasButtonPermission(createFormFlowBtnName)"
                @click.stop="CreateFormFlow(scope.row)"
                >{{$t('forme.editModal.initiateApproval')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-guide"
                v-if="hasBtns(createDesignFlowBtnName) && hasButtonPermission(createDesignFlowBtnName)"
                @click.stop="CreateDesignFlow(scope.row)"
                >{{$t('code.codeStepFour.createFlowBtn')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-view"
                v-if="hasBtns(viewBtnName) && hasButtonPermission(viewBtnName)"
                @click.stop="viewForm(scope.row)"
                >{{$t('forme.editModal.viewBtn')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-edit"
                v-if="hasBtns(modifyBtnName) && hasButtonPermission(modifyBtnName)"
                @click.stop="editForm(scope.row)"
                >{{$t('forme.editModal.editBtn')}}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-delete"
                v-if="hasBtns(deleteBtnName) && hasButtonPermission(deleteBtnName)"
                @click.stop="deleteForm(scope.row)"
                >{{$t('forme.editModal.deleteBtn')}}</el-button
              >
            </template>
          </template>
          <template slot="menuLeft">
            <el-button
              type="primary"
              v-if="hasBtns(addBtnName) && hasButtonPermission(addBtnName)"
              icon="el-icon-plus"
              size="small"
              @click="openForm()"
              >{{$t('forme.editModal.addBtn')}}
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="small"
              v-if="
                hasBtns(batchDeleteBtnName) && hasButtonPermission(batchDeleteBtnName)
              "
              @click="batchDelete()"
              >{{$t('forme.editModal.batchDeletionBtn')}}</el-button
            >
            <el-button
              type="primary"
              v-if="hasBtns(importBtnName) && hasButtonPermission(importBtnName)"
              icon="fa fa-sign-in"
              size="small"
              @click="excelDialog = true"
              >{{$t('forme.editModal.quickImportBtn')}}</el-button
            >
            <el-button
              type="primary"
              v-if="hasBtns(exportBtnName) && hasButtonPermission(exportBtnName)"
              icon="fa fa-sign-out"
              size="small"
              @click="tableExport()"
              >{{$t('forme.editModal.quickExportBtn')}}</el-button
            >
          </template>
        </avue-crud>
        <el-dialog v-dialogDrag
          :close-on-click-modal="false"
          :title="$t('workFlow.zh.forms')"
          :append-to-body="true"
          :fullscreen="fullscreen"
          :width="width"
          :visible.sync="flag"
          :before-close="dialogChange"
        >
          <autoForm
            v-if="flag"
            :isEdit="isEdit"
            :disabled="disabled"
            :hasSubmitButton="hasSubmitButton"
            @onChange="dialogChange"
            :F_FormId="F_FormId"
            :F_FormName="F_FormName"
            :processInfo="processInfo"
            :formChildrenData="formChildrenData"
            :eventData="eventData"
            :keyValue="keyValue"
          ></autoForm>
        </el-dialog>

        <el-dialog v-dialogDrag
          :close-on-click-modal="false"
          :title="$t('forme.editModal.quickImportBtn')"
          width="800px"
          :append-to-body="true"
          :visible.sync="excelDialog"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="uploadData"
            :on-success="successUpload"
            :show-file-list="true"
            drag
            :headers="headers"
            accept=".xlsx,.xls"
            :action="importUrl"
          >
             <img src="./../../../public/img/fast_import.png">
        <div class="el-upload__text">{{$t('orgImport.dragFile')}}<em>{{$t('orgImport.uploadLink')}}</em></div>
        <div class="el-upload__tip" slot="tip">
          {{$t('orgImport.Hint')}}
        </div>
          </el-upload>
          <el-row type="flex">
        
           <el-col style="text-align:center;">
            <el-button size="medium" class="download-btn" @click="download" >{{$t('orgImport.downloadBtn')}}</el-button>
           </el-col>
         </el-row>
        </el-dialog>
      </div>
    </main-content>
    <!-- 发起流程 -->
    <createFlow
      v-if="isCreateFlow"
      :row="scopeRow"
      :createFlowType="createFlowType"
      formType="0"
      :scheme="scheme"
      @closedCreateFlow="closedCreateFlow"
    ></createFlow>
  </div>
</template>
<!-- 菜单管理配置，URL配置不能一样。 -->
<script>
import authorizeMixin from "@/mixins/authorize";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import tableSearchMixin from "@/mixins/tableSearch"; //table 搜索
import schemeMixins from "@/components/formInitiationProcess/schemeMixins";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import MainContent from "@/page/main/MainContent";
import request from "@/router/axios";
import { baseUrl } from "@/config/env";
import { getOrder } from "@/util/util";
import autoForm from "./form";
import store from "@/store";
import { getFormSchemeInfo } from "@/api/dataauthorize/dataauthorize";
import createFlow from "@/components/formInitiationProcess/createFlow";
import {
  getDataItemDetail,
  getDataBySQL,
  getDbLinkSql
} from "@/api/databasemanage/datasource.js";

import { getToken } from "@/util/auth";

export default {
  name: "list",
  inject: ["reload"],
  mixins: [authorizeMixin, tableOptionMixin, schemeMixins,tableSearchMixin,displayColumnsMixin],
  components: { MainContent, autoForm, createFlow },
  data() {
    return {
      formEncode:"",
      searchBtns:[],
      computedHeight: 0,
      uploadData: { F_ModuleId: "" },
      headers: {},
      importUrl: "",
      excelDialog: false,
      indexSearchBar: 0,
      isRouterAlive: true,
      loading: false,
      processInfo: {},
      formChildrenData: {},
      moduleId: store.state.FD.moduleId,
      F_Id: "",
      F_FormId: "", // form id
      F_FormName:"",
      formIndex: 0,
      contentTitle: "列表",
      page: {
        pageSize: 0,
        total: 0,
        currentPage: 1,
        layout: "total, prev, pager, next"
      },
      ids: "",
      listData: [],
      keyValue: "",
      flag: false,
      flagLimit: false,
      isEdit: 1, // 用状态值区分当前表单状态，code:  1：新增 2: 查看 3: 编辑
      hasSubmitButton: false, // 查看-不显示按钮
      disabled: false, // 查看-禁用input
      defaultProps: {
        children: "children",
        label: ""
      },
      option: {
        rowKey: "F_Title",
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        importBtn: false, //导入
        exportBtn: false, //导出
        menu:false,
        menuWidth: 360,
        border: true,
        page: true,
        selection: true,
        tip:false,
        index: true,
        indexLabel: this.$t('workFlow.WFMonitor.tabNum'),
        align: "center",
        menuAlign: "left",
        delBtn: false,
        editBtn: false,
        column: [
        ]
      },
      styleInput: "width:200px;margin-right:20px",
      dataList: {},
      showList: true, //路由不同，共用组件刷新
      btns: [],
      fullscreen:true,
      width:null,
      defaultOrderfield:'',
      defaultOrder:'asc',
      eventData:[],
      addBtnName:'add',
      viewBtnName:'view',
      modifyBtnName:'modify',
      deleteBtnName:'delete',
      batchDeleteBtnName:'batchDelete',
      importBtnName:'import',
      exportBtnName:'export',
      createFormFlowBtnName:'createFormFlow',
      createDesignFlowBtnName: 'createDesignFlow',
      columnIndex:1
    };
  },
  created() {
	this.moduleId = this.$route.meta.moduleid;
	this.importUrl = baseUrl + "/excel-import/import";
	this.uploadData.F_ModuleId = this.moduleId;
	this.headers["Authorization"] = "Bearer " + getToken();
  },
  watch: {
    "$route.meta.moduleid": {
      // 监听路由变化
      handler: function (val) {
        this.showList = false;
        this.flagLimit = false;
        this.$nextTick(() => {
          this.moduleId = this.$route.meta.moduleid;
          this.showSearchBox = false;
          this.page.pageSize=0;
          this.page.total= 0;
          this.page.currentPage=1;
          this.defaultOrderfield = null;
          this.defaultOrder = null;
          this.changePermission(this.moduleId, this.$store.getters.permission);
          this.importUrl = baseUrl + "/excel-import/import";
          this.uploadData.F_ModuleId = this.moduleId;
          this.headers["Authorization"] = "Bearer " + getToken();
          this.showList = true;
          this.getShowColumns()
        });
      },
      deep: true
    }
  },
  methods: {
    async handleAvueTable(modulesId) {
		await this.getFormJSON(modulesId);
	},
    handleRowDBLClick (row, event) {
      if(this.hasBtns(this.modifyBtnName)&&this.hasButtonPermission(this.modifyBtnName)&&this.openDoubleClickEdit){
        this.editForm(row)
      }
	  },
	handleCurrentRowChange(row){
	  this.$refs.autoTemplatesTable.toggleSelection([row]);
	},
    // 新增弹窗 JSON
    async getFormScheme(isSearch=true) {
      const {
        data: { data, code }
      } = await getFormSchemeInfo(this.F_FormId);
      if (code) return;
      this.processInfo = JSON.parse(data.Scheme.F_Scheme).data;
      
      // 自定义表单
      this.SchemeInfo = data.SchemeInfo;
      let F_SchemeStr = data.Scheme.F_Scheme;
      this.F_FormName = this.SchemeInfo.F_Name;
      let dataFilds = F_SchemeStr ? JSON.parse(F_SchemeStr) : null;
      if (isSearch&&dataFilds && dataFilds.data && dataFilds.data.fields) {
        await this.getCustomSearchList(this.dataList.queryData,dataFilds.data.fields);
      }
      //表单事件
      if (dataFilds && dataFilds.eventData) {
        this.eventData =  dataFilds.eventData;
      }
      if(dataFilds && dataFilds.data && dataFilds.data.formSize){
        // fullscreen 全屏 medium 大  small 中 mini 小
        if(dataFilds.data.formSize==='fullscreen'){
          this.fullscreen = true;
          this.width = '100%';
        }else if(dataFilds.data.formSize==='medium'){
          this.fullscreen = false;
          this.width = '65%';
        }if(dataFilds.data.formSize==='small'){
          this.fullscreen = false;
          this.width = '50%';
        }if(dataFilds.data.formSize==='mini'){
          this.fullscreen = false;
          this.width = '35%';
        }
      }
      this.flagLimit && (this.flag = true);
    },
    //是否有按钮
    hasBtns(encode) {
      return this.btns.includes(encode);
    },
    // 获取form JSON
    async getFormJSON(modulesId) {
      
      let res = await request({
        url: `${baseUrl}/form-relation/${modulesId}`,
        method: "get",
      });
        const { data, code } = res.data;
        if (code) return;
        this.option.column = [];

        this.formEncode = data.F_EnCode+':';
        this.dataList = JSON.parse(data.F_SettingJson);
        if (
          this.dataList &&
          this.dataList.colData.btns &&
          this.dataList.colData.btns.length > 0
        ) {
          this.dataList.colData.btns.forEach(ele => {
            if (ele.checked) {
              this.btns.push(this.formEncode+ele.val);
            }
          });
          this.addBtnName = this.formEncode+'add';
          this.viewBtnName = this.formEncode+'view';
          this.modifyBtnName = this.formEncode+'modify';
          this.deleteBtnName = this.formEncode+'delete';
          this.batchDeleteBtnName = this.formEncode+'batchDelete';
          this.importBtnName = this.formEncode+'import';
          this.exportBtnName = this.formEncode+'export';
          this.createFormFlowBtnName = this.formEncode+'createFormFlow';
           this.createDesignFlowBtnName = this.formEncode+'createDesignFlow';
          //是否有编辑 查看 删除 发起流程 发起临时流程权限 无则为操作列不显示
          let oprBtns = [this.modifyBtnName,this.viewBtnName,this.deleteBtnName,this.createFormFlowBtnName,this.createDesignFlowBtnName];
          let intersection = this.btns.filter((v) => oprBtns.includes(v)); 
          if(intersection.length>0){
            this.option.menu =  true
          }else{
            this.option.menu = false
          }
        //  搜索栏 按钮
         if(this.btns.length>0){
           let tempBtns =  this.btns.concat(oprBtns).filter((v) => this.btns.includes(v) && !oprBtns.includes(v));
           if(tempBtns.length>0){
              this.searchBtns  = [...new Set([...tempBtns])];
           }
         }
        }
        //排序
        if(this.dataList.colData.sort){
          if (this.dataList.colData.sort.useDefaultSort) {
            this.defaultOrderfield = null;
            this.defaultOrder = null;
          } else {            
            if (this.dataList.colData.sort.sortField) {
            this.defaultOrderfield = this.dataList.colData.sort.sortField;
            }
            if(this.dataList.colData.sort.order){
            this.defaultOrder = this.dataList.colData.sort.order;
            }
          }
        }
        let ExpData = this.dataList.colData.ExpData;
        if (JSON.stringify(ExpData) != "{}") {
          this.option.exportBtn = true;
        }
        let impData = this.dataList.colData.impData;
        if (JSON.stringify(impData) != "{}") {
          this.option.importBtn = true;
        }
        //分页设置
        let pageParams = this.dataList.colData.form;
        if (pageParams.isPage == "1") {
          //是否分页
          this.option.page = true;
          this.page.pageSize = pageParams.pageSize;
          this.searchParam.size =pageParams.pageSize;
        } else {
          this.option.page = false;
        }
        // this.searchParam = {};
        // this.dataList.queryData.map((item) => {
        //   // 类型框判断
        //   if (!item.DateField) {
        //     this.searchParam[item.field] = '';
        //   }
        // });
        this.F_FormId = data.F_FormId;
        this.F_Id = data.F_Id; // 表单id
        this.styleInput = `width:${this.dataList.F_Width ||
          200}px;margin-right:${this.dataList.F_Top || 20}px`;
        this.dataList.colData.fields.map(v => {
			if (this.modulePermissionList.column&&this.modulePermissionList.column.length > 0) {
        if (this.columnEnCodeList.includes(v.bindColumn)) {
				this.option.column.push({
				  width: v.width,
				  align: v.align,
				  label: v.lgmark === "" ||v.lgmark === undefined || v.lgmark === null ? (v.label?v.label:((v.componentsParams&&v.componentsParams.__config__&&v.componentsParams.__config__.label)?v.componentsParams.__config__.label:v.fieldName)) : this.$t(v.lgmark),
				  prop: v.bindColumn,
				  sortable:true,
							formatter:(row,value,label,column)=>{
								if(v.componentsParams.__config__.avueType=='switch'){
									return label=value==v.componentsParams['active-value']?`
									<div aria-checked="true" aria-disabled="true" class="el-switch is-disabled is-checked" size="">
										<input type="checkbox" name="" true-value="${v.componentsParams['active-value']}" false-value="${v.componentsParams['inactive-value']}" disabled="disabled" class="el-switch__input">
										<span class="el-switch__core" style="width: 40px; border-color: rgb(19, 206, 102); background-color: rgb(19, 206, 102);"></span>
									</div>`:
									`<div aria-disabled="true" class="el-switch is-disabled">
										<input type="checkbox" name="" true-value="${v.componentsParams['active-value']}" false-value="${v.componentsParams['inactive-value']}" disabled class="el-switch__input">
										<span class="el-switch__core" style="width: 40px; border-color: rgb(162, 158, 158); background-color: rgb(162, 158, 158);"></span>
									</div>`
								}else{
									return label=value
								}
							},
							overHidden:true
				});  
			  }
			}
          
        });
        // this.loading = false;
        this.getFormScheme();
        if(!this.searchParam.order){
          this.searchParam.orderfield = this.defaultOrderfield;
          this.searchParam.order = this.defaultOrder;
          this.getList(modulesId);
      }
    },
    searchBoxParams(params){
      this.page.currentPage=1;
      this.searchParam.limit = 1;
      this.searchParam = params;
      this.getList(this.moduleId);
    },
    /* 获取数据 */
    getList(moduleId) {
      let params = {
        ...this.changeSearchParams(),
        orderfield: this.defaultOrderfield?this.defaultOrderfield:"",
        order: this.defaultOrder?this.defaultOrder:'asc'
      };
      this.listData = [];
      if(this.option.page==false){
        if(params.limit) delete params.limit;
        if(params.size) delete params.size;
      }
      request({
        url: `${baseUrl}/form-scheme/${moduleId}/instance-form-list`,
        method: "get",
        params: params
      }).then(res => {
        const { data, code } = res.data;
        if (code) return;
        if (this.option.page) {
          if (data.Rows.length > 0) {
            this.listData = data.Rows;
            this.page.total = data.Total;
          }
        } else {
          this.listData = data;
        }
      });
    },
    getListData(moduleId){
      let modulesId = moduleId ? moduleId : this.$route.meta.moduleid;
      this.getList(modulesId);
    },
    /* 页面加载 */
    onPageLoad(page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
      this.getList(this.moduleId);
    },
    /* 查询 */
    searchClick() {
      this.searchParam.limit = 1;
      this.searchParam.order = null;
      this.searchParam.orderfield = null;
      this.getList(this.moduleId);
    },
    /* 查询表单重置 */
    searchReset() {
      for (const key in this.searchParam) {
        if(this.searchParam[key]){
          this.searchParam[key] = null;
        }
      }
       //分页设置
      let pageParams = this.dataList.colData.form;
      if (pageParams.isPage == "1") {
        //是否分页
        this.option.page = true;
        this.page.pageSize = pageParams.pageSize;
        this.searchParam.size =  this.page.pageSize ;
        this.searchParam.limit = 1;
      } else {
        this.option.page = false;
      }
      this.getList(this.moduleId);
    },
    /*查看*/
    viewForm(val) {
      this.keyValue = val.F_Id;
      this.defaultValueJSON();
      this.isEdit = 2;
      this.hasSubmitButton = false;
      this.disabled = true;
    },
    /* 编辑 */
    editForm(val) {
      this.keyValue = val.F_Id;
      this.defaultValueJSON();
      this.isEdit = 3;
      this.hasSubmitButton = true;
      this.disabled = false;
    },
    /* 打开表单 */
    openForm() {
      this.formChildrenData = {};
      this.getFormScheme(false);
      this.flagLimit = true;
      this.keyValue = null;
      this.isEdit = 1;
      this.hasSubmitButton = true;
    },
     /* 发起审批 */
    CreateFormFlow(val){
      this.createFlowType = 1;
      let row = {F_FormId:this.F_FormId,...val};
      this.scopeRow = row;
       this.isCreateFlow = true;
    },
    /* 发起临时流程 old */
    CreateFlow(val){
      this.CreateDesignFlow(val);
    },
     /* 发起临时流程 */
    CreateDesignFlow(val){
      this.createFlowType = 0;
      this.scopeRow = val;
      this.changeSchemeInfo(
        this.SchemeInfo,
        this.processInfo.fields ? this.processInfo.fields : [],
        this.processInfo.hideComponents ? this.processInfo.hideComponents : []
      );
    },
    /* 删除 */
    deleteForm(val) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      }).then(() => {
        request({
          url: `${baseUrl}/form-scheme/${this.F_FormId}/instance-form-list/${val.F_Id}`,
          method: "delete"
        }).then(res => {
          if (res.data.code) return;
          this.getList(this.moduleId);
          this.$notify({
            title: this.$t('deletePrompt.successTitle'),
            message:this.$t('deletePrompt.successDeleted'),
            type: "success"
          });
        });
      });
    },
    /* 分页 */
    sortChange(data) {
      if(data.order){
        let order= getOrder(data.order);
        this.searchParam.order = order;
        this.searchParam.orderfield = data.prop;
      }else{
          this.searchParam.order = this.defaultOrder;
          this.searchParam.orderfield = this.defaultOrderfield;
      }
      this.getList(this.moduleId);
    },
    /* 弹窗回调 */
    dialogChange(b) {
      this.flag = false;
      this.keyValue = "";
      this.isEdit = true;
      this.getList(this.moduleId);
    },
    async defaultValueJSON() {
      if (this.keyValue) {
       let { data: { code, data } }=await request({
          url: `${baseUrl}/form-scheme/${this.F_FormId}/instance-form-list/${this.keyValue}`,
          method: "get"
        })
		
          if (code) return;
          this.formChildrenData = data;
          for (const codeKey in data) {
            if (data[codeKey] instanceof Object) {
              // 主表
              for (const key in data[codeKey]) {
				  for(let i=0;i<this.processInfo.fields.length;i++){
					  let item=this.processInfo.fields[i]
					  if (item.__config__.bindTableField === key) {
					    item.__config__.defaultValue = data[codeKey][key];
							item.__config__.showValue=[]
							if(item.__config__.tag=="el-mutiple-input"){
								await this.getMutipleData(item.__config__);
							}
					  }else if(item.__config__.componentName=="avue-tabs"){
						  for(let tab in item.__config__.childrenObj){
							  for(let j=0;j<item.__config__.childrenObj[tab].length;j++){
								  let chil=item.__config__.childrenObj[tab][j]
								  if (chil.__config__.bindTableField === key) {
									chil.__config__.defaultValue = data[codeKey][key];
										chil.__config__.showValue=[]
										if(chil.__config__.tag=="el-mutiple-input"){
											await this.getMutipleData(chil.__config__);
										}
								  }
							  }
						  }
					  }
				  }

              }
            }
          }

          // 子表单
          // this.allotassets.allotassets.forEach(element => {
          // });

         //setTimeout(()=>{
			 this.flag = true;
		 //},1000) 
        //});
      }
    },
	async getMutipleData(config){
		let showField = "F_ItemName";
		let saveField = "F_ItemValue";
		if (config && config.dataType) {
		  let optionList = [];
		  try {
		    if (config.dataType == "dataItem") {
		      let dataItem = config.dataItem;
		      let res = await getDataItemDetail(dataItem);
		      if (res.data.success) {
		        if (res.data.data.length > 0) {
		          optionList = res.data.data;
		        }
		      }
		    }
		    //数据源
		    else if (config.dataType == "dataSource") {
		      let dataSource = config.dataSource;
		      showField = config.showField;
		      saveField = config.saveField;
		      let res = await getDataBySQL(dataSource);
		      if (res.data.success) {
		        if (res.data.data.length > 0) {
		          optionList = res.data.data;
		        }
		      }
		    }
		    //sql
		    else if (config.dataType == "dataSql") {
		      let database = config.database;
		      showField = config.showField;
		      saveField = config.saveField;
		      let res = await getDbLinkSql(database, `${config.sql}`);
		      if (res.data.success) {
		        if (res.data.data.length > 0) {
		          optionList = res.data.data;
		        }
		      }
		    }
			config.defaultValue=config.defaultValue.split(',');
			config.defaultValue.forEach(it=>{
				let obj=optionList.find(o=>{return o[saveField]==it})
				if(obj) config.showValue.push(obj[showField])	
			})
			config.showValue=config.showValue.join(",")
					
		  }catch(error){}
		}
	},
    selectionChange(list) {
      this.ids = list.map(x => x.F_Id).join(",");
    },
    batchDelete() {
      if (!this.ids || this.ids.split(",").length === 0) {
        this.$message.error(this.$t('deletePrompt.noSelected'));
        return;
      }
      this.$confirm(this.$t('deletePrompt.hintBatchDelete'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      }).then(() => {
        request({
          url: `${baseUrl}/form-scheme/${this.F_FormId}/instance-form-list/${this.ids}`,
          method: "delete"
        }).then(res => {
          this.getList(this.moduleId);
          this.$notify({
            title:this.$t('deletePrompt.successTitle'),
            message:this.$t('deletePrompt.successDeleted'),
            type: "success"
          });
        });
      });
    },
    download() {
      request({
        url: baseUrl + "/excel-import/download/" + this.$route.meta.moduleid,
        method: "get",
        responseType: "blob"
      }).then(res => {
        const ct = res.data;
        // let fileName = decodeURI(res.headers["content-disposition"].split("=")[1]);
        let url = window.URL.createObjectURL(
          new Blob([ct], {
            type: "application/octet-stream;charset=utf-8"
          })
        );

        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "导入模板.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //  let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      });

      //  window.open(baseUrl + '/excel-import/download/' + this.$route.meta.moduleid, '_blank')
    },
    upload() {
      this.$refs["upload"].submit();
    },
    successUpload(res) {
      if (res.code === 0) this.$message.success(this.$t('deletePrompt.importComplete'));
      else this.$message.error(res.msg);
    },
    /* 导出 */
    tableExport() {
      this.$refs["autoTemplatesTable"].rowExcel();
      return;
    },
  }
};
</script>
<style scoped>
div >>> .main-search-box{
  padding: 0 !important;
}
.main-container{
	height: 100%!important;
	padding: 0 8px!important;
}
.upload-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
div /deep/ .el-upload-dragger{
	width: 615px;
	height: 370px;
	border:none;
}
div /deep/ .el-upload__text{
	position: absolute;
	bottom: 32px;
	right: 100px;
	font-weight: bold;
	color: #1d2027;
}
div /deep/ .el-upload__tip{
	top: 295px;
	right: 165px;
	position: absolute;
	color: #829ad2;
}
.download-btn{
	padding:14px 42px;
	margin: 10px auto 0px auto;
	color: #1d2027;
}
</style>
