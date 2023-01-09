import i18n from "@/lang";
import store from "@/store";
import { getRandomNumber } from "./util";
import { deepClone } from "@/util/util";
const ProcessProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  name: "",
  F_Id: "",
  F_SchemeId: "",
  F_Type: "",
  F_Code: "",
  F_Name: "",
  F_Category: "",
  F_RuleData: "",
  ruleName: [],
  F_Agree: "",
  F_Handle: "1",
  F_Mark: 1,
  F_Description: "",
  F_IsInApp: 2,
  F_Assign: false,
  schemeAuthList: [{ F_Id: getRandomNumber(), F_ObjType: "4" }],
  menu: {
    //菜单设置
    isOpen: 0,
    F_EnCode: "",
    F_FullName: "",
    F_SubSystemId: '0',
    F_ParentId: "",
    F_SortCode: "",
    F_Icon: "",
    F_Des: "",
    F_LgMarkCode: ""
  },
  formInitiationProcess: {
    // 表单发起流程
    isOpen: 0,
    type: -1, //表单类型 自定义表单 0  系统表单 2
    schemeId: "",//表单id
    schemeName: 'workFlow.formInitiationProcessDialog.selectForm',//表单名称
    schemeUrl: ""
  },
  timeoutToRemind: {
    isOpen: 0,
    timeOut: 0,
    messageInterval: 0,
    messageTemplate: "",
    pushTimes: 0,
    messagePusherList: []
  },
  relevanceTask: {
    tableData: []
  },
  isInheritStartNode: false,
  parameters: [],
  nodeNum: [
    { type: 'bpmn:StartEvent', num: 0 },
    { type: 'bpmn:EndEvent', num: 0 },
    { type: 'bpmn:UserTask', num: 0 },
    { type: 'bpmn:ScriptTask', num: 0 },
    { type: 'bpmn:ExclusiveGateway', num: 0 },
    { type: 'bpmn:InclusiveGateway', num: 0 },
    { type: 'bpmn:ParallelGateway', num: 0 },
    { type: 'bpmn:SubProcess', num: 0 },
    { type: 'bpmn:CallActivity', num: 0 },
    { type: "bpmn:SequenceFlow", num: 0 }
  ]
};

const StartProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  overrideid: "",
  name: "开始事件",
  documentation: "",
  executionlisteners: "",
  initiator: "",
  subProcessInitiator: "",
  tableData: [],
  formproperties: "",
  formkeydefinition: "",
  messageTypes: [],
  paramOperate: {
    formAssignment: [],//参数操作 表单赋值
    parameterAssignment: [],//参数操作 参数赋值
  },
};
const EndProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  overrideid: "",
  name: "结束事件",
  documentation: "",
  executionlisteners: "",
  messageTypes: []
};
const SequenceFlowProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  overrideid: "",
  name: "流程线",
  documentation: "",
  conditionsequenceflow: "",
  executionlisteners: "",
  defaultflow: "false",
  messageTypes: []
};
const UserTaskProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  overrideid: "",
  name: "用户任务",
  documentation: "",
  tableData: [],
  asynchronousdefinition: "false",
  exclusivedefinition: "false",
  executionlisteners: "",
  multiinstance_type: "None",
  multiinstance_cardinality: "",
  multiinstance_collection: "",
  multiinstance_variable: "",
  multiinstance_condition: "all",
  isforcompensation: "false",
  usertaskassignment: {
    assignment: {
      assignee: "",
      FKtableEM: []
    }
  },
  formkeydefinition: "",
  duedatedefinition: "",
  prioritydefinition: "",
  formproperties: "",
  tasklisteners: "",
  fkbuttonpopu: [
    {
      key: i18n.t('workFlow.WFDesign.agree'),
      val: "agree_",
      check: true,
      disabled: true,
      act: 0
    },
    {
      key: i18n.t('workFlow.WFDesign.disagree'),
      val: "disagree_",
      check: true,
      disabled: true,
      act: 0
    },
    {
      key: i18n.t('workFlow.WFDesign.reject'),
      val: "reject_",
      check: false,
      disabled: false,
      act: 1
    },
    {
      key: i18n.t('workFlow.WFDesign.finish'),
      val: "finish_",
      check: false,
      disabled: false,
      act: 0
    }
  ],
  functionButton: [{
    key: 'workFlow.WFDesign.printing',
    val: "printing_",
    check: true,
    disabled: false,
    act: 4
  },
  {
    key: 'workFlow.WFDesign.transfer',
    val: "transfer_",
    check: true,
    disabled: false,
    act: 4
  },],
  fkforwarderpackage: {
    assignment: {
      FKtableEM: []
    }
  },
  fkrelationregion: {
    relationformem: 2,
    showapproval: 1,
    needpassword: 1,
    approvalcomponents: []
  },
  fkformpopup: "",
  fksignature: "0",
  messageTypes: [],
  isFirstClick: true,
  paramOperate: {
    formAssignment: [],//参数操作 表单赋值
    parameterAssignment: [],//参数操作 参数赋值
  },
};
const ScriptTaskProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  overrideid: "",
  record: true,
  name: "脚本任务",
  taskscript: {
    isActvate: false,
    scriptformat: "",
    scripttext: ""
  },
  taskapi: {
    isActvate: false,
    iframeData: []
  },
  tasksql: {
    isActvate: false,
    iframeData: {
      F_ObjId: "",
      html: "",
      sql: "",
      text: '',
      templateData: []
    }
  },
  paramOperate: {
    parameterAssignment: [],//参数操作 参数赋值
  },
  messageTypes: []
};
const ExclusiveGatewayProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  name: "互斥网关",
  documentation: "",
  messageTypes: []
};
const InclusiveGatewayProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  name: "相容网关",
  documentation: "",
  messageTypes: []
};
const ParallelGatewayProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  name: "并行网关",
  documentation: "",
  messageTypes: []
};
const SubProcessProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: false,
  name: "子流程",
  documentation: "",
  messageTypes: []
};
const CallActivityProperties = {
  id: "",
  type: "",
  processId: "",
  isFromMainProcess: true,
  name: "外部流程",
  documentation: "",
  subProcessInitiator: "",
  callType: true,
  optionType: '',
  multiinstance_type: "Sequential",
  multiinstance_condition: "",
  initiatorConfiguration: [],
  exclusivedefinition: "false",
  executionlisteners: "",
  callactivitycalledelement: {},
  callactivityinparameters: {
    inParameters: []
  },
  callactivityoutparameters: {
    outParameters: []
  },
  messageTypes: []
};
const TYPE_DEFAULT_MAP = new Map([
  ["bpmn:StartEvent", StartProperties],
  ["bpmn:EndEvent", EndProperties],
  ["bpmn:SequenceFlow", SequenceFlowProperties],
  ["bpmn:UserTask", UserTaskProperties],
  ["bpmn:ScriptTask", ScriptTaskProperties],
  ["bpmn:ExclusiveGateway", ExclusiveGatewayProperties],
  ["bpmn:InclusiveGateway", InclusiveGatewayProperties],
  ["bpmn:ParallelGateway", ParallelGatewayProperties],
  ["bpmn:SubProcess", SubProcessProperties],
  ["bpmn:CallActivity", CallActivityProperties],
  ["bpmn:Process", ProcessProperties]
]);
export const setInfoProperties = infoMap => {
  store.commit("SET_INFO_MAP", infoMap);
};

