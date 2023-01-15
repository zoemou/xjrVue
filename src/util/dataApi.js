import { baseUrl } from "@/config/env";
import {
  getDataItemDetail,
  getDataBySQL,
  insertNodeJournal
} from "@/api/databasemanage/datasource.js";
import store from "@/store";
import request from "@/router/axios";

export const getWorkflowFormTabIndexKey = ()=>{
  return store.state.formParser.workflowFormTabIndexKey;
};
export const setFormValueItem = (value) => {
  store.commit("SET_FORM_VALUE_ITEM", value);
};
export const getFormValueItemKey = (formId) => {
  let indexKey = getWorkflowFormTabIndexKey();
  return 'formId'+formId+'index'+indexKey;
};
export const setFormValueInfoProperties = (formId, value) => {
  let indexKey = getWorkflowFormTabIndexKey();
  let key = 'formId'+formId+'index'+indexKey;
  store.commit("CHANGE_FORM_VALUE_ITEM", {
    key,
    value
  });
};
export const getFormIdValue = (formId)=>{
  let indexKey = getWorkflowFormTabIndexKey();
  let key = 'formId'+formId+'index'+indexKey;
  let info = store.state.formParser.formValueInfo;
  let val = info[key];
  if (val&&typeof val != "string"&&typeof val != "number") {
    val = val.join(",");
  }
  return val;
}
export  const triggerEventHandler = (event)=>{
  let options = event&&event.length>0?event:[];
  store.commit("SET_NEED_CHANGE_OPTION_FORMID", options);
}
export const setSubmitFormEvents = (value) => {
  let indexKey = getWorkflowFormTabIndexKey();
  let key = 'index'+indexKey;
  store.commit("CHANGE_SUBMIT_FORM_EVENTS", {
    key,
    value
  });
};
export const getIsExecutedFormEvent = () => {
  let indexKey = getWorkflowFormTabIndexKey();
  let key = 'index'+indexKey;
  return store.state.formParser.isExecutedFormEvent[key]?store.state.formParser.isExecutedFormEvent[key]:false;
};
export const setIsExecutedFormEvent = (value) => {
  let indexKey = getWorkflowFormTabIndexKey();
  let key = 'index'+indexKey;
  store.commit("CHANGE_IS_EXECUTED_FORM_EVENT", {
    key,
    value
  });
};
export const getSubmitFormEvents = ()=>{
  return store.state.formParser.submitFormEvents;
}
// 更新options
export const getOptions= async(item,type)=>{
  let config = {
    ...{dataType:'',dataItem:'',dataSource:'',showField:'',saveField:'',apiConfig:{}},
    ...item
  };
  let options = [];
  try {
     //数据字典
    if (config.dataType == "dataItem") {
      options = await getItemList(config.dataItem,type);
    }
    //数据源
    if (config.dataType == "dataSource") {
      options = await getDataSource(config.dataSource,config.showField,config.saveField,type);
    }
    //api
    if (config.dataType == "dataApi") {
      options = await getApi(config.apiConfig);
    }
  } catch (error) {
    
  }
 
  return options;
}

// 获取数据字典数据
export  const  getItemList = async (dataItem,showField='F_ItemName',saveField='F_ItemValue',type)=>{
  let data = [];
  try {
    let res = await getDataItemDetail(dataItem);
  if (res.data.success) {
    if (res.data.data.length > 0) {
      data = res.data.data.map((ele) => {
				if(type=='origin'){
					return ele
				}else{
					return { ...ele, label: ele[showField], value: ele[saveField] };
				}
        
      });
      
    }
  }
  } catch (error) {
    
  }
  
  return data;
}
// 获取数据源数据
export const getDataSource  = async (dataSource,showField='lable',saveField='id',type)=>{
  let data = [];
  try {
    let res = await getDataBySQL(dataSource);
  if (res.data.success) {
    if (res.data.data.length > 0) {
      data = res.data.data.map((ele) => {
				if(type=='origin'){
					return ele
				}else{
					return { ...ele, label: ele[showField], value: ele[saveField] };
				}
      });
    }
  }
  } catch (error) {
    
  }
  
  return data;
}

// 获取api接口数据
export const getApi = async (apiConfig)=>{
  let data = [];
  if(apiConfig.url&&apiConfig.dataSource){
    try {
      let res = await getDataAPi(apiConfig);
      if(res.data.success){
        if(apiConfig.showField&&apiConfig.saveField){
          if(res.data.data[apiConfig.dataSource]&&res.data.data[apiConfig.dataSource].length>0){
            data = res.data.data[apiConfig.dataSource].map((ele) => {
              return { ...ele, label: ele[apiConfig.showField], value: ele[apiConfig.saveField] };
            });
          }
        }
      }
    } catch (error) {
      console.log('error',error);
    }
  } 
  
  return data;
} 

