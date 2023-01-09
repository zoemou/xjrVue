<template>
  <div>
    <el-form
      :rules="rules"
      ref="form"
      :model="formData"
      label-width="80px"
      :validate-on-rule-change="false"
      v-loading="waitLoading" 
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="F_NwfRelationCode" :label="$t('workFlow.Step1.labelMCode')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderMCode')"
              size="small"
              v-model="formData.F_NwfRelationCode"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="F_NwfRelationName" :label="$t('workFlow.Step1.labelMName')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderMName')"
              size="small"
              v-model="formData.F_NwfRelationName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="F_EnCode" :label="$t('workFlow.Step1.labelFCode')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderFCode')"
              size="small"
              v-model="formData.F_EnCode"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="F_FullName" :label="$t('workFlow.Step1.labelFName')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderFName')"
              size="small"
              v-model="formData.F_FullName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
		  <el-col :span="24">
		  	<el-form-item prop="F_LgMarkCode" :label="$t('menuManagement.addModal.labelTransTag')">
		  		<!-- <avue-input-tree default-expand-all
		  								v-model="formData.F_LgMarkCode"
		  								:placeholder="$t('menuManagement.addModal.placeholderTransTag')" type="tree"
		  								:dic="transDefaultTree" size="small"
		  								style="width: 100%"></avue-input-tree> -->

                       <el-select
                            v-model="formData.F_LgMarkCode"                            
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
		</el-row>
		<el-row>
        <el-col :span="12">
          <el-form-item prop="F_SubSystemId" :label="$t('workFlow.Step1.labelSystemId')">
             <SelectionSystem   v-model="formData.F_SubSystemId" :isEdit="isEdit" @changeSystem="toggleSystem"></SelectionSystem>
          </el-form-item>
          </el-col>
        <el-col :span="12">
          <el-form-item prop="" :label="$t('workFlow.Step1.labelSupFun')">
            <div  v-if="allSystem.length">
              <div v-for="(item,idx) in allSystem" :key="idx">
              <avue-input-tree
                v-model="formData.F_ParentId"
                :placeholder="$t('workFlow.Step1.placeholderSupFun')"
                type="tree"
                :dic="parentList"
                size="small"
                v-if="item.F_Id == formData.F_SubSystemId"
              ></avue-input-tree>
            </div>
            </div>
            <avue-input-tree
                v-model="formData.F_ParentId"
                :placeholder="$t('workFlow.Step1.placeholderSupFun')"
                type="tree"
                :dic="parentList"
                size="small"
                v-else
              ></avue-input-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workFlow.Step1.labelFIcon')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderIcon')"
              size="small"
              v-model="formData.F_Icon"
            >
              <i slot="suffix" class="el-icon-more" @click="selectMoreIcon"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('workFlow.Step1.labelFOrder')">
            <el-input
              :placeholder="$t('workFlow.Step1.placeholderOrder')"
              size="small"
              v-model="formData.F_SortCode"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('workFlow.Step1.labelFDesc')">
            <el-input
              type="textarea"
              :placeholder="$t('workFlow.Step1.placeholderFDesc')"
              size="small"
              v-model="formData.F_Description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="footer">
      <el-button size="mini" type="primary" @click="next()">{{$t('workFlow.Step1.nextStepBtn')}}</el-button>
    </span>
    <el-dialog v-dialogDrag
      :title="$t('workFlow.Step1.titleSelectIcon')"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogVisible = false"
    >
      <SelectIcon v-if="dialogVisible" @childByValue="chageIcon"></SelectIcon>
    </el-dialog>
  </div>
</template>

<script>
import SelectIcon from "@/views/FontAwesome";
  import SelectionSystem from '@/components/common/SelectionSystem';
import { mapGetters } from "vuex";
import { getMenuTreeBySystem } from '@/api/systemManagement/menu';
import { FormatMenuTree,LanguageFormatTree } from '@/util/util.js';
import {getLgMarkList} from '@/api/language/translation'
export default {
  components: {
    SelectIcon,
    SelectionSystem
  },
  props: {
    isEdit:{
      type:Boolean,
      default:false
    },
    stepData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["allSystem", "systemId"]),
  },
  data() {
    return {
      waitLoading:true,
      parentList: [],
	  transDefaultTree:[],
      formData: {
        F_NwfRelationCode: "",
        F_NwfRelationName: "",
        F_EnCode: "",
        F_FullName: "",
        F_ParentId: "",
        F_Icon: "",
        F_SortCode: "",
        F_Description: "",
        F_SubSystemId: '0'
      },
      rules: {
        F_SubSystemId: [
          { required: true, message:this.$t('workFlow.Step1.placeholderSystemId'), trigger: "blur" },
        ],
        F_NwfRelationCode: [
          { required: true, message:this.$t('workFlow.Step1.hintMCode'), trigger: "blur" },
        ],
        F_NwfRelationName: [
          { required: true, message:this.$t('workFlow.Step1.hintMName'), trigger: "blur" },
        ],
        F_EnCode: [
          { required: true, message:this.$t('workFlow.Step1.hintFNum'), trigger: "blur" },
        ],
        F_FullName: [
          { required: true, message:this.$t('workFlow.Step1.placeholderFName'), trigger: "blur" },
        ],
      },
      dialogVisible: false,
    };
  },
  created() {
	// this.getDataDictionary()
    this.formData = this.stepData.step1;
	if(this.formData.F_LgMarkCode){
		this.transDefaultTree=[{
		  F_Id:this.formData.F_LgMarkCode,
		  F_EnCode:this.formData.F_LgMarkCode,
		  F_Name:this.formData.F_LgMarkName
		}];
	}
    //this.getMenuList();
    if(this.formData.F_SubSystemId){
      this.formData.F_SubSystemId = this.formData?.F_SubSystemId;
    }
    // if(this.formData.F_ParentId){
    //   this.formData.F_ParentId = this.formData?.F_ParentId;
    // }
  },
  methods: {
	/* 获取翻译标记 */
		  remoteMethod(query) {
				const searchObj = {
					keyword:query
				}
				getLgMarkList(searchObj).then(res => { 
				
					this.transDefaultTree = res.data.data;
				
				});
			},
    async toggleSystem(systemId,parentId){
      systemId = systemId || '0';
      try {
        let res = await getMenuTreeBySystem(systemId)
        let {code,data} = res.data;
        code || (this.parentList = FormatMenuTree(data, 'F_ModuleId', 'F_FullName', 'children'));
        this.waitLoading = false;
      } catch (error) {
        this.waitLoading = false;
      }
      
    },
    formateParentTree(data) {
      let list = [];
      data.forEach((item) => {
        let temp = {
          moduleId: "",
          label:this.$t('workFlow.Step1.hintSelect'),
          disabled: false,
          children: [],
        };
        temp.moduleId = item.moduleId;
        temp.label = item.label;
        if (item.children.length > 0) {
          temp.children = this.formateParentTree(item.children);
        }
        list.push(temp);
      });
      return list;
    },
    selectMoreIcon() {
      this.dialogVisible = true;
    },
    chageIcon(val) {
      this.formData.F_Icon = val;
      this.dialogVisible = false;
    },
    next() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.stepData.step1 = this.formData;
          this.stepData.activeStep++;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.parent-box {
  width: 100%;
}
.footer {
  padding: 10px 20px 20px;
  text-align: right;
  display: block;
  position: absolute;
  right: 10px;
  bottom: 0;
}
.el-select {
  width: 100%;
}
</style>
