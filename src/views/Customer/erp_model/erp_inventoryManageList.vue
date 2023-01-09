<template>
  <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="searchBox">
          <el-form label-width="70px" style="display: inline-block; margin-right: 140px;">
                <el-form-item label="仓库名称" style="display: inline-block;">
                  <el-select
                    v-model="searchParam.F_WarehouseName"
                    filterable
                    clearable
                    style="width:200px"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in F_WarehouseId_Option"
                      :key="index"
                      :label="item.F_FullName"
                      :value="item.F_Id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品名称" style="display: inline-block;">
                  <el-input
                    v-model="searchParam.F_GoodsName"
                    size="small"
                    placeholder="请输入商品名称查询"
                    style="width: 200px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品id" hidden="hidden" label-width="60px" style="display: inline-block; margin-right: 5px;">
                  <el-input
                    v-model="searchParam.F_GoodsId"
                    size="small"
                    placeholder="请输入商品id查询"
                    style="width: 200px"
                  ></el-input>
                </el-form-item>
				<el-button
				  type="primary"
				  icon="el-icon-search"
				  size="small"
				  @click="searchClick"
				  style="margin-top: 4px;"
				  >搜索</el-button
				>
				<el-button icon="el-icon-refresh" size="small" @click="searchReset"  style="margin-top: 4px;"
				  >重置</el-button
				>
          </el-form>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <avue-crud
          ref="erp_inventoryManageTable"
          :data="listData"
          id="printTable"
          :option="option"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @current-row-change="handleCurrentRowChange">
          <template slot-scope="scope" slot="menuLeft">
            <el-button
              type="primary"
              v-if="hasButtonPermission('refresh')"
              icon="el-icon-refresh-right"
              size="small"
              >刷新</el-button
            >
            <!-- <el-button
              type="primary"
              v-if="hasButtonPermission('add')"
              icon="el-icon-plus"
              size="small"
              @click="openForm()"
              >新增</el-button
            > -->
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
          <erp_inventoryManageForm
            ref="xtForm"
            v-if="flag"
            :isEdit="isEdit"
            :disabled="disabled"
            @onChange="dialogChange"
            :keyValue="keyValue"
          ></erp_inventoryManageForm>
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
import erp_inventoryManageForm from "./erp_inventoryManageForm";
export default {
  name: "erp_inventoryManage",
  mixins: [authorizeMixin, tableOptionMixin, schemeMixins],
  components: { MainContent, MainFixed, erp_inventoryManageForm, createFlow },
  data() {
    return {
      computedHeight: 0,
      btns: ["refresh", "add", "modify"],
      contentTitle: "新增修改库存列表",
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      listData: [],
      keyValue: "",
      flag: false,
      isEdit: true, // 查看-不显示按钮,
      disabled: false, // 查看-禁用input,
      isWorkflowForm: false, //默认值 false
      searchParam: {
        F_WarehouseId: "",
        F_GoodsId: "",
        F_WarehouseName: "",
        F_GoodsName: "",
      },
      defaultProps: {
        children: "children",
        label: "",
      },
      F_WarehouseId_Option: [],
      option: {
        menu:false,
        rowKey: "F_Id",
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 0,
        border: false,
        page: true,
        index: true,
        indexLabel: "#",
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: false,
            label: "仓库id",
            prop: "F_WarehouseId",
            hide:true,
          },
           {
            sortable: false,
            label: "仓库名称",
            prop: "F_WerehouseName",
          },
          {
            sortable: false,
            label: "商品id",
            prop: "F_GoodsId",
            hide:true,
          },
          {
            sortable: false,
            label: "商品名称",
            prop: "F_GoodsName",
          },
         {
            sortable: false,
            label: "基本单位",
            prop: "F_BasicUnit",
          },
          {
            sortable: false,
            label: "库存显示单位",
            prop: "F_ComUnit",
          },
        //   {
        //     sortable: true,
        //     label: "入库单位",
        //     prop: "F_InUnit",
        //   },
        //   {
        //     sortable: true,
        //     label: "出库单位",
        //     prop: "F_OutUnit",
        //   },
          {
            sortable: false,
            label: "基本单位数量",
            prop: "F_BasicAmount",
          },
          {
            sortable: false,
            label: "库存显示数量",
            prop: "F_ComAmount",
          },
          {
            sortable: false,
            label: "仓库地址",
            prop: "F_Address",
          },
        ],
      },
    };
  },
  created() {
    this.getF_WarehouseId_Option();
  },
  mounted(){
  	  let themeName = getStore({ name: "themeName" }) || "default";
  	  if((themeName == "eveningTheme" && window.screen.width<1300)||(themeName != "eveningTheme" &&window.screen.width<1300)){
  	    this.computedHeight =32;
  	  }
  	  console.log('this.computedHeight',this.computedHeight);
  	  this.changeBodyHeight();
  	},
  methods: {
    handleCurrentRowChange(row) {
      this.$refs.erp_inventoryManage.toggleSelection([row]);
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
    getF_WarehouseId_Option() {
         let params = {};
          params.sql = `	select F_Id,F_FullName from erp_warehouse`;
        //   request({
        //     method: 'get',
        //     params: params,
        //     url:  baseUrl + '/database-links/localDB/datas'
        //   }).then;
        //    this.F_WarehouseId_Option = res.data.data;
      request({
        url: baseUrl + '/database-links/localDB/datas',
        method: "get",
        params: params
      }).then((res) => {
        this.F_WarehouseId_Option = res.data.data;
      });
    },
    /* 获取公司用户数据 */
    getListData() {
      request({
        url: baseUrl + "/erp_inventorymanage",
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
      this.searchParam.F_WarehouseId = null;
      this.searchParam.F_GoodsId = null;
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
      this.$confirm("确定要删除此项吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: baseUrl + "/erp_inventorymanage/" + val.F_Id,
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
