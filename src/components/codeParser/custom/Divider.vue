<script>
export default {
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
    }
  },
  data() {
    return {
      confFields: [],
      style:""
    };
  },
  created() {
    if (this.tabChildren && this.tabChildren.length) {
      this.confFields = this.tabChildren;
    } else {
      this.confFields = this.formConf.fields;
    }
    const conf = this.confFields[this.fieldsIndex];
    let top = conf.__config__.top?conf.__config__.top+'px':0;
    let bottom=  conf.__config__.bottom?conf.__config__.bottom+'px':0;
    this.style = `border-top: 1px solid #dcdfe6;margin-top: ${top};margin-bottom: ${bottom};`;
  },
  render: function(h) {
     return <div style={this.style}></div>;
  }
};
</script>
