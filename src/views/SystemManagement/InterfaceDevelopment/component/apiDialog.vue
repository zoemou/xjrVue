<template>
  <div class="dialog-box">
    <el-dialog v-dialogDrag
      v-bind="$attrs"
      width="980px"
      :close-on-click-modal="false"
      append-to-body
      :before-close="close"
	  top="120px"
    >
      <div slot="title">
        {{notice}}
      </div>
      <div class="content">
          <el-form :model="formInline" :rules="rule" ref="formInline" label-width="80px" style="height:100%">
			<el-row>
				<el-col :span="12">
					<el-form-item :label="$t('interfaceManage.addModal.labelAddress')" prop="url">
					  <el-input v-model="formInline.url" :placeholder="$t('selectInterfaceAddress')" suffix-icon="el-icon-more" @focus="getAllInterface"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('reqType')" prop="type">
					  <el-select v-model="formInline.type" :placeholder="$t('selectRequestType')" disabled>
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
			  <!-- <template slot="add" slot-scope="scope">
			    <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
			  </template> -->
			  <!-- <template slot="paramName" slot-scope="scope">
				  <el-input v-model="scope.row.paramName" :placeholder="$t('请填写API参数名称')"></el-input>        
			  </template>
			  <template slot="paramType" slot-scope="scope">
			    <el-select v-model="scope.row.paramType" :placeholder="$t('请选择API参数类型')">
			      <el-option :label="item.label" :value="item.value" v-for="item in axiosMethod" :key="item.value"></el-option>
			    </el-select>
			  </template> -->
			<template slot="paramValType" slot-scope="scope">
			  <el-select v-model="scope.row.paramValType" :placeholder="$t('selectApiParameterValueType')" @change="paramValTypeChaneg(scope.row)">
				<el-option :label="$t('workFlow.zh.value')" :value="0"></el-option>
				<el-option :label="$t('workFlow.zh.config')" :value="1"></el-option>
			  </el-select>
			</template>
			  <template slot="paramShowValue" slot-scope="scope">
			    <el-input v-model="scope.row.paramShowValue" :suffix-icon="scope.row.paramValType=='1'?'el-icon-more':''"
				placeholder="" @focus="variableValClick(scope.row)" @change="changeParamShow(scope.row)"></el-input>
			  </template>
			</avue-crud>
			<el-row v-if="type!='process'">
				<el-col :span="24">
					<el-form-item :label="$t('assignField')" prop="field">
					  <el-select v-model="formInline.field" :placeholder="$t('selectInterfaceParameterFieldAssignVariable')">
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
          </el-form>
		  
		  <!-- <el-link type="danger" :underline="false" style="font-size:12px" v-if="type=='varible'">返回的Json格式示例：{"code":0,"success":true,"msg":"","data":"value"}；success等于false的时候进行报错，value为取值对象，只允许string类型，不允许对象或者数值类型</el-link> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"
                   @click="close()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button type="primary"
                   @click="submit"
                   size="small">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </div>
    </el-dialog>
	<param-dialog v-if="paramVisible" :visible.sync="paramVisible" @changeData="changeData" :isShowParam="isShowParam" :param="curVariable"></param-dialog>
	<interfaceList v-if="listVisible" :visible.sync="listVisible" @getUrl="getUrl" :curId="formInline.F_Id" :parentId="parentId"></interfaceList>
  </div>
</template>
<script>
import paramDialog from './paramDialog.vue';
import interfaceList from './interfaceList.vue';
import { deepClone,axiosType,axiosMethod } from '@/util/util';
import {getInterfaceById } from '@/api/systemManagement/interface.js';

