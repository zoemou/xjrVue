<script>
import { deepClone } from '@/utils/index'
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
        if(defaultValue){
          this.$set(
            this.confFields[this.fieldsIndex].__config__,
            "defaultValue",
           defaultValue
          );
        }
      }
    });
  },
  render: function (h) {
    let listeners = {
      input: (event)=>{
         this.confFields[this.fieldsIndex].__config__.defaultValue = event;
        this.$set(
            this.confFields[this.fieldsIndex].__config__,
            "defaultValue",
            event
          );
      },
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
    if(this.confFields[this.fieldsIndex].__config__.avueType=="daterange"&&
    this.confFields[this.fieldsIndex].__config__.defaultValue&&
    !Array.isArray(this.confFields[this.fieldsIndex].__config__.defaultValue)){
      this.confFields[this.fieldsIndex].__config__.defaultValue = this.confFields[this.fieldsIndex].__config__.defaultValue.split(',');
    }
    return (
      <el-date-picker
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        picker-options={pickerOptions}
        style={conf.style}
        type={conf.type}
        clearable={conf.clearable}
        disabled={conf.disabled}
        readonly={conf.readonly}
        placeholder={conf.placeholder}
        is-range={conf['is-range']}
        range-separator={conf['range-separator']}
        start-placeholder={conf['start-placeholder']}
        end-placeholder={conf['end-placeholder']}
        value-format={conf['value-format']}
        format={conf.format}
        {...{ on: listeners }}
      ></el-date-picker>
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
