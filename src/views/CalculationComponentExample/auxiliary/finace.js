export default {
  methods: {
    getTableItemConfConfig(formId) {
      return this.getFormIdInfo(formId);
    },
    getFormIdInfo(formId) {
      return this.formFieldsMap.has(formId) ? this.formFieldsMap.get(formId) : null;
    },
    getNumberFixed2(number) {
      let splitNum = ("" + number).replace(/(^0*)/g, "").split(".");
      let num = splitNum[0] == "" ? '0' : splitNum[0];
      if (splitNum.length > 1) {
        num += '.';
        let roundNum = 2; //保留两位小数
        for (let i = 0; i < roundNum; i++) {
          num += splitNum[1][i];
        }
      }
      return parseFloat(num);
    },
    setMainFormFinaceData(field, value) {
      if(field){
        this.formData[field] = value;
      }
    },
    getMainFormFinaceData(field) {
      if (field) {
        return this.formData[field];
      }
      else {
        return null;
      }
    },
    getSubTableFinaceData(bindTable) {
      if (bindTable && this[bindTable] && this[bindTable][bindTable] && Array.isArray(this[bindTable][
          bindTable
        ])) {
        return this[bindTable][bindTable];
      }
      else {
        return null;
      }
    },
    setTableComputationalList(bindTable, element) {
      if (bindTable&&this[bindTable] && this[bindTable][bindTable] && this[bindTable][bindTable].length > 0) {
        this[bindTable][bindTable].forEach((ele, subRowIndex) => {
          let defaultValue = this.getComputationalConfigurationValue(element.computationalConfiguration,
            subRowIndex, element.taxRate);
          let field = element.__vModel__;
          if (field && this[bindTable] && this[bindTable][bindTable] && this[bindTable][bindTable][
              subRowIndex
            ] && this[bindTable][bindTable][subRowIndex][field] != undefined) {
            if (defaultValue != 0) {
              this[bindTable][bindTable][subRowIndex][field] = defaultValue;
            }
          }
        });
      }
    },
    setSubRowFieldValue(bindTable, field, subRowIndex,val) {
      let subTableFinaceData = this[bindTable][bindTable];
      if (field && subTableFinaceData && subTableFinaceData[subRowIndex] && subTableFinaceData[subRowIndex][
          field
        ] != undefined) {
          this[bindTable][bindTable][subRowIndex][field] = val;
        }
    },
    getSubRowFieldValue(bindTable, field, subRowIndex) {
      let subTableFinaceData = this.getSubTableFinaceData(bindTable);
      if (field && subTableFinaceData && subTableFinaceData[subRowIndex] && subTableFinaceData[subRowIndex][
          field
        ] != undefined) {
        let val = subTableFinaceData[subRowIndex][field];
        return val;
      }
      else {
        return null;
      }
    },
    // 更新子表
    updateSubTableRelativeComObject(tableformId) {
      if (!tableformId) return;
      let options = this['option' + tableformId];
      if (options.column && Array.isArray(options.column) && options.column.length > 0 && options.column[0]) {
        let bindTable = options.column[0].prop;
        let childrenFormId = options.column[0].finaceFormIdList;
        if (childrenFormId && childrenFormId.length > 0) {
          childrenFormId.forEach((formId) => {
            let element2 = this.getFormIdInfo(formId);
            if (element2&&element2.computationalConfiguration && element2.computationalConfiguration.length > 0) {
              this.setTableComputationalList(bindTable, element2);
            }
            if (element2.relativeComObject && element2.relativeComObject.length > 0) {
             
              this.updateRelativeComObject(formId);
            }
          });
        }
      }
    },
    // 将关联组件全部更新
    updateRelativeComObject(formId,index) {
      let info = this.getFormIdInfo(formId);
      if (info && info.relativeComObject && info.relativeComObject.length > 0) {
        let relativeComObject = new Set([...info.relativeComObject]);
        relativeComObject.forEach((id) => {
          let formIdInfo = this.getFormIdInfo(id);
          if (formIdInfo.parentFormId) {
            this.changeAllDefaultValue();
          }
          if (formIdInfo.computationalConfiguration && formIdInfo.computationalConfiguration.length > 0) {
            if (this.formData[formIdInfo.__vModel__] != undefined) {
              let defaultValue = this.getComputationalConfigurationValue(formIdInfo
                .computationalConfiguration, null, formIdInfo.taxRate);
              this.setMainFormFinaceData(formIdInfo.__vModel__, defaultValue); // 主表
            }else{
              
              let defaultValue = this.getComputationalConfigurationValue(formIdInfo
                .computationalConfiguration, index, formIdInfo.taxRate);
              this.setSubRowFieldValue(formIdInfo.bindTable,formIdInfo.__vModel__,index,defaultValue);
            }
          }
          if (formIdInfo.relativeComObject && formIdInfo.relativeComObject.length > 0) {
            this.updateRelativeComObject(id);
          }
        });
      }
      this.reRenderSubformKey++;
    },
    getComputationalConfigurationValue(computationalConfiguration, subRowIndex = null, taxRate = 0) {
      let formulaStr = "";
      if (computationalConfiguration && computationalConfiguration.length > 0) {
        computationalConfiguration.forEach((item) => {
          if (item.type == "operation") {
            formulaStr += item.name;
          }
          else if (item.type == "taxRate" && taxRate && taxRate >= 0) {
            formulaStr += taxRate * 0.01;
          }
          else {
            let eleValue = 0;
            let formIdInfo = this.getFormIdInfo(item.formId);
            if (subRowIndex!=null) {
              if (formIdInfo && formIdInfo.parentFormId) {
                // 本组件子表中的数据
                let options = this["option" + formIdInfo.parentFormId];
                let bindTable = "";
                if (options && options.column && options.column.length > 0 && options.column[0].prop) {
                  bindTable = options.column[0].prop;
                }
                if (bindTable && formIdInfo && formIdInfo.__vModel__) {
                  let field = formIdInfo.__vModel__;
                  let value = this.getSubRowFieldValue(bindTable, field, subRowIndex);
                  if (value != null) {
                    eleValue = value;
                  }
                }
              }
            }
            if (item.parentFormId) {
              // 其他子表的总和，平均数，最大值，最小值
              let options = this["option" + item.parentFormId];
              let bindTable = "";
              if (options && options.column && options.column.length > 0 && options.column[0].prop) {
                bindTable = options.column[0].prop;
              }
              if (bindTable && formIdInfo && formIdInfo.__vModel__ && item.OperationType) {
                eleValue = this.getSubTableOperationTypeValue(item.OperationType, bindTable, formIdInfo
                  .__vModel__);
              }
            }
            else {
              if (formIdInfo && formIdInfo.parentFormId) {
                // 本组件子表中的数据
                let options = this["option" + formIdInfo.parentFormId];
                let bindTable = "";
                if (options && options.column && options.column.length > 0 && options.column[0].prop) {
                  bindTable = options.column[0].prop;
                }
                if (bindTable && formIdInfo && formIdInfo.__vModel__) {
                  let field = formIdInfo.__vModel__;
                  let value = this.getSubRowFieldValue(bindTable, field, subRowIndex);
                  if (value != null) {
                    eleValue = value;
                  }
                }
              }
              else {
                if (formIdInfo && formIdInfo.__vModel__) {
                  let field = formIdInfo.__vModel__;
                  let value = this.getMainFormFinaceData(field);
                  if (field && value != null) {
                    eleValue = value;
                  }
                }
              }
            }
            formulaStr += eleValue;
          }
        });
      }
      if (formulaStr) {
        let defaultValue = eval(formulaStr) * 10000;
        defaultValue = this.getNumberFixed2(defaultValue) / 10000;
        return defaultValue;
      }
      else {
        return 0;
      }
    },
    getSubTableOperationTypeValue(type, bindTable, field) {
      let arr = [];
      let subTableFinaceData = this.getSubTableFinaceData(bindTable);
      if (type && bindTable && field && subTableFinaceData) {
        arr = subTableFinaceData.map((ele) => {
          return ele[field] ? typeof ele[field] === "number" ? ele[field] : 0 : 0;
        });
        if (arr.length > 0) {
          if (type == "sum") {
            return arr.reduce(function(a, b) {
              return a + b;
            });
          }
          else if (type == "average") {
            let average = 0;
            let sum = arr.reduce(function(a, b) {
              return a + b;
            });
            if (sum > 0) {
              average = sum / arr.length;
            }
            return average;
          }
          else if (type == "MaximumValue") {
            return arr.reduce((t, v) => (t > v ? t : v));
          }
          else if (type == "minimumValue") {
            return arr.reduce((t, v) => (t < v ? t : v));
          }
        }
      }
      return 0;
    },
    changeAllDefaultValue(subRowIndex = null) {
      if(this.formConfig&&this.formConfig.fields&&this.formConfig.fields.length>0){
        this.formConfig.fields.forEach((ele, index) => {
          if (ele.__config__.componentName == "table") {
            let tableformId = ele.__config__.formId;
            let options = this['option' + tableformId];
            let bindTable = options.column[0].prop;
            ele.__config__.children.forEach((element, childrenIndex) => {
              if (element.computationalConfiguration && element.computationalConfiguration.length > 0) {
                this.setTableComputationalList(bindTable, element);
              }
            });
          }
          else if (ele.__config__.componentName && ele.__config__.componentName == "avue-tabs") {
            for (let key in ele.__config__.childrenObj) {
              ele.__config__.childrenObj[key].map((item, tabIndex) => {
                if (item.__config__.componentName == "table") {
                  let tableformId = item.__config__.formId;
                  let options = this['option' + tableformId];
                  let bindTable = options.column[0].prop;
                  item.__config__.children.forEach((element2) => {
                    if (element2&&element2.computationalConfiguration && element2.computationalConfiguration
                      .length > 0) {
                      this.setTableComputationalList(bindTable, element2);
                    }
                  });
                }
                else {
                  if (item.computationalConfiguration && item.computationalConfiguration.length > 0) {
                    let defaultValue = this.getComputationalConfigurationValue(item
                      .computationalConfiguration, subRowIndex, item.taxRate);
                    this.formData[item.__vModel__] = defaultValue;
                  }
                }
              })
            }
          }
          else {
            if (ele.computationalConfiguration && ele.computationalConfiguration.length > 0) {
              let defaultValue = this.getComputationalConfigurationValue(ele.computationalConfiguration,
                subRowIndex, ele.taxRate);
              if (ele.isCapitalized) {
                this.formConfig.fields[index].__config__.capitalizedValue = this.getCapitalizedMethod(
                  defaultValue);
              }
              this.formConfig.fields[index].__config__.defaultValue = defaultValue;
              this.formData[ele.__vModel__] = defaultValue;
            }
          }
        });
        this.reRenderSubformKey++;
      }
    },
    changeTableFinaceData(val) {
      let {
        index,
        formId,
      } = val;
      let info = this.formFieldsMap.has(formId) ? this.formFieldsMap.get(formId) : null;
      if (info) {
        this.updateRelativeComObject(formId,index);
        this.changeAllDefaultValue(index);
      }
    },
  },
};
