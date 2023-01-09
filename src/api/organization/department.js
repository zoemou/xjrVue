import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取部门 */
export const getDepartments = (id, param) => request({
  url: baseUrl + '/companies/' + id + '/departments/tree',
  method: 'get',
  params: param
});

/*获取公司全部人员 */
export const getCompanyAllUsers = (id) => request({
  url: baseUrl + '/users/' + id + '/company-users',
  method: 'get'
})

/* 获取公司部门 */
export const getCompanyDepartments = () => request({
  url: baseUrl + '/companies/departments/tree',
  method: 'get'
});

/* 获取公司部门人员 */
export const getCompanyDepartmentUser = () => request({
  url: baseUrl + '/companies/departments/users/tree',
  method: 'get'
});

/* 获取公司树 */
export const getCompanyTree = () => request({
  url: baseUrl + '/companies/tree',
  method: 'get'
});

/* 获取部门用户不分页*/
export const getDepartmentUser = (id, param) => request({
  url: baseUrl + '/departments/' + id + '/users',
  method: 'get',
  params: param
});

/* 获取部门用户（维保人员）不分页*/
export const getMaintenanceUser = (id) => request({
  url: baseUrl + '/departments/' + id + '/maintenance-users',
  method: 'get'
});

/* 新增部门 */
export const addDepartment = (data) => request({
  url: baseUrl + '/departments/',
  method: 'post',
  data: data
});

/* 编辑部门 */
export const editDepartment = (id, data) => request({
  url: baseUrl + '/departments/' + id,
  method: 'put',
  data: data
});

/* 删除部门 */
export const deleteDepartment = (id) => request({
  url: baseUrl + '/departments/' + id,
  method: 'delete'
});


/* 部门性质 */
export const getNatureListFromDic = () => request({
  url: baseUrl + `/data-items/DepartmentNature/detail`,
  method: 'get'
});

/* 获取id公司 部门树 */
export const getAllDepartments = (id) => request({
  url: baseUrl + `/companies/${id}/departments/tree`,
  method: 'get'
});
export function getAllDepartmentsFn (id) {
  return request(`${baseUrl}/companies/${id}/departments/tree`, {
    method: 'get',
  });
}

/* 获取 角色信息  */
export const getAllSpecialPostList = (type) => request({
  url: baseUrl + `/special-post`,
  method: 'get',
  params: { type }
});


/* 新增角色  */
export const addSpecialPost = (type, data) => request({
  url: baseUrl + `/special-post`,
  method: 'post',
  data: { postList: data, F_Type: type }
});

/* 新增部门角色用户  */
export const addDepartmentsSpecialPostUser = (data) => request({
  url: baseUrl + `/departments/users`,
  method: 'post',
  data: data
});

/* 部门角色用户列表  */
export const getDepartmentsSpecialPostUser = (id) => request({
  url: baseUrl + `/departments/${id}/special-post`,
  method: 'get'
});

/* 根据部门id查部门信息 */
export const getDepartmentInfo = (id) => request({
  url: baseUrl + '/departments/' + id,
  method: 'get'
});
  
/*根据公司id查公司和子公司人员*/
export const getSubCompany = (id) => request({
    url: baseUrl + `/users/${id}/sub-company-users`,
    method: 'get'
});

/* 获取下一级部门列表 */
export const getLowerDepartment = (companyId,id) => request({
  url: `${baseUrl}/departments/${companyId}/child/${id}`,
  method: 'get',
});