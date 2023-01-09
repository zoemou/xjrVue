<template>
  <div class="main-container">
    <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            class="search-input"
          ></el-input>
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
          :data="tableList"
          :option="option"
          stripe
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @row-click="rowClick"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="showDialog('add')"
              v-if="hasButtonPermission('add')"
              >{{$t('buttonModule.addBtn')}}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              @click="showDialog('edit',scope.row)"
              v-if="hasButtonPermission('modify')"
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              @click="deleteForm(scope.row)"
              v-if="hasButtonPermission('delete')"
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
          </template>
           <template slot="template" slot-scope="scope">
            <el-tag @click="showDialog('template',scope.row)">{{$t('workFlow.WFMenu.tagBelTem')}}</el-tag>
          </template>
          <template slot="fieldDisplay" slot-scope="scope">
            <span v-if="scope.row.F_NwfSchemeType==2">{{$t('workFlow.WFMenu.None')}}</span>
            <el-tag v-else @click="showDialog('field',scope.row)">{{$t('workFlow.WFMenu.tagFormField')}}</el-tag>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog v-dialogDrag
      :title="dialog.title"
      :append-to-body="true"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      width="88%"
    >
      <component
        :is="dialog.componentName"
        v-if="dialog.visible"
        :formData="formData"
        @submit="submit"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import {
  getWorkflowRelation,
  addWorkflowRelation,
  updateWorkflowRelation,
  deleteWorkflowRelation
} from "@/api/workFlow/WFMenu";
import MenuForm from "./components/MenuForm.vue";
import FieldDisplay from "./components/menu/FieldDisplay";
import TemplateList from "./components/menu/TemplateList";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: {
    MainFixed,
    MainContent,
    MenuForm,
    FieldDisplay,
    TemplateList
  },
   inject: ['reload'],
  data() {
    return {
      fixedTitle:this.$t('workFlow.WFMenu.fixedTitle'),
      contentTitle: "功能信息 - 专项菜单",
      keyword: "",
      menuTree: [],
      tableList: [],
      defaultProps: { children: "children", label: "F_ItemName" },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('workFlow.WFMenu.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          { sortable: true, label:this.$t('workFlow.WFMenu.tabMenuCode'), prop: "F_NwfRelationCode",minWidth:'95',align:'left'},
          { sortable: true, label:this.$t('workFlow.WFMenu.tabMenuName'), prop: "F_NwfRelationName",minWidth:'95',align:'left' },
          { sortable: true, label:this.$t('workFlow.WFMenu.tabFuncNum'), prop: "F_EnCode",align:'left' },
          { sortable: true, label:this.$t('workFlow.WFMenu.tabFuncName'), prop: "F_FullName",align:'left' },
          {
            label:this.$t('workFlow.WFMenu.tabBelTem'),
            prop:'template',
			width:'125',
            slot:true,
			sortable: true,align:'left'
          },
          {
            label:this.$t('workFlow.WFMenu.tabFieldShow'),
            prop:'fieldDisplay',
			width:'164',
            slot:true,
			sortable: true,align:'left'
          },
        ],
      },
      dialog: {
        title: "",
        visible: false,
        componentName: "",
        type: "",
      },
      page: {
        currentPage: 1,
        total: 0,
        // layout: "total, prev, pager, next, jumper",
        // background: false,
        pageSize: 20,
      },
      formData:{},
      F_Id:""
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
         this.showDialog('edit',row)
      }
    },
    searchMenu() {
      this.getMenu();
    },
    searchReset() {
      this.keyword = null;
    },
    rowClick(row, event, column) {
      this.F_ModuleId = row.F_ModuleId;
    },
    async getMenu() {
      let res = await getWorkflowRelation({ keyword: this.keyword, Limit: this.page.currentPage,
        Size: this.page.pageSize });
      var tempData = [];
      if (res.data.success) {
        tempData = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      } else {
        tempData = [];
        this.page.total = 0;
      }
       this.tableList = tempData;
    },
    async deleteForm(row){
      let res =  {code:0,data:{success:false}};
      res = await deleteWorkflowRelation(row.F_Id);
       if (res.data.success) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
        // this.menuReload()
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('workFlow.WFMenu.hintFailure') + res.data.msg,
          type: "warning",
        });
      }
      this.getMenu();
    },
    showDialog(type,row) {
      this.dialog.type = type;
      let formData = {};
      if (type == "add") {
        this.dialog.title = this.$t('workFlow.WFMenu.dialogTitle.addMenu');
        this.dialog.componentName = "MenuForm";
        this.F_Id = "";
      }
      if (type == "edit") {
        formData = row;
        this.F_Id = row.F_Id ;
        this.dialog.title =this.$t('workFlow.WFMenu.dialogTitle.editMenu');
        this.dialog.componentName = "MenuForm";
      }
      if (type == "template") {
        formData = row;
        this.F_Id = "";
        this.dialog.title = this.$t('workFlow.WFMenu.dialogTitle.viewTemplate');
        this.dialog.componentName = "TemplateList";
      }
      if (type == "field") {
        formData = row;
        this.F_Id = "";
        this.dialog.title = this.$t('workFlow.WFMenu.dialogTitle.viewShowField');
        this.dialog.componentName = "FieldDisplay";
      }
      this.formData = formData;
      this.dialog.visible = true;
    },
    async submit(formData) {
      let loading = this.$loading({
      lock: true,
      text: this.$t('workFlow.WFMenu.hintSubmit'),
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.7)",
    });
      let res =  {code:0,data:{success:false}};
      try {
        if(this.F_Id){
        res = await updateWorkflowRelation(this.F_Id,formData);
      }else{
        res = await addWorkflowRelation(formData);
      }
      if (res.data.success) {
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
        this.dialog.visible = false;
        this.menuReload();
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('workFlow.WFMenu.hintFailure') + res.data.msg,
          type: "warning",
        });
      }
      } catch (error) {}
      loading.close();
    },
    menuReload(){
      this.reload();
      this.$confirm(this.$t('workFlow.WFMenu.hintRefreshPage'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: 'warning'
      }).then( () => {
        this.$router.go(0);
         window.location.reload();
      })
    }
  },
};
</script>

