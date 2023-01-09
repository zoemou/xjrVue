<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_SalesCode')">
          <el-form-item :label="$t('单据编码')" prop="F_SalesCode">
            <el-input v-model="formData['F_SalesCode']" placeholder="单据编码"
              :disabled="hasDisabledPermission('F_SalesCode',undefined)"
              :readonly="!hasEditPermission('F_SalesCode',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Orderdate')">
          <el-form-item :label="$t('订单日期')" prop="F_Orderdate">
            <el-date-picker :disabled="hasDisabledPermission('F_Orderdate',false)"
              :readonly="!hasEditPermission('F_Orderdate',false)" v-model="formData['F_Orderdate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择订单日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryDate')">
          <el-form-item :label="$t('发货日期')" prop="F_DeliveryDate">
            <el-date-picker :disabled="hasDisabledPermission('F_DeliveryDate',false)"
              :readonly="!hasEditPermission('F_DeliveryDate',false)" v-model="formData['F_DeliveryDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择发货日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ClientId')">
          <el-form-item :label="$t('客户名称')" prop="F_ClientId">
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
          <el-form-item :label="$t('销售类型')" prop="F_SalesType">
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
          <el-form-item :label="$t('销售人员')" prop="F_SalesPersonId">
            <el-input v-model="formData['F_SalesPersonId']" placeholder="请输入销售人员"
              :disabled="hasDisabledPermission('F_SalesPersonId',false)"
              :readonly="!hasEditPermission('F_SalesPersonId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentMethod')">
          <el-form-item :label="$t('付款方式')" prop="F_PaymentMethod">
            <el-select v-model="formData['F_PaymentMethod']" placeholder="请选择付款方式"
              :disabled="hasDisabledPermission('F_PaymentMethod',false)"
              :readonly="!hasEditPermission('F_PaymentMethod',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_PaymentMethodOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentPeriod')">
          <el-form-item :label="$t('付款期限')" prop="F_PaymentPeriod">
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
          <el-form-item :label="$t('优惠折扣')" prop="F_Discount">
            <el-input v-model="formData['F_Discount']" type="number" placeholder="请输入优惠折扣"
              :disabled="hasDisabledPermission('F_Discount',false)"
              :readonly="!hasEditPermission('F_Discount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DiscountedPrice')">
          <el-form-item :label="$t('优惠金额')" prop="F_DiscountedPrice">
            <el-input v-model="formData['F_DiscountedPrice']" type="number" placeholder="请输入优惠金额"
              :disabled="hasDisabledPermission('F_DiscountedPrice',false)"
              :readonly="!hasEditPermission('F_DiscountedPrice',false)" clearable
              :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Turnover')">
          <el-form-item :label="$t('成交金额')" prop="F_Turnover">
            <el-input v-model="formData['F_Turnover']" type="number" placeholder="请输入成交金额"
              :disabled="hasDisabledPermission('F_Turnover',false)"
              :readonly="!hasEditPermission('F_Turnover',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_salesorderentry')">
          <avue-form v-loading="preloadLoading117" class="" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option117" v-model="erp_salesorderentry"
            :disabled="disabled">
            <template slot-scope="{row}" slot="F_GoodsName" v-if="reRenderSubform">
              <avue-asso-popup :index="row.$index" :value="row['F_GoodsName']"
                :conf='getTableConfConfig("F_GoodsName")' :dicData='F_GoodsName124tableChildDicData'
                bindTable="erp_salesorderentry" @changeTableAssoData='changeTableAssoData'></avue-asso-popup>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item :label="$t('备注')" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AuditMark')" hidden="hidden">
          <el-form-item :label="$t('审核状态')" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_AuditMark',true)"
              :readonly="!hasEditPermission('F_AuditMark',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidMark')" hidden="hidden">
          <el-form-item :label="$t('状态')" prop="F_InvalidMark">
            <el-input v-model="formData['F_InvalidMark']" placeholder="请输入状态"
              :disabled="hasDisabledPermission('F_InvalidMark',true)"
              :readonly="!hasEditPermission('F_InvalidMark',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorUserId')">
          <el-form-item :label="$t('制单人员')" prop="F_CreatorUserId" required>
            <avue-information-body :operationVal="operationVal" infoType='user'
              :whetherToRebindSecondaryEditing='false' v-model="formData['F_CreatorUserId']"
              placeholder="当前用户" :disabled="hasDisabledPermission('F_CreatorUserId',true)"
              :readonly="!hasEditPermission('F_CreatorUserId',true)" :style="{width: '100%'}">
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorTime')">
          <el-form-item :label="$t('制单时间')" prop="F_CreatorTime">
            <el-date-picker :disabled="hasDisabledPermission('F_CreatorTime',false)"
              :readonly="!hasEditPermission('F_CreatorTime',false)" type="datetime"
              v-model="formData['F_CreatorTime']" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择制单时间" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px;margin-bottom:20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit">
			 <el-button @click="resetForm">{{$t('reset')}}</el-button> 
            <el-button type="primary" @click="submitForm">{{$t('submit')}}</el-button>
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
      reRenderSubform: false,
      operationVal: 'add',
      isAdd: true,
      addressUrl:'erp_salesorder',
      mainTableName: 'erp_salesorder',
      formConfig: {},
      F_GoodsName124tableChildDicData: [],
      formData: {
        'F_SalesCode': '',
        'F_Orderdate': null,
        'F_DeliveryDate': null,
        'F_ClientId': '',
        'F_SalesType': '',
        'F_SalesPersonId': '',
        'F_PaymentMethod': '',
        'F_PaymentPeriod': null,
        'F_IsInvoice': [],
        'F_Discount': '',
        'F_DiscountedPrice': '',
        'F_Turnover': '',
        'F_Description': '',
        'F_AuditMark': 1,
        'F_InvalidMark': 1,
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_SalesCode: [{
          required: true,
          message: '单据编码',
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
        F_ClientId: [
          {
          required: true,
          message: '请选择客户名称',
          trigger: 'change'
        }
        ],
        F_SalesType: [{
          required: true,
          message: '请选择销售类型',
          trigger: 'change'
        }],
        F_SalesPersonId: [{
          required: true,
          message: '请输入销售人员',
          trigger: 'blur'
        }],
        F_PaymentMethod: [{
          required: true,
          message: '请选择付款方式',
          trigger: 'change'
        }],
        F_PaymentPeriod: [{
          required: true,
          message: '请选择付款期限',
          trigger: 'change'
        }],
        F_IsInvoice: [],
        F_Discount: [],
        F_DiscountedPrice: [],
        F_Turnover: [{
          required: true,
          message: '请输入成交金额',
          trigger: 'blur'
        }],
        F_Description: [],
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
        F_CreatorTime: [{
          required: true,
          message: '请选择制单时间',
          trigger: 'change'
        }],
      },
      F_ClientIdOptions: [],
      F_ClientIdLoading: false,
      F_SalesTypeOptions: [],
      F_PaymentMethodOptions: [],
      F_IsInvoiceOptions: [],
      erp_salesorderentry: {},
      preloadLoading117: false,
    }
  },
  computed: {
    option117() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '商品信息',
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
              this.reRenderSubform = false; //更新组件 index
              setTimeout(() => {
                // this.$message.success('删除回调'+JSON.stringify(row));
                this.reRenderSubform = true;
              }, 0);
              done();
            },
            column:this.getAuthorityTableChildrenList('erp_salesorderentry',[{
              label: '商品id',
              prop: 'F_GoodsId',
              hide:true,
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入商品id',
              formslot: false,
            },  {
              label: '商品名称',
              prop: 'F_GoodsName',
              value: '',
              type: 'asso-popup',
              width: null,
              placeholder: '请输入商品名称',
              formslot: true,
            }, {
              label: '商品编码',
              prop: 'F_GoodCode',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入商品编码',
              formslot: false,
            }, {
              label: '规格型号',
              prop: 'F_Specs',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入规格型号',
              formslot: false,
            },{
              label: '单位',
              prop: 'F_Unit',
              value: '',
              type: 'select',
              props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
              dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
              width: null,
              placeholder: '请选择单位',
              formslot: false,
            }, {
              label: '默认仓库',
              prop: 'F_DefaultWarehouse',
              value: '',
              type: 'select',
              props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
              dicUrl: baseUrl + "/erp_salesorder/getWarehouse",
              width: null,
              placeholder: '请选择默认仓库',
              formslot: false,
            }, {
              label: '库存',
              prop: 'F_Inventory',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入库存',
              formslot: false,
            }, {
              label: '单价',
              prop: 'F_UnitPrice',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入单价',
              formslot: false,
            }, {
              label: '数量',
              prop: 'F_Quantity',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '数量',
              formslot: false,
            }, {
              label: '未出库数量',
              prop: 'F_NoOutQua',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '未出库数量',
              formslot: false,
            }, {
              label: '已出库数量',
              prop: 'F_OutQua',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '已出库数量',
              formslot: false,
            }, {
              label: '金额',
              prop: 'F_Amount',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入金额',
              formslot: false,
            }, {
              label: '税率',
              prop: 'F_TaxRate',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入税率',
              formslot: false,
            }, {
              label: '含税单价',
              prop: 'F_TaxPrice',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入含税单价',
              formslot: false,
            }, {
              label: '含税金额',
              prop: 'F_TaxAmount',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入含税金额',
              formslot: false,
            }, {
              label: '说明信息',
              prop: 'F_Description',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入说明信息',
              formslot: false,
            }, ]) 
          }
        }, ],
      }
    }
  },
  watch: {
    'formData.F_Discount': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_DiscountedPrice': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_Turnover': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    erp_salesorderentry:{
      handler()
      {
              if(!this.erp_salesorderentry.erp_salesorderentry) return
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
  created() {
    this.formConfig = this.getFormConfig();
  },
  async mounted() {
    this.showForm = false;
    //TODO   再这里做数据回填 请求表单数据
   
           if(this.keyValue){
              this.isAdd = false;
          }
           if(!this.isAdd&&this.keyValue){
              this.operationVal = 'edit';
              try {
                let res = await request({
                  url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
                  method: "get",
                });
                  
          this.erp_salesorderentry.erp_salesorderentry = res.data.data.erp_salesorderentry
          
            this.formData = res.data.data.erp_salesorder
            
            if(res.data.data.erp_salesorder.F_IsInvoice){
              this.formData.F_IsInvoice = res.data.data.erp_salesorder.F_IsInvoice.split(',')
            }
            
        this.erp_salesorderentry.erp_salesorderentry.forEach(element => {
      });
      
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
    try {
      await this.setTableDicData();
      this.reRenderSubform = true;
    }
    catch (error) {}
    this.showForm = true;
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
    validateForm() {
      this.$refs['elForm'].validate(valid => {});
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        if (this.formData.F_IsInvoice instanceof Array) this.formData.F_IsInvoice = this.formData
          .F_IsInvoice.join(',')
        if (this.erp_salesorderentry.erp_salesorderentry && this.erp_salesorderentry.erp_salesorderentry
          .length > 0) {
          this.erp_salesorderentry.erp_salesorderentry.forEach((element, index) => {
            let itemChild = {
              ...element
            }
            delete itemChild._index
            for (let [key, value] of Object.entries(itemChild)) {
              if (key.includes('$')) {
                delete itemChild[key];
              }
            }
            this.erp_salesorderentry.erp_salesorderentry[index] = itemChild;
          });
        }
        else {
          this.erp_salesorderentry.erp_salesorderentry = [];
        }
        var isPrompt = false;
       var isQuaNull=false;
       for(var j=0;j<this.erp_salesorderentry.erp_salesorderentry.length;j++)
        {
          for(var i=j+1;i<this.erp_salesorderentry.erp_salesorderentry.length;i++)
          {
            if(this.erp_salesorderentry.erp_salesorderentry[i]["F_GoodsId"]==this.erp_salesorderentry.erp_salesorderentry[j]["F_GoodsId"])
            {
              isPrompt=true;
            }
          }
          if(this.erp_salesorderentry.erp_salesorderentry[j]["F_Quantity"]<0||this.erp_salesorderentry.erp_salesorderentry[j]["F_Quantity"]==0)
          {
            isQuaNull=true;
          }
        }
        if(isPrompt)
        {
           this.$confirm("请勿选择重复商品","提示");
           return;
        }
        if(isQuaNull)
        {
          this.$confirm("请核实订单数量为0的商品","提示");
           return;
        }
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
      catch (error) {}
    },
    handlerSelectF_ClientId(val) {
      let autoBindFields = [];
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
      //更新表单校验
      this.validateForm();
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
          url:  baseUrl + '/data-items/IsEnd/detail',
        });
        if (resp.data.data) {
          this.F_IsInvoiceOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    changeTableAssoData(val) {
      let {
        index,
        value,
        bindTable,
        __vModel__,
        autoBindFields,
        data
      } = val;
      this[bindTable][bindTable][index][__vModel__] = value;
      if (autoBindFields && autoBindFields.length > 0) {
        autoBindFields.forEach(ele => {
          if (ele.field && ele.bindField) {
            this[bindTable][bindTable][index][ele.field] = data[ele.bindField];
          }
        });
      }
    },
    getFormConfig() {
      let config = {
        "fields": [{
          "__vModel__": "F_SalesCode",
          "__config__": {
            "label": "单据编码",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "autoCodeRule": "销售订单单据编号",
            "prestrainField": "",
            "formId": 103,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_SalesCode",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_Orderdate",
          "__config__": {
            "label": "订单日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 104,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_Orderdate",
            "bindTableFieldType": "datetime"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_DeliveryDate",
          "__config__": {
            "label": "发货日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 105,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_DeliveryDate",
            "bindTableFieldType": "datetime"
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
            "required": false,
            "dataType": "dataSql",
            "autoBindFields": "",
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 107,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_ClientId",
            "bindTableFieldType": "varchar",
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
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 108,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_SalesType",
            "bindTableFieldType": "varchar",
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
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 109,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_SalesPersonId",
            "bindTableFieldType": "varchar"
          }
        }, {
          "__vModel__": "F_PaymentMethod",
          "__config__": {
            "label": "付款方式",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 110,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_PaymentMethod",
            "bindTableFieldType": "varchar",
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
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 111,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_PaymentPeriod",
            "bindTableFieldType": "datetime"
          }
        }, {
          "__vModel__": "F_IsInvoice",
          "__config__": {
            "label": "是否开票",
            "tag": "el-checkbox-group",
            "avueType": "checkbox",
            "defaultValue": [],
            "span": 8,
            "showLabel": true,
            "optionType": "default",
            "required": true,
            "border": false,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 112,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_IsInvoice",
            "bindTableFieldType": "varchar",
            "dataType": "dataItem",
            "dataItem": "IsEnd"
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_Discount",
          "computationalConfiguration": [],
          "prepend": "%",
          "taxRate": 3,
          "__config__": {
            "label": "优惠折扣",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": false,
            "span": 8,
            "F_LgMarkCode": "",
            "formId": 114,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_Discount",
            "bindTableFieldType": "varchar"
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
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 115,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_DiscountedPrice",
            "bindTableFieldType": "decimal"
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
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 116,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_Turnover",
            "bindTableFieldType": "decimal"
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "商品信息",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 117,
            "children": [{
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 119,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_GoodsId",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Specs",
              "__config__": {
                "label": "规格型号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 120,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Specs",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_GoodsName",
              "suffix-icon": "el-icon-more",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-mutiple-input",
                "avueType": "asso-popup",
                "openDialog": true,
                "filterable": true,
                "required": false,
                "dataType": "dataSql",
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "autoBindFields": "[{\"id\":0,\"bindField\":\"GoodsId\",\"component\":119,\"field\":\"F_GoodsId\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":143,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Specs\",\"component\":120,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_ComUnit\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_SalePrice\",\"component\":131,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_CostPrice\",\"component\":128,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"F_DefaultWarehouse\",\"component\":126,\"field\":\"F_DefaultWarehouse\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_OutUnit\",\"component\":125,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":8},{\"id\":9,\"bindField\":\"F_ComAmount\",\"component\":144,\"field\":\"F_Inventory\",\"isShow\":true,\"width\":150,\"$index\":9},{\"id\":10,\"bindField\":\"F_Quantity\",\"component\":127,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":10},{\"id\":11,\"bindField\":\"F_OutQua\",\"component\":129,\"field\":\"F_OutQua\",\"isShow\":true,\"width\":150,\"$index\":11}]",
                "formId": 124,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_GoodsName",
                "bindTableFieldType": "varchar",
                "isChild": true,
                "database": "localDB",
                "sql": "SELECT g.F_Id GoodsId,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice,g.F_DefaultWarehouse,g.F_OutUnit,i.F_ComAmount,0 as F_Quantity,0 as F_OutQua FROM erp_goods g left join erp_inventory i on g.F_DefaultWarehouse=i.F_WarehouseId and g.F_Id=i.F_GoodsId",
                "showField": "F_FullName",
                "saveField": "F_FullName"
              }
            }, {
              "__vModel__": "F_GoodCode",
              "__config__": {
                "label": "商品编码",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 12,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 143,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_GoodCode",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Unit",
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
                "bindTableField": "F_Unit",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_DefaultWarehouse",
              "__config__": {
                "label": "默认仓库",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 126,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_DefaultWarehouse",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Inventory",
              "__config__": {
                "label": "库存",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 12,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 144,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Inventory",
                "bindTableFieldType": "varchar",
                "isChild": true
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
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 128,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_UnitPrice",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Quantity",
              "__config__": {
                "label": "数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 127,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Quantity",
                "bindTableFieldType": "int",
                "isChild": true
              }
            }, {
              "__vModel__": "F_NoOutQua",
              "__config__": {
                "label": "未出库数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 130,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_NoOutQua",
                "bindTableFieldType": "int",
                "isChild": true
              }
            }, {
              "__vModel__": "F_OutQua",
              "__config__": {
                "label": "已出库数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 129,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_OutQua",
                "bindTableFieldType": "int",
                "isChild": true
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
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 131,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Amount",
                "bindTableFieldType": "decimal",
                "isChild": true
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_TaxRate",
              "computationalConfiguration": [],
              "prepend": "%",
              "taxRate": 3,
              "__config__": {
                "label": "税率",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "formId": 132,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_TaxRate",
                "bindTableFieldType": "int",
                "isChild": true
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
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 133,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_TaxPrice",
                "bindTableFieldType": "decimal",
                "isChild": true
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
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 134,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_TaxAmount",
                "bindTableFieldType": "decimal",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 135,
                "bindTable": "erp_salesorderentry",
                "bindTableField": "F_Description",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }],
            "bindTable": "erp_salesorderentry"
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "required": true,
            "span": 24,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 136,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_Description",
            "bindTableFieldType": "varchar"
          }
        }, {
          "__vModel__": "F_AuditMark",
          "__config__": {
            "label": "审核状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "defaultValue": 1,
            "required": true,
            "span": 12,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 141,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_AuditMark",
            "bindTableFieldType": "int"
          }
        }, {
          "__vModel__": "F_InvalidMark",
          "__config__": {
            "label": "状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "defaultValue": 1,
            "required": true,
            "span": 12,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 142,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_InvalidMark",
            "bindTableFieldType": "int"
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
            "defaultValue": "dd5d4xBrDO",
            "required": true,
            "span": 12,
            "whetherToRebindSecondaryEditing": false,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 137,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_CreatorUserId",
            "bindTableFieldType": "varchar",
            "placeholder": "当前用户"
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "F_CreatorTime",
          "__config__": {
            "label": "制单时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 12,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 140,
            "bindTable": "erp_salesorder",
            "bindTableField": "F_CreatorTime",
            "bindTableFieldType": "datetime"
          }
        }]
      };
      return config;
    },
    getTableConfConfig(vmodel) {
      let config = {
        "F_GoodsName": {
          "suffix-icon": "el-icon-more",
          "prefix-icon": "",
          "disabled": false,
          "style": {
            "width": "100%"
          },
          "__vModel__": "F_GoodsName",
          "__config__": {
            "label": "商品名称",
            "tag": "el-mutiple-input",
            "avueType": "asso-popup",
            "autoBindFields": "[{\"id\":0,\"bindField\":\"GoodsId\",\"component\":119,\"field\":\"F_GoodsId\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":143,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Specs\",\"component\":120,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_ComUnit\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_SalePrice\",\"component\":131,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_CostPrice\",\"component\":128,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"F_DefaultWarehouse\",\"component\":126,\"field\":\"F_DefaultWarehouse\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_OutUnit\",\"component\":125,\"field\":\"F_Unit\",\"isShow\":true,\"width\":150,\"$index\":8},{\"id\":9,\"bindField\":\"F_ComAmount\",\"component\":144,\"field\":\"F_Inventory\",\"isShow\":true,\"width\":150,\"$index\":9},{\"id\":10,\"bindField\":\"F_Quantity\",\"component\":127,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":10},{\"id\":11,\"bindField\":\"F_OutQua\",\"component\":129,\"field\":\"F_OutQua\",\"isShow\":true,\"width\":150,\"$index\":11}]",
            "dataType": "dataSql",
            "dataItem": "",
            "dataSource": "",
            "database": "localDB",
            "sql": "SELECT g.F_Id GoodsId,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice,g.F_DefaultWarehouse,g.F_OutUnit,i.F_ComAmount,0 as F_Quantity,0 as F_OutQua FROM erp_goods g left join erp_inventory i on g.F_DefaultWarehouse=i.F_WarehouseId and g.F_Id=i.F_GoodsId",
            "showField": "F_FullName",
            "saveField": "F_FullName"
          },
          "placeholder": "请输入商品名称"
        }
      };
      return config[vmodel] ? config[vmodel] : null;
    },
    async setTableDicData() {
      let resp124 = await this.$axios({
        method: 'get',
        url:  baseUrl + '/database-links/localDB/datas',
        params: {
          sql: 'SELECT g.F_Id GoodsId,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice,g.F_DefaultWarehouse,g.F_OutUnit,i.F_ComAmount,0 as F_Quantity,0 as F_OutQua FROM erp_goods g left join erp_inventory i on g.F_DefaultWarehouse=i.F_WarehouseId and g.F_Id=i.F_GoodsId'
        }
      });
      if (resp124.data && resp124.data.data && resp124.data.data.length) {
        let newOptions = [];
        resp124.data.data.forEach(item => {
          newOptions.push({
            label: item['F_FullName'],
            value: item['F_FullName'] + "",
            ...item
          });
        });
        this.F_GoodsName124tableChildDicData = newOptions;
      }
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
