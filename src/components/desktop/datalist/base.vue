<template>
  <div >
    <el-form-item :label="$t('jumpFunction')">
        <avue-input-tree
          v-model="config.moduleId"
          :placeholder="$t('selectJumpFunction')"
          type="tree"
          :dic="defaultTree"
          size="small"
          style="width: 100%"
        >
        </avue-input-tree>
    </el-form-item>
    <el-form-item :label="$t('bindForm')">
		
		<avue-input-tree
		  v-model="config.viewForm"
		  :placeholder="$t('forme.addModal.placeholderSelectForm')"
		  type="tree"
		  :dic="formTree"
		  size="small"
		  style="width: 100%"
		  v-if="show"
		>
		</avue-input-tree>
    </el-form-item>   
    <el-form-item :label="$t('sortField')">
        <l-select
            v-model="config.orderId"
            :options="formComponents"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
            >
        </l-select>
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.maxRows')">
        <el-input-number v-model="config.maxRows"
            controls-position="right"
            :placeholder="$t('deletePrompt.hinrEnterSpace')"></el-input-number>
    </el-form-item>
    <el-divider>{{$t('dataColumn')}}</el-divider>
    <div class="reg-item" :key="item.id" v-for="(item,index) in config.columns" >
		<el-form-item :label="$t('showName')" style="margin-bottom:8px;" >
			<el-input v-model="item.label" :placeholder="$t('enterShowName')"></el-input>
		</el-form-item>
        <el-form-item :label="$t('code.codeStepFive.tabBindField')" style="margin-bottom:8px;" >
            <l-select v-model="item.prop" :options="formComponents"></l-select>
        </el-form-item>
        <el-form-item :label="$t('mobileDev.tableSet.tabWidth')" style="margin-bottom:8px;" >
            <el-input-number v-model="item.width" controls-position="right"
                    :placeholder="$t('mobileDev.tableSet.placeholderColumnWidth')">
                <template slot="append">%</template>        
            </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('mobileDev.listRightSide.Alignment')" style="margin-bottom:0;" >
            <l-select v-model="item.align" :options="alignOptions" ></l-select>
        </el-form-item>
		<el-form-item :label="$t('mobileDev.functionDesignStepEight.labelSort')" style="margin-bottom:8px;" >
            <el-input-number v-model="item.orderId" :placeholder="$t('subSystemForm.placeholderSort')" controls-position="right">       
            </el-input-number>
        </el-form-item>
        <el-button :title="$t('forme.editModal.deleteBtn')"
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
        <el-button class="ml-8" type="primary" size="mini" @click="handleAddCol"  >{{$t('addColumn')}}</el-button>
    </div>
  </div>
</template>
<script>
import {getSystemFormScheme,getFormScheme} from '@/api/bpmn';
import {getBindfields,getFormRelation} from '@/api/code/form';
import {FormatTree,FormatAddressTree } from '@/util/util';
import { mapGetters } from "vuex";
import moduleMixin from '@/components/desktop/mixins/module';
export default {
    props: ['data'],
    inject: ["quickBiDesign"],
	mixins:[moduleMixin],
    data () {
        return {
            alignOptions:[{value:'left',label:this.$t('left')},{value:'center',label:this.$t('mobileDev.listRightSide.Center')},{value:'right',label:this.$t('right')}],
			formTree:[{label:this.$t('workFlow.formInitiationProcessDialog.typeCusForm'),value:'dynamic',children:[],disabled:true},
			{label:this.$t('workFlow.formInitiationProcessDialog.typeSysForm'),value:'system',children:[],disabled:true}],
			show:false
        }
    },
    computed:{
		...mapGetters(["systemId"]),
        config(){
            return this.data
        }
    },
    asyncComputed:{
      formComponents:{
        async get(){
            if(this.$validatenull(this.config.viewForm)){
                return []
            }
			let arr=this.config.viewForm.split(",")
            const res = await getBindfields({id:arr[0],type:arr[1]})
			if(res?.data?.data){
				let datas=[]
				res.data.data.forEach(el=>{
					datas.push({label:el,value:el})
				})
				return datas
			}			
        }
      }
    },
	watch:{
	  'config.viewForm':{
	    handler(val, oldVal) {
			this.config.orderId="";
			this.config.columns.forEach(el=>{
				el.prop=""
			})			
	    }
	  },
	  'config.moduleId':{
		handler(val, oldVal) {			
			if(val){
				let id=JSON.parse(val).id
				getFormRelation(id).then(res=>{
					let result=res.data.data
					if(res?.data?.data&&result.F_Type>=0&&result.F_SchemeId){
						if(result.F_Type==2){
							this.config.viewForm=result.F_Id+",0,"+result.F_UrlAddress
						}else if(result.F_Type===0){
							this.config.viewForm=result.F_SchemeId+",1"
						}
					}
				})	
			}
		}  
	  }
	},
	async mounted(){
		this.getMenuTree('F_ModuleId')
		const res = await getFormScheme()
		if(res?.data?.data){
			res.data.data.forEach(el=>{
				el.F_SchemeId+=",1"
			})
			this.formTree[0].children=FormatTree(res.data.data,"F_SchemeId","F_Name","children")
		}

		const res2 = await getSystemFormScheme()
		if(res2?.data?.data){
			res2.data.data.forEach(el=>{
				el.formId+=",0"
				el.formId+=","+el.url
			})
			this.formTree[1].children=FormatTree(res2.data.data,"formId","name","children")
		}
		this.show=true
	},
    methods:{
        handleAddCol(){
            this.config.columns.push({
                id:this.$uuid(),
                prop:'',
				label:'',
                width:100,
                align:'left',
				orderId:0,
				sortable: true
            })
        },
        handleRemoveCol(index){
            this.config.columns.splice(index,1)
        }
    }
}
</script>

