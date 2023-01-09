<template>
  <div>
      <SelectLaunch
          ref="SelectFlow"
          style="height: 100%;"
          :selectList="selectList"
          :showLeftTree="true"
          :showSearch="true"
          @changeTemplateList="changeTemplateList"
        >
        </SelectLaunch>
    <span class="footer">
      <el-button size="mini" type="primary" @click="prev()">{{$t('workFlow.Step1.stepBackBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="next()">{{$t('workFlow.Step1.nextStepBtn')}}</el-button>
    </span>
  </div>
</template>

<script>
import SelectLaunch from "./SelectLaunch";
export default {
  components: {
    SelectLaunch,
  },
  props: {
    stepData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      selectList: [],
    };
  },
  created () {
    this.selectList = this.stepData.step2;
  },
  methods: {
    changeTemplateList(checkedList){
      this.selectList = checkedList;
      let length = checkedList.length;
      if(length==1){
      this.stepData.templateType = 1;//单模板
    }else{
      this.stepData.templateType = 2;//非单模板
    }
    },
    prev() {
      this.stepData.activeStep--;
    },
    next() {
      if(this.selectList.length>0){
        this.stepData.step2 = this.selectList;
        this.stepData.activeStep ++;
      }else{
        this.$message(this.$t('workFlow.Step1.hintSTemplate'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.footer {
  text-align: right;
  display: block;
  position: absolute;
  right: 25px;
  bottom:8px;
}
</style>
