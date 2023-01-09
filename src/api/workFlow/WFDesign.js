import request from '@/router/axios';
import {baseUrl } from '@/config/env';

export const getQueryNwfSchemeInfo = (param) => request({
    url: baseUrl + '/workflow-scheme-info',
    method: 'GET',
    params: param
});
export const patchStart = (id) => request({
    url: baseUrl + `/workflow-scheme-info/${id}/start`,
    method: 'put'
});
export const patchStop = (id) => request({
    url: baseUrl + `/workflow-scheme-info/${id}/stop`,
    method: 'put'
});
export const postUpdateVersion = (param) => request({
    url: baseUrl + '/workflow-scheme-info/change-processversion',
    method: 'POST',
    params : param
});
export const deleteNwfScheme = (id) => request({
    url: baseUrl + `//workflow-scheme-info/${id}`,
    method: 'DELETE'
});
export const getHisitoryList = (param) => request({
    url: baseUrl + '/workflow-scheme-info/hisitory',
    method: 'GET',
    params: param
});

//历史版本- 获取所有流程
export const getAllProcessList = (deploymentId) => request({
    url: baseUrl + '/workflow-task/get-allprocess/'+deploymentId,
    method: 'GET'
});

//历史版本- 修改流程版本
export const changeProcessversion = (param) => request({
    url: baseUrl + '/workflow-task/change-processversion',
    method: 'put',
	params:param
});