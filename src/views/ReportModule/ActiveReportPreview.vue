<template>
  <div style="width: 100%; height: 100vh">
    <ReportViewer language="zh" ref="reportViewer" />
  </div>
</template>

<script>
import { Viewer as ReportViewer } from "@grapecity/activereports-vue";
import "@grapecity/activereports/styles/ar-js-viewer.css";
export default {
  name: "ReportViews",
  data() {
    return { reportIframe: "" };
  },
  components: {
    ReportViewer,
  },
  mounted() {
    const reportObj = JSON.parse(localStorage.getItem("previewreport"));
    
    this.$refs.reportViewer.Viewer().open(reportObj.definition);
  },

};
</script>