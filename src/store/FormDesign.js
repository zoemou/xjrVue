const FD = {
  state: {
    // 模板类型
    controllerType: 0,
    customControllerType:0,//自定义表单 生成代码
    // 数据库id
    DbLinkId: '',
    // 菜单页面，路由id
    moduleId: '',
    //
    param: {
      tableInfo: [],
      dbTable: [],
    },

    // home.vue
    generateConf: '',
    formData: {},
    // 表单设计列表 Id
    F_Id: '',
    primaryTableComponents:[],
    mainTableName:'',
    subTableNames:[]
  },
  mutations: {
    SET_CONTROLLER_TYPE: (state, val) => {
      state.controllerType = val
    },
    SET_CUSTOM_CONTROLLER_TYPE: (state, val) => {
      state.customControllerType = val
    },
    SET_F_ID: (state, val) => {
      state.F_Id = val
    },
    SET_MAIN_TABLE_NAME: (state, val) => {
      state.mainTableName = val
    },
    SET_SUB_TABLE_NAMES: (state, val) => {
      state.subTableNames = val
    },
    SET_PRIMARY_TABLE_COMPONENTS: (state, val) => {
      state.primaryTableComponents = val
    },
    SET_DB_LINK_ID: (state, val) => {
      state.DbLinkId = val
    },
    SET_FORM_DATA_FIELDS: (state, val) => {
      state.formData.fields = val
    },
  }
}

export default FD;
