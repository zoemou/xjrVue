import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 报表发布 */
/* 获取所有报表 */
export const getReport = (params) => request({
    url: baseUrl + '/reports-relation',
    method: 'get',
    params: params
});

/* 新增 */
export const addReport = (obj) => request({
    url: baseUrl + '/reports-relation',
    method: 'post',
    data: obj
}); 

/* 编辑 */
export const modifyReport = (id,obj) => request({
    url: baseUrl + '/reports-relation/' + id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const deleteReport = (ids) => request({
    url: baseUrl + '/reports-relation/' + ids,
    method: 'delete',
});