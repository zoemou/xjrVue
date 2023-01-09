<template>
  <div class="main-container" v-loading="loading">
    <el-row style="">
      <!-- <el-col :span="24">
        <el-button size="mini" @click="copyAuthority">复用已有权限</el-button>
      </el-col> -->
    </el-row>
    <el-row :gutter="20" style="height:100%">
      <el-col :span="6" style="height:100%">
        <div class="tree-box">
          <div class="title">
            <span>{{$t('orgRoleManagement.setAuthorizeModal.sysFunction')}}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="moduleList"
              show-checkbox
              default-expand-all
              node-key="F_ModuleId"
              ref="moduleTree"
              highlight-current
              :props="moduleProps"
              @check="nodemoduleCheck"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height:100%">
        <div class="tree-box">
          <div class="title">
            <span>{{$t('orgRoleManagement.setAuthorizeModal.btnAuthority')}}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="buttonList"
              show-checkbox
              default-expand-all
              node-key="F_ModuleId"
              ref="buttonTree"
              highlight-current
              :props="moduleProps"
              @check="buttonCheckChange"
            ><span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ $t(node.label) }}</span>       
			  </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height:100%">
        <div class="tree-box">
          <div class="title">
            <span>{{$t('orgRoleManagement.setAuthorizeModal.fieAuthority')}}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="columnList"
              show-checkbox
              default-expand-all
              node-key="F_ModuleId"
              ref="columnTree"
              highlight-current
              :props="moduleProps"
              @check="columnCheckChange"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height:100%">
        <div class="tree-box">
          <div class="title">
            <span>{{$t('orgRoleManagement.setAuthorizeModal.formAuthority')}}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="formList"
              show-checkbox
              default-expand-all
              node-key="F_ModuleId"
              ref="formTree"
              highlight-current
              :props="moduleProps"
              @check="formCheckChange"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-dialogDrag
      :title="$t('orgRoleManagement.setAuthorizeModal.Modal.Title')"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      :before-close="closeDialog"
    >
      <user-authorize
        v-if="dialogVisible && objectType == 2"
        ref="userAuthorizeRef"
      ></user-authorize>
      <role-authorize
        v-if="dialogVisible && objectType == 1"
        ref="roleAuthorizeRef"
      ></role-authorize>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirmDialog"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getModulesAll, getAuthorizes } from "@/api/organization/index";
