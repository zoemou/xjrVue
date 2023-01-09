<template>
  <!-- 查看角色信息表格 -->
  <div>
    <avue-crud :data="postJsonList" :option="optionRole" :table-loading="tableLoading">
      <template slot-scope="scope" slot="menu">
        <el-button
          type="primary"
          size="mini"
          @click="edit(scope.row, scope.index)"
          v-if="hasButtonPermission('addrole')"
          >{{$t('orgDepartManagement.addModal.roleOfInformation.addPeopleBtn')}}</el-button
        >
      </template>
    </avue-crud>
    <el-dialog v-dialogDrag
      :title="$t('orgDepartManagement.addModal.roleOfInformation.addPeopleBtn')"
      :append-to-body="true"
      :visible.sync="memberDialogVisible"
      :close-on-click-modal="false"
      width="60%"
      style="padding: 10px 20px;"
    >
      <SelectUser v-if='memberDialogVisible' ref="selectUser" :selectedList="selectedList" :parentCompany="{'F_CompanyId':id}" :sourceName="'RoleOfInformation'"></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button size="mini" type="primary" @click="confirmMemberDialog()" :loading="flagUser"
          >{{flagUser?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllSpecialPostList,
  getDepartmentsSpecialPostUser,
} from "@/api/organization/department";
import { getCompanySpecialPostUser } from "@/api/organization/company";
import SelectUser from "@/components/organization/SelectUser";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
export default {
  name: "RoleOfInformation",
  mixins: [authorizeMixin],
  props: {
    spPostJson: {},
    id: { type: String },
    roleSpecialPostId: { type: String },
    roleType: { type: Number },
  },
  components: {
    SelectUser,
  },
  data() {
    return {
      modulePermissionList: [],
      flagUser: false,
      tableLoading:false,
      memberDialogVisible: false,
      postJsonList: [],
      selectedList: [],
      editIndex: -1,
      optionRole: {
        title:this.$t('orgDepartManagement.addModal.roleOfInformation.roleInfor'),
        page: false,
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        cellBtn: false,
        delBtn: false,
        editBtn: false,
		maxHeight: 380,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label:this.$t('orgDepartManagement.addModal.roleOfInformation.roleName'),
            prop: "F_Name",
          },
          {
            label:this.$t('orgDepartManagement.addModal.roleOfInformation.Counterpart'),
            prop: "memberNames",
          },
        ],
      },
    };
  },
  created() {

  },
  async mounted() {
    this.tableLoading = true;
    if (!this.roleSpecialPostId) {
      let res = await getAllSpecialPostList(this.roleType);
      if(res.data.success){
         this.formdateData(res.data.data);
      }
    } else {
      if (this.roleType == 2) {
        let res = await getDepartmentsSpecialPostUser(this.roleSpecialPostId);
        if(res.data.success){
         this.formdateData(res.data.data);
        }
      } else {
        let res = await getCompanySpecialPostUser(this.roleSpecialPostId);
        if(res.data.success){
         this.formdateData(res.data.data);
        }
      }
    }
    this.tableLoading = false;
  },
  methods: {
    formdateData(data) {
      let tempArr = [];
      data.forEach((element) => {
        let memberIdsList = [];
        let memberNamesList = [];
        if (element.children && element.children.length > 0) {
          element.children.forEach((childrenEle) => {
            memberIdsList.push(childrenEle.F_UserId);
            memberNamesList.push(childrenEle.F_RealName);
          });
        }
        tempArr.push({
          F_Id: element.F_Id,
          F_Name: element.F_Name,
          F_children:element.children,
          memberIdsList,
          memberNames: memberNamesList.join(","),
        });
      });
      this.postJsonList = tempArr;
    },
    edit(row, index) {
       let selectedList = [];
      if (row.F_children && row.F_children.length > 0) {
        row.F_children.forEach((childrenEle) => {
          selectedList.push({
            F_UserId: childrenEle.F_UserId,
            F_DepartmentName: childrenEle.F_DepartmentName,
            F_CompanyName: childrenEle.F_CompanyName,
            F_RealName: childrenEle.F_RealName,
          });
        });
      }
      this.selectedList = selectedList;
      this.editIndex = index;
      this.memberDialogVisible = true;
    },
    getSelectedList() {
      let tempArr = [];
      this.postJsonList.forEach((element) => {
        tempArr[element.F_Id] = element.memberIdsList;
      });
      return tempArr;
    },
    cancelMemberDialog() {
      this.memberDialogVisible = false;
      this.editIndex = -1;
      this.flagUser = false;
    },
    confirmMemberDialog() {
      let data = this.$refs.selectUser.pushParentData();
      let memberIdsList = [];
      let memberNamesList = [];
      this.flagUser = true;
      if (data.length > 0) {
        data.forEach((ele) => {
          memberIdsList.push(ele.F_UserId);
          memberNamesList.push(ele.F_RealName);
       });
      }
      this.postJsonList[this.editIndex].F_children=data;
      this.postJsonList[this.editIndex].memberIdsList = memberIdsList;
      this.postJsonList[this.editIndex].memberNames = memberNamesList.join(",");
      this.cancelMemberDialog();
    }
  },
};
</script>

<style scoped>
.avue-crud__menu {
  height: 0;
}
@media screen and (max-width: 1370px) {
	   div /deep/.el-dialog{
		margin-top:8vh!important;
	   }
	     
	} 	
</style>
