import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import id from 'element-ui/src/locale/lang/id';

/* 获取输出区域 */
export const getOutputArea = () => request({
  url: baseUrl + '/build-code/output-area',
  method: 'get'
});

/* 获取代码模板 分页 */
export const getCodeSchemaByPage = (param) => request({
  url: baseUrl + '/code-schema',
  method: 'get',
  params: param
});

/* 获取所需生成的代码 */
export const getPreviewWebCode = (param) => request({

  url: `${baseUrl}/build-code/${param.tableInfo.length > 0 ? 'preview-web-code/customtable' : 'preview-web-code'}`,
  method: 'post',
  data: param
});


/* 生成所需要生成的代码 */
export const buildWebCode = (param,type) => request({
  url: `${baseUrl}/build-code/${(type === 1 || type === 2) ? 'build-web-code/customtable' : 'build-web-code'}`,
  method: 'post',
  data: param
});

/* 保存代码模板 */
export const saveCodeScheme = (param) => request({
  url: baseUrl + '/code-schema',
  method: 'post',
  data: param
});

/* 修改代码模板 */
export const updateCodeScheme = (param) => request({
  url: baseUrl + '/code-schema/' + param.f_Id,
  method: 'put',
  data: param
});

/*删除代码模板*/
export const deleteCodeSchema = (id) => request({
  url: baseUrl + '/code-schema/' + id,
  method: 'delete'
});

/* 获取代码模板 分页 */
export const getCodeSchemaInfo = (id) => request({
  url: baseUrl + '/code-schema/' + id,
  method: 'get'
});

/* 获取手机端功能设计所需生成的代码 */
export const getPhonePreviewWebCode = (param) => request({

  url: baseUrl +'/build-code/preview-app-function-code',
  method: 'post',
  data: param
});

/* 生成手机端功能设计所需要生成的代码---完成 */
export const buildPhoneWebCode = (param) => request({
  url: baseUrl+'/build-code/build-app-function-code',
  method: 'post',
  data: param
});

/* 生成手机端功能设计所需要生成的代码---保存草稿 */
export const buildPhoneWebCodeByDraft = (param) => request({
  url: baseUrl+'/app-function-scheme',
  method: 'post',
  data: param
});

/* 生成手机端功能设计所需要生成的代码---编辑*/
export const editPhoneWebCode = (param) => request({
  url: baseUrl+'/app-function-scheme/'+param.F_Id,
  method: 'put',
  data: param
});

/* 获取手机端功能设计代码模板 分页 */
export const getPhoneCodeSchemaInfo = (param) => request({
  url: baseUrl + '/app-function-scheme',
  method: 'get',
  params: param
});

/*删除手机端功能设计代码模板*/
export const deletePhoneCodeSchema = (id) => request({
  url: baseUrl + '/app-function-scheme/' + id,
  method: 'delete'
});

/*宫格菜单配置查询功能菜单*/
export const getAppFunctionList = (type) => request({
  url: baseUrl + '/app-func/' + type,
  method: 'get'
});


/* 获取手机端主页设计所需生成的代码 */
export const getPhoneIndexPreviewWebCode = (param) => request({

  url: baseUrl +'/build-code/preview-app-index-code',
  method: 'post',
  data: param
});

/* 生成手机端首页设计所需要生成的代码---完成 */
export const buildPhoneHomeCode = (param) => request({
  url: baseUrl+'/build-code/build-app-index-code',
  method: 'post',
  data: param
});


/* 检测功能类名是否有相同 */
export const validateFunctionName= (name) => request({
  url: baseUrl + `/modules/${name}/validate-url`,
  method: 'get'
});

/* 获取手机端登录设计所需生成的代码 */
export const getPhoneLoginPreviewWebCode = (config) => request({

  url: baseUrl +'/build-code/preview-app-login-code',
  method: 'post',
  data:  {
    config
  }
});

/* 获取手机端登录设计所需生成的代码 */
export const createPhoneLoginCode = (code) => request({

  url: baseUrl +'/build-code/build-app-login-code',
  method: 'post',
  data:  {
    code 
  }
});

/*获取手机端设计详情*/
export const getStepDataById= (id) => request({
  url: baseUrl + `/app-function-scheme/${id}`,
  method: 'get'
});
