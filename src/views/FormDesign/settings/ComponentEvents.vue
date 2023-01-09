<template>
  <div>
    <!-- 组件触发事件 -->
   <div v-if="showChangeEvent">
      <el-divider>{{$t('valueChangeEvent')}}</el-divider>
      <QueryConfiguration triggerEventName='change' :activeData.sync="activeData" :componentFormList="componentFormList"></QueryConfiguration>
   </div>

   <div v-if="showBlurEvent">
      <el-divider>{{$t('outOfFocusEvent')}}</el-divider>
      <QueryConfiguration triggerEventName='blur' :activeData.sync="activeData" :componentFormList="componentFormList"></QueryConfiguration>
   </div>

     <div v-if="showClickEvent">
      <el-divider>{{$t('buttonClickEvent')}}</el-divider>
     <ClickEventConfiguration triggerEventName='click' :activeData.sync="activeData" :allComponents="allComponents" :componentFormList="componentFormList" v-bind="$attrs"></ClickEventConfiguration>
    </div>
    <div v-if="showClickAfterEvent">
      <el-divider>{{$t('postClickEvents')}}</el-divider>
      <QueryConfiguration triggerEventName='clickAfter' :activeData.sync="activeData" :componentFormList="componentFormList"></QueryConfiguration>
   </div>
  </div>
</template>
<script>
import QueryConfiguration from './design/QueryConfiguration.vue';
import ClickEventConfiguration from './design/ClickEventConfiguration.vue';
  export default {
    props: ["activeData","componentFormList","allComponents"],
    components: {
      QueryConfiguration,
      ClickEventConfiguration
    },
    computed: {
      showChangeEvent() {
        return this.activeData.__config__.triggerEvents&&this.activeData.__config__.triggerEvents.includes('change')
      },
      showBlurEvent() {
        return this.activeData.__config__.triggerEvents&&this.activeData.__config__.triggerEvents.includes('blur')
      },
      showClickEvent() {
        return this.activeData.__config__.triggerEvents&&this.activeData.__config__.triggerEvents.includes('click')
      },
      showClickAfterEvent() {
        return this.activeData.__config__.triggerEvents&&this.activeData.__config__.triggerEvents.includes('clickAfter')
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>