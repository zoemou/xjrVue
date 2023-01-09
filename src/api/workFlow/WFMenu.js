import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const getWorkflowRelation = (param) => request({
    url: baseUrl + '/workflow-relation',
    method: 'get',
    params : param
});
export const addWorkflowRelation = (data) => request({
  url: baseUrl + '/workflow-relation',
  method: 'post',
  data : data
});
export const updateWorkflowRelation = (id,data) => request({
  url: baseUrl + '/workflow-relation/'+id,
  method: 'put',
  data : data
});
export const deleteWorkflowRelation = (id) => request({
  url: baseUrl + '/workflow-relation/'+id,
  method: 'delete'
});
export const getFormInfo = (nwfSchemeInfoId) => request({
  url: baseUrl + '/workflow-relation/formInfo',
  method: 'get',
  params : {nwfSchemeInfoId}
});
// 获取 模板权限人
export const getTemplateAuthUser = (nwfSchemeInfoId) => request({
  url: baseUrl + '/workflow-Auth/auth-user/nwfSchemeInfoId',
  method: 'get',
  params : {nwfSchemeInfoId}
});
//F_Id 查数据的接口
export const getWorkflowRelationInfo = (id) => request({
  url: baseUrl + '/workflow-relation/info/F_Id',
  method: 'get',
  params : {id}
});