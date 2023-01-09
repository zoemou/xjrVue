<template>
  <el-form ref="dataDictionaryForm" :rules="rules" :model="dataDictionaryFormObj" label-width="80px">

    <el-form-item v-for="(item,index) in option.column" :label="item.label" :key="index" :prop="item.prop">
      <el-input v-model="dataDictionaryFormObj[item.prop]" :placeholder="$t('databaseManage.databaseTable.addSheet.placeholderWrite') + item.label"></el-input>
    </el-form-item>

    <br/>

    <avue-crud :option="optionCrud" :data="addCurdData">
      <template slot-scope="{row, type}" slot="menu">
        <el-button icon="el-icon-document" size="small" :type='type' @click="copyList(row)">{{$t('databaseManage.databaseTable.addSheet.copyBtn')}}</el-button>
      </template>
      <template slot="menuLeft">
        <el-button size="small" plain @click="handleAdd(1)">{{$t('databaseManage.databaseTable.addSheet.copyTableBtn')}}</el-button>
        <el-button size="small" plain @click="handleAdd(2)">{{$t('databaseManage.databaseTable.addSheet.commonFieldsBtn')}}</el-button>
        <el-button size="small" plain @click="handleAdd(3)">{{$t('databaseManage.databaseTable.addSheet.importDraftBtn')}}</el-button>
        <el-button size="small" plain @click="submitForm('dataDictionaryForm', 1)">{{$t('databaseManage.databaseTable.addSheet.saveDraftBtn')}}</el-button>
        <el-button size="small" plain @click="submitForm('dataDictionaryForm', 0)" :loading="flagDataTable">{{$t('databaseManage.databaseTable.addSheet.releaseBtn')}}</el-button>
      </template>
    </avue-crud>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="importTitle" :append-to-body="true"
	 :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <div class="form">
        <import-lists	
                ref="importList"
				:DBType="DBType"
                @cancel="cancel"
        ></import-lists>
      </div>
    </el-dialog>

  </el-form>
