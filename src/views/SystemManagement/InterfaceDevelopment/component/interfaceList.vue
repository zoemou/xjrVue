<template>
	<el-dialog v-dialogDrag
	  v-bind="$attrs"
	  width="1280px"
	  :close-on-click-modal="false"
	  append-to-body
	  :before-close="close"
	>
	  <div slot="title">
	    {{$t('selectInterface')}}
	  </div>
	  <div class="content" style="height:100%">
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
				  <el-input
					v-model="searchParam.keyword"
					size="small"
					:placeholder="$t('interfaceNameOrInterfaceCode')"
					style="width: 200px; margin-right:5px"
				  ></el-input>				  
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
				</div>
			  </div>
			  <div slot="table">
				<!-- 在此处放置表格内容 -->
				  <avue-crud ref="dataItem" class="dialogList" :data="dataItem" :option="option" :page.sync="page"
				  @on-load="getDataItem" @row-click="currentRow">
					<template slot="checked" slot-scope="scope">
					  <i :class="scope.row.checked===false?'fa fa-circle-thin':'el-icon-success'"
					     :style="scope.row.checked===false?'color:#999;font-size:20px':'color:#409EFF;font-size:20px'"
					     @click="changeSelect(scope.row)"></i>
					</template>
				  </avue-crud>
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
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import { getInterfaceTypeTree,getAllInterfaceList} from '@/api/systemManagement/interface';
import { deepClone,FormatTree } from '@/util/util';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
export default {
  name: 'DataItem',
  mixins: [tableOptionMixin],
  components: { MainFixed, MainContent },
  props:['curId','parentId'],
  data () {
	const _this = this;  
    return {
      fixedTitle: this.$t('interfaceSort'),
      searchParam: {
		  category:'',
		  keyword:''
	  },
      dataItemTree: [],
	  page: {
	    pageSize: 20,
	    total: 0,
	    currentPage: 1
	  },
      dataItem: [],
      itemCode: '',
      defaultProps: {
        children: 'children',
        label: 'F_Name',
      },
	  selected:'',
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menu: false,
        border: false,
        page: true,
        index: false,
        align: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
		   {
			 label:this.$t('workFlow.User.tableSelect'),
			   prop:'checked',
			   align:'center',
			   slot:true,
			   width:'60px'
		   },
          {
            label:this.$t('interfaceManage.addModal.labelName'),
            prop: 'F_Name',
			align:'left',
			sortable:true,
			overHidden:true
          },
          {
            label: this.$t('interfaceCodeOlnyCustom'),
            prop: 'F_EnCode',
			align:'left',
			sortable:true,
			overHidden:true
          },
          {
            label: this.$t('interfaceSource'),
            prop: 'F_IsCustomize',
			align:'left',
			sortable:true,
			formatter:function(row){
				return row.F_IsCustomize==1?'<div style="color: #409eff;">'+_this.$t('customI/F')+'</div>':
				row.F_IsCustomize===0?'<div style="color: #e6a23c;">'+_this.$t('systemInterface')+'</div>':''
			}
          },
          {
            label: this.$t('interfaceManage.addModal.labelAddress'),
            prop: 'F_UrlAddress',
			align:'left',
			sortable:true,
			overHidden:true
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
    /* 获取分类树 */
    async getDataItemTree () {
      const res = await getInterfaceTypeTree();
      this.dataItemTree = res.data.data;
      //this.itemCode = res.data.data[0]?.F_Id||'';
	  this.getDataItem();
      // /* 左侧树形菜单默认选中第一个 */
      //this.$nextTick(() => {
       // this.$refs.dTree.setCurrentKey(this.itemCode);
      //});
    },
    /* 选择树形菜单加载接口信息 */
    handleNodeClick (data) {
      this.searchParam.keyword = null;
      this.itemCode = data.F_Id;
      this.getDataItem();
    },
    getDataItem () {
		let params = {
		  limit: this.page.currentPage,
		  size: this.page.pageSize,
		  Keyword: this.searchParam.keyword,
		  category:this.itemCode
		};
      getAllInterfaceList(params).then(({ data: { data } }) => {      
		data.Rows.forEach(i=>{
			i.checked=false;
			if(i.F_Id==this.curId){
				i.checked=true;
				this.selected=i;
			} 
		})
		let dataItem = data.Rows||[];
		this.dataItem=dataItem.filter(o=>{return o.F_Id!=this.parentId})
		this.page.total = data.Total;
      });
    },
    /* 单击行 */
    currentRow (row) {
	  this.dataItem.forEach(it=>{
		  it.checked=false;
		  if(it.F_Id==row.F_Id){
			 it.checked=true; 
		  } 
	  })
      this.selected = deepClone(row);
    },
	changeSelect(row){
		this.currentRow(row)
	},
    submit(){
		this.$emit('getUrl',this.selected);
		this.$emit('update:visible', false);
    },
    close(){
      this.$emit('update:visible', false);
    },
	/* 搜索 */
	searchPosts() {
	  this.getDataItem();
	},
	/* 搜索 表单重置 */
	searchReset() {
	  this.$refs.dTree.setCurrentKey(null);
	  this.itemCode=""
	  this.searchParam = {
		  keyword:''
	  };
	  this.getDataItem();
	}
  },
};
</script>

<style scoped>
::v-deep .el-dialog{
	height: calc(100% - 240px);
}
::v-deep .el-dialog__body{
	height: calc(100% - 110px);
}
::v-deep .avue-crud__pagination{
	position:absolute;
	bottom:0
}
::v-deep .dialogList .el-table{
	height: calc(100% - 100px) !important;
}
/* css */
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
