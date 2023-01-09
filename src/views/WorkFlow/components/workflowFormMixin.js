import { baseUrl } from "@/config/env";
import {
  insertAllNodeJournal
} from "@/api/databasemanage/datasource.js";
import { setSubmitFormEvents, getSubmitFormEvents, setIsExecutedFormEvent, getIsExecutedFormEvent } from "@/util/dataApi";
import request from "@/router/axios";
export default {
  beforeDestroy() {
    this.$store.commit("RESET_FORM_PARSER");
  },
  methods: {
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
          }
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
    //表单事件 提交事件
    async submitFormEvents() {
      let nodes = getSubmitFormEvents();
      let list = [];
      for (const key in nodes) {
        let item = nodes[key];
        let apiJournal = [];
        if (item?.apiJournal && item.apiJournal.length > 0) {
          for (const ele of item.apiJournal) {
            let { nodeName, nodeLog, F_UrlAddress, id, type, status, config } = ele;
            if (status == 4) {
              try {
                let res = await request(config);
                if (nodeLog) apiJournal.push(this.getNodeMsgs(res, nodeName, F_UrlAddress, id, type))
              } catch (error) {
                if (nodeLog) apiJournal.push(this.getNodeMsgs(error, nodeName, F_UrlAddress, id, type))
              }
            } else {
              if (nodeLog) apiJournal.push(ele);
            }
          }
        }
        if (apiJournal.length > 0) {
          list.push({
            type: item.type,
            FormName: item.FormName,
            FormId: item.FormId,
            nodeType: 'submit',
            nodeTypeName: '提交表单',
            apiJournal
          });
        }
      }

      if (list.length > 0) {
        try {
          await insertAllNodeJournal(list);
        } catch (error) {

        }

      }
    },
    async flowTabsClick(activeName, oldActiveName) {
      if (oldActiveName == 'form') {//离开表单信息tab，需要提交数据
        await this.tabBeforeLeave(this.currentActiveName, this.currentActiveName,true);
        this.activeName = this.currentActiveName;
        this.currentActiveName = "";
      }
      if (activeName == 'form') {//回到表单信息tab，重新显示
        this.currentActiveName = this.activeName;
      }
    },
    async tabBeforeLeave(activeName, oldActiveName,isDraft=false) {
      this.currentActiveName = oldActiveName;
      let activeIndex = oldActiveName.split("-")[1];
      let vueRefComponent = this.$refs[this.currentActiveName];
      let vueRef = vueRefComponent[0];
      let valueData = vueRef._data;
      let formInfoIndex = valueData.formIndex;

      return new Promise((resolve, reject) => {
        vueRef.submitForm(isDraft).then((returnData) => {
          this.changeReturnData(activeIndex, formInfoIndex, valueData, returnData);
          this.processInfo.forms_data[formInfoIndex] = returnData.draftList
          this.currentActiveName = activeName;
          let tempIndex = activeName.split("-")[1];
          //表单事件中，辅助提交api
          if (typeof vueRef.getHandleSubmitFormEvent == 'function') {
            let configs = vueRef.getHandleSubmitFormEvent();
            setSubmitFormEvents(configs);
          }
          //表单事件 只执行一次 标记
          if (getIsExecutedFormEvent() == false) {
            setIsExecutedFormEvent(true);
          }
          let key = Number(tempIndex);
          this.$store.commit("CHANGE_WORKFLOW_FORM_TAB_INDEX_KEY", key);
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    changeReturnData(activeIndex, formInfoIndex, valueData, returnData) {
      if (returnData.code == 0) {
        // 0 提交失败
        this.formReturnData[activeIndex].formSubmitError = true;
        this.formReturnData[activeIndex].returnData = returnData;
        this.formInfoList[formInfoIndex].valid = false;
        return false;
      } else if (returnData.code == 1) {
        // 1 不需要提交
        this.formReturnData[activeIndex].formSubmitError = false;
        this.formReturnData[activeIndex].returnData = returnData;
        this.formInfoList[formInfoIndex].valid = true;
      } else {
        //2 提交数据
        let params = returnData.params;
        let forms_data = {};
        if (params) {
          if (params.F_FormId) {
            forms_data = params;
          } else {
            for (let k of Object.keys(params)) {
              let ParamValue = params[k];
              let splitK = k.split("Entity");
              let myKey = splitK.length > 0 ? splitK[0] : "";
              if (Array.isArray(ParamValue)) {
                forms_data[myKey] = ParamValue;
              } else {
                for (let filedKey of Object.keys(ParamValue)) {
                  forms_data[filedKey] = params[k][filedKey];
                }
              }
            }
          }
        }
        let fileValue = returnData.fileValue;
        if (fileValue && fileValue.length > 0) {
          this.formData.fileValue = [...new Set([...this.formData.fileValue, ...fileValue])];
        }
        this.processInfo.forms_data[activeIndex] = forms_data;
        this.formInfoList[formInfoIndex].valid = true;
        this.formReturnData[activeIndex].formSubmitError = false;
        this.formReturnData[activeIndex].returnData = returnData;
        if (valueData.formType == 0) {
          //自定义表单
          this.formIdParams[activeIndex] = {
            F_FormId: params.F_FormId,
            F_Type: 0,
            F_Url: ""
          };
          if (this.formPrimaryKey[activeIndex]) {
            params = { ...params, primaryKey: this.formPrimaryKey[activeIndex] };
            this.Ids[activeIndex] = this.formPrimaryKey[activeIndex];
            const promise = {
              url:
                baseUrl +
                `/form-scheme/${params.F_FormId}/instance-form-list/${this.formPrimaryKey[activeIndex]}`,
              method: "PUT",
              data: params
            };
            this.promiseList[activeIndex] = promise;
          } else {
            this.Ids[activeIndex] = "";
            const promise = {
              url:
                baseUrl + `/form-scheme/${params.F_FormId}/instance-form-list`,
              method: "POST",
              data: params
            };
            this.promiseList[activeIndex] = promise;
          }
        } else if (valueData.formType == 2) {
          let idKey = this.formPrimaryKey[activeIndex];
          this.Ids[activeIndex] = idKey;
          this.formIdParams[activeIndex] = {
            F_FormId: this.formInfoList[formInfoIndex].F_Id,
            F_Type: 2,
            F_Url: returnData.addressUrl
          };
          if (idKey) {
            let promiseParams = {
              ...params,
              F_url: returnData.addressUrl,
              idKey
            };
            const promise = {
              url: baseUrl + `/${returnData.addressUrl}/${idKey}`,
              method: "PUT",
              data: promiseParams
            };
            this.promiseList[activeIndex] = promise;
          } else {
            let promiseParams = { ...params, F_url: returnData.addressUrl };
            const promise = {
              url: baseUrl + `/${returnData.addressUrl}`,
              method: "POST",
              data: promiseParams
            };
            this.promiseList[activeIndex] = promise;
          }
        }
      }


    },
    delEmptyForm(data) {
      if (data.editAll || data.requiredAll || data.viewAll) return false

      if (data.children) {
        const isEmpty = data.children.every(item => {
          if (item.children) {
            return item.children.every(item2 => {
              return !item2.edit && !item2.required && !item2.view
            })
          } else {
            return !item.edit && !item.required && !item.view
          }
        })
        return isEmpty
      } else {
        return false
      }
    }
  },
};
