<template>
  <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div :class="[!searchFlag ? 'searchBox' : '']">
          <el-form label-width="70px" style="display: inline-block; margin-right:190px;">
                <el-form-item label="盘点编号" style="display: inline-block;">
                  <el-input
                    v-model="searchParam.F_InventoryCode"
                    size="small"
                    placeholder="请输入库存盘点编号查询"
                    style="width:200px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="盘点时间" style="display: inline-block;">
                  <el-date-picker
                    size="small"
                    type="datetimerange"
                    value-format="yyyy-MM-dd"
                    v-model="F_InventoryDate_Date"
                    style="width: 320px"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="F_InventoryDate_DateChange"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="仓库" label-width="50px" style="display: inline-block;">
                  <el-select
                    v-model="searchParam.F_WareHouseId"
                    filterable
                    clearable
                    style="width: 200px"
                    placeholder="请选择仓库"
                  >
                    <el-option
                      v-for="(item, index) in F_WareHouseId_Option"
                      :key="index"
                      :label="item.F_FullName"
                      :value="item.F_Id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
				<el-form-item label="单据状态" style="display: inline-block; margin-right:5px;">
				  <el-select
				    v-model="searchParam.F_AuditMark"
				    filterable
				    clearable
				    style="width: 200px"
				    placeholder="请选择单据状态"
				  >
				    <el-option
				      v-for="(item, index) in F_AuditMark_Option"
				      :key="index"
				      :label="item.F_FullName"
				      :value="item.F_Id"
				    >
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick" style="margin-top: 4px;">搜索</el-button>
				<el-button icon="el-icon-refresh" size="small" @click="searchReset" style="margin-top: 4px;">重置</el-button>
          </el-form>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <avue-crud
          ref="ERP_DiskTable"
          :data="listData"
          id="printTable"
          :option="option"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @selection-change="selectionChange"
          @row-click="handleCurrentRowChange"
          >
          <template slot-scope="scope" slot="menu">
            <template v-if="scope.row.flowStatus && scope.row.flowStatus == 2">
              <span
                v-if="
                  hasBtns('createFormFlow') &&
                  hasButtonPermission('createFormFlow')
                "
                class="form-span-button"
                >审批中</span
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click="viewForm(scope.row)"
                >查看</el-button
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
                >审批完成</span
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click.stop="viewForm(scope.row)"
                >查看</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('modify') && hasButtonPermission('modify')"
                @click.stop="editForm(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="opr-danger"
                size="mini"
                v-if="hasBtns('delete') && hasButtonPermission('delete')"
                @click.stop="deleteForm(scope.row)"
                >删除</el-button
              >
            </template>
            <template v-else>
              <el-button
                type="opr-primary"
                size="mini"
                icon="el-icon-guide"
                v-if="
                  scope.row.flowStatus &&
                  scope.row.flowStatus == 1 &&
                  hasBtns('createFormFlow') &&
                  hasButtonPermission('createFormFlow')
                "
                @click="CreateFormFlow(scope.row)"
                >发起审批</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="
                  hasBtns('createDesignFlow') &&
                  hasButtonPermission('createDesignFlow')
                "
                @click="CreateDesignFlow(scope.row)"
                >发起临时流程</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('view') && hasButtonPermission('view')"
                @click="viewForm(scope.row)"
                >查看</el-button
              >
              <el-button
                type="opr-primary"
                size="mini"
                v-if="hasBtns('modify') && hasButtonPermission('modify')"
                @click="editForm(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="opr-danger"
                size="mini"
                v-if="hasBtns('delete') && hasButtonPermission('delete')"
                @click="deleteForm(scope.row)"
                >删除</el-button
              >
            </template>
          </template>
          <template slot-scope="scope" slot="menuLeft">
            <el-button
              type="primary"
              v-if="hasButtonPermission('refresh')"
              icon="el-icon-refresh-right"
              size="small"
              >刷新</el-button
            >
            <el-button
              type=""
              v-if="hasButtonPermission('examine')"
              icon=""
              size="small"
              @click="batchExamine(scope.row)"
              >审核</el-button
            >
          </template>
        </avue-crud>
        <el-dialog
          title="表单"
          :append-to-body="true"
          :fullscreen="true"
          :visible.sync="flag"
          :class="isWorkflowForm ? 'work-form-dialog' : ''"
          :show-close="!isWorkflowForm"
        >
          <ERP_DiskForm
            ref="xtForm"
            v-if="flag"
            :isEdit="isEdit"
            :disabled="disabled"
            @onChange="dialogChange"
            :keyValue="keyValue"
          ></ERP_DiskForm>
        </el-dialog>
      </div>
    </main-content>
    <createFlow
      v-if="isCreateFlow"
      formType="2"
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
import ERP_DiskForm from "./ERP_DiskForm";
export default {
  name: "ERP_Disk",
  mixins: [authorizeMixin, tableOptionMixin, schemeMixins],
  components: { MainContent, MainFixed, ERP_DiskForm, createFlow },
  data() {
    return {
      computedHeight: 0,
      btns: ["refresh", "examine"],
      contentTitle: "盘盈审核列表",
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      F_InventoryDate_Date: [],
      listData: [],
      UpdateInventorList:[],
      keyValue: "",
      flag: false,
      isEdit: true, // 查看-不显示按钮,
      disabled: false, // 查看-禁用input,
      isWorkflowForm: false, //默认值 false
      searchParam: {
        F_InventoryCode: "",
        F_InventoryDate_Start: "",
        F_InventoryDate_End: "",
        F_InventoryDate_Date: "",
        F_WareHouseId: "",
        F_AuditMark: "",
      },
      searchFlag: false,
      defaultProps: {
        children: "children",
        label: "",
      },
      F_WareHouseId_Option: [],
      F_AuditMark_Option:[{"F_Id":1,"F_FullName":'未审核'},{"F_Id":2,"F_FullName":'已审核'}],
      option: {
        rowKey: "F_Id",
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
		menu:false,
        menuWidth: 0,
        border: false,
        page: true,
        index: true,
        selection: false,
        indexLabel: "#",
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: false,
            label: "单据状态",
            prop: "F_AuditMark",
          },
          {
            sortable: false,
            label: "id",
            prop: "F_Id",
            hide: true,
          },
          {
            sortable: true,
            label: "盘点时间",
            prop: "F_InventoryDate",
			width: "140"
          },
          {
            sortable: true,
            label: "盘点编号",
            prop: "F_InventoryCode",
			width: "140"
          },
          {
            sortable: false,
            label: "经办人",
            prop: "F_Manager",
          },
          {
            sortable: false,
            label: "仓库",
            prop: "F_WareHouseName",
          },
          {
            label: "id",
            prop: "F_InventoryId",
            hide: true,
            sortable: false,
          },
          {
            label: "商品id",
            prop: "F_GoodsId",
            sortable: false,
          },
          {
            label: "商品名称",
            prop: "F_GoodsName",
            sortable: false,
          },
          {
            label: "商品编号",
            prop: "F_GoodCode",
            sortable: true,
			width: "140"
          },
          {
            label: "基本库存数量",
            prop: "F_BasicAmount",
            type: "number",
			sortable: true,
			width: "120"
          },
          {
            label: "库存显示数量",
            prop: "F_ComAmount",
            type: "number",
			sortable: true,
			width: "120"
          },
          {
            label: "本次盘点数量",
            prop: "F_Quantity",
            sortable: true,
			width: "120"
          },
          {
            label: "基本库存差数",
            prop: "F_BasicDiff",
            sortable: true,
			width: "120"
          },
          {
            label: "库存显示差数",
            prop: "F_ComDiff",
            sortable: true,
			width: "120"
          },
          {
            label: "说明信息",
            prop: "F_Description",
            sortable: false,
          },
          {
            label: "库存id",
            prop: "F_StockId",
            sortable: false,
          },
        ],
      },
    };
  },
  created() {
    this.getF_WareHouseId_Option();
  },
  mounted(){
  	  let themeName = getStore({ name: "themeName" }) || "default";
  	  if((themeName == "eveningTheme" && window.screen.width<1730)||(themeName != "eveningTheme" &&window.screen.width<1730)){
  	    this.computedHeight =32;
  	  }
  	  console.log('this.computedHeight',this.computedHeight);
  	  this.changeBodyHeight();
  	},
  methods: {
    selectionChange(list) {
      console.log(list);
       this.UpdateInventorList=list;
      // this.UpdateInventorList= list.map((x) =>{ 
      // var rowData = {F_InventoryId:x.F_InventoryId,F_BasicAmount:x.F_BasicAmount,F_ComAmount:x.F_ComAmount,F_BasicDiff:x.F_BasicDiff,F_ComDiff:x.F_ComDiff,F_StockId:x.F_StockId};
      // this.UpdateInventorList.push(rowData);
      // })
      // console.log(this.UpdateInventorList);
    },
    // handleCurrentRowChange(row) {
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
    getF_WareHouseId_Option() {
      request({
        url: baseUrl + "/database-links/localDB/datas",
        method: "get",
        params: {
          sql: `SELECT
                w.F_Id,
                w.F_FullName 
                FROM
                erp_warehouse w`,
        },
      }).then((res) => {
        this.F_WareHouseId_Option = res.data.data;
      });
    },
    /* 获取公司用户数据 */
    getListData() {
      request({
        url: baseUrl + "/erp_disk",
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
      this.searchParam.F_InventoryCode = null;
      this.searchParam.F_InventoryDate_Start = null;
      this.searchParam.F_InventoryDate_End = null;
      this.searchParam.F_InventoryDate_Date = null;
      this.F_InventoryDate_Date = [];
      this.searchParam.F_WareHouseId = null;
      this.searchParam.F_AuditMark = null;
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
    batchExamine(val) {
      var _this=this;
      console.log(val);
      console.log(this.UpdateInventorList);
      if (!this.UpdateInventorList.length === 0) {
        this.$message.error("未选择项目！");
        return;
      }
        var status=false;
        var isNull=false
      for (let index = 0; index < this.UpdateInventorList.length; index++) {
        if(this.UpdateInventorList[index]["F_BasicAmount"]==null||this.UpdateInventorList[index]["F_ComAmount"]==null||this.UpdateInventorList[index]["F_BasicDiff"]==null||this.UpdateInventorList[index]["F_StockId"]==null||this.UpdateInventorList[index]["F_ComDiff"]==null)
        {
            isNull=true;
        }
        if(this.UpdateInventorList[index]["F_AuditMark"]=="已审核")
        {
           status=true;
        }
      }
    //   if(isNull)
    //   {
    //     this.$confirm("信息不完整", "提示");
    //     return;
    //   }
    //    if(status)
    //   {
    //     this.$confirm("此单已审核，请勿重复操作", "提示");
    //     return;
    //   }
    
      this.$confirm("确定要审核所选项吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: baseUrl + "/erp_disk/updateInventory",
          method:"Post",
          data:{erp_UpdateInventoryList:_this.UpdateInventorList}
        }).then((res) => {
          this.getListData();
          this.$notify({
            title: "成功",
            message: "审核成功",
            type: "success",
          });
        });
      });
    },
    /* 删除 */
    deleteForm(val) {
      this.$confirm("确定要删除此项吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: baseUrl + "/erp_turnover/" + val.F_Id,
          method: "delete",
        }).then((res) => {
          this.getListData();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
          });
        });
      });
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
    F_InventoryDate_DateChange(val) {
      this.searchParam.F_InventoryDate_Start = val[0];
      this.searchParam.F_InventoryDate_End = val[1];
    },
  },
};
</script>
<style scoped>
.searchBox {
   display: inline-block;
   margin-bottom: 6px;
}
#printTable /deep/.avue-crud__menu{
	width: auto;
	top: 0px;
	right: 0px;
	position: absolute;
}
/deep/ .avue-crud__left{
	margin-left: 5px;
}
/deep/ .main-table{
	overflow: hidden;
}

/deep/ .el-range-editor--small.el-input__inner{
			height: 27px;
		}
/deep/ .el-upload__tip{
		text-align: center;
		margin-top: -8px;
		}
</style>
