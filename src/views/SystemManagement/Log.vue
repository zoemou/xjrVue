<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <div class="list-box">
          <ul>
            <li
              v-for="(item, index) in logList"
              :class="{ active: isActive === index }"
              @click="checkedItem(index)"
            >
              <i class="fa fa-file-text-o"></i>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </main-fixed>
    <main-content
      :title="contentTitle"
      :subTitle="contentSubTitle"
      :paddingLeft="205"
      :padding-top="94"
    >
      <div slot="search">
        <div class="search-box">
          <!-- 在此处放置搜索内容 -->
          <el-date-picker
            style="width: 260px; margin-right: 5px; height: 27px;"
            size="small"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            :range-separator="$t('searchModule.rangeSeparator')"
            :start-placeholder="$t('searchModule.startDatePlaceholder')"
            :end-placeholder="$t('searchModule.endDatePlaceholder')"
            @change="dateChange"
          >
          </el-date-picker>
          <el-input
            v-model="searchParam.keyword"
            size="small"
            @keyup.native="keyUp"
            @keydown.native="keydown"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 5px"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search"
            >{{ $t("searchModule.searchBtn") }}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{
            $t("searchModule.searchReset")
          }}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud
            ref="log"
            :data="log"
            :option="option"
            @row-click="currentRow"
            @selection-change="selectionChange"
            :page.sync="page"
            :showColumn="showColumn"
            :isSaveColumns="true"
            @on-load="onPageLoad"
            @current-row-change="handleCurrentRowChange"
            @sort-change="sortChange"
          >
            <template slot-scope="scope" slot="menuLeft">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="openDialog"
				 v-if="hasButtonPermission('clear')"
                >{{ $t("buttonModule.emptyBtn") }}</el-button
              >
              <el-button size="small" @click="tabelExport" v-if="hasButtonPermission('export')">{{
                $t("buttonModule.exportBtn")
              }}</el-button>
              <el-button size="small" @click="deleteSelect" v-if="hasButtonPermission('batchDelete')">{{
                $t("buttonModule.batchDeletionBtn")
              }}</el-button>
            </template>
            <!-- <template slot-scope="scope" slot="F_ExecuteResult">
                            <el-tag type="success" effect="dark" size="small" v-if="scope.row.F_ExecuteResult === 1">成功</el-tag>
                            <el-tag type="danger" effect="dark" size="small" v-if="scope.row.F_ExecuteResult === 0">失败</el-tag>
                        </template> -->
          </avue-crud>

          <!-- 新增 -->
          <el-dialog
            v-dialogDrag
            :close-on-click-modal="false"
            :title="$t('Log.emptyModal.modalTitle')"
            :append-to-body="true"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="closeDialog"
          >
            <div class="form">
              <el-form
                ref="clearLogForm"
                :model="clearLogForm"
                label-width="80px"
              >
                <el-form-item :label="$t('Log.emptyModal.labelTime')">
                  <el-select
                    v-model="clearLogForm.type"
                    :placeholder="$t('Log.emptyModal.placeholderSelect')"
                    @change="selectChange"
                  >
                    <el-option
                      key="1"
                      :label="$t('Log.emptyModal.optionOne')"
                      value="1"
                    ></el-option>
                    <el-option
                      key="2"
                      :label="$t('Log.emptyModal.optionTwo')"
                      value="2"
                    ></el-option>
                    <el-option
                      key="3"
                      :label="$t('Log.emptyModal.optionThree')"
                      value="3"
                    ></el-option>
                    <el-option
                      key="4"
                      :label="$t('Log.emptyModal.optionFour')"
                      value="4"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">{{
                $t("buttonModule.modalCancelBtn")
              }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm('clearLogForm')"
                >{{ $t("buttonModule.modalSureBtn") }}</el-button
              >
            </span>
          </el-dialog>

      </div>
    </main-content>
  </div>
</template>

