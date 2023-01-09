<template>
  <el-form size="small" label-width="90px">
    <div v-if="showSetting"  :class="activeData.__config__.componentName == 'table'?(activeData.__config__.isSelectData?'require-form-item':''):'require-form-item'">
      <el-form-item
        :label="
          activeData.__config__.componentName == 'table'
            ? $t('code.rightPanel.preloadedData')
            : $t('code.codeStepFour.dataSource')
        "
      >
        <el-radio-group
          v-model="activeData.__config__.dataType"
          @change="changeDataSelect"
          size="small"
        >
          <el-radio-button label="dataSource">
            {{ $t("code.codeStepFour.dataOrigin") }}
          </el-radio-button>
          <el-radio-button label="dataApi" v-if="activeData.__config__.componentName != 'table'"> API </el-radio-button>
          <el-radio-button label="dataItem">
            {{ $t("mobileDev.formRightSide.optionDataDic") }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div v-if="activeData.__config__.dataType === 'dataSource'">
        <div class="auto-complete-btn" v-if="activeData.__config__.dataType">
          <el-button type="primary" size="medium" @click="addNewDataSource">
            {{ $t("newDataSource") }}
          </el-button>
        </div>
        <el-form-item :label="$t('mobileDev.formRightSide.labelDataOptions')"  :class="activeData.__config__.componentName == 'table'?(activeData.__config__.isSelectData?'require-form-item':''):'require-form-item'">
          <el-select
            v-model="activeData.__config__.dataSource"
            @change="changeDataSource"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
          >
            <el-option
              v-for="item in dataSourceOption"
              :key="item.F_Id"
              :label="item.F_Name"
              :value="item.F_Id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('mobileDev.formRightSide.labelShowField')"
          v-if="activeData.__config__.componentName != 'table'"
          class='require-form-item'
        >
          <el-select
            v-model="activeData.__config__.showField"
            @change="changeDataSourceSaveField"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
          >
            <el-option
              v-for="item in dataSourceFieldOption"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('mobileDev.formRightSide.labelSaveField')"
          v-if="activeData.__config__.componentName != 'table'"
           class='require-form-item'
        >
          <el-select
            v-model="activeData.__config__.saveField"
            @change="changeDataSourceSaveField"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
          >
            <el-option
              v-for="item in dataSourceFieldOption"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option> 
          </el-select>
        </el-form-item>
				<tableSetting v-if="activeData.__config__.componentName == 'table'" :activeData="activeData"
				      :preloadFieldOption="preloadFieldOption"></tableSetting>
      </div>
      <!-- api 配置 -->
      <el-form-item :label="$t('interfaceConfig')" v-if="showApiConfig"  class='require-form-item'>
        <ApiConfig v-if="showApiConfig" :isTableChild="isTableChild" :apiConfig="activeData.__config__.apiConfig" :allComponents="allComponents" v-bind="$attrs" @submitApiDialog="submitApiDialog"></ApiConfig>
      </el-form-item>
       <div v-if="showApiConfig">
         <el-form-item :label="$t('mobileDev.formRightSide.labelDataOptions')" class='require-form-item'>
          <el-select
            v-model="activeData.__config__.apiConfig.dataSource"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
            @change="resetChangeApiDataSorceList"
          >
            <el-option
              v-for="item in apiOutputParams"
              :key="item.F_OutputKey"
              :label="item.F_OutputKey"
              :value="item.F_OutputKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('mobileDev.formRightSide.labelShowField')"
           class='require-form-item'
        >
          <el-select
            v-model="activeData.__config__.apiConfig.showField"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
          >
            <el-option
              v-for="item in apiDataSourceFieldOption"
             :key="item.outputObjName"
              :label="item.outputObjName"
              :value="item.outputObjName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('mobileDev.formRightSide.labelSaveField')"
           class='require-form-item'
        >
          <el-select
            v-model="activeData.__config__.apiConfig.saveField"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
          >
            <el-option
              v-for="item in apiDataSourceFieldOption"
             :key="item.outputObjName"
              :label="item.outputObjName"
              :value="item.outputObjName"
            >
            </el-option>
          </el-select>
        </el-form-item>
       </div> 

      <div v-if="activeData.__config__.dataType === 'dataItem'">
        <el-form-item :label="$t('mobileDev.formRightSide.labelDataOptions')"  :class="activeData.__config__.componentName == 'table'?(activeData.__config__.isSelectData?'require-form-item':''):'require-form-item'">
          <avue-input-tree
            default-expand-all
            @change="changeDataItem"
            v-model="activeData.__config__.dataItem"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
            type="tree"
            :dic="dataItemOption"
          ></avue-input-tree>
        </el-form-item>
				<tableSetting v-if="activeData.__config__.componentName == 'table'" :activeData="activeData"
				      :preloadFieldOption="preloadFieldOption"></tableSetting>
      </div>
    </div>
    <div class="auto-complete-btn" v-if="activeData.__config__.filterable">
      <el-button type="primary" size="medium" @click="openFilterableBindConf">
        {{
          activeData.__config__.tag == "el-mutiple-input"
            ? $t("dataSourceConfig")
            : $t("code.rightPanel.dataSourceConfig")
        }}
      </el-button>
    </div>
    <AddDataSource
      v-if="dataSourceVisible"
      :visible.sync="dataSourceVisible"
      :title="this.$t('addDataSource')"
    ></AddDataSource>
      <filterable-bind-fields 
      :conf="autoBindFieldsConf" 
      :comList="relativeComList"
      :activeData="activeData"
      v-if="autoBindFieldsVisible" 
      v-on:onHandler="bindFieldsCallback"></filterable-bind-fields>
      
	<mutiple-box-bind-fields
	  :conf="mutipleBindFieldsConf" 
	  :activeData="activeData"
	  v-if="mutipleBoxBindFieldsVisible" 
	  v-on:onHandler="bindFieldsCallback"></mutiple-box-bind-fields>

  </el-form>
</template>

<script>
import {
    getDataSource,
  getDataSourceFieldData,
  getDataItemDetail,
  getDataItem,
  getDataSourceField
} from '@/api/databasemanage/datasource';
import {
  getInterfaceDetail,
} from "@/api/systemManagement/interface";
import AddDataSource from "@/components/AddDataSource";
import ApiConfig from "@/components/apiConfiguration/ApiConfig.vue";
import FilterableBindFields from './../FilterableBindFields';
import MutipleBoxBindFields from './../mutipleBoxBindFields';
import tableSetting from './tableSetting';
import { FormatTree,deepClone } from '@/util/util';
export default {
  props: [
    "activeData",
    "allComponents",
  ],
  components: {
    AddDataSource,
    ApiConfig,
    FilterableBindFields,
    MutipleBoxBindFields,
		tableSetting
  },
  data() {
    return {
      preloadFieldOption: [],
      dataSourceFieldOption: [],
      dataItemChangeFlag: true,
      dataSourceVisible: false,
      apiOutputParams:[],
      apiDataSourceFieldOption:[],
      autoBindFieldsVisible: false,
      autoBindFieldsConf: {
        title:'',
        width: '60%',
		    fields:[]
      },
      mutipleBindFieldsConf:{
      title:'',
      width: '60%',
      fields:[]  
	  },
	  mutipleBoxBindFieldsVisible:false,
    };
  },
  watch: {
    dataSourceVisible: {
      handler(val) {
        if (!val) this.getDataSource();
      },
    },
    'activeData.__config__.apiConfig': {
    handler (val) {
      this.apiOutputParams = [];
      this.apiDataSourceFieldOption = [];
	    if(this.activeData.__config__.apiConfig&&this.activeData.__config__.apiConfig.url){
       this.getInterface();
      }
	  },
    },
    'activeData.__config__.dataType': {
			handler (val) {
				if(val=='dataSource'||val=='dataApi'){
					this.loadDataSource()
				}else if(val=='dataItem'){
					this.changeDataItem ()
				}
				
			}
		}
  },
  async mounted () {
    await this.initData();
  },
  computed: {
    isTableChild(){
      if(this.activeData.__config__.componentName == 'table'){
        return false;
      }
      let formId = this.activeData.__config__.formId;
      let parentFormId = null;
      //遍历整个组件列表
      let list = deepClone(this.allComponents);
      list.forEach((element, i) => {
        //找到子表单组件，  只有子表单组件 需要默认设置所绑定的表
        if (element.__config__.componentName === 'table') {
          element.__config__.children.forEach((el) => {
            if (el.__config__.formId === formId) {
              parentFormId = element.__config__.formId;
            }
          });
        }else if (element.__config__.componentName === 'avue-tabs') {
          let childrenObj = element?.__config__?.childrenObj || {};
            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
              let children = childrenObj[key] || [];
              children.forEach(item => {
                if (item?.__config__?.componentName == "table") {
                   item.__config__.children.forEach((el) => {
                    if (el.__config__.formId === formId) {
                      parentFormId = el.__config__.formId;
                    }
                  });
                }
              })
              }
            }
        }
      });
      return parentFormId?true:false;
    },
    showApiConfig() {
      if(!this.activeData.__config__.apiConfig){
          this.$set(this.activeData.__config__,'apiConfig',{
           url:"",
           type:"",
           dataSorce:'',
           dataSorceList:[],
           dataSourceFieldOption:[],
           showField:"",
           saveField:"",
           apiInputParams:[],
           F_UrlAddress:"",
         });
        }
      return this.activeData.__config__.dataType==="dataApi";
    },
    showSetting() {
      return (
        (["el-checkbox-group", "el-radio-group", "el-select"].includes(
          this.activeData.__config__.tag
        ) &&
          !this.activeData.__info__) ||
        this.activeData.__config__.filterable ||
        this.activeData.__config__.componentName == "table"
      );
    },
  },
  methods: {
    async initData(){
      await this.getDataSource();
    //默认请求出数据字典数据
      let resItem = await getDataItem();
      if(resItem.data.success){
        const data = resItem.data.data;
        const treeData = FormatTree(data, 'F_ItemCode', 'F_ItemName', 'children');
        this.dataItemOption = [...treeData];
      }
      //api配置
      await this.getInterface();
    },
    async getInterface(){
       if(this.activeData.__config__.apiConfig&&this.activeData.__config__.apiConfig.id){
         let id = this.activeData.__config__.apiConfig.id;
         let res = await getInterfaceDetail(id);
        let data = res.data.data;
        if(data.F_Outputs){
          this.activeData.__config__.apiConfig.apiOutputParams = data.F_Outputs.filter(ele=>{
            return ele.F_SettingJson;
          });
           this.apiOutputParams = this.activeData.__config__.apiConfig.apiOutputParams;
        }
         if(this.activeData.__config__.apiConfig.dataSource){
           this.changeApiDataSorceList(this.activeData.__config__.apiConfig.dataSource);
         }
       }
    },
    addNewDataSource() {
      this.dataSourceVisible = true;
    },
    	async getDataSource(){
		//默认请求出数据源数据
		let resSource = await getDataSource();
		if(resSource.data.success){
		  const data = resSource.data.data;
		  if (data) {
		    this.dataSourceOption = [...data];
		  }
		}
	},
  emitPreloadFieldOption(){
    this.$emit('emitPreloadFieldOption',this.preloadFieldOption);
  },
	async loadDataSource () {
    await this.initData();
		if(this.activeData.__config__.dataType=="dataSource"){
			if(this.activeData.__config__.dataSource){
				getDataSourceField(this.activeData.__config__.dataSource).then(res => {
				const data = res.data.data||[];
				if(this.activeData?.__config__?.componentName == 'table'){
					this.preloadFieldOption = [...data];					
					this.emitPreloadFieldOption();
				}else{
					this.dataSourceFieldOption = [...data];
				}
				}).catch(()=>{
					if(this.activeData?.__config__?.componentName == 'table'){
						this.preloadFieldOption = [];
						this.emitPreloadFieldOption();
					}else{
						this.dataSourceFieldOption = [];
					}
				});
			}
		}
	},
   changeTableHeader(name){
		 for(let key of this.preloadFieldOption){
		 	this.activeData.__config__[name].push({
		 		bindField:key,
		 		name:key
		 	})
		 }
	 },
     changeDataItem () {
      if (this.dataItemChangeFlag) {
        //清除数字字典时 不用请求数据  还原默认选项
        if(!this.activeData.__config__.dataItem){
					if(this.activeData?.__config__?.componentName == 'table'){
						this.activeData.__config__.itemTableHeader=[]
					}
          if(this.activeData.__slot__){
            this.activeData.__slot__.options = [{label: this.$t('code.leftScrollbar.component.optionOne'),value: 1}, {label:this.$t('code.leftScrollbar.component.optionTwo'),value: 2}];
          }
          return;
        }
        getDataItemDetail(this.activeData.__config__.dataItem).then(res => {
          const data = res.data.data;
          let newOption = [];

          data.forEach(item => {
            newOption.push({
              label: item.F_ItemName,
              value: item.F_ItemValue
            });
          });
          if(this.activeData.__slot__){
            this.activeData.__slot__.options = [...newOption];
          }
        });
        let fields = ['F_ItemName','F_ItemValue'];
        if(this.activeData?.__config__?.componentName == 'table'){
          this.preloadFieldOption = [...fields];
					if(this.activeData.__config__.itemTableHeader.length<=0){
						this.changeTableHeader('itemTableHeader')
					}
					
          this.emitPreloadFieldOption();
        }else{
          this.dataSourceFieldOption = [...fields];
        }
        this.dataItemChangeFlag = false;
      } else {
        this.dataItemChangeFlag = true;
      }
    },
    changeDataSelect() {
			let isTable=this.activeData.__config__.componentName&&this.activeData.__config__.componentName == 'table';
      if (this.activeData.__config__.dataType === 'dataSource') {
				if(isTable&&!this.activeData.__config__.dataSource){
					this.preloadFieldOption = [];
					this.emitPreloadFieldOption();
				}
        this.loadDataSource ()
        if(this.activeData?.__config__?.componentName !== 'table'){
          this.changeDataSourceSaveField()
          if(this.activeData.__config__.autoBindFields){
          this.activeData.__config__.autoBindFields=this.activeData.__config__.dataSourceBindFields||[]
          }
        }
      }else if(this.activeData.__config__.dataType === 'dataApi'){
        this.loadDataSource ()
        if(this.activeData.__config__.autoBindFields&&this.activeData?.__config__?.componentName !== 'table'){
          this.activeData.__config__.autoBindFields=this.activeData.__config__.dataApiBindFields||[]
        }
      }else if(this.activeData.__config__.dataType === 'dataItem'){          //如果为数据字典  就删除数据源的配置
				if(isTable&&!this.activeData.__config__.dataItem){
					this.preloadFieldOption = [];
					this.emitPreloadFieldOption();
				}
				this.changeDataItem()
        if(this.activeData.__config__.autoBindFields&&this.activeData?.__config__?.componentName !== 'table'){
          this.activeData.__config__.autoBindFields=this.activeData.__config__.dataItemBindFields||[]
        }
      }
    },
        changeDataSourceSaveField() {
      if (
        !this.activeData.__config__.saveField ||
        !this.activeData.__config__.showField
      )
        return;
      if (
        this.activeData.__config__.dataType == "dataSource" &&
        this.activeData.__config__.dataSource
      ) {
        getDataSourceFieldData(
          this.activeData.__config__.dataSource,
          this.activeData.__config__.saveField +
            "," +
            this.activeData.__config__.showField
        ).then((res) => {
          const data = res.data.data;
          let newOptions = [];
          data.forEach((item) => {
            newOptions.push({
              label: item[this.activeData.__config__.showField],
              value: item[this.activeData.__config__.saveField] + "",
            });
          });

          this.activeData.__slot__.options = [...newOptions];
        });
      }
    },
   openFilterableBindConf(){
      if(!this.activeData){
        this.$message({type:'error',message:this.$t('code.rightPanel.hintActiveNode')});
        return;
      }
      // if(!this.dataSourceFieldOption.length){
      //   this.$message({type:'error',message:this.$t('code.rightPanel.hintSpecifyData')});
      //   return;
      // }

	  let autoBindFields  = [];
	   if(this.activeData.__config__.dataType=="dataItem"){
	   	if(this.activeData.__config__?.dataItemBindFields?.length>0){
			autoBindFields = JSON.parse(this.activeData.__config__.dataItemBindFields);
		}
	   }else if(this.activeData.__config__.dataType=="dataSource"){
	   	if(this.activeData.__config__?.dataSourceBindFields?.length>0){
			autoBindFields = JSON.parse(this.activeData.__config__.dataSourceBindFields);
		  }
	   }else if(this.activeData.__config__.dataType=="dataApi"){
       if(this.activeData.__config__?.dataApiBindFields?.length>0){
			autoBindFields = JSON.parse(this.activeData.__config__.dataApiBindFields);
		  }
	   }
	  if(this.activeData.__config__.avueType=='mutiple-popup'){
		  this.mutipleBindFieldsConf.autoBindFields = autoBindFields;
		  this.mutipleBindFieldsConf.title = this.activeData?.__config__?.label + this.$t('-dataSourceConfiguration');
		  this.mutipleBindFieldsConf.fields = this.dataSourceFieldOption;
	  	  this.mutipleBoxBindFieldsVisible = true;
	  }else{
		   let FormIdMap = new Map();
       let list = deepClone(this.allComponents);
		   list.forEach((item)=>{
         let  parentFormId = 0;
		  		 if(item.__config__.componentName=='avue-tabs'){
		  		   if(item.__config__.childrenObj){
		  			 let childrenObj = item.__config__.childrenObj;
		  				for (let key in childrenObj) {
		  				  if (childrenObj[key].length > 0) {
		  					let children = childrenObj[key];
		  					if(children.length>0){
		  					  children.forEach((cld)=>{

                   if(cld.__config__.componentName=='table'){
                    let children = cld.__config__.children;
                      if(children.length>0){
                        parentFormId = cld.__config__.formId;
                        children.forEach((tableEle)=>{
                        let formId=tableEle.__config__.formId;
                        let bindTableField=tableEle.__config__.bindTableField;
                        if(!bindTableField){
                            bindTableField = tableEle.__vModel__;
                        }
                        let label = tableEle.__config__.label;
                        FormIdMap.set(formId,{bindTableField,formId,label,parentFormId,parentFormConf:cld});
                        });
                      }
                  }else{
		  						let formId=cld.__config__.formId;
		  						let bindTableField=cld.__config__.bindTableField;
		  						if(!bindTableField){
		  						   bindTableField = cld.__vModel__;
		  						}
		  						let label = cld.__config__.label;
		  						FormIdMap.set(formId,{bindTableField,formId,label,parentFormId,parentFormConf:null});
                  }
		  					  });
		  					}
		  				  }  
		  				}
		  		   }
		  		 }else if(item.__config__.componentName=='table'){
             let children = item.__config__.children;
              if(children.length>0){
                parentFormId = item.__config__.formId;
                children.forEach((tableEle)=>{
                let formId=tableEle.__config__.formId;
                let bindTableField=tableEle.__config__.bindTableField;
                if(!bindTableField){
                    bindTableField = tableEle.__vModel__;
                }
                let label = tableEle.__config__.label;
                FormIdMap.set(formId,{bindTableField,formId,label,parentFormId,parentFormConf:item});
                });
              }
		  		 }else{
		  			 let formId=item.__config__.formId;
		  			 let bindTableField=item.__config__.bindTableField;
		  			 if(!bindTableField){
		  				bindTableField = item.__vModel__;
		  			  }
		  			 let label = item.__config__.label;
		  			 FormIdMap.set(formId,{bindTableField,formId,label,parentFormId,parentFormConf:null});
		  		 }
		  });
		  this.relativeComList = this.getFilterableRelativeCom();
		  
		  if(!this.relativeComList.length){
		  			this.$message({type:'error',message:this.$t('code.rightPanel.hintEnsure')});
		  			return;
		  }
		  this.autoBindFieldsConf.autoBindFields = autoBindFields;
		  this.autoBindFieldsConf.FormIdMap = FormIdMap;
		  this.autoBindFieldsConf.title = this.activeData?.__config__?.label + this.$t('code.rightPanel.hintDataConfig');
		  this.autoBindFieldsConf.fields = this.dataSourceFieldOption;
		  this.autoBindFieldsVisible = true;  
		  this.autoBindFieldsConf.avueType=this.activeData?.__config__?.avueType;
	  }
	  
	
    },
    getFilterableRelativeCom(){
      let arr = [];
      arr = this.allComponents.filter((item)=>{
          return !item.__config__.filterable;
      });
      return arr;
    },
        bindFieldsCallback(obj){
      this.activeData = obj;
      if(this.activeData.__config__.avueType=='mutiple-popup'){
      	this.mutipleBoxBindFieldsVisible = false;
      }else{
      		this.autoBindFieldsVisible = false;  
      }
	  if(this.activeData.__config__.dataType=="dataItem"){
	  	this.$set(this.activeData.__config__,'dataItemBindFields',this.activeData.__config__.autoBindFields)
	  }else if(this.activeData.__config__.dataType=="dataSource"){
	  	this.$set(this.activeData.__config__,'dataSourceBindFields',this.activeData.__config__.autoBindFields)
	  }else if(this.activeData.__config__.dataType=="dataApi"){
	  	this.$set(this.activeData.__config__,'dataApiBindFields',this.activeData.__config__.autoBindFields)
	  }
    },
    submitApiDialog(configData){
      this.dataSourceFieldOption =[];
      this.apiDataSourceFieldOption = [];
      this.activeData.__config__.apiConfig = configData;
      this.apiOutputParams = configData.apiOutputParams;
      this.activeData.__config__.apiConfig.dataSource = "";
      this.activeData.__config__.apiConfig.showField = "";
      this.activeData.__config__.apiConfig.saveField = "";
      // this.activeData.__config__.apiConfig.dataSorceList = sourceList;
    },
    resetChangeApiDataSorceList(val){
      this.changeApiDataSorceList(val);
      this.resetApiDataSource();
    },
    changeApiDataSorceList(val){
       let settingJson = this.apiOutputParams.filter(ele=>{
         return ele.F_OutputKey==val
       });
        if(settingJson.length>0){
          let F_SettingJson = settingJson[0].F_SettingJson?JSON.parse(settingJson[0].F_SettingJson):'';
          if(F_SettingJson){
            this.apiDataSourceFieldOption = F_SettingJson.outputObjVariable;
          }
        }
      let options  = [];
      if(this.apiDataSourceFieldOption.length>0){
        options = this.apiDataSourceFieldOption.map(ele=>{
        return ele.outputObjName
        });
      }
			if(this.activeData?.__config__?.componentName == 'table'){
			  this.preloadFieldOption = [...options];
        this.emitPreloadFieldOption();
			}else{
			  this.dataSourceFieldOption = [...options];
			}
    },
    resetApiDataSource(){
      if(this.activeData.__config__&&this.activeData.__config__.apiConfig&&this.activeData.__config__.apiConfig.showField){
        this.activeData.__config__.apiConfig.showField = '';
      }
      if(this.activeData.__config__&&this.activeData.__config__.apiConfig&&this.activeData.__config__.apiConfig.saveField){
        this.activeData.__config__.apiConfig.saveField = '';
      }
    },
        changeDataSource () {
		this.$set(this.activeData.__config__,'saveField','')
		this.$set(this.activeData.__config__,'showField','')
		if(this.activeData.__config__.dataType=="dataSource"&&this.activeData.__config__.dataSource){
		  getDataSourceField(this.activeData.__config__.dataSource).then(res => {
			const data = res.data.data||[];
			if(this.activeData?.__config__?.componentName == 'table'){
			  this.preloadFieldOption = [...data];
				this.activeData.__config__.sourceTableHeader=[]
				this.changeTableHeader('sourceTableHeader')
        this.emitPreloadFieldOption();
			}else{
			  this.dataSourceFieldOption = [...data];
			}
		  }).catch(()=>{
			  if(this.activeData?.__config__?.componentName == 'table'){
			    this.preloadFieldOption = [];
					this.activeData.__config__.sourceTableHeader=[]
          this.emitPreloadFieldOption();
			  }else{
			    this.dataSourceFieldOption = [];
			  }
		  });
		}
    },
  },
};
</script>

<style lang="scss" scoped>
.el-radio-button__inner,
.el-radio-group {
  display: flex;
}
.auto-complete-btn {
  text-align: right;
  padding: 5px 0px;
}
.auto-complete-btn button {
  width: 71%;
}
.require-form-item::before{
  position:absolute;
  line-height: 36px;
  content:"*";
  color: tomato;
}
</style>
