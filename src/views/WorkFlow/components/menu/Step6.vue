<template>
  <div>
    <el-form ref="authorityForm" :model="authorityForm">
      <el-form-item>
        <el-radio-group v-model="authorityForm.userType">
          <el-radio :label="1">{{$t('workFlow.Step3.allMember')}}</el-radio>
          <el-radio :label="2">{{$t('workFlow.Step3.assignMember')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="authorityForm.userType == 2">
        <SelectAuthority :formInfo="authorityForm"></SelectAuthority>
      </el-form-item>
    </el-form>
    <span class="footer">
      <el-button size="mini" type="primary" @click="prev()">{{$t('workFlow.Step1.stepBackBtn')}}</el-button>
      <el-button 
      size="mini" 
      type="primary" 
      @click="submit()"
      :loading="flagMenu"
      >
      {{flagMenu?$t('workFlow.WFMenu.hintSubmit'):$t('workFlow.Step3.completeBtn')}}
      </el-button>
    </span>
  </div>
</template>

<script>
import SelectAuthority from "./SelectAuthority.vue";

export default {
  components: {
    SelectAuthority,
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
      flagMenu: false,
      authorityForm: { userType: 1, authorityData: [] },
    };
  },
  created() {
    this.authorityForm = this.stepData.step6;
  },
  methods: {
    prev() {
      this.stepData.activeStep--;
    },
    submit() {
      this.flagMenu = true;
      this.stepData.step6 = this.authorityForm;
      this.$emit("finish");
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  padding: 10px 20px 20px;
  text-align: right;
  display: block;
  position: absolute;
  right: 10px;
  bottom: 0;
}
</style>
