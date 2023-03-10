<template>
  <div class="flow-containers" v-loading="mainLoading">
    <div class="fewer-panel-box" @click="changePanel">
      <div :class="fewerPanelClass" class="animated fadeInRight"></div>
    </div>
    <el-header style="height: 0; border: none;">
      <div class="header-box">
        <div>
          <el-upload action :before-upload="openBpmn" class="upload-box">
            <el-tooltip effect="dark" :content="$t('workFlow.Bpmn.textLoading')" placement="bottom">
              <el-button size="mini" icon="el-icon-folder-opened" />
            </el-tooltip>
          </el-upload>
          <el-tooltip effect="dark" :content="$t('workFlow.Bpmn.textNew')" placement="bottom">
            <el-button size="mini" icon="el-icon-circle-plus" @click="newDiagram" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('workFlow.Bpmn.textAdaptive')" placement="bottom">
            <el-button size="mini" icon="el-icon-rank" @click="fitViewport" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('workFlow.Bpmn.textEnlarge')" placement="bottom">
            <el-button size="mini" icon="el-icon-zoom-in" @click="zoomViewport(true)" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('workFlow.Bpmn.textNarrow')" placement="bottom">
            <el-button size="mini" icon="el-icon-zoom-out" @click="zoomViewport(false)" />
          </el-tooltip>
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-download"
            @click="saveXML(true)"
          >{{$t('workFlow.Bpmn.downloadXmlBtn')}}</el-button>
          <el-button
            size="mini"
            icon="el-icon-picture"
            @click="saveImg('svg', true)"
          >{{$t('workFlow.Bpmn.downloadSvgBtn')}}</el-button>
          <UpdateFormData @changeKey="panelKey++"></UpdateFormData>
          <el-button
            size="mini"
            type="primary"
            @click="save"
            :loading="flagSaveModel"
          >{{flagSaveModel?$t('workFlow.WFMenu.hintSubmit'):$t('workFlow.Bpmn.saveModelBtn')}}</el-button>
        </div>
      </div>
    </el-header>
    <el-container style="height: 100%;">
      <el-container class="box">
        <el-main class="left">
          <div ref="canvas" class="canvas" />
        </el-main>
        <div
          class="resize animated fadeInRightBig"
          :title="$t('workFlow.Bpmn.titleShrink')"
          v-show="showPanel && element"
        >
          <div
            :class="showPanel ? 'drawer-img  animated fadeInRightBigBig' : ''"
            style="animate-delay: 10s;"
          ></div>
        </div>
        <div class="aside animated fadeInRight" v-show="showPanel && element">
          <panel v-if="showPanel && element" :modeler="modeler" :element="element" :key="panelKey" />
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Modeler from "./lib/Modeler";
import panel from "./PropertyPanel";
import UpdateFormData from "./nodePanel/property/UpdateFormData";
//import customTranslate from "@/util/customTranslate"; // ??????
import { getStore } from "@/util/store";
import {
  initImportProcessProperties,
  initImportChildShapesProperties,
  initProcessProperties,
  setProcessProperties,
  getChildShapes,
  setInfoProperties,
  getProcessProperties,
  getDefaultPropertiesFromType,
} from "./common/util/properties";
import {
  getModelId,
  setModelId,
  setProcessCategory,
} from "./common/util/modelId";
import { randomStr, getInitbpmXml } from "./common/util/util";
import { add, edit } from "@/api/bpmn";
export default {
  name: "WorkflowBpmnModeler",
  components: {
    panel,
    UpdateFormData,
  },
  props: {
    modulesId: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isImport: {
      type: Boolean,
      default: false,
    },
    json: {
      type: Object,
    },
  },
  data() {
    return {
      flagSaveModel: false,
      mainLoading: true,
      bpmnXml: null,
      modeler: null,
      element: null,
      zoom: 1,
      showPanel: true,
      panelKey: 1,
    };
  },
  computed: {
    fewerPanelClass() {
      if (this.showPanel) {
        return "fewer-right-img";
      } else {
        return "fewer-left-img";
      }
    },
  },
  beforeDestroy() {
    this.showPanel = false;
    this.bpmnXml = null;
    this.modeler = null;
    this.element = null;
  },
  mounted() {
    this.mainLoading = true;
    this.registerModeler();
    this.initData();
    this.handleModeler();
    this.mainLoading = false;
  },
  methods: {
    initData() {
      setProcessCategory();
      setModelId(this.modulesId);
      if (this.isEdit) {
        this.redrawProperties();
      } else {
        this.newDiagram();
      }
      this.dragControllerResize();
    },
    // ????????????
    registerModeler() {
      this.modeler = new Modeler({
        container: this.$refs.canvas,
        additionalModules: [
          {
            translate: ["value", this.customTranslate],
          },
        ],
        moddleExtensions: {},
      });
    },
    customTranslate(template, replacements) {
      replacements = replacements || {};
      const translations = getStore({
        name: "lg-mark-" + (getStore({ name: "language" }) || "zh-CN"),
      });
      // Translate
      template = translations[template] || template;

      // Replace
      return template.replace(/{([^}]+)}/g, function (_, key) {
        var str = replacements[key];
        if (
          translations[replacements[key]] !== null &&
          translations[replacements[key]] !== "undefined"
        ) {
          str = translations[replacements[key]];
        }
        return str || "{" + key + "}";
      });
    },
    //??????????????????
    handleModeler() {
      this.modeler.on("root.added", (e) => {
        if (e.element.type === "bpmn:Process") {
          this.showPanel = false;
          this.element = null;
          this.$nextTick().then(() => {
            this.element = e.element;
            this.showPanel = true;
          });
        }
      });
      this.modeler.on("element.click", (e) => {
        const { element } = e;
        // hack ????????????????????????
        this.showPanel = false;
        this.element = null;
        if (element) {
          this.$nextTick().then(() => {
            if (element.type == "label") {
              this.element = element.parent;
            } else {
              this.element = element;
            }
            this.showPanel = true;
          });
        }
      });
      this.modeler.on("selection.changed", (e) => {
        // hack ????????????????????????
        this.element = null;
        this.showPanel = false;
        const element = e.newSelection[0];
        if (element) {
          this.$nextTick().then(() => {
            if (element.type == "label") {
              this.element = element.parent;
            } else {
              this.element = element;
            }
            this.showPanel = true;
          });
        }
      });
    },
    newDiagram() {
      let params = {
        id: "process_" + randomStr(),
        name: "name_" + randomStr(),
      };
      setInfoProperties(new Map());
      initProcessProperties(params.id);
      this.createNewDiagram(getInitbpmXml(params));
    },
    dragControllerResize: function () {
      let resize = document.getElementsByClassName("resize");
      let left = document.getElementsByClassName("left");
      let mid = document.getElementsByClassName("aside");
      let box = document.getElementsByClassName("box");
      for (let i = 0; i < resize.length; i++) {
        // ??????????????????
        resize[i].onmousedown = function (e) {
          //??????????????????
          resize[i].style.background = "#818181";
          let startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // ??????????????????
          document.onmousemove = function (e) {
            let endX = e.clientX;
            let moveLen = resize[i].left + (endX - startX); // ???endx-startx???=??????????????????resize[i].left+???????????????=???????????????????????????
            let maxT = box[i].clientWidth - resize[i].offsetWidth; // ???????????? - ????????????????????? = ?????????????????????

            if (moveLen < 32) moveLen = 32; // ??????????????????????????????32px
            if (moveLen > maxT - 150) moveLen = maxT - 150; //???????????????????????????150px

            resize[i].style.left = moveLen; // ???????????????????????????

            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + "px";
              mid[j].style.width = box[i].clientWidth - moveLen - 10 + "px";
            }
          };
          // ??????????????????
          document.onmouseup = function () {
            //????????????
            resize[i].style.background = "#d6d6d6";
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //????????????????????????????????????????????????????????????ReleaseCapture()?????????
          };
          resize[i].setCapture && resize[i].setCapture(); //??????????????????????????????????????????????????????????????????
          return false;
        };
      }
    },
    // ????????????????????????
    fitViewport() {
      this.zoom = this.modeler.get("canvas").zoom("fit-viewport");
      const bbox = document
        .querySelector(".flow-containers .viewport")
        .getBBox();
      const currentViewbox = this.modeler.get("canvas").viewbox();
      const elementMid = {
        x: bbox.x + bbox.width / 2 - 65,
        y: bbox.y + bbox.height / 2,
      };
      this.modeler.get("canvas").viewbox({
        x: elementMid.x - currentViewbox.width / 2,
        y: elementMid.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height,
      });
      this.zoom = (bbox.width / currentViewbox.width) * 1.8;
    },
    // ????????????
    zoomViewport(zoomIn = true) {
      let modelId = getModelId();
      this.zoom = this.modeler.get("canvas").zoom();
      this.zoom += zoomIn ? 0.1 : -0.1;
      this.modeler.get("canvas").zoom(this.zoom);
    },
    redrawProperties() {
      const { xml, json, ...params } = this.json;
      if (xml) {
        this.bpmnXml = xml;
        this.createNewDiagram(xml);
      }
      if (json != "{}") {
        let { childShapes, properties } = JSON.parse(json);
        let ObjMapJson = {};
        childShapes.forEach((element) => {
          ObjMapJson[element.resourceId] = {
            ...getDefaultPropertiesFromType(element.properties.type),
            ...element.properties,
          };
          let subChildShapes = element.childShapes;
          if (subChildShapes && subChildShapes.length > 0) {
            subChildShapes.forEach((element2) => {
              ObjMapJson[element2.resourceId] = {
                ...getDefaultPropertiesFromType(element2.properties.type),
                ...element2.properties,
              };
            });
          }
        });
        setInfoProperties(ObjMapJson);
        const { schemeinfo, schemeAuthList } = params;
        let ruleNameParse = [];
        if (schemeinfo && schemeinfo.ruleName) {
          ruleNameParse = JSON.parse(schemeinfo.ruleName);
        }
        let processProperties = {
          ...getDefaultPropertiesFromType("bpmn:Process"),
          schemeAuthList: schemeAuthList,
          ...properties,
          ...schemeinfo,
          ruleNameParse,
        };
        setProcessProperties(processProperties);
      } else {
        let params = {
          id: "process_" + randomStr(),
          name: "name_" + randomStr(),
        };
        setInfoProperties(new Map());
        initProcessProperties(params.id);
      }
    },
    async createNewDiagram(data) {
      // ????????????????????????????????????
      // data = data.replace(/</g, '&lt;');
      // data = data.replace(/>/g, '&gt;');
      data = data.replace(/<!\[CDATA\[(.+)]]>/g, "&lt;![CDATA[$1]]&gt;");
      try {
        await this.modeler.importXML(data);
        this.fitViewport();
      } catch (err) {
        console.error(err.message, err.warnings);
      }
    },
    getProcessElementName() {
      return this.modeler.getDefinitions().rootElements[0].name;
    },
    async saveXML(download = false) {
      if (download) {
        this.mainLoading = true;
      }
      try {
        let { xml } = await this.modeler.saveXML({ format: true });
        xml = xml.replace(/&lt;/g, "<");
        xml = xml.replace(/&gt;/g, ">");
        if (download) {
          this.downloadFile(
            `${this.getProcessElementName()}.bpmn20.xml`,
            xml,
            "application/xml;charset=UTF-8"
          );
        }
        if (download) {
          this.mainLoading = false;
        }

        return xml;
      } catch (err) {
        if (download) {
          this.mainLoading = false;
        }
      }
      if (download) {
        this.mainLoading = false;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async saveImg(type = "svg", download = false) {
      this.mainLoading = true;
      try {
        const { svg } = await this.modeler.saveSVG({ format: true });
        if (download) {
          this.downloadFile(this.getProcessElementName(), svg, "image/svg+xml");
        }
        this.mainLoading = false;
        return svg;
      } catch (err) {
        this.mainLoading = false;
      }
      this.mainLoading = false;
    },
    async save() {
      this.flagSaveModel = true;
      let userInfo = localStorage.getItem("avue-userInfo")
        ? JSON.parse(localStorage.getItem("avue-userInfo")).content
        : {};

      let properties = getProcessProperties();
      if (!properties.F_Code) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Bpmn.hintTemplateNum"),
          type: "warning",
        });
        this.flagSaveModel = false;
        // this.mainLoading = false;
        return false;
      }
      if (!properties.F_Name) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Bpmn.hintTemplateName"),
          type: "warning",
        });
        this.flagSaveModel = false;
        // this.mainLoading = false;
        return false;
      }
      if (!properties.F_Category) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Bpmn.hintTemplateSort"),
          type: "warning",
        });
        this.flagSaveModel = false;
        // this.mainLoading = false;
        return false;
      }
      this.flagSaveModel = true;
      // this.mainLoading = true;
      let { schemeAuthList, ruleName, ...otherParams } = properties;
      let modelId = getModelId();
      let rootElementsJson = this.modeler.getDefinitions().rootElements;
      let rootElementsFlowElementsArr = rootElementsJson[0].flowElements;
      //??????????????????????????????????????????????????????????????????????????? ????????????????????????????????????
      if (otherParams.F_Assign != false || otherParams.F_Handle != "1") {
        //???????????????????????????
        let subProcessArr = rootElementsFlowElementsArr.filter((ele) => {
          return ele.$type == "bpmn:SubProcess";
        });
        //??????????????????????????????
        let callActivityArr = rootElementsFlowElementsArr.filter((ele) => {
          return ele.$type == "bpmn:CallActivity";
        });
        if (
          subProcessArr &&
          subProcessArr.length > 0 &&
          callActivityArr &&
          callActivityArr.length > 0
        ) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t(
              "sub-processNodesAndExternalProcessNodesYouCannotUsePreviousNodeSpecifyApprovers"
            ),
            type: "warning",
          });
          this.flagSaveModel = false;
          // this.mainLoading = false;
          return false;
        } else {
          if (subProcessArr && subProcessArr.length > 0) {
            this.$notify({
              title: this.$t("deletePrompt.promptTitle"),
              message: this.$t(
                "sub-processNodeYouCannotUsePreviousNodeSpecifyApprover"
              ),
              type: "warning",
            });
            this.flagSaveModel = false;
            // this.mainLoading = false;
            return false;
          }

          if (callActivityArr && callActivityArr.length > 0) {
            this.$notify({
              title: this.$t("deletePrompt.promptTitle"),
              message: this.$t(
                "externalProcessNodeYouCannotUsePreviousNodeSpecifyApprover"
              ),
              type: "warning",
            });
            this.flagSaveModel = false;
            // this.mainLoading = false;
            return false;
          }
        }
      }
      let childShapes = getChildShapes(rootElementsFlowElementsArr);
      //?????????
      let subProcessJsonbArr = childShapes.filter((ele) => {
        return ele.properties.type == "bpmn:SubProcess";
      });
      let callActivityJsonArr = childShapes.filter((ele) => {
        return ele.properties.type == "bpmn:CallActivity";
      });
      console.log('childShapes', childShapes)
      console.log('callActivityJsonArr',callActivityJsonArr)
      // ??????????????????????????????
      if (subProcessJsonbArr && subProcessJsonbArr.length > 0) {
        let subProcessInitiatorArr = [];
        subProcessJsonbArr.forEach((ele) => {
          if (ele.childShapes && ele.childShapes.length > 0) {
            ele.childShapes.forEach((ele2) => {
              if (ele2.properties.subProcessInitiator == "") {
                subProcessInitiatorArr.push(ele2);
              }
            });
          }
        });
        if (subProcessInitiatorArr.length > 0) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t("subprocessDoesNotHaveInitiatorSelected"),
            type: "warning",
          });
          this.flagSaveModel = false;
          // this.mainLoading = false;
          return false;
        }
      }
      //???????????????????????????????????? ????????????????????????????????? ??????????????????????????????????????????????????????
      if (callActivityJsonArr && callActivityJsonArr.length > 0) {
        let callActivityCallactivitycalledelementArr =
          callActivityJsonArr.filter((ele) => {
            return (
              ele.properties.callactivitycalledelement.F_Name == undefined ||
              ele.properties.callactivitycalledelement.F_Name == ""
            );
          });
        let callActivityInitiatorArr = callActivityJsonArr.filter((ele) => {
          //?????????????????????????????????
          return (ele.properties.subProcessInitiator == "" &&  ele.properties.callType);
        });
        let callActivityCondition = callActivityJsonArr.filter((ele) => {
          //????????????????????????????????????
          return (ele.properties.multiinstance_condition == "" &&  !ele.properties.callType);
        });
        let callActivityOptionType = callActivityJsonArr.filter((ele) => {
          //?????????????????????????????????????????????
          return (ele.properties.optionType == "" &&  !ele.properties.callType);
        });
        let callActivityInitiatorConfiguration = callActivityJsonArr.filter((ele) => {
          //???????????????????????????????????????
          return (ele.properties.initiatorConfiguration.length === 0 &&  !ele.properties.callType);
        });
        let callActivityConditionPercent = callActivityJsonArr.filter((ele) => {
          //????????????????????????????????????
          return (ele.properties.multiinstance_condition == "percent" && ele.properties.multiinstance_condition.split(',').length <= 1 &&  !ele.properties.callType);
        });
        if (
          callActivityCallactivitycalledelementArr.length > 0 &&
          callActivityInitiatorArr.length > 0
        ) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t(
              "externalProcessNotSelectCallingElementExternalProcessNotSelectInitiator"
            ),
            type: "warning",
          });
          this.flagSaveModel = false;
          // this.mainLoading = false;
          return false;
        } else if (callActivityInitiatorArr.length > 0) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t("noSponsorSelectedByExternalProcess"),
            type: "warning",
          });
          this.flagSaveModel = false;
          // this.mainLoading = false;
          return false;
        } else if (callActivityCallactivitycalledelementArr.length > 0) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t("externalProcessDidNotSelectCallingElement"),
            type: "warning",
          });
          this.flagSaveModel = false;
          // this.mainLoading = false;
          return false;
        } else if (callActivityCondition.length > 0 || callActivityOptionType.length > 0 || callActivityInitiatorConfiguration.length > 0 || callActivityConditionPercent.length > 0) {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: "???????????????????????????????????????????????????????????????????????????",
            type: "warning",
          });
          this.flagSaveModel = false;
          return false
        } else if (!callActivityJsonArr[0].properties.callType && callActivityJsonArr[0].properties.callactivityoutparameters.outParameters) {
          callActivityJsonArr[0].properties.callactivityoutparameters.outParameters = []
        }
      }

      let json_xml = {
        resourceId: modelId,
        properties,
        stencil: { id: "BPMNDiagram" },
        childShapes: childShapes,
        bounds: { lowerRight: { x: 1800, y: 1575 }, upperLeft: { x: 0, y: 0 } },
      };
      let xml = await this.saveXML(false);
      const result = {
        json: JSON.stringify(json_xml),
        xml,
        f_mobile: userInfo.F_Account,
        schemeAuthList: JSON.stringify(schemeAuthList),
        ruleName: ruleName ? JSON.stringify(ruleName) : "",
        ...otherParams,
        F_ModelId: modelId,
      };
      let res = { code: 0, data: { success: false, msg: "" } };
      try {
        if (this.isEdit) {
          if (this.isImport) {
            res = await add(result);
          } else {
            res = await edit(modelId, result);
          }
        } else {
          res = await add(result);
        }

        if (res.data.success) {
          this.isEdit
            ? this.isImport
              ? this.showMessage("add", "ok")
              : this.showMessage("edit", "ok")
            : this.showMessage("add", "ok");
          this.$emit("save", res);
        } else {
          this.isEdit
            ? this.isImport
              ? this.showMessage("add", "no")
              : this.showMessage("edit", "no")
            : this.showMessage("add", "no");
        }
      } catch (error) {
        res.data.msg = error;
        this.isEdit
          ? this.isImport
            ? this.showMessage("add", "no")
            : this.showMessage("edit", "no")
          : this.showMessage("add", "no");
      }
      //?????????????????????
      let bodyClass = document.body.className.split(" ");
      bodyClass.filter((item, idx) => {
        return item == "original" && bodyClass.splice(idx, 1);
      });
      document.body.className = bodyClass.join(" ");
      this.flagSaveModel = false;
      // this.mainLoading = false;
    },
    showMessage(type, status) {
      let msg =
        type == "add"
          ? status == "ok"
            ? this.$t("processDesignAddedSuccessfully")
            : this.$t("processDesignAdditionFailed")
          : status == "ok"
          ? this.$t("processDesignModificationSuccessful")
          : this.$t("processDesignModificationFailed");
      this.$notify({
        title: status == "ok"?this.$t("deletePrompt.successTitle"):this.$t("deletePrompt.failureTitle"),
        message: msg,
        type: status == "ok" ? "success" : "error",
      });
    },
    async importBpmn(data) {
      data = data.replace(/<!\[CDATA\[(.+)]]>/g, "&lt;![CDATA[$1]]&gt;");
      try {
        this.xml = data;
        await this.modeler.importXML(data);
        setInfoProperties(new Map());
        let rootElementsJson = this.modeler.getDefinitions().rootElements;
        if (rootElementsJson.length > 0) {
          initImportProcessProperties(rootElementsJson[0]);
          let rootElementsFlowElementsArr = rootElementsJson[0].flowElements;
          if (
            rootElementsFlowElementsArr &&
            rootElementsFlowElementsArr.length > 0
          ) {
            initImportChildShapesProperties(rootElementsFlowElementsArr);
          }
        }

        this.fitViewport();
      } catch (err) {
        console.error(err.message, err.warnings);
      }
    },
    openBpmn(file) {
      const reader = new FileReader();
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        this.importBpmn(reader.result);
      };
      return false;
    },
    downloadFile(filename, data, type) {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(new Blob([data], { type: type }));
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    changePanel() {
      this.showPanel = !this.showPanel;
    },
  },
};
</script>

