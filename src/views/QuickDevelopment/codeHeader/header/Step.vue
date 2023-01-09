<template>
  <el-steps :active="active" finish-status="success" simple>
    <template v-for="(item, index) in stepList">
      <el-step :key="index" :title="item.title"></el-step>
    </template>
  </el-steps>
</template>

<script>
export default {
    props: {
    active: {
      type: Number,
      default: 0
    },
    stepList: {
      type: Array,
      default: ()=>{
        return []
      }
    }
  },
};
</script>

<style lang="css" scoped>
div >>> .el-step.is-simple .el-step__main{
  height: 40px;
  line-height: 40px;
}
div >>> .el-step.is-simple .el-step__title{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  font-size: 14px;
}
</style>

