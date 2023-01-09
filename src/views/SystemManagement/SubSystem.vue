<template>
    <div class="main-container">
    <main-content :title="contentTitle" >
        <div slot="search" style="width:100%">
              <!-- 在此处放置搜索内容 -->
             <div class="searchBox">
                <el-form label-width="60px" style="">
                  <el-col :span="14">
                       <el-form-item  :label="$t('subSystem.searchTitle')" style="margin-bottom: 0px;">
								<el-input v-model="searchParam.F_Name" size="small" :placeholder="$t('searchModule.searchPlaceholder')"   style="width:200px;" ></el-input>
                       </el-form-item>
                  </el-col>
                </el-form>
				<div style="float: right;">
				   <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">{{$t('searchModule.searchBtn')}}</el-button>
				   <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
				</div>
			</div>	  
        </div>
        <div slot="table">
        <!-- 在此处放置表格内容 -->
            <avue-crud ref="SubSystemTable" :data="listData" @selection-change="selectionChange"  id="printTable" :option="option" :showColumn="showColumn" :isSaveColumns="true" stripe 
                       @sort-change="sortChange" @current-row-change="handleCurrentRowChange" @row-dblclick="handleRowDoubleClick">
                <template slot-scope="scope" slot="menu">
                    <el-button type="opr-primary" size="mini" v-if="hasBtns('view')&&hasButtonPermission('view')" @click="viewForm(scope.row)">{{$t('tableOperationModule.viewBtn')}}</el-button>
                    <el-button type="opr-primary" size="mini" v-if="hasBtns('modify')&&hasButtonPermission('modify')" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
                    <el-button type="opr-danger" size="mini" v-if="hasBtns('delete')&&hasButtonPermission('delete')" @click="deleteForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                </template>
                 <template  slot="menuLeft">
                     <el-button type="primary"  v-if="hasButtonPermission('add')" icon="el-icon-plus" size="small" @click="openForm()">{{$t('buttonModule.addBtn')}}</el-button>
                     <el-button type="primary"  v-if="hasButtonPermission('batchDelete')" icon="el-icon-delete" size="small" @click="batchDelete()">{{$t('buttonModule.batchDeletionBtn')}}</el-button>
                     <el-button type="primary"  v-if="hasButtonPermission('print')" icon="el-icon-printer" size="small" v-print="'#printTable'">{{$t('subSystem.printBtn')}}</el-button>
                </template>
            </avue-crud>
            <el-dialog v-dialogDrag :title="$t('route.form')" :append-to-body="true" :fullscreen="true" :visible.sync="flag"  :class="isWorkflowForm ? 'work-form-dialog' : ''" :show-close="!isWorkflowForm" >
                <SubSystemForm v-if="flag"  :isEdit="isEdit" :disabled="disabled" @onChange="dialogChange" :keyValue="keyValue"></SubSystemForm>
            </el-dialog>
        </div>
    </main-content>
    </div>
