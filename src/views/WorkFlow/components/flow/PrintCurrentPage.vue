<template>
  <div>
    <div class="print-box">
      <div class="print-item-box">
        <label>{{$t('workFlow.printCurrentPage.borderColor')}}</label>
        <el-color-picker v-model="borderColor" class="print-color"></el-color-picker>
      </div>
      <div class="print-item-box">
        <label>{{$t('workFlow.printCurrentPage.pageStyle')}}</label>
        <el-select
          v-model="printStyle"
          :placeholder="$t('workFlow.printCurrentPage.pageStyle')"
          class="print-style"
        >
          <el-option :label="$t('workFlow.printCurrentPage.labelDefault')" :value="0"> </el-option>
          <el-option :label="$t('workFlow.printCurrentPage.labelKumon')" :value="1"> </el-option>
          <el-option :label="$t('workFlow.printCurrentPage.labelManuscript')" :value="2"> </el-option>
          <el-option :label="$t('workFlow.printCurrentPage.labelUnderline')" :value="3"> </el-option>
        </el-select>
      </div>
      <div class="print-item-box">
        <label>{{$t('workFlow.printCurrentPage.titleUnderline')}}</label>
        <el-select
          v-model="printTitle"
          :placeholder="$t('workFlow.printCurrentPage.titleUnderline')"
          class="print-title"
        >
          <el-option :key="1" :label="$t('workFlow.printCurrentPage.labelYse')" :value="1"> </el-option>
          <el-option :key="2" :label="$t('workFlow.printCurrentPage.labelNo')" :value="0"> </el-option>
        </el-select>
      </div>

      <el-button
        icon="el-icon-printer"
        size="small"
        class="print-button"
        @click="printCurrentPage"
        >{{$t('workFlow.printCurrentPage.printPageBtn')}}</el-button
      >
    </div>
    <elDialog
      v-if="showPrint"
      :visible.sync="showPrint"
      :title="$t('workFlow.printCurrentPage.titlePrintPreview')"
      :append-to-body="true"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="true"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <el-button
        v-if="showPrint && printComponentsName == 'WorkFlowFormParser'"
        icon="el-icon-printer"
        size="small"
        class="print-button no-print print-default-button"
        @click="printDefaultForm"
      >
        {{$t('workFlow.printCurrentPage.prinBtn')}}
      </el-button>
      <el-button
        v-if="showPrint && printComponentsName == 'SystemFormParser'"
        icon="el-icon-printer"
        size="small"
        class="print-button no-print print-default-button"
        @click="printSystemForm"
      >
        {{$t('workFlow.printCurrentPage.prinBtn')}}
      </el-button>
      <WorkFlowFormParser
        class="print-default-box"
        ref="WorkFlowFormParser"
        v-if="printComponentsName == 'WorkFlowFormParser'"
        id="WorkFlowFormParser"
        :conf="processInfo.forms[printIndex]"
        :index="printIndex"
        :type="formType"
        :formFieldInfo="processInfo.formFieldInfo[printIndex]"
        :formData="processInfo.forms_data[printIndex]"
        :formInfos="processInfo.forms_info[printIndex]"
        :taskComment="processInfo.task_comment[printIndex]"
      ></WorkFlowFormParser>
      <WorkFlowFormParserPrint
        v-if="showPrint && printComponentsName == 'WorkFlowFormParserPrint'"
        class="print-default-box"
        id="WorkFlowFormParserPrint"
        :vnodes="vnodes"
        :printType="printType"
        :borderColor="borderColor"
      ></WorkFlowFormParserPrint>
      <SystemFormParser
        v-if="showPrint && printComponentsName == 'SystemFormParser'"
        id="SystemFormParser"
        class="print-default-box"
        :type="formType"
        :index="printIndex"
        :url="processInfo.formFieldInfo[printIndex].F_Url"
        :formData="processInfo.forms_data[printIndex]"
        :formFieldInfo="processInfo.formFieldInfo[printIndex]"
        :taskComment="processInfo.task_comment[printIndex]"
      ></SystemFormParser>
      <SystemFormParserPrint
        v-if="showPrint && printComponentsName == 'SystemFormParserPrint'"
        class="print-default-box"
        id="SystemFormParserPrint"
        :printType="printType"
        :borderColor="borderColor"
        :previewUrl="previewUrl"
         :formData="formData"
        :formFieldInfo="formInfos"
      ></SystemFormParserPrint>
    </elDialog>
  </div>
