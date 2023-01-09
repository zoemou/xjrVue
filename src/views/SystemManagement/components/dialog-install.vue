<template>
  <div>
    <div slot="search">
      <!-- 在此处放置搜索内容 -->
	  <div style="position: absolute;right:20px; z-index: 99;">
      <div class="search-box">  
          <el-input
            v-model="keyword"
              size="small"
              clearable
              :style="{ width: '100%' }"
             :placeholder="$t('searchModule.searchPlaceholder')"
            ></el-input>
          <el-button
          class="search-btn"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getTree()"
              >{{ $t("searchModule.searchBtn") }}</el-button
            >
      </div>
	  </div>
    </div>
   
    <div slot="table">
      <div class="table">
        <avue-crud :option="option"
                   :data="data"
                   v-model="model"
                   :before-open="beforeOpen"
                   :before-close="beforeClose"
                   @row-cell="rowCell"
                   @row-save="rowSave"
                   @row-update="rowUpdate"
                   @row-del="rowDel"
        >
          <template slot="icon" slot-scope="scope">
            <i :class="scope.row.F_IsTree" style="font-size:24px">{{ scope }}</i>
          </template>

          <template slot-scope="scope" slot="treeForm">
            <avue-input-tree ref="cas" default-expand-all v-model="scope.row.F_ParentId" :placeholder="$t('dataItem.dialogInstall.placeholderSelectSuperior')" type="tree"
                             @change="onChange"
                             :dic="dicTree"></avue-input-tree>
          </template>
          <template slot-scope="scope" slot="isNavForm">
            <avue-switch v-model="scope.row.F_IsNav" :dic="dic"></avue-switch>
          </template>
          <!-- <template slot-scope="scope" slot="isTreeForm">
            <avue-switch v-model="scope.row.F_IsTree" :dic="dic"></avue-switch>
          </template> -->

		  <!-- <template slot-scope="scope" slot="menu">
		    <el-button type="opr-primary" size="mini" @click="editForm(scope.row)">{{$t('tableOperationModule.editorBtn')}}</el-button>
		    <el-button type="opr-danger" size="mini" @click="deleteForm(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
		  </template> -->
        </avue-crud>

      </div>

    </div>
  </div>
</template>
<script>

import { getDataTree, delDetail, updateDetail, setDetail } from '@/api/system/dataitem';

