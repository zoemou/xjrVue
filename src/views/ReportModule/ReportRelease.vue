<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">

    <main-content :title="contentTitle" :paddingLeft="0" padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                    style="width: 200px; margin-right:5px"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud ref="cuTable" :data="tableData" :option="option" stripe :page.sync="page" :showColumn="showColumn"
          :isSaveColumns="true" @on-load="onPageLoad"
              @row-dblclick="handleRowDBLClick"       @sort-change="sortChange">
          <template slot="menuLeft">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openForm('dataForm')" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">
        <el-form :rules="rules" ref="dataForm" :model="dataForm" label-width="100px" :validate-on-rule-change="false" v-if="dialogVisible">
          <el-row>
            <el-col :span="12" v-show="formEnCodeList['F_EnCode']">
              <el-form-item prop="F_EnCode" :label="$t('reportModule.reportRelease.labelMenuNum')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderMenuNum')" size="small" v-model="dataForm.F_EnCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="formEnCodeList['F_FullName']">
              <el-form-item prop="F_FullName" :label="$t('reportModule.reportRelease.labelMenuName')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderMenuName')" size="small" v-model="dataForm.F_FullName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
			  <el-col :span="12" v-show="formEnCodeList['F_LgMarkCode']">
			  	<el-form-item prop="F_LgMarkCode" :label="$t('reportModule.reportRelease.labelTransTag')">
			  		<!-- <avue-input-tree default-expand-all
                        disabled
			  								v-model="dataForm.F_LgMarkCode"
			  								:placeholder="$t('reportModule.reportRelease.placeholderTransTag')" type="tree"
			  								:dic="transDefaultTree" size="small"
			  								style="width: 100%"></avue-input-tree> -->

                          <el-select
										v-model="dataForm.F_LgMarkCode"                            
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
            <el-col :span="12" v-show="formEnCodeList['F_SubSystemId']">
              <!-- <el-form-item prop="F_SubSystemId" label="所属系统">
                <el-select v-model="dataForm.F_SubSystemId" placeholder="请选择所属系统"
                     size="small" style="width: 100%" @change="toggleSystem">
                <el-option :label="item.F_Name" :value="item.F_Id" v-for="item in allSystem" :key="item.F_Id"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item prop="F_SubSystemId" :label="$t('reportModule.reportRelease.labelSystemId')">
                 <SelectionSystem  v-model="dataForm.F_SubSystemId" :isEdit="isEdit" :formItemLabelWidth="90" @changeSystem="changeSystem"></SelectionSystem>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row>
			  <el-col :span="12" v-show="formEnCodeList['F_ParentId']">
			    <el-form-item prop="F_ParentId" :label="$t('reportModule.reportRelease.labelSuperMenu')">
			      <!-- <avue-input-tree default-expand-all v-model="dataForm.F_ParentId" placeholder="请选择上级" type="tree"
			                       :dic="parentTree" size="small" style="width: 100%"></avue-input-tree> -->
			  		<!-- <block v-if="allSystem.length">
			  			<div v-for="(item,idx) in allSystem" :key="idx">
			  			  <avue-input-tree default-expand-all
			  			  v-model="dataForm.F_ParentId"
			  			  placeholder="请选择上级" type="tree"
			  			  :dic="parentTree" size="small"
			  			  style="width: 100%"
			  			  v-show="item.F_Id == dataForm.F_SubSystemId"></avue-input-tree>
			  			</div>
			  		</block> -->
			          <avue-input-tree default-expand-all
			            v-model="dataForm.F_ParentId"
			            :placeholder="$t('reportModule.reportRelease.placeholderSelectSuper')" type="tree"
			            :dic="parentTree"
			            style="width: 100%"></avue-input-tree>
			      </el-form-item>
			  </el-col>
            <el-col :span="12" v-show="formEnCodeList['F_RptFileId']">
              <el-form-item prop="F_RptFileId" :label="$t('reportModule.reportRelease.labelRptFileId')">
                <el-select v-model="dataForm.F_RptFileId" :placeholder="$t('reportModule.reportRelease.placeholderRptFileId')" size="small" style="width: 100%">
                  <el-option v-for="item in reportFile" :key="item.id" :label="item.name"
                             :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-show="formEnCodeList['F_SortCode']">
              <el-form-item prop="F_SortCode" :label="$t('reportModule.reportRelease.labelSort')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderSort')" size="small" type="number" v-model="dataForm.F_SortCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="formEnCodeList['F_Icon']">
              <el-form-item prop="F_Icon" :label="$t('reportModule.reportRelease.labelIcon')">
                <el-input :placeholder="$t('reportModule.reportRelease.placeholderIcon')" size="small" v-model="dataForm.F_Icon">
                  <i slot="suffix" class="el-icon-more" @click="selectMoreIcon"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="formEnCodeList['F_Description']">
              <el-form-item :label="$t('reportModule.reportRelease.labelFuncDesc')" prop="F_Description">
                <el-input type="textarea" :placeholder="$t('reportModule.reportRelease.placeholderFuncDesc')" size="small"
                          v-model="dataForm.F_Description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm('dataForm')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button 
                size="mini" 
                type="primary" 
                @click="formSubmit('dataForm')" 
                :loading="flagReportRelease"
                >{{flagReportRelease?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
            </span>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('reportModule.reportRelease.dialogTitle.selectIconTitle')" :append-to-body="true" :visible.sync="IconVisible" width="80%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <FontHtml v-on:childByValue="childByValue"></FontHtml>
    </el-dialog>
  </div>
</template>

<script>
  import { flowableUrl } from '@/config/env';
  import SelectionSystem from '@/components/common/SelectionSystem';
  import MainFixed from '../../page/main/MainFixed';
  import MainContent from '../../page/main/MainContent';
  import { FormatMenuTree, getOrder,LanguageFormatTree,formValidateNotice } from '../../util/util.js';
  import { getMenuTreeBySystem } from '@/api/systemManagement/menu';
  import { getReportFile } from '@/api/report/reportmanage';
  import { getReport, addReport, modifyReport, deleteReport } from '@/api/report/reportrelease';
  import FontHtml from '../FontAwesome.vue';
  import { mapGetters } from "vuex";
  import {deepClone} from '@/utils/index';
  import {getLgMarkList} from '@/api/language/translation';
  import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
  import authorizeMixin from "@/mixins/authorize"; //鉴权混入
  import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
  import {validateLength,validateDesLength,validateSort} from "@/api/organization/validateFunc";
  export default {
    name: 'ReportRelease',
	  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
    components: { MainContent, MainFixed, FontHtml,SelectionSystem },
    computed: {
      ...mapGetters(["allSystem", "systemId"]),
    },
    data () {
      return {
        isEdit:false,
        flagReportRelease: false,
        fixedTitle: this.$t('reportModule.reportRelease.fixedTitle'),
        contentTitle: '报表数据',
        defaultProps: { children: 'children', label: 'F_FullName' },
        dialogVisible: false,
        IconVisible: false,
        dialogTitle: '',
		    transDefaultTree:[],
        searchParam: { limit: 1, size: 20, keyword: null, order: null, orderfield: null },
        page: { pageSize: 20, total: 0, currentPage: 1 },
        option: {
          highlightCurrentRow: true,
          stripe: false,
          addBtn: false,
          menuWidth: 150,
          // maxHeight: 450,
          border: false,
          page: true,
          index: true,
          indexLabel:this.$t('reportModule.reportRelease.tabNum'),
          align: 'left',
          menuAlign: 'center',
          delBtn: false,
          editBtn: false,
          column: [{ sortable: true, label:this.$t('reportModule.reportRelease.labelMenuNum'), prop: 'F_EnCode' },
            { sortable: true, label: this.$t('reportModule.reportRelease.labelMenuName'), prop: 'F_FullName',align:'left' },
            { sortable: true, label:this.$t('reportModule.reportRelease.tabParMenu'), prop: 'F_ParentName' },
            { sortable: true, label: this.$t('reportModule.reportRelease.tabBouReport'), prop: 'F_RptFileId',align:'left' },
            { sortable: true, label:this.$t('reportModule.reportRelease.tabRemark'), prop: 'F_Description',align:'left' }]
        },
        dataForm: {
          F_EnCode: '',
          F_FullName: '',
          F_ParentId: '',
          F_SortCode: '',
          F_Icon: '',
          F_RptFileId: '',
          F_Description: '',
          F_Id: '',
          F_SubSystemId: '0'
        },
        rules: {
          F_SubSystemId: [{ required: true, message: this.$t('reportModule.reportRelease.placeholderSystemId'), trigger: 'change' }],
          F_EnCode: [{ required: true, message:this.$t('reportModule.reportRelease.placeholderMenuNum'), trigger: 'blur' },
            { validator: validateLength,trigger:'change'}
          ],
          F_FullName: [{ required: true, message:this.$t('reportModule.reportRelease.placeholderMenuName'), trigger: 'blur' },
            { validator: validateLength,trigger:'change'}
          ],
          F_RptFileId: [{ required: true, message:this.$t('reportModule.reportRelease.hintRptFileId'), trigger: 'blur' }],
          F_SortCode: [{ validator: validateSort, trigger:'change'}],
          F_Description: [{ validator: validateDesLength,trigger:'change'}]

        },
        reportFile: [],
        tableData: [],
        parentTree: [],
        isInitParentId: false
      };
    },
    created () {
      // this.getDataDictionary()
      this.getReportFile();
      this.getData(this.searchParam);
    },
    methods: {
      handleRowDBLClick (row, event) {
        if(this.openDoubleClickEdit){
          this.editForm(row)
        }
      },
	 	/* 获取翻译标记 */
		  remoteMethod(query) {
				const searchObj = {
					keyword:query
				}
				getLgMarkList(searchObj).then(res => {
				
					this.transDefaultTree = res.data.data;
				
				});
			},
      async changeSystem(val){
        let res = await getMenuTreeBySystem(this.dataForm.F_SubSystemId);
        let {code,data} = res.data;
          if(code==0){
            this.parentTree = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children')
          }
      },
      toggleSystem(val){
		if(val){
			this.dataForm.F_ParentId=''
		}
        getMenuTreeBySystem(this.dataForm.F_SubSystemId)
        .then(res=>{
          let {code,data} = res.data;
          if(code==0){
            this.parentTree = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children')
          }
        })
      },
      /* 报表文件下拉 */
      getReportFile () {
        getReportFile().then(res => {
          this.reportFile = res.data.data;
        });
      },
      /* 获取数据 */
      getData (params) {
        getReport(params).then(res => {
          this.tableData = res.data.data.Rows;
          this.page.total = res.data.data.Total;
        });
      },
      /* 新增 */
      openForm (formName) {
        this.isEdit = false;
        this.flag = true;
        this.dataForm = {};
        this.dialogVisible = true;
        this.dialogTitle = this.$t('reportModule.reportRelease.dialogTitle.addTitle');
        // if (this.$refs[formName] !== undefined) {
        //   this.$refs[formName].resetFields();
        // }
        // this.dataForm.F_SubSystemId = this.allSystem[0]?.F_Id || '0';
        // this.toggleSystem();
      },
      /* 编辑 */
      editForm (row) {
        this.isEdit = true;
        this.flag = false;
        this.dialogVisible = true;
        this.dialogTitle = this.$t('reportModule.reportRelease.dialogTitle.editorTitle');		
        this.dataForm = deepClone(row);
		this.dataForm.F_ParentId=row.F_ParentId||''
		if(row.F_LgMarkCode){
			this.transDefaultTree=[{
			  F_Id:row.F_LgMarkCode,
			  F_EnCode:row.F_LgMarkCode,
			  F_Name:row.F_LgMarkName
			}];
		}
        this.dataForm.F_SubSystemId = row.F_SubSystemId||'0';

        this.toggleSystem();
      },
      /* 删除 */
      deleteForm (row) {
        this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deleteReport(row.F_Id).then(() => {
            this.getData(this.searchParam);
            this.$notify({ title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
        });
      },
      /* 提交表单 */
      formSubmit (formName) {
        this.flagReportRelease = true;
        this.$refs[formName].validate((valid,object) => {
          if (valid) {
            if (this.flag) {
              this.dataForm.F_UrlAddress = flowableUrl + '/ureport/preview?_u=xjrsoft:' + this.dataForm.F_RptFileId;
              addReport(this.dataForm).then((res) => {
                this.dialogVisible = false;
                this.getData(this.searchParam);
								if(res.data.success){
									this.showMessage('add','ok')
								}else{
									this.showMessage('add','no')
								}
              }).finally(() => {
                this.flagReportRelease = false;
              }).catch(()=>{
								this.showMessage('add','no')
							});
            } else {
              this.dataForm.F_UrlAddress = flowableUrl + '/ureport/preview?_u=xjrsoft:' + this.dataForm.F_RptFileId;
              modifyReport(this.dataForm.F_Id, this.dataForm).then((res) => {
                this.dialogVisible = false;
                this.getData(this.searchParam);
								if(res.data.success){
									this.showMessage('edit','ok')
								}else{
									this.showMessage('edit','no')
								}
              }).finally(() => {
                this.flagReportRelease = false;
              }).catch(()=>{
								this.showMessage('edit','no')
							});
            }
          } else {
			formValidateNotice(object,this,this.formEnCodeList)			
            this.flagReportRelease = false;
            return false;
          }
        });
      },
			showMessage(type,status){
				let msg=type=='add'?
				(status=='ok'?this.$t('reportReleaseAddedSuccessfully'):this.$t('failedToAddReportRelease')):
				(status=='ok'?this.$t('reportReleaseModifiedSuccessfully'):this.$t('reportReleaseModificationFailed'))
				this.$notify({
					title:this.$t('deletePrompt.successTitle'),
					message:msg,
					type:status=='ok'?'success':'error'
				});
			},
      /* 取消弹窗 */
      cancelForm (formName) {
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
      },
      /* 关闭弹窗 */
      handleClose (done) {
        this.$refs['dataForm'].resetFields();
        done();
      },
      /* 页面加载 */
      onPageLoad (page) {
        this.searchParam.limit = page.currentPage;
        this.searchParam.size = page.pageSize;
        this.getData(this.searchParam);
      },
      /* 查询 */
      searchData () {
        this.searchParam.limit = 1;
        this.searchParam.order = null;
        this.searchParam.orderfield = null;
        this.getData(this.searchParam);
      },
      /* 查询表单重置 */
      searchReset () {
        this.searchParam.keyword = null;
        this.getData(this.searchParam);
      },
      sortChange (data) {
        this.searchParam.order = getOrder(data.order);
        this.searchParam.orderfield = data.prop;
        this.getData(this.searchParam);
      },
      selectMoreIcon () {
        this.IconVisible = true;
      },
      childByValue: function (childValue) {
        // childValue就是子组件传过来的值
        this.dataForm.F_Icon = childValue;
        this.IconVisible = false;
      }
    }
  };
</script>