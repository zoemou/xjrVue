<template>
  <div class="main-container">
	<div class="crudTitle">{{$t('workFlow.zh.variable')}}</div>
    <avue-crud ref="queryTable" :data="variable" :option="queryoption" stripe>
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
      </template>
      <template slot="varCode" slot-scope="scope">
		  <el-input v-model="scope.row.varCode" :placeholder="$t('fillInVariableCode')" @blur="varCodeBlur(scope.row)"></el-input>        
      </template>
	  <template slot="varType" slot-scope="scope">
	    <el-select v-model="scope.row.varType" :placeholder="$t('selectVariableType')" @change="changeVarType(scope.row)">
	      <el-option
	          v-for="item in DateFieldOptions"
	          :key="item.value"
	          :label="$t(item.label)"
	          :value="item.value">
	      </el-option>
	    </el-select>
	  </template>
      <template slot="varValue" slot-scope="scope">
		<el-input :value="scope.row.varType==1?getShowValue(scope.row):scope.row.varShowValue" suffix-icon="el-icon-more"
		:placeholder="$t(scope.row.varType===''||scope.row.varType===null?'selectVariableTypeBeforeManipulatingVariableValue':'fillInClickConfigVariableValues')" 
		:readonly="scope.row.varType===''||scope.row.varType===null"  :style="{display:scope.row.varType>0?'block':'none'}"
		@focus="variableValClick(scope.row)" @change="changeShowVal(scope.row)"></el-input>
        <el-input v-model="scope.row.varValue" :style="scope.row.varType<=0?'':{display: 'none'}" :placeholder="$t(scope.row.varType===''||scope.row.varType===null?'selectVariableTypeBeforeManipulatingVariableValue':'fillInClickConfigVariableValues')" 
		:readonly="scope.row.varType===''||scope.row.varType===null" ></el-input>
      </template>      
	  <template slot="varDes" slot-scope="scope">
	  	 <el-input v-model="scope.row.varDes" :placeholder="$t('workFlow.addStamp.placeholderRemark')"></el-input>        
	  </template>
    </avue-crud>
	
	<param-dialog v-if="paramVisible" :visible.sync="paramVisible" @changeData="changeData" :param="curVariable"></param-dialog>
	<sql-dialog v-if="sqlVisible" :visible.sync="sqlVisible" @changeData="changeData" type="varible" :param="curVariable"></sql-dialog>
	<api-dialog v-if="apiVisible" :visible.sync="apiVisible" @changeData="changeData" type="varible" :param="curVariable" :parentId="outputConfig.F_Id"></api-dialog>
  </div>
</template>

<script>
import paramDialog from '../component/paramDialog.vue';
import sqlDialog from '../component/sqlDialog.vue';
import apiDialog from '../component/apiDialog.vue';
import store from '@/store';
import { mapGetters } from "vuex";
import { varibleType } from '@/util/util';

export default {
  props: [
    'curStep'
  ],
  computed: {
    ...mapGetters(["inputParameter","variable","outputConfig"]),
  },
  components: {paramDialog,sqlDialog,apiDialog},
  data () {
    return {
	  paramVisible:false,
	  sqlVisible:false,
	  apiVisible:false,
      DateFieldOptions: varibleType,
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
          }, {
            label:this.$t('variableEncoding'),
            prop: 'varCode',
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
          }, {
            label: this.$t('orgUserManagement.tabRemark'),
            prop: 'varDes',
            slot: true
          }
        ]
      },
	  curVariable:''
    };
  },
  methods: {
    deleteData (scope) {
      this.variable.splice(scope.row.$index, 1);
    },
    addRow () {
      var obj = {
		id:new Date().getTime()+(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        varCode:'',
        varType: '',
        varValue: '',
		varShowValue:'',
        varDes: ''
      };
      this.variable.push(obj);
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
	changeData(data){
		this.curVariable.varValue=data;
		this.curVariable.varShowValue=this.curVariable.varType==0?data:
		this.curVariable.varType==1?(data[0]?.label||''):this.curVariable.varType==2?data.sql:this.curVariable.varType==3?data.interfaceUrl:''
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
	changeVarType(row){
		row.varValue="";
		row.varShowValue=""
	},
	varCodeBlur(row){
		if(!/^[A-Za-z_]+$/.test(row.varCode)){
			this.$message({
			  message:this.$t('variableEncodingSupportsOnlyEnglishAndUnderscores'),
			  type: "warning",
			});
			row.varCode='';
		}		
	},
	changeShowVal(row){
		if(row.varType===0) row.varValue=row.varShowValue
	}
  },
  created () {
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
