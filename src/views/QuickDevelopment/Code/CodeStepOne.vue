<template>
  <div class="main-container">
    <main-fixed :title="$t('code.codeStepOne.databaseList')">
      <div slot="list">
        <el-tree :data="treeData" :props="defaultProps" node-key="F_DatabaseLinkId" :default-expanded-keys="parentDBId"
                 @node-click="handleNodeClick" ref="cTree"></el-tree>
      </div>
    </main-fixed>
    <main-content class="table-one" :title="$t('code.codeStepOne.datasheetSelect')" :paddingLeft="210" :paddingTop="88" :paddingBottom="10" :collapse="false" :style="{height:boxOneHeight}">
      <div slot="search">
		 <p class="head_title">{{$t('code.codeStepOne.datasheetSelect')}}</p>
        <div class="search-box-sub">
          <el-input v-model="keyword" size="small" :placeholder="$t('code.codeStepOne.placeholderFormName')" style="width: 200px; margin-right: 20px"
                    @change="searchTable"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div slot="table" style="height:calc(100% - 70px);">
        <avue-crud ref="multipleTable" 
                   :data="tableData" 
                   :option="option" 
                   stripe 
                   @select="handleSelectionChange"
                   @selection-change="handleSelectAll"
                   @row-click="handleRowClick"
                   @select-all="selectAll"
                   class="pb20"></avue-crud>
      </div>
    </main-content>
    <main-content :title="$t('mobileDev.functionDesignStepTwo.setFTitle')" :paddingLeft="210" :paddingTop="40" :search="false"
                  :style="{height:boxTwoHeight}">
      <i slot="icon" :class="iconUp?'fa fa-angle-double-down':'fa fa-angle-double-up'" id="double-down" @click="hiddenBox"></i>
      <div slot="table" style="height: 100%;" v-if="relationBoxShow">
        <avue-crud ref="selectTable" 
                   :data="multipleSelection" 
                   :option="selectoption" 
                   stripe 
                   @row-del="rowDel"
                   :table-loading="DicLoading"
                   >
          <template slot="parentName" slot-scope="scope">
            <i :class="scope.row.parentName===0?'fa fa-circle-thin':'el-icon-success'"
               :style="scope.row.parentName===0?'color:#999;font-size:20px':'color:#409EFF;font-size:20px'"
               @click="changeMainTable(scope)"></i>
          </template>
          <template slot="field" slot-scope="scope">
            <el-select v-model="scope.row.field" :placeholder="$t('code.codeStepOne.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationFieldFocus('field',scope.row.name)" filterable>
             <template   v-for="item in FieldOptions">
                <el-option
                 v-if="item.IsKey==0"
                   :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
             </template>
            </el-select>
            <div v-else style="color: #999;">{{$t('code.codeStepOne.noSet')}}</div>
          </template>
          <template slot="relationName" slot-scope="scope">
            <el-select v-model="scope.row.relationName" :placeholder="$t('code.codeStepOne.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationTableFocus(scope.row.name)" @change="RelationTableChange(scope)">
              <el-option
                  v-for="item in TableOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
              </el-option>
            </el-select>
            <div v-else style="color: #999;">{{$t('code.codeStepOne.noSet')}}</div>
          </template>
          <template slot="relationField" slot-scope="scope">
            <el-select v-model="scope.row.relationField" :placeholder="$t('code.codeStepOne.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationFieldFocus('relationField',scope.row.relationName)" filterable>
              <el-option
                  v-for="item in FieldOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <div v-else style="color: #999;">{{$t('code.codeStepOne.noSet')}}</div>
          </template>
        </avue-crud>
      </div>
    </main-content>
  </div>

</template>

