<template>
  <div class="main-container">
    <avue-crud ref="queryTable" :data="this.baseData.step3" :option="queryoption" stripe @sortable-change="sortableChange">
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
        <el-select v-model="scope.row.field" :placeholder="$t('code.codeStepThree.placeholderSelect')" v-if="scope.row.searchtype=='data'">
          <el-option
              v-for="item in nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
    'isNextStep',
    'nameOptions',
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
      searchtypeOptions: [
        { label:this.$t('code.codeStepThree.timeInq'),value:'time'}, { label:this.$t('code.codeStepThree.dataFInq'),value:'data'}
      ],
      DateFieldOptions: [],
      doNotGenerateTags:['h2','el-divider','xjr-opinion-comonent','table'],
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
    deleteData(scope) {
      this.baseData.step3.splice(scope.row.$index, 1);
    },
    sortableChange (oldindex, newindex, row, list) {
      this.baseData.step3 = [];
      this.$nextTick(() => {
        this.baseData.step3 = list;
      });
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
      this.baseData.step3.push(obj);
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
      this.$emit('onChange', this.baseData.step3);
    }
  },
  created () {
    if(store.state.FD.controllerType === 1){//自定义表结构
      this.searchtypeOptions = [{ label:this.$t('code.codeStepThree.dataFInq'),value:'data'}];
    }
    else if(store.state.FD.controllerType === 2){//快速开发简易模板
      this.searchtypeOptions = [{ label:this.$t('code.codeStepThree.dataFInq'),value:'data'}];
    }
    if (this.baseData.step1) {
      this.RelationFieldFocus();
    }
  }
};
</script>

<style scoped>
.main-container{
  height: 100%;
}
.avue-crud {
  height: 100%;
}
div /deep/ .el-input__icon{
	line-height: 20px;
}
div /deep/ .el-table__body-wrapper{
  overflow-y: scroll !important;
  height: calc(100% - 160px) !important;
}
</style>
