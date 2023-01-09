<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24" v-if="hasFormPermission('F_WarehouseId')">
          <el-form-item label="仓库" prop="F_WarehouseId">
            <el-select v-model="formData['F_WarehouseId']" placeholder="请选择仓库"
              :disabled="hasDisabledPermission('F_WarehouseId',false)"
              :readonly="!hasEditPermission('F_WarehouseId',undefined)" filterable clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in F_WarehouseIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_GoodsId')">
          <el-form-item label="商品id" prop="F_GoodsId">
            <el-input v-model="formData['F_GoodsId']" placeholder="请输入商品id"
              :disabled="hasDisabledPermission('F_GoodsId',false)"
              :readonly="!hasEditPermission('F_GoodsId',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_BasicAmount')">
          <el-form-item label="基本单位数量" prop="F_BasicAmount">
            <el-input v-model="formData['F_BasicAmount']" placeholder="请输入基本单位数量"
              :disabled="hasDisabledPermission('F_BasicAmount',false)"
              :readonly="!hasEditPermission('F_BasicAmount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_ComAmount')">
          <el-form-item label="库存显示数量" prop="F_ComAmount">
            <el-input v-model="formData['F_ComAmount']" placeholder="请输入库存显示数量"
              :disabled="hasDisabledPermission('F_ComAmount',false)"
              :readonly="!hasEditPermission('F_ComAmount',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm" style="margin-top:15px; margin-bottom:20px; text-align: center;">
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
      addressUrl:'erp_inventorymanage1',
      mainTableName: 'erp_inventory',
      formConfig: {
        "fields": [{
          "__vModel__": "F_WarehouseId",
          "__config__": {
            "label": "仓库",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "select",
            "span": 24,
            "formId": 104
          }
        }, {
          "__vModel__": "F_GoodsId",
          "__config__": {
            "label": "商品id",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 24,
            "formId": 101
          }
        }, {
          "__vModel__": "F_BasicAmount",
          "__config__": {
            "label": "基本单位数量",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 24,
            "formId": 102
          }
        }, {
          "__vModel__": "F_ComAmount",
          "__config__": {
            "label": "库存显示数量",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 24,
            "formId": 103
          }
        }]
      },
      formData: {
        'F_WarehouseId': '',
        'F_GoodsId': '',
        'F_BasicAmount': '',
        'F_ComAmount': '',
      },
      rules: {
        F_WarehouseId: [{
          required: true,
          message: '请选择仓库',
          trigger: 'change'
        }],
        F_GoodsId: [{
          required: true,
          message: '请输入商品id',
          trigger: 'blur'
        }],
        F_BasicAmount: [{
          required: true,
          message: '请输入基本单位数量',
          trigger: 'blur'
        }],
        F_ComAmount: [{
          required: true,
          message: '请输入库存显示数量',
          trigger: 'blur'
        }],
      },
      F_WarehouseIdOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
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
                  
            this.formData = res.data.data
            
				})
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
  },
  methods: {
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
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
