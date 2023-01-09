<template>
	<div class="upload-box">
		<el-button
		  size="small"
		  @click="excelDialogVisible = true"
		  >{{$t('orgImport.importBtn')}}</el-button
		>
		 <el-dialog :title="$t('orgImport.importBtn')" width="800px" :append-to-body="true" :visible.sync="excelDialogVisible">
			<el-upload
			   class="upload-demo"
			   ref="upload"
			   :data="uploadData"
			   :before-upload="beforeUpload"
			   :on-success="successUpload"
			   :show-file-list="true"
			   drag
			   :headers="headers"
			   accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			   :action="actionUrl">
			   <img src="../../../../../public/img/fast_import.png">
			   <div class="el-upload__text">{{$t('orgImport.dragFile')}}<em>{{$t('orgImport.uploadLink')}}</em></div>
			   <div class="el-upload__tip" slot="tip">{{$t('orgImport.Hint')}}</div>
			</el-upload>
			 <el-row type="flex">
			   <el-col style="text-align:center;">
			    <el-button size="medium" class="download-btn" @click="download"> {{$t('orgImport.downloadBtn')}}</el-button>
			   </el-col>
			 </el-row>
		 </el-dialog>
	</div>
</template>

<script>
export default {
	props: {
		actionUrl: {
		  type: String,
		  default: ""
		},
		headers: {
		  type: Object,
		  default: ()=>{
			  return {}
		  }
		},
		uploadData: {
		  type: Object,
		  default: ()=>{
			  return {}
		  }
		}
	},
	data() {
		return {
			excelDialogVisible: false
		}
	},
	methods: {
		download(){
			this.$emit('download');
		},
		beforeUpload(){
			
		},
		successUpload(res){
			this.$emit('successUpload',res);
		}
	}
}
</script>

<style scoped>
.upload-box {
  margin-right: 0px;	
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
/deep/ .el-upload__tip{
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