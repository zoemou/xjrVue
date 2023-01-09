import Vue from 'vue'

// 基础配置信息
const requireBaseComponent = require.context('./', true, /view\.vue$/)
requireBaseComponent.keys().map(fileName => {
  Vue.component(`${fileName.split('/')[1]}-data-view`, requireBaseComponent(fileName).default)
})