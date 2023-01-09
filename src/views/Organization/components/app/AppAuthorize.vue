<template>
  <!-- APP功能授权 -->
  <el-dialog
    v-dialogDrag
    :title="$t('orgRoleManagement.appSetAuthorizeModal.modalTitle')"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible="true"
    top="9vh"
    width="80%"
    :before-close="closeAppAuthorizeDialog"
  >
    <app-authorize-select
      ref="AppAuthorizeTreeRef"
      :objectType="objectType"
      :objectId="objectId"
    ></app-authorize-select>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeAppAuthorizeDialog">{{
        $t("buttonModule.modalCancelBtn")
      }}</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="confirmAppAuthorizeDialog"
        :loading="flagAppAuthorDialog"
        >{{
          flagAppAuthorDialog
            ? $t("workFlow.WFMenu.hintSubmit")
            : $t("buttonModule.modalSureBtn")
        }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import AppAuthorizeSelect from "./AppAuthorizeSelect";
import { postAppAuthorizes } from "@/api/system/app";
export default {
  components: {
    AppAuthorizeSelect,
  },
  props: {
    objectType: {
      type: Number,
    },
    objectId: {
      type: String,
    },
  },
  data() {
    return {
      flagAppAuthorDialog: false,
    };
  },
  methods: {
    closeAppAuthorizeDialog() {
      this.flagAppAuthorDialog = false;
      this.$emit('close',false);
    },
    confirmAppAuthorizeDialog() {
      this.flagAppAuthorDialog = true;
      let obj = this.$refs.AppAuthorizeTreeRef.allCheckChange();
      postAppAuthorizes(this.objectId, this.objectType, obj).then((res) => {
        this.showNotify(res, this.$t("orgRoleManagement.appSetAuthorizeBtn"));
        this.closeAppAuthorizeDialog();
      });
    },
    showNotify(res, msg) {
      if (res.data.success) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("workFlow.WFMenu.hintSuccess"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: msg + this.$t("deletePrompt.hintFailure"),
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>