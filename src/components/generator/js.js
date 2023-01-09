import {
  exportDefault,
  titleCase,
  deepClone
} from '@/utils/index';
import ruleTrigger from './ruleTrigger';
import {
  baseUrl
} from '@/config/env';
import { formValidateNotice } from '@/util/util';
import {
  SUBMIT_REPLACE_STRING,
  CREATEED_REPLACE_STRING,
  MESSAGE_REPLACE_STRING,
} from '@/util/buildCodeConst.js';


const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
};
let confGlobal;
const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
};

let parentTable = '', //主表
  childTable = [], //子表
  formatStr = '', //数据格式化
  infoStr = ``; // 组织机构 信息体 组件
let hasTableMutiplPpopup = false;
let hasTableAssoPpopup = false;
let hasApiOptions = false;//子表单中是否包含使用api的组件
let hasTreeLoad = false;
/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
  confGlobal = formConfig = deepClone(formConfig);
  //用于清空上一次生成的
  infoStr = formatStr = ``;
  childTable = [];
  confGlobal.fields.forEach(item => {
    //如果所提交的数据 是数组  需要 重新格式化一下数据
    formatSpecialVal(item);
    if (item.__config__.layout === 'rowFormItem' && item.__config__.componentName === 'table') {
      childTable.push(item.__config__.bindTable ? item.__config__.bindTable : 'childTable' + item.__config__.formId);

      if (item.__config__.children && item.__config__.children.length > 0) {
        item.__config__.children.forEach(ele => {
          //是否有联想组件
          if (ele && ele.__config__ && ele.__config__.avueType) {
            if (ele.__config__.tag == "el-radio-group" ||
              ele.__config__.tag == "el-checkbox-group" ||
              ele.__config__.tag == "el-select" ||
              ele.__config__.tag == "el-mutiple-input") {
              if (ele.__config__.avueType == 'mutiple-popup') {
                hasTableMutiplPpopup = true;
              } else if (ele.__config__.avueType == 'asso-popup') {
                hasTableAssoPpopup = true;
              } else if (ele.__config__.avueType == 'asso-select') {
                hasTableAssoPpopup = true;
              }
              if (ele.__config__.apiConfig && ele.__config__.apiConfig.url) {
                hasApiOptions = true;
              }
            }
            if (ele.__config__.avueType === 'load-tree') {
              hasTreeLoad = true
            }
          }
        });
      }
    }
    else if (item.__config__.tag == 'h2' || item.__config__.tag == 'el-divider' || item.__config__.tag == 'xjr-opinion-comonent') {

    } else {
      if (item?.__config__?.componentName && item?.__config__?.componentName == 'avue-tabs') {
        let childrenObj = item?.__config__?.childrenObj;
        //如果tabs有子表单  记录子表单 表名信息
        for (let key in childrenObj) {
          let children = childrenObj[key];
          children.map(el => {
            if (el?.__config__?.componentName == 'table') {
              childTable.push(el.__config__.bindTable ? el.__config__.bindTable : 'childTable' + el.__config__.formId);

              if (el.__config__.children && el.__config__.children.length > 0) {
                el.__config__.children.forEach(ele2 => {

                  //是否有联想组件
                  if (ele2 && ele2.__config__ && ele2.__config__.avueType) {
                    if (ele2.__config__.tag == "el-radio-group" ||
                      ele2.__config__.tag == "el-checkbox-group" ||
                      ele2.__config__.tag == "el-select" ||
                      ele2.__config__.tag == "el-mutiple-input") {
                      if (ele2.__config__.apiConfig && ele2.__config__.apiConfig.url) {
                        hasApiOptions = true;
                      }
                      if (ele2.__config__.avueType == 'mutiple-popup') {
                        hasTableMutiplPpopup = true;
                      } else if (ele2.__config__.avueType == 'asso-popup') {
                        hasTableAssoPpopup = true;
                      } else if (ele2.__config__.avueType == 'asso-select') {
                        hasTableAssoPpopup = true;
                      }
                    }
                    if (ele2.__config__.avueType === 'load-tree') {
                      hasTreeLoad = true
                    }
                  }
                });

              }

            } else if (el.__config__.bindTable) {
              parentTable = el.__config__.bindTable;
            }
          });
        }
      } else {
        if (item.__config__.bindTable) {
          parentTable = item.__config__.bindTable;
        }
      }
    }
  });
  //去重
  childTable = Array.from(new Set(childTable));

  const dataList = [];
  const ruleList = [];
  const optionsList = [];
  const propsList = [];
  const dicList = [];
  const methodList = mixinMethod(type);
  const uploadVarList = [];
  const created = [];
  var watchStr = '';
  var computedStr = '';
  const extendData = [];
  watchStr = buildWatch(formConfig, watchStr);
  computedStr = buildComputed(formConfig, computedStr);
  //校验是否有财务组件 有加载相关处理函数
  let financeCom = haveFinanceCom(formConfig.fields);
  let isCapitalized = haveCapitalized(formConfig.fields);

  formConfig.fields.forEach(el => {
    if (financeCom) {
      if (isCapitalized) {
        methodList.push(buildCapitalizedMethod(el, formConfig.fields));
      }
      methodList.push(buildChangeDefaultValMethod(el));
      financeCom = false;
    }
    buildAttributes(formConfig, el, dataList, ruleList, optionsList, methodList, propsList, dicList, uploadVarList, created, watchStr, computedStr, extendData);
  });

  const script = buildexport(
    formConfig,
    type,
    dataList.join('\n'),
    ruleList.join('\n'),
    optionsList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    dicList.join('\n'),
    methodList.join('\n'),
    created.join('\n'),
    watchStr,
    computedStr,
    extendData.join('\n')
  );
  confGlobal = null;
  return script;
}
function formatSpecialVal(item) {
  if (item?.__config__?.componentName == 'avue-tabs') {
    let childrenObj = item?.__config__?.childrenObj || null;
    if (!childrenObj) return;
    for (let key in childrenObj) {
      let children = childrenObj[key];
      if (children && children.length) {
        children.map(el => {
          formatSpecialVal(el);
        });
      }
    }
    return;
  }
  if (
    (item.__config__.tag === 'el-checkbox-group' &&
      item.__config__.avueType === 'checkbox') ||
    (item.__config__.tag === 'el-time-picker' &&
      item.__config__.avueType === 'timerange') ||
    (item.__config__.tag === 'el-date-picker' &&
      item.__config__.avueType === 'daterange') ||
    item.__config__.avueType === 'cascader'
  ) {
    formatStr += ` 
    if(this.formData.${item.__config__.bindTableField} instanceof Array)
       this.formData.${item.__config__.bindTableField} = this.formData.${item.__config__.bindTableField}.join(',')
    `;
  } else {
    if (item.__config__.componentName === 'table') {
      //如果有下级   比如子组件里面又
      if (item.__config__.children) {
        formatStr += childFormatString(item.__config__.bindTable, item.__config__.children, item.__config__.formId);
        let tableName = item.__config__.bindTable ? item.__config__.bindTable : 'childTable' + item.__config__.formId;;
      }
    }
  }
}
function buildWatch(conf, watchStr) {
  let funcRunStr = '';
  let NumberFields = []
  conf.fields.forEach((item) => {
    if (item?.__config__?.componentName == 'avue-tabs') {
      NumberFields.push(...getNumberFieldsByTabs(item?.__config__?.childrenObj));
    } else {
      if (item.type == 'number' || item.__config__.avueType == 'number') {
        NumberFields.push(item.__vModel__);
      }
    }
  });
  funcRunStr = `function(val,oldVal){
                 this.changeFormConfigDefaultValue();
                }`

  NumberFields.forEach((item) => {
    watchStr += `'${conf.formModel}.${item}': ${funcRunStr},`;
  });
  return watchStr;
}
function buildComputed(conf, computedStr) {
  conf.fields.forEach((item) => {
    if (item.__config__.componentName == 'avue-tabs') {
      let childrenObj = item.__config__.childrenObj || [];
      for (let key in childrenObj) {
        let value = childrenObj[key];
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(ele1 => {
            if (ele1.__config__.componentName && ele1.__config__.componentName == 'table') {
              computedStr += buildTableOption('选项卡', ele1.__config__);
            }
          });
        }
      }
    } else if (item.__config__.componentName === 'table') {
      computedStr += buildTableOption('子表单', item.__config__);
    }
  });
  return computedStr;
}
/*收集avue-tabs 里的 子元素 vModel值*/
function getNumberFieldsByTabs(childrenObj) {
  let _arr = [];
  if (!childrenObj || !(childrenObj instanceof Object)) return;
  for (let key in childrenObj) {
    let children = childrenObj[key];
    children.map(item => {
      if (item.__config__.componentName == 'table') {
        //子表单 
      } else {
        if (item.type == 'number' || item.__config__.avueType == 'number') {
          _arr.push(item.__vModel__);
        }
      }
    });
  }
  return (() => { return _arr; })()
}
// 构建组件属性
function buildAttributes(formConf, scheme, dataList, ruleList, optionsList, methodList, propsList, dicList, uploadVarList, created, watchStr, computedStr, extendData) {
  const config = scheme.__config__;
  const slot = scheme.__slot__;
  if (config.tag == 'el-upload') {
    let disabled = scheme.disabled;
    let { accept, multiple, showTip, fileSize, sizeUnit, buttonText } = config;
    let uploadConfig = { accept, multiple, showTip, fileSize, sizeUnit, buttonText, disabled };
    optionsList.push(`${scheme.__vModel__}Config: ${JSON.stringify(uploadConfig)},`)
  }

  buildData(scheme, dataList);
  buildCapitalizedData(scheme, optionsList);
  buildRules(scheme, ruleList);
  //如果是表格组件
  if (scheme?.__config__?.layout === 'rowFormItem' && scheme?.__config__?.componentName === 'table') {
    optionsList.push(buildTableConfig(scheme.__config__));
    //子表单是否有预加载配置 有的话 进行预加载代码处理
    if (scheme?.__config__?.dataType) {
      let methodName = 'preloadData' + scheme.__config__.formId;
      buildTablePreloadMethod(methodName, methodList, scheme);
      callInPreloadDataCreated(methodName, created, scheme.__config__);

    }
  } else {
    if (scheme.__config__.tag == 'avue-information-body') {
      return;
    }
    // 特殊处理options属性
    const model = `${scheme.__vModel__}Options`;
    // const options = titleCase(model);
    const options = 'Field' + scheme.__config__.formId + 'Options';
    const methodName = `get${options}`;
    const loadingName = `${options}Loading`;
    const handlerModel = `${scheme.__vModel__}`;
    const handlerOptions = titleCase(handlerModel);
    const handlerName = `handlerSelect${scheme.__vModel__}`;
    const handlerClickName = `handlerClick${handlerOptions}`;
    const props = `${scheme.__vModel__}Props`;

    if (scheme?.__config__?.layout === 'rowFormItem' && scheme?.__config__?.componentName === 'avue-tabs') {
      optionsList.push(buildTableConfig(scheme.__config__));
      // const tabMethodName = `handleTabsClick${scheme.__config__.formId}`;
      // buildTabsHandleClickMethod(tabMethodName, methodList, scheme);
      let childrenObj = scheme?.__config__?.childrenObj || {};
      for (let key in childrenObj) {
        let children = childrenObj[key];
        children.map(item => {
          buildAttributes(formConf, item, dataList, ruleList, optionsList, methodList, propsList, dicList, uploadVarList, created, watchStr, computedStr, extendData);
        });
      }
      return;
    }

    //添加默认方法  联想弹窗组件 默认在文档里注册
    if (config.avueType == "asso-popup") {
      buildSetModelValue(methodList)
      buildFilterableCallBack(formConf, methodList, extendData);
    }
    if (config.avueType == "mutiple-popup") buildMutipleDiologData(formConf, methodList, extendData)
    //
    if (scheme.options || (slot && slot.options && slot.options.length) || scheme.__organize__) {
      buildOptions(scheme, optionsList);
      if (config.dataType === 'dynamic') {
        buildOptionMethod(methodName, model, methodList, scheme);
        callInCreated(methodName, created);
      }
    }

    // 特殊处理数据源处理属性
    if (config?.dataType === 'dataSource' || config?.dataType == 'dataSql') {
      //自动补全框与普通数据源输入框 分开处理
      if (config.filterable) {
        //是否是联想弹窗
        if (!config.openDialog) {
          buildAutoCompleteOptionMethod(methodName, loadingName, model, methodList, scheme);
          buildAutoCompleteHandlerSelect(formConf, handlerName, model, methodList, scheme);
          buildSetModelValue(methodList)
        } else {
          buildAutoCompleteHandlerClick(methodList, config.avueType);
          buildAutoCompleteGetData(methodList, config.avueType)
        }
      } else {
        buildOptionMethod(methodName, model, methodList, scheme);
      }
      callInCreated(methodName, created);
    }
    // 特殊处理dic属性
    if (config.dataType === 'dataItem') {
      buildDicMethod(methodName, model, methodList, scheme);
      callInCreated(methodName, created);
      if (config.filterable) {
        //是否有弹层
        if (!config.openDialog) {
          buildAutoCompleteHandlerSelect(formConf, handlerName, model, methodList, scheme);
          buildSetModelValue(methodList)
        } else {
          buildAutoCompleteHandlerClick(methodList, config.avueType);
          buildAutoCompleteGetData(methodList, config.avueType)
        }
      }
    }
    if (config.dataType === 'dataApi') {
      buildDicApiMethod(methodName, model, methodList, scheme);
      callInCreated(methodName, created);
      if (config.filterable) {
        //是否有弹层
        if (!config.openDialog) {
          buildAutoCompleteHandlerSelect(formConf, handlerName, model, methodList, scheme);
          buildSetModelValue(methodList)
        } else {
          buildAutoCompleteHandlerClick(methodList, config.avueType);
          buildAutoCompleteGetData(methodList, config.avueType)
        }
      }
    }
    //
    if (config.tag === 'avue-custom-button') {
      buildButtonApiMethod(methodName, model, methodList, scheme);
    }
    //自动编码框  特殊处理
    if (config.avueType === 'autoCode') {
      buildAutoCodeMethod(formConf, methodName, model, methodList, scheme);
      callAutoCodeInCreated(methodName, created);
    }

    //处理是否 组织架构组件
    if (scheme.__organize__) {
      if (scheme.__type__ === 'company' || scheme.__type__ === 'department') return
      if (scheme.__type__ !== `info`) {
        if (scheme.__organizeOptions__[0].value !== 'user')
          callInCreated(methodName, created);
      }
    }

    // 处理props
    if (config.tag == 'xjr-cascader') {
      buildProps(props, scheme, propsList);
    }

    // 构建子级组件属性
    if (config.children && config.componentName == 'table') {
      config.children.forEach(item => {
        buildAttributes(formConf, item, dataList, ruleList, optionsList, methodList, propsList, dicList, uploadVarList, created, watchStr, computedStr, extendData);
      });
    }
  }
}
function buildProps(props, scheme, propsList) {
  //yyp
  let str = `${scheme.__vModel__}settings:${JSON.stringify(scheme.__config__.settings)},`
  propsList.push(str)
}
// function buildTabsHandleClickMethod (methodName,methodList,scheme) {
//   const config = scheme.__config__;
//   const str = `${methodName}(column) {
//     console.log(column);
//   },`;
//   let result = methodList.indexOf(str);
//   if (result !== -1) return;
//   methodList.push(str);
// }
function buildTableConfig(config) {
  if (config.componentName == 'avue-tabs') {
    let childrenObj = config.childrenObj || [];
    let optionStr = "";
    for (let key in childrenObj) {
      let value = childrenObj[key];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(ele1 => {
          if (ele1.__config__.componentName && ele1.__config__.componentName == 'table') {
            optionStr = `option${config.formId}: ${JSON.stringify(ele1.__config__.option)},`;
          }
        });
      }
    }
    return `
      tabsValue${config.formId}: 'tab1',
      ${optionStr}
    `;
  } else if (config.componentName === 'table') {
    let bindTable = config.bindTable || 'childTable' + config.formId;
    let preloadLoading = 'preloadLoading' + config.formId;
    let str = '';
    if (config.isSelectData) {
      str += `selectTableData${config.formId}: true,
			avueFormData${config.formId}:{},
			selectTableDataVisible${config.formId}:false,`
    }

    return `
    ${bindTable} : {},
    ${preloadLoading}: false,
		${str}		
    `;
  }
}
function buildTableOption(name, config) {
  let allStr = '[';
  let bindTable = config.bindTable || 'childTable' + config.formId;
  let doneData = {};
  config?.children.forEach(element => {
    if (element.__config__.defaultValue && element.__vModel__) {
      if (element.__config__.tag == 'avue-information-body') {

      } else {
        doneData[element.__vModel__] = element.__config__.defaultValue;
      }
    }
    let width = null;
    if (element && element.style && element.style.width) {
      if (element.style.width == '100%') {
        width = null;
      } else {
        width = "'" + element.style.width + "'";
      }
    }
    // placeholder
    let placeholderStr = element.placeholder ? element.placeholder : " ";
    let valueStr = element.__config__.defaultValue ? element.__config__.value : "''";
    if (element.__config__.tag == 'el-input-number') {
      valueStr = element.__config__.defaultValue ? element.__config__.value : 0;
    }
    //财务组件默认值
    if (element && element.type && element.type == 'number') {
      if (element.__config__.defaultValue === "") {
        valueStr = "''";
      } else {
        valueStr = element.__config__.defaultValue ? element.__config__.defaultValue : 0;
      }
    }
    let jsonStr = '{';
    //数据源 或者 数据字典
    if (element.__config__.dataType) {
      //如果是数据源绑定类型 就用数据源的json格式
      if (element.__config__.dataType == 'dataSource' && element.__config__.dataSource) {
        jsonStr += `
            label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
            type : '${element.__config__.avueType}',
            width : ${width},
            placeholder:'${placeholderStr}',
            prop : '${element.__vModel__}',  
            value:${valueStr},           
            props : { 
              label : '${element.__config__.showField}',
              value : '${element.__config__.saveField}'
            },
            dicUrl:'${baseUrl}/data-sources/${element.__config__.dataSource}/data',
            
          `;
      } else if (element.__config__.dataType == 'dataItem' && element.__config__.dataItem) {
        jsonStr += `
         label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
          type : '${element.__config__.avueType}',
          width : ${width},
          placeholder:'${placeholderStr}',
          prop : '${element.__vModel__}',
          value:${valueStr}, 
          props : { 
            label : 'F_ItemName',
            value : 'F_ItemValue'
          },
          dicUrl: '${baseUrl}/data-items/${element.__config__.dataItem}/detail',
        `;
      } else if (element.__config__.dataType == 'dataApi') {
        jsonStr += `
         label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
          type : '${element.__config__.avueType}',
          width : ${width},
          placeholder:'${placeholderStr}',
          prop : '${element.__vModel__}',
          value:${valueStr}, 
          props : { 
            label : '${(element.__config__.apiConfig && element.__config__.apiConfig.showField) ? element.__config__.apiConfig.showField : 'label'}',
            value : '${(element.__config__.apiConfig && element.__config__.apiConfig.saveField) ? element.__config__.apiConfig.saveField : ''}'
          },
          dicData:this.${element.__vModel__}${element.__config__.formId}tableChildDicData,
        `;
      }
    } else if (element.__config__.tag == 'xjr-select-user') {
      jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
        prop : '${element.__vModel__}',
        value:${valueStr}, 
        type : 'select-user',
        width : ${width},
        placeholder:'${placeholderStr}',
      `;
    } else if (element.__config__.tag == 'avue-load-tree') {
      let type = "input-tree";
      let tagIcon = element.__config__.tagIcon;
      if (tagIcon == "company") {
        jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
         type : '${type}',
         width : ${width},
         placeholder:'${placeholderStr}',
         prop : '${element.__vModel__}',
         value:${valueStr}, 
         props : { 
           label : 'F_FullName',
           value : 'F_CompanyId'
         },
        //  dicUrl: '${baseUrl}/companies/tree',
       `;
      } else if (tagIcon == "department") {
        jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
        type : '${type}',
        width : ${width},
        placeholder:'${placeholderStr}',
        prop : '${element.__vModel__}',
        value:${valueStr}, 
        props : { 
          label : 'F_FullName',
          value : 'F_DepartmentId'
        },
        // dicUrl: '${baseUrl}/companies/departments/tree',
      `;
      }
    } else if (element.__config__.tag == 'el-time-picker') {
      let format = element.format ? element.format : "";
      let valueFormat = element['value-format'] ? element['value-format'] : "";
      jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
        prop : '${element.__vModel__}',
        value:${valueStr}, 
        type : '${element.__config__.avueType}',
        width : ${width},
        placeholder:'${placeholderStr}',
        'value-format':'${valueFormat}',
        format:'${format}',
      `;
    } else if (element.__config__.tag == 'el-date-picker') {
      let format = element.format ? element.format : "";
      let valueFormat = element['value-format'] ? element['value-format'] : "";
      jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
        prop : '${element.__vModel__}',
        value:${valueStr}, 
        type : '${element.__config__.avueType}',
        width : ${width},
        placeholder:'${placeholderStr}',
        'value-format':'${valueFormat}',
        format:'${format}',
      `;
    } else if (element.__config__.tag == 'el-cascader') {
      // jsonStr += `
      //   label : this.$t('${element.__config__.F_LgMarkCode ?? element.__config__.label}'),
      //   prop : '${element.__vModel__}',
      //     value:${valueStr}, 
      //   type : '${element.__config__.avueType}',
      //     width : ${width},
      //     placeholder:'${placeholderStr}',
      //   lazy: true,
      //   lazyLoad(node, resolve) {
      // 	  const {
      // 		level,
      // 		value
      // 	  } = node;
      // 	  const settings = ${JSON.stringify(element.__config__.settings)}
      // 	  _this.changeCascaderData(settings,level,value,resolve)
      // 	}
      // `;
    } else if (element.__config__.tag == 'el-switch') {
      jsonStr += `
    label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
    prop : '${element.__vModel__}',
    value:${element.__config__.defaultValue}, 
    type : '${element.__config__.avueType}',
    width : ${width},
    placeholder:'${placeholderStr}',
    dicData: [{
                  label: '',
                  value: ${element['inactive-value']}
                }, {
                  label: '',
                  value: ${element['active-value']}
                }],
    'active-color':'${element['active-color']}',
    'inactive-color':'${element['inactive-color']}',
    'active-value':${element['active-value']},
    'inactive-value':${element['inactive-value']},
  `;
    } else if (element.__config__.tag == 'avue-information-body') {
      jsonStr += `
    label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
    prop : '${element.__vModel__}',
    value:'${element.__config__.defaultValue}', 
    type : '${element.__config__.avueType}',
    width : ${width},
    placeholder:'${placeholderStr}',
    infoType:'${element.infoType}',
    operationVal:this.operationVal,
    whetherToRebindSecondaryEditing:${element.__config__.whetherToRebindSecondaryEditing},
  `;
    } else {
      jsonStr += `
        label : this.$t('${element.__config__.F_LgMarkCode || element.__config__.label}'),
        prop : '${element.__vModel__}',
        value:${valueStr}, 
        type : '${element.__config__.avueType}',
        width : ${width},
        placeholder:'${placeholderStr}',
      `;
    }
    let formslot = false;
    if (element.__config__.avueType == 'asso-select' || element.__config__.avueType == 'asso-popup' || element.__config__.avueType == 'mutiple-popup' || element.__config__.avueType == 'load-tree') {
      formslot = true;
    }
    let rulesStr = '';
    let ruletableListStr = '';
    let rules = [];
    let ruletableList = [];

    // if(element.__config__.tag=='el-time-picker'&&element.__config__.avueType=="timerange"){
    //   ruletableListStr  += `{
    //     required:true, message:'${element.__config__.label+'不能为空'}',  type: 'array',trigger: 'change'
    //   }, {
    //     validator: (rule, value, callback) => {
    //       if (Array.isArray(value)) {
    //         if(value.length > 0){
    //           if(value[0]==""){
    //                callback(new Error('${element.__config__.label+'不能为空'}'));
    //           }else{
    //              callback();
    //           }
    //         }else{
    //           callback(new Error('${element.__config__.label+'不能为空'}'));
    //         }

    //       }else{
    //         callback(new Error('时间范围不能为空'));
    //      }
    //       callback();
    //     },
    //     message: '${element.__config__.label+'不能为空'}',
    //     trigger: 'change'
    //   },`;
    // }else{
    ruletableListStr += `{
      required:true, message:'${element.__config__.label + '不能为空'}'
    },`;
    //}


    if (element.__config__.regList && element.__config__.regList.length > 0) {
      element.__config__.regList.forEach(item => {
        if (item.pattern) {
          ruletableListStr += `{
          pattern: ${item.pattern},
          message : ${item.message ? item.message : (element.__config__.label + "验证不通过")},
          trigger: "change"
        },`;
        }
      });
    }
    if (element.__config__.required) {
      rulesStr = ruletableListStr;
    }
    let disabledStr = false;
    if (element.disabled) {
      disabledStr = true;
    }
    jsonStr += `required:${element.__config__.required},`;
    jsonStr += `formslot:${formslot},`;
    jsonStr += `disabled:this.disabled?this.disabled:${disabledStr},rules: [${rulesStr}],
  ruleList:[${ruletableListStr}],},`;
    allStr += jsonStr;
  });
  allStr += ']';
  const tableOptionString = `
  option${config.formId}(){
    return {
    submitBtn :false,
    emptyBtn : false,
    labelWidth: 100,
    disabled: this.disabled,
    column: [
      {
        label: '${config.showLabel ? config.componentTitle : ""}',
        prop: '${bindTable}', 
        type: 'dynamic',
        span:24,
        children: {
          align: 'center',
          headerAlign: 'center',
          rowAdd:(done)=>{
            // this.$message.success('新增回调');
              done(${JSON.stringify(doneData)});
          },
          rowDel:(row,done)=>{
            this.reRenderSubform = false;//更新组件 index
            setTimeout(() => {
            // this.$message.success('删除回调'+JSON.stringify(row));
                this.reRenderSubform = true;
            }, 0);
            done();
          },
          column: this.getAuthorityTableChildrenList('${bindTable}',${allStr})
        }
      },
    ],
  }
}, 
  `;
  //prop 需要修改为所绑定子表名
  const optionString = tableOptionString;
  return optionString;
}
// 在Created调用函数
function callInCreated(methodName, created) {
  let result = created.indexOf(` await  this.${methodName}()`);
  if (result !== -1) return;
  created.push(` if(typeof this.${methodName} == "function" ) {await  this.${methodName}();}`);
}
function callAutoCodeInCreated(methodName, created) {
  let result = created.indexOf(` await  this.${methodName}()`);
  if (result !== -1) return;
  created.push(` if(typeof this.${methodName} == "function"&&this.operationVal == 'add' ) {await  this.${methodName}();}`);
}
function callInPreloadDataCreated(methodName, created, config) {
  if (config.isSelectData) {
    let result = created.indexOf(`if(this.isAdd){if(!this.selectTableData${config.formId}) await  this.${methodName}()}`);
    if (result !== -1) return;
    created.push(`if(this.isAdd){if(!this.selectTableData${config.formId}) await  this.${methodName}()}`);
  } else {
    let result = created.indexOf(`if(this.isAdd){ await  this.${methodName}()}`);
    if (result !== -1) return;
    created.push(`if(this.isAdd){ await  this.${methodName}()}`);
  }

}
// 混入处理函数
function mixinMethod(type) {
  let childStr = '';
  let tableValidateStr = '';
  //拼凑格式化数据  子表字符串
  childTable.forEach(it => {
    if (it) {
      childStr += `
      ${it}EntityList : this.${it}.${it},
    `;
      tableValidateStr += ` if (this.${it}.${it} && this.${it}.${it}.length > 0) {
        validataArry.push(new Promise((resolve,reject) => {
        
          this.$refs['avueTable${it}'].validate(valid => {
            resolve(valid)
          });

        }));
      }`
    }
  });
  const list = [];
  const minxins = {
    file: confGlobal.formBtns ? {
      getFormData: `getFormData() {
        let key = this.mainTableName+'Entity';
        let returnParams = {};
        returnParams[key]= this.formData;
        ${infoStr}
        return {
         ...returnParams,
          ${childStr}
        };
      },`,
      submitForm: `
      validateForm(){
        this.$refs['elForm'].validate(valid => {});
      },
      async aysncValidateForm(){
        let validataArry = []
        let formValidateNotice=${formValidateNotice}
        ${tableValidateStr}
        validataArry.push(new Promise((resolve,reject) => {
          this.$refs['${confGlobal.formRef}'].validate((valid,object) => {
		      if(!this.isWorkflowForm) formValidateNotice(object, this, this.formEnCodeList)
		      resolve(valid)
		  })
        }))
        let res = await Promise.all(validataArry)
        if (res.includes(false)) {
          return false
        }else{
          return true;
        }
      },
      changeTableData(){
        ${formatStr}
      },
      async submitForm() {
        this.submitLoading = true;
        let valid = await this.aysncValidateForm();
        if(valid==false){
            this.submitLoading = false;
            return false;
        }
        this.changeTableData();
          //格式化数据
          let newObj = this.getFormData();
          ${SUBMIT_REPLACE_STRING}
          ${MESSAGE_REPLACE_STRING}
          //FORM_EVENT_SUBMIT
      },`,
      resetForm: `
      cancelForm(){
        this.$emit("onChange",true)
     },
      formatTree(data,valueField,lableField,childField,type){
        let tree = [];

        data.forEach((node,index) => {
            let newNode = {
                value : node[valueField],
                label : node[lableField],
            };
            if(type){
              newNode.disabled = node[valueField]==undefined ? true : false
            }
    
            tree.push(newNode);
            if(node[childField]!= null && node[childField].length > 0){
                newNode.children = (this.formatTree(node[childField],valueField,lableField,childField,type));
            }
        },this);
    
        return tree;
      },
      `
    } : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
      close: `close() {
        this.$emit('update:visible', false)
      },`,
      handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
    },
    workflowSubmit: `workflowSubmit() {
      let returnData = { code: 0, params: {} };
      let formValid = false;
      this.$refs['${confGlobal.formRef}'].validate(valid => {
        if(!valid) formValid = true;
        if (!formValid) {
          return returnData;
        }
        let newObj = this.getFormData();
        returnData.code = 2;
        returnData.params = newObj;
        return returnData;
      })
    },`,
  };

  const methods = minxins[type];
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key]);
    });
  }
  list.push(`//__WORKFLOWFORMHANDLEMETHODS__`);
  list.push(`//FORM_EVENT_EDIT`);
  list.push(`//__SUMIBTHANDLEMETHODS__`);
  return list;
}
// 构建data
function buildData(scheme, dataList) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined || scheme.__vModel__ instanceof Object) return;
  const value = config.defaultValue;
  let defaultValue = JSON.stringify(value);
  if (config.tag == 'avue-information-body') {
    defaultValue = '';
  }
  if (config.tag == 'el-mutiple-input') {
    dataList.push(`'${scheme.__vModel__}_showValue': '',`)
  }
  dataList.push(`'${scheme.__vModel__}': ${defaultValue || '\'\''},`)
}
function addDataByTabs(childrenObj) {
  let _dataArr = [];
  for (let key in childrenObj) {
    let children = childrenObj[key];
    children.map(el => {
      if (el?.__config__?.componentName == 'table') {
        //let _arr = addDataByTabs(el?.__config__?.childrenObj);
        //_dataArr.push(..._arr);
      } else {
        _dataArr.push(`${el.__vModel__}: ${el.__config__.defaultValue || '\'\''},`);
      }
    });
  }

  return (() => { return _dataArr })()
}
// 构建校验规则
function buildRules(scheme, ruleList) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const rules = [];
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = Array.isArray(config.defaultValue) ? 'type: \'array\',' : '';
      let message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder;
      if (message === undefined) message = `${config.label}不能为空`;
      if (config.tag == 'el-time-picker' && config.avueType == "timerange") {
        rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }, {
          validator: (rule, value, callback) => {
            if (Array.isArray(value)) {
              if(value.length > 0){
                if(value[0]==""){
                     callback(new Error('${message}'));
                }else{
                   callback();
                }
              }else{
                callback(new Error('${message}'));
              }
              
            }else{
              callback(new Error('时间范围不能为空'));
           }
            callback();
          },
          message: '${message}',
          trigger: 'change'
        },`);
      } else {
        rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`);
      }

      if (config.tag == 'el-checkbox-group') {
        let ruleMessage = '';
        if (scheme.min && scheme.max) {
          ruleMessage = `${config.label}最小数量为${scheme.min}，最大数量为${scheme.max}`;
          let validator = `(rule, value, callback) => {
            if(Array.isArray(value)){
              if(value.length<${scheme.min}||value.length>${scheme.max}){
                callback(new Error('${ruleMessage}'));
              }
            }
            callback();
          }`
          rules.push(`{validator: ${validator}, message: '${ruleMessage}', trigger: '${ruleTrigger[config.tag]}' }`);
        } else {
          if (scheme.min) {
            ruleMessage = `${config.label}最小数量为${scheme.min}`;
            let validator = `(rule, value, callback) => {
              if(Array.isArray(value)){
                if(value.length<${scheme.min}){
                  callback(new Error('${ruleMessage}'));
                }
              }
              callback();
            }`
            rules.push(`{validator: ${validator}, message: '${ruleMessage}', trigger: '${ruleTrigger[config.tag]}' }`);
          } else if (scheme.max) {
            ruleMessage = `${config.label}最大数量为${scheme.max}`;
            let validator = `(rule, value, callback) => {
              if(Array.isArray(value)){
                if(value.length>${scheme.max}){
                  callback(new Error('${ruleMessage}'));
                }
              }
              callback();
            }`
            rules.push(`{validator: ${validator}, message: '${ruleMessage}', trigger: '${ruleTrigger[config.tag]}' }`);

          }
        }
      }

    }
    if (config.regList && Array.isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern) {
          let message = item.message ? item.message : '验证不通过'
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`
          );
        }
      });
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(',')}],`);

  }
}
// 构建options
function buildOptions(scheme, optionsList) {

  if (scheme.__vModel__ === undefined) return;
  // 判断是数据源  还是数据字典  option push 空  在mounted 里面请求
  if (scheme.__config__.dataType) {
    const str = `${scheme.__vModel__}Options: [],`;
    optionsList.push(str);
    //联想下拉框  需要有loading变量
    if (scheme.__config__.filterable && !scheme.__config__.openDialog) {
      optionsList.push(`${scheme.__vModel__}Loading: false,`);
    }
  } else {
    // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
    let {
      options
    } = scheme;

    if (!options) options = scheme.__slot__?.options;

    if (scheme.__config__.dataType === 'dynamic') {
      options = [];
    }
    const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`;
    optionsList.push(str);
  }
}
// 大写组件数据初始化
function buildCapitalizedData(scheme, optionsList) {
  if (scheme.isCapitalized) {
    optionsList.push(`${scheme.__vModel__}ShowCapitalized: true,`);
  }
}
function buildChangeDefaultValMethod() {
  return `getNumberFixed2(number) {
            let splitNum = ("" + number).replace(/(^0*)/g, "").split(".");
            let num = splitNum[0]==""?'0':splitNum[0];
            if (splitNum.length > 1) {
              num += '.';
              let roundNum = 2;//保留两位小数
              for (let i = 0; i < roundNum; i++){
                num += splitNum[1][i];
              }
            }
            return  parseFloat(num);
          },
          changeFormConfigDefaultValue(){
            let valueForFormIdMap = new Map();

            this.formConfig.fields.forEach((ele) => {
              if (ele.__config__.componentName == "table") {
                ele.__config__.children.forEach((element) => {
                  valueForFormIdMap.set(
                    ele.__config__.formId + "-table-" + element.__config__.formId,
                    element.__config__.defaultValue
                  );
                });
              } else if(ele.__config__.componentName && ele.__config__.componentName == 'avue-tabs'){
                let childrenObj = ele.__config__.childrenObj || {};
                let _arr = this.getValByTabs(childrenObj);
                _arr.map(item=>{
                  valueForFormIdMap.set(
                    item.formId,
                    item.defaultValue
                  );
                });
              } else {
                valueForFormIdMap.set(ele.__config__.formId, this.formData[ele.__vModel__]);
              }
            });
            this.formConfig.fields.forEach((ele, index) => {
              if (ele.__config__.componentName == "table") {
                ele.__config__.children.forEach((element, childrenIndex) => {
                  let defaultValue = 0;
                  if (element.computationalConfiguration&&element.computationalConfiguration.length > 0) {
                    let formulaStr = "";
                    element.computationalConfiguration.forEach((item) => {
                      if (item.type == "taxRate") {
                        //税率
                        if (element.taxRate >= 0) {
                          formulaStr += element.taxRate * 0.01;
                        }
                      } else {
                        let eleValue = valueForFormIdMap.get(item.formId) || 0;
                        formulaStr += item.formId == 0 ? item.name : eleValue;
                      }
                    
                    });
                    defaultValue = eval(formulaStr)*100;
                    defaultValue = this.getNumberFixed2(defaultValue)/100;
                    //大写
                    if( element.isCapitalized){
                      this.formConfig.fields[index].__config__.children[childrenIndex].__config__.capitalizedValue = this.getCapitalizedMethod(defaultValue);
                    }
                    this.formConfig.fields[index].__config__.children[childrenIndex].__config__.defaultValue = defaultValue;
                    this.formData[element.__vModel__] = defaultValue;
                  }
                });
              } else if(ele.__config__.componentName && ele.__config__.componentName == 'avue-tabs'){
                let childrenObj = ele.__config__.childrenObj || {};
                //avue-tabs
                this.calcDefaultValueByTabs(ele.__config__.childrenObj,valueForFormIdMap);
              }  else {
                let defaultValue = 0;
                if (
                  ele.computationalConfiguration &&
                  ele.computationalConfiguration.length > 0
                ) {
                  let formulaStr = "";
                  ele.computationalConfiguration.forEach((item) => {
                    if (item.type == "taxRate") {
                      //税率
                      if (ele.taxRate >= 0) {
                        formulaStr += ele.taxRate * 0.01;
                      }
                    } else {
                      let eleValue = valueForFormIdMap.get(item.formId) || 0;
                      formulaStr += item.formId == 0 ? item.name : eleValue;
                    }
                  });
                  defaultValue = eval(formulaStr)*100;
                  defaultValue = this.getNumberFixed2(defaultValue)/100;
                  //大写
                  if( ele.isCapitalized){
                    this.formConfig.fields[index].__config__.capitalizedValue = this.getCapitalizedMethod(defaultValue);
                  }
                  this.formConfig.fields[index].__config__.defaultValue = defaultValue;
                  this.formData[ele.__vModel__] = defaultValue;
                }
              }
            });            
            },
            getValByTabs(childrenObj){
              let _arr = [];
              if(!childrenObj || !(childrenObj instanceof Object)) return [];
              for(let key in childrenObj){
                let children  = childrenObj[key];
                children.map(item=>{
                  if(item.__config__.componentName && item.__config__.componentName == 'avue-tabs'){
                    let cObj = item.__config__.childrenObj || {};
                    _arr.push(...this.getValByTabs(item.__config__.childrenObj));
                  }else{
                    let _obj = {};
                    _obj.formId = item.__config__.formId;
                    _obj.defaultValue = this.formData[item.__vModel__];
                    _arr.push(_obj);
                  }
                });
              }
              return (()=>{ return _arr; })()
            },
            calcDefaultValueByTabs(childrenObj,valueForFormIdMap){
              if(!childrenObj || !(childrenObj instanceof Object)) return;
              for(let key in childrenObj){
                let children = childrenObj[key];
                children.map(item=>{
                  if(item.__config__.componentName && item.__config__.componentName == 'avue-tabs'){
                    let cObj = item.__config__.childrenObj || {};
                    this.calcDefaultValueByTabs(cObj,valueForFormIdMap);
                  }else{
                      let defaultValue = 0;
                      if (
                        item.computationalConfiguration &&
                        item.computationalConfiguration.length > 0
                      ) {
                        let formulaStr = "";
                        item.computationalConfiguration.forEach((c) => {
                          if (c.type == "taxRate") {
                            //税率
                            if (item.taxRate >= 0) {
                              formulaStr += item.taxRate * 0.01;
                            }
                          } else {
                            let eleValue = valueForFormIdMap.get(c.formId) || 0;
                            formulaStr += c.formId == 0 ? c.name : eleValue;
                          }
                        });
                        defaultValue = eval(formulaStr)*100;
                        defaultValue = this.getNumberFixed2(defaultValue)/100;
                        item.__config__.defaultValue = defaultValue;
                        this.formData[item.__vModel__] = defaultValue;
                    }
                  }
                });
              }
            },`
}
// 转中文大写
function buildCapitalizedMethod() {
  return `getCapitalizedMethod(num){
	if(Object.prototype.toString.call(num)==='[object Number]'){
		if(isNaN(num)||!isFinite(num)) return '零元';
	}
	if((num==''||num==null||num==undefined)&&num!==0) return;
	let plusMinus=''
	if(num<0) plusMinus='负'
	num=Math.abs(num);
    let NUM = new Array(
      "零",
      "壹",
      "贰",
      "叁",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖",
      "拾"
    );
    let UNIT = new Array("", "拾", "佰", "仟", "万", "亿", "元", "");
    let splitNum = ("" + num).replace(/(^0*)/g, "").split("."),
     index = 0,
     numStr = "";
    for (let i = splitNum[0].length - 1; i >= 0; i--) {
      switch (index) {
        case 0:
         numStr = UNIT[7] +numStr;
          break;
        case 4:
          if (!new RegExp("0{4}//d{" + (splitNum[0].length - i - 1) + "}$").test(splitNum[0]))
           numStr = UNIT[4] +numStr;
          break;
        case 8:
         numStr = UNIT[5] +numStr;
          UNIT[7] = UNIT[5];
         index = 0;
          break;
      }
      if (index % 4 == 2 && splitNum[0].charAt(i + 2) != 0 && splitNum[0].charAt(i + 1) == 0)
       numStr = NUM[0] +numStr;
      if (splitNum[0].charAt(i) != 0)numStr = NUM[splitNum[0].charAt(i)] + UNIT[index % 4] +numStr;
     index++;
    }
    if(splitNum[0]==""){
      numStr = NUM[0];
    }
    if (splitNum.length > 1) {
      let UNit2 = ['角','分'];
      let roundNum = 2;
      // 加上小数部分(如果有小数部分)  保留两位小数
     numStr += UNIT[6];
      for (let i = 0; i < roundNum; i++){
        let tempVal = splitNum[1].charAt(i)?splitNum[1].charAt(i):0;
        numStr += NUM[tempVal]+UNit2[i];
      }
    }else{
      numStr += UNIT[6];
    }
    if (numStr == "一十")numStr = "十";
    if (numStr.match(/^一/) &&numStr.length == 3)numStr =numStr.replace("一", "");
   return plusMinus+numStr;
  },`;
}

// 构建数据源 请求方法
function buildOptionMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__;
  let saveField = config.saveField;
  if (config.dataSource) {
    const str = `async ${methodName}() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url: '${baseUrl}/data-sources/${config.dataSource}/data',
        });
        let { data } = resp.data;
        let tempData = [];
        if(data&&data.length>0){
          tempData = data.map(ele=>{
            if('${saveField}'){
              ele['${saveField}']= ele['${saveField}']+'';
            }
            return ele
          });
        }
         this.${model} = tempData   
      } catch (error) {
      }
    },`;
    let result = methodList.indexOf(str);
    if (result !== -1) return;
    methodList.push(str);
  }
}
// 构建自动补全框 联想下拉 数据源请求
function buildAutoCompleteOptionMethod(methodName, loadingName, model, methodList, scheme) {
  const config = scheme.__config__;
  let str = `async ${methodName}(query) {
    // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    let keyword = ' ';
    if(query){
      keyword = query;
    }
    if(query !== ''){
      this.${loadingName} = true;
    }
    try {`;
  if (config.dataType == 'dataSource') {
    str += `
        let resp = await  
        this.$axios({
          method: 'get',
          url: '${baseUrl}/data-sources/${config.dataSource}/data/?field=${config.showField}&keyword='+keyword
        });
        this.${loadingName} = false;
        this.${model} = resp.data.data;`;
  } else {
    let sql = '`' + `${config.sql}` + '`';
    str += `
        let params = {};
        params.sql = ${sql};
        let resp = await  
        this.$axios({
          method: 'get',
          params: params,
          url: '${baseUrl}/database-links/${config.database}/datas'
        });
        this.${loadingName} = false;
        this.${model} = resp.data.data;`
  }
  str += `
      
    } catch (error) {
    }

    
  },`;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
}
function buildSetModelValue(methodList) {
  const str = `setModelValue(fields,autoBindFields,data){
		  fields.map(item=>{
		    if(item.__config__.componentName && item.__config__.componentName == 'avue-tabs'){
		      let childrenObj = item.__config__.childrenObj || {};
		      for(let key in childrenObj){
		        let children = childrenObj[key];
		        this.setModelValue(children,autoBindFields,data);
		      }
		    }else{
				//找到对应formId 元素  key值为存储的对应formId
				if(Object.prototype.toString.call(autoBindFields) === '[object Array]'){
					  autoBindFields.forEach(el=>{
						if(el.component==item.__config__.formId){
						  this.formData[item.__vModel__]= data[el.bindField];
						}
					  })
				}else{
					 if(autoBindFields.hasOwnProperty(item.__config__.formId)){
					   //按绑定的自定义字段赋值
					   this.formData[item.__vModel__] = data[autoBindFields[item.__config__.formId]];
					 } 
				}
		    }
		  });
      //更新表单校验
      // this.validateForm();
		},
	`;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
}
// 联想下拉 数据源回显
function buildAutoCompleteHandlerSelect(formConf, methodName, model, methodList, scheme) {
  const config = scheme.__config__;
  let autoBindFields = config.autoBindFields ? `${config.autoBindFields}` : `[]`;
  let saveField = 'F_ItemValue';
  if (config.dataType == 'dataItem') {
    saveField = 'F_ItemValue';
  } else if (config.dataType == 'dataSource') {
    saveField = config.saveField;
  } else if (config.dataType == 'dataApi') {
    saveField = config.apiConfig.saveField ? config.apiConfig.saveField : 'F_Id';
  }
  const str = `${methodName}(val) {
    let autoBindFields = ${autoBindFields};
    
    let fields = this.formConfig.fields
    let saveField = '${saveField}'

    //得对应数据列
    let data = this.${model}.filter(item=>{
        return item[saveField] == val;
    })[0];

    if(!data){
      return ;
    }
    //数据回显
    this.setModelValue(this.formConfig.fields,autoBindFields,data);
  },
  `;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
}
// 联想弹窗 多选弹层 弹窗打开
function buildAutoCompleteHandlerClick(methodList, type) {
  let field = type == 'mutiple-popup' ? 'mutiple' : 'auto';
  let str = `${field}HandlerClick(conf) {
    if(conf.eventData&&conf.eventData.length>0){
      this.autoCompleteConfEventData = conf.eventData;
    }else{
      this.autoCompleteConfEventData = conf.eventData;
    }
      this.${field}CompleteConf.title = conf.label + '-选择记录';
      this.${field}CompleteConf.model = conf.model;
      this.${field}CompleteConf.formId = conf.formId;
      this.${field}CompleteConf.dataType = conf.dataType;
      switch(conf.dataType){
        case 'dataSource':this.${field}CompleteConf.dataSource = conf.dataSource;
                          this.${field}CompleteConf.tabName = 'base';break;
        case 'dataSql'   :this.${field}CompleteConf.dataSource = conf.database;
                          this.${field}CompleteConf.tabName = 'sql';
                          this.${field}CompleteConf.sqlStr = conf.sql;break;
        case 'dataItem'  :this.${field}CompleteConf.dataSource = conf.dataItem;
                          this.${field}CompleteConf.dataItem = conf.dataItem;
                          this.${field}CompleteConf.fields = ['F_ItemName','F_ItemValue'];break;
        case 'dataApi':this.${field}CompleteConf.apiConfig = conf.apiConfig;
        this.${field}CompleteConf.formFieldsMap = this.formFieldsMap;
        this.${field}CompleteConf.formData = this.formData;
        this.${field}CompleteConf.tabName = 'api';break;
						  conf.showField='F_ItemName';
						  conf.saveField='F_ItemValue';
                          this.${field}CompleteConf.tabName = 'item';break;
      }
      this.${field}CompleteConf.showField = conf.showField;
      this.${field}CompleteConf.saveField = conf.saveField;
      this.${field}CompleteConf.autoBindFields = conf.autoBindFields;
	  this.${field}CompleteConf.defaultValue = this.formData[conf.model];
	  this.${field}CompleteDialogVisible = true;

  },`;

  let result1 = methodList.indexOf(str);
  if (result1 !== -1) return;
  methodList.push(str);
}
// 联想弹窗 多选弹层 数据回显
function buildAutoCompleteGetData(methodList, type) {
  let str = `
  //多选弹层 表单编辑时数据回显处理
  getMutipleAllData(formData,config,model,formId){	
  	let datatype=config.dataType;
  	let saveField = datatype == 'dataItem' ? 'F_ItemValue' : config.saveField
  	let showField = datatype == 'dataItem' ? 'F_ItemName' : config.showField;
  	
  	if(datatype=='dataSource'||datatype=='dataSql') {
    if(config.dataSource){
      this.changeMutipleData(formData,'${baseUrl}/data-sources/'+config.dataSource+'/data',model,saveField,showField)
    }
  	}
  	if(datatype=='dataItem'){
  		this.changeMutipleData(formData,'${baseUrl}/data-items/'+config.dataItem+'/detail',model,saveField,showField)
  	}
    if (datatype == 'dataApi') {
      let config = this.autoHandlerClickConfig(formId);
      if(config.apiConfig){
        this.changeMutipleDataFromApi(config.apiConfig,model);
      }
    }
  },
  autoHandlerClickConfig(formId){
    return this.formFieldsMap.get(formId).__config__.autoHandlerConfig;
  },	
  async changeMutipleDataFromApi(apiConfig,model){
    let url = '${baseUrl}'+apiConfig.url;
      let res = await this.$axios({
        method: 'POST',
        url: url,
        headers:{},
        params:{},
        data: {},
      });
      if (
        res.data.data &&
        apiConfig.dataSource &&
        res.data.data[apiConfig.dataSource].length>0 &&
       apiConfig.saveField
      ) {
          let arr = this.formData[model].split(',');
          let arr1 = [];
          arr.forEach(it => {
            let temp = res.data.data[apiConfig.dataSource].find(o => {
              return o[apiConfig.saveField] == it
            });
            if (temp) {
              arr1.push(temp[apiConfig.showField])
            }
          })
          if (arr1.length > 0) {
            this.formData[model + '_showValue'] = arr1.join(',');
          }
        }
    },
  async changeMutipleData(formData,url,model,saveField,showField){
  	try {
  	   let resp = await this.$axios({
  	    method: 'get',
  	    url: url,
  	  });
  	  if(resp.data.data){
        let arr=formData[model].split(',');
        let arr1=[];
        arr.forEach(it=>{
          let temp=resp.data.data.find(o=>{return o[saveField]==it});
          if(temp){
            arr1.push(temp[showField])
          }
        })
        if(arr1.length>0){
          formData[model + '_showValue'] = arr1.join(',');
        }
  	  }
  	} catch (error) {
  	  
  	}
  },`;

  let result1 = methodList.indexOf(str);
  if (result1 !== -1) return;
  methodList.push(str);
}
// 联想弹窗组件 关闭弹窗 数据回显函数
function buildFilterableCallBack(formConf, methodList, extendData) {
  const str = `filterableCallBack(data) {
    if(!this.autoCompleteConf){
      return false;
    }

    //弹窗关闭前回填数据  如果有选择数据项
    if(data){
      let fields = this.getElements(this.formConfig.fields);
      let autoBindFields = this.autoCompleteConf.autoBindFields?JSON.parse(this.autoCompleteConf.autoBindFields):{};
      let saveField = this.autoCompleteConf.dataType == 'dataItem' ? 'F_ItemValue' : this.autoCompleteConf.saveField;
	  let showField = this.autoCompleteConf.dataType == 'dataItem' ? 'F_ItemName' : this.autoCompleteConf.showField;
      this.setModelValue(this.formConfig.fields,autoBindFields,data);
      //自己赋值
      if(this.autoCompleteConf.dataType == 'dataItem'){
        for(let i = 0;i<fields.length;i++){
          if(fields[i].__config__.formId == this.autoCompleteConf.formId){
            this.${formConf.formModel}[this.autoCompleteConf.model] = data[saveField];
			this.${formConf.formModel}[this.autoCompleteConf.model+'_showValue']=data[showField];
            break;
          }
        }
      }else{
        this.${formConf.formModel}[this.autoCompleteConf.model] = data[saveField];
		this.${formConf.formModel}[this.autoCompleteConf.model+'_showValue']=data[showField];
      }
    }
    if(this.autoCompleteConfEventData&&this.autoCompleteConfEventData.length>0){
      this.triggerEventHandler(this.autoCompleteConfEventData);
    }
    //关闭弹窗
    this.autoCompleteDialogVisible = false;
  },  
  getElements(fields){
    let _arr = [];
    fields.map(item=>{
      if(item.__config__.componentName == 'avue-tabs'){
        let childrenObj = item.__config__.childrenObj || {};
        for(let key in childrenObj){
          _arr.push(...this.getElements(childrenObj[key]));
        }
      }else{
        _arr.push(item);
      }
    });
    return (()=>{ return _arr; })();    
  },`;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
  extendData.push('autoCompleteConf:{},');
  extendData.push('autoCompleteDialogVisible: false,');
}
//多选弹层 关闭弹窗 数据回显
function buildMutipleDiologData(formConf, methodList, extendData) {
  const str = `mutipleFilterableCallBack(data) {
	  if(!this.mutipleCompleteConf){
	    return false;
	  }
	  let saveField = this.mutipleCompleteConf.dataType == 'dataItem' ? 'F_ItemValue' : this.mutipleCompleteConf.saveField
	  let showField = this.mutipleCompleteConf.dataType == 'dataItem' ? 'F_ItemName' : this.mutipleCompleteConf.showField
	  //弹窗关闭前回填数据  如果有选择数据项
	  if (data&&data.length>0) {
		  let arr=[],arr1=[]
		  data.forEach(it=>{
			arr.push(it[showField]);
			arr1.push(it[saveField]);
		  })
		  this.${formConf.formModel}[this.mutipleCompleteConf.model+'_showValue']=arr.join(',');
		  this.${formConf.formModel}[this.mutipleCompleteConf.model] = arr1.join(',');
	  }
    if(this.autoCompleteConfEventData&&this.autoCompleteConfEventData.length>0){
      this.triggerEventHandler(this.autoCompleteConfEventData);
    }
	  //更新表单校验
	  this.$refs['elForm'].validate(valid => {
	    console.log('更新表单校验 valid',valid);
	  })
	  //关闭弹窗
	  this.mutipleCompleteDialogVisible = false;
	},
	`;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
  extendData.push('mutipleCompleteConf:{},');
  extendData.push('mutipleCompleteDialogVisible: false,');

}
// 自动编码 新增时 初始值获取
function buildAutoCodeMethod(formConf, methodName, model, methodList, scheme) {
  const config = scheme.__config__;

  const str = `async ${methodName}() {
    // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    try {
     let resp = await this.$axios({
        method: 'get',
        url: '${baseUrl}/code-rules/${config.autoCodeRule}/gen',
      });
      if(resp.data.data){
        this.${formConf.formModel}.${scheme.__vModel__} = resp.data.data;
      }
    } catch (error) {
      
    }

    
  },`;
  let result = methodList.indexOf(str);
  if (result !== -1) return;
  methodList.push(str);
}

//构建数据字典 请求方法
function buildDicMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__;

  const str = `async ${methodName}() {
    // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    try {
       let resp = await  this.$axios({
        method: 'get',
        url: '${baseUrl}/data-items/${config.dataItem}/detail',
      });
      if(resp.data.data){
        this.${model} = resp.data.data; 
      }
    } catch (error) {
      
    }
  },`;

  // const str = `${methodName}() {
  //   // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
  //   this.$axios({
  //     method: 'get',
  //     url: '${baseUrl}/data-items/${config.dataItem}/detail',
  //   }).then(resp => {
  //     let { data } = resp
  //      this.${model} = this.FormatTree(data.${config.dataKey}, '${data.fieldId}', '${data.fieldName}', '${data.children}');
  //   })
  // },`
  // const strTwo = `FormatTree(data,valueField,lableField,childField){
  //     let tree = [];

  //     data.forEach((node,index) => {
  //         let newNode = {
  //             value : node[valueField],
  //             label : node[lableField],
  //         };

  //         tree.push(newNode);
  //         if(node[childField]!= null && node[childField].length > 0){
  //             newNode.children = (this.FormatTree(node[childField],valueField,lableField,childField));
  //         }
  //     },this);

  //     return tree;
  // },`
  methodList.push(str);
  // if (methodList.includes(strTwo)) {

  // }else{
  // methodList.push(strTwo)
  // }

}

