export default {
  data() {
    return {
      option: {
        column: [], //表字段权限
      },
      modulePermissionList: [],
    };
  },
  computed: {
    columnEnCodeList: function() {
		return this.modulePermissionList["column"].map((ele) => {
        return ele.prop;
      });
    },
    buttonEnCodeList: function() {
      return this.modulePermissionList["button"];
    },
  },
  async created() {
     if (this.$route && this.$route.meta && this.$route.meta.moduleid) {
      const modulesId = this.$route.meta.moduleid;
      if (!this.$store.getters.permission.size) {
        try {
          let res = await this.$store.dispatch("GetUserPermission");
          this.changePermission(modulesId, res); 
        } catch (error) {
        }
      } else {
        this.changePermission(modulesId, this.$store.getters.permission);
      }
    }
    
  },
  methods: {
    hasWorkFlowFormPermission(encode){
      return false;
    },
    hasLookFormPermission(encode){
      return true;
    },
    hasButtonPermission(encode){
      if(this.buttonEnCodeList&&this.buttonEnCodeList.includes(encode)){
        return true;
      }else{
        return false;
      }
    },
    hasFormPermission(encode){
      if(this.formEnCodeList&&this.formEnCodeList[encode]){
        return true;
      }else{
        return false;
      }
    },
    hasDisabledPermission(encode,disabled) {
      if(this.disabled){
        return true;
      }else{
        return disabled==undefined?true:disabled;
      }
    },
    hasEditPermission(encode,readonly) {
      return readonly==undefined?true:!readonly;
    },
    changePermission(modulesId, permissionList) {
      this.modulePermissionList = permissionList.get(modulesId) ? permissionList.get(modulesId) : [];
      let formPermissionList = this.modulePermissionList["form"];
    let returnPermissionList = {};
    for (const key in formPermissionList) {
      if (Object.hasOwnProperty.call(formPermissionList, key)) {
        const val = formPermissionList[key];
        if(typeof val =='object'){
          for (const key2 in val) {
            if (Object.hasOwnProperty.call(val, key2)) {
              const element2 = val[key2];
              returnPermissionList[key2] = element2;
            }
          }
        }else{
          returnPermissionList[val] = val;
        }
      }
    }
      this.formEnCodeList =  returnPermissionList;
	  if (typeof this.handleAvueTable == "function") {
	    this.handleAvueTable(modulesId);
	  }else{
		  if (this.modulePermissionList.column&&this.modulePermissionList.column.length > 0) {
		    this.option.column = this.option.column.filter((ele)=>{
		      return this.columnEnCodeList.includes(ele.prop);
		    });
		  }else{
		    this.option.column = '';
		    
		  }
	  }     
	  if (typeof this.handleEditAvueSth == "function") {
	    this.handleEditAvueSth();
	  }
    },
    //子表单权限
    getAuthorityTableChildrenList(bindTable, children) {
      let column = [];
      if (bindTable&&this.formEnCodeList&&this.formEnCodeList.length>0&&this.formEnCodeList[bindTable]) {
        let formSubEnCodeList = this.formEnCodeList[bindTable]; 
        if (children && children.length > 0) {
          column = children.map(ele2 => {
            if (formSubEnCodeList.includes(ele2.prop)) {
              ele2.hide = false;
            }
            else {
              ele2.hide = true;
            }
            return ele2;
          });
        }
          return column;
      }else{
        return children;
      }
    },
  },
};
