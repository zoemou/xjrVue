<template>
  <div>
    <SearchConfig
      ref="SearchConfig"
      :fieldOptions="stepData.searchFields"
      :selectedList="stepData.step5"
			:bindTableFiled="stepData.bindTableFiled"
			:bindField="stepData.bindField"
    ></SearchConfig>

    <span class="footer">
      <el-button size="mini" type="primary" @click="prev()">{{$t('workFlow.Step1.stepBackBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="next()">{{$t('workFlow.Step1.nextStepBtn')}}</el-button>
    </span>
  </div>
</template>

<script>
import SearchConfig from "./SearchConfig.vue";
export default {
  components: {
    SearchConfig
  },
  props: {
    stepData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    prev() {
      this.stepData.activeStep--;
    },
    next() {
      let querySelection = this.$refs.SearchConfig.querySelection;
      let bindTableFiled = this.stepData.bindTableFiled;
      let data = [];
      if (querySelection?.length > 0) {
				
        querySelection.forEach(element => {
						let obj ={
							fieldName:element.name, bindTable:element.bindTable, fieldsId:element.field||element.name,resourceId:element.resourceId,componentConfig:element.componentConfig
						}
						if(element.searchtype=="data"){
							obj = bindTableFiled.get(element.name);
						}
          if (obj&&element.isChecked) {
            let temp = {
              isChecked: element.isChecked,
              name: element.name,
              fieldName:obj.fieldName,
              searchtype: element.searchtype,
              width: element.width,
              height: element.height,
              field: element.field,
              bindTable:obj.bindTable,
              resourceId:obj.resourceId,
							componentConfig:obj.componentConfig
            };
            data.push(temp);
          }
        });
      }
      if (data.length > 0) {
        this.stepData.step5 = data;
        this.stepData.activeStep++;
      } else {
        this.$message(this.$t('workFlow.Step4.hintMustSelect'));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  margin-bottom: 60px;
}
.footer {
  padding: 10px 30px 20px;
  text-align: right;
  display: block;
  position: absolute;
  right: 10px;
  bottom: 0;
}
</style>
