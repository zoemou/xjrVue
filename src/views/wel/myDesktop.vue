<template>
  <div class="wrapper wrapper-content" style="padding:0px 5px; box-sizing: border-box;">
	<el-row :span="24">
		<el-col :span="24">
			<el-card class="box-card deskTop">
				<div class="item">
					<div class="dropdown profile-element fl">
						<div id="imgBox" class="fl"></div> 
						<div class="fr">
							<div class="block m-t-xs"><strong class="font-bold" id="F_RealName"></strong></div>
							<div id="F_Role"><span>转变自己的心态，将工作当做自己的事业而努力吧</span><i class="fa fa-pencil"></i></div>
						</div>
					</div>
					<el-row :span="24" class="fl deskTopBox pr25">
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user2.png"/>
								<img class="evening-img" src="/img/evening_custom.png" style="display: none;"/>
								<span class="evening-custom-txt">新增客户</span>
							</div>
						</el-col>
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user1.png"/>
								<img class="evening-img" src="/img/evening_people.png" style="display: none;"/>
								<span class="evening-people-txt">新增联系人</span></div>
						</el-col>
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user3.png"/>
								<img class="evening-img" src="/img/evening_business.png" style="display: none;"/>
								<span class="evening-business-txt">新增商机</span></div>
						</el-col>
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user4.png"/>
								<img class="evening-img" src="/img/evening_order.png"  style="display: none;"/>
								<span class="evening-order-txt">新增订单</span></div>
						</el-col>
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user5.png"/>
								<img class="evening-img" src="/img/evening_monitor.png" style="display: none;"/>
								<span class="evening-monitor-txt">新增跟进</span></div>
						</el-col>
						<el-col :span="4">
							<div class="evening-item">
								<img class="default-img" src="/img/user6.png"/>
								<img class="evening-img" src="/img/evening_money.png" style="display: none;"/>
								<span class="evening-money-txt">新增回款</span></div>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-col>
	</el-row>
	<el-row :span="24">
		<el-col :span="6">
			<el-card class="box-card">
				<div slot="header" class="clearfix" style="display: flex;align-items: center;justify-content: space-between;">
				  <span>日程 <i class="fa fa-calendar"></i></span><span class="fa fa-plus fr" style="color:#02A7F0"></span>
				</div>
				<div class="item" id="calendar">
					<div id="calendarBox"></div>
					<div class="feed-activity-list">
						 <div class="feed-element-li">
							 <div class="fl calLabel text-center">日程</div>
							 <div class="media-body ">
								 <strong>日程安排一</strong>
								 <br>
								 <small class="text-muted">2019.11.18-2019.11.19<small class="pull-right end text-center">即将到期</small></small>
							 </div>
						 </div>
						 <div class="feed-element-li">
							 <div class="fl calLabel text-center">日程</div>
							 <div class="media-body ">
								 <strong>日程安排二</strong>
								 <br>
								 <small class="text-muted">2019.11.18-2019.11.19<small class="pull-right ing text-center">临期</small></small>
							 </div>
						 </div>
						 <div class="feed-element-li">
							 <div class="fl calLabel text-center">日程</div>
							 <div class="media-body ">
								 <strong>日程安排三</strong>
								 <br>
								 <small class="text-muted">2019.11.18-2019.11.19<small class="pull-right ing text-center">临期</small></small>
							 </div>
						 </div>
						 <div class="feed-element-li">
							 <div class="fl calLabel text-center">日程</div>
							 <div class="media-body ">
								 <strong>日程安排四</strong>
								 <br>
								 <small class="text-muted">2019.11.18-2019.11.19<small class="pull-right ing text-center">临期</small></small>
							 </div>
						 </div>
					 </div>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				  <span>部门销售业绩排行</span><span class="fr ft12">单位：万元</span>
				</div>
				<div class="item default-theme" id="home-pileUpChart">
					<avue-echart-bar :option="pileUpOption" :data="pileUpData" width="100%" height="504"></avue-echart-bar>
				</div>
				<div class="evening-theme" style="display: none;">
					<avue-echart-line :option="pileUpOption_line" :data="pileUpData" width="100%" height="504"></avue-echart-line>
				</div>
			</el-card>
		</el-col>
		<el-col :span="12">
			<el-card class="box-card" style="height: 256px;">
				<div class="item default-theme">
					<el-tabs v-model="activeName" @tab-click="handleClick">
					    <el-tab-pane label="待办事项" name="first">
							<div class="panel-body waitTodo">
								<h4>待审批(<span style="color: #2fa0db;">18</span>)</h4>
								<h4>今日已办(<span style="color: #F59A23;">5</span>)</h4>
								<h4>我发起的(<span style="color: #6ac768;">30</span>)</h4>
								<h4>被驳回(<span style="color: #f96866;">2</span>)</h4>
								<h4>已完结(<span style="color: #b3b3b3;">66</span>)</h4>
								<h4><a href="">更多<i class="fa fa-angle-double-right"></i></a></h4>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="系统公告" name="second">
							<div class="panel-body">
								<ol class="systemNote">
									<li>12月部门销冠王为销售一部的羊亚萍！！！<span class="fr">12/19</span></li>
									<li>11月部门销冠王为销售一部的王博文！！！<span class="fr">11/19</span></li>
									<li>10月部门销冠王为销售一部的李鑫！！！<span class="fr">10/19</span></li>
									<li>9月部门销冠王为销售一部的李鑫！！！<span class="fr">09/19</span></li>
								</ol>
								<a href="" class="text-center viewMore">查看更多<i class="fa fa-angle-double-down"></i></a>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="新闻" name="third">
							<div class="panel-body">
								<ol class="systemNote">
									<li>湘北智造新闻湘北智造新闻<span class="fr">12/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">11/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">10/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">09/19</span></li>
								</ol>
								<a href="" class="text-center viewMore">查看更多<i class="fa fa-angle-double-down"></i></a>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="item evening-theme" style="display: none;">
					<el-tabs v-model="activeName" @tab-click="handleClick">
					    <el-tab-pane label="待办事项" name="first">
							<div class="panel-body waitTodo">
								<!-- <h4>待审批(<span style="color: #2fa0db;">18</span>)</h4>
								<h4>今日已办(<span style="color: #F59A23;">5</span>)</h4>
								<h4>我发起的(<span style="color: #6ac768;">30</span>)</h4>
								<h4>被驳回(<span style="color: #f96866;">2</span>)</h4>
								<h4>已完结(<span style="color: #b3b3b3;">66</span>)</h4> -->
								<div>
									<p class="blue-bg">
										<img src="/img/even_allow.png" alt="">
									</p>
									<span>待审批 (18)</span>
								</div>
								<div>
									<p class="green-bg">
										<img src="/img/even_finished.png" alt="">
									</p>
									<span>今日已办 (10)</span>
								</div>
								<div>
									<p class="yellow-bg">
										<img src="/img/even_task.png" alt="">
									</p>
									<span>我发起的 (18)</span>
								</div>
								<div>
									<p class="red-bg">
										<img src="/img/even_quit.png" alt="">
									</p>
									<span>被驳回 (5)</span>
								</div>
								<div>
									<p class="purple-bg">
										<img src="/img/even_end.png" alt="">
									</p>
									<span>已完结 (20)</span>
								</div>
							</div>
							<a class="wait-todo-more" href="javascript:void(0);">更多>></a>
						</el-tab-pane>
					    <el-tab-pane label="系统公告" name="second">
							<div class="panel-body">
								<ol class="systemNote">
									<li>12月部门销冠王为销售一部的羊亚萍！！！<span class="fr">12/19</span></li>
									<li>11月部门销冠王为销售一部的王博文！！！<span class="fr">11/19</span></li>
									<li>10月部门销冠王为销售一部的李鑫！！！<span class="fr">10/19</span></li>
									<li>9月部门销冠王为销售一部的李鑫！！！<span class="fr">09/19</span></li>
								</ol>
								<a href="" class="text-center viewMore">查看更多<i class="fa fa-angle-double-down"></i></a>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="新闻" name="third">
							<div class="panel-body">
								<ol class="systemNote">
									<li>湘北智造新闻湘北智造新闻<span class="fr">12/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">11/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">10/19</span></li>
									<li>湘北智造新闻湘北智造新闻<span class="fr">09/19</span></li>
								</ol>
								<a href="" class="text-center viewMore">查看更多<i class="fa fa-angle-double-down"></i></a>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-card>
			<el-card class="box-card">
				<div class="item" style="height:984px;">
					<el-tabs v-model="activeNameTwo" @tab-click="handleClick">
					    <el-tab-pane label="订单记录" name="first">
							<div class="panelBody">
								<div class="timeline">
									<div>11-17</div>
								</div>		                                
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">订单编号:DD20191117010001</td>
											<td style="font-size:16px;">订单金额： 50000元</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='3'>订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>订单客户：湘北智造集团</td>
											<td>签约人：谭泽曦</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
								<div class="timeline">
									<div>11-16</div>
								</div>		                                
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">订单编号:DD20191117010001</td>
											<td style="font-size:16px;">订单金额： 50000元</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='3'>订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>订单客户：湘北智造集团</td>
											<td>签约人：谭泽曦</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">订单编号:DD20191117010001</td>
											<td style="font-size:16px;">订单金额： 50000元</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='3'>订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>订单客户：湘北智造集团</td>
											<td>签约人：谭泽曦</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
								<div class="timeline">
									<div>11-15</div>
								</div>		                                
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">订单编号:DD20191117010001</td>
											<td style="font-size:16px;">订单金额： 50000元</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='3'>订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>订单客户：湘北智造集团</td>
											<td>签约人：谭泽曦</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">订单编号:DD20191117010001</td>
											<td style="font-size:16px;">订单金额： 50000元</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='3'>订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>订单客户：湘北智造集团</td>
											<td>签约人：谭泽曦</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="回款记录" name="second">
							<div class="panelBody">
								<div class="timeline">
									<div>11-17</div>
								</div>		                                
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;">回款编号:HK20191117010001</td>
											<td style="font-size:16px;">回款金额： 50000元</td>
											<td style="font-size:16px;">逾期状态：正常</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='4'>关联订单标题：湘北智造集团-企业尊享版采购订单</td>														
										</tr>
										<tr>
											<td>关联订单编号：DD20190324010001</td>
											<td>付款方式：现金</td>
											<td>第1/1期</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="跟进记录" name="third">
							<div class="panelBody">
								<div class="timeline">
									<div>11-17</div>
								</div>		                                
								<div class="timeline-item">
									<table class="ordertable">
										<tr>
											<td style="font-size:16px;padding-top:0;"><i class="fa fa-user-circle"></i> 赵小刚  跟进(到访)</td>
											<td align="right"><i class="fa fa-clock-o"></i> 2019-11-17 22:31</td>
										</tr>
										<tr>
											<td colspan='2'>上门拜访了客户，客户对产品意向很高，但是希望价格能再优惠一点</td>														
										</tr>
										<tr>
											<td>来自客户：湘北智造集团</td>
											<td align="right"><div class="label-primary">详情 <i class="fa fa-angle-right"></i></div></td>
										</tr>
									</table>
								</div>
							</div>
						</el-tab-pane>
					    <el-tab-pane label="常用通讯录" name="fourth">
							<div class="panel-body">
								<table class="ordertable addressBook" style="margin:0;">
									<tr>
										<td style="font-size:16px;padding-top:0;"><i class="fa fa-user-circle"></i> 刘晓雷</td>
										<td style="font-size:16px;padding-top:0;" colspan='3'>总经办 | 总经理</td>
									</tr>
									<tr>
										<td>联系人类别：公司员工</td>
										<td>手机：18888888888</td>	
										<td>座机：0731-88888888</td>															
										<td align="right"><div class="label-primary posit">详情 <i class="fa fa-angle-right"></i></div></td>
									</tr>
								</table>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>                   
			</el-card>
		</el-col>
		<el-col :span="6">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				  <span>当月销售、回款目标</span>
				</div>
				<div class="item clearfix">
					<div class="fl">
						<div id="home-boardChart1">
							<avue-echart-gauge :option="echartGauge1" :data="dataGauge1" width="100%" height="150"></avue-echart-gauge>
						</div>
						<div class="saleTotal">当月销售额 <span>6.8</span> 万元</div> 
					</div>
					<div class="fr">
						<div id="home-boardChart2">
							<avue-echart-gauge :option="echartGauge2" :data="dataGauge2" width="100%" height="150"></avue-echart-gauge>
						</div>
						<div class="saleTotal">当月回款额 <span style="color:#F59A23">6.8</span> 万元</div> 
					</div>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				  <span>成交客户排名 <i class="fa fa-user"></i> (单位：万元)</span><span class="fr ft12">更多</span>
				</div>
				<div class="item clearfix">
					<div class="ibox-content" id="home-barChart1">
						<avue-echart-bar :option="barOption" :data="barData" width="100%" height="395"></avue-echart-bar>
					</div>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				  <span>回款客户排名 <i class="fa fa-user"></i> (单位：万元)</span><span class="fr ft12">更多</span>
				</div>
				<div class="item clearfix">
					<div class="ibox-content" id="home-barChart2">
						<avue-echart-bar :option="barOption1" :data="barData1" width="100%" height="395"></avue-echart-bar>
					</div>
				</div>
			</el-card> 
		</el-col>
	</el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStore } from '@/util/store'
