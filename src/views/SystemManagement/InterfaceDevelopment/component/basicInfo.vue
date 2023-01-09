<template>
	<div>
		<el-form :model="nodeinfo" :rules="rules" ref="ruleForm" class="demo-ruleForm">
		  <el-form-item :label="$t('workFlow.Start.nodeName')" prop="nodeName">
		    <el-input v-model="nodeinfo.nodeName" :disabled="!nodeinfo.isCustom"></el-input>
		  </el-form-item>
		  <el-form-item :label="$t('logging')" prop="nodeLog" v-if="nodeinfo.nodeLog!==undefined">
		    <el-radio-group v-model="nodeinfo.nodeLog">
		      <el-radio :label="true">{{$t('mobileDev.listRightSide.optionYes')}}</el-radio>
		      <el-radio :label="false">{{$t('mobileDev.listRightSide.optionNo')}}</el-radio>
		    </el-radio-group>
		  </el-form-item>

		</el-form>
	</div>
</template>

<script>
	export default {
		props:['nodeinfo'],
	    data() {
	      return {
	        rules: {}
	      };
	    },
	    methods: {
	      
	    }
	  }
</script>

<style scoped>
	::v-deep .el-radio-group{
		width: 100%;
	}
</style>
