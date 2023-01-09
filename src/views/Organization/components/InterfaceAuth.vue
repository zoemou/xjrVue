<template>
	<el-dialog v-dialogDrag
	  v-bind="$attrs"
	  width="80%"
	  :close-on-click-modal="false"
	  append-to-body
	  :before-close="close"
	>
	  <div slot="title">
	    {{$t('interfacePermissions')+' - '+conf.F_FullName}}
	  </div>
	  <div class="content" style="height:100%">
		  <div class="main-container">
			<main-content :paddingLeft="0" :padding-top="0">
			  <div slot="search">
				<div class="search-box">
				  <el-form :inline="true" :model="searchParam" class="demo-form-inline">
					<el-form-item :label="$t('News.labelKeyword')" style="margin-left: 10px;">
						<el-input
						v-model="searchParam.keyword"
						size="small"
						:placeholder="$t('interfaceNameOrInterfaceCode')"
						style="width: 230px; margin-right:5px"
					  ></el-input>	
					</el-form-item>
					<el-form-item>
					  <el-button
						type="primary"
						icon="el-icon-search"
						size="small"
						@click="searchPosts"
						>{{$t('searchModule.searchBtn')}}</el-button
					  >
					  <el-button icon="el-icon-refresh" size="small" @click="searchReset"
						>{{$t('searchModule.searchReset')}}</el-button
					  >
					</el-form-item>
				  </el-form>    
				</div>
			  </div>
			  <div slot="table" class="custom-box">
				<!-- 在此处放置表格内容 -->
				<div class="custom-table">
					<div class="custom-table__cell checkbox"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ }}</el-checkbox></div>
					<div class="custom-table__cell" v-for="item in column" :key="item.prop">
						<div>{{item.label}}</div>
					</div>
				</div>
				<div class="custom-table__body" ref="checkboxgroup">
					<el-checkbox-group v-model="selectionList" @change="handleCheckedChange">
							<interfaceListItem v-if="dataItem&&dataItem.length>0" :show="true" :listItem="dataItem" 
							:column="column" :level="0" @changeCheck="changeCheck" :selected="selectionList"></interfaceListItem>							
					</el-checkbox-group>
				</div>
			  </div>
			</main-content>

		  </div>
		</div>
		<div slot="footer" class="dialog-footer">
		  <el-button size="small"
		             @click="close()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
		  <el-button type="primary"
		             @click="submit"
		             size="small">{{$t('buttonModule.modalSureBtn')}}</el-button>
		</div>
	</el-dialog>
</template>