export default {
  components: {
    paramDialog,
	interfaceList
  },
  props: ['isShowParam','type','param','parentId'],
  data() {
    return {
      formInline:{
		  url:'',
		  type:'',
		  field:'',
		  F_Id:''
	  },
	  axiosType:axiosType,
	  //axiosMethod:axiosMethod,
	  notice:'',
	  outputParam:[],
      rule: {
		url: [{ required: true, message: this.$t('selectInterfaceAddress'), trigger: 'change' }],
		type: [{ required: true, message: this.$t('selectRequestType'), trigger: 'change' }],
		field:[{ required: true, message: this.$t('selectInterfaceParameterFieldAssignVariable'), trigger: 'change' }]
	  },
	  apiVariable:[],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        menu: false,
        page: false,
        dragHandler: true,
        header: false,
        column: [
          // {
          //   label: '',
          //   prop: 'add',
          //   renderHeader: (h) => {
          //     return h('i',
          //         {
          //           style: { color: '#409EFF', fontSize: '20px', display: 'block' },
          //           class: 'el-icon-circle-plus',
          //           on: {
          //             click: this.addRow
          //           }
          //         }
          //     );
          //   },
          //   width: '50px',
          //   slot: true
          // }, 
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
            prop: 'paramShowValue',
            slot: true
          }
        ]
      },
	  paramVisible:false,
	  listVisible:false,
	  curVariable:''
    };
  },
  mounted(){
	  this.notice=this.$t((this.type=='outParam'&&this.param.outputValType==1)?'useApiAssignObjectCollectionTypeParameter':(this.type=='outParam'&&this.param.outputValType===0)?'useApiAssignCharacterTypeParameters':'assignVariablesUsingApi')

	let obj=this.param[this.type=='varible'?'varValue':this.type=='process'?'processSetting':'outputValue'];
	if(obj){		
		this.formInline.url=obj.interfaceUrl||"";
		this.formInline.F_Id=obj.interfaceInfoId||'';
		this.formInline.field=obj.interfaceField||'';
		this.formInline.type=obj.method||0;
		this.apiVariable=obj.interfaceParams||[];
		if(obj.interfaceInfoId){
			getInterfaceById(obj.interfaceInfoId).then(res=>{
				if(res.data.data){
					let result=res.data.data
					let fields=result.F_Outputs||[];
					if(this.type!='process'){
						if(this.type=='outParam'&&this.param.outputValType==1){
							//对象集合
							this.outputParam=fields.filter(o=>{return o.F_Type==1})
						}else{
							//字符集合
							this.outputParam=fields.filter(o=>{return o.F_Type===0});
						}
						if(obj.interfaceField){
							let temp=this.outputParam.find(o=>{return o.F_OutputKey==obj.interfaceField})
							if(temp){
								this.iframeData.field=obj.interfaceField;
							}else{
								this.formInline.field="";
							}
						} 
					}
				}
			})	
		}
	}
  },
  methods: {

    submit(){
		this.$refs.formInline.validate(res=>{
			if(res){
				//验证通过
				this.$emit('changeData', {
					"interfaceUrl":this.formInline.url,
					"interfaceInfoId":this.formInline.F_Id,
					"interfaceField":this.formInline.field,
					"interfaceParams":this.apiVariable,
					"method":this.formInline.type
				});
				this.$emit('update:visible', false);
			}
		})		  
    },
    close(){
      this.$emit('update:visible', false);
    },
	variableValClick (row) {
		this.curVariable=row;
		if(row.paramValType==1){
			this.paramVisible=true;
		}
	},
	getAllInterface(){
		this.listVisible=true
	},
	changeData(data){
		this.curVariable.paramValue=data;
		this.curVariable.paramShowValue=data[0].label;
	},
	getUrl(data){
		if(data.F_Id){
			this.formInline.url=data.F_UrlAddress;
			this.formInline.type=data.F_RequestMethod;
			this.formInline.F_Id=data.F_Id;			
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
							paramValue: i.F_ParamValue,
							paramShowValue:i.F_ParamValue
						}
						this.apiVariable.push(obj)
					})
					if(this.type!='process'){
						if(this.type=='outParam'&&this.param.outputValType==1){
							//对象集合
							this.outputParam=fields.filter(o=>{return o.F_Type==1})
						}else{
							//字符集合
							this.outputParam=fields.filter(o=>{return o.F_Type===0});
						}
						let temp=this.outputParam.find(o=>{return o.F_OutputKey==this.formInline.field})
						if(!temp){
							this.formInline.field="";
						}
					}
				}
			})			
		}
	},
	changeParamShow(row){
		if(row.paramValType===0) row.paramValue=row.paramShowValue
	},
	paramValTypeChaneg(row){
		row.paramShowValue='';
		row.paramValue='';
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
