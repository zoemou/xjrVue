//
import request from '@/router/axios';
import { baseUrl } from '@/config/env';

/* 获取常用字段 */
export const download = (moduleId, moduleButtonId) => request({
  url: `${baseUrl}/excel-import/download/${moduleId}/${moduleButtonId}`,
  method: 'get',
});

/* 上传单文件 */
export const uploadSingleFile = (data, onUploadProgress) => request({
  url: baseUrl + '/upload',
  method: 'post',
  data,
  onUploadProgress
});