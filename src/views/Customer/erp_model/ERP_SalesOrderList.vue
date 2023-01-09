<template>
  <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div :class="[!searchFlag ? 'searchBox' : '']">
          <el-form label-width="70px" style="display: inline-block; margin-right:120px;">
                <el-form-item label="订单日期" style="display: inline-block;">
                  <el-date-picker
                    size="small"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    v-model="F_Orderdate_Date"
                    style="width:250px"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="F_Orderdate_DateChange"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="单据编号" style="display: inline-block;">
                  <el-input
                    v-model="searchParam.F_SalesCode"
                    size="small"
                    placeholder="请输入单据编号查询"
                    style="width: 200px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="客户名称" style="display: inline-block;">
                  <el-select
                    v-model="searchParam.F_ClientId"
                    filterable
                    clearable
                    style="width:200px"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in F_ClientId_Option"
                      :key="index"
                      :label="item.F_FullName"
                      :value="item.F_Id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="销售类型" style="display: inline-block;">
                  <el-select
                    v-model="searchParam.F_SalesType"
                    filterable
                    clearable
                    style="width: 200px"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in F_SalesType_Option"
                      :key="index"
                      :label="item.F_ItemName"
                      :value="item.F_ItemValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              <template v-if="searchFlag">
                  <el-form-item label="销售人员" style="display: inline-block;">
                    <el-input
                      v-model="searchParam.F_SalesPersonId"
                      size="small"
                      placeholder="请输入销售人员查询"
                      style="width:200px"
                    ></el-input>
                  </el-form-item>
               
                  <el-form-item label="收款方式" style="display: inline-block;">
                    <el-select
                      v-model="searchParam.F_PaymentMethod"
                      filterable
                      clearable
                      style="width:200px"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in F_PaymentMethod_Option"
                        :key="index"
                        :label="item.F_ItemName"
                        :value="item.F_ItemValue"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
               
                <!-- <el-col :span="8">
                  <el-form-item label="发货日期">
                    <el-input
                      v-model="searchParam.F_DeliveryDate"
                      size="small"
                      placeholder="请输入发货日期要查询的关键字"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col> -->
              </template>
			  <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick" style="margin:4px 0px 0px 5px">搜索</el-button>
			  <el-button icon="el-icon-refresh" size="small" @click="searchReset" style="margin-top:4px;">重置</el-button>
			  <!-- 展开/收起功能按钮 -->
			  <el-link class="down-up" :underline="false"  @click="() => searchFlag = !searchFlag"  style="margin-left:10px"  >{{ searchFlag ? "收起" : "展开" }}<i :class="[!searchFlag ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i></el-link>
          </el-form>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <avue-crud
          ref="ERP_SalesOrderTable"
          :data="listData"
          @selection-change="selectionChange"
          id="printTable"
          :option="option"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @sort-change="sortChange"
		  @row-dblclick="editForm"
        >
          @current-row-change="handleCurrentRowChange" >
          <template slot-scope="scope" slot="menu">
            <template v-if="scope.row.flowStatus && scope.row.flowStatus == 2">
              <span
                v-if="
                  hasBtns('createFormFlow') &&
                  hasButtonPermission('createFormFlow')
                "
                class="form-span-button"
                >{{ $t("workFlow.WFChange.approval") }}</span
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click="viewForm(scope.row)"
                >{{ $t("crud.viewBtn") }}</el-button
              >
            </template>
            <template
              v-else-if="scope.row.flowStatus && scope.row.flowStatus == 3"
            >
              <span
                v-if="
                  hasBtns('createFormFlow') &&
                  hasButtonPermission('createFormFlow')
                "
                class="form-span-button"
                >{{ $t("forme.editModal.approvalComplete") }}</span
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click.stop="viewForm(scope.row)"
                >{{ $t("crud.viewBtn") }}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('modify') && hasButtonPermission('modify')"
                @click.stop="editForm(scope.row)"
                >{{ $t("crud.editBtn") }}</el-button
              >
              <el-button
                type="opr-danger"
                size="mini"
                v-if="hasBtns('delete') && hasButtonPermission('delete')"
                @click.stop="deleteForm(scope.row)"
                >{{ $t("crud.delBtn") }}</el-button
              >
            </template>
            <template v-else>
              <el-button
                type="opr-primary"
                size="mini"
                v-if="
                  scope.row.flowStatus &&
                  scope.row.flowStatus == 1 &&
                  hasBtns('createFormFlow') &&
                  hasButtonPermission('createFormFlow')
                "
                @click="CreateFormFlow(scope.row)"
                >{{ $t("forme.editModal.initiateApproval") }}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="
                  hasBtns('createDesignFlow') &&
                  hasButtonPermission('createDesignFlow')
                "
                @click="CreateDesignFlow(scope.row)"
                >{{ $t("forme.editModal.createFormFlowBtn") }}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click="viewForm(scope.row)"
                >{{ $t("crud.viewBtn") }}</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('modify') && hasButtonPermission('modify')"
                @click="editForm(scope.row)"
                >{{ $t("crud.editBtn") }}</el-button
              >
              <el-button
                type="opr-danger"
                size="mini"
                v-if="hasBtns('delete') && hasButtonPermission('delete')"
                @click="deleteForm(scope.row)"
                >{{ $t("crud.delBtn") }}</el-button
              >
            </template>
          </template>
          <template slot-scope="scope" slot="menuLeft">
			  <el-button
			    type="primary"
			    v-if="hasButtonPermission('add')"
			    icon="el-icon-plus"
			    size="small"
			    @click="openForm()"
			    >新增</el-button
			  >
            <el-button
              type=""
              v-if="hasButtonPermission('refresh')"
              size="small"
              >刷新</el-button
            >
            <el-button
              type=""
              v-if="hasButtonPermission('batchDelete')"
              size="small"
              @click="batchDelete()"
              >批量删除</el-button
            >
            <el-button
              type=""
              v-if="hasButtonPermission('print')"
              size="small"
              @click="&quot;#printForm&quot;;"
              >打印</el-button
            >
            <el-button
              type=""
              v-if="hasButtonPermission('import')"
              size="small"
              @click="excelDialog = true"
              >快速导入</el-button
            >
            <el-button
              type=""
              v-if="hasButtonPermission('export')"
              size="small"
              @click="tableExport()"
              >快速导出</el-button
            >
          </template>
        </avue-crud>
        <el-dialog title="快速导入" width="400px" :append-to-body="true" :visible.sync="excelDialog">
        <el-upload
           class="upload-demo"
           ref="upload"
           :data="uploadData"
           :before-upload="beforeUpload"
           :on-success="successUpload"
           :show-file-list="true"
           drag
           :headers="headers"
           accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
           :action="baseUrl + '/salesorder/import'">
           <i class="el-icon-upload"></i>
           <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
           <div class="el-upload__tip" slot="tip">只能上传Excel文件，且不超过1G</div>
        </el-upload>
         <el-row type="flex">
           <el-col style="text-align:center; margin-bottom: 4px;">
            <el-button size="mini" icon="el-icon-download" @click="download"> 下载模板</el-button>
           </el-col>
         </el-row>
     </el-dialog>
	 <el-dialog
	           title="表单"
	           :append-to-body="true"
	           :fullscreen="true"
	           :visible.sync="flag"
	           :class="isWorkflowForm ? 'work-form-dialog' : ''"
	           :show-close="!isWorkflowForm"
	         >
	           <ERP_SalesOrderForm
	             ref="xtForm"
	             v-if="flag"
	             :isEdit="isEdit"
	             :disabled="disabled"
	             @onChange="dialogChange"
	             :keyValue="keyValue"
	           ></ERP_SalesOrderForm>
	</el-dialog>
      </div>
    </main-content>
    <createFlow
      v-if="isCreateFlow"
      formType="2"
      rowPrimaryKey="F_Id"
      :UrlAddress="this.$options.name"
      :createFlowType="createFlowType"
      :row="scopeRow"
      :scheme="scheme"
      @closedCreateFlow="closedCreateFlow"
    ></createFlow>
  </div>
