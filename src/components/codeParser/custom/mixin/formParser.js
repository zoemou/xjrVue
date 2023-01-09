import {
  setFormValueInfoProperties,
  triggerEventHandler,
} from "@/util/dataApi";
export default {
  methods: {
    //保存值，以便api接口中中调用
    setValue() {
      let formId = this.confFields[this.fieldsIndex].__config__.formId;
      let val = this.confFields[this.fieldsIndex].__config__.defaultValue;
      setFormValueInfoProperties(formId, val);
    },
    handleTriggerEvent(key){
      if (
        this.confFields[this.fieldsIndex].__config__.triggerEvents &&
        this.confFields[this.fieldsIndex].__config__.triggerEvents.length > 0 &&
        this.confFields[this.fieldsIndex].__config__.triggerEventData &&
        this.confFields[this.fieldsIndex].__config__.triggerEventData[key] &&
        this.confFields[this.fieldsIndex].__config__.triggerEventData[key]
          .length > 0
      ) {
        let ids = [];
        ids = this.confFields[this.fieldsIndex].__config__.triggerEventData[
          key
        ].map((ele) => {
          return ele.componentFormId;
        });
        triggerEventHandler(ids);
      }
    },
    // 组件触发事件-失焦
    handleBlur() {
      this.handleTriggerEvent('blur');
    },
    // 组件触发事件-值改变
    handleChange() {
      this.handleTriggerEvent('change');
    }
  },
};
