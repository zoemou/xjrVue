<template>
    <div class="main-container">
        <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="0" :padding-top="94">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
				<div class="search-box">
                <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                          style="width: 200px; margin-right: 5px"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
				</div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                    <avue-crud ref="databaseField" :data="databaseField" :option="option" :showColumn="showColumn" :isSaveColumns="true" @row-dblclick="handleRowDBLClick">
                        <template slot-scope="scope" slot="menuLeft">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
                        </template>
                        <template slot-scope="scope" slot="menu">
                          <el-button type="opr-primary" size="mini" @click="viewForm(scope.row)" v-if="hasButtonPermission('view')">{{$t('tableOperationModule.viewBtn')}}</el-button>
                          <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
                          <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('databaseManage.databaseField.addModalTitle')" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                               :before-close="closeDialog">
                        <div class="form" v-if="dialogVisible">
                            <el-form ref="databaseFieldForm" :rules="rules" :model="databaseFieldForm" label-width="70px">
                                <el-form-item :label="$t('databaseManage.databaseField.addModalName')" prop="F_Name" v-show="hasFormPermission('F_Name')">
                                    <el-input v-model="databaseFieldForm.F_Name" :placeholder="$t('databaseManage.databaseField.addModalWriteName')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('databaseManage.databaseField.addModalDescribe')" prop="F_Remark" v-show="hasFormPermission('F_Remark')">
                                    <el-input v-model="databaseFieldForm.F_Remark" :placeholder="$t('databaseManage.databaseField.addModalWriteDescribe')"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('databaseManage.databaseField.addModalDateType')" prop="F_DataType" v-show="hasFormPermission('F_DataType')">
                                    <el-select v-model="databaseFieldForm.F_DataType" :placeholder="$t('databaseManage.databaseField.addModalSelectDateType')" size="small" style="width: 100%">
                                        <el-option
                                                v-for="item in dataType"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('databaseManage.databaseField.addModalDateLength')" prop="F_Length" v-show="hasFormPermission('F_Length')">
                                    <el-input v-model="databaseFieldForm.F_Length" :placeholder="$t('databaseManage.databaseField.addModalWriteDateLength')"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button 
                            size="mini" 
                            type="primary" 
                            @click="submitForm('databaseFieldForm')" 
                            :loading="flagDataBase"
                            >
                            {{flagDataBase?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                            </el-button>
                        </span>
                    </el-dialog>

            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
    import {getDbField,addDbField,editDbField,deleteDbField} from '@/api/databasemanage/databasefield'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize"; //鉴权混入
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
	import { deepClone,formValidateNotice } from '@/util/util';
    import {validateLength,validateDesLength} from "@/api/organization/validateFunc";
    export default {
        name: "DatabaseField",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent},
        data() {
            const sortReg = /^[0-9]{1,10}$/;
            var sortValidate = (rule,value,callback) => {
            if(/^[0-9]{1,}$/.test(value)){
                if(!sortReg.test(value)&&value){
                    callback(new Error('不能超过10个字符'));
                }else{
                    callback();
            }
            }else{
                callback(new Error('请输入数字'))
            }
            };
            return {
                flagDataBase: false,
                contentTitle: '字段列表',
                contentSubTitle: '',
                searchParam: {},
                databaseField: [],
                databaseFieldForm: {
									F_Name:'',
									F_Remark:'',
									F_DataType:'',
									F_Length:''
								},
                dialogVisible: false,
                dataType:['varchar','int','datetime','double','float','decimal','text'],
                rules: {
                    F_Name: [
                        { required: true, message: this.$t('databaseManage.databaseField.addModalWriteName'), trigger: 'blur' },
                        { validator: validateLength,trigger:'change'}
                    ],
                    F_Remark: [
                        { required: true, message: this.$t('databaseManage.databaseField.addModalWriteDescribe'), trigger: 'blur' },
                        { validator: validateDesLength,trigger:'change'}
                    ],
                    F_DataType: [
                        { required: true, message: this.$t('databaseManage.databaseField.addModalSelectDateType'), trigger: 'change' }
                    ],
                    F_Length: [
                        { required: true, message: this.$t('databaseManage.databaseField.addModalWriteDateLength'), trigger: 'blur' },
                        {validator: sortValidate, trigger:'change'}
                    ],
                },
                option: {
                    highlightCurrentRow:true,
                    stripe: false,
                    menuWidth: 180,
                    border: false,
                    page: false,
                    index: true,
                    indexLabel: this.$t('databaseManage.databaseField.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    column: [
                        {
                            label: this.$t('databaseManage.databaseField.tableName'),
                            prop: 'F_Name',
							align: 'left',
							sortable:true
                        }, {
                            label:this.$t('databaseManage.databaseField.tableDescribe'),
                            prop: 'F_Remark',
							align: 'left',
							sortable:true
                        }, {
                            label: this.$t('databaseManage.databaseField.addModalDateType'),
                            prop: 'F_DataType',
							width:"100",
							align: 'left',
							sortable:true
                        },{
                            label: this.$t('databaseManage.databaseField.tableFieldLength'),
                            prop: 'F_Length',
							width:"100",
							align: 'left',
							sortable:true
                        }, {
                            label: this.$t('databaseManage.databaseField.tableFounder'),
                            prop: 'F_CreateUserName',
							width:"100",
							align: 'left',
							sortable:true
                        }, {
                            label: this.$t('databaseManage.databaseField.tableCreationTime'),
                            prop: 'F_CreateDate',
							width:"140",
							align: 'left',
							sortable:true
                        }
                    ]
                },
            }
        },
        created() {
            this.getDatabaseField();
        },
        methods: {
            handleRowDBLClick (row, event) {
                if(this.openDoubleClickEdit){
                    this.editForm(row)
                }
            },
            /* 获取语言类型 */
            getDatabaseField(obj) {
                getDbField(obj).then(res => {
                    this.databaseField = res.data.data.Rows
                })
            },

            /* 打开 */
            openDialog() {
                this.flag = true;
                this.dialogVisible = true;
                this.databaseFieldForm = {}
            },
            /* 关闭 */
            closeDialog() {
              this.dialogVisible = false;             
            },
            /* 提交 */
            submitForm(formName) {
                this.flagDataBase = true;
                this.$refs[formName].validate((valid,object) => {
                    if (valid) {
                        if(this.flag) {
                            addDbField(this.databaseFieldForm).then(() => {
                                this.dialogVisible = false;
                                this.getDatabaseField();
                            }).finally(() => {
                                this.flagDataBase = false;
                            });
                        } else {
                            editDbField(this.databaseFieldForm.F_Id,this.databaseFieldForm).then(() => {
                                this.dialogVisible = false;
                                this.getDatabaseField();
                            }).finally(() => {
                                this.flagDataBase = false;
                            })
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        this.flagDataBase = false;
                        return false;
                    }
                });
            },
          viewForm (row) {
            this.$refs['databaseField'].rowView(row);
          },
            /* 编辑 */
            editForm(row) {
                this.flag = false;
                this.dialogVisible = true;
                this.databaseFieldForm = deepClone(row);
            },
            /* 删除 */
            deleteForm(row) {
                this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    deleteDbField(row.F_Id).then(() => {
                        this.$notify({
                            title: this.$t('deletePrompt.successTitle'),
                            message:this.$t('deletePrompt.successDeleted'),
                            type: 'success'
                        });
                        this.getDatabaseField();
                    });
                }).catch(() => {

                });
            },
            /* 取消 */
            cancelDialog() {},
            /* 搜索 */
            search() {
                this.getDatabaseField(this.searchParam);
            },
            /* 搜索 表单重置 */
            searchReset() {
                this.searchParam = {};
                this.getDatabaseField();
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
	
	div /deep/.el-form-item{
			margin-bottom:12px!important;
		}
</style>