</template>
<script>
import createFlow from "@/components/formInitiationProcess/createFlow";
import schemeMixins from "@/components/formInitiationProcess/schemeMixins";
import MainFixed from "@/page/main/MainFixed";
import authorizeMixin from "@/mixins/authorize";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import { getStore } from "@/util/store";
import MainContent from "@/page/main/MainContent";
import request from "@/router/axios";
import { baseUrl } from "@/config/env";
import { getOrder } from "@/util/util";
import ERP_SalesOrderForm from "./ERP_SalesOrderForm";
export default {
  name: "ERP_SalesOrder",
  mixins: [authorizeMixin, tableOptionMixin, schemeMixins],
  components: { MainContent, MainFixed, ERP_SalesOrderForm, createFlow },
  data() {
    return {
      computedHeight: 50,
      btns: [
        "refresh",
        "add",
        "modify",
        "delete",
        "batchDelete",
        "print",
        "createFormFlow",
      ],
      contentTitle: "销售订单列表",
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
        layout: "total, prev, pager, next, jumper",
      },
      ids: "",
      listData: [],
      keyValue: "",
      flag: false,
      isEdit: true, // 查看-不显示按钮,
      disabled: false, // 查看-禁用input,
      isWorkflowForm: false, //默认值 false
      searchParam: {
        F_SalesCode: "",
        F_Orderdate_Start: "",
        F_Orderdate_End: "",
        F_Orderdate_Date: "",
        F_ClientId: "",
        F_SalesType: "",
        F_SalesPersonId: "",
        F_PaymentMethod: "",
        F_SalesCode: "",
        F_DeliveryDate: "",
      },
      searchFlag: false,
      defaultProps: {
        children: "children",
        label: "",
      },
      F_ClientId_Option: [],
      F_SalesType_Option: [],
      F_PaymentMethod_Option: [],
      excelDialog: false,
      option: {
        rowKey: "F_Id",
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 265,
        border: false,
        page: true,
        selection: false,
        index: true,
        indexLabel:"#",
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: false,
            label: this.$t("单据编码"),
            prop: "F_SalesCode",
          },
          {
            sortable: true,
            label: this.$t("订单日期"),
            prop: "F_Orderdate",
			minWidth: "140"
          },
          {
            sortable: true,
            label: this.$t("发货日期"),
            prop: "F_DeliveryDate",
			minWidth: "140"
          },
          {
            sortable: false,
            label: this.$t("客户名称"),
            prop: "F_ClientId",
          },
          {
            sortable: false,
            label: this.$t("销售类型"),
            prop: "F_SalesType",
          },
          {
            sortable: false,
            label: this.$t("销售人员"),
            prop: "F_SalesPersonId",
          },
          {
            sortable: false,
            label: this.$t("付款方式"),
            prop: "F_PaymentMethod",
          },
          {
            sortable: false,
            label: this.$t("付款期限"),
            prop: "F_PaymentPeriod",
			minWidth: "140"
          },
          {
            sortable: false,
            label: this.$t("是否开票"),
            prop: "F_IsInvoice",
          },
          {
            sortable: true,
            label: this.$t("优惠折扣"),
            prop: "F_Discount",
			width: "100"
          },
          {
            sortable: true,
            label: this.$t("优惠金额"),
            prop: "F_DiscountedPrice",
			minWidth: "100"
          },
          {
            sortable: true,
            label: this.$t("成交金额"),
            prop: "F_Turnover",
			minWidth: "100"
          },
          {
            sortable: false,
            label: this.$t("备注"),
            prop: "F_Description",
          },
          {
            sortable: false,
            label: this.$t("制单人员"),
            prop: "F_CreatorUserId",
          },
          {
            sortable: true,
            label: this.$t("制单时间"),
            prop: "F_CreatorTime",
			minWidth: "140"
          },
        ],
      },
    };
  },
  created() {
    this.getF_ClientId_Option();
    this.getF_SalesType_Option();
    this.getF_PaymentMethod_Option();
    //const token = JSON.parse(localStorage.getItem("avue-token"))["content"];
    //this.headers.Authorization = "Bearer " + token;
    //this.uploadData = { F_ModuleId: this.$route.meta.moduleid };
  },
  mounted(){
  	  let themeName = getStore({ name: "themeName" }) || "default";
  	  if((themeName == "eveningTheme" && window.screen.width<1612)||(themeName != "eveningTheme" &&window.screen.width<1612)){
  	    this.computedHeight =60;
  	  }
  	  console.log('this.computedHeight',this.computedHeight);
  	  this.changeBodyHeight();
  	},
  methods: {
    handleCurrentRowChange(row) {
      this.$refs.ERP_SalesOrder.toggleSelection([row]);
    },
    printForm() {
      let element = window.document.getElementById("printTable");
      setTimeout(() => {
        html2canvas(element, {
          backgroundColor: null,
          useCORS: true,
          windowHeight: document.body.scrollHeight,
        }).then((canvas) => {
          const url = canvas.toDataURL();
          this.printImg = url;
          printJS({
            printable: url,
            type: "image",
            documentTitle: "打印",
            scanStyles: false,
            repeatTableHeader: false,
            header: null,
          });
        });
      }, 1);
    },
    
    /* 导出 */
    tableExport() {
      this.$refs["ERP_SalesOrderTable"].rowExcel();
      return;
    },
    hasBtns(encode) {
      return this.btns.includes(encode);
    },
    /**发起流程 */
    CreateDesignFlow(val) {
      this.createFlowType = 0;
      this.scopeRow = val;
      this.changeSystemSchemeInfo();
    },
    CreateFormFlow(val) {
      this.createFlowType = 1;
      this.scopeRow = val;
      this.isCreateFlow = true;
    },
    getF_ClientId_Option() {
      request({
        url: baseUrl + "/database-links/localDB/datas",
        method: "get",
        params: {
          sql: `select t.F_Id,t.F_FullName from erp_inoutunit t where t.F_UniType=2`,
        },
      }).then((res) => {
        this.F_ClientId_Option = res.data.data;
      });
    },
    getF_SalesType_Option() {
      request({
        url: baseUrl + "/data-items/SaleType/detail",
        method: "get",
      }).then((res) => {
        this.F_SalesType_Option = res.data.data;
      });
    },
    getF_PaymentMethod_Option() {
      request({
        url: baseUrl + "/data-items/Client_PaymentMode/detail",
        method: "get",
      }).then((res) => {
        this.F_PaymentMethod_Option = res.data.data;
      });
    },
    /* 获取公司用户数据 */
    getListData() {
      request({
        url: baseUrl + "/erp_salesorder",
        method: "get",
        params: this.searchParam,
      }).then((res) => {
        this.listData = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });
    },
    /* 页面加载 */
    onPageLoad(page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
      this.getListData();
    },
    /* 查询 */
    searchClick() {
      this.searchParam.limit = 1;
      this.searchParam.order = null;
      this.searchParam.orderfield = null;
      this.getListData();
    },
    /* 查询表单重置 */
    searchReset() {
      this.searchParam.F_Orderdate_Start = null;
      this.searchParam.F_Orderdate_End = null;
      this.searchParam.F_Orderdate_Date = null;
      this.F_Orderdate_Date = [];
      this.searchParam.F_ClientId = null;
      this.searchParam.F_SalesType = null;
      this.searchParam.F_SalesPersonId = null;
      this.searchParam.F_PaymentMethod = null;
      this.searchParam.F_SalesCode = null;
      this.searchParam.F_DeliveryDate = null;
      this.getListData();
    },
    /*查看*/
    viewForm(val) {
      this.flag = true;
      this.isEdit = false;
      this.disabled = true;
      this.keyValue = val.F_Id;
    },
    /* 编辑 */
    editForm(val) {
      this.flag = true;
      this.isEdit = true;
      this.disabled = false;
      this.keyValue = val.F_Id;
    },
    /* 打开表单 */
    openForm() {
      if (!this.isWorkflowForm) {
        //不处理工作流表单时候，表单类型重置
        window.localStorage.setItem("systemFormType", 0);
      }
      this.keyValue = null;
      this.flag = true;
      this.isEdit = true;
    },
    /* 删除 */
    deleteForm(val) {
      this.$confirm(this.$t("deletePrompt.promptContent"), this.$t("tip"), {
        confirmButtonText: this.$t("buttonModule.modalSureBtn"),
        cancelButtonText: this.$t("editorModule.cancel"),
        type: "warning",
      }).then(() => {
        request({
          url: baseUrl + "/erp_salesorder/" + val.F_Id,
          method: "delete",
        }).then((res) => {
          this.getListData();
          this.$notify({
            title: this.$t("Notice.hintSuccess"),
            message: this.$t("deletePrompt.successDeleted"),
            type: "success",
          });
        });
      });
    },
    F_Orderdate_DateChange(val) {
      this.searchParam.F_Orderdate_Start = val[0];
      this.searchParam.F_Orderdate_End = val[1];
    },
    /* 分页 */
    sortChange(data) {
      this.searchParam.order = getOrder(data.order);
      this.searchParam.orderfield = data.prop;
      this.getListData();
    },
    /* 弹窗回调 */
    dialogChange(b) {
      this.flag = false;
      this.$nextTick(() => {
        this.getListData();
      });
    },
    selectionChange(list) {
      this.ids = list.map((x) => x.F_Id).join(",");
    },
    batchDelete() {
      if (!this.ids || this.ids.split(",").length === 0) {
        this.$message.error(this.$t("deletePrompt.noSelected"));
        return;
      }
      this.$confirm(this.$t("deletePrompt.promptContent"), this.$t("tip"), {
        confirmButtonText: this.$t("buttonModule.modalSureBtn"),
        cancelButtonText: this.$t("editorModule.cancel"),
        type: "warning",
      }).then(() => {
        request({
          url: baseUrl + "/erp_salesorder/" + this.ids,
          method: "delete",
        }).then((res) => {
          this.getListData();
          this.$notify({
            title: this.$t("Notice.hintSuccess"),
            message: this.$t("deletePrompt.successDeleted"),
            type: "success",
          });
        });
      });
    },
  },
};
</script>
<style scoped>
/deep/ .el-upload__tip{
	text-align: center;
	margin-top: -8px;
}
.searchBox {
   display: inline-block;
}

#printTable /deep/.avue-crud__menu{
			position: static;
	}
#printTable /deep/.avue-crud__left{
		  	margin:6px 0px 2px 8px!important;
		  	float: left;
	}

/deep/ .main-table{
	overflow: hidden;
}
/deep/ .el-range-editor--small.el-input__inner{
		height: 27px;
	}
.down-up{
	position: absolute;
	right: 75px;
	top:10px;
	font-size: 12px;
}
</style>
