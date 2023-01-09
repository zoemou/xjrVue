<template>
    <!--<div class="main-container">
        <iframe style="width: 100%; min-height: 100%;" id="show-iframe"  frameborder="0" name="showHere" scrolling="auto"
                src="/XJR-pa/modules/SystemManagement/DataAuthorize/index.htm"></iframe>
    </div>-->
    <div class="main-container">
        <main-fixed :title="fixedTitle">
            <div slot="list">
                <!-- 在此处放置左侧列表内容 -->
                <div slot="list">
                    <!-- 在此处放置左侧列表内容 -->
                    <div class="list-box">
                        <ul>
                            <li v-for="(item,index) in formShecmesTree" :key="index" :class="{'active': isActive === index}" @click="checkedItem(item,index)">{{item.F_Name}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main-fixed>
        <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="210" :padding-top="94" :search="true">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <el-input v-model="searchParam.keyword" size="small" placeholder="请输入要查询的关键字"
                          style="width: 200px; margin-right: 10px"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="searchReset">重置</el-button>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <div class="table">
                    <avue-crud ref="formRelation"  :data="formRelation" :option="option" @row-click="currentRow">
                        <template slot-scope="scope" slot="menuLeft">
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button type="opr-primary" icon="el-icon-edit" size="mini" @click="editForm(scope.row)">编辑</el-button>
                            <el-button type="opr-primary" icon="el-icon-delete"  size="mini" @click="deleteForm(scope.row)">删除</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :close-on-click-modal="false" title="编辑数据权限" :append-to-body="true" :visible.sync="dialogVisible" width="50%"
                               :before-close="closeDialog">
                        <div class="form">
                            <el-form ref="formRelationForm" :rules="rules" :model="formRelationForm" label-width="80px">

                                <el-form-item label="名称" prop="F_Name">
                                    <el-input v-model="formRelationForm.F_Name" placeholder="请填写名称"></el-input>
                                </el-form-item>
                                <el-form-item label="过滤条件">
                                    <el-button type="text" @click="addCondition">添加更多条件</el-button>
                                    <div class="condition-box" v-for="(item,index) in conditionList">
                                        <el-input size="mini"  placeholder="" style="margin-right: 20px" v-model="item.F_FieldName + ' ' + item.F_SymbolName + ' ' + item.F_FiledValue"></el-input>
                                        <div style="flex-shrink: 0">
                                            <el-button size="mini" @click="editCondition(item,index)">编辑</el-button>
                                            <el-button size="mini" @click="deleteCondition(item,index)">删除</el-button>
                                        </div>
                                    </div>
                                </el-form-item>

                                <el-form-item label="公式"  prop="F_Formula">
                                    <el-input v-model="formRelationForm.F_Formula" placeholder="请输入公式,默认为 1 and 2 and 3 这种且方式">
                                        <i slot="suffix" class="el-input__icon el-icon-warning"></i>
                                    </el-input>
                                </el-form-item>

                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">取 消</el-button>
                            <el-button size="mini" type="primary" @click="submitForm('formRelationForm')">确 定</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog v-dialogDrag :close-on-click-modal="false" title="添加自定义查询条件" :append-to-body="true" :visible.sync="conditionDialog" width="40%"
                               :before-close="closeConditionDialog">
                        <div class="form">
                            <el-form ref="filterConditionForm"  :rules="ConditionRules" :model="filterConditionForm" label-width="100px">

                                <el-form-item label="选择字段" prop="F_FieldName">
                                    <el-select v-model="filterConditionForm.F_FieldName" :value="filterConditionForm.F_FieldName" placeholder="请选择字段" style="width:100%">
                                        <el-option v-for="(item,index) in findInterFaceData" :key="index"  :label="item" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="比较符" prop="F_Symbol">
                                    <el-select v-model="filterConditionForm.F_Symbol" :value="symbolList[filterConditionForm.F_Symbol]" placeholder="请选择比较符" style="width:100%" @change="symbolChange">
                                        <el-option v-for="(item,index) in symbolList"  :key="index" :label="item" :value="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="字段值类型" prop="F_FieldType">
                                    <el-select v-model="filterConditionForm.F_FieldType" :value="fieldTypeList[filterConditionForm.F_FieldType]" placeholder="请选择字段值类型" style="width:100%" @change="fieldTypeChange">
                                        <el-option v-for="(item,index) in fieldTypeList" :key="index"  :label="item" :value="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="字段值" prop="F_FiledValue">
                                    <el-input v-model="filterConditionForm.F_FiledValue" @input="InputChange" :value="filterConditionForm.F_FiledValue" placeholder=""></el-input>
                                </el-form-item>

                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeConditionDialog">取 消</el-button>
                            <el-button size="mini" type="primary" @click="conditionSubmitForm('filterConditionForm')">确 定</el-button>
                        </span>
                    </el-dialog>

                </div>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainFixed from "../../../page/main/MainFixed";
    import MainContent from "../../../page/main/MainContent";
    import { deepClone } from '../../../util/util'
    import {getFormSchemeTree,getFormRelation,getFormScheme,findInterFace,getCondition,updateDataRelation,deleteDataRelation} from '@/api/dataauthorize/dataauthorize'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    export default {
        name: "DataAuthorize",
        mixins: [tableOptionMixin],
        components: {MainFixed,MainContent},
        data() {
            return {
                fixedTitle: '接口目录',
                contentTitle: '数据权限信息',
                contentSubTitle: '',
                searchParam: {},
                formShecmesTree:[],
                formRelation: [],
                formRelationForm: {},
                findInterFaceData:[],
                interFaceForm:{},
                filterConditionForm:{
                    F_FieldName:'',
                    symbol:'等于',
                    fieldType:'文本',
                    fieldValue:'',
                },
                filterConditionIndex:0,
                isActive:0,
                condition:[],
                conditionList:[],
                formShecmesList:[],
                addConditionArray : [],
                submitFormData : {},
                symbolList:['等于','大于','大于等于','小于','小于等于','包含','包含于','不等于','不包含','不包含于'],
                fieldTypeList:['文本','登录者ID','登录者账号','登录者公司','登录者公司及下属公司','登录者部门','登录者部门及下属部门','登录者岗位','登录者角色'],
                dialogVisible: false,
                conditionDialog: false,
                defaultProps: {
                    children: 'children',
                    label: 'F_Address'
                },
                rules:{
                    F_Name: [
                        { required: true, message: '请选择名称', trigger: 'change' }
                    ],
                    F_Formula: [
                        { required: true, message: '请选择公式', trigger: 'change' }
                    ],
                },
                ConditionRules: {
                    F_FieldName: [
                        { required: true, message: '请选择字段', trigger: 'change' }
                    ],
                    F_Symbol: [
                        { required: true, message: '请选择比较符', trigger: 'change' }
                    ],
                    F_FieldType: [
                        { required: true, message: '请选择字段类型', trigger: 'change' }
                    ],
                    F_FiledValue: [
                        { required: true, message: '请选择字段值', trigger: 'change' }
                    ],
                },
                option: {
                    highlightCurrentRow:true,
                    stripe: true,
                    menuWidth: 150,
                    border: true,
                    page: false,
                    index: true,
                    indexLabel: '序号',
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    column: [
                        {
                            sortable: true,
                            label: '名称',
                            prop: 'F_Name'
                        }, {
                            sortable: true,
                            label: '用户/角色',
                            prop: 'F_FullName',
							minWidth:'100'
                        }, {
                            sortable: true,
                            label: '公式',
                            prop: 'F_Formula',
                        }, {
                            sortable: true,
                            label: '创建人',
                            prop: 'F_CreateUserName',
							width:'100'
                        }, {
                            sortable: true,
                            label: '创建时间',
                            prop: 'F_CreateDate',
							width:'140'
                        }
                    ]
                },
            }
        },
        created() {
            this.getFormShecmeTree();
        },
        methods: {
            InputChange(){
                this.filterConditionForm = deepClone(this.filterConditionForm)
            },
            /* 获取接口树 */
            getFormShecmeTree() {
                getFormShecmeTree().then(res => {
                    this.formShecmesTree = res.data.data
                    this.checkedItem(res.data.data[0],0)

                })
            },
            /* 获取数据权限信息 */
            getFormRelation(param){
                getFormRelation(param).then(res => {
                    this.formRelation = res.data.data.Rows

                })
            },
            checkedItem(item,index){
                this.isActive = index;
                this.searchParam.Type = 2;
                this.searchParam.FormId = item.F_Id;
                this.getFormRelation(this.searchParam);
                this.getFormScheme();
      
            },
            /* 获取条件 */
            getCondition(id) {
                getCondition(id).then(res => {
                    this.conditionList = res.data.data
                })
            },
            getFormScheme(id) {
                getFormScheme(id).then(res => {
                    this.formShecmesList = res.data.data
                })
            },
            /* 字段类型与字段值对应 */
            fieldTypeChange(val) {
                if(val === 0) {
                    this.filterConditionForm.F_FiledValue = ''
                    this.$nextTick(() => {
                        this.$refs['filterConditionForm'].clearValidate();
                    });
                }else {
                    this.filterConditionForm.F_FiledValue = this.fieldTypeList[val]
                }

                this.filterConditionForm.F_FieldType = val
                this.filterConditionForm.F_FiledValueType = val
            },
            symbolChange(val) {
                this.filterConditionForm.F_Symbol = val
                this.filterConditionForm.F_SymbolName = this.symbolList[val]
            },
            /* 单击行 */
            currentRow(row) {
                this.formRelationForm = deepClone(row);
            },
            /* 打开 */
            openDialog() {
                /*this.flag = true;*/
                this.dialogVisible = true;
                this.languageTypeForm = {}
            },
            /* 添加条件弹窗 */
            addCondition() {
                this.flag = true
                this.conditionDialog = true;
                let that = this;
                this['filterConditionForm'] = {};
                this.$nextTick(() => {
                    that.$refs['filterConditionForm'].clearValidate()
                });
            },
            /* 关闭 */
            closeDialog() {
                this.dialogVisible = false;
            },
            closeConditionDialog(){
                this.conditionDialog = false;
            },
            /* 提交 */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dataRelationForm.dataConditions = this.conditionList
                        updateDataRelation(this.dataRelationForm.F_Id,this.dataRelationForm).then(() => {
                            this.dialogVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            conditionSubmitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            this.conditionList.push(this.filterConditionForm);
                            this.conditionDialog = false;
                        }else {
                            this.conditionList[this.filterConditionIndex] = this.filterConditionForm;
                            this.conditionDialog = false;
                        }

                    } else {
                        return false;
                    }
                });
            },
            /* 编辑 */
            editForm(row) {
                this.flag = false;
                this.dialogVisible = true;
                this.dataRelationForm = row;
   
                this.getCondition(row.F_DataRelationId)

            },
            editCondition(item,index) {
                this.flag = false;
                this.conditionDialog = true;
                this.filterConditionForm = item
                this.filterConditionIndex = index
                let that =this;
                this.$nextTick(() => {
                    that.$refs['filterConditionForm'].clearValidate()
                });

            },
            /* 删除 */
            deleteForm(row) {
                this.$confirm('确定要删除此项吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDataRelation(row.F_Id).then(() => {
                        this.getDataRelation(this.searchParam);
                    })
                }).catch(() => {

                });
            },
            deleteCondition(item,index) {
                this.conditionList.splice(index,1);
            },
            /* 取消 */
            cancelDialog() {},

            /* 搜索 */
            search() {
                searchDataDictionary(this.itemId,this.searchParam).then((res) => {
                    this.FormatResult(res.data.data);
                })
            },
            /* 搜索 表单重置 */
            searchReset() {
                this.searchParam = {};
            },
        },
    }
</script>

<style scoped>
    /* css */
    .main-container {
        height: 100%;
        padding: 0 10px;
    }
    .list-box ul{
        padding-left: 0px;
        margin: 0;
    }
    .list-box ul>li {
        position:relative;
        height: 34px;
        line-height: 34px;
        padding-left: 20px;
        cursor: pointer;
        border-left: 5px solid #fff;
        font-size: 14px;
    }
    .list-box ul>li:hover
    {
        background-color:#F5F5F5;
        border-left:5px solid #409EFF;
    }
    .list-box ul>li.active {
        background-color:#F5F5F5;
        border-left:5px solid #409EFF;
    }
    .condition-box {
        display: flex;
        justify-content: space-between;
    }
</style>