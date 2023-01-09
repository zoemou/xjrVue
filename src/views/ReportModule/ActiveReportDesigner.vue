<template>
  <div>
    <DesignerHost :id="id" @previewChange="changePreview" />
    <el-dialog v-dialogDrag
      title="预览"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="isPreview"
      fullscreen
      width="100%"
      :before-close="handleClose"
    >
      <div style="width: 100%; height: 100vh">
        <ReportViewer language="zh" ref="reportViewer" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DesignerHost from "@/components/reportDesigner/DesignerHost.vue";

import { Viewer as ReportViewer } from "@grapecity/activereports-vue";


import { getToken } from '@/util/auth';

export default {
  name: "App",
  components: {
    DesignerHost,
    ReportViewer
  },
  data() {
    return {
      id: "",
      isPreview: false
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  //   mounted(){
  //        this.$refs.reportViewer.Viewer()
  //   },
  methods: {
    changePreview() {
      this.isPreview = true;

      //必须得要等查看器组件渲染完成才能  打开报表文件  所以这里得需要settimeout
      setTimeout(() => {
        const reportObj = JSON.parse(localStorage.getItem("previewreport"));
        const params = {
          ReportParams: [{ Name: "token", Value: ['Bearer ' +getToken()] }]
        };

        this.$refs.reportViewer
          .Viewer()
          .open(reportObj.definition, params);
      }, 200);
    }
  }
};
</script>
<style src="../../../node_modules/@grapecity/activereports/styles/ar-js-ui.css"></style>
<style src="../../../node_modules/@grapecity/activereports/styles/ar-js-viewer.css" ></style>

