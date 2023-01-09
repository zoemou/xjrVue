<template>
  <div>
      <Header
          :controllerType="0"
		  :type="2"
          :active="active"
          @close="close"
          @prev="prev"
          @next="next"
          @codeFormSubmit="codeFormSubmit"
        ></Header>
    <div class="content">
    <div class="form">
       <component :is="getComponent"
        ref="steps"
        :curStep="active"
        :isNextStep="isNextStep"
        @onChange="onChildValue"
        />
    </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/QuickDevelopment/codeHeader/Index.vue';
import inputParameter from './inputParameter.vue';
import variable from './variable';
import interfaceConfig from './interfaceConfig.vue';
import outParameter from './outParameter.vue';
import outputConfig from './outputConfig.vue';
import { getDataItem } from '@/api/system/dataitem.js';
import { axiosMethod } from '@/util/util.js';
import store from '@/store/index';
import { mapGetters } from "vuex";
import { baseUrl } from '@/config/env.js';
import {addCustomizeInterface,updateCustomizeInterface  } from '@/api/systemManagement/interface.js';
export default {
  name: 'interfaceForm',
  // mixins:[],
  components: {
    Header,
    inputParameter,
    variable,
    interfaceConfig,
    outParameter,
    outputConfig
  },
  // props: {
   
  // },
    computed: {
		...mapGetters(["inputParameter","interfaceConfig","outParameter","outputConfig","variable"]),
		getComponent() {
		  if(this.active === 0){
			return 'inputParameter';
		  }else if(this.active === 1){
			return 'variable';
		  }else if(this.active === 2){
			return 'interfaceConfig'
		  }else if(this.active === 3){
			return 'outParameter'
		  }else if(this.active === 4){
			return 'outputConfig'
		  }
		}
  },
  data () {
    return {
      isNextStep:true,
      active: 0,
	  axiosMethod:axiosMethod
    };
  },
  created () {
  },
  watch: {
    
  },
  methods: {
    //生成随机 GUID 数
    guid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + S4() + S4() + S4() + S4());
    },
    prev () {
      --this.active;
      if (this.active < 0) this.active = 0;
      this.isNextStep = false;
    },
    async next () {
		let flag = true;
		if(this.active===0){
			for(let o of this.inputParameter){
				let patten=new RegExp('^[a-zA-Z_]([a-zA-Z0-9_-]+)?$');
				let patten2=new RegExp('^[a-zA-Z_]([a-zA-Z_-]+)?$');
				let method=axiosMethod.filter((x)=>{return x.value==o.paramType})[0]
				if(o.paramKey===""){
					this.$message({
					  message: (method.label)+'：'+this.$t('parameterNameCannotEmpty'),
					  type: 'warning'
					});
					flag = false;
					break;
				}
				if(method.value===0){
					if(!patten2.test(o.paramKey)){
						this.$message({
						  message: (method.label)+'：'+this.$t('parameterNameCanOnlyLettersUnderscoresDashes'),
						  type: 'warning'
						});
						flag = false;
						break;						
					}
				}else{
					if(!patten.test(o.paramKey)){
						this.$message({
						  message: (method.label)+'：'+this.$t('parameterNameCanOnlyEnterLetters'),
						  type: 'warning'
						});
						flag = false;
						break;						
					}
				}				
			}
		}
		if(this.active===1){
			for(let o of this.variable){
				if(o.varCode===""){
					this.$message({
					  message: this.$t('variableCodeCannotNull'),
					  type: 'warning'
					});
					flag = false;
					break;
				}
				if(o.varType==1&&(o.varValue===null||o.varValue===undefined||o.varValue==="")){
					this.$message({
					  message: this.$t('variableValueTypeParameterCannotNull'),
					  type: 'warning'
					});
					flag = false;
					break;
				}
				
				if(o.varType==2){
					var pattern =/[\'](.*?)[\']/gi;
					var r=/['](.*)[']/;
					let arr=o.varShowValue.match(pattern);
					if(arr){
						let arr2=[]
						arr.forEach(i=>{
							let s=i.match(r)[1];
							let t=s.split('.')
							if(t[0]=='接口入参') arr2.push(t[1])
						})
						for(let rs of arr2){	
							let obj=this.inputParameter.find(x=>{return rs==x.paramKey&&x.isChecked})
							if(!obj){
								this.$message({
								  message: this.$t('invalidInputParameterCurrentVariableAssignment'),
								  type: 'warning'
								});
								flag = false;
								break;
							}
						}
					}
				}
			}
		}
		if(this.active===2){
			this.interfaceConfig.forEach(o=>{
				if(o.isCustom){
					for(let i of o.nodeVarAssign){
						if(i.id===''||i.varType===''||i.varValue===''){
							this.$message({
							  message:this.$t('variableAssignmentTableAllDataEmpty'),
							  type: 'warning'
							});
							flag = false;
							break;
						}
						if(i.varType==1&&i.varValue.length>0&&i.varValue[0].parentId!=2){							
							let obj=this.inputParameter.find(x=>{return x.id==i.varValue[0].value&&x.isChecked})
							if(!obj){
								this.$message({
								  message:this.$t('invalidInputParameterCurrentVariableAssignment'),
								  type: 'warning'
								});
								flag = false;
								break;
							}
						}
						if(i.varType==2){
							var pattern =/[\'](.*?)[\']/gi;
							var r=/['](.*)[']/;
							let arr=i.varShowValue.match(pattern);
							if(arr){
								let arr2=[]
								arr.forEach(i=>{
									let s=i.match(r)[1];
									let t=s.split('.')
									if(t[0]=='接口入参') arr2.push(t[1])
								})
								for(let rs of arr2){	
									let obj=this.inputParameter.find(x=>{return rs==x.paramKey&&x.isChecked})
									if(!obj){
										this.$message({
										  message: this.$t('invalidInputParameterCurrentVariableAssignment'),
										  type: 'warning'
										});
										flag = false;
										break;
									}
								}	
							}
						}
					}
					for(let i of o.nodeProcess){
						if(i.processType===''||i.processSetting===''){
							this.$message({
							  message:this.$t('procedureProcessTableDataCannotEmpty'),
							  type: 'warning'
							});
							flag = false;
							break;
						}
						if(i.processType==1){
							var pattern =/[\'](.*?)[\']/gi;
							var r=/['](.*)[']/;
							let arr=i.showSetting.match(pattern);
							if(arr){
								let arr2=[],arr3=[]
								arr.forEach(i=>{
									let s=i.match(r)[1];
									let t=s.split('.')
									if(t[0]=='接口入参') arr2.push(t[1])
									if(t[0]=='接口变量') arr3.push(t[1])
								})
								for(let rs of arr2){	
									let obj=this.inputParameter.find(x=>{return rs==x.paramKey&&x.isChecked})
									if(!obj){
										this.$message({
										  message:this.$t('invalidInputParamerterUsedCurrentProcess'),
										  type: 'warning'
										});
										flag = false;
										break;
									}
								}
								for(let rs of arr3){
									let obj=this.variable.find(x=>{return rs==x.varCode})
									if(!obj){
										this.$message({
										  message:this.$t('invalidVariableParametersUsedCurrentProcess'),
										  type: 'warning'
										});
										flag = false;
										break;
									}
								}
							}
						}
					}					
				}
			})
		}
		if(this.active===3){
			for(let o of this.outParameter){
				if(o.outputSource===""){
					this.$message({
					  message: this.$t('outputParameterSourceCannotEmpty'),
					  type: 'warning'
					});
					flag = false;
					break;
				}
				
				if(o.outputSource==2){
					if(o.outputValType===''||o.outputCode===''||o.outputType===''||o.outputValue===''){
						this.$message({
						  message:this.$t('dataCustomParameterCannotEmpty'),
						  type: 'warning'
						});
						flag = false;
						break;
					}
					
					if(o.outputType==2){
						var pattern =/[\'](.*?)[\']/gi;
						var r=/['](.*)[']/;
						let arr=o.showValue.match(pattern);
						if(arr){
							let arr2=[],arr3=[]
							arr.forEach(i=>{
								let s=i.match(r)[1];
								let t=s.split('.')
								if(t[0]=='接口入参') arr2.push(t[1])
								if(t[0]=='接口变量') arr3.push(t[1])
							})
							
							for(let rs of arr2){	
								let obj=this.inputParameter.find(x=>{return rs==x.paramKey&&x.isChecked})
								if(!obj){
									this.$message({
									  message:this.$t('invalidInputParameterCustomParameterAssignment'),
									  type: 'warning'
									});
									flag = false;
									break;
								}
							}
							for(let rs of arr3){
								let obj=this.variable.find(x=>{return rs==x.varCode})
								if(!obj){
									this.$message({
									  message: this.$t('invalidVariableParameterCustomParameterAssignment'),
									  type: 'warning'
									});
									flag = false;
									break;
								}
							}
						}
					}
				}else{
					if(o.outputCode===""){
						this.$message({
						  message:this.$t('outputParameterEncodingCannotNull'),
						  type: 'warning'
						});
						flag = false;
						break;
					}					
				}
				let patten=new RegExp('^[a-zA-Z_]([a-zA-Z0-9_-]+)?$');
				if(!patten.test(o.outputCode)){
					this.$message({
					  message: this.$t('outputParameterCodeCanOnlyEnterLettersNumbersUnderscoresHorizontal'),
					  type: 'warning'
					});
					flag = false;
					break;						
				}
			}
		}
		if(!flag) return;
		this.active++;
		if (this.active > 4) this.active = 0;      
    },
    async codeFormSubmit () {
      let  validateData =  this.$refs['steps'].validateData();
	  
      if(validateData){
				  let submitData=this.outputConfig;
				  submitData.F_Settings={
					inputSetting:this.inputParameter,
					varSetting: this.variable,
					aopSetting: this.interfaceConfig,
					outputSetting: this.outParameter
				  }
				  if(submitData.F_Id){
					let res=await updateCustomizeInterface(submitData.F_Id,submitData)
					if(res.data.success){
					  this.$notify({
						  title:this.$t('deletePrompt.successTitle'),
						  message:this.$t('interfaceModificationSucceeded'),
						  type: 'success'
					  });
					}
				  }else{
					  let res=await addCustomizeInterface(submitData)
					  if(res.data.success){
						  this.$notify({
							  title:this.$t('deletePrompt.successTitle'),
							  message:this.$t('addedInterfaceSuccessfully'),
							  type: 'success'
						  });
					  }
				  }

				  this.close()
      }
    },
    close(){
      this.$emit('close');
    }
  },
};
</script>

<style scoped>
.main-container {
  height: 100%;
}
.content {
  padding: 4px 10px 10px 10px;
  background-color: #eeeeee;
  height: calc(100% - 72px);
}
.form {
  background-color: #fff;
  height: 100%;
}
</style>
