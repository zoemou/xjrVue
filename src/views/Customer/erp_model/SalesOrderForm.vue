<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_SalesCode')">
          <el-form-item label="单据编号" prop="F_SalesCode">
            <el-input v-model="formData['F_SalesCode']" placeholder="单据编号"
              :disabled="hasDisabledPermission('F_SalesCode',undefined)"
              :readonly="!hasEditPermission('F_SalesCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Orderdate')">
          <el-form-item label="订单日期" prop="F_Orderdate">
            <el-date-picker :disabled="hasDisabledPermission('F_Orderdate',false)"
              :readonly="!hasEditPermission('F_Orderdate',false)" v-model="formData['F_Orderdate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择订单日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryDate')">
          <el-form-item label="发货日期" prop="F_DeliveryDate">
            <el-date-picker :disabled="hasDisabledPermission('F_DeliveryDate',false)"
              :readonly="!hasEditPermission('F_DeliveryDate',false)" v-model="formData['F_DeliveryDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择发货日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ClientId')">
          <el-form-item label="客户名称" prop="F_ClientId">
            <el-select v-model="formData.F_ClientId" placeholder="请选择客户名称"
              :disabled="hasDisabledPermission('F_ClientId',false)"
              :readonly="!hasEditPermission('F_ClientId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_ClientIdOptions"
              @change="handlerSelectF_ClientId" :loading="F_ClientIdLoading">
              <el-option v-for="(item, index) in F_ClientIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesType')">
          <el-form-item label="销售类型" prop="F_SalesType">
            <el-select v-model="formData['F_SalesType']" placeholder="请选择销售类型"
              :disabled="hasDisabledPermission('F_SalesType',false)"
              :readonly="!hasEditPermission('F_SalesType',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_SalesTypeOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesPersonId')">
          <el-form-item label="销售人员" prop="F_SalesPersonId">
            <el-input v-model="formData['F_SalesPersonId']" placeholder="请输入销售人员"
              :disabled="hasDisabledPermission('F_SalesPersonId',false)"
              :readonly="!hasEditPermission('F_SalesPersonId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentMethod')">
          <el-form-item label="收款方式" prop="F_PaymentMethod">
            <el-select v-model="formData['F_PaymentMethod']" placeholder="请选择收款方式"
              :disabled="hasDisabledPermission('F_PaymentMethod',false)"
              :readonly="!hasEditPermission('F_PaymentMethod',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_PaymentMethodOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentPeriod')">
          <el-form-item label="付款期限" prop="F_PaymentPeriod">
            <el-date-picker :disabled="hasDisabledPermission('F_PaymentPeriod',false)"
              :readonly="!hasEditPermission('F_PaymentPeriod',false)"
              v-model="formData['F_PaymentPeriod']" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择付款期限" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_IsInvoice')">
          <el-form-item label="是否开票" prop="F_IsInvoice">
            <el-checkbox-group v-model="formData['F_IsInvoice']" size="medium"
              :disabled="hasDisabledPermission('F_IsInvoice',false)"
              :readonly="!hasEditPermission('F_IsInvoice',undefined)">
              <el-checkbox v-for="(item, index) in F_IsInvoiceOptions" :key="index" :label="item.F_ItemValue"
                :disabled="item.disabled">{{item.F_ItemName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Discount')">
          <el-form-item label="优惠折扣（%）" prop="F_Discount">
            <el-input v-model="formData['F_Discount']" placeholder="请输入优惠折扣（%）"
              :disabled="hasDisabledPermission('F_Discount',false)"
              :readonly="!hasEditPermission('F_Discount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DiscountedPrice')">
          <el-form-item label="优惠金额" prop="F_DiscountedPrice">
            <el-input v-model="formData['F_DiscountedPrice']" type="number" placeholder="请输入优惠金额"
              :disabled="hasDisabledPermission('F_DiscountedPrice',false)"
              :readonly="!hasEditPermission('F_DiscountedPrice',false)" clearable
              :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Turnover')">
          <el-form-item label="成交金额" prop="F_Turnover">
            <el-input v-model="formData['F_Turnover']" type="number" placeholder="请输入成交金额"
              :disabled="hasDisabledPermission('F_Turnover',false)"
              :readonly="!hasEditPermission('F_Turnover',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
          <el-col :span="8" >
                <el-form-item label="状态" prop="F_Status" hidden="hidden">
                  <el-select v-model="formData.F_Status" placeholder="状态"
                    :disabled="hasDisabledPermission('F_Status',false)"
                    :readonly="!hasEditPermission('F_Status',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_StatusOptions"
                    @change="handlerSelectF_Status">
                    <el-option v-for="(item, index) in F_StatusOptions" :key="index" :label="item.F_FullName"
                      :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_salesorderentry')">
          <avue-form v-loading="preloadLoading113" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113" v-model="erp_salesorderentry" :disabled="disabled">
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
          <el-form-item label="有效状态" prop="F_InvalidMark">
            <el-input v-model="formData['F_InvalidMark']" placeholder="请输入状态"
              :disabled="hasDisabledPermission('F_InvalidMark',true)"
              :readonly="!hasEditPermission('F_InvalidMark',true)" clearable :style="{width: '100%'}">
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
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px;margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_salesorder',
      mainTableName: 'erp_salesorder',
      formConfig: {
        "fields": [{
          "__vModel__": "F_SalesCode",
          "__config__": {
            "label": "单据编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "销售订单单据编号",
            "formId": 134
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_Orderdate",
          "__config__": {
            "label": "订单日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 103
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_DeliveryDate",
          "__config__": {
            "label": "发货日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8
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
            "formId": 106,
            "database": "localDB",
            "sql": "select t.F_Id,t.F_FullName from erp_inoutunit t where t.F_UniType=2",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "__vModel__": "F_SalesType",
          "__config__": {
            "label": "销售类型",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "formId": 107,
            "dataType": "dataItem",
            "dataItem": "SaleType"
          }
        }, {
          "__vModel__": "F_SalesPersonId",
          "__config__": {
            "label": "销售人员",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 101
          }
        }, {
          "__vModel__": "F_PaymentMethod",
          "__config__": {
            "label": "收款方式",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "formId": 108,
            "dataType": "dataItem",
            "dataItem": "Client_PaymentMode"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_PaymentPeriod",
          "__config__": {
            "label": "付款期限",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 109
          }
        }, {
          "__vModel__": "F_IsInvoice",
          "__config__": {
            "label": "是否开票",
            "tag": "el-checkbox-group",
            "avueType": "checkbox",
            "span": 8,
            "showLabel": true,
            "formId": 110,
            "dataType": "dataItem",
            "dataItem": "YesOrNo"
          }
        }, {
          "__vModel__": "F_Discount",
          "__config__": {
            "label": "优惠折扣（%）",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 111
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_DiscountedPrice",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "优惠金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 112
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_Turnover",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "成交金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8
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
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_GoodsId"
              }
            }, {
              "__vModel__": "F_GoodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
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
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_GoodCode"
              }
            }, {
              "__vModel__": "F_Unit",
              "__config__": {
                "label": "单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Unit"
              }
            }, {
              "__vModel__": "F_Inventory",
              "__config__": {
                "label": "库存",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Inventory"
              }
            }, {
              "__vModel__": "F_Specs",
              "__config__": {
                "label": "规格型号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Specs"
              }
            }, {
              "__vModel__": "F_DefaultWarehouse",
              "__config__": {
                "label": "默认仓库",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_DefaultWarehouse"
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
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_UnitPrice"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_Quantity",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Quantity"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_NoOutQua",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "未入库数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_NoOutQua"
              }
            },
            {
              "tempType": "number",
              "__vModel__": "F_OutQua",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "已入库数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_OutQua"
              }
            },  {
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
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Amount"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Description"
              }
            }],
            "database": "localDB",
            "sql": "\tselect g.F_Id,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice,i.F_ComAmount,i.F_WarehouseId from \terp_goods g left join erp_inventory i on g.F_Id=i.F_GoodsId\n\t\t"
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
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_SalesCode': '',
        'F_Orderdate': null,
        "F_Status":null,
        'F_DeliveryDate': null,
        'F_ClientId': '',
        'F_SalesType': '',
        'F_SalesPersonId': '',
        'F_PaymentMethod': '',
        'F_PaymentPeriod': null,
        'F_IsInvoice': [],
        'F_Discount': '',
        'F_DiscountedPrice': 0,
        'F_Turnover': 0,
        'F_AuditMark': "1",
        'F_InvalidMark': "1",
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_SalesCode: [{
          required: true,
          message: '单据编号',
          trigger: 'blur'
        }],
        F_Orderdate: [{
          required: true,
          message: '请选择订单日期',
          trigger: 'change'
        }],
        F_DeliveryDate: [{
          required: true,
          message: '请选择发货日期',
          trigger: 'change'
        }],
        F_ClientId: [{
          required: true,
          message: '请选择客户名称',
          trigger: 'change'
        }],
        F_SalesType: [],
        F_SalesPersonId: [{
          required: true,
          message: '请输入销售人员',
          trigger: 'blur'
        }],
        F_PaymentMethod: [],
        F_PaymentPeriod: [],
        F_IsInvoice: [],
        F_Discount: [],
        F_DiscountedPrice: [],
        F_Turnover: [],
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
        F_Description: [],
        F_CreatorTime: [],
      },
      F_ClientIdOptions: [],
      F_ClientIdLoading: false,
      F_SalesTypeOptions: [],
      F_PaymentMethodOptions: [],
      F_IsInvoiceOptions: [],
      erp_salesorderentry: {},
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
          prop: 'erp_salesorderentry',
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
            column:this.getAuthorityTableChildrenList('erp_salesorderentry',[{
              label: '商品id',
              prop: 'F_GoodsId',
              type: 'input',
            }, {
              label: '商品名称',
              prop: 'F_GoodsName',
              type: 'input',
            }, {
              label: '商品编号',
              prop: 'F_GoodCode',
              type: 'input',
            }, {
             label: "单位",
                  prop: "F_Unit",
                  type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            },
            //  {
            //   label: '库存',
            //   prop: 'F_Inventory',
            //   type: 'input',
            // },
             {
              label: '规格型号',
              prop: 'F_Specs',
              type: 'input',
            }, {
              label: '默认仓库',
              prop: 'F_DefaultWarehouse',
              type: 'select',
              props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_salesorder/getWarehouse",
            }, {
              label: '单价',
              prop: 'F_UnitPrice',
              type: 'input',
            },
             {
              label: '数量',
              prop: 'F_Quantity',
              type: 'number',
            },
             {
              label: '未出库数量',
              prop: 'F_NoOutQua',
              type: 'number',
              disabled:true,
            },
             {
              label: '已出库数量',
              prop: 'F_OutQua',
              type: 'number',
              disabled:true,
            },
            
            {
              label: '金额',
              prop: 'F_Amount',
              type: 'input',
            }, 
             {
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
            },  {
              label: '说明信息',
              prop: 'F_Description',
              type: 'input',
            }, ])
          }
        }, ],
      }
    }
  },
  watch: {
    'formData.F_DiscountedPrice': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_Turnover': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    erp_salesorderentry:{
      handler()
      {
  
         
        this.erp_salesorderentry.erp_salesorderentry.map(item=>{
          item.F_Amount=item.F_UnitPrice*item.F_Quantity;
          item.F_NoOutQua=item.F_Quantity-item.F_OutQua;
          console.log(item.F_GoodsId);
           console.log(item.F_DefaultWarehouse);
           
        })
      },
      immediate:true,
      deep :true
    }
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
                  
            this.formData = res.data.data.erp_salesorder
            
          this.erp_salesorderentry.erp_salesorderentry = res.data.data.erp_salesorderentry
          
            if(res.data.data.erp_salesorder.F_IsInvoice){
              this.formData.F_IsInvoice = res.data.data.erp_salesorder.F_IsInvoice.split(',')
            }
            
        this.erp_salesorderentry.erp_salesorderentry.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_SalesCodeOptions == "function") {
      await this.getF_SalesCodeOptions();
    }
    if (typeof this.getF_ClientIdOptions == "function") {
      await this.getF_ClientIdOptions();
    }
    if (typeof this.getF_SalesTypeOptions == "function") {
      await this.getF_SalesTypeOptions();
    }
    if (typeof this.getF_PaymentMethodOptions == "function") {
      await this.getF_PaymentMethodOptions();
    }
    if (typeof this.getF_IsInvoiceOptions == "function") {
      await this.getF_IsInvoiceOptions();
    }
    if (this.isAdd) {
      await this.preloadData113()
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
        erp_salesorderentryEntityList: this.erp_salesorderentry.erp_salesorderentry,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        if (this.formData.F_IsInvoice instanceof Array) this.formData.F_IsInvoice = this.formData
          .F_IsInvoice.join(',')
        this.erp_salesorderentry.erp_salesorderentry.forEach(element => {});
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
         if(this.formData.F_Status==1)
         {
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
          else
         {
            this.$confirm("已出库和部分出库的订单数量不能修改","提示");
           return;
         }

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
    async getF_SalesCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/销售订单单据编号/gen',
        });
        if (resp.data.data) {
          this.formData.F_SalesCode = resp.data.data;
        }
      }
      catch (error) {}
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
    async getF_SalesTypeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/SaleType/detail',
        });
        if (resp.data.data) {
          this.F_SalesTypeOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_PaymentMethodOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/Client_PaymentMode/detail',
        });
        if (resp.data.data) {
          this.F_PaymentMethodOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_IsInvoiceOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/YesOrNo/detail',
        });
        if (resp.data.data) {
          this.F_IsInvoiceOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    async preloadData113() {
      //编辑时 取消预加载
      if (this.keyValue) return;
      this.preloadLoading113 = true;
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
            method: 'get',
            url:  baseUrl + '/database-links/localDB/datas',
            params: {
              sql: 'SELECT g.F_Id,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice,g.F_DefaultWarehouse,g.F_OutUnit,i.F_ComAmount,0 as F_Quantity,0 as F_OutQua FROM erp_goods g left join erp_inventory i on g.F_DefaultWarehouse=i.F_WarehouseId and g.F_Id=i.F_GoodsId'}
            });
          if (resp.data) {
            let {
              data
            } = resp.data
            let dynamic = this.getDicData(data,
              '{"F_GoodsId":"F_Id","F_GoodsName":"F_FullName","F_GoodCode":"F_EnCode","F_Unit":"F_OutUnit","F_Inventory":"F_ComAmount","F_Specs":"F_Specs","F_DefaultWarehouse":"F_DefaultWarehouse","F_Quantity":"F_Quantity","F_OutQua":"F_OutQua","F_NoOutQua":"F_NoOutQua","F_UnitPrice":"F_SalePrice","F_Amount":"","F_TaxRate":"","F_TaxPrice":"","F_TaxAmount":"","F_Description":""}'
              );
            this.erp_salesorderentry.erp_salesorderentry = dynamic;
            this.preloadLoading113 = false;
          }
        }
        catch (error) {}
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
/deep/ .el-checkbox__label{
	font-size: 12px;
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
