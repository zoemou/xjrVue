<template>
    <div class="main-container" style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
             <div class="searchBox">
                <el-form label-width="70px" style="display: inline-block; margin-right: 70px;">
                    <el-form-item  label="类别名称" style="display: inline-block;">
						<el-input v-model="searchParam.F_FullName" size="small" placeholder="请输入类别名称查询"   style="width:200px" ></el-input>
                    </el-form-item>
                    <el-form-item  label="类别编号"style="display: inline-block; margin-right: 5px;">
						<el-input v-model="searchParam.F_EnCode" size="small" placeholder="请输入类别编号查询"   style="width:200px" ></el-input>
                    </el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">搜索</el-button>
					<el-button icon="el-icon-refresh" size="small" @click="searchReset">重置</el-button>
                </el-form>
			 </div>
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="GoodsCategoryManageTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
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
                <GoodsCategoryManageForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></GoodsCategoryManageForm>
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
      import GoodsCategoryManageForm from './GoodsCategoryManageForm';
     export default {
         name: "GoodsCategoryManage",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent, MainFixed,GoodsCategoryManageForm,createFlow },
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
                   contentTitle: '商品分类列表',
                   page: {
                       pageSize: 20,
                       total: 0,
                       currentPage: 1
                   },
                   ids: '',
                   listData: [],
                   keyValue: '',
                   flag:false,
                   isEdit: true, // 查看-不显示按钮,
                   disabled: false, // 查看-禁用input,
                   isWorkflowForm:false,//默认值 false
                   searchParam: {                       F_FullName: '',
                       F_EnCode: '',
},
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
                   option:{
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
                       align: 'center',
                       menuAlign: 'left',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: false,
                               label: '类别名称',
                               prop: 'F_FullName',
                           },
                           {
                               sortable: true,
                               label: '类别编号',
                               prop: 'F_EnCode',
							   minWidth: "110"
                           },
                           {
                               sortable: false,
                               label: '描述',
                               prop: 'F_Description',
                           },
                       ]
                   }
              }
                   },
                   created() {
                   },
				   mounted(){
				   	  let themeName = getStore({ name: "themeName" }) || "default";
				   	  if((themeName == "eveningTheme" && window.screen.width<1218)||(themeName != "eveningTheme" &&window.screen.width<1218)){
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
                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/goodscategorymanage',
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
                       this.searchParam.F_FullName = null;
                       this.searchParam.F_EnCode = null;
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
                                     url: baseUrl + "/goodscategorymanage/" + val.F_Id,
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
                                 url: baseUrl + "/goodscategorymanage/" + this.ids,
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
@media screen and (max-width:1218px) {
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

</style>
