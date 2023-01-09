import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/*获取接口管理列表数据 */
export const getInterfaceInfoList = (param) => request({
    url: baseUrl + '/xjr-interface-info/list',
    method: 'get',
    params: param
});

/*查看 */
export const getInterfaceInfo = (id) => request({
    url: baseUrl + '/xjr-interface-info/' +id,
    method: 'get'
})

/*新增 */
export const addInterfaceInfo = (obj) => request({
    url: baseUrl + '/xjr-interface-info/',
    method: 'post',
    data: obj
});

/*修改 */
export const updateInterfaceInfo = (id,obj) => request({
    url: baseUrl + '/xjr-interface-info/' + id,
    method: 'put',
    data: obj
});

/*修改系统接口 */
export const updateSysInterfaceInfo = (id,obj) => request({
    url: baseUrl + '/xjr-interface-info/' + id+'/system',
    method: 'put',
    data: obj
});

/*启用接口 */
export const startInterface = (id) => request({
    url: baseUrl + '/xjr-interface-info/' + id +'/enabled',
    method: 'put'
})

/*停用接口 */
export const stopInterface = (id) => request({
    url: baseUrl + '/xjr-interface-info/' + id +'/disabled',
    method: 'put'
})

/*删除 */
export const deleteInterfaceInfo = (id) => request({
    url: baseUrl + '/xjr-interface-info/' + id,
    method: 'delete'
})