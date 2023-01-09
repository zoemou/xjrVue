<script>
import {
  getOptions
} from '@/util/dataApi';
import { updateDefaultVal } from '../util.js'
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
      value: "",
      slot: [],
      loading: false,
      options: [],
      originOptions: [],
      fields: [],
      formId:0
    };
  },
  watch: {
    value(newValue) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = newValue;
      this.setValue();
    },
    '$store.state.formParser.needChangeOptionFormId': function () {
      let ids = this.$store.state.formParser.needChangeOptionFormId;
      if(ids.includes(this.formId)){
         this.changeOptions();
      }
    }

  },
  async created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.changeOptions();
  },
  mounted(){
    var self = this;
    this.$event.$on('updateFormConf',obj=>{
     //this.value = obj.fields[this.fieldsIndex].__config__.defaultValue;
     if(obj?.fields){
       self.value = updateDefaultVal(self.curFormId,obj.fields);
     }
    });
  },
  render: function(h) {
    const conf = this.confFields[this.fieldsIndex];
    this.formId = conf.__config__.formId;
    //是否为查看
    if(this.isEdit==2){
      conf.disabled = true;
    }
    const listeners = {
      change: this.handleRemoteSelect
    };
   
     //多选
    // if(conf.multiple){
    //   if(this.fields[this.fieldsIndex].__config__.defaultValue){
    //     if(Array.isArray(this.fields[this.fieldsIndex].__config__.defaultValue)){
    //       this.value = this.fields[this.fieldsIndex].__config__.defaultValue ;
    //     }else{
    //       this.value = this.fields[this.fieldsIndex].__config__.defaultValue.split(',');
    //     }
    //   }
      
    // }else{
       this.value = this.confFields[this.fieldsIndex].__config__.defaultValue
    // }
     return (
        <el-select
          value-key="label"
          v-model={this.value}
          placeholder={conf.placeholder}
          clearable={conf.clearable}
          disabled={conf.disabled}
          // multiple={conf.multiple}
          style={conf.style}
          filterable={conf.filterable}
          {...{ on: listeners }}
        >
          {this.slot}
        </el-select>
      );
  },
  methods: {
    async changeOptions(){
      this.slot = [];
      const conf = this.confFields[this.fieldsIndex];
      let tempData = await getOptions(conf.__config__);
      this.changeSlot(tempData);
    },
    changeSlot(list){
      this.originOptions = list;
      this.slot = [];
      if (list && list.length > 0) {
        list.forEach(item => {
          this.slot.push(
            <el-option
              label={item.label}
              value={item.value}
              disabled={item.disabled}
            ></el-option>
          );
        });
      }
    },
    handleRemoteSelect(val){	
      const conf = this.confFields[this.fieldsIndex];
	  let autoBindFields = conf.__config__.autoBindFields?JSON.parse(conf.__config__.autoBindFields):[];
    let saveField = "F_ItemValue";
    if(conf.__config__.dataType=='dataSource'){
      saveField = conf.__config__.saveField;
    }else if(conf.__config__.dataType=='dataItem'){
      saveField = 'F_ItemValue';
    }else if(conf.__config__.dataType=='dataApi'){
      saveField = conf.__config__.apiConfig.saveField;
    }
		
	  //得对应数据列
	  let data = this.originOptions.filter(item=>{
		  return item[saveField] == val;
	  })[0];
	  
	  if(!data){
		return ;
	  }
	  this.setDefaultVal(this.confFields,autoBindFields,data);
	  //自己赋值
	  conf.__config__.defaultValue = data[saveField];
	  this.selfSetDefaultVal(this.confFields, data[saveField], this.curFormId);
    this.handleTriggerEvent('change');
    this.$event.$emit('updateFormConf',this.formConf);
    },
    selfSetDefaultVal(fields,data, formId){
      fields.map((item,index)=>{
        if(item?.__config__?.componentName == 'avue-tabs'){
          let childrenObj = item?.__config__?.childrenObj || {};
          for(let key in childrenObj){
            let children = childrenObj[key];
            this.selfSetDefaultVal(children,data, formId);
          }
        }else{
          if(item?.__config__?.formId == formId){
            item.__config__.defaultValue = data;
          }
        }
      });
    },
    setDefaultVal(fields,autoBindFields,data){
      fields.map((item,index)=>{		  
        if(item?.__config__?.componentName == 'avue-tabs'){
          let childrenObj = item?.__config__?.childrenObj || {};
          for(let key in childrenObj){
            let children = childrenObj[key];
            this.setDefaultVal(children,autoBindFields,data);
          }
        }else{			
		  //找到对应formId 元素  key值为存储的对应formId
		  if(Object.prototype.toString.call(autoBindFields) === '[object Array]'){
			  autoBindFields.forEach(el=>{
				if(el.component==item.__config__.formId){
				  item.__config__.defaultValue= data[el.bindField];
				}
			  })
		  }else{
			 if(autoBindFields.hasOwnProperty(item?.__config__?.formId)){
			   //按绑定的自定义字段赋值
			   item.__config__.defaultValue = data[autoBindFields[item.__config__.formId]];
			 } 
		  }
        }
      });
    },
  }
};
</script>
