<template>
  <div>
    <!-- <el-form-item>
            <label>节点标识</label>
            <el-input v-model="formInfo.id" disabled></el-input>
          </el-form-item> -->
    <el-form-item>
      <label>{{ $t("workFlow.Start.nodeName") }}</label>
      <el-input v-model="formInfo.name"></el-input>
    </el-form-item>
    <el-form-item>
      <label>{{$t('whetherRecordProcessInfor')}}</label>
        <el-radio-group v-model="formInfo.record">
        <el-radio :label="true">{{$t('workFlow.Process.radioYes')}}</el-radio>
        <el-radio :label="false">{{$t('workFlow.Process.radioNo')}}</el-radio>
      </el-radio-group>
    </el-form-item>
	<!-- <el-form-item>
	  <label>{{$t('curProgress')}}</label>
	  <el-input v-model="formInfo.currentProgress" 
				:max="99" type="number" :min="1"><template slot="append">%</template></el-input>
	</el-form-item> -->
    <el-form-item>
      <label>{{ $t("workFlow.Start.nodeDescr") }}</label>
      <el-input
        v-model="formInfo.documentation"
        type="textarea"
        :rows="4"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <label>{{ $t("workFlow.End.noticeStrategy") }}</label>
      <el-checkbox-group v-model="formInfo.messageTypes">
        <el-checkbox :label="10">{{
          $t("workFlow.End.systemInfor")
        }}</el-checkbox>
        <el-checkbox :label="11">{{
          $t("workFlow.End.shortMessage")
        }}</el-checkbox>
        <el-checkbox :label="12">{{
          $t("workFlow.End.enterpriseWeChat")
        }}</el-checkbox>
        <el-checkbox :label="13">{{ $t("workFlow.End.dingDing") }}</el-checkbox>
        <el-checkbox :label="14">{{ $t("workFlow.End.mailbox") }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    
  </div>
</template>

<script>
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
  	// "formInfo.currentProgress": function(val) {
    //   if (val>=100) {
    //     this.formInfo.currentProgress = 99;
    //   }else if (val<1) {
    //     this.formInfo.currentProgress = '';
    //   }else{
    //   	this.formInfo.currentProgress=parseInt(val) 
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped></style>
