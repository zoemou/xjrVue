<template>
<!-- 人员配置弹出框 -->
  <div class="custom-form"  v-loading="loading">
    <el-form
        :model="departmentForm"
        ref="departmentForm"
        label-width="80px"
        :validate-on-rule-change="false"
        :rules="rules"
    >
      <el-col :span="12" v-show="formEnCodeList.F_FullName"
      >
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelDepName')" prop="F_FullName">
          <el-input
              :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderDepName')"
              size="small"
              v-model="departmentForm.F_FullName"
          ></el-input>
        </el-form-item
        >
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_EnCode">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelDepCode')" prop="F_EnCode">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderDepCode')" size="small" v-model="departmentForm.F_EnCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_ShortName">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelShortName')" prop="F_ShortName">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderShortName')" size="small" v-model="departmentForm.F_ShortName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_Nature">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelDepNature')" prop="F_Nature">
          <el-select v-model="departmentForm.F_Nature" :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderSelect')">
            <el-option
                v-for="item in natureList"
                :key="item.F_ItemName"
                :label="item.F_ItemName"
                :value="item.F_ItemValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_ParentId">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelParentDep')" prop="F_ParentId">
        <avue-input-tree :props="defaultProps" :defaultExpandedKeys="parentIdList"
                                     v-model="parentId"
                                     :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderParentDep')" type="tree"
                                     :dic="allDepartmentsList" size="small" :tree-load="treeLoad" lazy></avue-input-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_Manager">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelManager')" prop="F_Manager">
          <div class="manager-box">
            <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderManager')" size="small" v-model="departmentForm.F_Manager" readonly></el-input>
            <el-button size="small" @click="memberDialogVisible = true" class="ml-10">{{$t('orgDepartManagement.departmentFormDialog.placeholderSelect')}}</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_OuterPhone">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelOuterPhone')" prop="F_OuterPhone">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderOuterPhone')" size="small" v-model="departmentForm.F_OuterPhone"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_InnerPhone">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelInnerPhone')" prop="F_InnerPhone">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderInnerPhone')" size="small" v-model="departmentForm.F_InnerPhone"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_Email">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelEmail')" prop="F_Email">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderEmail')" size="small" v-model="departmentForm.F_Email"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_Fax">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelFax')" prop="F_Fax">
          <el-input :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderFax')" size="small" v-model="departmentForm.F_Fax"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-show="formEnCodeList.F_Description">
        <el-form-item :label="$t('orgDepartManagement.departmentFormDialog.labelRemark')">
          <el-input
              type="textarea"
              :placeholder="$t('orgDepartManagement.departmentFormDialog.placeholderRemark')"
              size="small"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="departmentForm.F_Description"
              maxlength="800"
              show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-dialog v-dialogDrag
        :title="$t('orgDepartManagement.staffingModal.modalTitle')"
        :append-to-body="true"
        :visible.sync="memberDialogVisible"
        :close-on-click-modal="false"
        width="60%"
        style="padding: 10px 20px;"
    >
        <SelectUser
      ref="selectUser"
        :selectedList="selectedUser"
        :singleSelectd='true'
        :parentCompany="departmentForm"
        :sourceName="'DepartmentFormDialog'"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirmMemberDialog()" :loading="flagDepForm">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/organization/SelectUser"; 
import { getNatureListFromDic, getAllDepartmentsFn,getLowerDepartment } from '@/api/organization/department';
import {validateLength,validateShortLength,validateTelePhone,validateFax} from "@/api/organization/validateFunc";

