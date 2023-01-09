import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取日志列表 */
export const getLog = (param) => request({
    url: baseUrl + '/log',
    method: 'get',
    params : param
});

/* 清空日志列表 */
export const clearLog = (type) => request({
    url: baseUrl + '/log/clear/' + type,
    method: 'delete'
});

/* 批量删除日志列表 */
export const deleteLog = (id) => request({
    url: baseUrl + '/log/' + id,
    method: 'delete'
});



/* 编辑字典数据 */
export const editDataDictionary = (data) => request({
    url: baseUrl + '/lp-map/object',
    method: 'patch',
    data: data,
});

/* 删除字典数据 */
export const deleteDataDictionary = (id) => request({
    url: baseUrl + '/lp-map/object/' + id,
    method: 'delete'
});

/* 查询字典数据 */
export const searchDataDictionary = (id,param) => request({
    url: baseUrl + '/lp-map/object/' + id,
    method: 'get',
    params : param
});

