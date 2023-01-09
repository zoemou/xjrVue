<template>
  <div class="main-container" style="height: 100%; padding: 0 8px;">

    <main-content :title="contentTitle" :paddingLeft="0" :padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input v-model="searchParam.keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                    style="width: 200px; margin-right:5px"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">{{$t('searchModule.searchBtn')}}</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud ref="cuTable" :data="tableData" :option="option" stripe :page.sync="page" @on-load="onPageLoad" :showColumn="showColumn"
          :isSaveColumns="true"  @sort-change="sortChange" @row-dblclick="handleRowDBLClick">
          <template slot="menuLeft">
            <el-button v-if="hasButtonPermission('add')" type="primary" icon="el-icon-plus" size="small" @click="openForm('dataForm')">{{$t('buttonModule.addBtn')}}</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==0 && hasButtonPermission('release')" @click="changeState(scope.row,1)">{{$t('Notice.Tab.releaseBtn')}}</el-button>
            <el-button type="opr-primary" size="mini" @click="viewRow(scope.row)" v-if="hasButtonPermission('view')">{{$t('Notice.Tab.viewBtn')}}</el-button>
            <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==0 && hasButtonPermission('modify')" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
            <el-button type="opr-primary" size="mini" v-if="scope.row.F_EnabledMark==1 && hasButtonPermission('offshelf')" @click="changeState(scope.row,0)">{{$t('Notice.Tab.offShelfBtn')}}</el-button>
            <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>
        </avue-crud>
      </div>
    </main-content>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="40%"
               :before-close="handleClose" style="padding: 10px 20px;">
      <div class="companiesuser-form">
        <el-form :rules="rules" ref="dataForm" :model="dataForm" label-width="75px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="24" v-show="hasFormPermission('F_FullHead')">
              <el-form-item prop="F_FullHead" :label="$t('News.labelNewsTitle')">
                <el-input :placeholder="$t('News.placeholderNewsTitle')" size="small" v-model="dataForm.F_FullHead"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-show="hasFormPermission('F_CategoryId')">
              <el-form-item prop="F_CategoryId" :label="$t('News.labelNewsSection')">
                <el-select v-model="dataForm.F_CategoryId" :placeholder="$t('News.placeholderNewsSection')" size="small" style="width: 100%">
                  <el-option v-for="(item,index) in newsCategory" :key="index" :label="item.F_ItemName"
                             :value="item.F_ItemValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="hasFormPermission('F_ReleaseTime')">
              <el-form-item prop="F_ReleaseTime" :label="$t('Notice.labelReleaTime')">
                <el-date-picker v-model="dataForm.F_ReleaseTime" type="datetime" :placeholder="$t('Notice.placeholderSelectDate')" size="small" value-format='yyyy-MM-dd HH:mm:ss'
                format='yyyy-MM-dd HH:mm:ss' style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-show="hasFormPermission('F_AuthorName')">
              <el-form-item prop="F_AuthorName" :label="$t('News.labelWriter')">
                <el-input :placeholder="$t('News.placeholderWriter')" size="small" v-model="dataForm.F_AuthorName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="hasFormPermission('F_CompileName')">
              <el-form-item prop="F_CompileName" :label="$t('News.labelEdit')">
                <el-input :placeholder="$t('News.placeholderEdit')" size="small" v-model="dataForm.F_CompileName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-show="hasFormPermission('F_TagWord')">
              <el-form-item :label="$t('News.labelTagLabel')">
                <el-input :placeholder="$t('News.placeholderTagLabel')" size="small" v-model="dataForm.F_TagWord"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="hasFormPermission('F_Keyword')">
              <el-form-item :label="$t('News.labelKeyword')">
                <el-input :placeholder="$t('News.placeholderKeyword')" size="small" v-model="dataForm.F_Keyword"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="hasFormPermission('F_NewsContent')">
              <el-form-item :label="$t('Notice.labelContent')">
                <!-- <avue-ueditor placeholder="请填写内容" size="small" v-model="dataForm.F_NewsContent"
                              :options="options"></avue-ueditor> -->
                              <!-- v-if实现tinymce组件销毁，否则内容渲染不正常 -->
               <tinymce height="500" v-model="dataForm.F_NewsContent" v-if="dialogVisible"></tinymce>
