<template>
  <div @click="addMember">
    <el-input
      v-model="selectUser"
      :disabled="disabled"
      :placeholder="placeholder"
      suffix-icon="el-icon-setting"
    ></el-input>
    <el-dialog v-dialogDrag
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="80%"
      :title="$t('selectUser.selectPersonnel')"
    >
      <SelectUser
        ref="addPesonelRef"
        :selectedList="selectedList"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="cancelDialog()"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button size="mini" type="primary" @click="confirmDialog()"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/organization/SelectUser";
import { getMultiMaintainerUser } from "@/api/organization/user.js";
export default {
  components: {
    SelectUser,
  },
  props: {
    value:{
      type: String,
      default: "",
    },
    userIds: {
      type: String,
      default: "",
    },
    disabled:{
      type:Boolean,
      default:false
    },
    placeholder:{
      type:String,
      default:'请选择人员'
    }
  },
  watch: {
    userIds(newValue) {
      this.initUserList();
    }
  },
  data() {
    return {
      user: "",
      dialogVisible: false,
      selectUser: "",
      selectedList: [],
    };
  },
  mounted() {
   this.initUserList();
  },
  methods: {
    initUserList(){
      let userIds  = "";
      if(this.userIds){
        userIds = this.userIds;
      }else if(this.value){
          userIds = this.value;
      }
      if (userIds) {
        getMultiMaintainerUser(userIds).then((res) => {
          let userNameArr = [];
          if (res.data.data.length > 0) {
            let userInfo = [];
            res.data.data.forEach((el) => {
              userNameArr.push(el.UserInfo.F_RealName);
              this.selectedList.push(el.UserInfo);
            });
          }
          this.user = userNameArr.join(",");
          this.selectUser = this.user;
        });
      } else {
        this.selectUser = this.user;
      }
    },
    addMember() {
      if(!this.disabled){
        this.dialogVisible = true;
      }
    },
    cancelDialog() {
      this.dialogVisible = false;
    },
    confirmDialog() {
      var obj = this.$refs.addPesonelRef.pushParentData();
      const userId = [];
      this.selectUser = "";
      obj.forEach((e, i) => {
        this.selectUser +=
          i < obj.length - 1 ? e.F_RealName + "," : e.F_RealName;
        userId.push(e.F_UserId);
      });
      this.$emit("onInput", this.selectUser);
      this.$emit("input", userId.join(","));
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped></style>
