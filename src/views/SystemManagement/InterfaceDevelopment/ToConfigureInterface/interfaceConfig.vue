<template>
	<div class="mainbox">
		<div class="leftbox" :style="{width:(curIndex>=0?'':'100%')}">
			<div class="nodebox">
				<div v-for="(item,index) in interfaceConfig" :key="index" @click="nodeClick(item,index)">
					<div class="startnode" v-if="item.nodeType=='start'">
						<div :class="curIndex===index?'active':''">
							<div class="start"></div>
						</div>
						<div class="line"></div>
					</div>
					<div class="tasknode" v-if="item.nodeType=='task'">
						<div :class="curIndex===index?'active':''">							
							<div class="task">
								<div class="el-icon-user-solid" v-if="item.isCustom"></div>
								<div class="customName">{{item.nodeName}}</div>
								<div class="el-icon-delete" v-if="item.isCustom" @click.stop="deleteNode(index)"></div>
							</div>
						</div>						
						<div class="line"></div>
					</div>
					<div class="plusnode" v-if="item.nodeType=='plus'">
						<div class="plus">
							<div class="plusbox"></div>
							<div class="el-icon-plus"></div>
						</div>
						<div class="line"></div>
					</div>
					<div v-if="item.nodeType=='end'">
						<div :class="curIndex===index?'active':''">
							<div class="endnode"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="rightbox" v-if="curIndex>=0">
			<div class="nodeinfo">{{$t('nodeProperties')}}-{{interfaceConfig[curIndex].nodeName}}</div>
			<nodeInfo v-if="interfaceConfig[curIndex].isCustom" :nodeinfo="interfaceConfig[curIndex]"></nodeInfo>
			<basicInfo v-else :nodeinfo="interfaceConfig[curIndex]"></basicInfo>
		</div>
	</div>
</template>

<script>
	import nodeInfo from '../component/nodeInfo.vue';
	import basicInfo from '../component/basicInfo.vue';
	import store from '@/store';
	import { mapGetters } from "vuex";
	export default {
	  props: [],
	  computed: {
	    ...mapGetters(["interfaceConfig"]),
	  },
	  data () {
	    return {
			curIndex:-1
		}
	  },
	  components: {nodeInfo,basicInfo},
	  methods: {
	    nodeClick(item,index){
			if(item.nodeType=='plus'){
				this.interfaceConfig.splice(index,0,{
					nodeName:this.$t('userDefinedNode'),
					nodeType:'task',
					isCustom:true,
					nodeLog:false,
					nodeLifeCycleType:item.nodeLifeCycleType,
					nodeVarAssign:[],
					nodeProcess:[]
				})
			}
			this.curIndex=index;
		},
		deleteNode(index){
			this.interfaceConfig.splice(index,1)
			this.curIndex=0
		}
	  },
	  created () {
		
	  }
	};
</script>

<style scoped>
	.mainbox{
		height: 100%;
	}
	.mainbox::after{
		clear: both;
	}
	.leftbox{
		width: 62%;
		float: left;
		height: 100%;
		overflow: auto;
	}
	.rightbox{
		width: 38%;
		float: right;
		border-left:1px solid #C0C5CE;
		height: 100%;
		box-sizing: border-box;
		padding: 10px;
	}
	.nodebox{
		max-width: 200px;
		margin: 20px auto;
	}
	.start{
		border-radius: 50%;
		width: 34px;
		height: 34px;
		border:2px solid #000;
		margin: 0 auto;
	}
	.line{
		width: 0;
		border-left:2px dashed #000;
		height: 20px;
		margin: 5px auto;
	}
	.task{
		width: 160px;
		margin: 0 auto;
		min-height: 70px;
		line-height: 18px;
		font-size: 13px;
		border:1px solid #000;
		border-radius: 5px;
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		word-break: break-all;
	}
	.plus{		
		font-size: 20px;
		text-align: center;
		margin: 15px auto;
		position: relative;
	}
	.plusbox{
		border:2px solid #000;
		width: 34px;
		height: 34px;
		transform: rotate(45deg);
		margin: 0 auto;			
	}
	.el-icon-plus{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		display: block;
		line-height: 34px;
	}
	.endnode{
		border-radius: 50%;
		width: 34px;
		height: 34px;
		border:4px solid #000;
		margin: 0 auto;
	}
	.active{
		border:2px dashed rgb(2, 167, 240);
		padding: 2px;
		display: table;
		margin: 0 auto;
	}
	.el-icon-user-solid{
		font-size: 20px;
		position: absolute;
		top: 0;
		left: 0;
	}
	.el-icon-delete{
		font-size: 20px;
		position: absolute;
		bottom: 0;
		right: 0;
		display: none;
	}
	.task:hover .el-icon-delete{
		display: block;
	}
	.nodeinfo{
		font-size: 13px;
		font-weight: bold;
		padding: 10px 0;
		border-bottom: 1px solid #C0C5CE;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.customName{
		padding: 20px 0;
	}
</style>
