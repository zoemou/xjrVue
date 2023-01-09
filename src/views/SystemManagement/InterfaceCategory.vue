<template>
    <div class="main-container">
        <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 搜索内容 -->
                <div class="search-box">
					<el-form :inline="true">
						<el-form-item :label="$t('interfaceClassName')" style="margin-left: 10px;">
							<el-input v-model="keyword" size="small" :placeholder="$t('enterInterfaceCategoryNameQuery')"
							style="width: 200px; margin-right: 5px"></el-input>
						</el-form-item>
						<el-button type="primary" icon="el-icon-search" size="small" @click="searchInterface">{{$t('searchModule.searchBtn')}}</el-button>
						<el-button type="primary" icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
					</el-form>
                </div>
            </div>
            <div slot="table" style="height: 100%;">
                <avue-crud 
                    :data="interfaceTable" 
                    :option="option" 
                    stripe 
                    :page.sync="page" 
                    :showColumn="showColumn"
                    :isSaveColumns="true"
                    @on-load="onPageLoad" 
                    @size-change="sizeChange" 
                    @row-click="rowClick" 
                    @row-dblclick="handleRowDBLClick" 
                    style="height: 100%;"
                >
                    <template slot-scope="scope" slot="menuLeft">
						<AddInterfaceCategory v-if="dialogVisible" :visible.sync="dialogVisible" 
						:dialogTitle="dialogTitle" :readOnly="readOnlyFlag" @submitRes="getInterfaceCategoryList"
						:interfaceForm="interfaceForm" :CategoryId="F_Id" :formEnCodeList="formEnCodeList"></AddInterfaceCategory>                       
                        <!-- 新增表单弹出框 -->
                        <el-button type="primary" icon="el-icon-plus" size="small"  v-if="hasButtonPermission('add')" @click="openDialog">
                            {{$t('buttonModule.addBtn')}}
                        </el-button>
                    </template>
                    <!-- 查看 编辑 删除 -->
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" @click="viewRow(scope.row)" v-if="hasButtonPermission('view')">{{$t('Notice.Tab.viewBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" @click="editInterface(scope.row,scope.index)" v-if="hasButtonPermission('edit')">
                            {{$t('tableOperationModule.editorBtn')}}
                        </el-button>
                        <el-button type="opr-danger" size="mini" @click="deleteInterfaceCategory(scope.row,scope.index)"  v-if="hasButtonPermission('delete')">
                            {{$t('tableOperationModule.deleteBtn')}}
                        </el-button>
                    </template>
                </avue-crud>
            </div>
        </main-content>
    </div>
</template>

<script>
import MainContent from "../../page/main/MainContent";
import tableOptionMixin from "@/mixins/tableOption";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { FormatTree } from "../../util/util.js";
import AddInterfaceCategory from "./components/AddInterfaceCategory.vue";
import {getInterfaceCategoryList,deleteInterfaceCategory,addInterfaceCategory,updateInterfaceCategory} from '@/api/systemManagement/interfaceCategory';