<script>
import MainContent from '@/page/main/MainContent';
import { getInterfaceTree,interfaceAuth,getInterfaceAuthIds} from '@/api/systemManagement/interface';
import { deepClone,FormatTree } from '@/util/util';
import interfaceListItem from './interfaceItem';
export default {
  name: 'DataItem',
  components: { MainContent,interfaceListItem },
  props:['conf','objectType'],
  data () { 
    return {
      searchParam: {
		  keyword:''
	  },
	  checkAll: false,
	  isIndeterminate: false,
	  selectionList:[],
      dataItem: [],
	  allIds:[],
	  objectId:'',
	  backups:[],
      column: [
          {
            label:this.$t('custmerForm.tableName'),
            prop: 'F_Name'
          },
          {
            label: this.$t('interfaceManage.addModal.labelAddress'),
            prop: 'F_UrlAddress'
          },
					{
					  label: this.$t('reqType'),
					  prop: 'F_RequestMethod'
					},
          {
            label:this.$t('orgUserManagement.tabRemark'),
            prop: 'F_Description'
          }
        ],
    };
  },
  async created () {
	// 授权对象类型，1-角色，2-用户
	if(this.objectType==1){
		this.objectId=this.conf.F_RoleId
	}else if(this.objectType==2){
		this.objectId=this.conf.F_UserId
	}
	let res=await getInterfaceAuthIds(this.objectId,this.objectType)
	this.selectionList=res.data.data||[];	
	this.getInterfaceTree()
  },
  methods: {
	async getInterfaceTree(){
		let { data: { data } }=await getInterfaceTree(this.searchParam)
		let Item=data||[];		
		if(this.allIds.length<=0){
			this.getAllIds(Item,this.allIds)		
			this.dataItem=Item
		}else{
			this.backups=Item;
			this.changeShow(this.dataItem)
		}
		this.handleCheckedChange()
	},
    submit(){
		let obj={
			 objectType: this.objectType, // 授权对象类型，1-角色，2-用户
			 objectId: this.objectId,   // 授权对象id，用户/角色id
			 ids: this.selectionList   // 选中的接口id集合
		}
		interfaceAuth(obj).then(res=>{
			if(res.data.success){
				this.$emit('update:visible', false);
				this.$notify({
				  title: this.$t("deletePrompt.promptTitle"),
				  message: this.$t("interfaceAuthorizationSucceeded"),
				  type: "success"
				});
			}else{
				this.$notify({
				  title: this.$t("deletePrompt.promptTitle"),
				  message: this.$t("authorizationFailed"),
				  type: "warning"
				});
			}
		})		
    },
    close(){
      this.$emit('update:visible', false);
    },
	/* 搜索 */
	searchPosts() {
	  this.getInterfaceTree();
	},
	/* 搜索 表单重置 */
	searchReset() {
	  this.searchParam = {
		  keyword:''
	  };
	  this.getInterfaceTree();
	},
	handleCheckAllChange(val) {
		this.selectionList = val ? deepClone(this.allIds) : [];
		this.isIndeterminate = false;
		this.changeState(this.dataItem,val)
	},
	changeState(arr,type){
		for(let it of arr){
			it.check=type;
			it.indeterminate=false;
			if(it.children?.length>0){
				this.changeState(it.children,type)
			}
		}
	},
	changeShow(arr){
		for(let it of arr){
			it.show=this.findeNode(it.F_Id,this.backups)
			if(it.children?.length>0){
				this.changeShow(it.children)
			}
		}
	},
	findeNode(id,arr){
		let flag=false;
		for(let it of arr){
			if(it.F_Id==id){
				flag= true;
				break;
			}else{
				if(it.children?.length>0){
					flag=this.findeNode(id,it.children)
					if(flag) break;
				}
			}			
		}
		return flag
	},
	changeCheck(val){
		this.handleCheck(val)
	},
	handleCheck(val){
		if(!val.check&&val.indeterminate){//半选状态
			val.check=true;
			val.indeterminate=false;
		}else if(val.check&&!val.indeterminate){//全选状态
			val.check=false;
		}else if(!val.check&&!val.indeterminate){ //没选中状态
			val.check=true;
		}

		if(val.children?.length>0){
			if(val.check){
				if(!this.selectionList.includes(val.F_Id)) this.selectionList.push(val.F_Id)
			}else{
				this.selectionList=this.selectionList.filter(o=>{return o!=val.F_Id})
			}
			this.getChildIds(val.children,this.selectionList,val.check);			
		}	
		if(val.F_ParentId){
			this.setParent(val,val.check,this.dataItem)
		}
	},
	setParent(obj,type,arr){
		let allSelect=[];
		let someSelect=[];
		for(let item of arr){			
			if(item.children?.length>0){
				if(obj.F_ParentId==item.F_Id){					
					for(let k of this.selectionList){
						for(let j of item.children){
							if(k==j.F_Id){
								if(!j.check&&j.indeterminate){
									someSelect.push(j)
								}else if(j.check&&!j.indeterminate){
									allSelect.push(j)
								}							
							}
						}
					}
					if(allSelect.length==item.children.length){
						item.check=true;
						item.indeterminate=false;
						if(!this.selectionList.includes(item.F_Id)) this.selectionList.push(item.F_Id)
					}else if(allSelect.length<item.children.length&&someSelect.length==0){
						item.check=false;
						item.indeterminate=true;
						if(!this.selectionList.includes(item.F_Id)) this.selectionList.push(item.F_Id)
					}
					if(someSelect.length>0){
						item.check=false;
						item.indeterminate=true;
						if(!this.selectionList.includes(item.F_Id)) this.selectionList.push(item.F_Id)										
					}
					if(allSelect.length==0&&someSelect.length==0){
						item.check=false;
						item.indeterminate=false;
						this.selectionList=this.selectionList.filter(o=>{return o!=item.F_Id})
					}
					this.setParent(item,type,this.dataItem)
				}else{
					this.setParent(obj,type,item.children)
				}
			}
		}
	},
	getChildIds(arr,temp,check){
		for(let it of arr){
			it.check=check;
			it.indeterminate=false;
			if(check){
				if(!temp.includes(it.F_Id)) temp.push(it.F_Id)
			}else{
				let idx=temp.findIndex(o=>{return o==it.F_Id})
				if(idx>=0){
					temp.splice(idx,1)
				}
			}			
			if(it.children?.length>0){
				this.getChildIds(it.children,temp,check)
			}
		}
	},
	
	getAllIds(arr,temp){		
		for(let it of arr){
			it.check=false;
			it.indeterminate=false;
			it.expand=false;	
			it.show=true;
			temp.push(it.F_Id)	
			if(it.children?.length>0){
				this.getAllIds(it.children,temp)
			}
		}
	},
	handleCheckedChange() {
		let checkedCount = this.selectionList.length;
		this.checkAll = checkedCount === this.allIds.length;
		this.isIndeterminate = checkedCount > 0 && checkedCount < this.allIds.length;
	}
  }
};
</script>

<style scoped>
::v-deep .el-form--inline .el-form-item{
	margin-top:0
}
::v-deep .el-form--inline .el-form-item__label{
	vertical-align: top;
}
::v-deep .el-dialog{
	height: calc(100% - 240px);
}
::v-deep .el-dialog__body{
	height: calc(100% - 110px);
}

/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
</style>
<style>
.custom-box{
	padding-top: 42px;
}
.custom-table{
	display: flex;
	justify-content: space-around;
	color: rgba(0, 0, 0, .8);
	background-color: #fafafa;
}
.custom-table__body{
	height: calc(100% - 85px);
	overflow: auto;
}
.custom-table__row{
	
	font-size: 12px;
}
.custom-table__parent{
	display: flex;
	justify-content: space-around;
}
.custom-table__parent:hover{
	background: #fafafa;
}
.custom-table__cell{
	flex: 1;
	padding: 4px 10px;
}
.custom-table__rowcell{
	text-align: left;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 4px 10px;
}
.custom-table__rowBox{
	width: calc(100% - 50px);display: flex;justify-content: space-around;
	border-bottom: 1px solid #EBEEF5;
}
.custom-table__cell.checkbox,
.custom-table__rowcell.checkbox{
	width: 50px;flex: none;text-align: center;
	padding:4px 0;	
	border-bottom: 1px solid #EBEEF5;
}
.custom-table__chilren{
	width: 100%;
}
</style>
