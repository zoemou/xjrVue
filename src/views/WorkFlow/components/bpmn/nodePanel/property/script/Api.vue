<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.taskapi.isActvate">
        <el-radio :label="false">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="true">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formInfo.taskapi.isActvate">
      <div class="flex-box bt fw">
        <span class="flex-item opr el-icon-plus" @click="addApi"></span>
        
        <span class="flex-item">{{
          $t("workFlow.userButtonSetting.tableApiAddress")
        }}</span>
        <span class="flex-item">{{
          $t("workFlow.userButtonSetting.tableRequestWay")
        }}</span>
        <span class="flex-item"></span>
      </div>
      <div
        v-for="(item, index) in formInfo.taskapi.iframeData"
        :key="index"
        class="bt"
      >
        <div class="flex-box bt">
          <span class="flex-item opr" @click="delApi(index)">{{
            $t("tableOperationModule.deleteBtn")
          }}</span>
          
          <span class="flex-item">
			<el-tooltip class="item" effect="dark" :content="item.apiUrl" placement="top-start" :disabled="!item.apiUrl">  
				<el-input v-model="item.apiUrl" suffix-icon="el-icon-more" @focus="apiUrlClick(index)"></el-input>
			</el-tooltip>
          </span>
          <span class="flex-item">
            <el-select v-model="item.method" disabled>
              <el-option
                v-for="item in axiosType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </div>
        <div v-if="item.params.length>0">
          <div class="chilTabs">
		    <el-tabs v-model="activeName" @tab-click="handleClick">
		  		<el-tab-pane :label="$t('workFlow.zh.inputParameter')" name="first">
					<avue-crud ref="queryTable" :data="item.params" :option="queryoption" stripe style="padding-top:10px;height:calc(100% - 100px)">
					<template slot="paramValType" slot-scope="scope">
					  <el-select v-model="scope.row.paramValType" :placeholder="$t('selectParameterValueType')" @change="changeParamVal(scope.row)">
						<el-option :label="$t('workFlow.zh.value')" :value="0"></el-option>
						<el-option :label="$t('initiatorInfor')" :value="1"></el-option>
						<el-option :label="$t('procPara')" :value="2"></el-option>
						<el-option :label="$t('formData')" :value="3"></el-option>
					  </el-select>
					</template>
					  <template slot="paramValue" slot-scope="scope">
						<avue-input-tree v-model="scope.row.paramValue" v-if="scope.row.paramValType==1" default-expand-all type="tree" :dic="userDic"></avue-input-tree>
						<avue-input-tree v-model="scope.row.paramValue" v-else-if="scope.row.paramValType==2" default-expand-all type="tree" :dic="paramDic"></avue-input-tree>
						<avue-input-tree v-model="scope.row.paramValue" v-else-if="scope.row.paramValType==3" default-expand-all type="tree" :dic="formDic" @change="changeFormDic(index,scope.row.$index)"></avue-input-tree>
						<el-input v-model="scope.row.paramValue" v-else placeholder=""></el-input>
					  </template>
					</avue-crud>
				</el-tab-pane>
			</el-tabs>
          </div>
        </div>
      </div>
    </el-form-item>
    <interfaceList v-if="listVisible" :visible.sync="listVisible" @getUrl="getUrl" :curId="formInfo.taskapi.iframeData[editApiIndex].interfaceId"></interfaceList>
  </div>
</template>

