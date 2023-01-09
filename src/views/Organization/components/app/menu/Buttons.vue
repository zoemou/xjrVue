<template>
  <!-- 按钮信息 -->
  <avue-crud
    ref="buttonTable"
    :data="menuParams.buttonList"
    :option="buttonOption"
    stripe
    @row-save="handleSave"
    @row-update="handleUpdate"
    @row-del="rowDel"
    @sortable-change="sortableChange"
  >
  </avue-crud>
</template>

<script>
import { baseUrl } from "@/config/env";
import { validateLength } from "@/api/organization/validateFunc";
import { getLgMarkList } from "@/api/language/translation";
export default {
  props: {
    menuParams: {
      type: Object,
    },
  },
  data() {
    return {
      buttonOption: {
        dialogDrag: true,
        columnBtn: false,
        sortable: true,
        dragHandler: true,
        highlightCurrentRow: true,
        stripe: false,
        height: 260,
        border: true,
        page: false,
        index: false,
        align: "center",
        refreshBtn: false,
        column: [
          {
            label: this.$t("menuManagement.editModal.tabName"),
            prop: "F_FullName",
            rules: [{ validator: validateLength, trigger: "change" }],
          },
          {
            label: this.$t("menuManagement.editModal.tabCode"),
            prop: "F_EnCode",
            rules: [{ validator: validateLength, trigger: "change" }],
          },
          {
            label: this.$t("menuManagement.addModal.labelTransTag"),
            prop: "F_LgMarkCode",
            formatter: function (row) {
              return row.F_LgMarkName;
            },
            type: "select",
            remote: true,
            dicFlag: false,
            dicUrl: baseUrl + "/lg-mark?keyword={{key}}",
            props: {
              label: "F_Name",
              value: "F_EnCode",
            },
          },
        ],
      },
    };
  },
  methods: {
    async handleSave(form, done, loading) {
      if (form.F_LgMarkCode) {
        let res = await getLgMarkList({
          keyword: form.F_LgMarkCode,
        });
        form.F_LgMarkName = res?.data?.data[0]?.F_Name;
      }
      form.F_ModuleButtonId = "";
      this.menuParams.buttonList.push(form);
      done();
    },
    sortableChange(oldindex, newindex, row, list) {
      this.menuParams.buttonList = [];
      this.$nextTick(() => {
        this.menuParams.buttonList = list;
      });
    },
    rowDel(form, index) {
      this.menuParams.buttonList.splice(index, 1);
    },
    async handleUpdate(form, index, done, loading) {
      if (form.F_LgMarkCode) {
        let res = await getLgMarkList({
          keyword: form.F_LgMarkCode,
        });
        form.F_LgMarkName = res?.data?.data[0]?.F_Name;
      }
      this.menuParams.buttonList.splice(index, 1, form);
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>