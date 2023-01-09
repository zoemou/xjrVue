<template>
    <div class="main-container">
        <!-- 此处放置菜单树 -->
        <main-fixed :title="fixedTitle" :resize="true">
            <div slot="list">
                <el-tree
                    :data="interfaceTree"
                    :props="defaultProps"
                    node-key="F_Id"
                    ref="cTree"
                    :default-expand-all="true"
                    @node-click="handleNodeClick"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data}">
                        <span>{{data.F_Name}}</span>
                    </span>
                </el-tree>
            </div>
        </main-fixed>
        <main-content :title="contentTitle" :paddingLeft="205" :padding-top="94">
            <div slot="search">
                <!-- 放置搜索区域内容 -->
                <div class="search-box">
					<el-form :inline="true">
						<el-form-item :label="$t('News.labelKeyword')">
							<el-input
								v-model="keyword"
								size="small"
								:placeholder="$t('enterInterfaceName/AddrQuery')"
								style="width: 200px; margin-right:5px"
							></el-input>
						</el-form-item>
						<el-form-item :label="$t('reqType')">
							<el-select
								v-model="requestMethod"
								:placeholder="$t('selectInterfaceType')"
								style="width: 200px; margin-right: 5px"
							>
								<el-option v-for="it in searchType" :label="it.label" :value="it.value" :key="it.value"></el-option>
							</el-select>
						</el-form-item>
						<el-button
							type="primary"
							icon="el-icon-search"
							size="small"
							
							@click="searchInterface"
						>
							{{$t('searchModule.searchBtn')}}
						</el-button>
						<el-button 
							icon="el-icon-refresh" 
							size="small" 
							@click="searchReset"
						>
							{{$t('searchModule.searchReset')}}
						</el-button>
					</el-form>
                </div>
            </div>
            <!-- 放置表格内容 -->
            <div slot="table" style="height: 100%;">
                <avue-crud
                    :data="interfaceList"
                    :option="option"
                    ref="cuTable"
                    stripe 
                    :page.sync="page" 
                    :showColumn="showColumn"
                    :isSaveColumns="true"
                    @on-load="onPageLoad" 
                    @row-click="handleCurrentRowChange"
                    @row-dblclick="handleRowDBLClick"
                >
                    <template slot="F_EnabledMark" slot-scope="scope">
                        <avue-switch
                        disabled
                        active-color="#13ce66"
                        inactive-color="#a29e9e"
                        v-model="scope.row.F_EnabledMark"
                        :dic="switchDic"
                        ></avue-switch>
                    </template>
                    <template slot-scope="scope" slot="menuLeft">
                        <AddInterfaceCategory v-if="categoryDialogVisible" :visible.sync="categoryDialogVisible"
                        :dialogTitle="categoryDialogTitle" @submitRes="getInterfaceCategoryList"
                        :interfaceForm="interfaceCategoryForm"
                        ></AddInterfaceCategory>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="small"
                            @click="add()"
							v-if="hasButtonPermission('add')"
                        >
                            {{$t('buttonModule.addBtn')}}
                        </el-button>
                        <!-- ******启用停用事件******* -->
                        <el-button size="small" @click="startTask()" v-if="hasButtonPermission('ennable')">{{$t('custmerForm.tableEnable')}}</el-button>
                        <el-button size="small" @click="stopTask()" v-if="hasButtonPermission('disable')">{{$t('deletePrompt.Disable')}}</el-button>
                        
                        <el-dialog
                            v-dialogDrag
                            :title="dialogTitle"
                            :append-to-body="true"
                            :visible.sync="dialogVisible"
                            :close-on-click-modal="false"
                            width="60%"
                            :before-close="cancelBtn"
                            style="padding: 10px 20px;"
							top="20px"
							class="systemDialog"
                        >
                            <div class="baseinfo-form" id="baseinfo-form">
                                <el-form
                                    :rules="rules"
                                    ref="sysInterfaceForm"
                                    :model="sysInterfaceForm"
                                    label-width="80px"
                                >
                                    <el-row v-show="hasFormPermission('F_Name')">
                                        <el-col :span="24">
                                            <el-form-item prop="F_Name" :label="$t('interfaceManage.addModal.labelName')">
                                                <el-input :placeholder="$t('enterInterfaceName')" size="small" v-model="sysInterfaceForm.F_Name" :readonly="readOnlyFlag"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-show="hasFormPermission('F_CategoryId')">
                                        <el-col :span="24">
                                            <el-form-item prop="F_CategoryId" :label="$t('interfaceSort')">
                                                <avue-input-tree
                                                    default-expand-all
                                                    v-model="sysInterfaceForm.F_CategoryId"
                                                    :placeholder="$t('interfaceSort')"
                                                    type="tree"
                                                    :dic="defaultTree"
                                                    size="small"
                                                    style="width: calc(100% - 37px)"
													:disabled="readOnlyFlag"
                                                >
                                                </avue-input-tree>
                                                <!-- 新增分类 -->
                                                <el-button type="primary" icon="el-icon-plus" size="small" @click="addCategory" style="margin-left:3px;" v-if="!readOnlyFlag"></el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12" v-show="hasFormPermission('F_RequestMethod')">
                                            <el-form-item :label="$t('reqType')" prop="F_RequestMethod" >
												<el-select v-model="sysInterfaceForm.F_RequestMethod" :placeholder="$t('selectRequestType')" :disabled="readOnlyFlag">
												  <el-option
													  v-for="item in searchType"
													  :key="item.value"
													  :label="item.label"
													  :value="item.value">
													</el-option>
												</el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6" v-show="hasFormPermission('F_EnableMark')">
											<el-form-item :label="$t('custmerForm.tableEnable')" prop="F_EnabledMark" >
												<el-switch v-model="sysInterfaceForm.F_EnabledMark" :active-value="1"
												:inactive-value="0" :disabled="readOnlyFlag"></el-switch>
											</el-form-item>
                                        </el-col>
										<el-col :span="6" v-show="hasFormPermission('F_IsInternal')">
											<el-form-item :label="$t('internalInterface')" prop="F_IsInternal" >
											  <el-switch v-model="sysInterfaceForm.F_IsInternal" :active-value="0"
												:inactive-value="1" :disabled="readOnlyFlag"></el-switch>
											</el-form-item>
										  </el-col>
                                    </el-row>
                                    <el-row v-show="hasFormPermission('F_UrlAddress')">
                                        <el-col :span="24">
                                            <el-form-item prop="F_UrlAddress" :label="$t('interfaceManage.addModal.labelAddress')">
                                                <el-input :placeholder="$t('enterInterfaceAddress')" size="small" v-model="sysInterfaceForm.F_UrlAddress" :readonly="readOnlyFlag"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-show="hasFormPermission('F_Description')">
                                        <el-col :span="24">
                                            <el-form-item prop="F_Description" :label="$t('orgUserManagement.tabRemark')">
                                                <el-input :placeholder="$t('workFlow.Process.placeholderRemark')" size="small" v-model="sysInterfaceForm.F_Description" :readonly="readOnlyFlag"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                            <div class="tableinfo-form" :style="{height:boxHeight}">
                                <el-tabs v-model="paramActiveName" style="height: 100%;">
                                    <el-tab-pane :label="$t('workFlow.zh.inputParameter')" name="0">
                                        <el-tabs v-model="activeName" @tab-click="changeTabs" style="height: 100%;">
                                            <el-tab-pane :label="item.label" :name="item.value+''" v-for="item in axiosMethod" :key="item.value">
                                                <avue-crud 
                                                    ref="tableInfo"
                                                    :data="tableInfo"
                                                    :option="tableInfoOption"
                                                    stripe
                                                >
                                                    <template slot="add" slot-scope="scope">
                                                        <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" 
                                                        @click="deleteData(1,scope)"></i>
                                                    </template>
                                                    <template slot="isChecked" slot-scope="scope">
                                                        <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
                                                    </template>
                                                    <template slot="F_ParamKey" slot-scope="scope">
                                                        <el-input v-model="scope.row.F_ParamKey" :placeholder="$t('enterParamterName')"></el-input>        
                                                    </template>
                                                    <template slot="F_ParamValue" slot-scope="scope">
                                                        <el-input v-model="scope.row.F_ParamValue" :placeholder="$t('enterParameterValueDefaultValue')"></el-input>
                                                    </template>
                                                    <template slot="F_Description" slot-scope="scope">
                                                        <el-input v-model="scope.row.F_Description" :placeholder="$t('workFlow.Process.placeholderRemark')"></el-input>        
                                                    </template>
                                                </avue-crud>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-tab-pane>
                                    <el-tab-pane :label="$t('workFlow.zh.outputParameter')" name="1">
                                        <avue-crud
                                            ref="exportTableInfo"
                                            :data="sysInterfaceForm.F_Outputs"
                                            :option="exportTableOption"
                                            stipe
                                            @sortable-change="sortableChange"
											style="height: calc(100% - 70px);padding-bottom: 10px;"
                                        >
                                            <template slot="add" slot-scope="scope">
                                                <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(2,scope)"></i>
                                            </template>
											<template slot="F_Type" slot-scope="scope">
												<el-select
													:placeholder="$t('selectParameterDataCategory')"
													v-model="scope.row.F_Type"
													size="small"
												>
													<el-option :label="$t('characterType')" :value="0" key="1"></el-option>
													<el-option :label="$t('objectCollection')" :value="1" key="0"></el-option>
												</el-select>
											</template>
                                            <template slot="F_OutputKey" slot-scope="scope">
                                                <el-input v-model="scope.row.F_OutputKey" :placeholder="$t('selectDataTypeThenConfigOutputEncoding')"
												:suffix-icon="scope.row.F_Type==1?'el-icon-more':''"
												@focus="outputCodeClick(scope.row)"></el-input>        
                                            </template>
                                            <template slot="F_ResultKey" slot-scope="scope">
                                                <el-input v-model="scope.row.F_ResultKey" :placeholder="$t('outputParameterDestination')"></el-input>
                                            </template> 
                                            <template slot="F_Description" slot-scope="scope">
                                                <el-input v-model="scope.row.F_Description" :placeholder="$t('workFlow.Process.placeholderRemark')"></el-input>        
                                            </template>
                                        </avue-crud>
										<div class="notice">
											<div>{{$t('hintOutputParameterTargetLocation')}}</div>
											<div>{{$t('exampleReturningJson')}}</div>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
								
							</div>
                            <span class="dialog-footer" slot="footer" v-if="!readOnlyFlag">
                                <el-button size="mini" @click="cancelBtn()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
                                <el-button 
                                    type="primary" 
                                    size="mini" 
                                    @click="submitBtn()" 
                                    :loading="flagInterfaceInfo"
                                >{{flagInterfaceInfo?$t('workFlow.WFMenu.hintSubmit'):$t('buttonModule.modalSureBtn')}}</el-button>
                            </span>
                        </el-dialog>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="opr-primary" size="mini" @click="editInterface(scope.row,1)" v-if="hasButtonPermission('view')">{{$t('Notice.Tab.viewBtn')}}</el-button>
                        <el-button type="opr-primary" size="mini" @click="editInterface(scope.row,0)" v-if="hasButtonPermission('edit')">
                            {{$t('tableOperationModule.editorBtn')}}
                        </el-button>
                        <el-button type="opr-danger" size="mini" @click="deleteInterface(scope.row,scope.index)" v-if="hasButtonPermission('delete')">
                            {{$t('tableOperationModule.deleteBtn')}}
                        </el-button>
                    </template>
                </avue-crud>
            </div>
        </main-content>
        <!-- <el-dialog v-dialogDrag
            :title="$t('workFlow.privateStampInfo.titleInfor')"
            :append-to-body="true"
            :visible.sync="okDialog"
            width="30%"
            :before-close="okClose"
            :close-on-click-modal="false"
            >
            <div v-if="okDialog">
                <i class="fa fa-question-circle-o"></i>
                {{okMessage}}
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="okSubmit">{{$t('buttonModule.modalSureBtn')}}</el-button>
            </span>
        </el-dialog> -->
		<objParamDialog v-if="objParamVisible" :visible.sync="objParamVisible" @changeData="changeObjParamData" :param="curVariable" fromType="system"></objParamDialog>
    </div>
