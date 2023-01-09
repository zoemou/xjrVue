<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" v-if="hasFormPermission('id')" hidden="hidden">
          <el-form-item label="活动id" prop="id">
            <el-input v-model="formData['id']" placeholder="请输入活动id"
              :disabled="hasDisabledPermission('id',true)" :readonly="!hasEditPermission('id',true)"
              clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('name')">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="formData['name']" placeholder="请输入活动名称"
              :disabled="hasDisabledPermission('name',false)"
              :readonly="!hasEditPermission('name',false)" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('status')">
          <el-form-item label="活动状态" prop="status">
            <el-select v-model="formData['status']" placeholder="请选择活动状态"
              :disabled="hasDisabledPermission('status',false)"
              :readonly="!hasEditPermission('status',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.F_ItemName"
                :value="item.F_ItemValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('store')">
          <el-form-item label="生效店铺" prop="store">
            <el-input v-model="formData['store']" placeholder="请输入生效店铺"
              :disabled="hasDisabledPermission('store',false)"
              :readonly="!hasEditPermission('store',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('startTime')">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker :disabled="hasDisabledPermission('startTime',false)"
              :readonly="!hasEditPermission('startTime',false)" type="datetime"
              v-model="formData['startTime']" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              :style="{width: '100%'}" placeholder="请选择开始时间" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('endTime')">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker :disabled="hasDisabledPermission('endTime',false)"
              :readonly="!hasEditPermission('endTime',false)" type="datetime"
              v-model="formData['endTime']" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              :style="{width: '100%'}" placeholder="请选择结束时间" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_CreatorUserId')">
          <el-form-item label="创建人" prop="F_CreatorUserId" required>
            <avue-information-body :operationVal="operationVal" infoType='user'
              :whetherToRebindSecondaryEditing='false' v-model="formData['F_CreatorUserId']"
              placeholder="当前用户创建人" :disabled="hasDisabledPermission('F_CreatorUserId',true)"
              :readonly="!hasEditPermission('F_CreatorUserId',true)" :style="{width: '100%'}">
            </avue-information-body>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('F_CreatorTime')">
          <el-form-item label="创建时间" prop="F_CreatorTime">
            <el-date-picker :disabled="hasDisabledPermission('F_CreatorTime',false)"
              :readonly="!hasEditPermission('F_CreatorTime',false)" type="datetime"
              v-model="formData['F_CreatorTime']" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择创建时间" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="hasFormPermission('IsEnable')">
          <el-form-item label="是否启用" prop="IsEnable" required>
            <el-switch v-model="formData['IsEnable']" :disabled="hasDisabledPermission('IsEnable',false)"
              :readonly="!hasEditPermission('IsEnable',undefined)" :active-value='1' :inactive-value='0'>
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <avue-form v-loading="preloadLoading111" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option111" v-model="t_activitydetails" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom: 20px; text-align: center;">
          <el-form-item size="mini" v-if="isEdit">
			<el-button @click="resetForm">重置</el-button>  
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

        import FilterableDataList from '@/components/generator/clientComponents/FilterableDataList.vue';
        import workflowFormAuthorize from "@/mixins/workflowFormAuthorize";
        import authorizeMixin from "@/mixins/authorize";
        import { baseUrl } from "@/config/env";
        import request from "@/router/axios";
        export default {
          mixins: [authorizeMixin,workflowFormAuthorize],
       
  components: {},
  props: ['keyValue', 'isEdit', 'disabled'],
  data() {
    let _this = this
    return {
      showForm: true,
      operationVal: 'add',
      isAdd: true,
      addressUrl:'discountactivities',
      mainTableName: 't_activity',
      formConfig: {
        "fields": [{
          "__vModel__": "id",
          "__config__": {
            "label": "活动id",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 116
          }
        }, {
          "__vModel__": "name",
          "__config__": {
            "label": "活动名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 101
          }
        }, {
          "__vModel__": "status",
          "__config__": {
            "label": "活动状态",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 8,
            "formId": 104,
            "dataType": "dataItem",
            "dataItem": "status"
          }
        }, {
          "__vModel__": "store",
          "__config__": {
            "label": "生效店铺",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 8,
            "formId": 103
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "startTime",
          "__config__": {
            "label": "开始时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 106
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "endTime",
          "__config__": {
            "label": "结束时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 107
          }
        }, {
          "__vModel__": "F_CreatorUserId",
          "__type__": "info",
          "infoType": "user",
          "__organize__": true,
          "__config__": {
            "label": "创建人",
            "showLabel": true,
            "tag": "avue-information-body",
            "span": 8,
            "whetherToRebindSecondaryEditing": false,
            "formId": 108,
            "placeholder": "当前用户"
          }
        }, {
          "tempType": "datetime",
          "__vModel__": "F_CreatorTime",
          "__config__": {
            "label": "创建时间",
            "tag": "el-date-picker",
            "avueType": "datetime",
            "showLabel": true,
            "span": 8,
            "formId": 117
          }
        }, {
          "__vModel__": "IsEnable",
          "__config__": {
            "label": "是否启用",
            "tag": "el-switch",
            "avueType": "switch",
            "span": 8,
            "showLabel": true,
            "formId": 109
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "活动明细信息",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 111,
            "children": [{
              "__vModel__": "name",
              "__config__": {
                "label": "参与人",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "t_activitydetails",
                "bindTableField": "name"
              }
            }, {
              "__vModel__": "goodsName",
              "__config__": {
                "label": "商品名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "t_activitydetails",
                "bindTableField": "goodsName"
              }
            }, {
              "__vModel__": "quantity",
              "__config__": {
                "label": "数量",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "t_activitydetails",
                "bindTableField": "quantity"
              }
            }, {
              "__vModel__": "tel",
              "__config__": {
                "label": "联系电话",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 8,
                "bindTable": "t_activitydetails",
                "bindTableField": "tel"
              }
            }]
          }
        }]
      },
      formData: {
        'id': '',
        'name': '',
        'status': "0",
        'store': '',
        'startTime': "",
        'endTime': null,
        'F_CreatorUserId': '',
        'F_CreatorTime': null,
        'IsEnable': 0,
      },
      rules: {
        id: [],
        name: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择活动状态',
          trigger: 'change'
        }],
        store: [{
          required: true,
          message: '请输入生效店铺',
          trigger: 'blur'
        }],
        startTime: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endTime: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        F_CreatorTime: [{
          required: true,
          message: '请选择创建时间',
          trigger: 'change'
        }],
      },
      statusOptions: [],
      option111: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '活动明细信息',
          prop: 't_activitydetails',
          type: 'dynamic',
          span: 24,
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              // this.$message.success('新增回调');
              done({});
            },
            rowDel: (row, done) => {
              // this.$message.success('删除回调'+JSON.stringify(row));
              done();
            },
            column: [{
              label: '参与人',
              prop: 'name',
              type: 'input',
            }, {
              label: '商品名称',
              prop: 'goodsName',
              type: 'input',
            }, {
              label: '数量',
              prop: 'quantity',
              type: 'input',
            }, {
              label: '联系电话',
              prop: 'tel',
              type: 'input',
            }, ]
          }
        }, ],
      },
      t_activitydetails: {},
      preloadLoading111: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {
    //TODO   再这里做数据回填 请求表单数据
   
           if(this.keyValue){
              this.isAdd = false;
          }
           if(!this.isAdd&&this.keyValue){
              this.operationVal = 'edit';
              this.showForm = false;
              try {
                let res = await request({
                  url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
                  method: "get",
                });
				this.$nextTick(()=>{
                  
            this.formData = res.data.data.t_activity
            
          this.t_activitydetails.t_activitydetails = res.data.data.t_activitydetails
          
        this.t_activitydetails.t_activitydetails.forEach(element => {
      });
      
				})
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getStatusOptions == "function") {
      await this.getStatusOptions();
    }
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        t_activitydetailsEntityList: this.t_activitydetails.t_activitydetails,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.t_activitydetails.t_activitydetails.forEach(element => {});
        //格式化数据
        let newObj = this.getFormData();
        
        //如果没有传入参数就是新增
        if (!this.keyValue) {

          request({
            url: baseUrl + "/"+this.addressUrl,
            method: "post",
            data : newObj
          }).then((res) => {

            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
            });
             this.$emit("onChange",true)
          });

        }
        else{

         request({
            url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
            method: "put",
            data : newObj
          }).then((res) => {

            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
            });
             this.$emit("onChange",true)
          });

        }
       
       
        
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    formatTree(data, valueField, lableField, childField, type) {
      let tree = [];
      data.forEach((node, index) => {
        let newNode = {
          value: node[valueField],
          label: node[lableField],
        };
        if (type) {
          newNode.disabled = node[valueField] == undefined ? true : false
        }
        tree.push(newNode);
        if (node[childField] != null && node[childField].length > 0) {
          newNode.children = (this.formatTree(node[childField], valueField, lableField, childField,
          type));
        }
      }, this);
      return tree;
    },
    
          //辅助工作流 审批(编辑) 预留方法
          handleEdit() {
          },
          
    async getStatusOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      try {
        let resp = await this.$axios({
          method: 'get',
          url:  baseUrl + '/data-items/status/detail',
        });
        if (resp.data.data) {
          this.statusOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
  }
}

</script>
<style scoped>
/deep/ .el-table__empty-block {
  width: 100% !important;
}

/deep/ .avue-form__row {
  padding: 0 !important;
}
/deep/ .el-input--medium .el-input__inner,/deep/ .el-form-item--medium .el-form-item__label,/deep/ .el-input--medium .el-input__icon
{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-form-item--medium .el-form-item__content{
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 10px;
}	
</style>
