<template>
  <div class="main-container">
    <MainContent
      :title="contentTitle"
      :paddingLeft="0"
      :padding-top="94"
    >
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
		<div class="search-box">
        <el-input
          v-model="searchParam.keyword"
          size="small"
          :placeholder="$t('searchModule.searchPlaceholder')"
          style="width: 200px; margin-right: 5px"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="search"
          >{{$t('searchModule.searchBtn')}}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset"
          >{{$t('searchModule.searchReset')}}</el-button
        >
		</div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- <div class="table fullheight"> -->
          <avue-crud
            ref="dataSource"
            :data="dataSource"
            :option="option"
            :page.sync="page"
            :showColumn="showColumn"
            :isSaveColumns="true"
            @on-load="getDataSource"
            @row-click="currentRow"
            @row-dblclick="handleRowDBLClick"
          >
            <template slot="menuLeft">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="openDialog"
                v-if="hasButtonPermission('add')"
                >{{$t('buttonModule.addBtn')}}
              </el-button>
              <el-button
                
                size="small"
                @click="openDialogTest"
                v-if="hasButtonPermission('view')"
                >{{$t('databaseManage.dataSource.testViewBtn')}}</el-button
              >
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click="viewForm(scope.row)"
                v-if="hasButtonPermission('preview')"
                >{{$t('tableOperationModule.viewBtn')}}</el-button
              >
              <el-button type="opr-primary" size="mini" @click="editForm(scope.row)"
                v-if="hasButtonPermission('modify')"
                >{{$t('tableOperationModule.editorBtn')}}</el-button
              >
              <el-button
                type="opr-danger"
                size="mini"
                @click="deleteForm(scope.row)"
                v-if="hasButtonPermission('delete')"
                >{{$t('tableOperationModule.deleteBtn')}}</el-button
              >
            </template>
          </avue-crud>

          
       <!-- </div> -->
      </div>
    </MainContent>
	<!-- 新增 -->
	<add-data-source v-if="dialogVisible" :visible.sync="dialogVisible" :formEnCodeList="formEnCodeList" 
	:title="dialogTitle" :flag="flag" :dataSourceForm="dataSourceForm"></add-data-source>
	
	<!-- 测试查看 -->
	<el-dialog v-dialogDrag
	  :close-on-click-modal="false"
	  :title="$t('databaseManage.dataSource.testViewBtn')"
	  :append-to-body="true"
	  :visible.sync="dialogVisibleTest"
	  width="40%"
	  :before-close="closeDialogTest"
	>
	  <el-table :data="databaseOpen" style="width: 100%" height="500">
	    <template v-for="(item, index) in databaseOpenList">
	      <el-table-column
	        :key="index"
	        :prop="item"
	        :label="item"
	        width="150"
	      >
	      </el-table-column>
	    </template>
	  </el-table>
	</el-dialog>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import AddDataSource from '@/components/AddDataSource';
