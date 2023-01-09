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
      label: "",
      confFields: [],
      titlePosition: "center",
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
    this.label = conf.__config__.label;
    let color = this.confFields[this.fieldsIndex].__config__.defaultValue;
    let fontSize = this.confFields[this.fieldsIndex].__config__.fontSize;
    if(color){
      this.style = this.style+"color:"+color+";";
    }
    if(fontSize){
      this.style = this.style+"font-size:"+fontSize+"px;";
    }
    this.titlePosition = conf.__config__.titlePosition;
  },
  render: function(h) {
    if (this.titlePosition == "right") {
      return <div class="h2 right" style={this.style}>{this.label}</div>;
    } else if (this.titlePosition == "left") {
      return <div class="h2 left" style={this.style}>{this.label}</div>;
    } else {
      return <div class="h2 center" style={this.style}>{this.label}</div>;
    }
  }
};
</script>
<style scoped>
.h2 {
  display: flex;
  align-content: center;
  width: 100%;
  font-size: 24px;
}
.center {
  justify-content: center;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
</style>
