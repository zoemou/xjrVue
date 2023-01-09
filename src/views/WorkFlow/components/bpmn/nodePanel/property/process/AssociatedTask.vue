<template>
  <div>
    <el-form-item class="mb-20">
      <el-button size="mini" @click="openDialog()">{{
        $t("workFlow.Process.appProcessBtn")
      }}</el-button>
    </el-form-item>
    <el-form-item>
      <div class="flex-box bt fw">
        <span class="flex-item opr basic-5"></span>
        <span class="flex-item basic-30">{{
          $t("workFlow.Process.processTemplateName")
        }}</span>
        <span class="flex-item basic-15">{{
          $t("workFlow.Process.selectTaskState")
        }}</span>
        <span class="flex-item basic-40">{{
          $t("workFlow.Process.selectTaskAuthority")
        }}</span>
      </div>
      <avue-empty
        :desc="$t('deletePrompt.noData')"
        v-if="formInfo.relevanceTask.tableData.length == 0"
      ></avue-empty>
      <div
        class="flex-box bt fw"
        v-for="(item, index) in formInfo.relevanceTask.tableData"
        :key="index"
      >
        <span
          class="flex-item opr basic-5"
          @click="delAssociatedTasks(index)"
          >{{ $t("tableOperationModule.deleteBtn") }}</span
        >
        <span class="flex-item basic-30">
          {{ item.F_ObjName }}
        </span>
        <span class="flex-item basic-15">
          <el-select v-model="item.tStatu">
            <el-option
              :label="$t('workFlow.Process.labelApproval')"
              value="ongoing"
            ></el-option>
            <el-option
              :label="$t('workFlow.Process.labelApproved')"
              value="approveAdopt"
            ></el-option>
          </el-select>
        </span>
        <span class="flex-item basic-40">
          <el-select v-model="item.tAuthority">
            <el-option
              :label="$t('workFlow.Process.labelLimitedTemplate')"
              value="createUser"
            ></el-option>
            <el-option
              :label="$t('workFlow.Process.labelAllTemplate')"
              value="all"
            ></el-option>
          </el-select>
        </span>
      </div>
    </el-form-item>
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
      <LaunchList
        ref="SelectFlow"
        v-if="dialogVisible"
        style="height: 100%;"
        :selectList="selectAssociatedTasksList"
        :showLeftTree="true"
        :showSearch="true"
      >
      </LaunchList>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button type="primary" @click="submitDialog" size="mini">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import LaunchList from "@/components/workflow/LaunchList";
export default {
  components: {
    LaunchList,
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dialogTitle: "标题",
      dialogVisible: false,
      selectAssociatedTasksList: []
    };
  },
  methods: {
    delAssociatedTasks(index) {
      if (
        this.formInfo.relevanceTask.tableData &&
        this.formInfo.relevanceTask.tableData.length > 0
      ) {
        this.formInfo.relevanceTask.tableData.splice(index, 1);
      }
    },
    openDialog() {
      if (this.formInfo.relevanceTask.tableData.length > 0) {
        let checkedList = [];
        this.formInfo.relevanceTask.tableData.forEach(ele => {
          checkedList.push({
            ...ele,
            F_Id: ele.F_ObjId,
            F_Name: ele.F_ObjName
          });
        });
        this.selectAssociatedTasksList = checkedList;
      }
      this.dialogTitle = this.$t("workFlow.Process.appProcessBtn");
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    submitDialog() {
      let selectList = this.$refs.SelectFlow.getCheckedList();
      this.formInfo.relevanceTask.tableData = [];
      selectList.forEach(element => {
        this.formInfo.relevanceTask.tableData.push({
          F_Id: uuidv4(),
          F_ObjId: element.F_Id,
          F_ObjName: element.F_Name,
          F_DeploymentId: element.F_DeploymentId,
          F_ObjType: "SelectWF",
          tStatu: "ongoing",
          tAuthority: "createUser"
        });
      });
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("workFlow.Process.addSuccess"),
        type: "success"
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  .flex-item {
    line-height: 40px;
    height: 40px;
    margin-left: 1%;
    margin-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .basic-5 {
    flex-basis: 5%;
  }
  .basic-15 {
    flex-basis: 15%;
  }
  .basic-30 {
    flex-basis: 30%;
  }
  .basic-40 {
    flex-basis: 40%;
  }
  .opr {
    color: #02a7f0;
    cursor: pointer;
  }
}
.bt {
  border-bottom: 1px solid #e4e4e4;
}
.dialog-box {
  min-height: 400px;
}
</style>
