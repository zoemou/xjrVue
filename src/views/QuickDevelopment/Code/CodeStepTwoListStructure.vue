<template>
  <div class="main-container structure-box">
   <div
    class="data-select-box">
      <span><i class="import-text">*</i> <span class="data-select-label">{{$t('code.codeStepTwoListStructure.databaseSelect')}}</span></span>
      <avue-input-tree
        default-expand-all
        v-model="value"
        :placeholder="$t('code.codeStepTwoListStructure.selectContent')"
        type="tree"
        :dic="dic"
      ></avue-input-tree>
      </div>
      <div class="tip-box">
          <i  class="tip-com">* ( {{ primaryTabelName }} ) {{$t('code.codeStepTwoListStructure.explain')}}</i>
      </div>
      <div class="tip-box">
          <i class="tip-import">{{$t('code.codeStepTwoListStructure.hintFormat')}}</i>
      </div>
      <!-- 修改表名 -->
      <div :key="datumKey">
          <div class="main-table"  v-for="(item, index) in datum" :key="index">
            <div class="table-name">
              <div class="table table-bg">
                <div  class="table-item"><i class="table-icon"></i>{{$t('code.codeStepOne.tabTableName')}}</div>
                <div  class="table-item">{{$t('orgUserManagement.tabRemark')}}</div>
              </div>
              <div class="table">
                  <div  class="table-item table-center">
                    <i class="table-icon el-icon" :class="(item.isExpand===false)?'el-icon-arrow-right':'el-icon-arrow-down'" @click="expandChange(index)"></i>
                    <el-input size="small" v-model="item.formName" @input="changeTableName(index)"></el-input>
                    </div>
                  <div  class="table-item"></div>
              </div>
            </div>
            <div class="sub-table" v-if="(item.isExpand==undefined||item.isExpand)&&item.dataChildren.length>0">
              <div class="table-name-head">
                <span>{{$t('code.codeStepTwoListStructure.fieldName')}}</span>
                <span>{{$t('code.codeStepTwoListStructure.length')}}</span>
                <span>{{$t('code.codeStepTwoListStructure.dataFormat')}}</span>
                <span>{{$t('code.codeStepTwoListStructure.remark')}}</span>
              </div>
              <div class="sub-table-box" v-for="(subItem, subIndex) in item.dataChildren" :key="subIndex">
                <span><el-input size="small" v-model="subItem.fieldName"  @input="changeFieldName(index,subIndex)"></el-input></span>
                <span><el-input size="small" v-model.number="subItem.fieldLength"  :disabled="subItem.dataType=='varchar'?false:true" @input="changeVarCharFieldLength(index,subIndex)"></el-input></span>
                <span>
                  <el-select v-model="subItem.dataType" size="small" @change="changeDataType(index,subIndex)" style="width:100%;">
                  <el-option
                      v-for="item in dicData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                  </span>
                <span>{{subItem.describe}}</span>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>
<script>
import { getDatabaseTableTree } from "@/api/databasemanage/databasetable";
import store from "@/store/index";
import { FormDesignMixin } from '@/mixins/FormDesign/configFn';

