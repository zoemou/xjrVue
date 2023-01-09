<template>
  <div class="main-container">
    <el-row class="btnbox">
      <!-- <div style="width: calc(100% - 54px);overflow-x: auto;padding-right: 10px;display: flex;justify-content: flex-end;">
      <div style="width: 100000px;display: flex;justify-content: flex-end;"> -->
      <el-button v-for="(item,index) in btns" type="primary" :key="index" :icon="item.icon" size="small" @click="checkButton(item)"
                 :plain="!item.checked">{{ item.name }}
      </el-button>
      <!-- </div>
    </div> -->
      <el-button icon="el-icon-plus" size="small" @click="addBtnEvent"></el-button>
    </el-row>
     <el-row class="sortbox">
      <span>{{$t('defaultSort')}}：</span> <el-switch v-model="sort.useDefaultSort" @change="changeSortOptions"/>
    </el-row>
    <el-row class="sortFieldbox">
      <span  v-if="!sort.useDefaultSort">{{$t('sortField')}}：</span> <el-select  v-if="!sort.useDefaultSort"
        v-model="sort.sortField" :placeholder="$t('sortField')">
        <el-option
            v-for="(item, index) in listTableData"
            :key="index"
            :label="item.fieldName?item.fieldName:item.bindColumn"
            :value="item.bindColumn"
        />
      </el-select>
     </el-row>
    <div class="mainBox">
      <main-fixed :title="$t('code.codeStepFour.leftTitle')">
        <div slot="list">
          <el-button type="primary" icon="el-icon-s-tools" size="small"
                     style="width: 90%;margin: 0 auto;display: block;" @click="setTreeEvent">{{$t('code.codeStepFour.configTreeBtn')}}
          </el-button>
          <el-form ref="treeform" :rules="treeRules" :model="treeform" label-position="top"
                   style="width: 90%;margin: 0 auto;" size="small" v-if="setFormData">
			<el-form-item>
				<el-button size="small" type="primary" plain style="width: 100%;" @click="addDataSource">{{$t('addDataSource')}}</el-button>
			</el-form-item>
            <!-- <el-form-item :label="$t('code.codeStepFour.dataSource')">
              <el-select v-model="treeform.treeSource" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="treeSourceChange">
                <el-option
                    v-for="item in treeSourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item :label="$t('code.codeStepFour.dataSourceSelect')" prop="treeSourceId" v-if="treeform.treeSource == 1">
              <el-select v-model="treeform.treeSourceId" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="sourceIdChange">
                <el-option
                    v-for="item in treeSourceIdOptions"
                    :key="item.F_Id"
                    :label="item.F_Name"
                    :value="item.F_Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.sqlStatement')"  prop="treeSql" v-if="treeform.treeSource == 2">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  :placeholder="$t('code.codeStepFour.placeholderSql')"
                  v-model="treeform.treeSql">
              </el-input>
              <el-button type="primary" @click='validateSQL' style="width: 100%;margin-top: 10px;">{{$t('code.codeStepFour.verifyStatement')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.fieldId')" prop="treefieldId">
              <el-select v-model="treeform.treefieldId" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.parentField')" prop="treeParentId">
              <el-select v-model="treeform.treeParentId" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.showField')" prop="treefieldShow">
              <el-select v-model="treeform.treefieldShow" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.assocField')" prop="treefieldRe">
              <el-select v-model="treeform.treefieldRe" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldReOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.treeTitle')">
              <el-input v-model="treeform.treeTitleName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('parentIcon')">
              	<el-input :placeholder="$t('selectParentIcon')" size="small" v-model="treeform.treeParentIcon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon('parent')"></i>
								</el-input>
            </el-form-item>
             <el-form-item :label="$t('childIcon')">
              	<el-input :placeholder="$t('selectChildIcon')" size="small" v-model="treeform.treeChildIcon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon('child')"></i>
								</el-input>
            </el-form-item>
            <el-form-item>
              <el-button plain size="mini" style="width: 45.5%;" @click="cancelSetTree">{{$t('buttonModule.modalCancelBtn')}}</el-button>
              <el-button type="primary" size="mini" style="width: 45.5%;" @click="resetTreeSetion">{{$t('searchModule.searchReset')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" style="width: 100%;" @click="setTreeConfirm">{{$t('buttonModule.modalSureBtn')}}</el-button>
            </el-form-item>
          </el-form>
          <el-tree :data="treeResult" :props="defaultProps" v-if="!setFormData&&treeResult.length>0"></el-tree>
        </div>
      </main-fixed>
      <main-content :title="$t('code.codeStepFour.listFieldConfig')" :paddingLeft="210" :paddingTop="40" :search="false"
                    style="height: calc(100% - 50px);">
        <div slot="table" style="height: 100%;">
		 <p class="head_title">{{$t('code.codeStepFour.listFieldConfig')}}</p>
          <avue-crud ref="multipleTable" :data="listTableData" :option="listOption" stripe  @sortable-change="sortableChange">
            <template slot="add" slot-scope="scope">
              <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;"
                 @click="deleteData(scope)"></i>
            </template>
            <template slot="fieldName" slot-scope="scope">
              <el-select v-model="scope.row.fieldName" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="selectField(scope)">
                <el-option
                    v-for="item in treefieldReOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot="align" slot-scope="scope">
              <el-select v-model="scope.row.align" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in alignOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot="width" slot-scope="scope">
              <el-input v-model="scope.row.width" :placeholder="$t('code.codeStepFour.placeholderColumnWidth')" type="number"></el-input>
            </template>
          </avue-crud>
        </div>
      </main-content>
      <div class="footBox">
        <div
            style="display: flex;align-items: center;justify-content: flex-end;border: 1px solid #ddd;padding-right: 20px;height: 48px;">
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item label="">
              <div style="display: flex;">
                <span>{{$t('code.codeStepFour.displayPerPage')}}</span>
                <el-input v-model="form.pageSize" type="number" style="width: 100px;margin: 0 10px;"></el-input>
                <span>{{$t('code.codeStepFour.rowData')}}</span>
              </div>
            </el-form-item>
            <el-form-item label="">
              <el-radio-group v-model="form.isPage">
                <el-radio label="1">{{$t('code.codeStepFour.page')}}</el-radio>
                <el-radio label="0">{{$t('code.codeStepFour.noPage')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('code.codeStepFour.titleAddBtn')" :append-to-body='true' :visible.sync="dialogBtnVisible" width="40%"
               :before-close="cancelForm" style="padding: 10px 20px;">
      <el-form :rules="btnRules" ref="btnForm" :model="btnForm" label-width="80px" :validate-on-rule-change="false">
        <el-form-item prop="val" :label="$t('code.codeStepFour.labelBtnId')">
          <el-input :placeholder="$t('code.codeStepFour.placeholderBtnId')" size="small"
                    v-model="btnForm.val"></el-input>
        </el-form-item>
        <el-form-item prop="name" :label="$t('code.codeStepFour.labelBtnName')">
          <el-input :placeholder="$t('code.codeStepFour.placeholderBtnName')" size="small"
                    v-model="btnForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
			<el-button size="mini" type="primary" @click="cancelForm()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
	        <el-button size="mini" type="primary"
                     @click="confirmBtn()">{{$t('buttonModule.modalSureBtn')}}</el-button>
	    </span>
    </el-dialog>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('code.codeStepFour.titleFastImport')" :append-to-body='true' :visible.sync="importVisible" width="80%"
               :before-close="cancelImport">
      <ImportConfiguration v-if="importVisible" :parameValue="parameValue" ref="importformId"></ImportConfiguration>
      <span slot="footer" class="dialog-footer">
			<el-button size="mini" type="primary" @click="cancelImport()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
		    <el-button size="mini" type="primary"
                   @click="confirmImport()">{{$t('buttonModule.modalSureBtn')}}</el-button>
		</span>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('menuManagement.addModal.iconModal.modalTitle')" :append-to-body="true" :visible.sync="iconVisible" width="80%">
		<FontHtml v-on:childByValue="childByValue"></FontHtml>
	</el-dialog>
	<add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source>
  </div>
</template>

<script>
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import FontHtml from "../../FontAwesome.vue";
import ImportConfiguration from '@/components/quickDevelopment/ImportConfiguration';
import { getDataSource } from '@/api/databasemanage/datasource';
import { getDataFieldBySQL, getTreeDataBySQL,getDataLinkTreeDataBySQL } from '@/api/databasemanage/datasource';
import { getDbFieldBySQL, getTreeDataByDbLink  } from '@/api/databasemanage/databaselink';
import AddDataSource from '@/components/AddDataSource';
export default {
  props: [
    'baseData',
    'isNextStep'
  ],
  watch: {
  	dataSourceVisible: {
  	  handler (val) {
  	    if(!val) this.getDataSource()
  	  }
  	}
  },
  data () {
    return {
      btns: [
        { name:this.$t('code.codeStepFour.refreshBtn'), val: 'refresh', icon: 'el-icon-refresh-right', checked: true },
        { name:this.$t('code.codeStepFour.addhBtn'), val: 'add', icon: 'el-icon-plus', checked: true },
        { name:this.$t('code.codeStepFour.editBtn'), val: 'modify', icon: 'el-icon-edit', checked: true },
        { name:this.$t('code.codeStepFour.deleteBtn'), val: 'delete', icon: 'el-icon-delete', checked: true },
        { name:this.$t('code.codeStepFour.allDeleteBtn'), val: 'batchDelete', icon: 'el-icon-delete', checked: true },
        { name:this.$t('code.codeStepFour.printBtn'), val: 'print', icon: 'el-icon-printer', checked: true },
        { name:this.$t('code.codeStepFour.importBtn'), val: 'import', icon: 'fa fa-sign-in', checked: false },
        { name:this.$t('code.codeStepFour.exportBtn'), val: 'export', icon: 'fa fa-sign-out', checked: false },
        // { name: '发起流程', val: 'createFlow', icon: 'fa', checked: false },
        { name:this.$t('code.codeStepFour.createFlowBtn'), val: 'createDesignFlow', icon: 'fa', checked: false },
        { name:this.$t('code.codeStepFour.createApprovalBtn'), val: 'createFormFlow', icon: 'fa', checked: false },
      ],
      btnForm: {
        val: '',
        name: '',
        icon: '',
        checked: true
      },
      doNotGenerateTags:['h2','el-divider','xjr-opinion-comonent','table'],
      confirmSqlFlag : false,
      dialogBtnVisible: false,
      importVisible: false,
      impData: {},
      exportForm: {
        bindBtn: '',
        f_column: ''
      },
	  dataSourceVisible:false,
      listTableData: [],
      listOption: {
        highlightCurrentRow: true,
        stripe: true,
        header: false,
        menu: false,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        page: false,
        sortable: true,
        dragHandler: true,
        column: [
          {
            label: '',
            prop: 'add',
            renderHeader: (h, { column, $index }) => {
              return h('i',
                  {
                    style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                    class: 'el-icon-circle-plus',
                    on: {
                      click: this.addRow
                    }
                  },
              );
            },
            width: '50px',
            slot: true
          },
          {
            label:this.$t('code.codeStepFour.tableHeaderColumnName'),
            prop: 'fieldName',
            slot: true
          }, {
            label:this.$t('code.codeStepFour.tableHeaderAlignment'),
            prop: 'align',
            slot: true
          }, {
            label:this.$t('code.codeStepFour.tableHeaderWidth'),
            prop: 'width',
            slot: true
          }
        ]
      },
      form: {
        pageSize: 10,
        isPage: '1'
      },
      alignOptions: [
        { value: 'left', label:this.$t('code.codeStepFour.alignLeft') }, { value: 'center', label: this.$t('code.codeStepFour.Centered')}, { value: 'right', label:this.$t('code.codeStepFour.alignRight')}
      ],
      treeform: {
        treeSource: 1,
        treeSourceId: '',
        treefieldId: '',
        treeParentId: '',
        treefieldShow: '',
        treefieldRe: '',
        treeTitleName: '',
        treeParentIcon:'',
        treeChildIcon:''
      },
      treeSourceOptions: [{ value: 1, label:this.$t('code.codeStepFour.dataOrigin')}, { value: 2, label:this.$t('code.codeStepFour.sqlStatement')}],
      treeSourceIdOptions: [],
      treefieldIdOptions: [],
      treefieldReOptions: [],
      setFormData: false,   //是否配置结构树
      treeFlag: false,
      btnRules: {
        val: [
          { required: true, message: this.$t('code.codeStepFour.placeholderBtnId'), trigger: 'blur' }
        ],
        name: [
          { required: true, message:this.$t('code.codeStepFour.placeholderBtnName'), trigger: 'blur' }
        ],
        bindBtn: [
          { required: true, message:this.$t('code.codeStepFour.hintBindBtn'), trigger: 'change' }
        ],
        f_column: [
          { required: true, message:this.$t('code.codeStepFour.hintExportName'), trigger: 'blur' }
        ]
      },
      treeRules: {
        treeSourceId: [
          { required: true, message:this.$t('code.codeStepFour.hintDataOrigin'), trigger: 'change' }
        ],
        // treeSql: [
        //   { required: true, message: '请填写SQL', trigger: 'blur' }
        // ],
        treefieldId: [
          { required: true, message:this.$t('code.codeStepFour.hintFieldId'), trigger: 'change' }
        ],
        treeParentId: [
          { required: true, message:this.$t('code.codeStepFour.hintParentField'), trigger: 'change' }
        ],
        treefieldShow: [
          { required: true, message:this.$t('code.codeStepFour.hintShowField'), trigger: 'change' }
        ],
        treefieldRe: [
          { required: true, message:this.$t('code.codeStepFour.hintAssocField'), trigger: 'change' }
        ]
      },
      treeResult: [],
      defaultProps: {
        children: 'children',
        label: ''
      },
      val: false,
      parameValue:'',
      sort:{
        useDefaultSort:true,
        sortField:'',
        order:"desc"
        },
      sortOptions:[],
      iconVisible:false,
      iconType:''
    };
  },
  components: {
    MainFixed,
    MainContent,
    ImportConfiguration,
    FontHtml,
	AddDataSource
  },
  methods: {
    selectMoreIcon(type){
      this.iconType=type;
			this.iconVisible=true;
		},
    childByValue(childValue) {
      if(this.iconType=='parent'){
        this.treeform.treeParentIcon = childValue;
      }else if(this.iconType=='child'){
        this.treeform.treeChildIcon = childValue;
      }
      this.iconType = "";
      this.iconVisible=false;
    },
    changeSortOptions(val){
    if(val==false){
      // this.sortOptions = this.activeData.__config__.children;
      console.log('this.listTableData',this.listTableData);
    }
  },
    deleteData (scope) {
      this.listTableData.splice(scope.row.$index, 1);
    },
    sortableChange (oldindex, newindex, row, list) {
      this.listTableData = [];
      this.$nextTick(() => {
        this.listTableData = list;
      });
    },
    addRow () {
      var obj = {
        fieldName: '',
        align: '',
        width: '',
        FKid: '',
        bindTable: '',
        bindColumn: '',
        colType: ''
      };
      this.listTableData.push(obj);
    },
    selectField (val) {
      console.log("ssssss")
      let obj = this.treefieldReOptions.find((item, i) => {
        return item.value == val.row.fieldName;
      });
      let objT = {
        fieldName: obj.label,
        align: '',
        width: '',
        FKid: obj.FKid,
        bindTable: obj.table,
        bindColumn: obj.value,
        colType: obj.colType
      };
      let idx = this.listTableData.findIndex((item, i) => {
        return item.fieldName == obj.value;
      });
      this.listTableData.splice(idx, 1, objT);
    },
    treeSourceChange (val) {
      //重置数据
      this.treeform = {
        treeSource: val,
        treeSourceId: '',
        treefieldId: '',
        treeParentId: '',
        treefieldShow: '',
        treefieldRe: '',
        treeTitleName: ''
      };

      this.getDataSource()     
    },
	getDataSource(){
		getDataSource().then(res => {
		  if (res.data.success) {
		    this.treeSourceIdOptions = res.data.data;
		  }
		});
	},
	addDataSource(){
		this.dataSourceVisible=true;
	},
    sourceIdChange (val) {
      //  this.treeform = {
      //   treeSourceId: val,
      //   treefieldId: '',
      //   treeParentId: '',
      //   treefieldShow: '',
      //   treefieldRe: '',
      //   treeTitleName: ''
      // };
      // this.$refs['treeform'].resetFields()
      getDataFieldBySQL(val).then(res => {
        if (res.data.success) {
          this.treefieldIdOptions = res.data.data;
        }
      });
    },
    setTreeEvent () {
      this.setFormData = !this.setFormData;
    },
    getTabsInfo(childrenObj){
      let dataChildren = [];

      if(childrenObj && childrenObj instanceof Object){
        for(let key in childrenObj){
          let children = childrenObj[key];
          children.map((item)=>{
            if(item?.__config__?.componentName == 'table'){
              //this.getTabsInfo(item?.__config__?.childrenObj);
            }else{
              dataChildren.push(item);
            }
          });
        }
      }
      return (()=>{return dataChildren})();
    },
    addBtnEvent () {
      this.dialogBtnVisible = true;
    },
    cancelForm () {
      this.dialogBtnVisible = false;
    },
    confirmBtn () {
      let obj = Object.assign({}, this.btnForm);
      this.$refs['btnForm'].validate((valid) => {
        if (valid) {
          this.btns.push(obj);
          this.dialogBtnVisible = false;
        }
      });
    },
    checkButton (val) {
      val.checked = !val.checked;
      if (val.val == 'export' && val.checked) {
      } else if (val.val == 'export' && !val.checked) {
        this.exportForm = {};
      } else if (val.val == 'import' && val.checked) {
        this.importVisible = true;
        let btn = [...this.btns];
        btn = btn.filter((item, i) => {
          return item.val != 'export';
        });
        this.parameValue = {
          database: this.baseData.step1,
          conf: this.baseData.step2,
          fields: this.listTableData,
          btns: btn
        };
      } else if (val.val == 'import' && !val.checked) {
        this.impData = {};
      }
    },
    cancelImport () {
      this.importVisible = false;
      this.btns.forEach((item, i) => {
        if (item.val == 'import') {
          item.checked = false;
        }
      });
    },
    confirmImport () {
      var obj = this.$refs.importformId.getChildData();
      // obj.impField.forEach(field =>{
      //    field.F_OnlyOne === '唯一' ? field.F_OnlyOne = 1 : field.F_OnlyOne = 0;
      // });
        this.impData = obj;
        this.importVisible = false;
    },
    validateSQL () {

      
     this.treeform.treeSql = this.treeform.treeSql.replace(/[\r\n]/g,' ');
      let id = this.baseData.step1.F_DbId?this.baseData.step1.F_DbId:'localDB';
      this.treeform.treeSourceId = id;
      getDbFieldBySQL(id, { sql: this.treeform.treeSql }).then(res => {
    
        if (res.data.success) {
          this.treefieldIdOptions = res.data.data;
          this.$message({
            message:this.$t('code.codeStepFour.hintVerifySuccess'),
            type: 'success'
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }

      });
    },
    cancelSetTree () {
      this.setFormData = false;
      this.treeResult = [];
    },
    resetTreeSetion () {
      this.treeform = {
        treeSource: 1,
        treeSourceId: '',
        treefieldId: '',
        treeParentId: '',
        treefieldShow: '',
        treefieldRe: '',
        treeTitleName: '',
        treeParentIcon:'',
        treeChildIcon:''
      };

      this.$refs['treeform'].resetFields()
    },
    async setTreeConfirm () {
      console.log('treeform.treeSource',this.treeform.treeSource,this.baseData.step1.F_DbId);
      let valid = this.validateTreeForm();
      if(!valid){
        return false;
      }
      let datum = {
        field: this.treeform.treefieldId,
        parentfield: this.treeform.treeParentId
      };
      let res = {data:{success:false}};
      if(this.treeform.treeSource==1){
        // 数据源
        res = await getTreeDataBySQL(this.treeform.treeSourceId,datum);
      }else if(this.treeform.treeSource==2){
        // SQL
        let id = this.baseData.step1.F_DbId?this.baseData.step1.F_DbId:'localDB'
        datum.sql = this.treeform.treeSql ?? null;
        res = await getDataLinkTreeDataBySQL(id,datum);
      }
      if (res.data.success) {
        this.treeResult = res.data.data || [];
        this.defaultProps.label = this.treeform.treefieldShow;
        this.setFormData = false;
        //标记已经是树结构
        this.treeFlag = true;
      } else {
        this.$message({
          message: res.data.msg,
          type: 'error'
        });
      }
    },
    getTreeDataBySQL (treeform = this.treeform) {
     
      

      // if(!treeform.treeSourceId){
      //   datum.sql = treeform.treeSql
      //   getTreeDataByDbLink(this.baseData.step1.F_DbId,datum).then(res => {
      //     if (res.data.success) {
      //       this.treeResult = res.data.data || [];
      //       this.defaultProps.label = this.treeform.treefieldShow;
      //       this.setFormData = false;
      //       //标记已经是树结构
      //       this.treeFlag = true;
      //     } else {
      //       this.$message({
      //         message: res.data.msg,
      //         type: 'error'
      //       });
      //     }
      //   });
      // }
      // else{
      //   getTreeDataBySQL(treeform.treeSourceId, datum).then(res => {
      //     if (res.data.success) {
      //       this.treeResult = res.data.data || [];
      //       this.defaultProps.label = this.treeform.treefieldShow;
      //       this.setFormData = false;
      //       //标记已经是树结构
      //       this.treeFlag = true;
      //     } else {
      //       this.$message({
      //         message: res.data.msg,
      //         type: 'error'
      //       });
      //     }
      //   });
      // }


    },
    validateTreeForm () {
      let val = false;
      this.$refs['treeform'].validate((valid) => {
        let obj = {
          treeform: this.treeform
        };
        this.$emit('onChange', obj);
        val = valid;
      });
      return val;
    },
    validateData () {
      let valid = false;
      if (this.setFormData) {
        valid = this.validateTreeForm();
        console.log('valie',valid);
        console.log('treeResultLength',this.treeResult.length);
        if (valid && this.treeResult.length > 0) {
          valid = true;
        } else if (valid && this.treeResult.length <= 0) {
          valid = false;
          this.$message({
            message:this.$t('code.codeStepFour.hintConfirmConfig'),
            type: 'warning'
          });
        }
      } else {
        valid = true;
      }
      let obj = {
        ExpData: this.exportForm,
        btns: this.btns,
        fields: this.listTableData,
        sort:this.sort,
        impData: this.impData,
        isPage: this.form.isPage,
        isTree: this.treeFlag ? 1 : 0,
        pageSize: this.form.pageSize,
        treeform: this.treeform
      };

      this.$emit('onChange', obj);
      return valid;
    }
  },
  created () {
    this.treeSourceChange(1);
    if (this.baseData.step4) {
      console.log('this.baseData.step4',this.baseData.step4);
      const data = this.baseData.step4;
      if (data.impData) this.impData = data.impData;
      if (data.sort) this.sort = data.sort;
      if (data.treeform) this.treeform = data.treeform;
      if (data.pageSize) this.form.pageSize = data.pageSize;
      if (data.istree) this.treeFlag = Boolean(Number(data.istree));
      if (data.isPage) this.form.isPage = data.isPage;
      if (data.btns) this.btns = data.btns;
      if (data.ExpData) this.exportForm = data.ExpData;

      this.baseData.step4.treeform?.treefieldId && (this.treeform = this.baseData.step4.treeform) && this.getTreeDataBySQL(this.treeform);

    }
    this.listTableData = [];
    // 点击上一步
    if(!this.isNextStep){
      if (this.baseData.step4&&this.baseData.step4.fields&&this.baseData.step4.fields.length > 0) {
        this.listTableData = this.baseData.step4.fields;
      }
      return;
    }
    if (this.baseData.step2.length > 0) {
      let tempArr = [...this.baseData.step2];

      tempArr.forEach((items, j) => {
        if (items.__config__.bindTableField) {
          if(items.__config__.tag&&!this.doNotGenerateTags.includes(items.__config__.tag)){
              this.treefieldReOptions.push({
                label: items.__config__.label,
                value: items.__config__.bindTableField,
                table: items.__config__.bindTable,
                colType: items.__config__.bindTableFieldType,
                FKid: 'FK_' + items.__config__.bindTableField + items.__config__.bindTable
              });
          }
          let obj = {
            fieldName: items.__config__.label,
            align: 'center',
            width: '',
            FKid: 'FK_' + items.__config__.bindTableField + items.__config__.bindTable,
            bindColumn: items.__config__.bindTableField,
            bindTable: items.__config__.bindTable,
            colType: items.__config__.bindTableFieldType
          };
          if (!this.listTableData.find((item, i) => {return item.FKid === obj.FKid;})) {
            if(items.__config__.tag&&!this.doNotGenerateTags.includes(items.__config__.tag)){
              this.listTableData.push(obj);
            }
          }
        }
        //收集 avue-tabs 字段信息
        if(items.__config__.componentName == "avue-tabs"){
            let _resultArr = this.getTabsInfo(items?.__config__?.childrenObj);

            _resultArr.map((field,idx)=>{
              if(field.__config__.tag&&!this.doNotGenerateTags.includes(field.__config__.tag)){
                  this.treefieldReOptions.push({
                    label: field.__config__.label,
                    value: field.__config__.bindTableField,
                    table: field.__config__.bindTable,
                    colType: field.__config__.bindTableFieldType,
                    FKid: 'FK_' + field.__config__.bindTableField + field.__config__.bindTable
                  });
              }
              let newObj = {
                fieldName: field.__config__.label,
                align: 'center',
                width: '',
                FKid: 'FK_' + field.__config__.bindTableField + field.__config__.bindTable,
                bindColumn: field.__config__.bindTableField,
                bindTable: field.__config__.bindTable,
                colType: field.__config__.bindTableFieldType
              };
              if (!this.listTableData.find((el, i) => {return el.FKid === newObj.FKid;})) {
                if(field.__config__.tag&&!this.doNotGenerateTags.includes(field.__config__.tag)){
                  this.listTableData.push(newObj);
                }
              }
            })
          }
      });
    }
  }
};
</script>

<style scoped>
.avue-crud {
  height: 100%;
}

.btnbox {
  display: flex;
  justify-content: flex-end;
  border: 1px solid #E9E9E9;
  padding: 5px;
  border-radius: 5px;
}
.sortbox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 172px;
  right: 300px;
  z-index: 3;
}
.sortFieldbox{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 172px;
  right: 30px;
  z-index: 3;
}
.mainBox {
  height: calc(100% - 56px);
  padding-top: 10px;
}

.footBox {
  padding-left: 210px;
  height: 50px;
}

.footBox .el-form-item {
  margin-bottom: 0;
}

.btnbox .el-button--primary.is-plain:focus {
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.btnbox .el-button--primary:focus {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:-10px;
	line-height: 40px;
	color: #4d4d4d;
}
div /deep/ .main-table-content{
	border-top: none;
}

div /deep/ .el-input__icon{
	line-height: 20px;
}
div /deep/ .main-fixed .main-header{
	font-size: 12px;
	height: 30px;
	line-height: 20px;
	font-weight: bold;
}
</style>
