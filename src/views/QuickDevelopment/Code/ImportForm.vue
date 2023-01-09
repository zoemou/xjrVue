<template>
  <div class="main-container" style="height: 500px">
    <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
        :rules="rules"
    >
      <el-form-item :label="$t('importAndExport.excelImport.tableName')" prop="moduleName">
        <el-input
            v-model="formInline.moduleName"
            :placeholder="$t('importAndExport.importForm.placeholderTName')"
            style="width: 180px"
        ></el-input>
      </el-form-item>
      <!--      <el-form-item label="绑定按钮" prop="bindBtn">-->
      <!--        <el-select v-model="formInline.bindBtn" placeholder="请选择" style="width: 120px;">-->
      <!--          <el-option-->
      <!--              v-for="(item,index) in parameValue.btns"-->
      <!--              :key="index"-->
      <!--              :label="item.name"-->
      <!--              :value="item.val">-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('importAndExport.importForm.labelEMechanism')" prop="errorRule">
        <el-select v-model="formInline.errorRule" style="width: 120px">
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
        style="height: calc(100% - 52px)"
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
        :visible.sync="childDialogVisible"
        :close-on-click-modal="false"
        width="50%"
        :before-close="handleClose"
        style="padding: 10px 20px"
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
                  :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
                  size="small"
                  style="width: 100%"
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
                prop="F_dataItem"
                :label="$t('importAndExport.importForm.labelDataOption')"
                v-if="setFieldForm.F_RelationType == 2"
            >
              <avue-input-tree
                  default-expand-all
                  v-model="form"
                  :placeholder="$t('importAndExport.importForm.selectContent')"
                  type="tree"
                  :dic="setFieldForm.F_dataItem"
                  style="width: 100%"
              ></avue-input-tree>
            </el-form-item>
            <el-form-item
                prop="F_dataBase"
                :label="$t('importAndExport.importForm.labelDataOption')"
                v-if="setFieldForm.F_RelationType == 3"
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
        :title="$t('importAndExport.importForm.selectDataItem')"
        width="80%"
        :before-close="dataItemClose"
        :close-on-click-modal="false"
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
                  style="width: 200px; margin-right: 20px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="showField" :label="$t('importAndExport.importForm.labelShowField')">
              <el-select
                  v-model="dataItemForm.showField"
                  :placeholder="$t('importAndExport.excelExport.placeholderBtn')"
                  size="small"
                  style="width: 100%"
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
                  style="width: 100%"
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
      <div style="padding-top: 20px">
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
} from '@/api/databasemanage/datasource';
import { getMenuButton } from '@/api/systemManagement/menu';
import { getDataDictionaryTree } from '@/api/language/dictionary';
import { getDatabaseTableColumns } from '@/api/databasemanage/databasetable';
import { FormatTree } from '../../../util/util.js';
import store from '@/store/index';

