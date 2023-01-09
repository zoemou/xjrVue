import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取角色列表 */
export const getRoles = (param) => request({
    url: baseUrl + '/roles/page',
    method: 'get',
    params: param
});

/* 获取角色列表 不分页*/
export const getRolesList = () => request({
    url: baseUrl + '/roles',
    method: 'get'
});

/* 新增角色 */
/*let obj = {f_EnCode: '', f_FullName: '', f_Description: '', f_Category: 1, f_SortCode: 0}*/
export const addRoles = (obj) => request({
    url: baseUrl + '/roles',
    method: 'post',
    data: obj
});

/* 编辑角色 */
export const modifyRoles = (id, formData) => request({
    url: baseUrl + '/roles/' + id,
    method: 'put',
    data: formData
});

/* 删除角色 */
export const deleteRoles = (id, formData) => request({
    url: baseUrl + '/roles/' + id,
    method: 'delete',
    data: formData
});

/* 查询角色 */
export const searchRoles = (param) => request({
    url: baseUrl + '/roles/page',
    method: 'get',
    params: param
});

/* 查看成员 */
export const lookUser = (id) => request({
    url: baseUrl + '/roles/' + id + '/users',
    method: 'get',
});

/* 添加成员 */
export const addUser = (data) => request({
    url: baseUrl + '/roles/users',
    method: 'post',
    data: data
});

/* 获取角色权限 */
export const getRoleAuthorize = (id) => request({
    url: baseUrl + '/roles/' + id + '/permission',
    method: 'get',
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
export const getFuncAppTree = (id,type) => request({
    url: baseUrl + '/data-authorize/'+ id + '/' + type + '/app-function',
    method: 'get',
});
/* 数据权限修改=>保存 */
export const saveDataAuth = (data) => request({
    url: baseUrl + '/data-authorize/',
    data: data,
    method: 'put',
});

/* 查找当前用户首页配置信息 */
export const getIndexPages = (keyword) => request({
    url: baseUrl + '/visual-release/home/?keyword='+keyword,
    method: 'get'
});

/* 根据角色增加BI首页模板 */
export const addBiTplByRole = (data) => request({
    url: baseUrl + '/visual-relation',
    data: data,
    method: 'post',
});

/* 删除用户/角色BI看板的授权 */
export const cancelBiTplByRole = (data) => request({
    url: baseUrl + '/visual-relation',
    data: data,
    method: 'delete',
});

/* 用户/角色BI看板的授权 已勾选*/
export const getDefaultIndexConf = (objectId,category) => request({
    url: baseUrl + `/visual-relation/${objectId}/obj/${category}`,
    method: 'get',
});