<template>
  <div>
	<div class="reg-item" :key="item.id" v-for="(item,index) in data.columns" >
		<el-form-item :label="$t('BI.listIndex.Modal.functionName')">
			<el-input v-model="item.name" size="small"></el-input>
		</el-form-item>
	    <el-form-item :label="$t('BI.components.pictorialbar.labelIcon')">
			<el-input :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')"
			  size="small"
			  v-model="item.icon"
			>
			  <i
				slot="suffix"
				class="el-icon-more"
				@click="selectMoreIcon(index)"
			  ></i>
			</el-input>
	    </el-form-item>
	    <el-form-item :label="$t('iconColor')" label-width="100px">
	    			  <el-color-picker v-model="item.color" show-alpha></el-color-picker>
	    </el-form-item>
	    <el-form-item :label="$t('iconBgColor')" label-width="100px">
	    			  <el-color-picker v-model="item.bgColor" show-alpha></el-color-picker>
	    </el-form-item>
		<el-form-item :label="$t('jumpFunction')">
			<avue-input-tree
			  v-model="item.moduleId"
			  :placeholder="$t('selectJumpFunction')"
			  type="tree"
			  :dic="defaultTree"
			  size="small"
			  style="width: 100%"
			>
			</avue-input-tree>
		</el-form-item>
		<el-form-item :label="$t('workFlow.categoryList.labelSort')" style="margin-bottom:8px;" >
		    <el-input-number v-model="item.orderId" :placeholder="$t('workFlow.Step1.placeholderOrder')" controls-position="right">       
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
	    <el-button class="ml-8" type="primary" size="mini" @click="handleAddCol"  >{{$t('addFunction')}}</el-button>
	</div>
	<el-dialog
	  v-dialogDrag
	  :close-on-click-modal="false"
	  :title="$t('menuManagement.addModal.iconModal.modalTitle')"
	  :append-to-body="true"
	  :visible.sync="IconVisible"
	  width="80%"
	  :before-close="(done)=>{done()}"
	  style="padding: 10px 20px;"
	>
	  <FontHtml v-on:childByValue="childByValue"></FontHtml>
	</el-dialog>
  </div>
</template>
<script>
import moduleMixin from '@/components/desktop/mixins/module';
import FontHtml from "@/views/FontAwesome.vue";
export default {
    props: ['data'],
	mixins:[moduleMixin],
	components: {FontHtml},
	data (){
		return {
			IconVisible:false,
			curIcon:''
		}
	},
    computed:{
        config(){
            return this.data
        }
    },
	mounted() {
		this.getMenuTree('F_ModuleId')
	},
    methods: {
		handleAddCol(){
            this.config.columns.push({
                id:this.$uuid(),
				name:this.$t('workFlow.Step1.labelMName'),
                icon: 'el-icon-s-check',
                color:'#e6a23c',
                bgColor:'#faecd8',
				moduleId:'',
				orderId:0
            })
        },
        handleRemoveCol(index){
            this.config.columns.splice(index,1)
        },
		selectMoreIcon(index) {
			this.curIcon=index;
		  this.IconVisible = true;
		},
		childByValue: function(childValue) {
		  // childValue就是子组件传过来的值
		  this.config.columns[this.curIcon].icon = childValue;
		  this.IconVisible = false;
		}	
    }
}
</script>

