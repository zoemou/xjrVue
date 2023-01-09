<template>
  <div>
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')">
          <!-- <el-form-item>
            <label>节点标识 *</label>
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
