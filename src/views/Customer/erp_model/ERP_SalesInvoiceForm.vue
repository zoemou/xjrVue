<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12" v-if="hasFormPermission('F_SalesInvoiCode')">
          <el-form-item label="开票编号" prop="F_SalesInvoiCode">
            <el-input v-model="formData['F_SalesInvoiCode']" placeholder="开票编号"
              :disabled="hasDisabledPermission('F_SalesInvoiCode',undefined)"
              :readonly="!hasEditPermission('F_SalesInvoiCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_SalesCode')">
          <el-form-item label="销售订单" prop="F_SalesCode">
            <el-select v-model="formData.F_SalesCode" placeholder="请选择销售订单"
              :disabled="hasDisabledPermission('F_SalesCode',false)"
              :readonly="!hasEditPermission('F_SalesCode',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_SalesCodeOptions"
              @change="handlerSelectF_SalesCode" :loading="F_SalesCodeLoading">
              <el-option v-for="(item, index) in F_SalesCodeOptions" :key="index" :label="item.F_SalesCode"
                :value="item.F_SalesCode" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_SalesOrderId')">
          <el-form-item label="订单id" prop="F_SalesOrderId">
            <el-input v-model="formData['F_SalesOrderId']" placeholder="请输入订单id"
              :disabled="hasDisabledPermission('F_SalesOrderId',false)"
              :readonly="!hasEditPermission('F_SalesOrderId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_ClientId')">
          <el-form-item label="客户名称" prop="F_ClientId">
            <el-input v-model="formData['F_ClientId']" placeholder="请输入客户名称"
              :disabled="hasDisabledPermission('F_ClientId',false)"
              :readonly="!hasEditPermission('F_ClientId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_ChargePeople')">
          <el-form-item label="经办人员" prop="F_ChargePeople">
            <el-input v-model="formData['F_ChargePeople']" placeholder="请输入经办人员"
              :disabled="hasDisabledPermission('F_ChargePeople',false)"
              :readonly="!hasEditPermission('F_ChargePeople',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvoiceDate')">
          <el-form-item label="开票日期" prop="F_InvoiceDate">
            <el-date-picker :disabled="hasDisabledPermission('F_InvoiceDate',false)"
              :readonly="!hasEditPermission('F_InvoiceDate',false)" v-model="formData['F_InvoiceDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择开票日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvoiceAmount')">
          <el-form-item label="开票金额" prop="F_InvoiceAmount">
            <el-input v-model="formData['F_InvoiceAmount']" type="number" placeholder="请输入开票金额"
              :disabled="hasDisabledPermission('F_InvoiceAmount',false)"
              :readonly="!hasEditPermission('F_InvoiceAmount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CompanyName')">
          <el-form-item label="公司名称" prop="F_CompanyName">
            <el-input v-model="formData['F_CompanyName']" placeholder="请输入公司名称"
              :disabled="hasDisabledPermission('F_CompanyName',false)"
              :readonly="!hasEditPermission('F_CompanyName',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CompanyAddress')">
          <el-form-item label="公司地址" prop="F_CompanyAddress">
            <el-input v-model="formData['F_CompanyAddress']" placeholder="请输入公司地址"
              :disabled="hasDisabledPermission('F_CompanyAddress',false)"
              :readonly="!hasEditPermission('F_CompanyAddress',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CompanyTel')">
          <el-form-item label="联系电话" prop="F_CompanyTel">
            <el-input v-model="formData['F_CompanyTel']" placeholder="请输入联系电话"
              :disabled="hasDisabledPermission('F_CompanyTel',false)"
              :readonly="!hasEditPermission('F_CompanyTel',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AccountBank')">
          <el-form-item label="开户行" prop="F_AccountBank">
            <el-input v-model="formData['F_AccountBank']" placeholder="请输入开户行"
              :disabled="hasDisabledPermission('F_AccountBank',false)"
              :readonly="!hasEditPermission('F_AccountBank',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_TaxID')">
          <el-form-item label="税号" prop="F_TaxID">
            <el-input v-model="formData['F_TaxID']" placeholder="请输入税号"
              :disabled="hasDisabledPermission('F_TaxID',false)"
              :readonly="!hasEditPermission('F_TaxID',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom: 20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit">
			 <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
        <avue-filterable-data-list :conf="autoCompleteConf" v-if="autoCompleteDialogVisible"
          v-on:onHandler="filterableCallBack"></avue-filterable-data-list>
      </el-form>
    </el-row>
  </div>
