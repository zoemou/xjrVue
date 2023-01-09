<template>
  <div class="main-container">
    <main-content :title="$t('code.codeStepFive.headTitle')" :paddingLeft="0" :paddingTop="40" :search="false" style="height: 65%;">
      <div slot="table" style="height: 100%;">
		<p class="head_title">{{$t('code.codeStepFive.headTitle')}}</p>
        <avue-crud ref="multipleTable" :data="tableData" :option="option" stripe @selectAll="selectAll"
                   @select="select"  @selection-change="handleSelectionChange">
          <!--                    <template slot="openTotal" slot-scope="scope">-->
          <!--                      <el-checkbox v-model="scope.row.openTotal" @change="handleSelectionChange(scope)"></el-checkbox>-->
          <!--                    </template>-->
        </avue-crud>
      </div>
    </main-content>
    <main-content :title="$t('code.codeStepFive.showResult')" :paddingLeft="0" :paddingTop="40" :search="false" style="height: 35%;margin-top: 10px;
    padding-bottom: 10px;">
      <div slot="table" style="height: 100%;
    overflow: scroll;
    min-height: 100px;">
        <!-- <el-form ref="treeform" size="small">
          <el-form-item label="合计字段显示位置">
            <el-select v-model="showPosition" placeholder="请选择" @change="showPositionChange">
            <el-option
            v-for="item in showPositionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
        </el-form> -->
        <avue-crud ref="selectTable" :data="multipleSelection" :option="selectOption" stripe>
          <!-- style="height: calc(100% - 50px);" -->
        </avue-crud>
      </div>
    </main-content>
  </div>

</template>

<script>
import { getDatabaseTable, getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import MainContent from '../../../page/main/MainContent';

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
          return 'int_double_float_NUMBER_decimal_DECIMAL'.indexOf(row.colType) !== -1;
        },
        column: [
          // {
          // label: '启用合计',
          // prop: 'openTotal',
          // slot: true,
          // width: '100px'
          // },
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
      }
    };
  },
  components: {
    MainContent
  },
  methods: {
    selectAll (selection) {
      // this.multipleSelection= selection;
    },
    handleSelectionChange(val){
      this.selectOption.sumColumnList = [];
      this.selectOption.column = [];
      this.multipleSelection = [];
      let fields = [];
      if(val.length>0){
        val.forEach(ele => {
         this.selectOption.sumColumnList.push({
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
      
    },
    select (selection, row) {
      this.selectOption.column = [{
        label: '',
        prop: ''
      }];
      this.selectOption.sumColumnList = [];
      this.multipleSelection = [];
      for (let i = selection.length - 1; i >= 0; i--) {
        this.selectOption.column.push({
          label: selection[i].fieldName,
          prop: selection[i].bindColumn,
        });
        this.selectOption.sumColumnList.push({
          label: selection[i].fieldName,
          name: selection[i].bindColumn,
          type: 'sum',
          decimals:1
        });
         let temp = {};
        temp[selection[i].bindColumn] = 1000;
        this.multipleSelection.push(temp);
      }
      // if (row.openTotal) {
      //  let colobj = {
      //     label: row.fieldName,
      //     prop: row.bindColumn,
      //     align: 'right'
      //   };
      //   this.columData[row.bindColumn] = '10000';
      //   this.selectOption.column.push(colobj);
      //   this.multipleSelection.push(this.columData);
      // } else {
      //   this.selectOption.sumColumnList = this.selectOption.sumColumnList.filter((item, i) => {
      //     return item.name != row.FKid;
      //   });
      // }

    },
    /* showPositionChange(val){
      console.log(val,this.columData)
    }, */

    //提交数据验证
    validateData () {
      this.$emit('onChange', this.selectOption.sumColumnList);
    }
  },
  created () {
    if (this.baseData.step4.fields) {
      let fields = this.baseData.step4.fields;
      this.tableData = [...fields];
      /* this.showPositionOptions.push({
        label:'序号',
        value:'num'
      }) */
      // this.selectOption.column = [];
      // let colobj = {};
      // fields.forEach((item, i) => {
      /* this.showPositionOptions.push({
        label:item.fieldName,
        value:item.$index+item.FKid
      }) */
      //   if (item.openTotal) {
      //     this.selectOption.sumColumnList.push({
      //       name: item.bindColumn,
      //       type: 'sum',
      //       label: ' '
      //     });
      //   }
      //   colobj = {
      //     label: item.fieldName,
      //     prop: item.bindColumn,
      //     align: 'right'
      //   };
      //   this.columData[item.bindColumn] = '10000';
      //   this.selectOption.column.push(colobj);
      // });
      // this.multipleSelection.push(this.columData);
      // console.log('获取到第四步的最终数据', this.columData, fields);
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
	margin-top:-10px;
	line-height: 40px;
	color: #4d4d4d;
}
/deep/ .main-table-content{
	border-top: none;
}
/deep/ .main-table-content .avue-crud .avue-crud__tip.el-tag{
	display: none;
}
</style>
