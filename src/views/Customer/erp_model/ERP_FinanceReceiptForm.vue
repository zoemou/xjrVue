<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_ReceiptCode')">
          <el-form-item label="收款编码" prop="F_ReceiptCode">
            <el-input v-model="formData['F_ReceiptCode']" placeholder="收款编码"
              :disabled="hasDisabledPermission('F_ReceiptCode',undefined)"
              :readonly="!hasEditPermission('F_ReceiptCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_InvoiceDate')">
          <el-form-item label="收款日期" prop="F_InvoiceDate">
            <el-date-picker :disabled="hasDisabledPermission('F_InvoiceDate',false)"
              :readonly="!hasEditPermission('F_InvoiceDate',false)" v-model="formData['F_InvoiceDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择收款日期"
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
          <el-form-item label="销售订单" prop="F_PurchaseOrderId">
            <el-select v-model="formData.F_PurchaseOrderId" placeholder="请选择销售订单"
              :disabled="hasDisabledPermission('F_PurchaseOrderId',false)"
              :readonly="!hasEditPermission('F_PurchaseOrderId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_PurchaseOrderIdOptions"
              @change="handlerSelectF_PurchaseOrderId" :loading="F_PurchaseOrderIdLoading">
              <el-option v-for="(item, index) in F_PurchaseOrderIdOptions" :key="index"
                :label="item.F_SalesCode" :value="item.orderid" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ClientId')">
          <el-form-item label="客户" prop="F_ClientId">
            <el-input v-model="formData['F_ClientId']" placeholder="请输入客户"
              :disabled="hasDisabledPermission('F_ClientId',false)"
              :readonly="!hasEditPermission('F_ClientId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseMan')">
          <el-form-item label="销售人员" prop="F_PurchaseMan">
            <el-input v-model="formData['F_PurchaseMan']" placeholder="请输入销售人员"
              :disabled="hasDisabledPermission('F_PurchaseMan',false)"
              :readonly="!hasEditPermission('F_PurchaseMan',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DocumentAmount')">
          <el-form-item label="单据金额" prop="F_DocumentAmount">
            <el-input v-model="formData['F_DocumentAmount']" placeholder="请输入单据金额"
              :disabled="hasDisabledPermission('F_DocumentAmount',false)"
              :readonly="!hasEditPermission('F_DocumentAmount',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_UnsoldAmount')">
          <el-form-item label="未消金额" prop="F_UnsoldAmount">
            <el-input v-model="formData['F_UnsoldAmount']" placeholder="请输入未消金额"
              :disabled="hasDisabledPermission('F_UnsoldAmount',false)"
              :readonly="!hasEditPermission('F_UnsoldAmount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesAmount')">
          <el-form-item label="已消金额" prop="F_SalesAmount">
            <el-input v-model="formData['F_SalesAmount']" placeholder="请输入已消金额"
              :disabled="hasDisabledPermission('F_SalesAmount',false)"
              :readonly="!hasEditPermission('F_SalesAmount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_financereceiptbill')">
          <avue-form v-loading="preloadLoading113" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113" v-model="erp_financereceiptbill" :disabled="disabled">
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
              placeholder="当前用户制单人员" :disabled="hasDisabledPermission('F_CreatorUserId',false)"
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
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top: 15px;margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_financereceipt',
      mainTableName: 'erp_financereceipt',
      formConfig: {
        "fields": [{
          "__vModel__": "F_ReceiptCode",
          "__config__": {
            "label": "收款编码",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "skbm",
            "formId": 101
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_InvoiceDate",
          "__config__": {
            "label": "收款日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 102
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
            "label": "销售订单",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "{\"107\":\"F_SalesPersonId\",\"112\":\"F_FullName\"}",
            "formId": 104,
            "database": "localDB",
            "sql": "SELECT\n\to.F_Id orderid,\n\to.F_SalesCode,\n\ti.F_FullName,\n\ti.F_Id clientId,\n\to.F_Turnover,\n\to.F_SalesPersonId \nFROM\n\terp_salesorder o\n\tleft JOIN erp_inoutunit i ON o.F_ClientId = i.F_Id \nWHERE\n\to.F_InvalidMark=1",
            "showField": "F_SalesCode",
            "saveField": "orderid"
          }
        }, {
          "__vModel__": "F_ClientId",
          "__config__": {
            "label": "客户",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 112
          }
        }, {
          "__vModel__": "F_PurchaseMan",
          "__config__": {
            "label": "销售人员",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 107
          }
        }, {
          "__vModel__": "F_DocumentAmount",
          "__config__": {
            "label": "单据金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 108
          }
        }, {
          "__vModel__": "F_UnsoldAmount",
          "__config__": {
            "label": "未消金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 109
          }
        }, {
          "__vModel__": "F_SalesAmount",
          "__config__": {
            "label": "已消金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 111
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "",
            "layoutTree": true,
            "dataType": "",
            "span": 23,
            "formId": 113,
            "children": [{
              "__vModel__": "F_SettlementAccount",
              "__config__": {
                "label": "结算账户",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 23,
                "bindTable": "erp_financereceiptbill",
                "bindTableField": "F_SettlementAccount"
              }
            }, {
              "__vModel__": "F_PaymentAmount",
              "__config__": {
                "label": "收款金额",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 23,
                "bindTable": "erp_financereceiptbill",
                "bindTableField": "F_PaymentAmount"
              }
            }, {
              "__vModel__": "F_BillingMethod",
              "__config__": {
                "label": "结算方式",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 23,
                "bindTable": "erp_financereceiptbill",
                "bindTableField": "F_BillingMethod",
                "dataType": "dataItem",
                "dataItem": "Client_PaymentMode"
              }
            }, {
              "__vModel__": "F_SettlementNumber",
              "__config__": {
                "label": "结算号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 23,
                "bindTable": "erp_financereceiptbill",
                "bindTableField": "F_SettlementNumber"
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
            "span": 23,
            "formId": 119
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
            "formId": 120,
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
            "formId": 121
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_ReceiptCode': '',
        'F_InvoiceDate': null,
        'F_Manager': '',
        'F_PurchaseOrderId': '',
        'F_ClientId': '',
        'F_PurchaseMan': '',
        'F_DocumentAmount': '',
        'F_UnsoldAmount': '',
        'F_SalesAmount': '',
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_ReceiptCode: [{
          required: true,
          message: '收款编码',
          trigger: 'blur'
        }],
        F_InvoiceDate: [{
          required: true,
          message: '请选择收款日期',
          trigger: 'change'
        }],
        F_Manager: [{
          required: true,
          message: '请输入经办人',
          trigger: 'blur'
        }],
        F_PurchaseOrderId: [],
        F_ClientId: [],
        F_PurchaseMan: [{
          required: true,
          message: '请输入销售人员',
          trigger: 'blur'
        }],
        F_DocumentAmount: [{
          required: true,
          message: '请输入单据金额',
          trigger: 'blur'
        }],
        F_UnsoldAmount: [{
          required: true,
          message: '请输入未消金额',
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
      erp_financereceiptbill: {},
      preloadLoading113: false,
    }
  },
  computed: {
    option113() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '',
          prop: 'erp_financereceiptbill',
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
            column: this.getAuthorityTableChildrenList('erp_financereceiptbill',[{
              label: '结算账户',
              prop: 'F_SettlementAccount',
              type: 'input',
            }, {
              label: '收款金额',
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
              label: '结算号',
              prop: 'F_SettlementNumber',
              type: 'input',
            }, ])
          }
        }, ],
      }
    }
  },
  watch: {},
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
                  
            this.formData = res.data.data.erp_financereceipt
            
          this.erp_financereceiptbill.erp_financereceiptbill = res.data.data.erp_financereceiptbill
          
        this.erp_financereceiptbill.erp_financereceiptbill.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_ReceiptCodeOptions == "function") {
      await this.getF_ReceiptCodeOptions();
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
        erp_financereceiptbillEntityList: this.erp_financereceiptbill.erp_financereceiptbill,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_financereceiptbill.erp_financereceiptbill.forEach(element => {});
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
    async getF_ReceiptCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/skbm/gen',
        });
        if (resp.data.data) {
          this.formData.F_ReceiptCode = resp.data.data;
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
            url:  baseUrl + '/data-sources/undefined/data/?field=F_SalesCode&keyword=' +
              keyword
          });
          this.F_PurchaseOrderIdOptionsLoading = false;
          this.F_PurchaseOrderIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `SELECT
                        o.F_Id orderid,
                        o.F_SalesCode,
                        i.F_FullName,
                        i.F_Id clientId,
                        o.F_Turnover,
                        o.F_SalesPersonId 
                      FROM
                        erp_salesorder o
                        left JOIN erp_inoutunit i ON o.F_ClientId = i.F_Id 
                      WHERE
                        o.F_InvalidMark=1`;
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
      let autoBindFields = JSON.parse('{"107":"F_SalesPersonId","108":"F_Turnover","112":"F_FullName"}');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'orderid'
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
