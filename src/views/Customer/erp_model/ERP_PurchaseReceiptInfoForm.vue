<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="8" v-if="hasFormPermission('F_ReceiptNumber')">
          <el-form-item label="入库单号" prop="F_ReceiptNumber">
            <el-input
              v-model="formData['F_ReceiptNumber']"
              placeholder="入库单号"
              :disabled="hasDisabledPermission('F_ReceiptNumber', undefined)"
              :readonly="!hasEditPermission('F_ReceiptNumber', true)"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_ReceiptDate')">
          <el-form-item label="入库日期" prop="F_ReceiptDate">
            <el-date-picker
              :disabled="hasDisabledPermission('F_ReceiptDate', false)"
              :readonly="!hasEditPermission('F_ReceiptDate', false)"
              v-model="formData['F_ReceiptDate']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              placeholder="请选择入库日期"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          v-if="hasFormPermission('F_PurchasePeople')"  hidden="hidden"
        >
          <el-form-item label="采购订单id" prop="F_PurOrderId">
            <el-input
              v-model="formData.F_PurOrderId"
              placeholder="根据采购订单id来修改采购订单里的状态和采购订单详情表里的数量"
              :readonly="true"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurOrderNumber')">
          <el-form-item label="采购单号" prop="F_PurOrderNumber">
            <el-select
              v-model="formData.F_PurOrderNumber"
              placeholder="请选择采购单号"
              :disabled="hasDisabledPermission('F_PurOrderNumber', false)"
              :readonly="!hasEditPermission('F_PurOrderNumber', undefined)"
              filterable
              clearable
              :style="{ width: '100%' }"
              remote
              :remote-method="getF_PurOrderNumberOptions"
              @change="handlerSelectF_PurOrderNumber"
              :loading="F_PurOrderNumberLoading"
            >
              <el-option
                v-for="(item, index) in F_PurOrderNumberOptions"
                :key="index"
                :label="item.F_PurchaseOrder"
                :value="{value:item.F_Id,label:item.F_PurchaseOrder}"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DeliveryUnit')">
          <el-form-item label="供货单位" prop="F_DeliveryUnit">
            <el-select
              v-model="formData.F_DeliveryUnit"
              placeholder="请输入供货单位"
              :style="{ width: '100%' }"
              remote
            >
              <el-option
                v-for="(item, index) in F_DeliveryUnitOptions"
                :key="index"
                :label="item.F_FullName"
                :value="item.F_Id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_DefaultWarehouse')">
          <el-form-item label="入库仓库" prop="F_DefaultWarehouse">
            <el-select
              v-model="formData.F_DefaultWarehouse"
              placeholder="请选择入库仓库"
              :disabled="hasDisabledPermission('F_DefaultWarehouse', false)"
              :readonly="!hasEditPermission('F_DefaultWarehouse', undefined)"
              filterable
              clearable
              :style="{ width: '100%' }"
              remote
              :remote-method="getF_DefaultWarehouseOptions"
              @change="handlerSelectF_DefaultWarehouse"
              :loading="F_DefaultWarehouseLoading"
            >
              <el-option
                v-for="(item, index) in F_DefaultWarehouseOptions"
                :key="index"
                :label="item.F_FullName"
                :value="item.F_Id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_PurchasePeople')">
          <el-form-item label="入库人员" prop="F_PurchasePeople">
            <el-input
              v-model="formData['F_PurchasePeople']"
              placeholder="请输入入库人员"
              :disabled="hasDisabledPermission('F_PurchasePeople', false)"
              :readonly="!hasEditPermission('F_PurchasePeople', false)"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <avue-form
            v-loading="preloadLoading113"
            element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option113"
            v-model="erp_purchasereceiptentry"
            :disabled="disabled"
          >
            <template slot-scope="{ row }" slot="input">
              <el-tag>{{ row }}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="备注" prop="F_Description">
            <el-input
              v-model="formData['F_Description']"
              type="textarea"
              placeholder="请输入备注"
              :disabled="hasDisabledPermission('F_Description', false)"
              :readonly="!hasEditPermission('F_Description', false)"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorUserId')">
          <el-form-item label="制单人员" prop="F_CreatorUserId">
            <avue-information-body
              :operationVal="operationVal"
              infoType="user"
              :whetherToRebindSecondaryEditing="false"
              v-model="formData['F_CreatorUserId']"
              placeholder="当前用户制单人员"
              :disabled="hasDisabledPermission('F_CreatorUserId', true)"
              :readonly="!hasEditPermission('F_CreatorUserId', true)"
              :style="{ width: '100%' }"
            >
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_CreatorTime')">
          <el-form-item label="制单时间" prop="F_CreatorTime">
            <el-date-picker
              :disabled="hasDisabledPermission('F_CreatorTime', false)"
              :readonly="!hasEditPermission('F_CreatorTime', false)"
              v-model="formData['F_CreatorTime']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              placeholder="请选择制单时间"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm">
          <el-form-item size="mini" v-if="isEdit" style="margin-top:15px;margin-bottom:20px; text-align: center;">
			<el-button @click="resetForm">重置</el-button>  
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
        <avue-filterable-data-list
          :conf="autoCompleteConf"
          v-if="autoCompleteDialogVisible"
          v-on:onHandler="filterableCallBack"
        ></avue-filterable-data-list>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import FilterableDataList from "@/components/generator/clientComponents/FilterableDataList.vue";
