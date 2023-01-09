import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取日程*/ 
export const getSchedule = () => request({
    url: baseUrl + '/oa-schedule' ,
    method: 'get',
}); 

/* 新增 */
export const addSchedule = (obj) => request({
    url: baseUrl + '/oa-schedule',
    method: 'post',
    data: obj
}); 

/* 修改 */
export const updateSchedule = (id,obj) => request({
    url: baseUrl + '/oa-schedule/'+id,
    method: 'put',
    data: obj
}); 

/* 删除 */
export const delSchedule = (id) => request({
    url: baseUrl + '/oa-schedule/'+id,
    method: 'delete'
}); 