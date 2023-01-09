<template>
  <el-cascader
    v-model="code"
    :props="props"
    :disabled="disabled"
    @change="changeValue"
    style="width:100%;"
    :clearable="clearable"
  ></el-cascader>
</template>

<script>
import { getProvinceTree, getAreasChild } from "@/api/systemManagement/area";
export default {
  props: {
    value: {
      type: Array | String,
      default: []
    },
    disabled: {
      type: Boolean,
      default:false
    },
    clearable: {
      type: Boolean,
      default:true
    },
  },
  data() {
    return {
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
    if(this.value){
      if (Array.isArray(this.value)) {
      this.code = this.value;
    } else {
      this.code = this.value.split(",");
    }
    this.$emit("input", this.code.join(","));
    }
  },
  methods: {
    changeValue(val) {
      let newVal = "";
      if (Array.isArray(val)) {
        newVal = val.join(",");
      } else {
        newVal = val;
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    }
  }
};
</script>

<style lang="scss" scoped></style>
