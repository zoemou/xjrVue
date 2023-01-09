<template>
<div style="height:100%">
    <draggable v-model="HomeAllStep.stepTwo" @end="end" group="itxst" animation="300" style="height:100%"> 
        <div v-for="(item,index) in HomeAllStep.stepTwo" :key="index" :class="['FKmoveNode',homeActiveData.id==item.id?'FKmakeIng':'']" @click="changeCurCompent(item)">
            <div v-if="item.type=='solidImg'" class="compNode">
                <el-carousel trigger="click" :height="item.height+'px'" arrow="never" :initial-index="item.initialIndex">
                    <el-carousel-item v-for="(it,idx) in 4" :key="idx">
                        <a href="javascript:void(0)" class="imgSwiper">
                            <img :src="item.imgs[idx]" style="height:100%;margin: 0 auto;display: block;"/>
                            <p class="small" v-if="item.solidType==2">{{ item.titles[idx] }}</p>
                        </a>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div v-if="item.type=='solidText'" :style="{background:item.bgcolor}" class="compNode">
                <el-carousel :height="item.height+'px'" direction="vertical">
                    <el-carousel-item v-for="(it,idx) in 4" :key="idx">
                        <a href="javascript:void(0)" class="textSwiper"><div :style="{color:item.textcolor[idx],lineHeight:item.height+'px',height:item.height+'px'}">{{ item.titles[idx] }}</div></a>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div v-if="item.type=='imgCard'" class="compNode">
                <el-row style="margin:0" v-if="item.cardType==1"> 
                    <el-col :span="12" v-for="o in item.dataList||parseInt(item.num)" :key="o" style="margin-bottom:0">
                        <el-card :body-style="{ padding: '10px 10px 0'}" shadow="never">
                            <el-image :src="o[item.imgUrl]">
                                <div slot="error" class="image-slot">
                                    <i class="fa fa-photo"></i>
                                </div>
                            </el-image>
                            <div style="padding: 8px;">
                                <div style="-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;height: 34px;">{{o[item.info]||'美颜数码相机，自拍不P图照样很美！'}}</div>
                                <div style="display:flex;justify-content: space-between;margin-top:6px">
                                    <el-link :icon="item.icons1||'el-icon-user'" :underline='false'>{{o[item.labels1]?(o[item.labels1]).toString().slice(0,3):'数码党'}}</el-link>
                                    <el-link :icon="item.icons2||'el-icon-view'" :underline='false'>{{o[item.labels2]?(o[item.labels2]).toString().slice(0,3):12*o}}</el-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row style="margin:0;padding-bottom:10px" v-else> 
                    <el-col :span="24" v-for="o in item.dataList||parseInt(item.num)" :key="o" style="margin-bottom:0">
                        <el-card :body-style="{ padding: '10px 10px 0',display:'flex'}" shadow="never">
                            <el-image style="width:35%" :src="o[item.imgUrl]">
                                <div slot="error" class="image-slot">
                                    <i class="fa fa-photo"></i>
                                </div>
                            </el-image>
                            <div style="padding:0 8px;">
                                <div style="height:70px;overflow: hidden;margin-bottom: 8px;">{{o[item.info]||'美颜数码相机，自拍不P图照样很美！'}}</div>
                                <div style="display:flex;justify-content: space-between;margin-top:6px">
                                    <el-link :icon="item.icons1||'el-icon-user'" :underline='false'>{{o[item.labels1]?(o[item.labels1]).toString().slice(0,3):'数码党'}}</el-link>
                                    <el-link :icon="item.icons2||'el-icon-view'" :underline='false'>{{o[item.labels2]?(o[item.labels2]).toString().slice(0,3):12*o}}</el-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type=='videoPlay'" class="compNode">
                <el-row style="margin:0">			
                    <el-col :span="24" v-for="o in item.dataList||parseInt(item.num)" :key="o" style="margin-bottom:0">
                        <el-card :body-style="{ padding: '10px 10px 0'}" shadow="never">
							<video :src="o[item.imgUrl]" controls="controls" v-if="o[item.imgUrl]" style="width:100%;height:188px">
							your browser does not support the video tag
							</video>
                            <el-image style="height:188px" v-else>
                                <div slot="error" class="image-slot">
                                    <i class="fa fa-video-camera"></i>
                                </div>
                            </el-image>
                            <div style="padding:8px;">
                                <div style="color: #666;font-size: 18px;line-height:24px;font-weight:bold">{{o[item.info]||'CSGO年度精彩时刻'}}</div>
                                <div style="display:flex;justify-content: space-between;margin-top:6px">
                                    <el-link :icon="item.icons1||'fa fa-thumbs-o-up'" :underline='false'>{{o[item.labels1]?(o[item.labels1]).toString().slice(0,3):10*o}}</el-link>
                                    <el-link :icon="item.icons2||'el-icon-view'" :underline='false'>{{o[item.labels2]?(o[item.labels2]).toString().slice(0,3):12*o}}</el-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type=='grid'" class="compNode">
                <el-row>
                    <el-col :span="6" v-for="(o,i) in item.menu" :key="i" style="margin-bottom:0">
                        <div class="gongGeLi"><i :class="o.F_Icon||'fa fa-photo'"></i><div>{{o.F_Name}}</div></div>
                    </el-col>
                    <block v-if="item.menu.length<=2">
                        <el-col :span="6" v-for="o in 6" :key="o" style="margin-bottom:0">
                            <div class="gongGeLi"><i class="fa fa-photo"></i><div>菜单</div></div>
                        </el-col>
                    </block>
                </el-row>
            </div>
            <div v-if="item.type=='nav'" style="margin-top:10px">
                <el-tabs v-model="item.active" stretch>
                    <el-tab-pane :label="item.titles[i]" :name="o" v-for="(o,i) in parseInt(item.num)" :key="o">
                        <span slot="label" 
						:style="{color:item.active==o?item.highcolor:item.color,height:item.height+'px',
						lineHeight:item.height+'px',display:'block',padding: '0 10px',
						borderBottom: item.active==o?'2px solid '+item.highcolor:0}">{{item.titles[i]}}</span>
                        <div :style="{height:item.conheight+'px'}">
                            <div style="padding:10px;border-radius:4px;background:#fff">{{item.titles[i]+'内容'}}</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="item.type=='swiperComponent'" class="compNode">
                <h3 style="font-size: 14px;color: #666;margin:0;padding:10px">{{item.title}}</h3>
                <el-carousel trigger="click" :height="item.height+'px'" arrow="never">
                    <el-carousel-item v-for="o in item.dataList||parseInt(item.num)" :key="o">
                        <a href="javascript:void(0)" class="compSwiper" style="color:#666;text-decoration:none">
                            <el-image style="height:50%" :src="o[item.imgUrl]">
                                <div slot="error" class="image-slot">
                                    <i class="fa fa-photo"></i>
                                </div>
                            </el-image>
                            <div style="padding:0 10px 10px;height:50%;overflow:hidden">
                                <h3>{{o[item.info]||'内容标题'}}</h3>
                                <p class="small">{{o[item.content]||'日盼夜盼脱单，如今终于逃离了单身狗身份，原来爱情是如此甜蜜呀。和心爱的人一起的日子，简直每时每刻都想记录下来...'}}</p>
                            </div>
                        </a>
                    </el-carousel-item>
                </el-carousel>
            </div>
            
            <div v-if="item.type=='List'" class="compNode">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span style="font-size:12px;font-weight:bold;">{{item.title}}</span>
                        <el-link type="info" :underline="false" style="font-size:12px;color:#999;float: right;">更多<i class="el-icon-arrow-right"></i></el-link>
                    </div>
                    <div v-for="o in item.dataList||parseInt(item.num)" :key="o" class="textItem">
                        <a href="javascript:void(0)">
                            <div class="imgbox">
								<el-image style="height:100%" :src="o[item.imgUrl]">
									<div slot="error" class="image-slot">
										<i class="fa fa-photo"></i>
									</div>
								</el-image>
							</div>
                            <div class="infoBox">
                                <div style="font-size:13px;color:#666">{{o[item.info]||'内容标题'}}</div>
                                <div style="font-size:12px;color:#999">{{o[item.content]||'内容副标题或其他标签'}}</div>
                            </div>
                        </a>
                    </div>
                </el-card>
            </div>
            <div v-if="item.type=='taskList'" class="compNode">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span style="font-size:12px;font-weight:bold;">待办任务</span>
                        <el-link type="info" :underline="false" style="font-size:12px;color:#999;float: right;">更多<i class="el-icon-arrow-right"></i></el-link>
                    </div>
                    <div v-for="o in parseInt(item.num)" :key="o" class="textItem">
                        <a href="javascript:void(0)">
                            <div class="level">等级</div>
                            <div class="infoBox">
                                <div style="font-size:13px;color:#666">任务标题<el-tag size="mini" effect="dark" style="margin-left:10px">状态</el-tag></div>
                                <div style="font-size:12px;color:#999">任务节点<span class="fr">发起人</span></div>
                            </div>
                        </a>
                    </div>
                </el-card>
            </div>
            <div v-if="item.type=='table-chart'" class="compNode">
                <avue-crud :data="item.tableData" :option="item.tableOption" :style="{height:item.height+'px'}"></avue-crud>
            </div>
            <div v-if="item.chatType!==undefined" class="compNode" style="padding:10px 0 0 10px">
                <div style="font-weight: bold;font-size: 14px;padding-bottom: 8px;">{{item.F_Text}}</div>
                <div style="font-size: 12px;color:#999">{{item.F_Subtext}}</div>
                <div :id="item.id" :style="{width:'100%',height:item.height+'px'}"></div>
            </div>                  
            <div class="tipDelObj">
                <span :class="index%2 == 0?'tooltipLeft':'tooltipRight'">{{item.tips}}</span>
                <span :class="index%2 == 0?'tooltipLeft deleteBtnL':'tooltipRight deleteBtnR'" @click.stop="homeActiveData.id==item.id?deleteCompent(index):''"><i class="fa fa-trash"></i></span>
            </div>
        </div> 
    </draggable>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import {deepClone} from '@/utils/index';
