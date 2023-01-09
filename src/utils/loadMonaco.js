import i18n from "@/lang";
import { loadScriptQueue } from './loadScript'
import ELEMENT from 'element-ui'

import * as monaco from 'monaco-editor';

// monaco-editor单例
let monacoEidtor

/**
 * 动态加载monaco-editor cdn资源
 * @param {Function} cb 回调，必填
 */
export default function loadMonaco(cb) {
  if (monacoEidtor) {
    cb(monacoEidtor)
    return
  }

  const vs = '/cdn/monaco-editor'

  // 使用element ui实现加载提示
  const loading = ELEMENT.Loading.service({
    fullscreen: true,
    lock: true,
    text:i18n.t('deletePrompt.editInitializing'),
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  !window.require && (window.require = {})
  !window.require.paths && (window.require.paths = {})
  window.require.paths.vs = vs

  loadScriptQueue([
    `${vs}/loader.js`,
    `${vs}/editor.main.nls.js`,
    `${vs}/editor.main.js`
  ], () => {
    loading.close()
    // eslint-disable-next-line no-undef
    monacoEidtor = monaco
    cb(monacoEidtor)
  })
}
