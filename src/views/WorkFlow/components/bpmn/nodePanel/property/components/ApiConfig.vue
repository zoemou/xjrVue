<template>

      <div class="content">
          <el-form :model="iframeData" :rules="rule" ref="formInline" label-width="80px" style="height:100%">
			<el-row>
				<el-col :span="12">
					<el-form-item :label="$t('interfaceManage.addModal.labelAddress')" prop="apiUrl">
					  <el-input v-model="iframeData.apiUrl" :placeholder="$t('selectInterfaceAddress')" suffix-icon="el-icon-more" @focus="getAllInterface"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('reqType')" prop="method">
					  <el-select v-model="iframeData.method" :placeholder="$t('selectRequestType')" disabled>
						<el-option
						  v-for="item in axiosType"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<avue-crud ref="queryTable" :data="apiVariable" :option="queryoption" stripe style="padding-top:10px;height:calc(100% - 100px)">
			<template slot="paramValType" slot-scope="scope">
			  <el-select v-model="scope.row.paramValType" :placeholder="$t('selectApiParameterValueType')" @change="changeParamVal(scope.row)">
				<el-option :label="$t('workFlow.zh.value')" :value="0"></el-option>
				<el-option :label="$t('配置')" :value="1"></el-option>
			  </el-select>
			</template>
			  <template slot="paramValue" slot-scope="scope">
				<avue-input-tree v-model="scope.row.paramValue" v-if="scope.row.paramValType==1" default-expand-all type="tree" :dic="dic"></avue-input-tree>
			    <el-input v-model="scope.row.paramValue" v-else placeholder=""></el-input>
			  </template>
			</avue-crud>
			<el-row>
				<el-col :span="24">
					<el-form-item :label="$t('assignField')" prop="field">
					  <el-select v-model="iframeData.field" :placeholder="$t('selectInterfaceParameterFieldAssignVariable')">
						<el-option
						  v-for="item in outputParam"
						  :key="item.F_OutputKey"
						  :label="item.F_OutputKey"
						  :value="item.F_OutputKey">
						</el-option>
					  </el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="tipTxt">
				<span style="color:red">{{ tipTxt }}</span>
			</el-row>
          </el-form>

		<interfaceList v-if="listVisible" :visible.sync="listVisible" @getUrl="getUrl" :curId="iframeData.interfaceId"></interfaceList>
	</div>
</template>
<script>
import interfaceList from '@/views/SystemManagement/InterfaceDevelopment/component/interfaceList.vue';
import { deepClone,axiosType,axiosMethod } from '@/util/util';
import {getInterfaceById } from '@/api/systemManagement/interface.js';
import { scriptSqlTasksTree,scriptSqlTasksHasId } from "./../../../data/rules";
import { getProcessParametersData } from "./../../../common/util/properties";

export default {
  components: {
	interfaceList
  },
  props: ['apiConfig','tipTxt'],
  data() {
    return {
      iframeData: {
        apiUrl: "",
        method: "",
		field:'',
        params: []
      },
	  axiosType:axiosType,
	  outputParam:[],
      rule: {
		apiUrl: [{ required: true, message: this.$t('selectInterfaceAddress'), trigger: 'change' }],
		method: [{ required: true, message: this.$t('selectRequestType'), trigger: 'change' }],
		field:[{ required: true, message: this.$t('selectInterfaceParameterFieldAssignVariable'), trigger: 'change' }]
	  },
	  apiVariable:[],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        border: true,
        align: 'center',
        menu: false,
        page: false,
        dragHandler: true,
        header: false,
        column: [
		  {
            label:this.$t('apiParmName'),
            prop: 'paramName'
          },
          {
            label: this.$t('apiParmType'),
            prop: 'paramType',
            formatter:function(row){
              return axiosMethod.filter((o)=>{return o.value==row.paramType})[0].label;
            }
          },
		   {
		     label: this.$t('apiParmValueType'),
		     prop: 'paramValType',
		     slot: true
		   },
      	  {
            label: this.$t('apiParmValue'),
            prop: 'paramValue',
            slot: true
          }
        ]
      },
	  listVisible:false,
	  dic:[...scriptSqlTasksHasId,...getProcessParametersData()]
    };
  },
  mounted(){
	if (this.apiConfig?.apiUrl) {
	  this.iframeData.apiUrl = this.apiConfig.apiUrl;
	}
	if (this.apiConfig?.method>=0) {
	  this.iframeData.method = this.apiConfig.method;
	}
	if (this.apiConfig?.params) {
	  this.apiVariable = this.apiConfig.params;
	}
	
	if(this.apiConfig?.interfaceId){
		this.iframeData.interfaceId = this.apiConfig.interfaceId;
		getInterfaceById(this.apiConfig.interfaceId).then(res=>{
			if(res.data.data){
				let result=res.data.data
				let fields=result.F_Outputs||[];			
				//字符集合
				this.outputParam=fields.filter(o=>{return o.F_Type===0});
				if(this.apiConfig?.field){
					let temp=this.outputParam.find(o=>{return o.F_OutputKey==this.apiConfig.field})
					if(temp){
						this.iframeData.field=this.apiConfig.field;
					}else{
						this.iframeData.field="";
					}
				} 
				
			}
		})			
	} 
  },
  methods: {
    getConfig(){
		let flag=false;
		this.$refs.formInline.validate(res=>{
			if(res){
				//验证通过
				flag=true;
				this.iframeData.params=this.apiVariable
			}
		})	
		if(flag) return this.iframeData;
		else return false;
    },
	getAllInterface(){
		this.listVisible=true
	},
	getUrl(data){
		if(data.F_Id){
			this.iframeData.apiUrl=data.F_UrlAddress;
			this.iframeData.method=data.F_RequestMethod;
			this.iframeData.interfaceId=data.F_Id;
			getInterfaceById(data.F_Id).then(res=>{
				if(res.data.data){
					let result=res.data.data
					let fields=result.F_Outputs||[];
					let param=result.F_Params||[];
					this.apiVariable=[]
					param.forEach(i=>{
						let obj={
							paramName:i.F_ParamKey,
							paramType: i.F_Type,
							paramValType: 0,
							paramValue: i.F_ParamValue
						}
						this.apiVariable.push(obj)
					})					
					//字符集合
					this.outputParam=fields.filter(o=>{return o.F_Type===0});
					let temp=this.outputParam.find(o=>{return o.F_OutputKey==this.iframeData.field})
					if(!temp){
						this.iframeData.field="";
					}
				}
			})			
		}
	},
	changeParamVal(row){
		row.paramValue=""
	}
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog{
	height: calc(100% - 240px);
}
::v-deep .el-dialog__body{
	height: calc(100% - 110px);
}
.content{
	height: 100%;
}
</style>
