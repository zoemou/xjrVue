import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取菜单树 */
export const getMenuTree = () => request({
    url: baseUrl + '/modules',
    method: 'get',
});

/* 获取公司用户信息 */
/* export const getCompaniesUser = (id,param) => request({
    url: baseUrl + '/companies/' + id + '/users',
    method: 'get',
    params: param
}); */

/* 获取菜单按钮 */
export const getMenuButton = (id) => request({
    url: baseUrl + '/modules/buttons/' + id,
    method: 'get',
});

/* 获取表单 */
export const getMenuForm = (id) => request({
    url: baseUrl + '/modules/fomrs/' + id,
    method: 'get',
});

/* 获取字段 */
export const getMenuColumns = (id) => request({
    url: baseUrl + '/modules/columns/' + id,
    method: 'get',
});

/* 获取菜单详情 */
export const getMenuInfo = (id) => request({
    url: baseUrl + '/modules/' + id,
    method: 'get',
});

/* 新增菜单 */
 export const postMenu = (obj) => request({
    url: baseUrl + '/modules',
    method: 'post',
    data: obj
}); 

/* 编辑菜单 */
 export const modifyMenu = (id,obj) => request({
    url: baseUrl + '/modules/' + id,
    method: 'put',
    data: obj
}); 

/* 删除菜单 */
export const deleteMenu = (ids) => request({
    url: baseUrl + '/modules/' + ids,
    method: 'delete',
});

/* 启用，禁用账户 */
export const switchUser = (id) => request({
    url: baseUrl + '/users/' + id +'/enabled',
    method: 'patch',
});

/* 重置密码 */
export const resetPassword = (id) => request({
    url: baseUrl + '/users/' + id +'/password',
    method: 'patch',
});

/* 根据系统获取菜单树 */
export const getMenuTreeBySystem = (systemId) => request({
    url: baseUrl + `/modules/${systemId}/system`,
    method: 'get',
});

/* 获取所有翻译项目 */
export const getAllLgMark = () => request({
    url: baseUrl + `/modules/${systemId}/system`,
    method: 'get',
});

/* 获取表格展示列 */
export const getShowColumns = id => request({
    url: baseUrl + `/modules/columns-display/${id}`,
    method: 'get',
});

