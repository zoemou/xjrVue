<template>
  <div class="baseinfo-form">
    <el-form
      :rules="rules"
      ref="elForm"
      :model="menuForm"
      label-width="80px"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col :span="12" v-show="hasFormPermission('F_StampName')">
          <el-form-item prop="F_StampName" :label="$t('workFlow.addStamp.labelSName')">
            <el-input :placeholder="$t('workFlow.addStamp.placeholderSName')" size="small" v-model="menuForm.F_StampName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="hasFormPermission('F_StampType')">
          <el-form-item prop="F_StampType" :label="$t('workFlow.addStamp.labelSClassify')">
            <el-select
              v-model="menuForm.F_StampType"
              :placeholder="$t('workFlow.addStamp.placeholderSClassify')"
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in menuTree"
                :key="item.F_ItemValue"
                :label="item.F_ItemName"
                :value="item.F_ItemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-show="hasFormPermission('F_Password')">
          <el-form-item prop="F_Password" :label="$t('workFlow.addStamp.labelPassword')">
            <el-input
              :placeholder="$t('workFlow.addStamp.placeholderPassword')"
              size="small"
              type="password"
              v-model="menuForm.F_Password"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="hasFormPermission('F_Sort')">
          <el-form-item prop="F_Sort" :label="$t('workFlow.addStamp.labelSort')">
            <el-input :placeholder="$t('workFlow.addStamp.placeholderSort')" size="small" type="number" v-model="menuForm.F_Sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_File_Type')">
          <el-form-item prop="F_File_Type" :label="$t('workFlow.addStamp.labelSType')">
            <el-radio-group v-model="menuForm.F_File_Type" @change="fileTypeChange">
              <el-radio :label="1">{{$t('workFlow.addStamp.radioUpload')}}</el-radio>
              <el-radio :label="2">{{$t('workFlow.addStamp.radioHandwrit')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_File')">
          <el-form-item prop="F_File" :label="menuForm.F_File_Type==1?$t('workFlow.addStamp.labelUpload'):$t('workFlow.addStamp.labelHandwrit')" class="file-box">
            <label for="file" class="avatar-uploader" v-if="menuForm.F_File_Type==1">
              <img v-if="imgFile" :src="baseUrl+imgFile" class="avatar" />
              <div v-else>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <span class="file-text">{{$t('workFlow.addStamp.radioUpload')}}</span>
              </div>
              <input
                type="file"
                name="file"
                id="file"
                @change="beforeUpload('inputer')"
                ref="inputer"
                accept="image/*"
                style="display:none;"
              />
            </label>
            <div @click="openSign" class="avatar-uploader" v-if="menuForm.F_File_Type==2">
              <img v-if="signatureFile" :src="baseUrl+signatureFile" class="avatar" />
              <div v-else>
                <i class="el-icon-edit-outline avatar-uploader-icon"></i>
                <span>{{$t('workFlow.addStamp.clickSignBtn')}}</span>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_Description')">
          <el-form-item :label="$t('workFlow.addStamp.labelRemark')" prop="F_Description">
            <el-input
              type="textarea"
              :placeholder="$t('workFlow.addStamp.placeholderRemark')"
              size="small"
              v-model="menuForm.F_Description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.addStamp.radioHandwrit')"
      :append-to-body="true"
      :before-close="handleCloseTwo"
      :visible.sync="signVisible"
      :close-on-click-modal="false"
      width="650px"
    >
      <avue-sign  ref="sign"></avue-sign>
	   <span slot="footer" class="dialog-footer">
		<el-button size="mini" @click="$refs.sign.clear()">{{$t('workFlow.addStamp.emptyBtn')}}</el-button>   
		<el-button type="primary" size="mini" @click="handleSubmit">{{$t('workFlow.addStamp.generatedBtn')}}</el-button>
		
	  </span>
	  
    </el-dialog>
  </div>
</template>

<script>
import { getDictCateByCode } from "@/api/language/dictionary";
import {
  addStamps,
  updateStamps,
} from "@/api/workFlow/stamp";
import {validateLength,validateDesLength,validateSort} from "@/api/organization/validateFunc";
import authorizeMixin from "@/mixins/authorize";
import {formValidateNotice} from '@/util/util';
import { baseUrl } from '@/config/env';
export default {
  name: "AddStamp",
  mixins:[authorizeMixin],
  props: {
    StampId: {
      type: String,
    },
    stampType: {
      type: Number,
    },
	fromEnCodelist:[],
    menuForm: {
      type: Object,
      default: function () {
        return {
          F_StampName: "",
          F_StampType: null,
          F_Password: "",
          F_Sort: "",
          F_File_Type: 1,
          F_File: "",
          F_Description: "",
          F_StampAttributes: 0,
        };
      },
    },
    menuTree: {
      type: Array,
      default:()=>{
        return []
      }
    },
  },
  data() {
    var valiIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.hasimg) {
        callback(new Error(this.$t('workFlow.addStamp.hintuploadImg')));
      } else {
        callback();
      }
    };
    return {
      hasimg: false,
      imgFile:"",
      signatureFile:"",
      signVisible: false,
      rules: {
        F_StampName: [
          { required: true, message: this.$t('workFlow.addStamp.placeholderSName'), trigger: "change" },
          { validator: validateLength,trigger:'change'}
        ],
        F_StampType: [
          { required: true, message:this.$t('workFlow.addStamp.labelSClassify'), trigger: "change" },
        ],
        F_Password: [
          { required: true, message:this.$t('workFlow.addStamp.placeholderPassword'), trigger: "change" },
          { min:6,max:10,message:this.$t('passwordLengthMustLeast6Characters'),trigger:'change'}
        ],
        F_File: [{ required: true, validator: valiIcon}],
        F_Sort: [{  required: true,message:this.$t('workFlow.categoryList.placeholderSort'),validator:validateSort,trigger:'change'}],
        F_Description: [{ validator:validateDesLength,trigger:'change'}]
      },
    };
  },
  async created() {
    await this.getDictCateByCode("StampType");
    //if(this.menuForm.F_StampId){
      this.imgFile =
      this.menuForm && this.menuForm.F_File_Type == 1
        ? this.menuForm.F_File
        : "";
    this.signatureFile =
      this.menuForm && this.menuForm.F_File_Type == 2
        ? this.menuForm.F_File
        : "";
    if(this.imgFile!=''|| this.signatureFile!=''){
      this.hasimg = true;
    }
    //}
       
  },
  methods: {
	hasFormPermission(encode){
	  if(this.formEnCodeList==undefined||Object.keys(this.formEnCodeList).length===0){
		  return true;
	  }else{
		  if(this.formEnCodeList&&this.formEnCodeList[encode]){
			return true;
		  }else{
			return false;
		  }
	  }
	},
    async getDictCateByCode(code) {
      let res = await getDictCateByCode(code);
      if(res&&res.data.success){
         this.menuTree = res.data.data;
      }
    },
    async userFormSubmit(callback) {
      let valid = this.validateData();
      if (this.stampType !== undefined)
        this.menuForm.F_StampAttributes = this.stampType; //切换签章类型 byFeikeq
      if (valid.flag) {
        try {
          if (this.StampId) {
          // 修改
          let result = await updateStamps(this.StampId, this.menuForm);
            let res = result.data;
            if (res.success) {
              if (callback) {
                callback(res.data);
              }
            }
           
        } else {
          // 添加
          let result = await addStamps(this.menuForm);
            let res = result.data;
            if (res.success) {
              if (callback) {
                callback(res.data);
              }
            } else {
              this.$notify({
                title:this.$t('deletePrompt.promptTitle'),
                message: this.$t('workFlow.addStamp.hintAddFailure'),
                type: "error",
              });
			  callback(res.data);
            }
            
        }
        } catch (error) {
          callback();
        }
        
      }else{
		  formValidateNotice(valid.obj,this,this.formEnCodeList)
		  callback();
	  }
    },

    fileTypeChange(val) {
      if (val == 1){
		  this.hasimg = this.imgFile ? true : false;
		  this.menuForm.F_File=this.imgFile
	  }else{
		  this.hasimg = this.signatureFile ? true : false;
		  this.menuForm.F_File=this.signatureFile
	  } 
	  this.$refs["elForm"].validateField(('F_File'))
    },
		//base64转文件
		dataURLtoFile (dataurl, filename) {
		  var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		  while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		  }
		  return new File([u8arr], filename, { type: mime });
		},

    async beforeUpload(str) {
      let reader = new FileReader();
      let inputDOM = this.$refs[str];
      // 通过DOM取文件数据
      let file = inputDOM.files;
      if (file[0]) {
        let size = Math.floor(file[0].size / 1024);

        if (size > 5 * 1024 * 1024) {
          this.$message.error(this.$t('workFlow.addStamp.hintError'));
        } else {
					await this.uploadImg(file[0])
      //     reader.onload = function (e) {
      //       self.imgFile = e.target.result;
      //       self.menuForm.F_File = self.imgFile;
					
      //     };
      //     reader.readAsDataURL(file[0]);
        }
      }
    },
		async uploadImg(file){
			var formdata = new FormData();
			formdata.append('file', file)
			
			try{
				let res=await axios.post(baseUrl + '/upload', formdata, {
				  headers: {
					"Content-Type": "multipart/form-data"
				  }
				})
				const data = res.data.data;
				this.menuForm.F_File=data.FileUrl[0]
				this.menuForm.F_File_Type==1?this.imgFile = data.FileUrl[0]:this.signatureFile=data.FileUrl[0];		
				this.hasimg = true;
				this.$refs.elForm.validateField(('F_File'))
			}catch(e){
				this.$message.error(this.$t('deletePrompt.savedFailure'))
			}
		},
    openSign() {
      this.signVisible = true;
    },
    handleCloseTwo() {
      this.signVisible = false;
    },
    handleSubmit() {
      this.signatureFile = this.$refs.sign.submit(80, 50);
      let F_File = this.dataURLtoFile(this.signatureFile,new Date().getTime() + '.jpg');
			this.uploadImg(F_File)
     // this.hasimg = true;
      this.signVisible = false;
			//this.$refs["elForm"].validateField(('F_File'))
    },
    /* 提交表单 */
    validateData() {
      let flag = false;
	  let obj={}
      this.$refs["elForm"].validate((valid,object) => {
        flag = valid;
		obj=object;
      });
      return {flag:flag,obj:obj};
    },
  },
};
</script>

<style scoped>
.avatar-uploader {
  border: 1px solid #dcdfe6;
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 4px;
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  display: block;
  padding-top: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
}
.file-box{
  height: 110px;
}
.file-text{
  color: #606266;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
}
</style>
