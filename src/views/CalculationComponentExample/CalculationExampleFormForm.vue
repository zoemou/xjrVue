<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
        :key="showFormKey" v-if="showForm">
        <el-col :span="24" v-show="hasFormPermission('field100781c')">
          <el-form-item :label="$t('单行文本')" prop="field100781c">
            <el-input v-model="formData['field100781c']" placeholder="请输入单行文本"
              :disabled="hasDisabledPermission('field100781c',false)"
              :readonly="!hasEditPermission('field100781c',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('field101800c')">
          <el-form-item :label="$t('成交金额')" prop="field101800c">
            <el-input v-model.number="formData['field101800c']" type="number" placeholder="请输入成交金额"
              :disabled="hasDisabledPermission('field101800c',false)"
              :readonly="!hasEditPermission('field101800c',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('field107f8cb')">
          <el-form-item :label="$t('优惠折扣')" prop="field107f8cb">
            <el-input v-model.number="formData['field107f8cb']" type="number" placeholder="请输入优惠折扣"
              :disabled="hasDisabledPermission('field107f8cb',false)"
              :readonly="!hasEditPermission('field107f8cb',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('field10260ca')">
          <el-form-item :label="$t('优惠金额')" prop="field10260ca">
            <el-input v-model.number="formData['field10260ca']" type="number" placeholder="请输入优惠金额"
              :disabled="hasDisabledPermission('field10260ca',false)"
              :readonly="!hasEditPermission('field10260ca',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('table18607')">
          <avue-form v-loading="preloadLoading103" class=" avueFormTitleNoWrap  subTableForm "
            element-loading-text="数据预加载中..." element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)" :option="option103" v-model="table18607"
            ref="avueTabletable18607" v-show="hasFormPermission('table18607')" :disabled="disabled"
            :key="reRenderSubformKey">
             <template slot-scope="{row}" slot="field11049f8">
              <AvueFinance :index="row.$index" v-model="row['field11049f8']" :formId=110
                :conf='getTableItemConfConfig(110)' @changeTableFinaceData='changeTableFinaceData'
                >
              </AvueFinance>
            </template>
             <template slot-scope="{row}" slot="field1040f1a">
              <AvueFinance :index="row.$index" v-model="row['field1040f1a']" :formId=104
                :conf='getTableItemConfConfig(104)' @changeTableFinaceData='changeTableFinaceData'
               >
              </AvueFinance>
            </template>
            <template slot-scope="{row}" slot="field106d611">
              <AvueFinance :index="row.$index" v-model="row['field106d611']" :formId=106
                :conf='getTableItemConfConfig(106)' @changeTableFinaceData='changeTableFinaceData'
               >
              </AvueFinance>
            </template>
            <template slot-scope="{row}" slot="field111669b">
              <AvueFinance :index="row.$index" v-model="row['field111669b']" :formId=111
                :conf='getTableItemConfConfig(111)' @changeTableFinaceData='changeTableFinaceData'
              >
              </AvueFinance>
            </template>
            <template slot-scope="{row}" slot="field109d6db">
              <AvueFinance :index="row.$index" v-model="row['field109d6db']" :formId=109
                :conf='getTableItemConfConfig(109)' @changeTableFinaceData='changeTableFinaceData'
                >
              </AvueFinance>
            </template>
            <template slot-scope="{row}" slot="field1059dbf">
              <AvueFinance :index="row.$index" v-model="row['field1059dbf']" :formId=105
                :conf='getTableItemConfConfig(105)' @changeTableFinaceData='changeTableFinaceData'
              >
              </AvueFinance>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm">
          <el-form-item size="large" v-if="isEdit" class="form-button-center">
            <el-button type="primary" @click="submitForm" :loading="submitLoading">
              {{submitLoading?$t('workFlow.WFMenu.hintSubmit'):$t('submit')}}</el-button>
            <el-button @click="cancelForm">{{$t('cancelText')}}</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

        import workflowFormAuthorize from "@/mixins/workflowFormAuthorize";
        import authorizeMixin from "@/mixins/authorize";
        import nodeMsgMixin from "@/mixins/nodeMsg";
        import { baseUrl } from "@/config/env";
        import request from "@/router/axios";
        import {fieldsConfig,formFieldsMap,getHideComponents} from './CalculationExampleFormConfig';
        import { formValidateNotice } from '@/util/util';		
        import store from "@/store";
        import hideComponentsMixin from "@/mixins/hideComponents"; // 隐藏组件
        import AvueFinance from "@/views/CalculationComponentExample/auxiliary/Finance";//财务组件
         import finaceMixin from "@/views/CalculationComponentExample/auxiliary/finace"; // 财务组件计算Mixin
        export default {
          mixins: [authorizeMixin,workflowFormAuthorize,nodeMsgMixin,hideComponentsMixin,finaceMixin],
  components: {
    AvueFinance
  },
  props: ['keyValue', 'isEdit', 'disabled'],
  data() {
    return {
      userInfo: {},
      submitLoading: false,
      showForm: true,
      showFormKey: 1,
      reRenderSubform: false,
      reRenderSubformKey: 0,
      operationVal: 'add',
      isAdd: true,
      addressUrl:'calculationexampleform',
      autoCompleteConfEventData: [],
      mainTableName: 'table01474',
      formConfig: {},
      formFieldsMap: new Map(),
      hideComponentsMap: new Map(),
      needShowValueTags: ['asso-popup', 'mutiple-popup'],
      formData: {
        'field100781c': '',
        'field101800c': 0,
        'field107f8cb': 0,
        'field10260ca': 0,
      },
      rules: {
        field100781c: [{
          required: true,
          message: '请输入单行文本',
          trigger: 'blur'
        }],
        field101800c: [{
          required: true,
          message: '请输入成交金额',
          trigger: 'blur'
        }],
        field107f8cb: [{
          required: true,
          message: '请输入优惠折扣',
          trigger: 'blur'
        }],
        field10260ca: [{
          required: true,
          message: '请输入优惠金额',
          trigger: 'blur'
        }],
      },
      table18607: {},
      preloadLoading103: false,
    }
  },
  computed: {
    option103() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: this.disabled,
        column: [{
          label: 'table',
          prop: 'table18607',
          type: 'dynamic',
          span: 24,
           finaceFormIdList: [110,104,106,111,105,109 ],
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              // this.$message.success('新增回调');
              done({});
                if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formid
              }
            },
            rowDel: (row, done) => {
              done();
              this.reRenderSubform = false; //更新组件 index
              setTimeout(() => {
                // this.$message.success('删除回调'+JSON.stringify(row));
                this.reRenderSubform = true;
                this.reRenderSubformKey++;
              }, 0);
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formid
              }
               // 添加 end
              
            },
            column: this.getAuthorityTableChildrenList('table18607', [{
              label: this.$t('单价'),
              prop: 'field1040f1a',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入单价',
              required: true,
              formslot: true,// 修改为true 添加插槽
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '单价不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '单价不能为空'
              }, ],
            }, {
              label: this.$t('数量'),
              prop: 'field1059dbf',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入数量',
              required: true,
              formslot: true,
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '数量不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '数量不能为空'
              }, ],
            }, {
              label: this.$t('含税单价'),
              prop: 'field11049f8',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入含税单价',
              required: true,
              formslot: true,// 修改为true 添加插槽
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '含税单价不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '含税单价不能为空'
              }, ],
            }, {
              label: this.$t('税率'),
              prop: 'field106d611',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入税率',
              required: true,
              formslot: true,// 修改为true 添加插槽
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '税率不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '税率不能为空'
              }, ],
            }, {
              label: this.$t('含税金额'),
              prop: 'field111669b',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入含税金额',
              required: true,
              formslot: true,// 修改为true 添加插槽
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '含税金额不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '含税金额不能为空'
              }, ],
            }, {
              label: this.$t('金额'),
              prop: 'field109d6db',
              value: 0,
              type: 'input',
              width: null,
              placeholder: '请输入金额',
              required: true,
              formslot: true,
              disabled: this.disabled ? this.disabled : false,
              rules: [{
                required: true,
                message: '金额不能为空'
              }, ],
              ruleList: [{
                required: true,
                message: '金额不能为空'
              }, ],
            }, ])
          }
        }, ],
      }
    },
  },
  watch: {
    'formData.field101800c': function(val, oldVal) {
      this.updateRelativeComObject(101);//成交金额 
    },
    'formData.field107f8cb': function(val, oldVal) {
      this.updateRelativeComObject(107);//优惠折扣
    },
    'formData.field10260ca': function(val, oldVal) {
      this.updateRelativeComObject(102);//优惠金额
    },
  },
  async created() {
    this.formConfig = this.getFormConfig();
    this.formFieldsMap = this.getFormFieldsMap();
    this.userInfo = localStorage.getItem("avue-userInfo") ? JSON.parse(localStorage.getItem(
      "avue-userInfo")).content : {};
  },
  async mounted() {
    this.hideComponentsMap = await this.getHideComponentsMap();
    this.showForm = false;
    await this.insertCreatedEvent();
    //TODO   再这里做数据回填 请求表单数据
   
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
                  
            this.formData = res.data.data.table01474
            
          this.table18607.table18607 = res.data.data.table18607
          
        this.table18607.table18607.forEach(element => {
      });
      
                  await this.handleEdit();
                 this.showFormKey++;
              } catch (error) {
              }
          }

       
    await this.insertMountedEvent();
    this.reRenderSubform = true; //子表单显示
    this.showFormKey++;
    this.processParameterAssignment();
    this.showForm = true;
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        table18607EntityList: this.table18607.table18607,
      };
    },
    validateForm() {
      this.$refs['elForm'].validate(valid => {});
    },
    async aysncValidateForm() {
      let validataArry = []
      let formValidateNotice = function formValidateNotice(obj, that, formAuth) {
        for (var o in obj) {
          if (!formAuth[o] && obj[o][0]) {
            that.$message({
              message: obj[o][0].message + ',' + that.$t('noFormAuth'),
              type: 'warning'
            });
            return;
          }
        }
      }
      if (this.table18607.table18607 && this.table18607.table18607.length > 0) {
        validataArry.push(new Promise((resolve, reject) => {
          this.$refs['avueTabletable18607'].validate(valid => {
            resolve(valid)
          });
        }));
      }
      validataArry.push(new Promise((resolve, reject) => {
        this.$refs['elForm'].validate((valid, object) => {
          if (!this.isWorkflowForm) formValidateNotice(object, this, this.formEnCodeList)
          resolve(valid)
        })
      }))
      let res = await Promise.all(validataArry)
      if (res.includes(false)) {
        return false
      }
      else {
        return true;
      }
    },
    changeTableData() {
      if (this.table18607.table18607 && this.table18607.table18607.length > 0) {
        this.table18607.table18607.forEach((element, index) => {
          let itemChild = {
            ...element
          }
          for (let [key, value] of Object.entries(itemChild)) {
            if (Array.isArray(value)) {
              itemChild[key] = value.join(',')
            }
          }
          this.table18607.table18607[index] = itemChild;
        });
      }
      else {
        this.table18607.table18607 = [];
      }
    },
    async submitForm() {
      this.submitLoading = true;
      let valid = await this.aysncValidateForm();
      if (valid == false) {
        this.submitLoading = false;
        return false;
      }
      this.changeTableData();
      //格式化数据
      let newObj = this.getFormData();
      
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
       
       
      
      
      await this.handleSubmit();
    },
    cancelForm() {
      this.$emit("onChange", true)
    },
    formatTree(data, valueField, lableField, childField, type) {
      let tree = [];
      data.forEach((node, index) => {
        let newNode = {
          value: node[valueField],
          label: node[lableField],
        };
        if (type) {
          newNode.disabled = node[valueField] == undefined ? true : false
        }
        tree.push(newNode);
        if (node[childField] != null && node[childField].length > 0) {
          newNode.children = (this.formatTree(node[childField], valueField, lableField, childField,
          type));
        }
      }, this);
      return tree;
    },
    
          //辅助编辑 预留方法
          async handleEdit() {
            await this.insertEditEvent();
          },
          
    //FORM_EVENT_EDIT
    
        //辅助提交 预留方法
        async handleSubmit() {
          await this.insertSubmitEvent();
        },
        //辅助工作流提交 预留方法
        getHandleSubmitFormEvent() {
            
        },
        //辅助工作流表单事件 判断 表单事件是否已经执行过
        getisExecutedFormEvent() {
            let key = 'index'+this.$store.state.formParser.workflowFormTabIndexKey;
            return this.$store.state.formParser.isExecutedFormEvent[key]?this.$store.state.formParser.isExecutedFormEvent[key]:false;
            
        },
      
    getNumberFixed2(number) {
      let splitNum = ("" + number).replace(/(^0*)/g, "").split(".");
      let num = splitNum[0] == "" ? '0' : splitNum[0];
      if (splitNum.length > 1) {
        num += '.';
        let roundNum = 2; //保留两位小数
        for (let i = 0; i < roundNum; i++) {
          num += splitNum[1][i];
        }
      }
      return parseFloat(num);
    },
    changeFormConfigDefaultValue() {
      let valueForFormIdMap = new Map();
      this.formConfig.fields.forEach((ele) => {
        if (ele.__config__.componentName == "table") {
          ele.__config__.children.forEach((element) => {
            valueForFormIdMap.set(ele.__config__.formId + "-table-" + element.__config__.formId,
              element.__config__.defaultValue);
          });
        }
        else if (ele.__config__.componentName && ele.__config__.componentName == 'avue-tabs') {
          let childrenObj = ele.__config__.childrenObj || {};
          let _arr = this.getValByTabs(childrenObj);
          _arr.map(item => {
            valueForFormIdMap.set(item.formId, item.defaultValue);
          });
        }
        else {
          valueForFormIdMap.set(ele.__config__.formId, this.formData[ele.__vModel__]);
        }
      });
      this.formConfig.fields.forEach((ele, index) => {
        if (ele.__config__.componentName == "table") {
          ele.__config__.children.forEach((element, childrenIndex) => {
            let defaultValue = 0;
            if (element.computationalConfiguration && element.computationalConfiguration.length > 0) {
              let formulaStr = "";
              element.computationalConfiguration.forEach((item) => {
                if (item.type == "taxRate") {
                  //税率
                  if (element.taxRate >= 0) {
                    formulaStr += element.taxRate * 0.01;
                  }
                }
                else {
                  let eleValue = valueForFormIdMap.get(item.formId) || 0;
                  formulaStr += item.formId == 0 ? item.name : eleValue;
                }
              });
              defaultValue = eval(formulaStr) * 100;
              defaultValue = this.getNumberFixed2(defaultValue) / 100;
              //大写
              if (element.isCapitalized) {
                this.formConfig.fields[index].__config__.children[childrenIndex].__config__
                  .capitalizedValue = this.getCapitalizedMethod(defaultValue);
              }
              this.formConfig.fields[index].__config__.children[childrenIndex].__config__
                .defaultValue = defaultValue;
              this.formData[element.__vModel__] = defaultValue;
            }
          });
        }
        else if (ele.__config__.componentName && ele.__config__.componentName == 'avue-tabs') {
          let childrenObj = ele.__config__.childrenObj || {};
          //avue-tabs
          this.calcDefaultValueByTabs(ele.__config__.childrenObj, valueForFormIdMap);
        }
        else {
          let defaultValue = 0;
          if (ele.computationalConfiguration && ele.computationalConfiguration.length > 0) {
            let formulaStr = "";
            ele.computationalConfiguration.forEach((item) => {
              if (item.type == "taxRate") {
                //税率
                if (ele.taxRate >= 0) {
                  formulaStr += ele.taxRate * 0.01;
                }
              }
              else {
                let eleValue = valueForFormIdMap.get(item.formId) || 0;
                formulaStr += item.formId == 0 ? item.name : eleValue;
              }
            });
            defaultValue = eval(formulaStr) * 100;
            defaultValue = this.getNumberFixed2(defaultValue) / 100;
            //大写
            if (ele.isCapitalized) {
              this.formConfig.fields[index].__config__.capitalizedValue = this.getCapitalizedMethod(
                defaultValue);
            }
            this.formConfig.fields[index].__config__.defaultValue = defaultValue;
            this.formData[ele.__vModel__] = defaultValue;
          }
        }
      });
    },
    getValByTabs(childrenObj) {
      let _arr = [];
      if (!childrenObj || !(childrenObj instanceof Object)) return [];
      for (let key in childrenObj) {
        let children = childrenObj[key];
        children.map(item => {
          if (item.__config__.componentName && item.__config__.componentName == 'avue-tabs') {
            let cObj = item.__config__.childrenObj || {};
            _arr.push(...this.getValByTabs(item.__config__.childrenObj));
          }
          else {
            let _obj = {};
            _obj.formId = item.__config__.formId;
            _obj.defaultValue = this.formData[item.__vModel__];
            _arr.push(_obj);
          }
        });
      }
      return (() => {
        return _arr;
      })()
    },
    calcDefaultValueByTabs(childrenObj, valueForFormIdMap) {
      if (!childrenObj || !(childrenObj instanceof Object)) return;
      for (let key in childrenObj) {
        let children = childrenObj[key];
        children.map(item => {
          if (item.__config__.componentName && item.__config__.componentName == 'avue-tabs') {
            let cObj = item.__config__.childrenObj || {};
            this.calcDefaultValueByTabs(cObj, valueForFormIdMap);
          }
          else {
            let defaultValue = 0;
            if (item.computationalConfiguration && item.computationalConfiguration.length > 0) {
              let formulaStr = "";
              item.computationalConfiguration.forEach((c) => {
                if (item.type == "taxRate") {
                  //税率
                  if (item.taxRate >= 0) {
                    formulaStr += item.taxRate * 0.01;
                  }
                }
                else {
                  let eleValue = valueForFormIdMap.get(c.formId) || 0;
                  formulaStr += c.formId == 0 ? c.name : eleValue;
                }
              });
              defaultValue = eval(formulaStr) * 100;
              defaultValue = this.getNumberFixed2(defaultValue) / 100;
              item.__config__.defaultValue = defaultValue;
              this.formData[item.__vModel__] = defaultValue;
            }
          }
        });
      }
    },
    async triggerEventHandler(eventData) {
      if (eventData.length > 0) {
        eventData.forEach(ele => {
          let functionName = 'getField' + ele.componentFormId + 'Options';
          if (typeof this[functionName] == "function") {
            this[functionName]();
          }
        })
      }
    },
    triggerEventFormIdHandler(formId) {
      if (this.formFieldsMap.get(formId).__config__.triggerEvents && this.formFieldsMap.get(formId).__config__
        .triggerEvents.length > 0) {
        this.formFieldsMap.get(formId).__config__.triggerEvents.forEach(triggerEventItem => {
          if (this.formFieldsMap.get(formId).__config__.triggerEventData && this.formFieldsMap.get(formId)
            .__config__.triggerEventData[triggerEventItem] && this.formFieldsMap.get(formId).__config__
            .triggerEventData[triggerEventItem].length > 0) {
            this.triggerEventHandler(this.formFieldsMap.get(formId).__config__.triggerEventData[
              triggerEventItem]);
          }
        });
      }
      return true;
    },
    // 流程参数赋值
    processParameterAssignment() {
      // 流程中的流程参数赋值 优先级最高，最后赋值
      setTimeout(() => {
        if (this.isEdit != 2 && this.parameter && this.parameter[this.mainTableName]) {
          this.showForm = false;
          for (let [key, value] of Object.entries(this.parameter[this.mainTableName])) {
            this.setFormDataValue(key, value);
          }
          this.showForm = true;
        }
      }, 0);
    },
    setFormDataValue(field, val) {
      if (Array.isArray(this.formData[field])) {
        if (val.includes(',')) {
          this.formData[field] = val.split(',');
        }
        else {
          this.formData[field] = [val];
        }
      }
      else {
        this.formData[field] = val;
      }
      //处理联想弹层，多选弹层
      if (this.formData[field + '_showValue'] != undefined) {
        this.formData[field + '_showValue'] = val;
      }
    },
    setOutputsValue(nodeType, formId, res, outputKey) {
      let nodeTypeChecked = false;
      if (nodeType == 'created') {
        nodeTypeChecked = this.operationVal == 'add';
      }
      else if (nodeType == 'edit') {
        nodeTypeChecked = this.operationVal == 'edit';
      }
      else if (nodeType == 'mounted') {
        nodeTypeChecked = this.operationVal == 'add' || this.operationVal == 'edit';
      }
      if (nodeTypeChecked && this.disabled != true && res && res.data && res.data.data && this.formFieldsMap
        .has(formId) && this.formFieldsMap.get(formId).__vModel__ && this.formData.hasOwnProperty(this
          .formFieldsMap.get(formId).__vModel__)) {
        this.setFormDataValue(this.formFieldsMap.get(formId).__vModel__, res.data.data[outputKey]);
        // 联想弹层 多选弹层 特殊处理
        if (this.formFieldsMap.get(formId).__config__ && this.formFieldsMap.get(formId).__config__.avueType &&
          this.needShowValueTags.includes(this.formFieldsMap.get(formId).__config__.avueType)) {
          this.formData[this.formFieldsMap.get(formId).__vModel__ + '_showValue'] = res.data.data[outputKey];
        }
        this.triggerEventFormIdHandler(formId);
      }
    },
    //子表单权限
    getAuthorityTableChildrenList(bindTable, children) {
      let column = [];
      if (bindTable && this.formEnCodeList && this.formEnCodeList[bindTable]) {
        let formSubEnCodeList = this.formEnCodeList[bindTable];
        if (children && children.length > 0) {
          column = children.map(ele2 => {
            if (formSubEnCodeList.includes(ele2.prop)) {
              ele2.hide = false;
            }
            else {
              ele2.hide = true;
            }
            if (ele2.hide == false) {
              //工作流中系统表单必填权限
              if (this.formSubTableNotRequiredList && this.formSubTableNotRequiredList[bindTable] !=
                undefined) {
                if (this.formSubTableNotRequiredList[bindTable].includes(ele2.prop)) {
                  ele2.required = false;
                }
                else {
                  ele2.required = true;
                }
              }
              ele2.rules = [];
              if (ele2.required) {
                ele2.rules = ele2.ruleList;
              }
              // disabled 属性
              if (this.formSubTableDisabledList && this.formSubTableDisabledList[bindTable] !=
                undefined) {
                if (this.formSubTableDisabledList[bindTable].includes(ele2.prop)) {
                  ele2.disabled = true;
                }
                else {
                  ele2.disabled = false;
                }
              }
              if (this.disabled) { //查看
                ele2.disabled = true;
              }
            }
            else {
              ele2.rules = []
              if (ele2.required) {
                ele2.ruleList.forEach(el => {
                  el.message += ',' + this.$t('noFormAuth')
                })
                ele2.rules = ele2.ruleList;
              }
            }
            return ele2;
          });
        }
        return column;
      }
      else {
        return children;
      }
    },
    async insertCreatedEvent() {
      
    },
    async insertMountedEvent() {
      
    },
    async insertEditEvent() {
      
    },
    async insertSubmitEvent() {
      
    },
    getFormConfig() {
       return fieldsConfig();
    },
    getFormFieldsMap() {
       return formFieldsMap();
    },
    async getHideComponentsMap() {
      let mapList = new Map();
      let hideComponentList = this.getHideComponents();
      if (typeof this.initHideComponentList == 'function') {
        mapList = await this.initHideComponentList(hideComponentList);
        this.$store.commit("SET_HIDE_COMPONENT_LIST", mapList);
      }
      return mapList;
    },
    getHideComponentsMapItem(key) {
      if (this.hideComponentsMap.size > 0) {
        return this.hideComponentsMap.has(key) ? this.hideComponentsMap.get(key) : "";
      }
      else {
        return ""
      }
    },
    getHideComponents() {
       return getHideComponents();
    },
  }
}

