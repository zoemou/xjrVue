<template>
  <div class="main-container">
    <avue-crud ref="queryTable" :data="querySelection" :option="queryoption" stripe @sortable-change="sortableChange">
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
      </template>
      <template slot="isDate" slot-scope="scope">
        <el-checkbox v-model="scope.row.isDate"></el-checkbox>
      </template>
      <template slot="searchtype" slot-scope="scope">
        <el-select v-model="scope.row.searchtype" :placeholder="$t('code.codeStepThree.placeholderSelect')">
          <el-option
              v-for="item in searchtypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template slot="name" slot-scope="scope">
        <el-select v-model="scope.row.fieldId" :placeholder="$t('code.codeStepThree.placeholderSelect')" v-if="scope.row.searchtype=='data'"  @change="changeNameOptions(scope.row.$index)">
          <el-option
              v-for="item in nameOptions"
              :key="item.fieldId"
              :label="item.label"
              :value="item.fieldId">
          </el-option>
        </el-select>
        <el-input v-model="scope.row.name" v-else :placeholder="$t('code.codeStepThree.placeholderEg')"></el-input>
      </template>
      <template slot="DateField" slot-scope="scope">
        <el-select v-model="scope.row.DateField" :placeholder="$t('code.codeStepThree.placeholderSelect')" v-if="scope.row.searchtype!='data'"
                   @focus="RelationFieldFocus()">
          <el-option
              v-for="item in DateFieldOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value">
          </el-option>
        </el-select>
        <div v-else style="color: #999;">{{$t('code.codeStepThree.noSet')}}</div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import store from '@/store';

