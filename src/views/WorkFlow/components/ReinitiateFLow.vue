<template>
  <div class="box" v-if="isLoaded">
    <div class="panel-left">
      <elTabs tab-position="top" class="customLeftTab"  v-model="flowTabsActiveName"   :before-leave="flowTabsClick">
        <el-tab-pane :label="$t('workFlow.createFLow.labelFormInfor')"  name="form">
          <el-tabs
            class="work-flow-tabs"
            tab-position="left"
            v-model="activeName"
            :before-leave="tabBeforeLeave"
          >
            <el-tab-pane
              v-for="(item, index) in processInfo.formFieldInfo"
              :key="index"
              :name="'parsers-' + index"
            >
							<span slot="label"><i v-if="!formInfoList[index].valid" class="badge-dot"></i>{{item.F_Name}}</span>
              <WorkFlowFormParser
                v-if="
                  item.F_Type == 0 && currentActiveName == 'parsers-' + index
                "
                :conf="processInfo.forms[index]"
                :index="index"
                :type="item.F_Type"
                :formFieldInfo="item"
                :formData="processInfo.forms_data[index]"
                :formInfos="processInfo.forms_info[index]"
                :ref="'parsers-' + index"
              ></WorkFlowFormParser>
              <SystemFormParser
                v-if="
                  item.F_Type == 2 && currentActiveName == 'parsers-' + index
                "
                :type="item.F_Type"
                :index="index"
                :url="item.F_Url"
                :formData="processInfo.forms_data[index]"
                :formFieldInfo="item"
                :ref="'parsers-' + index"
              ></SystemFormParser>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelFlowInfor')"  name="infos">
          <!-- <Info :imgUrl="processInfo.infos"></Info> -->
		  <BpmnView v-if="flowTabsActiveName=='infos'" :deploymentId="deploymentId"></BpmnView>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelCirRecord')"  name="roams">
          <Roams  v-if="flowTabsActiveName=='roams'" :processInstanceId="processInstanceId"></Roams>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelAnnexSum')"  name="files">
          <Files v-if="flowTabsActiveName=='files'" :fileList="processInfo.files"></Files>
        </el-tab-pane>

        <template v-if="RelationFlowTabs.length > 0">
          <el-tab-pane
            v-for="(item, index) in RelationFlowTabs"
            :label="item.processInstanceName?item.processInstanceName:$t('workFlow.createFLow.frontTask')+(index+1)"
            :key="index"
             :name="item.processInstanceId"
          >
            <RelationTabs
              v-if="item.processInstanceId"
              :processInstanceId="item.processInstanceId"
              :deploymentId="item.F_DeploymentId"
            ></RelationTabs>
          </el-tab-pane>
        </template>
      </elTabs>
    </div>
    <div class="panel-right">
      <el-tabs type="card" class="customCardTab">
        <el-tab-pane
          :label="PrepositionTaskList.length > 0 ? $t('workFlow.createFLow.titleAssocTasks'): $t('workFlow.createFLow.titleLaunch')"
        >
          <LaunchInfo :infoList="infoList"></LaunchInfo>
          <!-- ?????????????????? -->
          <PrepositionTask
            v-if="PrepositionTaskList.length > 0"
            :PrepositionTask.sync="PrepositionTaskList"
            @changeRelationTabs="changeRelationTabs"
          ></PrepositionTask>

          <el-button type="primary" @click="submitCreateProcess"
            >{{$t('workFlow.createFLow.submitBtn')}}</el-button
          >
          <el-button v-if="CurrentModule=='Drafts'" class="draft-button" @click="saveDraft">{{$t('workFlow.createFLow.saveDraftBtn')}}</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
     <NextNodeApprovedBy
      v-if="nextNodeDialogVisible"
      :candidateInfo="candidateInfo"
      @submit="confirmMemberDialog"
    ></NextNodeApprovedBy>
  </div>
</template>

