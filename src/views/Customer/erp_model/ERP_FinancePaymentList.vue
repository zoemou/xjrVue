<template>
    <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
             <div :class="[!searchFlag ? 'searchBox' : '']">
                <el-form label-width="70px" style="display: inline-block; margin-right:120px;">
                    <el-form-item  label="付款时间" style="display: inline-block;">
                        <el-date-picker size="small"  type="daterange" value-format="yyyy-MM-dd" v-model="F_PaymentDate_Date"   style="width:250px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="F_PaymentDate_DateChange"> </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="付款编码" style="display: inline-block;">
						<el-input v-model="searchParam.F_PaymentCode" size="small" placeholder="请输入付款编码查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="经办人" style="display: inline-block;">
						<el-input v-model="searchParam.F_Manager" size="small" placeholder="请输入经办人查询"   style="width:200px" ></el-input>
                    </el-form-item>
					<el-form-item  label="采购订单"style="display: inline-block;">
						<el-select v-model="searchParam.F_PurchaseOrderId" filterable clearable style="width:200px"  placeholder="请选择">
							<el-option  v-for="(item,index) in F_PurchaseOrderId_Option"  :key="index" :label="item.F_PurchaseOrder" :value="item.F_Id" >  </el-option>
						</el-select> 
					</el-form-item>
                 <template v-if="searchFlag">
                    <el-form-item  label="供货单位" style="display: inline-block;">
						<el-input v-model="searchParam.F_DeliveryUnit" size="small" placeholder="请输入供货单位查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="采购人" label-width="60px" style="display: inline-block; margin-right:5px;">
						<el-input v-model="searchParam.F_PurchaseMan" size="small" placeholder="请输入采购人查询"   style="width:200px" ></el-input>
                    </el-form-item>
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
            <avue-crud ref="ERP_FinancePaymentTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
                       @on-load="onPageLoad"
                       @sort-change="sortChange"  @row-dblclick="editForm">
                <template slot-scope="scope" slot="menu">
		  			   <template v-if="scope.row.flowStatus&&scope.row.flowStatus==2">
						  <span v-if="hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" class="form-span-button">审批中</span>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">查看</el-button>
		  		 	   </template>
		  			   <template v-else-if="scope.row.flowStatus&&scope.row.flowStatus==3">
						  <span v-if="hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" class="form-span-button">审批完成</span>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">查看</el-button>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('modify')&&hasButtonPermission('modify')" @click="editForm(scope.row)">编辑</el-button>
						  <el-button type="opr-danger" size="mini" v-if="hasBtns('delete')&&hasButtonPermission('delete')" @click="deleteForm(scope.row)">删除</el-button>
		  			   </template>
		  			   <template v-else>
			  			  <el-button type="opr-primary" size="mini" v-if="scope.row.flowStatus&&scope.row.flowStatus==1&&hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" @click="CreateFormFlow(scope.row)">发起审批</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('createDesignFlow') && hasButtonPermission('createDesignFlow')" @click="CreateDesignFlow(scope.row)">发起临时流程</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">查看</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('modify')&&hasButtonPermission('modify')" @click="editForm(scope.row)">编辑</el-button>
			  			  <el-button type="opr-danger" size="mini" v-if="hasBtns('delete')&&hasButtonPermission('delete')" @click="deleteForm(scope.row)">删除</el-button>
					   </template>
                </template>
                 <template slot-scope="scope" slot="menuLeft">
					 <el-button type="primary"  v-if="hasButtonPermission('add')" icon="el-icon-plus" size="small" @click="openForm()">新增</el-button>
                     <el-button type=""  v-if="hasButtonPermission('refresh')" size="small">刷新</el-button>
                     <el-button type=""  v-if="hasButtonPermission('batchDelete')" size="small" @click="batchDelete()">批量删除</el-button>
                     <el-button type=""  v-if="hasButtonPermission('print')" size="small" @click="'#printForm'">打印</el-button>
                </template>
            </avue-crud>
            <el-dialog title="表单" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <ERP_FinancePaymentForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></ERP_FinancePaymentForm>
            </el-dialog>
        </div>
    </main-content>
    <createFlow v-if="isCreateFlow" formType="2" :UrlAddress="this.$options.name" :createFlowType="createFlowType" :row="scopeRow" :scheme="scheme" @closedCreateFlow="closedCreateFlow"></createFlow>
    </div>
