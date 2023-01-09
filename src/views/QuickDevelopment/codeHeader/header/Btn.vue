<template>
  <div class="opr">
    <el-button size="mini" @click="prev()" v-if="showPrevBtn" :loading="loading">{{
      $t("code.codeForm.previousBtn")
    }}</el-button>
    <el-button size="mini" @click="next()" v-if="showNextBtn" :loading="loading">{{
      $t("code.codeForm.nextStepBtn")
    }}</el-button>
    <el-button
      size="mini"
      type="primary"
      v-if="showSubmitBtn"
      @click="codeFormSubmit()"
      :loading="loading"
      >
      {{loading?$t('workFlow.WFMenu.hintSubmit'):$t('code.codeForm.completeBtn')}}
      </el-button
    >
    <el-button size="mini" type="danger" @click="close()">{{ $t("buttonModule.modalCloseBtn") }}</el-button>
  </div>
</template>

<script>
export default {
   props: {
     type: {
      type: Number,
      default: 0// 0 代码生成器 1自定义表单
    },
    active: {
      type: Number,
      default: 0
    },
    stepListLength: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      loading:false,
      loadingTimeout:null
    }
  },
  watch: {
    active(){
      this.loading = false;
      this.loadingTimeout = null;
    }
  },
  computed: {
    showPrevBtn() {
      return this.active != 0;
    },
    showNextBtn() {
      return this.active != this.stepListLength-1;
    },
    showSaveFormBtn() {
      return (
       this.type==0&&( this.active == this.stepListLength-2 ||
        this.active == this.stepListLength-1)
      );
    },
    showSubmitBtn() {
      return this.active == this.stepListLength-1;
    }
  },
  beforeDestroy () {
    this.loadingTimeout = null;
  },
  methods: {
    closeLoading(){
      this.loading = true;
      this.loadingTimeout = setTimeout(()=>{
        if(this.loading){
          this.loading = false;
        }else{
          this.loadingTimeout = null;
        }
      },1000);
    },
    prev() {
      this.closeLoading();
      this.$listeners.prev();
    },
    next() {
     this.closeLoading();
      this.$listeners.next();
    },
    codeFormSubmit() {
      this.closeLoading();
      this.$listeners.codeFormSubmit();
    },
    close(){
      this.closeLoading();
	  
	  //删除兼容样式类开始
	  let bodyClass = document.body.className.split(' ');
	  bodyClass.filter((item,idx)=>{
	    return item == 'original' && (bodyClass.splice(idx,1));
	  });
	  document.body.className = bodyClass.join(' ');
	  //删除兼容样式类结束
	  
      this.$listeners.close();
    }
  }
};
</script>

<style lang="scss" scoped></style>
