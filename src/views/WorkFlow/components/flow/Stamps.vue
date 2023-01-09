<template>
  <div v-if="showStampsBox">
    <el-select
      :placeholder="$t('workFlow.addStamp.selectSignature')"
      v-model="formData.esignature"
      class="stamps-box"
    >
      <el-option
        v-for="(item, index) in stampsList"
        :key="index"
        :label="item.F_StampName"
        :value="item.F_StampId"
      ></el-option>
    </el-select>
    <el-button
      size="small"
      icon="fa fa-plus"
       @click="dialog.visible=true"
      
    ></el-button>
    <elDialog
      :visible.sync="dialog.visible"
      :title="$t('workFlow.privateStampInfo.titleAddStamp')"
      width="80%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <AddStamp
        v-if="dialog.visible"
        ref="AddStamp"
        :stampType="0"
		:menuForm="menuForm"
      ></AddStamp>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialog.visible = false">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </elDialog>
  </div>
</template>

<script>
import AddStamp from "@/views/WorkFlow/AddStamp";
import {
  getApprovalStamps
} from "@/api/workFlow/WFLaunch";
  export default {
    props: {
      formData: {
        type: Object,
        default: ()=>{
          return {}
        }
      },
    },
    components: {
      AddStamp,
    },
    data() {
      return {
        dialog: {
          visible:false
        },
        stampsList:[],
        loading:null,
        showStampsBox:false,
		menuForm: {
		  F_StampName: "",
		  F_StampType: null,
		  F_Password: "",
		  F_Sort: "",
		  F_File_Type: 1,
		  F_File: "",
		  F_Description: "",
		  F_StampAttributes:0,
		},
      }
    },
    created () {
      this.getStampList();
    },
    methods: {
      // 获取签章 列表
    async getStampList() {
      this.loading = this.$loading({
      lock: true,
      text:this.$t('workFlow.addStamp.loadingSignature'),
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)"
    });
    try {
      let result = await getApprovalStamps();
      if (result.data.success) {
          this.stampsList = [...[{F_StampId:'',F_StampName:this.$t('workFlow.addStamp.selectSignature')}],...result.data.data];
          let defaultStampsList = this.stampsList.filter(ele=>{
            return ele.F_StampAttributes==1
          });
          if(defaultStampsList.length>0){
            this.formData.esignature = defaultStampsList[0].F_StampId;
          }
        }
        this.showStampsBox = true;
        this.loading.close();
    } catch (error) {
      this.showStampsBox = true;
       this.loading.close();
    }
    },
      async submitDialog() {
        try {
          await this.$refs.AddStamp.userFormSubmit();
          this.dialog.visible = false;
          await this.getStampList();
        } catch (error) {
          
        }
     
      }
    },
  }
</script>

<style lang="scss" scoped>
.stamps-box{
  width: calc(100% - 44px);
}
</style>