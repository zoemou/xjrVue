<template>
  <div>
    <el-button class="transfer-button" @click="changeUser">{{$t('workFlow.processTasks.transposeBtn')}}</el-button>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.processTasks.selectApprover')"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="60%"
    >
      <SelectUser
        v-if="dialogVisible"
        ref="addPesonelRef"
        :isSingle="true"
        :disabledUserIds="disabledUserIds"
        :selectedList="selectedMemberList"
      ></SelectUser>
      <span slot="footer">
        <el-button
          size="mini"
          type="primary"
          @click="confirmDialog()"
          class="member-submit"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/organization/SelectUser";
import { changeCandidateUser } from "@/api/workFlow/WFLaunch";
export default {
  components: {
    SelectUser
  },
  props: {
    taskId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      oldUserId: "",
      disabledUserIds: [],
      selectedMemberList: []
    };
  },
  created() {
    //不能选择自己
    let userInfo = localStorage.getItem("avue-userInfo")
      ? JSON.parse(localStorage.getItem("avue-userInfo")).content
      : {};
    this.oldUserId = userInfo.F_UserId;
    this.disabledUserIds.push(userInfo.F_UserId);
  },
  methods: {
    changeUser() {
      this.dialogVisible = true;
    },
    getSelectedList() {
      let data = this.$refs.addPesonelRef.pushParentData();
      if (data.length > 0) {
        data.forEach(ele => {
          let temp = {
            F_ObjType: "3",
            F_ObjId: ele.F_UserId,
            F_ObjName: ele.F_RealName
          };
          this.selectedMemberList.push(temp);
        });
      }
    },
    async confirmDialog() {
      this.getSelectedList();
      if (this.selectedMemberList.length == 0) {
        this.$message(this.$t('workFlow.processTasks.hintUnselected'));
      } else {
        let params = {
          taskId: this.taskId,
          oldUserId: this.oldUserId,
          newUserId: this.selectedMemberList[0].F_ObjId
        };
        try {
          let res = await changeCandidateUser(params);
          if (res && res.data && res.data.success) {
              this.$message(this.$t('workFlow.processTasks.hintTransferSuccess'));
              this.$emit('transferSuccess');
            this.dialogVisible = false;
          } else {
            this.$message(this.$t('workFlow.processTasks.hintTransferFailed'));
          }
        } catch (error) {
          this.$message(this.$t('workFlow.processTasks.hintTransferFailed'));
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.member-submit {
  width: 80px;
}
.transfer-button {
  width: 100%;
}
</style>
