<template>
    <div :class="['right-icon', isShrink && position === 'left' ? 'fixed-container' : '']" :style="{'margin-left' : isShrink && position === 'right' ? '-50px' : '0'}">
      <i :class="iconClass" @click="changeShrink"></i>
    </div>
</template>
<script>
export default {
  props: {
    position: String,
  },
  data() {
    return {
      isShrink: false,
      iconClass:'fa fa-angle-double-right'
    }
  },
  watch: {
    position: {
      handler: function (val, oldVal) {        
        val === 'left' ? this.iconClass = 'fa fa-angle-double-left' : 'fa fa-angle-double-right'
      },
      immediate:true
    },
  },
  methods: {
    changeShrink() {
      this.isShrink = !this.isShrink
      let iconPosition = ''
      if (this.position === 'left') {
        iconPosition = this.isShrink ? 'right' : 'left'
      } else {
        iconPosition = this.isShrink ? 'left' : 'right'
      }
      this.iconClass = `fa fa-angle-double-${iconPosition}`
      this.$emit('change',this.isShrink)
    }
  }
}
</script>
<style lang="scss" scoped>
.fa{
  font-size: 18px;
  color:#409EFF;
  cursor:pointer;
}
.fixed-container{
  position: fixed;
  left: 65px;
}
.right-icon{
  display: flex;
  align-items: center;
  height: calc(100vh - 100px);
  z-index: 999;
}

</style>