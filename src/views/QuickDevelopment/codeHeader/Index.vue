<template>
  <div class="header">
    <Title :title="title" class="title"></Title>
    <Step class="step" :active="active" :stepList="stepList"></Step>
    <Btn v-on="$listeners" :type="type" :active="active" :stepListLength="stepList.length" class="btn"></Btn>
  </div>
</template>

<script>
import Title from "./header/Title.vue";
import Step from "./header/Step.vue";
import Btn from "./header/Btn.vue";
import { controllerList } from "./common/condition";
import i18n from "@/lang";
const defaultTitle = [i18n.t("code.codeIndex.title"), i18n.t("formDesign.titleFormDesign"),i18n.t("custmerForm.titleFormCodeConfig")];
export default {
  components: {
    Title,
    Step,
    Btn
  },
  props: {
    type: {
      type: Number,
      default: 0 // 0 代码生成器 1 自定义表单 2自定义接口管理
    },
    active: {
      type: Number,
      default: 0  //当前活动的step值
    },
    controllerType: {
      type: Number,
      default: 0 
    }
  },
  data() {
    return {
      stepList: [],
      title: ""
    };
  },
  created() {
	let detail = controllerList[this.type][this.controllerType];
    this.stepList = detail.stepList;
	
	if(this.type===2){
		this.title = detail.title;
		return;
	}
    //表单生成代码
    if(this.controllerType==3){
      this.title = defaultTitle[2];
    }else{
      this.title = defaultTitle[this.type] + "(" + detail.title + ")";
    }
    
  }
};
</script>

<style lang="scss" scoped>
.title{
   flex-basis: 20%;
   display: flex;
  justify-content: flex-start;
}
.step {
  flex-basis: 60%;
  padding: 0;
  background-color: #fff;
}
.btn{
  flex-basis: 20%;
  display: flex;
  justify-content: flex-end;
}
.header {
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
