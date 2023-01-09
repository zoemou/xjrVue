<template>
  <div class="main-container">
    <main-content :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
		<div class="search-box">
		  <el-input
		    v-model="keyword"
		    size="small"
		    :placeholder="$t('searchModule.searchPlaceholder')"
		    style="width: 200px; margin-right: 5px"
		  ></el-input>
		  <el-button
		    type="primary"
		    icon="el-icon-search"
		    size="small"
		    @click="getDesktopScheme(keyword)"
		    >{{ $t("searchModule.searchBtn") }}</el-button
		  >
		  <el-button icon="el-icon-refresh" size="small" @click="getDesktopScheme()">{{
		    $t("searchModule.searchReset")
		  }}</el-button>
		</div>
      </div>
      <div slot="table" style="height:100%;">
        <!-- 在此处放置表格内容 -->
        <div class="table">
			<el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" class="addBtn" v-if="hasButtonPermission('addconfig')">{{$t('newConfig')}}</el-button>
			<el-scrollbar class="setting-wrap">
			  <div class="list">
				<div
				  class="content__item"
				  v-for="(item, index) in list"
				  :key="index"
				>
				  <div class="content__info">
					<img
					  v-if="item.backgroundUrl"
					  :src="formatImgUrl(item.backgroundUrl)"
					  alt=""
					/>
					<div class="content__menu">
					  <div class="content__btn" @click="editForm(item)" v-if="hasButtonPermission('design')">
						{{$t('design')}}
					  </div>
					</div>
				  </div>
				  <div class="content__main">
					<span class="content__name" :title="item.F_LgMarkCode?$t(item.F_LgMarkCode): item.name">{{item.F_LgMarkCode?$t(item.F_LgMarkCode): item.name }}</span>
					<div class="content__menulist">
					  <div class="content__view">
							<el-tooltip :content="$t('setSystemDefaultHome')">
						  <i class="el-icon-position" @click="setHomePage(item)" v-if="hasButtonPermission('setHomePage')"></i>
						</el-tooltip>
						<el-tooltip :content="$t('BI.listIndex.deleteIcon')">
						  <i class="el-icon-delete" @click="deleteForm(item)" v-if="hasButtonPermission('delete')"></i>
						</el-tooltip>
						<el-tooltip :content="$t('BI.listIndex.viewIcon')">
						  <i class="el-icon-view" @click="handleViews(item, index)" v-if="hasButtonPermission('view')"></i>
						</el-tooltip>
						<el-tooltip :content="$t('BI.listIndex.copyIcon')">
						  <i
							class="el-icon-copy-document"
							@click="handleCopy(item, index)"
							v-if="hasButtonPermission('copy')"
						  ></i>
						</el-tooltip>
						<el-tooltip :content="$t('editorModule.history')">
						  <i
							class="el-icon-time"
							@click="getHistory(item, index)"
							v-if="hasButtonPermission('history')"
						  ></i>
						</el-tooltip>
					  </div>
					</div>
				  </div>
				</div>		
			</div>
		  </el-scrollbar>
          <div class="text-right">
			<el-pagination
				background
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10, 20, 30, 40, 50, 100]"
			      :page-size="pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="indexTotal">
			    </el-pagination>
          </div>

          <!-- 新增 -->
          <div class="deskDialog" v-if="dialogVisible">
		  <div class="dialog-top">
			  <div>{{modalTitle}}</div>
			  <el-steps :active="active" finish-status="success" simple>
			      <el-step :key="0" :title="$t('orgRoleManagement.databaseAuth.basConfig')"></el-step><el-step :key="1" :title="$t('desktopDesign')"></el-step>
			  </el-steps>
			  <span>
				  <el-button size="mini" @click="prev" :disabled="active===0">{{$t('code.codeForm.previousBtn')}}</el-button>
				  <el-button size="mini" @click="next" :disabled="active===1">{{$t('code.codeForm.nextStepBtn')}}</el-button>
				<el-button 
				size="mini" 
				type="primary" 
				@click="submitForm('dataItemForm')" 
				:disabled="active===0" 
				:loading="flagDesktopDesign"
				>{{$t('editorModule.save')}}</el-button>
				<el-button size="mini" type="danger" @click="closeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
			</span>
		  </div>
		  
            <div class="form" v-if="active == 0">
              <el-form ref="dataItemForm" :rules="rules" :model="dataItemForm" label-width="80px">
				<el-col>
					<el-form-item :label="$t('workFlow.zh.number')" prop="code">
					  <el-input v-model="dataItemForm.code" :placeholder="$t('fillNumber')"></el-input>
					</el-form-item>
				</el-col>
				<el-col>
					<el-form-item :label="$t('editorModule.name')" prop="name">
					  <el-input v-model="dataItemForm.name" :placeholder="$t('custmerForm.classifiedManagement.addModal.placeholderName')" ></el-input>
					</el-form-item>
                </el-col>
				<el-col>
				  <el-form-item prop="icon" :label="$t('menuManagement.addModal.labelIcon')">
				    <el-input :placeholder="$t('menuManagement.addModal.placeholderIcon')"
				      size="small"
				      v-model="dataItemForm.icon" @focus="selectMoreIcon"
				    >
				      <i
				        slot="suffix"
				        class="el-icon-more"
				        @click="selectMoreIcon"
				      ></i>
				    </el-input>
				  </el-form-item>
				</el-col>
				<el-col>
				  <el-form-item
				    prop="F_SubSystemId"
				    :label="$t('menuManagement.addModal.labelSystem')"
				  >
					<SelectionSystem  v-model="dataItemForm.F_SubSystemId" :isEdit="isEdit" @changeSystem="toggleSystem"></SelectionSystem>
				  </el-form-item>
				</el-col>
				<el-col v-if="dataItemForm.isMenu==1">
				  <el-form-item
				    prop=""
				    :label="$t('menuManagement.addModal.labelSuperior')"
				  >
				    <template  v-if="allSystem.length">
							<div
				      v-for="(item, idx) in allSystem"
				      :key="idx"
				    >
				      <avue-input-tree
				        v-model="dataItemForm.pModuleId"
				        :placeholder="
				          $t('menuManagement.addModal.placeholderSuperior')
				        "
				        type="tree"
				        :dic="defaultTree"
				        size="small"
				        style="width: 100%"
				        v-if="item.F_Id == dataItemForm.F_SubSystemId"
				      >
				      </avue-input-tree>
				    </div>
						</template>
				    <avue-input-tree
				      v-model="dataItemForm.pModuleId"
				      :placeholder="
				        $t('menuManagement.addModal.placeholderSuperior')
				      "
				      type="tree"
				      :dic="defaultTree"
				      size="small"
				      style="width: 100%"
				      v-else
				    >
				    </avue-input-tree>
				  </el-form-item>
				</el-col>
                <el-col v-if="dataItemForm.isMenu==1">
					<el-form-item :label="$t('dataItem.tableSort')" prop="sortCode">
					  <el-input v-model="dataItemForm.sortCode" :placeholder="$t('dataItem.addModal.hintSort')" type="number"></el-input>
					</el-form-item>
				</el-col>
				<el-col>
				  <el-form-item prop="F_LgMarkCode" :label="$t('menuManagement.addModal.labelTransTag')">
                       <el-select
                            v-model="dataItemForm.F_LgMarkCode"                            
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
				<el-col>
				  <el-form-item :label="$t('menuManagement.tableMenu')">
				    <el-switch v-model="dataItemForm.isMenu" :active-value="1" :inactive-value="0"></el-switch>
				  </el-form-item>
				</el-col>
				<el-col>
				  <el-form-item :label="$t('firstScreen')">
				    <el-switch v-model="dataItemForm.isFirst" :active-value="1" :inactive-value="0"></el-switch>
				  </el-form-item>
				</el-col>
				<el-col>
				  <el-form-item :label="$t('code.codeStepThree.tabEnable')">
				    <el-switch v-model="dataItemForm.enabledMark" :active-value="1" :inactive-value="0"></el-switch>
				  </el-form-item>
				</el-col>
				<el-col>
					<el-form-item :label="$t('editorModule.description')" prop="description">
					  <el-input
						  type="textarea"
						  :placeholder="$t('fillDescription')"
						  size="small"
						  :autosize="{ minRows: 4, maxRows: 4 }"
						  v-model="dataItemForm.description"
					  ></el-input>
					</el-form-item>
				</el-col>
              </el-form>
            </div>
            <div v-if="active==1" style="height: calc(100% - 59px);">
				<formDesign @deskTopJson="getDeskTopJson" ref="child" :dataJson="desktopJson"></formDesign>
			</div>
          </div>
        </div>
      </div>
    </main-content>
	<el-dialog
	  v-dialogDrag
	  :close-on-click-modal="false"
	  :title="$t('menuManagement.addModal.iconModal.modalTitle')"
	  :append-to-body="true"
	  :visible.sync="IconVisible"
	  width="80%"
	  :before-close="(done)=>{done()}"
	  style="padding: 10px 20px;"
	>
	  <FontHtml v-on:childByValue="childByValue" v-if="IconVisible"></FontHtml>
	</el-dialog>
	<el-drawer
	  :title="drawerTitle"
	  :visible.sync="drawer"
	  append-to-body
	  :before-close="(done)=>{done()}" size="40%" class="history-title">
	  <avue-crud :data="historyList" :option="historyOption" stripe :page.sync="page" @on-load="load" style="height: calc(100% - 120px)">
		  <template slot="F_EnabledMark" slot-scope="scope" >
		      <el-switch v-model="scope.row.F_EnabledMark" :active-value="1" :inactive-value="0" @change="changeHistoryVersion(scope.row)"></el-switch>
		  </template>
	      <template slot-scope="scope" slot="menu">
	          <el-button type="opr-primary" size="mini" @click="viewHistory(scope.row)">{{$t('topTheme.iconPreview')}}</el-button>
	      </template>
	  </avue-crud>
	</el-drawer>
	<el-dialog
	  :close-on-click-modal="false"
	  :title="$t('designPreview')"
	  :append-to-body="true"
	  :visible.sync="formVisible"
	  fullscreen 
	  :before-close="(done)=>{done()}"
	>
		<formView :dataJson="desktopJson" v-if="formVisible"></formView>
	</el-dialog>
  </div>
