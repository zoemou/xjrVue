<template>
  <div>
    <div v-if="hasList">
      <div>
        <div class="list-item flow-list-header">
          <span class="header-title">{{$t('messageIndex.titleApproval')}}</span>
          <span class="opr" @click="goTo('ToDoTasks')">{{$t('messageIndex.viewMoreBtn')}}</span>
        </div>
        <template v-if="workflow.approval.length > 0">
          <div
          class="list-item"
          v-for="(item, index) in workflow.approval"
          :key="index"
           :class="item.F_Status!='11' ? '' : 'readed-mark'"
          @click="approval(item)"
        >
          <span class="list-item-title">{{ item.F_Content }}</span>
          <span class="list-item-time">{{ item.F_SendTime }}</span>
        </div>
        </template>
         <Empty v-else></Empty>
      </div>
      <div>
        <div class="list-item flow-list-header">
          <span class="header-title">{{$t('messageIndex.titleCirculate')}}</span>
          <span class="opr" @click="goTo('MyForwarder')">{{$t('messageIndex.viewMoreBtn')}}</span>
        </div>
        <template v-if="workflow.circulated.length > 0">
          <div
          class="list-item"
          v-for="(item, index) in workflow.circulated"
          :key="index"
           :class="item.F_Status!='11' ? '' : 'readed-mark'"
          @click="eyeHistory(item)"
        >
          <span class="list-item-title">{{ item.F_Content }}</span>
          <span class="list-item-time">{{ item.F_SendTime }}</span>
        </div>
        </template>
         <Empty v-else></Empty>
      </div>
      <div class="notice-footer">
        <span @click="setAllReaded">{{$t('messageIndex.allReadBtn')}}</span>
      </div>
    </div>
   
  </div>
</template>

<script>
import Empty from "./Empty.vue";
export default {
  components: {
    Empty
  },
  props: {
    workflow: {
      type: Object,
      default: () => {
        return {
          approval: [],
          circulated: []
        };
      }
    }
  },
  computed: {
    hasList() {
      return (
        this.workflow.approval.length > 0 || this.workflow.circulated.length > 0
      );
    }
  },
  methods: {
    setAllReaded() {
      this.$emit("setAllReaded");
    },
    goTo(moduleKey) {
      this.$store.commit("CHANGE_CURRENT_MODULE", moduleKey);
      setTimeout(() => {
         this.$emit("goTo");
      }, 10);
    },
    // 查看
    eyeHistory(item) {
      this.$emit("eyeHistory", item);
    },
    // 审批
    approval(item) {
      this.$emit("approval", item);
    }
  }
};
</script>
<style scoped>
.flow-list-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f2f2f2;
}
.flow-list-header .header-title {
  font-weight: 700;
  font-size: 14px;
}
.flow-list-header .opr {
  color: #02a7f0;
  cursor: pointer;
  font-size: 12px;
}
</style>
