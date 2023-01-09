<template>
  <div class="box" v-if="isLoaded">
    <elTabs tab-position="top" class="customLeftTab">
        <el-tab-pane :label="$t('workFlow.createFLow.labelFlowInfor')">
          <Info :imgUrl="processInfo.infos"></Info>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.createFLow.labelCirRecord')">
          <Roams :processInstanceId="processInstanceId"></Roams>
        </el-tab-pane>
      </elTabs>
  </div>
</template>

<script>
import Info from "./flow/Info";
import Roams from "./flow/Roams";
export default {
  props: {
    // 流程实例ID
    processInstanceId: {
      type: String,
      default: null,
    },
  },
  components: {
    Info,
    Roams,
  },
  data() {
    return {
      primaryKey: "",
      isLoaded: false,
      loading: null,
      PrepositionTaskList: [],
      processInfo: {
        infos: null, // 图片
        roams: null, // 流转
      }
    };
  },
  async created() {
    this.loading = this.$loading({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)",
    });

    await this.ReviewFlow();
    this.loading.close();
  },
  methods: {
    async ReviewFlow() {
      if (historyResult?.data?.success) {
        this.processInfo.roams = historyResult.data.data;
      }
      this.isLoaded = true;
      this.loading.close();
    },
  },
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
  height: 100vh;
  width: 10%; /* 设置一个宽度不让内部el-tabs标签页撑破响应式布局 */
}
.panel-right {
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
