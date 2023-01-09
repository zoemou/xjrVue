<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <i slot="icon" class="el-icon-s-tools icon" @click="dialogIcon"></i>
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 公司树形菜单 -->
        <el-tree
            :data="dataItemTree"
            :props="defaultProps"
            node-key="F_ItemId"
            ref="dTree"
            :default-expand-all="true"
            @node-click="handleNodeClick"
        >
		<span class="custom-tree-node" slot-scope="{data }">
		<i class="el-icon-collection"></i>
		<span>{{ data.F_ItemName}}</span>
		</span>
		</el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="205" :padding-top="94">
       <div class="search-box"   slot="search">  
          <el-input
            v-model="keyword"
              size="small"
              clearable
              :style="{ width: '100%' }"
             :placeholder="$t('searchModule.searchPlaceholder')"
            ></el-input>
          <el-button
          class="search-btn"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getDataItem()"
              >{{ $t("searchModule.searchBtn") }}</el-button
            >
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud ref="dataItem" :data="dataItem" :option="option" :showColumn="showColumn" :isSaveColumns="true" @row-click="currentRow" @row-dblclick="handleRowDBLClick">
            <template slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
            </template>
            <template slot-scope="scope" slot="F_EnabledMark">
              <el-tag type="success" effect="dark" size="small" v-if="scope.row.F_EnabledMark === 1">{{$t('dataItem.tableEffective')}}</el-tag>
              <el-tag type="danger" effect="dark" size="small" v-if="scope.row.F_EnabledMark === 0">{{$t('dataItem.tableInvalid')}}</el-tag>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>

          <!-- 新增 -->
          <el-dialog v-dialogDrag
              :title="$t('dataItem.addModal.modalTitle')"
              :close-on-click-modal="false"
              :append-to-body="true"
              :visible.sync="dialogVisible"
              width="40%"
              :before-close="closeDialog"
          >
            <div class="form">
              <el-form ref="dataItemForm" :rules="rules" :model="dataItemForm" label-width="60px" v-if="dialogVisible">
				<el-col v-show="hasFormPermission('F_ItemName')">
					<el-form-item :label="$t('dataItem.addModal.labelName')" prop="F_ItemName">
					  <el-input v-model="dataItemForm.F_ItemName" :placeholder="$t('dataItem.addModal.placeholderName')"></el-input>
					</el-form-item>
				</el-col>
				<el-col v-show="hasFormPermission('F_ItemValue')">
					<el-form-item :label="$t('dataItem.addModal.labelValue')" prop="F_ItemValue">
					  <el-input v-model="dataItemForm.F_ItemValue" :placeholder="$t('dataItem.addModal.hintItemValue')" ></el-input>
					</el-form-item>
                <!-- <el-form-item label="简拼" prop="F_SimpleSpelling">
                  <el-input v-model="dataItemForm.F_SimpleSpelling" placeholder="请填写简拼" ></el-input>
                </el-form-item> -->
        </el-col>
        <el-col v-show="hasFormPermission('F_SortCode')">
					<el-form-item :label="$t('dataItem.tableSort')" prop="F_SortCode">
					  <el-input v-model="dataItemForm.F_SortCode" :placeholder="$t('dataItem.addModal.hintSort')"></el-input>
					</el-form-item>
				</el-col>
        <el-col v-show="hasFormPermission('F_EnabledMark')">
          <el-form-item prop="F_EnabledMark" :label="this.$t('custmerForm.tableEnable')">
            <el-switch v-model="dataItemForm.F_EnabledMark" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
				<el-col v-show="hasFormPermission('F_LgMarkCode')">
				  <el-form-item prop="F_LgMarkCode" :label="$t('menuManagement.addModal.labelTransTag')">
					<!-- <avue-input-tree default-expand-all
											v-model="dataItemForm.F_LgMarkCode"
											:placeholder="$t('menuManagement.addModal.placeholderTransTag')" type="tree"
											:dic="transDefaultTree" size="small"
											style="width: 100%"></avue-input-tree> -->

                       <el-select
                            v-model="dataItemForm.F_LgMarkCode"                            
                            filterable
                            remote
                            reserve-keyword
                            :placeholder=" $t('menuManagement.addModal.placeholderTransTag')"
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
				<el-col v-show="hasFormPermission('F_Description')">
					<el-form-item prop="F_Description" :label="$t('dataItem.tableDescription')">
					  <el-input
						  type="textarea"
						  :placeholder="$t('dataItem.addModal.placeholderRemarks')"
						  size="small"
						  :autosize="{ minRows: 4, maxRows: 4 }"
						  v-model="dataItemForm.F_Description"
					  ></el-input>
					</el-form-item>
				</el-col>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
              <el-button 
              size="mini" 
              type="primary" 
              @click="submitForm('dataItemForm')" 
              :loading="flagDataItem"
              >
              {{flagDataItem?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
              </el-button>
            </span>
          </el-dialog>

      </div>
    </main-content>

    <el-dialog v-dialogDrag
        :title="$t('dataItem.dialogInstall.modalTitle')"
        :append-to-body="true"
        :visible.sync="dialogVisibleIcon"
        :close-on-click-modal="false"
        width="60%"
        :before-close="closeDialogIcon"
    >
      <dialog-install v-if="dialogVisibleIcon" @cancel="cancel"></dialog-install>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from '@/page/main/MainFixed';
import MainContent from '@/page/main/MainContent';
import { getDataItemTreeFn, getDataItem, addDataItem, editDataItem, deleteDataItem } from '@/api/system/dataitem';
import DialogInstall from './components/dialog-install';
import { deepClone,FormatTree,LanguageFormatTree,formValidateNotice } from '@/util/util';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import {getLgMarkList} from '@/api/language/translation';
import {validateLetter,validateSort,validateLength,validateDesLength} from "@/api/organization/validateFunc";
export default {
  name: 'DataItem',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainFixed, MainContent, DialogInstall },
  data () {
    function checkData (rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error(this.$t('dataItem.hintNoChinese')));
        } else {
          callback();
        }
      }
      callback();
    }
    return {
      keyword:"",
      flagDataItem: false,
      fixedTitle: this.$t('dataItem.fixedTitle'),
      contentTitle: '字典数据',
      contentSubTitle: '',
      searchParam: {},
      dataItemTree: [],
	  transDefaultTree:[],
      dataItem: [],
      itemCode: '',
      parentId: '',
      dataItemForm: {
        F_ItemName:'',
        F_ItemValue:'',
        F_SortCode:'',
        F_LgMarkCode: '',
        F_Description: '',
        F_ParentId: '',
        F_ItemId: '',
        F_EnabledMark: ''
      },
      dialogVisibleIcon: false,
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'F_ItemName',
      },
      rules: {
        F_ItemName: [{ required: true, message:this.$t('dataItem.addModal.placeholderName'), trigger: 'change' },
          { validator:validateLength,trigger:'change'}
        ],
        F_ItemValue: [{ required: true, message:this.$t('dataItem.addModal.hintItemValue'), trigger: 'change' },
         { validator: validateLetter, trigger: 'change' }],
        F_SortCode: [{ required: true, message: this.$t('dataItem.addModal.hintSort'), trigger: 'change' },
          { validator:validateSort,trigger:'change'}
        ],
        F_Description:[{
          validator:validateDesLength,trigger:'change'
        }]
      },
      option: {
        highlightCurrentRow: true,
        rowKey: "F_ItemName",
        stripe: false,
        menuWidth: 150,
        border: false,
        page: false,
        index: true,
        indexLabel:this.$t('dataItem.tableNumber'),
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label:this.$t('dataItem.tableName'),
            prop: 'F_ItemName',
			align:'left',
			sortable:true
          },
          {
            label: this.$t('dataItem.tableItemValue'),
            prop: 'F_ItemValue',
			align:'left',
			sortable:true
          },
          {
            label: this.$t('dataItem.tableSimpleSpelling'),
            prop: 'F_SimpleSpelling',
			      width:'100',
				  align:'left',
				  sortable:true
          },
          {
            label: this.$t('dataItem.tableSort'),
            prop: 'F_SortCode',
			      width:'80',
				  align:'left',
				  sortable:true
          },
          {
            label:this.$t('language.translation.labelTagName'),
            prop: 'F_LgMarkName',
			align:'left',
			sortable:true
          },
          {
            label: this.$t('dataItem.tableEffective'),
            prop: 'F_EnabledMark',
			width:'70',
				  align:'left',
            slot: true,
			sortable:true
          },
          {
            label:this.$t('dataItem.tableDescription'),
            prop: 'F_Description',
			align:'left',
			sortable:true
          },
        ],
      },
    };
  },
  created () {
    this.getDataItemTree();
	// this.getDataDictionary()
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
    cancel () {
      this.dialogVisibleIcon = false;
    },
    dialogIcon () {
      this.dialogVisibleIcon = true;
    },
    /* 获取数据字典树 */
    async getDataItemTree () {
      const res = await getDataItemTreeFn();
      this.dataItemTree = res.data.data;
      this.itemCode = res.data.data[0].F_ItemCode;
      this.getDataItem();
      /* 左侧树形菜单默认选中第一个 */
      this.$nextTick(() => {
        this.$refs.dTree.setCurrentKey(res.data.data[0].F_ItemCode);
      });
    },
    /* 选择树形菜单加载公司用户信息 */
    handleNodeClick (data) {
      this.searchParam.keyword = null;
      this.itemCode = data.F_ItemCode;
      this.parentId = data.F_ParentId;
      this.itemId = data.F_ItemId;

      this.dataItemForm.F_ItemDetailId = data.F_ItemDetailId;
      this.getDataItem();
    },
    getDataItem () {
      getDataItem(this.itemCode, this.keyword).then(({ data: { data } }) => {
        this.dataItem = data;
      });
    },
    /* 单击行 */
    currentRow (row) {
      this.dataItemForm = deepClone(row);
    },
    /* 打开 */
    openDialog () {
      this.flag = true;
      this.dialogVisible = true;
      this.dataItemForm = {};
      this.dataItemForm.F_ParentId = this.parentId;
      this.dataItemForm.F_ItemId = this.itemId;
      this.dataItemForm.F_EnabledMark = 1;
      if(this.$refs['dataItemForm']) this.$refs['dataItemForm'].resetFields()
    },
    /* 关闭 */
    closeDialog () {
      this.dataItemForm = {};
      this.dialogVisible = false;
      // this.$refs['dataItemForm'].resetFields()
    },
    closeDialogIcon () {
      this.getDataItemTree()
      this.dialogVisibleIcon = false;
    },
    /* 提交 */
    submitForm (formName) {
      this.flagDataItem = true;
      this.$refs[formName].validate((valid,object) => {
        if (valid) {
          this.dataItemForm.F_ItemCode = this.itemCode
          if (this.flag) {
            addDataItem(this.dataItemForm).then(() => {
              this.dialogVisible = false;
              this.getDataItem();
            }).finally(() => {
              this.flagDataItem = false;
            });
          } else {
            editDataItem(this.dataItemForm.F_ItemDetailId, this.dataItemForm).then(() => {
              this.dialogVisible = false;

              this.getDataItem();
            }).finally(() => {
              this.flagDataItem = false;
            });
          }
        } else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagDataItem = false;
          return false;
        }
      });
    },
    /* 编辑 */
    editForm (row) {
      this.flag = false;
      this.dialogVisible = true;
	  if(row.F_LgMarkCode){
	  	this.transDefaultTree=[{
	  	  F_Id:row.F_LgMarkCode,
	  	  F_EnCode:row.F_LgMarkCode,
	  	  F_Name:row.F_LgMarkName
	  	}];
	  }
    },
    /* 删除 */
    deleteForm (row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: 'warning',
      })
          .then(() => {
            deleteDataItem(row.F_ItemDetailId).then(() => {
              this.$notify({
                title:this.$t('deletePrompt.successTitle'),
                message: this.$t('deletePrompt.successDeleted'),
                type: 'success',
              });
              this.getDataItem();
            });
          })
          .catch(() => {});
    },
    /* 取消 */
    cancelDialog () {},
  },
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

.icon {
  position: absolute;
  top: 15px;
  right: 5px;
}
@media screen and (max-width: 1370px) {
	 div /deep/.el-dialog{
		margin-top:8vh!important;
	  }
}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}	
.search-box{
  display: flex;
}
.search-btn{
  margin-left:4px;
}
</style>
