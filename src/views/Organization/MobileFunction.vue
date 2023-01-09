<template>
    <div class="main-container">
                <!-- 在此处放置左边列表内容--树形菜单 -->
        <main-fixed :title="fixedTitle" :resize="true">
            <div slot="list">
                <el-tree
                    :data="menuTree"
                    :props="defaultProps"
                    node-key="F_ItemDetailId"
                    ref="cTree"
                    :default-expand-all="false"
                    @node-click="handleNodeClick"    
                >
                    <!-- <span class="custom-tree-node" slot-scope="{ node, data}">
                        <i class="el-icon-document"></i>
                        <span>{{data.F_ItemName}}</span>
                    </span> -->
                </el-tree>
            </div>
        </main-fixed>

        <main-content :title="contentTitle" :paddingLeft="205" :padding-top="94">
            <div slot="search">
                <!-- 搜索内容 -->
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
                    >
                        {{ $t("searchModule.searchBtn") }}
                    </el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">
                        {{$t("searchModule.searchReset")}}</el-button>
                </div>
            </div>
            <div slot="table">
                <!-- 数据表格内容 -->
                <avue-crud
                    ref="cuTable"
                    v-if="F_Item"
                    :data="menuTable"
                    :option="option"
                    stripe
                    :page.sync="page"
                    :showColumn="showColumn"
                    :isSaveColumns="true"
                    @on-load="onPageLoad"
                    @row-click="rowClick"
                    @row-dblclick="handleRowDBLClick"
                >
                    <template slot="menuLeft">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="small"
                            @click="add()"
                            v-if="hasButtonPermission('add')"
                        >
                            <!-- ******新增****** -->
                            {{$t('buttonModule.addBtn')}}
                        </el-button>
                            <!-- ******启用停用事件尚未处理******* -->
                        <!-- <el-button size="small" @click="showOkDialog">启用</el-button>
                        <el-button size="small" @click="showOkDialog">停用</el-button> -->
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <!-- 编辑 -->
                        <el-button
                            type="opr-primary"
                            size="mini"
                            @click="edit(scope.row,scope.index)"
                            v-if="hasButtonPermission('modify')"
                            >{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button
                            type="opr-danger"
                            size="mini"
                            @click="deleteForm(scope.row,scope.index)"
                            v-if="hasButtonPermission('delete')"
                            >{{$t('tableOperationModule.deleteBtn')}}</el-button>
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
        <AddMobileFunc
            v-if="dialogVisible"
            :FuncId="F_Id"
            @closeDialog="closeDialog"
        ></AddMobileFunc>
    </div>
</template>

<script>
import tableOptionMixin from "@/mixins/tableOption";
import authorizeMixin from "@/mixins/authorize";//鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import AddMobileFunc from "./components/app/Menu.vue";
import { getAppFunc } from "@/api/language/dictionary";
import {
    getFunc,
    deleteFunc
} from "@/api/organization/mobileFunc";
export default {
    name:"MobileFunction",
    mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
     components: { MainContent, MainFixed, AddMobileFunc },
    data () {
        const _this = this;
        return{
            contentTitle: "移动功能",
            fixedTitle:this.$t('mobileDev.functionDesignStepEight.labelFunType'),
            F_Item: "",
            searchState: "",
            menuTree: [],
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
            keyword: null,
            defaultProps: {
                children: "children",
                label: "F_ItemName",
            },
            dialogVisible: false,
            okDialog: false,
            okMessage: "",
            F_Id: "",
            okVal: "",
            option: {
                highlightCurrentRow: true,
                stripe: false,
                addBtn: false,
                menuWidth: 150,
                border: false,
                page: true,
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
                        label:this.$t('forme.tableHeaderFunctionName'),
                        prop: "F_Name",
                        align: 'left',
                        minWidth: '95',
                    },
                    {
                        sortable: true,
                        label:this.$t('mobileDev.functionDesignStepEight.labelFunType'),
                        prop: "F_TypeName",
                        align: 'left',
                        minWidth: '95',
                    },
                    // {
                    //     label:this.$t('workFlow.WFDesign.tabCreateUser'),
                    //     prop: "F_CreateUserName",
                    //     width:'110',
                    //     align: 'left',sortable:true
                    // },
                    // {
                    //     label:this.$t('workFlow.WFDesign.tabCreateDate'),
                    //     prop: "F_CreateDate",
                    //     width:'140',
                    //     align: 'left',sortable:true
                    // },
                    // {
                    //     sortable: true,
                    //     label: "状态",
                    //     prop: "F_EnabledMark",
                    //     align: 'left',
                    //     minWidth: '85',
                    //     formatter: function (row) {
                    //         return row.F_EnabledMark === 0 ? _this.$t('buttonModule.deactivateBtn'): _this.$t('custmerForm.tableEnable');
                    //     },
                    // },
                ]
            },
        };
    },
    mounted() {
        this.getAppFunc();
        // this.getFunc();
        this.getItemList();
    },
    methods: {
        handleRowDBLClick (row, event) {
            if(this.openDoubleClickEdit){
                this.edit(row)
            }
        },
        /* 获取菜单树形数据 */
        getAppFunc() {
            getAppFunc("function").then((res) => {
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
        /*表格数据 */
        getItemList() {
            var obj = {
                type: this.F_Item.F_ItemValue,
                // EnabledMark: this.searchState == "" ? null : this.searchState,
                limit: this.page.currentPage,
                size: this.page.pageSize,
                keyword: this.keyword,
                order: this.order.order,
                orderfield: this.order.prop,
            };
            getFunc(obj).then((res) => {
                this.page.total = res.data.data.Total;
                this.menuTable = res.data.data.Rows;
            });
        },
        /*分页 */
        onPageLoad () {
            this.getItemList();
        },
        /* 新增 */
        add() {
            this.dialogVisible = true;
            this.F_Id = "";
        },
        closeDialog(val){
          this.dialogVisible = false;
          if(val){
            this.getItemList();
          }
        },
        /* 关闭弹窗 */
        handleClose(done) {
            done();
        },
        /* 表格编辑 */
        edit(row, index) {
            this.dialogVisible = true;
            this.F_Id = row.F_Id;
            this.F_StampId = row.F_StampId;
        },
        /*表格删除 */
        deleteForm(row, index) {
        this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
            confirmButtonText:this.$t('buttonModule.modalSureBtn'),
            cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
            type: "warning",
        })
            .then(() => {
            deleteFunc(row.F_Id).then(() => {
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
            this.F_Id = row.F_Id;
        },
    }
}
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
  height: calc(100% - 51px);
}
div /deep/ .custom-tree-node span {
  font-size: 14px;
  padding-left: 10px;
}
div /deep/ .custom-tree-node i {
  font-size: 12px;
}
div /deep/ .avue-crud__left {
  height: 31px;
}
</style>