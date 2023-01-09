<template>
  <div class="main-container">
    <main-fixed :title="$t('mobileDev.functionDesignStepTwo.fixedTitle')">
      <div slot="list">
        <el-tree :data="treeData" :props="defaultProps" node-key="F_DatabaseLinkId" :default-expanded-keys="parentDBId"
                 @node-click="handleNodeClick" ref="cTree"></el-tree>
      </div>
    </main-fixed>
    <main-content class="table-one" :title="$t('mobileDev.functionDesignStepTwo.headTitle')" :paddingLeft="210" :paddingTop="88" :paddingBottom="10" :collapse="false" :style="{height:boxOneHeight}">
      <div slot="search">
		 <p class="head_title">{{$t('mobileDev.functionDesignStepTwo.headTitle')}}</p>  
        <div class="search-box">
          <el-input v-model="keyword" size="small" :placeholder="$t('mobileDev.functionDesignStepTwo.searchFName')" style="width: 200px; margin-right: 20px"
                    @change="searchTable"

          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div slot="table" style="height: 100%;">
        <avue-crud ref="multipleTable" :data="tableData" :option="option" stripe @select="handleSelectionChange"
                   @selection-change="handleSelectAll"
                   @select-all="selectAll"
                   :table-loading="loading"></avue-crud>
      </div>
    </main-content>
    <main-content :title="$t('mobileDev.functionDesignStepTwo.setFTitle')" :paddingLeft="210" :paddingTop="40" :paddingBottom="0" :search="false"
                  :style="{height:boxTwoHeight}" style="margin-top: 10px;
    padding-bottom: 10px;">    
      <i slot="icon" :class="iconUp?'fa fa-angle-double-down':'fa fa-angle-double-up'" id="double-down" @click="hiddenBox"></i>
      <div slot="table" style="height: 100%;" v-if="relationBoxShow">
        <avue-crud ref="selectTable" :data="multipleSelection" :option="selectoption" stripe @row-del="rowDel"
                   :table-loading="DicLoading">
          <template slot="parentName" slot-scope="scope">
            <i :class="scope.row.parentName===0?'fa fa-circle-thin':'el-icon-success'"
               :style="scope.row.parentName===0?'color:#999;font-size:20px':'color:#409EFF;font-size:20px'"
               @click="changeMainTable(scope)"></i>
          </template>
          <template slot="field" slot-scope="scope">
            <el-select v-model="scope.row.field" :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationFieldFocus('field',scope.row.name)">
            <template   v-for="item in FieldOptions">
                <el-option
                 v-if="item.IsKey==0"
                   :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
             </template>
            </el-select>
            <div v-else style="color: #999;">{{$t('mobileDev.functionDesignStepTwo.Unsettable')}}</div>
          </template>
          <template slot="relationName" slot-scope="scope">
            <el-select v-model="scope.row.relationName" :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationTableFocus(scope.row.name)" @change="RelationTableChange(scope)">
              <el-option
                  v-for="item in TableOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
              </el-option>
            </el-select>
            <div v-else style="color: #999;">{{$t('mobileDev.functionDesignStepTwo.Unsettable')}}</div>
          </template>
          <template slot="relationField" slot-scope="scope">
            <el-select v-model="scope.row.relationField" :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSelect')" v-if="scope.row.parentName!=1"
                       @focus="RelationFieldFocus('relationField',scope.row.relationName)">
              <el-option
                  v-for="item in FieldOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <div v-else style="color: #999;">{{$t('mobileDev.functionDesignStepTwo.Unsettable')}}</div>
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
import store from '@/store/index';
import {mapGetters} from "vuex";
export default {
  computed: {
    ...mapGetters(['MDAllStepData'])
  },
  data () {
    return {
      loading: false,
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
        stripe: true,
        header: false,
        menu: false,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        index: true,
        indexLabel:this.$t('mobileDev.functionDesignStepTwo.tabNum'),
        page: false,
        align: 'center',
        selection: true,
        column: [
          {
            label:this.$t('mobileDev.functionDesignStepTwo.tabName'),
            prop: 'Table_Name'
          }, {
            label: this.$t('mobileDev.functionDesignStepTwo.tabDescription'),
            prop: 'Description'
          }
        ]
      },
      multipleSelection: [],
      FieldOptions: [], //根据表名查的关联字段集
      TableOptions: [],  //可选的关联表集
      selectoption: {
        highlightCurrentRow: true,
        stripe: true,
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
            label:this.$t('mobileDev.functionDesignStepTwo.tabParentName'),
            prop: 'parentName',
            /* 					formatter:function(row,value,label,column){
                        return value==0?''
                      }, */
            width: '50px',
            slot: true
          }, {
            label: this.$t('mobileDev.functionDesignStepTwo.tabDataName'),
            prop: 'name'
          },
          {
            label: this.$t('mobileDev.functionDesignStepTwo.tabField'),
            prop: 'field',
            //type:'select',
            slot: true
          }, {
            label: this.$t('mobileDev.functionDesignStepTwo.tabLinkForm'),
            prop: 'relationName',
            //type:'select',
            slot: true
          }, {
            label:this.$t('mobileDev.functionDesignStepTwo.tabLinkField'),
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
    handleNodeClick (data) {
      if (data.F_DatabaseLinkId) {
        this.selectDbId = data.F_DatabaseLinkId;        
        this.tableData = [];
        this.multipleSelection = [];
        this.loading = true;
        getDatabaseTable(data.F_DatabaseLinkId).then(res => {
          const { code, data } = res.data;
          if (code) return this.loading = false;
          this.copyTable = this.tableData = data;
          this.cacheSelection = [];  // 清空多选缓存
          const {
            selectDbId,
            MDAllStepData:{
              stepTwo
            }
          } = this;
          if (stepTwo.list.length > 0 && selectDbId == stepTwo.F_DbId) {

            this.$nextTick(function () {
              this.DicLoading = true;
              this.multipleSelection = stepTwo.list;
              const { multipleSelection } = this;

              let tamper = [];
              for (let i = multipleSelection.length - 1; i >= 0; i--) {
                let el = multipleSelection[i];
                let obj = this.tableData.find(function (item) {
                  return item.Table_Name == el.name;
                });
                if (obj) tamper.push(obj);
                if(el.parentName==1){
                  this.mainTableName=el;
                }
              }
              this.DicLoading = false;
              this.$refs.multipleTable.toggleSelection(tamper);
            });
          }
          this.loading = false;
        });
      }
    },
    searchTable (val) {
      this.isSearch = true;
      this.tableData = [...this.copyTable];
      if (val) {
        this.tableData = this.tableData.filter(function (item) {
          if (item.Table_Name.indexOf(val) >= 0) {
            return item;
          }
        });
        let obj = this.multipleSelection.find(item => {
          return item.name == this.keyword;
        });
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
            this.$refs.multipleTable.toggleSelection(tmparr);
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
         
            this.multipleSelection.push(obj);
  

          let temp = this.multipleSelection.find(item => {
            return item.parentName == 1;
          });
          if (!temp) {
            this.multipleSelection[0].parentName = 1;
            this.mainTableName = this.multipleSelection[0];
          }
        }
      } else {
        this.associationTableFilter()
      }
      
    },
    selectAll (selection) {
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
          this.multipleSelection[0].parentName = 1;
          this.mainTableName = this.multipleSelection[0];
        }
        this.mainTableName = this.multipleSelection[0];
      } else {
        this.tableData.map(item => {
          this.multipleSelection = this.multipleSelection.filter((v) => {
            return item.Table_Name !== v.name;
          });
        });
      }
    },
    handleSelectAll (selection, row) {
      
    },
    /*
    * 关联表过滤
    * */
    associationTableFilter () {
      if (this.multipleSelection.length === 1 && this.cacheSelection.length === 0 && this.multipleSelection[0].name === this.curRow.Table_Name) {
        this.multipleSelection = [];
      } else {
        this.multipleSelection = this.multipleSelection.filter((v) => {
          return this.curRow.Table_Name !== v.name;
        });
        this.cacheSelection = this.cacheSelection.filter((v) => {
          return this.curRow.Table_Name !== v.Table_Name;
        });
      }
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
          message:this.$t('mobileDev.functionDesignStepTwo.hintSelectForm'),
          type: 'error'
        });
      }
    },
    RelationTableChange (scope) {
      this.relationTableSelect(scope.row.relationName);
    },
    changeMainTable (scope) {
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
      this.curRow = { Table_Name: row.name };
      let idx = this.tableData.findIndex(function (item) {
        return item.Table_Name == row.name;
      });
      idx !== -1 && this.$refs.multipleTable.toggleRowSelection(this.tableData[idx], false);
      this.associationTableFilter();

      if (row.parentName == 1 && this.multipleSelection.length > 0) {
        this.multipleSelection[0].parentName = 1;
        this.mainTableName = this.multipleSelection[0];
      }
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
    },
    submitData(){
      this.MDAllStepData.stepTwo.F_DbId = this.selectDbId;      
      this.MDAllStepData.stepTwo.list=this.multipleSelection;
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
			  F_DatabaseLinkId: data[item][0].F_DatabaseLinkId,
			  label: item,
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

      this.treeData = [...treeList];
      if (this.MDAllStepData.stepTwo.F_DbId) {
        for (let i = 0; i < this.treeData.length; i++) {
          let chi = this.treeData[i].children;
          for (let j = 0; j < chi.length; j++) {
            if (chi[j].F_DatabaseLinkId == this.MDAllStepData.stepTwo.F_DbId) {
              this.parentDBId.push(this.treeData[i].F_DatabaseLinkId);
            }
          }
        }
        this.$nextTick(()=> {
          this.$refs.cTree.setCurrentKey(this.MDAllStepData.stepTwo.F_DbId);
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

.search-item>div{
	width: 100%;
}	
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top: 0px;
	line-height: 40px;
	margin-bottom: 8px;
	color: #4d4d4d;
}
/deep/ .main-header{
	font-size: 12px;
	font-weight: bold;
}
/deep/ .el-tree-node__label{
	font-size: 12px;
}

/deep/ .search-box{
	position: static!important;
}
.table-one /deep/ .main-table-content{
	height: calc(100% - 81px);
}
</style>
