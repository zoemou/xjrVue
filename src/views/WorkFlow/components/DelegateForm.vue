<template>
  <div class="form-box">
    <el-form
      :rules="rules"
      ref="dataForm"
      :model="dataForm"
      label-width="75px"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_ToUserName')">
          <el-form-item prop="F_ToUserName" :label="$t('workFlow.delegateForm.labelEntrusted')">
						<el-input
						:placeholder="$t('pleaseSelectADelegate')"
						  size="small"
						  v-model="dataForm.F_ToUserName"
							readonly
							 @focus="showPrincipal"
						></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-show="hasFormPermission('F_BeginDate')">
          <el-form-item prop="F_BeginDate" :label="$t('workFlow.delegateForm.labelStartDate')">
            <el-date-picker
              v-model="dataForm.F_BeginDate"
              type="datetime"
              :placeholder="$t('workFlow.delegateForm.selectDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="hasFormPermission('F_EndDate')">
          <el-form-item prop="F_EndDate" :label="$t('workFlow.delegateForm.labelEndDate')">
            <el-date-picker
              v-model="dataForm.F_EndDate"
              type="datetime"
              :placeholder="$t('workFlow.delegateForm.selectDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_Description')">
          <el-form-item :label="$t('workFlow.delegateForm.labelDescr')" prop="F_Description">
            <el-input
              :placeholder="$t('workFlow.delegateForm.placeholderDescr')"
              size="small"
              v-model="dataForm.F_Description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <LaunchList
      ref="LaunchList"
      style="height: 100%;"
      :showLeftTree="false"
      :showSearch="true"
      :isSingle="false"
      :selectList="nwfSchemeInfoIdList"
    ></LaunchList>
    <SelectPrincipal v-if="dialogVisible" :selectedList="selectedList" 
    @changePrincipal="changePrincipal"
    @closePrincipal="closePrincipal"
    ></SelectPrincipal>
    <span class="footer">
      <el-button 
      size="mini" 
      type="primary" 
      @click="sumbit" 
      :loading="flagDelegate"
      >{{flagDelegate?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
    </span>
  </div>
</template>

<script>
import LaunchList from "@/components/workflow/LaunchList";
import SelectPrincipal from "./flow/SelectPrincipal";
import { getMultiMaintainerUser } from "@/api/organization/user.js";
import {validateDesLength} from "@/api/organization/validateFunc";
import authorizeMixin from "@/mixins/authorize";
import {formValidateNotice} from '@/util/util';
export default {
  mixins:[authorizeMixin],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          F_ToUserId: "",
          F_ToUserName: "",
          F_BeginDate: "",
          F_EndDate: "",
          F_Description: "",
          F_SchemeInfo: [],
          F_Id: "",
        };
      },
    },
  },
  components: {
    LaunchList,
    SelectPrincipal,
  },
  data() {
    return {
      dataForm: {
        F_ToUserId: "",
        F_ToUserName: "",
        F_BeginDate: "",
        F_EndDate: "",
        F_Description: "",
        F_SchemeInfo: [],
        F_Id: "",
      },
      rules: {
        F_ToUserName: [
          { required: true, message:this.$t('workFlow.delegateForm.hintEntrusted'), trigger: "change" },
        ],
        F_BeginDate: [
          { required: true, message:this.$t('workFlow.delegateForm.hintStartDate'), trigger: "blur" },
        ],
        F_EndDate: [
          { required: true, message:this.$t('workFlow.delegateForm.hintEndDate'), trigger: "blur" },
        ],
        F_Description: [{ validator: validateDesLength,trigger:'change'}]
      },
      nwfSchemeInfoIdList: [],
      selectedList: [],
      flagDelegate: false,
      dialogVisible: false, 
    };
  },
  created() {
    this.dataForm = this.formData;
    if(this.formData&&this.formData.nwfSchemeInfoIdList&&this.formData.nwfSchemeInfoIdList.length>0){
      this.nwfSchemeInfoIdList = this.formData.nwfSchemeInfoIdList;
    }
    if (this.dataForm.F_ToUserId) {
      getMultiMaintainerUser(this.dataForm.F_ToUserId).then((res) => {
        if (res.data.data.length > 0) {
          res.data.data.forEach((el) => {
            this.selectedList.push(el.UserInfo);
          });
        }
      });
    }
    //
  },
  methods: {
    sumbit() {
      this.flagDelegate = true;
      this.$refs["dataForm"].validate((valid,object) => {
        if (valid) {
          if (this.dataForm.F_BeginDate >= this.dataForm.F_EndDate) {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: '结束时间需晚于开始时间',
              type: "error",
            });
            this.flagDelegate = false;
            return
          }
          let infoList = this.$refs.LaunchList.getCheckedList();
          this.dataForm.F_SchemeInfo = infoList;
          if(this.dataForm.nwfSchemeInfoIdList){
          let {$index,nwfSchemeInfoIdList,...params} = this.dataForm;
          this.$emit("submit", params);
          }else{ 
            
            this.$emit("submit", this.dataForm);
          } 
					this.flagDelegate = false;
        } else{
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagDelegate = false;
        }
      });
      return false;
    },
    async showPrincipal(){
      this.selectedList = [];
      if (this.dataForm.F_ToUserId) {
        let res = await getMultiMaintainerUser(this.dataForm.F_ToUserId);
      if (res.data.data.length > 0) {
          res.data.data.forEach((el) => {
            this.selectedList.push(el.UserInfo);
          });
        }
        this.dialogVisible = true;
    }else{
       this.dialogVisible = true;
    }
     
    },
    closePrincipal(){
      this.dialogVisible = false;
    },
    changePrincipal(selectList){
      this.dataForm.F_ToUserId = selectList
        .map((ele) => {
          return ele.F_UserId;
        })
        .join(",");
      this.dataForm.F_ToUserName = selectList
        .map((ele) => {
          return ele.F_RealName;
        })
        .join(",");
      this.dialogVisible = false;
    }
  },
};
</script>

<style scoped>
.form-box {
  overflow: scroll;
  position: relative;
      padding-bottom: 40px;
}
.footer {
  position: absolute;
  right: 10px;
  bottom: 0px;
}
 div /deep/ .main-table-content{
	/* height: 400px; */
	padding-bottom: 20px;
}
@media screen and (max-width: 1370px) {
	 div /deep/ .main-table-content{
		/* height: 215px; */
	}
	 div /deep/ .main-table{
		min-height:auto!important;
	}
	 div /deep/ .el-dialog{
		margin-top: 10vh!important;
	}
}
</style>
