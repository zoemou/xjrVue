<template>
  <div class="main-container">
    <div class="main-box">
      <main-fixed :title="$t('mobileDev.functionDesignStepSeven.fixedTitle')">
        <div slot="list">
          <el-tree
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              @node-click="handleNodeClick"
              ref="cTree"
			  node-key="value"
          ></el-tree>
        </div>
      </main-fixed>

      <main-content :title="$t('mobileDev.functionDesignStepSeven.headTitle')" :paddingLeft="210" :search="false" :paddingTop="88" :collapse="false">
        <div slot="table" id="code">
		    <p class="head_title">{{$t('mobileDev.functionDesignStepSeven.headTitle')}}</p>				
          <codemirror ref="mycode" :value="curCode" :options="cmOptions"></codemirror>
        </div>
      </main-content>
    </div>
  </div>
</template>


<script>
import MainFixed from '../../../page/main/MainFixed';
import MainContent from '../../../page/main/MainContent';
import { getPreviewWebCode } from '@/api/code/code';
import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/idea.css';
import store from '@/store'; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require('codemirror/mode/javascript/javascript'); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！

export default {
  props: ['baseData', 'step2Html'],
  data () {
    return {
	  loading:'',
      param: {
        DbLinkId: '',
        dbTable: [],
        baseInfo: {},
        //"codeContent":{},
        colData: {},
        formData: [],
        queryData: [],
        totalData: [],
        tableInfo: [],
      },
      treeData: [
        {
          label: this.$t('web端渲染层'),
          children: [
            {
              label:this.$t('mobileDev.functionDesignStepSeven.fixedList'),
              value: 9,
            },
            {
              label:this.$t('mobileDev.functionDesignStepSeven.fixedForm'),
              value: 10,
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      curCode: '',
      allCode: {
        // entityCode : '',
        // serviceCode : '',
        // repositoryCode : '',
        // irepositoryCode: '',
        // controllerCode : '',
        // pageinputDtoCode:'',
        // forminputDtoCode:'',
        // dbConnectionCode:'',
        // dbFlagCode : ''
      },
      cmOptions: {
        value: 'sssss',
        mode: 'text/javascript',
        theme: 'idea',
        readOnly: true,
      },
    };
  },
  components: {
    codemirror,
    MainFixed,
    MainContent,
  },
  methods: {
    handleNodeClick ({ value }) {
	  this.$refs.cTree.setCurrentKey(value)
      const { allCode } = this;
      switch (value) {
        case 1:
          this.curCode = allCode.entityCode;
          break;
        case 2:
          this.curCode = allCode.pageinputDtoCode;
          break;
        case 3:
          this.curCode = allCode.forminputDtoCode;
          break;
        case 4:
          this.curCode = allCode.iserviceCode;
          break;
        case 5:
          this.curCode = allCode.serviceCode;
          break;
        case 6:
          this.curCode = allCode.irepositoryCode;
          break;
        case 7:
          this.curCode = allCode.repositoryCode;
          break;
        case 8:
          this.curCode = allCode.controllerCode;
          break;
        case 9:
          this.curCode = allCode.listHTML;
          break;
        case 10:
          this.curCode = allCode.formHTML;
          break;
        case 11:
          this.curCode = allCode.dbSqlCode;
          break;
		case 12:
		  this.curCode = allCode.appListHTML;
		  break;
		case 13:
		  this.curCode = allCode.appFormHTML;
		  break;
      }
    },
    disposeDbTable (step1) {
      this.param.dbTable = [
        {
          name: step1[0]?.formName,
          pk: 'F_Id',
          parentName: 1,
          field: '',
          relationName: '',
          relationField: '',
          $index: 0,
        }
      ];
      step1.map((item, index) => {
        index > 0 && this.param.dbTable.push({
          name: item.formName,
          pk: 'F_Id',
          parentName: 0,
          field: `${this.param.dbTable[0].name}_Id`,
          relationName: this.param.dbTable[0].name,
          relationField: 'F_Id',
          $index: item.id,
          opr:item.opr
        });
      });

      this.param.tableInfo = [];
      this.calleArr(step1);
    },
    calleArr (array) {
      for (const key in array) {
        let data = array[key];
        if (data.dataChildren) {
          let arr = [];
          data.dataChildren.map(item => {
            arr.push({
              fieldName: item.fieldName || '',
              fieldType: item.dataType || '',
              fieldLength: item.fieldLength || '50',
              description: item.describe || '',
            });
            //   TODO 子节点处理
          });
          this.param.tableInfo.push({
            tableName: data.formName,
            tableDescription: '',
            columns: arr,
            opr:data.opr
          });
        }
      }
    }
  },
  created () {
	  this.loading = this.$loading({
		lock: true,
		text: '加载中...',
		spinner: 'el-icon-loading',
		background: 'rgba(0, 0, 0, 0.7)'
	  });
  },
  mounted: function () {
    const { baseData, step2Html } = this;
    if (baseData.step1.F_DbId) this.param.DbLinkId = baseData.step1.F_DbId;
    if (baseData.step1.list) this.param.dbTable = baseData.step1.list;
    if (baseData.step1 && (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2)) {
      const { step1 } = this.baseData;
      if(store.state.FD.controllerType === 1){//自定义表结构
        this.disposeDbTable(step1.list);
      }
      if(store.state.FD.controllerType === 2){//快速开发简易模板
        this.disposeDbTable(step1);
      }
    
      this.param.DbLinkId = store.state.FD.DbLinkId;
    }
    if (baseData.step6) this.param.baseInfo = baseData.step6;
    if (baseData.step4) this.param.colData = baseData.step4;
    if (baseData.step2) this.param.FormData = baseData.step2;
    if (baseData.step3) this.param.queryData = baseData.step3;
    if (baseData.step5) this.param.totalData = baseData.step5;
     if (this.baseData.step9) this.param.eventData = this.baseData.step9;
    !baseData.step6.onlyFont && (this.treeData = [
      {
        label:this.$t('mobileDev.functionDesignStepSeven.fixedEntity'),
        children: [
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedEntityClass'),
            value: 1,
          },
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedListDto'),
            value: 2,
          },
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedFormDto'),
            value: 3,
          },
        ],
      },
      {
        label: this.$t('mobileDev.functionDesignStepSeven.fixedSerLayer'),
        children: [
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedSerIntClass'),
            value: 4,
          },
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedSerActClass'),
            value: 5,
          },
        ],
      },
      {
        label:this.$t('mobileDev.functionDesignStepSeven.fixedStoLayer'),
        children: [
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedStoIntClass'),
            value: 6,
          },
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedStoActClass'),
            value: 7,
          },
        ],
      },
      {
        label:this.$t('mobileDev.functionDesignStepSeven.fixedApi'),
        children: [
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedController'),
            value: 8,
          },
        ],
      },
      {
        label:this.$t('webRenderLayer'),
        children: [
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedList'),
            value: 9,
          },
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedForm'),
            value: 10,
          },
        ],
      }]);
    baseData.step6.appCode && (this.treeData.push({
		label:this.$t('mobileRenderLayer'),
		children: [
		  {
		    label:this.$t('mobileDev.functionDesignStepSeven.fixedList'),
		    value: 12,
		  },
		  {
		    label: this.$t('mobileDev.functionDesignStepSeven.fixedForm'),
		    value: 13,
		  }
		],
	}))
    store.state.FD.controllerType === 1 &&
    baseData.step6.haveSql && this.treeData.push({
      label:this.$t('mobileDev.functionDesignStepSeven.databaseScript'),
      children: [
        {
          label: 'sql',
          value: 11,
        },
      ],
    });

    getPreviewWebCode(this.param).then(({ data: { data, code } }) => {
	  this.loading.close();
      if (code) return;
      store.state.FD.param.tableInfo = this.param.tableInfo;
      store.state.FD.param.dbTable = this.param.dbTable;
      this.allCode = data;
      this.allCode.formHTML = step2Html;
      const defaultDisplayCode = this.treeData[0].children[0];
      this.handleNodeClick(defaultDisplayCode);
      this.baseData.step7 = data;	  
    });
  },

};
</script>

<style scoped>

#code >>> .CodeMirror {
 /* overflow-y: scroll !important; */
  height: auto !important;
}

div /deep/ .main-table,div /deep/ .main-table-content{
	overflow: visible;
}
.main-box >>> .main-table-content {
  height: 100%;
  padding: 0;
}

.main-box >>> .main-table-content>div{
  height: 100%;
}
.main-box >>> .cm-s-ambiance.CodeMirror {
  height: 100%;
}


.main-box {
  /*height: calc(100% - 56px);*/
  height: 100%;
  font-size: 12px;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:0px;
	line-height: 40px;
	color: #4d4d4d;
}
div /deep/ .main-search{
	display: none;
}
div /deep/ .main-table-content{
	border-top: none;
}
div /deep/ .vue-codemirror{
	height: calc(100% - 51px);
	overflow: auto;
}
div /deep/ .main-fixed{
      border-right: 4px solid #EEEEEE;
}
div /deep/ .main-fixed .main-header{
	font-size: 12px;
	height: 40px;
	line-height: 40px;
	font-weight: bold;
}
div /deep/ .CodeMirror pre.CodeMirror-line, div /deep/ .CodeMirror pre.CodeMirror-line-like{
  height: 30px;
}
</style>
