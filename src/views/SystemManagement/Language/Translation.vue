<template>
  <div class="main-container">
    <main-content
      :title="contentTitle"
      :subTitle="contentSubTitle"
      :paddingLeft="0"
      padding-top="94"
    >
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
		<div class="search-box">
        <el-input
          v-model="searchParam.keyword"
          size="small"
          :placeholder="$t('language.translation.tagNameSearch')"
          style="width: 200px; margin-right:5px"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="search"
          >{{ $t("searchModule.searchBtn") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{
          $t("searchModule.searchReset")
        }}</el-button>
		</div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
          <avue-crud
            ref="translation"
            :data="translation"
            :option="option"
            :page.sync="page"
            :showColumn="showColumn"
            :isSaveColumns="true"
            @on-load="onPageLoad"
            stripe
            @row-click="currentRow"
            :cell-style="cellStyle"
            @row-dblclick="editDBLclick"
          >
            <template slot-scope="scope" slot="menuLeft">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="editForm"
                v-if="hasButtonPermission('modify')"
                >{{ $t("tableOperationModule.editorBtn") }}</el-button
              >
              <el-button
                size="small"
                @click="openDialog"
                v-if="hasButtonPermission('add')"
                >{{ $t("language.translation.addTra") }}</el-button
              >
            </template>
          </avue-crud>

          <!-- 新增 -->
          <el-dialog
            v-dialogDrag
            :title="$t('language.translation.addTra')"
            :close-on-click-modal="false"
            :append-to-body="true"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="closeDialog"
          >
            <div class="form">
              <el-form
                ref="transForm"
                :rules="rules"
                :model="transForm"
                label-width="100px"
              >
                <el-col v-show="hasFormPermission('F_Name')">
                  <el-form-item
                    :label="$t('language.translation.labelTagName')"
                    prop="F_Name"
                  >
                    <el-input
                      v-model="transForm.F_Name"
                      :placeholder="
                        $t('language.translation.placeholderTagName')
                      "
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-show="hasFormPermission('F_EnCode')">
                  <el-form-item
                    :label="$t('language.translation.labelTagCode')"
                    prop="F_EnCode"
                  >
                    <el-input
                      v-model="transForm.F_EnCode"
                      :placeholder="
                        $t('language.translation.placeholderTagCode')
                      "
                    ></el-input>
                  </el-form-item>
                </el-col>
               
                <el-col v-show="hasFormPermission('F_Info')">
                  <el-form-item
                    :label="$t('language.translation.labelRemarks')"
                    prop="F_Info"
                  >
                    <el-input
                      type="textarea"
                      v-model="transForm.F_Info"
                      :placeholder="
                        $t('language.translation.placeholderRemarks')
                      "
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-form
                ref="mapList"
                :rules="mrule"
                :model="mapList"
                label-width="100px"
              >
                <el-col v-for="item in lgType" :key="item.prop">
                  <el-form-item
                    :label="$t('language.languageCategory.' + item.prop)"
                    :prop="item.prop"
					 v-show="hasFormPermission(item.prop)"
                  >
                    <el-input
                      v-model="mapList[item.prop]"
                      :placeholder="
                        $t('language.translation.hinrEnter') +$t('language.languageCategory.' + item.prop)
                      "
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">{{
                $t("buttonModule.modalCancelBtn")
              }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm('transForm')"
                :loading="flagTranslation"
                >{{flagTranslation?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
              >
            </span>
          </el-dialog>
          <!-- 编辑 -->
          <el-dialog
            v-dialogDrag
            :title="$t('language.translation.titleEditTra')"
            :close-on-click-modal="false"
            :append-to-body="true"
            :visible.sync="editdialogVisible"
            width="40%"
            :before-close="closeEditDialog"
          >
            <div class="form">
              <el-form
                ref="translationForm"
                :rules="editrules"
                :model="translationForm"
                label-width="100px"
              >
                <el-col>
                  <el-form-item :label="$t('language.translation.labelTagName')">
                    <el-input
                      v-model="translationForm.mkName"
                      disabled
					  v-show="hasFormPermission('F_Name')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-for="item in lgType" :key="item.prop">
                  <el-form-item
                    :label="$t('language.languageCategory.' + item.prop)"
                    :prop="item.prop"
					v-show="hasFormPermission(item.prop)"
                  >
                    <el-input
                      v-model="translationForm[item.prop]"
                      :placeholder="
                        $t('language.translation.hinrEnter') +$t('language.languageCategory.' + item.prop)
                      "
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeEditDialog">{{
                $t("buttonModule.modalCancelBtn")
              }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm('translationForm')"
                :loading="flagAddTranslation"
                >
                {{flagAddTranslation?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                </el-button
              >
            </span>
          </el-dialog>
      </div>
    </main-content>
  </div>
</template>

<script>
import MainContent from "../../../page/main/MainContent";
import {
  getTranslation,
  addTranslation,
  editTranslation,
  getDataDictionary
} from "@/api/language/translation";

import { deepClone, FormatTree,formValidateNotice } from "../../../util/util";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import {validateDesLength} from "@/api/organization/validateFunc";
export default {
  name: "Translation",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent },
  data() {
    return {
      flagTranslation: false,
      flagAddTranslation: false,
      tapRepeat: false,
      contentTitle: "翻译列表",
      contentSubTitle: "",
      searchParam: {},
      translation: [],
      translationForm: {},
      transForm: {
        mapList: {}
      },
      mapList: {},
      dialogVisible: false,
      editdialogVisible: false,
      curId: "",
      defaultTree: [],
      rules: {
        F_Name: [
          {
            required: true,
            message: this.$t("language.translation.placeholderTagName"),
            trigger: "blur"
          }
        ],
        F_EnCode: [
          {
            required: true,
            message: this.$t("language.translation.placeholderTagCode"),
            trigger: "blur"
          },
          {
            message: this.$t("language.translation.hintTagCode"),
            trigger: "blur",
            //pattern: "^[a-zA-Z_-]([a-zA-Z0-9_-]+)?$"
          }
        ],
        F_Info: [
          {
            validator: validateDesLength,
            trigger:'change'
          }
        ]
      },
      mrule: {},
      editrules: {},
      page: {
        pageSize: 20,
        total: 0,
        currentPage: 1
        // layout: "total, prev, pager, next",
      },
      option: {
        highlightCurrentRow: true,
        stripe: false,
        menu: false,
        border: false,
        page: true,
        index: true,
        indexLabel: this.$t("language.translation.tableNumber"),
        align: 'left',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t("language.translation.labelTagName"),
            prop: "mkName",
			sortable:true
          }
        ]
      }
    };
  },

  methods: {
    editDBLclick() {
      if(this.openDoubleClickEdit) {
        this.editForm()
      }
    },
    onPageLoad() {
		this.searchParam.limit=  this.page.currentPage
		this.searchParam.size=  this.page.pageSize
        this.getTranslation();
    //   this.getDataDictionary();
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "left" };
    },
    /* 获取字典数据 */
    getDataDictionary() {
      getDataDictionary().then(res => {		
        this.defaultTree = res.data.Row;
      });
    },
    handleEditAvueSth(){
        this.lgType = this.modulePermissionList.column.filter(o=>{return o.prop!='mkName'});
        this.lgType.forEach(item => {
          let F_Name = "language.languageCategory." + item.prop;
          const obj = {
            label: this.$t(F_Name),
            prop: item.prop,
			sortable:true
          };
          this.option.column.push(obj);
          this.mrule[item.prop] = [
            {
              required: true,
              message:
                this.$t("language.translation.hinrEnter") +this.$t(F_Name),
              trigger: "blur"
            }
          ];
          this.editrules[item.prop] = [
            {
              required: true,
              message:
                this.$t("language.translation.hinrEnter") +this.$t(F_Name),
              trigger: "blur"
            }
          ];
        });
    },
    /* 获取语言类型 */
    getTranslation() {
      getTranslation(this.searchParam).then(res => {
        this.translation = res.data.data.Rows;
		    this.page.total = res.data.data.Total;
      });
    },
    /* 单击行 */
    currentRow(row) {
      this.curId = row.id;
      this.translationForm = row;
    },
    /* 打开 */
    openDialog() {
      this.curId = "";
      this.dialogVisible = true;
      this.transForm = {};
      this.mapList = {};
    },
    /* 关闭 */
    closeDialog() {
      this.dialogVisible = false;
    },
    closeEditDialog() {
      this.editdialogVisible = false;
    },
    /* 提交 */
    submitForm(formName) {
      this.flagTranslation = true;
      let valid = "";
	  let obj={}
      this.$refs[formName].validate((val,object) => {
        valid = val;
		obj={...object}
      });
      if (!this.curId) {
        this.$refs["mapList"].validate((res,object) => {
          valid = valid && res;
          this.flagTranslation = valid;
		  obj={...object}
        });
      }
      if (valid) {
        if (!this.curId) {
          this.getTranslation();
          this.transForm.mapList = this.mapList;
          this.tapRepeat = this.translation.some(item => {
            return item.mkName == this.transForm.F_Name
          })
          // 判断tagname是否重复
          if(!this.tapRepeat){
              addTranslation(this.transForm).then(() => {
              this.dialogVisible = false;
              this.getTranslation();
            }).finally(() => {
              this.flagAddTranslation = false;
              this.flagTranslation = false;
            });
          } else{
            this.flagAddTranslation = false;
            this.$message({
              showClose: true,
              message: '标签重复，请重设',
              type: 'error'
            });
          }
          
        } else {
          this.flagAddTranslation = true;
          editTranslation(this.curId, this.translationForm).then(() => {
            this.editdialogVisible = false;
            this.getTranslation();
          }).finally(() => {
            this.flagAddTranslation = false;
            this.flagTranslation = false;
          });
        }
      }else{
		  formValidateNotice(obj,this,this.formEnCodeList)
	  }
    },
    /* 编辑 */
    editForm() {
      if (!this.curId) {
        this.$message({
          message: this.$t("language.translation.hintSelectData"),
          type: "warning"
        });
        return;
      }
      this.editdialogVisible = true;
    },
    /* 搜索 */
    search() {
		this.searchParam.limit= 1
      this.getTranslation(this.searchParam);
    },
    /* 搜索 表单重置 */
    searchReset() {
      this.searchParam.limit=  1
      this.searchParam.size=  this.page.pageSize
	  this.searchParam.keyword=""
      this.getTranslation();
    }
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
/deep/ .el-table td.is-center, /deep/ .el-table th.is-center{
	text-align: center!important;
}
</style>
