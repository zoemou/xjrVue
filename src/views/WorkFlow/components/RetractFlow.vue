<template>
	<div>
		<div class="node-box">
			<div v-for="(item,index) in retractList" :key="item" 
			class="node-item" :class="active==index?'active':''" 
			:title="item.type== 'startEvent'?(item.name?item.name:item.type):item.type== 'userTask'?(item.name?item.name:item.type):''"
			@click="changeNode(index)">{{item.type== "startEvent"?(item.name?item.name:item.type):item.type== "userTask"?(item.name?item.name:item.type):''}}</div>
		</div>
		<el-link type="danger" :underline="false">{{$t('hintSelectNodeWithdraw')}}</el-link>
		<div style="display:flex;align-items: center;justify-content: flex-end;">​			
			<el-button size="small" @click="cancel()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
			<el-button type="primary" size="small" @click="confrim()">{{$t('buttonModule.modalSureBtn')}}</el-button>
		</div>
	</div>
</template>

<script>
	import {
	  recallProcess
	} from "@/api/workFlow/WFProcess";
	
	export default {
		props: {
		  // 流程实例ID
		  processInstanceId: {
		    type: String,
		    default: null
		  },
		  deploymentId: {
		    type: String,
		    default: null
		  },
		  //任务id
		  taskId: {
		    type: String,
		    default: null
		  },
		  retractList: {
		    type: Array,
		    default: () => {
		      return [];
		    }
		  },
		  nwfRelationId: {
		    type: String,
		    default: null
		  },
		  CurrentModule: {
		    type: String,
		    default: null
		  },
		},
		data() {
		  return {
			  active:0
		  }
		},
		mounted() {
		},
		methods:{
			changeNode(idx){
				this.active=idx
			},
			
			cancel(){
				this.$emit('closeDialog')
			},
			confrim(){
				let type=this.retractList[this.active].type
				if(type== "startEvent"){
					this.$emit("retractReLaunch",'retract')
				}else{
					recallProcess({
						processInstanceId:this.processInstanceId,
						taskId:this.retractList[this.active].taskId
					}).then(res=>{
						if(res?.data?.success){
							this.$notify({
							  title:this.$t('deletePrompt.successTitle'),
							  message: this.$t('withdrawalSuccessfulGoTo-doTaskView'),
							  type: "success"
							});
							this.$emit('closeDialog')
						}else{
							this.$notify({
							  title:this.$t('deletePrompt.failureTitle'),
							  message: this.$t('withdrawalFailed'),
							  type: "warning"
							});
						}
					})
				}			
			}
		}
	}
</script>

<style>
	.node-box{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.node-item{
		width: 85px;
		height: 85px;
		border:1px solid rgba(220, 223, 230, 1);
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 22px;
		border-radius: 5px;
		padding: 5px;
		box-sizing: border-box;
		overflow: hidden;
		text-align: center;
	}
	.node-item:hover, .node-item.active{		
		border:1px solid rgba(198, 226, 255, 1);
		background:rgba(236, 245, 255, 1) ;
	}
</style>
