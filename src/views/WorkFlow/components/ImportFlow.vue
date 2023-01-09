<template>
  <div class="upload-box">
    <el-upload
      class="upload-box"
      name="processFile"
      drag
      :action="action"
      :show-file-list="false"
      :http-request="submitUpload"
      multiple
    >
      <img src="../../../../public/img/process_import.png">
      <div class="el-upload__text">{{$t('orgImport.dragFile')}}<em>{{$t('orgImport.uploadLink')}}</em></div>
    </el-upload>
  </div>
</template>

<script>
import { baseUrl } from "@/config/env";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { getStore } from "@/util/store";

export default {
  props: {
    importType: {
      type: String,
      default: () => {
        return "bpmn";
      }
    }
  },
  data() {
    return {
      action: ""
    };
  },
  created() {
    let importAction =
      baseUrl +
      "/workflow-scheme-info/" +
      (this.importType == "bpmn" ? "import-xml" : "import-json");
    this.action = importAction;
  },
  methods: {
    submitUpload(file) {
      const loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.importFlow.hintUpload'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });

      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("remark", "上传");
      const xhr = new XMLHttpRequest();
      xhr.open("post", this.action, true);
      if (website.netFlowableEnable) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + getStore({ name: "flowabletoken" })
        );
      } else {
        xhr.setRequestHeader("Authorization", "Bearer " + getToken());
      }

      xhr.onload = res => {
        loading.close();
        let response = JSON.parse(xhr.response);
        if (this.importType == "bpmn") {
          let xml = response.data[0];
          this.$emit("createBpmn", { json: "{}", xml: xml });
        } else {
          let json = response.data[0];
          let xml = response.data[1];
          this.$emit("createBpmn", { json, xml });
        }
      };
      xhr.onerror = () => {
        this.$notify({
          title:this.$t('deletePrompt.failureTitle'),
          message:this.$t('workFlow.importFlow.hintUploadFailed'),
          type: "warning"
        });
        loading.close();
      };
      xhr.ontimeout = function timeout() {
        this.$notify({
          title:this.$t('deletePrompt.failureTitle'),
          message:this.$t('workFlow.importFlow.hintRefresh'),
          type: "warning"
        });
        loading.close();
      };
      xhr.send(formData);
    }
  }
};
</script>

<style scoped>
/deep/ .upload-box {
   margin-left: 73px;
  display: inline-block;
}
.upload-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/deep/ .el-upload-dragger{
	width: 615px;
	height: 370px;
	border:none;
}
/deep/ .el-upload__text{
	position: absolute;
	bottom: 32px;
	right: 100px;
	font-weight: bold;
	color: #1d2027;
}
</style>

