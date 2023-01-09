<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_ReturnNumber')">
          <el-form-item label="退货单号" prop="F_ReturnNumber">
            <el-input v-model="formData['F_ReturnNumber']" placeholder="退货单号"
              :disabled="hasDisabledPermission('F_ReturnNumber',undefined)"
              :readonly="!hasEditPermission('F_ReturnNumber',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ReturnDate')">
          <el-form-item label="退货日期" prop="F_ReturnDate">
            <el-date-picker :disabled="hasDisabledPermission('F_ReturnDate',false)"
              :readonly="!hasEditPermission('F_ReturnDate',false)" v-model="formData['F_ReturnDate']"
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
        <el-col :span="8" v-if="hasFormPermission('F_PurReceiptNumber')">
          <el-form-item label="入库单号" prop="F_PurReceiptNumber">
            <el-select v-model="formData.F_PurReceiptNumber" placeholder="请选择入库单号"
              :disabled="hasDisabledPermission('F_PurReceiptNumber',false)"
              :readonly="!hasEditPermission('F_PurReceiptNumber',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_PurReceiptNumberOptions"
              @change="handlerSelectF_PurReceiptNumber" :loading="F_PurReceiptNumberLoading">
              <el-option v-for="(item, index) in F_PurReceiptNumberOptions" :key="index"
                :label="item.F_PurReceiptNumber" :value="{value:item}" :disabled="item.disabled"></el-option>
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
        <el-col :span="8" v-if="hasFormPermission('F_TotalReturn')">
          <el-form-item label="退货总额" prop="F_TotalReturn">
            <el-input v-model="formData['F_TotalReturn']" type="number" placeholder="请输入退货总额"
              :disabled="hasDisabledPermission('F_TotalReturn',false)"
              :readonly="!hasEditPermission('F_TotalReturn',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_purchasereturnentry')">
          <avue-form v-loading="preloadLoading113" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113" v-model="erp_purchasereturnentry" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidMark')"  hidden="hidden">
          <el-form-item label="状态" prop="F_InvalidMark">
            <el-input v-model="formData['F_InvalidMark']" placeholder="请输入状态"
              :disabled="hasDisabledPermission('F_InvalidMark',true)"
              :readonly="!hasEditPermission('F_InvalidMark',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AuditMark')"  hidden="hidden">
          <el-form-item label="审核状态" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_AuditMark',true)"
              :readonly="!hasEditPermission('F_AuditMark',false)" clearable :style="{width: '100%'}">
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
      addressUrl:'erp_purchasereturninfo',
      mainTableName: 'erp_purchasereturn',
      formConfig: {
        "fields": [{
          "__vModel__": "F_ReturnNumber",
          "__config__": {
            "label": "退货单号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "ReturnNumber",
            "formId": 134
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_ReturnDate",
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
          "__vModel__": "F_PurReceiptNumber",
          "__config__": {
            "label": "入库单号",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "{\"125\":\"F_DeliveryUnit\"}",
            "formId": 104,
            "database": "localDB",
            "sql": "\tselect p.F_ReceiptNumber,p.F_Id,p.F_DeliveryUnit  from erp_purchasereceipt p",
            "showField": "F_PurReceiptNumber",
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
            "formId": 125
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_TotalReturn",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "退货总额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 133
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
            "children": [
              {
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_purchasereturnentry",
                "bindTableField": "F_GoodsId"
              }
            },
              {
              "__vModel__": "F_GoodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_purchasereturnentry",
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
                "bindTable": "erp_purchasereturnentry",
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
                "bindTable": "erp_purchasereturnentry",
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
                "bindTable": "erp_purchasereturnentry",
                "bindTableField": "F_Unit"
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
                "bindTable": "erp_purchasereturnentry",
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
                "bindTable": "erp_purchasereturnentry",
                "bindTableField": "F_Amount"
              }
            }, {
              "__vModel__": "F_ReceiptQuantity",
              "__config__": {
                "label": "退货数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 8,
                "bindTable": "erp_purchasereturnentry",
                "bindTableField": "F_ReceiptQuantity"
              }
            }, {
              "__vModel__": "F_Des",
              "__config__": {
                "label": "说明",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_purchasereturnentry",
                "bindTableField": "F_Des"
              }
            }],
            "sql": "\tselect g.F_Id,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice from \terp_goods g",
            "database": "localDB"
          }
        }, {
          "__vModel__": "F_InvalidMark",
          "__config__": {
            "label": "状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 136
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
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "span": 24,
            "formId": 121
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
        'F_ReturnNumber': '',
        "F_PurReceiptId":"",//入库单id
        'F_PurReceiptNumber': '',//入库单号
        'F_ReturnDate': null,
        'F_ChargePeople': '',
        'F_DeliveryUnit': '',
        'F_TotalReturn': 0,
        'F_InvalidMark': "1",
        'F_AuditMark': "1",
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
        'F_PurOrderId': "",//订单id，根据它修改入库数量数量
        'F_ReceiptNumber': '',//供货单位
        'f_WeraHourseId': '',//入库单入库的仓库，根据它修改商品的库存
      },
      rules: {
        F_ReturnNumber: [{
          required: true,
          message: '退货单号',
          trigger: 'blur'
        }],
        F_ReturnDate: [{
          required: true,
          message: '请选择退货日期',
          trigger: 'change'
        }],
        F_ChargePeople: [{
          required: true,
          message: '请输入经办人员',
          trigger: 'blur'
        }],
        F_PurReceiptNumber: [{
          required: true,
          message: '请选择入库单号',
          trigger: 'change'
        }],
        F_DeliveryUnit: [{
          required: true,
          message: '请输入供货单位',
          trigger: 'blur'
        }],
        F_TotalReturn: [{
          required: true,
          message: '请输入退货总额',
          trigger: 'blur'
        }],
        F_InvalidMark: [{
          required: true,
          message: '请输入状态',
          trigger: 'blur'
        }],
        F_AuditMark: [{
          required: true,
          message: '请输入审核状态',
          trigger: 'blur'
        }],
        F_Description: [],
        F_CreatorTime: [],
      },
      F_PurReceiptNumberOptions: [],
      F_PurReceiptNumberLoading: false,
      erp_purchasereturnentry: {},
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
          prop: 'erp_purchasereturnentry',
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
            column:this.getAuthorityTableChildrenList('erp_purchasereturnentry', [
              {
               label: "F_OrderEntrtyId",
               prop: "F_OrderEntrtyId",
               type: "input",
               hide:true,
              },
              {
              label: '商品id',
              prop: 'F_GoodsId',
              type: 'input',
              hide:true,
              },
              {
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
              type: 'input',
            },
            
            {
              label: '单价',
              prop: 'F_UnitPrice',
              type: 'input',
            }, {
              label: '金额',
              prop: 'F_Amount',
              type: 'input',
            },
             {
                  label: "已入库数量",
                  prop: "F_ReceiptQua",
                  disabled: true,
                  type: "number",
                },
                {
                  label: "未入库数量",
                  prop: "F_NoReceiptQua",
                  disabled: true,
                  type: "number",
                },
            {
              label: '退货数量',
              prop: 'F_ReturnQuantity',
              type: 'number',
            }, {
              label: '说明',
              prop: 'F_Des',
              type: 'input',
            }, ])
          }
        }, ],
      }
    }
  },
  watch: {
    'formData.F_TotalReturn': function(val, oldVal) {
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
                  
            this.formData = res.data.data.erp_purchasereturn
            
          this.erp_purchasereturnentry.erp_purchasereturnentry = res.data.data.erp_purchasereturnentry
          
        this.erp_purchasereturnentry.erp_purchasereturnentry.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_ReturnNumberOptions == "function") {
      await this.getF_ReturnNumberOptions();
    }
    if (typeof this.getF_PurReceiptNumberOptions == "function") {
      await this.getF_PurReceiptNumberOptions();
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
        erp_purchasereturnentryEntityList: this.erp_purchasereturnentry.erp_purchasereturnentry,
        f_purOrderid:this.formData.F_PurOrderId,
        f_receiptNumber:this.formData.F_ReceiptNumber,

      };
    },
    submitForm() {
      var _this=this;
      var isPrompt = false;
      var isNull=false;
      //判断是否退货数量有大于已入库数量的
        for (let index = 0;index < _this.erp_purchasereturnentry.erp_purchasereturnentry.length;index++) 
        {
           console.log(_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_RetrurnQuantity"]);
            console.log(_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_ReceiptQua"]);
          //如果退货数量>已入库数量   数量不一致，给出提示 操作是否失误 不能操作
          if(_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_ReturnQuantity"] >_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_ReceiptQua"]) 
          {
           
            isPrompt = true;
          }
          // if(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQua"] -_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_RetrurnQuantity"]==0) 
          // {
          //   //如果旧的已入库数+本次退货数量数量<总数量 代表此次订单入库可能没有完成需要进行二次入库 不修改订单状态为已入库 全部入完才修改状态为已入库
          //  this.ismodifystatus=false;
          // }
          //当商品入库单位为空或者商品id为空或者数量为空给出提示 ||_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_RetrurnQuantity"]==null
          if(_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_Unit"]==null||_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_ComUnit"]==null||_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_BasicUnit"]==null||_this.erp_purchasereturnentry.erp_purchasereturnentry[index]["F_GoodsId"]==null)
          {
            isNull=true;
          }
        }
        if (isNull) {
          _this.$confirm("请检查商品信息是否配置完整","提示");
          return;
        }
        if (isPrompt) {
          _this.$confirm("退货数量大于已入库数量，数量不一致，请确认后再操作","提示");
          return;
        }

        this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_purchasereturnentry.erp_purchasereturnentry.forEach(element => {});
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
    async getF_ReturnNumberOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/ReturnNumber/gen',
        });
        if (resp.data.data) {
          this.formData.F_ReturnNumber = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_PurReceiptNumberOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_PurReceiptNumberOptionsLoading = true;
      }
      try {
      
          let params = {};
          params.sql = `select p.F_Id,p.F_ReceiptNumber F_PurReceiptNumber,p.F_DeliveryUnit,p.F_PurOrderId,p.F_DefaultWarehouse,o.F_Status  from erp_purchasereceipt p left JOIN erp_purchaseorder o on p.F_PurOrderId=o.F_Id where o.F_Status !=1`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_PurReceiptNumberOptionsLoading = false;
          this.F_PurReceiptNumberOptions = resp.data.data;
      }
      catch (error) {}
    },
    async handlerSelectF_PurReceiptNumber(paramsInfo) {
      try {

        //获取下拉框显示值和保存值
        const info= paramsInfo;
        console.log(info);
        this.formData.F_PurOrderId =info.value.F_PurOrderId;//订单id，根据它修改入库数量数量
        this.formData.F_PurReceiptNumber=info.value.F_PurReceiptNumber;//入库单号
        console.log(info.value.F_PurReceiptNumber);
        this.formData.F_Status=info.value.F_Status;
        this.formData.F_PurReceiptId=info.value.F_Id;//入库单id
        this.formData.F_DeliveryUnit=info.value.F_DeliveryUnit;//供货单位
        this.formData.f_WeraHourseId=info.value.F_DefaultWarehouse;//入库单入库的仓库，根据它修改商品的库存 
        let resp = await this.$axios({
          method: "get",
          url:
            baseUrl + "/database-links/localDB/datas",
          params: {
            sql: `select e.F_Id F_ReceiptEntryId,e.F_OrderEntrtyId,e.F_ReceiptId,e.F_GoodsId,e.F_GoodsName,e.F_GoodCode,e.F_Specs,g.F_InUnit F_UnitId,g.F_BasicUnit,g.F_ComUnit,e.F_UnitPrice,e.F_Amount,e.F_ReceiptQua,e.F_NoReceiptQua,0 as F_ReturnQuantity,e.F_Des from erp_purchasereceiptentry e left join erp_goods g on e.F_GoodsId=g.F_Id  where e.F_ReceiptId='${paramsInfo.value.F_Id}'`,
          },
        });
        if (resp.data) {
          let { data } = resp.data;
          let dynamic = this.getDicData(
            data,
            '{"F_OrderEntrtyId":"F_OrderEntrtyId","F_ReceiptEntryId":"F_ReceiptEntryId","F_ReceiptId":"F_ReceiptId","F_GoodsId":"F_GoodsId","F_GoodsName":"F_GoodsName","F_GoodCode":"F_GoodCode","F_Specs":"F_Specs","F_Unit":"F_UnitId","F_UnitId":"F_UnitId","F_BasicUnit":"F_BasicUnit","F_ComUnit":"F_ComUnit","F_UnitPrice":"F_UnitPrice","F_Amount":"F_Amount","F_ReturnQuantity":"F_ReturnQuantity","F_ReceiptQua":"F_ReceiptQua","F_NoReceiptQua":"F_NoReceiptQua","F_Des":"F_Des"}'
          );
          this.erp_purchasereturnentry.erp_purchasereturnentry = dynamic;
        }
      } catch (error) {}


      let autoBindFields = JSON.parse('{"125":"F_DeliveryUnit"}');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_PurReceiptNumberOptions.filter(item => {
        return item[saveField] ==paramsInfo.value.F_Id;
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