<!--                <span class="avue-ueditor__code">{{ dataForm.F_NewsContent }}</span>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm('dataForm')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                <el-button 
                size="mini" 
                type="primary" 
                @click="formSubmit('dataForm')" 
                :loading="flagNews"
                >
                {{flagNews?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                </el-button>
            </span>
    </el-dialog>

    <newContent v-if="newsVisible" :contentData="curRow" @visible="newsVisible=false"></newContent>
  </div>
</template>

<script>
import newContent from './content.vue';
import MainContent from '@/page/main/MainContent';
// import AvueUeditor from 'avue-plugin-ueditor';
import {deepClone, getOrder,formValidateNotice} from '@/util/util.js';
import { getNewsCategory, getNews, addNews, modifyNews, deleteNews,changeStatus } from '@/api/officeautomation/news';
import { baseUrl } from '@/config/env';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize"; //鉴权混入
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: 'News',
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent,newContent },
  data () {
	const _this = this;  
    return {
      options: { // 不支持多文件上传
        action: `${baseUrl}/upload`,
        customConfig: {},//wangEditor编辑的配置
        props: {
          res: 'data',
          url: 'FileUrl'
        },
      },
      flagNews: false,
      contentTitle: '新闻数据',
      newsVisible:false,
      dialogVisible: false,
      dialogTitle: '',
      curRow:'',
      searchParam: { limit: 1, size: 20, keyword: null, order: null, orderfield: null },
      page: { pageSize: 20, total: 0, currentPage: 1 },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 220,
        border: false,
        page: true,
        index: true,
        indexLabel:this.$t('Notice.tabNum'),
        align: 'left',
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        column: [{ sortable: true, label:this.$t('News.tabNewsTitle'), prop: 'F_FullHead',minWidth:'105',align:'left' },
          { sortable: true, label:this.$t('News.labelWriter'), prop: 'F_AuthorName',minWidth:'100' },
          { sortable: true, label:this.$t('News.labelEdit'), prop: 'F_CompileName',minWidth:'140' },
          { sortable: true, label:this.$t('News.labelNewsSection'), prop: 'F_CategoryId',minWidth:'120' },
          { sortable: true, label:this.$t('Notice.labelReleaTime'), prop: 'F_ReleaseTime',minWidth:'140' },
          {
            sortable: true, label:this.$t('Notice.tabStatus'), prop: 'F_EnabledMark',minWidth:'95',
            formatter: function (row) {
              return row.F_EnabledMark === 1 ? _this.$t('published') :  _this.$t('unpublished');
            }
          }]
      },
      dataForm: {},
      rules: {
        F_FullHead: [{ required: true, message:this.$t('News.placeholderNewsTitle'), trigger: 'blur' }],
        F_AuthorName: [{ required: true, message:this.$t('News.placeholderWriter'), trigger: 'blur' }],
        F_CompileName: [{ required: true, message:this.$t('News.placeholderEdit'), trigger: 'blur' }],
        F_CategoryId: [{ required: true, message:this.$t('News.placeholderNewsSection'), trigger: 'change' }],
        F_ReleaseTime: [{ required: true, message: this.$t('Notice.hintReleaTime'), trigger: 'blur' }],
      },
      newsCategory: [],
      tableData: []
    };
  },
  created () {
    this.getNewsCategory();
  },
  methods: {
    handleRowDBLClick (row, event) {
        if(this.openDoubleClickEdit && row.F_EnabledMark==0){
          this.editForm(row)
        }else{
          this.$message({
            message:'新闻已发布，不允许编辑',
            type:'warning'
          })
        }
    },
    getNewsCategory () {
      getNewsCategory('NewsCategory').then(res => {
        this.newsCategory = res.data.data;
      });
    },
    /* 获取数据 */
    getData (params) {
      getNews(params).then(res => {
        this.tableData = res.data.data.Rows;
        this.page.total = res.data.data.Total;
      });
    },
    /* 新增 */
    openForm () {
      this.flag = true;
      this.dataForm = {};
      this.dialogVisible = true;
      this.dialogTitle = this.$t('Notice.dialogTitle.Add');
    },
    /* 编辑 */
    editForm (row) {
      this.flag = false;
      this.dialogVisible = true;
      this.dialogTitle =this.$t('Notice.dialogTitle.Edit');
      this.dataForm = deepClone(row);
    },
    changeState(row,data){
      changeStatus({
        id:row.F_NewsId,
        type:data
      }).then(res=>{
        const { code } = res.data;
        let text=data==0?this.$t('Notice.hintOffShelf'):this.$t('Notice.hintRelease');
        this.$notify({
          title: code?this.$t('deletePrompt.failureTitle'):this.$t('deletePrompt.successTitle'),
          message: code?(text+this.$t('Notice.hintFailure')):(text+this.$t('Notice.hintSuccess')),
          type: code?'error':'success'
        });
        if(!code) this.getData(this.searchParam);
      })
    },
    viewRow(row){
      this.newsVisible=true;
      this.curRow=row;
    },
    /* 删除 */
    deleteForm (row) {
      this.$confirm(this.$t('deletePrompt.promptContent'),this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
      }).then(() => {
        deleteNews(row.F_NewsId).then(() => {
          this.getData(this.searchParam);
          this.$notify({ title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success' });
        }).catch(() => {
					this.$notify({ title: this.$t('deletePrompt.failureTitle'), message: this.$t('deletePrompt.failedDeleted'), type: 'warning' });
				});
      }).catch(() => {});
    },
    /* 提交表单 */
    formSubmit (formName) {
      this.flagNews = true;
      this.dataForm.F_TypeId = 1;
      this.$refs[formName].validate((valid,object) => {
        if (valid) {
          if (this.flag) {
            addNews(this.dataForm).then(() => {
              this.dialogVisible = false;
              this.getData(this.searchParam);
            }).finally(() => {
              this.flagNews = false;
            });
          } else {
            modifyNews(this.dataForm.F_NewsId, this.dataForm).then(() => {
              this.dialogVisible = false;
              this.getData(this.searchParam);
            }).finally(() => {
              this.flagNews = false;
            });
          }
        } else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagNews = false;
          return false;
        }
      });
    },
    /* 取消弹窗 */
    cancelForm (formName) {
      this.flagNews = false;
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    /* 关闭弹窗 */
    handleClose (done) {
      this.$refs['dataForm'].resetFields();
      done();
    },
    
    /* 页面加载 */
    onPageLoad (page) {
      this.searchParam.limit = page.currentPage;
      this.searchParam.size = page.pageSize;
      this.getData(this.searchParam);
    },
    /* 查询 */
    searchData () {
      this.searchParam.limit = 1;
      this.searchParam.order = null;
      this.searchParam.orderfield = null;
      this.getData(this.searchParam);
    },
    /* 查询表单重置 */
    searchReset () {
      this.searchParam.keyword = null;
      this.getData(this.searchParam);
    },
    sortChange (data) {
      this.searchParam.order = getOrder(data.order);
      this.searchParam.orderfield = data.prop;
      this.getData(this.searchParam);
    },
  }
  
};
</script>

<style scoped>
	@media screen and (max-width: 1370px) {
		.companiesuser-form{
			max-height:415px;
			overflow-y: scroll;
		}
	/deep/ .el-dialog{
			margin-top: 5vh!important;
		}
	}
  /deep/ .el-dialog{
  		margin-top: 8vh!important;
  	}
</style>