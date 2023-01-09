<template>
  <!-- 所属系统 -->
  <div class="selection-system-box">
    <div :style="tipStyle" class="tip-box">
      <el-tooltip
        v-if="showTip"
        class="tip-item"
        effect="dark"
        :content="content"
        placement="bottom-start"
      >
        <el-button>?</el-button>
      </el-tooltip>
    </div>

    <el-select
      v-model="subSystemId"
      :placeholder="$t('forme.addModal.placeholderOwningSystem')"
      size="small"
      style="width: 100%"
      @change="changeSystem"
      :disabled="disabled"
    >
      <el-option
        :label="item.F_Name"
        :value="item.F_Id"
        v-for="item in allSystemList"
        :key="item.F_Id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import website from "@/config/website";
/* 演示环境 :
  开启演示环境：
    1.`src\config\website.js`的属性isTheDemoEnvironment设置为true
    2.后台系统中默认添加两条数据【应用平台，业务平台】
  演示环境下：
    1.下拉数据中去除主系统选项
    2.新增情况，默认值改为应用平台；编辑情况下，值如果为主系统，则disabled
*/
export default {
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    formItemLabelWidth: {
      type: Number,
      default: 80,
    },
    value: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["allSystem"]),
    tipStyle() {
      return "left:-" + this.formItemLabelWidth + "px;";
    },
    showTip() {
      return website.isTheDemoEnvironment;
    },
  },
  data() {
    return {
      disabled: false,
      subSystemId: "",
      allSystemList: [],
      content:
        "演示环境功能只允许发布至子系统，如果需要查看请移至子系统进行查看。",
    };
  },
  created() {
    this.subSystemId = this.value;
    if (website.isTheDemoEnvironment) {
      if (this.isEdit && this.value == 0) {
        this.disabled = true;
        this.allSystemList = this.allSystem;
      } else {
        this.allSystemList = this.allSystem.filter((ele) => {
          return ele.F_Id != "0";
        });
        if (this.value == 0) {
          this.subSystemId = website.applicationPlatformId; //应用平台
        }
        this.changeSystem(this.subSystemId);
      }
    } else {
      if(!this.isEdit){
        this.subSystemId = this.allSystem[0]?.F_Id || '0';
      }
      this.changeSystem(this.subSystemId);
      this.allSystemList = this.allSystem;
      
    }
  },
  methods: {
    changeSystem(systemId) {
      this.$emit("change", systemId);
      this.$emit("changeSystem", systemId);
    },
  },
};
</script>

<style lang="scss" scoped>
.selection-system-box {
  position: relative;
}
.tip-box {
  position: absolute;
  z-index: 2;
}
.tip-item {
  border-radius: 50%;
  padding: 2px 6px;
  background-color: #ccc;
  color: #fff;
  border: none;
}
</style>