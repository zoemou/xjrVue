<template>
    <div class="main-container" style="height: 100%; padding: 0 8px;">     

        <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">    
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">
                    <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')" style="width: 200px; margin-right:5px"></el-input>                    
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud 
                ref="cuTable" 
                :data="tableData" 
                :option="option" 
                stripe 
                :page.sync="page" 
                :showColumn="showColumn"
                :isSaveColumns="true"
                @on-load="onPageLoad" 
                @sort-change="sortChange" 
                @row-dblclick="handleRowDBLClick"
                >
                    <template slot="menuLeft">    
                        <el-button v-if="hasButtonPermission('add')" type="primary" icon="el-icon-plus" size="small" @click="openForm('dataForm')">{{$t('buttonModule.addBtn')}}</el-button>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==0 && hasButtonPermission('state')" @click="changeState(scope.row,1)">{{$t('Notice.Tab.releaseBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" @click="viewRow(scope.row)" v-if="hasButtonPermission('view')">{{$t('Notice.Tab.viewBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==0 && hasButtonPermission('edit')" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==1 && hasButtonPermission('offshelf')" @click="changeState(scope.row,0)">{{$t('Notice.Tab.offShelfBtn')}}</el-button>
                        <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                    </template>
                </avue-crud>
            </div>           
        </main-content>

        <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" style="padding: 10px 20px;">
            <div class="companiesuser-form">
                <el-form  :rules="rules" ref="dataForm"  :model="dataForm" label-width="75px" :validate-on-rule-change="false" >
                    <el-row>
                        <el-col :span="24" v-show="hasFormPermission('F_FullHead')">
                            <el-form-item prop="F_FullHead" :label="$t('Notice.labelNotTitle')">
                                <el-input :placeholder="$t('Notice.placeholderNotTitle')" size="small" v-model="dataForm.F_FullHead"></el-input>
                            </el-form-item>
                        </el-col>                                                                
                    </el-row>
                    <el-row>
                        <el-col :span="12" v-show="hasFormPermission('F_CategoryId')">
                            <el-form-item  prop="F_CategoryId" :label="$t('Notice.labelNotTyle')">
                                <el-select v-model="dataForm.F_CategoryId" :placeholder="$t('Notice.placeholderNotTyle')" size="small" style="width: 100%">
                                    <el-option v-for="(item,index) in noticeCategory" :key="index" :label="item.F_ItemName" :value="item.F_ItemValue"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="hasFormPermission('F_ReleaseTime')">
                            <el-form-item prop="F_ReleaseTime"  :label="$t('Notice.labelReleaTime')">
                                <el-date-picker v-model="dataForm.F_ReleaseTime" type="datetime" :placeholder="$t('Notice.placeholderReleaTime')" size="small" style="width: 100%"  value-format='yyyy-MM-dd HH:mm:ss'
                format='yyyy-MM-dd HH:mm:ss' > </el-date-picker>
                            </el-form-item>
                        </el-col>                        
                    </el-row> 
                    <el-row>
                        <el-col :span="12" v-show="hasFormPermission('F_SourceName')">
                            <el-form-item :label="$t('Notice.labelInforSou')">
                                <el-input :placeholder="$t('Notice.placeholderInforSou')" size="small" v-model="dataForm.F_SourceName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="hasFormPermission('F_SourceAddress')">
                            <el-form-item :label="$t('Notice.labelAddress')">
                                <el-input :placeholder="$t('Notice.placeholderAddress')" size="small" v-model="dataForm.F_SourceAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>                                                                       
                    <el-row>
                        <el-col :span="24" v-show="hasFormPermission('F_NewsContent')">
                            <el-form-item :label="$t('Notice.labelContent')">
                                <!-- <avue-ueditor placeholder="请填写内容" size="small" v-model="dataForm.F_NewsContent"></avue-ueditor> -->
                                <!-- v-if实现tinymce组件销毁，否则内容渲染不正常 -->
                                <tinymce height="500" v-model="dataForm.F_NewsContent" v-if="dialogVisible"></tinymce>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm('dataForm')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button 
                size="mini" 
                type="primary" 
                @click="formSubmit('dataForm')" 
                :loading="flagNotice"
                >
                {{flagNotice?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                </el-button>
            </span>
        </el-dialog>

        <newContent v-if="newsVisible" :contentData="curRow" @visible="newsVisible=false"></newContent>
    </div>
</template>

<script>
import newContent from './content.vue';
    import MainFixed from "../../page/main/MainFixed";
    import MainContent from "../../page/main/MainContent";
    import {getNoticeCategory, getNotice, addNotice, modifyNotice, deleteNotice,changeStatus} from '@/api/officeautomation/notice';
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize"; //鉴权混入
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    import { deepClone,formValidateNotice} from '@/util/util';
    export default {
        name: "News",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent, MainFixed,newContent},
        data() {
			const _this = this; 
            return {
                flagNotice: false,
                contentTitle: '通知公告',                
                dialogVisible: false,
                newsVisible:false,
                curRow:'',
                dialogTitle:'',
                searchParam: {limit : 1, size : 20, keyword : null, order : null, orderfield : null},
                page: {pageSize: 20, total: 0, currentPage: 1},
                option: {highlightCurrentRow: true, stripe: false, addBtn: false, menuWidth: 220, border: false, page: true,
                    index: true, indexLabel:this.$t('Notice.tabNum'), align: 'left', menuAlign: 'center', delBtn: false, editBtn: false,
                    column: [{sortable: true, label:this.$t('Notice.labelNotTitle'), prop: 'F_FullHead',minWidth:'105',align:'left'}, 
                            {sortable: true, label: this.$t('Notice.labelNotTyle'), prop: 'F_CategoryId',minWidth:'120'}, 
                            {sortable: true, label:this.$t('Notice.labelInforSou'), prop: 'F_SourceName',minWidth:'150'}, 
                            {sortable: true, label:this.$t('Notice.labelReleaTime'), prop: 'F_ReleaseTime',minWidth:'140'},
                            {sortable: true, label: this.$t('Notice.tabStatus'), prop: 'F_EnabledMark',minWidth:'95',
                                formatter:function(row){	
                                return row.F_EnabledMark === 1 ? _this.$t('published'): _this.$t('unpublished');  
                            }}]
                },
                dataForm: {},                 
                rules: {
                    F_FullHead: [{required: true, message: this.$t('Notice.placeholderNotTitle'), trigger: 'blur'}],
                    F_CategoryId: [{required: true, message:this.$t('Notice.hintSelectNotTyle'), trigger: 'change'}],
                    F_ReleaseTime: [{required: true, message:this.$t('Notice.placeholderReleaTime'), trigger: 'blur'}],
                },
                noticeCategory: [],
                tableData: []
            }
        },
        created() {      
            this.getNoticeCategory();
        },
        methods: {  
            handleRowDBLClick (row, event) {
                if(this.openDoubleClickEdit && row.F_EnabledMark==0){
                this.editForm(row)
                }else {
                    this.$message({
                        message: '通告已发布,不允许编辑',
                        type: 'warning'
                    })
                }
            },
            getNoticeCategory(){
                getNoticeCategory('NoticeCategory').then(res => {
                    this.noticeCategory = res.data.data;
                })
            },
            /* 获取数据 */
            getData(params){
                getNotice(params).then(res => {
                    this.tableData = res.data.data.Rows;
                    this.page.total = res.data.data.Total;
                })
            },   
            /* 新增 */
            openForm(formName) {
                this.flag = true;
                this.dataForm = {};
                this.dialogVisible = true;
				this.dialogTitle =this.$t('Notice.dialogTitle.Add');		
				if (this.$refs[formName]!==undefined) {
				    this.$refs[formName].resetFields();
				}              
            },
            /* 编辑 */
            editForm(row) {
                this.flag = false;
                this.dialogVisible = true;
                this.dialogTitle =this.$t('Notice.dialogTitle.Edit');
                this.dataForm = deepClone(row);
            },
            changeState(row,data){
                changeStatus({
                    id:row.F_NewsId,
                    type:data
                }).then(res=>{
                    const { code } = res.data;
                    let text=data==0?this.$t('Notice.hintOffShelf'):this.$t('Notice.hintRelease');
                    this.$notify({
                    title: code?this.$t('deletePrompt.failureTitle'):this.$t('deletePrompt.successTitle'),
                    message: code?(text+this.$t('Notice.hintFailure')):(text+this.$t('Notice.hintSuccess')),
                    type: code?'error':'success'
                    });
                    if(!code) this.getData(this.searchParam);
                })
            },
            viewRow(row){
            this.newsVisible=true;
            this.curRow=row;
            },
            /* 删除 */
            deleteForm(row) {
                this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {confirmButtonText:this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
                }).then(() => {
                    deleteNotice(row.F_NewsId).then(() => {
											this.getData(this.searchParam);
                      this.$notify({title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success'});
                    }).catch(() => {
											this.$notify({title:this.$t('deletePrompt.failureTitle'), message:this.$t('deletePrompt.failedDeleted'), type: 'warning'});
										})
                }).catch(() => {});
            },
            /* 提交表单 */
            formSubmit(formName) {
                this.flagNotice = true;
                this.dataForm.F_TypeId = 2;
                this.$refs[formName].validate((valid,object) => {                        
                    if (valid) {
                        if (this.flag) {                                                            
                            addNotice(this.dataForm).then(() => {
                                this.dialogVisible = false;
                                this.getData(this.searchParam);
                            }).finally(() => {
                                this.flagNotice = false;
                            })
                        } else {                                                        
                            modifyNotice(this.dataForm.F_NewsId, this.dataForm).then(() => {
                                this.dialogVisible = false;
                                this.getData(this.searchParam);
                            }).finally(() => {
                                this.flagNotice = false;
                            })
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        this.flagNotice = false;
                        return false;
                    }
                });
            },
            /* 取消弹窗 */
            cancelForm(formName) {
                this.flagNotice = false;
                this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            /* 关闭弹窗 */
            handleClose(done) {
                this.$refs['dataForm'].resetFields(); 
                done();
            },
            /* 页面加载 */
            onPageLoad(page) {
                this.searchParam.limit = page.currentPage;
                this.searchParam.size = page.pageSize;
                this.getData(this.searchParam);
            },
            /* 查询 */
            searchData() {
                this.searchParam.limit = 1;
                this.searchParam.order = null;
                this.searchParam.orderfield = null;
                this.getData(this.searchParam);
            },  
            /* 查询表单重置 */
            searchReset() {
                this.searchParam.keyword = null;
                this.getData(this.searchParam);
            },
            sortChange(data) {
                // this.searchParam.order = getOrder(data.order);
                this.searchParam.orderfield = data.prop;
                this.getData(this.searchParam)
            },
        }
    }
</script>

<style scoped>
	@media screen and (max-width: 1370px) {
		.companiesuser-form{
			max-height:415px;
			overflow-y: scroll;
		}
	/deep/ .el-dialog{
			margin-top: 5vh!important;
		}
	}
	/deep/ .el-dialog{
			margin-top: 8vh!important;
		}
</style>