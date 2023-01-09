<template>
  <div class="main-container">
    <main-content :title="contentTitle" :subTitle="contentSubTitle" :paddingLeft="0" :padding-top="94" :search="true">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
		<div class="search-box">
        <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right:5px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
		</div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud ref="databaseLink" :data="databaseLink" :option="option" :showColumn="showColumn" :isSaveColumns="true" @row-dblclick="handleRowDBLClick">
            <template slot="menuLeft">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}
              </el-button>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click="viewForm(scope.row)" v-if="hasButtonPermission('view')">{{$t('tableOperationModule.viewBtn')}}</el-button>
              <el-button type="opr-primary" size="mini" @click="editForm(scope.row)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>

          <!-- 新增 -->
          <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
                     :before-close="closeDialog">
            <div class="form">
              <el-form ref="databaseLinkForm" v-loading="loading" :element-loading-text="$t('databaseManage.dataLink.addModalLoadingText')"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)" :rules="rules" :model="databaseLinkForm"
                       label-width="85px">
                <el-row v-show="hasFormPermission('F_DbType')">
                  <el-col :span="24">
                    <el-form-item :label="$t('databaseManage.dataLink.libraryType')" prop="F_DbType">
                      <el-select v-model="databaseLinkForm.F_DbType" :placeholder="$t('databaseManage.dataLink.selectLibraryType')" size="small"
                                 style="width: 100%">
                        <el-option
                                v-for="item in databaseType"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" v-show="hasFormPermission('F_ServerAddress')">
                    <el-form-item :label="$t('databaseManage.dataLink.databaseIP')" prop="F_ServerAddress">
                      <el-input :placeholder="$t('databaseManage.dataLink.writeDatabaseIP')" size="small"
                                v-model="databaseLinkForm.F_ServerAddress"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-show="hasFormPermission('F_Version')">
                    <el-form-item :label="$t('databaseManage.dataLink.databasePort')" prop="F_Version">
                      <el-input :placeholder="$t('databaseManage.dataLink.writeDatabasePort')" size="small"
                                v-model="databaseLinkForm.F_Version"></el-input>
                    </el-form-item>
                    <!--                                        <el-form-item label="数据库端口" prop="F_Version" >-->
                    <!--                                            <el-input placeholder="请填写数据库端口" size="small"-->
                    <!--                                                      v-model="databaseLinkForm.F_Version"></el-input>-->
                    <!--                                        </el-form-item>-->
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" v-show="hasFormPermission('F_DBUserName')">
                    <el-form-item :label="$t('databaseManage.dataLink.databaseAccount')" prop="F_DBUserName">
                      <el-input :placeholder="$t('databaseManage.dataLink.writeDatabaseAccount')" size="small"
                                v-model="databaseLinkForm.F_DBUserName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-show="hasFormPermission('F_DBPwd')">
                    <el-form-item :label="$t('databaseManage.dataLink.databasePassword')" prop="F_DBPwd">
                      <el-input type="password" :placeholder="$t('databaseManage.dataLink.writeDatabasePassword')" size="small"
                                v-model="databaseLinkForm.F_DBPwd"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" v-show="hasFormPermission('F_DBName')">
                    <el-form-item :label="$t('databaseManage.dataLink.nameDatabase')" prop="F_DBName">
                      <el-input :placeholder="$t('databaseManage.dataLink.writeNameDatabase')" size="small"
                                v-model="databaseLinkForm.F_DBName" style="width: 82%"></el-input>
                      <el-button size="small" type="primary" @click="testLinks('databaseLinkForm')"
                                 style="float: right; width: 17%;padding:6.5px 0;">{{$t('databaseManage.dataLink.testLinkBtn')}}
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" v-show="hasFormPermission('F_DBAlias')">
                    <el-form-item :label="$t('databaseManage.dataLink.anotherName')" prop="F_DBAlias">
                      <el-input :placeholder="$t('databaseManage.dataLink.writeAnotherName')" size="small" :autosize="{ minRows: 4, maxRows: 4}"
                                v-model="databaseLinkForm.F_DBAlias"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" v-show="hasFormPermission('F_Description')">
                    <el-form-item :label="$t('databaseManage.dataLink.Describe')" prop="F_Description">
                      <el-input type="textarea" :placeholder="$t('databaseManage.dataLink.writeDescribe')" size="small"
                                v-model="databaseLinkForm.F_Description"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                            <el-button 
                            size="mini" 
                            type="primary" 
                            :loading="flagDataLink"
                            @click="submitForm('databaseLinkForm')"
                            >
                            {{flagDataLink?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                            </el-button>
                        </span>
          </el-dialog>

      </div>
    </main-content>
  </div>
</template>

<script>
  import MainContent from '../../../page/main/MainContent';
  import { getDbLinks, testLinks, addDbLinks, editDbLinks, deleteDbLinks } from '@/api/databasemanage/databaselink';
  import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
  import authorizeMixin from "@/mixins/authorize"; //鉴权混入
  import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存 
  import { deepClone,formValidateNotice} from '@/util/util';
  import {validateLength,validateShortLength,validateDesLength, validateLetter} from "@/api/organization/validateFunc";
  export default {
    name: 'DatabaseLink',
    mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
    components: { MainContent },
    data () {
      return {
        flagDataLink: false,
        contentTitle: '连接信息',
        dialogTitle:this.$t('databaseManage.dataLink.titleAddDatabase'),
        contentSubTitle: '',
        searchParam: {},
        databaseLink: [],
        databaseLinkForm: {
          // F_Version:''
        },
        databaseType: ['SqlServer', 'Oracle', 'MySql','Postgresql'],
        dialogVisible: false,
        rules: {
          F_DbType: [
            { required: true, message: this.$t('databaseManage.dataLink.selectLibraryType'), trigger: 'change' }
          ],
          F_ServerAddress: [
            { required: true, message:this.$t('databaseManage.dataLink.writeDatabaseIP'), trigger: 'change' },
            { validator: validateLength, trigger:'change'}
          ],
          F_Version: [
            { required: true, message:this.$t('databaseManage.dataLink.writeDatabasePort'), trigger: 'change' },
            { validator: validateLength, trigger:'change'}
          ],
          F_DBUserName: [
            { required: true, message:this.$t('databaseManage.dataLink.writeDatabaseAccount'), trigger: 'change' },
            { validator: validateLength, trigger:'change'}
          ],
          F_DBPwd: [
            { required: true, message: this.$t('databaseManage.dataLink.writeDatabasePassword'), trigger: 'change' },
            { validator: validateShortLength, trigger:'change'}
          ],
          F_DBName: [
            { required: true, message:this.$t('databaseManage.dataLink.writeNameDatabase'), trigger: 'change' },
            { validator: validateLength, trigger:'change'}
          ],
		  F_DBAlias: [
            { required: true, message:this.$t('databaseManage.dataLink.writeAnotherName'), trigger: 'blur' },
            { validator: validateLength, trigger:'change'}
          ],
          F_Description: [
            { validator: validateDesLength, trigger:'change'}
          ]
        },
        option: {
          highlightCurrentRow: true,
          stripe: false,
          menuWidth: 180,
          border: false,
          page: false,
          index: true,
          indexLabel:this.$t('databaseManage.dataLink.tableNumber'),
          align: 'center',
          menuAlign: 'center',
          addBtn: false,
          delBtn: false,
          editBtn: false,
          column: [
            {
              label:this.$t('databaseManage.dataLink.tableName'),
              prop: 'F_DBName',
			  align: 'left',
			  sortable:true
            }, {
              label:this.$t('databaseManage.dataLink.anotherName'),
              prop: 'F_DBAlias',
			  align: 'left',
			  sortable:true
            }, {
              label:this.$t('databaseManage.dataLink.tableTaye'),
              prop: 'F_DbType',
			  width:"80",
			  align: 'left',
			  sortable:true
            }, {
              label:this.$t('databaseManage.dataLink.tableDatabaseIP'),
              prop: 'F_ServerAddress',
			  width:"110",
			  align: 'left',
			  sortable:true
            }, {
              label:this.$t('databaseManage.dataLink.databasePort'),
              prop: 'F_Version',
			  width:"120",
			  align: 'left',
			  sortable:true
            }, {
              label: this.$t('databaseManage.dataLink.tableDatabaseAccount'),
              prop: 'F_DBUserName',
			  width:"120",
			  align: 'left',
			  sortable:true
            }, {
              label:this.$t('databaseManage.dataLink.Describe'),
              prop: 'F_Description',
			  align: 'left',
			  sortable:true
            }
          ]
        },
        loading: false
      };
    },
    created () {
	  if(window.screen.width<1418){
	    this.menuHeight = 134;
	  }		
      this.getDatabaseLink();
    },
    methods: {
      handleRowDBLClick (row, event) {
        if(this.openDoubleClickEdit){
          this.editForm(row)
        }
      },
      /* 获取语言类型 */
      getDatabaseLink (obj) {
        getDbLinks(obj).then(res => {
          this.databaseLink = res.data.data;

        });
      },
      /* 测试连接 */
      testLinks (formName) {
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            testLinks(this.databaseLinkForm).then(res => {
              if(res.data.code == 0){
                  const { data } = res.data;
                  if (!data) {
                    this.$notify({
                      title:this.$t('deletePrompt.failureTitle'),
                      message:this.$t('databaseManage.dataLink.testLink.promptMessageFailure'),
                      type: 'warning'
                    });
                    this.loading = false;
                    return;
                  }
                  this.$notify({
                    title: this.$t('deletePrompt.successTitle'),
                    message:this.$t('databaseManage.dataLink.testLink.promptMessageSuccess'),
                    type: 'success'
                  });
                }
                this.loading = false;
            })
            .catch(err=>{
              this.loading = false;
            });

          } else {
            this.$notify({
              title:this.$t('deletePrompt.failureTitle'),
              message:this.$t('databaseManage.dataLink.testLink.promptMessageFailure'),
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
        });
      },
      /* 打开 */
      openDialog () {
        this.dialogTitle=this.$t('databaseManage.dataLink.titleAddDatabase');
		this.databaseLinkForm = {};
        if (this.$refs.databaseLinkForm) {
          this.$refs.databaseLinkForm.resetFields();
        }
        this.flag = true;
        this.dialogVisible = true;
      },
      /* 关闭 */
      closeDialog () {
        this.databaseLinkForm = {};
		this.dialogVisible = false;
      },
      /* 提交 */
      submitForm (formName) {

        this.flagDataLink = true;
        this.$refs[formName].validate((valid,object) => {
          if (valid) {
            if (this.flag) {
              addDbLinks(this.databaseLinkForm).then((res) => {
                this.dialogVisible = false;
                this.getDatabaseLink();
								if(res.data.success){
									this.showMessage('add','ok')
								}else{
									this.showMessage('add','no')
								}
              }).finally(() => {
                this.flagDataLink = false;
              }).catch(()=>{
								this.showMessage('add','no')
							});
            } else {
              editDbLinks(this.databaseLinkForm.F_DatabaseLinkId, this.databaseLinkForm).then((res) => {
                this.dialogVisible = false;
                this.getDatabaseLink();
								if(res.data.success){
									this.showMessage('edit','ok')
								}else{
									this.showMessage('edit','no')
								}
              }).finally(() => {
                this.flagDataLink = false;
              }).catch(()=>{
								this.showMessage('edit','no')
							});
            }
          } else {
			formValidateNotice(object,this,this.formEnCodeList)
            this.flagDataLink = false;
            return false;
          }
        });
      },
			showMessage(type,status){
				let msg=type=='add'?
				(status=='ok'?this.$t('newDatabaseConnectionSuccessful'):this.$t('newDatabaseConnectionFailed')):
				(status=='ok'?this.$t('databaseConnectionModifiedSuccessfully'):this.$t('failedToModifyDatabaseConnection'))
				this.$notify({
					title:this.$t('deletePrompt.successTitle'),
					message:msg,
					type:status=='ok'?'success':'error'
				});
			},
      viewForm (row) {
        this.$refs['databaseLink'].rowView(row);
      },
      /* 编辑 */
      editForm (row) {
        this.flag = false;
        this.dialogVisible = true;
        this.dialogTitle=this.$t('databaseManage.dataLink.titleEditDatabase');
        //回显错误密码占位
        // row.F_DBPwd = '123456';
        this.databaseLinkForm = deepClone(row);
      },
      /* 删除 */
      deleteForm (row) {
        this.$confirm(this.$t('deletePrompt.promptContent'),  this.$t('deletePrompt.promptTitle'), {
          confirmButtonText:this.$t('buttonModule.modalSureBtn'),
          cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
          type: 'warning'
        }).then(() => {
          deleteDbLinks(row.F_DatabaseLinkId).then(() => {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message: this.$t('deletePrompt.successDeleted'),
              type: 'success'
            });
            this.getDatabaseLink();
          });
        }).catch(() => {

        });
      },

      /* 搜索 */
      search () {
        this.getDatabaseLink(this.searchParam);
      },
      /* 搜索 表单重置 */
      searchReset () {
        this.searchParam = {};
        this.getDatabaseLink();
      },
    },
  };
</script>

<style scoped>
  /* css */
  .main-container {
    height: 100%;
    padding: 0 8px;
  }
</style>