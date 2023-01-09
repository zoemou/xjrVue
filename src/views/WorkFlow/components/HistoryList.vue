<template>
  <div class="table">
    <avue-crud ref="historyData" :data="historyData" :option="historyOption">
      <template slot-scope="scope" slot="menu">
        <el-button type="primary" size="mini" @click="hsitoryView(scope.row)"
          >{{$t('workFlow.historyList.previewBtn')}}</el-button
        >
        <el-button type="primary" size="mini" @click="updateHistory(scope.row)"
          >{{$t('workFlow.historyList.renewBtn')}}</el-button
        >
      </template>
    </avue-crud>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.historyList.previewBtn')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="bpmnVisible"
      fullscreen
      :before-close="bpmnClose"
    >
       <BpmnView  v-if="bpmnVisible" :deploymentId="deploymentId"></BpmnView>
    </el-dialog>
	<el-dialog v-dialogDrag
	  :title="$t('changeDetails')+$t('-')+$t(title)"
	  :append-to-body="true"
	  :close-on-click-modal="false"
	  :visible.sync="listVisible"
	  width="50%"
	  :before-close="(done)=>{done()}"
	>
	   <avue-crud ref="allProcessList" :data="allProcessList" :option="allProcessOption"></avue-crud>
	   <span slot="footer" class="dialog-footer">
	     <el-button
	       size="mini"
	       type="primary"
	       @click="()=>{if(!disabled){ listVisible=false;$emit('close',true)}}"
	       :disabled="disabled"
	       >
	       {{$t('buttonModule.modalSureBtn')}}
	       </el-button
	     >
	   </span>
	</el-dialog>
  </div>
</template>

<script>
import { getHisitoryList, changeProcessversion,getAllProcessList } from "@/api/workFlow/WFDesign";
import BpmnView from './BpmnView.vue';
export default {
  name: "HistoryList",
  props: {
    id: {
        type: String,
        default: ""
      },
	title: {
	    type: String,
	    default: ""
	  }
  },
  components: {
    BpmnView,
  },
  data() {
	const _this = this;  
    return {
	  disabled:true,
	  listVisible:false,
	  allProcessList:[],
	  allProcessOption:{
        page: false,
        highlightCurrentRow: true,
        stripe: true,
        maxHeight: 420,
        border: true,
        index: true,
        indexLabel:this.$t('workFlow.historyList.tabNum'),
        align: "center",
        header: false,
        menu: false,
        column: [
          {
            label:this.$t('processTaskName'),
            prop: "processInstanceName"
          },
          {
            label:this.$t('workFlow.filedConfig.serialNum'),
            prop: "serialNumber"
          },
          { label:this.$t('changeState'), prop: "status",
            formatter: (row) => {
              return row.status=='load' ?'<i class="el-icon-loading"></i>': row.status==1?_this.$t('deletePrompt.successTitle'):_this.$t('deletePrompt.failureTitle');
            },
		  },
          { label:this.$t('changeDetails'), prop: "description",overHidden:true },
        ],
      },
      bpmnVisible: false,
	  deploymentId:'',
      historyData: [],
      historyOption: {
        page: false,
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 180,
        maxHeight: 420,
        border: true,
        index: true,
        indexLabel:this.$t('workFlow.historyList.tabNum'),
        align: "center",
        menuAlign: "center",
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menu: true,
        column: [
          {
            label:this.$t('workFlow.historyList.tabState'),
            prop: "F_EnabledMark",
            formatter: (row) => {
              return row.currentVersion === 1 ?this.$t('workFlow.historyList.tabCurVersion'): "";
            },
          },
          {
            label:this.$t('workFlow.historyList.tabVersion'),
            prop: "F_version"
          },
          { label:this.$t('workFlow.historyList.tabFounder'), prop: "F_CreateUserName",overHidden:true },
          { label:this.$t('workFlow.historyList.tabCreateDate'), prop: "F_CreateDate",overHidden:true },
        ],
      },
      page: {
        pageSize: 100,
        total: 10,
        currentPage: 1,
      },
    };
  },
  mounted () {
    this.historyPageLoad();
  },
  methods: {
    historyPageLoad() {
      let params = {
        pnum: this.page.currentPage,
        psize: this.page.pageSize,
        id: this.id,
        order: "asc",
        offset: 0
      };
      getHisitoryList(params).then((res) => {
        if(res.data.success){
          this.historyData = res.data.data.Rows;
        }else{
          this.historyData = [];
        }
        
      });
    },
    hsitoryView(row) {
		this.deploymentId=row.F_DeploymentId;
      this.bpmnVisible = true;
    },
    bpmnClose(){
      this.bpmnVisible = false;
    },
    updateHistory(row) {
		this.$confirm(this.$t('whetherUpdateVersionContent'), this.$t('whetherUpdateVersion'), {
		  confirmButtonText: this.$t('buttonModule.modalSureBtn'),
		  cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
		  type: 'warning'
		}).then(() => {
			getAllProcessList(row.F_DeploymentId).then(res=>{
				this.allProcessList=res.data.data;
				this.listVisible=true
				var promises = this.allProcessList.map(async function(o){
				  o.status='load';
				  let params = {
				    deploymentId: o.deploymentId,
				    processInstanceId: o.processInstanceId,
				  };
				  try{
				  	let res=await changeProcessversion(params)
				  	if (res.data.success) {
				  		o.status=res.data.data.status;
				  		o.description=res.data.data.description;			    
				  	}
				  	return res;
				  }catch(e){
					  o.status=0
				  }
				  
				});
				let that=this;
				Promise.all(promises).then(function(posts) {
					that.disabled=false;
				}).catch(function(reason){
				
				});
			})		  
		}).catch(() => {});
      
    },
  },
};
</script>

<style lang="scss" scoped>
</style>