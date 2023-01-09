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
import {
  getDataBySQL,
  getDataItemDetail,
} from "@/api/databasemanage/datasource";
import { baseUrl,
} from "@/config/env";
import request from "@/router/axios";
import store from "@/store";
import { getDbLinksTestSql } from "@/api/databasemanage/databaselink";
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
      if (this.type == "mutiple") {
        if (this.conf?.defaultValue) {
          this.checkedArr = this.conf.defaultValue.split(",");
        }
        if (
          this.checkedArr.length > 0 &&
          this.checkedArr.length < this.list.length
        ) {
          this.isIndeterminate = true;
        }
      } else {
        this.radio = this.conf.defaultValue;
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
    getDataItemDetail() {
      getDataItemDetail(this.conf.dataSource)
        .then((res) => {
          if (!this.initOptionColumn) {
            this.setOptionColumn([{ F_ItemName: "", F_ItemValue: "" }]);
            this.initOptionColumn = true;
          }

          this.list = res.data.data;
          this.originOptionList = res.data.data;
          this.getPageList();
        })
        .catch((err) => {});
    },
    getDataBySql() {
      getDbLinksTestSql(this.conf.dataSource, { sql: this.conf.sqlStr })
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.data.length) {
              if (!this.initOptionColumn) {
                this.setOptionColumn(res.data.data);
                this.initOptionColumn = true;
              }
              this.list = res.data.data;
              this.originOptionList = res.data.data;
              this.getPageList();
            }
          }
        })
        .catch((err) => {});
    },
    getData() {
      getDataBySQL(this.conf.dataSource, {
        field: this.fields,
        keyword: this.keyword,
      })
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.data.length) {
              if (!this.initOptionColumn) {
                this.setOptionColumn(res.data.data);
                this.initOptionColumn = true;
              }
              this.list = res.data.data;
              this.originOptionList = res.data.data;
              this.getPageList();
            }
          }
        })
        .catch((err) => {});
    },
    async getapiData(){
      if(this.apiConfig&&this.apiConfig.id&&this.apiConfig.dataSource){
      if(this.apiConfig.url&&this.apiConfig.dataSource){
          let data = [];
        let res = await this.getDataAPi();
        if(res.data.success){
          if(this.apiConfig.showField&&this.apiConfig.saveField){
            data = res.data.data[this.apiConfig.dataSource].map((ele) => {
              return { ...ele, label: ele[this.apiConfig.showField], value: ele[this.apiConfig.saveField] };
            });
          }
        }
        if (data.length) {
              if (!this.initOptionColumn) {
                this.setOptionColumn(data);
                this.initOptionColumn = true;
              }
              this.list = data;
              this.originOptionList = data;
              this.getPageList();
            }
      }
      }
        
    },

        async getApi(apiConfig){
      let data = [];
      if(apiConfig.url&&apiConfig.dataSource){
        let res = await this.getDataAPi(apiConfig);
        if(res.data.success){
          if(apiConfig.showField&&apiConfig.saveField){
            data = res.data.data[apiConfig.dataSource].map((ele) => {
              return { ...ele, label: ele[apiConfig.showField], value: ele[apiConfig.saveField] };
            });
          }
        }
      }
      return data;
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
      let autoBindFields  ="";
      if(this.isSubForm){
         autoBindFields = this.conf.__config__.autoBindFields
        ? JSON.parse(this.conf.__config__.autoBindFields)
        : "";
      }else{
         autoBindFields = this.conf.autoBindFields
        ? JSON.parse(this.conf.autoBindFields)
        : "";
      }

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
      //this.checkedAll=val;
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
      //主表跟子表单的list数据获取方式不一致，子表统一在table页面请求到了数据，防止多次请求接口
      if (this.isSubForm) {
        if ( this.conf.__config__.dataType == "dataSource") {
          tabName = "base";
          this.conf.__config__.dataSource =  this.conf.__config__.dataSource;
          this.conf.saveField =  this.conf.__config__.saveField;
          this.conf.showField =  this.conf.__config__.showField;
        } if ( this.conf.__config__.dataType == "dataSql") {
          tabName = "sql";
          this.conf.dataSource =  this.conf.__config__.database;
          this.conf.sqlStr =  this.conf.__config__.sql;
          this.conf.saveField =  this.conf.__config__.saveField;
          this.conf.showField =  this.conf.__config__.showField;
        } else if ( this.conf.__config__.dataType == "dataItem") {
          tabName = "item";
          this.conf.__config__.dataSource =  this.conf.__config__.dataItem;
           this.conf.saveField = "F_ItemValue";
           this.conf.showField = "F_ItemName";
        }else if ( this.conf.__config__.dataType == "dataApi") {
           tabName = "api";
           this.conf.apiConfig =  this.conf.__config__.apiConfig;
           this.conf.saveField =  this.conf.__config__.apiConfig.saveField;
           this.conf.showField =  this.conf.__config__.apiConfig.showField;
        }
        this.originOptionList = this.dicData;
        this.list = this.dicData;
        if (tabName == "sql") {
          this.getDataBySql();
        } else if (tabName == "item") {
          if (!this.initOptionColumn) {
            this.setOptionColumn([{ F_ItemName: "", F_ItemValue: "" }]);
            this.initOptionColumn = true;
          }
        } else if (tabName == "api") {
          if (!this.initOptionColumn) {
            this.setOptionColumn(this.dicData);
            this.initOptionColumn = true;
          }
        } else {
          if (!this.initOptionColumn) {
            this.setOptionColumn(this.dicData);
            this.initOptionColumn = true;
          }
        }
        this.getPageList();
      } else {
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
        if (tabName == "sql") {
          this.getDataBySql();
        } else if (tabName == "item") {
          this.getDataItemDetail();
        } else if (tabName == "api") {
           this.getapiData();
        }  else if (tabName == "base") {
           this.getData();
        }
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

    async getDataAPi(){
      let urlDic = `${baseUrl}${this.apiConfig.url}`;
      let methodTypeName = 'POST';
      let urlParamStr = "";
      let paramsJson = {};
      let bodyJson = {};
      let headerJson = {};

      if (this.apiConfig.apiInputParams.length > 0) {
        for (
          let index = 0;
          index < this.apiConfig.apiInputParams.length;
          index++
        ) {
          let element = this.apiConfig.apiInputParams[index];
          if (element.F_Type == 0 && element.F_ParamKey) {
            //header
            headerJson[element.F_ParamKey] = this.getApiParams(element);
          }
          if (element.F_ParamKey) {
            if (element.F_Type == 1) {
                bodyJson[element.F_ParamKey] = this.getApiParams(element);
              } else if (element.F_Type == 2) {
                urlParamStr += `${element.F_ParamKey}=${this.getApiParams(
                  element
                )}&`; // 拼接到url
              }
          }
        }
      }
      if (urlParamStr) {
        urlDic += `?${urlParamStr}`;
      }
      return await request({
        method: methodTypeName,
        url: urlDic,
        headers:headerJson,
        params:paramsJson,
        data: bodyJson,
      });
    },
    // 拼接api参数
    getApiParams(element){
      let userInfo = localStorage.getItem("avue-userInfo")
        ? JSON.parse(localStorage.getItem("avue-userInfo")).content
        : {};
      let str = "";
      if (element.paramType == "formData") {
        if (element.params.id) {
           if(typeof element.params.id=='string'&&element.params.id.includes('current-')){
            if (element.params.id == "current-userId") {
              str =userInfo['F_UserId']?userInfo['F_UserId']:'';
            } else if (element.params.id == "current-token") {
              str = localStorage.getItem("avue-token") ? JSON.parse(localStorage.getItem("avue-token"))
          .content : '';
            } else if (element.params.id == "current-postId") {
              str = userInfo['F_Post'] && userInfo['F_Post'].length > 0
          ? userInfo['F_Post'][0].F_PostId
          : '';
            } else if (element.params.id == "current-roleId") {
              str = userInfo['F_Role'] && userInfo['F_Role'].length > 0
          ? userInfo['F_Role'][0].F_RoleId
          : '';
            } else if (element.params.id == "current-companyId") {
              str = userInfo['F_Company']?userInfo['F_Company'].F_CompanyId:'';
            } else if (element.params.id == "current-departmentId") {
              str = userInfo['F_Department'] && userInfo['F_Department'].length > 0
          ? userInfo['F_Department'][0].F_DepartmentId
          : '';
            } 
           }else if(typeof element.params.id=='string'&&element.params.id.includes('hideComponents')){
             str = "";
              let val = undefined;
              if(store.state.formParser.hideComponentList&&store.state.formParser.hideComponentList.size>0){
                val = store.state.formParser.hideComponentList.has(element.params.id)?store.state.formParser.hideComponentList.get(element.params.id):'';
              }
              str  = val==undefined?"":val;
            }else {
            str = this.formFieldsMap.has(element.params.id) ? (this.formFieldsMap.get(element.params.id).__vModel__ ? this.formData[
              this.formFieldsMap.get(element.params.id).__vModel__] : '') : null;
          }
        }
      } else {
        str = element.F_ParamValue;
      }
      return str;
    }
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
