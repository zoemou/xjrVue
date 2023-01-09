<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12" v-if="hasFormPermission('F_EnCode')">
          <el-form-item label="客户编号" prop="F_EnCode">
            <el-input v-model="formData['F_EnCode']" placeholder="请输入客户编号"
              :disabled="hasDisabledPermission('F_EnCode',false)"
              :readonly="!hasEditPermission('F_EnCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_FullName')">
          <el-form-item label="客户名称" prop="F_FullName">
            <el-input v-model="formData['F_FullName']" placeholder="请输入客户名称"
              :disabled="hasDisabledPermission('F_FullName',false)"
              :readonly="!hasEditPermission('F_FullName',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_UniCategory')">
          <el-form-item label="客户类别" prop="F_UniCategory">
            <el-select v-model="formData['F_UniCategory']" placeholder="请选择客户类别"
              :disabled="hasDisabledPermission('F_UniCategory',false)"
              :readonly="!hasEditPermission('F_UniCategory',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_UniCategoryOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_UnitTelephone')">
          <el-form-item label="客户电话" prop="F_UnitTelephone">
            <el-input v-model="formData['F_UnitTelephone']" placeholder="请输入客户电话"
              :disabled="hasDisabledPermission('F_UnitTelephone',false)"
              :readonly="!hasEditPermission('F_UnitTelephone',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_TaxRate')">
          <el-form-item label="增值税率" prop="F_TaxRate">
            <el-input v-model="formData['F_TaxRate']" placeholder="请输入增值税率"
              :disabled="hasDisabledPermission('F_TaxRate',false)"
              :readonly="!hasEditPermission('F_TaxRate',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_TaxCode')">
          <el-form-item label="纳税人号" prop="F_TaxCode">
            <el-input v-model="formData['F_TaxCode']" placeholder="请输入纳税人号"
              :disabled="hasDisabledPermission('F_TaxCode',false)"
              :readonly="!hasEditPermission('F_TaxCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_OpenBank')">
          <el-form-item label="开户银行" prop="F_OpenBank">
            <el-input v-model="formData['F_OpenBank']" placeholder="请输入开户银行"
              :disabled="hasDisabledPermission('F_OpenBank',false)"
              :readonly="!hasEditPermission('F_OpenBank',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_BankAccount')">
          <el-form-item label="银行帐号" prop="F_BankAccount">
            <el-input v-model="formData['F_BankAccount']" placeholder="请输入银行帐号"
              :disabled="hasDisabledPermission('F_BankAccount',false)"
              :readonly="!hasEditPermission('F_BankAccount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_DiscountRate')">
          <el-form-item label="折扣率" prop="F_DiscountRate">
            <el-input v-model="formData['F_DiscountRate']" placeholder="请输入折扣率"
              :disabled="hasDisabledPermission('F_DiscountRate',false)"
              :readonly="!hasEditPermission('F_DiscountRate',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreditQuota')">
          <el-form-item label="信用额度" prop="F_CreditQuota">
            <el-input v-model="formData['F_CreditQuota']" placeholder="请输入信用额度"
              :disabled="hasDisabledPermission('F_CreditQuota',false)"
              :readonly="!hasEditPermission('F_CreditQuota',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_ProvinceId')">
          <el-form-item label="客户地址" prop="F_ProvinceId">
            <el-input v-model="formData['F_ProvinceId']" placeholder="请输入客户地址"
              :disabled="hasDisabledPermission('F_ProvinceId',false)"
              :readonly="!hasEditPermission('F_ProvinceId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_UnitAddress')">
          <el-form-item label="详细地址" prop="F_UnitAddress">
            <el-input v-model="formData['F_UnitAddress']" placeholder="请输入详细地址"
              :disabled="hasDisabledPermission('F_UnitAddress',false)"
              :readonly="!hasEditPermission('F_UnitAddress',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_inoutunitcontact')">
          <avue-form v-loading="preloadLoading115" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option115" v-model="erp_inoutunitcontact" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="描述" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入描述"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom: 20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit" label-width="0px">
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
      addressUrl:'customermanage',
      mainTableName: 'erp_inoutunit',
      formConfig: {
        "fields": [{
          "__vModel__": "F_EnCode",
          "__config__": {
            "label": "客户编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 101
          }
        }, {
          "__vModel__": "F_FullName",
          "__config__": {
            "label": "客户名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 102
          }
        }, {
          "__vModel__": "F_UniCategory",
          "__config__": {
            "label": "客户类别",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 12,
            "formId": 105,
            "dataType": "dataItem",
            "dataItem": "客户类别"
          }
        }, {
          "__vModel__": "F_UnitTelephone",
          "__config__": {
            "label": "客户电话",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 104
          }
        }, {
          "__vModel__": "F_TaxRate",
          "__config__": {
            "label": "增值税率",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 106
          }
        }, {
          "__vModel__": "F_TaxCode",
          "__config__": {
            "label": "纳税人号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 107
          }
        }, {
          "__vModel__": "F_OpenBank",
          "__config__": {
            "label": "开户银行",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 108
          }
        }, {
          "__vModel__": "F_BankAccount",
          "__config__": {
            "label": "银行帐号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 109
          }
        }, {
          "__vModel__": "F_DiscountRate",
          "__config__": {
            "label": "折扣率",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 110
          }
        }, {
          "__vModel__": "F_CreditQuota",
          "__config__": {
            "label": "信用额度",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 111
          }
        }, {
          "__vModel__": "F_ProvinceId",
          "__config__": {
            "label": "客户地址",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 112
          }
        }, {
          "__vModel__": "F_UnitAddress",
          "__config__": {
            "label": "详细地址",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 113
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "联系人",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 115,
            "children": [{
              "__vModel__": "F_Name",
              "__config__": {
                "label": "联系人姓名",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Name"
              }
            }, {
              "__vModel__": "F_Duties",
              "__config__": {
                "label": "值位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Duties"
              }
            }, {
              "__vModel__": "F_Mobilephone",
              "__config__": {
                "label": "手机",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Mobilephone"
              }
            }, {
              "__vModel__": "F_Telephone",
              "__config__": {
                "label": "电话",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Telephone"
              }
            }, {
              "__vModel__": "F_Landline",
              "__config__": {
                "label": "座机",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Landline"
              }
            }, {
              "__vModel__": "F_Email",
              "__config__": {
                "label": "邮箱",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Email"
              }
            }, {
              "__vModel__": "F_QQ",
              "__config__": {
                "label": "QQ",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_QQ"
              }
            }, {
              "__vModel__": "F_Fax",
              "__config__": {
                "label": "传真",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 12,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Fax"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "备注",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_inoutunitcontact",
                "bindTableField": "F_Description"
              }
            }]
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "描述",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "span": 24,
            "formId": 125
          }
        }, {
          "__vModel__": "F_UniType",
          "__config__": {
            "label": "单位类型",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 24,
            "formId": 126,
            "dataType": "dataItem",
            "dataItem": "单位类型"
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_EnCode': '',
        'F_FullName': '',
        'F_UniCategory': '',
        'F_UnitTelephone': '',
        'F_TaxRate': '',
        'F_TaxCode': '',
        'F_OpenBank': '',
        'F_BankAccount': '',
        'F_DiscountRate': '',
        'F_CreditQuota': '',
        'F_ProvinceId': '',
        'F_UnitAddress': '',
        'F_Description': '',
        'F_UniType': "2",
      },
      rules: {
        F_EnCode: [{
          required: true,
          message: '请输入客户编号',
          trigger: 'blur'
        }],
        F_FullName: [{
          required: true,
          message: '请输入客户名称',
          trigger: 'blur'
        }],
        F_UniCategory: [{
          required: true,
          message: '请选择客户类别',
          trigger: 'change'
        }],
        F_UnitTelephone: [{
          required: true,
          message: '请输入客户电话',
          trigger: 'blur'
        }],
        F_TaxRate: [],
        F_TaxCode: [],
        F_OpenBank: [],
        F_BankAccount: [],
        F_DiscountRate: [],
        F_CreditQuota: [],
        F_ProvinceId: [],
        F_UnitAddress: [],
        F_Description: [],
        F_UniType: [{
          required: true,
          message: '请选择单位类型',
          trigger: 'change'
        }],
      },
      F_UniCategoryOptions: [],
      erp_inoutunitcontact: {},
      preloadLoading115: false,
      F_UniTypeOptions: [],
    }
  },
  computed: {
    option115() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '联系人',
          prop: 'erp_inoutunitcontact',
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
            column: this.getAuthorityTableChildrenList('erp_inoutunitcontact',[{
              label: '联系人姓名',
              prop: 'F_Name',
              type: 'input',
            }, {
              label: '值位',
              prop: 'F_Duties',
              type: 'input',
            }, {
              label: '手机',
              prop: 'F_Mobilephone',
              type: 'input',
            }, {
              label: '电话',
              prop: 'F_Telephone',
              type: 'input',
            }, {
              label: '座机',
              prop: 'F_Landline',
              type: 'input',
            }, {
              label: '邮箱',
              prop: 'F_Email',
              type: 'input',
            }, {
              label: 'QQ',
              prop: 'F_QQ',
              type: 'input',
            }, {
              label: '传真',
              prop: 'F_Fax',
              type: 'input',
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
                  
            this.formData = res.data.data.erp_inoutunit
            
          this.erp_inoutunitcontact.erp_inoutunitcontact = res.data.data.erp_inoutunitcontact
          
        this.erp_inoutunitcontact.erp_inoutunitcontact.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_UniCategoryOptions == "function") {
      await this.getF_UniCategoryOptions();
    }
    if (typeof this.getF_UniTypeOptions == "function") {
      await this.getF_UniTypeOptions();
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
        erp_inoutunitcontactEntityList: this.erp_inoutunitcontact.erp_inoutunitcontact,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_inoutunitcontact.erp_inoutunitcontact.forEach(element => {});
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
    async getF_UniCategoryOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/客户类别/detail',
        });
        if (resp.data.data) {
          this.F_UniCategoryOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_UniTypeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/单位类型/detail',
        });
        if (resp.data.data) {
          this.F_UniTypeOptions = resp.data.data;
        }
      }
      catch (error) {}
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
/deep/ .el-input--medium .el-input__inner{
	height: 27px;
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