export default {
  props: ["baseData"],
  mixins: [FormDesignMixin],
  data() {
	  return {
    datumKey:0,
    value: "",
    dic: [],
    dicData: [
      {
        label:this.$t('shortText'),
        value: "varchar",
      },
        {
        label:this.$t('longText'),
        value: "longText",
      },
      {
        label:this.$t('code.codeStepTwoListStructure.integer'),
        value: "int",
      },
      {
        label:this.$t('code.codeStepTwoListStructure.decimal'),
        value: "double",
      },
      {
        label:this.$t('code.codeStepTwoListStructure.datetime'),
        value: "datetime",
      },
    ],
    datum: [],
    // arr: [],
    primaryTabelName: "",
    doNotGenerateTags:['h2','el-divider','xjr-opinion-comonent','avue-custom-button'],
    mainTableComp:[] ,//所有主表组件
    childTableComp:{} //所有子表组件
  };
  },
  created() {
    this.getDbLinks();
    // if (this.baseData.step1.F_DbId) {
    //   this.value = this.baseData.step1.F_DbId;
    // }
    this.value = this.baseData.step1.F_DbId || store.state.FD.DbLinkId;
    if(!this.value){
      this.value = 'localDB';
    }
    let needchangePrimaryTabelName = false;//代码生成器，表单设计中，编辑（自定义表结构模板）如果拖动新的组件进来，则表名全部修改
    let primaryTabelChildren = [];
    let datum = [];
	//this.mainTableComp=[]
  let oldTableName = '';
  if(this.baseData.dbTable&&this.baseData.dbTable.length>0){
    oldTableName = this.baseData.dbTable[0].name;
  }
    this.baseData.step2.map((item, index) => {
      if (item.__config__.children && item.__config__.componentName == 'table') {
		let tableName="table" + (datum.length + 1) + this.getRandowNum();
    if(item.__config__.children&&item.__config__.children.length>0&&item.__config__.children[0].__config__&&item.__config__.children[0].__config__.bindTable){
      tableName = item.__config__.children[0].__config__.bindTable;
    }
        datum.push({
            id: datum.length + 2,
            formName: tableName,
            $cellEdit: true,
            componentName: "table",
            formId: item.__config__.formId,
            dataChildren: this.getDataChildren(item.__config__.children),
        });
      } else {
        if (this.baseData.step1.F_DbId || store.state.FD.DbLinkId) {
          this.primaryTabelName = item.__config__.bindTable;
          if(item.__config__.bindTable==undefined){
            needchangePrimaryTabelName = true;
          }
        } else {
          this.primaryTabelName = "table0" + this.getRandowNum();
        }
        if(!this.doNotGenerateTags.includes(item.__config__.tag)){
          if(item.__config__.componentName == 'avue-tabs'){
            primaryTabelChildren.push(...this.getDataChildrenByTabs(item?.__config__?.childrenObj));
          }else{
            primaryTabelChildren.push(this.fieldConfig(item));
          }
        }		
      }
    });
	
	if(needchangePrimaryTabelName){
		this.primaryTabelName = oldTableName?oldTableName:"table0" + this.getRandowNum();
	}
    let primaryTabel = {
      id: 1,
      formName: this.primaryTabelName,
      $cellEdit: true,
      dataChildren: primaryTabelChildren,
    };
    this.datum.push(...datum);
    this.datum.unshift(primaryTabel);
	//this.changeAssoField()
  },
  methods: {
	changeAssoField(){
		this.baseData.step2.map((item, index) => {
			if(item.__config__.avueType=="asso-popup"||item.__config__.avueType=="asso-select"){
				this.changeAssoData(item,this.mainTableComp)
			}else if(item.__config__.componentName == 'avue-tabs'){
				let childrenObj=item.__config__.childrenObj
				if (childrenObj && childrenObj instanceof Object) {
				  for(let key in childrenObj){
					let children = childrenObj[key];
					children.forEach((ele) => {
						if(ele.__config__.avueType=="asso-popup"||ele.__config__.avueType=="asso-select"){
							this.changeAssoData(ele,this.mainTableComp)
						}else if(ele.__config__.componentName == 'table'){
							if(ele.__config__.children?.length>0){
								ele.__config__.children.forEach(el=>{
									if(el.__config__.avueType=="asso-popup"||el.__config__.avueType=="asso-select"){
										this.changeAssoData(el,this.childTableComp[ele.__config__.bindTable])										
									}
								})
							}
						}
					})
				  }
				}
			}else if(item.__config__.componentName == 'table'){
				if(item.__config__.children?.length>0){
					item.__config__.children.forEach(el=>{
						if(el.__config__.avueType=="asso-popup"||el.__config__.avueType=="asso-select"){
							this.changeAssoData(el,this.childTableComp[item.__config__.bindTable])								
						}
					})
				}
			}
		})
	},
	changeAssoData(item,relation){
		let autoBindFields=item.__config__.autoBindFields?JSON.parse(item.__config__.autoBindFields):[]
		autoBindFields.forEach(it=>{
			let obj=relation.find(o=>{return o.__config__.formId==it.component})			
			if(obj){				
				it.field=obj.__vModel__
			}
		})
		item.__config__.autoBindFields=JSON.stringify(autoBindFields)
	},
    getRandowNum() {
      return Math.floor(Math.random() * (10000 - 1000)) + 1000;
    },
    getDataChildren(children) {
      let dataChildren = [];
      if (children && children.length > 0) {
        children.forEach((element) => {
          if(!this.doNotGenerateTags.includes(element.__config__.tag)){
            dataChildren.push(this.fieldConfig(element));
          }
        });
      }
      return dataChildren;
    },
    getDataChildrenByTabs(childrenObj){
      let dataChildren = [];
      if (childrenObj && childrenObj instanceof Object) {
        for(let key in childrenObj){
          let children = childrenObj[key];
          let datum = [];
          children.forEach((element) => {
            if(element&&element.__config__&&!this.doNotGenerateTags.includes(element.__config__.tag)){
              if(element?.__config__?.componentName == 'table'){
                //avue-tabs 里包含子表单
				    let tableName="table" + (datum.length + 1) + this.getRandowNum()
            if(element.__config__.children&&element.__config__.children.length>0&&element.__config__.children[0].__config__&&element.__config__.children[0].__config__.bindTable){
              tableName = element.__config__.children[0].__config__.bindTable;
            }
                datum.push({
                    id: datum.length + 2,
                    formName: tableName,
                    $cellEdit: true,
                    componentName: "table",
                    formId: element.__config__.formId,
                    dataChildren: this.getDataChildren(element?.__config__?.children),
                });
                this.datum.push(...datum);
              }else{
                //avue-tabs 里包含 avue-tabs
                dataChildren.push(this.fieldConfig(element));
              }
            }
          });
        }
      }
      return dataChildren;
    },
    expandChange(index) {
      if(this.datum[index].isExpand==undefined){
          this.datum[index].isExpand = false;
      }else{
        this.datum[index].isExpand = !this.datum[index].isExpand;
      }
      this.datumKey++;
    },
    changeTableName(index){
      let name = this.datum[index].formName
      if(name==""){
        this.$message(this.$t('mustFillFormName'));return
      }
    },
    changeDataType(index,subIndex){
        if(this.datum[index].dataChildren[subIndex].dataType=='varchar'){
          this.datum[index].dataChildren[subIndex].fieldLength=500;
        }else{
          this.datum[index].dataChildren[subIndex].fieldLength=null;
        }
    },
    changeFieldName(index,subIndex){
      let name = this.datum[index].dataChildren[subIndex].fieldName
      if(name==""){
        this.$message(this.$t('mustFillFieldName'));return
      }
      let pattern = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9_]*$/gi);
      if (!pattern.test(name)) {
         this.$message(this.$t('fieldNameMustStartWidthLetterNumberUnderscores'));return
      }
    },
     changeVarCharFieldLength(index,subIndex){
       //短文本最长长度为500
       if(this.datum[index].dataChildren[subIndex].fieldLength>500){
         this.datum[index].dataChildren[subIndex].fieldLength = 500;
       }
      //  else if(this.datum[index].dataChildren[subIndex].fieldLength==0){
        //  this.datum[index].dataChildren[subIndex].fieldLength = 500;
      //  }
    },
    processorDatum() {
      store.state.FD.DbLinkId = this.value;
      const {
        datum,
        baseData: { step2, step1 },
      } = this;
	  this.childTableComp={}
      datum.map((father, index) => {
		if(father?.componentName == 'table'&&!this.childTableComp[father.formName]) this.childTableComp[father.formName]=[]
        father.dataChildren.map((v, i) => {		  
          this.setFiledConf(step2,father,v);
        });
      });
    },
    setFiledConf(step2,father,v){
      step2.map(item=>{
        if(father?.componentName == 'table' && father?.formId == item?.__config__?.formId){
          item.__config__.bindTable = father.formName;
          item?.__config__?.children.map(el => {

            if (el.__config__.formId === v.formId) {
				this.childTableComp[father.formName].push(el)
              el.__config__.bindTable = father.formName;
              el.__config__.bindTableField = v.fieldName;
              el.__config__.bindTableFieldType = v.dataType;
              el.__config__.fieldLength = v.fieldLength;
              el.__vModel__ = v.fieldName;
            }
          });
        }else{
          if(item?.__config__?.componentName == 'avue-tabs'){
            let childrenObj = item?.__config__?.childrenObj || null;
            this.processorDatumByTabs(childrenObj,father,v);
          }else{
			
            return item.__config__.formId === v.formId && (
                    item.__config__.bindTable = this.datum[0].formName,
                    item.__config__.bindTableField = v.fieldName,
                    item.__config__.bindTableFieldType = v.dataType,
                    item.__config__.fieldLength = v.fieldLength,
                    item.__vModel__ = v.fieldName) && this.mainTableComp.push(item);
          }
        }
      });
    },
    processorDatumByTabs(childrenObj,father,v){
      if(!childrenObj) return;
      for(let key in childrenObj){
        let children = childrenObj[key] || [];
        children.map(item=>{
          if(father.componentName == 'table' && father?.formId == item?.__config__?.formId){
			//if(!this.childTableComp[father.formName]) this.childTableComp[father.formName]=[]
            //子表单这里不做处理
            item.__config__.bindTable = father.formName;
            item?.__config__?.children.map(el => {
			  
              if (el.__config__.formId === v.formId) {
				this.childTableComp[father.formName].push(el)
                el.__config__.bindTable = father.formName;
                el.__config__.bindTableField = v.fieldName;
                el.__config__.bindTableFieldType = v.dataType;
                el.__config__.fieldLength = v.fieldLength;
                el.__vModel__ = v.fieldName;
              }
            });
          }else{
			
            return item.__config__.formId === v.formId && (
                  item.__config__.bindTable = this.datum[0].formName,
                      item.__config__.bindTableField = v.fieldName,
                      item.__config__.bindTableFieldType = v.dataType,
                      item.__config__.fieldLength = v.fieldLength,
                      item.__vModel__ = v.fieldName
            ) && this.mainTableComp.push(item);
          }
        });
      }
    },
    /**
     * avue-tabs里的子元素 需要递归赋值
     * @params arr Array
     * @params v Object
     * **/
    setTabsFields(arr,v,father){
      if(!Array.isArray(arr) || !arr.length) return;

      arr.filter((item)=>{
        let isFind = item.__config__.formId === v.formId;

        if(isFind){
          return isFind && ((item.__config__.bindTable = father.formName),
            (item.__config__.bindTableField = v.fieldName),
            (item.__config__.bindTableFieldType = v.dataType),
            (item.__config__.fieldLength = v.fieldLength),
            (item.__vModel__ = v.fieldName))
        }else {
          if(item.__config__.componentName == 'avue-tabs'){
            let childrenObj = item?.__config__?.childrenObj || {};
            for(let key in childrenObj){
              this.setTabsFields(childrenObj[key],v,father);
            }
          }
          if(item.__config__.componentName == 'table'){
            this.setTabsFields(item?.__config__?.children,v,father);
          }
        }
      })
    },
    validateData(fnName) {		
	  this.mainTableComp=[]
    this.processorDatum();
	  this.changeAssoField()
      if (!this.value) {
        this.$message.error(this.$t('code.codeStepTwoListStructure.hintDatabaseTable'));
        return false;
      }
      store.state.FD.DbLinkId = this.value;
      store.state.FD.formData.fields = this.baseData.step2;
      let params = {};
      params.F_DbId = this.value;
      params.list = this.datum;
      this.$emit("onChange", params);
      return true;
    },
    addUpdate(form, index, done, loading) {
		
      this.$message.success(this.$t('code.codeStepTwoListStructure.hintNetworkRequest'));
      setTimeout(() => {
        this.$message.success(this.$t('code.codeStepTwoListStructure.hintCloseBtn'));
        loading();
      }, 1000);
      setTimeout(() => {
        this.$message.success(
          this.$t('code.codeStepTwoListStructure.hintEditData')+ JSON.stringify(form) + this.$t('code.codeStepTwoListStructure.hintDataNum') + index
        );
        done();
      }, 2000);
    },
    addRow() {
      this.$message.success(this.$t('code.codeStepTwoListStructure.hintAdding'));
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.$refs.crud.rowCellAdd({
            name: "",
          });
        }
      }, 500);
    },
    getDbLinks(obj) {
      getDatabaseTableTree(obj).then((res) => {
        const { code, data } = res.data;
		for (var item in data) {
			if(item=='localhost'){
			  this.dic.unshift({
				  label: data[item][0].F_DBName,
				  value: data[item][0].F_DatabaseLinkId,
				  children:[]
			  })
			}else{
			  let obj = {
				value: data[item][0].F_DatabaseLinkId,
				label: item,
				disabled: true,
				children: []
			  };
		
			  if (data[item]) {
				data[item].forEach(it => {
				  it.label = it.F_DBAlias;
				  it.value = it.F_DatabaseLinkId;
				  obj.children.push(it);
				});
			  }
			  this.dic.push(obj);
		   }
		}       
      });
    },
    handleRowClick(row, event, column) {
      // this.$message({
      //   showClose: true,
      //   message: '序号' + row.$index,
      //   type: 'success',
      // });
    },
  },
};
</script>
<style scoped>
.structure-box{
  padding: 20px;
  box-sizing: border-box;
  overflow: scroll;
}
.tip-com{
  font-size: 12px;
    font-weight: 400;
    color: #C0C4CC;
    line-height: 30px;
}
.tip-import{
font-size: 12px;
font-weight: 400;
color: #F56C6C;
line-height: 30px;
}
div >>> .el-table__expanded-cell {
  padding: 20px 50px 20px 100px;
}
.wrapper {
  overflow: hidden;
}
div >>> .avue-crud {
  overflow: auto;
  height: 80%;
}
/* div /deep/ .el-table .cell{
	height:27px!important;
	line-height: 27px!important;
}
 */
