<script>
// 子表单 联想下拉
export default {
  props: {
    value: {
      type: String || Number || Object
    },
    index: {
      type: String || Number || Object
    },
    conf: {
      type: Object,
      default: () => {
        return {
          placeholder: "",
          suffixIcon: null,
          prefixIcon: null,
          disabled: false,
          style: "",
          __config__: {
            saveField: "",
            showField: "",
            bindTableField: "",
            autoBindFields: null,
            label: null,
            __vModel__: null,
            formId: null,
            dataType: null,
            avueType: null,
            dataSource: null,
            database: null,
            sql: null,
            dataItem: null,
            defaultValue: null
          }
        };
      }
    },
    bindTable: {
      //代码生成器生成页面中需要传递父组件改变值
      type: String,
      default: ""
    },
    dicData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isView: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    reRenderSubform: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      selectValue: null,
      slot: [],
      originOptions: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.value) {
        this.selectValue = this.value;
      }
      this.originOptions = this.dicData; //字典数据
      if (this.originOptions.length > 0) {
        this.originOptions.forEach(item => {
          this.slot.push(
            <el-option
              label={item.label}
              value={item.value}
              disabled={item.disabled}
            ></el-option>
          );
        });
      }
    },
    handerRowUpdate() {
      let autoBindFields = this.conf.__config__.autoBindFields
        ? JSON.parse(this.conf.__config__.autoBindFields)
        : [];
         let saveField = "";
        if(this.conf.__config__.dataType=="dataApi"){
            saveField =this.conf.__config__.apiConfig.saveField;
        }else{
          saveField =
        this.conf.__config__.dataType == "dataItem"
          ? "F_ItemValue"
          : this.conf.__config__.saveField;
        }
      //得对应数据列
      let data = [];
      if (this.originOptions.length > 0) {
        let temp = this.originOptions.filter(item => {
          return item[saveField] == this.selectValue;
        });
        data = temp.length > 0 ? temp[0] : [];
      }
      this.$emit("changeTableAssoData", {
        index: this.index,
        value: this.selectValue,
        bindTableField: this.conf.__config__.bindTableField,
        autoBindFields,
        data,
        bindTable: this.bindTable,
        __vModel__: this.conf.__vModel__
      });
    }
  },
  render: function(h) {
    const listeners = {
      change: this.handerRowUpdate
    };
    return (
      <el-select
        value-key="label"
        v-model={this.selectValue}
        placeholder={this.conf.placeholder ? this.conf.placeholder : ""}
        disabled={this.disabled}
        style={this.conf.style ? this.conf.style : ""}
        {...{ on: listeners }}
      >
        {this.slot}
      </el-select>
    );
  }
};
</script>

<style lang="scss" scoped></style>