</template>
<script>
      import createFlow from '@/components/formInitiationProcess/createFlow';
      import schemeMixins from '@/components/formInitiationProcess/schemeMixins';
     import MainFixed from "@/page/main/MainFixed";
      import authorizeMixin from "@/mixins/authorize";
      import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
	  import { getStore } from "@/util/store";
     import MainContent from "@/page/main/MainContent";
      import request from '@/router/axios';
      import { baseUrl } from '@/config/env';
      import { getOrder } from '@/util/util';
      import ERP_FinancePaymentForm from './ERP_FinancePaymentForm';
     export default {
         name: "ERP_FinancePayment",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent, MainFixed,ERP_FinancePaymentForm,createFlow },
         data() {
              return {computedHeight:50,				 	  
			  btns:[
				 	     'refresh',
				 	     'add',
				 	     'modify',
				 	     'delete',
				 	     'batchDelete',
				 	     'print'
                   ],
                   contentTitle: '付款管理列表',
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1
                   },
                   ids: '',
                   F_PaymentDate_Date : [],                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   searchParam: {                       F_PaymentDate_Start: '',
                       F_PaymentDate_End: '',
                       F_PaymentDate_Date: '',
                       F_PaymentCode: '',
                       F_Manager: '',
                       F_PurchaseOrderId: '',
                       F_DeliveryUnit: '',
                       F_PurchaseMan: '',
},
                   searchFlag: false,
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
             F_PurchaseOrderId_Option : [],                   option:{
                       rowKey:'F_Id',
                       highlightCurrentRow: true,
                       stripe: false,
                       addBtn: false,
                       menuWidth: 265,
                       border: false,
                       page: true,
                       selection: false,
                       index: true,
                       indexLabel: '#',
                       align: 'left',
                       menuAlign: 'center',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: false,
                               label: '付款编码',
                               prop: 'F_PaymentCode',
                           },
                           {
                               sortable: true,
                               label: '付款时间',
                               prop: 'F_PaymentDate',
							   width: "140"
                           },
                           {
                               sortable: false,
                               label: '经办人',
                               prop: 'F_Manager',
                           },
                           {
                               sortable: false,
                               label: '采购订单',
                               prop: 'F_PurchaseOrderId',
                           },
                           {
                               sortable: false,
                               label: '供货单位',
                               prop: 'F_DeliveryUnit',
                           },
                           {
                               sortable: false,
                               label: '采购人',
                               prop: 'F_PurchaseMan',
                           },
                           {
                               sortable: true,
                               label: '采购总额',
                               prop: 'F_TotalPurchases',
							   minWidth: "100"
                           },
                           {
                               sortable: true,
                               label: '未销金额',
                               prop: 'F_UnsoldAmount',
							   minWidth: "100"
                           },
                           {
                               sortable: true,
                               label: '已消金额',
                               prop: 'F_SalesAmount',
							   minWidth: "100"
                           },
                           {
                               sortable: false,
                               label: '备注',
                               prop: 'F_Description',
                           },
                           {
                               sortable: false,
                               label: '制单人员',
                               prop: 'F_CreatorUserId',
                           },
                           {
                               sortable: true,
                               label: '制单时间',
                               prop: 'F_CreatorTime',
							   width: "140"
                           },
                       ]
                   }
              }
                   },
                   created() {
                this.getF_PurchaseOrderId_Option();                   
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
                         printForm() {
                         	let element = window.document.getElementById("printTable");
                         	setTimeout(() => {
                         	  html2canvas(element, {
                         		backgroundColor: null,
                         		useCORS: true,
                         		windowHeight: document.body.scrollHeight
                         	  }).then(canvas => {
                         		const url = canvas.toDataURL();
                         		this.printImg = url;
                         		printJS({
                         		  printable: url,
                         		  type: "image",
                         		  documentTitle: '打印',
                         		  scanStyles: false,
                         		  repeatTableHeader: false,
                         		  header: null
                         		});
                          	  });
                         	}, 1);
                           },
                         hasBtns(encode){
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
          getF_PurchaseOrderId_Option(){ 
             request({ 
                 url : baseUrl + '/database-links/localDB/datas', 
                 method : 'get', 
                 params : {
                 sql: `SELECT
	p.F_PurchaseOrder,
	p.F_Id,
	c.F_FullName,
	p.F_PurchasePeople
FROM
	erp_purchaseorder p
	left join erp_inoutunit c
	on p.F_DeliveryUnit=c.F_Id where p.F_InvalidMark=1 and F_AuditMark=2
-- F_InvalidMark=1 状态等于正常	F_AuditMark=2 审核状态等于已审核通过`
                 }
             }).then(res => { 
                 this.F_PurchaseOrderId_Option = res.data.data 
             }) 
          }, 
                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/erp_financepayment',
                                method: 'get',
                                params: this.searchParam
                            }).then(res =>{
                                this.listData = res.data.data.Rows
                                this.page.total = res.data.data.Total;
                            })
                         },
                         /* 页面加载 */
                         onPageLoad(page) {
                            this.searchParam.limit = page.currentPage;
                            this.searchParam.size = page.pageSize;
                            this.getListData();
                         },
                          /* 查询 */
                         searchClick() {
                            this.searchParam.limit = 1
                            this.searchParam.order = null
                            this.searchParam.orderfield = null
                            this.getListData()
                         },
                          /* 查询表单重置 */
                         searchReset() {
                       this.searchParam.F_PaymentDate_Start = null;
                       this.searchParam.F_PaymentDate_End = null;
                       this.searchParam.F_PaymentDate_Date = null;
                       this.F_PaymentDate_Date = [];
                       this.searchParam.F_PaymentCode = null;
                       this.searchParam.F_Manager = null;
                       this.searchParam.F_PurchaseOrderId = null;
                       this.searchParam.F_DeliveryUnit = null;
                       this.searchParam.F_PurchaseMan = null;
                            this.getListData()
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
                         openForm(){
							  if(!this.isWorkflowForm){
                             //不处理工作流表单时候，表单类型重置
                             window.localStorage.setItem('systemFormType',0);
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
                                     url: baseUrl + "/erp_financepayment/" + val.F_Id,
                                     method: "delete",
                                 }).then((res) => {
                                     this.getListData()
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
                            this.getListData()
                         },
                          /* 弹窗回调 */
                          dialogChange(b){
                              this.flag = false;
                              this.$nextTick(()=>{
                              this.getListData();
                         })},
                           selectionChange(list){
                             this.ids = list.map((x) => x.F_Id).join(',');
                           },
                           batchDelete() {
                            if (!this.ids || this.ids.split(",").length === 0) {
                                 this.$message.error("未选择项目！");
                                 return;
                           }
                             this.$confirm("确定要批量删除所选项吗？", "提示", {
                               confirmButtonText: "确定",
                               cancelButtonText: "取消",
                               type: "warning",
                             }).then(() => {
                               request({
                                 url: baseUrl + "/erp_financepayment/" + this.ids,
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
                   F_PaymentDate_DateChange(val){
                       this.searchParam.F_PaymentDate_Start = val[0];
                       this.searchParam.F_PaymentDate_End = val[1];
                   }
         }
     }
</script>
<style scoped>
/deep/ .el-upload__tip{
	text-align: center;
	margin-top: -8px;
}
.searchBox {
   display: inline-block;
   position: static!important;
   padding: 6px 20px 0px 5px!important;
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
