import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import qs from "qs";
/* 获取表单列表分页 */
export function getFormRelationByPage(params) {
  return request(`${baseUrl}/form-relation`, {
    params
  })
}
/* 新增表单管理 */
export const addFormRelation = (param) => request({
  url: baseUrl + '/form-relation',
  method: 'post',
  data: param
});

/* 修改表单管理 */
export const updateFormRelation = (id, param) => request({
  url: baseUrl + '/form-relation/' + id,
  method: 'put',
  data: param
});

/* 删除表单管理 */
export const deleteFormRelation = (ids) => request({
  url: baseUrl + '/form-relation/' + ids,
  method: 'delete',
});
/* 根据菜单id获取表单 */
export const getFormRelation = (id) => request({
  url: baseUrl + '/form-scheme/getFormInfo/' + id,
  method: 'get'
});

/* 获取自定义表单列表分页 */
export const getFormSchemeByPage = (param) => request({
  url: baseUrl + '/form-scheme/page',
  method: 'get',
  params: param
});

/* 新增自定义表单 */
export const addFormScheme = (param) => request({
  url: `${baseUrl}/${param.tableInfo ? 'form-scheme/customtable' : 'form-scheme'}`,
  method: 'post',
  data: param
});
/* 新增自定义表单 */
export function addFormSchemeFn (data) {
  return request(`${baseUrl}/form-scheme`,{
    method: 'post',
    data
  });
}

/* 修改自定义表单 */
export const updateFormScheme = (id, param) => request({
  url: `${baseUrl}/${param.tableInfo ? 'form-scheme/customtable' : 'form-scheme'}/${id}`,
  method: 'put',
  data: param
});

/* 删除自定义表单 */
export const deleteFormScheme = (ids) => request({
  url: baseUrl + '/form-scheme/' + ids,
  method: 'delete',
});

/* 修改启用状态 1 启用 0 不启用 */
export const setEnable = (id, mark) => request({
  url: baseUrl + '/form-scheme/' + id + '/set-enable/' + mark,
  method: 'put'
});

/* 设为当前版本 */
export const setDefault = (id, schemeId) => request({
  url: baseUrl + '/form-scheme/' + id + '/set-default/' + schemeId,
  method: 'patch'
});

/* 获取自定义表单历史记录 */
export const getFormSchemeHistory = (id) => request({
  url: baseUrl + '/form-scheme/' + id + '/history',
  method: 'get',
});

/* 获取自定义表单模板 */
export const getFormSchemeInfo = (id) => request({
  url: baseUrl + '/form-scheme/' + id + '/info',
  method: 'get',
});
/* 获取自定义表单模板 */
export function getFormSchemeInfoFn (id) {
  return request(`${baseUrl}/form-scheme/${id}/info`);
}

// 保存表单实例
export const postAddorupdateFormdata = ({F_FormId,...param}) => request({
  url: baseUrl + `/form-scheme/${F_FormId}/instance-form-list`,
  method: 'POST',
  data: param
});
export const putAddorupdateFormdata = ({F_FormId,primaryKey,...param}) => request({
  url: baseUrl + `/form-scheme/${F_FormId}/instance-form-list/${primaryKey}`,
  method: 'PUT',
  data: param
});
// 系统表单
export const getSystemFormdata = ({F_FormId,idKey}) => request({
  url: baseUrl + `/${F_FormId}/${idKey}`,
  method: 'GET',
  data: param
});
export const postSystemFormdata = ({F_url,...param}) => request({
  url: baseUrl + `/${F_url}`,
  method: 'POST',
  data: param
});
export const putSystemFormdata = ({F_url,idKey,...param}) => request({
  url: baseUrl + `/${F_url}/${idKey}`,
  method: 'PUT',
  data: param
});
//系统表单的id （根据菜单id【moduleid】）
export const getSystemFormId = (moduleid) => request({
  url: baseUrl + `/form-scheme/getBySchemeId/${moduleid}`,
  method: 'GET'
});
// 发起流程
export const postCreateProcess = (data) => request({
  url: baseUrl + '/nwfschemeinfo/createProcess',
  method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    meta: {
      isToken: false,
    },
    data: qs.stringify(data),
});
// 获取自定义表单
export function getFormSchemeSchemeId (schemeId) {
  return request(`${baseUrl}/form-scheme/${schemeId}`);
}

//根据文件夹获取file地址
export function getFormUploadFiles (FolderId) {
  return request(`${baseUrl}/annexes-files/url/${FolderId}`);
}

/*获取文件列表 */
export const getFileList = (folderId) => request({
  url: `${baseUrl}/annexes-files/url/${folderId}`,
  method: 'GET'
});

export const delSingleAction = (id) => request({
  url: `${baseUrl}/annexes-files/${id}`,
  method: 'DELETE'
});

/*获取绑定的字段 */
export const getBindfields = (param) => request({
  url: `${baseUrl}/form-scheme/getBindfields`,
  method: 'GET',
  params: param
});

/*查询自定义表单列表数据根据字段 */
export const getDataByBindfields = (param) => request({
  url: `${baseUrl}/form-scheme/instance-form-list`,
  method: 'GET',
  params: param
});
