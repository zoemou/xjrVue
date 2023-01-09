import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 查询所有权限系统 */
export const getSubSystem = () => request({
    url: baseUrl + `/subsystem`,
    method: 'get'
});

/* 新增 */
export const addSubSystem = (param) => request({
    url: baseUrl + `/subsystem`,
    method: 'post',
    params: param
});

/* 删除 */
export const deleteSubSystem = (systemIds) => request({
    url: baseUrl + `/subsystem/${systemIds}`,
    method: 'delete'
});

/* 修改 */
export const updateSubSystem = (systemId,param) => request({
    url: baseUrl + `/subsystem/${systemId}`,
    method: 'put',
    params: param
});
