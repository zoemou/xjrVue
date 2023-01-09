import request from '@/router/axios';
import { baseUrl } from '@/config/env';



// 获取数据字典
export const getDataItem = (code) => request({
    url: baseUrl + '/data-items/' + code + '/detail/tree',
    method: 'GET'
});


// 获取工作流列表
export const getWorkflowSchemeInfo = (param) => request({
    url: baseUrl + '/workflow-scheme-info',
    method: 'GET',
    params: param
});

export const getViewProcess = (processInstanceId) => {
    return baseUrl + '/workflow-task/view-process?processInstanceId=' + processInstanceId + '&randnum+' + new Date().getTime();
}


//创建流程前）
export const postCreateProcessform = (params) => request({
    url: baseUrl + '/workflow-task/create-processform',
    method: 'GET',
    params: params
});

// 流转记录
export const getHistoryTaskList = (param) => request({
    url: baseUrl + '/workflow-task/history-taskList',
    method: 'GET',
    params: param
});


// 流程审批时 - 验证是否关联任务接口 validateRelationTask
export const getValidateRelationTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/validate-relationtask',
    method: 'GET',
    params: param
});


// 流程发起时 - 获取关联任务信息 (参数 processInstanceId)
export const getRelationTaskInfo = (param) => request({
    url: baseUrl + '/workflow-scheme-info/relation-taskinfo',
    method: 'GET',
    params: param
});

// 流程发起时 - 获取关联流程任务列表 getRelationTask
export const getRelationTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/relation-task',
    method: 'GET',
    params: param
});


export const getRelationTaskList = (params) => request({
    url: baseUrl + '/workflow-task/relationTask',
    method: 'GET',
    params: params
});

export const getRlationTaskInfo = (param) => request({
    url: baseUrl + '/workflow-task/relationTask-Info',
    method: 'GET',
    params: param
});

export const getNodeInfo = (param) => request({
    url: baseUrl + '/workflow-scheme-info/node-info',
    method: 'GET',
    params: param
});

// 获取审批签章列表
export const getApprovalStamps = () => request({
    url: baseUrl + '/stamps/getAllStamps',
    method: 'GET'
});

// 获取签章 列表
export const getStamps = (param) => request({
    url: baseUrl + '/stamps',
    method: 'GET',
    params: param
});

// 查询是否展示电子签章、签章密码
export const getStampInfo = (data) => request({
    url: baseUrl + '/workflow-task/get-stamp-info',
    method: 'POST',
    data: data
});

// 加签或减签验证接口
export const getValidateSignation = (param) => request({
    url: baseUrl + '/workflow-task/validate-signation',
    method: 'GET',
    params: param
});

// 获取传阅人员信息接口 getManualInfo
export const getManualInfo = (param) => request({
    url: baseUrl + '/workflow-task/get-manualinfo',
    method: 'GET',
    params: param
});

// 获取已经流转过的节点信息 (processInstanceId-流程实例ID)
export const getFinishedTask = (param) => request({
    url: baseUrl + '/workflow-scheme-info/finished-task',
    method: 'GET',
    params: param
});

// 获取审批意见
export const getTaskAttachments = (param) => request({
    url: baseUrl + '/workflow-task/task-attachments',
    method: 'GET',
    params: param
});

// 获取表单(包含表单数据、annexInfo附件、subProcessInfo子流程信息）
export const getTaskForm = (param) => request({
    url: baseUrl + '/workflow-task/task-form',
    method: 'GET',
    params: param
});


// 发起流程
export const postCreateProcess = (data) => request({
    url: baseUrl + '/workflow-task/create-process',
    method: 'POST',
    data: data
});

// 审批流程
export const postTaskHandle = (data) => request({
    url: baseUrl + '/workflow-task/task-handle',
    method: 'POST',
    data: data
});

// 获取附件列表
export const getAnnexInfo = (params) => request({
    url: baseUrl + '/workflow-task/getAnnexInfo',
    method: 'GET',
    params: params
});

// 转办
export const changeCandidateUser = (params) => request({
    url: baseUrl + '/workflow-task/change-candidate',
    method: 'PUT',
    params: params
});

// 批量审批
export const batchTaskHandle = (data) => request({
    url: baseUrl + '/workflow-task/batch-task-handle',
    method: 'POST',
    data: data
});