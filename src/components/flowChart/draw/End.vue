<template>
  <div class="shell" :class="acitve ? 'acitve' : ''">
    <div class="circular"></div>
  </div>
</template>

<script>
export default {
  props: {
    acitve: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.shell {
  padding: 4px;
}
.acitve {
  border: 2px dashed #02a7f0;
}
.circular {
  border: 6px solid #666666;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  cursor: pointer;
}
</style>