<script>
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import { getLog, clearLog, deleteLog } from "@/api/system/log";
import { dateFormat } from "../../util/date.js";
import { getOrder } from "../../util/util";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getStore } from "@/util/store";
export default {
  name: "Log",
  components: { MainFixed, MainContent },
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  data() {
	const _this = this;
    return {
      fixedTitle: this.$t("Log.fixedTitle"),
      contentTitle: "日志列表",
      contentSubTitle: "",
      searchParam: {
        CategoryId: 1
      },
      logList: [
        this.$t("Log.fixedLogin"),
        this.$t("Log.fixedAccess"),
        this.$t("Log.fixedOperating"),
        this.$t("Log.fixedAbnormal"),
		this.$t("interfaceLog"),
    this.$t("formEventLog")
      ],
      log: [],
      isActive: 0,
      logForm: {},
      clearLogForm: {
        type: ""
      },
      deleteLogId: "",
      dialogVisible: false,
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      date: [],
      option: {
        selectClearBtn: false,
        selection: true,
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel: this.$t("Log.tableNumber"),
        align: "center",
        menu: false,
        menuAlign: "center",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t("Log.tableTime"),
            prop: "F_OperateTime",
            minWidth: "140",
            align: "left",
            sortable: true,
			overHidden:true
          },
          {
            label: this.$t("Log.tableAccount"),
            prop: "F_OperateAccount",
            minWidth: "100",
            align: "left",
            sortable: true,
			overHidden:true
          },
          {
            label: this.$t("Log.tableIPAddress"),
            prop: "F_IPAddress",
            minWidth: "100",
            align: "left",
            sortable: true,
			overHidden:true
          },
          {
            label: this.$t("Log.tableFunction"),
            prop: "F_Module",
            align: "left",
            sortable: true,
			overHidden:true
          },
          {
            label: this.$t("Log.tableType"),
            prop: "F_OperateType",
            minWidth: "100",
            align: "left",
            sortable: true,
			overHidden:true
          },
          {
            label: this.$t("Log.tableResult"),
            prop: "F_ExecuteResult",
            minWidth: "100",
            align: "left",
            sortable: true,
            formatter: function(row) {
              let html = "";
              if (row.F_ExecuteResult == '成功') {
                html = '<span style="padding: 3px 5px;background-color: #67C23A;border-radius: 3px;color: #eee;">'+_this.$t('deletePrompt.successTitle')+'</span>';
              } else {
                html = '<span style="padding: 3px 5px;background-color: tomato;border-radius: 3px;color: #eee;">'+_this.$t('deletePrompt.failureTitle')+'</span>';
              }
              return html;
            },
			overHidden:true
          },
          {
            label: this.$t("Log.tableDescription"),
            prop: "F_Description",
            minWidth: "150",
            align: "left",
            sortable: true,
			overHidden:true
          }
        ]
      }
    };
  },
  created() {
    this.checkedItem(this.isActive);
  },
  mounted() {
    let themeName = getStore({ name: "themeName" }) || "default";
    if (
      (themeName == "eveningTheme" && window.screen.width < 1298) ||
      (themeName != "eveningTheme" && window.screen.width < 1298)
    ) {
      this.computedHeight = 32;
    }
    this.changeBodyHeight();
  },
  methods: {
    handleCurrentRowChange(row) {
      this.$refs.log.toggleSelection([row]);
    },
    getLog(param) {
      getLog(param).then(res => {
        this.log = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });
    },
    checkedItem(index) {
      this.isActive = index;
      this.searchParam.CategoryId = index + 1;
			this.searchParam.limit=1;
			this.page.currentPage=1
      this.getLog(this.searchParam);
      this.date = [];
    },
    /* 单击行 */
    currentRow(row) {
      this.dataItemForm = row;
    },
    /* 清除日志 */
    clearLog(type) {
      clearLog(type).then(() => {
        this.getLog(this.searchParam);
      });
    },
    selectChange(val) {
      this.clearLogForm.type = val;
    },
    /* 批量删除 */
    selectionChange(list) {
      let arr = [];
      list.forEach(function(item) {
        arr.push(item.F_LogId);
      });
      this.deleteLogId = arr.join(",");
    },
    tabelExport() {
      this.$refs["log"].rowExcel();
    },
    deleteSelect() {
      if (this.deleteLogId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          deleteLog(this.deleteLogId).then(res => {
            this.$notify({
              title: this.$t("deletePrompt.successTitle"),
              message: this.$t("deletePrompt.batchDeleteSuccess"),
              type: "success"
            });
            this.getLog(this.searchParam);
          });
        })
        .catch(() => {
          this.$notify({
            title: this.$t("deletePrompt.failureTitle"),
            message: this.$t("deletePrompt.batchDeleteFailed"),
            type: "warning"
          });
        });
    },
    /* 打开 */
    openDialog() {
      this.dialogVisible = true;
      this.clearLogForm.type = "";
    },
    /* 关闭 */
    closeDialog() {
      this.dialogVisible = false;
    },
    /* 提交 */
    submitForm() {

      this.$confirm(
        this.$t("deletePrompt.prompEmpty"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          clearLog(this.clearLogForm.type).then(() => {
            this.$notify({
              title: this.$t("deletePrompt.successTitle"),
              message: this.$t("deletePrompt.emptySuccess"),
              type: "success"
            });
			this.dialogVisible = false;
            this.getLog(this.searchParam);
          });
        })
        .catch(() => {
          this.$notify({
            title: this.$t("deletePrompt.failureTitle"),
            message: this.$t("deletePrompt.emptyFailure"),
            type: "warning"
          });
        });
    },
    /* 编辑 */
    editForm(row) {
      this.flag = false;
      this.dialogVisible = true;
      this.dataItemForm = row;
    },
    /* 删除 */
    deleteForm(row) {
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          deleteDataItem(row.F_ItemDetailId).then(() => {
            this.$notify({
              title: this.$t("deletePrompt.successTitle"),
              message: this.$t("deletePrompt.successDeleted"),
              type: "success"
            });
            this.getDataItem(this.itemCode);
          });
        })
        .catch(() => {});
    },
    /* 取消 */
    cancelDialog() {},
    /* 搜索 */
    search() {
      this.getLog(this.searchParam);
    },
    /* 搜索 表单重置 */
    searchReset() {
      this.searchParam = {
        CategoryId : this.searchParam.CategoryId,
        limit : 1,
        size: 20
      };
      this.getLog(this.searchParam);
      this.date = [];
    },
    /* 搜索日期变化 */
    dateChange(val) {
      this.searchParam.StartTime = val[0];
      this.searchParam.EndTime = val[1];
    },
    /* 排序 */
    sortChange(data) {
      this.getLog(this.searchParam);
    },
    onPageLoad(page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
      this.getLog(this.searchParam);
    },
    //限制输入特殊字符
    keyUp(e) {
      e.target.value = e.target.value.replace(
        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,
        ""
      );
    },
    // 只能输入汉字、英文、数字
    keydown(e) {
      e.target.value = e.target.value.replace(
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,
        ""
      );
    }
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

.list-box ul {
  padding-left: 0px;
  margin: 0;
}
.list-box ul > li {
  position: relative;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  cursor: pointer;

  font-size: 14px;
  color: #606266;
}
.list-box ul > li:hover {
  background-color: #f5f7fa;
}
.list-box ul > li.active {
  color: #606266;
  background-color: #e5f1ff;
}
.success-tag {
  padding: 3px 5px;
  background-color: rgb(49, 102, 3);
  border-radius: 3px;
  color: #eee;
}
.fail-tag {
  padding: 3px 5px;
  background-color: tomato;
  border-radius: 3px;
  color: #eee;
}
.list-box ul > li > i {
  padding-right: 6px;
  font-size: 12px;
  line-height: 40px;
  display: inline-block;
}
@media screen and (max-width: 1298px) {
  /deep/ .avue-crud__left {
    margin-left: 5px !important;
    float: left;
    margin-top: 40px;
  }
}
/deep/ .el-tag {
  margin: 0px 0px 5px 5px;
}
/deep/ .avue-crud .avue-crud__tip {
  display: none;
}
</style>
