<script>
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
    fieldsIndex: {
      type: Number,
      required: true,
    },
    formConf: {
      type: Object,
      required: true,
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
    },
    // 1 新增 2 查看 3 编辑
    isEdit: {
      type: Number
    }
  },
  data(){
    return {
      confFields: [],
      value:null
    }
  },
  watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
    }
  },
  created(){
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].readonly = true;
      this.confFields[this.fieldsIndex].disabled = true;
    }
    this.setValue();
  },
  render(h) {
    const dataObject = {
      attrs: {},
      props: {},
      nativeOn: {},
      on: {},
      style: {},
    };
    //是否为查看
    if(this.isEdit==2){
      dataObject.props.disabled = true;
    }
    let scheme = this.confFields[this.fieldsIndex];
    Object.keys(scheme).forEach((key) => {
      const val = scheme[key];
      if (key === "__vModel__") {
        dataObject.props.value = scheme.__config__.defaultValue;
        dataObject.on.input = (event) => {
          this.$set(
            this.confFields[this.fieldsIndex].__config__,
            "defaultValue",
            event
          );
        };
        dataObject.on.change = (event) => {
          this.$set(
            this.confFields[this.fieldsIndex].__config__,
            "defaultValue",
            event
          );
          if(this.confFields[this.fieldsIndex]&&this.confFields[this.fieldsIndex].__config__&&this.confFields[this.fieldsIndex].__config__.triggerEvents&&this.confFields[this.fieldsIndex].__config__.triggerEvents.includes('change')){
            this.handleChange(event);
          }
        };
        if(this.confFields[this.fieldsIndex]&&this.confFields[this.fieldsIndex].__config__&&this.confFields[this.fieldsIndex].__config__.triggerEvents&&this.confFields[this.fieldsIndex].__config__.triggerEvents.includes('blur')){
            dataObject.on.blur = () => {
                this.handleBlur();
            };
          }
        
      } else if (dataObject[key]) {
        dataObject[key] = { ...dataObject[key], ...val };
      } else {
        dataObject.attrs[key] = val;
      }
    });
   
    let renderVnodes = [];

    delete dataObject.attrs.__config__;
    delete dataObject.attrs.__slot__;
    delete dataObject.attrs.__methods__;
    return h(scheme.__config__.tag, dataObject, renderVnodes);
  },
  methods: {
    handleChange(val){
      this.confFields[this.fieldsIndex].__config__.defaultValue= val;
      this.setValue();
      this.handleTriggerEvent('change');
    },
    handleBlur(){
      this.setValue();
      this.handleTriggerEvent('blur');
    },
  }
};
</script>
