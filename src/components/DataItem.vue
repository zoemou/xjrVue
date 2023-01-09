<template>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="baseData.title" :append-to-body="true" :visible.sync="baseData.dialogVisible" width="30%"
               :before-close="closeDialog">
        <div class="form">
            <el-form ref="dataItemForm" :rules="rules" :model="dataItemForm" label-width="80px">
                <el-form-item :label="$t('dataItem.addModal.labelName')" prop="F_ItemName">
                    <el-input v-model="dataItemForm.F_ItemName" :placeholder="$t('dataItem.addModal.placeholderName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('dataItem.addModal.labelValue')" prop="F_ItemValue">
                    <el-input v-model="dataItemForm.F_ItemValue" :placeholder="$t('dataItem.addModal.placeholderValue')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('dataItem.tableSort')" prop="F_SortCode">
                    <el-input v-model="dataItemForm.F_SortCode" :placeholder="$t('dataItem.addModal.placeholderValue')" type="number"></el-input>
                </el-form-item>
                <el-form-item :label="$t('dataItem.tableDescription')">
                    <el-input type="textarea" :placeholder="$t('dataItem.addModal.placeholderRemarks')" size="small"
                              :autosize="{ minRows: 4, maxRows: 4}"
                              v-model="dataItemForm.F_Description"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
            <el-button size="mini" type="primary" @click="submitForm('dataItemForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
	import {addDataItem,editDataItem,getDataItem} from '@/api/system/dataitem';
    export default {
        name: "DataItem",
        props:{
			baseData:{
				type: Object,
				      // 对象或数组默认值必须从一个工厂函数获取
				default: function () {
					return {
						title: '',
						dialogVisible:false,
						isAdd:true,
						F_ParentId:'',
						F_ItemId:'',
						F_ItemDetailId:''
					}
				}				
			}           
        },
		data(){
			return {
				dataItemForm: {
				    F_ItemName:'',
				    F_ItemValue:'',
					F_SortCode:'',
					F_Description:''
				},
				rules: {
				    F_ItemName: [
				        { required: true, message:this.$t('dataItem.addModal.placeholderName'), trigger: 'change' }
				    ],
				    F_ItemValue: [
				        { required: true, message:this.$t('dataItem.addModal.hintItemValue'), trigger: 'change' }
				    ],
				    F_SortCode: [
				        { required: true, message:this.$t('dataItem.addModal.hintSort'), trigger: 'change' }
				    ],
				}
			}
		},
		methods:{
			closeDialog(){
				this.$emit('closepop'); 
			},
			submitForm(formName) {
				this.dataItemForm.F_ItemId=this.baseData.F_ItemId;
				this.dataItemForm.F_ParentId=this.baseData.F_ParentId;
			    this.$refs[formName].validate((valid) => {
			        if (valid) {
			            if(this.baseData.isAdd) {
			                addDataItem(this.dataItemForm).then(() => {
			                    this.$emit('closepop',this.dataItemForm); 
			                });
			            } else {
			                editDataItem(this.baseData.F_ItemDetailId,this.dataItemForm).then(() => {
			                    this.$emit('closepop',this.dataItemForm); 
			                })
			            }
			        } else {
			            return false;
			        }
			    });
			}
		}
    }
</script>

<style scoped>
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

    .user-list {

    }

    .user-box {
        float: left;
        width: 33.3%;
        height: 66px;
        padding: 0 5px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }

    .user-item {
        width: 100%;
        height: 66px;
        color: #303133;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        overflow: hidden;
        transition: .3s;
        box-sizing: border-box;
		position: relative;
    }
	
	.user-item.gou{
		border: 1px solid #F56C6C;
	}

    .user-box img {
        float: left;
        width: 66px;
        height: 66px;
        margin-right: 15px;
    }

    .user-box .user-info {
        padding-left: 81px;
        box-sizing: border-box;
    }

    .user-box .user-info p {
        height: 22px;
        margin: 0;
        font-size: 12px;
        line-height: 22px;
    }
	.user-item i{
		display: none;
	}
	.user-item i.gou{
		display: block;
		position: absolute;
		right: 0px;
		top: 0;
		color: #fff;
		width: 0;
		height: 0;
		border-width: 0 30px 30px 0px;
		border-style: solid;
		border-color: #F56C6C #F56C6C transparent transparent;
		font-weight: bold;
		font-size: 14px;
		text-indent: 1em;
		line-height: 20px;
	}
</style>