<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_Id')">
          <el-form-item label="id" prop="F_Id">
            <el-input v-model="formData['F_Id']" placeholder="请输入id"
              :disabled="hasDisabledPermission('F_Id',false)"
              :readonly="!hasEditPermission('F_Id',false)" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_InventoryDate')">
          <el-form-item label="盘点时间" prop="F_InventoryDate">
            <el-date-picker :disabled="hasDisabledPermission('F_InventoryDate',false)"
              :readonly="!hasEditPermission('F_InventoryDate',false)" type="datetime"
              v-model="formData['F_InventoryDate']" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择盘点时间" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_InventoryCode')">
          <el-form-item label="库存盘点编号" prop="F_InventoryCode">
            <el-input v-model="formData['F_InventoryCode']" placeholder="库存盘点编号"
              :disabled="hasDisabledPermission('F_InventoryCode',undefined)"
              :readonly="!hasEditPermission('F_InventoryCode',true)" clearable :style="{width: '100%'}">
            </el-input>
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
        <el-col :span="8" v-if="hasFormPermission('F_AuditMark')">
          <el-form-item label="单据状态" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入单据状态"
              :disabled="hasDisabledPermission('F_AuditMark',false)"
              :readonly="!hasEditPermission('F_AuditMark',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_WareHouseId')">
          <el-form-item label="仓库" prop="F_WareHouseId">
            <el-select v-model="formData.F_WareHouseId" placeholder="请选择仓库"
              :disabled="hasDisabledPermission('F_WareHouseId',false)"
              :readonly="!hasEditPermission('F_WareHouseId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_WareHouseIdOptions"
              @change="handlerSelectF_WareHouseId" :loading="F_WareHouseIdLoading">
              <el-option v-for="(item, index) in F_WareHouseIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <avue-form v-loading="preloadLoading107" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option107" v-model="erp_stockinventoryentry" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
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
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px;margin-bottom: 20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit">
			 <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
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
      addressUrl:'erp_disk',
      mainTableName: 'erp_stockinventory',
      formConfig: {
        "fields": [{
          "__vModel__": "F_Id",
          "__config__": {
            "label": "id",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 114
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "F_InventoryDate",
          "__config__": {
            "label": "盘点时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 105
          }
        }, {
          "__vModel__": "F_InventoryCode",
          "__config__": {
            "label": "库存盘点编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "span": 8,
            "autoCodeRule": "InStockCode",
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
            "formId": 132
          }
        }, {
          "__vModel__": "F_AuditMark",
          "__config__": {
            "label": "单据状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8
          }
        }, {
          "__vModel__": "F_WareHouseId",
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
              "__vModel__": "F_Id",
              "__config__": {
                "label": "id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_Id"
              }
            }, {
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinventoryentry",
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
                "bindTable": "erp_stockinventoryentry",
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
                "bindTable": "erp_stockinventoryentry",
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
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_Specs"
              }
            }, {
              "__vModel__": "F_BasicAmount",
              "__config__": {
                "label": "基本库存数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_BasicAmount"
              }
            }, {
              "__vModel__": "F_ComAmount",
              "__config__": {
                "label": "库存显示数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 8,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_ComAmount"
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_Quantity",
              "computationalConfiguration": [],
              "__config__": {
                "label": "本次盘点数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_Quantity"
              }
            }, {
              "__vModel__": "F_BasicDiff",
              "__config__": {
                "label": "基本库存差数",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_BasicDiff"
              }
            }, {
              "__vModel__": "F_ComDiff",
              "__config__": {
                "label": "库存显示差数",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_ComDiff"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_Description"
              }
            }, {
              "__vModel__": "F_AuditMark",
              "__config__": {
                "label": "状态",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_stockinventoryentry",
                "bindTableField": "F_AuditMark"
              }
            }],
            "database": "localDB",
            "sql": "\tSELECT\n\tg.F_Id,\n\tg.F_FullName,\n\tg.F_EnCode,\n\tg.F_Specs,\n\tg.F_ComUnit,\n\tg.F_SalePrice,\n\tg.F_CostPrice,\n\ti.F_ComAmount,\n\ti.F_WarehouseId \nFROM\n\terp_goods g\n\tLEFT JOIN erp_inventory i ON g.F_Id = i.F_GoodsId  where g.F_Id IN('15502e56-5e1f-40cd-bb8f-96ae7f281a35','551b51b8-b466-4ab8-8172-41d92504e56a') and i.F_WarehouseId='bd345500-82ae-440f-9b01-38149711a50e'"
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
      formData: {
        'F_Id': '',
        'F_InventoryDate': null,
        'F_InventoryCode': '',
        'F_Manager': '',
        'F_AuditMark': '',
        'F_WareHouseId': '',
        'F_InvalidUserId': '',
        'F_InvalidTime': null,
        'F_Description': '',
      },
      rules: {
        F_Id: [],
        F_InventoryDate: [{
          required: true,
          message: '请选择盘点时间',
          trigger: 'change'
        }],
        F_InventoryCode: [{
          required: true,
          message: '库存盘点编号',
          trigger: 'blur'
        }],
        F_Manager: [{
          required: true,
          message: '请输入经办人',
          trigger: 'blur'
        }],
        F_AuditMark: [],
        F_WareHouseId: [],
        F_InvalidTime: [],
        F_Description: [],
      },
      F_WareHouseIdOptions: [],
      F_WareHouseIdLoading: false,
      option107: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '',
          prop: 'erp_stockinventoryentry',
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
            column: [{
              label: 'id',
              prop: 'F_Id',
              type: 'input',
            }, {
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
              label: '规格型号',
              prop: 'F_Specs',
              type: 'input',
            }, {
              label: '基本库存数量',
              prop: 'F_BasicAmount',
              type: 'number',
            }, {
              label: '库存显示数量',
              prop: 'F_ComAmount',
              type: 'number',
            }, {
              label: '本次盘点数量',
              prop: 'F_Quantity',
              type: 'input',
            }, {
              label: '基本库存差数',
              prop: 'F_BasicDiff',
              type: 'input',
            }, {
              label: '库存显示差数',
              prop: 'F_ComDiff',
              type: 'input',
            }, {
              label: '说明信息',
              prop: 'F_Description',
              type: 'input',
            }, {
              label: '状态',
              prop: 'F_AuditMark',
              type: 'input',
            }, ]
          }
        }, ],
      },
      erp_stockinventoryentry: {},
      preloadLoading107: false,
    }
  },
  computed: {},
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
				this.$nextTick(()=>{
                  
            this.formData = res.data.data.erp_stockinventory
            
          this.erp_stockinventoryentry.erp_stockinventoryentry = res.data.data.erp_stockinventoryentry
          
        this.erp_stockinventoryentry.erp_stockinventoryentry.forEach(element => {
      });
      
				})
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_InventoryCodeOptions == "function") {
      await this.getF_InventoryCodeOptions();
    }
    if (typeof this.getF_WareHouseIdOptions == "function") {
      await this.getF_WareHouseIdOptions();
    }
    if (this.isAdd) {
      await this.preloadData107()
    }
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        erp_stockinventoryentryEntityList: this.erp_stockinventoryentry.erp_stockinventoryentry,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_stockinventoryentry.erp_stockinventoryentry.forEach(element => {});
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
          
    async getF_InventoryCodeOptions() {
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
          this.formData.F_InventoryCode = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_WareHouseIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_WareHouseIdOptionsLoading = true;
      }
      try {
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
        this.F_WareHouseIdOptionsLoading = false;
        this.F_WareHouseIdOptions = resp.data.data;
      }
      catch (error) {}
    },
    handlerSelectF_WareHouseId(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_WareHouseIdOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
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
          //找到对应formId 元素  key值为存储的对应formId
          if (Object.prototype.toString.call(autoBindFields) === '[object Array]') {
            autoBindFields.forEach(el => {
              if (el.component == item.__config__.formId) {
                this.formData[item.__vModel__] = data[el.bindField];
              }
            })
          }
          else {
            if (autoBindFields.hasOwnProperty(item.__config__.formId)) {
              //按绑定的自定义字段赋值
              this.formData[item.__vModel__] = data[autoBindFields[item.__config__.formId]];
            }
          }
        }
      });
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
              sql: `SELECT
              g.F_Id,
              g.F_FullName,
              g.F_EnCode,
              g.F_Specs,
              g.F_ComUnit,
              g.F_SalePrice,
              g.F_CostPrice,
              i.F_ComAmount,
              i.F_WarehouseId
              FROM
              erp_goods g
              LEFT JOIN erp_inventory i ON g.F_Id = i.F_GoodsId where g.F_Id IN(
                '15502e56-5e1f-40cd-bb8f-96ae7f281a35', '551b51b8-b466-4ab8-8172-41d92504e56a') and i
              .F_WarehouseId = 'bd345500-82ae-440f-9b01-38149711a50e'
              `}
            });
          if (resp.data) {
            let {
              data
            } = resp.data
            let dynamic = this.getDicData(data,
              '{"F_Id":"","F_GoodsId":"F_Id","F_GoodsName":"F_FullName","F_GoodCode":"F_EnCode","F_Specs":"F_Specs","F_BasicAmount":"F_ComAmount","F_ComAmount":"","F_BasicDiff":"","F_ComDiff":"","F_Description":"","F_AuditMark":""}'
              );
            this.erp_stockinventoryentry.erp_stockinventoryentry = dynamic;
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
/deep/ .el-input--medium .el-input__inner{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 2px;
}
</style>
