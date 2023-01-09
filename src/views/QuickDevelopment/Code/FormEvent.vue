<template>
  <div class="mainbox">
    <div class="leftbox" :style="{ width: curIndex >= 0 ? '' : '100%' }">
      <Draw
        :key="key"
        :eventData="eventData"
        :curIndex="curIndex"
        @nodeClick="nodeClick"
        @deleteNode="deleteNode"
      ></Draw>
    </div>

    <div class="rightbox" v-if="curIndex >= 0">
      <div class="nodeinfo">{{$t('nodeProperties')}}-{{ $t(eventData[curIndex].title) }}</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('companyManager.titleBasicInformation')" name="basic">
          <el-form :model="eventData[curIndex].info">
            <el-form-item :label="$t('workFlow.Start.nodeName')" prop="nodeName">
              <el-input
                :value="$t(eventData[curIndex].info.nodeName)"
                v-if="eventData[curIndex].nodeComponent != 'Custom'"
                disabled
              ></el-input>
              <el-input
                v-model="eventData[curIndex].info.nodeName"
                v-else
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('logging')"
              prop="nodeLog"
              v-if="eventData[curIndex].info.nodeLog !== undefined"
            >
              <el-radio-group v-model="eventData[curIndex].info.nodeLog">
                <el-radio :label="true">{{$t('workFlow.Process.radioYes')}}</el-radio>
                <el-radio :label="false">{{$t('workFlow.Process.radioNo')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('processing')"
          name="process"
          v-if="eventData[curIndex].nodeComponent == 'Custom'"
        >
          <Process
            :key="key"
            :nodeType="eventData[curIndex].type"
            :triggerEventData="eventData[curIndex].triggerEventData"
            :allComponents="(baseData.step2)?baseData.step2:[]"
            :hideComponents="baseData.hideComponents"
            v-if="eventData[curIndex].nodeComponent == 'Custom'"
          ></Process>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Draw from "@/components/flowChart/Draw.vue";
import Process from "./codeBuild/Process.vue";
import {
  deepClone
} from '@/utils/index';
import i18n from "@/lang";
const DefaultData = [
  { 
    nodeComponent: "Start",
    type: "start",
    title: "workFlow.roams.startNode",
    info: {
      nodeName: "workFlow.roams.startNode",
    },
  },
  {
    nodeComponent: "Task",
    type: "init",
    title: 'formInitialize',
    info: {
      nodeName: 'formInitialize',
      nodeLog: false,
    },
  },
  {
    nodeComponent: "Plus",
    type: "created",
    title: i18n.t('customNode'),
    info: {
      nodeName: i18n.t('customNode'),
    },
  },
  {
    nodeComponent: "Task",
    type: "GetFormData",
    title: 'getFormData',
    desc:'newNone',
    info: {
      nodeName:'getFormData',
      nodeLog: false,
    },
  },
  {
    nodeComponent: "Plus",
    type: "edit",
    title: i18n.t('customNode'),
    info: {
      nodeName: i18n.t('customNode'),
    },
  },
  {
    nodeComponent: "Task",
    type: "loadForm",
    title:'loadingForm',
    info: {
      nodeName:'loadingForm',
      nodeLog: false,
    },
  },
  {
    nodeComponent: "Plus",
    type: "mounted",
    title:i18n.t('customNode'),
    info: {
      nodeName:i18n.t('customNode'),
    },
  },
  {
    nodeComponent: "Task",
    type: "submitForm",
    title:'submitForm',
    info: {
      nodeName:'submitForm',
      nodeLog: false,
    },
  },
  {
    nodeComponent: "Plus",
    type: "submit",
    title:i18n.t('customNode'),
    info: {
      nodeName:i18n.t('customNode'),
    },
  },
  {
    nodeComponent: "End",
    type: "end",
    title:'workFlow.roams.endNode',
    info: {
      nodeName: 'workFlow.roams.endNode',
      nodeLog: false,
    },
  },
];
export default {
  components: {
    Draw,
    Process,
  },
  props: ["baseData"],
  data() {
    return {
      key: 0,
      curIndex: -1,
      eventData: [],
      activeName: "basic",
    };
  },
  created() {
    this.eventData = [];
    if (this.baseData.step9 && this.baseData.step9.length > 0) {
      this.eventData = this.baseData.step9;
    } else {
      this.eventData = deepClone(DefaultData);
      this.baseData.step9 = this.eventData ;
      
    }
    
  },
  methods: {
     nodeClick({ item, index }) {
      if (item.nodeComponent == "Plus") {
        this.eventData.splice(index, 0, {
          nodeComponent: "Custom",
          type: item.type,
          title:this.$t('userDefinedNode'),
          nodeLog: false,
          triggerEventData: [],
          info: {
            nodeName:this.$t('userDefinedNode'),
            nodeLog: false,
          },
        });
      }
      this.key++;
      this.activeName = "basic";
      this.curIndex = index;
    },
    deleteNode(index) {
      this.eventData.splice(index, 1);
      this.key++;
      this.curIndex = 0;
      this.activeName = "basic";
    },

  },
};
</script>
<style scoped>
.mainbox {
  display: flex;
}
.leftbox {
  flex: 1;
  height: 92vh;
  overflow: auto;
}
.rightbox {
  flex-basis: 30%;
  height: 100vh;
  overflow: auto;
  border-left: 1px solid #c0c5ce;
  box-sizing: border-box;
  padding: 10px;
}
.nodeinfo {
  font-size: 13px;
  font-weight: bold;
  padding: 10px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
div /deep/ .el-radio-group {
  width: 100%;
}
div /deep/ .el-radio__label {
  font-size: 12px;
}
</style>
