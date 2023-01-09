<template>
  <div>
    <el-form-item>
      <el-button
        size="small"
        @click="addScheme()"
        v-if="!isSpecialInitiationProcess"
        >{{ $t("workFlow.schemeFormIndex.addBtn") }}</el-button
      >
    </el-form-item>
    <el-form-item class="table-box">
      <el-table :data="tableData" style="width: 100%" :key="tableKey" border>
        <el-table-column type="expand">
          <template slot-scope="props" v-if="props.row.children.length > 0">
            <div class="flex-box head">
              <span class="flex-item">{{
                $t("workFlow.schemeFormIndex.tabFieldName")
              }}</span>
              <span class="flex-item">{{
                $t("workFlow.schemeFormIndex.tabFieldID")
              }}</span>
              <span class="flex-item">
                <el-checkbox
                  v-model="props.row.requiredAll"
                  @change="changeAll('required', props.row)"
                ></el-checkbox
                >{{ $t("workFlow.schemeFormIndex.tabMustFill") }}</span
              >
              <span class="flex-item"
                ><el-checkbox
                  v-model="props.row.viewAll"
                  @change="changeAll('view', props.row)"
                ></el-checkbox
                >{{ $t("workFlow.schemeFormIndex.tabView") }}</span
              >
              <span class="flex-item"
                ><el-checkbox
                  v-model="props.row.editAll"
                  @change="changeAll('edit', props.row)"
                ></el-checkbox
                >{{ $t("workFlow.schemeFormIndex.tabEdit") }}</span
              >
            </div>
            <div v-for="(item, index) in props.row.children" :key="index">
              <template v-if="item.type == 'table'">
                <div class="flex-box">
                  <span class="flex-item"
                    ><i
                      class="el-icon"
                      @click="item.show = !item.show"
                      :class="
                        item.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                      "
                    ></i
                    >{{ item.fieldsName }}</span
                  >
                  <span class="flex-item"></span>
                  <span class="flex-item"></span>
                  <span class="flex-item"
                    ><el-switch
                      v-model="item.view"
                      :width="30"
                      @change="changeSubItem(props.$index, index)"
                    ></el-switch
                  ></span>
                </div>
                <div v-if="item.show" style="padding-left: 10px">
                  <div v-for="(item2, index2) in item.children" :key="index2">
                    <div class="flex-box">
                      <span class="flex-item">{{ item2.fieldsName }}</span>
                      <span class="flex-item">{{ item2.fieldsId }}</span>
                      <span class="flex-item"
                        ><el-switch
                          :disabled="item2.disabled"
                          v-model="item2.required"
                          :width="30"
                          @change="
                            changeItem('required', props.$index, index, index2)
                          "
                        >
                        </el-switch
                      ></span>
                      <span class="flex-item"
                        ><el-switch
                          v-model="item2.view"
                          :width="30"
                          @change="
                            changeItem('view', props.$index, index, index2)
                          "
                        >
                        </el-switch
                      ></span>
                      <span class="flex-item"
                        ><el-switch
                          :disabled="item2.disabled"
                          v-model="item2.edit"
                          :width="30"
                          @change="
                            changeItem('edit', props.$index, index, index2)
                          "
                        >
                        </el-switch
                      ></span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex-box">
                  <span class="flex-item">{{ item.fieldsName }}</span>
                  <span class="flex-item">{{ item.fieldsId }}</span>
                  <span class="flex-item"
                    ><el-switch
                      :disabled="item.disabled"
                      v-model="item.required"
                      :width="30"
                      @change="changeItem('required', props.$index, index)"
                    >
                    </el-switch
                  ></span>
                  <span class="flex-item"
                    ><el-switch
                      v-model="item.view"
                      :width="30"
                      @change="changeItem('view', props.$index, index)"
                    >
                    </el-switch
                  ></span>
                  <span class="flex-item"
                    ><el-switch
                      :disabled="item.disabled"
                      v-model="item.edit"
                      :width="30"
                      @change="changeItem('edit', props.$index, index)"
                    >
                    </el-switch
                  ></span>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('workFlow.schemeFormIndex.tabOperate')"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!isSpecialInitiationProcess"
              @click="editScheme(scope.$index, scope.row)"
              type="text"
              size="small"
              >{{ $t("tableOperationModule.editorBtn") }}</el-button
            >
            <el-button
              v-if="!isSpecialInitiationProcess"
              type="text"
              size="small"
              @click="delScheme(scope.$index)"
              >{{ $t("tableOperationModule.deleteBtn") }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('workFlow.schemeFormIndex.tabFormID')"
          prop="F_Id"
          width="200"
        >
        </el-table-column>
        <el-table-column
          :label="$t('workFlow.schemeFormIndex.tabFormName')"
          prop="F_Name"
        >
        </el-table-column>
        <el-table-column
          :label="$t('workFlow.schemeFormIndex.tabFormType')"
          prop="type"
        >
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      append-to-body
      @closed="closeDialog"
    >
      <SystemFormField
        v-if="scheme.type == 2 && showSystemFormField"
        :id="scheme.id"
        :url="scheme.url"
        :component="scheme.component"
        @changeSystemData="changeSystemChildrenData"
         @changeHideComponents="changeHideComponents"
      ></SystemFormField>
      <SchemeFormDialog
        v-if="dialogVisible"
        :scheme.sync="scheme"
        :selectSchemeList="selectSchemeList"
        @changeSchemeType="changeSchemeType"
        @changeScheme="changeScheme"
      ></SchemeFormDialog>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="submitSchemeDialog">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SchemeFormDialog from "./SchemeFormDialog";
import SystemFormField from "@/components/codeParser/SystemFormField.vue";
import {
  getFormScheme,
  getFormSchemeInfo,
  getSystemFormScheme,
} from "@/api/bpmn";
import { deepClone } from "@/util/util";
import { getCustomFiled } from "./../../../common/util/form";
export default {
  components: {
    SchemeFormDialog,
    SystemFormField,
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      dialogTitle: this.$t("workFlow.formInitiationProcessDialog.titleFormSet"),
      dialogVisible: false,
      selectSchemeList: [],
      editIndex: -1,
      tableKey: 1,
      scheme: {
        id: "",
        name: "",
        type: 0,
        url: "",
        schemeInfoData: {},
        component: "",
        hideComponents:[]
      },
      showSystemFormField: false, //iframe页面做完处理再显示
      systemChildrenData: [],
      loadingSetTimeout: null,
    };
  },
  computed: {
    isSpecialInitiationProcess() {
      return this.$store.state.bpmn.isSpecialInitiationProcess;
    },
  },
  mounted() {
    this.tableKey = Math.random();
  },
  methods: {
    changeSubItem(tabKey, index) {
      //只修改查看权限
      let boolVal = this.tableData[tabKey].children[index].view;
      this.tableData[tabKey].children[index].required = boolVal;
      this.tableData[tabKey].children[index].edit = boolVal;
      if (this.tableData[tabKey].children[index].children.length > 0) {
        this.tableData[tabKey].children[index].children = this.tableData[
          tabKey
        ].children[index].children.map((ele) => {
          ele.required = boolVal;
          ele.view = boolVal;
          ele.edit = boolVal;
          return ele;
        });
      }
    },
    changeItem(type, tabKey, index, index2) {
      if (index2 != undefined) {
        if (type == "required") {
          let requiredBool =
            this.tableData[tabKey].children[index].children[index2].required;
            if(requiredBool){
               this.tableData[tabKey].children[index].children[index2].edit =
            requiredBool;
            this.tableData[tabKey].children[index].children[index2].view =
            requiredBool;
            }
         
        } else if (type == "edit") {
          let editBool =
            this.tableData[tabKey].children[index].children[index2].edit;
          if(editBool){
               this.tableData[tabKey].children[index].children[index2].view =
            editBool;
          }else{
             this.tableData[tabKey].children[index].children[index2].required =
            editBool;
          }
         
        } else if (type == "view") {
           let viewBool =
            this.tableData[tabKey].children[index].children[index2].view;
          if(viewBool){
            
          }else{
             this.tableData[tabKey].children[index].children[index2].required =
            viewBool;
             this.tableData[tabKey].children[index].children[index2].edit =
            viewBool;
          }
        }
      } else {
        if (type == "required") {
          let requiredBool = this.tableData[tabKey].children[index].required;
          if(requiredBool){
             this.tableData[tabKey].children[index].edit = requiredBool;
             this.tableData[tabKey].children[index].view = requiredBool;
          }
         
        } else if (type == "edit") {
          let editBool = this.tableData[tabKey].children[index].edit;
          if(editBool){
             this.tableData[tabKey].children[index].view =
            editBool;
          }else{
             this.tableData[tabKey].children[index].required =
            editBool;
          }
        } else if (type == "view") {
          let viewBool =
            this.tableData[tabKey].children[index].view;
          if(viewBool){
            
          }else{
             this.tableData[tabKey].children[index].required =
            viewBool;
             this.tableData[tabKey].children[index].edit =
            viewBool;
          }

        }
        let requiredAll = false;
        let childrenLength = this.tableData[tabKey].children.length;
        let childrenRequired = this.tableData[tabKey].children.filter((ele) => {
          return ele.required;
        });
        if (childrenRequired.length == childrenLength) {
          requiredAll = true;
        }
        this.tableData[tabKey].requiredAll = requiredAll;

        let editAll = false;
        let editChildrenLength = this.tableData[tabKey].children.length;
        let editChildrenRequired = this.tableData[tabKey].children.filter(
          (ele) => {
            return ele.edit;
          }
        );
        if (editChildrenRequired.length == editChildrenLength) {
          editAll = true;
        }
        this.tableData[tabKey].editAll = editAll;

        let viewAll = false;
        let viewChildrenLength = this.tableData[tabKey].children.length;
        let viewChildrenRequired = this.tableData[tabKey].children.filter(
          (ele) => {
            return ele.view;
          }
        );
        if (viewChildrenRequired.length == viewChildrenLength) {
          viewAll = true;
        }
        this.tableData[tabKey].viewAll = viewAll;
      }
    },
    changeAll(type, row) {
      let trueVal = true;
      let falseVal = false;
      // 点击了必填，编辑跟查看一起变化   点击编辑，查看一起变化
      if (type == "required") {
        let requiredBool = row.requiredAll;
        if (requiredBool) {
          row.editAll = trueVal;
          row.viewAll = trueVal;
          if (row.children.length > 0) {
            row.children = row.children.map((ele) => {
              if (!ele.disabled) {
                ele.required = trueVal;
                ele.edit = trueVal;
              }
              ele.view = trueVal;
              if (ele.children && ele.children.length > 0) {
                ele.children = ele.children.map((ele2) => {
                  if (!ele2.disabled) {
                    ele2.required = ele.view;
                    ele2.edit = ele.view;
                    ele2.view = ele.view;
                  }
                  return ele2;
                });
              }
              return ele;
            });
          }
        } else {
          row.children = row.children.map((ele) => {
            if (!ele.disabled) {
              ele.required = falseVal;
            }
            if (ele.children && ele.children.length > 0) {
              ele.children = ele.children.map((ele2) => {
                if (!ele2.disabled) {
                  ele2.required = falseVal;
                }
                return ele2;
              });
            }
            return ele;
          });
        }
      } else if (type == "edit") {
        let editBool = row.editAll;
        if (editBool) {
          row.viewAll = trueVal;
          if (row.children.length > 0) {
            row.children = row.children.map((ele) => {
              if (!ele.disabled) {
                ele.edit = trueVal;
              }
               ele.view = trueVal;
              if (ele.children && ele.children.length > 0) {
                ele.children = ele.children.map((ele2) => {
                  if (!ele2.disabled) {
                    ele2.edit = trueVal;
                    ele2.view = trueVal;
                  }
                  return ele2;
                });
              }
              return ele;
            });
          }
        } else {
          row.requiredAll = falseVal;
          if (row.children.length > 0) {
            row.children = row.children.map((ele) => {
              if (!ele.disabled) {
                ele.required = falseVal;
                ele.edit = falseVal;
              }
              if (ele.children && ele.children.length > 0) {
                ele.children = ele.children.map((ele2) => {
                  if (!ele2.disabled) {
                    ele2.required = falseVal;
                    ele2.edit = falseVal;
                  }
                  return ele2;
                });
              }
              return ele;
            });
          }
        }
      } else if (type == "view") {
        let viewBool = row.viewAll;
        if (viewBool) {
          if (row.children.length > 0) {
            row.children = row.children.map((ele) => {
                ele.view = trueVal;
              if (ele.children && ele.children.length > 0) {
                ele.children = ele.children.map((ele2) => {
                  ele2.view = trueVal;
                  return ele2;
                });
              }
              return ele;
            });
          }
        } else {
          row.requiredAll = falseVal;
          row.editAll = falseVal;
          if (row.children.length > 0) {
            row.children = row.children.map((ele) => {
              ele.view = falseVal;
              ele.required = falseVal;
              ele.edit = falseVal;
              if (ele.children && ele.children.length > 0) {
                ele.children = ele.children.map((ele2) => {
                  if (!ele2.disabled) {
                    ele2.required = falseVal;
                    ele2.edit = falseVal;
                  }
                  ele2.view = falseVal;
                  return ele2;
                });
              }
              return ele;
            });
          }
        }
      }
    },
    async addScheme() {
      this.showSystemFormField = false;
      this.editIndex = -1;
      this.scheme.id = "";
      this.scheme.type = 0;
      this.scheme.name = "";
      this.scheme.url = "";
      this.scheme.component = "";
      try {
        this.dialogVisible = true;
        await this.getFirstFormConfigurationKey();
      } catch (error) {}
    },
    async getFirstFormConfigurationKey() {
      let firstFormConfigurationKey =
        this.$store.state.bpmn.firstFormConfigurationKey;
      if (firstFormConfigurationKey) {
        let formConfiguration = this.$store.state.bpmn.formConfiguration;
        if (formConfiguration.has(firstFormConfigurationKey)) {
          let schemeInfo = deepClone(
            formConfiguration.get(firstFormConfigurationKey)
          );
          if (schemeInfo.F_Type == 0) {
            await this.customSheet();
          } else {
            await this.systemSheet();
          }
          this.scheme.id = schemeInfo.F_Id;
          this.scheme.type = schemeInfo.F_Type;
          this.scheme.name = schemeInfo.F_Name;
          this.scheme.url = schemeInfo.F_Url ? schemeInfo.F_Url : "";
          this.scheme.component = schemeInfo.component
            ? schemeInfo.component
            : "";
          this.scheme.schemeInfoData = schemeInfo.schemeInfoData;
        }
      } else {
        this.scheme.type = 0;
        await this.customSheet();
      }
    },
    async editScheme(index, row) {
      this.showSystemFormField = false;
      this.editIndex = index;
      this.scheme.id = row.F_Id;
      this.scheme.type = row.F_Type;
      this.scheme.name = row.F_Name;
      this.scheme.url = row.F_Url;
      this.scheme.component = row.component;
      try {
        if (this.scheme.type == 0) {
          await this.customSheet();
          await this.getUserDefinedInfo();
        } else {
          await this.systemSheet();
          this.getSystemInfo();
        }
        this.dialogVisible = true;
      } catch (error) {}
    },
    delScheme(index) {
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("deletePrompt.successDeleted"),
        type: "success",
      });
      this.$store.dispatch("addAllForm", {
        obj: "",
        id: this.tableData[index].F_Id,
      });
      this.tableData.splice(index, 1);
    },
    async customSheet() {
      this.selectSchemeList = [];
      let res = await getFormScheme();
      if (res.data.success) {
        if (res.data.data?.length > 0) {
          this.selectSchemeList = res.data.data;
        }
      }
    },
    async systemSheet() {
      this.selectSchemeList = [];
      let res = await getSystemFormScheme();
      if (res.data.success) {
        if (res.data.data.length > 0) {
          this.selectSchemeList = res.data.data.map((ele) => {
            ele.F_Id = ele.formId;
            ele.F_Name = ele.name;
            ele.F_Url = ele.url;
            ele.component = ele.component;
            return ele;
          });
        }
      }
    },
    submitSchemeDialog() {
      if (!this.scheme.id) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t(
            "workFlow.formInitiationProcessDialog.hintSelectForm"
          ),
          type: "warning",
        });
        return false;
      }
      let scheme = {};
      let formConfiguration = this.$store.state.bpmn.formConfiguration;
      if (formConfiguration.has(this.scheme.id)) {
        scheme = deepClone(formConfiguration.get(this.scheme.id));
      }
      if (this.editIndex < 0) {
        let { schemeInfoData, ...params } = scheme;
        this.tableData.push(params);
        this.$store.dispatch("addAllForm", { obj: params, id: "" });
      } else {
        let id = deepClone(this.tableData[this.editIndex]).F_Id;
        this.tableData[this.editIndex] = {};
        let { schemeInfoData, ...params } = scheme;
        this.tableData[this.editIndex] = params;
        this.tableKey = Math.random(); //实时更新table数据
        this.$store.dispatch("addAllForm", { obj: params, id: id });
      }
      this.$notify({
        title: this.$t("deletePrompt.promptTitle"),
        message: this.$t("workFlow.formInitiationProcessDialog.hintAddSuccess"),
        type: "success",
      });
      this.closeDialog();
      this.$emit('changeFormkeydefinition');
    },
    changeSystemChildrenData(data) {
      this.systemChildrenData = data;
      let info = this.getSystemFiled(data);
      info.hideComponents =  this.scheme.hideComponents;
      this.$store.commit("SET_FIRST_FORM_CONFIGURATION_KEY", this.scheme.id);
      this.$store.commit("SET_FORM_CONFIGURATION_ITEM", {
        key: this.scheme.id,
        value: info,
      });
      this.showSystemFormField = false;
    },
    changeHideComponents(hideComponents){
      this.scheme.hideComponents = hideComponents;
    },
    async changeSchemeType() {
      this.showSystemFormField = false;
      this.systemChildrenData = [];
      this.scheme.url = "";
      this.scheme.component = "";
      this.scheme.schemeInfoData = {};
      this.scheme.hideComponents = []
      try {
        if (this.scheme.type == 0) {
          this.scheme.id = "";
          this.scheme.name = "";
          this.scheme.type = 0;
          this.scheme.component = "";
          await this.customSheet();
        } else {
          this.scheme.id = "";
          this.scheme.name = "";
          this.scheme.type = 2;
          this.scheme.component = "";
          await this.systemSheet();
        }
      } catch (error) {}
    },
    async changeScheme(value) {
      this.showSystemFormField = false;
      this.scheme.url = "";
      this.scheme.component = "";
      this.systemChildrenData = [];
      this.scheme.component = "";
      let result = this.selectSchemeList.filter((element) => {
        return element.F_Id == value;
      });
      let { F_Id, F_Name } = result[0];
      if (F_Id && F_Name) {
        this.scheme.id = F_Id;
        this.scheme.name = F_Name;
        if (this.scheme.type == 0) {
          await this.getUserDefinedInfo();
        } else {
          this.scheme.url = result[0].F_Url;
          this.scheme.component = result[0].component;
          this.getSystemInfo();
        }
      } else {
        this.scheme.id = "";
        this.scheme.name = "";
      }
    },
    async getUserDefinedInfo() {
      if (!this.scheme.id) {
        this.$message(
          this.$t("workFlow.formInitiationProcessDialog.hintNoSelectForm")
        );
      } else {
        let formConfiguration = this.$store.state.bpmn.formConfiguration;
        if (formConfiguration.has(this.scheme.id)) {
          this.scheme.schemeInfoData = deepClone(
            formConfiguration.get(this.scheme.id).schemeInfoData
          );
          // this.scheme.hideComponents = []
        } else {
          let res = await getFormSchemeInfo(this.scheme.id);
          let info = {};
          let hideComponents = [];//隐藏组件
          if (
            res.data.success &&
            res.data.data?.Scheme &&
            res.data.data?.Scheme.F_Scheme
          ) {
            let schemeInfo = JSON.parse(res.data.data.Scheme.F_Scheme);
            if(schemeInfo.data&&schemeInfo.data.hideComponents){
              hideComponents = schemeInfo.data.hideComponents;
              this.scheme.hideComponents = hideComponents;
            }
            let returnData = getCustomFiled(schemeInfo);
            this.scheme.schemeInfoData = schemeInfo.data;
            info = {
              F_Id: this.scheme.id,
              F_Name: this.scheme.name,
              F_Type: this.scheme.type,
              requiredAll: returnData.requiredAll,
              viewAll: true,
              editAll: true,
              type: this.$t("workFlow.formInitiationProcessDialog.typeCusForm"),
              children: returnData.children,
              schemeInfoData: this.scheme.schemeInfoData,
              hideComponents:this.scheme.hideComponents
            };
          } else if (res.data.data == null) {
            this.scheme.id = "";
          }
          this.$store.commit(
            "SET_FIRST_FORM_CONFIGURATION_KEY",
            this.scheme.id
          );
          this.$store.commit("SET_FORM_CONFIGURATION_ITEM", {
            key: this.scheme.id,
            value: info,
          });
        }
      }
    },
    getSystemInfo() {
      let formConfiguration = this.$store.state.bpmn.formConfiguration;
      if (formConfiguration.has(this.scheme.id)) {
        this.showSystemFormField = false;
      } else {
        setTimeout(() => {
          this.showSystemFormField = true; //获取表单权限
        }, 1);
      }
    },
    getSystemFiled(children) {
      return {
        F_Id: this.scheme.id,
        F_Name: this.scheme.name,
        F_Type: this.scheme.type,
        F_Url: this.scheme.url,
        component: this.scheme.component,
        requiredAll: true,
        viewAll: true,
        editAll: true,
        type: this.$t("workFlow.formInitiationProcessDialog.typeSysForm"),
        children,
        schemeInfo: {},
      };
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-box {
  padding: 2px 0;
}
.ml-2 {
  margin-left: 60px;
}
.head {
  background-color: #fafafa;
  font-weight: 700;
}
.el-checkbox:last-of-type {
  margin-right: 5px;
}
.flex-box {
  display: flex;
  padding-left: 60px;
  .flex-item {
    flex-basis: 16%;
    line-height: 40px;
    height: 40px;
    margin-left: 1%;
    margin-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style scoped>
.flex-item /deep/ .el-switch__core {
  height: 14px;
}
.flex-item /deep/ .el-switch.is-checked .el-switch__core::after {
  margin-left: -10px;
}
.flex-item /deep/ .el-switch__core:after {
  width: 10px;
  height: 10px;
}
</style>
