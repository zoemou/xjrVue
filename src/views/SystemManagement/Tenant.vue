<template>
  <div class="main-container" style="height: 100%; padding: 0 10px;">
    <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input v-model="searchParam.keyword" size="small" placeholder="请输入要查询的关键字" style="width: 200px; margin-right: 10px"></el-input>
          <el-select v-model="searchParam.enabledMark" placeholder="请选择状态" style="width: 200px; margin-right: 10px">
            <el-option label="启用" value="1" key="1"></el-option>
            <el-option label="停用" value="0" key="0"></el-option>
            <el-option label="所有状态" value key></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">重置</el-button>
        </div>
      </div>
      <div slot="table">
        <avue-crud ref="cuTable" :data="tableData" :option="option" stripe :page.sync="page" @row-click="tenantRow">
          <template slot="menuLeft">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openForm">新增租户</el-button>
            <el-button icon="el-icon-setting" size="small" @click="openUser">管理员配置</el-button>
            <el-button icon="el-icon-document-checked" size="small" @click="setAuthorize">功能授权</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="primary" size="mini" @click="editForm(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="updateForm(scope.row)">{{scope.row.F_EnabledMark==1?'禁用':'启用'}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">    
        <el-form :rules="rules" ref="dataForm" :model="dataForm" label-width="94px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_CompanyName" label="企业名称">
                <el-input placeholder="请填写企业名称" size="small" v-model="dataForm.F_CompanyName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_Email" label="邮箱">
                <el-input placeholder="请填写邮箱" size="small" v-model="dataForm.F_Email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_Mobile" label="手机号码">
                <el-input placeholder="请填写手机号码" size="small" v-model="dataForm.F_Mobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_StartTime" label="租用开始时间">
                <el-date-picker v-model="dataForm.F_StartTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" size="small" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_EndTime" label="租用结束时间">
                <el-date-picker v-model="dataForm.F_EndTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" size="small" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flag">
            <el-col :span="24">
              <el-form-item label="库类型">
                <el-select v-model="dataForm.F_DbType" placeholder="请选择库类型" size="small" style="width: 100%">
                  <el-option v-for="item in dataBaseType" :key="item.F_ItemId" :label="item.F_ItemName" :value="item.F_ItemValue"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flag">
            <el-col :span="24">
              <el-form-item label="连接字符串">
                <el-input type="textarea" placeholder="请填写连接字符串" size="small" v-model="dataForm.F_ConnectionString"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm('dataForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="formSubmit('dataForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="userDialogTitle" :append-to-body="true" :visible.sync="userDialogVisible" width="40%" :before-close="userHndleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">
        <el-form :rules="userRules" ref="userDataForm" :model="userDataForm" label-width="82px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_RealName" label="管理员名称" >
                <el-input :disabled="!userFlag" placeholder="请填写管理员名称" size="small" v-model="userDataForm.F_RealName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_Account" label="管理员账号">
                <el-input :disabled="!userFlag" placeholder="请填写管理员账号" size="small" v-model="userDataForm.F_Account"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="F_Password" label="管理员密码">
                <el-input type="password" placeholder="请填写管理员密码" size="small" v-model="userDataForm.F_Password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>          
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="userCancelForm('userDataForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="userFormSubmit('userDataForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="openUserTitle" :append-to-body="true" :visible.sync="openUserDialog" width="40%" :before-close="userClose" style="padding: 10px 20px;">
      <div class="table">
        <avue-crud :data="userTableData" :option="userOption" @row-click="currentRow">
            <template slot="menuLeft">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addUser">新增</el-button>                  
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="primary" size="mini" @click="editUser(scope.row)">修改密码</el-button>
              <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
            </template>                
        </avue-crud>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="authorizeTitle" :append-to-body="true" top="1vh" :visible.sync="authorizeVisible" width="80%" :before-close="closeAuthorizeDialog" >
      <authorize-select-tree ref="authorizeTreeRef" v-if="authorizeVisible" :objectType="objectType" :objectId="objectId" ></authorize-select-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAuthorizeDialog" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import AuthorizeSelectTree from "@/components/AuthorizeTree/AuthorizeSelectTree";
import AuthorizeSelectTree from "@/views/Organization/components/AuthorizeSelectTree";
import MainContent from '@/page/main/MainContent';
import { getTenant, addTenant, modifyTenant, deleteTenant, userIsExit, updateTenantStatus,
         getUserInfoById, addTenantUser, modifyTenantUser, deleteTenantUser} from '@/api/systemManagement/tenant';
import { getDataDetail } from '@/api/system/dataitem';
import { postAuthorizes } from "@/api/organization/index";
export default {
  name: 'Tenant',
  components: { MainContent, AuthorizeSelectTree },
  data () {
    return {
      flag: false,
      contentTitle: '租户管理',
      activeName: 'first',
      dialogVisible: false,      
      dialogTitle: '',
      dataForm: {}, 
      tableData: [],
      dataBaseType: [],
      searchParam: { limit: 1, size: 20, keyword: null, enabledMark: null, order: null, orderfield: null },
      page: { pageSize: 20, total: 0, currentPage: 1 },
      option: {
        highlightCurrentRow: true,
        stripe: true,        
        menuWidth: 150,
        maxHeight: 550,
        border: true,
        page: true,
        index: true,
        indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        addBtn: false,
        column: [{ label: '企业名称', prop: 'F_CompanyName' },
          { label: '邮箱', prop: 'F_Email' },
          { label: '手机号码', prop: 'F_Mobile' },
          { label: '库类型', prop: 'F_DbType' },
          { label: '连接字符串', prop: 'F_ConnectionString'},
          { label: '租用开始时间', prop: 'F_StartTime' },
          { label: '租用到期时间', prop: 'F_EndTime' },
          { label : '租户码', prop : 'F_Code'},
          { label : '接口秘钥', prop : 'F_AppSecret'}
          ]
      },   
      index: null,
      userFlag: false,
      userDialogVisible: false,
      userDialogTitle: '',
      userDataForm: {}, 
      userTableData: [], 
      userOption: {
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 200,
        maxHeight: 350,
        border: true,
        page: false,
        index: true,
        indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [{ label: '管理员名称', prop: 'F_RealName' },
          { label: '账号', prop: 'F_Account' },
          /* { label: '密码', prop: 'F_Password' } */]
      },   
      rules: {
        F_CompanyName: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
        F_Email: [{ required: true, message: '请填写邮箱', trigger: 'blur' }, {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'], },],
        F_Mobile: [{ required: true, message: '请填写手机号码', trigger: 'blur' }, { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入正确的手机号码或者座机号', },],
        F_StartTime: [{ required: true, message: '请填写租用开始时间', trigger: 'blur' }],
        F_EndTime: [{ required: true, message: '请填写租用到期时间', trigger: 'blur' }],
        /* F_DbType: [{ required: true, message: '请填写库类型', trigger: 'change' }],
        F_ConnectionString: [{ required: true, message: '请填写连接字符串', trigger: 'blur' }],*/
      },      
      userRules: {
        F_Account: [{ required: true, message: '请填写管理员账号', trigger: 'blur' }],
        F_Password: [{ required: true, message: '请填写管理员密码', trigger: 'blur' }],
        F_RealName: [{ required: true, message: '请填写管理员名称', trigger: 'blur' }],
      }, 
      openUserDialog: false, openUserTitle: '管理员配置', tenantId: null, tenantCode: null,
      authorizeTitle: '功能授权', authorizeVisible: false, objectId: "", objectType: 3,
    };
  },
  created () {
    this.getData();
    getDataDetail('DbVersion').then(res => {
      this.dataBaseType = res.data.data;
    });
  },
  methods: {
    /* 获取数据 */
    getData () {
      getTenant(this.searchParam).then(res => {
        this.tableData = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });
    },
    getUserData(){
      getUserInfoById(this.tenantId, this.tenantCode).then(res =>{
        this.userTableData = res.data.data;
      });
    },
    currentRow(row){      
      this.userDataForm = {...row};      
      this.index = row.$index;
    },
    tenantRow(row){
      this.tenantId = row.F_Id;
      this.tenantCode = row.F_Code;
    },
    /* 新增 */
    openForm () {
      this.flag = true;
      this.dataForm = {};
      this.userDataForm = {};
      this.dialogVisible = true;
      this.dialogTitle = '新增';
    },
    openUser(){
      if(this.tenantId){
        this.openUserDialog = true;  
        this.getUserData();      
      }else{
        this.$message({ message: '请选中一条数据！', type: 'warning' });
        return;
      }
    },
    setAuthorize(){
      if(this.tenantId){
        this.authorizeVisible = true;  
        this.objectId = this.tenantId;
      }else{
        this.$message({ message: '请选中一条数据！', type: 'warning' });
        return;
      }
    },
    closeAuthorizeDialog() {
      this.authorizeVisible = false;
    },
    confirmAuthorizeDialog() {
      let obj = this.$refs.authorizeTreeRef.allCheckChange();      
      postAuthorizes(this.objectId, this.objectType, obj).then((res) => {
        if(res.data.success){
          this.$notify({ title: '成功', message: res.data.msg, type: 'success' });
        }else{
          this.$notify({ title: '失败', message: res.data.msg, type: 'warning' });
        }
        this.authorizeVisible = false;
      });
    },
    addUser(){
      this.userFlag = true;
      this.userDataForm = {};
      this.userDialogVisible = true;
      this.userDialogTitle = '新增';
    },
    /* 编辑 */
    editForm (row) {
      this.flag = false;
      this.dialogVisible = true;
      this.dialogTitle = '编辑';
      this.dataForm = row;            
    },
    editUser (row) {
      this.userFlag = false;
      this.userDialogVisible = true;
      this.userDialogTitle = '编辑';   
      this.userDataForm = row;
      this.userDataForm.F_Password = "******"
    },
    /* 禁用 启用 */
    updateForm (row) {  
      if(row.F_EnabledMark == 0){    
        this.$confirm('确定要启用吗？', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {        
          updateTenantStatus(row.F_Id, 1).then(() => {
            this.getData();
            this.$notify({ title: '成功', message: '启用成功', type: 'success' });
          });        
        }).catch(() => {
          this.$notify({ title: '失败', message: '启用失败', type: 'warning' });
        });
      }else{
        this.$confirm('确定要禁用吗？', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {         
          updateTenantStatus(row.F_Id, 0).then(() => {
            this.getData();
            this.$notify({ title: '成功', message: '禁用成功', type: 'success' });
          });        
        }).catch(() => {
          this.$notify({ title: '失败', message: '禁用失败', type: 'warning' });
        });
      }
    },
    deleteUser(row){
      if (this.index === null || this.userTableData.length == 0) {
        this.$message({ message: '请选中一条数据！', type: 'warning' });
        return;
      }
      this.$confirm('确定要删除此项吗？', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {    
        deleteTenantUser(row.F_UserId).then(res =>{
          this.getUserData();
          this.$notify({ title: '成功', message: '删除成功', type: 'success' });
        })
      }).catch(() => {
        this.$notify({ title: '失败', message: '删除失败', type: 'warning' });
      });
    },
    /* 提交表单 */
    formSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.flag) {
            addTenant(this.dataForm).then(() => {
              this.dialogVisible = false;
              this.getData();
            });
          } else {
            modifyTenant(this.dataForm.F_Id, this.dataForm).then(() => {
              this.dialogVisible = false;
              this.getData();
            });
          }
        } else {
          return false;
        }
      });
    },
    userFormSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userFlag) {
            userIsExit(this.userDataForm.F_Account).then(res =>{
              if(!res.data.success){
                this.$message({ message: this.userDataForm.F_Account+' 账户已存在！', type: 'warning' });
              }else{
                this.userDataForm.F_TenantId = this.tenantId;
                this.userDataForm.F_TenantCode = this.tenantCode;
                addTenantUser(this.userDataForm).then(() => {
                  this.userDialogVisible = false;
                  this.getUserData();
                });
              }
            })  
          }else{
            if(this.userDataForm.F_Password === "******"){
              return; //代表没有修改密码
            }

            modifyTenantUser(this.userDataForm.F_UserId, this.userDataForm.F_Password).then(() => {
              this.userDialogVisible = false;
              this.getUserData();
            });            
          }
        }else{
          return false;
        }
      });
    },
    /* 取消弹窗 */
    cancelForm (formName) {
      this.dialogVisible = false;
    },
    userCancelForm (formName) {
      this.userDialogVisible = false;
    },
    /* 关闭弹窗 */
    handleClose (done) {
      this.dialogVisible = false;
    },   
    userHandleClose (done) {
      this.userDialogVisible = false;
    },   
    /* 查询 */
    searchData () {
      this.getData();
    },
    /* 查询表单重置 */
    searchReset () {
      this.searchParam.keyword = null;
      this.getData();
    },
    sortChange (data) {
      this.searchParam.order = getOrder(data.order);
      this.searchParam.orderfield = data.prop;
      this.getData();
    },    
  }
};
</script>