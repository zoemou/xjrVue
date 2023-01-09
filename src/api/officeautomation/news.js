import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取新闻栏目*/
export const getNewsCategory = (itemCode) => request({
    url: baseUrl + '/data-items/' + itemCode + '/detail' ,
    method: 'get',
});

/* 获取新闻 */
export const getNews = (params) => request({
    url: baseUrl + '/news',
    method: 'get',
    params: params
});

/* 新增 */
export const addNews = (obj) => request({
    url: baseUrl + '/news',
    method: 'post',
    data: obj
});

/* 编辑 */
export const modifyNews = (id,obj) => request({
    url: baseUrl + '/news/' + id,
    method: 'put',
    data: obj
});

/* 删除 */
export const deleteNews = (ids) => request({
    url: baseUrl + '/news/' + ids,
    method: 'delete',
});

/* 文件上传 */
export const upload = (file) => request({
    url: baseUrl + '/upload',
    method: 'post',
    data:file
});

// 请求图片
export const urlId = (folderId) => request({
    url: baseUrl + '/annexes-files/url/' + folderId,
});

/*修改状态*/
export const changeStatus = (obj) => request({
    url: baseUrl + '/news/changeStatus',
    method: 'put',
    params: obj
});
