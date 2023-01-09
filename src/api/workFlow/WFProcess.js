import request from '@/router/axios';
import { baseUrl } from '@/config/env';



// 获取数据字典  
export const getDataItem = (code) => request({
    url: baseUrl + '/data-items/' + code + '/detail/tree',
    method: 'get'
});


// 撤回流程接口 (撤回到上个节点 isMyTask: 0  撤回到开始节点 isMyTask: 1 )
export const postRecallProcess = (data) => request({
    url: baseUrl + '/workflow-task/recall-process',
    method: 'POST',
    data : data
});

// 重新发起前获取数据的接口
export const postReinitiate = (data) => request({
    url: baseUrl + '/workflow-task/reinitiate-process',
    method: 'POST',
    data : data
});

// 移入回收站
export const deleteToRecyclebin = (processInstanceId) => request({
    url: baseUrl + '/workflow-task/to-recyclebin/'+processInstanceId,
    method: 'DELETE',
});

// 删除流程
export const deleteProcessInstance = (processInstanceId) => request({
    url: baseUrl + '/workflow-task/delete-processinstance/'+processInstanceId,
    method: 'DELETE'
});




// 代办任务 - 流程任务列表
export const getUpcomingTasks = (param) => request({
    url: baseUrl + '/workflow-task/upcoming-task',
    method: 'get',
    params : param
});



// 已办任务
export const getHistoryTask = (param) => request({
    url: baseUrl + '/workflow-task/history-task',
    method: 'get',
    params : param
});


// 我的任务 myTask
export const getMyTask = (param) => request({
    url: baseUrl + '/workflow-task/my-task',
    method: 'get',
    params : param
});
// 传阅任务
export const getManualTask = (param) => request({
    url: baseUrl + '/workflow-task/manual-task',
    method: 'get',
    params : param
});


// 回收站任务
export const getRecycleTask = (param) => request({
    url: baseUrl + '/workflow-task/recycle-task',
    method: 'get',
    params : param
});

// 草稿箱
export const getDrafts = (param) => request({
    url: baseUrl + '/workflow-task/getTempfiledInfoList',
    method: 'get',
    params : param
});


// 获取加签减签人员 getTaskCanditeUsers
// export const getTaskCanditeusers = (param) => request({
//     url: baseUrl + '/workflow-scheme-info/task-canditeusers',
//     method: 'get',
//     params : param
// });
//获取任务候选人的接口
export const getTaskCanditeUsers = (taskId) => request({
    url: baseUrl + '/workflow-task/get-taskcanditeusers/taskId='+taskId,
    method: 'GET'
});


// 撤回流程接口 (撤回到上个节点 isMyTask: 0  撤回到开始节点 isMyTask: 1 )
export const postSignature = (data) => request({
    url: baseUrl + '/workflow-task/signature',
    method: 'POST',
    data : data
});
//processInstanceId
export const getSignatureUsers = (processInstanceId) => request({
    url: baseUrl + '/workflow-task/candidate-users?processInstanceId='+processInstanceId,
    method: 'GET'
});
// 保存或编辑草稿
export const postSaveDrafts = (data) => request({
    url: baseUrl + '/workflow-task/saveOrEditTempfiledInfo',
    method: 'POST',
    data : data
});

// 删除草稿
export const deleteDrafts = (id) => request({
    url: baseUrl + '/workflow-task/delete-tempfiledInfo/'+id,
    method: 'DELETE'
});


// 二次设置审批人 [{}]
export const postAgainCandidate = (data) => request({
    url: baseUrl + '/workflow-task/again-candidate',
    method: 'POST',
    data 
});

export const readTask = (taskId) => request({
    url: baseUrl + `/workflow-task/read/${taskId}`,
    method: 'PUT'
});

//获取可以撤回的任务节点
export const getRetractNode=(taskId)=>request({
	url:baseUrl+'/workflow-task/process-mytask',
	method:'GET',
	params : taskId
})

//撤回流程
export const recallProcess=(params)=>request({
	url:baseUrl+'/workflow-task/recall-process',
	method:'put',
	params : params
})

export const suspendProcess=(processInstanceId)=>request({
	url:baseUrl+'/workflow-monitor/suspend-process',
	method:'post',
	params : {processInstanceId}
})