<template>
  <div class="">
    <el-dialog v-dialogDrag
      v-bind="$attrs"
      width="980px"
      :close-on-click-modal="false"
      append-to-body
      :before-close="close"
    >
      <div slot="title">
        {{$t('assignVariablesUsingSqlStatements')}}
      </div>
	  <el-form :model="formInline" :rules="rule" style="padding: 0 10px 0 0;" ref="formline" label-width="80px">
		<el-row>
			<el-col :span="24">
				<el-form-item :label="$t('mobileDev.homeRightSide.labelDatabase')" prop="selectDbId">
				  <el-cascader
					v-model="formInline.selectDbId"
					ref="cascader"
					:props="{
					  expandTrigger: 'hover',
					  value: 'F_DatabaseLinkId',
					  label: 'F_DBName',
					  emitPath:false
					}"
					:placeholder="$t('databaseManage.dataSource.addModalSelectDatabase')"
					expand-trigger="hover"
					:options="databaseGroup"
					:show-all-levels="false"
					clearable
					filterable
					style="width: 100%;line-height:27px;"
				  ></el-cascader>
				</el-form-item>
			</el-col>
		</el-row>
	  </el-form>
      <div class="content dialog-box">
		  
          <div class="left">

						  <el-tree
								:data="treeData"
								:props="defaultProps"
								@node-click="handleDragEnd"
							>
							</el-tree>

          </div>
          <div v-if="type=='varible'||type=='outParam'" class="config-detail">
            <div>{{$t('mobileDev.tableSet.labelSQL')}}</div>
            <draggable class="result-config" style="height:60%">
              <template>
								  <CodemirrorSql 
										:placeholder="placeholder"
											v-model="SQLStr"
											ref="sql"
          					></CodemirrorSql>
              </template>
            </draggable>
			<el-button type="primary" @click="verifySQL()" style="width:60%;margin:0 auto;display:block">{{$t('code.codeStepFour.verifyStatement')}}</el-button>
			<template v-if="type=='varible'||(type=='outParam'&&param.outputValType===0)">
				<div>{{$t('mobileDev.formRightSide.labelBindField')}}</div>
				<el-select v-model="bindField" :placeholder="$t('verifyStatementSuccessAfterSelectBoundField')" v-if="bindFieldOption.length>0&&SQLStr" style="display:block">
					<el-option
					  v-for="item in bindFieldOption"
					  :key="item"
					  :label="item"
					  :value="item">
					</el-option>
				</el-select>
				<el-input :placeholder="$t('verifyStatementSuccessBindFieldCannotCorrectlyObtainedInputParameter')" v-model='bindField' v-else></el-input>			
				<el-link type="danger" :underline="false" style="font-size:12px">{{$t('hintAfterSelectBoundField')}}</el-link>
			</template>
          </div>
		  <div v-else class="config-detail">
		    <draggable style="height: 100%;" :sort="true">
		      <template>
						 <CodemirrorSql 
										:placeholder="placeholder"
											v-model="SQLStr"
											ref="sql"
          					></CodemirrorSql>
		      </template>
		    </draggable>
			<el-button type="primary" v-if="type!='process'" @click="verifySQL()" style="width:60%;margin:0 auto;display:block">{{$t('code.codeStepFour.verifyStatement')}}</el-button>					
		  </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"
                   @click="close()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button type="primary"
                   @click="submit"
                   size="small">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import draggable from "vuedraggable";
