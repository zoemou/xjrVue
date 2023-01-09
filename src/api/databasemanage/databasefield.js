import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取常用字段 */
export const getDbField = (obj) => request({
    url: baseUrl + '/database-field',
    method: 'get',
    params: obj
});

/* 新增常用字段 */
export const addDbField = (obj) => request({
    url: baseUrl + '/database-field',
    method: 'post',
    data: obj
});

/* 编辑常用字段 */
export const editDbField = (id,obj) => request({
    url: baseUrl + '/database-field/' + id,
    method: 'put',
    data : obj
});

/* 删除常用字段 */
export const deleteDbField = (id) => request({
    url: baseUrl + '/database-field/' + id,
    method: 'delete'
});

/*根据数据库表名获取表字段*/
export const getDbFieldById= (id) => request({
    url: baseUrl + '/database-field/' + id,
    method: 'get',
});

