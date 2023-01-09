<template>
  <div class="tabs">
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')">
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeName')}}</label>
            <el-input v-model="formInfo.name"></el-input>
          </el-form-item>		  
		  <el-form-item>
		    <label>{{$t('curProgress')}}</label>
		    <el-input v-model="formInfo.currentProgress" 
		  			:max="99" type="number" :min="1"><template slot="append">%</template></el-input>
		  </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeDescr')}}</label>
            <el-input
              v-model="formInfo.documentation"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.End.noticeStrategy')}}</label>
            <el-checkbox-group v-model="formInfo.messageTypes">
              <el-checkbox :label="10">{{$t('workFlow.End.systemInfor')}}</el-checkbox>
              <el-checkbox :label="11">{{$t('workFlow.End.shortMessage')}}</el-checkbox>
              <el-checkbox :label="12">{{$t('workFlow.End.enterpriseWeChat')}}</el-checkbox>
              <el-checkbox :label="13">{{$t('workFlow.End.dingDing')}}</el-checkbox>
              <el-checkbox :label="14">{{$t('workFlow.End.mailbox')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('workFlow.callActivity.tabSubflow')" name="second">
          <el-form-item>
            <label>{{$t('workFlow.callActivity.calledElement')}}</label>
            <div class="callactivity-box"  @click="openDialog('LaunchList')">
              {{formInfo.callactivitycalledelement=={}?"请填写被调用元素":formInfo.callactivitycalledelement.F_Name}}
              <i slot="suffix" class="callactivity-icon el-icon-more"></i>
            </div>
          </el-form-item>
          <el-form-item>
            <label>{{$t('callType')}}</label><br>
            <el-radio v-model="formInfo.callType" :label="true">{{$t('singleInstance')}}</el-radio>
            <el-radio v-model="formInfo.callType" :label="false">{{$t('multipleInstances')}}</el-radio>
          </el-form-item>
          <template v-if="formInfo.callType">
            <el-form-item>
              <label><em class="form-required">*</em>{{$t('workFlow.Start.subprocess')}} : <em class="form-required">{{$t('workFlow.Start.hint')}}</em></label>
              <el-select
                v-model="formInfo.subProcessInitiator"
              >
                <el-option
                  v-for="(item, index) in subProcessInitiator"
                  :key="index"
                  :label="item.resourceName?item.resourceName:item.resourceType"
                  :value="item.resourceId"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item>
              <label>{{$t('workFlow.User.multiInstanceType')}}</label><br>
              <el-radio v-model="formInfo.multiinstance_type" label="Sequential">{{$t('workFlow.User.optionOrder')}}</el-radio>
              <el-radio v-model="formInfo.multiinstance_type" label="Parallel">{{$t('parallelExecution')}}</el-radio>
            </el-form-item>
            <el-form-item>
              <label><em class="form-required">*</em> {{$t('workFlow.User.completeCondition')}}</label>
              <el-select v-model="multiinstanceCondition" :placeholder="$t('pleaseSelectCompletionCriteria')">
                <el-option
                  v-for="(item, index) in condition"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="multiinstanceCondition === 'percent'">
              <label><em class="form-required">*</em> {{$t('workFlow.User.percent')}}</label>
              <el-input type="number" v-model="conditionPercent"></el-input>
            </el-form-item>
            <el-form-item>
              <label><em class="form-required">*</em> {{$t('initiatorConfigurationMode')}}</label>
              <el-select v-model="formInfo.optionType" :placeholder="$t('pleaseSelectTheInitiatorConfigurationMethod')">
                <el-option
                  v-for="(item, index) in optionType"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <label><em class="form-required">*</em> {{$t('initiatorConfiguration')}}</label>
              <template v-if="openType === 'formData'">
                <el-select v-model="formInfo.initiatorConfiguration.name"  ref="formDataSelect">
                  <el-option
                    :value="formInfo.initiatorConfiguration.id"
                    :label="formInfo.initiatorConfiguration.name"
                  >
                    <el-tree
                      ref="formTree"
                      :data="dataList"
                      :props="defaultProps"
                      :node-key="formInfo.initiatorConfiguration.fieldId"
                      default-expand-all
                      @node-click="changeFormData"
                    >
                    </el-tree>
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                <div class="callactivity-box"  @click="openDialog(openType)">
                  <template v-if="openType === 'SelectUser' && formInfo.initiatorConfiguration.length">
                    <el-tag v-for="tag in formInfo.initiatorConfiguration" :key="tag.F_UserId" closable effect="plain" @close="userTagClose(tag.F_UserId)">{{tag.F_RealName}}</el-tag>
                  </template>
                  <template v-else-if="openType === 'SqlConfig' && formInfo.initiatorConfiguration.sql">
                    <span>{{formInfo.initiatorConfiguration.text}}</span>
                  </template>
                  <template v-else-if="openType === 'ApiConfig' && formInfo.initiatorConfiguration.apiUrl">
                    {{formInfo.initiatorConfiguration.apiUrl}}
                  </template>
                  <template v-else>{{$t('pleaseClickToConfigure')}}</template>
                  <i slot="suffix" class="callactivity-icon el-icon-more"></i>
                </div>
              </template>
            </el-form-item>
          </template>
          <el-form-item>
            <div class="sub-tabs" v-if="showTabs">
              <el-tabs type="card">
                <el-tab-pane :label="$t('workFlow.callActivity.tabInputParameters')">
                  <div class="flex-box bt fw">
                    <span
                      class="flex-item opr el-icon-plus"
                      @click="addImportBox"
                    ></span>
                    <span class="flex-item">{{$t('workFlow.callActivity.variableSourceMain')}}</span>
                    <span class="flex-item">{{$t('workFlow.callActivity.targetVariableSub')}}</span>
                  </div>
                  <div
                    class="flex-box bt"
                    v-for="(item, index) in formInfo.callactivityinparameters
                      .inParameters"
                    :key="index"
                  >
                    <span class="flex-item opr" @click="delImportBox(index)"
                      >{{$t('tableOperationModule.deleteBtn')}}</span
                    >
                    <span class="flex-item">
                      <ParameterTree :key="showKey" v-model="item.source" :list="inputSourceList" mainLabelKey="label" mainValueKey="id"></ParameterTree>
                    </span>
                    <span class="flex-item">
                        <ParameterTree :key="showKey" v-model="item.target" :list="targetList" mainLabelKey="label" mainValueKey="id"></ParameterTree>
                    </span>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('workFlow.callActivity.tabOutputParameters')" v-if="formInfo.callType">
                  <div class="flex-box bt fw">
                    <span
                      class="flex-item opr el-icon-plus"
                      @click="addOutputBox"
                    ></span>
                    <span class="flex-item">{{$t('workFlow.callActivity.variableSourceSub')}}</span>
                    <span class="flex-item">{{$t('workFlow.callActivity.targetVariableMain')}}</span>
                  </div>
                  <div
                    class="flex-box bt"
                    v-for="(item, index) in formInfo.callactivityoutparameters.outParameters"
                    :key="index"
                  >
                    <span class="flex-item opr" @click="delOutputBox(index)"
                      >{{$t('tableOperationModule.deleteBtn')}}</span
                    >
                    <span class="flex-item">
                      <ParameterTree :key="showKey" v-model="item.source" :list="targetList" mainLabelKey="label" mainValueKey="id"></ParameterTree>
                    </span>
                    <span class="flex-item">
                      <ParameterTree :key="showKey" v-model="item.target" :list="sourceList" mainLabelKey="label" mainValueKey="id"></ParameterTree>
                    </span>
                  </div>
                </el-tab-pane>
              </el-tabs>
              
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>      
    </el-form>
    <el-dialog v-dialogDrag
      :title="titleList[dialogType]"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
    >
      <component
        :is="componentName"
        v-if="dialogVisible"
        style="height: 100%;"
        :selectedList="this[`${this.dialogType}List`]"
        :ruleTreelist="assignmentFormParameters"
        :sqlConfig="sqlConfigData"
        :apiConfig="apiConfigData"
        :ref="dialogType"
        :isSingle="dialogType === 'LaunchList'"
        :showLeftTree="true"
        :showSearch="true"
        :tipTxt="tipTxt"
      />
      <!-- <LaunchList
        ref="SelectFlow"
        v-if="dialogVisible"
        style="height: 100%;"
        :selectList="selectList"
        :isSingle="true"
        :showLeftTree="true"
        :showSearch="true"
      >
      </LaunchList> -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button size="small" type="primary" @click="submitDialog">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinNode from "./../mixin/mixinNode";
import LaunchList from "@/components/workflow/LaunchList";
import { getInfoPropertiesMap,getChildShapes } from "./../common/util/properties";
import { NodeName } from "./../lang/zh";
import { getInfo } from "@/api/bpmn";
import { objToStrMap } from "./../common/util/util";
import { getSubProcessInitiator,changeVariableSourceList } from "./../common/util/variable";
import ParameterTree from "./property/ParameterTree.vue";
import { getProcessParametersData } from "./../common/util/properties";
import SelectUser from "@/components/organization/SelectUser";
import SqlConfig from "./property/components/SqlConfig";
import ApiConfig from "./property/components/ApiConfig";
import { scriptSqlTasksTree,scriptSqlTasksHasId } from "./../data/rules";
import {
  getProcessProperties
} from "../common/util/properties";

export default {
  mixins: [mixinNode],
  components: {
    LaunchList,
    ParameterTree,
    SelectUser,
    SqlConfig,
    ApiConfig
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      dialogVisible: false,
      dialogType: '',
      componentName: '',
      assignmentFormParameters: [],
      sqlConfigData: {},
      apiConfigData: {},
      LaunchListList: [],
      SelectUserList: [],
      SqlConfigList: [],
      ApiConfigList: [],
      dataList:[],
      outputBox: [],
      sourceList: [],
      inputSourceList:[],
      targetList: [],
      variableMap:new Map(),
      subProcessInitiator: [],
      multiinstanceCondition:'',
      conditionPercent: '',
      showKey:1,
      showTabs: true,
      sqlRuleMaplist: new Map(),
      condition: [{
        value: 'all',
        label: this.$t('workFlow.User.optionAll')
      }, {
        value: 'single',
        label: this.$t('workFlow.User.optionSingle')
      }, {
        value: 'percent',
        label: this.$t('workFlow.User.optionPercent')
      }],
      optionType: [{
        value: 'user',
        label: this.$t('personnelSelection')
      }, {
        value: 'SQL',
        label: this.$t('workFlow.selectSql.sqlStatement')
      }, {
        value: 'API',
        label: 'API'
      }, {
        value: 'formData',
        label: this.$t('formData')
      }],
      titleList: {
        'LaunchList': this.$t('workFlow.callActivity.titleSelectTemplate'),
        'SelectUser': this.$t('selectUser.selectPersonnel'),
        'SqlConfig': this.$t('useSqlStatementToAssignSub-processInitiator'),
        'ApiConfig':this.$t('useApiAssignCharacterTypeParameters')
      },
      sqlTipTxt: this.$t('afterSelectingBindingFieldTheFirstColumnOfDataInCorrespondingFieldOfQueryResultWillReturnedAsVariableData'),
      apiTipTxt:this.$t('remarksTheDataReturnedByTheInterfaceParametersMustBeArrayType')
    };
  },
  watch: {
  	"formInfo.currentProgress": function(val) {
      if (val>=100) {
        this.formInfo.currentProgress = 99;
      }else if (val<1) {
        this.formInfo.currentProgress = '';
      }else{
      	this.formInfo.currentProgress=parseInt(val)
      }
    },
    "formInfo.initiatorConfiguration": function (val) {
      this[`${this.openType}List`] = val
    },
    "formInfo.multiinstance_condition": function (val) {
      if (val) {
        const list = val.split(',')
        this.multiinstanceCondition = list[0]
        if (list.length > 1) {
          this.conditionPercent = list[1]
        }
      }
    },
    conditionPercent: function (val) {
      let percent = ''
      if (val) {
        percent = val
        this.formInfo.multiinstance_condition = `${this.multiinstanceCondition},${percent}`
      }
    },
    multiinstanceCondition: function (val) {
      if (val !== 'percent') {
        this.formInfo.multiinstance_condition = val
      }
    },
    "formInfo.callType": function (val) {
      let multiinstance_collection = val ? '' : "${usernamelist}"
      let multiinstance_variable = val ? '': "username"
      this.formInfo.multiinstance_collection = multiinstance_collection   //为多实例时加这个，值固定为${usernamelist}
      this.formInfo.multiinstance_variable = multiinstance_variable //为多实例时加这个，值固定为username
    }
  },
  computed: {
    openType() {
      switch (this.formInfo.optionType) {
        case 'user':
          return 'SelectUser'
        case 'SQL':
          return 'SqlConfig'
        case 'API':
          return 'ApiConfig'
        case 'formData':
          return 'formData'
        default:
          return ''
      }
    },
    selectedList() {
      return this[`${this.dialogType}List`]
    },
    tipTxt() {
      switch (this.dialogType) {
        case 'SqlConfig':
          return this.sqlTipTxt
        case 'ApiConfig':
          return this.apiTipTxt
        default:
          return ''
      }
    }
  },
  mounted() {
    this.subProcessInitiator = getSubProcessInitiator();
    this.initData();
  },
  methods: {
    async initData() {
      this.changeVariableSourceList();
      if(this.formInfo
      &&this.formInfo.callactivitycalledelement
      &&this.formInfo.callactivitycalledelement.F_ModelId){
        let modulesId = this.formInfo.callactivitycalledelement.F_ModelId;
         await this.changeVariableTargetList(modulesId);
          this.showKey++;
      }
    },
    changeVariableSourceList() {
      let info = getInfoPropertiesMap();

      let list = this.getVariableeList(info);
      //增加流程参数
      let variableRulesList = getProcessParametersData();
      this.sourceList = [...variableRulesList,...list];
      let list2 = this.getVariableeList(info, true);
      this.inputSourceList = [...variableRulesList, ...list2];
      let list3 = this.getVariableeList(info, true,true);
      this.dataList = [...variableRulesList, ...list3];

      let scriptSqlTasksList = [
        ...scriptSqlTasksHasId,
        ...variableRulesList,
      ];
      let mapList = new Map();
      scriptSqlTasksList.forEach((ele, index) => {
        if (ele.children && ele.children.length > 0) {
            ele.children.forEach((item, itemIndex) => {
              let key = ele.label + "." + item.label;
              mapList.set(key, item);
              scriptSqlTasksList[index].children[itemIndex].markKey = key;
            });
        }
      });
      this.sqlRuleMaplist = mapList;
      this.assignmentFormParameters = scriptSqlTasksList
    },
    async changeVariableTargetList(modulesId){
      let res = await getInfo(modulesId);
        if(res.data.success){
          let info = this.redrawProperties(res.data.data.json);
           let list = this.getVariableeList(info);
           //增加流程参数
           let  parameters = [];
           let json = JSON.parse(res.data.data.json);
           if(json&&
            json.properties&&
            json.properties.parameters){
             parameters = json.properties.parameters
           }
           let variableList = this.getTargetParametersData(parameters);
          this.targetList = [...variableList, ...list];;
        }else{
          this.targetList = [];          
        }
    },
    getTargetParametersData(parameters){
      let children = [];
      if (
        parameters &&
        parameters.length > 0
      ) {
        parameters.forEach(ele=>{
          children.push({...ele,value:ele.id,label:ele.name,type: "parameter",drag:true});
        });
      }
      if(children.length>0){
        return [{
        id:'1',
        value:'1',
        name:"流程参数",
        label:"流程参数",
        type: "parameter",
        disabled:true,
        children
      }];
      }else{
        return [];
      }
      
    },
    redrawProperties(json) {
      let { childShapes } = JSON.parse(json);
      let ObjMapJson = {};
      childShapes.forEach((element) => {
        ObjMapJson[element.resourceId] = element.properties;
        let subChildShapes = element.childShapes;
        if (subChildShapes && subChildShapes.length > 0) {
          subChildShapes.forEach((element2) => {
            ObjMapJson[element2.resourceId] = element2.properties;
          });
        }
      });
      return objToStrMap(ObjMapJson);
    },
    getVariableeList(info,needHideComponents=false,isFormData=false) {
      let list = [];
      for (let element of info.values()) {
        let type = element.type;
        let label = NodeName[element.type];
        let name = element.name ? "-" + element.name : "";
        let resourceName = label + name;
        if (type == "bpmn:StartEvent") {
          let id = element.id;
          let tableData = element.tableData;
          let tempJson = {
            value:id,
            id: id,
            label: resourceName,
            type: "resource",
            children: [],
            disabled: true,
          };
          tempJson.children = this.getFormSourceChildren(
            id,
            resourceName,
            tableData,
            needHideComponents,
            isFormData
          );

          list.push(tempJson);
        }
        // if (type == "bpmn:CallActivity") {
        //   let id = element.id;
        //   let tempJson = {
        //     value:id,
        //     id: id,
        //     label: resourceName,
        //     type: "resource",
        //     children: [],
        //      disabled: true,
        //   };
        //  list.push(tempJson);
        // }
        if (type == "bpmn:UserTask") {
          let id = element.id;
          let tempJson = {
            value:id,
            id: id,
            label: resourceName,
            type: "resource",
            children: [],
             disabled: true,
          };
          let children1 = this.getButtonSourceChildren(
            id,
            resourceName,
          );
          let tableData = element.tableData;
          let children2 = this.getFormSourceChildren(
            id,
            resourceName,
            tableData,
            needHideComponents,
            isFormData
          );
          if (isFormData) {
            tempJson.children = [ ...children2];
          } else {
            tempJson.children = [...children1, ...children2];
          }
          list.push(tempJson);
        }
      }
      return list;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openDialog(type) {
      if (type) {
        this.dialogType = type
        this.getComponent()
        this.dialogVisible = true;
      }
    },
    getComponent() {
      switch (this.dialogType) {
        case 'SqlConfig':
          this.formInfo.initiatorConfiguration.database = this.formInfo.initiatorConfiguration.F_ObjId
          this.sqlConfigData = this.formInfo.initiatorConfiguration
          break;
        case 'ApiConfig':
          this.apiConfigData = this.formInfo.initiatorConfiguration
          break;
        default:
          break;
      }
      this.componentName = this.dialogType
    },
    submitDialog() {
      this.showTabs = false;
      if (this.dialogType === 'LaunchList') {
        this.submitLaunchList()
      } else if (this.dialogType === 'SqlConfig') {
        this.submitSqlConfig()
      } else if (this.dialogType === 'ApiConfig') {
        this.submitApiConfig()
      } else {
          this[`${this.dialogType}List`] = this.$refs[this.dialogType].pushParentData()
          this.formInfo.initiatorConfiguration = this.selectedList
          this.closeDialog()
      }
      setTimeout(()=>{
        this.showTabs = true;
      },1);
    },
    async submitLaunchList() {
      this.LaunchListList = this.$refs.LaunchList.getCheckedList();
      let F_SchemeInfoId = '';
      let processProperties = getProcessProperties();
      // 编辑流程，外部流程不可以调用自身
      if(processProperties&&processProperties.F_ModelId){
        F_SchemeInfoId = processProperties.F_ModelId;
      }
      if(F_SchemeInfoId&&this.LaunchListList.length>0){
        let hasMyselfList =  this.LaunchListList.filter(ele=>{
          return ele.F_ModelId===F_SchemeInfoId
        });
        if(hasMyselfList.length>0){
          this.$message('外部流程不可以调用自身');
          return;
        }
      }
      
      this.formInfo.callactivitycalledelement = this.LaunchListList.length>0?this.LaunchListList[0]:{};
      if(this.formInfo
      && this.formInfo.callactivitycalledelement
      && this.formInfo.callactivitycalledelement.F_ModelId){
        let modulesId = this.formInfo.callactivitycalledelement.F_ModelId;
          await this.changeVariableTargetList(modulesId);
      }
      this.closeDialog();
    },
    submitSqlConfig() {
      let form = this.$refs.SqlConfig.getForm();
      if (form && form.database && form.field && form.sql) {
        this.formInfo.initiatorConfiguration = {}
        let arr = form.sql.split("``");
        let finalSql = "";
        let templateData = [];
        arr.forEach((ele, index) => {
          let beforeText = "";
          if (index % 2) {
            beforeText = arr[index - 1];
            let val = this.sqlRuleMaplist.get(ele);
            finalSql += beforeText + " " + ele + " ";
            if (val) {
              templateData.push({ beforeText, ...val, afterText: "" });
            }
          }
        });
        if (arr[arr.length - 1]) {
          let text = arr[arr.length - 1];
          finalSql += " " + text + " "; //最后一个字符串切割的
          templateData.push({
            beforeText: text,
            afterText: "",
            name: "",
            id: "",
            type: "text"
          });
        }
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Process.addSuccess"),
          type: "success"
        });
        finalSql = finalSql.replace(/\n/g, " ");
        this.formInfo.initiatorConfiguration.F_ObjId = form.database
        this.formInfo.initiatorConfiguration.text = finalSql;
        this.formInfo.initiatorConfiguration.templateData = templateData;
        this.formInfo.initiatorConfiguration.sql = form.sql;
        this.formInfo.initiatorConfiguration.field = form.field
        
        this.closeDialog()
      } else {
        if (!form.database || form.database == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('noDatabaseSelect'),
            type: "warning"
          });
        } else if (!form.sql || form.sql == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('noSqlFill'),
            type: "warning"
          });
        } else if (!form.field || form.field == "") {
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message:this.$t('noDataFieldSelect'),
            type: "warning"
          });
        }
      }
    },
    submitApiConfig() {
      let config = this.$refs.ApiConfig.getConfig();
      if (config && config.apiUrl) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Process.addSuccess"),
          type: "success"
        });
        this.formInfo.initiatorConfiguration = config
        this.closeDialog()
      }
    },
    changeFormData(value) {
      let type = value.type;
      let name = ''
      if (value.formId) {
        if (value.parentName) {
          name = `${value.resourceName},${value.formName},${value.parentName}-${value.formId},${value.label}`
        } else {
          name = `${value.resourceName},${value.formName},${value.label}`
        }
      } else {
        name = `${value.resourceName},${value.formName},${value.label}`
      }
      if (!value.children) {
        this.variableSourceType = type;
        if (type == "button") {
          this.formInfo.initiatorConfiguration = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            name:value.resourceName + "-" + value.label
          };
        } else if (type == "condition") {
          this.formInfo.initiatorConfiguration = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            formId: value.formId,
            formName: value.formName,
            fieldId: value.fieldsId,
            fieldName: value.label,
            bindTable: value.bindTable,
            name
          };
        } else if (type == "hideComponents") {
          console.log(999)
          this.formInfo.initiatorConfiguration = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            formId: value.formId,
            formName: value.formName,
            fieldId: value.fieldsId,
            fieldName: value.label,
            bindTable: value.bindTable,
            name,
            hideComponentsType: value.hideComponentsType,
            hideComponentsvalue: value.hideComponentsvalue,
            sqlConfig: value.sqlConfig,
            apiConfig: value.apiConfig,
          };
        } else {
          this.formInfo.initiatorConfiguration = value
        }
        this.$refs.formDataSelect.handleClose()
      }
    },
    addImportBox() {
      let index = this.formInfo.callactivityinparameters.inParameters.length;
      this.formInfo.callactivityinparameters.inParameters.push({
        index,
        source: {
          id:"",
          resourceId:'',
          resourceName:''
        },
        target:{
          id:"",
          resourceId:'',
          resourceName:''
        },
        sourceExpression: "=",
      });
    },
    delImportBox(index) {
      if (
        this.formInfo.callactivityinparameters.inParameters &&
        this.formInfo.callactivityinparameters.inParameters.length > 0
      ) {
        this.formInfo.callactivityinparameters.inParameters.splice(index, 1);
         this.showKey++;
      }
    },
    addOutputBox() {
       let index = this.formInfo.callactivityoutparameters.outParameters.length;
      this.formInfo.callactivityoutparameters.outParameters.push({
         index,
        source: {
          id:"",
          resourceId:'',
          resourceName:''
        },
        target:{
          id:"",
          resourceId:'',
          resourceName:''
        },
        sourceExpression: "=",
      });
    },
    delOutputBox(index) {
      if (this.formInfo.callactivityoutparameters.outParameters && this.formInfo.callactivityoutparameters.outParameters.length > 0) {
        this.formInfo.callactivityoutparameters.outParameters.splice(index, 1);
        this.showKey++;
      }
    },
    getFormSourceChildren(resourceId, resourceName, tableData,needHideComponents=false,isFormData) {
      let children = [];
      tableData.forEach((ele1) => {
        let formName = ele1.F_Name;
        let formId = ele1.F_Id;
        let subJson = {
          value:resourceId+ele1.F_Id,
          id: ele1.F_Id,
          label: formName,
          type: "form",
          children: [],
          disabled: true,
        };
        if (ele1.children&&ele1.children.length > 0) {
          ele1.children.forEach((ele2) => {
            if (isFormData && ele2.children && ele2.children.length>0) {
              let temp={
                value:resourceId+ele1.F_Id+ele2.fieldsId,
                id: resourceId+ele1.F_Id+ele2.fieldsId,
                label: ele2.fieldsName + '-' +ele2.formId,
                bindTable:ele2.bindTable,
                fieldsId:ele2.fieldsId,
                resourceId,
                resourceName,
                formName,
                formId,
                type: "form",
                disabled: false,
                children:[]
              };
              ele2.children.forEach(ele3 => {
                let temp2={
                    value:resourceId+ele1.F_Id+ele2.fieldsId+ele3.fieldsId,
                    id: resourceId+ele1.F_Id+ele2.fieldsId+ele3.fieldsId,
                    label: ele3.fieldsName,
                    bindTable:ele3.bindTable,
                    fieldsId:ele3.fieldsId,
                    resourceId,
                    resourceName,
                    formName,
                   formId: ele2.formId,
                    parentName:ele2.fieldsName,
                    type: "condition",
                    disabled: false,
                  };
                temp.children.push(temp2)
              })
              subJson.children.push(temp);
              this.variableMap.set(temp.value, temp);              
            } else {
              if (ele2.fieldsId) {
                let temp={
                  value:resourceId+ele1.F_Id+ele2.fieldsId,
                  id: resourceId+ele1.F_Id+ele2.fieldsId,
                  label: ele2.fieldsName,
                  bindTable:ele2.bindTable,
                  fieldsId:ele2.fieldsId,
                  resourceId,
                  resourceName,
                  formName,
                  formId,
                  type: "condition",
                  disabled: false,
                };

                subJson.children.push(temp);
                this.variableMap.set(temp.value,temp);
              }
            }

          });
        }
                // 隐藏组件
            let hideComponentsJsonChildren = [];
            if(needHideComponents&&ele1.hideComponents){
              if (ele1.hideComponents.length > 0) {
                ele1.hideComponents.forEach(ele2 => {
                  let markId = resourceId + ele1.F_Id + ele2.id;
                  hideComponentsJsonChildren.push({
                      drag: true,
                      markKey: resourceName+"-"+formName+"-" +'隐藏组件-'+ele2.name,
                      value:markId,
                      id: markId,
                      label: ele2.name,
                      bindTable:"",
                      F_ObjId: ele2.id,
                      F_ObjName:
                        resourceName + "•" + formName + "•" + ele2.name,
                      fieldId: ele2.id,
                      fieldName: ele2.name,
                      resourceId,
                      resourceName,
                      formName,
                      formId,
                      hideComponentsType:ele2.type,
                      hideComponentsvalue:ele2.value,
                      sqlConfig:ele2.sqlConfig,
                      apiConfig:ele2.apiConfig,
                      type: "hideComponents"
                    });
                });
              }
            }
            if(hideComponentsJsonChildren.length>0){
              let hideComponentsJson = {
                id: resourceId + formId + 'hideComponents',
                label: '隐藏组件',
                type: "form",
                children: hideComponentsJsonChildren
              };
              subJson.children.push(hideComponentsJson);
            }
            
        children.push(subJson);
      });
      return children;
    },
    getButtonSourceChildren(resourceId, resourceName) {
      let children = [];
      let temp = {
        value:resourceId+'button',
        id: resourceId,
        label: "按钮组",
        type: "button",
        resourceId,
        resourceName,
         disabled: false,
      };
      children.push(temp);
      this.variableMap.set(temp.value,temp);
      return children;
    },
    userTagClose(userId) {
      this.formInfo.initiatorConfiguration = this.formInfo.initiatorConfiguration.filter(item => {
        return item.F_UserId !== userId
      })
    }
  },
};
</script>

<style lang="css" scoped>
.callactivity-box{
  position: relative;
  border: 1px solid #d6d6d6;
  height: 30px;
  padding-left: 10px;
  overflow: auto;
}
.callactivity-icon{
  position:absolute;
  right: 5px;
  line-height: 30px;
}
.tabs /deep/ .el-checkbox:last-of-type {
  /* width: 100%; */
}
.tabs /deep/ .el-checkbox__label {
  font-size: 12px;
}
.tabs .sub-tabs /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  font-size: 12px;
}
.tabs .sub-tabs {
  margin-top: 20px;
}
.tabs .sub-tabs /deep/ .el-tabs__content {
  border: none;
  /* padding: 0; */
}
.flex-box {
  display: flex;
}
.flex-box .flex-item {
  flex-basis: 30%;
  line-height: 40px;
  height: 40px;
  margin-left: 1%;
  margin-right: 1%;
}
.bt {
  border-bottom: 1px solid #e4e4e4;
}
.fw {
  font-weight: 700;
}
.opr {
  color: #02a7f0;
  cursor: pointer;
}
.form-required{
  font-style: normal;
  color: red;
}
.el-tag{
  margin-right: 5px;
}
</style>
