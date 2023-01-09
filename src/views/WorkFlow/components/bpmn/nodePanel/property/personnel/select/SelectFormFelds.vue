<template>
  <el-form-item class="item-box">
    <label>{{$t('workFlow.selectNodes.fieldType')}}</label>
    <el-tree
      ref="SelectFormFeldssTree"
      :data="sourceList"
      node-key="id"
      :props="sourceDefaultProps"
      :default-checked-keys="defaultCheckedKeys"
      default-expand-all
      show-checkbox
      accordion
    >
    </el-tree>
  </el-form-item>
</template>

<script>
import { NodeName } from "./../../../../lang/zh";
export default {
  props: {
    selectedList: {
      type: Array
    }
  },
  data() {
    return {
      sourceList: [],
      defaultCheckedKeys: [],
      sourceDefaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {
    let info = this.$store.state.bpmn.info;

    let options = [];
    for (let value of info.values()) {
      let showNodeTypes = ["bpmn:StartEvent", "bpmn:UserTask"];
      let id = value.id;
      let type = value.type;
      let name = value.name;
      let resourceName =name?name:NodeName[type];
      if (showNodeTypes.includes(type)) {
        let tableData = value.tableData;
        let tempJson = {
          id: id,
          label: resourceName,
          type: "resource",
          children: []
        };
        let children = this.getFormSourceChildren(id, resourceName, tableData);
        if (children.length > 0) {
          tempJson.children = children;
          options.push(tempJson);
        }
      }
    }
    
   

    this.sourceList = options;
    this.defaultCheckedKeys = this.selectedList.map(ele => {
      return ele.id;
    });
  },
  methods: {
    getFormSourceChildren(resourceId, resourceName, tableData) {
      let children = [];
      tableData.forEach(ele1 => {
        let formName = ele1.F_Name;
        let formId = ele1.F_Id;
        let subJson = {
          id: resourceId + formId,
          label: formName,
          type: "form",
          children: []
        };
        if (ele1.children.length > 0) {
          ele1.children.forEach(ele2 => {
            if (ele2.fieldsId) {
              let markId = resourceId + formId + ele2.fieldsId;
              subJson.children.push({
                id: markId,
                bindTable:ele2.bindTable,
                label: ele2.fieldsName,
                F_ObjId: ele2.fieldsId,
                F_ObjName:
                  resourceName + "•" + formName + "•" + ele2.fieldsName,
                fieldId: ele2.fieldsId,
                fieldName: ele2.fieldsName,
                resourceId,
                resourceName,
                formName,
                formId,
                type: "condition"
              });
            }
          });
        }
        let hideComponentsJsonChildren = [];
        // 隐藏组件
        if(ele1.hideComponents){
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
    pushParentData() {
      let result = [];
      this.$refs.SelectFormFeldssTree.getCheckedNodes().forEach(element => {
        if (element.type == "condition") {
          result.push(element);
        }else if(element.type == "hideComponents"){
          result.push(element);
        }
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.item-box {
  .el-select {
    width: 100%;
  }
}
</style>
