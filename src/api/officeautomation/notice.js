import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取公告类别*/ 
export const getNoticeCategory = (itemCode) => request({
    url: baseUrl + '/data-items/' + itemCode + '/detail' ,
    method: 'get',
}); 

/* 获取公告 */
export const getNotice = (params) => request({
    url: baseUrl + '/notice',
    method: 'get',
    params: params
});

/* 新增 */
export const addNotice = (obj) => request({
    url: baseUrl + '/notice',
    method: 'post',
    data: obj
}); 

/* 编辑 */
export const modifyNotice = (id,obj) => request({
    url: baseUrl + '/notice/' + id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const deleteNotice = (ids) => request({
    url: baseUrl + '/notice/' + ids,
    method: 'delete',
});

/*修改状态*/
export const changeStatus = (obj) => request({
    url: baseUrl + '/notice/changeStatus',
    method: 'put',
    params: obj
});