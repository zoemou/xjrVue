import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取导入列表 */
export const getImportList = (param) => request({
    url: baseUrl + '/excel-import',
    method: 'get',
    params : param
});

/* 新增导入 */
export const addImport = (obj) => request({
    url: baseUrl + '/excel-import/',
    method: 'post',
    data: obj
});

/* 修改任务 */
export const updateTaskScheduling = (id,obj) => request({
    url: baseUrl + '/task-scheduling/' + id,
    method: 'put',
    data: obj
});

/* 启用导入 */
export const startImport = (id) => request({
    url: baseUrl + '/excel-import/start/' + id,
    method: 'patch'
});

/* 暂停导入 */
export const stopImport = (id) => request({
    url: baseUrl + '/excel-import/stop/' + id,
    method: 'patch'
});

/* 删除导入 */
export const deleteImport = (id) => request({
    url: baseUrl + '/excel-import/' + id,
    method: 'delete'
});

/* 查看导入详情 */
export const getImportInfo = (id) => request({
    url: baseUrl + '/excel-import/' + id,
    method: 'get',
});



/*导出接口*/
/* 新增导出 */
export const addExport = (obj) => request({
    url: baseUrl + '/excel-export/',
    method: 'post',
    data: obj
});
/* 修改导出 */
export const updateExport = (id,obj) => request({
    url: baseUrl + '/excel-export/' + id,
    method: 'put',
    data: obj
});
/* 获取导出列表 */
export const getExportList = (param) => request({
    url: baseUrl + '/excel-export',
    method: 'get',
    params : param
});

/* 启用导出 */
export const startExport = (id) => request({
    url: baseUrl + '/excel-export/start/' + id,
    method: 'patch'
});

/* 暂停导出 */
export const stopExport = (id) => request({
    url: baseUrl + '/excel-export/stop/' + id,
    method: 'patch'
});

/* 删除导出 */
export const deleteExport = (id) => request({
    url: baseUrl + '/excel-export/' + id,
    method: 'delete'
});

/* 查看导出 */
export const getExportInfo = (id) => request({
    url: baseUrl + '/excel-export/' + id,
    method: 'get',
});