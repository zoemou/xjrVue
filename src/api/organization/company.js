import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取公司树 */
export const getRoles = () => request({
    url: baseUrl + '/roles',
    method: 'get',
});

/* 新增角色 */
/*let obj = {f_EnCode: '', f_FullName: '', f_Description: '', f_Category: 1, f_SortCode: 0}*/
export const addRoles = (obj) => request({
    url: baseUrl + '/roles',
    method: 'post',
    data: obj
});

/* 编辑角色 */
export const modifyRoles = (id, formData) => request({
    url: baseUrl + '/roles/' + id,
    method: 'put',
    data: formData
});

/* 删除角色 */
export const deleteRoles = (id, formData) => request({
    url: baseUrl + '/roles/' + id,
    method: 'delete',
    data: formData
});


/* 获取公司树 */
export const getAllCompanies = (param) => request({
    url: baseUrl + `/companies/tree`,
    method: 'get',
    params: param
});

/* 公司性质 */
export const getNatureListFromDic = () => request({
    url: baseUrl + `/data-items/CompanyNature/detail`,
    method: 'get'
});


/* 新增公司 */
export const addCompany = (data) => request({
    url: baseUrl + '/companies/',
    method: 'post',
    data: data
});

/* 编辑公司 */
export const editCompany = (id, data) => request({
    url: baseUrl + '/companies/' + id,
    method: 'put',
    data: data
});

/* 删除公司 */
export const deleteCompany = (id) => request({
    url: baseUrl + '/companies/' + id,
    method: 'delete'
});

/* 新增公司角色  */
export const addCompanysSpecialPost = (data) => request({
    url: baseUrl + `/special-post`,
    method: 'post',
    data: { postList: data, F_Type: 1 }
});

/* 部门角色用户列表  */
export const getCompanySpecialPostUser = (id) => request({
    url: baseUrl + `/companies/${id}/special-post`,
    method: 'get'
});
/* 根据公司id查公司信息 */
export const getCompanyInfo = (id) => request({
    url: baseUrl + '/companies/' + id,
    method: 'get'
});
  
/* 获取下一级公司列表 */
export const getLowerCompanies = (id) => request({
    url: `${baseUrl}/companies/child/${id}`,
    method: 'get',
});

/* 获取最上级公司 */
export const getFirstCompany = (id) => request({
    url: `${baseUrl}/companies/first-company/${id}`,
    method: 'get',
});