import paramMixin from "./paramMixin.js";
import {
  getDbGroup
} from "@/api/databasemanage/datasource";
import {getDbFieldBySQL
} from "@/api/databasemanage/databaselink";
import CodemirrorSql from "@/components/common/CodemirrorSql";
import {
  deepClone
} from '@/util/util';
export default {
  components: {
    draggable,
		CodemirrorSql
  },
  mixins: [paramMixin],
  props: ['type'],
  data() {
    return {
      databaseGroup: [],
	  rule: {
		selectDbId: [
		  { required: true, message: this.$t('workFlow.selectSql.hintSelectData'), trigger: 'change' }
		]
	  },
	  formInline:{
		  selectDbId:''
	  },
	  selectDbId:'',
	  bindFieldOption:[],
	  bindField:'',
	  placeholder:this.$t("fillSqlStatementDropVariablesLeftAddVariables"),
	  placeholderVar:this.$t("clickEditCustomSqlStatementClickVariableLeftAddVariable"),
      SQLStr:''
	};
  },
  async mounted(){
		let obj=this.param[this.type=='varible'?'varValue':this.type=='process'?'processSetting':'outputValue'];
		if(obj){		
			this.formInline.selectDbId=obj.dbId||"";
			this.SQLStr=obj.sql||'';
			if(this.type=='varible'||(this.type=='outParam'&&this.param.outputValType===0)){			
				if(obj.sql&&obj.dbId){
					this.getField()
				}
				this.bindField=obj.field||'';
			}
		}
    let res = await getDbGroup();
    this.FormatTree(res.data.data);

  },
  methods: {
    FormatTree(data) {
      for (var item in data) {
      	if(item=='localhost'){
      	  this.databaseGroup.unshift({
      		  F_DBName: data[item][0].F_DBName,
      		  F_DatabaseLinkId: data[item][0].F_DatabaseLinkId
      	  })
      	}else{
      	  let obj = {
      		F_DatabaseLinkId: item,
      		F_DBName: item,
      		disabled: false,
      		children: []
      	  };
      
      	  if (data[item]) {
      		data[item].forEach(it => {
      		  it.F_DBName = it.F_DBAlias;
      		  it.F_DatabaseLinkId = it.F_DatabaseLinkId;
      		  obj.children.push(it);
      		});
      	  }
      	  this.databaseGroup.push(obj);
         }
      }
    },
    submit(){		
		if(this.SQLStr){
			this.$refs.formline.validate(res=>{
				if(res){
					//验证通过
					this.$emit('changeData',{
					  dbId:this.formInline.selectDbId,
					  sql:this.SQLStr,
					  field:this.bindField
					})
					this.$emit('update:visible', false);
				}
			})
		}
    },
    close(){
      this.$emit('update:visible', false);
    },
	handleDragEnd(data) {
		if (data.drag) {
				this.$refs.sql.insertVariable("'"+data.parent+'.'+data.label+"'");
    }
		
	},
	verifySQL(){
		this.$refs.formline.validate(res=>{
			if(this.SQLStr===''){
				this.$message({
				  showClose: true,
				  message: this.$t('workFlow.selectSql.hintSqlStatement'),
				  type: 'error'
				});
				return;
			}
			if(res){
				//验证通过
				this.getField()
			}
		})
	},
	getField(){
		getDbFieldBySQL(this.formInline.selectDbId,{sql:`${this.SQLStr}`}).then(result=>{			
			this.bindFieldOption=result.data.data||[];
			if(result.data.success){
				this.$message({
				  showClose: true,
				  message: this.$t('code.codeStepFour.hintVerifySuccess'),
				  type: 'success'
				});
			}
		}).catch(()=>{
			this.bindFieldOption=[]
		})
	}
  }
};
</script>
<style lang="scss" scoped>

  ::v-deep .el-dialog {
	background-color: #fff!important;  
    border-radius: 2px;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    height:calc(100% - 30vh);
    overflow: hidden;
    box-sizing: border-box;
    .el-dialog__header {
      padding-top: 14px;
	  color: #303133;
	  font-weight: bold;
    }
    .el-dialog__body {
      padding: 0;
	  height:calc(100% - 90px);
    }
  }
  .content {
    border: 1px solid #dcdfe6;
    margin: 10px;
    display: flex;
    border-radius: 3px 0px 0px 0px;
	height: calc(100% - 70px);
    .left{
      width: 300px;
      border-right: 1px solid #dcdfe6;
	  height: 100%;
	  overflow: auto;
    }
    .config-detail{
      flex: 1;
      border-radius: 0px 0px 3px 0px;
	  padding: 10px;
	  ::v-deep .el-textarea{
		  height: 100%;
		  
	  }
	  ::v-deep .el-textarea__inner{
	  	height: 100%;
	  }
	  .result-config{
	    padding: 10px;   
	  }
    }
  }

</style>
