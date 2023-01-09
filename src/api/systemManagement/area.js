import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/* 获取省份树 */
export const getProvinceTree = (param = { keyword: "" }) =>
  request({
    url: baseUrl + "/areas/province",
    method: "get",
    params: param,
  });

/* 获取区域信息 */
export const getAreasChild = (id, param = { keyword: "" }) =>
  request({
    url: baseUrl + "/areas/" + id + "/child",
    method: "get",
    params: param,
  });

/* 新增 */
export const postArea = (obj) =>
  request({
    url: baseUrl + "/areas",
    method: "post",
    data: obj,
  });

/* 编辑 */
export const modifyArea = (id, obj) =>
  request({
    url: baseUrl + "/areas/" + id,
    method: "put",
    data: obj,
  });

/* 删除 */
export const deleteArea = (ids) =>
  request({
    url: baseUrl + "/areas/" + ids,
    method: "delete",
  });
