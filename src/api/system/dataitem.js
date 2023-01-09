import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取数据字典树 */
export const getDataItemTree = () => request({
    url: baseUrl + '/data-items/tree',
    method: 'get',
});

export function getDataItemTreeFn() {
    return request(`${baseUrl}/data-items/tree`)
}

/* 获取数据字典 */
export const getDataItem = (code, keyword = '') => request({
    url: baseUrl + '/data-items/' + code + '/detail/tree?keyword=' + keyword,
    method: 'get'
});
/* 获取数据字典详情列表 */
export const getDataDetail = (code) => request({
    url: baseUrl + '/data-items/' + code + '/detail',
    method: 'get'
});

/* 新增数据字典 */
export const addDataItem = (data) => request({
    url: baseUrl + '/data-item-detail',
    method: 'post',
    data
});

/* 编辑字典数据 */
export const editDataItem = (id,obj) => request({
    url: baseUrl + '/data-item-detail/' + id,
    method: 'put',
    data: obj,
});

/* 删除字典数据 */
export const deleteDataItem = (id) => request({
    url: baseUrl + '/data-item-detail/' + id,
    method: 'delete'
});

/* 查询字典数据 */
export const searchDataDictionary = (id,param) => request({
    url: baseUrl + '/lp-map/object/' + id,
    method: 'get',
    params : param
});

// 获取数据字典分类 树
export function getDataTree(params){
    return request(`${baseUrl}/data-items/tree`,{
        params
    })
}
// 删除数据字典详情
export function delDetail(ids){
    return request(`${baseUrl}/data-items/${ids}`, {
        method: 'DELETE'
    })
}
// 修改数据字典分类
export function updateDetail(ids, data){
    return request(`${baseUrl}/data-items/${ids}`,{
        method: 'put',
        data
    })
}
// 保存数据字典分类
export function setDetail(data){
    return request(`${baseUrl}/data-items`,{
        method: 'post',
        data
    })
}

