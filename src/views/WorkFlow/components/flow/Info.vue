<template>
  <div>
    <img v-if="imgUrl" class="info-img" :src="imgUrl" />
    <avue-empty :desc="$t('deletePrompt.noData')" v-else></avue-empty>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.info-img {
  max-width: 100%;
}
</style>
