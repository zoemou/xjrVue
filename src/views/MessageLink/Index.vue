<template>
  <div>
    <elDialog
      v-if="visible"
      :visible.sync="visible"
      :title="title"
      :append-to-body="true"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="true"
      :destroy-on-close="true"
      :before-close="handleCloseWrap"
    >
      <component
        :is="componentName"
        v-if="visible"
        :taskId="taskId"
        :processInstanceId="processInstanceId"
        :infoList="infoList"
        @closeDialog="closeDialog"
      />
    </elDialog>
  </div>
</template>

<script>
import ApprovalFLow from "@/views/WorkFlow/components/ApprovalFLow"; //流程审批组件
import LookFLow from "@/views/WorkFlow/components/LookFLow"; //流程查看组件
import { getTaskInfo } from "@/api/messageLink";
export default {
  data() {
    return {
      visible: false,
      title: "审批流程",
      componentName: "",
      operation: "",
      taskId: "",
      processInstanceId: "",
      infoList: []
    };
  },
  components: {
    ApprovalFLow,
    LookFLow
  },
  async created() {
    //{前端项目地址}/message-link/{operation}/{taskId}
    // http://192.168.0.170:7777/message-link/1/2242a41d-deed-11eb-a9d4-080027f0c736
    // http://192.168.0.170:7777/message-link/2/2242a41d-deed-11eb-a9d4-080027f0c736

    // operation 1,审批，2，传阅
    this.operation = this.$route.params.operation;
    this.taskId = this.$route.params.id;
    try {
      let res = await getTaskInfo(this.operation, this.taskId);
      if (res && res.data && res.data.success && res.data.data) {
        let {
          isNormal,
          isApproval,
          isRights,
          processInstanceId,
          ...otherParams
        } = res.data.data;
        if (processInstanceId) {
          this.processInstanceId = processInstanceId;
        }
        /*
        isNormal 0 流程不正常 1，正常
        isApproval 0 未审批 1 已
        isRights 1 有权限 0 无
        */
        if (isNormal == "0") {
          this.openMessage("该流程已关闭，或该流程已删除", "提示");
        } else if (isNormal == "1") {
          if (this.operation == '1') {
            if (isRights == "1") {
              if (isApproval == "0") {
                this.componentName = "ApprovalFLow";
                this.initInfo(otherParams);
              } else if (isApproval == "1") {
                this.componentName = "LookFLow";
                this.initInfo(otherParams);
              } else {
                this.openMessage("您无权限审批该流程", "提示");
              }
            } else {
              this.openMessage("您无权限审批该流程", "提示");
            }
          }
          else if (this.operation == '2') {
            if (isRights == "1") {
              this.componentName = "LookFLow";
              this.initInfo(otherParams);
            } else {
              this.openMessage("您无权限查看该信息", "提示");
            }
          }else {
            this.openMessage("链接错误", "提示");
          }                                                                                                                                                                                                                       
        } else {
          this.openMessage("该流程链接错误", "提示");
        }
      } else {
        this.openMessage("获取流程信息失败", "提示");
      }
    } catch (error) {
      this.openMessage("捕获异常，获取流程信息失败", "提示");
    }
  },
  methods: {
    initInfo({ schemeName, taskName, startUser, createTime }) {
      let title = "";
      if (schemeName) {
        title += schemeName;
      }
      if (taskName) {
        title += "/" + taskName;
      }
      this.title = "审批流程【" + title + "】";
      this.infoList = [
        { title: "任务名称", value: schemeName },
        { title: "发起时间", value: createTime },
        { title: "发起人", value: startUser }
      ];
      this.visible = true;
    },
    openMessage(tips, title) {
      this.$alert(tips, title, {
        confirmButtonText: "确定",
        callback: action => {
          this.handleCloseWrap();
        }
      });
    },
    closeDialog() {
      this.handleCloseWrap();
    },
    handleCloseWrap() {
      this.visible = false;
      this.$router.replace("/"); //关闭直接关闭这个页面 跳转到首页
    }
  }
};
</script>

<style lang="scss" scoped></style>
