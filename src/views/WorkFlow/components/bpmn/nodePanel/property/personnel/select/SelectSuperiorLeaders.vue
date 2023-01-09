<template>
  <div class="item-box">
    <el-form-item>
      <label>{{$t('workFlow.selectNodes.initiatorSuperior')}}</label>
      <el-checkbox-group v-model="initiatorCheckIndexList">
        <el-checkbox
          v-for="(item, index) in initiatorOptions"
          :key="item.value"
          :label="index"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <label>{{$t('workFlow.selectNodes.designatedNode')}}</label>
      <el-tree
        ref="SelectSuperiorLeadersTree"
        :data="nodeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        :default-expand-all="false"
        accordion
        :props="defaultProps"
      >
      </el-tree>
    </el-form-item>
  </div>
</template>

<script>
import { NodeName } from "./../../../../lang/zh";
export default {
  props: {
    selectedList: {
      type: Array
    }
  },
  data() {
    return {
      initiatorOptions: [
        { id: "1", label: this.$t('upperLevel'), value: "1" },
        { id: "2", label: this.$t('upperTwoLevels'), value: "2" },
        { id: "3", label: this.$t('upperThreeLevels'), value: "3" },
        { id: "4", label: this.$t('upperFourLevels'), value: "4" },
        { id: "5", label: this.$t('upperFiveLevels'), value: "5" }
      ],
      defaultCheckedKeys: [],
      initiatorCheckIndexList: [],
      nodeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {
    let info = this.$store.state.bpmn.info;
    let nodeData = [];
    for (let value of info.values()) {
      let hideNodeTypes = ["bpmn:Process", "bpmn:SequenceFlow", "bpmn:EndEvent"];
      if (!hideNodeTypes.includes(value.type)) {
        let name = value.name;
        let label = name?name:NodeName[value.type];
        let id = value.id;
        let children = [];
        this.initiatorOptions.forEach(element => {
          children.push({
            ...element,
            resourceId: id,
            id: id + element.id,
            resourceName: label
          });
        });
        nodeData.push({
          id,
          label,
          children
        });
      }
    }
    this.nodeData = nodeData;
    this.selectedList.forEach(element => {
      if (!element.resourceId) {
        this.initiatorCheckIndexList.push(parseInt(element.id) - 1);
      } else {
        this.defaultCheckedKeys.push(element.id);
      }
    });
  },
  methods: {
    pushParentData() {
      let initiatorData = this.initiatorOptions.filter((ele, index) => {
        return this.initiatorCheckIndexList.includes(index);
      });
      let topData = [];
      if(initiatorData.length>0){
        initiatorData.forEach(ele => {
          ele.label = '发起人-'+ele.label;
          topData.push(ele);
        });
      }
      let nodeData = this.$refs.SelectSuperiorLeadersTree.getCheckedNodes();
      let result = [...topData, ...nodeData];
      return result;
    }
  }
};
</script>

<style scoped>
.item-box /deep/ .el-form-item__content,
.item-box /deep/ .el-checkbox,
.item-box /deep/ .el-checkbox__label {
  font-size: 12px;
}
</style>
