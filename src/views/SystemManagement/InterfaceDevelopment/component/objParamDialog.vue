<template>
  <div class="dialog-box">
    <el-dialog v-dialogDrag
      v-bind="$attrs"
      width="980px"
      :close-on-click-modal="false"
      append-to-body
      :before-close="close"
	  top="120px"
    >
      <div slot="title">
        {{$t('objectCollectionConfig')}}
      </div>
      <div class="content">
          <el-form :model="formInline" :rules="rule" ref="formInline" label-width="120px">
			<el-row>
				<el-col :span="24">
					<el-form-item :label="$t('outputObjParmName')" prop="outputObjName">
					  <el-input v-model="formInline.outputObjName" :placeholder="$t('fillOutputObjectParmName')"></el-input>
					</el-form-item>
				</el-col>				
			</el-row>
          </el-form>
		  <avue-crud ref="queryTable" :data="outputObjVariable" :option="queryoption" stripe style="padding-top:10px;height:calc(100% - 100px)">
		    <template slot="add" slot-scope="scope">
		      <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(scope)"></i>
		    </template>
		    <template slot="outputObjName" slot-scope="scope">
		  	  <el-input v-model="scope.row.outputObjName" :placeholder="$t('fillPropertyName')"></el-input>        
		    </template>
		    <!-- <template slot="outputObjType" slot-scope="scope">
		      <el-select v-model="scope.row.outputObjType" :placeholder="$t('请选择数据类型')">
		        <el-option :label="item.label" :value="item.value" v-for="item in objType" :key="item.value"></el-option>
		      </el-select>
		    </template>		 -->	
		  </avue-crud>
		</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"
                   @click="close()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button type="primary"
                   @click="submit"
                   size="small">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//import {outputObjType } from '@/util/util';
export default {
  props: ['param','fromType'],
  data() {
    return {
      formInline:{
		  outputObjName:''
	  },
	  //objType:outputObjType,
      rule: {
		outputObjName: [
		  { required: true, message: this.$t('fillOutputObjectParmName'), trigger: 'blur' }
		]
	  },
	  outputObjVariable:[],
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
          }, {
            label:this.$t('objectPropertyName'),
            prop: 'outputObjName',
            slot: true
          },
          // {
          //   label: this.$t('数据类型'),
          //   prop: 'outputObjType',
          //   slot: true
          // }
        ]
      }
    };
  },
  mounted(){
	let obj=this.param[this.fromType=='system'?'F_SettingJson':'outputSaveCode'];
	if(this.fromType=='system'&&obj){
		obj=JSON.parse(obj)
	}
	if(obj){		
		this.formInline.outputObjName=obj.outputObjName||"";
		this.outputObjVariable=obj.outputObjVariable||[]
	}
  },
  methods: {
    addRow () {
      var obj = {
        outputObjName:'',
        //outputObjType: ''
      };
      this.outputObjVariable.push(obj);
    },
	deleteData (scope) {
	  this.outputObjVariable.splice(scope.row.$index, 1);
	},
    submit(){
		this.$refs.formInline.validate(res=>{
			if(res){
				//验证通过
				this.$emit('changeData', {
					"outputObjName":this.formInline.outputObjName,
					"outputObjVariable":this.outputObjVariable
				});
				this.$emit('update:visible', false);
			}
		})	  
    },
    close(){
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog{
	height: calc(100% - 240px);
}
::v-deep .el-dialog__body{
	height: calc(100% - 110px);
}
.content{
	height: 100%;
}
</style>