</template>
<script>
  import { getDbFieldByData, getDbFieldByName } from '@/api/databasemanage/databaselink';
  import { addDatabaseTableRelease, addOrUpdateDbDraft, getOrUpdateColumns } from '@/api/databasemanage/databasetable';
  import ImportLists from './import-lists';
  import {validateLength,validateDesLength} from "@/api/organization/validateFunc";
  export default {
    components: { ImportLists },
    props: {
      databaseTableId: {
        type: String,
        default: () => '',
      },
      databaseTableName: {
        type: String,
        default: () => '',
      },
      dataDictionaryForm: {
        type: Object,
        default: () => {},
      },
	  DBType:{
        type: String,
        default: () => '',
      }
    },
   data() {	   
     return {
       modulePermissionList: [],
      flagDataTable: false,
      DBTDialog: false,
      dataDictionaryFormObj: {},
      addCurdData: [],
      option: {
        expand: true,
        expandRowKeys: [],
        rowKey: 'Table_Name',
        highlightCurrentRow: true,
        stripe: true,
        menuWidth: 150,
        maxHeight: 550,
        border: true,
        page: false,
        index: false,
        menu: false,
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        delBtn: false,
        editBtn: false,
        column: [
          {
            label:this.$t('databaseManage.databaseTable.addSheet.titleTableName'),
            prop: 'name'
          }, {
            label: this.$t('databaseManage.databaseTable.addSheet.titleTableRemark'),
            prop: 'remark'
          },
        ]
      },
      optionCrud: {
        addBtn: false,
        sortable: true,
        menu: true,
        highlightCurrentRow: true, // 高亮
        editBtn: false,
        maxHeight: 300,
        addRowBtn: true,
        columnBtn: false, //列显隐按钮	Boolean
        refreshBtn: false, //	刷新按钮	Boolean
        align: 'center',
        column: []
      },
      databaseOpenList: [], // 表头
      databaseOpen: [], // 表体
      rules: {
        name: [
          { required: true, message:this.$t('databaseManage.databaseTable.addSheet.HintWriteTableName'), trigger: 'change' },
          { validator: validateLength, trigger:'change'}
        ],
        remark: [
          { required: true, message: this.$t('databaseManage.databaseTable.addSheet.HintWriteTableRemark'), trigger: 'change' },
          { validator: validateDesLength, trigger:'change'}
        ],
      },
      importTitle: '',
      dialogVisible: false
    }
   },
    created () {
      let tbCol = {
            label:this.$t('databaseManage.databaseTable.addSheet.tableColumnName'),
            prop: 'f_column',
            cell: true,
            rules: [
              {
                required: true,
                message: this.$t('databaseManage.databaseTable.addSheet.tableEnterColumnName'),
                trigger: 'blur'
              },
            ]
          };
      this.optionCrud.column.push(tbCol)    


      let tbDataTp =  {
            label: this.$t('databaseManage.databaseTable.addSheet.tableDataType'),
            prop: 'f_datatype',
            type: 'select',
            dicData:[],
            cell: true
          }
      this.optionCrud.column.push(tbDataTp)

      let tbLen = {
            label:this.$t('databaseManage.databaseTable.addSheet.tableLength'),
            prop: 'f_length',
            cell: true,
          }
      this.optionCrud.column.push(tbLen)

      let tbNull = {
            label: this.$t('databaseManage.databaseTable.addSheet.tableIsnullable'),
            prop: 'f_isnullable',
            dicData: [
              {
                label: '',
                value: 0
              }, {
                label: '',
                value: 1
              }],
            type: 'switch',
            cell: true
          }
      this.optionCrud.column.push(tbNull)

      let tbKey = {
            label:this.$t('databaseManage.databaseTable.addSheet.tableKey'),
            prop: 'f_key',
            dicData: [
              {
                label: '',
                value: 0
              }, {
                label: '',
                value: 1
              }],
            type: 'switch',
            cell: true
          }
      this.optionCrud.column.push(tbKey)

      let tbRemark = {
            label:this.$t('databaseManage.databaseTable.addSheet.tableRemark'),
            prop: 'f_remark',
            cell: true,
          }
      this.optionCrud.column.push(tbRemark)
    },
    mounted () {
      let typeOne=[{
		              label: 'varchar',
		              value: 'varchar'
		            }, {
		              label: 'int',
		              value: 'int'
		            }, {
		              label: 'double',
		              value: 'double'
		            }, {
		              label: 'text',
		              value:  'text'
		            }, {
		              label: 'datetime',
		              value:'datetime'
		            },{
					  label:'float',
					  value:'float'
					}]
		let typeTwo=[{
		              label: 'varchar2',
		              value:  'varchar2'
		            }, {
		              label: 'nvarchar2',
		              value:  'nvarchar2'
		            }, {
		              label: 'clob',
		              value: 'clob'
		            }, {
		              label: 'nclob',
		              value:'nclob'
		            }, {
		              label: 'number',
		              value:'number'
		            }, {
		              label: 'date',
		              value: 'date'
		            }, {
		              label: 'timestamp',
		              value:  'timestamp'
		            },{
					  label:'float',
					  value:'float'
					}]
		let typeThree=[{
		              label: 'varchar',
		              value: 'varchar'
		            }, {
		              label: 'int',
		              value: 'int'
		            },{
		              label: 'text',
		              value:  'text'
		            },{
		              label: 'nvarchar',
		              value:  'nvarchar'
		            }, {
		              label: 'datetime2',
		              value:  'datetime2'
		            },{
					  label:'float',
					  value:'float'
					}]

            let typefour=[{
		              label: 'varchar',
		              value: 'varchar'
		            }, {
		              label: 'int',
		              value: 'int'
		            }, {
		              label: 'double',
		              value: 'double'
		            }, {
		              label: 'text',
		              value:  'text'
		            }, {
		              label: 'datetime',
		              value:'datetime'
		            },{
					  label:'float8',
					  value:'float8'
					}]

          
      console.log(this.DBType,"FormatTree")
      this.optionCrud.column.forEach(ele => {
      if(ele.prop == 'f_datatype'){
        if(this.DBType.toLowerCase()=='mysql'){
          ele.dicData=[...typeOne]
        }else if(this.DBType.toLowerCase()=='oracle'){
          ele.dicData=[...typeTwo]
        }else if(this.DBType.toLowerCase()=='sqlserver'){
        ele.dicData=[...typeThree]
        }else if(this.DBType.toLowerCase()=='pgsql'){
          ele.dicData=[...typefour]
        }
        else if(this.DBType.toLowerCase()=='kingbasees'){
          ele.dicData=[...typefour]
        }
        else{
          ele.dicData=[...typeOne]
        }
      }
    })
    },
    methods: {
	  handleClose(){
		this.dialogVisible = false;  
	  },
      async cancel (row) {
        this.dialogVisible = false;
        if (!row) return;
        if (Object.prototype.toString.call(row) === '[object Array]') {
          row.forEach((item) => {
			  if(item.F_Content){
				  let arr=JSON.parse(item.F_Content);
				  arr.forEach(it=>{
					  //判断数据类型与当前数据库类型的数据类型是否一致，不一致置空
					  let type=''
					  if(this.optionCrud.column[1].dicData.find(o=>{return o.value==it.f_datatype})){
						  type=it.f_datatype
					  }
					  let obj={
					    $cellEdit:true,
					    f_column:it.f_column,
					    f_datatype:type,
					    f_length:it.f_length,
					    f_isnullable:parseInt(it.f_isnullable),
					    f_key:parseInt(it.f_key),
					    f_remark:it.f_remark
					  }
					  this.addCurdData.push(obj);
				  })
			  }else{
				  let type=''
				  if(this.optionCrud.column[1].dicData.find(o=>{return o.value==item.F_DataType})){
				  	type=item.F_DataType
				  }
				  let obj={
				    $cellEdit:true,
				    f_column:item.F_Name,
				    f_datatype:type,
				    f_length:item.F_Length,
				    f_isnullable:0,
				    f_key:0,
				    f_remark:item.F_Remark
				  }
				  this.addCurdData.push(obj);
			  }
            
          });

        } else if (row.name && row.id) {
          const { data: { data, code } } = await getOrUpdateColumns(row.id, row.name);
          if (code) return;
          // TODO 2个数据库表字段名不一样，导致复制表时，显示为空
          data.forEach((item) => {
			  let type=''
			  if(this.optionCrud.column[1].dicData.find(o=>{return o.value==item.Type})){
			  	type=item.Type
			  }
            let obj={
              $cellEdit:true,
              f_column:item.Name,
              f_datatype:type,
              f_length:item.Length,
              f_isnullable:item.IsNullable,
              f_key:item.IsKey,
              f_remark:item.Description
            }
            this.addCurdData.push(obj);
          });
        }
      },
      /* 打开数据表-获取表头 */
      async openDatabaseTable () {
        const { databaseTableName, databaseTableId } = this;

        if (!databaseTableName) return;

        const { data: { data, code } } = await getDbFieldByName(databaseTableId, databaseTableName);

        if (code) return;

        this.openDatabaseTableData(databaseTableId, databaseTableName);

        this.databaseOpenList = [];
        data.forEach(item => {
          this.databaseOpenList.push({
            Name: item.Name,
            Description: item.Description,
            IsKey: item.IsKey,
          });
        });

        this.DBTDialog = true;

      },
      /* 打开数据表-获取表体 */
      async openDatabaseTableData (databaseTableId, databaseTableName) {
        const { data: { data, code } } = await getDbFieldByData(databaseTableId, databaseTableName);
        if (code) return;
        this.databaseOpen = [];
        this.databaseOpen = data;
      },
      // 拷贝
      copyList (row) {
        let newRow = row;
        this.addCurdData.push({ ...newRow });
      },
      // 新建表-btn
      handleAdd (val) {
		  
        switch (val) {
          case 1:
            this.dialogVisible = true;
            this.importTitle = this.$t('databaseManage.databaseTable.addSheet.copyTableBtn');
            this.$nextTick(() => {				
              this.$refs['importList'].getIsForm();
            });
            break;
          case 2:
            this.dialogVisible = true;
            this.importTitle = this.$t('databaseManage.databaseTable.addSheet.commonFieldsBtn');
            this.$nextTick(() => {
              this.$refs['importList'].getField();
            });
            break;
          case 3:
            this.dialogVisible = true;
            this.importTitle =this.$t('databaseManage.databaseTable.addSheet.importDraftBtn');
            this.$nextTick(() => {
              this.$refs['importList'].getDBDraft();
            });
            break;
        }
      },
      /* 提交 */
      async submitForm (formName, type = 0) {
        //校验
          this.flagDataTable = true;
          let val = this.dataDictionaryFormObj.name;
          if(val){
            this.flagDataTable = false;
            let pattern = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9_]*$/gi);			
            if(!pattern.test(val)){
              this.$notify({
                title:this.$t('deletePrompt.promptTitle'),
                message:this.$t('tableNameMustStartWith LetterIncludeNumbersUnderscores'),
                type: 'warning'
              })
               return false;
            }
          }else{
            this.flagDataTable = false;
            this.$notify({
                title:this.$t('deletePrompt.promptTitle'),
                message: this.$t('databaseManage.databaseTable.addSheet.hintNoEmpty'),
                type: 'warning'
            });
            return false;
          }

        let valid;
        this.$refs[formName].validate((v) => {valid = v;});
        let idx=this.addCurdData.findIndex(o=>{return o.f_column==""||o.f_column==null||o.f_datatype==""||o.f_datatype==null})
        if(idx>=0){
          this.flagDataTable = false;
          valid=false;
          this.$notify({
            title: this.$t('deletePrompt.promptTitle'),
            message:this.$t('databaseManage.databaseTable.addSheet.promptNameAndDataType'),
            type: 'warning'
          });
        } 
       
        
        let count=0;
        if(valid){
          this.flagDataTable = false;
          let message = "";
          // 列名不能输入中文
          let pattern = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9_]*$/i);
          this.addCurdData.map((element,index) => {
            if(element.f_key==1) count+=1;			
            if(!pattern.test(element.f_column)){
              valid=false;
              message +='第'+(index+1)+'行,';
            }
            delete element.$index;
            delete element.isTrusted;
            return element;
          });
          
          if(!valid){
            this.flagDataTable = false;
            this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message: message+ this.$t('fieldNameMustStartWidthLetterNumberUnderscores'),
            type: 'warning'
            });
          }else{
           let temp =  this.addCurdData.filter(ele => {
             return  ele.f_column.length>100
           })
           let tempRemark = this.addCurdData.filter(ele => {
             return ele.f_remark.replace(/[^x00-xff]/g,'ab').length>1600
           })
           if(temp.length>0){
              this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('columnNamesMustBeWithin100Characters'),
              type: 'warning'
            });
           }
           if(tempRemark.length>0){
             this.$notify({
              title:this.$t('deletePrompt.promptTitle'),
              message: this.$t('descriptionMustBeWithin1600Characters'),
              type: 'warning'
            });
           }
          }
        }
        if(count>1){
          this.flagDataTable = false;
          valid=false;
          this.$notify({
            title:this.$t('deletePrompt.promptTitle'),
            message:this.$t('databaseManage.databaseTable.addSheet.promptKey'),
            type: 'warning'
          });
        }
        if (!valid) {
          this.flagDataTable = false;
          return
        };
        const { databaseTableId, dataDictionaryFormObj } = this;
        if (type) {
          this.flagDataTable = false;
          let datum = {
            F_Name:dataDictionaryFormObj.name,
            F_Remark:dataDictionaryFormObj.remark,
            F_Content: JSON.stringify(this.addCurdData),
          };
          const { data: { code } } = await addOrUpdateDbDraft(datum);
          if (!code) {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('databaseManage.databaseTable.addSheet.draftSavedSuccessfully'),
              type: 'success'
            });
            this.$emit('cancel');
          } else {
            this.$notify({
              title:this.$t('deletePrompt.failureTitle'),
              message:this.$t('databaseManage.databaseTable.addSheet.draftSavedFailure'),
              type: 'warning'
            });
          }
        } else {
          this.flagDataTable = false;
          let datum = {
            id: databaseTableId,
            ...dataDictionaryFormObj,
            content: this.addCurdData,
          };
          const { data: { code } } = await addDatabaseTableRelease(datum);
          if (!code) {
            this.$notify({
              title:this.$t('deletePrompt.successTitle'),
              message:this.$t('databaseManage.databaseTable.addSheet.launchSuccessful'),
              type: 'success'
            });
            this.$emit('cancel', 0);
          } else {
            this.$notify({
              title:this.$t('deletePrompt.failureTitle'),
              message:this.$t('databaseManage.databaseTable.addSheet.launchFailed'),
              type: 'warning'
            });
          }
        }
      }
    },
  };
</script>
<style scoped>
  .footer {
    text-align: right;
  }
  
.el-form .el-form-item:nth-child(1){
	  margin-bottom: 12px!important;
  }
  @media screen and (max-width: 1370px) {

  /deep/ .el-dialog{
  			margin-top: 10vh!important;
  		}
  }
</style>