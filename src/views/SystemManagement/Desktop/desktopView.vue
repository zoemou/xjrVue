<template>
  <div class="deskTopMain">
    <l-quick-bi-viewer
      v-bind="$attrs"
      ref="quickViewer"
      :isPreview="false"
    ></l-quick-bi-viewer>
  </div>
</template>
<script>
import componentList from "@/components/desktop/index";
import "@/components/desktop/base";
import "@/components/desktop/view";
import { baseUrl } from "@/config/env";
import { getDesktopByMId } from "@/api/systemManagement/desktop";
import request from "@/router/axios";
export default {
  props: ["dataJson"],
  data() {
    return {
      componentList,
      noDataConfigComponents: ["datalist", "mytask", "mytasklist", "modules"]
    };
  },
  components: {},
  mounted() {
    let moduleId = this.$route.meta.moduleid;

    if (this.dataJson) {
      this.$refs.quickViewer.set(this.dataJson);
    } else if (moduleId) {
      getDesktopByMId(moduleId).then(res => {
        if (res?.data?.data) {
          let json = JSON.parse(res.data.data);
          this.$refs.quickViewer.set(json);
        }
      });
    } else {
      request({
        url: baseUrl + this.$route.path,
        method: "get"
      }).then(res => {
        if (res?.data?.data) {
          let json = JSON.parse(res.data.data);
          this.$refs.quickViewer.set(json);
        }
      });
    }
  },
  methods: {}
};
</script>
<style scoped>
.deskTopMain {
  height: 100%;
}
/deep/ .el-dialog.is-fullscreen {
  height: calc(100% - 52px) !important;
  padding: 0px !important;
}
</style>
