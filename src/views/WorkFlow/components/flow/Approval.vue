<template>
  <div>
    <el-form-item :label="$t('workFlow.Approval.labelApprovalResult')">
      <el-radio-group v-model="formData.btnValue">
        <el-radio v-for="(val,key) in processInfo.btnInfo" :key="key"
        :label="key"
          >{{$t(val)}}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="formData.btnValue == 'reject_'" :label="$t('workFlow.Approval.labelOverruled')">
      <el-select
        :placeholder="$t('workFlow.Approval.placeholderOverruled')"
        v-model="formData.rejectNodeId"
        style="width: 100%;"
      >
        <el-option
          v-for="(item, index) in processInfo.rejectnode"
          :key="index"
          :label="item.activityName || '[' + getNodeTypeName(item.activityType) + ']'"
          :value="item.activitiId"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('workFlow.Approval.labelApprovalCon')">
      <el-input type="textarea" v-model="formData.message" rows="8"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    processInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
  },
  methods: {
        getNodeTypeName(type) {
      let typeName = "其他节点";
      switch (type) {
        case "startEvent":
          typeName = "开始节点";
          break;
        case "userTask":
          typeName = "用户节点";
          break;
        case "scriptTask":
          typeName = "脚本节点";
          break;
        case "endEvent":
          typeName = "结束节点";
          break;
        default:
          break;
      }
      return typeName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
