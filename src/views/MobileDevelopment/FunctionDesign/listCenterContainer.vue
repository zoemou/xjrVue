<template>
<div class="mainbox" :style="{height:isDialog?'800px':'100%'}">   
    <div style="height:100%;position:relative" ref="designMain">
    <div class="fixedBox" :style="{top:'0',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
        <div style="border: 1px solid #eee;">
            <el-row class="phone-bar">
                <el-col :span="8" style="text-align:left;"><div><i class="fa fa-signal"></i> <i class="fa fa-wifi"></i></div></el-col>
                <el-col :span="8"><div style="text-align:center;"><span>9:41 AM</span></div></el-col>
                <el-col :span="8" style="text-align:right;"><div><span>100%</span> <i class="fa fa-battery-full"></i></div></el-col>
            </el-row>
            <el-row class="navCrumbs">
                <el-col :span="24" style="text-align:left;border-bottom:1px solid #ccc"><i class="fa fa-angle-left" style="font-weight: bold;font-size: 16px;padding-left:10px;"></i>{{$t('mobileDev.functionDesignStepFour.mobileListTitle')}}</el-col>
                <el-col :span="24" style="display:flex;justify-content: space-around;border-bottom: 1px solid #F2F2F2;line-height:40px">
                <div>{{$t('mobileDev.functionDesignStepFour.Sort')}}<i class="fa fa-sort-amount-desc"></i></div>
                <div style="color:#02A7F0">{{$t('mobileDev.functionDesignStepFour.Sifting')}} <i class="fa fa-filter"></i></div>
                </el-col>
            </el-row>
        </div>
    </div>
    
    <div id="FKworkArea" :style="{top:'100px',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px',height:boxHeight+'px'}">
        <div id="FKActionTable" ref="FKActionTable" :style="{minHeight:boxHeight+'px',marginRight:designHeight>boxHeight?'-6px':'0'}">
            <div style="padding-top: 10px;">
                <el-card class="box-card" shadow="never" :style="{minHeight:isDialog?'auto':'300px'}">
                <draggable v-model="MDAllStepData.stepFive.list" @end="end" animation="300" :sort="isDialog?false:true" draggable=".FKmoveNode" style="height:100%;"> 
                    <div v-for="(item,index) in MDAllStepData.stepFive.list" :key="index" :style="{display:item.select?'block':'none'}" :class="['text item FKmoveNode',MLListCurItem.id==item.id?'FKmakeIng':'']" @click="changeCurCompent(item)">
                        <span :style="{fontStyle:item.listStyle.fontStyle.split(' ')[0],
						fontWeight:item.listStyle.fontStyle.split(' ')[1]!='bold'?'normal':item.listStyle.fontStyle.split(' ')[1],
						fontSize:item.listStyle.fontSize+'px !important',
                        color:item.listStyle.fontColor,width:'60px',
						display: 'inline-block',verticalAlign: 'middle',lineHeight:item.listStyle.lineHeight+'px',}" v-if="item.listStyle.showName==1"> {{item.name}}</span>
						<font style="display: inline-block;vertical-align: middle;">：</font>
                        <div :style="{textAlign:item.listStyle.textAlign,
						display: 'inline-block',verticalAlign: 'middle',width: 'calc(100% - 83px)'}">
                        <el-tag :style="[{
                        fontStyle:item.listStyle.fontStyle1.split(' ')[0],
						fontWeight:item.listStyle.fontStyle1.split(' ')[1]!='bold'?'normal':item.listStyle.fontStyle1.split(' ')[1],color:item.listStyle.fontColor1,
                        fontSize:item.listStyle.fontSize1+'px !important',lineHeight:item.listStyle.lineHeight+'px',},
                        item.listStyle.addTag==1&&item.dbdefault?{backgroundColor:item.listStyle.tagColor,padding:'0 10px'}:{backgroundColor:'transparent'}]">{{transformArray(item,item.dbdefault,item.newOption)}}</el-tag>
                        
                        </div>
                        <div class="tipDelObj" v-if="!isDialog">
                            <span :class="index%2 == 0?'tooltipLeft':'tooltipRight'">{{$t(item.tips)}}</span>
                            <span :class="index%2 == 0?'tooltipLeft deleteBtnL':'tooltipRight deleteBtnR'" @click.stop="MLListCurItem.id==item.id?deleteCompent(index,item):''"><i class="fa fa-trash"></i></span>
                        </div>
                    </div>
                    <div class="designbtnBox" v-if="MDAllStepData.stepFive.list.length>0">
                        <el-button type="text" icon="el-icon-edit" v-if="MDAllStepData.stepFive.btn[1].select">{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button type="text" icon="el-icon-delete" v-if="MDAllStepData.stepFive.btn[2].select">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        <el-button type="text">{{$t('tableOperationModule.viewBtn')}}<i class="el-icon-arrow-right"></i></el-button>
                    </div>                   
                </draggable>
                </el-card>
            </div>       
        </div>
    </div>    
    <div class="fixedBox" :style="{top:boxHeight+'px',paddingLeft:paddingLR+'px',paddingRight:paddingLR+'px'}">
        <el-button type="primary" circle icon="el-icon-plus" class="addBtn" :style="{right:paddingLR+10+'px'}" v-if="MDAllStepData.stepFive.btn[0].select"></el-button> 
    </div>
</div>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import {deepClone} from '@/utils/index';
import store from '@/store/index';
import {mapGetters} from "vuex"
export default {
    props:['unsetList','isDialog'],
   components: {
      draggable,
      deepClone
    },
  data () {
    return {
        boxWidth:0,
            boxHeight:0,
            paddingLR:0,
    }
  },
  computed: {
    ...mapGetters(['MDAllStepData','MLListCurItem'])
  },
  watch:{
     unsetList:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
          this.$nextTick(function(){
            this.designHeight=this.$refs.FKActionTable.clientHeight
          })            
         },
         deep:true //true 深度监听
     }
   },
   methods: {
    deleteCompent(index,item){
        this.MDAllStepData.stepFive.list[index].select=false;
        this.MDAllStepData.stepFive.list.splice(index,1,this.MDAllStepData.stepFive.list[index]);
        this.unsetList.push(this.MDAllStepData.stepFive.list[index])
        if(this.MDAllStepData.stepFive.list.length>0){
            store.commit('setListCurItem', this.MDAllStepData.stepFive.list[0]);
        }else{
            store.commit('setListCurItem', {});
        } 
    },
    changeCurCompent(item){
        store.commit('setListCurItem', item);
    },
    end(e){
        if(!this.isDialog){
            if(e.newIndex==e.oldIndex){
                var w = (window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth)-300;
                //相等表示删除，否则是排序
                if(e.originalEvent.x>w||e.originalEvent.x<150){
                    this.MDAllStepData.stepFive.list[e.newDraggableIndex].select=false;
                    for(let i=0;i<this.MDAllStepData.stepFive.list.length;i++){
                        if(this.MDAllStepData.stepFive.list[i].select){
                            store.commit('setListCurItem', this.MDAllStepData.stepFive.list[i]);
                            break;
                        }
                    }
                    
                    this.MDAllStepData.stepFive.list.splice(e.newDraggableIndex,1,this.MDAllStepData.stepFive.list[e.newDraggableIndex]);
                    this.unsetList.push(this.MDAllStepData.stepFive.list[e.newDraggableIndex])
                }
                
            }
        }
    },
    transformArray(obj,arr,dbArr){
        let type=obj.type;
        let format=obj.dateformat;
        if(type=='checkbox'){
            let temp=""
            let tr=dbArr.filter(it => arr.indexOf(it.value)>=0);
            tr.forEach((el,i) => {
                temp+=i==tr.length-1?el.label:(el.label+',')
            });               
            return temp;
        }else if(type=='date'){
            return obj.showValue;
        }else if(type=='select'||type=='radio'){
            return arr.label;
        }else if(type=='daterange'){
            return arr&&arr.length>0?((format==0?this.mydayFormat(new Date(arr[0])):this.mydateFormat(new Date(arr[0])))+'至'+(format==0?this.mydayFormat(new Date(arr[1])):this.mydateFormat(new Date(arr[1])))):''
        }else{
            return arr
        }
    },
	calcuSize(){
	  this.boxWidth=375;
	  this.boxHeight=this.$refs.designMain.clientHeight-133;
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
  #FKActionTable{background: #f5f6fa;margin-right: -6px;}
  .mainbox{
      color: #333;
    overflow: visible;
    position: relative;
  }
  .el-col{
    margin-bottom: 0;
  }
  .addBtn{
    position: absolute;
  }

.FKmoveNode{
    position: relative;
    cursor: move;
    border-bottom: 1px dashed #E4E4E4;
    margin: 0;
    padding: 0 5px;
}
.FKmoveNode::after{
    clear: both;
    content: '';
}
.FKmakeIng{
    border: 1px dashed #409EFF;
}
.designbtnBox{
    line-height: 50px;
    text-align: right;
}
.el-button--text{
 color: #ccc;
    font-size: 12px;
    padding: 0 0 0 15px;
}
 .el-card{
    margin: 0 10px;
    border-radius: 5px;
    overflow: visible;
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
    right: 125%;
	border:1px solid #ccc;
	font-size: 12px;
    line-height: 1.42857143;
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
    left: 125%;
	border:1px solid #ccc;
	font-size: 12px;
    line-height: 1.42857143;
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
.el-tag{
    border:0;
    padding: 0;
    white-space: pre-wrap;
    height: auto;
	vertical-align: middle;
  }
</style>