</template>

<script>
import tableOptionMixin from "@/mixins/tableOption";
import MainFixed from "../../page/main/MainFixed";
import MainContent from "../../page/main/MainContent";
import {
    getInterfaceInfoList,
    getInterfaceInfo,
    addInterfaceInfo,
    updateSysInterfaceInfo,
    startInterface,
    stopInterface,
    deleteInterfaceInfo
} from '@/api/systemManagement/interfacemanage';
import {getInterfaceCategoryList,addInterfaceCategory} from '@/api/systemManagement/interfaceCategory';
import { FormatTree,formValidateNotice } from "../../util/util.js";
import AddInterfaceCategory from "./components/AddInterfaceCategory.vue";
import { axiosMethod,axiosType } from '@/util/util';
import { mapGetters } from "vuex";
import authorizeMixin from "@/mixins/authorize";
import displayColumnsMixin from "@/mixins/displayColumns"; //表格展示列显隐保存
import objParamDialog from './InterfaceDevelopment/component/objParamDialog.vue';
export default {
    computed: {
    ...mapGetters(["SystemInterface"])	
  },
    name: "SystemInterface",
    mixins: [tableOptionMixin,authorizeMixin,displayColumnsMixin],
    components: { MainContent, MainFixed,AddInterfaceCategory,objParamDialog},
    data () {
        return {
			paramActiveName:'0',
			curVariable:'',
			objParamVisible:false,
			searchType:axiosType,
			activeName:'2',
            axiosMethod:axiosMethod,
            flagInterfaceInfo:false,
            readOnlyFlag:false,
			boxHeight:'50%',
            interfaceTree: [],
            interfaceList: [],//表格数据
            fixedTitle: this.$t('interfaceSort'),
            contentTitle: "接口管理",
            categoryDialogTitle:this.$t('addInterfaceSort'),
            categoryDialogVisible:false,
            defaultprops: {
                children: "children",
                label: "F_ItemValue"//指定节点标签为节点对象的某个属性值
            },
            order: {
                order: "desc",
                prop: "",
            },
            page: {
                pageSize: 20,
                total: 0,
                currentPage: 1,
            },
            keyword: null,
            requestMethod : "",
            categoryId: "",
            dialogTitle: "",
            dialogVisible: false,
            // okDialog: false,
            // okMessage:this.$t('hintSureDisableInterface'),
            curRow: "",
            sysInterfaceForm: {},
            defaultTree: [],//接口分类菜单树数据处理dicData
            interfaceCategoryForm: {//新增分类
                F_Name: "",
                F_EnCode: "",
                F_ParentId: "",
                F_Description: "",
                F_SortCode: ""
            },
            switchDic: [
                {
                    label: "",
                    value: 0
                },
                {
                    label: "",
                    value: 1
                }
            ],
            option: {
                highlightCurrentRow: true,
                viewBtn:false,
                addBtn: false,
                delBtn: false,
                editBtn: false,
                stripe: false,
                menuWidth: 150,                
                border: false,
                selection: false,
                simplePage: true,
                index: true,
                indexLabel: this.$t('interfaceManage.addModal.tableNumber'),//开启索引，并将索引字段设置为"this.$t('interfaceManage.addModal.tableNumber')"
                align: 'center',
                menuAlign: 'center',
                // 
                column: [
                    {
                        label: this.$t('interfaceId'),
                        minWidth: '95',
                        prop: 'F_Id',
                        align: 'left',
                        sortable: true,
                    	overHidden:true
                    },
                    {
                        label: this.$t('interfaceManage.addModal.labelName'),
                        minWidth: '95',
                        prop: 'F_Name',
                        align: 'left',
                        sortable: true,
						overHidden:true
                    },
                    {
                        label: this.$t('interfaceManage.addModal.labelAddress'),
                        minWidth: '140',
                        prop: 'F_UrlAddress',
                        align: 'left',
                        sortable: true,
						overHidden:true
                    },
                    {
                        label: this.$t('interfaceSort'),
                        minWidth: '95',
                        prop: 'F_CategoryName',
                        align: 'left',
                        sortable: true,
						overHidden:true
                    },
                    {
                        label: this.$t('reqType'),
                        prop: "F_RequestMethod",
                        minWidth: "95",
                        align: 'left',
                        sortable: true,
						formatter:(row,value)=>{
							let temp=axiosType.filter(o=>{return o.value==value})
							return temp.length>0?temp[0].label:''
						}
                    },
                    {
                        label: this.$t("menuManagement.tableEffective"),
                        prop: "F_EnabledMark",
                        minWidth: "80",
                        slot: true,
			            overHidden:true,
                        sortable: true
                    },
                    {
                        label:this.$t('orgUserManagement.tabRemark'),
                        prop: "F_Description",
                        minWidth: "95",
                        sortable: true,
						overHidden:true
                    }
                ],
            },
            rules:{
                F_Name: [
                    { required: true, message:this.$t('enterInterfaceName'), trigger: "blur" },
                ],
                F_CategoryId: [
                    { required: true, message:this.$t('selectInterfaceSort'), trigger: "change" },
                ],
                F_RequestMethod: [
                    { required: true, message:this.$t('selectRequestType'), trigger: "change" },
                ],
                F_UrlAddress:[
                    { required: true, message:this.$t('enterInterfaceAddress'), trigger: "blur" },
                ],
            },
            tableInfo:[],
            tableInfoOption:{
                highlightCurrentRow: true,
                stripe: true,
                height: '100%',
                border: true,
                align: 'center',
                menu: false,
                page: false,
                sortable: true,
                dragHandler: true,
                header: false,
                column:[
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
                    },
                    {
                    label: this.$t('workFlow.User.tableSelect'),
                    prop: 'isChecked',
                    width: '60px',
                    slot: true
                },
                    {
                        label:this.$t('parameterNameKey'),
                        prop: 'F_ParamKey',
                        slot: true
                    },
                    {
                        label: this.$t('parameterValue'),
                        prop: 'F_ParamValue',
                        slot: true
                    }, 
                    {
                        label: this.$t('orgUserManagement.tabRemark'),
                        prop: 'F_Description',
                        slot: true
                    }
                ]
            },
            exportTableOption:{
                highlightCurrentRow: true,
                stripe: true,
                height: '100%',
                border: true,
                align: 'center',
                menu: false,
                page: false,
                sortable: true,
                dragHandler: true,
                header: false,
                column:[
                    {
                        label: '',
                        prop: 'add',
                        renderHeader: (h) => {
                        return h('i',
                            {
                                style: { color: '#409EFF', fontSize: '20px', display: 'block' },
                                class: 'el-icon-circle-plus',
                                on: {
                                click: this.addExportRow
                                }
                            }
                        );
                        },
                        width: '50px',
                        slot: true
                    },
                    {
                        label:this.$t('outputParameterDataCategory'),
                        prop: 'F_Type',
                        slot: true
                    },
                    {
                        label: this.$t('outputParameterCodeKey'),
                        prop: 'F_OutputKey',
                        slot: true
                    },
					 {
					     label: this.$t('outputParameterDestination'),
					     prop: 'F_ResultKey',
					     slot: true
					 },
                    {
                        label: this.$t('orgUserManagement.tabRemark'),
                        prop: 'F_Description',
                        slot: true
                    }
                ]
            },

        }
    },
    created () {
        this.getInterfaceInfoList();
        this.getInterfaceCategoryList();
    },
    methods: {
        /*获取接口分类树 */
        getInterfaceCategoryList () {
            getInterfaceCategoryList().then(res => {
				// this.page.total= res.data.data.Total;
                this.interfaceTree = res.data.data;//左侧树形菜单
                this.defaultTree = FormatTree(
                    res.data.data,
                    "F_Id",
                    "F_Name",
                    "children"
                );
                })
        },
		handleNodeClick(data) {
		  this.categoryId = data.F_Id;
		  this.getInterfaceInfoList();
		},
		handleRowDBLClick (row, event) {
		  if(this.hasButtonPermission('edit')&&this.openDoubleClickEdit){
		    this.editInterface(row,0)
		  }
		},
        /* 表格选中一行*/
        handleCurrentRowChange(row) {
            this.curRow = row;
        },
		changeObjParamData(data){
			this.curVariable.F_OutputKey=data.outputObjName;
			this.curVariable.F_SettingJson=JSON.stringify(data);
		},
		outputCodeClick(row){
			this.curVariable=row;
			if(row.F_Type==1){
				this.objParamVisible=true;
			}
		},
        changeTabs(){
			this.tableInfo=this.sysInterfaceForm.F_Params.filter(o=>{
				return o.F_Type==this.activeName
			});
		},
        /* 获取接口表格数据 */
        getInterfaceInfoList() {
            var obj = {
				category:this.categoryId,
                method: this.requestMethod,
                limit: this.page.currentPage,
                size: this.page.pageSize,
                keyword: this.keyword,
                order: this.order.order,
                orderfield: this.order.prop,
            };
            getInterfaceInfoList(obj).then((res)=>{
                this.interfaceList = res.data.data.Rows;
				this.page.total=res.data.data.Total
            });
        },
        /*新增弹框*/
        add() {
            this.dialogVisible = true;
            this.dialogTitle = this.$t('interfaceManage.addModal.modalTitle');
            this.tableInfo=[];
            this.paramActiveName='0';
            this.activeName='2';
						this.readOnlyFlag=false;
            this.sysInterfaceForm = {
                F_Name: "",
                F_CategoryId: "",
                F_EnabledMark: 1,
                F_RequestMethod: "",
                F_UrlAddress: "",
                F_Description: "",
				F_IsCustomize:0,
				F_IsInternal:1,
                F_Params:[],
				F_Outputs:[]
            };
			this.$nextTick(()=>{
				let box=document.getElementById('baseinfo-form').offsetHeight;
				this.boxHeight='calc(100% - '+box+'px)';
				this.$refs.sysInterfaceForm.resetFields()
			})			
        },
        /* 新增分类*/
        addCategory() {
            this.categoryDialogVisible = true;
            this.interfaceCategoryForm = {
                F_Name: "",
                F_EnCode: "",
                F_ParentId: "",
                F_Description: "",
                F_SortCode: ""
            }
        },
        /*提交表单 */
        submitBtn() {
            this.flagInterfaceInfo = true;
			this.$refs["sysInterfaceForm"].validate((valid,object) => {
				if(valid){
					for(let o of this.sysInterfaceForm.F_Params){
						if(o.F_ParamKey===""||o.F_ParamKey===null||o.F_ParamKey===undefined){
							this.$message({
							  message:this.$t('parameterNameInputParameterCannotEmpty'),
							  type: "warning",
							});
							this.flagInterfaceInfo = false;
							return;
						}
					}
					//this.readOnlyFlag = false;
					if (this.sysInterfaceForm.id) {
						updateSysInterfaceInfo(this.sysInterfaceForm.id,this.sysInterfaceForm).then(() => {
							this.dialogVisible = false;
							this.getInterfaceInfoList();
						}).finally(() => {
							this.flagInterfaceInfo = false;
						})
					} else {
						addInterfaceInfo(this.sysInterfaceForm).then(() => {
							this.dialogVisible = false;
							this.getInterfaceInfoList();
						}).finally(() => {
							this.flagInterfaceInfo = false;
						})                          
					}
				}else{
					formValidateNotice(object,this,this.formEnCodeList)
					this.flagInterfaceInfo = false;
					return
				}
			})
        },
        /*启用 */
        startTask(){
			if (
				!this.curRow.F_Id ||
				this.curRow.F_Id === ""
			) {
				this.$message({
				  message:this.$t('deletePrompt.hintSelectData'),
				  type: "warning",
				});
				return;
			}
			if (this.curRow.F_EnabledMark == 1) {
				this.$message({
				  message:this.$t('interfaceEnabled'),
				  type: "warning",
				});
				return;
			}
			this.$confirm(this.$t('sureWamtEnableInterface'), this.$t('deletePrompt.promptTitle'), {
				confirmButtonText:this.$t('buttonModule.modalSureBtn'),
				cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
				type: 'warning'
			}).then(() => {
				startInterface(this.curRow.F_Id).then((res) => {
					this.$notify({
						title:this.$t('deletePrompt.successTitle'),
						message:this.$t('deletePrompt.enableSuccessful'),
						type: 'success'
					});
					this.getInterfaceInfoList();
				});
			}).catch(() => {});	  
        },
        /*停用 */
        stopTask(){
			if (
			  !this.curRow.F_Id ||
			  this.curRow.F_Id === ""
			) {
			  this.$message({
			    message:this.$t('deletePrompt.hintSelectData'),
			    type: "warning",
			  });
			  return;
			}
			if (this.curRow.F_EnabledMark === 0) {
			  this.$message({
			    message:this.$t('interfaceDisabled'),
			    type: "warning",
			  });
			  return;
			}
			const h = this.$createElement;
			this.$msgbox({
			  title:this.$t('language.languageType.Hint.titlePrompt'),
			  message: h('div', null, [
				h('div', null, [
					h('span',{class:'fa fa-question-circle-o',style:'font-size: 42px;color: #FE9400;vertical-align: middle;padding-right:10px'},''),
					h('span',{style:'font-size: 16px;font-weight: 700;line-height:42px;vertical-align: middle;'},this.$t('sureWantDisableInterface'))]),
				h('p', { style: 'color: #999;font-size: 14px;padding-left: 46px;' }, this.$t('disableInterfaceAllFunctionReference'))
			  ]),
			  showCancelButton: true,
			  confirmButtonText:this.$t('buttonModule.modalSureBtn'),
			  cancelButtonText:this.$t('buttonModule.modalCancelBtn'),
			  beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
				  instance.confirmButtonLoading = true;
				  instance.confirmButtonText = this.$t('language.dataDictionary.hintExecut');
					  stopInterface(this.curRow.F_Id).then((res) => {
					  	instance.confirmButtonLoading = false;
					  	this.$notify({
					  	    title:this.$t('deletePrompt.successTitle'),
					  	    message:this.$t('deletePrompt.disableSuccessful'),
					  	    type: 'success'
					  	});
					  	this.getInterfaceInfoList();
					  	done();
					  });
				} else {
				  done();
				}
			  }
			}).then(action => {}).catch(() => {});
        },
        
		/* 编辑 */
		editInterface(row,type) {
		    this.dialogVisible = true;
		    this.readOnlyFlag = type==1?true:false;
			this.tableInfo=[];
			this.paramActiveName='0';
			this.activeName='2';
			this.dialogTitle = type==1?this.$t('viewInterface'):this.$t('interfaceManage.addModal.editInterface');
			this.$nextTick(()=>{
				let box=document.getElementById('baseinfo-form').offsetHeight;
				this.boxHeight='calc(100% - '+box+'px)'				
			})
			getInterfaceInfo(row.F_Id).then(res=>{
				this.sysInterfaceForm = res.data.data;
				let params=this.sysInterfaceForm.F_Params||[];
				params.forEach(o=>{
					o.id=new Date().getTime()+(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
				})
				this.sysInterfaceForm.F_Params=params;
				this.sysInterfaceForm.F_Outputs=this.sysInterfaceForm.F_Outputs||[]
				this.changeTabs()
				
			})
		},
		/* 删除 */
		deleteInterface(row,index) {
		    this.$confirm(this.$t('deletePrompt.promptContent'),  this.$t('deletePrompt.promptTitle'), {
		        confirmButtonText:  this.$t('buttonModule.modalSureBtn'),
		        cancelButtonText: this.$t('buttonModule.modalCancelBtn'),
		        type: 'warning'
		     }).then(() => {
		        deleteInterfaceInfo(row.F_Id).then(() => {
		            this.getInterfaceInfoList();
		            this.$notify({
		                title:this.$t('deletePrompt.successTitle'),
		                message: this.$t('deletePrompt.successDeleted'),
		                type: 'success'
		               });
		        })
		    }).catch(() => {
		
		    });    
		},
        cancelBtn() {
					this.$refs["sysInterfaceForm"].resetFields()
            this.dialogVisible = false;			
        },
        /* 查询 */
        searchInterface() {
            this.getInterfaceInfoList();
        },
        /* 查询表单重置 */
        searchReset() {
            this.keyword = null;
            this.requestMethod = "";
            this.getInterfaceInfoList();
        },
        /*表单子表格新增行数据 */
        addRow () {
			if(this.readOnlyFlag) return;
            var obj = {
                isChecked: true,
		        id:new Date().getTime()+(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
                F_ParamKey:'',
                F_ParamValue: '',
                F_Description: '',
				F_Type:this.activeName,
				F_IsCustom:0
            };
			this.sysInterfaceForm.F_Params.push(obj)
            this.tableInfo.push(obj)
        },
		addExportRow() {
			if(this.readOnlyFlag) return;
            var obj = {
                id:new Date().getTime()+(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
                F_OutputKey:'',
                F_ResultKey: '',
                F_Description: '',
				F_SettingJson:'',
				F_Type:0
            };
			this.sysInterfaceForm.F_Outputs.push(obj)
        },
		deleteData (type,scope) {
		  if(this.readOnlyFlag) return;
		  if(type==1){
			  let index=this.sysInterfaceForm.F_Params.findIndex(o=>{return o.id==scope.row.id})
			  this.sysInterfaceForm.F_Params.splice(index, 1);
			  this.tableInfo.splice(scope.row.$index, 1);
		  }else{
			  this.sysInterfaceForm.F_Outputs.splice(scope.row.$index, 1);
		  }
		},
        sortableChange (oldindex, newindex, row, list) {
            this.tableInfo = [];
            this.$nextTick(() => {
                this.tableInfo = list;
            });
        },
		onPageLoad(page) {
		    this.page.currentPage= page.currentPage;
		    this.page.pageSize = page.pageSize;
		    this.getInterfaceInfoList();
		}
    }
}
</script>
<style scoped>
    .notice{
		font-size: 12px;
		color:red;
		line-height: 20px;
	}
    .main-container {
        height: 100%;
        padding: 0 8px;
    }
	.express-list{
		list-style: none;
		padding-left: 0;
		line-height: 34px;
		margin: 0;
	}
	.express-list li{
		border-bottom: 1px solid #ccc;
	}
	.express-list li:nth-child(2n) {
	    background: #fafafa;
	}
	
	
	div /deep/.el-row >.el-col >.el-form-item{
			margin-bottom:12px!important;
		}
	
	.baseInfo-form /deep/.avue-crud__pagination{
		display: none;
	}	
	@media screen and (max-width: 1370px) {
	    /deep/.el-dialog{
		margin-top:8vh!important;
	   }
	     
	}
    /deep/.el-tag{
		margin: 0px 0px 5px 5px;
	}
	/deep/ .avue-crud .avue-crud__tip{
		display: none;
	}	
	/deep/ .search-box .el-form-item{
		margin-top: 0;
		margin-right: 0px;
		margin-left: 10px;
	}
	.systemDialog /deep/ .el-dialog{
		height: calc(100% - 40px);
	}
	.systemDialog /deep/ .el-dialog__body{
		height: calc(100% - 120px);
	}
	.systemDialog /deep/ .el-tabs__content{
		height: calc(100% - 55px);
	}
	.systemDialog /deep/ .el-tab-pane{
		height: 100%;
	}
</style>
