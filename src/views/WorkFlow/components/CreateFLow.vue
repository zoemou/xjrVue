<template>
  <div class="box" v-if="isLoaded">
    <div class="panel-left">
     <ShrinkArea position="left" @change="shrinkLeft" v-show="flowTabsActiveName==='form'" ></ShrinkArea>
      <elTabs tab-position="top" class="customLeftTab"  v-model="flowTabsActiveName"   :before-leave="flowTabsClick">
        <el-tab-pane :label="$t('workFlow.createFLow.labelFormInfor')"  name="form">
          <el-tabs
            class="work-flow-tabs"
            tab-position="left"
            v-model="activeName"
            :before-leave="tabBeforeLeave"
            :style="{'padding-left': isShowLeftText ? '20px' : '0'}"
          >
            <el-tab-pane
              v-for="(item, index) in processInfo.formFieldInfo"
              :key="index"
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
                :parameter="processInfo.forms_info[index].parameter"
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
            :label="item.processInstanceName?item.processInstanceName:'前置任务'+(index+1)"
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
          <el-tabs type="card" class="customCardTab" >
            <el-tab-pane 
            :label="PrepositionTaskList.length > 0 ? $t('workFlow.createFLow.titleAssocTasks') : $t('workFlow.createFLow.titleLaunch')"
            v-show="isShowRightCon"
            >
              <LaunchInfo :infoList="infoList"></LaunchInfo>
              <!-- 关联前置任务 -->
              <PrepositionTask
                v-if="PrepositionTaskList.length > 0"
                :PrepositionTask.sync="PrepositionTaskList"
                @changeRelationTabs="changeRelationTabs"
              ></PrepositionTask>

              <el-button type="primary" @click="submitCreateProcess"
                >{{$t('workFlow.createFLow.submitBtn')}}</el-button
              >
              <el-button class="draft-button" @click="saveDraft">{{$t('workFlow.createFLow.saveDraftBtn')}}</el-button>          
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
import WorkFlowFormParser from "@/components/codeParser/WorkFlowFormParser.vue"; //导入解析组件
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue"; //导入系统表单组件
import ShrinkArea from "@/components/workflow/ShrinkArea.vue"; //导入可伸缩组件
import Info from "./flow/Info";
import Roams from "./flow/Roams";
import Files from "./flow/Files";
import PrepositionTask from "./flow/PrepositionTask";
import RelationTabs from "./flow/RelationTabs";
import LaunchInfo from "./flow/LaunchInfo";
import workflowFormMixin from "./workflowFormMixin";
import NextNodeApprovedBy from "./flow/NextNodeApprovedBy/Index";
import BpmnView from './BpmnView.vue';
import {
  postCreateProcessform,
  postCreateProcess
} from "@/api/workFlow/WFLaunch";
import {
  postSaveDrafts,
  postAgainCandidate
} from "@/api/workFlow/WFProcess";
import request from "@/router/axios";