import { deepClone } from "@/utils/index";
import { getSubSystem } from "@/api/system/subSystem";
import { mapGetters } from "vuex";
export default {
  name: "AuthorizeSelectTree",
  props: {
    objectType: {
      type: Number,
    },
    objectId: {
      type: String,
    },
  },
  computed: {
    ...mapGetters([ "allSystem", "systemId"]),
  },
  data() {
    return {
      buttonList: [],
      columnList: [],
      formList: [],
      moduleList: [],
      buttonListClone: [],
      columnListClone: [],
      formListClone: [],
      buttonListCloneSub: [],
      columnListCloneSub: [],
      formListCloneSub: [],
      moduleKeys: [],
      buttonKeys: [],
      columnKeys: [],
      formKeys: [],
      moduleProps: {
        children: "children",
        label: "F_FullName",
      },
      dialogVisible: false,
      subSystemJson: [],
			loading:true
    };
  },
  mounted() {
    this.getModulesAll();
  },
  methods: {
    async getModulesAll() {
      try {
        let res = await getModulesAll();
        if(res&&res.data.data){
          let moduleList = res?.data?.data?.moduleList;
        let buttonList = res?.data?.data?.buttonList;
        let columnList = res?.data?.data?.columnList;
        let formList = res?.data?.data?.formList;
        let haveSubSystem = moduleList.subSystemModuleList && moduleList.subSystemModuleList.length;

        this.moduleList = moduleList.mainSystemModuleList;
        if(haveSubSystem){
          moduleList.subSystemModuleList = this.formatterSystemNode(moduleList.subSystemModuleList);
          this.moduleList.push({'F_FullName':'子系统','children':moduleList.subSystemModuleList});
        }
        
        
        this.buttonList = buttonList.mainSystemModuleList;
        //buttonList.push({'F_FullName':'子系统','children':subSystem});
        this.buttonList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleButtonId");
            this.buttonListClone.push(temp);
          }
        });
        if(haveSubSystem){
			
			buttonList.subSystemModuleList=this.formatterSystemNode(buttonList.subSystemModuleList);
		  buttonList.subSystemModuleList.forEach((element1) => {
            if (element1.children?.length > 0) {
				//element1.children.forEach(it=>{
					let temp = this.nodeLoopFormate(element1, "F_ModuleButtonId");
					this.buttonListCloneSub.push(temp);
				//})            
            }
          });
        }
        this.columnList = columnList.mainSystemModuleList;
        this.columnList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleColumnId");
            this.columnListClone.push(temp);
          }
        });
        if(haveSubSystem){
          let subSystem = columnList.subSystemModuleList;
          subSystem = this.formatterSystemNode(subSystem);
          subSystem.forEach((element1) => {
            if (element1.children?.length > 0) {
              let temp = this.nodeLoopFormate(element1, "F_ModuleColumnId");
              this.columnListCloneSub.push(temp);
            }
          });
        }
        
        
        this.formList = formList.mainSystemModuleList;
        this.formList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleFormId");
            this.formListClone.push(temp);
          }
        });
        if(haveSubSystem){
          let subSystem = formList.subSystemModuleList;
          subSystem = this.formatterSystemNode(subSystem);
          subSystem.forEach((element1) => {
            if (element1.children?.length > 0) {
              let temp = this.nodeLoopFormate(element1, "F_ModuleFormId");
              this.formListCloneSub.push(temp);
            }
          });
        }
        this.getAuthorizes(this.objectType, this.objectId);
        }else{
        }
      } catch (error) {
      }
    },
    formatterSystemNode(arr){
      arr.map(item=>{
        item['F_FullName'] = item.F_Name || '';
        item['id'] = item.F_Id || '';
      });
      return arr;
    },
    getModuleIds(module){
      let arr = [];
      module.map((item)=>{
        if(item?.children && item.children.length){
          arr.push(...this.getModuleIds(item.children));
        }else{
          arr.push(item.F_ModuleId);
        }
      });
      return (()=>{
        return arr;
      })()
    },
    getAuthorizes(type, id) {
      getAuthorizes(type, id).then((res) => {
        this.moduleKeys = res.data.data[0];
        let moduleSelectedKeysArr = this.getModuleIds(this.moduleList);
		
        let setCheckedArr = this.moduleKeys.filter((ele) => {
          return moduleSelectedKeysArr.includes(ele);
        });
        this.$refs.moduleTree.setCheckedKeys(setCheckedArr);
        this.buttonKeys = res.data.data[1].filter((ele) => {
          return !this.moduleKeys.includes(ele);
        });
        this.columnKeys = res.data.data[2].filter((ele) => {
          return !this.moduleKeys.includes(ele);
        });
        this.formKeys = res.data.data[3].filter((ele) => {
          return !this.moduleKeys.includes(ele);
        });
        this.formatTree();
				this.loading=false;
      });
    },
    formatTree() {
      let subSystem = [];
      this.buttonList = this.changeData(this.buttonListClone, this.buttonKeys,'F_ModuleButtonId');
      subSystem = this.changeData(this.buttonListCloneSub,this.buttonKeys,'F_ModuleButtonId');

      if(subSystem.length){
        this.buttonList.push({'F_FullName':'子系统','children':subSystem});
      }
      this.$refs.buttonTree.setCheckedKeys(this.buttonKeys);
		
	  let subSystemColumn = [];
      this.columnList = this.changeData(this.columnListClone, this.columnKeys,'F_ModuleColumnId');
      subSystemColumn = this.changeData(this.columnListCloneSub,this.columnKeys,'F_ModuleColumnId');
      if(subSystemColumn.length){
        this.columnList.push({'F_FullName':'子系统','children':subSystemColumn});
      }
      this.$refs.columnTree.setCheckedKeys(this.columnKeys);

	  let subSystemForm = [];
      this.formList = this.changeData(this.formListClone, this.formKeys,'F_ModuleFormId');
      subSystemForm = this.changeData(this.formListCloneSub,this.formKeys,'F_ModuleFormId');
      if(subSystemForm.length){
        this.formList.push({'F_FullName':'子系统','children':subSystemForm});
      }
	  //表单可能存在子表单，就有父子级关系，要把父级的id剔除，否则父级setCheckedKeys就会把子级全选，
	  //因为提交给后端的选中id里不管是全选还是半选父级的id总会有，所以回显的时候要把父级id去掉，否则子级永远都是全选
	  this.formKeys=this.keyHasChildren(this.formKeys,this.formList,'F_ModuleFormId')
      this.$refs.formTree.setCheckedKeys(this.formKeys);
    },
	keyHasChildren(keys,list,name){
		for(let i=0;i<list.length;i++){
			let el=list[i]
			if(keys.includes(el[name])&&el.children?.length>0){
				
				keys=keys.filter(o=>{return o!=el[name]})
				
				keys=this.keyHasChildren(keys,el.children,name)
			}else if(el.children?.length>0){
				keys=this.keyHasChildren(keys,el.children,name)
			}
		}
		return keys
	},
    nodemoduleCheck(data, checkedData) {
		
      this.moduleKeys = [
        ...checkedData.checkedKeys,
        ...checkedData.halfCheckedKeys,
      ];
	  // this.buttonKeys = this.buttonKeys.filter((ele) => {
	  //   return !this.moduleKeys.includes(ele);
	  // });
	  // this.columnKeys = this.columnKeys.filter((ele) => {
	  //   return !this.moduleKeys.includes(ele);
	  // });
	  // this.formKeys = this.formKeys.filter((ele) => {
	  //   return !this.moduleKeys.includes(ele);
	  // });
      this.formatTree();
    },
    getSubSystemId(checkData){
      let arr = new Set();
      checkData.map((item)=>{
        if(item.F_SubSystemId){
          arr.add(item.F_SubSystemId);
        }
      });
      return arr;
    },
    buttonCheckChange(data, checkedData) {
      this.buttonKeys = [...checkedData.checkedKeys];
    },
    columnCheckChange(data, checkedData) {
      this.columnKeys = [...checkedData.checkedKeys];
    },
    formCheckChange(data, checkedData) {
		this.formKeys = [...checkedData.checkedKeys];
    },

    filterData(data, arr) {
      arr.forEach((item, index) => {
        if (item.F_ModulFeId === data.F_ModuleId) {
          arr.splice(index, 1);
        } else {
          if (item.children && item.children.length) {
            this.filterData(data, item.children);
          }
        }
      });
      return arr;
    },
    treeData(data) {
      data.forEach((item) => {
        if (item.F_ModuleButtonId) {
          item.F_ModuleId = item.F_ModuleButtonId;
        } else if (item.F_ModuleColumnId) {
          item.F_ModuleId = item.F_ModuleColumnId;
        } else if (item.F_ModuleFormId) {
          item.F_ModuleId = item.F_ModuleFormId;
        } else {
          if (item.children.length) {
            this.treeData(item.children);
          }
        }
      });
      return data;
    },
    copyAuthority() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    allCheckChange() {
      let moduleJson = this.$refs.moduleTree
        .getCheckedKeys()
        .concat(this.$refs.moduleTree.getHalfCheckedKeys());
      let buttonJson = this.$refs.buttonTree
        .getCheckedKeys()
        .concat(this.$refs.buttonTree.getHalfCheckedKeys());

      let columnJson = this.$refs.columnTree
        .getCheckedKeys()
        .concat(this.$refs.columnTree.getHalfCheckedKeys());

      let formJson = this.$refs.formTree
        .getCheckedKeys()
        .concat(this.$refs.formTree.getHalfCheckedKeys());
      let moduleChecked = this.$refs.moduleTree.getCheckedNodes();
      this.subSystemJson = Array.from(this.getSubSystemId(moduleChecked));

      let obj = {
        moduleJson: moduleJson,
        buttonJson: buttonJson,
        columnJson: columnJson,
        formJson: formJson,
        subSystemJson: this.subSystemJson
      };
      return obj;
    },
    confirmDialog() {
      if (this.objectType == 1) {
        this.objectId = this.$refs.roleAuthorizeRef.getReuseId();
      }
      if (this.objectType == 2) {
        this.objectId = this.$refs.userAuthorizeRef.getReuseId();
      }
      this.getAuthorizes(this.objectType, this.objectId);
      this.updateSubSystem();
      this.closeDialog();
    },
    updateSubSystem(){
      getSubSystem()
        .then(res=>{
          if(res.data.code == 0){
            let system = res.data.data;
            //存储主子系统菜单项
            this.$store.commit("SET_ALLSYSTEM", system);
          }
        })
    },
    nodeLoopFormate(json, changeStr) {
      if (json[changeStr]) {
        json.F_ModuleId = json[changeStr];
      }
      if (json.children && json.children.length > 0) {
        let tempArr = json.children;
        json.children = tempArr.map((element2) => {
          return this.nodeLoopFormate(element2, changeStr);
        });
      }
      return json;
    },
	loopChangeData(showList,children,name){
		children.forEach(el=>{
			let tempElement = deepClone(el);
			if(tempElement[name]){
				showList.push(tempElement);
			}else{
				if (tempElement.F_ModuleId && this.moduleKeys.includes(tempElement.F_ModuleId)) {
					tempElement.children=[]
					showList.push(tempElement);
					if(el.children&&el.children.length > 0){
						this.loopChangeData(tempElement.children,el.children,name)
					}
				}
			}
		})
		//return showList
	},
    changeData(loopCloneArr, checkedKeys,name) {
      var showList = [];
      loopCloneArr.forEach((element) => {
		  
		  let tempElement = deepClone(element);
		  if(tempElement[name]){
			  showList.push(tempElement);
		  }else{
			if (tempElement.F_ModuleId && this.moduleKeys.includes(tempElement.F_ModuleId)) {
				tempElement.children=[]
				showList.push(tempElement);
				if(element.children&&element.children.length > 0){
					this.loopChangeData(tempElement.children,element.children,name)
				}
				
			}
		}

		 //else {
			
          // if (
          //   element.F_ModuleId &&
          //   this.moduleKeys.includes(element.F_ModuleId)
          // ) {
          //   let checkedArr = [];
          //   let tempElement = deepClone(element);
          //   tempElement.children = [];
          //   if (element.children.length > 0) {
          //     element.children.forEach((element2) => {
          //       if (
          //         element2.F_ModuleId &&
          //         this.moduleKeys.includes(element2.F_ModuleId)
          //       ) {
          //         let checkedArr2 = [];
          //         let tempElement2 = deepClone(element2);

          //         if (element2.children.length > 0) {
          //           element2.children.forEach((element3) => {
          //             if (
          //               element3.F_ModuleId &&
          //               this.moduleKeys.includes(element3.F_ModuleId)
          //             ) {
          //               checkedArr2.push(element3);
          //             }
          //           });
          //         }
          //         if (checkedArr2.length > 0) {
          //           tempElement2.children = [];
          //           tempElement2.children = checkedArr2;
          //         }
          //         checkedArr.push(tempElement2);
          //       }
          //     });
          //   }
          //   if (checkedArr.length > 0) {
          //     tempElement.children = checkedArr;
          //   }
          //   showList.push(tempElement);
          // }
        //}
      });
      return showList;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  height: 100%;
  padding: 0 10px;
}

.tree-box {
  height: 100%;
  border-top: 1px solid #e9e9e9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-sizing: border-box;
}

.tree-box .title {
  height: 40px;
  padding: 5px 20px;
  font-size: 14px;
  line-height: 30px;
  font-weight: bold;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-top: none;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-sizing: border-box;
}

.tree-box .tree {
  height: calc(100% - 40px);
  padding: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
