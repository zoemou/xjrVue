<template>
  <div class="title-box">
    <a target="_blank" :href="website.link">
    <img :src="logoImg" /> <img />
    <span class="title">{{ title }}</span>
    </a>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      logoImg: "/img/xjr-logo.png",
    };
  },
  props: {
    title:{
      type:String,
      default:""
    }
  },
    computed: {
    ...mapGetters(["website"])
  },
};
</script>

<style lang="scss" scoped>
.title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    margin-left: 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #303133;
    line-height: 30px;
  }
}
</style>
