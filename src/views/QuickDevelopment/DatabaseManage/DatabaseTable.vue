<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 数据字典分类树 -->
        <el-tree :data="databaseTableTree" ref="cTree"
                 :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="205" :padding-top="94"
                  :search="true">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
		<div class="search-box">
        <el-input v-model="searchParam.tableName" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right: 5px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
		</div>
      </div>

      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud ref="databaseTable" :data="databaseTable" :option="option" :page.sync="page" :showColumn="showColumn" :isSaveColumns="true"
          @row-click="currentRow" @size-change="sizeChange"
          @current-change="currentChange" @expand-change="expandChange" @toggleRowExpansion="rowExpandChange">
            <template slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addTable" v-if="hasButtonPermission('addtable')">{{$t('databaseManage.databaseTable.addTableBtn')}}</el-button>
              <el-button size="small" @click="openDatabaseTable" v-if="hasButtonPermission('open')">
                 {{$t('databaseManage.databaseTable.openDataTableBtn')}}
              </el-button>
            </template>
            <template slot="expand">
              <avue-crud :data="databaseTableColumns" :option="databaseTableOption"></avue-crud>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="primary" size="mini" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="danger" size="mini" @click="deleteForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>

          <!-- 新增 -->
          <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('databaseManage.databaseTable.addTableBtn')" :append-to-body="true" :visible.sync="dialogVisible" width="60%"
                     :before-close="closeDialog">

            <div class="form" >
              <add-sheet 
              v-if="dialogVisible"
              :databaseTableId="databaseTableId"
                         :databaseTableName="databaseTableName"
                         :dataDictionaryForm="dataDictionaryForm"
						 :DBType="DBType"
                         @cancel="cancel"
              ></add-sheet>
            </div>
          </el-dialog>

          <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('databaseManage.databaseTable.openDataTableModalTitle')" :append-to-body="true" :visible.sync="DBTDialog" width="60%"
                     :before-close="DBTClose">
            <el-table
            v-if="DBTDialog"
                :data="databaseOpen"
                style="width: 100%"
                height="500"
				class="open_data"
				>
              <template v-for="(item, index) in databaseOpenList">
                <el-table-column
                    :fixed="Number(item.IsKey) === 1"
                    :key="index"
                    :prop="item.Name"
                    :label="item.Description"
                    width="150">
                </el-table-column>
              </template>
            </el-table>
          </el-dialog>

      </div>

    </main-content>
  </div>
</template>

