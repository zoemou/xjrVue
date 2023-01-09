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
      required: true
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
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
  render(){
    // const conf = this.confFields[this.fieldsIndex]
     let style = ' max-width:600px;';
    return (<img src={this.confFields[this.fieldsIndex].__config__.defaultValue} style={style}></img>)
  }
  // render: function(h) {
  //   const conf = this.confFields[this.fieldsIndex]
  //   conf.style = conf.style+' max-width:600px;';
  //   const listeners = {}
  //   return (
  //     <el-image
  //       style={conf.style}
  //       src={this.confFields[this.fieldsIndex].__config__.defaultValue}
  //       {...{ on: listeners }}
  //     ></el-image>
  //   )
  // }
}
</script>
