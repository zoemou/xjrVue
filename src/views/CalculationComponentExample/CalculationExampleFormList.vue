<template>
    <div class="main-container"  :class="wrap?'main-wrap-container':'main-no-wrap-container'" id="search-mixin-id">
    <main-content :title="contentTitle" >
        <div slot="search"  v-if="showSearchBox">
          <SearchBox 
            v-if="showSearchBox"
            :searchParamsList="searchParamsList" 
            :searchParam.sync="searchParam" 
            @searchBoxParams="searchClick" 
            @searchReset="searchReset" 
            ></SearchBox> 
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="CalculationExampleFormTable" :data="listData" :showColumn="showColumn" :isSaveColumns="true" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
                       @on-load="onPageLoad"
                       @row-dblclick="handleRowDBLClick"
                       @sort-change="sortChange" 
                       @current-row-change="handleCurrentRowChange" >
                <template slot-scope="scope" slot="menu">
		  			   <template v-if="scope.row.flowStatus&&scope.row.flowStatus==2">
						  <span v-if="hasBtns('calculationexampleform:createFormFlow') && hasButtonPermission('calculationexampleform:createFormFlow')" class="form-span-button">{{$t("workFlow.WFChange.approval")}}</span>
						  <el-button type="opr-primary" size="mini"  icon="el-icon-view"  v-if="hasBtns('calculationexampleform:view')&&hasButtonPermission('calculationexampleform:view')" @click="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
		  		 	   </template>
		  			   <template v-else-if="scope.row.flowStatus&&scope.row.flowStatus==3">
						  <span v-if="hasBtns('calculationexampleform:createFormFlow') && hasButtonPermission('calculationexampleform:createFormFlow')" class="form-span-button">{{$t("forme.editModal.approvalComplete")}}</span>
						  <el-button type="opr-primary" size="mini"  icon="el-icon-view"  v-if="hasBtns('calculationexampleform:view')&&hasButtonPermission('calculationexampleform:view')" @click.stop="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
						  <el-button type="opr-primary" size="mini"  icon="el-icon-edit" v-if="hasBtns('calculationexampleform:modify')&&hasButtonPermission('calculationexampleform:modify')" @click.stop="editForm(scope.row)">{{$t("crud.editBtn")}}</el-button>
						  <el-button type="opr-primary" size="mini"  icon="el-icon-delete" v-if="hasBtns('calculationexampleform:delete')&&hasButtonPermission('calculationexampleform:delete')" @click.stop="deleteForm(scope.row)">{{$t("crud.delBtn")}}</el-button>
		  			   </template>
		  			   <template v-else>
			  			  <el-button type="opr-primary" size="mini" icon="el-icon-guide" v-if="scope.row.flowStatus&&scope.row.flowStatus==1&&hasBtns('calculationexampleform:createFormFlow') && hasButtonPermission('calculationexampleform:createFormFlow')" @click="CreateFormFlow(scope.row)">{{$t("forme.editModal.initiateApproval")}}</el-button>
			  			  <el-button type="opr-primary" size="mini" icon="el-icon-guide" v-if="hasBtns('calculationexampleform:createDesignFlow') && hasButtonPermission('calculationexampleform:createDesignFlow')" @click="CreateDesignFlow(scope.row)">{{$t("forme.editModal.createFormFlowBtn")}}</el-button>
			  			  <el-button type="opr-primary" size="mini"  icon="el-icon-view"  v-if="hasBtns('calculationexampleform:view')&&hasButtonPermission('calculationexampleform:view')" @click="viewForm(scope.row)">{{$t("crud.viewBtn")}}</el-button>
			  			  <el-button type="opr-primary" size="mini"  icon="el-icon-edit" v-if="hasBtns('calculationexampleform:modify')&&hasButtonPermission('calculationexampleform:modify')" @click="editForm(scope.row)">{{$t("crud.editBtn")}}</el-button>
			  			  <el-button type="opr-primary" size="mini"  icon="el-icon-delete" v-if="hasBtns('calculationexampleform:delete')&&hasButtonPermission('calculationexampleform:delete')" @click="deleteForm(scope.row)">{{$t("crud.delBtn")}}</el-button>
					   </template>
                </template>
                 <template slot="menuLeft">
                     <el-button type="primary"  v-if="hasButtonPermission('calculationexampleform:add')" icon="el-icon-plus" size="small" @click="openForm()">{{$t("crud.addBtn")}}</el-button>
                     <el-button type="primary"  v-if="hasButtonPermission('calculationexampleform:batchDelete')" icon="el-icon-delete" size="small" @click="batchDelete()">{{$t("forme.editModal.batchDeletionBtn")}}</el-button>
                     <el-button type="primary"  v-if="hasButtonPermission('calculationexampleform:print')" icon="el-icon-printer" size="small" @click="printForm">{{$t("editorModule.print")}}</el-button>
                </template>
            </avue-crud>
            <el-dialog title="表单"  v-dialogDrag :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <CalculationExampleFormForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></CalculationExampleFormForm>
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
      import tableSearchMixin from "@/mixins/tableSearch"; //table 搜索 
      import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存 
     import MainContent from "@/page/main/MainContent";
      import request from '@/router/axios';
      import { baseUrl } from '@/config/env';
      import { getOrder } from '@/util/util';
      import CalculationExampleFormForm from './CalculationExampleFormForm';
     export default {
         name: "CalculationExampleForm",
         mixins: [authorizeMixin,tableOptionMixin,tableSearchMixin,displayColumnsMixin,schemeMixins],
         components: { MainContent, MainFixed,CalculationExampleFormForm,createFlow },
         data() {
              return {
				 	  btns:[
				 	     'calculationexampleform:refresh',
				 	     'calculationexampleform:add',
				 	     'calculationexampleform:view',
				 	     'calculationexampleform:modify',
				 	     'calculationexampleform:delete',
				 	     'calculationexampleform:batchDelete',
				 	     'calculationexampleform:print'
                   ],
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1,
                       layout: "total, prev, pager, next, jumper"
                   },
                   ids: '',
                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   defaultOrderfield:'',//默认排序字段
                   defaultOrder:'',//默认排序
                   searchParam: {},
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
                   option:{
                       rowKey:'F_Id',
                       highlightCurrentRow: true,
                       stripe: true,
                       addBtn: false,
                       tip:false,
                       menuWidth: 320,
                       border: true,
                       page: true,
                       selection: true,
                       index: true,
                       menu: false,
                       indexLabel: this.$t('custmerForm.tableNumber'),
                       align: 'center',
                       menuAlign: 'left',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: true,
                               label: this.$t("单行文本"),
                               prop: 'field100781c',
                               overHidden: true,
                           },
                           {
                               sortable: true,
                               label: this.$t("成交金额"),
                               prop: 'field101800c',
                               overHidden: true,
                           },
                           {
                               sortable: true,
                               label: this.$t("优惠折扣"),
                               prop: 'field107f8cb',
                               overHidden: true,
                           },
                           {
                               sortable: true,
                               label: this.$t("优惠金额"),
                               prop: 'field10260ca',
                               overHidden: true,
                           },
                       ]
                   }
              }
                   },
                   created() {
                       //是否有编辑 查看 删除 发起流程 发起临时流程权限 无则为操作列不显示
                       let oprBtns = ['calculationexampleform:modify','calculationexampleform:view','calculationexampleform:delete','calculationexampleform:createFormFlow','calculationexampleform:createDesignFlow'];
                       let intersection = this.btns.filter((v) => oprBtns.includes(v)); 
                       if(intersection.length>0){
                       	this.option.menu =  true
                       }else{
                       	this.option.menu = false
                       }
                       let querySearchData = [
                       	{ 
                       		name: '单行文本', 
                       		DateField: '', 
                       		field: 'field100781c', 
                       		tag: 'el-input', 
                       		avueType: 'input-tip', 
                       		lgmark: '', 
                       	}, 
                       	{ 
                       		name: '成交金额', 
                       		DateField: '', 
                       		field: 'field101800c', 
                       		tag: 'el-input', 
                       		avueType: 'input', 
                       		lgmark: '', 
                       		isFinance: true,
                       	}, 
                       	{ 
                       		name: '优惠折扣', 
                       		DateField: '', 
                       		field: 'field107f8cb', 
                       		tag: 'el-input', 
                       		avueType: 'input', 
                       		lgmark: '', 
                       		isFinance: true,
                       	}, 
                       	{ 
                       		name: '优惠金额', 
                       		DateField: '', 
                       		field: 'field10260ca', 
                       		tag: 'el-input', 
                       		avueType: 'input', 
                       		lgmark: '', 
                       		isFinance: true,
                       	}, 

                       ]
                       this.getSystemSearchList(querySearchData);
                       if(this.btns.length>0){
                       	let tempBtns =  this.btns.concat(oprBtns).filter((v) => this.btns.includes(v) && !oprBtns.includes(v));
                       	if(tempBtns.length>0){
                       		this.searchBtns  = [...new Set([...tempBtns])];
                       	}
                       }
                   },
                   methods: {
                         handleRowDBLClick (row, event) {
                         	if(this.hasBtns('calculationexampleform:modify')&&this.hasButtonPermission('calculationexampleform:modify')&&this.openDoubleClickEdit){
                         		this.editForm(row)
                         	}
                         },
                         handleCurrentRowChange(row){
                         	this.$refs.CalculationExampleFormTable.toggleSelection([row]);
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
                         /* 获取公司用户数据 */
                         getListData() {
                         	if(!this.searchParam.order){
                         		this.searchParam.orderfield = this.defaultOrderfield;
                         		this.searchParam.order = this.defaultOrder;
                         	}
                            let params = this.changeSearchParams();
                            request({
                                url: baseUrl + '/calculationexampleform',
                                method: 'get',
                                params: params
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
                           this.disabled = false;
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
                                     url: baseUrl + "/calculationexampleform/" + val.F_Id,
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
                         	if(data.order){
                         		let order= getOrder(data.order);
                         		this.searchParam.order = order;
                         		this.searchParam.orderfield = data.prop;
                         	}else{
                         		this.searchParam.order = this.defaultOrder;
                         		this.searchParam.orderfield = this.defaultOrderfield;
                         	}
                         	this.getListData()
                         },
                          /* 弹窗回调 */
                          dialogChange(b){
                              this.flag = false;
                              this.$nextTick(()=>{
                              this.getListData();
                         })},
                          /* 查询 */
                           searchClick(params) {
                            this.page.currentPage=1;
                            this.searchParam.limit = 1;
                            this.searchParam = params;
                            this.getListData()
                         },
                           /* 查询表单重置 */
                           searchReset() {
                            for (const key in this.searchParam) {
                                 if(this.searchParam[key]){
                                     this.searchParam[key] = null;
                                 }
                            }
                            this.page.currentPage=1;
                            this.searchParam.limit = 1;
                             this.getListData();
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
                                 url: baseUrl + "/calculationexampleform/" + this.ids,
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
         }
     }
</script>
<style scoped>
.searchBox {
   width: calc(100% - 218px);
   display: inline-block;
}
.main-container{
   height: 100%!important;
   padding: 0 8px!important;
}
div /deep/ .custom-tree-node span{
   font-size: 14px;
   padding-left: 10px;
}
div /deep/ .custom-tree-node i{
   font-size: 12px;
}
div /deep/ .el-dialog__body{
height: 70vh;
overflow: scroll;
}
</style>
