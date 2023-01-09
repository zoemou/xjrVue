<template>
  <div>
      <Header
          :controllerType="controllerType"
          :active="active"
          @close="close"
          @prev="prev"
          @next="next"
          @saveFormSubmit="saveFormSubmit"
          @codeFormSubmit="codeFormSubmit"
        ></Header>
    <div class="content">
    <div class="form">
       <component :is="getComponent"
        ref="steps"
        :baseData="baseData"
        :curStep="active"
        :isNextStep="isNextStep"
        :step2Html="step2Html"
        @onChange="onChildValue"
        />
    </div>
    </div>
    <CodeTemplateDialog v-loading='templateLoading' 
    v-if="templateVisible"
     :menuForm="menuForm" 
     @saveCodeScheme="saveCodeScheme"></CodeTemplateDialog>
      <TableListDialog  v-if="tableListVisible"  :isEdit="editOldDbId?true:false" :baseData="baseData" @close="closeTableList"></TableListDialog>
  </div>
</template>

<script>
import Header from '@/views/QuickDevelopment/codeHeader/Index.vue';
import CodeTemplateDialog from './codeBuild/CodeTemplateDialog.vue';
import InterfaceDesign from './codeBuild/InterfaceDesign.vue';
import DataTableSettings from './CodeStepOne.vue';
import TableStructurete from './CodeStepTwoListStructure';
import TableListDialog from './TableListDialog.vue';
import FormPage from './CodeStepTwo.vue';
import OutputConfiguration from './CodeStepSix.vue';
import CodePreview from './CodeStepSeven.vue';
import BindMenu from './CodeStepEight.vue';
import FormEvent from './FormEvent.vue';
import { getDataItem } from '@/api/system/dataitem.js';
import { FormatTree } from '../../../util/util.js';
import store from '@/store/index';
import {
  SUBMIT_REPLACE_STRING,
  CREATEED_REPLACE_STRING,
  MESSAGE_REPLACE_STRING,
  EXPORT_REPLACE_STRING,
} from '@/util/buildCodeConst.js';

import { baseUrl } from '@/config/env.js';

