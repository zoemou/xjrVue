<template>
  <ProcessTasks
    v-if="show"
    :leftTreeColumn="leftTreeColumn"
    :nwfSchemeInfo="nwfSchemeInfo"
    :pageConfig="pageConfig"
    :customSearchField="customSearchField"
	class="WFSpecialMenu"
  ></ProcessTasks>
</template>

<script>
import ProcessTasks from "./components/ProcessTasks";
import { leftTreeColumn } from "./components/processTasksConfig";
import { getWorkflowRelationInfo } from "@/api/workFlow/WFMenu";
import { deepClone } from '@/util/util';

export default {
  components: {
    ProcessTasks
  },
  data() {
    return {
      show: true,
      leftTreeColumn: [],
      nwfSchemeInfo: { nwfRelationId: "", nwfSchemeInfoIdList: [] },
      pageConfig: { isPage: true, pageSize: 10 },
      customSearchField:[]
    };
  },
  watch: {
    "$route.meta.moduleid": {
      // 监听路由变化
      handler: function(val) {
        this.getList();
      },
      deep: true
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.show = false;
      let pathArr = this.$route.path.split("/");
      let id = pathArr[pathArr.length - 1];
      if (!id) {
        this.$message.error("专项菜单自定义菜单配置异常，请检查数据格式");
        return false;
      }
      if(id=='index'){
        id = pathArr[pathArr.length - 2];
      }
      this.leftTreeColumn =deepClone(leftTreeColumn);
      this.nwfSchemeInfo = { nwfRelationId: "", nwfSchemeInfoIdList: [] };
      this.pageConfig = { isPage: true, pageSize: 10 };
      this.nwfSchemeInfo.nwfRelationId = id;
      let res = await getWorkflowRelationInfo(id);
      if (res.data.success) {
        let {
          step2 = [],
          step4 = { fields: [], isPage: false, pageSize: 10 },
          step5={}
        } = res.data.data;
        if (step2.length > 0) {
          let nwfSchemeInfoIdArr = step2.map(ele => {
            return ele.F_Id;
          });
          if (nwfSchemeInfoIdArr.length == 1) {
            //单模板设置列
            let defaultColumn = [
              "createTime",
              "serialNumber",
              "taskName",
              "schemeName",
              "priority",
              "startUser"
            ];
            if (step4.fields.length > 0) {
              let column = [];
              step4.fields.forEach(element => {
                if (!defaultColumn.includes(element.name)) {
									let name='';
									if(element.showNode===0){
										name=element.fieldName.split('.')[2]
									}else{
										name=element.fieldName
									}
                  column.push({
                    label: name,
                    name:element.name,
                    width: element.width ? element.width : "",
										overHidden:true,
                    formatter: function (row,value,label,column) {
                      if(element.componentConfig&&element.componentConfig.__config__.avueType=='switch'){
                        return row.formFieldObj[column.name]==1?`
                        <div aria-checked="true" aria-disabled="true" class="el-switch is-disabled is-checked" size="">
                          <input type="checkbox" name="" :true-value="1" :false-value="0" disabled="disabled" class="el-switch__input">
                          <span class="el-switch__core" style="width: 40px; border-color: rgb(19, 206, 102); background-color: rgb(19, 206, 102);"></span>
                        </div>`:
                        `<div aria-disabled="true" class="el-switch is-disabled">
                          <input type="checkbox" name="" :true-value="1" :false-value="0" disabled class="el-switch__input">
                          <span class="el-switch__core" style="width: 40px; border-color: rgb(162, 158, 158); background-color: rgb(162, 158, 158);"></span>
                        </div>`
                      }else{
                        return row.formFieldObj[column.name]
                      }

                  }
                  });
                }else{
                  column.push({
                    label: element.fieldName,
                    prop:element.name,
										minWidth: element.width ? element.width : "",
										overHidden:true
                  });
                }
              });
              //添加自定义列
              this.leftTreeColumn[0].column = column; //待办任务
              this.leftTreeColumn[2].column = column; //已办任务
              this.leftTreeColumn[3].column = column; //我的流程
              this.leftTreeColumn[4].column = column; //我的传阅
              this.leftTreeColumn[6].column = column; //回收站
            }
            if(step5.length>0){
              let customSearchField = [];
              let forbidDeleteColumn = ["createTime", "serialNumber"];
              step5.forEach(element => {
                if(!forbidDeleteColumn.includes(element.field)&&element.isChecked){
                  customSearchField.push(element);
                }
              });
              this.customSearchField = customSearchField;
            }else{
              this.customSearchField = [];
            }
          }
          this.nwfSchemeInfo.nwfSchemeInfoIdList = nwfSchemeInfoIdArr;
          //分页设置
          let { isPage, pageSize } = step4;
          this.pageConfig.isPage = isPage;
          this.pageConfig.pageSize = isPage ? pageSize : 0;
        }
      }
      if (this.nwfSchemeInfo.nwfSchemeInfoIdList.length == 0) {
        this.$message.error("专项菜单自定义菜单配置异常，请检查数据格式");
        return false;
      }
      this.show = true;
    }
  }
};
</script>
