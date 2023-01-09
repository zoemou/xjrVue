<template>
  <div class="shell" :class="acitve ? 'acitve' : ''">
    <div class="custom rectangle">
      <span class="custom-title">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: () => {
        return -1;
      },
    },
    acitve: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
  }
};
</script>

<style lang="scss" scoped>
.rectangle {
  width: 140px;
  height: 70px;
  border: 1px solid #666666;
  border-radius: 4px;
  cursor: pointer;
}
.custom {
  display: flex;
  justify-content: center;
  align-items: center;
  .custom-title {
    font-size: 14px;
    align-self: center;
  }
}

.shell {
  padding: 4px;
}
.acitve {
  border: 2px dashed #02a7f0;
}
</style>