export default {
  mixins:[workflowFormMixin],
  props: {
     nwfRelationId: {
      type: String,
      default: ""
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
    processInfoFormsData :{
      type: Object,
      default: () => {
        return {};
      }
    },
	deploymentId: {
      type: String,
      default: ""
    }
  },
  components: {
    WorkFlowFormParser,
    SystemFormParser,
    ShrinkArea,
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
        forms: null, // 表单
        infos: null, // 图片
        roams: [], // 流转
        files: [], // 附件
        subs: [], // 子流程
        roams: [],
        btnInfo: {}, // 按钮信息
        nodeInfo: {}, // 审批节点 关联意见框、电子签章密码等
        myStamps: [], // 我的签章列表
        forms_data: [], // 表单数据
        signation: false, //加签或减签(用于显示 加签或减签 按扭)
        forwarderList: [], //原有传阅人列表
        rejectnode: [], // 已流转过的节点用于驳回选择
        task_comment: [] //关联意见框 审批意见
      },
      formData: {
        btnValue: "agree_", // 审批结果 按扭值 (默认同意)
        message: "", // 审批意见
        esignature: "", // 电子签章
        esignature_pwd: null, // 签章密码
        forwarderList: [], // 新的传阅人列表 formData.forwarderList
        userJson: [], // 下一节点审批人
        rejectnode: null, // 驳回至指定节点
        relationTaskList: [], // 关联前置任务
        keyValue: [], // 表单信息 ( 表单实例ID ,表单设计ID )
        formValue: [], // 表单数据 (表单的实例数据)
        fileValue: [] // 附件汇总 就是从表单设计配置里拿到所有有关附件组件的字段
      },
      nextNodeDialogVisible: false,
      nextNodeScripttext:"",
      nextNodeBtnScripttext:"",
      candidateInfo: [],
      isShowRightCon: true,
      isShowLeftText:true
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
    async createProcess() {
      let self = this;
      try {
        let res = await postCreateProcessform({
          id: this.nwfSchemeInfoId,
          nwfRelationId: this.nwfRelationId
        });
        let processRes = res.data;
        if (processRes.success) {
          if (processRes.msg) {
            this.$message({
              title: this.$t('workFlow.createFLow.hintError'),
              message: this.$t(processRes.msg),
              type: "error"
            });
          }
          const data = processRes.data.filter(item => {
            return !this.delEmptyForm(item.formFieldInfo)
          })
          this.changeData(data);
          if (this.processInfo.forms_info && this.processInfo.forms_info.length > 0) {
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
          this.PrepositionTaskList = (processRes && processRes.data && processRes.data.length > 0) ?
            processRes.data[0].relevanceTask.tableData : [];
          this.isLoaded = true;
        }
      } catch (error) {
        self.loading.close();
        //issue # 1459 屏蔽消息
        // self.$alert(this.$t('开始事件未绑定表单！'), this.$t('workFlow.createFLow.hintInfor'), {
        //   confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        //   showClose: false,
        //   callback: action => {
        //     self.$emit("closeDialog");
        //   }
        // });
      }
    },
    changeData(data) {
      if (!data) return;
      let hasProcessInfoFormsData = false;
      if (this.processInfoFormsData && JSON.stringify(this.processInfoFormsData) != "{}") {
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
      let eventData = [];
      data.forEach(function (value, index) {
        let primaryKey = "";
        primaryKey = value.primaryKey ? value.primaryKey : "";
        let tempFormData = value.F_Scheme ? value.F_Scheme.data : {};
        form.push(tempFormData); //表单组件配置
        eventData.push(value.F_Scheme ? (value.F_Scheme.eventData ? value.F_Scheme.eventData : []) : []); //表单事件
        if (hasProcessInfoFormsData) {// 是否 表单发起审批
          let formId = "";
          if (value.SchemeInfo.F_Id) {
            formId = value.SchemeInfo.F_Id;
          }
          if (formId && self.processInfoFormsData[formId]) {
            primaryKey = self.processInfoFormsData[formId].rowId;
            value.formData = self.processInfoFormsData[formId].formData;
          }
        }
        formPrimaryKey.push(primaryKey);
        form_data.push(value.formData ? value.formData : {}); //表单内容数据
        let taskComment = value.taskComment ? value.taskComment : {};
        task_comment.push(taskComment);
        form_info.push(value); // 表单信息
        if (value.annexInfo) {
          value.annexInfo.map(function (item) {
            files.push(item);
          });
        }

        if (value.formFieldInfo) {
          // const isDelete = self.delEmptyForm(value.formFieldInfo)
          // if (!isDelete) {
            formFieldInfo.push(value.formFieldInfo); //表单权限
          // }
        }

        // 如果有子流程那所有里的的一样
        if (value.subProcessInfo && value.subProcessInfo.length)
          subs = value.subProcessInfo; // 如果有子流程那所有里的的一样
      });
      //表单验证
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
      this.processInfo.eventData = eventData;
      this.formPrimaryKey = formPrimaryKey;
    },
    changeRelationTabs(data) {
      this.RelationFlowTabs = data;
    },
    async submitCreateProcess() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('workFlow.createFLow.hintSubmit'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      await this.submitAllForm();
    },
    async submitAllForm() {
      if (this.currentActiveName) {
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
          title: this.$t('workFlow.createFLow.hintError'),
          message: this.$t('workFlow.createFLow.hintCheckForm'),
          type: "warning"
        });
        self.loading.close();
        return false;
      }
      let promMethodList = [];
      this.promiseList.forEach(element => {
        const promise = new Promise((resolve, reject) => {
          request({
            url: element.url,
            method: element.method,
            data: element.data,
            headers: {
              'isWorkFlow': true,
            },
          }).then((res) => {
            resolve(res)
          }).catch(() => {
            resolve(false)
          });
        })
        promMethodList.push(promise)
      });
      if (promMethodList.length > 0) {
        let posts = await Promise.all(promMethodList)
        if (posts.includes(false)) {
          this.$notify({
            title: this.$t('workFlow.createFLow.hintError'),
            message: this.$t('workFlow.createFLow.hintFormfailed'),
            type: "warning"
          });
          this.loading.close();
          return false
        } else {
          posts.forEach((res, index) => {
            if (res.data.success) {
              self.formData.keyValue.push({
                F_Id: self.Ids[index] == "" ? res.data.data : self.Ids[index], // 表单实例ID
                F_FormId: self.formIdParams[index].F_FormId, // 表单设计ID
                F_Type: self.formIdParams[index].F_Type,
                F_UrlAddress: self.formIdParams[index].F_Url
              });
            }
          });
          if (self.formIdParams.length != self.formData.keyValue.length) {
            self.$notify({
              title: this.$t('workFlow.createFLow.hintError'),
              message: this.$t('workFlow.createFLow.hintFormfailed'),
              type: "warning"
            });
            self.loading.close();
            return false;
          } else {
            self.createFlow();
          }
        }
      } else {
        this.createFlow();
      }
    },
    // 发起流程
    async createFlow() {
      // 清洗 关联前置任务 数据
      let relationTaskList = this.RelationFlowTabs;
      if (this.RelationFlowTabs && this.RelationFlowTabs.length) {
        relationTaskList = this.RelationFlowTabs.filter(function (item) {
          return item.processInstanceId;
        });
      }
      let params = {
        F_Id: this.nwfSchemeInfoId,
        relationTaskList: JSON.stringify(relationTaskList), // 关联前置任务数据
        keyValue: JSON.stringify(this.formData.keyValue), // 表单信息 ( 表单实例ID ,表单设计ID )
        userJson: JSON.stringify(this.formData.userJson),
        fileValue: this.formData.fileValue
      };
      try {
        let result = await postCreateProcess(params);
        let res = result.data;
        if (res.success) {
          if (res.data.retCode && res.data.retCode == 2) {
            //无对应处理人 情况处理
            this.nextNodeDialogVisible = true;
            this.candidateInfo = (res.data && res.data.CandidateInfo) ? res.data.CandidateInfo : [];
            //脚本直接执行
            if (res.data.scripttext && res.data.scripttext.Jstext) {
              this.nextNodeScripttext = res.data.scripttext.Jstext;
            }
            //按钮脚本
            if (res.data.retCode && res.data.retCode == 0 && res.data.btnscripttext && res.data.btnscripttext.Jstext) {
              this.nextNodeBtnScripttext = res.data.btnscripttext.Jstext;
            }
          } else {
            //按钮脚本
            if (res.data.retCode && res.data.retCode == 0 && res.data.btnscripttext && res.data.btnscripttext.Jstext) {
              eval(res.data.btnscripttext.Jstext);
            }
            //脚本直接执行
            if (res.data.retCode && res.data.retCode == 0 && res.data.scripttext && res.data.scripttext.Jstext) {
              eval(res.data.scripttext.Jstext);
            }
            //完成发起流程
            this.finalSubmit();
          }
          this.loading.close();
        } else {
          this.$notify({
            title: this.$t('workFlow.createFLow.hintError'),
            message: this.$t('deletePrompt.hintFailure'),
            type: "warning"
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t('workFlow.createFLow.hintError'),
          message: this.$t('workFlow.createFLow.hintAbnormal'),
          type: "warning"
        });
        this.loading.close();
      }
    },
    closeNextDialog() {
      this.nextNodeDialogVisible = false;
    },
    async confirmMemberDialog(memberList) {
      if (memberList.length > 0) {
        this.nextNodeDialogVisible = false;
        try {
          this.loading = this.$loading({
            lock: true,
            text: this.$t('workFlow.createFLow.hintSubmit'),
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.7)"
          });
          await postAgainCandidate(memberList);
          if (this.nextNodeBtnScripttext) {
            eval(this.nextNodeBtnScripttext);
          }
          if (this.nextNodeScripttext) {
            eval(this.nextNodeScripttext);
          }
          this.finalSubmit();
          this.loading.close();
        } catch (error) {
          this.loading.close();
        }

      } else {
        this.$notify({
          title: this.$t('workFlow.createFLow.hintError'),
          message: this.$t('workFlow.createFLow.hintSelectHandler'),
          type: "warning"
        });
        this.loading.close();
      }
    },
    async finalSubmit() {
      try {
        await this.submitFormEvents();
      } catch (error) {

      }

      this.nextNodeDialogVisible = false;
      this.$notify({
        title: this.$t('workFlow.createFLow.hintLaunchFlow'),
        message: this.$t('deletePrompt.hintSuccess'),
        type: "success"
      });
      //删除兼容样式类
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      this.$emit("closeDialog");
    },
    //保存草稿
    async saveDraft() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('workFlow.createFLow.hintSaveDraft'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      if (this.currentActiveName) {
        await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName,true);
      }
      let params = { F_SchemeinfoId: '', F_Id: '', F_DeploymentId: this.deploymentId, data: [] };
      params.F_SchemeinfoId = this.nwfSchemeInfoId;
      if (this.formReturnData.length > 0) {
        this.formReturnData.forEach(ele => {
          if (ele.returnData && JSON.stringify(ele.returnData.draftList) != '{}') {
            params.data.push(ele.returnData.draftList);
          }
        });
      }
      try {
        let res = await postSaveDrafts(params);
        if (res && res.data && res.data.success) {
          this.$notify({
            title: this.$t('deletePrompt.successTitle'),
            message: this.$t('workFlow.createFLow.hintSaveSuccess'),
            type: "success"
          });
          this.loading.close();
          this.$emit("closeDialog");
        } else {
          this.$notify({
            title: this.$t('workFlow.createFLow.hintError'),
            message: this.$t('workFlow.createFLow.hintSaveFailed'),
            type: "warning"
          });
          this.loading.close();
        }
      } catch (error) {
        this.$notify({
          title: this.$t('workFlow.createFLow.hintError'),
          message: this.$t('workFlow.createFLow.hintSaveFailed'),
          type: "warning"
        });
        this.loading.close();
      }

    },
    shrinkLeft(val) {
      this.isShowLeftText = !val
    },
    shrinkRight(val) {
      this.$refs.right.style.width = val ? '70px' : '480px'
      this.isShowRightCon = !val
    },
    }
  }
