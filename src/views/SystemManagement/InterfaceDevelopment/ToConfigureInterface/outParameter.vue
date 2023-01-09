<template>
  <div class="main-container">
	<div class="crudTitle">{{$t('workFlow.zh.outputParameter')}}</div>
    <avue-crud ref="queryTable" :data="outParameter" :option="queryoption" stripe>
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
      </template>
      <template slot="isChecked" slot-scope="scope">
        <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
      </template>
      <template slot="outputSource" slot-scope="scope">
		  <el-select v-model="scope.row.outputSource" :placeholder="$t('selectOutputParamterSource')" @change="CodeChange(scope.row)">
		    <el-option
		        v-for="item in SourceOptions"
		        :key="item.value"
		        :label="$t(item.label)"
		        :value="item.value">
		    </el-option>
		  </el-select>      
      </template>
	  <template slot="outputValType" slot-scope="scope">
		<div v-if="scope.row.outputSource===''||scope.row.outputSource===null" style="color:#ccc">{{$t('selectParameterSourceFirst')}}</div>  
		  <el-select v-model="scope.row.outputValType" :placeholder="$t('selectDataCategory')" v-else-if="scope.row.outputSource==2" @change="changeValType(scope.row)">
			<el-option :label="$t('editorModule.characters')" :value="0"></el-option>
			<el-option :label="$t('objectCollection')" :value="1"></el-option>
		  </el-select>  
		<div v-else>{{$t('editorModule.characters')}}</div> 
	  </template>
      <template slot="outputCode" slot-scope="scope">
		<el-select v-model="scope.row.outputCode" v-if="scope.row.outputSource===0" clearable :placeholder="$t('selectInterfaceInputParamterOutputParamter')">
		  <el-option
		      v-for="item in inputParameterfilter"
		      :key="item.id"
		      :label="item.paramKey"
		      :value="item.paramKey">
		  </el-option>
		</el-select>  
		<el-select v-model="scope.row.outputCode" v-else-if="scope.row.outputSource===1" clearable :placeholder="$t('selectInterfaceVariableOutputParamter')">
		  <el-option
		      v-for="item in variable"
		      :key="item.varCode"
		      :label="item.varCode"
		      :value="item.varCode">
		  </el-option>
		</el-select>
        <el-input v-model="scope.row.outputCode" v-else-if="scope.row.outputSource===2" :placeholder="$t(scope.row.outputValType==1?'clickConginObjectCollectionInfor':'enterCustomOutputCode')"
		:suffix-icon="scope.row.outputValType==1?'el-icon-more':''"
		@focus="outputCodeClick(scope.row)"></el-input>
		<el-input v-model="scope.row.outputCode" v-else readonly :placeholder="$t('selectParameterCotegoryBeforeProceeding')"></el-input>
      </template>
      <template slot="outputType" slot-scope="scope">
		<div v-if="scope.row.outputValType===''||scope.row.outputValType===null" style="color:#ccc">{{$t('selectDataCategoryFirst')}}</div>  
        <el-select v-model="scope.row.outputType" v-else-if="scope.row.outputSource===2&&scope.row.outputValType===0" :placeholder="$t('selectCustomOutputCategory')" @change="TypeChange(scope.row)">
          <el-option
              v-for="item in DateFieldOptions"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value">
          </el-option>
        </el-select>
		<el-select v-model="scope.row.outputType" v-else-if="scope.row.outputSource===2&&scope.row.outputValType===1" :placeholder="$t('selectCustomOutputCategory')" @change="TypeChange(scope.row)">
		  <el-option
		      v-for="item in objFieldOptions"
		      :key="item.value"
		      :label="$t(item.label)"
		      :value="item.value">
		  </el-option>
		</el-select>
		<div v-else-if="scope.row.outputType<0"></div>  
      </template>
	  <template slot="outputValue" slot-scope="scope" v-if="scope.row.outputSource==2">
		<block v-if="scope.row.outputType>=0&&scope.row.outputSource!=null">
			<el-input :value="scope.row.outputType==1?getShowValue(scope.row):scope.row.showValue" suffix-icon="el-icon-more"
			:placeholder="$t('fillInClickConfigCustomOutputParamters')" :style="{display:scope.row.outputType>0?'block':'none'}"
			@focus="variableValClick(scope.row)" @change="showValueChange(scope.row)"></el-input>
			<el-input v-model="scope.row.outputValue" :style="scope.row.outputType<=0?'':{display: 'none'}" :placeholder="$t('fillInClickConfigCustomOutputParamters')"></el-input>
		</block>	    
		<el-input v-model="scope.row.outputValue" v-else readonly :placeholder="$t('selectCustomOutputCategoryBeforeProceed')"></el-input>
	  </template>
    </avue-crud>
	
	<param-dialog v-if="paramVisible" :visible.sync="paramVisible" @changeData="changeData" :isShowParam="isShowParam" :param="curVariable"></param-dialog>
	<sql-dialog v-if="sqlVisible" :visible.sync="sqlVisible" @changeData="changeData" :isShowParam="isShowParam" type='outParam' :param="curVariable"></sql-dialog>
	<api-dialog v-if="apiVisible" :visible.sync="apiVisible" @changeData="changeData" :isShowParam="isShowParam" type='outParam' :param="curVariable" :parentId="outputConfig.F_Id"></api-dialog>
	<objParamDialog v-if="objParamVisible" :visible.sync="objParamVisible" @changeData="changeObjParamData" :param="curVariable"></objParamDialog>
  </div>
