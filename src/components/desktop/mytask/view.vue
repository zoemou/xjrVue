<template>
	<div class="l-data-panel l-rblock">
		<div class="l-data-panel--title"><span class="l-data-panel--label">{{data.label}}</span>
			<button type="button" class="el-button el-button--text" @click="handleClick(1)"><span>{{$t('route.more')}}</span></button>
		</div>
		<div class="l-rblock">
			<div class="l-data-list l-rblock">
				<div @click="handleClick(1)" class="l-data-board l-rblock" style="float:left;width:33.333%" >
				    <div class="l-data-board__icon" :style="{background:data.sbgColor}">
				        <i :class="data.sicon"  :style="{color:data.scolor}"></i>
				    </div>
				    <div class="l-data-board__text" >
				        <div class="l-data-board__num" ><l-count-up :end="upcoming" ></l-count-up><span class="unit">{{$t('piece')}}</span></div>
				        <div class="l-data-board__title" >{{$t('workFlow.processTasks.todoTasks')}}</div>
				    </div>
				</div>
				<div @click="handleClick(2)" class="l-data-board l-rblock" style="float:left;width:33.333%" >
				    <div class="l-data-board__icon"  :style="{background:data.fbgColor}">
				        <i :class="data.ficon" :style="{color:data.fcolor}"></i>
				    </div>
				    <div class="l-data-board__text" >
				        <div class="l-data-board__num" ><l-count-up :end="manual" ></l-count-up><span class="unit">{{$t('piece')}}</span></div>
				        <div class="l-data-board__title" >{{$t('circulationTask')}}</div>
				    </div>
				</div>
				<div @click="handleClick(3)" class="l-data-board l-rblock" style="float:left;width:33.333%" >
				    <div class="l-data-board__icon"  :style="{background:data.tbgColor}">
				        <i :class="data.ticon" :style="{color:data.tcolor}"></i>
				    </div>
				    <div class="l-data-board__text" >
				        <div class="l-data-board__num" ><l-count-up :end="history" ></l-count-up><span class="unit">{{$t('piece')}}</span></div>
				        <div class="l-data-board__title" >{{$t('workFlow.processTasks.completedTask')}}</div>
				    </div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import request from '@/router/axios';
import { baseUrl } from '@/config/env';
export default {
    props: ['data','isPreview'],
    data () {
        return {
			activeGoToUrl:'',
			history:0,
			manual:0,
			upcoming:0
        }
    },
    computed:{
        ...mapGetters(["modules"]),
    },
	async mounted(){
		let res=await request({
			url: baseUrl + '/workflow-task/history-task-count',
			method: 'get'
		})
		if(res?.data?.data) this.history=res.data.data;
		let res1=await request({
			url: baseUrl + '/workflow-task/manual-task-count',
			method: 'get'
		})
		if(res1?.data?.data) this.manual=res1.data.data;
		let res2=await request({
			url: baseUrl + '/workflow-task/upcoming-task-count',
			method: 'get'
		})
		if(res2?.data?.data) this.upcoming=res2.data.data
	},
    methods:{
        handleClick(type){
            if(!this.isPreview){
				this.activeGoToUrl="/workflow/process";
                //const module = this.modules.find(t=>t.f_EnCode == 'NWFProcess')
                //if(module){
                    switch(type){
                        case 1: // 代办任务							
							this.$store.state.workflow.currentModule=""
                            break;
                        case 2: // 委托任务
							this.$store.state.workflow.currentModule="MyForwarder"
                            break;
                        case 3: // 已办任务
							this.$store.state.workflow.currentModule="CompletedTasks"
                            break;
                    }
                    this.$router.push({ path: this.activeGoToUrl });
                //}
                
            }
        }
    }
}
</script>
<style>
.unit{font-weight: normal;font-size: 14px;}
.l-data-board__num{display: flex;justify-content: space-between;align-items: center;}
</style>
