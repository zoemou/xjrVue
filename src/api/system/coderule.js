import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取编码规则 分页 */
export const getCodeRule = (param) => request({
    url: baseUrl + '/code-rules',
    method: 'get',
    params: param
});

/* 获取编码规则 不分页*/
export const getCodeRules = (param) => request({
    url: baseUrl + '/code-rules/list',
    method: 'get',
    params: param
});

/* 新增编码规则 */
export const addCodeRule = (obj) => request({
    url: baseUrl + '/code-rules',
    method: 'post',
    data: obj
});

/* 编辑字典数据 */
export const editCodeRule = (id,data) => request({
    url: baseUrl + '/code-rules/' + id,
    method: 'put',
    data: data,
});

/* 删除字典数据 */
export const deleteCodeRule = (id) => request({
    url: baseUrl + '/code-rules/' + id,
    method: 'delete'
});

/* 查询字典数据 */
export const searchDataDictionary = (id,param) => request({
    url: baseUrl + '/lp-map/object/' + id,
    method: 'get',
    params : param
});

/* 获取自动编码 */
export const getAutoCode = (codeRule) => request({
    url: baseUrl + '/code-rules/' + codeRule + '/gen',
    method: 'get'
});

