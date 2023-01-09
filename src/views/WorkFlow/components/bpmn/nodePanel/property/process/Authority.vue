<template>
  <div>
    <el-form-item>
      <label
        >{{ $t("workFlow.Process.member")
        }}<em class="form-required">*</em></label
      >
      <el-radio-group v-model="schemeAuthType" @change="changeSchemeAuthType">
        <el-radio :label="1">{{
          $t("workFlow.Process.radioAllMembers")
        }}</el-radio>
        <el-radio :label="2">{{
          $t("workFlow.Process.radioDesignatedMembers")
        }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <PersonnelDesigneeSetting
      v-if="schemeAuthType == 2"
      :formInfo.sync="formInfo"
    ></PersonnelDesigneeSetting>
  </div>
</template>
<script>
import PersonnelDesigneeSetting from "./../personnel/Designee";
import { getRandomNumber } from "./../../../common/util/util";
export default {
  components: {
    PersonnelDesigneeSetting
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isSpecialInitiationProcessDisabled: false
  },
  data() {
    return {
      schemeAuthType: 1 //schemeAuthType 权限设置类型 1 所有成员 2 指定成员
    };
  },
  created () {
     if (
        this.formInfo.schemeAuthList &&
        this.formInfo.schemeAuthList.length > 0
      ) {
        if (this.formInfo.schemeAuthList[0].F_ObjType == "4") {
          this.schemeAuthType = 1;
          this.formInfo.schemeAuthList = [
            { F_Id: getRandomNumber(), F_ObjType: "4" }
          ];
        } else {
          this.schemeAuthType = 2;
        }
      }
  },
  methods: {
    changeSchemeAuthType(value) {
      if (value == 1) {
        this.formInfo.schemeAuthList = [
          { F_Id: getRandomNumber(), F_ObjType: "4" }
        ];
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
