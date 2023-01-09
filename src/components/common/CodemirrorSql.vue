<template>
  <div class="code-box">
    <textarea
      id="mycode"
    ></textarea>
    <div class="formatter" @click="sqlFormat">{{$t('editorModule.formatting')}}</div>
  </div>
</template>

<script>
import { format } from 'sql-formatter';
import { fromTextArea } from 'codemirror';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/display/placeholder.js';
export default {
  model: {
    event: 'change',
    prop: 'value'  
  },
  props: {
    placeholder:{
      type:String,
      default:""
    },
    value: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  computed: {
    editorValue() {
      return this.editor?.getValue()
    }
  },
  watch: {
    editorValue(val) {
      this.emitValue();
    }
  },
  mounted() {
    this.editor = fromTextArea(document.getElementById("mycode"), {
      placeholder:this.placeholder,
      mode: "text/x-mysql", //选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      indentWithTabs: false, //在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
      smartIndent: true, //自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）。默认为true。
      lineNumbers: true, //是否在编辑器左侧显示行号。
      matchBrackets: true, // 匹配括号
      cursorHeight: 1, //光标高度。默认为1，也就是撑满行高。对一些字体，设置0.85看起来会更好。
      lineWrapping: true, // 自动换行
      autofocus: false,
      // readOnly: this.readOnly, //是否只读
    });
    if (this.value) this.editor.setValue(this.value)
    this.sqlFormat();
    this.editor.on('blur', (cm, event) => {
      this.emitValue();
    })
  },
  methods: {
    emitValue(){
      let content = this.editor.getValue();
        this.$emit('change', content);
    },
    sqlFormat(){ // 格式化
      let content = this.editor.getValue();
      this.editor.setValue(format(content));
    },
    insertVariable(val) {//插入内容
      this.editor.replaceSelection(val);
      this.emitValue();
    }
  }
};
</script>

<style lang="css" scoped>
div >>> .CodeMirror{
  height: 100%;
  min-height: 200px;
}
.code-box{
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #dcdfe6;
}
.formatter{
  position: absolute;
  right: 4px;
  bottom: 4px;
  cursor: pointer;
  text-decoration:underline;
  z-index: 2;
}
div >>> .CodeMirror pre.CodeMirror-line, div .CodeMirror pre.CodeMirror-line-like{
  font-size: 16px;
}

div >>> .CodeMirror pre.CodeMirror-placeholder {
    color: #999;
  }

</style>
