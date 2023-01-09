<template>
  <div class="main-container">
    <avue-crud
      ref="queryTable"
      :data="triggerEventData"
      :option="queryoption"
      stripe
      @sortable-change="sortableChange"
    >
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove del-icon" @click="deleteData(scope)"></i>
      </template>
      <template slot="nodeType" slot-scope="scope">
        <el-select v-model="scope.row.nodeType" :placeholder="$t('selectOperteType')">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template slot="apiConfig" slot-scope="scope">
        <div  @click="handClick(scope.row.$index)">
          <ApiConfig :apiConfig="scope.row.apiConfig" v-bind="$attrs" :allComponents="allComponents" @submitApiDialog="submitApiDialog" :isFormEvent="true" :nodeType="nodeType"></ApiConfig>
        </div>
        
      </template>
    </avue-crud>
  </div>
</template>

<script>
import ApiConfig from "@/components/apiConfiguration/ApiConfig.vue";
export default {
  components: {
    ApiConfig,
  },
  props: [
    'triggerEventData',
    'allComponents',
    'nodeType'
  ],
  data() {
    return {
      submitApiIndex:-1,
      typeList:[{
        label:this.$t('executeApi'),
        value:'api'
      }],
      // triggerEventData:[],
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
            label:this.$t('operateClass'),
            prop: "nodeType",
            slot: true,
          },
          {
            label: this.$t('operateConfig'),
            prop: "apiConfig",
            slot: true,
          },
        ],
      },
    };
  },
  methods: {
    deleteData(scope) {
      this.triggerEventData.splice(scope.row.$index, 1);
    },
    sortableChange(oldindex, newindex, row, list) {
      this.triggerEventData = [];
      this.$nextTick(() => {
        this.triggerEventData = list;
      });
    },
    addRow() {
      var obj = {
        nodeType: "api",
        apiConfig:{
          url:"",
          F_UrlAddress:"",
          type: "",
          apiInputParams:[],
          outputs:[],
          inputList:[]
        }
      };
      this.triggerEventData.push(obj);
    },
    submitApiDialog(configData){
      this.triggerEventData[this.submitApiIndex].apiConfig = configData;
      this.submitApiIndex = -1;
    },
    handClick(index){
      this.submitApiIndex = index;
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
