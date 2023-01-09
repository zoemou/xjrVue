<template>
  <div>
    <CreateDesignFlow v-if="createFlowType==0" v-bind="$attrs" v-on="$listeners"></CreateDesignFlow>
    <CreateFormFlow v-if="createFlowType==1"  v-bind="$attrs" v-on="$listeners"></CreateFormFlow>
  </div>
</template>

<script>
import CreateDesignFlow from "./CreateDesignFlow"; //发起临时流程
import CreateFormFlow from "./CreateFormFlow"; //发起审批
export default {
  props: {
    createFlowType: {
      type: Number,
      default: 0//0 发起临时模板  1 发起审批
    }
  },
  components: {
    CreateDesignFlow,
    CreateFormFlow
  },
};
</script>

<style lang="scss" scoped></style>
