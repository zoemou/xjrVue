<template>
  <div class="main-container" style="padding: 0px 8px;">
    <main-fixed :title="$t('workFlow.WFMonitor.fixedTitle')">
      <div slot="list">
        <el-tree
          :data="menuTree"
          :props="menuTreeProps"
          node-key="key"
          ref="cTree"
          :default-expand-all="false"
          @node-click="handleNodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ node, data }">
		    <i class="el-icon-stopwatch"></i>
		    <span>{{ data.name}}</span>
		 </span>
		</el-tree>
      </div>
    </main-fixed>
    <main-content
      :title="
       $t('workFlow.WFMonitor.fixedTitle') + (taskKey === 'unfinished' ? $t('workFlow.WFMonitor.unfinished') :$t('workFlow.WFMonitor.finished'))
      "
      :paddingLeft="205"
    >
      <div slot="search">
        <div class="search-box">
          <el-date-picker
            v-model="timeRelation"
            type="daterange"
            :range-separator="$t('searchModule.rangeSeparator')"
            :start-placeholder="$t('searchModule.startDatePlaceholder')"
            :end-placeholder="$t('searchModule.endDatePlaceholder')"
            class="search-input-time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
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
            @click="search"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="tableList"
          :data="list"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
					@on-load="sizeChange"
					:page.sync="page"
          @row-click="handleCurrentRowChange"
          
        >
          <template slot="menuLeft">
            <el-button type="primary" icon="el-icon-view"  size="small" @click="menuOpr('look')"
              v-if="hasButtonPermission('eye')"
              >{{$t('tableOperationModule.viewBtn')}}</el-button
            >
            <el-button
              v-if="taskKey=='unfinished' && hasButtonPermission('appoint')"
              
              size="small"
              @click="menuOpr('appoint')"
              >{{$t('workFlow.WFMonitor.examinerBtn')}}</el-button
            >
            <el-button
              v-if="taskKey=='unfinished' && hasButtonPermission('cancel')"
             
              size="small"
              @click="menuOpr(oprMenuName)"
              >{{oprMenuName==='suspend'?$t('workFlow.WFMonitor.hangUpBtn'):$t('restore')}}</el-button
            >
          </template>
          <template slot="currentProgress" slot-scope="scope">
            <el-progress :percentage="scope.row.currentProgress" v-if="scope.row.currentProgress"></el-progress>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <elDialog
      v-if="elDialog.visible"
      :visible.sync="elDialog.visible"
      :title="elDialog.title"
      width="60%"
      :close-on-click-modal="false"
      :fullscreen="elDialog.fullscreen"
      :append-to-body="true"
	  :before-close="closeDialog"
    >        
	<!-- CurrentModule='MyProcess' -->
      <component
        v-if="elDialog.visible"
        :is="elDialog.componentName"
        :processInstanceId="processInstanceId"
		:deploymentId="clickRow.deploymentId"
        :taskId="taskId"
        :schemeName="schemeName"
        :candidateUsers="candidateUsers"
        @confirmDialog="confirmAppoint"
        @closeDialog="closeDialog"
      />
    </elDialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import {
  getFinishedTasks,
  getUnfinishedTasks,
  suspendProcess,
  activateProcess,
  assign,
} from "@/api/workFlow/WFMonitor";
import LookFLow from "./components/LookFLow.vue";
import AppointUser from "./components/AppointUser.vue";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: {
    MainFixed,
    MainContent,
    LookFLow,
    AppointUser,
  },
  data() {
    return {
      taskKey: "unfinished",
      menuTree: [
        { name:this.$t('workFlow.WFMonitor.unfinished') , key: "unfinished" },
        { name: this.$t('workFlow.WFMonitor.finished') , key: "finished" },
      ],
      menuTreeProps: {
        label: "name",
      },
      list: [],
      clickRow: '',
      timeRelation:[],
      searchParam: {
        keyword: "",
        startTime: "",
        endTime: "",
        limit: 1,
        size: 20,
      },
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        border: false,
        page: true,
        index: false,
        align: "center",
        menu:false,
        menuAlign: "center",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [{
            label: this.$t('workFlow.filedConfig.serialNum'),
            prop: "serialNumber",
			align:'center'
          },			
          {
            label: this.$t('workFlow.WFMonitor.tabTask'),
            prop: "taskName",
			align:'left',sortable:true
          },
          {
            label:this.$t('workFlow.WFMonitor.tabTitle'),
            prop: "schemeName",
			align:'left',sortable:true,
			overHidden:true
          },{
              label: this.$t('curProgress'),
              prop: 'currentProgress',sortable:true,slot:true
          },
   //        {
   //          label:this.$t('workFlow.WFMonitor.tabGrade'),
   //          prop: "priority",
			// width:'80',
			// align:'left',sortable:true
   //        },
          {
            label:this.$t('workFlow.WFMonitor.tabInitiator'),
            prop: "startUser",
			width:'100',
			align:'left',sortable:true
          },
          {
            label:this.$t('workFlow.WFMonitor.tabTime'),
            prop: "createTime",
			width:'140',
			align:'left',sortable:true
          },
        ],
      },
      processInstanceId: "",
      taskId:"",
      candidateUsers: [],
      schemeName: "",
      elDialog: {
        visible: false,
        title: "弹框示题",
        componentName: "",
        fullscreen: false,
      },
      oprMenuName:"suspend"
    };
  },
  created() {
		this.changeColumn()
  },
  mounted(){
		this.$nextTick(()=> {
			this.$refs.cTree.setCurrentKey(this.taskKey);
			this.getList();
		});
  },
  methods: {
    handleNodeClick(val) {
      this.reset()
      this.taskKey = val.key;
      this.getList();
			this.$nextTick(()=> {
				this.changeColumn()
			})
    },
		changeColumn(){
			let obj=this.option.column.find(o=>{return o.prop=='isSuspended'})
			if(this.taskKey=='unfinished'){			
				if(obj) return;
				this.option.column.splice(3,0,{
					label:this.$t('workFlow.WFDesign.tabFlowState'),
					prop: "isSuspended",
					align:'left',sortable:true,
					formatter: (row,value,label,column)=> {
            if(value==1){
              return this.$t('importAndExport.importForm.optionEnd');
            }else if(value==2){
              return this.$t('workFlow.WFMonitor.hangUpBtn');
            }else{
              return this.$t('ongoingTwo');
            }
					}
				},{
					label:this.$t('stateDetails'),
					prop: "suspendedCause",
					align:'left',sortable:true,
					overHidden:true
				})
			}else{
				if(obj) this.option.column.splice(3,2)			
			}
		},
    handleCurrentRowChange(row, event, column) {
      this.clickRow = row;
      if(row.isSuspended==2){
        this.oprMenuName ='activate';
      }else{
        this.oprMenuName ='suspend';
      }
    },
    search() {
      this.getList();
    },
	reset(){
		this.page.currentPage = 1;
		this.page.total = 0;
		this.timeRelation=[]
		this.searchParam = {
		  keyword: "",
		  startTime: "",
		  endTime: "",
		  limit: 1,
		  size: 20,
		};
	},
	sizeChange(page) {
	    this.page.currentPage = page.currentPage
	    this.page.pageSize = page.pageSize
			this.getList()
	},
    searchReset() {
      this.reset()
	  this.getList();
    },
    async getList() {
      this.searchParam.limit = this.page.currentPage;
      this.searchParam.size = this.page.pageSize;
      if(this.timeRelation.length>0){
         this.searchParam.startTime = this.timeRelation[0];
         this.searchParam.endTime = this.timeRelation[1];
      }else{
        this.searchParam.startTime = "";
        this.searchParam.endTime = "";
      }
      let res = { code: 0, data: { data: {Total:0,Rows:[]}, success: false } };
      try {
        if (this.taskKey === "unfinished") {
        res = await getUnfinishedTasks(this.searchParam);
      } else {
        res = await getFinishedTasks(this.searchParam);
      }
      if (res.data.success) {
        this.page.total = res.data.data.Total;
        this.list = res.data.data.Rows;
      }else{
        this.list = [];
      }
      } catch (error) {
         this.list = [];
      }
      
    },
    menuOpr(name) {
      if (!name) return;
      if (this.clickRow&&this.clickRow.processInstanceId) {
        this.processInstanceId = this.clickRow.processInstanceId;
        this.taskId = this.clickRow.taskId;
        if (this[name]) {
          this[name]();
        }
      } else {
        this.$alert(this.$t('workFlow.WFMonitor.hintSelectRow'), this.$t('workFlow.WFMonitor.hintTips'), {
          confirmButtonText:this.$t('buttonModule.modalSureBtn'),
          type: "info",
        });
      }
    },
    look() {
      this.elDialog.visible = true;
      this.elDialog.componentName = "LookFLow";
      this.elDialog.title = this.$t('workFlow.WFChange.viewProgress')+"【" + this.clickRow.schemeName + "】";
      this.elDialog.fullscreen = true;
    },
    appoint() {
      this.candidateUsers = this.clickRow.candidateUsers;
      this.schemeName = this.clickRow.schemeName +(this.clickRow.taskName?'-'+this.clickRow.taskName:'');
      this.elDialog.visible = true;
      this.elDialog.componentName = "AppointUser";
      this.elDialog.title = this.$t('workFlow.WFMonitor.titleAssignApprover');
      this.elDialog.fullscreen = false;
    },
    confirmAppoint(assignUserIds) {
      if (assignUserIds) {
        assign({ taskId: this.clickRow.taskId, userId: assignUserIds }).then(
          (res) => {
            if (res.data&&res.data.success) {
              this.$notify({
                title:this.$t('deletePrompt.promptTitle'),
                message:this.$t('deletePrompt.hintSuccess'),
                type: "success",
              });
              this.closeDialog();
            } else {
              this.$notify({
                title: this.$t('deletePrompt.promptTitle'),
                message:this.$t('deletePrompt.hintFailure'),
                type: "warning",
              });
            }
          }
        );
      } else {
        this.$message(this.$t('workFlow.WFMonitor.hintNotAdd'));
        this.closeDialog();
      }
    },
    suspend() {
      this.$confirm(this.$t('workFlow.WFMonitor.hintWhetherHangUp'), this.$t('workFlow.WFMonitor.hintSuspendPrompt'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      }).then(() => {
        suspendProcess(this.processInstanceId).then((res) => {
          if (res.data&&res.data.success) {
            this.$notify({
              title: this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintFailure'),
              type: "warning",
            });
          }
          this.getList();
        });
      });
    },
    activate() {
      this.$confirm(this.$t('sureToRestore'), this.$t('restorePrompt'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      }).then(() => {
        activateProcess(this.processInstanceId).then((res) => {
          if (res.data&&res.data.success) {
            this.$notify({
              title: this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintFailure'),
              type: "warning",
            });
          }
          this.getList();
        });
      });
    },
    closeDialog() {
      this.elDialog.visible = false;
      this.elDialog.componentName = "";
      this.elDialog.title = "";
	  this.clickRow='';
      this.getList();
    },
  },
};
</script>

<style lang="css" scoped>
div /deep/ .el-range-separator {
	width: 35px;
  height: auto;
}
div /deep/ .el-icon-view{
	font-size: 12px;/*登录页面样式冲突 */
  line-height: 1;
}
.search-input-time {
  width: 250px;
  margin-right: 5px;
}
.search-input {
  width: 200px;
  margin-right: 5px;
}
/deep/ .search-box{top:5px;}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}
/deep/ .el-progress__text{
  font-size: 13px !important;
}
@media screen and (max-width: 1300px) {
	   /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}		
</style>
