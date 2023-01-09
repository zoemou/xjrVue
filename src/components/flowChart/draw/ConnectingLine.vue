<template>
  <div class="line-box">
    <div class="line"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.line-box{
  display: flex;
  justify-content: center;
    align-items: center;
}
.line {
  width: 2px;
  height: 36px;
  margin: 4px 0;
  border-left: 2px dashed #666666;
}
</style>
