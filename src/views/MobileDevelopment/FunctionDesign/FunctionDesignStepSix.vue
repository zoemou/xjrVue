<template>
  <div class="main-container">
    <main-content class="m-content info-content" title="功能信息配置" :paddingLeft="0" :paddingTop="40" :search="false">
      <div slot="table" style="height: 100%;" class="table-conter">
		<p class="head_title">{{$t('mobileDev.functionDesignStepSix.headTitle')}}</p>    
        <el-form :rules="rules" ref="menuForm" :model="menuForm" label-width="80px" :validate-on-rule-change="false">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userName" :label="$t('mobileDev.functionDesignStepSix.labelFounder')">
                <el-input :placeholder="$t('mobileDev.functionDesignStepSix.placeholderFounder')" size="small"
                          v-model="menuForm.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="functionName" :label="$t('mobileDev.functionDesignStepSix.labelFunctionN')">
                <el-input :placeholder="$t('mobileDev.functionDesignStepSix.placeholderFunctionN')" size="small" @input="changeFunName"
                          v-model="menuForm.functionName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="functionDesc" :label="$t('mobileDev.functionDesignStepSix.labelFunctionDesc')">
                <el-input :placeholder="$t('mobileDev.functionDesignStepSix.placeholderFunctionDesc')" size="small"
                          v-model="menuForm.functionDesc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="outArea" :label="$t('mobileDev.functionDesignStepSix.labelOutArea')">
                <el-select v-model="menuForm.outArea" :placeholder="$t('mobileDev.functionDesignStepSix.placeholderSelect')" size="small" @change="changeFunName"
                           style="width: calc(100% - 107px);margin-right: 10px;">
                  <el-option
                      v-for="item in options"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="addDomain()" icon="el-icon-plus" size="small" type="primary">{{$t('mobileDev.functionDesignStepSix.addAreaBtn')}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('mobileDev.functionDesignStepSix.labelOnlyFont')" label-width="200">
                <el-switch v-model="menuForm.onlyFont"></el-switch>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12" v-if="controllerType === 1">
              <el-form-item label="是否生成Sql文件" label-width="200">
                <el-switch v-model="menuForm.isHaveSql"></el-switch>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
    </main-content>
    <main-content class="m-content catalogue-content" :title="$t('mobileDev.functionDesignStepSix.nextTitle')" :paddingLeft="0" :paddingTop="40"
                  :search="false">
      <div slot="table" style="height: 100%;">
        <el-form ref="treeform" size="small" label-width="130px">
          <el-col v-show="!menuForm.onlyFont" :span="24">
            <el-form-item :label="$t('mobileDev.functionDesignStepSix.labelPhysLayer')">
              <el-input size="small" readonly v-model="modelOutputDir"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="!menuForm.onlyFont" :span="24">
            <el-form-item :label="$t('mobileDev.functionDesignStepSix.labelContrLayer')">
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
            <el-form-item :label="$t('mobileDev.functionDesignStepSix.labelFrontEndFile')">
              <el-input size="small" readonly v-model="webOutPutDir"></el-input>
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
  </div>
</template>

<script>
import { getDatabaseTable, getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import { getDictCateByCode, getDictInfoByCode } from '@/api/language/dictionary.js';
import { getOutputArea } from '@/api/code/code.js';
import MainContent from '../../../page/main/MainContent';
import DataItem from '../../../components/DataItem';
import store from '@/store'
import {mapGetters} from "vuex"
export default {
  computed: {
      ...mapGetters(['MDAllStepData'])
  },
  data () {

    return {
      //controllerType:store.state.FD.controllerType,
      menuForm: {
        userName: '',
        functionName: '',
        functionDesc: '',
        outArea: '',
        outAreaName: '',
        onlyFont: false,
        isHaveSql: true,
      },
      diogbaseData: {
        title:this.$t('mobileDev.functionDesignStepSix.titleAddDic'),
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
      haveSql:'',
      rules: {
        userName: [
          { required: true, message:this.$t('mobileDev.functionDesignStepSix.placeholderFounder'), trigger: 'blur' }
        ],
        functionName: [
          { required: true, message:this.$t('mobileDev.functionDesignStepSix.hintFunctionN'), trigger: 'blur' }
        ],
        functionDesc: [
          { required: true, message:this.$t('mobileDev.functionDesignStepSix.placeholderFunctionDesc'), trigger: 'blur' }
        ],
        outArea: [
          { required: true, message: this.$t('mobileDev.functionDesignStepSix.hintOutArea'), trigger: 'change' }
        ]
      },
      front_path: 'views/customercode',
      model_path: 'Xjrsoft.Model',
      controller_path: 'Xjrsoft.Api',
      sql_path: 'Xjrsoft.Sql',
      /* repository_path:"/src/main/java/com/xjr/mvc/customer",
      service_path:"/src/main/java/com/xjr/mvc/customer" */
    };
  },
  components: {
    MainContent,
    DataItem
  },
  methods: {
    getDictCateByCode () {
      this.options = [];
      getDictCateByCode('outputArea').then(res => {
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
        this.diogbaseData.F_ItemId = res.data.data.F_ItemId;
        this.diogbaseData.F_ParentId = res.data.data.F_ParentId;
      });
    },
    closepop (obj) {
      this.diogbaseData.dialogVisible = false;
      this.getDictCateByCode();
      this.menuForm.outArea = obj.F_ItemValue;
      this.menuForm.outAreaName = obj.F_ItemName;
      this.changeFunName();
    },
    changeFunName () {
      let path = '/' + this.menuForm.outArea; //+"/"+this.menuForm.functionName;
      //this.serviceOutPutDir=this.service_path +path;
      this.controllerOutPutDir = this.controller_path.replace(/{outputArea}/i, this.menuForm.outArea);
      this.modelOutputDir = this.model_path.replace(/{outputArea}/i, this.menuForm.outArea);
      // this.webOutPutDir = this.front_path.replace(/{outputArea}/i, this.menuForm.outArea);
      //  this.haveSql = this.sql_path.replace(/{outputArea}/i, this.menuForm.outArea);
      // this.controllerOutPutDir = this.controller_path + path;
      //this.repositoryOutPutDir=this.repository_path +path;
      // this.modelOutputDir = this.model_path + path;
      this.webOutPutDir = this.front_path + path;
      this.haveSql = this.sql_path + path;
    },
    //仅保存数据不验证
    saveData(){
      const { menuForm, controllerOutPutDir, modelOutputDir, webOutPutDir } = this;
      let obj = {
        createUser: menuForm.userName,
        describe: menuForm.functionDesc,
        name: menuForm.functionName,
        outputArea: { F_ItemName: menuForm.outAreaName, F_ItemValue: menuForm.outArea },
        onlyFont: menuForm.onlyFont,
        haveSql: menuForm.isHaveSql,
        // controllerDirectory: controllerOutPutDir,
        // modelDirectory: modelOutputDir,
        fontDirectory: webOutPutDir,
      };
      !menuForm.onlyFont && (obj.controllerOutPutDir = controllerOutPutDir, obj.modelOutputDir = modelOutputDir);
      this.MDAllStepData.stepSix=obj;
    },
    //提交数据验证
    validateData () {
      let flag = false;
      const { menuForm, controllerOutPutDir, modelOutputDir, webOutPutDir } = this;
      let obj = {
        createUser: menuForm.userName,
        describe: menuForm.functionDesc,
        name: menuForm.functionName,
        outputArea: { F_ItemName: menuForm.outAreaName, F_ItemValue: menuForm.outArea },
        onlyFont: menuForm.onlyFont,
        haveSql: menuForm.isHaveSql,
        // controllerDirectory: controllerOutPutDir,
        // modelDirectory: modelOutputDir,
        fontDirectory: webOutPutDir,
      };
      !menuForm.onlyFont && (obj.controllerOutPutDir = controllerOutPutDir, obj.modelOutputDir = modelOutputDir);

      this.MDAllStepData.stepSix=obj;
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
      return val.replace(/[^a-zA-Z0-9_]/g, '')
    },
  },
  created () {
    this.getDictCateByCode();
    this.getOutputArea();
    if (this.MDAllStepData.stepSix) {
      let obj = this.MDAllStepData.stepSix;

      if (obj.createUser) this.menuForm.userName = obj.createUser;
      if (obj.describe) this.menuForm.functionDesc = obj.describe;
      if (obj.name) this.menuForm.functionName = obj.name;
      if (obj.outputArea) this.menuForm.outArea = obj.outputArea.F_ItemValue;
      if (obj.controllerDirectory) this.controllerOutPutDir = obj.controllerDirectory;
      if (obj.modelDirectory) this.modelOutputDir = obj.modelDirectory;
      if (obj.fontDirectory) this.webOutPutDir = obj.fontDirectory;
      if (obj.haveSql === false) this.menuForm.isHaveSql = obj.haveSql
      this.menuForm.onlyFont = obj.onlyFont || false;
    }
  },
  watch: {
    'menuForm.functionName': {
      handler (val) {
        this.$nextTick(() => {
          this.menuForm.functionName = this.filterInput(val);
        });
      },
      deep: true
    }
  },
};
</script>

<style lang="scss">
.main-container {
  .m-content .main-box .main-table .main-table-content {
    padding-bottom: 60px;
  }

  .info-content {
    height: 50%;
  }

  .catalogue-content {
    height: 50%;
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
	margin-top: 0px;
	line-height: 40px;
	color: #4d4d4d;
}
</style>
