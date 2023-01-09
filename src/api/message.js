import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/* 获取消息 */
export const getList = () =>
  request({
    url: baseUrl + "/oa/xjr-oa-message",
    method: "get",
  });

/* 将单条未读消息改为已读 */
export const readMessage = id =>
  request({
    url: baseUrl + "/oa/xjr-oa-message/"+id,
    method: "put"
  });

/* 将所以未读消息改为已读 */
export const readAllMessage = moduleId =>
request({
  url: baseUrl + "/oa/xjr-oa-message/readAllMessage/"+moduleId,
  method: "put"
});

/*查询所有未读消息 */
export const unreadMessageCount = () =>
  request({
    url: baseUrl + "/oa/xjr-oa-message/unread-count",
    method: "get",
  });