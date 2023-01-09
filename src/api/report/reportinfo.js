import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 报表管理 */
/* 获取报表分类树 */
export const getReportTree = () => request({
    url: baseUrl + '/report-info/tree',
    method: 'get',
});


/* 获取报表类型*/ 
export const getReportType = (itemCode) => request({
    url: baseUrl + '/data-items/' + itemCode + '/detail' ,
    method: 'get',
}); 

/* 新增 */
export const addReport = (obj) => request({
    url: baseUrl + '/report-info',
    method: 'post',
    data: obj
}); 

/* 编辑 */
export const modifyReport = (id,obj) => request({
    url: baseUrl + '/report-info/' + id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const deleteReport = (ids) => request({
    url: baseUrl + '/report-info/' + ids,
    method: 'delete',
});