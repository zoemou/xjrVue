<template>
  <div>
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id"  v-model="activeName">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')"  name="basic">
          <Basic :formInfo.sync="formInfo"></Basic
          ><!-- 基础配置 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.userButtonSetting.radioScript')"  name="scriptTask">
          <ScriptTask :formInfo.sync="formInfo"></ScriptTask>
          <!-- 脚本参数配置 -->
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.userButtonSetting.Sql')"  name="sql">
          <Sql :formInfo.sync="formInfo"></Sql>
          <!-- SQL语句 -->
        </el-tab-pane>
        <el-tab-pane label="API"  name="api">
          <Api :formInfo.sync="formInfo"></Api>
          <!-- API -->
        </el-tab-pane>
        <el-tab-pane :label="$t('parmOps')"  name="parameterOperation">
          <ParameterOperation  v-if="activeName=='parameterOperation'" formPage='script' :formInfo.sync="formInfo" ></ParameterOperation>
          <!-- 参数操作 -->
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Basic from "./property/script/Basic";
import ScriptTask from "./property/script/ScriptTask";
import Sql from "./property/script/Sql";
import Api from "./property/script/Api";
import ParameterOperation from "./property/ParameterOperation";
import mixinNode from "./../mixin/mixinNode";
export default {
  mixins: [mixinNode],
  components: {
    Basic,
    ScriptTask,
    Sql,
    Api,
    ParameterOperation
  },
  data() {
    return {
      activeName: "basic",
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
