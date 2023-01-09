<template>
<div class="main-container">
    <el-container class="topMain">
        <el-header>
            <div class="groupTit"><i class="el-icon-picture"></i>{{$t('mobileDev.homeDesignStepTwo.leftTitle')}}</div>
            <div style="flex:1;font-size:12px;color:#999;text-align:right">{{$t('mobileDev.homeDesignStepTwo.Explain')}}</div>
            <div class="groupTit" style="width:320px"><i class="el-icon-s-tools"></i>{{$t('mobileDev.homeDesignStepTwo.rightTitle')}}</div>
        </el-header>
        <el-container style="height:calc(100% - 60px)">
            <el-aside class="leftSide" width="200px">
              <draggable v-model="viewList" :options="{group:{name: 'itxst',pull:'clone',put:false},sort: false}" animation="300" @end="end" :clone="cloneComponent">
                  <el-button v-for="(item,index) in viewList" class="btnDragger" :key="index">{{item.tips}}</el-button>
              </draggable>
              <div class="groupTit" style="margin-top:10px"><i class="el-icon-picture"></i>{{$t('mobileDev.homeDesignStepTwo.dynamicChart')}}</div>
              <draggable v-model="echartList" :options="{group:{name: 'itxst',pull:'clone',put:false},sort: false}" animation="300" @end="end" :clone="cloneComponent">
                  <el-button v-for="(item,index) in echartList" class="btnDragger" :key="index">{{item.tips}}</el-button>
              </draggable>
            </el-aside>
            <el-container class="ibox-content">
            <el-main>
              <div style="height:100%;position:relative" ref="designMain">
                  <div class="fixedBox" :style="{top:'0',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
                    <div style="border: 1px solid #eee;">
                      <el-row class="phone-bar">
                        <el-col :span="8" style="text-align:left;"><div> <i class="fa fa-signal"></i> <i class="fa fa-wifi"></i></div></el-col>
                        <el-col :span="8"><div style="text-align:center;"><span>9:41 AM</span></div></el-col>
                        <el-col :span="8" style="text-align:right;"><div><span>100%</span> <i class="fa fa-battery-full"></i> </div></el-col>
                      </el-row> 
                    </div>                  
                  </div>
                  <div id="FKworkArea" :style="{top:'30px',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px',height:boxHeight+'px'}">                    
                    <div id="FKActionTable"  ref="FKActionTable" :style="{minHeight:boxHeight+'px',marginRight:designHeight>boxHeight?'-6px':'0'}">
                        <div style="position: absolute;top: 46%;left: 0;right: 0;text-align: center;font-size: 18px;color: #ccb1ea;" v-if="HomeAllStep.stepTwo.length<=0">{{$t('mobileDev.homeDesignStepTwo.Prompt')}}</div>
                        <centerContainer ref="centerCon"></centerContainer>
                    </div> 
                  </div>
                  <div class="fixedBox" :style="{bottom:'0',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
                    <ul class="submitBtn">
                      <li class="active"><div class="fa fa-home"></div><span>{{$t('mobileDev.homeDesignStepTwo.indexBtn')}}</span></li>
                      <li><div class="fa fa-cog"></div><span>{{$t('mobileDev.homeDesignStepTwo.functionBtn')}}</span></li>
                      <li><div class="fa fa-envelope"></div><span>{{$t('mobileDev.homeDesignStepTwo.newsBtn')}}</span></li>
                      <li><div class="fa fa-user"></div><span>{{$t('mobileDev.homeDesignStepTwo.myBtn')}}</span></li>
                    </ul>
                  </div>
                </div>
            </el-main>
            </el-container>
            <el-aside class="rightSide" width="320px">
              <rightSide ref="rightSideBox"></rightSide>
            </el-aside>
        </el-container>
    </el-container>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import {viewList,echartList} from '@/components/mobileDesign/config';