import store from '@/store/index';
import {mapGetters} from "vuex"
export default {
  //  props:['formList'],
   components: {
      draggable
    },
  data () {
    return {
       rules:{}
    }
  },
  computed: {
    ...mapGetters(['HomeAllStep','homeActiveData'])
  },
   methods: {
    deleteCompent(index){   
		if(this.homeActiveData.refreshFunc) clearInterval(this.homeActiveData.refreshFunc)
        this.HomeAllStep.stepTwo.splice(index,1);
        if(this.HomeAllStep.stepTwo.length>0){
            store.commit('setHomeActiveData', this.HomeAllStep.stepTwo[0]);    
        }else{    
            store.commit('setHomeActiveData', {});    
        }
        
    },
    changeCurCompent(item){
        store.commit('setHomeActiveData', item);
    },
    end(e){       
        if(e.newIndex==e.oldIndex){
            var w = (window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth)-300;
            //相等表示删除，否则是排序
            if(e.originalEvent.x>w||e.originalEvent.x<150) this.deleteCompent(e.newIndex)
        }
        
    },
    myEcharts(id,option){
        // 基于准备好的dom，初始化echarts实例
        this.$nextTick(function(){
            var myChart = this.$echarts.init(document.getElementById(id));			
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option,true);
        }) 
    }
   }
}
</script>
<style scoped>
a{
    text-decoration: none;
}
*{
    box-sizing: border-box;
    line-height: 1.42857143;
}
::v-deep .el-carousel__indicator button{
    background: #ccc;
}
::v-deep .el-carousel__indicator.is-active button{
    background: #02A7F0;
}
::v-deep .el-carousel__indicators--vertical{
    display: none;
}
::v-deep .el-card{
    background: none;
}
::v-deep .avue-crud .el-table th {
    background: rgb(217, 236, 255);
}
.el-link.el-link--default, ::v-deep .el-icon-view{
    font-size: 12px;
}
::v-deep .el-link--inner{
    padding-left: 6px;
}
.textSwiper{
    color: #999;
    display: flex;
    align-items: center;
}
.imgSwiper{
    display: block;
    position: relative;
    height: 100%;
}
.textSwiper div{
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 40px;
}
.textSwiper:before {
    content: "";
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    display: block;
    margin: 0 10px 0 15px;
}
.imgSwiper p{
    color: #999;
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.gongGeLi {
    text-align: center;
    padding: 10px 0;
}
.gongGeLi i{
	font-size: 20px;
    color: #fff;
    display: block;
    margin: 0 auto 10px;
    background: #e4e4e4;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    line-height: 50px;
}
.box-card{
    padding: 0 10px;
}
::v-deep .box-card .el-card__header{
    padding: 12px;
}
::v-deep .box-card .el-card__body{
    padding: 0
}
.compSwiper h3{
    text-align:center;padding:0 10px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;margin: 0;
}
.compSwiper img{
    width:100%;height:50%;display: block;
}
.compSwiper p{
    margin: 0;height: calc(100% - 60px);overflow: hidden;
}
::v-deep .el-tabs__item{
    height: auto;
    padding: 0;
}
::v-deep .el-tabs__nav-wrap::after{
    display: none;
}
::v-deep .el-tabs__header{
	/* border-bottom: 1px solid #eee; */
    background: #fff;
    margin: 0px 0px 5px 0px;
    box-sizing: border-box;
}
::v-deep .el-carousel__indicators--horizontal{
    width: 100%;
    text-align: center;
}
.FKmoveNode{
    position: relative;
    cursor: move;
	margin:10px;
	border-radius: 4px;
	box-sizing: border-box;
}
.compNode{
    background: #fff;
    border-radius:4px;
}
.FKmakeIng{
     border: 1px dashed #409EFF;
}
.textItem a {
    border-bottom: 1px solid #f2f2f2;
    padding: 10px;
    display: flex;
    align-items: flex-start;
}
.textItem .imgbox {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background: #E4E4E4;
    margin-right: 10px;
}
.textItem .infoBox {
    flex: 1;
}
.textItem .level{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background: #E4E4E4;
    margin-right: 10px;
    border-radius:50%;font-size:13px
}
.fl{
    float: left;
}
.fr{
    float: right;
}
.tipDelObj{
	cursor: pointer;
}
.tooltipLeft {
    width: 92px;
    background-color: #fff;
    color: #999;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 110%;
	border:1px solid #ccc;
	font-size: 12px;
}
.tooltipRight {
    width: 92px;
    background-color: #fff;
    color: #999;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 110%;
	border:1px solid #ccc;
	font-size: 12px;
}
.tooltipLeft::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent transparent #fff;
	z-index:2
}
.tooltipLeft::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent transparent #ccc;
}
.tooltipLeft.deleteBtnL{
	top: 31px;
    width: 42px;
    font-size: 20px;
    padding: 0;
}
.tooltipRight.deleteBtnR{
	top: 31px;
    width: 42px;
    font-size: 20px;
    padding: 0;
}
.tooltipRight::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: transparent #ccc transparent transparent;
	z-index:1
}
.tooltipRight::before {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
	z-index:2
}
.FKmakeIng .tooltipLeft,
.FKmakeIng .tooltipRight{
	color:#02A7F0
}
.addLine.el-link.el-link--primary{
    text-align: center;
    width: 100%;
    line-height: 50px;
}
::v-deep .el-image{
    width: 100%;
    height: 100px;
}
::v-deep .image-slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #eee;
    color: #fff;
    font-size: 30px;
}
</style>