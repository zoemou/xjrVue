import i18n from "@/lang";
// 代码生成器 

//代码优先 自定义开发模板
const CodeBuildController0 = {
  clickName: "JumpLink",
  key: 0,
  title: i18n.t("dataFirst"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("TableStructurete"),
      componentName: "TableStructurete"
    },
    {
      title: i18n.t("FormPage"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
    {
      title: i18n.t("interfacedesign"),
      componentName: "InterfaceDesign"
    },
    {
      title: i18n.t("OutputConfiguration"),
      componentName: "OutputConfiguration"
    },
    {
      title: i18n.t("CodePreview"),
      componentName: "CodePreview"
    },
    {
      title: i18n.t("BindMenu"),
      componentName: "BindMenu"
    }
  ]
};

//数据优先 自定义表结构模板
const CodeBuildController1 = {
  clickName: "customListStructure",
  key: 1,
  title: i18n.t("codeFirst"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("FormPage"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
    {
      title: i18n.t("DatasheetSet"),
      componentName: "DatasheetSet"
    },
    {
      title: i18n.t("interfacedesign"),
      componentName: "InterfaceDesign"
    },
    {
      title: i18n.t("OutputConfiguration"),
      componentName: "OutputConfiguration"
    },
    {
      title: i18n.t("CodePreview"),
      componentName: "CodePreview"
    },
    {
      title: i18n.t("BindMenu"),
      componentName: "BindMenu"
    }
  ]
};
// 简易模板
const CodeBuildController2 = {
  clickName: "quick",
  key: 2,
  title: i18n.t("simpleTemplate"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("FormPage"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
    {
      title: i18n.t("interfacedesign"),
      componentName: "InterfaceDesign"
    },
    {
      title: i18n.t("OutputConfiguration"),
      componentName: "OutputConfiguration"
    },
    {
      title: i18n.t("CodePreview"),
      componentName: "CodePreview"
    },
    {
      title: i18n.t("BindMenu"),
      componentName: "BindMenu"
    }
  ]
};
// 表单设计 生成代码
const FormDesignCodeBuildController0 = {
  clickName: "JumpLink",
  key: 0,
  title: i18n.t("codeFirst"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("interfacedesign"),
      componentName: "InterfaceDesign"
    },
    {
      title: i18n.t("OutputConfiguration"),
      componentName: "OutputConfiguration"
    },
    {
      title: i18n.t("CodePreview"),
      componentName: "CodePreview"
    },
    {
      title: i18n.t("BindMenu"),
      componentName: "BindMenu"
    }
  ]
};


// 自定义表单 表单设计 
// 代码优先 自定义开发模板
const FormDesignController0 = {
  clickName: "JumpLink",
  key: 0,
  title: i18n.t("dataFirst"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("formDesign.titleBasicInformation"),
      componentName: "Basic"
    },
    {
      title: i18n.t("formDesign.titleDataTableConfiguration"),
      componentName: "TableStructurete"
    },
    {
      title: i18n.t("formDesign.titleFormDesign"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
  ]
};
// 数据优先 自定义表结构模板
const FormDesignController1 = {
  clickName: "customListStructure",
  key: 1,
  title: i18n.t("codeFirst"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("formDesign.titleBasicInformation"),
      componentName: "Basic"
    },
    {
      title: i18n.t("formDesign.titleFormDesign"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
    {
      title: i18n.t("DatasheetSet"),
      componentName: "DatasheetSet"
    }
  ]
};
// 简易模板
const FormDesignController2 = {
  clickName: "quick",
  key: 2,
  title: i18n.t("simpleTemplate"),
  description: i18n.t("code.formList.description"),
  stepList: [
    {
      title: i18n.t("formDesign.titleBasicInformation"),
      componentName: "Basic"
    },
    {
      title: i18n.t("formDesign.titleFormDesign"),
      componentName: "FormPage"
    },
    {
      title: i18n.t("formEvents"),
      componentName: "FormEvent"
    },
  ]
};

// 自定义接口管理
const InterfaceDesignController = {
  clickName: "InterfaceDesign",
  key: 0,
  title: i18n.t("customI/F"),
  description: i18n.t("customI/FMgt"),
  stepList: [
    {
      title: i18n.t("inputParmConfig"),
      componentName: "inputParameter"
    },
    {
      title: i18n.t("varConfig"),
      componentName: "variable"
    },
    {
      title: i18n.t("interfaceConfig"),
      componentName: "interfaceConfig"
    },
    {
      title: i18n.t("outParmConfig"),
      componentName: "outParameter"
    },
    {
      title: i18n.t("OutputConfiguration"),
      componentName: "outputConfig"
    }
  ]
};
export const controllerList = [
  [CodeBuildController0, CodeBuildController1, CodeBuildController2,FormDesignCodeBuildController0],
  [FormDesignController0, FormDesignController1, FormDesignController2],
  [InterfaceDesignController]
];
