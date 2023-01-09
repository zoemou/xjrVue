<template>
  <div class="box" v-if="isLoaded">
    <div class="panel-left">
        <PrintCurrentPage v-if="showPrintBox" :printIndex="printIndex" :processInfo="processInfo" @getFormData="getFormData"></PrintCurrentPage>
      <ShrinkArea position="left" @change="shrinkLeft" v-show="flowTabsActiveName==='form'"></ShrinkArea>
      <elTabs
        tab-position="top"
        class="customLeftTab"
        v-model="flowTabsActiveName"
      >
        <el-tab-pane :label="$t('workFlow.createFLow.labelFormInfor')" name="form">
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
                :ref="'parsers-' + index"
                :isEdit="2"
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
                :taskComment="processInfo.task_comment[index]"
                :ref="'parsers-' + index"
                :isEdit="2"
              ></SystemFormParser>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelFlowInfor')" name="infos">
          <!-- <Info :imgUrl="processInfo.infos"></Info> -->
		  <BpmnView v-if="flowTabsActiveName=='infos'" :deploymentId="deploymentId" :processInstanceId="processInstanceId"></BpmnView>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelCirRecord')" name="roams">
          <Roams  v-if="flowTabsActiveName=='roams'" :processInstanceId="processInstanceId"></Roams>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelAnnexSum')" name="files">
          <Files  v-if="flowTabsActiveName=='files'" :fileList="processInfo.files"></Files>
        </el-tab-pane>

        <template v-if="RelationFlowTabs.length > 0">
          <el-tab-pane
            v-for="(item, index) in RelationFlowTabs"
            :label="
              item.processInstanceName
                ? item.processInstanceName
                : '前置任务' + (index + 1)
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
  </div>
</template>

<script>
import WorkFlowFormParser from "@/components/codeParser/WorkFlowFormParser";
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue"; //导入系统表单组件
import ShrinkArea from "@/components/workflow/ShrinkArea.vue"; //导入可伸缩组件
import Info from "./flow/Info";
import Roams from "./flow/Roams";
import Files from "./flow/Files";
import RelationTabs from "./flow/RelationTabs";
import PrintCurrentPage from "./flow/PrintCurrentPage";
import {
  getNodeInfo,
  getTaskForm,
  getAnnexInfo
} from "@/api/workFlow/WFLaunch";
import BpmnView from './BpmnView.vue';
export default {
  props: {
    // 流程实例ID
    processInstanceId: {
      type: String,
      default: null
    },
    deploymentId: {
      type: String,
      default: null
    },
    //任务id
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
    },
    CurrentModule: {
      type: String,
      default: null
    },
    isMyTask: {
      type:Boolean,
      default: false
    },
  },
  components: {
    WorkFlowFormParser,
    SystemFormParser,
    ShrinkArea,
    Info,
    Roams,
    Files,
    RelationTabs,
    PrintCurrentPage,
	  BpmnView
  },
  data() {
    return {
      flowTabsActiveName: "form",
      activeName: "parsers-0",
      currentActiveName: "parsers-0",
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
        rejectNodeId: null, // 驳回至指定节点
        relationTaskList: [], // 关联前置任务
        keyValue: [], // 表单信息 ( 表单实例ID ,表单设计ID )
        formValue: [], // 表单数据 (表单的实例数据)
        fileValue: [] // 附件汇总 就是从表单设计配置里拿到所有有关附件组件的字段
      },
      nextNodeDialogVisible: false,
      hasEsignature: false,
      isShowLeftText: true,
      printIndex:0,
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
  },
  async created() {
    this.loading = this.$loading({
      lock: true,
      text:this.$t('workFlow.createFLow.hintLoading'),
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)"
    });
    window.localStorage.setItem("lookSystemForm", 2);
    await this.ReviewFlow();
    this.getFileList()
    this.loading.close();
  },
  methods: {
    getFileList(){
			getAnnexInfo({
				taskId: this.taskId,
				processInstanceId: this.processInstanceId,
			}).then((res)=>{
				this.processInfo.files=res.data.data||[]
			})
		},
    async ReviewFlow() {
      let isMyTask = this.isMyTask;
      if(this.CurrentModule=='MyProcess'){
        isMyTask = true;
      }
      try {
        // 获取审批节点的信息（按扭、关联意见框、电子签章等）
        let nodeResult = await getNodeInfo({
          processInstanceId: this.processInstanceId
        });
        if (nodeResult && nodeResult.data && nodeResult.data.success) {
          this.processInfo.functionBtnInfo = nodeResult.data.data.functionBtnInfo;
        }

        let formResult = await getTaskForm({
          taskId: this.taskId,
          nwfRelationId: this.nwfRelationId,
          isMyTask
        });
        let formRes = formResult.data;
        if (formRes.success) {
          const data = formRes.data.filter(item => {
            return !this.delEmptyForm(item.formFieldInfo)
          })
          this.changeData(data);
        } else {
          this.$alert(formRes.msg,this.$t('workFlow.createFLow.hintInfor'), {
            confirmButtonText:this.$t('buttonModule.modalSureBtn'),
            showClose: false,
            callback: action => {
              this.loading.close();
              //删除暗色兼容样式类
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
        if (historyResult && historyResult.data && historyResult.data.success) {
          this.processInfo.roams = historyResult.data.data;
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
      } catch (error) {}
      this.isLoaded = true;
      this.loading.close();
    },
    getFormData(){

    },
    changeData(data) {
      console.log('data',data)
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
      data.forEach(function(value, index) {
        formPrimaryKey.push(value.primaryKey ? value.primaryKey : "");
        let tempFormData = value.F_Scheme ? value.F_Scheme.data : {};
        forms.push(tempFormData); //表单组件配置
        forms_data.push(value.formData ? value.formData : {}); //表单内容数据
        if (value.relationTaskList && value.relationTaskList.length > 0) {
          RelationFlowTabs = value.relationTaskList;
        }
        task_comment.push(value.taskComment);
        forms_info.push(value); // 表单信息
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
      let opinionCompoments = [];
      if (formFieldInfo.length > 0) {
        formFieldInfo.forEach(ele => {
          if (ele.children.length > 0) {
            opinionCompoments = ele.children.filter(item => {
              return item.filedsType == "opinion";
            });
          }
        });
      }
      if (opinionCompoments.length > 0) {
        this.hasEsignature = true;
      } else {
        this.hasEsignature = false;
      }
    },
    tabBeforeLeave(activeName, oldActiveName) {
      this.currentActiveName = activeName;
    },
    shrinkLeft(val) {
      this.isShowLeftText = !val
    },
    delEmptyForm(data) {
      if (data.editAll || data.requiredAll || data.viewAll) return false

      if (data.children) {
        const isEmpty = data.children.every(item => {
          if (item.children) {
            return item.children.every(item2 => {
              return !item2.edit && !item2.required && !item2.view
            })
          } else {
            return !item.edit && !item.required && !item.view
          }
        })
        return isEmpty
      } else {
        return false
      }
    }
  }
};
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
  width: 100%; /* 设置一个宽度不让内部el-tabs标签页撑破响应式布局 */
  position: relative;
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
  padding: 20px;
  height: 90vh;
  .el-tabs__header {
    height: 90vh;
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