</template>
<script>
     import MainFixed from "@/page/main/MainFixed";
      import authorizeMixin from "@/mixins/authorize";
      import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
      import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
     import MainContent from "@/page/main/MainContent";
      import request from '@/router/axios';
      import { baseUrl } from '@/config/env';
      import { getOrder } from '@/util/util';
      import SubSystemForm from './SubSystemForm';
      import { getSubSystem } from "@/api/system/subSystem";
      import website from '@/config/website';
     export default {
         name: "SubSystem",
         mixins: [authorizeMixin,tableOptionMixin,displayColumnsMixin],
         components: { MainContent, MainFixed,SubSystemForm },
         data() {
              return {
				btns:[
				 	    'refresh',
				 	     'add',
				 	     'modify',
				 	     'delete',
				 	     'batchDelete',
				 	     'print'
                   ],
                   contentTitle: '子系统管理列表',
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
                   option:{
                       rowKey:'F_Id',
                       highlightCurrentRow: true,
                       stripe: false,
                       addBtn: false,
                       menuWidth: 230,
                       border: false,
                       page: false,
                       selection: false,
                       index: true,
                       indexLabel: this.$t('subSystem.tableNumber'),
                       align: 'center',
                       menuAlign: 'center',
                       delBtn: false,
                       editBtn: false,
                       column: [
                           {
                               sortable: true,
                               label:this.$t('subSystem.searchTitle'),
                               prop: 'F_Name',
							   align:'left',
							   formatter:(row)=>{
							   	  return row.F_LgMarkCode?this.$t(row.F_LgMarkCode):row.F_Name
							   },
                           },
                           {
                               sortable: true,
                               label:this.$t('subSystem.tableNCode'),
                               prop: 'F_EnCode',
							   align:'left'
                           },
                           {
                               sortable: true,
                               label:this.$t('subSystem.tableDescription'),
                               prop: 'F_Description',
							   align:'left'
                           },
                           {
                               sortable: true,
                               label:this.$t('subSystem.tableSort'),
                               prop: 'F_SortCode',
							   align:'left'
                           },
                       ]
                   }
              }
                   },
                   created() {
                       this.getListData()
                       /** 工作流  系统表单  相关方法 start*/
                       let self = this;
                       window.parent.openDialog = () => {
                         self.isWorkflowForm = true;
                         self.openForm();
                       };
                         /** 工作流 系统表单  相关方法 end */
                   },
                   methods: {
                        hasDemoEnvironmentSystemItem(id) {
                            // 演示环境下，子系统【应用平台、业务平台】不可编辑不可删除 
                            let arr = [website.applicationPlatformId,website.businessPlatformId];
                            if(website.isTheDemoEnvironment&&arr.includes(id)){
                              return true;
                            }else{
                              return false;
                            }
                          },
					              handleCurrentRowChange(row){
					                  this.$refs.SubSystemTable.toggleSelection([row]);
					              },
                        handleRowDoubleClick(row) {
                            this.editForm(row)
                        },
                         hasBtns(encode){                         	return this.btns.includes(encode);                         },                         /* 获取公司用户数据 */
                         getListData() {
                            request({
                                url: baseUrl + '/subsystem/all',
                                method: 'get',
                                params: this.searchParam
                            }).then(res =>{
                                this.listData = res.data.data;
                                //更新子系统数据
                                getSubSystem()
                                .then(res=>{
                                  if(res.data.code == 0){
                                    let system = res.data.data;
                                    //存储主子系统菜单项
                                    this.$store.commit("SET_ALLSYSTEM", system);
                                  }
                                })
                            })
                         },
                          /* 查询 */
                         searchClick() {
                            this.searchParam.order = null
                            this.searchParam.orderfield = null
                            this.getListData()
                         },
                          /* 查询表单重置 */
                         searchReset() {
                       this.searchParam.F_Name = null;
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
                          if(this.hasDemoEnvironmentSystemItem(val.F_Id)){
                            this.$message('在演示环境下，应用平台与业务平台不可编辑！');
                            return false;
                          }
                           this.flag = true; 
                           this.isEdit = true;
                           this.disabled = false;
                           this.keyValue = val.F_Id; 
                         },
                          /* 打开表单 */
                         openForm(){
                           this.keyValue = null; 
                           this.flag = true; 
                           this.isEdit = true; 
                         },
                          /* 删除 */
                         deleteForm(val) {
                          if(this.hasDemoEnvironmentSystemItem(val.F_Id)){
                            this.$message('在演示环境下，应用平台与业务平台不可删除！');
                            return false;
                          }
                            this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                              confirmButtonText: this.$t('buttonModule.modalSureBtn'),
                              cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                              type: "warning",
                             }).then(() => {
                                 request({
                                     url: baseUrl + "/subsystem/" + val.F_Id,
                                     method: "delete",
                                 }).then((res) => {
                                     this.getListData()
                                     this.$notify({
                                      title:this.$t('deletePrompt.successTitle'),
                                      message:this.$t('deletePrompt.successDeleted'),
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
                                 this.$message.error(this.$t('subSystem.notSelectedError'));
                                 return;
                           }
                             this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                               confirmButtonText:this.$t('buttonModule.modalSureBtn'),
                               cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                               type: "warning",
                             }).then(() => {
                               request({
                                 url: baseUrl + "/SubSystem/" + this.ids,
                                 method: "delete",
                               }).then((res) => {
                                 this.getListData();
                                 this.$notify({
                                   title:this.$t('deletePrompt.successTitle'),
                                   message:this.$t('deletePrompt.successDeleted'),
                                   type: "success",
                                 });
                               });
                             });
                           },
         }
     }
</script>
<style scoped>
.main-container {
	  height: 100% !important;
	  padding: 0 8px;
	}	
.searchBox {
  width: 415px;
  position: absolute;
  z-index: 99;
}
div /deep/ .el-tag{
	margin: 0px 0px 5px 5px;
}
div /deep/ .avue-crud .avue-crud__tip{
		display: none;
	}
</style>
