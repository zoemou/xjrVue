<template>
  <l-data-panel :label="data.label">
    <div ref="main" class="l-rblock"></div>
  </l-data-panel>
</template>
<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
export default {
  props: ["data", "isPreview", "isShow"],
  data() {
    return {
      option: {
		  tooltip:{
			  trigger: 'axis',
			  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			  }
		  },
		  xAxis: {
		      type: 'category',
		      data: []
		  },
		  yAxis: {
		      type: 'value'
		  },
		  series: [{
		      data: [],
		      type: "line"
		  }]
	  },
      timer: null,
      echart: null,
      count: 0
    };
  },
  watch: {
    data: {
      handler() {
        this.getData()	
      },
      deep: true
    }
  },
  mounted() {
	  this.timer = null;
	  this.getData()	  
	 this.refresh();
  },
  methods: {
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
		if (this.data.dataType == "Y") {
		  this.option.xAxis = {
		    type: "category",
		    data: []
		  };
		  this.option.yAxis = {
		    type: "value"
		  };
		} else {
		  this.option.xAxis = {
		    type: "value"
		  };
		  this.option.yAxis = {
		    type: "category",
		    data: []
		  };
		}

		  // 加载数据
		  let res =[],data=[]
		if (this.data.dataCode&&this.data.XKey && this.data.YKey) {
			res = await getDataBySQL(this.data.dataCode,{field:[this.data.XKey,this.data.YKey].join(',')})
			if(res.data.code == 0){
				if(res.data.data.length){
					data = res.data.data;	
				}
			}
		  const xList = [];
		  const yList = [];
		
		  data.forEach(item => {
		    xList.push(item[this.data.XKey]);
		    yList.push(item[this.data.YKey]);
		  }); 
		  if (this.data.dataType == "Y") {
		    this.option.series[0].data = yList;
		    this.option.xAxis.data = xList;
		  } else {
		    this.option.series[0].data = xList;
		    this.option.yAxis.data = yList;
		  }
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
};
</script>
