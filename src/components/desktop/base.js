import Vue from 'vue'

// 基础配置信息
const requireBaseComponent = require.context('./', true, /base\.vue$/)
requireBaseComponent.keys().map(fileName => {
  Vue.component(`${fileName.split('/')[1]}-config`, requireBaseComponent(fileName).default)
})
// 数据配置信息
const requireDataComponent = require.context('./', true, /data\.vue$/)
requireDataComponent.keys().map(fileName => {
  Vue.component(`${fileName.split('/')[1]}-data-config`, requireDataComponent(fileName).default)
})



