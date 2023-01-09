import request from '@/router/axios';
import { baseUrl } from '@/config/env';




// 获取数据字典
export const getDataItem = (code) => request({
    url: baseUrl + '/data-items/' + code + '/detail/tree',
    method: 'GET'
});

// 流程监控 未完成 unfinished  
export const getUnfinishedTask = (param) => request({
    url: baseUrl + '/workflow-monitor/unfinished-tasks',
    method: 'GET',
    params: param
});

// 流程监控 变更流程
export const getHistoryTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/hisitory',
    method: 'GET',
    params: param
});

// 流程监控 变更流程 测试
export const postTestHistoryTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/change-processversion-test',
    method: 'POST',
    params: param
});
// 流程监控 变更流程 更新
export const postUpdateHistoryTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/change-processversion',
    method: 'POST',
    params: param
});

// export const postCreateProcessform = (data) => request({
//     url: baseUrl + '/workflow-scheme-info/create-processform',
//     method: 'POST',
//     data : data
// });
