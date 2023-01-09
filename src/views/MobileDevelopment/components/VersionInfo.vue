<template>
  <el-form ref="versionInfoForm" :model="versionInfoForm" :rules="versionInfoRules" label-width="80px">
    <el-form-item :label="$t('workFlow.WFChange.tabVersion')" prop="F_Version">
      <el-input :placeholder="$t('pleaseEnterVersionNumber')" v-model="versionInfoForm.F_Version" :disabled="isDisabled"/>
    </el-form-item>
    <el-form-item :label="$t('versionName')" prop="F_Name">
      <el-input :placeholder="$t('pleaseEnterVersionName')" v-model="versionInfoForm.F_Name" :disabled="isDisabled"/>
    </el-form-item>
    <el-form-item :label="$t('APKUpload')" prop="fileList">
      <el-upload
        ref="upload"
        action="action"
        :auto-upload="false"
        :http-request="httpRequest"
        accept=".apk"
        :on-change="handleChange"
        :before-upload="beforeUpload"
        :multiple="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="versionInfoForm.fileList">
        <el-button size="small" type="primary" icon="el-icon-upload" :disabled="isDisabled">{{$t('code.leftScrollbar.component.clickUpload')}}</el-button>
        <div slot="file" slot-scope="{file}">
          <div class="el-upload-list__item-name">
            <i class="el-icon-document"></i>
            <span>{{file.name}}</span>
            <span class="upload-text" @click="downLoadFile" v-if="!isDisabled">【{{$t('fileManagement.titleDownload')}}】</span>
          </div>
          <label class="el-upload-list__item-status-label" v-if="isShowProgress">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <i class="el-icon-close" @click="deleteFile" v-if="type !== 'view'"></i>
          <el-progress stroke-width="1" :percentage="percentage" v-if="percentage !==100 && isShowProgress"></el-progress>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('changelog')">
      <el-input  
        type="textarea"
        :rows="4" 
        :placeholder="isDisabled ? '' : this.$t('pleaseEnterChangelog')"
        v-model="versionInfoForm.F_UpdateLog"
        :disabled="isDisabled"/>
    </el-form-item>
  </el-form>
</template>

<script>
import { getVersionInfo, addVersionInfo, modifyVersionInfo,downloadFile } from '@/api/mobileBuild/version'
import { deepClone } from "@/util/util";
import { uploadSingleFile } from '@/api/upload'
import { delSingleAction } from "@/api/code/form";
export default {
  name: 'VersionInfo',
  props:['type','versionId','showNotify'],
  data() {
    return {
      percentage: 0,
      versionInfoForm: {
        F_Version: '',
        F_Name: '',
        fileList: [],
        F_FileId:'',
        F_UpdateLog: '',
        F_Url:''
      },
      versionInfoRules: {
        F_Version: [{ required: true, message: this.$t('pleaseChooseEnterVersionNumber'), trigger: 'blur' }],
        F_Name: [{ required: true, message:this.$t('pleaseChooseEnterVersionName'), trigger: 'blur' }],
        fileList: [{ required: true, message: this.$t('pleaseUploadTheAPKFile'), trigger: 'change' }]
      },
      submitForm: {},
      isShowProgress: false,
      oldFileId:'',
    }
  },
  computed: {
    isDisabled(){
      return this.type === 'view'
    }
  },
  watch: {
    type: {
      handler: function (curVal,oldVal) {
        if (curVal !== 'add') {
          this.getVersionInfo()
        }
      },
      immediate:true
    }
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? '' : `${percentage}%`;
    },
    beforeUpload(file) {
      const isApkType = file.type === 'application/vnd.android.package-archive'
      if (!isApkType) {
        this.$message.error(this.$t('onlySupportsUploadingAPKFormat'));
      }
      return isApkType
    },
    handleChange(file, fileList) {
      if (file.status !== 'ready') return;
      this.versionInfoForm.fileList = fileList
      this.$refs.versionInfoForm.validateField('fileList')
    },
    handleExceed() {
      this.$message.error(this.$t('onlyAllowOneFileToUploaded'));
    },
    async httpRequest(file) {
      this.percentage = 0
      const formData = new FormData();
      formData.append("file", file.file || this.versionInfoForm.fileList[0]);
      const onUploadProgress = (progress) => {
        this.percentage = parseInt(100 * (progress.loaded / progress.total))
      }
      this.isShowProgress = true
      try {
        const fileRes = await uploadSingleFile(formData, onUploadProgress)
        this.versionInfoForm.F_Url = fileRes.data.data.AddressList[0]
        this.submitVersionForm(fileRes.data.data.FileIds[0])
      } catch (err) {
        this.$emit('flagStatus',false)
      }
    },
    async downLoadFile() {
      const file = this.versionInfoForm.fileList[0]
      if (file && file.raw) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(file.raw, file.name)
        } else {
          var link = document.createElement('a')
          link.download = file.name
          link.href = window.URL.createObjectURL(file.raw)
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
      } else {
        const onDownloadProgress = (progress) => {
          this.percentage = parseInt(100 * (progress.loaded / progress.total))
        }
        this.isShowProgress = true
        const res = await downloadFile(file.url,onDownloadProgress)
        const ct = res.data;
        let url = window.URL.createObjectURL(
          new Blob([ct], {
            type: "application/octet-stream;charset=utf-8"
          })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    deleteFile() {
      this.versionInfoForm.fileList.splice(0, 1)
    },
    versionInfoSubmit() {
      this.$refs.versionInfoForm.validate(valid => {
        if (valid) {
          this.$emit('flagStatus',true)
          if (this.versionInfoForm.fileList[0].raw) {
            this.$nextTick(() => {
              this.$refs.upload.submit();
            })
          } else {
            this.submitVersionForm()
          }
        }
      })
    },
    async submitVersionForm(FileIds) {
      if (FileIds) this.versionInfoForm.F_FileId = FileIds
      const isAdd = this.type === 'add'
      this.submitForm = deepClone(this.versionInfoForm)
      delete this.submitForm.fileList
      try {
        let versionRes
        if (isAdd) {
          versionRes = await addVersionInfo(this.submitForm)
        } else {
          if (this.oldFileId !== this.submitForm.F_FileId) {
            await delSingleAction(this.oldFileId)
          }
          versionRes = await modifyVersionInfo(this.versionId,this.submitForm)
        }
        this.$emit('submitVersion', true)
        this.$emit('flagStatus',false)
        this.showNotify(versionRes, isAdd ? this.$t('newVersion') : this.$t('editVersion'))
      } catch (err) {
        this.$emit('flagStatus',false)
      }
    },
    async getVersionInfo() {
      const res = await getVersionInfo(this.versionId)
      if (res.data.success) {
        const data = res.data.data
        this.versionInfoForm = {
          F_Version: data.F_Version,
          F_Name: data.F_Name,
          fileList: [{ name: data.F_FileName, url: data.F_FileId }],
          F_FileId: data.F_FileId,
          F_UpdateLog: data.F_UpdateLog
        }
        this.oldFileId = data.F_FileId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 18px !important;
  .el-upload-list__item-name:hover{
    cursor: auto;
    color:#606266;
  }
  .upload-text{
    color: #409EFF;
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>