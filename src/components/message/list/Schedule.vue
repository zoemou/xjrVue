<template>
  <div>
    <div class="list-box" v-if="hasList">
      <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        :class="item.isRead ? '' : 'readed-mark'"
       
      >
       <!-- @click="showDetail(item)" -->
        <span class="list-item-title">{{ item.F_Content }}</span>
        <span class="list-item-time">{{ item.craeteTime }}</span>
      </div>
      <div class="notice-footer">
        <span @click="setAllReaded">{{$t('messageIndex.allReadBtn')}}</span>
        <span @click="goTo">{{$t('messageIndex.viewMoreBtn')}}</span>
      </div>
    </div>
    <Empty v-else></Empty>
  </div>
</template>

<script>
import Empty from "./Empty.vue";
export default {
  components: {
    Empty
  },
  props: {
    list: {
      type: Array,
      default: () => {}
    }
  },
  computed: {
    hasList() {
      return this.list.length > 0;
    }
  },
  methods: {
    setAllReaded() {
      this.$emit("setAllReaded");
    },
    goTo() {
      this.$emit("goTo");
    },
    showDetail(item) {
      if (item.isRead) {
        this.$message(this.$t('messageIndex.hintMessageRead'));
        return;
      }
      this.$emit("showDetail", item);
    }
  }
};
</script>
