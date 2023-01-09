<template>
  <div>
    <CodeSchema :category="category"></CodeSchema>
  </div>
</template>

<script>
import CodeSchema from '@/views/QuickDevelopment/CodeSchema.vue';
  export default {
    components: {
      CodeSchema,
    },
    data() {
      return {
        category: 1
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>