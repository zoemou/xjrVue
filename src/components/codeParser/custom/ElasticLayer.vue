<template>
   <el-input
        :value="showValue"
        :placeholder="confFields[this.fieldsIndex].placeholder"
        :disabled="confFields[this.fieldsIndex].disabled"
        :suffix-icon="confFields[this.fieldsIndex]['suffix-icon']"
        :prefix-icon="confFields[this.fieldsIndex]['prefix-icon']"
        @focus="handFocus"
      >
      </el-input>
</template>
<script>
import { updateDefaultVal } from '../util.js'
import {
  getOptions
} from '@/util/dataApi';
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
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
      default:1
    }
  },
  data() {
    return {
      slots: [],
      value: "",
      confFields: [],
      list:[],
      isMutiple:false,
      saveField:'',
      showField:'',
      showValue:'',
    };
  },
    watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
      this.getShowValue();
    }
  },
  async created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    let confConfig = this.confFields[this.fieldsIndex].__config__;
    if(confConfig.avueType=='mutiple-popup'){
      this.isMutiple = true;
    }
    if(confConfig.dataType=="dataSource"){
      this.showField = confConfig.showField;
	    this.saveField = confConfig.saveField;
    }else if(confConfig.dataType=="dataSql"){
    }else if(confConfig.dataType=="dataItem"){
      this.showField = confConfig.showField;
	    this.saveField = confConfig.saveField;
    }else if(confConfig.dataType=="dataApi"){
      this.saveField= confConfig.apiConfig.saveField
      this.showField= confConfig.apiConfig.showField
    }
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
    this.value = this.confFields[this.fieldsIndex].__config__.defaultValue;
    await this.getList();
    this.getShowValue();
  
  },
  mounted() {
    let self = this;
    this.$event.$on("updateFormConf", obj => {
      if(obj?.fields){
        self.value = updateDefaultVal(self.curFormId,obj.fields);
        self.getShowValue();
      }
    });
  },
  methods: {
    handFocus(){
      this.$emit('handleFilterableClick',this.confFields[this.fieldsIndex]);
    },
     async getList(){
      const conf = this.confFields[this.fieldsIndex];
      this.list = await getOptions(conf.__config__);
      this.confFields[this.fieldsIndex]['dicData'] = this.list;
    },
    getShowValue(){
      if(this.confFields[this.fieldsIndex].__config__.defaultValue){
        if(this.list.length>0){
          if(this.isMutiple){
            let tempArrValue = [];
           
            if(typeof this.confFields[this.fieldsIndex].__config__.defaultValue=='string'){
              this.showValue = this.confFields[this.fieldsIndex].__config__.defaultValue;
             tempArrValue = this.confFields[this.fieldsIndex].__config__.defaultValue.split(',');
            }else{
              tempArrValue = this.confFields[this.fieldsIndex].__config__.defaultValue;
              this.confFields[this.fieldsIndex].__config__.defaultValue = this.confFields[this.fieldsIndex].__config__.defaultValue.join(',');
              this.showValue = this.confFields[this.fieldsIndex].__config__.defaultValue;
            }
            
            if(tempArrValue.length>0&&this.list.length>0){
              let options = this.list.filter(ele=>{
                return tempArrValue.includes(ele[this.saveField])
              });
              if(options.length>0){
                let showFieldArr = options.map(ele=>{
                  return ele[this.showField];
                });
                this.showValue = showFieldArr.join(',');
              }
            }
            }else{
              this.showValue = this.confFields[this.fieldsIndex].__config__.defaultValue;
              if(this.list.length>0){
                let options = this.list.filter(ele=>{
                  return ele[this.saveField]==this.confFields[this.fieldsIndex].__config__.defaultValue
                });
                if(options.length>0){
                  this.showValue = options[0][this.showField]
                }
              }
          }
        }
      }
      this.setValue();
    }
  }
};
</script>
