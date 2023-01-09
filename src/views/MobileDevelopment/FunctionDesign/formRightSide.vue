<template>
<div>
  <el-form style="padding: 0px 0px 0px 15px;" :label-position="labelPosition">
    <el-form-item :label="$t('mobileDev.formRightSide.labelBindTable')" v-if="MFActiveData.table !== undefined">
      <el-select v-model="MFActiveData.table" :placeholder="$t('mobileDev.formRightSide.placeholderSelectTable')" v-if="MFActiveData.type=='table'">
        <el-option v-for="(item,idx) in MDAllStepData.stepTwo.list" :label="item.name" :value="item.name" :key="idx" v-show="item.parentName!=1"></el-option>
      </el-select>
      <el-select v-model="MFActiveData.table" :placeholder="$t('mobileDev.formRightSide.placeholderSelectTable')" v-else>
        <el-option v-for="(item,idx) in MDAllStepData.stepTwo.list" :label="item.name" :value="item.name" :key="idx" v-show="item.parentName==1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelBindField')" v-if="MFActiveData.field !== undefined">
      <el-select v-model="MFActiveData.field" :placeholder="$t('mobileDev.formRightSide.placeholderSelectField')" @focus="FieldFocus">
        <el-option v-for="(item,idx) in FieldOptions" :key="idx" :label="item.Name+' ('+item.Type+')'" :value="item.Name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelEleTitle')" v-if="MFActiveData.name !== undefined">
      <el-input v-model="MFActiveData.name" :placeholder="$t('mobileDev.formRightSide.placeholderEleTitle')"></el-input>
    </el-form-item>
	<el-form-item :label="$t('mobileDev.formRightSide.labelMaxImg')" v-if="MFActiveData.imgLength !== undefined">
	  <el-input v-model="MFActiveData.imgLength" :placeholder="$t('mobileDev.formRightSide.placeholderMaxImg')" type="number"></el-input>
	</el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelTipContent')" v-if="MFActiveData.placeholder !== undefined">
      <el-input v-model="MFActiveData.placeholder" :placeholder="$t('mobileDev.formRightSide.placeholderTipContent')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined && (MFActiveData.type=='input'||MFActiveData.type=='textarea'||MFActiveData.type=='edit')">
      <el-input v-model="MFActiveData.dbdefault" :placeholder="$t('mobileDev.formRightSide.placeholderDefault')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelVisualState')" v-if="MFActiveData.isHide !== undefined">
      <el-select v-model="MFActiveData.isHide" :placeholder="$t('mobileDev.formRightSide.placeholderVisualState')">
        <el-option :label="$t('mobileDev.formRightSide.optionShow')" value="0"></el-option>
        <el-option :label="$t('mobileDev.formRightSide.optionHide')" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelAreaHeight')" v-if="MFActiveData.height !== undefined">
      <el-input v-model="MFActiveData.height" :placeholder="$t('mobileDev.formRightSide.placeholderModuleHeight')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelFieldVal')" v-if="MFActiveData.verify !== undefined">
      <el-select v-model="MFActiveData.verify" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option value="" :label="$t('mobileDev.formRightSide.optionNoVal')" ></el-option>
        <el-option value="NotNull" :label="$t('mobileDev.formRightSide.optionNotNull')" ></el-option>
        <el-option value="Num" :label="$t('mobileDev.formRightSide.optionMustNum')" ></el-option>
        <el-option value="NumOrNull" :label="$t('mobileDev.formRightSide.optionNumOrNull')" ></el-option>
        <el-option value="Email" :label="$t('mobileDev.formRightSide.optionEmail')" ></el-option>
        <el-option value="EmailOrNull" :label="$t('mobileDev.formRightSide.optionEmailOrNull')" ></el-option>
        <el-option value="EnglishStr" :label="$t('mobileDev.formRightSide.optionString')" ></el-option>
        <el-option value="EnglishStrOrNull" :label="$t('mobileDev.formRightSide.optionStringOrNull')" ></el-option>
        <el-option value="Phone" :label="$t('mobileDev.formRightSide.optionPhone')" ></el-option>
        <el-option value="PhoneOrNull" :label="$t('mobileDev.formRightSide.optionPhoneOrNull')" ></el-option>
        <el-option value="Fax" :label="$t('mobileDev.formRightSide.optionFax')" ></el-option>
        <el-option value="Mobile" :label="$t('mobileDev.formRightSide.optionMobile')" ></el-option>
        <el-option value="MobileOrNull" :label="$t('mobileDev.formRightSide.optionMobileOrNull')" ></el-option>
        <el-option value="MobileOrPhone" :label="$t('mobileDev.formRightSide.optionMobileOrPhone')" ></el-option>
        <el-option value="MobileOrPhoneOrNull" :label="$t('mobileDev.formRightSide.optionMobileOrPhoneOrNull')" ></el-option>
        <el-option value="Uri" :label="$t('mobileDev.formRightSide.optionUri')" ></el-option>
        <el-option value="UriOrNull" :label="$t('mobileDev.formRightSide.optionUriOrNull')" ></el-option>
        <el-option value="Date" :label="$t('mobileDev.formRightSide.optionDate')" ></el-option>
        <el-option value="DateOrNull" :label="$t('mobileDev.formRightSide.optionDateOrNull')" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDataSource')" v-if="MFActiveData.dataSource !== undefined">
      <el-select v-model="MFActiveData.dataSource" :placeholder="$t('mobileDev.formRightSide.placeholderDataSource')" @change="selectDataSource">
        <el-option :label="$t('mobileDev.formRightSide.optionDataSource')" value="0"></el-option>
        <el-option :label="$t('mobileDev.formRightSide.optionDataDic')" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDataOptions')" v-if="MFActiveData.dataItem !== undefined">
      <avue-input-tree default-expand-all @change="changeDataItem" v-model="MFActiveData.dataItem"
                                 :placeholder="$t('mobileDev.formRightSide.placeholderSelect')" type="tree" :dic="dataItemOption"  v-if="MFActiveData.dataSource==1" @focus="clickDataItem"></avue-input-tree>
      <el-select v-model="MFActiveData.dataItem" :placeholder="$t('mobileDev.formRightSide.placeholderDataOption')" @focus="clickDataItem" @change="changeDataSource" v-else>
        <el-option
            v-for="item in dataSourceOption"
            :key="item.F_Id"
            :label="item.F_Name"
            :value="item.F_Id">
        </el-option>
      </el-select>
      
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelShowField')" v-if="MFActiveData.showField !== undefined && MFActiveData.dataSource==0">
      <el-select v-model="MFActiveData.showField" :placeholder="$t('mobileDev.formRightSide.placeholderShowField')" @change="changeDataSourceSaveField" @focus="clickShowORSaveField">
        <el-option
            v-for="item in MFActiveData.dataSourceFieldOption"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelSaveField')" v-if="MFActiveData.saveField !== undefined && MFActiveData.dataSource==0">
      <el-select v-model="MFActiveData.saveField" :placeholder="$t('mobileDev.formRightSide.placeholderSaveField')" @change="changeDataSourceSaveField" @focus="clickShowORSaveField">
        <el-option
            v-for="item in MFActiveData.dataSourceFieldOption"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined && (MFActiveData.type=='radio'||MFActiveData.type=='select')">
      <el-select v-model="MFActiveData.dbdefault" value-key="value" :placeholder="$t('mobileDev.formRightSide.placeholderSelectDefault')" clearable @focus="clickDBDefault">
        <el-option
            v-for="item in MFActiveData.newOption"
            :key="item.value"
            :label="item.label"
            :value="item">
        </el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined && MFActiveData.type=='checkbox'">
      <avue-select multiple v-model="MFActiveData.dbdefault" :placeholder="$t('mobileDev.formRightSide.placeholderSelectDefault')" :dic="MFActiveData.newOption" @focus="clickDBDefault"></avue-select> 
    </el-form-item>   
    <el-form-item :label="$t('mobileDev.formRightSide.labelDateFormat')" v-if="MFActiveData.dateformat !== undefined">
      <el-select v-model="MFActiveData.dateformat" :placeholder="$t('mobileDev.formRightSide.placeholderSelectFormat')" @change="changeDateFormat">
        <el-option :label="$t('mobileDev.formRightSide.optionOnlyDate')" value="0"></el-option>
        <el-option :label="$t('mobileDev.formRightSide.optionDateOrTime')" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelInforType')" v-if="MFActiveData.info !== undefined">
      <el-select v-model="MFActiveData.info" :placeholder="$t('mobileDev.formRightSide.placeholderSelectType')">
        <el-option :value="$t('mobileDev.formRightSide.optionCompany')" :label="$t('mobileDev.formRightSide.optionCompany')"></el-option>
        <el-option :value="$t('mobileDev.formRightSide.optionDepartment')" :label="$t('mobileDev.formRightSide.optionDepartment')"></el-option>
        <el-option :value="$t('mobileDev.formRightSide.optionUser')" :label="$t('mobileDev.formRightSide.optionUser')"></el-option>
        <el-option :value="$t('mobileDev.formRightSide.optionTime')" :label="$t('mobileDev.formRightSide.optionTime')"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined&&MFActiveData.type=='date'">
      <el-date-picker v-model="MFActiveData.dbdefault" key="date-picker"
      :type="MFActiveData.dateformat==1?'datetime':'date'" 
      :placeholder="MFActiveData.dateformat==1?$t('taskScheduling.taskDesign.addModal.radioStartTimeTwoplaceholder'):$t('workFlow.delegateForm.selectDate')"
      :format="MFActiveData.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
      :value-format="MFActiveData.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
      @focus="focusDateTime"
      @change="changeDateTime"
      ></el-date-picker> 
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined&&MFActiveData.type=='daterange'">
      <el-date-picker key="daterange-picker" v-model="MFActiveData.dbdefault" :type="MFActiveData.dateformat==1?'datetimerange':'daterange'"  :range-separator="$t('searchModule.rangeSeparator')" :start-placeholder="$t('searchModule.startDatePlaceholder')" :end-placeholder="$t('searchModule.endDatePlaceholder')" 
      :clearable="false" :value-format="MFActiveData.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'" :format="MFActiveData.dateformat==1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"></el-date-picker> 
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelDefault')" v-if="MFActiveData.dbdefault !== undefined&&MFActiveData.type=='time'">
      <el-time-select v-model="MFActiveData.dbdefault" :placeholder="$t('mobileDev.formRightSide.placeholderSelectTime')" key="time-picker"></el-time-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.formRightSide.labelEditSubform')" v-if="MFActiveData.tableset !== undefined">
      <el-button type="primary" v-model="MFActiveData.tableset" style="width:100%" @click="setTableColumn">{{$t('mobileDev.formRightSide.SetSubformBtn')}}</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.formRightSide.labelEditSubform')" :append-to-body="true" :visible.sync="dialogBoxShow" width="80%">
      <setTableForm ref="tableForm" v-if="dialogBoxShow"></setTableForm>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="saveCodeScheme()">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
  </el-dialog>