</script>

<style scoped>
/* 左右布局 */
.box {
  display: flex;
  height: 100%;
}
.panel-left {
  display: flex;
  flex: 1;
  height: 100%;
  width: 10%; /* 设置一个宽度不让内部el-tabs标签页撑破响应式布局 */
}
.panel-right {
  display: flex;
  width: 480px;
  height: 100%;
}

/* 选项卡样式 */
.el-tabs.el-tabs--top {
  width: 100%;
  height: 100%;
}

/* 左则主标签页 */
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
  margin-right: 4px;
}
/* 右则操作区标签页 */
.customCardTab .el-tabs__header {
  margin: 0; /* 标签栏不占空间 */
}
.customCardTab .el-tabs__content {
  /* 内容区添加线条和度度 */
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
.fa-list-alt{
  font-size: 22px;
  color: #a4adbf;
}
.el-tabs__item.is-active .fa-list-alt,.fa-list-alt:hover {
    color: #409EFF !important;
}
.el-button--primary {
  width: 100%;
  margin-top: 40px;
}
.work-flow-tabs {
 height: 86vh;
  padding: 0 20px;
  .el-tabs__header {
    height: 86vh;
  }
}
@media screen and (max-width: 1370px) {
	   .work-flow-tabs{
		height: 83vh;
	   }   
	} 
.draft-button{
  width: 100%;
  margin: 0;
  margin-top: 20px;
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
