<script>
import { changeFormConfigDefaultValue } from "@/components/codeParser/util.js";
import { getAutoCode } from "@/api/system/coderule.js";
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
    //如果有自动编码 且为新增
    if (
      this.confFields[this.fieldsIndex].__config__.autoCodeRule &&
      !this.value
    ) {
      getAutoCode(
        this.confFields[this.fieldsIndex].__config__.autoCodeRule
      )
        .then(res => {
          if (res.data.data) {
            this.value = res.data.data;
          }
        })
        .catch(err => {});
    }
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
	if(this.confFields[this.fieldsIndex].__config__.tag=="el-mutiple-input"){
		this.confFields[this.fieldsIndex].style.display="none"
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
      blur: function() {
        self.handleTriggerEvent('blur');
      },
    };
    return (
      <el-input
        v-model={this.value}
        placeholder={this.confFields[this.fieldsIndex].placeholder}
        autosize={this.confFields[this.fieldsIndex].autosize}
        disabled={this.confFields[this.fieldsIndex].disabled}
        maxlength={this.confFields[this.fieldsIndex].maxlength}
        readonly={this.confFields[this.fieldsIndex].readonly}
        suffix-icon={this.confFields[this.fieldsIndex]["suffix-icon"]}
        prefix-icon={this.confFields[this.fieldsIndex]["prefix-icon"]}
        show-password={this.confFields[this.fieldsIndex]["show-password"]}
        show-word-limit={
          this.confFields[this.fieldsIndex]["show-word-limit"]
        }
        style={this.confFields[this.fieldsIndex].style}
        type={this.confFields[this.fieldsIndex].type||'text'}
        {...{ on: listeners }}
      >
        {this.slots}
      </el-input>
    );
  },
  methods: {
    changeDefaultValue(eventValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = eventValue;
    }
  }
};
</script>
