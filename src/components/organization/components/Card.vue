<template>
  <div class="item" :class="selected ? 'selected' : ''">
    <div class="img-box">
      <img :src="imgIcon" />
    </div>
    <div class="info-box">
      <p v-for="(item, index) in infoList" :key="index" class="info-flex">
        <span>{{ item.label }}：</span><span class="text-oven-hidden">{{ item.value }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: String,
      default: () => {
        return "default";
      },
    },
    infoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    imgIcon() {
      let imgIconUrl = require("@/assets/card/default.png");
      switch (this.type) {
        case "maleUser":
          imgIconUrl = require("@/assets/card/male.png");
          break;
        case "femaleUser":
          imgIconUrl = require("@/assets/card/female.png");
          break;
        default:
          break;
      }
      return imgIconUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  .img-box {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info-flex{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    line-height: 20px;
  }
  .info-box {
    width: 200px;
    line-height: 1;
    margin-left: 10px;
  }
  .text-oven-hidden{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 140px;
    display: inline-block;
  }
}
.selected {
  background-color:rgba(64,158,255,0.06);
  border:1px solid rgba(64,158,255,0.4)!important;
}
.selected .info-box p{
	color: #409eff;
}
</style>
