import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取数据源列表 */
export const getDataSource = (obj) => request({
    url: baseUrl + '/data-sources',
    method: 'get',
    params: obj
});
/* 获取数据源列表 分页 */
export const getDataSourceByPage = (obj) => request({
    url: baseUrl + '/data-sources/page',
    method: 'get',
    params: obj
});
/* 获取数据库分组 */
export const getDbGroup = () => request({
    url: baseUrl + '/database-links/group',
    method: 'get'
});

/* 新增数据源 */
export const addDataSource = (obj) => request({
    url: baseUrl + '/data-sources',
    method: 'post',
    data: obj
});

/* 编辑数据源 */
export const editDataSource = (id,obj) => request({
    url: baseUrl + '/data-sources/' + id,
    method: 'put',
    data : obj
});

/* 删除数据源 */
export const deleteDataSource = (id) => request({
    url: baseUrl + '/data-sources/' + id,
    method: 'delete'
});

/* 根据数据源获取 sql执行 所获取的字段 */
export const getDataFieldBySQL = (id,obj) => request({
    url: baseUrl + '/data-sources/' + id+'/fields',
    method: 'get',
    params: obj
});

/* 根据数据源获取 sql执行 所获取的数据 */
export const getDataBySQL = (id,obj) => request({
    url: baseUrl + '/data-sources/' + id+'/data',
    method: 'get',
    params: obj
});

/*根据数据源获取 sql执行 所获取的值 转为树*/
export const getTreeDataBySQL = (id,obj) => request({
    url: baseUrl + '/data-sources/' + id+'/tree',
    method: 'get',
    params: obj
});
export const getDataLinkTreeDataBySQL = (id,obj) => request({
    url: baseUrl + '/database-links/' + id+'/tree',
    method: 'get',
    params: obj
});
export const getDataItem = () => request({
    url: baseUrl + '/data-items/tree',
    method: 'get',
})


export const getDataItemDetail = (itemCode) => request({
    url: baseUrl + '/data-items/'+itemCode+'/detail',
    method: 'get',
})

export const getDataSourceField = (id,sql) => request({
    url: baseUrl + '/data-sources/'+id+'/fields',
    method: 'get',
    params :{
        sql
    }
})

export const getDataSourceFieldData = (id,field) => request({
    url: baseUrl + '/data-sources/'+id+'/columns/'+field+'/data',
    method: 'get',
})

export const getDataByQuery = (keyword,dataSource,field) => request({
    url: `${baseUrl}/data-sources/${dataSource}/data/?field=${field}&keyword=${keyword}`,
    method: 'get',
})

/* 根据sql获取  dataSql*/
export const getDbLinkSql = (database,sql) => request({
    url: baseUrl + '/database-links/'+database+'/datas',
    method: 'get',
    params :{
        sql
    }
});

export const getApiData = (url,method,source,params) => request({
    url: baseUrl + url+source,
    method,
    params
});
// 表单事件插入日志
export const insertNodeJournal = (body) => request({
    url: baseUrl + '/log/addFormLog',
    method: 'post',
    data:[body]
});

// 表单事件插入日志
export const insertAllNodeJournal = (body) => request({
    url: baseUrl + '/log/addFormLog',
    method: 'post',
    data:body
});