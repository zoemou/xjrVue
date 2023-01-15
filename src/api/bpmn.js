import request from "@/router/axios";
import { baseUrl} from "@/config/env";
// import qs from "qs";
// 模板分类
export const getDataItem = code =>
  request({
    url: baseUrl + "/data-items/" + code + "/detail/tree",
    method: "get"
  });
export const newModel = () =>
  request({
    url: baseUrl + "/workflow-scheme-info/new-model",
    method: "POST"
  });
  // type：0是所有 1是绑定了流程的表单
  export const getFormScheme = (type=0) =>
  request({
    url:baseUrl +"/form-scheme",
    method: "GET",
    params:{F_Type:type}
  });
  export const getFormSchemeInfo = (id) =>
  request({
    url:baseUrl +`/form-scheme/${id}/info`,
    method: "GET"
  });
   // type：0是所有 1是绑定了流程的表单
  export const getSystemFormScheme = (type=0) =>
  request({
    url:baseUrl +"/form-scheme/systemform",
    method: "GET",
    params:{F_Type:type}
  });
  export const getSystemFormSchemeInfo = (id) =>
  request({
    url:baseUrl +`/form-scheme/${id}/info`,
    method: "GET"
  });
export const getSystemFormInfo = (formId) =>
request({
  url:baseUrl +`/form-scheme/systemform/${formId}`,
  method: "GET"
});
  export const add = (data) =>
  request({
    url:
    baseUrl +"/workflow-scheme-info/",
    method: "POST",
    data:data
  });
  export const getInfo = (modelId) =>
  request({
    url:
    baseUrl +"/workflow-scheme-info/info/" + modelId,
    method: "GET"
  });
  export const edit = (modelId, data) =>
  request({
    url:
    baseUrl +"/workflow-scheme-info/" + modelId,
    method: "PUT",
    data:data
  });
  // 表单发起流程，获取流程信息，以及表单数据信息
  export const getCreateFormFlowInfo = (data) => request({
    url: baseUrl + `/workflow-task/form-process`,
    method: 'POST',
    data:data
  });
// export const save = (modelId, data) =>
//   request({
//     url:
//       "http://192.168.0.185:8881/nwfschemeinfo/addOrUpdate?modelId=" + modelId,
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
//     },
//     meta: {
//       isToken: false
//     },
//     data: qs.stringify(data, { arrayFormat: "indices", allowDots: true })
//   });

//获取已经流转过的节点的集合
export const getFinishedTaskNode = (processInstanceId) =>request({
    url:baseUrl +"/workflow-task/finished-task/"+processInstanceId,
    method: "GET"
});

export const getFinishedTaskXml = (deploymentId) =>request({
    url:baseUrl +"/workflow-scheme-info/json-to-xml/"+deploymentId,
    method: "GET"
});
