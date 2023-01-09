<template>
    <l-data-panel 
        :label="data.label"
        >
        <div ref="main" class="l-rblock"></div>
    </l-data-panel>
</template>
<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
import { deepClone } from '@/util/util'; 
export default {
    props: ['data','isPreview','isShow'],
    data () {
        return {
            option: {
				tooltip:{
				  trigger: 'item'
				},
                legend: {
                    data: []//['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        // { name: '销售（Sales）', max: 6500},
                        // { name: '管理（Administration）', max: 16000},
                        // { name: '信息技术（Information Technology）', max: 30000},
                        // { name: '客服（Customer Support）', max: 38000},
                        // { name: '研发（Development）', max: 52000},
                        // { name: '市场（Marketing）', max: 25000},
                        // { name: '研发1（Development）', max: 52000},
                        // { name: '市场2（Marketing）', max: 25000}
                    ]
                },
                series: [{
                    type: 'radar',
                    data: [
                        // {
                        //     value: [4200, 3000, 20000, 35000, 50000, 18000],
                        //     name: '预算分配（Allocated Budget）'
                        // },
                        // {
                        //     value: [5000, 14000, 28000, 26000, 42000, 21000],
                        //     name: '实际开销（Actual Spending）'
                        // }
                    ]
                }]
            },
			echart: null,
			timer:null
        }
    },
    watch:{
        'data.dataValueKey':{
            handler(){
                this.getData()
            }
        },
		'data.columns':{
		    handler(){
				if(this.data.columns.length>0){		
					this.option.radar.indicator=this.data.columns;
				}
		    },
		    deep: true
		},
		data: {
		  handler() {
			  const main = this.$refs.main;
			  if(!main) return;
			  this.echart = echarts.init(main);	
			  this.echart.setOption(this.option,true);
			  this.echart.resize()
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
					
			// 加载数据
			let res =[],data=[]
			if(this.data.dataCode&&this.data.nameKey && this.data.dataValueKey){
				res=await getDataBySQL(this.data.dataCode,{field:[this.data.nameKey,this.data.dataValueKey].join(',')})
				if(res.data.code == 0){
					if(res.data.data.length){
						data = res.data.data;	
					}
				}
				this.option.legend.data=[]
				this.option.series[0].data=[];
				let columns=deepClone(this.data.columns)
				this.data.columns=[]
				data.forEach(item=>{
					let value=item[this.data.dataValueKey]||0;
					let name=item[this.data.nameKey]||""
					if(name){
						if(this.option.legend.data.indexOf(name)<0){
							this.option.legend.data.push(name)
							let obj=columns.find(o=>{return o.name==name})
							if(obj) this.data.columns.push(obj)
							else this.data.columns.push({name:name,max:0})
							this.option.series[0].data.push({
								value: [value],
								name: name
							})
						}else{
							let idx=this.option.series[0].data.findIndex(o=>{return o.name==name})
							if(idx>=0){
								this.option.series[0].data[idx].value.push(value)
							} 
						}
					}
				})
				if(this.data.columns.length>0){
					this.option.radar.indicator=this.data.columns
				}
				this.echart.setOption(this.option,true);
				this.echart.resize() //显示区域大小发生改变更新图表
			}else{
				this.data.columns=[]
				this.echart.dispose()
			}
		}
    },
	beforeDestroy(){
		clearTimeout(this.timer);
	}
}
</script>

