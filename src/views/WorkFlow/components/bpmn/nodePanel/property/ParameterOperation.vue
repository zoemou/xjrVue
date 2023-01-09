<template>
  <el-tabs>
    <el-tab-pane :label="$t('formAssignment')"  v-if="formPage!='script'">
      <el-button size="mini" type="primary" plain class="submit-form" @click="submitFormAssignmentForm">{{$t('submit')}}</el-button>
      <span class="red">{{$t('hintFormAss')}}</span>
      <div class="flex-box bt fw">
        <span
          class="flex-item opr el-icon-plus"
          @click="addFormAssignment()"
        ></span>
        <span class="flex-item">{{$t('assignmentSource')}}</span>
        <span class="flex-item">{{$t('targetFormField')}}</span>
      </div>
      <template v-if="formAssignment.length > 0&&showFormAssignment">
        <div
          class="bt"
          v-for="(item, index) in formAssignment"
          :key="index"
        >
          <div class="flex-box bt">
            <span class="flex-item opr" @click="delFormAssignment(index)"
              >{{$t('tableOperationModule.deleteBtn')}}</span
            >
            <span class="flex-item">
                <ParameterTree v-model="item.source" :list="commonParameters" mainLabelKey="name" mainValueKey="id"></ParameterTree>
               
            </span>
            <span class="flex-item">
               <ParameterTree v-model="item.target" :list="formParameters"></ParameterTree>
            </span>
          </div>
        </div>
      </template>
      <div v-else class="empty-box">
        {{$t('formAssEmpty')}}
      </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('parameterAss')">
      <el-button size="mini" type="primary" plain class="submit-form" @click="submitParameterAssignment">{{$t('submit')}}</el-button>
      <span class="red">{{$t('parameterAssignmentAssDataVariableNodeFlowAccordCategory')}}</span>
      <div class="flex-box bt fw">
        <span
          class="flex-item opr el-icon-plus"
          @click="addParameterAssignment()"
        ></span>
        <span class="flex-item">{{$t('assignmentCategory')}}</span>
        <span class="flex-item">{{$t('assignmentConfig')}}</span>
        <span class="flex-item">{{$t('targetParameterVariable')}}</span>
      </div>
      <template v-if="parameterAssignment.length > 0&&showParameterAssignment">
        <div
          class="bt"
          v-for="(item, index) in parameterAssignment"
          :key="index"
        >
          <div class="flex-box bt">
            <span class="flex-item opr" @click="delParameterAssignment(index)"
              >{{$t('tableOperationModule.deleteBtn')}}</span
            >
             <span class="flex-item">
              <el-select v-model="item.source.assignmentType">
                <el-option :label="$t('workFlow.zh.value')" value="value"></el-option>
                <el-option :label="$t('workFlow.zh.variable')" value="variable"></el-option>
                <el-option :label="$t('quoteSql')" value="sql"></el-option>
                <el-option :label="$t('quoteApi')" value="api"></el-option>
              </el-select>
            </span>
            <span class="flex-item">
              <el-input
                v-if="item.source.assignmentType == 'value'"
                v-model="item.source.value"
              ></el-input>
                <ParameterTree  v-else-if="item.source.assignmentType == 'variable'" v-model="item.source" :list="assignmentFormParameters"></ParameterTree>
                <el-input
                  v-else
                  v-model="item.source.showValue"
                  :placeholder="$t('setParameterValue')"
                  suffix-icon="el-icon-more"
                  @focus="openParameterDialog(index)"
                ></el-input>
            </span>
            <span class="flex-item">
              <ParameterTree v-model="item.target" :list="commonParameters" mainLabelKey="name" mainValueKey="id"></ParameterTree>
            </span>
          </div>
        </div>
          <el-dialog
            v-dialogDrag
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="60%"
            append-to-body
            :close-on-click-modal="false"
            @closed="closeDialog"
            class="param-dialog-box"
          >
            <SqlConfig
              v-if="dialogVisible && dialogType == 'SqlConfig'"
              ref="SqlConfig"
              :sqlConfig="sqlConfig"
              :ruleTreelist="assignmentFormParameters"
            >
            </SqlConfig>
            <ApiConfig
              v-if="dialogVisible && dialogType == 'ApiConfig'"
              ref="ApiConfig"
              :apiConfig="apiConfig"
            >
            </ApiConfig>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeDialog" size="mini">{{
                $t("buttonModule.modalCancelBtn")
              }}</el-button>
              <el-button type="primary" @click="submitDialog" size="mini">{{
                $t("buttonModule.modalSureBtn")
              }}</el-button>
            </span>
          </el-dialog>
      </template>
      <div v-else class="empty-box">
        {{$t('parameterAssEmpty')}}
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ParameterTree from "./ParameterTree.vue";
import { getCommonParametersData } from "./../../common/util/properties";
import { deepClone } from '@/util/util';
import SqlConfig from "./components/SqlConfig";
import ApiConfig from "./components/ApiConfig";
import { scriptSqlTasksTree } from "./../../data/rules";
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formPage:{
      type:String,
      default:()=>{
        return ''
      }
    }
  },
  components: {
    ParameterTree,
    SqlConfig,
    ApiConfig
  },
  data() {
    return {
      commonParameters: [],
      formParameters: [],
      assignmentFormParameters:[],
      showFormAssignment:true,
      showParameterAssignment:true,
      formAssignment:[],
      parameterAssignment:[],
      dialogVisible:false,
      dialogType:'',
      variableRulesList: [],
      parameterIndex: -1,
      sqlConfig: {},
      apiConfig: {},
      sqlRuleMaplist:new Map()
    };
  },
  created() {
    if(this.formInfo.paramOperate.formAssignment&&this.formInfo.paramOperate.formAssignment.length>0){
      this.formAssignment = deepClone(this.formInfo.paramOperate.formAssignment);
    }	
    if(this.formInfo.paramOperate.parameterAssignment&&this.formInfo.paramOperate.parameterAssignment.length>0){
      this.parameterAssignment = deepClone(this.formInfo.paramOperate.parameterAssignment).map(ele=>{
       
        if(ele.source){
           ele.source.assignmentType = ele.source.assignmentType?ele.source.assignmentType:'variable';
            ele.source.showValue = ele.source.showValue? ele.source.showValue:"";
            ele.source.value =  ele.source.value? ele.source.value:"";
            ele.source.taskapi =  ele.source.taskapi? ele.source.taskapi:null;
            ele.source.tasksql =  ele.source.tasksql? ele.source.tasksql:null;
        }
        return ele;
      });
    }
    this.commonParameters = getCommonParametersData();
    
    this.formParameters = this.getFormTableData(false);
    this.assignmentFormParameters = [...scriptSqlTasksTree,...this.getFormTableData(true)];		
	this.commonParameters.forEach(el=>{   //如果流程参数名称被修改，参数操作也要相应修改
		if(el.children?.length){
			el.children.forEach(it=>{
				let obj=deepClone(it);
				obj.label=it.name;
				let idx=this.formAssignment.findIndex(o=>{return o.source.id==it.id});
				let idxTwo=this.parameterAssignment.findIndex(o=>{return o.target.id==it.id});
				if(idx>=0) this.formAssignment[idx].source=obj;
				if(idxTwo>=0) this.parameterAssignment[idxTwo].target=obj;
			})
		}
	})

  let mapList = new Map();
    this.assignmentFormParameters.forEach((ele, index) => {
      if (ele.children && ele.children.length > 0) {
        if (ele.type == "resource") {
          //表单
          ele.children.forEach((item, itemIndex) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((child, childIndex) => {
                let { children, drag, variableValueList, ...value } = {
                  ...ele,
                  ...item,
                  ...child
                };
                let key =
                  ele.label +
                  "." +
                  item.label +
                  "." +
                  child.label +
                  "." +
                  index +
                  "-" +
                  itemIndex +
                  "-" +
                  childIndex;
                mapList.set(key, value);
                this.assignmentFormParameters[index].children[itemIndex].children[
                  childIndex
                ].markKey = key;
                if(child&&child.children&&child.children.length>0){
                  child.children.forEach((c2,i2) => {
                    let key =
                        ele.label +
                        "." +
                        item.label +
                        "." +
                        child.label +
                        "." +
                        index +
                        "-" +
                        itemIndex +
                        "-" +
                        childIndex+
                        "-" +
                        i2;
                        mapList.set(key, c2);
                        this.assignmentFormParameters[index].children[itemIndex].children[
                          childIndex
                        ].children[i2].markKey = key;
                    });
                    
                }
              });
              
            }
          });
        } else {
          ele.children.forEach((item, itemIndex) => {
            let key = ele.label + "." + item.label;
            mapList.set(key, item);
            this.assignmentFormParameters[index].children[itemIndex].markKey = key;
          });
        }
      }
    });
    this.sqlRuleMaplist = mapList;

  },
  methods: {
    openDialog(type) {
      this.dialogType = type;
      switch (type) {
        case "SqlConfig":
          this.dialogTitle = this.$t('addFlowParaParaValueSql');
          break;
        case "ApiConfig":
          this.dialogTitle = this.$t('apiConfig');
          break;
        default:
          break;
      }
      this.dialogVisible = true;
    },
     closeDialog() {
      this.dialogVisible = false;
      this.parameterIndex = -1;
    },
    submitDialog() {
      if (this.dialogType == "SqlConfig") {
        this.submitSqlConfig();
      } else if (this.dialogType == "ApiConfig") {
        this.submitApiConfig();
      }
    },
    submitSqlConfig() {
      let form = this.$refs.SqlConfig.getForm();
      if (form && form.database && form.field && form.sql) {
        this.$notify({
          title: this.$t("deletePrompt.promptTitle"),
          message: this.$t("workFlow.Process.addSuccess"),
          type: "success"
        });
      let tasksqlText = form.sql;
        let arr = tasksqlText.split("``");
      let finalSql = "";
        let templateData = [];
      arr.forEach((ele, index) => {
        let beforeText = "";
        if (index % 2) {
          beforeText = arr[index - 1];
          let val = this.sqlRuleMaplist.get(ele);
          finalSql += beforeText + " " + ele + " ";
          if (val || beforeText) {
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
        finalSql = finalSql.replace(/\n/g, " ");
        form.finalSql = finalSql;
        form.templateData = templateData;
        this.parameterAssignment[this.parameterIndex].source.showValue = tasksqlText;
        this.parameterAssignment[this.parameterIndex].source.tasksql = form;

        this.dialogVisible = false;
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
			this.parameterAssignment[this.parameterIndex].source.showValue = config.apiUrl;
			this.parameterAssignment[this.parameterIndex].source.taskapi = config;
			this.dialogVisible = false;         
      }
    },
    openParameterDialog(index) {
      this.parameterIndex = index;
      let type = this.parameterAssignment[index].source.assignmentType;
      if (type === "sql") {
        this.sqlConfig = {};
        if (this.parameterAssignment[index].source.tasksql) {
          this.sqlConfig = deepClone(this.parameterAssignment[index].source.tasksql);
        }
        this.openDialog("SqlConfig");
      } else if (type === "api") {
        this.apiConfig = {};
        if (this.parameterAssignment[index].source.taskapi) {
          this.apiConfig =deepClone(this.parameterAssignment[index].source.taskapi);
        }
        this.openDialog("ApiConfig");
      }
    },
    getFormTableData(needHideComponents=false){
        let children = [];
       if(this.formInfo.tableData&&this.formInfo.tableData.length>0){
           let resourceId =  this.formInfo.id;
           let resourceName = this.formInfo.name;
          this.formInfo.tableData.forEach((ele1) => {
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
                if (ele2.children){
                  // 表单里面的子表组件隐藏不可选
                }else{
                  if (ele2.fieldsId) {
                  let temp={
                    value:resourceId+ele1.F_Id+ele2.fieldsId,
                    id: ele2.fieldsId,
                    label: ele2.fieldsName,
                    bindTable:ele2.bindTable,
                    fieldsId:ele2.fieldsId,
                    resourceId,
                    resourceName,
                    formName,
                    formId,
                    type: "condition",
                    drag:true,
                    markKey: formName+"."+ele2.fieldsName,
                    disabled: false,
                  };
                  subJson.children.push(temp);
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
       }
     return children;
    },
    addFormAssignment() {
      let defaultJson = {
        source: {},
        target: {}
      };
      this.formAssignment.push(defaultJson);
    },
    delFormAssignment(index) {
      if (this.formAssignment.length > 0) {
        this.showFormAssignment = false;
        this.formAssignment.splice(index, 1);
        this.$nextTick(()=>{
          this.showFormAssignment = true;
        });
      }
    },
    addParameterAssignment() {
      this.showParameterAssignment = false;
      let defaultJson = {
        source: {
          showValue:'',
          value:'',
          taskapi:null,
          tasksql:null,
          assignmentType:'variable'
        },
        target: {}
      };
      this.parameterAssignment.push(defaultJson);
        this.$nextTick(()=>{
          this.showParameterAssignment = true;
        });
      
    },
    delParameterAssignment(index) {
      if (this.parameterAssignment.length > 0) {
        this.showParameterAssignment = false;
        this.parameterAssignment.splice(index, 1);
        this.$nextTick(()=>{
          this.showParameterAssignment = true;
        });
      }
    },
    submitFormAssignmentForm(){
      if(this.formAssignment.length>0){
        let sourceParameters =this.formAssignment.filter((ele)=>{
          return ele.source.id
        });
        let targetParameters =this.formAssignment.filter((ele)=>{
          return ele.target.id
        });
         if(sourceParameters.length==this.formAssignment.length&&targetParameters.length==this.formAssignment.length){
           this.formInfo.paramOperate.formAssignment = this.formAssignment;
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message: this.$t('addFormAssSuccee'),
            type: "success"
          });
        }else{
          let message =this.$t('formAssignment');
          if(sourceParameters.length<this.formAssignment.length){
           message += this.$t('assignmentSource');
          }
          if(targetParameters.length<this.formAssignment.length){
            message += this.$t('targetFormField');
          }
          message +=this.$t('mobileDev.formRightSide.optionNotNull');
           this.$notify({
              title: this.$t("deletePrompt.promptTitle"),
              message: message,
              type: "warning"
            });
        }
      }else{
        this.formInfo.paramOperate.formAssignment=[]
      } },
      submitParameterAssignment(){
      if(this.parameterAssignment.length>0){
        let sourceParameters =this.parameterAssignment.filter((ele)=>{
          if(ele.source.assignmentType=='value'){
            return ele.source.value
          }else if(ele.source.assignmentType=='variable'){
            return ele.source.id
          }else if(ele.source.assignmentType=='sql'){
            return ele.source.tasksql
          }else if(ele.source.assignmentType=='api'){
            return ele.source.taskapi
          }
        });
        let targetParameters =this.parameterAssignment.filter((ele)=>{
          return ele.target.id
        });
         if(sourceParameters.length==this.parameterAssignment.length&&targetParameters.length==this.parameterAssignment.length){
           this.formInfo.paramOperate.parameterAssignment = this.parameterAssignment;
          this.$notify({
            title: this.$t("deletePrompt.promptTitle"),
            message:this.$t('addParameterAssSuccee'),
            type: "success"
          });
        }else{
          let message =this.$t('parameterAss');
          if(sourceParameters.length<this.parameterAssignment.length){
           message += this.$t('assignmentSource');
          }
          if(targetParameters.length<this.parameterAssignment.length){
            message += this.$t('targetParameterVariable');
          }
          message +=this.$t('mobileDev.formRightSide.optionNotNull');
           this.$notify({
              title: this.$t("deletePrompt.promptTitle"),
              message: message,
              type: "warning"
            });
        }
      }else{
        this.formInfo.paramOperate.parameterAssignment=[]
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  .flex-item {
    flex-basis: 23%;
    line-height: 40px;
    height: 40px;
    margin-left: 1%;
    margin-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
.red {
  color: red;
}
.empty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}
.tree-li {
  padding-left: 20px !important;
}
.submit-form{
  margin-right: 20px;
}
</style>
