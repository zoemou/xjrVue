<template>
  <div class="main-container" v-if="isLoaded">
    <MainFixed :title="fixedTitle">
      <div slot="list">
        <elTree
          :data="elTree.data"
          :props="elTree.props"
          :node-key="elTree.nodeKey"
          ref="leftListTree"
          :default-expand-all="false"
          @node-click="NodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ data }">
		  <i class="fa fa-calendar-check-o"></i>
		  <span>{{ data.label}}</span>
		 </span>
        </elTree>
      </div>
    </MainFixed>

    <main-content
      :title="contentTitle"
      :paddingLeft="205"
      v-if="CurrentModule != 'LaunchTask'"
    >
      <div slot="search"  v-if="showSearchBox">
        <SearchBox 
        :searchParamsList="searchParamsList" 
        :searchParam.sync="searchParam" 
        @searchBoxParams="searchBoxParams" 
        @searchReset="searchParamsReset"
        ></SearchBox>
      </div>
      <div slot="table" style="height: calc(100% - 54px);overflow: hidden;">
        <avue-crud
         v-if="showList"
          ref="cuTable"
          :data="AvueCrud.data"
          :option="option"
          stripe
          @row-click="handleCurrentRowChange"
          @row-dblclick="handleRowDBLClick"
          @selection-change="selectionChange"
        >
		
		<!-- <template slot="menuRight">

		</template> -->
          <template slot="menuLeft">
            <el-button
              v-for="(item, index) in AvueCrud.menuLeft"
              :key="index"
              :type="item.type"
              :icon="item.icon"
              size="small"
              @click="menuLeftFun(item.eventName)"
              >{{ item.title }}</el-button
            >
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              v-for="(item, index) in AvueCrud.menu"
              :key="index"
              :type="item.type"
              size="mini"
              :icon="item.icon"
              @click="menuActFun(item.eventName, scope.row, scope.index)"
              >{{ item.title }}</el-button
            >
          </template>
          <template slot="currentProgress" slot-scope="scope">
            <el-progress :percentage="scope.row.currentProgress" v-if="scope.row.currentProgress"></el-progress>
          </template>
        </avue-crud>
        <div class="page page-fixed el-pagination is-background" v-if="showPage">
            <el-pagination
              :background="page.background"
              @current-change="currentChange"
              :current-page.sync="page.currentPage"
              :page-size="page.pageSize"
              :layout="page.layout"
              :total="page.total"
            >
            </el-pagination>
          </div>
      </div>
    </main-content>
    <WFLaunch
      :showLeftTree="false"
      v-if="CurrentModule == 'LaunchTask'"
      :nwfSchemeInfoIdList="nwfSchemeInfo.nwfSchemeInfoIdList"
      :nwfRelationId="nwfSchemeInfo.nwfRelationId"
    ></WFLaunch>
    <elDialog
      v-if="elDialog.visible"
      :visible.sync="elDialog.visible"
      :title="elDialog.title"
      :width="elDialog.width"
      :append-to-body="elDialog.appendToBody"
      :modal="elDialog.modal"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="elDialog.fullscreen"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <component
        :is="flowData.componentName"
        v-if="elDialog.visible"
        :nwfSchemeInfoId="flowData.nwfSchemeInfoId"
        :taskId="flowData.taskId || flowData.processInstanceId"
        :processInstanceId="flowData.processInstanceId"
        :infoList="infoList"
        :nwfRelationId="nwfSchemeInfo.nwfRelationId"
        :draftId="draftId"
        :deploymentId="(AvueCrud&&AvueCrud.currentRow&&AvueCrud.currentRow.deploymentId)?AvueCrud.currentRow.deploymentId:''"
        :CurrentModule="CurrentModule"
        :reLaunchFormData="reLaunchFormData"
		:reLaunchFormDataId="reLaunchFormDataId"
		:retractList="retractList"
		:buttonType="flowData.buttonType"
        @closeDialog="closeDialog"
		@retractReLaunch="reLaunch"
      />
    </elDialog>
    <el-dialog
      title="????????????"
      :visible.sync="approvalDialogVisible"
      width="60%"
      custom-class="approval-dialog"
      :before-close="closeApprovalDialog"
    >
      <BatchApproval v-if="approvalDialogVisible" ref="batchApproval" :approvalData="AvueCrud.currentRow"></BatchApproval>
      <span slot="footer" v-if="!reviewBtn">
        <el-button size="mini" @click="approvalDialogVisible = false">??????</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confirmDialog"
        >????????????</el-button>
      </span>
      <span slot="footer" v-else>
        <el-button size="mini" type="primary" @click="confirmClick" :disabled="!clickBtn">??????</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import WFLaunch from "./../WFLaunch";
