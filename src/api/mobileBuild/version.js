import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取版本数据 */
export const getVersionList = (param) => request({
  url: baseUrl + '/app-version/list',
  method: 'get',
  params: param
});

/* 获取版本最新数据 */
export const getVersionNewList = () => request({
  url: baseUrl + '/app-version/new',
  method: 'get',
});

/* 查询单条版本信息 */
export const getVersionInfo = (id) => request({
  url: baseUrl + '/app-version/' + id,
  method: 'get'
});

/* 新增版本 */
export const addVersionInfo = (data) => request({
  url: baseUrl + '/app-version',
  method: 'post',
  data
});

/* 编辑版本 */
export const modifyVersionInfo = (id, data) => request({
  url: baseUrl + '/app-version/' + id,
  method: 'put',
  data
});

/* 删除版本 */
export const deleteVersionInfo = (id) => request({
  url: baseUrl + '/app-version/' + id,
  method: 'delete',
});

/* 下载文件 */
export const downloadFile = (id, onDownloadProgress) => request({
  url: baseUrl + '/annexes-files/' + id,
  method: 'get',
  responseType: "blob",
  onDownloadProgress
});