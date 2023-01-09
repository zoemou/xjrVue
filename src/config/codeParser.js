import { getSystemFormInfo } from "@/api/bpmn";
import { Message } from "element-ui";
import i18n from "@/lang";
export function splitComponent(component) {
  let previewUrl = "";
  if (component && component.length > 4) {
    let componentLength = component.length;
    let newComponent = component.substring(0, componentLength - 4);
    previewUrl = newComponent + "Form";
  }
  return previewUrl;
}
export const getComponentAddr = async (systemInfo) => {
  let formInfo = { F_Id: "", component: "", ...systemInfo };
  let previewUrl = "";
  if (formInfo.component) {
    previewUrl = splitComponent(formInfo.component);
  } else {
    let info = await getSystemFormInfo(formInfo.F_Id);
    if (info && info.data && info.data.data && info.data.data.component) {
      previewUrl = splitComponent(info.data.data.component);
    }
  }
  if (previewUrl == "") {
    Message({
      message: i18n.t("formConfigError"),
      type: "error",
    });
  }
  return previewUrl;
};
