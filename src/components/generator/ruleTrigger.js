/**
 * 用于生成表单校验，指定正则规则的触发方式。
 * 未在此处声明无触发方式的组件将不生成rule！！
 */
export default {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'xjr-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change',
  'avue-load-tree': 'change',
  'avue-select-area': 'change',
  'xjr-select-user': 'change',
  'el-upload': 'change',
  'el-mutiple-input': 'blur',
  'el-color-picker': 'change',
  'xjr-select-user': 'input',
  tinymce: 'blur'
}
