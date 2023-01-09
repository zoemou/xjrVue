<template>
  <div>
    <el-form label-position="top" :model="formInfo">
      <el-tabs>
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')">
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
          <el-form-item>
            <label>{{$t('workFlow.End.noticeStrategy')}}</label>
            <el-checkbox-group v-model="formInfo.messageTypes">
              <el-checkbox :label="10">{{$t('workFlow.End.systemInfor')}}</el-checkbox>
              <el-checkbox :label="11">{{$t('workFlow.End.shortMessage')}}</el-checkbox>
              <el-checkbox :label="12">{{$t('workFlow.End.enterpriseWeChat')}}</el-checkbox>
              <el-checkbox :label="13">{{$t('workFlow.End.dingDing')}}</el-checkbox>
              <el-checkbox :label="14">{{$t('workFlow.End.mailbox')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import mixinNode from "./../mixin/mixinNode";
export default {
  mixins: [mixinNode]
};
</script>

<style></style>
