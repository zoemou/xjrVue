import { ComponentConfigList, Components } from "./../config.js";
import CustomeTabs from "./../../Tabs.vue";
Components["CustomeTabs"] = CustomeTabs;
export default {
  components: Components,
  data() {
    return {
      componentList: ComponentConfigList,
      show: false,
    };
  },
  render(h) {
    if(this.show){
      return this.renderHtml();
    }
  },
  methods: {
    renderHtml(){
      return <el-row gutter={this.formConf.gutter}>
      <el-form
        size={this.formConf.size}
        label-position={this.formConf.labelPosition}
        disabled={this.formConf.disabled}
        label-width={`${this.formConf.labelWidth}px`}
        ref={this.formConf.formRef}
        props={{
          model:
            this.formOperationObject.formModel[
              this.formOperationObject.mainTableName
            ],
        }}
        rules={this.formOperationObject.formRules}
      >
        {this.renderForm(h)}
      </el-form>
      {this.slots}
    </el-row>
    },
    renderForm(createElement) {
      return this.formConf.fields.map((scheme, index) => {
        const config = scheme.__config__;
        if (config.layout === "colFormItem") {
          return this.renderColFormItem(
            createElement,
            config.layout,
            scheme,
            index
          );
        } else if (config.layout === "rowFormItem") {
          return this.renderRowFormItem(
            createElement,
            config.layout,
            scheme,
            index
          );
        } else {
          return "";
        }
      });
    },
    initTriggerIds(changeData) {
      let ids = [];
      if (changeData && changeData.length > 0) {
        ids = changeData.map((ele) => {
          return ele.componentFormId;
        });
      }
      this.triggerChangeEventIds = ids;
    },
    handleFilterableClick(scheme) {
      let conf = scheme.__config__;
      if (conf.autoBindFields) {
        let params = {
          ...conf,
          fields: [],
          dicData: [],
          saveField: "",
          showField: "",
        };
        //组件触发事件
        if (conf.triggerEventData && conf.triggerEventData["change"]) {
          this.initTriggerIds(conf.triggerEventData["change"]);
        }
        params.title = conf.label + this.$t("optionRecord");
        params.model = scheme.__vModel__;
        params.formId = conf.formId;
        params.dataType = conf.dataType;
        params.avueType = conf.avueType;
        if (params.dataType == "dataSource") {
          params.dataSource = conf.dataSource;
          params.tabName = "base";
          params.showField = conf.showField;
          params.saveField = conf.saveField;
        } else if (params.dataType == "dataSql") {
          params.tabName = "sql";
        } else if (params.dataType == "dataItem") {
          params.dataSource = conf.dataItem;
          params.fields = ["F_ItemName", "F_ItemValue"];
          params.tabName = "item";
          params.showField = conf.showField;
          params.saveField = conf.saveField;
        } else if (params.dataType == "dataApi") {
          params.apiConfig = conf.apiConfig;
          params.tabName = "api";
          params.saveField =
            conf.apiConfig && conf.apiConfig.saveField
              ? conf.apiConfig.saveField
              : "id";
          params.showField =
            conf.apiConfig && conf.apiConfig.showField
              ? conf.apiConfig.showField
              : "name";
        }
        params.autoBindFields = conf.autoBindFields;
        params.defaultValue = conf.defaultValue;
        if (scheme.dicData && scheme.dicData.length) {
          params.dicData = scheme.dicData;
        } else {
          params.dicData = [];
        }

        this.$event.$emit("openFilterableDataDialog", params);
      } else {
        this.$message("autoBindFields配置信息未填写");
      }
    },
    renderColFormItem(createElement, item, scheme, fieldsIndex) {
      const config = scheme.__config__;
      let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
      if (config.showLabel === false) {
        labelWidth = "0";
      }
      let renderTag = this.componentList[config.tag]
        ? this.componentList[config.tag].renderTag
        : "ElComponent";
      // 财务组件
      if(scheme.type&&scheme.type=='number'){
        renderTag = "CustomeFinance";
      }
      let self = this;
      let listeners = {
        updateFormDefaultValue: this.updateFormDefaultValue,
        handleFilterableClick: (conf) => {
          self.handleFilterableClick(conf);
        },
      };
      const vnodes = createElement(renderTag, {
        props: {
          fieldsIndex,
          formConf: this.formConf,
          curFormId: config.formId,
          isEdit: this.isEdit,
        },
        ...{ on: listeners },
      });
      let lgmarkString = "";
      if (
        config.F_LgMarkCode === "" ||
        config.F_LgMarkCode === null ||
        config.F_LgMarkCode === undefined
      ) {
        lgmarkString = config.label;
      } else {
        lgmarkString = this.$t(config.F_LgMarkCode);
      }
      return (
        <el-col
          span={config.span}
          v-show={config.view}
        >
          <el-form-item
            label-width={labelWidth}
            prop={config.bindTableField}
            label={config.showLabel ? lgmarkString : ""}
          >
            {vnodes}
          </el-form-item>
        </el-col>
      );
      
    },
    renderRowFormItem(createElement, item, scheme, fieldsIndex) {
      let child = this.renderChildren(createElement, scheme, fieldsIndex);
      let slots = child;
      if (
        scheme.__config__.componentName &&
        scheme.__config__.componentName === "table"
      ) {
        console.log('scheme.__config__',scheme.__config__);
        return child;
      } else if (scheme.type === "flex") {
        // 如果是表格类型
        slots = this.renderFlexRow(scheme, child);
      }
      return (
        <el-col span={scheme.span}>
          <el-row gutter={scheme.gutter}>{slots}</el-row>
        </el-col>
      );
    },
    renderChildren(createElement, scheme, fieldsIndex) {
      const config = scheme.__config__;
      if (config.componentName && config.componentName === "table") {
        return this.renderTable(createElement, config, fieldsIndex);
      }
      //avue-tabs 绘制
      if (config.componentName && config.componentName === "avue-tabs") {
        return this.renderTabs(createElement, config, fieldsIndex);
      }
      if (!Array.isArray(config.children)) {
        return null;
      }
      return this.renderForm(config.children);
    },
    renderTable(createElement, config, fieldsIndex) {
      let obj = { fieldsIndex, formConf: this.formConf, isEdit: this.isEdit };
      if (this.fromPage != "preview") {
        obj.formEnCodeList = this.formEnCodeList;
      }
      return createElement("CustomeTable", {
        props: obj,
        ref: "avueTable" + config.formId,
      });
    },
    renderTabs(createElement, config, fieldsIndex) {
      let self = this;
      let listeners = {
        handleFilterableClick: (conf) => {
          self.handleFilterableClick(conf);
        },
      };
      let obj = { fieldsIndex, formConf: this.formConf, isEdit: this.isEdit };
      if (this.fromPage != "preview") {
        obj.formEnCodeList = this.formEnCodeList;
      }
      return createElement("CustomeTabs", {
        props: obj,
        ...{ on: listeners },
        ref: "FormTab" + config.formId,
      });
    },
    renderFlexRow(scheme, child) {
      return (
        <el-row
          type={scheme.type}
          justify={scheme.justify}
          align={scheme.align}
        >
          {child}
        </el-row>
      );
    },
  },
};
