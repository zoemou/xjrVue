<template>
  <div class="main-container">
    <el-row class="btn-box">
      <el-button v-for="(item,index) in this.baseData.step4.btns" type="primary" :key="index" :icon="item.icon" size="small" @click="checkButton(item)"
                 :plain="!item.checked">{{ item.name }}
      </el-button>
      <el-button icon="el-icon-plus" size="small" @click="addBtnEvent"></el-button>
    </el-row>
    
    <div class="main-box">
      <main-fixed :title="$t('code.codeStepFour.leftTitle')"  class="left">
        <div slot="list">
          <el-button type="primary" icon="el-icon-s-tools" size="small" class="set-tree" @click="setTreeEvent">{{$t('code.codeStepFour.configTreeBtn')}}
          </el-button>
          <el-form ref="treeform" :rules="treeRules" :model="baseData.step4.treeform" label-position="top"
              class="tree-form"  size="small" v-if="setFormData">
            <el-form-item :label="$t('code.codeStepFour.dataSource')">
              <el-select v-model="baseData.step4.treeform.treeSource" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="treeSourceChange">
                <el-option
                    v-for="item in treeSourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.dataSourceSelect')" prop="treeSourceId" v-if="baseData.step4.treeform.treeSource == 1">
              <el-select v-model="baseData.step4.treeform.treeSourceId" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="sourceIdChange">
                <el-option
                    v-for="item in treeSourceIdOptions"
                    :key="item.F_Id"
                    :label="item.F_Name"
                    :value="item.F_Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.sqlStatement')"  prop="treeSql" v-if="baseData.step4.treeform.treeSource == 2">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  :placeholder="$t('code.codeStepFour.placeholderSql')"
                  v-model="baseData.step4.treeform.treeSql">
              </el-input>
              <el-button type="primary" @click='validateSQL' style="width: 100%;margin-top: 10px;">{{$t('code.codeStepFour.verifyStatement')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.fieldId')" prop="treefieldId">
              <el-select v-model="baseData.step4.treeform.treefieldId" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.parentField')" prop="treeParentId">
              <el-select v-model="baseData.step4.treeform.treeParentId" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.showField')" prop="treefieldShow">
              <el-select v-model="baseData.step4.treeform.treefieldShow" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                    v-for="item in treefieldIdOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.assocField')" prop="treefieldRe">
              <el-select v-model="baseData.step4.treeform.treefieldRe" :placeholder="$t('code.codeStepFour.placeholderSelect')">
                <el-option
                  v-for="(item, index) in baseData.step4.fields"
                :key="index"
                :label="item.fieldName?item.fieldName:item.bindColumn"
                :value="item.bindColumn">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('code.codeStepFour.treeTitle')">
              <el-input v-model="baseData.step4.treeform.treeTitleName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('parentIcon')">
              	<el-input :placeholder="$t('selectParentIcon')" size="small" v-model="baseData.step4.treeform.treeParentIcon">
										<i slot="suffix" class="el-icon-more" @click="selectMoreIcon('parent')"></i>
								</el-input>
            </el-form-item>
             <el-form-item :label="$t('childIcon')">
              	<el-input :placeholder="$t('selectChildIcon')" size="small" v-model="baseData.step4.treeform.treeChildIcon">
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
      <div class="sort-box">
        <div class="sort-default">
          <span>{{$t('defaultSort')}}：</span> <el-switch v-model="baseData.step4.sort.useDefaultSort"/>
        </div>
        <div class="sort-field-box">
          <span  v-if="!baseData.step4.sort.useDefaultSort">{{$t('sortOrder')}}：</span> 
          <el-select  v-if="!baseData.step4.sort.useDefaultSort"
            v-model="baseData.step4.sort.order" :placeholder="$t('sortOrder')">
            <el-option
                :label="$t('positiveSequence')"
                value="asc"
            />
            <el-option
                :label="$t('reverseOrder')"
                value="desc"
            />
          </el-select>
          <span style="padding-left: 8px;"  v-if="!baseData.step4.sort.useDefaultSort">{{$t('sortField')}}：</span> 
          <el-select  v-if="!baseData.step4.sort.useDefaultSort"
            v-model="baseData.step4.sort.sortField" :placeholder="$t('sortField')">
            <el-option
                v-for="(item, index) in baseData.step4.fields"
                :key="index"
                :label="item.fieldName?item.fieldName:item.bindColumn"
                :value="item.bindColumn"
            />
          </el-select>
        </div>
      </div>
      <main-content :title="$t('code.codeStepFour.listFieldConfig')" :paddingLeft="0" :paddingTop="0" :search="false"
                    style="height: calc(100% - 50px);">
        <div slot="table" style="height: 100%;">
		 <p class="head_title">{{$t('code.codeStepFour.listFieldConfig')}}</p>
          <avue-crud class="list-box" ref="multipleTable" :data="baseData.step4.fields" :option="listOption" stripe  @sortable-change="sortableChange">
            <template slot="add" slot-scope="scope">
              <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;"
                 @click="deleteData(scope)"></i>
            </template>
            <template slot="fieldName" slot-scope="scope">
              <el-select v-model="scope.row.bindColumn" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="selectField(scope)">
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
       
      <div class="foot-box">
        <div
           class="foot-page">
          <el-form ref="form" :model="baseData.step4" :inline="true">
            <el-form-item label="">
              <div style="display: flex;">
                <span>{{$t('code.codeStepFour.displayPerPage')}}</span>
                <el-input v-model="baseData.step4.pageSize" type="number" style="width: 100px;margin: 0 10px;"></el-input>
                <span>{{$t('code.codeStepFour.rowData')}}</span>
              </div>
            </el-form-item>
            <el-form-item label="">
              <el-radio-group v-model="baseData.step4.isPage">
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
  </div>
</template>

<script>
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import FontHtml from "@/views/FontAwesome.vue";
import ImportConfiguration from '@/components/quickDevelopment/ImportConfiguration';
import { getDataSource } from '@/api/databasemanage/datasource';
import { getDataFieldBySQL, getTreeDataBySQL,getDataLinkTreeDataBySQL } from '@/api/databasemanage/datasource';
import { getDbFieldBySQL, getTreeDataByDbLink  } from '@/api/databasemanage/databaselink';

export default {
  props: [
    'baseData',
    'isNextStep',
    'treefieldReOptions'
  ],
  data () {
    return {
      btns: [
        { name:this.$t('code.codeStepFour.refreshBtn'), val: 'refresh', icon: 'el-icon-refresh-right', checked: true },
        { name:this.$t('code.codeStepFour.addhBtn'), val: 'add', icon: 'el-icon-plus', checked: true },
         { name:this.$t('crud.viewBtn'), val: 'view', icon: 'el-icon-view', checked: true },
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
      alignOptions: [
        { value: 'left', label:this.$t('code.codeStepFour.alignLeft') }, { value: 'center', label: this.$t('code.codeStepFour.Centered')}, { value: 'right', label:this.$t('code.codeStepFour.alignRight')}
      ],
      treeSourceOptions: [
        { value: 1, label:this.$t('code.codeStepFour.dataOrigin')},
        //  { value: 2, label:this.$t('code.codeStepFour.sqlStatement')}
         ],
      treeSourceIdOptions: [],
      treefieldIdOptions: [],
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
      iconVisible:false,
      iconType:''
    };
  },
  components: {
    MainFixed,
    MainContent,
    ImportConfiguration,
    FontHtml
  },
  methods: {
    selectMoreIcon(type){
      this.iconType=type;
			this.iconVisible=true;
		},
    childByValue(childValue) {
      if(this.iconType=='parent'){
        this.baseData.step4.treeform.treeParentIcon = childValue;
      }else if(this.iconType=='child'){
        this.baseData.step4.treeform.treeChildIcon = childValue;
      }
      this.iconType = "";
      this.iconVisible=false;
    },
    deleteData (scope) {
      this.baseData.step4.fields.splice(scope.row.$index, 1);
    },
    sortableChange (oldindex, newindex, row, list) {
      this.baseData.step4.fields = [];
      this.$nextTick(() => {
        this.baseData.step4.fields = list;
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
      this.baseData.step4.fields.push(obj);
    },
    selectField(val) {
      console.log('测试',val);
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
      let idx = this.baseData.step4.fields.findIndex((item, i) => {
        return item.fieldName == obj.value;
      });
      this.baseData.step4.fields.splice(idx, 1, objT);
    },
    treeSourceChange (val) {
      // //重置数据
      // this.baseData.step4.treeform = {
      //   treeSource: val,
      //   treeSourceId: '',
      //   treefieldId: '',
      //   treeParentId: '',
      //   treefieldShow: '',
      //   treefieldRe: '',
      //   treeTitleName: ''
      // };

      getDataSource().then(res => {
        if (res.data.success) {
          this.treeSourceIdOptions = res.data.data;
        }
      });
      
    },
    sourceIdChange (val) {
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
          this.baseData.step4.btns.push(obj);
          this.dialogBtnVisible = false;
        }
      });
    },
    checkButton (val) {
      val.checked = !val.checked;
      if (val.val == 'export' && val.checked) {
      } else if (val.val == 'export' && !val.checked) {
        this.baseData.step4.ExpData = {};
      } else if (val.val == 'import' && val.checked) {
        this.importVisible = true;
        let btn = [...this.baseData.step4.btns];
        btn = btn.filter((item, i) => {
          return item.val != 'export';
        });
        this.parameValue = {
          database: this.baseData.step1,
          conf: this.baseData.step2,
          fields: this.baseData.step4.fields,
          btns: btn
        };
      } else if (val.val == 'import' && !val.checked) {
        this.baseData.step4.impData = {};
      }
    },
    cancelImport () {
      this.importVisible = false;
      this.baseData.step4.btns.forEach((item, i) => {
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
        this.baseData.step4.impData = obj;
        this.importVisible = false;
    },
    validateSQL () {

      
     this.baseData.step4.treeform.treeSql = this.baseData.step4.treeform.treeSql.replace(/[\r\n]/g,' ');
      let id = this.baseData.step1.F_DbId?this.baseData.step1.F_DbId:'localDB';
      this.baseData.step4.treeform.treeSourceId = id;
      getDbFieldBySQL(id, { sql: this.baseData.step4.treeform.treeSql }).then(res => {
    
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
      this.baseData.step4.treeform = {
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
      let valid = this.validateTreeForm();
      if(!valid){
        return false;
      }
      await this.getTreeData();
    },
    async getTreeData () {
      let datum = {
        field: this.baseData.step4.treeform.treefieldId,
        parentfield: this.baseData.step4.treeform.treeParentId
      };
      let res = {data:{success:false}};
      if(this.baseData.step4.treeform.treeSource==1){
        // 数据源
        res = await getTreeDataBySQL(this.baseData.step4.treeform.treeSourceId,datum);
      }else if(this.baseData.step4.treeform.treeSource==2){
        // SQL
        // let id = this.baseData.step1.F_DbId?this.baseData.step1.F_DbId:'localDB'
        // datum.sql = this.baseData.step4.treeform.treeSql ?? null;
        // res = await getDataLinkTreeDataBySQL(id,datum);
      }
      if (res.data.success) {
        this.treeResult = res.data.data || [];
        this.defaultProps.label = this.baseData.step4.treeform.treefieldShow;
        this.setFormData = false;
        //标记已经是树结构
        this.treeFlag = true;
        this.baseData.step4.isTree = 1;
      } else {
        this.$message({
          message: res.data.msg,
          type: 'error'
        });
      }
    },
    validateTreeForm () {
      let val = false;
      this.$refs['treeform'].validate((valid) => {
        val = valid;
      });
      return val;
    },
  },
  async created () {
    this.treeSourceChange(1);
    if(this.baseData.step4.treeform.treeSourceId){
      this.setFormData = true;
      await this.getTreeData();
    }
  }
};
</script>

<style scoped>

.main-container{
  height: 100%;
}
.avue-crud {
  height: 100%;
}

.btn-box {
  display: flex;
  justify-content: flex-end;
  padding: 5px;
  border-bottom: 2px solid #eeeeee;
}
.sort-box{
height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 888;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.sort-default {
  position: absolute;
  right: 536px;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-top:-10px;
}
.sort-field-box{
  position: absolute;
  right: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-top:-10px;
}
.main-box {
  position: relative;
  height: 100%;
}

.foot-box {
  /* padding-left: 210px; */
  /* height: 50px; */
}

.foot-page{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid rgb(221, 221, 221);
  height: 40px;
  position: fixed;
  bottom: 0;
  right: 20px;
  left: 260px;
}

.foot-box .el-form-item {
  margin-bottom: 0;
}

.btn-box .el-button--primary.is-plain:focus {
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.btn-box .el-button--primary:focus {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
}
div >>> .main-fixed .main-header{
  display: flex;
    align-items: center;
}
div >>> .main-body {
  padding: 20px;
  overflow-y: scroll !important;
  height: calc(100% - 180px) !important;
}
.head_title{
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  margin-top: -10px;
  line-height: 50px;
  color: #4d4d4d;
  height: 40px;
  margin-left: 15px;
}
div /deep/ .main-table-content{
	border-top: none;
}

div /deep/ .el-input__icon{
	line-height: 20px;
}
div /deep/ .main-fixed {
	border-right: 4px solid #eeeeee;
}
div /deep/ .main-fixed .main-header{
	font-size: 12px;
	height: 30px;
	line-height: 20px;
	font-weight: bold;
}
.treeform{
  width: 90%;
  margin: 0 auto;
}
.set-tree{
  width: 90%;
  margin: 0 auto;
  display: block;
}
div /deep/ .el-form--label-top .el-form-item__label{
	padding:0px;
}

.list-box /deep/ .el-table__body-wrapper{
  overflow-y: scroll !important;
  height: calc(100% - 230px) !important;
}

</style>