export default {
  components: {},
  data() {
    return {
		keyword: '',
		//parentItemId: '',
		data: [],
		model: {},
		dic: [{
		  value: 0
		}, {
		  value: 1
		}],
		treeInput: '',
		dicTree: [],
		option: {
		  title: '表格的标题',
		  // headerAlign: 'center',
		  rowKey: "F_ItemId",
		  // border: true,
		  // index: true,
		  defaultExpandAll: false, // 是否全部展开
		  page: false,
		  addBtn: true,
		  menu: true,
		  sortable: true,
		  editBtn: true,
		  delBtn: true,
		  menuWidth: 150,
		  maxHeight: 400,
		  highlightCurrentRow: true, // 高亮
		  columnBtn: false, //列显隐按钮	Boolean
		  refreshBtn: false, //	刷新按钮	Boolean
		  align: 'left',
		  menuAlign: 'center',
		  column: [
			{
			  label:this.$t('dataItem.dialogInstall.labelSuperior'),
			  prop: 'tree',
			  formslot: true, // slot 自定义input
			  hide: true, // 隐藏列
			},
			{
			  label:this.$t('dataItem.dialogInstall.labelName'),
			  prop: 'F_ItemName',
			  align: 'left',
			  width: 200,
			  rules: [{
				  required: true,
				  message: this.$t('dataItem.dialogInstall.hintSortName'),
				  trigger: "blur"
				}]
			},
			{
			  label:this.$t('dataItem.dialogInstall.labelCode'),
			  prop: 'F_ItemCode',
			  align: 'left',
			  rules: [{
				  required: true,
				  message:this.$t('dataItem.dialogInstall.hintSortCode'),
				  trigger: "blur"
				}]
			}, {
			  label: this.$t('dataItem.tableSort'),
			  prop: 'F_SortCode',
			},
      //  {
			//   label:this.$t('dataItem.dialogInstall.labelTree'),
			//   prop: 'isTree',
			//   type: 'icon',
			//   formslot: true,
			// },
			{
			  label:this.$t('dataItem.dialogInstall.labelEfficient'),
			  prop: 'isNav',
			  type: 'icon',
			  formslot: true,
			},
			{
			  label:this.$t('dataItem.tableDescription'),
			  prop: 'F_Description',
			  align: 'left',
			}
		  ]
		},
		page: {}
	}
  },
  created () {
    this.getTree();
  },
  methods: {
    /*
    * 初始化table
    * */
    async getTree () {
      const { data: { code, data } } = await getDataTree({ keyword: this.keyword });
      if (code) return;

      function trans (data) {
        data.forEach(item => {
          item.id = item.F_SortCode;
          item.isTree = volid(item.F_IsTree);
          item.isNav = volid(item.F_IsNav);
          item.F_IsNav = item.F_IsNav ? 1 : 0;
          item.value = item.F_ItemId;
          item.label = item.F_ItemName;

          item.children && trans(item.children); // 如果有children，递归调用
        });
      }

      function volid (is) {
        if (is) {
          is = 'fa fa-toggle-on';
        } else {
          is = 'fa fa-toggle-off';
        }
        return is;
      }

      let datum = data;
      this.dicTree = data;
      trans(datum);

      this.data = data;

    },
    // 保存
    async rowSave (form, done, loading) {
      const { data: { code } } = await setDetail(form);
      this.$notify({
        title: `${code ?this.$t('deletePrompt.failureTitle') :this.$t('deletePrompt.successTitle')}`,
        message: `${code ?this.$t('deletePrompt.savedFailure') :this.$t('deletePrompt.savedSuccessfully')}`,
        type: `${code ? 'warning' : 'success'}`
      });
      if (code) {
        loading();
        return;
      }
      this.getTree();
      done();
    },
    /**
     * 删除
     * @param {object}form
     * @param {number}index
     */
    rowDel (form) {

      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:  this.$t('buttonModule.modalCancelBtn'),
        type: 'warning'
      }).then(() => {
        form.F_ItemId && delDetail(form.F_ItemId).then(({ data: {code} }) => {

          if (code) return this.$notify({
            title:this.$t('deletePrompt.failureTitle'),
            message:this.$t('deletePrompt.failedDeleted'),
            type: 'warning'
          });

          this.$notify({
            title: this.$t('deletePrompt.successTitle'),
            message: this.$t('deletePrompt.successDeleted'),
            type: 'success'
          });
          this.getTree();
        });
      });
    },
    /**
     * 修改
     * @param {object}form
     * @param {number}index
     * @param {callback}done
     * @param {callback}loading
     */
    async rowUpdate (form, index, done, loading) {
      const { data: { code } } = await updateDetail(form.F_ItemId, form);
      if (code) {
        this.$notify({
          title: this.$t('deletePrompt.failureTitle'),
          message: this.$t('dataItem.dialogInstall.hintEditFail'),
          type: 'warning'
        });
        loading();
        return;
      }
      this.$notify({
        title:  this.$t('deletePrompt.successTitle'),
        message:this.$t('dataItem.dialogInstall.hintEditSuccess'),
        type: 'success'
      });
      done();
      this.getTree()
    },
    rowCell (row, index) {

    },
    /**
     * 弹窗执行前回调
     * @param {string}type 弹窗事件名字
     * @param {callback}done
     */
    beforeOpen (done, type) {
      //this.parentItemId = this.model.F_ParentId;
      if (type === 'add') {
		this.model.F_ItemId="";
		this.model.F_Description= ""
		this.model.F_IsNav= 0
		this.model.F_IsTree= 0
		this.model.F_ItemCode= ""
		this.model.F_ItemName= ""
		this.model.F_SortCode= ''
      }
      done();
    },
    beforeClose(done,type){
       done();
    },
    // onChange(rowId){
    //   this.parentItemId = rowId
    // }
  },
};
</script>
<style scoped>
.main-container {
  height: 100%;
  padding: 0 10px;
}

.table {
  height: 460px;
}
 div /deep/ .avue-dialog .el-dialog{
	top:0!important ;
}
.search-box{
  display: flex;
}
.search-btn{
  margin-left:4px;
}
</style>