</template>

<script>
import WorkFlowFormParserPrint from "@/components/codeParser/WorkFlowFormParserPrint";
import SystemFormParserPrint from "@/components/codeParser/SystemFormParserPrint.vue";
import SystemFormParser from "@/components/codeParser/SystemFormParser.vue";
import WorkFlowFormParser from "@/components/codeParser/WorkFlowFormParser";
import { getStampsImgUrl } from "@/api/workFlow/stamp.js";
import {
  getDataItemDetail,
  getDataBySQL,
  getDataByQuery,
  getDbLinkSql
} from "@/api/databasemanage/datasource.js";
import { getOptions } from "@/util/dataApi";
import { getFileList } from "@/api/code/form";
import { getProvinceTree, getAreasChild } from "@/api/systemManagement/area";
import { getMultiMaintainerUser } from "@/api/organization/user.js";
import { getDepartmentInfo } from "@/api/organization/department.js";
import { getCompanyInfo } from "@/api/organization/company.js";
import print from "print-js";
import html2canvas from "html2canvas";
import {getComponentAddr} from "@/config/codeParser.js";
export default {
  directives: {
    print
  },
  components: {
    WorkFlowFormParser,
    WorkFlowFormParserPrint,
    SystemFormParserPrint,
    SystemFormParser
  },
  props: {
    printIndex: {
      type: Number,
      default: 0
    },
    processInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      showPrint: false,
      borderColor: "#7e7e7e",
      printStyle: 0,
      printTitle: 0,
      formType: 0,
      formFieldInfo: {},
      formConf: {},
      formData: {},
      formInfos: {},
      taskComment: [],
      authorityList: [],
      taskCommentList: [],
      taskCommentIds: [],
      vnodes: [],
      previewUrl:""
    };
  },
  computed: {
    printType() {
      if (this.printStyle == 0) {
        return 0;
      } else if (this.printStyle == 1) {
        if (this.printTitle == 1) {
          return 2;
        } else {
          return 1;
        }
      } else if (this.printStyle == 2) {
        if (this.printTitle == 1) {
          return 4;
        } else {
          return 3;
        }
      } else if (this.printStyle == 3) {
        if (this.printTitle == 1) {
          return 6;
        } else {
          return 5;
        }
      } else {
        return 0;
      }
    },
    printComponentsName() {
      if (this.printType == 0) {
        if (this.formType == 2) {
          return "SystemFormParser";
        } else {
          return "WorkFlowFormParser";
        }
      } else {
        if (this.formType == 2) {
          return "SystemFormParserPrint";
        } else {
          return "WorkFlowFormParserPrint";
        }
      }
    }
  },
  methods: {
    async printCurrentPage() {
      const loading = this.$loading({
        lock: true,
        text: this.$t('workFlow.printCurrentPage.hintLoad'),
        spinner: "el-icon-loading",
        background: "rgba(255, 255,255, 0.7)"
      });
      this.$emit("getFormData"); //更新formdata
      this.formType = this.processInfo.formFieldInfo[this.printIndex].F_Type;
      if (this.formType == 0) {
        this.formConf = this.processInfo.forms[this.printIndex];
        this.formFieldInfo = this.processInfo.formFieldInfo[this.printIndex];
        this.formData = this.processInfo.forms_data[this.printIndex];
        this.formInfos = this.processInfo.forms_info[this.printIndex];
        this.taskComment = this.processInfo.task_comment[this.printIndex];
        if (!this.formConf.fields) {
          this.$message.error(this.$t('workFlow.printCurrentPage.hintAbnormal'));
          return false;
        }
        if (
          !this.formFieldInfo ||
          !this.formFieldInfo.children ||
          this.formFieldInfo.children.length == 0
        ) {
          this.$message.error(this.$t('workFlow.printCurrentPage.hintNoPermission'));
          return false;
        }
        this.authorityList = this.getAuthorityList();
        this.taskCommentList = this.getTaskCommentList();
        this.taskCommentIds = Object.keys(this.taskCommentList);
        await this.renderBox();
        setTimeout(() => {
          loading.close();
          this.showPrint = true;
        }, 1000);
      } else {
        let formFieldInfo =  this.processInfo.formFieldInfo[this.printIndex];
        this.previewUrl = await getComponentAddr(formFieldInfo);
        this.formData = this.processInfo.forms_data[this.printIndex];
        this.formInfos = this.processInfo.forms_info[this.printIndex];
        setTimeout(() => {
          loading.close();
          this.showPrint = true;
        }, 1000);
      }
    },
    getAuthorityList() {
      //表单权限
      let authorityList = new Map();
      if (
        this.formFieldInfo &&
        this.formFieldInfo.children &&
        this.formFieldInfo.children.length > 0
      ) {
        let filedsSettingAuthority = this.formFieldInfo.children;
        filedsSettingAuthority.forEach(element => {
          let key = element.formId;
          authorityList.set(key, element);
        });
      }
      return authorityList;
    },
    getTaskCommentList() {
      //处理意见框组件
      let taskCommentList = {};
      if (this.taskComment && this.taskComment.length > 0) {
        this.taskComment.forEach(element => {
          if (
            element.approvalcomponents &&
            element.approvalcomponents.length > 0
          ) {
            element.approvalcomponents.forEach(taskCommentId => {
              if (taskCommentList[taskCommentId]) {
                taskCommentList[taskCommentId].push(element);
              } else {
                taskCommentList[taskCommentId] = [element];
              }
            });
          }
        });
      }
      return taskCommentList;
    },
    async getTableShowValue(scheme) {
      const config = scheme.__config__;
      let dynamic = [];
      if (this.formData[config.bindTable]) {
        dynamic = this.formData[config.bindTable];
      }
      let children = config.children;
      let fields = [];
      let tableColumn = {};
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
              let showValue = await this.getShowDefaultValue(subScheme, value);
              tableColumn[key].data.push(showValue);
            }
          }
        });
      }
      return tableColumn;
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
    async getOpinionComonentValue(conf) {
      let opinionComonentValue = [];
      let selfId = this.formFieldInfo.F_Id + "-" + conf.__config__.formId;
      if (this.taskCommentIds.includes(selfId)) {
        let opinionComonent = this.taskCommentList[selfId]
          ? this.taskCommentList[selfId]
          : [];
        if (opinionComonent && opinionComonent.length > 0) {
          opinionComonent.forEach(async element => {
            try {
              if (element.esignature) {
                let res = await getStampsImgUrl(element.esignature);
                let img_File = "";
                if (res.data.success) {
                  img_File = res.data.data;
                }
                 element.img_File = img_File;
              }
              opinionComonentValue.push(element);
            } catch (error) {}
          });
          return opinionComonentValue;
        } else {
          return opinionComonentValue;
        }
      }
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
          let configVal = value.split(",");
          if (configVal.length >= 1) {
            showValue = configVal;
          } else {
            showValue = value;
          }
        } else if (
          config.tag === "el-date-picker" ||
          config.tag === "el-time-picker"
        ) {
          let configVal = value.split(",");
          if (configVal.length > 1) {
            showValue = configVal.join(" - ");
          }
        } else if (config.tag === "el-upload") {
          showValue = await this.getUploadList(showValue);
        } else if (config.showCapitalizedValue) {
          if (showValue) {
            showValue = this.getCapitalizedValue(showValue);
          }
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
        let defaultValue = showValue;
        if(config.dataType){
          showValue = await this.getDateTypeShowValue(config,defaultValue);
        }
      } catch (error) {}

      return showValue;
    },
    async renderBox() {
      let vnodes = [];
      this.formConf.fields.map(async (scheme, index) => {
        const config = scheme.__config__;
        let tempJson = {
          span: config.span ? config.span : 24,
          showLabel: config.showLabel ? config.showLabel : false,
          labelWidthStyle: "width:120px;",
          formId: config.formId ? config.formId : false,
          label: config.label ? config.label : "",
          tag: config.tag ? config.tag : null,
          componentName: config.componentName ? config.componentName : "",
          children: [],
          view: false,
          defaultValue: null,
          showValue: null,
          prepend:
            scheme.__slot__ && scheme.__slot__.prepend
              ? scheme.__slot__.prepend
              : "",
          append:
            scheme.__slot__ && scheme.__slot__.append
              ? scheme.__slot__.append
              : "",
          prefixIcon: scheme["prefix-icon"] ? scheme["prefix-icon"] : "",
          suffixIcon: scheme["suffix-icon"] ? scheme["suffix-icon"] : ""
        };
        vnodes[index] = tempJson;
        let tempKey = config.formId;
        if (config.componentName) {
          if (config.componentName === "table") {
            let dynamic = await this.getTableShowValue(scheme);
            vnodes[index].showValue = dynamic;
          }
        } else if (this.authorityList.has(tempKey)) {
          if (config.tag == "xjr-select-user") {
            vnodes[index].suffixIcon = "";
          }
          let tempValue = this.authorityList.get(tempKey);
          vnodes[index].view = tempValue.view;
          vnodes[index].labelWidthStyle = config.labelWidth
            ? "width:" + config.labelWidth + "px;"
            : "width:120px;";
          let showValue = config.defaultValue;
          if (this.formData && "{}" != JSON.stringify(this.formData)) {
            if (
              config.bindTable &&
              config.bindTableField &&
              this.formData[config.bindTable] &&
              this.formData[config.bindTable][config.bindTableField]
            ) {
              showValue = this.formData[config.bindTable][
                config.bindTableField
              ];
            }
          }
          vnodes[index].showValue = await this.getShowDefaultValue(
            scheme,
            showValue
          );
        }
      });
      this.vnodes = vnodes;
    },
    printDefaultForm() {
       this.printForm('WorkFlowFormParser',this.$t('workFlow.printCurrentPage.prinBtn'));
    },
    printSystemForm() {
      if(this.showPrint && this.printComponentsName == 'SystemFormParser'){
        this.printForm('SystemFormParser','打印');
      }else{
        if (typeof eval(window.parent.printDefaultForm) == "function") {
        window.parent.printDefaultForm();
      } else {
        this.$message(this.$t('workFlow.printCurrentPage.hintNotFinished'));
      }
      }
    },
     printForm(refName, title) {
      let element = window.document.getElementById(refName);
      setTimeout(() => {
        html2canvas(element, {
          backgroundColor: null,
          useCORS: true,
          windowHeight: document.body.scrollHeight
        }).then(canvas => {
          const url = canvas.toDataURL();
          this.printImg = url;
          printJS({
            printable: url,
            type: "image",
            documentTitle: title,
            scanStyles: false,
            repeatTableHeader: false,
            header: null
          });
        });
      }, 1);
    },
    handleClose() {
      this.showPrint = false;
      this.$emit("updateForm");
    }
  }
};
</script>
<style scoped>
div /deep/ .el-color-picker__trigger{
  width: 40px;
  height: 30px;
  margin-left: 10px;
}
</style>
<style lang="scss" scoped>
.print-box {
  display: flex;
  justify-content: space-between;
  height: 50px;
  position: absolute;
  right: 15px;
  top: 0;
  cursor: pointer;
  z-index: 3;
}
.print-item-box{
  display: flex;
  margin-left: 10px;
}
.print-color{
  width: 60px;
  height: 30px;
}
.print-style {
  width: 130px;
  height: 30px;
  margin-left: 10px;
}
.print-title {
  width: 80px;
  height: 30px;
  margin-left: 10px;
}
.print-button {
  width: 110px;
  height: 30px;
  margin-left: 10px;
}
.print-default-button{
  position: fixed;
  right: 30px;
  top: 60px;
}
.print-default-box{
  margin-top:40px;
}
</style>
