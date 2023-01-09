import { getInfoPropertiesMap,getProperties } from "./properties";
import { NodeName } from "./../../lang/zh";
const getFormSourceChildren = (resourceId, resourceName, tableData,needHideComponents=false) => {
  let children = [];
  tableData.forEach(ele1 => {
    let formName = ele1.F_Name;
    let formId = ele1.F_Id;
    let subJson = {
      id: ele1.F_Id,
      label: formName,
      type: "form",
      children: []
    };
    if (ele1.children?.length > 0) {
      ele1.children.forEach(ele2 => {
        if (ele2.fieldsId) {
          subJson.children.push({
            id: ele2.fieldsId,
            label: ele2.fieldsName,
            bindTable: ele2.bindTable,
            resourceId,
            resourceName,
            formName,
            formId,
            type: "condition",
            drag: true,
            markKey:'',
            variableValueList: []
          });
        }
      });
    }
    if(needHideComponents){
       // 隐藏组件
        let hideComponentsJsonChildren = [];
        if(ele1.hideComponents){
          if (ele1.hideComponents.length > 0) {
            ele1.hideComponents.forEach(ele2 => {
              let markId = resourceId + ele1.F_Id + ele2.id;
              hideComponentsJsonChildren.push({
                  drag: true,
                  markKey: resourceName+"-"+formName+"-" +'隐藏组件-'+ele2.name,
                  value:markId,
                  id: markId,
                  label: ele2.name,
                  bindTable:"",
                  F_ObjId: ele2.id,
                  F_ObjName:
                    resourceName + "•" + formName + "•" + ele2.name,
                  fieldId: ele2.id,
                  fieldName: ele2.name,
                  resourceId,
                  resourceName,
                  formName,
                  formId,
                  hideComponentsType:ele2.type,
                  hideComponentsvalue:ele2.value,
                  sqlConfig:ele2.sqlConfig,
                  apiConfig:ele2.apiConfig,
                  type: "hideComponents"
                });
            });
          }
        }
        if(hideComponentsJsonChildren.length>0){
          let hideComponentsJson = {
            id: resourceId + formId + 'hideComponents',
            label: '隐藏组件',
            type: "form",
            children: hideComponentsJsonChildren
          };
          subJson.children.push(hideComponentsJson);
        }
      }
    children.push(subJson);
  });
  return children;
};
const getButtonSourceChildren = (
  resourceId,
  resourceName,
  variableValueList
) => {
  let children = [];
  children.push({
    id: resourceId,
    label: "按钮组",
    type: "button",
    resourceId,
    resourceName,
    variableValueList: variableValueList
  });
  return children;
};
const getButtonListChildren = (
  resourceId,
  resourceName,
  variableValueList
) => {
  let children = [];
  children.push({
    id: resourceId,
    label: "按钮组",
    type: "button",
    resourceId,
    resourceName,
    children: variableValueList
  });
  return children;
};
export const getInfoVariableList = ({info,needButton,needButtonList,needHideComponents}={info:{},needButton:false,needButtonList:false,needHideComponents:false})=>{
  let returnList = [];
  for (let element of info.values()) {
    let type = element.type;
    let label = NodeName[element.type];
    let name = element.name ? "-" + element.name : "";
    let resourceName = "";
    if(element.isFromMainProcess){
      resourceName = label + name;
    }else{
      let subProccessName = getProperties(element.processId).name;
      resourceName = '子流程'+(subProccessName?'-'+subProccessName:'')+'-'+label + name;
    }
    if (type == "bpmn:StartEvent") {
      let id = element.id;
      let tableData = element.tableData;
      let tempJson = {
        id: id,
        label: resourceName,
        type: "resource",
        children: [],
        variableValueList: []
      };
      tempJson.children = getFormSourceChildren(id, resourceName, tableData,needHideComponents);
      returnList.push(tempJson);
    }
    // if (type == "bpmn:CallActivity") {
    //   let id = element.id;
    //   let variableValueList = [];
    //   let tempJson = {
    //     id: id,
    //     label: resourceName,
    //     type: "resource",
    //     children: [],
    //     variableValueList
    //   };
    //   returnList.push(tempJson);
    // }
    else if (type == "bpmn:UserTask") {
      let id = element.id;
      let variableValueList = [];
      element.fkbuttonpopu.forEach(ele => {
        if (ele.check) {
          if(needButtonList){
            variableValueList.push({
              resourceId:id,
              resourceName:resourceName+'-'+ele.key,
              value: ele.val,
              label: ele.key,
              drag:true
            });
          }else{
            variableValueList.push({
              resourceId:id,
              resourceName:resourceName+'-'+ele.key,
              value: ele.val,
              label: ele.key
            });
          }
          
        }
      });
      let tempJson = {
        id: id,
        label: resourceName,
        type: "resource",
        children: [],
        variableValueList
      };
      let children1 = [];
      if (needButton) {
        if(needButtonList){
          children1 = getButtonListChildren(
            id,
            resourceName,
            variableValueList
          );
        }else{
          children1 = getButtonSourceChildren(
            id,
            resourceName,
            variableValueList
          );
        }
        
      }
      let tableData = element.tableData;
      let children2 = getFormSourceChildren(id, resourceName, tableData,needHideComponents);
      tempJson.children = [...children1, ...children2];
      returnList.push(tempJson);
    }
  }
  return returnList;
}
/*
needButton  是否需要按钮组
needButtonList 是否需要按钮组 下面的按钮值列表
needHideComponents 是否需要隐藏组件
*/
export const changeVariableSourceList = ({needButton,needButtonList,needHideComponents}={needButton:false,needButtonList:false,needHideComponents:false}) => {
  let info = getInfoPropertiesMap();
  return getInfoVariableList({info,needButton,needButtonList,needHideComponents});
  
};
export const getSubProcessInitiator = () => {
  let returnList = [];
  let info = getInfoPropertiesMap();
  for (let element of info.values()) {
    let type = element.type;
    let label = NodeName[element.type];
    let name = element.name ? "-" + element.name : "";
    let resourceName = label + name;
    if(element.isFromMainProcess&&(type=='bpmn:StartEvent'||type=='bpmn:UserTask')){
      returnList.push({
        resourceId:element.id,
        resourceName,
        resourceType:type
      });
    }
    
  }
  return returnList;
};