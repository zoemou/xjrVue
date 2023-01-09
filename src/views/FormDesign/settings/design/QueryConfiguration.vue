<template>
  <div class="main-container">
    <avue-crud
      ref="queryTable"
      :data="activeData.__config__.triggerEventData[triggerEventName]"
      :option="queryoption"
      stripe
      @sortable-change="sortableChange"
    >
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove del-icon" @click="deleteData(scope)"></i>
      </template>
      <template slot="componentFormId" slot-scope="scope">
        <el-select v-model="scope.row.componentFormId" :placeholder="$t('pleaseSelectComp')">
          <el-option
            v-for="item in componentFormList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template slot="componentEvent" slot-scope="scope">
        <el-select
          v-model="scope.row.componentEvent"
          :placeholder="$t('selectTriggerEvent')"
        >
          <el-option
            v-for="item in componentEventList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
    </avue-crud>
  </div>
</template>

<script>
export default {
  props: ["activeData","triggerEventName","componentFormList"],
  data() {
    return {
      componentEventList: [
        {
          label:this.$t('refreshApiDataSource'),
          value: "dataApi",
        },
      ],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: "auto", //表格高度差（主要用于减去其他部分让表格高度自适应）
        height: "100%", //表格高度
        maxHeight: "auto",
        border: true,
        align: "center",
        menu: false,
        page: false,
        sortable: true,
        dragHandler: true,
        header: false,
        column: [
          {
            label: "",
            prop: "add",
            renderHeader: (h) => {
              return h("i", {
                style: { color: "#409EFF", fontSize: "20px", display: "block" },
                class: "el-icon-circle-plus",
                on: {
                  click: this.addRow,
                },
              });
            },
            width: "50px",
            slot: true,
          },
          {
            label: this.$t('compName'),
            prop: "componentFormId",
            slot: true,
          },
          {
            label:this.$t('trigEvent'),
            prop: "componentEvent",
            slot: true,
          },
        ],
      },
    };
  },
  methods: {
    deleteData(scope) {
      this.activeData.__config__.triggerEventData[this.triggerEventName].splice(scope.row.$index, 1);
    },
    sortableChange(oldindex, newindex, row, list) {
      this.activeData.__config__.triggerEventData[this.triggerEventName] = [];
      this.$nextTick(() => {
        this.activeData.__config__.triggerEventData[this.triggerEventName] = list;
      });
    },
    addRow() {
      var obj = {
        componentFormId: "",
        componentEvent: "dataApi",
      };
      this.activeData.__config__.triggerEventData[this.triggerEventName].push(obj);
    },
  },
};
</script>

<style scoped>
.main-container {
  height: 100%;
}
.avue-crud {
  height: 100%;
}
.del-icon {
  color: #f56c6c;
  font-size: 20px;
  display: block;
}
div /deep/ .el-input__icon {
  line-height: 20px;
}
div /deep/ .el-table__body-wrapper {
  overflow-y: scroll !important;
  height: calc(100% - 160px) !important;
}
</style>
