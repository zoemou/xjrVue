<template>
  <div style="height:100%;" 
   class="process_title"
    >
    <WorkFlowLaunchList
    style="height:100%;"
      :showLeftTree="true"
      :showSearch="true"
      :isSingle="true"
      :nwfSchemeInfoIdList="nwfSchemeInfoIdList"
      :nwfRelationId="nwfRelationId"
      @launchProcess="launchProcess"
    >
    </WorkFlowLaunchList>
    <elDialog
      v-if="elDialog.visible"
      :visible.sync="elDialog.visible"
      :title="elDialog.title"
      :width="elDialog.width"
      :append-to-body="elDialog.appendToBody"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="true"
      :destroy-on-close="true"
      :before-close="handleCloseWrap"
    >
      <CreateFLow
        :nwfSchemeInfoId="nwfSchemeInfoId"
        :infoList="infoList"
        :nwfRelationId="nwfRelationId"
		:deploymentId="deploymentId"
        @closeDialog="closeDialog"
      ></CreateFLow>
    </elDialog>
  </div>
</template>
<script>
import WorkFlowLaunchList from "@/components/workflow/WorkFlowLaunchList";
import CreateFLow from "./components/CreateFLow"; //流程发起预览组件
import { getStore } from "@/util/store.js";
// 接口
export default {
  name: "WFLaunch",
  props: {
    showLeftTree: {
      type: Boolean,
      default: true,
    },
    nwfRelationId:'',
     nwfSchemeInfoIdList:{
      type: Array,
      default: ()=>{
        return []
      },
    },
  },
  components: {
    WorkFlowLaunchList,
    CreateFLow
  },
  data() {
    return {
      // 对话框组件
      elDialog: {
        visible: false,
        title: "弹框示题",
        width: "80%",
        appendToBody: true,
      },
      nwfSchemeInfoId:"",
      launchInfo:{
         F_Category:'',
          F_Name:'',
          F_Code:''
      },
	  deploymentId:''
    };
  },
  created () {
  	  /* 获取主题开始 */
  	  let themeName = getStore({ name: "themeName" }) || "default";
  	  this.themeName = themeName;
  	  /* 获取主题结束 */
  },
  mounted () {
    //系统表单依赖localStorage清空
    window.localStorage.setItem("lookSystemForm", 0);
  },
  methods: {
    closeDialog() {
      this.elDialog.visible = false;
    },
    launchProcess(item) {
      this.elDialog.title = this.$t('workFlow.createFLow.hintLaunchFlow')+"【" + item.F_Name + "】";
      this.nwfSchemeInfoId = item.F_Id;
	  this.deploymentId=item.F_DeploymentId;
      //增加暗色主题，保留样式类
      document.body.className = document.body.className + ' original';
      let {F_Category,F_Name,F_Code} = item;
     this.infoList=[
      {title:this.$t('workFlow.WFLaunch.stampCode'),value:F_Code},
      {title:this.$t('workFlow.WFLaunch.stampName'),value:F_Name},
      {title:this.$t('workFlow.WFLaunch.stampCategory'),value:F_Category}
    ];
      this.elDialog.visible = true;
    },
    handleCloseWrap() {
      //删除暗色兼容样式类
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');
      this.elDialog.visible = false;
    }
  },
};
</script>
<style scoped>
 .eveningTheme .process_title div /deep/ .main-content .main-box, .eveningTheme .process_title div /deep/ .main-content{
		background-image:none!important;
	}
</style>
