<template>
<div class="main-container">
    <el-container class="topMain">
        <el-header>
          <div class="groupTit"><i class="fa fa-newspaper-o"></i>{{$t('mobileDev.functionDesignStepFour.timeQuery')}}</div>
          <div style="flex:1;font-size:12px;color:#999;text-align:right">{{$t('mobileDev.functionDesignStepThree.Explain')}}</div>
          <div class="groupTit" style="width:320px;"><i class="el-icon-s-tools"></i>{{$t('mobileDev.homeDesignStepTwo.rightTitle')}}</div>
        </el-header>
        <el-container style="height:calc(100% - 60px)">
            <el-aside class="leftSide" width="200px">
              <draggable v-model="timeBtn" :options="{group:{name: 'itxst',pull:'clone', put: false},sort: false}" animation="300" @end="end" :clone="cloneComponent">
                  <el-button :icon="item.icon" v-for="(item,index) in timeBtn" class="btnDragger" :title="item.name" :key="index">{{item.name}}</el-button>
              </draggable>
              <div style="margin:20px 0 0px 0px;font-size: 15px;font-weight: bold;">{{$t('mobileDev.functionDesignStepFour.DataFieldQ')}}</div>
              <draggable v-model="MSFormList" :options="{group:{name: 'itxst',pull:'clone', put: false},sort: false}" animation="300" @end="end" :clone="cloneComponent">
                  <div v-for="(item,index) in MSFormList" :key="index">
                    <el-button :icon="item.icon" class="btnDragger" :title="item.name" v-if="item.type!='xjrTimeSearch'">{{item.name}}</el-button>
                  </div>                  
              </draggable>
            </el-aside>
            <el-container class="ibox-content">
            <el-main>
              <div style="height:100%;position:relative" ref="designMain">
                  <div class="fixedBox" :style="{top:'0',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
                    <div style="border: 1px solid #eee;">
                      <el-row class="phone-bar">
                        <el-col :span="8" style="text-align:left;"><div><i class="fa fa-signal"></i> <i class="fa fa-wifi"></i></div></el-col>
                        <el-col :span="8"><div style="text-align:center;"><span>9:41 AM</span></div></el-col>
                        <el-col :span="8" style="text-align:right;"><div><span>100%</span> <i class="fa fa-battery-full"></i></div></el-col>
                      </el-row>
                      <el-row class="navCrumbs">
                        <el-col :span="24" style="text-align:left;border-bottom:1px solid #F2F2F2"><i class="fa fa-angle-left" style="font-weight: bold;font-size: 16px;padding-left:10px;"></i> {{$t('mobileDev.functionDesignStepFour.mobileListTitle')}}</el-col>
                        <el-col :span="24" style="display:flex;justify-content: space-around;border-bottom: 1px solid #F2F2F2;line-height:40px">
                          <div>{{$t('mobileDev.functionDesignStepFour.Sort')}} <i class="fa fa-sort-amount-desc"></i></div>
                          <div style="color:#02A7F0">{{$t('mobileDev.functionDesignStepFour.Sifting')}} <i class="fa fa-filter"></i></div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div id="FKworkArea" :style="{top:'100px',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px',height:boxHeight+2+'px'}">
                    
                    <div id="FKActionTable" ref="FKActionTable" :style="{minHeight:boxHeight+'px',marginRight:designHeight>boxHeight?'-6px':'0'}">
                      <div style="position: absolute;top: 46%;left: 0;right: 0;text-align: center;font-size: 18px;color: #ccb1ea;" v-if="MDAllStepData.stepFour.length<=0">{{$t('mobileDev.functionDesignStepFour.Hint')}}</div>
                      <centerContainer></centerContainer>                     
                    </div> 
                  </div>
                </div>
            </el-main>
            </el-container>
            <el-aside class="rightSide" width="320px">
              <rightSide v-if="MSActiveData.type=='xjrTimeSearch'"></rightSide>
            </el-aside>
        </el-container>
    </el-container>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import rightSide from './searchRightSide.vue';
import centerContainer from './searchCenterContainer';
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
      ...mapGetters(['MDAllStepData','MFActiveData','MSActiveData'])
    },
    watch:{
     MSActiveData:{//深度监听，可监听到对象、数组的变化
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
            paddingLR:0,
            designHeight:0,
            timeBtn:[{
              name:this.$t('mobileDev.functionDesignStepFour.CustomTimeQ'),
              tips:this.$t('mobileDev.functionDesignStepFour.CustomTimeQ'),
              icon:'fa fa-calendar',
              field:'',
              type:'xjrTimeSearch'
            }],
            MSFormList:[],
            curItem:""
        }
    },
    methods: {
        cloneComponent(e){
          let item=deepClone(e);
          item.id=new Date().getTime(); //用时间戳做唯一id
          this.curItem=item;         
        },
        end(e){
          this.MDAllStepData.stepFour.splice(e.newDraggableIndex, 0,this.curItem)
          store.commit('setSearchCurData', this.curItem);  
        },
		calcuSize(){
		  this.boxWidth=375
		  this.boxHeight=parseInt(this.$refs.designMain.clientHeight-100);
		  this.paddingLR=(this.$refs.designMain.clientWidth-this.boxWidth)/2;
		}
    },
    mounted() {    
      this.calcuSize()
      window.addEventListener('resize',()=>{ // 定义窗口大小变更通知事件
        this.calcuSize()
      }); 
      
      this.MSFormList=[];
      this.MDAllStepData.stepThree.forEach(el => {
        if(el.type!='title'&&el.type!='table'&&el.type!='image'){
          this.MSFormList.push(el)         
        }
      });

      if(this.MDAllStepData.stepFour.length>0){
        this.MDAllStepData.stepFour.filter((el,idx)=>{
          let obj=this.MDAllStepData.stepThree.find(it=>{
            return it.type==el.type&&it.field==el.field&&it.table==el.table;
          })
          if(obj){  
            Object.assign(el,obj)
            return el       
          }
          if(el.type=="xjrTimeSearch"){   
            return el          
          }
        })
      }else{
        this.MDAllStepData.stepFour=[...this.MSFormList]
      }
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
  }
 
  .topMain {
    height: 100%;
  }
  .btnDragger{
     width: 165px;
     border: 1px solid #e7eaec;
     margin-top: 10px;
	 overflow: hidden;
	     white-space: nowrap;
	     text-overflow: ellipsis;
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
    background:#fff
  }
  .phone-bar{
    padding: 0 3px;
  }
  #FKworkArea{
    margin: 0px auto;
    position: absolute;left: 0;right: 0;z-index: 1;overflow:auto
  }
  #FKActionTable{background: #f5f6fa;margin-right: -6px;border: 1px solid #eee;}
  .ibox-content{
    padding-top:10px ;
  }
  .el-main{
    /* background: url(../../../assets/phoneCodebg.png) center no-repeat;background-size: contain; */
    height: 100%;  
  }
</style>