import rightSide from './homeRightSide';
import centerContainer from './homeCenterContainer';
import {deepClone} from '@/utils/index';
import store from '@/store/index';
import {mapGetters} from "vuex"
export default {
    components: {
      draggable,
      rightSide,
      centerContainer
    },
    computed: {
      ...mapGetters(['HomeAllStep','homeActiveData'])
    },
    data () {
      return {
        boxWidth:0,
        boxHeight:0,
        designHeight:0,
        paddingLR:0,
        viewList:viewList,
        echartList:echartList,
        curItem:''
      }
    },
    watch:{
     homeActiveData:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
          this.$nextTick(function(){
            this.designHeight=this.$refs.FKActionTable.clientHeight
          })
          this.HomeAllStep.stepTwo.forEach(el => {
            if(el.chatType!=undefined){
              this.$refs.centerCon.myEcharts(el.id,el.option)
            }
          });           
         },
         deep:true //true 深度监听
     }
    },
    methods: {
      cloneComponent(e){
        let item=deepClone(e);
        item.id='comp'+new Date().getTime(); //用时间戳做唯一id
        this.curItem=item;
      },
      end(e){        
        this.HomeAllStep.stepTwo.splice(e.newDraggableIndex, 0,this.curItem);   
        store.commit('setHomeActiveData', this.curItem);    
        if(this.curItem.chatType!=undefined){
          this.$refs.centerCon.myEcharts(this.curItem.id,this.curItem.option)
        }       
      },
	  calcuSize(){
	    //手机背景图尺寸420*863，内容区域373*671，头部86
	    this.boxWidth=375//_this.$refs.designMain.clientHeight*373/863;
	    if(this.$refs.designMain){
	      this.boxHeight=this.$refs.designMain.clientHeight-75//parseInt(_this.$refs.designMain.clientHeight*671/863-48);
	      this.paddingLR=(this.$refs.designMain.clientWidth-this.boxWidth)/2;
	    }
	  }
    },
    mounted() {
      if(this.HomeAllStep.stepTwo.length>0){
        store.commit('setHomeActiveData', this.HomeAllStep.stepTwo[0]);    
      }
      this.HomeAllStep.stepTwo.forEach(el => {
        if(el.chatType!=undefined){
		  if(el.type=="circle-chart"||el.type=="pie-chart"){
		  	if(!el.option.legend.textStyle){
		  		el.option.legend.textStyle={
		  			width:50,
		  			overflow:'breakAll'
		  		}
		  	}
		  }
          this.$refs.centerCon.myEcharts(el.id,el.option)
		  this.$refs.rightSideBox.getEchartData(el)
        }
      });
      this.calcuSize()
      window.addEventListener('resize',()=>{ // 定义窗口大小变更通知事件
        this.calcuSize()
      });     
    },
	beforeDestroy() {
		this.HomeAllStep.stepTwo.forEach(el=>{
			clearInterval(el.refreshFunc)
		})
	}
    
}

</script>
<style scoped>
.groupTit{
    font-size: 15px;font-weight:bold;width: 198px;
  }
  .el-header{
    color: #333;
    line-height: 56px;
    text-align: center;
    padding: 0;
    border-bottom: 1px solid #e7eaec;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .el-aside {
    color: #333;
    text-align: center;
    height: 100%;
  }
  .el-aside .el-form-item{
    margin-top: 10px;
  }
  .leftSide{
    border-right: 1px solid #e7eaec;
  }
  .rightSide{
    border-left: 1px solid #e7eaec;
  }
  .el-main {
    color: #333;
    height: 100%;
  }
  
  .topMain {
    height: 100%;
  }
  .btnDragger{
     width: 165px;
     border: 1px solid #e7eaec;
     margin-top: 10px;
  }
  .el-button+.el-button {
    margin-left: 0;
  }
  ::v-deep .el-button [class*=fa]+span {
      margin-left: 5px;
  }
  .el-col{
    margin-bottom: 0;
  }
  .fixedBox{
    position: absolute;left: 0;right: 0;margin: auto;z-index: 2;
  }
  .phone-bar, .navCrumbs{
    line-height: 28px;
    background:#fff;
  }
  .phone-bar{
    padding: 0 3px;
  }
  #FKworkArea{
    margin: 0px auto;
    position: absolute;left: 0;right: 0;z-index: 1;overflow:auto
  }
  #FKActionTable{background: #FAFAFA;margin-right: -6px;padding-bottom: 15px;border:1px solid #eee}
  .ibox-content{
    padding-top:10px ;
  }
  .repeatBtn{
	background: #fff;
    color: #02A7F0;
    text-align: center;
    line-height: 42px;
    font-size: 16px;cursor: none;
}
.submitBtn{
	background: #fff;
    line-height: 18px;
    font-size: 12px;
    list-style: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0;
    color: #ccc;
    text-align: center;
    border: 1px solid #ccc;
    padding-top: 5px;
}
.submitBtn li div{display: block;font-size: 20px;}
.submitBtn li.active{
  color: #02A7F0;
}
</style>