<template>
    <div class="main-container">
        <main-content :title="$t('mobileDev.functionDesignStepEight.headTitle')" :paddingLeft="0" :search="false" :paddingTop="40">
            <div slot="table">
				<p class="head_title">{{$t('mobileDev.functionDesignStepEight.headTitle')}}</p>  
				<div class="baseinfo-form">
					<el-form  :rules="rules" ref="menuForm" :model="menuForm" label-width="120px" :validate-on-rule-change="false" >
						<el-row  class="row-box">
							<el-col :span="12">
								<el-form-item prop="F_EnCode" :label="$t('menuManagement.addModal.labelNumber')">
									<el-input :placeholder="$t('menuManagement.addModal.placeholderNumber')" size="small"
											  v-model="menuForm.F_EnCode"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  prop="F_FullName"  :label="$t('menuManagement.addModal.labelName')">
									<el-input :placeholder="$t('menuManagement.addModal.placeholderName')" size="small"
											  v-model="menuForm.F_FullName"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_LgMarkCode" :label="$t('menuManagement.addModal.labelTransTag')">
									<!-- <avue-input-tree default-expand-all
															disabled
															v-model="menuForm.F_LgMarkCode"
															:placeholder="$t('menuManagement.addModal.placeholderTransTag')" type="tree"
															:dic="transDefaultTree" size="small"
															style="width: 100%"></avue-input-tree> -->

									<el-select
										v-model="menuForm.F_LgMarkCode"                            
										filterable
										remote
										reserve-keyword
										:placeholder=" $t('menuManagement.addModal.placeholderTransTag')"
										:remote-method="remoteMethod"
                  						style="width:100%"
										:loading="loading"
										clearable>
										<el-option
										v-for="item in transDefaultTree"
										:key="item.F_Id"
										:label="item.F_Name"
										:value="item.F_EnCode">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
																					
						</el-row>
						<el-row class="row-box">
							<el-col :span="12">
								<el-form-item prop="F_SubSystemId" :label="$t('webOwnSystem')">
								  <SelectionSystem :isEdit="isEdit"  v-model="menuForm.F_SubSystemId" :formItemLabelWidth="120" @changeSystem="toggleSystem"></SelectionSystem>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_ParentId"  :label="$t('webOwnSuperior')">
									<div  v-if="allSystem.length"> 
										<div v-for="(item,idx) in allSystem" :key="idx">
											<avue-input-tree
											    default-expand-all
											    v-model="menuForm.F_ParentId"
											    :placeholder="$t('selectWebOwnSuperior')"
											    type="tree"
											    :dic="defaultTree"
											    size="small"
											    style="width: 100%"
											    v-if="item.F_Id == menuForm.F_SubSystemId"
											></avue-input-tree>
										</div>
									</div>
									<avue-input-tree
									    default-expand-all
									    v-model="menuForm.F_ParentId"
									    :placeholder="$t('selectWebOwnSuperior')"
									    type="tree"
									    :dic="defaultTree"
									    size="small"
									    style="width: 100%"
									    v-else
									></avue-input-tree>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_Icon" :label="$t('webFunctionIcon')">
									<el-input :placeholder="$t('selectWebFunctionIcon')" size="small" v-model="menuForm.F_Icon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon('F_Icon')"></i>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_SortCode" :label="$t('webFunctionOrder')">
									<el-input type="number" :placeholder="$t('selectWebFunctionOrder')" size="small"
											  v-model="menuForm.F_SortCode"></el-input>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="24">
								<el-form-item prop="F_IsMenu" :label="$t('webMenuOption')">
									<el-checkbox v-model="menuForm.F_IsMenu">{{$t('menuManagement.addModal.checkboxMenu')}}</el-checkbox>
								</el-form-item>
							</el-col> -->
						</el-row>
						<el-row class="row-box" v-if="baseData.step6.appCode">
							<el-col :span="12">
							  <el-form-item prop="F_AppCatalog" :label="$t('mobileOwnClassify')">
								<el-select :placeholder="$t('selectMobileOwnClassify')" v-model="menuForm.F_AppCatalog" style="width: 100%;">
									<el-option
									v-for="item in diogbaseData"
									:key="item.F_ItemDetailId"
									:label="item.F_ItemName"
									:value="item.F_ItemValue">
									</el-option>
								</el-select>
							  </el-form-item>
							</el-col>							
							<el-col :span="12">
								<el-form-item prop="F_AppIcon" :label="$t('mobileFunctionIcon')">
									<el-input :placeholder="$t('selectMobileFunctionIcon')" size="small" v-model="menuForm.F_AppIcon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon('F_AppIcon')"></i>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_AppSortCode" :label="$t('mobileFunctionOrder')">
									<el-input type="number" :placeholder="$t('selectMobileFunctionOrder')" size="small"
											  v-model="menuForm.F_AppSortCode"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item :label="$t('menuManagement.addModal.labelDescription')">
									<el-input type="textarea" :placeholder="$t('menuManagement.addModal.placeholderDescription')" size="small"
											  v-model="menuForm.F_Description"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
            </div>
        </main-content>
		<el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('menuManagement.addModal.iconModal.modalTitle')" :append-to-body="true" :visible.sync="IconVisible" width="80%"
		           :before-close="handleClose" style="padding: 10px 20px;">
			<FontHtml v-on:childByValue="childByValue"></FontHtml>
		</el-dialog>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
	import FontHtml from "../../FontAwesome.vue";
	import {FormatMenuTree,LanguageFormatTree} from "../../../util/util.js";
	import {
		getMenuTreeBySystem
	} from '@/api/systemManagement/menu'
	import {getLgMarkList} from '@/api/language/translation'
	import { mapGetters } from "vuex";
	
	import {
	  getDataItemDetail
	} from '@/api/databasemanage/datasource';
	import SelectionSystem from '@/components/common/SelectionSystem';
    export default {
		components: {MainContent, FontHtml,SelectionSystem},
		props:["baseData"],
        data() {
            return {
							isEdit:false,
				IconName:'',
				diogbaseData:[],
				defaultTree:[],  //对树数据的处理
				transDefaultTree:[],
				IconVisible:false,
                menuForm: {
					F_EnCode:'',
                    F_ModuleId: "",
					F_ParentId:"",
                    F_Icon: "fa fa-cube",
                    F_Cache: false,
					F_Public:false,
                    F_IsMenu: true,
                    F_FullName: "",
					F_Description:"",
					F_SubSystemId: '0',
					F_AppCatalog:'',
					F_AppIcon:'fa fa-mobile',
					F_AppSortCode:''
                },               
                rules: {
					F_SubSystemId: [
                        { required: true, message:this.$t('menuManagement.addModal.placeholderSystem'), trigger: 'blur' },
                    ],
                    F_EnCode: [
                        { required: true, message:this.$t('menuManagement.addModal.placeholderNumber'), trigger: 'blur' },
                    ],
                    F_FullName: [
                        { required: true, message:this.$t('menuManagement.addModal.placeholderName'), trigger: 'blur' }
                    ],
                    F_SortCode:[
                        { required: true, message:this.$t('fillWebFunctionOrder'), trigger: 'blur' },
                    ],
					// F_ParentId:[
					// 	 { required: true, message:this.$t('selectWebOwnSuperior'), trigger: 'change' },
					// ],
					F_Icon:[
						 { required: true, message:this.$t('selectWebFunctionIcon'), trigger: 'change' },
					],
					F_IsMenu:[
						 { required: true, message:this.$t('selectWebMenuOption'), trigger: 'change' },
					],
					F_AppCatalog:[
						 { required: true, message:this.$t('selectMobileOwnClassify'), trigger: 'change' },
					],
					F_AppIcon:[
						 { required: true, message:this.$t('selectMobileFunctionIcon'), trigger: 'change' },
					],
					F_AppSortCode:[
					    { required: true, message:this.$t('fillMobileFunctionOrder'), trigger: 'blur' },
					]
                }
            }
        },
        created() {
			//如果整串JSON 存在moduleData  数据 代表是已经保存过模板 生成过代码
			if(this.baseData.step8&&JSON.stringify(this.baseData.step8)!="{}"){
				//把已有的菜单复现再表单
				this.menuForm = {...this.baseData.step8}
				this.isEdit = true;
			}
			// this.menuForm.F_SubSystemId = this.allSystem[0]?.F_Id || '0';
			// this.toggleSystem(this.menuForm.F_SubSystemId);
			if(this.menuForm.F_LgMarkCode){
				getLgMarkList({
					keyword:this.menuForm.F_LgMarkCode
				}).then(res => {
				
					this.transDefaultTree = res.data.data;
				
				});
			}
			
			getDataItemDetail('function').then(res=>{
				if (res.data.success) {
				  if (res.data.data.length > 0) {
				    this.diogbaseData = res.data.data;
				  }
				}
			});
			
        },
		computed: {
			...mapGetters(["allSystem", "systemId"]),
		},
        methods: {
			/* 获取翻译标记 */
		  remoteMethod(query) {
				const searchObj = {
					keyword:query
				}
				getLgMarkList(searchObj).then(res => {
				
					this.transDefaultTree = res.data.data;
				
				});
			},
			toggleSystem(systemId){
				getMenuTreeBySystem(systemId)
				.then(res=>{
					let {code,data} = res.data;
					code || (this.defaultTree = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children'));
					// this.menuForm.F_ParentId = '';
					// this.menuForm.F_SubSystemId = systemId;
				})
			},
            /* 关闭弹窗 */
            handleClose(done) {
                //this.$refs['menuForm'].resetFields(); 
                done();
            },

			selectMoreIcon(icon){
				this.IconName=icon;
				this.IconVisible=true;
			},
			childByValue: function (childValue) {
				// childValue就是子组件传过来的值
				this.menuForm[this.IconName] = childValue;
				this.IconVisible=false;
			},
			validateData(){
				let flag=false;
				this.$refs['menuForm'].validate((valid) => {
					if (valid) {
						this.menuForm.F_IsMenu = 1
						this.$emit("onChange",this.menuForm)
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
    div /deep/ .companiesuser-form .el-form-item {
        margin-bottom: 12px;
    }

    /* css */
    .main-container {
        height: 100%;
        padding:20px;
    }
	.head_title{
		font-size: 12px;
		font-weight: bold;
		width: 100%;
		border-bottom: 1px solid #f2f2f2;
		margin-top:-10px;
		line-height: 40px;
		color: #4d4d4d;
	}
	div /deep/ .main-table-content{
		border-top: none;
	}
	.row-box{
		border-bottom: 2px dotted #DFE4ED ;padding:0 0 20px;margin-bottom: 20px;
	}
</style>