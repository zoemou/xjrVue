<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12" v-if="hasFormPermission('F_FullName')">
          <el-form-item label="单位名称" prop="F_FullName">
            <el-input v-model="formData['F_FullName']" placeholder="请输入单位名称"
              :disabled="hasDisabledPermission('F_FullName',false)"
              :readonly="!hasEditPermission('F_FullName',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hasFormPermission('F_EnCode')">
          <el-form-item label="单位编号" prop="F_EnCode">
            <el-input v-model="formData['F_EnCode']" placeholder="请输入单位编号"
              :disabled="hasDisabledPermission('F_EnCode',false)"
              :readonly="!hasEditPermission('F_EnCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('erp_unitconvertchild')">
          <avue-form v-loading="preloadLoading105" element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option105" v-model="erp_unitconvertchild" :disabled="disabled">
            <template slot-scope="{row}" slot="input">
              <el-tag>{{row}}</el-tag>
            </template>
          </avue-form>
        </el-col>
        <el-col :span="24" v-if="hasFormPermission('F_Description')">
          <el-form-item label="描述" prop="F_Description">
            <el-input v-model="formData['F_Description']" type="textarea" placeholder="请输入描述"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
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
      addressUrl:'unitconvertmanage',
      mainTableName: 'erp_unitconvert',
      formConfig: {
        "fields": [{
          "__vModel__": "F_FullName",
          "__config__": {
            "label": "单位名称",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 101
          }
        }, {
          "__vModel__": "F_EnCode",
          "__config__": {
            "label": "单位编号",
            "showLabel": true,
            "tag": "el-input",
            "avueType": "input",
            "span": 12,
            "formId": 102
          }
        }, {
          "tempType": "default",
          "__config__": {
            "componentName": "table",
            "componentTitle": "单位项",
            "layoutTree": true,
            "dataType": "",
            "span": 24,
            "formId": 105,
            "children": [{
              "__vModel__": "F_FullName",
              "__config__": {
                "label": "单位名称",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_unitconvertchild",
                "bindTableField": "F_FullName"
              }
            }, {
              "__vModel__": "F_EnCode",
              "__config__": {
                "label": "单位编码",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_unitconvertchild",
                "bindTableField": "F_EnCode"
              }
            }, {
              "__vModel__": "F_ConvertRate",
              "__config__": {
                "label": "换算率",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_unitconvertchild",
                "bindTableField": "F_ConvertRate"
              }
            }, {
              "__vModel__": "F_Description",
              "__config__": {
                "label": "描述",
                "showLabel": true,
                "tag": "el-input",
                "avueType": "input",
                "span": 24,
                "bindTable": "erp_unitconvertchild",
                "bindTableField": "F_Description"
              }
            }]
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
      formData: {
        'F_FullName': '',
        'F_EnCode': '',
        'F_Description': '',
      },
      rules: {
        F_FullName: [{
          required: true,
          message: '请输入单位名称',
          trigger: 'blur'
        }],
        F_EnCode: [{
          required: true,
          message: '请输入单位编号',
          trigger: 'blur'
        }],
        F_Description: [],
      },
      erp_unitconvertchild: {},
      preloadLoading105: false,
    }
  },
  computed: {
    option105() {
      return {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 100,
        disabled: !':disabled="disabled"',
        column: [{
          label: '单位项',
          prop: 'erp_unitconvertchild',
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
            column: this.getAuthorityTableChildrenList('erp_unitconvertchild',[{
              label: '单位名称',
              prop: 'F_FullName',
              type: 'select',
              props:{
                 label: 'F_FullName',
                 value: 'F_Id'
              },
              dicUrl:baseUrl+'/erp_purchaserequsetinfo2/unit' 
            }, {
              label: '单位编码',
              prop: 'F_EnCode',
              type: 'input',
              hide:true,
            }, {
              label: '换算率',
              prop: 'F_ConvertRate',
              type: 'input',
            }, {
              label: '描述',
              prop: 'F_Description',
              type: 'input',
            }, ])
          }
        }, ],
      }
    }
  },
  watch: {
    erp_unitconvertchild:{
      handler()
      {
        this.erp_unitconvertchild.erp_unitconvertchild.map(item=>{
          
          item.F_EnCode=item.F_FullName;
        })
      },
      immediate:true,
      deep:true
    }

  },
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
                  
            this.formData = res.data.data.erp_unitconvert
            
          this.erp_unitconvertchild.erp_unitconvertchild = res.data.data.erp_unitconvertchild
          
        this.erp_unitconvertchild.erp_unitconvertchild.forEach(element => {
      });
      
                  this.showForm = true;
              } catch (error) {
                
              }
          }

       
  },
  methods: {
    //子表单权限
    getAuthorityTableChildrenList(bindTable, children) {
      let column = [];
      if (bindTable && this.formEnCodeList && this.formEnCodeList[bindTable]) {
        let formSubEnCodeList = this.formEnCodeList[bindTable];
        if (children && children.length > 0) {
          column = children.map(ele2 => {
            if (formSubEnCodeList.includes(ele2.prop)) {
              ele2.hide = false;
            }
            else {
              ele2.hide = true;
            }
            if (ele2.hide == false) {
              //工作流中系统表单必填权限
              if (this.formSubTableNotRequiredList[bindTable] != undefined) {
                if (this.formSubTableNotRequiredList[bindTable].includes(ele2.prop)) {
                  ele2.required = false;
                }
                else {
                  ele2.required = true;
                }
              }
              ele2.rules = [];
              if (ele2.required) {
                ele2.rules = ele2.ruleList;
              }
              // disabled 属性
              if (this.formSubTableDisabledList[bindTable] != undefined) {
                if (this.formSubTableDisabledList[bindTable].includes(ele2.prop)) {
                  ele2.disabled = true;
                }
                else {
                  ele2.disabled = false;
                }
              }
            }
            else {
              ele2.required = false;
              ele2.rules = [];
            }
            return ele2;
          });
        }
        return column;
      }
      else {
        return children;
      }
    },
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
        erp_unitconvertchildEntityList: this.erp_unitconvertchild.erp_unitconvertchild,
      };
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.erp_unitconvertchild.erp_unitconvertchild.forEach(element => {});
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
/deep/ .el-input--medium .el-input__inner{
	height: 27px;
	line-height: 27px;
}
/deep/ .el-col{
	margin-bottom: 2px;
}
/deep/ .el-form-item{
	margin-bottom: 10px!important;
}
/deep/ .el-form-item--medium .el-form-item__content, /deep/ .el-form-item--medium .el-form-item__label{
	line-height: 27px;
}
</style>

