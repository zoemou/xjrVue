<template>
  <div class="main-container">
    <main-fixed :title="fixedTitle">
      <div slot="list">
        <!-- 在此处放置左侧列表内容 -->
        <!-- 区域树形菜单 -->
        <el-tree
          ref="cTree"
          node-key="F_AreaId"
          :props="props"
          :load="loadNode"
          lazy
          accordion
          @node-click="handleNodeClick"
        >
		<span class="custom-tree-node" slot-scope="{ data }">
	      <i class="el-icon-location-outline"></i>
        <span>{{ data.F_AreaName}}</span>
    </span>
        </el-tree>
      </div>
    </main-fixed>
    <main-content
      :title="contentTitle"
      :paddingLeft="205"
      :padding-top="94"
    >
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
            @click="changeTableData"
            >{{$t('searchModule.searchBtn')}}</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="searchReset"
            >{{$t('searchModule.searchReset')}}</el-button
          >
        </div>
      </div>
      <div slot="table">
        <!-- 在此处放置表格内容 -->
        <!-- 表格 -->
        <avue-crud ref="cuTable" :data="areaTable" :option="option" :showColumn="showColumn"
          :isSaveColumns="true" stripe @row-dblclick="handleRowDBLClick">
          <template slot="menuLeft">
            <el-dialog v-dialogDrag
              :close-on-click-modal="false"
              :title="dialogTitle"
              :append-to-body="true"
              :visible.sync="dialogVisible"
              width="40%"
              :before-close="handleClose"
              style="padding: 10px 20px;"
            >
              <div class="companiesuser-form" v-if="dialogVisible">
                <el-form
                  :rules="rules"
                  ref="areaForm"
                  :model="areaForm"
                  label-width="50px"
                  :validate-on-rule-change="false"
                >
                  <el-row v-show="hasFormPermission('F_AreaCode')">
                    <el-col :span="24">
                      <el-form-item prop="F_AreaCode" :label="$t('areaManager.tableAreaCode')">
                        <el-input
                          :placeholder="$t('areaManager.addModal.placeholderNumber')"
                          size="small"
                          v-model="areaForm.F_AreaCode"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-show="hasFormPermission('F_AreaName')">
                    <el-col :span="24">
                      <el-form-item prop="F_AreaName" :label="$t('areaManager.addModal.labelName')">
                        <el-input
                          :placeholder="$t('areaManager.addModal.placeholderName')"
                          size="small"
                          v-model="areaForm.F_AreaName"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-show="hasFormPermission('F_SimpleSpelling')">
                    <el-col :span="24">
                      <el-form-item prop="F_SimpleSpelling" :label="$t('areaManager.addModal.labelSimpleSpelling')">
                        <el-input
                          :placeholder="$t('areaManager.addModal.placeholderSimpleSpelling')"
                          size="small"
                          v-model="areaForm.F_SimpleSpelling"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" v-show="hasFormPermission('F_SortCode')">
                      <el-form-item prop="F_SortCode" :label="$t('areaManager.addModal.labelSort')">
                        <el-input
                          :placeholder="$t('areaManager.addModal.placeholderSort')"
                          size="small"
                          type="number"
                          v-model="areaForm.F_SortCode"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" v-show="hasFormPermission('F_Description')">
                      <el-form-item :label="$t('areaManager.addModal.labelRemark')" prop="F_Description">
                        <el-input
                          type="textarea"
                          :placeholder="$t('areaManager.addModal.placeholderRemark')"
                          size="small"
                          v-model="areaForm.F_Description"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancelForm('areaForm')"
                  >{{$t('buttonModule.modalCancelBtn')}}</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="areaFormSubmit('areaForm')"
                  :loading="flagAreaManager"
                  >{{flagAreaManager?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button
                >
              </span>
            </el-dialog>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="openForm('areaForm')"
              v-if="hasButtonPermission('add')"
              >{{$t('buttonModule.addBtn')}}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="opr-primary"
              size="mini"
              @click="editForm(scope.row, scope.index)"
              v-if="hasButtonPermission('modify')"
              >{{$t('tableOperationModule.editorBtn')}}</el-button
            >
            <el-button
              type="opr-danger"
              size="mini"
              @click="deleteForm(scope.row, scope.index)"
              v-if="hasButtonPermission('delete')"
              >{{$t('tableOperationModule.deleteBtn')}}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </main-content>
  </div>
</template>

<script>
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import {formValidateNotice} from "@/util/util";
import {
  getProvinceTree,
  getAreasChild,
  postArea,
  modifyArea,
  deleteArea
} from "@/api/systemManagement/area";
import {validateLength,validateDesLength} from "@/api/organization/validateFunc";
export default {
  name: "AreaManager",
  mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
  components: { MainContent, MainFixed },
  data() {
    const sortReg = /^[0-9]{1,10}$/;
    var sortValidate = (rule,value,callback) => {
      if(!sortReg.test(value)&&value){
        callback(new Error('不能超过10个字符'));
      }else{
        callback();
      }
    };
    return {
      flagAreaManager: false,
	  computedHeight:-60,
      fixedTitle: this.$t('areaManager.fixedTitle'),
      dialogTitle: "",
      props: {
        label: "F_AreaName",
        children: "zones",
        isLeaf: "leaf"
      },
      areaTable: [],
      flag: false,
	  F_Layer:1,
      areaForm: {
        F_AreaCode: "",
        F_AreaName: "",
        F_SortCode: "",
        F_Description: "",
        F_AreaId: "",
		F_Layer:1,
        F_ParentId: 0
      },
      level: 1,
      F_AreaId: 0,
      F_AreaName: "中国",
      keyword: null,
      dialogVisible: false,
      option: {
        highlightCurrentRow: true,
        stripe: false,
        addBtn: false,
        menuWidth: 150,
        border: false,
        page: false,
        index: true,
        indexLabel:this.$t('areaManager.tableNumber'),
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            sortable: true,
            label: this.$t('areaManager.tableAreaCode'),
            prop: "F_AreaCode",
			align:'left'
          },
          {
            sortable: true,
            label: this.$t('areaManager.tableName'),
            prop: "F_AreaName",
			align:'left'
          },
          {
            sortable: true,
            label: this.$t('areaManager.tableSimpleSpelling'),
            prop: "F_SimpleSpelling",
			align:'left'
          },
          {
            label:this.$t('areaManager.tableLevel'),
            prop: "F_Layer",sortable: true,
            formatter:function(row){
              let title = '级别';
              switch (row.F_Layer) {
                case 1:
                  title="省";
                  break;
               case 2:
                  title="市";
                  break;
               case 3:
                  title="区";
                  break;
              
                default:
                  break;
              }
              return title;
            }
          },
          {
            label: this.$t('areaManager.tableRemark'),
            prop: "F_Description",sortable: true,
			align:'left'
          }
        ]
      },
      rules: {
        F_AreaCode: [
          { required: true, message:this.$t('areaManager.addModal.placeholderNumber'), trigger: "blur" },
          { validator:validateLength,trigger:'change'}
        ],
        F_AreaName: [
          { required: true, message:this.$t('areaManager.addModal.placeholderName'), trigger: "blur" },
          { validator: validateLength,trigger:'change'}
        ],
        F_SimpleSpelling:[
          { validator: validateLength,trigger:'change'}
        ],
        F_SortCode: [{ required: true, message:this.$t('areaManager.addModal.placeholderSort'), trigger: "blur" },
          { validator:sortValidate,trigger:'change'}
        ],
        F_Description:[
          { validator: validateDesLength,trigger:'change'}
        ]
      },
      node_had:[],
      resolve_had:[]
    };
  },
  computed: {
    contentTitle() {
      let fullname = "区域信息 - "+ this.F_AreaName;
      return fullname
    }
  },
  created() {
    this.$nextTick(function() {
      this.$refs.cTree.setCurrentKey("0");
      this.changeTableData();
    });
  },
  methods: {
    handleRowDBLClick (row, event) {
    if(this.openDoubleClickEdit){
      this.editForm(row)
    }
  },
    loadNode(node, resolve) {
      let { level } = node;
      let value = node.data?.F_AreaId;
      let nodes = [];
      if (level == 0) {
        nodes = [{ F_AreaId: "0",F_Layer:0, F_AreaName: "中国", leaf: false }];
        this.node_had = node;
        this.resolve_had = resolve;
        resolve(nodes);
      } else if (level == 1) {
        getProvinceTree().then(res => {
          if (res.data?.data?.length > 0) {
            nodes = res.data.data.map(ele => {
              ele["F_AreaId"] = ele.F_AreaId;
              ele["F_AreaName"] = ele.F_AreaName;
              ele["leaf"] = false;
              return ele;
            });
          }
          resolve(nodes);
        });
      } else if (level == 2) {
        getAreasChild(value).then(res => {
          nodes = res.data.data.map(ele => {
            ele["F_AreaId"] = ele.F_AreaId;
            ele["F_AreaName"] = ele.F_AreaName;
            ele["leaf"] = true;
            return ele;
          });
          resolve(nodes);
        });
      } else {
        resolve([]);
      }
    },
    handleNodeClick(data, node, self) {
      console.log('node',node);
      let { level } = node;
      let value = node.data?.F_AreaId;
      this.level = level;
      this.F_AreaId = value;
	  this.F_Layer=node.data?.F_Layer+1;
      this.F_AreaName = node.data?.F_AreaName;
      this.keyword = "";
      this.changeTableData();
    },
    changeTableData() {
      if (this.level == 0) {
        this.areaTable = [];
      } else if (this.level == 1) {
        getProvinceTree({ keyword: this.keyword }).then(res => {
          this.areaTable = res.data.data;
        });
      } else if (this.level == 2) {
        getAreasChild(this.F_AreaId, { keyword: this.keyword }).then(res => {
          this.areaTable = res.data.data;
        });
      } else if (this.level == 3) {
        getAreasChild(this.F_AreaId, { keyword: this.keyword }).then(res => {
          this.areaTable = res.data.data;
        });
      } else {
        this.areaTable = [];
      }
    },
    refreshTree(){
      this.areaForm = {
        F_AreaCode: "",
        F_AreaName: "",
        F_SortCode: "",
        F_Description: "",
        F_AreaId: "",
		F_Layer:1,
        F_ParentId: 0
      };
      if(this.level<=2){
        this.node_had.childNodes = [];
        this.loadNode(this.node_had, this.resolve_had);
      }
    },
    /* 新增 */
    openForm(formName) {
      this.flag = true;
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.areaForm = {
        F_AreaCode: "",
        F_AreaName: "",
        F_SortCode: "",
        F_Description: "",
        F_AreaId: "",
		    F_Layer:1,
        F_ParentId: 0
      };
      this.areaForm.F_ParentId = this.F_AreaId;
	  this.areaForm.F_Layer=this.F_Layer;
      this.dialogVisible = true;
      this.dialogTitle =this.$t('areaManager.addModal.modalTitle');
    },
    /* 提交表单 */
    areaFormSubmit(formName) {
      this.flagAreaManager = true;
      this.$refs[formName].validate((valid,object) => {
        if (valid) {
          if (this.flag) {
            postArea(this.areaForm).then(() => {
              this.dialogVisible = false;
              this.changeTableData();
              this.refreshTree();
            }).finally(() => {
              this.flagAreaManager = false;
            });
          } else {
            modifyArea(this.areaForm.F_AreaId, this.areaForm).then(() => {
              this.dialogVisible = false;
              this.changeTableData();
              this.refreshTree();
            }).finally(() => {
              this.flagAreaManager = false;
            });
          }
        } else {
		  formValidateNotice(object,this,this.formEnCodeList)
          this.flagAreaManager = false;
          return false;
        }
      });
    },
    /* 取消弹窗 */
    cancelForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    /* 关闭弹窗 */
    handleClose(done) {
      this.$refs["areaForm"].resetFields();
      done();
    },

    /* 表格编辑 */
    editForm(row, index) {
      this.flag = false;
      this.dialogVisible = true;
      this.areaForm = Object.assign({}, row);
	  this.areaForm.F_Layer=this.F_Layer
      this.dialogTitle = this.$t('areaManager.editModalTitle');
    },
    /* 表格删除 */
    deleteForm(row, index) {
      this.$confirm(this.$t('deletePrompt.promptContent'), this.$t('deletePrompt.promptTitle'), {
        confirmButtonText:this.$t('buttonModule.modalSureBtn'),
        cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
        type: "warning"
      })
        .then(() => {
          deleteArea(row.F_AreaId).then(() => {
            this.changeTableData();
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message: this.$t('deletePrompt.successDeleted'),
              type: "success"
            });
          });
        })
        .catch(() => {});
    },
    /* 查询表单重置 */
    searchReset() {
      this.keyword = null;
      this.level = 1;
	  this.changeTableData()
    }
  }
};
</script>

<style scoped>
/* reset css */
div /deep/ .companiesuser-form .el-form-item {
  margin-bottom: 12px;
}

/* css */
.main-container {
  height: 100%;
  padding: 0 8px;
}
div /deep/ .custom-tree-node span{
	font-size: 14px;
	padding-left: 10px;
}
div /deep/ .custom-tree-node i{
	font-size: 12px;
}
</style>
