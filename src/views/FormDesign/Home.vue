<template>
  <div class="container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar components-scrollbar">
        <!--左侧组件栏-->
        <div class="components-list">
          <!--标题-->
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <span>
                 <svg-icon icon-class="component"/>
                  <span>{{ item.title }}</span>
              </span>
              <span class="icon-box" @click="changeItemVisible(listIndex)" >
                <i :class="item.visible?'top-icon':'bottom-icon'"></i>
              </span>
            </div>
            <draggable  
                v-if="item.visible"
                class="components-draggable"
                :list="item.list"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                handle=".mover"
                @end="onEnd" 
            >
              <!--生成拖拽项-->
              <div
                  v-for="(element, index) in item.list"
                  :key="index"
                  :class="!element.mover ? 'components-item mover':'components-item'"
                  @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon v-if="element.__config__.tagIcon" :icon-class="element.__config__.tagIcon"/>
                  <i v-else-if="element.__config__.tagElIcon" :class="element.__config__.tagElIcon"></i>
                  <span class="title">{{ element.__config__.label }}</span>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-video-play" type="text" @click="run">
          {{$t('code.leftScrollbar.runBtn')}}
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          {{$t('code.leftScrollbar.seeBtn')}}
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          {{$t('code.leftScrollbar.exportBtn')}}
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          {{$t('code.leftScrollbar.copyCodeBtn')}}
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          {{$t('code.leftScrollbar.emptyBtn')}}
        </el-button>
      </div>
      <!--中间展示部分-->
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
                class="drawing-board"
                :list="drawingList"
                :animation="250"
                ghost-class="ghost"
                group="componentsGroup"
                sort="false"
                :move="onMove"
                 @end="onMoveEnd"
            >
              <draggable-item
                  v-for="(item, index) in drawingList"
                  :key="item.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index" 
                  :active-id="activeId"
                  :form-conf="formConf"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-box">
              <div class="img-box"><img :src="emptyImg"/></div>
              <!-- {{$t('code.leftScrollbar.hint')}} -->
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="!!drawingList.length"
        :parent-node="parentComponent"
        @tag-change="tagChange"
        @addTab="addTab"
        @tabDelete="tabDelete"
        :baseData="baseData"
        :numComponents="numberTypeComponents"
        :allComponents="drawingList"
    />
    <form-drawer
        :visible.sync="drawerVisible"
        :form-data="formData"
        size="100%"
        :generate-conf="generateConf"
    />
    <json-drawer
        size="60%"
        :visible.sync="jsonDrawerVisible"
        :json-str="JSON.stringify(formData)"
        @refresh="refreshJson"
    />
    <code-type-dialog
        :visible.sync="dialogVisible"
        :title="$t('code.leftScrollbar.titleSelectType')"
        :show-file-name="showFileName"
        @confirm="generate"
    />
    <input id="copyNode" type="hidden"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
import render from '@/components/render/render';
import FormDrawer from './FormDrawer';
import JsonDrawer from './JsonDrawer';
import RightPanel from './RightPanel';
import AddRoleMember from '../WorkFlow/AddRoleMember';
import xjrTitle from '@/components/title';
import {changeFormConfigDefaultValue} from '@/components/codeParser/util.js';
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  WorkFlowComponents,
  formConf,
  OrganizationComponents,
  FinanceComponents
} from '@/components/generator/config';
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase,
  deepClone
} from '@/utils/index';
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from '@/components/generator/html';
import { makeUpJs } from '@/components/generator/js';
import { makeUpCss } from '@/components/generator/css';
import drawingDefalut from '@/components/generator/drawingDefalut';
import logo from '@/assets/logo.svg';
import CodeTypeDialog from './CodeTypeDialog';
import DraggableItem from './DraggableItem';
import {
  getDrawingList,
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf,
} from '@/utils/db';
import loadBeautifier from '@/utils/loadBeautifier';
import SvgIcon from '@/components/SvgIcon/index';
import Tinymce from '@/components/tinymce/index.vue';
import store from '@/store';
import {S4} from '@/config/fn'

import Vue from 'vue';

Vue.component('tinymce', Tinymce);
import '@/styles/index.scss';
import '@/icons';

let beautifier;
const emptyActiveData = { style: {}, autosize: {} };
let oldActiveId;
let tempActiveData;
// const drawingListInDB = getDrawingList()
const formConfInDB = getFormConf();

