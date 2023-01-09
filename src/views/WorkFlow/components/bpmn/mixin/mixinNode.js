import {
  hasProperties,
  getProperties,
  setProperties,
  initProperties
} from "./../common/util/properties";
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
      formInfo: {}
    };
  },
  watch: {
    formInfo: {
      handler(newValue) {
        if (this.element.id) {
          setProperties(this.element.id, newValue);
        }
      },
      deep: true
    },
    "formInfo.id": function(val) {
      this.updateProperties({ id: val });
    },
    "formInfo.name": function(val) {
      if(val.includes('\n')){
        val = val.replace(/\n/g,"")
      }
	  if(val.replace(/[^x00-xff]/g,'ab').length>100){
		  val=val.substring(0,100)
		  this.$notify({
		    title:this.$t('deletePrompt.promptTitle'),
		    message:this.$t('节点名称最多输入100个字符'),
		    type: "warning",
			duration:1000
		  });
	  }
	  this.formInfo.name=val
      this.updateProperties({ name: val });
    }
  },
  mounted() {
    let isFromMainProcess =
      this.element.businessObject.$parent.$type == "bpmn:Process";
    let processId = "";
    if(this.element.businessObject&&this.element.businessObject.$parent&&this.element.businessObject.$parent.id){
      processId = this.element.businessObject.$parent.id
    }
    if (hasProperties(this.element.id)) {
      this.formInfo = getProperties(this.element.id);
    } else {
      this.formInfo = initProperties(this.element.id, this.element.type);
    }
    this.formInfo.processId = processId;
    this.formInfo.isFromMainProcess = isFromMainProcess;
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(this.element, properties);
    }
  }
};
