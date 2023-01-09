<template>
  <div class="main-container" style="">
    <el-form ref="form" :model="homeActiveData" label-width="80px">
      <el-form-item :label="$t('mobileDev.tableSet.labelTabTitle')">
        <el-input v-model="homeActiveData.F_Text"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('mobileDev.tableSet.labelDatabase')">
        <avue-input-tree default-expand-all v-model="homeActiveData.F_DataSourceId" :placeholder="$t('mobileDev.tableSet.placeholderSelect')" type="tree" :dic="treeList"></avue-input-tree>
      </el-form-item> -->
	  <el-form-item label="">
		<el-button type="primary" size="small" icon="el-icon-plus" @click="addDataSource">{{$t('addDataSource')}}</el-button>
	  </el-form-item>
      <el-form-item :label="$t('mobileDev.formRightSide.optionDataSource')">
        <el-select v-model="homeActiveData.sql" clearable @change="handleDataSourceChange"
                   :placeholder="$t('code.codeStepFour.hintDataOrigin')">
          <el-option
              v-for="item in treeList"
              :key="item.F_Id"
              :label="item.F_Name"
              :value="item.F_Id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('mobileDev.tableSet.labelField')">
        <avue-crud ref="queryTable" :data="homeActiveData.tableOption?homeActiveData.tableOption.column:[]" :option="queryoption" stripe @sortable-change="sortableChange">
          <template slot="add" slot-scope="scope">
            <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
          </template>     
          <template slot="prop" slot-scope="scope">
            <el-select v-model="scope.row.prop" :placeholder="$t('mobileDev.tableSet.placeholderSelect')">
              <el-option
                  v-for="item in FieldOptions"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </template>
          <template slot="label" slot-scope="scope">
            <el-input v-model="scope.row.label" :placeholder="$t('mobileDev.tableSet.placeholderFieldTitle')"></el-input>
          </template>
          <template slot="align" slot-scope="scope">
            <el-select v-model="scope.row.align" :placeholder="$t('mobileDev.tableSet.placeholderSelect')">
              <el-option
                  v-for="item in portionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="width" slot-scope="scope">
            <el-input v-model="scope.row.width" :placeholder="$t('mobileDev.tableSet.placeholderColumnWidth')" type="number"></el-input>
          </template>
          <template slot="total" slot-scope="scope">
            <el-radio v-model="scope.row.total" value="1" label="1" @change="changeRadio(scope.row)"></el-radio>
          </template>
          <template slot="count" slot-scope="scope">
            <el-checkbox v-model="scope.row.count" @change="changeCheckbox(scope.row)"></el-checkbox>
          </template> 
          <template slot-scope="scope" slot="menu">
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">{{$t('tableOperationModule.deleteBtn')}}</el-button>
          </template>    
        </avue-crud>
      </el-form-item>
    </el-form>  
	 <add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source>
  </div>
</template>

