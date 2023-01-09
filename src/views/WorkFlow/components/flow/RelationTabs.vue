<template>
  <div class="box" v-loading="isLoaded">
    <elTabs tab-position="left" class="customLeftTab" v-model="flowTabsActiveName">
      <el-tab-pane :label="$t('workFlow.createFLow.labelFormInfor')"   name="form">
          <el-tabs
            class="work-flow-tabs"
            tab-position="left"
            v-model="activeName"
            :before-leave="tabBeforeLeave"
          >
            <el-tab-pane
             v-for="(item, index) in processInfo.forms"
              :key="index"
              :label="item.F_Name"
              :name="'parsers-' + index"
            >
             <Parser
                v-if="item.F_Type == 0 && currentActiveName == 'parsers-' + index"
                :conf="item"
                :formData="processInfo.forms_data[index]"
                :formInfos="processInfo.forms_info[index]"
                :ref="'parsers-' + index"
              ></Parser>
              <SystemFormParser
                v-if="item.F_Type == 2 && currentActiveName == 'parsers-' + index"
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
      <el-tab-pane :label="$t('workFlow.createFLow.labelFlowInfor')"   name="infos">
        <BpmnView v-if="flowTabsActiveName=='infos'"  :processInstanceId="processInstanceId" :deploymentId="deploymentId"></BpmnView>
      </el-tab-pane>
      <el-tab-pane :label="$t('workFlow.createFLow.labelCirRecord')"   name="roams">
        <Roams :processInstanceId="processInstanceId"></Roams>
      </el-tab-pane>
      <el-tab-pane :label="$t('workFlow.createFLow.labelAnnexSum')"  name="files">
        <Files   :fileList="processInfo.files"></Files>
      </el-tab-pane>
    </elTabs>
  </div>
</template>

<script>
import Parser from "@/components/codeParser/Parser"; //导入解析组件
import BpmnView from './../BpmnView.vue';
import Roams from "./Roams";
import Files from "./Files";
import { getRlationTaskInfo,getViewProcess } from "@/api/workFlow/WFLaunch";
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue"; //导入系统表单组件
export default {
  props: {
    processInstanceId: {
      type: String,
      default: null,
    },
    deploymentId: {
      type: String,
      default: null,
    },
  },
  components: {
    Parser,
    BpmnView,
    Roams,
    Files,
    SystemFormParser
  },
  data() {
    return {
      flowTabsActiveName:'form',
      activeName: "parsers-0",
      currentActiveName: "parsers-0",
      isLoaded: true,
      processInfo: {
        forms: null, // 表单
        infos: null, // 图片
        files: [], // 附件
        subs: null, // 子流程
        roams: [],
        btnInfo: {}, // 按钮信息
        nodeInfo: {}, // 审批节点 关联意见框、电子签章密码等
        myStamps: [], // 我的签章列表
        forms_data: [], // 表单数据
        signation: false, //加签或减签(用于显示 加签或减签 按扭)
        forwarderList: [], //原有传阅人列表
        rejectnode: [], // 已流转过的节点用于驳回选择
        task_comment: [], //关联意见框 审批意见
      },
    };
  },
  async created() {
    await this.relationTaskInfo();
  },
  methods: {
    async relationTaskInfo() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
      let res = await getRlationTaskInfo({
        processInstanceId: this.processInstanceId,
      });
      let processRes = res.data;
      if (processRes.success) {
        this.changeData(processRes.data);
        this.processInfo.infos = getViewProcess(this.processInstanceId); //  流程信息
        this.isLoaded = false;
      } else {
        this.$alert(processRes.msg,this.$t('workFlow.createFLow.hintInfor'), {
          confirmButtonText:this.$t('buttonModule.modalSureBtn'),
          showClose: false,
          callback: (action) => {
            this.$emit("ended");
          },
        });
      }
      loading.close();
    },
    tabBeforeLeave(activeName, oldActiveName) {
        this.currentActiveName = activeName;
      },
    changeData(data) {
      if (!data) return;
      let form = [];
      let form_data = [];
      let form_info = [];
      data.formInfo.forEach(function (value) {
        if(value.schemeInfo.F_Type==0){
           form_data.push(value.formData);
          form_info.push(value.formScheme.data);
          let customTempJson = {F_Type:0,F_Name:value.schemeInfo.F_Name,...value.formScheme.data};
           form.push(customTempJson);
        }else{
          form_data.push(value.formData);
          form_info.push(value.schemeInfo);
          let systemTempJson = {F_Type:1,F_Name:value.F_Name,F_Url:value.F_UrlAddress,...value.schemeInfo};
           form.push(systemTempJson);
        }
      });
      this.processInfo.roams = data.historyTaskList;
      this.processInfo.forms = form;
      this.processInfo.forms_data = form_data;
      this.processInfo.forms_info = form_info;
    },
  },
};
</script>

<style scoped>
/* 左右布局 */
.box {
  display: flex;
  height: 100%;
  width: 100%;
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
  min-height: 90vh;
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
</style>
