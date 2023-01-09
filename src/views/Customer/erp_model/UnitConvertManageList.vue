<template>
    <div class="main-container"  style="height: 100%; padding:0 8px;">
    <main-content :title="contentTitle" >
        <div slot="search">
              <!-- 在此处放置搜索内容 -->
            <!-- <div class="searchBox">
                <el-form label-width="60px">
                    <el-row :gutter="20">
                  </el-row>
                </el-form>
			</div> -->
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="UnitConvertManageTable" :data="listData" @selection-change="selectionChange" id="printTable" :option="option" stripe :page.sync="page"
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
                </template>
            </avue-crud>
            <el-dialog title="表单" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <UnitConvertManageForm ref="xtForm"  v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></UnitConvertManageForm>
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
           :action="baseUrl + '/unitconvertmanage/import'">
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
      import authorizeMixin from "@/mixins/authorize";
      import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
     import MainContent from "@/page/main/MainContent";
      import request from '@/router/axios';
      import { baseUrl } from '@/config/env';
      import { getOrder } from '@/util/util';
      import UnitConvertManageForm from './UnitConvertManageForm';
     export default {
         name: "UnitConvertManage",
         mixins: [authorizeMixin,tableOptionMixin,schemeMixins],
         components: { MainContent,UnitConvertManageForm,createFlow },
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
				 	     'export'
                   ],
                   contentTitle: '单位管理列表',
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
                   searchParam: {},
                   defaultProps: {
                       children: 'children',
                       label: ''
                   },
                    uploadData: {  F_ModuleId: '' },
                    headers: {   },
                    excelDialog: false,
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
                       align: 'left',
                       menuAlign: 'center',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: false,
                               label: '单位名称',
                               prop: 'F_FullName',
                           },
                           {
                               sortable: true,
                               label: '单位编号',
                               prop: 'F_EnCode',
							   minWidth: "120"
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
                      const token = JSON.parse(localStorage.getItem('avue-token'))['content'];
                      this.headers.Authorization = 'Bearer ' + token
                       this.uploadData = { F_ModuleId: this.$route.meta.moduleid };
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
                                    link.setAttribute('download', 'UnitConvertManage.xlsx');
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
                                url: baseUrl + '/unitconvertmanage',
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
                                     url: baseUrl + "/unitconvertmanage/" + val.F_Id,
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
                            this.$refs["UnitConvertManageTable"].rowExcel()
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
                                 url: baseUrl + "/unitconvertmanage/" + this.ids,
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
/deep/ .el-upload__tip{
	text-align: center;
	margin-top: -8px;
}
.searchBox {
   display: inline-block;
   margin-bottom: 6px;
}
#printTable /deep/ .avue-crud__left{
	float: left;
	margin: 7px 10px 2px 8px;
}

/deep/ .main-table{
	overflow: hidden;
}

</style>