//新建元素后添加默认属性
export const initProperties = (id, type) => {
  let process = getProcessProperties()
  let idx = 0;
  let index = process.nodeNum.findIndex(o => { return o.type == type });
  if (index >= 0) {
    process.nodeNum[index].num += 1;
    idx = process.nodeNum[index].num;
  } else {
    idx = 1
  }
  store.commit("CHANGE_PROCESS_NODENUM", process.nodeNum);
  if (!hasProperties(id)) {
    let formInfo = {
      ...getDefaultPropertiesFromType(type),
      id: id,
      type: type,
      index: idx
    };
    formInfo.name += idx;
    setProperties(id, formInfo);
    return formInfo;
  } else {
    return;
  }
};
export const getInfoPropertiesMap = () => {
  return store.state.bpmn.info;
};
// 移除元素 去除缓存中数据
export const removeProperties = id => {
  store.commit("DELETE_INFO_ITEM", {
    key: id
  });
};
// 是否有元素缓存数据
export const hasProperties = id => {
  let info = getInfoPropertiesMap();
  return info.has(id);
};
// 获取元素
export const getProperties = id => {
  let info = getInfoPropertiesMap();
  if (info.has(id)) {
    return info.get(id);
  } else {
    return {};
  }
};
export const setProperties = (key, value) => {
  store.commit("CHANGE_INFO_ITEM", {
    key,
    value
  });
};
// 设置流程属性
export const initProcessProperties = id => {
  let formInfo = {
    ...getDefaultPropertiesFromType("bpmn:Process"),
    id: id,
    type: "bpmn:Process"
  };
  setProcessProperties(formInfo);
  return formInfo;
};
export const setProcessProperties = value => {
  store.commit("CHANGE_PROCESS_PROPERTIES", value);
};
export const getProcessProperties = () => {
  return store.state.bpmn.processProperties;
};
export const getProcessPropertiesParameters = () => {
  let processProperties = getProcessProperties();
  // 流程参数 必须有id以及名称才可以在公共参数和流程参数中使用
  let reuturnData = processProperties.parameters.filter(ele => {
    return ele.id && ele.name
  });
  return reuturnData;
};
export const getCommonParametersData = () => {
  let processProperties = getProcessPropertiesParameters();
  return [{
    id: '1',
    name: i18n.t('publicParameters'),
    children: processProperties
  }];
};
export const getProcessParametersData = () => {
  let processProperties = getProcessPropertiesParameters();
  let children = [];
  if (
    processProperties &&
    processProperties.length > 0
  ) {
    processProperties.forEach(ele => {
      children.push({ ...ele, value: ele.id, label: ele.name, type: "parameter", drag: true });
    });
  }
  return [{
    id: '1',
    value: '1',
    name: "流程参数",
    label: i18n.t('procPara'),
    type: "parameter",
    disabled: true,
    children
  }];
};
export const getScriptApiParameters = () => {
  let processProperties = getProcessPropertiesParameters();
  let children = [];
  if (
    processProperties &&
    processProperties.length > 0
  ) {
    processProperties.forEach(ele => {
      children.push({ value: ele.id, label: ele.name });
    });
  }
  return children;
};
export const initChildShapesProperties = flowElementsArr => {
  let childShapes = [];
  if (flowElementsArr && flowElementsArr.length > 0) {
    flowElementsArr.forEach(element => {
      initProperties(element.id, element.$type);
      if (element.flowElements && element.flowElements.length > 0) {
        element.flowElements.forEach(ele2 => {
          initProperties(ele2.id, ele2.$type);
        });
      }
    });
  }
  return childShapes;
};
export const initImportProcessProperties = ({ id, name }) => {
  let formInfo = {
    ...getDefaultPropertiesFromType("bpmn:Process"),
    id: id,
    name: name,
    type: "bpmn:Process"
  };
  setProcessProperties(formInfo);
  return formInfo;
};
export const initImportProperties = (id, type, name = "") => {
  if (!hasProperties(id)) {
    let formInfo = {
      ...getDefaultPropertiesFromType(type),
      name: name,
      id: id,
      type: type
    };
    setProperties(id, formInfo);
    return formInfo;
  } else {
    return;
  }
};
export const initImportChildShapesProperties = flowElementsArr => {
  let childShapes = [];
  if (flowElementsArr && flowElementsArr.length > 0) {
    flowElementsArr.forEach(element => {
      initImportProperties(element.id, element.$type, element.name);
      if (element.flowElements && element.flowElements.length > 0) {
        element.flowElements.forEach(ele2 => {
          initImportProperties(ele2.id, ele2.$type, element.name);
        });
      }
    });
  }
  return childShapes;
};
export const getDefaultPropertiesFromType = type => {
  return TYPE_DEFAULT_MAP.has(type)
    ? deepClone(TYPE_DEFAULT_MAP.get(type))
    : {};
};
export const getDefaultProperties = (id, type) => {
  let properties = {
    id: id
  };
  let TypeProperties = getDefaultPropertiesFromType(type);
  return {
    ...TypeProperties,
    ...properties
  };
};
const getType = type => {
  let changeType = "";
  switch (type) {
    case "bpmn:StartEvent":
      changeType = "StartNoneEvent";
      break;
    case "bpmn:EndEvent":
      changeType = "EndNoneEvent";
      break;
    case "bpmn:SequenceFlow":
      changeType = "SequenceFlow";
      break;
    case "bpmn:UserTask":
      changeType = "UserTask";
      break;
    case "bpmn:ScriptTask":
      changeType = "ScriptTask";
      break;
    case "bpmn:ExclusiveGateway":
      changeType = "ExclusiveGateway";
      break;
    case "bpmn:InclusiveGateway":
      changeType = "InclusiveGateway";
      break;
    case "bpmn:ParallelGateway":
      changeType = "ParallelGateway";
      break;
    case "bpmn:SubProcess":
      changeType = "SubProcess";
      break;
    case "bpmn:CallActivity":
      changeType = "CallActivity";
      break;
    default:
      break;
  }
  return changeType;
};
const getChildernJson = (element, properties) => {
  let type = getType(element.$type);
  let tempJson = {
    resourceId: "",
    properties: {
      overrideid: "",
      name: ""
    },
    stencil: { id: "" },
    childShapes: [],
    outgoing: [],
    bounds: {
      lowerRight: { x: 315, y: 135 },
      upperLeft: { x: 285, y: 105 }
    },
    dockers: []
  };
  tempJson.resourceId = element.id;
  tempJson = {
    resourceId: element.id,
    properties: properties ? properties : tempJson.properties,
    stencil: { id: type },
    childShapes: [],
    outgoing: [],
    bounds: {
      lowerRight: { x: 315, y: 135 },
      upperLeft: { x: 285, y: 105 }
    },
    dockers: []
  };
  if (element.di.bounds) {
    tempJson.bounds.lowerRight = {
      x: element.di.bounds.width + element.di.bounds.x,
      y: element.di.bounds.height + element.di.bounds.y
    };
    tempJson.bounds.upperLeft = {
      x: element.di.bounds.x,
      y: element.di.bounds.y
    };
  }
  if (element.outgoing) {
    tempJson.outgoing = [];
    element.outgoing.forEach(el => {
      tempJson.outgoing.push({ resourceId: el.id });
    });
  }
  if (type == "SequenceFlow") {
    element.di.waypoint.forEach(el => {
      tempJson.dockers.push({ x: el.x, y: el.y });
    });
    tempJson.target = { resourceId: element.targetRef.id };
  }
  if (element.flowElements) {
    tempJson.childShapes = getChildShapes(element.flowElements);
  }
  return tempJson;
};
const getInfoProperties = () => {
  const info = store.state.bpmn.info;
  return info;
};
export const getChildShapes = flowElementsArr => {
  let childShapes = [];
  let info = getInfoProperties()

  if (flowElementsArr && flowElementsArr.length > 0) {
    flowElementsArr.forEach(element => {
      childShapes.push(getChildernJson(element, info.get(element.id)));
    });
  }
  return childShapes;
};
export function randomStr() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
export function parseCDATA(str) {
  if (str) {
    const tmp = str.replace(/<!\[CDATA\[(.+)\]\]>/, "$1");
    const value = tmp.replace(/&lt;!\[CDATA\[(.+)\]\]&gt;/, "$1");
    return value;
  }
  return "";
}
