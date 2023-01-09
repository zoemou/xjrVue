import { baseUrl } from '@/config/env';
import request from 'axios'
export const getDataList = (params) => request({
  url: baseUrl + '/reports-file/page',
  method: 'get',
  params: params
});
export const deleteRow = (id) => request({
  url: baseUrl + '/reports-file/'+id,
  method: 'delete',
});
export const designerUrl = () => {
  return baseUrl+'/ureport/designer';
};
export const editDesignerUrl = (name) => {
  return baseUrl+'/ureport/designer?_u=xjr:'+name;
};