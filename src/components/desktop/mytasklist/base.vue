<template>
  <div >
	  <el-form-item :label="$t('jumpFunction')">
	  	<el-input :value="$t('Schedule')" size="small" disabled></el-input>
	  </el-form-item>
	  <el-form-item :label="$t('code.rightPanel.maxRows')">
		<el-input-number :placeholder="$t('fillMaxLines')" size="small" v-model="config.maxNum" controls-position="right">
		</el-input-number>
	  </el-form-item>
  </div>
</template>
<script>
export default {
    props: ['data'],
	computed:{
	    config(){
	        return this.data
	    }
	},
    data () {
        return {
        }
    }
}
</script>

