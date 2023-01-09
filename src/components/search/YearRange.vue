<template>
  <div>
    <el-date-picker
      type="year"
      v-model="defaultValue[0]"
      format="yyyy"
      value-format="yyyy"
      :style="{ width: '48%' }"
      :placeholder="$t('请选择开始年份')"
      clearable
      :picker-options="pickerOptionsStart"
    ></el-date-picker>
    <span class="range">至</span>
    <el-date-picker
      type="year"
      v-model="defaultValue[1]"
      format="yyyy"
      value-format="yyyy"
      :style="{ width: '48%' }"
      :placeholder="$t('请选择结束年份')"
      clearable
      :picker-options="pickerOptionsEnd"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
    },
    field: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  watch: {
    defaultValue: function (val) {
      if (val) {
        this.$emit("changeValue", { field: this.field, val });
      }
    },
  },
  created () {
    if(this.value){
    this.defaultValue = this.value;
    }
  },
  computed: {
    pickerOptionsStart() {
      return {
        disabledDate: (time) => {
          if (this.defaultValue[1]) {
            return time.getFullYear() >= this.defaultValue[1];
          }
        },
      };
    },
    pickerOptionsEnd() {
      return {
        disabledDate: (time) => {
          if (this.defaultValue[0]) {
            return time.getFullYear() <= this.defaultValue[0];
          }
        },
      };
    },
  },
  data() {
    return {
      defaultValue: ["", ""],
    };
  },
};
</script>

<style lang="scss" scoped>
.range {
  width: 4%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