</div>
</template>
<script>
import store from '@/store/index';
import {mapGetters} from "vuex";
import { getDatabaseTableColumns } from '@/api/databasemanage/databasetable.js';
import {
  getDataSource,
  getDataSourceField,
  getDataSourceFieldData,
  getDataItem,
  getDataItemDetail
} from '@/api/databasemanage/datasource';
import { FormatTree } from '@/util/util';
import setTableForm from './setTableForm';
export default {
  components:{
    setTableForm
  },
  data () {
    return {
      FieldOptions:[],
      dataSourceOption:[],
      dataItemOption:[],
      dialogBoxShow:false,
      labelPosition:'top'
    }
  },
  computed: {
    ...mapGetters(['MDAllStepData','MFActiveData'])
  },

  methods:{
    focusDateTime(){
      if(this.MFActiveData.dbdefault) this.MFActiveData.dbdefault=new Date(this.MFActiveData.dbdefault)
    },
    changeDateTime(){
      this.MFActiveData.showValue=this.MFActiveData.dbdefault;
      store.commit('setActiveData', this.MFActiveData);
    },
    changeDateFormat(val){

        if(this.MFActiveData.type=='date'){
          if(val==0){
            this.MFActiveData.showValue=this.mydayFormat(new Date(this.MFActiveData.dbdefault))
          }else{
            this.MFActiveData.showValue=this.mydateFormat(new Date(this.MFActiveData.dbdefault))
          }
          this.MFActiveData.dbdefault=this.MFActiveData.showValue
          store.commit('setActiveData', this.MFActiveData);
        }
        if(this.MFActiveData.type=='daterange'){

          if(!this.MFActiveData.dbdefault&&this.MFActiveData.dateformat==1) this.MFActiveData.dbdefault=[]
          this.MFActiveData.dbdefault=this.MFActiveData.dbdefault.map(o=>{
            return new Date(o)
          })
        }
      
    },
    selectTable(e){
      //this.MFActiveData.table=e.name;
      //if(this.MFActiveData.field!=undefined) this.RelationFieldFocus(e.name)
    },
    FieldFocus(e){
      if(this.MFActiveData.table==''){
        this.FieldOptions = [];
        this.$message({
          message:this.$t('mobileDev.formRightSide.hintSelectBindTab'),
          type: 'error'
        });
      }else{
        this.RelationFieldFocus(this.MFActiveData.table)
      }
    },
    // selectField(e){
    //   this.MFActiveData.field=e;
    // },
    RelationFieldFocus (val) {
      if (val) {
        getDatabaseTableColumns(this.MDAllStepData.stepTwo.F_DbId, val).then(res => {
          const data = res.data.data;
          this.FieldOptions = data;
          // data.forEach(item => {
          //   this.FieldOptions.push({
          //     label: item.Name,
          //     value: item.Name
          //   });
          // });
          if(data.length>0) this.MFActiveData.field=data[0].Name;
        });
      }
    },
    selectDataSource(e){
      //this.MFActiveData.dataSource=e;
      this.MFActiveData.dataItem="";
      this.MFActiveData.dbdefault="";
      this.MFActiveData.newOption=[];

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
    changeDataItem (e) {
      if(e){
        getDataItemDetail(e).then(res => {
          const data = res.data.data;
          this.MFActiveData.newOption = [];

          data.forEach(item => {
            this.MFActiveData.newOption.push({
              label: item.F_ItemName,
              value: item.F_ItemValue
            });
          });
        });
      }
    },
    clickDataItem(){
      //点击数据选项的时候触发数据源的选择事件
      let e=this.MFActiveData.dataSource;
      if((e==0&&this.dataSourceOption.length<=0)||(e==1&&this.dataItemOption.length<=0)){
        this.selectDataSource(e)
      }     
    },
    changeDataSource () {
      getDataSourceField(this.MFActiveData.dataItem).then(res => {
        const data = res.data.data;
        this.MFActiveData.dataSourceFieldOption = [...data];
      });
    },
    changeDataSourceSaveField () {
      if (!this.MFActiveData.saveField||!this.MFActiveData.showField) return;
      getDataSourceFieldData(this.MFActiveData.dataItem, this.MFActiveData.saveField + ',' + this.MFActiveData.showField).then(res => {
        const data = res.data.data;
        this.MFActiveData.newOption = [];
        if(data&&data.length>0){
          data.forEach(item => {
            this.MFActiveData.newOption.push({
              label: item[this.MFActiveData.showField],
              value: item[this.MFActiveData.saveField]
            });
          });
        }
      });
    },
    clickShowORSaveField(){
      //this.changeDataSource ()
    },
    clickDBDefault(){
      if(this.MFActiveData.dataSource==0){
        if (!this.MFActiveData.saveField){
          this.$message({
            message: this.$t('mobileDev.formRightSide.hintSaveField'),
            type: 'error'
          });
        }
        if(!this.MFActiveData.showField){
          this.$message({
            message: this.$t('mobileDev.formRightSide.hintShowField'),
            type: 'error'
          });
        } 
      }
    },
    setTableColumn(){
      if(!this.MFActiveData.table){
         this.$message({
            message:this.$t('mobileDev.formRightSide.hintBindTab'),
            type: 'error'
          });
          return;
      }
      this.dialogBoxShow=true;
    },
    saveCodeScheme(){
      let res=this.$refs.tableForm.validateData()
      if(res){
        this.dialogBoxShow=false;
      }else{
        this.$message({
          message: this.$t('mobileDev.formRightSide.hintBindField'),
          type: 'error'
        });
      }
    }
  },
  created(){
    //默认请求出数据源数据
    this.getDataSource()
    //默认请求出数据字典数据
    this.getDataItem()
  }
}
</script>
<style scoped>
  ::v-deep .el-date-editor.el-input{
  width: 100%;
}
.el-date-editor--datetimerange.el-input__inner,.el-date-editor--daterange.el-input__inner{
  width: 100%
}
.el-select{
  width: 100%;
}
</style>