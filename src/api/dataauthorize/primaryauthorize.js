import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import id from "element-ui/src/locale/lang/id";

/* 获取接口列表 */
export const getInterFaceTree = () => request({
    url: baseUrl + '/interface',
    method: 'get'
});

/* 获取数据权限列表 */
export const getDataRelation = (param) => request({
    url: baseUrl + '/data-relation',
    method: 'get',
    params : param
});

/* 查询接口 */
export const findInterFace = (id) => request({
    url: baseUrl + '/interface/' + id,
    method: 'get'
});

/* 获取条件 */
export const getCondition = (id) => request({
    url: baseUrl + '/data-condition/' + id,
    method: 'get'
});

/* 修改数据权限 */
export const updateDataRelation = (id,obj) => request({
    url: baseUrl + '/data-relation/' + id,
    method: 'put',
    data:obj
});

/* 删除数据权限 */
export const deleteDataRelation = (id) => request({
    url: baseUrl + '/data-relation/' + id,
    method: 'delete'
});


/* 获取自定义表单权限列表 */
export const getFormRelationTree = () => request({
    url: baseUrl + '/form-relation',
    method: 'get'
});