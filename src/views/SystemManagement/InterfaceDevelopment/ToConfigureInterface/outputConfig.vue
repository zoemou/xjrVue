<template>
    <div class="main-container">
        <main-content :paddingLeft="0" :search="false" :paddingTop="40">
            <div slot="table">
				<p class="head_title">{{$t('interfaceOutputInfor')}}</p>  
				<div class="baseinfo-form">
					<el-form  :rules="rules" ref="menuForm" :model="outputConfig" label-width="120px" :validate-on-rule-change="false" >
						<el-row  class="row-box">
							<el-col :span="12">
								<el-form-item prop="F_EnCode" :label="$t('interfaceCode')">
									<el-input :placeholder="$t('fillInInterfaceCode')" size="small"
											  v-model="outputConfig.F_EnCode"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  prop="F_UrlAddress"  :label="$t('interfaceManage.addModal.labelAddress')">
									<el-input placeholder="/xjrsoft/api/customer/" size="small"
											  v-model="outputConfig.F_UrlAddress" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  prop="F_Name"  :label="$t('interfaceManage.addModal.labelName')">
									<el-input :placeholder="$t('fillInInterfaceName')" size="small"
											  v-model="outputConfig.F_Name"></el-input>
								</el-form-item>								
							</el-col>
							<el-col :span="12">
								<el-form-item prop="F_RequestMethod" :label="$t('reqType')">
								  <el-select v-model="outputConfig.F_RequestMethod" :placeholder="$t('selectRequestType')"
											 size="small" style="width: 100%">
									<el-option :label="item.label" :value="item.value" v-for="item in axiosType" :key="item.value"></el-option>
								  </el-select>
								</el-form-item>
							</el-col>	
							<el-col :span="12">
							  <el-form-item prop="F_CategoryId" :label="$t('interfaceSort')">
								<avue-input-tree default-expand-all
										 v-model="outputConfig.F_CategoryId"
										  :props="defaultParentIdProps"
										 :placeholder="$t('selectInterfaceSort')" type="tree"
										 :dic="defaultTree" size="small"
										 style="width: calc(100% - 45px);margin-right: 10px;"></avue-input-tree>
							    <el-button @click="addDomain()" icon="el-icon-plus" size="small" type="primary"></el-button>
							  </el-form-item>
							</el-col>
							<el-col :span="12">
							  <el-form-item :label="$t('custmerForm.tableEnable')">
							    <el-switch v-model="outputConfig.F_EnabledMark" :active-value="1" :inactive-value="0"></el-switch>
							  </el-form-item>
							</el-col>	
							<el-col :span="24">
								<el-form-item :label="$t('orgUserManagement.tabRemark')">
									<el-input type="textarea" :placeholder="$t('workFlow.addStamp.placeholderRemark')" size="small"
											  v-model="outputConfig.F_Description" :rows="10"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
            </div>
        </main-content>
		<AddInterfaceCategory v-if="addCateVisible" :visible.sync="addCateVisible" :dialogTitle="$t('addInterfaceSort')" @submitRes="getInterfaceTypeTree"></AddInterfaceCategory>
    </div>
</template>

<script>
	import store from '@/store';
	import { mapGetters } from "vuex";
    import MainContent from "@/page/main/MainContent";
	import { axiosType } from '@/util/util';
	import { getInterfaceTypeTree} from '@/api/systemManagement/interface';
	import AddInterfaceCategory from "../../components/AddInterfaceCategory.vue";

    export default {
		components: {MainContent,AddInterfaceCategory},
		computed: {
		  ...mapGetters(["outputConfig"]),
		},
		watch: {
		  'outputConfig.F_EnCode': function (active, oldVal) {
		    this.outputConfig.F_UrlAddress = '/xjrsoft/api/customer/'+active;
		  }
		},
        data() {
            return {
				defaultParentIdProps:{
					label:'F_Name',
					value:'F_Id'
				},
				defaultTree:[],
				axiosType:axiosType,	
				addCateVisible:false,
                rules: {
                    F_CategoryId: [
                        { required: true, message:this.$t('selectInterfaceSort'), trigger: 'change' },
                    ],
                    F_RequestMethod: [
                        { required: true, message:this.$t('selectRequestType'), trigger: 'change' }
                    ],
                    F_Name:[
                        { required: true, message:this.$t('fillInInterfaceName'), trigger: 'blur' },
                    ],
					F_EnCode:[
						 { required: true, message:this.$t('fillInInterfaceCode'), trigger: 'blur' },
						 {message:this.$t('onlyAlphanumericsUnderscoresEnteredNumbersCannotStart'), trigger: 'change',pattern:'^[a-zA-Z_]([a-zA-Z0-9_]+)?$'}
					]
                }
            }
        },
        created() {
					this.getInterfaceTypeTree()
			// this.outputConfig.F_IsCustomize=1  //1是自定义接口
        },
        methods: {
			getInterfaceTypeTree(){
				getInterfaceTypeTree().then(res=>{
					this.defaultTree=res.data.data||[]
				})
			},
			addDomain(){
				this.addCateVisible=true;
			},
			validateData(){
				let flag=false;
				this.$refs['menuForm'].validate((valid) => {
					if (valid) {
						flag= true;
					}else{
						flag= false;
					}
				})
				return flag;
			}
        }
    }
</script>

<style scoped>
    /* reset css */
    div /deep/ .companiesuser-form .el-form-item {
        margin-bottom: 12px;
    }

    /* css */
    .main-container {
        height: 100%;
        padding:20px;
    }
	.head_title{
		font-size: 12px;
		font-weight: bold;
		width: 100%;
		border-bottom: 1px solid #f2f2f2;
		margin-top:-10px;
		line-height: 40px;
		color: #4d4d4d;
	}
	div /deep/ .main-table-content{
		border-top: none;
	}
	.row-box{
		padding:0 0 20px;margin-bottom: 20px;
	}
</style>