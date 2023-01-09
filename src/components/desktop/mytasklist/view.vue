<template>
<!-- <l-data-list 
        :columns="columns"
        isMore 
        :label="data.label"

        :data="dataSource"
        @more="handleMore" 
        @itemClick="handleClick" ></l-data-list> -->
	<div class="l-data-panel l-rblock">
		<div class="l-data-panel--title"><span class="l-data-panel--label">{{data.label}}</span>
			<button type="button" class="el-button el-button--text" @click="handleMore"><span>{{$t('route.more')}}</span></button>
		</div>
		<div class="l-rblock">
			<div class="l-data-list l-rblock">
				<el-tabs v-model="activeName" stretch style="height: 100%;">
				    <el-tab-pane :label="$t('ongoing')" name="first">
						<avue-crud v-if="activing" :data="activing" :option="option" stripe style="height: 100%;">
						</avue-crud>
					</el-tab-pane>
				    <el-tab-pane :label="$t('aboutToStart')" name="second">
						<avue-crud v-if="starting" :data="starting" :option="option" stripe style="height: 100%;">
						</avue-crud>
					</el-tab-pane>
				    <el-tab-pane :label="$t('completedExpired')" name="third">
						<avue-crud v-if="ending" :data="ending" :option="option" stripe style="height: 100%;">
						</avue-crud>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import {getSchedule} from '@/api/officeautomation/schedule';
export default {
    props: ['data','isPreview'],
    data () {
        return {
            activeName:'first',
			option:{
				highlightCurrentRow: true, stripe: false, page: false,
				    index: true, indexLabel:' ',menu: false,header:false,height:'100%',
				    column: [{label:this.$t('workFlow.WFDelegate.tabStartDate'), prop: 'start',width:'200',align:'center'}, 
				            {label:this.$t('workFlow.WFDelegate.tabEndDate'), prop: 'end',width:'200',align:'center'},
							{label:this.$t('taskContent'), prop: 'title'}]
			},
			activing:[],
			starting:[],
			ending:[]
        }
    },
	async mounted(){
		if(this.data.maxNum){
			const res = await getSchedule()
			if(res?.data?.data){
				res.data.data.forEach(it=>{
					let start=new Date(it.start).getTime();
					let end=new Date(it.end).getTime();
					let now=new Date().getTime();
					if(now<=end&&now>=start){
						this.activing.push(it)
					}else if(now<start){
						this.starting.push(it)
					}else if(now>end){
						this.ending.push(it)
					}
				})
			}
		}
	},
    methods:{
        handleMore(){
            if(!this.isPreview){
                this.$router.push({ path: '/office-automation/schedule' });
            }
        }
    }
}
</script>
<style>
.l-data-list .el-tabs__content{
	height: calc(100% - 55px);
}
.l-data-list .el-tab-pane{
	height: 100%;
}
</style>
