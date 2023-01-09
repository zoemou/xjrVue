import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取公司树 */
export const getCompaniesTree = (param) => request({
    url: baseUrl + '/companies/departments/tree',
    method: 'get',
	params:param
});
export const getAllCompaniesTree = () => request({
    url: baseUrl + '/companies/tree',
    method: 'get'
});

/* 获取公司用户信息 */
export const getCompaniesUser = (id, param) => request({
    url: baseUrl + '/companies/' + id + '/users',
    method: 'get',
    params: param
});

export const getCompaniesUserList = (param) => request({
    url: baseUrl + '/users/page',
    method: 'get',
    params: param
});

/* 获取维保人员 */
export const getMaintenanceUserList = () => request({
    url: baseUrl + '/users/maintenance_user',
    method: 'get'
});

/* 获取公司部门信息 */
export const getCompaniesDepartments = (id) => request({
    url: baseUrl + '/companies/' + id + '/departments/tree',
    method: 'get',
});

/* 新增用户 */

export const postUser = (obj) => request({
    url: baseUrl + '/users',
    method: 'post',
    data: obj
});

/* 编辑用户 */
export const modifyUser = (id, obj) => request({
    url: baseUrl + '/users/' + id,
    method: 'put',
    data: obj
});

/* 删除用户 */
export const deleteUser = (ids) => request({
    url: baseUrl + '/users/' + ids,
    method: 'delete',
});

/* 启用，禁用账户 */
export const switchUser = (id) => request({
    url: baseUrl + '/users/' + id + '/enabled',
    method: 'post',
});

/* 重置密码 */
export const resetPassword = (id) => request({
    url: baseUrl + '/users/' + id + '/password',
    method: 'post',
});

/* 获取用户权限 */
export const getUserAuthorize = (id) => request({
    url: baseUrl + '/users/' + id + '/permission',
    method: 'get',
});


/* 同步微信用户 */
export const syncWeChatUser = (CompanyId) => request({
    url: baseUrl + `/wechat-work/sync-user/${CompanyId}`,
    method: 'put'
});
/* 获取微信用户列表 */
export const getWeChatUser = (param) => request({
    url: baseUrl + '/wechat-work',
    method: 'get',
    params: param
});

/* 同步微信部门 */
export const syncWeChatDepartment = () => request({
    url: baseUrl + '/wechat-work/sync-department',
    method: 'post',
});
/* 获取微信部门列表 */
export const getWeChatDepartment = (param) => request({
    url: baseUrl + '/wechat-work/departments',
    method: 'get',
    params: param
});

/* 同步钉钉用户 */
export const syncDingTalkUser = (CompanyId) => request({
    url: baseUrl +`/ding-talk/sync-user/${CompanyId}`,
    method: 'put'
});
/* 获取钉钉用户列表 */
export const getDingTalkUser = (param) => request({
    url: baseUrl + '/ding-talk',
    method: 'get',
    params: param
});

/* 同步钉钉部门 */
export const syncDingTalkDepartment = () => request({
    url: baseUrl + '/ding-talk/sync-department',
    method: 'post',
});
/* 获取钉钉部门列表 */
export const getDingTalkDepartment = (param) => request({
    url: baseUrl + '/ding-talk/departments',
    method: 'get',
    params: param
});


/* 批量查询用户信息 ids用逗号隔开 */
export const getMultiMaintainerUser = (ids) => request({
    url: baseUrl + `/users/multi/${ids}`,
    method: 'get'
});

/* 获取所有签章维护人员信息 */
// export const getMaintainerUser = () => request({
//     url: baseUrl + '/users/stamp-manager',
//     method: 'get'
// });
/* 获取所有签章维护人员信息 */
export const getMaintainerUser = (id) => request({
    url: baseUrl + `/stamps/${id}/maintain`,
    method: 'get'
});
/* 新增签章指定维护人关系 */

export const setMaintainerUser = (id,data) => request({
    url: baseUrl + `/stamps/${id}/maintain`,
    method: 'put',
    data: data
});

/* 查找当前用户首页配置信息 */
export const getIndexPages = (keyword,page) => request({
    url: baseUrl + '/visual-relation/current-visual/?keyword='+keyword+'&limit='+page.limit+'&size='+page.size,
    method: 'get'
});

/* 更改模板设置 */
export const changeIndexSetting = (visualId, param) => request({
    url: baseUrl + '/visual-homerelation/'+visualId+'/cur',
    method: 'PUT',
    params: param
});

/* 查询首页默认配置 */
export const getIndexDefaultConf = (systemId) => request({
    url: baseUrl + `/visual-homerelation/current/?systemId=${systemId}`,
    method: 'get'
});

