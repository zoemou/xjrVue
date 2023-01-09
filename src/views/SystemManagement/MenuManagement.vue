<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle" :resize="true">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 菜单树形 -->
        <el-tree
          :data="menuTree"
          :props="defaultProps"
          node-key="F_ModuleId"
          ref="cTree"
          :default-expanded-keys="expandedKey"
          :default-expand-all="false"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
               <i class="fa fa-list-ul"></i>
               <span>{{ data.F_FullName}}</span>
           </span>
        </el-tree>
      </div>
    </main-fixed>
    <main-content :paddingLeft="205" :padding-top="94">
      <div slot="search">
        <!-- 在此处放置搜索内容 -->
        <div class="search-box">
          <el-input
            v-model="keyword"
            size="small"
            :placeholder="$t('searchModule.searchPlaceholder')"
            style="width: 200px; margin-right: 5px"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchMenu"
            >{{ $t("searchModule.searchBtn") }}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{
            $t("searchModule.searchReset")
          }}</el-button>
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud ref="cuTable" :data="menuTable" :option="option" :showColumn="showColumn"
          :isSaveColumns="true" stripe @row-dblclick="handleRowDBLClick">
          <template slot="F_IsMenu_switch" slot-scope="scope">
            <avue-switch
              disabled
              active-color="#13ce66"
              inactive-color="#a29e9e"
              v-model="scope.row.F_IsMenu"
              :dic="swichDic"
            ></avue-switch>
          </template>

          <template slot="F_AllowExpand_switch" slot-scope="scope">
            <avue-switch
              disabled
              active-color="#13ce66"
              inactive-color="#a29e9e"
              v-model="scope.row.F_AllowExpand"
              :dic="swichDic"
            ></avue-switch>
          </template>

          <template slot="F_EnabledMark_switch" slot-scope="scope">
            <avue-switch
              disabled
              active-color="#13ce66"
              inactive-color="#a29e9e"
              v-model="scope.row.F_EnabledMark"
              :dic="swichDic"
            ></avue-switch>
          </template>

          <template  slot="menuLeft">
            <el-dialog
              v-dialogDrag
              :close-on-click-modal="false"
              :title="dialogTitle"
              :append-to-body="true"
              :visible.sync="dialogVisible"
              :before-close="handleClose"
              style="padding: 10px 20px;"
            >
              <el-steps
                :active="active"
                finish-status="success"
                simple
                style="margin-bottom: 10px;"
              >
                <el-step
                  :title="$t('menuManagement.addModal.stepOne')"
                ></el-step>
                <el-step
                  :title="$t('menuManagement.addModal.stepTwo')"
                ></el-step>
                <el-step
                  :title="$t('menuManagement.addModal.stepThree')"
                ></el-step>
                <el-step
                  :title="$t('menuManagement.addModal.stepFour')"
                ></el-step>
              </el-steps>
              <div class="baseinfo-form" v-show="active == 0">
                <el-form
                  :rules="rules"
                  ref="menuForm"
                  :model="menuForm"
                  label-width="72px"
                  :validate-on-rule-change="false"
                  v-if="dialogVisible"
                >
                  <el-row>
                    <el-col :span="12" >
                      <el-form-item
                        prop="F_EnCode"
                        :label="$t('menuManagement.addModal.labelNumber')"
                      >
                        <el-input
                          :placeholder="
                            $t('menuManagement.addModal.placeholderNumber')
                          "
                          size="small"
                          v-model="menuForm.F_EnCode"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_FullName"
                        :label="$t('menuManagement.addModal.labelName')"
                      >
                        <el-input
                          :placeholder="
                            $t('menuManagement.addModal.placeholderName')
                          "
                          size="small"
                          v-model="menuForm.F_FullName"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_SubSystemId"
                        :label="$t('menuManagement.addModal.labelSystem')"
                      >
                      <SelectionSystem   v-model="menuForm.F_SubSystemId" :isEdit="isEdit"  @changeSystem="changeSystem"></SelectionSystem>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop=""
                        :label="$t('menuManagement.addModal.labelSuperior')"
                        
                      >
                      <template v-if="allSystem.length">
                        <div
                          v-for="(item, idx) in allSystem"
                          :key="idx"
                        >
                          <avue-input-tree
                            default-expand-all
                            v-model="menuForm.F_ParentId"
                            :placeholder="
                              $t('menuManagement.addModal.placeholderSuperior')
                            "
                            type="tree"
                            :dic="defaultTree"
                            size="small"
                            style="width: 100%"
                            v-if="item.F_Id == menuForm.F_SubSystemId"
                          >
                          </avue-input-tree>
                        </div>
                      </template>
                        <avue-input-tree
                          default-expand-all
                          v-model="menuForm.F_ParentId"
                          :placeholder="
                            $t('menuManagement.addModal.placeholderSuperior')
                          "
                          type="tree"
                          :dic="defaultTree"
                          size="small"
                          style="width: 100%"
                          v-else
                        >
                        </avue-input-tree>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_Target"
                        :label="$t('menuManagement.addModal.labelTarget')"
                      >
                        <el-select
                          v-model="menuForm.F_Target"
                          :placeholder="
                            $t('menuManagement.addModal.placeholderTarget')
                          "
                          size="small"
                          style="width: 100%"
                        >
                          <el-option
                            :label="
                              $t(
                                'menuManagement.addModal.optionLabelParentMenu'
                              )
                            "
                            value="expand"
                          ></el-option>
                          <el-option
                            :label="
                              $t(
                                'menuManagement.addModal.optionLabelFunctionMenu'
                              )
                            "
                            value="iframe"
                          ></el-option>
                          <el-option
                            :label="
                              $t('menuManagement.addModal.optionLabelNewform')
                            "
                            value="open"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_SortCode"
                        :label="$t('menuManagement.addModal.labelSort')"
                      >
                        <el-input
                          type="number"
                          :placeholder="
                            $t('menuManagement.addModal.placeholderSort')
                          "
                          size="small"
                          v-model="menuForm.F_SortCode"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        prop="component"
                        :label="$t('menuManagement.addModal.labelFileAddress')"
                      >
                        <el-input
                          :placeholder="
                            $t('menuManagement.addModal.placeholderFileAddress')
                          "
                          size="small"
                          v-model="menuForm.component"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        prop="F_UrlAddress"
                        :label="$t('menuManagement.addModal.labelUrlAddress')"
                      >
                        <el-input
                          :placeholder="
                            $t('menuManagement.addModal.placeholderUrlAddress')
                          "
                          size="small"
                          v-model="menuForm.F_UrlAddress"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_LgMarkCode"
                        :label="$t('menuManagement.addModal.labelTransTag')"
                      >

                       <el-select
                            v-model="menuForm.F_LgMarkCode"                            
                            filterable
                            remote
                            reserve-keyword
                            :placeholder=" $t('menuManagement.addModal.placeholderTransTag')"
                            :remote-method="remoteMethod"
                            style="width:100%"
                            :loading="loading"
							clearable>
                            <el-option
                              v-for="item in transDefaultTree"
                              :key="item.F_Id"
                              :label="item.F_Name"
                              :value="item.F_EnCode">
                            </el-option>
                          </el-select>
                      </el-form-item>
                    </el-col>
					<el-col :span="12">
						<el-form-item prop="F_KeepAlive" :label="$t('whetherCache')">
							<el-radio v-model="menuForm.F_KeepAlive" :label="1">{{$t('workFlow.Process.radioYes')}}</el-radio>
							<el-radio v-model="menuForm.F_KeepAlive" :label="0">{{$t('workFlow.Process.radioNo')}}</el-radio>
						</el-form-item>
					</el-col>
                  </el-row>

                  <!-- <el-row>
                    <el-col :span="24">
                      <el-form-item
                        prop="F_LgMarkCode"
                        :label="$t('menuManagement.addModal.labelTransTag')"
                      >
                      </el-form-item>
                    </el-col>
                  </el-row> -->

                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        :label="$t('menuManagement.addModal.labelOptions')"
                      >
                        <el-checkbox v-model="menuForm.F_IsMenu">{{
                          $t("menuManagement.addModal.checkboxMenu")
                        }}</el-checkbox>
                        <el-checkbox v-model="menuForm.F_AllowExpand">{{
                          $t("menuManagement.addModal.checkboxOpen")
                        }}</el-checkbox>
                        <el-checkbox v-model="menuForm.F_EnabledMark">{{
                          $t("menuManagement.addModal.checkboxEffective")
                        }}</el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="F_Icon"
                        :label="$t('menuManagement.addModal.labelIcon')"
                      >
                        <el-input
                          :placeholder="
                            $t('menuManagement.addModal.placeholderIcon')
                          "
                          size="small"
                          v-model="menuForm.F_Icon"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-more"
                            @click="selectMoreIcon"
                          ></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        :label="$t('menuManagement.addModal.labelDescription')"
                        prop="F_Description"
                      >
                        <el-input
                          type="textarea"
                          :placeholder="
                            $t('menuManagement.addModal.placeholderDescription')
                          "
                          size="small"
                          :autosize="{ minRows: 4, maxRows: 10 }"
                          maxlength="800"
                          show-word-limit
                          v-model="menuForm.F_Description"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="buttoninfo-form" v-if="active == 1">
                <avue-crud
                  ref="buttonTable"
                  :data="buttonTable"
                  :option="buttonOption"
                  stripe
                  @row-save="handleSave"
                  @row-update="handleUpdate"
                  @row-del="rowDel"
                  @sortable-change="sortableChange"
                >
                </avue-crud>
              </div>
              <div class="tableinfo-form" v-if="active == 2">
                <avue-crud
                  ref="tableInfo"
                  :data="tableInfo"
                  :option="tableInfoOption"
                  stripe
                  @row-save="handleSave"
                  @row-update="handleUpdate"
                  @row-del="rowDel"
                  @sortable-change="sortableChange"
                >
                </avue-crud>
              </div>
              <div class="forminfo-form" v-if="active == 3">
                  <avue-crud
                  v-if="showActive3"
                  ref="formInfo"
                  :data="formInfo"
                  :option="formInfoOption"
                  stripe
                  @row-save="handleSave"
                  @row-update="handleUpdate"
                  @row-del="rowDel"
                  @sortable-change="sortableChange"
                >
                </avue-crud>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button
                  size="mini"
                  type="primary"
                  @click="prev()"
                  v-if="active != 0 && menuForm.F_Target != 'expand'"
                  >{{ $t("menuManagement.addModal.previousBtn") }}</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="next()"
                  v-if="active != 3 && menuForm.F_Target != 'expand'"
                  >{{ $t("menuManagement.addModal.nextStepBtn") }}</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="userFormSubmit()"
                  :loading="flagComplete"
                  >
                  {{flagComplete?$t('workFlow.WFMenu.hintSubmit'):$t('menuManagement.addModal.completeBtn')}}
                  </el-button
                >
              </span>
            </el-dialog>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="openForm()"
			  v-if="hasButtonPermission('add')"
              >{{ $t("buttonModule.addBtn") }}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">	
            <el-button
              type="opr-primary"
              size="mini"
              v-if="!scope.row.isChildSys&&hasButtonPermission('modify')"
              @click="editForm(scope.row, scope.index)"
              >{{ $t("tableOperationModule.editorBtn") }}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              v-if="!scope.row.isChildSys&&hasButtonPermission('delete')"
              @click="deleteForm(scope.row, scope.index)"
              >{{ $t("tableOperationModule.deleteBtn") }}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="$t('menuManagement.addModal.iconModal.modalTitle')"
      :append-to-body="true"
      :visible.sync="IconVisible"
      width="80%"
      :before-close="(done)=>{done()}"
      style="padding: 10px 20px;"
    >
      <FontHtml v-on:childByValue="childByValue"></FontHtml>
    </el-dialog>
  </div>
