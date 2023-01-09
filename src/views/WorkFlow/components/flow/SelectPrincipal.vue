<template>
  <elDialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :title="$t('workFlow.WFDelegate.titleAddDelegate')"
    width="60%"
    :close-on-click-modal="false"
    :fullscreen="false"
    :append-to-body="true"
    @close="closePrincipal"
    :destroy-on-close="true"
  >
    <div class="main-container" v-if="dialogVisible">
      <div class="left-box">
        <el-tree
          :data="treeList"
          :props="defaultProps"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </div>

      <div class="content-box">
        <div class="search-box">
          <el-button size="small" @click="selectedBox = true"
            >{{$t('selectUser.selectedUser')}}</el-button
          >
          <Selected
            v-if="selectedBox"
            :list="selectedUser"
            :itemKeys="itemKeys"
            @closed="selectedBox = false"
            @deleteItem="deleteUser"
          ></Selected>
        </div>
        <List
          :list="userList"
          type="user"
          @clickSelected="getSelectUser"
        ></List>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closePrincipal">{{$t('buttonModule.modalCancelBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="confirm">{{$t('buttonModule.modalSureBtn')}}</el-button>
    </span>
  </elDialog>
</template>

<script>
import List from "@/components/organization/components/List";
import Selected from "@/components/organization/components/Selected";
import {
  getDepartmentUser,getLowerDepartment
} from "@/api/organization/department";
import { getCompaniesTree } from "@/api/organization/user";
import { getCompanyInfo } from "@/api/organization/company";
import { deepClone } from '@/utils';
export default {
  components: {
    List,
    Selected
  },
  props: {
    selectedList: {
      type: Array,
      default: ()=>{
        return []
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      treeList: [],
      defaultProps: {
        children: "children",
        label: "F_FullName",
        isLeaf: "leaf"
      },
      itemKeys: [
        {
          label: "账户",
          key: "F_Account"
        },
        {
          label: "姓名",
          key: "F_RealName"
        }
      ],
      userList: [],
      selectedUser: [],
      selectedBox: false
    };
  },
  async mounted() {
    this.selectedUser = deepClone(this.selectedList);
  //   let userInfo = localStorage.getItem("avue-userInfo")
  //     ? JSON.parse(localStorage.getItem("avue-userInfo")).content
  //     : {};
	// let companyId ='';
	// let name='';
	// if(userInfo["F_Company"]){
	// 	companyId = userInfo["F_Company"].F_CompanyId;
	// 	name=userInfo["F_Company"].F_FullName
	// }
    
    // let tempData = [
    //   {
    //     F_FullName:name,
    //     id:companyId,
    //     children:[]
    //   }
    // ];
    // if (companyId) {
    //   let res = await getCompaniesTree({companyId:companyId});
    //   if (res.data.success) {
    //     tempData[0].children= res.data.data;
    //     this.treeList = tempData;       
    //   }
    // }
	this.dialogVisible = true;
  },
  methods: {
    confirm() {
      this.$emit('changePrincipal',this.selectedUser);
      this.dialogVisible = false;
    },
    closePrincipal(){
      this.selectedUser = [];
      this.$emit('closePrincipal');
      this.dialogVisible = false;
    },
    async loadNode(node, resolve) {
      try {
        let userInfo = localStorage.getItem("avue-userInfo")
            ? JSON.parse(localStorage.getItem("avue-userInfo")).content
            : {};
        let companyId ='';
        let name='';
        if(userInfo["F_Company"]){
          companyId = userInfo["F_Company"].F_CompanyId;
          name=userInfo["F_Company"].F_FullName
        }
        if (!companyId) return
        if (!node.data.F_CompanyId) {
          let res = await getCompanyInfo(companyId)
          if (res.data.success) {
            const companyInfo = res.data.data
            companyInfo.F_FullName = companyInfo.fullName
            companyInfo.F_CompanyId = companyInfo.companyId
            this.treeList = [companyInfo]
          }
        } else {
          const id = node.data.F_DepartmentId || 0
          let res = await getLowerDepartment(node.data.F_CompanyId, id)
          resolve(res.data.data)
        }      
    
      } catch (error) {}
    },
    handleNodeClick(data, node, self) {
      if (data.F_DepartmentId) {
        this.getUser(data);
      }
    },
    getUser(obj) {
      getDepartmentUser(obj.F_DepartmentId, {}).then(res => {
        let selectedUserIds = this.selectedUser.map(ele2 => {
          return ele2.F_UserId;
        });
        if (res.data.success) {
          let data = res.data.data.map(ele => {
            ele.selected = false;
            if (selectedUserIds.includes(ele.F_UserId)) {
              ele.selected = true;
            } else {
              ele.selected = false;
            }
            return ele;
          });
          this.userList = data;
        }
      });
    },
    getSelectUser(index) {
      this.userList[index].selected = !this.userList[index].selected;
      if (this.userList[index].selected) {
        this.selectedUser.push(this.userList[index]);
      } else {
        let delUserId = this.userList[index].F_UserId;
        this.selectedUser = this.selectedUser.filter(ele => {
          return ele.F_UserId != delUserId;
        });
      }
    },
    deleteUser({ item, index }) {
      this.selectedUser.splice(index, 1);
      this.userList.forEach(e => {
        if (e.F_UserId == item.F_UserId) {
          e.selected = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
}
.left-box,
.content-box {
  height: 400px;
  overflow: scroll;
}
.left-box {
  width: 210px;
  margin-right: 10px;
}
.content-box {
  width: calc(100% - 210px);
  position: relative;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
}
.search-box .el-input {
  width: 200px;
  margin-right: 20px;
}

@media screen and (max-width: 1370px) {
  .left-box,
  .content-box {
    height: 420px;
  }
}
</style>
