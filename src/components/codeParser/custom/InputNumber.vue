<script>
import { changeFormConfigDefaultValue } from "@/components/codeParser/util.js";
import { getNumberFixed2 } from "@/components/codeParser/util.js";
import { updateDefaultVal } from '../util.js'
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
    fieldsIndex: {
      type: Number,
      required: true
    },
    formConf: {
      type: Object,
      required: true
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
  data() {
    return {
      slots: [],
      value: "",
      confFields: [],
      formId:0,
    };
  },
  watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
      this.setValue();
    }
  },
  created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.value = this.confFields[this.fieldsIndex].__config__.defaultValue;
    if (
      this.confFields[this.fieldsIndex].__slot__ &&
      this.confFields[this.fieldsIndex].__slot__.prepend
    ) {
      this.slots.push(
        <template slot="prepend">
          {this.confFields[this.fieldsIndex].__slot__.prepend}
        </template>
      );
    }
    if (
      this.confFields[this.fieldsIndex].__slot__ &&
      this.confFields[this.fieldsIndex].__slot__.append
    ) {
      this.slots.push(
        <template slot="append">
          {this.confFields[this.fieldsIndex].__slot__.append}
        </template>
      );
    }
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
  this.formId = this.confFields[this.fieldsIndex].__config__.formId;
  },
  mounted() {
    let self = this;
    this.$event.$on("updateFormConf", obj => {
      if(obj?.fields){
        self.value = updateDefaultVal(self.curFormId,obj.fields);
      }
    });
  },
  render: function(h) {
    let self = this;
    let listeners = {
      input: function(eventValue) {
        self.changeDefaultValue(eventValue);
      },
      blur: function(eventValue) {
        self.handleTriggerEvent('blur');
      },
    };
    return (
      <el-input-number
       v-model={this.value}
        placeholder={this.confFields[this.fieldsIndex].placeholder}
        autosize={this.confFields[this.fieldsIndex].autosize}
        disabled={this.confFields[this.fieldsIndex].disabled}
        maxlength={this.confFields[this.fieldsIndex].maxlength}
        suffix-icon={this.confFields[this.fieldsIndex]["suffix-icon"]}
        prefix-icon={this.confFields[this.fieldsIndex]["prefix-icon"]}
        controls-position={this.confFields[this.fieldsIndex]["controls-position"]}
        show-word-limit={
          this.confFields[this.fieldsIndex]["show-word-limit"]
        }
        style={this.confFields[this.fieldsIndex].style}
        min={ this.confFields[
        this.fieldsIndex
      ].min}
        max={this.confFields[
        this.fieldsIndex
      ].max}
        step={this.confFields[
        this.fieldsIndex
      ].step}
        step-strictly={this.confFields[
        this.fieldsIndex
      ]['step-strictly']}
        precision={this.confFields[
        this.fieldsIndex
      ].precision}
        {...{ on: listeners }}
      >
        {this.slots}
      </el-input-number>
    );
  },
  methods: {
    changeDefaultValue(eventValue) {
      let isNumberType =
        this.confFields[this.fieldsIndex].__config__.avueType ==
          "number" || this.confFields[this.fieldsIndex].type == "number";
      if (isNumberType) {
		  let val = getNumberFixed2(eventValue);
		  this.confFields[this.fieldsIndex].__config__.defaultValue = val;
        if(this.confFields[this.fieldsIndex].relativeComObject){
          let fields = this.formConf.fields;
          this.formConf.fields = changeFormConfigDefaultValue(fields);
          this.$event.$emit('updateFormConf',this.formConf);
        }
      }else{
		  this.confFields[this.fieldsIndex].__config__.defaultValue = eventValue;
	  }
    }
  }
};
</script>
