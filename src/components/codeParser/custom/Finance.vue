<script>
import { changeFormConfigDefaultValue } from "@/components/codeParser/util.js";
import { convertToChineseCapital, getNumberFixed2 } from "@/components/codeParser/util.js";
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
    this.changeDefaultValue(this.value);
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
    //大写组件
    if (this.confFields[this.fieldsIndex].isCapitalized) {
      this.confFields[
        this.fieldsIndex
      ].__config__.showCapitalizedValue = true;
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
    let conf = this.confFields[this.fieldsIndex].__config__;
    let self = this;
    let nativeOnListeners = {
      input: function(e) {
        if(['e','E'].includes(e.data)){
          self.value = e.data;
          self.changeDefaultValue(self.value);
        }
      },
    };
    let listeners = {
      input: function(eventValue) {
        eventValue = new Number(eventValue);
        self.value = eventValue;
        self.changeDefaultValue(eventValue);
      },
      blur: function(eventValue) {
        self.handleTriggerEvent('blur');
      },
    };
	if (this.confFields[this.fieldsIndex].isCapitalized) {
	    if(this.confFields[this.fieldsIndex].__config__.defaultValue){
	      convertToChineseCapital(this.confFields[this.fieldsIndex].__config__.defaultValue);
	    }
	    
	}
    if (this.confFields[this.fieldsIndex].isCapitalized) {
      if (
        this.confFields[this.fieldsIndex].__config__.showCapitalizedValue
      ) {
        let val  = '';
        val = convertToChineseCapital(
              this.confFields[this.fieldsIndex].__config__.defaultValue
            );
        return (
		  <el-input
		    v-model={val}
		    placeholder={this.confFields[this.fieldsIndex].placeholder}
		    autosize={this.confFields[this.fieldsIndex].autosize}
		    disabled={this.confFields[this.fieldsIndex].disabled}
		    maxlength={this.confFields[this.fieldsIndex].maxlength}
		    readonly={true}
		    suffix-icon={this.confFields[this.fieldsIndex]["suffix-icon"]}
		    prefix-icon={this.confFields[this.fieldsIndex]["prefix-icon"]}
		    show-password={this.confFields[this.fieldsIndex]["show-password"]}
		    show-word-limit={
		      this.confFields[this.fieldsIndex]["show-word-limit"]
		    }
		    style={this.confFields[this.fieldsIndex].style}
		    {...{ on: {
                focus: () => {
                  this.confFields[
                    this.fieldsIndex
                  ].__config__.showCapitalizedValue = false;
                }
              } }}
		  >
		    {this.slots}
		  </el-input>
        );
      } else {
        listeners = {
          input: function(eventValue) {
            eventValue = new Number(eventValue);
            self.value = eventValue;
            self.changeDefaultValue(eventValue);
          },
          blur: function() {
             self.confFields[
                    self.fieldsIndex
              ].__config__.showCapitalizedValue = true;
              self.handleTriggerEvent('blur');
          }
        };
      }
    }
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
        {...{ on: listeners,nativeOn:nativeOnListeners }}
      >
        {this.slots}
      </el-input>
    );
  },
  methods: {
    changeDefaultValue(eventValue) {
      let val = getNumberFixed2(eventValue);
		  this.confFields[this.fieldsIndex].__config__.defaultValue = val;
        if(this.confFields[this.fieldsIndex].relativeComObject){
          let fields = this.formConf.fields;
          this.formConf.fields = changeFormConfigDefaultValue(fields);
          this.formConf.fields = changeFormConfigDefaultValue(fields);
          this.$event.$emit('updateFormConf',this.formConf);
        }
    }
  }
};
</script>
