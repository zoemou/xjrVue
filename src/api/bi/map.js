import { baseUrl } from '@/config/env';
//var request = window.axios;
import request from 'axios'
export const getList = (params) => request({
  url: baseUrl + '/visual/map/list',
  method: 'get',
  params: params
});

export const getObj = (id) => request({
  url: baseUrl + '/visual/map/detail/' + id,
  method: 'get'
});

export const addObj = (data) => request({
  url: baseUrl + '/visual/map',
  method: 'post',
  data: data
});

export const updateObj = (data) => request({
  url: baseUrl + '/visual/map/' + data.id,
  method: 'put',
  data: data
});
export const getEditObj = (id) => request({
  url: baseUrl + '/visual/map/detail/' + id+'/to-update',
  method: 'get',
});
export const delObj = (id) => request({
  url: baseUrl + '/visual/map/' + id,
  method: 'delete',
});