</template>

<script>
import store from '@/store';
import { mapGetters } from "vuex";
import { varibleType,SourceOptions } from '@/util/util';
import paramDialog from '../component/paramDialog.vue';
import sqlDialog from '../component/sqlDialog.vue';
import apiDialog from '../component/apiDialog.vue';
import objParamDialog from '../component/objParamDialog.vue';
export default {
  props: [
    'curStep'
  ],
  computed: {
    ...mapGetters(["outParameter","inputParameter","variable","outputConfig"]),
  },
  components: {paramDialog,sqlDialog,apiDialog,objParamDialog},
  data () {
    return {
	  paramVisible:false,
	  sqlVisible:false,
	  apiVisible:false,
	  isShowParam:true,
	  objParamVisible:false,
	  SourceOptions:SourceOptions,
      DateFieldOptions:varibleType,
	  objFieldOptions:varibleType.filter(o=>{return o.value==2||o.value==3}),
	  inputParameterfilter:[],
	  curVariable:'',
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
          {
            label: '',
            prop: 'add',
            renderHeader: (h) => {
              return h('i',
                  {
                    style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                    class: 'el-icon-circle-plus',
                    on: {
                      click: this.addRow
                    }
                  }
              );
            },
            width: '50px',
            slot: true
          },
          {
            label: this.$t('workFlow.User.tableSelect'),
            prop: 'isChecked',
            width: '60px',
            slot: true
          }, {
            label:this.$t('outputParameterSource'),
            prop: 'outputSource',
            slot: true
          },
		  {
			label:this.$t('outputParameterDataCategory'),
			prop:'outputValType',
            slot: true,
			align:'left'
		  },
          {
            label: this.$t('outputParameterCode'),
            prop: 'outputCode',
            slot: true
          }, 
		  {
            label: this.$t('customOutputCategory'),
            prop: 'outputType',
            slot: true,
			align:'left'
          },{
			label: this.$t('customOutParameterValue'),
			prop:'outputValue',
			slot:true
		  }
        ]
      }
    };
  },
  methods: {
    deleteData (scope) {
      this.outParameter.splice(scope.row.$index, 1);
    },
    addRow () {
      var obj = {
        isChecked: true,
        outputSource:'',
		outputValType: '',
        outputCode: '',
		outputSaveCode: '',
        outputType: -1,
		outputValue:'',
		showValue:''
      };
      this.outParameter.push(obj);
    },
	variableValClick (row) {
		this.curVariable=row;
		if(row.outputType==1){
			this.paramVisible=true;
		}else if(row.outputType==2){
			this.sqlVisible=true;
		}else if(row.outputType==3){
			this.apiVisible=true;
		}
	},
	changeData(data){
		this.curVariable.outputValue=data;
		this.curVariable.showValue=this.curVariable.outputType==1?data[0].label:this.curVariable.outputType==2?data.sql:this.curVariable.outputType==3?data.interfaceUrl:''
	},
	CodeChange(row){
		row.outputCode='';
		row.outputValType=row.outputSource===0||row.outputSource===1?0:'';
		row.outputType= row.outputSource===0||row.outputSource===1?-1:'';
		row.outputValue='';
		row.showValue=''
	},
	TypeChange(row){
		row.outputValue='';
		row.showValue=''
	},
	outputCodeClick(row){
		this.curVariable=row;
		if(row.outputValType==1){
			this.objParamVisible=true;
		}
	},
	changeObjParamData(data){
		this.curVariable.outputCode=data.outputObjName;
		this.curVariable.outputSaveCode=data;
	},
	showValueChange(row){
		if(row.outputType===0){
			row.outputValue=row.showValue
		}
	},
	getShowValue(row){
		let data=row.outputValue;
		if(data){
			if(data[0]?.parentId===0){
				let temp=this.inputParameter.find(o=>{return data[0].value==o.id});
				if(temp){
					data[0].label=temp.paramKey;
					row.showValue=temp.paramKey;
				}else{
					row.outputValue='';
					row.showValue=""				
				}
			}
			if(data[0]?.parentId===1){
				let temp=this.variable.find(o=>{return data[0].value==o.id});
				if(temp){
					data[0].label=temp.varCode;
					row.showValue=temp.varCode;
				}else{
					row.outputValue='';
					row.showValue=""				
				}
			}
		}
		return row.showValue
	},
	changeValType(row){
		if(row.outputValType==1&&(row.outputType===0||row.outputType==1)){
			row.outputType="";
			row.outputValue="";
			row.showValue=""
		}		
	}
  },
  created () {	  
	   this.inputParameter.forEach(it=>{
		if(it.isChecked){
			this.inputParameterfilter.push(it)
		}
	   })
	   this.outParameter.forEach(o=>{
		  if(o.outputSource===0){
			  let temp=this.inputParameterfilter.find(x=>{
				  return x.paramKey==o.outputCode
			  })
			  if(!temp){
				  o.outputCode=""
			  }
		  }
		  if(o.outputSource===1){
			  let temp=this.variable.find(x=>{
				  return x.varCode==o.outputCode
			  })
			  if(!temp){
				  o.outputCode=""
			  }
		  }
	   })
  }
};
</script>

<style scoped>
.avue-crud {
  height: calc(100% - 64px);
  margin: 0 10px 10px;
  width: auto;
}
.crudTitle{
	border-bottom: 1px solid #C0C5CE;
	padding:15px 0 8px;
	font-size: 14px;
	font-weight: bold;
	margin: 0 10px 10px;
}
</style>