function getApiParams(element) {
  let params = '';
  if (element.paramType == 'formData') {
    if (element.params.id) {
      if (typeof element.params.id === 'string' && element.params.id.includes('current-')) {
        if (element.params.id == 'current-userId') {
          params = ` this.userInfo['F_UserId']?this.userInfo['F_UserId']:''`
        } else if (element.params.id == 'current-token') {
          params = ` localStorage.getItem("avue-token") ? JSON.parse(localStorage.getItem("avue-token"))
          .content : ''`
        } else if (element.params.id == 'current-postId') {
          params = ` this.userInfo['F_Post'] && this.userInfo['F_Post'].length > 0
          ? this.userInfo['F_Post'][0].F_PostId
          : ''`
        } else if (element.params.id == 'current-roleId') {
          params = ` this.userInfo['F_Role'] && this.userInfo['F_Role'].length > 0
          ? this.userInfo['F_Role'][0].F_RoleId
          : ''`
        } else if (element.params.id == 'current-companyId') {
          params = ` this.userInfo['F_Company']?this.userInfo['F_Company'].F_CompanyId:''`
        } else if (element.params.id == 'current-departmentId') {
          params = ` this.userInfo['F_Department'] && this.userInfo['F_Department'].length > 0
          ? this.userInfo['F_Department'][0].F_DepartmentId
          : ''`
        }
      } else if (typeof element.params.id === 'string' && element.params.id.includes('hideComponents')) {
        params = `this.getHideComponentsMapItem('${element.params.id}')`;
      } else {
        params = ` this.formFieldsMap.has(${element.params.id})?
        (this.formFieldsMap.get(${element.params.id}).__vModel__?this.formData[this.formFieldsMap.get(${element.params.id}).__vModel__]:'')
        :''`
      }
    }
  } else {
    if (element.F_ParamValue) {
      params = `'${element.F_ParamValue}'`
    } else {
      params = `''`
    }

  }
  return params;
}
function buildDicApiMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__;
  let saveField = config.saveField;
  let urlDic = `${baseUrl}${config.apiConfig.url}`;
  let methodTypeName = 'POST';
  //Query Params  ?limit=1&size=20
  //Body 
  // params 
  // 接口参数类型 0 是 header  1 是body   2是queryString（请求方式如果是get  没有body  类型也是1  默认拼接参数到url）
  let urlParamStr = '';
  let paramsStr = '';
  let bodyStr = '';
  let headerStr = '';
  let urlParam = '';
  if (config.apiConfig.apiInputParams.length > 0) {

    for (let index = 0; index < config.apiConfig.apiInputParams.length; index++) {
      let element = config.apiConfig.apiInputParams[index];
      if (element.F_Type == 0 && element.F_ParamKey) { //header
        headerStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
      }
      if (element.F_ParamKey) {
        if (element.F_Type == 1) {
          bodyStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
        }
        else if (element.F_Type == 2) {
          let key = `urlParam${element.F_ParamKey}`;
          let val = `${getApiParams(element)}`;
          urlParam += `let ${key}=${val};`;
          urlParamStr += `${element.F_ParamKey}=` + `'+${key}+'` + '&';// 拼接到url
        }
      }
    }
  }
  if (urlParamStr) {
    urlDic += `?${urlParamStr}`;
  }
  let headers = ``;
  if (headerStr) {
    headers = `headers:{
      ${headerStr}
    },`;
  }
  let params = ``;
  if (paramsStr) {
    params = `
    params : {
      ${paramsStr}
    },`;
  }
  let bodys = ``;
  if (bodyStr) {
    bodys = `
    data : {
      ${bodyStr}
    },`;
  }
  if (methodTypeName != 'GET' && bodys == '') {
    bodys = `
    data : {},`;
  }
  let saveFieldStr = '';
  if (saveField) {
    saveFieldStr = `
    if('${saveField}'){
      ele['${saveField}']= ele['${saveField}']+'';
    }`;
  }
  urlDic = `'${urlDic}'`;
  const str = `async ${methodName}() {
    // 注意 this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    try {
      ${urlParam}
       let resp = await  this.$axios({
        method: '${methodTypeName}',
        url: ${urlDic},
        ${headers}
        ${params}
        ${bodys}
      });
      let key  = '${config.apiConfig.dataSource ? config.apiConfig.dataSource : 'data'}';
      let dataArr = resp.data.data[key];
      let tempData = [];
      if(dataArr&&dataArr.length>0){
        tempData = dataArr.map(ele=>{
          ${saveFieldStr}
          return ele
        });
      }
       this.${model} = tempData  
    } catch (error) {
      
    }
  },`;
  methodList.push(str);
}

