<template>
<div style="height:100%;">
    <draggable v-model="MDAllStepData.stepThree" @end="end" group="itxst" animation="300" draggable=".FKmoveNode" style="height:100%"> 
        <!-- <el-form label-width="80px" :rules="rules">
            <el-form-item :label="item.name" v-for="(item,index) in MFFormList" :key="index" @click="changeCurCompent(item)">
                <div v-if="item.type=='title'" style="font-size: 16px;font-weight: bold;color: #666;line-height: 28px;text-align: center;padding: 10px;">{{item.name}}</div>
                <el-input :placeholder="item.name" v-if="item.type=='input'"></el-input>
                <el-input type="textarea" v-if="item.type=='textarea'"></el-input>
                <el-radio-group v-if="item.type=='radio'">
                    <el-radio label="未开始"></el-radio>
                    <el-radio label="开始"></el-radio>
                </el-radio-group>
                <el-checkbox-group v-if="item.type=='checkbox'">
                    <el-checkbox label="国内新闻"></el-checkbox>
                    <el-checkbox label="社会新闻"></el-checkbox>
                    <el-checkbox label="国际新闻"></el-checkbox>
                    <el-checkbox label="娱乐新闻"></el-checkbox>
                </el-checkbox-group>
                <el-select placeholder="请选择" v-if="item.type=='select'" style="width:100%">
                    <el-option label="数据1" value="1"></el-option>
                </el-select>
                <el-date-picker type="date" placeholder="选择日期" v-if="item.type=='date'"></el-date-picker>
                <div class="rightBox" v-if="item.type=='file'">
                    <div class="selectBoxCon">点击选择</div>
                    <i class="fa fa-angle-right"></i>
                </div>
                <div class="picAddBox" v-if="item.type=='image'"> 
                    <i class="fa fa-plus"></i>
                </div>
                <el-input placeholder="当前公司" v-if="item.type=='info'"></el-input>
                <avue-crud ref="multipleTable" :data="item.tableColumn" :option="item.option" stripe v-if="item.type=='table'"></avue-crud>
                <tinymce v-if="item.type=='edit'"></tinymce>
                <div class="tipDelObj">
                    <span :class="index%2 == 0?'tooltipLeft':'tooltipRight'">{{item.tips}}</span>
                    <span :class="index%2 == 0?'tooltipLeft deleteBtnL':'tooltipRight deleteBtnR'" @click="MFActiveData.type==item.type?deleteCompent(index):''"><i class="fa fa-trash"></i></span>
                </div>
            </el-form-item>
        </el-form> -->
        <div v-for="(item,index) in MDAllStepData.stepThree" :key="index" 
		:class="['FKmoveNode',MFActiveData.id==item.id?'FKmakeIng':'']" 
		:style="item.type=='table'?'margin:10px;border-radius:5px':''"
		@click="changeCurCompent(item)">
            <div v-if="item.type=='title'" style="font-size: 16px;font-weight: bold;color: #02071a;line-height: 28px;text-align: center;padding:8px 10px; background-color: #f5f6fa; border-bottom: none;">{{item.name}}</div>
            <div class="pub-border" v-if="item.type=='input'&&item.isHide==0">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <input type="text" name="text" :value="item.dbdefault" class="pub-input" :placeholder="item.placeholder" readonly="readonly">
                </div>
				<div class="clear"></div>
            </div>
			
            <div class="pub-border" v-if="item.type=='textarea'">
				<div class="h10"></div>
                <div class="control-label w100"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="textarea_box"> 
                    <textarea class="form-control" :value="item.dbdefault" :placeholder="item.placeholder" :style="{resize:'none',height:item.height+'px'}" readonly="readonly"></textarea>
                </div>
				<div class="h10"></div>
            </div>
            <div class="pub-border" v-if="item.type=='radio'">
                <div class="control-label w100"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="radio-inline selectGroup">
                    <div :class="['radioli', it.value==item.dbdefault.value?'selected':'']" v-for="(it,idx) in item.newOption" :key="idx">{{it.label}}</div>
                </div>
            </div>
            <div class="pub-border" v-if="item.type=='checkbox'">
                <div class="control-label w100"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="checkbox-inline selectGroup">
                    
                    <div :class="['radioli', item.dbdefault.find(o=>o==it.value)?'selected':'']" v-for="(it,idx) in item.newOption" :key="idx">
                        <span value="it.value">{{it.label}}</span>
                        <div v-if="item.dbdefault.find(o=>o==it.value)"><i class="fa fa-check"></i></div>
                    </div>
                </div>
            </div>
			
            <div class="pub-border" v-if="item.type=='select'">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <div class="selectBoxCon">{{item.dbdefault.label||item.placeholder}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
				<div class="clear"></div>
            </div>
			
            <div class="pub-border" v-if="item.type=='date'">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <div class="selectBoxCon">{{item.showValue||item.placeholder}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
				<div class="clear"></div>
            </div>
			
			
            <div class="pub-border" v-if="item.type=='daterange'">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <div class="selectBoxCon">{{item.dbdefault&&item.dbdefault.length>0?((item.dateformat==0?mydayFormat(new Date(item.dbdefault[0])):mydateFormat(new Date(item.dbdefault[0])))+'至'+(item.dateformat==0?mydayFormat(new Date(item.dbdefault[1])):mydateFormat(new Date(item.dbdefault[1])))):item.placeholder}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
				<div class="clear"></div>
            </div>
			
			
            <div class="pub-border" v-if="item.type=='time'">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <div class="selectBoxCon">{{item.dbdefault||item.placeholder}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
				<div class="clear"></div>
            </div>
			
			
            <div class="pub-border" v-if="item.type=='file'">
                <div class="control-label"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="rightBox">
                    <div class="selectBoxCon">{{item.placeholder}}</div>
                    <i class="fa fa-angle-right"></i>
                </div>
				<div class="clear"></div>
            </div>
            <div class="pub-border" v-if="item.type=='image'">
				<div class="h10"></div>
                <div class="control-label w100"><font v-if="item.verify">*</font> <span>{{item.name}}</span></div>
                <div class="picAddBox"> 
                    <i class="fa fa-plus"></i>
                </div>
				<div class="h10"></div>
            </div>
			
            <div class="pub-border" v-if="item.type=='info'">
                <div class="control-label"><span>{{item.name}}</span></div>
                <div class="rightBox">
                    <input type="text" class="pub-input fkinfobox" :value="item.info" readonly="readonly">
                </div>
            </div>
			
            <div class="pub-border" v-if="item.type=='table'">
                <div class="control-label w100"><span>{{item.name}}</span></div>
                <div class="bootstrap_tablenodebyfk" v-if="item.option.column.length>0">
                    <!-- <avue-crud ref="multipleTable" :data="item.tableColumn" :option="item.option" stripe></avue-crud> -->
                    <div style="display:flex;justify-content: flex-end;padding-right: 15px;"><el-link icon="el-icon-delete" type='danger' style="line-height:24px;">{{$t('mobileDev.formCenterContainer.deleteLine')}}</el-link></div>
                    <div v-for="(it,index) in item.option.column" :key="index">
                        <div class="pub-border borderB" v-if="it.type.value=='input'">
                            <div class="control-label" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="rightBox">
                                <input type="text" name="text" :value="it.dbdefault" :style="{textAlign:it.conAlign}"
								class="pub-input" :placeholder="'请填写'+it.label" readonly="readonly">
                            </div>
                        </div>
						<div class="pub-border borderB" v-if="it.type.value=='textarea'">
							<div class="h10"></div>
						    <div class="control-label w100" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
						    <div class="textarea_box"> 
						        <textarea class="form-control" :value="it.dbdefault" :placeholder="'请填写'+it.label" :style="{resize:'none',height:'60px'}" readonly="readonly"></textarea>
						    </div>
							<div class="h10"></div>
						</div>
                        <div class="pub-border borderB" v-if="it.type.value=='date'||it.type.value=='time'||it.type.value=='daterange'">
                            <div class="control-label" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="rightBox">
                                <input type="text" name="text" :value="it.dbdefault" :style="{textAlign:it.conAlign}" class="pub-input" :placeholder="$t('mobileDev.formCenterContainer.placeholderTime')" readonly="readonly">
                            </div>
                        </div>
                        <div class="pub-border borderB" v-if="it.type.value=='select'">
                            <div class="control-label" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="rightBox">
                                <input type="text" name="text" :value="it.dbdefault" :style="{textAlign:it.conAlign}" class="pub-input" :placeholder="$t('mobileDev.formCenterContainer.placeholderSelect')" readonly="readonly">
                            </div>
                        </div>
                        <div class="pub-border borderB" v-if="it.type.value=='file'">
                            <div class="control-label" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="rightBox">
                                <input type="text" name="text" :value="it.dbdefault" :style="{textAlign:it.conAlign}" class="pub-input" :placeholder="$t('mobileDev.formCenterContainer.boxUpload')" readonly="readonly">
                            </div>
                        </div>
						<div class="pub-border borderB" v-if="it.type.value=='image'">
							<div class="h10"></div>
						    <div class="control-label w100" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
						    <div class="picAddBox"> 
						        <i class="fa fa-plus"></i>
						    </div>
							<div class="h10"></div>
						</div>
                        <div class="pub-border borderB" v-if="it.type.value=='radio'">
                            <div class="control-label w100" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="radio-inline selectGroup">
                                <div :class="['radioli', itc.value==it.dbdefault?'selected':'']" 
								style="width: 100px;"
								v-for="(itc,idx) in it.newOption" :key="idx">{{itc.label}}</div>
                            </div>
                        </div>
                        <div class="pub-border borderB" v-if="it.type.value=='checkbox'">
                            <div class="control-label w100" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span>{{it.label}}</span></div>
                            <div class="checkbox-inline selectGroup">
                                <div :class="['radioli', it.dbdefault.find(o=>o==itc.value)?'selected':'']" 
								style="width: 99px;"
								v-for="(itc,idx) in it.newOption" :key="idx">
                                    <span>{{itc.label}}</span>
                                    <div v-if="it.dbdefault.find(o=>o==itc.value)"><i class="fa fa-check"></i></div>
                                </div>
                            </div>
                        </div>
						<div class="pub-border borderB" v-if="it.type.value=='edit'">
							<div class="h10"></div>
						    <div class="control-label w100" :style="{textAlign:it.labelAlign}"><font v-if="it.verify">*</font> <span style="padding-bottom: 8px;">{{it.label}}</span></div>
						    <tinymce height="400" v-model="it.dbdefault"></tinymce>
							<div class="h10"></div>
						</div>
                    </div>
                </div>
                <div>
                    <el-link icon="el-icon-plus" type='primary' :underline="false" class="addLine" @click="addFormChil(item.option.column.length)">{{$t('mobileDev.formCenterContainer.addLine')}}</el-link>
                </div>
            </div>
            
			<div class="pub-border" v-if="item.type=='edit'">
				<div class="h10"></div>
                <div class="control-label w100"><font v-if="item.verify">*</font> <span style="padding-bottom: 8px;">{{item.name}}</span></div>
                <tinymce :height="item.height" v-model="item.dbdefault"></tinymce>
				<div class="h10"></div>
            </div>
            <div class="tipDelObj">
                <span :class="index%2 == 0?'tooltipLeft':'tooltipRight'">{{item.tips}}</span>
                <span :class="index%2 == 0?'tooltipLeft deleteBtnL':'tooltipRight deleteBtnR'" @click.stop="MFActiveData.id==item.id?deleteCompent(index):''"><i class="fa fa-trash"></i></span>
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
      draggable,
      deepClone
    },
  data () {
    return {
       rules:{},
       //tempList:[]
    }
  },
  computed: {
    ...mapGetters(['MDAllStepData','MFActiveData'])
  },
   methods: {
    deleteCompent(index){
       // this.formList.splice(index,1);
        //store.commit('setFormList', this.tempList[0]);    
        this.MDAllStepData.stepThree.splice(index,1);
        if(this.MDAllStepData.stepThree.length>0){
            store.commit('setActiveData', this.MDAllStepData.stepThree[0]);    
        }else{     
            store.commit('setActiveData', {});    
        }
        
    },
    changeCurCompent(item){
        store.commit('setActiveData', item);
    },
    end(e){       
        if(e.newIndex==e.oldIndex){
            var w = (window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth)-300;
            //相等表示删除，否则是排序
            if(e.originalEvent.x>w||e.originalEvent.x<150) this.deleteCompent(e.newIndex)
        }
        
    },
    addFormChil(len){
        if(len<=0){
            this.$message({
                message:this.$t('mobileDev.formCenterContainer.hintSetField'),
                type: 'error'
            });
        }else{
			
		}
    }
   }
}
</script>
<style scoped>
/* .el-date-editor.el-input {
	width: 100%;
} */
*{
    box-sizing: border-box;
    line-height: normal;
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
.pub-border{
    width: 100%;
	box-sizing: border-box;
	position: relative;
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
.rightBox{
	display: inline-block;
	width: calc(100% - 80px);
	line-height: 50px;
	vertical-align: middle;
}
.control-label{
    line-height: 50px;
    font-size: 14px;
    color: #02071a;
	padding-left: 15px;
	display: inline-block;
	width: 60px;	
	vertical-align: middle;
}
.control-label.w100{
	display: block;
	width: 100%;
	padding-right: 15px;
}
.control-label span{
	word-break: break-all;
    display: inline-block;
}
.control-label font{
	color:#FF3B30;
	font-weight: bold;
	padding-right: 4px;
	vertical-align: middle;
	position: absolute;
	left: 5px;
	top: 19px;
	z-index: 0;
}
.borderB{
	border-bottom: 1px solid #f0f1f5;
}
.pub-input{
    border: 0;
    width: 100%;
	height: 100%;
	color: #02071a;
	font-size: 14px;
	text-indent: 10px;
}
.form-control{
    display:block;
    width:calc(100% - 30px);
	margin: 0 auto 10px auto;
    padding:8px 10px;
    font-size:14px;
    line-height:1.42857143;
    color:#02071a;    
    border:1.8px solid #f0f1f5;
	background-color: #f5f6fa;
	box-shadow: none;
}
.checkbox-inline, .radio-inline {
    padding-left: 15px;
    padding-top: 7px;
    display: inline-block;
}
.radio-inline .radioli,.checkbox-inline .radioli{
	color: #666;
    font-weight: normal;
    width: 105px;
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
.selectBoxCon{
   display: inline-block;
    line-height: 50px;
	text-indent: 2rem;
	font-size: 14px;
    color: #aeb2be;}
.rightBox i{
	font-size: 20px;
    color: #bcc0cc;
	position: absolute;
	right: 15px;
	line-height: 50px;
}
.picAddBox{
	border: 1px solid #ebecf0;
	border-radius: 8px;
    width: 80px;
    text-align: center;
    line-height: 80px;
    margin: 0px 0 10px 10px;
    font-size: 28px;
    color: #bcc0cc;}
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

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #aeb2be;
}
</style>