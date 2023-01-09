import request from '@/router/axios';
import { baseUrl } from '@/config/env';

// 流程委托

// 新增
export function addDelegate (data) {
  return request(`${baseUrl}/workflow-Delegate/addorupdate-delegate`, {
    method: 'POST',
    data
  });
}

// 查询
export function getDelegate (params) {
  return request(`${baseUrl}/workflow-Delegate/query-delegate`, {
    params
  });
}