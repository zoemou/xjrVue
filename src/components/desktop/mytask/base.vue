<template>
  <div >
	  <div v-for="(item,index) in list" :key="item.icon">
		  <el-form-item :label="item.label+$t('mobileDev.mobileSchema.tabIcon')">
			<el-input :placeholder="$t('mobileDev.functionDesignStepEight.placeholderSelect')+item.label+$t('mobileDev.mobileSchema.tabIcon')"
			  size="small"
			  v-model="config[item.icon]"
			>
			  <i
				slot="suffix"
				class="el-icon-more"
				@click="selectMoreIcon(item.icon)"
			  ></i>
			</el-input>
		  </el-form-item>
		  <el-form-item :label="item.label+$t('iconColor')" label-width="100px">
			  <el-color-picker v-model="config[item.color]" show-alpha></el-color-picker>
		  </el-form-item>
		  <el-form-item :label="item.label+$t('iconBgColor')" label-width="100px">
			  <el-color-picker v-model="config[item.bg]" show-alpha></el-color-picker>
		  </el-form-item>
	  </div>
	  <el-form-item :label="$t('jumpFunction')">
	  	<el-input :value="$t('PCDevGuide.processTask')" size="small" disabled></el-input>
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
export default {
    props: ['data'],
	components: {FontHtml},
	computed:{
	    config(){
	        return this.data
	    }
	},
    data () {
        return {
			list:[{label:this.$t('to-do'),icon:'sicon',color:'scolor',bg:'sbgColor'},
			{label:this.$t('circulate'),icon:'ficon',color:'fcolor',bg:'fbgColor'},
			{label:this.$t('done'),icon:'ticon',color:'tcolor',bg:'tbgColor'}],
			curIcon:'',
			IconVisible:false
        }
    },
	methods:{
		selectMoreIcon(str) {
			this.curIcon=str;
		  this.IconVisible = true;
		},
		childByValue: function(childValue) {
		  // childValue就是子组件传过来的值
		  this.config[this.curIcon] = childValue;
		  this.IconVisible = false;
		}		
	}
}
</script>

