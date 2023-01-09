<template>
  <el-form style="padding: 0px 0px 0px 15px;">
    <el-form-item :label="$t('mobileDev.searchRightSide.labelTimeName')" v-if="MSActiveData.name !== undefined">
      <el-input v-model="MSActiveData.name" :placeholder="$t('mobileDev.searchRightSide.placeholderTime')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.searchRightSide.labelBoundField')" v-if="MSActiveData.field !== undefined">
      <el-select v-model="MSActiveData.field" :placeholder="$t('mobileDev.searchRightSide.placeholderSelectField')" @focus="clickField" style="display: block;"  class="field_bound">
        <el-option v-for="(item,idx) in FieldOptions" :key="idx" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>    
  </el-form>
</template>
<script>
import store from '@/store/index';
import {mapGetters} from "vuex";
import { getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
export default {
  data () {
    return {
      FieldOptions:[]
    }
  },
  computed: {
    ...mapGetters(['MDAllStepData','MSActiveData'])
  },
  created(){
    
  },
  methods:{
    clickField(){
      let _this=this;
      let obj=this.MDAllStepData.stepTwo;
      for(let i=0;i<obj.list.length;i++){
        if(obj.list[i].parentName==1){         
          getDatabaseTableColumns(obj.F_DbId, obj.list[i].name).then(res => {
            const data = res.data.data;
            _this.FieldOptions = [];
            data.forEach(item => {
              _this.FieldOptions.push({
                label: item.Name,
                value: item.Name
              });
            });
            _this.MSActiveData.field=data[0].Name;
          });
        }
      }     
    }   
  }
}
</script>

<style scoped>
 
::v-deep .el-input__suffix{
	 top:18px;
 }
</style>