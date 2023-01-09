import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取租户 */
export const getTenant = (params) => request({
    url: baseUrl + '/tenant',
    method: 'get',
    params: params
});

/* 新增 */
export const addTenant = (obj) => request({
    url: baseUrl + '/tenant',
    method: 'post',
    data: obj
});

/* 编辑 */
export const modifyTenant = (id,obj) => request({
    url: baseUrl + '/tenant/' + id,
    method: 'put',
    data: obj
});

/* 删除 */
export const deleteTenant = (ids) => request({
    url: baseUrl + '/tenant/' + ids,
    method: 'delete',
});

/* 判断账户是否已存在 */
export const userIsExit = (obj) => request({
    url: baseUrl + '/tenant/user-isexit',
    method: 'post',
    data: obj
});

/* 根据租户ID获取用户 */
export const getUserInfoById = (id, code) => request({
    url: baseUrl + `/tenant/${id}/${code}`,
    method: 'get'
});

export const updateTenantStatus = (id, status) => request({
    url: baseUrl + `/tenant/${id}/${status}`,
    method: 'patch'
});

/* 新增管理员 */
export const addTenantUser = (obj) => request({
    url: baseUrl + '/tenant/user',
    method: 'post',
    data: obj
});

/* 修改管理员密码 */
export const modifyTenantUser = (id, password) => request({
    url: baseUrl + `/tenant/user/${id}`,
    method: 'patch',
    data :password
});

/* 删除管理员 */
export const deleteTenantUser = (ids) => request({
    url: baseUrl + '/tenant/user/' + ids,
    method: 'delete',
});