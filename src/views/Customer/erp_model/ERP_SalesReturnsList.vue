<template>
    <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
             <div class="searchBox">
                <el-form label-width="70px" style="display: inline-block; margin-right: 70px;">
                    <el-form-item  label="退货单号" style="display: inline-block;">
						<el-input v-model="searchParam.F_SalesReturnCode" size="small" placeholder="请输入退货单号查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="退货日期" style="display: inline-block;">
                        <el-date-picker size="small"  type="daterange" value-format="yyyy-MM-dd" v-model="F_ReturnsDate_Date"   style="width:250px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="F_ReturnsDate_DateChange"> </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="客户名称" style="display: inline-block; margin-right: 5px;">
						<el-select v-model="searchParam.F_SalesOutBandId" filterable clearable style="width:200px"  placeholder="请选择">
							<el-option  v-for="(item,index) in F_SalesOutBandId_Option"  :key="index" :label="item.F_FullName" :value="item.F_Id" >  </el-option>
						</el-select> 
                   </el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick" style="margin-top: 4px;">搜索</el-button>
					<el-button icon="el-icon-refresh" size="small" @click="searchReset" style="margin-top: 4px;">重置</el-button>
                </el-form>
			</div>
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="ERP_SalesReturnsTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
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
                     <el-button type=""  v-if="hasButtonPermission('import')" size="small" @click="excelDialog = true">快速导入</el-button>
                     <el-button type=""  v-if="hasButtonPermission('export')" size="small" @click="tableExport()">快速导出</el-button>
                     <el-button type=""  v-if="hasButtonPermission('viewInventory')" size="small">查看库存</el-button>
                </template>
            </avue-crud>
            <el-dialog title="表单" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <ERP_SalesReturnsForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></ERP_SalesReturnsForm>
            </el-dialog>
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
           :action="baseUrl + '/erp_salesreturns/import'">
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
      import ERP_SalesReturnsForm from './ERP_SalesReturnsForm';
     export default {
         name: "ERP_SalesReturns",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent, MainFixed,ERP_SalesReturnsForm,createFlow },
         data() {
              return {computedHeight:0,				 	  
			  btns:[
				 	     'refresh',
				 	     'add',
				 	     'modify',
				 	     'delete',
				 	     'batchDelete',
				 	     'print',
				 	     'import',
				 	     'export',
				 	     'createDesignFlow',
				 	     'createFormFlow',
				 	     'delete',
				 	     'viewInventory'
                   ],
                   contentTitle: '销售退货列表',
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1
                   },
                   ids: '',
                   F_ReturnsDate_Date : [],                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   searchParam: {                       F_ReturnsDate_Start: '',
                       F_ReturnsDate_End: '',
                       F_ReturnsDate_Date: '',
                       F_SalesOutBandId: '',
                       F_SalesReturnCode:''
},
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
                    uploadData: {  F_ModuleId: '' },
                    headers: {   },
                    excelDialog: false,
             F_SalesOutBandId_Option : [],                   option:{
                       rowKey:'F_Id',
                       highlightCurrentRow: true,
                       stripe: false,
                       addBtn: false,
                       menuWidth:265,
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
                               label: '销售退货单号',
                               prop: 'F_SalesReturnCode',
                           },
                           {
                               sortable: true,
                               label: '退货日期',
                               prop: 'F_ReturnsDate',
							   width: "140"
                           },
                           {
                               sortable: false,
                               label: '经办人员',
                               prop: 'F_ChargePeople',
                           },
                           {
                               sortable: false,
                               label: '销售出库',
                               prop: 'F_SalesOrderId',
                           },
                           {
                               sortable: false,
                               label: '客户名称',
                               prop: 'F_SalesOutBandId',
                           },
                           {
                               sortable: false,
                               label: '默认仓库',
                               prop: 'F_WarehouseId',
                           },
                          //  {
                          //      sortable: true,
                          //      label: '审核状态',
                          //      prop: 'F_AuditMark',
                          //  },
                          //  {
                          //      sortable: true,
                          //      label: '状态',
                          //      prop: 'F_InvalidMark',
                          //  },
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
                           {
                               sortable: false,
                               label: '备注',
                               prop: 'F_Description',
                           },
                       ]
                   }
              }
                   },
                   created() {
                this.getF_SalesOutBandId_Option();                      const token = JSON.parse(localStorage.getItem('avue-token'))['content'];
                      this.headers.Authorization = 'Bearer ' + token
                       this.uploadData = { F_ModuleId: this.$route.meta.moduleid };
                   },
				   mounted(){
				   	  let themeName = getStore({ name: "themeName" }) || "default";
				   	  if((themeName == "eveningTheme" && window.screen.width<1760)||(themeName != "eveningTheme" &&window.screen.width<1760)){
				   	    this.computedHeight =32;
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
          getF_SalesOutBandId_Option(){ 
             request({ 
                 url : baseUrl + '/database-links/localDB/datas', 
                 method : 'get', 
                 params : {
                 sql: `select t.F_Id,t.F_FullName from erp_inoutunit t where t.F_UniType=2`
                 }
             }).then(res => { 
                 this.F_SalesOutBandId_Option = res.data.data 
             }) 
          }, 
                         download(){
                             request({
                                 url: baseUrl + '/excel-import/download/' + this.$route.meta.moduleid,
                                 method: 'get',
                                 responseType: 'blob'
                              }).then(res =>{                  
                                    let url = window.URL.createObjectURL(new Blob([res.data],{type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
                                    let link = document.createElement('a');
                                    link.style.display = 'none';
                                    link.href = url;
                                    link.setAttribute('download', 'ERP_SalesReturns.xlsx');
                                     document.body.appendChild(link);
                                     link.click();
                                     document.body.removeChild(link);
                             })
                         },
                         upload(){
                            this.$refs['upload'].submit();
                         },
                         successUpload (res) {
                             if(res.code === 0)  {this.$message.success('导入完成！'); this.getListData(); } else this.$message.error(res.msg);
                         },
                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/erp_salesreturns',
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
                       this.searchParam.F_ReturnsDate_Start = null;
                       this.searchParam.F_ReturnsDate_End = null;
                       this.searchParam.F_ReturnsDate_Date = null;
                       this.searchparam.F_SalesReturnCode=null;
                       this.F_ReturnsDate_Date = [];
                       this.searchParam.F_SalesOutBandId = null;
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
                                     url: baseUrl + "/erp_salesreturns/" + val.F_Id,
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
                          /* 导出 */
                          tableExport(){
                            this.$refs["ERP_SalesReturnsTable"].rowExcel()
                            return;
                         },
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
                                 url: baseUrl + "/erp_salesreturns/" + this.ids,
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
                   F_ReturnsDate_DateChange(val){
                       this.searchParam.F_ReturnsDate_Start = val[0];
                       this.searchParam.F_ReturnsDate_End = val[1];
                   },
         }
     }
</script>
<style scoped>
.searchBox {
   display: inline-block;
   margin-bottom: 6px;
   top:3px!important;
}

@media screen and (max-width:1760px) {
	#printTable /deep/.avue-crud__menu{
		min-height: 34px;
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