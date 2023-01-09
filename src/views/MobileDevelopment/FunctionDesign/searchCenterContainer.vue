<template>
<div>
    <draggable v-model="MDAllStepData.stepFour" @end="end" group="itxst" animation="300" style="height:100%"> 
        <div v-for="(item,index) in MDAllStepData.stepFour" :key="index" :class="['FKmoveNode',MSActiveData.id==item.id?'FKmakeIng':'']" @click="changeCurCompent(item)">
           
			<div class="pub-box" v-if="item.type=='input'||item.type=='textarea'||item.type=='edit'||item.type=='file'||item.type=='time'||item.type=='daterange'">
                <div class="control-label">{{item.name}}</div>
                <div class="filterBox">
                    <el-input :placeholder="$t('deletePrompt.hinrEnterSpace') +item.name"></el-input>
                </div>
				<div class="clear"></div>
            </div>
			
            <div class="pub-box" v-if="item.type=='radio'">
                <div class="control-label w100">{{item.name}}</div>
                <div class="radio-inline selectGroup">
                    <div class="radioli" v-for="(it,idx) in item.newOption" :key="idx">{{it.label}}</div>
                </div>
            </div>
            <div class="pub-box" v-if="item.type=='checkbox'">
                <div class="control-label w100">{{item.name}}</div>
                <div class="checkbox-inline selectGroup">
                    <div class="radioli" v-for="(it,idx) in item.newOption" :key="idx">
                        <span>{{it.label}}</span>
                        <div style="display: none;"><i class="fa fa-check"></i></div>
                    </div>
                </div>
            </div>
			
            <div class="pub-box" v-if="item.type=='select'">
                <div class="control-label">{{item.name}}</div>
                <div class="filterBox">
                    <el-select value="" :placeholder="item.placeholder">
                        <el-option :label="it.label" :value="it.value" v-for="(it,idx) in item.newOption" :key="idx"></el-option>
                    </el-select>
                </div>
				<div class="clear"></div>
            </div>
            <div class="pub-box" v-if="item.type=='date'||item.type=='xjrTimeSearch'">
                <div class="control-label">{{item.name}}</div>
                <div class="filterBox">
                    <el-input :placeholder="item.placeholder"></el-input>
                </div>
				<div class="clear"></div>
            </div>          
            <div class="pub-box" v-if="item.type=='info'">
                <div class="control-label">{{item.name}}</div>
                <div class="filterBox">
                    <el-input :placeholder="$t('mobileDev.searchRightSide.placeholderCompany')" value=""></el-input>
                </div>
            </div>
            <div class="tipDelObj">
                <span :class="index%2 == 0?'tooltipLeft':'tooltipRight'">{{item.tips}}</span>
                <span :class="index%2 == 0?'tooltipLeft deleteBtnL':'tooltipRight deleteBtnR'" @click.stop="MSActiveData.id==item.id?deleteCompent(index):''"><i class="fa fa-trash"></i></span>
            </div>
        </div>
    </draggable>
</div>
</template>
<script>
import draggable from 'vuedraggable';
import store from '@/store/index';
import {mapGetters} from "vuex"
export default {
   // props:['searchList'],
   components: {
      draggable
    },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['MDAllStepData','MSActiveData'])
  },
   methods: {
    deleteCompent(index){
        this.MDAllStepData.stepFour.splice(index,1);
        if(this.MDAllStepData.stepFour.length>0){
            store.commit('setSearchCurData', this.MDAllStepData.stepFour[0]);    
        }else{     
            store.commit('setSearchCurData', {});    
        }
        
    },
    changeCurCompent(item){
        store.commit('setSearchCurData', item);
    },
    end(e){
        if(e.newIndex==e.oldIndex){
            var w = (window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth)-300;
            //相等表示删除，否则是排序
            if(e.originalEvent.x>w||e.originalEvent.x<150) this.deleteCompent(e.newIndex)
        }
    }
   }
}
</script>
<style scoped>
*{
    box-sizing: border-box;
    line-height:normal;
}
.FKmoveNode{
    position: relative;
    cursor: move;
	background-color: #fff;
	box-sizing: border-box;
	border-bottom: 1px solid #f0f1f5;
}
.FKmakeIng{
     border: 1px dashed #409EFF;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
.clear{
	clear: both;
}
.h10{
	background-color: #f5f6fa;
	height: 10px;
	width: 100%;
}
.pub-box{
	position: relative;
}
.control-label{
    line-height: 20px;
    font-size: 14px;
    color: #02071a;
	padding-left: 15px;
	word-break: break-all;
	max-width: 114px;
	display: inline-block;
	vertical-align: middle;
}
.control-label.w100{max-width: 90%;padding-top: 10px;line-height: 50px;width: 100%;}
.filterBox{
	display: inline-block;
	vertical-align: middle;
}
.el-input__prefix{
	top:0px;
}
.el-input{
	font-size: 14px;
}
/deep/ .el-select,/deep/ .el-input{
 position: static;
}
.checkbox-inline, .radio-inline {
    padding-left: 20px;
    padding-top: 7px;
    display: inline-block;
}
.radio-inline .radioli,.checkbox-inline .radioli{
	color: #666;
    font-weight: normal;
    width: 104px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 30px;height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;    margin-right: 10px;
    margin-bottom: 10px;
    float: left;font-size:12px;
}
.radio-inline .selected,.checkbox-inline .selected{
	border: 1px solid #02A7F0;
	color:#02A7F0
}
.checkbox-inline .selected{
	position:relative
}
.checkbox-inline .selected div{
	position:absolute;
	bottom:0;
	right:0;
	width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid #02A7F0;
    border-bottom: 10px solid #02A7F0;
    border-left: 10px solid transparent;}
.checkbox-inline .selected div i{
	position: absolute;
    bottom: -9px;
    right: -11px;
    z-index: 10;
    font-size: 12px;color:#fff;
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
.el-date-editor--daterange.el-input__inner{
    width: 100%;
}
/deep/ .el-input__inner{
	height: 50px;
	line-height: 50px;
	border-color: transparent;
	background-color: transparent;
	font-size: 14px;
}
.el-range-editor.is-active, .el-range-editor.is-active:hover,/deep/ .el-select .el-input.is-focus .el-input__inner,/deep/ .el-select .el-input__inner:focus,/deep/ .el-input__inner:hover{
	border-color: transparent;
}
/deep/.el-range-separator,/deep/ .el-range-input{
	font-size: 14px;
}
/deep/ .el-date-editor .el-range__icon{
	margin-left: 0px;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #aeb2be;
}
</style>