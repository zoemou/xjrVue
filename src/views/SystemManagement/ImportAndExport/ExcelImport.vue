<template>
    <div class="main-container">
        <main-fixed :title="fixedTitle">
            <div slot="list">
                <!-- 在此处放置左侧列表内容 -->
                <!-- 菜单树形 -->
                <el-tree :data="menuTree" :props="defaultProps" node-key="F_ModuleId" ref="cTree"
                         :default-expand-all="false"  @node-click="handleNodeClick">
				</el-tree>
            </div>
        </main-fixed>
        <main-content :title="contentTitle+fullName" :paddingLeft="205" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box" style="right: 8px;">

                    <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                              style="width: 200px; margin-right: 5px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchMenu">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>

                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud ref="cuTable" v-if="F_ModuleId" :data="menuTable" :option="option" stripe 
				@on-load="onPageLoad" @sort-change="sortChange" @size-change='sizeChange' @row-click="rowClick" @row-dblclick="handleRowDBLClick">
                    <template slot-scope="scope" slot="menuLeft">                       
                        <el-button type="primary" icon="el-icon-plus" size="small" @click="openForm()">{{$t('buttonModule.addBtn')}}
                        </el-button>
						<el-button size="small" @click="startTask">{{$t('buttonModule.enableBtn')}}</el-button>
						<el-button size="small" @click="stopTask">{{$t('buttonModule.deactivateBtn')}}</el-button>						
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" icon="el-icon-edit" @click="editForm(scope.row,scope.index)">{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" icon="el-icon-delete" @click="deleteForm(scope.row,scope.index)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                    </template>
                </avue-crud>
				<el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body='true' :visible.sync="dialogVisible" width="80%"
				           :before-close="handleClose" style="padding: 10px 20px;">
					<ImportForm :parameValue="F_ModuleId" ref="importform"></ImportForm>
				    <span slot="footer" class="dialog-footer">
						<el-button size="mini" @click="cancelForm()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
				        <el-button size="mini" type="primary"
				                   @click="confirmBtn()">{{$t('buttonModule.modalSureBtn')}}</el-button>
				    </span>
				</el-dialog>
            </div>
        </main-content>


    </div>
</template>

