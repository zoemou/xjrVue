import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取设备树 */
export const getDeviceByPid = (id) => request({
    url: baseUrl + '/device/'+id,
    method: 'get',
});

/* 获取标注 */
export const getMarkerPoints = () => request({
    url: baseUrl + '/marker-points',
    method: 'get',
});

/* 获取项目树 */
export const getProjectTree = () => request({
    url: baseUrl + '/project-tree',
    method: 'get',
});

/* 获取设备 */
export const getDeviceList= () => request({
    url: baseUrl + '/device',
    method: 'get',
});

/* 获取设备属性值 */
export const getDeviceProty= () => request({
    url: baseUrl + `/device/proty`,
    method: 'get',
});

/* 获取报警预警信息 */
export const getAlarmInfoList= (params) => request({
    url: baseUrl + '/dev-alarminfo',
    method: 'get',
    params: params
});

/* 更新急修工单状态 */
export const updateAlarmStatus = (id) => request({
    url: baseUrl + `/dev-alarminfo/${id}`,
    method: 'patch'
});

/* 获取设备详情 */
export const getDeviceDetail = (id) => request({
    url: baseUrl + `/device/${id}/detail`,
    method: 'get',
});

/* 获取设备实时数据 */
export const getDeviceDataStream = (aid) => request({
    url: baseUrl + `/device/${aid}/datastream`,
    method: 'get',
});

/* 获取数据标识 */
export const getDataFlagDefine = () => request({
    url: baseUrl + `/device/datafalg-define`,
    method: 'get',
});

export const getGisDataFlagBind = (type) => request({
    url: baseUrl + `/device/${type}/gis-datafalg-bind`,
    method: 'get',
});

/* 获取工单信息 */
export const getWorkList = () => request({
    url: baseUrl + `/work-emerglist/worklist`,
    method: 'get',
});

/* 获取报警预警 */
export const getAlarmList = () => request({
    url: baseUrl + `/dev-alarminfo/alarminfo`,
    method: 'get',
});

/* 根据设备id获取报警详情 */
export const getAlarmById = (id) => request({
    url: baseUrl + `/dev-alarminfo/${id}/alarminfo`,
    method: 'get',
});


/* 获取急修管理 */
export const getWorkEmergList = (params) => request({
    url: baseUrl + `/work-emerglist`,
    method: 'get',
    params: params
});

/* 获取急修管理处理人员 */
export const getWorkEmergUser = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/user`,
    method: 'get',
});

/* 获取急修管理日志 */
export const getWorkEmergLog= (id, type) => request({
    url: baseUrl + `/work-emerglist/${id}/${type}/log`,
    method: 'get',
});

/* 获取急修管理流程时间 */
export const getWorkEmergFlow = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/flow`,
    method: 'get',
});

/* 获取急修管理详情 */
export const getWorkEmergDetail = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/detail`,
    method: 'get',
});

/* 新增 */
export const addWorkEmergData = (obj) => request({
    url: baseUrl + '/work-emerglist',
    method: 'post',
    data: obj
});

/* 编辑 */
export const modifyWorkEmergData = (id, obj) => request({
    url: baseUrl + '/work-emerglist/' + id,
    method: 'put',
    data: obj
});

/* 删除 */
export const deleteWorkEmergData = (ids) => request({
    url: baseUrl + '/work-emerglist/' + ids,
    method: 'delete',
});

/* 获取急修管理维修报告 */
export const getWorkEmergReport = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/report`,
    method: 'get',
});

