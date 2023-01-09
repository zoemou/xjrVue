import i18n from "@/lang";
const interfaceDevelopment = {
    state: {
        inputParameter:[],  //入参配置
        variable:[],   //变量配置
        interfaceConfig:[],   //接口配置
        outParameter:[],   //出参配置
        outputConfig:{},   //输出配置
        curStep:0    //当前步骤       
    },	
    mutations: {
        setInputParameter(state,action){
            state.inputParameter = action
        },
        setVariable(state,action){
            state.variable = action
        },
        setInterfaceConfig(state,action){
            state.interfaceConfig = action
        },
        setOutParameter(state,action){
            state.outParameter = action
        },
        setOutputConfig(state,action){
            state.outputConfig = action
        },
        setCurStep(state,action){
            state.curStep=action
        }
    },
	actions: {
		initInterfaceAllData({ commit },data){
			let data1=[
			// 	{
			// 	isChecked: true,
			// 	paramKey:'Content-Length',
			// 	paramValue: 0,
			// 	paramType:0,
			// 	paramDes: ''
			// },{
			// 	isChecked: true,
			// 	paramKey:'Host',
			// 	paramValue: '<calculated when request is sent>',
			// 	paramType:0,
			// 	paramDes: ''
			// },{
			// 	isChecked: true,
			// 	paramKey:'User-Agent',
			// 	paramValue: 'PostmanRuntime/7.28.4',
			// 	paramType:0,
			// 	paramDes: ''
			// },{
			// 	isChecked: true,
			// 	paramKey:'Accept',
			// 	paramValue: '*/*',
			// 	paramType:0,
			// 	paramDes: ''
			// },{
			// 	isChecked: true,
			// 	paramKey:'Accept-Encoding',
			// 	paramValue: 'gzip, deflate, br',
			// 	paramType:0,
			// 	paramDes: ''
			// },{
			// 	isChecked: true,
			// 	paramKey:'Connection',
			// 	paramValue: 'keep-alive',
			// 	paramType:0,
			// 	paramDes: ''
			// },
			],
			data2=[],
			data3=[{
				nodeName:i18n.t('workFlow.roams.startNode'),
				nodeType:'start'
			},{
				nodeName:i18n.t('validateInterfaceParameter'),
				nodeType:'task',
				nodeLifeCycleType:0,
				isCustom:false,
				nodeLog:false
			},{
				nodeName:'',
				nodeLifeCycleType:0,
				nodeType:'plus'
			},{
				nodeName:i18n.t('startExecuteInterface'),
				nodeType:'task',
				nodeLifeCycleType:1,
				isCustom:false,
				nodeLog:false
			},{
				nodeName:'',
				nodeLifeCycleType:1,
				nodeType:'plus'
			},{
				nodeName:i18n.t('InterfaceExecuteEnd'),
				nodeType:'task',
				nodeLifeCycleType:2,
				isCustom:false,
				nodeLog:false
			},{
				nodeName:'',
				nodeLifeCycleType:2,
				nodeType:'plus'
			},{
				nodeName:i18n.t('workFlow.roams.endNode'),
				nodeType:'end'
			}],
			data4=[],
			data5={
				F_Name:data?.F_Name||'',
				F_EnCode:data?.F_EnCode||'',
				F_RequestMethod:data?.F_RequestMethod>=0?data.F_RequestMethod:'',
				F_UrlAddress:data?.F_UrlAddress||'',
				F_CategoryId:data?.F_CategoryId||'',
				F_EnabledMark:data?.F_EnabledMark>=0?data.F_EnabledMark:1,
				F_Description:data?.F_Description||'',
				F_IsCustomize:1  //1是自定义接口
			};
			if(data?.F_JsonSchema&&Object.prototype.toString.call(data.F_JsonSchema)=="[object String]"){
				let json=JSON.parse(data.F_JsonSchema)
				if(json?.inputSetting) data1=json.inputSetting;
				if(json?.varSetting) data2=json.varSetting;
				if(json?.aopSetting) data3=json.aopSetting;
				if(json?.outputSetting) data4=json.outputSetting;
			}
			if(data?.id) data5.F_Id=data.id;
			
			commit("setInputParameter", data1);
			commit("setVariable", data2);
			commit("setInterfaceConfig",data3);
			commit("setOutParameter",data4);
			commit('setOutputConfig', data5);
		}
	}
    
}

export default interfaceDevelopment;
  