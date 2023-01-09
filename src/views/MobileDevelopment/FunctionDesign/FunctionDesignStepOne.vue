<template>
  <div class="main-container" style="height: 100%;">
    <main-fixed :title="$t('mobileDev.functionDesignForm.labelTemClassif')">
      <div slot="list">
        <el-tree :data="treeItem" :props="defaultProps" node-key="F_ItemDetailId" ref="dTree" :default-expand-all="true"
                 @node-click="handleNodeClick"></el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="210" :padding-top="94">
      <div slot="search">
		<p class="head_title">{{$t('mobileDev.loginDesignStepOne.headTitle')}}</p>
		<div class="search-box">  
        <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right: 5px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
		</div>
      </div>
      <div slot="table">
        <div class="table">
          <avue-crud ref="multipleTable" :data="designList" :option="selectoption" :page.sync="page" @on-load="onPageLoad"
                     @sort-change="sortChange" @selectionChange="selectionChange" @size-change='sizeChange'>
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click="addRow">{{$t('buttonModule.addBtn')}}</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteTableData">{{$t('buttonModule.batchDeletionBtn')}}</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="opr-primary" size="mini" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
              <el-button type="opr-danger" size="mini" @click="deleteData(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
            </template>
          </avue-crud>
        </div>
      </div>
    </main-content>
  </div>
