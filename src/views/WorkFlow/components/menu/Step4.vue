<template>
  <div>
    <FiledConfig
      ref="FiledConfig"
      :fieldOptions="stepData.fieldOptions"
      :fieldData="stepData.step4"
    ></FiledConfig>

    <span class="footer">
      <el-button size="mini" type="primary" @click="prev()">{{$t('workFlow.Step1.stepBackBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="next()">{{$t('workFlow.Step1.nextStepBtn')}}</el-button>
    </span>
  </div>
</template>

<script>
import { getFormInfo } from "@/api/workFlow/WFMenu";
import FiledConfig from "./FiledConfig.vue";
export default {
  components: {
    FiledConfig
  },
  props: {
    stepData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      nwfSchemeInfoId: "",
      bindTableFiled: new Map(),
			bindField:[]
    };
  },
  async created() {
    this.nwfSchemeInfoId = this.stepData.step2[0].F_Id;
    let res = await getFormInfo(this.nwfSchemeInfoId);
    if (res?.data?.success) {
      const { code, data } = res.data;
      if (code) return;
      let optionList = [];
			let searchList = [];
			this.bindField=[]
      this.bindTableFiled = new Map([
        [
          "createTime",
          { fieldsId: "createTime", fieldName:this.$t('workFlow.filedConfig.timeQuery'), bindTable: "" }
        ],
        [
          "serialNumber",
          { fieldsId: "serialNumber", fieldName:this.$t('workFlow.filedConfig.serialNum'), bindTable: "" }
        ],
        [
          "taskName",
          { fieldsId: "taskName", fieldName:this.$t('workFlow.filedConfig.taskName'), bindTable: "" }
        ],
        [
          "schemeName",
          { fieldsId: "schemeName", fieldName:this.$t('workFlow.filedConfig.schemeName'), bindTable: "" }
        ],
        [
          "priority",
          { fieldsId: "priority", fieldName:this.$t('workFlow.filedConfig.priority'), bindTable: "" }
        ],
        [
          "startUser",
          { fieldsId: "startUser", fieldName:this.$t('workFlow.filedConfig.startUser'), bindTable: "" }
        ]
      ]);
      data.forEach((node, nodeIndex) => {
        node.forEach((item, itemIndex) => {
          let { resourceId, nodeName, nodeType, formName } = item;
          let formId = nodeIndex+itemIndex+resourceId + "_form";
          let tempJson = {
            id: formId+'resource',
            label: nodeName ? nodeName : nodeType,
            value:  formId+'resource',
            type: "resource",
            disabled: true,
            children: []
          };
					let searchJson = {
					  id: formId+'resource',
					  label: nodeName ? nodeName : nodeType,
					  value:  formId+'resource',
					  type: "resource",
					  disabled: true,
					  searchChild: []
					};
          if (item.children?.length > 0) {
            let children = [];
						let searchChild=[];
            item.children.forEach((element, elementIndex) => {
							let config=element.componentConfig.__config__;
							if(element.type=='tinymce'||config.avueType=="ueditor"||
							config.avueType=="password"||
							element.type=="avue-custom-button"||
							element.type=="upload"||
							element.type=="el-image"||config.tag=="el-image"||
							element.type=="el-divider"||
							element.type=="h2"||
							element.type=="opinion"||
							element.type=="table"
							){
								return;
							}
              let bindTable = element.bindTable ? element.bindTable : "";
              let fieldsId = element.fieldsId ? element.fieldsId : "";
              let index = bindTable + fieldsId + nodeIndex + itemIndex + elementIndex + "";
              let fieldName =
                (nodeName ? nodeName + "." : "") +
                formName +
                "." +
                (element.fieldsName ? element.fieldsName : "");
              children.push({
                id: index,
                value: index,
                disabled: false,
                label: element.fieldsName,
                type: "condition"
              });
							if(config.avueType!="timerange"&&
							config.avueType!="daterange"
							){								
								let count=0;
								if(config.dataType=="dataApi"&&config.apiConfig){
									if(config.apiConfig.apiInputParams?.length>0){
										let userInfo=['current-userId','current-companyId','current-departmentId','current-postId','current-token','current-roleId']
										config.apiConfig.apiInputParams.forEach(o=>{
											if(o.paramType=="formData"&&!userInfo.includes(o.params.id)){
												count++;
											}
										})										
									}
								}
								if(count<=0){
									searchChild.push({
									  id: index,
									  value: index,
									  disabled: false,
									  label: element.fieldsName,
									  type: "condition"
									});
									
								}								
							}
              this.bindTableFiled.set(index, {
                fieldName,
                bindTable,
                fieldsId,
                resourceId,
								componentConfig:element.componentConfig
              });
							this.bindField.push({label:fieldsId,value:index})
            });
            tempJson.children.push({
              id: formId,
              label: formName,
              value: formId,
              type: "form",
              disabled: true,
              children
            });
						
						searchJson.searchChild.push({
              id: formId,
              label: formName,
              value: formId,
              type: "form",
              disabled: true,
              searchChild
            });
            optionList.push(tempJson);
						searchList.push(searchJson);
          }
        });
      });
      this.stepData.fieldOptions = optionList;
			this.stepData.searchFields = searchList;
      this.stepData.bindTableFiled = this.bindTableFiled;
			this.stepData.bindField = this.bindField;
    }
  },
  methods: {
    prev() {
      this.stepData.activeStep--;
    },
    next() {
      let querySelection = this.$refs.FiledConfig.querySelection;
      let data = [];
      if (querySelection?.length > 0) {
        querySelection.forEach(element => {
					if(!element.name){
						return;
					}
          let {
            fieldName,
            bindTable,
            fieldsId,
            resourceId,
            componentConfig
          } = this.bindTableFiled.get(element.name);
          let temp = {
            name: element.name,
						showNode:element.showNode,
            fieldName,
            align: element.align,
            width: element.width,
            fieldsId,
            bindTable,
            resourceId,
						componentConfig
          };
          data.push(temp);
        });
      }
      if (data.length > 0) {
        let isPage = this.$refs.FiledConfig.isPage;
        let pageSize = this.$refs.FiledConfig.pageSize;
        this.stepData.step4.isPage = isPage;
        this.stepData.step4.pageSize = isPage ? pageSize : 0;
        this.stepData.step4.fields = data;
        this.stepData.activeStep++;
      } else {
        this.$message(this.$t('workFlow.Step4.hintSelectColumn'));
      }
    }
  }
};
</script>

<style scoped>
.footer {
  padding: 10px 30px 20px;
  text-align: right;
  display: block;
  position: absolute;
  right: 10px;
  bottom: 0;
}
div /deep/ .page-box{
	right: 40px;
}
</style>
