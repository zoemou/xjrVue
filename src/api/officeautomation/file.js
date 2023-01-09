import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取文件*/
export const queryFileAndFileFolder = (params) => request({
    url: baseUrl + '/file-manager/queryFileAndFileFolder' ,
    method: 'get',
    params
});

/*查询文件夹下文件*/
export const getFileByParentId = (parentId) => request({
    url: baseUrl + `/file-manager/getFileByParentId/${parentId}`,
    method: 'get'
});

/*新建文件夹*/
export const addFolder =(data) => request({
    url:baseUrl+'/file-manager/addFolder',
    method:'post',
    data
})

/*文件夹重命名*/
export const updateFolder =(data) => request({
    url:baseUrl+'/file-manager/updateFileName',
    method:'put',
    params:data
})

/*放入回收站*/
export const logicDelete = (fileId) => request({
    url: baseUrl + `/file-manager/logicDelete/${fileId}`,
    method: 'delete'
});

/*预览*/
export const reviewFile = (fileId) => request({
    url: baseUrl + `/file-manager/reviewFile/${fileId}`,
    method: 'get'
});

/*在线编辑*/
export const EditFile = (fileId) => request({
    url: baseUrl + `/file-manager/EditFile/${fileId}`,
    method: 'get'
});

/*清空回收站*/
export const emptyTrash = () => request({
    url: baseUrl + `/file-manager/emptyTrash`,
    method: 'delete'
});

/*彻底删除*/
export const DeleteFile = (fileId) => request({
    url: baseUrl + `/file-manager/Delete/${fileId}`,
    method: 'delete'
});

/*还原文件*/
export const restoreFile = (fileId) => request({
    url: baseUrl + `/file-manager/restoreFile/${fileId}`,
    method: 'put'
});

/*获取文件夹树*/
export const getFileTree = () => request({
    url: baseUrl + `/file-manager/tree`,
    method: 'get'
});

/*移动文件*/
export const removeFile = (params) => request({
    url: baseUrl + `/file-manager/removeFile`,
    method: 'put',
    params
});
