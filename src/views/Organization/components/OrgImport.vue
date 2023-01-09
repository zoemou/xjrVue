<template>
  <div class="upload-box">
    <el-button
      size="small"
      @click="excelDialogVisible = true"
      v-if="hasButtonPermission('import')"
      >{{$t('orgImport.importBtn')}}</el-button
    >
    <el-dialog v-dialogDrag
      :close-on-click-modal="false"
      :title="$t('orgImport.importBtn')"
      width="800px"
      :append-to-body="true"
      :visible.sync="excelDialogVisible"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        :data="uploadData"
        :on-success="successUpload"
        :show-file-list="false"
        drag
        :headers="headers"
         accept=".xlsx,.xls"
        :action="importUrl"
      >
        <img src="../../../../public/img/fast_import.png">
        <div class="el-upload__text">{{$t('orgImport.dragFile')}}<em>{{$t('orgImport.uploadLink')}}</em></div>
        <div class="el-upload__tip" slot="tip">
          {{$t('orgImport.Hint')}}
        </div>
      </el-upload>
      <el-row type="flex">
        
           <el-col style="text-align:center;">
            <el-button size="medium" class="download-btn" @click="download" :loading="flagOrgImport">{{$t('orgImport.downloadBtn')}}</el-button>
           </el-col>
         </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from "@/config/env";
import { getToken } from "@/util/auth";
import request from '@/router/axios';
import authorizeMixin from "@/mixins/authorize";
export default {
  mixins:[authorizeMixin],
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      flagOrgImport: false,
      timerDownload: null,
      excelDialogVisible: false,
      importUrl: "",
      headers: {},
      uploadData: { }
    };
  },
  created() {
    this.importUrl = baseUrl + "/org-import/" + this.type;
    this.headers["Authorization"] = "Bearer " + getToken();
  },
  methods: {
    successUpload(res) {
      if (res.success) {
        this.$message.success(res.msg);
      } else {
        this.$message.warning(res.msg);
      }
      this.excelDialogVisible = false;
    },
    download(){ 
      // setTimeout(() => {
        
      // }, timeout);
      this.flagOrgImport = true;
      request({
          url: baseUrl + '/org-import/template/' + this.type,
          method: 'get',
          responseType: 'blob'
      }).then(res =>{
          const ct = res.data
          let url = window.URL.createObjectURL(new Blob([ct],{
            type: "application/octet-stream;charset=utf-8",
          }));
          let excelName = '导入模板.xls';
          switch (this.type) {
            case 'department':
              excelName = '部门导入模板.xls';
              break;
             case 'post':
              excelName = '岗位导入模板.xls';
              break;
               case 'user':
              excelName = '用户导入模板.xls';
              break;
            default:
              excelName = '导入模板.xls';
              break;
          }
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', excelName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); 
            
      }).finally(() => {
          this.timerDownload = setTimeout(() => {
            this.flagOrgImport = false;
          }, 3000);
          this.$once('hook:beforeDestroy',() => {
            clearTimeout(this.timerDownload)
            this.timerDownload = null;
          })
      })
    },

  }
};
</script>

<style scoped>
.upload-box {
  display: inline-block;
}
.upload-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
div /deep/ .el-upload-dragger{
	width: 615px;
	height: 370px;
	border:none;
}
div /deep/ .el-upload__text{
	position: absolute;
	bottom: 32px;
	right: 100px;
	font-weight: bold;
	color: #1d2027;
}
div /deep/ .el-upload__tip{
	top: 295px;
	right: 165px;
	position: absolute;
	color: #829ad2;
}
.download-btn{
	padding:14px 42px;
	margin: 10px auto 0px auto;
	color: #1d2027;
}
</style>
