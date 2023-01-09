<template>
<!-- 报表发布 -->
  <div class="main-container">
    <main-content title="表单列表" :paddingLeft="0">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input
              v-model="keyword"
              size="small"
              :placeholder="$t('searchModule.searchPlaceholder')"
              style="width: 200px; margin-right: 5px"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table" style="height: 100%">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud
            :data="formRelationList"
            :option="option"
            stripe
            :page.sync="page"
            :showColumn="showColumn"
            :isSaveColumns="true"
            @on-load="onPageLoad"
            @sort-change="sortChange"
            @row-click="rowClick"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            @row-dblclick="handleRowDBLClick"
            style="height: 100%"
        >
          <template slot-scope slot="menuLeft">
            <el-dialog v-dialogDrag
                :title="dialogTitle"
                :append-to-body="true"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                width="70%"
                :before-close="handleClose"
            >
            <template v-if="dialogVisible">
              <el-steps :active="active" finish-status="success" simple style="margin-bottom: 10px" v-if="dialogVisible">
                <el-step :title="$t('forme.addModal.stepOne')"></el-step>
                <el-step :title="$t('forme.addModal.stepTwo')"></el-step>
                <el-step :title="$t('forme.addModal.stepThree')"></el-step>
              </el-steps>
              <div  class="baseInfo-form" v-if="active == 0">
                <el-form :rules="rules" ref="menuForm" :model="menuForm" label-width="124px"
                         :validate-on-rule-change="false" v-if="dialogVisible">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="F_EnCode" :label="$t('forme.addModal.functionNumber')">
                        <el-input :placeholder="$t('forme.addModal.placeholderFunctionNumber')" size="small" v-model="menuForm.F_EnCode"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="F_FullName" :label="$t('forme.addModal.functionName')">
                        <el-input :placeholder="$t('forme.addModal.placeholderFunctioName')" size="small" v-model="menuForm.F_FullName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
					  <el-col :span="12">
					  	<el-form-item prop="F_LgMarkCode" :label="$t('reportModule.reportRelease.labelTransTag')">
                  <el-select
										v-model="menuForm.F_LgMarkCode"                            
										filterable
										remote
										reserve-keyword
										:placeholder=" $t('reportModule.reportRelease.labelTransTag')"
										:remote-method="remoteMethod"
										style="width:100%"
										:loading="loading"
										clearable>
										<el-option
										v-for="item in transDefaultTree"
										:key="item.F_Id"
										:label="item.F_Name"
										:value="item.F_EnCode">
										</el-option>
									</el-select>
					  	</el-form-item>
					  </el-col>
                    <el-col :span="12">
                      <el-form-item prop="F_SubSystemId" :label="$t('forme.addModal.owningSystem')">
                       <SelectionSystem  :isEdit="isEdit" v-model="menuForm.F_SubSystemId" @changeSystem="toggleSystem"></SelectionSystem>
                      </el-form-item>
                      </el-col>                    
                  </el-row>
                  <el-row>
					  <el-col :span="12">
					    <el-form-item prop="" :label="$t('forme.addModal.superiorFunction')">
                <template  v-if="allSystem.length">
                  <div v-for="(item,idx) in allSystem" :key="idx" >
                  <avue-input-tree
                      default-expand-all
                      v-model="menuForm.F_ParentId"
                      :placeholder="$t('forme.addModal.placeholderSuperiorFunction')"
                      type="tree"
                      :dic="defaultTree"
                      size="small"
                      style="width: 100%"
                      v-if="item.F_Id == menuForm.F_SubSystemId"
                  ></avue-input-tree>
                  </div>
                </template>
					      
					      <avue-input-tree
					          default-expand-all
					          v-model="menuForm.F_ParentId"
					          :placeholder="$t('forme.addModal.placeholderSuperiorFunction')"
					          type="tree"
					          :dic="defaultTree"
					          size="small"
					          style="width: 100%"
					          v-else
					      ></avue-input-tree>
					    </el-form-item>
					  </el-col>
                    <el-col :span="12">
                      <el-form-item prop="F_FormId" :label="$t('forme.addModal.formSelection')">
                        <avue-input-tree
                            default-expand-all
                            v-model="menuForm.F_FormId"
                            :placeholder="$t('forme.addModal.placeholderSelectForm')"
                            type="tree"
                            :dic="formSchmeTree"
                            size="small"
                            style="width: 100%"
                            @change="changeFormScheme"
                        ></avue-input-tree>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="F_SortCode" :label="$t('forme.addModal.functionOrder')">
                        <el-input
                            type="number"
                            :placeholder="$t('forme.addModal.placeholderFunctionOrder')"
                            size="small"
                            v-model="menuForm.F_SortCode"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="F_Icon" :label="$t('forme.addModal.functionIcon')">
                        <el-input :placeholder="$t('forme.addModal.placeholderFunctionIcon')" @focus="openDialog('FontHtml',1)" size="small" v-model="menuForm.F_Icon">
                          <i slot="suffix" class="el-icon-more" @click="openDialog('FontHtml',1)"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- <el-row>
                    <el-col :span="12">
                      <el-form-item prop="F_Width" :label="$t('forme.addModal.formFrameWidth')" :rules="rules1">
                        <el-input :placeholder="$t('forme.addModal.placeholderDefaultWidth')" size="small" v-model="F_Width"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="F_Top" :label="$t('forme.addModal.formTopHight')" label-width="130px">
                        <el-input :placeholder="$t('forme.addModal.placeholderDefaultHight')" size="small" v-model="F_Top"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row> -->
				  <el-row>
            <el-row>
            <el-col :span="24"> 
              <el-form-item prop="F_CategoryId" :label="$t('interfaceSort')">
								<avue-input-tree default-expand-all :disabled="isEdit"
										 v-model="menuForm.F_CategoryId"
										  :props="defaultParentIdProps"
										 :placeholder="$t('selectInterfaceSort')" type="tree"
										 :dic="dataItemTree" size="small"
										 style="width: calc(100% - 45px);margin-right: 10px;"></avue-input-tree>
							    <el-button @click="addCateVisible=true" icon="el-icon-plus" size="small" type="primary"></el-button>
							  </el-form-item>
             </el-col>
           </el-row>
					  <el-col :span="12">
					    <el-form-item :label="$t('publishMobile')">
					      <el-switch v-model="menuForm.appCode"></el-switch>
					    </el-form-item>
					  </el-col>
					  <el-col :span="12" v-if="menuForm.appCode">
					    <el-form-item prop="F_AppCatalog" :label="$t('mobileOwnClassify')">
					  	<el-select :placeholder="$t('selectMobileOwnClassify')" v-model="menuForm.F_AppCatalog" style="width: 100%;">
					  		<el-option
					  		v-for="item in diogbaseData"
					  		:key="item.F_ItemDetailId"
					  		:label="item.F_ItemName"
					  		:value="item.F_ItemValue">
					  		</el-option>
					  	</el-select>
					    </el-form-item>
					  </el-col>	
					</el-row>
					<el-row v-if="menuForm.appCode">
					  <el-col :span="12">
					  	<el-form-item prop="F_AppIcon" :label="$t('mobileFunctionIcon')">
					  		<el-input :placeholder="$t('selectMobileFunctionIcon')" size="small" @focus="openDialog('FontHtml',2)" v-model="menuForm.F_AppIcon">
					  			<i slot="suffix" class="el-icon-more" @click="openDialog('FontHtml',2)"></i>
					  		</el-input>
					  	</el-form-item>
					  </el-col>
					  <el-col :span="12">
					  	<el-form-item prop="F_AppSortCode" :label="$t('mobileFunctionOrder')">
					  		<el-input type="number" :placeholder="$t('selectMobileFunctionOrder')" size="small"
					  				  v-model="menuForm.F_AppSortCode"></el-input>
					  	</el-form-item>
					  </el-col>
				  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('forme.addModal.functionDescription')">
                        <el-input
                            type="textarea"
                            :placeholder="$t('forme.addModal.placeholderFunctionDescription')"
                            size="small"
                            v-model="menuForm.F_Description"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <CodeStepThree
                  v-if="active === 1"
                  ref="stepTwo"
                  :curStep="active"
                  :baseData="baseData"
                  @onChange="onChildValue"
                  :isNextStep="isNextStep"
                  style="height: 400px"
				          class="query_configuration"
              ></CodeStepThree>
              <div class="list_configuration" style="height:400px" v-if="active === 2">
                 <el-scrollbar class="btnbox" style="height: 33px;">
                  <el-button v-for="(item,index) in btns" :type="item.checked?'primary':''" :key="index" :icon="item.icon" size="small" @click="checkButton(index)"
                            >{{$t(item.name) }}
                  </el-button> 
                </el-scrollbar>
                <div class="sort-box">
                <div class="sort-default">
                  <span>{{$t('defaultSort')}}：</span> <el-switch v-model="sort.useDefaultSort" @change="changeSortOptions"/>
                </div>
                <div class="sort-field-box">
                  <span  v-if="!sort.useDefaultSort">{{$t('sortOrder')}}：</span> 
                    <el-select  v-if="!sort.useDefaultSort"
                      v-model="sort.order" :placeholder="$t('sortOrder')">
                       <el-option
                          :label="$t('positiveSequence')"
                          value="asc"
                      />
                      <el-option
                          :label="$t('reverseOrder')"
                          value="desc"
                      />
                    </el-select>
                  <span style="padding-left: 8px;" v-if="!sort.useDefaultSort">{{$t('sortField')}}：</span> <el-select  v-if="!sort.useDefaultSort"
                    v-model="sort.sortField" :placeholder="$t('sortField')">
                    <el-option
                        v-for="(item, index) in listTableData"
                        :key="index"
                        :label="item.label?item.label:item.fieldName"
                        :value="item.bindColumn"
                    />
                  </el-select>
                </div>
              </div>
                <avue-crud
                    ref="multipleTable"
                    :data="listTableData"
                    :option="listOption"
                    stripe
                    style="width: 100%; height: calc(100% - 124px)"
					@sortable-change="sortableChange"
                >
                  <template slot="add" slot-scope="scope">
                    <i
                        class="el-icon-remove"
                        style="color: #f56c6c; font-size: 20px; display: block"
                        @click="deleteData(scope)"
                    ></i>
                  </template>
                  <template slot="fieldName" slot-scope="scope">
                    <el-select v-model="scope.row.fieldName" :placeholder="$t('forme.addModal.placeholderSelect')" @change="selectField(scope)">
                      <el-option
                          v-for="item in formConfFields"
                          :key="item.__config__.renderKey"
                          :label="item.__config__.label"
                          :value="item.__config__.formId"
                      ></el-option>
                    </el-select>
                  </template>
                  <template slot="align" slot-scope="scope">
                    <el-select v-model="scope.row.align" :placeholder="$t('forme.addModal.placeholderSelect')">
                      <el-option
                          v-for="item in alignOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                      ></el-option>
                    </el-select>
                  </template>
                  <template slot="width" slot-scope="scope">
                    <el-input v-model="scope.row.width" :placeholder="$t('forme.addModal.placeholderColumnWidth')" type="number"></el-input>
                  </template>
                </avue-crud>
                  <div class="footBox">
                  <div
                      style="
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      border: 1px solid #ddd;
                      padding-right: 20px;
                      height: 48px;
                    "
                  >
                    <el-form ref="form" :model="form" :inline="true">
                      <el-form-item label style="margin-top: 0px;">
                        <div style="display: flex">
                          <span>{{$t('code.codeStepFour.displayPerPage')}}</span>
                          <el-input v-model.number="form.pageSize" type="number"
                                    style="width: 100px; margin: 0 10px"></el-input>
                          <span>{{$t('code.codeStepFour.rowData')}}</span>
                        </div>
                      </el-form-item>
                      <el-form-item label style="margin-top: 0px;">
                        <el-radio-group v-model="form.isPage">
                          <el-radio label="1">{{$t('code.codeStepFour.page')}}</el-radio>
                          <el-radio label="0">{{$t('code.codeStepFour.noPage')}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                  </div>
				 
                </div>
              </div>
              <span slot="footer" class="dialog-footer" style="display: block; padding-top: 10px;">
                <el-button size="mini" type="primary" @click="prev()" v-show="active !== 0">{{$t('code.codeForm.previousBtn')}}</el-button>
                <el-button size="mini" type="primary" @click="next()" v-show="active !== 2">{{$t('code.codeForm.nextStepBtn')}}</el-button>
                <el-button size="mini" type="primary" @click="submitBtn()" v-show="active === 2">{{$t('code.codeForm.completeBtn')}}</el-button>
              </span>
              </template>
            </el-dialog>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="add" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="opr-primary" size="mini" @click="editFormRelation(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="opr-danger" size="mini" @click="deleteFormRelation(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>
     <el-dialog v-dialogDrag
        :title="dialog.title"
        :append-to-body="true"
        :visible.sync="dialog.visible"
        :close-on-click-modal="false"
        width="60%"
    >
    <template v-if="dialog.visible">
       <FontHtml v-if="dialog.type=='FontHtml'" v-on:childByValue="childByValue"></FontHtml>
       <ExportConfiguration v-if="dialog.type=='export'" ref="ExportConfiguration" :exportForm.sync='exportConfigurationValue'></ExportConfiguration>
       <ImportConfiguration v-if="dialog.type=='import'" ref="ImportConfiguration"  :parameValue="importConfigurationValue"></ImportConfiguration>
    </template>
     <span v-if="dialog.visible&&dialog.hasFooter" slot="footer" class="dialog-footer">
			<el-button size="mini" type="primary" @click="closeDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
		    <el-button size="mini" type="primary"
                   @click="confirmDialog()">{{$t('buttonModule.modalSureBtn')}}</el-button>
		</span>
    </el-dialog>
     <AddInterfaceCategory v-if="addCateVisible" :visible.sync="addCateVisible" :dialogTitle="$t('addInterfaceSort')" @submitRes="getDataItemTree"></AddInterfaceCategory>

  </div>
</template>

<script>
import MainContent from '@/page/main/MainContent';
import SelectionSystem from '@/components/common/SelectionSystem';
import {
  getFormRelationByPage,
  addFormRelation,
  updateFormRelation,
  deleteFormRelation,
  getFormSchemeInfo
} from '@/api/code/form';
import FontHtml from '@/views/FontAwesome.vue';
import ImportConfiguration from '@/components/quickDevelopment/ImportConfiguration';
import ExportConfiguration from '@/components/quickDevelopment/ExportConfiguration';
import CodeStepThree from '../Code/CodeStepThree.vue';
import { FormatMenuTree,FormatTree,LanguageFormatTree } from '@/util/util.js';
import { getMenuTree, getMenuTreeBySystem } from '@/api/systemManagement/menu';
import { getFormSchemeTree } from '@/api/dataauthorize/dataauthorize';
import { guid } from '@/config/fn';
import store from '@/store';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { mapGetters } from "vuex";
import {getLgMarkList} from '@/api/language/translation';
import { validateWidth} from '@/api/organization/validateFunc';
import { getDataItemDetail } from '@/api/databasemanage/datasource';

import {
  getInterfaceTypeTree,
} from "@/api/systemManagement/interface";
import AddInterfaceCategory from "@/views/SystemManagement/components/AddInterfaceCategory.vue";
export default {
  name: 'Form',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent, SelectionSystem,FontHtml,ImportConfiguration,ExportConfiguration, CodeStepThree,AddInterfaceCategory },
  inject: ['reload'],
  data () {
    return {
      isEdit:false,
      isNextStep:true,
      importConfigurationValue:{},
      exportConfigurationValue:{f_column:""},
      impData:{},
      dialog:{
        visible:false,
        hasFooter:false,
        title:"",
        type:""
      },
      selectedId: [],
      dialogTitle: '',
      active: 0,
      keyword: '',
      formSchmeTree: [],
	  transDefaultTree:[],
      baseData: {
        step1: {
          F_DbId: '',
          list: []
        },
        step2: []
      },
      F_FormId: '',
      menuForm: {
        F_EnCode: '',
        F_FormId: '',
        F_ModuleId: '',
        F_ParentId: '',
        F_Icon: '',
        F_SortCode: '',
        F_FullName: '',
        F_Description: '',
        F_UrlAddress: '',
        F_Target: '',
        F_IsMenu: 0,
        F_AllowExpand: 0,
        F_IsPublic: 0,
        F_AllowEdit: 0,
        F_AllowDelete: 0,
        F_SubSystemId: '0',
        F_LgMarkCode:'',
        appCode:false,
        F_AppCatalog:'',
        F_AppIcon:'',
        F_AppSortCode:'',
        F_CategoryId:''
      },
      defaultParentIdProps:{
       label:'F_Name',
				value:'F_Id'
      },
      dataItemTree:[],
      addCateVisible:false,
      formRelationList: [],
      listTableData: [],
      listOption: {
		highlightCurrentRow: true,
		stripe: true,
		calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
		height: '100%',//表格高度
		maxHeight: 'auto',
		border: true,
		align: 'center',
		menu: false,
		page: false,
		sortable: true,
		dragHandler: true,
		header: false,
        column: [
          {
            label: '',
            prop: 'add',
            renderHeader: h => {
              return h('i', {
                style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                class: 'el-icon-circle-plus',
                on: {
                  click: this.addRow
                }
              });
            },
            width: '50px',
            slot: true
          },
          {
            label:this.$t('forme.addModal.tableHeaderColumnName'),
            prop: 'fieldName',
            slot: true
          },
          {
            label:this.$t('forme.addModal.tableHeaderAlignment'),
            prop: 'align',
            slot: true
          },
          {
            label:this.$t('forme.addModal.tableHeaderWidth'),
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
        { value: 'left', label:this.$t('code.codeStepFour.alignLeft')},
        { value: 'center', label:this.$t('code.codeStepFour.Centered') },
        { value: 'right', label:this.$t('code.codeStepFour.alignRight')}
      ],
      fieldList: [],
      formId: '',
      order: {
        order: 'desc',
        prop: ''
      },
      dialogVisible: false,
      fieldOption: {
        highlightCurrentRow: true,
        stripe: false,
        //addBtn: false,
        maxHeight: 350,
        border: true,
        index: true,
        indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        menuWidth: 150,
        refreshBtn: false,
        columnBtn: false,
        column: [
          {
            label: '字段名称',
            prop: 'fieldName',
            rules: [
              {
                required: true,
                message: '请输入字段名称',
                trigger: 'blur'
              }
            ],
            span: 24
          },
          {
            label: '字段注释',
            prop: 'fieldDescribe',
            rules: [
              {
                required: true,
                message: '请输入字段注释',
                trigger: 'blur'
              }
            ],
            span: 24
          },
          {
            label: '字段类型',
            prop: 'fieldType',
            type: 'select',
            rules: [
              {
                required: true,
                message: '请选择字段类型',
                trigger: 'change'
              }
            ],
            span: 24,
            dicData: []
          }
        ]
      },
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        simplePage: true,
        index: true,
        indexLabel:this.$t('forme.tableHeaderNumber'),
        align: 'center',
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label:this.$t('forme.tableHeaderFormName'),
            prop: 'F_Name',
			minWidth:'95',
			align: 'left'
          },
          {
            sortable: true,
            label:this.$t('forme.tableHeaderFunctionName'),
            prop: 'F_FullName',
			minWidth:'95',
			align: 'left'
          },
          {
            sortable: true,
            label: this.$t('forme.tableHeaderEditor'),
            prop: 'F_CreateUserName',
			width:"100",
			align: 'left'
          },
          {
            sortable: true,
            label: this.$t('forme.tableHeaderEditTime'),
            prop: 'F_CreateDate',
			width:"140",
			align: 'left'
          }
        ]
      },
      rules: {
        F_SubSystemId: [{ required: true, message:this.$t('forme.addModal.placeholderOwningSystem'), trigger: 'blur' }],
        F_EnCode: [{ required: true, message: this.$t('forme.addModal.placeholderFunctionNumber'), trigger: 'blur' }],
        F_FullName: [{ required: true, message:this.$t('forme.addModal.placeholderFunctioName'), trigger: 'blur' }],
        F_FormId: [{ required: true, message:this.$t('forme.addModal.placeholderSelectForm'), trigger: 'change' }],
        F_SortCode: [{ required: true, message:this.$t('forme.addModal.placeholderFunctionOrder'), trigger: 'blur' }],
		F_AppCatalog:[{ required: true, message:this.$t('请选择移动端所属分类'), trigger: 'change' }],
		F_AppIcon:[{ required: true, message:this.$t('请选择移动端功能图标'), trigger: 'change' }],
		F_AppSortCode:[{ required: true, message:this.$t('请填写移动端功能排序'), trigger: 'blur' }],
    F_CategoryId: [
          { required: true, message:this.$t('请选择接口分类'), trigger: 'change' },
      ],
      },
      defaultTree:[],
      defaultbtns: [
		  //name为翻译标记
        { name:'forme.editModal.quickImportBtn', val: 'import', icon: 'fa fa-sign-in', checked: false },
        { name:'forme.editModal.quickExportBtn', val: 'export', icon: 'fa fa-sign-out', checked: false },
        // { name: '发起流程', val: 'createFlow', icon: 'fa', checked: false },
         { name:'forme.editModal.createFormFlowBtn', val: 'createDesignFlow', icon: 'fa', checked: false },
        { name:'forme.editModal.initiateApproval', val: 'createFormFlow', icon: 'fa', checked: false },
        { name:'forme.editModal.viewBtn', val: 'view', icon: 'fa-eye', checked: true },
        { name:'forme.editModal.addBtn', val: 'add', icon: 'el-icon-plus', checked: true },
        { name:'forme.editModal.editBtn', val: 'modify', icon: 'el-icon-edit', checked: true },
        { name:'forme.editModal.deleteBtn', val: 'delete', icon: 'el-icon-delete', checked: true },
        { name:'forme.editModal.batchDeletionBtn', val: 'batchDelete', icon: 'el-icon-delete', checked: true },
      ],
       btns: [],
      formConfFields: [],
      sort:{
        useDefaultSort:true,
        sortField:'',
        order:"desc"
      },
      doNotGenerateTags:["xjr-opinion-comonent","h2", "el-divider", "table","avue-custom-button", "tinymce",'el-upload','el-image'],
	  iconType:'',
	  diogbaseData:[]
    };
  },
  async created () {
    await this.getDataItemTree();
    this.getFormRelationByPage();
	getDataItemDetail('function').then(res=>{
		if (res.data.success) {
		  if (res.data.data.length > 0) {
		    this.diogbaseData = res.data.data;
		  }
		}
	});
  },
  computed: {
    ...mapGetters(["allSystem", "systemId"]),
  },
  mounted () {
    this.getFormSchemeTree();
  },
  methods: {
    /* 获取分类树 */
    async getDataItemTree() {
      const res = await getInterfaceTypeTree();
      this.dataItemTree = res.data.data;
    },
    handleRowDBLClick (row, event) {
		 if(this.openDoubleClickEdit){
		   this.editFormRelation(row)
		 }
	  },
	/* 获取翻译标记 */
			/* 获取翻译标记 */
		  remoteMethod(query) {
				const searchObj = {
					keyword:query
				}
				getLgMarkList(searchObj).then(res => {
				
					this.transDefaultTree = res.data.data;
				
				});
			},
    toggleSystem(systemId,parentId){
      systemId = systemId || '0';
      this.menuForm.F_SubSystemId = systemId;
      if(parentId!=undefined){
        this.menuForm.F_ParentId = parentId;
        this.$set(this.menuForm,'F_ParentId',parentId);
      }
      getMenuTreeBySystem(systemId)
      .then(res=>{
        const { code, data } = res.data;
        code ||
        (this.defaultTree = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children'));
        this.menuForm.F_SubSystemId = systemId;
        this.$nextTick(()=>{
          if(parentId!=undefined){
            this.menuForm.F_ParentId = parentId;
            this.$set(this.menuForm,'F_ParentId',parentId);
          }
        });
      })
    },
    getFormConfFields(arr){
      let _arr = [];
      arr.map(el=>{
        if(el.__config__.componentName == 'avue-tabs'){
          let childrenObj = el?.__config__?.childrenObj;
          for(let key in childrenObj){
            _arr.push(...this.getFormConfFields(childrenObj[key]));
          }
        }else{
          _arr.push(el);
        }
      });
      return (()=>{ return _arr })()
    },
    /* 新加一行 */
    addRow () {
      let obj = {
        fieldName: '',
        align: 'center',
        width: '',
        FKid: '',
        bindTable: '',
        bindColumn: '',
        colType: '',
		componentsParams:{}
      };
      this.listTableData.push(obj);
    },
    selectField (val) {
      let objT = val.row;
      let temp = this.formConfFields.find(item => item.__config__.formId === objT.fieldName);
			if(temp){
				objT.componentsParams=temp;
				objT.bindTable=temp.__config__.bindTable;
				objT.bindColumn=temp.__config__.bindTableField;
			}
      this.listTableData.splice(objT.$index, 1, objT);
    },
    deleteData (scope) {
      this.listTableData.splice(scope.row.$index, 1);
    },
    childByValue (childValue) {
      // childValue就是子组件传过来的值
	  if(this.iconType==1){
		  this.menuForm.F_Icon = childValue;
	  }else if(this.iconType==2){
			this.$set(this.menuForm,'F_AppIcon',childValue)
	  }
      
      this.closeDialog();
    },
    /* 从子级获取数据第 this.active + 1 步的 */
    onChildValue (val) {
      this.queryData = val;
    },
    /* 获取菜单树形数据 */
    getMenuTree () {
      getMenuTree().then(res => {
        const { code, data } = res.data;
        code ||
        (this.defaultTree = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children'));
      });
    },
    /* 获取菜单树形数据 */
    getFormSchemeTree () {
      getFormSchemeTree().then(res => {
        const { data, code } = res.data;
        code || (this.formSchame = data,
            this.formSchmeTree = FormatTree(data, 'F_Id', 'F_Name', 'children'));
      });
    },
    /* 获取列表 */
    async getFormRelationByPage () {
      const { page, order, keyword } = this;
      let searchParam = {
        // FormId:this.formId,
        limit: page.currentPage,
        size: page.pageSize,
        keyword: keyword,
        order: order.order,
        orderField: order.prop
      };
      const { data: { data, code } } = await getFormRelationByPage(searchParam);
      code || (this.formRelationList = data.Rows, this.page.total = data.Total);
    },
    prev () {
      --this.active < 0 && (this.active = 0);
    },
    async next () {
      if (this.active === 0) {
        let validVal = false;
        await this.$refs['menuForm'].validate(valid => {
         validVal = valid
        });       
         if(validVal){
            let res = await getFormSchemeInfo(this.menuForm.F_FormId);
            const { data, code } = res.data;
            if (code) return;
            let datum = JSON.parse(data.Scheme.F_Scheme);
            store.state.FD.controllerType = data.Scheme.F_Type || 0
            this.baseData.step1.F_DbId = datum.dbLinkId;
            this.baseData.step1.list = datum.dbTable;
            let fieldList = [];
            this.listTableData.length <= 0 && datum.data.fields.map(item => {
              if (item.__config__.componentName !== 'table') {
                if(item?.__config__?.componentName == 'avue-tabs'){
                  //收集avue-tabs 里的元素
                  let childrenObj = item?.__config__?.childrenObj || {};
                  let _arr = this.getElementsByTabs(childrenObj); 
                  this.listTableData.push(..._arr);
                }else{
                  if(item.__config__.tag&&
                  !this.doNotGenerateTags.includes(item.__config__.tag)&&
                  !(item.__config__.tag==='el-input'&&item['show-password'])
                  ){
                    this.listTableData.push({
                    fieldName: item.__config__.label?item.__config__.label:item.__config__.formId,
                    FKid: '',
                    lgmark:item.__config__.F_LgMarkCode,
                    colType: '',
                    bindTable: item.__config__.bindTable,
                    bindColumn: item.__config__.bindTableField,
                    label:item.__config__.label,
                    componentsParams:item,
                    align:'center'
                  });
                    }
                
                }
              }
            });

            if(datum.data.fields.length>0){
              fieldList = datum.data.fields.filter((element)=>{

                  return (
                    !this.doNotGenerateTags.includes(element.__config__.tag)&&
                    !(element.__config__.tag==='el-input'&&element['show-password'])
                    && !(element.__config__.tag == "el-time-picker"&&element.__config__.avueType == "timerange")
                    && !(element.__config__.tag == "el-date-picker"&&element.__config__.avueType == "daterange")
                    )  
              });
            } 
            this.baseData.step2 = fieldList || [];
            //如果元素里存在avue-tabs 需递归收集所有元素
            this.formConfFields = this.getFormConfFields(this.baseData.step2);

            this.active++;
          }
      } else if (this.active === 1) {
        this.$refs['stepTwo'].validateData();
        
        this.active++;
      } else {
        this.active++ > 2 && (this.active = 0);
      }
    },
    changeFormScheme(){
       this.listTableData = [];//第一步到第二步要重新生成对应查询配置文件
    },
    getElementsByTabs(childrenObj){
      let _arr = [];
      for(let key in childrenObj){
        let children = childrenObj[key];
        children.map(item=>{
          if(item.__config__.componentName == 'table'){
            return;
          }else{
             if(item.__config__.tag&&
             !this.doNotGenerateTags.includes(item.__config__.tag)&&
            !(item.__config__.tag==='el-input'&&item['show-password'])
             ){
                _arr.push({
                fieldName: item.__config__.formId,
                FKid: '',
                bindTable: item.__config__.bindTable,
                bindColumn: item.__config__.bindTableField,
                label:item.__config__.label,
                colType: '',
				componentsParams:item
            });
               }
           
          }
        });
      }
      return (()=>{ return _arr; })()
    },
    /* 新增弹窗打开 */
    add () {
      this.isEdit = false;
      this.dialogVisible = true;
      this.dialogTitle =this.$t('forme.addModal.addTitle');
      store.state.FD.controllerType = 0; // 表单发布清空，防止之前代码模板未重置。
      this.F_Id = '';
      this.fieldList = [];
      this.active = 0;
      this.menuForm = {};
      this.btns = [...this.defaultbtns];
      // this.$nextTick(() => { // 单独清除 F_FormId 校验
      //   let _field = this.$refs['menuForm'].fields;
      //   _field.map(i => {
      //     if (i.prop === 'F_FormId') {
      //       i.resetField();
      //       this.menuForm.F_FormId = '';
      //       return false;
      //     }
      //   });
      // });
      // let systemId = this.allSystem[0]?.F_Id || '0';
      // this.toggleSystem(systemId,'');
    },
    getItemByTabs(val,v){
      let item = null;
      if(val?.__config__?.componentName != 'table' && val.__config__.formId === v.fieldName){
          item = val;
      }
      return item;
    },
    /* 完成 */
    submitBtn () {
      // if (store.state.FD.controllerType === 2) {
      // .net 需要的字段 <<<
      this.menuForm.F_UrlAddress = '/autoTemplates/list' + guid();
      this.menuForm.F_Component = 'views/autoTemplates/list';
      this.menuForm.F_Target = 'iframe';
      // >>> END
      // }

      // if (store.state.FD.controllerType === 1) {
      // java 需要的字段 <<<
      this.menuForm.component = 'views/autoTemplates/list';
      // >>> NED
      // }
      const { queryData, listTableData, form,  menuForm, F_Id } = this;
      let impData = {};
      let ExpData = {};
      if(this.btns[0].checked){
        impData = this.impData;
      }
      if(this.btns[1].checked){
        ExpData = this.exportConfigurationValue;
      }
      if(this.listTableData.length==0){
        this.$message('请至少保留一个列');
        return false;
      }
      let json = {
        queryData: queryData,
        colData: {
          fields: this.listTableData,
          form: form,
          impData,
          ExpData,
          btns:this.btns,
          sort:this.sort
        }
      };
      let baseInfoForm = {
        formRelation: {
          f_FormId: menuForm.F_FormId,
          f_ModuleId: menuForm.F_ModuleId,
          f_SettingJson: JSON.stringify(json)
        },
        module: menuForm
      };


      F_Id
          ? updateFormRelation(F_Id, baseInfoForm).then(() => {
            this.dialogVisible = false;
            this.getFormRelationByPage();
            this.F_Id = '';
          })
          : addFormRelation(baseInfoForm).then(() => {
            this.dialogVisible = false;
            this.getFormRelationByPage();
          });

      this.active = 0;
      this.F_Id = '';
      this.reload()

      this.$confirm(this.$t('forme.refreshPagePrompt'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: 'warning'
      }).then( () => {
        this.$router.go(0)
      })
    },
    /* 编辑 */
    editFormRelation ({ F_Module, F_FormId ,F_SettingJson}) {
      this.isEdit = true;
      this.listTableData = [];
      this.dialogVisible = true;
      this.dialogTitle =this.$t('forme.editModal.title');
      this.menuForm = {
        F_EnCode: F_Module.F_EnCode,
        F_FormId: F_FormId,
        F_SubSystemId:F_Module.F_SubSystemId,
        F_ModuleId: F_Module.F_ModuleId,
        F_ParentId: F_Module.F_ParentId,
        F_Icon: F_Module.F_Icon,
        F_SortCode: F_Module.F_SortCode,
        F_FullName: F_Module.F_FullName,
        F_Description: F_Module.F_Description,
        F_Description: F_Module.F_Description,
        F_SubSystemId: F_Module.F_SubSystemId,
		    F_LgMarkCode:F_Module.F_LgMarkCode,
        F_CategoryId:F_Module.F_CategoryId||''
      };
	  if(F_Module.appCode){
		  this.menuForm={
			  ...this.menuForm,
			  appCode:F_Module.appCode,
			  F_AppCatalog:F_Module.F_AppCatalog,
			  F_AppIcon:F_Module.F_AppIcon,
			  F_AppSortCode:F_Module.F_AppSortCode
		  }
		  if(F_Module.F_AppFunctionId) this.menuForm.F_AppFunctionId=F_Module.F_AppFunctionId
	  }
	  if(F_Module.F_LgMarkCode){
	  	this.transDefaultTree=[{
	  	  F_Id:F_Module.F_LgMarkCode,
	  	  F_EnCode:F_Module.F_LgMarkCode,
	  	  F_Name:F_Module.F_LgMarkName
	  	}];
	  }
      // 回显按钮
      let json = JSON.parse(F_SettingJson);
      if(json.colData.btns){
        this.btns = json.colData.btns;
      }
      if(json.colData.fields){
        this.listTableData = json.colData.fields
      }
       if(json.colData.sort){
        this.sort = json.colData.sort
      }
      if(json.colData.impData){
        this.impData = json.colData.impData
      }
      this.active = 0;
      this.toggleSystem(F_Module.F_SubSystemId,F_Module.F_ParentId);
    },

    rowClick ({ F_Id }) {
      this.F_Id = F_Id;
    },
    /* 删除 */
    deleteFormRelation ({ F_Id }) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: 'warning'
      }).then(() => {
        deleteFormRelation(F_Id).then(({ data: { code } }) => {
              !code && this.getFormRelationByPage();
              this.$notify({
                title: this.$t('deletePrompt.successTitle'),
                message:this.$t('deletePrompt.successDeleted'),
                type: 'success'
              });
            }
        );
      }).catch(() => {
      });
    },
    /* 选中的数据 */
    selectionChange (list) {
      this.selectedId = [];
      list.forEach(o => this.selectedId.push(o.F_Id));
    },
    /* 关闭弹窗 */
    handleClose () {
      this.$refs['baseInfoForm'] !== undefined && this.$refs['baseInfoForm'].resetField();
      this.dialogVisible = false;
      this.F_Id = '';
    },
    cancelBtn () {
      this.dialogVisible = false;
    },
    /* 查询 */
    search () {
      this.getFormRelationByPage();
    },
    /* 查询表单重置 */
    searchReset () {
      this.keyword = '';
      this.getFormRelationByPage();
    },

    onPageLoad (page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.getFormRelationByPage();
    },
    deleteActInfo (i) {
      let tempArr = [...this.conditionalForm.frequencyList];
      tempArr.splice(i, 1);
      this.conditionalForm.frequencyList = tempArr;
    },
    sizeChange (page) {
      this.page.pageSize = page;
      this.getFormRelationByPage();
    },
    sortChange (val) {
      this.order.order = val.order === 'ascending' ? 'asc' : 'desc';
      this.order.prop = val.prop;
      this.getFormRelationByPage();
    },
    rowDel (form, index) {
      this.fieldList.splice(index, 1);
      this.baseInfoForm.F_FieldsJson = JSON.stringify(this.fieldList);
    },
    handleSave (form, done) {
      this.fieldList.push(form);
      this.baseInfoForm.F_FieldsJson = JSON.stringify(this.fieldList);
      done();
    },
    handleUpdate (form, index, done) {
      this.fieldList.splice(index, 1, form);
      this.baseInfoForm.F_FieldsJson = JSON.stringify(this.fieldList);
      done();
    },
    checkButton (index) {
      this.btns[index].checked = !this.btns[index].checked;
      if(this.btns[index].checked){
           if (this.btns[index].val == 'export') {
            } else if (this.btns[index].val == 'import') {
              let btn = [...this.btns];
              btn = btn.filter((item, i) => {
                return item.val != 'export';
              });
               let listData = [];
               let conf = this.baseData.step2;
               if(conf.length>0){
                 conf.forEach(element => {
                    if(element.__config__.componentName == "avue-tabs"){
                       let childrenObj = element?.__config__?.childrenObj || {};
                      if(!childrenObj) return;
                      for(let key in childrenObj){
                        let children = childrenObj[key];
                        for(let i = 0;i<children.length;i++){
                          if(children[i]?.__config__?.componentName != 'table'){
                             //子表单去除
                            let config = children[i].__config__;
                            let temp = {
                            bindColumn:config.bindTableField,
                            fieldName:config.label,
                            bindTable:config.bindTable,
                            colType:config.bindTableFieldType,
                            };
                            listData.push(temp);
                          }
                        }
                      }
                    }else if(element.__config__.componentName == "table"){
                        //子表单去除
                    }else{
                      let config = element.__config__;
                      let temp = {
                        bindColumn:config.bindTableField,
                        fieldName:config.label,
                        colType:config.bindTableFieldType,
                        bindTable:config.bindTable
                      };
                      listData.push(temp);
                      }
                 });
               }
              this.importConfigurationValue = {
                database: this.baseData.step1,
                conf: conf,
                fields: listData,
                btns: btn
              };
              this.openDialog('import');
            } 
      }
    },
        openDialog(type,iconType){
          this.dialog.type=type;
          if(type=='FontHtml'){
			this.iconType=iconType;
            this.dialog.title=this.$t('forme.addModal.openDialogTitle.selectIcon');
            this.dialog.hasFooter = false;
            this.dialog.visible = true;
          }
          else if(type=='import'){
            this.dialog.title=this.$t('forme.addModal.openDialogTitle.importConfiguration');
            this.dialog.hasFooter = true;
            this.dialog.visible = true;
          }
          else if(type=='export'){
            this.dialog.title=this.$t('forme.addModal.openDialogTitle.exportConfiguration');
            this.dialog.hasFooter = true;
            this.dialog.visible = true;
          }
      
    },
    closeDialog(){
        this.dialog.visible = false;
        this.dialog.hasFooter = false;
        this.dialog.title = '';
        this.dialog.type = '';
    },
    confirmDialog(){
      let type = this.dialog.type;
      if(type=='import'){
        var obj = this.$refs.ImportConfiguration.getChildData();
        this.impData = obj;
        this.closeDialog();
      }
      else if(type=='export'){
        let valid =  this.$refs.ExportConfiguration.submit;
       if (valid) {
           this.closeDialog();
        }
      }
    },
	sortableChange (oldindex, newindex, row, list) {
	  this.listTableData = [];
	  this.$nextTick(() => {
	    this.listTableData = list;
	  });
	},
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

.footBox .el-form-item {
  margin-bottom: 0;
}

.btnbox {
  display: flex;
  justify-content: flex-end;
  border: 1px solid #E9E9E9;
  padding: 10px;
  border-radius: 5px;
}
::v-deep .list_configuration .el-scrollbar__view{
	white-space: nowrap;
}
::v-deep .list_configuration .el-scrollbar__wrap{
	overflow: hidden;
}
::v-deep .footBox .el-radio__label{
	font-size: 12px;
	padding-left: 5px;
}
@media screen and (max-width: 1370px) {
   div/deep/ .el-dialog{
	margin-top: 10vh!important;
   }
   .list_configuration,.query_configuration{
	   height: 300px!important;
   }
}
div /deep/ .el-tag{
	margin: 0px 0px 5px 5px;
}
.sort-box{
  height: 40px;
  width: 100%;
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
</style>
