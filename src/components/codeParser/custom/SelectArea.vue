<template>
  <el-cascader
    v-model="code"
    :props="props"
    :disabled="disabled"
    @change="handleChange"
    style="width: 100%"
    :clearable="clearable"
  ></el-cascader>
</template>

<script>
import { updateDefaultVal } from "../util.js";
import formParserMixin from "./mixin/formParser";
import { getProvinceTree, getAreasChild } from "@/api/systemManagement/area";
export default {
  mixins: [formParserMixin],
  props: {
    fieldsIndex: {
      type: Number,
      required: true,
    },
    formConf: {
      type: Object,
      required: true,
    },
    curFormId: {
      type: Number,
    },
    tabChildren: {
      type: Array,
    },
    // 1 新增 2 查看 3 编辑
    isEdit: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.handleChange(newValue);
    }
  },
  data() {
    return {
      value:[],
      confFields: [],
      code: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node;
          let nodes = [];
          if (level == 0) {
            getProvinceTree().then(res => {
              if (res.data?.data?.length > 0) {
                nodes = res.data.data.map(ele => {
                  ele["value"] = ele.F_AreaId;
                  ele["label"] = ele.F_AreaName;
                  ele["leaf"] = false;
                  return ele;
                });
              }
              resolve(nodes);
            });
          } else if (level == 1) {
            getAreasChild(value).then(res => {
              nodes = res.data.data.map(ele => {
                ele["value"] = ele.F_AreaId;
                ele["label"] = ele.F_AreaName;
                ele["leaf"] = false;
                return ele;
              });
              resolve(nodes);
            });
          } else if (level == 2) {
            getAreasChild(value).then(res => {
              nodes = res.data.data.map(ele => {
                ele["value"] = ele.F_AreaId;
                ele["label"] = ele.F_AreaName;
                ele["leaf"] = true;
                return ele;
              });
              resolve(nodes);
            });
          }
        }
      }
    };
  },
  created() {
    if (this.tabChildren && this.tabChildren.length) {
      this.confFields = this.tabChildren;
    } else {
      this.confFields = this.formConf.fields;
    }
    this.setValue();
     if(this.confFields[this.fieldsIndex].__config__.defaultValue){
        if (Array.isArray(this.confFields[this.fieldsIndex].__config__.defaultValue)) {
        this.code = this.confFields[this.fieldsIndex].__config__.defaultValue;
      } else {
        this.code = this.confFields[this.fieldsIndex].__config__.defaultValue.split(",");
      }
    }
  },
  mounted() {
    this.$event.$on("updateFormConf", (obj) => {
      if (obj?.fields) {
        this.confFields[this.fieldsIndex].__config__.defaultValue =
          updateDefaultVal(
            this.confFields[this.fieldsIndex].__config__.formId,
            obj.fields
          );
        this.setValue();
      }
    });
  },
  methods: {
    handleChange(val) {
      this.setValue();
       let newVal = "";
      if (Array.isArray(val)) {
        newVal = val.join(",");
      } else {
        newVal = val;
      }
      this.confFields[this.fieldsIndex].__config__.defaultValue = newVal;
      this.handleTriggerEvent("change");
    },
  },
}
</script>

<style lang="scss" scoped></style>
