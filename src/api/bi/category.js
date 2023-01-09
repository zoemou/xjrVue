import { baseUrl } from '@/config/env';
//var request = window.axios;
import request from 'axios'
export const getList = (params) => request({
  url: baseUrl + '/visual/category/list',
  method: 'get',
  params: params
});

export const getObj = (id) => request({
  url: baseUrl + '/visual/category/detail/' + id,
  method: 'get'
});

export const addObj = (data) => request({
  url: baseUrl + '/visual/category',
  method: 'post',
  data: data
});
export const updateObj = (data) => request({
  url: baseUrl + '/visual/category/' + data.id,
  method: 'put',
  data: data
});



export const delObj = (id) => request({
  url: baseUrl + '/visual/category/' + id,
  method: 'delete'
});