function getButtonEvents(methodName, apiConfig) {
  let urlDic = `${baseUrl}${apiConfig.url}`;
  let methodTypeName = 'POST';
  let urlParamStr = '';
  let paramsStr = '';
  let bodyStr = '';
  let headerStr = '';
  let urlParam = '';
  if (apiConfig.apiInputParams.length > 0) {
    for (let index = 0; index < apiConfig.apiInputParams.length; index++) {
      let element = apiConfig.apiInputParams[index];
      if (element.F_Type == 0 && element.F_ParamKey) { //header
        headerStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
      }
      if (element.F_ParamKey) {
        if (element.F_Type == 1) {
          bodyStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
        }
        else if (element.F_Type == 2) {
          let key = `urlParam${element.F_ParamKey}`;
          let val = `${getApiParams(element)}`;
          urlParam += `let ${key}=${val};`;
          urlParamStr += `${element.F_ParamKey}=` + `'+${key}+'` + '&';// 拼接到url
        }
      }
    }
  }
  if (urlParamStr) {
    urlDic += `?${urlParamStr}`;
  }
  let headers = ``;
  if (headerStr) {
    headers = `headers:{
      ${headerStr}
    },`;
  }
  let params = ``;
  if (paramsStr) {
    params = `
    params : {
      ${paramsStr}
    },`;
  }
  let bodys = ``;
  if (bodyStr) {
    bodys = `
    data : {
      ${bodyStr}
    },`;
  }
  if (methodTypeName != 'GET' && bodys == '') {
    bodys = `
    data : {},`;
  }
  return `async ${methodName}() {
    // 注意 this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    try {
      ${urlParam}
       let resp = await  this.$axios({
        method: '${methodTypeName}',
        url: '${urlDic}',
        ${headers}
        ${params}
        ${bodys}
      });
    } catch (error) {
      
    }
  },`;
}
function getTableDicData(confKey, config) {
  let apiConfig = config.apiConfig;
  let urlDic = `${baseUrl}${apiConfig.url}`;
  let methodTypeName = 'POST';
  let urlParamStr = '';
  let paramsStr = '';
  let bodyStr = '';
  let headerStr = '';
  let urlParam = '';
  if (apiConfig.apiInputParams.length > 0) {
    for (let index = 0; index < apiConfig.apiInputParams.length; index++) {
      let element = apiConfig.apiInputParams[index];
      if (element.F_Type == 0 && element.F_ParamKey) { //header
        headerStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
      }
      if (element.F_ParamKey) {
        if (element.F_Type == 1) {
          bodyStr += `'${element.F_ParamKey}' : ${getApiParams(element)},`;
        }
        else if (element.F_Type == 2) {
          let key = `urlParam${config.formId}${index}${element.F_ParamKey}`;
          let val = `${getApiParams(element)}`;
          urlParam += `let ${key}=${val};`;
          urlParamStr += `${element.F_ParamKey}=` + `'+${key}+'` + '&';// 拼接到url
        }
      }
    }
  }
  if (urlParamStr) {
    urlDic += `?${urlParamStr}`;
  }
  let headers = ``;
  if (headerStr) {
    headers = `headers:{
      ${headerStr}
    },`;
  }
  let params = ``;
  if (paramsStr) {
    params = `
    params : {
      ${paramsStr}
    },`;
  }
  let bodys = ``;
  if (bodyStr) {
    bodys = `
    data : {
      ${bodyStr}
    },`;
  }
  if (methodTypeName != 'GET' && bodys == '') {
    bodys = `
    data : {},`;
  }
  let saveFieldStr = '';
  if (config.apiConfig.saveField) {
    saveFieldStr = `
  if('${config.apiConfig.saveField}'){
    ele.value = ele['${config.apiConfig.saveField}']+'';
    ele['${config.apiConfig.saveField}']= ele['${config.apiConfig.saveField}']+'';
  }`;
  }
  let showFieldStr = '';
  if (config.apiConfig.showField) {
    showFieldStr = `
  if('${config.apiConfig.showField}'){
    ele.label = ele['${config.apiConfig.showField}']+'';
    ele['${config.apiConfig.showField}']= ele['${config.apiConfig.showField}']+'';
  }`;
  }
  return `
${urlParam}
let resp${config.formId} =await  this.$axios({
  method: '${methodTypeName}',
  url: '${urlDic}',
  ${headers}
  ${params}
  ${bodys}
});

      if(resp${config.formId}.data.data['${config.apiConfig.dataSource ? config.apiConfig.dataSource : 'data'}']&&resp${config.formId}.data.data['${config.apiConfig.dataSource ? config.apiConfig.dataSource : 'data'}'].length>0){
        this.${confKey} = resp${config.formId}.data.data['${config.apiConfig.dataSource ? config.apiConfig.dataSource : 'data'}'].map(ele=>{
          ${saveFieldStr}
          ${showFieldStr}
          return ele
        });
      }

`;
}
function buildButtonApiMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__;
  let clickEvents = '';
  if (config.triggerEventData['click'] && config.triggerEventData['click'].length > 0) {
    config.triggerEventData['click'].forEach((ele, index) => {
      if (ele.operationConfiguration) {
        let apiConfig = ele.operationConfiguration;
        if (apiConfig.url) {
          let buttonMethodName = 'btnClickApi' + config.formId + index;
          let str = getButtonEvents(buttonMethodName, apiConfig);
          methodList.push(str);
          clickEvents += ` await  this.${buttonMethodName}();`;
        }
      }
    });
  }
  let triggerEventHandlerStr = ``;
  if (config.triggerEvents.includes('clickAfter') && config.triggerEventData['clickAfter'].length > 0) {
    triggerEventHandlerStr = `
    await  this.triggerEventHandler(${JSON.stringify(config.triggerEventData['clickAfter'])});
    `;
  }
  let str2 = `async ${methodName}() {
    // 注意 this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    try {
      ${clickEvents}
      ${triggerEventHandlerStr}
    } catch (error) {
      
    }
  },`;
  methodList.push(str2);
}
// js整体拼接
function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, dic, methods, created, watchStr, computedStr, extendData) {
  let showFormStr = 'showForm';
  let showFormKeyStr = 'showFormKey';
  let fields = [];
  let changeTableMutiplePopupData = '';
  let changeTableAssoData = '';
  let changeTableTreeLoadData = ''

  if (hasTableMutiplPpopup) {
    changeTableMutiplePopupData = `changeTableMutiplePopupData(val){
      let {index,value,showValue,bindTableField,bindTable,__vModel__} = val;
      this[bindTable][bindTable][index][__vModel__] = value;
    },`;
  }
  if (hasTableAssoPpopup) {
    changeTableAssoData = `changeTableAssoData(val){
      let {index,value,bindTable,__vModel__,autoBindFields,data} = val;
      this[bindTable][bindTable][index][__vModel__] = value;
        if(autoBindFields&&autoBindFields.length>0){
          autoBindFields.forEach(ele=>{
            if(ele.field&&ele.bindField){
              this[bindTable][bindTable][index][ele.field] = data[ele.bindField];
            }
          });
        }
    },`;
  }
  if (hasTreeLoad) {
    changeTableTreeLoadData = `changeTableTreeLoadData(val){
      let {index,value,bindTable,__vModel__} = val;
      this[bindTable][bindTable][index][__vModel__] = value;
    },`;
  }

  let tableMethods = '';
  let tableCreateMethod = '';
  let tableChildDicData = '';
  if (hasTableMutiplPpopup || hasTableAssoPpopup || hasApiOptions || hasTreeLoad) {
    let tableConfConfig = {};
    let tableChildCreateMethod = '';
    conf.fields.forEach(ele => {
      if (ele?.__config__?.componentName == 'table') {
        let children = ele.__config__.children || [];
        if (children.length > 0) {
          children.forEach(ele2 => {
            if ((
              ele2.__config__.avueType == "asso-select" ||
              ele2.__config__.avueType == "mutiple-popup" ||
              ele2.__config__.avueType == "asso-popup"
            )
              &&
              ele2.__vModel__) {
              tableConfConfig[ele2.__vModel__] = formatTableConfItem(ele2);
              let confKey = ele2.__vModel__ + ele2.__config__.formId + 'tableChildDicData'
              tableChildDicData = tableChildDicData + `${confKey}:[]` + `,`;
              tableChildCreateMethod = tableChildCreateMethod + formatTableConfDicData(ele2);
            }
            //下拉选择 单选框 多选框
            else if (
              (
                ele2.__config__.tag == "el-radio-group" ||
                ele2.__config__.tag == "el-checkbox-group" ||
                ele2.__config__.tag == "el-select"
              )
              && ele2.__vModel__
              && ele2.__config__.apiConfig
              && ele2.__config__.apiConfig.url) {
              tableConfConfig[ele2.__vModel__] = formatTableConfItem(ele2);
              let confKey = ele2.__vModel__ + ele2.__config__.formId + 'tableChildDicData'
              tableChildDicData = tableChildDicData + `${confKey}:[]` + `,`;
              tableChildCreateMethod = tableChildCreateMethod + formatTableConfDicData(ele2);
            }

          });
        }
      }
      if (ele?.__config__?.componentName == 'avue-tabs') {
        let childrenObj = ele?.__config__?.childrenObj || [];
        for (let key in childrenObj) {
          let value = childrenObj[key];
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(ele1 => {
              if (ele1.__config__.componentName && ele1.__config__.componentName == 'table') {
                let children = ele1.__config__.children || [];
                if (children.length > 0) {
                  children.forEach(ele2 => {
                    if (
                      (
                        ele2.__config__.avueType == "asso-select" ||
                        ele2.__config__.avueType == "mutiple-popup" ||
                        ele2.__config__.avueType == "asso-popup"
                      )
                      && ele2.__vModel__) {
                      tableConfConfig[ele2.__vModel__] = formatTableConfItem(ele2);
                      let confKey = ele2.__vModel__ + ele2.__config__.formId + 'tableChildDicData'
                      tableChildDicData = tableChildDicData + `${confKey}:[]` + `,`;
                      tableChildCreateMethod = tableChildCreateMethod + formatTableConfDicData(ele2);
                    }
                    //下拉选择 单选框 多选框
                    else if (
                      (
                        ele2.__config__.tag == "el-radio-group" ||
                        ele2.__config__.tag == "el-checkbox-group" ||
                        ele2.__config__.tag == "el-select"
                      )
                      && ele2.__vModel__
                      && ele2.__config__.apiConfig
                      && ele2.__config__.apiConfig.url) {
                      tableConfConfig[ele2.__vModel__] = formatTableConfItem(ele2);
                      let confKey = ele2.__vModel__ + ele2.__config__.formId + 'tableChildDicData'
                      tableChildDicData = tableChildDicData + `${confKey}:[]` + `,`;
                      tableChildCreateMethod = tableChildCreateMethod + formatTableConfDicData(ele2);
                    }
                  });
                }
              }
            });
          }
        }
      }
    });
    tableMethods = `getTableChildrenItemDisabled(bindTable,prop,disabled){
    if (this.disabled) { //查看
      return true;
    }else if (this.formSubTableDisabledList&&this.formSubTableDisabledList[bindTable] != undefined) {
      if (this.formSubTableDisabledList[bindTable].includes(prop)) {
        return true;
      }else {
        return disabled;
      }
    }
  },getTableConfConfig(vmodel){
    let config = ${JSON.stringify(tableConfConfig)};
    return config[vmodel]?config[vmodel]:null;
  },async setTableDicData(){
    ${tableChildCreateMethod}
},`
      ;
    tableCreateMethod = ` 
  try {
    await  this.setTableDicData();
    this.reRenderSubform = true;
     } catch (error) {
       
     }`;
  }

  //对根级元素和avue-tabs里的子元素过滤字段
  fields = conf.fields;  //filterField(conf.fields,[]);
  let formFieldsMap = new Map();
  if (fields.length > 0) {
    fields.forEach(ele => {
      if (ele.__config__.componentName) {
        if (ele.__config__.componentName == 'avue-tabs') {
          for (let key in ele.__config__.childrenObj) {
            if (ele.__config__.childrenObj[key] && ele.__config__.childrenObj[key].length > 0) {
              ele.__config__.childrenObj[key].forEach(ele2 => {
                if (ele2.__config__.componentName) {
                } else {
                  let autoHandlerConfig = null;
                  if(ele2.__config__.openDialog){//联想弹层 多选弹层
                    let params = {};
                    let { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType } = ele2.__config__;
                    params = { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType };
                    params.model = ele2.__vModel__;
                    params.apiConfig = ele2.__config__.apiConfig;
                    autoHandlerConfig = params;
                  }
                  if (ele2.__config__.formId) {
                    let temp = {
                      __vModel__: ele2.__vModel__,
                      __config__:
                      {
                        avueType: ele2.__config__.avueType,
                        triggerEvents: ele2.__config__.triggerEvents,
                        triggerEventData: ele2.__config__.triggerEventData,
                        autoHandlerConfig
                      }
                    };
                    formFieldsMap.set(ele2.__config__.formId, temp);
                  }
                }
              });
            }
          }
        }
      } else {
        if (ele.__config__.formId) {
          let autoHandlerConfig = null;
          if(ele.__config__.openDialog){//联想弹层 多选弹层
            let params = {};
            let { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType } = ele.__config__;
            params = { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType };
            params.model = ele.__vModel__;
            params.apiConfig = ele.__config__.apiConfig;
            autoHandlerConfig = params;
          }
          let temp = {
            __vModel__: ele.__vModel__,
            __config__:
            {
              avueType: ele.__config__.avueType,
              triggerEvents: ele.__config__.triggerEvents,
              triggerEventData: ele.__config__.triggerEventData,
              autoHandlerConfig
            }
          };
          formFieldsMap.set(ele.__config__.formId, temp);
        }
      }
    });
  }
  let formConfig = { fields };
  const str = `
  ${exportDefault}{ 
  ${inheritAttrs[type]}
  components: {},
  props: ['keyValue', 'isEdit', 'disabled'],
  data () {
    return {
      userInfo:{},
      submitLoading:false,
      ${showFormStr}:true,
      ${showFormKeyStr}:1,
      reRenderSubform:false,
      operationVal:'add',
      isAdd:true,
      //_FORM_ADDRESS_URL_,
      autoCompleteConfEventData:[],
      mainTableName:'${parentTable || 'table0'}',
      formConfig: {},
      formFieldsMap:new Map(),
      hideComponentsMap:new Map(),
      needShowValueTags:['asso-popup','mutiple-popup'],
      ${tableChildDicData}
	  ${extendData}
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${props}
	  ${dic}
    }
  },
  computed: {
    ${computedStr}
  },
  watch: {
    ${watchStr}
  },
  async created () {
    this.formConfig = this.getFormConfig();
    this.formFieldsMap = this.getFormFieldsMap();
    this.userInfo = localStorage.getItem("avue-userInfo")
        ? JSON.parse(localStorage.getItem("avue-userInfo")).content
        : {};
    
  },
  async mounted () {
    this.hideComponentsMap = await this.getHideComponentsMap();
    this.showForm = false;
    await this.insertCreatedEvent();
    //TODO   再这里做数据回填 请求表单数据
    ${CREATEED_REPLACE_STRING}
    ${created}
    ${tableCreateMethod}
    await this.insertMountedEvent();
    this.reRenderSubform = true;//子表单显示
    this.showFormKey++;
    this.processParameterAssignment();
    this.showForm = true;
  },
  methods: {
    ${methods}
    ${changeTableMutiplePopupData}
    ${changeTableAssoData}
    ${changeTableTreeLoadData}
    async triggerEventHandler(eventData){
      if(eventData.length>0){
        eventData.forEach(ele=>{
          let functionName = 'getField'+ele.componentFormId+'Options';
          if (typeof this[functionName] == "function") {
            this[functionName]();
          }
        })
      }
    },
    triggerEventFormIdHandler(formId){
      if(this.formFieldsMap.get(formId).__config__.triggerEvents&&
        this.formFieldsMap.get(formId).__config__.triggerEvents.length>0){
          this.formFieldsMap.get(formId).__config__.triggerEvents.forEach(triggerEventItem => {
            if(this.formFieldsMap.get(formId).__config__.triggerEventData&&
            this.formFieldsMap.get(formId).__config__.triggerEventData[triggerEventItem]&&
            this.formFieldsMap.get(formId).__config__.triggerEventData[triggerEventItem].length>0){
              this.triggerEventHandler(this.formFieldsMap.get(formId).__config__.triggerEventData[triggerEventItem]);
            }
          });
        }
        return true;
    },
    //清空联想弹层、多选弹层的值
    clearBombLayerFormData(filed){
      this.formData[filed] = '';
      this.formData[filed+'_showValue'] = '';
    },
    // 流程参数赋值
    processParameterAssignment() {
      // 流程中的流程参数赋值 优先级最高，最后赋值
        setTimeout(()=>{
          if (this.isEdit != 2 && this.parameter && this.parameter[this.mainTableName]) {
            this.showForm = false;
            for (let [key, value] of Object.entries(this.parameter[this.mainTableName])) {
              this.setFormDataValue(key, value);
            }
            this.showForm = true;
          }
        },0);
    },
    setFormDataValue(field,val){
      if (Array.isArray(this.formData[field])) {
          if (val.includes(',')) {
            this.formData[field] = val.split(',');
          }else {
            this.formData[field] = [val];
          }
        }else {
          this.formData[field] = val;
        }
        //处理联想弹层，多选弹层
        if(this.formData[field+'_showValue']!=undefined){
          this.formData[field+'_showValue'] = val;
        }
    },
    setOutputsValue(nodeType,formId,res,outputKey){
      let nodeTypeChecked = false;
      if(nodeType=='created'){
        nodeTypeChecked = this.operationVal == 'add';
      }else if(nodeType=='edit'){
        nodeTypeChecked = this.operationVal == 'edit';
      }else if(nodeType=='mounted'){
        nodeTypeChecked = this.operationVal == 'add'||this.operationVal == 'edit';
      }
      if(nodeTypeChecked&&
        this.disabled!=true&&
          res&&
          res.data&&
          res.data.data&&
          this.formFieldsMap.has(formId)&&
          this.formFieldsMap.get(formId).__vModel__&&
          this.formData.hasOwnProperty(this.formFieldsMap.get(formId).__vModel__)
          ){
            this.setFormDataValue(this.formFieldsMap.get(formId).__vModel__,res.data.data[outputKey]);
            // 联想弹层 多选弹层 特殊处理
            if(this.formFieldsMap.get(formId).__config__&&
              this.formFieldsMap.get(formId).__config__.avueType&&
              this.needShowValueTags.includes(this.formFieldsMap.get(formId).__config__.avueType)){
                  this.formData[this.formFieldsMap.get(formId).__vModel__+'_showValue']= res.data.data[outputKey];
            }
            this.triggerEventFormIdHandler(formId);
        }
    },
    //子表单权限
    getAuthorityTableChildrenList(bindTable, children) {
      let column = [];
      if (bindTable && this.formEnCodeList && this.formEnCodeList[bindTable]) {
        let formSubEnCodeList = this.formEnCodeList[bindTable];
        if (children && children.length > 0) {
          column = children.map(ele2 => {
            if (formSubEnCodeList.includes(ele2.prop)) {
              ele2.hide = false;
            }
            else {
              ele2.hide = true;
            }
            if (ele2.hide == false) {
              //工作流中系统表单必填权限
              if (this.formSubTableNotRequiredList&&this.formSubTableNotRequiredList[bindTable] != undefined) {
                if (this.formSubTableNotRequiredList[bindTable].includes(ele2.prop)) {
                  ele2.required = false;
                }
                else {
                  ele2.required = true;
                }
              }
              
              ele2.rules = [];
              if (ele2.required) {
                ele2.rules = ele2.ruleList;
              }
               // disabled 属性
              if (this.formSubTableDisabledList&&this.formSubTableDisabledList[bindTable] != undefined) {
                if (this.formSubTableDisabledList[bindTable].includes(ele2.prop)) {
                  ele2.disabled = true;
                }else{
                  ele2.disabled = false;
                }
              }
              if(this.disabled){//查看
                ele2.disabled = true;
              }
            }else{
				ele2.rules =[]
				if (ele2.required) {
					ele2.ruleList.forEach(el=>{
						el.message+=','+this.$t('noFormAuth')
					})
					ele2.rules = ele2.ruleList;
				}
			}
            return ele2;
          });
        }
        return column;
      }else{
        return children;
      }
    },
    ${tableMethods}
    async insertCreatedEvent() {
      //FORM_EVENT_CREATED
    },
    async insertMountedEvent() {
      //FORM_EVENT_MOUNTED
    },
    async insertEditEvent() {
      //FORM_EDIT_STR
    },
    async insertSubmitEvent() {
      //FORM_SUBMIT_STR
    },
    
    getFormConfig(){
      //FORM_CONFIG_START
      let config = ${JSON.stringify(formConfig)};
      return config;
      //FORM_CONFIG_END
    },
    getFormFieldsMap(){
      //FORM_CONFIG_MAP_START
      let config = ${JSON.stringify(formFieldsMap)};
      return new Map(config);
      //FORM_CONFIG_MAP_END
    },
    async getHideComponentsMap(){
      let mapList = new Map();
      let hideComponentList = this.getHideComponents();
      if(typeof this.initHideComponentList=='function'){
        mapList = await this.initHideComponentList(hideComponentList);
        this.$store.commit("SET_HIDE_COMPONENT_LIST", mapList);
      }
      return mapList;
    },
    getHideComponentsMapItem(key){
      if(this.hideComponentsMap.size>0){
        return this.hideComponentsMap.has(key)?this.hideComponentsMap.get(key):"";
      }else{
        return ""
      }
    },
    getHideComponents(){
      //FORM_HIDE_COMPONENTS_START
      let config = ${JSON.stringify(confGlobal.hideComponents)};
      return config;
      //FORM_HIDE_COMPONENTS_END
    },
  }
}`;
  return str;
}
function formatTableConfItem(ele) {
  let { __vModel__, __config__, placeholder, disabled, style } = ele;
  let suffixIcon = ele["suffix-icon"] ? ele["suffix-icon"] : "";
  let prefixIcon = ele["prefix-icon"] ? ele["prefix-icon"] : "";
  let comfigTemp = {
    label: __config__.label ? __config__.label : "",
    tag: __config__.tag ? __config__.tag : "",
    avueType: __config__.avueType ? __config__.avueType : "",
    autoBindFields: __config__.autoBindFields ? __config__.autoBindFields : "",
    dataType: __config__.dataType ? __config__.dataType : "",
    dataItem: __config__.dataItem ? __config__.dataItem : "",
    dataSource: __config__.dataSource ? __config__.dataSource : "",
    database: __config__.database ? __config__.database : "",
    sql: __config__.sql ? __config__.sql : "",
    showField: __config__.showField ? __config__.showField : "",
    saveField: __config__.saveField ? __config__.saveField : "",
    apiConfig: __config__.apiConfig,
  }
  return {
    "suffix-icon": suffixIcon,
    "prefix-icon": prefixIcon,
    disabled,
    style,
    __vModel__,
    __config__: comfigTemp,
    placeholder
  };
}
function formatTableConfDicData(ele) {
  let str = "";
  if (ele.__config__.dataType) {
    let confKey = ele.__vModel__ + ele.__config__.formId + 'tableChildDicData'
    if (ele.__config__.dataType == 'dataSource' && ele.__config__.dataSource) {
      str = `let resp${ele.__config__.formId} = await  this.$axios({
        method: 'get',
        url: '${baseUrl}/data-sources/${ele.__config__.dataSource}/data',
      });

      if (resp${ele.__config__.formId}.data&&resp${ele.__config__.formId}.data.data && resp${ele.__config__.formId}.data.data.length) {
        let newOptions = [];
        resp${ele.__config__.formId}.data.data.forEach(item => {
          newOptions.push({
            label: item['${ele.__config__.showField}'],
            value: item['${ele.__config__.saveField}'] + "",
            ...item
          });
        });
        this.${confKey} = newOptions;
      }`
    } else if (ele.__config__.dataType == 'dataSql' && ele.__config__.database) {
      str = `let resp${ele.__config__.formId} = await  this.$axios({
        method: 'get',
        url: '${baseUrl}/database-links/${ele.__config__.database}/datas',
        params: {sql:'${ele.__config__.sql}'}
      });
      if (resp${ele.__config__.formId}.data&&resp${ele.__config__.formId}.data.data && resp${ele.__config__.formId}.data.data.length) {
        let newOptions = [];
        resp${ele.__config__.formId}.data.data.forEach(item => {
          newOptions.push({
            label: item['${ele.__config__.showField}'],
            value: item['${ele.__config__.saveField}'] + "",
            ...item
          });
        });
        this.${confKey} = newOptions;
      }`;
    } else if (ele.__config__.dataType == 'dataItem' && ele.__config__.dataItem) {
      str = `let resp${ele.__config__.formId} = await  this.$axios({
        method: 'get',
        url: '${baseUrl}/data-items/${ele.__config__.dataItem}/detail',
      });
      if (resp${ele.__config__.formId}.data&&resp${ele.__config__.formId}.data.data && resp${ele.__config__.formId}.data.data.length) {
        let newOptions = [];
        resp${ele.__config__.formId}.data.data.forEach(item => {
          newOptions.push({
            label: item['F_ItemName'],
            value: item['F_ItemValue'] + "",
            ...item
          });
        });
        this.${confKey} = newOptions;
      }`;
    } else if (ele.__config__.dataType == 'dataApi') {
      str = `${getTableDicData(confKey, ele.__config__)}`
    }
  }
  return str;
}

