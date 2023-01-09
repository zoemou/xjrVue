<template>
  <div class="main-container">
    <el-row style="">
      <el-col :span="24">
        <el-button size="mini" @click="copyAuthority">复用已有权限</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>系统功能</span>
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
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>按钮权限</span>
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
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>字段权限</span>
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
      <el-col :span="6">
        <div class="tree-box">
          <div class="title">
            <span>表单权限</span>
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
      title="复用已有权限"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="closeDialog"
    >
      <user-authorize
        v-if="dialogVisible && objectType == '2'"
        ref="userAuthorizeRef"
      ></user-authorize>
      <role-authorize
        v-if="dialogVisible && objectType == '1'"
        ref="roleAuthorizeRef"
      ></role-authorize>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmDialog"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getModulesAll, getAuthorizes } from "@/api/organization/index";
import { deepClone } from "@/utils/index";
export default {
  name: "AuthorizeSelectTree",
  props: {
    objectType: {
      type: String,
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
      buttonListClone: [],
      columnListClone: [],
      formListClone: [],
      moduleKeys: [],
      buttonKeys: [],
      columnKeys: [],
      formKeys: [],
      moduleProps: {
        children: "children",
        label: "F_FullName",
      },
      dialogVisible: false,
    };
  },
  mounted() {
    this.getModulesAll();
  },
  methods: {
    getModulesAll() {
      getModulesAll().then((res) => {
        this.moduleList = res.data.data.moduleList;
        res.data.data.buttonList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleButtonId");
            this.buttonListClone.push(temp);
          }
        });
        res.data.data.columnList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleColumnId");
            this.columnListClone.push(temp);
          }
        });

        res.data.data.formList.forEach((element1) => {
          if (element1.children?.length > 0) {
            let temp = this.nodeLoopFormate(element1, "F_ModuleFormId");
            this.formListClone.push(temp);
          }
        });
        this.getAuthorizes(this.objectType, this.objectId);
      });
    },
    getAuthorizes(type, id) {
      getAuthorizes(type, id).then((res) => {
        this.moduleKeys = res.data.data[0];
        let moduleSelectedKeysArr = [];
        this.moduleList.forEach((ele) => {
          if (ele.children.length > 0) {
            ele.children.forEach((ele2) => {
              if (ele2.children.length > 0) {
                ele2.children.forEach((ele3) => {
                  if (ele3.children.length == 0) {
                    moduleSelectedKeysArr.push(ele3.F_ModuleId);
                  }
                });
              } else {
                moduleSelectedKeysArr.push(ele2.F_ModuleId);
              }
            });
          } else {
            moduleSelectedKeysArr.push(ele.F_ModuleId);
          }
        });
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
      });
    },
    formatTree() {
      this.buttonList = this.changeData(this.buttonListClone, this.buttonKeys);
      this.$refs.buttonTree.setCheckedKeys(this.buttonKeys);
      this.columnList = this.changeData(this.columnListClone, this.columnKeys);
      this.$refs.columnTree.setCheckedKeys(this.columnKeys);
      this.formList = this.changeData(this.formListClone, this.formKeys);
      this.$refs.formTree.setCheckedKeys(this.formKeys);
    },
    nodemoduleCheck(data, checkedData) {
      this.moduleKeys = [
        ...checkedData.checkedKeys,
        ...checkedData.halfCheckedKeys,
      ];
      this.formatTree();
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

      let obj = {
        moduleJson: moduleJson,
        buttonJson: buttonJson,
        columnJson: columnJson,
        formJson: formJson,
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
      this.closeDialog();
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
    changeData(loopCloneArr, checkedKeys) {
      let buttonList = [];
      loopCloneArr.forEach((element) => {
        if (element.F_ModuleId && checkedKeys.includes(element.F_ModuleId)) {
          buttonList.push(element);
        } else {
          if (
            element.F_ModuleId &&
            this.moduleKeys.includes(element.F_ModuleId)
          ) {
            let checkedArr = [];
            let tempElement = deepClone(element);
            tempElement.children = [];
            if (element.children.length > 0) {
              element.children.forEach((element2) => {
                if (
                  element2.F_ModuleId &&
                  this.moduleKeys.includes(element2.F_ModuleId)
                ) {
                  let checkedArr2 = [];
                  let tempElement2 = deepClone(element2);

                  if (element2.children.length > 0) {
                    element2.children.forEach((element3) => {
                      if (
                        element3.F_ModuleId &&
                        this.moduleKeys.includes(element3.F_ModuleId)
                      ) {
                        checkedArr2.push(element3);
                      }
                    });
                  }
                  if (checkedArr2.length > 0) {
                    tempElement2.children = [];
                    tempElement2.children = checkedArr2;
                  }
                  checkedArr.push(tempElement2);
                }
              });
            }
            if (checkedArr.length > 0) {
              tempElement.children = checkedArr;
            }
            buttonList.push(tempElement);
          }
        }
      });
      return buttonList;
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
	  .tree-box{
		height: 420px;
	   }   
	} 
</style>
