<template>
    <div class="main-container">
        <main-content :title="contentTitle" :paddingLeft="0">
            <div slot="search">
                <!-- 在此处放置搜索内容 -->
                <div class="search-box">

                    <el-input v-model="keyword" size="small" :placeholder="$t('searchModule.searchPlaceholder')"
                              style="width: 200px; margin-right: 5px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="getTaskScheduleList">{{$t('searchModule.searchBtn')}}</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="searchReset">{{$t('searchModule.searchReset')}}</el-button>

                </div>
            </div>
            <div slot="table">
                <!-- 在此处放置表格内容 -->
                <!-- 表格 -->
                <avue-crud :data="taskDesignList" :option="option" stripe :page.sync="page"
													 :showColumn="showColumn" :isSaveColumns="true"
                           @on-load="onPageLoad" @sort-change="sortChange"
                            @row-click="rowClick"
														@row-dblclick="handleRowDBLClick">
                    <template  slot="menuLeft">
                        <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="dialogVisible" width="50%"
                                   :before-close="handleClose">
							<el-steps :active="active" finish-status="success" simple style="margin-bottom: 10px;">
							  <el-step :title="$t('taskScheduling.taskDesign.addModal.stepOne')" ></el-step>
							  <el-step :title="$t('taskScheduling.taskDesign.addModal.stepTwo')" ></el-step>
							</el-steps>
                            <div class="baseInfo-form" v-if="active==0">
                                <el-form :model="baseInfoForm" :rules="rules" ref="baseInfoForm" label-width="80px" :validate-on-rule-change="false">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelTaskName')" prop="F_Name">
                                                <el-input :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderTaskName')" size="small"
                                                          v-model="baseInfoForm.F_Name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
								</el-form>
								<el-form :model="conditionalForm" ref="conditionalForm" label-width="80px" :validate-on-rule-change="false">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelStartTime')">
												<el-radio-group v-model="conditionalForm.startType" @change="startTypeChange">
													<el-radio label="1">{{$t('taskScheduling.taskDesign.addModal.radioStartTimeOne')}}</el-radio>
													<el-radio label="2">{{$t('taskScheduling.taskDesign.addModal.radioStartTimeTwo')}}</el-radio>	
												</el-radio-group>										
                                            </el-form-item>
											<el-form-item v-if="conditionalForm.startType==2" prop="startTime">
												<el-date-picker
												      v-model="conditionalForm.startTime"
												      type="datetime"
												      :placeholder="$t('taskScheduling.taskDesign.addModal.radioStartTimeTwoplaceholder')"
													  value-format="yyyy-MM-dd HH:mm:ss">
												    </el-date-picker>
											</el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelFrequency')" prop="executeType">
												<el-radio-group v-model="conditionalForm.executeType">
													<el-radio label="1">{{$t('taskScheduling.taskDesign.addModal.radioFrequencyOne')}}</el-radio>
													<el-radio label="2">{{$t('taskScheduling.taskDesign.addModal.radioFrequencyTwo')}}</el-radio>
													<el-radio label="3">{{$t('taskScheduling.taskDesign.addModal.radioFrequencyThree')}}</el-radio>
													<el-radio label="4">{{$t('taskScheduling.taskDesign.addModal.radioFrequencyFour')}}</el-radio>	
												</el-radio-group>
                                            </el-form-item>
											<el-form-item v-if="conditionalForm.executeType==2">
												<span>{{$t('taskScheduling.taskDesign.addModal.simpleRepetitionOne')}} </span>
												<el-input :placeholder="$t('taskScheduling.taskDesign.addModal.simpleRepetitionTwo')" size="small" v-model="conditionalForm.simpleValue" style="width: 300px;">													
													<el-select v-model="conditionalForm.simpleType" :placeholder="$t('taskScheduling.taskDesign.addModal.simpleRepetitionThree')" slot="append" style="width: 140px;">
													    <el-option
													      v-for="item in timeUnitOptions"
													      :key="item.value"
													      :label="item.label"
													      :value="item.value">
													    </el-option>
													</el-select>													
												</el-input>
												<span> {{$t('taskScheduling.taskDesign.addModal.simpleRepetitionFour')}}</span>
											</el-form-item>
											<el-form-item v-if="conditionalForm.executeType==3">
												<el-button size="small" @click="addInfoClick">{{$t('taskScheduling.taskDesign.addModal.addFrequencyBtn')}}</el-button>
												<div v-for="(o,i) in conditionalForm.frequencyList" :key="i" style="display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #ccc;line-height: 30px;">
												    <span>{{(i+1) +". 每"+ o.carryMounth.toString()+"月的"+(o.type=='day'?'每天':o.type=='week'?'每周':'每月')+o.hour+'时'+o.minute+'分执行' }}</span>
													<div style="color: #0099FF;"><span @click="editActInfo(o,i)">{{$t('tableOperationModule.editorBtn')}}</span> | <span @click="deleteActInfo(i)">{{$t('tableOperationModule.deleteBtn')}}</span></div>
												</div>
												
											</el-form-item>
											<el-form-item v-if="conditionalForm.executeType==4">
												<el-input :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderExpression')" v-model="conditionalForm.cornValue">
												    <template slot="append"><div @click="addCornValue">{{$t('taskScheduling.taskDesign.addModal.addExpression')}}</div></template>
												</el-input>
											</el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelEndTime')" prop="endType">
												<el-radio-group v-model="conditionalForm.endType" @change="startTypeChange">
													<el-radio label="1">{{$t('taskScheduling.taskDesign.addModal.radioEndTimeOne')}}</el-radio>
													<el-radio label="2">{{$t('taskScheduling.taskDesign.addModal.radioEndTimeTwo')}}</el-radio>
												</el-radio-group>												
                                            </el-form-item>
                                            <el-form-item v-if="conditionalForm.endType==2" prop="endTime">
                                            	<el-date-picker
                                            	      v-model="conditionalForm.endTime"
                                            	      type="datetime"
                                            	      :placeholder="$t('taskScheduling.taskDesign.addModal.radioStartTimeTwoplaceholder')" value-format="yyyy-MM-dd HH:mm:ss">
                                            	    </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
									<el-row>
									    <el-col :span="24">
									        <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelTaskRestart')" prop="isRestart">
									            <el-checkbox v-model="conditionalForm.isRestart" true-label="1"
                                                             false-label="0">{{$t('taskScheduling.taskDesign.addModal.checkboxTaskRestart')}}</el-checkbox>										
									        </el-form-item>
									        <el-form-item v-if="conditionalForm.isRestart==1">
									        	<span>{{$t('taskScheduling.taskDesign.addModal.taskRestartOne')}}</span>
									        	<el-input :placeholder="$t('taskScheduling.taskDesign.addModal.simpleRepetitionTwo')" size="small" v-model="conditionalForm.restartMinute" style="width: 100px;"></el-input>
												<span>{{$t('taskScheduling.taskDesign.addModal.taskRestartThree')}}</span>
												<el-input :placeholder="$t('taskScheduling.taskDesign.addModal.taskRestartFour')" size="small" v-model="conditionalForm.restartNum" style="width: 100px;"></el-input>
									        	<span>{{$t('taskScheduling.taskDesign.addModal.taskRestartFive')}}</span>
									        </el-form-item>
									    </el-col>
									</el-row>
                                </el-form>
                            </div>
							<div class="conditional-form" v-if="active==1">
								<el-form :model="conditionalForm" :rules="stepRules" ref="conditionalFormTwo" label-width="80px">
									<el-col :span="24">
									    <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelTaskType')" prop="methodType">
											<el-radio-group v-model="conditionalForm.methodType">
												<el-radio label="1">{{$t('taskScheduling.taskDesign.addModal.radioTaskTypeOne')}}</el-radio>
												<el-radio label="2">{{$t('taskScheduling.taskDesign.addModal.radioTaskTypeTwo')}}</el-radio>
												<el-radio label="3">{{$t('taskScheduling.taskDesign.addModal.radioTaskTypeThree')}}</el-radio>
													<el-radio label="4">package</el-radio>
											</el-radio-group>
									    </el-form-item>
									</el-col>
									<template v-if="conditionalForm.methodType == 4">
										<el-col :span="24">
											<el-form-item :label="$t('packageName')" prop="packageName">
												<el-input :placeholder="$t('hintPackageNameContant')" size="small"
														  v-model="conditionalForm.packageName"  maxlength="200"></el-input>
											</el-form-item>
										</el-col>
									</template>
									<template v-if="conditionalForm.methodType != 3&&conditionalForm.methodType != 4">
										<el-col :span="24">
											<el-form-item prop="dbId"  :label="$t('taskScheduling.taskDesign.addModal.labelDatabase')">
												<avue-input-tree default-expand-all
																 v-model="conditionalForm.dbId"
																 :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderDatabase')" type="tree"
																 :dic="dataBaseTree" size="small"
																 style="width: 100%"></avue-input-tree>
											</el-form-item>
										</el-col>
										<el-col :span="24">
											<el-form-item :label="$t('taskScheduling.taskDesign.addModal.radioTaskTypeOne')" v-if="conditionalForm.methodType==1" prop="strSql">
												<!-- <el-input type="textarea" :rows="5" :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderSQLstatement')" size="small"
														  v-model="conditionalForm.strSql"></el-input> -->
												<CodemirrorSql 
												 style="height:200px;"
													:placeholder="$t('databaseManage.dataSource.addModalWriteSQLstatement')"
													v-model="conditionalForm.strSql"
												></CodemirrorSql>
											</el-form-item>
											<el-form-item :label="$t('taskScheduling.taskDesign.addModal.radioTaskTypeTwo')" prop="procName" v-else>
												<el-input type="textarea" :rows="5" :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderStoredProcedure')" size="small"
														  v-model="conditionalForm.procName"></el-input>
											</el-form-item>
										</el-col>
									</template>
									<template v-if="conditionalForm.methodType == 3">
										<el-col :span="24">
											<el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelInterfaceType')" prop="urlType">
												<el-radio-group v-model="conditionalForm.urlType">
													<el-radio label="0">Get</el-radio>
													<el-radio label="1">Post</el-radio>
												</el-radio-group>
											</el-form-item>
											<el-form-item :label="$t('taskScheduling.taskDesign.addModal.radioTaskTypeThree')" prop="url">
												<el-input type="textarea" :rows="5" :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderInterfaceAddress')" size="small"
														  v-model="conditionalForm.url"></el-input>
											</el-form-item>
										</el-col>
									</template>
								</el-form>
								<el-form :model="baseInfoForm" ref="baseInfoFormTwo" label-width="80px" :validate-on-rule-change="false">
									<el-col :span="24">
									    <el-form-item :label="$t('taskScheduling.taskDesign.addModal.labelFunctionDescription')" prop="F_Description">
									        <el-input type="textarea" :placeholder="$t('taskScheduling.taskDesign.addModal.placeholderFunctionDescription')" size="small"
									                  v-model="baseInfoForm.F_Description"  maxlength="1600"></el-input>
									    </el-form-item>
									</el-col>
								</el-form>
							</div>
                            <span slot="footer" class="dialog-footer">
                            	<el-button size="mini" type="primary" @click="prev()" v-if="active!=0">{{$t('taskScheduling.taskDesign.addModal.previousBtn')}}</el-button>
                                <el-button size="mini" type="primary" @click="next()" v-if="active!=1">{{$t('taskScheduling.taskDesign.addModal.nextStepBtn')}}</el-button>
                                <el-button 
								size="mini" 
								type="primary"
                                @click="taskFormSubmit()" 
								:loading="flagTaskDesign"
								>
								{{flagTaskDesign?$t('workFlow.WFMenu.hintSubmit'):$t('taskScheduling.taskDesign.addModal.completeBtn')}}
								</el-button>
                            </span>
                        </el-dialog>
                        <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog" v-if="hasButtonPermission('add')">{{$t('buttonModule.addBtn')}}</el-button>
                        <el-button size="small" @click="startTask" v-if="hasButtonPermission('start')">{{$t('taskScheduling.taskDesign.startBtn')}}</el-button>
                        <el-button size="small" @click="stopTask" v-if="hasButtonPermission('stop')">{{$t('taskScheduling.taskDesign.stopBtn')}}</el-button>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" @click="editTask(scope.row,scope.index)" v-if="hasButtonPermission('modify')">{{$t('tableOperationModule.editorBtn')}}</el-button>
                        <el-button type="opr-danger" size="mini" @click="deleteTask(scope.row,scope.index)" v-if="hasButtonPermission('delete')">{{$t('tableOperationModule.deleteBtn')}}</el-button>
                    </template>
                </avue-crud>

                <el-dialog v-dialogDrag :title="$t('taskScheduling.taskDesign.addFrequencyModal.modalTitle')" :close-on-click-modal="false"  :append-to-body="true"  :visible.sync="addInfoDialog" width="800px" :before-close="addInfoClose">
                    <el-form :model="addInfoForm" :rules="actRules" ref="addInfoForm" label-width="80px" :validate-on-rule-change="false">
                        <el-col :span="24">
							<el-form-item :label="$t('taskScheduling.taskDesign.addFrequencyModal.ExecutionTime')" :required="true">
								<el-col :span="6">
								  <el-form-item prop="hour">
									<el-input size="small" v-model="addInfoForm.hour" type="number"></el-input>
								  </el-form-item>
								</el-col>
								<el-col :span="2"><div style="padding-left: 10px;">&nbsp;&nbsp;{{$t('taskScheduling.taskDesign.addFrequencyModal.Hour')}}</div></el-col>
								<el-col :span="6">
								  <el-form-item prop="minute">
									<el-input size="small" v-model="addInfoForm.minute" type="number"></el-input>
								  </el-form-item>
								</el-col>
								<el-col :span="2"><div style="padding-left: 10px;">&nbsp;&nbsp;{{$t('taskScheduling.taskDesign.addFrequencyModal.Minute')}}</div></el-col>
							</el-form-item>
							<el-form-item :label="$t('taskScheduling.taskDesign.addFrequencyModal.executionDay')">
								<el-select v-model="addInfoForm.type" style="width: 100%;">
									<el-option
									  v-for="item in dayUnitOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								</el-select>													
							</el-form-item>
							<el-form-item :label="$t('taskScheduling.taskDesign.addFrequencyModal.executionMonth')" prop="carryMounth">
								<el-select v-model="addInfoForm.carryMounth" :placeholder="$t('taskScheduling.taskDesign.addFrequencyModal.placeholderSelect')" multiple style="width: 100%;">
									<el-option
									  v-for="item in monthOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								</el-select>													
							</el-form-item>
                        </el-col>
                    </el-form>
					<span slot="footer" class="dialog-footer">
						<el-button size="mini" type="primary" @click="addInfoClose()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
					    <el-button size="mini" type="primary" @click="addInfoSubmit()">{{$t('buttonModule.modalSureBtn')}}</el-button>
					</span>
                </el-dialog>

				<el-dialog v-dialogDrag :title="$t('taskScheduling.taskDesign.addExpressionModal.modalTitle')" :close-on-click-modal="false" :append-to-body="true"  :visible.sync="addCornDialog" width="800px" :before-close="addCornClose">
					<ul id="F_CronExpression" class="express-list">
						<li v-for="(o,i) in cornValueList" :key="i" @click="getCornValue(o.value)">{{o.label}}</li>
					</ul>
				</el-dialog>
            </div>
        </main-content>
    </div>
