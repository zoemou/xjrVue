<template>
  <div class="main-container">
    <MainFixed :title="$t('selectUser.companyDepart')" class="left-box">
      <div slot="list">
        <!-- <el-tree
          :data="companiesTree"
          :props="defaultProps"
          ref="cTree"
          :default-expand-all="true"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree> -->
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          ref="cTree"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </MainFixed>
    <MainFixed :title="$t('selectUser.selectPersonnel')" class="content-box">
      <div slot="list" style="height: 100%;">
        <div class="search-box">
          <div>
            <el-input
            v-model="keyword"
            suffix-icon="el-icon-search"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            @blur="searchUser"
            style="margin-right:5px"
          ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchUser"
            >
              {{$t('searchModule.searchBtn')}}
            </el-button>
          </div>
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
  getCompanyAllUsers,
  getLowerDepartment
} from "@/api/organization/department";
import { getFirstCompany, getLowerCompanies,getCompanyInfo } from "@/api/organization/company";
import { deepClone } from "@/util/util";
export default {
  components: { MainFixed, List, Selected },
  props: {
    selectedList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabledUserIds: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isSingle: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
	  parentCompany: {
      type: Object
    },
    parentIdList: {
      type: Array,
      default:()=>{
        return []
      }
    },
    sourceName: {
      type:String
    }
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
      isGetFirstCompany:false,
      defaultProps: {
        children: "children",
        label: "F_FullName",
        isLeaf: "leaf"
      },
      itemKeys: [
        {
          label:this.$t('selectUser.labelAccount'),
          key: "F_Account"
        },
        {
          label:this.$t('selectUser.labelName'),
          key: "F_RealName"
        }
      ]
    };
  },
  mounted() {
    this.selectedUser = deepClone(this.selectedList);
  },
  watch: {
    sourceName:{
      handler: function (curVal) {
        this.isGetFirstCompany = curVal === 'CompanyFormDialog' || curVal === 'RoleOfInformation'
      },
      immediate:true
    }
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
        { label:this.$t('selectUser.labelName'), value: item.F_RealName || "" }
      ];
      return infoList;
    },
    async loadNode(node, resolve) {
      try {
        if (this.isGetFirstCompany) {
          let id='';
          if(this.parentCompany){
            if(this.parentCompany.F_CompanyId===''&&this.parentCompany.F_ParentId!==''){
              id=this.parentCompany.F_ParentId
            }else if(this.parentCompany.F_CompanyId!==''){
              id=this.parentCompany.F_CompanyId
            } else {
              return
            }
          }
          let res = await getFirstCompany(id);
          if (res.data.success) {
            this.isGetFirstCompany = false
            this.companiesTree = [res.data.data]
          }
        } else {
          if (this.sourceName === 'DepartmentFormDialog' || this.sourceName === 'DepartmentManagement' || this.sourceName === 'PostManagement') {
            if (!node.data.F_CompanyId) {
              let res = await getCompanyInfo(this.parentCompany.F_CompanyId)
              if (res.data.success) {
                const companyInfo = res.data.data
                companyInfo.F_FullName = companyInfo.fullName
                companyInfo.F_CompanyId = companyInfo.companyId
                this.companiesTree = [companyInfo]
              }
            } else {
              const id = node.data.F_DepartmentId || 0
              let res = await getLowerDepartment(node.data.F_CompanyId, id)
              resolve(res.data.data)
            }            
          } else { // 展示所有公司所有部门
            const companyId = node.data.F_CompanyId || '0'
            if (companyId === '0') {
              let res = await getLowerCompanies(companyId);
              if (res.data.success) {
                this.companiesTree = res.data.data
              }
            } else {
              const departmentId = node.data.F_DepartmentId || '0'
              if (node.data.unGetLowerCompanies) {
                let res = await getLowerDepartment(companyId, departmentId)
                if (res.data.success) {
                  res.data.data.map(item => {
                    item['unGetLowerCompanies'] = true
                  })
                }
                resolve(res.data.data)
              } else {
                let [res1, res2] = await Promise.all([getLowerDepartment(companyId, departmentId), getLowerCompanies(companyId)])
                let departmentsData = []
                let companiesData = []
                let resolveData = []
                if (res1.data.success) {
                  res1.data.data.map(item => {
                    item['unGetLowerCompanies'] = true
                  })
                  departmentsData = res1.data.data
                }
                if (res2.data.success) {
                  if (this.sourceName === 'CompanyFormDialog') { //公司负责人不展示同级和下级
                    res2.data.data.map(item => {
                      if (this.parentCompany.F_CompanyId === item.F_CompanyId) {
                        item['unGetLowerCompanies'] = true
                        companiesData.push(item)
                      }
                      if (this.parentIdList.indexOf(item.F_CompanyId) !== -1) {
                        companiesData.push(item)
                      }
                    })
                  } else {
                    companiesData = res2.data.data
                  }
                }
                let hasDepartmentData = !!departmentsData.length
                let hasCompaniesData= !!companiesData.length
                if (hasDepartmentData && hasCompaniesData) {
                  resolveData = [...departmentsData,...companiesData]
                } else if (!hasDepartmentData && hasCompaniesData) {
                  resolveData = companiesData
                } else if (hasDepartmentData && !hasCompaniesData) {
                  resolveData = departmentsData
                }
                resolve(resolveData) 
              }
            }
          }
        }
      } catch (error) {}
    },
    handleNodeClick(data, node, self) {
      if (!data.F_DepartmentId) {
        getCompanyAllUsers(data.F_CompanyId).then(res => {
          console.log('公司全部成员',res);
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
      }
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
    //模糊搜索
    searchUser() {
		this.userList = [...this.userListCopy];
      if (this.keyword) {
        this.userList = this.userList.filter(item => {
          return (
            item.F_RealName&&item.F_RealName.indexOf(this.keyword)>=0 || item.F_Account&&item.F_Account.indexOf(this.keyword)>=0
          );
        });
      }
    },
    getSelectUser(index) {
      if (this.isSingle && this.selectedUser.length > 0) {
        this.$message(this.$t('selectUser.hintOnlyOne'));
      } else {
        this.userList[index].selected = !this.userList[index].selected;
        if (this.userList[index].selected) {
          this.selectedUser.push(this.userList[index]);
        } else {
          let delUserId = this.userList[index].F_UserId;
          this.selectedUser = this.selectedUser.filter(ele => {
            return ele.F_UserId != delUserId;
          });
        }
      }
    },
    deleteUser({ item, index }) {
      this.selectedUser.splice(index, 1);
      this.userList.forEach(e => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
/* .main-container {
  min-height: 500px;
} */
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
  .left-box,
  .content-box {
    height: 420px;
  }
}
::v-deep .el-tree-node>.el-tree-node__children{
	overflow: visible;
}
</style>
