<template>
  <div class="main-container">
    <main-content :title="contentTitle" :padding-top="94" >
      <div slot="search">
        <div class="search-box">
          <el-date-picker
            v-model="search.timeRelation"
            type="daterange"
            :range-separator="$t('searchModule.rangeSeparator')"
            :start-placeholder="$t('searchModule.startDatePlaceholder')"
            :end-placeholder="$t('searchModule.endDatePlaceholder')"
            class="date-picker"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
          <el-input
            v-model="search.keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
           class="search"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchMenu">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-circle-close" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table" style="height:100%">
        <avue-crud
          ref="cuTable"
          :data="AvueCrud.data"
          :option="AvueCrud.option"
          stripe
          :page.sync="AvueCrud.page"
           @on-load="onPageLoad"
          @row-click="handleCurrentRowChange"
        >
          <template slot="menuLeft">
            <el-button
              v-for="(item, index) in AvueCrud.menuLeft"
              :key="index"
              :type="item.type"
              :icon="item.icon"
              size="small"
              @click="menuLeftFun(item.eventName)"
              >{{ item.title }}</el-button
            >
          </template>
          <template slot="menu">
            <el-button
              v-for="(item, index) in AvueCrud.menu"
              :key="index"
              :type="item.type"
              size="mini"
              :icon="item.icon"
              @click="menuActFun(item.eventName, scope.row, scope.index)"
              >{{ item.title }}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog
      v-if="elDialog.visible"
      :visible.sync="elDialog.visible"
      :title="elDialog.title"
      :width="elDialog.width"
      :append-to-body="elDialog.appendToBody"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="true"
      :fullscreen="true"
      :destroy-on-close="true"
    >
      <LookFLow
          v-if="elDialog.visible"
          :nwfSchemeInfoId="flowData.nwfSchemeInfoId"
          :taskId="flowData.taskId || flowData.processInstanceId" 
          :processInstanceId="flowData.processInstanceId" 
      ></LookFLow>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="elHistoryDialog.title"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="historyDialog"
      width="60%"
      :before-close="historyClose"
    >
      <div class="table">
        <avue-crud
          ref="historyData"
          :data="historyData"
          :option="historyOption"
          @row-click="historyRowClick"
        >
          <template slot="menuLeft">
            <el-button type="default" size="small" icon="fa fa-refresh" @click="hsitoryRefresh"></el-button>
            <el-button type="default" size="small" icon="fa fa-eye" @click="hsitoryView">{{$t('workFlow.WFChange.previewBtn')}}</el-button>
            <el-button type="test" size="small" icon="fa fa-glass" @click="testHistory">{{$t('workFlow.WFChange.testBtn')}}</el-button>
            <el-button type="primary" size="small" icon="fa fa-random" @click="historyDetailUpdateDialog = true"
              >{{$t('workFlow.WFChange.updateBtn')}}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.WFChange.titleOutputInfor')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="historyDetailDialog"
      width="30%"
      :before-close="historyDetailClose"
    >
      <pre v-html="preContent"></pre>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="historyDetailClose">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.WFChange.titleOutputInfor')"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="historyDetailUpdateDialog"
      width="30%"
      :before-close="historyDetailUpdateClose"
    >
      <div><i class="fa fa-question-circle-o"></i>{{$t('workFlow.WFChange.hintChange')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateHistory">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog v-dialogDrag
      :title="$t('workFlow.WFChange.previewBtn')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="historyDetailBpmnDialog"
      width="50%"
      :before-close="historyDetailBpmnClose"
    >
      <div class="img-box">
        <img :src="historyDetailBpmn" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MainContent from "../../page/main/MainContent"; //右则页面的自定义布局组件
import LookFLow from "./components/LookFLow"; //流程查看组件
import { getStore } from "@/util/store";
// 接口
import {
  getDataItem,
  getUnfinishedTask,
  getHistoryTask,
  postTestHistoryTask,
  postUpdateHistoryTask,
} from "@/api/workFlow/WFChange";
export default {
  name: "WFChange",
  props: {
    showLeftTree: {
      type: String,
    },
    //弹层框传传接收
    FKLayerBoxComponentParams: {
      type: [String, Number, Boolean, Array, Object, Date, Function, Symbol],
    },
  },
  components: { MainContent, LookFLow },
  data() {
	const _this = this;  
    return {
      contentTitle: "流程任务列表", // 右则内容区标题
      // 搜索
      search: {
        keyword: "", //关键字
        timeRelation: "", //区间日期
        // 区间日期格式化
        startTime: null,
        endTime: null,
        // 附加参数
        relationTaskInfo: null,
      },
      // 对话框组件
      elDialog: {
        visible: false,
        title: "弹框示题",
        width: "30%",
        appendToBody: true,
      },
      //变更
      elHistoryDialog: {
        title: this.$t('workFlow.WFChange.titleHistoryRecord'),
      },
      // 流程预览组件
      flowData: {
        nwfSchemeInfoId:"",
        taskId:"",
        processInstanceId:"",
      },
      //变更流程 弹框
      historyDialog: false,
      historyData: [],
      F_HistoryId: "",
      historyOption: {
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 150,
        border: true,
        page: true,
        index: true,
        indexLabel: this.$t('tableOperationModule.tabNum'),
        align: "center",
        menuAlign: "center",
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menu: false,
        columnBtn: false, //列显隐按钮	Boolean
        refreshBtn: false, //	刷新按钮	Boolean
        column: [
          { label: this.$t('workFlow.WFChange.tabCreateUser'), prop: "F_CreateUserName" },
          { label: this.$t('workFlow.WFChange.tabCreateDate'), prop: "F_CreateDate" },
          {
            label: this.$t('workFlow.WFChange.tabState'),
            prop: "F_EnabledMark",
            formatter: (row) => {
              return row.F_EnabledMark === 1 ? "正式" : "草稿";
            },
          },
          {
            label:this.$t('workFlow.WFChange.tabVersion'),
            prop: "F_version",
            formatter: (row) => {
              return row.F_version + (row.F_version == row.currentVersion ? "(当前版本)" : "");
            },
          },
        ],
      },
      historyDetailDialog: false,
      preContent: "",
      historyDetailUpdateDialog: false,
      //变更  预览
      historyDetailBpmnDialog: false,
      historyDetailBpmn: "",
      // 左则页面的自定义布局组件 的 数据
      // 表格组件
      AvueCrud: {
        data: [], //显示的数据
        order: {
          order: "desc", //排序方式
          prop: "", //默认排序字段
        },
        //分页配置选项
        page: {
          total: 0, // 总条数,如果为0的话不显示分页	Number
          currentPage: 1, //当前页码	Number
          background: true, //分页背景	Boolean
          pageSize: 20, //每页显示多少条	Number
          pageSizes: [10, 20, 30, 50, 100], //分页的数组分段	Array
          pagerCount: 5, //多少页后中间隐藏
        },
        option: {
          header: false, //	头部显隐	Boolean
          page: true, //是否显示分页选择器
          simplePage: true, // 只有1页的时候，分页选择器会隐藏
          highlightCurrentRow: true, //如果要高亮当前行
          stripe: false, //是否显示表格的斑马条纹
          menu: false, // 是否显示操作菜单栏
          menuWidth: 150, // 操作菜单栏的宽度	Number
          // calcHeight: 140, //自己动计算 height 减去的高度
          // height: "auto", //表格高度	Number
          // maxHeight: "auto", //表格最大高度	Number
          border: false, //表格边框	Boolean
          index: true, //是否显示表格序号（根据分页会自动计算，比如每页10行，到了第二页就会从11开始记数）	Boolean	true/false
          indexLabel:this.$t('tableOperationModule.tabNum'), //序号的标题	String
          align: "left", //表格列齐方式	String	left/center/right
          menuAlign: "center", //菜单栏对齐方式	String	left/center/right
          addBtn: false, //	添加按钮	Boolean
          addTitle: this.$t('workFlow.WFChange.addTitle'), //	新增窗口文案	String
          delBtn: false, //行内删除按钮	Boolean
          editBtn: false, //行内编辑按钮	Boolean
          columnBtn: false, //列显隐按钮	Boolean
          refreshBtn: false, //	刷新按钮	Boolean
          //表格列数据
          column: [
            {
              label: this.$t('workFlow.WFChange.tabSerialNum'),
              prop: "serialNumber",
            },
            {
              label:this.$t('workFlow.WFChange.tabTask'),
              prop: "taskName", //'',
            },
            {
              label:this.$t('workFlow.WFChange.tabTitle'),
              prop: "schemeName", //'',
            },
            {
              label:this.$t('workFlow.WFChange.tabGrade'),
              prop: "priority",
			  width:'70',
              formatter: function(row, value, label, column) {
                if (value >= 0 && value <= 19) {
                  return  _this.$t('workFlow.WFChange.lowestLevel');
                } else if (value >= 20 && value <= 39) {
                  return  _this.$t('workFlow.WFChange.low');
                } else if (value >= 40 && value <= 59) {
                  return  _this.$t('workFlow.WFChange.generally');
                } else if (value >= 60 && value <= 79) {
                  return  _this.$t('workFlow.WFChange.highLevel');
                }
              },
            },
            {
              label: this.$t('workFlow.WFChange.tabStartUser'),
              prop: "startUser",
			  width:'100'
            },
            {
              label:this.$t('workFlow.WFChange.tabTime'),
              prop: "createTime",
			  width:'140'
            },
          ],
        },
        //表格操作菜单
        menu: [],
        // 表格顶部左侧按扭
        menuLeft: [
          {
            title: this.$t('workFlow.WFChange.refreshBtn'),
            icon: "fa fa-refresh",
            type: "primary",
            eventName: "searchMenu",
			
          },
          {
            title:this.$t('workFlow.WFChange.viewBtn'),
            // icon: "fa fa-eye",
            type: "default",
            eventName: "eyeHistory",
          },
          {
            title: this.$t('workFlow.WFChange.flowChangeBtn'),
            // icon: "fa fa-edit",
            type: "default",
            eventName: "changeHistory",
          },
        ],
        // 表格当前选中的行
        currentRow: null, //表格当前数据
      },
    };
  },
  created() {
    this.search.relationTaskInfo = this.FKLayerBoxComponentParams;

    if (this.AvueCrud.menuLeft && this.AvueCrud.menuLeft.length) {
      this.AvueCrud.option.header = true;
    }
    if (this.AvueCrud.menu && this.AvueCrud.menu.length) {
      this.AvueCrud.option.menu = true;
    }
    this.searchMenu();
  },
  mounted(){
  	  let themeName = getStore({ name: "themeName" }) || "default";

  	  this.changeBodyHeight();
  	},
  methods: {
	  changeBodyHeight() {
	    //根据组件高度重新计算table高度，超出出现滚动条
	  let themeName = getStore({ name: "themeName" }) || "default";
	  let defaultSearchBox = 112;
	  let computedHeight =110+defaultSearchBox;
	  //暗色主题  
	  if(themeName == "eveningTheme") {
	    computedHeight = computedHeight+ 40;
	  }
	   // 深色主题  
	  if(themeName == "darkTheme") {
	    computedHeight = computedHeight+40;
	  }
	  
	  let clientHeight = document.documentElement.clientHeight
	  this.AvueCrud.option.height = clientHeight - computedHeight;
	},
    onPageLoad(page){
      this.AvueCrud.page.currentPage = page.currentPage;
      this.searchMenu();
    },
    handleCurrentRowChange(row) {
          this.AvueCrud.currentRow = row;
    },
    searchMenu() {
      const param = {
        size: this.AvueCrud.page.pageSize,
        limit: this.AvueCrud.page.currentPage,
        keyword: this.search.keyword,
        startTime: this.search.timeRelation[0],
        endTime: this.search.timeRelation[1],
      };

      getUnfinishedTask(param)
        .then((result) => {
          let res = result.data;
          if (res.success) {
            if(!res.data) return;
            if (!res.data) {
              return false;
            }
            this.AvueCrud.page.total = res.data.length || res.data.Total;
            this.AvueCrud.data = res.data.Rows || res.data;
          }
        });
    },
    searchReset() {
      this.search.keyword = "";
      this.search.timeRelation = ""; 
    },

    menuLeftFun(name) {
      if (!name) return;

      if (name == "searchMenu" || this.AvueCrud.currentRow) {
        if (this[name]) {
          this[name]();
        }
      } else {
        this.$alert(this.$t('workFlow.WFChange.hintSelectRow'),  this.$t('workFlow.WFChange.hintTips'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'),
          type: "info",
        });
      }
    },
    menuActFun(name, row, index) {
      if (!name) return;
      if (this[name]) {
        this[name](row, index);
      }
    },
    // 查看
    eyeHistory() {
      let title = this.AvueCrud.currentRow.schemeName; // + "/" + this.AvueCrud.currentRow.taskName;
      this.elDialog.title = this.$t('workFlow.WFChange.viewProgress')+"【" + title + "】";
      this.flowData.processInstanceId = this.AvueCrud.currentRow.processInstanceId;
      this.flowData.taskId = this.AvueCrud.currentRow.taskId;
      this.elDialog.visible = true; // 显示对话框组件
    },
    //变更流程
    changeHistory() {
      let title =
        this.AvueCrud.currentRow.taskId +
        " " +
        this.AvueCrud.currentRow.taskName +
        " | " +
        this.AvueCrud.currentRow.startUser +
        "(" +
        this.AvueCrud.currentRow.serialNumber +
        " " +
        this.AvueCrud.currentRow.schemeName +
        ")";
      this.elHistoryDialog.title = this.$t('workFlow.WFChange.flowChangeBtn') + title + "";
      this.history();
    },
    history() {
      this.historyDialog = true;
      this.getHistoryData();
    },
    getHistoryData() {
      let id = this.AvueCrud.currentRow.processInstanceId;
      let param = {
        processInstanceId: id,
        size: this.AvueCrud.page.pageSize,
        limit: this.AvueCrud.page.currentPage,
      };
      getHistoryTask(param).then((res) => {
        if (!res.data.data || res.data.data.length <= 1) {
          this.$notify({
            title: this.$t('deletePrompt.promptTitle'),
            message: res.data.msg,
            type: "success",
          });
          this.historyData = [];
          return false;
        }
        this.historyData = res.data.data;
      });
    },
    historyClose() {
      this.historyDialog = false;
    },
    historyRowClick(row, event, column) {
      this.F_HistoryId = row.F_DeploymentId;
      this.historyDetailBpmn = row.bpmn;
    },
    hsitoryRefresh() {
      this.getHistoryData();
    },
    hsitoryView() {
      if (!this.F_HistoryId) {
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
        return false;
      }
      this.historyDetailBpmnDialog = true;
    },
    testHistory() {
      if (!this.F_HistoryId) {
        this.$notify({
          title: this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
        return false;
      }
      let param = {
        processInstanceId: this.AvueCrud.currentRow.processInstanceId,
        deploymentId: this.F_HistoryId,
      };
      postTestHistoryTask(param).then((res) => {
        this.historyDetailDialog = true;
        this.preContent = res.data.data ? res.data.data : res.data.msg;
      });
    },
    updateHistory() {
      this.historyDetailUpdateClose();
      if (!this.F_HistoryId) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.operationHint'),
          type: "warning",
        });
        return false;
      }
      let param = {
        processInstanceId: this.AvueCrud.currentRow.processInstanceId,
        deploymentId: this.F_HistoryId,
      };
      postUpdateHistoryTask(param).then((res) => {
        this.historyDetailDialog = true;
        this.preContent = res.data.data ? res.data.data : res.data.msg;
      });
    },
    historyDetailClose() {
      this.historyDetailDialog = false;
    },
    historyDetailBpmnClose() {
      this.historyDetailBpmnDialog = false;
    },
    historyDetailUpdateClose() {
      this.historyDetailUpdateDialog = false;
    },
  },
};
</script>
<style scoped>
.main-container{
  padding:0 8px;
}
.date-picker{
  width: 250px; margin-right: 5px;
}
.search{
  width: 200px; margin-right: 5px;
}
.el-dialog__body .avue-crud {
  margin-top: 10px;
}
.el-button--test {
  background-color: #fe9400;
  color: #fff;
}
pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.img-box img {
  width: 100%;
}
  /* 表格顶部左侧按扭样式 */
  div /deep/ .el-button [class*=fa-]+span {
    margin-left: 5px;
  }
  .main-search .main-search-box .search-item .search-box .search{
    display: inline-flex;
  }
  .main-search-box .search-item .search-box .el-date-editor .el-range-separator{
    width: 10%;
  }
  /deep/ .search-box{
	  right: 8px;
  }
  /deep/ .avue-crud__left{
	  margin: 7px 6px 2px 0px;
  }
  /deep/ .avue-crud__menu{
	  z-index: 999;
  }
</style>
