import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取权限信息 */
export const getModulesAll = () => request({
    url: baseUrl + '/modules/all',
    method: 'get',
});

/* 获取所有权限 */
export const getAuthorizes = (type, id) => request({
    url: baseUrl + '/authorizes/' + type + '/' + id,
    method: 'get',
    // params: { 'objectType': type, 'objectId': id }
});

/* 设置所有权限 */
export const postAuthorizes = (id, type, obj) => request({
    url: baseUrl + '/authorizes',
    method: 'post',
    data: { 'objectId': id, 'objectType': type, 'itemJson': obj }
});

/* 设置APP权限 */
export const postAppAuthorizes = (id, type, obj) => request({
  url: baseUrl + '/authorizes/',
  method: 'post',
  data: { 'objectId': id, 'objectType': type, 'itemJson': obj }
});

/* 获取我的app权限 */
export const getMyModulesByApp = (objectId,objectType) => request({
  url: baseUrl + `/authorizes/app/${objectType}/${objectId}`,
  method: 'get'
});

/* 获取租户权限 */
export const getAllModuleByTenantId = (id) => request({
    url: baseUrl + '/modules/all/' + id ,
    method: 'get',
});

/* 获取用户可有功能权限 */
export const getAuthorized = () => request({
    url: baseUrl + '/modules/current/authorized',
    method: 'get',
});

/* 获取权限信息根据APP */
export const getModulesByApp = () => request({
    url: baseUrl + `/app-func`,
    method: 'get',
});
