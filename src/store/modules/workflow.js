import { getDataItem } from "@/api/workFlow/WFLaunch";
const flow = {
  state: {
    workflowCategory:[],
    currentModule:'',
	allForm:[]
  },
  mutations: {
    CHANGE_FLOWCATEGORY: (state, value) => {
      state.workflowCategory = value;
    },
    CHANGE_CURRENT_MODULE: (state, value) => {
      state.currentModule = value;
    },
	SET_ALL_FORM: (state, value) => {
      state.allForm = value;
    }
  },
  actions: {
    async updatewWorkFlowCategory({ state, commit }) {
      if (state.workflowCategory.length > 0) {
        return state.workflowCategory;
      } else {
        let res = await getDataItem("FlowSort");
        if (res.data.success) {
          commit("CHANGE_FLOWCATEGORY", res.data.data);
          return res.data.data;
        }else{
          return [];
        }
      }
    },
	addAllForm({ state, commit },data){
		if(data.obj&&data.id!=undefined){
			if(Object.prototype.toString.call(data.obj)==='[object Object]'&&Object.keys(data.obj).length===0) return;
			let temp=state.allForm.find(o=>{return o.F_Id==data.obj.F_Id})
			if(temp) return;
			state.allForm.push(data.obj)
		}
		if(data.id){
			state.allForm=state.allForm.filter(o=>{return o.F_Id!=data.id})
		}
	}
  }
};
export default flow;
