<template>
    <div class="main-container" style="height: 100%; padding: 0 8px;">
        <main-fixed :title="fixedTitle">
            <div slot="list">
                <!-- 在此处放置左侧列表内容 -->
                <!-- 公司树形菜单 -->
                <el-tree :data="companiesTree" :props="defaultProps" node-key="F_CompanyId" ref="cTree" :default-expand-all="true"  @node-click="handleNodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
					     <i class="el-icon-office-building"></i>
					     <span>{{ data.F_FullName}}</span>
					 </span>
				</el-tree>
            </div>
        </main-fixed>
        <main-content :title="contentTitle" :paddingLeft="205" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">
                    <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')" style="width: 200px; margin-right:5px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchUser">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud ref="cuTable" v-if="searchParam.companyId" :data="companiesUser" :option="option" stripe :page.sync="page" :showColumn="showColumn" :isSaveColumns="true" @on-load="onPageLoad">
                    <template slot-scope="scope" slot="menuLeft">    
                        <el-button type="primary" icon="el-icon-s-operation" size="small" @click="syncDingTalkUser" v-if="hasButtonPermission('synchro')">{{$t('wechatAndDingTalk.userManagement.dingSynBtn')}}</el-button>
                    </template>
                </avue-crud>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainFixed from "../../../page/main/MainFixed";
    import MainContent from "../../../page/main/MainContent";
    import {getAllCompanies} from '@/api/organization/company'
    import {syncDingTalkUser,getDingTalkUser} from '@/api/organization/user'
    import {Loading} from 'element-ui';
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    export default {
        name: "UserManagement",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent, MainFixed},
        data() {
			const _this = this;
            return {
                fixedTitle:this.$t('wechatAndDingTalk.userManagement.fixedTitle'),
                contentTitle: '用户列表',
                companiesTree: [],
                companiesUser: [],
                companiesDepartments: [],
                searchParam: {limit : 1, size : 20, keyword : null, order : null, orderfield : null,companyId:null},
                defaultProps: {children: 'children', label: 'F_FullName'},
                dialogVisible: false,
                page: {pageSize: 20, total: 0, currentPage: 1},
                option: {highlightCurrentRow: true, stripe: false, addBtn: false,border: false, page: true,
                    index: true, indexLabel:this.$t('wechatAndDingTalk.userManagement.tableNumber'), align: 'center', menu:false,simplePage:true,
                    column: [{sortable: true, label:this.$t('wechatAndDingTalk.userManagement.tableName'), prop: 'F_Name',align: 'left'}, 
                            {sortable: true, label:this.$t('wechatAndDingTalk.userManagement.tableStatus'), minWidth:'95',align: 'left', prop: 'F_Status',formatter:function(row){
                                return row.F_Status==1?_this.$t('syncSuccess'):_this.$t('syncFailure')
                            }}, 
                            {sortable: true, label:this.$t('wechatAndDingTalk.userManagement.tableInfor'), minWidth:'95',align: 'left',prop: 'F_Info'}]
                }
            }
        },
        created() {
            this.getCompaniesTree();
        },        
        methods: {
            /* 获取公司树形菜单数据 */
            getCompaniesTree() {
                getAllCompanies().then(res => {
                    this.companiesTree = res.data.data;
                    this.searchParam.companyId  = res.data.data[0].F_CompanyId;
                    /* 左侧树形菜单默认选中第一个 */
                    this.$nextTick(function () {
                        this.$refs.cTree.setCurrentKey(this.searchParam.companyId );
                    })
                })
            },
            /* 选择树形菜单加载公司用户信息 */
            handleNodeClick(data) {                
                this.searchParam.companyId  = data.F_CompanyId;
                this.searchParam.keyword = null;         
                this.getDingTalkUser(this.searchParam);              
            },
            /* 获取公司用户数据 */
            getDingTalkUser(params) {
                getDingTalkUser(params).then(res => {
                    this.companiesUser = res.data.data.Rows;
                    this.page.total = res.data.data.Total;
                })    
            },          
            /* 同步到钉钉 */
            syncDingTalkUser(){
                this.$confirm(this.$t('wechatAndDingTalk.userManagement.Hint.syncSure'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    var load = Loading.service({text:this.$t('wechatAndDingTalk.userManagement.Hint.Loading')});
                    syncDingTalkUser(this.searchParam.companyId).then(res => {
                        if(res.data.success){
                            this.$notify({title:this.$t('deletePrompt.successTitle'),message:this.$t('wechatAndDingTalk.userManagement.Hint.syncSuccess'),type: 'success'});
                            this.getDingTalkUser(this.searchParam);
                        }else{
                            this.$notify({title:this.$t('deletePrompt.failureTitle'),message:this.$t('wechatAndDingTalk.userManagement.Hint.syncFailure'),type: 'warning'});
                        }          
                        load.close();              
                    }).catch(()=>{
						load.close();      
					})

                })
            },  
            /* 查询 */
            searchUser() {
                this.searchParam.limit = 1;
                this.getDingTalkUser(this.searchParam);
            },
            /* 查询表单重置 */
            searchReset() {
                this.searchParam.keyword = null;
                this.getDingTalkUser(this.searchParam);
            },
            onPageLoad(page) {
                this.searchParam.limit = page.currentPage;
                this.searchParam.size = page.pageSize;
                this.getDingTalkUser(this.searchParam);
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
	font-size: 12px;
}
</style>