export default {
  props: [
    'baseData',
    'curStep',
    'isNextStep'
  ],
  data () {
    return {
      querySelection: [
        {
          isDate: false,
          searchtype:'time',
          name: '',
          //portion:this.$t('code.codeStepThree.noSet'),
          DateField: '',
          // width: '400',
          // height: '220',
          field: '',
          table: '',
          type: '',
          fieldId: ''
        }
      ],
      dataNameOptions:new Map(),
      nameOptions: [],
      searchtypeOptions: [
        { label:this.$t('code.codeStepThree.timeInq'),value:'time'}, { label:this.$t('code.codeStepThree.dataFInq'),value:'data'}
      ],
  //     portionOptions: [
		// {label:this.$t('code.codeStepThree.line1'),value:'1/1'},
		// {label:this.$t('code.codeStepThree.line2'),value:'1/2'},
		// {label:this.$t('code.codeStepThree.line3'),value:'1/3'},
		// {label:this.$t('code.codeStepThree.line4'),value:'1/4'},
		// {label:this.$t('code.codeStepThree.line6'),value:'1/6'}
  //     ],
      DateFieldOptions: [],
      doNotGenerateTags:["xjr-opinion-comonent","h2", "el-divider", "table","avue-custom-button", "tinymce",'el-upload','el-image'],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        menu: false,
        page: false,
        sortable: true,
        dragHandler: true,
        header: false,
        column: [
          {
            label: '',
            prop: 'add',
            renderHeader: (h) => {
              return h('i',
                  {
                    style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                    class: 'el-icon-circle-plus',
                    on: {
                      click: this.addRow
                    }
                  }
              );
            },
            width: '50px',
            slot: true
          },
          {
            label: this.$t('code.codeStepThree.tabEnable'),
            prop: 'isDate',
            width: '50px',
            slot: true
          }, {
            label:this.$t('code.codeStepThree.tabType'),
            prop: 'searchtype',
            //type:'select',
            slot: true
          },
          {
            label: this.$t('code.codeStepThree.tabName'),
            prop: 'name',
            slot: true
          }, 
		  // {
    //         label:this.$t('code.codeStepThree.tabScale'),
    //         prop: 'portion',
    //         //type:'select',
    //         slot: true
    //       }, 
		  {
            label: this.$t('code.codeStepThree.tabTField'),
            prop: 'DateField',
            //type:'select',
            slot: true
          }
		  // , {
    //         label: this.$t('code.codeStepThree.tabWidth'),
    //         prop: 'width',
    //         //type:'input',
    //         slot: true
    //       }, {
    //         label:this.$t('code.codeStepThree.tabHight'),
    //         prop: 'height',
    //         //type:'input',
    //         slot: true
    //       }
        ]
      }
    };
  },
  components: {},
  methods: {
    getTabsElements(childrenObj){
      let dataChildren = [];

      if(childrenObj && childrenObj instanceof Object){
        for(var key in childrenObj){
          let children = childrenObj[key];
          children.map(element=>{
            if(!this.doNotGenerateTags.includes(element.__config__.tag)){
              if(element?.__config__?.componentName == 'table'){
                //兼容 avue-tabs里有avue-tabs的情况
                //this.getTabsElements(element?.__config__?.childrenObj);
              }else{
                dataChildren.push(element);
              }
            }
          });
        }
      } 

      return (()=>{ return dataChildren })();
    },
    deleteData (scope) {
      this.querySelection.splice(scope.row.$index, 1);
    },
    sortableChange (oldindex, newindex, row, list) {
      this.querySelection = [];
      this.$nextTick(() => {
        this.querySelection = list;
      });
    },
    changeNameOptions(index){
      let val = this.dataNameOptions.get(this.querySelection[index].fieldId);
      this.querySelection[index] = val;
    },
    addRow () {
      var obj = {
        isDate: true,
        searchtype:'data',
        name: '',
        //portion: '1/1',
        DateField: '',
        // width: '',
        // height: '',
        field: '',
        table: '',
        type: '',
        fieldId: ''
      };
      this.querySelection.push(obj);
    },
    RelationFieldFocus () {
      const { baseData: { step1 } } = this;
      if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
        this.DateFieldOptions = [];
        step1[0]?.dataChildren.map(item => {
          this.DateFieldOptions.push({
            label: item.fieldName,
            value: item.fieldName
          });
        });
      } else {
        let list = this.baseData.step1.list;
        let val = '';
        list.forEach((item) => {
          if (item.parentName == 1) {
            val = item.name;
          }
        });
        getDatabaseTableColumns(this.baseData.step1.F_DbId, val).then(res => {
          const { code, data } = res.data;
          if (code) return;
          this.DateFieldOptions = [];
          data.forEach(item => {
            this.DateFieldOptions.push({
              label: item.Name,
              value: item.Name
            });
          });
        });
      }
    },
    //提交数据验证
    validateData () {
      this.$emit('onChange', this.querySelection);
    }
  },
  created () {
    if(store.state.FD.controllerType === 1){//自定义表结构
      this.querySelection = [];
      this.searchtypeOptions = [{ label:this.$t('code.codeStepThree.dataFInq'),value:'data'}];
    }
    else if(store.state.FD.controllerType === 2){//快速开发简易模板
      this.querySelection = [];
      this.searchtypeOptions = [{ label:this.$t('code.codeStepThree.dataFInq'),value:'data'}];
    }
    // 点击上一步
    if(!this.isNextStep){
      this.querySelection =this.baseData.step3;
      return;
    }
    if (this.baseData.step1) {
      this.RelationFieldFocus();
    }

    if (this.isNextStep&&this.baseData.step2.length > 0) {
      let tempArr = [...this.baseData.step2];

      //如果为空
      if (tempArr.length === 0) {
        return;
      }
      
      //如果存在avue-tabs 组件 需要收集avue-tabs里的元素
      let tabsElements = [];
      tempArr.map(item=>{
        if(item.__config__.componentName == 'avue-tabs'){
          let _resultArr = this.getTabsElements(item?.__config__?.childrenObj)
          tabsElements.push(..._resultArr);
        }
      });
      
      tempArr = tempArr.filter((item) => {
        return (item.__config__?.bindTableField);
      });
      
      tempArr.push(...tabsElements);

      if (this.curStep == 2 && this.baseData.step3.length > 0) this.querySelection = this.baseData.step3;
      tempArr.forEach((items) => {
        //  if(items.__config__.tag&&!this.doNotGenerateTags.includes(items.__config__.tag)){
        //    this.nameOptions.push({
        //       label: items.__config__.label,
        //       value: items.__config__.bindTableField
        //     });  
        //   }
        let obj = this.querySelection.find(function (item) {
          return item.field == items.__config__.bindTableField;
        });

        if (!obj) { 
            let hasApiFormData = false;
            if(items.__config__.dataType=='dataApi'&&
            items.__config__.apiConfig&&
            items.__config__.apiConfig.apiInputParams&&
            items.__config__.apiConfig.apiInputParams.length>0){
              let apiInputParams = items.__config__.apiConfig.apiInputParams.filter(ele=>{
                return ele.paramType=='formData' &&
                ele.params &&
                typeof ele.params.id =='number'
              });
              if(apiInputParams.length>0){
                hasApiFormData = true;
              }
            }
            if (
              items.__config__.tag &&
              !this.doNotGenerateTags.includes(items.__config__.tag)
              && !(items.__config__.tag==='el-input'&&items['show-password'])
              && !(items.__config__.tag == "el-time-picker"&&items.__config__.avueType == "timerange")
              && !(items.__config__.tag == "el-date-picker"&&items.__config__.avueType == "daterange")
              && !hasApiFormData
            ) {
              let type = items.__config__.bindTableFieldType;
              if(items.__config__.tag == 'el-time-picker'){//时间选择
                  type='datetime';//后端需要改type 不动前面的数据结构
              }
              let fieldId = "field_" +
                  items.__config__.bindTableField +
                  items.__config__.bindTable;
              let objT = {
                isDate: true,
                searchtype: "data",
                name: items.__config__.label,
                lgmark: items.__config__.F_LgMarkCode,
                DateField: "",
                field: items.__config__.bindTableField,
                table: items.__config__.bindTable,
                type,
                fieldId
              };
              this.nameOptions.push({
              fieldId,
              label: items.__config__.label,
              value: items.__config__.bindTableField,
            });  
            this.dataNameOptions.set(fieldId,objT);
            this.querySelection.push(objT);
            }
          }

      });
    }
  }
};
</script>

<style scoped>
.avue-crud {
  height: 100%;
}
div /deep/ .el-input__icon{
	line-height: 20px;
}
</style>