export default {
  name: "myDesktop",
  data () {
    return {
      laydate: window.laydate,
	  activeName:'first',
	  activeNameTwo:'first',
	  pileUpOption:{
		 category:true,
		 gridX:60,
		 gridY2:100,
		 legend:true,
		 legendOrient:'horizontal',
		 legendFontSize:9,
		 fontSize:12,
		 "barColor": [
			{
			  "color1": "#2ec7c9"
			},
			{
			  "color1": '#b6a2de'
			}
		 ] 
	  },
	  pileUpOption_line: {
        smooth: true,//是否顺滑
		areaStyle: true,//是否面积
		nameColor: 'rgba(255,255,255,.5)',
		lineColor: 'rgba(255,255,255,.5)',
		yAxisSplitLineShow: false,
		"barColor": [
			{
			  "color1": "#0E9CFF"
			},
			{
			  "color1": '#C18FF5'
			}
		 ] 
	  }, 
	  pileUpData:{
		"categories": ['谭炎焱','谭泽曦','严辉','梁毅','张林发','王博文','羊亚萍','龙泉','李鑫','刘晓雷'],
		"series": [
		  {
			"name": "计划销售",
			barGap:'-100%',
			type: 'bar',
			label: {
				normal: {
					show: true,
					position: 'insideRight'
				}
			},
			"data": [4, 4, 4, 4, 4, 6, 6, 6, 8, 10]
		  },
		  {
			 "name": "实际销售",
			 
			 barGap:'-100%',
			 type: 'bar',
			 label: {
				normal: {
					show: true,
					position: 'insideRight'
				}
			 }, 
			 "data": [2.1, 2.4, 2.8, 3.3, 3.5, 3.6, 4.8, 5.7, 7.8, 15]
		  }
		]
	  },
	  dataGauge1: {
	  		value: 56,
	  		name: '完成率',
	  		min: 0,
	  		max: 100,
	  		unit: '%'
	  },
	  echartGauge1: {
	  		lineSize: 12,		
	  		axisLabelShow:false,
	  		barColor: [{
	  		  postion: 0.56,
	  		  color1: '#2ec7c9'
	  		},
	  		{
	  		  postion: 1,
	  		  color1: '#999'
	  		}
	  		]
	  },
	  dataGauge2: {
	  		value: 56,
	  		name: '完成率',
	  		min: 0,
	  		max: 100,
	  		unit: '%'
	  },
	  echartGauge2: {
	  		lineSize: 12,		
	  		axisLabelShow:false,
	  		barColor: [{
	  		  postion: 0.56,
	  		  color1: '#F59A23'
	  		},
	  		{
	  		  postion: 1,
	  		  color1: '#999'
	  		}
	  		]
	  },
	  barOption:{
		 category:true,
		 gridY2:100,
		 gridX:120,
		 yAxisSplitLineShow: false,
		 "barColor": [
			{
			  "color1": "#2EC7C9",
			}
		 ] 
	  },
	  barData:{
		  "categories": [
		  "湘北制造(广西)",
		  "湘北制造(宁夏)",
		  "湘北制造(贵州)",
		  "湘北制造(台湾)",
		  "湘北制造(北京)",
		  "湘北制造(西安)",
		  "湘北制造(深圳)",
		  "湘北制造(香港)",
		  "湘北制造(广州)",
		  "湘北制造集团"
		],
		"series": [
		  {
			"name": "2019年",
			"data": [
			  3.3,
			  11.1,
			  13.2,
			  14.5,
			  18.8,
			  19.7,
			  23.8,
			  26.9,
			  28.7,
			  35.9
			]
		  }
		]
	  },
	  barOption1:{
		 category:true,
		 gridY2:100,
		 gridX:120,
		 yAxisSplitLineShow: false,
		 "barColor": [
			{
			  "color1": "#F59A23",
			}
		 ] 
	  },
	  barData1:{
		  "categories": [
		  "湘北制造(宁夏)",
		  "湘北制造(云南)",
		  "湘北智造(贵州)",
		  "湘北智造(台湾)",
		  "湘北智造(澳门)",
		  "湘北智造(香港)",
		  "湘北制造(西安)",
		  "湘北制造(广州)",
		  "湘北制造(北京)",
		  "湘北制造集团"
		],
		"series": [
		  {
			"name": "2019年",
			"data": [
			  8.6,
			  9.8,
			  16.6,
			  17.2,
			  18.6,
			  19.5,
			  20.5,
			  21,
			  29,
			  30
			]
		  }
		]
	  },
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted () {
	  this.laydate.render({
	  	  elem: '#calendarBox',
	  	  position: 'static',
	  	  format: 'YYYY-MM-DD', //日期格式
	  	  showBottom: false,
	  	  theme: '#02A7F0',
	  	  mark: this.getSunday()
	  });
	if(getStore({name:'themeName'}) == 'eveningTheme'){
		this.barOption.nameColor = 'rgba(255,255,255,.5)';
		this.barOption.lineColor = 'rgba(255,255,255,.5)';
		this.barOption1.nameColor = 'rgba(255,255,255,.5)';
		this.barOption1.lineColor = 'rgba(255,255,255,.5)';
	}
  },
  methods: {
	  getSunday(){
		let today=new Date();
		let weekday=today.getDay();
		var markDay={}
		for(var i=1;i<=7;i++){
			var str="";
			let dd=new Date(1000*60*60*24*(i-weekday) + today.getTime());
			let y = dd.getFullYear();
			  let m = dd.getMonth()+1;//获取当前月份的日期
			  m=parseInt(m,10);
			  if(m<10){
				  m="0"+m;
			  }
			  let d = dd.getDate();
			  d=parseInt(d,10);
			  if(d<10){
				  d="0"+d;
			  }
			  str=y+"-"+m+"-"+d;
			  markDay[str]="";
		}
		  return markDay;
	},
	handleClick(tab, event) {

	}
  }
};
</script>

<style scoped="scoped">
.ft12{
	font-size: 12px;
}
.el-col{
	padding: 0 5px;
}
/*我的桌面样式*/
.deskTopBox img{
	display:block;
	margin:0 auto 10px;
	padding-top:20px;
}
.deskTopBox .el-col{height:125px;}
.deskTopBox .el-col div{
	width:125px;
	height:125px;
	text-align:center;
	font-size:14px;
	color:#666;
	margin: 0 auto;
}
.deskTopBox .el-col:hover div{
	box-shadow: 0px 0px 5px 5px #f2f2f2;
    border-radius: 10px;
    margin-top: -5px;
}
#imgBox img{
	width: 80px; height: 80px;border-radius: 10px;margin-right:20px;
}
.profile-element{
	padding:20px 30px 0 0;
}
.deskTop #F_RealName{
	font-size:20px;color:#666;
	height: 50px;
    display: block;
}
#F_Role{
	font-size:14px;color:#999;
}
#F_Role span{
	max-width: 347px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    float: left;
    padding-right: 10px;
}
.deskTop .ibox-title{
	height:150px;
	min-width: 1654px;
}
.calLabel{
	background:#02A7F0;
	border-radius:5px;
	font-size:12px;
	color:#fff;
	width:50px;height:35px;
	line-height:35px;
	margin-right:10px;
}
.feed-activity-list{
	padding: 20px;	
}
.feed-activity-list .feed-element-li{
	padding-bottom:20px;
}
.media-body .end{
	background:#F95E5A;
	color:#fff;
	border-radius:5px;
	padding:0 8px;
	width:48px;
}
.media-body .ing{
	background:#F59A23;
	color:#fff;
	border-radius:5px;
	padding:0 8px;
	width:48px;
}
.waitTodo{
	padding-top: 70px;
}
.waitTodo h4{
	color:#666;
	padding:0px 24px 0px 0px;
	display: inline-block;
	margin: 0px 0px 10px 0;
	
}
.waitTodo h4:last-child{
	padding-right: 0px;
}
.waitTodo h4 span{
	color:#f96866;
	font-size:16px;
}
.waitTodo a{
	color:#999;
}
.systemNote{
	font-size:14px;
	color:#666;
	line-height:28px;
	padding:0;
}
.systemNote li:before{
	content:"";
	width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    display: block;
    float: left;
    margin: 10px 14px 0 5px;
}
.systemNote span{
	color:#b3b3b3;
}
.viewMore{
	display:block;
	color:#999;
	font-size:16px;
}
.viewMore:hover{
	color: #409EFF;
}
.timeline{
	border-left:1px solid #F2F2F2;
	position:relative;
	padding:0 0 30px 30px;
}
.timeline:before{
	content:"";
	width: 10px;
    height: 10px;
    background: #0079FE;
    border-radius: 50%;
    display: block;
    position:absolute;
    top:7px;
    left:-6px;
}
.timeline div{
    background: #0079FE;
    color:#fff;
    font-size:12px;
    width:50px;height:25px;
    line-height:25px;
    text-align:center
}
.timeline:after{
	content:"";
	position: absolute;
    top: 0px;
    left: 4px;
    display: block;
    border-width: 13px;
    border-style: solid;
    border-color: transparent #0079FE transparent transparent;
    border-radius: 2px;
}
.ordertable{
	background:#F7FBFE;
	height:110px;
	border:1px solid #D7E8F4;
	margin-left:20px;
	width: 100%;
	color: #666;
	font-size: 12px;
}
.ordertable tr:nth-child(even){
	background: none;
}
.ordertable tr td{
	padding: 0 20px;
}
.ordertable tr:first-child td{
	padding-top: 10px;
}
.timeline-item{
	border-left:1px solid #F2F2F2;
	position:relative;
	padding:0 0 30px;
	margin-right: 20px;
}
.timeline-item:before{
	content:"";
	width: 6px;
    height: 6px;
    background:#fff;
    border:2px solid #0079FE;
    border-radius: 50%;
    display: block;
    position:absolute;
    top:-3px;
    left:-6px;
}
.ordertable .label-primary{
	background-color: #02A7F0;
	color: #FFFFFF;
	width:60px;
	height:28px;
	line-height:28px;
	margin-bottom: 6px;
	text-align:center;
	font-size:12px;
	border-radius: 5px;
}
.ordertable .fa-user-circle{
	font-size: 22px;
    color: #ccc;
}
/* .ordertable .label-primary.posit{
	position:absolute;
	right:40px;
	top:50px;
} */
.ordertable.addressBook{
	height:98px;
}
#calendarBox{
	height: 330px;
}
#calendar{
	border: 1px solid #ccc;
	border-top: 0;
	height: 100%;
}
.fl{
	float: left;
}
.fr{
	float: right;
}
.el-card{
	margin-bottom: 10px;
}
.deskTop{
	overflow-x: auto;
	overflow-y: hidden;
	height: 152px;
	margin-bottom: 2px;
}
.deskTop .item{
	min-width: 1650px;
}
.text-center {
    text-align: center;
}
.media-body{
    font-size: 12px;
}
.text-muted {
    color: #888888;
}
.panelBody{
	padding: 0 10px;
}
.saleTotal {
    color: #666;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}
.saleTotal span {
    color: #02A7F0;
    font-size: 25px;
}
.clearfix{
	display: block;
	overflow: hidden;
}
.layui-laydate-select{
	text-align: center;
}
</style>
