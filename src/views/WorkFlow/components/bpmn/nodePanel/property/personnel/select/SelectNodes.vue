<template>
  <el-form-item class="item-box">
    <label>{{$t('workFlow.selectNodes.nodeSelection')}}</label>
    <el-checkbox-group v-model="checkIndexList">
      <el-checkbox
        v-for="(item, index) in options"
        :key="item.value"
        :label="index"
        >{{ item.label }}</el-checkbox
      >
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import { NodeName } from "./../../../../lang/zh";
export default {
  props: {
    selectedList: {
      type: Array,
    },
  },
  data() {
    return {
      options: [],
      checkIndexList: [],
    };
  },
  mounted() {
    let checkIds = this.selectedList.map((ele) => {
      return ele.value;
    });
    let info = this.$store.state.bpmn.info;
    let options = [];
    let index = 0;
    for (let value of info.values()) {
      let showNodeTypes = ["bpmn:StartEvent", "bpmn:UserTask"];
      if (showNodeTypes.includes(value.type)) {
        let name = value.name;
        let label = name ? name : NodeName[value.type];
        if (label) {
          options.push({ value: value.id, label: label });
          if (checkIds.includes(value.id)) {
            this.checkIndexList.push(index);
          }
          index++;
        }
      }
    }
    this.options = options;
  },
  methods: {
    pushParentData() {
      let resultData = this.options.filter((ele, index) => {
        return this.checkIndexList.includes(index);
      });
      return resultData;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-box {
  .el-select {
    width: 100%;
  }
}
</style>
