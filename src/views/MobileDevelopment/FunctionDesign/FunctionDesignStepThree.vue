<template>
<div class="main-container">
    <el-container class="topMain">
        <el-header>
            <div class="groupTit"><i class="el-icon-picture"></i>{{$t('mobileDev.homeDesignStepTwo.leftTitle')}}</div>
            <div style="flex:1;font-size:12px;color:#999;text-align:right">{{$t('mobileDev.functionDesignStepThree.Explain')}}</div>
            <div class="groupTit" style="width: 320px;"><i class="el-icon-s-tools"></i>{{$t('mobileDev.homeDesignStepTwo.rightTitle')}}</div>
        </el-header>
        <el-container style="height:calc(100% - 60px)">
            <el-aside class="leftSide" width="200px">
              <draggable v-model="btnList" :options="{group:{name: 'itxst',pull:'clone',put:false},sort: false}" animation="300" @end="end" :clone="cloneComponent">
                  <el-button :icon="item.icon" v-for="(item,index) in btnList" class="btnDragger" :key="index">{{item.tips}}</el-button>
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
                      <el-row class="navCrumbs"><el-col :span="24" style="text-align:left;border-bottom:1px solid #ccc"><i class="fa fa-angle-left" style="font-weight: bold;font-size: 16px;padding-left:10px;"></i> {{$t('mobileDev.functionDesignStepThree.formPage')}}</el-col></el-row>
                    </div>
                  </div>
                  <div id="FKworkArea" :style="{top:'59px',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px',height:boxHeight+'px'}">                    
                    <div id="FKActionTable" ref="FKActionTable" :style="{minHeight:boxHeight+'px',marginRight:designHeight>boxHeight?'-6px':'0'}">
                      
                        <div style="position: absolute;top: 46%;left: 0;right: 0;text-align: center;font-size: 18px;color: #ccb1ea;" v-if="MDAllStepData.stepThree.length<=0">{{$t('mobileDev.functionDesignStepThree.hintDragComponent')}}</div>
                        <centerContainer></centerContainer>
                                           
                    </div> 
                  </div>
                  <!-- <div class="fixedBox" :style="{bottom:'0',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
                    <div style="border: 1px solid #eee;">
                      <div class="repeatBtn"><i class="fa fa-repeat"></i> 重置</div>
                      <div class="submitBtn">提交</div>
                    </div>
                  </div> -->
                </div>
            </el-main>
            </el-container>
            <el-aside class="rightSide" width="320px">
              <rightSide v-if="JSON.stringify(MFActiveData)!='{}'&&MFActiveData!=''"></rightSide>
            </el-aside>
        </el-container>
    </el-container>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import {btnList} from '@/components/mobileDesign/config';
import rightSide from './formRightSide.vue';
import centerContainer from './formCenterContainer';
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
      ...mapGetters(['MDAllStepData','MFActiveData'])
    },
    watch:{
     MFActiveData:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
          this.$nextTick(function(){
            this.designHeight=this.$refs.FKActionTable.clientHeight
          })            
         },
         deep:true //true 深度监听
     }
    },
    data () {
      return {
        boxWidth:0,
        boxHeight:0,
        designHeight:0,
        paddingLR:0,
        btnList:btnList,
        curItem:''
      }
    },
    methods: {
      cloneComponent(e){
        let item=deepClone(e);
        item.id=new Date().getTime(); //用时间戳做唯一id
        this.curItem=item;
      },
      end(e){
        
        //不允许拖拽
         let len=this.MDAllStepData.stepTwo.list.length
         if (this.curItem.type == 'table'&&len<=1){
           this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('mobileDev.functionDesignStepThree.Hint'),
              type: 'warning',
            });
            return false;
         }        
        this.MDAllStepData.stepThree.splice(e.newDraggableIndex, 0,this.curItem);   
        store.commit('setActiveData', this.curItem);   
      },
	  calcuSize(){
	    //手机背景图尺寸420*863，内容区域373*671，头部86
	    this.boxWidth=375//_this.$refs.designMain.clientHeight*373/863;
	    this.boxHeight=parseInt(this.$refs.designMain.clientHeight-60)//parseInt(_this.$refs.designMain.clientHeight*671/863-85);
	    //_this.positTop=_this.$refs.designMain.clientHeight*86/863;
	    this.paddingLR=(this.$refs.designMain.clientWidth-this.boxWidth)/2;
	  }
    },
    mounted() {
      this.calcuSize()
      window.addEventListener('resize',()=>{ // 定义窗口大小变更通知事件
        this.calcuSize()
      });         
    }
    
}

</script>
<style scoped>
.groupTit{
    font-size: 15px;font-weight:bold;width: 200px;
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
    height: 100%;
  }
  .el-aside .el-form-item{
    margin-top: 10px;
  }
  .leftSide{
    border-right: 1px solid #e7eaec;
    text-align: center;
  }
  .rightSide{
    border-left: 1px solid #e7eaec;
  }
  .el-main {
    color: #333;
    height: 100%;
    /* background: url(../../../assets/phoneCodebg.png) center no-repeat;  
    background-size: contain; */
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
  #FKActionTable{background: #f5f6fa;border: 1px solid #eee; box-sizing: border-box;}
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
	background: #02A7F0;
    line-height: 42px;
    text-align: center;
    font-size: 16px;
    color: #fff;cursor: none;
}
</style>