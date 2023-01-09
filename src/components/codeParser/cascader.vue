<template>
	<div>
  <el-cascader
		:key="key"
    v-model="code"
    :props="defaultProps"
    :disabled="disabled"
    @change="changeValue"
    style="width:100%;"
    :clearable="clearable"
  	:separator="separator"
  	:show-all-levels="showAllLevels"
		:placeholder="placeholder||$t('code.codeStepFour.placeholderSelect')"
  ></el-cascader>
  </div>
</template>

<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
import i18n from "@/lang";
export default {
  props: {
    value: {
      type: Array | String,
      default: []
    },
	settings: {
	  type: Array | String,
	  default: []
	},
    disabled: {
      type: Boolean,
      default:false
    },
    clearable: {
      type: Boolean,
      default:true
    },
	separator: {
	  type: String,
	  default: '/'
	},
	showAllLevels:{
		type: Boolean,
		default:true
	},
	checkStrictly:{
		type: Boolean,
		default:false
	},
	placeholder:{
	  type: String,
	  default: ''
	}
  },
  watch:{
		value: function(val) {
      if(val){
     		if (Array.isArray(val)) {
				this.code = val;
				} else {
						this.code = val.split(",");
				}
			}else{
					this.code = [];
			}
    },
	settings:{
		immediate:true,
		deep:true,
		handler(v){

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
			     this.key++
			}, 200);
		}
	  }
  },
  data() {
    return {
			key:0,
      code: [],
	  defaultProps:{
			checkStrictly:false,
		  lazy: true,
		  lazyLoad (node, resolve) { 
			const { level } = node;
				let nodes = [];
				if(level==0){
				  nodes = [{
					  id: 1,
					  value: 1,
					  label:i18n.t('code.leftScrollbar.component.option1')
				  }]
				}else if(level==1){
				   nodes = [{
					id: 2,
					value: 2,
					label:i18n.t('code.leftScrollbar.component.option11'),
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
		if(this.checkStrictly){
			this.defaultProps.checkStrictly = this.checkStrictly;
		}
   if(this.value){
     if (Array.isArray(this.value)) {
		this.code = this.value;
     } else {
        this.code = this.value.split(",");
     }
   }
  },
  methods: {
    changeValue(val) {
      this.$emit("input", val);
			this.$emit("change", val);
    }
  }
};
</script>

<style lang="scss" scoped></style>
