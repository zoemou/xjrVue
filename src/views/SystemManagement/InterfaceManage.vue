<template>
    <div class="main-container">
        <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">

                    <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                              style="width: 200px; margin-right:5px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchInterface">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>

                </div>
            </div>
            <div slot="table" style="height: 100%;">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud :data="interfaceList" :option="option" stripe :page.sync="page"
                           @on-load="onPageLoad" @sort-change="sortChange"
                            @row-click="rowClick" @selection-change="selectionChange" @size-change='sizeChange' @row-dblclick="handleRowDBLClick" style="height: 100%;">
                    <template slot-scope="scope" slot="menuLeft">
                        <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                                   :before-close="handleClose">
                            <div class="baseInfo-form">
                                <el-form :model="baseInfoForm" :rules="rules" ref="baseInfoForm" label-width="70px" :validate-on-rule-change="false">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item :label="$t('interfaceManage.addModal.labelName')" prop="F_Name">
                                                <el-input :placeholder="$t('interfaceManage.addModal.placeholderName')" size="small"
                                                          v-model="baseInfoForm.F_Name"></el-input>
                                            </el-form-item>
											<el-form-item :label="$t('interfaceManage.addModal.labelAddress')" prop="F_Address">
											    <el-input :placeholder="$t('interfaceManage.addModal.placeholderAddress')" size="small"
											              v-model="baseInfoForm.F_Address"></el-input>
											</el-form-item>
                                        </el-col>
                                    </el-row>
								</el-form>
								<avue-crud :data="fieldList" :option="fieldOption" stripe ref="crud" @row-save="handleSave" @row-update="handleUpdate" @row-del="rowDel">
									<template slot="menuRight">
										<div>{{$t('interfaceManage.addModal.menuRight')}}</div>
									</template>
								</avue-crud>
                            </div>
                            <span slot="footer" class="dialog-footer">
                            	<el-button size="mini" @click="cancelBtn()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                                <el-button size="mini" type="primary"
                                           @click="submitBtn()" :loading="flagInerface">{{$t('buttonModule.modalSureBtn')}}</el-button>
                            </span>
                        </el-dialog>
                        <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog">{{$t('buttonModule.addBtn')}}</el-button>
                        <el-button size="small" @click="deleteInterfaceAll">{{$t('buttonModule.batchDeletionBtn')}}</el-button>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" @click="editInterface(scope.row,scope.index)">{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button type="opr-danger" size="mini" @click="deleteInterface(scope.row,scope.index)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                    </template>
                </avue-crud>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../page/main/MainContent";
    import {getInterfaceList,deleteInterface,addInterface,getInterface,updateInterface} from '@/api/systemManagement/interface'
