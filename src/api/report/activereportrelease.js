import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 报表发布 */
/* 获取所有报表 */
export const getReportRelease = (params) => request({
    url: baseUrl + '/reports-release',
    method: 'get',
    params: params
});

/* 新增 */
export const addReportRelease = (obj) => request({
    url: baseUrl + '/reports-release',
    method: 'post',
    data: obj
}); 

/* 编辑 */
export const modifyReportRelease = (id,obj) => request({
    url: baseUrl + '/reports-release/' + id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const deleteReportRelease = (ids) => request({
    url: baseUrl + '/reports-release/' + ids,
    method: 'delete',
});