import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取自定义表单详情列表 不分页 */
export const getFormSchemeTree = () => request({
  url: baseUrl + '/form-scheme',
  method: 'get'
});

/* 获取表单权限列表 */
export const getFormRelation = (param) => request({
  url: baseUrl + '/form-relation',
  method: 'get',
  params: param
});


/* 获取条件 */
export const getCondition = (id) => request({
  url: baseUrl + '/data-condition/' + id,
  method: 'get'
});

/* 获取自定义表单模板 */
export const getFormScheme = (id) => request({
  url: baseUrl + '/form-scheme/' + id,
  method: 'get'
});

export function getFormSchemeFn (id) {
  return request(`${baseUrl}/form-scheme/${id}`);
}

export function getFormSchemeInfo (id) {
  return request(`${baseUrl}/form-scheme/${id}/info`);
}

/* 修改数据权限 */
export const updateDataRelation = (id, obj) => request({
  url: baseUrl + '/data-relation/' + id,
  method: 'put',
  data: obj
});

/* 删除数据权限 */
export const deleteDataRelation = (id) => request({
  url: baseUrl + '/data-relation/' + id,
  method: 'delete'
});
