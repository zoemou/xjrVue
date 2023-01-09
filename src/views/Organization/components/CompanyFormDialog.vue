<template>
  <div class="custom-form" v-loading="loading">
    <el-form :model="companyForm" ref="companyForm" :rules="rules" label-width="80px" :validate-on-rule-change="false">
      <el-col :span="12" v-show="formEnCodeList['F_FullName']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelComName')" prop="F_FullName">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderComName')" size="small" v-model="companyForm.F_FullName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList['F_EnCode']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelComCode')" prop="F_EnCode">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderComCode')" size="small" v-model="companyForm.F_EnCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList['F_ShortName']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelComAbbr')" prop="F_ShortName">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderComAbbr')" size="small" v-model="companyForm.F_ShortName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12"  v-show="formEnCodeList['F_Nature']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelComNature')" prop="F_Nature">
          <el-select v-model="companyForm.F_Nature" :placeholder="$t('companyManager.companyFormDialog.placeholderSelect')">
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
      <el-col :span="12" v-show="formEnCodeList['F_ParentId']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelHigherCom')" prop="F_ParentId">
        <avue-input-tree :props="defaultProps"
                                     v-model="parentId" :defaultExpandedKeys="parentIdList"
                                     :placeholder="$t('companyManager.companyFormDialog.placeholderHigherCom')" type="tree"
                                     :dic="allCompanysList" size="small" :tree-load="treeLoad" lazy></avue-input-tree>  

        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList['F_Manager']">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelManager')" prop="F_Manager">
          <div class="manager-box">
            <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderManager')" size="small" v-model="companyForm.F_Manager" readonly></el-input>
            <el-button size="small" @click="memberDialogVisible = true" class="ml-10">{{$t('companyManager.companyFormDialog.placeholderSelect')}}</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_OuterPhone">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelOuterPhone')" prop="F_OuterPhone">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderOuterPhone')" size="small" v-model="companyForm.F_OuterPhone"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_InnerPhone">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelInnerPhone')" prop="F_InnerPhone">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderInnerPhone')" size="small" v-model="companyForm.F_InnerPhone"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12"  v-show="formEnCodeList.F_Email">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelEmail')" prop="F_Email">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderEmail')" size="small" v-model="companyForm.F_Email"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_Fax">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelFax')" prop="F_Fax">
          <el-input :placeholder="$t('companyManager.companyFormDialog.placeholderFax')" size="small" v-model="companyForm.F_Fax"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="formEnCodeList.F_FoundedTime">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelFoundedTime')" prop="F_FoundedTime">
          <el-date-picker
            type="date"
            :placeholder="$t('companyManager.companyFormDialog.placeholderFoundedTime')"
            v-model="companyForm.F_FoundedTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-show="formEnCodeList.F_BusinessScope">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelBusinessScope')" prop="F_BusinessScope">
          <el-input
            type="textarea"
            :placeholder="$t('companyManager.companyFormDialog.placeholderBusinessScope')"
            size="small"
            :autosize="{ minRows: 4, maxRows: 10 }"
            maxlength="1000"
            show-word-limit
            v-model="companyForm.F_BusinessScope"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-show="formEnCodeList.F_Description">
        <el-form-item :label="$t('companyManager.companyFormDialog.labelRemark')" prop="F_Description">
          <el-input
            type="textarea"
            :placeholder="$t('companyManager.companyFormDialog.placeholderRemark')"
            size="small"
            :autosize="{ minRows: 4, maxRows: 10 }"
            maxlength="800"
            show-word-limit
            v-model="companyForm.F_Description"            
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-dialog v-dialogDrag
      :title="$t('companyManager.companyFormDialog.Modal.Title')"
      :append-to-body="true"
      :visible.sync="memberDialogVisible"
      :close-on-click-modal="false"
      width="60%"
      style="padding: 10px 20px;"
    >
      <SelectUser
       v-if="memberDialogVisible" 
      ref="selectUser"
        :selectedList="selectedUser"
        :singleSelectd='true'
		    :parentCompany="companyForm"
        :parentIdList="parentIdList"
        :sourceName="'CompanyFormDialog'"
      ></SelectUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMemberDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirmMemberDialog()">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/organization/SelectUser"; 
