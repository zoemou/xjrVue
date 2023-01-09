<template>
  <div class="main-container">
    <MainFixed :title="$t('selectUser.companyDepart')" class="left-box">
      <div slot="list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="keyId"
          ref="cTree"
          :default-expand-all="true"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </MainFixed>
    <MainFixed :title="$t('selectUser.selectPersonnel')" class="content-box">
      <div slot="list" style="height: 100%;">
        <div class="search-box">
          <el-input
            v-model="keyword"
            suffix-icon="el-icon-search"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            @blur="searchUser"
          ></el-input>
          <div>
            <el-button size="small" @click="selectedBox = true"
              >{{$t('selectUser.selectedUser')}}</el-button
            >
          </div>
        </div>
        <List
          :list="userList"
          type="user"
          @clickSelected="getSelectUser"
        ></List>
        <Selected
          v-if="selectedBox"
          :list="selectedUser"
          :itemKeys="itemKeys"
          @closed="selectedBox = false"
          @deleteItem="deleteUser"
        ></Selected>
      </div>
    </MainFixed>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import List from "@/components/organization/components/List";
import Selected from "@/components/organization/components/Selected";
import {
  getDepartmentUser,
} from "@/api/organization/department";
import { getCompaniesDepartments } from "@/api/organization/user";
import { deepClone } from "@/util/util";
export default {
  components: { MainFixed, List, Selected },
  props: {
    companyId:{
      type:'',
      default:()=>{
        return ''
      }
    },
    selectedList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabledUserIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      keyword: "",
      selectedUserIds: [],
      userList: [],
      userListCopy: [],
      selectedBox: false,
      selectedUser: [],
      companiesTree: [],
      F_CompanyId: "",
      defaultProps: {
        children: "children",
        label: "F_FullName",
        isLeaf: "leaf",
      },
      itemKeys: [
        {
          label:this.$t('selectUser.labelAccount'),
          key: "F_Account",
        },
        {
          label:this.$t('selectUser.labelName'),
          key: "F_RealName",
        },
      ],
    };
  },
  mounted() {
    this.getCompaniesTree();
    this.selectedUser = deepClone(this.selectedList);
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
        { label:this.$t('selectUser.labelAccount'), value: item.F_Account || "" },
        { label:this.$t('selectUser.labelName'), value: item.F_RealName || "" },
      ];
      return infoList;
    },
    async getCompaniesTree() {
      let res = await getCompaniesDepartments(this.companyId);
      if (res.data.success) {
        this.companiesTree = res.data.data;
      }
      this.setCompanyChild(this.companiesTree, "F_DepartmentId");
    },
    loadNode(node, resolve) {
      if (node.data.children && node.data.children.length > 0) {
        return resolve(node.data.children);
      } else {
        return resolve([]);
      }
    },
    handleNodeClick(data, node, self) {
      if (data.hasChild) {
      }
      if (data.F_DepartmentId) {
        this.getUser(data);
      }
    },
    setCompanyChild(obj, name) {
      for (var i = 0; i < obj.length; i++) {
        obj[i].keyId = obj[i][name] || "";
        obj[i].hasChild = true;
        if (obj[i].children && obj[i].children.length > 0) {
          this.setCompanyChild(obj[i].children, name);
        } else {
          obj[i].leaf = true;
        }
      }
    },
    getUser(obj) {
      getDepartmentUser(obj.F_DepartmentId, {}).then((res) => {
        let selectedUserIds = this.selectedUser.map((ele2) => {
          return ele2.F_UserId;
        });
        if (res.data.success) {
          let data = res.data.data.map((ele) => {
            ele.selected = false;
            if (selectedUserIds.includes(ele.F_UserId)) {
              ele.selected = true;
            } else {
              ele.selected = false;
            }
            if (this.disabledUserIds.includes(ele.F_UserId)) {
              ele.disabled = true;
            } else {
              ele.disabled = false;
            }

            return ele;
          });
          this.userList = data;
          this.userListCopy = data;
        }
      });
    },
    searchUser() {
      if (this.keyword) {
        this.userList = this.userList.filter((item) => {
          return (
            item.F_RealName == this.keyword || item.F_Account == this.keyword
          );
        });
      } else {
        this.userList = [...this.userListCopy];
      }
    },
    getSelectUser(index) {
      this.userList[index].selected = !this.userList[index].selected;
      if (this.userList[index].selected) {
        this.selectedUser.push(this.userList[index]);
      } else {
        let delUserId = this.userList[index].F_UserId;
        this.selectedUser = this.selectedUser.filter((ele) => {
          return ele.F_UserId != delUserId;
        });
      }
    },
    deleteUser({ item, index }) {
      this.selectedUser.splice(index, 1);
      this.userList.forEach((e) => {
        if (e.F_UserId == item.F_UserId) {
          e.selected = false;
        }
      });
    },
    getSelectUserList() {
      return this.selectedUser;
    },
    pushParentData() {
      return this.selectedUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  /* min-height: 500px; */
}
.left-box {
  margin-right: 10px;
  height: 500px;
}
.content-box {
  width: calc(100% - 210px);
  height: 500px;
  position: relative;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.search-box .el-input {
  width: 200px;
  margin-right: 20px;
}

@media screen and (max-width: 1370px) {
	 .left-box,.content-box {
	   height: 420px;
	 }  
	} 	
</style>
