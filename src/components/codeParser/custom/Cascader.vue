<template>
	<div>
  <el-cascader
    v-model="code"
    :props="defaultProps"
    :disabled="disabled"
    @change="changeValue"
    style="width:100%;"
    :clearable="clearable"
  	:separator="separator"
  	:show-all-levels="showAllLevels"
  	v-if="show"
  ></el-cascader>
  </div>
</template>

<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
	  value: {
	    type: Array | String,
	    default: []
	  },
    fieldsIndex: {
      type: Number,
      required: true
    },
    formConf: {
      type: Object,
      required: true
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
    },
    // 1 新增 2 查看 3 编辑
    isEdit: {
      type: Number,
      default: 1
    }
  },
  watch:{
	settings:{
		immediate:true,
		deep:true,
		handler(v){
			this.show=false
			if(v.length>0){
			  this.defaultProps.lazyLoad=function(node, resolve){
				const { level,value } = node;
				 const settings = v;				 
				 let idx=level;

				 getDataBySQL(settings[idx]["dataSource"],{
					 'field':settings[idx]['parentId'],
					 'value':value
			     }).then(resp=>{
					let { data } = resp.data;
					const nodes=data.map(item => ({
						 value: item[settings[idx]['saveField']].toString(),
						 label: item[settings[idx]['showField']],
						 leaf: level >= settings.length-1
					}));   
					resolve(nodes);
				}).catch(err=>{})
			  }			  			  
			}
			setTimeout(() => {
			     this.show=true
			}, 200);
		}
	  }
  },
  data() {
    return {
      code: [],
	  show:true,
	  disabled:false,
	  clearable:true,
	  separator:'/',
	  showAllLevels:true,
	  settings:[],
	  validateErrorTemplate:'',
	  defaultProps:{
			checkStrictly: false,
		  lazy: true,
		  lazyLoad (node, resolve) { 
			const { level } = node;
				let nodes = [];
				if(level==0){
				  nodes = [{
					  id: 1,
					  value: 1,
					  label: '选项1'
				  }]
				}else if(level==1){
				   nodes = [{
					id: 2,
					value: 2,
					label: '选项1-1',
					leaf:true
				  }]				  
				}
				// 通过调用resolve将子节点数据返回，通知组件数据加载完成
				resolve(nodes);
		  }
		}
    };
  },
  created() {
   if (this.tabChildren && this.tabChildren.length) {
     this.confFields = this.tabChildren;
   } else {
     this.confFields = this.formConf.fields;
   }
   let config=this.confFields[this.fieldsIndex]
   
   let value=config.__config__.defaultValue
   if(value){
      if (Array.isArray(value)) {
			this.code = value;
			} else {
				this.code = value.split(",");
			}
			this.setValue();
    }

   //是否为查看
   if (this.isEdit == 2) {
     this.confFields[this.fieldsIndex].disabled = true;
   }
   this.settings=config.__config__.settings;
   this.disabled=config.disabled;
   this.clearable=config.clearable;
   this.separator=config.separator;
   this.showAllLevels=config['show-all-levels'];
	 this.defaultProps.checkStrictly = config['checkStrictly'];
  },
  methods: {
    changeValue(val) {
	  this.confFields[this.fieldsIndex].__config__.defaultValue=val;
		this.setValue();
		this.handleTriggerEvent('change');
	  this.$emit("input", val);
    },
  }
};
</script>

<style lang="scss" scoped></style>
