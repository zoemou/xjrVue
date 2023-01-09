import { setStore, getStore } from '@/util/store'
import { diff } from '@/util/util'
import website from '@/config/website'
const isFirstPage = website.isFirstPage;
const tagWel = website.fistPage;
const tagObj = {
  label: '', //标题名称
  value: '', //标题的路径
  params: '', //标题的路径参数
  query: '', //标题的参数
  meta: {},//额外参数
  group: [], //分组
  target:'', //目标
}
//处理首个标签
function setFistTag (list) {

	list.forEach((ele,i) => {
	  if (i<=0) {
		ele.close = false
	  } else { 
		ele.close = true
	  }
	})
}


const navs = {
  state: {
    tagList: getStore({ name: 'tagList' }) || [],
    tag: getStore({ name: 'tag' }) || tagObj,
    tagWel: tagWel
  },
  actions: {

  },
  mutations: {
    ADD_TAG: (state, action) => {
		state.tag = action;
	  if(action.target!='open'){
		  setStore({ name: 'tag', content: state.tag })
		  if (!state.tagList.some(ele => diff(ele, action))) state.tagList.push(action) // return
		  
		  setFistTag(state.tagList); 
      setStore({ name: 'tagList', content: state.tagList })
	  }
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action);
      })
      setFistTag(state.tagList);
      setStore({ name: 'tagList', content: state.tagList })
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [...tagWel];      
      setStore({ name: 'tagList', content: state.tagList })
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter((item,index) => {

		return (item.value === state.tag.value) || (index < website.fistPage.length)
      })
      setFistTag(state.tagList);
      setStore({ name: 'tagList', content: state.tagList })
    },
    SET_TAG_LIST (state, tagList) {
      state.tagList = tagList;
      setStore({ name: 'tagList', content: state.tagList })
    }
    
  }
}
export default navs