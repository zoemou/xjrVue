<template>
  <el-form-item>
    <el-button type="warning" @click="dialog.visible = true"
      >{{$t('workFlow.WFDelegate.addOrSubtract')}}</el-button
    >
    <elDialog
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
      :title="$t('workFlow.WFDelegate.addOrSubtract')"
      width="80%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <SubTract
        v-if="dialog.visible"
        ref="SubTract"
        :processInstanceId="processInstanceId"
        :taskId="taskId"
      ></SubTract>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </elDialog>
  </el-form-item>
</template>

<script>
import SubTract from "./SubTract";
export default {
  props: {
    // 流程实例ID
    processInstanceId: {
      type: String,
      default: null,
    },
    //任务id
    taskId: {
      type: String,
      default: null,
    },
  },
  components: {
    SubTract,
  },
  data() {
    return {
      dialog: {
        visible: false,
      },
    };
  },
  methods: {
    submitDialog() {
      let self = this;
      this.$refs.SubTract.updataSignature(function (res) {
        if (res.success) {
          self.dialog.visible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button--warning{
  width: 100%;
  margin-top: 20px;
}
</style>
