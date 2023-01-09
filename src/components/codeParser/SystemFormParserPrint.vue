<template>
  <div v-loading="loading">
    <div  v-if="showPrint">
      <WorkFlowFormParserPrint
        v-if="showPrint"
        id="WorkFlowFormParserPrint"
        :vnodes="vnodes"
        :printType="printType"
        :borderColor="borderColor"
      ></WorkFlowFormParserPrint>
    </div>
     <div v-else>
       <component
      :is="componentName"
      v-if="componentName"
      systemFormType="1"
       ref="SystemForm"
    />
     </div>
  </div>
</template>

<script>
import { getStampsImgUrl } from "@/api/workFlow/stamp.js";
import { getFileList } from "@/api/code/form";
import { getOptions } from "@/util/dataApi";
import { getProvinceTree, getAreasChild } from "@/api/systemManagement/area";
import { getMultiMaintainerUser } from "@/api/organization/user.js";
import { getDepartmentInfo } from "@/api/organization/department.js";
import { getCompanyInfo } from "@/api/organization/company.js";
import WorkFlowFormParserPrint from "@/components/codeParser/WorkFlowFormParserPrint";
import SystemForm from "@/components/codeParser/SystemForm.vue";
export default {
  components: {
    SystemForm
  },
  props: {
    previewUrl:{
      type:String,
      default:""
    },
    printType: {
      type: Number,
      default: 1
    },
    borderColor:{
      type:String,
      default:'#7e7e7e'
    },
    formData:{
      type:Array,
      default:[]
    },
    formFieldInfo:{
      type:Object,
      default:{}
    }
  },
  components: {
    WorkFlowFormParserPrint
  },
    computed: {
    loader() {
      if (!this.previewUrl) {
        return null;
      }
      return () => import(`./../../${this.previewUrl}`);
    }
  },
  data() {
    return {
      loading: true,
      vnodes: [],
      showPrint: false,
      componentName: null,
      formConfigFields:[]
    };
  },
    mounted() {
    this.loader()
      .then(() => {
        this.componentName = () => this.loader();
      })
      .catch(() => {
        this.componentName = () => import("./../../views/Customer/Default.vue");
      });
  },
  created() {
    setTimeout(() => {
      this.getJson();
    }, 1);
  },
  methods: {
    getJson(){
       let formConfig = this.$refs['SystemForm'].formConfig;
       if(formConfig&&formConfig.fields&&formConfig.fields.length>0){
         this.formConfigFields = formConfig.fields;
         this.renderBox();
       }
   
    },
    async getTableShowValue(scheme) {
      const config = scheme.__config__;
      let dynamic = [];
      let fields = [];
      let tableColumn = {};
      let children = config.children;
      if (children && children.length > 0) {
        let bindTable = children[0].__config__.bindTable;
        if (this.formData[bindTable]) {
          dynamic = this.formData[bindTable];
        }
        children.map((subConf, index) => {
          const subConfig = subConf.__config__;
          let key = subConfig.bindTableField;
          fields.push(key);
          tableColumn[key] = {
            label: subConfig.label,
            data: [],
            config: subConfig
          };
        });
        if (dynamic.length > 0) {
          dynamic.forEach(async element => {
            for (let [key, value] of Object.entries(element)) {
              if (fields.includes(key)) {
                let subScheme = {
                  __config__: tableColumn[key].config
                };
                let tempVal =
                  value && typeof value == "string" && value.includes(",")
                    ? value.split(",")
                    : value;
                let showValue = await this.getShowDefaultValue(
                  subScheme,
                  tempVal
                );
                tableColumn[key].data.push(showValue);
              }
            }
          });
        }
      }

      return tableColumn;
    },
    async getAreaShowValue(str) {
      let showValue = "";
      let tempNameArr = [];
      let value = str.split(",");
      if (value.length > 0) {
        let id1 = value[0] ? value[0] : "";
        let id2 = value[1] ? value[1] : "";
        let id3 = value[2] ? value[2] : "";
        let res = await getProvinceTree();
        if (res.data && res.data.data && res.data.data.length > 0) {
          let item = res.data.data.filter(ele => {
            return ele.F_AreaId == id1;
          });
          if (item.length > 0 && item[0]) {
            tempNameArr.push(item[0].F_AreaName);
          }
        }
        if (id2) {
          let res2 = await getAreasChild(id1);
          if (res2.data && res2.data.data && res2.data.data.length > 0) {
            let item = res2.data.data.filter(ele => {
              return ele.F_AreaId == id2;
            });
            if (item.length > 0 && item[0]) {
              tempNameArr.push(item[0].F_AreaName);
            }
          }
        }
        if (id3) {
          let res2 = await getAreasChild(id2);
          if (res2.data && res2.data.data && res2.data.data.length > 0) {
            let item = res2.data.data.filter(ele => {
              return ele.F_AreaId == id3;
            });
            if (item.length > 0 && item[0]) {
              tempNameArr.push(item[0].F_AreaName);
            }
          }
        }
        showValue = tempNameArr.join(",");
        return showValue;
      } else {
        return showValue;
      }
    },
    async getOpinionComonentValue(scheme) {
      let config = scheme.__config__;
      let opinionComonentValue = [];
      //意见框
      let taskCommentList = window.localStorage.getItem(
        "systemFormParserTaskCommentList"
      );
      taskCommentList = taskCommentList ? JSON.parse(taskCommentList) : [];
      let formId = window.localStorage.getItem("systemFormFId");
      let selfId = formId + "-" + config.formId;
      if (taskCommentList[selfId] && Array.isArray(taskCommentList[selfId])) {
        let opinionComonent = taskCommentList[selfId];
        if (opinionComonent && opinionComonent.length > 0) {
          opinionComonent.forEach(async element => {
            let children = [];
            try {
              if (element.esignature) {
                let res = await getStampsImgUrl(element.esignature);
                let img_File = "";
                if (res.data.success) {
                  img_File = res.data.data;
                }
                if (img_File) {
                  children.push(img_File);
                }
              }
              element.children = children;
              opinionComonentValue.push(element);
            } catch (error) {}
          });

          return opinionComonentValue;
        } else {
          return opinionComonentValue;
        }
      }
      return opinionComonentValue;
    },
    async getUploadList(folderId) {
      let showValue = "";
      try {
        let res = await getFileList(folderId);
        if (res.data && res.data.data && res.data.data.length > 0) {
          let fileNameList = [];
          res.data.data.forEach((ele, i) => {
            fileNameList.push("《" + ele.F_FileName + "》");
          });
          showValue = fileNameList.join("、");
        }
      } catch (error) {}

      return showValue;
    },
    async getOrgShowValue(infoType, value) {
      let showValue = "";
      if (infoType == "department") {
        let res = await getDepartmentInfo(value);
        if (res && res.data && res.data.success && res.data.data) {
          showValue = res.data.data.fullName;
        }
      } else if (infoType == "company") {
        let res = await getCompanyInfo(value);
        if (res && res.data && res.data.success && res.data.data) {
          showValue = res.data.data.fullName;
        }
      } else if (infoType == "user") {
        let res = await getMultiMaintainerUser(value);
        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.data &&
          res.data.data.length > 0
        ) {
          let tempNameArr = [];
          res.data.data.forEach(ele => {
            if (ele.UserInfo) {
              tempNameArr.push(ele.UserInfo["F_RealName"]);
            }
          });
          showValue = tempNameArr.join(",");
        }
      } else if (infoType == "date") {
        showValue = value;
      }
      return showValue;
    },
    getCapitalizedValue(num) {
      let NUM = new Array(
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖",
        "拾"
      );
      let UNIT = new Array("", "拾", "佰", "仟", "万", "亿", "元", "");
      let splitNum = ("" + num).replace(/(^0*)/g, "").split("."),
        index = 0,
        numStr = "";
      for (let i = splitNum[0].length - 1; i >= 0; i--) {
        switch (index) {
          case 0:
            numStr = UNIT[7] + numStr;
            break;
          case 4:
            if (
              !new RegExp(
                "0{4}//d{" + (splitNum[0].length - i - 1) + "}$"
              ).test(splitNum[0])
            )
              numStr = UNIT[4] + numStr;
            break;
          case 8:
            numStr = UNIT[5] + numStr;
            UNIT[7] = UNIT[5];
            index = 0;
            break;
        }
        if (
          index % 4 == 2 &&
          splitNum[0].charAt(i + 2) != 0 &&
          splitNum[0].charAt(i + 1) == 0
        )
          numStr = NUM[0] + numStr;
        if (splitNum[0].charAt(i) != 0)
          numStr = NUM[splitNum[0].charAt(i)] + UNIT[index % 4] + numStr;
        index++;
      }
      if (splitNum[0] == "") {
        numStr = NUM[0];
      }
      if (splitNum.length > 1) {
        let UNit2 = ["角", "分"];
        let roundNum = 2;
        // 加上小数部分(如果有小数部分)  保留两位小数
        numStr += UNIT[6];
        for (let i = 0; i < roundNum; i++) {
          let tempVal = splitNum[1].charAt(i) ? splitNum[1].charAt(i) : 0;
          numStr += NUM[tempVal] + UNit2[i];
        }
      } else {
        numStr += UNIT[6];
      }
      if (numStr == "一十") numStr = "十";
      if (numStr.match(/^一/) && numStr.length == 3)
        numStr = numStr.replace("一", "");
      return numStr;
    },
    async getShowDefaultValue(scheme, value) {
      let config = scheme.__config__;
      let showValue = value;
      try {
        if (config.tag === "el-checkbox-group") {
        if (
          showValue &&
          typeof showValue == "string" &&
          showValue.includes(",")
        ) {
          showValue = showValue.split(",");
        }
      } else if (
        config.tag === "el-date-picker" ||
        config.tag === "el-time-picker"
      ) {
        if (
          showValue &&
          typeof showValue == "string" &&
          showValue.includes(",")
        ) {
          let configVal = showValue.split(",");
          showValue = configVal.join(" - ");
        }
      } else if (config.showCapitalizedValue) {
        if (showValue) {
          showValue = this.getCapitalizedValue(showValue);
        }
      } else if (config.tag === "el-upload") {
        showValue = await this.getUploadList(showValue);
      } else if (config.tag === "avue-information-body") {
        showValue = await this.getOrgShowValue(scheme.infoType, showValue);
      } else if (
        config.tag == "xjr-opinion-comonent" ||
        (scheme.__type__ && scheme.__type__ == "opinion")
      ) {
        showValue = await this.getOpinionComonentValue(scheme);
      } else if (config.tag == "h2") {
        showValue = config.label;
      } else if (config.tag == "avue-select-area") {
        showValue = await this.getAreaShowValue(showValue);
      } else if (config.tag == "avue-input-tree") {
        let type = scheme.__type__;
        showValue = await this.getOrgShowValue(type, showValue);
      } else if (config.tag == "xjr-select-user") {
        let type = "user";
        showValue = await this.getOrgShowValue(type, showValue);
      }
      //数据字典
      let defaultValue = showValue;
      if(config.dataType){
          showValue = await this.getDateTypeShowValue(config,defaultValue);
        }
      } catch (error) {
        
      }
      
      return showValue;
    },
    async getDateTypeShowValue(config,defaultValue) {
      let showValue = defaultValue;
    
      let options = await getOptions(config);
     
       if (config.dataType == "dataItem") {
          let dataItem = config.dataItem;
           if (defaultValue && defaultValue.length > 0) {
                let item = options.filter(ele => {
                  return defaultValue.includes(ele.F_ItemValue);
                });
                let tempArr = [];
                if (item.length > 0) {
                  item.forEach(ele2 => {
                    tempArr.push(ele2.F_ItemName);
                  });
                }
                showValue = tempArr.join(",");
              } else {
                let item = options.filter(ele => {
                  return ele.F_ItemValue == defaultValue;
                });
                if (item.length > 0 && item[0]) {
                  showValue = item[0].F_ItemName;
                }
              }
        }
        //数据源 Api
        else if (config.dataType == "dataSource"||config.dataType == "dataApi") {
          let dataSource = config.dataType == "dataApi"? config.apiConfig.dataSource:config.dataSource;
          let showField =  config.dataType == "dataApi"? config.apiConfig.showField:config.showField;
          let saveField =  config.dataType == "dataApi"? config.apiConfig.saveField:config.saveField;
          if (defaultValue && defaultValue.length > 0) {
          let item = options.filter(ele => {
            return defaultValue.includes(ele[saveField]);
          });
          let tempArr = [];
          if (item.length > 0) {
            item.forEach(ele2 => {
              tempArr.push(ele2[showField]);
            });
          }
          showValue = tempArr.join(",");
        } else {
          let item = options.filter(ele => {
            return ele[saveField] == defaultValue;
          });
          if (item.length > 0 && item[0][showField]) {
            showValue = item[0][showField];
          }
        }
      }
      return showValue
    },
    async renderBox() {
      let formFieldPermissionsArr = this.formFieldInfo.formFieldInfo.children;
      let permissionFieldsIds = [];
      let permissionFieldsTable = new Map();
      formFieldPermissionsArr.forEach(ele => {
        if (ele.view) {
          let id =ele.fieldsId?ele.fieldsId:ele.bindTable
          permissionFieldsIds.push(id);
          if(ele.children&&ele.children.length>0){
            let permissionTableFields = [];
            ele.children.forEach(ele2 => {
              if(ele2.view){
                permissionTableFields.push(ele2.fieldsId);
              }
            });
            permissionFieldsTable.set(id,permissionTableFields);
          }
        }
      });
      let vnodes = [];
      this.formConfigFields.map(async (scheme, index) => {
        const config = scheme.__config__;
        let tempJson = {
          span: config.span ? config.span : 24,
          showLabel: config.showLabel ? config.showLabel : true,
          labelWidthStyle: "width:120px;",
          formId: config.formId ? config.formId : false,
          label: config.label ? config.label : "标题",
          tag: config.tag ? config.tag : null,
          componentName: config.componentName ? config.componentName : "",
          children: [],
          view: false,
          defaultValue: null,
          showValue: null,
          prepend: scheme.prepend ? scheme.prepend : "",
          append: scheme.append ? scheme.append : "",
          prefixIcon: scheme["prefix-icon"] ? scheme["prefix-icon"] : "",
          suffixIcon: scheme["suffix-icon"] ? scheme["suffix-icon"] : ""
        };
        vnodes[index] = tempJson;
        try {
          if (config.componentName) {
          if (config.componentName === "table") {
            let table = scheme["__config__"].bindTable;
            if (permissionFieldsIds.includes(table)) {
              vnodes[index].view = true;
              let val = permissionFieldsTable.get(table);
              scheme.__config__.children = scheme.__config__.children.filter(ele3=>{
                let fieldsId = ele3.__vModel__;
                  return val.includes(fieldsId)
              });
            let dynamic = await this.getTableShowValue(scheme);
            vnodes[index].showValue = dynamic;
            }else{
              vnodes[index].view = false;
            }
            
          }
        } else {
          vnodes[index].view = false;
          if (permissionFieldsIds.includes(scheme["__vModel__"])) {
            vnodes[index].view = true;
          }
          vnodes[index].view = true;
          if (config.tag == "xjr-select-user") {
            vnodes[index].suffixIcon = "";
          }
          vnodes[index].labelWidthStyle = config.labelWidth
            ? "width:" + config.labelWidth + "px;"
            : "width:120px;";
          let showValue = config.defaultValue;
          if (scheme["__vModel__"] && this.formData[scheme["__vModel__"]]) {
            showValue = this.formData[scheme["__vModel__"]];
          }
          vnodes[index].showValue = await this.getShowDefaultValue(
            scheme,
            showValue
          );
        }
        } catch (error) {
          
        }
        
      });
      this.vnodes = vnodes;
      this.loading = false;
      this.showPrint = true;
    }
  }
};
</script>

<style lang="css" scoped>
.wrap {
  width: 100%;
  display: flex;
  min-height: 600px;
}
.iframe-box {
  width: 100%;
  height: 100vh;
  border: 0;
}
.iframe-box /deep/ .el-dialog__header {
  display: none;
}
</style>
