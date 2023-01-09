<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">
    <MainContent title="" :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            class="search-input"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchData"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="cuTable"
          :data="tableData"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @row-dblclick="handleRowDBLClick"
        >
        <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="add()"
              v-if="hasButtonPermission('add')"
              >{{$t('buttonModule.addBtn')}}
            </el-button>
          </template>
           <template slot="menu" slot-scope="scope">
           <el-button
              type="opr-primary"
              size="mini"
              @click="edit(scope.row)"
              v-if="hasButtonPermission('modify')"
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              @click="deleteRow(scope.row)"
              v-if="hasButtonPermission('delete')"
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
             </template>
        </avue-crud>
      </div>
    </MainContent>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import { designerUrl,editDesignerUrl,getDataList,deleteRow } from '@/api/bi/index';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import authorizeMixin from "@/mixins/authorize";
export default {
  name: "ReportList",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent },
  data() {
    return {
      loading:false,
      searchParam: { limit: 1, size: 20, keyword: null },
      page: { pageSize: 20, total: 0, currentPage: 1 },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('tableOperationModule.tabNum'),
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          { sortable: true, label:this.$t('reportList.fileName'), prop: "name" },
          // { sortable: true, label:this.$t('reportList.address'), prop: "address",width:"140"},
          // { sortable: true, label:this.$t('reportList.createUser'), prop: "create_user_name" ,width:"140"},
          { sortable: true, label:this.$t('reportList.createTime'), prop: "create_time",width:"150" },
          // { sortable: true, label:this.$t('reportList.modifyUser'), prop: "update_user_name" ,width:"140"},
          { sortable: true, label:this.$t('reportList.modifyTime'), prop: "update_time",width:"150"  },
        ],
      },
      tableData: []
    };
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.edit(row)
      }
    },
    async getList(){
      let res = await getDataList(this.searchParam);
      if(res&&res.data&&res.data.success){
        this.page.total = res.data.data.Total;
        this.tableData = res.data.data.Rows;
      }
    },
    onPageLoad(page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
      this.getList();
    },
    searchData() {
      this.getList();
    },
    searchReset() {
      this.searchParam = { limit: 1, size: 20, keyword: null };
      this.getList();
    },
    add(){
      let url =designerUrl();
      window.open(url, "_blank");
    },
    edit(row){
      let url = editDesignerUrl(row.name);
      window.open(url, "_blank");
    },
    async deleteRow(row){
       let res = await deleteRow(row.id);
        if(res&&res.data&&res.data.success){
           this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('deletePrompt.hintSuccess'),
          type: "success",
        });
        }else{
          this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('deletePrompt.hintFailure'),
          type: "warning",
        });
        }
        this.getList();
    }
  },
};
</script>
<style scoped>
.search-input {
  width: 200px;
  margin-right:5px;
}
@media screen and (max-width: 1370px) {
	div /deep/ .el-dialog{
		margin-top: 8vh!important;
	}
}
</style>
