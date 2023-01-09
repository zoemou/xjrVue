import store from "@/store";
import bpmn from "./../store/bpmn";
// 动态注册模块
export const registerBpmnModule = () => {
  store.registerModule("bpmn", {
    ...bpmn
  });
};
// 动态注销模块
export const unRegisterBpmnModule = () => {
  let hasModule = store.hasModule("bpmn");
  if (hasModule) {
    store.unregisterModule("bpmn");
  }
};
// 获取模块id
export const getModelId = () => {
  return store.state.bpmn.modelId;
};
// 设置模块id
export const setModelId = id => {
  store.commit("CHANGE_MODELID", id);
};
export const setProcessCategory = () => {
  store.dispatch("updatewWorkFlowCategory");
};
export const resetBpmnModuleAll = () => {
  store.commit("RESET", {});
};
// 设置特殊流程
export const setSpecialInitiationProcess = bool => {
  store.commit("CHANGE_IS_SPECIAL_INITIATION_PROCESS", bool);
};
// 设置特殊流程 固定表单设置 tabledata
export const setSpecialInitiationTableData = val => {
  store.commit("CHANGE_SPECIAL_INITIATION_PROCESS_TABLE_DATA", val);
};