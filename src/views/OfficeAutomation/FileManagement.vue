<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 菜单树形 -->
        <el-tree
          :data="menuTree"
          node-key="id"
          ref="cTree"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i class="el-icon-folder-opened"></i>
            <span>{{ data.label }}</span>
          </span>
        </el-tree>
      </div>
    </main-fixed>
    <main-content :paddingLeft="205" :padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input
            v-model="keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right:5px"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchMenu"
            >{{ $t("searchModule.searchBtn") }}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{
            $t("searchModule.searchReset")
          }}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud
          :key="menuKey"
          ref="cuTable"
          :data="menuTable"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          stripe
          @tree-load="treeLoad"
          @row-click="rowClick"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-upload
              v-if="F_ModuleId == 0 && hasButtonPermission('upload')"
              class="upload-demo"
              :action="baseUrl + '/file-manager/uploadFile'"
			  :headers="{[website.Authorization]:'Bearer '+getToken()}"
              :show-file-list="false"
              :data="{ folderId }"
              :on-success="handleSuccess"
            >
              <el-button type="primary" icon="el-icon-upload2" size="small">{{
                $t("fileManagement.uploadFileBtn")
              }}</el-button>
            </el-upload>
            <el-button
              type="primary"
              v-if="F_ModuleId == 0 && hasButtonPermission('add')"
              icon="el-icon-plus"
              size="small"
              @click="openForm()"
              >{{ $t("fileManagement.buildFileBtn") }}</el-button
            >
            <el-button
              type="primary"
              v-if="F_ModuleId == 3 && hasButtonPermission('clear')"
              icon="el-icon-delete"
              size="small"
              @click="clearStation()"
              >{{ $t("fileManagement.clearFileBtn") }}</el-button
            >
          </template>
          <template slot-scope="scope" slot="menu">
            <block v-if="F_ModuleId == 3">
              <block v-if="scope.row.F_Type != '文件夹'">
                <el-button
                  type="opr-primary"
                  icon="el-icon-view"
                  size="mini"
                  @click="editForm(scope.row, 'view')"
				  v-if="hasButtonPermission('fileview')"
                  :title="$t('fileManagement.titlePreview')"
                ></el-button>
                <!-- <el-button
                  type="opr-primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editForm(scope.row, 'edit')"
                  :title="$t('fileManagement.titleEdit')"
                  style="margin-right:10px"
                ></el-button> -->
              </block>
              <el-button
                type="opr-primary"
                icon="el-icon-sort"
                size="mini"
                @click="editForm(scope.row, 'move')"
				v-if="hasButtonPermission('filemove')"
                :title="$t('fileManagement.titleMove')"
              ></el-button>
              <el-button
                type="opr-primary"
                icon="el-icon-edit-outline"
                size="mini"
                @click="editForm(scope.row, 'rename')"
				v-if="hasButtonPermission('filerename')"
                :title="$t('fileManagement.titleRename')"
              ></el-button>
              <el-button
                type="opr-primary"
                icon="el-icon-refresh-left"
                size="mini"
                @click="reloadFile(scope.row, scope.index)"
				v-if="hasButtonPermission('restore')"
                :title="$t('fileManagement.titleRestoreFile')"
              ></el-button>
              <el-button
                type="opr-danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteFile(scope.row, scope.index)"
				v-if="hasButtonPermission('filedelete')"
                :title="$t('fileManagement.titleCompleteDelete')"
              ></el-button>
            </block>
            <block v-else>
              <block v-if="scope.row.F_Type == '文件夹'">
                <el-button
                  type="opr-primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="openForm(scope.row.F_Id)"
				  v-if="hasButtonPermission('addChil')"
                  :title="$t('fileManagement.buildFileBtn')"
                ></el-button>
                <el-upload
                  class="upload-demo"
                  style="margin:0 10px"
                  :action="baseUrl + '/file-manager/uploadFile'"
				  :headers="{[website.Authorization]:'Bearer '+getToken()}"
                  :show-file-list="false"
                  :data="{ folderId: scope.row.F_Id }"
                  :on-success="rowHandleSuccess"
                >
                  <el-button
                    type="opr-primary"
                    icon="el-icon-upload2"
                    size="mini"
                    :title="$t('fileManagement.titleUpload')"
					v-if="hasButtonPermission('upload')"
                  ></el-button>
                </el-upload>
              </block>
              <block v-if="scope.row.F_Type != '文件夹'">
                <el-button
                  type="opr-primary"
                  icon="el-icon-download"
                  size="mini"
                  @click="editForm(scope.row, 'dowload')"
                  :title="$t('fileManagement.titleDownload')"
                  v-if="hasButtonPermission('filedownload')"
                ></el-button>
                <el-button
                  type="opr-primary"
                  icon="el-icon-view"
                  size="mini"
                  @click="editForm(scope.row, 'view')"
                  :title="$t('fileManagement.titlePreview')"
                  v-if="hasButtonPermission('fileview')"
                  style="margin-right:10px"
                ></el-button>
              </block>
              <el-button
                type="opr-primary"
                icon="el-icon-sort"
                size="mini"
                @click="editForm(scope.row, 'move')"
                :title="$t('fileManagement.titleMove')"
                v-if="hasButtonPermission('filemove')"
              ></el-button>
              <el-button
                type="opr-primary"
                icon="el-icon-edit-outline"
                size="mini"
                @click="editForm(scope.row, 'rename')"
                :title="$t('fileManagement.titleRename')"
                v-if="hasButtonPermission('filerename')"
              ></el-button>
              <!-- <el-button
                type="opr-primary"
                icon="el-icon-edit"
                size="mini"
                @click="editForm(scope.row, 'edit')"
                v-if="scope.row.F_Type != '文件夹'"
                :title="$t('fileManagement.titleEdit')"
              ></el-button> -->
              <el-button
                type="opr-danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteForm(scope.row, scope.index)"
                :title="$t('tableOperationModule.deleteBtn')"
                v-if="hasButtonPermission('filedelete')"
              ></el-button>
            </block>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      style="padding: 10px 20px;"
    >
      <el-form
        :rules="rules"
        ref="menuForm"
        :model="menuForm"
        label-width="72px"
        :validate-on-rule-change="false"
      >
        <el-row>
          <el-col :span="24" v-show="hasFormPermission('F_FileName')">
            <el-form-item
              prop="F_FileName"
              :label="$t('fileManagement.labelFileName')"
            >
              <el-input
                :placeholder="$t('fileManagement.placeholderFileName')"
                size="small"
                v-model="menuForm.F_FileName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="" @click="handleClose">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="formSubmit()"
          :loading="flagSub"
          >{{flagSub?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="dialogViewTitle"
      :append-to-body="true"
      :visible.sync="FileVisible"
      width="80%"
      top="0"
      :before-close="dialogClose"
      class="filelog"
    >
      <iframe
        :src="fileUrl"
        style="height:100%;width:100%"
        frameborder="no"
        border="0"
      ></iframe>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="$t('fileManagement.dialogTitle.moveFileTitle')"
      :append-to-body="true"
      :visible.sync="changeVisible"
      width="50%"
      :before-close="dialogClose"
    >
      <el-tree
        :data="fileTree"
        node-key="F_Id"
        ref="fileTree"
        @node-click="fileNodeClick"
        :props="defaultProps"
        style="height:500px"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import { baseUrl, previewUrl } from "@/config/env";
import {
  queryFileAndFileFolder,
  addFolder,
  updateFolder,
  getFileByParentId,
  logicDelete,
  reviewFile,
  EditFile,
  emptyTrash,
  DeleteFile,
  restoreFile,
  getFileTree,
  removeFile
} from "@/api/officeautomation/file";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getToken } from '@/util/auth'
import { formValidateNotice } from '@/util/util';
import website from '@/config/website';
export default {
  name: "FileManagement",
  mixins: [tableOptionMixin, authorizeMixin,displayColumnsMixin],
  components: { MainContent, MainFixed },
  data() {
    return {
      menuKey:0,
	  website:website,
      folderId: "0",
      flagSub: false,
      fixedTitle: this.$t("fileManagement.Fixed.Title"),
      dialogViewTitle: this.$t("fileManagement.dialogTitle.previewFileTitle"),
      menuTree: [
        {
          id: 0,
          label: this.$t("fileManagement.Fixed.allFile")
        },
        {
          id: 1,
          label: this.$t("fileManagement.Fixed.Documents")
        },
        {
          id: 2,
          label: this.$t("fileManagement.Fixed.Image")
        },
        {
          id: 3,
          label: this.$t("fileManagement.Fixed.recycleBin")
        }
      ],
      dialogTitle: this.$t("fileManagement.buildFileBtn"),
      defaultTree: [], //对树数据的处理
      menuTable: [],
      fileTree: [],
      defaultProps: {
        children: "children",
        label: "F_Name"
      },
      F_ModuleId: 0,
      keyword: null,
      fileUrl: "",
      dialogVisible: false,
      FileVisible: false,
      changeVisible: false,
      fileId: "",
      F_ParentId: 0,
      menuForm: {
        F_FileName: ""
      },
      option: {
        lazy: true,
        rowKey: "F_Id",
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 220,
        border: false,
        page: false,
        index: true,
        indexLabel: this.$t("fileManagement.tabNum"),
        align: "left",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t("fileManagement.tabFileName"),
            prop: "F_Name",
            align: "left",
            minWidth: "90"
          },
          {
            sortable: true,
            label: this.$t("fileManagement.tabSize"),
            prop: "F_Size",
            minWidth: "90",
            formatter: function(row) {
              return ((row.F_Size || 0) / 1024).toFixed(2) + " kb";
            }
          },
          {
            sortable: true,
            label: this.$t("fileManagement.tabFileType"),
            minWidth: "100",
            prop: "F_Type"
          },
          {
            sortable: true,
            label: this.$t("fileManagement.tabModifyTime"),
            minWidth: "140",
            prop: "F_ModifyDate"
          }
        ]
      },
      maps: new Map(),
      curRow: {},
      rules: {
        F_FileName: [
          {
            required: true,
            message: this.$t("fileManagement.placeholderFileName"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.$nextTick(function() {
      this.$refs.cTree.setCurrentKey(0);
      this.queryFileAndFileFolder();
    });
  },
  methods: {
	getToken(){
		return getToken()
	},
    handleRowDBLClick(row, event) {
      if (this.openDoubleClickEdit) {
        this.editForm(row, "edit");
      }
    },
    /* 选择树形菜单加载菜单信息 */
    handleNodeClick(data) {
      this.keyword = null;
      this.F_ModuleId = data.id;
      this.queryFileAndFileFolder();
    },
    fileNodeClick(data) {
      removeFile({
        fileId: this.fileId,
        folderId: data.F_Id
      }).then(res => {
        const { code } = res.data;
        this.$notify({
          title: code
            ? this.$t("deletePrompt.failureTitle")
            : this.$t("deletePrompt.successTitle"),
          message: code
            ? this.$t("fileManagement.Hint.moveFailed")
            : this.$t("fileManagement.Hint.moveSuccess"),
          type: code ? "error" : "success"
        });
        if (!code) {
          this.changeVisible = false;
          this.queryFileAndFileFolder();
        }
      });
    },
    queryFileAndFileFolder() {
      let obj = {
        fileType: this.F_ModuleId,
        keywords: this.keyword
      };
      queryFileAndFileFolder(obj).then(res => {
        const { data, code } = res.data;
        if (code) return (this.menuTable = []);
        data.forEach(el => {
          if (el.F_Type == "文件夹") {
            el.hasChildren = true;
          }
        });
        this.menuKey++;
        this.menuTable = data;
      });
    },

    treeLoad(tree, treeNode, resolve) {
      this.maps.set(tree.F_Id, { tree, treeNode, resolve });
      getFileByParentId(tree.F_Id).then(res => {
        const { data, code } = res.data;
        if (code) return resolve([]);
        data.forEach(el => {
          if (el.F_Type == "文件夹") {
            el.hasChildren = true;
          }
        });
        resolve(data);
      });
    },
    // 重新触发树形表格的treeLoad函数(因项目中需要多次触发treeLoad方法，故封装成一个方法)
    refreshLoadTree(parentId) {
      // 根据父级id取出对应节点数据
      if (this.maps.get(parentId)) {
        const { tree, treeNode, resolve } = this.maps.get(parentId);
        //this.$set(this.$refs.cuTable.store.states.lazyTreeNodeMap, parentId, [])
        if (tree) {
          this.treeLoad(tree, treeNode, resolve);
        }
      }
    },
    rowClick(row, column, event) {
      //必须要文件夹才能上传文件
      if (row.F_Type === "文件夹") {
        this.folderId = row.F_Id;
      }
      this.curRow = row;
    },
    clearStation() {
			this.$confirm(
			  this.$t("areYouSureYouWantToEmptyTheRecycleBin"),
			  this.$t("deletePrompt.promptTitle"),
			  {
			    confirmButtonText: this.$t("buttonModule.modalSureBtn"),
			    cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
			    type: "warning"
			  }
			).then(() => {
				emptyTrash().then(res => {
					const { code } = res.data;
					this.$notify({
						title: code
							? this.$t("deletePrompt.failureTitle")
							: this.$t("deletePrompt.successTitle"),
						message: code
							? this.$t("fileManagement.Hint.clearFailed")
							: this.$t("fileManagement.Hint.clearSuccess"),
						type: code ? "error" : "success"
					});
					if (!code) this.queryFileAndFileFolder();
				});
			}).catch(()=>{})
    },
    handleSuccess(response, file, fileList) {
      const { code } = response.data;
      this.$notify({
        title: code
          ? this.$t("deletePrompt.failureTitle")
          : this.$t("deletePrompt.successTitle"),
        message: code
          ? this.$t("fileManagement.Hint.uploadFailed")
          : this.$t("fileManagement.Hint.uploadedSuccess"),
        type: code ? "error" : "success"
      });
      if (!code) this.queryFileAndFileFolder();
    },
    rowHandleSuccess(response, file, fileList) {
      const { code } = response.data;
      this.$notify({
        title: code
          ? this.$t("deletePrompt.failureTitle")
          : this.$t("deletePrompt.successTitle"),
        message: code
          ? this.$t("fileManagement.Hint.uploadFailed")
          : this.$t("fileManagement.Hint.uploadedSuccess"),
        type: code ? "error" : "success"
      });
      if (!code) this.refreshLoadTree(this.curRow.F_Id);
    },
    deleteFile(row) {
			this.$confirm(
			  this.$t("deletePrompt.promptContent"),
			  this.$t("deletePrompt.promptTitle"),
			  {
			    confirmButtonText: this.$t("buttonModule.modalSureBtn"),
			    cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
			    type: "warning"
			  }
			).then(() => {
				DeleteFile(row.F_Id).then(res => {
					const { code } = res.data;
					this.$notify({
						title: code
							? this.$t("deletePrompt.failureTitle")
							: this.$t("deletePrompt.successTitle"),
						message: code
							? this.$t("fileManagement.Hint.completeDeleteFailed")
							: this.$t("fileManagement.Hint.completeDeleteSuccess"),
						type: code ? "error" : "success"
					});
					if (!code) this.queryFileAndFileFolder();
				});
			}).catch(()=>{})
    },
    reloadFile(row) {
			this.$confirm(
			  this.$t("areYouSureYouWantToRestoreThisFile"),
			  this.$t("deletePrompt.promptTitle"),
			  {
			    confirmButtonText: this.$t("buttonModule.modalSureBtn"),
			    cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
			    type: "warning"
			  }
			).then(() => {
				restoreFile(row.F_Id).then(res => {
					const { code } = res.data;
					this.$notify({
						title: code
							? this.$t("deletePrompt.failureTitle")
							: this.$t("deletePrompt.successTitle"),
						message: code
							? this.$t("fileManagement.Hint.returnFailed")
							: this.$t("fileManagement.Hint.returnSuccess"),
						type: code ? "error" : "success"
					});
					if (!code) this.queryFileAndFileFolder();
				});
			}).catch(()=>{});
    },
    openForm(id) {
      this.dialogTitle = this.$t("fileManagement.dialogTitle.newFolderTitle");
      this.dialogVisible = true;
      this.fileId = "";
      this.menuForm.F_FileName = "";
      this.F_ParentId = id || "";
    },
    /* 提交表单 */
    formSubmit() {
      this.flagSub = true;
      this.$refs["menuForm"].validate((valid,object) => {
        if (valid) {
          var submitObj = {
            F_FileName: this.menuForm.F_FileName,
            F_ParentId: this.F_ParentId
          };
          if (this.fileId) {
            updateFolder({
              fileId: this.fileId,
              fileName: this.menuForm.F_FileName
            })
              .then(() => {
                this.$refs["menuForm"].resetFields();
                this.dialogVisible = false;
                this.fileId = "";
                this.queryFileAndFileFolder();
              })
              .finally(() => {
                this.flagSub = false;
              });
          } else {
            addFolder(submitObj)
              .then(res => {
                this.$refs["menuForm"].resetFields();
                this.dialogVisible = false;
                this.queryFileAndFileFolder();
              })
              .finally(() => {
                this.flagSub = false;
              });
          }
        } else {
          formValidateNotice(object,this,this.formEnCodeList)
          this.flagSub = false;
          return false;
        }
      });
    },
    /* 关闭弹窗 */
    handleClose(done) {
      this.$refs["menuForm"].resetFields();
      this.dialogVisible = false;
    },
    dialogClose(done) {
      done();
    },
    editForm(row, type) {
      if (type == "view") {
        this.dialogViewTitle = this.$t(
          "fileManagement.dialogTitle.previewFileTitle"
        );

        this.fileUrl =
          previewUrl +
          encodeURIComponent(Base64.encode((row.F_FilePath.includes("http://") || row.F_FilePath.includes("https://") ?row.F_FilePath : baseUrl + row.F_FilePath))); //(4.09以上版本)这里反斜杠必须有
        this.FileVisible = true;
        // reviewFile(row.F_Id).then(res => {
        //   const { data, code } = res.data;
        //   if (code) return;
        //   this.FileVisible = true;
        //   this.fileUrl = data.wpsUrl;
        // });
      } else if (type == "rename") {
        this.dialogTitle = this.$t(
          "fileManagement.dialogTitle.renameFolderTitle"
        );
        this.dialogVisible = true;
        this.fileId = row.F_Id;
        this.menuForm.F_FileName = row.F_Name;
      }
      // else if (type == "edit") {
      //   this.dialogViewTitle = this.$t(
      //     "fileManagement.dialogTitle.editFileTitle"
      //   );
      //   EditFile(row.F_Id).then(res => {
      //     const { data, code } = res.data;
      //     if (code) return;
      //     this.FileVisible = true;
      //     this.fileUrl = data.wpsUrl;
      //   });
      // }
      else if (type == "dowload") {
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = baseUrl + "/file-manager/downloadFile/" + row.F_Id;
        a.click();
      } else if (type == "move") {
        this.changeVisible = true;
        this.fileId = row.F_Id;
        getFileTree().then(res => {
          const { data, code } = res.data;
          if (code) return;
          this.fileTree = data;
        });
      }
    },
    /* 表格删除 */
    deleteForm(row, index) {
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      ).then(() => {
          logicDelete(row.F_Id).then((res) => {
						const { code } = res.data;
            this.queryFileAndFileFolder();
            this.$notify({
              title: code
                ? this.$t("deletePrompt.failureTitle")
                : this.$t("deletePrompt.successTitle"),
              message: code
                ? this.$t("moveToRecycleBinFailed")
                : this.$t("workFlow.processTasks.hintMovedSuccess"),
              type: code ? "error" : "success"
            });
          });
        }).catch(() => {});
    },
    /* 查询 */
    searchMenu() {
      this.queryFileAndFileFolder();
    },
    /* 查询表单重置 */
    searchReset() {
      this.keyword = null;
      this.menuTable = [];
      this.queryFileAndFileFolder();
    }
  }
};
</script>

<style scoped>
.upload-demo {
  display: inline-block;
}
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

.filelog /deep/ .el-dialog {
  height: 100%;
}
.filelog /deep/ .el-dialog__body {
  height: calc(100% - 71px);
}
div /deep/ .custom-tree-node span {
  font-size: 14px;
  padding-left: 10px;
}
div /deep/ .custom-tree-node i {
  font-size: 12px;
}
/deep/ .avue-crud__left {
  height: 31px;
}
</style>
