<template>
  <div class="item-list cl">
    <div v-for="(item, index) in listParams.checkedList" :key="index">
      <div
        class="item-box evening-item-box"
        @click="change(item)"
        v-if="listParams.checkedIds.includes(item.F_Id)"
      >
        <Card
          theme="common"
          :isChecked="listParams.checkedIds.includes(item.F_Id) ? true : false"
          :F_Code="item.F_Code"
          :F_Name="item.F_Name"
          :F_Category="item.F_Category"
        ></Card>

        <Card
          theme="evening"
          :isChecked="listParams.checkedIds.includes(item.F_Id) ? true : false"
          :F_Code="item.F_Code"
          :F_Name="item.F_Name"
          :F_Category="item.F_Category"
        ></Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "@/components/workflow/Card.vue";
export default {
  props: {
    listParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Card,
  },
  methods: {
    change(item) {
      if (this.listParams.checkedIds.includes(item.F_Id)) {
        this.listParams.checkedIds = this.listParams.checkedIds.filter(
          (ele) => {
            return ele != item.F_Id;
          }
        );
        this.listParams.checkedList = this.listParams.checkedList.filter(
          (ele) => {
            return ele.F_Id != item.F_Id;
          }
        );
      } else {
        this.listParams.checkedIds.push(item.F_Id);
        this.listParams.checkedList.push(item);
      }
      this.$emit("changLaunch");
    },
  },
};
</script>

<style lang="scss" scoped>
.item-list {
  display: flex;
  flex-wrap: wrap;
}
.item-box {
  width: 240px;
  // height: 66px;
  padding: 0 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.item {
  width: 100%;
  // height: 66px;
  color: #303133;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  transition: 0.3s;
  box-sizing: border-box;
  position: relative;
}
</style>
