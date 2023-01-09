<template>
  <div>
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
	<el-form-item :label="$t('nameValue')" >
		<el-select v-model="config.nameKey" clearable
		           :placeholder="$t('code.codeStepFour.placeholderSelect')">
		  <el-option
		      v-for="item in colNameList"
		      :key="item"
		      :label="item"
		      :value="item">
		  </el-option>
		</el-select>
	</el-form-item>
    <el-form-item :label="$t('showValue')" >
		<el-select v-model="config.dataValueKey" clearable
		           :placeholder="$t('code.codeStepFour.placeholderSelect')">
		  <el-option
		      v-for="item in colNameList"
		      :key="item"
		      :label="item"
		      :value="item">
		  </el-option>
		</el-select>
    </el-form-item>
	<el-divider>{{$t('dataColumn')}}</el-divider>
	<div class="reg-item" :key="item.id" v-for="(item,index) in config.columns" >
		<el-form-item :label="$t('dimName')" style="margin-bottom:8px;" >
			<el-input v-model="item.name" :placeholder="$t('enterDimensionName')"></el-input>
		</el-form-item>
	    <el-form-item :label="$t('maxDimension')" style="margin-bottom:8px;" >
	        <el-input-number v-model="item.max" controls-position="right" :placeholder="$t('enterMaxDimension')">      
	        </el-input-number>
	    </el-form-item>	    
	    <el-button :title="$t('Schedule.deleteBtn')"
	                @click="handleRemoveCol(index)"
	                class="reg-item-delete"
	                circle
	                plain
	                size="mini"
	                type="danger">
	        <i class="el-icon-close"></i>
	    </el-button>
	</div>
	<div class="mt-8" >
	    <el-button class="ml-8" type="primary" size="mini" @click="handleAddCol">{{$t('addDimension')}}</el-button>
	</div>
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
            this.config.nameKey = ''
            this.config.dataValueKey = ''
			this.colNameList=[]
            this.getDataField()
        },
		handleAddCol(){
		    this.config.columns.push({
		        id:this.$uuid(),
		        name:'',
				max:''
		    })
		},
		handleRemoveCol(index){
		    this.config.columns.splice(index,1)
		},
    }
}
</script>

