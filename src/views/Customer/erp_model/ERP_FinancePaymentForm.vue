<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_PaymentCode')">
          <el-form-item label="付款编码" prop="F_PaymentCode">
            <el-input v-model="formData['F_PaymentCode']" placeholder="付款编码"
              :disabled="hasDisabledPermission('F_PaymentCode',undefined)"
              :readonly="!hasEditPermission('F_PaymentCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentDate')">
          <el-form-item label="付款时间" prop="F_PaymentDate">
            <el-date-picker :disabled="hasDisabledPermission('F_PaymentDate',false)"
              :readonly="!hasEditPermission('F_PaymentDate',false)" v-model="formData['F_PaymentDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择付款时间"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Manager')">
          <el-form-item label="经办人" prop="F_Manager">
            <el-input v-model="formData['F_Manager']" placeholder="请输入经办人"
              :disabled="hasDisabledPermission('F_Manager',false)"
              :readonly="!hasEditPermission('F_Manager',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseOrderId')">
          <el-form-item label="采购订单" prop="F_PurchaseOrderId">
            <el-select v-model="formData.F_PurchaseOrderId" placeholder="请选择采购订单"
              :disabled="hasDisabledPermission('F_PurchaseOrderId',false)"
              :readonly="!hasEditPermission('F_PurchaseOrderId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_PurchaseOrderIdOptions"
              @change="handlerSelectF_PurchaseOrderId" :loading="F_PurchaseOrderIdLoading">
              <el-option v-for="(item, index) in F_PurchaseOrderIdOptions" :key="index"
                :label="item.F_PurchaseOrder" :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryUnit')">
          <el-form-item label="供货单位" prop="F_DeliveryUnit">
            <el-input v-model="formData['F_DeliveryUnit']" placeholder="请输入供货单位"
              :disabled="hasDisabledPermission('F_DeliveryUnit',false)"
              :readonly="!hasEditPermission('F_DeliveryUnit',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseMan')">
          <el-form-item label="采购人" prop="F_PurchaseMan">
            <el-input v-model="formData['F_PurchaseMan']" placeholder="请输入采购人"
              :disabled="hasDisabledPermission('F_PurchaseMan',false)"
              :readonly="!hasEditPermission('F_PurchaseMan',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_TotalPurchases')">
          <el-form-item label="采购总额" prop="F_TotalPurchases">
            <el-input v-model="formData['F_TotalPurchases']" type="number" placeholder="请输入采购总额"
              :disabled="hasDisabledPermission('F_TotalPurchases',false)"
              :readonly="!hasEditPermission('F_TotalPurchases',false)" clearable
              :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_UnsoldAmount')">
          <el-form-item label="未销金额" prop="F_UnsoldAmount">
            <el-input v-model="formData['F_UnsoldAmount']" type="number" placeholder="请输入未销金额"
              :disabled="hasDisabledPermission('F_UnsoldAmount',false)"
              :readonly="!hasEditPermission('F_UnsoldAmount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesAmount')">
          <el-form-item label="已消金额" prop="F_SalesAmount">
            <el-input v-model="formData['F_SalesAmount']" type="number" placeholder="请输入已消金额"
              :disabled="hasDisabledPermission('F_SalesAmount',false)"
              :readonly="!hasEditPermission('F_SalesAmount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_financepaymentbill')">
          <avue-form v-loading="preloadLoading116" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option116" v-model="erp_financepaymentbill" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorUserId')">
          <el-form-item label="制单人员" prop="F_CreatorUserId">
            <avue-information-body :operationVal="operationVal" infoType='user'
              :whetherToRebindSecondaryEditing='false' v-model="formData['F_CreatorUserId']"
              placeholder="当前用户制单人员" :disabled="hasDisabledPermission('F_CreatorUserId',true)"
              :readonly="!hasEditPermission('F_CreatorUserId',true)" :style="{width: '100%'}">
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorTime')">
          <el-form-item label="制单时间" prop="F_CreatorTime">
            <el-date-picker :disabled="hasDisabledPermission('F_CreatorTime',false)"
              :readonly="!hasEditPermission('F_CreatorTime',false)" v-model="formData['F_CreatorTime']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择制单时间"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top: 15px; margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_financepayment',
      mainTableName: 'erp_financepayment',
      formConfig: {
        "fields": [{
          "__vModel__": "F_PaymentCode",
          "__config__": {
            "label": "付款编码",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "付款编码",
            "formId": 105
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_PaymentDate",
          "__config__": {
            "label": "付款时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 107
          }
        }, {
          "__vModel__": "F_Manager",
          "__config__": {
            "label": "经办人",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 103
          }
        }, {
          "__vModel__": "F_PurchaseOrderId",
          "__config__": {
            "label": "采购订单",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "{\"110\":\"F_PurchasePeople\",\"111\":\"F_FullName\"}",
            "formId": 108,
            "database": "localDB",
            "sql": "SELECT\n\tp.F_PurchaseOrder,\n\tp.F_Id,\n\tc.F_FullName,\n\tp.F_PurchasePeople\nFROM\n\terp_purchaseorder p\n\tleft join erp_inoutunit c\n\ton p.F_DeliveryUnit=c.F_Id where p.F_InvalidMark=1 and F_AuditMark=2\n-- F_InvalidMark=1 状态等于正常\tF_AuditMark=2 审核状态等于已审核通过",
            "showField": "F_PurchaseOrder",
            "saveField": "F_Id"
          }
        }, {
          "__vModel__": "F_DeliveryUnit",
          "__config__": {
            "label": "供货单位",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 111
          }
        }, {
          "__vModel__": "F_PurchaseMan",
          "__config__": {
            "label": "采购人",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 110
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_TotalPurchases",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "采购总额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 112
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_UnsoldAmount",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "未销金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 113
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_SalesAmount",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "已消金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 114
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 116,
            "children": [{
              "__vModel__": "F_SettlementAccount",
              "__config__": {
                "label": "结算账户",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_financepaymentbill",
                "bindTableField": "F_SettlementAccount"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_PaymentAmount",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "付款金额",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_financepaymentbill",
                "bindTableField": "F_PaymentAmount"
              }
            }, {
              "__vModel__": "F_BillingMethod",
              "__config__": {
                "label": "结算方式",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 8,
                "bindTable": "erp_financepaymentbill",
                "bindTableField": "F_BillingMethod",
                "dataType": "dataItem",
                "dataItem": "Client_PaymentMode"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "备注",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_financepaymentbill",
                "bindTableField": "F_Description"
              }
            }]
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
            "formId": 123
          }
        }, {
          "__vModel__": "F_CreatorUserId",
          "__type__": "info",
          "infoType": "user",
          "__organize__": true,
          "__config__": {
            "label": "制单人员",
            "showLabel": true,
            "tag": "avue-information-body",
            "span": 12,
            "whetherToRebindSecondaryEditing": false,
            "formId": 124,
            "placeholder": "当前用户"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_CreatorTime",
          "__config__": {
            "label": "制单时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 12,
            "formId": 126
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_PaymentCode': '',
        'F_PaymentDate': null,
        'F_Manager': '',
        'F_PurchaseOrderId': '',
        'F_DeliveryUnit': '',
        'F_PurchaseMan': '',
        'F_TotalPurchases': '',
        'F_UnsoldAmount': '',
        'F_SalesAmount': '',
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_PaymentCode: [{
          required: true,
          message: '付款编码',
          trigger: 'blur'
        }],
        F_PaymentDate: [{
          required: true,
          message: '请选择付款时间',
          trigger: 'change'
        }],
        F_Manager: [{
          required: true,
          message: '请输入经办人',
          trigger: 'blur'
        }],
        F_PurchaseOrderId: [],
        F_DeliveryUnit: [],
        F_PurchaseMan: [{
          required: true,
          message: '请输入采购人',
          trigger: 'blur'
        }],
        F_TotalPurchases: [{
          required: true,
          message: '请输入采购总额',
          trigger: 'blur'
        }],
        F_UnsoldAmount: [{
          required: true,
          message: '请输入未销金额',
          trigger: 'blur'
        }],
        F_SalesAmount: [{
          required: true,
          message: '请输入已消金额',
          trigger: 'blur'
        }],
        F_Description: [],
        F_CreatorTime: [],
      },
      F_PurchaseOrderIdOptions: [],
      F_PurchaseOrderIdLoading: false,
      erp_financepaymentbill: {},
      preloadLoading116: false,
    }
  },
  computed: {
    option116() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '',
          prop: 'erp_financepaymentbill',
          type: 'dynamic',
          span: 24,
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              // this.$message.success('新增回调');
              done({});
            },
            rowDel: (row, done) => {
              // this.$message.success('删除回调'+JSON.stringify(row));
              done();
            },
            column:this.getAuthorityTableChildrenList('erp_financepaymentbill', [{
              label: '结算账户',
              prop: 'F_SettlementAccount',
              type: 'input',
            }, {
              label: '付款金额',
              prop: 'F_PaymentAmount',
              type: 'input',
            }, {
              label: '结算方式',
              type: 'select',
              prop: 'F_BillingMethod',
              props: {
                label: 'F_ItemName',
                value: 'F_ItemValue'
              },
              dicUrl:  baseUrl + '/data-items/Client_PaymentMode/detail',
            }, {
              label: '备注',
              prop: 'F_Description',
              type: 'input',
            }, ])
          }
        }, ],
      }
    }
  },
  watch: {
    'formData.F_TotalPurchases': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_UnsoldAmount': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_SalesAmount': function(val, oldVal) {
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
                  
            this.formData = res.data.data.erp_financepayment
            
          this.erp_financepaymentbill.erp_financepaymentbill = res.data.data.erp_financepaymentbill
          
        this.erp_financepaymentbill.erp_financepaymentbill.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_PaymentCodeOptions == "function") {
      await this.getF_PaymentCodeOptions();
    }
    if (typeof this.getF_PurchaseOrderIdOptions == "function") {
      await this.getF_PurchaseOrderIdOptions();
    }
  },
  methods: {
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
              if (this.formSubTableNotRequiredList[bindTable] != undefined) {
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
              if (this.formSubTableDisabledList[bindTable] != undefined) {
                if (this.formSubTableDisabledList[bindTable].includes(ele2.prop)) {
                  ele2.disabled = true;
                }
                else {
                  ele2.disabled = false;
                }
              }
            }
            else {
              ele2.required = false;
              ele2.rules = [];
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
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        erp_financepaymentbillEntityList: this.erp_financepaymentbill.erp_financepaymentbill,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_financepaymentbill.erp_financepaymentbill.forEach(element => {});
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
    async getF_PaymentCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/付款编码/gen',
        });
        if (resp.data.data) {
          this.formData.F_PaymentCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_PurchaseOrderIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_PurchaseOrderIdOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_PurchaseOrder&keyword=' +
              keyword
          });
          this.F_PurchaseOrderIdOptionsLoading = false;
          this.F_PurchaseOrderIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `SELECT
	p.F_PurchaseOrder,
	p.F_Id,
	c.F_FullName,
	p.F_PurchasePeople,
  p.F_TotalPurchases
FROM
	erp_purchaseorder p
	left join erp_inoutunit c
	on p.F_DeliveryUnit=c.F_Id where p.F_InvalidMark=1 and F_AuditMark=2
-- F_InvalidMark=1 状态等于正常	F_AuditMark=2 审核状态等于已审核通过`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_PurchaseOrderIdOptionsLoading = false;
          this.F_PurchaseOrderIdOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_PurchaseOrderId(val) {
      let autoBindFields = JSON.parse('{"110":"F_PurchasePeople","112":"F_TotalPurchases","111":"F_FullName"}');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_PurchaseOrderIdOptions.filter(item => {
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
	margin-bottom: 10px;
}	
</style>
