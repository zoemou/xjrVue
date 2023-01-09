<template>
    <div @click="addMember">
		<el-input v-model="selectUser" :placeholder="$t('selectUser.placeholderSelectUser')" suffix-icon='el-icon-setting'></el-input>
        <el-dialog v-dialogDrag :close-on-click-modal="false" :append-to-body="true" :visible.sync="roleMemberVisible" width="80%" :title="$t('selectUser.selectPersonnel')">
        	<AddRoleMember ref="addRoleform"></AddRoleMember>
        	<span slot="footer" class="dialog-footer">
        		<el-button size="mini" type="primary" @click="cancelDialog()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        	    <el-button 
				size="mini" 
				type="primary"
        	    @click="confirmDialog()"
				:loading="flagSelectedMember"
				>{{flagSelectedMember?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
        	</span>
        </el-dialog>
    </div>
</template>

<script>
import user from '@/store/modules/user'
	import AddRoleMember from '../../views/WorkFlow/AddRoleMember'
	import {getMultiMaintainerUser } from "@/api/organization/user"
    export default {
        props:{
            user: {
                type: String
            } 
        },
		components: {
			AddRoleMember
		},
		data(){
			return{
				flagSelectedMember: false,
				roleMemberVisible:false,
				selectUser:''
			}
		},
		mounted(){
			
			 this.selectUser=this.user 
		},
		methods:{
			addMember(){
				this.roleMemberVisible=true
			},
			cancelDialog(){
				this.flagSelectedMember = false;
				this.roleMemberVisible=false;
			},
			confirmDialog(){
				this.flagSelectedMember = true;
				var obj=this.$refs.addRoleform.pushParentData();
				const userId = [];
				this.selectUser="";
				obj.forEach((e,i)=>{
					this.selectUser += i<(obj.length-1)?(e.F_RealName+','):e.F_RealName
					userId.push(e.F_UserId)
				})
				this.$emit("onInput",this.selectUser)
				this.$emit("input",userId.join(','))
				this.cancelDialog()
			}
		},
		watch: {
			user(val) {
				getMultiMaintainerUser(val).then(res => {
					const nameList = []
					res.data.data.map(u => { nameList.push(u.UserInfo.F_RealName) }  )
					this.selectUser = nameList.join(',')
				})
			}
		}
    }
</script>

<style scoped>
    
</style>