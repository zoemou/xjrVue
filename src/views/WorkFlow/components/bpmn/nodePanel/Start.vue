<template>
  <div>
    <el-form label-position="top" :model="formInfo" @submit.native.prevent>
      <el-tabs v-if="formInfo.id" v-model="activeName">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')"  name="basic">
          <!-- <el-form-item>
            <label>节点标识</label>
            <el-input v-model="formInfo.id" disabled></el-input>
          </el-form-item> -->
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeName')}}</label>
            <el-input v-model="formInfo.name"></el-input>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeDescr')}}</label>
            <el-input
              v-model="formInfo.documentation"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-tab-pane>

        <!-- <el-tab-pane label="发起人">
          <el-form-item>
            <label>发起人脚本</label>
            <el-input v-model="formInfo.initiator"></el-input>
          </el-form-item>
        </el-tab-pane> -->
        <el-tab-pane :label="$t('workFlow.Start.tabSet')" v-if="this.formInfo.isFromMainProcess" name="form">
          <SchemeForm :tableData.sync="this.formInfo.tableData" @changeFormkeydefinition="changeFormkeydefinition"></SchemeForm>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.Start.initiatorSet')" v-else name="initiatorSet">
          <span class="form-required">{{$t('workFlow.Start.hint')}}</span>
          <el-form-item>
            <label><em class="form-required">*</em>{{$t('workFlow.Start.subprocess')}}：</label>
            <el-select
              v-model="formInfo.subProcessInitiator"
            >
              <el-option
                v-for="(item, index) in subProcessInitiator"
                :key="index"
                :label="item.resourceName?item.resourceName:item.resourceType"
                :value="item.resourceId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('parmOps')" v-if="this.formInfo.isFromMainProcess" name="parameterOperation">
          <StartParameterOperation v-if="activeName=='parameterOperation'" :formInfo.sync="formInfo" ></StartParameterOperation>
          <!-- 参数操作 -->
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import mixinNode from "./../mixin/mixinNode";
import SchemeForm from "./property/schemeform/Index";
import StartParameterOperation from "./property/StartParameterOperation";
import { getSubProcessInitiator } from "./../common/util/variable";
export default {
  mixins: [mixinNode],
  components: {
    SchemeForm,
    StartParameterOperation
  },
  data() {
    return {
      activeName: "basic",
      subProcessInitiator:[]
    }
  },
  watch: {
    "formInfo.subProcessInitiator": function(val) {
      if (val) {
        this.formInfo.initiator = `#{${val}}`;
      }
    },
  },
  mounted() {
    if (this.formInfo.isFromMainProcess) {
      //保存主流程上开始节点id
      if (this.element.id) {
        this.$store.commit("CHANGE_PROCESS_START_ID", this.element.id);
      }
    } else {
      //保存子流程上开始节点idMap
      let parentId = this.element.businessObject.$parent.id;
      if (parentId && this.element.id) {
        this.$store.commit("CHANGE_SUB_PROCESS_START_IDS", {
          key: parentId,
          value: this.element.id
        });
      }
      this.subProcessInitiator = getSubProcessInitiator();
    }
    let isSpecialInitiationProcess = this.$store.state.bpmn
      .isSpecialInitiationProcess;
    //当特殊表单-表单发起流程，默认特殊表单的tabledata
    if (isSpecialInitiationProcess) {
      let tableData = this.$store.state.bpmn.specialInitiationProcessTableData;
      this.formInfo.tableData = tableData;
    }
  },methods: {
    changeFormkeydefinition() {
      this.formInfo.formkeydefinition = this.formInfo.tableData
      .map(ele => {
        return ele.F_Id;
      }).join(",");
    }
  },
};
</script>
<style lang="css" scoped>
.form-box /deep/ .el-select {
  width: 100%;
}
.form-box /deep/ .el-form-item__content {
  display: flex;
  font-size: 12px;
}
.form-box /deep/ .el-form-item__content label {
  width: 120px;
}
.form-required{
  font-style: normal;
  color: red;
}
</style>