</template>
<script>
import { getPhoneCodeSchemaInfo,deletePhoneCodeSchema,getStepDataById} from '@/api/code/code.js';
import {mapGetters} from "vuex";
import {mobileCategory,btnList} from '@/components/mobileDesign/config';
import store from '@/store/index';
export default {
  computed: {
    ...mapGetters(['MDAllStepData'])
  },
  data () {
    return {
      treeItem:mobileCategory,
      formElList:btnList,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      keyword:'',
      contentTitle:'模板列表',
      itemCode: 'customapp',
      page: { pageSize: 10, total: 0, currentPage: 1 },
      order: { order: 'desc', prop: '' },
      selectedId:[],
      loading: false,  
      designList:[],
      selectoption: {
        highlightCurrentRow: true,
        stripe: false,
        menuWidth: 150,
       // calcHeight:'120',
        //height: 'auto',
        maxHeight:480,
        border: true,
        page: true,
        index: true,
        indexLabel:this.$t('mobileDev.loginDesignStepOne.tabNum'),
        selection: true,
        align: 'center',
        menuAlign: 'center',
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          // {
          //   label: '状态',
          //   prop: 'F_Type',
          //   formatter(row,value,label,column){
          //     return value==0?'草稿':'完成'
          //   }
          // },
          {
            label:this.$t('mobileDev.functionDesignStepOne.tabName'),
            prop: 'F_Name',
			align:'left'
          }, {
            label: this.$t('mobileDev.loginDesignStepOne.tabCreateDate'),
            prop: 'F_CreateDate'
          }, {
            label: this.$t('mobileDev.loginDesignStepOne.tabModifyDate'),
            prop: 'F_ModifyDate'
          }
        ]
      },
      copyTable: []  //复制表
    };
  },
  components: {

  },
  methods: {
    handleNodeClick(data){
      this.contentTitle = data.label;
      this.itemCode = data.F_ItemDetailId;
      this.keyword = null;
      this.getList()
    },
    search () {
       this.getList();
    },
    searchReset () {
      this.keyword = '';
      this.getList();
    },
    onPageLoad (page) {
      this.page.currentPage = page.currentPage;
      this.page.pageSize = page.pageSize;
      this.getList();
    },
    sortChange (val) {
      this.order.order = val.order == 'ascending' ? 'asc' : 'desc';
      this.order.prop = val.prop;
      this.getList();
    },
    sizeChange (page) {
      this.page.pageSize = page;
      this.getList();
    },
     selectionChange (list) {
      this.selectedId = [];
      list.forEach((o, i) => {
        this.selectedId.push(o.F_Id);
      });
    },
    deleteTableData (row) {
      if (row) {
        this.selectedId = [];
        this.selectedId.push(row.F_Id);
      }
      if (this.selectedId.length <= 0) {
        this.$notify({ title:this.$t('deletePrompt.promptTitle'), message:this.$t('mobileDev.loginDesignStepOne.Hint.selectData'), type: 'warning' });
      } else {
        this.$confirm(this.$t('mobileDev.loginDesignStepOne.Hint.whetherDelete'), this.$t('deletePrompt.promptTitle'), {
          confirmButtonText:this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deletePhoneCodeSchema(this.selectedId).then(() => {
            this.selectedId = [];
            this.getList();
            this.$notify({ title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
          this.$notify({
            title:this.$t('deletePrompt.failureTitle'), message:this.$t('deletePrompt.failedDeleted'), type: 'warning'
          });
        });
      }
    },
    getList(){
      let param = {
        'F_Type': this.itemCode,
        'limit': this.page.currentPage, 'size': this.page.pageSize,
        'keyword': this.keyword, 'order': this.order.order, 'orderfield': this.order.prop
      };
      getPhoneCodeSchemaInfo(param).then((res) => {
        if (res.data.success) {
          this.page.total = res.data.data.Total;
          this.designList=res.data.data.Rows;
        }    
      });
    },
    deleteData (row) {
      deletePhoneCodeSchema(row.F_Id).then(() => {
        this.getList();
        this.$notify({ title:this.$t('deletePrompt.successTitle'), message: this.$t('deletePrompt.successDeleted'), type: 'success' });
      });    
    },
    addRow () {
      //新加一行
      this.$emit('getCurStep', 1)
      this.MDAllStepData.stepOne={
        F_Name:'',
        F_Type:this.itemCode
      }       
      this.MDAllStepData.stepTwo={
          F_DbId:'',
          list:[]
      };
      this.MDAllStepData.stepThree=[];
      this.MDAllStepData.stepFour=[];
      this.MDAllStepData.stepFive={
            list:[],
            btn:[{
                icon:'el-icon-plus',
                name:this.$t('buttonModule.addBtn'),
                select:true,
                id:'add'
                },{
                icon:'el-icon-edit',
                name:this.$t('tableOperationModule.editorBtn'),
                select:true,
                id:'edit'
                },{
                icon:'el-icon-delete',
                name:this.$t('tableOperationModule.deleteBtn'),
                select:true,
                id:'del'
            }]
      };
      this.MDAllStepData.stepSix={
            createUser:"",
            describe:"",
            name:"",
            outputArea:"",
            controllerDirectory:"",
            modelDirectory:"",
            fontDirectory:"",
            haveSql:false
      };
      this.MDAllStepData.stepSeven={};
      this.MDAllStepData.stepEight={}
    },
    editForm(item){
      getStepDataById(item.F_Id).then((res)=>{
        const {data}=res.data;
        if(data.F_Scheme){
          this.getAllStepData(item,data)
        }
		this.$emit('getCurStep', 1) 
      })     
    },
    objAssignFun(o){
      //新加的字段兼容以前的数据
      let tempobj=this.formElList.find(x=>{return x.type==o.type})
      if(tempobj){
        for(let i in tempobj){
          if(i=='placeholder'||i=='showValue'||i=='imgLength') o[i]=tempobj[i]
        }
      }
    },
    getAllStepData(item,data){
      let obj=JSON.parse(data.F_Scheme)
      if(obj.stepThree?.length>0){
        obj.stepThree.forEach(o=>{
          this.objAssignFun(o)
        })
      }
      if(obj.stepFour?.length>0){
        obj.stepFour.forEach(o=>{
          this.objAssignFun(o)
        })
      }
      if(obj.stepFive?.list?.length>0){
        obj.stepFive.list.forEach(o=>{
          this.objAssignFun(o)
        })
      }else{
		 obj.stepFive.list=[]
	  }
      const {MDAllStepData}=this;
      MDAllStepData.stepOne = item;
      if(obj.stepTwo.DbId)  MDAllStepData.stepTwo.F_DbId = obj.stepTwo.DbId;
      if(obj.stepTwo.list)  MDAllStepData.stepTwo.list = obj.stepTwo.list;
      if(obj.stepThree) MDAllStepData.stepThree=obj.stepThree;
      if(obj.stepFour) MDAllStepData.stepFour=obj.stepFour;
      if(obj.stepFive) MDAllStepData.stepFive=obj.stepFive;
      if(obj.stepSix)  MDAllStepData.stepSix = obj.stepSix; 
      if(obj.stepSeven) MDAllStepData.stepSeven=obj.stepSeven;     
      if(obj.stepEight) MDAllStepData.stepEight=obj.stepEight;
    }          
  },
  created () {
    this.$nextTick(function () {
      this.$refs.dTree.setCurrentKey(this.treeItem[0].F_ItemDetailId);
      // this.handleNodeClick(this.$refs.dTree.getCurrentNode());
    })
  }
};
</script>

<style scoped>
.search-item>div{
	width: 100%;
}	
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:0px;
	line-height: 40px;
	color: #4d4d4d;
	margin-bottom: 0px;
}
/deep/ .main-table{
	overflow: hidden;
}
.search-box{
	width: 400px;
	top:45px!important;
	right: 75px;
}
/deep/ .avue-crud__left{
	margin-top: 4px;
	margin-bottom: 5px;
}
/deep/ .el-tag.avue-crud__tip.el-tag--light{
	display: none;
}
/deep/ .main-header{
	font-size: 12px;
	font-weight: bold;
}
/deep/ .el-tree-node__label{
	font-size: 12px;
}
</style>
