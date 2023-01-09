<template>
  <div class="main-container">
	<div class="crudTitle">{{$t('workFlow.zh.inputParameter')}}</div>
	<el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 10px;height: calc(100% - 64px);">
		<el-tab-pane :label="item.label" :name="item.value+''" v-for="item in axiosMethod" :key="item.value">
			<!-- @sortable-change="sortableChange" -->
			<avue-crud ref="queryTable" :data="tempParameter" :option="queryoption" stripe>
			  <template slot="add" slot-scope="scope">
			    <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" 
				@click="deleteData(scope)"></i>
			  </template>
			  <template slot="isChecked" slot-scope="scope">
			    <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
			  </template>
			  <template slot="paramKey" slot-scope="scope">
				  <el-input v-model="scope.row.paramKey" :placeholder="$t('enterParamterName')"></el-input>        
			  </template>
			  <template slot="paramValue" slot-scope="scope">
			    <el-input v-model="scope.row.paramValue" :placeholder="$t('enterParameterValueDefaultValue')"></el-input>
			  </template>
			  <template slot="paramVolidate" slot-scope="scope">
			    <el-select v-model="scope.row.paramVolidate" :placeholder="$t('selectVerification')" clearable>
			      <el-option
			          v-for="item in DateFieldOptions"
			          :key="item.F_ItemDetailId"
			          :label="item.F_ItemName"
			          :value="parseInt(item.F_ItemValue)">
			      </el-option>
			    </el-select>
			  </template>
			  <template slot="paramDes" slot-scope="scope">				 
			  	 <el-input v-model="scope.row.paramDes" :placeholder="$t('workFlow.Process.placeholderRemark')"></el-input>        
			  </template>
			</avue-crud>
		</el-tab-pane>
	</el-tabs>
	
  </div>
</template>

<script>
import { getDataDetail } from '@/api/system/dataitem';
import store from '@/store';
import { mapGetters } from "vuex";
import { axiosMethod } from '@/util/util';

export default {
  props: [
    'curStep'
  ],
  computed: {
    ...mapGetters(["inputParameter"])	
  },
  watch: {
    activeName (val, oldVal) {
      //this.queryoption.column[4].hide=val>0?false:true
	}
  },
  data () {
    return {
	  activeName:'2',
	  axiosMethod:axiosMethod,
      DateFieldOptions: [],
	  tempParameter:[],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        menu: false,
        page: false,
        sortable: false,
        dragHandler: true,
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
            label: this.$t('workFlow.User.tableSelect'),
            prop: 'isChecked',
            width: '60px',
            slot: true
          }, {
            label:this.$t('parameterNameKey'),
            prop: 'paramKey',
            slot: true,
			align:'left'
          },
          {
            label: this.$t('parameterValue'),
            prop: 'paramValue',
            slot: true,
			align:'left'
          }, 
		  {
            label: this.$t('parameterValidation'),
            prop: 'paramVolidate',
            slot: true,
			hide:false
          }, {
            label: this.$t('orgUserManagement.tabRemark'),
            prop: 'paramDes',
            slot: true
          }
        ]
      }
    };
  },
  components: {},
  methods: {
	getTempParameter(){
		this.tempParameter= this.inputParameter.filter(o=>{return o.paramType==this.activeName})
	},
	handleClick(tab, event) {
	  this.getTempParameter()
	},
    deleteData (scope) {
	  let index=this.inputParameter.findIndex(o=>{return o.id==scope.row.id})
      this.inputParameter.splice(index, 1);
	  this.tempParameter.splice(scope.row.$index, 1);
    },

    addRow () {
      var obj = {
        isChecked: true,
		id:new Date().getTime()+(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        paramKey:'',
        paramValue: '',
		paramType:this.activeName,
        paramDes: '',
		paramVolidate:null
      };
      this.inputParameter.push(obj);
	  this.getTempParameter()
    },
    RelationFieldFocus () {     
        getDataDetail('paramRules').then(res => { 
          const { code, data } = res.data;
          if (code) return;
          this.DateFieldOptions = data;
        });
    }
  },
  created () {
    this.RelationFieldFocus()
	this.getTempParameter()
  }
};
</script>

<style scoped>
::v-deep .el-tabs__content{
	height: calc(100% - 55px);
}
::v-deep .el-tab-pane{
	height: 100%;
}
::v-deep .el-tabs__item{
	width: 150px;
	text-align: center;
	font-weight: normal;
	font-size: 13px;
}
.avue-crud {
  height: 100%;
  margin: 0 10px 10px;
  width: auto;
}
.crudTitle{
	border-bottom: 1px solid #C0C5CE;
	padding:15px 0 8px;
	font-size: 14px;
	font-weight: bold;
	margin: 0 10px 10px;
}
</style>
