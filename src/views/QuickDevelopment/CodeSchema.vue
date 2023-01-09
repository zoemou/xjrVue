<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">
    <main-fixed :title="$t('codeSchema.fixedTitle')">
      <div slot="list">
        <el-tree :data="dataItem" :props="defaultProps" node-key="F_ItemDetailId" ref="dTree" :default-expand-all="true"
                 @node-click="handleNodeClick">
			<span class="custom-tree-node" slot-scope="{ data }">
		<i class="el-icon-document"></i>
<span>{{ data.F_ItemName}}</span>
			</span>	
		</el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="205" :padding-top="94">
      <div slot="search">
		<div class="search-box">
        <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right:5px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
		</div>
      </div>
      <div slot="table">
          <avue-crud ref="dataItem" :data="tableData" :option="option" :page.sync="page" 
                      :showColumn="showColumn" :isSaveColumns="true" @on-load="onPageLoad"
                     @sort-change="sortChange" @selection-change="selectionChange" @size-change='sizeChange'
					  @current-row-change="handleCurrentRowChange" @row-dblclick="handleRowDBLClick">
            <template slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addForm()" v-if="hasButtonPermission('add')">{{$t('custmerForm.addBtn')}}</el-button>
              <el-button type="" size="small" @click="deleteTableData" v-if="hasButtonPermission('batchdelete')">{{$t('buttonModule.batchDeletionBtn')}}</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click.stop="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click.stop="deleteData(scope.row.F_Id)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>
      </div>
    </main-content>
     <div v-if="codeVisible">
        <CodeForm class="code-build-box"
          v-if="codeVisible"
         :key="controllerType"
         :baseDataEditor="baseDataEditor"
         :controllerType="controllerType" 
         @finish="handleClose"
        @close="handleClose"
        ></CodeForm>
      </div>

  </div>
</template>