const idGlobal = getIdGlobal();

export default {
  props: ['baseData'],
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem,
    SvgIcon,
    AddRoleMember,
    xjrTitle
  },
  data () {
    return {
      emptyImg: "/img/code-empty.png",
      showOnMoveMessage:"",
      oldFormIds:[],
      activeName: 'first',
      tabChildren: [],
      logo,
      idGlobal: getIdGlobal(),
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      WorkFlowComponents,
      OrganizationComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      roleMemberVisible: false,
      generateConf: { fileName: undefined, type: 'file' },
      // generateConf: null,
      showFileName: false,
      activeData: drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      parentComponent: null,
      leftComponents: [
        {
          title:this.$t('code.leftScrollbar.inputModule'),
          list: inputComponents,
          visible:true
        },
        {
          title:this.$t('code.leftScrollbar.selectModule'),
          list: selectComponents,
          visible:true
        },
        {
          title: this.$t('code.leftScrollbar.layoutModule'),
          list: layoutComponents,
          visible:false
        },
        {
          title:this.$t('code.leftScrollbar.workflow'),
          list: WorkFlowComponents,
          visible:false
        },
        {
          title:this.$t('code.leftScrollbar.organization'),
          list: OrganizationComponents,
          visible:false
        },
        {
          title: this.$t('code.leftScrollbar.financeModule'),
          list: FinanceComponents,
          visible:false
        },
      ],
      numberTypeComponents: []    //保存数字或金额类型组件JSON数据
    };
  },
  computed: {
    ...mapGetters(["website"])
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
          this.activeData.placeholder === undefined ||
          !this.activeData.__config__.tag ||
          oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder =
          this.activeData.placeholder.replace(oldVal, '') + val;
	  this.changeNumComponent(this.activeData)
    },
    'activeData.__config__.defaultValue': function (activeDefaultValue, oldVal) {
      let isNumberType =this.activeData.__config__.avueType =="number" ||this.activeData.type == "number";
      if (isNumberType) {
        if((activeDefaultValue==undefined||activeDefaultValue==null||activeDefaultValue=='')&&activeDefaultValue!==0){
          this.activeData.__config__.defaultValue = activeDefaultValue;
        }else{
           this.activeData.__config__.defaultValue = parseFloat(activeDefaultValue);
        }
        this.drawingList = changeFormConfigDefaultValue(this.drawingList);//计算所有默认值
      }
    },
    activeId: {
      handler (val) {
        oldActiveId = val;
      },
      immediate: true,
    },
    drawingList: {
      handler (val,newVal) {
		this.saveDrawingListDebounce(val);
        this.baseData.step2 = this.drawingList;
        if (val.length === 0) this.idGlobal = 100;
        this.numberTypeComponents = this.getNumberTypeComponents(val);
		
      },
      deep: true,
    },
    idGlobal: {
      handler (val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true,
    },
    positionName: 'root'
  },
  mounted () {
    // if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
    //   this.drawingList = drawingListInDB
    // } else {
    //   this.drawingList = drawingDefalut
    // }
    //如果传入的baseData Step2 有数据 就直接显示Step2的数据
    if (this.baseData.step2.length === 0) this.drawingList = [];
    else this.drawingList = this.baseData.step2;

    this.drawingList.length > 0 && this.activeFormItem(this.drawingList[0]);
    if(this.drawingList.length>0){
      this.oldFormIds = this.getFormIds(this.drawingList);
    }
	
    // if (formConfInDB) {
    //   this.formConf = formConfInDB
    // }h
    loadBeautifier((btf) => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS('#copyNode', {
      text: (trigger) => {
        const codeStr = this.generateCode();
        this.$notify({
          title:this.$t('deletePrompt.successTitle'),
          message:this.$t('code.leftScrollbar.hintCopyCode'),
          type: 'success',
        });
        return codeStr;
      },
    });
    clipboard.on('error', (e) => {
      this.$message.error(this.$t('code.leftScrollbar.hintFieldCopy'));
    });
    this.formConf.hideComponents = this.baseData.hideComponents;
    if(this.baseData.step2,this.baseData.step2.length>0){
      let baseConf = JSON.stringify(this.baseData.stepConf)=='{}'?{
          disabled: false,
          formBtns: true,
          formModel: "formData",
          formRef: "elForm",
          formRules: "rules",
          formSize: "fullscreen",
          gutter: 15,
          labelPosition: "right",
          labelWidth: 100,
          size: "medium",
          span: 24,
        }:this.baseData.stepConf;
      let hideComponents = this.baseData.hideComponents;
      this.formData = {
        fields:this.baseData.step2,
        hideComponents,
        ...baseConf
      };
      this.formConf = this.formData;
    
    } 
  },
  created () {},
  methods: {
	changeNumComponent(obj){ //当前财务组件标题改变修改关联组件的表达式
		let temp=this.numberTypeComponents.find(o=>{return o.__config__.formId==obj.__config__.formId})
		if(temp&&temp.relativeComObject?.length>0){
			temp.relativeComObject.forEach(it=>{
				let cur=this.numberTypeComponents.find(o=>{return o.__config__.formId==it})
				if(cur&&cur.computationalConfiguration?.length>0){
					cur.computationalConfigurationValue="";
					cur.computationalConfiguration.forEach(j=>{
						if(j.formId==obj.__config__.formId){
							j.name=obj.__config__.label
						}
						cur.computationalConfigurationValue+=j.name
					})
				}
			})
		}
	},
    addTab(){
      let column = this.activeData.__config__.option.column || [];
      let _obj = {};
      let index = column.length + 1;

      _obj.label = this.$t('code.rightPanel.tabs') + index;
      _obj.icon = '';
      _obj.prop = 'tab'+index;
      this.activeData.__config__.option.column.push(_obj);
      this.activeData.__config__.childrenObj[_obj.prop] =[] ;
      let drawingIndex =0;
       this.drawingList.forEach((ele,index)=>{
        if(ele&&ele.__config__&&ele.__config__.formId&&ele.__config__.formId==this.activeData.__config__.formId){
          drawingIndex = index;
        }
      });
      this.drawingList[drawingIndex] = this.activeData;
    },
    tabDelete(idx){
       let column = this.activeData.__config__.option.column || [];
      if(column.length <= 1){
        this.$message(this.$t('code.leftScrollbar.hintSaveTab'));
        return;
      }
      let delIndex = idx;
      let oldTempObj = this.activeData.__config__.childrenObj;
      let oldColumn = this.activeData.__config__.option.column;
      let newTempObj = {};
      let newColumn  = [];
      let newOldColumn = oldColumn;
      newOldColumn.splice(delIndex,1);
      newOldColumn.forEach((item,index) => {
        let oldProp = item.prop;
        let oldTemp = oldTempObj[oldProp];
        let newProp = 'tab'+(index+1)
        item.prop = newProp;
        newColumn.push(item);
        newTempObj[newProp] = oldTemp;
      });
      this.activeData.__config__.childrenObj = {};
      this.activeData.__config__.option.column = [];
      let currentTab = newColumn[newColumn.length-1].prop;
      this.activeData.__config__.currentTab = currentTab;
      this.activeData.__config__.children = newTempObj[currentTab];
      this.activeData.__config__.option.column  = newColumn;
      this.activeData.__config__.childrenObj = newTempObj;
      let drawingIndex =0;
       this.drawingList.forEach((ele,index)=>{
        if(ele&&ele.__config__&&ele.__config__.formId&&ele.__config__.formId==this.activeData.__config__.formId){
          drawingIndex = index;
        }
      });
      this.drawingList[drawingIndex] = this.activeData;
    },
    onMove(e,originalEvent){
      let message = "";
      let canMove = true;
      if(e.draggedContext.element&&e.draggedContext.element.__config__){
        let permanentlyNotSupportedTags = ['tinymce','el-slider','el-divider','h2','xjr-opinion-comonent','avue-custom-button'];
        let notSupportedAtTheMomentTags = ['el-upload','el-image','xjr-cascader'];
        let config = e.draggedContext.element.__config__;
        let needCheck = false;
        if(config.componentName){
          message = this.$t('code.leftScrollbar.hintNotSupport');
          needCheck= true;
        }else if(permanentlyNotSupportedTags.includes(config.tag)){
          message =this.$t('code.leftScrollbar.hintNotSupport');
          needCheck= true;
        }else if(notSupportedAtTheMomentTags.includes(config.tag)){
          message =this.$t('code.leftScrollbar.hintNotUse');
          needCheck= true;
        }else if(e.draggedContext.element.autoCode){
          message = this.$t('code.leftScrollbar.hintNotUse');
          needCheck= true;
        }
        if(needCheck){
          if(config.componentName==='avue-tabs'){
            if(e&&e.draggedContext&&e.draggedContext.element&&e.related&&e.related.className){
              if(e.draggedContext.element.__config__.tag=='avue-tabs'&&e.related.className.includes('tabs-item')){
                 this.showOnMoveMessage = this.$t('code.leftScrollbar.hintNotAdd');
                return false;
              }
            }
          }else if(e.to&&e.to.attributes&&e.to.attributes.length>0&&e.to.attributes[0].value){
            let className = e.to.attributes[0].value;
            if(className.includes('table-row-box')){
              this.showOnMoveMessage = message;
              return false;
            }
          }
        }
      }
      return canMove;
    },
    onMoveEnd(obj){
      if(this.showOnMoveMessage){
        this.$message.error(this.showOnMoveMessage);
        this.showOnMoveMessage = "";
      }
    },
    getFormIds(drawingList){
      let tempDrawingList = deepClone(drawingList);
      let formIds = [];
      tempDrawingList.forEach(ele => {
        if (
          ele.__config__.componentName &&
          ele.__config__.componentName == "avue-tabs"
        ) {
          if (ele.__config__ && ele.__config__.childrenObj) {
            let obj = ele.__config__.childrenObj;
            for (var i in obj) {
              if (obj[i].length > 0) {
                obj[i].forEach((ele1, cindex) => {
                  if(ele1.__config__.componentName &&ele1.__config__.componentName == "table"){
                      formIds.push(ele1.__config__.formId);
                      if(ele1.__config__.children){
                        ele1.__config__.children.forEach(ele2 => {
                            formIds.push(ele2.__config__.formId);
                        });
                      }
                    }else{
                       formIds.push(ele1.__config__.formId);
                    }
                });
              }
            }
          }
        }else if(ele.__config__.componentName &&ele.__config__.componentName == "table"){
          formIds.push(ele.__config__.formId);
          if(ele.__config__.children){
            ele.__config__.children.forEach(ele2 => {
                formIds.push(ele2.__config__.formId);
            });
          }
        }else{
           formIds.push(ele.__config__.formId);
        }
      });
       return formIds;
    },
    /**
     * 获取数字或金额类型组件
     * @params arr Array 组件数组
     * **/
    getNumberTypeComponents(arr){
      //增加前先清空
      let numberTypeComponents = [];
      arr.forEach((item)=>{
        if(item&&item.__config__.componentName&&item.__config__.componentName == 'avue-tabs'){
			let childrenObj = item?.__config__?.childrenObj || {};
          for(let key in childrenObj){
            let children = childrenObj[key];
            if(children&&children.length>0){
               numberTypeComponents=numberTypeComponents.concat(this.getNumberTypeComponents(children));
            }
          }
        }else{
          if(item&&item.__config__&&((item.__config__&&item.__config__.avueType == 'number') || (item.type&&item.type == 'number'))){
            numberTypeComponents.push(item);
          }
        }
      });
	 return numberTypeComponents
 
    },
    /*
    * */
    activeFormItem (currentItem) {
      this.activeData = currentItem;
      this.activeId = currentItem.__config__.formId;
      //根据所选组件 找到子表单的父级
      let parentNode = this.getParent(currentItem.__config__.formId);
      
      this.parentComponent = parentNode;
      //如果所选组件的父级是table
      if (parentNode?.__config__?.componentName === 'table') {
        //把table 的子集  全部新增一个属性  并且绑定上表  子组件的bindTable = table组件的bandTable
        parentNode.__config__.children.forEach((el) => {
          el.__config__.bindTable = parentNode.__config__.bindTable;
          el.__config__.isChild = true;
        });
      }

      if (parentNode?.__config__?.componentName === 'avue-tabs') {
        parentNode.__config__.children.forEach((el) => {
        });
      }
      /* else if(this.activeData.__type__=='user'){
	    this.roleMemberVisible=true
	  } */
    },
    //拖拽完成时
    onEnd (obj) {
      //禁用avue-tabs 选项卡里再拖拽选项卡
      if(
        obj&&
        obj.clone&&
        obj.clone.innerText&&
        obj.clone.innerText.includes('选项卡') &&  
        obj.to&&
        obj.to._prevClass&&
        obj.to._prevClass.includes('tabs-item')){
        this.$message.error(this.$t('禁止选项卡里再拖拽选项卡'));
        for(let i = 0;i<this.drawingList.length;i++){
          if(this.drawingList[i]?.__config__?.componentName == 'avue-tabs'){
            let childrenObj = this.drawingList[i]?.__config__?.childrenObj || {};
            for(let key in childrenObj){
              let children = childrenObj[key];
              children.map((item,idx)=>{
                if(item?.__config__?.componentName == 'avue-tabs'){
                  children.splice(idx,1);
                }
              });
            }
          }
        }
      }
      //子表单限制组件
      if(this.activeData.__config__.componentName=='table'||obj.to.offsetParent.className.includes('drawing-row-item')){
        let permanentlyNotSupportedTags = ['tinymce','el-slider','el-divider','h2','xjr-opinion-comonent','avue-custom-button'];
        let notSupportedAtTheMomentTags = ['el-upload','el-image','xjr-cascader'];
        for(let i = 0;i<this.drawingList.length;i++){
          if(this.drawingList[i]?.__config__?.componentName == 'table'){
          let children = this.drawingList[i]?.__config__?.children || [];
              children.map((item,idx)=>{
                if(item.__config__.componentName){
                  children.splice(idx,1);
                  this.$message.error(this.$t('code.leftScrollbar.hintNotSupport'));
                }else if(permanentlyNotSupportedTags.includes(item.__config__.tag)){
                   children.splice(idx,1);
                  this.$message.error(this.$t('code.leftScrollbar.hintNotSupport'));
                }else if(notSupportedAtTheMomentTags.includes(item.__config__.tag)){
                   children.splice(idx,1);
                 this.$message.error(this.$t('code.leftScrollbar.hintNotUse'));
                }else if(item.autoCode){
                   children.splice(idx,1);
                  this.$message.error(this.$t('code.leftScrollbar.hintNotUse'));
                }
              });
          }else if(this.drawingList[i]?.__config__?.componentName == 'avue-tabs'){
            let childrenObj = this.drawingList[i]?.__config__?.childrenObj || {};
            for(let key in childrenObj){
              let childrenObjchildren = childrenObj[key];
              childrenObj[key] = childrenObjchildren.map((item,idx)=>{
                if(item?.__config__?.componentName== 'table'){
                  let children = item.__config__.children || [];
                  children.map((item,idx)=>{
                    if(item.__config__.componentName){
                      children.splice(idx,1);
                      this.$message.error(this.$t('code.leftScrollbar.hintNotSupport'));
                    }else if(permanentlyNotSupportedTags.includes(item.__config__.tag)){
                      children.splice(idx,1);
                      this.$message.error(this.$t('code.leftScrollbar.hintNotSupport'));
                    }else if(notSupportedAtTheMomentTags.includes(item.__config__.tag)){
                      children.splice(idx,1);
                    this.$message.error(this.$t('code.leftScrollbar.hintNotUse'));
                    }else if(item.autoCode){
                      children.splice(idx,1);
                      this.$message.error(this.$t('code.leftScrollbar.hintNotUse'));
                    }
                  });

                }
                return item;
              });
            }
          }
        }
      }

      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    addComponent (item) {
      localStorage.setItem('childrenTab', JSON.stringify({}));
      if (store.state.FD.controllerType === 0) {
        if (!this.baseData.codeFormNumber) {//判断模版是否生成表格
          if (
              item.__config__.componentName === 'table' && this.baseData.step1.list.length < 2//如果是多表  才能增加子表格组件
          ) {
            this.$message.error(this.$t('code.leftScrollbar.hintMust'));
            return;
          }
        }
        //如果添加了子表单 就代表为多表
        if (
            item.__config__.componentName === 'table' ||
            this.baseData.step1.list.length
        ) {
          this.formConf.isMultiTable = true;
        }
      }
      //子表单限制组件
      // if(this.activeData.__config__.componentName=='table'){
      //   let permanentlyNotSupportedTags = ['tinymce','el-slider','el-divider','h2','xjr-opinion-comonent'];
      //   let notSupportedAtTheMomentTags = ['el-upload','el-image'];
      //   if(item.__config__.componentName){
      //     this.$message.error('该组件不支持于子表单中使用');
      //     return;
      //   }else if(permanentlyNotSupportedTags.includes(item.__config__.tag)){
      //     this.$message.error('该组件不支持于子表单中使用');
      //     return;
      //   }else if(notSupportedAtTheMomentTags.includes(item.__config__.tag)){
      //     this.$message.error('该组件正在兼容中，暂不能于子表单中使用');
      //     return;
      //   }else if(item.__config__.avueType&&item.__config__.avueType=='autoCode'){
      //     this.$message.error('该组件正在兼容中，暂不能于子表单中使用');
      //     return;
      //   }else if(item.__config__.tag=='el-cascader'){
      //     this.$message.error('该组件正在兼容中，暂不能于子表单中使用');
      //     return;
      //   }else if(item.__config__.filterable){
      //     this.$message.error('该组件正在兼容中，暂不能于子表单中使用');
      //     return;
      //   }
      // }
      const clone = this.cloneComponent(item);
      this.drawingList.push(clone);
      //根据所选组件 找到的父级  如果有父级  就证明他是子表单的子组件
      let parentNode = this.getParent(clone.__config__.formId);

      if (parentNode) {
        if (!parentNode.__config__.bindTable)
          this.$message.info(this.$t('code.leftScrollbar.hintNoSelect'));
        else item.__config__.bindTable = parentNode.__config__.bindTable;
      }
      this.activeFormItem(clone);
    },
    cloneComponent (origin) {
      if (store.state.FD.controllerType === 0) {
        if (!this.baseData.codeFormNumber) {//判断模版是否生成表格
          if (
              origin.__config__.componentName === 'table' &&//如果是多表  才能增加子表格组件
              this.baseData.step1.list.length < 2
          ) {
            this.$message.error(this.$t('code.leftScrollbar.hintMust'));
            return;
          }
        }
        //如果添加了子表单 就代表为多表
        if (origin.__config__.componentName === 'table') {
          this.formConf.isMultiTable = true;
        }
      }
      let clone = deepClone(origin);
      const config = clone.__config__;
      config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
      // if (config.tag === 'el-image') {  
      //   config.span = 12;
      // }
      this.createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
      return tempActiveData;
    },
    getRandFormId(){
      if(this.oldFormIds.includes(this.idGlobal)){
		  this.idGlobal++;
        this.getRandFormId();
      }
	  return this.idGlobal;
    },
    /**
     * 点击左侧生成的组件的事件*/
    createIdAndKey (item) {
      let config = item.__config__;
     let formId = this.getRandFormId();
      this.$set(config,'formId',formId);
      this.oldFormIds.push(config.formId);
      config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件

      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal+ S4()}`;
      } else if (config.layout === 'rowFormItem') {
        if (!config.componentName) {
          config.componentName = `row${this.idGlobal}`;
        }
        !Array.isArray(config.children) && (config.children = []);
        delete config.label; // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
            this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    AssembleFormData () {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf,
      };
      this.formData?.fields && (store.state.FD.formData = this.formData)
    },
    generate (data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      store.state.FD.generateConf = this.generateConf;
      func && func(data);
    },
    execRun (data) {
      this.AssembleFormData();
      this.drawerVisible = true;
    },
    execDownload (data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, data.fileName);
    },
    execCopy (data) {
      document.getElementById('copyNode').click();
    },
    empty () {
      this.$confirm(this.$t('code.leftScrollbar.hintEmpty'),this.$t('deletePrompt.promptTitle'), { type: 'warning' }).then(
          () => {
            this.oldFormIds = [];
            this.drawingList = [];
            this.idGlobal = 100;
            this.baseData.step3=[];
          }
      );
    },
    drawingItemCopy (item, list) {
      let clone =  JSON.parse(JSON.stringify(item));
      clone = this.createIdAndKey(clone);
      list.push(clone);
      this.activeFormItem(clone);
    },
    drawingItemDelete (index, list) {
		//删除当前财务组件修改关联组件的表达式
		this.numberTypeComponents.forEach(it=>{
			if(it.__config__.formId==list[index].__config__.formId){
				if(it.relativeComObject?.length>0){
					it.relativeComObject.forEach(i=>{
						let idx=this.numberTypeComponents.findIndex(o=>{return o.__config__.formId==i})
						if(idx>=0){
							let compute=deepClone(this.numberTypeComponents[idx].computationalConfiguration);
							if(compute?.length>0){
								compute.forEach(j=>{
									if(j.formId>0&&j.formId!=it.__config__.formId){
										let k=this.numberTypeComponents.findIndex(o=>{return o.__config__.formId==j.formId})
										if(k>=0){
											this.numberTypeComponents[k].relativeComObject=this.numberTypeComponents[k].relativeComObject.filter(o=>{return o!=i})
											
										}
									}
								})
							}
							this.numberTypeComponents[idx].computationalConfiguration=[];
							this.numberTypeComponents[idx].computationalConfigurationValue="";
							this.numberTypeComponents[idx].readonly=false;
						}
					})
				}
			}
		})

    // 删除api配置中引用了该组件，组件触发事件引用了该组件 
    let deletecomponentformId = list[index].__config__.formId;
		//return;
      list.splice(index, 1);
      this.changeTriggerEventData(deletecomponentformId);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
      
    },
    changeTriggerEventData(deletecomponentformId){
      if(this.drawingList.length>0){
        this.drawingList = this.drawingList.map((element, i) => {
          if (element.__config__.componentName === 'table') {
            //暂时不用考虑子表单
          }else if (element.__config__.componentName === 'avue-tabs') {
              if (JSON.stringify(element.__config__.childrenObj) != "{}") {
                for (let key in element.__config__.childrenObj) {
                  if(element.__config__.childrenObj[key]&&element.__config__.childrenObj[key].length>0){
                    element.__config__.childrenObj[key] = element.__config__.childrenObj[key].map(item => {
                      if (item?.__config__?.componentName == "table") {
                        //暂时不用考虑子表单
                      }else{
                          if(item.__config__.triggerEvents&&item.__config__.triggerEvents.length>0){
                            item.__config__.triggerEvents.forEach(eventName => {
                              //按钮删除逻辑（click）
                                if(item.__config__.tag&&item.__config__.tag=='avue-custom-button'&&eventName=='click'){
                                  if(item.__config__.triggerEventData[eventName]&&item.__config__.triggerEventData[eventName].length>0){
                                      item.__config__.triggerEventData[eventName].forEach((obj,objIndex) => {
                                        obj.operationConfiguration.apiInputParams.forEach((json,index) => {
                                          if(json.params&&json.params.id==deletecomponentformId){
                                              item.__config__.triggerEventData[eventName][objIndex].operationConfiguration.apiInputParams[index].params={}
                                          }
                                        })
                                      })
                                  }
                                }else{
                                  if(item.__config__.triggerEventData[eventName]&&item.__config__.triggerEventData[eventName].length>0){
                                      item.__config__.triggerEventData[eventName].forEach((item2,index2) => {
                                        if(deletecomponentformId==item2.componentFormId){
                                          item.__config__.triggerEventData[eventName][index2].componentFormId = null;
                                        }
                                      });
                                  }
                                }
                            });
                          }
                          if(item.__config__.apiConfig&&item.__config__.apiConfig.apiInputParams&&item.__config__.apiConfig.apiInputParams.length>0){
                            item.__config__.apiConfig.apiInputParams.forEach((json,index) => {
                              if(json.params&&json.params.id==deletecomponentformId){
                                  item.__config__.apiConfig.apiInputParams[index].params = {};
                              }
                            });
                          }
                      }
                      return item;
                    })
                  }
                }
              }
          }else{
            if(element.__config__.triggerEvents&&element.__config__.triggerEvents.length>0){
              element.__config__.triggerEvents.forEach(eventName => {
                //按钮删除逻辑（click）
                if(element.__config__.tag&&element.__config__.tag=='avue-custom-button'&&eventName=='click'){
                  if(element.__config__.triggerEventData[eventName]&&element.__config__.triggerEventData[eventName].length>0){
                      element.__config__.triggerEventData[eventName].forEach((obj,objIndex) => {
                        obj.operationConfiguration.apiInputParams.forEach((json,index) => {
                          if(json.params&&json.params.id==deletecomponentformId){
                              element.__config__.triggerEventData[eventName][objIndex].operationConfiguration.apiInputParams[index].params={}
                          }
                        })
                      })
                 }
                }else{
                  if(element.__config__.triggerEventData[eventName]&&element.__config__.triggerEventData[eventName].length>0){
                    element.__config__.triggerEventData[eventName].forEach((item,index) => {
                      if(deletecomponentformId==item.componentFormId){
                        element.__config__.triggerEventData[eventName][index].componentFormId = null;
                      }
                    });
                 }
                }
                 
              });
            }
            if(element.__config__.apiConfig&&element.__config__.apiConfig.apiInputParams&&element.__config__.apiConfig.apiInputParams.length>0){
              element.__config__.apiConfig.apiInputParams.forEach((json,index) => {
                 if(json.params&&json.params.id==deletecomponentformId){
                    element.__config__.apiConfig.apiInputParams[index].params = {};
                 }
              });
            }
          }
          return element;
        });
      }
    },
    generateCode () {
      // if(!this.generateConf) this.generateConf = { type : 'file'}

      let type = this.generateConf?.type || store.state.FD.generateConf?.type || 'file'
      this.AssembleFormData();
      if (!this.formData.fields) this.formData = store.state.FD.formData;

      const script = vueScript(makeUpJs(this.formData, type));
      const html = vueTemplate(makeUpHtml(this.formData, type));
      const css = cssStyle(makeUpCss(this.formData));
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson () {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download () {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = 'download';
    },
    run () {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = 'run';
    },
    copy () {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = 'copy';
    },
    tagChange (newTag) {
      newTag = this.cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = this.activeData.__vModel__;
      config.formId = this.activeId;
      config.span = this.activeData.__config__.span;
      this.activeData.__config__.tag = config.tag;
      this.activeData.__config__.tagIcon = config.tagIcon;
      this.activeData.__config__.document = config.document;
      if (
          typeof this.activeData.__config__.defaultValue ===
          typeof config.defaultValue
      ) {
        config.defaultValue = this.activeData.__config__.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList (newTag, list) {
      const index = list.findIndex(
          (item) => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children))
            this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },
    refreshJson (data) {
      this.drawingList = deepClone(data.fields);
      delete data.fields;
      this.formConf = data;
    },
    cancelDialog () {
      this.roleMemberVisible = false;
    },
    confirmDialog () {
      var obj = this.$refs.addRoleform.pushParentData();
      this.activeData.__config__.saveValue = '';
      this.activeData.__config__.defaultValue = '';
      obj.forEach((e, i) => {
        this.activeData.__config__.saveValue +=
            i < obj.length - 1 ? e.F_UserId + ',' : e.F_UserId;
        this.activeData.__config__.defaultValue +=
            i < obj.length - 1 ? e.F_RealName + ',' : e.F_RealName;
      });
      this.roleMemberVisible = false;
    },
    getParentFormId (formId) {
      let parentFormId = null;
      //遍历整个组件列表
      this.drawingList.forEach((element, i) => {
        //找到子表单组件，  只有子表单组件 需要默认设置所绑定的表
        if (element.__config__.componentName === 'table') {
          element.__config__.children.forEach((el) => {
            if (el.__config__.formId === formId) {
              parentFormId = element.__config__.formId;
            }
          });
        }else if (element.__config__.componentName === 'avue-tabs') {
          let childrenObj = element?.__config__?.childrenObj || {};
            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
              let children = childrenObj[key] || [];
              element.__config__.childrenObj[key] = children.map(item => {
                if (item?.__config__?.componentName == "table") {
                   item.__config__.children.forEach((el) => {
                    if (el.__config__.formId === formId) {
                      parentFormId = el.__config__.formId;
                    }
                  });
                }
              })
              }
            }
        }
      });

      return parentFormId;
    },
    //根据formid 从所有组件中找到他的父级  如果没有父级 就为空
    getParent (formId) {
      let res = null;
      //遍历整个组件列表
      this.drawingList.forEach((element, i) => {
        //找到子表单组件，  只有子表单组件 需要默认设置所绑定的表
        if (element.__config__.componentName === 'table') {
          element.__config__.children.forEach((el) => {
            if (el.__config__.formId === formId) {
              res = element;
            }
          });
        }

      });

      return res;
    },
    changeItemVisible(index){
      this.leftComponents[index].visible = !this.leftComponents[index].visible;
    }
  }
};
</script>

<style lang='scss'>
@import "src/styles/home";
.components-scrollbar .el-scrollbar__wrap{
  margin-right: -16px !important;
}
</style>
<style lang="scss" scoped>
.empty-box{
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height:100%;
  .img-box{
    width:800px;
    img{
      width:100%;
      height:100%;
    }
  }

}
.components-title .icon-box{
	width: auto;
}
</style>