export default {
  name: 'DepartmentForm',
  props: {
    departmentForm: {
      type: Object,
    },
    formEnCodeList: {
      type:Array,
      default:()=>{
        return []
      }
    },
    parentIdList: {
      type: Array,
      default:()=>{
        return []
      }
    }
  },
  components: {
    SelectUser,
  },
  data () {
    const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/ //邮箱
    var validateEmail = (rule, value, callback) => {
      if (!emailReg.test(value) && value) {
        callback(new Error(this.$t('inputVaildEmail')));
      }else{
        callback();
      }
    };
    return {
       flagDepForm: false, 
       loading: true,
       selectedUser:[],
      natureList: [],
      allDepartmentsList: [],
      defaultProps: {
        value: 'F_DepartmentId',
        label: 'F_FullName',
      },
      memberDialogVisible: false,
      F_StampId: '',
      isRenderTree: false,
      parentId:'',
      rules: {
        F_FullName: [{ required: true, message: this.$t('orgDepartManagement.departmentFormDialog.placeholderDepName'), trigger: 'change' },
          {validator:validateLength,trigger:'change'}
        ],
        F_EnCode: [{ required: true, message:this.$t('orgDepartManagement.departmentFormDialog.placeholderDepCode'), trigger: 'change' },
          {validator:validateLength,trigger:'change'}
        ],
        F_ShortName:[{validator:validateShortLength,trigger:'change'}],
        F_OuterPhone:[{validator:validateTelePhone,trigger:'change'}],
        F_InnerPhone:[{validator:validateTelePhone,trigger:'change'}],
        F_Fax:[{validator:validateFax,trigger:'change'}],
        F_Email:[{validator: validateEmail, trigger: 'blur'}]
      },
    };
  },
  watch: {
    parentId: {
      handler:function (curVal){
        this.departmentForm.F_ParentId = curVal
      },
    },
    parentIdList: {
      handler: function (curVal) {
        console.log('parentIdList',curVal)
      },
      immediate: true,
    deep:true
    },
    
  },
  async created () {
    this.loading = true;
    let dicRes = await getNatureListFromDic();
      if(dicRes.data.success){
          this.natureList = dicRes.data.data;
      }
    this.loading = false;
  },

  methods: {
    formateParentTree(data){
      let list = [];
      data.forEach(item => {
          let temp = {F_DepartmentId:'',F_FullName:this.$t('orgUserManagement.addModal.placeholderSelect'),disabled:false,leaf:false};
          temp.F_DepartmentId = item.F_DepartmentId;
          temp.F_FullName = item.F_FullName;
          if(this.departmentForm.F_DepartmentId && this.departmentForm.F_DepartmentId==item.F_DepartmentId){
            temp.disabled = true; //将正在编辑的部门disabled
            temp.leaf = true; //正在编辑的部门不可以将改部门修改为其下级部门
          }
          list.push(temp);
      });
     return list;
    },
    cancelMemberDialog () {
      this.selectedUser = this.$refs.selectUser.pushParentData();
      if(this.selectedUser.length>0){
         this.departmentForm.F_Manager  = this.selectedUser[0].F_RealName;
      }else{
         this.departmentForm.F_Manager  = "";
      }
      this.memberDialogVisible = false;
      this.flagDepForm = false;
    },
    confirmMemberDialog () {
      this.flagDepForm = true;
      this.cancelMemberDialog();
    },
    async treeLoad(node, resolve) {
      try {
        const id = node.data.F_DepartmentId || '0'
        let res = await getLowerDepartment(this.departmentForm.F_CompanyId,id);
        if (res.data.success) {
          if (node.data.F_DepartmentId) {
            const data = node.data.F_FullName === this.$t('orgUserManagement.addModal.placeholderSelect') ? [] : this.formateParentTree(res.data.data)
            if (!this.isRenderTree) {
              res.data.data.map(item => {
                if (this.departmentForm.F_ParentId === item.F_ParentId) {
                  this.parentId = this.departmentForm.F_ParentId
                  this.isRenderTree = true
                }
              })
            }
            resolve(data)
          } else {
            const selectTxt = { F_DepartmentId:'0', F_FullName:this.$t('orgUserManagement.addModal.placeholderSelect'),disabled:false,leaf:true }
            this.allDepartmentsList = [selectTxt, ...this.formateParentTree(res.data.data)];
          }
        }
      } catch (error) {}
    },
  },
};
</script>

<style scoped>

</style>
