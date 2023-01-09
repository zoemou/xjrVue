<script>
const DEFAULT_IMG_ICON = "/img/icon.png";
import emitter from "element-ui/src/mixins/emitter";
import { baseUrl } from "@/config/env";
import { delSingleAction, getFileList } from "@/api/code/form";
import request from "@/router/axios";
import { getToken } from "@/util/auth";
import { previewUrl } from "@/config/env";
export default {
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ""
    },
    listType: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      fileList: [],
      action: "",
      list: [],
      fileListTemplate: [],
      listTemplate: [],
      folderId: "",
      showFileList: false,
      autoUpload: true,
      dialogTemplate: null,
      dialogVisible: false,
      accept: "",
      multiple: false,
      showTip: false,
      fileSize: 2,
      sizeUnit: "MB",
      buttonText: "上传"	,
	    uploadDisabled:false
    };
  },
  watch: {
    value(newValue) {
      this.folderId = newValue;
      if (this.folderId) {
        this.fileList = [];
        this.initList();
      }
      this.dispatch("ElFormItem", "el.form.change", [this.folderId]);
    },
    config: {
      handler(newValue) {
        let {
          accept,
          multiple,
          showTip,
          fileSize,
          sizeUnit,
          buttonText
        } = newValue;
        this.accept = accept;
        this.multiple = multiple;
        this.showTip = showTip;
        this.fileSize = fileSize;
        this.sizeUnit = sizeUnit;
        this.buttonText = buttonText;
        this.getRenderListType();
      },
      deep: true
    },
    listType(newValue) {
      this.getRenderListType();
    },
    fileList(newValue) {
      this.changeFileListTemplate();
    }
  },
  mounted() {
    if(typeof this.folderId =='string'){
      this.folderId = this.value;
      if (this.folderId) {
        this.initList();
      }else{
        this.folderId = this.randomString(10)+Date.now()+this.randomString(9);
      }
    }
    let {
      accept,
      multiple,
      showTip,
      fileSize,
      sizeUnit,
      buttonText,
	  disabled
    } = this.config;
    this.accept = accept;
    this.multiple = multiple;
    this.showTip = showTip;
    this.fileSize = fileSize;
    this.sizeUnit = sizeUnit;
    this.buttonText = buttonText;
    this.getRenderListType();
		this.uploadDisabled=disabled;
    //工作流中没有编辑权限
    if(this.config.edit==false){
      this.uploadDisabled=true;
    }
    //工作流 系统表单中
    if(this.disabled==true){
       this.uploadDisabled=true;
    }

  },
  render: function(h) {
    return (
      <div class="custom-upload-box">
        <el-upload
          action=""
          accept={this.accept}
          list-type={this.listType}
          http-request={this.submitUpload}
          multiple={this.multiple}
          disabled={this.uploadDisabled}
          auto-upload={this.autoUpload}
          show-file-list={this.showFileList}
          file-list={this.fileList}
        >
          {this.listTemplate}
        </el-upload>
        {this.fileListTemplate}
        {this.dialogTemplate}
      </div>
    );
  },
  methods: {
    getRenderListType() {
      this.listTemplate = [];
      if (this.listType === "picture-card") {
        this.listTemplate.push(<i slot="default" class="el-icon-plus"></i>);
      } else {
        this.listTemplate.push(
          <el-button type="primary" icon="el-icon-upload">
            {this.buttonText}
          </el-button>
        );
      }
      this.changeFileListTemplate();
      if (this.showTip) {
        this.listTemplate.push(
          <div slot="tip" class="el-upload__tip">
            只能上传不超过 {this.fileSize}
            {this.sizeUnit} 的{this.accept}文件
          </div>
        );
      }
    },
    previewFile(fileUrl, fileName) {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let slot = null;
      console.log("sssss",fileUrl)
      var encodeUrl = previewUrl + encodeURIComponent(Base64.encode(fileUrl)); //(4.09以上版本)这里反斜杠必须有

      slot = <iframe src={encodeUrl} class="iframe-box"></iframe>;
      // if (this.isImgTypeFromFileName(fileName)) {
      //   slot = <img src={fileUrl} />;
      // } else {
      //   slot = <iframe src={previewUrl + base64} class="iframe-box"></iframe>;
      // }
      this.dialogTemplate = (
        <div class="preview-dialog-box">
          <div
            class="show-box"
            on-click={() => {
              this.dialogTemplate = null;
            }}
          >
            {slot}
            <i
              class="el-dialog__close el-icon el-icon-close"
              on-click={() => {
                this.dialogTemplate = null;
              }}
            ></i>
          </div>
        </div>
      );
      loading.close();
    },
    initList() {
      if(typeof this.folderId =='string'){
        getFileList(this.folderId).then(res => {
          this.fileList = [];
        if (res.data.data.length > 0) {
          res.data.data.forEach((ele, i) => {
            let type = this.getType(ele.F_FileName);
            const item = {
              index: i,
              name: ele.F_FileName,
              id: ele.F_Id,
              url: baseUrl + ele.url,
              address: ele.address.includes("http://") || ele.address.includes("https://") ? ele.address : baseUrl + ele.address,
              imgUrl: this.getIconImg(type, baseUrl + ele.url)
            };
            this.fileList.push(item);
          });
        }
      });
      }
      
    },
    changeFileListTemplate() {
      if (this.listType === "picture-card") {
        this.fileListTemplate = (
          <ul class="el-upload-list el-upload-list--picture-card">
            {this.getPictureCardListTemplate()}
          </ul>
        );
      } else if (this.listType === "picture") {
        this.fileListTemplate = (
          <ul class="el-upload-list el-upload-list--picture">
            {this.getPictureListTemplate()}
          </ul>
        );
      } else {
        this.fileListTemplate = (
          <ul class="el-upload-list el-upload-list--text">
            {this.getFileListTemplate()}
          </ul>
        );
      }
    },
    getPictureListTemplate() {
      let fileListTemplate = [];
      if (this.fileList && this.fileList.length > 0) {
        this.fileList.forEach((element, index) => {
          let deleteIconTemplate = null;
          if (!this.uploadDisabled) {
            deleteIconTemplate = (
              <i
                class="el-icon-close"
                onClick={$event => {
                  $event.stopPropagation();
                  this.delFile(element);
                }}
              ></i>
            );
          }
          fileListTemplate.push(
            <li
              tabindex={index}
              class="el-upload-list__item is-success"
              data-url={element.url}
            >
              <img
                src={element.imgUrl}
                alt=""
                class="el-upload-list__item-thumbnail"
              />
              <a class="el-upload-list__item-name">
                <i class="el-icon-document"></i>
                <span
                  class="preview-name"
                  onClick={$event => {
                    $event.stopPropagation();
                    if (element.imgUrl == DEFAULT_IMG_ICON) {
                      this.$notify({
                        title: "提示",
                        message: "暂不支持预览！",
                        type: "warning"
                      });
                    } else {
                      this.previewFile(element.address, element.name);
                    }
                  }}
                >
                  {" "}
                  {element.name}
                </span>
                <span
                  class="down-icon"
                  onClick={$event => {
                    $event.stopPropagation();
                    if (element.imgUrl == DEFAULT_IMG_ICON) {
                      this.$notify({
                        title: "提示",
                        message: "暂不支持此文件类型下载！",
                        type: "warning"
                      });
                    } else {
                      this.download(element.url, element.name);
                    }
                  }}
                >
                  【下载】
                </span>
              </a>
              <label class="el-upload-list__item-status-label">
                <i class="el-icon-upload-success el-icon-check"></i>
              </label>
              {deleteIconTemplate}
            </li>
          );
        });
      }
      return fileListTemplate;
    },
    getPictureCardListTemplate() {
      let fileListTemplate = [];
      if (this.fileList && this.fileList.length > 0) {
        this.fileList.forEach((element, index) => {
          let deleteIconTemplate = null;
          if (!this.uploadDisabled) {
            deleteIconTemplate = (
              <span class="el-upload-list__item-delete">
                <i
                  class="el-icon-delete"
                  onClick={$event => {
                    $event.stopPropagation();
                    this.delFile(element);
                  }}
                ></i>
              </span>
            );
          }
          fileListTemplate.push(
            <li tabindex={index} class="el-upload-list__item is-success">
              <img
                src={element.imgUrl}
                alt=""
                class="el-upload-list__item-thumbnail"
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  onClick={$event => {
                    $event.stopPropagation();
                    if (element.imgUrl == DEFAULT_IMG_ICON) {
                      this.$notify({
                        title: "提示",
                        message: "暂不支持预览！",
                        type: "warning"
                      });
                    } else {
                      this.previewFile(element.address, element.name);
                    }
                  }}
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete">
                  <i
                    class="el-icon-download"
                    onClick={$event => {
                      $event.stopPropagation();
                      if (element.imgUrl == DEFAULT_IMG_ICON) {
                        this.$notify({
                          title: "提示",
                          message: "暂不支持此文件类型下载！",
                          type: "warning"
                        });
                      } else {
                        this.download(element.url, element.name);
                      }
                    }}
                  ></i>
                </span>
                {deleteIconTemplate}
              </span>
            </li>
          );
        });
      }
      return fileListTemplate;
    },
    getFileListTemplate() {
      let fileListTemplate = [];
      if (this.fileList && this.fileList.length > 0) {
        this.fileList.forEach((element, index) => {
          let deleteIconTemplate = null;
          if (!this.uploadDisabled) {
            deleteIconTemplate = (
              <i
                index={index}
                class="el-icon-close"
                onClick={$event => {
                  $event.stopPropagation();
                  this.delFile(element);
                }}
              ></i>
            );
          }
          fileListTemplate.push(
            <li tabindex={index} class="el-upload-list__item is-success">
              <label class="el-upload-list__item-name">
                <i class="el-icon-document"></i>
                <span
                  class="preview-name"
                  onClick={$event => {
                    $event.stopPropagation();
                    if (element.imgUrl == DEFAULT_IMG_ICON) {
                      this.$notify({
                        title: "提示",
                        message: "暂不支持预览！",
                        type: "warning"
                      });
                    } else {
                      this.previewFile(element.address, element.name);
                    }
                  }}
                >
                  {" "}
                  {element.name}
                </span>
                <span
                  class="down-icon"
                  onClick={$event => {
                    $event.stopPropagation();
                    if (element.imgUrl == DEFAULT_IMG_ICON) {
                      this.$notify({
                        title: "提示",
                        message: "暂不支持此文件类型下载！",
                        type: "warning"
                      });
                    } else {
                      this.download(element.url, element.name);
                    }
                  }}
                >
                  【下载】
                </span>
              </label>
              <label class="el-upload-list__item-status-label">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
              </label>
              {deleteIconTemplate}
            </li>
          );
        });
      }
      return fileListTemplate;
    },
    getIconImg(type, url = "") {
      let imgIcon = DEFAULT_IMG_ICON;
      switch (type) {
        case ".zip":
          imgIcon = "/img/zip.jpg";
          break;
        case ".rar":
          imgIcon = "/img/zip.jpg";
          break;
        case ".ppt":
          imgIcon = "/img/ppt.png";
          break;
        case ".pptx":
          imgIcon = "/img/ppt.png";
          break;
        case ".xls":
          imgIcon = "/img/excel.png";
        case ".xlsx":
          imgIcon = "/img/excel.png";
          break;
        case ".pdf":
          imgIcon = "/img/pdf.png";
          break;
        case ".txt":
          imgIcon = "/img/text.png";
          break;
        case ".docx":
          imgIcon = "/img/word.png";
          break;
        case ".doc":
          imgIcon = "/img/word.png";
          break;
        case ".bmp":
          imgIcon = url;
          break;
        case ".jpg":
          imgIcon = url;
          break;
        case ".jpeg":
          imgIcon = url;
          break;
        case ".png":
          imgIcon = url;
          break;
        case ".gif":
          imgIcon = url;
          break;
        case ".svg":
          imgIcon = url;
          break;
        default:
          break;
      }
      return imgIcon;
    },
    getType(fileName) {
      let type = "";
      type = fileName.substring(fileName.lastIndexOf("."), fileName.length);
      return type;
    },
    async delFile({ id, index }) {
      if (this.uploadDisabled) {
        this.$message("您没有权限删除");
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "删除中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      try {
        let res = await delSingleAction(id);
      if (res.data.success) {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success"
        });
        this.fileList.splice(index, 1);
      } else {
        this.$notify({
          title: "失败",
          message: "删除失败",
          type: "warning"
        });
      }
      this.initList();
      // if (this.fileList.length == 0) {
        // this.value = "";
        // this.$emit("input", this.value);
        // this.$emit("change", this.folderId);
      // }
      setTimeout(() => {
        loading.close();
      }, 1);
      
      } catch (error) {
        loading.close();
      }
      
    },
    isImgTypeFromFileName(fileName) {
      let type = this.getType(fileName);
      let imgType = [".bmp", ".jpg", ".jpeg", ".png", ".gif", ".svg"];
      return imgType.includes(type);
    },
    download(fileUrl, fileName) {
      if (this.uploadDisabled) {
        this.$message("您没有权限下载");
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "下载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      request({
        url: fileUrl,
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
    },
    randomString(len) {
      len = len || 32;
      let chars = 'abcdefhijkmnprstwxyz2345678'; 
      let maxPos = chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    submitUpload(file) {
      if (this.uploadDisabled) {
        this.$message("您没有权限上传");
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
       this.action = baseUrl + "/upload/" + this.folderId;
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("remark", "上传");
      const xhr = new XMLHttpRequest();
      xhr.open("post", this.action, true);
      xhr.setRequestHeader("Authorization", "Bearer " + getToken());
      xhr.onload = res => {
        const response = JSON.parse(xhr.response);
        let count = this.fileList.length;
        response.data.FileUrl.forEach((ele, i) => {
          const item = {
            index: count++,
            name: file.file.name,
            id: response.data.FileIds[i],
            url: baseUrl + ele,
            address: response.data.AddressList[i].includes('http://') || response.data.AddressList[i].includes('https://') ? response.data.AddressList[i] : baseUrl + response.data.AddressList[i],
            imgUrl: this.getIconImg(this.getType(file.file.name), baseUrl + ele)
          };
          this.fileList.push(item);
        });
        if (!this.folderId) {
          this.folderId = response.data.FolderId;
        }
      console.log(this.fileList,"submitUpload")

		this.$emit("input", this.folderId);
    this.$emit("change", this.folderId);
		this.dispatch("ElFormItem", "el.form.change", this.folderId);
        loading.close();
      };
      xhr.onerror = () => {
        this.$notify({
          title: "失败",
          message: "上传失败",
          type: "warning"
        });
        loading.close();
      };
      xhr.ontimeout = function timeout() {
        this.$notify({
          title: "失败",
          message: "上传超时，请刷新重试",
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
.el-upload-list--picture-card {
  position: absolute;
  top: 0;
  left: 158px;
}
.preview-dialog-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
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
  margin: 40px;
}
.preview-name {
  display: inline-block;
  cursor: pointer;
}
.down-icon {
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  color: #409eff;
}
.el-upload-list--picture-card {
  height: 180px;
  overflow: scroll;
}
</style>
