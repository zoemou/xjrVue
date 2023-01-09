<template>
  <div>
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')" name="basic">
          <Basic
            :formInfo.sync="formInfo" >
          </Basic
          ><!-- 基础配置 -->
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabApprover')" name="approver">
          <PersonnelSetting
          v-if="activeName=='approver'"
            :assignment.sync="formInfo.usertaskassignment.assignment"
          ></PersonnelSetting>
          <!-- 审批人 -->
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabCirculator')" name="circulated">
          <PersonnelSetting
            v-if="activeName=='circulated'"
            :assignment.sync="formInfo.fkforwarderpackage.assignment"
          ></PersonnelSetting>
          <!--传阅人  -->
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabFormSet')" name="form">
          <SchemeForm :tableData.sync="this.formInfo.tableData"  @changeFormkeydefinition="changeFormkeydefinition"></SchemeForm>
          <!--  表单设置 -->
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabCountersign')" name="multiinstance">
            <Countersign
            :formInfo.sync="formInfo" >
          </Countersign
          ><!-- 会签 -->
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabBtnSet')" name="btns">
          <el-form-item class="button-setting">
              <UserButtonSetting 
              :fkbuttonpopu="formInfo.fkbuttonpopu" 
              :functionButton="formInfo.functionButton"></UserButtonSetting>
              <!-- 按钮设置 -->
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.User.tabCommentBox')" name="relationregion">
         <Relationregion :formInfo.sync="formInfo" 
         :approvalComponentsOptions="approvalComponentsOptions"
         :isChangeFkrelationregion="isChangeFkrelationregion"
         ></Relationregion> <!-- 关联意见框 -->
        </el-tab-pane>

        <el-tab-pane :label="$t('parmOps')"  name="parameterOperation">
          <ParameterOperation  v-if="activeName=='parameterOperation'" :formInfo.sync="formInfo" ></ParameterOperation>
          <!-- 参数操作 -->
        </el-tab-pane>

      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Basic from "./property/user/Basic";
import Countersign from "./property/user/Countersign";
import Relationregion from "./property/user/Relationregion";
import ParameterOperation from "./property/ParameterOperation";
import mixinNode from "./../mixin/mixinNode";
import SchemeForm from "./property/schemeform/Index";
import PersonnelSetting from "./property/personnel/PersonnelSetting";
import UserButtonSetting from "./property/user/UserButtonSetting";
import {
  getProperties,
  getProcessProperties
} from "./../common/util/properties";
import { deepClone } from '@/util/util';
export default {
  mixins: [mixinNode],
  components: {
    Basic,
    Countersign,
    Relationregion,
    ParameterOperation,
    SchemeForm,
    PersonnelSetting,
    UserButtonSetting
  },
  data() {
    return {
      activeName: "basic",
      isChangeFkrelationregion: true,
      approvalComponentsOptions:[]
    };
  },
  watch: {
    "formInfo.tableData": function(val) {
      if (val) {
        this.formInfo.formkeydefinition = val
          .map(ele => {
            return ele.F_Id;
          })
          .join(",");
      }
      //意见框组件
      this.isChangeFkrelationregion = false;
      this.approvalComponentsOptions = [];
      if (val && val.length > 0) {
        val.forEach(el1 => {
			if(el1.children?.length>0){
			  el1.children.forEach(el2 => {
				if (el2.type == "opinion") {
				  this.approvalComponentsOptions.push({
					value: el1.F_Id + "-" + el2.formId,
					label: el1.F_Name + "-" + el2.fieldsName
				  });
				}
			  });
			}
        });
      } else {
        this.approvalComponentsOptions = [];
        this.formInfo.fkrelationregion.approvalcomponents = [];
      }
      this.isChangeFkrelationregion = true;
    }
  },
  mounted() {
    let isSpecialInitiationProcess = this.$store.state.bpmn
      .isSpecialInitiationProcess;
    if (isSpecialInitiationProcess) {
      //当特殊表单-表单发起流程 默认特殊表单的tabledata
      let tableData = this.$store.state.bpmn.specialInitiationProcessTableData;
      this.formInfo.tableData = tableData;
    } else {
      //默认状态
      if (this.formInfo.tableData.length == 0) {
        let processformInfo = getProcessProperties();
        let isInheritStartNode = false;
        if (processformInfo.isInheritStartNode) {
          isInheritStartNode = processformInfo.isInheritStartNode;
        }
        if (isInheritStartNode) {
          let isFromMainProcess =
            this.element.businessObject.$parent.$type == "bpmn:Process";
          let startId = "";
          if (isFromMainProcess) {
            startId = this.$store.state.bpmn.processStartId;
          } else {
            let mapData = this.$store.state.bpmn.subProcessStartIds;
            let parentId = this.element.businessObject.$parent.id;
            if (parentId && mapData.size > 0 && mapData.has(parentId)) {
              startId = mapData.get(parentId);
            }
          }
          if (startId&&this.formInfo.isFirstClick) {
            let startFormInfo = getProperties(startId);
            this.formInfo.tableData = deepClone(startFormInfo.tableData);
          }
        }
        if(this.formInfo.isFirstClick){
          this.formInfo.isFirstClick = false;
        }
      }
    }
  },
  methods: {
    handleClick(tab) {
    },
    
  }
};
</script>

<style lang="scss" scoped>
.button-setting {
  .el-button--text {
    margin-left: 5px;
  }
}
</style>
