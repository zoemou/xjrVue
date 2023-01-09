import print from "print-js";
import html2canvas from 'html2canvas';
import { deepClone } from "@/utils";
export default {
  directives: {
    print
  },
  props: ['systemFormType', 'formFieldPermissions', 'systemFormParserTaskCommentList', 'systemFormParserFormData', 'parameter'],
  data() {
    return {
      isAdd: true,
      operationVal: "add",
      lookSystemForm: "0",
      isWorkflowForm: false,
      systemFieldPermissions: [],
      permissionFieldsIds: [],
      permissionFieldsMap: new Map(),
      formFields: {
        formData: {}, //model 参数
        formLabel: {}, //文本label
        formType: {}, //类型
        formFormId: {}, //唯一formId (计算配置相关，以及意见框显示都有使用)
        formOpinion: [] //意见框 字段合集
      },
      fileValue: [],
      needToJudgeAuthority: true,
      formSubTableNotRequiredList: {},
      formSubTableDisabledList: {}
    };
  },
  beforeDestroy() {
    window.parent.workflowSubmit = null;
  },
  mounted() {
    this.lookSystemForm = window.localStorage.getItem("lookSystemForm");;
    if (this.systemFormType == "1") {
      //工作流  预览
      this.needToJudgeAuthority = false;
      this.isWorkflowForm = true;
    } else if (this.systemFormType == "2") {
      //工作流 获取字段配置
      this.needToJudgeAuthority = true;
      //  隐藏组件
      let hideComponents = [];
      if (typeof this.getHideComponents == 'function') {
        hideComponents = this.getHideComponents();
      }
      this.$nextTick(() => {
        this.$emit('changeHideComponents', hideComponents);
        this.formFields.formData = this.formData;
        this.setWorkFlowFormField();
        this.$emit('changeSystemData', this.systemFieldPermissions);
      });
      this.isWorkflowForm = true;
    } else if (this.systemFormType == "3") {
      //工作流 发起或者审批系统表单
      this.needToJudgeAuthority = true;
      this.setSystemFormParser();
    } else {
      //普通打开
      this.needToJudgeAuthority = true;
      this.isWorkflowForm = false;
    }
  },
  methods: {
    setSystemFormParser() {
      //兼容旧版 更新数据后重新渲染
      if (this.showFormKey == undefined) {
        this.showForm = false;
        setTimeout(() => {
          this.showForm = true;
        }, 1);
      } else {
        this.showFormKey++;
      }
      // 重新渲染子表单
      this.reRenderSubform = false;
      setTimeout(() => {
        this.reRenderSubform = true;
      }, 1);
      this.systemFieldPermissions = this.formFieldPermissions;
      let formData = {};
      let systemFormParserFormData = this.systemFormParserFormData;
      formData = systemFormParserFormData
        ? systemFormParserFormData
        : {};
      if (formData && "{}" != JSON.stringify(formData)) {
        this.isAdd = false;
        if (this.operationVal) {
          this.operationVal = "edit";
        }
        for (let k of Object.keys(formData)) {
          if (k.includes('EntityList')) {
            let tempK = k.replace('EntityList', '');
            if (this[tempK] && Array.isArray(formData[k])) {
              setTimeout(() => {
                this[tempK][tempK] = formData[k].map(element => {
                  for (let [k2, v2] of Object.entries(element)) {
                    if (v2 && typeof v2 == 'string' && v2.includes(',')) {
                      element[k2] = v2.split(',');
                    }
                  }
                  return element;
                });

              }, 0);
            }
          } else {
            if (k == this.mainTableName) {
              for (let [k2, v2] of Object.entries(formData[this.mainTableName])) {
                if (v2 && typeof v2 == 'string' && Array.isArray(this.formData[k2])) {
                  this.formData[k2] = v2.split(",");
                } else {
                  this.formData[k2] = v2;
                }
              }
            } else {
              //子表单
              if (this[k] && Array.isArray(formData[k])) {
                setTimeout(() => {
                  this[k][k] = formData[k].map(element => {
                    for (let [k3, v3] of Object.entries(element)) {
                      if (v3 && typeof v3 == 'string' && v3.includes(',')) {
                        element[k3] = v3.split(',');
                      }
                    }
                    return element;
                  });
                }, 0);
              } else {
                let val = formData[k];
                if (val && typeof val == 'string' && Array.isArray(this.formData[k])) {
                  this.formData[k] = val.split(",");
                } else {
                  this.formData[k] = formData[k];
                }
              }
            }
          }
        }
        // 兼容多选弹层回显
        this.formConfig.fields.forEach((ele, index) => {
          if (ele.__config__.componentName) {
            if (ele.__config__.componentName == "avue-tabs") {
              if (ele.__config__ && ele.__config__.childrenObj) {
                let obj = ele.__config__.childrenObj;
                for (var i in obj) {
                  if (obj[i].length > 0) {
                    obj[i].forEach((ele1, cindex) => {
                      if (ele1.__config__.componentName == "table") {
                        //table
                      } else {
                        if (ele1 && ele1.__config__ && ele1.__config__.tag == 'el-mutiple-input') {
                          if (this.formData[ele1.__vModel__]) {
                            this.$set(this.formData, ele1.__vModel__ + '_showValue', this.formData[ele1.__vModel__])
                            this.getMutipleAllData(this.formData, ele1.__config__, ele1.__vModel__, ele1.__config__.formId)
                          }
                        }
                      }
                    });
                  }
                }
              }
            } else if (ele.__config__.componentName == "table") {

            }
          }//普通
          else {
            if (ele && ele.__config__ && ele.__config__.tag == 'el-mutiple-input') {
              if (this.formData[ele.__vModel__]) {
                this.$set(this.formData, ele.__vModel__ + '_showValue', this.formData[ele.__vModel__])
                this.getMutipleAllData(this.formData, ele.__config__, ele.__vModel__, ele.__config__.formId)
              }
            }
          }
        });
        if (typeof this.handleEdit == "function") {
          this.handleEdit();
        }
      }
      if (this.disabled) {
        this.operationVal = "view";
      }
      //意见框
      let taskCommentList = this.systemFormParserTaskCommentList;
      taskCommentList = taskCommentList ? taskCommentList : [];
      if (this.systemFieldPermissions && this.systemFieldPermissions.length > 0) {
        this.systemFieldPermissions.forEach((ele, index) => {
          if (ele.type == "opinion") {
            let formId = window.localStorage.getItem("systemFormFId");
            let selfId = formId + "-" + ele.formId;
            if (
              taskCommentList[selfId] &&
              Array.isArray(taskCommentList[selfId])
            ) {
              this.formData[ele.fieldsId] = taskCommentList[selfId];
            }
          }
        });
      }
      this.isWorkflowForm = true;
      this.initFormFieldPermissions();
    },
    //多选弹层 表单编辑时数据回显处理
    getMutipleAllData(formData, config, model) {
      let datatype = config.dataType;
      let saveField = datatype == 'dataItem' ? 'F_ItemValue' : config.saveField
      let showField = datatype == 'dataItem' ? 'F_ItemName' : config.showField;

      if (datatype == 'dataSource' || datatype == 'dataSql') {
        if (config.dataSource) {
          this.changeMutipleData(formData, '${baseUrl}/data-sources/' + config.dataSource + '/data', model, saveField, showField)
        }
      }
      if (datatype == 'dataItem') {
        this.changeMutipleData(formData, '${baseUrl}/data-items/' + config.dataItem + '/detail', model, saveField, showField)
      }
    },
    setWorkFlowFormField() {
      let doNotGenerateTags = ["h2", "el-divider", "xjr-opinion-comonent", "avue-information-body", 'avue-custom-button'];
      if (this.formConfig.fields.length > 0) {
        this.formConfig.fields.forEach((ele, index) => {
          if (ele.__config__.componentName) {
            //table
            if (ele.__config__.componentName == "table") {
              let children = [];
              let required = true;
              let edit = true;
              let view = true;
              let disabled = false;
              let fieldsId = ele.__config__.bindTable;
              let label = ele.__config__.componentTitle;
              let type = 'table';
              let formId = ele.__config__.formId;
              view = true;
              if (ele.__config__.children && ele.__config__.children.length > 0) {
                ele.__config__.children.forEach(ele2 => {
                  let childTemp = {
                    bindTable: ele2.__config__.bindTable,
                    fieldsId: ele2.__config__.bindTableField,
                    fieldsName: ele2.__config__.label,
                    filedsType: ele2.__type__ ? ele2.__type__ : "",
                    formId: ele2.__config__.formId,
                    type: "",
                    required: true,
                    view: true,
                    edit: true,
                    disabled: false,
                    componentConfig: ele2
                  };
                  children.push(childTemp);
                });
              }

              this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
                fieldsId,
                label,
                type,
                formId,
                required,
                edit,
                disabled,
                children,
                componentConfig: ele
              });
            }
            //avuetab
            else if (ele.__config__.componentName == "avue-tabs") {
              if (ele.__config__ && ele.__config__.childrenObj) {
                let obj = ele.__config__.childrenObj;
                for (var i in obj) {
                  if (obj[i].length > 0) {
                    obj[i].forEach((ele1, cindex) => {
                      if (ele1.__config__.componentName == "table") {
                        //table
                        let children = [];
                        let required = true;
                        let edit = true;
                        let view = true;
                        let disabled = false;
                        let fieldsId = ele1.__config__.bindTable;
                        let label = ele1.__config__.componentTitle;
                        let type = 'table';
                        let formId = ele1.__config__.formId;
                        view = true;
                        if (ele1.__config__.children && ele1.__config__.children.length > 0) {
                          ele1.__config__.children.forEach(ele2 => {
                            let childTemp = {
                              bindTable: ele2.__config__.bindTable,
                              fieldsId: ele2.__config__.bindTableField,
                              fieldsName: ele2.__config__.label,
                              filedsType: ele2.__type__ ? ele2.__type__ : "",
                              formId: ele2.__config__.formId,
                              type: "",
                              required: true,
                              view: true,
                              edit: true,
                              disabled: false,
                              componentConfig: ele2
                            };
                            children.push(childTemp);
                          });
                        }

                        this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
                          fieldsId,
                          label,
                          type,
                          formId,
                          required,
                          edit,
                          disabled,
                          children,
                          componentConfig: ele1
                        });
                      } else if (ele1.__config__.avueType == "autoCode") {
                        // 编码 不显示
                        let required = false;
                        let edit = false;
                        let disabled = true;
                        let fieldsId = ele1.__vModel__;
                        let label = ele1.__config__.label;
                        let type = ele1.__config__.tag;
                        let formId = ele1.__config__.formId;
                        this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
                          fieldsId,
                          label,
                          type,
                          formId,
                          required,
                          disabled,
                          edit,
                          componentConfig: ele1
                        });
                      }
                      //doNotGenerateTags
                      else if (doNotGenerateTags.includes(ele1.__config__.tag)) {
                        let required = false;
                        let edit = false;
                        let disabled = true;
                        let fieldsId = ele1.__vModel__ ? ele1.__vModel__ : "";
                        let label = ele1.__config__.label;
                        let type =
                          ele1.__type__ == "opinion" ? ele1.__type__ : ele1.__config__.tag;
                        let formId = ele1.__config__.formId;
                        this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
                          fieldsId,
                          label,
                          type,
                          formId,
                          required,
                          disabled,
                          edit,
                          componentConfig: ele1
                        });
                      } else {
                        let required = true;
                        let edit = true;
                        let disabled = false;
                        let fieldsId = ele1.__vModel__;
                        let label = ele1.__config__.label;
                        let type = ele1.__config__.tag;
                        let formId = ele1.__config__.formId;
                        if (doNotGenerateTags.includes(ele1.__config__.tag)) {
                          required = false;
                          edit = false;
                          fieldsId =
                            ele1.__vModel__ ? ele1.__vModel__ : "";
                          type =
                            ele1.__type__ == "opinion"
                              ? ele1.__type__
                              : ele1.__config__.tag;
                        }
                        this.pushFormFieldPermissions(
                          "setFormFieldWorkFlowDesign",
                          {
                            fieldsId,
                            label,
                            type,
                            formId,
                            required,
                            disabled,
                            edit,
                            componentConfig: ele1
                          }
                        );
                      }
                    });
                  }
                }
              }
            }
          } else if (ele.__config__.avueType == "autoCode") {
            // 编码 不显示
            let required = false;
            let edit = false;
            let disabled = true;
            let fieldsId = ele.__vModel__;
            let label = ele.__config__.label;
            let type = ele.__config__.tag;
            let formId = ele.__config__.formId;
            this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
              fieldsId,
              label,
              type,
              formId,
              required,
              disabled,
              edit,
              componentConfig: ele
            });
          }
          //doNotGenerateTags
          else if (doNotGenerateTags.includes(ele.__config__.tag)) {
            let required = false;
            let edit = false;
            let disabled = true;
            let fieldsId = ele.__vModel__ ? ele.__vModel__ : "";
            let label = ele.__config__.label;
            let type =
              ele.__type__ == "opinion" ? ele.__type__ : ele.__config__.tag;
            let formId = ele.__config__.formId;
            this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
              fieldsId,
              label,
              type,
              formId,
              required,
              disabled,
              edit,
              componentConfig: ele
            });
          }
          //普通
          else {
            let required = true;
            let edit = true;
            let fieldsId = ele.__vModel__;
            let label = ele.__config__.label;
            let type = ele.__config__.tag;
            let disabled = false;
            if (ele.__config__.tag == 'el-upload') {
              type = 'upload';
            }
            let formId = ele.__config__.formId;
            this.pushFormFieldPermissions("setFormFieldWorkFlowDesign", {
              fieldsId,
              label,
              type,
              formId,
              required,
              edit,
              disabled,
              componentConfig: ele
            });
          }
        });
      }
    },
    pushFormFieldPermissions(
      from = "",
      { fieldsId, label, type, formId, required, edit, disabled, children, componentConfig }
    ) {
      let value = "";
      let setRequired = true;
      let setEdit = true;
      if (from == "setFormFieldWorkFlowDesign") {
        setRequired = required;
        setEdit = edit;
      } else {
        value = this.formData[fieldsId];
        setRequired = true;
        setEdit = true;
        if (fieldsId) {
          this.permissionFieldsIds.push(fieldsId);
        }
      }
      this.systemFieldPermissions.push({
        bindTable: this.mainTableName ? this.mainTableName : '',
        fieldsId: fieldsId,
        fieldsName: label,
        filedsType: type,
        value: value,
        formId: formId,
        type: type,
        required: setRequired,
        view: true,
        edit: setEdit,
        disabled: disabled,
        show: false,
        children,
        componentConfig: componentConfig
      });
    },
    hasWorkFlowFormPermission(encode) {
      if (
        this.isWorkflowForm &&
        this.permissionFieldsIds.length > 0 &&
        this.permissionFieldsIds.includes(encode)
      ) {
        return true;
      } else {
        return false;
      }
    },
    hasLookFormPermission(encode) {
      if (
        this.isWorkflowForm &&
        this.permissionFieldsIds.length > 0
      ) {
        return this.permissionFieldsIds.includes(encode);
      } else {
        return true;
      }
    },
    hasFormPermission(encode) {
      if (this.needToJudgeAuthority) {
        if (this.isWorkflowForm) {
          if (this.permissionFieldsIds.includes(encode)) {
            return true;
          } else {
            return false;
          }
        } else {
          if (this.formEnCodeList && this.formEnCodeList[encode]) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },
    initFormFieldPermissions() {
      if (this.systemFieldPermissions && this.systemFieldPermissions.length > 0) {
        this.systemFieldPermissions.forEach(ele => {
          if (ele.children && ele.children.length > 0) {
            //修改子表单权限
            let childrenPermissons = [];
            let childrenNotRequiredPermissons = [];
            let childrenDisableddPermissons = [];
            ele.children.forEach(ele2 => {
              if (ele2.fieldsId && ele2.view) {
                childrenPermissons.push(ele2.fieldsId);
              }
              if (ele2.fieldsId && ele2.required == false) {
                childrenNotRequiredPermissons.push(ele2.fieldsId);
              }
              if (ele2.fieldsId && ele2.edit == false) {
                childrenDisableddPermissons.push(ele2.fieldsId);
              }
            });
            if (this.formEnCodeList == undefined) {
              this.formEnCodeList = {};
            }
            this.formEnCodeList[ele.fieldsId] = childrenPermissons;
            this.formSubTableNotRequiredList[ele.fieldsId] = childrenNotRequiredPermissons;
            this.formSubTableDisabledList[ele.fieldsId] = childrenDisableddPermissons;
          }
        });

        this.permissionFieldsIds = this.systemFieldPermissions
          .filter(ele => {
            return ele.view;
          })
          .map(ele => {
            return ele.fieldsId ? ele.fieldsId : ele.bindTable;
          });
        this.systemFieldPermissions.forEach(ele => {
          let id = ele.fieldsId ? ele.fieldsId : ele.bindTable;
          if (this.permissionFieldsIds.includes(id)) {
            this.permissionFieldsMap.set(id, ele);
          }
        });
        // 必填校验
        let permissionRequiredFieldsIds = this.systemFieldPermissions
          .filter(ele => {
            return ele.required;
          })
          .map(ele => {
            return ele.fieldsId ? ele.fieldsId : ele.bindTable;
          });
        let rules = this.rules;
        this.rules = {};
        if (permissionRequiredFieldsIds && permissionRequiredFieldsIds.length > 0) {
          permissionRequiredFieldsIds.forEach(ele => {
            if (rules[ele] && rules[ele].length > 0) {
              this.rules[ele] = rules[ele]
            } else {
              let value = this.permissionFieldsMap.has(ele) ? this.permissionFieldsMap.get(ele) : { fieldsName: '' };
              this.rules[ele] = [{
                required: true,
                message: '请填写' + (value.fieldsName ? value.fieldsName : ''),
                trigger: 'blur'
              }]
            }

          });
        }
      }
    },
    hasViewPermission(encode) {
      if (this.needToJudgeAuthority) {
        if (this.isWorkflowForm) {
          return this.permissionFieldsIds.includes(encode);
        } else {
          if (this.formEnCodeList && this.formEnCodeList[encode]) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },
    hasDisabledPermission(encode, disabled) {
      if (this.disabled) {
        return true;
      } else {
        if (this.needToJudgeAuthority) {
          if (this.isWorkflowForm) {
            if (this.lookSystemForm == "2") {
              return true;
            } else {
              return this.permissionFieldsMap.get(encode)
                ? !this.permissionFieldsMap.get(encode).edit
                : false;
            }
          } else {
            if (disabled == undefined) {
              return false;
            } else {
              return disabled;
            }
          }
        }
      }
    },
    hasEditPermission(encode, readonly) {
      if (this.needToJudgeAuthority) {
        if (this.isWorkflowForm) {
          return this.permissionFieldsMap.get(encode)
            ? this.permissionFieldsMap.get(encode).edit
            : true;
        } else {
          return readonly == undefined ? true : !readonly;
        }
      } else {
        return true;
      }
    },
    //当系统表单发起流程时，获取系统表单信息
    getRefData() {
      let hideComponents = [];
      if (typeof this.getHideComponents == 'function') {
        hideComponents = this.getHideComponents();
      }
      return {
        addressUrl: this.addressUrl,
        formFields: this.formFields,
        formData: this.formData,
        hideComponents
      };
    },
    //草稿箱需要的formdata
    getNewObj() {
      let returnParams = this.getFormData();
      let reuturnData = {};
      for (let [key, value] of Object.entries(returnParams)) {
        if (key.includes("EntityList")) {
          let tempKey = key.replace("EntityList", "");
          reuturnData[tempKey] = value;
        } else if (key.includes("Entity")) {
          let tempKey = key.replace("Entity", "");
          reuturnData[tempKey] = value;
        } else {
          reuturnData[key] = value;
        }
      }
      return reuturnData;
    },
    async workflowSubmit() {
      //父页面提交表单  returnData {code:0,params}// 0 提交失败 1不需要提交 2 提交数据
      let returnData = {
        code: 0,
        params: {},
        addressUrl: this.addressUrl,
        fileValue: [],
        draftList: {}
      };
      returnData.draftList = this.getNewObj();
      if (typeof this.aysncValidateForm == "function") {
        let valid = await this.aysncValidateForm();
        if (valid == false) {
          return returnData
        }
      } else {
        let formValid = false;
        //兼容旧版本的系统表单
        this.$refs["elForm"].validate(valid => {
          if (valid) formValid = true;
        });
        if (!formValid) {
          return returnData;
        }
      }
      let forms_data = {};
      if (typeof this.changeTableData == "function") {
        this.changeTableData();
        let newObj = this.getFormData();
        forms_data = deepClone(newObj);
      } else {
        //兼容旧版本的系统表单
        let newObj = this.getFormData();
        forms_data = deepClone(newObj);
        for (let [k, v] of Object.entries(forms_data)) {
          if (k.includes('EntityList') && Array.isArray(v)) {//子表
            forms_data[k] = v.map(element => {
              for (let [k2, v2] of Object.entries(element)) {
                if (Array.isArray(v2)) {
                  element[k2] = v2.join(',');
                }
              }
              return element;
            });
          } else {
            for (let [k3, v3] of Object.entries(forms_data[k])) {
              if (v3 && Array.isArray(v3)) {
                forms_data[k][k3] = v3.join(',');
              } else {
                forms_data[k][k3] = v3;
              }
            }
          }
        }
      }
      returnData.code = 2;
      returnData.params = forms_data;
      if (this.systemFieldPermissions.length > 0) {
        this.systemFieldPermissions.forEach((ele, index) => {
          if (ele.type == "el-upload") {
            if (ele.fieldsId && this.formData[ele.fieldsId]) {
              this.fileValue.push(this.formData[ele.fieldsId]);
            }
          }
        });
      }
      returnData.fileValue = this.fileValue;
      return returnData;
    },
    printDefaultForm() {
      this.printForm("customPrintForm", "打印");
    },
    printForm(refName, title) {
      let element = window.document.getElementById("customPrintForm");
      setTimeout(() => {
        html2canvas(element, {
          backgroundColor: null,
          useCORS: true,
          windowHeight: document.body.scrollHeight,
        }).then(canvas => {
          const url = canvas.toDataURL();
          this.printImg = url;
          printJS({
            printable: url,
            type: "image",
            documentTitle: title,
            scanStyles: false,
            repeatTableHeader: false,
            header: null
          });
        });
      }, 1);
    }
  }
};
