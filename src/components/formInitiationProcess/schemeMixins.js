import {
  registerBpmnModule,
  setSpecialInitiationTableData
} from "@/views/WorkFlow/components/bpmn/common/util/modelId";

import { getSystemFormId } from "@/api/code/form";
import { getMenuInfo } from "@/api/systemManagement/menu.js";
export default {
  data() {
    return {
      hasCreateFlowBtn: false,
      isCreateFlow: false,
      createFlowType:0,//0 发起临时模板  1 发起审批
      scopeRow: {},
      scheme: { id: "", name: "", type: 0, url: "", F_UrlAddress: "",component:'' },
      designId:"",//流程模板id
      hasTableData: false, //是否已经拿取过表单配置
      scopeRowStatus:1,//0 没有关联任何流程模板  1 未发起 2 审批中 3 审批完成
    };
  },
  created() {
    registerBpmnModule();
  },
  methods: {
    /**发起流程 old*/
    createFlow(val,type) {
      this.createFlowType = type;
      this.scopeRow = val;
    },
     /* 发起审批 */
     CreateFormFlow(val){
      this.createFlowType = 1;
    },
     /* 发起临时流程  */
    CreateDesignFlow(val){
      this.createFlowType = 0;
    },
    closedCreateFlow() {
      this.scopeRow = {};
      this.isCreateFlow = false;
      this.getListData();
    },
    //自定义表单
    changeSchemeInfo(SchemeInfo, fields,hideComponents=[]) {
      if (this.hasTableData) {
        this.isCreateFlow = true;
        return;
      }
      this.hasTableData = true;
      if (SchemeInfo) {
        this.scheme.id = SchemeInfo.F_Id;
        this.scheme.type = SchemeInfo.F_Type;
        this.scheme.name = SchemeInfo.F_Name;
        this.scheme.url = "";
      }
      if (fields.length > 0) {
        let info = this.getCustomFiled(fields);
        info.hideComponents = hideComponents;
        let tableData = [info];
        this.setTableData(tableData);
        this.isCreateFlow = true;
      } else {
        this.$notify({
          title: "失败",
          message: "获取表单失败",
          type: "error"
        });
      }
    },
    // 系统表单
    async changeSystemSchemeInfo() {
      if (this.hasTableData) {
        this.isCreateFlow = true;
        return;
      }
      this.hasTableData = true;
      this.flag = true;
      this.isEdit = true;
      this.disabled = false;
      this.keyValue = this.scopeRow.F_Id;
      this.scheme.type = 2;
      this.scheme.name = this.$route.name ? this.$route.name : "系统表单";
      this.scheme.url = this.$route.path ? this.$route.path : "";
      const modulesId = this.$route.meta.moduleid;
      try {
        let info  = await getMenuInfo(modulesId);
        let res = await getSystemFormId(modulesId); //获取系统表单 formId
        if (res.data.success) {
          if(res.data.data&&res.data.data.length>0){
            this.scheme.id = res.data.data[0].F_Id?res.data.data[0].F_Id:'';
            this.scheme.component=info.data.data.component?info.data.data.component:'';
          }
        }
        if(!this.scheme.id){
          this.$notify({
            title: "失败",
            message: "获取系统表单Id异常",
            type: "error"
          });
        }
      } catch (error) {
        this.$notify({
          title: "失败",
          message: "获取系统表单Id异常",
          type: "error"
        });
      }
      this.$nextTick(() => {
        this.getSystemFiledChildren();
      });
    },
    //获取系统表单配置
    getSystemFiled(fields,hideComponents) {
      return {
        F_Id: this.scheme.id,
        F_Name: this.scheme.name,
        F_Type: this.scheme.type,
        F_Url: this.scheme.url,
        component:this.scheme.component,
        requiredAll: true,
        viewAll: true,
        editAll: true,
        type: "系统表单",
        children: this.getJson(fields),
        hideComponents,
        schemeInfo: {}
      };
    },
    getSystemFiledChildren() {
      let refData = this.$refs["xtForm"].getRefData();
      let hideComponents = refData.hideComponents?refData.hideComponents:[];
      this.scheme.F_UrlAddress = refData.addressUrl;
      let formFields = this.$refs["xtForm"].formConfig.fields;
      if (formFields&&formFields.length > 0) {
        let info = this.getSystemFiled(formFields,hideComponents);
        let tableData = [info];
        this.setTableData(tableData);
        this.flag = false;
        this.isCreateFlow = true;
      } else {
        this.flag = false;
        this.$notify({
          title: "失败",
          message: "获取系统表单失败",
          type: "error"
        });
      }
    },
    setTableData(tableData) {
      setSpecialInitiationTableData(tableData);
    },
    //获取自定义表单配置
    getCustomFiled(fields) {
      return {
        F_Id: this.scheme.id,
        F_Name: this.scheme.name,
        F_Type: this.scheme.type,
        requiredAll: true,
        viewAll: true,
        editAll: true,
        type: "自定义表单",
        children:this.getJson(fields)
      };
    },
    getJson(fields){
      let children = [];
      if (fields.length > 0) {
        fields.forEach(element => {
          if (element.__config__.componentName) {
            //tab 数据配置不一致，特殊处理
            if (element.__config__.componentName == "avue-tabs") {
              if (element.__config__ && element.__config__.childrenObj) {
                let obj = element.__config__.childrenObj;
                for (var i in obj) {
                  if (obj[i].length > 0) {
                    obj[i].forEach(ele1 => {
                      if (ele1.__config__ && ele1.__config__.componentName == "table") {
                        let subchildren = [];
                        ele1.__config__.children.forEach(ele2=>{
                          let childTemp = this.getChildrenData(ele2);
                          subchildren.push(childTemp);
                       });
                        children.push({
                          bindTable: ele1.__config__.bindTable,
                          fieldsId: ele1.__config__.bindTableField,
                          fieldsName: ele1.__config__.componentTitle,
                          filedsType: ele1.__type__ ? ele1.__type__ : "",
                          formId: ele1.__config__.formId,
                          type: 'table',
                          required: true,
                          view: true,
                          edit: true,
                          disabled: false,
                          show:false,
                          children:subchildren
                        });
                      }else{
                      let temp = this.getChildrenData(ele1);
                      if (temp) {
                        children.push(temp);
                      }
                      }

                    });
                  }
                }
              }
            }else if (element.__config__ && element.__config__.componentName == "table") {
              let subchildren = [];
              element.__config__.children.forEach(ele2=>{
                let childTemp = this.getChildrenData(ele2);
                subchildren.push(childTemp);
             });
              children.push({
                bindTable: element.__config__.bindTable,
                fieldsId: element.__config__.bindTableField,
                fieldsName: element.__config__.componentTitle,
                filedsType: element.__type__ ? element.__type__ : "",
                formId: element.__config__.formId,
                type: 'table',
                required: true,
                view: true,
                edit: true,
                disabled: false,
                show:false,
                children:subchildren
              });
            }
          } else {
            let temp = this.getChildrenData(element);
            if (temp) {
              children.push(temp);
            }
          }
        });
      }
      return children;
    },
    getChildrenData(element) {
      let temp = "";
      let required = true;
      let view = true;
      let edit = true;
      let disabled = false;
      let type = ""; //关联意见框组件使用
      if (element.__type__ && element.__type__ == "opinion") {
        //工作流相关意见簿 不显示
        type = element.__type__;
        required = false;
        view = true;
        edit = false;
        disabled = true;
      } else if (
        element.__config__ &&
        (element.__config__.tag == "h2" ||
          element.__config__.tag == "el-divider"||
          element.__config__.tag == "avue-information-body"||
          element.__config__.tag == "avue-custom-button")
      ) {
        //标题 分割线 不显示
        type = element.__config__.tag;
        required = false;
        view = true;
        edit = false;
        disabled = true;
      } else {
        disabled = false;
      }
      if (element.__config__ && element.__config__.componentName != "table") {
        temp = {
          bindTable: element.__config__.bindTable,
          fieldsId: element.__config__.bindTableField,
          fieldsName: element.__config__.label,
          filedsType: element.__type__ ? element.__type__ : "",
          formId: element.__config__.formId,
          type: type,
          required: required,
          view: view,
          edit: edit,
          disabled: disabled
        };
      }
      return temp;
    },
  }
};
