<template>
  <div class="main-container" style="height: 500px;">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('importAndExport.excelImport.tableName')" prop="moduleName">
        <el-input
          v-model="formInline.moduleName"
          :placeholder="$t('importAndExport.importForm.placeholderTName')"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('importAndExport.importForm.labelEMechanism')" prop="errorRule">
        <el-select v-model="formInline.errorRule" style="width: 120px;">
          <el-option :label="$t('importAndExport.importForm.optionJump')" value="1" key="1"></el-option>
          <el-option :label="$t('importAndExport.importForm.optionEnd')" value="0" key="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <avue-crud
      ref="cuTable"
      :data="menuTable"
      :option="option"
      stripe
      style="height: calc(100% - 52px);"
      @selection-change="handleSelectAll"
	  @current-row-change="handleCurrentRowChange"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-setting"
          @click.stop="setTable(scope.row, scope.index)"
        ></el-button>
      </template>
    </avue-crud>

    <el-dialog v-dialogDrag
      :title="dialogTitle"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="childDialogVisible"
      width="50%"
      :before-close="handleClose"
      style="padding: 10px 20px;"
    >
      <div class="companiesuser-form">
        <el-form
          :rules="rules"
          ref="setFieldForm"
          :model="setFieldForm"
          label-width="80px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24">
            <el-form-item prop="Name" :label="$t('importAndExport.importForm.labelSetField')">
              <el-input
                size="small"
                readonly
                v-model="setFieldForm.Name"
              ></el-input>
            </el-form-item>
            <el-form-item prop="ExcelColName" :label="$t('importAndExport.importForm.tabColName')">
              <el-input
                size="small"
                v-model="setFieldForm.ExcelColName"
              ></el-input>
            </el-form-item>
            <el-form-item prop="F_RelationType" :label="$t('importAndExport.importForm.labelAType')">
              <el-select
                v-model="setFieldForm.F_RelationType"
                :disabled="setFieldForm.sourceRelationType != 0"
                :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in Description"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('importAndExport.importForm.labelDataOption')"
              v-if="
                setFieldForm.sourceRelationType == 0 &&
                setFieldForm.F_RelationType == 2
              "
            >
              <avue-input-tree
                default-expand-all
                v-model="form"
                :placeholder="$t('importAndExport.importForm.selectContent')"
                type="tree"
                :dic="dataItemTree"
                style="width: 100%;"
              ></avue-input-tree>
            </el-form-item>

            <el-form-item
              prop="F_dataBase"
              :label="$t('importAndExport.importForm.labelDataOption')"
              v-if="
                setFieldForm.sourceRelationType == 0 &&
                setFieldForm.F_RelationType == 3
              "
            >
              <el-input
                :placeholder="$t('importAndExport.importForm.selectDataItem')"
                suffix-icon="el-icon-plus"
                v-model="setFieldForm.F_showdataBase"
                @focus="selectDataItem"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              prop="F_Value"
              :label="$t('importAndExport.importForm.labelFixedValue')"
              v-if="setFieldForm.F_RelationType == 4"
            >
              <el-input
                :placeholder="$t('importAndExport.importForm.placeholderFixedValue')"
                v-model="setFieldForm.F_Value"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="cancelBtn('setFieldForm')"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="confirmBtn('setFieldForm')"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag
      :visible.sync="DialogVisible"
      :close-on-click-modal="false"
      :title="$t('importAndExport.importForm.selectDataItem')"
      width="80%"
      :before-close="dataItemClose"
      :append-to-body="true"
    >
      <div class="companiesuser-form">
        <el-form
          :inline="true"
          :rules="rules"
          ref="dataItemForm"
          :model="dataItemForm"
          label-width="80px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24">
            <el-form-item prop="keyword" label="">
              <el-input
                v-model="dataItemForm.keyword"
                size="small"
                :placeholder="$t('searchModule.searchPlaceholder')"
                style="width: 200px; margin-right: 20px;"
              ></el-input>
            </el-form-item>
            <el-form-item prop="showField" :label="$t('importAndExport.importForm.labelShowField')">
              <el-select
                v-model="dataItemForm.showField"
                :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in showFieldOption"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="saveField" :label="$t('importAndExport.importForm.labelSaveField')">
              <el-select
                v-model="dataItemForm.saveField"
                :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in saveFieldOption"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <avue-crud
        ref="cuTableTwo"
        :data="dataItemTable"
        :option="dataItemOption"
        stripe
        @row-click="handleRowClick"
      >
      </avue-crud>
      <div style="padding-top: 20px;">
        选择数据源：{{ curRow.F_Name }} &nbsp;&nbsp;&nbsp;&nbsp;显示字段：{{
          dataItemForm.showField
        }}
        &nbsp;&nbsp;&nbsp;&nbsp;保存字段：{{ dataItemForm.saveField }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="cancelBtnTwo"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="confirmBtnTwo('dataItemForm')"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDataSource,
  getDataFieldBySQL,
} from "@/api/databasemanage/datasource";
import { getMenuButton } from "@/api/systemManagement/menu";
import { getDataDictionaryTree } from "@/api/language/dictionary";
import { getDatabaseTableColumns } from "@/api/databasemanage/databasetable";
import { FormatTree } from "@/util/util.js";
import store from "@/store/index";

