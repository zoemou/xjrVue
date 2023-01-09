<template>
	<div class="nodetabs">
	  <el-tabs v-model="activeName" @tab-click="handleClick">
		<el-tab-pane :label="$t('companyManager.titleBasicInformation')" name="first">
			<!-- 基本信息 -->
			<basicInfo :nodeinfo="nodeinfo"></basicInfo>
		</el-tab-pane>
		<el-tab-pane :label="$t('variableAssign')" name="second">
			<!-- 变量赋值 -->
			<avue-crud ref="queryTable" :data="nodeinfo.nodeVarAssign" :option="queryoption" stripe class="nodeinfotable">
			  <template slot="add" slot-scope="scope">
				<i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
			  </template>
			  <template slot="id" slot-scope="scope">
				  <el-select v-model="scope.row.id" :placeholder="$t('pleaseSelectVariable')" @change="varCodeChange">
					<el-option
						v-for="item in variable"
						:key="item.id"
						:label="item.varCode"
						:value="item.id">
					</el-option>
				  </el-select>      
			  </template>
			  <template slot="varType" slot-scope="scope">
				<el-select v-model="scope.row.varType" :placeholder="$t('selectVariableType')" @change="changeVarType(scope.row)">
				  <el-option
					  v-for="item in varibleType"
					  :key="item.value"
					  :label="$t(item.label)"
					  :value="item.value">
				  </el-option>
				</el-select>
			  </template>
			  <template slot="varValue" slot-scope="scope">
				<el-input :value="scope.row.varType==1?getShowValue(scope.row):scope.row.varShowValue" suffix-icon="el-icon-more"
				:placeholder="$t('configVariableValues')" @focus="variableValClick(scope.row)" @blur="setVarValue(scope.row)"
				  :style="{display:scope.row.varType>0?'block':'none'}"></el-input>
				<el-input v-model="scope.row.varValue" :style="scope.row.varType<=0?'':{display: 'none'}" :placeholder="$t('configVariableValues')"></el-input>
			  </template> 
			</avue-crud>
			<el-link type="danger" :underline="false" style="font-size:12px">{{$t('parameterAssignReferSecondaryAssignParmProcessStart')}}</el-link>
		</el-tab-pane>
		<el-tab-pane :label="$t('processing')" name="third">
			<!-- 过程处理 -->
			<avue-crud ref="queryTable" :data="nodeinfo.nodeProcess" :option="nodeProcessOption"
			stripe @sortable-change="sortableChange" class="nodeProcess">
			  <template slot="add" slot-scope="scope">
			    <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
			  </template>
			  <template slot="processLog" slot-scope="scope">
			    <el-checkbox v-model="scope.row.processLog"></el-checkbox>
			  </template>
			  <template slot="processType" slot-scope="scope">
			    <el-select v-model="scope.row.processType" :placeholder="$t('selectOperationType')" @change="processTypeChange(scope)">
			      <el-option :label="$t('executeApi')" :value="0"></el-option>
				  <el-option :label="$t('executeSql')" :value="1"></el-option>
			    </el-select>
			  </template>
			  <template slot="showSetting" slot-scope="scope">
			  	 <el-input v-model="scope.row.showSetting" 
				 :placeholder="$t(scope.row.processType===0?'pleaseConfigApi':scope.row.processType===1?'pleaseConfigSqlStatement':'selectActionCategoryBeforeConfigAction')" 
				 suffix-icon="el-icon-more"
				 @focus="settingClick(scope.row)"></el-input>        
			  </template>
			</avue-crud>
			<el-link type="danger" :underline="false" style="font-size:12px">{{$t('processPerformedOrderOperationAcoidError')}}</el-link>
		</el-tab-pane>
	  </el-tabs>
	  <param-dialog v-if="paramVisible" :visible.sync="paramVisible" @changeData="changeData" :param="curVariable"></param-dialog>
	  <sql-dialog v-if="sqlVisible" :visible.sync="sqlVisible" @changeData="changeData" 
	  :isShowParam="activeName==='third'"
	  :type="activeName=='second'?'varible':'process'" :param="curVariable"></sql-dialog>
	  <api-dialog v-if="apiVisible" :visible.sync="apiVisible" @changeData="changeData" 
	  :isShowParam="activeName==='third'" :parentId="outputConfig.F_Id"
	  :type="activeName=='second'?'varible':'process'" :param="curVariable"></api-dialog>
	</div>
