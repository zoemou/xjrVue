<template>
  <el-dialog
    v-dialogDrag
    :title="$t('code.codeForm.saveBtn')"
    :append-to-body="true"
    :visible.sync="templateVisible"
    width="50%"
    :close-on-click-modal="false"
     :close-on-press-escape="false"
     :show-close="false"
    style="padding: 10px 20px"
  >
    <div class="baseinfo-form">
      <el-form
        :rules="rules"
        ref="schemeForm"
        :model="templateData"
        label-width="100px"
        :validate-on-rule-change="false"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="f_name"
              :label="$t('code.codeForm.saveTemplateModal.labelName')"
            >
              <el-input
                :placeholder="
                  $t('code.codeForm.saveTemplateModal.placeholderName')
                "
                size="small"
                v-model="templateData.f_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="f_Catalog"
              :label="$t('webTempClass')"
              class="TlabelStyle"
            >
              <avue-input-tree
                default-expand-all
                v-model="templateData.f_Catalog"
                :placeholder="$t('selectWebTempClass')"
                type="tree"
                :dic="templateTypeTree"
                size="small"
                style="width: 100%"
              ></avue-input-tree>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
			  <el-form-item prop="f_appCatalog" :label="$t('移动端模板分类')" v-if="baseData.step6.appCode" class="TlabelStyle">
				<el-select :placeholder="$t('请选择移动端模板分类')" v-model="templateData.f_appCatalog" style="width: 100%;">
					<el-option
					v-for="item in diogbaseData"
					:key="item.F_ItemDetailId"
					:label="item.label"
					:value="item.F_ItemDetailId">
					</el-option>
				</el-select>
			  </el-form-item>
		  </el-col> -->
          <el-col :span="24">
            <el-form-item
              :label="$t('code.codeForm.saveTemplateModal.labelDescription')"
            >
              <el-input
                type="textarea"
                :placeholder="
                  $t('code.codeForm.saveTemplateModal.placeholderDescription')
                "
                size="small"
                v-model="templateData.f_Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button size="mini" type="primary" @click="handleClose()">{{
        $t("buttonModule.modalCancelBtn")
      }}</el-button> -->
      <el-button size="mini" type="primary" @click="saveCodeScheme()">{{
        $t("buttonModule.modalSureBtn")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDataItem } from "@/api/system/dataitem.js";
import { FormatTree } from "../../../../util/util.js";
export default {
  props: {
    menuForm: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
  },
  data() {
    return {
      templateVisible: true,
      templateTypeTree: [],
      templateData: {
        f_name: "",
        f_Id: "",
        f_Catalog: "",
        //f_appCatalog:'',
        f_CodeSchema: "",
        f_Description: ""
      },
      rules: {
        f_name: [
          {
            required: true,
            message: this.$t("code.codeForm.saveTemplateModal.placeholderName"),
            trigger: "blur"
          }
        ],
        f_Catalog: [
          {
            required: true,
            message: this.$t(
              "code.codeForm.saveTemplateModal.placeholderClassification"
            ),
            trigger: "change"
          }
        ]
        // f_appCatalog:[
        // 	{required: true, message: this.$t('请选择移动端模板分类'), trigger: 'change'}
        // ]
      }
    };
  },
  async created() {
    this.templateData = {...this.templateData,...this.menuForm};
    let res = await getDataItem("CodeSchemaType");
    if (res.data && res.data.success) {
      this.templateTypeTree = FormatTree(
        res.data.data,
        "F_ItemValue",
        "F_ItemName",
        "children"
      );
    }
  },
  methods: {
    handleClose() {
      this.templateVisible = false;
      this.$emit('handleClose');
    },
    saveCodeScheme() {
      this.$refs["schemeForm"].validate(valid => {
        if (!valid){
          this.$notify({
            title: "提示",
            message: "保存模板失败！",
            type: "warning"
          });
           return;
        }else{
          this.$emit('saveCodeScheme',this.templateData);
        }
        
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