<script>
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import { deepClone } from '@/util/util';
import {
  getDatabaseTableTree,
  getDatabaseTableByPage,
  getDatabaseTableColumns,
  getDatabaseTableDatas, getDatabaseTableColumnsFun
} from '@/api/databasemanage/databasetable';
import { getDbFieldByName, getDbFieldByData } from '@/api/databasemanage/databaselink';
import { deleteDataDictionary } from '@/api/system/log';
import { getDataDictionary } from '@/api/language/dictionary';
import addSheet from './table-components/add-sheet';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import {validateDesLength,validateLength} from "@/api/organization/validateFunc";
export default {
  name: 'DatabaseTable',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainFixed, MainContent, addSheet },
  data () {
    return {
      fixedTitle: this.$t('databaseManage.databaseTable.fixedTitle'),
      contentTitle: '数据表信息',
      contentSubTitle: '',
      searchParam: {},
      databaseTableTree: [],
      databaseTableId: '',
      databaseTableName: '',
      databaseTable: [],
      databaseTableForm: {},
      databaseTableColumns: [],
      databaseTableDatas: [],
      dialogVisible: false,
      DBTDialog: false,
      addCurdData: [],
      // optionCrud: {
      //   addBtn: false,
      //   sortable: true,
      //   menu: true,
      //   editBtn: false,
      //   maxHeight: 300,
      //   addRowBtn: true,
      //   columnBtn: false, //列显隐按钮	Boolean
      //   refreshBtn: false, //	刷新按钮	Boolean
      //   align: 'center',
      //   column: [
      //     {
      //       label: '列名',
      //       prop: 'text1',
      //       cell: true,
      //     }, {
      //       label: '数据类型',
      //       prop: 'text2',
      //       type: 'select',
      //       dicData: [
      //         {
      //           label: 'varchar',
      //           value: 0
      //         }, {
      //           label: 'int',
      //           value: 1
      //         }, {
      //           label: 'datetime',
      //           value: 2
      //         }, {
      //           label: 'double',
      //           value: 3
      //         }, {
      //           label: 'float',
      //           value: 4
      //         }, {
      //           label: 'decimal',
      //           value: 5
      //         }, {
      //           label: 'text',
      //           value: 6
      //         }, {
      //           label: 'NVARCHAR2',
      //           value: 7
      //         }, {
      //           label: 'DATE',
      //           value: 8
      //         }, {
      //           label: 'NUMBER',
      //           value: 9
      //         }, {
      //           label: 'NCLOB',
      //           value: 10
      //         }, {
      //           label: 'NCLOB',
      //           value: 11
      //         }],
      //       cell: true
      //     }, {
      //       label: '长度',
      //       prop: 'text3',
      //       cell: true
      //     }, {
      //       label: '允许空',
      //       prop: 'text4',
      //       type: 'switch',
      //       cell: true
      //     }, {
      //       label: '主键',
      //       prop: 'text5',
      //       type: 'switch',
      //       cell: true

      //     }, {
      //       label: '说明',
      //       prop: 'text6',
      //       cell: true

      //     }]
      // },
      moduleId: '',
      dataDictionaryForm: {},
	  page: {
	    pageSize: 20,
	    total: 0,
	    currentPage: 1
	  },
	  DBType:'',
      option: {
        expand: true,
        expandRowKeys: [],
        rowKey: 'Table_Name',
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: false,
        menu: false,
        // indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t('databaseManage.databaseTable.tableName'),
            prop: 'Table_Name',
			align:'left',
			sortable:true
          }, {
            label:this.$t('databaseManage.databaseTable.tableRemark'),
            prop: 'Description',
			align:'left',
			sortable:true
          },
        ]
      },
      databaseTableOption: {
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 150,
        maxHeight: 550,
        border: true,
        page: false,
        index: false,
        menu: false,
        // indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
                 label: 'f_number',
                 prop: 'ColumnId',
          },
          {
               label: 'f_column',
               prop: 'Name',
           },
          {
            label: 'f_datatype',
            prop: 'Type'
          }, {
            label: 'f_defaults',
            prop: 'DefaultValue',
          },
          // {
          //     label: 'f_identity',
          //     prop: 'Index_Size',
          // },
        
          {
            label: 'f_length',
            prop: 'Length',
          },
          /*{
              label: 'f_remark',
              prop: '',
          }, */
          {
            label: 'f_key',
            prop: 'IsKey',
          }, {
            label: 'f_isnullable',
            prop: 'IsNullable',
          }
        ]
      },
      databaseOpenList: [], // 表头
      databaseOpen: [], // 表体
    };
  },
  created () {
    this.getDatabaseTableTree();
  },
  methods: {
    cancel (res) {
      this.dialogVisible = false;
      if (res) return;
      this.getDatabaseTable();
    },
    // 单击行
    handleRowClick (row, event, column) {

    },
    // 新建表-拖拽列
    sortableChange (oldindex, newindex, row, list) {
      this.data = [];
      this.$nextTick(() => {
        this.data = list;
      });
    },
    // 拷贝
    copyList (row) {
      let newRow = row;
      this.addCurdData.push({ ...newRow });
    },
    // 新建表-btn
    async handleAdd (val) {
      switch (val) {
        case 1:
          // await getDatabaseTableTree();
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
      }
    },
    /* 获取数据库列表树 */
    getDatabaseTableTree () {
      getDatabaseTableTree().then(res => {
        this.FormatTree(res.data.data);
      });
    },
    FormatTree (data) {
      let arr = [];
      for (let key in data) {
		  if(key=='localhost'){
			  arr.unshift({
				  label: data[key][0].F_DBName,
				  id: data[key][0].F_DatabaseLinkId,
				  dbtype:data[key][0].F_DbType,
				  children:[]
			  })
		  }else{
			let node = {
			  label: key,
			  children: []
			};
			data[key].forEach((keys) => {
			  let newNode = {
				label: keys.F_DBAlias,
				id: keys.F_DatabaseLinkId,
				dbtype:keys.F_DbType
			  };
			  node.children.push(newNode);
			});
			arr.push(node);
		  }
      }
      this.databaseTableTree = arr;
    },
    getDatabaseTable (id = this.moduleId) {
		this.searchParam.limit=this.page.currentPage;
		this.searchParam.size=this.page.pageSize
      id !== undefined && getDatabaseTableByPage(id,this.searchParam).then(res => {
        const { data, code } = res.data;
        if (code) return this.databaseTable = [];
        this.databaseTable = data.Rows;
		this.page.total = data.Total;
      });
    },
	sizeChange(val) {
		this.page.currentPage = 1
		this.page.pageSize = val
		this.getDatabaseTable()
	  },
	  currentChange(val) {
		this.page.currentPage = val
		this.getDatabaseTable()
	  },
    /* 选择树形菜单加载公司用户信息 */
    handleNodeClick (data) {
      //若不是叶子节点，不选中
      if(!data.id){
        return
      }
      this.moduleId = data.id;
      this.getDatabaseTable(data.id);
      this.databaseTableId = data.id;
	  this.DBType=data.dbtype;
    },
    /* 新建表弹窗 */
    addTable () {
      const { databaseTableId } = this;
      this.dataDictionaryForm = {};
      if (databaseTableId) this.dialogVisible = true;
      else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('databaseManage.databaseTable.selectDataPrompt.promptContent'),
          type: 'warning'
        });
      }
    },
    /* 单击行 */
    currentRow (row) {
      this.databaseTableName = row.Table_Name;
      this.dataDictionaryForm = deepClone(row);
    },
    async expandChange (row, expendList) {
      if (expendList.length) {
        this.option.expandRowKeys = [];
        if (row) {
          const { data: {code, data } } = await getDatabaseTableColumnsFun(this.databaseTableId, row.Table_Name);
          if (code) return;
          this.databaseTableColumns = data;
          this.option.expandRowKeys.push(row.Table_Name);
        }
      } else {
        this.option.expandRowKeys = [];
      }
    },
    rowExpandChange () {
    },
    /* 获取数据表列数据 */
    getDatabaseTableColumns (id, tableName) {
      getDatabaseTableColumns(id, tableName).then(res => {
        return res.data;
      });

    },
    /* 获取数据表表格数据 */
    getDatabaseTableDatas (id, tableName) {
      getDatabaseTableDatas(id, tableName).then(res => {
        this.databaseTableDatas = res.data.data;
      });
    },
    /* 打开数据表-获取表头 */
    async openDatabaseTable () {
      const { databaseTableName, databaseTableId } = this;

      if(!databaseTableId){
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('databaseManage.databaseTable.selectDataPrompt.promptDatabase'),
          type: 'warning'
        });
        return;
      }
      if (!databaseTableName) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('databaseManage.databaseTable.selectDataPrompt.promptContent'),
          type: 'warning'
        });
        return;
      }

      const { data: { data, code } } = await getDbFieldByName(databaseTableId, databaseTableName);
 
      if (code) return;

      this.openDatabaseTableData(databaseTableId, databaseTableName);

      this.databaseOpenList = [];
      data.forEach(item => {
        this.databaseOpenList.push({
          Name: item.Name,
          Description: item.Description,
          IsKey: item.IsKey,
        });
      });

      this.DBTDialog = true;

    },
    /* 打开数据表-获取表体 */
    async openDatabaseTableData (databaseTableId, databaseTableName) {
      const { data: { data, code } } = await getDbFieldByData(databaseTableId, databaseTableName);
      if (code) return;
      this.databaseOpen = [];
      this.databaseOpen = data;
    },
    DBTClose () {
      this.DBTDialog = false;
    },
    /* 获取字典数据 */
    getDataDictionary (id) {
      if (!id) throw new Error(`字典数据ID为 ${id}`);
      getDataDictionary(id).then(res => {
        this.dataDictionary = res.data.data;
        this.FormatResult(this.dataDictionary);
      });
    },
    /* 格式化数据 */
    FormatResult (data) {
      if (!data) return;
      let newList = [];
      data.forEach((item) => {
        let isHave = false;

        let obj = {};
        newList.forEach((it) => {
          if (it.F_Code === item.F_Code) {
            isHave = true;
            obj = it;
          }
        });
        if (isHave) {
          obj[item.F_TypeCode] = item.F_Name;
        } else {
          const newObj = {
            F_Code: item.F_Code,
          };
          newObj[item.F_TypeCode] = item.F_Name;
          newList.push(newObj);
        }
      }, this);
      /* return newList;*/
      this.dataDictionary = newList;
    },
    /* 打开 */
    openDialog () {
      this.flag = true;
      this.dialogVisible = true;
      this.languageTypeForm = {};
    },
    /* 关闭 */
    closeDialog () {
      this.dialogVisible = false;
    },
    /* 提交 */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {});

      // addDatabaseTableRelease()
    },
    /* 编辑 */
    editForm (row) {
      this.flag = false;
      this.dialogVisible = true;
      this.dataDictionaryForm = row;
    },
    /* 删除 */
    deleteForm (row) {
      this.$confirm(this.$t('deletePrompt.promptContent'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: 'warning'
      }).then(() => {
        deleteDataDictionary(row.F_Code).then(() => {
          this.dialogVisible = false;
          this.getDataDictionary(this.moduleId);
        });
      }).catch(() => {

      });
    },
    /* 取消 */
    cancelDialog () {
    },
    /* 搜索 */
    search () {
		this.page.currentPage=1
        this.getDatabaseTable()
    },
    /* 搜索 表单重置 */
    searchReset () {
      this.searchParam = {};
      this.getDatabaseTable();
    },
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100% !important;
  padding: 0 8px;
}

div /deep/.el-form-item__label{
	width: 60px!important;
}
div /deep/.el-form-item__content{
	margin-left: 60px!important;
}
div /deep/.el-dialog__body{
	line-height: 16px;
}
 /deep/ .el-dialog__body{
	padding-bottom: 20px!important;
}
@media screen and (max-width: 1370px) {
.open_data{
	height: 440px!important;
}
/deep/ .el-dialog{
			margin-top: 10vh!important;
		}
}
/deep/ .el-table__expanded-cell  .avue-crud__right{
	position: static!important;
	float: right;
	margin-bottom: 8px;
}
/deep/ .el-table__expanded-cell[class*=cell]{
	padding-top:0px;
}
/deep/ .el-dialog__body .avue-crud .avue-crud__left{
	margin-right: 10px;
	margin-top: 0px;
}
/deep/ .el-input--small .el-input__icon{
	line-height: 20px;
}
/deep/ .el-table__expanded-cell .avue-crud__left{
	margin: 0px;
}
</style>