<script>
import { getDatabaseTableTree, getDatabaseTable, getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import MainFixed from '../../../page/main/MainFixed';
import MainContent from '../../../page/main/MainContent';

export default {
  props: [
    'baseData'
  ],
  data () {
    return {
      DicLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentDBId: [],
      iconUp: true,
      tableData: [],
      cacheSelection: [],
      keyword: '',
      relationBoxShow: true,
      boxTwoHeight: '40%',
      boxOneHeight: '60%',
      option: {
        highlightCurrentRow: true,
        stripe: false,
        header: false,
        menu: false,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        index: true,
        indexLabel:this.$t('code.codeStepOne.tabNum'),
        page: false,
        align: 'center',
        selection: true,
        column: [
          {
            label:this.$t('code.codeStepOne.tabTableName'),
            prop: 'Table_Name',
			align: 'left'
          }, {
            label:this.$t('code.codeStepOne.tabDescription'),
            prop: 'Description',
			align: 'left'
          }
        ]
      },
      multipleSelection: [],
      FieldOptions: [], //根据表名查的关联字段集
      TableOptions: [],  //可选的关联表集
      selectoption: {
        highlightCurrentRow: true,
        stripe: false,
        header: false,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        editBtn: false,
        page: false,
        menuWidth: 80,
        column: [
          {
            label: this.$t('code.codeStepOne.tabMainTable'),
            prop: 'parentName',
            /* 					formatter:function(row,value,label,column){
                        return value==0?''
                      }, */
            width: '50px',
            slot: true,
			
          }, {
            label:this.$t('code.codeStepOne.tabDataName'),
            prop: 'name',
			align: 'left'
          },
          {
            label: this.$t('code.codeStepOne.tabAssoField'),
            prop: 'field',
            //type:'select',
            slot: true
          }, {
            label:this.$t('code.codeStepOne.tabAssoTable'),
            prop: 'relationName',
            //type:'select',
            slot: true
          }, {
            label:this.$t('code.codeStepOne.relationField'),
            prop: 'relationField',
            //type:'select',
            slot: true
          }
        ]
      },
      mainTableName: '',
      curRow: '',
      isSearch: false,
      selectDbId: '',
      relationField: '',
      relationTable: [],
      relationTableField: [],
      relationForm: {},
      copyTable: []  //复制表名数组，用于搜索表
    };
  },
  components: {
    MainFixed,
    MainContent
  },
  methods: {
    handleRowClick(row,event,column){
      this.$refs.multipleTable.toggleRowSelection(row);
      this.handleSelectionChange('',row);
    },
    handleNodeClick (data) {
	  if(data.disabled){
		  return;
	  }
      this.tableData = [];
      if (data.F_DatabaseLinkId) {
        this.selectDbId = data.F_DatabaseLinkId;
        this.multipleSelection = []; // 清空关联字段配置
        getDatabaseTable(data.F_DatabaseLinkId).then(res => {
          const { code, data } = res.data;
          this.copyTable = this.tableData = data;
          this.cacheSelection = [];  // 清空多选缓存
          
          // this.copyTable = [...data];
          console.log(this.tableData, '--------', this.copyTable);
          const {
            selectDbId,
            baseData: {
              step1
            },
          } = this;
          if (step1.list.length > 0 && selectDbId == step1.F_DbId) {

            this.$nextTick(function () {
              this.DicLoading = true;
              this.multipleSelection = step1.list;
              
              const { multipleSelection } = this;

              let tamper = [];
              for (let i = multipleSelection.length - 1; i >= 0; i--) {
                let el = multipleSelection[i];
				if(el.parentName==1) this.mainTableName=el
                let obj = this.tableData.find(function (item) {
                  return item.Table_Name == el.name;
                });
                if (obj) tamper.push(obj);
              }
              this.DicLoading = false;
              this.$refs.multipleTable.toggleSelection(tamper);
            });
          }
        });
      }
    },
    searchTable (val) {
      console.log('搜索表', val, this.keyword);
      this.isSearch = true;
      this.tableData = [...this.copyTable];
      if (val) {
        this.tableData = this.tableData.filter(function (item) {
          if (item.Table_Name.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
            return item;
          }
        });
        let obj = this.multipleSelection.find(item => {
          return item.name == this.keyword;
        });
        console.log('//////////////////', obj);
        if (obj) {
          let temp = this.tableData.find(item => {
            return item.Table_Name == this.keyword;
          });
          this.$nextTick(function () {
            this.$refs.multipleTable.toggleSelection([temp]);
          });
        } else {
          if (this.multipleSelection.length > 0) {
            let tmparr = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              let el = this.multipleSelection[i];
              let obj = this.tableData.find(function (item) {
                return item.Table_Name == el.name;
              });
              if (obj) tmparr.push(obj);
            }
            this.$nextTick(function () {
              this.$refs.multipleTable.toggleSelection(tmparr);
            });
          }
        }
      } else {
        this.curRow = '';
        if (this.multipleSelection.length > 0) {
          let tmparr = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let el = this.multipleSelection[i];
            let obj = this.tableData.find(function (item) {
              return item.Table_Name == el.name;
            });
            if (obj) tmparr.push(obj);
          }
          console.log('aaaaaaaaaaa', tmparr);
          this.$nextTick(function () {
            this.$refs.multipleTable.toggleSelection(tmparr);
          });
        }
      }
    },
    handleSelectionChange (selection, row) {
      this.curRow = row;
      let newRow = this.cacheSelection.find((item, i) => {
        return item.Table_Name === row.Table_Name;
      });
      if (newRow === undefined) {
        let isRepetition = this.multipleSelection.filter((v) => {
          return this.curRow.Table_Name === v.name;
        });
        console.log(isRepetition);
        if (isRepetition.length < 1) {
          this.cacheSelection.push(row);

          let obj = {
            name: this.curRow.Table_Name,
            pk: this.curRow.Table_PK,
            parentName: 0,
            field: '',
            relationName: '',
            relationField: ''
          };
          // let obj1 = this.multipleSelection.find(item => {
          //   return item.name == this.curRow.Table_Name;
          // });
          // if (!obj1) {
          //   console.log(obj);
            this.multipleSelection.push(obj);
          // }

          let temp = this.multipleSelection.find(item => {
            return item.parentName == 1;
          });
          if (!temp) {
            console.log(this.multipleSelection);
            this.multipleSelection[0].parentName = 1;
            this.mainTableName = this.multipleSelection[0];
          }
        }
      } else {
        // this.cacheSelection.splice(newRow, 1);
        this.associationTableFilter()
      }
      console.log(selection, row, '------303----------', this.cacheSelection, this.multipleSelection);
    },
    selectAll (selection) {
      console.log(selection, '-----306-------');
      if (selection.length > 0) {
        let tempArr = [];
        selection.map((item) => {
          let obj = {
            name: item.Table_Name,
            pk: item.Table_PK,
            parentName: 0,
            field: '',
            relationName: '',
            relationField: ''
          };
          tempArr.push(obj);
        });
        this.multipleSelection = this.multipleSelection.concat(tempArr);
        let temp = this.multipleSelection.find(item => {
          return item.parentName == 1;
        });
        if (!temp) {
          console.log(this.multipleSelection);
          this.multipleSelection[0].parentName = 1;
          this.mainTableName = this.multipleSelection[0];
        }
        // this.multipleSelection[0].parentName === 1 || (this.multipleSelection[0].parentName = 1);
        this.mainTableName = this.multipleSelection[0];
      } else {
        console.log(this.tableData, '------324----');
        this.tableData.map(item => {
          this.multipleSelection = this.multipleSelection.filter((v) => {
            return item.Table_Name !== v.name;
          });
        });
      }
      console.log(this.multipleSelection, this.cacheSelection);
    },
    handleSelectAll (selection, row) {
      console.log('全选', selection, row, '-------', this.tableData, '------', this.curRow, '-----', this.multipleSelection, this.cacheSelection);
      // if (this.cacheSelection.length >= this.multipleSelection.length) {
      //   //选中了某一条
      //   console.log('选中了某一条', this.curRow);
      //   if (this.curRow) {
      //     let obj = {
      //       name: this.curRow.Table_Name,
      //       pk: this.curRow.Table_PK,
      //       parentName: 0,
      //       field: '',
      //       relationName: '',
      //       relationField: ''
      //     };
      //     let obj1 = this.multipleSelection.find(item => {
      //       return item.name == this.curRow.Table_Name;
      //     });
      //     if (!obj1) {
      //       console.log(obj);
      //       this.multipleSelection.push(obj);
      //     }
      //
      //     let temp = this.multipleSelection.find(item => {
      //       return item.parentName == 1;
      //     });
      //     if (!temp) {
      //       console.log(this.multipleSelection);
      //       this.multipleSelection[0].parentName = 1;
      //       this.mainTableName = this.multipleSelection[0];
      //     }
      //   }
      // } else {
      //   //取消选中了某一条
      //   this.associationTableFilter();
      // }
    },
    /*
    * 关联表过滤
    * */
    associationTableFilter () {
      if (this.multipleSelection.length === 1 && this.cacheSelection.length === 0 && this.multipleSelection[0].name === this.curRow.Table_Name) {
        this.multipleSelection = [];
      } else {
        this.multipleSelection = this.multipleSelection.filter((v) => {
          console.log(this.curRow.Table_Name !== v.name, '==========');
          return this.curRow.Table_Name !== v.name;
        });
        this.cacheSelection = this.cacheSelection.filter((v) => {
          return this.curRow.Table_Name !== v.Table_Name;
        });
      }
      console.log('--------', this.multipleSelection, this.cacheSelection);
    },
    cacelSelectFun () {
      if (this.curRow) {
        let obj = this.multipleSelection.find(item => {
          return item.name == this.curRow.Table_Name;
        });
        this.multipleSelection = this.multipleSelection.filter((item) => {
          return item.name != this.curRow.Table_Name;
        });
        if (this.multipleSelection.length > 0 && obj.parentName == 1) {
          this.multipleSelection[0].parentName = 1;
          this.mainTableName = this.multipleSelection[0];
        }
      } else {
        this.mainTableName = this.multipleSelection.find(item => {
          return item.parentName == 1;
        });
      }
    },
    RelationTableFocus (val) {
      let tempArr = [];
      this.multipleSelection.forEach((item) => {
        if (item.name != val) {
          tempArr.push({
            value: item.name
          });
        }
      });
      this.TableOptions = tempArr;
    },
    async RelationFieldFocus (str, val) {
      if (val) {
        let res = await  getDatabaseTableColumns(this.selectDbId, val);
       const data = res.data.data;
          this.FieldOptions = [];
          data.forEach(item => {
            this.FieldOptions.push({
              label: item.Name,
              value: item.Name,
              IsKey:item.IsKey
            });
          });
      } else if (!val && str == 'relationField') {
        this.FieldOptions = [];
        this.$message({
          message:this.$t('code.codeStepOne.hintSelectTable'),
          type: 'error'
        });
      }
    },
    RelationTableChange (scope) {
      //console.log('RelationTableChange',scope)
      this.relationTableSelect(scope.row.relationName);
    },
    changeMainTable (scope) {
      console.log('切换主表', scope, this.mainTableName, this.multipleSelection);
      let mainTable = this.multipleSelection.filter(item => {
        return scope.row.name === item.name;
      });
      if (mainTable.parentName != 1) {
        let that = this;
        this.multipleSelection.filter(item => {
          return scope.row.name === item.name && (item.parentName = 1);
        });
        // this.multipleSelection[scope.row.name].parentName = 1;
        //this.multipleSelection[scope.row.$index].field='';
        //this.multipleSelection[scope.row.$index].relationName='';
        //this.multipleSelection[scope.row.$index].relationField='';
        let index = this.multipleSelection.findIndex(function (item) {
          return item.name == that.mainTableName.name;
        });
        this.multipleSelection[index].parentName = 0;
        this.mainTableName = this.multipleSelection[scope.row.$index];
      }
    },
    relationTableSelect (row) {
      getDatabaseTableColumns(this.selectDbId, row).then(res => {
        const data = res.data.data;
        this.fieldOptions = [];
        data.forEach(item => {
          this.fieldOptions.push({
            label: item.Name,
            value: item.Name
          });
        });
      });
    },
    rowDel (row, index) {
      console.log('删除行', row,this.curRow, index, this.multipleSelection, this.tableData);
      this.curRow = { Table_Name: row.name };
      let idx = this.tableData.findIndex(function (item) {
        return item.Table_Name == row.name;
      });
      console.log([this.tableData[idx]]);
      idx !== -1 && this.$refs.multipleTable.toggleRowSelection(this.tableData[idx], false);
      this.associationTableFilter();

      if (row.parentName == 1 && this.multipleSelection.length > 0) {
        this.multipleSelection[0].parentName = 1;
        this.mainTableName = this.multipleSelection[0];
      }
    },
    //提交数据验证
    validateData () {
      console.log('第一步配置数据库最终数据', this.multipleSelection);
      let curList = this.multipleSelection;
      curList.forEach(item => {
        if (item.parentName == 1) {
          item.field = '';
          item.relationName = '';
          item.relationField = '';
        }
      });
      if (curList.length <= 0) {
        this.$message({
          message: this.$t('code.codeStepOne.hintSelectDatatable'),
          type: 'error'
        });
        return false;
      } else {
        let temp = [...curList];
        temp = temp.filter(function (item) {
          return item.parentName == 0;
        });
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].field == '') {
            this.$message({
              message: this.$t('code.rightPanel.selectSheet') +'[' + temp[i].name + ']' + this.$t('associatedFields'),
              type: 'error'
            });
            return false;
          } else if (temp[i].relationName == '') {
            this.$message({
              message: this.$t('code.rightPanel.selectSheet')+'[' + temp[i].name + ']'+ this.$t('associativeTable'),
              type: 'error'
            });
            return false;
          } else if (temp[i].relationField == '') {
            this.$message({
              message:this.$t('code.rightPanel.selectSheet') + '[' + temp[i].name + ']'+this.$t('fieldAssociatedTable'),
              type: 'error'
            });
            return false;
          }
        }
      }
      this.$emit('onChange', { 'F_DbId': this.selectDbId, 'list': curList });
      return true;
    },
    hiddenBox () {
      this.iconUp = !this.iconUp;
      if (!this.iconUp) {
        this.relationBoxShow = false;
        this.boxTwoHeight = '51px';
        this.boxOneHeight = 'calc(100% - 51px)';
      } else {
        this.relationBoxShow = true;
        this.boxTwoHeight = '40%';
        this.boxOneHeight = '60%';
      }
    }
  },
  created () {
    getDatabaseTableTree().then(res => {
      const data = res.data.data;

      let treeList = [];

      for (var item in data) {
		  if(item=='localhost'){
			  treeList.unshift({
				  label: data[item][0].F_DBName,
				  F_DatabaseLinkId: data[item][0].F_DatabaseLinkId,
				  children:[]
			  })
			}else{
			  let obj = {
				F_DatabaseLinkId: item,
				label: item,
				disabled:true,
				children: []
			  };
		
			  if (data[item]) {
			    data[item].forEach(it => {
			      it.label = it.F_DBAlias;
			      obj.children.push(it);
			    });
			  }
			  treeList.push(obj);
		  }       
      }

      console.log('treeList', treeList, this.baseData);
      this.treeData = [...treeList];
      if (this.baseData.step1.F_DbId) {
        for (let i = 0; i < this.treeData.length; i++) {
          let chi = this.treeData[i].children;
          for (let j = 0; j < chi.length; j++) {
            if (chi[j].F_DatabaseLinkId == this.baseData.step1.F_DbId) {
              this.parentDBId.push(this.treeData[i].F_DatabaseLinkId);
            }
          }
        }
        this.$nextTick(function () {
          this.$refs.cTree.setCurrentKey(this.baseData.step1.F_DbId);
          this.handleNodeClick(this.$refs.cTree.getCurrentNode());
        });
      }else{
        this.$nextTick(function () {
          this.$refs.cTree.setCurrentKey('localDB');
          this.handleNodeClick(this.$refs.cTree.getCurrentNode());
        });
        
      }
    });
  }
};
</script>

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

::v-deep .main-search .main-search-box {
  padding: 8px;
}

::v-deep .main-table-content {
  padding: 8px;
  padding-bottom: 10px!important;
  border-top:none;
  overflow: hidden;
}

::v-deep .avue-crud__tip {
  display: none;
}

#double-down {
  font-size: 20px;
  color: #409eff;
  position: absolute;
  right: 50px;
  top: 0;
  line-height: 40px;
  z-index: 9999;
}
.pb20{
  padding-bottom: 20px;
}
.search-item>div{
	width: 100%;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:0px;
	line-height: 38px;
	color: #4d4d4d;
	margin-bottom: 0px;
}
.search-box-sub{
	margin: 7px 0 0px 0px;
}
div /deep/ .main-search{
	border-top: none;
}
div /deep/ .el-input__icon{
	line-height: 20px;
}
div /deep/ .main-fixed .main-header{
	font-size: 12px;
	height: 38px;
	line-height: 38px;
	font-weight: bold;
}
div /deep/ .el-tree-node__label{
	font-size: 12px;
}
.table-one /deep/ .main-table{
	overflow: hidden;
}
.avue-crud /deep/ .avue-crud__menu{
  height: 0;
}
</style>
