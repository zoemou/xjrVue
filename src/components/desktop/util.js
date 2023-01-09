import {isURL,validatenull} from "@/util/validate";
import webiste from "@/config/website";
import {getMenu} from "@/api/user";
export const addPath = (ele, first) => {
  const menu = webiste.menu;
  const propsConfig = menu.props;

  const propsDefault = {
    label: propsConfig.label || "label",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
    target: propsConfig.target || "target",
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;

  if (isURL(ele[propsDefault.path])) {
    
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$");
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index";
  } else {
    ele[propsDefault.children] &&
      ele[propsDefault.children].forEach((child) => {
        if (!isURL(child[propsDefault.path])) {
          child[propsDefault.path] = `${ele[propsDefault.path]}${
            child[propsDefault.path] ? child[propsDefault.path] : "index"
          }`;
        }
        addPath(child);
      });
  }
}