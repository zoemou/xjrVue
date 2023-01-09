<template>
    <div class="main-container">
        <main-content title="菜单信息配置" :paddingLeft="0" :search="false" :paddingTop="40">
            <div slot="table">
				<p class="head_title">{{$t('mobileDev.functionDesignStepEight.headTitle')}}</p> 
				<div class="baseinfo-form">
					<el-form  :rules="rules" ref="menuForm" :model="menuForm" label-width="80px" :validate-on-rule-change="false" >
						<el-row>
							<el-col :span="12">
								<el-form-item  prop="F_Name"  :label="$t('mobileDev.functionDesignStepEight.functionName')">
									<el-input :placeholder="$t('mobileDev.functionDesignStepEight.placeholderFunctioName')" size="small"
											  v-model="menuForm.F_Name"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_Icon" :label="$t('mobileDev.functionDesignStepEight.functionIcon')">
									<el-input :placeholder="$t('mobileDev.functionDesignStepEight.placeholderFunctionIcon')" size="small" v-model="menuForm.F_Icon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon"></i>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item prop="F_Type"  :label="$t('mobileDev.functionDesignStepEight.labelFunType')">
									<el-select v-model="menuForm.F_Type" :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSelect')" style="width:100%">
										<el-option
										v-for="item in diogbaseData"
										:key="item.F_ItemDetailId"
										:label="item.label"
										:value="item.F_ItemDetailId">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_SortCode" :label="$t('mobileDev.functionDesignStepEight.labelSort')">
									<el-input type="number" :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSort')" size="small"
											  v-model="menuForm.F_SortCode"></el-input>
								</el-form-item>
							</el-col>
						</el-row>				
					</el-form>
				</div>
            </div>
        </main-content>
		<el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.functionDesignStepEight.titleSelectIcon')" :append-to-body="true" :visible.sync="IconVisible" width="80%"
		           :before-close="handleClose" style="padding: 10px 20px;">
			<FontHtml v-on:childByValue="childByValue"></FontHtml>
		</el-dialog>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
	import FontHtml from "../../FontAwesome.vue";
	import { getDictInfoByCode } from '@/api/language/dictionary.js';
	import {mobileCategory} from '@/components/mobileDesign/config';
	import {mapGetters} from "vuex"
    export default {
		components: {MainContent, FontHtml},
		computed: {
			...mapGetters(['MDAllStepData'])
		},
        data() {
            return {
				diogbaseData:mobileCategory,
				defaultTree:[],  //对树数据的处理
				IconVisible:false,
                menuForm: {
					F_SortCode:'',
					F_Icon: "",
					F_Type:"",
                    F_Name: ""
                },               
                rules: {
                    F_Type: [
                        { required: true, message:this.$t('mobileDev.functionDesignStepEight.hintFunType'), trigger: 'change' },
                    ],
                    F_Name: [
                        { required: true, message:this.$t('mobileDev.functionDesignStepEight.placeholderFunctioName'), trigger: 'blur' }
                    ],
                    F_SortCode:[
                        { required: true, message: this.$t('mobileDev.functionDesignStepEight.placeholderSort'), trigger: 'blur' },
                    ]
                }
            }
        },
        created() {
			//this.getDictInfoByCode()
        },
        methods: {
			getDictInfoByCode(){
				this.diogbaseData=[];

			},
            /* 关闭弹窗 */
            handleClose(done) {
                //this.$refs['menuForm'].resetFields(); 
                done();
            },

			selectMoreIcon(){
				this.IconVisible=true;
			},
			childByValue: function (childValue) {
				// childValue就是子组件传过来的值
				this.menuForm.F_Icon = childValue;
				this.IconVisible=false;
			},
			validateData(){
				let flag=false;
				this.$refs['menuForm'].validate((valid) => {
					if (valid) {
						this.menuForm.F_IsMenu = 1
						this.MDAllStepData.stepEight=this.menuForm
						flag= true;
					}else{
						flag= false;
					}
				})
				return flag;
			}
        }
    }
</script>

<style scoped>
    /* reset css */
    ::v-deep .companiesuser-form .el-form-item {
        margin-bottom: 12px;
    }

    /* css */
    .main-container {
        height: 100%;
        padding: 0 10px;
    }
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top: 0px;
	line-height: 40px;
	color: #4d4d4d;
}	
</style>