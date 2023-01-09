import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取语言类型列表 */
export const getLanguageType = (obj) => request({
    url: baseUrl + '/lg-type',
    method: 'get',
    params: obj
});

/* 新增语言类型 */
export const addLanguageType = (obj) => request({
    url: baseUrl + '/lg-type',
    method: 'post',
    data: obj
});

/* 编辑语言类型 */
export const editLanguageType = (id,obj) => request({
    url: baseUrl + '/lg-type/' + id,
    method: 'put',
    data : obj
});

/* 删除语言类型 */
export const deleteLanguageType = (id) => request({
    url: baseUrl + '/lg-type/' + id,
    method: 'delete'
});

/* 设为主语言 */
export const setLanguage = (id) => request({
    url: baseUrl + '/lg-type/' + id + '/main',
    method: 'put'
});
