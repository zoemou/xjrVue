<template>
    <div class="main-container">
        <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="0" padding-top="94">
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
                    <avue-crud ref="codeRule" :data="codeRule" :option="option" stripe :page.sync="page" 
                               :showColumn="showColumn" :isSaveColumns="true"
                               @on-load="onPageLoad"
                               @sort-change="sortChange" 
                               @row-dblclick="handleRowDBLClick">
                        <template slot-scope="scope" slot="menuLeft">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}
                            </el-button>
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
                            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                        </template>
                    </avue-crud>

                    <!-- 新增 -->
                    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('codeRule.addModal.modalTitle')" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                               :before-close="closeDialog">
                        <div class="form code-rule-form">
                            <el-form ref="codeRuleForm" :rules="rules" :model="codeRuleForm" label-width="80px">
                                <el-row>
                                    <el-col :span="12" v-show="hasFormPermission('F_EnCode')">
                                        <el-form-item :label="$t('codeRule.addModal.labelNumber')" prop="F_EnCode">
                                            <el-input v-model="codeRuleForm.F_EnCode" :placeholder="$t('codeRule.addModal.placeholderNumber')"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" v-show="hasFormPermission('F_FullName')">
                                        <el-form-item :label="$t('codeRule.addModal.labelName')" prop="F_FullName">
                                            <el-input v-model="codeRuleForm.F_FullName" :placeholder="$t('codeRule.addModal.placeholderName')"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24" v-show="hasFormPermission('F_Description')">
                                        <el-form-item prop="F_Description" :label="$t('codeRule.addModal.labelDescription')">
                                            <el-input v-model="codeRuleForm.F_Description"
                                                      :placeholder="$t('codeRule.addModal.placeholderDescription')"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <div class="code-rule-table">
                                    <div class="cr-table">
                                        <avue-crud :data="codeRuleData" :option="codeRuleOption" v-if="codeRuleOption.column.length>0" @row-click="currentCRRow">
                                            <template slot-scope="scope" slot="menuLeft">
                                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="openCR">{{$t('buttonModule.addBtn')}}</el-button>
                                                <el-button size="mini" @click="editCR">{{$t('tableOperationModule.editorBtn')}}</el-button>
                                                <el-button size="mini" @click="deleteCR">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                                            </template>
                                            <template slot-scope="scope" slot="menuRight">
                                                {{$t('codeRule.addModal.menuRightTitle')}}
                                            </template>
                                        </avue-crud>
                                    </div>
                                </div>
                            </el-form>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button 
                            size="mini" 
                            type="primary"
                            @click="submitForm('codeRuleForm')" 
                            :loading="flagCodeRule"
                            >{{flagCodeRule?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('codeRule.addModal.addDialog.dialogTitle')" :append-to-body="true" :visible.sync="dialogVisibleCR" width="25%"
                               :before-close="closeCR">
                        <div class="form">
                            <el-form ref="codeRuleTableForm" :rules="rulesCR" :model="codeRuleTableForm" label-width="50px">
                                <el-form-item :label="$t('codeRule.addModal.addDialog.labelPrefix')" prop="itemTypeName" v-show="hasFormPermission('itemTypeName')">
                                    <el-select v-model="codeRuleTableForm.itemTypeName" placeholder=""  style="width: 100%" @change="itemTypeNameChange">
                                        <el-option v-for="(item,index) in itemTypeNameType" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <span class="dept-prompt" v-if="this.codeRuleTableForm.itemTypeName == '部门'">{{$t('codeRule.addModal.addDialog.hintFirstDate')}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('codeRule.addModal.addDialog.labelFormat')" prop="formatStr" v-show="hasFormPermission('formatStr')">
                                    <el-input v-model="codeRuleTableForm.formatStr" placeholder="" v-if="codeRuleTableForm.itemTypeName === '自定义'"></el-input>
                                    <el-select v-model="codeRuleTableForm.formatStr" placeholder="" style="width: 100%" v-if="codeRuleTableForm.itemTypeName === '日期'">
                                        <el-option v-for="(item,index) in dateRule" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <el-select v-model="codeRuleTableForm.formatStr" placeholder="" style="width: 100%" v-if="codeRuleTableForm.itemTypeName === '流水号'">
                                        <el-option v-for="(item,index) in numberRule" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <el-select v-model="codeRuleTableForm.formatStr" placeholder="" style="width: 100%" v-if="codeRuleTableForm.itemTypeName === '公司'">
                                        <el-option v-for="(item,index) in companyRule" :key="index" :label="$t(item.name)" :value="item.val"></el-option>
                                    </el-select>
                                    <el-select v-model="codeRuleTableForm.formatStr" placeholder="" style="width: 100%" v-if="codeRuleTableForm.itemTypeName === '部门'">
                                        <el-option v-for="(item,index) in departmentRule" :key="index" :label="$t(item.name)" :value="item.val"></el-option>
                                    </el-select>
                                    <el-select v-model="codeRuleTableForm.formatStr" placeholder="" style="width: 100%" v-if="codeRuleTableForm.itemTypeName === '用户'">
                                        <el-option v-for="(item,index) in userRule" :key="index" :label="$t(item.name)" :value="item.val"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('codeRule.addModal.addDialog.labelStep')" prop="stepValue" v-show="hasFormPermission('stepValue')">
                                    <el-input v-model="codeRuleTableForm.stepValue" 
									@blur="blurValue('stepValue')" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
									:placeholder="$t('codeRule.addModal.placeholderPositiveInteger')" type="number" v-if="codeRuleTableForm.itemTypeName === '流水号'"></el-input>
                                    <el-input v-model="codeRuleTableForm.stepValue" placeholder="" disabled v-else></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('codeRule.addModal.addDialog.labelInitial')" prop="initValue" v-show="hasFormPermission('initValue')">
                                    <el-input v-model="codeRuleTableForm.initValue" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
									 @blur="blurValue('initValue')" :placeholder="$t('codeRule.addModal.placeholderFormat')" type="number" v-if="codeRuleTableForm.itemTypeName === '流水号'"></el-input>
                                    <el-input v-model="codeRuleTableForm.initValue" placeholder="" disabled v-else></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('codeRule.addModal.addDialog.labelDescription')" prop="description" v-show="hasFormPermission('description')">
                                    <el-input v-model="codeRuleTableForm.description" placeholder=""></el-input>
                                </el-form-item>
                            </el-form>
                        </div>

                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeCR">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button size="mini" type="primary"
                                       @click="submitCRForm('codeRuleTableForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
                        </span>
                    </el-dialog>

            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../page/main/MainContent";
    import {getCodeRule,addCodeRule,editCodeRule,deleteCodeRule} from '@/api/system/coderule'
    import {getOrder,formValidateNotice} from "../../util/util";
    import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
    import authorizeMixin from "@/mixins/authorize";
    import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
    import { deepClone } from "@/utils/index"; 
    import {validateDesLength,validateLength} from "@/api/organization/validateFunc";
	const orgerRule=[{type:3,name:'companyNumber',val:'code'},{type:3,name:'code.rightPanel.companyName',val:'name'},
	{type:4,name:'wechatAndDingTalk.departmentManagement.tableDepNumber',val:'code'},{type:4,name:'orgDepartManagement.tabName',val:'name'},
	{type:5,name:'userId',val:'code'},{type:5,name:'userName',val:'name'}]
    export default {
        name: "CodeRule",
        mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        components: {MainContent},
        data() {
			
            return {
                flagCodeRule: false,
                contentTitle: '编码列表',
                contentSubTitle: '',
                searchParam: {},
                codeRule: [],
                codeRuleForm: {},
                dialogVisible: false,
                page: {
                    pageSize: 20,
                    total: 0,
                    currentPage: 1
                },
                rules: {
                    F_EnCode: [
                        {required: true, message: this.$t('codeRule.addModal.placeholderNumber'), trigger: 'change'},
                        { validator:validateLength,trigger:'change'}
                    ],
                    F_FullName: [
                        {required: true, message:this.$t('codeRule.addModal.placeholderName'), trigger: 'change'},
                        { validator:validateLength,trigger:'change'}
                    ],
                    F_Description: [{ validator:validateDesLength,trigger: 'change'}],
                    
                },
                option: {
                    highlightCurrentRow: true,
                    stripe: false,
                    menuWidth: 150,
                    border: false,
                    page: true,
                    index: true,
                    indexLabel:this.$t('codeRule.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    column: [
                        {
                            sortable: true,
                            label:this.$t('codeRule.tableObjectNumber'),
                            prop: 'F_EnCode',
							minWidth:'100',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('codeRule.tableObjectName'),
                            prop: 'F_FullName',
							minWidth:'100',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('codeRule.tableSerialNumber'),
                            prop: 'F_CurrentNumber',
							width:'140',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('codeRule.tableCreateUser'),
                            prop: 'F_CreateUserName',
							width:'100',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('codeRule.tableCreateTime'),
                            prop: 'F_CreateDate',
							width:'140',
							align:'left'
                        }, {
                            sortable: true,
                            label:this.$t('codeRule.tableDescription'),
                            prop: 'F_Description',
							align:'left'
                        }
                    ]
                },
                dialogVisibleCR: false,
                codeRuleData: [],
                codeRuleTableForm:{
                    itemTypeName:'自定义',
                    itemType : 0
                },
                itemTypeNameType:['自定义','日期','流水号','公司','部门','用户'],
                itemTypeArr: [0,1,2,3,4,5],
                dateRule:['mmdd','ddmm','mmyy','yymm','yyyy','yy','yyyymm','yymmdd','yyyymmdd'],
                numberRule:['000','0000','00000','000000'],
                companyRule:orgerRule.filter(o=>{return o.type==3}),
                departmentRule:orgerRule.filter(o=>{return o.type==4}),
                userRule:orgerRule.filter(o=>{return o.type==5}),
                rulesCR: {
                    itemTypeName: [
                        {required: true, message:this.$t('codeRule.addModal.Hint.Prefix'), trigger: 'change'}
                    ],
                    formatStr: [
                        {required: true, message:this.$t('codeRule.addModal.Hint.Format'), trigger: 'change'},
                        { validator:validateLength,trigger:'change'}
                    ],
                    stepValue: [{max:10,message:this.$t('lengthTenCharacter'),trigger:'change'}],
                    initValue: [{max:6,message:this.$t('lengthSixCharacter'),trigger:'change'}],
                    description: [ {validator:validateDesLength,trigger:'change'}]
                },
                codeRuleOption: {
                    menu: false,
                    highlightCurrentRow: true,
                    stripe: false,
                    menuWidth: 150,
                    maxHeight: 280,
                    border: true,
                    page: false,
                    index: true,
                    indexLabel: this.$t('codeRule.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    refreshBtn: false,
                    searchBtn: false,
                    column: []
                },
                index:'',
                CRflag: false
            }
        },
        created() {
            this.getCodeRule();
		},
        methods: {
			handleEditAvueSth(){
				if(this.hasFormPermission('itemTypeName')){
					this.codeRuleOption.column.push({
						label:this.$t('codeRule.addModal.tablePrefix'),
						prop: 'itemTypeName'
					})
				}
				if(this.hasFormPermission('formatStr')){
					this.codeRuleOption.column.push({
						label:this.$t('codeRule.addModal.tableFormat'),
						prop: 'formatStr',
						formatter:((row,value,label,column)=>{
								
							let str=value
							let temp=orgerRule.filter(o=>{return o.type==row.itemType})
							if(temp&&temp.length>0){
								temp.forEach(o=>{
									if(o.val==value)
									str= o.name
								})
							}					
							return this.$t(str)
						})
					})
				}
				if(this.hasFormPermission('stepValue')){
					this.codeRuleOption.column.push({
						label: this.$t('codeRule.addModal.tableStep'),
						prop: 'stepValue'
					})
				}
				if(this.hasFormPermission('initValue')){
					this.codeRuleOption.column.push({
						label: this.$t('codeRule.addModal.tableInitValue'),
						prop: 'initValue'
					})
				}
				if(this.hasFormPermission('description')){
					this.codeRuleOption.column.push({
						label: this.$t('codeRule.tableDescription'),
						prop: 'description'
					})
				}
				
			},
            handleRowDBLClick (row, event) {
                if(this.openDoubleClickEdit){
                    this.editForm(row)
                }
            },
			blurValue(str){
				let arg=str=='initValue'?/(^[0-9]\d*$)/:/(^[1-9]\d*$)/
				if(!(arg.test(this.codeRuleTableForm[str]))){
					this.codeRuleTableForm[str]=""
				}
			},
            getCodeRule(obj) {
                getCodeRule(obj).then(res => {
                    this.codeRule = res.data.data.Rows
                    this.page.total = res.data.data.Total
                })
            },
            /* 打开 */
            openDialog() {
                this.flag = true;
                this.dialogVisible = true;
                this.codeRuleForm = {}
                this.codeRuleData = []
                this.codeRuleTableForm = {}
            },
            /* 关闭 */
            closeDialog() {
                this.$refs['codeRuleForm'].resetFields()
                this.dialogVisible = false;
            },
            /* 提交 */
            submitForm(formName) {
                this.flagCodeRule = true;
                this.$refs[formName].validate((valid,object) => {
                    if (valid) {
                        if (this.flag) {
                            addCodeRule(this.codeRuleForm).then(() => {
                                this.dialogVisible = false;
                                this.getCodeRule();
                            }).finally(() => {
                                this.flagCodeRule = false;
                            });
                        } else {
                            editCodeRule(this.codeRuleForm.F_RuleId,this.codeRuleForm).then(() => {
                                this.dialogVisible = false;
                                this.getCodeRule();
                            }).finally(() => {
                                this.flagCodeRule = false;
                            })
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        this.flagCodeRule = false;
                        return false;
                    }
                });
            },
            /* 编辑 */
            editForm(row) {
                this.flag = false;
                this.dialogVisible = true;
                this.codeRuleForm = deepClone(row);
                this.codeRuleData = this.codeRuleForm.F_RuleFormatJson? JSON.parse(this.codeRuleForm.F_RuleFormatJson):[];
                this.codeRuleTableForm.F_RuleFormatJson = this.codeRuleForm.F_RuleFormatJson? JSON.parse(this.codeRuleForm.F_RuleFormatJson):[];
            },
            /* 删除 */
            deleteForm(row) {
                this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText:  this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    deleteCodeRule(row.F_RuleId).then(() => {
                        this.$notify({
                            title: this.$t('deletePrompt.successTitle'),
                            message:  this.$t('deletePrompt.successDeleted'),
                            type: 'success'
                        });
                        this.getCodeRule();
                    });
                }).catch(() => {

                });
            },
            /* 取消 */
            cancelDialog() {
            },
            /* 弹窗打开 */
            openCR() {
                this.CRflag = true;
                this.dialogVisibleCR = true;
                this.codeRuleTableForm = {
                    itemTypeName:'自定义',
                    itemType: 0
                }
            },
            itemTypeNameChange(val) {
  
            let index = 0;
            this.itemTypeNameType.filter((item,idx)=>{
                return item == val && (index = idx);
            })
            this.codeRuleTableForm.itemTypeName = val;
            this.codeRuleTableForm.itemType = this.itemTypeArr[index];
            },
            /* 弹窗提交 */
            submitCRForm(formName) {
                this.$refs[formName].validate((valid,object) => {
					if(this.codeRuleTableForm.itemType==2){
						valid=this.codeRuleTableForm.stepValue==0?false:true;
						if(!valid) return
						if(
                            this.codeRuleTableForm
                            &&this.codeRuleTableForm.formatStr
                            &&this.codeRuleTableForm.initValue&&
                            this.codeRuleTableForm.formatStr.length&&
                            this.codeRuleTableForm.initValue.length&&
                            this.codeRuleTableForm.formatStr.length!=this.codeRuleTableForm.initValue.length){
							this.$message({
								message:this.$t('codeRule.addModal.Hint.initialValueLength'),
								type: 'warning'
							});
							valid=false;
						}else{
							if(this.codeRuleTableForm.formatStr==this.codeRuleTableForm.initValue){
								this.$message({
									message:this.$t('codeRule.addModal.Hint.initialValueFormat'),
									type: 'warning'
								});
								valid=false;
							}else{
								valid=true;
							}							
						}
					}
                    if (valid) {
                        if (this.CRflag) {
                            this.codeRuleData.push(this.codeRuleTableForm);
                            this.codeRuleForm.F_RuleFormatJson = JSON.stringify(this.codeRuleData);
                            this.dialogVisibleCR = false;
                            this.codeRuleTableForm = {}
                        } else {
							this.codeRuleData.splice(this.index, 1,this.codeRuleTableForm);
                            this.codeRuleForm.F_RuleFormatJson = JSON.stringify(this.codeRuleData);
                            this.dialogVisibleCR = false;
                        }
                    } else {
						formValidateNotice(object,this,this.formEnCodeList)
                        return false;
                    }
                });
            },
            /* 弹窗编辑 */
            currentCRRow(row){
                this.codeRuleTableForm =deepClone(row);
                this.index = row.$index;
            },
            editCR(){
                if (this.index === '') {
                    this.$message({
                        message:this.$t('deletePrompt.hintSelectData'),
                        type: 'warning'
                    });
                    return;
                }
                this.CRflag = false;
                this.dialogVisibleCR = true;
            },
            /* 弹窗删除 */
            deleteCR(){
                if (this.index === '') {
                    this.$message({
                        message:this.$t('deletePrompt.hintSelectData'),
                        type: 'warning'
                    });
                    return;
                }

                this.$confirm(this.$t('deletePrompt.promptContent'),  this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    this.codeRuleData.splice(this.index, 1);
					this.codeRuleForm.F_RuleFormatJson = JSON.stringify(this.codeRuleData);
                }).catch(() => {

                });

            },
            /* 弹窗关闭 */
            closeCR() {
                this.dialogVisibleCR = false;
            },
            /* 搜索 */
            search() {
                this.getCodeRule(this.searchParam);
            },
            /* 搜索 表单重置 */
            searchReset() {
                this.searchParam = {};
                this.getCodeRule();
            },
            /* 分页 */
            sortChange(data) {
                this.searchParam.order = getOrder(data.order)
                this.searchParam.orderfield = data.prop

                this.getCodeRule(this.searchParam);
            },
            onPageLoad(page) {
                this.searchParam.limit = page.currentPage
                this.searchParam.size = page.pageSize
                this.getCodeRule(this.searchParam);
            }
        },
    }
</script>

<style scoped>
    /* public */
    .cl:after, .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .cl, .clearfix {
        zoom: 1
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    /* css */
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
    div /deep/.el-dialog__body >.form .el-form >.el-form-item{
        position: relative;
		margin-top:0;
		padding-bottom: 18px;
	}
    .dept-prompt{
      color: #F56C6C;
			font-size: 12px;
			line-height: 1;
			padding-top: 0px;
			position: absolute;
			left: 0;
			margin-top: 0px;
			display: block;
    }
	
	@media screen and (max-width: 1370px) {
	    /deep/.el-dialog{
		margin-top:8vh!important;
	   }
	     
	}
.code-rule-form	/deep/.avue-crud__left{
	margin: 0px 0px 10px 0px;
	float: left;
}
</style>