.data-select-box{
  color: #606266;
  font-size: 12px;
  display: flex;
  align-items: center;  
}
.data-select-box .import-text{
    color: #F56C6C;
} 
.data-select-label{
  width: 70px;
  margin-right: 10px;
}
.avue-crud .el-select{
  width: 300px !important;
}
.avue-crud  .avue-crud__menu{
  height: 0;
}
.table-bg{
     background-color: #fafafa;
}
.table{
   display: flex;
    height: 30px;
    line-height: 30px;
    color: #333333;
    font-size: 12px;
    padding-left: 10px;
}
.table .table-item{
  flex: 1;
}
.table-name-head{
    display: flex;
    justify-content: space-around;
    color: #333333;
    font-size: 12px;
    background-color: #fafafa;
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
}
.table-name-box{
  display: flex;
  justify-content: space-around;
  color: #333333;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
.sub-table{
  padding: 0 90px;
}
.sub-table-box{
  display: flex;
  justify-content: space-around;
  color: #333333;
  font-size: 12px;
}
.sub-table-box span{
  flex: 1;
  margin: 5px;
  height: 30px;
  line-height: 30px;
}
.table-name-head span{
  flex:1;
  margin-left: 10px;
  height: 30px;
  line-height: 30px;
}
.table-icon{
  margin-right: 20px;
}
.table-center{
  display: flex;
    justify-content: center;
    align-items: center;
}
</style>
