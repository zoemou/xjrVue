<template>
  <div v-if="infoList.length > 0" class="ml">
    <div v-for="(item, index) in infoList" :key="index" class="item">
      <label class="title">{{ item.title }}:</label>
      <div class="content">{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  padding: 4px;
  font-size: 12px;
  line-height: 1.8;
  .title{
    width: 54px;
  }
  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 10px;
  }
}
.ml {
  margin-left: 15px;
}
</style>
