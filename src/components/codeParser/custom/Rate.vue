<script>
import { updateDefaultVal } from '../util.js'
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
    fieldsIndex: {
      type: Number,
      required: true,
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
  data(){
    return {
      confFields: []
    }
  },
  created(){
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.setValue();
  },
  mounted(){
    this.$event.$on('updateFormConf',obj=>{
      if(obj?.fields){
        this.confFields[this.fieldsIndex].__config__.defaultValue = updateDefaultVal(this.confFields[this.fieldsIndex].__config__.formId,obj.fields);
        this.setValue();
      } 
    });
  },
  render: function(h) {
    const conf = this.confFields[this.fieldsIndex]
    //是否为查看
    if(this.isEdit==2){
      conf.disabled = true;
    }
    if( typeof this.confFields[this.fieldsIndex].__config__.defaultValue !='number'){
        this.confFields[this.fieldsIndex].__config__.defaultValue = 0;
    }
    const listeners = {
        change: this.handleChange
    }
    return (
      <el-rate
        allow-half={conf['allow-half']}
        disabled={conf.disabled}
        max={conf.max}
        show-score={conf['show-score']}
        show-text={conf['show-text']}
        style={conf.style}
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        {...{ on: listeners }}
      ></el-rate>
    )
  },
  methods: {
    handleChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    }
  }
}
</script>
