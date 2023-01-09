import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/* 获取流程信息 */
export const getTaskInfo = (operation,taskId) =>
  request({
    url: baseUrl + "/workflow-task/getTaskInfo",
    method: "get",
    params:{operation,taskId}
  });

  