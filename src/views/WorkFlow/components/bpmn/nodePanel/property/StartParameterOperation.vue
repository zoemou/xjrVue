<template>
  <el-tabs>
    <el-tab-pane :label="$t('formAssignment')">
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
      <span class="red">{{$t('hintParameterAss')}}</span>
      <div class="flex-box bt fw">
        <span
          class="flex-item opr el-icon-plus"
          @click="addParameterAssignment()"
        ></span>
        <span class="flex-item">{{$t('assignmentSource')}}</span>
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
                <ParameterTree v-model="item.source" :list="assignmentFormParameters"></ParameterTree>
            </span>
            <span class="flex-item">
              <ParameterTree v-model="item.target" :list="commonParameters" mainLabelKey="name" mainValueKey="id"></ParameterTree>
            </span>
          </div>
        </div>
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
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    ParameterTree,
  },
  data() {
    return {
      commonParameters: [],
      formParameters: [],
      assignmentFormParameters:[],
      showFormAssignment:true,
      showParameterAssignment:true,
      formAssignment:[],
      parameterAssignment:[]
    };
  },
  created() {
    if(this.formInfo.paramOperate.formAssignment&&this.formInfo.paramOperate.formAssignment.length>0){
      this.formAssignment = deepClone(this.formInfo.paramOperate.formAssignment);
    }	
    if(this.formInfo.paramOperate.parameterAssignment&&this.formInfo.paramOperate.parameterAssignment.length>0){
      this.parameterAssignment = deepClone(this.formInfo.paramOperate.parameterAssignment);
    }
    this.commonParameters = getCommonParametersData();
    this.formParameters = this.getFormTableData(false);
    this.assignmentFormParameters =  this.getFormTableData(true);
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
  },
  methods: {
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
                if (ele2.children || (!needHideComponents && ele2.filedsType === 'info')) {
                  // 表单里面的子表组件隐藏不可选
                  // 表单赋值目标字段 信息体不可选
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
      let defaultJson = {
        source: {},
        target: {}
      };
      this.parameterAssignment.push(defaultJson);
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
          return ele.source.id
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
