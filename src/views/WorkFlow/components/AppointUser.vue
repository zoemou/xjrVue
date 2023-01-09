<template>
  <div class="appoint-box">
    <el-form :model="formData">
      <el-form-item :label="$t('workFlow.appointUser.labelTask') +schemeName + $t('workFlow.appointUser.labelCurrent')">
        <el-input v-model="formData.currentUser" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('workFlow.appointUser.labelTask') +schemeName + $t('workFlow.appointUser.labelAssign')">
        <div @click="dialogVisible = true" class="el-input__inner">
          {{ formData.settingUser }}
        </div>
      </el-form-item>
    </el-form>
    <span class="footer">
      <el-button size="mini" @click="cancelAssign">{{$t('buttonModule.modalCancelBtn')}}</el-button>
      <el-button 
      size="mini" 
      type="primary" 
      @click="confirmAssign" 
      :loading="flagAppointUser"
      >
      {{flagAppointUser?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
      </el-button>
    </span>
    <elDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title="$t('workFlow.appointUser.titleAddApprover')"
      width="60%"
      :close-on-click-modal="false"
      :fullscreen="false"
      :append-to-body="true"
    >
      <SelectUser
      ref="SelectUser"
        v-if="dialogVisible"
        :disabledUserIds="disabledUserIds"
        :selectedList="selectedList"
      ></SelectUser>
      
    <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible=false">{{$t('buttonModule.modalCancelBtn')}}</el-button>
      <el-button 
      size="mini" 
      type="primary" 
      @click="confirm"
      :loading="flagAppointRole"
      >
      {{flagAppointRole?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
      </el-button>
    </span>
    </elDialog>
  </div>
</template>

<script>
import SelectUser from "@/components/organization/SelectUser";
import {
  getAssign
} from "@/api/workFlow/WFMonitor";
export default {
  props: {
    candidateUsers: {
      type: Array,
      default: () => {
        return [];
      },
    },
    schemeName: {
      type: String,
      default: () => {
        return "用户任务";
      },
    },
	taskId: {
	  type: String,
	  default: () => {
	    return "";
	  },
	},
  },
  components: {
    SelectUser,
  },
  data() {
    return {
      formData: {
        currentUser: "",
        settingUser: "",
      },
      selectedList: [],
      flagAppointUser: false,
      flagAppointRole: false,
      dialogVisible: false,
    };
  },
  created () {
	getAssign({taskId:this.taskId}).then((res)=>{
		if(res?.data?.data){
			let arr=res.data.data;
			if(Array.isArray(arr)){
				this.formData.currentUser = arr.map(ele=>{
				  return ele.name
				}).join(',');
				this.disabledUserIds = arr.map(ele=>{
				  return ele.userId
				});
			}else{
				this.formData.currentUser=this.$t('workFlow.Process.noCorrespond')
			}
			
		}
	})
  },
  methods: {
    confirm() {
      this.flagAppointRole = true;
      let selectedUserList = this.$refs.SelectUser.getSelectUserList();
      this.selectedList = selectedUserList;
      this.formData.settingUser =selectedUserList.length>0? selectedUserList.map(ele=>{
        return ele.F_RealName
      }).join(','):'';
      this.dialogVisible=false;
      this.flagAppointRole = false;
    },
    cancelAssign(){
      this.flagAppointUser = false;
      this.$emit('closeDialog');
    },
    confirmAssign(){
      this.flagAppointUser = true;
      let assignUserIds = this.selectedList.length>=0? this.selectedList.map(ele=>{
        return ele.F_UserId
      }).join(','):'';
      this.$emit('confirmDialog',assignUserIds);
    }
  },
};
</script>

<style lang="scss" scoped>
.appoint-box {
  position: relative;
  min-height: 400px;
   .footer {
    position: absolute;
    bottom: 0;
    z-index: 12;
    right: 0;
  }
}
</style>
