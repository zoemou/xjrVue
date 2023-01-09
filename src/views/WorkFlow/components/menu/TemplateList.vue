<template>
  <div class="item-list cl">
    <div v-for="(item, index) in list" :key="index">
      <div class="item-box evening-item-box">
        <Card
          theme="common"
          :isChecked="true"
          :F_Code="item.F_Code"
          :F_Name="item.F_Name"
          :F_Category="item.F_Category"
        ></Card>

        <Card
          theme="evening"
          :isChecked="true"
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
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Card,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    let { F_SettingJson } = this.formData;
    F_SettingJson = F_SettingJson ? JSON.parse(F_SettingJson) : {};
    let { step2 = [] } = F_SettingJson;
    this.list = step2;
  },
};
</script>

<style lang="scss" scoped>
.item-list {
  display: flex;
  flex-wrap: wrap;
  min-height: 400px;
}
.item-box {
  width: 240px;
  height: 66px;
  padding: 0 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
</style>