import CreateFLow from "./CreateFLow"; //??????????????????
import ApprovalFLow from "./ApprovalFLow"; //??????????????????
import LookFLow from "./LookFLow"; //??????????????????
import ReinitiateFLow from "./ReinitiateFLow"; //??????????????????
import RetractFlow from "./RetractFlow";//????????????
import BatchApproval from "./flow/BatchApproval";
import tableOptionMixin from "@/mixins/tableOption"; //table ????????????
import tableSearchMixin from "@/mixins/tableSearch"; //table ??????
import {
  getUpcomingTasks,
  getHistoryTask,
  getMyTask,
  getRecycleTask,
  getDrafts,
  getManualTask,
  postRecallProcess,
  postReinitiate,
  deleteToRecyclebin,
  deleteProcessInstance,
  deleteDrafts,
  getRetractNode,readTask
} from "@/api/workFlow/WFProcess";
import { AvueCrud } from "./processTasksConfig";
export default {
   mixins: [tableOptionMixin,tableSearchMixin],
  components: {
    MainContent,
    MainFixed,
    WFLaunch,
    CreateFLow,
    ApprovalFLow,
    LookFLow,
    ReinitiateFLow,
    RetractFlow,
    BatchApproval
  },
  props: {
    pageConfig: {
      type: Object,
      default: () => {
        return { isPage: true, pageSize: 20 };
      }
    },
    leftTreeColumn: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nwfSchemeInfo: {
      type: Object,
      default: () => {
        return { nwfRelationId: "", nwfSchemeInfoIdList: [] };
      }
    },
    customSearchField: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, prev, pager, next, jumper",
        background: false,
        pageSize: 20
      },
      isLoaded: false,
      CurrentModule: "ToDoTasks", // ??????????????????
      fixedTitle:this.$t('workFlow.processTasks.fixedTitle'), // ?????????????????????
      contentTitle: "??????????????????", // ?????????????????????
      flowData: {
        componentName: "",
        nwfSchemeInfoId: "",
        taskId: "",
        processInstanceId: "",
		buttonType:''
      },
      search: {
        keyword: "", //?????????
        timeRelation: "", //????????????
        serialNumber: "", //?????????
        SchemeType: "", //????????????
        startTime: null,
        endTime: null
      },
      searchFlag:true,
      showList:true,
      elTree: {
        data: [],
        nodeKey: "id",
        props: {
          label: "label",
          children: null,
          disabled: null,
          isLeaf: null
        }
      },
      option:AvueCrud.option,
      AvueCrud: AvueCrud,
      elDialog: {
        visible: false,
        title: "????????????",
        width: "30%",
        appendToBody: true,
		fullscreen:true,
		modal:false
      },
      infoList: [],
      customSearchParams: {},
      reLaunchFormData:[],//???????????????formData
	  reLaunchFormDataId:[],//???????????????????????????primaryKey
      draftId:'',
      retractList: [],
      approvalDialogVisible: false,
      reviewBtn: false,
      clickBtn:false
    };
  },
  created() {
    //???????????????????????????
    if (this.pageConfig.isPage) {
      this.page.pageSize = this.pageConfig.pageSize;//??????
    } else {
      this.page.pageSize = 100;//?????????
    }
    this.elTree.data = this.leftTreeColumn;
    //??????????????????localStorage??????
    window.localStorage.setItem("lookSystemForm", 0);
  },
  computed: {
    //???????????? ?????????????????????????????? ????????????
    storeCurrentModule() {
     if(this.$store.state.workflow.currentModule){
        return this.$store.state.workflow.currentModule
      }else{
        return ""
      }
    },
    showPage(){
      return this.pageConfig.isPage&&this.page.total>0
    }
  },
  watch: {
    storeCurrentModule(newValue, oldValue) {
      this.changeNode();
    },
    CurrentModule: {
      handler: function(newValue, oldValue) {
        this.option.selection = newValue === 'ToDoTasks'
        this.option.index = newValue !== 'ToDoTasks'
      },
      immediate:true
    }
  },
  async mounted() {
    if (this.elTree.data.length > 0) {
      this.changeNode();
    }
    let queryData = [
      { 
        name:this.$t('workFlow.processTasks.timeRange'), 
        DateField: '', 
        field: 'timeRelation', 
        tag: 'el-date-picker', 
        lgmark: '', 
      },
      { 
        name: this.$t('workFlow.processTasks.title'), 
        DateField: '', 
        field: 'keyword', 
        tag: 'el-input', 
        lgmark: '', 
      },
      { 
        name:this.$t('workFlow.processTasks.serialNum'), 
        DateField: '', 
        field: 'serialNumber', 
        tag: 'el-input', 
        lgmark: '', 
      }
    ];
    if(this.customSearchField.length>0){
        this.customSearchField.forEach(element => {
					let param={}
					if(element.componentConfig){
						param={...element.componentConfig.__config__}
						if(element.componentConfig.__organize__){
							param.__organize__=element.componentConfig.__organize__
							param.__type__= element.componentConfig.__type__
							if(element.componentConfig.__type__=='info'){
								param.infoType=element.componentConfig.infoType		
								param.__info__=true
							}
						}
						if(element.componentConfig.__config__.tag=="xjr-cascader"){
							param["show-all-levels"]=element.componentConfig["show-all-levels"];
							param.separator=element.componentConfig.separator;
							param.checkStrictly=element.componentConfig.checkStrictly
						}
						if(element.componentConfig.type=='year'||
						element.componentConfig.type=='month'||
						element.componentConfig.type=='date'||
						element.componentConfig.type=="datetime"){
							param.type = element.componentConfig.type;
							param.format=element.componentConfig.format							
						}
					}
          queryData.push({ 
            name: element.fieldName, 
            DateField: '', 
            field: element.field, 
            lgmark: '', 
						...param
          });
        });
      }
     await this.getWorkflowMenuSearchList(queryData);
  },
 
  methods: {
    searchParamsReset(){
      this.search.keyword = "";
      this.search.serialNumber = "";
      this.search.timeRelation = [];
      for (const key in this.searchParam) {
        if(this.searchParam[key]){
          this.searchParam[key] = null;
        }
      }
      for (const key in this.customSearchParams) {
        if(this.customSearchParams[key]){
          this.customSearchParams[key] = null;
        }
      }
        this.getList();
    },
    searchBoxParams(params){
      this.searchParam = params;
      for (let [key, value] of Object.entries(params)) {
        if(key=='keyword'){
          this.search[key] = value;
        }else if(key=='serialNumber'){
          this.search[key] = value;
        }else if(key=='timeRelation'){
           this.search.timeRelation = value;
        }else if(key=='timeRelation_End'){
        }else if(key=='timeRelation_Start'){
        }else{
          this.customSearchParams[key] = value;
        }
      }
      this.getList();
    },
    changeNode(){
      this.isLoaded = false;
      if(this.storeCurrentModule == "MyForwarder"){
        this.NodeClick(this.elTree.data[4]);
           this.isLoaded = true;
      }else if(this.storeCurrentModule == "CompletedTasks"){
        this.NodeClick(this.elTree.data[2]);
           this.isLoaded = true;
      }else{
        this.NodeClick(this.elTree.data[0]);
           this.isLoaded = true;
      }
      this.$nextTick(()=>{
          this.$refs.leftListTree.setCurrentKey(this.CurrentModule);
      });
      
    },
    closeDialog() {
      //???????????????????????????
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      this.elDialog.visible = false;
	  this.elDialog.fullscreen=true;
      this.$nextTick(() => {
        let isCurIndex = 0;
        this.elTree.data.forEach((ele, index) => {
          if (ele.id == this.CurrentModule) {
            isCurIndex = index;
          }
        });
        this.NodeClick(this.elTree.data[isCurIndex]);
      });
    },
    handleClose() {
      //?????????????????????
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      //??????????????????localStorage??????
      window.localStorage.setItem("lookSystemForm", 0);
      this.closeDialog();
    },
    handleCurrentRowChange(row) {
      let self = this;
      this.AvueCrud.currentRow = row;
      this.$refs.cuTable.toggleSelection([row])
      if (this.CurrentModule == "ToDoTasks") {
        this.AvueCrud.menuLeft.forEach(function(value, index) {
          if (value.eventName == "approval"){
            value.title = self.$t('approve')+(row.taskName || row.schemeName);
          }
        });
      }
    },
    handleRowDBLClick (row, event) {
      if (this.CurrentModule == "Drafts"&&this.openDoubleClickEdit) {
        this.edit(row);
      }
     
    },
    currentChange(val) {
     this.page.currentPage = val;
      this.getList();
    },
    getParams() {
      let nwfRelationParams = {};
      //????????????
      if (this.nwfSchemeInfo.nwfRelationId) {
        nwfRelationParams = { nwfRelationId: this.nwfSchemeInfo.nwfRelationId };
      }
      let params = {
        limit: this.page.currentPage,
        size: this.page.pageSize,
        order: this.AvueCrud.order.order,
        orderfield: this.AvueCrud.order.prop,
        keyword: this.search.keyword, // ?????????
        nwfRelationId: this.nwfRelationId,
        startTime: (Array.isArray(this.search.timeRelation)?this.search.timeRelation[0]:""), // ????????????
        endTime:  (Array.isArray(this.search.timeRelation)?this.search.timeRelation[1]:""), // ????????????
        serialNumber: this.search.serialNumber, // ?????????
        SchemeType: this.search.SchemeType // ????????????
      };
      let customSearch = {
        queryParameter:{
          ...this.customSearchParams
        }
      }
      return { ...params, ...nwfRelationParams, ...customSearch };
    },
    async getList() {
      let res = { code: 0, data: { data: [], success: false } };
      let params = this.getParams();
			params.queryParameter=this.changeSearchParams(params.queryParameter)
      try {
        if (this.CurrentModule == "ToDoTasks") {
          res = await getUpcomingTasks(params);
        }
        // else if (this.CurrentModule == "LaunchTask") {
        // }
        else if (this.CurrentModule == "CompletedTask") {
          res = await getHistoryTask(params);
        } else if (this.CurrentModule == "MyProcess") {
          res = await getMyTask(params);
        } else if (this.CurrentModule == "MyForwarder") {
          res = await getManualTask(params);
        } else if (this.CurrentModule == "RecycleProcess") {
          res = await getRecycleTask(params);
        }  else if (this.CurrentModule == "Drafts") {
          res = await getDrafts(params);
        } 
        else {
          this.page.total = 0;
          this.AvueCrud.data = [];
          return false;
        }
		this.changeBodyHeight()
        if (res.data.success) {

          let resultData = res.data.data;
          if(this.pageConfig.isPage){
             this.page.total = resultData.Total;
            this.AvueCrud.data = resultData.Rows;
          }else{
			  resultData = [];
			  if(res.data.data.length>0){
				resultData = res.data.data;
			  }
			  this.AvueCrud.data = resultData;
          }
        } else {
          this.AvueCrud.data = [];
        }

      } catch (error) {
        this.AvueCrud.data = [];
      }

    },
    NodeClick(data) {
      //????????????
       this.page.total = 0;
       this.page.currentPage=1;
      this.contentTitle = data.contentTitle || data.label;
      this.AvueCrud.currentRow = null; //??????????????????
      if (data.column) {
        this.AvueCrud.option.column = data.column;
      }
      if (data.menu) {
        this.AvueCrud.menu = data.menu;
      } else {
        this.AvueCrud.menu = [];
      }
	  let _this=this;
      this.AvueCrud.menuLeft.forEach(function(value) {
        if (value.eventName == "approval") {
          value.title = _this.$t('workFlow.processTasks.titleAudit');
        }
      });
      if (data.menuLeft) {
        this.AvueCrud.menuLeft = data.menuLeft;
      } else {
        this.AvueCrud.menuLeft = [];
      }
      this.AvueCrud.option.menu = false;
      this.AvueCrud.option.header = false;
      if (this.AvueCrud.menuLeft && this.AvueCrud.menuLeft.length) {
        this.AvueCrud.option.header = true;
      }
      if (this.AvueCrud.menu && this.AvueCrud.menu.length) {
        this.AvueCrud.option.menu = true;
      }
      this.CurrentModule = data.id;
      this.searchReset();
      let CurrentModuleList = [
        "ToDoTasks",
        "CompletedTask",
        "MyProcess",
        "MyForwarder",
        "RecycleProcess",
        'Drafts'
      ];
      if (CurrentModuleList.includes(this.CurrentModule)) {
        this.getList();
      } else {
        this.AvueCrud.data = [];
      }
    },
    menuLeftFun(name) {
      if (!name) return;
      const currentRow = this.AvueCrud.currentRow
      const isChoosed = this.CurrentModule === 'ToDoTasks' ? ( currentRow && currentRow.length) : currentRow
      if (name == "retractProcess" || name == "searchMenu" || isChoosed) {
        if (this.CurrentModule === 'ToDoTasks' && currentRow && currentRow.length === 1) {
          this.AvueCrud.currentRow = this.AvueCrud.currentRow[0]
        } 
        if (this[name]) this[name]();
      } else {
        this.$alert(this.$t('workFlow.processTasks.hintSelectRow'), this.$t('workFlow.processTasks.hintTips'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'),
          type: "info"
        });
      }
    },
    searchMenu() {
      this.getList();
    },
	retractProcess(){ //??????
		if(!this.AvueCrud.currentRow){
		  this.$message({
			message:this.$t('workFlow.processTasks.hintSelectRow'),
			type: 'warning'
		  })
		  return;
		}
		
		getRetractNode({taskId:this.AvueCrud.currentRow.taskId}).then(res=>{
			if(res.data.success){
				if(res?.data?.data){
					this.retractList=res.data.data;
					this.flowData.componentName = "RetractFlow";
					this.elDialog.title = this.$t('selectNodeWithdraw');
					this.elDialog.width="60%";
					this.elDialog.fullscreen=false;
					this.elDialog.modal=true;
					this.flowData.processInstanceId = this.AvueCrud.currentRow.processInstanceId;
					this.flowData.taskId = this.AvueCrud.currentRow.taskId;
					//??????????????????????????????
					document.body.className = document.body.className + " original";
					this.elDialog.visible = true; // ?????????????????????
				}
			}
			
		})
		
	},
    // ??????????????????
    searchReset() {
      this.search.keyword = ""; //?????????
      this.search.timeRelation = ""; //????????????
      this.search.serialNumber = ""; //?????????
      this.search.SchemeType = ""; //????????????
      this.search.startTime = ""; 
      this.search.endTime = ""; 
      if(this.customSearchField&&this.customSearchField.length>0){
        for (let key of Object.keys(this.customSearchParams)) {
          this.customSearchParams[key] = "";
        }
      }
      this.getList();
    },
    // ??????
    async eyeHistory() {
      if (this.CurrentModule === 'ToDoTasks' && this.AvueCrud.currentRow.length) {
        this.AvueCrud.currentRow = this.AvueCrud.currentRow[this.AvueCrud.currentRow.length - 1]
      }
      if(this.CurrentModule == "MyForwarder"){
        //???????????? ????????????
        let readState = this.AvueCrud.currentRow.readState;
        if(readState==0){
          try {
            await readTask(this.AvueCrud.currentRow.taskId);
          } catch (error) {
            
          }
        }
      }
      this.flowData.componentName = "LookFLow";
      let title = this.AvueCrud.currentRow.schemeName; // + "/" + this.AvueCrud.currentRow.taskName;
      this.elDialog.title = this.$t('workFlow.WFChange.viewProgress')+"???" + title + "???";
      this.flowData.processInstanceId = this.AvueCrud.currentRow.processInstanceId;
      this.flowData.taskId = this.AvueCrud.currentRow.taskId;
      //??????????????????????????????
      document.body.className = document.body.className + " original";
      this.elDialog.visible = true; // ?????????????????????
    },
    // ??????
    approval() {
      if (this.AvueCrud.currentRow.length) {
        this.approvalDialogVisible = true
        this.reviewBtn = false
        this.clickBtn = false
        return
      }
      this.flowData.nwfSchemeInfoId = "";
      this.flowData.componentName = "ApprovalFLow";
      let title = "";
      if (this.AvueCrud.currentRow.schemeName) {
        title += this.AvueCrud.currentRow.schemeName;
      }
      if (this.AvueCrud.currentRow.taskName) {
        title += "/" + this.AvueCrud.currentRow.taskName;
      }
      this.elDialog.title = this.$t('workFlow.processTasks.approvalProcess')+"???" + title + "???";
      this.flowData.processInstanceId = this.AvueCrud.currentRow.processInstanceId;
      this.flowData.taskId = this.AvueCrud.currentRow.taskId;
      this.elDialog.visible = true; // ?????????????????????
      this.infoList = [
        { title:this.$t('workFlow.processTasks.taskName'), value: title },
        { title: this.$t('workFlow.processTasks.startTime'), value: this.AvueCrud.currentRow.createTime },
        { title: this.$t('workFlow.processTasks.sponsor'), value: this.AvueCrud.currentRow.startUser }
      ];
      document.body.className = document.body.className + " original";
    },
    // ?????????????????????
    recallProcessUp() {
      this.$confirm(this.$t('workFlow.processTasks.hintReturnPrevious'), this.$t('workFlow.processTasks.hintRetract'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          // ?????????????????? (????????????????????? isMyTask: 0  ????????????????????? isMyTask: 1 )
          postRecallProcess({
            taskId: this.AvueCrud.currentRow.taskId,
            isMyTask: 0 // 0?????? ???????????? ?????? ; 1?????? ???????????? ????????????
          }).then(result => {
            let res = result.data;
            if (res.success) {
              this.getList();
              // ??????????????????
              this.$notify({
                title: this.$t('workFlow.processTasks.hintWithdrawSuccess'),
                message:
                  this.$t('hasBeen') +
                  this.AvueCrud.currentRow.$index +
                  this.$t('successWithdrawPreviousNode'),
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title: this.$t('deletePrompt.failureTitle'),
            message:this.$t('workFlow.processTasks.hintOperFailed'),
            type: "warning"
          });
        });
    },
    // ?????????????????????
    recallProcessAll() {
      this.$confirm(this.$t('workFlow.processTasks.hintReturnStart'), this.$t('workFlow.processTasks.hintRetract'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:  this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          // ?????????????????? (????????????????????? isMyTask: 0  ????????????????????? isMyTask: 1 )
          postRecallProcess({
            taskId: this.AvueCrud.currentRow.taskId,
            isMyTask: 1 // 0?????? ???????????? ?????? ; 1?????? ???????????? ????????????
          }).then(result => {
            let res = result.data;
            if (res.success) {
              this.getList();
              this.$notify({
                title:this.$t('workFlow.processTasks.hintWithdrawSuccess'),
                message:
                  this.$t('hasBeen') +
                  this.AvueCrud.currentRow.$index +
                  this.$t('successWithdrawStartNode'),
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title:this.$t('deletePrompt.failureTitle'),
            message:this.$t('workFlow.processTasks.hintOperFailed'),
            type: "warning"
          });
        });
    },
    // ????????????
    reLaunch(type) {
      this.reLaunchFormData = [];
	  this.reLaunchFormDataId=[];
      // ????????????????????????????????????
      postReinitiate({
        processInstanceId: this.AvueCrud.currentRow.processInstanceId
      }).then(res => {
        let result = res.data;
        if (result.success) {
          if (!result.data) return;
          let  formInfo =result.data.formInfo;
          let formData = [];
          if(formInfo&&formInfo.length>0){
            formInfo.forEach(ele => {
              if(ele.F_Data){
                formData.push(ele.F_Data);
              }
			  this.reLaunchFormDataId.push({F_Id:ele.F_Id,primaryKey:ele.primaryKey})
            });
          }
          this.reLaunchFormData = formData;
		  
          this.flowData.componentName = "ReinitiateFLow";
		  this.flowData.buttonType="reinitiate";
		  this.flowData.processInstanceId = this.AvueCrud.currentRow.processInstanceId;
          let title =(this.AvueCrud.currentRow.schemeName?this.AvueCrud.currentRow.schemeName:"") +( this.AvueCrud.currentRow.taskName? ("/"+this.AvueCrud.currentRow.taskName):'');
          this.elDialog.title = this.$t('workFlow.processTasks.relaunchProcess')+"???" + title + "???";
          this.flowData.nwfSchemeInfoId = result.data.nwfSchemeInfoId;
          this.infoList = [
            { title:this.$t('workFlow.processTasks.taskName'), value: title },
            { title: this.$t('workFlow.processTasks.startTime'), value: this.AvueCrud.currentRow.createTime },
            { title: this.$t('workFlow.processTasks.sponsor'), value: this.AvueCrud.currentRow.startUser }
          ];
		  if(type=='retract'){
			  this.flowData.buttonType="retract";
			  this.elDialog.fullscreen=true
		  }
          this.elDialog.visible = true; // ?????????????????????
        }
      });
    },
    // ?????????????????????????????????
    menuActFun(name, row, index) {
      if (!name) return;
      if (this[name]) this[name](row, index);
    },
    // ???????????????
    recycled(row, index) {
      this.$confirm(this.$t('workFlow.processTasks.hintMoveTrash'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          // ???????????????
          deleteToRecyclebin(this.AvueCrud.currentRow.processInstanceId).then(result => {
            let res = result.data;
            if (res.success) {
              this.$notify({
                title: this.$t('deletePrompt.successTitle'),
                message:this.$t('workFlow.processTasks.hintMovedSuccess'),
                type: "success"
              });
              this.getList();
            }
          });
        })
        .catch(() => {
        });
    },
    // ????????? ??????
    edit(row, index){
      let arr = row.value?JSON.parse(row.value):[];
      let draftList =[];
       if(arr&&arr.length>0){
         draftList = arr;
       }
       if(row.schemeinfoId){
         this.flowData.nwfSchemeInfoId = row.schemeinfoId;
         this.draftId = row.id;
         this.reLaunchFormData = draftList;
         this.flowData.componentName = "ReinitiateFLow";
         let title =row.schemeinfoName?row.schemeinfoName:'';
         this.elDialog.title = this.$t('workFlow.createFLow.hintLaunchFlow')+"???" + title + "???";
         this.elDialog.visible = true; // ?????????????????????
       }else{
         this.$notify({
          title: this.$t('deletePrompt.failureTitle'),
          message:this.$t('workFlow.processTasks.hintMissParameter'),
          type: "warning"
        });
       }
      
    },
    // ??????
    delete(row, index) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          if(this.CurrentModule=='RecycleProcess'){
            deleteProcessInstance(this.AvueCrud.currentRow.processInstanceId).then(result => {
            let res = result.data;
            if (res.success) {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message:this.$t('deletePrompt.successDeleted'),
                type: "success"
              });
              this.getList();
            }else{
              this.$notify({
                title: this.$t('deletePrompt.failureTitle'),
                message: this.$t('deletePrompt.failedDeleted'),
                type: "warning"
              });
            }
          });
          }else if(this.CurrentModule=='Drafts'){
            let draftId =  row.id;
            deleteDrafts(draftId).then(result => {
            let res = result.data;
            if (res.success) {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message:this.$t('deletePrompt.successDeleted'),
                type: "success"
              });
              this.getList();
            }else{
              this.$notify({
                title:this.$t('deletePrompt.failureTitle'),
                message: this.$t('deletePrompt.failedDeleted'),
                type: "warning"
              });
            }
          });
          } else{
            this.$notify({
                title: this.$t('deletePrompt.failureTitle'),
                message:this.$t('workFlow.processTasks.hintNoDelete'),
                type: "warning"
              });
          }
          
        })
        .catch(() => {

        });
    },
    selectionChange(row) {
      if (this.CurrentModule === 'ToDoTasks') {
        this.AvueCrud.currentRow = row
      }
    },
    closeApprovalDialog() {
      this.approvalDialogVisible = false
      if(this.clickBtn) this.getList()
    },
    confirmDialog() {
      this.$refs.batchApproval.$refs.approvalForm.validate(valid => {
        if (valid) {
          this.reviewBtn = true
          this.$refs.batchApproval.batchApproval().then(() => {
            this.clickBtn = true
          })
        } else {
          return
        }
      })
    },
    confirmClick() {
      this.approvalDialogVisible = false
      this.getList()
    }
  }
};
</script>
<style lang="css" scoped>
div /deep/  .page{
  position: fixed;
  bottom: 20px;
  right: 30px;
}
div /deep/ .el-range-separator {
  width: 35px;
  height: auto;
}
/* reset css */
.companiesuser-form .el-form-item {
  margin-bottom: 12px;
}
div /deep/ .el-form-item{
	margin-top:0;
	margin-right: 0px;
	margin-bottom: 6px!important;
}
div /deep/ .el-form-item__content{
	margin-left: 5px;
}

/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
.avatar-uploader {
  border: 1px solid #dcdfe6;
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 4px;
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  display: block;
  padding-top: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
}


/* ?????????????????????????????? */
.avue-crud /deep/ .el-button [class*="fa-"] + span {
  margin-left: 5px;
}
.el-input__inner {
  height:27px;
  line-height:27px;
}

div /deep/ .main-table{
	overflow: hidden;
}
/* ????????? */
.search-item > div{
  width: 100%;
}

div /deep/ .main-search .main-search-box,div /deep/ .main-search .main-prompt-box {
  padding:0px!important;
}

.title-input{
	width: 200px;
}


div /deep/ .avue-crud__left{
	margin-right: 4px;
}

@media screen and (max-width: 1440px) {
	.title-input{width: 144px;}
}

div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}

/deep/ .approval-dialog{
  height: calc(100% - 240px);
  min-height: 200px;
}

/deep/ .approval-dialog .el-dialog__body{
	height: calc(100% - 110px);
  overflow: auto;
}

/deep/ .el-progress__text{
  font-size: 13px !important;
}
</style>
