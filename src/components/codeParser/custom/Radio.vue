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
      value: "",
      slot: [],
      confFields: [],
      formId:0
    };
  },
  watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
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
    
   if(this.confFields[this.fieldsIndex].__config__.defaultValue){
     this.value = this.confFields[this.fieldsIndex].__config__.defaultValue
   }
   this.setValue();
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
  },
  mounted(){
    this.$event.$on('updateFormConf',obj=>{
      if(obj?.fields){
        let val = updateDefaultVal(this.confFields[this.fieldsIndex].__config__.formId,obj.fields);
        if(val){
          this.value  = val;
        }
      } 
    });
  },
  render: function (h) {
     const listeners = {
      change: this.handleChange
    } ;
    return (
      <el-radio-group
        v-model={this.value}
        disabled={this.confFields[this.fieldsIndex].disabled}
        size={this.confFields[this.fieldsIndex].size}
        style={this.confFields[this.fieldsIndex].style}
         {...{ on: listeners }}
      >
        {this.slot}
      </el-radio-group>
    );
  },
  methods: {
    async changeOptions(){
      let conf = this.confFields[this.fieldsIndex];
      let options = [];
      options = await getOptions(conf.__config__);
    if (
      this.confFields[this.fieldsIndex]?.__config__?.optionType === "button" &&
      options.length>0
    ) {
      this.slot = [];
      options.forEach(
        (item) => {
          this.slot.push(
            <el-radio-button label={item.value} value={item.value}>
              {item.label}
            </el-radio-button>
          );
        }
      );
    } else if(options.length>0){
      this.slot = [];
        options.forEach(
        (item) => {
          this.slot.push(
            <el-radio label={item.value} value={item.value}>
              {item.label}
            </el-radio>
          );
        }
      );
      }
    }
  }
};
</script>
