<template>
  <MainFixed :title="$t('selectUser.selectedList')" class="selected-box">
    <i slot="icon" class="el-icon-close closed-box" @click="closed"></i>
    <div slot="list">
      <div  v-for="(item, index) in list" :key="index">

        <div  v-if="item.disabled" class="item-box disabled-box" >
          <p v-for="(keyItem, i) in itemKeys" :key="i">
            {{ keyItem.label }}:<span>{{ item[keyItem.key] }}</span>
          </p>
        </div>
        <div class="item-box" v-else>
          <p v-for="(keyItem, i) in itemKeys" :key="i">
            {{ keyItem.label }}:<span>{{ item[keyItem.key] }}</span>
          </p>
          <i class="el-icon-close" @click="deleteItem(item, index)"></i>
        </div>
      </div>
    </div>
  </MainFixed>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
export default {
  components: {
    MainFixed,
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    itemKeys: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    closed() {
      this.$emit("closed");
    },
    deleteItem(item, index) {
      this.$emit("deleteItem", { item, index });
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-box {
  height: 500px;
  position: absolute;
  right: 0;
  top: -1px;
}
.item-box {
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  padding: 10px;
  margin: 0 10px 10px;
  position: relative;
  p {
    margin: 0;
    font-size: 12px;
  }
  i {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
@media screen and (max-width: 1370px) {
	.selected-box {
	   height: 390px;
	 }   
	} 
</style>
