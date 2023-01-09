<template>
	<div class="main-container">
		<main-fixed title="公司部门" style="margin-right: 10px;height: 500px;">

		    <div slot="list">
				<el-tree :data="companiesTree" :props="defaultProps" node-key="keyId" ref="cTree"
				         :default-expand-all="true" :load="loadNode" lazy @node-click="handleNodeClick"></el-tree>
		    </div>
		</main-fixed>
		<main-fixed title="选择人员" style="width:calc(100% - 210px);height: 500px;position: relative;">
		    <div slot="list" style="height: 100%;">
		        <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;">		    
		            <el-input v-model="keyword" suffix-icon="el-icon-search" size="small" placeholder="请输入要查询的关键字"
		                      style="width: 200px; margin-right: 20px" @blur="searchUser"></el-input>
					<div>
						<el-button size="small" @click="selectUser">{{selectTitle}}</el-button>
						<el-button size="small" @click="hasSelectedUser">已选人员</el-button>	
					</div>
		        </div>
				<div style="padding: 10px 5px;height: calc(100% - 52px);overflow: auto;">
					<!-- <FKListSelection :listData="userList" :listProps="FKListSelection.props" :listImgObj="FKListSelection.img" :singleSelectd="false" @OnClick="getSelectUser"></FKListSelection> -->

				</div>
				<main-fixed title="已选人员" style="height: 500px;position: absolute;right: 0;top: -1px;" v-if="selectedBox">
					<i slot="icon" class="el-icon-close" style="position: absolute;right: 10px;top: 14px;" @click="closeBox"></i>
				    <div slot="list">
						<div id="showMemberBox">
							<div class="userBox" v-for="(item,index) in selectedUser" :key="index" @click="deleteUser(item,index)">
							    <p>{{item.F_CompanyName}}</p>
							    <p>{{item.F_DepartmentName}}【{{item.F_RealName}}】</p>
								<i class="el-icon-close"></i>
							</div>
						</div>
				    </div>
				</main-fixed>
		    </div>
		</main-fixed>
	</div>
</template>

