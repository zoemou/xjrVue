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
      type: Number,
      default:1
    }
  },
  data() {
    return {
      confFields: [],
      operationVal:'add'
    };
  },
  created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    //是否为查看
    if(this.isEdit==2){
      this.operationVal = 'look';
      this.confFields[this.fieldsIndex].disabled = true;
    }
    if(this.isEdit==1){
      this.operationVal = 'add';
    }
    if(this.isEdit==3){
      this.operationVal = 'edit';
    }
    this.setValue();
  },
  render: function (h) {
     const listeners = {
        input: this.handleChange
    }
    return (
      <avue-information-body
        infoType={this.confFields[this.fieldsIndex].infoType}
        whetherToRebindSecondaryEditing={this.confFields[this.fieldsIndex].__config__.whetherToRebindSecondaryEditing}
        operationVal={this.operationVal}
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        placeholder={this.confFields[this.fieldsIndex].placeholder}
        disabled={this.confFields[this.fieldsIndex].disabled}
         {...{ on: listeners }}
      >
      </avue-information-body>
    );
  },
  methods: {
    handleChange(val){
      this.confFields[this.fieldsIndex].__config__.defaultValue=val;
      this.setValue();
      this.handleTriggerEvent('change');
    }
  }
};
</script>
