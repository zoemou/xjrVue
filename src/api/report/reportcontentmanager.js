import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 报表管理 */


/* 根据id获取报表*/
export const getReportContentById = (id) => request({
    url: baseUrl + `/report-content/${id}`,
    method: 'get',
}); 

/* 获取报表信息列表*/
export const getReportContent = () => request({
    url: baseUrl + '/report-content',
    method: 'get',
}); 

/* 新增 */
export const addReport = (obj) => request({
    url: baseUrl + '/report-content',
    method: 'post',
    data: obj
}); 

/* 编辑 */
export const modifyReport = (id,obj) => request({
    url: baseUrl + '/report-content/' + id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const deleteReport = (ids) => request({
    url: baseUrl + '/report-content/' + ids,
    method: 'delete',
});
