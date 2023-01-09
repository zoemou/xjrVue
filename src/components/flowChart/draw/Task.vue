<template>
  <div class="shell" :class="acitve ? 'acitve' : ''">
    <div class="rectangle">
      <div class="multiple-line" v-if="desc">
        <div class="rectangle-title">{{ $t(title) }}</div>
        <div class="rectangle-title">{{ $t(desc) }}</div>
      </div>
      <div class="single-line" v-else>
        <div class="rectangle-title">{{ $t(title)  }}</div>
      </div>
    </div>
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
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    desc: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
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
.single-line {
  height: 60px;
  text-align: center;
  line-height: 60px;
  margin-top: 5px;
}
.rectangle-title {
  font-size: 14px;
}
.multiple-line {
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-top: 5px;
}
.shell {
  padding: 4px;
}
.acitve {
  border: 2px dashed #02a7f0;
}
</style>
