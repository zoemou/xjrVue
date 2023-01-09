<template>
  <textarea :id="tinymceId" class="tinymce-box" style="visibility: hidden"/>
</template>

<script>
import loadTinymce from '@/utils/loadTinymce'
import { plugins, toolbar } from './config'
import { debounce } from 'throttle-debounce'
import emitter from 'element-ui/src/mixins/emitter';
let num = 1

export default {
  mixins:[emitter],
  props: {
    id: {
      type: String,
      default: () => {
        num === 10000 && (num = 1)
        return `tinymce${+new Date()}${num++}`
      }
    },
    disabled: {
      type: Boolean,
      default:false
    },
    value: {
      default: ''
    },
    height:''
  },
  data() {
    return {
      tinymceId: this.id
    }
  },
  mounted() {
    //let readonly = this.disabled?1:0;
    loadTinymce(tinymce => {
      // eslint-disable-next-line global-require
      require('./zh_CN')
      let conf = {
        selector: `#${this.tinymceId}`,
        //readonly : readonly,
        language: 'zh_CN',
        skin_url: '/util/tinymce-skins/ui/oxide/',
        menubar: 'file edit insert view format table',
        plugins,
        toolbar,
        height: this.height,
        branding: false,
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true
      }
      conf = Object.assign(conf, this.$attrs)
      conf.init_instance_callback = editor => {
		if(this.disabled) editor.mode.set('readonly')
        if (this.value) editor.setContent(this.value)
        this.vModel(editor)
      }
      tinymce.init(conf)
    })
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    vModel(editor) {
      // 控制连续写入时setContent的触发频率
      const debounceSetContent = debounce(250, editor.setContent)
      this.$watch('value', (val, prevVal) => {
        this.$emit('validateForm', val);//触发代码生成器form页面的表单验证
        this.dispatch('ElFormItem', 'el.form.change', val);//触发自定义表单form页面 编辑器的表单验证
        // console.log('editor.getContent()');
        // this.$emit('blur',editor.getContent());
        if (editor && val !== prevVal && val !== editor.getContent()) {
          if (typeof val !== 'string') val = val.toString()
          debounceSetContent.call(editor, val)
        }
      })

      editor.on('change keyup undo redo', () => {
        this.$emit('input', editor.getContent())
      })
      editor.on('blur', () => {
        let val = editor.getContent();
        console.log('blur',val);
        this.$emit('blur',val);
      })
    },
    destroyTinymce() {
      if (!window.tinymce) return
      const tinymce = window.tinymce.get(this.tinymceId)
      if (tinymce) {
        tinymce.destroy()
      }
    },
  }
}
</script>
