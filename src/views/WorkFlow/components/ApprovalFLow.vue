<template>
  <div class="box" v-if="isLoaded">
    <div class="panel-left">
      <PrintCurrentPage v-if="showPrintBox" :printIndex="printIndex" :processInfo="processInfo" @getFormData="getFormData" @updateForm="updateForm"></PrintCurrentPage>
      <ShrinkArea position="left" @change="shrinkLeft" v-show="flowTabsActiveName==='form' && showBadgeBox"></ShrinkArea>
      <elTabs
        tab-position="top"
        class="customLeftTab"
        v-model="flowTabsActiveName"
        :before-leave="flowTabsClick"
      >
        <el-tab-pane :label="$t('workFlow.createFLow.labelFormInfor')" name="form">
          <el-tabs
            class="work-flow-tabs"
            tab-position="left"
            v-model="activeName"
            :before-leave="tabBeforeLeave"
             v-if="showBadgeBox"
            :style="{'padding-left': isShowLeftText ? '20px' : '0'}"
          >
            <el-tab-pane
              v-for="(item, index) in processInfo.formFieldInfo"
              :key="index"
              :label="item.F_Name"
              :name="'parsers-' + index"
            >
            <span slot="label" v-if="isShowLeftText"><i v-if="!formInfoList[index].valid" class="badge-dot"></i>{{item.F_Name}}</span>
               <el-tooltip v-else slot="label" effect="dark" :content="item.F_Name" placement="bottom-start">
                 <span> <i v-if="!formInfoList[index].valid" class="badge-dot" style="vertical-align:top;"></i><i class="fa fa-list-alt"></i></span>
              </el-tooltip>
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
                :taskComment="processInfo.task_comment[index]"
                  :eventData="processInfo.eventData[index]"
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
                 :parameter="processInfo.forms_info[index].parameter"
                :taskComment="processInfo.task_comment[index]"
                :ref="'parsers-' + index"
              ></SystemFormParser>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelFlowInfor')" name="infos">
          <!-- <Info :imgUrl="processInfo.infos"></Info> -->
		  <BpmnView v-if="flowTabsActiveName=='infos'" :deploymentId="deploymentId" :processInstanceId="processInstanceId"></BpmnView>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelCirRecord')" name="roams">
          <Roams  v-if="flowTabsActiveName=='roams'" :processInstanceId="processInstanceId" ></Roams>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelAnnexSum')" name="files">
          <Files  v-if="flowTabsActiveName=='files'"  :fileList="processInfo.files"></Files>
        </el-tab-pane>

        <template v-if="RelationFlowTabs.length > 0">
          <el-tab-pane
            v-for="(item, index) in RelationFlowTabs"
            :label="
              item.processInstanceName
                ? item.processInstanceName
                : '????????????' + (index + 1)
            "
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
    <div class="panel-right" ref="right">
      <el-tabs type="card" class="customCardTab" v-model="customActiveName">
        <el-tab-pane :label="$t('workFlow.approvalFLow.labelApprovalInfor')" name="approval">
          <div  v-show="isShowRightCon1">
            <LaunchInfo :infoList="infoList"></LaunchInfo>
          <el-form ref="form" label-width="80px" :model="formData">
            <Approval
              :processInfo="processInfo"
              :formData.sync="formData"
            ></Approval>
            <el-form-item :label="$t('workFlow.approvalFLow.labelDigitalStamp')" v-if="hasEsignature" prop="esignature" :rules="processInfo.nodeInfo.needpassword ? rules.esignature : []">
              <Stamps :formData.sync="formData"></Stamps>
            </el-form-item>

            <el-form-item
              v-if="processInfo.nodeInfo.needpassword && hasEsignature"
              :label="$t('workFlow.approvalFLow.labelStampPassword')"
              prop="esignature_pwd"
              style="margin-top:20px"
              :rules="rules.esignature_pwd"
            >
              <el-input
                v-model="formData.esignature_pwd"
                :placeholder="$t('workFlow.approvalFLow.placeholderStamp')"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitApproval"
                >{{$t('buttonModule.modalSureBtn')}}</el-button
              >
            </el-form-item>
            <el-form-item><TransferBox  v-if="showTransferBox" :taskId="taskId" @transferSuccess="transferSuccess"></TransferBox></el-form-item>
            <Signation
              v-if="processInfo.signation"
              :processInstanceId="processInstanceId"
              :taskId="taskId"
            ></Signation>
          </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.approvalFLow.labelCircInfor')" name="forwarder">
         <div v-show="isShowRightCon2">
           <Circulate
            :processInfo="processInfo"
            :formData.sync="formData"
          ></Circulate>
         </div>
        </el-tab-pane>
      </el-tabs>
      <ShrinkArea position="right" @change="shrinkRight"></ShrinkArea>
    </div>
    <NextNodeApprovedBy
      v-if="nextNodeDialogVisible"
      :candidateInfo="candidateInfo"
      @submit="confirmMemberDialog"
      @close="closeNextDialog"
    ></NextNodeApprovedBy>
    
  </div>
