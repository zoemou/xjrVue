<template>
  <div class="main">
    <el-button type="primary" @click="handleClick"> 获取json</el-button>
    <l-quick-bi-design
    v-show="!isShow"
      ref="quickBiDesign"
      :componentList="componentList"
      :noDataConfigComponents="noDataConfigComponents"
    ></l-quick-bi-design>

    <l-quick-bi-viewer
      v-show="isShow"
      ref="quickViewer"
      :isPreview="true"
    ></l-quick-bi-viewer>
  </div>
</template>
<script>
import componentList from "@/option/bi/index";
import "@/components/desktop/base";
import "@/components/desktop/view";
export default {
  name: "fff",
  data() {
    return {
      componentList,
      noDataConfigComponents: ["datalist", "mytask", "mytasklist", "modules"],
      isShow: false
    };
  },
  components: {},
  methods: {
    handleClick() {
      this.$refs.quickViewer.set(this.$refs.quickBiDesign.get());
      this.isShow = !this.isShow;
    }
  }
};
</script>
<style type="text/css">
.main {
  height: 100%;
}
.l-rblock.l-quick-bi-design__main-content {
  height: 100%;
}
</style>
