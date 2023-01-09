<template>
  <div class="shell">
    <div class="add-box"><div class="add-icon">+</div></div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    formEvents: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.shell {
  padding: 4px;
}
.add-box {
  width: 40px;
  height: 40px;
  border: 1px solid #666666;
  transform: rotate(45deg);
  margin: 7px 0;
  cursor: pointer;
  .add-icon {
    font-size: 40px;
    font-weight: 700;
    margin-left: 8px;
    margin-top: -10px;
    transform: rotate(45deg);
  }
}
</style>