</template>
<script>

        import FilterableDataList from '@/components/generator/clientComponents/FilterableDataList.vue';
        import workflowFormAuthorize from "@/mixins/workflowFormAuthorize";
        import authorizeMixin from "@/mixins/authorize";
        import { baseUrl } from "@/config/env";
        import request from "@/router/axios";
        export default {
          mixins: [authorizeMixin,workflowFormAuthorize],
       
  components: {},
  props: ['keyValue', 'isEdit', 'disabled'],
  data() {
    let _this = this
    return {
      showForm: true,
      operationVal: 'add',
      isAdd: true,
      addressUrl:'erp_salesinvoice',
      mainTableName: 'erp_salesinvoice',
      formConfig: {
        "fields": [{
          "__vModel__": "F_SalesInvoiCode",
          "__config__": {
            "label": "开票编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 12,
            "autoCodeRule": "SalesInvoiCode",
            "formId": 101
          }
        }, {
          "__vModel__": "F_SalesCode",
          "__config__": {
            "label": "销售订单",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 12,
            "dataType": "dataSql",
            "autoBindFields": "{\"107\":\"F_FullName\",\"108\":\"F_UnitAddress\",\"109\":\"F_UnitTelephone\",\"110\":\"F_OpenBank\",\"111\":\"F_TaxCode\",\"114\":\"F_Id\",\"123\":\"F_ClientId\"}",
            "formId": 122,
            "sql": "select o.F_Id,o.F_SalesCode,o.F_ClientId,f.F_FullName,f.F_UnitAddress,\n\tf.F_UnitTelephone,\n\tf.F_OpenBank,\n\tf.F_TaxCode from erp_salesorder o left join erp_inoutunit f on o.F_ClientId=f.f_id",
            "database": "localDB",
            "showField": "F_SalesCode",
            "saveField": "F_SalesCode"
          }
        }, {
          "__vModel__": "F_SalesOrderId",
          "__config__": {
            "label": "订单id",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 114
          }
        }, {
          "__vModel__": "F_ClientId",
          "__config__": {
            "label": "客户名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 123
          }
        }, {
          "__vModel__": "F_ChargePeople",
          "__config__": {
            "label": "经办人员",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 104
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_InvoiceDate",
          "__config__": {
            "label": "开票日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 12,
            "formId": 105
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_InvoiceAmount",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "开票金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 106
          }
        }, {
          "__vModel__": "F_CompanyName",
          "__config__": {
            "label": "公司名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 107
          }
        }, {
          "__vModel__": "F_CompanyAddress",
          "__config__": {
            "label": "公司地址",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 108
          }
        }, {
          "__vModel__": "F_CompanyTel",
          "__config__": {
            "label": "联系电话",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 109
          }
        }, {
          "__vModel__": "F_AccountBank",
          "__config__": {
            "label": "开户行",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 110
          }
        }, {
          "__vModel__": "F_TaxID",
          "__config__": {
            "label": "税号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 111
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "span": 24,
            "formId": 113
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_SalesInvoiCode': '',
        'F_SalesCode': '',
        'F_SalesOrderId': '',
        'F_ClientId': '',
        'F_ChargePeople': '',
        'F_InvoiceDate': null,
        'F_InvoiceAmount': 0,
        'F_CompanyName': '',
        'F_CompanyAddress': '',
        'F_CompanyTel': '',
        'F_AccountBank': '',
        'F_TaxID': '',
        'F_Description': '',
      },
      rules: {
        F_SalesInvoiCode: [{
          required: true,
          message: '开票编号',
          trigger: 'blur'
        }],
        F_SalesCode: [],
        F_SalesOrderId: [{
          required: true,
          message: '请输入订单id',
          trigger: 'blur'
        }],
        F_ClientId: [{
          required: true,
          message: '请输入客户名称',
          trigger: 'blur'
        }],
        F_ChargePeople: [],
        F_InvoiceDate: [{
          required: true,
          message: '请选择开票日期',
          trigger: 'change'
        }],
        F_InvoiceAmount: [{
          required: true,
          message: '请输入开票金额',
          trigger: 'blur'
        }],
        F_CompanyName: [{
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        }],
        F_CompanyAddress: [{
          required: true,
          message: '请输入公司地址',
          trigger: 'blur'
        }],
        F_CompanyTel: [{
          required: true,
          message: '请输入联系电话',
          trigger: 'blur'
        }],
        F_AccountBank: [],
        F_TaxID: [{
          required: true,
          message: '请输入税号',
          trigger: 'blur'
        }],
        F_Description: [],
      },
      F_SalesCodeOptions: [],
      F_SalesCodeLoading: false,
    }
  },
  computed: {},
  watch: {
    'formData.F_InvoiceAmount': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
  },
  created() {},
  async mounted() {
    //TODO   再这里做数据回填 请求表单数据
   
           if(this.keyValue){
              this.isAdd = false;
          }
           if(!this.isAdd&&this.keyValue){
              this.operationVal = 'edit';
              this.showForm = false;
              try {
                let res = await request({
                  url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
                  method: "get",
                });
                  
            this.formData = res.data.data
            
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_SalesInvoiCodeOptions == "function") {
      await this.getF_SalesInvoiCodeOptions();
    }
    if (typeof this.getF_SalesCodeOptions == "function") {
      await this.getF_SalesCodeOptions();
    }
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        //格式化数据
        let newObj = this.getFormData();
        
        //如果没有传入参数就是新增
        if (!this.keyValue) {

          request({
            url: baseUrl + "/"+this.addressUrl,
            method: "post",
            data : newObj
          }).then((res) => {

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

            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
            });
             this.$emit("onChange",true)
          });

        }
       
       
        
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
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
    
          //辅助工作流 审批(编辑) 预留方法
          handleEdit() {
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
              defaultValue = eval(formulaStr);
              defaultValue = this.getNumberFixed2(defaultValue);
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
            defaultValue = eval(formulaStr);
            defaultValue = this.getNumberFixed2(defaultValue);
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
                  formulaStr += item.formId == 0 ? item.name : valueForFormIdMap.get(eleValue);
                }
              });
              defaultValue = eval(formulaStr);
              defaultValue = this.getNumberFixed2(defaultValue);
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
            defaultValue = eval(formulaStr);
            defaultValue = this.getNumberFixed2(defaultValue);
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
              defaultValue = eval(formulaStr);
              defaultValue = this.getNumberFixed2(defaultValue);
              item.__config__.defaultValue = defaultValue;
              this.formData[item.__vModel__] = defaultValue;
            }
          }
        });
      }
    },
    filterableCallBack(data) {
      if (!this.autoCompleteConf) {
        return false;
      }
      //弹窗关闭前回填数据  如果有选择数据项
      if (data) {
        let fields = this.getElements(this.formConfig.fields);
        let autoBindFields = JSON.parse(this.autoCompleteConf.autoBindFields) || {};
        let saveField = this.autoCompleteConf.dataType == 'dataItem' ? 'F_ItemValue' : this.autoCompleteConf
          .saveField
        this.setModelValue(this.formConfig.fields, autoBindFields, data);
        //自己赋值
        if (this.autoCompleteConf.dataType == 'dataItem') {
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].__config__.formId == this.autoCompleteConf.formId) {
              this.formData[this.autoCompleteConf.model] = data[saveField];
              break;
            }
          }
        }
        else {
          this.formData[this.autoCompleteConf.model] = data[saveField];
        }
      }
      //更新表单校验
      this.$refs['elForm'].validate(valid => {
        console.log('更新表单校验 valid', valid);
      })
      //关闭弹窗
      this.autoCompleteDialogVisible = false;
    },
    setModelValue(fields, autoBindFields, data) {
      fields.map(item => {
        if (item.__config__.componentName && item.__config__.componentName == 'avue-tabs') {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            let children = childrenObj[key];
            this.setModelValue(children, autoBindFields, data);
          }
        }
        else {
          if (autoBindFields.hasOwnProperty(item.__config__.formId)) {
            this.formData[item.__vModel__] = data[autoBindFields[item.__config__.formId]];
          }
        }
      });
    },
    getElements(fields) {
      let _arr = [];
      fields.map(item => {
        if (item.__config__.componentName == 'avue-tabs') {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            _arr.push(...this.getElements(childrenObj[key]));
          }
        }
        else {
          _arr.push(item);
        }
      });
      return (() => {
        return _arr;
      })();
    },
    async getF_SalesInvoiCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/SalesInvoiCode/gen',
        });
        if (resp.data.data) {
          this.formData.F_SalesInvoiCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_SalesCodeOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_SalesCodeOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_SalesCode&keyword=' +
              keyword
          });
          this.F_SalesCodeOptionsLoading = false;
          this.F_SalesCodeOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `select o.F_Id,o.F_SalesCode,o.F_ClientId,f.F_FullName,f.F_UnitAddress,
	f.F_UnitTelephone,
	f.F_OpenBank,
	f.F_TaxCode from erp_salesorder o left join erp_inoutunit f on o.F_ClientId=f.f_id`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_SalesCodeOptionsLoading = false;
          this.F_SalesCodeOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_SalesCode(val) {
      let autoBindFields = JSON.parse(
        '{"107":"F_FullName","108":"F_UnitAddress","109":"F_UnitTelephone","110":"F_OpenBank","111":"F_TaxCode","114":"F_Id","123":"F_ClientId"}'
        );
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_SalesCode'
      //得对应数据列
      let data = this.F_SalesCodeOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
  }
}

</script>
<style scoped>
/deep/ .el-table__empty-block {
  width: 100% !important;
}

/deep/ .avue-form__row {
  padding: 0 !important;
}
/deep/ .el-input--medium .el-input__inner,/deep/ .el-form-item--medium .el-form-item__label,/deep/ .el-input--medium .el-input__icon
{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-form-item--medium .el-form-item__content{
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 2px;
}
/deep/ .el-form-item{
	margin-bottom: 8px!important;
}
/deep/ .el-form-item--medium .el-form-item__content, /deep/ .el-form-item--medium .el-form-item__label{
	line-height: 27px;
}

</style>
