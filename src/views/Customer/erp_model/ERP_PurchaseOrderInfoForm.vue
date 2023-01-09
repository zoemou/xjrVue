<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData"  size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseOrder')">
          <el-form-item :label="$t('采购单号')" prop="F_PurchaseOrder">
            <el-input v-model="formData['F_PurchaseOrder']" placeholder="采购单号"
              :disabled="hasDisabledPermission('F_PurchaseOrder',undefined)"
              :readonly="!hasEditPermission('F_PurchaseOrder',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_SourceNumber')">
          <el-form-item :label="$t(' 采购申请单号')" prop="F_SourceNumber">
            <el-input v-model="formData['F_SourceNumber']" placeholder="请输入 采购申请单号"
              :disabled="hasDisabledPermission('F_SourceNumber',false)"
              :readonly="!hasEditPermission('F_SourceNumber',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseDate')">
          <el-form-item :label="$t('单据日期')" prop="F_PurchaseDate">
            <el-date-picker :disabled="hasDisabledPermission('F_PurchaseDate',false)"
              :readonly="!hasEditPermission('F_PurchaseDate',false)" v-model="formData['F_PurchaseDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择单据日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchasePeople')">
          <el-form-item :label="$t('采购人员')" prop="F_PurchasePeople">
            <el-input v-model="formData['F_PurchasePeople']" placeholder="请输入采购人员"
              :disabled="hasDisabledPermission('F_PurchasePeople',false)"
              :readonly="!hasEditPermission('F_PurchasePeople',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryUnit')">
          <el-form-item :label="$t('供货单位')" prop="F_DeliveryUnit">
            <el-select v-model="formData.F_DeliveryUnit" placeholder="请选择供货单位"
              :disabled="hasDisabledPermission('F_DeliveryUnit',false)"
              :readonly="!hasEditPermission('F_DeliveryUnit',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_DeliveryUnitOptions"
              @change="handlerSelectF_DeliveryUnit" :loading="F_DeliveryUnitLoading">
              <el-option v-for="(item, index) in F_DeliveryUnitOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchaseType')">
          <el-form-item :label="$t('采购类型')" prop="F_PurchaseType">
            <el-select v-model="formData['F_PurchaseType']" placeholder="请选择采购类型"
              :disabled="hasDisabledPermission('F_PurchaseType',false)"
              :readonly="!hasEditPermission('F_PurchaseType',undefined)" filterable clearable
              :style="{width: '100%'}" @change="handlerSelectF_PurchaseType">
              <el-option v-for="(item, index) in F_PurchaseTypeOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryDate')">
          <el-form-item :label="$t('到货日期')" prop="F_DeliveryDate">
            <el-date-picker :disabled="hasDisabledPermission('F_DeliveryDate',false)"
              :readonly="!hasEditPermission('F_DeliveryDate',false)" v-model="formData['F_DeliveryDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择到货日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_TotalPurchases')">
          <el-form-item :label="$t('采购总额')" prop="F_TotalPurchases">
            <el-input v-model="formData['F_TotalPurchases']" placeholder="请输入采购总额"
              :disabled="hasDisabledPermission('F_TotalPurchases',false)"
              :readonly="!hasEditPermission('F_TotalPurchases',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PaymentDate')">
          <el-form-item :label="$t(' 付款期限')" prop="F_PaymentDate">
            <el-date-picker :disabled="hasDisabledPermission('F_PaymentDate',false)"
              :readonly="!hasEditPermission('F_PaymentDate',false)" v-model="formData['F_PaymentDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择 付款期限"
              clearable></el-date-picker>
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
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item :label="$t('备注')" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_purchaseorderentry')">
          <avue-form v-loading="preloadLoading119" class="" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option119" v-model="erp_purchaseorderentry"
            v-if="hasFormPermission('erp_purchaseorderentry')" :disabled="disabled">
            <template slot-scope="{row}" slot="F_GoodsName" v-if="reRenderSubform">
              <avue-asso-popup :index="row.$index" :value="row['F_GoodsName']" 
                :conf='getTableConfConfig("F_GoodsName")' :dicData='F_GoodsName118tableChildDicData'
                bindTable="erp_purchaseorderentry" @changeTableAssoData='changeTableAssoData'>
              </avue-asso-popup>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_AuditMark')">
          <el-form-item :label="$t('审核状态')" prop="F_AuditMark">
            <el-input v-model="formData['F_AuditMark']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_AuditMark',true)"
              :readonly="!hasEditPermission('F_AuditMark',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_InvalidMark')">
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
              placeholder="当前用户制单人员" :disabled="hasDisabledPermission('F_CreatorUserId',true)"
              :readonly="!hasEditPermission('F_CreatorUserId',true)" :style="{width: '100%'}">
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorTime')">
          <el-form-item :label="$t('制单时间')" prop="F_CreatorTime">
            <el-date-picker :disabled="hasDisabledPermission('F_CreatorTime',false)"
              :readonly="!hasEditPermission('F_CreatorTime',false)" v-model="formData['F_CreatorTime']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择制单时间"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm"style="margin-top:15px; margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_purchaseorderinfo',
      mainTableName: 'erp_purchaseorder',
      formConfig: {},
      F_GoodsName118tableChildDicData: [],
      formData: {
         'F_PurchaseOrder': '',
        'F_SourceNumber': '',
        'F_PurchaseDate': null,
        'F_PurchasePeople': '',
        'F_DeliveryUnit': '',
        'F_PurchaseType': '',
        'F_DeliveryDate': null,
        'F_TotalPurchases': '',
        'F_PaymentDate': null,
        'F_PaymentMethod': '',
        'F_Description': '',
        'F_AuditMark': 1,
        'F_InvalidMark': "1",
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules:{
        F_PurchaseOrder: [{
          required: true,
          message: '采购单号',
          trigger: 'blur'
        }],
        F_PurchaseDate: [{
          required: true,
          message: '请选择单据日期',
          trigger: 'change'
        }],
        F_PurchasePeople: [{
          required: true,
          message: '请输入采购人员',
          trigger: 'blur'
        }],
        F_DeliveryUnit: [{
          required: true,
          message: '请选择供货单位',
          trigger: 'change'
        }],
        F_PurchaseType: [],
        F_DeliveryDate: [{
          required: true,
          message: '请选择到货日期',
          trigger: 'change'
        }],
        F_TotalPurchases: [
          {
          required: true,
          message: '请输入采购总额',
          trigger: 'blur'
          }
        ],
        F_PaymentDate: [{
          required: true,
          message: '请选择付款期限',
          trigger: 'change'
        }],
        F_PaymentMethod: [{
          required: true,
          message: '请选择付款方式',
          trigger: 'change'
        }],
        F_Description: [],
        F_CreatorTime: [],
      },
      F_DeliveryUnitOptions: [],
      F_DeliveryUnitLoading: false,
      F_PurchaseTypeOptions: [],
      F_PurchaseTypeLoading: false,
      F_PaymentMethodOptions: [],
      option119: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '商品信息',
          prop: 'erp_purchaseorderentry',
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
            column: [{
              label: '商品 id',
              prop: 'F_GoodsId',
              value: '',
              type: 'input',
              width: null,
              hide:true,
              placeholder: '请输入商品 id',
              formslot: false,
            }, {
              label: '商品名称',
              prop: 'F_GoodsName',
              value: '',
              type: 'asso-popup',
              width: null,
              placeholder: '请输入商品名称',
              formslot: true,
            }, {
              label: '商品编号',
              prop: 'F_GoodCode',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入商品编号',
              formslot: false,
            }, {
              label: '规格型号',
              prop: 'F_Specs',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入规格型号',
              formslot: false,
            }, {
              label: ' 单位',
              type: 'select',
              width: null,
              placeholder: '请选择 单位',
              prop: 'F_UnitId',
              value: '',
              props: {
                 label: 'F_FullName',
                value: 'F_Id'
              },
              dicUrl:  baseUrl + '/erp_purchaserequsetinfo2/unit',
              formslot: false,
            }, {
              label: '总数量',
              prop: 'F_Quantity',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '订单数量',
              formslot: false,
            }, {
              label: '已入库数量',
              prop: 'F_ReceiptQua',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '已入库数量',
              formslot: false,
            }, {
              label: '未入库数量',
              prop: 'F_NoReceiptQua',
              value: 0,
              type: 'number',
              width: null,
              placeholder: '未入库数量',
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
              label: '金额',
              prop: 'F_Amount',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入金额',
              formslot: false,
            }, {
              label: '说明信息',
              prop: 'F_Des',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入说明信息',
              formslot: false,
            }, ]
          }
        }, ],
      },
      erp_purchaseorderentry: {},
      preloadLoading119: false,
    }
  },
  computed: {},
    watch: {
    //计算功能
    erp_purchaseorderentry:{
      handler(){
        this.erp_purchaseorderentry.erp_purchaseorderentry.map(item =>{
          item.F_Amount = item.F_Quantity * item.F_UnitPrice;
          //未入库数量=此次订单数量-已入库数量
          item.F_NoReceiptQua=item.F_Quantity-item.F_ReceiptQua;
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
                  
            this.formData = res.data.data.erp_purchaseorder
            
          this.erp_purchaseorderentry.erp_purchaseorderentry = res.data.data.erp_purchaseorderentry
          
        this.erp_purchaseorderentry.erp_purchaseorderentry.forEach(element => {
      });
      
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_PurchaseOrderOptions == "function") {
      await this.getF_PurchaseOrderOptions();
    }
    if (typeof this.getF_DeliveryUnitOptions == "function") {
      await this.getF_DeliveryUnitOptions();
    }
    if (typeof this.getF_PurchaseTypeOptions == "function") {
      await this.getF_PurchaseTypeOptions();
    }
    if (typeof this.getF_PaymentMethodOptions == "function") {
      await this.getF_PaymentMethodOptions();
    }
    try {
      await this.setTableDicData();
      this.reRenderSubform = true;
    }
    catch (error) {}
    this.showForm = true;
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        erp_purchaseorderentryEntityList: this.erp_purchaseorderentry.erp_purchaseorderentry,
      };
    },
    validateForm() {
      this.$refs['elForm'].validate(valid => {});
    },
    submitForm() {
       var isPrompt = false;
        var isNull=false;
        var isQuaNull=false;
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        if (this.erp_purchaseorderentry.erp_purchaseorderentry && this.erp_purchaseorderentry
          .erp_purchaseorderentry.length > 0) {
          this.erp_purchaseorderentry.erp_purchaseorderentry.forEach((element, index) => {
            let itemChild = {
              ...element
            }
            delete itemChild._index
            for (let [key, value] of Object.entries(itemChild)) {
              if (key.includes('$')) {
                delete itemChild[key];
              }
            }
            this.erp_purchaseorderentry.erp_purchaseorderentry[index] = itemChild;
          });
        }
        else {
          this.erp_purchaseorderentry.erp_purchaseorderentry = [];
        }
         for(var j=0;j<this.erp_purchaseorderentry.erp_purchaseorderentry.length;j++)
        {
          for(var i=j+1;i<this.erp_purchaseorderentry.erp_purchaseorderentry.length;i++)
          {
            if(this.erp_purchaseorderentry.erp_purchaseorderentry[i]["F_GoodsId"]==this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_GoodsId"])
            {
              isPrompt=true;
            }
          }
          if(this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_Quantity"]<0||this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_Quantity"]==0)
          {
            isQuaNull=true;
          }
          console.log(this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_GoodsId"]);
           console.log(this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_Quantity"]);
          if(this.erp_purchaseorderentry.erp_purchaseorderentry[j]["F_GoodsId"]=="")
          {
            isNull=true;
          }
        }
        if(isPrompt)
        {
           this.$confirm("请勿选择重复商品","提示");
           return;
        }
        if(isQuaNull)
        {
          this.$confirm("请核实采购数量为0的商品","提示");
           return;
        }
         if(isNull)
        {
          this.$confirm("请检查采购商品的信息是否为空","提示");
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
            this.$confirm("已入库和部分入库的订单数量不能修改","提示");
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
          
    async getF_PurchaseOrderOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/PurchaseOrder/gen',
        });
        if (resp.data.data) {
          this.formData.F_PurchaseOrder = resp.data.data;
        }
      }
      catch (error) {}
    },
    async getF_DeliveryUnitOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_DeliveryUnitOptionsLoading = true;
      }
      try {
        let params = {};
        params.sql = `	select i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1`;
        let resp = await
        this.$axios({
          method: 'get',
          params: params,
          url:  baseUrl + '/database-links/localDB/datas'
        });
        this.F_DeliveryUnitOptionsLoading = false;
        this.F_DeliveryUnitOptions = resp.data.data;
      }
      catch (error) {}
    },
    handlerSelectF_DeliveryUnit(val) {
      let autoBindFields = [];
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_DeliveryUnitOptions.filter(item => {
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
    async getF_PurchaseTypeOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/Purchase-category/detail',
        });
        if (resp.data.data) {
          this.F_PurchaseTypeOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_PurchaseType(val) {
      let autoBindFields = [];
      let fields = this.formConfig.fields
      let saveField = 'dataItem' == 'dataItem' ? 'F_ItemValue' : 'undefined'
      //得对应数据列
      let data = this.F_PurchaseTypeOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
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
    changeTableAssoData(val) {
      console.log(val);
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
          "__vModel__": "F_PurchaseOrder",
          "__config__": {
            "label": "采购单号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "required": true,
            "span": 8,
            "autoCodeRule": "DocunNumber",
            "prestrainField": "",
            "formId": 104,
            "bindTableField": "F_PurchaseOrder",
            "bindTableFieldType": "varchar",
            "bindTable": "erp_purchaseorder"
          }
        }, {
          "__vModel__": "F_SourceNumber",
          "__config__": {
            "label": " 采购申请单号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "prestrainField": "",
            "formId": 111,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_SourceNumber",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_PurchaseDate",
          "__config__": {
            "label": "单据日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "prestrainField": "",
            "formId": 107,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_PurchaseDate",
            "bindTableFieldType": "datetime"
          }
        }, {
          "__vModel__": "F_PurchasePeople",
          "__config__": {
            "label": "采购人员",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "prestrainField": "",
            "formId": 106,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_PurchasePeople",
            "bindTableFieldType": "varchar"
          }
        }, {
          "__vModel__": "F_DeliveryUnit",
          "__config__": {
            "label": "供货单位",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "required": true,
            "dataType": "dataSql",
            "autoBindFields": "",
            "prestrainField": "",
            "formId": 112,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_DeliveryUnit",
            "bindTableFieldType": "varchar",
            "database": "localDB",
            "sql": "\tselect i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "__vModel__": "F_PurchaseType",
          "__config__": {
            "label": "采购类型",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "required": false,
            "dataType": "dataItem",
            "autoBindFields": "",
            "prestrainField": "",
            "formId": 101,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_PurchaseType",
            "bindTableFieldType": "varchar",
            "dataItem": "Purchase-category"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_DeliveryDate",
          "__config__": {
            "label": "到货日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "prestrainField": "",
            "formId": 113,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_DeliveryDate",
            "bindTableFieldType": "datetime"
          }
        }, {
          "__vModel__": "F_TotalPurchases",
          "__config__": {
            "label": "采购总额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": false,
            "span": 8,
            "prestrainField": "",
            "formId": 114,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_TotalPurchases",
            "bindTableFieldType": "decimal"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_PaymentDate",
          "__config__": {
            "label": " 付款期限",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "prestrainField": "",
            "formId": 103,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_PaymentDate",
            "bindTableFieldType": "datetime"
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
            "prestrainField": "",
            "formId": 102,
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_PaymentMethod",
            "bindTableFieldType": "varchar",
            "dataType": "dataItem",
            "dataItem": "Client_PaymentMode"
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "商品信息",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 119,
            "children": [{
              "__vModel__": "F_GoodsId",
              "__config__": {
                "label": "商品 id",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 8,
                "prestrainField": "",
                "formId": 117,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_GoodsId",
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
                "autoBindFields": "[{\"id\":0,\"bindField\":\"F_Id\",\"component\":127,\"field\":\"F_Des\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"F_InUnit\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":121,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Quantity\",\"component\":125,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_ReceiptQua\",\"component\":123,\"field\":\"field123c5f0\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_NoReceiptQua\",\"component\":133,\"field\":\"F_NoReceiptQua\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_Amount\",\"component\":126,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"F_Specs\",\"component\":122,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_InUnit\",\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":8},{\"id\":9,\"bindField\":\"UnitName\",\"component\":null,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":9},{\"id\":10,\"bindField\":\"F_CostPrice\",\"component\":124,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":10}]",
                "formId": 118,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_GoodsName",
                "bindTableFieldType": "varchar",
                "isChild": true,
                "database": "localDB",
                "sql": "select g.F_Id,g.F_FullName,g.F_EnCode,1 as F_Quantity,0 as F_ReceiptQua,1 as F_NoReceiptQua,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from \terp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id",
                "showField": "F_FullName",
                "saveField": "F_FullName"
              }
            }, {
              "__vModel__": "F_GoodCode",
              "__config__": {
                "label": "商品编号",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 8,
                "prestrainField": "",
                "formId": 121,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_GoodCode",
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
                "span": 8,
                "prestrainField": "",
                "formId": 122,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_Specs",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_UnitId",
              "__config__": {
                "label": " 单位",
                "showLabel": true,
                "tag": "el-select",
                "avueType": "select",
                "span": 8,
                "required": true,
                "prestrainField": "",
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_UnitId",
                "bindTableFieldType": "varchar",
                "isChild": true,
                "dataType": "dataItem",
                "dataItem": "入库单位"
              }
            }, {
              "__vModel__": "F_Quantity",
              "__config__": {
                "label": "总数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 8,
                "required": true,
                "prestrainField": "",
                "formId": 125,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_Quantity",
                "bindTableFieldType": "int",
                "isChild": true
              }
            }, {
              "__vModel__": "F_ReceiptQua",
              "__config__": {
                "label": "已入库数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 123,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_ReceiptQua",
                "bindTableFieldType": "int",
                "isChild": true
              }
            }, {
              "__vModel__": "F_NoReceiptQua",
              "__config__": {
                "label": "未入库数量",
                "showLabel": true,
                "tag": "el-input-number",
                "avueType": "number",
                "span": 24,
                "required": true,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 133,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_NoReceiptQua",
                "bindTableFieldType": "int",
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
                "span": 8,
                "prestrainField": "",
                "formId": 124,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_UnitPrice",
                "bindTableFieldType": "varchar",
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
                "span": 8,
                "prestrainField": "",
                "formId": 126,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_Amount",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Des",
              "__config__": {
                "label": "说明信息",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 8,
                "prestrainField": "",
                "formId": 127,
                "bindTable": "erp_purchaseorderentry",
                "bindTableField": "F_Des",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }],
            "bindTable": "erp_purchaseorderentry"
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "备注",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "required": false,
            "span": 24,
            "prestrainField": "",
            "formId": 128,
            "bindTable": "erp_purchaseorder",
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
            "prestrainField": "",
            "formId": 131,
            "bindTable": "erp_purchaseorder",
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
            "defaultValue": "1",
            "required": true,
            "span": 12,
            "prestrainField": "",
            "formId": 132,
            "bindTable": "erp_purchaseorder",
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
            "prestrainField": "",
            "formId": 129,
            "placeholder": "当前用户",
            "bindTable": "erp_purchaseorder",
            "bindTableField": "F_CreatorUserId",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_CreatorTime",
          "__config__": {
            "label": "制单时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 12,
            "required": false,
            "prestrainField": "",
            "formId": 130,
            "bindTable": "erp_purchaseorder",
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
            "autoBindFields": "[{\"id\":0,\"bindField\":\"F_GoodsId\",\"component\":117,\"field\":\"F_GoodsId\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":121,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Quantity\",\"component\":125,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_ReceiptQua\",\"component\":123,\"field\":\"field123c5f0\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_NoReceiptQua\",\"component\":133,\"field\":\"F_NoReceiptQua\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_Amount\",\"component\":126,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"F_Specs\",\"component\":122,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_InUnit\",\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":8},{\"id\":9,\"bindField\":\"UnitName\",\"component\":null,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":9},{\"id\":10,\"bindField\":\"F_CostPrice\",\"component\":124,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":10}]",
            "dataType": "dataSql",
            "dataItem": "",
            "dataSource": "",
            "database": "localDB",
            "sql": "select g.F_Id F_GoodsId,g.F_FullName,g.F_EnCode,1 as F_Quantity,0 as F_ReceiptQua,1 as F_NoReceiptQua,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from \terp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id",
            "showField": "F_FullName",
            "saveField": "F_FullName"
          },
          "placeholder": "请输入商品名称"
        }
      };
      return config[vmodel] ? config[vmodel] : null;
    },
    async setTableDicData() {
      let resp118 = await this.$axios({
        method: 'get',
        url:  baseUrl + '/database-links/localDB/datas',
        params: {
          sql: 'select g.F_Id F_GoodsId,g.F_FullName,g.F_EnCode,1 as F_Quantity,0 as F_ReceiptQua,1 as F_NoReceiptQua,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from 	erp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id'
        }
      });
      if (resp118.data && resp118.data.data && resp118.data.data.length) {
        let newOptions = [];
        resp118.data.data.forEach(item => {
          newOptions.push({
            label: item['F_FullName'],
            value: item['F_FullName'] + "",
            ...item
          });
        });
        this.F_GoodsName118tableChildDicData = newOptions;
        console.log(this.F_GoodsName118tableChildDicData);
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
/deep/ .el-col{
	margin-bottom: 10px;
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
