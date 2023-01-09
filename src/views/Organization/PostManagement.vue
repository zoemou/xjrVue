<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle" :resize="true">
      <div slot="list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="F_CompanyId"
          ref="cTree"
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
    <main-content :title="contentTitle" :paddingLeft="205" padding-top="94">
      <div slot="search">
        <div class="search-box">
          <el-input
            v-model="searchParam.keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right:5px"
          ></el-input>
          <avue-input-tree
            default-expand-all
            v-model="searchParam.Department_Id"
            :placeholder="$t('orgUserManagement.searchSelectPart')"
            type="tree"
            :dic="companiesDepartments"
            size="small"
            style="width: 200px; margin-right:5px"
          ></avue-input-tree>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchPosts"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud
          ref="cuTable"
          v-if="companyId"
          :data="postsList"
          :option="option"
          :showColumn="showColumn"
          :isSaveColumns="true"
          @tree-load="treeLoad"
          @row-click="handleCurrentRowChange"
          @row-dblclick="handleRowDBLClick"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              v-if="hasButtonPermission('add')"
              @click="showFormDialog('add')"
              >{{$t('buttonModule.addBtn')}}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('addmember')"
              @click="addMember"
              >{{$t('orgRoleManagement.addMemberBtn')}}</el-button
            >
            <el-button
              
              size="small"
              v-if="hasButtonPermission('lookmember')"
              @click="lookUser"
              >{{$t('orgRoleManagement.viewMemberBtn')}}</el-button
            >
            <OrgImport type="post"></OrgImport>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              v-if="hasButtonPermission('modify')"
              @click="showFormDialog('edit', scope.row)"
              
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              v-if="hasButtonPermission('delete')"
              @click="deleteRowDepartment(scope.row)"
               
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>
    <!-- 新增 -->
    <el-dialog v-dialogDrag
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
    >
      <div class="companiesuser-form custom-form">
        <el-form
          :rules="rules"
          ref="postsForm"
          :model="postsForm"
          label-width="80px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24" v-show="hasFormPermission('F_EnCode')">
            <el-form-item prop="F_EnCode" :label="$t('orgPostManagement.addModal.labelPostNum')">
              <el-input
                :placeholder="$t('orgPostManagement.addModal.placeholderPostNum')"
                size="small"
                v-model="postsForm.F_EnCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_Name')">
            <el-form-item prop="F_Name" :label="$t('orgPostManagement.addModal.labelPostName')">
              <el-input
                :placeholder="$t('orgPostManagement.addModal.placeholderPostName')"
                size="small"
                v-model="postsForm.F_Name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_DepartmentId')">
            <el-form-item prop="F_DepartmentId" :label="$t('orgPostManagement.addModal.labelDepartID')">
              <avue-input-tree
                v-model="postsForm.F_DepartmentId"
                :placeholder="$t('orgPostManagement.addModal.placeholderDepartID')"
                type="tree"
                :dic="companiesDepartmentsDialog"
                size="small"
                :tree-load="treeLoadDepartment" 
                lazy
                style="width: 100%"
                @focus="departmentFocus"
              ></avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_ParentId')">
            <el-form-item :label="$t('orgPostManagement.addModal.labelParentId')" prop="F_ParentId">
              <avue-input-tree
                :props="defaultPostProps"
                v-model="postsForm.F_ParentId"
                :placeholder="$t('orgPostManagement.addModal.placeholderParentId')"
                type="tree"
                :dic="allPostList"
                :tree-load="treeLoadPost"
                lazy
                @focus="postFocus"
                size="small"
              ></avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="hasFormPermission('F_Description')">
            <el-form-item :label="$t('orgPostManagement.addModal.labelRemark')">
              <el-input
                type="textarea"
                :placeholder="$t('orgPostManagement.addModal.placeholderRemark')"
                size="small"
                :autosize="{ minRows: 4, maxRows: 10 }"
                maxlength="800"
                show-word-limit
                v-model="postsForm.F_Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelForm('postsForm')"
          >{{$t('buttonModule.modalCancelBtn')}}</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="postsFormSubmit('postsForm')"
          :loading="flagFormSub"
          >{{flagFormSub?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加成员 -->
    <el-dialog v-dialogDrag
      :title="$t('orgPostManagement.addMemberTitle')"
      :append-to-body="true"
      :visible.sync="memberDialogVisible"
      :close-on-click-modal="false"
      width="60%"
      style="padding: 10px 20px;"
    >
      <SelectUser
        v-if="memberDialogVisible"
        ref="addPesonelRef"
        :selectedList="selectedList"
        :parentCompany="{'F_CompanyId':companyId}"
        :sourceName="'PostManagement'"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirmMemberDialog()" :loading="flagMember"
          >{{flagMember?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag
      :title="$t('orgPostManagement.viewMemberTitle')"
      :append-to-body="true"
      :visible.sync="lookUserDialog"
      width="60%"
      :before-close="luDClose"
      :close-on-click-modal="false"
    >
      <List
        v-if="lookUserDialog"
        type="user"
        :list="userList"
        @clickSelected="getSelectUser"
      ></List>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import MainContent from "@/page/main/MainContent";
import List from "@/components/organization/components/List";
import { FormatTree,formValidateNotice,deepClone } from "@/util/util.js";
import SelectUser from "@/components/organization/SelectUser";
import OrgImport from "./components/OrgImport.vue";
import { getCompaniesDepartments } from "@/api/organization/user";
import {
  getPosts,
  addPosts,
  modifyPosts,
  deletePosts,
  lookUser,
  addUser,
  getLowerPost,
  getFirstPost
} from "@/api/organization/post";
import { getLowerCompanies } from "@/api/organization/company";
import { getLowerDepartment } from '@/api/organization/department';
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import { getStore } from "@/util/store";
import {validateLength} from "@/api/organization/validateFunc";
export default {
  name: "PostManagement",
  mixins: [authorizeMixin,tableOptionMixin,displayColumnsMixin],
  components: { MainContent, MainFixed, List, SelectUser,OrgImport },
  data() {
    return {
      flagFormSub: false,
      flagMember: false,
      fixedTitle:this.$t('orgPostManagement.fixedTitle'),
      contentTitle: "岗位列表",
      memberDialogVisible: false,
      companiesTree: [],
      // companiesTreeDialog: [],
      companiesDepartments: [],
      companiesDepartmentsDialog:[],
      postsList: [],
      userList: [],
      selectedList: [],
      allPostList: [],
      flag: false,
      postsId: "",
      postsForm: {
        F_CompanyId: "",
        F_EnCode: "",
        F_Name: "",
        F_DepartmentId: "",
        F_ParentId: "",
        F_Description: "",
        F_DepartmentName: ""
      },
      companyId: "",
      searchParam: {
        keyword: null,
        Department_Id: ""
      },
      defaultProps: {
        children: "children",
        label: "F_FullName"
      },
      defaultPostProps: {
        value: "F_PostId",
        label: "F_Name",
        children: "children"
      },
      dialogTitle: "",
      dialogVisible: false,
      dialogType: "add",
      parentVisible: false,
      lookUserDialog: false,
      option: {
        rowKey: "F_PostId",
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: false,
        index: true,
        indexLabel:this.$t('orgPostManagement.tabNum'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        lazy:true,
        column: [
          {
            label:  this.$t('orgPostManagement.tabName'),
            prop: "F_Name",
            align: "left",
			sortable:true
          },
          {
            label:  this.$t('orgPostManagement.tabEnCode'),
            prop: "F_EnCode",
			 align: 'left',
			 sortable:true
          },
          {
            label:  this.$t('orgPostManagement.tabDepartID'),
            prop: "F_DepartmentName",
			 align: 'left',
			 sortable:true
          },
          {
            label:this.$t('orgPostManagement.tabRemark'),
            prop: "F_Description",
			align:'left',
			sortable:true
          },
          {
            label:this.$t('orgPostManagement.tabManager'),
            prop: "F_Manager",
			 align: 'left',
			 sortable:true
          }
        ]
      },
      rules: {
        F_EnCode: [
          { required: true, message:this.$t('orgPostManagement.addModal.placeholderPostNum'), trigger: "blur" },
          { validator:validateLength,trigger:"change"}
        ],
        F_Name: [
          { required: true, message:this.$t('orgPostManagement.addModal.placeholderPostName'), trigger: "blur" },
          { validator:validateLength,trigger:"change"}
        ],
        F_DepartmentId: [
          { required: true, message: this.$t('orgPostManagement.addModal.placeholderDepartID'), trigger: "change" }
        ]
      },
      F_DepartmentId: '',
      maps: new Map(),
      parentId: "",//修改刷新页面使用
      departmentIdObj: {}, //存储岗位部门id对应关系
      isDepartmentFocus: false,
      isPostFocus:false,
      departmentNode: '',
      departmentResolve: '',
      postNode: '',
      departmentNode:''
    };
  },
  created() {
  },
  mounted(){
	  let themeName = getStore({ name: "themeName" }) || "default";
	  if((themeName == "eveningTheme" && window.screen.width<1346)||(themeName != "eveningTheme" &&window.screen.width<1346)){
	    this.computedHeight =32;
	  }
	  this.changeBodyHeight();
  },
  methods: {
    handleRowDBLClick (row, event) {
      if(this.hasButtonPermission('modify')&&this.openDoubleClickEdit){
        this.showFormDialog('edit', row)
      }
    },
    formateParentTree(data) {
      let list = [];
      data.forEach(item => {
        let temp = {
          F_PostId: "",
          F_Name: this.$t('orgUserManagement.addModal.placeholderSelect'),
          disabled: false,
          leaf:false
        };
        temp.F_PostId = item.F_PostId;
        temp.F_Name = item.F_Name;
        if (
          this.postsForm.F_PostId &&
          this.postsForm.F_PostId == item.F_PostId
        ) {
          temp.disabled = true; //将正在编辑的部门disabled
          temp.leaf = true
        }
        list.push(temp);
      });
      return list;
    },
    async loadNode(node, resolve) {
      try {
        const companyId = node.data.F_CompanyId || '0'
        if (companyId === '0') {
          let res = await getLowerCompanies(companyId);
          if (res.data.success) {
            this.companiesTree = res.data.data
            if (this.companiesTree.length > 0) {
              this.companyId = res.data.data[0].F_CompanyId;  
              this.$nextTick(function () {
                this.$refs.cTree.setCurrentKey(this.companyId);
                this.treeLoad(node.data)
              })
              this.getDep(this.companyId);                            
            }
          }

        } else {
          const departmentId = node.data.F_DepartmentId || '0'
          if (node.data.unGetLowerCompanies) {
            let res = await getLowerDepartment(companyId,departmentId)
            if (res.data.success) {
              res.data.data.map(item => {
                item['unGetLowerCompanies'] = true
              })
            }
            resolve(res.data.data)
          } else {
            let [res1, res2] = await Promise.all([getLowerDepartment(companyId, departmentId), getLowerCompanies(companyId)])
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
    async getFirstPost(list) {
      const res = await getFirstPost(this.companyId)
      if (res.data.success) {       
        if (list === 'all') {
          res.data.data.forEach(item => {
            this.departmentIdObj[item.F_PostId] = item.F_DepartmentId
          })
          const selectTxt = { F_PostId: "0", F_Name: this.$t('orgUserManagement.addModal.placeholderSelect'),disabled:false,leaf:true }
          this.allPostList = [selectTxt, ...this.formateParentTree(res.data.data)];
        } else if (list === 'postList') {
          res.data.data.map(item => {
            item['hasChildren'] = true
          })
          this.postsList = res.data.data
        }
      }
    },
    async treeLoad(tree, treeNode, resolve,type) {
      try {
        const leftCurrentNode = this.$refs.cTree.getCurrentNode()
        if (!leftCurrentNode.F_DepartmentId && !(tree && tree.F_PostId)) {
          this.getFirstPost('postList')
        } else {
          if (type === 'add' && leftCurrentNode.F_DepartmentId && this.postsForm.F_DepartmentId !== leftCurrentNode.F_DepartmentId) {
              return              
          }
          const postId = tree && tree.F_PostId ? tree.F_PostId : 0
          const departmentId = tree && tree.F_DepartmentId ? tree.F_DepartmentId : (this.F_DepartmentId || this.postsForm.F_DepartmentId)
          let res = await getLowerPost(departmentId, postId);
          if (postId !==0) this.maps.set(tree.F_PostId, { tree, treeNode, resolve }) // 将当前选中节点数据存储到maps中            
          if (res.data.success) {
            res.data.data.map(item => {
              item['hasChildren'] = true
            })
            if (postId) {
              resolve(res.data.data)
            } else {
              this.postsList = res.data.data;
            }
          }
        }
      } catch (error) { }
    },
    async treeLoadDepartment(node, resolve) {
      try {
        const id = node && node.data.value ? node.data.value : '0'
        let res = await getLowerDepartment(this.companyId, id);
        if (res.data.success) {
          let list = FormatTree(
            res.data.data,
            "F_DepartmentId",
            "F_FullName",
          );
          if (id !== '0') {
            resolve(list)
          } else {
            if (this.isDepartmentFocus) {
              this.companiesDepartmentsDialog = list       
            } else {
              let deparmentArr = []
              this.departmentNode = node
              this.departmentResolve = resolve
              if (!!this.postsForm.F_DepartmentId) {
                deparmentArr.push({
                  'F_DepartmentId': this.postsForm.F_DepartmentId,
                  'F_FullName':this.postsForm.F_DepartmentName
                })
              }
              this.companiesDepartmentsDialog = FormatTree(
                                                    deparmentArr,
                                                    "F_DepartmentId",
                                                    "F_FullName",
                                                  )
              
            }
          }
        }
      } catch (error) {
      }
    },
    async treeLoadPost(node, resolve) {
      try {
        if (!node || (node.data[0] && node.data[0].F_Name === this.$t('orgUserManagement.addModal.placeholderSelect'))) {         
          if (this.isPostFocus) {
            this.getFirstPost('all')    
          } else {
            let postArr = []
            this.postNode = node
            this.postResolve = resolve
            if (!!this.postsForm.F_PosttId) {
              postArr.push({
                'F_PostId': this.postsForm.F_PostId,
                'F_Name':this.postsForm.F_Name
              })
            }
            this.allPostList = this.formateParentTree(postArr)
          }
        } else {
          if (node.data && node.data.F_Name === this.$t('orgUserManagement.addModal.placeholderSelect')) return resolve([])
          const postId = node.data.F_PostId || 0
          const departmentId = node.data.F_DepartmentId || this.F_DepartmentId || this.departmentIdObj[postId]
          if(!departmentId) return resolve([])
          let res = await getLowerPost(departmentId, postId);
          if (res.data.success) {
            res.data.data.forEach(item => {
              this.departmentIdObj[item.F_PostId] = item.F_DepartmentId
            })
            resolve(this.formateParentTree(res.data.data))
          }
        }
      } catch (error) {}
    },
    departmentFocus() {
      if (!this.isDepartmentFocus) this.treeLoadDepartment()
      this.isDepartmentFocus = true
    },
    postFocus() {
      if (!this.isPostFocus) {
        this.isPostFocus = true
        this.treeLoadPost()
      }
    },
    /* 选择树形菜单加载公司用户信息 */
    handleNodeClick(data) {
      this.postsId = "";
      this.searchParam.keyword = null;
      this.searchParam.Department_Id = data.F_DepartmentId;
	  this.F_DepartmentId= data.F_DepartmentId;
      this.companyId = data.F_CompanyId;
      this.getDep(data.F_CompanyId);
      this.treeLoad(data)
    },
    getPostsList() {
      getPosts(this.companyId, this.searchParam).then(res => {
        this.postsList = res.data.data;
      });
    },
    /* 获取公司部门 */
    getDep(id) {
      getCompaniesDepartments(id).then(res => {
        let tree = FormatTree(
          res.data.data,
          "F_DepartmentId",
          "F_FullName",
          "children"
        );
        this.companiesDepartments = tree;
      });
    },
    /* 打开弹窗 */
    showFormDialog(type, row = {}) {
      this.dialogType = type;
      this.dialogVisible = true;
      this.treeLoadDepartment()
      this.treeLoadPost()
      if (type == "add") {
        this.dialogTitle = this.$t('orgPostManagement.addModal.modalTitle');
        this.postsForm = {F_DepartmentId:this.F_DepartmentId};
      } else {
        this.dialogTitle =  this.$t('orgPostManagement.editInforTitle');
        this.postsForm = deepClone(row);
        this.parentId = row.F_ParentId
      }
    },
    /* 提交表单 */
    postsFormSubmit(formName) {
      this.flagFormSub = true;
      this.$refs[formName].validate((valid,object) => {
        if (valid) {
          if (this.dialogType == "add") {
            this.postsForm.F_CompanyId = this.companyId;
            addPosts(this.postsForm).then((res) => {             
							if(res.data.success){
								this.dialogVisible = false;
								// this.getPostsList();
								this.$notify({
								  title: this.$t("deletePrompt.promptTitle"),
								  message: this.$t("newPostSuccess"),
								  type: "success"
                });
                this.updateTable(this.postsForm.F_ParentId || '0','add')
							}else{
								this.$notify({
								  title: this.$t("deletePrompt.promptTitle"),
								  message: this.$t("newPostFailed"),
								  type: "warning"
								});
							}
            }).finally(()=>{
              this.flagFormSub = false;
            });
          } else {
            modifyPosts(this.postsForm.F_PostId, this.postsForm).then((res) => {
							if(res.data.success){
								this.dialogVisible = false;
								// this.getPostsList();
								this.$notify({
								  title: this.$t("deletePrompt.promptTitle"),
								  message: this.$t("modifiedPostSuccessfully"),
								  type: "success"
                });
                if (this.postsForm.F_ParentId !== this.parentId) this.updateTable(this.parentId,'edit')
                this.updateTable(this.postsForm.F_ParentId || '0','edit')
							}else{
								this.$notify({
								  title: this.$t("deletePrompt.promptTitle"),
								  message: this.$t("failedModifyPost"),
								  type: "warning"
								});
							}
              
            }).finally(()=>{
              this.flagFormSub = false;
            });
          }
        } else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagFormSub = false;
          return false;
        }
      });
    },
    /* 取消弹窗 */
    cancelForm(formName) {
      this.flagFormSub = false;
      this.dialogVisible = false;
      this.$refs[formName].clearValidate();
    },
    /* 关闭弹窗 */
    handleClose(done) {
      this.$refs['postsForm'].resetFields();
      this.companiesDepartmentsDialog = []
      this.isDepartmentFocus = false
      this.isPostFocus = false
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
      this.postsId = val.F_PostId;
      // this.postsForm = deepClone(val);
    },
    /* 表格删除 */
    deleteRowDepartment(row) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          deletePosts(row.F_PostId).then((res) => {
						if(res.data.success){
							this.$notify({
							  title: this.$t('deletePrompt.promptTitle'),
							  message: this.$t('succeededDeletingPost'),
							  type: "success"
              });
              this.updateTable(row.F_ParentId,'delete')
						}else{
							this.$notify({
							  title: this.$t("deletePrompt.promptTitle"),
							  message: this.$t("failedDeletePost"),
							  type: "warning"
							});
						}
            
          });
        })
        .catch(() => {});
    },
    selectPosts(data) {
      this.postsForm.F_ParentId = data.F_PostId;
      this.postsForm.F_ParentName = data.F_Post;
    },
    cancelPosts() {
      this.parentVisible = false;
    },
    /* 查看成员 */
    lookUser() {
      if (this.postsId === "") {
        this.$message({
          message: this.$t('deletePrompt.hintSelectData'),
          type: "warning"
        });
      } else {
        lookUser(this.postsId).then(res => {
          this.userList = res.data.data;
          this.lookUserDialog = true;
        });
      }
    },
    luDClose() {
      this.lookUserDialog = false;
    },
    getSelectUser(index) {},
    /* 查询 */
    searchPosts() {
      this.getPostsList();
    },
    /* 查询表单重置 */
    searchReset() {
      this.searchParam.keyword = null;
      this.searchParam.Department_Id = null;
      this.treeLoad()
    },

    addMember() {
      if (this.postsId === "") {
        this.$message({
          message:this.$t('deletePrompt.hintSelectData'),
          type: "warning"
        });
      } else {
        lookUser(this.postsId).then(res => {
          this.selectedList = res.data.data;
          this.memberDialogVisible = true;
        });
      }
    },
    cancelMemberDialog() {
      this.flagMember = false;
      this.memberDialogVisible = false;
    },
    confirmMemberDialog() {
      this.flagMember = true;
      let userIds = this.$refs.addPesonelRef.pushParentData().map(ele => {
        return ele.F_UserId;
      });
      // if (userIds.length <= 0) {
      //   return false;
      // }
      let params = { userIds: userIds, postId: this.postsId };
      addUser(params).then(res => {
        if (res.data.success) {
          this.$notify({
            title:this.$t('deletePrompt.successTitle'),
            message:this.$t('orgRoleManagement.Hint.addSuccess'),
            type: "success"
          });
        } else {
          this.$notify({
            title: this.$t('deletePrompt.failureTitle'),
            message:this.$t('orgRoleManagement.Hint.addFailed'),
            type: "warning"
          });
        }
        this.cancelMemberDialog();
      });
    },
    updateTable(id,type) { // 在删除或者添加操作成功之后，调用此函数
      if (id === '0') {
        this.treeLoad(null,null,null,type)
        return
      }
      if (!this.maps.has(id)) {
        if (!this.$refs.cTree.getCurrentNode().F_DepartmentId) {
          this.getFirstPost('postList')
        }
      } else {
        const { tree, treeNode, resolve} = this.maps.get(id)
        this.$set(this.$refs.cuTable.$refs.table.store.states.lazyTreeNodeMap, id, [])
        this.treeLoad(tree, treeNode, resolve,type)
      } 
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
.parentPosts {
  width: 100%;
  height: 420px;
  display: flex;
}
.parentPosts .tree,
.parentPosts .list {
  height: 100%;
  overflow-y: scroll;
}
.parentPosts .list {
  flex: 1;
}
/* .parentPosts {
  width: 100%;
  height: 420px;
}
.parentPosts .tree {
  float: left;
  width: 50%;
  height: 100%;
  overflow-y: scroll;
}
.parentPosts .list {
  float: right;
  width: 50%;
  height: 100%;
  overflow-y: scroll;
} */

@media screen and (max-width: 1370px) {
  div /deep/.el-dialog {
    margin-top: 8vh !important;
  }
}
  div /deep/ .custom-tree-node span{
  	font-size: 14px;
  	padding-left: 10px;
  }
  div /deep/ .custom-tree-node i{
  	font-size: 12px!important;
  }
  @media screen and (max-width: 1346px) {
  	   /deep/ .avue-crud__left{
  		margin-left:5px!important;
  		float: left;
  		margin-top: 40px;
  	   } 
  	}	
</style>
