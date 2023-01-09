import request from '@/router/axios';
import { baseUrl } from '@/config/env';
//已完成
export const getFinishedTasks = (param) => request({
    url: baseUrl + '/workflow-monitor/finished-tasks',
    method: 'get',
    params : param
});
//未完成
export const getUnfinishedTasks = (param) => request({
  url: baseUrl + '/workflow-monitor/unfinished-tasks',
  method: 'get',
  params : param
});
//挂起
export const suspendProcess = (processInstanceId) => request({
  url: baseUrl + '/workflow-monitor/suspend-process',
  method: 'post',
  params : {processInstanceId}
});
//恢复
export const activateProcess = (processInstanceId) => request({
  url: baseUrl + '/workflow-monitor/activate-process',
  method: 'post',
  params : {processInstanceId}
});
//任务添加审批人
export const assign = ({taskId,userId}) => request({
  url: baseUrl + '/workflow-monitor/assign',
  method: 'put',
  params : {taskId,userId}
});

//获取指定审批人
export const getAssign = (param) => request({
  url: baseUrl + '/workflow-monitor/getAssign',
  method: 'get',
  params : param
});