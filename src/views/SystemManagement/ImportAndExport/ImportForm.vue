<template>
	<div class="main-container">
		<main-fixed :title="$t('importAndExport.importForm.titleDatabaseForm')" class="fast_import1" style="margin-right: 10px;height: 500px;">
		    <div slot="list">
		        <!-- 在此处放置左侧列表内容 -->
		        <!-- 菜单树形 -->
		        <el-tree :data="dataBaseTree" :props="defaultProps" node-key="F_DatabaseLinkId" ref="cTreeBase"
		                 :default-expand-all="false" :load="loadNode" lazy  @node-click="handleNodeClick">
		        </el-tree>
		    </div>
		</main-fixed>
		<main-fixed :title="$t('importAndExport.importForm.titleDataFField')" class="fast_import2" style="margin-right: 10px;height: 500px;">
		    <div slot="list">
		        <!-- 在此处放置左侧列表内容 -->
		        <!-- 菜单树形 -->
		        <el-tree :data="dataBaseFieldTree" :props="fieldProps" node-key="Name" ref="cTree"
		                 :default-expand-all="false" show-checkbox @check-change="handleCheckChange" :default-checked-keys="fieldAllChecked">
		        </el-tree>
		    </div>
		</main-fixed>
		<main-fixed :title="$t('importAndExport.importForm.titleImportConfigArea')" class="fast_import3" style="width:calc(100% - 420px);height: 500px;">
		    <div slot="list">
		        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" :rules="rules">
		          <el-form-item :label="$t('importAndExport.excelImport.tableName')" prop="moduleName">
		            <el-input v-model="formInline.moduleName" :placeholder="$t('importAndExport.importForm.placeholderTName')" style="width: 120px;"></el-input>
		          </el-form-item>
		          <el-form-item :label="$t('importAndExport.excelImport.tableBtn')" prop="bindBtn">
		            <el-select v-model="formInline.bindBtn" :placeholder="$t('importAndExport.excelExport.placeholderBtn')" style="width: 120px;">
		              <el-option
		                    v-for="item in options"
		                    :key="item.F_ModuleButtonId"
		                    :label="item.F_FullName"
		                    :value="item.F_ModuleButtonId">
		              </el-option>
		            </el-select>
		          </el-form-item>
		          <el-form-item :label="$t('importAndExport.importForm.labelEMechanism')" prop="errorRule">
		            <el-select v-model="formInline.errorRule" style="width: 120px;">
						<el-option :label="$t('importAndExport.importForm.optionJump')" value="1" key="1"></el-option>
						<el-option :label="$t('importAndExport.importForm.optionEnd')" value="0" key="0"></el-option>
					</el-select>
		          </el-form-item>
		        </el-form>
				<avue-crud ref="cuTable" :data="menuTable" :option="option" stripe>
					<template slot-scope="scope" slot="menu">
						<el-button type="primary" size="small" icon="el-icon-setting" @click="setTable(scope.row,scope.index)"></el-button>
					</template>
					
				</avue-crud>
				
				<el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="childDialogVisible" width="50%"
				           :before-close="handleClose" style="padding: 10px 20px;">	
					<div class="companiesuser-form">
						<el-form  :rules="rules" ref="setFieldForm"  :model="setFieldForm" label-width="80px" :validate-on-rule-change="false" >
							<el-col :span="24">
								<el-form-item prop="Name" :label="$t('importAndExport.importForm.labelSetField')">
									<el-input size="small" readonly
											  v-model="setFieldForm.Name"></el-input>						                    
								</el-form-item>
								<el-form-item  prop="F_Description" :label="$t('importAndExport.importForm.labelAType')">
									<el-select v-model="setFieldForm.F_Description" :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
											   size="small" style="width: 100%">
										<el-option
											  v-for="item in Description"
											  :key="item.value"
											  :label="item.label"
											  :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop="F_dataItem" :label="$t('importAndExport.importForm.labelDataOption')" v-if="setFieldForm.F_Description==2">
									<avue-input-tree default-expand-all v-model="form" :placeholder="$t('importAndExport.importForm.selectContent')" type="tree" :dic="setFieldForm.F_dataItem" style="width: 100%;"></avue-input-tree>
								</el-form-item>
								<el-form-item prop="F_dataBase" :label="$t('importAndExport.importForm.labelDataOption')" v-if="setFieldForm.F_Description==3">
									<el-input
									    :placeholder="$t('importAndExport.importForm.selectDataItem')"
									    suffix-icon="el-icon-plus"
									    v-model="setFieldForm.F_showdataBase" @focus="selectDataItem">
									  </el-input>
								</el-form-item>
								<el-form-item prop="F_Value" :label="$t('importAndExport.importForm.labelFixedValue')" v-if="setFieldForm.F_Description==4">
									<el-input
									    :placeholder="$t('importAndExport.importForm.placeholderFixedValue')"
									    v-model="setFieldForm.F_Value">
									  </el-input>
								</el-form-item>
							</el-col>                                 
					    </el-form>
					</div>
				    <span slot="footer" class="dialog-footer">
						<el-button size="mini" type="primary" @click="cancelBtn('setFieldForm')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
				        <el-button size="mini" type="primary"
				                   @click="confirmBtn('setFieldForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
				    </span>
				</el-dialog>
				<el-dialog v-dialogDrag :close-on-click-modal="false" :visible.sync="DialogVisible" :title="$t('importAndExport.importForm.selectDataItem')" width="80%"
				           :before-close="dataItemClose" :append-to-body="true">
					<div class="companiesuser-form">
						<el-form  :inline="true" :rules="rules" ref="dataItemForm"  :model="dataItemForm" label-width="80px" :validate-on-rule-change="false" >
							<el-col :span="24">
								<el-form-item prop="keyword" label="">
									<el-input v-model="dataItemForm.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
									          style="width: 200px; margin-right: 20px"></el-input>								                    
								</el-form-item>
								<el-form-item  prop="showField" :label="$t('importAndExport.importForm.labelShowField')">
									<el-select v-model="dataItemForm.showField" :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
											   size="small" style="width: 100%">
										<el-option
											  v-for="item in showFieldOption"
											  :key="item"
											  :label="item"
											  :value="item">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item  prop="saveField" :label="$t('importAndExport.importForm.labelSaveField')">
									<el-select v-model="dataItemForm.saveField" :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
											   size="small" style="width: 100%">
										<el-option
											  v-for="item in saveFieldOption"
											  :key="item"
											  :label="item"
											  :value="item">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>                                 
					    </el-form>
					</div>
					<avue-crud ref="cuTableTwo" :data="dataItemTable" :option="dataItemOption" stripe @row-click="handleRowClick">
						
					</avue-crud>
					<div style="padding-top: 20px;">{{$t('importAndExport.importForm.selectData')}}：{{curRow.F_Name}} &nbsp;&nbsp;&nbsp;&nbsp;{{$t('importAndExport.importForm.labelShowField')}}：{{dataItemForm.showField}} &nbsp;&nbsp;&nbsp;&nbsp;保存字段：{{dataItemForm.saveField}}</div>
					<span slot="footer" class="dialog-footer">
						<el-button size="mini" type="primary" @click="cancelBtnTwo">{{$t('buttonModule.modalCancelBtn')}}</el-button>
					    <el-button size="mini" type="primary"
					               @click="confirmBtnTwo('dataItemForm')">{{$t('buttonModule.modalSureBtn')}}</el-button>
					</span>
				</el-dialog>
		    </div>
		</main-fixed>
	</div>
