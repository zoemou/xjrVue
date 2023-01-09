<template>
  <div v-if="PrepositionTask.length > 0">
    <div v-for="(item, index) in PrepositionTask" :key="index">
      <label>{{ item.F_ObjName }}</label>
      <el-input
        placeholder="===请选择==="
        size="small"
        v-model="item.processInstanceName"
      >
        <i
          slot="suffix"
          class="el-icon-more"
          @click="showDialog(index, item)"
        ></i>
      </el-input>
    </div>
    <el-dialog v-dialogDrag
      title="选择任务"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="searchForm.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入要查询的关键字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <avue-crud
        :data="list"
        :option="option"
        stripe
        :page.sync="page"
        @current-change="currentChange"
        @row-click="handleCurrentChange"
      >
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRelationTaskList } from "@/api/workFlow/WFLaunch";
export default {
  props: {
    PrepositionTask: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      list: [],
      currentRow: null,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total,pager,prev, next",
        background: false,
        pageSize: 5,
      },
      option: {
        align: "center",
        menu: false,
        addBtn: false,
        columnBtn: false,
        highlightCurrentRow: true,
        index: true,
        indexLabel: "序号",
        column: [
          {
            label: "任务",
            prop: "taskName",
          },
          {
            label: "标题",
            prop: "schemeName",
          },
          {
            label: "等级",
            prop: "priority",
          },
          {
            label: "发起者",
            prop: "startUser",
          },
          {
            label: "时间",
            prop: "createTime",
          },
        ],
      },
      searchForm: {
        dateTime: "",
        keyword: "",
      },
      changeIndex: -1,
      changeItem: "",
    };
  },
  methods: {
    async showDialog(index, item) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      this.changeIndex = index;
      this.changeItem = JSON.stringify(item);
      this.list = [];
      try {
        let res = await getRelationTaskList({
          limit: this.page.currentPage,
          size: this.page.pageSize,
          relevanceTask: this.changeItem,
        });
        let resData = [];
        if (res.data.success) {
          resData = res.data.data.Rows;
        }
        this.page.total = res.data.data.Total ? res.data.data.Total : 0;
        this.list = resData;
      } catch (error) {
      }
      loading.close();
      this.dialogVisible = true;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    currentChange() {
      this.search();
    },
    async search() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      this.changeIndex = -1;
      this.list = [];
      let startTime = "";
      let endTime = "";
      if (this.searchForm.dateTime.length == 2) {
        startTime = this.searchForm.dateTime[0];
        endTime = this.searchForm.dateTime[1];
      }
      try {
        let res = await getRelationTaskList({
          limit: this.page.currentPage,
          size: this.page.pageSize,
          startTime,
          endTime,
          keyword: this.searchForm.keyword,
          relevanceTask: this.changeItem,
        });
        let resData = [];
        if (res.data.success) {
          resData = res.data.data.Rows;
        }
        this.page.total = res.data.data.Total ? res.data.data.Total : 0;
        this.list = resData;
      } catch (error) {
      }

      loading.close();
    },
    submit() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      let processInstanceId = this.currentRow.processInstanceId;
      let processInstanceName = this.currentRow.taskName?this.currentRow.taskName:this.currentRow.schemeName;
      this.PrepositionTask[
        this.changeIndex
      ].processInstanceId = processInstanceId;
      this.PrepositionTask[
        this.changeIndex
      ].processInstanceName = processInstanceName;
      let data = this.PrepositionTask.filter((ele) => {
        return ele.processInstanceId;
      });
      this.$emit("changeRelationTabs", data);
      loading.close();
      this.close();
    },
    close() {
      this.changeIndex = -1;
      this.list = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  font-size: 12px;
}
</style>
