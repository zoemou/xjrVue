<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="$t('workFlow.User.tabApprover')" name="approver" class="subtract-box">
      <List
        v-if="activeName == 'approver'"
        :list="allApproverList"
        type="user"
        @clickSelected="changeApproverList"
      >
      </List>
    </el-tab-pane>
    <el-tab-pane :label="$t('userTab')" name="user">
      <SelectUser
        v-if="showUserTab"
        ref="SelectUser"
        :disabledUserIds="disabledUserIds"
        :selectedList="selectedUserList"
      ></SelectUser>
    </el-tab-pane>
    <el-tab-pane :label="$t('selectUser.selectedUser')" name="selected" class="subtract-box">
      <List
        v-if="activeName == 'selected'"
        :list="selectedStaffList"
        type="user"
        @clickSelected="changeSelectedStaffList"
      >
      </List>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Card from "@/components/organization/components/Card";
import List from "@/components/organization/components/List";
import SelectUser from "@/components/organization/SelectUser";
import { getSignatureUsers, postSignature } from "@/api/workFlow/WFProcess"; //API接口
import { deepClone } from "@/util/util";
export default {
  name: "SubTract",
  props: {
    processInstanceId: {
      type: String,
      default: ""
    },
    taskId: {
      type: String,
      default: ""
    }
  },
  components: {
    Card,
    List,
    SelectUser
  },
  data() {
    return {
      activeName: "approver",
      allApproverList: [], //所有审批人
      selectedUserList: [], //已选用户人员
      selectedStaffList: [], //已选人员
      disabledUserIds: [],
      showUserTab: false,
      oldTabName: "approver",
      newTabName: "approver",
      checkList: []
    };
  },
  created() {
    let userInfo = window.localStorage.getItem("avue-userInfo")
      ? JSON.parse(window.localStorage.getItem("avue-userInfo"))
      : {};
    this.disabledUserIds = [userInfo?.content?.F_UserId];
    getSignatureUsers(this.processInstanceId).then(res => {
      let allApproverList = [];

      if (res.data.success) {
        allApproverList = res.data.data;

        let selectList = [];
        let selectIds = allApproverList.map(ele => {
          return ele.F_UserId;
        });
        selectList = allApproverList.map(ele => {
          ele.selected = false;
          if (selectIds.includes(ele.F_UserId)) {
            ele.selected = true;
          }
          ele.disabled = false;
          if (this.disabledUserIds.includes(ele.F_UserId)) {
            ele.disabled = true;
          }
          return ele;
        });
        this.allApproverList = deepClone(selectList);
        this.selectedStaffList = deepClone(selectList);
        this.selectedUserList = deepClone(selectList);
      }
    });
  },
  methods: {
    getType(item) {
      if (item.F_Gender == 1) {
        return "femaleUser";
      } else {
        return "maleUser";
      }
    },
    getInfoList(item) {
      let infoList = [];
      infoList = [
        { label: "账户", value: item.F_Account || "" },
        { label: "姓名", value: item.F_RealName || "" }
      ];
      return infoList;
    },
    handleClick(tab) {
      this.oldTabName = this.newTabName;
      this.newTabName = tab.name;
      this.changeCheckedList();
      if (this.newTabName == "user") {
        this.showUserTab = true;
      }
    },
    changeCheckedList() {
      if (this.oldTabName == "user") {
        let selectList = this.$refs.SelectUser.pushParentData();
        this.selectedUserList = deepClone(selectList);
        this.selectedStaffList = deepClone(selectList);
        this.showUserTab = false;
        let slectedIds = selectList.map(ele => {
          return ele.F_UserId;
        });
        this.allApproverList = this.allApproverList.map(ele => {
          if (slectedIds.includes(ele.F_UserId)) {
            ele.selected = true;
          } else {
            ele.selected = false;
          }
          return ele;
        });
      }
      if (this.oldTabName == "approver") {
        let appSelectList = [];
        let selectIds = [];
        let unSelectIds = [];
        this.allApproverList.forEach(ele => {
          if (ele.selected) {
            appSelectList.push(ele);
            selectIds.push(ele.F_UserId);
          } else {
            unSelectIds.push(ele.F_UserId);
          }
        });
        let selectList = [];
        this.selectedStaffList.forEach(ele => {
          if(ele.selected){
            if (unSelectIds.includes(ele.F_UserId)) {
            ele.selected = false;
          }
          if (selectIds.includes(ele.F_UserId)) {
            ele.selected = true;
          }
          selectList.push(ele);
          }
        });
        appSelectList.forEach(ele => {
          let isSlectedIds = selectList.filter(s => {
            return s.F_UserId == ele.F_UserId;
          });
          if (isSlectedIds.length == 0) {
            selectList.push(ele);
          }
        });
        this.selectedUserList = deepClone(selectList);
        this.selectedStaffList = deepClone(selectList);
        this.showUserTab = false;
      }
      if (this.oldTabName == "selected") {
        let selectList = this.selectedStaffList.filter(ele => {
          return ele.selected;
        });
        let slectedIds = selectList.map(ele => {
          return ele.F_UserId;
        });
        this.allApproverList = this.allApproverList.map(ele => {
          if (slectedIds.includes(ele.F_UserId)) {
            ele.selected = true;
          } else {
            ele.selected = false;
          }
          return ele;
        });
        this.selectedUserList = deepClone(selectList);
        this.selectedStaffList = deepClone(selectList);
        this.showUserTab = false;
        this.getSelectList();
      }
    },
    getSelectList() {
      if(this.newTabName=='approver'){
        if (this.oldTabName == this.newTabName) {
        this.checkList = this.allApproverList.filter(ele => {
          return ele.selected;
        });
        }else{
          this.checkList = this.selectedStaffList.filter(ele => {
          return ele.selected;
        });
        }
      }else if(this.newTabName=='user'){
         this.selectedUserList = this.$refs.SelectUser.pushParentData();
         this.checkList = this.selectedUserList.filter(ele => {
          return ele.selected;
        });
      }else{
        this.checkList = this.selectedStaffList.filter(ele => {
          return ele.selected;
        });
      }
    },
    changeApproverList(index) {
      this.allApproverList[index].selected = !this.allApproverList[index]
        .selected;
      let userId = this.allApproverList[index].F_UserId;
      let selected = this.allApproverList[index].selected;
      this.selectedStaffList = this.selectedStaffList.map(ele => {
        if (ele.F_UserId == userId) {
          ele.selected = selected;
        }
        return ele;
      });
    },
    changeSelectedStaffList(index) {
      this.selectedStaffList[index].selected = !this.selectedStaffList[index]
        .selected;
      let userId = this.selectedStaffList[index].F_UserId;
      let selected = this.selectedStaffList[index].selected;
      this.allApproverList = this.allApproverList.map(ele => {
        if (ele.F_UserId == userId) {
          ele.selected = selected;
        }
        return ele;
      });
    },
    // 更新审批人
    updataSignature(callback) {
      this.getSelectList();
      var param = {
        taskId: this.taskId,
        userListStr: JSON.stringify(this.checkList)
      }; // 传参
      postSignature(param).then(result => {
        var res = result.data;
        if (callback) callback(res); // 回调
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.subtract-box {
  min-height: 500px;
}
</style>
