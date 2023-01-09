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
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '50%',
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
			echart: null,
            timer:null
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
		this.getData()
		this.timer = null;
		this.refresh();
    },
    methods:{
		refresh() {
			if (this.timer == null) {
			    this.timer = setTimeout(() => {
			    this.getData()	  
		        this.timer = null;
				this.refresh();
		    }, 5*60*1000);
		  }
		},
		async getData(){
			const main = this.$refs.main;
			if(!main) return;
			this.echart = echarts.init(main);
			this.option.series[0].name = this.data.label
					
			// 加载数据
			let res =[],data=[]
			if(this.data.dataCode&&this.data.nameKey && this.data.valueKey){
				res=await getDataBySQL(this.data.dataCode,{field:[this.data.XKey,this.data.YKey].join(',')})
				if(res.data.code == 0){
					if(res.data.data.length){
						data = res.data.data;	
					}
				}
				this.option.series[0].data = data.map(t=>{ return {name:t[this.data.nameKey],value:t[this.data.valueKey]} })
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