// 返回表单数据中api配置的数据
export  const  getEventDataAPiConfig = (apiConfig)=>{
  let urlDic = `${baseUrl}${apiConfig.url}`;
  let methodTypeName = 'POST';
  let urlParamStr = "";
  let paramsJson = {};
  let bodyJson = {};
  let headerJson = {};

  if (apiConfig.apiInputParams.length > 0) {
    for (
      let index = 0;
      index < apiConfig.apiInputParams.length;
      index++
    ) {
      let element = apiConfig.apiInputParams[index];
      if (element.F_Type == 0 && element.F_ParamKey) {
        //header
        headerJson[element.F_ParamKey] = getApiParams(element);
      }
      if (element.F_ParamKey) {
        if (element.F_Type == 1) {
          bodyJson[element.F_ParamKey] = getApiParams(element);
        } else if (element.F_Type == 2) {
          urlParamStr += `${element.F_ParamKey}=${getApiParams(
            element
          )}&`; // 拼接到url
        }
      }
    }
  }
  if (urlParamStr) {
    urlDic += `?${urlParamStr}`;
  }
  return {
    method: methodTypeName,
    url: urlDic,
    headers:headerJson,
    params:paramsJson,
    data: bodyJson,
  };
}
// 拼接api接口
export  const  getDataAPi = async(apiConfig)=>{
  let urlDic = `${baseUrl}${apiConfig.url}`;
  let methodTypeName = 'POST';
  let urlParamStr = "";
  let paramsJson = {};
  let bodyJson = {};
  let headerJson = {};

  if (apiConfig.apiInputParams.length > 0) {
    for (
      let index = 0;
      index < apiConfig.apiInputParams.length;
      index++
    ) {
      let element = apiConfig.apiInputParams[index];
      if (element.F_Type == 0 && element.F_ParamKey) {
        //header
        headerJson[element.F_ParamKey] = getApiParams(element);
      }
      if (element.F_ParamKey) {
        if (element.F_Type == 1) {
          bodyJson[element.F_ParamKey] = getApiParams(element);
        } else if (element.F_Type == 2) {
          urlParamStr += `${element.F_ParamKey}=${getApiParams(
            element
          )}&`; // 拼接到url
        }
      }
    }
  }
  if (urlParamStr) {
    urlDic += `?${urlParamStr}`;
  }
  try {
    return await request({
      method: methodTypeName,
      url: urlDic,
      headers:headerJson,
      params:paramsJson,
      data: bodyJson,
    });
  } catch (error) {
    return error;
  }
}
// 拼接api参数
export  const  getApiParams = (element)=>{
  let userInfo = localStorage.getItem("avue-userInfo")
    ? JSON.parse(localStorage.getItem("avue-userInfo")).content
    : {};
  let str = "";
  if (element.paramType == "formData") {
    if (element.params.id) {
      if(typeof element.params.id == "string"&&element.params.id.includes('current-')){
        if (element.params.id == "current-userId") {
          str =userInfo['F_UserId']?userInfo['F_UserId']:'';
        } else if (element.params.id == "current-token") {
          str = localStorage.getItem("avue-token") ? JSON.parse(localStorage.getItem("avue-token"))
      .content : '';
        } else if (element.params.id == "current-postId") {
          str = userInfo['F_Post'] && userInfo['F_Post'].length > 0
      ? userInfo['F_Post'][0].F_PostId
      : '';
        } else if (element.params.id == "current-roleId") {
          str = userInfo['F_Role'] && userInfo['F_Role'].length > 0
      ? userInfo['F_Role'][0].F_RoleId
      : '';
        } else if (element.params.id == "current-companyId") {
          str = userInfo['F_Company']?userInfo['F_Company'].F_CompanyId:'';
        } else if (element.params.id == "current-departmentId") {
          str = userInfo['F_Department'] && userInfo['F_Department'].length > 0
      ? userInfo['F_Department'][0].F_DepartmentId
      : '';
        }
      }else if(typeof element.params.id == "string" &&element.params.id.includes('hideComponents')){
        let val = undefined;
        if(store.state.formParser.hideComponentList&&store.state.formParser.hideComponentList.size>0){
          val = store.state.formParser.hideComponentList.has(element.params.id)?store.state.formParser.hideComponentList.get(element.params.id):'';
        }
        str  = val==undefined?"":val;
      }else {
        let val = getFormIdValue(element.params.id);
        str  = val==undefined?"":val;
      }
    }
  } else {
    if(element.F_ParamValue){
      str = element.F_ParamValue;
    }else{
      str = '';
    }
  }
  return str;
}
//日志节点名称
const getNodeTypeName =(nodeType)=>{
  let str = "";
  switch (nodeType) {
    case 'created':
      str = '表单初始化';
      break;
      case 'edit':
        str = '获取表单数据';
        break;
      case 'mounted':
        str = '加载表单';
        break;
      case 'submit':
        str = '提交表单';
        break;
    default:
      break;
  }
return str;
}
//记录日志
export const insertJournal = async ({nodeType,type,FormName,FormId,apiJournal})=>{
  let nodeTypeName = getNodeTypeName(nodeType);
  let params = {
    type,
    FormName,
    FormId, 
    nodeType,
    nodeTypeName,
    apiJournal
  };
  await insertNodeJournal(params);
  
}