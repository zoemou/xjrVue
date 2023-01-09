import {
  getProcessProperties,
  setProcessProperties
} from "../common/util/properties";
export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    modeler: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formInfo: {},
      isSpecialInitiationProcessDisabled:false
    };
  },
  watch: {
    formInfo: {
      handler(newValue) {
        setProcessProperties(newValue);
      },
      deep: true
    },
    "formInfo.id": function(val) {
      this.updateProperties({ id: val });
    },
    "formInfo.F_Name": function(val) {
      this.formInfo.name = val;
      this.updateProperties({ name: val });
    }
  },
  mounted() {
    this.formInfo = getProcessProperties();
    let isSpecialInitiationProcess =  this.$store.state.bpmn.isSpecialInitiationProcess;
    //当特殊表单流程处理时(表单发布流程)
    if(isSpecialInitiationProcess){
      //固定流程分类：分类名：表单发起临时模板
      this.formInfo.F_Category = 'bb5466c46b5c1181c56c78b512a5a0d7';
      this.isSpecialInitiationProcessDisabled = true;//不可编辑
    };
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(this.element, properties);
    }
  }
};