<script>
import WorkFlowFormParser from "@/components/codeParser/WorkFlowFormParser.vue"; //??????????????????
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue"; //????????????????????????
import Info from "./flow/Info";
import Roams from "./flow/Roams";
import Files from "./flow/Files";
import PrepositionTask from "./flow/PrepositionTask";
import RelationTabs from "./flow/RelationTabs";
import LaunchInfo from "./flow/LaunchInfo";
import NextNodeApprovedBy from "./flow/NextNodeApprovedBy/Index";
import {
  postCreateProcessform,
  postCreateProcess
} from "@/api/workFlow/WFLaunch";
import {
  postSaveDrafts,
  deleteDrafts,
  postAgainCandidate,
  recallProcess,
  suspendProcess
} from "@/api/workFlow/WFProcess";
import request from "@/router/axios";
import { baseUrl } from "@/config/env";
import workflowFormMixin from "./workflowFormMixin";
import BpmnView from './BpmnView.vue';
export default {
  mixins:[workflowFormMixin],
  props: {
	deploymentId: {
	  type: String,
	  default: null
	},
	processInstanceId: {
	  type: String,
	  default: null
	},
    nwfSchemeInfoId: {
      type: String,
      default: null
    },
    infoList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    reLaunchFormData: {
      type: Array,
      default: () => {
        return [];
      }
    },
	reLaunchFormDataId: {
	  type: String,
	  default: null
	},
    nwfRelationId: {
      type: String,
      default: null
    },
    CurrentModule: {
      type: String,
      default: null
    },
    draftId: {
      type: String,
      default: null
    },
	buttonType: {
	  type: String,
	  default: null
	}
  },
  components: {
    WorkFlowFormParser,
    SystemFormParser,
    Info,
    Roams,
    Files,
    PrepositionTask,
    RelationTabs,
    LaunchInfo,
    NextNodeApprovedBy,
	BpmnView
  },
  data() {
    return {
      flowTabsActiveName:'form',
      activeName: "parsers-0",
      currentActiveName: "parsers-0",
      promiseList: [],
      Ids: [],
      formReturnData: [],
      formIdParams: [],
      primaryKey: "",
      formPrimaryKey:[],
      isLoaded: false,
      loading: null,
      RelationFlowTabs: [],
      PrepositionTaskList: [],
      formInfoList: [],
      processInfo: {
        forms: null, // ??????
        infos: null, // ??????
        roams: [], // ??????
        files: [], // ??????
        subs: [], // ?????????
        roams: [],
        btnInfo: {}, // ????????????
        nodeInfo: {}, // ???????????? ???????????????????????????????????????
        myStamps: [], // ??????????????????
        forms_data: [], // ????????????
        signation: false, //???????????????(???????????? ??????????????? ??????)
        forwarderList: [], //?????????????????????
        rejectnode: [], // ???????????????????????????????????????
        task_comment: [] //??????????????? ????????????
      },
      formData: {
        btnValue: "agree_", // ???????????? ????????? (????????????)
        message: "", // ????????????
        esignature: "", // ????????????
        esignature_pwd: null, // ????????????
        forwarderList: [], // ????????????????????? formData.forwarderList
        userJson: [], // ?????????????????????
        rejectnode: null, // ?????????????????????
        relationTaskList: [], // ??????????????????
        keyValue: [], // ???????????? ( ????????????ID ,????????????ID )
        formValue: [], // ???????????? (?????????????????????)
        fileValue: [] // ???????????? ?????????????????????????????????????????????????????????????????????
      },
      nextNodeDialogVisible: false,
      candidateInfo:[]
    };
  },
  async created() {
    this.loading = this.$loading({
      lock: true,
      text:this.$t('workFlow.createFLow.hintLoading'),
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)"
    });
    try {
     await this.createProcess();
      this.loading.close();
    } catch (error) {
      this.loading.close();
    }
   
  },
  methods: {
    async flowTabsClick(activeName, oldActiveName){
      if(oldActiveName=='form'){//??????????????????tab?????????????????????
        await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName);
        this.activeName = this.currentActiveName;
        this.currentActiveName = "";
      }
      if(activeName=='form'){//??????????????????tab???????????????
        this.currentActiveName=this.activeName;
      }
    },
    async createProcess() {
      let self = this;
     
      try {
        let res = await postCreateProcessform({
          id: this.nwfSchemeInfoId,
          nwfRelationId: this.nwfRelationId
        });
        let processRes = res.data;
        if (processRes.success) {
          const data = processRes.data.filter(item => {
            return !this.delEmptyForm(item.formFieldInfo)
          })
          this.changeData(data);
          if (this.processInfo&&this.processInfo.forms_info&&this.processInfo.forms_info.length > 0) {
            for (
              let index = 0;
              index < this.processInfo.forms_info.length;
              index++
            ) {
              this.formReturnData[index] = {
                code: 0,
                returnData: [],
                formSubmitError: true
              };
            }
          }
          if(processRes.data&&processRes.data.length>0&&processRes.data[0].relevanceTask&&processRes.data[0].relevanceTask.tableData){
            this.PrepositionTaskList =  processRes.data[0].relevanceTask.tableData;
          }
          if(this.CurrentModule=='RecycleProcess'||this.CurrentModule=='Drafts'||this.CurrentModule=='CompletedTask'||this.CurrentModule=='MyProcess'){
            this.processInfo.forms_data = this.reLaunchFormData;			
          } 
          this.isLoaded = true;
        }
      } catch (error) {
        self.loading.close();
        self.$alert(this.$t('workFlow.createFLow.hintDataError'),this.$t('workFlow.createFLow.hintInfor'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'),
          showClose: false,
          callback: action => {
            self.$emit("closeDialog");
          }
        });
      }
           
    },
    changeData(data) {
      if (!data) return;
      let hasProcessInfoFormsData = false;
      if(this.processInfoFormsData&&JSON.stringify(this.processInfoFormsData)!="{}"){
        hasProcessInfoFormsData = true;
      }
      let self = this;
      let form = [];
      let files = [];
      let form_data = [];
      let form_info = [];
      let formFieldInfo = [];
      let subs = null;
      let task_comment = [];
      let formPrimaryKey = [];
      data.forEach(function(value, index) {
		let idx=self.reLaunchFormDataId.findIndex(o=>{return o.F_Id==value.SchemeInfo.F_Id})
		if(idx>=0) value.primaryKey=self.reLaunchFormDataId[idx].primaryKey;
        let primaryKey = "";
        primaryKey = value.primaryKey ? value.primaryKey : "";
        let tempFormData = value.F_Scheme ? value.F_Scheme.data : {};
        form.push(tempFormData); //??????????????????
        if(hasProcessInfoFormsData){// ?????? ??????????????????
          let formId = "";
          if(value.SchemeInfo.F_Id){
            formId = value.SchemeInfo.F_Id;
          }
          if(formId&&self.processInfoFormsData[formId]){
            primaryKey = self.processInfoFormsData[formId].rowId;
            value.formData = self.processInfoFormsData[formId].formData;
          }
        }
        formPrimaryKey.push(primaryKey);
        form_data.push(value.formData ? value.formData : {}); //??????????????????
        let taskComment = value.taskComment ? value.taskComment : {};
        task_comment.push(taskComment);
        form_info.push(value); // ????????????
        if (value.annexInfo) {
          value.annexInfo.map(function(item) {
            files.push(item);
          });
        }
        if (value.formFieldInfo) {
          formFieldInfo.push(value.formFieldInfo); //????????????
        }
        // ??????????????????????????????????????????
        if (value.subProcessInfo && value.subProcessInfo.length)
          subs = value.subProcessInfo; // ??????????????????????????????????????????
      });
      //????????????
      formFieldInfo.forEach(ele => {
        let temp = {
          F_Id: ele.F_Id,
          F_Type: ele.F_Type,
          F_Name: ele.F_Name,
          F_EnCode: ele.F_EnCode,
          valid: false
        };
        this.formInfoList.push(temp);
      });
      this.processInfo.forms = form;
      this.processInfo.forms_data = form_data;
      this.processInfo.forms_info = form_info;
      this.processInfo.formFieldInfo = formFieldInfo;
      this.processInfo.files = files;
      this.processInfo.subs = subs;
      this.processInfo.task_comment = task_comment;
      this.formPrimaryKey = formPrimaryKey;
    },
    changeRelationTabs(data) {
      this.RelationFlowTabs = data;
    },
    async submitCreateProcess() {
      this.loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.createFLow.hintSubmit'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let res = await this.submitAllForm();
    },
    // ??????????????????
    async submitAllForm() {
      if(this.currentActiveName){
         await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName);
      }
      this.formData.formValue = [];
      this.formData.keyValue = [];
      this.formData.fileValue = [];
      let self = this;
      const formLength = self.formInfoList.length;
      let formSubmitErrorArr = this.formReturnData.filter(ele => {
        return !ele.formSubmitError;
      });
      if (formSubmitErrorArr.length != formLength) {
        self.$notify({
          title:this.$t('workFlow.createFLow.hintError'),
          message:this.$t('workFlow.createFLow.hintCheckForm'),
          type: "warning"
        });
        self.loading.close();
        return false;
      }
      let promMethodList = [];
      this.promiseList.forEach(element => {
        const promise  = new Promise((resolve,reject) => {
            request({
            url: element.url,
            method: element.method,
            data: element.data,
            headers: {
            'isWorkFlow': true,
          },
           }).then((res)=>{
              resolve(res)
           }).catch(()=>{
             resolve(false)
           });
        })			
        promMethodList.push(promise)
      });
      if (promMethodList.length > 0) {
        let posts=await Promise.all(promMethodList)
        if(posts.includes(false)){
          this.$notify({
              title:this.$t('workFlow.createFLow.hintError'),
              message:this.$t('workFlow.createFLow.hintFormfailed'),
              type: "warning"
            });
            this.loading.close();
          return false
        }else{
          posts.forEach((res, index) => {
              if (res.data.success) {
                self.formData.keyValue.push({
                  F_Id: self.Ids[index] == "" ? res.data.data : self.Ids[index], // ????????????ID
                  F_FormId: self.formIdParams[index].F_FormId, // ????????????ID
                  F_Type: self.formIdParams[index].F_Type,
                  F_UrlAddress: self.formIdParams[index].F_Url
                });
              } 
            });
            if (self.formIdParams.length != self.formData.keyValue.length) {
                 self.$notify({
                  title:this.$t('workFlow.createFLow.hintError'),
                  message:this.$t('workFlow.createFLow.hintFormfailed'),
                  type: "warning"
                });
              self.loading.close();
              return false;
            }else{
                self.createFlow();
            }
        }
      }else{
         this.createFlow();
      }
    },
    // ????????????
    createFlow() {
      // ?????? ?????????????????? ??????
      let relationTaskList = this.RelationFlowTabs;
      if (this.RelationFlowTabs && this.RelationFlowTabs.length) {
        relationTaskList = this.RelationFlowTabs.filter(function(item) {
          return item.processInstanceId;
        });
      }
      let params = {
        F_Id: this.nwfSchemeInfoId,
        relationTaskList: JSON.stringify(relationTaskList), // ????????????????????????
        keyValue: JSON.stringify(this.formData.keyValue), // ???????????? ( ????????????ID ,????????????ID )
        userJson: JSON.stringify(this.formData.userJson)
      };
	  if(this.CurrentModule=='CompletedTask'||this.CurrentModule=='MyProcess'){
		  if(this.buttonType=='retract'){
			  recallProcess({
				processInstanceId:this.processInstanceId,
				taskId:''
			  }).then(res=>{
				if(res?.data?.success){
					this.$notify({
					  title:this.$t('deletePrompt.successTitle'),
					  message: this.$t('withdrawalSuccessfulRe-initiated'),
					  type: "success"
					});
					this.$emit('closeDialog')
				}else{
					this.$notify({
					  title:this.$t('deletePrompt.failureTitle'),
					  message: this.$t('withdrawalFailed'),
					  type: "warning"
					});
				}
				this.loading.close();
			  }).catch(error => {
				  this.$notify({
					title: this.$t('workFlow.createFLow.hintError'),
					message:this.$t('workFlow.createFLow.hintAbnormal'),
					type: "warning"
				  });
				  this.loading.close();
				});
			}else{
				this.postCreateProcessFunc(params)
			}
	  }else{
		  this.postCreateProcessFunc(params)
	  }
    },
	postCreateProcessFunc(params){
		postCreateProcess(params)
		.then(result => {
		  let res = result.data;

		  if (res.success) {
			if (res.data&&res.data.retCode&&res.data.retCode == 2) {
			  //?????????????????? ????????????
			  this.nextNodeDialogVisible = true;
			  this.candidateInfo = (res.data&&res.data.CandidateInfo)?res.data.CandidateInfo:[];
			} else {
			  //??????????????????
			   if (res.data.retCode == 0&&res.data.scripttext) {
				eval(res.data.scripttext);
			  }
			  //??????????????????
			  this.finalSubmit();
			}
			this.loading.close();
		  } else {
			this.$notify({
			  title:this.$t('workFlow.createFLow.hintError'),
			  message: this.$t('deletePrompt.failureTitle'),
			  type: "warning"
			});
		  }
		})
		.catch(error => {
		  this.$notify({
			title: this.$t('workFlow.createFLow.hintError'),
			message:this.$t('workFlow.createFLow.hintAbnormal'),
			type: "warning"
		  });
		  this.loading.close();
		});
	},
    async confirmMemberDialog(memberList) {
      if (memberList.length > 0) {
        this.nextNodeDialogVisible = false;
        try {
           this.loading = this.$loading({
          lock: true,
          text:this.$t('workFlow.createFLow.hintSubmit'),
          spinner: "el-icon-loading",
          background: "rgba(255, 255, 255, 0.7)"
        });
         await postAgainCandidate(memberList);
         this.finalSubmit();
         this.loading.close();
        } catch (error) {
          this.loading.close();
        }
      } else {
        this.$notify({
          title:this.$t('workFlow.createFLow.hintError'),
          message:this.$t('workFlow.createFLow.hintSelectHandler'),
          type: "warning"
        });
        this.loading.close();
      }
    },
    async finalSubmit() {
      try {
        if(this.CurrentModule=='Drafts'&&this.draftId){//???????????????
          await deleteDrafts(this.draftId);
        }
		if(this.CurrentModule=='MyProcess'){//????????????
		  await suspendProcess(this.processInstanceId);
		}
      } catch (error) {
        
      }

      this.nextNodeDialogVisible = false;
      this.$notify({
        title:this.$t('workFlow.createFLow.hintLaunchFlow'),
        message:this.$t('deletePrompt.successTitle'),
        type: "success"
      });
      //?????????????????????
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      this.$emit("closeDialog");
    },
    //????????????
    async saveDraft(){
      
      this.loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.createFLow.hintSaveDraft'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      if(this.currentActiveName){
         await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName);
      }
      let params = {F_SchemeinfoId:'',F_Id:'',data:[]};
      params.F_Id = this.draftId;
      params.F_SchemeinfoId = this.nwfSchemeInfoId;
      if(this.formReturnData.length>0){
        this.formReturnData.forEach(ele => {
          if(ele.returnData&&JSON.stringify(ele.returnData.draftList)!='{}'){
            params.data.push(ele.returnData.draftList);
          }
        });
      }
      try {
        let res = await postSaveDrafts(params);
        if(res&&res.data&&res.data.success){
          this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('workFlow.createFLow.hintSaveSuccess'),
              type: "success"
            });
          this.loading.close();
          this.$emit("closeDialog");
        }else{
          this.$notify({
            title:this.$t('workFlow.createFLow.hintError'),
            message:this.$t('workFlow.createFLow.hintSaveFailed'),
            type: "warning"
          });
        this.loading.close();
        }
      } catch (error) {
        this.$notify({
            title:this.$t('workFlow.createFLow.hintError'),
            message:this.$t('workFlow.createFLow.hintSaveFailed'),
            type: "warning"
          });
        this.loading.close();
      }
    },
  }
};
</script>

