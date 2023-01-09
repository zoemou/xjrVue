<template>
<div class="main-container">
    <el-container class="topMain">
        <el-header>
          <div class="groupTit">{{$t('mobileDev.functionDesignStepFive.titleNotShown')}}</div>
          <div style="flex:1;font-size:12px;color:#999;text-align:right">
            <div class="btnbox">
              <el-button v-for="(item,index) in MDAllStepData.stepFive.btn"
			  :type="item.select?'primary':''" size="small" :key="index" @click="item.select=!item.select">{{item.name}}</el-button>
            </div>
            <div style="float:right;font-size:12px;color:#999">{{$t('mobileDev.functionDesignStepFive.Hint')}}</div>
          </div>
          <div class="groupTit" style="width:300px;">{{$t('mobileDev.functionDesignStepFive.titleSetFName')}}({{MLListCurItem.name}})</div>
        </el-header>
        <el-container style="height:calc(100% - 60px)">
            <el-aside class="leftSide" width="200px">
              <draggable v-model="unsetList" group="itxst" animation="300" @end="end" style="min-height:100px">
                <el-button :icon="item.icon" v-for="(item,index) in unsetList" class="btnDragger" :title="item.name" :key="index">{{item.name}}</el-button>
              </draggable>
              <div style="margin:20px 0;font-size: 15px;font-weight:bold;">{{$t('mobileDev.functionDesignStepFive.titleShown')}}</div>
              <el-button :icon="item.icon" v-for="(item,index) in MDAllStepData.stepFive.list" class="btnDragger" :key="index" 
			  :style="{display:item.select?'block':'none'}" :title="item.name">{{item.name}}</el-button>
            </el-aside>
            <el-container class="ibox-content">
            <el-main>
              <div style="height:100%;position:relative" ref="designMain">
                <centerContainer :unsetList="unsetList" :isDialog='viewBoxVisible'></centerContainer>  
                <div class="viewCodeBtn" @click="previewFun">{{$t('mobileDev.functionDesignStepFive.Preview')}}</div>
              </div>
            </el-main>
            </el-container>
            <el-aside class="rightSide" width="320px">
              <rightSide v-if="MLListCurItem.listStyle!='undefined'&&JSON.stringify(MLListCurItem)!='{}'"></rightSide>
            </el-aside>
        </el-container>
    </el-container>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.functionDesignStepFive.Preview')" :append-to-body="true" :visible.sync="viewBoxVisible" width="80%" fullscreen>
      <centerContainer :unsetList="unsetList" :isDialog='viewBoxVisible'></centerContainer>
    </el-dialog>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import rightSide from './listRightSide.vue';
import centerContainer from './listCenterContainer';
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
      ...mapGetters(['MDAllStepData','MFActiveData','MLListCurItem'])
    },
    data () {
        return {
            unsetList:[],
            viewBoxVisible:false
        }
    },
    methods: {
        end(e){
          let obj=[...this.unsetList][e.newDraggableIndex];
          this.unsetList.splice(e.newDraggableIndex,1)
          let temp=this.MDAllStepData.stepFive.list.find(it=>it.id==obj.id)
          if(temp){
            this.MDAllStepData.stepFive.list.forEach(it=>{
              if(it.id==obj.id){
                it.select=true;
                store.commit('setListCurItem', it);
              }
            });
          }else{
            obj.select=true;
            this.MDAllStepData.stepFive.list.push(obj)
            store.commit('setListCurItem', obj);
          } 
        },
        previewFun(){
          this.viewBoxVisible=true;
        }
    },
    mounted() {
      let temparr=deepClone(this.MDAllStepData.stepThree)
      if(this.MDAllStepData?.stepFive?.list?.length>0){
        for(let i=0;i<temparr.length;i++){
          let el=temparr[i];
          let idex=this.MDAllStepData.stepFive.list.findIndex(it=>it.id==el.id)
          if(idex>=0){
            el.select=true;
            //如果能在form表单中找到id相同的元素重新赋值，剩下的就push到未显示列表中
            Object.assign(this.MDAllStepData.stepFive.list[idex],el) 
            if(!el.listStyle){
              el.listStyle={
                "showName":"1",
                "fontStyle":'normal 12px/50px arial',
                "fontSize":12,
                "fontColor":'#999',
                "lineHeight":50,
                "fontStyle1":'normal 12px/30px arial',
                "fontSize1":12,
                "fontColor1":'#999',
                "textAlign":'left',
                "addTag":"0",
                "tagColor":'#f59a23'
              }
            }
            
          }else{                   
            if(el.type!='title'&&el.type!='table'){
              el.select=false;
              this.unsetList.push(el)
            }
          }
        }
      }else{    
        for(let i=0;i<temparr.length;i++){
          let el=temparr[i];
          if(el.type!='title'&&el.type!='table'){
            el.select=true;
            if(!el.listStyle){
              el.listStyle={
                "showName":"1",
                "fontStyle":'normal 12px/50px arial',
                "fontSize":12,
                "fontColor":'#999',
                "lineHeight":50,
                "fontStyle1":'normal 12px/30px arial',
                "fontSize1":12,
                "fontColor1":'#999',
                "textAlign":'left',
                "addTag":"0",
                "tagColor":'#f59a23'
              }
            }
            this.MDAllStepData.stepFive.list.push(el)   
          }
        } 
      }
      if(this.MDAllStepData.stepFive.list.length>0) store.commit('setListCurItem', this.MDAllStepData.stepFive.list[0]);  

    }
    
}
</script>
<style scoped>
.groupTit{
    font-size: 15px;font-weight:bold;width: 200px;
	overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    padding: 0 10px;
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
    overflow: auto;
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
  .topMain {
    height: 100%;
  }
  .btnDragger{
     width: 165px;
     border: 1px solid #e7eaec;
     margin: 10px auto 0;
	 overflow: hidden;
	     white-space: nowrap;
	     text-overflow: ellipsis;
  }
  .btnbox .el-button+.el-button {
    margin-left: 0;
  }
  ::v-deep .el-button [class*=fa]+span {
      margin-left: 5px;
  }
  .ibox-content{
    padding-top:10px ;
  }
  .btnbox{
    float: left;
  }
  .btnbox button{
    margin-right: 10px;
  }
  .viewCodeBtn{
    position:absolute;
    bottom:0;
    background:#409EFF;
    line-height:32px;
    text-align:center;
    width: 100%;
    color: #fff;
    left: 0;
    right: 0;
    font-size:15px;
    z-index: 99;
  }
</style>