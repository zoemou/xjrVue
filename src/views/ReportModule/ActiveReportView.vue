<template>
  <div style="width: 100%; height: 100vh">
    <ReportViewer language="zh" ref="reportViewer" />
  </div>
</template>

<script>
import { Viewer as ReportViewer } from "@grapecity/activereports-vue";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import "@grapecity/activereports-localization";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/xlsxexport";
import { getReportContentById } from "@/api/report/reportcontentmanager";
import { getToken } from "@/util/auth";
export default {
  name: "ReportViews",
  data() {
    return {};
  },
  components: {
    ReportViewer
  },
  watch: {
    $route(val, oldVal) {
      const urlArry = this.$route.path.split("/");
      const id = urlArry[urlArry.length - 1];

      getReportContentById(id).then(res => {
        const reportObj = JSON.parse(res.data.data.F_Content);
        const params = {
          ReportParams: [{ Name: "token", Value: [ 'Bearer ' + getToken()] }]
        };
        this.$refs.reportViewer
          .Viewer()
          .open(reportObj.definition, params);
      });
    }
  },
  mounted() {
    const urlArry = this.$route.path.split("/");
    const id = urlArry[urlArry.length - 1];

    const params = {
      ReportParams: [{ Name: "token", Value: ['Bearer ' +getToken()] }]
    };
    getReportContentById(id).then(res => {
      const reportObj = JSON.parse(res.data.data.F_Content);
      this.$refs.reportViewer
        .Viewer()
        .open(reportObj.definition, params);
    });
  }
  // created() {

  // }
};
</script>
