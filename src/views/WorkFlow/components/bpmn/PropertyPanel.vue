<template>
  <div ref="propertyPanel" class="property-panel" v-if="nodeName">
    <div class="node-name">{{  $t(nodeName) }}</div>
    <div class="pannel-box" v-if="element">
      <component :is="getComponent" :modeler="modeler" :element="element" />
    </div>
  </div>
</template>

<script>
// import LabelPanel from "./nodePanel/Label";
import UserPanel from "./nodePanel/User";
import ScriptPanel from "./nodePanel/Script";
import StartPanel from "./nodePanel/Start";
import EndPanel from "./nodePanel/End";
import ProcessPanel from "./nodePanel/Process";
import SequenceFlowPanel from "./nodePanel/SequenceFlow";
import SubProcessPanel from "./nodePanel/SubProcess";
import GatewayPanel from "./nodePanel/Gateway";
import CallActivityPanel from "./nodePanel/CallActivity";
import { NodeName } from "./lang/zh";
export default {
  components: {
    ProcessPanel,
    StartPanel,
    EndPanel,
    UserPanel,
    ScriptPanel,
    GatewayPanel,
    SubProcessPanel,
    SequenceFlowPanel,
    // LabelPanel,
    CallActivityPanel
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    modeler: {
      type: Object,
      required: true
    }
  },
  computed: {
    getComponent() {
      const type = this.element?.type;
      return this.getComponentName(type);
    },
    nodeName() {
		
      if (this.element) {
        const bizObj = this.element.businessObject;
        const type = bizObj?.eventDefinitions
          ? bizObj.eventDefinitions[0].$type
          : bizObj.$type;
        return this.$t(NodeName[type] || type);
      }
      return "";
    }
  },
  methods: {
    getComponentName(type) {
      let componentName = "";
      switch (type) {
        case "bpmn:Process":
          componentName = "ProcessPanel";
          break;
        case "bpmn:StartEvent":
          componentName = "startPanel";
          break;
        case "bpmn:EndEvent":
          componentName = "EndPanel";
          break;
        case "bpmn:UserTask":
          componentName = "UserPanel";
          break;
        case "bpmn:ScriptTask":
          componentName = "ScriptPanel";
          break;
        case "bpmn:ExclusiveGateway":
          componentName = "GatewayPanel";
          break;
        case "bpmn:InclusiveGateway":
          componentName = "GatewayPanel";
          break;
        case "bpmn:ParallelGateway":
          componentName = "GatewayPanel";
          break;
        case "bpmn:SubProcess":
          componentName = "SubProcessPanel";
          break;
        case "bpmn:SequenceFlow":
          componentName = "SequenceFlowPanel";
          break;
        case "bpmn:CallActivity":
          componentName = "CallActivityPanel";
          break;
        // case "label":
        //   componentName = this.getComponentName(
        //     this.element.businessObject.$type
        //   );
        //   break;
        default:
          break;
      }
      return componentName;
    }
  }
};
</script>
<style scoped>
.pannel-box{
height: calc(100% - 42px);	
}
.pannel-box>div,.pannel-box>div /deep/ .el-form,.pannel-box>div /deep/ .el-tabs{
	height: 100%;
}
.property-panel {
  padding: 10px;
  margin-right: 15px;
  height: 100%;
  box-sizing: border-box;
}
.property-panel /deep/ .el-form-item__content {
  line-height: 30px;
  font-size: 12px;
  text-align: left;
}
.property-panel /deep/ .el-input,
.property-panel /deep/ .el-select,
.property-panel /deep/ .el-radio-group {
  position: relative;
  font-size: 12px;
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.property-panel /deep/ .el-input-group{
	display: inline-table;
}
.property-panel /deep/ .el-input-group__append{
	line-height: 28px;
}
.property-panel /deep/ .el-radio__label {
  font-size: 12px;
}
.property-panel /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.property-panel /deep/ .el-input__icon {
  line-height: 30px;
}
.property-panel /deep/ .el-tabs__active-bar {
  height: 1px !important;
}
.property-panel /deep/ .el-tabs__nav-wrap::after {
  height: 1px !important;
}
.property-panel /deep/ .el-dialog__header {
  height: 20px !important;
}

.property-panel /deep/ .el-tabs__content {
  border: 1px solid #d6d6d6;
  padding: 10px;
  height: calc(100% - 62px);
  overflow: auto;
}
.property-panel /deep/ .el-textarea__inner::placeholder {
  font-size: 12px;
}
.property-panel /deep/ .el-table {
  font-size: 12px;
}
.property-panel /deep/ .el-table td,
.property-panel /deep/ .el-table th {
  padding: 2px 0;
}
.property-panel /deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}
.property-panel /deep/ .el-form-item {
  margin: 0;
}
.property-panel /deep/ .node-name {
  font-weight: bold;
  color: #444;
  text-align: left;
  border: none;
  font-size: 18px;
}
.property-panel /deep/ .panel-box {
  height: calc(100% - 100px);
  border: 1px solid #d6d6d6;
  padding: 10px;
}
</style>
