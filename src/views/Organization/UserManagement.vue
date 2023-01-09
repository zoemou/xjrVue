<template>
  <div class="main-container page-fixed">
    <main-fixed :title="fixedTitle" :resize="true">
      <div slot="list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          ref="cTree"
          node-key="F_CompanyId"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ node, data }">
		        <i class="icon-map-site"></i>
		        <span>{{ data.F_FullName}}</span>
		 </span>
		</el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="205">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.Keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right:5px;"
          ></el-input>
          <avue-input-tree
            default-expand-all
            v-model="searchParam.Department_Id"
            :placeholder="$t('orgUserManagement.searchSelectPart')"
            type="tree"
            :dic="companiesDepartments"
            size="small"
            style="width: 200px; margin-right: 5px;"
          ></avue-input-tree>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchUser"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <avue-crud
          ref="cuTable"
          v-if="companyId"
          :data="companiesUser"
          :option="option"
          stripe
          :page.sync="page"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @on-load="onPageLoad"
          @sort-change="sortChange"
          @row-click="handleCurrentRowChange"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              v-if="hasButtonPermission('add')"
              @click="openForm()"
              >{{$t('buttonModule.addBtn')}}
            </el-button>
            <el-button
              
              size="small"
              v-if="hasButtonPermission('disabled')"
              @click="disableUser"
              >{{$t('orgUserManagement.disUserBtn')}}</el-button
            >
            <el-button
              
              size="small"
              @click="enableUser"
              v-if="hasButtonPermission('enabled')"
              >{{$t('orgUserManagement.enUserBtn')}}</el-button
            >
            <el-button
             
              size="small"
              @click="resetPassword"
              v-if="hasButtonPermission('resetpassword')"
              >{{$t('orgUserManagement.resetPasswordBtn')}}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('authorizeapp')"
              @click="openAppAuthorizeDialog"
              >APP功能授权</el-button
            >
            <el-button
              
              size="small"
              @click="setAuthorize"
              v-if="hasButtonPermission('authorize')"
              >{{$t('orgUserManagement.setAuthorizeBtn')}}</el-button
            >
            <OrgImport type="user"></OrgImport>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('modify')"
              @click="editForm(scope.row)"
              
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              @click="deleteForm"
              v-if="hasButtonPermission('delete')"
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
              <!--<el-button
              type="danger"
              size="mini"
              v-if="hasButtonPermission('delete')"
              @click="deleteForm"
              >删除</el-button
            >-->
          </template>
        </avue-crud>
      </div>
    </main-content>
    <!-- APP功能授权 -->
    <AppAuthorize v-if="appAuthorizeVisible"  @close="appAuthorizeVisible=false" :objectType="objectType" :objectId="objectId"></AppAuthorize>
    <!--新增 编辑 -->
    <el-dialog v-dialogDrag
      :title="$t('orgUserManagement.addModal.modalTitle')"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleClose"
    >
      <div class="companiesuser-form custom-form" v-if="dialogVisible">
        <el-form
          :rules="rules"
          ref="userForm"
          :model="companiesUserForm"
          label-width="80px"
        >
          <el-col :span="12" v-show="hasFormPermission('F_Account')">
            <el-form-item prop="F_Account" :label="$t('orgUserManagement.addModal.labelAccount')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholderAccount')"
                size="small"
                v-model="companiesUserForm.F_Account"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Password')">
            <el-form-item prop="F_Password" :label="$t('orgUserManagement.addModal.labelPassword')" v-if="flag">
              <el-input
                type="password"
                :placeholder="$t('orgUserManagement.addModal.placeholderPassword')"
                size="small"
                v-model="companiesUserForm.F_Password"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('orgUserManagement.addModal.labelPassword')" v-else>
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholderPassword')"
                size="small"
                :value="'******'"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_RealName')">
            <el-form-item prop="F_RealName" :label="$t('orgUserManagement.addModal.labelName')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholderName')"
                size="small"
                v-model="companiesUserForm.F_RealName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Gender')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelSex')">
              <el-select
                size="small"
                style="width: 100%;"
                v-model="companiesUserForm.F_Gender"
                :placeholder="$t('orgUserManagement.addModal.placeholderSelect')"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_EnCode')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelJobNum')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholderJobNum')"
                size="small"
                v-model="companiesUserForm.F_EnCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_DepartmentId')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelDepartment')" prop="F_DepartmentId">
                <avue-input-tree multiple :props="defaultDepartmentProps"
                                     v-model="companiesUserForm.F_DepartmentId"
                                      type="tree" @focus="iptTreeFocus"
                                      :check-strictly="true"
                                     :dic="allDepartmentsList" size="small"  :tree-load="treeLoad" lazy></avue-input-tree>


            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Birthday')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelBirthday')">
              <el-date-picker
                v-model="companiesUserForm.F_Birthday"
                type="date"
                :placeholder="$t('orgUserManagement.addModal.placeholderBirthday')"
                size="small"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Email')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelEmail')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholEmail')"
                size="small"
                v-model="companiesUserForm.F_Email"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Mobile')">
            <el-form-item prop="F_Mobile" :label="$t('orgUserManagement.addModal.labelMobile')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholMobile')"
                size="small"
                v-model="companiesUserForm.F_Mobile"
                :maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_Telephone')">
            <el-form-item prop="F_Telephone" :label="$t('orgUserManagement.addModal.labelTelephone')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholTelephone')"
                size="small"
                v-model="companiesUserForm.F_Telephone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_OICQ')">
            <el-form-item prop="F_OICQ" :label=" $t('orgUserManagement.addModal.labelOICQ')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholOICQ')"
                size="small"
                v-model="companiesUserForm.F_OICQ"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="hasFormPermission('F_WeChat')">
            <el-form-item :label=" $t('orgUserManagement.addModal.labelWeChat')">
              <el-input
                :placeholder="$t('orgUserManagement.addModal.placeholWeChat')"
                size="small"
                v-model="companiesUserForm.F_WeChat"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_Description')">
            <el-form-item :label="$t('orgUserManagement.addModal.labelRemark')">
              <el-input
                type="textarea"
                :placeholder="$t('orgUserManagement.addModal.placeholRemark')"
                size="small"
                :autosize="{ minRows: 4, maxRows: 10 }"
                maxlength="800"
                show-word-limit
                v-model="companiesUserForm.F_Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm('userForm')">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="userFormSubmit('userForm')"
          :loading="flagUser"
          >{{flagUser?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
    <!-- 功能授权 -->
    <el-dialog v-dialogDrag
	  class="authorizedialog"
      :title="$t('orgUserManagement.setAutModal.modalTitle')"
      :append-to-body="true"
      top="9vh"
      :visible.sync="authorizeVisible"
      :close-on-click-modal="false"
      width="80%"
      :before-close="closeAuthorizeDialog"
    >
      <authorize-select-tree
        ref="authorizeTreeRef"
        v-if="authorizeVisible"
        :objectType="objectType"
        :objectId="objectId"
		
      ></authorize-select-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirmAuthorizeDialog" :loading="flagUserFunc"
          >{{flagUserFunc?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import OrgImport from "./components/OrgImport.vue";
import AuthorizeSelectTree from "./components/AuthorizeSelectTree";
import AppAuthorize from "./components/app/AppAuthorize";//App功能授权
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { deepClone,FormatTree,formValidateNotice } from '@/util/util';
import { getLowerDepartment } from '@/api/organization/department';
import {
  getCompaniesUserList,
  getCompaniesDepartments,
  postUser,
  modifyUser,
  deleteUser,
  switchUser,
  resetPassword,
} from "@/api/organization/user";
import { getLowerCompanies } from "@/api/organization/company";
import { postAuthorizes } from "@/api/organization/index";
import {validateLength,validatePhone,validateTelePhone,validateEmail,validateOicq} from "@/api/organization/validateFunc";
export default {
  name: "UserManagement",
  mixins: [authorizeMixin,tableOptionMixin,displayColumnsMixin],
  components: {
    AuthorizeSelectTree,
    MainContent,
    MainFixed,
    OrgImport,
    AppAuthorize
  },
  data() {
	const _this = this;
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error(this.$t('orgUserManagement.addModal.Hint.errorMobile')));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error(this.$t('orgUserManagement.addModal.Hint.errorNumber')));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t('orgUserManagement.addModal.Hint.errorFormat')));
          }
        }
      }, 100);
    };
    return {
      flagUser: false,
      flagUserFunc: false,
      fixedTitle: this.$t('orgUserManagement.fixedTitle'),
      contentTitle: "用户列表",
      companiesTree: [],
      companiesUser: [],
      companiesDepartments: [],
      flag: false,
      companiesUserForm: {},
      companyId: "",
      searchParam: {
        Keyword: null,
        Department_Id: "",
      },
      defaultProps: {
        // children: "children",
        label: "F_FullName",
      },
      dialogVisible: false,
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1,
        layout: "total, prev, pager, next",
      },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('orgUserManagement.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabAccount'),
            prop: "F_Account",
			width:"140",
			align:'left'
          },
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabName'),
            prop: "F_RealName",
			width:"100",
			align:'left'
          },
          {
            sortable: true,
            label: this.$t('orgUserManagement.tabSex'),
			width:"80",
			align:'left',
            prop: "F_Gender",
            formatter: function (row) {
              return row.F_Gender === 0 ? _this.$t('custmerForm.female'): row.F_Gender === 1 ? _this.$t('custmerForm.male') : "";
            },
          },
          {
            sortable: true,
            label:this.$t('orgUserManagement.tabMobile'),
            prop: "F_Mobile",
			width:"120",
			align:'left'
          },
		  {
		    sortable: true,
		    label:this.$t('orgUserManagement.tabEnableDisable'),
		    prop: "F_EnabledMark",
		  	width:"140",
			align:'left',
            formatter: function (row) {
				
              return row.F_EnabledMark === 0 ?_this.$t('custmerForm.tableDisable'): _this.$t('custmerForm.tableEnable'); //_this.$t()
            }
		  },
          {
            label:this.$t('orgUserManagement.tabDepartment'),
            prop: "F_DepartmentName",
			align:'left'
          },          
          {
            sortable: true,
            label:this.$t('orgUserManagement.tabRemark'),
            prop: "F_Description",
			align:'left'
          },
        ],
      },
      rules: {
        F_Account: [{ required: true, message:this.$t('orgUserManagement.addModal.placeholderAccount'), trigger: "change" },
          { validator:validateLength,trigger:'change'}
        ],
        F_Password: [
          { required: true, message:this.$t('orgUserManagement.addModal.placeholderPassword'), trigger: "blur" },
          { min: 6, max: 16, message:this.$t('orgUserManagement.addModal.Hint.passworldLength'), trigger: "blur" },
        ],
        F_RealName: [
          { required: true, message:this.$t('orgUserManagement.addModal.placeholderName'), trigger: "change" },
          { validator:validateLength,trigger:'change'}
        ],
        F_EnCode:[
          {validator:validateLength,trigger:'change'}
        ],
        F_DepartmentId: [
          { required: true,  message:this.$t('orgUserManagement.addModal.Hint.selectDepartment'), trigger: "change" },
        ],
        F_Mobile: [{ required: true, validator: checkPhone, trigger: "blur" }],
        F_Telephone:[{ validator:validateTelePhone,trigger:'change'}],
        F_OICQ:[{ validator:validateOicq,trigger:'change'}]

      },
      authorizeVisible: false,
      objectId: "",
      objectType: 2,
      authorizeChangeData: [],
      departmentDialogVisible: false,
      selectedList: [],
      genderOptions: [
        {
          value: 0,
          label: this.$t('custmerForm.female'),
        },
        {
          value: 1,
          label: this.$t('custmerForm.male'),
        },
      ],
      allDepartmentsList: [],
      defaultDepartmentProps: {
        value: 'F_DepartmentId',
        label: 'F_FullName',
        // children: 'children',
      },
      F_DepartmentId: '',
      appAuthorizeVisible: false,
      treeNode: '',
      treeResolve: {},
      isFocus:false
    };
  },
  async created() {
  },
  watch: {
    dialogVisible: {
      handler: function (curVal, oldVal) {
        if (!curVal) this.isFocus = false
      }
    }
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.hasButtonPermission('modify')&&this.openDoubleClickEdit){
        this.editForm(row)
      }
    },
    async loadNode(node, resolve) {
      try {
        const id = node.data.F_CompanyId || '0'
        if (id === '0') {
          let res = await getLowerCompanies(id);
          if (res.data.success) {
            this.companiesTree = res.data.data
            if (this.companiesTree.length > 0) {
              this.companyId = res.data.data[0].F_CompanyId;
              this.getDep(this.companyId);               
              this.$nextTick(function () {
                this.$refs.cTree.setCurrentKey(this.companyId);
              })
            }
          }
        } else {
          const departmentId = node.data.F_DepartmentId || '0'
          if (node.data.unGetLowerCompanies) {
            let res = await getLowerDepartment(node.data.F_CompanyId, departmentId)
            if (res.data.success) {
              res.data.data.map(item => {
                item['unGetLowerCompanies'] = true
              })
            }
            resolve(res.data.data)
          } else {
            let [res1, res2] = await Promise.all([getLowerDepartment(node.data.F_CompanyId, departmentId), getLowerCompanies(node.data.F_CompanyId)])
            let departmentsData = []
            let companiesData = []
            let resolveData = []
            if (res1.data.success) {
              res1.data.data.map(item => {
                item['unGetLowerCompanies'] = true
              })
              departmentsData = res1.data.data
            }
            if (res2.data.success) {
              companiesData = res2.data.data
            }
            let hasDepartmentData = !!departmentsData.length
            let hasCompaniesData= !!companiesData.length
            if (hasDepartmentData && hasCompaniesData) {
              resolveData = [...departmentsData,...companiesData]
            } else if (!hasDepartmentData && hasCompaniesData) {
              resolveData = companiesData
            } else if (hasDepartmentData && !hasCompaniesData) {
              resolveData = departmentsData
            }
            resolve(resolveData) 
          }
        }
      } catch (error) {}
    },
    /* 选择树形菜单加载公司用户信息 */
    async handleNodeClick(data) {
      this.companiesUserForm.F_UserId  = "";
      this.searchParam.Keyword = null;
      this.searchParam.Department_Id = data.F_DepartmentId;
      this.companyId = data.F_CompanyId;
	    this.F_DepartmentId=data.F_DepartmentId;
      this.getUser();
      this.getDep(data.F_CompanyId);
      // await this.getDepartmentsList();
    },
    /* 获取公司用户数据 */
    getUser() {
      let params = {
        Company_Id: this.companyId,
        limit: this.page.currentPage,
        size: this.page.pageSize,
        Keyword: this.searchParam.Keyword,
        Department_Id: this.searchParam.Department_Id,
      };

      getCompaniesUserList(params).then((res) => {
        this.companiesUser = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });

    },
    formateParentTree(data){
    let list = [];
    data.forEach(item => {
      let temp = { F_DepartmentId: '', F_FullName: "请选择" };
        temp.F_DepartmentId = item.F_DepartmentId;
        temp.F_FullName = item.F_FullName;
        list.push(temp);
    });
    return list;
    },
    /* 获取公司部门 */
    getDep(id) {
      getCompaniesDepartments(id).then((res) => {
        const tree = FormatTree(
          res.data.data,
          "F_DepartmentId",
          "F_FullName",
          "children"
        );
        this.companiesDepartments = tree;
      });
    },
    /* 新增用户 */
    openForm() {
      this.flag = true;
      this.companiesUserForm = {
        F_CompanyId:this.companyId,
        F_UserId: "",
        F_Account: "",
        F_Password: "",
        F_RealName: "",
        F_Gender: "",
        F_EnCode: "",
        F_DepartmentId: this.F_DepartmentId,
        F_DepartmentName: "",
        F_Birthday: "",
        F_Email: "",
        F_Mobile: "",
        F_Telephone: "",
        F_OICQ: "",
        F_WeChat: "",
        F_Description: "",
      };
      this.dialogVisible = true;
    },
    /* 提交表单 */
    userFormSubmit(formName) {
      this.flagUser = true;
      this.$refs[formName].validate((valid,object) => {
        if (valid) {
          if (this.flag) {
             let reutrnData = deepClone(this.companiesUserForm);
             let tempJoinStr =reutrnData.F_DepartmentId.join(',');
             reutrnData.F_DepartmentId = tempJoinStr;
            postUser(reutrnData).then((res) => {
              if (this.showNotify(res, this.$t('workFlow.categoryList.addTitle'))) {
                this.dialogVisible = false;
                this.companiesUserForm = {};
              }
            }).finally(() => {
              this.flagUser = false;
            });
          } else {
             let reutrnData = deepClone(this.companiesUserForm);
             let tempJoinStr =reutrnData.F_DepartmentId.join(',');
             reutrnData.F_DepartmentId = tempJoinStr;
            modifyUser(
             reutrnData.F_UserId,
             reutrnData
            ).then((res) => {
              if (this.showNotify(res, this.$t('Notice.dialogTitle.Edit'))) {
                this.dialogVisible = false;
                this.companiesUserForm = {};
              }
            }).finally(() => {
              this.flagUser = false;
            });
          }
        }else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagUser = false;
        }
      });
    },
    cancelForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    /* 关闭弹窗 */
    handleClose(done) {
      done();
    },
    /* 重置表单 */
    ruleForm() {
      this.companiesUserForm = {};
    },
    /* 表格单行选中 */
    setCurrent(row) {
      this.$refs.cuTable.setCurrentRow(row);
    },
    /* 编辑弹窗触发 */
    handleCurrentRowChange(val) {
      // this.flag = false;
      this.companiesUserForm =deepClone(val);
      this.objectId = val.F_UserId;
    },
    /* 表格编辑 */
    editForm(row) {
      this.flag = false;
      this.dialogVisible = true;
      if(row.F_DepartmentId==null){
        row.F_DepartmentId = '0';
      }
      this.companiesUserForm = deepClone(row);
      this.F_DepartmentId = row.F_DepartmentId
    },
    /* 表格删除 */
    deleteForm() {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      })
        .then(() => {
          deleteUser(this.companiesUserForm.F_UserId).then(() => {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('deletePrompt.successDeleted'),
              type: "success",
            });
            //删除数组项 by:yk
            this.companiesUser.forEach((item,idx)=>{
              try{
                if(item.F_UserId == this.companiesUserForm.F_UserId){
                  this.companiesUser.splice(idx,1);
                  new Error('退出循环');
                }
              }catch(err){}
            });
          });
        })
        .catch(() => {});
    },

    /* 启用帐户 */
    enableUser() {
      if (
        !this.companiesUserForm.F_UserId ||
        this.companiesUserForm.F_UserId === ""
      ) {
        this.$message({
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning",
        });
        return;
      }
      if (this.companiesUserForm.F_EnabledMark == 1) {
        this.$message({
          message:this.$t('orgUserManagement.Hint.userEnabled'),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t('orgUserManagement.Hint.whetherEnable'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText: this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      }).then(() => {
        this.switchUser("enable");
      });
    },
    disableUser() {
      if (
        !this.companiesUserForm.F_UserId ||
        this.companiesUserForm.F_UserId === ""
      ) {
        this.$message({
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning",
        });
        return;
      }
      if (this.companiesUserForm.F_EnabledMark == 0) {
        this.$message({
          message:this.$t('orgUserManagement.Hint.userDisabled'),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t('orgUserManagement.Hint.whetherDisabled'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      }).then(() => {
        this.switchUser("disable");
      });
    },
    switchUser(val) {
      switchUser(this.companiesUserForm.F_UserId).then((res) => {
        this.showNotify(res, val === "enable" ? this.$t('deletePrompt.Enable'):this.$t('deletePrompt.Disable'));
      });
    },
    /* 重置密码 */
    resetPassword() {
      if (
        !this.companiesUserForm.F_UserId ||
        this.companiesUserForm.F_UserId === ""
      ) {
        this.$message({
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t('orgUserManagement.Hint.whetherResetPassword'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning",
      }).then(() => {
        resetPassword(this.companiesUserForm.F_UserId).then((res) => {
          this.showNotify(res, this.$t('orgUserManagement.Hint.resetPassword'));
        });
      });
    },
    setAuthorize() {
      if (this.objectId === "") {
        this.$message({
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning",
        });
        return;
      }
      this.authorizeVisible = true;
    },
    closeAuthorizeDialog() {
      this.authorizeVisible = false;
    },
    authorizeChange(data) {
      this.authorizeChangeData = data;
    },
    searchUser() {
      this.getUser();
    },
    searchReset() {
      this.searchParam.Keyword = null;
      this.searchParam.Department_Id = null;
      this.page.currentPage = 1;
      this.getUser();
    },
    sortChange() {
      this.getUser();
    },
    onPageLoad() {
      this.getUser();
    },
    confirmAuthorizeDialog() {
      this.flagUserFunc = true;
      let obj = this.$refs.authorizeTreeRef.allCheckChange();
      postAuthorizes(this.objectId, this.objectType, obj).then((res) => {
        if (this.showNotify(res, this.$t('orgUserManagement.Hint.setAuthorization'))) {
          this.closeAuthorizeDialog();
        }
      }).finally(() => {
        this.flagUserFunc = false;
      });
    },
    showNotify(res, msg) {
      if (res.data.success) {
        this.getUser();
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: msg + this.$t('workFlow.WFMenu.hintSuccess'),
          type: "success",
        });
        return true;
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: msg + ":" + res.data.msg + "！",
          type: "warning",
        });
        return false;
      }
    },
    async treeLoad(node, resolve) {
      try {
        const id = node.data.F_DepartmentId || '0'
        let res = await getLowerDepartment(this.companyId, id)
        if (res.data.success) {
          if (node.data.F_DepartmentId) {
            resolve(this.formateParentTree(res.data.data))
          } else {
            let arr =[]
            if (this.isFocus) {
              this.allDepartmentsList = this.formateParentTree(res.data.data)
            } else {
              this.treeNode = node
              this.treeResolve = resolve
              if (!!this.companiesUserForm.F_DepartmentId) {
                this.companiesUserForm.F_DepartmentId.map((item, i) => {              
                  const length = this.companiesUserForm.F_DepartmentId.length
                  const F_DepartmentName = this.companiesUserForm.F_DepartmentName
                  arr.push({
                    'F_DepartmentId': item,
                    'F_FullName':length > 1 ? F_DepartmentName.split(',')[i] : F_DepartmentName
                  })
                })
                this.allDepartmentsList = this.formateParentTree(arr)
              }
            }
          }
        }
      } catch (error) {}
    },
    iptTreeFocus() {
      if (!this.isFocus) this.treeLoad(this.treeNode, this.treeResolve)
      this.isFocus = true
    },
    openAppAuthorizeDialog() {
      if (this.objectId === "") {
        this.$message({
          message: this.$t("deletePrompt.hintSelectData"),
          type: "warning"
        });
        return;
      }
	    this.appAuthorizeVisible = true;   
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
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.manager-box {
  display: flex;
}
div /deep/ .el-form div:nth-child(odd) .el-form-item .el-form-item__label{
  text-align: right;
}
.authorizedialog /deep/.el-dialog {
    height: calc(100% - 18vh);
    margin-bottom: 0;
}
.authorizedialog /deep/.el-dialog__body{
	height: calc(100% - 114px);
}
@media screen and (max-width: 1123px) {
	   /deep/ .avue-crud__left{
		margin-left:5px!important;
		float: left;
		margin-top: 40px;
	   } 
	}	 
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px!important;
} 
 .upload-box{
	 margin-right: 0px;
 }
</style>
