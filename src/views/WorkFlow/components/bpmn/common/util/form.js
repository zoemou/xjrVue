const getChildrenData = (element) => {
  let temp = "";
  let required = false;
  let view = false;
  let edit = false;
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
      element.__config__.tag == "el-divider" ||
      element.__config__.tag == "avue-information-body"||
      element.__config__.tag == "avue-custom-button")
  ) {
    //标题 分割线  信息体 不显示
    type = element.__config__.tag;
    required = false;
    view = true;
    edit = false;
    disabled = true;
  } else if (element.autoCode) {
    // 编码 不显示
    required = false;
    view = true;
    edit = false;
    disabled = true;
  } else if (element.__config__ && element.__config__.tag == "el-upload") {
    //上传
    type = "upload";
    required = true;
    view = true;
    edit = true;
    disabled = false;
  } else {
    disabled = false;
    if (element.__config__.bindTableField) {
      required = false;
      view = true;
      edit = true;
      if (element.__config__.required) {
        required = true;
        view = true;
        edit = true;
      }
    }
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
      disabled: disabled,
			componentConfig:element
    };
  }
  return temp;
};
export const getCustomFiled = (schemeInfo) => {
  let children = [];
  let fields = schemeInfo.data.fields;
  if (fields.length > 0) {
    fields.forEach((element) => {
      if (element.__config__.componentName) {
        //tab 数据配置不一致，特殊处理
        if (element.__config__.componentName == "avue-tabs") {
          if (element.__config__ && element.__config__.childrenObj) {
            let obj = element.__config__.childrenObj;
            for (var i in obj) {
              if (obj[i].length > 0) {
                obj[i].forEach((ele1) => {
                  if (ele1.__config__.componentName == "table") {
                    let subTempConfig = {
                      bindTable: ele1.__config__.bindTable,
                      fieldsId: "",
                      fieldsName: ele1.__config__.componentTitle,
                      filedsType: "",
                      formId: ele1.__config__.formId,
                      type: "table",
                      required: true,
                      view: true,
                      edit: true,
                      disabled: false,
                      show: false,
                      children: [],
											componentConfig:ele1
                    };

                    if (
                      ele1.__config__.children &&
                      ele1.__config__.children.length > 0
                    ) {
                      ele1.__config__.children.forEach((ele2) => {
                        let temp2 = getChildrenData(ele2);
                        if (temp2) {
                          temp2.fieldsName = temp2.fieldsName;
                          subTempConfig.children.push(temp2);
                        }
                      });
                    }
                    children.push(subTempConfig);
                  } else {
                    let temp = getChildrenData(ele1);
                    if (temp) {
                      children.push(temp);
                    }
                  }
                });
              }
            }
          }
        } else if (element.__config__.componentName == "table") {
          let subTempConfig = {
            bindTable: element.__config__.bindTable,
            fieldsId: "",
            fieldsName: element.__config__.componentTitle,
            filedsType: "",
            formId: element.__config__.formId,
            type: "table",
            required: true,
            view: true,
            edit: true,
            disabled: false,
            show: false,
            children: [],
						componentConfig:element
          };

          if (
            element.__config__.children &&
            element.__config__.children.length > 0
          ) {
            element.__config__.children.forEach((ele1) => {
              let temp = getChildrenData(ele1);
              if (temp) {
                temp.fieldsName = temp.fieldsName;
                subTempConfig.children.push(temp);
              }
            });
          }
          children.push(subTempConfig);
        }
      } else {
        let temp = getChildrenData(element);
        if (temp) {
          children.push(temp);
        }
      }
    });
  }
  let requiredAll = false;
  let childrenLength = children.length;
  let childrenRequired = children.filter((ele) => {
    return ele.required;
  });
  if (childrenRequired.length == childrenLength) {
    requiredAll = true;
  }
  let hideComponents = schemeInfo.data.hideComponents;
  return {
    requiredAll,
    children,
    hideComponents:hideComponents?hideComponents:[]
  }
};
