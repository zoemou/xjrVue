<template>
  <div class="item-list cl">
    <div
      class="item-box evening-item-box"
      v-for="(item, index) in listParams.Listdata"
      :key="index"
      @click="change(item)"
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
</template>

<script>
import Card from "./Card.vue";
export default {
  props: {
    listParams: {
      type: Object,
      default: () => {
        return {
          checkedIds: [],
          checkedList: [],
          Listdata: [],
        };
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
      this.$emit("changLaunch", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-box {
  float: left;
  width: 33.3%;
  // height: 66px;
  padding: 0 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
</style>
