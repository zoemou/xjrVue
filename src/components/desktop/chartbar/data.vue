<template>
  <div>
    <el-form-item :label="$t('dataCoordinate')">
        <l-radio v-model="config.dataType" :options="[{value:'Y',label:$t('yAxis')},{value:'X',label:$t('xAxis')}]" ></l-radio>
    </el-form-item>
    <el-form-item :label="$t('code.codeStepFour.dataOrigin')">
        <l-select  
                v-model="config.dataCode"
                :placeholder="$t('code.codeStepFour.hintDataOrigin')" 
                size="mini" 
                :options="dataSource"
                labelKey="F_Name" 
                valueKey="F_Id"
                filterable

                @change="handleDataSourceChange"
            >
        </l-select>
		<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;margin-top:10px" @click="addDataSource">{{$t('addDataSource')}}</el-button>
    </el-form-item>
    <el-form-item :label="$t('xValue')" >
        <el-select v-model="config.XKey" clearable
                   :placeholder="$t('code.codeStepFour.placeholderSelect')">
          <el-option
              v-for="item in colNameList"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item :label="$t('yValue')" >
        <el-select v-model="config.YKey" clearable
                   :placeholder="$t('code.codeStepFour.placeholderSelect')">
          <el-option
              v-for="item in colNameList"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
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

		}
	},
    computed:{
        config(){
            return this.data
        }
    },
    methods: {
        handleDataSourceChange(){
			this.config.YKey = ''
			this.config.XKey = ''
        	this.colNameList=[]
            this.getDataField()
        }
    }
}
</script>

