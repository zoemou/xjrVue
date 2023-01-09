<script>
// 子表单  财务组件
export default {
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    index: {
      type: String || Number || Object,
    },
    formId: {
      type: Number,
    },
    conf: {
      type: Object,
    },
    value: {
      type: String || Number || Object,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: "",
      slots: [],
      readonly: false,
    };
  },
  created() {
    this.inputValue = this.value;
    if(this.conf&&this.conf.computationalConfiguration&&this.conf.computationalConfiguration.length>0){
      this.readonly = true;//有计算式配置时，不能编辑
    }
  },
  methods: {
    changeDefaultValue(newValue) {
      let eventValue = this.getNumberFixed2(newValue);
      this.inputValue = eventValue;
      let tempJson = {
        index: this.index,
        formId: this.formId,
      };
      this.$emit("change", eventValue);
      this.$emit("changeTableFinaceData", tempJson);
    },
    getNumberFixed2(number) {
      if (
        (number == "" || number == null || number == undefined) &&
        number !== 0
      )
        return number;
      let splitNum = ("" + number).replace(/(^0*)/g, "").split(".");
      let num = splitNum[0] == "" ? "0" : splitNum[0];
      if (splitNum.length > 1) {
        num += ".";
        let roundNum = 2; //保留两位小数
        for (let i = 0; i < roundNum; i++) {
          num += splitNum[1][i];
        }
      }
      return parseFloat(num);
    },
  },
  render: function (h) {
    let conf = this.conf;
    let self = this;
    let nativeOnListeners = {
      input: function (e) {
        if (["e", "E"].includes(e.data)) {
          self.inputValue = e.data;
        }
      },
    };
    let listeners = {
      input: function (eventValue) {
        eventValue = Number(eventValue);
        eventValue = self.getNumberFixed2(eventValue);
        self.inputValue = eventValue;
      },
      blur: function (eventValue) {
        self.changeDefaultValue(self.inputValue);
        self.$emit("blur", eventValue);
      },
    };
    return (
      <el-input
        v-model={this.inputValue}
        placeholder='请输入值'
        disabled={this.disabled}
        readonly={this.readonly}
        type="number"
        {...{ on: listeners, nativeOn: nativeOnListeners }}
      >
        {this.slots}
      </el-input>
    );
  },
};
</script>

<style lang="css" scoped></style>
