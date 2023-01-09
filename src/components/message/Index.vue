<template>
  <el-popover
    v-model="visible"
    placement="top-end"
    width="380"
    trigger="click"
    @show="showList"
    popper-class="notice-pop-box"
  >
    <template v-if="visible">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label + (item.unread ? '(' + item.unread + ')' : '')"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <el-scrollbar style="height:450px">
        <component
          :is="componentName"
          v-if="visible"
          :list="list"
          :workflow="workflow"
          @setAllReaded="setAllReaded"
          @goTo="goTo"
          @showDetail="showDetail"
          @approval="approval"
          @eyeHistory="eyeHistory"
        />
      </el-scrollbar>
    </template>
    <div slot="reference">
      <el-badge :value="badgeNum > 0 ? badgeNum : ''">
        <i class="el-icon-bell"></i>
      </el-badge>
      <elDialog
        v-if="elDialog.visible"
        :visible.sync="elDialog.visible"
        :title="elDialog.title"
        :width="elDialog.width"
        :append-to-body="elDialog.appendToBody"
        :modal="true"
        :close-on-click-modal="false"
        :show-close="true"
        :fullscreen="elDialog.fullscreen"
        :destroy-on-close="true"
        :before-close="closeDialog"
      >
        <component
          :is="elDialog.componentName"
          v-if="elDialog.visible"
          :contentData="detailData"
          :nwfSchemeInfoId="flowData.nwfSchemeInfoId"
          :taskId="flowData.taskId || flowData.processInstanceId"
          :processInstanceId="flowData.processInstanceId"
          :deploymentId="flowData.deploymentId"
          :infoList="flowData.infoList"
          :isMyTask="isMyTask"
          @closeDialog="closeDialog"
        />
      </elDialog>
    </div>
  </el-popover>
</template>