<script>
	import MainFixed from "../../page/main/MainFixed";
	/* import {getDbGroup,getDataSource,getDataFieldBySQL} from '@/api/databasemanage/datasource'
	import {getDbLinksTable,getDbFieldByName} from '@/api/databasemanage/databaselink'*/
	import {getDepartmentUser,getDepartments } from '@/api/organization/department'
	import {
	    getCompaniesTree,
	    getCompaniesDepartments
	} from '@/api/organization/user'
	import {FormatTree,deepClone} from "../../util/util.js";
	
	export default {
	    name: "AddRoleMember",
		components: { MainFixed},
		props:{
			parameValue:'',  //父级传来的菜单id
			selecteds:[]  // 父级传来的已选人员 by Feikeq
		},
	    data() {
	        return {
				keyword:'',
				selectTitle:'全选',
				userList:[],
				userListCopy:[],
				selectedBox:false,
				selectedUser:[],
				companiesTree: [],
				companiesUser: [],
				companiesDepartments: [],
				F_CompanyId:'',
				defaultProps:{
					children: 'children',
					label: 'F_FullName',
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
						{ required: true, message: '请选择绑定按钮',trigger: 'change' }
					],
					moduleName:[
						{ required: true, message: '请填写模板名称', trigger: 'blur' }
					],
					F_Description:[
						{ required: true, message: '请选择关联类型', trigger: 'change' }
					],
					showField:[
						{ required: true, message: '请选择显示字段', trigger: 'change' }
					],
					saveField:[
						{ required: true, message: '请选择保存字段', trigger: 'change' }
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
				    indexLabel: '序号',
				    align: 'center',					
				    delBtn: false,
				    editBtn: false,
				    column: [
				        {
				            label: '字段',
				            prop: 'F_Name'
				        }, {
				            label: 'Excel列名',
				            prop: 'F_ColName'
				        }, {
				            label: '唯一性',
				            prop: 'F_OnlyOne',
                            formatter: function (row) {
                                return row.IsKey === 1 ? '唯一' : '不唯一' 
                            }
				        }, {
				            label: '描述',
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
					indexLabel: '序号',
					align: 'center',					
					menu: false,
					column: [
					    {
					        label: '编码',
					        prop: 'F_Code'
					    }, {
					        label: '名称',
					        prop: 'F_Name'
					    }, {
					        label: '数据库',
					        prop: 'F_DbId'
					    }, {
					        label: '创建用户',
					        prop: 'F_CreateUserName'
					    }, {
							label:'创建时间',
							prop:'F_CreateDate'
						}, {
							label:'备注',
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
					label:'无关联',
					value:'0'
				},{
					label:'GUID',
					value:'1'
				},{
					label:'数据字典',
					value:'2'
				},{
					label:'数据表',
					value:'3'
				},{
					label:'固定数值',
					value:'4'
				},{
					label:'操作人ID',
					value:'5'
				},{
					label:'操作人名字',
					value:'6'
				},{
					label:'操作时间',
					value:'7'
				}],
				dataItemProps:{
					children: 'children',
					label: 'F_ItemName'
				},
				showFieldOption:[],
				saveFieldOption:[],
				curTableName:'',
				// 列表选择组件
				FKListSelection:{
					img:{
						field:'F_Gender',
						formatter: function (value,row) {
							if(value == 1){
								return '/img/UserCard1.png';
							}else{
								return '/img/UserCard2.png';
							}
						}
					},
					props: [
						{
							field:'F_Account',
							title:'账户'
						},
						{
							field:'F_RealName',
							title:'姓名'
						},
						{
							field:'F_DepartmentName',
							title:'部门'
						},
						{
							field:'F_Gender'
						},
						{
							field:'F_UserId',
						}
					]
				}
			}
		},
		mounted() {
			this.getCompaniesTree();
		},
		methods:{
			getCompaniesTree(){
				getCompaniesTree().then(res => {
					this.companiesTree = res.data.data;
					this.setCompanyChil(this.companiesTree,'F_CompanyId');

				}) 
			},
			loadNode(node, resolve) {
				this.F_CompanyId=node.data.F_CompanyId;
				if(node.data.children&&node.data.children.length>0){
					return resolve(node.data.children);
				}else{
					return resolve([]);
				}
			},
			handleNodeClick(data,node,self){
				if(data.hasChild){
					getDepartments(data.F_CompanyId).then(res => {
						if(res.data.success){
							node.expand();
							data.hasChild=false;
							res.data.data.forEach((e,i)=>{
								e.F_CompanyName=data.F_FullName;
							})
							data.children.push(...res.data.data);
						}						
					})
				}
				if(data.F_DepartmentId){
					this.getUser(data)
				}
			},
			setCompanyChil(obj,name){
				for(var i=0;i<obj.length;i++){
					obj[i].keyId=obj[i][name]||'';
					obj[i].hasChild=true;
					if(obj[i].children && obj[i].children.length>0){
						this.setCompanyChil(obj[i].children,name)						
					}else{
						obj[i].leaf=true;
					}				
				}
			},
			getUser(obj){
				let param = {"keyword": ''};
				getDepartmentUser(obj.F_DepartmentId,param).then(json => {

					if(json.data.success){
						let count=0;
						json.data.data.forEach((e,i)=>{
							let temp = this.selectedUser.find(v => v.F_UserId == e.F_UserId)
							if(temp){
								e._FKListSelection_selected=true;
								count+=1;
							}else{
								e._FKListSelection_selected=false;
							}
							
							e.F_DepartmentName=obj.F_FullName;
							e.F_CompanyName=obj.F_CompanyName;
						})
						this.userList=json.data.data;
						this.userListCopy=json.data.data;
						if(count>=this.userList.length){
							this.selectTitle="反选"
						}else{
							this.selectTitle="全选"
						}
					}
				})
			},
			selectUser(){
				this.userList.forEach((e,i)=>{
					if(this.selectTitle=='全选'){
						e._FKListSelection_selected=true;
						let temp = this.selectedUser.find(v => v.F_UserId == e.F_UserId)
						if(!temp){
							this.selectedUser.push(e)
						}						
					}else{
						e._FKListSelection_selected=false;
						this.selectedUser = this.selectedUser.filter((v,i)=>{
							return v.F_UserId != e.F_UserId
						})
					}
				})
				this.selectTitle=this.selectTitle=='全选'?'反选':'全选'
			},
			hasSelectedUser(){
				this.selectedBox=true;
			},
			closeBox(){
				this.selectedBox=false;
			},
			searchUser(){
				if(this.keyword){
					this.userList=this.userList.filter((item,i)=>{
						return item.F_RealName==this.keyword || item.F_Account==this.keyword
					})
				}else{
					this.userList=[...this.userListCopy]
				}
			},
			getSelectUser(data,arr){
				var count=0;
				this.userList.forEach((e,i)=>{
					if(e.F_UserId==data.F_UserId){
						e._FKListSelection_selected=data._FKListSelection_selected;
					}
					if(e._FKListSelection_selected){
						count+=1;
					}
				});

				if(data._FKListSelection_selected){
					this.selectedUser.push(data)
				}else{
					this.selectedUser=this.selectedUser.filter((item,i)=>{
						return item.F_UserId!=data.F_UserId;
					})
				}
				
				if(count>=this.userList.length){
					this.selectTitle="反选"
				}else{
					this.selectTitle="全选"
				}

			},
			deleteUser(obj,index){
				this.selectedUser.splice(index,1)
				this.userList.forEach((e,i)=>{
					if(e.F_UserId==obj.F_UserId){
						e._FKListSelection_selected=false;
					}
				})
				this.selectTitle="全选"
			},
			pushParentData(){
				return this.selectedUser;
			}
		},
		watch:{
			//普通侦听属性 如果 `listData` 发生改变，这个函数就会运行
            selectedUser(newVal, oldVal) {
                // 监听 listData 属性的数据变化
                // 作用 : 只要 listData 的值发生变化,这个方法就会被调用
				if(this.$listeners.OnChange)this.$listeners.OnChange(this.selectedUser);
			
            },
		},
		
	}
</script>

<style scoped>
	.main-container::after {
	   content:"";
	   visibility:hidden;
	   display:block;
	   clear:both;
	}
	.userBox{
		border: 1px solid #E9E9E9;
		border-radius:0px;
		padding: 10px;
		margin: 0 0px 10px 15px;
		position: relative;
	}
	.userBox p{
		margin: 0;
		font-size: 12px;
	}
	.userBox i{
		position: absolute;
		top: 5px;
		right: 5px;
	}
</style>
