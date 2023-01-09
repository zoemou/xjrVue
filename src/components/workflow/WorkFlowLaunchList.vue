<template>
  <div
    class="main-container"
    :style="{ padding: showLeftTree ? '0 8px 0px 0px' : '0' }"
  >
    <MainFixed :title="fixedTitle" v-if="showLeftTree">
      <div slot="list">
        <elTree
          :data="elTree.data"
          :props="elTree.props"
          :node-key="elTree.nodeKey"
          ref="leftListTree"
          :default-checked-keys="[0]"
          :default-expand-all="false"
          @node-click="elTree.NodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ node, data }">
		        <i class="icon-liucheng"></i>
		        <span>{{ data.F_ItemName}}</span>
		 </span>
        </elTree>
      </div>
    </MainFixed>
    <main-content
      :title="contentTitle"
      :paddingLeft="showLeftTree ? 205 : 0"
      :padding-top="94"
    >
      <div slot="search" v-if="showSearch">
        <p class="head_title">{{$t('workFlow.launchList.headTitle')}}</p>
        <div class="wf-search-box">
          <el-input
            v-model="search.Keyword"
            size="small"
            :placeholder="$t('workFlow.launchList.placeholderQueryFlow')"
            style="width: 200px; margin-right:10px;"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchList"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button
            icon="el-icon-circle-close"
            size="small"
            @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div
        slot="table"
        alt="在此处放置表格内容"
        style="height:calc(100% - 40px);overflow: overlay;"
        class="flow_box"
      >
        <avue-empty :desc="$t('deletePrompt.noData')" v-if="listParams.Listdata.length === 0"></avue-empty>
        <div v-else class="launch-box">
          <div class="launch-list">
            <List :listParams.sync="listParams" @changLaunch="changLaunch">
            </List>
          </div>
          <div class="page page-fixed el-pagination is-background">
            <el-pagination
              :background="page.background"
              @current-change="handleCurrentChange"
              :current-page.sync="page.currentPage"
              :page-size="page.pageSize"
              :layout="page.layout"
              :total="page.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </main-content>
    <slot></slot>
  </div>
</template>
<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import List from "./List";
// 接口
import { getWorkflowSchemeInfo } from "@/api/workFlow/WFLaunch";
export default {
  name: "SelectFlow",
  props: {
    showLeftTree: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    selectList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nwfSchemeInfoIdList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nwfRelationId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  components: { MainContent, MainFixed, List },
  data() {
    var _this = this;
    return {
      fixedTitle:this.$t('workFlow.launchList.fixedTitle'),
      contentTitle: "模板列表",
      search: {
        Category: null,
        Limit: 1,
        Size: 20,
        Keyword: "",
        Order: null,
        OrderField: null,
        OrderCondition: null
      },
      listParams: {
        Listdata: [],
        checkedIds: [],
        checkedList: [],
        isSingle: this.isSingle
      },
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, prev, pager, next, jumper",
        background: false,
        pageSize: 30
      },
      elTree: {
        data: [],
        nodeKey: "F_ItemDetailId",
        defaultCheckedIndex: 0,
        props: {
          label: "F_ItemName",
          children: null,
          disabled: null,
          isLeaf: null
        },
        showLeftTree: this.showLeftTree,
        NodeClick: function(data, element, component) {
          _this.contentTitle = data.contentTitle || data.label;
          _this.search.Keyword = null;
          _this.search.Category = data.id;

          _this.searchList();
        }
      }
    };
  },
  async created() {
    let resData = await this.$store.dispatch("updatewWorkFlowCategory");
    this.elTree.data = resData; // 赋值渲染
    this.searchList();
  },
  mounted() {
    this.listParams.checkedIds = this.selectList.map(ele => {
      return ele.F_Id;
    });
    this.listParams.checkedList = this.selectList;
	 let computedHeight =0;
  },
  methods: {
    searchList() {
      this.search.Limit = this.page.currentPage;
      this.search.Size = this.page.pageSize;
      this.search.mark = 1;
      if (this.nwfSchemeInfoIdList.length > 0) {
        this.search.nwfSchemeInfoId = this.nwfSchemeInfoIdList.join(",");
      }
      if (this.nwfRelationId) {
        this.search.nwfRelationId = this.nwfRelationId;
      }
      getWorkflowSchemeInfo(this.search).then(res => {
        if (res.data.success) {
          this.listParams.Listdata = res.data.data.Rows;
          this.page.total = res.data.data.Total;
        } else {
          this.listParams.Listdata = [];
          this.page.total = 0;
        }
      });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.searchList();
    },
    searchReset() {
      this.search.Keyword = null;
			this.searchList();
    },
    changLaunch(selectItem) {
      if (this.isSingle) {
        this.listParams.checkedIds = [selectItem.F_Id];
        this.listParams.checkedList = [{ ...selectItem }];
        this.$emit("launchProcess", selectItem);
      }
    },
    getCheckedList() {
      return this.listParams.checkedList;
    }
  }
};
</script>
<style scoped>
div /deep/ .launch-box{
  height: 100%;
}
div /deep/  .page{
    position: fixed;
    bottom: 20px;
    right: 30px;
}
div /deep/ .launch-list {
  display: flex;
  flex-direction: column;
  height: 9%;
}
div /deep/ .main-fixed {
  margin: 0px 5px 0px 5px;
}
div /deep/ .main-table {
  min-height: 300px;
  height: calc(100% - 50px);
  overflow: hidden;
}
div /deep/ .main-table-content {
  padding-bottom: 0px;
  overflow: hidden;
}
@media screen and (max-width: 1370px) {
  .launch-list {
    height: 90%;
  }
}
div /deep/ .main-search {
  border-top: none;
}
.search-item > div {
  width: 100%;
}
.head_title {
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  margin-top: -10px;
  line-height: 40px;
  color: #4d4d4d;
}
.process_title .main-content .head_title {
  display: none;
}
.wf-search-box{
	height: 33px;
	margin: 6px 0px;
	text-indent:5px;
	border-bottom: 1px solid #f2f2f2;
}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px!important;
}	
</style>
