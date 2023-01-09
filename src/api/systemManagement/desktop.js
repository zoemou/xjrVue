import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取所有桌面设计 */
export const getDesktopScheme = (param) => request({
    url: baseUrl + '/desktop-scheme/list',
    method: 'get',
	params: param
});

/* 获取历史记录 */
export const getDesktopHistory = (obj) => request({
    url: baseUrl + '/desktop-schemeinfo/history',
    method: 'get',
	params: obj
});

/* 获取桌面设计详情 */
export const getDesktopInfo = (id) => request({
    url: baseUrl + '/desktop-scheme/' + id,
    method: 'get',
});


/* 根据菜单id获取桌面设计JSON */
export const getDesktopByMId = (id) => request({
    url: baseUrl + '/desktop-scheme/content/' + id,
    method: 'get',
});

/* 新增桌面设计 */
 export const addDesktop = (obj) => request({
    url: baseUrl + '/desktop-scheme',
    method: 'post',
    data: obj
}); 

/* 编辑桌面设计*/
 export const modifyDesktop = (obj) => request({
    url: baseUrl + '/desktop-scheme',
    method: 'put',
    data: obj
}); 

/* 删除桌面设计 */
export const deleteDesktop = (ids) => request({
    url: baseUrl + '/desktop-scheme/' + ids,
    method: 'delete',
});

/* 设置为当前版本*/
export const setNew = (id) => request({
    url: baseUrl + '/desktop-schemeinfo/setNew',
    method: 'put',
	params: id
});

/* 复制桌面设计 */
export const copyDesktop = (id) => request({
    url: baseUrl + '/desktop-scheme/copy',
    method: 'put',
	params: id
});

/* 设置为系统默认首页 */
export const defaultHomePage = (id) => request({
    url: baseUrl + '/desktop-scheme/default',
    method: 'put',
	params: {id}
});
