const mobileData = {
    state: {
        //功能设计
        formList:[],
        activeData:{},
        searchList:[],
        searchCurData:{},
        itemList:[],
        listCurItem:{},
        curStep:0,
        allStepData:{
            stepOne:{},
            stepTwo:{
                F_DbId:'',
                list:[]
            },
            stepThree:[],
            stepFour:[],
            stepFive:{
                list:[],
                btn:[{
                    icon:'el-icon-plus',
                    name:'新增',
                    select:true,
                    id:'add'
                    },{
                    icon:'el-icon-edit',
                    name:'编辑',
                    select:true,
                    id:'edit'
                    },{
                    icon:'el-icon-delete',
                    name:'删除',
                    select:true,
                    id:'del'
                }]
            },
            stepSix:{
                createUser:"",
                describe:"",
                name:"",
                outputArea:"",
                controllerDirectory:"",
                modelDirectory:"",
                fontDirectory:"",
                haveSql:false
            },
            stepSeven:{},
            stepEight:{}
        },
        //首页设计
        homeAllStep:{
            stepOne:{},
            stepTwo:[],
            stepThree:''
        },
        homeActiveData:{},
        //登录设计
        loginAllStep:{
            stepOne:{},
            stepTwo:{},
            stepThree:''
        }
    },
    mutations: {
        setFormList(state,action){
            state.formList = action
        },
        setActiveData(state,action){
            state.activeData = action
        },
        setSearchList(state,action){
            state.searchList = action
        },
        setSearchCurData(state,action){
            state.searchCurData = action
        },
        setItemList(state,action){
            state.itemList = action
        },
        setListCurItem(state,action){
            state.listCurItem = action
        },
        setAllStepData(state,action){
            state.allStepData=action
        },
        setCurStep(state,action){
            state.curStep=action
        },
        setHomeAllStep(state,action){
            state.homeAllStep=action
        },
        setHomeActiveData(state,action){
            state.homeActiveData=action
        },
        setLoginAllStep(state,action){
            state.loginAllStep=action
        }
    }
    
}

export default mobileData;
  