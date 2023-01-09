<template>
  <div>
    <el-date-picker
      v-if="item.type == 'date'"
      v-model="searchParam[item.field]"
      type="daterange"
      :range-separator="$t('searchModule.rangeSeparator')"
      :start-placeholder="$t('searchModule.startDatePlaceholder')"
      :end-placeholder="$t('searchModule.endDatePlaceholder')"
			format="yyyy-MM-dd"
			value-format="yyyy-MM-dd"
      :style="{ width: '100%' }"
    ></el-date-picker>
    <el-select
      v-else-if="item.type == 'select' && item.multiple"
      v-model="searchParam[item.field]"
      filterable
      clearable
      :multiple="item.multiple"
      style="width: 100%"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
    >
      <el-option
        v-for="(item2, index2) in item.optionList"
        :key="index2"
        :label="item2[item.showField]"
        :value="item2[item.saveField]"
      >
      </el-option>
    </el-select>
    <el-select
      v-else-if="item.type == 'select' && !item.multiple"
      v-model="searchParam[item.field]"
      filterable
      clearable
      style="width: 100%"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
    >
      <el-option
        v-for="(item2, index2) in item.optionList"
        :key="index2"
        :label="item2[item.showField]"
        :value="item2[item.saveField]"
      >
      </el-option>
    </el-select>
    <avue-load-tree
      v-else-if="item.type == 'input-tree'"
      type="tree"
      :__type__ ="item.selectType"
      v-model="searchParam[item.field]"
      @change="(selected)=>{searchParam[item.field] = selected}"
      :dic="item.optionList"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
    >
    </avue-load-tree>
    <xjr-select-user
      v-else-if="item.type == 'select-user'"
      v-model="searchParam[item.field]"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
    >
    </xjr-select-user>
    <el-cascader
      v-else-if="item.type == 'select-area'"
      v-model="searchParam[item.field]"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
      :props="item.props"
      clearable
    ></el-cascader>

    <el-color-picker
      v-else-if="item.type == 'color-picker'"
      v-model="searchParam[item.field]"
    >
    </el-color-picker>
    <el-time-picker
      v-else-if="item.type == 'time-picker'"
      is-range
      v-model="searchParam[item.field]"
      :range-separator="$t('至')"
      :start-placeholder="$t('开始时间')"
      :end-placeholder="$t('结束时间')"
      :placeholder="$t('选择时间范围')"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      :style="{ width: '100%' }"
    >
    </el-time-picker>
    <template v-else-if="item.type == 'date-picker'">
      <template   v-if="item.pickerType=='yearrange'">
        <YearRange  v-model="searchParam[item.field]"  :field="item.field" @changeValue="changeValue"></YearRange>
      </template>
     <el-date-picker
      v-else
      v-model="searchParam[item.field]"
      :type="item.pickerType"
      :range-separator="$t('searchModule.rangeSeparator')"
      :start-placeholder="$t('searchModule.startDatePlaceholder')"
      :end-placeholder="$t('searchModule.endDatePlaceholder')"
      :style="{ width: '100%' }"
      :format="item.format"
      :value-format="item.valueFormat"
      :placeholder="$t('Notice.placeholderSelectDate')"
    >
    </el-date-picker>
    </template>
   
    <xjr-cascader
      v-else-if="item.type == 'cascader'"
      v-model="searchParam[item.field]"
      :settings="item.optionList"
      :checkStrictly="item.checkStrictly?item.checkStrictly:false"
      :show-all-levels="item['show-all-levels']?item['show-all-levels']:false"
      :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')+ item.name"
      separator="/"
      filterable
    ></xjr-cascader>
      <el-input
     v-else-if="item.type == 'input-number'"
      v-model.number="searchParam[item.field]"
      onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
      @input.native="changeNum"
      size="small"
      type="number"
      style="{ width: 100% }"
      :placeholder="$t('deletePrompt.hinrEnterSpace') + item.name"
      :key="showKey"
    ></el-input>
    <el-input
      v-else
      v-model="searchParam[item.field]"
      size="small"
      clearable
      style="{ width: 100% }"
      :placeholder="$t('deletePrompt.hinrEnterSpace') + item.name"
    ></el-input>

  </div>
</template>

<script>
import YearRange from './YearRange.vue';
export default {
  components: {
    YearRange,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    searchParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      showKey: 0
    }
  },
  methods: {
    changeValue({field,val}) {
      this.searchParam[field] = val;
    },
    changeNum(e,field){
       if (e.data&&!/^\d*$/.test(e.data)) {
        this.searchParam[field] = 0;
        setTimeout(() => {
          this.showKey++;
        }, 0);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-cascader {
  line-height: inherit;
}
</style>
