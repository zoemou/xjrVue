<template>
    <div class="main-container">
        <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">
					<el-date-picker
					      v-model="searchTime"
					      type="daterange"
					      :range-separator="$t('searchModule.rangeSeparator')"
					      :start-placeholder="$t('searchModule.startDatePlaceholder')" value-format="yyyy-MM-dd"
					      :end-placeholder="$t('searchModule.endDatePlaceholder')" style="width: 260px; margin-right: 5px">
					    </el-date-picker>
                    <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                              style="width: 200px; margin-right: 5px"></el-input>
					<el-select v-model="searchState" :placeholder="$t('searchModule.searchState')" style="width: 200px; margin-right: 5px">
					    <el-option :label="$t('searchModule.stateSuccess')" value="1" key="1"></el-option>
						<el-option :label="$t('searchModule.stateFailure')" value="2" key="2"></el-option>
					</el-select>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchTaskDesign">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>

                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud ref="taskDesign" :data="taskDesignList" :option="option" stripe :page.sync="page" :showColumn="showColumn" :isSaveColumns="true"
                           @on-load="onPageLoad" @selection-change="selectionChange" @current-row-change="handleCurrentRowChange">
					<template slot-scope="scope" slot="menuLeft">
						<el-button type="danger" icon="el-icon-delete" size="small" @click="deleteTask" v-if="hasButtonPermission('batchDelete')">{{$t('buttonModule.batchDeletionBtn')}}</el-button>
					</template>
                </avue-crud>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
    import {getTaskScheduleLogList, deleteTaskLog} from '@/api/systemManagement/taskScheduling'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
	import { getStore } from "@/util/store";
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    export default {
        name: "TaskLog",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent},
        data() {
			const _this = this;  
            return {
                contentTitle: '日志列表',
                keyword: "",
				searchTime:"",
				searchState:null,
				taskDesignList:[],
				selectedId:[],
				order:{
					order:'desc',
					prop:''
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
                    border: false,
                    index: true,
					simplePage:true,
                    indexLabel:this.$t('taskScheduling.taskLog.tableNumber'),
                    align: 'center',
                    menu:false,
                    delBtn: false,
                    editBtn: false,
					selection:true,
                    column: [
                        {
                            sortable: true,
                            label:this.$t('taskScheduling.taskLog.tableName'),
                            prop: 'F_ProcessName',
							minWidth:'95',
							align: 'left',
							overHidden:true
                        }, {
                            sortable: true,
                            label:this.$t('taskScheduling.taskLog.tableTime'),
							overHidden:true,
							align: 'left',
                            prop: 'F_CreateDate'
                        }, {
                            sortable: true,
                            label:this.$t('taskScheduling.taskLog.tableResult'),
							overHidden:true,
							align: 'left',
                            prop: 'F_ExecuteResult',
							formatter: function (row) {
							    return row.F_ExecuteResult === 1 ?_this.$t('deletePrompt.successTitle'): row.F_ExecuteResult === 2 ?_this.$t('deletePrompt.failureTitle'):'' 
							}
                        }, {
                            sortable: true,
                            label:this.$t('taskScheduling.taskLog.tableContent'),
                            prop: 'F_Des',
							overHidden:true,
							align: 'left',
                        }
                    ]
                }
            }
        },
        created() {
            
        },
		mounted() {
		  this.getTaskScheduleList();		  
		},
        methods: {
			handleCurrentRowChange(row){
			  this.$refs.taskDesign.toggleSelection([row]);
			},
            /* 获取列表 */
            getTaskScheduleList() {
				var searchParam={
					startTime:this.searchTime[0],
					endTime:this.searchTime[1],
					executeResult:this.searchState,
				    limit : this.page.currentPage,
				    size : this.page.pageSize,
				    keyword : this.keyword,
				    order : this.order.order,
				    orderfield : this.order.prop
				};
                getTaskScheduleLogList(searchParam).then(res => {
					this.page.total= res.data.data.Total;
                    this.taskDesignList = res.data.data.Rows
                })
            },
			
            selectionChange(list){	
				this.selectedId=[];
				list.forEach((o,i)=>{
					this.selectedId.push(o.F_Id)
				})
            },
            /* 删除 */
            deleteTask() {
				if(this.selectedId.length<=0){
					this.$notify({
					    title: this.$t('deletePrompt.promptTitle'),
					    message:this.$t('taskScheduling.taskLog.hintSDeleteData'),
					    type: 'warning'
					});
				}else{
					this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
					    confirmButtonText:  this.$t('buttonModule.modalSureBtn'),
					    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
					    type: 'warning'
					}).then(() => {
					    deleteTaskLog(this.selectedId).then(() => {
							this.selectedId=[];
					        this.getTaskScheduleList();
					        this.$notify({
					            title:this.$t('deletePrompt.successTitle'),
					            message: this.$t('deletePrompt.successDeleted'),
					            type: 'success'
					        });
					    })
					}).catch(() => {

					});
				}
            },
           
            /* 查询 */
            searchTaskDesign() {
				this.getTaskScheduleList();
            },
            /* 查询表单重置 */
            searchReset() {
                this.keyword= "";
				this.searchTime="";
				this.searchState=null;
				this.getTaskScheduleList();
            },
            
            onPageLoad(page) {
                this.page.currentPage = page.currentPage;
				this.page.pageSize = page.pageSize
				this.getTaskScheduleList();
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
	/deep/ .el-tag{
		margin: 0px 0px 5px 5px;
	}
/deep/ .avue-crud .avue-crud__tip{
		display: none;
	}
@media screen and (max-width: 1198px) {
	   /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}		
</style>