</template>

<script>
    import MainContent from "../../../page/main/MainContent";
    import {getTaskScheduleList, startTask,stopTask,deleteTask,getTaskInfo,addTaskScheduling,updateTaskScheduling} from '@/api/systemManagement/taskScheduling'
		import {getDbGroup} from '@/api/databasemanage/datasource'
		import tableOptionMixin from "@/mixins/tableOption"; //table 高度计算
		import authorizeMixin from "@/mixins/authorize";
		import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
		import CodemirrorSql from "@/components/common/CodemirrorSql";
		import {validateLength,validateDesLength,validateFuncLength} from "@/api/organization/validateFunc"; 
    export default {
        name: "TaskDesign",
        components: {MainContent,CodemirrorSql},
				mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
        data() {
			const _this = this;  
			var validateHour= (rule, value, callback) => {
				if (value == ''||value ==null||value >23||value <0) {
				  callback(new Error( this.$t('taskScheduling.taskDesign.addFrequencyModal.hourError')));
				}else {
				  callback();
				}
			};
			var validateMin= (rule, value, callback) => {
				if (value == ''||value ==null||value >59||value <0) {
				  callback(new Error(this.$t('taskScheduling.taskDesign.addFrequencyModal.minuteError')));
				}else {
				  callback();
				}
			};
            return {
				flagTaskDesign: false,
                contentTitle: '任务列表',
				dialogTitle:"",
				active:0,
                keyword: "",
                taskDesignList: [],
                userList:[],
                taskId:'',
				order:{
					order:'desc',
					prop:'F_BeginTime'
				},
                currentRow: {},
                dialogVisible: false,
                addInfoDialog:false,
				addCornDialog:false,
                baseInfoForm: {
                    "F_Name": "",
					"F_Description":""                   
                },
				conditionalForm:{
					"methodType":'1',
					"dbId":"",
					"strSql":"",
					"startType": '1',
					"startTime": "",
					"simpleType": "",
					"simpleValue":"",
					"frequencyList":[],
					"executeType":'1',
					"cornValue":"",
					"endTime":"",
					"endType":'1',
					"isRestart":'0',
					"restartNum":null,
					"restartMinute":null,
					"procName":"",
					"url":"",
					"urlType":'1',
					'packageName':''
				},
				addInfoForm:{
					"hour":null,
					"minute":null,
					"type":"day",
					"carryMounth":""
				},
				cornValueList:[{
					value: '0 0 12 * * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionOne')
				},{
					value: '0 15 10 * * ? *',
					label:this.$t('taskScheduling.taskDesign.addExpressionModal.expressionTwo')
				},{
					value: '0 15 10 * * ? 2020',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionThree')
				},{
					value: '0 * 14 * * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionTour')
				},{
					value: '0 0/5 14 * * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionFive')
				},{
					value: '0 0/5 14,18 * * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionSix')
				},{
					value: '0 0-5 14 * * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionSeven')
				},{
					value: '0 10,44 14 ? 3 WED',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionEight')
				},{
					value: '0 15 10 ? * MON-FRI',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionNine')
				},{
					value: '0 15 10 15 * ?',
					label:this.$t('taskScheduling.taskDesign.addExpressionModal.expressionTen')
				},{
					value: '0 15 10 L * ?',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionEleven')
				},{
					value: '0 15 10 ? * 6L',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionTwelve')
				},{
					value: '0 15 10 ? * 6L 2020-2022',
					label: this.$t('taskScheduling.taskDesign.addExpressionModal.expressionThirteen')
				},{
					value: '0 15 10 ? * 6#3',
					label:this.$t('taskScheduling.taskDesign.addExpressionModal.expressionFourteen')
				}],				
				dayUnitOptions:[{
				  value: 'day',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.Day')
				}, {
				  value: 'week',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.Week')
				}, {
				  value: 'month',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.Month')
				}],
				monthOptions:[{
					value: '1',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.January')
				},{
					value: '2',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.February')
				},{
					value: '3',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.March')
				},{
					value: '4',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.April')
				},{
					value: '5',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.May')
				},{
					value: '6',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.June')
				},{
					value: '7',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.July')
				},{
					value: '8',
					label:this.$t('taskScheduling.taskDesign.addFrequencyModal.August')
				},{
					value: '9',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.September')
				},{
					value: '10',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.October')
				},{
					value: '11',
					label: this.$t('taskScheduling.taskDesign.addFrequencyModal.November')
				},{
					value: '12',
					label:this.$t('taskScheduling.taskDesign.addFrequencyModal.December')
				}],
				dataBaseTree:[],
				timeUnitOptions: [{
				  value: 'minute',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.unitMinute')
				}, {
				  value: 'hours',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.unitHours')
				}, {
				  value: 'day',
				  label: this.$t('taskScheduling.taskDesign.addFrequencyModal.unitDay')
				}, {
				  value: 'week',
				  label:this.$t('taskScheduling.taskDesign.addFrequencyModal.unitWeek')
				}],
                page: {
                    pageSize: 20,
                    total: 0,
                    currentPage: 1
                },
                option: {
                    highlightCurrentRow: true,
                    stripe: false,
                    addBtn: false,
                    menuWidth: 150,
                    border: false,
					simplePage:true,
                    index: true,
                    indexLabel: this.$t('taskScheduling.taskDesign.tableNumber'),
                    align: 'center',
                    menuAlign: 'center',
                    delBtn: false,
                    editBtn: false,		
					page:true,			
                    column: [
                        {
                            sortable: true,
                            label:this.$t('taskScheduling.taskDesign.tableName'),
                            prop: 'F_Name',
							align: 'left',
							minWidth:'150',
							overHidden:true
                        }, {
                            sortable: true,
                            label: this.$t('taskScheduling.taskDesign.tableStatus'),
                            prop: 'F_State',
							align: 'left',
							formatter: function (row) {
							    return row.F_State === 1 ?_this.$t('taskScheduling.taskDesign.tableWaiting'): row.F_State === 2 ?_this.$t('taskScheduling.taskDesign.tableRunning'):row.F_State === 3 ?_this.$t('taskScheduling.taskDesign.tablePaused'):row.F_State === 4 ?_this.$t('taskScheduling.taskDesign.tableOver'):'' 
							},
							overHidden:true
                        }, {
                            sortable: true,
                            label: this.$t('taskScheduling.taskDesign.tableStartTime'),
                            prop: 'F_BeginTime',
							align: 'left',
							overHidden:true
                        }, {
                            sortable: true,
                            label:this.$t('taskScheduling.taskDesign.tableOverTime'),
                            prop: 'F_EndTime',
							align: 'left',
							overHidden:true
                        }, {
                            sortable: true,
                            label: this.$t('taskScheduling.taskDesign.tableDescription'),
                            prop: 'F_Description',
							align: 'left',
							overHidden:true
                        }
                    ]
                },
                rules: {
                    F_Name: [
                        { required: true, message: this.$t('taskScheduling.taskDesign.addModal.placeholderTaskName'), trigger: 'change' },
						{ validator: validateLength,trigger:'change'}
                    ]
                },
				stepRules:{
					strSql:[
						{ validator: validateFuncLength,trigger:'change'}
					],
					url: [
						{ validator:validateFuncLength,trigger:'change'}
					],
					procName: [
						{ validator:validateFuncLength,trigger:'change'}
					],
					F_Description: [
						{ validator:validateDesLength,tirgger:'change'}
					]
				},
				actRules: {
				    hour: [
				        { required: true, validator:validateHour,trigger: 'blur' }
				    ],
					minute:[
				        { required: true, validator: validateMin, trigger: 'blur' }
				    ],
					carryMounth:[
					    { required: true, message:this.$t('taskScheduling.taskDesign.addFrequencyModal.selectMonthError'), trigger: 'blur' }
					]
				},
				isEditAct:-1
            }
        },
		mounted() {
			this.getDbGroup()
		},
        methods: {
					handleRowDBLClick (row, event) {
						if(this.openDoubleClickEdit){
							this.editTask(row)
						}
					},
			getDbGroup(obj){
				getDbGroup(obj).then(res => {
					let arr = []
					for(let key in res.data.data){
					    let node  = {
					        label : key,
					        children : [],
							value:''
					    };
					    res.data.data[key].forEach((keys,index) => {
					        let newNode = {
					            label : keys.F_DBAlias||keys.F_DBName,
								value:keys.F_DatabaseLinkId,
								children : []
					        };
					        node.children.push(newNode);
					    });
					    arr.push(node);
					}
					this.dataBaseTree = arr
				})
			},
            /* 获取列表 */
            getTaskScheduleList() {
				var searchParam={
				    limit : this.page.currentPage,
				    size : this.page.pageSize,
				    keyword : this.keyword,
				    order : this.order.order,
				    orderField : this.order.prop
				};
                getTaskScheduleList(searchParam).then(res => {
					this.page.total= res.data.data.Total;
                    this.taskDesignList = res.data.data.Rows
                })
            },
			startTypeChange(data){
				if(data==1){
					if(this.conditionalForm.startType==1) this.conditionalForm.startTime="";
					if(this.conditionalForm.endType==1) this.conditionalForm.endTime="";
				}
			},
			startTask(){
				if(this.taskId){
					startTask(this.taskId).then(res => {
						if(res.data.success){
							this.getTaskScheduleList();
							this.taskId="";
						}else{
							this.$notify({
							    title: this.$t('deletePrompt.promptTitle'),
							    message: this.$t('deletePrompt.startFailure'),
							    type: 'warning'
							});
						}
					})
				}else{
					this.$notify({
					    title:this.$t('deletePrompt.promptTitle'),
					    message: this.$t('deletePrompt.operationHint'),
					    type: 'warning'
					});
				}
			},
			stopTask(){
				if(this.taskId){
					stopTask(this.taskId).then(res => {
						if(res.data.success){
							this.getTaskScheduleList();
							this.taskId="";
						}else{
							this.$notify({
							    title:this.$t('deletePrompt.promptTitle'),
							    message: this.$t('deletePrompt.stopFailure'),
							    type: 'warning'
							});
						}
					})
				}else{
					this.$notify({
					    title:this.$t('deletePrompt.promptTitle'),
					    message:this.$t('deletePrompt.operationHint'),
					    type: 'warning'
					});
				}
			},
            /* 新增弹窗打开 */
            openDialog() {
                this.taskId="";
				this.active=0;
                this.dialogVisible = true;
                this.dialogTitle = this.$t('taskScheduling.taskDesign.addModal.modalTitle');
				this.baseInfoForm= {
				    "F_Name": "",
					"F_Description":""                   
				};
				this.conditionalForm={
					"methodType":'1',
					"dbId":"",
					"strSql":"",
					"startType": '1',
					"startTime": "",
					"simpleType": "",
					"simpleValue":"",
					"frequencyList":[],
					"executeType":'1',
					"cornValue":"",
					"endTime":"",
					"endType":'1',
					"isRestart":'0',
					"restartNum":null,
					"restartMinute":null,
					"procName":""
				};
				
            },
            /* 完成 */
        taskFormSubmit() {
				this.flagTaskDesign = true;
				let flag=false;
				if(this.active==0){
					this.$refs['baseInfoForm'].validate((valid) => {
						if (valid) {
							flag=true;
						} else {
							flag=false;
						}
					});
				}else{
					flag=true;
				}
				if(flag){ 
					let tempform={
						"SchemeInfo":this.baseInfoForm,
						"Scheme":{
							"F_Scheme":JSON.stringify(this.conditionalForm)
						}
					}
					if (this.taskId) {
						updateTaskScheduling(this.taskId,tempform).then(() => {
							this.dialogVisible = false;
							this.getTaskScheduleList();
							this.taskId="";
						}).finally(() => {
							this.flagTaskDesign = false;
						})
					} else {
						addTaskScheduling(tempform).then(() => {
							this.dialogVisible = false;
							this.getTaskScheduleList();
						}).finally(() => {
							this.flagTaskDesign = false;
						})                          
					}
				}else{
					this.flagTaskDesign=false
				}
            },
            /* 编辑 */
            editTask(row,index) {
                this.dialogVisible = true;
				this.dialogTitle =this.$t('taskScheduling.taskDesign.editModal.modalTitle');
				this.taskId=row.F_Id;
                getTaskInfo(row.F_Id).then(res => {	
					var SchemeInfo=res.data.data.SchemeInfo;
					var Scheme=res.data.data.Scheme || '';
					this.baseInfoForm.F_Name=SchemeInfo.F_Name;
					this.baseInfoForm.F_Description=SchemeInfo.F_Description;
					this.conditionalForm=JSON.parse(Scheme.F_Scheme);
					this.active = 0;
					//因为radio的值不是弱类型，所以必须做以下值类型改变
					this.conditionalForm.methodType=this.conditionalForm.methodType.toString();
					this.conditionalForm.startType=this.conditionalForm.startType.toString();
					this.conditionalForm.executeType=this.conditionalForm.executeType.toString();
					this.conditionalForm.endType=this.conditionalForm.endType.toString();
					this.conditionalForm.isRestart=this.conditionalForm.isRestart.toString();
					
				})
            },

            rowClick(row,event,column) {
                this.taskId=row.F_Id                
            },
            /* 删除 */
            deleteTask(row,index) {
                this.$confirm(this.$t('deletePrompt.promptContent'),this.$t('deletePrompt.promptTitle'), {
                    confirmButtonText: this.$t('buttonModule.modalSureBtn'),
                    cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
                    type: 'warning'
                }).then(() => {
                    deleteTask(row.F_Id).then(() => {
                        this.getTaskScheduleList();
                        this.$notify({
                            title:this.$t('deletePrompt.successTitle'),
                            message:this.$t('deletePrompt.successDeleted'),
                            type: 'success'
                        });
                    })
                }).catch(() => {

                });

            },
            /* 关闭弹窗 */
            handleClose(done) {	
				if(this.active<=0) this.$refs['baseInfoForm'].resetFields();			
				done()
            },
            /* 查询表单重置 */
            searchReset() {
                this.keyword= "";
				this.getTaskScheduleList();
            },
            
            onPageLoad(page) {
                this.page.currentPage = page.currentPage;
                this.page.pageSize = page.pageSize
                this.getTaskScheduleList();				
            },
			prev() {
				--this.active;
				if(this.active<0) this.active=0;
			},
			next() {
				this.$refs['baseInfoForm'].validate((valid) => {
				    if (valid) {
						if(this.active++>1) this.active=0;
					}
				})
			},
			addInfoClick(){
				if (this.$refs['addInfoForm']!==undefined) {
				    this.$refs['addInfoForm'].resetFields();
				}
				this.addInfoDialog=true;
			},
			addInfoClose(){
				this.addInfoDialog=false;
				this.isEditAct=-1;
			},
			addInfoSubmit(){
				var data=Object.assign({},this.addInfoForm);
				this.$refs['addInfoForm'].validate((valid) => {
					if (valid) {
						if(this.isEditAct>=0){
							this.conditionalForm.frequencyList.splice(this.isEditAct,1,data);
						}else{
							this.conditionalForm.frequencyList.push(data);
						}
						
						this.addInfoDialog=false;
						this.isEditAct=-1;
						return true;
					}
				});
			},
			editActInfo(obj,i){
				this.isEditAct=i;
				this.addInfoDialog=true;
				this.addInfoForm=Object.assign({},obj);
			},
			deleteActInfo(i){
				var temparr=[...this.conditionalForm.frequencyList];
				temparr.splice(i,1);
				this.conditionalForm.frequencyList=temparr;
			},
			sortChange(val){
				this.order.order=val.order=="ascending"?"asc":"desc";
				this.order.prop=val.prop;
				this.getTaskScheduleList();
			},
			addCornValue(){
				this.addCornDialog=true;
			},
			addCornClose(){
				this.addCornDialog=false;
			},
			getCornValue(data){
				this.addCornDialog=false;
				this.conditionalForm.cornValue=data;
			}
        }
    }
</script>

<style scoped>
    /* css */
    .main-container {
        height: 100%;
        padding: 0 10px;
    }
	.express-list{
		list-style: none;
		padding-left: 0;
		line-height: 34px;
		margin: 0;
	}
	.express-list li{
		border-bottom: 1px solid #eee;
	}
	.express-list li:nth-child(2n) {
	    background: rgba(0,0,0,0.02);
	}
	::v-deep .el-form-item {
		margin-bottom: 22px!important;
		margin-top: 0!important;
	}
	::v-deep .el-form-item .el-form-item {
		margin-bottom: 0!important;
	}
	::v-deep .el-form-item__label{
		margin-bottom: 0!important;
	}
	::v-deep .el-form-item__content .el-col{
		margin-bottom: 0!important;
	}
/deep/ .baseInfo-form .el-radio__label,/deep/ .baseInfo-form .el-checkbox__label,/deep/ .conditional-form .el-radio__label{
	font-size: 12px;
}
</style>