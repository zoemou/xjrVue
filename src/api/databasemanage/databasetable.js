import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取数据库列表 */
export const getDatabaseTableTree = () => request({
  url: baseUrl + '/database-links/group',
  method: 'get'
});

/* 获取数据库列表信息 */
export const getDatabaseTable = (id,params) => request({
  url: baseUrl + '/database-links/' + id + '/tables',
  method: 'get',
  params: params
});

/* 获取数据库列表信息分页 */
export const getDatabaseTableByPage = (id,params) => request({
  url: baseUrl + '/database-links/' + id + '/tables/page',
  method: 'get',
  params: params
});

/* 获取数据库表表头数据 */
export const getDatabaseTableColumns = (id, tableName) => request({
  url: baseUrl + '/database-links/' + id + '/tables/' + tableName + '/columns',
  method: 'get'
});

/* 获取数据库表表头数据 */
export function getDatabaseTableColumnsFun (id, tableName) {
  return request(`${baseUrl}/database-links/${id}/tables/${tableName}/columns`)
}

/* 获取数据库表表格数据 */
export const getDatabaseTableDatas = (id, tableName) => request({
  url: baseUrl + '/database-links/' + id + '/tables/' + tableName + '/datas',
  method: 'get'
});

// 新增数据库表
export function addDatabaseTableRelease (params) {
  return request(`${baseUrl}/database-links/release`, {
    method: 'post',
    data:params
  });
}

// 数据库草稿-保存
export function addOrUpdateDbDraft (params) {
  return request(`${baseUrl}/database-draft`, {
    method: 'post',
    data:params
  });
}

// 数据库草稿-获取列表
export function getOrUpdateDbDraft (params) {
  return request(`${baseUrl}/database-draft`, {
    method: 'get',
    params
  });
}

// 数据库草稿-获取列表
export function getOrUpdateField (params) {
  return request(`${baseUrl}/database-field`, {
    method: 'get',
    params
  });
}

// 根据数据库连接Id 获取表信息
export function getOrUpdateTable (params) {
  return request(`${baseUrl}/database-links/${params.id}/tables`, {
    method: 'get',
    params
  });
}

// 根据数据库ID 以及表名 查询所有列
export function getOrUpdateColumns (id, tableName) {
  return request(`${baseUrl}/database-links/${id}/tables/${tableName}/columns`, {
    method: 'get'
  });
}