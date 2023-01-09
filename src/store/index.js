import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import getters from './getters'
import FD from './FormDesign'
import workflow from './modules/workflow'
import mobileData from './modules/mobileDesign'
import interfaceDevelopment from './modules/interface'
import formParser from './modules/formParser'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    FD,
    workflow,
    mobileData,
	interfaceDevelopment,
  formParser
  },
  getters,
})

export default store
    