<template>
  <div>
    <div class="search-box" v-if="searchFlagList.length>0">
    <el-form label-width="100px" inline class="box1" :key="key">
      <el-form-item
        :label="item.name"
        v-for="(item, index) in searchFlagList"
        :key="index" class="box1-item"
      >
        <SearchItem :item="item" :searchParam.sync="searchParam"></SearchItem>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary" 
          icon="el-icon-search"
          size="small"
          @click="searchList()"
          >{{ $t("searchModule.searchBtn") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset()">{{
          $t("searchModule.searchReset")
        }}</el-button>
        <!-- 多余三个搜索框，显示折叠面板 -->
        <span
          v-if="searchParamsList && searchParamsList.length > 3"
          class="search-flag "
          @click="searchFlag=true"
          ><i class='el-icon-arrow-left'></i>{{$t('menuManagement.tableOpen')}}
        </span>
      </el-form-item>
    </el-form>
  </div>
  <ResizeDrawerBox v-if="searchFlag" class="box2">
      <el-header style="border-bottom: 1px solid rgb(237 235 235);height: 40px;"> 
        <i class="el-icon-close search-close" @click="searchFlag=false"></i>
      </el-header>
      <el-form label-width="90px" class="search-list" :key="key">
        <el-form-item
          :label="item.name"
          v-for="(item, index) in searchParamsList"
          :key="index"
        >
          <SearchItem :item="item" :searchParam.sync="searchParam"></SearchItem>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchList()"
            >{{ $t("searchModule.searchBtn") }}</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="searchReset()"
            >{{ $t("searchModule.searchReset") }}</el-button
          >
        </el-form-item>
      </el-form>
    </ResizeDrawerBox>
  </div>
</template>

<script>
import SearchItem from "./SearchItem.vue";
import ResizeDrawerBox from "./ResizeDrawerBox.vue";
export default {
  components: {
    SearchItem,
    ResizeDrawerBox
  },
  props: {
    searchParamsList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    searchParam: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      searchFlagList: [],
      params: {},
      searchFlag: false,
      key:1
    };
  },
  created() {
    this.searchFlagList = this.searchParamsList.slice(0, 3);
  },
  methods: {
    searchList() {
      this.$emit("searchBoxParams", this.searchParam);
    },
    searchReset() {
      this.key++;
      this.$emit("searchReset");
    }
  }
};
</script>

<style scoped>
/* .search-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  z-index: 7;
} */
.search-flag {
  margin-left: 10px;
  cursor: pointer;
  z-index: 8;
}
.search-close{
  position: fixed;
    top: 10px;
    right: 20px;
}
.search-list{
  padding: 14px;
  overflow: scroll;
  height: 94%;
}
.box1 /deep/ .el-form-item__label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box1 /deep/ .el-form-item{
	margin-top: 0;
	margin-bottom: 6px !important;
}
.search-list /deep/ .el-form-item__label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* .box1{
  display: flex;
  z-index: 8;
} */
.box2{
  z-index: 2000;
}
.box1-item /deep/ .el-range-editor{
  width: 240px !important;
}
</style>