export default {
  name: 'ImportForm',
  components: {},
  props: {
    parameValue: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return {
          database: {},
          fields: [],
          btns: [],
        };
      },
    },
  },
  data () {
    return {
      dialogTitle: '',
      form: undefined,
      formInline: {
        moduleName: '导出模板',
        bindBtn: 'import',
        errorRule: '1',
      },
      dataItemForm: {
        keyword: '',
        saveField: '',
        showField: '',
      },
      dataItemTable: [],
      rules: {
        bindBtn: [
          { required: true, message:this.$t('importAndExport.excelExport.hintBtn'), trigger: 'change' },
        ],
        moduleName: [
          { required: true, message: this.$t('importConfiguration.placeholderName'), trigger: 'blur' },
        ],
        ExcelColName: [
          { required: true, message:this.$t('importConfiguration.hintExcelNotNoll'), trigger: 'change' },
        ],
        showField: [
          { required: true, message:this.$t('importAndExport.importForm.hintSelectShowField'), trigger: 'change' },
        ],
        saveField: [
          { required: true, message:this.$t('importAndExport.importForm.hintSelectSaveField'), trigger: 'change' },
        ],
        F_dataItem: [
          { required: true, message:this.$t('importConfiguration.hintDataOption'), trigger: 'change' },
        ],
      },
      menuTable: [],
      curTable: '',
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
        height: '100%',
        menuWidth: 80,
        selection: true,
        border: true,
        index: true,
        indexLabel: this.$t('importAndExport.importForm.tabNum'),
        align: 'center',
        delBtn: false,
        editBtn: false,
        column: [
          {
            label:this.$t('importAndExport.importForm.tabField'),
            prop: 'F_Name',
          },
          {
            label:this.$t('importAndExport.importForm.tabColName'),
            prop: 'F_ColName',
          },
          {
            label:this.$t('importAndExport.importForm.tabOnlyOne'),
            prop: 'F_OnlyOne',
          },
          {
            label: this.$t('importAndExport.importForm.tabDescribe'),
            prop: 'F_Description',
          },
          {
            label: this.$t('importConfiguration.tabSource'),
            prop: 'F_Source',
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
        align: 'center',
        menu: false,
        column: [
          {
            label:this.$t('importAndExport.importForm.tabCode'),
            prop: 'F_Code',
          },
          {
            label: this.$t('importAndExport.importForm.tabName'),
            prop: 'F_Name',
          },
          {
            label: this.$t('importAndExport.importForm.tabDatabase'),
            prop: 'F_DbId',
          },
          {
            label:this.$t('importAndExport.importForm.tabCreateUser'),
            prop: 'F_CreateUserName',
          },
          {
            label: this.$t('importConfiguration.tabCreateDate'),
            prop: 'F_CreateDate',
          },
          {
            label: this.$t('importAndExport.importForm.tabRemark'),
            prop: 'F_Description',
          },
        ],
      },
      setFieldForm: {
        Name: '',
        ExcelColName: '',
        F_Description: '',
        F_dataItem: [],
        F_dataBase: {},
        F_showdataBase: '',
        F_Value: '',
      },
      Description: [
        {
          label:this.$t('importAndExport.importForm.valueUnrelated'),
          value: 0,
        },
        {
          label: 'GUID',
          value: 1,
        },
        {
          label:this.$t('importAndExport.importForm.valueDataDic'),
          value: 2,
        },
        {
          label:this.$t('importAndExport.importForm.valueDataForm'),
          value: 3,
        },
        {
          label:this.$t('importAndExport.importForm.labelFixedValue'),
          value: 4,
        },
        {
          label: this.$t('importAndExport.importForm.valueOperatorID'),
          value: 5,
        },
        {
          label:this.$t('importAndExport.importForm.valueOperatorName'),
          value: 6,
        },
        {
          label: this.$t('importAndExport.importForm.valueOperatorTime'),
          value: 7,
        },
      ],
      dataItemProps: {
        children: 'children',
        label: 'F_ItemName',
      },
      showFieldOption: [],
      saveFieldOption: [],
      selectTableData: [],
    };
  },
  created () {
    this.getDataDictionaryTree();
  },
  mounted () {
    this.selectListTable();
  },
  methods: {
	handleCurrentRowChange(row){
	  this.$refs.cuTable.toggleSelection([row]);
	},
    selectListTable () {
      //选中来源是列表的数据
      console.log(this.parameValue);
      let fields;
      var dblinkId;
      if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
        fields = this.parameValue.fields;
        dblinkId = store.state.FD.dbLinkId;
      } else {
        fields = this.parameValue.database;
        dblinkId = store.state.FD.DbLinkId;
      }


      this.menuTable = []

      // if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
        // fields.forEach((item) => {
        //   console.log(item);
        //   getDatabaseTableColumns(dblinkId, item.name).then((res) => {
        //     if (res.data.success) {
        //       const data = res.data.data;
        //       let keyObj = {};
        //       data.forEach((items) => {
        //         let temp = this.parameValue.fields.find((it) => {
        //           return it.bindColumn == items.Name;
        //         });
        //
        //         if (temp) {
        //           this.menuTable.push({
        //             F_Name: temp.bindColumn,
        //             F_ColName: temp.fieldName,
        //             F_IsKey: items.IsKey === 1,
        //             F_OnlyOne: '不唯一',
        //             F_Description: '无关联',
        //             F_Source: '列表(' + temp.bindTable + ')',
        //           });
        //         } else {
        //           this.menuTable.push({
        //             F_Name: items.Name,
        //             F_ColName: items.Name,
        //             F_OnlyOne: items.IsKey === 0 ? '不唯一' : '唯一',
        //             F_IsKey: items.IsKey === 1,
        //             F_Description: '无关联',
        //             F_Source:
        //                 item.parentName == 1
        //                     ? '主表(' + item.name + ')'
        //                     : '从表(' + item.name + ')',
        //           });
        //
        //           if (items.IsKey === 1) {
        //             keyObj = this.menuTable[this.menuTable.length - 1];
        //
        //             keyObj.F_ColName = '主键';
        //             keyObj.F_RelationType = 1; //代表关联GUID
        //             keyObj.F_Description = '关联GUID';
        //           }
        //         }
        //       });
        //
        //       this.$nextTick(function () {
        //         this.$refs['cuTable'].toggleSelection([keyObj]);
        //       });
        //     }
        //   });
        // });
      // } else {
        let keyObj = {
          F_Name: 'F_Id',
          F_ColName: '主键',
          F_IsKey: true,
          F_OnlyOne: '唯一',
          F_Description: '关联GUID',
          F_RelationType: 1, //代表关联GUID
          F_Source: '自动生成',
        };
        this.menuTable.push(keyObj);


        this.parameValue.fields.forEach(item => {
          this.menuTable.push({
            F_Name: item.bindColumn,
            F_ColName: item.fieldName,
            F_IsKey: false,
            F_OnlyOne: '不唯一',
            F_Description: '无关联',
            F_Source: '列表(' + item.bindTable + ')',
          });
        });

        this.$nextTick(function () {
          //目前还没找到原因 只能先用定时器等组件加载完毕
          setTimeout(() => {
            this.$refs['cuTable'].toggleSelection([keyObj]);
          }, 100);
        });


      // }
    },
    /* 获取字典分类树 */
    getDataDictionaryTree () {
      getDataDictionaryTree().then((res) => {
        const tree = FormatTree(
            res.data.data,
            'F_ItemCode',
            'F_ItemName',
            'children'
        );
        this.setFieldForm.F_dataItem = tree;
      });
    },
    setTable (row, index) {
      this.dialogTitle = '设置字段【' + row.F_Name + '】属性';
      this.curTable = index;
      this.childDialogVisible = true;

      this.setFieldForm.Name = row.F_Name;
      this.setFieldForm.ExcelColName = row.F_ColName;
      this.setFieldForm.F_RelationType = row.F_RelationType;

      this.setFieldForm = { ...this.setFieldForm };
      //
    },
    handleClose (done) {
      done();
    },
    cancelBtn () {
      this.childDialogVisible = false;
    },
    confirmBtn (formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.Description.forEach((o, i) => {
            if (o.value == this.setFieldForm.F_RelationType) {
              //如果选择无关联 或者  未选择 都默认设置为无关联
              if (
                  this.setFieldForm.F_RelationType === 0 ||
                  !this.setFieldForm.F_RelationType
              ) {
                this.menuTable[this.curTable].F_Description = '无关联';
              } else {
                this.menuTable[this.curTable].F_Description = '关联' + o.label;
              }
              this.menuTable[this.curTable].F_RelationType = o.value;
              // this.menuTable = [...this.menuTable];
            }
          });
          if (this.setFieldForm.F_RelationType == 2) {
            // console.log("this.form", this.form);
            this.menuTable[this.curTable].F_DataItemCode = this.form;
            // this.menuTable[this.curTable].F_DataSourceId = this.form;
          }
          if (this.setFieldForm.F_RelationType == 3) {
            this.menuTable[this.curTable].F_DataSourceId =
                this.curRow.F_Id +
                ',' +
                this.dataItemForm.saveField +
                ',' +
                this.dataItemForm.showField;
          }
          if (this.setFieldForm.F_RelationType == 4) {
            this.menuTable[this.curTable].F_Value = this.setFieldForm.F_Value;
          }
          this.menuTable[
              this.curTable
              ].F_ColName = this.setFieldForm.ExcelColName;
          this.childDialogVisible = false;
        }
      });
    },
    dataItemClose (done) {
      done();
    },
    selectDataItem () {
      this.DialogVisible = true;
      getDataSource().then((res) => {
        this.dataItemTable = res.data.data;
      });
    },
    handleRowClick (row, event, column) {
      this.curRow = row;
      getDataFieldBySQL(row.F_Id).then((res) => {
        if (res.data.success) {
          this.showFieldOption = res.data.data;
          this.saveFieldOption = res.data.data;
        }
      });
    },
    cancelBtnTwo () {
      this.DialogVisible = false;
    },
    confirmBtnTwo (formName) {
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
            console.log('xuanzhong',selection, row,this.menuTable)

          }, */
    handleSelectAll (selection) {
      this.selectTableData = selection;
    },
    getChildData () {
      var obj = {};
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          obj = {
            moduleName: this.formInline.moduleName,
            bindBtn: this.formInline.bindBtn,
            errorRule: this.formInline.errorRule,
            impField: this.selectTableData,
          };
        } else {
          obj = false;
        }
      });
      return obj;
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
