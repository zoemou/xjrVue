<template>
  <div class="main-container">
    <div class="mainBox">
      <main-fixed :title="$t('mobileDev.functionDesignStepSeven.fixedTitle')">
        <div slot="list">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
            ref="cTree"
          ></el-tree>
        </div>
      </main-fixed>

      <main-content
        title="代码预览"
        :paddingLeft="210"
        :paddingTop="88"
        :search="false"
        :collapse="false"
      >
        <div slot="table" id="code">
		<p class="head_title">{{$t('mobileDev.functionDesignStepSeven.headTitle')}}</p>   	
          <codemirror
            ref="mycode"
            :value="curCode"
            :options="cmOptions"
          ></codemirror>
        </div>
      </main-content>
    </div>
  </div>
</template>


<script>
import MainFixed from "../../../page/main/MainFixed";
import MainContent from "../../../page/main/MainContent";
import { getPhonePreviewWebCode } from "@/api/code/code";
import { codemirror } from "vue-codemirror";
import "codemirror/theme/idea.css";
import {
  deepClone
} from '@/utils/index';
import store from "@/store"; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require("codemirror/mode/javascript/javascript"); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["MDAllStepData"]),
  },
  props: ["step2Html"],
  data() {
    return {
      param: {
        stepFive: {},
        stepFour: [],
        stepOne: {},
        stepSix: {},
        stepThree: [],
        stepTwo: {},
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      curCode: "",
      allCode: {},
      cmOptions: {
        value: "sssss",
        mode: "text/javascript",
        theme: "idea",
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
    handleNodeClick({ value }) {
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
      }
    }
  },
  created() {},
  mounted: function () {
	  let MDAllStepData=deepClone(this.MDAllStepData)
    const {param } = this;
    param.stepOne = MDAllStepData.stepOne;
    param.stepTwo.DbId = MDAllStepData.stepTwo.F_DbId;
    param.stepTwo.list = MDAllStepData.stepTwo.list;
    MDAllStepData.stepThree.forEach((it) => {
      delete it.listStyle;          
      if (it.table&&Object.prototype.toString.call(it.table)=='[object Object]'){
        let temp=it.table;
        it.table = temp.name;
      } 		  
	  if(it.type=='radio'||it.type=='select'){
		  let temp=it.dbdefault;
		  it.dbdefault=temp.value||''
	  }
	  if(it.type=='checkbox'){
		  let temp=it.dbdefault;
		  it.dbdefault=temp.toString()
	  }
	  if(it.type=='daterange'){
		  let arr=it.dbdefault
		  let format=it.dateformat
		  it.dbdefault=arr&&arr.length>0?((format==0?this.mydayFormat(new Date(arr[0])):this.mydateFormat(new Date(arr[0])))+'至'+(format==0?this.mydayFormat(new Date(arr[1])):this.mydateFormat(new Date(arr[1])))):''
	  }
	  if(it.type=='date'||it.type=='daterange'){
		  it.dateformat=it.dateformat==1?'yyyy-mm-dd hh:ii:ss':'yyyy-mm-dd'
	  }	  
      param.stepThree.push(it);
    }); 
    param.stepFour=MDAllStepData.stepFour;
    let stepFive = MDAllStepData.stepFive;
    stepFive.list.forEach((it) => {
       if (it.table&&Object.prototype.toString.call(it.table)=='[object Object]'){
        let temp=it.table;
        it.table = temp.name;
      } 
    });
    param.stepFive = stepFive;
    param.stepSix = MDAllStepData.stepSix;

    this.treeData = [
      {
        label:this.$t('mobileDev.functionDesignStepSeven.fixedEntity'),
        children: [
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedEntityClass'),
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
            label: this.$t('mobileDev.functionDesignStepSeven.fixedSerIntClass'),
            value: 4,
          },
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedSerActClass'),
            value: 5,
          },
        ],
      },
      {
        label:this.$t('mobileDev.functionDesignStepSeven.fixedStoLayer'),
        children: [
          {
            label:this.$t('mobileDev.functionDesignStepSeven.fixedStoIntClass'),
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
            label:this.$t('mobileDev.functionDesignStepSeven.fixedController'),
            value: 8,
          },
        ],
      },
      {
        label: this.$t('mobileDev.functionDesignStepSeven.fixedRenderLayer'),
        children: [
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedList'),
            value: 9,
          },
          {
            label: this.$t('mobileDev.functionDesignStepSeven.fixedForm'),
            value: 10,
          },
        ],
      }]

    // store.state.FD.controllerType === 1 &&
    // baseData.step6.haveSql && this.treeData.push({
    //   label: '数据库脚本',
    //   children: [
    //     {
    //       label: 'sql',
    //       value: 11,
    //     },
    //   ],
    // });

    getPhonePreviewWebCode(param).then(({ data: { data, code } }) => {
      if (code) return;
      // store.state.FD.param.tableInfo = this.param.tableInfo;
      // store.state.FD.param.dbTable = this.param.dbTable;
      this.allCode = data;
      this.MDAllStepData.stepSeven=data;
      // this.allCode.formHTML = step2Html;
      const defaultDisplayCode = this.treeData[0].children[0];
      this.handleNodeClick(defaultDisplayCode);
      // this.baseData.step7 = data;
    });
  },
};
</script>

<style scoped>
#code >>> .CodeMirror {
  /* overflow-y: scroll !important; */
  height: auto !important;
}

.mainBox >>> .main-table-content {
  height: 100%;
  padding: 0;
}
.mainBox >>> .main-table-content>div{
	height: 100%;
}
/deep/ .vue-codemirror{
	height: calc(100% - 61px);
	overflow: auto;
}

.mainBox >>> .cm-s-ambiance.CodeMirror {
  height: 100%;
}

.mainBox {
  /*height: calc(100% - 56px);*/
  height: 100%;
  padding-top: 10px;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top: -10px;
	line-height: 40px;
	color: #4d4d4d;
	padding-top:10px;
}
/deep/ .main-search{
	display: none;
}
/deep/ .main-table-content{
	border-top: none;
}
/deep/ .main-header{
	font-size: 12px;
	font-weight: bold;
}
/deep/ .el-tree-node__label{
	font-size: 12px;
}
</style>
