<template>
  <div class="main-container" v-loading="loading">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="6" style="height: 100%">
        <div class="tree-box">
          <div class="title">
            <span>{{
              $t("orgRoleManagement.setAuthorizeModal.sysFunction")
            }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="functionList"
              show-checkbox
              default-expand-all
              node-key="F_Id"
              ref="moduleTree"
              highlight-current
              :props="moduleProps"
              @check="nodemoduleCheck"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%">
        <div class="tree-box">
          <div class="title">
            <span>{{
              $t("orgRoleManagement.setAuthorizeModal.btnAuthority")
            }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="selectButtonList"
              show-checkbox
              default-expand-all
              node-key="F_Id"
              ref="buttonTree"
              highlight-current
              :props="moduleProps"
              @check="buttonCheckChange"
              ><span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ $t(node.label) }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%">
        <div class="tree-box">
          <div class="title">
            <span>{{
              $t("orgRoleManagement.setAuthorizeModal.fieAuthority")
            }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="selectColumnList"
              show-checkbox
              default-expand-all
              node-key="F_Id"
              ref="columnTree"
              highlight-current
              :props="moduleProps"
              @check="columnCheckChange"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%">
        <div class="tree-box">
          <div class="title">
            <span>{{
              $t("orgRoleManagement.setAuthorizeModal.formAuthority")
            }}</span>
          </div>
          <div class="tree">
            <el-tree
              :data="selectFormList"
              show-checkbox
              default-expand-all
              node-key="F_Id"
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

    <el-dialog
      v-dialogDrag
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
        <el-button size="mini" @click="closeDialog">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button size="mini" type="primary" @click="confirmDialog">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getModulesAll, getAuthorizes } from "@/api/system/app";
import { deepClone } from "@/utils/index";
export default {
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
      functionList: [],
      selectButtonList: [],
      selectColumnList: [],
      selectFormList: [],
      moduleKeys: [],
      buttonKeys: [],
      columnKeys: [],
      formKeys: [],
      moduleProps: {
        children: "children",
        label: "F_Name",
      },
      dialogVisible: false,
      loading: true,
    };
  },
  mounted() {
    this.getModulesAll();
  },
  methods: {
    async getModulesAll() {
      try {
        let res = await getModulesAll();
        if (res && res.data.data) {
          this.functionList = res?.data?.data?.functionList;
          this.buttonList = res?.data?.data?.buttonList;
          this.columnList = res?.data?.data?.columnList;
          this.formList = res?.data?.data?.formList;
          this.getAuthorizes(this.objectType, this.objectId);
        } else {
        }
      } catch (error) {}
    },
    getModuleIds(module) {
      let arr = [];
      module.map((item) => {
        if (item?.children && item.children.length) {
          arr.push(...this.getModuleIds(item.children));
        } else {
          arr.push(item.F_Id);
        }
      });
      return (() => {
        return arr;
      })();
    },
    getAuthorizes(type, id) {
      getAuthorizes(type, id).then((res) => {
        this.moduleKeys = res.data.data[0];
        let moduleSelectedKeysArr = this.getModuleIds(this.functionList);

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
        this.loading = false;
      });
    },
    formatTree() {
      this.selectButtonList = this.changeData(
        this.buttonList,
        this.buttonKeys,
        "F_Id"
      );
      this.$refs.buttonTree.setCheckedKeys(this.buttonKeys);
      this.selectColumnList = this.changeData(
        this.columnList,
        this.columnKeys,
        "F_Id"
      );
      this.$refs.columnTree.setCheckedKeys(this.columnKeys);
      this.selectFormList = this.changeData(
        this.formList,
        this.formKeys,
        "F_Id"
      );
      this.formKeys = this.keyHasChildren(
        this.formKeys,
        this.selectFormList,
        "F_Id"
      );
      this.$refs.formTree.setCheckedKeys(this.formKeys);
    },
    keyHasChildren(keys, list, name) {
      for (let i = 0; i < list.length; i++) {
        let el = list[i];
        if (keys.includes(el[name]) && el.children?.length > 0) {
          keys = keys.filter((o) => {
            return o != el[name];
          });

          keys = this.keyHasChildren(keys, el.children, name);
        } else if (el.children?.length > 0) {
          keys = this.keyHasChildren(keys, el.children, name);
        }
      }
      return keys;
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
    copyAuthority() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
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
        json.F_Id = json[changeStr];
      }
      if (json.children && json.children.length > 0) {
        let tempArr = json.children;
        json.children = tempArr.map((element2) => {
          return this.nodeLoopFormate(element2, changeStr);
        });
      }
      return json;
    },
    changeData(loopCloneArr, checkedKeys, name) {
      var showList = [];
      loopCloneArr.forEach((element) => {
        let tempElement = deepClone(element);
        if ( this.moduleKeys.includes(tempElement[name])) {
          if (tempElement.children && tempElement.children.length > 0) {
            tempElement.children = tempElement.children.filter((ele2) => {
              return this.moduleKeys.includes(ele2[name]);
            });
          }
          showList.push(tempElement);
        }
      });
      return showList;
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

      let obj = {
        appModuleJson: moduleJson,
        appButtonJson: buttonJson,
        appColumnJson: columnJson,
        appFormJson: formJson,
      };
      return obj;
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
  height: 60vh;
  padding: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
