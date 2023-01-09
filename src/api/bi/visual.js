import { baseUrl } from '@/config/env';
//var request = window.axios;
import request from 'axios'
export const getList = (params) => request({
  url: baseUrl + '/visual/list',
  method: 'get',
  params: params
});

export const copyObj = (id) => request({
  url: baseUrl + '/visual/' + id + '/copy',
  method: 'post'
});

export const getCategory = (params) => request({
  url: baseUrl + '/visual/category/list',
  method: 'get',
  params: params
});

export const getObj = (id) => request({
  url: baseUrl + '/visual/detail/' + id,
  method: 'get',
});
export const uploadImg = (file) => request({
  url: baseUrl + '/visual/put-file',
  method: 'post',
  data: 'file=' + file,
  headers: { "Content-Type": "multipart/form-data" }
});

export const addObj = (data) => request({
  url: baseUrl + '/visual',
  method: 'post',
  data: {
    visual: {
      password: data.password,
      category: data.category,
      status: data.status,
      title: data.title,
    },
    config: {
      detail: JSON.stringify({
        name: data.title,
        width: data.width,
        height: data.height,
        scale: 1,
        backgroundImage: '/bi/img/bg/bg1.png',
        url: '',
        mark: {},
        gradeShow: false,
        gradeLen: 30,
      }),
      component: '[]'
    },
  }
});


export const updateComponent = (data) => request({
  url: baseUrl + '/visual/' + data.visual.id + "/detail",
  method: 'put',
  data: data
});

export const updateObj = (data) => request({
  url: baseUrl + '/visual/' + data.id,
  method: 'put',
  data: {
    "visual": {
      "password": data.password,
      "category": data.category,
      "status": data.status,
      "title": data.title,
    }
  }
});

export const delObj = (id) => request({
  url: baseUrl + '/visual/'+id,
  method: 'delete',
  params: {
    ids: id
  }
});

//数据库查询接口
export const getDatabaseList = (params) => request({
  url: baseUrl + '/db_link/getDatabaselinksFroGroup',
  method: 'post',
  params: params
});

//看板发布
export const publishBoard = (params) => request({
  url: baseUrl + '/visual-release',
  method: 'post',
  data: params
});

//根据数据源 通过自定义字段名 查询图表
export const getEchartDataByColumnsInDatabase = (id,columns) => request({
  url: `${baseUrl}/data-sources/${id}/columns/${columns}/data`,
  method: 'get'
});

//根据数据库SQL 通过自定义字段名 查询图表
export const getEchartsDataByColumnsInSql = (id,columns,sql) => request({
  url: `${baseUrl}/database-links/${id}/columns/${columns}/data?sql=${sql}`,
  method: 'get'
});

