import { getFormValueItemKey,setFormValueItem } from "@/util/dataApi";
export default {
  data() {
    return {
      formValueItem: {},
      formOperationObject: {
        formModel: {}, // 绑定数据
        formRules: {}, // 绑定规则
        mainTableName: "",
      },
    };
  },
  methods: {
    changeData() {
      this.formConf.fields.forEach((cur, fieldsIndex) => {
      if (
        cur.__config__.componentName &&
        cur.__config__.componentName == "avue-tabs"
      ) {
        if ( cur.__config__.childrenObj) {
          for (var tabKey in cur.__config__.childrenObj) {
            if (cur.__config__.childrenObj[tabKey].length > 0) {
              cur.__config__.childrenObj[tabKey].forEach((objEle,childrenIndex) => {
                  if (
                    objEle.__config__.componentName &&
                    objEle.__config__.componentName === "table"
                  ) {
                    this.changeFormTabTableData(fieldsIndex,tabKey,childrenIndex);
                    this.setAuthorityTabTableField(fieldsIndex,tabKey,childrenIndex);
                  }else{
                    this.setAuthorityTabField(fieldsIndex,tabKey,childrenIndex);
                    if(
                      this.formConf.fields[fieldsIndex].__config__.childrenObj&&
                      this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey]&&
                      this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex]&&
                      this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__&&
                      this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable
                    ){
                      this.bindTableFormModel(this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable);
                      this.changeTabFormData(fieldsIndex,tabKey,childrenIndex);
                      if (
                        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.view &&
                        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.required) {
                        let conf = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex];
                        this.setValidator(conf,fieldsIndex);
                      }
                    }
                  }
                })
            }
          }
        }
      } else if (
        cur.__config__.componentName &&
        cur.__config__.componentName == "table"
      ) {
        this.changeFormTableData(fieldsIndex);
        this.setAuthorityTableField(fieldsIndex);
      } else {
        this.setAuthorityField(fieldsIndex);
        if(
          this.formConf.fields[fieldsIndex]&&
          this.formConf.fields[fieldsIndex].__config__&&
          this.formConf.fields[fieldsIndex].__config__.bindTable){
            this.bindTableFormModel(this.formConf.fields[fieldsIndex].__config__.bindTable);
            this.changeFormData(fieldsIndex);
            if (
              this.formConf.fields[fieldsIndex].__config__.view &&
              this.formConf.fields[fieldsIndex].__config__.required) {
              let conf = this.formConf.fields[fieldsIndex];
              this.setValidator(conf,fieldsIndex);
            }
        }
      }
    });
    this.changeFormValueItem();
  },
    bindTableFormModel(bindTable) {
      //表单提交数据（tablename绑定）
      if (!this.formOperationObject.formModel[bindTable]) {
        this.formOperationObject.formModel[bindTable] = {};
      }
      if (!this.formOperationObject.mainTableName) {
        this.formOperationObject.mainTableName = bindTable;
      }
      if(!this.formData){
        this.formData= {};
      }
      if(!this.formData[bindTable]){
        this.formData[bindTable] = {};
      }
    },
    changeFormValueItem() {
      setFormValueItem(this.formValueItem);//设置store缓存中的值 已便api中请求入参调用
    },
    changeFormTableData(fieldsIndex){
      this.formConf.fields[fieldsIndex].__config__.defaultValue = {
        dynamic: [],
      };
      if (
        this.formData[this.formConf.fields[fieldsIndex].__config__.bindTable]
      ) {
        this.formConf.fields[fieldsIndex].__config__.defaultValue=  {
          dynamic: this.formData[this.formConf.fields[fieldsIndex].__config__.bindTable],
        }
      }
    },
    changeFormTabTableData(fieldsIndex,tabKey,childrenIndex){
      this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.defaultValue = {
        dynamic: [],
      };
      if (
        this.formData[this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable]
      ) {
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.defaultValue=  {
          dynamic: this.formData[this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable],
        }
      }
    },
    changeTabFormData(fieldsIndex,tabKey,childrenIndex){
      // this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.edit = true;
      if (this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.tag === "el-upload") {
        //上传控件默认文件上传字段
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.defaultValue = "";
      }
      if (
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.__info__ === true &&
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.__type__ === "info"
      ) {
        //信息体 赋值
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.tag = "info";
      }
        let formId = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.formId;
        let bindTable = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable;
        let bindTableField = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTableField;
        if(bindTable&&bindTableField){
          let val = this.getFinishVal(this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex]);
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.defaultValue = val;
          this.formValueItem[getFormValueItemKey(formId)] = val;
          if(this.formData[bindTable]&&this.formData[bindTable][bindTableField]){
            this.formData[bindTable][bindTableField] = val;
            this.formOperationObject.formModel[bindTable][bindTableField]=val;
          }
        }
    },
    changeFormData(fieldsIndex) {
      this.formConf.fields[fieldsIndex].__config__.edit = true;
      if (this.formConf.fields[fieldsIndex].__config__.tag === "el-upload") {
        this.formConf.fields[fieldsIndex].__config__.defaultValue = "";//上传控件默认文件上传字段
      }
      if (
        this.formConf.fields[fieldsIndex].__config__.__info__ === true &&
        this.formConf.fields[fieldsIndex].__config__.__type__ === "info"
      ) {
        this.formConf.fields[fieldsIndex].__config__.tag = "info";//信息体 赋值
      }
        let formId = this.formConf.fields[fieldsIndex].__config__.formId;
        let bindTable = this.formConf.fields[fieldsIndex].__config__.bindTable;
        let bindTableField = this.formConf.fields[fieldsIndex].__config__.bindTableField;
        if(bindTable&&bindTableField){
          let val = this.getFinishVal(this.formConf.fields[fieldsIndex]);
          this.formConf.fields[fieldsIndex].__config__.defaultValue = val;
          this.formValueItem[getFormValueItemKey(formId)] = val;
          if(this.formData[bindTable]&&this.formData[bindTable][bindTableField]){
            this.formData[bindTable][bindTableField] = val;
            this.formOperationObject.formModel[bindTable][bindTableField]=val;
          }
        }
    },
    getFinishVal(conf) {
      //优先级顺序： 默认值 =》初始化表单事件 =》（编辑情况下）编辑数据  =》（编辑情况下）编辑表单事件  =》 加载表单事件  =》流程参数赋值
      let configVal = conf.__config__.defaultValue; //默认值
      //编辑
      if (
        conf.__config__.bindTable &&
        conf.__config__.bindTableField &&
        this.formData[conf.__config__.bindTable] &&
        this.formData[conf.__config__.bindTable][
          conf.__config__.bindTableField
        ] != undefined
      ) {
        configVal = this.formData[conf.__config__.bindTable] &&
        this.formData[conf.__config__.bindTable][
          conf.__config__.bindTableField
        ];
      }
      //表单事件
      if (
        (this.isEdit == 1 || this.isEdit == 3) &&
        this.formConf.triggerEventIds.includes(conf.__config__.formId)
      ) {
        let val = this.formConf.triggerEventValue.has(conf.__config__.formId)
          ? this.formConf.triggerEventValue.get(conf.__config__.formId)
          : undefined;
        if (val != undefined) {
          configVal = this.getFormattedValueFromTag(conf,val,configVal);
        }
      }
      //流程参数赋值  非查看模式下
      if(this.isEdit != 2&&
        this.formInfos&&
        this.formInfos.parameter&&
        this.formInfos.parameter[conf.__config__.bindTable]&&
        this.formInfos.parameter[conf.__config__.bindTable][conf.__config__.bindTableField]!=undefined
        ){
          configVal = this.getFormattedValueFromTag(conf,this.formInfos.parameter[conf.__config__.bindTable][conf.__config__.bindTableField],configVal);
        }
      return configVal;
    },
    getFormattedValueFromTag(conf,val,oldValue){//赋值不成功，取上一次的赋值
      let value = undefined;
      let avueType = conf.__config__.avueType;
      if (avueType == "checkbox") {
        if (typeof val == "string" && val.includes(",")) {
          value= val.split(",");
        } else {
          value= [val];
        }
      } else if (
        avueType == "timerange" ||
        avueType == "daterange"
      ) {
        if (typeof val === "string" && val.includes(",")) {
          let dateFormat = null;
          let format = conf["value-format"];
          if (format == "HH:mm:ss") {
            dateFormat = /^(\d{2}):(\d{2}):(\d{2})(,)(\d{2}):(\d{2}):(\d{2})$/;
          } else if (format == "yyyy-MM-dd HH:mm:ss") {
            dateFormat =
              /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(,)(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
          } else if (format == "yyyy-MM") {
            dateFormat = /^(\d{4})-(\d{2})(,)(\d{4})-(\d{2})$/;
          } else if (format == "yyyy-MM-dd") {
            dateFormat = /^(\d{4})-(\d{2})-(\d{2})(,)(\d{4})-(\d{2})-(\d{2})$/;
          }
          if (dateFormat && dateFormat.test(val)) {
            value = val.split(",");
          }
        }
      } else if (avueType == "time" ||avueType == "datetime") {
        if (typeof val === "string") {
          let dateFormat = null;
          let format = conf["value-format"];
          if (format == "HH:mm:ss") {
            dateFormat = /^(\d{2}):(\d{2}):(\d{2})$/;
          } else if (format == "yyyy") {
            dateFormat = /^(\d{4})$/;
          } else if (format == "yyyy-MM") {
            dateFormat = /^(\d{4})-(\d{2})$/;
          } else if (format == "yyyy-MM-dd") {
            dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/;
          }else if (format == "yyyy-MM-dd HH:mm:ss") {
            dateFormat = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
          }
          if (dateFormat && dateFormat.test(val)) {
            value = val;
          }
        }
      } else if (avueType == "cascader") {
        if (typeof val === "string") {
          if (val.includes(",")) {
            value = val.split(",");
          } else {
            value = [val];
          }
        }
      } else if (avueType == "select-area") {
        if (typeof val == "string") {
          if (val.includes(",")) {
            value = val.split(",");
          }
        }
      } else if (avueType == "mutiple-popup") {
        val = val+'';
        if (val&&val.includes(",")) {
          value = val + "".split(",");
        } else {
          value = [val];
        }
      }else if ((conf.type && conf.type == "number")||
        avueType =="number"||
        avueType == "switch"||
        avueType=='rate'||
        avueType=='slider') {
        if (typeof val == "number") {
          value = val;
        }
      }else {
        value= val + "";
      }
      if(value!=undefined){
        return value;
      }else{
         return oldValue;
      }
    },
    setValidator(conf,fieldsIndex) {
      let config = conf.__config__;
      let regList = [];
      let trigger = "change";
      let validatorStr = "default";
      if (this.componentList[config.tag]) {
        trigger = this.componentList[config.tag].rule.trigger
          ? this.componentList[config.tag].rule.trigger
          : "change";
        validatorStr = this.componentList[config.tag].rule.validatorStr
          ? this.componentList[config.tag].rule.validatorStr
          : "default";
      }

      let validator = this.defaultValidator(conf);

      if (validatorStr === "upload") {
        validator = this.uploadValidator(conf);
      } else if (validatorStr === "switch") {
        validator = this.switchValidator(conf);
      } else if (validatorStr === "checkbox") {
        validator = this.checkboxValidator(conf);
      }

      if ((conf.type && conf.type === "number")||config.avueType == "number") {
        validator = this.financialValidator(conf);
      }

      // 时间区间 日期区间 都是数组类型
      if (config.tag == "el-time-picker" && config.avueType == "timerange") {
        validator = this.timerangeValidator(conf);
      }
      if (config.tag == "el-date-picker" && config.avueType == "daterange") {
        validator = this.daterangeValidator(conf);
      }
      if (config.tag == "avue-input-tree") {
        validator = this.organizationTreeValidator(
          conf
        );
      }
      const requiredJson = {
        fieldsIndex: fieldsIndex,
        required: config.required,
        trigger,
        validator,
      };
      regList.push(requiredJson);
      //添加 多选框 最小数量 最大数量
      if (config.tag == "el-checkbox-group") {
        if (conf.min || conf.max) {
          const quantityJson = {
            fieldsIndex: fieldsIndex,
            required: config.required,
            trigger,
            validator: quantityValidator,
          };
          regList.push(quantityJson);
        }
      }
      //添加正则验证
      if (config.regList && config.regList.length > 0) {
        config.regList.forEach((item) => {
          if (item.pattern) {
            regList.push({
              required: true,
              fieldsIndex: fieldsIndex,
              validator: this.patternValidator(
                eval(item.pattern),
                item.message ? item.message : "验证不通过",
                conf
              ),
              trigger: "change",
            });
          }
        });
      }
      this.formOperationObject.formRules[config.bindTableField] = regList;
    },
    defaultValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValue = conf.__config__.defaultValue;
        if (conf.__config__.required) {
          if (conf.__config__.tag == "el-input-number") {
            let ruleMessage = "";
            if (conf.min == undefined && conf.min == undefined) {
              callback();
            } else {
              ruleMessage = `${conf.__config__.label}最小数量为${conf.min}，最大数量为${conf.max}`;
              if (
                typeof defaultValue == "number" &&
                (defaultValue < conf.min || defaultValue > conf.max)
              ) {
                callback(new Error(ruleMessage));
              } else {
                if (conf.min) {
                  ruleMessage = `${conf.__config__.label}最小数量为${conf.min}`;
                  if (
                    typeof defaultValue == "number" &&
                    defaultValue < conf.min
                  ) {
                    callback(new Error(ruleMessage));
                  } else {
                    callback();
                  }
                } else if (conf.max) {
                  ruleMessage = `${conf.__config__.label}最大数量为${conf.max}`;
                  if (
                    typeof defaultValue == "number" &&
                    defaultValue > conf.max
                  ) {
                    callback(new Error(ruleMessage));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }
            }
          } else {
            if (defaultValue) {
              callback();
            } else {
              const msg =
                conf.placeholder === undefined
                  ? `${conf.__config__.label}不能为空`
                  : conf.placeholder;
              callback(new Error(msg));
            }
          }
        } else {
          callback();
        }
      };
    },
    organizationTreeValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValue = conf.__config__.defaultValue;
        if (defaultValue) {
          callback();
        } else {
          const msg = `${conf.__config__.label}不能为空`;
          callback(new Error(" "));
        }
      };
    },
    financialValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValue = conf.__config__.defaultValue;
        const msg =
          conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder;
        if (defaultValue === "") {
          callback(new Error(msg));
        }else{
          callback();
        }
      };
    },

    quantityValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValue = conf.__config__.defaultValue;
        if (conf.readonly) {
          //只读属性
          callback();
        } else {
          let ruleMessage = "";
          if (conf.min && conf.max) {
            ruleMessage = `${conf.__config__.label}最小数量为${conf.min}，最大数量为${conf.max}`;
            if (
              defaultValue &&
              (defaultValue.length < conf.min || defaultValue.length > conf.max)
            ) {
              callback(new Error(ruleMessage));
            } else {
              if (conf.min) {
                ruleMessage = `${conf.__config__.label}最小数量为${conf.min}`;
                if (defaultValue && defaultValue.length < conf.min) {
                  callback(new Error(ruleMessage));
                } else {
                  callback();
                }
              } else if (conf.max) {
                ruleMessage = `${conf.__config__.label}最大数量为${conf.max}`;
                if (defaultValue && defaultValue.length > conf.max) {
                  callback(new Error(ruleMessage));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        }
      };
    },
    patternValidator(pattern, msg, conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValue = conf.__config__.defaultValue;
        if (conf.readonly) {
          //只读属性
          callback();
        }
        if (pattern.test(defaultValue)) {
          callback();
        } else {
          callback(new Error(msg));
        }
      };
    },
    switchValidator(conf) {
      return (rule, value, callback) => {
        callback();
      };
    },
    uploadValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        if (conf.__config__.defaultValue) {
          callback();
        } else {
          const msg =
            (conf.placeholder === undefined
              ? `${conf.__config__.label}不能为空`
              : conf.placeholder) + "必须上传！";
          callback(new Error(msg));
        }
      };
    },
    checkboxValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValueArr = conf.__config__.defaultValue;
        if (defaultValueArr.length === 0) {
          const msg =
            (conf.placeholder === undefined
              ? `${conf.__config__.label}不能为空`
              : conf.placeholder) + "必须填写！";
          callback(new Error(msg));
        } else {
          callback();
        }
      };
    },
    daterangeValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValueArr = conf.__config__.defaultValue;
        const msg =
          (conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder) + "必须填写！";
        if (defaultValueArr && Array.isArray(defaultValueArr)) {
          if (defaultValueArr.length === 0) {
            callback(new Error(msg));
          } else {
            callback();
          }
        } else {
          callback(new Error(msg));
        }
      };
    },
    timerangeValidator(conf) {
      const self = this;
      return (rule, value, callback) => {
        const defaultValueArr = conf.__config__.defaultValue;
        const msg =
          (conf.placeholder === undefined
            ? `${conf.__config__.label}不能为空`
            : conf.placeholder) + "必须填写！";
        if (defaultValueArr && Array.isArray(defaultValueArr)) {
          if (defaultValueArr.length > 0) {
            if (defaultValueArr[0] == "") {
              callback(new Error(msg));
            } else {
              callback();
            }
          } else {
            callback(new Error(msg));
          }
        } else {
          callback(new Error(msg));
        }
      };
    },
  },
};
