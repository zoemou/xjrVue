
      export const fieldsConfig =()=>{
          
      let config = {
        "fields": [{
          "__config__": {
            "label": "UserId",
            "labelWidth": null,
            "showLabel": true,
            "changeTag": true,
            "tag": "el-input",
            "tagIcon": "input",
            "avueType": "autoCode",
            "required": false,
            "layout": "colFormItem",
            "span": 24,
            "document": "https://element.eleme.cn/#/zh-CN/component/input",
            "F_LgMarkCode": "",
            "regList": [],
            "autoCodeRule": "xjrtest_UserId",
            "prestrainField": "",
            "formId": 100,
            "renderKey": "1001673749513094",
            "bindTable": "user_info",
            "bindTableField": "User_Id",
            "bindTableFieldType": "varchar"
          },
          "__slot__": {
            "prepend": "",
            "append": ""
          },
          "placeholder": "UserId",
          "style": {
            "width": "100%"
          },
          "clearable": false,
          "prefix-icon": "",
          "suffix-icon": "",
          "autoCode": true,
          "readonly": true,
          "__vModel__": "User_Id"
        }, {
          "__config__": {
            "label": "名称",
            "labelWidth": null,
            "showLabel": true,
            "changeTag": true,
            "tag": "el-input",
            "tagIcon": "input",
            "avueType": "input-tip",
            "required": true,
            "layout": "colFormItem",
            "span": 24,
            "document": "https://element.eleme.cn/#/zh-CN/component/input",
            "F_LgMarkCode": "",
            "regList": [],
            "triggerEvents": ["blur"],
            "triggerEventData": {
              "blur": []
            },
            "prestrainField": "",
            "formId": 101,
            "renderKey": "1011673749554323",
            "bindTable": "user_info",
            "bindTableField": "User_Name",
            "bindTableFieldType": "varchar"
          },
          "__slot__": {
            "prepend": "",
            "append": ""
          },
          "placeholder": "请输入名称",
          "style": {
            "width": "100%"
          },
          "clearable": true,
          "prefix-icon": "",
          "suffix-icon": "",
          "maxlength": null,
          "show-word-limit": false,
          "readonly": false,
          "disabled": false,
          "__vModel__": "User_Name"
        }, {
          "__config__": {
            "label": "部门",
            "labelWidth": null,
            "showLabel": true,
            "required": true,
            "tag": "avue-load-tree",
            "tagIcon": "department",
            "avueType": "load-tree",
            "method": "get",
            "url": "http://localhost:2828/companies/departments/tree",
            "dataKey": "data",
            "layout": "colFormItem",
            "span": 24,
            "require": false,
            "bindTableField": "DeptId",
            "document": "https://avuejs.com/doc/component/input-tree",
            "F_LgMarkCode": "",
            "triggerEvents": ["change"],
            "triggerEventData": {
              "change": []
            },
            "prestrainField": "",
            "formId": 102,
            "renderKey": "1021673749587746",
            "bindTable": "user_info",
            "bindTableFieldType": "varchar"
          },
          "__type__": "department",
          "__formateData__": {
            "fieldId": "F_DepartmentId",
            "fieldName": "F_FullName"
          },
          "style": {
            "width": "100%"
          },
          "__organize__": true,
          "__organizeOptions__": [{
            "label": "系统默认(部门)",
            "value": "department"
          }],
          "dic": [],
          "type": "tree",
          "lazy": true,
          "placeholder": "系统默认(公司)部门",
          "disabled": false,
          "__vModel__": "DeptId"
        }, {
          "__config__": {
            "label": "薪资",
            "labelWidth": null,
            "showLabel": true,
            "changeTag": true,
            "tag": "el-input",
            "tagIcon": "input",
            "avueType": "input",
            "isFinance": true,
            "defaultValue": 0,
            "required": true,
            "layout": "colFormItem",
            "span": 24,
            "document": "https://element.eleme.cn/#/zh-CN/component/input",
            "F_LgMarkCode": "",
            "regList": [],
            "triggerEvents": ["blur"],
            "triggerEventData": {
              "blur": []
            },
            "prestrainField": "",
            "formId": 105,
            "renderKey": "1051673749612599",
            "bindTable": "user_info",
            "bindTableField": "Salary",
            "bindTableFieldType": "double"
          },
          "__slot__": {
            "prepend": "¥",
            "append": ""
          },
          "type": "number",
          "computationalConfiguration": [],
          "computationalConfigurationValue": "",
          "relativeComObject": null,
          "placeholder": "请输入薪资",
          "style": {
            "width": "100%"
          },
          "clearable": true,
          "prefix-icon": "",
          "suffix-icon": "",
          "maxlength": null,
          "show-word-limit": false,
          "readonly": false,
          "disabled": false,
          "__vModel__": "Salary"
        }]
      };
      return config;
      
        }
        export const formFieldsMap = ()=>{
           
      let config = [
        [100, {
          "__vModel__": "User_Id",
          "__config__": {
            "avueType": "autoCode",
            "autoHandlerConfig": null
          }
        }],
        [101, {
          "__vModel__": "User_Name",
          "__config__": {
            "avueType": "input-tip",
            "triggerEvents": ["blur"],
            "triggerEventData": {
              "blur": []
            },
            "autoHandlerConfig": null
          }
        }],
        [102, {
          "__vModel__": "DeptId",
          "__config__": {
            "avueType": "load-tree",
            "triggerEvents": ["change"],
            "triggerEventData": {
              "change": []
            },
            "autoHandlerConfig": null
          }
        }],
        [105, {
          "__vModel__": "Salary",
          "__config__": {
            "avueType": "input",
            "triggerEvents": ["blur"],
            "triggerEventData": {
              "blur": []
            },
            "autoHandlerConfig": null
          }
        }]
      ];
      return new Map(config);
      
        }
        export const getHideComponents = ()=>{
           
      let config = [];
      return config;
      
        }
      