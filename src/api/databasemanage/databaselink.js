import request from '@/router/axios';
import { baseUrl } from '@/config/env';


/* 获取数据库连接列表 */
export const getDbLinks = (obj) => request({
    url: baseUrl + '/database-links',
    method: 'get',
    params: obj
});

/* 测试连接 */
export const testLinks = (obj) => request({
    url: baseUrl + '/database-links/test',
    method: 'get',
    params: obj
});

/* 新增数据库连接 */
export const addDbLinks = (obj) => request({
    url: baseUrl + '/database-links',
    method: 'post',
    data: obj
});

/* 编辑数据库连接 */
export const editDbLinks = (id,obj) => request({
    url: baseUrl + '/database-links/' + id,
    method: 'put',
    data: obj
});

/* 删除数据库连接 */
export const deleteDbLinks = (id) => request({
    url: baseUrl + '/database-links/' + id,
    method: 'delete',
});

/*根据数据库id获取表信息*/
export const getDbLinksTable= (id) => request({
    url: baseUrl + '/database-links/' + id +'/tables',
    method: 'get'
});

/*根据数据库连接Id 执行sql 获取所有数据*/
export const getDbLinksTestSql= (id,params) => request({
    url: baseUrl + '/database-links/' + id +'/datas',
    method: 'get',
    params: params
});


/*根据数据库id和表名获取表字段*/
export function getDbFieldByName (id,name) {
    return request(`${baseUrl}/database-links/${id}/tables/${name}/columns`)
}

/*根据数据库id和获取表数据*/
export function getDbFieldByData (id,name) {
    return request(`${baseUrl}/database-links/${id}/tables/${name}/datas`)
}


/*根据数据库链接Id Sql 获取所有列*/
export const getDbFieldBySQL= (id,obj) => request({
    url: baseUrl + '/database-links/' + id +'/fields',
    method: 'get',
	params: obj
});

/*根据数据库链接Id Sql 获取所有列*/
export const getTreeDataByDbLink= (id,obj) => request({
    url: baseUrl + '/database-links/' + id +'/tree',
    method: 'get',
	params: obj
});


/* 检测数据表名是否重复 */
export const getValidateTablename = (id,tableNames) => request({
    url: baseUrl + `/database-links/${id}/validate-tablename?tableNames=${tableNames}`,
    method: 'get',
});

// 数据表处理
export const getDatabaseValidateTable = (id,data) => request({
    url: baseUrl + `/database-links/${id}/validate-table`,
    method: 'post',
    data
});