<script>
import { deepClone } from "@/utils/index";
import { getDataBySQL } from "@/api/databasemanage/datasource";
import { getDataDetail } from "@/api/system/dataitem";
import { getDbLinksTestSql } from "@/api/databasemanage/databaselink";

import changeFormDataMixin from "./custom/mixin/changeFormFieldData"; // 修改json数据以及对应model值
import elasticMixin from "./custom/mixin/elastic"; //联想组件
import renderMixin from "./custom/mixin/render"; // render方法
import formEventMixin from "./custom/mixin/formEvent"; // 表单事件
import hideComponentsMixin from "@/mixins/hideComponents"; // 隐藏组件

export default {
  name: "workflowFormParser",
  mixins: [changeFormDataMixin, elasticMixin, renderMixin,formEventMixin,hideComponentsMixin],
  props: {
    conf: {
      type: Object,
      required: true,
    },
    formFieldInfo: {
      type: Object,
    },
    formData: {
      type: Object,
    },
    formInfos: {
      type: Object,
    },
    taskComment: {
      type: Array,
    },
    type: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    isEdit: {
      type: Number,
      default: 1,
    },
    eventData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      formType: "",
      formIndex: 0,
      slots: [],
      formConf: {},
      createdNodes: [],
      mountedNodes: [],
      editNodes: [],
      submitNodes: [],
      authorityList: [],
      taskCommentList: {},
      taskCommentIds: [],
    };
  },
  async created() {
    this.formType = this.type;
    this.formIndex = this.index;
    this.formConf = deepClone(this.conf);
    this.formConf.triggerEventIds = [];
    this.formConf.triggerEventValue = new Map();
    if (!this.formConf.fields) {
      this.$message.error(this.$t("workFlow.printCurrentPage.hintAbnormal"));
      return false;
    }
    console.log('formdata',this.formFieldInfo,this.conf,this.eventData)
    console.log('this.formConf.hideComponents',this.formConf.hideComponents);
    // 隐藏组件
    if(this.formConf.hideComponents){
      let mapList = await this.initHideComponentList(this.formConf.hideComponents);
      this.$store.commit("SET_HIDE_COMPONENT_LIST", mapList);
    }
    if (this.isEdit==1&&this.formData && "{}" != JSON.stringify(this.formData)) {
       this.isEdit = 3;//编辑
    }
    if (
      !this.formFieldInfo ||
      !this.formFieldInfo.children ||
      this.formFieldInfo.children.length == 0
    ) {
      this.$message.error(
        this.$t("workFlow.printCurrentPage.hintNoPermission")
      );
      return false;
    }
    this.show = false;
    this.formName=this.formInfos.SchemeInfo.F_Name;
    this.formId = this.formInfos.SchemeInfo.F_Id;
    await this.initEventData();
    this.authorityList = this.getAuthorityList();
    this.taskCommentList = this.getTaskCommentList();
    this.taskCommentIds = Object.keys(this.taskCommentList);
    this.changeData();
    this.show = true;
  },
  methods: {
    getAuthorityList() {
      //表单权限
      let authorityList = new Map();
      if (
        this.formFieldInfo &&
        this.formFieldInfo.children &&
        this.formFieldInfo.children.length > 0
      ) {
        let filedsSettingAuthority = this.formFieldInfo.children;
        filedsSettingAuthority.forEach((element) => {
          let key = element.formId;
          authorityList.set(key, element);
        });
      }
      return authorityList;
    },
    getTaskCommentList() {
      //处理意见框组件
      let taskCommentList = {};
      if (this.taskComment && this.taskComment.length > 0) {
        this.taskComment.forEach((element) => {
          if (
            element.approvalcomponents &&
            element.approvalcomponents.length > 0
          ) {
            element.approvalcomponents.forEach((taskCommentId) => {
              if (taskCommentList[taskCommentId]) {
                taskCommentList[taskCommentId].push(element);
              } else {
                taskCommentList[taskCommentId] = [element];
              }
            });
          }
        });
      }
      return taskCommentList;
    },
    setAuthorityField(fieldsIndex) {
      let tempKey = this.formConf.fields[fieldsIndex].__config__.formId;
      if (this.authorityList.has(tempKey)) {
        let tempValue = this.authorityList.get(tempKey);
        this.formConf.fields[fieldsIndex].__config__.required =
          tempValue.required;
        this.formConf.fields[fieldsIndex].__config__.view = tempValue.view;
        this.formConf.fields[fieldsIndex].disabled = tempValue.edit
          ? false
          : true;
        this.formConf.fields[fieldsIndex].__config__.edit = tempValue.edit;
        //意见框
        if (
          this.formConf.fields[fieldsIndex].__type__ &&
          this.formConf.fields[fieldsIndex].__type__ == "opinion"
        ) {
          //工作流相关意见簿 不显示
          let selfId =
            this.formFieldInfo.F_Id +
            "-" +
            this.formConf.fields[fieldsIndex].__config__.formId;
          if (this.taskCommentIds.includes(selfId)) {
            this.formConf.fields[fieldsIndex].__config__.defaultValue = this
              .taskCommentList[selfId]
              ? this.taskCommentList[selfId]
              : [];
          }
        }
      }
    },
    setAuthorityTabField(fieldsIndex, tabKey, childrenIndex) {
      let tempKey =
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.formId;
      if (this.authorityList.has(tempKey)) {
        let tempValue = this.authorityList.get(tempKey);
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.required = tempValue.required;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = tempValue.view;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].disabled = tempValue.edit ? false : true;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.edit = tempValue.edit;
        //意见框
        if (
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__type__ &&
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__type__ == "opinion"
        ) {
          //工作流相关意见簿 不显示
          let selfId =
            this.formFieldInfo.F_Id +
            "-" +
            this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
              childrenIndex
            ].__config__.formId;
          if (this.taskCommentIds.includes(selfId)) {
            this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
              childrenIndex
            ].__config__.defaultValue = this.taskCommentList[selfId]
              ? this.taskCommentList[selfId]
              : [];
          }
        }
      }
    },
    setAuthorityTableField(fieldsIndex) {
      let tempKey = this.formConf.fields[fieldsIndex].__config__.formId;
      if (this.authorityList.has(tempKey)) {
        let tempValue = this.authorityList.get(tempKey);
        this.formConf.fields[fieldsIndex].__config__.view = true;
        let tempChildValue = tempValue.children;
        let authorityChildrenList = new Map();
        if (tempChildValue && tempChildValue.length > 0) {
          tempChildValue.forEach((ele) => {
            authorityChildrenList.set(ele.fieldsId, ele);
          });
        }
        if (
          this.formConf.fields[fieldsIndex].__config__.children &&
          this.formConf.fields[fieldsIndex].__config__.children.length > 0
        ) {
          this.formConf.fields[fieldsIndex].__config__.children =
            this.formConf.fields[fieldsIndex].__config__.children.map((ele2) => {
              if (authorityChildrenList.has(ele2.__config__.bindTableField)) {
                let temp = authorityChildrenList.get(
                  ele2.__config__.bindTableField
                );
                ele2.__config__.required = temp.required;
                ele2.__config__.view = temp.view;
                ele2.__config__.edit = temp.edit;
              } else {
                ele2.__config__.required = true;
                ele2.__config__.view = true;
                ele2.__config__.edit = true;
              }
              return ele2;
            });
        }
      } else {
        this.formConf.fields[fieldsIndex].__config__.view = false;
      }
    },
    setAuthorityTabTableField(fieldsIndex, tabKey, childrenIndex) {
      let tempKey =
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.formId;
      if (this.authorityList.has(tempKey)) {
        let tempValue = this.authorityList.get(tempKey);
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = true;
        let tempChildValue = tempValue.children;
        let authorityChildrenList = new Map();
        if (tempChildValue.length > 0) {
          tempChildValue.forEach((ele) => {
            authorityChildrenList.set(ele.fieldsId, ele);
          });
        }
        if (
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children &&
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children.length > 0
        ) {
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children.map((ele2) => {
            if (authorityChildrenList.has(ele2.__config__.bindTableField)) {
              let temp = authorityChildrenList.get(
                ele2.__config__.bindTableField
              );
              ele2.__config__.required = temp.required;
              ele2.__config__.view = temp.view;
              ele2.__config__.edit = temp.edit;
            } else {
              ele2.__config__.required = true;
              ele2.__config__.view = true;
              ele2.__config__.edit = true;
            }
            return ele2;
          });
        }
      } else {
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = false;
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = false;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
            childrenIndex
          ].__config__.children.map((ele2) => {
            ele2.__config__.view = false;
            return ele2;
          });
      }
    },
    getNewObj() {
      const newObj = {};
      let self = this;
      this.formConf.fields.forEach((el) => {
        if (el.__config__.componentName === "table") {
          if (!newObj[el.__config__.bindTable]) {
            newObj[el.__config__.bindTable] = [];
          } else {
            newObj[el.__config__.bindTable] = el.__config__.defaultValue;
          }

          let tmp = el.__config__.defaultValue.dynamic;
          if (tmp && tmp.length > 0) {
            tmp.forEach(function (item) {
              let itemChild = { ...item };
              delete itemChild._index;
              for (let [key, value] of Object.entries(itemChild)) {
                if (key.includes("$")) {
                  delete itemChild[key];
                }
              }
              newObj[el.__config__.bindTable].push(itemChild);
            });
          }
        } else if (el.__config__.componentName == "avue-tabs") {
          let fieldInfo = this.getFieldsByTab(
            el.__config__.childrenObj,
            newObj
          );
          let bindTable = "";
          if (fieldInfo && fieldInfo.length) {
            bindTable = fieldInfo[0].bindTable;
            if (!newObj[bindTable]) {
              newObj[bindTable] = {};
            }
          }
          fieldInfo.map((item) => {
            if (
              item.tag === "el-checkbox-group" ||
              item.tag === "el-date-picker" ||
              item.tag === "el-time-picker"
            ) {
              newObj[bindTable][item.bindTableField] = Array.isArray(
                item.defaultValue
              )
                ? item.defaultValue.join(",")
                : item.defaultValue;
            } else if (item.tag === "avue-select-area") {
              //行政区域
              newObj[bindTable][item.bindTableField] = Array.isArray(
                item.defaultValue
              )
                ? item.defaultValue.join(",")
                : item.defaultValue;
            } else {
              newObj[bindTable][item.bindTableField] = item.defaultValue;
            }
          });
        } else {
          if (el.__config__.bindTable) {
            if (!newObj[el.__config__.bindTable]) {
              newObj[el.__config__.bindTable] = {};
            }
            if (
              el.__config__.tag === "el-checkbox-group" ||
              el.__config__.tag === "el-date-picker" ||
              el.__config__.tag === "el-time-picker"
            ) {
              newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                Array.isArray(el.__config__.defaultValue)
                  ? el.__config__.defaultValue.join(",")
                  : el.__config__.defaultValue;
            } else if (el.__config__.tag === "el-upload") {
              newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                el.__config__.defaultValue;
            } else if (el.__config__.tag === "avue-select-area") {
              //行政区域
              newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                Array.isArray(el.__config__.defaultValue)
                  ? el.__config__.defaultValue.join(",")
                  : el.__config__.defaultValue;
            } else {
              newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                el.__config__.defaultValue;
            }
          }
        }
      });
      let mainParams = {};
      mainParams.F_FormId = this.formInfos.SchemeInfo.F_Id;
      let formParams = {};
      for (const key in newObj) {
        formParams[key] = newObj[key];
      }
      return formParams;
    },
    async submitForm(isDraft=false) {
      //父页面提交表单  returnData {code:0,params,fileValue}// 0 提交失败 1不需要提交 2 提交数据
      let returnData = { code: 0, params: {}, fileValue: [], draftList: {} };
      returnData.draftList = this.getNewObj();
      if(isDraft){
        return returnData;
      }
      // let formValid = false;
      let validataArry = [];
      for (const el in this.$refs) {
        if (el.includes("FormTab")) {
          for (const el2 in this.$refs[el].$refs) {
            if (el2.includes("avueTable")) {
              let value = this.$refs[el].$refs[el2].getDynamicDefaultValue();
              if (value && value.length > 0) {
                const promise4 = new Promise((resolve, reject) => {
                  this.$refs[el].$refs[el2].validate((valid) => {
                    resolve(valid);
                  });
                });
                validataArry.push(promise4);
              }
            } else {
              const promise2 = new Promise((resolve, reject) => {
                this.$refs[el].$refs[el2].validate((valid) => {
                  resolve(valid);
                });
              });
              validataArry.push(promise2);
            }
          }
        } else if (el.includes("avueTable")) {
          let value = this.$refs[el].getDynamicDefaultValue();
          if (value && value.length > 0) {
            const promise3 = new Promise((resolve, reject) => {
              this.$refs[el].validate((valid) => {
                resolve(valid);
              });
            });
            validataArry.push(promise3);
          }
        } else {
          const promise = new Promise((resolve, reject) => {
            this.$refs[el].validate((valid) => {
              resolve(valid);
            });
          });
          validataArry.push(promise);
        }
      }
      let res = await Promise.all(validataArry);
      if (res.includes(false)) {
        return returnData;
      }

      let needSubmitForm = true;
      const newObj = {};
      this.formConf.fields.forEach((el) => {
        if (el.__config__.componentName === "table") {
          if (!newObj[el.__config__.bindTable]) {
            newObj[el.__config__.bindTable] = [];
          } else {
            newObj[el.__config__.bindTable] = el.__config__.defaultValue;
          }

          let tmp = el.__config__.defaultValue.dynamic;
          if (tmp && tmp.length > 0) {
            tmp.forEach(function (item) {
              let itemChild = { ...item };
              delete itemChild._index;
              for (let [key, value] of Object.entries(itemChild)) {
                if (key == "_index") {
                  delete itemChild[key];
                }
                if (key.includes("$")) {
                  delete itemChild[key];
                } else {
                  if (Array.isArray(value)) {
                    itemChild[key] = value.join(",");
                  }
                }
              }
              newObj[el.__config__.bindTable].push(itemChild);
            });
          }
        } else {
          // if (el.__config__.edit) {
          if (el.__config__.componentName === "table") {
          } else {
            if (el.__config__.bindTable) {
              if (!newObj[el.__config__.bindTable]) {
                newObj[el.__config__.bindTable] = {};
              }
               if (el.__config__.defaultValue && Array.isArray(el.__config__.defaultValue)) {
                newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                  el.__config__.defaultValue.join(",");
              } else {
                newObj[el.__config__.bindTable][el.__config__.bindTableField] = el.__config__.defaultValue;
              }
            }
          }
          // }
          if (el.__config__.componentName == "avue-tabs") {
            let fieldInfo = this.getFieldsByTab(
              el.__config__.childrenObj,
              newObj
            );
            let bindTable = "";
            if (fieldInfo && fieldInfo.length) {
              bindTable = fieldInfo[0].bindTable;
              if (!newObj[bindTable]) {
                newObj[bindTable] = {};
              }
            }
            fieldInfo.map((item) => {
               if (item.defaultValue && Array.isArray(item.defaultValue)) {
                newObj[bindTable][item.bindTableField] =
                  item.defaultValue.join(",");
              } else {
                newObj[bindTable][item.bindTableField] = item.defaultValue;
              }
            });
          }
        }
      });
      if (JSON.stringify(newObj) == "{}") {
        needSubmitForm = false;
      }
      let formParams = {};
      if (needSubmitForm) {
        for (const key in newObj) {
          formParams[key] = newObj[key];
        }
        var mainParams = {};

        if (this.formInfos.SchemeInfo) {
          mainParams.F_FormId = this.formInfos.SchemeInfo.F_Id; // 表单ID(后端需要)
          mainParams.F_Name = this.formInfos.SchemeInfo.F_Name; // 表单名
        }
        var params = Object.assign(mainParams, formParams);

        returnData.code = 2;
        returnData.params = params;
        return returnData;
      } else {
        returnData.code = 1;
        returnData.params = {};
        return returnData;
      }
    },
    getFieldsByTab(childrenObj, newObj) {
      let _arr = [];
      if (!childrenObj || childrenObj instanceof Object) {
        for (let key in childrenObj) {
          let children = childrenObj[key];
          children.map((item) => {
            if (item.__config__.componentName == "table") {
              let children = item.__config__.children || [];
              let bindTable = "";
              children.map((el) => {
                bindTable = el.__config__.bindTable;
                if (!newObj[el.__config__.bindTable]) {
                  newObj[el.__config__.bindTable] = [];
                }
              });
              // let self = this;
              let tmp =
                item.__config__ &&
                item.__config__.defaultValue &&
                item.__config__.defaultValue.dynamic
                  ? item.__config__.defaultValue.dynamic
                  : [];
              if (tmp && Array.isArray(tmp) && tmp.length > 0) {
                tmp.forEach((itemChild) => {
                  if (itemChild._index) {
                    delete itemChild._index;
                  }
                  for (let [key, value] of Object.entries(itemChild)) {
                    if (key == "_index") {
                      delete itemChild[key];
                    }
                    if (key.includes("$")) {
                      delete itemChild[key];
                    } else {
                      if (Array.isArray(value)) {
                        itemChild[key] = value.join(",");
                      }
                    }
                  }
                  newObj[bindTable].push(itemChild);
                });
              }
            } else {
              if (item.__config__.bindTable && item.__config__.bindTableField) {
                let _obj = {};
                _obj.bindTableField = item.__config__.bindTableField;
                _obj.defaultValue = item.__config__.defaultValue;
                _obj.bindTable = item.__config__.bindTable;
                _obj.tag = item.__config__.tag;
                _arr.push(_obj);
              }
            }
          });
        }
      }
      return (() => {
        return _arr;
      })();
    },
   
    
  },
};
</script>
<style scoped>
div /deep/ .el-table__body,
div /deep/ .el-table__footer,
div /deep/ .el-table__header {
  width: 100% !important;
}
.el-form-item {
  margin-top: 0;
  margin-bottom: 18px !important;
}
div /deep/ .avue-input-tree {
  display: block;
}
</style>
