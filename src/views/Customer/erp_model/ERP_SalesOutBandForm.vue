<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_SalesOutCode')">
          <el-form-item label="销售出库单号" prop="F_SalesOutCode">
            <el-input v-model="formData['F_SalesOutCode']" placeholder="销售出库单号"
              :disabled="hasDisabledPermission('F_SalesOutCode',undefined)"
              :readonly="!hasEditPermission('F_SalesOutCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesOrderId')">
          <el-form-item label="销售订单" prop="F_SalesOrderId">
            <el-select v-model="formData.F_SalesOrderNumber" placeholder="请选择销售订单"
              :disabled="hasDisabledPermission('F_SalesOrderId',false)"
              :readonly="!hasEditPermission('F_SalesOrderId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_SalesOrderIdOptions"
              @change="handlerSelectF_SalesOrderId" :loading="F_SalesOrderIdLoading">
              <el-option v-for="(item, index) in F_SalesOrderIdOptions" :key="index" :label="item.F_SalesCode"
                :value="{item}" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SalesOutDate')">
          <el-form-item label="出库日期" prop="F_SalesOutDate">
            <el-date-picker :disabled="hasDisabledPermission('F_SalesOutDate',false)"
              :readonly="!hasEditPermission('F_SalesOutDate',false)" v-model="formData['F_SalesOutDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择出库日期"
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
        <el-col :span="8" v-if="hasFormPermission('F_WarehouseId')">
          <el-form-item label="出库仓库" prop="F_WarehouseId">
            <el-select v-model="formData.F_WarehouseId" placeholder="请选择出库仓库"
              :disabled="hasDisabledPermission('F_WarehouseId',false)"
              :readonly="!hasEditPermission('F_WarehouseId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_WarehouseIdOptions"
              @change="handlerSelectF_WarehouseId" :loading="F_WarehouseIdLoading">
              <el-option v-for="(item, index) in F_WarehouseIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_salesoutbandenrty')">
          <avue-form v-loading="preloadLoading113" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113" v-model="erp_salesoutbandenrty" :disabled="disabled">
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
        <el-col :span="24" v-if="!isWorkflowForm">
          <el-form-item size="mini" v-if="isEdit"style="margin-top:15px; margin-bottom: 20px; text-align: center;">
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
      addressUrl:'erp_salesoutband',
      mainTableName: 'erp_salesoutband',
      formConfig: {
        "fields": [{
          "__vModel__": "F_SalesOutCode",
          "__config__": {
            "label": "销售出库单号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "销售出库单号",
            "formId": 134
          }
        }, {
          "__vModel__": "F_SalesOrderId",
          "__config__": {
            "label": "销售订单",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 160,
            "database": "localDB",
            "sql": "\t\tselect o.F_Id,o.F_SalesCode from erp_salesorder o\n",
            "showField": "F_SalesCode",
            "saveField": "F_Id"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_SalesOutDate",
          "__config__": {
            "label": "出库日期",
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
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_GoodsId"
              }
            }, {
              "__vModel__": "F_OrderEntryId",
              "__config__": {
                "label": "订单商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_OrderEntryId"
              }
            }, {
              "__vModel__": "F_GoodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_Specs"
              }
            }, {
              "__vModel__": "F_Unit",
              "__config__": {
                "label": "单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": ""
              }
            },  {
              "__vModel__": "F_UnitId",
              "__config__": {
                "label": "单位",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 125,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_UnitId",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            },{
              "__vModel__": "F_DefaultWarehouse",
              "__config__": {
                "label": "默认仓库",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_OrderQua"
              }
            }, {
              "__vModel__": "F_Quantity",
              "__config__": {
                "label": "出库数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_Quantity"
              }
            }, {
              "__vModel__": "F_UnitPrice",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "单价",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
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
                "bindTable": "erp_salesoutbandenrty",
                "bindTableField": "F_Description"
              }
            }],
            "database": "localDB",
            "sql": "select e.* from erp_salesorder o left join erp_salesorderentry e on o.F_Id=e.F_SalesOrderId where o.F_SalesCode='SD190409000005'"
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
        'F_SalesOutCode': '',
        'F_SalesOrderId': "",
        'F_SalesOrderNumber':"",
        'F_SalesOutDate': null,
        'F_ChargePeople': '',
        'F_ClientId': '',
        'F_WarehouseId': '',
        'F_AuditMark': "1",
        'F_InvalidMark': "1",
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
        'F_Description': '',
        'F_Status':null,
      },
      rules: {
        F_SalesOutCode: [{
          required: true,
          message: '销售出库单号',
          trigger: 'blur'
        }],
        F_SalesOrderNumber: [],
        F_SalesOutDate: [{
          required: true,
          message: '请选择出库日期',
          trigger: 'change'
        }],
        F_ChargePeople: [],
        F_ClientId: [{
          required: true,
          message: '请选择客户名称',
          trigger: 'change'
        }],
          F_WarehouseId: [{
          required: true,
          message: '请选择仓库名称',
          trigger: 'change'
        }],
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
      F_SalesOrderIdOptions: [],
      F_SalesOrderIdLoading: false,
      F_ClientIdOptions: [],
      F_ClientIdLoading: false,
      F_WarehouseIdOptions: [],
      F_WarehouseIdLoading: false,
      erp_salesoutbandenrty: {},
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
          prop: 'erp_salesoutbandenrty',
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
            column:this.getAuthorityTableChildrenList('erp_salesoutbandenrty',[{
              label: '商品id',
              prop: 'F_GoodsId',
              type: 'input',
              hide:true,
            }, {
              label: '订单商品id',
              prop: 'F_OrderEntryId',
              type: 'input',
              hide:true,
            }, {
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

            }, 
             {
              label: '单位Id',
              prop: 'F_UnitId',
              value: '',
              hide:true,
              type: 'select',
              props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
              dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
              width: null,
              placeholder: '请选择单位',
              formslot: false,
            },{
              label: '默认仓库',
              prop: 'F_DefaultWarehouse',
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
              label: '本次出库数量',
              prop: 'F_Quantity',
              type: "number",
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
  watch: {
    erp_salesoutbandenrty:{
      handler()
      {
        this.erp_salesoutbandenrty.erp_salesoutbandenrty.map(item=>{
          item.F_UnitId=item.F_Unit;
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
                  
            this.formData = res.data.data.erp_salesoutband
            
          this.erp_salesoutbandenrty.erp_salesoutbandenrty = res.data.data.erp_salesoutbandenrty
          
        this.erp_salesoutbandenrty.erp_salesoutbandenrty.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_SalesOutCodeOptions == "function") {
      await this.getF_SalesOutCodeOptions();
    }
    if (typeof this.getF_SalesOrderIdOptions == "function") {
      await this.getF_SalesOrderIdOptions();
    }
    if (typeof this.getF_ClientIdOptions == "function") {
      await this.getF_ClientIdOptions();
    }
    if (typeof this.getF_WarehouseIdOptions == "function") {
      await this.getF_WarehouseIdOptions();
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
        erp_salesoutbandenrtyEntityList: this.erp_salesoutbandenrty.erp_salesoutbandenrty,
      };
    },
    submitForm() {
      var _this=this;
       const listInfo = [];
       var isPrompt = false;
       console.log(_this.erp_salesoutbandenrty.erp_salesoutbandenrty.length);
      for (let index = 0; index < _this.erp_salesoutbandenrty.erp_salesoutbandenrty.length; index++) {
        if (_this.erp_salesoutbandenrty.erp_salesoutbandenrty[index]["F_Quantity"]==0)
        {
          listInfo.push(_this.erp_salesoutbandenrty.erp_salesoutbandenrty[index]["F_Quantity"]);
        }
        //如果已出库数量+本次出库数量>总数量   数量不一致，给出提示 是否要操作
          if(_this.erp_salesoutbandenrty.erp_salesoutbandenrty[index]["F_OutQua"] +_this.erp_salesoutbandenrty.erp_salesoutbandenrty[index]["F_Quantity"]>_this.erp_salesoutbandenrty.erp_salesoutbandenrty[index]["F_OrderQua"]) 
          {
            isPrompt = true;
          }
      }
       if (listInfo.length==_this.erp_salesoutbandenrty.erp_salesoutbandenrty.length) {
          _this.$confirm("商品本次出库数量为0，请检查数量是否正确","提示");
          return;
        }
        if (isPrompt) {
          _this.$confirm(
            "总出库数量大于此次订单总数量，您确定要操作吗？","提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          ).then(() => {
             _this.sava();
          });
        }
        else{
         _this.sava()
        }
    },
    sava()
    {
this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_salesoutbandenrty.erp_salesoutbandenrty.forEach(element => {});
        //格式化数据
        let newObj = this.getFormData();
        
        //如果没有传入参数就是新增
        if (!this.keyValue) {

          request({
            url: baseUrl + "/"+this.addressUrl,
            method: "post",
            data : newObj
          }).then((res) => {
              if(res.data.data=="库存不足，请检查该仓库的商品库存")
            {
              this.$confirm(res.data.data,"提示");
            }
            else
            {
               this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
            });
             this.$emit("onChange",true)
            }
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
    async getF_SalesOutCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/销售出库单号/gen',
        });
        if (resp.data.data) {
          this.formData.F_SalesOutCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_SalesOrderIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_SalesOrderIdOptionsLoading = true;
      }
      try {
          let params = {};
          params.sql = `select o.F_Id,o.F_SalesCode,o.F_ClientId,o.F_Status from erp_salesorder o where o.F_Status!=2`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_SalesOrderIdOptionsLoading = false;
          this.F_SalesOrderIdOptions = resp.data.data;
          console.log(this.F_SalesOrderIdOptions);
        }
      catch (error) {}
    },
    async handlerSelectF_SalesOrderId(val) {

      console.log(val.item.F_Id);
      console.log(val.item.F_ClientId);
      this.formData.F_ClientId=val.item.F_ClientId;
      this.formData.F_Status=val.item.F_Status;
      this.formData.F_SalesOrderId=val.item.F_Id;
      this.formData.F_SalesOrderNumber=val.item.F_SalesCode;
      let reps=await this.$axios({
        method:"get",
        url: baseUrl + "/database-links/localDB/datas",
        params:{
          sql:`select e.F_Id F_OrderEntryId,e.F_GoodsId,e.F_GoodsName,e.F_GoodCode,e.F_Specs,e.F_Unit,g.F_BasicUnit,g.F_ComUnit,e.F_UnitPrice,e.F_Amount,e.F_Quantity F_OrderQua,0 as outQuantity,e.F_OutQua,e.F_NoOutQua,e.F_Description,e.F_DefaultWarehouse,e.F_TaxRate,e.F_TaxPrice,e.F_TaxAmount,e.F_Description from erp_salesorderentry e left join erp_goods g on e.F_GoodsId=g.F_Id where  e.F_SalesOrderId="${val.item.F_Id}"`
          }
      });
      if(reps.data)
      {
        let {data}=reps.data;
        let dynamic=this.getDicData(
          data,
          '{"F_OrderEntryId":"F_OrderEntryId","F_GoodsId":"F_GoodsId","F_GoodsName":"F_GoodsName","F_GoodCode":"F_GoodCode","F_Specs":"F_Specs","F_Unit":"F_Unit","F_UnitId":"F_Unit","F_BasicUnit":"F_BasicUnit","F_ComUnit":"F_ComUnit","F_OutQua":"F_OutQua","F_NoOutQua":"F_NoOutQua","F_OrderQua":"F_OrderQua","F_UnitPrice":"F_UnitPrice","F_Amount":"F_Amount","F_TaxRate":"F_TaxRate","F_TaxPrice":"F_TaxPrice","F_TaxPrice":"F_TaxPrice","F_TaxAmount":"F_TaxAmount","F_DefaultWarehouse":"F_DefaultWarehouse","F_Quantity":"outQuantity","F_Des":"F_Des"}')
          this.erp_salesoutbandenrty.erp_salesoutbandenrty=dynamic;
      }

      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_SalesOrderIdOptions.filter(item => {
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
    async preloadData113() {
      //编辑时 取消预加载
      if (this.keyValue) return;
      this.preloadLoading113 = true;
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        if(this.formData.F_SaleOrder!=undefined)
        {
           let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/database-links/localDB/datas',
          params: {
            sql: `select e.* from erp_salesorder o left join erp_salesorderentry e on o.F_Id=e.F_SalesOrderId where o.F_SalesCode=${ this.formData.F_SaleOrder}`
          }
        });
        if (resp.data) {
          let {
            data
          } = resp.data
          let dynamic = this.getDicData(data,
            '{"F_GoodsId":"F_GoodsId","F_OrderEntryId":"F_Id","F_GoodsName":"F_GoodsName","F_GoodCode":"F_GoodCode","F_Specs":"F_Specs","F_Unit":"F_Unit","F_DefaultWarehouse":"F_WarehouseId","field1651265":"F_Quantity","F_Quantity":"","F_UnitPrice":"F_UnitPrice","F_Amount":"F_Amount","F_TaxRate":"F_TaxRate","F_TaxPrice":"F_TaxPrice","F_TaxAmount":"F_TaxAmount","F_Description":"F_Description"}'
            );
          this.erp_salesoutbandenrty.erp_salesoutbandenrty = dynamic;
          this.preloadLoading113 = false;
        }
        }
         this.preloadLoading113 = false;
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
/deep/ .el-col{
	margin-bottom: 10px;
}	
</style>