function filterField(fields, newFields, isTable = false) {
  newFields = fields.map(ele => {
    if (ele?.__config__?.componentName == 'table') {
      let children = ele?.__config__?.children || [];
      ele.__config__.children = filterField(children, [], true);
    }
    if (ele?.__config__?.componentName == 'avue-tabs') {
      let childrenObj = ele?.__config__?.childrenObj || [];
      for (let key in childrenObj) {
        childrenObj[key] = filterField(childrenObj[key], []);
      }
    }
    let temp = {};
    if (ele.type) {
      temp['tempType'] = ele.type
    }
    if (ele.__vModel__) {
      temp['__vModel__'] = ele.__vModel__
    }
    if (ele.computationalConfiguration) {
      temp['computationalConfiguration'] = ele.computationalConfiguration
    }
    if (ele.computationalConfigurationValue) {
      temp['computationalConfigurationValue'] = ele.computationalConfigurationValue
    }
    if (ele.__type__) {
      temp['__type__'] = ele.__type__
    }
    if (ele.infoType) {
      temp['infoType'] = ele.infoType
    }
    if (ele.__organize__) {
      temp['__organize__'] = ele.__organize__
    }
    if (ele.__slot__) {
      if (ele.__slot__.prepend) {
        temp['prepend'] = ele.__slot__.prepend;
      }
      if (ele.__slot__.append) {
        temp['append'] = ele.__slot__.append;
      }
    }
    if (ele['prefix-icon']) {
      temp['prefix-icon'] = ele['prefix-icon']
    }
    if (ele['suffix-icon']) {
      temp['suffix-icon'] = ele['suffix-icon']
    }
    if (ele.componentName) {
      temp['componentName'] = ele.componentName
    }
    //avue-tabs 子元素集容器
    if (ele.childrenObj) {
      temp['childrenObj'] = ele.childrenObj
    }
    if (ele.taxRate) {
      temp['taxRate'] = ele.taxRate
    }
    if (isTable) {
      let { document, renderKey, changeTag, tagIcon, regList, method, url,
        titlePosition,
        isBindTable,
        layout,
        labelWidth,
        ...otherParams } = ele.__config__;
      temp['__config__'] = { ...otherParams };
    } else {
      let { document, renderKey, changeTag, tagIcon, regList, method, url,
        titlePosition,
        isBindTable,
        layout,
        labelWidth,
        ...otherParams } = ele.__config__;
      temp['__config__'] = { ...otherParams };
    }

    if (ele?.__config__?.childrenObj) {
      temp['__config__']['children'] = [];
      temp['__config__']['childrenObj'] = ele.__config__.childrenObj;
    }
    return temp;
  });
  return (() => { return newFields })();
}
//检查是否有财务组件
function haveFinanceCom(fields) {
  let findFlag = false;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].__config__.componentName == 'avue-tabs') {
      let childrenObj = fields[i]?.__config__?.childrenObj || {};
      for (let key in childrenObj) {
        findFlag = haveFinanceCom(childrenObj[key]);
        if (findFlag) break;
      }
    } else {
      if (fields[i].type == 'number' || fields[i].__config__.avueType == 'number') {
        findFlag = true;
        break;
      }
    }
  }
  return (() => { return findFlag; })();
}
//检查是否有大写组件
function haveCapitalized(fields) {
  let findCapitalized = false;

  for (let i = 0; i < fields.length; i++) {
    if (fields[i].__config__.componentName && fields[i].__config__.componentName == 'avue-tabs') {
      let childrenObj = fields[i]?.__config__?.childrenObj || {};
      for (let key in childrenObj) {
        findCapitalized = haveCapitalized(childrenObj[key]);
        if (findCapitalized) break;
      }
    } else {
      if (fields[i]?.isCapitalized) {
        findCapitalized = true;
        break;
      }
    }
  }
  return (() => { return findCapitalized; })();
}
function childFormatString(bindTable, children, formId) {
  let formatString = '';
  bindTable = bindTable ? bindTable : 'childTable' + formId;
  //如果是第一级  就是主表的组件 主表的组件 不需要循环  如果是第二季 代表是子表单的，  子表单 需要循环遍历所有数据 格式化
  if (bindTable) {
    formatString = `
    if(this.${bindTable}.${bindTable}&&this.${bindTable}.${bindTable}.length>0){
    this.${bindTable}.${bindTable}.forEach((element,index) => {
      let itemChild = { ...element }
      for (let [key, value] of Object.entries(itemChild)) {
        if(Array.isArray(value)){
          itemChild[key] =  value.join(',')
        }
      }
      this.${bindTable}.${bindTable}[index] = itemChild;
      `;

    formatString +=

      `
  });
  }else{
    this.${bindTable}.${bindTable} = [];
  }
  `;
  }


  return formatString;
}
function buildTablePreloadMethod(methodName, methodList, scheme) {
  let hasMethod = true;
  if (scheme.__config__.dataType) {
    if (scheme.__config__.dataType == 'dataSource') {
      if (!scheme.__config__.dataSource) {
        hasMethod = false;
      }
    } else if (scheme.__config__.dataType == 'dataSql') {
      // 已经取消了sql配置
      hasMethod = false;
    } else if (scheme.__config__.dataType == 'dataItem') {
      if (!scheme.__config__.dataItem) {
        hasMethod = false;
      }
    }
  } else {
    hasMethod = false;
  }
  let dataType = scheme?.__config__?.dataType;
  let str = '';
  let str2 = '';

  let config = scheme.__config__;
  if (!scheme?.__config__?.children || !scheme.__config__.children.length) {
    hasMethod = false;
  }
  if (hasMethod) {
    let prestrainFieldsConf = getPreloadConfInfo(scheme.__config__.children);
    let bindTable = config.bindTable || 'childTable' + config.formId;
    let preloadLoading = 'preloadLoading' + config.formId;

    switch (dataType) {
      case 'dataSource':
        str = `async ${methodName}() {
          //编辑时 取消预加载
          if(this.keyValue) return;
          this.${preloadLoading} = true;
          // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
          try {
        let resp = await  this.$axios({
          method: 'get',
          url: '${baseUrl}/data-sources/${config.dataSource}/data',
        });
        if(resp.data){
          let { data } = resp.data
          let dynamic = this.getDicData(data,'${prestrainFieldsConf}');
          this.${bindTable}.${bindTable} = dynamic;
          this.${preloadLoading} = false;
        }
          } catch (error) {
            
          }
        },`
        if (config.isSelectData) {
          str += `selectTableDataEvent${config.formId}(){
						this.$axios({
							method: 'get',
							url:  '${baseUrl}/data-sources/${config.dataSource}/data',
						}).then(res=>{
							let colum=[];
							let obj = {}
							this.formConfig.fields.forEach(k=>{			
								if(k.__config__.formId == ${config.formId}){
									obj=k;
									return;
								}else if(k.__config__.tag=="avue-tabs"){
									for(let j in k.__config__.childrenObj){
										for(let o of k.__config__.childrenObj[j]){
											if(o.__config__.formId == ${config.formId}){
												obj=o;
												return;
											}
										}
									}
								}
							})
							if (obj.__config__) {
								colum=obj.__config__.sourceTableHeader
							}
							this.avueFormData${config.formId}={data:res.data.data||[],colum:colum};
							this.selectTableDataVisible${config.formId}=true;
						}).catch(()=>{});
					},
					selectTableDataCallBack${config.formId}(data){
						if(data){
							let dynamic = this.getDicData(data, '${prestrainFieldsConf}');
							this.${bindTable}.${bindTable} = this.${bindTable}.${bindTable}.concat(dynamic);
						}
						this.selectTableDataVisible${config.formId}=false;
					},`
        }
        break;
      case 'dataSql':
        str = `async ${methodName}() {
          //编辑时 取消预加载
          if(this.keyValue) return;
          this.${preloadLoading} = true;
          // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
          try {
            let resp = await  this.$axios({
              method: 'get',
              url: '${baseUrl}/database-links/${config.database}/datas',
              params: {sql:'${scheme.__config__.sql}'}
            });
            if(resp.data){
              let { data } = resp.data
              let dynamic = this.getDicData(data,'${prestrainFieldsConf}');
              this.${bindTable}.${bindTable} = dynamic;
              this.${preloadLoading} = false;    
            }
          } catch (error) {
            
          }
        },`;
        break;
      case 'dataItem':
        str = `async ${methodName}() {
          //编辑时 取消预加载
          if(this.keyValue) return;
          this.${preloadLoading} = true;
          // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
          try {
            let resp = await  this.$axios({
              method: 'get',
              url: '${baseUrl}/data-items/${config.dataItem}/detail',
            });
            if(resp.data){
              let { data } = resp.data
              let dynamic = this.getDicData(data,'${prestrainFieldsConf}');
              this.${bindTable}.${bindTable} = dynamic;
              this.${preloadLoading} = false;    
            }
          } catch (error) {
            
          }
        },`;
        if (config.isSelectData) {
          str += `selectTableDataEvent${config.formId}(){
						this.$axios({
							method: 'get',
							url:  '${baseUrl}/data-items/${config.dataItem}/detail',
						}).then(res=>{
							let colum=[];
							let obj = {}
							this.formConfig.fields.forEach(k=>{			
								if(k.__config__.formId == ${config.formId}){
									obj=k;
									return;
								}else if(k.__config__.tag=="avue-tabs"){
									for(let j in k.__config__.childrenObj){
										for(let o of k.__config__.childrenObj[j]){
											if(o.__config__.formId == ${config.formId}){
												obj=o;
												return;
											}
										}
									}
								}
							})
							if (obj.__config__) {
								colum=obj.__config__.itemTableHeader
							}
							this.avueFormData${config.formId}={data:res.data.data||[],colum:colum};
							this.selectTableDataVisible${config.formId}=true;
						}).catch(()=>{});
					},
					selectTableDataCallBack${config.formId}(data){
						if(data){
							let dynamic = this.getDicData(data, '${prestrainFieldsConf}');
							this.${bindTable}.${bindTable} = this.${bindTable}.${bindTable}.concat(dynamic);
						}
						this.selectTableDataVisible${config.formId}=false;
					},`
        }
        break;
    }

  } else {
    str = ` ${methodName}() {
        return new Promise((resolve,reject) => {
          resolve()
        })	
      },`;
    if (config.isSelectData) {
      str += `selectTableDataEvent${config.formId}(){
					this.$message({
              title: "提示",
              message:this.$t('tableNotEquippedDataSourceDataCannotSelected'),
              type: "error",
            })
				},
				selectTableDataCallBack${config.formId}(data){
				},`
    }
  }
  str2 = `getDicData(arr,prestrainFieldsConf){
      let resultArr = [];
      prestrainFieldsConf = JSON.parse(prestrainFieldsConf) || {};
      arr.map(item=>{
        let _obj = {};
        for(let key in prestrainFieldsConf){
          _obj[key] = item[prestrainFieldsConf[key]];
        }
        resultArr.push(_obj);
      });
      return resultArr;
    },`
  let result = methodList.indexOf(str);
  let result2 = methodList.indexOf(str2);
  if (result !== -1) return;
  methodList.push(str);
  if (result2 !== -1) return;
  methodList.push(str2);

}
function getPreloadConfInfo(arr) {
  let preloadConf = {};

  arr.map(item => {
    let bindTableField = item.__config__.bindTableField || item.__vModel__;
    preloadConf[bindTableField] = item.__config__.prestrainField;
  });
  return JSON.stringify(preloadConf);
}