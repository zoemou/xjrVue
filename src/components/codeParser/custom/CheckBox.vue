<script>
import {
  getOptions
} from '@/util/dataApi';
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
      type: Number
    }
  },
  data() {
    return {
      slot: [],
      value:[],
      confFields: [],
      formId:0
    }
  },
  watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
      this.setValue();
    },
    '$store.state.formParser.needChangeOptionFormId': function () {
      let ids = this.$store.state.formParser.needChangeOptionFormId;
      if(ids.includes(this.formId)){
         this.changeOptions();
      }
    }
  },
  async created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.formId = this.confFields[this.fieldsIndex].__config__.formId;
    await this.changeOptions();

    if(this.confFields[this.fieldsIndex].__config__.defaultValue&&this.confFields[this.fieldsIndex].__config__.defaultValue.length>0){
      this.value = this.confFields[this.fieldsIndex].__config__.defaultValue
    }
     
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
  },
  mounted(){
    this.$event.$on('updateFormConf',obj=>{
      //this.value = obj.fields[this.fieldsIndex].__config__.defaultValue;
      if(obj?.fields){
        let  defaultValue= updateDefaultVal(this.confFields[this.fieldsIndex].__config__.formId,obj.fields);
        if(defaultValue&&defaultValue.length>0){
          this.value = defaultValue
        }
      }
    });
  },
  render: function (h) {
    const listeners = {
       change: this.checkBoxChange
    };
    if(this.confFields[this.fieldsIndex].__config__.defaultValue&&!Array.isArray(this.confFields[this.fieldsIndex].__config__.defaultValue)){
      this.confFields[this.fieldsIndex].__config__.defaultValue = this.confFields[this.fieldsIndex].__config__.defaultValue.split(',');
    }
    return (
      <el-checkbox-group
        v-model={this.value}
        placeholder={this.confFields[this.fieldsIndex].placeholder}
        clearable={this.confFields[this.fieldsIndex].clearable}
        disabled={this.confFields[this.fieldsIndex].disabled}
        multiple={this.confFields[this.fieldsIndex].multiple}
        style={this.confFields[this.fieldsIndex].style}
        {...{ on: listeners }}
      >
        {this.slot}
      </el-checkbox-group>
    );
  },
  methods: {
    checkBoxChange(val){
      this.setValue();
      this.handleTriggerEvent('change');
    },
    async changeOptions(){
      let options = [];
      let conf = this.confFields[this.fieldsIndex];
      options = await getOptions(conf.__config__);

    if (options.length > 0) {
      this.slot = [];
      options.forEach(
        (item) => {
          if (
            this.confFields[this.fieldsIndex].__config__.optionType ===
            "button"
          ) {
            this.slot.push(
              <el-checkbox-button label={item.value} key={item.value}>
                {item.label}
              </el-checkbox-button>
            );
          } else {
            this.slot.push(
              <el-checkbox
                label={item.value}
                key={item.value}
                border={this.confFields[this.fieldsIndex].border}
              >
                {item.label}
              </el-checkbox>
            );
          }
        }
      );
    }
    }
  }
};
</script>