import { buildWebCode, saveCodeScheme, updateCodeScheme } from '@/api/code/code.js';
import home from '@/views/FormDesign/Home';
import { FormDesignMixin } from '@/mixins/FormDesign/configFn';
import {validateFunctionName } from '@/api/code/code.js';
// import {mobileCategory} from '@/components/mobileDesign/config';
export default {
  name: 'CodeForm',
  mixins:[FormDesignMixin],
  components: {
    Header,
    InterfaceDesign,
    DataTableSettings,
    FormPage,
    OutputConfiguration,
    CodePreview,
    BindMenu,
    FormEvent,
    TableStructurete,
    CodeTemplateDialog,
    TableListDialog
  },
  props: {
    baseDataEditor: {
      type: Object,
      default: ()=>{
        return {};
      }
    },
    controllerType: {
      type: Number || String,
      default: 0
    },
    stepName: {
      type: Array, // Array<String>
      default: ()=>{
        return []
      }
    }
  },
    computed: {
    getComponent() {
      if(this.active === this.numToActive.zero && this.controllerType === 0){
        return 'DataTableSettings';
      }else if((this.stepTwo === true && (this.controllerType === 1 || this.controllerType === 2)) || (this.active === this.numToActive.one && this.controllerType === 0) || (this.active === this.numToActive.one && this.controllerType === 2)){
        return 'FormPage';
      }else if(this.active === this.numToActive.one && this.controllerType === 1){
        return 'TableStructurete'
      }else if(this.active == this.numToActive.two){
        return 'InterfaceDesign'
      }else if(this.active == this.numToActive.five){
        return 'OutputConfiguration'
      }else if(this.active == this.numToActive.six){
        return 'CodePreview'
      }else if(this.active == this.numToActive.seven){
        return 'BindMenu'
      }else if(this.active == this.numToActive.nine){
        return 'FormEvent'
      }
    }
  },
  // ['baseDataEditor', 'controllerType', 'stepName'],
  data () {
    return {
	  //diogbaseData:mobileCategory,
      stepTwo: false,
      isNextStep:true,
      active: 0,
      FDsteps: this.stepName,
      baseData: {
        step1: {
          F_DbId: '',
          list: [],
        },
        step2: [],
        step3: [],
        step4: {},
        step5: [],
        step6: {},
        step7: {},
        step8: {},
        step9:[],
        stepConf:{},
        hideComponents:[]
      },
      step6_codeSchemeId: '',
      step2Html: '',
      step2FormSize: '',
      menuForm: {
        f_name: '',
        f_Id: '',
        f_Catalog: '',
		//f_appCatalog:'',
        f_CodeSchema: '',
        f_Description: '',
      },
      templateTypeTree: [],
      templateVisible: false,
      rules: {
        f_name: [
          { required: true, message: this.$t('code.codeForm.saveTemplateModal.placeholderName'), trigger: 'blur' },
        ],
        f_Catalog: [
          { required: true, message: this.$t('code.codeForm.saveTemplateModal.placeholderClassification'), trigger: 'change' },
        ],
		// f_appCatalog:[
		// 	{required: true, message: this.$t('请选择移动端模板分类'), trigger: 'change'}
		// ]
      },
      param: {},
      numToActive: {
        zero: 0,
        one: 1,
        nine:2,
        two: 3,
        five: 4,
        six: 5,
        seven: 6,
      },
      arr: [],
      datum: [],
      templateLoading:false,
      tableListVisible:false,
      tableProcessingSucceeded:false,
      notifyIndex:1,
      editOldDbId:""
    };
  },
  created () {
    if (this.controllerType === 1) { // 为表结构模板时，初始化
      this.stepTwo = true;
      this.numToActive = {
        zero: 0,
         nine:1,
        one: 2,
        two: 3,
        five: 4,
        six: 5,
        seven: 6,
      };
    }

    if (this.controllerType === 2) {
      this.stepTwo = true;
      this.numToActive = {
        zero: 0,
        nine:1,
        two: 2,
        five: 3,
        six: 4,
        seven: 5,
      };
    }
	if(this.controllerType === 3){//表单设计的生成代码
		this.numToActive = {
		  two: 0,
		  five: 1,
		  six: 2,
		  seven: 3
		};		
	}
    if (JSON.stringify(this.baseDataEditor)!='{}') {
      const F_CodeSchema = JSON.parse(this.baseDataEditor.F_CodeSchema);
	  if(this.controllerType === 3){
		this.step2Html = F_CodeSchema.step2Html
	  }
    this.baseData.dbTable = F_CodeSchema.dbTable;
      this.baseData.step1.F_DbId = F_CodeSchema.dbLinkId;
      this.baseData.step1.list = F_CodeSchema.dbTable;
      this.editOldDbId =  F_CodeSchema.dbLinkId;

      this.baseData.step6 = F_CodeSchema.baseInfo;
      this.step6_codeSchemeId = this.baseDataEditor.F_Id;

      this.baseData.step6.codeSchemeId = this.baseDataEditor.F_Id;
      this.baseData.step4 = F_CodeSchema.colData;
      let defaultconf = {
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
        };
      this.baseData.stepConf = this.baseDataEditor.stepConf?this.baseDataEditor.stepConf:defaultconf;
      this.baseData.step2 = F_CodeSchema.formData;
      this.baseData.step3 = F_CodeSchema.queryData;
      this.baseData.step5 = F_CodeSchema.totalData;
      this.baseData.step8 = F_CodeSchema.moduleData;
      this.baseData.step9 = F_CodeSchema.eventData;
      this.baseData.step7 = F_CodeSchema.codeContent;

      this.menuForm.f_Catalog = this.baseDataEditor.F_Catalog;
      this.menuForm.f_Id = this.baseDataEditor.F_Id;
      this.menuForm.f_name = this.baseDataEditor.F_Name;
      this.menuForm.f_Description = this.baseDataEditor.F_Description;
    }

  },
  watch: {
    controllerType: {
      handler: function (val, oldVal) {
        if (val !== oldVal && oldVal !== undefined && val !== undefined) {
          this.active = 0;
          if ((this.controllerType === 1 || this.controllerType === 2) && this.active === 0) this.stepTwo = true;
          this.baseData = {
            step1: {
              F_DbId: '',
              list: [],
            },
            step2: [],
            step3: [],
            step4: {},
            step5: [],
            step6: {},
            step7: {},
            step8: {},
            step9:[]
          };
          this.$forceUpdate();
        } else {
          this.controllerType = 0;
          this.active = 0;
        }
        store.state.FD.controllerType = this.controllerType;
      },
      deep: true
    }
  },
  methods: {
    calleArr (array) {
      for (let index in array) {
        let data = array[index];
        if (data.children) {
          data.children.map(i => {
            this.arr.push(this.fieldConfig(i));
            i.__config__.children && this.calleArr(i.__config__.children);
          });
        } else {
          data.__config__ && this.arr.push(this.fieldConfig(data));
        }
      }
    },
    processorDatum () {
      const { datum, baseData: { step2, step1 } } = this;
      datum.map((father, index) => {
        father.dataChildren.map((v, i) => {
          this.setFiledConf(step2,father,v);
        });
      });
    },
    setFiledConf(step2,father,v){
      step2.map(item=>{
        if(item?.__config__?.componentName == 'table'){
          item.__config__.bindTable = father.formName;
          item?.__config__?.children.map(el => {
            if (el.__config__.formId === v.formId) {
              el.__config__.bindTable = father.formName;
              el.__config__.bindTableField = v.fieldName;
              el.__config__.bindTableFieldType = v.dataType;
              el.__config__.fieldLength = v.fieldLength;
              el.__vModel__ = v.fieldName;
            }
          });
        }else if(item?.__config__?.componentName == 'avue-tabs'){
          let childrenObj = item?.__config__?.childrenObj || null;
          this.processorDatumByTabs(childrenObj,father,v);
        }else{
          return item.__config__.formId === v.formId && (
                    item.__config__.bindTable = this.datum[0]?.formName,
                    item.__config__.bindTableField = v.fieldName,
                    item.__config__.bindTableFieldType = v.dataType,
                    item.__config__.fieldLength = v.fieldLength,
                    item.__vModel__ = v.fieldName
          );
        }
      });
    },
    processorDatumByTabs(childrenObj,father,v){
      if(!childrenObj) return;
      for(let key in childrenObj){
        let children = childrenObj[key] || [];
        children.map(item=>{
          if(item?.__config__?.componentName == 'table'){
            //子表单这里不做处理
            item.__config__.bindTable = father.formName;
            item?.__config__?.children.map(el => {
              if (el.__config__.formId === v.formId) {
                el.__config__.bindTable = father.formName;
                el.__config__.bindTableField = v.fieldName;
                el.__config__.bindTableFieldType = v.dataType;
                el.__config__.fieldLength = v.fieldLength;
                el.__vModel__ = v.fieldName;
              }
            });
          }else{
            return item.__config__.formId === v.formId && (
                  item.__config__.bindTable = this.datum[0]?.formName,
                      item.__config__.bindTableField = v.fieldName,
                      item.__config__.bindTableFieldType = v.dataType,
                      item.__config__.fieldLength = v.fieldLength,
                      item.__vModel__ = v.fieldName
            );
          }
        });
      }
    },
    //生成随机 GUID 数
    guid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + S4() + S4() + S4() + S4());
    },
    prev () {
      --this.active;
      if (this.active < 0) this.active = 0;
      if ((this.controllerType === 1 || this.controllerType === 2) && this.active === 0) {
        this.stepTwo = true;
        // this.$refs['steps'].processorDatum();
      }
      if(this.active === this.numToActive.two && this.controllerType === 1){
        //  this.$refs['steps'].processorDatum();
      }
      this.isNextStep = false;
      this.tableProcessingSucceeded =false;
    },
    getRandowNum() {
      return Math.floor(Math.random() * (100000000000000000000 - 1000)) + 1000;
    },
    simpleDevelopmentTemplate(){
      let doNotGenerateTags=['h2','el-divider','xjr-opinion-comonent'];
      let datum = [];
      let baseDataStep2 = {};
      let mainTableFormName = 'table' + this.getRandowNum();
      let mainTableDataChildren = [];
      datum.push({
        id: 1,
        formName: mainTableFormName,
        dataChildren: mainTableDataChildren
      });
      baseDataStep2 = this.baseData.step2.map((item, index) => {
        if(item.__config__.componentName){
          let configComponentName = item.__config__.componentName;
          if(configComponentName == 'table'){
            let subTableName = 'table' + datum.length + this.getRandowNum();
            let datumTemp = {
                id: datum[datum.length - 1].id + 1,
                formName: subTableName,
                dataChildren: []
              };
            item.__config__.bindTable = subTableName;
            let children = item.__config__.children;
             let newChildren = [];
            if(children.length>0){
              newChildren = children.map(item3=>{
                if(item3.__config__.componentName&&item3.__config__.componentName == 'table'){
                  
                }else if(item3.__config__.componentName&&item3.__config__.componentName == 'avue-tabs'){
                  
                }else{
                  if(!doNotGenerateTags.includes(item3.__config__.tag)){
                    let fieldJson = this.fieldConfig(item3);
                    datumTemp.dataChildren.push(fieldJson);
                    item3.__config__.bindTable=subTableName;
                    item3.__config__.bindTableField=fieldJson.fieldName;
                    item3.__config__.bindTableFieldType=fieldJson.dataType;
                  }
                }
                return item3;
              });
            }
            item.__config__.children = newChildren;
            datum.push(datumTemp);
          }else if(configComponentName == 'avue-tabs'){
            if(JSON.stringify(item.__config__.childrenObj) == '{}') return;
            for(let key in item.__config__.childrenObj){
              let children = item.__config__.childrenObj[key] || [];
              let newChildren = [];
              newChildren = children.map(item2=>{
                if(item2.__config__.componentName&&item2.__config__.componentName == 'table'){
                  let subTableName = 'table' + datum.length + this.getRandowNum();
                  item2.__config__.bindTable = subTableName;
                 let datumTemp = {
                    id: datum[datum.length - 1].id + 1,
                    formName: subTableName,
                    dataChildren: []
                  };
                  let children = item2.__config__.children;
                  let newChildren2 = [];
                  if(children.length>0){
                    newChildren2 = children.map(item3=>{
                      if(item3.__config__.componentName&&item3.__config__.componentName == 'table'){
                        
                      }else if(item3.__config__.componentName&&item3.__config__.componentName == 'avue-tabs'){
                        
                      }else{
                        if(!doNotGenerateTags.includes(item3.__config__.tag)){
                          let fieldJson = this.fieldConfig(item3);
                          datumTemp.dataChildren.push(fieldJson);
                          item3.__config__.bindTable=subTableName;
                          item3.__config__.bindTableField=fieldJson.fieldName;
                          item3.__config__.bindTableFieldType=fieldJson.dataType;
                        }
                      }
                      return item3;
                    });
                  }
                  item2.__config__.children = newChildren2;
                  datum.push(datumTemp);
                  }else{
                    if(!doNotGenerateTags.includes(item2.__config__.tag)){
                      let fieldJson = this.fieldConfig(item2);
                      mainTableDataChildren.push(fieldJson);
                      item2.__config__.bindTable=mainTableFormName
                      item2.__config__.bindTableField=fieldJson.fieldName
                      item2.__config__.bindTableFieldType=fieldJson.dataType
                    }
                  }
                  return item2;
                });
              item.__config__.childrenObj[key] = newChildren;
            }
          }
          }else{
            if(!doNotGenerateTags.includes(item.__config__.tag)){
              let fieldJson = this.fieldConfig(item);
              mainTableDataChildren.push(fieldJson);
              item.__config__.bindTable=mainTableFormName
              item.__config__.bindTableField=fieldJson.fieldName
              item.__config__.bindTableFieldType=fieldJson.dataType
            }
          }
          return item;
      });
     return {datum,baseDataStep2 }
    },
    // 数据表处理
    openTableList(){
      this.tableListVisible = true;
      this.tableProcessingSucceeded =false;
    },
    closeTableList(valid){
      this.tableListVisible = false;
      this.tableProcessingSucceeded = valid;
      if(valid){
        this.next();
      }
    },
    notifyError(message){
      this.$notify({
          type: 'warning',
          title:this.$t('editorModule.warn'),
          message,
          offset: 100*this.notifyIndex,
          duration:2000+(this.notifyIndex*1000)
        });
      this.notifyIndex++;
    },
    verificationFailed(item,tabMsg=""){
      // 标题组件 标题必填
      if(item.__config__.tag=='h2'&&item.__config__.label==""){
          this.notifyError(tabMsg+this.$t('titleNotFilledInTitleComponent'));
          return true;
      }
       // 税率组件 税率必填
      if(item.type&&item.type=='number'&&item.isTax&&(item.taxRate==""||typeof item.taxRate !=='number')){
        let title = item.__config__.label?item.__config__.label:'税率组件';
         this.notifyError(tabMsg+title+this.$t('taxRateNotFilled'));
         return true;
      }
      // 编码组件 编码必填
      if(item.__config__.avueType=='autoCode'&&!item.__config__.autoCodeRule){
        let title = item.__config__.label?item.__config__.label:'编码组件';
        this.notifyError(tabMsg+title+this.$t('encodingRuleNotSelected'));
        return true;
      }
      // 子表组件中预加载数据源 按钮选择数据开启的时候，预加载数据源必填
      if(item.__config__.componentName&&item.__config__.componentName=='table'&&item.__config__.isSelectData){
        let componentTitle = item.__config__.componentTitle?item.__config__.componentTitle+this.$t('component'):'table组件';
        if(!item.__config__.dataType){
           this.notifyError(tabMsg+componentTitle+this.$t('preloadDataSourceNotSelected'));
          return true;
        }
        if(item.__config__.dataType=="dataSource"&&!item.__config__.dataSource){
          this.notifyError(tabMsg+componentTitle+this.$t('dataOptionPreloadDataSourceNotSelected'));
          return true;
        }
        if(item.__config__.dataType=="dataItem"&&!item.__config__.dataItem){
          this.notifyError(tabMsg+componentTitle+this.$t('dataOptionPreloadDataSourceNotSelected'));
           return true;
        }
      }
      // 级联选择 必须选择数据源
      if(item.__config__.avueType=='cascader'){
        let title = item.__config__.label?item.__config__.label:'级联选择';
        if(item.__config__.settings.length==0){
          this.notifyError(tabMsg+title+this.$t('dataSourceNotSelected'));
          return true;
        }
      }
      // 数据配置必填  联想下拉 联想弹层  多选弹层 下拉选择  单选框 多选框
      if(item.__config__.avueType=='asso-select'||
        item.__config__.avueType=='asso-popup'||
        item.__config__.avueType=='mutiple-popup'||
        item.__config__.avueType=='select'||
        item.__config__.avueType=='radio'||
        item.__config__.avueType=='checkbox'){
           let title = item.__config__.label;
           if(!title){
            if(item.__config__.avueType=='asso-select')title='联想下拉'
            if(item.__config__.avueType=='asso-popup')title='联想弹层'
            if(item.__config__.avueType=='mutiple-popup')title='多选弹层'
            if(item.__config__.avueType=='select')title='下拉选择'
            if(item.__config__.avueType=='radio')title='单选框'
            if(item.__config__.avueType=='checkbox')title='多选框'
           }
          if(!item.__config__.dataType){
             this.notifyError(tabMsg+title+this.$t('dataSourceNotSelected'));
            return true;
          }
          if(item.__config__.dataType=="dataSource"){
            if(!item.__config__.dataSource){
              this.notifyError(tabMsg+title+this.$t('dataOptionsForTheDataSourceAreNotSelected'));
              return true;
            }
            if(!item.__config__.saveField){
              this.notifyError(tabMsg+title+this.$t('saveFieldDataSourceNotSelected'));
              return true;
            }
            if(!item.__config__.showField){
              this.notifyError(tabMsg+title+this.$t('displayFieldOfDataSourceIsNotSelected'));
              return true;
            }
          }
          if(item.__config__.dataType=="dataItem"&&!item.__config__.dataItem){
             this.notifyError(tabMsg+title+this.$t('DataOptionForTheDataDictionaryNotSelected'));
             return true;
          }
          if(item.__config__.dataType=="dataApi"){
            if(!item.__config__.apiConfig.url){
              this.notifyError(tabMsg+title+this.$t('APIConfigInterfaceConfigurationNotSelected'));
              return true;
            }
            if(!item.__config__.apiConfig.dataSource){
              this.notifyError(tabMsg+title+this.$t('APIConfigDataOptionNotSelected'));
              return true;
            }
            if(!item.__config__.apiConfig.saveField){
              this.notifyError(tabMsg+title+this.$t('APIConfigSaveFieldIsNotSelected'));
              return true;
            }
            if(!item.__config__.apiConfig.showField){
              this.notifyError(tabMsg+title+this.$t('APIConfigShowsFieldNotSelected'));
              return true;
            }
          }
      }
       return false;
    },
    validateFormData(){
      this.notifyIndex = 1;
      let verificationFailed = false;
      if (this.baseData.step2.length > 0) {
        let tempArr = [...this.baseData.step2];
        if (tempArr.length > 0) {
          for (let index = 0; index < tempArr.length; index++) {
            const items = tempArr[index];
            if (items.__config__.componentName&&items.__config__.componentName == "avue-tabs") {
              let title = items.__config__.componentTitle?items.__config__.componentTitle:'选项卡';
              let tabNameMap = new Map();
              if(items.__config__.option){
                if(!items.__config__.option.column){
                  this.notifyError(title+this.$t('keepAtLeastOneOption'));
                   verificationFailed = true;
                }else{
                  for (let index2 = 0; index2 < items.__config__.option.column.length; index2++) {
                    if(!items.__config__.option.column[index2].label){
                      this.notifyError(title+this.$t('the')+(index2+1)+this.$t('pieceLabelConfigItemIsNotFilledIn'));
                      verificationFailed = true;
                    }else{
                      tabNameMap.set(items.__config__.option.column[index2].prop,items.__config__.option.column[index2].label);
                    }
                  }
                  if (tabNameMap.size==items.__config__.option.column.length&&
                    items.__config__.childrenObj && items.__config__.childrenObj instanceof Object) {
                    for (let key in items.__config__.childrenObj) {
                      let tabTitle = title+tabNameMap.get(key)+'下';
                      let children = items.__config__.childrenObj[key];
                      if(children.length>0){
                        for (let index2 = 0; index2 < children.length; index2++) {
                            let val = this.verificationFailed(children[index2],tabTitle);
                          if(val){
                              verificationFailed = true;
                          }
                          let items2 = children[index2];
                          if(items2.__config__.componentName&&items2.__config__.componentName == "table"){
                              let val = this.verificationFailed(items2);
                              let componentTitle = items2.__config__.componentTitle?items2.__config__.componentTitle+'组件下':'table组件下';
                              if(items2.__config__.children.length>0){
                                for (let index2 = 0; index2 < items2.__config__.children.length; index2++) {
                                    let val = this.verificationFailed(items2.__config__.children[index2],tabTitle+componentTitle);
                                    if(val){
                                        verificationFailed = true;
                                    }
                                }
                              }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }else if(items.__config__.componentName&&items.__config__.componentName == "table"){
                let val = this.verificationFailed(items);
                let componentTitle = items.__config__.componentTitle?items.__config__.componentTitle+'组件下':'table组件下';
                if(items.__config__.children.length>0){
                  for (let index2 = 0; index2 < items.__config__.children.length; index2++) {
                      let val = this.verificationFailed(items.__config__.children[index2],componentTitle);
                      if(val){
                          verificationFailed = true;
                      }
                  }
                }
            }else{
              let val = this.verificationFailed(items);
              if(val){
                verificationFailed = true;
              }
            }
          }
        }
      }
      return !verificationFailed;
    },
    validateHideComponents(){
      let verificationFailed = false;
      let msg = this.$t('inHiddenComponents');
      if(this.baseData.hideComponents&&this.baseData.hideComponents.length>0){
        for (let index = 0; index < this.baseData.hideComponents.length; index++) {
          const element = this.baseData.hideComponents[index];
          let mesIndex = index+1;
          if(element.name==""){
            this.notifyError(this.$t(msg)+this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('components - ComponentNameCannotBeEmpty'));
            verificationFailed = true;
          }else if(element.code==""){
            this.notifyError(this.$t(msg)+this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentCodeCannotBeEmpty'));
            verificationFailed = true;
          }else if(element.type=="value"){
            if(element.value===""){
              this.notifyError(this.$t(msg) +this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentAssignmentCannotBeEmpty'));
              verificationFailed = true;
            }
          }else if(element.type=="sql"){
            if(element.sqlConfig.sql===""){
              this.notifyError(this.$t(msg)+ this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentAssignmentCannotBeEmpty'));
              verificationFailed = true;
            }
          }else if(element.type=="api"){
            if(element.sqlConfig.url===""){
              this.notifyError(this.$t(msg)+this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentAssignmentCannotBeEmpty'));
              verificationFailed = true;
            }
          }
        }
      }
      return !verificationFailed;
    },
    async next () {
      if (this.active === 0) {
        // 界面优先 简易模板 表单数据检查
        if(this.controllerType==1||this.controllerType==2){
          let validate = this.validateFormData();
          if(!validate)return;
          // 隐藏组件 数据检查
          let validateHide = this.validateHideComponents();
          if(!validateHide)return;
        }
        
       if (this.controllerType === 2) {
         let {datum,baseDataStep2 } = this.simpleDevelopmentTemplate();
         this.datum = datum;
         this.baseData.step2 = baseDataStep2;
         this.$store.commit('SET_DB_LINK_ID','localDB');
         this.$store.commit('SET_FORM_DATA_FIELDS',this.baseData.step2);
        this.baseData.step1 = this.datum;
        }
        if (this.controllerType === 3) {
          // this.$refs['steps'].validateData();
          this.active++;
        }else{
          let res = this.$refs['steps']?.validateData()
        if (res) {
          //自定义表结构，快速开发简易模块，检查是否包含主表字段组件
          let primaryTableComponents = this.$store.state.FD.primaryTableComponents;
          if((this.controllerType === 1||this.controllerType === 2)&&primaryTableComponents.length<1){
            this.$confirm(this.$t('formDesign.Hint.tableStructureNext'), this.$t('deletePrompt.promptTitle'), {
              confirmButtonText: this.$t('buttonModule.modalSureBtn'),
              cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
              type: 'warning'
            }).then(() => {
              // 确定
              this.$store.commit('SET_PRIMARY_TABLE_COMPONENTS',[]);
              this.stepTwo = false;
              this.active++;
            }).catch(() => {
              // 取消
            });
          }else{
            this.$store.commit('SET_PRIMARY_TABLE_COMPONENTS',[]);
            this.stepTwo = false;
            this.active++;
          }
     
        }
        }
        
        
      } else if (this.active == this.numToActive.one) {
        let res =this.$refs['steps'].validateData();
        if (res) {
          if(this.controllerType ===1){

            // 数据表处理 (界面优先)
            if(this.controllerType==1&&this.active === 2&&this.tableProcessingSucceeded==false){
              this.openTableList();
              return false;
            }
            let baseInfoForm = this.baseData.step1;
          }else if(this.controllerType ===0){
            // 数据优先 表单数据检查
            let validate = this.validateFormData();
            if(!validate)return;
            // 隐藏组件 数据检查
            let validateHide = this.validateHideComponents();
            if(!validateHide)return;
            // fixed # 805 只要添加了的子表，必必须设计才可以下一步
             let mainTableName = this.$store.state.FD.mainTableName;
             let tableNames = this.baseData.step1.list.filter(ele=>{
               return mainTableName != ele.name;
             }).map(ele=>{
               return ele.name
             });
             let subTableNames = this.$store.state.FD.subTableNames;
             if((subTableNames&&subTableNames.length>0)||
             tableNames&&tableNames.length>0){
                let NotinSubTables = [];
                if(tableNames.length>0){
                      let tempBtns = tableNames.concat(subTableNames).filter((v) => tableNames.includes(v) && !subTableNames.includes(v));
                    if(tempBtns.length>0){
                      NotinSubTables = [...new Set([...tempBtns])];
                    }
                }
                if(NotinSubTables.length>0){
                  this.$message({
                    message: this.$t('addedSubform')+'【'+NotinSubTables.join(' ')+'】'+this.$t('notDesigned'),
                    type: 'error'
                  });
                  return false;
                }
             }  
          }
           let primaryTableComponents = this.$store.state.FD.primaryTableComponents;
          //自定义开发模块，检查是否包含主表字段组件
          if(this.controllerType === 0&&primaryTableComponents.length<1){
            this.$confirm(this.$t('formDesign.Hint.tableStructureNext'), this.$t('deletePrompt.promptTitle'), {
              confirmButtonText:this.$t('buttonModule.modalSureBtn'),
              cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
              type: 'warning'
            }).then(() => {
              // 确定
              this.$store.commit('SET_PRIMARY_TABLE_COMPONENTS',[]);
              this.active++;
            }).catch(() => {
              // 取消
            });
          }else{
            this.active++;
          }
        }
      } 
      else if (this.active == this.numToActive.two) {
        // this.$refs['steps'].validateData();
        this.active++;
      } 
      // else if (this.active == this.numToActive.three) {
      //   let res =this.$refs['steps'].validateData();
      //   if (res) {
      //     this.active++;
      //   }
      // } else if (this.active == this.numToActive.four) {
      //   this.$refs['steps'].validateData();
      //   this.active++;
      // }
      
      else if (this.active == this.numToActive.five) {
        let res = this.$refs['steps'].validateData();
        if (res) {
           let isSameClassName = false;//检查是否有相同功能类名
            try {
              let res  = await validateFunctionName(this.baseData.step6.name);//后端接口访问
              isSameClassName = res.data.data;
            } catch (error) {
            }
            if(this.baseData.step6.onlyFont){
              isSameClassName = false;//如果打开了 是否只生成前端源码 无需判断功能类型是否重复
            }
            if(isSameClassName){
              this.$confirm(this.$t('code.codeForm.Hint.checkSameName'), this.$t('deletePrompt.promptTitle'), {
              confirmButtonText: this.$t('deletePrompt.noBtn'),
              cancelButtonText: this.$t('deletePrompt.yesBtn')
                }).then(() => {
              }).catch(() => {
                this.active++;       
              });;
            }else{
              this.active++;
            }
          
        }
      } else {
        if (this.active++ > this.numToActive.seven) this.active = 0;
      }
      this.isNextStep = true;
    },
    async codeFormSubmit () {
      let  validateData =  this.$refs['steps'].validateData();
      if(validateData){
         try {
            let res  = await validateFunctionName(this.baseData.step6.name);//后端接口访问 检查是否有相同功能类名
              if(res&&res.data&&res.data.data===false){
                this.templateVisible = true;
                this.getDataItem();
              }else{
                this.$message.error(this.$t('haveTheSameFunctionClassName'));
            } 
          }
          catch (error) {

          }
      }
    },
    async submitFinish(){
      
      if (this.baseData.step1.F_DbId){
        this.param.dbLinkId = this.baseData.step1.F_DbId;
      }
        
      if (this.baseData.step1.list) {
        this.param.dbTable = this.baseData.step1.list;
      }
      if (this.baseData.step1 && (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 1)) {
        const { step1 } = this.baseData;
        if(store.state.FD.controllerType === 1){//自定义表结构
          this.disposeDbTable(step1.list);
        }else{
          this.disposeDbTable(step1);
        }
        this.param.DblinkId = store.state.FD.DbLinkId;
      }
      if (this.baseData.step6) this.param.baseInfo = this.baseData.step6;
      if (this.baseData.step4) this.param.colData = this.baseData.step4;
      if (this.baseData.step2) this.param.formData = this.baseData.step2;
      if (this.baseData.stepConf) this.param.stepConf = this.baseData.stepConf;
      if (this.baseData.hideComponents) this.param.hideComponents = this.baseData.hideComponents;
      if (this.baseData.step3) this.param.queryData = this.baseData.step3;
      if (this.baseData.step5) this.param.totalData = this.baseData.step5;
      if (this.baseData.step8) this.param.moduleData = this.baseData.step8;
       if (this.baseData.step9) this.param.eventData = this.baseData.step9;
      if (this.baseData.step7) {

        this.param.dbTable = store.state.FD.param.dbTable;
        let isWorkflowForm = this.param.baseInfo.isWorkflowForm;//是否是工作流表单
        
          let createdStr = '';
          let mountedStr = '';
          let editStr = '';
          let submitStr = '';
          let submitFormEvent ='';
        if(this.baseData.step9&&this.baseData.step9.length>0){
          // created
          let createdNodes = this.baseData.step9.filter(ele=>{
              return ele.type ==='created'
          })
          
          if(createdNodes.length>0){
            let createdNodesStr = this.getFormEventHtml(createdNodes,'created');
            if(createdNodesStr){
              createdStr = 
              `
              // 表单事件只能执行一次
              if(this.getisExecutedFormEvent()==false){
                ${createdNodesStr}
              }
              `
            }
          }
          // mounted
          let mountedNodes = this.baseData.step9.filter(ele=>{
              return ele.type ==='mounted'
          })
        
          if(mountedNodes.length>0){
            let mountedNodesStr = this.getFormEventHtml(mountedNodes,'mounted');
            if(mountedNodesStr){
              mountedStr =  `
              // 表单事件只能执行一次
              if(this.getisExecutedFormEvent()==false){
                ${mountedNodesStr}
              }
              `;
            }
          }

          // edit
          let editNodes = this.baseData.step9.filter(ele=>{
              return ele.type ==='edit'
          })
          
          if(editNodes.length>0){
            editStr = this.getFormEventHtml(editNodes,'edit');
          }

          // submit
          let submitNodes = this.baseData.step9.filter(ele=>{
              return ele.type ==='submit'
          })
          if(submitNodes.length>0){
             let submitNodesStr = this.getFormEventHtml(submitNodes,'submit');
            if(submitNodesStr){
              submitStr = `
              let key = 'index'+this.$store.state.formParser.workflowFormTabIndexKey;
              let isExecutedFormEvent = this.$store.state.formParser.isExecutedFormEvent[key]?this.$store.state.formParser.isExecutedFormEvent[key]:false;
              if(isExecutedFormEvent==false){
                ${this.getFormEventHtml(submitNodes,'submit')}
              }
              `;
              submitFormEvent = this.getFormEventConfigs(submitNodes);
            }
          }
        
        }
        let configJs =  this.getFormConfigJs(this.step2Html);
        this.baseData.step7.configJs =configJs;
        let formHTML = this.replaceFormHtml(this.step2Html,createdStr,mountedStr,editStr,submitStr,submitFormEvent,isWorkflowForm,);
        this.baseData.step7.formHTML = formHTML;
        this.baseData.step7.formHTML.replace('<el-dialog v-dialogDrag v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">', '');
        this.baseData.step7.formHTML.replace(' </el-dialog dialogDelete>', '');

        this.param.codeContent = this.baseData.step7;
        this.param.tableInfo = store.state.FD.param.tableInfo;
      }
      if(store.state.FD.controllerType === 2){
        this.param.dbLinkId="localDB";
      }
      buildWebCode(this.param, store.state.FD.controllerType).then((res) => {

        if (res.data.success) {
          this.$notify({
            title: this.$t('deletePrompt.successTitle'),
            message:this.$t('code.codeForm.Hint.reloginPrompt'),
            type: 'success',
          });
        } else {
          this.$notify({
            title:  this.$t('deletePrompt.Error'),
            message: res.data.msg,
            type: 'error',
          });
        }
        //删除兼容样式类
        let bodyClass = document.body.className.split(' ');
        bodyClass.filter((item,idx)=>{
          return item == 'original' && (bodyClass.splice(idx,1));
        });
        document.body.className = bodyClass.join(' ');
        this.$emit('finish', true);//关闭当前窗口
      });
},
    async saveFormSubmit () {
      let isSameClassName = false;//检查是否有相同功能类名
        try {
          let res  = await validateFunctionName(this.baseData.step6.name);//后端接口访问
          isSameClassName = res.data.data;
        } catch (error) {
        }
        if(isSameClassName){
          this.$confirm(this.$t('code.codeForm.Hint.checkSameName'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('deletePrompt.noBtn'),
          cancelButtonText: this.$t('deletePrompt.yesBtn')
            }).then(() => {
          }).catch(() => {
                this.templateVisible = true;
          this.getDataItem();
          });;
        }else{
            this.templateVisible = true;
          this.getDataItem();
        }
    },
    onChildValue (val) {
      if (this.active == this.numToActive.zero) {
        if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
          this.baseData.step2 = val.items;
          this.step2Html = val.html;
          this.step2FormSize = val.json.formSize;
        } else {
          this.baseData.step1 = val;
        }
      } else if (this.active == this.numToActive.one) {
        if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
          //第二步后，重置 查询配置、列表配置、合计配置
            this.baseData.step3 = [];
            // this.baseData.step4= {};
            this.baseData.step5= [];
            this.baseData.step1 = val;
            this.step2Html = home.methods.generateCode();
        } else {
          this.baseData.step2 = val.items;
          this.step2Html = val.html;
          this.step2FormSize = val.json.formSize;
        }
      } 
      else if (this.active == this.numToActive.five) {
        this.baseData.step6 = val;
        this.baseData.step6.formSize = this.step2FormSize;
        this.baseData.step6.codeSchemeId = this.step6_codeSchemeId;
      } else if (this.active == this.numToActive.seven) {
        this.baseData.step8 = val;
      }
    },
    handleClose () {
      this.templateVisible = false;
    },
    close(){
      this.$emit('close');
    },
    menuFormSubmit () {
      this.templateVisible = false;
    },
    getDataItem () {
      this.options = [];
      getDataItem('CodeSchemaType').then((res) => {
        if (res.data.success) {
          this.templateTypeTree = FormatTree(
              res.data.data,
              'F_ItemValue',
              'F_ItemName',
              'children'
          );
        }
      });
    },
    disposeDbTable (step1) {
      this.param.dbTable = [
        {
          name: step1[0].formName,
          pk: 'F_Id',
          parentName: 1,
          field: '',
          relationName: '',
          relationField: '',
          $index: 0,
        }
      ];
      step1.map((item, index) => {
        index > 1 && this.param.dbTable.push({
          name: item.formName,
          pk: 'F_Id',
          parentName: 0,
          field: '',
          relationName: `${this.param.dbTable[0].name}_${item.id}`,
          relationField: 'F_Id',
          $index: item.id,
        });
      });

      this.param.tableInfo = [];
      calleArr(step1);

      function calleArr (array) {
        for (const key in array) {
          if (key.dataChildren) {
            let arr = [];
            key.dataChildren.map(item => {
              arr.push({
                fieldName: item.fieldName || '',
                fieldType: item.dataType || '',
                fieldLength: item.langth || 50,
                description: item.description || '',
              });
              //   TODO 子节点处理
            });
            this.param.tableInfo.push({
              tableName: key.formName,
              tableDescription: '',
              columns: arr
            });
          }
        }
      }
    },
    async saveCodeScheme (formData) {
      this.templateLoading = true;
        this.menuForm = formData;
        if (this.baseData.step1.F_DbId)
            // localDB 默认本地数据库
          this.param.dbLinkId = this.baseData.step1.F_DbId || 'localDB';
        if (this.baseData.step1.list) this.param.dbTable = this.baseData.step1.list;
        if (this.baseData.step1 && (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2)) {
          const { step1 } = this.baseData;
          if(store.state.FD.controllerType === 1){//自定义表结构
            this.disposeDbTable(step1.list);
          }else{
            this.disposeDbTable(step1);
          }
        }
        if (this.baseData.step6) this.param.baseInfo = this.baseData.step6;
        if (this.baseData.step4) this.param.colData = this.baseData.step4;
        if (this.baseData.step2) this.param.formData = this.baseData.step2;
        if (this.baseData.stepConf) this.param.stepConf = this.baseData.stepConf;
        if (this.baseData.hideComponents) this.param.hideComponents = this.baseData.hideComponents;
        if (this.baseData.step3) this.param.queryData = this.baseData.step3;
        if (this.baseData.step5) this.param.totalData = this.baseData.step5;
        if (this.baseData.step8) this.param.moduleData = this.baseData.step8;
        if (this.baseData.step9) this.param.eventData = this.baseData.step9;
        if (this.baseData.step7) {
          this.baseData.step7.formHTML = this.step2Html;
          this.baseData.step7.formHTML.replace('<el-dialog v-dialogDrag v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">', '');
          this.baseData.step7.formHTML.replace(' </el-dialog dialogDelete>', '');

          this.param.codeContent = this.baseData.step7;
        }
        this.param.controllerType = store.state.FD.controllerType;//代码模板 保存controllerType 为了列表编辑进入
        this.menuForm.f_CodeSchema = JSON.stringify(this.param);
        this.menuForm.F_Type = store.state.FD.controllerType;
        if(store.state.FD.controllerType==3){
          //自定义表单 生成代码 获取类型
          this.menuForm.F_Type = store.state.FD.customControllerType;
        }
        let res = {data:{success:false}};
        if (this.menuForm.f_Id) {
          res =await updateCodeScheme(this.menuForm);
          
        } else {
           res = await saveCodeScheme(this.menuForm);
        }
        if(res&&res.data&&res.data.success){
            this.templateVisible = false;
            this.templateLoading = false;
            this.submitFinish();
        }
    },
    /**
     * 替换所生成的占位代码
     * 例如：代码预览的确定提交按钮
     *      所有配置的数据源或者数据字典的 请求地址
     */
    replaceFormHtml (html,createdStr,mountedStr,editStr,submitStr,submitFormEvent,isWorkflowForm=false,) {
      //去除占位
      html = html.replace(MESSAGE_REPLACE_STRING, '').replace(/__isEdit__/g, `v-if`).replace(/__isInput__/g, `v-show`).replace(/__disabled__/g, `:disabled="disabled"`).replace(/!'__disabled__'/g, `this.disabled`);
      html = html.replace(/__isDisabled__/g, `:disabled`);
      html = html.replace(/__isReadonly__/g, `:readonly`);
      html = html.replace(/__isWorkFlowFormInput__/g, `v-if`);
      html = html.replace(/__isOnlyLookInput__/g, `v-show`);
      //async
      //  html = html.replace(/__isWorkFlowFormInput__/g, `v-if`);
       html = html.replace(/\/\/_FORM_ADDRESS_URL_/g, `addressUrl:'${this.baseData.step6.name.toLowerCase()}'`);
      let reConfig = /\/\/FORM_CONFIG_START(.*\n)+?.*\/\/FORM_CONFIG_END/gm;
      html = html.replace(reConfig, ` return fieldsConfig();`);
      let reConfigMap = /\/\/FORM_CONFIG_MAP_START(.*\n)+?.*\/\/FORM_CONFIG_MAP_END/gm;
      html = html.replace(reConfigMap, ` return formFieldsMap();`);
      let reHideComponentsConfig = /\/\/FORM_HIDE_COMPONENTS_START(.*\n)+?.*\/\/FORM_HIDE_COMPONENTS_END/gm;
      html = html.replace(reHideComponentsConfig, ` return getHideComponents();`);

      html = html.replace(/\/\/__SUMIBTHANDLEMETHODS__/g, `
        //辅助提交 预留方法
        async handleSubmit() {
          await this.insertSubmitEvent();
        },
        //辅助工作流提交 预留方法
        getHandleSubmitFormEvent() {
            ${submitFormEvent}
        },
        //辅助工作流表单事件 判断 表单事件是否已经执行过
        getisExecutedFormEvent() {
            let key = 'index'+this.$store.state.formParser.workflowFormTabIndexKey;
            return this.$store.state.formParser.isExecutedFormEvent[key]?this.$store.state.formParser.isExecutedFormEvent[key]:false;
            
        },
      `);
      html = html.replace(
          SUBMIT_REPLACE_STRING,
          `
        //如果没有传入参数就是新增
        if (!this.keyValue) {

          request({
            url: baseUrl + "/"+this.addressUrl,
            method: "post",
            data : newObj
          }).then((res) => {
            this.submitLoading = false;
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
            });
             this.$emit("onChange",true)
          });

        }
        else{

         request({
            url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
            method: "put",
            data : newObj
          }).then((res) => {
            this.submitLoading = false;
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
            });
             this.$emit("onChange",true)
          });

        }
       
       `
      );

      html = html.replace(/\/\/FORM_EVENT_SUBMIT/g, `
      await this.handleSubmit();`);
       html = html.replace(/\/\/FORM_EVENT_CREATED/g, createdStr);
       html = html.replace(/\/\/FORM_EVENT_MOUNTED/g, mountedStr);
       html = html.replace(/\/\/FORM_EDIT_STR/g, editStr);
      html = html.replace(/\/\/FORM_SUBMIT_STR/g, submitStr);
       html = html.replace(/\/\/__WORKFLOWFORMHANDLEMETHODS__/g, `
          //辅助编辑 预留方法
          async handleEdit() {
            await this.insertEditEvent();
          },
          `);

      if(isWorkflowForm){
          html = html.replace(/__VIFISWORKFLOWFORM__/g, `v-if="!isWorkflowForm"`);
          
         html = html.replace(
          EXPORT_REPLACE_STRING, `
        import workflowFormAuthorize from "@/mixins/workflowFormAuthorize";
        import authorizeMixin from "@/mixins/authorize";
        import nodeMsgMixin from "@/mixins/nodeMsg";
        import { baseUrl } from "@/config/env";
        import request from "@/router/axios";
        import {fieldsConfig,formFieldsMap,getHideComponents} from './${this.baseData.step6.name}Config';
        import { formValidateNotice } from '@/util/util';		
        import store from "@/store";
        import hideComponentsMixin from "@/mixins/hideComponents"; // 隐藏组件
        export default {
          mixins: [authorizeMixin,workflowFormAuthorize,nodeMsgMixin,hideComponentsMixin],
       `
      );
      }else{
         html = html.replace(/__VIFISWORKFLOWFORM__/g, ``);
         html = html.replace(
          EXPORT_REPLACE_STRING, `
        import authorizeMixin from "@/mixins/authorize";
        import { baseUrl } from "@/config/env";
        import request from "@/router/axios";
         import {fieldsConfig,formFieldsMap,getHideComponents} from './${this.baseData.step6.name}Config'
		import { formValidateNotice } from '@/util/util';
        export default {
          mixins: [authorizeMixin],
       `
      );
      }
     

      html = html.replace(
          CREATEED_REPLACE_STRING,
          `
           if(this.keyValue){
              this.isAdd = false;
          }
           if(!this.isAdd&&this.keyValue){
              this.operationVal = 'edit';
              try {
                let res = await request({
                  url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
                  method: "get",
                });
                  ${this.formatResult(this.param.dbTable)}
                  await this.handleEdit();
                 this.showFormKey++;
              } catch (error) {
              }
          }

       `
      );
      html = html.split(`'${baseUrl}`).join(` baseUrl + '`);
      

      return html;
    },
    getFormConfigJs(html){

    let reConfig = /\/\/FORM_CONFIG_START(.*\n)+?.*\/\/FORM_CONFIG_END/gm;
    let config = html.match(reConfig);
    let configHtml = 'return {};';
    if(config&&config.length>0){
      configHtml = config[0].replace(/\/\/FORM_CONFIG_START/g, ``).replace(/\/\/FORM_CONFIG_END/g, ``);
    }
    let reConfigMap = /\/\/FORM_CONFIG_MAP_START(.*\n)+?.*\/\/FORM_CONFIG_MAP_END/gm;
    let configMap = html.match(reConfigMap);
    let configMapHtml = 'return new Map();';
    if(configMap&&configMap.length>0){
      configMapHtml = configMap[0].replace(/\/\/FORM_CONFIG_MAP_START/g, ``).replace(/\/\/FORM_CONFIG_MAP_END/g, ``);
    }
    let reHideComponentsConfig = /\/\/FORM_HIDE_COMPONENTS_START(.*\n)+?.*\/\/FORM_HIDE_COMPONENTS_END/gm;
    let configHideComponents = html.match(reHideComponentsConfig);
    let configHideComponentsHtml = 'return [];';
    if(configHideComponents&&configHideComponents.length>0){
      configHideComponentsHtml = configHideComponents[0].replace(/\/\/FORM_HIDE_COMPONENTS_START/g, ``).replace(/\/\/FORM_HIDE_COMPONENTS_END/g, ``);
    }

      return `
      export const fieldsConfig =()=>{
          ${configHtml}
        }
        export const formFieldsMap = ()=>{
           ${configMapHtml}
        }
        export const getHideComponents = ()=>{
           ${configHideComponentsHtml}
        }
      `;
    },
        getFormEventHtml(nodes,nodeType){
          let header =' let nodeMsgs = [];';
      let str  = '';
      let nodeLogArr = [];
       nodes.forEach((ele,nodeIndex) => {
          if(ele.triggerEventData&&ele.triggerEventData.length>0){
            let nodeName = ele.info.nodeName?ele.info.nodeName:'自定义节点';
             let nodeLog = ele.info.nodeLog;
            if (nodeLog)  {
              nodeLogArr.push(ele);
              str += `nodeMsgs.push(this.getStartNodeMsg('${nodeName}'));`;
            }
           ele.triggerEventData.forEach((config,nodeIndex2) => {
             str += this.buildDicApiMethod(config,nodeIndex,nodeIndex2,nodeLog,nodeName,nodeType);
           });
            if (nodeLog) {
               str += `nodeMsgs.push(this.getEndNodeMsg('${nodeName}'));`;
            }
         }
       });
       if(nodeLogArr.length>0){
         str += `
          if(nodeMsgs.length>0){
            this.insertSystemJournal('${nodeType}',nodeMsgs);
          }
        `;
       }
       if(str){
         str = header+str;
       }
       return str;
    },
    getFormEventConfigs(nodes){

      let paramStr = `
             let FormName = this.addressUrl;
            `;
      let arrStr  = '[';
      nodes.forEach((ele,nodeIndex) => {
        if(ele.triggerEventData&&ele.triggerEventData.length>0){
         
          let nodeName = ele.info.nodeName?ele.info.nodeName:'自定义节点';
          let nodeLog = ele.info.nodeLog;
          if(nodeLog){
            arrStr += `{
                nodeName:'${nodeName}',
                status:2,//0 失败 1 成功 2 标记开始 3 标记结束 4 待执行api
                msg:'开始',
                nodeLog:${nodeLog},
              },`;
            }
          ele.triggerEventData.forEach((config,nodeIndex2) => {
            let {arr,param} = this.buildDicApiConfig(config,nodeIndex,nodeIndex2);
             paramStr +=param;
               arrStr += `{
                nodeName:'${nodeName}',
                F_UrlAddress:'${config.apiConfig.F_UrlAddress}',
                id: '${config.apiConfig.id}',
                type: ${config.apiConfig.type},
                status:4,//待执行api
                msg:'',
                nodeLog:${nodeLog},
                config:${arr}
              },`;
          });
          if(nodeLog){
            arrStr += `{
                nodeName:'${nodeName}',
                status:3,
                msg:'结束',
                nodeLog:${nodeLog},
              },`;
          }
        }
      });
      arrStr += ']';
      return `${paramStr}
      return {
        type:2,
        FormName,
        FormId:FormName,
        nodeType:'submit',
        apiJournal:${arrStr}
      }
      ;`;
    },
    getApiParams(element) {
      let params = `''`;
      if (element.paramType == "formData") {
        if (element.params.id) {
          if(typeof element.params.id=='string'&&element.params.id.includes('current-')){
            if (element.params.id == "current-userId") {
            params = ` this.userInfo['F_UserId']?this.userInfo['F_UserId']:''`;
          } else if (element.params.id == "current-token") {
            params = ` localStorage.getItem("avue-token") ? JSON.parse(localStorage.getItem("avue-token"))
        .content : ''`;
          } else if (element.params.id == "current-postId") {
            params = ` this.userInfo['F_Post'] && this.userInfo['F_Post'].length > 0
        ? this.userInfo['F_Post'][0].F_PostId
        : ''`;
          } else if (element.params.id == "current-roleId") {
            params = ` this.userInfo['F_Role'] && this.userInfo['F_Role'].length > 0
        ? this.userInfo['F_Role'][0].F_RoleId
        : ''`;
          } else if (element.params.id == "current-companyId") {
            params = ` this.userInfo['F_Company']?this.userInfo['F_Company'].F_CompanyId:''`;
          } else if (element.params.id == "current-departmentId") {
            params = ` this.userInfo['F_Department'] && this.userInfo['F_Department'].length > 0
        ? this.userInfo['F_Department'][0].F_DepartmentId
        : ''`;
          }
          }else if(typeof element.params.id=='string'&&element.params.id.includes('hideComponents')){
            params = `this.getHideComponentsMapItem('${element.params.id}')`;
            }else {
              if(element.params.id){
                 params = ` this.formFieldsMap.has(${element.params.id})?
        (this.formFieldsMap.get(${element.params.id}).__vModel__?this.formData[this.formFieldsMap.get(${element.params.id}).__vModel__]:'')
        :''`;
              }else{
                params = `''`;
              }
           
          }
        }
      } else {
        if(element.F_ParamValue){
          params  = `'${element.F_ParamValue}'`
        }else{
          params  = `''`
        }
      }
      return params;
    },
    buildApiOutputs(nodeType,nodeIndex,nodeIndex2,outputs){
        let str = ``;
       if(outputs&&outputs.length>0){
          outputs.forEach(element => {
            if(element.formId&&element.outputKey){
              str += `this.setOutputsValue('${nodeType}',${element.formId},res${nodeIndex}${nodeIndex2},'${element.outputKey}');
                 `;
            }
          });
        }
        return str;
    },
    buildDicApiMethod(config,nodeIndex,nodeIndex2,nodeLog,nodeName,nodeType) {
      let urlDic = `${baseUrl}${config.apiConfig.url}`;
      let methodTypeName = 'POST';
      // 接口参数类型 0 是 header  1 是body   2是queryString（请求方式如果是get  没有body  类型也是1  默认拼接参数到url）
      let urlParamStr = "";
      let paramsStr = "";
      let bodyStr = "";
      let headerStr = "";
      let urlParam  = '';
      let outputStr = '';
      if (config.apiConfig.apiInputParams.length > 0) {
        for (
          let index = 0;
          index < config.apiConfig.apiInputParams.length;
          index++
        ) {
          let element = config.apiConfig.apiInputParams[index];
          if (element.F_Type == 0 && element.F_ParamKey) {
            //header
            headerStr += `'${element.F_ParamKey}' : ${this.getApiParams(element)},`;
          }
          if (element.F_ParamKey) {
            if (element.F_Type == 1) {
                bodyStr += `'${element.F_ParamKey}' : ${this.getApiParams(
                  element
                )},`;
              } else if (element.F_Type == 2) {
                   let key = `url${nodeIndex}Param${nodeIndex2}Index${index}${element.F_ParamKey}`;
                  let val = `${this.getApiParams(
                  element
                )}`;
                  urlParam += `let ${key}=${val};`;
                  urlParamStr  += `${element.F_ParamKey}=`+`'+${key}+'`+'&';// 拼接到url
              }
          }
        }
      }
      if (config.apiConfig.outputs&&config.apiConfig.outputs.length > 0) {
        outputStr = this.buildApiOutputs(nodeType,nodeIndex,nodeIndex2,config.apiConfig.outputs)
      }
      if (urlParamStr) {
        urlDic += `?${urlParamStr}`;
      }
      let headers = ``;
      if (headerStr) {
        headers = `headers:{
      ${headerStr}
    },`;
      }
      let params = ``;
      if (paramsStr) {
        params = `
    params : {
      ${paramsStr}
    },`;
      }
      let bodys = ``;
      if (bodyStr) {
        bodys = `
    data : {
      ${bodyStr}
    },`;
      }else{
         bodys = `
        data : {},`;
      }
      urlDic = `'${urlDic}'`;
    return   `${urlParam}  try {
      let res${nodeIndex}${nodeIndex2} = await  this.$axios({
        method: '${methodTypeName}',
        url: ${urlDic},
        ${headers}
        ${params}
        ${bodys}
      })
      ${outputStr}
      ${nodeLog?`nodeMsgs.push(this.getNodeMsgs(res${nodeIndex}${nodeIndex2}, '${nodeName}', "${config.apiConfig.F_UrlAddress}","${config.apiConfig.id}", "${config.apiConfig.type}"))`:''}
      
    } catch (error) {
      ${nodeLog?`nodeMsgs.push(this.getNodeMsgs(error, '${nodeName}', "${config.apiConfig.F_UrlAddress}","${config.apiConfig.id}", "${config.apiConfig.type}"))`:''}
    }
      `;
    },
    buildDicApiConfig(config,nodeIndex,nodeIndex2) {
      let urlDic = `${baseUrl}${config.apiConfig.url}`;
      let methodTypeName = 'POST';
      // 接口参数类型 0 是 header  1 是body   2是queryString（请求方式如果是get  没有body  类型也是1  默认拼接参数到url）
      let urlParamStr = "";
      let paramsStr = "";
      let bodyStr = "";
      let headerStr = "";
      let urlParam  = '';
      if (config.apiConfig.apiInputParams.length > 0) {
        for (
          let index = 0;
          index < config.apiConfig.apiInputParams.length;
          index++
        ) {
          let element = config.apiConfig.apiInputParams[index];
          if (element.F_Type == 0 && element.F_ParamKey) {
            //header
            headerStr += `'${element.F_ParamKey}' : ${this.getApiParams(element)},`;
          }
          if (element.F_ParamKey) {
            if (methodTypeName == "GET") {
              if (element.F_Type == 1) {
                paramsStr += `'${element.F_ParamKey}' : ${this.getApiParams(
                  element
                )},`;
              } else if (element.F_Type == 2) {
                paramsStr += `'${element.F_ParamKey}' : ${this.getApiParams(
                  element
                )},`;
              }
            } else {
              if (element.F_Type == 1) {
                bodyStr += `'${element.F_ParamKey}' : ${this.getApiParams(
                  element
                )},`;
              } else if (element.F_Type == 2) {
                 let key = `url${nodeIndex}Param${nodeIndex2}Index${index}${element.F_ParamKey}`;
                  let val = `${this.getApiParams(
                  element
                )}`;
                  urlParam += `let ${key}=${val};`;
                  urlParamStr  += `${element.F_ParamKey}=`+`'+${key}+'`+'&';// 拼接到url
              }
            }
          }
        }
      }
      if (urlParamStr) {
        urlDic += `?${urlParamStr}`;
      }
      let headers = ``;
      if (headerStr) {
        headers = `headers:{
      ${headerStr}
    },`;
      }
      let params = ``;
      if (paramsStr) {
        params = `
    params : {
      ${paramsStr}
    },`;
      }
      let bodys = ``;
      if (bodyStr) {
        bodys = `
    data : {
      ${bodyStr}
    },`;
      }else{
         bodys = `
        data : {},`;
      }
      urlDic = `'${urlDic}'`;
    return {arr:`{
        method: '${methodTypeName}',
        url: ${urlDic},
        ${headers}
        ${params}
        ${bodys}
      },`,param:urlParam}  ;
    },
    formatResult (dbTable) {
      let formatString = this.arrayFormatString(this.param.formData, dbTable);

      let resStr = '';
      dbTable.forEach((element) => {
        //如果是主表  默认是Entity
        if (element.parentName === 1) {
          if (dbTable.length > 1) {
            resStr += `
            this.formData = res.data.data.${element.name}
            `;
          } else {
            resStr += `
            this.formData = res.data.data
            `;
          }
        } else {
          resStr += `
          this.${element.name}.${element.name} = res.data.data.${element.name}
          `;
        }
      });
      return resStr + formatString;
    },
    arrayFormatString (arry, dbTable) {
      let formatString = ``;

      //如果是第一级  就是主表的组件 主表的组件 不需要循环  如果是第二季 代表是子表单的，  子表单 需要循环遍历所有数据 格式化
      arry.forEach((item) => {
        if (
            (item.__config__.tag === 'el-checkbox-group' &&
            item.__config__.avueType === 'checkbox') ||
            (item.__config__.tag === 'el-time-picker' &&
            item.__config__.avueType === 'timerange') ||
            (item.__config__.tag === 'el-date-picker' &&
            item.__config__.avueType === 'daterange') ||
            (item.__config__.tag === 'xjr-cascader' &&
            item.__config__.avueType === 'cascader')
        ) {
          if (dbTable.length > 1) {
            formatString += `
            if(res.data.data.${item.__config__.bindTable}.${item.__config__.bindTableField}){
              this.formData.${item.__config__.bindTableField} = res.data.data.${item.__config__.bindTable}.${item.__config__.bindTableField}.split(',')
            }else{
              this.formData.${item.__config__.bindTableField} = [];
            }
            `;
          } else {
            formatString += `
            if(res.data.data.${item.__config__.bindTableField}){
                this.formData.${item.__config__.bindTableField} = res.data.data.${item.__config__.bindTableField}.split(',')
            }else{
              this.formData.${item.__config__.bindTableField} = [];
            }
            `;
          }
        } else {
			if(item.__config__.avueType=='mutiple-popup'||item.__config__.avueType=='asso-popup'){
				let config=JSON.stringify(item.__config__)
				formatString += `
				if(this.formData.${item.__config__.bindTableField}){
					this.$set(this.formData,'${item.__config__.bindTableField}_showValue',this.formData.${item.__config__.bindTableField})
          let config=this.autoHandlerClickConfig(${item.__config__.formId});
				  this.getMutipleAllData(this.formData,config,'${item.__vModel__}',${item.__config__.formId});
				}
				`;
			}
          if (item.__config__.componentName === 'table') {
            //如果有下级   比如子组件里面又
            if (item.__config__.children) {
              formatString += this.childFormatString(
                  item.__config__.bindTable,
                  item.__config__.children
              );
            }
          }else if(item.__config__.componentName == 'avue-tabs'){
            let childrenObj = item.__config__.childrenObj || null;
            if(!childrenObj) return;
            for(let key in childrenObj){
              let children = childrenObj[key];
              if(children && children.length){
                 formatString += this.arrayFormatString(children,dbTable);
              }
            }


          }
        }
      });

      return formatString;
    },
    childFormatString (bindTable, children) {
      //如果是第一级  就是主表的组件 主表的组件 不需要循环  如果是第二季 代表是子表单的，  子表单 需要循环遍历所有数据 格式化
      let formatString = `
        this.${bindTable}.${bindTable}.forEach(element => {`;

      children.forEach((item) => {
         if (
            (item.__config__.tag === 'el-checkbox-group' &&
            item.__config__.avueType === 'checkbox') ||
            (item.__config__.tag === 'el-time-picker' &&
            item.__config__.avueType === 'timerange') ||
            (item.__config__.tag === 'el-date-picker' &&
            item.__config__.avueType === 'daterange') ||
            (item.__config__.tag === 'xjr-cascader' &&
            item.__config__.avueType === 'cascader')
        )  {
          formatString += `
            if(element.${item.__config__.bindTableField}){
             element.${item.__config__.bindTableField} = element.${item.__config__.bindTableField}.split(',')
            }
              `;
        }
      });

      formatString += `
      });
      `;

      return formatString;
    },
  },
};
</script>

<style scoped>
.main-container {
  height: 100%;
}

div /deep/ .TlabelStyle label.el-form-item__label{
	margin-left: -20px;
	width: 120px !important;
}

.content {
  padding: 4px 10px 0 10px;
  background-color: #eeeeee;
  height: calc(100% - 62px);
}
.form {
  background-color: #fff;
  height: 100%;
}
</style>
