<script>
import FilterTableDialog from '@/components/generator/clientComponents/FilterableDataList.vue';
// 子表单 联想弹层
export default {
  components: { FilterTableDialog },
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
      type: String
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
  watch: {
    reRenderSubform: function(val) {
      this.initData();
    }
  },
  data() {
    return {
      selectValue: null,
      showValue: null,
      slot: [],
      originOptions: [],
      dialogSlot: null,
      mutipleCompleteConf: {}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let arr = [];
      if (this.value) {
        this.selectValue = this.value + "";
        this.showValue = this.value;
        arr = this.selectValue.split(",");
      }
      if (
        this.dicData &&
        Array.isArray(this.dicData) &&
        this.dicData.length > 0
      ) {
        this.originOptions = [];
        if (this.dicData.length > 0) {
          this.originOptions = this.dicData; //字典数据
          let showValueArr = [];

          this.originOptions.forEach(item => {
            if (arr.includes(item.value)) {
              showValueArr.push(item.label);
            }
          });
          if (showValueArr.length > 0) {
            this.showValue = showValueArr.join(",");
          }
        }
      }
    },
    openDialog() {
       this.dialogSlot = null;
      const listeners = {
        onHandler: this.mutipleFilterableCallBack
      };
      this.conf.defaultValue = this.selectValue;
      this.conf.title = this.$t('multiSelectLayerSelectRecord');
      this.dialogSlot = (
        <FilterTableDialog
          type="mutiple"
          value={this.selectValue}
          conf={this.conf}
          dicData={this.originOptions}
          isSubForm={true}
          {...{ on: listeners }}
        ></FilterTableDialog>
      );
    },
    closeDialog() {
      this.dialogSlot = null;
    },
    mutipleFilterableCallBack(data) {
      console.log('data',data);
      if (data && data.length > 0) {
        let arr = [],
          arr1 = [];
          let saveField = "";
          let showField = "";
          if( this.conf.__config__.dataType=="dataApi"){
             saveField =this.conf.__config__.apiConfig.saveField;
            showField = this.conf.__config__.apiConfig.showField;
          }else{
            saveField =
          this.conf.__config__.dataType == "dataItem"
            ? "F_ItemValue"
            : this.conf.__config__.saveField;
            showField =
          this.conf.__config__.dataType == "dataItem"
            ? "F_ItemName"
            : this.conf.__config__.showField;
          }
        
        data.forEach(it => {
          arr.push(it[saveField]);
          arr1.push(it[showField]);
        });
        let showValue = arr1.join(",");
        let value = arr.join(",");
        this.showValue = showValue;
        this.selectValue = value;
        this.$emit("changeTableMutiplePopupData", {
          index: this.index,
          value,
          showValue,
          bindTableField: this.conf.__config__.bindTableField,
          bindTable: this.bindTable,
          __vModel__: this.conf.__vModel__
        });
      }
      this.closeDialog();
    }
  },
  render: function(h) {
    const listeners = {
      focus: () => {
        this.openDialog();
      }
    };
    return (
      <div>
        <el-input
          v-model={this.showValue}
          placeholder={this.conf.placeholder ? this.conf.placeholder : ""}
          disabled={this.disabled}
          suffix-icon={this.conf["suffix-icon"] ? this.conf["suffix-icon"] : ""}
          prefix-icon={this.conf["prefix-icon"] ? this.conf["prefix-icon"] : ""}
          style={this.conf.style ? this.conf.style : ""}
          {...{ on: listeners }}
        ></el-input>
        {this.dialogSlot}
      </div>
    );
  }
};
</script>

<style lang="scss" scoped></style>