import workflowFormAuthorize from "@/mixins/workflowFormAuthorize";
import authorizeMixin from "@/mixins/authorize";
import { baseUrl } from "@/config/env";
import request from "@/router/axios";
export default {
  mixins: [authorizeMixin, workflowFormAuthorize],

  components: {},
  props: ["keyValue", "isEdit", "disabled"],
  data() {
    let _this = this;
    return {
      showForm: true,
      operationVal: "add",
      isAdd: true,
      addressUrl: "erp_purchasereceiptinfo",
      mainTableName: "erp_purchasereceipt",
      formConfig: {
        fields: [
          {
            __vModel__: "F_ReceiptNumber",
            __config__: {
              label: "入库单号",
              showLabel: true,
              tag: "el-input",
              avueType: "autoCode",
              span: 8,
              autoCodeRule: "ReceiptNumber",
              formId: 102,
            },
          },
          {
            tempType: "date",
            __vModel__: "F_ReceiptDate",
            __config__: {
              label: "入库日期",
              tag: "el-date-picker",
              avueType: "datetime",
              showLabel: true,
              span: 8,
              formId: 103,
            },
          },
          {
            __vModel__: "F_PurchasePeople",
            __config__: {
              label: "入库人员",
              showLabel: true,
              tag: "el-input",
              avueType: "input",
              span: 8,
              formId: 101,
            },
          },
          {
            __vModel__: "F_PurOrderId",
            __config__: {
              label: "采购订单Id",
              showLabel: true,
              tag: "el-input",
              avueType: "input",
              span: 8,
              formId: 101,
            },
          },
          {
            __vModel__: "F_PurOrderNumber",
            __config__: {
              label: "采购单号",
              showLabel: true,
              tag: "el-select",
              avueType: "asso-select",
              filterable: true,
              span: 8,
              dataType: "dataSql",
              autoBindFields: '{"125":"F_DeliveryUnit"}',
              formId: 104,
              database: "localDB",
              sql: "\tselect p.F_Id,p.F_PurchaseOrder,F_DeliveryUnit from erp_purchaseorder p",
              showField: "F_PurchaseOrder",
              saveField: "F_Id",
            },
          },
          {
            __vModel__: "F_DeliveryUnit",
            __config__: {
              label: "供货单位",
              showLabel: true,
              tag: "el-input",
              avueType: "input",
              span: 8,
              formId: 125,
            },
          },
          {
            __vModel__: "F_DefaultWarehouse",
            __config__: {
              label: "默认仓库",
              showLabel: true,
              tag: "el-select",
              avueType: "asso-select",
              filterable: true,
              span: 8,
              dataType: "dataSql",
              autoBindFields: "",
              formId: 127,
              database: "localDB",
              sql: "SELECT W.F_Id,W.F_FullName FROM erp_warehouse W",
              showField: "F_FullName",
              saveField: "F_Id",
            },
          },
          {
            tempType: "default",
            __config__: {
              componentName: "table",
              componentTitle: "",
              layoutTree: true,
              dataType: "dataSql",
              span: 24,
              formId: 113,
              children: [
                 {
                  __vModel__: "F_OrderEntrtyId",
                  __config__: {
                    label: "Id",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_OrderEntrtyId",
                  },
                },
                {
                  __vModel__: "F_GoodsId",
                  __config__: {
                    label: "商品Id",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_GoodsId",
                  },
                },
                {
                  __vModel__: "F_GoodsName",
                  __config__: {
                    label: "商品名称",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_GoodsName",
                  },
                },
                {
                  __vModel__: "F_GoodCode",
                  __config__: {
                    label: "商品编号",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_GoodCode",
                  },
                },
                {
                  __vModel__: "F_Specs",
                  __config__: {
                    label: "规格型号",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_Specs",
                  },
                },
                {
                  __vModel__: "F_Unit",
                  __config__: {
                    label: "单位",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_Unit",
                  },
                },
                {
                  __vModel__: "F_UnitId",
                  __config__: {
                    label: "单位id",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_UnitId",
                  },
                },
                {
                  tempType: "number",
                  __vModel__: "F_UnitPrice",
                  computationalConfiguration: [],
                  prepend: "¥",
                  __config__: {
                    label: "价格",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_UnitPrice",
                  },
                },
                {
                  tempType: "number",
                  __vModel__: "F_Amount",
                  computationalConfiguration: [],
                  prepend: "¥",
                  __config__: {
                    label: "金额",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_Amount",
                  },
                },
                {
                  __vModel__: "F_Quantity",
                  __config__: {
                    label: "总数量",
                    showLabel: true,
                    tag: "el-input-number",
                    avueType: "number",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_Quantity",
                  },
                },
                {
                  __vModel__: "F_ReceiptQua",
                  __config__: {
                    label: "已入库数量",
                    showLabel: true,
                    tag: "el-input-number",
                    avueType: "number",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_ReceiptQua",
                  },
                },
                {
                  __vModel__: "F_NoReceiptQua",
                  __config__: {
                    label: "未入库数量",
                    showLabel: true,
                    tag: "el-input-number",
                    avueType: "number",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_NoReceiptQua",
                  },
                },
                {
                  __vModel__: "F_ReceiptQuantity",
                  __config__: {
                    label: "本次入库数量",
                    showLabel: true,
                    tag: "el-input-number",
                    avueType: "number",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_ReceiptQuantity",
                  },
                },

                {
                  __vModel__: "F_Des",
                  __config__: {
                    label: "说明",
                    showLabel: true,
                    tag: "el-input",
                    avueType: "input",
                    span: 8,
                    bindTable: "erp_purchasereceiptentry",
                    bindTableField: "F_Des",
                  },
                },
              ],
              sql: "\tselect g.F_Id,g.F_FullName,g.F_EnCode,g.F_Specs,g.F_ComUnit,g.F_SalePrice,g.F_CostPrice from \terp_goods g",
              database: "localDB",
            },
          },
          {
            tempType: "textarea",
            __vModel__: "F_Description",
            __config__: {
              label: "备注",
              showLabel: true,
              tag: "el-input",
              avueType: "textarea",
              span: 24,
              formId: 121,
            },
          },
          {
            __vModel__: "F_CreatorUserId",
            __type__: "info",
            infoType: "user",
            __organize__: true,
            __config__: {
              label: "制单人员",
              showLabel: true,
              tag: "avue-information-body",
              span: 12,
              whetherToRebindSecondaryEditing: false,
              formId: 122,
              placeholder: "当前用户",
            },
          },
          {
            tempType: "date",
            __vModel__: "F_CreatorTime",
            __config__: {
              label: "制单时间",
              tag: "el-date-picker",
              avueType: "datetime",
              showLabel: true,
              span: 12,
              formId: 124,
            },
          },
        ],
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        F_ReceiptNumber: "",
        F_ReceiptDate: null,
        F_PurchasePeople: "",
        F_PurOrderId: "",
        F_PurOrderNumber: "",
        F_DeliveryUnit: "",
        F_DefaultWarehouse: "",
        F_Description: "",
        F_CreatorUserId: "",
        F_CreatorTime: null,
      },
      rules: {
        F_ReceiptNumber: [
          {
            required: true,
            message: "入库单号",
            trigger: "blur",
          },
        ],
        F_ReceiptDate: [
          {
            required: true,
            message: "请选择入库日期",
            trigger: "change",
          },
        ],
        F_PurchasePeople: [
          {
            required: true,
            message: "请输入入库人员",
            trigger: "blur",
          },
        ],
        F_PurOrderNumber: [
          {
            required: true,
            message: "请选择采购单号",
            trigger: "change",
          },
        ],
        F_DeliveryUnit: [
          {
            required: true,
            message: "请输入供货单位",
            trigger: "blur",
          },
        ],
        F_DefaultWarehouse: [
          {
            required: true,
            message: "请选择默认仓库",
            trigger: "change",
          },
        ],
        F_Description: [],
        F_CreatorTime: [],
      },
      F_PurOrderNumberOptions: [],
      F_PurOrderNumberLoading: false,
      F_DefaultWarehouseOptions: [],
      F_DeliveryUnitOptions: [],
      F_DefaultWarehouseLoading: false,
      erp_purchasereceiptentry: {},
      ismodifystatus:true,
      preloadLoading113: false,
    };
  },
  computed: {
    option113() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [
          {
            label: "",
            prop: "erp_purchasereceiptentry",
            type: "dynamic",
            span: 24,
           
            children: {
              align: "center",
              headerAlign: "center",
              columnBtn:false,
              refreshBtn:false,
              addBtn:false,
              delBtn:false,
              editBtn:false,
              rowAdd: (done) => {
                // this.$message.success('新增回调');
                done({});
              },
              rowDel: (row, done) => {
                // this.$message.success('删除回调'+JSON.stringify(row));
                done();
              },
              column: this.getAuthorityTableChildrenList('erp_purchasereceiptentry',[
                {
                  label: "F_OrderEntrtyId",
                  prop: "F_OrderEntrtyId",
                  type: "input",
                  hide:true,
                },
                {
                  label: "商品Id",
                  prop: "F_GoodsId",
                  type: "input",
                  hide:true,
                },
                {
                  label: "商品名称",
                  prop: "F_GoodsName",
                  type: "input",
                },
                {
                  label: "商品编号",
                  prop: "F_GoodCode",
                  type: "input",
                },
                {
                  label: "规格型号",
                  prop: "F_Specs",
                  type: "input",
                },
                {
                  label: "单位",
                  prop: "F_UnitId",
                  disabled: true,
                  type: "select",
                  props: {
                    label: "F_FullName",
                    value: "F_Id",
                  },
                  dicUrl: baseUrl + "/erp_purchaserequsetinfo2/unit",
                },
                {
                  label: "价格",
                  prop: "F_UnitPrice",
                  type: "input",
                },
                {
                  label: "金额",
                  prop: "F_Amount",
                  type: "input",
                },
                {
                  label: "总数量",
                  prop: "F_Quantity",
                  disabled: true,
                  type: "number",
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
                  label: "本次入库数量",
                  prop: "F_ReceiptQuantity",
                  type: "number",
                },
                {
                  label: "说明",
                  prop: "F_Des",
                  type: "input",
                },
              ],)
            },
          },
        ],
      }
    }
  },
  watch: {},
  created() {},
  async mounted() {
    //TODO   再这里做数据回填 请求表单数据

    if (this.keyValue) {
      this.isAdd = false;
    }
    if (!this.isAdd && this.keyValue) {
      this.operationVal = "edit";
      this.showForm = false;
      try {
        let res = await request({
          url: baseUrl + "/" + this.addressUrl + "/" + this.keyValue,
          method: "get",
        });

        this.formData = res.data.data.erp_purchasereceipt;

        this.erp_purchasereceiptentry.erp_purchasereceiptentry =
          res.data.data.erp_purchasereceiptentry;

        this.erp_purchasereceiptentry.erp_purchasereceiptentry.forEach(
          (element) => {}
        );

        this.showForm = true;
      } catch (error) {}
    }

    if (typeof this.getF_ReceiptNumberOptions == "function") {
      await this.getF_ReceiptNumberOptions();
    }
    if (typeof this.getF_PurOrderNumberOptions == "function") {
      await this.getF_PurOrderNumberOptions();
    }
    if (typeof this.getF_DefaultWarehouseOptions == "function") {
      await this.getF_DefaultWarehouseOptions();
    }
    if (typeof this.getF_DeliveryUnitOptions == "function") {
      await this.getF_DeliveryUnitOptions();
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
      let key = this.mainTableName + "Entity";
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        erp_purchasereceiptentryEntityList:this.erp_purchasereceiptentry.erp_purchasereceiptentry,
        f_purOrderid:this.formData.F_PurOrderId,
        isModifyStatus:this.ismodifystatus
      };
    },
    sava()
    {
        this.$refs["elForm"].validate((valid) => {
        if (!valid) return
        this.erp_purchasereceiptentry.erp_purchasereceiptentry.forEach(element => {});
        //格式化数据
        let newObj = this.getFormData();
        //如果没有传入参数就是新增
        if (!this.keyValue) {
          request({
            url: baseUrl + "/" + this.addressUrl,
            method: "post",
            data: newObj,
          }).then((res) => {
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
            });
            this.$emit("onChange", true);
          });
        } else {
          request({
            url: baseUrl + "/" + this.addressUrl + "/" + this.keyValue,
            method: "put",
            data: newObj,
          }).then((res) => {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
            });
            this.$emit("onChange", true);
          });
        }
      });
    },
    submitForm() {
      var _this=this;
      var isPrompt = false;
      var isNull=false;
      var quaList=[];
        //判断是否入库数量有大于总数量的
        for (let index = 0;index < _this.erp_purchasereceiptentry.erp_purchasereceiptentry.length;index++) 
        {
          //如果已入库数量+本次入库数量>总数量   数量不一致，给出提示 是否要操作
          if(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQua"] +_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQuantity"]>_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_Quantity"]) 
          {
            isPrompt = true;
          }
          if(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQua"] +_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQuantity"]<_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_Quantity"]) 
          {
            //如果已入库数量+本次入库数量<总数量 代表此次订单入库可能没有完成需要进行二次入库 不修改订单状态为已入库 全部入完才修改状态为已入库
           this.ismodifystatus=false;
          }
          //当商品入库单位为空或者商品id为空或者入库数量为空给出提示  ||_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_Quantity"]==null
          if(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_Unit"]==null||_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ComUnit"]==null||_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_BasicUnit"]==null||_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_GoodsId"]==null)
          {
            isNull=true;
          }
          if(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQuantity"]==0)
          {
            quaList.push(_this.erp_purchasereceiptentry.erp_purchasereceiptentry[index]["F_ReceiptQuantity"]);
          }

        }
        if(quaList.length==this.erp_purchasereceiptentry.erp_purchasereceiptentry.length)
        {
           this.$confirm("本次入库数量为0,请核实","提示");
           return;
        }
        if (isNull) {
          _this.$confirm("请检查商品单位是否配置完整","提示");
          return;
        }
        if (isPrompt) {
          _this.$confirm(
            "总入库数量大于此次订单总数量，您确定要操作吗？","提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          ).then(() => {
            console.log(111);
             _this.sava();
          });
        }
        else{
         _this.sava()
        }
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    formatTree(data, valueField, lableField, childField, type) {
      let tree = [];
      data.forEach((node, index) => {
        let newNode = {
          value: node[valueField],
          label: node[lableField],
        };
        if (type) {
          newNode.disabled = node[valueField] == undefined ? true : false;
        }
        tree.push(newNode);
        if (node[childField] != null && node[childField].length > 0) {
          newNode.children = this.formatTree(
            node[childField],
            valueField,
            lableField,
            childField,
            type
          );
        }
      }, this);
      return tree;
    },

    //辅助工作流 审批(编辑) 预留方法
    handleEdit() {},

    filterableCallBack(data) {
      if (!this.autoCompleteConf) {
        return false;
      }
      //弹窗关闭前回填数据  如果有选择数据项
      if (data) {
        let fields = this.getElements(this.formConfig.fields);
        let autoBindFields =
          JSON.parse(this.autoCompleteConf.autoBindFields) || {};
        let saveField =
          this.autoCompleteConf.dataType == "dataItem"
            ? "F_ItemValue"
            : this.autoCompleteConf.saveField;
        this.setModelValue(this.formConfig.fields, autoBindFields, data);
        //自己赋值
        if (this.autoCompleteConf.dataType == "dataItem") {
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].__config__.formId == this.autoCompleteConf.formId) {
              this.formData[this.autoCompleteConf.model] = data[saveField];
              break;
            }
          }
        } else {
          this.formData[this.autoCompleteConf.model] = data[saveField];
        }
      }
      //更新表单校验
      this.$refs["elForm"].validate((valid) => {
        console.log("更新表单校验 valid", valid);
      });
      //关闭弹窗
      this.autoCompleteDialogVisible = false;
    },
    setModelValue(fields, autoBindFields, data) {
      fields.map((item) => {
        if (
          item.__config__.componentName &&
          item.__config__.componentName == "avue-tabs"
        ) {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            let children = childrenObj[key];
            this.setModelValue(children, autoBindFields, data);
          }
        } else {
          if (autoBindFields.hasOwnProperty(item.__config__.formId)) {
            this.formData[item.__vModel__] =
              data[autoBindFields[item.__config__.formId]];
          }
        }
      });
    },
    getElements(fields) {
      let _arr = [];
      fields.map((item) => {
        if (item.__config__.componentName == "avue-tabs") {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            _arr.push(...this.getElements(childrenObj[key]));
          }
        } else {
          _arr.push(item);
        }
      });
      return (() => {
        return _arr;
      })();
    },
    async getF_ReceiptNumberOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      if (!this.isAdd) {
        //如果是编辑 不用请求
        return;
      }
      try {
        let resp = await this.$axios({
          method: "get",
          url: baseUrl + "/code-rules/ReceiptNumber/gen",
        });
        if (resp.data.data) {
          this.formData.F_ReceiptNumber = resp.data.data;
        }
      } catch (error) {}
    },
    async getF_PurOrderNumberOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = " ";
      if (query) {
        keyword = query;
      }
      if (query !== "") {
        this.F_PurOrderNumberOptionsLoading = true;
      }
      try {
        let params = {};
        params.sql = `select p.F_Id,p.F_PurchaseOrder,F_DeliveryUnit from erp_purchaseorder p where p.F_status!=2`;
        let resp = await this.$axios({
          method: "get",
          params: params,
          url:
            baseUrl + "/database-links/localDB/datas",
        });
        this.F_PurOrderNumberOptionsLoading = false;
        this.F_PurOrderNumberOptions = resp.data.data;
      } catch (error) {}
    },
    async handlerSelectF_PurOrderNumber(paramsInfo) {
      try {
        //获取下拉框显示值和保存值
        const { value, label } = paramsInfo;
        this.formData.F_PurOrderId =value;
        console.log(this.formData.F_PurOrderId);
        this.formData.F_PurOrderNumber=label;
        console.log(this.formData.F_PurOrderNumber);
        let resp = await this.$axios({
          method: "get",
          url:
            baseUrl + "/database-links/localDB/datas",
          params: {
            sql: `select e.F_Id F_OrderEntrtyId,e.F_GoodsId,e.F_GoodsName,e.F_GoodCode,e.F_Specs,g.F_InUnit F_UnitId,g.F_BasicUnit,g.F_ComUnit,e.F_UnitPrice,e.F_Amount,e.F_Quantity,e.F_ReceiptQua,e.F_NoReceiptQua,0 as F_ReceiptQuantity,e.F_Des from erp_purchaseorderentry e left join erp_goods g on e.F_GoodsId=g.F_Id where e.F_OrderId="${value}"`,
          },
        });
        if (resp.data) {
          let { data } = resp.data;
          let dynamic = this.getDicData(
            data,
            '{"F_OrderEntrtyId":"F_OrderEntrtyId","F_GoodsId":"F_GoodsId","F_GoodsName":"F_GoodsName","F_GoodCode":"F_GoodCode","F_Specs":"F_Specs","F_Unit":"F_UnitId","F_UnitId":"F_UnitId","F_BasicUnit":"F_BasicUnit","F_ComUnit":"F_ComUnit","F_UnitPrice":"F_UnitPrice","F_Amount":"F_Amount","F_ReceiptQua":"F_ReceiptQua","F_NoReceiptQua":"F_NoReceiptQua","F_ReceiptQuantity":"F_ReceiptQuantity","F_Quantity":"F_Quantity","F_Des":"F_Des"}'
          );
          this.erp_purchasereceiptentry.erp_purchasereceiptentry = dynamic;
        }
      } catch (error) {}

      let autoBindFields = JSON.parse('{"125":"F_DeliveryUnit"}');
      let fields = this.formConfig.fields;
      let saveField = "dataSql" == "dataItem" ? "F_ItemValue" : "F_Id";
      //得对应数据列
      let data = this.F_PurOrderNumberOptions.filter((item) => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
    },

    async getF_DeliveryUnitOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let params = {};
        params.sql = `select i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1`;
        let resp = await this.$axios({
          method: "get",
          params: params,
          url:
            baseUrl + "/database-links/localDB/datas",
        });
        this.F_DeliveryUnitOptions = resp.data.data;
      } catch (error) {}
    },
    async getF_DefaultWarehouseOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = " ";
      if (query) {
        keyword = query;
      }
      if (query !== "") {
        this.F_DefaultWarehouseOptionsLoading = true;
      }
      try {
        if ("dataSql" == "dataSource") {
          let resp = await this.$axios({
            method: "get",
            url:
              baseUrl +
              "/data-sources/undefined/data/?field=F_FullName&keyword=" +
              keyword,
          });
          this.F_DefaultWarehouseOptionsLoading = false;
          this.F_DefaultWarehouseOptions = resp.data.data;
        } else {
          let params = {};
          params.sql = `SELECT W.F_Id,W.F_FullName FROM erp_warehouse W`;
          let resp = await this.$axios({
            method: "get",
            params: params,
            url:
              baseUrl +
              "/database-links/localDB/datas",
          });
          this.F_DefaultWarehouseOptionsLoading = false;
          this.F_DefaultWarehouseOptions = resp.data.data;
        }
      } catch (error) {}
    },
    handlerSelectF_DefaultWarehouse(val) {
      let autoBindFields = JSON.parse("");
      let fields = this.formConfig.fields;
      let saveField = "dataSql" == "dataItem" ? "F_ItemValue" : "F_Id";
      //得对应数据列
      let data = this.F_DefaultWarehouseOptions.filter((item) => {
        return item[saveField] == val;
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
      arr.map((item) => {
        let _obj = {};
        for (let key in prestrainFieldsConf) {
          _obj[key] = item[prestrainFieldsConf[key]];
        }
        resultArr.push(_obj);
      });
      return resultArr;
    },
  },
};
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
