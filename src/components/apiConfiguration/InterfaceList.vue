<template>
  <el-dialog
    v-dialogDrag
    v-bind="$attrs"
    width="60%"
    append-to-body
    :close-on-click-modal="false"
    class="dialog-box"
    :before-close="close"
  >
    <div slot="title">
      {{ $t("selectInterface") }}
    </div>
    <div class="content" style="height: 100%">
      <div class="main-container" >
        <main-fixed :title="fixedTitle"  :resize="true">
          <div slot="list">
            <!-- 在此处放置左侧列表内容 -->
            <el-tree
              :data="dataItemTree"
              :props="defaultProps"
              node-key="F_Id"
              ref="dTree"
              :default-expand-all="true"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
        </main-fixed>
        <main-content :paddingLeft="205" :padding-top="94">
          <div slot="search">
            <div class="search-box">
              <el-input
                v-model="searchParam.keyword"
                size="small"
                :placeholder="$t('interfaceNameOrInterfaceCode')"
                style="width: 200px; margin-right: 5px"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="searchPosts"
                >{{ $t("searchModule.searchBtn") }}</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="small"
                @click="searchReset"
                >{{ $t("searchModule.searchReset") }}</el-button
              >
            </div>
          </div>
          <div slot="table">
            <!-- 在此处放置表格内容 -->
              <avue-crud
                ref="dataItem"
                :data="dataItem"
                :option="option"
                :page.sync="page"
                @on-load="getDataItem"
              >
               <template slot="checked" slot-scope="scope">
                  <i :class="scope.row.checked===false?'fa fa-circle-thin':'el-icon-success'"
                    :style="scope.row.checked===false?'color:#999;font-size:20px':'color:#409EFF;font-size:20px'"
                    @click="changeSelect(scope.row)"></i>
                </template>
                 <template slot="F_IsCustomize" slot-scope="scope">
                    <span v-if="scope.row.F_IsCustomize==1" class="custom">{{$t('customI/F')}}</span>
                    <span v-else class="system">{{$t('systemInterface')}}</span>
                 </template>
              </avue-crud>
          </div>
        </main-content>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close()">{{
        $t("buttonModule.modalCancelBtn")
      }}</el-button>
      <el-button type="primary" @click="submit" size="small">{{
        $t("buttonModule.modalSureBtn")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import {
  getInterfaceTypeTree,
  getAllInterfaceList,
} from "@/api/systemManagement/interface";
import { deepClone } from "@/util/util";

export default {
  props: ['configData'],
  components: { MainFixed, MainContent },
  data() {
    return {
      computedHeight: -60,
      fixedTitle: this.$t("interfaceSort"),
      searchParam: {keyword:""},
      dataItemTree: [],
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
      },
      dataItem: [],
      itemCode: "",
      defaultProps: {
        children: "children",
        label: "F_Name",
      },
      selectedId:'',
      selected: {},
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menu: false,
        border: false,
        page: true,
        index: false,
        align: "center",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        height:"auto",
        column: [
          {
            label: this.$t("workFlow.User.tableSelect"),
            prop: "checked",
            align: "center",
            slot: true,
            width: "60px",
          },
          {
            label: this.$t("interfaceManage.addModal.labelName"),
            prop: "F_Name",
            align: "left",
            sortable: true,
            overHidden: true,
          },
          {
            label: this.$t("interfaceCodeOlnyCustom"),
            prop: "F_EnCode",
            align: "left",
            sortable: true,
            overHidden: true,
          },
          {
            label: this.$t("interfaceSource"),
            prop: "F_IsCustomize",
            align: "left",
            slot: true,
            sortable: true,
            overHidden: true,
          },
          {
            label: this.$t("interfaceManage.addModal.labelAddress"),
            prop: "F_UrlAddress",
            align: "left",
            sortable: true,
            overHidden: true,
          },
          {
            label: this.$t("orgUserManagement.tabRemark"),
            prop: "F_Description",
            align: "left",
            sortable: true,
            overHidden: true,
          },
        ],
      },
    };
  },
  created() {
    if(this.configData.id){
      this.selectedId = this.configData.id;
      this.selected = {F_Id:this.configData.id};
    }
    this.getDataItemTree();
  },
  methods: {
    /* 获取分类树 */
    async getDataItemTree() {
      const res = await getInterfaceTypeTree();
      this.dataItemTree = res.data.data;
      // this.itemCode = res.data.data[0]?.F_Id||'';
      // /* 左侧树形菜单默认选中第一个 */
      // this.$nextTick(() => {
      //   this.$refs.dTree.setCurrentKey(res.data.data[0].F_Id);
      // });
    },
    /* 选择树形菜单加载接口信息 */
    handleNodeClick(data) {
      this.searchParam.keyword = null;
      this.itemCode = data.F_Id;
      this.getDataItem();
    },
    getDataItem() {
      let params = {
		  limit: this.page.currentPage,
		  size: this.page.pageSize,
		  Keyword: this.searchParam.keyword,
		  category:this.itemCode
		};
      getAllInterfaceList(params).then(({ data: { data } }) => {
        this.dataItem = data.Rows.map(ele=>{
          ele.checked = false;
          if(this.selectedId&&ele.F_Id==this.selectedId){
            ele.checked = true;
          }
          return ele;
        });
        this.page.total = data.Total;
      });
    },
    changeSelect(row) {
      this.dataItem = this.dataItem.map((ele) => {
         ele.checked = false;
         return ele;
        });
      row.checked = !row.checked;
      this.selected = deepClone(row);
    },
    submit() {
      this.$emit("changeData", this.selected);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    },
    /* 搜索 */
    searchPosts() {
      this.getDataItem();
    },
    /* 搜索 表单重置 */
    searchReset() {
      this.searchParam = {};
      this.getDataItem();
    },
  },
};
</script>

<style lang="scss" scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
.code-build-box {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1999;
  background-color: #fff;
}
.dialog-box {
  ::v-deep .el-dialog {
    background-color: #fff !important;
    border-radius: 2px;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    height: calc(100% - 30vh);
    overflow: hidden;
    box-sizing: border-box;
    .el-dialog__header {
      padding-top: 14px;
      color: #303133;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 0;
      height: calc(100% - 100px);
    }
  }
}
div ::v-deep .avue-crud__pagination{
  position: absolute;
}
.custom{
  color:#02a7f0;
}
.system{
 color: #f59a23;
}
div .avue-crud  ::v-deep .el-table {
  height: calc(100% - 110px) !important;
}
</style>
