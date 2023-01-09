<template>
  <div class="main-container">
    <avue-crud ref="queryTable" :data="configData.outputs" :option="queryoption" stripe>
      <template slot="add" slot-scope="scope">
        <i
          class="el-icon-remove"
          style="color: #f56c6c; font-size: 20px; display: block"
          @click="deleteData(scope)"
        ></i>
      </template>
      <template slot="outputKey" slot-scope="scope">
        <el-select
          v-model="scope.row.outputKey"
          :placeholder="$t('apiOutputParameterSelect')"
        >
          <el-option
            v-for="item in configData.inputList"
            :key="item.F_OutputKey"
            :label="item.F_OutputKey"
            :value="item.F_OutputKey"
          >
          </el-option>
        </el-select>
      </template>
      <template slot="formId" slot-scope="scope">
        <el-select v-model="scope.row.formId" :placeholder="$t('formComponentSelect')">
          <el-option
            v-for="item in componentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { deepClone } from "@/util/util";
export default {
  props: ["configData", "allComponents"],
  data() {
    return {
      componentList: [],
    };
  },
  computed: {
    queryoption() {
      return {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: "auto", //表格高度差（主要用于减去其他部分让表格高度自适应）
        height: 320, //表格高度
        border: true,
        align: "center",
        menu: false,
        page: false,
        header: false,
        column: [
          {
            label: "",
            prop: "add",
            renderHeader: (h) => {
              return h("i", {
                style: { color: "#409EFF", fontSize: "20px", display: "block" },
                class: "el-icon-circle-plus",
                on: {
                  click: this.addRow,
                },
              });
            },
            width: "50px",
            slot: true,
          },
          {
            label: this.$t('apiOutputParameterSelect'),
            prop: "outputKey",
            slot: true,
          },
          {
            label:this.$t('formComponentSelect'),
            prop: "formId",
            slot: true,
          },
        ],
      }
    }
  },
  created() {
    this.initComponentList();
  },
  methods: {
    initComponentList() {
      let componentList = [];
      let list = deepClone(this.allComponents);
      //剔除 所有布局组件（子表单，标题，分割线）、意见簿、图片、上传、颜色、信息体、编码
      
      let tags = [
        "h2",
        "el-divider",
        // "tinymce",
        "xjr-opinion-comonent",
        "avue-custom-button",
        "el-image",
        "el-color-picker",
        "el-upload",
        "avue-information-body"
      ];
      if (list.length > 0) {
        list.forEach((element, i) => {
          if (element.__config__.componentName === "table") {
            //暂时不用支持子表单
          } else if (element.__config__.componentName === "avue-tabs") {
            let childrenObj = element?.__config__?.childrenObj || {};
            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
                let children = childrenObj[key] || [];
                element.__config__.childrenObj[key] = children.map((item) => {
                  if (item?.__config__?.componentName == "table") {
                    //暂时不用支持子表单
                  } else {
                    if (!tags.includes(item.__config__.tag)&&
                    !item.__config__.autoCodeRule) {
                      componentList.push({
                        id: item.__config__.formId,
                        name: item.__config__.label
                          ? item.__config__.label
                          : item.__config__.formId,
                      });
                    }
                  }
                });
              }
            }
          } else {
            if (!tags.includes(element.__config__.tag)&&
            !element.__config__.autoCodeRule
            ) {
              componentList.push({
                id: element.__config__.formId,
                name: element.__config__.label
                  ? element.__config__.label
                  : element.__config__.formId,
              });
            }
          }
        });
      }
      this.componentList = componentList;
    },
    deleteData(scope) {
      this.configData.outputs.splice(
        scope.row.$index,
        1
      );
    },
    addRow() {
      var obj = {
        outputKey: null,
        formId: null,
      };
      this.configData.outputs.push(obj);
    },
  },
};
</script>

<style lang="scss" scoped></style>
