<template>
  <ApiConfig
    :apiConfig="apiConfig"
    :allComponents="[]"
    @submitApiDialog="submitApiDialog"
    :isFormEvent="false"
    nodeType="hideComponent"
  ></ApiConfig>
</template>

<script>
import ApiConfig from "./ApiConfig.vue";
export default {
  props: {
    apiConfig: {
      type: Object,
    },
  },
  components: {
    ApiConfig,
  },
  methods: {
    submitApiDialog(config) {
      this.$emit('submitApi',config);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>