<script>
    import MainFixed from "../../../page/main/MainFixed";
    import MainContent from "../../../page/main/MainContent";
	import ImportForm from "./ImportForm";
    import {FormatTree} from "../../../util/util.js";

    import {getMenuTree} from '@/api/systemManagement/menu'
	import {getImportList,startImport,stopImport,deleteImport,addImport,getImportInfo} from '@/api/systemManagement/importAndExport'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    export default {
        name: "ExcelImport",
        mixins: [tableOptionMixin],
        components: {MainContent, MainFixed, ImportForm},
        data() {
			const _this = this;  
            return {
                fixedTitle: this.$t('importAndExport.excelImport.fixedTitle'),
                contentTitle: '功能信息 - ',
				dialogTitle:'',
				fullName:"",
                menuTree: [],
                menuTable: [],
				taskId:'', //导入配置id
                menuForm: {
					F_EnCode:'',
                    F_ModuleId: "",
					F_ParentId:"",
                    F_Icon: "",
                    F_UrlAddress: "",
                    F_AllowExpand: 0,
					F_EnabledMark:1,
                    F_IsMenu: 1,
                    F_Target: "",
                    F_IsPublic: 0,
                    F_FullName: "",
                    children:[],
					F_Description:""
                },                
                F_ModuleId : '',
                keyword : null,
				order:{
					order:'desc',
					prop:''
				},
				page: {
				    pageSize: 20,
				    total: 0,
				    currentPage: 1
				},
                defaultProps: {
                    children: 'children',
                    label: 'F_FullName'
                },
                dialogVisible: false,
                option: {
                    highlightCurrentRow: true,
                    stripe: false,
                    addBtn: false,
                    menuWidth: 150,
                    border: false,
                    index: true,
                    indexLabel:this.$t('importAndExport.excelImport.tableNumber'),
                    align: 'center',
					simplePage:true,
                    menuAlign: 'center',
                    delBtn: false,
                    editBtn: false,
                    column: [
                        {
                            sortable: true,
                            label:this.$t('importAndExport.excelImport.tableName'),
                            prop: 'F_Name',
							minWidth:'95',
							align:'left',
                        }, {
                            sortable: true,
                            label:this.$t('importAndExport.excelImport.tableFunction'),
                            prop: 'F_ModuleName',
							minWidth:'95',
							align:'left',
                        }, {
                            sortable: true,
                            label: this.$t('importAndExport.excelImport.tableBtn'),
                            prop: 'F_BtnName',
							width:'100',
							align:'left',
                        }, {
							sortable: true,
                            label: this.$t('importAndExport.excelImport.tableStatus'),
							width:'80',
							align:'left',
                            prop: 'F_EnabledMark',
                            formatter: function (row) {
                                return row.F_EnabledMark === 1 ?_this.$t('custmerForm.tableEnable') : _this.$t('buttonModule.deactivateBtn'); 
                            }
                        }, {
							sortable: true,
                            label:this.$t('importAndExport.excelImport.tableFounder'),
							width:'100',
							align:'left',
                            prop: 'F_CreateUserName'
                        }, {
							sortable: true,
                            label:this.$t('importAndExport.excelImport.tableCreateTime'),
							width:'140',
							align:'left',
                            prop: 'F_CreateDate'
                        }
                    ]
                },				
            }
        },
        mounted() {
            this.getMenuTree();
        },        
        methods: {
            handleRowDBLClick (row, event) {
                if(this.openDoubleClickEdit){
                    this.editForm(row)
                }
            },
            findMenu(arry = [], id) {
                    let obj = {};
                    arry.forEach(item => {
                        if (item.F_ModuleId == id) {
                            obj = item;
                        } else {
                            let o = this.findMenu(item.children, id);
                            if (JSON.stringify(o) != "{}") {
                                obj = o;
                            }
                        }
                    });
                    return obj;
                },
            /* 获取菜单树形数据 */
            getMenuTree() {
                getMenuTree().then(res => {
					let allMenu = res.data.data || null;
                    if (!allMenu) return;
                    this.menuTree = allMenu.mainSystemModuleList;
                    allMenu.subSystemModuleList?.map(item => {
                        item["F_FullName"] = item.F_Name;
                        item["id"] = item.F_Id;
                    });
                    if (allMenu?.subSystemModuleList?.length) {
                        let subMenu = {
                            F_FullName: "子系统",
                            children: allMenu.subSystemModuleList
                        };
                        this.menuTree.push(subMenu);
                    }
                    this.F_ModuleId =
                        this.F_ModuleId || allMenu.mainSystemModuleList[0].F_ModuleId;
                    this.handleNodeClick(this.findMenu(this.menuTree, this.F_ModuleId));
                    /* 左侧树形菜单默认选中第一个 */
                    this.$nextTick(function() {
                        this.$refs.cTree.setCurrentKey(this.F_ModuleId);
                    });
                })
            },
            /* 选择树形菜单加载菜单信息 */
            handleNodeClick(data) {				
                this.keyword = null;                                          
                this.F_ModuleId = data.F_ModuleId;
				this.fullName=data.F_FullName;
				this.getImportList()
            },
            /* 新增*/
            openForm() {
                this.dialogVisible = true;
				this.taskId="";
				this.dialogTitle=this.$t('importAndExport.addQuickExport');
				this.$nextTick(function () {
					this.$refs['importform'].getMenuButton()
				})
            },
            /* 获取导入列表 */
            getImportList() {
				var searchParam={
				    limit : this.page.currentPage,
				    size : this.page.pageSize,
				    keyword : this.keyword,
				    order : this.order.order,
				    orderfield : this.order.prop,
					F_ModuleId:this.F_ModuleId
				};
                getImportList(searchParam).then(res => {
                    this.menuTable = res.data.data.Rows;
                })
            },
			startTask(){
				if(this.taskId){
					startImport(this.taskId).then(res => {
						if(res.data.success){
							this.getImportList();
							this.taskId="";
						}else{
							this.$notify({
							    title: this.$t('deletePrompt.promptTitle'),
							    message: this.$t('deletePrompt.startFailure'),
							    type: 'warning'
							});
						}
					})
				}else{
					this.$notify({
					    title: this.$t('deletePrompt.promptTitle'),
					    message:this.$t('deletePrompt.operationHint'),
					    type: 'warning'
					});
				}
			},
			stopTask(){
				if(this.taskId){
					stopImport(this.taskId).then(res => {
						if(res.data.success){
							this.getImportList();
							this.taskId="";
						}else{
							this.$notify({
							    title:this.$t('deletePrompt.promptTitle'),
							    message: this.$t('deletePrompt.stopFailure'),
							    type: 'warning'
							});
						}
					})
				}else{
					this.$notify({
					    title:this.$t('deletePrompt.promptTitle'),
					    message:this.$t('deletePrompt.operationHint'),
					    type: 'warning'
					});
				}
			},
			rowClick(row,event,column) {
			    this.taskId=row.F_Id                
			},
            /* 取消弹窗 */
            cancelForm() {
                this.dialogVisible = false
            },
            /* 关闭弹窗 */
            handleClose(done) {
                done();
            },
            /* 编辑弹窗触发 */
            confirmBtn() {
				var obj=this.$refs.importform.getChildData()
				if(obj){
					obj.import.f_ModuleId=this.F_ModuleId;
					this.dialogVisible=false;
					addImport(obj).then(res => {
						if(res.data.success){
							this.getImportList();
						}
					})
				}
            },
            /* 表格编辑 */
            editForm(row,index) {
                this.dialogVisible = true
                this.dialogTitle=this.$t('importAndExport.editQuickExport');
				getImportInfo(row.F_Id).then(res=>{
					
				})
            },
            /* 表格删除 */
            deleteForm(row,index) {
                this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText:this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    deleteImport(row.F_Id).then(() => {
						this.getImportList();
                        this.$notify({
                            title:this.$t('deletePrompt.successTitle'),
                            message: this.$t('deletePrompt.successDeleted'),
                            type: 'success'
                        });
                    })
                }).catch(() => {

                });

            },
                        
            /* 查询 */
            searchMenu() {
                this.getImportList();
            },
            /* 查询表单重置 */
            searchReset() {
                this.keyword = null;
				this.getImportList();
            },
            /* 分页 */
            onPageLoad(page) {
                this.page.currentPage = page.currentPage;
            	this.page.pageSize = page.pageSize
            	this.getImportList();
            },
            sizeChange(page){
            	this.page.pageSize = page;
            	this.getImportList();
            },
            sortChange(val){
            	this.order.order=val.order=="ascending"?"asc":"desc";
            	this.order.prop=val.prop;
            	this.getImportList();
            }
        }
    }
</script>

<style scoped>
    /* reset css */
    /deep/ .companiesuser-form .el-form-item {
        margin-bottom: 12px;
    }
  /deep/ .el-table--border{
	margin-top: 12px;
}
    /* css */
    .main-container {
        height: 100%;
        padding: 0 10px;
    }
	.el-form--inline .el-form-item{
		margin:10px 0 10px 0 !important;
	}

@media screen and (max-width: 1370px) {
   div/deep/ .el-dialog{
	margin-top: 10vh!important;
   }
  
}
 /deep/ .search-box{width: 350px;}
</style>