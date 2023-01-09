import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取语言类型列表 */
export const getDataDictionaryTree = () => request({
    url: baseUrl + '/data-items/tree',
    method: 'get'
});

/* 获取语言类型 */
export const getLgType = (data) => request({
    url: baseUrl + '/lg-type',
    method: 'get',
});

/* 获取字典数据 */
export const getDataDictionary = (id) => request({
    url: baseUrl + '/lp-map/object/' + id,
    method: 'get'
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

/* 获取数据字典分类列表 */
export const getDictionaryCategory = () => request({
    url: baseUrl + '/data-items',
    method: 'get'
});

/* 根据itemcode 获取数据字典详情列表 */
export const getDictCateByCode = (code) => request({
    url: baseUrl + '/data-items/'+code+'/detail',
    method: 'get'
});

/* 根据itemcode获取数据字典分类 详情 */
export const getDictInfoByCode = (code) => request({
    url: baseUrl + '/data-items/'+code+'/info',
    method: 'get'
});
// 根据类型获取移动功能菜单列表数据
export const getAppFunc = (itemCode) => request({
    url: baseUrl + '/data-items/'+ itemCode +'/detail',
    method: 'get'
});