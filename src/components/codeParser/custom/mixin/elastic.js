import { triggerEventHandler } from "@/util/dataApi";
export default {
  data() {
    return {
      autoCompleteConf: {},
      triggerChangeEventIds: [], //联系弹层，多选弹层 触发事件ids
    };
  },
  mounted() {
    this.$event.$on("openFilterableDataDialog", (conf) => {
      this.autoCompleteConf = conf;
      this.slots = [];
      var listeners = {
        onHandler:
          conf.avueType == "mutiple-popup"
            ? this.mutipleFilterableCallBack
            : this.filterableCallBack,
      };

      this.slots.push(
        <FormParserFilterablelist
          conf={this.autoCompleteConf}
          type={conf.avueType == "mutiple-popup" ? "mutiple" : "single"}
          {...{ on: listeners }}
        ></FormParserFilterablelist>
      );
    });
  },
  methods: {
    mutipleFilterableCallBack(data) {
      if (!this.autoCompleteConf) {
        return false;
      }
      //弹窗关闭前回填数据  如果有选择数据项
      if (data) {
        let fields = this.formConf.fields;
        if (this.autoCompleteConf.autoBindFields) {
          let autoBindFields =
            JSON.parse(this.autoCompleteConf.autoBindFields) || {};
          let showField =
            this.autoCompleteConf.dataType == "dataItem"
              ? "F_ItemName"
              : this.autoCompleteConf.showField;
          let saveField =
            this.autoCompleteConf.dataType == "dataItem"
              ? "F_ItemValue"
              : this.autoCompleteConf.saveField;
          if (data && data.length > 0) {
            let arr = [],
              arr2 = [];
            data.forEach((it) => {
              arr.push(it[showField]);
              arr2.push(it[saveField]);
            });
            //自己赋值
            this.selfSetDefaultVal(
              fields,
              autoBindFields,
              arr.join(","),
              arr2.join(","),
              this.autoCompleteConf.formId
            );
          }
        }
      }
      //emit 改变值
      this.$event.$emit("updateFormConf", this.formConf);
      //组件触发事件
      triggerEventHandler(this.triggerChangeEventIds);
      //关闭弹窗
      this.slots = [];
    },
    filterableCallBack(data) {
      if (!this.autoCompleteConf) {
        return false;
      }
      //弹窗关闭前回填数据  如果有选择数据项
      if (data) {
        let fields = this.formConf.fields;
        if (this.autoCompleteConf.autoBindFields) {
          let autoBindFields =
            JSON.parse(this.autoCompleteConf.autoBindFields) || {};
          let showField =
            this.autoCompleteConf.dataType == "dataItem"
              ? "F_ItemName"
              : this.autoCompleteConf.showField;
          let saveField =
            this.autoCompleteConf.dataType == "dataItem"
              ? "F_ItemValue"
              : this.autoCompleteConf.saveField;
          this.setDefaultVal(fields, autoBindFields, data);
          //自己赋值
          this.selfSetDefaultVal(
            fields,
            autoBindFields,
            data[showField],
            data[saveField],
            this.autoCompleteConf.formId
          );
        }
      }
      //emit 改变值
      this.$event.$emit("updateFormConf", this.formConf);
      //组件触发事件
      triggerEventHandler(this.triggerChangeEventIds);
      //关闭弹窗
      this.slots = [];
    },
    setDefaultVal(fields, autoBindFields, data) {
      fields.map((item, index) => {
        if (item?.__config__?.componentName == "avue-tabs") {
          let childrenObj = item?.__config__?.childrenObj || {};
          for (let key in childrenObj) {
            let children = childrenObj[key];
            this.setDefaultVal(children, autoBindFields, data);
          }
        } else {
          //找到对应formId 元素  key值为存储的对应formId
          if (
            Object.prototype.toString.call(autoBindFields) === "[object Array]"
          ) {
            autoBindFields.forEach((el) => {
              if (el.component == item.__config__.formId) {
                item.__config__.defaultValue = data[el.bindField];
              }
            });
          } else {
            if (autoBindFields.hasOwnProperty(item?.__config__?.formId)) {
              //按绑定的自定义字段赋值
              item.__config__.defaultValue =
                data[autoBindFields[item.__config__.formId]];
            }
          }
        }
      });
    },
    selfSetDefaultVal(fields, autoBindFields, data, value, formId) {
      fields.map((item, index) => {
        if (item?.__config__?.componentName == "avue-tabs") {
          let childrenObj = item?.__config__?.childrenObj || {};
          for (let key in childrenObj) {
            let children = childrenObj[key];
            this.selfSetDefaultVal(
              children,
              autoBindFields,
              data,
              value,
              formId
            );
          }
        } else {
          if (item?.__config__?.formId == formId) {
            item.__config__.defaultValue = value;
            item.__config__.showValue = data;
          }
        }
      });
    },
  },
};
