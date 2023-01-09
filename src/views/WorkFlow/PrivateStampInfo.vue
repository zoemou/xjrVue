<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 菜单树形 -->
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
    <main-content :title="contentTitle+F_Item.F_ItemName" :paddingLeft="205" :padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input
            v-model="keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 5px"
          ></el-input>
          <el-select
            v-model="searchState"
            :placeholder="$t('workFlow.privateStampInfo.placeholderState')"
            style="width: 200px; margin-right: 5px"
          >
            <el-option :label="$t('workFlow.privateStampInfo.labelEnable')" value="1" key="1"></el-option>
            <el-option :label="$t('workFlow.privateStampInfo.labelStop')" value="0" key="0"></el-option>
            <el-option :label="$t('workFlow.privateStampInfo.labelAllStatus')" value key></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchMenu">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud
          ref="cuTable"
          v-if="F_Item"
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
                :menuForm="menuForm"
                :menuTree="menuTree"
                ref="menuForm"
                :StampId="F_StampId"
              ></AddStamp>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button 
                size="mini" 
                type="primary" 
                @click="userFormSubmit('menuForm')" 
                :loading="flagElecStamp"
                >{{flagElecStamp?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
              </span>
            </el-dialog>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="add()" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
            <el-button  size="small" @click="startTask()" v-if="hasButtonPermission('startTask')">{{$t('workFlow.privateStampInfo.enableBtn')}}</el-button>
            <el-button
              
              size="small"
              @click="showOkDialog('stopTask',$t('workFlow.privateStampInfo.hintWhetherStop'))"
              v-if="hasButtonPermission('stop')"
            >{{$t('workFlow.privateStampInfo.labelStop')}}</el-button>
            <el-button
              
              size="small"
              @click="showOkDialog('setStamps',$t('workFlow.privateStampInfo.hintSetDefault'))"
              v-if="hasButtonPermission('setStamps')"
            >{{$t('workFlow.privateStampInfo.setDefaultBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="opr-primary" size="mini" @click="edit(scope.row,scope.index)" v-if="hasButtonPermission('edit')">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row,scope.index)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.privateStampInfo.titleInfor')"
      :append-to-body="true"
      :visible.sync="okDialog"
      width="30%"
      :before-close="okClose"
      :close-on-click-modal="false"
    >
      <div v-if="okDialog">
        <i class="fa fa-question-circle-o"></i>
        {{okMessage}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="okSubmit">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MainFixed from "@/page/main/MainFixed.vue";
import MainContent from "@/page/main/MainContent.vue";
import AddStamp from "./AddStamp.vue";
import { baseUrl } from '@/config/env';
import authorizeMixin from "@/mixins/authorize";
import {
  getStampsList,
  startStamps,
  stopStamps,
  setDefaultStamps,
  deleteStamps,
} from "@/api/workFlow/stamp";
import { getDictCateByCode } from "@/api/language/dictionary";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: "PrivateStampInfo",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent, MainFixed, AddStamp },
  data() {
	const _this = this;  
    return {
      flagElecStamp: false,
      fixedTitle:this.$t('workFlow.privateStampInfo.fixedTitle'),
      contentTitle: "电子签章 - ",
      F_Item: "",
      menuTree: [],
      searchState: "",
      menuTable: [],
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
        F_StampAttributes: 0,
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
        menuWidth: 150,
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
            label: this.$t('workFlow.privateStampInfo.tabStampName'),
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
			align: 'left',
            formatter: function (row) {
              return '<img src="' + baseUrl+row.F_File + '" width="100"/>';
            },
          },
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.tabStatus'),
            prop: "F_EnabledMark",
			width:'85',
			align: 'left',
            formatter: function (row) {
              return row.F_EnabledMark === 0 ? _this.$t('buttonModule.deactivateBtn'): _this.$t('custmerForm.tableEnable');
            },
          },
          {
            sortable: true,
            label:this.$t('workFlow.privateStampInfo.tabDefaStamp'),
			width:'95',
			align: 'left',
            prop: "F_StampAttributes",
            formatter: function (row) {
              return row.F_StampAttributes === 1 ? "默认" : "";
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
    };
  },
  mounted() {
    this.getDictCateByCode();
    this.getItemList();
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.edit(row)
      }
    },
    /* 获取菜单树形数据 */
    getDictCateByCode() {
      getDictCateByCode("StampType").then((res) => {
        this.menuTree = res.data.data;
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
      var obj = {
        StampType: this.F_Item.F_ItemValue,
        EnabledMark: this.searchState == "" ? null : this.searchState,
        StampAttributes: 0,
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
    add() {
      this.diologTitle = this.$t('workFlow.privateStampInfo.titleAddStamp');
      this.dialogVisible = true;
      this.F_StampId = "";
      this.menuForm = {
        F_StampName: "",
        F_StampType: null,
        F_Password: "",
        F_Sort: "",
        F_File_Type: 1,
        F_File: "",
        F_Description: "",
        F_StampAttributes: 0,
      };
    },
    /* 提交表单 */
    userFormSubmit(formName) {
      let that = this;
      that.flagElecStamp = true;
      this.$refs[formName].userFormSubmit(function (res) {
		  if(res!==undefined){
			  that.getItemList();
			  that.cancelForm();
		  }
      }).finally(() => {
        this.flagElecStamp = false;
      });
    },
    /* 取消弹窗 */
    cancelForm() {
      this.flagElecStamp = false;
      this.dialogVisible = false;
    },
    /* 关闭弹窗 */
    handleClose(done) {
      done();
    },
    /* 表格编辑 */
    edit(row, index) {
      this.diologTitle = this.$t('workFlow.privateStampInfo.titleEditStamp');
      this.dialogVisible = true;
      this.menuForm = {
        F_StampId :row.F_StampId,
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
      this.flagElecStamp = false;
    },
    /* 表格删除 */
    deleteForm(row, index) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
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
    rowClick(row, event, column) {
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
    startTask() {
      if (this.F_StampId) {
        startStamps(this.F_StampId).then((res) => {
          if (res.data.success) {
            this.getItemList();
            this.F_StampId = "";
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('workFlow.privateStampInfo.hintStartSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.privateStampInfo.hintStartFailed'),
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
              title: this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.privateStampInfo.hintStopSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('workFlow.privateStampInfo.hintStopFailed'),
              type: "warning",
            });
          }
        });
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
      }
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
        case "setStamps":
          this.setStamps();
          break;
        case "stopTask":
          this.stopTask();
          break;
        default:
          break;
      }
    },
    setStamps() {
      this.okClose();
      if (this.F_StampId) {
        setDefaultStamps(this.F_StampId).then((res) => {
          if (res.data.success) {
            this.getItemList();
            this.F_StampId = "";
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message:this.$t('workFlow.privateStampInfo.hintSetDefSuccess'),
              type: "success",
            });
          } else {
            this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('workFlow.privateStampInfo.hintDefFailed'),
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
  },
};
</script>

<style scoped>
/* reset css */
div /deep/ .companiesuser-form .el-form-item {
  margin-bottom: 12px;
}
div /deep/ .el-radio__label{
	font-size: 12px;
	padding-left: 5px;
}

/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px!important;
}
div /deep/ .el-table .cell{
		height: 20px;
		}
div /deep/ .el-table .cell img{
		height: 100%;
		}	
@media screen and (max-width: 1310px) {
	   /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}				
</style>