import {
  getEventDataAPiConfig,
  getDataAPi,
  getIsExecutedFormEvent,
  insertJournal,
} from "@/util/dataApi";
import {
  setFormValueInfoProperties,
  triggerEventHandler,
} from "@/util/dataApi";
export default {
  props: {
    eventData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isEdit: {
      type: Number,
    },
  },
  data() {
    return {
      formName: "",
    };
  },
  methods: {
    async initEventData() {
      this.getEventDataNodes();
      await this.execFormEvent("created");
      if (this.isEdit==3) {
        await this.execFormEvent("edit");
      }
      await this.execFormEvent("mounted");
    },
    getEventDataNodes() {
      if (this.eventData && this.eventData.length > 0) {
        // created
        this.createdNodes = this.eventData.filter((ele) => {
          return ele.type === "created";
        });
        // mounted
        this.mountedNodes = this.eventData.filter((ele) => {
          return ele.type === "mounted";
        });

        // edit
        this.editNodes = this.eventData.filter((ele) => {
          return ele.type === "edit";
        });

        // submit
        this.submitNodes = this.eventData.filter((ele) => {
          return ele.type === "submit";
        });
      }
    },
    async execFormEvent(type) {
      let isExecutedFormEvent = getIsExecutedFormEvent();
      if (isExecutedFormEvent == false) {
        if (type == "created") {
          await this.execMethod(this.createdNodes, type);
        } else if (type == "mounted") {
          await this.execMethod(this.mountedNodes, type);
        } else if (type == "edit") {
          await this.execMethod(this.editNodes, type);
        }
      }
    },
    async execMethod(nodes, nodeType) {
      let nodeMsgs = [];
      if (nodes && nodes.length > 0) {
        for (const triggerEventData of nodes) {
          let nodeName = triggerEventData.info.nodeName
            ? triggerEventData.info.nodeName
            : "自定义节点";
          let nodeLog = triggerEventData.info.nodeLog;
          if (
            triggerEventData.triggerEventData &&
            triggerEventData.triggerEventData.length > 0
          ) {
            if (nodeLog) {
              nodeMsgs.push({
                nodeName,
                status: 2, //0 失败 1 成功 2 标记开始 3 标记结束
                msg: "开始",
              });
            }
            for (const item of triggerEventData.triggerEventData) {
              if (item.apiConfig && item.apiConfig.url) {
                let res = await getDataAPi(item.apiConfig);
                if (res && res.data) {
                  if (res.data.code !== 0 && res.data.code !== 200) {
                    if (nodeLog) {
                      nodeMsgs.push({
                        nodeName,
                        F_UrlAddress: item.apiConfig.F_UrlAddress,
                        id: item.apiConfig.id,
                        type: item.apiConfig.type,
                        status: 0,
                        msg: "失败：" + res.data.msg,
                      });
                    }
                  } else {
                    if (
                      item.apiConfig.outputs &&
                      item.apiConfig.outputs.length > 0 &&
                      res.data.data
                    ) {
                      item.apiConfig.outputs.forEach((element) => {
                        if (element.formId && element.outputKey) {
                          let assignable = false;
                          if(this.isEdit == 1){
                            //新增
                            if(nodeType == "created"||nodeType == "mounted"){
                              assignable = true;
                            }
                          }else if(this.isEdit == 3){
                            //编辑
                            if(nodeType == "edit"||nodeType == "mounted"){
                              assignable = true;
                            }
                          }
                          if(assignable){
                            this.formConf.triggerEventValue.set(
                              element.formId,
                              res.data.data[element.outputKey]
                            );
                            this.formConf.triggerEventIds.push(
                              element.formId
                            );
                            setFormValueInfoProperties(
                              element.formId,
                              res.data.data[element.outputKey]
                            );
                          }
                        }
                      });
                    }

                    if (nodeLog) {
                      nodeMsgs.push({
                        nodeName,
                        F_UrlAddress: item.apiConfig.F_UrlAddress,
                        id: item.apiConfig.id,
                        type: item.apiConfig.type,
                        status: 1,
                        msg: "成功",
                      });
                    }
                  }
                } else {
                  if (nodeLog) {
                    nodeMsgs.push({
                      nodeName,
                      F_UrlAddress: item.apiConfig.F_UrlAddress,
                      id: item.apiConfig.id,
                      type: item.apiConfig.type,
                      status: 0,
                      msg: "失败：请求接口失败",
                    });
                  }
                }
              }
            }
            if (nodeLog) {
              nodeMsgs.push({
                nodeName,
                status: 3, //0 失败 1 成功 2 标记开始 3 标记结束
                msg: "结束",
              });
            }
          }
        }
      }
      this.insertCustomJournal(nodeType, nodeMsgs);
    },
    async insertCustomJournal(nodeType, apiJournal) {
      if (apiJournal.length > 0) {
        let params = {
          type: 0,
          FormName: this.formName,
          FormId: this.F_FormId,
          nodeType,
          apiJournal,
        };
        await insertJournal(params);
      }
    },
    getHandleSubmitFormEvent() {
      let nodeMsgs = [];

      if (this.submitNodes && this.submitNodes.length > 0) {
        for (const triggerEventData of this.submitNodes) {
          let nodeName = triggerEventData.info.nodeName
            ? triggerEventData.info.nodeName
            : "自定义节点";
          let nodeLog = triggerEventData.info.nodeLog;
          if (
            triggerEventData &&
            triggerEventData.triggerEventData &&
            triggerEventData.triggerEventData.length > 0
          ) {
            if (nodeLog) {
              nodeMsgs.push({
                nodeName,
                status: 2, //0 失败 1 成功 2 标记开始 3 标记结束 4 待执行api
                msg: "开始",
                nodeLog,
              });
            }
            for (const item of triggerEventData.triggerEventData) {
              if (item.apiConfig && item.apiConfig.url) {
                nodeMsgs.push({
                  nodeName,
                  F_UrlAddress: item.apiConfig.F_UrlAddress,
                  id: item.apiConfig.id,
                  type: item.apiConfig.type,
                  status: 4, //待执行api
                  msg: "",
                  nodeLog,
                  config: getEventDataAPiConfig(item.apiConfig),
                });
              }
            }
            if (nodeLog) {
              nodeMsgs.push({
                nodeName,
                status: 3, //0 失败 1 成功 2 标记开始 3 标记结束
                msg: "结束",
                nodeLog,
              });
            }
          }
        }
      }
      return {
        type: 0,
        FormName: this.formName,
        FormId: this.formId,
        nodeType: "submit",
        apiJournal: nodeMsgs,
      };
    },
    async editFormEvent() {
      await this.execMethod(this.editNodes,'edit');
    },
    async submitFormEvent() {
      await this.execMethod(this.submitNodes,'submit');
    },
  },
};
