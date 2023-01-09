<template>
    <l-data-panel 
        :label="data.label"
        >
        <div ref="main" class="l-rblock"></div>
    </l-data-panel>
</template>
<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
export default {
    props: ['data','isPreview','isShow'],
    data () {
        return {
            option: {
				tooltip: {
					formatter: '{a} <br/>{b} : {c}%'
				},
				series: [{
					name: 'Pressure',
					type: 'gauge',
					detail: {
						formatter: '{value}'
					},
					data: [{
						value: 50,
						name: 'SCORE'
					}]
				}]
			}
        }
    },
    watch:{
        data:{
            handler(){
                this.getData()
            },
            deep: true
        }        
    },

    mounted(){
        this.timer = null
        this.getData()
        this.refresh();
    },
    methods:{
		refresh(){
			if(this.timer == null){
			    this.timer = setTimeout(()=>{
					this.getData()
					this.timer = null;
					this.refresh()
				},5*60*1000)
			}
		},
		async getData(){
			const main = this.$refs.main;
			if(!main) return;
			this.echart = echarts.init(main);
			this.option.series[0].name = this.data.label
					
			// 加载数据
			let res =[],data=[]
			if(this.data.dataCode&&this.data.nameKey && this.data.dataValueKey){
				res=await getDataBySQL(this.data.dataCode,{field:[this.data.nameKey,this.data.dataValueKey].join(',')})
				if(res.data.code == 0){
					if(res.data.data.length){
						data = res.data.data;	
					}
				}
				let valkey=data[0][this.data.dataValueKey];
				if(!(/(^[\-0-9][0-9]*(.[0-9]+)?)$/).test(''+valkey)){
					valkey=0
				}
				this.option.series[0].data = [{name:data[0][this.data.nameKey],value:valkey}]
				this.echart.setOption(this.option,true);
				this.echart.resize() //显示区域大小发生改变更新图表
			}else{
				this.echart.dispose()
			}
		}
    },
	beforeDestroy(){
		  clearTimeout(this.timer);
	}
}
</script>

