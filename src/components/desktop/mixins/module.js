import {getMenuTree} from "@/api/systemManagement/menu";
import {FormatAddressTree } from '@/util/util';
import { mapGetters } from "vuex";
var moduleMixin = {
  data: function () {
    return {
      defaultTree:[]
    }
  },
  computed:{
      ...mapGetters(["systemId"])
  },
  mounted(){

  },
  methods: {
  	getMenuTree(id){
		getMenuTree().then(res => {
		  let allMenu = res.data.data || null;
		  if (!allMenu) return;
		  let menuTree = allMenu.mainSystemModuleList;
		  allMenu.subSystemModuleList?.map(item => {
		    item["F_FullName"] = item.F_Name;
			item["F_UrlAddress"]=''
		  });
		  if (allMenu?.subSystemModuleList?.length) {
		   menuTree.push(...allMenu.subSystemModuleList)
		  }
		  this.defaultTree = FormatAddressTree(
		    menuTree,
			"F_UrlAddress",
		    "F_SubSystemId",
		    "F_FullName",
		    "children",
			""
		  );
		});
	}
  }
}
export default moduleMixin