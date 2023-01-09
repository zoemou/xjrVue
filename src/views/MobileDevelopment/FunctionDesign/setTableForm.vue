<template>
<div style="height:600px">
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="19" class="groupTit"><i class="el-icon-s-tools"></i>子表单列设置</el-col>
                <el-col :span="5"><i class="el-icon-s-tools"></i>列属性</el-col>
            </el-row>
        </el-header>
        <el-row>
            <el-col :span="19">
                <div class="mainbox">
                    <avue-crud class="queryTable" :data="querySelection" :option="queryoption" stripe @sortable-change="sortableChange" @row-click="handleRowClick" :style="{height:curItem.type.value == 'box'?'50%':'100%'}">
                        <template slot="add" slot-scope="scope">
                            <i class="el-icon-remove" style="color: #F56C6C;font-size: 20px;display: block;" @click="deleteData(querySelection,scope.row.id)"></i>
                        </template>
                        <template slot="type" slot-scope="scope">
                            <div>{{scope.row.type.label}}</div>
                        </template>                       
                    </avue-crud>
                    <avue-crud ref="bindTable" :data="curItem.boxTableData" :option="boxoption" stripe 
					@selection-change="selectionChange" @current-row-change="handleCurrentRowChange" :table-loading="DicLoading" v-show="curItem.type.value == 'box'" style="height:50%">
                        <template slot="name" slot-scope="scope">
                          <el-input v-model="scope.row.name" placeholder="请输入" type="text"></el-input>
                        </template>
                        <template slot="field" slot-scope="scope">
                          <el-select v-model="scope.row.field" placeholder="请选择">
                            <el-option
                                v-for="item in FieldOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                          </el-select>
                        </template> 
                        <template slot="show_align" slot-scope="scope">
                          <el-select v-model="scope.row.show_align" placeholder="请选择">
                            <el-option label="左对齐" value="left"></el-option>
                            <el-option label="居中" value="center"></el-option>
                            <el-option label="右对齐" value="right"></el-option>
                          </el-select>
                        </template> 
                        <template slot="width" slot-scope="scope">
                          <el-input v-model="scope.row.width" placeholder="例如：100" type="number"></el-input>
                        </template>                       
                    </avue-crud>
                </div>
            </el-col>
            <el-col :span="5" class="bindBox">
                <el-form v-if="querySelection.length>0">
                    <el-form-item label="显示名称">
                        <el-input v-model="curItem.label" placeholder="请输入显示名称"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="上级列头">
                        <el-select v-model="curItem.parentid" placeholder="请选择" @focus="parentFocusEvent" @change="changeParentId">
                            <el-option v-for="(item,idx) in parentOptions" :key="idx" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="绑定字段">
                        <el-select v-model="curItem.prop" placeholder="请选择字段" @focus="FieldFocus">
                            <el-option v-for="(item,idx) in FieldOptions" :key="idx" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签对齐方式">
                        <el-select v-model="curItem.labelAlign" placeholder="请选择">
                            <el-option label="左对齐" value="left"></el-option>
                            <el-option label="居中" value="center"></el-option>
                            <el-option label="右对齐" value="right"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="内容对齐方式" v-if="curItem.type.value== 'input'||curItem.type.value == 'textarea'||curItem.type.value == 'date'||curItem.type.value == 'time'||curItem.type.value == 'daterange'">
					    <el-select v-model="curItem.conAlign" placeholder="请选择">
					        <el-option label="左对齐" value="left"></el-option>
					        <el-option label="居中" value="center"></el-option>
					        <el-option label="右对齐" value="right"></el-option>
					    </el-select>
					</el-form-item>
                    <el-form-item label="列类型">
                        <el-select v-model="curItem.type" placeholder="请选择" @change="colTypeChange">
                            <el-option label="文本框" :value="{label:'文本框',value:'input'}"></el-option>
                            <el-option label="文本区" :value="{label:'文本区',value:'textarea'}"></el-option>
                            <el-option label='单选框' :value="{label:'单选框',value:'radio'}"></el-option>
                            <el-option label='多选框' :value="{label:'多选框',value:'checkbox'}"></el-option>
                            <el-option label="下拉框" :value="{label:'下拉框',value:'select'}"></el-option>
                            <el-option label="日期框" :value="{label:'日期框',value:'date'}"></el-option>
                            <el-option label="时间框" :value="{label:'时间框',value:'time'}"></el-option>
                            <el-option label="日期区间框" :value="{label:'日期区间框',value:'daterange'}"></el-option>
                            <el-option label="编辑器" :value="{label:'编辑器',value:'edit'}"></el-option>
                            <el-option label="附件框" :value="{label:'附件框',value:'file'}"></el-option>
                            <el-option label="图片框" :value="{label:'图片框',value:'image'}"></el-option>
                            <!-- <el-option label="弹层框" :value="{label:'弹层框',value:'box'}"></el-option>
                            <el-option label="按扭(直接显示)" :value="{label:'按扭',value:'button'}"></el-option> -->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据来源" v-if="curItem.type.value == 'select'||curItem.type.value == 'radio'||curItem.type.value == 'checkbox'">
                        <el-select v-model="curItem.dataSource" placeholder="请选择数据来源" @change="selectDataSource">
                            <el-option label="数据源" value="0"></el-option>
                            <el-option label="数据字典" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据选项" v-if="curItem.type.value == 'select'||curItem.type.value == 'radio'||curItem.type.value == 'checkbox'">
                        <avue-input-tree default-expand-all @change="changeDataItem" v-model="curItem.dataItem"
                                                placeholder="请选择" type="tree" :dic="dataItemOption"  v-if="curItem.dataSource==1" @focus="clickDataItem"></avue-input-tree>
                        <el-select v-model="curItem.dataItem" placeholder="请选择数据选项" @focus="clickDataItem" @change="changeDataSource" v-else>
                            <el-option
                                v-for="item in dataSourceOption"
                                :key="item.F_Id"
                                :label="item.F_Name"
                                :value="item.F_Id">
                            </el-option>
                        </el-select>
                    
                    </el-form-item>
                    <el-form-item label="显示字段" v-if="(curItem.type.value == 'select'||curItem.type.value == 'radio'||curItem.type.value == 'checkbox') && curItem.dataSource==0">
                        <el-select v-model="curItem.showField" placeholder="请选择显示字段" @change="changeDataSourceSaveField">
                            <el-option
                                v-for="item in curItem.dataSourceFieldOption"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="保存字段" v-if="(curItem.type.value == 'select'||curItem.type.value == 'radio'||curItem.type.value == 'checkbox') && curItem.dataSource==0">
                        <el-select v-model="curItem.saveField" placeholder="请选择保存字段" @change="changeDataSourceSaveField">
                            <el-option
                                v-for="item in curItem.dataSourceFieldOption"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="默认值" v-if="curItem.type.value == 'select'||curItem.type.value == 'radio'">
                        <el-select v-model="curItem.dbdefault" placeholder="请选择默认值" @focus="clickDBDefault">
                            <el-option
                                v-for="item in curItem.newOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="默认值" v-if="curItem.type.value == 'checkbox'">
					  <avue-select multiple v-model="curItem.dbdefault" placeholder="请选择默认值" :dic="curItem.newOption" @focus="clickDBDefault"></avue-select> 
					</el-form-item>  
					<el-form-item label="默认值" v-else-if="curItem.type.value == 'input'||curItem.type.value == 'textarea'||curItem.type.value == 'edit'">
					    <el-input v-model="curItem.dbdefault" placeholder="请输入默认值"></el-input>
					</el-form-item>
                    <el-form-item label="字段验证">
                      <el-select v-model="curItem.verify" placeholder="请选择">
                        <el-option value="" label="不验证" ></el-option>
                        <el-option value="NotNull" label="不能为空！" ></el-option>
                        <el-option value="Num" label="必须为数字！" ></el-option>
                        <el-option value="NumOrNull" label="数字或空！" ></el-option>
                        <el-option value="Email" label="必须为E-mail格式！" ></el-option>
                        <el-option value="EmailOrNull" label="E-mail格式或空！" ></el-option>
                        <el-option value="EnglishStr" label="必须为字符串！" ></el-option>
                        <el-option value="EnglishStrOrNull" label="字符串或空！" ></el-option>
                        <el-option value="Phone" label="必须电话格式！" ></el-option>
                        <el-option value="PhoneOrNull" label="电话格式或者空！" ></el-option>
                        <el-option value="Fax" label="必须为传真格式！" ></el-option>
                        <el-option value="Mobile" label="必须为手机格式！" ></el-option>
                        <el-option value="MobileOrNull" label="手机格式或者空！" ></el-option>
                        <el-option value="MobileOrPhone" label="电话格式或手机格式！" ></el-option>
                        <el-option value="MobileOrPhoneOrNull" label="电话格式或手机格式或空！" ></el-option>
                        <el-option value="Uri" label="必须为网址格式！" ></el-option>
                        <el-option value="UriOrNull" label="网址格式或空！" ></el-option>
                        <el-option value="Date" label="必须为日期格式！" ></el-option>
                        <el-option value="DateOrNull" label="日期格式或空！" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="日期格式" v-if="curItem.type.value == 'date'||curItem.type.value=='daterange'">
                        <el-select v-model="curItem.dateformat" placeholder="请选择格式">
                            <el-option label="仅日期" value="0"></el-option>
                            <el-option label="日期和时间" value="1"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="默认值" v-if="curItem.type.value == 'date'">
					    <el-date-picker v-model="curItem.dbdefault" key="date-picker"
					    :type="curItem.dateformat==1?'datetime':'date'" 
					    :placeholder="curItem.dateformat==1?'选择日期时间':'选择日期'"
					    :format="curItem.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
					    :value-format="curItem.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
					    @focus="focusDateTime"
					    @change="changeDateTime"
					    ></el-date-picker> 
					</el-form-item>
					<el-form-item label="默认值" v-if="curItem.type.value=='daterange'">
					  <el-date-picker key="daterange-picker" v-model="curItem.dbdefault" :type="curItem.dateformat==1?'datetimerange':'daterange'"  
					  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
					  :clearable="false" :value-format="curItem.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'" 
					  :format="curItem.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
					  style="width: 100%;"></el-date-picker> 
					</el-form-item>
					<el-form-item label="默认值" v-if="curItem.type.value=='time'">
					  <el-time-select v-model="curItem.dbdefault" placeholder="选择时间" key="time-picker"></el-time-select>
					</el-form-item>
                    <el-form-item label="绑定事件" v-if="curItem.type.value == 'button'">
                        <el-input v-model="curItem.funName" placeholder="按钮事件的函数方法名"></el-input>
                    </el-form-item>
                    <el-form-item label="按扭图标" v-if="curItem.type.value == 'button'">
                      <el-input placeholder="按钮图标样式" size="small" v-model="curItem.btnIcon">
                        <i slot="suffix" class="el-icon-more" @click="selectMoreIcon"></i>
                      </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row> 
    </el-container>
     <el-dialog v-dialogDrag :close-on-click-modal="false" title="选择图标" :append-to-body="true" :visible.sync="IconVisible" width="80%" style="padding: 10px 20px;">
      <FontHtml v-on:childByValue="childByValue"></FontHtml>
    </el-dialog>
