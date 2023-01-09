<template>
    <div class="main-container">
        <main-fixed :title="fixedTitle">
            <div slot="list">
                <!-- 在此处放置左侧列表内容 -->
                <!-- 数据字典分类树 -->
                <el-tree :data="menuTree" :props="defaultProps" node-key="F_CompanyId" ref="cTree"
                         :default-expand-all="true"  @node-click="handleNodeClick"></el-tree>
            </div>
        </main-fixed>
        <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="205" :padding-top="40" :search="false"
		style=""
		>
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
				 <div class="menu-search-box">
                <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                          style="width: 200px; margin-right:5px; margin-left: 8px;"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
				</div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <div class="table">
                    <avue-crud ref="dataDictionary" v-if="option.column.length > 0" :data="dataDictionary" :option="option" @row-click="currentRow">
                        <template slot-scope="scope" slot="menuLeft">
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button  type="opr-primary" size="mini" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
                            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :title="$t('language.menuFunction.titleEditDataTra')" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                               :before-close="closeDialog">
                        <div class="form">
                            <el-form ref="dataDictionaryForm" :model="dataDictionaryForm" label-width="80px">

                                <el-form-item v-for="(item,index) in option.column" :label="item.label" :key="index">
                                    <el-input v-model="dataDictionaryForm[item.prop]" :placeholder="$t('language.menuFunction.placeholderFill') + item.label"></el-input>
                                </el-form-item>
                                <!--                                <el-form-item label="简体中文" prop="Chinese">-->
                                <!--                                    <el-input v-model="dataDictionaryForm.Chinese" placeholder="请填写简体中文" disabled></el-input>-->
                                <!--                                </el-form-item>-->
                                <!--                                <el-form-item label="English" prop="english">-->
                                <!--                                    <el-input v-model="dataDictionaryForm.english" placeholder="请填写English"></el-input>-->
                                <!--                                </el-form-item>-->
                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button size="mini" type="primary" @click="submitForm('dataDictionaryForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
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
    import {getDataDictionaryTree,getDataDictionary,editDataDictionary,getLgType,deleteDataDictionary,searchDataDictionary} from '@/api/language/dictionary'
    import {getMenuTree} from '@/api/language/menufunction'
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    export default {
        name: "MenuFunction",
        mixins: [tableOptionMixin],
        components: {MainFixed,MainContent},
        data() {
            return {
				computedHeight:-60,
                fixedTitle: this.$t('language.menuFunction.fixedTitle'),
                contentTitle: '功能信息',
                contentSubTitle: '',
                searchParam: {},
                menuTree:[],
                dataDictionary: [],
                moduleId:'',
                lgType : [],
                dataDictionaryForm: {
                    // traditionalchinese: '',
                    // Chinese: '',
                    // english: '',
                },
                currentIds : [],
                submitFormData : {},
                dialogVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'F_FullName'
                },
                // rules: {
                //     traditionalchinese: [
                //         { required: true, message: '请填写繁体中文', trigger: 'change' }
                //     ],
                //     Chinese: [
                //         { required: true, message: '请填写简体中文', trigger: 'change' }
                //     ],
                //     english: [
                //         { required: true, message: '请填写English', trigger: 'change' }
                //     ],
                // },
                option: {
                    highlightCurrentRow:true,
                    stripe: true,
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
                        // {
                        //     sortable: true,
                        //     label: '繁体中文',
                        //     prop: 'traditionalchinese'
                        // }, {
                        //     sortable: true,
                        //     label: '简体中文',
                        //     prop: 'Chinese'
                        // }, {
                        //     sortable: true,
                        //     label: 'English',
                        //     prop: 'english',
                        // }
                    ]
                },
            }
        },
        created() {
            this.getMenuTree();
            this.getLanguageType();
        },
        methods: {
            /* 获取字典分类树 */
            getMenuTree() {
                getMenuTree().then(res => {
                    this.menuTree = res.data.data
                })
            },
            getLanguageType(){
                getLgType().then(res => {
                    this.lgType = res.data.data

                    res.data.data.forEach((item) => {
                        const obj = {
                            sortable: false,
                            label : item.F_Name,
                            prop : item.F_Code
                        }
                        this.option.column.push(obj);
                    })
                })
            },
            /* 选择树形菜单加载公司用户信息 */
            handleNodeClick(data) {
                this.moduleId = data.F_ModuleId
                this.getDataDictionary(data.F_ModuleId)
            },
            /* 获取字典数据 */
            getDataDictionary(id) {
                getDataDictionary(id).then(res => {
                    this.dataDictionary = res.data.data
                    this.FormatResult(this.dataDictionary);
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
            /* 单击行 */
            currentRow(row) {
                this.dataDictionaryForm = deepClone(row);

            },
            /* 打开 */
            openDialog() {
                this.flag = true;
                this.dialogVisible = true;
                this.languageTypeForm = {}
            },
            /* 关闭 */
            closeDialog() {
                this.dialogVisible = false;
            },
            /* 提交 */
            submitForm(formName) {


                this.submitFormData = {
                    Code : this.dataDictionaryForm.F_Code,
                    Value : []
                }

                for (const key in this.dataDictionaryForm){
                    if(key !== "F_Code" && key !== "$index"){
                        this.submitFormData.Value.push({
                            [key] : this.dataDictionaryForm[key]
                        })
                    }
                }



                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.flag) {

                        } else {
                            editDataDictionary(this.submitFormData).then(() => {
                                this.dialogVisible = false;
                                this.getDataDictionary(this.moduleId)
                            })
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
                this.dataDictionaryForm = row;
            },
            /* 删除 */
            deleteForm(row) {
                this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText:this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    deleteDataDictionary(row.F_Code).then(() => {
                        this.dialogVisible = false;
                        this.getDataDictionary(this.moduleId)
                    })
                }).catch(() => {

                });
            },
            /* 取消 */
            cancelDialog() {},
            /* 搜索 */
            search() {
                searchDataDictionary(this.moduleId,this.searchParam).then((res) => {
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

<style scoped >
    /* css */
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
.menu-search-box{
	position: absolute;
	margin: 6px 0px 6px 0px;
	z-index: 99;
}
/deep/ .avue-crud__right{
	position: static!important;
	float: right;
	margin-bottom: 8px;
}
/deep/ .avue-crud__left{
	margin: 0px;
}
</style>