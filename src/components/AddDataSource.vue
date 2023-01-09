<template>
          <el-dialog v-dialogDrag
            :close-on-click-modal="false"
            v-bind="$attrs"
            :append-to-body="true"
            width="40%"
            :before-close="closeDialog"          
          >
            <div class="form">
              <el-form
                ref="dataSourceForm"
                :rules="rules"
                :model="dataSourceForm"
                label-width="65px"
				
              >
                <el-row>
                  <el-col :span="12" v-show="hasFormPermission('F_Name')">
                    <el-form-item :label="$t('databaseManage.dataSource.addModalName')" prop="F_Name">
                      <el-input
                        :placeholder="$t('databaseManage.dataSource.addModalWriteName')"
                        size="small"
                        v-model="dataSourceForm.F_Name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-show="hasFormPermission('F_Code')">
                    <el-form-item :label="$t('databaseManage.dataSource.addModalCode')" prop="F_Code">
                      <el-input
                        :placeholder="$t('databaseManage.dataSource.addModalWriteCode')"
                        size="small"
                        v-model="dataSourceForm.F_Code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-show="hasFormPermission('F_DbId')">
                  <el-col :span="24">
                    <el-form-item :label="$t('databaseManage.dataSource.addModalDatabase')" :required="true" prop="F_DbId">
                      <el-cascader
                        v-model="dataSourceForm.F_DbId"
                        size="small"
                        ref="cascader"
                        :props="{
                          expandTrigger: 'hover',
                          value: 'F_DatabaseLinkId',
                          label: 'F_DBName',
						  emitPath:false
                        }"
                        :placeholder="$t('databaseManage.dataSource.addModalSelectDatabase')"
                        expand-trigger="hover"
                        :options="databaseGroup"
                        :show-all-levels="false"
                        clearable
                        filterable
                        style="width: 100%"                       
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-show="hasFormPermission('F_Sql')">
                  <el-col :span="24">
                    <el-form-item :label="$t('databaseManage.dataSource.addModalSQLstatement')" prop="F_Sql">
                      <CodemirrorSql 
                      style="height:200px;"
                       :placeholder="$t('databaseManage.dataSource.addModalWriteSQLstatement')"
                        v-model="dataSourceForm.F_Sql"
                      ></CodemirrorSql>
                     
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-show="hasFormPermission('F_Description')">
                  <el-col :span="24">
                    <el-form-item :label="$t('databaseManage.dataSource.addModalRemark')" prop="F_Description">
                      <el-input
                        type="textarea"
                        :placeholder="$t('databaseManage.dataSource.addModalWriteRemark')"
                        size="small"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        v-model="dataSourceForm.F_Description"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm('dataSourceForm')"
                :loading="flagAddDataSource"
                >
                {{flagAddDataSource?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                </el-button
              >
            </span>
          </el-dialog> 
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDataSource,
  getDbGroup,
  addDataSource,
  editDataSource,
  deleteDataSource,
  getDataFieldBySQL,
  getDataBySQL,
} from "@/api/databasemanage/datasource";
import {validateLength,validateDesLength,validateFuncLength} from "@/api/organization/validateFunc";
import {formValidateNotice} from '@/util/util';
import CodemirrorSql from "@/components/common/CodemirrorSql";
export default {
  name: "DataSource",
  props: {
	flag:{
		type: Boolean,
		default: () => {
		  return true;
		}
	},
	dataSourceForm:{
		type: Object,
		default: () => {
		  return {};
		}
	},
	formEnCodeList:''
  },
  computed: {
    ...mapGetters(["website"]),
  },
  components: {
    CodemirrorSql,
  },
  data() {
    return {
      flagAddDataSource: false,	
	  dialogTitle:this.$t('addDataSource'),
      dataSource: [],
      databaseGroup: [],
	  dataSourceForm:{
		  F_DbId:'localDB'
	  },
      rules: {
        F_Name: [{ required: true, message: this.$t('databaseManage.dataSource.addModalWriteName'), trigger: "change" },
          { validator: validateLength,trigger:'change'}
        ],
        F_Code: [{ required: true, message: this.$t('databaseManage.dataSource.addModalWriteCode'), trigger: "change" },
          { validator: validateLength,trigger:'change'}
        ],
        F_DbId: [
          { required: true, message: this.$t('databaseManage.dataSource.addModalSelectDatabase'), trigger: "change" }
        ],
        F_Sql: [
          { required: true, message: this.$t('databaseManage.dataSource.addModalWriteSQLstatement'), trigger: "change" },
          { validator: validateFuncLength,trigger:'change'}
        ],
        F_Description: [
          { validator: validateDesLength,trigger:'change'}
        ]
      },
    };
  },
  async created() {
	//本地数据库
    let res = await getDbGroup();
    this.FormatTree(res.data.data);
    
  },
  methods: {
	hasFormPermission(encode){
	  if(this.formEnCodeList===undefined){
		  return true;
	  }else{
		  if(this.formEnCodeList&&this.formEnCodeList[encode]){
			return true;
		  }else{
			return false;
		  }
	  }
	},
    FormatTree(data) {
      if (this.website.tenantEnabled) {
        this.databaseGroup.push({
          F_DBName: "租户库",
          F_DatabaseLinkId: "tenantDB"
        });
      }

	  for (var item in data) {
	  	if(item=='localhost'){
	  	  this.databaseGroup.unshift({
	  		  F_DBName: data[item][0].F_DBName,
	  		  F_DatabaseLinkId: data[item][0].F_DatabaseLinkId
	  	  })
	  	}else{
	  	  let obj = {
	  		F_DatabaseLinkId: item,
	  		F_DBName: item,
	  		disabled: false,
	  		children: []
	  	  };
	  
	  	  if (data[item]) {
	  		data[item].forEach(it => {
	  		  it.F_DBName = it.F_DBAlias;
	  		  it.F_DatabaseLinkId = it.F_DatabaseLinkId;
	  		  obj.children.push(it);
	  		});
	  	  }
	  	  this.databaseGroup.push(obj);
	     }
	  }

      //如果是多租户
    },
    /* 关闭 */
    closeDialog() {
      this.$emit('update:visible', false);
    },
    /* 提交 */
    submitForm(formName) {
      this.flagAddDataSource = true;
      this.$refs[formName]?.validate((valid,object) => {
        if (valid) {
          if (this.flag) {
            addDataSource(this.dataSourceForm).then(() => {
              this.$emit('update:visible', false);
            }).finally(() => {
              this.flagAddDataSource = false;
            });
          } else {
            editDataSource(this.dataSourceForm.F_Id, this.dataSourceForm).then(
              () => {
                this.$emit('update:visible', false);
              }
            ).finally(() => {
              this.flagAddDataSource = false;
            });
          }
        } else {
		  if(this.formEnCodeList!==undefined) formValidateNotice(object,this,this.formEnCodeList)
          this.flagAddDataSource = false;
          return false;
        }
      });
    }
  },
};
</script>

<style scoped>

</style>
