<template>
  <div class="custom-form">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24" v-show="hasFormPermission('F_Name')">
          <el-form-item :label="$t('subSystemForm.labelName')" prop="F_Name">
            <el-input v-model="formData.F_Name" :placeholder="$t('subSystemForm.placeholderName')"
              :disabled="hasDisabledPermission('F_Name',false)"
              :readonly="!hasEditPermission('F_Name',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('F_EnCode')">
          <el-form-item :label="$t('subSystemForm.labelCode')" prop="F_EnCode">
            <el-input v-model="formData.F_EnCode" :placeholder="$t('subSystemForm.placeholderCode')"
              :disabled="hasDisabledPermission('F_EnCode',false)"
              :readonly="!hasEditPermission('F_EnCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('F_IndexUrl')">
          <el-form-item :label="$t('subSystemForm.labelUrl')" prop="F_IndexUrl">
			<avue-input-tree default-expand-all v-model="formData.F_IndexUrl" 
			:placeholder="$t('subSystemForm.placeholderUrl')" type="tree" :dic="dic"
			:disabled="hasDisabledPermission('F_IndexUrl',false)"
			:readonly="!hasEditPermission('F_IndexUrl',false)" clearable :style="{width: '100%'}"></avue-input-tree>
          </el-form-item>
        </el-col>
		<el-col :span="24" v-show="hasFormPermission('F_LgMarkCode')">
			<el-form-item
			  prop="F_LgMarkCode"
			  :label="$t('menuManagement.addModal.labelTransTag')"
			>
			
			 <el-select
				  v-model="formData.F_LgMarkCode"                            
				  filterable
				  remote
				  reserve-keyword
				  :placeholder=" $t('menuManagement.addModal.placeholderTransTag')"
				  :remote-method="remoteMethod"
				  style="width:100%"
				  :loading="loading"
				  :disabled="hasDisabledPermission('F_LgMarkCode',false)"
				  :readonly="!hasEditPermission('F_LgMarkCode',false)"
										clearable>
				  <el-option
					v-for="item in transDefaultTree"
					:key="item.F_Id"
					:label="item.F_Name"
					:value="item.F_EnCode">
				  </el-option>
				</el-select>
			</el-form-item>
		</el-col>
        <el-col :span="24" v-show="hasFormPermission('F_Description')">
          <el-form-item :label="$t('subSystemForm.labelDescription')" prop="F_Description">
            <el-input v-model="formData.F_Description" type="textarea" :placeholder="$t('subSystemForm.placeholderDescription')"
              :disabled="hasDisabledPermission('F_Description',false)"
              :readonly="!hasEditPermission('F_Description',false)" :autosize="{minRows: 4, maxRows: 4}"
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="hasFormPermission('F_SortCode')">
          <el-form-item :label="$t('subSystemForm.labelSort')" prop="F_SortCode">
            <el-input v-model="formData.F_SortCode" :placeholder="$t('subSystemForm.placeholderSort')"
              :disabled="hasDisabledPermission('F_SortCode',false)"
              :readonly="!hasEditPermission('F_SortCode',false)" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item size="large" v-if="isEdit">
            <el-button 
            type="primary" 
            @click="submitForm" 
            size="small" 
            :loading="flagSubSystem"
            >
            {{flagSubSystem?$t('workFlow.WFMenu.hintSubmit'):$t('subSystemForm.submitBtn')}}
            </el-button>
            <el-button @click="resetForm" size="small">{{$t('subSystemForm.resetBtn')}}</el-button>
          </el-form-item>
          <avue-filterable-data-list :conf="autoCompleteConf" v-if="autoCompleteDialogVisible"
            v-on:onHandler="filterableCallBack"></avue-filterable-data-list>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

