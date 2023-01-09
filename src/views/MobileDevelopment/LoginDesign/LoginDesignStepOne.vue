<template>
  <div class="main-container" style="height: 100%;">
    <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
      <div slot="search">
		<p class="head_title">{{$t('mobileDev.loginDesignStepOne.headTitle')}}</p>
		<div class="search-box">
        <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right:5px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
		</div>
      </div>
      <div slot="table">
        <div class="table">
          <avue-crud ref="multipleTable" :data="designList" :option="selectoption" :page.sync="page" @on-load="onPageLoad">
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

export default {
  computed: {
    ...mapGetters(['LoginAllStep'])
  },
  data () {
    return {
      keyword:'',
      contentTitle:'模板列表',
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
            label:this.$t('mobileDev.loginDesignStepOne.tabName'),
            prop: 'F_Name',
			align:'left'
          }, {
            label: this.$t('mobileDev.loginDesignStepOne.tabCreateDate'),
            prop: 'F_CreateDate'
          }, {
            label:this.$t('mobileDev.loginDesignStepOne.tabModifyDate'),
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
        this.$confirm(this.$t('mobileDev.loginDesignStepOne.Hint.whetherDelete'),this.$t('deletePrompt.promptTitle'), {
          confirmButtonText: this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
        }).then(() => {
          deletePhoneCodeSchema(this.selectedId).then(() => {
            this.selectedId = [];
            this.getList();
            this.$notify({ title: this.$t('deletePrompt.successTitle'), message: this.$t('deletePrompt.successDeleted'), type: 'success' });
          });
        }).catch(() => {
          this.$notify({
            title:this.$t('deletePrompt.failureTitle'), message: this.$t('deletePrompt.failedDeleted'), type: 'warning'
          });
        });
      }
    },
    getList(){
      let param = {
        'F_Type': 'login',
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
      this.$emit('getCurStep', 1)
      this.LoginAllStep.stepOne={
        F_Name:'',
        F_Type: 'login'
      }       
      this.LoginAllStep.stepTwo={};
      this.LoginAllStep.stepThree='';
    },
    editForm(item){
      getStepDataById(item.F_Id).then((res)=>{
        const {data}=res.data;
        if(data.F_Scheme){
          this.getAllStepData(item,data)
        }
      })
      
      this.$emit('getCurStep', 1) 
    },

    getAllStepData(item,data){
      let obj=JSON.parse(data.F_Scheme)
      const {LoginAllStep}=this;
      LoginAllStep.stepOne = item;
      if(obj.stepTwo) LoginAllStep.stepTwo= obj.stepTwo;
    }          
  },
  created () {

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
/deep/ .main-table-content{
	overflow: scroll;
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
	margin: 7px 70px 5px 347px!important;
}
/deep/ .el-tag.avue-crud__tip.el-tag--light{
	display: none;
}
</style>
