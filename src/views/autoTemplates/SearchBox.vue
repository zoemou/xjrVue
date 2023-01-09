<template>
  <div class="searchBox" v-if="showBox">
    <el-form label-width="90px">
      <el-form-item
        :label="item.name"
        v-for="(item, index) in searchFlagList"
        :key="index"
      >
        <el-date-picker
          v-if="item.type == 'date'"
          v-model="searchParam[item.field]"
          type="daterange"
          :range-separator="$t('searchModule.rangeSeparator')"
          :start-placeholder="$t('searchModule.startDatePlaceholder')"
          :end-placeholder="$t('searchModule.endDatePlaceholder')"
          :style="{ width: '100%' }"
        ></el-date-picker>
        <el-select
          v-else-if="item.type == 'select'"
          v-model="searchParam[item.field]"
          filterable
          clearable
          :multiple="item.multiple"
          style="width:100%"
          :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')"
        >
          <el-option
            v-for="(item2, index2) in item.optionList"
            :key="index2"
            :label="item2[item.showField]"
            :value="item2[item.saveField]"
          >
          </el-option>
        </el-select>
        <avue-input-tree
          v-else-if="item.type == 'input-tree'"
          type="tree"
          v-model="searchParam[item.field]"
          :dic="item.optionList"
          :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')"
        >
        </avue-input-tree>
        <xjr-select-user
          v-else-if="item.type == 'select-user'"
          v-model="searchParam[item.field]"
          :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')"
        >
        </xjr-select-user>
        <el-cascader
          v-else-if="item.type == 'select-area'"
          v-model="searchParam[item.field]"
          :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')"
          :props="item.props"
          clearable
        ></el-cascader>

        <el-color-picker
          v-else-if="item.type == 'color-picker'"
          v-model="searchParam[item.field]"
        >
        </el-color-picker>
        <el-time-select
          v-else-if="item.type == 'time-picker'"
          v-model="searchParam[item.field]"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          :style="{ width: '100%' }"
          :placeholder="$t('mobileDev.formRightSide.placeholderSelectTime')"
        >
        </el-time-select>
        <el-date-picker
          v-else-if="item.type == 'date-picker'"
          v-model="searchParam[item.field]"
          type="daterange"
          :range-separator="$t('searchModule.rangeSeparator')"
          :start-placeholder="$t('searchModule.startDatePlaceholder')"
          :end-placeholder="$t('searchModule.endDatePlaceholder')"
          :style="{ width: '100%' }"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :placeholder="$t('Notice.placeholderSelectDate')"
        >
        </el-date-picker>
        <el-input
          v-else
          v-model="searchParam[item.field]"
          size="small"
          clearable
          :style="{ width: '100%' }"
          :placeholder="$t('deletePrompt.hinrEnterSpace') + item.name"
        ></el-input>
      </el-form-item>
      <el-form-item class="searchBtn">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchList()"
          >{{$t('searchModule.searchBtn')}}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset()"
          >{{$t('searchModule.searchReset')}}</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 多余三个搜索框，显示折叠面板 -->
    <el-link
      class="search-flag"
      v-if="searchParamsList && searchParamsList.length > 3"
      @click="changeSearchFlag"
      >{{ searchFlag ? "收起" : "展开"
      }}<i
        :class="[!searchFlag ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
      ></i
    ></el-link>
  </div>
</template>

<script>
export default {
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
      this.searchFlagList = this.searchParamsList;
    } else {
      this.searchFlagList = this.searchParamsList.slice(0, 3);
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
        this.searchFlagList = this.searchParamsList;
      } else {
        this.searchFlagList = this.searchParamsList.slice(0, 3);
      }
      this.$emit("changeComputedHeight");
    },
    searchList() {
      this.$emit("searchBoxParams", this.searchParam);
    },
    searchReset() {
      this.$emit("searchReset");
    }
  }
};
</script>

<style scoped>
div >>> .el-form-item__label{
  line-height:27px;
}
div >>> .avue-input-tree {
  width: 100%;
}
div >>> .el-cascader {
  width: 100%;
}
div >>> .el-radio__inner {
  margin-top: 6px;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.el-form >>> .el-color-picker__trigger {
  height: 30px;
}
.el-form-item {
  width: 24%;
  margin-right: 4px;
}
.search-flag {
  margin-left: 10px;
  position: absolute;
  right: 10px;
  top: 20px;
}
.searchBtn /deep/ .el-form-item__content{
	margin-left: 0px!important;
}
</style>
