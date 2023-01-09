<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_InStockCode')">
          <el-form-item label="入库编号" prop="F_InStockCode">
            <el-input v-model="formData['F_InStockCode']" placeholder="入库编号"
              :disabled="hasDisabledPermission('F_InStockCode',undefined)"
              :readonly="!hasEditPermission('F_InStockCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_InStockDate')">
          <el-form-item label="入库日期" prop="F_InStockDate">
            <el-date-picker :disabled="hasDisabledPermission('F_InStockDate',false)"
              :readonly="!hasEditPermission('F_InStockDate',false)" v-model="formData['F_InStockDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择入库日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_WarehouseId')">
          <el-form-item label="仓库" prop="F_WarehouseId">
            <el-select v-model="formData.F_WarehouseId" placeholder="请选择仓库"
              :disabled="hasDisabledPermission('F_WarehouseId',false)"
              :readonly="!hasEditPermission('F_WarehouseId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_WarehouseIdOptions"
              @change="handlerSelectF_WarehouseId" :loading="F_WarehouseIdLoading">
              <el-option v-for="(item, index) in F_WarehouseIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_stockinstockentry')">
          <avue-form v-loading="preloadLoading107" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option107" v-model="erp_stockinstockentry" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AuditMark')">
          <el-form-item label="审核状态" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_AuditMark',true)"
              :readonly="!hasEditPermission('F_AuditMark',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidMark')">
          <el-form-item label="状态" prop="F_InvalidMark">
            <el-input v-model="formData['F_InvalidMark']" placeholder="请输入状态"
              :disabled="hasDisabledPermission('F_InvalidMark',true)"
              :readonly="!hasEditPermission('F_InvalidMark',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidUserId')">
          <el-form-item label="制单人员" prop="F_InvalidUserId" required>
            <avue-information-body :operationVal="operationVal" infoType='user'
              :whetherToRebindSecondaryEditing='false' v-model="formData['F_InvalidUserId']"
              placeholder="当前用户制单人员" :disabled="hasDisabledPermission('F_InvalidUserId',true)"
              :readonly="!hasEditPermission('F_InvalidUserId',true)" :style="{width: '100%'}">
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidTime')">
          <el-form-item label="制单时间" prop="F_InvalidTime">
            <el-date-picker :disabled="hasDisabledPermission('F_InvalidTime',false)"
              :readonly="!hasEditPermission('F_InvalidTime',false)" v-model="formData['F_InvalidTime']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择制单时间"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注 " prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注 "
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_instock',
      mainTableName: 'erp_stockinstock',
      formConfig: {
        "fields": [{
          "__vModel__": "F_InStockCode",
          "__config__": {
            "label": "入库编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "InStockCode",
            "formId": 104
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_InStockDate",
          "__config__": {
            "label": "入库日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 105
          }
        }, {
          "__vModel__": "F_WarehouseId",
          "__config__": {
            "label": "仓库",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 103,
            "database": "localDB",
            "sql": "SELECT\n\tw.F_Id,\n\tw.F_FullName \nFROM\n\terp_warehouse w",
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
            "formId": 107,
            "children": [{
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_GoodsId"
              }
            }, {
              "__vModel__": "F_GoodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_GoodsName"
              }
            }, {
              "__vModel__": "F_GoodCode",
              "__config__": {
                "label": "商品编号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_GoodCode"
              }
            }, {
              "__vModel__": "F_Specs",
              "__config__": {
                "label": "规格型号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_Specs"
              }
            },
            {
              "__vModel__": "F_UnitId",
              "__config__": {
                "label": "入库单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_UnitId"
              }
            },
             {
              "__vModel__": "F_OutUnit",
              "__config__": {
                "label": "出库单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_OutUnit"
              }
            }, 
             {
              "__vModel__": "F_BasicUnit",
              "__config__": {
                "label": "基本单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_BasicUnit"
              }
            },  {
              "__vModel__": "F_ComUnit",
              "__config__": {
                "label": "库存显示单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_ComUnit"
              }
            },
             {
              "__vModel__": "F_Quantity",
              "__config__": {
                "label": "订单数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_Quantity"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinstockentry",
                "bindTableField": "F_Description"
              }
            }],
            "database": "localDB",
            "sql": "\tSELECT\n\tg.F_Id,\n\tg.F_FullName,\n\tg.F_EnCode,\n\tg.F_Specs,\n\tg.F_ComUnit,\n\t0 as qun\nFROM\n\terp_goods g where g.F_Id IN('15502e56-5e1f-40cd-bb8f-96ae7f281a35','551b51b8-b466-4ab8-8172-41d92504e56a')"
          }
        }, {
          "__vModel__": "F_AuditMark",
          "__config__": {
            "label": "审核状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 116
          }
        }, {
          "__vModel__": "F_InvalidMark",
          "__config__": {
            "label": "状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 118
          }
        }, {
          "__vModel__": "F_InvalidUserId",
          "__type__": "info",
          "infoType": "user",
          "__organize__": true,
          "__config__": {
            "label": "制单人员",
            "showLabel": true,
            "tag": "avue-information-body",
            "span": 12,
            "whetherToRebindSecondaryEditing": false,
            "formId": 119,
            "placeholder": "当前用户"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_InvalidTime",
          "__config__": {
            "label": "制单时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 12,
            "formId": 120
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注 ",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "span": 24,
            "formId": 121
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_InStockCode': '',
        'F_InStockDate': null,
        'F_WarehouseId': '',
        'F_AuditMark': 1,
        'F_InvalidMark': 1,
        'F_InvalidUserId': '',
        'F_InvalidTime': null,
        'F_Description': '',
      },
      rules: {
        F_InStockCode: [{
          required: true,
          message: '入库编号',
          trigger: 'blur'
        }],
        F_InStockDate: [{
          required: true,
          message: '请选择入库日期',
          trigger: 'change'
        }],
        F_WarehouseId: [{
          required: true,
          message: '请选择仓库',
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
        F_InvalidTime: [],
        F_Description: [],
      },
      F_WarehouseIdOptions: [],
      F_WarehouseIdLoading: false,
      erp_stockinstockentry: {},
      preloadLoading107: false,
    }
  },
  computed: {
    option107() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '',
          prop: 'erp_stockinstockentry',
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
            column:this.getAuthorityTableChildrenList('erp_stockinstockentry', [{
              label: '商品id',
              prop: 'F_GoodsId',
              hide:true,
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
              label: '规格型号',
              prop: 'F_Specs',
              type: 'input',
            }, {
              label: '入库单位',
              prop: 'F_UnitId',
              type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            }, 
            {
              label: '单位',
              prop: 'F_Unit',
              type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_FullName",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            }, 
            {
              label: '出库单位',
              prop: 'F_OutUnit',
               type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            }, 
            {
              label: '基本单位',
              prop: 'F_BasicUnit',
               type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            }, 
            {
              label: '库存显示单位',
              prop: 'F_ComUnit',
               type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
            }, {
              label: '订单数量',
              prop: 'F_Quantity',
              type: 'number',
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
                  
            this.formData = res.data.data.erp_stockinstock
            
          this.erp_stockinstockentry.erp_stockinstockentry = res.data.data.erp_stockinstockentry
          
        this.erp_stockinstockentry.erp_stockinstockentry.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_InStockCodeOptions == "function") {
      await this.getF_InStockCodeOptions();
    }
    if (typeof this.getF_WarehouseIdOptions == "function") {
      await this.getF_WarehouseIdOptions();
    }
    if (this.isAdd) {
      await this.preloadData107()
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
        erp_stockinstockentryEntityList: this.erp_stockinstockentry.erp_stockinstockentry,
      };
    },
    submitForm() {
       var isNull=false;
       var _this=this;
      for (let index = 0; index < this.erp_stockinstockentry.erp_stockinstockentry.length; index++) {
        //当商品入库单位为空或者商品id为空或者入库数量为空给出提示  ||_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_Quantity"]==null
          if(_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_Unit"]==""||_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_ComUnit"]==""||_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_BasicUnit"]==""||_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_GoodsName"]==""||_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_GoodCode"]==""||_this.erp_stockinstockentry.erp_stockinstockentry[index]["F_Quantity"]==0)
          {
            isNull=true;
          }
      }
      if (isNull) {
          _this.$confirm("请检查商品信息是否填写完整","提示");
          return;
        }
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_stockinstockentry.erp_stockinstockentry.forEach(element => {});
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
              _this.$confirm("已入库的订单不允许修改","提示");
          return;
        //  request({
        //     url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
        //     method: "put",
        //     data : newObj
        //   }).then((res) => {

        //     this.$notify({
        //       title: "成功",
        //       message: "修改成功",
        //       type: "success",
        //     });
        //      this.$emit("onChange",true)
        //   });

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
    async getF_InStockCodeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/InStockCode/gen',
        });
        if (resp.data.data) {
          this.formData.F_InStockCode = resp.data.data;
        }
      }
      catch (error) {}
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
          params.sql = `SELECT
	w.F_Id,
	w.F_FullName 
FROM
	erp_warehouse w`;
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
    async preloadData107() {
      //编辑时 取消预加载
      if (this.keyValue) return;
      this.preloadLoading107 = true;
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
            method: 'get',
            url:  baseUrl + '/database-links/localDB/datas',
            params: {
              sql: 'SELECT g.F_Id,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_InUnit,g.F_OutUnit,g.F_BasicUnit,g.F_ComUnit,0 as qun FROM erp_goods g '}
            });
          if (resp.data) {
            let {
              data
            } = resp.data
            let dynamic = this.getDicData(data,
              '{"F_GoodsId":"F_Id","F_GoodsName":"F_FullName","F_GoodCode":"F_EnCode","F_Specs":"F_Specs","F_InUnit":"F_InUnit","F_OutUnit":"F_OutUnit","F_BasicUnit":"F_BasicUnit","F_ComUnit":"F_ComUnit","F_Unit":"F_InUnit","F_UnitId":"F_InUnit","F_Quantity":"qun","F_Description":""}'
              );
            this.erp_stockinstockentry.erp_stockinstockentry = dynamic;
            this.preloadLoading107 = false;
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
/deep/ .el-col{
	margin-bottom: 10px;
}	
</style>
