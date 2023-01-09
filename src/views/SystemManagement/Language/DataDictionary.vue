<template>
    <div class="main-container">
        <main-content :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
				 <div class="search-box">
                <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('language.dataDictionary.tagNameCodeSearch')"
                          style="width: 240px; margin-right:5px"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
				</div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                    <avue-crud ref="dataDictionary" :data="dataDictionary" :option="option" :page.sync="page" :showColumn="showColumn"
                                    :isSaveColumns="true" @on-load="onPageLoad" :cell-style="cellStyle" @row-dblclick="handleRowDBLClick">
                        <template slot-scope="scope" slot="menuLeft">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
                            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :title="itemId?$t('language.dataDictionary.titleEditTraTag'):$t('language.dataDictionary.titleAddTraTag')" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                               :before-close="closeDialog">
                        <div class="form">
                            <el-form ref="dataDictionaryForm" :rules="rules" :model="dataDictionaryForm" label-width="100px">
								<el-col v-show="hasFormPermission('F_Name')">
									<el-form-item :label="$t('language.translation.labelTagName')" prop="F_Name">
										<el-input v-model="dataDictionaryForm.F_Name" :placeholder="$t('language.translation.placeholderTagName')"></el-input>
									</el-form-item>
								</el-col>
								<el-col v-show="hasFormPermission('F_EnCode')">
									<el-form-item :label="$t('language.translation.labelTagCode')" prop="F_EnCode">
										<el-input v-model="dataDictionaryForm.F_EnCode" :placeholder="$t('language.translation.placeholderTagCode')"></el-input>
									</el-form-item>
								</el-col>
								
								<el-col v-show="hasFormPermission('F_Description')">
									<el-form-item :label="$t('language.translation.labelRemarks')" prop="F_Description">
										<el-input type="textarea" v-model="dataDictionaryForm.F_Description" :placeholder="$t('language.translation.placeholderRemarks')" size="small"></el-input>
									</el-form-item>
								</el-col>
                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button 
                            size="mini" 
                            type="primary"
                            @click="submitForm('dataDictionaryForm')" 
                            :loading="flagDic"
                            >
                            {{flagDic?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                            </el-button>
                        </span>
                    </el-dialog>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
    import { deepClone,FormatTree,formValidateNotice } from '../../../util/util'
    import {getDataDictionaryTree,getLgType,searchDataDictionary} from '@/api/language/dictionary'
	import {addMark,getDataDictionary,editDataDictionary,deleteDataDictionary} from '@/api/language/translation'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    import {validateDesLength,validateLength} from "@/api/organization/validateFunc";
    export default {
        name: "DataDictionary",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent},
        data() {
            return {
                flagDic: false,
                searchParam: {},
                dataDictionaryTree:[],
                dataDictionary: [],
                itemId:'',
                lgType : [],
                dataDictionaryForm: {},
                currentIds : [],
                submitFormData : {},
                dialogVisible: false,
                page: {
                    pageSize: 20,
                    total: 0,
                    currentPage: 1,
                    // layout: "total, prev, pager, next",
                },
                rules: {
                    F_Name: [
                        { required: true, message:this.$t('language.translation.placeholderTagName'), trigger: 'blur' },
                        { validator: validateLength, trigger:'change'}
                    ],
                    F_EnCode: [
                        { required: true, message:this.$t('language.translation.placeholderTagCode'), trigger: 'blur' },
                        { validator: validateDesLength, trigger:'change'},
						{message:this.$t('language.translation.hintTagCode'), trigger: 'blur',pattern:'^[a-zA-Z_]([a-zA-Z0-9._-]+)?$'}
                    ],
                    F_Description: [
                        { validator: validateDesLength, trigger:'change'}
                    ]
                },
                option: {
                    highlightCurrentRow:true,
                    stripe: false,
                    menuWidth: 150,                    
                    border: false,
                    page: true,
                    index: true,
                    indexLabel: this.$t('language.translation.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
					rowKey: "F_Id",
                    column: [
                        {
                            sortable: true,
                            label: this.$t('language.translation.labelTagName'),
                            prop: 'F_Name',
							align: 'left',
                        }, {
                            sortable: true,
                            label: this.$t('language.translation.labelTagCode'),
                            prop: 'F_EnCode',
							align: 'left',
                        }, {
                            sortable: true,
                            label: this.$t('language.translation.labelRemarks'),
                            prop: 'F_Description',
							align: 'left',
                        }
                    ]
                },
            }
        },
        created() {
            
            
        },
        methods: {
            handleRowDBLClick (row, event) {
                if(this.openDoubleClickEdit){
                    this.editForm(row)
                }
            },
            onPageLoad() {
                this.getDataDictionary()
            },
            cellStyle({row,column,rowIndex,columnIndex}){
				if(columnIndex==1||columnIndex==2){
				  return {textAlign:'left'}
				}
			},
            /* 获取字典数据 */
            getDataDictionary() {
                	this.searchParam.limit=  this.page.currentPage
       	            this.searchParam.size=  this.page.pageSize
                getDataDictionary(this.searchParam).then(res => {
                    this.dataDictionary = res.data.data.Rows
                    this.page.total = res.data.data.Total
				
                })
            },
            /* 格式化数据 */
            FormatResult(data){
                let newList = [];
                data.forEach((item,index) =>{
                    let isHave= false;

                    let obj = {};
                    newList.forEach((it,index) => {
                        if (it.F_Code === item.F_Code){
                            isHave = true;
                            obj = it;
                        }
                    });
                    if (isHave){
                        obj[item.F_TypeCode] = item.F_Name;
                    }
                    else {
                        const newObj = {
                            F_Code  : item.F_Code,
                        }
                        newObj[item.F_TypeCode] = item.F_Name;
                        newList.push(newObj);
                    }
                },this);
               /* return newList;*/
                this.dataDictionary = newList
            },
            /* 打开 */
            openDialog() {
                this.dialogVisible = true;
				this.itemId="";
                this.dataDictionaryForm = {}
            },
            /* 关闭 */
            closeDialog() {
                this.dialogVisible = false;
            },
            /* 提交 */
            submitForm(formName) {
                this.flagDic = true,
                this.$refs[formName].validate((valid,object) => {
                    if (valid) {
                        if(this.itemId) {
							editDataDictionary(this.itemId,this.dataDictionaryForm).then(() => {
							    this.dialogVisible = false;
							    this.getDataDictionary()
							}).finally(() => {
                                this.flagDic = false;
                            })
                        } else {
							addMark(this.dataDictionaryForm).then(() => {
							    this.dialogVisible = false;
							    this.getDataDictionary()
							}).finally(() => {
                                this.flagDic = false;
                            })
                            
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        this.flagDic = false;
                        return false;
                    }
                });
            },
            /* 编辑 */
            editForm(row) {
                this.dialogVisible = true;
				this.itemId=row.F_Id;
                this.dataDictionaryForm ={
					"F_Description": row.F_Description,
					"F_EnCode": row.F_EnCode,
					"F_Name": row.F_Name,
					"F_ParentId": row.F_ParentId
				} 
            },
            /* 删除 */
            deleteForm(row) {
				const h = this.$createElement;
				this.$msgbox({
				  title: this.$t('language.dataDictionary.hintTitle'),
				  message: h('div', null, [
					h('div', null, [
						h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
						h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'}, this.$t('language.dataDictionary.hintDelTraTag'))]),
					h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('language.dataDictionary.hintDelAll'))
				  ]),
				  showCancelButton: true,
				  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
				  cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
				  beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
					  instance.confirmButtonLoading = true;
					  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
					  deleteDataDictionary(row.F_Id).then(() => {
					    instance.confirmButtonLoading = false;
					    this.$notify({
					        title:this.$t('deletePrompt.successTitle'),
					        message: this.$t('deletePrompt.successDeleted'),
					        type: 'success'
					    });
					    this.getDataDictionary()
						done();
					  })
					} else {
					  done();
					}
				  }
				}).then(action => {}).catch(() => {});
            },
            /* 取消 */
            cancelDialog() {},
            /* 搜索 */
            search() {
				this.getDataDictionary()
            },
            /* 搜索 表单重置 */
            searchReset() {
                this.searchParam = {};
				this.getDataDictionary()
            },
        },
    }
</script>

<style>
    /* css */
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
	
</style>