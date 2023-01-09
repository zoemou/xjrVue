import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取签章列表 */
export const getStampsList = (param) => request({
    url: baseUrl + '/stamps',
    method: 'get',
    params : param
});

/* 新增签章 */
export const addStamps = (obj) => request({
    url: baseUrl + '/stamps',
    method: 'post',
    data: obj
});

/* 修改签章 */
export const updateStamps = (id,obj) => request({
    url: baseUrl + '/stamps/' + id,
    method: 'put',
    data: obj
});

/* 启用签章 */
export const startStamps = (id) => request({
    url: baseUrl + '/stamps/' + id +'/enable',
    method: 'put'
});

/* 暂停签章 */
export const stopStamps = (id) => request({
    url: baseUrl + '/stamps/' + id +'/not-enabled',
    method: 'put'
});

/*设定默认*/
export const setDefaultStamps = (id) => request({
    url: baseUrl + '/stamps/' + id +'/set-default',
    method: 'put'
});

/*添加人员*/
export const setManagerStampsByID = (id,obj) => request({
    url: baseUrl + '/stamps/' + id +'/member',
    method: 'put',
	data:obj
});
/*获取人员*/
export const getManagerStampsByID = (id) => request({
    url: baseUrl + '/stamps/' + id +'/member',
    method: 'get'
});
/*指定维护人员*/
export const setManagerStamps = (obj) => request({
    url: baseUrl + '/stamps/set-manager',
    method: 'patch',
	data:obj
});

/* 删除签章 */
export const deleteStamps = (id) => request({
    url: baseUrl + '/stamps/' + id,
    method: 'delete'
});

//获取签章图片
export const getStampsImgUrl = (id) => request({
    url: baseUrl + '/stamps/stamp-img?id='+id,
    method: 'get'
});