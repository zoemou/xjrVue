import request from "@/router/axios";
import qs from "qs";
import Cookies from "js-cookie";
import md5 from 'js-md5'
import { baseUrl } from "@/config/env";
export const loginByUsername = (param) =>
  request({
    url: baseUrl + "/login",
    method: "post",
    meta: {
      isToken: false,
    },
    data: {
      account :param.username,
      password : param.password,
      code : param.code
    },
  });


export const loginByPhone = (param) =>
  request({
    url: baseUrl + "/login/phone",
    method: "post",
    meta: {
      isToken: false,
    },
    data: {
      account :param.phone,
      password : param.code,
      code : param.tenantcode
    },
  });

export const getValidateCode = (mobile,tenantCode) =>
  request({
    url: baseUrl + "/login/" + mobile,
    method: "get",
    params: {tenantCode},
  });

  export const sendMsgCode = (mobile) =>
  request({
    url: baseUrl + "/login/send/" + mobile,
    method: "get",
  });

export const getUserInfoByJava = (data) =>
  request({
    url: baseUrl + "/user_/getCurUserInfo",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", Authorization: Cookies.get("TOKEN") },
    data: qs.stringify(data),
  });

export const getUserInfo = () =>
  request({
    url: "" + "/user/getUserInfo",
    method: "get",
  });

export const refeshToken = () =>
  request({
    url: "" + "/user/refesh",
    method: "post",
  });

export const getMenu = (systemId) =>
  request({
    url: baseUrl + "/modules/vue",
    method: "get",
    params: {
      'systemId':systemId
    },
  });

export const getUserPermission = () =>
  request({
    url: baseUrl + "/modules/other",
    method: "get",
  });

export const getTopMenu = () =>
  request({
    url: baseUrl + "/modules/common",
    method: "get",
  });

export const sendLogs = (list) =>
  request({
    url: "" + "/user/logout",
    method: "post",
    data: list,
  });

export const logout = () =>
  request({
    url: baseUrl + "/login/logout",
    // meta: {
    //   isToken: false,
    // },
    method: "post",
  });

/* orm增加数据*/
export function logAdd(data) {
  return request(`${baseUrl}/login/add-clue`, {
    method: "post",
    data,
  });
}

/* 修改密码 */
export function updatePass(userId,data){
  return request(`${baseUrl}/users/${userId}/updatePassword`, {
    method: "put",
    data
  })
}

/* 忘记密码 */
export const resetPass = (data) =>{
  request({
    url: `${baseUrl}/users/forget-password`,
    method: "post",
    data
  });
}