<style scoped>
/* ???????????? */
.box {
  display: flex;
  height: 100%;
}
.panel-left {
  display: flex;
  flex: 1;
  height: 100%;
  width: 10%; /* ??????????????????????????????el-tabs?????????????????????????????? */
}
.panel-right {
  width: 480px;
  height: 100%;
}

/* ??????????????? */
.el-tabs.el-tabs--top {
  width: 100%;
  height: 100%;
}

/* ?????????????????? */
.customLeftTab {
  margin-top: 1px;
  width: 100%;
}
.customLeftTab .el-tabs__nav-wrap::after {
  height: 1px;
}
.customLeftTab /deep/.el-tabs__content {
 height: calc(100% - 55px);
}
.customLeftTab /deep/.el-tabs__content>div{
	height: 100%;
	overflow-y: auto;
}
#pane-form{
	overflow: visible;
}
.work-flow-tabs /deep/.el-tabs__content{
	height: 100%;
	overflow-y: auto;
	box-sizing: border-box;
} 
.work-flow-tabs /deep/.el-tabs__content>div{
	overflow: visible;
}
/* ???????????????????????? */
.customCardTab .el-tabs__header {
  margin: 0; /* ????????????????????? */
}
.customCardTab .el-tabs__content {
  /* ?????????????????????????????? */
  border: 1px solid #e4e7ed;
  border-top: none;
  height: calc(100% - 40px);
}
.customCardTab .el-tab-pane {
  padding: 10px;
}
@media screen and (max-width: 1370px) {
	div /deep/ .panel-right{
	   width: 200px;
	 }
	.work-flow-tabs{
		padding:20px 0px 0px 10px!important;
	}
	
	} 	
