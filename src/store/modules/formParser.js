const formParser = {
  state: {
    workflowFormTabIndexKey:0,
    formValueInfo:{},
    needChangeOptionFormId:[],
    submitFormEvents:{},
    isExecutedFormEvent:{},
    hideComponentList:new Map(),
  },
  mutations: {
    CHANGE_WORKFLOW_FORM_TAB_INDEX_KEY: (state, value) => {
      state.workflowFormTabIndexKey = value;
    },
    CHANGE_FORM_VALUE_ITEM: (state, { key, value }) => {
      state.formValueInfo[key] = value;
    },
    SET_FORM_VALUE_ITEM: (state, value) => {
      state.formValueInfo = value;
    },
    SET_HIDE_COMPONENT_LIST: (state, value) => {
      // map类型
      state.hideComponentList = value;
    },
    SET_NEED_CHANGE_OPTION_FORMID: (state, value) => {
      state.needChangeOptionFormId = value;
    },
    CHANGE_SUBMIT_FORM_EVENTS: (state, { key, value }) => {
      state.submitFormEvents[key] = value;
    },
    CHANGE_IS_EXECUTED_FORM_EVENT: (state, { key, value }) => {
      state.isExecutedFormEvent[key] = value;
    },
    RESET_FORM_PARSER: state => {
      state.formValueInfo = {};
      state.needChangeOptionFormId = [];
      state.workflowFormTabIndexKey = 0;
      state.submitFormEvents = {};
      state.isExecutedFormEvent = {};
      state.hideComponentList = new Map();
    }
  },
  actions: {
   
  }
};
export default formParser;
