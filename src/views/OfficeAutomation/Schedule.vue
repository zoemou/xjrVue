<template>
    <div>
      <full-calendar :events="scheduleData" @dayClick="dayClick" @eventClick="eventClick" @moreClick="moreClick" lang="zh"></full-calendar>    

      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" style="padding: 10px 20px;">
                <div class="companiesuser-form">
                    <el-form  :rules="rules" ref="formData"  :model="formData" label-width="80px" :validate-on-rule-change="false" >                                                                        
                        <el-row>
                            <el-col :span="12" v-show="hasFormPermission('start')">
                                <el-form-item prop='start' :label="$t('Schedule.labelStartTime')">
                                    <el-date-picker v-model="formData.start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" 
                                    format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('Schedule.placeholderStartTime')" size="small" style="width: 100%"
                                    @change="changeTime"> </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-show="hasFormPermission('end')">
                                <el-form-item prop='end' :label="$t('Schedule.labelEndTime')">
                                    <el-date-picker v-model="formData.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" 
                                    format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('Schedule.placeholderEndTime')" size="small" style="width: 100%"
                                    @change="changeTime"> </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" v-show="hasFormPermission('title')">
                                <el-form-item prop='title' :label="$t('Schedule.labelSchedule')">
                                    <el-input v-model="formData.title" type="textarea" :placeholder="$t('Schedule.placeholderSchedule')" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="cancelForm('formData')">{{$t('buttonModule.modalCancelBtn')}}</el-button>
					<el-button size="mini" type="danger" @click="deleteForm" v-if="formId">{{$t('Schedule.deleteBtn')}}</el-button>
                    <el-button 
                    size="mini" 
                    type="primary" 
                    @click="formSubmit('formData')" 
                    :loading="flagDate"
                    >
                    {{flagDate?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}
                    </el-button>
                </span>
            </el-dialog>
    </div>
</template>
<style lang="scss" scoped>
	.avue-view{
		padding:0px 10px;
	}
	.comp-full-calendar{
		max-width:100%;
        height: 100%;
	}
    
</style>
<script>
    import FullCalendar from 'vue-fullcalendar';
    import {getSchedule, addSchedule,updateSchedule,delSchedule} from '@/api/officeautomation/schedule';
    import authorizeMixin from "@/mixins/authorize"; //鉴权混入
	import {formValidateNotice} from '@/util/util';
    export default {
        name: "Schedule",
        components: {FullCalendar},
        mixins: [authorizeMixin],
        data() {
            return {
                flagDate:false,
                dialogVisible: false,
                dialogTitle: '',
                formData: {},
                formId:'',
                scheduleData: [],                 
                rules: {
                    title: [{ required: true, message:this.$t('Schedule.hintContent'), trigger: 'blur' }],
                    start: [{ required: true, message: this.$t('Schedule.hintStartTime'), trigger: 'blur' }],
                    end: [{ required: true, message:this.$t('Schedule.hintEndTime'), trigger: 'blur' }]
                },
            }
        },
        mounted(){
            this.getSchedule()
        },
        methods: {
            getSchedule(){
                getSchedule().then(res=>{
                    this.scheduleData=res.data.data
                })
            },
            changeTime(){
                if(this.formData.start>this.formData.end){
                    this.$notify({
                        title:this.$t('deletePrompt.promptTitle'),
                        message: this.$t('Schedule.hintBigtime'),
                        type: 'warning'
                    });
                    this.formData.end=""
                }
            },
            // 点击事件
            eventClick (event, jsEvent, pos) {               
                if(this.hasButtonPermission('modify')){
                    this.dialogVisible = true;
                    this.dialogTitle = this.$t('Schedule.editModalTitle');	
                    this.formData={
                    end: event.end,
                    start: event.start,
                    title:event.title	
                    }
                    this.formId=event.id;
                }else{
                    this.$notify({
                        title: this.$t('deletePrompt.promptTitle'),
                        message:this.$t('您没有编辑权限'),
                        type: 'warning'
                    });
                }
            },
            // 点击当天
            dayClick (day, jsEvent) {
                if(this.hasButtonPermission('add')){
                    this.formId="";
                    this.formData = {
                        start:this.mydateFormat(day),
                        end:this.mydateFormat(day)
                    };
                    this.dialogVisible = true;
                    this.dialogTitle = this.$t('Schedule.addModalTitle');				
                }else{
                    this.$notify({
                        title: this.$t('deletePrompt.promptTitle'),
                        message:this.$t('Schedule.hintNoPerm'),
                        type: 'warning'
                    });
                }

            
            },
			deleteForm(){
				if(this.hasButtonPermission('delete')){
					this.$confirm(this.$t('deletePrompt.promptContent'),this.$t('deletePrompt.promptTitle'), {confirmButtonText:this.$t('buttonModule.modalSureBtn'), cancelButtonText:this.$t('buttonModule.modalCancelBtn'), type: 'warning'
					}).then(() => {
						delSchedule(this.formId).then(res => {
							const {code,data}=res.data;
							if(code){
								this.$notify({title:this.$t('deletePrompt.failureTitle'), message: this.$t('deletePrompt.failedDeleted'), type: 'error'});
							}else{
								this.$refs['formData'].resetFields(); 
								this.dialogVisible = false;
								this.getSchedule();
								this.$notify({title:this.$t('deletePrompt.successTitle'), message:this.$t('deletePrompt.successDeleted'), type: 'success'});
							}
							
						})
					}).catch(() => {
						// this.$notify({title:this.$t('deletePrompt.promptTitle'), message:this.$t('Schedule.hintCancelDelete'), type: 'warning'});
					});
				}else{
				    this.$notify({
				        title: this.$t('deletePrompt.promptTitle'),
				        message:this.$t('您没有删除权限'),
				        type: 'warning'
				    });
				}
			},
            // 查看更多
            moreClick (day, events, jsEvent) {
             
            },
            /* 取消弹窗 */
            cancelForm(formName) {
				this.$refs[formName].resetFields();
                this.dialogVisible = false
            },
            /* 关闭弹窗 */
            handleClose(done) {
                this.$refs['formData'].resetFields();
                done();
            },
            /* 提交表单 */
            formSubmit(formName) {
                this.flagDate = true;
                this.$refs[formName].validate((valid,object) => {
                        if (valid) {
                            let start=this.formData.start.split(" ")
                                let end=this.formData.end.split(" ")
                                let obj={"F_StartDate": start[0],
                                "F_StartTime":  start[1],
                                "F_EndDate":  end[0],
                                "F_EndTime": end[1],
                                "F_Early": 1,
                                "F_ScheduleContent": this.formData.title,
                                "F_IsMailAlert": 1,
                                "F_IsWeChatAlert": 1,
                                "F_IsMobileAlert": 1}
                            if (!this.formId) {
                                
                                addSchedule(obj).then(res=>{
                                    this.$refs['formData'].resetFields(); 
                                    this.dialogVisible = false;
                                    this.getSchedule()
                                }).finally(() => {
                                    this.flagDate = false;
                                })
                                
                            } else {
                                updateSchedule(this.formId,obj).then(res=>{
                                    this.$refs['formData'].resetFields(); 
                                    this.dialogVisible = false;
                                    this.getSchedule()
                                }).finally(() => {
                                    this.flagDate = false;
                                })
                            }
                        } else {
							formValidateNotice(object,this,this.formEnCodeList)
                            this.flagDate = false;
                            return false;
                        }
                });
            },
        }  
    }
</script>