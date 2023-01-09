import { baseUrl } from "@/config/env";
export default {
  methods: {
    getNodeTypeName(nodeType) {
      let str = "";
      switch (nodeType) {
        case 'created':
          str = '表单初始化';
          break;
        case 'edit':
          str = '获取表单数据';
          break;
        case 'mounted':
          str = '加载表单';
          break;
        case 'submit':
          str = '提交表单';
          break;
        default:
          break;
      }
      return str;
    },
    async insertJournal({
      nodeType,
      type,
      FormName,
      FormId,
      apiJournal
    }) {
      try {
        let nodeTypeName = this.getNodeTypeName(nodeType);
        let params = {
          type,
          FormName,
          FormId,
          nodeType,
          nodeTypeName,
          apiJournal
        };
        await this.$axios({
          method: "POST",
          url: baseUrl + "/log/addFormLog",
          data: [params],
        });
      }
      catch (error) {}
    },
    getStartNodeMsg(nodeName) {
      return {
        nodeName,
        status: 2,
        msg: "开始",
      };
    },
    getEndNodeMsg(nodeName) {
      return {
        nodeName,
        status: 3,
        msg: "结束",
      };
    },
    getNodeMsgs(res, nodeName, F_UrlAddress, id, type) {
      let nodeMsgs = {};
      if (res && res.data) {
        if (res.data.code !== 0 && res.data.code !== 200) {
          nodeMsgs = {
            nodeName,
            F_UrlAddress,
            id,
            type,
            status: 0,
            msg: "失败：" + res.data.msg,
          };
        }
        else {
          nodeMsgs = {
            nodeName,
            F_UrlAddress,
            id,
            type,
            status: 1,
            msg: "成功",
          };
        }
      }
      else {
        nodeMsgs = {
          nodeName,
          F_UrlAddress,
          id,
          type,
          status: 0,
          msg: "失败：请求接口失败",
        };
      }
      return nodeMsgs;
    },
    async insertSystemJournal(nodeType, apiJournal) {
      if (apiJournal.length > 0) {
        let params = {
          type: 2,
          FormName: this.addressUrl,
          FormId: this.addressUrl,
          nodeType,
          apiJournal,
        };
        await this.insertJournal(params);
      }
    },
  }
}