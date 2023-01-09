<template>
  <div>
    <div class="el-input__inner" @click="openScheme()">
      {{$t(formInfo.formInitiationProcess.schemeName)}}
    </div>
    <el-dialog v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      append-to-body
      @closed="closeDialog"
    >
      <SystemFormField
        v-if="dialogVisible&&scheme.type == 2 && showSystemFormField"
        :id="scheme.id"
        :url="scheme.url"
        :component="scheme.component"
        @changeSystemData="changeSystemChildrenData"
      ></SystemFormField>
      <SchemeFormDialog
        v-if="dialogVisible"
        :scheme.sync="scheme"
        :selectSchemeList="selectSchemeList"
        @changeSchemeType="changeSchemeType"
        @changeScheme="changeScheme"
      ></SchemeFormDialog>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="small" type="primary" @click="submitSchemeDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
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
  getSystemFormScheme
} from "@/api/bpmn";
import { deepClone } from "@/util/util";
export default {
  components: {
    SchemeFormDialog,
    SystemFormField
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {
          formInitiationProcess: {
            isOpen: 0,
            type: -1, //自定义表单 0  系统表单 2
            schemeId: "", //表单id
            schemeName:'workFlow.formInitiationProcessDialog.selectForm',
            schemeUrl:"",
            component:""
          }
        };
      }
    }
  },
  data() {
    return {
      dialogTitle:this.$t('workFlow.formInitiationProcessDialog.titleFormSet'),
      dialogVisible: false,
      selectSchemeList: [],
      editIndex: -1,
      tableKey: 1,
      scheme: { id: "", name: "", type: 0, url: "", schemeInfoData: {} },
      showSystemFormField: false, //iframe页面做完处理再显示
      systemChildrenData: [],
    };
  },
  computed: {
    isSpecialInitiationProcess() {
      return this.$store.state.bpmn.isSpecialInitiationProcess;
    }
  },
  mounted() {
    this.tableKey = Math.random();
  },
  methods: {
    openScheme(){
      if(this.formInfo.formInitiationProcess.type==-1){
        this.addScheme();
      }else{
        let temp = {
          F_Id:this.formInfo.formInitiationProcess.schemeId,
          F_Type:this.formInfo.formInitiationProcess.type,
          F_Name:this.formInfo.formInitiationProcess.schemeName,
          F_Url:this.formInfo.formInitiationProcess.schemeUrl,
          component:this.formInfo.formInitiationProcess.component
        };
        this.editScheme(0, temp);
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
      } catch (error) {
      }
    },
    async getFirstFormConfigurationKey() {
      let firstFormConfigurationKey = this.$store.state.bpmn
        .firstFormConfigurationKey;
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
          this.scheme.component = "";
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
      this.scheme.component = row.component?row.component:"";
      try {
        if (this.scheme.type == 0) {
          await this.customSheet();
          await this.getUserDefinedInfo();
        } else {
          await this.systemSheet();
          this.getSystemInfo();
        }
        this.dialogVisible = true;
      } catch (error) {
      }
    },
    delScheme(index) {
      this.$notify({
        title: this.$t('deletePrompt.promptTitle'),
        message:this.$t('deletePrompt.successDeleted'),
        type: "success"
      });
      this.tableData.splice(index, 1);
    },
    async customSheet() {
      this.selectSchemeList = [];
      let res = await getFormScheme(1);
      if (res.data.success) {
        if (res.data.data.length > 0) {
          this.selectSchemeList = res.data.data;
        }
      }
    },
    async systemSheet() {
      this.selectSchemeList = [];
      let res = await getSystemFormScheme(1);
      if (res.data.success) {
        if (res.data.data.length > 0) {
          this.selectSchemeList = res.data.data.map(ele => {
            ele.F_Id = ele.formId;
            ele.F_Name = ele.name;
            ele.F_Url = ele.url;
            ele.component=ele.component;
            return ele;
          });
        }
      }
    },
    submitSchemeDialog() {
      if (!this.scheme.id) {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('workFlow.formInitiationProcessDialog.hintSelectForm'),
          type: "warning"
        });
        return false;
      }
      this.formInfo.formInitiationProcess.type =this.scheme.type;
      this.formInfo.formInitiationProcess.schemeId = this.scheme.id;
      this.formInfo.formInitiationProcess.schemeName = this.scheme.name;
      this.formInfo.formInitiationProcess.schemeUrl = this.scheme.url;
      this.formInfo.formInitiationProcess.component = this.scheme.component;
      this.$notify({
        title:this.$t('deletePrompt.promptTitle'),
        message:this.$t('workFlow.formInitiationProcessDialog.hintAddSuccess'),
        type: "success"
      });
      this.closeDialog();
    },
     changeSystemChildrenData(data) {
      this.systemChildrenData = data;
      let info = this.getSystemFiled(data);
      this.$store.commit("SET_FIRST_FORM_CONFIGURATION_KEY", this.scheme.id);
      this.$store.commit("SET_FORM_CONFIGURATION_ITEM", {
        key: this.scheme.id,
        value: info
      });
      this.showSystemFormField = false;
    },
    async changeSchemeType() {
      this.showSystemFormField = false;
      this.systemChildrenData = [];
      this.scheme.url = "";
      this.scheme.schemeInfoData = {};
      try {
        if (this.scheme.type == 0) {
          this.scheme.id = "";
          this.scheme.name = "";
          this.scheme.type = 0;
          await this.customSheet();
        } else {
          this.scheme.id = "";
          this.scheme.name = "";
          this.scheme.type = 2;
          window.localStorage.setItem(
            "changeSystemChildrenData",
            JSON.stringify([])
          );
          await this.systemSheet();
        }
      } catch (error) {
      }
    },
    async changeScheme(value) {
      this.showSystemFormField = false;
      this.scheme.url = "";
      this.systemChildrenData = [];
      let result = this.selectSchemeList.filter(element => {
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
        this.$message(this.$t('workFlow.formInitiationProcessDialog.hintNoSelectForm'));
      } else {
        let formConfiguration = this.$store.state.bpmn.formConfiguration;
        if (formConfiguration.has(this.scheme.id)) {
          this.scheme.schemeInfoData = deepClone(
            formConfiguration.get(this.scheme.id).schemeInfoData
          );
        } else {
          let res = await getFormSchemeInfo(this.scheme.id);
          let info = {};
          let hideComponents = [];//隐藏组件
          if (
            res.data.success &&
            res.data.data.Scheme &&
            res.data.data.Scheme.F_Scheme
          ) {
            let schemeInfo = JSON.parse(res.data.data.Scheme.F_Scheme);
            if(schemeInfo.data&&schemeInfo.data.hideComponents){
              hideComponents = schemeInfo.data.hideComponents;
            }
            info = deepClone(this.getCustomFiled(schemeInfo));
          } else if (res.data.data == null) {
            this.scheme.id = "";
          }
          this.$store.commit(
            "SET_FIRST_FORM_CONFIGURATION_KEY",
            this.scheme.id
          );
          this.$store.commit("SET_FORM_CONFIGURATION_ITEM", {
            key: this.scheme.id,
            value: info
          });
        }
      }

    },
    getSystemInfo() {
      let formConfiguration = this.$store.state.bpmn.formConfiguration;
      if (formConfiguration.has(this.scheme.id)) {
        this.showSystemFormField = false;
      } else {
        setTimeout(()=>{
           this.showSystemFormField = true; //获取表单权限
        },1);
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
        type:this.$t('workFlow.formInitiationProcessDialog.typeSysForm'),
        children,
        schemeInfo: {}
      };
    },
    getCustomFiled(schemeInfo) {
      let children = [];

      let fields = schemeInfo.data.fields;
      if (fields.length > 0) {
        fields.forEach(element => {
          if (element.__config__.componentName) {
            //tab 数据配置不一致，特殊处理
            if (element.__config__.componentName == "avue-tabs") {
              if (element.__config__ && element.__config__.childrenObj) {
                let obj = element.__config__.childrenObj;
                for (var i in obj) {
                  if (obj[i].length > 0) {
                    obj[i].forEach(ele1 => {
                      if (ele1.__config__ && ele1.__config__.componentName == "table") {
                        let subchildren = [];
                        ele1.__config__.children.forEach(ele2=>{
                          let childTemp = this.getChildrenData(ele2);
                          subchildren.push(childTemp);
                       });
                        children.push({
                          bindTable: ele1.__config__.bindTable,
                          fieldsId: ele1.__config__.bindTableField,
                          fieldsName: ele1.__config__.componentTitle,
                          filedsType: ele1.__type__ ? ele1.__type__ : "",
                          formId: ele1.__config__.formId,
                          type: 'table',
                          required: true,
                          view: true,
                          edit: true,
                          disabled: false,
                          show:false,
                          children:subchildren
                        });
                      }else{
                      let temp = this.getChildrenData(ele1);
                      if (temp) {
                        children.push(temp);
                      }
                      }
                    });
                  }
                }
              }
            }else if(element.__config__.componentName == "table") {
              let subchildren = [];
              element.__config__.children.forEach(ele2=>{
                let childTemp = this.getChildrenData(ele2);
                subchildren.push(childTemp);
             });
             children.push({
                bindTable: element.__config__.bindTable,
                fieldsId: element.__config__.bindTableField,
                fieldsName: element.__config__.componentTitle,
                filedsType: element.__type__ ? element.__type__ : "",
                formId: element.__config__.formId,
                type: 'table',
                required: true,
                view: true,
                edit: true,
                disabled: false,
                show:false,
                children:subchildren
              });
            }
          } else {
            let temp = this.getChildrenData(element);
            if (temp) {
              children.push(temp);
            }
          }
        });
      }
      let requiredAll = false;
      let childrenLength = children.length;
      let childrenRequired = children.filter(ele => {
        return ele.required;
      });
      if (childrenRequired.length == childrenLength) {
        requiredAll = true;
      }
      this.scheme.schemeInfoData = schemeInfo.data;
      return {
        F_Id: this.scheme.id,
        F_Name: this.scheme.name,
        F_Type: this.scheme.type,
        requiredAll: requiredAll,
        viewAll: true,
        editAll: true,
        type:this.$t('workFlow.formInitiationProcessDialog.typeCusForm'),
        children,
        schemeInfoData: schemeInfo.data
      };
    },
    getChildrenData(element) {
      let temp = "";
      let required = false;
      let view = false;
      let edit = false;
      let disabled = false;
      let type = ""; //关联意见框组件使用
      if (element.__type__ && element.__type__ == "opinion") {
        //工作流相关意见簿 不显示
        type = element.__type__;
        required = false;
        view = true;
        edit = false;
        disabled = true;
      } else if (
        element.__config__ &&
        (element.__config__.tag == "h2" ||
          element.__config__.tag == "el-divider"||
      element.__config__.tag == "avue-information-body"||
      element.__config__.tag == "avue-custom-button")
      ) {
        //标题 分割线 不显示
        type = element.__config__.tag;
        required = false;
        view = true;
        edit = false;
        disabled = true;
      } else {
        disabled = false;
        if (element.__config__.bindTableField) {
          required = false;
          view = true;
          edit = true;
          if (element.__config__.required) {
            required = true;
            view = true;
            edit = true;
          }
        }
      }
      if (element.__config__ && element.__config__.componentName != "table") {
        temp = {
          bindTable: element.__config__.bindTable,
          fieldsId: element.__config__.bindTableField,
          fieldsName: element.__config__.label,
          filedsType: element.__type__ ? element.__type__ : "",
          formId: element.__config__.formId,
          type: type,
          required: required,
          view: view,
          edit: edit,
          disabled: disabled
        };
      }
      return temp;
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  }
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