</script>
<style>
.el-table__empty-block {
  width: 100% !important;
}

.avue-form__row {
  padding: 0 !important;
}

#editorphone {
  width: 375px;
  margin: 0 auto;
  border: 1px solid #E4E7ED;
  padding: 0 7.5px;
  background: #f5f6fa;
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
}

#editorphone .el-col {
  border-bottom: 1px solid #F2F2F2;
  background: #fff;
  margin-bottom: 0;
  padding: 0 15px 6px !important;
  width: 100%;
}

#editorphone .el-form-item__label {
  line-height: 20px
}

#editorphone .el-input-group .el-input__inner {
  background: #f5f6fa
}

#editorphone .el-input__inner {
  border: 0
}

#editorphone .el-input-group__append,
#editorphone .el-input-group__prepend {
  border: 0;
  background: #edeef2;
  color: #666;
}

#editorphone .el-input-group .el-input__prefix {
  left: 44px
}

#editorphone .el-input-group .el-input__suffix {
  right: 44px
}

#editorphone .el-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: wrap;
}

#editorphone .el-form-item__label {
  float: none;
  min-width: 85px;
  width: auto !important;
  text-align: left;
  flex: auto;
}

#editorphone .tinymce .el-form-item__label {
  min-width: 100%;
}

#editorphone .el-form-item__content {
  margin-left: 0px !important;
  flex: auto;
  width: calc(100% - 95px);
}

#editorphone .avueFormNoLable .el-form-item__label,
#editorphone .avueFormNoLable .avue-crud__pagination {
  display: none;
}

#editorphone .avueFormNoLable .el-collapse-item__wrap,
#editorphone .avueFormNoLable .el-collapse {
  border-bottom: 0
}

#editorphone .avueFormNoLable .el-col {
  border-bottom: 0;
  padding-bottom: 0
}

#editorphone .el-form-item__content .el-button:first-child {
  margin-left: 90px;
}

</style>
