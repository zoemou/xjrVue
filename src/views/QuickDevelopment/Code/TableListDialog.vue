<template>
  <el-dialog
    v-dialogDrag
    :title="$t('dataSheetProcessing')"
    :append-to-body="true"
    :visible.sync="visible"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    style="padding: 10px 20px"
  >
    <avue-crud :data="tableData" :option="option" stripe class="m-b">
      <!-- 
        表结构比对结果 status
        1  表结构相同
        2  表结构不同
        3  不存在该表
       -->
      <template slot="status" slot-scope="{ row }">
        <span v-if="row.status == 1" class="identical">{{$t('sameTableStructure')}}</span>
        <span v-if="row.status == 2" class="inequality">{{$t('differentTableStructures')}}</span>
        <span v-if="row.status == 3" class="non-existent"
          >{{$t('databaseTableNotexist')}}</span
        >
      </template>
      <!-- 
        操作 opr
        1  沿用旧表
        2  创建新表（重新生成表名）
        3  覆盖旧表
        4  不操作
       -->
      <template slot="opr" slot-scope="{ row }">
        <div v-if="row.status == 1">
          <el-radio :label="1" v-model="row.opr" :disabled="row.$index==0?false:subFormDisabled">{{$t('keepOldTable')}}</el-radio>
          <el-radio :label="2" v-model="row.opr"
            >{{$t('createNewTable')}}</el-radio
          >
          <el-radio :label="3" v-model="row.opr"
            >{{$t('overwriteOldTable')}}<span class="red">{{$t('operationClearOldTableData')}}</span></el-radio
          >
        </div>
        <div v-if="row.status == 2">
          <el-radio :label="2" v-model="row.opr"
            >{{$t('createNewTable')}}</el-radio
          >
          <el-radio :label="3" v-model="row.opr"
            >{{$t('overwriteOldTable')}}<span class="red">{{$t('operationClearOldTableData')}}</span></el-radio
          >
        </div>
        <div v-if="row.status == 3">
          {{$t('databaseTableNotexist')}}
        </div>
      </template>
      <template slot="newTableName" slot-scope="{ row }">
        <div v-if="row.opr == 2">
          <el-input
            v-model="row.newTableName"
            :placeholder="$t('code.codeStepTwoListStructure.hintTableName')"
          ></el-input>
        </div>
        <div v-else></div>
      </template>
    </avue-crud>
    <span slot="footer" class="dialog-footer">
       <el-button size="mini" type="primary" @click="handleClose()">{{
        $t("buttonModule.modalCancelBtn")
      }}</el-button>
      <el-button size="mini" type="primary" @click="submit()">{{
        $t("buttonModule.modalSureBtn")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getValidateTablename,getDatabaseValidateTable } from "@/api/databasemanage/databaselink";
export default {
  props: ["baseData","isEdit"],
  data() {
    return {
      visible: false,
      tableData: [],
      option: {
        index: true,
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        menuWidth: 150,
        heigth: 400,
        border: true,
        page: false,
        index: false,
        companyId: "",
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [
          {
            label: this.$t('databaseManage.dataLink.nameDatabase'),
            prop: "databaseName",
            width: 100,
          },
          {
            label:this.$t('code.codeStepOne.tabDataName'),
            prop: "tableName",
            width: 100,
          },
          {
            label: this.$t('tabStrConfigCompRes'),
            prop: "status",
            width: 200,
            slot: true,
          },
          {
            label: this.$t('workFlow.userButtonSetting.tableOperate'),
            prop: "opr",
            slot: true,
          },
          {
            label: this.$t('newTableName'),
            prop: "newTableName",
            width: 200,
            slot: true,
          },
        ],
      },
    };
  },
  computed: {
    subFormDisabled() {
      if(this.tableData.length>0){
        if(this.tableData[0].opr==2){
          this.tableData = this.tableData.map(ele=>{
            ele.opr = ele.opr==1?2:ele.opr;
            return ele;
          });
        }
        return this.tableData[0].opr==2?true:false;
      }else{
        return false
      }
      
    }
  },
  async created () {
   await this.validationTableName();
  },
  methods: {
    async submit() {
      let tableNameoprData = this.tableData.filter(ele=>{
        return ele.opr == 2
      });
      if(tableNameoprData.length>0){
        let newTableNameData = this.tableData.filter(ele=>{
        return ele.newTableName
      });
      if(tableNameoprData.length != newTableNameData.length){
        this.$message({ message:this.$t('hintNewTableNameNoEmpty'),type: 'warning'});
        return false;
      }
      let tableNameData = this.tableData.filter(ele=>{
        return ele.newTableName==ele.tableName
      });
      if(tableNameData&&tableNameData.length>0){
        this.$message({ message:this.$t('hintNewTableNameNotSame'),type: 'warning'});
        return false;
      }
      }
      let {valid,message,needChange} = await this.validationGenerateTableName();
      if(valid){
        if(needChange){
          let changeDataMap = new Map();
          this.tableData.forEach(element => {
            changeDataMap.set(element.tableName,{newTableName:element.newTableName,opr:element.opr});
          });
          this.baseData.step1.list = this.baseData.step1.list.map(element => {
            let hasData = changeDataMap.has(element.formName);
            if(hasData){
              let val = changeDataMap.get(element.formName);
              element.formName=val.opr==2?val.newTableName:element.formName;
              element.opr=val.opr;
            }
            return element;
          });
          }
          this.visible = false;
        this.$emit('close',true);
      }else{
        if(message){
          this.$message(message);
        }
      }
    },
    handleClose(){
       this.visible = false;
      this.$emit('close',false);
    },
    async validationTableName() {
      this.tableData = [];
      let F_DbId = this.baseData.step1.F_DbId;
       let list = this.baseData.step1.list.map((element,index)=>{
         element.parentName = index===0?1:0;//是否未主表
         return element;
       });
      try {
        let res = await getDatabaseValidateTable(F_DbId,list);
        if(res.data.success){
          if(!Array.isArray(res.data.data)){
            this.$message('服务器返回数据错误');
             this.$emit('close',false);
            return false;
          }
          let tableData = res.data.data;

          let tableStatusList = tableData.filter(ele=>{
              return ele.status==3;//status==3【不存在该表】
          });
          let theTableDoesNotExist = (tableStatusList.length===tableData.length);
          if(this.isEdit){
            // 编辑，所有表数据库中不存在的时候，直接通过，否则，弹出表结构比对
             if(theTableDoesNotExist){
                this.baseData.step1.list = this.baseData.step1.list.map(element => {
                element.opr = 4;
                  return element;
                });
                this.visible = false;
                this.$emit('close',true);
             }else{
               this.tableData = tableData.map(ele=>{
                if(ele.status==1||ele.status==2){
                  ele.opr = 2;
                }else if(ele.status==3){//不存在该表
                  ele.opr = 4;
                }
                return ele;
              });
              this.visible = true;
             }
          }else{
            // 新增，所有表数据库中不存在的时候，直接通过，否则，需要提示“该数据表已存在请重新输入”
            if(theTableDoesNotExist){
               this.visible = false;
               this.$emit('close',true);
            }else{
              let tableNameArr = tableData.filter(ele=>{
                if(ele.status!=3){
                  return ele;
                }
              }).map(ele=>{
                return ele.tableName;
              });
              this.$message(tableNameArr.join(',')+"数据表已存在请重新输入");
              this.$emit('close',false);
            }
          }
        }
      } catch (error) {
      }
      
    },
    async validationGenerateTableName() {
      let tableNameData = this.tableData.filter(ele=>{
        return ele.opr == 2
      });
      if(tableNameData.length>0){
        let id = this.baseData.step1.F_DbId;
        let tables =  tableNameData.filter(ele=>{
          return ele.newTableName
        });
         let tableNames = '';
         if(tables.length>0){
           tableNames = tables.map(ele=>{
             return ele.newTableName
           }).join(',');
         }
        if(tableNames){
          try {
            let res = await getValidateTablename(id,tableNames);
            if(res.data.success){
              return {valid:true,message:this.$t('workFlow.WFMenu.hintSuccess'),needChange:true};
            }else{
              return {valid:false,message:'',needChange:false};
            }
          } catch (error) {
            return {valid:false,message:'',needChange:false};
          }
        }else{
          return {valid:false,message:this.$t('hintFillFormName'),needChange:false};
        }
      }else{
        return {valid:true,message:this.$t('hintNoNewTableNameValidate'),needChange:true};
      }
      
    },
  },
};
</script>

<style lang="css" scoped>
.non-existent {
  color: #000;
}
.identical {
  color: #02a7f0;
}
.inequality {
  color: #f6a233;
}
.red {
  color: red;
}
div /deep/ .el-radio__label {
  font-size: 12px;
}
.m-b{
  margin-bottom: 120px;
}
</style>