import { mapGetters } from "vuex";
import {
  getDataSourceByPage,
  getDbGroup,
  addDataSource,
  editDataSource,
  deleteDataSource,
  getDataFieldBySQL,
  getDataBySQL,
} from "@/api/databasemanage/datasource";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: "DataSource",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent,AddDataSource },
  computed: {
    ...mapGetters(["website"]),
  },
  watch: {
  	dialogVisible: {
  	  handler (val) {
  	    if(!val) this.getDataSource()
  	  }
  	}
  },
  data() {
    return {
      contentTitle:
        "数据源列表-根据SQL语句，预先设定数据源，供表单控件需要数据源时使用",
      contentSubTitle: "",
	  dialogTitle:this.$t('addDataSource'),
      searchParam: {},
      dataSource: [],
      dataSourceForm: {
        F_DbId: [],
      },
      databaseGroup: [],
      databaseType: ["SqlServer", "Oracle", "MySql"],
      dialogVisible: false,
      dialogVisibleTest: false,
      databaseOpenList: [], // 表头
      databaseOpen: [], // 表体  
	  page: {
	    pageSize: 20,
	    total: 0,
	    currentPage: 1
	  },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 180,
        border: false,
        page: true,
        index: true,
        indexLabel: this.$t('databaseManage.dataSource.tableNumber'),
        align: "center",
        menuAlign: "center",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t('databaseManage.dataSource.addModalCode'),
            prop: "F_Code",
			width:"",
			align: 'left',
			sortable:true
          },
          {
            label: this.$t('databaseManage.dataSource.addModalName'),
            prop: "F_Name",
			align: 'left',
			sortable:true
          },
          {
            label: this.$t('databaseManage.dataSource.tableDatabase'),
            prop: "F_DbName",
			align: 'left',
			sortable:true
          },
          {
            label: this.$t('databaseManage.dataSource.tableCreateUser'),
            prop: "F_CreateUserName",
			width:"110",
			align: 'left',
			sortable:true
          },
          {
            label: this.$t('databaseManage.dataSource.tableCreationTime'),
            prop: "F_CreateDate",
			width:"140",
			align: 'left',
			sortable:true
          },
          {
            label: this.$t('databaseManage.dataSource.addModalRemark'),
            prop: "F_Description",
			align: 'left',
			sortable:true
          },
        ],
      },
    };
  },
  created() {
    //this.getDataSource();
    this.getDatabaseGroup();
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.editForm(row)
      }
    },
    /* 获取语言类型 */
    getDataSource() {
	  let params = {
	    limit: this.page.currentPage,
	    size: this.page.pageSize,
	    Keyword: this.searchParam.keyword
	  };
      getDataSourceByPage(params).then((res) => {
        this.dataSource = res.data.data.Rows;
		this.page.total = res.data.data.Total;
      });
    },
    /* 获取数据库分组 */
    getDatabaseGroup() {
      getDbGroup().then((res) => {
        this.FormatTree(res.data.data);
      });
    },
    FormatTree(data) {
      if (this.website.tenantEnabled) {
        this.databaseGroup.push({
          F_DBName: "租户库",
          F_DatabaseLinkId: "tenantDB"
        });
      }

	  for (var item in data) {
	  	if(item=='localhost'){
	  	  this.databaseGroup.unshift({
	  		  F_DBName: data[item][0].F_DBName,
	  		  F_DatabaseLinkId: data[item][0].F_DatabaseLinkId
	  	  })
	  	}else{
	  	  let obj = {
	  		F_DatabaseLinkId: data[item][0].F_DatabaseLinkId,
	  		F_DBName: item,
	  		disabled: false,
	  		children: []
	  	  };
	  
	  	  if (data[item]) {
	  		data[item].forEach(it => {
	  		  it.F_DBName = it.F_DBAlias;
	  		  it.F_DatabaseLinkId = it.F_DatabaseLinkId;
	  		  obj.children.push(it);
	  		});
	  	  }
	  	  this.databaseGroup.push(obj);
	     }
	  }

      //如果是多租户
    },

    /* 单击行 */
    currentRow(row) {
      this.databaseLinkForm = row;
    },
    /* 打开 */
    openDialog() {
		this.dialogTitle=this.$t('addDataSource')

      this.flag = true;
      this.dialogVisible = true;

      this.dataSourceForm = {};
    },
    // 测试查看
    async openDialogTest() {
      if (!this.databaseLinkForm) {
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning",
        });
        return;
      }
      const {
        databaseLinkForm: { F_Id, F_Name },
      } = this;

      const {
        data: { data, code, msg },
      } = await getDataFieldBySQL(F_Id);
      if (code) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: msg,
          type: "warning",
        });
        return;
      }
      this.openDatabaseTableData(F_Id);

      this.databaseOpenList = data;

      this.dialogVisibleTest = true;
    },
    /* 打开数据表-获取表体 */
    async openDatabaseTableData(databaseTableId) {
      const {
        data: { data, code },
      } = await getDataBySQL(databaseTableId);
      if (code) return;
      this.databaseOpen = data;
    },
    closeDialogTest() {
      this.dialogVisibleTest = false;
    },
    viewForm(row) {
      this.$refs["dataSource"].rowView(row);
    },
    /* 编辑 */
    editForm(row) {
		this.dialogTitle=this.$t('updateDataSource')
      let val = { ...row };
      this.flag = false;
      this.dialogVisible = true;
      this.dataSourceForm = val;
    },
    /* 删除 */
    deleteForm(row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      })
        .then(() => {
          deleteDataSource(row.F_Id).then(() => {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('deletePrompt.successDeleted'),
              type: "success",
            });
            this.getDataSource();
          });
        })
        .catch(() => {});
    },
    /* 搜索 */
    search() {
      this.getDataSource();
    },
    /* 搜索 表单重置 */
    searchReset() {
      this.searchParam = {};
      this.getDataSource();
    },
  },
};
</script>

<style scoped>

.main-container {
  padding: 0 8px;
}
::v-deep .el-icon-view{
	font-size: small;
	line-height: normal;	
}
</style>