import {getLowerCompanies, getAllCompanies, getNatureListFromDic } from "@/api/organization/company";
import {validateShortLength,validateTelePhone,validateFax} from "@/api/organization/validateFunc"
export default {
  name: "CompanyFormDialog",
  props: {
    companyForm: {
      type: Object
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
  data() {
    const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/ //邮箱
    var validateEmail = (rule, value, callback) => {
      if (!emailReg.test(value) && value) {
        callback(new Error('请输入正确的邮箱'));
      }else{
        callback();
      }
    };
    const validateLength = (rule,value,callback) => {
      function getStrLength(str) {
        return str.replace(/[^x00-xff]/g,'ab').length;//将中文转换为2个字符长度
      }
      if(!value){
        callback();
      }else if(getStrLength(value)<=100){
        callback();
      }else{
        return callback(new Error('不能超过100个字符'))
      }
    }; 
    return {
      loading: true,
      selectedUser:[],
      rules: {
        F_FullName: [
          { required: true, message:this.$t('companyManager.companyFormDialog.placeholderComName'), trigger: "change" },
          {validator:validateLength,trigger:'change'}              
        ],
        F_EnCode: [{ required: true, message:this.$t('companyManager.companyFormDialog.placeholderComCode'), trigger: "change" },
          {validator:validateLength,trigger:'change'}
        ],
        F_ShortName:[{validator:validateShortLength,trigger:'change'}],
        F_OuterPhone:[{validator:validateTelePhone,trigger:'change'}],
        F_InnerPhone:[{validator:validateTelePhone,trigger:'change'}],
        F_Fax:[{validator:validateFax,trigger:'change'}],
        F_Email:[{validator: validateEmail, trigger: 'blur'}
        ]
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 1, // 初始ID（可选）
      natureList: [],
      allCompanysList: [],
      defaultProps: {
        value: "F_CompanyId",
        label: "F_FullName",
        // children: "children",
      },
      memberDialogVisible: false,
      F_StampId: "",
      isRenderTree: false,
      parentId:'',

    };
  },
  watch: {
    parentId: {
      handler:function (curVal){
        this.companyForm.F_ParentId = curVal
      },
    }
  },
  async created() {
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
          let temp = {F_CompanyId:'',F_FullName:this.$t('orgUserManagement.addModal.placeholderSelect'),disabled:false,leaf:false};

          temp.F_CompanyId = item.F_CompanyId;
          temp.F_FullName = item.F_FullName;
          if(this.companyForm.F_CompanyId && this.companyForm.F_CompanyId==item.F_CompanyId){
            temp.disabled = true; //将正在编辑的部门disabled
            temp.leaf = true; //正在编辑的部门不可以将上级部门修改为其下级部门
          }
          list.push(temp);
      });
     return list;
    },
    cancelMemberDialog() {
      this.memberDialogVisible = false;
      
    },
    confirmMemberDialog() {
      this.selectedUser = this.$refs.selectUser.pushParentData();
      if(this.selectedUser.length>0){
        this.companyForm.F_Manager = this.selectedUser[0].F_RealName;
      }else{
        this.companyForm.F_Manager = "";
      }
      this.cancelMemberDialog();
    },
    async treeLoad(node, resolve) {
      try {
        const id = node.data.F_CompanyId || '0'
        let res = await getLowerCompanies(id);
        if (res.data.success) {
          if (node.data.F_CompanyId) {
            const data = node.data.F_FullName === this.$t('orgUserManagement.addModal.placeholderSelect') ? [] : this.formateParentTree(res.data.data)
            if (!this.isRenderTree) {
              res.data.data.map(item => {
                if (this.companyForm.F_ParentId === item.F_ParentId) {
                  this.parentId = this.companyForm.F_ParentId
                  this.isRenderTree = true
                }
              })
            }
            resolve(data)
          } else {
            const selectTxt = { F_CompanyId:'0', F_FullName:this.$t('orgUserManagement.addModal.placeholderSelect'),disabled:false,leaf:true }
            this.allCompanysList = [selectTxt, ...this.formateParentTree(res.data.data)];
          }
        }
      } catch (error) {}
    },
  },
};
</script>

<style scoped>
</style>
