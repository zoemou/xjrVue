import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取任务列表 */
export const getTaskScheduleList = (param) => request({
    url: baseUrl + '/task-scheduling',
    method: 'get',
    params : param
});

/* 新增任务 */
export const addTaskScheduling = (obj) => request({
    url: baseUrl + '/task-scheduling/',
    method: 'post',
    data: obj
});

/* 修改任务 */
export const updateTaskScheduling = (id,obj) => request({
    url: baseUrl + '/task-scheduling/' + id,
    method: 'put',
    data: obj
});

/* 启用任务 */
export const startTask = (id) => request({
    url: baseUrl + '/task-scheduling/' + id + '/start',
    method: 'put'
});

/* 暂停任务 */
export const stopTask = (id) => request({
    url: baseUrl + '/task-scheduling/' + id + '/stop',
    method: 'put'
});

/* 删除任务 */
export const deleteTask = (id) => request({
    url: baseUrl + '/task-scheduling/' + id,
    method: 'delete'
});

/* 查看任务 */
export const getTaskInfo = (id) => request({
    url: baseUrl + '/task-scheduling/' + id,
    method: 'get',
});



/*任务日志接口*/
/* 获取任务日志列表 */
export const getTaskScheduleLogList = (param) => request({
    url: baseUrl + '/task-scheduling-log',
    method: 'get',
    params : param
});

/* 删除任务日志 */
export const deleteTaskLog = (id) => request({
    url: baseUrl + '/task-scheduling-log/' + id,
    method: 'delete'
});