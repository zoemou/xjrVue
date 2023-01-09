<template>
  <div class="main-container">
    <main-content :title="$t('code.codeStepFive.headTitle')" :paddingLeft="0" :paddingTop="40" :search="false" style="height: 65%;">
      <div slot="table" style="height: 100%;">
		<p class="head_title">{{$t('code.codeStepFive.headTitle')}}</p>
        <avue-crud ref="multipleTable" :data="tableData" :option="option" stripe @selectAll="selectAll"
                   @select="select"  @selection-change="handleSelectionChange">
        </avue-crud>
      </div>
    </main-content>
    <div class="line"></div>
    <main-content :title="$t('code.codeStepFive.showResult')" :paddingLeft="0" :paddingTop="40" :search="false" >
      <div slot="table" class="select-box">
        <avue-crud ref="selectTable" :data="multipleSelection" :option="selectOption" stripe>
        </avue-crud>
      </div>
    </main-content>
  </div>

</template>

<script>
import MainContent from '@/page/main/MainContent';

export default {
  props: [
    'baseData'
  ],
  data () {
    return {
      tableData: [],
      option: {
        highlightCurrentRow: true,
        stripe: true,
        header: false,
        menu: false,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        page: false,
        align: 'center',
        selection: true,
        selectable: (row) => {
          return 'int_double_float_NUMBER_decimal_DECIMAL_integer_numeric'.indexOf(row.colType) !== -1;
        },
        column: [
          {
            label:this.$t('code.codeStepFive.tabColName'),
            prop: 'fieldName'
          }, {
            label: this.$t('code.codeStepFive.tabBindSheet'),
            prop: 'bindTable'
          }, {
            label: this.$t('code.codeStepFive.tabBindField'),
            prop: 'bindColumn'
          }, {
            label:this.$t('code.codeStepFive.tabFieldType'),
            prop: 'colType'
          }
        ]
      },
      multipleSelection: [],
      curRow: {},
      /* showPosition: '',
      showPositionOptions:[], */
      columData: {},
      selectOption: {
        highlightCurrentRow: true,
        stripe: true,
        header: false,
        showSummary: true,
        sumColumnList: [],
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        index: true,
        indexLabel:this.$t('code.codeStepFive.tabNum'),
        menu: false,
        page: false,
        column: [{
          label: '',
          prop: ''
        }]
      },
    };
  },
  components: {
    MainContent
  },
  methods: {
    selectAll (selection) {
      this.validateData();
      // this.multipleSelection= selection;
    },
    handleSelectionChange(val){
      this.baseData.step5 = [];
      this.selectOption.column = [];
      this.multipleSelection = [];
      let fields = [];
      if(val.length>0){
        val.forEach(ele => {
         this.baseData.step5.push({
          label: ele.fieldName,
          name:ele.bindColumn,
          type: 'sum',
          decimals:1
          });
          this.selectOption.column.push({
          label: ele.fieldName,
          prop: ele.bindColumn,
        });
        fields.push(ele.bindColumn);
        });
      }
      if(this.selectOption.column.length>0){
        this.selectOption.column.forEach(ele => {
        let temp = {};
        if(fields.length>0){
          fields.forEach(ele2 => {
            temp[ele2] = 1000;
          });
        }
        this.multipleSelection.push(temp);
      });
      }
      this.validateData();
    },
    select (selection, row) {
      this.selectOption.column = [{
        label: '',
        prop: ''
      }];
      this.baseData.step5 = [];
      this.multipleSelection = [];
      for (let i = selection.length - 1; i >= 0; i--) {
        this.selectOption.column.push({
          label: selection[i].fieldName,
          prop: selection[i].bindColumn,
        });
        this.baseData.step5.push({
          label: selection[i].fieldName,
          name: selection[i].bindColumn,
          type: 'sum',
          decimals:1
        });
         let temp = {};
        temp[selection[i].bindColumn] = 1000;
        this.multipleSelection.push(temp);
      }
      this.validateData();
    },

    //提交数据验证
    validateData () {
      this.$emit('onChange', this.baseData.step5);
    }
  },
  created () {
    if (this.baseData.step4.fields) {
      let fields = this.baseData.step4.fields;
      this.tableData = [...fields];
    }
    if (this.baseData.step5.length>0) {
      let selection = this.baseData.step5;

      this.selectOption.column = [{
        label: '',
        prop: ''
      }];
      this.baseData.step5 = [];
      this.multipleSelection = [];
      for (let i = selection.length - 1; i >= 0; i--) {
        this.selectOption.column.push({
          label: selection[i].label,
          prop: selection[i].name,
        });
        this.baseData.step5.push({
          label: selection[i].label,
          name: selection[i].name,
          type: 'sum',
          decimals:1
        });
         let temp = {};
        temp[selection[i].name] = 1000;
        this.multipleSelection.push(temp);
      }
    }

    
  }
};
</script>

<style scoped>
.main-container {
  height: 100%;
}

.avue-crud {
  width: 100%;
  height: 100%;
}

.avue-crud__tip.el-tag {
  display: none !important;
}
.head_title{
	  font-size: 12px;
    font-weight: bold;
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    line-height: 40px;
    color: #4d4d4d;
    height: 40px;
    padding: 0;
    margin: 0;
    margin-left: 15px;
}
div /deep/ .main-table-content{
	border-top: none;
}
div /deep/ .main-table-content .avue-crud .avue-crud__tip.el-tag{
	display: none;
}
.line{
  width: 100%;
  height: 4px;
  background: #EEEEEE;
}
.select-box{
  width: 100%;
  height: 200px;
  overflow: hidden;
}
</style>
