<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="F_CompanyId"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="210" padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input
            v-model="searchParam.Keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 10px"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchUser">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="cuTable"
          v-if="companyId"
          :data="companiesUser"
          :option="option"
          stripe
          :page.sync="page"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @row-click="handleCurrentRowChange"
        >
        </avue-crud>
      </div>
    </main-content>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import { getCompaniesTree, getCompaniesUserList } from "@/api/organization/user";

export default {
  name: "UserAuthorize",
  components: { MainContent, MainFixed },
  data() {
	 const _this = this;
    return {
      fixedTitle:this.$t('orgUserManagement.fixedTitle'),
      contentTitle: "用户列表",
      companiesTree: [],
      companiesUser: [],
      companyId: "",
      searchParam: {
        Keyword: null,
        Department_Id: "",
      },
      defaultProps: {
        children: "children",
        label: "F_FullName",
      },
      dialogVisible: false,
      page: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
      option: {
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        menuWidth: 150,
        // maxHeight: 550,
        border: true,
        page: true,
        index: true,
        indexLabel: this.$t('orgDepartManagement.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabAccount'),
            prop: "F_Account",
          },
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabName'),
            prop: "F_RealName",
          },
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabSex'),
            prop: "F_Gender",
            formatter: function(row) {
              return row.F_Gender === 0 ?  _this.$t('custmerForm.female'): row.F_Gender === 1 ? _this.$t('custmerForm.male'): "";
            },
          },
          {
            sortable: true,
            label:this.$t('orgUserManagement.tabMobile'),
            prop: "F_Mobile",
          },
          {
            label:this.$t('code.leftScrollbar.component.department'),
            prop: "F_DepartmentName",
          },
          {
            sortable: true,
            label:this.$t('orgUserManagement.tabState'),
            prop: "F_EnabledMark",
            formatter: function(row) {
              return row.F_EnabledMark === 0 ? _this.$t('custmerForm.tableDisable'):_this.$t('custmerForm.tableEnable');
            },
          },
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabRemark'),
            prop: "F_Description",
          },
        ],
      },
    };
  },
  created() {
    this.getCompaniesTree();
  },
  methods: {
    getCompaniesTree() {
      getCompaniesTree().then((res) => {
        this.companiesTree = res.data.data;
        this.companyId = res.data.data[0].F_CompanyId;
        this.$nextTick(function() {
          this.getUser();
        });
      });
    },
    handleNodeClick(data) {
      this.searchParam.keyword = null;
      this.companyId = data.F_CompanyId;
      this.getUser();
    },
    handleCurrentRowChange(val) {
      this.objectId = val.F_UserId;
    },
    searchUser() {
      this.getUser();
    },
    searchReset() {
      this.searchParam.Keyword = null;
      this.searchParam.Department_Id = null;
      this.page.currentPage = 1;
      this.getUser();
    },
    sortChange() {
      this.getUser();
    },
    onPageLoad() {
      this.getUser();
    },
    getReuseId() {
      return this.objectId;
    },
    getUser() {
      let params = {
        Company_Id: this.companyId,
        limit: this.page.currentPage,
        size: this.page.pageSize,
        Keyword: this.searchParam.Keyword,
        Department_Id: this.searchParam.Department_Id,
      };
      getCompaniesUserList(params).then((res) => {
        this.companiesUser = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });
    },
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 10px;
}
</style>
