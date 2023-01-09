<template>
    <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
             <div :class="[!searchFlag ? 'searchBox' : '']">
                <el-form label-width="70px" style="display: inline-block; margin-right: 70px;">
                    <el-form-item  label="单据日期" style="display: inline-block;">
                        <el-date-picker size="small"  type="daterange" value-format="yyyy-MM-dd" v-model="F_BillDate_Date"   style="width:250px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="F_BillDate_DateChange"> </el-date-picker>
                   </el-form-item>
                   <el-form-item  label="支出编码" style="display: inline-block;">
						<el-input v-model="searchParam.F_ExpenditureCode" size="small" placeholder="请输入支出编码查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="经办人" label-width="60px" style="display: inline-block;">
						<el-input v-model="searchParam.F_Manager" size="small" placeholder="请输入经办人查询"   style="width:200px" ></el-input>
                    </el-form-item>
					<el-form-item  label="业务类型" style="display: inline-block;">
					   <el-select v-model="searchParam.F_BusinessType" filterable clearable style="width:200px"   placeholder="请选择">
					      <el-option  v-for="(item,index) in F_BusinessType_Option"  :key="index" :label="item.F_ItemName"  :value="item.F_ItemValue" >  </el-option>
					   </el-select> 
					</el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick" style="margin: 4px 0px 0px 5px;">搜索</el-button>
					<el-button icon="el-icon-refresh" size="small" @click="searchReset" style="margin-top: 4px;">重置</el-button>
                </el-form>
			 </div>
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="ERP_FinanceExpenditureTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
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
                     <el-button type=""  v-if="hasButtonPermission('refresh')"size="small">刷新</el-button>
                     <el-button type=""  v-if="hasButtonPermission('batchDelete')" size="small" @click="batchDelete()">批量删除</el-button>
                     <el-button type=""  v-if="hasButtonPermission('print')" size="small" @click="'#printForm'">打印</el-button>
                </template>
            </avue-crud>
            <el-dialog title="表单" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <ERP_FinanceExpenditureForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></ERP_FinanceExpenditureForm>
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
      import ERP_FinanceExpenditureForm from './ERP_FinanceExpenditureForm';
     export default {
         name: "ERP_FinanceExpenditure",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent, MainFixed,ERP_FinanceExpenditureForm,createFlow },
         data() {
              return {computedHeight:0,				 	  
			  btns:[
				 	     'refresh',
				 	     'add',
				 	     'modify',
				 	     'delete',
				 	     'batchDelete',
				 	     'print'
                   ],
                   contentTitle: '其他支出列表',
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1
                   },
                   ids: '',
                   F_BillDate_Date : [],                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   searchParam: {                       F_BillDate_Start: '',
                       F_BillDate_End: '',
                       F_BillDate_Date: '',
                       F_ExpenditureCode: '',
                       F_Manager: '',
                       F_BusinessType: '',
},
                   searchFlag: false,
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
             F_BusinessType_Option : [],                   option:{
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
                               label: '支出编码',
                               prop: 'F_ExpenditureCode',
                           },
                           {
                               sortable: true,
                               label: '单据日期',
                               prop: 'F_BillDate',
							   width: "140"
                           },
                           {
                               sortable: false,
                               label: '经办人',
                               prop: 'F_Manager',
                           },
                           {
                               sortable: false,
                               label: '业务类型',
                               prop: 'F_BusinessType',
                           },
                           {
                               sortable: false,
                               label: '收款单位',
                               prop: 'F_ReceivingUnit',
                           },
                           {
                               sortable: false,
                               label: '业务部门',
                               prop: 'F_BusinessDepartment',
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
                this.getF_BusinessType_Option();
								   },
				mounted(){
					  let themeName = getStore({ name: "themeName" }) || "default";
					  if((themeName == "eveningTheme" && window.screen.width<1805)||(themeName != "eveningTheme" &&window.screen.width<1805)){
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
          getF_BusinessType_Option(){ 
             request({ 
                 url : baseUrl + '/data-items/业务类型/detail', 
                 method : 'get', 
             }).then(res => { 
                 this.F_BusinessType_Option = res.data.data 
             }) 
          }, 
                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/erp_financeexpenditure',
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
                       this.searchParam.F_BillDate_Start = null;
                       this.searchParam.F_BillDate_End = null;
                       this.searchParam.F_BillDate_Date = null;
                       this.F_BillDate_Date = [];
                       this.searchParam.F_ExpenditureCode = null;
                       this.searchParam.F_Manager = null;
                       this.searchParam.F_BusinessType = null;
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
                                     url: baseUrl + "/erp_financeexpenditure/" + val.F_Id,
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
                                 url: baseUrl + "/erp_financeexpenditure/" + this.ids,
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
                   F_BillDate_DateChange(val){
                       this.searchParam.F_BillDate_Start = val[0];
                       this.searchParam.F_BillDate_End = val[1];
                   }
         }
     }
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
@media screen and (max-width:1805px) {
	#printTable /deep/.avue-crud__menu{
		position: static;
	}
	  #printTable /deep/.avue-crud__left{
	  	margin:0px 0px 0px 5px!important;
	  	float: left;
	  }
	}
/deep/ .main-table{
	overflow: hidden;
}
/deep/ .el-table--scrollable-x ::-webkit-scrollbar{
		background-color: hsla(220, 4%, 58%, .3);
	}
/deep/ .el-range-editor--small.el-input__inner{
			height: 27px;
		}
/deep/ .el-upload__tip{
		text-align: center;
		margin-top: -8px;
		}
</style>
