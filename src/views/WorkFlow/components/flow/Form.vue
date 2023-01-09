<script>
import { deepClone } from "@/utils/index";
import { ComponentConfigList, Components } from "@/components/codeParser/custom/config.js";
const ComponentList = ComponentConfigList;
export default {
  name: "FormParser",
  components: Components,
  props: {
    conf: {
      type: Object,
      required: true,
    },
    formFieldInfo: {
      type: Object,
    },
    formData: {
      type: Object,
    },
    formInfos: {
      type: Object,
    },
  },
  data() {
    return {
      formOperationObject: {
        formModel: {}, // 绑定数据
        formRules: {}, // 绑定规则
        mainTableName: "",
      },
      formConf: {},
      userInfo: {},
    };
  },
  created() {
    this.formConf = deepClone(this.conf);
    if (!this.formConf.fields) {
      this.$message.error("表单配置异常，请检查数据格式");
      return false;
    }
    let authorityList = new Map();
    if(!this.formFieldInfo||!this.formFieldInfo.children||this.formFieldInfo.children.length==0){
        this.$message.error("无表单权限，请检查数据格式");
        return false;
    }
    //表单权限
    if (
      this.formFieldInfo &&
      this.formFieldInfo.children &&
      this.formFieldInfo.children.length > 0
    ) {
      let filedsSettingAuthority = this.formFieldInfo.children;
      filedsSettingAuthority.forEach((element) => {
        let key = element.bindTable + element.fieldsId;
        authorityList.set(key, element);
      });
    }
    const self = this; // 规则验证需要绑定vue实例this
    const defaultValidator = (rule, value, callback) => {
      const conf = self.formConf.fields[rule.fieldsIndex];
      const defaultValue = conf.__config__.defaultValue;
      if (conf.readonly) {
        //只读属性
        callback();
      }
      if (defaultValue) {
        callback();
      } else {
        const msg =
          conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder;
        callback(new Error(msg));
      }
    };
    const uploadValidator = (rule, value, callback) => {
      const conf = self.formConf.fields[rule.fieldsIndex];
      if(conf.__config__.defaultValue){
        callback();
      }else{
        const msg =
          (conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder) + "必须上传！";
        callback(new Error(msg));
      }
    };
    const checkboxValidator = (rule, value, callback) => {
      const conf = self.formConf.fields[rule.fieldsIndex];
      const defaultValueArr = conf.__config__.defaultValue;
      if (defaultValueArr.length === 0) {
        const msg =
          (conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder) + "必须填写！";
        callback(new Error(msg));
      }
      callback();
    };
    for (let [key, value] of Object.entries(this.formConf.fields)) {
      let tempKey =
        value.__config__.bindTable + value.__config__.bindTableField;
      if (authorityList.has(tempKey)) {
        let tempValue = authorityList.get(tempKey);
        this.formConf.fields[key].__config__.required = tempValue.required;
        this.formConf.fields[key].__config__.view = tempValue.view;
        this.formConf.fields[key].disabled = tempValue.edit ? false : true;
        this.formConf.fields[key].__config__.edit = tempValue.edit;
        //表单规则创建
        if (this.formConf.fields[key].__config__.required) {
          const regList = this.formConf.fields[key].__config__.regList
            ? this.formConf.fields[key].__config__.regList
            : [];
          let trigger = "change";
          let validatorStr = "default";
          if (ComponentList[this.formConf.fields[key].__config__.tag]) {
            trigger = ComponentList[this.formConf.fields[key].__config__.tag]
              .rule.trigger
              ? ComponentList[this.formConf.fields[key].__config__.tag].rule
                  .trigger
              : "change";
            validatorStr = ComponentList[
              this.formConf.fields[key].__config__.tag
            ].rule.validatorStr
              ? ComponentList[this.formConf.fields[key].__config__.tag].rule
                  .validatorStr
              : "default";
          }
          let validator = defaultValidator;
          if (validatorStr === "upload") {
            validator = uploadValidator;
          }
          if (validatorStr === "checkbox") {
            validator = checkboxValidator;
          }
          // let validator =
          //   validatorStr === "upload" ? uploadValidator : defaultValidator;
          const requiredJson = {
            fieldsIndex: key,
            required: this.formConf.fields[key].__config__.required,
            trigger,
            validator,
          };
          regList.push(requiredJson);
          this.formOperationObject.formRules[
            this.formConf.fields[key].__config__.bindTableField
          ] = regList.map((item) => {
            // eslint-disable-next-line no-eval
            if (item.pattern) {
              item = {
                required: this.formConf.fields[key].__config__.required,
                pattern: item.pattern,
                message: item.message,
              };
            } else {
              item.trigger = item.trigger ? item.trigger : "change";
            }
            return item;
          });
        }
      } else {
         this.formConf.fields[key].__config__.required = false;
        this.formConf.fields[key].__config__.view = false;
        this.formConf.fields[key].__config__.edit = false;
      }
    }
    this.userInfo = localStorage.getItem("avue-userInfo")
      ? JSON.parse(localStorage.getItem("avue-userInfo")).content
      : {};
    this.changeData();
  },
  render(h) {
    return (
      <el-row gutter={this.formConf.gutter}>
        <el-form
          size={this.formConf.size}
          label-position={this.formConf.labelPosition}
          disabled={this.formConf.disabled}
          label-width={`${this.formConf.labelWidth}px`}
          ref={this.formConf.formRef}
          props={{
            model: this.formOperationObject.formModel[
              this.formOperationObject.mainTableName
            ],
          }}
          rules={this.formOperationObject.formRules}
        >
          {this.renderForm(h)}
        </el-form>
      </el-row>
    );
  },
  methods: {
    changeData() {
      const self = this; // 规则验证需要绑定vue实例this
      const defaultValidator = (rule, value, callback) => {
        const conf = self.formConf.fields[rule.fieldsIndex];
        const defaultValue = conf.__config__.defaultValue;
        if (conf.readonly) {
          //只读属性
          callback();
        }
        if (defaultValue) {
          callback();
        } else {
          const msg =
            conf.placeholder === undefined
              ? `${conf.__config__.label}不能为空`
              : conf.placeholder;
          callback(new Error(msg));
        }
      };
      const uploadValidator = (rule, value, callback) => {
        const conf = self.formConf.fields[rule.fieldsIndex];
        const fileList = conf.__config__.defaultValue.fileList;
        if (fileList.length === 0) {
          const msg =
            (conf.placeholder === undefined
              ? `${conf.__config__.label}不能为空`
              : conf.placeholder) + "必须上传！";
          callback(new Error(msg));
        }
        callback();
      };
      this.formConf.fields.forEach((cur, fieldsIndex) => {
        const config = cur.__config__;
        if (config.tag === "h2") {
          //标题 忽略
          return;
        }
        if (config.tag === "el-divider") {
          //分割线 忽略
          return;
        }
        //表单提交数据（tablename绑定）
        if (!this.formOperationObject.formModel[config.bindTable]) {
          this.formOperationObject.formModel[config.bindTable] = {};
        }

        if (config.componentName && config.componentName === "table") {
          this.formConf.fields[fieldsIndex].__config__.defaultValue = {
            dynamic: [],
          };
        }
        if (!this.formOperationObject.mainTableName) {
          if (!config.componentName || config.componentName !== "table") {
            this.formOperationObject.mainTableName = config.bindTable;
          }
        }
        //审批流程
        if (this.formData && "{}" != JSON.stringify(this.formData)) {
          if (
            this.formData[cur.__config__.bindTable] &&
            config.componentName &&
            config.componentName === "table"
          ) {
            this.formConf.fields[fieldsIndex].__config__.defaultValue = {
              dynamic: this.formData[cur.__config__.bindTable],
            };
          }
          if (
            this.formData[cur.__config__.bindTable][
              cur.__config__.bindTableField
            ]
          ) {
            this.formConf.fields[
              fieldsIndex
            ].__config__.defaultValue = this.formData[cur.__config__.bindTable][
              cur.__config__.bindTableField
            ];
            if (
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-checkbox-group" ||
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-date-picker" ||
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-time-picker"
            ) {
              let configVal = this.formData[cur.__config__.bindTable][
                cur.__config__.bindTableField
              ].split(",");
              if (configVal.length > 1) {
                this.formConf.fields[
                  fieldsIndex
                ].__config__.defaultValue = configVal;
              } else {
                this.formConf.fields[
                  fieldsIndex
                ].__config__.defaultValue = this.formData[
                  cur.__config__.bindTable
                ][cur.__config__.bindTableField];
              }
            }
          }
        }
        if (cur.__info__ === true && cur.__type__ === "info") {
          //信息体 赋值
          this.formConf.fields[fieldsIndex].__config__.tag = "info";
        }
      });
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
    renderColFormItem(createElement, item, scheme, fieldsIndex) {
      const config = scheme.__config__;
      let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
      if (config.showLabel === false) {
        labelWidth = "0";
      }
      if (!config.view) {
        return "";
      }
      let renderTag = ComponentList[config.tag]
        ? ComponentList[config.tag].renderTag
        : "ElComponent";
      const vnodes = createElement(renderTag, {
        props: { fieldsIndex, formConf: this.formConf },
      });
      return (
        <el-col span={config.span}>
          <el-form-item
            label-width={labelWidth}
            prop={config.bindTableField}
            label={config.showLabel ? config.label : ""}
          >
            {vnodes}
          </el-form-item>
        </el-col>
      );
    },
    renderRowFormItem(createElement, item, scheme, fieldsIndex) {
      let child = this.renderChildren(createElement, scheme, fieldsIndex);
      let slots = child;
      if(scheme.__config__.componentName && scheme.__config__.componentName === 'table'){
        return child
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
      if (!Array.isArray(config.children)) {
        return null;
      }
      return this.renderForm(config.children);
    },
    renderTable(createElement, config, fieldsIndex) {
      return createElement("CustomeTable", {
        props: { fieldsIndex, formConf: this.formConf },
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
    buildTableOption(config) {
      if (!config) return {};
      const tableOption = {
        submitBtn: false,
        emptyBtn: false,
        arrow: true,
        collapse: true,
        labelWidth: 0,
        column: [
          {
            label: name,
            prop: config.bindTable,
            type: "dynamic",
            span: "24",
            children: {
              align: "center",
              headerAlign: "center",
              rowAdd: (done) => {
                done();
              },
              rowDel: (row, done) => {
                done();
              },
              column: [],
            },
          },
        ],
      };
      config.children.forEach((element) => {
        tableOption.column[0].children.column.push({
          label: element.__config__.label,
          type: element.__config__.avueType,
          prop: element.__config__.bindTableField,
        });
      });
      return tableOption;
    },
    submitForm() {
      //父页面提交表单  returnData {code:0,params}// 0 提交失败 1不需要提交 2 提交数据
      let returnData = { code: 0, params: {} };
      var formValid = false;
      this.$refs[this.formConf.formRef].validate((valid) => {
        if (valid) formValid = true;
      });
      if (!formValid) {
        return returnData;
      }

      let needSubmitForm = true;
      const newObj = {};
      this.formConf.fields.forEach((el) => {
        if (el.__config__.componentName === "table") {
          if (!newObj[el.__config__.bindTable]) {
            newObj[el.__config__.bindTable] = [];
          } else {
            newObj[el.__config__.bindTable] = el.__config__.defaultValue;
          }

          var _tmp = el.__config__.defaultValue.dynamic;
          _tmp.map(function (item) {
            var _item = { ...item };
            delete _item._index;
            delete _item.$index;
            delete _item.$cellEdit;
            newObj[el.__config__.bindTable].push(_item);
          });
        } else {
          if (el.__config__.edit) {
            if (el.__config__.componentName === "table") {
            } else {
              if (el.__config__.bindTable) {
                if (!newObj[el.__config__.bindTable]) {
                  newObj[el.__config__.bindTable] = {};
                }
                if (
                  el.__config__.tag === "el-checkbox-group" ||
                  el.__config__.tag === "el-date-picker" ||
                  el.__config__.tag === "el-time-picker"
                ) {
                  newObj[el.__config__.bindTable][
                    el.__config__.bindTableField
                  ] = Array.isArray(el.__config__.defaultValue)
                    ? el.__config__.defaultValue.join(",")
                    : el.__config__.defaultValue;
                } else {
                  newObj[el.__config__.bindTable][
                    el.__config__.bindTableField
                  ] = el.__config__.defaultValue;
                }
              }
            }
          }
        }
      });
      if (JSON.stringify(newObj) == "{}") {
        needSubmitForm = false;
      }
      var formParams = {};
      if (needSubmitForm) {
        for (const key in newObj) {
          formParams[key] = newObj[key];
        }
        var mainParams = {
          f_mobile: this.userInfo.F_Account,
        };

        if (this.formInfos?.SchemeInfo) {
          mainParams.F_FormId = this.formInfos.SchemeInfo.F_Id; // 表单ID(后端需要)
          mainParams.F_Name = this.formInfos.SchemeInfo.F_Name; // 表单名
        }
        var params = Object.assign(mainParams, formParams);

        returnData.code = 2;
        returnData.params = params;
        return returnData;
      } else {
        returnData.code = 1;
        returnData.params = {};
        return returnData;
      }
    },
  },
};
</script>
<style scoped>
 div /deep/ .el-table__body,  div /deep/ .el-table__footer,  div /deep/ .el-table__header{
  width: 100% !important;
}
.el-form-item{
  margin-top: 0;
  margin-bottom: 18px!important;
}
</style>
