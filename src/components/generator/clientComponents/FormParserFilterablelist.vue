<template>
  <el-dialog
    v-dialogDrag
    :title="conf.title"
    :visible.sync="visible"
    :append-to-body="true"
    :modal="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :destroy-on-close="true"
    width="60%"
    top="10vh"
  >
    <div class="empty-data" v-if="!list.length">{{$t('user.setting.hintLoading')}}</div>
    <div v-if="list.length" style="width: 100%">
      <div class="search-box">
        <el-input
          v-model="keyword"
          size="small"
          :placeholder="$t('searchModule.searchPlaceholder')"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="search"
          >{{$t('searchModule.searchBtn')}}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset"
          >{{$t('searchModule.searchReset')}}</el-button
        >
      </div>
      <template v-if="type == 'single'">
        <el-radio-group v-model="radio">
          <avue-crud :data="pageList" :option="option" stripe :page.sync="page">
            <template slot="radioProp" slot-scope="{ row }">
              <el-radio :label="row[conf.saveField]">{{
                row.$index + 1
              }}</el-radio>
            </template>
          </avue-crud>
        </el-radio-group>
        <div class="page-box">
          <el-pagination
            @size-change="sizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.total"
          >
          </el-pagination>
        </div>
      </template>
      <template v-else>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('dataSelect')" name="data">
            <el-checkbox-group
              v-model="checkedArr"
              @change="handleCheckedChange"
            >
              <avue-crud
                :data="pageList"
                :option="option"
                stripe
                :page.sync="page"
              >
                <template slot="radioProp" slot-scope="{ row }">
                  <el-checkbox
                    :label="row[conf.saveField]"
                    :checked="checkedArr.includes(conf.saveField)"
                    >{{ row.$index + 1 }}</el-checkbox
                  >
                </template>
              </avue-crud>
            </el-checkbox-group>
            <div class="page-box">
              <el-pagination
                @size-change="sizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="page.total"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('selectedData')" name="selected">
            <avue-crud
              v-if="activeName == 'selected'"
              :data="selectedList"
              :option="selectedoption"
              stripe
            >
              <template slot="del" slot-scope="{ row }">
                <el-button
                  type="opr-primary"
                  class="del-btn"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delRow(row)"
                ></el-button>
              </template>
            </avue-crud>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <div slot="footer">
      <el-button @click="handleClose"> {{$t('buttonModule.modalCancelBtn')}} </el-button>
      <el-button type="primary" @click="handelConfirm"> {{$t('buttonModule.modalSureBtn')}} </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      activeName: "data",
      visible: true,
      list: [],
      page: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
      keyword: "",
      option: {
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        menuWidth: 150,
        height:400,
        // maxHeight: window.innerHeight - 300,
        border: true,
        page: false,
        index: false,
        companyId: "",
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [],
      },
      initOptionColumn: false,
      radio: "",
      checkedAll: false,
      isIndeterminate: false,
      checkedArr: [],
      fields: "",
      selectedList: [],
      selectedoption: {
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        menuWidth: 150,
        height:400,
        // maxHeight: window.innerHeight - 300,
        border: true,
        page: false,
        index: false,
        companyId: "",
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [],
      },
      originOptionList: [],
      pageList: [],
      apiConfig:{},
      formFieldsMap:new Map(),
      formData:{}
    };
  },
  props: {
    conf: {
      type: Object,
      default: "",
    },
    type: {
      type: String,
      default: "single",
    },
    isSubForm: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    dicData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mounted() {
    this.handlerData();
    this.initData();
  },
  methods: {
    handlerData() {
      if (this.conf.defaultValue) {
        this.type = "mutiple";
        if(this.conf.avueType =='mutiple-popup'){
            if (this.conf.defaultValue) {
            this.checkedArr = this.conf.defaultValue.split(",");
            }
            if (
              this.checkedArr.length > 0 &&
              this.checkedArr.length < this.list.length
            ) {
              this.isIndeterminate = true;
            }
        }else{
          this.type = "single";
           this.radio = this.conf.defaultValue;
        }
      }
    },
    search() {
      if (this.keyword) {
        let columns = this.option.column
          .filter((ele) => {
            return !ele.slot;
          })
          .map((ele) => {
            return ele.prop;
          });
        this.originOptionList = this.list.filter((ele) => {
          let hasData = false;
          columns.forEach((col) => {
            let str = new RegExp(this.keyword, "i");
            if (ele[col] && str.test(ele[col])) {
              hasData = true;
            }
          });
          return hasData;
        });
      } else {
        this.originOptionList = this.list;
      }
      this.page.currentPage = 1;
      this.getPageList();
    },
    searchReset() {
      this.keyword = "";
      this.search();
    },
    getRadioDetails() {
      let selectedItem = {};
      let items = this.list.filter((item) => {
        return item[this.conf.saveField] == this.radio;
      });
      if (items.length > 0) {
        selectedItem = items[0];
      }
      return selectedItem;
    },
    getcheckedDetails() {
      return this.list.filter((item) => {
        return this.checkedArr.find((el) => {
          return el == item[this.conf.saveField];
        });
      });
    },
    handelConfirm() {
      let selectedItem = "";
      if (this.type == "single") {
        if (!this.radio) {
          return;
        }
        selectedItem = this.getRadioDetails();
      } else {
        selectedItem = this.getcheckedDetails();
      }
      this.visible = false;
      this.$emit("onHandler", selectedItem);
      this.$event.$emit("onHandler", selectedItem);
    },

    setOptionColumn(result) {
      this.option.column = [];
      if (this.type == "mutiple") {
        this.selectedoption.column = [];
        this.selectedoption.column.push({
          label: "",
          prop: "del",
          slot: true,
          width: 100,
        });
      }
      let autoBindFields = this.conf.autoBindFields
        ? JSON.parse(this.conf.autoBindFields)
        : "";

      if (!result[0]) {
        return;
      }

      this.option.column.push({
        label: "",
        prop: "radioProp",
        slot: true,
        //fromslot: true,
        width: 100,
        //fixed:true,
        renderHeader: (h, { column }) => {
          if (this.type == "mutiple") {
            return h("el-checkbox", {
              on: {
                change: this.handleCheckAllChange,
              },

              props: {
                value: this.checkedAll,
                indeterminate: this.isIndeterminate,
              },
            });
          } else {
            return null;
          }
        },
      });
      let arr = [];
      for (var key in result[0]) {
        arr.push(key);
        this.fields = arr.join(",");
        let obj = {};
        obj.label = key;
        obj.prop = key;
        if (
          Object.prototype.toString.call(autoBindFields) === "[object Array]"
        ) {
          let temp = autoBindFields.find((o) => {
            return o.bindField == key;
          });
          if (temp && temp.isShow) {
            obj.width = temp.width;
            this.option.column.push(obj);
            if (this.type == "mutiple") {
              this.selectedoption.column.push(obj);
            }
          }
        } else {
          this.option.column.push(obj);
          if (this.type == "mutiple") {
            this.selectedoption.column.push(obj);
          }
        }
      }
      let len = this.option.column.length;
      delete this.option.column[len - 1].width; //最后一列自适应
    },
    handleCheckAllChange(val) {
      this.$emit("input", val);
      this.checkedArr = [];
      if (val) {
        this.list.forEach((it) => {
          this.checkedArr.push(it[this.conf.saveField]);
        });
      }
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkedAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
    },
    initData() {
      let tabName = "";
      if (this.conf.tabName) {
        tabName = this.conf.tabName;
      }
      this.conf.autoBindFields =  this.conf.autoBindFields;
       if ( this.conf.dataType == "dataSource") {
          tabName = "base";
          this.conf.dataSource =  this.conf.dataSource;
          this.conf.saveField =  this.conf.saveField;
          this.conf.showField =  this.conf.showField;
        } else if ( this.conf.dataType == "dataItem") {
          tabName = "item";
          this.conf.dataSource =  this.conf.dataItem;
           this.conf.saveField = "F_ItemValue";
           this.conf.showField = "F_ItemName";
        }else if ( this.conf.dataType == "dataApi") {
          tabName = "api";
          this.apiConfig = this.conf.apiConfig;
          this.formFieldsMap = this.conf.formFieldsMap; 
           this.formData = this.conf.formData; 
          this.conf.saveField = this.conf.apiConfig.saveField;
          this.conf.showField = this.conf.apiConfig.showField;
        }
        if (this.conf.dicData.length) {
          if (!this.initOptionColumn) {
            this.setOptionColumn(this.conf.dicData);
            this.initOptionColumn = true;
          }
          this.list = this.conf.dicData;
          this.originOptionList = this.conf.dicData;
          this.getPageList();
        }
    },
    handleClose() {
      this.$emit("onHandler");
    },
    handleTabClick() {
      if (this.activeName == "selected") {
        this.selectedList = this.getcheckedDetails();
      }
    },
    delRow(row) {
      this.selectedList.splice(row.$index, 1);
      this.checkedArr = this.selectedList.map((ele) => {
        return ele[this.conf.saveField];
      });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getPageList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.search();
    },
    getPageList() {
      this.page.total = this.originOptionList.length;
      let index = 0;
      let lastIndex = this.page.pageSize;
      if (this.page.currentPage > 1) {
        index = (this.page.currentPage - 1) * this.page.pageSize;
        lastIndex = this.page.currentPage * this.page.pageSize;
      }
      this.pageList = this.originOptionList.slice(index, lastIndex);
    },
  },
};
</script>
<style scoped>
.empty-data {
  height: 200px;
  color: #666 !important;
  text-align: center;
  padding: 10px 0;
}
.el-radio-group {
  width: 100%;
}
div /deep/ .avue-crud__pagination {
  position: relative;
  top: 10px;
}
div /deep/ .el-button--opr-primary {
  color: #f56c6c;
}
.search-box {
  margin-bottom: 10px;
}
.page-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