<script>
import {getDbFieldBySQL} from '@/api/databasemanage/databaselink.js';
import {getDataSource,getDataSourceField,getDataItem,getDataBySQL} from '@/api/databasemanage/datasource';
import {mapGetters} from "vuex";
import AddDataSource from '@/components/AddDataSource';
export default {
  props: [
    'treeList'
  ],
  computed: {
    ...mapGetters(['HomeAllStep','homeActiveData'])
  },
  components: {
  	AddDataSource
  },
  watch:{
  	dataSourceVisible: {
  	  handler (val) {
  	    if(!val) this.getDataSource()
  	  }
  	}  
  },
  data () {
    return {
		dataSourceVisible:false,
      FieldOptions:[],
      portionOptions: [
        {label:this.$t('mobileDev.tableSet.leftAlign'), value: 'left' }, {label:this.$t('mobileDev.tableSet.centerAlign'), value: 'center' }, { label:this.$t('mobileDev.tableSet.rightAlign'),value: 'right' }
      ],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        border: true,
        align: 'center',
        page: false,
        sortable: true,
        dragHandler: true,
        menu:false,
        header: false,
        column: [
          {
            label: '',
            prop: 'add',
            renderHeader: (h) => {
              return h('i',
                  {
                    style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                    class: 'el-icon-circle-plus',
                    on: {
                      click: this.addRow
                    }
                  }
              );
            },
            width: '50px',
            slot: true
          },
          {
            label:this.$t('mobileDev.tableSet.tabFieldName'),
            prop: 'prop',
            slot: true
          }, {
            label: this.$t('mobileDev.tableSet.tabTitle'),
            prop: 'label',
            slot: true
          },
          {
            label:this.$t('mobileDev.tableSet.tabAlign'),
            prop: 'align',
            slot: true
          },{
            label:this.$t('mobileDev.tableSet.tabWidth'),
            prop: 'width',
            slot: true
          }, {
            label:this.$t('mobileDev.tableSet.tabTotal'),
            prop: 'total',           
            width: '50px',
            slot: true
          }, {
            label: this.$t('mobileDev.tableSet.tabCount'),
            prop: 'count',           
            width: '50px',
            slot: true
          }
        ]
      }
    };
  },
  methods: {
	addDataSource(){
		this.dataSourceVisible=true
	},
    deleteData (scope) {
      this.homeActiveData.tableOption.column.splice(scope.row.$index, 1);
    },
    sortableChange (oldindex, newindex, row, list) {
      this.homeActiveData.tableOption.column = [];
      this.$nextTick(() => {
        this.homeActiveData.tableOption.column = list;
      });
    },
	async getDataSource(){
		//请求出数据源数据
		let resSource = await getDataSource();
		if(resSource.data.success){
		  const data = resSource.data.data;
		  if (data) {
			this.treeList = [...data];
		  }
		}
	},

   handleDataSourceChange(){
   	this.getDataField()
   },
   getDataField(){
   	if(!this.$validatenull(this.homeActiveData.sql)){
   		getDataSourceField(this.homeActiveData.sql).then(res => {
   			this.FieldOptions = res.data.data;
   		});
   	}
   },
    changeRadio(obj){
      this.homeActiveData.tableOption.showSummary=true;
      if(this.homeActiveData.tableOption.sumColumnList==undefined) this.homeActiveData.tableOption.sumColumnList=[];
      this.homeActiveData.tableOption.column.forEach((it,idx)=>{
        if(idx!=obj.$index){
          it.total="0";
        }else{
          it.count=false;
          let index=this.homeActiveData.tableOption.sumColumnList.findIndex(o=>o.type=='count'&&o.name==it.prop);
          if(index>=0) this.homeActiveData.tableOption.sumColumnList.splice(index,1)
          this.homeActiveData.tableOption.sumColumnList.push({
              name: it.prop,
              type: 'sum'            
          })
        }
        if(it.total!=1&&it.count==false){
          let index=this.homeActiveData.tableOption.sumColumnList.findIndex(o=>o.name==it.prop);

          if(index>=0) this.homeActiveData.tableOption.sumColumnList.splice(index,1)
        }

      })
    },
    changeCheckbox(obj){  
      this.homeActiveData.tableOption.showSummary=true;
      if(this.homeActiveData.tableOption.sumColumnList==undefined) this.homeActiveData.tableOption.sumColumnList=[];   
      let sumLen=0;
      this.homeActiveData.tableOption.column.forEach((it,idx)=>{
        if(idx==obj.$index){
          it.total="0";
          let index=this.homeActiveData.tableOption.sumColumnList.findIndex(o=>o.type=='sum'&&o.name==it.prop);
          if(index>=0) this.homeActiveData.tableOption.sumColumnList.splice(index,1)
          this.homeActiveData.tableOption.sumColumnList.push({
              name: it.prop,
              type: 'count'            
          })
        }
        if(it.total!=1&&it.count==false){
          sumLen+=1;
          let index=this.homeActiveData.tableOption.sumColumnList.findIndex(o=>o.name==it.prop);
          if(index>=0) this.homeActiveData.tableOption.sumColumnList.splice(index,1)
        }
      })
      if(sumLen==this.homeActiveData.tableOption.column.length){
        this.homeActiveData.tableOption.showSummary=false;
        delete this.homeActiveData.tableOption.sumColumnList;  
      }
    },
    addRow () {
      var obj = {
        prop: '',
        label: '',
        align: 'left',
        total: '0',
        count: false
      };
      this.homeActiveData.tableOption.column.push(obj);
    },
    
    //提交数据验证
    validateData () {
      
    }
  },
  created () {

    
  }
};
</script>

<style scoped>
.avue-crud {
  height: 500px;
}
::v-deep .el-radio__label{
  display: none;
}
</style>