</template>

<script>
import WorkFlowFormParser from "@/components/codeParser/WorkFlowFormParser";
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue"; //????????????????????????
import ShrinkArea from "@/components/workflow/ShrinkArea.vue"; //?????????????????????
import Info from "./flow/Info";
import Roams from "./flow/Roams";
import Files from "./flow/Files";
import Stamps from "./flow/Stamps";
import RelationTabs from "./flow/RelationTabs";
import Approval from "./flow/Approval";
import Circulate from "./flow/Circulate";
import Signation from "./flow/Signation";
import LaunchInfo from "./flow/LaunchInfo";
import NextNodeApprovedBy from "./flow/NextNodeApprovedBy/Index";
import PrintCurrentPage from "./flow/PrintCurrentPage";
import TransferBox from "./flow/TransferBox";
import BpmnView from './BpmnView.vue';
import request from "@/router/axios";
import workflowFormMixin from "./workflowFormMixin";
import {
  getTaskForm,
  getManualInfo,
  getValidateSignation,
  getNodeInfo,
  postTaskHandle,
	getAnnexInfo
} from "@/api/workFlow/WFLaunch";
import {
  postAgainCandidate
} from "@/api/workFlow/WFProcess";
export default {
  mixins:[workflowFormMixin],
  props: {
    // ????????????ID
    processInstanceId: {
      type: String,
      default: null
    },
    deploymentId: {
      type: String,
      default: null
    },
    //??????id
    taskId: {
      type: String,
      default: null
    },
    infoList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nwfRelationId: {
      type: String,
      default: null
    }
  },
  components: {
    WorkFlowFormParser,
    SystemFormParser,
    ShrinkArea,
    Info,
    Roams,
    Files,
    Stamps,
    RelationTabs,
    Approval,
    Circulate,
    Signation,
    LaunchInfo,
    NextNodeApprovedBy,
    PrintCurrentPage,
    TransferBox,
	BpmnView
  },
  data() {
    return {
      flowTabsActiveName: "form",
      activeName: "parsers-0",
      currentActiveName: "parsers-0",
      customActiveName:'approval',
      promiseList: [],
      Ids: [],
      formReturnData: [],
      formIdParams: [],
      formPrimaryKey: [],
      primaryKey: "",
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
        functionBtnInfo:{},//????????????
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
        rejectNodeId: null, // ?????????????????????
        relationTaskList: [], // ??????????????????
        keyValue: [], // ???????????? ( ????????????ID ,????????????ID )
        formValue: [], // ???????????? (?????????????????????)
        fileValue: [] // ???????????? ?????????????????????????????????????????????????????????????????????
      },
      nextNodeDialogVisible: false,
      nextNodeScripttext:"",
      nextNodeBtnScripttext:"",
      candidateInfo:[],
      hasEsignature: false,
      printIndex:0,
      showBadgeBox: true,
      isShowLeftText: true,
      isShowRightCon1: true,
      isShowRightCon2: true,
      rules: {
        esignature: [{ required: true, message: '?????????????????????', trigger: 'change' }],
        esignature_pwd:[{ required: true, message: '???????????????????????????', trigger: 'blur' }],
      },
    };
  },
  computed: {
    showPrintBox() {
      if(this.processInfo&&this.processInfo.functionBtnInfo&&this.processInfo.functionBtnInfo['printing_']){
         return this.flowTabsActiveName=='form' 
      }else{
        return false;
      }
    },
    showTransferBox(){
      if(this.processInfo&&this.processInfo.functionBtnInfo&&this.processInfo.functionBtnInfo['transfer_']){
         return this.flowTabsActiveName=='form' 
      }else{
        return false;
      }
    }
  },
  async created() {
    this.loading = this.$loading({
      lock: true,
      text: this.$t('workFlow.createFLow.hintLoading'),
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)"
    });	
    try {
      await this.ReviewFlow();
			this.getFileList()
      this.loading.close();
    } catch (error) {
      this.loading.close();
    }
  },
  methods: {
    async submitFormData(){
       await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName);
    },
    getFormData(){
       this.submitFormData();
       this.showBadgeBox = false;
    },
    updateForm(){
      this.showBadgeBox = true;
    },
    transferSuccess(){
      this.$emit("closeDialog");
    },
		getFileList(){
			getAnnexInfo({
				taskId: this.taskId,
				processInstanceId: this.processInstanceId,
			}).then((res)=>{
				this.processInfo.files=res.data.data||[]
			})
		},
    async ReviewFlow() {
      try {
        let formResult = await getTaskForm({
          taskId: this.taskId,
          nwfRelationId: this.nwfRelationId
        });
        let formRes = formResult.data;
        if (formRes.success) {
          const data = formRes.data.filter(item => {
            return !this.delEmptyForm(item.formFieldInfo)
          })
          this.changeData(data);
        } else {
          this.$alert(formRes.msg, this.$t('workFlow.createFLow.hintInfor'), {
            confirmButtonText: this.$t('buttonModule.modalSureBtn'),
            showClose: false,
            callback: action => {
              this.loading.close();
              //???????????????????????????
              let bodyClass = document.body.className.split(" ");
              bodyClass.filter((item, idx) => {
                return item == "original" && bodyClass.splice(idx, 1);
              });
              document.body.className = bodyClass.join(" ");
              this.$emit("closeDialog");
            }
          });
          this.loading.close();
          return false;
        }
        if (this.processInfo.forms_info.length > 0) {
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
        this.isLoaded = true;
        this.loading.close();
        // ???????????????????????????????????????????????????????????????????????????
        let nodeResult = await getNodeInfo({
          processInstanceId: this.processInstanceId
        });
        if (nodeResult && nodeResult.data && nodeResult.data.success) {
          this.processInfo.btnInfo = nodeResult.data.data.btnInfo;
          this.processInfo.functionBtnInfo = nodeResult.data.data.functionBtnInfo;
          if (nodeResult.data.data.approvalcomponents) {
             this.hasEsignature = (
              nodeResult.data.data.approvalcomponents&&
              nodeResult.data.data.approvalcomponents.relationformem==1
             )?true:false;
            let needpassword =
              nodeResult.data.data.approvalcomponents.needpassword;
            this.processInfo.nodeInfo = {
              esignature: "",
              needpassword: needpassword == 2 ? true : false
            };
          } else {
            this.processInfo.nodeInfo = { esignature: "", needpassword: false };
          }
          this.processInfo.rejectnode = nodeResult.data.data.retNodeList
            ? nodeResult.data.data.retNodeList
            : [];
        }
        // ???????????????????????????
        let signationResult = await getValidateSignation({
          taskId: this.taskId
        });
        if (
          signationResult &&
          signationResult.data &&
          signationResult.data.success &&
          signationResult.data.data
        ) {
          this.processInfo.signation = true; // ?????? ??????????????? ??????
        }
        // ??????????????????????????????
        let manualInfoResult = await getManualInfo({
          taskId: this.taskId,
          processInstanceId: this.processInstanceId
        });
        if (
          manualInfoResult &&
          manualInfoResult.data &&
          manualInfoResult.data.success
        ) {
          this.processInfo.forwarderList = manualInfoResult.data.data; // ?????????????????????
        }
      } catch (error) {}
      
    },

    changeData(data) {
      if (!data) return;
      let self = this;
      let forms = [];
      let forms_data = [];
      let forms_info = [];
      let formFieldInfo = [];
      let subs = null;
      let task_comment = [];
      let RelationFlowTabs = [];
      let formPrimaryKey = [];
      let eventData = [];
      data.forEach(function(value, index) {
        formPrimaryKey.push(value.primaryKey ? value.primaryKey : "");
        let tempFormData = value.F_Scheme ? value.F_Scheme.data : {};
        forms.push(tempFormData); //??????????????????
        eventData.push(value.F_Scheme ? (value.F_Scheme.eventData?value.F_Scheme.eventData:[]) : []); //????????????
        forms_data.push(value.formData ? value.formData : {}); //??????????????????
        if (value.relationTaskList && value.relationTaskList.length > 0) {
          RelationFlowTabs = value.relationTaskList;
        }
        task_comment.push(value.taskComment);
        forms_info.push(value); // ????????????
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
          valid: false
        };
        this.formInfoList.push(temp);
      });

      this.processInfo.forms = forms;
      this.processInfo.forms_data = forms_data;
      this.processInfo.forms_info = forms_info;
      this.processInfo.formFieldInfo = formFieldInfo;
      this.processInfo.subs = subs;
      this.processInfo.task_comment = task_comment;
      this.RelationFlowTabs = RelationFlowTabs;
      this.formPrimaryKey = formPrimaryKey;
      this.processInfo.eventData = eventData;
    },

    async submitApproval() {
      this.loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.createFLow.hintSubmit'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      await this.submitAllForm();
      
    },
    async submitAllForm() {
      if(this.formData.btnValue=='reject_'||this.formData.btnValue=='finish_'){
          this.approvalFlow();
          return ;
      }
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
			for(let element of this.promiseList){
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
      };
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
                self.approvalFlow();
            }
        }
      }else{
         this.approvalFlow();
      }
    },
    // ????????????
    async approvalFlow() {
      if (this.formData.btnValue == "reject_") {
        if (!this.formData.rejectNodeId) {
          this.loading.close();
          this.$notify({
            title:this.$t('workFlow.createFLow.hintError'),
            message:this.$t('workFlow.approvalFLow.hintReject'),
            type: "warning"
          });
          return false;
        }
      }
      try {
        this.$refs.form.validate(async valid => {
          if (!valid) {
            this.loading.close()
            return
          } 
          let result = await postTaskHandle({
            taskId: this.taskId, //??????????????????????????????????????????????????????????????????????????????taskId???????????????????????????ID
            btnValue: this.formData.btnValue, // ????????????
            message: this.formData.message, // ????????????
            esignature: this.formData.esignature, // ????????????
            esignature_pwd: this.formData.esignature_pwd, // ????????????
            forwarderList: JSON.stringify(this.formData.forwarderList), //???????????????
            formValue: JSON.stringify(this.formData.formValue),
            keyValue: JSON.stringify(this.formData.keyValue),
            rejectNodeId:
              this.formData.btnValue == "reject_" 
                ? this.formData.rejectNodeId
                : null, // ?????????????????????
            userJson: JSON.stringify(this.formData.userJson), // ?????????????????????
            fileValue:this.formData.fileValue
          });
          var res = result.data;
          if (res.success) {
            if (res.data.retCode == 2) {
              //?????????????????? ????????????
              this.loading.close();
              //?????????????????? ????????????
              this.nextNodeDialogVisible = true;
              this.nextNodeScripttext  = "";
              this.candidateInfo = (res.data&&res.data.CandidateInfo)?res.data.CandidateInfo:[];
              //????????????
              if (res.data.retCode == 0&&res.data.btnscripttext&&res.data.btnscripttext.Jstext) {
                this.nextNodeBtnScripttext = res.data.btnscripttext.Jstext;
              }
              //??????????????????
              if(res.data.scripttext&&res.data.scripttext.Jstext){
                this.nextNodeScripttext = res.data.scripttext.Jstext;
              }
            } else if (res.data.retCode == 1) {
              //??????????????????
              this.$notify({
                title:this.$t('workFlow.createFLow.hintError'),
                message:this.$t('workFlow.approvalFLow.hintWrongPassword'),
                type: "warning"
              });
              this.loading.close();
            } else {
              //????????????
              if (res.data.retCode == 0&&res.data.btnscripttext&&res.data.btnscripttext.Jstext) {
                eval(res.data.btnscripttext.Jstext);
              }
              //??????????????????
              if (res.data.retCode == 0&&res.data.scripttext&&res.data.scripttext.Jstext) {
                eval(res.data.scripttext.Jstext);
              }
              //??????????????????
              this.finalSubmit();
            }
          } else {
            this.$notify({
              title:this.$t('workFlow.createFLow.hintError') + res.code,
              message: res.msg,
              type: "warning"
            });
            this.loading.close();
          }
      })
        
      } catch (error) {
        this.$notify({
          title:this.$t('workFlow.createFLow.hintError'),
          message:this.$t('workFlow.createFLow.hintAbnormal'),
          type: "warning"
        });
        this.loading.close();
      }
    },
    closeNextDialog(){
      this.nextNodeDialogVisible = false;
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
         if(this.nextNodeBtnScripttext){
            eval(this.nextNodeBtnScripttext);
         }
         if(this.nextNodeScripttext){
            eval(this.nextNodeScripttext);
          }
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
      await this.submitFormEvents();
      this.loading.close();
      this.nextNodeDialogVisible = false;
      this.$notify({
        title: this.$t('deletePrompt.successTitle'),
        message:this.$t('workFlow.approvalFLow.hintApprovedSuccess'),
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
    shrinkLeft(val) {
      this.isShowLeftText = !val
    },
    shrinkRight(val) {
      this.$refs.right.style.width = val ? '140px' : '480px'
      this.isShowRightCon1 = !val
      this.isShowRightCon2 = !val
    
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
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;
  width: 10%; /* ??????????????????????????????el-tabs?????????????????????????????? */
}
.panel-right {
  display: flex;
  width: 480px;
  height: 100%;
}
@media screen and (max-width: 1500px) {
	.panel-right {
	  width: 325px;
	}
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
.customLeftTab /deep/.el-tabs__content > div {
  height: 100%;
  overflow-y: auto;
}
#pane-form {
  overflow: visible;
}
.work-flow-tabs /deep/.el-tabs__content {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.fa-list-alt{
  font-size: 22px;
  color: #a4adbf;
}
.el-tabs__item.is-active .fa-list-alt,.fa-list-alt:hover {
    color: #409EFF !important;
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
div /deep/ .el-table--border th{
	border-bottom: 1px solid #EBEEF5;
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
  margin-top: 20px;
}
.work-flow-tabs {
 height: 88vh;
  padding: 0 20px;
  .el-tabs__header {
    height: 88vh;
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
</style>
