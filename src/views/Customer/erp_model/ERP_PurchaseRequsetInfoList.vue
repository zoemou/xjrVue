<template>
    <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
             <div :class="[!searchFlag ? 'searchBox' : '']">
                <el-form label-width="70px"style="display: inline-block; margin-right: 70px;">
                    <el-form-item  label="单据日期" style="display: inline-block;">
                        <el-date-picker size="small"  type="daterange" value-format="yyyy-MM-dd" v-model="F_DocumentDate_Date"   style="width:250px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="F_DocumentDate_DateChange"> </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="单据编号"style="display: inline-block;">
						<el-input v-model="searchParam.F_DocunNumber" size="small" placeholder="请输入单据编号查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="经办人员"style="display: inline-block;">
						<el-input v-model="searchParam.F_ChargePeople" size="small" placeholder="请输入经办人员查询"   style="width:200px" ></el-input>
                    </el-form-item>
					<el-form-item  label="供应商"style="display: inline-block;" label-width="60px">
						<el-select v-model="searchParam.F_DeliveryUnit" filterable clearable style="width:200px"  placeholder="请选择">
							<el-option  v-for="(item,index) in F_DeliveryUnit_Option"  :key="index" :label="item.F_FullName" :value="item.F_Id" >  </el-option>
						</el-select> 
					</el-form-item>
					<el-form-item  label="紧急程度" style="display: inline-block;">
						<el-select v-model="searchParam.F_Emergencylevel" filterable clearable style="width:200px"   placeholder="请选择">
							<el-option  v-for="(item,index) in F_Emergencylevel_Option"  :key="index" :label="item.F_ItemName"  :value="item.F_ItemValue" >  </el-option>
						</el-select> 
					</el-form-item>
					
                 <template v-if="searchFlag">
					  <!-- 展开/收起功能内容 -->
                 </template>
				 <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick" style="margin:4px 0px 0px 5px">搜索</el-button>
				 <el-button icon="el-icon-refresh" size="small" @click="searchReset" style="margin-top:4px;">重置</el-button>
				 <!-- 展开/收起功能按钮 -->
				 <!-- <el-link :underline="false"  @click="() => searchFlag = !searchFlag"  style="margin-left:10px"  >{{ searchFlag ? "收起" : $t("menuManagement.addModal.checkboxOpen")  }}<i :class="[!searchFlag ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i></el-link> -->
                </el-form>
				
			</div> 
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="ERP_PurchaseRequsetInfoTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
                       @on-load="onPageLoad"
                       @sort-change="sortChange" 
					   @row-dblclick="editForm"
                       @current-row-change="handleCurrentRowChange" >
                <template slot-scope="scope" slot="menu">
		  			   <template v-if="scope.row.flowStatus&&scope.row.flowStatus==2">
						  <span v-if="hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" class="form-span-button">{{$t("workFlow.WFChange.approval")}}</span>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
		  		 	   </template>
		  			   <template v-else-if="scope.row.flowStatus&&scope.row.flowStatus==3">
						  <span v-if="hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" class="form-span-button">{{$t("forme.editModal.approvalComplete")}}</span>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click.stop="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
						  <el-button type="opr-primary" size="mini" v-if="hasBtns('modify')&&hasButtonPermission('modify')" @click.stop="editForm(scope.row)">{{$t("crud.editBtn")}}</el-button>
						  <el-button type="opr-danger" size="mini" v-if="hasBtns('delete')&&hasButtonPermission('delete')" @click.stop="deleteForm(scope.row)">{{$t("crud.delBtn")}}</el-button>
		  			   </template>
		  			   <template v-else>
			  			  <el-button type="opr-primary" size="mini" v-if="scope.row.flowStatus&&scope.row.flowStatus==1&&hasBtns('createFormFlow') && hasButtonPermission('createFormFlow')" @click="CreateFormFlow(scope.row)">{{$t("forme.editModal.initiateApproval")}}</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('createDesignFlow') && hasButtonPermission('createDesignFlow')" @click="CreateDesignFlow(scope.row)">{{$t("forme.editModal.createFormFlowBtn")}}</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
			  			  <el-button type="opr-primary" size="mini" v-if="hasBtns('modify')&&hasButtonPermission('modify')" @click="editForm(scope.row)">{{$t("crud.editBtn")}}</el-button>
			  			  <el-button type="opr-danger" size="mini" v-if="hasBtns('delete')&&hasButtonPermission('delete')" @click="deleteForm(scope.row)">{{$t("crud.delBtn")}}</el-button>
					   </template>
                </template>
                 <template slot-scope="scope" slot="menuLeft">
                     <el-button type="primary"  v-if="hasButtonPermission('add')" icon="el-icon-plus" size="small" @click="openForm()">{{$t("crud.addBtn")}}</el-button>
                     <el-button type=""  v-if="hasButtonPermission('batchDelete')" size="small" @click="batchDelete()">{{$t("forme.editModal.batchDeletionBtn")}}</el-button>
                     <el-button type=""  v-if="hasButtonPermission('print')" size="small" @click="'#printForm'">{{$t("editorModule.print")}}</el-button>
                     <el-button type=""  v-if="hasButtonPermission('import')" size="small" @click="excelDialog = true">{{$t("forme.editModal.quickImportBtn")}}</el-button>
                     <el-button type=""  v-if="hasButtonPermission('export')" size="small" @click="tableExport()">{{$t("forme.editModal.quickExportBtn")}}</el-button>
                </template>
            </avue-crud>
            <el-dialog title="表单" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <ERP_PurchaseRequsetInfoForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></ERP_PurchaseRequsetInfoForm>
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
           :action="baseUrl + '/erp_purchaserequsetinfo/import'">
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
    <createFlow v-if="isCreateFlow" formType="2" rowPrimaryKey="F_Id" :UrlAddress="this.$options.name" :createFlowType="createFlowType" :row="scopeRow" :scheme="scheme" @closedCreateFlow="closedCreateFlow"></createFlow>
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
      import ERP_PurchaseRequsetInfoForm from './ERP_PurchaseRequsetInfoForm';
     export default {
         name: "ERP_PurchaseRequsetInfo",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent, MainFixed,ERP_PurchaseRequsetInfoForm,createFlow },
         data() {
              return {computedHeight:32,				 	  
			  btns:[
				 	     'refresh',
				 	     'add',
				 	     'modify',
				 	     'delete',
				 	     'batchDelete',
				 	     'print',
				 	     'import',
				 	     'export',
				 	     'createFormFlow'
                   ],
                   contentTitle: 'ERP_PurchaseRequsetInfo列表',
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1,
                       layout: "total, prev, pager, next, jumper"
                   },
                   ids: '',
                   F_DocumentDate_Date : [],                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   searchParam: {                       F_DocunNumber: '',
                       F_DocumentDate_Start: '',
                       F_DocumentDate_End: '',
                       F_DocumentDate_Date: '',
                       F_ChargePeople: '',
                       F_ApplicationPurposes: '',
                       F_Emergencylevel: '',
                       F_DocumentStatus: '',
},
                   searchFlag: false,
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
                    uploadData: {  F_ModuleId: '' },
                    headers: {   },
                    excelDialog: false,
                    F_DeliveryUnit_Option : [],  
                    F_Emergencylevel_Option : [], 
                   option:{
                       rowKey:'F_Id',
                       highlightCurrentRow: true,
                       stripe: false,
                       addBtn: false,
                       menuWidth: 235,
                       border: false,
                       page: true,
                       selection: false,
                       index: true,
                       indexLabel:"#",
                       align: 'left',
                       menuAlign: 'center',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: false,
                               label: this.$t("单据编码"),
                               prop: 'F_DocunNumber',
							   width: "140"
                           },
                           {
                               sortable: true,
                               label: this.$t("单据日期"),
                               prop: 'F_DocumentDate',
							   width: "140"
                           },
                           {
                               sortable: false,
                               label: this.$t("经办人"),
                               prop: 'F_ChargePeople',
							   width: "80"
                           },
                           {
                               sortable: false,
                               label: this.$t("供应商"),
                               prop: 'F_DeliveryUnit',
                           },
                           {
                               sortable: false,
                               label: this.$t("申请用途"),
                               prop: 'F_ApplicationPurposes',
                           },
                           {
                               sortable: true,
                               label: this.$t("交货日期"),
                               prop: 'F_DeliveryDate',
							   width: "140"
                           },
                           {
                               sortable: true,
                               label: this.$t("预算金额"),
                               prop: 'F_BudgetAmount',
							   minWidth: "100"
                           },
                           {
                               sortable: true,
                               label: this.$t("实际金额"),
                               prop: 'F_ActualAmount',
							   minWidth: "100"
                           },
                           {
                               sortable: false,
                               label: this.$t("紧急程度"),
                               prop: 'F_Emergencylevel',
                           },
                           {
                               sortable: false,
                               label: this.$t("审核状态"),
                               prop: 'F_DocumentStatus',
                           },
                           {
                               sortable: false,
                               label: this.$t("状态"),
                               prop: 'F_InvalidMark',
                           },
                           {
                               sortable: false,
                               label: this.$t("备注"),
                               prop: 'F_Description',
                           },
                           {
                               sortable: false,
                               label: this.$t("信息体"),
                               prop: 'F_CreatorUserId',
                           },
                           {
                               sortable: true,
                               label: this.$t("制单时间"),
                               prop: 'F_CreatorTime',
							    width: "140"
                           },
                       ]
                   }
              }
                   },
                   created() {
                      this.getF_DeliveryUnit_Option();            
                      this.getF_Emergencylevel_Option();   
                      const token = JSON.parse(localStorage.getItem('avue-token'))['content'];
                      this.headers.Authorization = 'Bearer ' + token
                       this.uploadData = { F_ModuleId: this.$route.meta.moduleid };
                   },
				   mounted(){
				   	  let themeName = getStore({ name: "themeName" }) || "default";
				   	  if((themeName == "eveningTheme" && window.screen.width<1750)||(themeName != "eveningTheme" &&window.screen.width<1750)){
				   	    this.computedHeight =60;
				   	  }
				   	  console.log('this.computedHeight',this.computedHeight);
				   	  this.changeBodyHeight();
				   	},
                   methods: {
                         handleCurrentRowChange(row){
                         	this.$refs.ERP_PurchaseRequsetInfo.toggleSelection([row]);
                         },
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
                         getF_DeliveryUnit_Option(){ 
             request({ 
                 url : baseUrl + '/database-links/localDB/datas', 
                 method : 'get', 
                 params : {
                 sql: `	select i.F_Id,F_FullName from erp_inoutunit i where i.F_UniType=1`
                 }
             }).then(res => { 
                 this.F_DeliveryUnit_Option = res.data.data 
             }) 
          }, 
          getF_Emergencylevel_Option(){ 
             request({ 
                 url : baseUrl + '/data-items/Degree/detail', 
                 method : 'get', 
             }).then(res => { 
                 this.F_Emergencylevel_Option = res.data.data 
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
                                    link.setAttribute('download', 'ERP_PurchaseRequsetInfo.xlsx');
                                     document.body.appendChild(link);
                                     link.click();
                                     document.body.removeChild(link);
                             })
                         },
                         upload(){
                            this.$refs['upload'].submit();
                         },
                         successUpload (res) {
                             if(res.code === 0)  {this.$message.success('$this.$t("deletePrompt.importComplete")'); this.getListData(); } else this.$message.error(res.msg);
                         },
                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/erp_purchaserequsetinfo',
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
                       this.searchParam.F_DocunNumber = null;
                       this.searchParam.F_DocumentDate_Start = null;
                       this.searchParam.F_DocumentDate_End = null;
                       this.searchParam.F_DocumentDate_Date = null;
                       this.F_DocumentDate_Date = [];
                       this.searchParam.F_ChargePeople = null;
                       this.searchParam.F_ApplicationPurposes = null;
                       this.searchParam.F_Emergencylevel = null;
                       this.searchParam.F_DocumentStatus = null;
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
                            this.$confirm(this.$t("deletePrompt.promptContent"), this.$t("tip"), {
                              confirmButtonText: this.$t("buttonModule.modalSureBtn"),
                              cancelButtonText: this.$t("editorModule.cancel"),
                              type: "warning",
                             }).then(() => {
                                 request({
                                     url: baseUrl + "/erp_purchaserequsetinfo/" + val.F_Id,
                                     method: "delete",
                                 }).then((res) => {
                                     this.getListData()
                                     this.$notify({
                                      title: this.$t("Notice.hintSuccess"),
                                      message: this.$t("deletePrompt.successDeleted"),
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
                            this.$refs["ERP_PurchaseRequsetInfoTable"].rowExcel()
                            return;
                         },
                           selectionChange(list){
                             this.ids = list.map((x) => x.F_Id).join(',');
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
                                 url: baseUrl + "/erp_purchaserequsetinfo/" + this.ids,
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
                   F_DocumentDate_DateChange(val){
                       this.searchParam.F_DocumentDate_Start = val[0];
                       this.searchParam.F_DocumentDate_End = val[1];
                   },
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
   margin-bottom: 6px;
}
#printTable /deep/.avue-crud__menu{
			position: static;
	}
#printTable /deep/.avue-crud__left{
		  	margin:1px 0px 2px 8px!important;
		  	float: left;
	}
/deep/ .main-table{
	overflow: hidden;
}
/deep/ .el-range-editor--small.el-input__inner{
		height: 27px;
	}	
</style>
