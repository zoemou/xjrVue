<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <el-tree
          :data="menuTree"
          :props="defaultProps"
          node-key="F_ItemDetailId"
          ref="cTree"
          :default-expand-all="false"
          @node-click="handleNodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ node, data }">
		        <i class="icon-yinzhangrenzheng"></i>
		        <span>{{ data.F_ItemName}}</span>
		 </span>
		</el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle + F_Item.F_ItemName" :paddingLeft="205">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right:5px;"
          ></el-input>
          <el-select
            v-model="searchState"
            :placeholder="$t('workFlow.privateStampInfo.placeholderState')"
            style="width: 200px; margin-right: 5px;"
          >
            <el-option :label="$t('workFlow.privateStampInfo.labelEnable')" value="1" key="1"></el-option>
            <el-option :label="$t('workFlow.privateStampInfo.labelStop')" value="0" key="0"></el-option>
            <el-option :label="$t('workFlow.privateStampInfo.labelAllStatus')" value key></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchMenu"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="cuTable"
          v-if="F_Item.F_ItemName"
          :data="menuTable"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          stripe
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @size-change="sizeChange"
          @row-click="rowClick"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-dialog v-dialogDrag
              :title="diologTitle"
              :append-to-body="true"
              :visible.sync="dialogVisible"
              :close-on-click-modal="false"
              width="40%"
              :before-close="handleClose"
              style="padding: 10px 20px;"
            >
              <AddStamp
                v-if="dialogVisible"
                :formEnCodeList="formEnCodeList"
                :menuForm="menuForm"
                :menuTree="menuTree"
                ref="menuForm"
                :StampId="F_StampId"
              ></AddStamp>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="userFormSubmit('menuForm')"
                  :loading="flagAddStamp"
                  >
                  {{flagAddStamp?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                  </el-button
                >
              </span>
            </el-dialog>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="openForm()"
              v-if="hasButtonPermission('openForm')"
              >{{$t('buttonModule.addBtn')}}</el-button
            >
            <el-button
             
              size="small"
              v-if="hasButtonPermission('startTask')"
              @click="startTask"
              >{{$t('workFlow.privateStampInfo.enableBtn')}}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('showOkDialog')"
              @click="showOkDialog('stopTask', $t('workFlow.privateStampInfo.hintWhetherStop'))"
              >{{$t('workFlow.privateStampInfo.labelStop')}}</el-button
            >
            <el-button
             
              size="small"
              v-if="hasButtonPermission('addMaintainerUser')"
              @click="addMaintainerUser"
              >{{$t('workFlow.publicStampInfo.maintainerUserBtn')}}</el-button
            >
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('editForm')"
              @click="editForm(scope.row, scope.index)"
             
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              v-if="hasButtonPermission('deleteForm')"
              @click="deleteForm(scope.row, scope.index)"
             
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('addUser')"
              @click="addUser(scope.row, scope.index)"
              
              >{{$t('workFlow.publicStampInfo.addMemberBtn')}}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.privateStampInfo.titleInfor')"
      :append-to-body="true"
      :visible.sync="okDialog"
      :close-on-click-modal="false"
      width="30%"
      :before-close="okClose"
    >
      <div>
        <i class="fa fa-question-circle-o"></i>
        {{ okMessage }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okSubmit">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.publicStampInfo.addMemberBtn')"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="memberDialogVisible"
      width="80%"
      :before-close="handleClose"
      style="padding: 10px 20px;"
    >
      <SelectUser
        v-if="memberDialogVisible"
        ref="selectMember"
        :selectedList="selectedMemberUserList"
      ></SelectUser>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button 
        size="mini" 
        type="primary" 
        @click="confirmMemberDialog()"
        :loading="flagSelect"
        >
        {{flagSelect?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.publicStampInfo.maintainerUserBtn')"
      :append-to-body="true"
      :visible.sync="maintainerDialogVisible"
      :close-on-click-modal="false"
      width="80%"
      :before-close="handleClose"
      style="padding: 10px 20px;"
    >
      <SelectUser
        v-if="maintainerDialogVisible"
        ref="selectMaintainer"
        :selectedList="selectedMaintainerUserList"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMaintainerDialog()"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="confirmAddMaintainerDialog()"
          :loading="flagSelectRole"
          >{{flagSelectRole?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import SelectUser from "@/components/organization/SelectUser";
import AddStamp from "./AddStamp.vue";
import { baseUrl } from '@/config/env';
import {
  getStampsList,
  startStamps,
  stopStamps,
  deleteStamps,
  setManagerStampsByID,
  getManagerStampsByID
} from "@/api/workFlow/stamp";
import {
  setMaintainerUser,
  getMaintainerUser,
} from "@/api/organization/user";
import { getDictCateByCode } from "@/api/language/dictionary";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getStore } from "@/util/store";
export default {
  name: "PublicStampInfo",
  mixins: [authorizeMixin,tableOptionMixin,displayColumnsMixin],
  components: { MainContent, MainFixed, AddStamp, SelectUser },
  data() {
	const _this = this;  
    return {
      flagAddStamp: false,
      flagSelect: false,
      flagSelectRole: false,
      fixedTitle:this.$t('workFlow.privateStampInfo.fixedTitle'),
      contentTitle: "公共签章 - ",
      F_Item: {
        F_ItemName: "",
      },
      menuTree: [],
      searchState: "",
      menuTable: [],
      memberDialogVisible: false,
      maintainerDialogVisible: false,
      order: {
        order: "desc",
        prop: "",
      },
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      menuForm: {
        F_StampName: "",
        F_StampType: null,
        F_Password: "",
        F_Sort: "",
        F_File_Type: 1,
        F_File: "",
        F_Description: "",
        F_StampAttributes: 2,
      },
      keyword: null,
      defaultProps: {
        children: "children",
        label: "F_ItemName",
      },
      dialogVisible: false,
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 200,
        border: false,
        page: false,
        index: true,
        indexLabel:this.$t('workFlow.privateStampInfo.tabNum'),
        align: "center",
        menuAlign: "center",
        simplePage: true,
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.tabStampName'),
            prop: "F_StampName",
			minWidth:'95',
			align: 'left',
          },
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.fixedTitle'),
            prop: "F_StampType",
			minWidth:'95',
			align: 'left',
          },
          {
            label:this.$t('workFlow.privateStampInfo.tabImg'),
            prop: "F_File",
			minWidth:'122',
			align: 'left',
            formatter: function (row) {
              return '<img src="' + baseUrl+row.F_File + '" width="100"/>';
            },
          },
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.tabStatus'),
			width:'85',
			align: 'left',
            prop: "F_EnabledMark",
            formatter: function (row) {
              return row.F_EnabledMark === 0 ? _this.$t('buttonModule.deactivateBtn'): _this.$t('custmerForm.tableEnable');
            },
          },
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.tabRemark'),
            prop: "F_Description",
			align: 'left',
          },
        ],
      },
      diologTitle: "",
      F_StampId: "",
      okDialog: false,
      okMessage: "",
      okVal: "",
      selectedMaintainerUserList: [],
      selectedMemberUserList: [],
    };
  },
  mounted() {
    this.getDictCateByCode();
    this.getItemList();	
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.hasButtonPermission('editForm')&&this.openDoubleClickEdit){
        this.editForm(row)
      }
    },
    /* 获取菜单树形数据 */
    getDictCateByCode() {
      getDictCateByCode("StampType").then((res) => {
        this.menuTree = res.data.data;
        //this.handleNodeClick(res.data.data[0])
        this.F_Item = {
          F_ItemValue: "",
          F_ItemName: "所有分类",
        };
      });
    },
    /* 选择树形菜单加载菜单信息 */
    handleNodeClick(data) {
      this.keyword = null;
      this.F_Item = data;
      this.getItemList();
    },
    getItemList() {
      let obj = {
        StampType: this.F_Item.F_ItemValue,
        EnabledMark: this.searchState == "" ? null : this.searchState,
        StampAttributes: 2,
        limit: this.page.currentPage,
        size: this.page.pageSize,
        keyword: this.keyword,
        order: this.order.order,
        orderfield: this.order.prop,
      };
      getStampsList(obj).then((res) => {
        this.menuTable = res.data.data.Rows;
      });
    },
    /* 新增 */
    openForm() {
      this.diologTitle =this.$t('workFlow.privateStampInfo.titleAddStamp');
      this.dialogVisible = true;
      this.F_StampId = "";
      /* this.imgFile='';
            	this.signatureFile='';
            	this.hasimg=false; */
      this.menuForm = {
        F_StampName: "",
        F_StampType: null,
        F_Password: "",
        F_Sort: "",
        F_File_Type: 1,
        F_File: "",
        F_Description: "",
        F_StampAttributes: 2,
      };
    },
    /* fileTypeChange(val){
				if(val==1) this.hasimg=this.imgFile?true:false;
				else this.hasimg=this.signatureFile?true:false;
				this.$refs['menuForm'].validate((valid) => {}) 
			}, */
    /* 提交表单 */
    userFormSubmit(formName) {
      this.flagAddStamp = true;
      let that = this;
      this.$refs[formName].userFormSubmit(function (res) {
		  if(res!==undefined){
			  that.getItemList();
			  that.dialogVisible = false;
		  }       
      }).finally(() => {
        that.flagAddStamp = false;
      });
    },
    /* 取消弹窗 */
    cancelForm() {
      this.dialogVisible = false;
    },
    cancelMemberDialog() {
      this.memberDialogVisible = false;
      this.selectedMemberUserList = [];
    },
    cancelMaintainerDialog() {
      this.maintainerDialogVisible = false;
      this.selectedMaintainerUserList = [];
    },
    /* 关闭弹窗 */
    handleClose(done) {
      done();
    },
    /* 表格编辑 */
    async editForm(row) {
      //先检查下 有没有权限（是否为维护人员）
      this.F_StampId = row.F_StampId;
      let res = await getManagerStampsByID(this.F_StampId);
        if (res.data && res.data.success) {
          this.diologTitle = this.$t('workFlow.privateStampInfo.titleEditStamp');
          this.menuForm = {
            F_StampId:row.F_StampId,
            F_StampName: row.F_StampName,
            F_StampType: row.F_StampType,
            F_Password: row.F_Password,
            F_Sort: row.F_Sort,
            F_File_Type: row.F_File_Type,
            F_File: row.F_File,
            F_Description: row.F_Description,
            F_StampAttributes: row.F_StampAttributes,
          };
          this.F_StampId = row.F_StampId;
          this.dialogVisible = true;
        }
    },
    /* 表格删除 */
    deleteForm(row) {
      this.$confirm(this.$t('deletePrompt.promptContent'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      })
        .then(() => {
          deleteStamps(row.F_StampId).then(() => {
            this.getItemList();
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message: this.$t('deletePrompt.successDeleted'),
              type: "success",
            });
          });
        })
        .catch(() => {});
    },

    /* 查询 */
    searchMenu() {
      this.getItemList();
    },
    /* 查询表单重置 */
    searchReset() {
      this.keyword = null;
      this.searchState = "";
      this.getItemList();
    },
    rowClick(row) {
      this.F_StampId = row.F_StampId;
    },
    /* 分页 */
    onPageLoad(page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.getItemList();
    },
    sizeChange(page) {
      this.page.pageSize = page;
      this.getItemList();
    },
    sortChange(val) {
      this.order.order = val.order == "ascending" ? "asc" : "desc";
      this.order.prop = val.prop;
      this.getItemList();
    },
    showOkDialog(val, messge) {
      if (!this.F_StampId) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
        return false;
      }
      this.okDialog = true;
      this.okVal = val;
      this.okMessage = messge;
    },
    okClose() {
      this.okDialog = false;
      this.okMessage = "";
    },
    okSubmit() {
      switch (this.okVal) {
        case "stopTask":
          this.stopTask();
          break;
        default:
          break;
      }
    },
    startTask() {
      if (this.F_StampId) {
        startStamps(this.F_StampId).then((res) => {
          if (res.data.success) {
            this.getItemList();
            this.getDictCateByCode();
            this.F_StampId = "";
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.startSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('deletePrompt.startFailure'),
              type: "warning",
            });
          }
        });
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
      }
    },
    stopTask() {
      this.okClose();
      if (this.F_StampId) {
        stopStamps(this.F_StampId).then((res) => {
          if (res.data.success) {
            this.getItemList();
            this.F_StampId = "";
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.privateStampInfo.hintStopSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.privateStampInfo.hintStopFailed'),
              type: "warning",
            });
          }
        });
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
      }
    },
    confirmMemberDialog() {
      this.flagSelect = true;
      let data = this.$refs.selectMember.pushParentData();
      let userIds = [];
      if (data.length > 0) {
        userIds = data
          .map((element) => {
            return element.F_UserId;
          });
      }
        setManagerStampsByID(this.F_StampId, userIds).then((res) => {
          this.selectedMemberUserList = [];
          this.memberDialogVisible = false;
          if (res.data.success) {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintSuccess'),
              type: "success",
            });
            this.getItemList();
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('deletePrompt.hintFailure'),
              type: "error",
            });
          }
        }).finally(() => {
          this.flagSelect = false;
        });
    },
    confirmAddMaintainerDialog() {
      this.flagSelectRole = true;
      let data = this.$refs.selectMaintainer.pushParentData();
      let userIds  = [];
      if (data.length > 0) {
        userIds = data
          .map((element) => {
            return element.F_UserId;
          });
          }
        setMaintainerUser(this.F_StampId,userIds).then((res) => {
          this.maintainerDialogVisible = false;
          if (res.data.success) {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.publicStampInfo.hintAssignSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title: this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.publicStampInfo.hintAssignFailed'),
              type: "error",
            });
          }
        }).finally(() => {
          this.flagSelectRole = false;
        });
      
    },
    addMaintainerUser() {
      if(this.F_StampId){
        getMaintainerUser(this.F_StampId).then((res) => {
        if (res.data.success) {
          this.selectedMaintainerUserList = res.data.data;
        }
        this.maintainerDialogVisible = true;
      });
      }
    },
    addUser(row) {
      this.F_StampId = row.F_StampId;
      getManagerStampsByID(this.F_StampId).then((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          this.selectedMemberUserList = res.data.data.map((ele) => {
            return {
              F_RealName: ele.F_RealName,
              F_UserId: ele.F_UserId,
              F_Account: ele.F_Account,
            };
          });
        }
        this.memberDialogVisible = true;
      });
    },
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
.avatar-uploader {
  border: 1px solid #dcdfe6;
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 4px;
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  display: inline-block;
  padding-top: 30px;
  line-height: 14px;
  height: auto;
  
}
.avatar {
  width: 100px;
  height: 100px;
}

div /deep/.el-radio__label{
	font-size: 12px;
	padding-left: 5px;
}
@media screen and (max-width: 1370px) {
	   div /deep/.el-dialog{
		margin-top:10vh!important;
	   }
	     
	}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px!important;
}
@media screen and (max-width: 1312px) {
	   /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}		 
</style>
