<template>
  <div class="approval-container">
    <avue-crud
      :data="crudData"
      :option="option"
      @row-click="handleCurrentRowChange"
      @row-dblclick="handleRowDBLClick"
      @selection-change="selectionChange"
      :style="{ 'height': isShowForm ? '50%':'100%'}"
    >
      <template slot="isSuccess" slot-scope="{ row }">
        <span v-if="isUnderReview"><i class="el-icon-loading"></i> 审核中</span>
        <span :style="{ 'color': row.isSuccess ? '#70b603' : '#ec808d' }" v-else>{{row.isSuccess ? '审核成功':'审核失败'}}</span>
      </template>
    </avue-crud>
    <el-form ref="approvalForm" :model="approvalForm" label-width="80px" v-if="isShowForm">
      <el-form-item label="审批结果" prop="btnValue" :rules="rules.btnValue">
        <el-radio-group v-model="approvalForm.btnValue">
          <el-radio label="agree_">同意</el-radio>
          <el-radio label="disagree_">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批内容" prop="message">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入审批内容"
          v-model="approvalForm.message">
        </el-input>
      </el-form-item>
      <div class="signature">
        <el-form-item label="电子签章" v-if="needStamp" prop="esignature" :rules="needpassword?rules.esignature:[]">
          <el-select v-model="approvalForm.esignature" placeholder="请选择电子签章">
            <el-option  
              v-for="(item, index) in stampsList"
              :key="index"
              :label="item.F_StampName"
              :value="item.F_StampId"/>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left:10px" @click="dialogVisible = true"></el-button>
        </el-form-item>
        <el-form-item label="签章密码" v-if="needpassword" prop="esignature_pwd" :rules="rules.esignature_pwd">
          <el-input placeholder="请输入签章密码" v-model="approvalForm.esignature_pwd" show-password></el-input>
        </el-form-item>
      </div>
    </el-form>
    <elDialog
      :visible.sync="dialogVisible"
      :title="$t('workFlow.privateStampInfo.titleAddStamp')"
      width="80%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <AddStamp
        v-if="dialogVisible"
        ref="AddStamp"
        :stampType="0"
		    :menuForm="menuForm"
      ></AddStamp>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </elDialog>
  </div>
</template>
<script>
import { getApprovalStamps,getStampInfo,batchTaskHandle } from "@/api/workFlow/WFLaunch";
import AddStamp from "@/views/WorkFlow/AddStamp";

export default {
  name: 'BatchApproval',
  components: {
    AddStamp
  },
  props: {
    approvalData: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      crudData:this.approvalData,
      taskIdList: [],
      needStamp: false,
      needpassword:false,
      stampsList: [],
      dialogVisible: false,
      isShowForm: true,
      isUnderReview: true,
      option: {
        align: 'center',
        border: true,
        menu: false,
        columnBtn: false,
        refreshBtn: false,
        addBtn: false,
        header: false,
        page: false,
        column: [{
          label: '序号',
          prop: "index",
          minWidth: "50",
        }, {
          label: '流程任务名称',
          prop: "schemeName",
          minWidth: "350",
        }, {
          label: '当前审批节点',
          prop: "btnName",
          minWidth: "250",
        }, {
          label: '发起人',
          prop: "startUser",
          minWidth: "200"
        }]
      },
      approvalForm: {
        btnValue: 'agree_',
        message: '',
        esignature: '',
        esignature_pwd:null
      },
      rules: {
        btnValue: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
        esignature: [{ required: true, message: '请选择电子签章', trigger: 'change' }],
        esignature_pwd:[{ required: true, message: '请输入电子签章密码', trigger: 'blur' }],
      },
      menuForm: {
        F_StampName: "",
        F_StampType: null,
        F_Password: "",
        F_Sort: "",
        F_File_Type: 1,
        F_File: "",
        F_Description: "",
        F_StampAttributes:0,
      },
      resColumn: [{
        label: '序号',
        prop: "index",
        minWidth: "50",
      }, {
        label: '流程任务名称',
        prop: "schemeName",
        minWidth: "200",
      }, {
        label: '当前审批节点',
        prop: "btnName",
        minWidth: "150",
      }, {
        label: '发起人',
        prop: "startUser",
        minWidth: "100"
      },{
        label: '审核结果',
        prop: "isSuccess",
        minWidth: "100",
        slot:true
      }, {
        label: '审核详情',
        prop: "approveInfo",
        minWidth: "250",
        align: 'left',
      }]
    }
  },
  created() {
    this.getStampInfo()
  },
  watch: {
    crudData: {
      handler: function (curVal, oldVal) {
        if (curVal && curVal.length > 0) {
          curVal.forEach((item, index) => {
            item['index'] = index + 1
            this.taskIdList.push(item.taskId)
          })
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    async getStampList() {
      let result = await getApprovalStamps();
      if (result.data.success) {
        this.stampsList = [...[{ F_StampId: '', F_StampName: this.$t('workFlow.addStamp.selectSignature') }], ...result.data.data];
        let defaultStampsList = this.stampsList.filter(ele => {
          return ele.F_StampAttributes == 1
        });
        if (defaultStampsList.length > 0) {
          this.approvalForm.esignature = defaultStampsList[0].F_StampId;
        }
      }
    },
    async getStampInfo() {
      let res = await getStampInfo(this.taskIdList)
      if (res.data.success) {
        this.needStamp = res.data.data.needStamp
        this.needpassword = res.data.data.needpassword
        if(this.needStamp) this.getStampList()
      }
    },
    async submitDialog() {
      await this.$refs.AddStamp.userFormSubmit();
      this.dialogVisible = false;
      this.getStampList();
    },
    async batchApproval() {
      this.option.column = this.resColumn
      this.isShowForm = false
      let res = await batchTaskHandle({
          taskId: this.taskIdList, 
          btnValue: this.approvalForm.btnValue, // 审批结果
          message: this.approvalForm.message, // 审批意见
          esignature: this.approvalForm.esignature, // 电子签章
          esignature_pwd: this.approvalForm.esignature_pwd, // 签章密码
      });
      if (res.data.success) {
        this.crudData.forEach(item => {
          const arr = res.data.data.filter(item2 => {
            return item2.taskId === item.taskId
          })
          if (arr.length) {
            for (let key in arr[0]) {
              item[key] = arr[0][key]
            }
          }
        })
        this.$forceUpdate
        this.isUnderReview = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.approval-container{
  height: 100%;
  .approveInfo{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
::v-deep .avue-crud{
  .el-table--border {
    max-height: 100%;
    overflow: scroll;
  }
  .el-table th{
    text-align: center;
  }
  .el-table .cell{
    white-space: unset;
  }
}
::v-deep .el-form{
  margin-left: -18px;
  .el-form-item{
  padding-top: 8px;
    .el-radio__label,.el-textarea__inner{
      font-size: 12px;
    }
  }
}
.signature{
  display: flex;
  ::v-deep .el-form-item{
    width: 100%;
    .el-form-item__content{
      display: flex;
    }
    .el-form-item__error{
      bottom: -13px;
    }
  }
}
</style>
