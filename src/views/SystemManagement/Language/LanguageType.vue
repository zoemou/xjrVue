<template>
    <div class="main-container">
        <main-content :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
				 <div class="search-box">
                <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('language.languageType.searchPlaceholder')"
                          style="width: 200px; margin-right:5px"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
				</div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                    <avue-crud ref="languageType" :data="languageType" :option="option" :showColumn="showColumn" :isSaveColumns="true" @row-click="currentRow">
                        <template slot-scope="scope" slot="menuLeft">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
                            <el-button size="small" @click="setLanguage" v-if="hasButtonPermission('lg')">{{$t('language.languageType.defaultLanguageBtn')}}</el-button>
                        </template>
                        <template slot-scope="scope" slot="F_IsMain">
							<avue-switch disabled active-color="#13ce66" inactive-color="#a29e9e" v-model="scope.row.F_IsMain" :dic="swichDic"></avue-switch>
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button type="opr-primary" size="mini" icon="el-icon-edit" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
                            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :title="languageTypeForm.F_Id?$t('language.languageType.addModal.editTitle'):$t('language.languageType.addModal.addTitle')" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                               :before-close="closeDialog">
                        <div class="form">
							<div>{{$t('language.languageType.hintRule')}}</div>
                            <el-form ref="languageTypeForm" :rules="rules" :model="F_Code" label-width="100px">
								<!-- <el-col>
									<el-form-item :label="$t('languageType.addModal.labelName')" prop="F_Name">
										<el-input v-model="languageTypeForm.F_Name" :placeholder="$t('languageType.addModal.placeholderName')"></el-input>
									</el-form-item>
								</el-col>
								<el-col>
									<el-form-item :label="$t('languageType.addModal.labelCode')" prop="F_Code">
										<el-input v-model="languageTypeForm.F_Code" :placeholder="$t('languageType.addModal.placeholderCode')"></el-input>
									</el-form-item>
								</el-col> -->
								<el-col v-show="hasFormPermission('code')">
									<el-form-item :label="$t('language.languageType.languageTypeSelect')" prop="code">
										<el-select v-model="F_Code.code" :placeholder="$t('language.languageType.placeholderSelect')">
											<el-option
											  v-for="(item,idx) in langCode"
											  :key="idx"
											  :label="$t('language.languageCategory.'+item.F_Code)"
											  :value="idx">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button 
                            size="mini" 
                            type="primary" 
                            @click="submitForm('languageTypeForm')" 
                            :loading="flagAddLg"
                            >
                            {{flagAddLg?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                            </el-button>
                        </span>
                    </el-dialog>

            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
    import {getLanguageType,addLanguageType,editLanguageType,deleteLanguageType,setLanguage} from '@/api/language/type'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
	import { deepClone,formValidateNotice} from '@/util/util';
	import {i18n_code} from "@/lang/index"
    export default {
        name: "LanguageType",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent},
        data() {
            return {
                flagAddLg: false,
                searchParam: {},
                languageType: [],
				langCode:i18n_code,
				F_Code:{
					code:""
				},
                languageTypeForm: {
                    F_Name: '',
                    F_Code: '',
					F_IsMain:0
                },
                dialogVisible: false,
				swichDic:[{
				  label:'',
				  value:0
				},{
				  label:'',
				  value:1
				}],
                rules: {
                    code: [
                        { required: true, message:this.$t('language.languageType.hintlanguageType'), trigger: 'change' }
                    ]
                },
                option: {
                    highlightCurrentRow:true,
                    stripe: false,
                    menuWidth: 150,
                    border: false,
                    page: false,
                    index: true,
                    indexLabel:this.$t('language.translation.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    column: [
                        {
                            sortable: true,
                            label: this.$t('language.languageType.tabName'),
                            prop: 'F_Name',
							align: 'left',
                        }, {
                            sortable: true,
                            label: this.$t('language.languageType.tabCode'),
                            prop: 'F_Code',
							align: 'left',
                        }, {
                            sortable: true,
                            label: this.$t('language.languageType.tabDefaultLanguage'),
                            prop: 'F_IsMain',
                            slot: true,
							align: 'left',
                        }
                    ]
                },
            }
        },
        created() {
            this.getLanguageType();
        },
        methods: {
            /* 获取语言类型 */
            getLanguageType(obj) {
                getLanguageType(obj).then(res => {
                    this.languageType = res.data.data
                })
            },
            /* 单击行 */
            currentRow(row) {
				this.$nextTick(function(){
					this.languageTypeForm = deepClone(row);
				})              
            },
            /* 设为主语言 */
            setLanguage() {
                if (this.languageTypeForm.F_Id === undefined) {
                    this.$message({
                        message: this.$t('deletePrompt.hintSelectData'),
                        type: 'warning'
                    });
                    return;
                }
				const h = this.$createElement;
				this.$msgbox({
				  title:this.$t('language.languageType.Hint.titlePrompt'),
				  message: h('div', null, [
					h('div', null, [
						h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
						h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('language.languageType.Hint.setDefaultLanguage'))]),
					h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('language.languageType.Hint.setRemind'))
				  ]),
				  showCancelButton: true,
				  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
				  cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
				  beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
					  instance.confirmButtonLoading = true;
					  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
					  setLanguage(this.languageTypeForm.F_Id).then(() => {
						  instance.confirmButtonLoading = false;
					      this.$notify({
					          title:this.$t('deletePrompt.successTitle'),
					          message:this.$t('deletePrompt.setSuccessfully'),
					          type: 'success'
					      });
					      this.getLanguageType();
						  done();
					  }).catch(() => {instance.confirmButtonLoading = false;})
					} else {
					  done();
					}
				  }
				}).then(action => {}).catch(() => {});
            },
            /* 打开 */
            openDialog() {
                this.dialogVisible = true;
				if(this.$refs['languageTypeForm']) this.$refs['languageTypeForm'].resetFields()
				if(this.languageTypeForm.F_Id) delete this.languageTypeForm.F_Id;
				this.languageTypeForm.F_IsMain=0;
            },
            /* 关闭 */
            closeDialog() {
                this.dialogVisible = false;
				//if(this.$refs['languageTypeForm']) this.$refs['languageTypeForm'].resetFields()
            },
            /* 提交 */
            submitForm(formName) {
                this.flagAddLg = true;
                this.$refs[formName].validate((valid,object) => {
                    if (valid) {
						Object.assign(this.languageTypeForm,this.langCode[this.F_Code.code])
                        if(!this.languageTypeForm.F_Id) {
                            addLanguageType(this.languageTypeForm).then((res) => {
                                this.dialogVisible = false;
                                this.getLanguageType();
																if(res.data.success){
																	this.showMessage('add','ok')
																}else{
																	this.showMessage('add','no')
																}
                            }).finally(() => {
                                this.flagAddLg = false;
                            }).catch(()=>{
															this.showMessage('add','no')
														});
                        } else {
                            editLanguageType(this.languageTypeForm.F_Id,this.languageTypeForm).then((res) => {
                                this.dialogVisible = false;
                                this.getLanguageType();
																if(res.data.success){
																	this.showMessage('edit','ok')
																}else{
																	this.showMessage('edit','no')
																}
                            }).finally(() => {
                                this.flagAddLg = false;
                            }).catch(()=>{
															this.showMessage('edit','no')
														});
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        this.flagAddLg = false;
                        return false;
                    }
                });
            },
						showMessage(type,status){
							let msg=type=='add'?
							(status=='ok'?this.$t('languageTypeMaintenanceAddedSuccessfully'):this.$t('newLanguageTypeMaintenanceFailed')):
							(status=='ok'?this.$t('languageTypeMaintenanceAndModificationSuccessfully'):this.$t('languageTypeMaintenanceFailed'))
							this.$notify({
								title:this.$t('deletePrompt.successTitle'),
								message:msg,
								type:status=='ok'?'success':'error'
							});
						},
            /* 编辑 */
            editForm(row) {
				this.dialogVisible = true; 
				if(this.$refs['languageTypeForm']) this.$refs['languageTypeForm'].resetFields()
				this.$nextTick(function(){
					this.languageTypeForm = deepClone(row);
					let idx=this.langCode.findIndex(o=>{return o.F_Code==row.F_Code})
					if(idx>=0) this.F_Code.code=idx
				})                              
            },
            /* 删除 */
            deleteForm(row) {
				if(row.F_IsMain==1){
					this.$message.error(this.$t('language.languageType.Hint.noDeleted'));
				}else{
					const h = this.$createElement;
					this.$msgbox({
					  title:this.$t('language.languageType.Hint.titlePrompt'),
					  message: h('div', null, [
						h('div', null, [
							h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
							h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('language.languageType.Hint.deletedLanguage'))]),
						h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('language.languageType.Hint.deletedData'))
					  ]),
					  showCancelButton: true,
					  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
					  cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
					  beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
						  instance.confirmButtonLoading = true;
						  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
						  deleteLanguageType(row.F_Id).then(() => {
							  instance.confirmButtonLoading = false;
						      this.$notify({
						          title:this.$t('deletePrompt.successTitle'),
						          message:  this.$t('deletePrompt.successDeleted'),
						          type: 'success'
						      });
						      this.getLanguageType();
							  done();
						  });
						} else {
						  done();
						}
					  }
					}).then(action => {}).catch(() => {});
				}
            },

            /* 搜索 */
            search() {
                this.getLanguageType(this.searchParam);
            },
            /* 搜索 表单重置 */
            searchReset() {
                this.searchParam = {};
                this.getLanguageType();
            },
        },
    }
</script>

<style scoped>
    /* css */
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
</style>