import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取列表 */
export const getFunc  = (param) => request({
    url: baseUrl + '/app-func/page',
    method: 'get',
    params : param
});
/* 新增 */
export const addFunc = (obj) => request({
    url: baseUrl + '/app-func',
    method: 'post',
    data: obj
});

/* 修改 */
export const updateFunc = (id,obj) => request({
    url: baseUrl + '/app-func/' + id,
    method: 'put',
    data: obj
});
/* 获取具体信息 */
export const getFuncInfo = (id) => request({
    url: baseUrl + '/app-func/' + id + '/info',
    method: 'get',
});
/* 删除 */
export const deleteFunc = (id) => request({
    url: baseUrl + '/app-func/' + id,
    method: 'delete'
});

/*获取移动端功能分类*/
export const getFuncCate  = () => request({
    url: baseUrl + '/data-items/function/detail',
    method: 'get'
});

/*根据分类获取菜单*/
export const getFuncByCate  = (type) => request({
    url: baseUrl + "/app-func/" + type,
    method: 'get'
});

/*获取移动端功能带分类*/
export const getAllFuncByCate  = () => request({
    url: baseUrl + "/app-func/category-tree",
    method: 'get'
});