<style scoped>
/* css */
.search-input {
  width: 200px;
  margin-right: 5px;
}
.main-container {
  height: 100%;
  padding: 0 8px;
}
.cl:after,
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.cl,
.clearfix {
  zoom: 1;
}

.user-box {
  float: left;
  width: 33.3%;
  height: 66px;
  padding: 0 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.user-item {
  width: 100%;
  height: 66px;
  color: #303133;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  transition: 0.3s;
  box-sizing: border-box;
  position: relative;
}

.user-item.gou {
  border: 1px solid #f56c6c;
}

.user-box img {
  float: left;
  width: 66px;
  height: 66px;
  margin-right: 15px;
}

.user-box .user-info {
  padding-left: 81px;
  box-sizing: border-box;
}

.user-box .user-info p {
  height: 22px;
  margin: 0;
  font-size: 12px;
  line-height: 22px;
}
.user-item i {
  display: none;
}
.user-item i.gou {
  display: block;
  position: absolute;
  right: 0px;
  top: 0;
  color: #fff;
  width: 0;
  height: 0;
  border-width: 0 30px 30px 0px;
  border-style: solid;
  border-color: #f56c6c #f56c6c transparent transparent;
  font-weight: bold;
  font-size: 14px;
  text-indent: 1em;
  line-height: 20px;
}
div /deep/ .el-tag{
  cursor: pointer;
}
@media screen and (max-width: 1370px) {
	div /deep/ .el-dialog{
		margin-top: 8vh!important;
	}
}
/deep/ .el-steps--simple{
	margin-bottom: 10px;
}
</style>
