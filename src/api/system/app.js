import request from '@/router/axios';
import { baseUrl } from '@/config/env';
// 移动端菜单

/* 获取权限信息 */
export const getModulesAll = () => request({
  url: baseUrl + '/app-func/category-tree',
  method: 'get',
});
/* 获取所有权限 */
export const getAuthorizes = (type, id) => request({
  url: baseUrl + '/authorizes/app/' + type + '/' + id,
  method: 'get'
});
/* 获取数据权限功能菜单 */
/**
 * @params id    userId或者roleId
 * @params type  0:用户 1:角色
 * **/
 export const getFuncTree = (id,type) => request({
  url: baseUrl + '/data-authorize/'+ id + '/' + type + '/menu',
  method: 'get',
});
/* 数据权限修改=>保存 */
export const saveDataAuth = (data) => request({
  url: baseUrl + '/data-authorize/',
  data: data,
  method: 'put',
});

/* 设置APP权限 */
export const postAppAuthorizes = (id, type, obj) => request({
  url: baseUrl + '/authorizes',
  method: 'post',
  data: { 'objectId': id, 'objectType': type, 'itemJson': obj }
});