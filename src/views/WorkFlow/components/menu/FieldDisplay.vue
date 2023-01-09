<template>
  <div>
    <avue-crud
      :data="querySelection"
      :option="queryoption"
      stripe
    >
    </avue-crud>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      querySelection: [],
      alignOptions: [
        { value:this.$t('workFlow.filedConfig.centered')},
        { value:this.$t('workFlow.filedConfig.alignLeft')},
        { value:this.$t('workFlow.filedConfig.alignRight') },
      ],
      queryoption: {
        stripe: true,
        calcHeight: "auto", //表格高度差（主要用于减去其他部分让表格高度自适应）
        height: "400px", //表格高度
        maxHeight: "auto",
        border: true,
        align: "center",
        menu: false,
        page: false,
        header: false,
        column: [
          {
            label:this.$t('workFlow.filedConfig.tabCName'),
            prop: "fieldName",
          },
          {
            label:this.$t('workFlow.filedConfig.tabAlign'),
            prop: "align",
          },
          {
            label: this.$t('workFlow.filedConfig.tabWidth'),
            prop: "width",
          },
        ],
      },
    }
  },
   created() {
    let { F_SettingJson } = this.formData;
    F_SettingJson = F_SettingJson ? JSON.parse(F_SettingJson) : {};
    let { step4 = {fields:[]} } = F_SettingJson;
    this.querySelection = step4.fields;
  },
};
</script>

<style lang="scss" scoped></style>