</div>
</template>
<script>
import { getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import store from '@/store/index';
import {mapGetters} from "vuex";
import FontHtml from '../../FontAwesome.vue';
import {
  getDataSource,
  getDataSourceField,
  getDataSourceFieldData,
  getDataItem,
  getDataItemDetail
} from '@/api/databasemanage/datasource';
import { FormatTree,deepClone } from '@/util/util';
export default {
  components: { FontHtml },
  computed: {
    ...mapGetters(['MDAllStepData','MFActiveData'])
  },
  data () {
    return {
      curItem:{
        type: {
            label:'无',
            value:''
        },
        children:[]
      },
      DicLoading:false,
      parentOptions:[],
      FieldOptions:[],
      dataItemOption:[],
      dataSourceOption:[],
      IconVisible: false,
      querySelection: [],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        menu: false,
        page: false,
        sortable: true,
        // dragHandler: true,
        header: false,
       //index: true,
        defaultExpandAll:true,
       // expand:true,
        rowKey:'id',
        column: [          
          {
            label: '显示名称',
            prop: 'label',
            //slot: true
          }, {
            label: '绑定字段',
            prop: 'prop',
           // slot: true
          }, {
            label: '控件类型',
            prop: 'type',
            slot: true
          }, {
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
          }
        ]
      },
      boxoption:{
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: 'auto',//表格高度差（主要用于减去其他部分让表格高度自适应）
        height: '100%',//表格高度
        maxHeight: 'auto',
        border: true,
        align: 'center',
        menu: false,
        page: false,
        sortable: true,
        dragHandler: true,
        header: false,
        selection: true,
        tip:false,
        column: [          
          {
            label: '字段名',
            prop: 'name',
            slot: true
          }, {
            label: '字段ID',
            prop: 'id'
          }, {
            label: '绑定字段',
            prop: 'field',
            slot: true
          }, {
            label: '对齐',
            prop: 'show_align',
            slot: true
          }, {
            label: '宽度',
            prop: 'width',
            slot: true
          }
        ]
      },
      curIndex:0,
      //count:0,
      parentFocus:true
    };
  },
  watch:{
      'curItem.label':{
          handler:function(){    
            this.findChild(this.querySelection,'label')
            
          }         
      },
      'curItem.prop':{
          handler:function(){

            this.findChild(this.querySelection,'prop')
          }         
      },
      'curItem.type':{
          handler:function(){            
            this.findChild(this.querySelection,'type')
          }         
      },
      'curItem.parentid':{
          handler:function(newID,oldID){          

              if(this.parentFocus){
                if(newID>=0){
                  this.addObjForArr(this.querySelection,newID)                  
                }else{
                  this.querySelection.push(this.curItem)
                }
                if(oldID>=0){
                  this.delObjForArr(this.querySelection,oldID)
                }else{
                  let idx=this.querySelection.findIndex(el=>el.id==this.curItem.id)
                  this.querySelection.splice(idx,1)                                
                }               
              }

          }         
      }
  },
  methods: {
	  handleCurrentRowChange(row){
	    this.$refs.bindTable.toggleSelection([row]);
	  },
      addObjForArr(arr,newID){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==newID){
            arr[i].children.push(this.curItem)
          }else if(arr[i].children.length>0){
            this.addObjForArr(arr[i].children,newID);
          }
        }
      },
      delObjForArr(arr,oldID){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==oldID){
            //arr[i].children=[]
            let idx= arr[i].children.findIndex(el=>el.id==this.curItem.id)
             arr[i].children.splice(idx,1)
          }else if(arr[i].children.length>0){
            this.delObjForArr(arr[i].children,oldID);
          }
        }
      },
      findChild(arr,name){
        arr.forEach(it=>{
          if(it.id==this.curIndex){
            it[name]=this.curItem[name];
          }else if(it.children.length>0){
            this.findChild(it.children,name)
          }
        }) 
      },
     
      setParent(arr){
        arr.forEach(it=>{
          if(it.label&&it.type.value==""&&(it.label!=this.curItem.label)){
            let obj=this.parentOptions.find(el=>el.label==it.label)
            if(!obj) this.parentOptions.push(it)
            if(it.children.length>0){
              this.setParent(it.children)
            }
          }
        })       
      },
      selectMoreIcon () {
        this.IconVisible = true;
      },
      parentFocusEvent(){    
        this.parentOptions=[];   
        if(this.curItem.label){          
          this.setParent(this.querySelection)
          this.parentOptions.unshift({label:'请选择',value:'-1'})
        }else{
          this.$message({
            message: '请先输入显示名称',
            type: 'error'
          });
          return;
        }
      },
    deleteData (arr,id) {
      arr.forEach((it,idx)=>{
        if(it.id==id){
          arr.splice(idx, 1);
        }else if(it.children.length>0){
          this.deleteData(it.children,id)
        }
      })
    },
    sortableChange (oldindex, newindex, row, list) {
      this.querySelection = [];
      this.$nextTick(() => {
        this.querySelection = list;
      });
    },
    addRow () { 
	  this.curIndex=new Date().getTime();   
      this.curItem = {
        id: this.curIndex,
        label: '',
        prop: '',
        type: {
            label:'文本框',
            value:'input'
        },
		labelAlign:'left',
		conAlign:'left',
        slot:false,
        dataSource:'0',
        dataItem:'',
        showField:'',
        saveField:'',
        dbdefault:'',
        newOption:[],
        dataSourceFieldOption:[],
        boxTableData:[],
        children:[]
      };
      this.querySelection.push(this.curItem);      
      //this.countChild(this.querySelection)
      this.parentFocus=false;
    },
    handleRowClick (row, event, column) {
        this.curIndex=row.id;
        this.curItem=row;
        this.parentFocus=false;
        if(row.type.value=='box'){

          if(row.boxData&&row.boxData.length>0){
            this.$nextTick(function () {
              this.$refs.bindTable.toggleSelection(row.boxData);
            });
          }
        }
    },
	colTypeChange(e){
		if(e.value=='daterange'||e.value=='time'||e.value=='date'){
			this.curItem.dbdefault=""
		}
	},
	focusDateTime(){
	  if(this.curItem.dbdefault) this.curItem.dbdefault=new Date(this.curItem.dbdefault)
	},

    changeParentId(){
      this.parentFocus=true;
    },
    setBoxTableData(){
      this.curItem.boxTableData=[{id:'F_ItemName',width:100, show_align:'left'},{id: 'F_ItemValue',width:100, show_align:'left'}];
    },
    selectDataSource(e){
      if(e==1&&this.curItem.type.value=='box'){
        this.setBoxTableData()
      }
    },
    changeDataItem (e) {
      if(e){
        getDataItemDetail(e).then(res => {
          const data = res.data.data;
          this.curItem.newOption = [];
          this.curItem.dbdefault='';
          data.forEach(item => {
            this.curItem.newOption.push({
              label: item.F_ItemName,
              value: item.F_ItemValue
            });
          });
        });
      }
    },
    clickDataItem(){
      //点击数据选项的时候触发数据源的选择事件
      let e=this.curItem.dataSource;
      if(e==0&&(this.curItem.dataSourceFieldOption&&this.curItem.dataSourceFieldOption.length<=0||this.curItem.boxTableData&&this.curItem.boxTableData.length<=0)){
        this.changeDataSource()
      }     
    },
    changeDataSourceSaveField () {
      if (!this.curItem.saveField||!this.curItem.showField) return;
      getDataSourceFieldData(this.curItem.dataItem, this.curItem.saveField + ',' + this.curItem.showField).then(res => {
        const data = res.data.data;
        this.curItem.newOption = [];
        if(data&&data.length>0){
          data.forEach(item => {
            this.curItem.newOption.push({
              label: item[this.curItem.showField],
              value: item[this.curItem.saveField]
            });
          });
        }
      });
    },
    clickDBDefault(){
      if(this.curItem.dataSource==0){
        if (!this.curItem.saveField){
          this.$message({
            message: '请先选择保存字段',
            type: 'error'
          });
        }
        if(!this.curItem.showField){
          this.$message({
            message: '请先选择显示字段',
            type: 'error'
          });
        } 
      }
    },
    getDataSource(){
      getDataSource().then(res => {
        const data = res.data.data;
        if (data) {
          this.dataSourceOption = [...data];
        }
      });
    },
    getDataItem(){
      getDataItem().then(res => {
        const data = res.data.data;
        const treeData = FormatTree(data, 'F_ItemCode', 'F_ItemName', 'children');
        this.dataItemOption = [...treeData];
      });
    },
    changeDataSource () {
      if(this.curItem.type.value=='box'){
        this.DicLoading=true;
      }
      if(this.curItem.dataItem){
        getDataSourceField(this.curItem.dataItem).then(res => {
          const data = res.data.data;
          if(data&&data.length>0){
            if(this.curItem.type.value=='select'){
              this.curItem.dataSourceFieldOption = [...data];           
            }else{
              this.curItem.boxTableData=[]
              data.forEach(it=>{
                let obj={
                  id:it,
                  width:100,
                  show_align:'left'
                }
                this.curItem.boxTableData.push(obj)
              })
              this.DicLoading=false;
            }  
          }  
        });
      }
    },
    selectionChange(list){
      this.curItem.boxData=list;
    },
    selectType(e){
      if(e.value!=""){
        this.curItem.slot=true
      }else{
        this.curItem.slot=false;        
      }
      
    },
    //提交数据验证
    validateData () {
      let flag=true;
      if(this.querySelection.length>0){        
        this.querySelection.forEach(it=>{
          if(it.prop==""){           
            flag= false
          }
        })
      }
	  if(flag) this.MFActiveData.option.column= this.querySelection;
      return flag
    },
    childByValue: function (childValue) {
      this.curItem.btnIcon = childValue;
      this.IconVisible = false;
    },
    handleClose (done) {
      done();
    }
  },
  created () {
      getDatabaseTableColumns(this.MDAllStepData.stepTwo.F_DbId, this.MFActiveData.table).then(res => {
        const data = res.data.data;
        this.FieldOptions = [];
        data.forEach(item => {
        this.FieldOptions.push({
            label: item.Name,
            value: item.Name
        });
        });
    });
     //默认请求出数据源数据
    this.getDataSource()
    //默认请求出数据字典数据
    this.getDataItem()
	
    let arr=this.MFActiveData.option.column
    if(arr.length<=0){
		this.boxTableData=[]
		this.querySelection=[]
    }else{
      this.querySelection=deepClone(arr);
      this.boxTableData=deepClone(this.MFActiveData.tableset.list);
      this.curItem=this.querySelection[0];
      this.curIndex=this.querySelection[0].id
    }
   
  }
};
</script>
<style scoped>
  .el-header {
    font-size: 15px;font-weight:bold;
    text-align: center;
    line-height: 60px;
    border-bottom:1px solid #eee ;
    padding: 0;
  }
  .el-container {
     height: 100%;
  }
  .mainbox{
       height: 100%;
  }
  .el-row{
      height: calc(100% - 60px);
  }
  .el-select{
      width:100%
  }
  .el-col{
    height: 100%;
  }
  .bindBox{     
    overflow: auto;
    padding: 0 15px 10px;
  }
  
  .queryTable{
    margin-bottom: 10px;
  }
</style>