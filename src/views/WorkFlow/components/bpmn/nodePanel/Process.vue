<template>
  <div>
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id">
        <el-tab-pane :label="$t('workFlow.Process.tabConfig')">
          <Basic
            :formInfo.sync="formInfo"
            :isSpecialInitiationProcessDisabled="
              isSpecialInitiationProcessDisabled
            "
          >
          </Basic
          ><!-- 基础配置 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Process.tabAuthoritySet')">
          <Authority :formInfo.sync="formInfo"></Authority
          ><!-- 权限设置 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Process.tabmenuSet')">
          <Menu :formInfo.sync="formInfo"></Menu
          ><!-- 菜单设置 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Process.tabInitiationProcess')">
          <FormInitiationProcess
            :formInfo.sync="formInfo"
          ></FormInitiationProcess
          ><!-- 表单发起流程 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Process.tabTimeoutAlert')">
          <TimeoutAlert :formInfo.sync="formInfo"></TimeoutAlert
          ><!-- 超时提醒 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Process.tabAssociatedTask')">
          <AssociatedTask :formInfo.sync="formInfo"></AssociatedTask
          ><!-- 关联任务 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('procPara')">
          <Parameter :formInfo.sync="formInfo"></Parameter
          ><!-- 流程参数 -->
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Basic from "./property/process/Basic";
import Authority from "./property/process/Authority";
import Menu from "./property/process/Menu";
import FormInitiationProcess from "./property/process/FormInitiationProcess";
import TimeoutAlert from "./property/process/TimeoutAlert";
import AssociatedTask from "./property/process/AssociatedTask";
import Parameter from "./property/process/Parameter";
import mixinProcess from "./../mixin/mixinProcess";

export default {
  mixins: [mixinProcess],
  components: {
    Basic,
    Authority,
    Menu,
    FormInitiationProcess,
    TimeoutAlert,
    AssociatedTask,
    Parameter
  }
};
</script>

<style lang="scss" scoped></style>
