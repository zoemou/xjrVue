<template>
  <div class="code-build-box" v-if="dialogVisible">
    <Header
      :controllerType="controllerType"
      :type="1"
      :active="newActive"
      @close="dialogVisible = false"
      @prev="prev"
      @next="next"
      @codeFormSubmit="submitBtn"
    ></Header>
    <div class="content">
      <div class="form">
        <component
          :is="getComponent"
          ref="steps"
          :menuForm.sync="menuForm"
          :categoryList="categoryList"
          :baseData="baseData"
          @onChange="onChildValue"
          @checkMenuForm="checkMenuForm"
        />
      </div>
    </div>
    <TableListDialog  v-if="tableListVisible" :isEdit="editOldDbId?true:false"  :baseData="baseData" @close="closeTableList"></TableListDialog>
  </div>
</template>
<script>
import Header from "@/views/QuickDevelopment/codeHeader/Index.vue";
import Basic from "./design/Basic.vue";
import {
  addFormScheme,
  getFormSchemeInfo,
  updateFormScheme
} from "@/api/code/form";
import { getDataItem } from "@/api/system/dataitem";
import DataTableSettings from "@/views/QuickDevelopment/Code/CodeStepOne";
import FormEvent from "@/views/QuickDevelopment/Code/FormEvent";
import FormPage from "@/views/QuickDevelopment/Code/CodeStepTwo";
import TableStructurete from "@/views/QuickDevelopment/Code/CodeStepTwoListStructure";
import store from "@/store";
import { FormDesignMixin } from "@/mixins/FormDesign/configFn";
import TableListDialog from '@/views/QuickDevelopment/Code/TableListDialog.vue';
export default {
    mixins:[FormDesignMixin],
  components: {
    Header,
    Basic,
    DataTableSettings,
    FormPage,
    FormEvent,
    TableStructurete,
    TableListDialog
  },
  inject: ["newActive", "F_Id"],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    designData: {
      type: Object,
      default() {
        return {};
      }
    },
    controllerType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: null,
      menuForm: {
        F_Category: "",
        F_Name: ""
      },
      categoryList: [],
      baseData: {
        step1: {
          F_DbId: "",
          list: []
        },
        step2: [],
        stepConf:{},
        hideComponents:[],
        step9:[]//表单事件
      },
      formDesignJson: {},
      datum: [],
      arr: [],
      param: {},
      basicFormFinish: false,
      editOldDbId: "",
      editOldDbTableNames: [],
      tableProcessingSucceeded:false,
      tableListVisible:false,
       notifyIndex:1
    };
  },
  created() {
    if (this.designData.SchemeInfo) {
      this.menuForm = this.designData.SchemeInfo;
      this.basicFormFinish = true;
      let scheme = JSON.parse(this.designData.Scheme.F_Scheme);

      this.baseData.step1.F_DbId = scheme.dbLinkId;
       this.baseData.step9 = scheme.eventData?scheme.eventData:[];
      if (scheme.dbLinkId) {
        this.editOldDbId = scheme.dbLinkId;
      }
      this.baseData.dbTable = scheme.dbTable;
      this.baseData.step1.list = scheme.dbTable;
      if (scheme.dbTable.length > 0) {
        this.editOldDbTableNames = scheme.dbTable.map(ele => {
          return ele.name;
        });
      }
      let {fields,...otherConf} = scheme.data;
      if(scheme.data.hideComponents&&scheme.data.hideComponents.length>0){
        let {hideComponents,...other} = otherConf;
         this.baseData.hideComponents = hideComponents;
        this.baseData.stepConf = other;
      }else{
        this.baseData.stepConf = otherConf;
      }
      this.baseData.step2 = scheme.data?.fields || [];
      
    }
    this.getDataItem("FormSort");
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    basicFormBtnDisable() {
      if (this.newActive == 0) {
        return !this.basicFormFinish;
      } else {
        return false;
      }
    },
    getComponent() {
      if (this.newActive === 0) {
        return "Basic";
      } else if (this.newActive === 1 && this.controllerType === 0) {
        return "DataTableSettings";
      } else if (
        (this.newActive === 3 && this.controllerType === 0)||
        (this.newActive === 2 && this.controllerType === 1)||
        (this.newActive === 2 && this.controllerType === 2)
      ) {
         // 表单事件
        return "FormEvent";
      } else if (this.newActive === 3 && this.controllerType === 1) {
        return "TableStructurete";
      } else if (
        (this.newActive === 2 && this.controllerType === 0) ||
        (this.newActive === 1 && this.controllerType === 1) ||
        (this.newActive === 1 && this.controllerType === 2)
      ) {
        return "FormPage";
      }
    }
  },
  methods: {
    getDataItem(code) {
      getDataItem(code).then(res => {
        this.categoryList = res.data.data;
      });
    },
    handleClose() {
      this.baseData = {
        step1: {
          F_DbId: "",
          list: []
        },
        step2: []
      };
      this.menuForm = {
        F_Category: ""
      };
      //删除兼容样式类
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      this.dialogVisible = false;
    },
    getRandowNum() {
      return Math.floor(Math.random() * (100000000000000000000 - 1000)) + 1000;
    },
    initcontrollerTypeTwoDamu(){
      let mainTable = "table" + +this.getRandowNum();
      this.datum = [
        {
          id: 1,
          formName:mainTable ,
          $cellEdit: true,
          dataChildren: []
        }
      ];
      let doNotGenerateTags = ["h2", "el-divider", "xjr-opinion-comonent"];
      this.baseData.step2 = this.baseData.step2.map((item, index) => {
        //子表单
        if (
          item.__config__.children &&
          item?.__config__?.componentName == "table"
        ) {
          let formName = "table" + this.datum.length + +this.getRandowNum();
          let dataChildren = [];
          item.__config__.bindTable = formName;
          if(item.__config__.children&&item.__config__.children.length>0){
            item.__config__.children = item.__config__.children.map(element => {
              let res = this.fieldConfig(element);
              element.__config__.bindTable = formName;
              element.__config__.bindTableField = res.fieldName;
              dataChildren.push(res)
              return element;
            });
          }
          this.datum.push({
            id: this.datum[this.datum.length - 1].id + 1,
            formName: formName,
            dataChildren: dataChildren,
            describe: item.__config__.label,
            formId: item.__config__.formId,
            fieldLength: item.__config__.fieldLength,
            componentName: item.__config__.componentName || "",
            $cellEdit: true
          });
            
          
        }else if (item?.__config__?.componentName == "avue-tabs") {
            let childrenObj = item?.__config__?.childrenObj || {};

            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
              let children = childrenObj[key] || [];
              item.__config__.childrenObj[key] = children.map(item2 => {
                if (item2?.__config__?.componentName == "table") {
                  //子表单
                  let formName = "table" + this.datum.length + +this.getRandowNum();
                  let dataChildren = [];
                  item2.__config__.bindTable = formName;
                  if(item2.__config__.children&&item2.__config__.children.length>0){
                    item2.__config__.children = item2.__config__.children.map(element => {
                       let res = this.fieldConfig(element);
                        element.__config__.bindTable = formName;
                        element.__config__.bindTableField = res.fieldName;
                      dataChildren.push(res)
                      return element;
                    });
                  }
                  this.datum.push({
                    id: this.datum[this.datum.length - 1].id + 1,
                    formName: formName,
                    dataChildren: dataChildren,
                    describe: item2.__config__.label,
                    formId: item2.__config__.formId,
                    fieldLength: item2.__config__.fieldLength,
                    componentName: item2.__config__.componentName || "",
                    $cellEdit: true
                  });
                } else {
                  let dataChildren = [];
                  
                  if (!doNotGenerateTags.includes(item2.__config__.tag)) {
                    let res = this.fieldConfig(item2);
                    item2.__config__.bindTable = mainTable;
                    item2.__config__.bindTableField = res.fieldName;
                    dataChildren.push(res);
                  }
                  this.datum[0].dataChildren.push(...dataChildren);
                }
                return item2;
              });
            }
            }
            

          } else {
             let dataChildren = [];
            if (!doNotGenerateTags.includes(item.__config__.tag)) {
              let res = this.fieldConfig(item);
               item.__config__.bindTable = mainTable;
               item.__config__.bindTableField = res.fieldName;
              dataChildren.push(res);
            }
             this.datum[0].dataChildren.push(...dataChildren);
        }
        return item;
      });
    },
    onChildValue(val) {
      if (this.newActive === 1 && this.controllerType === 0) {
        this.baseData.step1.F_DbId = val.F_DbId;
        this.baseData.step1.list = val.list;
      } else if (this.newActive === 2 && this.controllerType === 0) {
        this.baseData.step2 = val.items;
        this.formDesignJson.data = val.json;
      }

      if (this.newActive === 1 && this.controllerType === 1) {
        this.baseData.step2 = val.items;
        this.formDesignJson.data = val.json;
      } else if (this.newActive === 3 && this.controllerType === 1) {
        this.baseData.step1 = val;
      }

      if (this.newActive === 1 && this.controllerType === 2) {
        this.baseData.step2 = val.items;
        this.formDesignJson.data = val.json;
        this.initcontrollerTypeTwoDamu();

          // this.processorDatum();
          store.state.FD.DbLinkId = "localDB";
          store.state.FD.formData.fields = this.baseData.step2;
          this.baseData.step1 = this.datum;

      }
    },
    getFieldConfigByTabs(childrenObj) {
      let arr = [];
      let doNotGenerateTags = ["h2", "el-divider", "xjr-opinion-comonent"];
      if (JSON.stringify(childrenObj) == "{}") return;
      for (let key in childrenObj) {
        let children = childrenObj[key] || [];
        children.map(item => {
          if (item?.__config__?.componentName == "table") {
            this.setChildTableConf(item);
          } else {
            if (!doNotGenerateTags.includes(item.__config__.tag)) {
              arr.push(this.fieldConfig(item));
            }
          }
        });
      }
      return arr;
    },
    setChildTableConf(item) {
      const { datum } = this;
      this.arr = [];
      this.calleArr(item);
      this.datum.push({
        id: datum[datum.length - 1].id + 1,
        formName: "table" + datum.length + this.getRandowNum(),
        dataChildren: this.arr,
        describe: item.__config__.label,
        formId: item.__config__.formId,
        fieldLength: item.__config__.fieldLength,
        componentName: item.__config__.componentName || "",
        $cellEdit: true
      });
    },
    calleArr(array) {
      for (let index in array) {
        let data = array[index];
        if (data.children) {
          data.children.map(i => {
            this.arr.push(this.fieldConfig(i));
            i.__config__.children && this.calleArr(i.__config__.children);
          });
        } else {
          data.__config__ &&
            this.arr.push(this.fieldConfig(data));
        }
      }
    },
    processorDatum() {
      const {
        datum,
        baseData: { step2, step1 }
      } = this;
      datum.map((father, index) => {
        father.dataChildren.map((v, i) => {
          this.setFiledConf(step2, father, v);
        });
      });
    },
    setFiledConf(step2, father, v) {
      step2.map(item => {
        if (item?.__config__?.componentName == "table") {
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
        } else if (item?.__config__?.componentName == "avue-tabs") {
          let childrenObj = item?.__config__?.childrenObj || null;
          this.processorDatumByTabs(childrenObj, father, v);
        } else {
          return (
            item.__config__.formId === v.formId &&
            ((item.__config__.bindTable = this.datum[0]?.formName),
            (item.__config__.bindTableField = v.fieldName),
            (item.__config__.bindTableFieldType = v.dataType),
            (item.__config__.fieldLength = v.fieldLength),
            (item.__vModel__ = v.fieldName))
          );
        }
      });
    },
    processorDatumByTabs(childrenObj, father, v) {
      if (!childrenObj) return;
      for (let key in childrenObj) {
        let children = childrenObj[key] || [];
        children.map(item => {
          if (item?.__config__?.componentName == "table") {
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
          } else {
            item.__config__.bindTable = this.datum[0]?.formName;
            item.__config__.bindTableField = v.fieldName;
            return (
              item.__config__.formId === v.formId &&
              ((item.__config__.bindTable = this.datum[0]?.formName),
              (item.__config__.bindTableField = v.fieldName),
              (item.__config__.bindTableFieldType = v.dataType),
              (item.__config__.fieldLength = v.fieldLength),
              (item.__vModel__ = v.fieldName))
            );
          }
        });
      }
    },
    prev() {
      if (this.controllerType === 2) this.newActive = 0;
      --this.newActive < 0 && (this.newActive = 0);
      if (this.controllerType === 1 || this.controllerType === 2) {
        this.stepTwo = true;
        // this.$refs["steps"].processorDatum();
      }
    },
    next() {
      if(
        (this.newActive==2&&this.controllerType==0)||
         (this.newActive==1&&this.controllerType==1)||
          (this.newActive==1&&this.controllerType==2)
      ){
        //表单数据检查
        let validate = this.validateFormData();
        if(!validate)return;
        // 隐藏组件 数据检查
        let validateHide = this.validateHideComponents();
        if(!validateHide)return;
      }
      if (this.newActive === 0) {
        //手动校验 必填规则
        if (!this.menuForm.F_Name) {
          this.$message({
            type: "error",
            message: this.$t("custmerForm.classifiedManagement.Hint.formName")
          });
          return;
        }
        if (!this.menuForm.F_Category) {
          this.$message({
            type: "error",
            message: this.$t("formDesign.placeholderSelectSort")
          });
          return;
        }
        this.newActive++;
        // if (this.controllerType === 2) this.newActive = 2;
      } else {
        // 表单事件
        if(
           (this.newActive === 3&&this.controllerType==0)||
          (this.newActive === 2&&this.controllerType==1)||
          (this.newActive === 2&&this.controllerType==2)
        ){
           this.newActive++;
        }else{
          let validate = this.$refs["steps"].validateData();
        if (validate) {
          let primaryTableComponents = this.$store.state.FD
            .primaryTableComponents;
          let needCheck = false;
          // 自定义表结构 （下一步） 校验表单设计关联组件
          if (this.controllerType == 1 && this.newActive == 1) {
            needCheck = true;
          }
          if (needCheck && primaryTableComponents.length < 1) {
            this.$confirm(
              this.$t("formDesign.Hint.tableStructureNext"),
              this.$t("deletePrompt.promptTitle"),
              {
                confirmButtonText: this.$t("buttonModule.modalSureBtn"),
                cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
                type: "warning"
              }
            )
              .then(() => {
                // 确定
                this.$store.commit("SET_PRIMARY_TABLE_COMPONENTS", []);
                if (this.controllerType === 2) {
                  this.newActive = 2;
                } else {
                  this.newActive++;
                }
              })
              .catch(() => {
                // 取消
              });
          } else {
            if (this.controllerType === 2) {
              this.newActive = 2;
            } else {
              this.newActive++;
            }
          }
        }
        }
        
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
              this.notifyError(this.$t(msg)+this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentAssignmentCannotBeEmpty'));
              verificationFailed = true;
            }
          }else if(element.type=="sql"){
            if(element.sqlConfig.sql===""){
              this.notifyError(this.$t(msg)+this.$t('the')+this.$t('【'+mesIndex+'】')+this.$t('componentsComponentAssignmentCannotBeEmpty'));
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
    checkMenuForm() {
      if (this.menuForm.F_Name && this.menuForm.F_Category) {
        this.basicFormFinish = true;
      } else {
        this.basicFormFinish = false;
        if (!this.menuForm.F_Name) {
          // this.$message({type:'error',message:'请填写表单名称'});
        }
        if (!this.menuForm.F_Category) {
          // this.$message({type:'error',message:'请选择表单分类'});
        }
      }
    },
    editForm({ F_Id }) {
      this.dialogVisible = true;
      getFormSchemeInfo(F_Id).then(({ data: { data, code } }) => {
        if (code) return;
        this.menuForm = data.SchemeInfo;
        let scheme = JSON.parse(data.Scheme.F_Scheme);

        this.baseData.step1.F_DbId = scheme.dbLinkId;
        this.baseData.step1.list = scheme.dbTable;
        this.baseData.step2 = scheme.data.fields || [];
      });
      this.newActive = 0;
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
        this.submitBtn();
      }
    },
    async submitBtn() {
      this.loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let res = false;
      if(this.controllerType==2||this.controllerType==0){
        res = true;
      }else{
        res = this.$refs["steps"].validateData();
      }
      if (res) {
        let needCheck = false; //是否要验证 是否包含主表字段组件
        // 保存代码生成器一致格式
        if (this.controllerType === 0) {
          needCheck = true;
          this.baseData.step1.F_DbId &&
            (this.formDesignJson.dbLinkId = this.baseData.step1.F_DbId);
          this.baseData.step1.list &&
            (this.formDesignJson.dbTable = this.baseData.step1.list);
        }
        let json = this.formDesignJson;
        this.menuForm.F_UrlAddress = "";
        let baseInfoForm = {};
        json.eventData = this.baseData.step9;
        if (this.controllerType === 1) {
          needCheck = false;
          // 数据表处理 (界面优先)
          if(this.controllerType==1&&this.tableProcessingSucceeded==false){
            this.loading.close();
            this.openTableList();
            return false;
          }
          this.disposeDbTable(this.baseData.step1.list);
          baseInfoForm.tableInfo = this.baseData.step1.list;
          json.dbTable = this.param.dbTable;
          json.dbLinkId = this.$store.state.FD.DbLinkId;
        } else if (this.controllerType === 2) {
          needCheck = true;
          this.disposeDbTable(this.baseData.step1);
          baseInfoForm.tableInfo = this.baseData.step1;
          json.dbTable = this.param.dbTable;
          json.dbLinkId = "localDB";
        }

        baseInfoForm.scheme = {
          F_Type: this.controllerType,
          F_Scheme: JSON.stringify(json)
        };
        baseInfoForm.schemeInfo = this.menuForm;
        baseInfoForm.schemeInfo.F_Type = "0"; //后端需要传值（判断自定义表单和其他表单）
        let primaryTableComponents = this.$store.state.FD
          .primaryTableComponents;
        if (needCheck && primaryTableComponents.length < 1) {
          this.$confirm(
            this.$t("formDesign.Hint.tableStructureComplete"),
            this.$t("deletePrompt.promptTitle"),
            {
              confirmButtonText: this.$t("buttonModule.modalSureBtn"),
              cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
              type: "warning"
            }
          )
            .then(() => {
              // 确定
              this.$store.commit("SET_PRIMARY_TABLE_COMPONENTS", []);
              this.submitForm(baseInfoForm);
            })
            .catch(() => {
              loading.close();
            });
        } else {
          await this.submitForm(baseInfoForm);
        }
       
      } else {
        this.showMessage(this.$t("deletePrompt.submitFailure"));
      }
    },
    showMessage(
      message = "消息内容",
      type = "warning",
      title = this.$t("deletePrompt.failureTitle")
    ) {
      this.$notify({
        title,
        message,
        type
      });
      this.loading.close();
    },
    async submitForm(baseInfoForm) {
      let id = this.$store.state.FD.F_Id;
      let res = { code: 0, success: false };
      try {
        if (id) {
          res = await updateFormScheme(id, baseInfoForm);
        } else {
          res = await addFormScheme(baseInfoForm);
        }
        if (res.data.success) {
          //删除兼容样式类
          let bodyClass = document.body.className.split(" ");
          bodyClass.filter((item, idx) => {
            return item == "original" && bodyClass.splice(idx, 1);
          });
          document.body.className = bodyClass.join(" ");
          this.dialogVisible = false;
          this.showMessage(
            this.$t("deletePrompt.Complete"),
            "success",
            this.$t("deletePrompt.successTitle")
          );
          this.$store.commit("SET_F_ID", "");
        } else {
          this.tableProcessingSucceeded =false;
          this.showMessage(this.$t("deletePrompt.Submit") + res.data.msg);
          this.loading.close();
        }
      } catch (error) {
        this.tableProcessingSucceeded =false;
        this.loading.close();
      }
    },
    // 处理step1 转换为dbTable
    disposeDbTable(step1) {
      this.param.dbTable = [
        {
          name: step1[0]?.formName,
          pk: "F_Id",
          parentName: 1,
          field: "",
          relationName: "",
          relationField: "",
          $index: 0
        }
      ];
      step1.map((item, index) => {
        index >= 1 &&
          this.param.dbTable.push({
            name: item.formName,
            pk: "F_Id",
            parentName: 0,
            field: `${this.param.dbTable[0].name}_Id`,
            relationName: `${this.param.dbTable[0].name}`,
            relationField: "F_Id",
            $index: item.id
          });
      });
    }
  }
};
</script>
<style scoped>
div /deep/ .container {
  height: 100%;
}
.main-container {
  height: 100%;
}
.formBox {
  height: calc(100% - 114px);
}
@media screen and (max-width: 1370px) {
  div /deep/ .container {
    height: 72vh;
  }
}
.code-build-box {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1999;
  background-color: #fff;
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
