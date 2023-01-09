<template>
  <div :class="(searchFlag&&customSearchField && customSearchField.length > 0)?'custom-search-box':''" style="display:inline-block;margin-left:5px;">
    <!-- 自定义搜索 -->
    <template v-if="showBox && customSearchField.length > 0">
      <el-form-item
        :label="item.fieldName"
        v-for="(item, index) in customSearchField"
        class="custom-search-item"
        :key="index"
      >
        <el-input
          v-model="customSearchParams[item.name]"
          size="small"
          :placeholder="$t('deletePrompt.hinrEnterSpace') + item.fieldName"
          style="width:100%;"
        ></el-input>
      </el-form-item>
    </template>
    <div class="submit-search-box">
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="searchList"
        >{{$t('searchModule.searchBtn')}}</el-button
      >
      <el-button icon="el-icon-circle-close" size="small" @click="searchReset"
        >{{$t('searchModule.searchReset')}}</el-button
      >
      <!-- 多余三个搜索框，显示折叠面板 -->
      <el-link
        class="search-flag"
        v-if="customSearchField && customSearchField.length > 0"
        @click="changeSearchFlag"
        >{{ searchFlag ? "收起" : "展开"
        }}<i
          :class="[!searchFlag ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
        ></i
      ></el-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customSearchField: {
      type: Array,
      default: () => {
        return [];
      }
    },
    customSearchParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    searchFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchFlagList: [],
      params: {}
    };
  },
  created() {
    if (this.searchFlag) {
      this.searchFlagList = this.customSearchField;
      this.searchFlagList = this.customSearchField.slice(0, 3);
    }
  },
  computed: {
    showBox() {
      return this.searchFlagList.length > 0;
    }
  },
  methods: {
    changeSearchFlag() {
      if (this.searchFlag) {
        this.searchFlagList = this.customSearchField;
        this.searchFlagList = this.customSearchField.slice(0, 3);
      }
      this.$emit("changeComputedHeight");
    },
    searchList() {
      this.$emit("searchBoxParams", this.customSearchParams);
    },
    searchReset() {
      this.$emit("searchReset");
    }
  }
};
</script>

<style scoped>
/* 搜索框 */
.search-item > div {
  width: 100%;
}
.custom-search-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}
.custom-search-box .el-form-item {
  display: flex;
  flex-basis:28%;
}
.submit-search-box {
  
}
.search-flag {
  margin-left:10px;
  position: absolute;
  right: 10px;
  top: 20px;
}
</style>
