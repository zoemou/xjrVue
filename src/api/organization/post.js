import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取岗位 */
export const getPosts = (id, param) => request({
    url: baseUrl + '/companies/' + id + '/posts/tree',
    method: 'get',
    params: param
});
export const getDepartmentPosts = (companiesId, departmentId) => request({
    url: baseUrl + '/companies/' + companiesId + '/posts/tree?Department_Id=' + departmentId,
    method: 'get'
});
/* 新增岗位 */
/*let obj = {f_EnCode: '', f_FullName: '', f_Description: '', f_Category: 1, f_SortCode: 0}*/
export const addPosts = (obj) => request({
    url: baseUrl + '/posts',
    method: 'post',
    data: obj
});

/* 编辑角色 */
export const modifyPosts = (id, formData) => request({
    url: baseUrl + '/posts/' + id,
    method: 'put',
    data: formData
});

/* 删除角色 */
export const deletePosts = (id, formData) => request({
    url: baseUrl + '/posts/' + id,
    method: 'delete',
    data: formData
});

/* 查看成员 */
export const lookUser = (id) => request({
    url: baseUrl + '/posts/' + id + '/users',
    method: 'get',
});

/* 添加成员 */
export const addUser = (data) => request({
    url: baseUrl + '/posts/users',
    method: 'post',
    data: data
});

/* 获取下一级岗位列表 */
export const getLowerPost = (departmentId, id) => request({
    url: `${baseUrl}/posts/${departmentId}/child/${id}`,
    method: 'get',
});

/* 获取公司下第一级岗位列表 */
export const getFirstPost = (id) => request({
    url: `${baseUrl}/companies/${id}/first-posts`,
    method: 'get',
});