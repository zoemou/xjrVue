<template>
  <div>
    <el-form-item :label="$t('BI.components.pictorialbar.labelIcon')">
		<el-input :placeholder="$t('menuManagement.addModal.placeholderIcon')"
		  size="small"
		  v-model="config.icon"
		>
		  <i
		    slot="suffix"
		    class="el-icon-more"
		    @click="selectMoreIcon"
		  ></i>
		</el-input>
    </el-form-item>
    <el-form-item :label="$t('iconColor')">
        <el-color-picker v-model="config.color" show-alpha></el-color-picker>
    </el-form-item>
	<el-form-item :label="$t('iconBgColor')">
	    <el-color-picker v-model="config.bgColor" show-alpha></el-color-picker>
	</el-form-item>
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

import FontHtml from "@/views/FontAwesome.vue";
import moduleMixin from '@/components/desktop/mixins/module';
export default {
    props: ['data'],
	mixins:[moduleMixin],
    data () {
        return {
			IconVisible:false			
        }
    },
	components: {FontHtml},
    computed:{
        config(){
            return this.data
        }
    },
	mounted() {
		this.getMenuTree('F_ModuleId')
	},
	methods:{
		selectMoreIcon() {
		  this.IconVisible = true;
		},
		childByValue: function(childValue) {
		  // childValue就是子组件传过来的值
		  this.config.icon = childValue;
		  this.IconVisible = false;
		}		
	}
}
</script>

