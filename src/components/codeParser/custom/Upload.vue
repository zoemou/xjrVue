<script>
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
      default: 1
    }
  },
  data() {
    return {
      confFields: []
    };
  },

  created() {
    if (this.tabChildren && this.tabChildren.length) {
      this.confFields = this.tabChildren;
    } else {
      this.confFields = this.formConf.fields;
    }
    //是否为查看
    if (this.isEdit == 2) {
      this.confFields[this.fieldsIndex].disabled = true;
    }
    this.confFields[this.fieldsIndex].__config__.multiple=this.confFields[this.fieldsIndex].multiple;
    this.setValue();
  },
  render: function(h) {
     const listeners = {
      input: (val)=>{
        this.confFields[this.fieldsIndex].__config__.defaultValue= val;
        this.handleUploadChange();
      },
    };
    return (
      <div class="custom-upload-box">
        <xjr-custom-upload
          config={this.confFields[this.fieldsIndex].__config__}
          list-type={this.confFields[this.fieldsIndex]["list-type"]}
          disabled={this.confFields[this.fieldsIndex].disabled}
          value={this.confFields[this.fieldsIndex].__config__.defaultValue}
          {...{ on: listeners }}
        ></xjr-custom-upload>
      </div>
    );
  },
  methods: {
    handleUploadChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    }
  }
};
</script>
<style scoped>
.el-upload-list--picture-card {
  position: absolute;
  top: 0;
  left: 158px;
}
.preview-dialog-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
}
.preview-dialog-box .show-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}
.preview-dialog-box .show-box .el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  color: #000;
  font-size: 24px;
}
.preview-dialog-box .iframe-box {
  width: 100%;
  height: 100%;
  margin: 40px;
}
.preview-name {
  display: inline-block;
  cursor: pointer;
}
.down-icon {
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  color: #409eff;
}
.el-upload-list--picture-card {
  height: 180px;
  overflow: scroll;
}
</style>