</style>
<style lang="scss" scoped>
.roams-box {
  margin: 0 100px;
  display: flex;
  .card {
    flex-basis: 40%;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 80px;
    background-color: #f5f5f5;
    border-radius: 10px;
    margin: 0 20px;
    padding: 20px;
  }
  .icon {
    flex-basis: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .time {
    flex-basis: 40%;
    display: flex;
    align-items: center;
    color: #1ab394;
    margin: 0 20px;
    padding: 20px;
  }
  .flex-start {
    justify-content: flex-start;
  }
  .flex-end {
    justify-content: flex-end;
  }
  .left::before {
    content: "";
    position: absolute;
    /* top: 16px; */
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid #f5f5f5;
  }
  .right::before {
    content: "";
    position: absolute;
    /* top: 16px; */
    left: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-left: 7px solid #f5f5f5;
  }
}
.mt-20 {
  margin-top: 20px;
}

.el-button--primary {
  width: 100%;
  margin-top: 40px;
}
.work-flow-tabs {
  padding: 20px 10px;
  height: 90vh;
  box-sizing: border-box;
  .el-tabs__header {
    height: 90vh;
  }
}
@media screen and (max-width: 1370px) {
	   .work-flow-tabs{
		height: 83vh;
	   }   
	} 
.badge-dot{
	height: 8px;
	width: 8px;
	margin-right: 5px;
	border-radius: 50%;
	background-color: #F56C6C;
	display: inline-block;
	font-size: 12px;
	vertical-align: middle;
}
.draft-button{
  width: 100%;
  margin: 0;
  margin-top: 20px;
}
</style>
