<template>
  <div class="main-container">
    <main-content :title="contentTitle" :paddingLeft="0">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.Keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 20px"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchRoles">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <avue-crud
          :data="rolesList"
          :option="option"
          stripe
          @row-click="handleCurrentRowChange"
          :page.sync="page"
          @on-load="onPageLoad"
        >
        </avue-crud>
      </div>
    </main-content>
  </div>
</template>

<script>
import MainContent from "@/page/main/MainContent";
import { getRoles } from "@/api/organization/role";

export default {
  name: "roleAuthorize",
  components: { MainContent },
  data() {
    return {
      contentTitle: "角色列表",
      searchParam: { Keyword: "" },
      rolesList: [],
      page: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
      option: {
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        menuWidth: 150,
        // maxHeight: 550,
        border: true,
        page: true,
        index: true,
        companyId: "",
        indexLabel: this.$t('orgRoleManagement.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t('orgRoleManagement.tabRoleNumber'),
            prop: "F_EnCode",
          },
          {
            sortable: true,
            label: this.$t('orgRoleManagement.tabRoleName'),
            prop: "F_FullName",
          },
          {
            sortable: true,
            label:this.$t('orgRoleManagement.tabCreateTime'),
            prop: "F_CreateDate",
          },
          {
            sortable: true,
            label:  this.$t('orgRoleManagement.tabFounder'),
            prop: "F_CreateUserName",
          },
          {
            sortable: true,
            label: this.$t('orgRoleManagement.tabEffective'),
            prop: "F_EnabledMark",
          },
          {
            sortable: true,
            label: this.$t('orgRoleManagement.tabRoleDescription'),
            prop: "F_Description",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      let params = { limit: this.page.currentPage, size: this.page.pageSize, Keyword: this.searchParam.Keyword };
      getRoles(params).then((res) => {
        this.page.total = res.data.data.Total;
        this.rolesList = res.data.data.Rows;
      });
    },

    handleCurrentRowChange(val) {
      this.flag = false;
      this.objectId = val.F_RoleId;
    },
    sortChange() {
      this.getRolesList();
    },
    onPageLoad() {
      this.getRolesList();
    },
    searchRoles() {
      this.page.currentPage = 1;
      this.getRolesList();
    },
    searchReset() {
      this.searchParam.Keyword = "";
      this.page.currentPage = 1;
      this.getRolesList();
    },
    getReuseId() {
      return this.objectId;
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