export default{
    name: "InterfaceCategory",
    mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
    components: {MainContent,AddInterfaceCategory},
    data () {
        return {
            readOnlyFlag: false,
            flagInterface: false,
            contentTitle: "接口管理",
            dialogTitle: "",
            keyword: "",
            F_Id: "",
            interfaceTable: [],
            defaultTree: [],//菜单树dicdata
            interfaceForm: {
                F_Name: "",
                F_EnCode: "",
                F_ParentId: "",
                F_Description: "",
                F_SortCode: ""
            },
            dialogVisible: false,
            order: {
                order: 'desc',
                prop: ''
            },
            page: {
                pagesize: 20,
                total: 0,
                currentPage: 1
            },
            option: {
                rowKey: "F_Id",//表格树必须配置rowKey
                highlightCurrentRow: true,
                viewBtn:false,
                addBtn: false,
                delBtn: false,
                editBtn: false,
                stripe: false,
                menuWidth: 150,
                calcHeight: 150,
                height: 'auto',
                maxHight: 'auto',
                border: false,
                selection: false,
                simplePage: true,
                index: false,
                indexLabel: this.$t('interfaceManage.addModal.tableNumber'),//开启索引，并将索引字段设置为"this.$t('interfaceManage.addModal.tableNumber')"
                align: 'center',
                menuAlign: 'center',
                // 
                column: [
                    // 暂时没拿到后端数据 还不知道具体字段名 ***待修改***
                    {
                        label:this.$t('interfaceClassName'),
                        minWidth: '95',
                        prop: 'F_Name',
                        align: 'left',
						overHidden:true
                    },
                    {
                        label:this.$t('interfaceClassCode'),
                        minWidth: '95',
                        prop: 'F_EnCode',
                        align: 'left',
						overHidden:true
                    },
                    {
                        label:this.$t('orgUserManagement.tabRemark'),
                        minWidth: '95',
                        prop: 'F_Description',
                        align: 'left',
						overHidden:true
                    },
                    {
                        label: this.$t("orgRoleManagement.tabCreateTime"),
                        prop: "F_CreateDate",
                        width: "140",
						overHidden:true
                    },
                    {
                        label: this.$t("orgRoleManagement.tabFounder"),
                        prop: "F_CreateUserName",
                        width: "100",
						overHidden:true
                    },
                    {
                        label:this.$t('reportList.modifyTime'),
                        prop: "F_ModifyDate",
                        width: "140",
						overHidden:true
                    },
                    {
                        label:this.$t('reportList.modifyUser'),
                        prop:   "F_ModifyUserName",
                        width: "100",
						overHidden:true
                    }
                ],
            },
            
        };
    },
    mounted () {
        this.getInterfaceCategoryList()
    },
    methods: {
        /*双击一行可编辑 */
        handleRowDBLClick (row,event) {
            if(this.openDoubleClickEdit){
				this.editInterface(row)
			}
        },
        /*获取数据表格 */
        getInterfaceCategoryList () {
            var tableParam = {
                limit : this.page.currentPage,
				size : this.page.pageSize,
				keyword : this.keyword,
				order : this.order.order,
				orderfield : this.order.prop
            };
            getInterfaceCategoryList(tableParam).then(res => {
                this.interfaceTable = res.data.data
                this.defaultTree = FormatTree(
                    res.data.data,
                    "F_Id",
                    "F_Name",
                    "children"
                );
                })
        },
        /* 新增弹窗打开 */
        openDialog() {
            this.dialogVisible = true;
            this.readOnlyFlag = false;
            this.dialogTitle = this.$t('addInterfaceSort');
			this.F_Id="";
            this.interfaceForm = {
                F_Name: "",
                F_EnCode: "",
                F_ParentId: "",
                F_Description: "",
                F_SortCode: "",
            };				
            },
        /*查看 */
        viewRow(row){
            this.dialogVisible=true;
            this.dialogTitle=this.$t('viewInterfaceCategories');
            this.readOnlyFlag=true;
            this.F_Id = row.F_Id;
            this.interfaceForm= {
                F_Name: row.F_Name,
                F_EnCode: row.F_EnCode,
                F_Description: row.F_Description,
                F_SortCode: row.F_SortCode,
                F_ParentId: row.F_ParentId
            }
        },
        /* 编辑 */
        editInterface(row,index) {
            this.dialogVisible = true;
            this.readOnlyFlag = false;
			this.dialogTitle = this.$t('editInterfaceCategories');
			this.F_Id=row.F_Id;
            this.interfaceForm= {
                F_Name: row.F_Name,
                F_EnCode: row.F_EnCode,
                F_Description: row.F_Description,
                F_SortCode: row.F_SortCode,
                F_ParentId: row.F_ParentId
            }
        },
        /*选中一行 */
        rowClick(row,event,column) {
            this.F_Id=row.F_Id;                
        },
        /* 删除 */
        deleteInterfaceCategory(row,index) {
			const h = this.$createElement;
			this.$msgbox({
			  title:this.$t('language.languageType.Hint.titlePrompt'),
			  message: h('div', null, [
				h('div', null, [
					h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
					h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('determineWhetherDeleteInterfaceClass'))]),
				h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('DeleteInterfaceCategoryDeletesSub-categoriesRegistered'))
			  ]),
			  showCancelButton: true,
			  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
			  cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
			  beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
				  instance.confirmButtonLoading = true;
				  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
					  deleteInterfaceCategory(row.F_Id).then((res) => {
					  	instance.confirmButtonLoading = false;
					  	this.$notify({
					  	    title:this.$t('deletePrompt.successTitle'),
					  	    message:this.$t('deletePrompt.successDeleted'),
					  	    type: 'success'
					  	});
					  	this.getInterfaceCategoryList();
					  	done();
					  });
				} else {
				  done();
				}
			  }
			}).then(action => {}).catch(() => {});    
        },
        cancelBtn(){
			this.dialogVisible = false;
		},
        /* 查询 */
        searchInterface() {
            this.getInterfaceCategoryList();
        },
        /* 查询表单重置 */
        searchReset() {
            this.keyword= "";
			this.getInterfaceCategoryList();
        },
        sizeChange(page){
			this.page.pageSize = page;
			this.getInterfaceCategoryList();
		},
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
	/deep/ .search-box .el-form-item{
		margin-top: 0;
		margin-right: 0px;
	}
</style>