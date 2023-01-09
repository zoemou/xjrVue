<template>
  <div class="inline-box">
    <el-button size="mini" type="primary" @click="updateForm">
      {{ $t("updateFormData") }}
    </el-button>
    <el-dialog
      v-dialogDrag
      :title="$t('updateFormData')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="finish"
      width="60%"
      append-to-body
    >
      <el-table :data="formData" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="F_Name" :label="$t('forme.tableHeaderFormName')" width="180">
        </el-table-column>
        <el-table-column prop="F_Id" :label="$t('workFlow.schemeFormIndex.tabFormID')" width="180">
        </el-table-column>
        <el-table-column prop="type" :label="$t('formCategory')" width="120">
        </el-table-column>
        <el-table-column prop="node" :label="$t('owningNode')" width="180">
        </el-table-column>
        <el-table-column prop="status" :label="$t('updateStatus')" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.status == 0">
              <i class="el-icon-loading"></i
            ></span>
            <span style="margin-left: 10px" v-if="scope.row.status == 1"
              >{{$t('deletePrompt.successTitle')}}</span
            >
            <span style="margin-left: 10px" v-if="scope.row.status == 2"
              >{{$t('deletePrompt.failureTitle')}}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :label="$t('orgUserManagement.tabRemark')"> </el-table-column>
      </el-table>
      <div v-if="showSystemFormField">
        <div v-for="(item, index) in systemSchemeData" :key="index">
          <SystemFormUpdateField
            :id="item.id"
            :url="item.url"
            :index="item.index"
            :formInfo="item.formInfo"
            :component="item.component"
            @changeSystemData="changeSystemData"
            ref="SystemForm"
          ></SystemFormUpdateField>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          v-if="finish"
          type="primary"
          @click="submitDialog"
          >{{ $t("buttonModule.modalSureBtn") }}</el-button
        >
        <el-button type="info" v-else>{{ $t("buttonModule.modalSureBtn") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomFiled } from "./../../common/util/form";
import { getFormSchemeInfo } from "@/api/bpmn";
import { setProperties, getProperties } from "./../../common/util/properties";
import SystemFormUpdateField from "@/components/codeParser/SystemFormUpdateField.vue";
export default {
  components: {
    SystemFormUpdateField,
  },
  data() {
    return {
      dialogVisible: false,
      formData: [],
      systemSchemeData: [],
      showSystemFormField: false,
      oldChildrenMap: new Map(),
      UserDefinedformDataMap: new Map(),
    };
  },
  computed: {
    finish() {
      return (
        this.formData.filter((ele) => {
          return ele.status == 0;
        }).length == 0
      );
    },
  },
  methods: {
    getTypeName(type) {
      let typeName = "";
      switch (type) {
        case "bpmn:StartEvent":
          typeName = this.$t('workFlow.roams.startNode');
          break;
        case "bpmn:UserTask":
          typeName = this.$t('workFlow.roams.userNode');
          break;
        default:
          break;
      }
      return typeName;
    },
    async getUserDefinedInfo(formInfo, index) {
      let oldChildrenMap = this.getOldChildrenMap(formInfo.children);
      let self = this;
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          if (self.UserDefinedformDataMap.has(formInfo.F_Id)) {
            let changeFormItemChildren = self.UserDefinedformDataMap.get(
              formInfo.F_Id
            );
            if(changeFormItemChildren.status==1){
              let newChildren = self.changeFormItem(
                changeFormItemChildren.data,
                oldChildrenMap
              );
              formInfo.children = newChildren;
              formInfo.hideComponents = changeFormItemChildren.hideComponents;
              self.changeTableDataProperties(formInfo, { ...formInfo }, index);
              resolve({ status: 1, message: "" }); //成功
            }else{
               self.formData[index].status = 2;
                self.formData[index].remarks = "失败原因：表单不存在";
               resolve({ status: 2, message: this.$t('hintFormNotExist') }); //失败
            }
            
          } else {
             self.formData[index].status = 2;
              self.formData[index].remarks = "失败原因：表单不存在";
            resolve({ status: 2, message: this.$t('hintFormNotExist') }); //失败
          }
        }, 1000);
      });
    },
    changeSystemData({ returnData,hideComponents, index, formInfo }) {
      let oldChildrenMap = this.oldChildrenMap.has(index)
        ? this.oldChildrenMap.get(index)
        : [];
      if (returnData != null) {
        let newChildren = [];
        newChildren = this.changeFormItem(returnData, oldChildrenMap);
        formInfo.children = newChildren;
        formInfo.hideComponents = hideComponents;
        this.changeTableDataProperties(formInfo, { ...formInfo }, index);
      } else {
        this.formData[index].status = 2;
        this.formData[index].remarks = "失败原因：系统表单不存在";
      }
    },
    async getSystemDefinedInfo(formInfo, index) {
      let oldChildrenMap = this.getOldChildrenMap(formInfo.children);
      this.oldChildrenMap.set(index, oldChildrenMap);
      let self = this;
      let dataIndex = this.systemSchemeData.length;
      this.systemSchemeData.push({
        id: formInfo.id,
        url: formInfo.F_Url,
        index,
        formInfo,
        component: formInfo.component,
      });
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          if (self.$refs["SystemForm"][dataIndex].hasSystemFieldPermissions) {
            let hasSystemFieldPermissions =
              self.$refs["SystemForm"][dataIndex].hasSystemFieldPermissions();
            if (hasSystemFieldPermissions) {
              resolve({ status: 1, message: "" }); //成功
            } else {
              self.formData[index].status = 2;
              self.formData[index].remarks = "失败原因：系统表单不存在";
              resolve({ status: 2, message: self.$t('hintSystemFormNotExist') }); //失败
            }
          } else {
            self.formData[index].status = 2;
            self.formData[index].remarks = "失败原因：系统表单不存在";
            resolve({ status: 2, message: self.$t('hintSystemFormNotExist') }); //失败
          }
        }, 5000);
      });
    },
    getOldChildrenMap(oldChildren) {
      let oldChildrenMap = new Map();
      if (oldChildren.length > 0) {
        oldChildren.forEach((element) => {
          if (element.children) {
            //子表单
            element.children.forEach((item) => {
              let key =
                item.fieldsId + "-" + item.formId;
              oldChildrenMap.set(key, item);
            });
          } else {
            let key =
              element.fieldsId + "-" + element.formId;
            oldChildrenMap.set(key, element);
          }
        });
      }
      return oldChildrenMap;
    },

    changeTableDataProperties(formInfo, info, index) {
      this.$store.commit("SET_FORM_CONFIGURATION_ITEM", {
        key: formInfo.F_Id,
        value: info,
      });
      let propertiesInfo = getProperties(formInfo.id);
      propertiesInfo.tableData[info.index] = info;
      setProperties(formInfo.id, info);
      this.formData[index].status = 1;
    },
    changeFormItem(children, oldChildrenMap) {
      let newChildren = [];
      if (children.length > 0) {
        children.forEach((element) => {
          let children = [];
          if (element.children) {
            //子表单
            element.children.forEach((item) => {
              let key =
                item.fieldsId + "-" + item.formId;
              if (oldChildrenMap.has(key)) {
                let oldItem = oldChildrenMap.get(key);
                children.push({
                  ...item,
                  required: oldItem.required,
                  disabled: oldItem.disabled,
                  edit: oldItem.edit,
                  view: oldItem.view,
                }
              );
              } else {
                children.push(item);
              }
            });
            element.children = children;
          } else {
            let key =
              element.fieldsId + "-" + element.formId;
            if (oldChildrenMap.has(key)) {
              let oldElement = oldChildrenMap.get(key);
              element = {
                ...element,
                required: oldElement.required,
                disabled: oldElement.disabled,
                edit: oldElement.edit,
                view: oldElement.view,
              };
            }
          }
          newChildren.push(element);
        });
      }
      return newChildren;
    },
    async aysncValidateForm() {
      for (let index = 0; index < this.formData.length; index++) {
        const ele = this.formData[index];
        if (ele.F_Type == 0) {
          if (this.UserDefinedformDataMap.has(ele.F_Id)) {
            ele.schemeInfoData = this.UserDefinedformDataMap.get(ele.F_Id).schemeInfoData
          } else {
            let info = null;
            try {
              let res = await getFormSchemeInfo(ele.F_Id);
              if (
                res.data.success &&
                res.data.data?.Scheme &&
                res.data.data?.Scheme.F_Scheme
              ) {
                let schemeInfo = JSON.parse(res.data.data.Scheme.F_Scheme);
                let returnData = getCustomFiled(schemeInfo);
                ele.schemeInfoData = schemeInfo.data
                info = { status: 1, message: "", data: returnData.children, hideComponents: returnData.hideComponents,schemeInfoData:schemeInfo.data }; //成功
              } else {
                info = { status: 2, message: this.$t('hintFormNotFound'), data: [],hideComponents:[] }; //失败
              }
            } catch (error) {
              info = { status: 2, message:this.$t('hintFormNotFound'), data: [],hideComponents:[] }; //失败
            }
            this.UserDefinedformDataMap.set(ele.F_Id, info);
          }
          this.getUserDefinedInfo(ele, index);
        } else if (ele.F_Type == 2) {
          this.getSystemDefinedInfo(ele, index);
        }
      }
      this.showSystemFormField = true;
    },
    updateForm() {
      this.formData = [];
      let formInfo = this.$store.state.bpmn.info;
      this.oldChildrenMap = new Map();
       this.UserDefinedformDataMap = new Map();
      this.systemSchemeData = [];
      this.showSystemFormField = false;
      if (formInfo.size > 0) {
        [...formInfo].forEach((ele1) => {
          if (ele1.length == 2) {
            let info = ele1[1];
            if (info.tableData && info.tableData.length > 0) {
              info.tableData.forEach((ele2, index2) => {
                this.formData.push({
                  F_Id: ele2.F_Id,
                  F_Name: ele2.F_Name,
                  F_Type: ele2.F_Type,
                  type: ele2.type,
                  nodeType: info.type,
                  node: info.name ? info.name : this.getTypeName(info.type),
                  status: 0,
                  remarks: "",
                  id: info.id,
                  index: index2,
                  component: ele2.component,
                  F_Url: ele2.F_Url,
                  children: ele2.children,
                });
              });
            }
          }
        });
        this.aysncValidateForm();
      }
      this.dialogVisible = true;
    },
    submitDialog() {
      this.$emit("changeKey");
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.inline-box {
  display: inline-block;
  margin: 0 4px;
}
.el-table {
  height: 400px;
  overflow: scroll;
}
</style>
<style scoped>
div >>> .el-table .cell {
  text-align: center;
}
</style>
