<template>
  <div class="box">
    <div
      v-for="(item, index) in eventData"
      :key="index"
      @click="nodeClick(item, index)"
      class="item"
    >
      <span
        v-if="item.nodeComponent == 'Custom'"
        class="el-icon-user-solid"
      ></span>
      <component
        :acitve="curIndex == index"
        :is="item.nodeComponent"
        :title="item.info.nodeName"
        :index="index"
        :desc="item.desc"
      >
      </component>
      <span
        class="el-icon-delete-solid cutom-del"
        v-if="item.nodeComponent == 'Custom'"
        @click="deleteNode(index)"
      ></span>
      <ConnectingLine v-if="item.nodeComponent != 'End'"></ConnectingLine>
    </div>
  </div>
</template>

<script>
import Start from "./draw/Start.vue";
import Plus from "./draw/Plus.vue";
import Task from "./draw/Task.vue";
import Custom from "./draw/Custom.vue";
import End from "./draw/End.vue";
import ConnectingLine from "./draw/ConnectingLine.vue";
export default {
  components: {
    Start,
    Plus,
    ConnectingLine,
    Task,
    Custom,
    End,
  },
  props: {
    eventData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    curIndex: {
      type: Number,
      default: () => {
        return -1;
      },
    },
  },
  methods: {
    nodeClick(item, index) {
      this.$emit("nodeClick", { item, index });
    },
    deleteNode(index) {
      this.$emit("deleteNode", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item {
  position: relative;
}
.el-icon-user-solid {
  position: absolute;
  left: 10px;
  top: 10px;
}
.el-icon-delete-solid {
  position: absolute;
  right: 10px;
  top: 60px;
}
.cutom-del {
  align-self: flex-end;
  visibility: hidden;
}
.item:hover .cutom-del {
  visibility: visible;
}
</style>
