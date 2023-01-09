<template>
  <div class="newsContent">
    <div class="something">
      <div class="mr">{{ contentData.F_ReleaseTime }}</div>
      <div v-if="contentData.F_TypeId == 2" class="something">
        <div class="mr">{{ contentData.F_CategoryId }}</div>
        <div class="mr">信息来源：{{ contentData.F_SourceName }}</div>
        <div>来源地址：{{ contentData.F_SourceAddress }}</div>
      </div>
      <div v-else class="something">
        <div class="mr">作者：{{ contentData.F_AuthorName }}</div>
        <div class="mr">编辑：{{ contentData.F_CompileName }}</div>
        <div>{{ contentData.F_CategoryId }}</div>
      </div>
    </div>
    <div class="scrollBox">
      <div class="content">
        <div v-html="contentData.F_NewsContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["contentData"]
};
</script>

<style scoped>
.newsContent {
  height: 600px;
}
.something {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}
.mr {
  margin-right: 40px;
}
.scrollBox {
  height: calc(100% - 30px);
  overflow: scroll;
}
.content {
  width: 80%;
  margin: 0 auto;
  background: #fafafa;
  height: 100%;
  padding: 20px;
  color: #000;
}
</style>