</template>

<script>
	import MainFixed from "../../../page/main/MainFixed";
	import {getDbGroup,getDataSource,getDataFieldBySQL} from '@/api/databasemanage/datasource'
	import {getDbLinksTable,getDbFieldByName} from '@/api/databasemanage/databaselink'
	import {getMenuButton} from '@/api/systemManagement/menu'
	import {getDataDictionaryTree} from '@/api/language/dictionary'
	
	import {FormatTree} from "../../../util/util.js";
	
	export default {
	    name: "ImportForm",
		components: { MainFixed},
		props:{
			parameValue:''  //父级传来的菜单id
		},
	    data() {
	        return {
				computedHeight:-60,
				dialogTitle:'',
				dataBaseTree:[],
				defaultProps:{
					children: 'children',
					label: 'label',
					isLeaf: 'leaf'
				},
				F_DatabaseLinkId:'',
				dataBaseFieldTree:[],
				fieldAllChecked:[],
				fieldProps:{
					label: 'Name'
				},
				form:'',
				formInline:{
					moduleName:'',
					bindBtn:null,
					errorRule:'1'
				},
				dataItemForm:{
					keyword:'',
					saveField:'',
					showField:''
				},
				options:[],
				dataItemTable:[],
				rules: {
					bindBtn:[
						{ required: true, message: this.$t('importAndExport.excelExport.hintBtn'),trigger: 'change' }
					],
					moduleName:[
						{ required: true, message:this.$t('importAndExport.importForm.placeholderTName'), trigger: 'blur' }
					],
					F_Description:[
						{ required: true, message:this.$t('importAndExport.importForm.hintSelectAType'), trigger: 'change' }
					],
					showField:[
						{ required: true, message:this.$t('importAndExport.importForm.hintSelectShowField'), trigger: 'change' }
					],
					saveField:[
						{ required: true, message:this.$t('importAndExport.importForm.hintSelectSaveField'), trigger: 'change' }
					]
				},
				menuTable:[],
				curTable:'',
				curRow:{},
				childDialogVisible:false,
				DialogVisible:false,
				option: {
				    highlightCurrentRow: true,
				    stripe: true,
				    header: false,
					menuWidth:80,
				    maxHeight: 370,
				    border: true,
				    index: true,
				    indexLabel:this.$t('importAndExport.importForm.tabNum'),
				    align: 'center',					
				    delBtn: false,
				    editBtn: false,
				    column: [
				        {
				            label: this.$t('importAndExport.importForm.tabField'),
				            prop: 'F_Name'
				        }, {
				            label: this.$t('importAndExport.importForm.tabColName'),
				            prop: 'F_ColName'
				        }, {
				            label: this.$t('importAndExport.importForm.tabOnlyOne'),
				            prop: 'F_OnlyOne',
                            formatter: function (row) {
                                return row.IsKey === 1 ? '唯一' : '不唯一' 
                            }
				        }, {
				            label:this.$t('importAndExport.importForm.tabDescribe'),
				            prop: 'F_Description'
				        }
				    ]
				},
				dataItemOption:{
					highlightCurrentRow: true,
					stripe: true,
					header: false,
					maxHeight: 550,
					border: true,
					index: true,
					indexLabel: this.$t('importAndExport.importForm.tabNum'),
					align: 'center',					
					menu: false,
					column: [
					    {
					        label: this.$t('importAndExport.importForm.tabCode'),
					        prop: 'F_Code'
					    }, {
					        label: this.$t('importAndExport.importForm.tabName'),
					        prop: 'F_Name'
					    }, {
					        label: this.$t('importAndExport.importForm.tabDatabase'),
					        prop: 'F_DbId'
					    }, {
					        label:this.$t('importAndExport.importForm.tabCreateUser'),
					        prop: 'F_CreateUserName'
					    }, {
							label:this.$t('importAndExport.excelImport.tableCreateTime'),
							prop:'F_CreateDate'
						}, {
							label:this.$t('importAndExport.importForm.tabRemark'),
							prop:'F_Description'
						}
					]
				},
				setFieldForm:{
					Name:'',
					F_Description:'',
					F_dataItem:[],
					F_dataBase:{},
					F_showdataBase:'',
					F_Value:''
				},
				Description:[{
					label:this.$t('importAndExport.importForm.valueUnrelated'),
					value:'0'
				},{
					label:'GUID',
					value:'1'
				},{
					label:this.$t('importAndExport.importForm.valueDataDic'),
					value:'2'
				},{
					label:this.$t('importAndExport.importForm.valueDataForm'),
					value:'3'
				},{
					label:this.$t('importAndExport.importForm.labelFixedValue'),
					value:'4'
				},{
					label:this.$t('importAndExport.importForm.valueOperatorID'),
					value:'5'
				},{
					label:this.$t('importAndExport.importForm.valueOperatorName'),
					value:'6'
				},{
					label:this.$t('importAndExport.importForm.valueOperatorTime'),
					value:'7'
				}],
				dataItemProps:{
					children: 'children',
					label: 'F_ItemName'
				},
				showFieldOption:[],
				saveFieldOption:[],
				curTableName:''
			}
		},
		mounted() {
			this.getDbGroup()
			//this.getMenuButton()
			this.getDataDictionaryTree()
		},
		methods:{
			/* 获取字典分类树 */
			getDataDictionaryTree() {
			    getDataDictionaryTree().then(res => {
					const tree = FormatTree(res.data.data, "F_ItemId", "F_ItemName", "children");
			        this.setFieldForm.F_dataItem = tree
			    })
			},
			getMenuButton(){
				getMenuButton(this.parameValue).then(res => {

					this.options=res.data.data
				})
			},
			getDbGroup(obj){
				getDbGroup(obj).then(res => {
					let arr = []
					for(let key in res.data.data){
					    let node  = {
					        label : key,
					        children : [],
							leaf:false
					    };
					    res.data.data[key].forEach((keys,index) => {
					        let newNode = {
					            label : keys.F_DBAlias||keys.F_DBName,
								F_DatabaseLinkId:keys.F_DatabaseLinkId,
								children : [],
								leaf:false
					        };
					        node.children.push(newNode);
					    });
					    arr.push(node);
					}
					this.dataBaseTree = arr
				})
			},
			loadNode(node, resolve) {
				this.F_DatabaseLinkId=node.data.F_DatabaseLinkId;
				if (node.level === 1) {
				  return resolve(node.data.children);
				}
				if (node.level > 1){
					getDbLinksTable(node.data.F_DatabaseLinkId).then(res => {
		
						var jsonData=res.data.data;
						for(var i=0;i<jsonData.length;i++){
							jsonData[i].children=[];
							jsonData[i].label=jsonData[i].Table_Name;
							jsonData[i].leaf=true;							
						}
						return resolve(jsonData)
					})
				}
			},
			handleNodeClick(data){
				this.curTableName=data.Table_Name;
				if(data.leaf){
					this.fieldAllChecked=[];
					this.menuTable=[];
					getDbFieldByName(this.F_DatabaseLinkId,data.Table_Name).then(res => {
						this.dataBaseFieldTree=res.data.data;
						res.data.data.forEach((o,i)=>{
							this.fieldAllChecked.push(o.Name)
							var obj={
								'F_Name':o.Name,
								'F_ColName':o.Description,
								'F_OnlyOne':o.IsKey
							}
							this.menuTable.push(obj);
						})						
					})
				}
			},
			handleCheckChange(data, checked, indeterminate) {
				var obj={
					'F_Name':data.Name,
					'F_ColName':data.Description,
					'F_OnlyOne':data.IsKey
				}
				if(checked){
					this.menuTable.push(obj);
				}else{
					this.menuTable.splice(this.menuTable.findIndex(item => item.F_Name == data.Name), 1)
				}	
			},
			setTable(row,index){
				this.dialogTitle="设置字段【"+row.F_Name+"】属性";
				this.curTable=index;
				this.childDialogVisible=true;
				this.setFieldForm.Name=row.F_Name;
				
			},
			handleClose(done){
				done();
			},
			cancelBtn(){
				this.childDialogVisible=false;
			},
			confirmBtn(formName){				
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.Description.forEach((o,i)=>{
							if(o.value==this.setFieldForm.F_Description){								
								this.menuTable[this.curTable].F_Description='关联'+o.label;
								this.menuTable[this.curTable].F_RelationType=o.value;
								this.menuTable = [...this.menuTable]
							}
						})
						if(this.setFieldForm.F_Description==2){
							this.menuTable[this.curTable].F_DataItemCode='';
							this.menuTable[this.curTable].F_DataSourceId=this.form;
						}
						if(this.setFieldForm.F_Description==3){
							this.menuTable[this.curTable].F_DataSourceId=this.curRow.F_Name+','+this.dataItemForm.showField+','+this.dataItemForm.saveField;
						}
						if(this.setFieldForm.F_Description==4){
							this.menuTable[this.curTable].F_Value=this.setFieldForm.F_Value;
						}
						this.childDialogVisible=false;
					}
				});
			},
			dataItemClose(done){
				done();
			},
			selectDataItem(){
				this.DialogVisible=true;
				getDataSource().then(res => {
					this.dataItemTable=res.data.data
				})
			},
			handleRowClick (row, event, column) {
				this.curRow=row;
				getDataFieldBySQL(row.F_Id).then(res => {
					if(res.data.success){
						this.showFieldOption=res.data.data;
						this.saveFieldOption=res.data.data;
					}					
				})
			},
			cancelBtnTwo(){
				this.DialogVisible=false;
			},
			confirmBtnTwo(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.DialogVisible=false;
						this.setFieldForm.F_dataBase=this.curRow;
						this.setFieldForm.F_showdataBase=this.curRow.F_Name;
					}
				});
				
			},
			getChildData(){
				var obj={}
				this.$refs['formInline'].validate((valid) => {
		
					if (valid) {
						var f_BtnName='';
						this.options.forEach((o,i)=>{
							if(this.formInline.bindBtn==o.F_ModuleButtonId){
								f_BtnName=o.F_FullName;
							}
						})
						obj={
						  "import": {
							"F_Name": this.formInline.moduleName,
							"F_ModuleId": "",
							"F_ModuleBtnId": this.formInline.bindBtn,
							"F_BtnName": f_BtnName,
							"F_DbId": this.F_DatabaseLinkId,
							"F_DbTable": this.curTableName,
							"F_ErrorType": this.formInline.errorRule,
							"F_EnabledMark": 0,
							"F_Description": ""
						  },
						  "importFieldList": this.menuTable
						}						
					}else{
						obj= false;
					}
				});		
				return obj;
			}
		}
	}
</script>

<style scoped>
	.main-container::after {
	   content:"";
	   visibility:hidden;
	   display:block;
	   clear:both;
	}
/deep/ .el-form--inline .el-form-item__label{
		width: 70px;
	}
@media screen and (max-width: 1370px) {
 .fast_import1,.fast_import2,.fast_import3{
	height:380px!important;
   }
  
}	
</style>