/* 	import {getDbGroup} from '@/api/databasemanage/datasource' */
	import {getDictCateByCode} from '@/api/language/dictionary'
	   import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
	//var fieldTypeList=[]
    export default {
        name: "InterfaceManage",
				mixins: [tableOptionMixin],
        components: {MainContent},
        data() {
            return {
				flagInterface: false,
                contentTitle: '接口列表',
				selectedId:[],
				dialogTitle:"",
                keyword: "",
                interfaceList: [],
				fieldTypeList:[],
                fieldList:[],
                F_Id:'',
				order:{
					order:'desc',
					prop:''
				},
                dialogVisible: false,
                baseInfoForm: {
                    "F_Name": "",
					"F_Address":""                   
                },
				fieldOption:{
					highlightCurrentRow: true,
					stripe: false,
					//addBtn: false,
					maxHeight: 294,
					border: false,
					index: true,
					indexLabel:this.$t('interfaceManage.addModal.tableNumber'),
					align: 'center',
					menuAlign: 'center',
					menuWidth: 150,
					refreshBtn:false,
					columnBtn:false,
					column: [
					    {
					        label: this.$t('interfaceManage.addModal.tableFieldName'),
					        prop: 'fieldName',
							align: 'left',
							rules: [{
								required: true,
								message:this.$t('interfaceManage.addModal.hintFieldName'),
								trigger: "blur"
							}],
							span: 24
					    }, {
					        label: this.$t('interfaceManage.addModal.tableFieldPostil'),
					        prop: 'fieldDescribe',
							align: 'left',
							rules: [{
								required: true,
								message: this.$t('interfaceManage.addModal.hintFieldPostil'),
								trigger: "blur"
							}],
							span: 24
					    }, {
					        label: this.$t('interfaceManage.addModal.tableFieldType'),
					        prop: 'fieldType',
							type: 'select',
							align: 'left',							
							rules: [{
								required: true,
								message:this.$t('interfaceManage.addModal.hintFieldType'),
								trigger: "change"
							}],
							span: 24,
							dicData:[]
					    }
					]
				},			
                page: {
                    pageSize: 20,
                    total: 0,
                    currentPage: 1
                },
                option: {
                    highlightCurrentRow: true,
                    stripe: false,
                    addBtn: false,
                    menuWidth: 150,
					height:'auto',
					calcHeight:150,
                    maxHeight: 'auto',
                    border: false,
					simplePage:true,
                    index: true,
                    indexLabel: this.$t('interfaceManage.addModal.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    delBtn: false,
                    editBtn: false,	
					selection:true,
                    column: [
                        {
                            sortable: true,
                            label:this.$t('interfaceManage.addModal.labelName'),
							minWidth:'95',
                            prop: 'F_Name',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('interfaceManage.addModal.labelAddress'),
							minWidth:'95',
                            prop: 'F_Address',
							align:'left'
                        }
                    ]
                },
                rules: {
                    F_Name: [
                        { required: true, message:this.$t('interfaceManage.addModal.placeholderName'), trigger: 'blur' },
                    ],
					F_Address: [
                        { required: true, message:this.$t('interfaceManage.addModal.placeholderAddress'), trigger: 'blur' },
                    ]
                }
            }
        },
		mounted() {
			this.getDictCateByCode()
		},
        methods: {
					handleRowDBLClick (row, event) {
						if(this.openDoubleClickEdit){
							this.editInterface(row)
						}
					},
            /* 获取列表 */
            getInterfaceList() {
				var searchParam={
				    limit : this.page.currentPage,
				    size : this.page.pageSize,
				    keyword : this.keyword,
				    order : this.order.order,
				    orderfield : this.order.prop
				};
                getInterfaceList(searchParam).then(res => {
					this.page.total= res.data.data.Total;
                    this.interfaceList = res.data.data.Rows
                })
            },
			/* 获取菜单树形数据 */
			getDictCateByCode() {
			    getDictCateByCode('FieldType').then(res => {

					if(res.data.success){
						var list=res.data.data;
						list.forEach((o,i)=>{
							var obj={
								label:o.F_ItemName,
								value:o.F_ItemValue
							}
							this.fieldTypeList.push(obj)
						})
						this.fieldOption.column[2].dicData=[...this.fieldTypeList]
					}
					
			    })
			},
            /* 新增弹窗打开 */
            openDialog() {
                this.dialogVisible = true;
                this.dialogTitle = this.$t('interfaceManage.addModal.modalTitle');
				this.F_Id="";
				this.fieldList=[];
				if (this.$refs['baseInfoForm']!==undefined) {
					this.$refs['baseInfoForm'].resetFields();
				}				
            },
            /* 完成 */
            submitBtn() {
				this.flagInterface = true;
				if (this.F_Id) {
					updateInterface(this.F_Id,this.baseInfoForm).then(() => {
						this.dialogVisible = false;
						this.getInterfaceList();
						this.F_Id="";
					}).finally(() => {
						this.flagInterface = false;
					})
				} else {
					addInterface(this.baseInfoForm).then(() => {
						this.dialogVisible = false;
						this.getInterfaceList();
					}).finally(() => {
						this.flagInterface = false;
					})                          
				}
            },
            /* 编辑 */
            editInterface(row,index) {
                this.dialogVisible = true;
				this.dialogTitle = this.$t('interfaceManage.addModal.editInterface');
				this.F_Id=row.F_Id;
                getInterface(row.F_Id).then(res => {
					this.baseInfoForm=res.data.data;
					this.fieldList=JSON.parse(res.data.data.F_FieldsJson)
				})
            },

            rowClick(row,event,column) {
                this.F_Id=row.F_Id                
            },
            /* 删除 */
            deleteInterface(row,index) {
                this.$confirm(this.$t('deletePrompt.promptContent'),  this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText:  this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
					if(this.selectedId.length<=0) this.selectedId.push(row.F_Id)
	
                    deleteInterface(this.selectedId).then(() => {
						this.selectedId=[]
                        this.getInterfaceList();
                        this.$notify({
                            title:this.$t('deletePrompt.successTitle'),
                            message: this.$t('deletePrompt.successDeleted'),
                            type: 'success'
                        });
                    })
                }).catch(() => {

                });

            },
			selectionChange(list){
				this.selectedId=[];
				list.forEach((o,i)=>{
					this.selectedId.push(o.F_Id)
				})
			},
			/* 批量删除 */
			deleteInterfaceAll() {
				if(this.selectedId.length<=0){
					this.$notify({
					    title:  this.$t('deletePrompt.promptTitle'),
					    message: this.$t('deletePrompt.selectDeleteData'),
					    type: 'warning'
					});
				}else{
					this.$confirm(this.$t('deletePrompt.promptContent'),  this.$t('deletePrompt.promptTitle'), {
					    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
					    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
					    type: 'warning'
					}).then(() => {
						deleteInterface(this.selectedId).then(() => {
							this.selectedId=[];
					        this.getInterfaceList();
					        this.$notify({
					            title: this.$t('deletePrompt.successTitle'),
					            message:this.$t('deletePrompt.successDeleted'),
					            type: 'success'
					        });
					    })
					}).catch(() => {

					});
				}
			},
            /* 关闭弹窗 */
            handleClose() {
				if (this.$refs['baseInfoForm']!==undefined) {
				    this.$refs['baseInfoForm'].resetFields();
				}
                this.dialogVisible = false;
				this.F_Id="";
            },
			cancelBtn(){
				this.dialogVisible = false;
			},
            /* 查询 */
            searchInterface() {
                this.getInterfaceList();
            },
            /* 查询表单重置 */
            searchReset() {
                this.keyword= "";
				this.getInterfaceList();
            },
            
            onPageLoad(page) {
                this.page.currentPage = page.currentPage;
                this.page.pageSize = page.pageSize
                this.getInterfaceList();				
            },
			deleteActInfo(i){
				var temparr=[...this.conditionalForm.frequencyList];
				temparr.splice(i,1);
				this.conditionalForm.frequencyList=temparr;
			},
			sizeChange(page){
				this.page.pageSize = page;
				this.getInterfaceList();
			},
			sortChange(val){
				this.order.order=val.order=="ascending"?"asc":"desc";
				this.order.prop=val.prop;
				this.getInterfaceList();
			},
			rowDel (form,index) {
				this.fieldList.splice(index,1)
				this.baseInfoForm.F_FieldsJson=JSON.stringify(this.fieldList)
			},
			handleSave(form,done,loading){
				this.fieldList.push(form);
				this.baseInfoForm.F_FieldsJson=JSON.stringify(this.fieldList)
				done();
			},
			handleUpdate(form,index,done,loading){	
				this.fieldList.splice(index,1,form)
				this.baseInfoForm.F_FieldsJson=JSON.stringify(this.fieldList)
				done();
				
			}
        }
    }
</script>

<style scoped>
    /* css */
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
	.express-list{
		list-style: none;
		padding-left: 0;
		line-height: 34px;
		margin: 0;
	}
	.express-list li{
		border-bottom: 1px solid #ccc;
	}
	.express-list li:nth-child(2n) {
	    background: #fafafa;
	}
	
	
	div /deep/.el-row >.el-col >.el-form-item{
			margin-bottom:12px!important;
		}
	
	.baseInfo-form /deep/.avue-crud__pagination{
		display: none;
	}	
	@media screen and (max-width: 1370px) {
	    /deep/.el-dialog{
		margin-top:8vh!important;
	   }
	     
	}
   /deep/.el-tag{
			margin: 0px 0px 5px 5px;
		}
/deep/ .avue-crud .avue-crud__tip{
		display: none;
	}		
</style>