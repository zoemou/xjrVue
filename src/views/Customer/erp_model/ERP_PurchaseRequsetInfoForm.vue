<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('F_DocunNumber')">
          <el-form-item :label="$t('单据编码')" prop="F_DocunNumber">
            <el-input v-model="formData['F_DocunNumber']" placeholder="单据编码"
              :disabled="hasDisabledPermission('F_DocunNumber',undefined)"
              :readonly="!hasEditPermission('F_DocunNumber',true)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DocumentDate')">
          <el-form-item :label="$t('单据日期')" prop="F_DocumentDate">
            <el-date-picker :disabled="hasDisabledPermission('F_DocumentDate',false)"
              :readonly="!hasEditPermission('F_DocumentDate',false)" v-model="formData['F_DocumentDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择单据日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ChargePeople')">
          <el-form-item :label="$t('经办人')" prop="F_ChargePeople">
            <el-input v-model="formData['F_ChargePeople']" placeholder="请输入经办人"
              :disabled="hasDisabledPermission('F_ChargePeople',false)"
              :readonly="!hasEditPermission('F_ChargePeople',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryUnit')">
          <el-form-item :label="$t('供应商')" prop="F_DeliveryUnit">
            <el-select v-model="formData.F_DeliveryUnit" placeholder="请选择供应商"
              :disabled="hasDisabledPermission('F_DeliveryUnit',false)"
              :readonly="!hasEditPermission('F_DeliveryUnit',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_DeliveryUnitOptions"
              @change="handlerSelectF_DeliveryUnit" :loading="F_DeliveryUnitLoading">
              <el-option v-for="(item, index) in F_DeliveryUnitOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ApplicationPurposes')">
          <el-form-item :label="$t('申请用途')" prop="F_ApplicationPurposes">
            <el-input v-model="formData['F_ApplicationPurposes']" placeholder="请输入申请用途"
              :disabled="hasDisabledPermission('F_ApplicationPurposes',false)"
              :readonly="!hasEditPermission('F_ApplicationPurposes',false)" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryDate')">
          <el-form-item :label="$t('交货日期')" prop="F_DeliveryDate">
            <el-date-picker :disabled="hasDisabledPermission('F_DeliveryDate',false)"
              :readonly="!hasEditPermission('F_DeliveryDate',false)" v-model="formData['F_DeliveryDate']"
              format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择交货日期"
              clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_BudgetAmount')">
          <el-form-item :label="$t('预算金额')" prop="F_BudgetAmount">
            <el-input v-model="formData['F_BudgetAmount']" type="number" placeholder="请输入预算金额"
              :disabled="hasDisabledPermission('F_BudgetAmount',false)"
              :readonly="!hasEditPermission('F_BudgetAmount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ActualAmount')">
          <el-form-item :label="$t('实际金额')" prop="F_ActualAmount">
            <el-input v-model="formData['F_ActualAmount']" type="number" placeholder="请输入实际金额"
              :disabled="hasDisabledPermission('F_ActualAmount',false)"
              :readonly="!hasEditPermission('F_ActualAmount',false)" clearable :style="{width: '100%'}">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_Emergencylevel')">
          <el-form-item :label="$t('紧急程度')" prop="F_Emergencylevel">
            <el-select v-model="formData['F_Emergencylevel']" placeholder="请选择紧急程度"
              :disabled="hasDisabledPermission('F_Emergencylevel',false)"
              :readonly="!hasEditPermission('F_Emergencylevel',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_EmergencylevelOptions" :key="index"
                :label="item.F_ItemName" :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_purchaserequsetentry')">
          <avue-form v-loading="preloadLoading111" class="" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option111" v-model="erp_purchaserequsetentry"
            v-if="hasFormPermission('erp_purchaserequsetentry')" :disabled="disabled">
            <template slot-scope="{row}" slot="F_GoodsName" v-if="reRenderSubform">
              <avue-asso-popup :index="row.$index" :value="row['F_GoodsName']"
                :conf='getTableConfConfig("F_GoodsName")' :dicData='F_GoodsName120tableChildDicData'
                bindTable="erp_purchaserequsetentry" @changeTableAssoData='changeTableAssoData'>
              </avue-asso-popup>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_DocumentStatus')" hidden="hidden">
          <el-form-item :label="$t('审核状态')" prop="F_DocumentStatus">
            <el-input v-model="formData['F_DocumentStatus']" placeholder="请输入审核状态"
              :disabled="hasDisabledPermission('F_DocumentStatus',true)"
              :readonly="!hasEditPermission('F_DocumentStatus',true)" clearable :style="{width: '100%'}">
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
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item :label="$t('备注')" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorUserId')">
          <el-form-item :label="$t('制单人员')" prop="F_CreatorUserId" required>
            <avue-information-body :operationVal="operationVal" infoType='user'
              :whetherToRebindSecondaryEditing='false' v-model="formData['F_CreatorUserId']"
              placeholder="制单人员" :disabled="hasDisabledPermission('F_CreatorUserId',true)"
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
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom:20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit">
			 <el-button @click="resetForm">{{$t('reset')}}</el-button> 
             <el-button type="primary" @click="tableExamine">审核</el-button>
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
      addressUrl:'erp_purchaserequsetinfo',
      mainTableName: 'erp_purchaserequset',
      formConfig: {},
      F_GoodsName120tableChildDicData: [],
      formData: {
        'F_DocunNumber': '',
        'F_DocumentDate': null,
        'F_ChargePeople': '',
        'F_DeliveryUnit': '',
        'F_ApplicationPurposes': '',
        'F_DeliveryDate': null,
        'F_BudgetAmount': '',
        'F_ActualAmount': '',
        'F_Emergencylevel': '',
        'F_DocumentStatus': "1",
        'F_AuditMark': 1,
        'F_InvalidMark': 1,
        'F_Description': '',
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
      },
      rules: {
        F_DocunNumber: [{
          required: true,
          message: '单据编码',
          trigger: 'blur'
        }],
        F_DocumentDate: [{
          required: true,
          message: '请选择单据日期',
          trigger: 'change'
        }],
        F_ChargePeople: [{
          required: true,
          message: '请输入经办人',
          trigger: 'blur'
        }],
        F_DeliveryUnit: [{
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        }],
        F_ApplicationPurposes: [{
          required: true,
          message: '请输入申请用途',
          trigger: 'blur'
        }],
        F_DeliveryDate: [{
          required: true,
          message: '请选择交货日期',
          trigger: 'change'
        }],
        F_BudgetAmount: [{
          required: true,
          message: '请输入预算金额',
          trigger: 'blur'
        }],
        F_ActualAmount: [{
          required: true,
          message: '请输入实际金额',
          trigger: 'blur'
        }],
        F_Emergencylevel: [],
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
      F_DeliveryUnitOptions: [],
      F_DeliveryUnitLoading: false,
      F_EmergencylevelOptions: [],
      option111: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '商品信息',
          prop: 'erp_purchaserequsetentry',
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
              label: '商品id',
              prop: 'F_GoodsId',
              value: '',
              type: 'input',
              width: null,
              hide:true,
              placeholder: '请输入商品id',
              formslot: false,
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
            }, {
              label: '商品名称',
              prop: 'F_GoodsName',
              value: '',
              type: 'asso-popup',
              width: null,
              placeholder: '请输入商品名称',
              formslot: true,
            }, {
              label: '单位',
              prop: 'F_UnitId',
              hide:true,
              value: '',
              type: 'input',
              width: null,
              placeholder: '请选择单位',
              formslot: false,
            }, {
              label: '单位',
              prop: 'F_Unit',
              value: '',
              type: 'input',
              disabled:true,
              width: null,
              placeholder: '请输入单位',
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
              label: '价格',
              prop: 'F_UnitPrice',
              value: '',
              type: 'input',
              width: null,
              placeholder: '请输入价格',
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
      erp_purchaserequsetentry: {},
      preloadLoading111: false,
    }
  },
  computed: {},
  watch: {
    'formData.F_BudgetAmount': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    'formData.F_ActualAmount': function(val, oldVal) {
      this.changeFormConfigDefaultValue();
    },
    erp_purchaserequsetentry:{
      handler(){
        this.erp_purchaserequsetentry.erp_purchaserequsetentry.map(item=>{
          item.F_Amount=item.F_Quantity*item.F_UnitPrice;
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
                  
            this.formData = res.data.data.erp_purchaserequset
            
          this.erp_purchaserequsetentry.erp_purchaserequsetentry = res.data.data.erp_purchaserequsetentry
          
        this.erp_purchaserequsetentry.erp_purchaserequsetentry.forEach(element => {
      });
      
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_DocunNumberOptions == "function") {
      await this.getF_DocunNumberOptions();
    }
    if (typeof this.getF_DeliveryUnitOptions == "function") {
      await this.getF_DeliveryUnitOptions();
    }
    if (typeof this.getF_EmergencylevelOptions == "function") {
      await this.getF_EmergencylevelOptions();
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
        erp_purchaserequsetentryEntityList: this.erp_purchaserequsetentry.erp_purchaserequsetentry,
      };
    },
    validateForm() {
      this.$refs['elForm'].validate(valid => {});
    },
    tableExamine()
    {
      if(this.formData.F_DocumentStatus==2)
      {
          this.$confirm("改采购申请单已审核通过，请勿重复操作");
          return;
      }
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      console.log(this.formData.fid);
      let newObj= {
        ...returnParams,
        id:this.formData.fid,
        erp_purchaserequsetentryEntityList: this.erp_purchaserequsetentry.erp_purchaserequsetentry,
      };
      if(newObj.id==null)
       {
         return;
       }
           request({
            url: baseUrl + "/"+this.addressUrl+ "/"+"examine"+"/"+newObj.id,
            method: "post",
            data : newObj
          }).then((res) => {
            console.log(res.data);
            if(res.data.data!=null)
            {
               this.$notify({
              title: "成功",
              message: "审核成功",
              type: "success",
            });
             this.$emit("onChange",true)
            }
           else
           {
              this.$confirm("审核失败");
           }
          });

    },
    submitForm() {
      var isPrompt = false;
      var isNull=false;
      var isQuaNull=false;
      if(this.erp_purchaserequsetentry.erp_purchaserequsetentry.length==0)
      {
         this.$confirm("采购商品不能为空","提示");
           return;
      }
      for(var j=0;j<this.erp_purchaserequsetentry.erp_purchaserequsetentry.length;j++)
        {
          for(var i=j+1;i<this.erp_purchaserequsetentry.erp_purchaserequsetentry.length;i++)
          {
            if(this.erp_purchaserequsetentry.erp_purchaserequsetentry[i]["F_GoodsId"]==this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_GoodsId"])
            {
              isPrompt=true;
            }
          }
          if(this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_Quantity"]<0||this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_Quantity"]==0)
          {
            isQuaNull=true;
          }
          console.log(this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_GoodsId"]);
           console.log(this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_Quantity"]);
          if(this.erp_purchaserequsetentry.erp_purchaserequsetentry[j]["F_GoodsId"]=="")
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
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        if (this.erp_purchaserequsetentry.erp_purchaserequsetentry && this.erp_purchaserequsetentry
          .erp_purchaserequsetentry.length > 0) {
          this.erp_purchaserequsetentry.erp_purchaserequsetentry.forEach((element, index) => {
            let itemChild = {
              ...element
            }
            delete itemChild._index
            for (let [key, value] of Object.entries(itemChild)) {
              if (key.includes('$')) {
                delete itemChild[key];
              }
            }
            this.erp_purchaserequsetentry.erp_purchaserequsetentry[index] = itemChild;
          });
        }
        else {
          this.erp_purchaserequsetentry.erp_purchaserequsetentry = [];
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
          if(this.formData.F_DocumentStatus==2)
          {
              this.$confirm("改采购申请单已审核通过，不能修改");
              return;
          }
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
    async getF_DocunNumberOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) { //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/code-rules/DocunNumber/gen',
        });
        if (resp.data.data) {
          this.formData.F_DocunNumber = resp.data.data;
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
        params.sql = `select i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1`;
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
    async getF_EmergencylevelOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/Degree/detail',
        });
        if (resp.data.data) {
          this.F_EmergencylevelOptions = resp.data.data;
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
          "__vModel__": "F_DocunNumber",
          "__config__": {
            "label": "单据编码",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "autoCode",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "autoCodeRule": "DocunNumber",
            "prestrainField": "",
            "formId": 102,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_DocunNumber",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_DocumentDate",
          "__config__": {
            "label": "单据日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 103,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_DocumentDate",
            "bindTableFieldType": "datetime"
          }
        }, {
          "__vModel__": "F_ChargePeople",
          "__config__": {
            "label": "经办人",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 100,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_ChargePeople",
            "bindTableFieldType": "varchar"
          }
        }, {
          "__vModel__": "F_DeliveryUnit",
          "__config__": {
            "label": "供应商",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 8,
            "required": true,
            "dataType": "dataSql",
            "autoBindFields": "",
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 104,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_DeliveryUnit",
            "bindTableFieldType": "varchar",
            "database": "localDB",
            "sql": "select i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "__vModel__": "F_ApplicationPurposes",
          "__config__": {
            "label": "申请用途",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 105,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_ApplicationPurposes",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "date",
          "__vModel__": "F_DeliveryDate",
          "__config__": {
            "label": "交货日期",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "defaultValue": null,
            "showLabel": true,
            "span": 8,
            "required": true,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 106,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_DeliveryDate",
            "bindTableFieldType": "datetime"
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_BudgetAmount",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "预算金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 108,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_BudgetAmount",
            "bindTableFieldType": "varchar"
          }
        }, {
          "tempType": "number",
          "__vModel__": "F_ActualAmount",
          "computationalConfiguration": [],
          "prepend": "¥",
          "__config__": {
            "label": "实际金额",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "required": true,
            "span": 8,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 109,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_ActualAmount",
            "bindTableFieldType": "varchar"
          }
        }, {
          "__vModel__": "F_Emergencylevel",
          "__config__": {
            "label": "紧急程度",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "required": false,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 110,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_Emergencylevel",
            "bindTableFieldType": "varchar",
            "dataType": "dataItem",
            "dataItem": "Degree"
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "商品信息",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 111,
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
                "formId": 113,
                "bindTable": "erp_purchaserequsetentry",
                "isChild": true,
                "bindTableField": "F_GoodsId",
                "bindTableFieldType": "varchar"
              }
            }, {
              "__vModel__": "F_GoodCode",
              "__config__": {
                "label": "商品编码",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 112,
                "bindTable": "erp_purchaserequsetentry",
                "isChild": true,
                "bindTableField": "F_GoodCode",
                "bindTableFieldType": "varchar"
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
                "formId": 114,
                "bindTable": "erp_purchaserequsetentry",
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
                "autoBindFields": "[{\"id\":0,\"bindField\":\"GoodsId\",\"component\":113,\"field\":\"F_GoodsId\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":112,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Quantity\",\"component\":116,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_Amount\",\"component\":118,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_Specs\",\"component\":114,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_InUnit\",\"component\":115,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"UnitName\",\"component\":121,\"field\":\"F_Unit\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_CostPrice\",\"component\":117,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":8}]",
                "formId": 120,
                "bindTable": "erp_purchaserequsetentry",
                "bindTableField": "F_GoodsName",
                "bindTableFieldType": "varchar",
                "isChild": true,
                "database": "localDB",
                "sql": "select g.F_Id GoodsId,g.F_FullName,g.F_EnCode,1 as F_Quantity,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from \terp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id",
                "showField": "F_FullName",
                "saveField": "F_FullName"
              }
            }, {
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
                "formId": 115,
                "bindTable": "erp_purchaserequsetentry",
                "bindTableField": "F_UnitId",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }, {
              "__vModel__": "F_Unit",
              "__config__": {
                "label": "单位",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 121,
                "bindTable": "erp_purchaserequsetentry",
                "bindTableField": "F_Unit",
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
                "formId": 116,
                "bindTable": "erp_purchaserequsetentry",
                "bindTableField": "F_Quantity",
                "bindTableFieldType": "int",
                "isChild": true
              }
            }, {
              "tempType": "number",
              "__vModel__": "F_UnitPrice",
              "computationalConfiguration": [],
              "prepend": "¥",
              "__config__": {
                "label": "价格",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "required": true,
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 117,
                "bindTable": "erp_purchaserequsetentry",
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
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 118,
                "bindTable": "erp_purchaserequsetentry",
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
                "span": 24,
                "F_LgMarkCode": "",
                "prestrainField": "",
                "formId": 119,
                "bindTable": "erp_purchaserequsetentry",
                "bindTableField": "F_Des",
                "bindTableFieldType": "varchar",
                "isChild": true
              }
            }],
            "bindTable": "erp_purchaserequsetentry"
          }
        }, {
          "__vModel__": "F_DocumentStatus",
          "__config__": {
            "label": "审核状态",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 131
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
            "formId": 127,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_InvalidMark",
            "bindTableFieldType": "int"
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
            "formId": 122,
            "bindTable": "erp_purchaserequset",
            "bindTableField": "F_Description",
            "bindTableFieldType": "varchar"
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
            "formId": 123,
            "bindTableField": "F_CreatorUserId",
            "bindTableFieldType": "varchar",
            "bindTable": "erp_purchaserequset",
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
            "required": false,
            "F_LgMarkCode": "",
            "prestrainField": "",
            "formId": 125,
            "bindTable": "erp_purchaserequset",
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
            "autoBindFields": "[{\"id\":0,\"bindField\":\"GoodsId\",\"component\":113,\"field\":\"F_GoodsId\",\"isShow\":true,\"width\":150,\"$index\":0},{\"id\":1,\"bindField\":\"F_FullName\",\"component\":null,\"field\":\"\",\"isShow\":true,\"width\":150,\"$index\":1},{\"id\":2,\"bindField\":\"F_EnCode\",\"component\":112,\"field\":\"F_GoodCode\",\"isShow\":true,\"width\":150,\"$index\":2},{\"id\":3,\"bindField\":\"F_Quantity\",\"component\":116,\"field\":\"F_Quantity\",\"isShow\":true,\"width\":150,\"$index\":3},{\"id\":4,\"bindField\":\"F_Amount\",\"component\":118,\"field\":\"F_Amount\",\"isShow\":true,\"width\":150,\"$index\":4},{\"id\":5,\"bindField\":\"F_Specs\",\"component\":114,\"field\":\"F_Specs\",\"isShow\":true,\"width\":150,\"$index\":5},{\"id\":6,\"bindField\":\"F_InUnit\",\"component\":115,\"field\":\"F_UnitId\",\"isShow\":true,\"width\":150,\"$index\":6},{\"id\":7,\"bindField\":\"UnitName\",\"component\":121,\"field\":\"F_Unit\",\"isShow\":true,\"width\":150,\"$index\":7},{\"id\":8,\"bindField\":\"F_CostPrice\",\"component\":117,\"field\":\"F_UnitPrice\",\"isShow\":true,\"width\":150,\"$index\":8}]",
            "dataType": "dataSql",
            "dataItem": "",
            "dataSource": "",
            "database": "localDB",
            "sql": "select g.F_Id GoodsId,g.F_FullName,g.F_EnCode,1 as F_Quantity,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from \terp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id",
            "showField": "F_FullName",
            "saveField": "F_FullName"
          },
          "placeholder": "请输入商品名称"
        }
      };
      return config[vmodel] ? config[vmodel] : null;
    },
    async setTableDicData() {
      let resp120 = await this.$axios({
        method: 'get',
        url:  baseUrl + '/database-links/localDB/datas',
        params: {
          sql: 'select g.F_Id GoodsId,g.F_FullName,g.F_EnCode,1 as F_Quantity,g.F_SalePrice as F_Amount,g.F_Specs,g.F_InUnit,c.F_FullName as UnitName,g.F_CostPrice from 	erp_goods g left join erp_unitconvert c on g.F_InUnit=c.F_Id'
        }
      });
      if (resp120.data && resp120.data.data && resp120.data.data.length) {
        let newOptions = [];
        resp120.data.data.forEach(item => {
          newOptions.push({
            label: item['F_FullName'],
            value: item['F_FullName'] + "",
            ...item
          });
        });
        this.F_GoodsName120tableChildDicData = newOptions;
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