</template>

<script>
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import { FormatMenuTree, FormatTree,LanguageFormatTree } from "../../util/util.js";
import FontHtml from "../FontAwesome.vue";
import {
  getMenuTree,
  deleteMenu,
  getMenuInfo,
  getMenuButton,
  getMenuForm,
  getMenuColumns,
  postMenu,
  modifyMenu,
  getMenuTreeBySystem
} from "@/api/systemManagement/menu";
  import SelectionSystem from '@/components/common/SelectionSystem';
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/index";
import { baseUrl } from "@/config/env";
import { getLgMarkList } from "@/api/language/translation";
import {S4} from '@/config/fn';
import {validateLength,validateDesLength,validateGap} from "@/api/organization/validateFunc";
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
export default {
  name: "MenuManagement",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent, MainFixed, FontHtml,SelectionSystem},
  data() {
    return {
      isEdit:false,
      flagComplete: false,
      fixedTitle: this.$t("menuManagement.fixedTitle"),
      menuTree: [],
      defaultTree: [], //对树数据的处理
      transDefaultTree: [],
      menuTable: [],
      defaultTable: [], //保存表格副本，搜索重置时用于还原
      flag: false,
      active: 0,
      IconVisible: false,
      menuForm: {
        F_EnCode: "",
        F_ModuleId: "",
        F_ParentId: "",
        F_Icon: "",
        F_LgMarkCode: "",
        component: "", // 文件地址
        F_AllowExpand: false,
        F_EnabledMark: true,
        F_IsMenu: true,
        F_Target: "",
        F_IsPublic: 0,
        F_FullName: "",
        children: [],
        F_Description: "",
        F_SubSystemId: "0",
		F_KeepAlive:0
      },
      F_ModuleId: "",
      expandedKey: [],
      keyword: null,
      defaultProps: {
        children: "children",
        label: "F_FullName"
      },
      dialogVisible: false,
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: false,
        index: true,
        indexLabel: this.$t("menuManagement.tableNumber"),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t("menuManagement.tableCode"),
            prop: "F_EnCode",
			align:'left',
			overHidden:true
          },
          {
            sortable: true,
            label: this.$t("menuManagement.tableName"),
            prop: "F_FullName",
			align:'left',
			overHidden:true
          },
          {
            sortable: true,
            label: this.$t("menuManagement.tableFileAddress"),
            prop: "component",
            minWidth: "95",
			align:'left',
			overHidden:true
          },
          {
            sortable: true,
            label: this.$t("menuManagement.tableUrlAddress"),
            prop: "F_UrlAddress",
            minWidth: "95",
			align:'left',
			overHidden:true
          },
          {
            sortable: true,
            label: this.$t("menuManagement.tableSystem"),
            width: "100",
            prop: "F_SubSystemName",
			align:'left',
			overHidden:true
          },
          {
            label: this.$t("menuManagement.tableTarget"),
            prop: "F_Target",
            width: "90",
			align:'left',
			overHidden:true
          },
          {
            label: this.$t("menuManagement.tableMenu"),
            prop: "F_IsMenu_switch",
            width: "65",
            slot: true,
			overHidden:true
          },
          {
            label: this.$t("menuManagement.tableOpen"),
            prop: "F_AllowExpand_switch",
            width: "65",
            slot: true,
			overHidden:true
          },
          {
            label: this.$t("menuManagement.tableEffective"),
            prop: "F_EnabledMark_switch",
            width: "65",
            slot: true,
			overHidden:true
          },
          {
            label: this.$t("menuManagement.addModal.labelTransTag"),
            prop: "F_LgMarkName",
            width: "100",
			align:'left',
			overHidden:true
          },
          {
            label: this.$t("menuManagement.tableDescription"),
            prop: "F_Description",
			align:'left',
			overHidden:true
          }
        ]
      },
      rules: {
        F_SubSystemId: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderSystem"),
            trigger: "blur"
          }
        ],
        F_EnCode: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderNumber"),
            trigger: "blur"
          },
          {
            validator: validateLength,
            trigger:'change'
          }
        ],
        F_FullName: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderName"),
            trigger: "blur"
          },
          {
            validator: validateLength,
            trigger:'change'
          }
        ],
        F_Target: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderTarget"),
            trigger: "change"
          }
        ],
        F_SortCode: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderSort"),
            trigger: "blur"
          },
          {
            validator:validateGap,
            trigger:'change'
          }
        ],
        component: [
          {
            validator: validateLength,
            trigger:'change'
          }
        ],
        F_UrlAddress: [
          {
            required: true,
            message: this.$t("menuManagement.addModal.placeholderUrlAddress"),
            trigger: "blur"
          }
        ],
        F_Description: [
          {
             validator: validateDesLength,
             trigger:'change'
          }
        ]
      },
      swichDic: [
        {
          label: "",
          value: 0
        },
        {
          label: "",
          value: 1
        }
      ],
      buttonTable: [],
      buttonOption: {
		  dialogDrag:true,
        columnBtn: false,
        sortable: true,
        dragHandler: true,
        highlightCurrentRow: true,
        stripe: false,
        maxHeight: 360,
        border: true,
        page: false,
        index: false,
        align: "center",
        refreshBtn: false,
        column: [
          {
            label: this.$t("menuManagement.editModal.tabName"),
            prop: "F_FullName",
            rules: [{validator:validateLength,trigger:'change'}]
          },
          {
            label: this.$t("menuManagement.editModal.tabCode"),
            prop: "F_EnCode",
            rules: [{validator:validateLength,trigger:'change'}]
          },
          {
            label: this.$t("menuManagement.addModal.labelTransTag"),
            prop: "F_LgMarkCode",
		  formatter:function(row){
			  return row.F_LgMarkName
		  },
            type: "select",
            remote:true,
            dicFlag:false,
            dicUrl: baseUrl + '/lg-mark?keyword={{key}}',
            props:{
              label : "F_Name",
              value : "F_EnCode",
            }
          }
        ]
      },
      tableInfo: [],
      tableInfoOption: {
		  dialogDrag:true,
        columnBtn: false,
        sortable: true,
        dragHandler: true,
        highlightCurrentRow: true,
        stripe: false,
        maxHeight: 360,
        border: true,
        page: false,
        index: false,
        align: "center",
        refreshBtn: false,
        column: [
          {
            label: this.$t("menuManagement.editModal.tabName"),
            prop: "F_FullName",
            rules: [{validator:validateLength,trigger:'change'}]
          },
          {
            label: this.$t("menuManagement.editModal.tabCode"),
            prop: "F_EnCode",
            rules: [{validator:validateLength,trigger:'change'}]
          },
          {
          label: this.$t("menuManagement.addModal.labelTransTag"),
            prop: "F_LgMarkCode",
			  formatter:function(row){
				  return row.F_LgMarkName
			  },
            type: "select",
            remote:true,
            dicUrl: baseUrl + '/lg-mark?keyword={{key}}',
            dicFlag:false,
            props:{
              label : "F_Name",
              value : "F_EnCode",
            }
          }
        ]
      },
      showActive3:true,
      formInfo: [],
      formInfoOption: {
		  dialogDrag:true,
        columnBtn: false,
        sortable: true,
        dragHandler: false,
        highlightCurrentRow: true,
        stripe: false,
        maxHeight: 360,
        border: true,
        page: false,
        index: false,
        align: "center",
        refreshBtn: false,
		defaultExpandAll:true,
		rowKey:'F_ModuleFormId',
        column: []
      },
      dialogTitle: this.$t("menuManagement.editModal.dialogTitle")
    };
  },
  created() {
    this.getMenuTree();
    // this.getDataDictionary();
  },
  computed: {
    ...mapGetters(["allSystem", "systemId", "markList"])
  },
  mounted() {},
  methods: {
    async changeSystem(systemId){
      let res = await getMenuTreeBySystem(systemId);
      let { code, data } = res.data;
      code ||
        (this.defaultTree = FormatMenuTree(
          data,
          "F_ModuleId",
          "F_FullName",
          "children",
          ''
        ));
    },
    toggleSystem(systemId, parentId,moduleId) {
      systemId = systemId || "0";
      parentId = parentId || "";
      this.menuForm.F_SubSystemId = systemId;
      getMenuTreeBySystem(systemId).then(res => {
        let { code, data } = res.data;
				let id=moduleId&&moduleId==this.F_ModuleId?moduleId:''
        code ||
          (this.defaultTree = FormatMenuTree(
            data,
            "F_ModuleId",
            "F_FullName",
            "children",
						id
          ));
        this.menuForm.F_ParentId = parentId;
      });
    },
    /* 获取菜单树形数据 */
    getMenuTree() {
      getMenuTree().then(res => {
        let allMenu = res.data.data || null;
        if (!allMenu) return;
        this.menuTree = allMenu.mainSystemModuleList;
        allMenu.subSystemModuleList?.map(item => {
          item["F_FullName"] = item.F_Name;
          item["id"] = item.F_Id;
		  item['isChildSys']=true;
        });
        if (allMenu?.subSystemModuleList?.length) {
          let subMenu = {
            F_FullName: "子系统",
            children: allMenu.subSystemModuleList,
			isChildSys:true
          };
          this.menuTree.push(subMenu);
        }
				this.F_ModuleId =this.F_ModuleId || allMenu.mainSystemModuleList[0].F_ModuleId;
        this.defaultTree = FormatTree(
          allMenu.mainSystemModuleList,
          "F_ModuleId",
          "F_FullName",
          "children"
        );

        
        this.handleNodeClick(this.findMenu(this.menuTree, this.F_ModuleId));
        /* 左侧树形菜单默认选中第一个 */
        this.$nextTick(function() {
          this.$refs.cTree.setCurrentKey(this.F_ModuleId);
        });
      });
    },
    /* 选择树形菜单加载菜单信息 */
    handleNodeClick(data) {
      if(!data.children) data.children = [];
      var obj = Object.assign({}, data);
      var temp = deepClone([...data.children]);
      temp.unshift(obj);
      for (var i = 0; i < temp.length; i++) {
        temp[i].children = [];
      }
      this.menuTable = temp;
      this.defaultTable = temp;
      this.keyword = null;
      this.F_ModuleId = data.F_ModuleId;
    },
    nodeExpand(data, node) {
      this.expandedKey.push(data.F_ModuleId);
    },
    nodeCollapse(data) {		
		this.filterKey(data)
    },
	filterKey(data){
		this.expandedKey=this.expandedKey.filter(o => {
			return o != data.F_ModuleId;
		});
		if(data.children?.length>0){
			data.children.forEach(it=>{
				this.filterKey(it)
			})
		}
	},
    getMenu(data) { 
			if(data===''||data===null){return;}
      var tempData = [...this.menuTable];
      this.menuTable = tempData.filter(function(item) {
        if (!item.component) item.component = "";
        if (
          item.F_FullName.indexOf(data) >= 0 ||
          item.component.indexOf(data) >= 0
        ) {
          //||item.F_EnCode.indexOf(data)>=0
          return item;
        }
      });
    },
    /* 新增菜单*/
    openForm() {
      if (this.$refs["menuForm"] !== undefined) {
        this.$refs["menuForm"].resetFields();
      }
      this.isEdit = false;
      this.flag = true;
      this.menuForm = {
        F_EnCode: "",
        F_ModuleId: "",
        F_ParentId: "",
        F_Icon: "",
        F_LgMarkCode: "",
        component: "", // 文件地址
        F_AllowExpand: false,
        F_EnabledMark: true,
        F_IsMenu: true,
        F_Target: "",
        F_IsPublic: 0,
        F_FullName: "",
        children: [],
        F_Description: "",
        F_SubSystemId: "0",
		F_KeepAlive:0
      };
      this.menuForm.F_IsMenu = true;
      this.menuForm.F_AllowExpand = false;
      this.menuForm.F_EnabledMark = true;
      this.menuForm.F_ModuleId = "";
      this.dialogVisible = true;
      this.dialogTitle = this.$t("menuManagement.addModal.modalTitle");
      this.active = 0;
      this.buttonTable = [];
      this.formInfo = [];
      this.tableInfo = [];
      // let systemId = this.allSystem[0]?.F_Id || "0";
      // this.toggleSystem(systemId, "");
    },
    /* 提交表单 */
    userFormSubmit(formName) {
      this.flagComplete = true;
      this.$refs["menuForm"].validate(valid => {
        if (valid) {
          this.menuForm.F_IsMenu = this.menuForm.F_IsMenu ? 1 : 0;
          this.menuForm.F_AllowExpand = this.menuForm.F_AllowExpand ? 1 : 0;
          this.menuForm.F_EnabledMark = this.menuForm.F_EnabledMark ? 1 : 0;
          this.menuForm.F_component = this.menuForm.component;
          var submitObj = {
            module: this.menuForm,
            buttonModule: this.buttonTable,
            columnModule: this.tableInfo,
            formModule: this.formInfo
          };
          if (this.flag) {
            postMenu(submitObj).then((res) => {
              this.dialogVisible = false;
              this.getMenuTree();
							if(res.data.success){
								this.showMessage('add','ok')
							}else{
								this.showMessage('add','no')
							}
            }).finally(() => {
              this.flagComplete = false;
            }).catch(()=>{
								this.showMessage('add','no')
							});
          } else {
            modifyMenu(this.menuForm.F_ModuleId, submitObj).then((res) => {
              this.dialogVisible = false;
              this.getMenuTree();
							if(res.data.success){
								this.showMessage('edit','ok')
							}else{
								this.showMessage('edit','no')
							}
            }).finally(() => {
              this.flagComplete = false;
            }).catch(()=>{
								this.showMessage('edit','no')
							});
          }
        } else {
          this.$message(
            this.flag
              ? this.$t("menuManagement.hintAddFailed")
              : this.$t("menuManagement.hintEditFailed")
          );
          this.flagComplete = false;
          return false;
        }
      });
    },
		showMessage(type,status){
			let msg=type=='add'?
			(status=='ok'?this.$t('addedMenuSucceeded'):this.$t('newMenuFailed')):
			(status=='ok'?this.$t('modifyMenuSuccessfully'):this.$t('failedToModifyMenu'))
			this.$notify({
				title:this.$t('deletePrompt.successTitle'),
				message:msg,
				type:status=='ok'?'success':'error'
			});
		},
    /* 关闭弹窗 */
    handleClose(done) {
      this.flagComplete = false;
      if (this.$refs["menuForm"]) this.$refs["menuForm"].resetFields();
      done();
    },
    handleRowDBLClick (row, event) {
      if(this.openDoubleClickEdit){
        this.editForm(row)
      }
    },
    /* 表格编辑 */
    async editForm(row, index) {
      this.isEdit = true;
      this.flag = false;
      this.active = 0;
      this.dialogTitle = this.$t("menuManagement.editModal.modalTitle");
     
      /* if (this.$refs['menuForm']!==undefined) {
            this.$refs['menuForm'].resetFields();
        } */
	  if(row.F_LgMarkCode){
	  	this.transDefaultTree=[{
	  	  F_Id:row.F_LgMarkCode,
	  	  F_EnCode:row.F_LgMarkCode,
	  	  F_Name:row.F_LgMarkName
	  	}];
	  }
      let res = await getMenuInfo(row.F_ModuleId)
      // .then(res => {
        if (res.data.success) {
          var val = res.data.data;
          val.F_IsMenu = val.F_IsMenu ? true : false;
          val.F_AllowExpand = val.F_AllowExpand ? true : false;
          val.F_EnabledMark = val.F_EnabledMark ? true : false;
          val.F_ParentId = val.F_ParentId ? val.F_ParentId : "";
          val.F_Icon = val.F_Icon ? val.F_Icon : "";
          val.F_ModuleId = row.F_ModuleId;
          val.F_LgMarkCode = val.F_LgMarkCode ? val.F_LgMarkCode : "";
		  val.F_KeepAlive = val.F_KeepAlive ? val.F_KeepAlive : 0;
          this.menuForm = val;
          this.menuForm.F_SubSystemId = row.F_SubSystemId;
          this.menuForm.F_ParentId = row.F_ParentId;
          this.toggleSystem(row?.F_SubSystemId, row?.F_ParentId,row.F_ModuleId);
        }
      // });
      this.dialogVisible = true;
      getMenuButton(row.F_ModuleId).then(res => {
        if (res.data.success) {
          this.buttonTable = [...res.data.data];
          this.buttonTable.forEach(it => {
            it.F_LgMarkCode = it.F_LgMarkCode ? it.F_LgMarkCode : "";
			it.F_FullName=this.$t(it.F_FullName)
          });
        }
      });
      getMenuForm(row.F_ModuleId).then(res => {
        if (res.data.success) {
          this.formInfo = res.data.data;
          this.formInfo.forEach(it => {
            it.F_LgMarkCode = it.F_LgMarkCode ? it.F_LgMarkCode : "";
          });
        }
      });
      getMenuColumns(row.F_ModuleId).then(res => {
        if (res.data.success) {
          this.tableInfo = res.data.data;
          this.tableInfo.forEach(it => {
            it.F_LgMarkCode = it.F_LgMarkCode ? it.F_LgMarkCode : "";
          });
        }
      });
     
    },
    /* 表格删除 */
    deleteForm(row, index) {
      this.$confirm(
        this.$t("deletePrompt.promptContent"),
        this.$t("deletePrompt.promptTitle"),
        {
          confirmButtonText: this.$t("buttonModule.modalSureBtn"),
          cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          deleteMenu(row.F_ModuleId).then(() => {
            this.getMenuTree();
            this.$notify({
              title: this.$t("deletePrompt.successTitle"),
              message: this.$t("deletePrompt.successDeleted"),
              type: "success"
            });
			this.F_ModuleId=""
          });
        })
        .catch(() => {});
    },

    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      /* if(this.flag){
          this.buttonTable=[];
          this.formInfo=[];
          this.tableInfo=[];
        } */
      if (this.active == 0) {
        this.$refs["menuForm"].validate(valid => {
          if (valid) {
            this.active++;
          }
        });
      } else {
        if (this.active++ > 3) this.active = 0;
      }
      if(this.active == 3){
        this.initFormColumn();
    }

    },
    /* 查询 */
    searchMenu() {
      this.getMenu(this.keyword);
    },
    /* 查询表单重置 */
    searchReset() {
      this.keyword = null;
      this.menuTable = [...this.defaultTable];
    },
    initFormColumn(){
      this.formInfoOption.column = [];
      let parentIdList = [
          {label:this.$t('mobileDev.functionDesignStepTwo.tabParentName'),value:"0"},
        ];
         this.formInfo.forEach(element => {
			if(element?.children?.length>0 ){
			  parentIdList.push({
				label:this.$t('subtable')+element.F_FullName,
				value:element.F_ModuleFormId
			  });
		    }
        });
        this.formInfoOption.column = [
        {
          label: this.$t("menuManagement.editModal.tabName"),
          prop: "F_FullName",
          rules: [{validator:validateLength,trigger:'change'}]
        },
        {
          label: this.$t("menuManagement.editModal.tabCode"),
          prop: "F_EnCode",
          rules: [{validator:validateLength,trigger:'change'}]
        },
        {
          label: this.$t('upperLevel'),
          prop: "F_ParentId",
          type: "select",
          dicData:parentIdList
        },
        {
        label: this.$t("menuManagement.addModal.labelTransTag"),
          prop: "F_LgMarkCode",
		  formatter:function(row){
			  return row.F_LgMarkName
		  },
          type: "select",
          remote:true,
          dicUrl: baseUrl + '/lg-mark?keyword={{key}}',
          dicFlag:false,
          props:{
            label : "F_Name",
            value : "F_EnCode",
          }
        }
      ]
    },
    rowDel(form, index) {
      if (this.active == 1) {
        this.buttonTable.splice(index, 1);
      } else if (this.active == 2) this.tableInfo.splice(index, 1);
      else if (this.active == 3) {
        this.showActive3 = true;
       if(form['$index'] !== undefined){
        //删除一级目录
        let parentIndex = form['$index'];
        this.formInfo.splice(parentIndex, 1);
      }else{
        this.formInfo.forEach((ele,parentIndex) => {
          if(ele.F_ModuleFormId==form.F_ParentId){
              if(ele.children&&ele.children.length>0){
                  ele.children.forEach((ele2,i) => {
                    if(ele2.F_ModuleFormId==form.F_ModuleFormId){
                     ele.children.splice(i, 1);
                    }
                  });
              }  
          }
        });
      }
      this.initFormColumn();
      }
    },
    guid () {
      return (S4() + S4() + S4() + S4() + S4() + S4());
    },
    async handleSave(form, done, loading) {	
		if(form.F_LgMarkCode){
			let res=await getLgMarkList({
			  keyword:form.F_LgMarkCode
			})
			form.F_LgMarkName=res?.data?.data[0]?.F_Name;
		}
      if (this.active == 1) {
        form.F_ModuleButtonId = "";
        this.buttonTable.push(form);
      } else if (this.active == 2) {
        form.F_ModuleColumnId = "";
        this.tableInfo.push(form);
      } else if (this.active == 3) {
       form.F_ModuleFormId ="";
		this.showActive3 = true;
	  if (form.F_ParentId!='0') {	
		  if(form.F_ParentId===''||form.F_ParentId===null){
			  form.F_ModuleId = this.F_ModuleId;
			  let id = this.guid();
			  form.id = id; 
			  form.F_ModuleFormId = id;
			  form.F_ParentId='0';
			  this.formInfo.push(form);
		  }else{
			  this.formInfo.forEach((ele, i) => {
			    if (ele.F_ModuleFormId == form.F_ParentId) {
			      let temp = {
			        ...form,
			        F_ModuleFormId: this.guid(),
			        F_ModuleId: ele.F_ModuleId,
			        F_SortCode: null,
			        F_LgMarkCode: null,
			        id: this.guid()
			      };
			      if(this.formInfo[i].children){
			        this.formInfo[i].children.push(temp);
			      }else{
			        this.formInfo[i].children = [];
			        this.formInfo[i].children.push(temp);
			      }
			      
			    }
			  });
		  }
        
      } else {
        form.F_ModuleId = this.F_ModuleId;
        let id = this.guid();
        form.id = id; 
        form.F_ModuleFormId = id;
		form.F_ParentId='0';
        this.formInfo.push(form);
      }
       this.initFormColumn();
      }
      done();
    },
    async handleUpdate(form, index, done, loading) {
		if(form.F_ModuleFormId==form.F_ParentId&&form.F_ParentId&&this.active == 3){
			this.$message({
				message:this.$t('upperLevelCannotChooseMyself'),
				type: 'warning'
			});
			setTimeout(()=>{
				loading()
			},1000)
			return;
		} 
		if(form.F_LgMarkCode){
			let res=await getLgMarkList({
			  keyword:form.F_LgMarkCode
			})
			form.F_LgMarkName=res?.data?.data[0]?.F_Name;
		}
      if (this.active == 1) {
        this.buttonTable.splice(index, 1, form);
      } else if (this.active == 2) this.tableInfo.splice(index, 1, form);
      else if (this.active == 3) {
        this.showActive3 = true;
		
        this.formInfo.forEach((ele,parentIndex) => {
          if(ele.F_ModuleFormId==form.F_ModuleFormId){
              if(ele.children&&ele.children.length>0){
				  form.children=ele.children
                  this.formInfo.splice(parentIndex, 1, form);
              }else{				  
				  if(form.F_ParentId!='0'){
					  if(form.F_ParentId===''||form.F_ParentId===null){
						  form.F_ParentId='0';
						  this.formInfo.splice(parentIndex, 1, form);
					  }else{
						  let idx=this.formInfo.findIndex(o=>{return o.F_ModuleFormId==form.F_ParentId})
						  if(idx>=0){
							  this.formInfo[idx].children.push(form)
							  this.formInfo.splice(parentIndex,1)
						  }							  
					  }					  		  
				  }else{
					  this.formInfo.splice(parentIndex, 1, form);
				  }
				  
			  } 
          }else if(ele.children&&ele.children.length>0){
			  ele.children.forEach((chi,cParentIndex) => {
				  if(chi.F_ModuleFormId==form.F_ModuleFormId){
					  this.formInfo.push(form)
					  ele.children.splice(cParentIndex,1)
				  }
			  })
		  }
        });
		this.initFormColumn();
      }
      done();
    },
    sortableChange(oldindex, newindex, row, list) {
      if (this.active == 1) {
        this.buttonTable = [];
        this.$nextTick(() => {
          this.buttonTable = list;
        });
      } else if (this.active == 2) {
        this.tableInfo = [];
        this.$nextTick(() => {
          this.tableInfo = list;
        });
      } else if (this.active == 3) {
        this.formInfo = [];
        this.$nextTick(() => {
          this.formInfo = list;
        });
      }
    },
    selectMoreIcon() {
      this.IconVisible = true;
    },
    childByValue: function(childValue) {
      // childValue就是子组件传过来的值
      this.menuForm.F_Icon = childValue;
      this.IconVisible = false;
    },
    getInputTreeData(e) {
      let obj = this.findMenu(this.menuTree, e);
    },
    findMenu(arry = [], id) {
      if(!arry || !Array.isArray(arry)) return
      let obj = {};
      arry.forEach(item => {
        if (item?.F_ModuleId == id) {
          obj = item;
        } else {
          let o = this.findMenu(item?.children, id);
          if (JSON.stringify(o) != "{}") {
            obj = o;
          }
        }
      });
      return obj;
    },
        /* 获取翻译标记 */ 
    remoteMethod(query) {
      const searchObj = {
        keyword:query
      }
      getLgMarkList(searchObj).then(res => {
      
        this.transDefaultTree = res.data.data;
       
      });
    },
  }
};
</script>

<style scoped>
div /deep/ .el-checkbox__label {
  font-size: 12px;
}
/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}

@media screen and (max-width: 1370px) {
  div/deep/ .el-dialog {
    margin-top: 5vh !important;
  }
}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i,div /deep/ .el-radio__label{
	font-size: 12px;
}
</style>
