<script>
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
      required: true,
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
    },
    // 1 新增 2 查看 3 编辑
    isEdit: {
      type: Number
    }
  },
  data(){
    return {
      confFields: [],
      value:0
    }
  },
  created(){
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
  },
  render: function (h) {
    let conf = this.confFields[this.fieldsIndex];
    if(typeof this.confFields[this.fieldsIndex].__config__.defaultValue=='string'){
      this.confFields[this.fieldsIndex].__config__.defaultValue = Number(this.confFields[this.fieldsIndex].__config__.defaultValue);
    }
    //是否为查看
    if(this.isEdit==2){
      conf.disabled= true;
    }
    this.setValue();
    let listeners = {
      change: this.handleChange
    };
    return (
      <el-switch
      active-color={conf['active-color']}
      active-text={conf['active-text']}
      active-value={conf['active-value']}
      inactive-color={conf['inactive-color']}
      inactive-text={conf['inactive-text']}
      inactive-value={conf['inactive-value']}
      disabled={conf.disabled}
      style={conf.style}
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        {...{ on: listeners }}
      >
      </el-switch>
    );
  },
  methods: {
    handleChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    }
  }
};
</script>
