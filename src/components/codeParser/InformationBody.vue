<template>
  <el-select v-model="infoValue" placeholder="请选择" :disabled="infoDisabled">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { getMultiMaintainerUser } from "@/api/organization/user.js";
import { getDepartmentInfo } from "@/api/organization/department.js";
import { getCompanyInfo } from "@/api/organization/company.js";

export default {
  props: {
    value: {
      type: String
    },
    infoType: {
      type: String,
      default: "company"
    },
    placeholder: {
      type: String,
      default: "请选择信息体"
    },
    whetherToRebindSecondaryEditing: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: true
    },
    operationVal: {
      type: String,
      default: "add"
    },
    isEdit: {
      type: Number,
      default: 1//// 1 新增 2 查看 3 编辑
    },
  },
  data() {
    return {
      infoValue: "",
      options: [],
      isChangeValue: false,
      infoDisabled: false
    };
  },
  watch: {
    infoValue(newValue, oldValue) {
      this.$emit("input", newValue);
    },
    infoType(newValue, oldValue) {
      this.initData();
    },
    value(newValue) {
      this.initData();
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.options = [];
      if (this.operationVal == "add") {
        this.infoDisabled = this.disabled;
        this.getDefaultValueList();
      } else if (this.operationVal == "look"||this.operationVal == "view") {
        this.infoDisabled = true;
        if (this.value) {
          this.getInfoList();
        }
      } else if (this.operationVal == "edit") {
        if (
          this.whetherToRebindSecondaryEditing &&
          this.whetherToRebindSecondaryEditing == true
        ) {
          this.infoDisabled = this.disabled;
          this.getDefaultValueList();
        } else {
          this.infoDisabled = true;
          if (this.value) {
            this.getInfoList();
          } else {
            this.getDefaultValueList();
          }
        }
      }
    },
    getDefaultValueList() {
      let userInfo = localStorage.getItem("avue-userInfo")
        ? JSON.parse(localStorage.getItem("avue-userInfo")).content
        : {};
      if (this.infoType == "department") {
        if (userInfo.F_Department && userInfo.F_Department.length > 0) {
          userInfo.F_Department.forEach(item => {
            this.options.push({
              label: item.F_FullName,
              value: item.F_DepartmentId
            });
          });
        }
        this.infoDisabled = false;
        this.infoValue =
          userInfo["F_Department"] && userInfo["F_Department"].length > 0
            ? userInfo["F_Department"][0].F_DepartmentId
            : "";
      } else if (this.infoType == "company") {
        this.options = [
          {
            label: (userInfo["F_Company"]&&userInfo["F_Company"].F_FullName)?userInfo["F_Company"].F_FullName:'',
            value: (userInfo["F_Company"]&&userInfo["F_Company"].F_CompanyId)?userInfo["F_Company"].F_CompanyId:''
          }
        ];
        this.infoValue = (userInfo["F_Company"]&&userInfo["F_Company"].F_CompanyId)?userInfo["F_Company"].F_CompanyId:'';
      } else if (this.infoType == "user") {
        this.options = [
          {
            label: userInfo.F_RealName,
            value: userInfo.F_UserId
          }
        ];
        this.infoValue = userInfo.F_UserId;
      } else if (this.infoType == "date") {
        this.options = [
          {
            label: this.format("yyyy-MM-dd hh:mm:ss"),
            value: this.format("yyyy-MM-dd hh:mm:ss")
          }
        ];
        this.infoValue = this.format("yyyy-MM-dd hh:mm:ss");
      }
    },
    async getInfoList() {
      this.options = [];
      if (this.infoType == "department") {
        let res = await getDepartmentInfo(this.value);
        if (res && res.data && res.data.success && res.data.data) {
          this.options = [
            {
              label: res.data.data.fullName,
              value: res.data.data.departmentId
            }
          ];
        }
        this.infoValue = this.value;
      } else if (this.infoType == "company") {
        let res = await getCompanyInfo(this.value);
        if (res && res.data && res.data.success && res.data.data) {
          this.options = [
            {
              label: res.data.data.fullName,
              value: res.data.data.companyId
            }
          ];
        }
        this.infoValue = this.value;
      } else if (this.infoType == "user") {
        let res = await getMultiMaintainerUser(this.value);
        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.data &&
          res.data.data.length > 0 &&
          res.data.data[0] &&
          res.data.data[0].UserInfo
        ) {
          this.options = [
            {
              label: res.data.data[0].UserInfo["F_RealName"],
              value: res.data.data[0].UserInfo["F_UserId"]
            }
          ];
        }
        this.infoValue = this.value;
      } else if (this.infoType == "date") {
        this.options = [
          {
            label: this.format("yyyy-MM-dd hh:mm:ss"),
            value: this.format("yyyy-MM-dd hh:mm:ss")
          }
        ];
        this.infoValue = this.value;
      }
    },
    format(fmt) {
      var now = new Date();
      var o = {
        "M+": now.getMonth() + 1, //月份
        "d+": now.getDate(), //日
        "h+": now.getHours(), //小时
        "m+": now.getMinutes(), //分
        "s+": now.getSeconds(), //秒
        "q+": Math.floor((now.getMonth() + 3) / 3), //季度
        S: now.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (now.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
