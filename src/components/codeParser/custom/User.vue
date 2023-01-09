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
      tag: "xjr-select-user",
      userIds:[],
      confFields: []
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
      this.confFields[this.fieldsIndex].disabled = true;
    }
    this.userIds = this.confFields[this.fieldsIndex].__config__.defaultValue;
    this.setValue();
  },
  render(h) {
    return <xjr-select-user userIds={this.userIds} disabled={this.confFields[this.fieldsIndex].disabled} on-input={this.onInput}></xjr-select-user>;
  },
  methods: {
    onInput(val) {
      this.confFields[this.fieldsIndex].__config__.defaultValue = val;
      this.handleChange();
    },
    handleChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    }
  },
};
</script>
