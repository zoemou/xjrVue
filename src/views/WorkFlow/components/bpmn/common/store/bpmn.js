import { objToStrMap } from "./../util/util";
const bpmn = {
  state: {
    modelId: "",
    info: new Map(),
    formConfiguration: new Map(),
    firstFormConfigurationKey: "",
    processProperties: {},
    isSpecialInitiationProcess: false,
    specialInitiationProcessTableData: [],
    processStartId: "",
    subProcessStartIds: new Map()
  },
  mutations: {
    CHANGE_MODELID: (state, value) => {
      state.modelId = value;
    },
    CHANGE_PROCESS_START_ID: (state, value) => {
      state.processStartId = value;
    },
    CHANGE_SUB_PROCESS_START_IDS: (state, { key, value }) => {
      if (
        state.subProcessStartIds.size > 0 &&
        state.subProcessStartIds.has(key)
      ) {
        state.subProcessStartIds[key] = value;
      } else {
        state.subProcessStartIds.set(key, value);
      }
    },
    CHANGE_IS_SPECIAL_INITIATION_PROCESS: (state, value) => {
      state.isSpecialInitiationProcess = value;
    },
    CHANGE_SPECIAL_INITIATION_PROCESS_TABLE_DATA: (state, value) => {
      state.specialInitiationProcessTableData = value;
    },
    CHANGE_PROCESS_PROPERTIES: (state, value) => {
      state.processProperties = value;
    },
    SET_INFO_MAP: (state, value) => {
      state.info = objToStrMap(value);
    },
    CHANGE_INFO_ITEM: (state, { key, value }) => {
      if (state.info.size > 0 && state.info.has(key)) {
        state.info[key] = value;
      } else {
        state.info.set(key, value);
      }
    },
    SET_FIRST_FORM_CONFIGURATION_KEY: (state, key) => {
      if (state.firstFormConfigurationKey == "") {
        state.firstFormConfigurationKey = key;
      }
    },
    SET_FORM_CONFIGURATION_ITEM: (state, { key, value }) => {
      state.formConfiguration.set(key, value);
    },
    DELETE_INFO_ITEM: (state, { key }) => {
      if (state.info.has(key)) {
        state.info.delete(key);
      } else {
        return;
      }
    },
    RESET: state => {
      state.modelId = "";
      state.processProperties = {};
      state.info = new Map();
      state.firstFormConfigurationKey = "";
    },
    CHANGE_PROCESS_NODENUM: (state, value) => {
      state.processProperties.nodeNum = value;
    }
  }
};
export default bpmn;