<style lang="scss">
/*??????????????????????????????????????????*/
@import "./assets/diagram-js.css";
@import "./assets/bpmn-font/css/bpmn.css";
@import "./assets/bpmn-font/css/bpmn-codes.css";
@import "./assets/bpmn-font/css/bpmn-embedded.css";
.form-required {
  color: red;
}
.bjs-powered-by {
  display: none;
}
.flow-containers {
  // background-color: #ffffff;
  width: 100%;
  height: 100%;
  .el-header {
    border-bottom: 1px solid #e9e9e9;
    background: #fff;
  }

  .view-mode {
    .el-header,
    .el-aside,
    .djs-palette,
    .bjs-powered-by {
      display: none;
    }

    .el-loading-mask {
      background-color: initial;
    }
    .el-loading-spinner {
      display: none;
    }
  }
  .canvas {
    width: 100%;
    height: 100%;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    // width: 300px;
  }
  .load {
    margin-right: 10px;
  }
  .el-form-item__label {
    font-size: 13px;
  }

  .djs-palette {
    left: 0px !important;
    top: 0px;
    border-top: none;
  }

  .djs-container svg {
    min-height: 120vh;
  }

  /*??????div??????*/
  // .box {
  //   width: 100%;
  //   height: 100%;
  //   overflow: hidden;
  //   align-items: stretch;
  //   border-bottom: 1px solid #e9e9e9;
  // }
  /*??????div??????*/
  .left {
    height: 100%;
    background: #ffffff;
    padding: 0;
    overflow: hidden;
  }
  /*?????????div??????*/
  .resize {
    position: relative;
    cursor: col-resize;
    background-color: #d6d6d6;
    width: 1px;
    z-index: 3;
    // height: 1210px;
  }
  /*???????????????????????????*/
  .resize:hover {
    color: #444444;
  }
  /*??????div'??????*/
  .mid {
    // float: left;
    width: 68%; /*?????????????????????*/
    height: 100%;
    background: #fff;
    box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
  }
  .aside {
    position: relative;
    width: 40%;
    background-color: #fff;
  }
}
.header-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  left: 10%;
  right: 10%;
  width: 80%;
}
.drawer-img {
  background-image: url("/img/drawer.png");
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  position: absolute;
  top: calc(30vh + 75px);
  left: -10px;
  transform: rotate(90deg);
  z-index: 3;
}
.fewer-panel-box {
  width: 15px;
  height: 100%;
  position: fixed;
  top: 52px;
  right: 5px;
  z-index: 3;
  border-left: 1px solid #d6d6d6;
}
.fewer-right-img {
  background-image: url("/img/fewer-right.png");
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
  margin-top: calc(30vh + 75px);
}
.fewer-left-img {
  background-image: url("/img/fewer-left.png");
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
  margin-top: calc(30vh + 75px);
}
.upload-box {
  margin-right: 10px;
  display: inline-block;
}
.djs-palette .bpmn-icon-start-event-none:after,
.djs-palette .bpmn-icon-end-event-none:after,
.djs-palette .bpmn-icon-user:after,
.djs-palette .bpmn-icon-script:after,
.djs-palette .bpmn-icon-call-activity:after,
.djs-palette .bpmn-icon-gateway-xor:after,
.djs-palette .bpmn-icon-gateway-or:after,
.djs-palette .bpmn-icon-gateway-parallel:after,
.djs-palette .bpmn-icon-subprocess-expanded:after {
  content: "  " !important;
}
.flow-containers .djs-palette {
  height: 100%;
}
.djs-palette .djs-palette-entries {
  width: 60px !important;
  height: 100%;
  border-right: 1px solid #f2f2f2;
}
.djs-palette .entry:before {
  padding-left: 10px;
  cursor: pointer;
}
</style>
