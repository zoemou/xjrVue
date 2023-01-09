<template>
  <div class="main-container import-lists">       
    <import-form v-if="isForm" @getDatum="getDatum" ></import-form>
        
    <div :class="isForm?'content-list':'container-list'" style="height:100%">
      <div  style="height:100%">
        	<p class="head_title">{{$t('databaseManage.databaseTable.importLists.copyTableTitleTwo')}}</p> 
        <el-input v-model="page.Keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                  style="width: 200px; margin-right: 10px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('searchModule.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="page.Keyword = ''">{{$t('searchModule.searchReset')}}</el-button>
        <div class="table">	
          <avue-crud :option="option"
                     :data="data"
                     @selection-change="selectionChange"
          ></avue-crud>

          <el-form-item style="text-align: right;">
            <el-button plain size="small" @click="cancel">{{$t('buttonModule.modalCancelBtn')}}</el-button>
            <el-button type="primary" size="small" @click="onSubmit">{{$t('buttonModule.modalSureBtn')}}</el-button>
          </el-form-item>
        </div>


      </div>

    </div>
  </div>
</template>
<script>
  import MainFixed from '@/page/main/MainFixed';
  import MainContent from '@/page/main/MainContent';
  import { getOrUpdateDbDraft, getOrUpdateField, getOrUpdateTable } from '@/api/databasemanage/databasetable';
  import ImportForm from './import-form';
  import authorizeMixin from "@/mixins/authorize"; //鉴权混入

  export default {
    components: {
      ImportForm, MainFixed, MainContent,
    },
	mixins: [authorizeMixin],
	props: {
	  DBType:{
	    type: String,
	    default: () => '',
	  }
	},
    data: () => ({
      isForm: false,
      data: [],
      paddingLeft: '220',
      contentTitle: '数据表信息',
      contentSubTitle: '',
      option: {
        title: '表格的标题',
        selection: true,
        tip: false,
        page: false,
        menu: false,
        maxHeight: 300,
        highlightCurrentRow: true, // 高亮
        header: false, //列显隐按钮	Boolean
        align: 'center',
        column: [
          {
            label: '列名',
            prop: 'F_Name'
          },
          {
            label: '描述',
            prop: 'F_Remark'
          }, {
            label: '创建人',
            prop: 'F_CreateUserName',
            type: 'date',
            format: 'yyyy-MM-dd hh:mm:ss',
            valueFormat: 'yyyy-MM-dd hh:mm:ss',
          }, {
            label: '创建时间',
            prop: 'F_CreateDate',
            type: 'date',
            format: 'yyyy-MM-dd hh:mm:ss',
            valueFormat: 'yyyy-MM-dd hh:mm:ss',
          }
        ]
      },
      page: {
        size: 20,
        total: 0,
        limit: 1,
        Keyword: '', // 关键字
      },
      row: [], // 存储选中的row
      DBData: {
        id: '',
        name: '',
      } // 数据库id
    }),
    created () {
    },
    methods: {
      getDatum (data, name = {}) {
        this.data = data;
        this.contentSubTitle = name.label;
        this.DBData.id = name.id;
		if(this.DBType.toLowerCase()!=name.DBType.toLowerCase()){
			this.$notify({
			  title:'提示',
			  message:'请选择数据库类型相同的表复制',
			  type: 'warning'
			});
			this.data=[]
		}
      },
      cancel () {
        this.$emit('cancel');
      },
      // 复制表 初始化
      getIsForm () {
        this.data = [];
        this.paddingLeft = 220;
        this.isForm = true;
        this.$nextTick(() => {
          this.option.column = [
            {
              label: this.$t('databaseManage.databaseTable.importLists.copyTableHeaderTitleName'),
              prop: 'Table_Name'
            }, {
              label:this.$t('databaseManage.databaseTable.importLists.copyTableHeaderTitleRemarks'),
              prop: 'Description'
            }, {
              label: this.$t('databaseManage.databaseTable.importLists.copyTableHeaderTitleRecords'),
              prop: 'Table_Rows'
            }, {
              label: this.$t('databaseManage.databaseTable.importLists.copyTableHeaderTitleSize'),
              prop: 'Data_Size'
            }, {
              label: this.$t('databaseManage.databaseTable.importLists.copyTableHeaderTitleIndexSize'),
              prop: 'Index_Size'
            },
          ];
        })
      },
      // 搜索
      search () {
        this.DBData.id ? this.getTableName() : this.getDBDraft();
      },
      async getTableName () {
        const { data: { data, code } } = await getOrUpdateTable({ id: this.DBData.id, tableName: this.page.Keyword });
        if (code) return;
        this.data = data;
      },
      onSubmit () {
        if (this.row.length<=0) {
          this.$notify({
            title: this.$t('deletePrompt.promptTitle'),
            message:this.$t('databaseManage.databaseTable.importLists.promptSelectData'),
            type: 'warning'
          });
        } else {
          this.$emit('cancel', this.DBData.name ? this.DBData : this.row);
        }
      },
      selectionChange (rows) {
        this.row = rows;
        if (rows[0] && rows[0].Table_Name) this.DBData.name = rows[0].Table_Name;
      },
      getDBDraft (datum = this.page) {
        this.replaceColumn();
        getOrUpdateDbDraft(datum).then(res => {
          const { data, code } = res.data;
          if (code) return this.data = [];
          this.data = data.Rows;
        });
      },
      getField (datum = this.page) {
        this.replaceColumn();
        getOrUpdateField(datum).then(res => {
          const { data, code } = res.data;
          if (code) return this.data = [];
          this.data = data.Rows;
        });
      },
      // 常用字段、导入草稿 初始化
      replaceColumn () {        
        this.paddingLeft = 0;
        this.DBData = {
			id: '',
			name: '',
		};
		this.isForm = false;
        this.$nextTick(() => {
          this.option.column = [
            {
              label: this.$t('databaseManage.databaseTable.addSheet.tableColumnName'),
              prop: 'F_Name'
            },
            {
              label:this.$t('databaseManage.databaseTable.importLists.commonFieldsRemark'),
              prop: 'F_Remark'
            }, {
              label: this.$t('databaseManage.databaseTable.importLists.commonFieldsCreateUserName'),
              prop: 'F_CreateUserName',
              type: 'date',
              format: 'yyyy-MM-dd hh:mm:ss',
              valueFormat: 'yyyy-MM-dd hh:mm:ss',
            }, {
              label:this.$t('databaseManage.databaseTable.importLists.commonFieldsCreateDate'),
              prop: 'F_CreateDate',
              type: 'date',
              format: 'yyyy-MM-dd hh:mm:ss',
              valueFormat: 'yyyy-MM-dd hh:mm:ss',
            }
          ];
        })
      }
    },

  };
</script>
<style scoped>
 div /deep/.main-table > .main-table-content{
	 padding-bottom: 10px!important;
 }
  div /deep/.el-form-item__content{
	 margin-top: 10px;
 }
 div /deep/ .main-search{
 	border-top:none;
 }
 .search-item>div{
 	width: 100%;
 }
 .head_title{
 	font-size: 12px;
 	font-weight: bold;
 	width: 100%;
 	border-bottom: 1px solid #f2f2f2;
 	margin-top: -10px;
 	line-height: 40px;
 	color: #4d4d4d;
 }
 .table{
	 margin-bottom: 0px!important;
	 height: calc(100% - 120px);
 }
 .main-container{
       display: flex;
    height: 462px;
 }
 
 .content-list{
   flex-basis: 80%;
   margin-left: 20px;
 }
 .container-list{
    flex-basis: 100%;
 }
</style>