<template>
  <div class="box">
    <div class="left">
      <span class="title">{{$t('workFlow.selectLaunch.templateSelect')}}</span>
      <div class="main-container">
        <div>
          <div class="search-box">
            <el-input
              v-model="search.Keyword"
              size="small"
              :placeholder="$t('searchModule.searchPlaceholder')"
              class="search-input"
            ></el-input>
            <el-select v-model="search.Category" :placeholder="$t('workFlow.selectLaunch.selectType')">
              <el-option :label="$t('workFlow.selectLaunch.labelSelect')" value=""> </el-option>
              <el-option
                v-for="item in categoryList"
                :key="item.F_ItemDetailId"
                :label="item.F_ItemName"
                :value="item.F_ItemDetailId"
              >
              </el-option>
            </el-select>
            <el-button
			style="margin:0px 10px;"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchList"
              >{{$t('searchModule.searchBtn')}}</el-button
            >
            <el-button
			style="margin-left: 0px;"
              icon="el-icon-circle-close"
              size="small"
              @click="searchReset"
              >{{$t('searchModule.searchReset')}}</el-button
            >
          </div>
        </div>
        <div>
          <avue-empty :desc="$t('deletePrompt.noData')" v-if="listParams.Listdata.length === 0"></avue-empty>
          <div class="launch-box" v-else>
            <List :listParams.sync="listParams" @changLaunch="changLaunch">
            </List>

            <div class="avue-crud__pagination">
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
      </div>
    </div>
    <div class="right">
      <span class="title">{{$t('workFlow.selectLaunch.selectedTemplate')}}</span>
      <CheckedList :listParams.sync="listParams" @changLaunch="changLaunch"> </CheckedList>
    </div>
  </div>
</template>
<script>
import List from "@/components/workflow/List";
import CheckedList from "./CheckedList";
// 接口
import { getWorkflowSchemeInfo } from "@/api/workFlow/WFLaunch";
export default {
  name: "SelectLaunch",
  props: {
    selectList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { List, CheckedList },
  data() {
    return {
      fixedTitle:this.$t('workFlow.selectLaunch.fixedTitle'),
      contentTitle: "模板列表",
      search: {
        Category: null,
        Limit: 1,
        Size: 20,
        Keyword: "",
        Order: null,
        OrderField: null,
        OrderCondition: null,
      },
      listParams: {
        Listdata: [],
        checkedIds: [],
        checkedList: [],
      },
      categoryList: [],
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, prev, pager, next, jumper",
        background: false,
        pageSize: 9,
      },
    };
  },
  async created() {
    this.categoryList = await this.$store.dispatch("updatewWorkFlowCategory");
    this.searchList();
  },
  mounted() {
    this.listParams.checkedList = this.selectList;
    this.listParams.checkedIds = this.selectList.map((ele) => {
      return ele.F_Id;
    });
  },
  methods: {
    searchList() {
      const loading = this.$loading({
        lock: true,
        text:this.$t('workFlow.selectLaunch.hintLoading'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      this.search.Limit = this.page.currentPage;
      this.search.Size = this.page.pageSize;

      getWorkflowSchemeInfo(this.search).then((res) => {
        if (res.data.success) {
          this.listParams.Listdata = res.data.data.Rows;
          this.page.total = res.data.data.Total;
        } else {
          this.listParams.Listdata = [];
          this.page.total = 0;
        }
        loading.close();
      });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.searchList();
    },
    searchReset() {
      this.search.Keyword = null;
    },
    changLaunch() {
      this.$emit("changeTemplateList", this.listParams.checkedList);
    },
  },
};
</script>
<style lang="scss" scoped>
.launch-box {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 10px;
  min-height: 340px;
}
.avue-crud__pagination {
    position: absolute;
    text-align: right;
    position: absolute;
    bottom: 10px;
    right: 10px;
}
.search-input {
  width: 200px;
  margin-right: 10px;
  // margin-bottom: 10px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  margin-left: 10px;
}
.box {
  display: flex;
  justify-content: space-between;
  .left {
    flex-basis: 54%;
    margin: 10px 5px 10px 0px;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: scroll;
	padding:10px 10px 0 10px;
	height: 430px;
  }
  .right {
    flex-basis: 46%;
    margin: 10px 0px 10px 5px;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: scroll;
	height: 430px;
	padding:10px 10px 0 10px;
  }
}
.item-list {
  display: flex;
  flex-wrap: wrap;
}
.item-box {
  width: 420px;
  height: 66px;
  padding: 0 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
  img {
    float: left;
    width: 66px;
    height: 66px;
    margin-right: 15px;
  }

  .item-info {
    padding-left: 81px;
    box-sizing: border-box;
  }

  .item-info p {
    height: 22px;
    margin: 0;
    font-size: 12px;
    line-height: 22px;
  }
  .item {
    width: 100%;
    height: 66px;
    color: #303133;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    transition: 0.3s;
    box-sizing: border-box;
    position: relative;
  }
  .item i {
    display: none;
  }
  .item i.checked {
    display: block;
    position: absolute;
    right: 0px;
    top: 0;
    color: #fff;
    width: 0;
    height: 0;
    border-width: 0 30px 30px 0px;
    border-style: solid;
    border-color: #f56c6c #f56c6c transparent transparent;
    font-weight: bold;
    font-size: 14px;
    text-indent: 1em;
    line-height: 20px;
  }
  .checked {
    border: 1px solid #f56c6c;
  }
}

@media screen and (max-width: 1370px) {
	.box {
	 
	  .left {
		height: 340px;
	  }
	  .right {
		height: 340px;
	  }
	}
	} 
</style>
