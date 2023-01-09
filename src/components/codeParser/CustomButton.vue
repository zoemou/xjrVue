<template>
  <div>
    <el-button  type="primary" :style="btnStyle" @click="handleClick">
      <i v-if="prefixIcon" :class="prefixIcon"></i>
      {{ content }}
      <i v-if="suffixIcon" :class="suffixIcon"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "按钮",
    },
    prefixIcon: {
      type: String,
      default: "",
    },
    suffixIcon: {
      type: String,
      default: "",
    },
    btnWidth: {
      type: Number,
      default: 0,
    },
    btnHeight: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    btnStyle() {
      let str = '';
      if(this.btnWidth){
        str += 'width:'+this.btnWidth +'px ;';
      }
      if(this.btnHeight){
        str += 'height:'+this.btnHeight +'px ;';
      }
      return str
    }
  },
};
</script>

<style lang="scss" scoped></style>