<script>
import interfaceList from '@/views/SystemManagement/InterfaceDevelopment/component/interfaceList.vue';
import { scriptApiTasksTree, scriptApiRuleTip } from "./../../../data/rules";
import { changeVariableSourceList } from "./../../../common/util/variable";
import { getScriptApiParameters } from "./../../../common/util/properties";
import {axiosType,axiosMethod } from '@/util/util';
import {getInterfaceById } from '@/api/systemManagement/interface.js';
import { mapGetters } from "vuex";
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ruleBtnList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    interfaceList
  },
  computed: {
  	...mapGetters(["allForm"])
  },
  data() {
    return {
      activeName: 'first',
      axiosType: axiosType,
      editApiIndex: -1,
      editApiSubIndex: -1,
      //apiRuleTreelist: [],
      apiRuleTip: scriptApiRuleTip,
      apiParamsTemplateData: [],
	  queryoption: {
	    highlightCurrentRow: true,
	    stripe: true,
	    calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
	    height: '200px',//表格高度
	    maxHeight: 'auto',
	    border: true,
	    align: 'center',
	    menu: false,
	    page: false,
	    dragHandler: true,
	    header: false,
	    column: [
	  		  {
	        label:this.$t('workFlow.userButtonSetting.tablePName'),
	        prop: 'paramName'
	      },
	      {
	        label: this.$t('parameterType'),
	        prop: 'paramType',
	        formatter:function(row){
	          return axiosMethod.filter((o)=>{return o.value==row.paramType})[0].label;
	        }
	      },
	  		   {
	  		     label: this.$t('valueType'),
	  		     prop: 'paramValType',
	  		     slot: true
	  		   },
	  	  {
	        label: this.$t('workFlow.userButtonSetting.tablePValue'),
	        prop: 'paramValue',
	        slot: true
	      }
	    ]
	  },
	  listVisible:false,
	  userDic:[{
		label:this.$t('initiatorId'),
		value:'userid'
	  },{
		label:this.$t('sponsorsCompanyId'),
		value:'companyid'
	  },{
		label:this.$t('sponsorsDepartmentId'),
		value:'departid'
	  }],
	  paramDic:[],
	  formDic:[],
		hideComponentsMap:new Map()
    };
  },
  mounted() {
    //增加流程参数
  this.paramDic = getScriptApiParameters();
	this.formDic = changeVariableSourceList({ needButton: false,needHideComponents:true });
	this.formDic.forEach(ele=>{
		ele.value=ele.id;
		ele.children.forEach((item, itemIndex) => {
			item.value=item.id;
		   if (item.children?.length > 0) {
		     item.children.forEach((child, childIndex) => {
						child.value=child.resourceId+"_"+child.bindTable+"_"+child.id;
						if (child.children?.length > 0) {
							child.children.forEach((child2, childIndex2) => {
									if(child2.type&&child2.type=='hideComponents')this.hideComponentsMap.set(child2.id,child2);
							});
						}
						if(child.type&&child.type=='hideComponents')this.hideComponentsMap.set(child.id,child);
		     });
		   }
			 if(item.type&&item.type=='hideComponents')this.hideComponentsMap.set(item.id,item);
		});
	})
  },
  methods: {
    addApi() {
      let defaultJson = {
        apiUrl: "",
        method: "POST",
        params: []
      };
      this.formInfo.taskapi.iframeData.push(defaultJson);
    },
    delApi(index) {
      if (
        this.formInfo.taskapi.iframeData &&
        this.formInfo.taskapi.iframeData.length > 0
      ) {
        this.formInfo.taskapi.iframeData.splice(index, 1);
      }
    },
    apiUrlClick(index){
		this.editApiIndex = index;
		this.listVisible=true;
	},
	getUrl(data){
		if(data.F_Id){
			let index = this.editApiIndex ;
			this.formInfo.taskapi.iframeData[index].apiUrl=data.F_UrlAddress;
			this.formInfo.taskapi.iframeData[index].method=data.F_RequestMethod;
			this.formInfo.taskapi.iframeData[index].interfaceId=data.F_Id;	
			this.formInfo.taskapi.iframeData[index].params=[]
			getInterfaceById(data.F_Id).then(res=>{
				if(res.data.data){
					let result=res.data.data
					let param=result.F_Params||[];
					param.forEach(i=>{
						let obj={
							paramName:i.F_ParamKey,
							paramType: i.F_Type,
							paramValType: 0,
							paramValue: i.F_ParamValue
						}
						this.formInfo.taskapi.iframeData[index].params.push(obj)
					})					
				}
			})			
		}
	},
	changeParamVal(row){
		row.paramValue=""
	},
	changeFormDic(parentIndex,inputIndex){
		let key = this.formInfo.taskapi.iframeData[parentIndex].params[inputIndex].paramValue;
		let paramJson = {};
		if(this.hideComponentsMap.has(key)){
			let {id,apiConfig,hideComponentsType,hideComponentsvalue,sqlConfig,type} = this.hideComponentsMap.get(key);
			 paramJson = {id,apiConfig,hideComponentsType,hideComponentsvalue,sqlConfig,type};
		}
		this.formInfo.taskapi.iframeData[parentIndex].params[inputIndex].paramJson = paramJson;
	}
  }
};
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  .flex-item {
    flex-basis: 18%;
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
.property-panel .chilTabs ::v-deep .el-tabs__content{
	border:0;
	padding: 0;
}
.chilTabs ::v-deep .el-tabs__item{
	width: 120px;
	text-align: center;
	font-size: 12px;
}
.chilTabs ::v-deep .el-tabs__header{
	margin: 0;
}
</style>