<script>
import MainFixed from '../../page/main/MainFixed';
import MainContent from '../../page/main/MainContent';
import { getDataItem } from '@/api/system/dataitem';
import { getCodeSchemaByPage, deleteCodeSchema, getCodeSchemaInfo } from '@/api/code/code';
import CodeForm from './Code/CodeForm.vue';
import { initFormList } from '@/config/condition.js'
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: 'DataItem',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainFixed, MainContent, CodeForm },
  props: {
    category: {
      type: Number,
      default: 0
    },
  },
  data () {
	 const _this = this;
    return {
      contentTitle: '模板列表',
      keyword: '',
      itemCode: '',
      page: { pageSize: 20, total: 0, currentPage: 1 },
      order: { order: 'desc', prop: '' },
      tableData: [],
      dataItem: [],
      selectedId: [],
      codeVisible: false,
      defaultProps: { children: 'children', label: 'F_ItemName' },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('codeSchema.tableNumber'),
        selection: true,
        align: 'center',
        menuAlign: 'center',
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          { label:this.$t('codeGenTemCat'), minWidth:'95', prop: 'F_Type', sortable: true,align: 'left',formatter: function (row) {
              if(row.F_Type=="0"){
                return _this.$t('dataFirst')
              }else if (row.F_Type=="1"){
                 return _this.$t('codeFirst')
              }else if (row.F_Type=="2"){
                 return _this.$t('simpleTemplate')
              }
            }, 
          },
          { label: this.$t('codeSchema.tableName'), minWidth:'95', prop: 'F_Name', sortable: true,align: 'left' },
          { sortable: true, label:this.$t('codeSchema.tableClassification'), prop: 'F_Catalog',minWidth:'100',align:'left' },
          { sortable: true, label:this.$t('codeSchema.tableDescription'), minWidth:'95', prop: 'F_Description',align: 'left' }]
      },
      baseDataEditor: {},
      controllerType:0,
      title:this.$t('codeSchema.titleOne')
    };
  },
  created () {
    this.getDataItem('CodeSchemaType');
  },
  methods: {
    handleRowDBLClick (row, event) {
		 if(this.openDoubleClickEdit){
		   this.editForm(row)
		 }
	 },
	handleCurrentRowChange(row){
	  this.$refs.dataItem.toggleSelection([row]);
	},
    handleNodeClick (data) {
      this.contentTitle = data.F_ItemName;
      this.itemCode = data.F_ItemValue;
      this.keyword = null;
      this.getCodeSchemaByPage();
    },
    getDataItem (code) {
      getDataItem(code).then(res => {
        this.dataItem = res.data.data;
      });
    },
    getCodeSchemaByPage () {
      let param = {
        'type':this.category,
        'Catalog': this.itemCode, 
        'limit': this.page.currentPage, 
        'size': this.page.pageSize,
        'keyword': this.keyword,
         'order': this.order.order, 
         'orderfield': this.order.prop
      };
      getCodeSchemaByPage(param).then(res => {
        this.page.total = res.data.data.Total;
        this.tableData = res.data.data.Rows;
      });
    },
    onPageLoad (page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.getCodeSchemaByPage();
    },
    sortChange (val) {
      this.order.order = val.order == 'ascending' ? 'asc' : 'desc';
      this.order.prop = val.prop;
      this.getCodeSchemaByPage();
    },
    sizeChange (page) {
      this.page.pageSize = page;
      this.getCodeSchemaByPage();
    },
    selectionChange (list) {
      this.selectedId = [];
      list.forEach((o, i) => {
        this.selectedId.push(o.F_Id);
      });
    },
        deleteData(id){
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText: this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deleteCodeSchema([id]).then(() => {
            this.getCodeSchemaByPage();
            this.$notify({ title: this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
          this.$notify({
            title: this.$t('deletePrompt.failureTitle'), message:this.$t('deletePrompt.failedDeleted'), type: 'warning'
          });
        });
    },
    deleteTableData () {
      if (this.selectedId.length <= 0) {
        this.$notify({ title: this.$t('deletePrompt.promptTitle'), message: this.$t('deletePrompt.selectDeleteData'), type: 'warning' });
      } else {
        this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deleteCodeSchema(this.selectedId).then(() => {
            this.selectedId = [];
            this.getCodeSchemaByPage();
            this.$notify({ title: this.$t('deletePrompt.successTitle'), message: this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
          // this.$notify({
          //   title: this.$t('deletePrompt.failureTitle'), message:this.$t('deletePrompt.failedDeleted'), type: 'warning'
          // });
        });
      }
    },
    search () {
      this.getCodeSchemaByPage();
    },
    searchReset () {
      this.keyword = '';
      this.getCodeSchemaByPage();
    },
    addForm(){
      this.controllerType = this.category;
       this.$store.commit("SET_CONTROLLER_TYPE",  this.controllerType);
	  //增加保留 原样式类
	  document.body.className = document.body.className + ' original';
      this.codeVisible = true;
    },
    editForm (row) {
      getCodeSchemaInfo(row.F_Id).then(res => {
        this.baseDataEditor = res.data.data;
        const F_CodeSchema = JSON.parse(this.baseDataEditor.F_CodeSchema);
        let DefaultConf = {
          disabled: false,
          formBtns: true,
          formModel: "formData",
          formRef: "elForm",
          formRules: "rules",
          formSize: "fullscreen",
          gutter: 15,
          labelPosition: "right",
          labelWidth: 100,
          size: "medium",
          span: 24,
        };
        this.baseDataEditor.stepConf = (JSON.stringify(F_CodeSchema.stepConf)=='{}')?DefaultConf:F_CodeSchema.stepConf;
         this.controllerType = this.category;
        this.$store.commit("SET_CONTROLLER_TYPE",  this.controllerType);
        //增加保留 原样式类
        document.body.className = document.body.className + ' original';
        this.codeVisible = true;
      });
    },
    handleClose () {
      //删除兼容样式类开始
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');
	  //删除兼容样式类结束
	  
      this.baseDataEditor = {};
      this.codeVisible = false;
    }

  },
};
</script>
<style scoped>
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}	
div /deep/ .el-tag{
	margin: 0px 0px 5px 5px;
}
div /deep/ .avue-crud .avue-crud__tip{
		display: none;
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