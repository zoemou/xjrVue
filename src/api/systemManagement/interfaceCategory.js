import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取接口分类树*/
export const getInterfaceCategoryList = (param) => request({
    url: baseUrl + '/xjr-interface-category/tree',
    method: 'get',
    params: param
})

/*新增 */
export const addInterfaceCategory = (obj) => request ({
    url: baseUrl + '/xjr-interface-category/',
    method: 'post',
    data: obj 
})

/*修改 */
export const updateInterfaceCategory = (id,obj) => request({
    url: baseUrl + '/xjr-interface-category/' + id,
    method: 'put',
    data: obj
})

/*删除 */
export const deleteInterfaceCategory = (id) => request({
    url: baseUrl + '/xjr-interface-category/' + id,
    method: 'delete'
})