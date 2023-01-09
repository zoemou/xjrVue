import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取接口分页列表 */
export const getInterfaceList = (param) => request({
    url: baseUrl + '/interface/page',
    method: 'get',
    params : param
});

/* 新增接口 */
export const addInterface = (obj) => request({
    url: baseUrl + '/interface/',
    method: 'post',
    data: obj
});

/* 修改接口 */
export const updateInterface = (id,obj) => request({
    url: baseUrl + '/interface/' + id,
    method: 'put',
    data: obj
});

/* 启用任务 */
export const startTask = (id) => request({
    url: baseUrl + '/task-scheduling/' + id + '/start',
    method: 'patch'
});

/* 暂停任务 */
export const stopTask = (id) => request({
    url: baseUrl + '/task-scheduling/' + id + '/stop',
    method: 'patch'
});

/* 删除接口 */
export const deleteInterface = (id) => request({
    url: baseUrl + '/interface/' + id,
    method: 'delete'
});

/* 查看接口 */
export const getInterface = (id) => request({
    url: baseUrl + '/interface/' + id,
    method: 'get',
});

/*获取自定义接口分类*/
export const getInterfaceTypeTree = () => request({
    url: baseUrl + '/xjr-interface-category/tree',
    method: 'get',
});

/*获取自定义接口分页列表*/
export const getDesignInterfaceList = (param) => request({
    url: baseUrl + '/xjr-interface-info/customize/list',
    method: 'get',
	params : param
});

/*删除自定义接口*/
export const deleteDesignInterface = (ids) => request({
    url: baseUrl + '/xjr-interface-info/'+ids,
    method: 'delete'
});

/*禁用自定义接口*/
export const disabledInterface = (id) => request({
    url: baseUrl + `/xjr-interface-info/${id}/disabled`,
    method: 'put'
});

/*启用自定义接口*/
export const enabledInterface = (id) => request({
    url: baseUrl + `/xjr-interface-info/${id}/enabled`,
    method: 'put'
});

/*获取接口详情*/
export const getInterfaceById = (id) => request({
    url: baseUrl + '/xjr-interface-info/'+id,
    method: 'get'
});

/*获取自定义接口详情*/
export const getCustomizeInterfaceById = (id) => request({
    url: baseUrl + '/xjr-interface-info/customize/'+id,
    method: 'get'
});

/*获取所有接口分页列表*/
export const getAllInterfaceList = (param) => request({
    url: baseUrl + '/xjr-interface-info/list/all',
    method: 'get',
	params : param
});

/*新增自定义接口*/
export const addCustomizeInterface = (param) => request({
    url: baseUrl + '/xjr-interface-info/customize',
    method: 'post',
	data : param
});

/*修改自定义接口*/
export const updateCustomizeInterface = (id,param) => request({
    url: baseUrl + `/xjr-interface-info/${id}/customize`,
    method: 'put',
	data : param
});
/*获取接口详情*/
export const getInterfaceDetail = (id) => request({
    url: baseUrl + '/xjr-interface-info/'+id,
    method: 'get'
});

/*获取所有接口树结构*/
export const getInterfaceTree = (obj) => request({
    url: baseUrl + '/xjr-interface-info/tree-list/',
    method: 'get',
	params:obj
});

/*接口授权*/
export const interfaceAuth = (data) => request({
    url: baseUrl + '/interface-auth',
    method: 'post',
	data:data
});

/*获取已授权接口ids*/
export const getInterfaceAuthIds = (objectId,objectType) => request({
    url: baseUrl + `/interface-auth/${objectId}/${objectType}/auths`,
    method: 'get'
});