<script>
import { getList, readMessage, readAllMessage, unreadMessageCount} from "@/api/message.js";
import List from "./list/List.vue";
import Schedule from "./list/Schedule.vue";
import Workflow from "./list/Workflow.vue";
import Detail from "./Detail.vue";
import ApprovalFLow from "@/views/WorkFlow/components/ApprovalFLow.vue"; //流程审批组件
import LookFLow from "@/views/WorkFlow/components/LookFLow"; //流程查看组件
import {mapGetters} from "vuex"
export default {
  name: "message",
  components: {
    List,
    Schedule,
    Workflow,
    ApprovalFLow,
    LookFLow,
    Detail
  },
  computed: {
    ...mapGetters(["website"]),
  },
  data() {
    return {
      componentName: "List",
      timerUnreadCount:null,
      list: [],
      workflow: {},
      visible: false,
      activeName: "news",
      activeGoToUrl: "",
      badgeNum: 0,
      tabList: [
        { name: "news", unread: 0, label:this.$t('messageIndex.labelNews'), messageList: [] },
        { name: "notice", unread: 0, label:this.$t('messageIndex.labelNotice'), messageList: [] },
        { name: "schedule", unread: 0, label:this.$t('messageIndex.labelSchedule'), messageList: [] },
        { name: "workflow", unread: 0, label:this.$t('messageIndex.labelWorkflow'), messageList: [] }
      ],
      elDialog: {
        visible: false,
        title: "弹框示题",
        width: "30%",
        appendToBody: true,
        fullscreen: false,
        componentName: ""
      },
      flowData: {},
      detailData: {},
      isMyTask:false
    };
  },
  created() {
    let _this = this;
    this.timerUnreadCount = setInterval (() => {
     _this.getTabList();
    },_this.website.refreshInterval);
    this.componentName = "List";
    this.activeGoToUrl = "/office-automation/news";
    this.list = this.tabList[0].messageList;
   if (!this.$store.getters.permission.size) {
        try {
         this.$store.dispatch("GetUserPermission");
        } catch (error) {
        }
      }
  },

  beforeDestroy () {
    clearInterval(this.timerUnreadCount);
    this.timerUnreadCount = null;
  },
  methods: {
    tabClick(tab, event) {
      this.list = [];
      switch (tab.index) {
        case "0":
          this.componentName = "List";
          this.list = this.tabList[0].messageList;
          this.activeGoToUrl = "/office-automation/news";
          break;
        case "1":
          this.componentName = "List";
          this.list = this.tabList[1].messageList;
          this.activeGoToUrl = "/office-automation/notice";
          break;
        case "2":
          this.componentName = "Schedule";
          this.list = this.tabList[2].messageList;
          this.activeGoToUrl = "/office-automation/schedule";
          break;
        case "3":
          this.componentName = "Workflow";
          this.activeGoToUrl = "/workflow/process";
          break;
      }
    },
    async showList() {
      await this.getTabList();
      this.visible = true;
      this.activeName = "news";
      this.componentName = "List";
      this.activeGoToUrl = "/office-automation/news";
      this.list = this.tabList[0].messageList;
    },
    async getTabList() {
      let badgeNum = 0;
      try {
        let res = await getList();
        let countRes = await unreadMessageCount();
        if (res.data.success) {
          let tempData = res.data.data;
          this.tabList[0].unread = tempData[0].unread;
          this.tabList[0].messageList = tempData[0].messageList;
          this.tabList[1].unread = tempData[1].unread;
          this.tabList[1].messageList = tempData[1].messageList;
          this.tabList[2].unread = tempData[2].unread;
          this.tabList[2].messageList = tempData[2].messageList;
          this.tabList[3].unread = tempData[3].unread + tempData[4].unread;
          this.workflow = {
            approval: tempData[3].messageList,
            approvalUnread: tempData[3].unread,
            circulated: tempData[4].messageList,
            circulatedUnread: tempData[4].unread
          };
          // badgeNum = this.tabList.reduce(function (a, b) {
          //   return a + b.unread;
          // },0);  
          badgeNum = countRes.data.data;
        }
      } catch (error) {}
      this.badgeNum = badgeNum;
    },
    //全部设置已读
    async setAllReaded() {
      this.visible = false;
      let needSetting = false;
      let res = { data: { code: 0, data: null, success: false } };
      try {
        if (this.activeName == "news") {
          if (this.tabList[0].unread > 0) {
            res = await readAllMessage(10);
            needSetting = true;
          }
        } else if (this.activeName == "notice") {
          if (this.tabList[1].unread > 0) {
            res = await readAllMessage(11);
            needSetting = true;
          }
        } else if (this.activeName == "schedule") {
          if (this.tabList[2].unread > 0) {
            res = await readAllMessage(12);
            needSetting = true;
          }
        } else if (this.activeName == "workflow") {
          if (this.tabList[3].unread > 0) {
            if (this.workflow.approvalUnread > 0) {
              res = await readAllMessage(13);
              needSetting = true;
            }
            if (this.workflow.circulatedUnread > 0) {
              res = await readAllMessage(14);
              needSetting = true;
            }
          }
        }
        if (needSetting) {
          if (res.data.success) {
            this.getTabList();
          } else {
            this.$message(this.$t('messageIndex.hintAllReadFailed'));
          }
        } else {
          this.$message(this.$t('messageIndex.hintNoMore'));
        }
      } catch (error) {}
      this.visible = true;
    },
    //设置单个已读
    async setItemReaded(item) {
      try {
        let res = await readMessage(item.F_Id);
        if (res.data.success) {
          this.getTabList();
        }
      } catch (error) {
        this.$message(this.$t('messageIndex.hintReadFailed'));
      }
    },
    //查看更多
    goTo() {
      this.getTabList();
      this.visible = false;
      this.$router.push({ path: this.activeGoToUrl });
    },
    //查看详情
    showDetail(item) {
      this.detailData = item.newsInfo;
      if (item.F_Status == "11") {
        //未读状态
        this.setItemReaded(item); //设置已读
      }
      this.openDialog(
        "Detail",
        "查看【" + this.detailData.F_FullHead + "】",
        "60%",
        false
      );
    },
    //审批流程
    approval(item) {
      // 后端要求：如果F_Module为16，点进去的时候/workflow-task/task-form这个接口的isMyTask参数传true
      if(item.F_Module==16){
        this.isMyTask = true;
      }else{
        this.isMyTask = false;
      }
      let workflowInfo = item.workflowInfoVo;
      let taskStatus = workflowInfo.taskStatus;//"1"已审批，"0"未审批
      //未读
      if (item.F_Status == "11") {
        this.setItemReaded(item); //设置已读
      }
      if(taskStatus=="1"){
        this.flowData.processInstanceId = workflowInfo.processInstanceId;
          this.flowData.taskId = workflowInfo.taskId;
          this.openDialog(
            "LookFLow",
            "查看流程进度【" + workflowInfo.schemeName + "】",
            "100%",
            true
          );
      }else{
        this.flowData.nwfSchemeInfoId = "";
        let title = "";
        if (workflowInfo.schemeName) {
          title += workflowInfo.schemeName;
        }
        if (workflowInfo.taskName&&workflowInfo.taskName!='null') {
          title += "/" + workflowInfo.taskName;
        }
        this.flowData.processInstanceId = workflowInfo.processInstanceId;
        this.flowData.deploymentId = workflowInfo.deploymentId;
        this.flowData.taskId = workflowInfo.taskId;
        this.flowData.infoList = [
          { title: "任务名称", value: title },
          { title: "发起时间", value: workflowInfo.createTime },
          { title: "发起人", value: workflowInfo.startUser }
        ];
        this.openDialog(
          "ApprovalFLow",
          "审批流程【" + title + "】",
          "100%",
          true
        );
      }
      
    },
    //查看流程
    eyeHistory(item) {
      // 后端要求：如果F_Module为16，点进去的时候/workflow-task/task-form这个接口的isMyTask参数传true
      if(item.F_Module==16){
        this.isMyTask = true;
      }else{
        this.isMyTask = false;
      }
      let workflowInfo = item.workflowInfoVo;
      this.flowData.processInstanceId = workflowInfo.processInstanceId;
      this.flowData.taskId = workflowInfo.taskId;
      if (item.F_Status == "11") {
        //未读
        this.setItemReaded(item); //设置已读
      }
      this.openDialog(
        "LookFLow",
        "查看流程进度【" + workflowInfo.schemeName + "】",
        "100%",
        true
      );
    },
    //打开弹窗
    openDialog(componentName, title = "", width = "80%", fullscreen = false) {
      this.elDialog.componentName = componentName;
      this.elDialog.title = title;
      this.elDialog.width = width;
      this.elDialog.fullscreen = fullscreen;
      this.elDialog.visible = true; // 显示对话框组件
      this.visible = false;
    },
    //关闭弹窗
    closeDialog() {
      this.elDialog.visible = false;
    }
  }
};
</script>
<style>
.notice-pop-box {
  border-radius: 4px;
  margin-top: -10px !important;
  box-shadow: 5px 5px 5px rgb(0 0 0 / 35%);
}
</style>
<style lang="css" scoped>
.list {
  height: 400px;
}
div /deep/ .list-box {
  font-size: 12px;
}
div /deep/ .list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  font-weight: 400;
  font-size: 12px;
  height: 36px;
  cursor: pointer;
}
div /deep/ .list-item-title {
  width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
div /deep/ .list-item-time {
  width: 150px;
}
div /deep/ .readed-mark {
  color: #02a7f0;
}
div /deep/ .notice-footer {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 12px;
  color: #02a7f0;
  cursor: pointer;
}
</style>
