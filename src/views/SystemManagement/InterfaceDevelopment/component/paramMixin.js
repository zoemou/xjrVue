import { mapGetters } from "vuex";
import i18n from "@/lang";
export default {
  computed: {
    ...mapGetters(["inputParameter","variable"]),
  },
  props: ['isShowParam','param'],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
	  treeData:[{
		  label:i18n.t('InterfaceInputParameters'),
		  value:0,
			drag:false,
		  children:[]
	  },{
		  label:i18n.t('systemTime'),
		  value:2,
			drag:false,
		  children:[{
			  label:'yyyy-MM-dd HH:mm:ss',
			  parent:'系统时间',
			  parentId:2,
			  value:0,
				drag:true
		  },{
			  label:'yyyy-MM-dd hh:mm:ss',
			  parent:'系统时间',
			  parentId:2,
			  value:1,
				drag:true
		  },{
			  label:'yyyy-MM-dd',
			  parent:'系统时间',
			  parentId:2,
			  value:2,
				drag:true
		  },{
			  label:'HH:mm:ss',
			  parent:'系统时间',
			  parentId:2,
			  value:3,
				drag:true
		  },{
			  label:'hh:mm:ss',
			  parent:'系统时间',
			  parentId:2,
			  value:4,
				drag:true
		  }]
	  }]
    };
  },
  mounted(){
	this.treeData[0].children=[]
    this.inputParameter.forEach(it=>{
		if(it.isChecked){
			this.treeData[0].children.push({
				label:it.paramKey,
			    parent:'接口入参',
			    parentId:0,
				value:it.id,
				drag:true
			})
		}
	})
	if(this.isShowParam){
		let arr=[]
		this.variable.forEach(it=>{
			arr.push({
				label:it.varCode,
			    parent:'接口变量',
			    parentId:1,
				value:it.id,
				drag:true
			})
		})
		let obj={label:i18n.t('interfaceVariables'),value:1,children:arr}
		this.treeData.splice(1,0,obj)
	}
  },
  methods: {
	allowDrop(draggingNode, dropNode, type) {
		if (dropNode.data.level) {
		    return true;
		}
	}
  }
}