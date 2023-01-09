<template>
  <div class="main-container">
    <main-content class="m-content info-content" :title="$t('code.codeStepSix.titleInfoConfig')" :paddingLeft="0" :paddingTop="40" :search="false">
      <div slot="table" style="height: 100%;" class="table-conter">
		<p class="head_title">{{$t('code.codeStepSix.titleInfoConfig')}}</p>  
        <el-form :rules="rules" ref="menuForm" :model="menuForm" label-width="145px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userName" :label="$t('code.codeStepSix.labelFounder')">
                <el-input :placeholder="$t('code.codeStepSix.placeholderFounder')" size="small"
                          v-model="menuForm.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="functionName" :label="$t('code.codeStepSix.labelFunctionName')">
                <el-input maxlength="150" :placeholder="$t('code.codeStepSix.placeholderFunctionName')" size="small" @input="changeFunName" @blur="checkFunName"
                          v-model="menuForm.functionName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="functionDesc" :label="$t('code.codeStepSix.labelFunctionDesc')">
                <el-input :placeholder="$t('code.codeStepSix.placeholderFunctionDesc')" size="small"
                          v-model="menuForm.functionDesc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="outArea" :label="$t('code.codeStepSix.labelOutArea')">
                <el-select v-model="menuForm.outArea" :placeholder="$t('code.codeStepSix.placeholderSelect')" size="small" @change="changeFunName"
                           style="width: calc(100% - 107px);margin-right: 10px;">
                  <el-option
                      v-for="item in options"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="addDomain()" icon="el-icon-plus" size="small" type="primary">{{$t('code.codeStepSix.addAreaBtn')}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="24"> 
              <el-form-item prop="F_CategoryId" :label="$t('interfaceSort')">
								<avue-input-tree default-expand-all
										 v-model="menuForm.F_CategoryId"
										  :props="defaultParentIdProps"
										 :placeholder="$t('selectInterfaceSort')" type="tree"
										 :dic="dataItemTree" size="small"
										 style="width: calc(100% - 45px);margin-right: 10px;"></avue-input-tree>
							    <el-button @click="addDomainCategoryId()" icon="el-icon-plus" size="small" type="primary"></el-button>
							  </el-form-item>
             </el-col>
           </el-row> 
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('code.codeStepSix.frontEndCode')" label-width="145px">
                <el-switch v-model="menuForm.onlyFont"></el-switch>
              </el-form-item>
            </el-col>
			<el-col :span="12">
			  <el-form-item :label="$t('generateMobileCode')" label-width="145px">
			    <el-switch v-model="menuForm.appCode"></el-switch>
			  </el-form-item>
			</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="controllerType === 1">
             <el-form-item :label="$t('code.codeStepSix.sqlFile')" label-width="145px">
                <el-switch v-model="menuForm.isHaveSql"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('code.codeStepSix.applyWF')" label-width="145px">
                <el-switch v-model="menuForm.isWorkflowForm"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </main-content>
    <main-content class="m-content catalogue-content" :title="$t('code.codeStepSix.outputList')" :paddingLeft="0" :paddingTop="40"
                  :search="false">
      <div slot="table" style="height: 100%;">
        <el-form ref="treeform" size="small" label-width="150px">
          <el-col v-show="!menuForm.onlyFont" :span="24">
            <el-form-item :label="$t('code.codeStepSix.entityOutputList')">
              <el-input size="small" readonly v-model="modelOutputDir"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="!menuForm.onlyFont" :span="24">
            <el-form-item :label="$t('code.codeStepSix.controlOutputList')">
              <el-input size="small" readonly v-model="controllerOutPutDir"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="服务层输出目录">
            <el-input size="small" readonly v-model="serviceOutPutDir"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="仓储层输出目录">
            <el-input size="small" readonly v-model="repositoryOutPutDir"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item :label="$t('webFileList')" class="labelStyle" label-width="145px">
              <el-input size="small" readonly v-model="webOutPutDir"></el-input>
            </el-form-item>
          </el-col>
		  <el-col :span="24" v-show="menuForm.appCode">
		    <el-form-item :label="$t('moblieFileList')" class="labelStyle" label-width="145px">
		      <el-input size="small" readonly v-model="appOutPutDir"></el-input>
		    </el-form-item>
		  </el-col>
<!--          <el-col :span="24" v-if="menuForm.isHaveSql">-->
<!--            <el-form-item label="Sql文件输出目录">-->
<!--              <el-input size="small" readonly v-model="haveSql"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-form>
      </div>
    </main-content>
    <DataItem :baseData="diogbaseData" @closepop="closepop"></DataItem>
    <AddInterfaceCategory v-if="addCateVisible" :visible.sync="addCateVisible" :dialogTitle="$t('addInterfaceSort')" @submitRes="getDataItemTree"></AddInterfaceCategory>
  </div>
</template>

<script>
import { getDatabaseTable, getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import { getDictCateByCode, getDictInfoByCode } from '@/api/language/dictionary.js';
import { getOutputArea,validateFunctionName } from '@/api/code/code.js';
import MainContent from '../../../page/main/MainContent';
import DataItem from '../../../components/DataItem';
import store from '@/store'
import { mapGetters } from "vuex";
import {
  getInterfaceTypeTree,
} from "@/api/systemManagement/interface";
import AddInterfaceCategory from "@/views/SystemManagement/components/AddInterfaceCategory.vue";
export default {
  props: [
    'baseData'
  ],
 computed: {
    ...mapGetters(["website"])
  },
  data () {

    return {
      controllerType:store.state.FD.controllerType,
      defaultParentIdProps:{
       label:'F_Name',
				value:'F_Id'
      },
      dataItemTree:[],
      menuForm: {
        userName: '',
        functionName: '',
        functionDesc: '',
        outArea: '',
        outAreaName: '',
        F_CategoryId:'',
        onlyFont: false, 
		appCode:false,
        isHaveSql: true,
        isWorkflowForm:true
      },
      diogbaseData: {
        title:this.$t('code.codeStepSix.titleAdd'),
        dialogVisible: false,
        'F_ItemId': '',
        'F_ParentId': '',
        isAdd: true
      },
      options: [],
      modelOutputDir: '',
      //serviceOutPutDir: '',
      controllerOutPutDir: '',
      //repositoryOutPutDir:'',
      webOutPutDir: '',
	  appOutPutDir:'',
      haveSql:'',
      rules: {
        userName: [
          { required: true, message:this.$t('code.codeStepSix.placeholderFounder'), trigger: 'blur' }
        ],
        functionName: [
          { required: true, message:this.$t('code.codeStepSix.hintFunctionName'), trigger: 'blur' }
        ],
        functionDesc: [
          { required: true, message:this.$t('code.codeStepSix.placeholderFunctionDesc'), trigger: 'blur' }
        ],
        outArea: [
          { required: true, message: this.$t('code.codeStepSix.hintOutArea'), trigger: 'change' }
        ],
        F_CategoryId: [
          { required: true, message:this.$t('selectInterfaceSort'), trigger: 'change' },
      ],
      },
      front_path: 'views/',
	  appfront_path: 'pages/basics/customercode',
      model_path: 'Xjrsoft.Model',
      controller_path: 'Xjrsoft.Api',
      sql_path: 'Xjrsoft.Sql',
      addCateVisible:false,
      /* repository_path:"/src/main/java/com/xjr/mvc/customer",
      service_path:"/src/main/java/com/xjr/mvc/customer" */
    };
  },
  components: {
    MainContent,
    DataItem,
    AddInterfaceCategory
  },
  methods: {
    /* 获取分类树 */
    async getDataItemTree() {
      const res = await getInterfaceTypeTree();
      this.dataItemTree = res.data.data;
    },
    getDictCateByCode () {
      this.options = [];
      getDictCateByCode('outputArea').then(res => {
        console.log('获取菜单树形数据', res);
        if (res.data.success) {
          var list = res.data.data;
          list.forEach((o, i) => {
            var obj = {
              label: o.F_ItemName,
              value: o.F_ItemValue,
              key: o.F_ItemDetailId
            };
            this.options.push(obj);
          });
        }

      });
    },
    getOutputArea () {
      getOutputArea().then(res => {
        console.log('获取输出路径', res);
        this.controller_path = res.data.data.controllerArea;
        this.model_path = res.data.data.modelArea;
        //this.repository_path=res.data.data.repositoryArea;
        //this.service_path=res.data.data.serviceArea;
        this.changeFunName();
      });
    },
    addDomain () {
      this.diogbaseData.dialogVisible = true;
      getDictInfoByCode('outputArea').then(res => {
        console.log('获取codeInfo', res);
        this.diogbaseData.F_ItemId = res.data.data.F_ItemId;
        this.diogbaseData.F_ParentId = res.data.data.F_ParentId;
      });
    },
    addDomainCategoryId(){
      this.addCateVisible = true;
    },
    closepop (obj) {
      this.diogbaseData.dialogVisible = false;
	  if(obj){
		  this.getDictCateByCode();
		  this.menuForm.outArea = obj.F_ItemValue;
		  this.menuForm.outAreaName = obj.F_ItemName;
		  this.changeFunName();
	  }
    },
    changeFunName () {
      let path = '/' + this.menuForm.outArea; //+"/"+this.menuForm.functionName;
      
      //this.serviceOutPutDir=this.service_path +path;
      // this.controllerOutPutDir = this.controller_path + path;
      this.controllerOutPutDir = this.controller_path.replace(/{outputArea}/i, this.menuForm.outArea);
      this.modelOutputDir = this.model_path.replace(/{outputArea}/i, this.menuForm.outArea);
      //this.repositoryOutPutDir=this.repository_path +path;
      // this.modelOutputDir = this.model_path + path;
      this.webOutPutDir = this.front_path + this.website.genCodePath + path;
	  this.appOutPutDir = this.appfront_path + path;
      this.haveSql = this.sql_path + path;
    },
    async checkFunName(){//检查是否有相同功能类名
      let isSameClassName = false;
      if(this.menuForm.functionName!=''){
        try {
        let res  = await validateFunctionName(this.menuForm.functionName);//后端接口访问
        isSameClassName = res.data.data;
      } catch (error) {
      }
      if(this.menuForm.onlyFont){
        return false;//如果打开了 是否只生成前端源码 无需判断功能类型是否重复
      }
      if(isSameClassName){
        this.$message({
          message:this.$t('code.codeStepSix.hintSameName'),
          type: 'error'
        });
      }
      }
      
    },
    //提交数据验证
    validateData () {
      console.log('提交验证', this.menuForm.outArea);
      let flag = false;
      const { menuForm, controllerOutPutDir, modelOutputDir, webOutPutDir,appOutPutDir } = this;
      let obj = {
        createUser: menuForm.userName,
        describe: menuForm.functionDesc,
        name: menuForm.functionName,
        outputArea: { F_ItemName: menuForm.outAreaName, F_ItemValue: menuForm.outArea },
        onlyFont: menuForm.onlyFont,
		appCode: menuForm.appCode,
        haveSql: menuForm.isHaveSql,
        isWorkflowForm:menuForm.isWorkflowForm,
        F_CategoryId:menuForm.F_CategoryId,
        // controllerDirectory: controllerOutPutDir,
        // modelDirectory: modelOutputDir,
        fontDirectory: webOutPutDir,
		appOutPutDir:appOutPutDir
      };
      !menuForm.onlyFont && (obj.controllerOutPutDir = controllerOutPutDir, obj.modelOutputDir = modelOutputDir);
      console.log('输出配置数据库最终数据', obj);
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          this.$emit('onChange', obj);
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    filterInput (val) {
      // 替换除汉字字母数字和指定的字符或特殊符号外的所有内容
      if(!val) return;
      return val[0]?.replace(/[^a-zA-Z_]/, '') && val.replace(/[^a-zA-Z0-9_]/g, '')
    },
  },
  async created () {
     await this.getDataItemTree();
    this.getDictCateByCode();
    this.getOutputArea();
    this.menuForm.F_CategoryId = "";
    if (this.baseData.step6) {
      let obj = this.baseData.step6;
      if(obj.isWorkflowForm==undefined){
        obj.isWorkflowForm = true;
      }
      this.menuForm.isWorkflowForm = obj.isWorkflowForm;
      if (obj.createUser) this.menuForm.userName = obj.createUser;
      if (obj.describe) this.menuForm.functionDesc = obj.describe;
      if (obj.name) this.menuForm.functionName = obj.name;
      if (obj.outputArea) this.menuForm.outArea = obj.outputArea.F_ItemValue;
      if (obj.controllerDirectory) this.controllerOutPutDir = obj.controllerDirectory;
      if (obj.modelDirectory) this.modelOutputDir = obj.modelDirectory;
      if (obj.fontDirectory) this.webOutPutDir = obj.fontDirectory;
	  if (obj.appOutPutDir) this.appOutPutDir = obj.appOutPutDir;
      if (obj.haveSql === false) this.menuForm.isHaveSql = obj.haveSql
      this.menuForm.onlyFont = obj.onlyFont || false;
	  this.menuForm.appCode = obj.appCode || false;
    this.menuForm.F_CategoryId = obj.F_CategoryId;
    }
  },
  watch: {
    'menuForm.functionName': {
      handler (val) {
        this.$nextTick(() => {
          console.log(this.filterInput(val));
          this.menuForm.functionName = this.filterInput(val);
        });
      },
      deep: true
    }
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  padding: 20px;
  .m-content .main-box .main-table .main-table-content {
    padding-bottom: 20px;
  }

  .info-content {
    height:auto;
  }

  .catalogue-content {
    height:auto;
    margin-top: 10px;
    padding-bottom: 10px;
  }
}


</style>
<style scoped>
.main-container {
  height: 100%;
}

.avue-crud {
  width: 100%;
  height: 100%;
}

.avue-crud__tip.el-tag {
  display: none !important;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:-10px;
	line-height: 40px;
	color: #4d4d4d;
}
div /deep/ .main-table-content{
	border-top: none;
}
</style>
