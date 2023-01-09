<template>
  <div>
	<!-- <el-form-item label="数据来源">
	  <el-button-group>
	    <el-button :type="config.dataType=='dataSource'?'primary':'default'" @click="changeSource('dataSource')">数据源</el-button>
	    <el-button :type="config.dataType=='dataItem'?'primary':'default'" @click="changeSource('dataItem')">数据字典</el-button>
	  </el-button-group>
	</el-form-item> -->
    <el-form-item :label="$t('mobileDev.formRightSide.labelDataOptions')">
        <l-select  
                v-model="config.dataCode"
                :placeholder="$t('code.codeStepFour.hintDataOrigin')" 
                size="mini" 
                :options="dataSource" 
                labelKey="F_Name" 
                valueKey="F_Id"
                filterable
				v-if="config.sourceType=='dataSource'"
                @change="handleDataSourceChange"
            >
        </l-select>
		<avue-input-tree default-expand-all @change="handleDataSourceChange" v-model="config.dataCode" v-else
		                 :placeholder="$t('code.codeStepFour.placeholderSelect')" type="tree" :dic="dataItemOption"></avue-input-tree>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelShowField')" >
		<el-select v-model="config.dataValueKey"
		           :placeholder="$t('selectValue')">
		  <el-option
		      v-for="item in colNameList"
		      :key="item"
		      :label="item"
		      :value="item">
		  </el-option>
		</el-select>
		<el-link type="danger" :underline="false" style="font-size: 12px;">{{$t('defaultByFirstDate')}}</el-link>
		<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;" @click="addDataSource">{{$t('addDataSource')}}</el-button>
    </el-form-item>
	<el-form-item :label="$t('calculation')" >
		<el-select v-model="config.computeType"
		           :placeholder="$t('selectValue')">
		  <el-option
		      v-for="item in computeTypeList"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		  </el-option>
		</el-select>
	</el-form-item>
	<el-form-item :label="$t('unit')" >
		<el-input v-model="config.unit"
		           :placeholder="$t('fillInUnit')">
		</el-input>
	</el-form-item>
	<add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source>
  </div>
</template>
<script>
import dataSourceMixin from '@/components/desktop/mixins/dataSource';
export default {
    props: ['data'],
	mixins:[dataSourceMixin],	
	data (){
		return {
			computeTypeList:[{label:this.$t('total'),value:'sum'},{label:this.$t('average'),value:'avg'},{label:this.$t('code.rightPanel.max'),value:'max'},{label:this.$t('code.rightPanel.min'),value:'min'}]
		}
	},
    computed:{
        config(){
            return this.data
        }
    },
    methods: {
        handleDataSourceChange(){
            this.config.dataValueKey = ''
        	this.colNameList=[]
            this.getDataField()
        }
    }
}
</script>

