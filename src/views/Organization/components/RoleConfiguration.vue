<template>
<!-- 审批角色弹出框 -->
  <el-dialog v-dialogDrag
    :title="roleType == 2 ? $t('orgDepartManagement.roleConfiguration.approvalRoleDep') :$t('orgDepartManagement.roleConfiguration.approvalRoleCom')"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="40%"
    :before-close="closeSetDialog"
    style="padding: 10px 20px;"
	class="approval-infor"
  >
    <avue-crud
      ref="crud"
      :option="optionRole"
      :data="data"
      id="crudId"
      @row-update="addUpdate"
      @row-del="rowDelete"
      @sortable-change="sortableChange"
    >
    </avue-crud>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeSetDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
      <el-button 
      size="mini" 
      type="primary" 
      @click="confimSetDialog()" 
      :loading="flagRole"
      >{{flagRole?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllSpecialPostList, addSpecialPost } from "@/api/organization/department";
import {validateLength} from "@/api/organization/validateFunc";
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
export default {
  name: "RoleConfiguration",
  mixins: [authorizeMixin],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    roleType: { type: Number },
  },
  data() {
    return {
      modulePermissionList: [],
      flagRole:false,
      data: [],
      optionRole: {
        addBtn: false,
		addRowBtn:true,
        editBtn: true,
        delBtn: true,
        sortable: true,
        dragHandler: true,
        menuWidth: 250,
		maxHeight: 380,
        column: [
          {
            label:this.$t('orgDepartManagement.roleConfiguration.RoleName'),
            prop: "F_Name",
            cell: true,
            rules: [
              {
                required: true,
                message: this.$t('orgDepartManagement.roleConfiguration.hintRName'),
                trigger: "blur",
              },
              {
                validator:validateLength,
                trigger:'blur',
              },
            ],
          },
          {
            label:  this.$t('orgDepartManagement.roleConfiguration.RemarkDescrip'),
            prop: "F_Remark",
            cell: true,
            rules: [
              {
                validator:validateLength,
                trigger:'change',
              }
            ]
          },
          // {
          //   label: "角色类型",
          //   prop: "F_Type",
          //   cell: false,
          // },
        ],
      },
    };
  },
  mounted() {
    getAllSpecialPostList(this.roleType).then((res) => {
      this.data = res.data.data.map((ele, index) => {
        return Object.assign({}, { id: index }, ele); //因为组件编辑的时候 根据id来保存的
      });
      this.$nextTick(()=>{
        let crudDom = document.getElementById('crudId');
        let tableDom = crudDom.querySelector('.el-table__body-wrapper');
        tableDom.scrollTop = tableDom.scrollHeight;
      });
    });
  },
  methods: {  
	handleEditAvueSth(){
		this.optionRole.addRowBtn=this.hasButtonPermission('addroleconfigure')
		this.optionRole.editBtn=this.hasButtonPermission('editRole')
		this.optionRole.delBtn=this.hasButtonPermission('deleteRole')
	},
    addUpdate(form, index, done, loading) {
			this.data.splice(index, 1, form);
      done();
    },
    rowDelete(row, index) {
      this.data.splice(index, 1);
    },
    sortableChange(oldindex, newindex, row, list) {
      this.data = [];
      this.$nextTick(() => {
        this.data = list;
      });
    },
    closeSetDialog() {
      this.$emit("closeSetDialog");
    },
    confimSetDialog() {
      let params = [];
      this.flagRole = true;
      
      let temp = this.data.filter(ele=>{
        return  ele.F_Name.replace(/[^x00-xff]/g,'ab').length>50
      });
      if(temp.length>0){
        this.$message.error('字符长度在100以内');
        this.flagRole = false;
        return;
      }else{
        this.data.forEach((ele) => {
        // let lengthLimit = ele.F_Name.replace(/[^x00-xff]/g,'ab').length;
        if(ele.F_Name){
            params.push({
                F_Id: ele.F_Id?ele.F_Id:'',
                F_Name: ele.F_Name,
                F_Remark: ele.F_Remark,
                F_Sort: 0,
                F_Temp1: "",
                F_Temp2: "",
                F_Type: this.roleType,
          });
        }
      });
         addSpecialPost(this.roleType, params).then((res) => {
        if (res.data.success) {
          this.$notify({
            title: this.$t('deletePrompt.promptTitle'),
            message: this.$t('deletePrompt.hintSuccess'),
            type: "success",
          });
        } else {
          this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message:this.$t('deletePrompt.hintFailure'),
            type: "warning",
          });
        }
        this.$emit("closeSetDialog");
      }).finally(() => {
        this.flagRole = false;
      });
      }
     
    },
  },
};
</script>

<style scoped>
	.avue-crud /deep/.avue-crud__pagination{
		display: none;
	}	
.approval-infor	/deep/ .avue-crud__left{
	float: left;
}
.approval-infor	/deep/ .avue-crud__right{
	float: right;
}
</style>
