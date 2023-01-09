import i18n from "@/lang";
const ruleTreelist = [
  {
    id: 1,
    type: "nwfSchemeInfo",
    label: i18n.t('templateInfor'),
    children: [
      {
        id: "nwfSchemeId",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateNum'),
        value: "nwfSchemeId",
        markKey: '',
        drag: true
      },
      {
        id: "nwfSchemeName",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateName'),
        markKey: '',
        value: "nwfSchemeName",
        drag: true
      },
      {
        id: "nwfSchemeCategory",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateClassify'),
        markKey: '',
        value: "nwfSchemeCategory",
        drag: true
      },
      {
        id: "nwfSchemeDescription",
        type: "nwfSchemeInfo",
        label: i18n.t('templateNote'),
        value: "nwfSchemeDescription",
        markKey: '',
        drag: true
      },
      {
        id: "processInstanceId",
        type: "nwfSchemeInfo",
        value: "processInstanceId",
        label: i18n.t('processTaskID'),
        markKey: '',
        drag: true
      }
    ]
  },
  {
    id: 2,
    type: "startUserInfo",
    label: i18n.t('initiatorInfor'),
    children: [
      {
        id: "startUserName",
        type: "startUserInfo",
        label: i18n.t('initiatorName'),
        markKey: '',
        value: "startUserName",
        drag: true
      },
      {
        id: "initiatorSameDepartment",
        type: "startUserInfo",
        label: i18n.t('initiatorDepartment'),
        value: "initiatorSameDepartment",
        markKey: '',
        drag: true
      },
      {
        id: "initiatorSameCompany",
        type: "startUserInfo",
        label: i18n.t('sponsorCompany'),
        markKey: '',
        value: "initiatorSameCompany",
        drag: true
      }
    ]
  },
  {
    id: 3,
    type: "startDateInfo",
    label: i18n.t('processInitiationTime'),
    children: [
      {
        id: "yyyy-MM-dd HH:mm:ss",
        type: "startDateInfo",
        label: "yyyy-MM-dd HH:mm:ss",
        value: "yyyy-MM-dd HH:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "yyyy-MM-dd hh:mm:ss",
        type: "startDateInfo",
        label: "yyyy-MM-dd hh:mm:ss",
        value: "yyyy-MM-dd hh:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "yyyy-MM-dd",
        type: "startDateInfo",
        label: "yyyy-MM-dd",
        value: "yyyy-MM-dd",
        markKey: '',
        drag: true
      },
      {
        id: "HH:mm:ss",
        type: "startDateInfo",
        label: "HH:mm:ss",
        value: "HH:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "hh:mm:ss",
        type: "startDateInfo",
        label: "hh:mm:ss",
        value: "hh:mm:ss",
        markKey: '',
        drag: true
      }
    ]
  }
];
const ruleBtnList = [
  {
    id: "1",
    icon: "el-icon-minus",
    type: "operation",
    label: "-",
    drag: true
  },
  {
    id: "2",
    icon: "el-icon-plus",
    type: "operation",
    label: "+",
    drag: true
  },
  {
    id: "1",
    icon: "",
    type: "randomNum",
    label: i18n.t('twoRandomDigit'),
    drag: true
  },
  {
    id: "2",
    icon: "",
    type: "randomNum",
    label: i18n.t('fourRandomDigits'),
    drag: true
  },
  {
    id: "3",
    icon: "",
    type: "randomNum",
    label: i18n.t('sixRandomDigits'),
    drag: true
  },
  {
    id: "4",
    icon: "",
    type: "randomNum",
    label: i18n.t('workFlow.processTasks.serialNum'),
    drag: true
  }
];
const ruleListHasId = [
  {
    id: 1,
    type: "nwfSchemeInfo",
    label: i18n.t('templateInfor'),
    children: [
      {
        id: "nwfSchemeId",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateNum'),
        value: "nwfSchemeId",
        markKey: '',
        drag: true
      },
      {
        id: "nwfSchemeName",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateName'),
        markKey: '',
        value: "nwfSchemeName",
        drag: true
      },
      {
        id: "nwfSchemeCategory",
        type: "nwfSchemeInfo",
        label: i18n.t('workFlow.Process.templateClassify'),
        markKey: '',
        value: "nwfSchemeCategory",
        drag: true
      },
      {
        id: "nwfSchemeDescription",
        type: "nwfSchemeInfo",
        label: i18n.t('templateNote'),
        value: "nwfSchemeDescription",
        markKey: '',
        drag: true
      },
      {
        id: "processInstanceId",
        type: "nwfSchemeInfo",
        value: "processInstanceId",
        label: i18n.t('processTaskID'),
        markKey: '',
        drag: true
      }
    ]
  },
  {
    id: 2,
    type: "startUserInfo",
    label: i18n.t('initiatorInfor'),
    children: [
      {
        id: "startUserName",
        type: "startUserInfo",
        label: i18n.t('initiatorName'),
        markKey: '',
        value: "startUserName",
        drag: true
      },
      {
        id: "initiatorSameDepartment",
        type: "startUserInfo",
        label: i18n.t('initiatorDepartment'),
        value: "initiatorSameDepartment",
        markKey: '',
        drag: true
      },
      {
        id: "initiatorSameCompany",
        type: "startUserInfo",
        label: i18n.t('sponsorCompany'),
        markKey: '',
        value: "initiatorSameCompany",
        drag: true
      },
      {
        id: "startUserId",
        type: "startUserInfo",
        label:i18n.t('sponsorId'),
        markKey: '',
        value: "startUserId",
        drag: true
      }
    ]
  },
  {
    id: 3,
    type: "startDateInfo",
    label: i18n.t('processInitiationTime'),
    children: [
      {
        id: "yyyy-MM-dd HH:mm:ss",
        type: "startDateInfo",
        label: "yyyy-MM-dd HH:mm:ss",
        value: "yyyy-MM-dd HH:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "yyyy-MM-dd hh:mm:ss",
        type: "startDateInfo",
        label: "yyyy-MM-dd hh:mm:ss",
        value: "yyyy-MM-dd hh:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "yyyy-MM-dd",
        type: "startDateInfo",
        label: "yyyy-MM-dd",
        value: "yyyy-MM-dd",
        markKey: '',
        drag: true
      },
      {
        id: "HH:mm:ss",
        type: "startDateInfo",
        label: "HH:mm:ss",
        value: "HH:mm:ss",
        markKey: '',
        drag: true
      },
      {
        id: "hh:mm:ss",
        type: "startDateInfo",
        label: "hh:mm:ss",
        value: "hh:mm:ss",
        markKey: '',
        drag: true
      }
    ]
  }
];
const processTasksTree = ruleTreelist;
const processTasksBtnList = ruleBtnList;
const processRuleTip = {
  title: i18n.t('clickLeftVariableAddVariable'),
  content:
    i18n.t('variBleCarriedNumbers') + "<br />" + i18n.t('formatExample')
    + "<br />" + i18n.t('generatedNameIs')
};
const scriptSqlTasksTree = ruleTreelist;
const scriptSqlTasksHasId = ruleListHasId
const scriptSqlTasksBtnList = [];
const scriptSqlRuleTip = {
  title: i18n.t('clickVariableAddVariables'),
  content:
    i18n.t('clickCustomizeSqlEdit') + i18n.t('clickCustomizeSqlEditEg')
};
const scriptApiTasksTree = ruleTreelist;
const scriptApiTasksHasId = ruleListHasId
const scriptApiTasksBtnList = [];
const scriptApiRuleTip = {
  title: i18n.t('clickVariableAddVariables'),
  content:
    i18n.t('clickCustomizeConfigEdit') + "<br />" + i18n.t('clickCustomizeConfigEditEg')
};
export {
  ruleTreelist,
  ruleBtnList,
  processTasksTree,
  processTasksBtnList,
  processRuleTip,
  scriptSqlTasksTree,
  scriptSqlTasksHasId,
  scriptSqlTasksBtnList,
  scriptSqlRuleTip,
  scriptApiTasksTree,
  scriptApiTasksHasId,
  scriptApiTasksBtnList,
  scriptApiRuleTip
};
