<template>
  <div>
    <el-input
      :placeholder="$t('selectFunctionIcon')"
      size="small"
      v-model="menuForm.F_Icon"
      suffix-icon="el-icon-more"
      @focus="openDialog"
    ></el-input>

    <!-- 功能图标弹出框 -->
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
      class="dialog-box"
    >
      <SelectIcon v-if="dialogVisible" @childByValue="chageIcon"></SelectIcon>
    </el-dialog>
  </div>
</template>

<script>
import SelectIcon from "@/views/FontAwesome";
export default {
  components: {
    SelectIcon,
  },
  props: {
    menuForm: {
      type: Object,
      default: {
        F_Icon: "",
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
    };
  },
  methods: {
    openDialog() {
      this.dialogTitle = this.$t("workFlow.Process.functionIcon");
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    chageIcon(val) {
      this.menuForm.F_Icon = val;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
