<template>
  <!-- 基础信息 -->
  <div class="baseinfo-form">
    <el-form
      :rules="rules"
      ref="elForm"
      :model="menuParams.function"
      label-width="80px"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col :span="12" v-show="hasFormPermission('F_Name')">
          <el-form-item prop="F_Name" :label="$t('workFlow.Step1.labelFName')">
            <el-input
              :placeholder="$t('enterFunctionName')"
              size="small"
              v-model="menuParams.function.F_Name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="hasFormPermission('F_Icon')">
          <el-form-item prop="F_Icon" :label="$t('workFlow.Step1.labelFIcon')">
            <SelectIcon :menuForm.sync="menuParams.function"></SelectIcon>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-show="hasFormPermission('F_Type')">
          <el-form-item
            prop="F_Type"
            :label="$t('mobileDev.functionDesignStepEight.labelFunType')"
          >
            <el-select
              v-model="menuParams.function.F_Type"
              :placeholder="$t('workFlow.userButtonSetting.optionSelect')"
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in menuTree"
                :key="item.F_ItemValue"
                :label="item.F_ItemName"
                :value="item.F_ItemValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="hasFormPermission('F_SortCode')">
          <el-form-item
            prop="F_SortCode"
            :label="$t('workFlow.categoryList.labelSort')"
          >
            <el-input
              :placeholder="$t('enterSortNumber')"
              size="small"
              type="number"
              v-model="menuParams.function.F_SortCode"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="hasFormPermission('F_Url')">
          <el-form-item prop="F_Url" :label="$t('functionPath')">
            <el-input
              :placeholder="$t('enterFunctionAddress')"
              size="small"
              v-model="menuParams.function.F_Url"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import SelectIcon from "./Icon.vue";
import { getAppFunc, getDictCateByCode } from "@/api/language/dictionary";
import {
  validateLength,
  validateMobSort,
} from "@/api/organization/validateFunc";
import authorizeMixin from "@/mixins/authorize";
import { formValidateNotice } from "@/util/util";
export default {
  mixins: [authorizeMixin],
  components: {
    SelectIcon,
  },
  props: {
    menuParams: {
      type: Object,
    },
  },
  data() {
    return {
      menuTree: [],
      rules: {
        F_Name: [
          {
            required: true,
            message: this.$t("enterFunctionName"),
            trigger: "blur",
          },
          { validator: validateLength, trigger: "change" },
        ],
        F_Url: [
          {
            required: true,
            message: this.$t("enterFunctionAddress"),
            trigger: "blur",
          },
          { validator: validateLength, trigger: "change" },
        ],
        F_Type: [
          {
            required: true,
            message: this.$t("selectFunctionCategory"),
            trigger: "change",
          },
        ],
        F_SortCode: [{ validator: validateMobSort, trigger: "change" }],
      },
    };
  },
  async created() {
    await this.getAppFunc("function");
  },
  methods: {
    //获取菜单树
    async getAppFunc(itemCode) {
      let res = await getAppFunc(itemCode);
      if (res && res.data.success) {
        this.menuTree = res.data.data;
      }
    },
    showMessage(type, status) {
      let msg =
        type == "add"
          ? status == "ok"
            ? this.$t("addedMobileMenuSuccessfully")
            : this.$t("failedToAddMobileMenu")
          : status == "ok"
          ? this.$t("modifiedMobileMenuSuccessfully")
          : this.$t("failedToModifyMobileMenu");
      this.$notify({
        title: this.$t("deletePrompt.successTitle"),
        message: msg,
        type: status == "ok" ? "success" : "error",
      });
    },
    async validateForm() {
      let validate = await this.$refs["elForm"].validate();
      return validate;
    },
  },
};
</script>