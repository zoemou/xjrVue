<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle" :resize="true">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <el-tree
            :data="dataItemTree"
            :props="defaultProps"
            node-key="F_Id"
            ref="dTree"
            :default-expand-all="true"
            @node-click="handleNodeClick"
        >
		</el-tree>
      </div>
    </main-fixed>
    <main-content :paddingLeft="205" :padding-top="94">
      <div slot="search">
        <div class="search-box">
		  <el-form :inline="true" :model="searchParam" class="demo-form-inline">
		    <el-form-item :label="$t('News.labelKeyword')" style="margin-left: 10px;">
		      <el-input v-model="searchParam.keyword" :placeholder="$t('interfaceNameOrInterfaceCode')"></el-input>
		    </el-form-item>
		    <el-form-item :label="$t('reqType')" style="margin-left: 10px;">
		      <el-select v-model="searchParam.method" :placeholder="$t('selectInterfaceType')">
		        <el-option
				  v-for="item in searchType"
				  :key="item.value"
				  :label="item.label"
				  :value="item.value">
				</el-option>
		      </el-select>
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
      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud ref="dataItem" :data="dataItem" :option="option" :page.sync="page" :showColumn="showColumn"
          :isSaveColumns="true" @on-load="searchPosts" @row-click="currentRow" @row-dblclick="handleRowDBLClick">
            <template slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
			  <el-button type="default" size="small" @click="enableInterface" v-if="hasButtonPermission('enable')">{{$t('custmerForm.tableEnable')}}</el-button>
			  <el-button type="default" size="small" @click="disableInterface" v-if="hasButtonPermission('disable')">{{$t('custmerForm.tableDisable')}}</el-button>
            </template>
			<template slot-scope="scope" slot="F_RequestMethod">
			  <div>{{scope.row.F_RequestMethod===0?'GET':scope.row.F_RequestMethod===1?'POST':scope.row.F_RequestMethod===2?'PUT':scope.row.F_RequestMethod===3?'DELETE':''}}</div>
			</template>
            <template slot-scope="scope" slot="F_EnabledMark">
              <avue-switch
                disabled
                active-color="#13ce66"
                inactive-color="#a29e9e"
                v-model="scope.row.F_EnabledMark"
                :dic="swichDic"
              ></avue-switch>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" :loading="scope.row.editloading" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>
      </div>
    </main-content>

    <dialog-install v-if="dialogVisible" @finish="handleClose"
	@close="handleClose" class="code-build-box"></dialog-install>
  </div>
</template>

