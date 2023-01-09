import request from '@/router/axios';
import { baseUrl } from '@/config/env';
export const addDelegate = (data) => request({
  url: baseUrl + '/workflow-Delegate',
  method: 'post',
  data : data
});
export const editDelegate = (data) => request({
  url: baseUrl + '/workflow-Delegate/'+data.F_Id,
  method: 'put',
  data : data
});
export const deleteDelegate = (id) => request({
  url: baseUrl + `/workflow-Delegate/${id}`,
  method: 'DELETE'
});
export const getDelegate = (params) => request({
  url: baseUrl + '/workflow-Delegate/query-delegate',
  method: 'GET',
  params:params
});
