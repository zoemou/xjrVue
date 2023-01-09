<script>
import { updateDefaultVal } from '../util.js'
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
      type: Number,
      default:1
    }
  },
  data(){
    return {
      confFields: []
    }
  },
  created(){
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.setValue();
  },
  mounted(){
    this.$event.$on('updateFormConf',obj=>{
      if(obj?.fields){
        let defaultValue = updateDefaultVal(this.confFields[this.fieldsIndex].__config__.formId,obj.fields);
        if(defaultValue&&defaultValue.length>0){
          this.confFields[this.fieldsIndex].__config__.defaultValue = defaultValue;
          this.setValue();
        }
      } 
    });
  },
  render: function (h) {
    let listeners = {
       change: this.handleChange
    };
    let conf = this.confFields[this.fieldsIndex];
    //是否为查看
    if(this.isEdit==2){
      conf.disabled = true;
    }
    let pickerOptions = conf["picker-options"]?{
      selectableRange: conf["picker-options"].selectableRange,
      format: conf.format,
    }:{};
    if(this.confFields[this.fieldsIndex].__config__.avueType=="timerange"&&
    !Array.isArray(this.confFields[this.fieldsIndex].__config__.defaultValue)){
      this.confFields[this.fieldsIndex].__config__.defaultValue = this.confFields[this.fieldsIndex].__config__.defaultValue.split(',');
    }
    return (
      <el-time-picker
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        picker-options={pickerOptions}
        style={conf.style}
        clearable={conf.clearable}
        disabled={conf.disabled}
        placeholder={conf.placeholder}
        is-range={conf['is-range']}
        range-separator={conf['range-separator']}
        start-placeholder={conf['start-placeholder']}
        end-placeholder={conf['end-placeholder']}
        value-format={conf['value-format']}
        {...{ on: listeners }}
      ></el-time-picker>
    );
  },
  methods: {
    handleChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    }
  }
};
</script>
