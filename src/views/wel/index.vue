<template>
  <div style="padding:0px 15px; box-sizing: border-box;">
    <div v-if="isShow == false">
      <div class="mumber-box">
        <div class="mumber">
			<div class="mum-left">
				<img class="index-img" src="../../../public/img/index-icon1.svg"/>
			</div>
			<div class="mum-right">
				<div class="mum-title">本月计划总产量（万吨）</div>
				<div class="mum">75890</div>
				<div class="mum-than">同比&nbsp;&nbsp;&nbsp;&nbsp;1.14%<i class="fa fa-caret-up"></i></div>
			</div>
        </div>
        <div class="mumber">
			<div class="mum-left">
				<img class="index-img" src="../../../public/img/index-icon2.svg"/>
			</div>
			<div class="mum-right">
				<div class="mum-title">本月实际总产量（万吨）</div>
				<div class="mum">72368</div>
				<div class="mum-than">同比&nbsp;&nbsp;&nbsp;&nbsp;0.06%<i class="fa fa-caret-down"></i></div>
			</div>
        </div>
        <div class="mumber">
			<div class="mum-left">
				<img class="index-img" src="../../../public/img/index-icon3.svg"/>
			</div>
			<div class="mum-right">
				<div class="mum-title">本月废品量（万吨）</div>
				<div class="mum">231</div>
				<div class="mum-than">环比&nbsp;&nbsp;&nbsp;&nbsp;1.62%<i class="fa fa-caret-down"></i></div>
			</div>
        </div>
        <div class="mumber">
			<div class="mum-left">
				<img class="index-img" src="../../../public/img/index-icon4.svg"/>
			</div>
			<div class="mum-right">
				<div class="mum-title">本月废品率</div>
				<div class="mum">12%</div>
				<div class="mum-than">环比&nbsp;&nbsp;&nbsp;&nbsp;0.02%<i class="fa fa-caret-down"></i></div>
			</div>
        </div>
        <div class="mumber">
			<div class="mum-left">
				<img class="index-img" src="../../../public/img/index-icon5.svg"/>
			</div>
			<div class="mum-right">
				<div class="mum-title">今年总产量（万吨）</div>
				<div class="mum">1477589</div>
				<div class="mum-than">环比&nbsp;&nbsp;&nbsp;&nbsp;10.5%<i class="fa fa-caret-up"></i></div>
			</div>
        </div>
      </div>
      <el-row :span="24">
        <el-col :span="6">
          <div class="box-bg">
            <div class="box-bg-title">
               <span class="title-text">各生产部门本月产量（吨）</span>
            </div>
            <div class="item" id="home-pieChart" style="width: 100%; height:340px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="box-bg">
            <div class="box-bg-title">
        		<span class="title-text">产量分析</span>
        		<div class="title-chose">
        		  <span class="cur">{{ $t("月度") }}</span>
        		  <span>{{ $t("季度") }}</span>
        		  <span>年度</span>
        		</div>
        	</div>
            <div class="item">
        		<div id="home-barlineChart" style="width: 100%;height:340px;"></div>
        	</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box-bg">
            <div class="box-bg-title">
              <span class="title-text">{{$t("本日计划&实际完成情况")}}</span>
            </div>
            <div class="item">
              <div
                class="ibox-content"
                id="home-pieChart2"
                style="width: 100%;height: 340px;"
              >
              </div>
            </div>
          </div>
        </el-col>
	  </el-row>
	  
	  <el-row :span="24">
	    <el-col :span="6" style="margin-bottom: 10px;">
	      <div class="box-bg" style="height: 370px;">
	        <div class="box-bg-title">
	           <span class="title-text">产线工料废分析</span>
	        </div>
	        <div class="item" id="home-radarChart" style="width:100%; height:290px;"></div>
	      </div>
	    </el-col>
	    <el-col :span="12" style="margin-bottom: 10px;">
	      <div class="box-bg">
	        <div class="box-bg-title">
	  				<span class="title-text">产线平均稼动率</span>
	  				<div class="title-chose">
					  <span>近24小时</span>	
	  				  <span class="cur">{{ $t("近7日") }}</span>
	  				  <span>{{ $t("近15日") }}</span>
	  				  <span>近30日</span>
	  				</div>
	  			</div>
	        <div class="item">
	  				<div id="home-lineChart" style="width: 100%;height:310px;"></div>
	  		</div>
	      </div>
	    </el-col>
	    <el-col :span="6"  style="margin-bottom: 10px;">
	      <div class="box-bg">
	        <div class="box-bg-title">
	          <span class="title-text">{{$t("本日班次完成情况")}}</span>
	        </div>
	        <div class="item">
	          <div
	            class="ibox-content"
	            id="home-pieChart3"
	            style="width: 100%;height: 310px;"
	          >
	          </div>
	        </div>
	      </div>
	    </el-col>
	  </el-row>
	  
    </div>
    <div v-if="isShow == undefined" class="load-text">
      {{ $t("wel.welIndex.indexLoading") }}
    </div>
    <div v-if="isShow == true">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        :src="reportIframe"
        v-if="reportIframe"
      ></iframe>
      <formView :dataJson="desktopJson" v-if="formVisible"></formView>
    </div>
  </div>
