<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12" v-if="hasFormPermission('F_FullName')">
          <el-form-item label="类别名称" prop="F_FullName">
            <el-input v-model="formData['F_FullName']" placeholder="请输入类别名称"
              :disabled="hasDisabledPermission('F_FullName',false)"
              :readonly="!hasEditPermission('F_FullName',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_EnCode')">
          <el-form-item label="类别编号" prop="F_EnCode">
            <el-input v-model="formData['F_EnCode']" placeholder="请输入类别编号"
              :disabled="hasDisabledPermission('F_EnCode',false)"
              :readonly="!hasEditPermission('F_EnCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_ParentId')">
          <el-form-item label="上级节点" prop="F_ParentId">
            <el-select v-model="formData.F_ParentId" placeholder="请选择上级节点"
              :disabled="hasDisabledPermission('F_ParentId',false)"
              :readonly="!hasEditPermission('F_ParentId',undefined)" filterable clearable
              :style="{width: '100%'}" remote :remote-method="getF_ParentIdOptions"
              @change="handlerSelectF_ParentId" :loading="F_ParentIdLoading">
              <el-option v-for="(item, index) in F_ParentIdOptions" :key="index" :label="item.F_FullName"
                :value="item.F_Id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="描述" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入描述"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWorkflowForm">
          <el-form-item size="mini" v-if="isEdit" style="margin-top:20px; margin-bottom:20px; text-align: center;">
			<el-button @click="resetForm">重置</el-button>  
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
        <avue-filterable-data-list :conf="autoCompleteConf" v-if="autoCompleteDialogVisible"
          v-on:onHandler="filterableCallBack"></avue-filterable-data-list>
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
      addressUrl:'goodscategorymanage',
      mainTableName: 'erp_goodscategory',
      formConfig: {
        "fields": [{
          "__vModel__": "F_FullName",
          "__config__": {
            "label": "类别名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 101
          }
        }, {
          "__vModel__": "F_EnCode",
          "__config__": {
            "label": "类别编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 103
          }
        }, {
          "__vModel__": "F_ParentId",
          "__config__": {
            "label": "上级节点",
            "showLabel": true,
            "tag": "el-select",
            "avueType": "asso-select",
            "filterable": true,
            "span": 24,
            "dataType": "dataSql",
            "autoBindFields": "",
            "formId": 105,
            "database": "localDB",
            "sql": "select gc.F_Id,gc.F_ParentId,gc.F_FullName from erp_goodscategory gc ",
            "showField": "F_FullName",
            "saveField": "F_Id"
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "描述",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "textarea",
            "span": 24,
            "formId": 104
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        'F_FullName': '',
        'F_EnCode': '',
        'F_ParentId': 0,
        'F_Description': '',
      },
      rules: {
        F_FullName: [{
          required: true,
          message: '请输入类别名称',
          trigger: 'blur'
        }],
        F_EnCode: [{
          required: true,
          message: '请输入类别编号',
          trigger: 'blur'
        }],
        F_ParentId: [],
        F_Description: [],
      },
      F_ParentIdOptions: [],
      F_ParentIdLoading: false,
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
                  
            this.formData = res.data.data
            
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
    if (typeof this.getF_ParentIdOptions == "function") {
      await this.getF_ParentIdOptions();
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
          
    filterableCallBack(data) {
      if (!this.autoCompleteConf) {
        return false;
      }
      //弹窗关闭前回填数据  如果有选择数据项
      if (data) {
        let fields = this.getElements(this.formConfig.fields);
        let autoBindFields = JSON.parse(this.autoCompleteConf.autoBindFields) || {};
        let saveField = this.autoCompleteConf.dataType == 'dataItem' ? 'F_ItemValue' : this.autoCompleteConf
          .saveField
        this.setModelValue(this.formConfig.fields, autoBindFields, data);
        //自己赋值
        if (this.autoCompleteConf.dataType == 'dataItem') {
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].__config__.formId == this.autoCompleteConf.formId) {
              this.formData[this.autoCompleteConf.model] = data[saveField];
              break;
            }
          }
        }
        else {
          this.formData[this.autoCompleteConf.model] = data[saveField];
        }
      }
      //更新表单校验
      this.$refs['elForm'].validate(valid => {
        console.log('更新表单校验 valid', valid);
      })
      //关闭弹窗
      this.autoCompleteDialogVisible = false;
    },
    setModelValue(fields, autoBindFields, data) {
      fields.map(item => {
        if (item.__config__.componentName && item.__config__.componentName == 'avue-tabs') {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            let children = childrenObj[key];
            this.setModelValue(children, autoBindFields, data);
          }
        }
        else {
          if (autoBindFields.hasOwnProperty(item.__config__.formId)) {
            this.formData[item.__vModel__] = data[autoBindFields[item.__config__.formId]];
          }
        }
      });
    },
    getElements(fields) {
      let _arr = [];
      fields.map(item => {
        if (item.__config__.componentName == 'avue-tabs') {
          let childrenObj = item.__config__.childrenObj || {};
          for (let key in childrenObj) {
            _arr.push(...this.getElements(childrenObj[key]));
          }
        }
        else {
          _arr.push(item);
        }
      });
      return (() => {
        return _arr;
      })();
    },
    async getF_ParentIdOptions(query) {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      let keyword = ' ';
      if (query) {
        keyword = query;
      }
      if (query !== '') {
        this.F_ParentIdOptionsLoading = true;
      }
      try {
        if ('dataSql' == 'dataSource') {
          let resp = await
          this.$axios({
            method: 'get',
            url:  baseUrl + '/data-sources/undefined/data/?field=F_FullName&keyword=' +
              keyword
          });
          this.F_ParentIdOptionsLoading = false;
          this.F_ParentIdOptions = resp.data.data;
        }
        else {
          let params = {};
          params.sql = `select gc.F_Id,gc.F_ParentId,gc.F_FullName from erp_goodscategory gc `;
          let resp = await
          this.$axios({
            method: 'get',
            params: params,
            url:  baseUrl + '/database-links/localDB/datas'
          });
          this.F_ParentIdOptionsLoading = false;
          this.F_ParentIdOptions = resp.data.data;
        }
      }
      catch (error) {}
    },
    handlerSelectF_ParentId(val) {
      let autoBindFields = JSON.parse('[]');
      let fields = this.formConfig.fields
      let saveField = 'dataSql' == 'dataItem' ? 'F_ItemValue' : 'F_Id'
      //得对应数据列
      let data = this.F_ParentIdOptions.filter(item => {
        return item[saveField] == val;
      })[0];
      if (!data) {
        return;
      }
      //数据回显
      this.setModelValue(this.formConfig.fields, autoBindFields, data);
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
/deep/ .el-input--medium .el-input__inner{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 2px;
}
/deep/ .el-form-item{
	margin-bottom: 8px!important;
}
/deep/ .el-form-item--medium .el-form-item__content, /deep/ .el-form-item--medium .el-form-item__label{
	line-height: 27px;
}
</style>