<script>
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import { getInterfaceTypeTree,getDesignInterfaceList,deleteDesignInterface,disabledInterface,enabledInterface,
getCustomizeInterfaceById} from '@/api/systemManagement/interface';
import DialogInstall from './ToConfigureInterface/configForm';
import { deepClone,axiosType } from '@/util/util';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: 'DataItem',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainFixed, MainContent,DialogInstall },
  data () {
    return {
      fixedTitle: this.$t('interfaceSort'),
      searchParam: {
		  category:'',
		  keyword:'',
		  method:''
	  },
	  dataItem:[],
      dataItemTree: [],
	  searchType:axiosType,
	  swichDic: [
	    {
	      label: "",
	      value: 0
	    },
	    {
	      label: "",
	      value: 1
	    }
	  ],
	  page: {
	    pageSize: 20,
	    total: 0,
	    currentPage: 1
	  },
      dialogVisible: false,
	  dataItemForm:{},
      defaultProps: {
        children: 'children',
        label: 'F_Name',
      },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('dataItem.tableNumber'),
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
		  {
		    label:this.$t('interfaceId'),
		    prop: 'F_Id',
			align:'left',
			sortable:true,
			overHidden:true,
			minWidth:'200px'
		  },
          {
            label:this.$t('interfaceManage.addModal.labelName'),
            prop: 'F_Name',
			align:'left',
			sortable:true,
			overHidden:true,
			minWidth:'200px'
          },
          {
            label: this.$t('interfaceCode'),
            prop: 'F_EnCode',
			align:'left',
			sortable:true,
			overHidden:true
          },
          {
            label: this.$t('interfaceManage.addModal.labelAddress'),
            prop: 'F_UrlAddress',
			align:'left',
			sortable:true,
			overHidden:true,
			overHidden:true
          },
          {
            label: this.$t('interfaceSort'),
            prop: 'F_CategoryName',
			align:'center',
			sortable:true,
			overHidden:true
          },
          {
            label:this.$t('reqType'),
            prop: 'F_RequestMethod',
			align:'center',
			slot: true,
			sortable:true
          },
          {
            label: this.$t('dataItem.tableEffective'),
            prop: 'F_EnabledMark',
			align:'center',
            slot: true,
			sortable:true
          },
          {
            label:this.$t('orgUserManagement.tabRemark'),
            prop: 'F_Description',
			align:'left',
			sortable:true,
			overHidden:true
          },
        ],
      },
    };
  },
  created () {
    this.getDataItemTree();
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.editForm(row)
      }
    },
    handleClose () {
      this.dialogVisible= false;
	  this.getDataItemTree();
    },
    /* 获取分类树 */
    async getDataItemTree () {
      const res = await getInterfaceTypeTree();
      this.dataItemTree = res.data.data;
	  // this.searchParam.category = this.dataItemTree[0]?.F_Id||'';
	  this.getDataItem();
      // /* 左侧树形菜单默认选中第一个 */
	  // this.$nextTick(() => {
		// this.$refs.dTree.setCurrentKey(this.searchParam.category);
	  // });
    },
    /* 选择树形菜单加载接口信息 */
    handleNodeClick (data) {
      this.searchParam.category = data.F_Id;
	  this.searchParam.keyword = null;
      this.getDataItem();
    },
    getDataItem () {
      let params = {
        limit: this.page.currentPage,
        size: this.page.pageSize,
        Keyword: this.searchParam.keyword,
		method:this.searchParam.method,
		category:this.searchParam.category
      };
      getDesignInterfaceList(params).then(({ data: { data } }) => {
		data.Rows.forEach(i=>{
			i.editloading=false
		})
        this.dataItem = data.Rows||[];
		this.page.total = data.Total;
		this.dataItemForm=deepClone(this.dataItem[0]);
		this.$refs.dataItem.setCurrentRow(this.dataItem[0]);
      });
    },
    /* 单击行 */
    currentRow (row) {
      this.dataItemForm = deepClone(row);
    },
    /* 打开 */
    openDialog () {
      this.flag = true;
      this.dialogVisible = true;
      this.dataItemForm = {};
	  this.$store.dispatch("initInterfaceAllData")
	  //this.$store.commit("setInputParameter", []);
    },
    /* 关闭 */
    closeDialog () {
      this.dataItemForm = {};
      this.dialogVisible = false;
      // this.$refs['dataItemForm'].resetFields()
    },
    /* 编辑 */
    editForm (row) {
		row.editloading=true;
		
		getCustomizeInterfaceById(row.F_Id).then(res=>{
			const { code, data } = res.data;
			if (code){
				this.$message({
				  showClose: true,
				  message: this.$t('dataRequestError'),
				  type: 'error'
				});
			}else{
				this.$store.dispatch("initInterfaceAllData",data).then(()=>{
					this.dialogVisible = true;
				})				
			}
			row.editloading=false;
			
		})   
    },
    /* 删除 */
    deleteForm (row) {
		const h = this.$createElement;
		this.$msgbox({
		  title:this.$t('language.languageType.Hint.titlePrompt'),
		  message: h('div', null, [
			h('div', null, [
				h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
				h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('determineWhetherDeleteInterface'))]),
			h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('deleteInterfaceInvalidateReferenceInterface'))
		  ]),
		  showCancelButton: true,
		  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
		  cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
		  beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
			  instance.confirmButtonLoading = true;
			  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
				  deleteDesignInterface(row.F_Id).then(() => {
				  	instance.confirmButtonLoading = false;
				  	this.$notify({
				  	    title:this.$t('deletePrompt.successTitle'),
				  	    message:this.$t('deletePrompt.successDeleted'),
				  	    type: 'success'
				  	});
				  	this.getDataItem();
				  	done();
				  });
			} else {
			  done();
			}
		  }
		}).then(action => {}).catch(() => {});

    },
	enableInterface() {
	  if (
	    !this.dataItemForm.F_Id ||
	    this.dataItemForm.F_Id === ""
	  ) {
	    this.$message({
	      message:this.$t('deletePrompt.hintSelectData'),
	      type: "warning",
	    });
	    return;
	  }
	  if (this.dataItemForm.F_EnabledMark == 1) {
	    this.$message({
	      message:this.$t('interfaceEnabled'),
	      type: "warning",
	    });
	    return;
	  }
	  this.$confirm(this.$t('sureWamtEnableInterface'), this.$t('deletePrompt.promptTitle'), {
		confirmButtonText:this.$t('buttonModule.modalSureBtn'),
		cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
		type: 'warning'
	  }).then(() => {
		enabledInterface(this.dataItemForm.F_Id).then((res) => {
			this.$notify({
			    title:this.$t('deletePrompt.successTitle'),
			    message:this.$t('deletePrompt.enableSuccessful'),
			    type: 'success'
			});
			this.getDataItem();
		});
	  }).catch(() => {        
	  });	  		
	},
	disableInterface() {
	  if (
	    !this.dataItemForm.F_Id ||
	    this.dataItemForm.F_Id === ""
	  ) {
	    this.$message({
	      message:this.$t('deletePrompt.hintSelectData'),
	      type: "warning",
	    });
	    return;
	  }
	  if (this.dataItemForm.F_EnabledMark === 0) {
	    this.$message({
	      message:this.$t('interfaceDisabled'),
	      type: "warning",
	    });
	    return;
	  }
	  const h = this.$createElement;
	  this.$msgbox({
	    title:this.$t('language.languageType.Hint.titlePrompt'),
	    message: h('div', null, [
	  	h('div', null, [
	  		h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
	  		h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('sureWantDisableInterface'))]),
	  	h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('disableInterfaceAllFunctionReference'))
	    ]),
	    showCancelButton: true,
	    confirmButtonText:this.$t('buttonModule.modalSureBtn'),
	    cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
	    beforeClose: (action, instance, done) => {
	  	if (action === 'confirm') {
	  	  instance.confirmButtonLoading = true;
	  	  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
		  disabledInterface(this.dataItemForm.F_Id).then((res) => {
		  	instance.confirmButtonLoading = false;
		  	this.$notify({
		  	    title:this.$t('deletePrompt.successTitle'),
		  	    message:this.$t('deletePrompt.disableSuccessful'),
		  	    type: 'success'
		  	});
		  	this.getDataItem();
		  	done();
		  });
	  	} else {
	  	  done();
	  	}
	    }
	  }).then(action => {}).catch(() => {});

	},
	/* 搜索 */
	searchPosts() {
	  this.getDataItem();
	},
	/* 搜索 表单重置 */
	searchReset() {
		// this.$refs.dTree.setCurrentKey(null);
	  this.searchParam = {
		  category:this.searchParam.category,
		  keyword:'',
		  method:''
	  };
	  this.page.currentPage = 1;
	  this.getDataItem();
	}
  },
};
</script>

<style scoped>
div /deep/ .el-form-item{
	margin-top: 0;
	margin-right: 5px;
}
.main-container {
  height: 100%;
  padding: 0 8px;
}
.code-build-box{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1999;
  background-color: #fff;
}	
</style>
