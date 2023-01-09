<template>
	<block>
		<el-form-item :label="$t('btnSelectData')">
			<el-switch v-model="activeData.__config__.isSelectData"/>
			<el-popover
					placement="bottom"
					title=""
					width="200"
					trigger="hover"
					:content="$t('btnSelectDataContent')">
					<i slot="reference" class="el-icon-question" style="color: #ccc;font-size: 18px;margin-left: 10px;vertical-align: middle;"></i>
				</el-popover>
		</el-form-item>
		<el-form-item v-if="activeData.__config__.isSelectData" :label="$t('code.codeStepFour.labelBtnName')">
			<el-input v-model="activeData.__config__.buttonName" :placeholder="$t('workFlow.userButtonSetting.hintBtnName')"/>
		</el-form-item>
		<el-form-item v-if="activeData.__config__.isSelectData">
			<el-button type="primary" style="width:100%" size="medium" @click="setTableHeader">{{$t('headerConfig')}}</el-button>
		</el-form-item>
		
		<el-dialog v-dialogDrag
		  :title="$t('btnSelDataHeaderConfig')"
		  :append-to-body="true"
		  :close-on-click-modal="false"
		  top="1vh"
		  :visible.sync="visibleDialog"
		  width="80%"
		  :before-close="closeDialog"
		>
		  <div class="auto-bind-field">
		    <avue-crud ref="crud" :option="option" :data="tempTableHeader">
				 <template slot="name" slot-scope="{row}">
					 <el-input v-model="row.name"></el-input>
				 </template>
		    </avue-crud>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCancelBtn')}}</el-button>
		    <el-button size="mini" type="primary" @click="confirm">{{$t('code.codeForm.completeBtn')}}</el-button>
		  </span>
		</el-dialog>
	</block>
</template>

<script>
import { FormatTree,deepClone } from '@/util/util';
export default {
  props: [
    "activeData",
    "preloadFieldOption",
  ],
  components: {

  },
  data() {
    return {
			visibleDialog:false,
			tempTableHeader:[],
			option:{
				labelWidth: 110,
				addBtn: false,
				refreshBtn: false,
				columnBtn: false,
				index: false,
				align: 'center',
				menu: false,
				maxHeight: 500,
				column: [
				  {
				    label: this.$t('dataSourceFieldName'),
				    prop: "bindField",
				    span: 12
				  },
					{
					  label: this.$t('headerName'),
					  prop: "name",
					  span: 12,
						slot: true
					}
				]
			}
    };
  },
  watch: {

  },
  mounted () {
		console.log('mmmmmmmmmmmmmm')
  },
  computed: {
		name(){
			return this.activeData.__config__.dataType=="dataSource"?'sourceTableHeader':this.activeData.__config__.dataType=="dataItem"?'itemTableHeader':''
		}
  },
  methods: {
    setTableHeader(){
			if(this.activeData.__config__.dataType=="dataSource"&&!this.activeData.__config__.dataSource||
			this.activeData.__config__.dataType=="dataItem"&&!this.activeData.__config__.dataItem){
				this.$message.error(this.$t('selectDataOptionFirst'));
				return;
			}

			// if(this.activeData.__config__.tableHeader.length<=0){
			// 	this.tempTableHeader=[]
			// 	for(let key of this.preloadFieldOption){
			// 		this.tempTableHeader.push({
			// 			bindField:key,
			// 			name:key
			// 		})
			// 	}
			// }else{	
			if(this.name)	this.tempTableHeader=deepClone(this.activeData.__config__[this.name])				
			//}
			this.visibleDialog=true;
		},
		closeDialog(){
			this.tempTableHeader=deepClone(this.activeData.__config__[this.name])
			this.visibleDialog=false;
		},
		confirm(){
			this.visibleDialog=false;
			this.activeData.__config__[this.name]=deepClone(this.tempTableHeader)
		}
  }
};
</script>

<style lang="scss" scoped>

</style>
