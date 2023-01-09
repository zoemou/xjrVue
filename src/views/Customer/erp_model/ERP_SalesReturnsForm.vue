<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_SalesReturnCode')">
          <el-form-item label="销售退货单号" prop="F_SalesReturnCode">
            <el-input v-model="formData['F_SalesReturnCode']" placeholder="销售退货单号"
              :disabled="hasDisabledPermission('F_SalesReturnCode',undefined)"
              :readonly="!hasEditPermission('F_SalesReturnCode',true)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ReturnsDate')">
          <el-form-item label="退货日期" prop="F_ReturnsDate">
            <el-date-picker :disabled="hasDisabledPermission('F_ReturnsDate',false)"
              :readonly="!hasEditPermission('F_ReturnsDate',false)" v-model="formData['F_ReturnsDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择退货日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ChargePeople')">
          <el-form-item label="经办人员" prop="F_ChargePeople">
            <el-input v-model="formData['F_ChargePeople']" placeholder="请输入经办人员"
              :disabled="hasDisabledPermission('F_ChargePeople',false)"
              :readonly="!hasEditPermission('F_ChargePeople',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesOutBandNumber')">
          <el-form-item label="销售出库单号" prop="F_SalesOutBandNumber">
            <el-select v-model="formData.F_SalesOutBandNumber" placeholder="请选择销售出库单号"
              :disabled="hasDisabledPermission('F_SalesOutBandNumber',false)"
              :readonly="!hasEditPermission('F_SalesOutBandNumber',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_SalesOutBandNumberOptions"
              @change="handlerSelectF_SalesOutBandNumber" :loading="F_SalesOutBandNumberLoading">
              <el-option v-for="(item, index) in F_SalesOutBandNumberOptions" :key="index"
                :label="item.F_SalesOutCode" :value="{item}" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="F_ClientId">
            <el-select v-model="formData.F_ClientId" placeholder="请选择客户名称"
               filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_ClientIdOptions"
              @change="handlerSelectF_ClientId" :loading="F_ClientIdLoading">
              <el-option v-for="(item, index) in F_ClientIdOptions" :key="index"
                :label="item.F_FullName" :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_WarehouseId')">
          <el-form-item label="退回仓库" prop="F_WarehouseId">
            <el-select v-model="formData.F_WarehouseId" placeholder="请选择退回仓库"
              :disabled="hasDisabledPermission('F_WarehouseId',false)"
              :readonly="!hasEditPermission('F_WarehouseId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_WarehouseIdOptions"
              @change="handlerSelectF_WarehouseId" :loading="F_WarehouseIdLoading">
              <el-option v-for="(item, index) in F_WarehouseIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_salesreturnsentry')">
          <avue-form v-loading="preloadLoading113" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113" v-model="erp_salesreturnsentry" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AuditMark')" hidden="hidden">
          <el-form-item label="审核状态" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_AuditMark',true)"
              :readonly="!hasEditPermission('F_AuditMark',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidMark')" hidden="hidden">
          <el-form-item label="状态" prop="F_InvalidMark">
            <el-input v-model="formData['F_InvalidMark']" placeholder="请输入状态"
              :disabled="hasDisabledPermission('F_InvalidMark',true)"
              :readonly="!hasEditPermission('F_InvalidMark',true)" clearable :style="{width: '100%'}">
            </el-input>
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
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px;margin-bottom: 20px; text-align: center;">
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
      addressUrl:'erp_salesreturns',
      mainTableName: 'erp_salesreturns',
      formConfig: {
        "fields": [{
          "__vModel__": "F_SalesReturnCode",
          "__config__": {
            "label": "销售退货单号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "销售出库单号",
            "formId": 134
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_ReturnsDate",
          "__config__": {
            "label": "退货日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 103
          }
        }, {
          "__vModel__": "F_ChargePeople",
          "__config__": {
            "label": "经办人员",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 101
          }
        }, {
          "__vModel__": "F_SalesOutBandNumber",
          "__config__": {
            "label": "销售出库",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 160,
            "database": "localDB",
            "sql": "select f_id,F_SalesOutCode from erp_salesoutband",
            "showField": "F_SalesOutCode",
            "saveField": "f_id"
          }
        }, {
          "__vModel__": "F_ClientId",
          "__config__": {
            "label": "客户名称",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 161,
            "database": "localDB",
            "sql": "select t.F_Id,t.F_FullName from erp_inoutunit t where t.F_UniType=2",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "__vModel__": "F_WarehouseId",
          "__config__": {
            "label": "默认仓库",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 162,
            "database": "localDB",
            "sql": "SELECT W.F_Id,W.F_FullName FROM erp_warehouse W",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "",
            "layoutTree": true,
            "dataType": "dataSql",
            "span": 24,
            "formId": 113,
            "children": [{
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_GoodsId"
              }
            }, {
              "__vModel__": "F_SalesReturnId",
              "__config__": {
                "label": "退货单id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_SalesReturnId"
              }
            }, {
              "__vModel__": "F_GoodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_GoodsName"
              }
            }, {
              "__vModel__": "F_GoodCode",
              "__config__": {
                "label": "商品编号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_GoodCode"
              }
            }, {
              "__vModel__": "F_Specs",
              "__config__": {
                "label": "规格型号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_Specs"
              }
            }, {
              "__vModel__": "F_UnitId",
              "__config__": {
                "label": "单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_UnitId"
              }
            }, {
              "__vModel__": "F_DefaultWarehouse",
              "__config__": {
                "label": "默认仓库",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_DefaultWarehouse"
              }
            }, {
              "__vModel__": "F_OrderQua",
              "__config__": {
                "label": "订单数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_OrderQua"
              }
            }, {
              "__vModel__": "F_Quantity",
              "__config__": {
                "label": "退货数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": ""
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_UnitPrice",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "单价",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_UnitPrice"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_Amount",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "金额",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_Amount"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_TaxRate",
              "computationalConfiguration": [],
              "prepend": "含税%",
              "__config__": {
                "label": "税率",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_TaxRate"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_TaxPrice",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "含税单价",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_TaxPrice"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_TaxAmount",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "含税金额",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_TaxAmount"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesreturnsentry",
                "bindTableField": "F_Description"
              }
            }],
            "database": "localDB",
            "sql": "\tselect e.* from erp_salesoutband o left join erp_salesoutbandenrty e on o.F_Id=e.F_SalesOutId where o.F_SalesOutCode='OT190409000005'"
          }
        }, {
          "__vModel__": "F_AuditMark",
          "__config__": {
            "label": "审核状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 135
          }
        }, {
          "__vModel__": "F_InvalidMark",
          "__config__": {
            "label": "状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 141
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
            "formId": 122,
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
            "formId": 124
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
            "formId": 142
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_SalesReturnCode': '',
        'F_ReturnsDate': null,
        'F_ChargePeople': '',
        'F_SalesOutBandNumber': '',
        'F_SalesOrderId':'',
        'F_SalesOutBandId': '',
        'F_ClientId':'',
        'F_WarehouseId': '',
        'F_AuditMark': "1",
        'F_InvalidMark': "1",
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
        'F_Description': '',
      },
      rules: {
        F_SalesReturnCode: [{
          required: true,
          message: '销售退货单号',
          trigger: 'blur'
        }],
        F_ReturnsDate: [{
          required: true,
          message: '请选择退货日期',
          trigger: 'change'
        }],
        F_ChargePeople: [],
        F_SalesOutBandNumber: [],
        F_ClientId: [{
          required: true,
          message: '请选择客户名称',
          trigger: 'change'
        }],
        F_WarehouseId: [],
        F_AuditMark: [{
          required: true,
          message: '请输入审核状态',
          trigger: 'blur'
        }],
        F_InvalidMark: [{
          required: true,
          message: '请输入状态',
          trigger: 'blur'
        }],
        F_CreatorTime: [],
        F_Description: [],
      },
      F_SalesOutBandNumberOptions: [],
      F_SalesOutBandNumberLoading: false,
      F_ClientIdOptions: [],
      F_ClientIdLoading: false,
      F_WarehouseIdOptions: [],
      F_WarehouseIdLoading: false,
      erp_salesreturnsentry: {},
      preloadLoading113: false,
    }
  },
  computed: {
    option113 () {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '',
          prop: 'erp_salesreturnsentry',
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
            column: this.getAuthorityTableChildrenList('erp_salesreturnsentry', [{
              label: '订单出库商品id',
              prop: 'F_OutBandEntrtyId',
              type: 'input',
              hide:true,
            }, 
             {
              label: '订单销售商品id',
              prop: 'F_OrderEntryId',
              type: 'input',
              hide:true,
            },
            {
              label: '商品id',
              prop: 'F_GoodsId',
              type: 'input',
              hide:true,
            },  {
              label: '商品名称',
              prop: 'F_GoodsName',
              type: 'input',
            }, {
              label: '商品编号',
              prop: 'F_GoodCode',
              type: 'input',
            }, {
              label: '规格型号',
              prop: 'F_Specs',
              type: 'input',
            }, {
              label: '单位',
              prop: 'F_Unit',
              type: 'select',
               props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
              dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",

            }, {
              label: '默认仓库',
              prop: 'F_DefaultWarehouse',
              hide:true,
              type: 'select',
              props:{
                label:"F_FullName",
                value:"F_Id",
              },
               dicUrl: baseUrl + "/erp_salesorder/getWarehouse",
            }, {
              label: '订单数量',
              prop: 'F_OrderQua',
              type: 'input',
              disabled:true,
            }, 
            {
              label: '已出库数量',
              prop: 'F_OutQua',
              type: 'input',
              disabled:true,
            }, 
             {
              label: '未出库数量',
              prop: 'F_NoOutQua',
              type: 'input',
              disabled:true,
            }, 
            {
              label: '退货数量',
              prop: 'F_Quantity',
              type: 'input',
            }, {
              label: '单价',
              prop: 'F_UnitPrice',
              type: 'input',
            }, {
              label: '金额',
              prop: 'F_Amount',
              type: 'input',
            }, {
              label: '税率',
              prop: 'F_TaxRate',
              type: 'input',
            }, {
              label: '含税单价',
              prop: 'F_TaxPrice',
              type: 'input',
            }, {
              label: '含税金额',
              prop: 'F_TaxAmount',
              type: 'input',
            }, {
              label: '说明信息',
              prop: 'F_Description',
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
                  
            this.formData = res.data.data.erp_salesreturns
            
          this.erp_salesreturnsentry.erp_salesreturnsentry = res.data.data.erp_salesreturnsentry
          
        this.erp_salesreturnsentry.erp_salesreturnsentry.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_SalesReturnCodeOptions == "function") {
      await this.getF_SalesReturnCodeOptions();
    }
    if (typeof this.getF_SalesOutBandNumberOptions == "function") {
      await this.getF_SalesOutBandNumberOptions();
    }
    if (typeof this.getF_ClientIdOptions == "function") {
      await this.getF_ClientIdOptions();
    }
    if (typeof this.getF_WarehouseIdOptions == "function") {
      await this.getF_WarehouseIdOptions();
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
        erp_salesreturnsentryEntityList: this.erp_salesreturnsentry.erp_salesreturnsentry,
      };
    },
    submitForm() {
       var _this=this;
      var isPrompt = false;
      var isNull=false;
       const listInfo = [];
      //判断是否退货数量有大于已出库数量的
        for (let index = 0;index < _this.erp_salesreturnsentry.erp_salesreturnsentry.length;index++) 
        {
           if (_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_Quantity"]==0)
        {
          listInfo.push(_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_Quantity"]);
        }
           //如果退货数量>已出库数量   数量不一致，给出提示 操作是否失误 不能操作
          if(_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_Quantity"] >_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_OutQua"]) 
          {
           
            isPrompt = true;
          }
          //如果退货数量>已出库数量   数量不一致，给出提示 操作是否失误 不能操作
          if(_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_Quantity"] >_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_OutQua"]) 
          {
           
            isPrompt = true;
          }
          //当商品出库单位为空或者商品id为空或者数量为空给出提示 
          if(_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_Unit"]==null||_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_ComUnit"]==null||_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_BasicUnit"]==null||_this.erp_salesreturnsentry.erp_salesreturnsentry[index]["F_GoodsId"]==null)
          {
            isNull=true;
          }
        }
         if (listInfo.length==_this.erp_salesreturnsentry.erp_salesreturnsentry.length) {
          _this.$confirm("商品本次退货数量为0，请检查数量是否正确","提示");
          return;
        }
        if (isNull) {
          _this.$confirm("请检查商品单位是否配置完整","提示");
          return;
        }
        if (isPrompt) {
          _this.$confirm("退货数量大于已出库数量，数量不一致，请确认后再操作","提示");
          return;
        }
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_salesreturnsentry.erp_salesreturnsentry.forEach(element => {});
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
    async getF_SalesReturnCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/return/gen',
        });
        if (resp.data.data) {
          this.formData.F_SalesReturnCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_SalesOutBandNumberOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_SalesOutBandNumberOptionsLoading = true;
      }
      try {
          let params = {};
          params.sql = `select F_Id,F_SalesOrderId,F_SalesOutCode,F_ClientId,F_WarehouseId from erp_salesoutband`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_SalesOutBandNumberOptionsLoading = false;
          this.F_SalesOutBandNumberOptions = resp.data.data;
        }
      catch (error) {}
    },
   async handlerSelectF_SalesOutBandNumber(val) {
      this.formData.F_ClientId=val.item.F_ClientId;
      this.formData.F_SalesOutBandId=val.item.F_Id;
      this.formData.F_WarehouseId=val.item.F_WarehouseId;
      this.formData.F_SalesOutBandNumber=val.item.F_SalesOutCode;
      this.formData.F_SalesOrderId=val.item.F_SalesOrderId;
      let reps=await this.$axios({
        method:"get",
        url: baseUrl + "/database-links/localDB/datas",
        params:{
          sql:`select e.F_Id F_OutBandEntrtyId,e.F_OrderEntryId,e.F_GoodsId,e.F_GoodsName,e.F_GoodCode,e.F_Specs,e.F_Unit,g.F_BasicUnit,g.F_ComUnit,e.F_UnitPrice,e.F_Amount,e.F_OrderQua,0 as outQuantity,e.F_OutQua,e.F_NoOutQua,e.F_Description,e.F_DefaultWarehouse,e.F_TaxRate,e.F_TaxPrice,e.F_TaxAmount,e.F_Description from erp_salesoutbandenrty e left join erp_goods g on e.F_GoodsId=g.F_Id where  e.F_SalesOutId="${val.item.F_Id}"`
          }
      });
      if(reps.data)
      {
        let {data}=reps.data;
        let dynamic=this.getDicData(
          data,
          '{"F_OutBandEntrtyId":"F_OutBandEntrtyId","F_OrderEntryId":"F_OrderEntryId","F_GoodsId":"F_GoodsId","F_GoodsName":"F_GoodsName","F_GoodCode":"F_GoodCode","F_Specs":"F_Specs","F_Unit":"F_Unit","F_UnitId":"F_Unit","F_BasicUnit":"F_BasicUnit","F_ComUnit":"F_ComUnit","F_OutQua":"F_OutQua","F_NoOutQua":"F_NoOutQua","F_OrderQua":"F_OrderQua","F_UnitPrice":"F_UnitPrice","F_Amount":"F_Amount","F_TaxRate":"F_TaxRate","F_TaxPrice":"F_TaxPrice","F_TaxPrice":"F_TaxPrice","F_TaxAmount":"F_TaxAmount","F_DefaultWarehouse":"F_DefaultWarehouse","F_Quantity":"outQuantity","F_Des":"F_Des"}')
          this.erp_salesreturnsentry.erp_salesreturnsentry=dynamic;
      }
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'f_id'
      //得对应数据列
      let data = this.F_SalesOutBandNumberOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);


    },
    async getF_ClientIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_ClientIdOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_FullName&keyword=' +
              keyword
          });
          this.F_ClientIdOptionsLoading = false;
          this.F_ClientIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `select t.F_Id,t.F_FullName from erp_inoutunit t where t.F_UniType=2`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_ClientIdOptionsLoading = false;
          this.F_ClientIdOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_ClientId(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_ClientIdOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    async getF_WarehouseIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_WarehouseIdOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_FullName&keyword=' +
              keyword
          });
          this.F_WarehouseIdOptionsLoading = false;
          this.F_WarehouseIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `SELECT W.F_Id,W.F_FullName FROM erp_warehouse W`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_WarehouseIdOptionsLoading = false;
          this.F_WarehouseIdOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_WarehouseId(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_WarehouseIdOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    getDicData(arr, prestrainFieldsConf) {
      let resultArr = [];
      prestrainFieldsConf = JSON.parse(prestrainFieldsConf) || {};
      arr.map(item => {
        let _obj = {};
        for (let key in prestrainFieldsConf) {
          _obj[key] = item[prestrainFieldsConf[key]];
        }
        resultArr.push(_obj);
      });
      return resultArr;
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
