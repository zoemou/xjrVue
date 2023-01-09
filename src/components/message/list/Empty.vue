<template>
  <div class="list-empty">
    <span>{{$t('messageIndex.hintEmpty')}}</span>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.list-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
  font-size: 12px;
}
</style>
