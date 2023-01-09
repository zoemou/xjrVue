<template>
  <div class="message-box">
    <h6>{{ $t("systemFormMiss") }}</h6>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  top: 50px;
  color: red;
  position: relative;
  left: 200px;
}
</style>
