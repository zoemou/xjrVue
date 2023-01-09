const styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}'
}

function addCss(cssList, el) {
  const css = styles[el.__config__.tag]
  css && cssList.indexOf(css) === -1 && cssList.push(css)
  if (el.__config__.children) {
    el.__config__.children.forEach(el2 => addCss(cssList, el2))
  }
}

export function makeUpCss(conf) {
  //表单数据为空，设置空数据样式
  const cssList = [
    '.el-table__empty-block{width: 100% !important;}',
    '.avue-form__row{padding: 0 !important;}',
	'#editorphone{width: 375px;margin: 0 auto;border:1px solid #E4E7ED;padding:0 7.5px;background:#f5f6fa;height: 700px;overflow-y: auto;overflow-x: hidden;border-radius: 5px;}',
	'#editorphone .el-col{border-bottom:1px solid #F2F2F2;background:#fff;margin-bottom:0;padding:0 15px 6px !important;width: 100%;}',
	'#editorphone .el-form-item__label{line-height:20px}',
	'#editorphone .el-input-group .el-input__inner{background:#f5f6fa}',
	'#editorphone .el-input__inner{border:0}',
	'#editorphone .el-input-group__append, #editorphone .el-input-group__prepend{border:0;background: #edeef2;color: #666;}',
	'#editorphone .el-input-group .el-input__prefix{left:44px}',
	'#editorphone .el-input-group .el-input__suffix{right:44px}',
	'#editorphone .el-form-item{display: flex;align-items: center;justify-content: space-between;flex-flow: wrap;}',
	'#editorphone .el-form-item__label{float:none;min-width: 85px;width:auto !important;text-align:left;flex: auto;}',
	'#editorphone .tinymce .el-form-item__label{min-width: 100%;}',
	'#editorphone .el-form-item__content{margin-left:0px !important;flex: auto;width: calc(100% - 95px);}',
	'#editorphone .avueFormNoLable .el-form-item__label, #editorphone .avueFormNoLable .avue-crud__pagination{display:none;}',
	'#editorphone .avueFormNoLable .el-collapse-item__wrap, #editorphone .avueFormNoLable .el-collapse{border-bottom:0}',
	'#editorphone .avueFormNoLable .el-col{border-bottom:0;padding-bottom:0}',
	'#editorphone .el-form-item__content .el-button:first-child{margin-left:90px;}'
  ]
  conf.fields.forEach(el => addCss(cssList, el))
  return cssList.join('\n')
}
