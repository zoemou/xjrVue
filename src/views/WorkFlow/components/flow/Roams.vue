<template>
  <div v-loading="loading">
    <avue-empty :desc="$t('deletePrompt.noData')" v-if="roamsList.length == 0"></avue-empty>
    <div v-else class="mt-20">
      <el-button type="primary" size="small" style="z-index: 999;" @click="changeTask">{{taskText}}</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item, index) in roamsList" :key="index" :label="processName(item)" :name="item.processName + index"
          placement="top">
          <avue-empty :desc="$t('deletePrompt.noData')" v-if="item.taskList.length == 0"></avue-empty>
          <div v-else v-for="(roams, index2) in item.taskList" :key="index2" :timestamp="roams.time">
            <div class="roams-box" v-if="index2 % 2 == 0">
              <div class="card right">
                <span><b class="roams-title" v-show="getNodeTypeName(roams.activityType)"><a class="round-one round-three"></a>{{$t('workFlow.roams.nodeType')}}</b>{{ getNodeTypeName(roams.activityType) }}</span>
                <span><b class="roams-title"  v-show="getNodeTitle(roams)"><a class="round-one"></a>{{$t('workFlow.roams.nodeName')}}</b>{{ getNodeTitle(roams) }}</span>
                <span><b class="roams-title" v-show="getNodeMessage(roams)"><a class="round-one round-two"></a>{{$t('workFlow.roams.approvalInfor')}}</b></span>
                <span v-if="roams.multiInstance">{{$t('workFlow.roams.signApproval')}}</span>
                <span class="roams-text" v-show="getNodeMessage(roams)">{{ getNodeMessage(roams) }}</span>
                <span v-if="roams.manualinfos&&roams.manualinfos.length>0"><b class="roams-title"><a class="round-one round-three"></a>{{$t('workFlow.roams.circulator')}}</b></span>
                <span class="roams-text" v-if="roams.manualinfos&&roams.manualinfos.length>0">{{ getManualinfos(roams) }}</span>
                <span v-if="getOperationInformation(roams).length>0"><b class="roams-title"><a class="round-one round-two"></a>{{$t('operationInfor')}}</b></span>
                <div class="roams-text operation-box" v-if="getOperationInformation(roams).length>0">
                  <span class="text" v-for="(text, textIndex) in getOperationInformation(roams)"
                    :key="textIndex">{{text}}</span>
                </div>
              </div>
              <div class="icon">
                <div
                  class="el-timeline-item__node el-timeline-item__node--normal"
                ></div>
                <div class="el-timeline-item__tail"></div>
              </div>
              <div class="time flex-start">
                {{ roams.activityType === 'callActivity' ? roams.startTime : roams.time }}
              </div>
            </div>
            <div class="roams-box" v-else>
              <div class="time flex-end">
                {{ roams.activityType === 'callActivity' ? roams.startTime : roams.time }}
              </div>
              <div class="icon">
                <div
                  class="el-timeline-item__node el-timeline-item__node--normal"
                ></div>
                <div class="el-timeline-item__tail"></div>
              </div>
              <div class="card left">
                <span><b class="roams-title" v-show="getNodeTypeName(roams.activityType)"><a class="round-one round-three"></a>{{$t('workFlow.roams.nodeType')}}</b>{{ getNodeTypeName(roams.activityType) }}</span>
                <span><b class="roams-title" v-show="getNodeTitle(roams)"><a class="round-one"></a>{{$t('workFlow.roams.nodeName')}}</b>{{ getNodeTitle(roams) }}</span>
                <span><b class="roams-title" v-show="getNodeMessage(roams)"><a class="round-one round-two"></a>{{$t('workFlow.roams.approvalInfor')}}</b></span>
                <span v-if="roams.multiInstance">{{$t('workFlow.roams.signApproval')}}</span>
                <span class="roams-text" v-show="getNodeMessage(roams)">{{ getNodeMessage(roams) }}</span>
                <span v-if="roams.manualinfos&&roams.manualinfos.length>0"><b class="roams-title"><a class="round-one round-three"></a>{{$t('workFlow.roams.circulator')}}</b></span>
                <span class="roams-text" v-if="roams.manualinfos&&roams.manualinfos.length>0">{{ getManualinfos(roams) }}</span>
                <span v-if="getOperationInformation(roams).length>0"><b class="roams-title"><a class="round-one round-two"></a>{{$t('operationInfor')}}</b></span>
                <div class="roams-text operation-box" v-if="getOperationInformation(roams).length>0">
                  <span  v-for="(text, textIndex) in getOperationInformation(roams)"
                    :key="textIndex">{{text}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getHistoryTaskList
} from "@/api/workFlow/WFLaunch";
export default {
  props: {
    processInstanceId: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      roamsList: [],
      loading: false,
      isPersonalTask: false,
    }
  },
  computed: {
    taskText() {
      return this.isPersonalTask ? this.$t('viewAll'):this.$t('orgRoleManagement.databaseAuth.radioViewSelf')
    },
    activeName() {
      return this.roamsList.length ? `${this.roamsList[0].processName}0` : ''
    }
  },
  async created () {
     // 流转记录
    this.getHistoryTaskList()
  },
  methods: {
    getNodeTypeName(type) {
      let typeName = this.$t('workFlow.roams.otherNode');
      switch (type) {
        case "startEvent":
          typeName = this.$t('workFlow.roams.startNode');
          break;
        case "userTask":
          typeName = this.$t('workFlow.roams.userNode');
          break;
        case "scriptTask":
          typeName = this.$t('workFlow.roams.scriptNode');
          break;
        case "endEvent":
          typeName = this.$t('workFlow.roams.endNode');
          break;
        case "callActivity":
          typeName =this.$t('workFlow.roams.externalNode');
          break;
        case "suspend":
          typeName ="";
          break;
         case "activate":
          typeName ="";
          break;
        default:
          break;
      }
      return typeName;
    },
    getNodeTitle(item) {      
      return `${
        item.activityName
          ? item.activityName
          : this.getNodeTypeName(item.activityType)
      }`;
    },
    getNodeMessage(item) {
      let userName = '';
      if(item.activityType=="startEvent"||item.activityType == "againStart"){
        userName = item.startUserId
      }else{
        if(item.candidate){
            userName = item.candidate
        }
      }
      if (item.activityType == "startEvent") {
        return `【${userName}】`+ this.$t('workFlow.roams.createProcess');
      }else if(item.activityType == "againStart"){
		  return `【${userName}】`+ this.$t('workFlow.processTasks.reInitiate');
	  } else if (item.activityType == "scriptTask") {
        return '';
      } else if (item.activityType == "suspend") {
        return '';
      } else if (item.activityType == "activate") {
        return '';
      }else if (item.activityType == "endEvent") {
        return this.$t('workFlow.roams.approvalEnd');
      }else if(item.activityType === "callActivity" && !item.isRecall){
         userName = item.startUserId;
          return `【${userName}】`+ this.$t('workFlow.roams.createProcess');
      } else {
        if (item.endTime == null) {
          return `【${userName}】`+this.$t('workFlow.roams.approving');
        } else {
          if(item.btnValue==='结束'){
             return `【${userName}】【${item.btnValue}】`+ this.$t('workFlow.roams.approval');
          }
          //是否为会签
          const roamsApproval = item.btnValue === '撤回' ? '':`，${this.$t('approvalComments')}“${item.message?"【"+item.message+"】":''}”`
          if (item.multiInstance || (item.activityType === "callActivity" && item.isRecall)) {
            if (item.nextNodeInfo && item.nextNodeInfo.length > 0) {
              return `【${item.candidate}】【${item.btnValue}】 ${this.$t("workFlow.roams.approval")}${roamsApproval}，${this.$t("workFlow.roams.by")}【${
                item.activityName
                  ? item.activityName
                  : this.getNodeTitle(item)
              }】${this.$t("workFlow.roams.transferTo")}【${
                item.nextNodeInfo && item.nextNodeInfo.length > 0
                  ? item.nextNodeInfo[0].actName
                    ? item.nextNodeInfo[0].actName
                    : this.getNodeTitle(item.nextNodeInfo[0])
                  : ""
              }】`;
            } else {
              return `【${userName}】【${item.btnValue}】`+ this.$t('workFlow.roams.approval')+ roamsApproval;
            }
          } else {
            let nextNodeName = '';
            if(item.nextNodeInfo && item.nextNodeInfo.length > 0){
                item.nextNodeInfo.forEach(ele => {
                  if(ele.activityName){
                    nextNodeName += `【${ele.activityName}】`;
                  }else if(ele.activityType){
                    nextNodeName += `【${this.getNodeTitle(ele)}】`;
                  }
                });
            }
            return `【${userName}】【${item.btnValue}】${this.$t("workFlow.roams.approval")}${roamsApproval}，${this.$t("workFlow.roams.by")}【${
              item.activityName
                ? item.activityName
                : this.getNodeTitle(item)
            }】${this.$t("workFlow.roams.transferTo")}${nextNodeName}`;
          }
        }
      }
    },
    getOperationInformation(item) {
      let msgList = [];
      let userName = '';
      if(item.candidate){
        userName = item.candidate
      }
      if (item.activityType == "scriptTask") {
         msgList.push(item.scriptTexts);
      } else if (item.activityType == "suspend") {
        msgList.push(`【${userName}】${this.$t('by')}【${this.$t('processHang')}】${this.$t('suspendProcess')}`);
      } else if (item.activityType == "activate") {
         msgList.push(`【${userName}】${this.$t('by')}【${this.$t('hangBack')}】${this.$t('returnTheProcessApprovalState')}`);
      }else if (item.activityType == "userTask") {
        if(item.operationInformation&&item.operationInformation.length>0){
            for (let index = 0; index < item.operationInformation.length; index++) {
              const element = item.operationInformation[index];
              let info  = element.info;
              if(element.type=='transfer'){ //转办
                  msgList.push(`【${info.oldUserName}】${this.$t('will')}【${info.nodeName}】${this.$t('to')}【${info.newUserName}】${this.$t('transfer')}`);
              }else if(element.type=='assign'){ //指定审批人
                let userStr = (info.addAssigns&&info.addAssigns.length>0)?info.addAssigns.join(','):"";
                 msgList.push(`【${info.currentUserName}】${this.$t('by')}【${this.$t('workFlow.WFMonitor.examinerBtn')}】${this.$t('add')}【${userStr}】${this.$t('asReviewer')}`);
              }else if(element.type=='delegate'){//委托
                let delegateUsers = (info.delegateUsers&&info.delegateUsers.length>0)?info.delegateUsers.join(','):"";
                msgList.push(`【${info.createUserName}】${this.$t('by')}【${this.$t('processEntrust')}】${this.$t('entrust')}【${delegateUsers}】${this.$t('asApprover')}`);
              }
            }
        }
      }
      return msgList;
    },
    getManualinfos(item){
      let manualinfosName = '';
      let length = item.manualinfos.length;
      item.manualinfos.forEach((ele,index) => {
        manualinfosName += `【${ele.departmentName?ele.departmentName:'部门'}-${ele.account?ele.account:'姓名'}】`;
        if(index!=(length-1)){
           manualinfosName += '、';
        }
      });
      return manualinfosName;
    },
    changeTask() {
      this.isPersonalTask = !this.isPersonalTask
      this.getHistoryTaskList()
    },
    async getHistoryTaskList() {
      if(this.processInstanceId){
      this.loading = true;
      try {
        let historyResult = await getHistoryTaskList({
          processInstanceId: this.processInstanceId,
          isPersonalTask:this.isPersonalTask
        });
        if (historyResult && historyResult.data && historyResult.data.success) {
          const data = historyResult.data.data.map(item => {
            return item.taskList
          })
          this.roamsList = historyResult.data.data;
        }
      } catch (error) {
        
      }
      this.loading = false;
    }
    },
    processName(item) {
      switch (item.processType) {
        case 0:
          return this.$t('currentProcess')
        case 1:
          return `${item.processName}（上级流程）`
        case 2:
          return item.processName
        default:
          return item.processName
      }
    }
  }
};
</script>
<style scoped>
div /deep/ .el-timeline-item__tail{
left: 8px;
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
    height: 100%;
    background-color: #fafafa;
	border: 1px solid #ebeef5;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 10px;
    margin: 0 20px;
    padding: 15px;
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
    color: #409EFF;
    margin: 0 20px;
    font-size: 14px;
    padding: 16px;
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
.card .roams-text{
	line-height: 22px;
	color: #999;
}
.el-timeline-item__node{
	background-color:#fff;
	z-index: 9;
	border:4px solid #409EFF;
}
.el-button--primary {
  position: absolute;
  right: 50px;
}

.round-one{
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #04bca4;
	display: inline-block;
	margin-right: 6px;
}
.round-two{
	background-color: #f4aa1d;
}
.round-three{
	background-color: #2e83f8;
}

.operation-box{
  display: flex;
  flex-direction: column;
}
.operation-box .text{
  color: #999;
}
</style>
