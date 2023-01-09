<template>
  <el-dialog v-dialogDrag
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    :show-close="false"
    width="60%"
  >
    <div>
      <el-tabs class="content-list" type="card">
        <el-tab-pane
          :label="item.name?item.name:'节点'+index"
          v-for="(item, index) in parallelList"
          :key="index"
        >
          <SelectFromApprovedList
            v-if="item.userList.length > 0"
            :list="item.userList"
            ref="node"
          ></SelectFromApprovedList>
          <SelectFromOrganizationList
            v-else
            ref="node"
          ></SelectFromOrganizationList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer">
      <el-button
        size="mini"
        type="primary"
        @click="confirmDialog"
        class="member-submit"
        >{{$t('buttonModule.modalSureBtn')}}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import SelectFromApprovedList from "./SelectFromApprovedList.vue";
import SelectFromOrganizationList from "./SelectFromOrganizationList.vue";
export default {
  components: {
    SelectFromApprovedList,
    SelectFromOrganizationList
  },
  props: {
    title: {
      type: String,
      default: "选择下一节点审批人"
    },
    candidateInfo: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      singleList: [],
      parallelList: [],
      dialogVisible: false
    };
  },
  created() {
    if (this.candidateInfo.length > 0) {
      this.parallelList = this.candidateInfo;
    }
    this.dialogVisible = true;
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit('close');
    },
    confirmDialog() {
      let returnData = [];
        let len = this.parallelList.length;
        for (let i = 0; i < len; i++) {
          let selectedList = this.$refs["node"][i].selectedList;
          if (selectedList.length == 0) {
            this.$message(
              "节点：" + this.parallelList[i].name + "请至少选择一个审批人"
            );
            return false;
          } else {
            let userList = selectedList.map(ele => {
              return ele.F_UserId;
            });
            returnData.push({
              name: this.parallelList[i].name,
              taskId: this.parallelList[i].taskId,
              userList: userList
            });
          }
        }
        if (returnData.length == len) {
          //提交
          this.$emit("submit", returnData);
          this.dialogVisible = false;
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.content-list {
  padding: 10px 5px;
  height: 600px;
  overflow: hidden;
}
</style>
