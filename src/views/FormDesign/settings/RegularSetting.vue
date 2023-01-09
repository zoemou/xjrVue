<template>
  <el-form  size="small" label-width="90px" >
    <div
      v-for="(item, index) in activeData.__config__.regList"
      :key="index"
      class="reg-item"
    >
      <span
        class="close-btn"
        @click="activeData.__config__.regList.splice(index, 1)"
      >
        <i class="el-icon-close" />
      </span>
      <el-form-item :label="$t('code.rightPanel.expression')">
        <el-input
          v-model="item.pattern"
          :placeholder="$t('code.rightPanel.placeholderRegular')"
          @blur="checkExpression(item.pattern)"
        />
      </el-form-item>
      <el-form-item
        :label="$t('code.rightPanel.errorPrompt')"
        style="margin-bottom: 0"
      >
        <el-input
          v-model="item.message"
          :placeholder="$t('code.rightPanel.placeholderErrorPrompt')"
        />
      </el-form-item>
    </div>
    <div class="add-rule" style="margin-left: 20px">
      <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
        {{ $t("code.rightPanel.addRule") }}
      </el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  props: ["activeData"],
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: "",
        message: "",
      });
    },
    checkExpression(expression) {
      //正则表达式必须最前和最后带/
      let arr = expression.split("");
      let arrLength = arr.length;
      if (arrLength > 0) {
        if (arr[0] != "/" || arr[arrLength - 1] != "/") {
          this.$message(this.$t("code.rightPanel.hintRegular"));
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
