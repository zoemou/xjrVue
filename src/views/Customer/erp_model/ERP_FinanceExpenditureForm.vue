<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_ExpenditureCode')">
          <el-form-item label="支出编码" prop="F_ExpenditureCode">
            <el-input v-model="formData['F_ExpenditureCode']" placeholder="支出编码"
              :disabled="hasDisabledPermission('F_ExpenditureCode',undefined)"
              :readonly="!hasEditPermission('F_ExpenditureCode',true)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_BillDate')">
          <el-form-item label="单据日期" prop="F_BillDate">
            <el-date-picker :disabled="hasDisabledPermission('F_BillDate',false)"
              :readonly="!hasEditPermission('F_BillDate',false)" v-model="formData['F_BillDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择单据日期"
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
        <el-col :span="8" v-if="hasFormPermission('F_BusinessType')">
          <el-form-item label="业务类型" prop="F_BusinessType">
            <el-select v-model="formData['F_BusinessType']" placeholder="请选择业务类型"
              :disabled="hasDisabledPermission('F_BusinessType',false)"
              :readonly="!hasEditPermission('F_BusinessType',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_BusinessTypeOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ReceivingUnit')">
          <el-form-item label="收款单位" prop="F_ReceivingUnit">
            <el-input v-model="formData['F_ReceivingUnit']" placeholder="请输入收款单位"
              :disabled="hasDisabledPermission('F_ReceivingUnit',false)"
              :readonly="!hasEditPermission('F_ReceivingUnit',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_BusinessDepartment')">
          <el-form-item label="业务部门" prop="F_BusinessDepartment">
            <el-input v-model="formData['F_BusinessDepartment']" placeholder="请输入业务部门"
              :disabled="hasDisabledPermission('F_BusinessDepartment',false)"
              :readonly="!hasEditPermission('F_BusinessDepartment',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_financeexpenditurebill')">
          <avue-form v-loading="preloadLoading110" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option110" v-model="erp_financeexpenditurebill" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注" prop="F_Description">
            <el-input v-model="formData['F_Description']" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" clearable :style="{width: '100%'}">
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
              :readonly="!hasEditPermission('F_CreatorTime',false)" type="datetime"
              v-model="formData['F_CreatorTime']" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择制单时间" clearable>
            </el-date-picker>
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
      addressUrl:'erp_financeexpenditure',
      mainTableName: 'erp_financeexpenditure',
      formConfig: {
        "fields": [{
          "__vModel__": "F_ExpenditureCode",
          "__config__": {
            "label": "支出编码",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": ""
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_BillDate",
          "__config__": {
            "label": "单据日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 104
          }
        }, {
          "__vModel__": "F_Manager",
          "__config__": {
            "label": "经办人",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 105
          }
        }, {
          "__vModel__": "F_BusinessType",
          "__config__": {
            "label": "业务类型",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "formId": 106,
            "dataType": "dataItem",
            "dataItem": "业务类型"
          }
        }, {
          "__vModel__": "F_ReceivingUnit",
          "__config__": {
            "label": "收款单位",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 107
          }
        }, {
          "__vModel__": "F_BusinessDepartment",
          "__config__": {
            "label": "业务部门",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 108
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 110,
            "children": [{
              "__vModel__": "F_ExpenditureType",
              "__config__": {
                "label": "支出种类",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 8,
                "bindTable": "erp_financeexpenditurebill",
                "bindTableField": "F_ExpenditureType",
                "dataType": "dataItem",
                "dataItem": "Client_ExpensesType"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_ExpendAmount",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "支出金额",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_financeexpenditurebill",
                "bindTableField": "F_ExpendAmount"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "备注",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_financeexpenditurebill",
                "bindTableField": "F_Description"
              }
            }]
          }
        }, {
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 24,
            "formId": 114
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
            "formId": 116,
            "placeholder": "当前用户"
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "F_CreatorTime",
          "__config__": {
            "label": "制单时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 12,
            "formId": 119
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_ExpenditureCode': '',
        'F_BillDate': null,
        'F_Manager': '',
        'F_BusinessType': '',
        'F_ReceivingUnit': '',
        'F_BusinessDepartment': '',
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_ExpenditureCode: [{
          required: true,
          message: '支出编码支出编码支出编码',
          trigger: 'blur'
        }],
        F_BillDate: [{
          required: true,
          message: '请选择单据日期',
          trigger: 'change'
        }],
        F_Manager: [{
          required: true,
          message: '请输入经办人',
          trigger: 'blur'
        }],
        F_BusinessType: [{
          required: true,
          message: '请选择业务类型',
          trigger: 'change'
        }],
        F_ReceivingUnit: [{
          required: true,
          message: '请输入收款单位',
          trigger: 'blur'
        }],
        F_BusinessDepartment: [],
        F_Description: [],
        F_CreatorTime: [],
      },
      F_BusinessTypeOptions: [],
      erp_financeexpenditurebill: {},
      preloadLoading110: false,
    }
  },
  computed: {
    option110() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          prop: 'erp_financeexpenditurebill',
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
            column: this.getAuthorityTableChildrenList('erp_financeexpenditurebill',[{
              label: '支出种类',
              type: 'select',
              prop: 'F_ExpenditureType',
              props: {
                label: 'F_ItemName',
                value: 'F_ItemValue'
              },
              dicUrl:  baseUrl + '/data-items/Client_ExpensesType/detail',
            }, {
              label: '支出金额',
              prop: 'F_ExpendAmount',
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
                  
            this.formData = res.data.data.erp_financeexpenditure
            
          this.erp_financeexpenditurebill.erp_financeexpenditurebill = res.data.data.erp_financeexpenditurebill
          
        this.erp_financeexpenditurebill.erp_financeexpenditurebill.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_ExpenditureCodeOptions == "function") {
      await this.getF_ExpenditureCodeOptions();
    }
    if (typeof this.getF_BusinessTypeOptions == "function") {
      await this.getF_BusinessTypeOptions();
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
        erp_financeexpenditurebillEntityList: this.erp_financeexpenditurebill.erp_financeexpenditurebill,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_financeexpenditurebill.erp_financeexpenditurebill.forEach(element => {});
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
    async getF_ExpenditureCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/zcbm/gen',
        });
        if (resp.data.data) {
          this.formData.F_ExpenditureCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_BusinessTypeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/业务类型/detail',
        });
        if (resp.data.data) {
          this.F_BusinessTypeOptions = resp.data.data;
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
