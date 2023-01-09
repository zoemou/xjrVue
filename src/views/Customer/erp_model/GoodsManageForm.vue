<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-tabs v-model="tabsValue101" type="" tab-position="top" @tab-click="handleTabsClick101">
            <el-tab-pane label="商品基本信息" name="tab1">
              <el-col :span="12" v-if="hasFormPermission('F_EnCode')">
                <el-form-item label="商品编号" prop="F_EnCode">
                  <el-input v-model="formData['F_EnCode']" placeholder="请输入商品编号"
                    :disabled="hasDisabledPermission('F_EnCode',false)"
                    :readonly="!hasEditPermission('F_EnCode',false)" clearable :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_FullName')">
                <el-form-item label="商品名称" prop="F_FullName">
                  <el-input v-model="formData['F_FullName']" placeholder="请输入商品名称"
                    :disabled="hasDisabledPermission('F_FullName',false)"
                    :readonly="!hasEditPermission('F_FullName',false)" clearable
                    :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_GoodsCategoryId')">
                <el-form-item label="商品类型" prop="F_GoodsCategoryId">
                  <el-select v-model="formData.F_GoodsCategoryId" placeholder="请选择商品类型"
                    :disabled="hasDisabledPermission('F_GoodsCategoryId',false)"
                    :readonly="!hasEditPermission('F_GoodsCategoryId',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_GoodsCategoryIdOptions"
                    @change="handlerSelectF_GoodsCategoryId" :loading="F_GoodsCategoryIdLoading">
                    <el-option v-for="(item, index) in F_GoodsCategoryIdOptions" :key="index"
                      :label="item.F_FullName" :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_BarCode')">
                <el-form-item label="商品条码" prop="F_BarCode">
                  <el-input v-model="formData['F_BarCode']" placeholder="请输入商品条码"
                    :disabled="hasDisabledPermission('F_BarCode',false)"
                    :readonly="!hasEditPermission('F_BarCode',false)" clearable :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_Brand')">
                <el-form-item label="商品品牌" prop="F_Brand">
                  <el-input v-model="formData['F_Brand']" placeholder="请输入商品品牌"
                    :disabled="hasDisabledPermission('F_Brand',false)"
                    :readonly="!hasEditPermission('F_Brand',false)" clearable :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_Specs')">
                <el-form-item label="规格型号" prop="F_Specs">
                  <el-input v-model="formData['F_Specs']" placeholder="请输入规格型号"
                    :disabled="hasDisabledPermission('F_Specs',false)"
                    :readonly="!hasEditPermission('F_Specs',false)" clearable :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_DefaultWarehouse')">
                <el-form-item label="默认仓库" prop="F_DefaultWarehouse">
                  <el-select v-model="formData.F_DefaultWarehouse" placeholder="请选择默认仓库"
                    :disabled="hasDisabledPermission('F_DefaultWarehouse',false)"
                    :readonly="!hasEditPermission('F_DefaultWarehouse',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_DefaultWarehouseOptions"
                    @change="handlerSelectF_DefaultWarehouse" :loading="F_DefaultWarehouseLoading">
                    <el-option v-for="(item, index) in F_DefaultWarehouseOptions" :key="index"
                      :label="item.F_FullName" :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_BasicUnit')">
                <el-form-item label="基本单位" prop="F_BasicUnit">
                  <el-select v-model="formData.F_BasicUnit" placeholder="请选择基本单位"
                    :disabled="hasDisabledPermission('F_BasicUnit',false)"
                    :readonly="!hasEditPermission('F_BasicUnit',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_ComUnitOptions"
                    @change="handlerSelectF_BasicUnit" :loading="F_BasicUnitLoading">
                    <el-option v-for="(item, index) in F_ComUnitOptions" :key="index"
                      :label="item.F_FullName" :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_ComUnit')">
                <el-form-item label="库存显示单位" prop="F_ComUnit">
                  <el-select v-model="formData.F_ComUnit" placeholder="请选择库存显示单位"
                    :disabled="hasDisabledPermission('F_ComUnit',false)"
                    :readonly="!hasEditPermission('F_ComUnit',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_ComUnitOptions"
                    @change="handlerSelectF_ComUnit" :loading="F_ComUnitLoading">
                    <el-option v-for="(item, index) in F_ComUnitOptions" :key="index" :label="item.F_FullName"
                      :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="hasFormPermission('F_InUnit')">
                <el-form-item label="入库单位" prop="F_InUnit">
                  <el-select v-model="formData.F_InUnit" placeholder="请选择入库单位"
                    :disabled="hasDisabledPermission('F_InUnit',false)"
                    :readonly="!hasEditPermission('F_InUnit',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_ComUnitOptions"
                    @change="handlerSelectF_InUnit" :loading="F_InUnitLoading">
                    <el-option v-for="(item, index) in F_ComUnitOptions" :key="index" :label="item.F_FullName"
                      :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="hasFormPermission('F_OutUnit')">
                <el-form-item label="出库单位" prop="F_OutUnit">
                  <el-select v-model="formData.F_OutUnit" placeholder="请选择出库单位"
                    :disabled="hasDisabledPermission('F_OutUnit',false)"
                    :readonly="!hasEditPermission('F_OutUnit',undefined)" filterable clearable
                    :style="{width: '100%'}" remote :remote-method="getF_ComUnitOptions"
                    @change="handlerSelectF_OutUnit" :loading="F_OutUnitLoading">
                    <el-option v-for="(item, index) in F_ComUnitOptions" :key="index" :label="item.F_FullName"
                      :value="item.F_Id" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="hasFormPermission('F_SalePrice')">
                <el-form-item label="商品售价" prop="F_SalePrice">
                  <el-input v-model="formData['F_SalePrice']" type="number" placeholder="请输入商品售价"
                    :disabled="hasDisabledPermission('F_SalePrice',false)"
                    :readonly="!hasEditPermission('F_SalePrice',false)" clearable
                    :style="{width: '100%'}">
                    <template slot="prepend">¥</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="hasFormPermission('F_CostPrice')">
                <el-form-item label="成本价格" prop="F_CostPrice">
                  <el-input v-model="formData['F_CostPrice']" type="number" placeholder="请输入成本价格"
                    :disabled="hasDisabledPermission('F_CostPrice',false)"
                    :readonly="!hasEditPermission('F_CostPrice',false)" clearable
                    :style="{width: '100%'}">
                    <template slot="prepend">¥</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="hasFormPermission('F_Description')">
                <el-form-item label="描述" prop="F_Description">
                  <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入描述"
                    :disabled="hasDisabledPermission('F_Description',false)"
                    :readonly="!hasEditPermission('F_Description',false)"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="商品图册" name="tab2">
              <el-col :span="24" v-if="hasFormPermission('F_GoodsImage')">
                <el-form-item label="图片" prop="F_GoodsImage">
                  <xjr-custom-upload :config="F_GoodsImageConfig"
                    :disabled="hasDisabledPermission('F_GoodsImage',false)"
                    :readonly="!hasEditPermission('F_GoodsImage',undefined)"
                    v-model="formData['F_GoodsImage']" list-type="picture-card"></xjr-custom-upload>
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom:20px; text-align: center;">
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
      addressUrl:'goodsmanage',
      mainTableName: 'erp_goods',
      formConfig: {
        "fields": [{
          "tempType": "default",
          "__config__": {
            "showLabel": false,
            "tag": "avue-tabs",
            "componentName": "avue-tabs",
            "componentTitle": "avue-tabs",
            "span": 24,
            "layoutTree": true,
            "currentTab": "tab1",
            "tabsType": "",
            "tabPosition": "top",
            "option": {
              "submitBtn": false,
              "emptyBtn": false,
              "column": [{
                "icon": "el-icon-info",
                "label": "商品基本信息",
                "prop": "tab1"
              }, {
                "icon": "el-icon-warning",
                "label": "商品图册",
                "prop": "tab2"
              }]
            },
            "formId": 101,
            "children": [],
            "childrenObj": {
              "tab1": [{
                "__vModel__": "F_EnCode",
                "__config__": {
                  "label": "商品编号",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 12,
                  "formId": 102
                }
              }, {
                "__vModel__": "F_FullName",
                "__config__": {
                  "label": "商品名称",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 12,
                  "formId": 103
                }
              }, {
                "__vModel__": "F_GoodsCategoryId",
                "__config__": {
                  "label": "商品类型",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 131,
                  "database": "localDB",
                  "sql": "select w.F_Id,w.F_FullName from erp_goodscategory w where w.F_ParentId!='0'\n",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "__vModel__": "F_BarCode",
                "__config__": {
                  "label": "商品条码",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 12,
                  "formId": 105
                }
              }, {
                "__vModel__": "F_Brand",
                "__config__": {
                  "label": "商品品牌",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 12,
                  "formId": 106
                }
              }, {
                "__vModel__": "F_Specs",
                "__config__": {
                  "label": "规格型号",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 12,
                  "formId": 107
                }
              }, {
                "__vModel__": "F_DefaultWarehouse",
                "__config__": {
                  "label": "默认仓库",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 128,
                  "database": "localDB",
                  "sql": "select w.F_Id,w.F_FullName from erp_warehouse w",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "__vModel__": "F_BasicUnit",
                "__config__": {
                  "label": "基本单位",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 111,
                  "database": "localDB",
                  "sql": "select c.F_Id,c.F_FullName from erp_unitconvert c where c.F_ParentId='0'",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "__vModel__": "F_ComUnit",
                "__config__": {
                  "label": "库存显示单位",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 112,
                  "database": "localDB",
                  "sql": "select c.F_Id,c.F_FullName from erp_unitconvert c where c.F_ParentId='0'",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "__vModel__": "F_InUnit",
                "__config__": {
                  "label": "入库单位",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 113,
                  "database": "localDB",
                  "sql": "select c.F_Id,c.F_FullName from erp_unitconvert c where c.F_ParentId='0'",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "__vModel__": "F_OutUnit",
                "__config__": {
                  "label": "出库单位",
                  "showLabel": true,
                  "tag": "el-select",
                  "avueType": "asso-select",
                  "filterable": true,
                  "span": 12,
                  "dataType": "dataSql",
                  "autoBindFields": "",
                  "formId": 114,
                  "database": "localDB",
                  "sql": "select c.F_Id,c.F_FullName from erp_unitconvert c where c.F_ParentId='0'",
                  "showField": "F_FullName",
                  "saveField": "F_Id"
                }
              }, {
                "tempType": "number",
                "__vModel__": "F_SalePrice",
                "computationalConfiguration": [],
                "prepend": "¥",
                "__config__": {
                  "label": "商品售价",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 24,
                  "formId": 116
                }
              }, {
                "tempType": "number",
                "__vModel__": "F_CostPrice",
                "computationalConfiguration": [],
                "prepend": "¥",
                "__config__": {
                  "label": "成本价格",
                  "showLabel": true,
                  "tag": "el-input",
                  "avueType": "input",
                  "span": 24,
                  "formId": 118
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
                  "formId": 119
                }
              }],
              "tab2": [{
                "__vModel__": "F_GoodsImage",
                "__config__": {
                  "label": "图片",
                  "tag": "el-upload",
                  "avueType": "upload",
                  "showLabel": true,
                  "span": 24,
                  "formId": 120
                }
              }]
            }
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_EnCode': '',
        'F_FullName': '',
        'F_GoodsCategoryId': '',
        'F_BarCode': '',
        'F_Brand': '',
        'F_Specs': '',
        'F_DefaultWarehouse': '',
        'F_BasicUnit': '',
        'F_ComUnit': '',
        'F_InUnit': '',
        'F_OutUnit': '',
        'F_SalePrice': '',
        'F_CostPrice': '',
        'F_Description': '',
        'F_GoodsImage': null,
      },
      rules: {
        F_EnCode: [{
          required: true,
          message: '请输入商品编号',
          trigger: 'blur'
        }],
        F_FullName: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        F_GoodsCategoryId: [{
          required: true,
          message: '请选择商品类型',
          trigger: 'change'
        }],
        F_BarCode: [],
        F_Brand: [{
          required: true,
          message: '请输入商品品牌',
          trigger: 'blur'
        }],
        F_Specs: [],
        F_DefaultWarehouse: [],
        F_BasicUnit: [{
          required: true,
          message: '请选择基本单位',
          trigger: 'change'
        }],
        F_ComUnit: [{
          required: true,
          message: '请选择库存显示单位',
          trigger: 'change'
        }],
        F_InUnit: [{
          required: true,
          message: '请选择入库单位',
          trigger: 'change'
        }],
        F_OutUnit: [{
          required: true,
          message: '请选择出库单位',
          trigger: 'change'
        }],
        F_SalePrice: [],
        F_CostPrice: [],
        F_Description: [],
      },
      tabsValue101: 'tab1',
      option101: {
        "submitBtn": false,
        "emptyBtn": false,
        "column": [{
          "icon": "el-icon-info",
          "label": "商品基本信息",
          "prop": "tab1"
        }, {
          "icon": "el-icon-warning",
          "label": "商品图册",
          "prop": "tab2"
        }]
      },
      F_GoodsCategoryIdOptions: [],
      F_GoodsCategoryIdLoading: false,
      F_DefaultWarehouseOptions: [],
      F_DefaultWarehouseLoading: false,
      F_BasicUnitOptions: [],
      F_BasicUnitLoading: false,
      F_ComUnitOptions: [],
      F_ComUnitLoading: false,
      F_InUnitOptions: [],
      F_InUnitLoading: false,
      F_OutUnitOptions: [],
      F_OutUnitLoading: false,
      F_GoodsImageConfig: {
        "showTip": false,
        "fileSize": 2,
        "sizeUnit": "MB",
        "buttonText": "点击上传"
      },
    }
  },
  computed: {},
  watch: {
    'formData.F_SalePrice': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_CostPrice': function(val, oldVal) {
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

       
    if (typeof this.getF_GoodsCategoryIdOptions == "function") {
      await this.getF_GoodsCategoryIdOptions();
    }
    if (typeof this.getF_DefaultWarehouseOptions == "function") {
      await this.getF_DefaultWarehouseOptions();
    }
    if (typeof this.getF_ComUnitOptions == "function") {
      await this.getF_ComUnitOptions();
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
    handleTabsClick101(column) {
      console.log(column);
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
    async getF_GoodsCategoryIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_GoodsCategoryIdOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_FullName&keyword=' +
              keyword
          });
          this.F_GoodsCategoryIdOptionsLoading = false;
          this.F_GoodsCategoryIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `select w.F_Id,w.F_FullName from erp_goodscategory w where w.F_ParentId!='0'
`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_GoodsCategoryIdOptionsLoading = false;
          this.F_GoodsCategoryIdOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_GoodsCategoryId(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_GoodsCategoryIdOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    async getF_DefaultWarehouseOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_DefaultWarehouseOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_FullName&keyword=' +
              keyword
          });
          this.F_DefaultWarehouseOptionsLoading = false;
          this.F_DefaultWarehouseOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `select w.F_Id,w.F_FullName from erp_warehouse w`;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_DefaultWarehouseOptionsLoading = false;
          this.F_DefaultWarehouseOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_DefaultWarehouse(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_DefaultWarehouseOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    handlerSelectF_BasicUnit(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_BasicUnitOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    async getF_ComUnitOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/erp_purchaserequsetinfo2/unit'
          });
          this.F_ComUnitOptionsLoading = false;
          this.F_ComUnitOptions = resp.data.data;
      }
      catch (error) {}
    },
    handlerSelectF_ComUnit(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_ComUnitOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    handlerSelectF_InUnit(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_InUnitOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },
    handlerSelectF_OutUnit(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_OutUnitOptions.filter(item => {
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
/deep/ .el-input--medium .el-input__inner{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 2px;
}
/deep/ .el-upload-list--picture-card{
	height: auto;
}
/deep/ .el-form-item{
	margin-bottom: 8px!important;
}
/deep/ .el-form-item--medium .el-form-item__content, /deep/ .el-form-item--medium .el-form-item__label{
	line-height: 27px;
}
</style>

