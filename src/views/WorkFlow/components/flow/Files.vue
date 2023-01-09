<template>
  <div v-if="fileList">
    <el-table
      v-if="hasFileList"
      border
      stripe
      :data="fileList"
      style="width: 100%;"
    >
      <el-table-column type="index" :label="$t('databaseManage.dataLink.tableNumber')" width="50"> </el-table-column>
      <el-table-column
        prop="fileName"
        :label="$t('accessoryName')"
        width="380"
      ></el-table-column>
      <el-table-column prop="fileType" :label="$t('accessoryFormat')"></el-table-column>
      <el-table-column
        prop="fieldsName"
        :label="$t('ownComponent')"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column prop="createTime" :label="$t('uploadTime')"></el-table-column>
      <el-table-column prop="createUserName" :label="$t('uploader')"></el-table-column>
      <el-table-column fixed="right" :label="$t('workFlow.userButtonSetting.tableOperate')" width="130">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="previewFile(scope.row.address, scope.row.fileName)"
            >{{$t('workFlow.historyList.previewBtn')}}</el-button
          >
          <el-button
            @click="download(scope.row.filePath, scope.row.fileName)"
            type="text"
            size="small"
            >{{$t('fileManagement.titleDownload')}}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <avue-empty :desc="$t('deletePrompt.noData')" v-else></avue-empty>
    <el-dialog
      v-dialogDrag
      :title="$t('workFlow.historyList.previewBtn')"
      :visible.sync="dialogVisible"
      width="100%"
      :fullscreen="true"
      :modal="false"
      custom-class="preview-dialog-box"
      :before-close="handleClose"
    >
      <div class="show-box">
        <!-- <img v-if="isImg" :src="fileUrl" /> -->
        <iframe  :src="fileUrl" class="iframe-box"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, previewUrl } from "@/config/env";
import request from "@/router/axios";
export default {
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    hasFileList() {
      return this.fileList && this.fileList.length > 0;
    }
  },
  data() {
    return {
      isImg: false,
      fileUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    formatter(row, column) {
      return row.fieldsName ? row.fieldsName : "";
    },
    previewFile(fileUrl, fileName) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('workFlow.selectLaunch.hintLoading'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      this.isImg = false;
      this.fileUrl = "";

      this.fileUrl =previewUrl +encodeURIComponent(Base64.encode((fileUrl.includes("http://") || fileUrl.includes("https://") ?fileUrl : baseUrl + fileUrl))); 

      // if (this.isImgTypeFromFileName(fileName)) {
      //   this.isImg = true;
      //   this.fileUrl = baseUrl + fileUrl;
      // } else {
      //   this.fileUrl = previewUrl + baseUrl + fileUrl;
      // }
      this.dialogVisible = true;
      loading.close();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    isImgTypeFromFileName(fileName) {
      let type = this.getType(fileName);
      let imgType = [".bmp", ".jpg", ".jpeg", ".png", ".gif", ".svg"];
      return imgType.includes(type);
    },
    getType(fileName) {
      let type = "";
      type = fileName.substring(fileName.lastIndexOf("."), fileName.length);
      return type;
    },
    download(fileUrl, fileName) {
      const loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.WFDesign.hintDownload'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let path = baseUrl + fileUrl;
      request({
        url: path,
        method: "get",
        responseType: "blob"
      }).then(res => {
        const ct = res.data;
        let url = window.URL.createObjectURL(
          new Blob([ct], {
            type: "application/octet-stream;charset=utf-8"
          })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  font-size: 12px;
}
.preview-dialog-box .show-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}
.preview-dialog-box .show-box .el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  color: #000;
  font-size: 24px;
}
.preview-dialog-box .iframe-box {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
