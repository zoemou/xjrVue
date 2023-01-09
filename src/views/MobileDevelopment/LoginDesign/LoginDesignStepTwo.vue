<template>
<div class="main-container">
    <el-container class="topMain">
        <el-container style="height:100%">
            <el-container class="ibox-content">
            <el-main>
              <div style="height:100%;position:relative;" ref="designMain">
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
                    <div id="FKActionTable" ref="FKActionTable" :style="{backgroundImage:'url('+LoginAllStep.stepTwo.backgroundImg+')'}">                      
                        <centerContainer ref="centerCon" :loginType="loginType" @change="typeChange"></centerContainer>                      
                    </div> 
                  </div>
                </div>
            </el-main>
            </el-container>
            <el-aside class="rightSide" width="328px">
              <div class="groupTit" style="width:320px"><i class="el-icon-s-tools"></i>{{$t('mobileDev.loginDesignStepTwo.Title')}}</div>
              <rightSide :loginType="loginType" @change="typeChange"></rightSide>
            </el-aside>
        </el-container>
    </el-container>
</div>
</template>
<script>
import {loginList} from '@/components/mobileDesign/config';
import rightSide from './LoginRightSide';
import centerContainer from './LoginCenterContainer';
import {mapGetters} from "vuex"
export default {
    components: {
      rightSide,
      centerContainer
    },
    computed: {
      ...mapGetters(['LoginAllStep'])
    },
    data () {
      return {
        boxWidth:0,
        boxHeight:0,
        paddingLR:0,
        loginList:loginList,
        loginType:0
      }
    },
    methods: {
      typeChange(val){
        this.$nextTick(()=>{
          this.loginType=val
        })       
      },
	  calcuSize(){
	    //手机背景图尺寸420*863，内容区域373*671，头部86
	    this.boxWidth=375//_this.$refs.designMain.clientHeight*373/863;
	    if(this.$refs.designMain){
	  	  this.boxHeight=this.$refs.designMain.clientHeight-31//parseInt(_this.$refs.designMain.clientHeight*671/863);
	      this.paddingLR=(this.$refs.designMain.clientWidth-this.boxWidth)/2;
	    }
	  }
    },
    mounted() {
      if(!this.LoginAllStep.stepThree) this.LoginAllStep.stepTwo= Object.assign({},this.LoginAllStep.stepTwo,this.loginList) ;
      this.calcuSize()
      window.addEventListener('resize',()=>{ // 定义窗口大小变更通知事件
        this.calcuSize()
      });     
    }
    
}

</script>
<style scoped>
.groupTit{
    font-size: 15px;font-weight:bold;width: 198px;border-bottom: 1px solid #e7eaec;
  }
  .el-aside {
    color: #333;
    text-align: center;
    height: 100%;
  }
  .el-aside .el-form-item{
    margin-top: 10px;
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
    position: absolute;left: 0;right: 0;z-index: 1;overflow-y:auto
  }
  #FKActionTable{background: #fff;background-size: contain;position: relative;height: 100%;background-repeat: no-repeat;border: 1px solid #eee;box-sizing: border-box;}

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
    border-top: 1px solid #ccc;
    padding-top: 5px;
}
.submitBtn li div{display: block;font-size: 20px;}
.submitBtn li.active{
  color: #02A7F0;
}
</style>