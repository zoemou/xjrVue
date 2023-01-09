<template>
  <div id="designer-host"></div>
</template>

<script>
import { Designer as ReportDesigner } from "@grapecity/activereports/reportdesigner";
import {
  getReportContent,
  getReportContentById,
  addReport,
  modifyReport,
} from "@/api/report/reportcontentmanager";
import "@grapecity/activereports-localization/dist/designer/zh-locale";
// import id from "element-ui/src/locale/lang/id";




export default {
  name: "DesignerHost",
  props: ["id", "name"],
  data() {
    return {};
  },
  mounted: function () {
    const designer = new ReportDesigner("#designer-host", { language: "zh" });

    if(this.id){
        getReportContentById(this.id).then(res => {

          designer.setReport(JSON.parse(res.data.data.F_Content))
        })
    }


    designer.setActionHandlers({
      // onOpen: () =>{
      // },
      onRender:(info)=>{
        localStorage.setItem("previewreport",JSON.stringify(info))
        this.$emit("previewChange",true)
      },
      onSave: function (info) {
      },
      onSaveAs: async (info) => {
        if (this.id) {
          const { value } = await this.$prompt("请输入报表名称", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: this.name,
          });

          info.displayName = value;

          await modifyReport(this.id, {
            F_Name: value,
            F_Content: JSON.stringify(info),
          });

          this.$message({
            type: "success",
            message: "保存成功!",
          });

          return Promise.resolve({ displayName: value });
        } else {
          const { value } = await this.$prompt("请输入报表名称", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          });

          const res = await addReport({
            F_Name: value,
            F_Content: JSON.stringify(info),
          });

          this.id = res.data.data;
          this.name = value;
          this.$message({
            type: "success",
            message: "保存成功!",
          });

          return Promise.resolve({ id: this.id, displayName: value });
        }
      },
    });
  },
};
</script>

<style scoped>
#designer-host {
  margin: 0 auto;
  width: 100%;
  height: 100vh;
}
</style>
<style src="../../../node_modules/@grapecity/activereports/styles/ar-js-ui.css"></style>
<style src="../../../node_modules/@grapecity/activereports/styles/ar-js-designer.css" ></style>