</template>
<script>
  import paramDialog from './paramDialog.vue';
  import sqlDialog from './sqlDialog.vue';
  import apiDialog from './apiDialog.vue';
  import basicInfo from './basicInfo.vue';
  import store from '@/store';
  import { mapGetters } from "vuex";
  import { varibleType } from '@/util/util';
  export default {
	props:['nodeinfo'],
	computed: {
	  ...mapGetters(["variable","outputConfig","inputParameter"]),
	},
	components: {basicInfo,paramDialog,sqlDialog,apiDialog},
    data() {
      return {
		paramVisible:false,
		sqlVisible:false,
		apiVisible:false,
        activeName: 'first',
		varibleType:varibleType,
		curVariable:'',
		queryoption: {
		  highlightCurrentRow: true,
		  stripe: true,
		  calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
		  height: '100%',//表格高度
		  maxHeight: '100%',
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
		    }, {
		      label:this.$t('selectVariable'),
		      prop: 'id',
		      slot: true
		    },
		    {
		      label: this.$t('variableType'),
		      prop: 'varType',
		      slot: true
		    }, 
			{
		      label: this.$t('variableValue'),
		      prop: 'varValue',
		      slot: true
		    }
		  ]
		},
		nodeProcessOption:{
		  highlightCurrentRow: true,
		  stripe: true,
		  calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
		  height: '100%',//表格高度
		  maxHeight: 'auto',
		  border: true,
		  align: 'center',
		  menu: false,
		  page: false,
		  sortable: true,
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
		                click: this.addProcessRow
		              }
		            }
		        );
		      },
		      width: '50px',
		      slot: true
		    },
		    {
		      label: this.$t('log'),
		      prop: 'processLog',
		      width: '50px',
		      slot: true
		    }, {
		      label:this.$t('operateClass'),
		      prop: 'processType',
		      slot: true
		    },
		    {
		      label: this.$t('operateConfig'),
		      prop: 'showSetting',
		      slot: true
		    }
		  ]	
		}
	  };
    },
	created() {
		this.nodeinfo.nodeVarAssign.forEach((o,x)=>{
			let obj=this.variable.find(i=>{return i.id==o.id})
			if(obj){
				o.varCode=obj.varCode;
			}else{
				if(o.varCode){
					this.$notify({
					  title:this.$t('deletePrompt.promptTitle'),
					  message: o.varCode+this.$t('variableHasBeenDeleted'),
					  type: 'warning',
					  duration:0
					});
					this.nodeinfo.nodeVarAssign.splice(x,1)
				}
			}
		})	
	},
    methods: {
      handleClick(tab, event) {
      },
	  deleteData (scope) {
		if(this.activeName=='second'){
			this.nodeinfo.nodeVarAssign.splice(scope.row.$index, 1);
		}else if(this.activeName=='third'){
			this.nodeinfo.nodeProcess.splice(scope.row.$index, 1);
		}	    
	  },
	  getShowValue(row){
	  	let data=row.varValue;
	  	if(data&&data[0]?.parentId===0){
	  		let temp=this.inputParameter.find(o=>{return data[0].value==o.id});
	  		if(temp){
	  			data[0].label=temp.paramKey;
	  			row.varShowValue=temp.paramKey;
	  		}else{
	  			row.varValue='';
	  			row.varShowValue=""				
	  		}
	  	}
	  	return row.varShowValue
	  },
	  addRow () {
	    var obj = {
		  id:'',
	      varCode:'',
	      varType: '',
	      varValue: '',
	  	  varShowValue:''
	    };
	    this.nodeinfo.nodeVarAssign.push(obj);
	  },
	  addProcessRow(){
		  var obj = {
		    processLog:'',
		    processType: '',
		    processSetting: '',
			showSetting:''
		  };
		  this.nodeinfo.nodeProcess.push(obj);
	  },
	  varCodeChange(data){		  
		  let obj=this.variable.find(o=>{return o.id==data})
		  if(obj){
			  this.nodeinfo.nodeVarAssign.forEach(o=>{
				  if(o.id==data) o.varCode=obj.varCode;
			  })
		  }
	  },
	  variableValClick (row) {
		this.curVariable=row;
	  	if(row.varType==1){
	  		this.paramVisible=true;
	  	}else if(row.varType==2){
	  		this.sqlVisible=true;
	  	}else if(row.varType==3){
	  		this.apiVisible=true;
	  	}
	  },
	  setVarValue(row){
		if(row.varType===0){
			row.varValue=row.varShowValue;
		}
	  },
	  changeData(data){
		if(this.activeName==='second'){
			this.curVariable.varValue=data;
			this.curVariable.varShowValue=this.curVariable.varType==0?data:
			this.curVariable.varType==1?data[0].label:this.curVariable.varType==2?data.sql:this.curVariable.varType==3?data.interfaceUrl:''
		}else if(this.activeName==='third'){
			this.curVariable.processSetting=data;
			this.curVariable.showSetting=this.curVariable.processType==0?data.interfaceUrl:this.curVariable.processType==1?data.sql:''
		}
	  	
	  },
	  settingClick(row){
		  this.curVariable=row;
		  if(row.processType===0){
		  	this.apiVisible=true;
		  }else if(row.processType===1){
		  	this.sqlVisible=true;
		  }
	  },
	  sortableChange (oldindex, newindex, row, list) {
	    this.nodeinfo.nodeProcess = [];
	    this.$nextTick(() => {
	      this.nodeinfo.nodeProcess = list;
	    });
	  },
	  processTypeChange(scope){
		  scope.row.processSetting='';
		  scope.row.showSetting='';
	  },
	  changeVarType(row){
		  row.varValue= '';
	  	  row.varShowValue=''
	  }
    }
  };
</script>

<style scoped>
	::v-deep .el-tabs{
		height: 100%;
	}
	.nodetabs{
		height: calc(100% - 40px);
	}
	::v-deep .el-tabs__content{
		height: calc(100% - 55px);
	}
	::v-deep .el-tab-pane{
		height: 100%;
	}
	.nodeinfotable{
		height: calc(100% - 100px);
	}
	.nodeProcess{
		height: calc(100% - 100px);
	}
</style>