/* 获取急修管理配件 */
export const getWorkEmergPart = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/part`,
    method: 'get',
});

/* 获取急修管理人员位置 */
export const getWorkEmergPosition = (id, type) => request({
    url: baseUrl + `/work-emerglist/${id}/${type}/position`,
    method: 'get',
});

/* 更新急修工单状态 */
export const updateWorkEmergStatus = (id, status) => request({
    url: baseUrl + `/work-emerglist/${id}/${status}`,
    method: 'patch'
});


/* 获取巡检维保 */
export const getWorkMaintenan = (params) => request({
    url: baseUrl + `/work-maintenan`,
    method: 'get',
    params: params
});

/* 获取巡检维保详情 */
export const getWorkMaintenanDetail = (id) => request({
    url: baseUrl + `/work-maintenan/${id}/detail`,
    method: 'get',
});

/* 获取急修管理处理人员 */
export const getWorkMaintenanUser = (id) => request({
    url: baseUrl + `/work-maintenan/${id}/user`,
    method: 'get',
});

/* 获取维保管理维修报告  已弃用*/
export const getWorkMaintenanReport = (id) => request({
    url: baseUrl + `/work-maintenan/${id}/report`,
    method: 'get',
});

/* 删除 */
export const deleteWorkMaintenanData = (ids) => request({
    url: baseUrl + '/work-maintenan/' + ids,
    method: 'delete',
});

/* 新增 */
export const addWorkMaintenanData = (obj) => request({
    url: baseUrl + '/work-maintenan',
    method: 'post',
    data: obj
});

/* 修改巡检维保 */
export const updateWorkMaintenanData = (id,obj) => request({
    url: baseUrl + '/work-maintenan/'+id,
    method: 'put',
    data: obj
});

/* 根据类型获取计划 */
export const getWorkMaintenanPlanByType = (type) => request({
    url: baseUrl + `/work-maintenan/${type}/plan`,
    method: 'get',
});

/* 根据类型获取模板*/
export const getWorkTemplateByType = (type) => request({
    url: baseUrl + `/work-maintenan/${type}/template`,
    method: 'get',
});

/* 根据计划id获取模板*/
export const getWorkTemplateById = (id) => request({
    url: baseUrl + `/work-maintenan/${id}/work-template`,
    method: 'get',
});

/* 根据计划id 或者模板id 获取模板内容*/
export const getWorkTemplateContentByIds = (params) => request({
    url: baseUrl + `/work-maintenan/template-content`,
    method: 'get',
    params: params
});

/* 根据计划id 获取设备 已弃用*/
// export const getWorkMaintenanDeviceByIds = (ids) => request({
//     url: baseUrl + `/work-maintenan/${ids}/work-maintenan-device`,
//     method: 'get',
// });
/* 根据巡检维保工单id 获取设备*/
export const getWorkMaintenanDeviceById = (id) => request({
    url: baseUrl + `/work-maintenan/${id}/device`,
    method: 'get',
});

/* 根据计划id 获取人员 已弃用*/
// export const getWorkMaintenanUserByIds = (ids) => request({
//     url: baseUrl + `/work-maintenan/${ids}/work-maintenan-user`,
//     method: 'get',
// });

/* 更新巡检维保工单状态 */
export const updateWorkMaintenanStatus = (id, status) => request({
    url: baseUrl + `/work-maintenan/${id}/${status}`,
    method: 'patch'
});

//运动曲线
export const getDataPoints = (params) => request({
    url: baseUrl + '/device/datastream',
    method: 'get',
    params: params
});

//能耗分析 小时
export const getEnergyHour = (id) => request({
    url: baseUrl + `/device/${id}/energy-hour`,
    method: 'get',
});
//能耗分析 天
export const getEnergyDay = (id, params) => request({
    url: baseUrl + `/device/${id}/energy-day`,
    method: 'get',
    params: params
});
//能耗分析 月
export const getEnergyMonth = (id) => request({
    url: baseUrl + `/device/${id}/energy-month`,
    method: 'get',
});
//远程控制 参数
export const getRemoteDF = (params) => request({
    url: baseUrl + `/device/remote-df`,
    method: 'get',
    params: params
});
//远程控制 历史记录
export const getRemoteHis = (params) => request({
    url: baseUrl + `/device/remote-his`,
    method: 'get',
    params: params
});

//读取
export const read = (params) => request({
    url: baseUrl + `/device/read`,
    method: 'get',
    params: params
});
//下发
export const write = (params) => request({
    url: baseUrl + `/device/write`,
    method: 'get',
    params: params
});
//新增权限
export const doorAuthorize = (params) => request({
    url: baseUrl + `/device/door-authorize`,
    method: 'get',
    params: params
});
//设置开门密码
export const setPassword = (params) => request({
    url: baseUrl + `/device/set-password`,
    method: 'get',
    params: params
});
//设置开门延时报警时间
export const setAlarm = (params) => request({
    url: baseUrl + `/device/set-alarm`,
    method: 'get',
    params: params
});
//临时开门
export const openDoor = (params) => request({
    url: baseUrl + `/device/open-door`,
    method: 'get',
    params: params
});

//获取维保模板列表
export const getWorkTemplate = (params) => request({
    url: baseUrl + `/work-template`,
    method: 'get',
    params: params
});
//新增维保模板
export const addWorkTemplate = (params) => request({
    url: baseUrl + `/work-template`,
    method: 'post',
    data: params
});
//修改维保模板
export const updateWorkTemplate = (id,params) => request({
    url: baseUrl + `/work-template/${id}`,
    method: 'put',
    data: params
});
//删除维保模板
export const deleteWorkTemplate = (id) => request({
    url: baseUrl + `/work-template/${id}`,
    method: 'delete'
});
//获取维保模板详情
export const getWorkTemplateDetail = (id) => request({
    url: baseUrl + `/work-template/${id}/detail`,
    method: 'get'
});
//获取维保计划列表
export const getWorkPlan = (params) => request({
    url: baseUrl + `/work-maintenan-plan`,
    method: 'get',
    params: params
});
//新增维保计划
export const addWorkPlan = (params) => request({
    url: baseUrl + `/work-maintenan-plan`,
    method: 'post',
    data: params
});
//修改维保计划
export const updateWorkPlan = (id,params) => request({
    url: baseUrl + `/work-maintenan-plan/${id}`,
    method: 'put',
    data: params
});
//删除维保计划
export const deleteWorkPlan = (id) => request({
    url: baseUrl + `/work-maintenan-plan/${id}`,
    method: 'delete'
});

/* 根据计划id 获取设备*/
export const getDeviceByPlanIds = (ids) => request({
    url: baseUrl + `/work-maintenan-plan/${ids}/device`,
    method: 'get',
});

/* 根据计划id 获取人员*/
export const getUserByPlanIds = (ids) => request({
    url: baseUrl + `/work-maintenan-plan/${ids}/maintenance-users`,
    method: 'get',
});

/* 根据计划id 获取模板*/
export const getTemplateByPlanIds = (ids) => request({
    url: baseUrl + `/work-maintenan-plan/${ids}/template`,
    method: 'get',
});

/*获取维保报告列表*/
export const getMaintenanReport = (obj) => request({
    url: baseUrl + `/work-maintenan-report`,
    method: 'get',
    params: obj
});

/*修改巡检维保工单*/
export const updateMaintenanReport = (id,obj) => request({
    url: baseUrl + `/work-maintenan-report/${id}`,
    method: 'put',
    data: obj
});

/*获取维保报告清单列表*/
export const getMaintenanReportMenu = (obj) => request({
    url: baseUrl + `/work-maintenan-report-list`,
    method: 'get',
    params: obj
});

/*修改维保报告清单*/
export const updateMaintenanReportMenu = (id,obj) => request({
    url: baseUrl + `/work-maintenan-report-list/${id}`,
    method: 'put',
    data: obj
});

/*急修评分*/
export const addEmergRate = (id,score) => request({
    url: baseUrl + `/work-emerglist/${id}/${score}/score`,
    method: 'put'
}); 

/*维保评分*/
export const addMaintenanRate = (id,score) => request({
  url: baseUrl + `/work-maintenan/${id}/${score}/score`,
  method: 'put'
}); 


/*修改维修报告*/
export const updateMergeReport = (obj) => request({
    url: baseUrl + `/work-emerg-report/`,
    method: 'post',
    data: obj
}); 

/*修改维修报告*/
export const updateMergePart = (obj) => request({
    url: baseUrl + `/work-emergpart/`,
    method: 'post',
    data: obj
}); 

/*获取短信验证码*/
export const getMessCode = () => request({
    url: baseUrl + `/device/mobile/auth-code`,
    method: 'get'
}); 

/*获取门禁授权列表(分页查询)*/
export const getTelnetWorkDoor = (params) => request({
    url: baseUrl + `/work-door-authorized`,
    method: 'get',
    params: params
}); 
/*新增权限*/
export const addWorkDoor = (params) => request({
    url: baseUrl + `/work-door-authorized`,
    method: 'post',
    data: params
}); 
/*删除门禁*/
export const deleteWorkDoor = (id) => request({
    url: baseUrl + `/work-door-authorized/${id}`,
    method: 'delete'
}); 

/*获取急修工单 所有未完成 及 正在进行*/
export const getEmergAllOrderStatus = () => request({
  url: baseUrl + `/work-emerglist/all-order-status`,
  method: 'get'
}); 

/*获取巡检工单 所有未完成 及 正在进行*/
export const getMaintenanAllOrderStatus = () => request({
  url: baseUrl + `/work-maintenan/all-order-status`,
  method: 'get'
}); 

/*获取项目位置*/
export const getDevicePosition = (id) => request({
    url: baseUrl + `/device/${id}/detail`,
    method: 'get'
})

/*获取维保人员位置*/
export const getPeoplePosition = (id) => request({
    url: baseUrl + `/work-emerglist/${id}/position`,
    method: 'get'
})

/*获取所属区域*/
export const getProject = () => request({
    url: baseUrl + `/project`,
    method: 'get'
})

/*获取项目图片*/
export const getProjectTypeImg = (typeName,status) => request({
  url: baseUrl + `/project-type-img/${typeName}/${status}`,
  method: 'get'
}); 

/*获取所有项目图片*/
export const getAllProjectTypeImg = () => request({
  url: baseUrl + `/project-type-img`,
  method: 'get'
}); 

/*获取根据工单Id 设备Id 获取鹰眼轨迹*/
export const getHawkeyePoint = (id,devId) => request({
  url: baseUrl + `/hawkeye/track?workId=${id}&deviceId=${devId}`,
  method: 'get'
}); 


/*根据手机 或者 帐号 获取所属租户*/
export const getTenantListByAccount = (account) => request({
  url: baseUrl + `/tenant/${account}`,
  method: 'get'
}); 