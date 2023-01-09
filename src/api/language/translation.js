import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取翻译列表 */
export const getTranslation = (obj) => request({
    url: baseUrl + '/lp-map',
    method: 'get',
    params: obj
});

/* 新增翻译 */
export const addTranslation = (obj) => request({
    url: baseUrl + '/lp-map',
    method: 'post',
    data: obj
});

/* 编辑翻译 */
export const editTranslation = (id,obj) => request({
    url: baseUrl + '/lp-map/'+id,
    method: 'put',
    data : obj
});

/* 新增翻译标记 */
export const addMark = (obj) => request({
    url: baseUrl + '/lg-mark',
    method: 'post',
    data: obj
});


/* 新增翻译标记 */
export const getLgMarkList = (obj) => request({
    url: baseUrl + '/lg-mark',
    method: 'get',
    params: obj
});

/* 获翻译标记列表树 */
export const getDataDictionary = (obj) => request({
    url: baseUrl + '/lg-mark/page',
    method: 'get',
    params: obj
});

/* 修改翻译标记 */
export const editDataDictionary = (id,obj) => request({
    url: baseUrl + '/lg-mark/'+id,
    method: 'put',
    data : obj
});

/* 删除翻译标记 */
export const deleteDataDictionary = (id) => request({
    url: baseUrl + '/lg-mark/' + id,
    method: 'delete'
});

/* 根据语言类型获翻译列表树 */
export const getTranslationByType = (code) => request({
    url: baseUrl + '/lp-map/'+code+'/name',
    method: 'get'
});

/*获取默认语言*/
export const getDefaultLgType = () => request({
	url:baseUrl + '/lg-type/main',
	method:'get'
})