import FilterableDataList from '@/components/generator/clientComponents/FilterableDataList.vue';
import authorizeMixin from "@/mixins/authorize";
import { baseUrl } from "@/config/env";
import request from "@/router/axios";
import {LanguageFormatTree,formValidateNotice } from '@/util/util';
import { getLgMarkList } from "@/api/language/translation";
import {validateLength,validateDesLength,validateSubSort} from "@/api/organization/validateFunc";
import { trigger } from 'video.js';
export default {
	mixins: [authorizeMixin],   
  components: {},
  props: ['keyValue', 'isEdit', 'disabled'],
  data() {
    return {
	transDefaultTree: [],
      flagSubSystem: false,
      showForm: true,
      addressUrl:'SubSystem',
      mainTableName: 'xjr_base_subsystem',
      formConfig: {
        "fields": [{
          "__vModel__": "F_Name",
          "__config__": {
            "label": "名称",
            "tagIcon": "input",
            "tag": "el-input",
            "formId": 102,
            "avueType": "input"
          }
        }, {
          "__vModel__": "F_EnCode",
          "__config__": {
            "label": "编码",
            "tagIcon": "input",
            "tag": "el-input",
            "formId": 101,
            "avueType": "input"
          }
        }, {
          "tempType": "textarea",
          "__vModel__": "F_Description",
          "__config__": {
            "label": "描述",
            "tagIcon": "textarea",
            "tag": "el-input",
            "formId": 103,
            "avueType": "textarea"
          }
        }, {
          "__vModel__": "F_SortCode",
          "__config__": {
            "label": "排序",
            "tagIcon": "input",
            "tag": "el-input",
            "formId": 104,
            "avueType": "input"
          }
        }]
      },
      autoCompleteDialogVisible: false,
      autoCompleteConf: {},
      formData: {
        F_Name: '',
        F_EnCode: '',
        F_Description: '',
        F_SortCode: '',
        F_IndexUrl: '',
		F_LgMarkCode:''
      },
	  dic:[],
      rules: {
        // F_IndexUrl: [{
        //   required: true,
        //   message: this.$t('subSystemForm.placeholderUrl'),
        //   trigger: 'change'
        // }],
        F_Name: [{
          required: true,
          message: this.$t('subSystemForm.placeholderName'),
          trigger: 'blur'
        },
          {
            validator: validateLength,
            trigger:'change'
          }
        ],
        F_EnCode: [{
          required: true,
          message:this.$t('subSystemForm.placeholderCode'),
          trigger: 'blur'
        },
          {
            validator: validateLength,
            trigger:'change'
          }
        ],
        F_Description: [{
          required: false,
          message:this.$t('subSystemForm.placeholderDescription'),
          trigger: 'blur'
        },
          {
            validator: validateDesLength,
            trigger:'change'
          }
        ],
        F_SortCode: [{
          required: true,
          message:this.$t('subSystemForm.placeholderSort'),
          trigger: 'blur'
        },
          {
            validator:validateSubSort,
            trigger:'change'
          }
        ],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //TODO   再这里做数据回填 请求表单数据
    request({
       url: baseUrl + "/visual-release/all",
	   method: "get",
	}).then((res) => { 
		if(res?.data?.data){
			this.dic = LanguageFormatTree(res.data.data, 'urlAddress', 'title', 'children');
		}
	})
           if(this.keyValue){
              this.showForm = false;
            request({
                  url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
                  method: "get",
                }).then((res) => {
                  
            this.formData = res.data.data
            if(this.formData.F_LgMarkCode){
				this.transDefaultTree =[{
					F_Id:this.formData.F_LgMarkCode,
					F_EnCode:this.formData.F_LgMarkCode,
					F_Name:this.formData.F_LgMarkName
				}]
			}
                  
                  this.showForm = true;
              });
          }

       
  },
  methods: {
	/* 获取翻译标记 */
	remoteMethod(query) {
	  const searchObj = {
	    keyword:query
	  }
	  getLgMarkList(searchObj).then(res => {
	  
	    this.transDefaultTree = res.data.data;
	   
	  });
	},
    getFormData() {
      let key = this.mainTableName + 'Entity';
      let returnParams = {};
      returnParams[key] = this.formData;
      return {
        ...returnParams,
      };
    },
    submitForm() {
      this.flagSubSystem = true;
      this.$refs['elForm'].validate((valid,object) => {
        if (!valid) {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagSubSystem = false;
          return
        }
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
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('subSystemForm.hintAddSuccess'),
              type: "success",
            });
             this.$emit("onChange",true)
          }).finally(() => {
            this.flagSubSystem = false;
          });

        }
        else{

         request({
            url: baseUrl + "/"+this.addressUrl+"/" + this.keyValue,
            method: "put",
            data : newObj
          }).then((res) => {

            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('subSystemForm.hintModifySuccess'),
              type: "success",
            });
             this.$emit("onChange",true)
          }).finally(() => {
            this.flagSubSystem = false;
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
  }
}

</script>
<style>
</style>
