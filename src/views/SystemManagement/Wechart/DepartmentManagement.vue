<template>
    <div class="main-container" style="height: 100%; padding: 0 8px;">
        <main-fixed :title="fixedTitle">
            <div slot="list">
                <!-- 在此处放置左侧列表内容 -->
                <!-- 公司树形菜单 -->
                <el-tree :data="companiesTree" :props="defaultProps" node-key="F_CompanyId" ref="cTree" :default-expand-all="true" current-node-key @node-click="handleNodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
					     <i class="icon-map-site"></i>
					     <span>{{ data.F_FullName}}</span>
					 </span>
				</el-tree>
            </div>
        </main-fixed>
        <main-content :title="contentTitle" :paddingLeft="205" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">
                    <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')" style="width: 200px; margin-right: 5px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchDepartment">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud :data="departments" :option="option" stripe :page.sync="page" :showColumn="showColumn"
                        :isSaveColumns="true" @on-load="onPageLoad" @sort-change="sortChange">
                    <template slot-scope="scope" slot="menuLeft">                   
                        <el-button type="primary" icon="el-icon-s-operation" size="small" @click="syncWeChatDepartment" v-if="hasButtonPermission('synchro')">{{$t('wechatAndDingTalk.userManagement.syncBtn')}}</el-button>
                    </template> 
                </avue-crud>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainFixed from "../../../page/main/MainFixed";
    import MainContent from "../../../page/main/MainContent";
    import {FormatTree} from "../../../util/util.js";
    import {Loading} from 'element-ui';
    import {getCompaniesTree, getWeChatDepartment, syncWeChatDepartment} from '@/api/organization/user'
	import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    export default {
        name: "DepartmentManagement",
		mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent, MainFixed},
        data() {
            return {
                fixedTitle: this.$t('wechatAndDingTalk.userManagement.fixedTitle'),
                contentTitle: '部门列表',
                companiesTree: [],
                departments: [],
                searchParam: {},
                defaultProps: {children: 'children', label: 'F_FullName'},
                dialogVisible: false,
                page: {pageSize: 20, total: 0, currentPage: 1},
                option: {rowKey:'F_FullName', highlightCurrentRow: true, stripe: false, addBtn: false, menuWidth: 150, border: false, page: false,
                    index: true, indexLabel: this.$t('wechatAndDingTalk.userManagement.tableNumber'), align: 'center', menuAlign: 'center', delBtn: false, editBtn: false, menu: false,
                    column: [{label:this.$t('wechatAndDingTalk.departmentManagement.tableName'), prop: 'F_FullName',align: 'left',sortable:true}, 
                            {label:this.$t('wechatAndDingTalk.departmentManagement.tableDepNumber'), prop: 'F_EnCode',align: 'left',sortable:true}, 
                            {label:this.$t('wechatAndDingTalk.departmentManagement.tableAbbreviation'), prop: 'F_ShortName',align: 'left',sortable:true}, 
                            {label:this.$t('wechatAndDingTalk.departmentManagement.tableNature'), prop: 'F_Nature',align: 'left',sortable:true}, 
                            {label:this.$t('wechatAndDingTalk.departmentManagement.tablePrincipal'), prop: 'F_Manager',align: 'left',sortable:true}, 
                            {label: this.$t('wechatAndDingTalk.userManagement.tableStatus'), prop: 'F_Fax',align: 'left',sortable:true}, 
                            {label: this.$t('wechatAndDingTalk.userManagement.tableInfor'), prop: 'F_Description',align: 'left',sortable:true}]
                },
            }
        },
        created() {
            this.getCompaniesTree();
        },
        methods: {
            /* 获取公司树形菜单数据 */
            getCompaniesTree() {
                getCompaniesTree().then(res => {
                    this.companiesTree = res.data.data;
                    this.searchParam.CompanyId = res.data.data[0].F_CompanyId;
                    
                    this.getWeChatDepartment(this.searchParam);

                    /* 左侧树形菜单默认选中第一个 */
                    this.$nextTick(() =>{
                        this.$refs.cTree.setCurrentKey(res.data.data[0].F_CompanyId);
                    })
                })
            },
            /* 选择树形菜单加载公司用户信息 */
            handleNodeClick(data) {
                this.searchParam.CompanyId = data.F_CompanyId;
                this.getWeChatDepartment(this.searchParam);                
            },
            /* 获取公司部门 */
            getWeChatDepartment(searchParam) {
                getWeChatDepartment(searchParam).then(res => {
                    this.departments = res.data.data;
                })
            },
            /* 同步到微信 */
            syncWeChatDepartment(){
                this.$confirm(this.$t('wechatAndDingTalk.userManagement.Hint.syncSure'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText:this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    var load = Loading.service({text:'正在提交数据'});
                    syncWeChatDepartment().then(res => {                                            
                        if(res.data.success){
                            this.$notify({title:this.$t('deletePrompt.successTitle'),message: this.$t('wechatAndDingTalk.userManagement.Hint.syncSuccess'),type: 'success'});
                            this.getWeChatDepartment(this.searchParam);
                        }else{
                            this.$notify({title:this.$t('deletePrompt.failureTitle'),message:this.$t('wechatAndDingTalk.userManagement.Hint.syncFailure'),type: 'warning'});                            
                        }  
                        load.close();
                    }).catch(()=>{
						load.close();      
					})
                })
            }, 
            /* 表格单行选中 */
            setCurrent(row) {
                this.$refs.cuTable.setCurrentRow(row);
            },
            /* 查询 */
            searchDepartment() {
                this.getWeChatDepartment(this.searchParam);
            },
            /* 查询表单重置 */
            searchReset() {
                this.searchParam = {};
            },
            /* 分页 */
            sortChange() {
            },
            onPageLoad() {   
            }
        }
    }
</script>
<style scoped>
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px!important;
}
</style>