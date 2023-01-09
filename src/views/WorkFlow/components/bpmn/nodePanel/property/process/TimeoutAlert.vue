<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.timeoutToRemind.isOpen">
        <el-radio :label="0">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="1">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="formInfo.timeoutToRemind.isOpen">
      <el-form-item>
        <label>{{ $t("workFlow.Process.timeoutTime") }}</label>
        <el-input
          type="nubmer"
          v-model="formInfo.timeoutToRemind.timeOut"
          :placeholder="$t('workFlow.Process.placeholderTimeoutTime')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.inforInterval") }}</label>
        <el-input
          type="nubmer"
          v-model="formInfo.timeoutToRemind.messageInterval"
          :placeholder="$t('workFlow.Process.placeholderInforInterval')"
        >
        </el-input>
      </el-form-item>
      <!-- <el-form-item>
              <label>消息模板</label>
              <el-select v-model="formInfo.timeoutToRemind.messageTemplate">
                <el-option label="===请选择消息模板===" value=""></el-option>
              </el-select>
            </el-form-item> -->
      <el-form-item>
        <label>{{ $t("workFlow.Process.pushTimes") }}</label>
        <el-input
          type="nubmer"
          v-model.number="formInfo.timeoutToRemind.pushTimes"
          :placeholder="$t('workFlow.Process.placeholderPushTimes')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.appendPusher") }}</label>
        <MessagePusherPeople
          :timeoutToRemind.sync="formInfo.timeoutToRemind"
        ></MessagePusherPeople>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import MessagePusherPeople from "./../personnel/MessagePusherPeople";
export default {
  components: {
    MessagePusherPeople
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
