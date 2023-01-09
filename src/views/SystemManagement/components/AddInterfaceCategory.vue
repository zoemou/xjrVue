<template>
    <el-dialog 
        v-dialogDrag
		v-bind="$attrs"
        :title="dialogTitle"
        :append-to-body="true"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="40%"
        style="padding: 10px 20px;"
        :before-close="cancelBtn"
    >
        <div class="baseinfo-form">
            <el-form 
                :model="interfaceForm" 
                :rules="rules" 
                ref="interfaceForm" 
                label-width="100px" 
                :validate-on-rule-change="false"
            >
                                        
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="F_Name" v-show="hasFormPermission('F_Name')" :label="$t('interfaceClassName')">
                            <el-input :placeholder="$t('enterInterfaceClassName')" size="small" :readonly="readOnly" v-model="interfaceForm.F_Name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="F_EnCode" v-show="hasFormPermission('F_EnCode')" :label="$t('interfaceClassCode')">
                            <el-input :placeholder="$t('enterInterfaceClassCode')" size="small" :readonly="readOnly" v-model="interfaceForm.F_EnCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="F_ParentId" v-show="hasFormPermission('F_ParentId')" :label="$t('interfaceClassSuperior')">
                            <!-- 接口分类上级下拉选择树***尚未处理 -->
                            <avue-input-tree
                                default-expand-all
                                v-model="interfaceForm.F_ParentId"
                                :placeholder="$t('menuManagement.addModal.placeholderSuperior')"
                                type="tree"
                                :dic="defaultTree"
                                size="small"
                                style="width: 100%"
								:disabled="readOnly"
                            >
                            </avue-input-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="F_SortCode" v-show="hasFormPermission('F_SortCode')" :label="$t('workFlow.categoryList.labelSort')">
                            <el-input 
                                :placeholder="$t('enterSortNumber')" 
                                size="small" 
                                type="number" 
                                v-model="interfaceForm.F_SortCode"
								 :readonly="readOnly"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="F_Description" v-show="hasFormPermission('F_Description')" :label="$t('code.codeStepTwoListStructure.remark')">
                            <el-input
                                type="textarea"
                                :placeholder="$t('workFlow.addStamp.placeholderRemark')"
                                size="small"
                                v-model="interfaceForm.F_Description"
								 :readonly="readOnly"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>        
        </div>
        <span class="dialog-footer" slot="footer" v-if="!readOnly">
            <el-button size="mini" @click="cancelBtn()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
            <el-button 
                type="primary" 
                size="mini" 
                @click="submitBtn()" 
                :loading="flagInterface"
            >{{flagInterface?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { FormatTree,formValidateNotice } from "../../../util/util.js";
import {getInterfaceCategoryList,deleteInterfaceCategory,addInterfaceCategory,updateInterfaceCategory} from '@/api/systemManagement/interfaceCategory';

export default {
    name: "AddInterfaceCategory",
    props:{
        dialogTitle: {
            type: String,
        },
		readOnly:{
			type:Boolean,
			default:false
		},
        CategoryId: {//绑定F_Id
            type: String,
        },
        interfaceForm: {
            type: Object,
            default: function () {
                return {
                    F_Name: "",
                    F_EnCode: "",
                    F_ParentId: "",
                    F_Description: "",
                    F_SortCode: ""
                };
            },
        },
        defaultTree: {
            type: Array,
            default: function () {
                return []
            }
        },
		formEnCodeList:''
    },
    data () {
        return {
            flagInterface: false,
            rules: {
                F_Name: [
                    {required: true, message: this.$t('enterInterfaceClassName'), trigger: 'blur'}
                ],
                F_EnCode: [
                    {required: true, message:this.$t('enterInterfaceClassCode'), trigger: 'blur'}
                ],            
            },
        };
    },
    mounted () {
        this.getInterfaceCategoryList()
    },
    methods: {
		hasFormPermission(encode){
		  if(this.formEnCodeList===undefined){
			  return true;
		  }else{
			  if(this.formEnCodeList&&this.formEnCodeList[encode]){
				return true;
			  }else{
				return false;
			  }
		  }
		},
         /*获取分类 */
        getInterfaceCategoryList () {
            getInterfaceCategoryList().then(res => {
                this.defaultTree = FormatTree(
                    res.data.data,
                    "F_Id",
                    "F_Name",
                    "children"
                );
                })
        },
        /* 提交表单 */
        submitBtn() {
			this.flagInterface = true;
            this.$refs["interfaceForm"].validate((valid,object) => {
				if(valid){
					if (this.CategoryId) {
						updateInterfaceCategory(this.CategoryId,this.interfaceForm).then(() => {
							this.$emit('update:visible', false);	
							this.$emit('submitRes',true)
							this.CategoryId="";
						}).finally(() => {
							this.flagInterface = false;
						})
					} else {
						addInterfaceCategory(this.interfaceForm).then(() => {
							this.$emit('update:visible', false);
							this.$emit('submitRes',true)
						}).finally(() => {
							this.flagInterface = false;
						})                          
					}
				}else{
					if(this.formEnCodeList!==undefined) formValidateNotice(object,this,this.formEnCodeList)
					this.flagInterface = false;
					return
				}
			})
        },
        cancelBtn(){
			this.$emit('update:visible', false);
            this.$refs['interfaceForm'].resetFields();			
		}
    }
}
</script>
