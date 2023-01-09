import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取语言类型列表 */
export const getMenuTree = () => request({
    url: baseUrl + '/modules',
    method: 'get'
});