</template>

<script>
import formView from "@/views/SystemManagement/Desktop/desktopView.vue";
// import echarts from "echarts";
import { getStore } from "@/util/store";
import { getIndexUrl } from "@/api/bi/homerelation.js";
import { mapGetters } from "vuex";
export default {
  name: "wel",
  data() {
    return {
		// 玫瑰饼图
      pieOption: {
        color: ["#7EAAFF", "#7EAAFF", "#9E9BFC", "#8CB1F9","#6D68F8","#5E75E6"],
        tooltip: {
          trigger: "item",
		  formatter: '{b} : {c} ({d}%)' 
        },
        legend: {
          orient: "horizontal",
		   x: 'center',
		   y: 'bottom',
		   top: '78%',
		   itemWidth:10,
		   itemHeight:10,
		   itemGap:20,
		   padding: [5, 60, 5, 60,],
		   textStyle:{
		         color:'#85878e'
		    }
        },
        series: [
          {
            name: "",
            center: ["50%", "50%"],
			  type: 'pie',
			  radius: [0, 85],
			  center: ['50%', '38%'],
			  roseType: 'area',
			  itemStyle: {
			        borderRadius: 0,
			      },
			   label: {
			          color: '#6e7079'
			        },	  
            data: [
              {
                name: this.$t("压铸一部"),
                value: "168"
              },
              {
                name: this.$t("压铸二部"),
                value: "162"
              },
              {
                name: this.$t("机加一部"),
                value: "87"
              },
              {
                name: this.$t("机加二部"),
                value: "56"
              },
			  {
			    name: this.$t("机加三部"),
			    value: "126"
			  },
			  {
			    name: this.$t("机加四部"),
			    value: "148"
			  }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
	  
	// 柱状折线图
      barOption: {
		color: ["#5E95FF", "#EE3B3B"],  
       tooltip: {
           trigger: 'axis',
           axisPointer: {
             type: 'cross',
             crossStyle: {
               color: '#999'
             }
           }
         },
        
         legend: {
           data: ['实际产量', '偏差率'],
		    orient: "horizontal",
		    left: 'center',
			itemWidth:10,
			itemHeight:10,
			textStyle:{
			    color:'#85878e'
			 }
         },
         xAxis: [
           {
             type: 'category',
             data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
             axisPointer: {
               type: 'shadow'
             }
           }
         ],
         yAxis: [
           {
             type: 'value',
			 splitLine: {
			       show: true,
			         lineStyle:{
			             color: ['rgba(204,204,204,0.2)'],
			             type: 'solid'
			         }
			    },
             name: '单位：万吨',
             min: 0,
             max: 400,
             interval: 100,
             axisLabel: {
               formatter: '{value}'
             }
           },
           {
             type: 'value',
			 splitLine: {
			       show: true,
			         lineStyle:{
			             color: ['rgba(204,204,204,0.2)'],
			             type: 'solid'
			         }
			    },
             name: '',
             min: 0,
             max: 100,
             interval: 25,
             axisLabel: {
               formatter: '{value} %'
             }
           },
         ],
         series: [
           {
             name: '实际产量',
             type: 'bar',
			 barWidth:20,
             tooltip: {
               valueFormatter: function (value) {
                 return value + ' 万吨';
               }
             },
             data: [
               299, 286, 346, 325, 269, 369, 279, 300, 389, 276, 340, 310
             ]
           },
       
           {
             name: '偏差率',
             type: 'line',
             yAxisIndex: 1,
             tooltip: {
               valueFormatter: function (value) {
                 return value + '  %';
               }
             },
             data: [25, 28, 38, 48, 32, 26, 48, 27, 30, 29, 33, 45]
           }
         ]
      },
	  
    // 占比饼图
	 pie2Option:{
		  color: ["#5E95FF", "#00CACF"],
		   tooltip: {
		     trigger: 'item',
		      formatter: '{b} : {c}'+'万吨'+' ({d}%)' 
		   },
		   legend: {
		     fommatter: "{a} : {b}",
		     bottom: "10%",
		     left:'center',
		     itemWidth: 10,
		     itemHeight: 10,
			 itemGap:20,
			 textStyle:{
			     color:'#85878e'
			  }
		   },
		   series: [
		     {
		       type: 'pie',
		       radius: ['40%', '60%'],
			   center: ['50%', '38%'],
		       avoidLabelOverlap: false,
		      // selectedMode: 'single',
			  
		       emphasis: {
		         label: {
		           show: true,
		           fontSize: '20',
		           fontWeight: 'bold',
		         }
		       },
		       labelLine: {
		         show: false
		       },
		       data: [
		         { value: 345, name: '计划完成' ,
		          label: {
		         show: false,
		         position: 'center',
		          normal: {
		               show: false,
		               formatter: "{d}%\n{b}",
		               position: "center",
		               lineHight: 30,
		               fontSize: '20',
		               fontWeight: 'bold',
		             },
		       },
		         },
		         { value: 95, name: '实际完成',
		          label: {
		         show: false,
		         position: 'center',
		          normal: {
		               show: true,
		               formatter: "{d}%\n{b}",
		               position: "center",
		               lineHight: 30,
		               fontSize: '20',
		               fontWeight: 'bold',
		             },
		       },
		           selected: false,
		         },
		       ],
			   
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
	  
	  
	// 雷达图  
	  radarOption:{
		    color: ["#5E95FF", "#00CACF", "#8C7DFC"],
		    legend: {
		      data: ['工废数', '料废数','其他'],
			  x: 'center',
			  y: 'bottom',
			  itemWidth:10,
			  itemHeight:10,
			  top: '94%',
			  textStyle:{
			      color:'#85878e'
			   }
		    },
		    radar: {
		      shape: 'circle',
			  center: ['50%', '48%'],
			  axisName: {
					color: '#666'
			   },
			    splitLine: {
			         lineStyle: {
			           color: [
			             'rgba(204, 204, 204, 0.6)',
			             'rgba(204, 204, 204, 0.5)',
			             'rgba(204, 204, 204, 0.4)',
			             'rgba(204, 204, 204, 0.3)',
			             'rgba(204, 204, 204, 0.2)',
			             'rgba(204, 204, 204, 0.1)',
			           ].reverse()
			         }
			  },
			   axisLine: {
			        lineStyle: {
			          color: 'rgba(204, 204, 204, 0.6)'
			        }
			    },
		      indicator: [
		        { name: '压铸一部', max: 6500 },
		        { name: '压铸二部', max: 16000 },
		        { name: '机加一部', max: 30000 },
		        { name: '机加二部', max: 38000 },
		        { name: '机加三部', max: 52000 },
		        { name: '机加四部', max: 25000 }
		      ]
		    },
		    series: [
		      {
		        name: 'Budget vs spending',
		        type: 'radar',
				symbol:'none',
				label: {
					color: '#6e7079'
				},	
		        data: [
		          {
		            value: [3000, 12000, 20000, 20000, 40000, 20000],
		            name: '工废数',
		             areaStyle: {
		              color: 'rgba(94,149,255,0.5)'
		            },
					 lineStyle: {
					        type: 'dashed',
					        width:0
					}
		            
		          },
		          {
		            value: [5000, 10000, 28000, 26000, 42000, 21000],
		            name: '料废数',
		             areaStyle: {
		              color: 'rgba(0,202,207,0.5)'
		            },
					lineStyle: {
					        type: 'dashed',
					        width:0
					}
		          },
		           {
		            value:[4200, 3000, 20000, 35000, 50000, 18000],
		            name: '其他',
		             areaStyle: {
		              color: 'rgba(140,125,252,0.5)'
		            },
					lineStyle: {
					        type: 'dashed',
					        width:0
					}
		          }
		          
		        ]
		      }
		    ]
	  },
	
	// 折线图   
      lineOption: {
		 tooltip: {
		    trigger: 'axis'
		  },  
         color: ["#9863c1"],
         xAxis: {
           type: 'category',
           boundaryGap: false,
           data: ['2022-5-1', '2022-5-2', '2022-5-3', '2022-5-4', '2022-5-5', '2022-5-6', '2022-5-7']
         },
         yAxis: {
           max: 100,
           interval:25,
           type: 'value',
		   splitLine: {
		         show: true,
		           lineStyle:{
		               color: ['rgba(204,204,204,0.2)'],
		               type: 'solid'
		           }
		      },
		   name: '单位 %',
         },
         series: [
           {
             data: [25, 70, 40, 55, 90, 40, 80],
             type: 'line',
			 tooltip: {
			   valueFormatter: function (value) {
			     return value + ' %';
			   }
			 },
             areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                 {
                   offset: 0,
                   color: 'rgba(140, 125, 252, 0.6)'
                 },
                 {
                   offset: 1,
                   color: 'rgba(140, 125, 252, 0)'
                 }
               ])
             },
             smooth: true
           }
         ]
	  },

	// 饼图

	pie3Option:{
		 color: ["#02D6DC", "#8C7DFC", "#5E95FF"],
		  tooltip: {
		    trigger: 'item',
		    formatter: '{a} <br/>{b}: {c} ({d}%)'
		  },
		  legend: {
		    orient: 'horizontal',
		   x: 'center',
		   y: 'bottom',
		   top: '84%',
		   itemWidth:10,
		   itemHeight:10,
		   textStyle:{
		       color:'#85878e'
		    }
		  },
		  series: 
		    {
		      name: "本日班次",
		      type: 'pie',
		      radius: '50%',
		      selectedMode: 'single',
			  center: ['50%', '38%'],
			  label: {
			     color: '#6e7079'
			  },	
		      data: [
		        { value: 1048, name: '早班（数量）' },
		        { value: 735, name: '中班（数量）' , selected: true},
		        { value: 679, name: '晚班（数量）' }
		       
		      ],
		      emphasis: {
		        itemStyle: {
		          shadowBlur: 10,
		          shadowOffsetX: 0,
		          shadowColor: 'rgba(0, 0, 0, 0.5)'
		        }
		      }
		    } 
	},

      reportIframe: "",
      isShow: undefined,
      formVisible: false,
      desktopJson: []
    };
  },
  computed: {
    ...mapGetters(["curIndexUrl", "website",'systemId'])
  },
  components: { formView },
  watch:{
	'systemId': {		handler (val) {  
			if(this.$route.path=='/wel/index') this.getMount();
		}
	}
  },
  mounted() {
    this.getMount();
  },
  methods: {
	  getMount(){
		  let urlSource = "common";
		  
		  if (this.website.proVersion) {
		    this.isShow = false;
		    this.initAllChart();
		    return;
		  }
		  
		  this.$event.$on("noMainSystemExec", () => {
		    this.isShow = undefined;
		    this.$nextTick(() => {
		      this.isShow = true;
		      this.reportIframe = this.curIndexUrl;
		    });
		    urlSource = "event";
		  });
		  if (urlSource == "event") return;
		  if (this.curIndexUrl && !this.curIndexUrl.includes('desktop')) {
		    this.isShow = true;
		    this.reportIframe = this.curIndexUrl;
		  }
		   else {
			  getIndexUrl(this.systemId)
				.then(res => {
				  //如果有首页配置
				  this.reportIframe = "";
				  this.formVisible = false;
	  
				  if (res?.data?.data) {
					this.isShow = true;
					if (res.data.data.type == 1) {
					  //BI
					  this.reportIframe = res.data.data.value;
					} else if (res?.data?.data?.type == 2) {
					  //桌面设计
					  this.formVisible = true;
					  if (res?.data?.data?.value)
						this.desktopJson = JSON.parse(res.data.data.value);
					} else {
					  this.isShow = false;
					  this.initAllChart();
					}
				  } else {
					this.isShow = false;
					this.initAllChart();
				  }
				})
				.catch(err => {
				  this.isShow = false;
				  this.initAllChart();
				});

		  }
	  },
    initAllChart() {
      this.initPieChart();
      this.initBarChart();
	  this.initRadarChart();
      this.initLineChart();
      this.$nextTick(() => {
        if (
          getStore({
            name: "themeName"
          }) == "eveningTheme"
        ) {
          this.initScatterEcharts("eveningTheme");
        } else {
          this.initScatterEcharts("otherTheme");
        }
      });
    },
    initPieChart() {
      this.$nextTick(() => {
        let myChart = this.$echarts.init(
          document.getElementById("home-pieChart")
        );
        myChart.setOption(this.pieOption, true);
        myChart.resize(); //显示区域大小发生改变更新图表
		
		let myChart2 = this.$echarts.init(
		  document.getElementById("home-pieChart2")
		);
		myChart2.setOption(this.pie2Option, true);
		myChart2.resize(); //显示区域大小发生改变更新图表
		
		let myChart3 = this.$echarts.init(
			document.getElementById("home-pieChart3")
		);
			myChart3.setOption(this.pie3Option, true);
			myChart3.resize(); //显示区域大小发生改变更新图表
		
      });
    },
    initBarChart() {
      this.$nextTick(() => {
        let myChart = this.$echarts.init(
          document.getElementById("home-barlineChart")
        );
        myChart.setOption(this.barOption, true);
        myChart.resize(); //显示区域大小发生改变更新图表
        let myChart2 = this.$echarts.init(
          document.getElementById("home-barChart2")
        );
        myChart2.setOption(this.bar2Option, true);
        myChart2.resize(); //显示区域大小发生改变更新图表
      });
    },
	initRadarChart() {
	  this.$nextTick(() => {
	    let myChart = this.$echarts.init(
	      document.getElementById("home-radarChart")
	    );
	    myChart.setOption(this.radarOption, true);
	    myChart.resize(); //显示区域大小发生改变更新图表
	  });
	},
   
	initLineChart() {
      this.$nextTick(() => {
        let myChart = this.$echarts.init(
          document.getElementById("home-lineChart")
        );
        myChart.setOption(this.lineOption, true);
        myChart.resize(); //显示区域大小发生改变更新图表
      });
    },
    initScatterEcharts(themeName) {
      var dom = document.getElementById("scatterEcharts");
      let option = {
        
      };

      if (themeName == "eveningTheme") {
        // option.legend.textStyle.color = "rgba(255,255,255,.1)";
        // option.xAxis.splitLine.lineStyle.color = "rgba(255,255,255,.2)";
        // option.xAxis.axisLabel.textStyle.color = "rgba(255,255,255,.2)";
        // option.xAxis.nameTextStyle.color = "rgba(255,255,255,.2)";
        // option.yAxis.splitLine.lineStyle.color = "rgba(255,255,255,.2)";
        // option.yAxis.axisLabel.textStyle.color = "rgba(255,255,255,.2)";
        // option.yAxis.nameTextStyle.color = "rgba(255,255,255,.5)";
        // option.xAxis.axisLine.lineStyle.color = "rgba(255,255,255,0.2)";
        // option.yAxis.axisLine.lineStyle.color = "rgba(255,255,255,0.2)";
      }
      let echart = this.$echarts.init(dom);
      echart.setOption(option, true);
    },

    initEveningEcharts() {
      let echartsDom = document.getElementById("eveningScatterChart");
      let option = {
      
      };
      if (echartsDom) {
        let scatterEcharts = this.$echarts.init(
          document.getElementById("eveningScatterChart")
        );
        scatterEcharts.setOption(option, true);
      }
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.title-chose {
  float: right;
  margin-right: 20px;
}
.title-select {
  color: #4992ff;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.title-chose span {
  text-align: center;
  padding:0px 12px;
  display: inline-block;
  color: #333;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
}
.title-chose span.cur,
.title-chose span:active {
  background-color:#5E95FF;
  color: #fff;
}

.title-text {
  padding: 0px 15px;
}
.title-tab-box {
  float: right;
  text-align: right;
  line-height: 40px;
  margin: 0px;
  font-size: 12px;
  color: #b3b3b3;
}
.title-tab-box b {
  padding-left: 15px;
  cursor: pointer;
}
.title-tab-box b:active {
  color: #4992ff;
}
.title-tab-box b.cur {
  color: #4992ff;
}
.item {
  padding: 10px 10px 0px 10px;
}
.box-bg-title {
  border-bottom: 1px solid #eeeeee;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  box-sizing: border-box;
}

.box-bg {
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.1);
}
.mumber-box{
	margin:8px 10px 18px 10px;
	display: flex;
	justify-content: space-between;
}
.mumber {
  padding:20px;
  box-sizing: border-box;
  width: 19%;
  height: 120px;
  background: #FFFFFF;
  box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.1);
  border-radius: 5px;
}
.mum-left{
	float: left;
	width: 24%;
	margin-top: 6px;
}
.index-img{
	display: inline-block;
	width:100% ;
}
.mum-right{
	margin-left: 6%;
	float: left;
	width: 70%;
}
.mum-title{
	font-size: 14px;
}
.mum{
	font-size: 30px;
	font-weight: bolder;
	color: #5E95FF;
}
.mum-than{
	padding-top:4px;
	font-size: 14px;
}
.mum-than i{
	font-size: 16px;
	padding-left: 10px;
}
.fa-caret-up{
	color: #3DBA84;
}
.fa-caret-down{
	color:#EE3B3B;
}
@media screen and (max-width: 1700px) {
  .mum-left {
    width:20%;
  }
  .mum-right {
	margin-left: 5%;
    width:75%;
  }
}
@media screen and (max-width: 1359px) {
  .el-col-lg-4 {
    width: 33.33333%;
  }
}
.el-col {
  padding: 0 10px;
  margin-bottom: 20px;
}

.saleTotal {
  color: #666;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.saleTotal span {
  color: #02a7f0;
  font-size: 25px;
}
.avue-view{
	padding: 0px 5px!important;
}
.avue-view > div {
  height: 100%;
}

.load-text {
  font-size: 14px;
  text-align: center;
  padding: 10px;
}
</style>