</template>

<script>
import MainContent from '@/page/main/MainContent';
 import SelectionSystem from '@/components/common/SelectionSystem';
import { addDesktop,modifyDesktop,getDesktopScheme,deleteDesktop,defaultHomePage,getDesktopInfo,getDesktopHistory,setNew,copyDesktop} from '@/api/systemManagement/desktop';
import { deepClone,FormatMenuTree,LanguageFormatTree } from '@/util/util';
import {getLgMarkList} from '@/api/language/translation'
import { mapGetters } from "vuex";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import FontHtml from "../../FontAwesome.vue";
import formDesign from "./desktopDesign.vue";
import formView from "./desktopView.vue"
import { baseUrl } from '@/config/env';
import {
  // getMenuTree,
  // deleteMenu,
  // getMenuInfo,
  // getMenuButton,
  // getMenuForm,
  // getMenuColumns,
  // postMenu,
  // modifyMenu,
  getMenuTreeBySystem
} from "@/api/systemManagement/menu";
import {validateLength,validateDesLength, validateSort} from "@/api/organization/validateFunc";
export default {
  name: 'desktop',
	mixins: [authorizeMixin],
  components: { MainContent,FontHtml,formDesign,formView,SelectionSystem },
  computed: {
    ...mapGetters(["allSystem", "systemId"])
  },
  data () {
    return {
			isEdit:false,
	  flagDesktopDesign: false,
      modalTitle:this.$t('newDesktop'),
	  drawer:false,
	  drawerTitle:'',
	  keyword:'',
	  historyList:[],
      defaultTree: [], 
      searchParam: {},
      dataItemTree: [],
	  transDefaultTree:[],
	  IconVisible:false,
      active: 0,
	  formVisible:false,
      dataItemForm: {
		  F_SubSystemId:'0',
		  F_LgMarkCode:''
	  },
	  curItem:'',
	  desktopJson:[],
	  list:[],
      dialogVisible: false,
	  indexTotal: 0,
	  pageSize: 10,
	  currentPage: 1,
	  historyOption:{
		  highlightCurrentRow: true,
		  stripe: false,
		  menuWidth: 80,
		  height:'100%',
		  border: false,
		  page: true,
		  index: true,
		  indexLabel:this.$t('dataItem.tableNumber'),
		  align: 'left',
		  menuAlign: 'center',
		  addBtn: false,
		  delBtn: false,
		  editBtn: false,
		  column: [
		    {
		      label:this.$t('workFlow.WFChange.tabCreateUser'),
		      prop: 'F_CreateUserName'
		    },
		    {
		      label: this.$t('workFlow.historyList.tabCreateDate'),
		      prop: 'F_CreateDate'
		    },
		    {
		      label: this.$t('workFlow.historyList.tabCurVersion'),
		      prop: 'F_EnabledMark',
			  width:'110',
			  align:'center',
              slot:true
		    }		    
		  ]
	  },
	  page: {
	      pageSize: 20,
	      total: 0,
	      currentPage: 1
	  },
      rules: {
        code: [{ required: true, message:this.$t('fillNumber'), trigger: 'change' },
			{ validator: validateLength,trigger:'change'}
		],
        name: [{ required: true, message:this.$t('custmerForm.classifiedManagement.addModal.placeholderName'), trigger: 'change' },
			{ validator: validateLength,trigger:'change'}
		],
        icon: [{ required: true, message: this.$t('menuManagement.addModal.placeholderIcon'), trigger: 'change' }],
		sortCode: [{validator: validateSort,trigger:'change'}],
		description: [{ validator: validateDesLength,trigger:'change'}]
      }     
    };
  },
  created () {
	this.getDesktopScheme()
  },
  methods: {
	toggleSystem(systemId, parentId) {
	  systemId = systemId || "0";
	  parentId = parentId || "";
	  this.dataItemForm.F_SubSystemId = systemId;
	  getMenuTreeBySystem(systemId).then(res => {
	    let { code, data } = res.data;
	    code ||
	      (this.defaultTree = FormatMenuTree(
	        data,
	        "F_ModuleId",
	        "F_FullName",
	        "children"
	      ));
	    this.dataItemForm.pModuleId = parentId;
	  });
	},
	 	/* 获取翻译标记 */
  remoteMethod(query) {
		const searchObj = {
			keyword:query
		}
		getLgMarkList(searchObj).then(res => { 
		
			this.transDefaultTree = res.data.data;
		
		});
	},
	handleViews(item) {
	  getDesktopInfo(item.id).then(res=>{
	  	if(res?.data?.data){
			this.desktopJson=res.data.data.desktopSchemeinfo
	  		this.formVisible=true;
	  	}  
	  })
	},
	childByValue: function(childValue) {
	  // childValue就是子组件传过来的值
	  this.dataItemForm.icon = childValue;
	  this.IconVisible = false;
	},
	formatImgUrl(url) {
	  if (url.indexOf("http") > -1) {
	    return url;
	  } else {
	    return baseUrl + url;
	  }
	},
    /* 打开 */
    openDialog () {
			this.isEdit = false;
	  this.active=0;
      this.dialogVisible = true;
      this.dataItemForm= {
        pModuleId: '',
		F_SubSystemId:'0',
		isFirst:1,
		enabledMark:1,
		isMenu:0
      };
	  this.desktopJson=[]
      // this.dataItemForm.PModuleId = this.parentId;
	  // let systemId = this.allSystem[0]?.F_Id || "0";
	  // this.toggleSystem(systemId, "");
      //if(this.$refs['dataItemForm']) this.$refs['dataItemForm'].resetFields()
    },
    /* 关闭 */
    closeDialog () {
      this.dialogVisible = false;
    },
	selectMoreIcon() {
	  this.IconVisible = true;
	},
	handleCopy(row) {
		copyDesktop({id:row.id}).then(res=>{
			if(res?.data?.success){
				  this.$message.success(this.$t('BI.listIndex.copySuccess'))
				  this.getDesktopScheme();
			}else{
			  this.$message.error(this.$t('copyFailure'))
			}						
		}).catch(err=>{
			this.$message.error(this.$t('copyFailure'))
		})
	},
	getDesktopScheme(key){
		this.keyword=key
		getDesktopScheme({
			keyword:this.keyword,
			limit:this.currentPage,
			size:this.pageSize
		}).then(res=>{
			if(res?.data?.data?.Rows){
				this.list=res.data.data.Rows;
				this.indexTotal=res.data.data.Total
			}
		})
	},
	getDeskTopJson(data){			
		this.dataItemForm.backgroundUrl=data.backgroundUrl
		this.desktopJson=data.json;
	},
    /* 提交 */
    async submitForm (formName) {
      //this.$refs[formName].validate(async (valid) => {
        //if (valid) {
		  this.flagDesktopDesign = true;	
          await this.$refs.child.handleClick();
		  if(this.dataItemForm.isMenu==1){
			  this.dataItemForm.target="iframe";
			  this.dataItemForm.component="views/SystemManagement/Desktop/desktopView";
		  }
		  let param={
			  desktopScheme:this.dataItemForm,
			  desktopSchemeinfo:this.desktopJson
		  }
		  if(param.desktopScheme.id){
			  modifyDesktop(param).then(res=>{
				  if(res?.data?.success){
					  this.dialogVisible=false;
					  
					  if(this.dataItemForm.isMenu==1){
						  this.$confirm(this.$t('desktopDesignsPublishedMenusRefresh'), this.$t('deletePrompt.promptTitle'), {
						    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
						    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
						    type: 'warning'
						  }).then( () => {
						    this.$router.go(0)
						  })
					  }else{
						  this.$message.success(this.$t('deletePrompt.savedSuccessfully'))
						  this.getDesktopScheme();
					  }
				  }else{
					  this.$message.error(this.$t('deletePrompt.savedFailure'))
				  }
			  }).catch(err=>{
				  this.$message.error(this.$t('deletePrompt.savedFailure'))
			  }).finally(() => {
				  this.flagDesktopDesign = false;
			  })
		  }else{
			  addDesktop(param).then(res=>{
				if(res?.data?.success){
				  this.dialogVisible=false;
				  if(this.dataItemForm.isMenu==1){
					  this.$confirm(this.$t('desktopDesignsPublishedMenusRefresh'), this.$t('deletePrompt.promptTitle'), {
						confirmButtonText: this.$t('buttonModule.modalSureBtn'),
						cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
						type: 'warning'
					  }).then( () => {
						this.$router.go(0)
					  })
				  }else{
					  this.$message.success(this.$t('deletePrompt.savedSuccessfully'))
					  this.getDesktopScheme();
				  }
				}else{
				  this.$message.error(this.$t('deletePrompt.savedFailure'))
				}
			  }).catch(err=>{
				  this.$message.error(this.$t('deletePrompt.savedFailure'))
			  }).finally(() => {
				  this.flagDesktopDesign = false;
			  })
		  }

    },
    /* 编辑 */
    editForm (row) {
			this.isEdit = true;
		this.active=0;
		this.toggleSystem(row.F_SubSystemId.toString(), row.pModuleId);
		if(row.F_LgMarkCode){
			this.transDefaultTree=[{
			  F_Id:row.F_LgMarkCode,
			  F_EnCode:row.F_LgMarkCode,
			  F_Name:row.F_LgMarkName
			}];
		}
		getDesktopInfo(row.id).then(res=>{
			if(res?.data?.data){
				this.dataItemForm={...this.dataItemForm,...res.data.data.desktopScheme};
				this.dataItemForm.F_LgMarkCode=this.dataItemForm.lgMarkCode;
				this.dataItemForm.F_SubSystemId=this.dataItemForm.subSystemId.toString();
				this.desktopJson=res.data.data.desktopSchemeinfo;
				this.dialogVisible = true;
				
			}  
		})
    },
    /* 删除 */
    deleteForm (row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: 'warning',
      })
          .then(() => {
            deleteDesktop(row.id).then(() => {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message: this.$t('deletePrompt.successDeleted'),
                type: 'success',
              });
              this.getDesktopScheme();
            });
          })
          .catch(() => {});
    },
		/* 设置为系统默认首页 */
		setHomePage(row){
			this.$confirm(this.$t('hintSetDefaultHomepagecontent'), this.$t('sureSetDesktopDefaultHome'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: 'warning',
      }).then(() => {
            defaultHomePage(row.id).then(() => {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message: this.$t('deletePrompt.setSuccessfully'),
                type: 'success',
              });
              this.getDesktopScheme();
            });
          })
          .catch(() => {});
		},
	getHistory(item){
		this.curItem=item;
		this.drawerTitle=this.$t('workFlow.WFDesign.titleHistoryRecord')+(item.F_LgMarkCode?this.$t(item.F_LgMarkCode): item.name)	
		this.load();
		this.drawer=true;
	},
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active == 0) {
        this.$refs["dataItemForm"].validate(valid => {
          if (valid) {
            this.active++;
          }
        });
      } else {
        if (this.active++ > 2) this.active = 0;
      }
    },
	changeHistoryVersion(row){
		setNew({id:row.F_Id}).then(res=>{
			if(res?.data?.success){
				this.load()
				this.$message.success(this.$t('switchCurrentVersionSuccessful'))
			}else{
				this.$message.success(this.$t('switchCurrentVersionFailed'))
			}
		})
	},
	viewHistory(row){
		this.desktopJson=row.F_Content?JSON.parse(row.F_Content):[];
		this.formVisible=true;
	},
	sizeChange(val){
		this.page.pageSize = val;
		this.load();
	},
	load(){
	  getDesktopHistory({
	  	limit:this.page.currentPage,
	  	order:'desc',
	  	schemeId:this.curItem.id,
	  	size:this.page.pageSize
	  }).then(res=>{
	  	if(res?.data?.data?.Rows){
	  		this.historyList=res.data.data.Rows||[];
	  		this.page.total=res.data.data.Total;
	  	}
	  })
	},
	handleSizeChange(val) {
		this.pageSize=val
		this.getDesktopScheme()
	},
	handleCurrentChange(val) {
		this.currentPage=val;
		this.getDesktopScheme()
	},
	getIndexPages(keyword){
	  let page = {};
	  page.limit = this.currentPage;
	  page.size = this.pageSize;
	
	  this.loading = true;
	  getIndexPages(keyword,page)
	  .then(res=>{
	      if(res.data.data){
	        this.pageList = res.data.data.Rows || [];
	        this.indexTotal = res.data.data.Total || 0;
	        this.loading = false;
	      }else{
	        this.loadText = this.$t('user.setting.hintNoTemplate');
	      }
	  })
	  .catch(err=>{
	    this.loadText = this.$t('user.setting.hintNetError');
	  })
	}
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
.addBtn{
	position: absolute;
	right: 10px;
	z-index: 999;
}
.table{
	height: 100%;
	padding: 10px;
}
.setting-wrap{
	height: calc(100% - 100px);
	margin-top: 38px;
	padding-bottom: 10px;
	border-top:1px solid #eee;
}
.el-pagination{
	text-align: right;
}
.list{
	display: flex;
	flex-wrap: wrap;
}
.list .content__item{
	position: relative;
	margin: 16px;
	flex-direction: column;
	width: 266px;
	height: 184px;
	border: 1px solid #3a4659;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
}
.list .content__info{
	position: relative;
	height: calc(100% - 36px);
}
.list .content__info img{
	width: 100%;
	height: 100%;
}
.list .content__item:hover {
	border: 1px solid #00baff;
}
.list .content__menu{
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgba(29,38,46,.8);
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.list .content__item:hover .content__menu{
	display:flex
}
.list .content__btn {
    margin: 5px 0;
    display: inline-block;
    vertical-align: middle;
    height: 34px;
    line-height: 34px;
    padding: 0 40px;
    box-sizing: border-box;
    outline: 0;
    text-align: center;
    font-size: 14px;
    background-image: linear-gradient(-225deg,#00d3f1,#12b3ff);
    background-color: #2681ff;
    border-color: #2681ff;
    color: #fff;
    border: none;
    transition: .3s ease;
    cursor: pointer;
}
.list .content__main {
    font-size: 12px;
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    justify-content: space-between;
    background: #1d262e;
    box-sizing: border-box;
    padding: 0 10px;
    color: #bcc9d4;
}
.list .content__name {
    width: 100px;
    padding: 0 5px;
    line-height: 28px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid transparent;
}
.list .content__menulist {
    display: flex;
}
.list .content__view {
    margin-right: 2px;
}
.list .content__menulist i {
    margin-right: 10px;
}
.deskDialog{
	width: 100%;height: 100%;
	position: fixed;
	top:0;
	left: 0;
	z-index: 2000;
	background:#fff;
}
.dialog-top{
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #DCDFE6;
	padding: 10px 20px;
	font-size: 14px;
}
.el-steps{
	width: 300px;
	padding: 0 50px;
}
.el-steps--simple{
	margin-top: 0!important;
	background: none;
}
.form{
	margin: 20px 35px;
}
.search-box{
	top:10.5px!important;
	left:12px!important;
}
.history-title /deep/ .el-drawer__header{
	padding: 10px 15px 10px!important;
	border-bottom: 1px solid rgba(0,0,0,0.07)!important;
	font-size: 14px!important;
	font-weight: bold!important;
	margin-bottom: 0px;
	color: #303133;
}
.history-title /deep/ .avue-crud__right{
	text-align: right;
	}
div /deep/ .el-dialog.is-fullscreen .el-dialog__body{
	height: calc(100% - 52px)!important;
	padding:0px!important;
}	
.list .content__main{
	background-color:#031e39!important;
}
div /deep/ .el-step.is-simple:not(:last-of-type) .el-step__title{
	max-width: 51%;
}
</style>
