<template>
  <div class="main-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>{{ $t("user.authorizeInfor.titleSysFunction") }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="moduleList"
              default-expand-all
              node-key="F_ModuleId"
              ref="moduleTree"
              highlight-current
              :props="moduleProps"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>{{ $t("user.authorizeInfor.titleBtnAccess") }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="buttonList"
              default-expand-all
              node-key="F_ModuleId"
              ref="buttonTree"
              highlight-current
              :props="moduleProps"
            ><span class="custom-tree-node" slot-scope="{ node }">
				<span>{{ $t(node.label) }}</span>       
			  </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>{{ $t("user.authorizeInfor.titleFieAccess") }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="columnList"
              default-expand-all
              node-key="F_ModuleId"
              ref="columnTree"
              highlight-current
              :props="moduleProps"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>{{ $t("user.authorizeInfor.titleFormAccess") }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="formList"
              default-expand-all
              node-key="F_ModuleId"
              ref="formTree"
              highlight-current
              :props="moduleProps"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
import { getAuthorized } from "@/api/organization/index";
export default {
  name: "AuthorizeInfo",
  props: {
    objectType: {
      type: Number,
    },
    objectId: {
      type: String,
    },
  },
  data() {
    return {
      buttonList: [],
      columnList: [],
      formList: [],
      moduleList: [],
      moduleProps: {
        children: "children",
        label: "F_FullName",
      },
    };
  },
  async mounted() {
    await this.getModulesAll();
  },
  methods: {
    async getModulesAll() {
      try {
        let res = await getAuthorized();
        if (res && res.data.data) {
          let moduleList = res?.data?.data?.moduleList;
          let buttonList = res?.data?.data?.buttonList;
          let columnList = res?.data?.data?.columnList;
          let formList = res?.data?.data?.formList;
          let haveSubSystem =
            moduleList.subSystemModuleList &&
            moduleList.subSystemModuleList.length;
          this.moduleList = moduleList.mainSystemModuleList;
          if (haveSubSystem) {
            moduleList.subSystemModuleList = this.formatterSystemNode(
              moduleList.subSystemModuleList
            );
            this.moduleList.push({
              F_FullName: "子系统",
              children: moduleList.subSystemModuleList,
            });
          }
          let buttonListCloneSub = [];
          this.buttonList = buttonList.mainSystemModuleList;

          if (haveSubSystem) {
            buttonList.subSystemModuleList = this.formatterSystemNode(
              buttonList.subSystemModuleList
            );
            buttonList.subSystemModuleList.forEach((element1) => {
              if (element1.children?.length > 0) {
                let temp = this.nodeLoopFormate(element1, "F_ModuleButtonId");
                buttonListCloneSub.push(temp);
              }
            });
          }
          if (buttonListCloneSub.length) {
            this.buttonList.push({
              F_FullName: "子系统",
              children: buttonListCloneSub,
            });
          }
          let columnListCloneSub = [];
          this.columnList = columnList.mainSystemModuleList;
          if (haveSubSystem) {
              columnList.subSystemModuleList = this.formatterSystemNode(
               columnList.subSystemModuleList
            );
            columnList.subSystemModuleList.forEach((element1) => {
              if (element1.children?.length > 0) {
                let temp = this.nodeLoopFormate(element1, "F_ModuleColumnId");
                columnListCloneSub.push(temp);
              }
            });
          }
          if (columnListCloneSub.length>0) {
            this.columnList.push({
              F_FullName: "子系统",
              children: columnListCloneSub,
            });
          }
        let formListCloneSub = [];
          this.formList = formList.mainSystemModuleList;
          if (haveSubSystem) {
            formList.subSystemModuleList = this.formatterSystemNode(
               formList.subSystemModuleList
            );
            formList.subSystemModuleList.forEach((element1) => {
              if (element1.children?.length > 0) {
                let temp = this.nodeLoopFormate(element1, "F_ModuleFormId");
                formListCloneSub.push(temp);
              }
            });
          }
          if (formListCloneSub.length>0) {
            this.formList.push({
              F_FullName: "子系统",
              children: formListCloneSub,
            });
          }

        }
        
      } catch (error) {}
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
    formatterSystemNode(arr) {
      arr.map((item) => {
        item["F_FullName"] = item.F_Name || "";
        item["id"] = item.F_Id || "";
      });
      return arr;
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
  height: 666px;
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
@media screen and (max-width: 1370px) {
  .tree-box {
    height: 420px;
  }
}
</style>
  