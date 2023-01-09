<template>
  <div class="loading-container" v-show="show">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
  </div>
  </div>
</template>

<script>
export default {
  name:'loading',
  props: ['show']
}
</script>

<style lang="scss" scoped>
.loading-container{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.4);
  .loading{
      width: 100%;
      height: 100%;
      z-index: 9999999;
      display: flex;
      justify-content: center;
      align-items: center;
        span{
        display: inline-block;
        width: 6px;
        border-radius: 4px;
        background: #02A7F0;
        margin-right: 5px;
        -webkit-animation: loadsaven 1.04s ease infinite;
       }
  }
}


@-webkit-keyframes loadsaven{
    0%,100%{
        height: 20px;
        background: #02A7F0;
    }
    50%{
        height: 40px;
        margin-top: -20px;
        background: lightblue;
    }
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.13s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.26s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.39s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.52s;
}
</style>