export default {
  name: "ImportConfiguration",
  components: {},
  props: {
    parameValue: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return {
          database: {},
          conf: [],
          fields: [],
          btns: [],
        };
      },
    },
  },
  data() {
    return {
      dialogTitle: "",
      form: undefined,
      formInline: {
        moduleName: "导出模板",
        bindBtn: "import",
        errorRule: "1",
      },
      dataItemForm: {
        keyword: "",
        saveField: "",
        showField: "",
      },
      dataItemTable: [],
      rules: {
        bindBtn: [
          { required: true, message:this.$t('importAndExport.excelExport.hintBtn'), trigger: "change" },
        ],
        moduleName: [
          { required: true, message:this.$t('importConfiguration.placeholderName'), trigger: "blur" },
        ],
        ExcelColName: [
          { required: true, message:this.$t('importConfiguration.hintExcelNotNoll'), trigger: "change" },
        ],
        showField: [
          { required: true, message:this.$t('importAndExport.importForm.hintSelectShowField'), trigger: "change" },
        ],
        saveField: [
          { required: true, message:this.$t('importAndExport.importForm.hintSelectSaveField'), trigger: "change" },
        ],
      },
      menuTable: [],
      curTable: "",
      curRow: {},
      childDialogVisible: false,
      DialogVisible: false,
      option: {
        highlightCurrentRow: true,
        stripe: true,
        selectable: (row, index) => {
          return !row.F_IsKey;
        },
        header: false,
        height: "100%",
        menuWidth: 80,
        selection: true,
        border: true,
        index: true,
        indexLabel:this.$t('importAndExport.importForm.tabNum'),
        align: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            label:this.$t('importAndExport.importForm.tabField'),
            prop: "F_Name",
          },
          {
            label:this.$t('importAndExport.importForm.tabColName'),
            prop: "F_ColName",
          },
          {
            label:this.$t('importAndExport.importForm.tabOnlyOne'),
            prop: "F_OnlyOne",
            formatter: function (row) {
              return row.F_OnlyOne === 1 ? "唯一"  : "不唯一";
            },
          },
          {
            label:this.$t('importAndExport.importForm.tabDescribe'),
            prop: "F_Description",
          },
          {
            label:this.$t('importConfiguration.tabSource'),
            prop: "F_Source",
          },
        ],
      },
      dataItemOption: {
        highlightCurrentRow: true,
        stripe: true,
        header: false,
        maxHeight: 550,
        border: true,
        index: true,
        indexLabel:this.$t('importAndExport.importForm.tabNum'),
        align: "center",
        menu: false,
        column: [
          {
            label: this.$t('importAndExport.importForm.tabCode'),
            prop: "F_Code",
          },
          {
            label:this.$t('importAndExport.importForm.tabName'),
            prop: "F_Name",
          },
          {
            label:this.$t('importAndExport.importForm.tabDatabase'),
            prop: "F_DbId",
          },
          {
            label:this.$t('importAndExport.importForm.tabCreateUser'),
            prop: "F_CreateUserName",
          },
          {
            label:this.$t('importConfiguration.tabCreateDate'),
            prop: "F_CreateDate",
          },
          {
            label:this.$t('importAndExport.importForm.tabRemark'),
            prop: "F_Description",
          },
        ],
      },
      setFieldForm: {
        Name : "",
        ExcelColName : "",
        F_RelationType : 0,
        sourceRelationType : 0,
        F_Value : ""
      },
      Description: [
        {
          label: this.$t('importAndExport.importForm.valueUnrelated'),
          value: 0,
        },
        {
          label: "GUID",
          value: 1,
        },
        {
          label: this.$t('importAndExport.importForm.valueDataDic'),
          value: 2,
        },
        {
          label:this.$t('importConfiguration.labelDataSource'),
          value: 3,
        },
        {
          label:this.$t('importAndExport.importForm.labelFixedValue'),
          value: 4,
        },
        {
          label:this.$t('importAndExport.importForm.valueOperatorID'),
          value: 5,
        },
        {
          label: this.$t('importAndExport.importForm.valueOperatorName'),
          value: 6,
        },
        {
          label: this.$t('importAndExport.importForm.valueOperatorTime'),
          value: 7,
        },
        {
          label:this.$t('importConfiguration.labelOperDepart'),
          value: 8,
        },
        {
          label:this.$t('importConfiguration.labelOperCompany'),
          value: 9,
        },
        {
          label:this.$t('importConfiguration.labelSelectID'),
          value: 10,
        },
        {
          label:this.$t('importConfiguration.labelSelectDepart'),
          value: 11,
        },
        {
          label:this.$t('importConfiguration.labelSelectCompany'),
          value: 12,
        },
      ],
      dataItemProps: {
        children: "children",
        label: "F_ItemName",
      },
      showFieldOption: [],
      saveFieldOption: [],
      selectTableData: [],
      dataItemTree: [],
    };
  },
  created() {
    this.getDataDictionaryTree();
  },
  mounted() {
    this.selectListTable();
  },
  methods: {
	handleCurrentRowChange(row){
	  this.$refs.cuTable.toggleSelection([row]);
	},
    selectListTable() {
      //选中来源是列表的数据
      let fields;
      var dblinkId;
      if (
        store.state.FD.controllerType === 1 ||
        store.state.FD.controllerType === 2
      ) {
        fields = this.parameValue.fields;
        dblinkId = store.state.FD.dbLinkId;
      } else {
        fields = this.parameValue.database;
        dblinkId = store.state.FD.DbLinkId;
      }
      this.menuTable = [];
	  let keyObj ={
		  F_ColName: "主键",
		  F_IsKey: true,
		  F_OnlyOne: 1,
		  F_Description: "关联GUID",
		  sourceRelationType: 1,
		  F_RelationType: 1, //代表关联GUID
	  }
	  if(fields.list?.length>0){
		  fields.list.forEach(it=>{
			  if(it.parentName==1){
				  keyObj.F_Name= it.pk;
				  keyObj.F_Source= "主表("+it.name+")"
			  }
		  })
	  }else{
		  keyObj.F_Name= "F_Id";
		  keyObj.F_Source= "自动生成"
	  }
      this.menuTable.push(keyObj);

      let conf = this.parameValue.conf;
      let filedRelationItem = {};
      if (conf && conf.length > 0) {
        conf.forEach((element) => {
          if(element.__config__.componentName == "avue-tabs"){
            let childrenObj = element?.__config__?.childrenObj || {};
            if(!childrenObj) return;
            for(let key in childrenObj){
              let children = childrenObj[key];
              for(let i = 0;i<children.length;i++){
                if(children[i]?.__config__?.componentName != 'table'){
                  let relationItem = this.getRelationItem(children[i]);
                  filedRelationItem[children[i].__config__.bindTableField] = relationItem;
                }
              }
            }
          }else if(element.__config__.componentName == "table"){

          }else {
            filedRelationItem[element.__config__.bindTableField] = this.getRelationItem(element);
          }
        });
      }
      if(this.parameValue?.fields?.length>0){
        this.parameValue.fields.forEach((item) => {
          if(item?.__config__?.componentName == 'table'){}
        else if(item?.__config__?.componentName == 'avue-tabs'){
          let childrenObj = item?.__config__?.childrenObj || {};
          if(!childrenObj) return;
          for(let key in childrenObj){
            let children = childrenObj[key];
            for(let i = 0;i<children.length;i++){
              if(children[i]?.__config__?.componentName != 'table'){
                let temp = {
                  F_Name: children[i].bindColumn,
                  F_ColName: children[i].fieldName,
                  colType:item.colType,
                  F_IsKey: false,
                  F_OnlyOne: 0,
                  F_Source: "列表(" + children[i].bindTable + ")",
                  ...filedRelationItem[children[i].bindColumn],
                };
                this.menuTable.push(temp);
              }
            }
          }
        }else{
          let temp = {
            F_Name: item.bindColumn,
            F_ColName: item.fieldName,
            colType:item.colType,
            F_IsKey: false,
            F_OnlyOne: 0,
            F_Source: "列表(" + item.bindTable + ")",
            ...filedRelationItem[item.bindColumn],
          };
          this.menuTable.push(temp);
        }
      });
      }
      this.$nextTick(function () {
        //目前还没找到原因 只能先用定时器等组件加载完毕
        setTimeout(() => {
          this.$refs["cuTable"].toggleSelection([keyObj]);
        }, 100);
      });
    },
    getRelationItem(element){
      let relationItem = {};
      if (element.__config__.dataType) {
        let dataType = element.__config__.dataType;
        if (dataType == "dataItem") {
          let dataItem = element.__config__.dataItem;
          relationItem = {
            sourceRelationType: 2,
            F_RelationType: 2,
            F_Description: this.getRelationTypeDescription(2),
            F_DataItemCode: dataItem,
            dataType,
            dataItem,
          };
        } else if (dataType == "dataSource") {
          let dataSource = element.__config__.dataSource;
          let showField = element.__config__.showField;
          let saveField = element.__config__.saveField;
          relationItem = {
            sourceRelationType: 3,
            F_RelationType: 3,
            F_Description: this.getRelationTypeDescription(3),
            F_DataSourceId:
              dataSource + "," + saveField + "," + showField,
            dataType,
            dataSource,
            showField,
            saveField,
          };
        }
      }
      let type = element.__type__;
      if (type) {
        if (type == "info") {
          let info = element.infoType;
          switch (info) {
            case "date":
              relationItem = {
                sourceRelationType: 7,
                F_RelationType: 7,
                F_Description: this.getRelationTypeDescription(7),
                type,
                info,
              };
              break;
            case "department":
              relationItem = {
                sourceRelationType: 8,
                F_RelationType: 8,
                F_Description: this.getRelationTypeDescription(8),
                type,
                info,
              };
              break;
            case "user":
              relationItem = {
                sourceRelationType: 5,
                F_RelationType: 5,
                F_Description: this.getRelationTypeDescription(5),
                type,
                info,
              };
              break;
            case "company":
              relationItem = {
                sourceRelationType: 9,
                F_RelationType: 9,
                F_Description: this.getRelationTypeDescription(9),
                type,
                info,
              };
              break;
            default:
              break;
          }
        } else if (type == "company") {
          relationItem = {
            sourceRelationType: 10,
            F_RelationType: 10,
            F_Description: this.getRelationTypeDescription(10),
            type,
          };
        } else if (type == "department") {
          relationItem = {
            sourceRelationType: 11,
            F_RelationType: 11,
            F_Description: this.getRelationTypeDescription(11),
            type,
          };
        } else if (type == "user") {
          relationItem = {
            sourceRelationType: 12,
            F_RelationType: 12,
            F_Description: this.getRelationTypeDescription(12),
            type,
          };
        }
      }
      //无关联
      if (JSON.stringify(relationItem) == "{}") {
        relationItem = {
          sourceRelationType: 0,
          F_RelationType: 0,
          F_Description: this.getRelationTypeDescription(0),
        };
      }
      return relationItem;
    },
    getRelationTypeDescription(type) {
      let description = "无关联";
      switch (type) {
        case 0:
          description = "无关联";
          break;
        case 1:
          description = "关联GUID";
          break;
        case 2:
          description = "关联数据字典";
          break;
        case 3:
          description = "关联数据源";
          break;
        case 4:
          description = "关联固定数值";
          break;
        case 5:
          description = "关联操作人ID";
          break;
        case 6:
          description = "操作";
          break;
        case 7:
          description = "操作时间";
          break;
        case 8:
          description = "操作人部门";
          break;
        case 9:
          description = "关联操作人公司";
          break;
        case 10:
          description = "关联公司";
          break;
        case 11:
          description = "关联部门";
          break;
        case 12:
          description = "关联人员ID";
          break;

        default:
          break;
      }
      return description;
    },
    /* 获取字典分类树 */
    getDataDictionaryTree() {
      getDataDictionaryTree().then((res) => {
        const tree = FormatTree(
          res.data.data,
          "F_ItemCode",
          "F_ItemName",
          "children"
        );
        this.dataItemTree = tree;
      });
    },
    setTable(row, index) {
      // this.setFieldForm = {};
      this.dialogTitle = "设置字段【" + row.F_Name + "】属性";
      this.curTable = index;
      this.childDialogVisible = true;
	  this.form="";
      // this.setFieldForm = row;
      this.setFieldForm.Name = row.F_Name;
      this.setFieldForm.ExcelColName = row.F_ColName;
      this.setFieldForm.F_RelationType = row.F_RelationType;
	  if(row.F_RelationType==2){
		  this.form=row.F_DataItemCode
	  }
    },
    handleClose(done) {
      done();
    },
    cancelBtn() {
      this.childDialogVisible = false;
    },
    confirmBtn(formName) {
      if (this.setFieldForm.sourceRelationType == 0) {
        this.menuTable[
          this.curTable
        ].F_RelationType = this.setFieldForm.F_RelationType;
        this.menuTable[
          this.curTable
        ].F_Description = this.getRelationTypeDescription(
          this.setFieldForm.F_RelationType
        );
        if (this.setFieldForm.F_RelationType == 2) {
          if (this.form == "") {
            this.$notify({
              title: this.$t('deletePrompt.promptTitle'),
              message: this.$t('importConfiguration.hintDataDict'),
              type: "warning",
            });
            return false;
          }
          this.menuTable[this.curTable].F_DataItemCode = this.form;
        } else if (this.setFieldForm.F_RelationType == 3) {
          this.menuTable[this.curTable].F_DataSourceId =
            this.curRow.F_Id +
            "," +
            this.dataItemForm.saveField +
            "," +
            this.dataItemForm.showField;
        } else if (this.setFieldForm.F_RelationType == 4) {
          this.menuTable[this.curTable].F_Value = this.setFieldForm.F_Value;
        }
      }
      this.menuTable[this.curTable].F_ColName = this.setFieldForm.ExcelColName;
      this.childDialogVisible = false;
    },
    dataItemClose(done) {
      done();
    },
    selectDataItem() {
      this.DialogVisible = true;
      getDataSource().then((res) => {
        this.dataItemTable = res.data.data;
      });
    },
    handleRowClick(row, event, column) {
      this.curRow = row;
      getDataFieldBySQL(row.F_Id).then((res) => {
        if (res.data.success) {
          this.showFieldOption = res.data.data;
          this.saveFieldOption = res.data.data;
        }
      });
    },
    cancelBtnTwo() {
      this.DialogVisible = false;
    },
    confirmBtnTwo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.DialogVisible = false;
          this.setFieldForm.F_dataBase = this.curRow;
          this.setFieldForm.F_showdataBase = this.curRow.F_Name;
        }
      });
    },
    /* 			handleSelectionChange(selection, row) {
            this.curRow=row;

          }, */
    handleSelectAll(selection) {
      this.selectTableData = selection;
    },
    getChildData() {
      return {
        moduleName: this.formInline.moduleName,
        bindBtn: this.formInline.bindBtn,
        errorRule: this.formInline.errorRule,
        impField: this.selectTableData,
      };
    },
  },
};
</script>

<style scoped>
.main-container::after {
  content: "";
  visibility: hidden;
  display: block;
  clear: both;
}

::v-deep .el-tag {
  display: none;
}
</style>
