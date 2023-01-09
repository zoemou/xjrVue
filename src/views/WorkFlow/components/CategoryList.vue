<template>
  <div class="table">
    <avue-crud ref="categoryData" :data="categoryData" :option="categoryOption">
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addCategory"
          >{{$t('buttonModule.addBtn')}}
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="opr-primary" size="mini" @click="editCategory(scope.row)"
          >{{$t('tableOperationModule.editorBtn')}}</el-button
        >
        <el-button type="opr-danger" size="mini" @click="deleteCategory(scope.row)"
          >{{$t('tableOperationModule.deleteBtn')}}</el-button
        >
      </template>
    </avue-crud>
    <el-dialog v-dialogDrag
      :title="categoryFormTitle"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="categoryFormVisible"
      width="30%"
    >
      <div class="companiesuser-form custom-form" v-if="categoryFormVisible">
        <el-form
          :model="categoryForm"
          :rules="categoryRules"
          ref="categoryForm"
          label-width="100px"
          :validate-on-rule-change="false"
        >
          <el-col :span="24">
            <el-form-item :label="$t('workFlow.categoryList.labelName')" prop="F_ItemName">
              <el-input
                :placeholder="$t('workFlow.categoryList.placeholderName')"
                size="small"
                v-model="categoryForm.F_ItemName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('workFlow.categoryList.labelCode')" prop="F_ItemValue">
              <el-input
                :placeholder="$t('workFlow.categoryList.placeholderCode')"
                size="small"
                v-model="categoryForm.F_ItemValue"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('workFlow.categoryList.labelSort')" prop="F_SortCode">
              <el-input
                :placeholder="$t('workFlow.categoryList.placeholderSort')"
                size="small"
                v-model="categoryForm.F_SortCode"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="">
              <el-checkbox
                v-model="categoryForm.F_EnabledMark"
                true-label="1"
                false-label="0"
                checked
                >{{$t('workFlow.categoryList.efficient')}}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('workFlow.categoryList.labelRemark')">
              <el-input
                type="textarea"
                :placeholder="$t('workFlow.categoryList.placeholderRemark')"
                size="small"
                :autosize="{ minRows: 4, maxRows: 4 }"
                v-model="categoryForm.F_Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="categoryClose">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="submitCategory"
          >{{$t('buttonModule.modalSureBtn')}}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDataItem,
  addDataItem,
  editDataItem,
  deleteDataItem,
} from "@/api/system/dataitem";
export default {
  name: "CategoryList",
  data() {
    return {
      F_ItemCode: "FlowSort",
      categoryData: [],
      categoryOption: {
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 100,
        maxHeight: 420,
        border: true,
        page: false,
        index: true,
        indexLabel: this.$t('workFlow.categoryList.tabNum'),
        align: "center",
        menuAlign: "center",
        simplePage: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menu: true,
        column: [
          {
            label: this.$t('workFlow.categoryList.labelName'),
            prop: "F_ItemName",
          },
          {
            label:this.$t('workFlow.categoryList.labelCode'),
            prop: "F_ItemValue",
          },
          { label:this.$t('workFlow.categoryList.tabSimpleSpe'), prop: "F_SimpleSpelling" },
          {
            label: this.$t('workFlow.categoryList.tabEnabledMark'),
            prop: "F_EnabledMark",
            formatter: (row) => {
              return row.F_EnabledMark == 1 ? this.$t('workFlow.categoryList.efficient'):this.$t('workFlow.categoryList.stateInvalid');
            },
          },
          { label:this.$t('workFlow.categoryList.labelRemark'), prop: "F_Description" },
        ],
      },
      categoryForm: {},
      categoryFormVisible: false,
      categoryFormType:"add",
      categoryFormTitle:this.$t('workFlow.categoryList.addTitle'),
      categoryRules: {
        F_ItemName: [
          { required: true, message: this.$t('workFlow.categoryList.placeholderName'), trigger: "change" },
        ],
        F_ItemValue: [
          { required: true, message: this.$t('workFlow.categoryList.placeholderCode'), trigger: "change" },
        ],
        F_SortCode: [
          { required: true, message:this.$t('workFlow.categoryList.placeholderSort'), trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      getDataItem(this.F_ItemCode).then((res) => {
        this.categoryData = res.data.data;
        this.$store.commit('CHANGE_FLOWCATEGORY',res.data.data);
      });
    },
    addCategory() {
      this.categoryForm = {
        F_ItemName: "",
        F_ItemValue: "",
        F_EnabledMark: "",
        F_SortCode: "",
        F_Description: "",
      };
      this.categoryFormVisible = true;
      this.categoryFormType = 'add';
      this.categoryFormTitle =this.$t('workFlow.categoryList.addTitle');
    },
    editCategory(row) {
      this.categoryForm = {
        F_ParentId: row.F_ParentId,
        F_ItemCode: row.F_ItemCode,
        F_ItemId: row.F_ItemId,
        F_ItemDetailId: row.F_ItemDetailId,
        F_ItemName: row.F_ItemName,
        F_ItemValue: row.F_ItemValue,
        F_EnabledMark: row.F_EnabledMark,
        F_SortCode: row.F_SortCode,
        F_Description: row.F_Description,
      };
      this.categoryFormType = 'edit';
      this.categoryFormTitle = this.$t('workFlow.categoryList.editTitle');
      this.categoryFormVisible = true;
    },
    deleteCategory(row) {
      deleteDataItem(row.F_ItemDetailId).then((res) => {
        this.getCategoryList();
        if (res.data.success) {
          this.getCategoryList();
          this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message:this.$t('deletePrompt.hintSuccess'),
            type: "success",
          });
        } else {
          this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message: this.$t('deletePrompt.hintFailure'),
            type: "warning",
          });
        }
      });
    },
    async submitCategory() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          let res = {};
          let params = {
            ...this.categoryForm,
            F_ParentId: 0,
            F_ItemCode: this.F_ItemCode,
          };
          this.dataItemOpr(params);
        } else {
          return false;
        }
      });
    },
    async dataItemOpr(params) {
      let res = {};
      let type = this.categoryFormType;
      if (type == "add") {
        res = await addDataItem(params);
      } else {
        res = await editDataItem(params.F_ItemDetailId, params);
      }
      if (res.data.success) {
        this.getCategoryList();
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message:this.$t('deletePrompt.hintSuccess'),
          type: "success",
        });
      } else {
        this.$notify({
          title:this.$t('deletePrompt.promptTitle'),
          message: this.$t('deletePrompt.hintFailure'),
          type: "warning",
        });
      }
      this.categoryFormVisible = false;
    },
    categoryClose() {
      this.categoryFormVisible = false;
    },
  },
};
</script>
<style scoped>
/deep/ .avue-crud__menu{
	display: flex;
}
</style>