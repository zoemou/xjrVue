<script>
import {
  getOptions
} from '@/util/dataApi';
// import { getAllCompanies } from "@/api/organization/company";
// import { getCompanyDepartments } from "@/api/organization/department";
export default {
  props: {
    fieldsIndex: {
      type: Number,
      required: true
    },
    formConf: {
      type: Object,
      required: true
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
    },
    isEdit: {
      type: Number
    },
	formEnCodeList:{}
  },
  data() {
    return {
      columnChildren: [],
      columnDefault: {},
      options: [],
      columnChildrenConf: [],
      // companiesDic: [],
      departmentsDic: [],
      confFields: [],
      loading: false,
      isView:false,
      reRenderSubform:true,
			avueFormData:{},
			selectTableDataVisible:false,
			dialogSlot: null
    };
  },
 async created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
   }
    let componentTitle = this.confFields[this.fieldsIndex].__config__.showLabel?this.confFields[this.fieldsIndex].__config__.componentTitle:"";
    await this.getChild();
    this.options = {
      labelWidth: 90,
      submitBtn: false,
      submitText: "提交子表单",
      emptyBtn: false,
      arrow: true,
      collapse: true,
      column: [
        {
          label: componentTitle,
          prop: "dynamic",
          type: "dynamic",
          span: 24,
          children: {
            align: "center",
            headerAlign: "center",
            rowAdd: done => {
              //非查看模式下
              if (this.isEdit != 2) {
                done(this.columnDefault);
              }
            },
            rowDel: (row, done) => {
              //非查看模式下
              if(this.isEdit!=2){
                this.reRenderSubform = false;
                setTimeout(() => {
                    this.reRenderSubform = true;
                }, 0);
                done();
              }
            },
            column: this.columnChildren
          }
        }
      ]
    };

    //新增时 处理表格预加载配置
    let curElement = this.confFields[this.fieldsIndex];
    if(this.confFields[this.fieldsIndex].__config__&&
      (this.confFields[this.fieldsIndex].__config__.defaultValue&&
      this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic&&
      this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic.length==0)||
      !this.confFields[this.fieldsIndex].__config__.defaultValue
      ){
        if(this.isEdit == 1){
          let hasMethod = true;
          if(curElement.__config__.dataType){
            if(curElement.__config__.dataType=='dataSource'){
                if(!curElement.__config__.dataSource){
                  hasMethod = false;
                }
            }else if(curElement.__config__.dataType=='dataSql'){
                // 已经取消了sql配置
                hasMethod = false;
            }else if(curElement.__config__.dataType=='dataItem'){
                if(!curElement.__config__.dataItem){
                  hasMethod = false;
                }
            }
          }else{
            hasMethod = false;
          }
          if(hasMethod){
						if(!curElement.__config__.isSelectData){ 
							this.loading = true;
							try {
								await this.preloadData(curElement);
							} catch (error) {
								
							}
						}
          }
        }
      }
  },

  beforeDestroyed(){
    this.confFields[this.fieldsIndex].__config__.defaultValue.timer = null;
  },
  render(h) {
    let self = this;
    const listeners = {
      change: (val,row) => {
        // if(!this.loading) self.getChild();
      },
    };
    const childrenListeners = {
      changeTableAssoData: (val) => {
        let {index,value,bindTableField,autoBindFields,data} = val;
        this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic[index][bindTableField] = value;
        if(autoBindFields&&autoBindFields.length>0){
          autoBindFields.forEach(ele=>{
            if(ele.field&&ele.bindField){
              this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic[index][ele.field] = data[ele.bindField];
            }
          });
        }
        self.getChild();
      },
      changeTableMutiplePopupData: (val) => {
        let {index,value,showValue,bindTableField} = val;
        this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic[index][bindTableField] = value;
      },
      changeTableTreeLoadData: (val) => {
        let {index,value,bindTableField} = val;
        this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic[index][bindTableField] = value;
      }
    };
		const selectListeners={
			click:async ()=>{
				let tempData = await getOptions(this.confFields[this.fieldsIndex].__config__,'origin');
				let dataType=this.confFields[this.fieldsIndex].__config__.dataType
				let colum=[]
				if(dataType=='dataSource'){
					colum=this.confFields[this.fieldsIndex].__config__.sourceTableHeader
				}else if(dataType=='dataItem'){
					colum=this.confFields[this.fieldsIndex].__config__.itemTableHeader
				}
				this.avueFormData={data:tempData||[],colum:colum};
				this.selectTableDataVisible=true;
				const listeners = {
				  onHandler: (data)=>{
						if(data){
							this.showPreloadData(data,'buttonSelect');
						}
						this.selectTableDataVisible=false;
						this.dialogSlot = null;
					}
				};
				this.dialogSlot = (
				  <avue-table-data-list avueFormData={this.avueFormData}  v-if={this.selectTableDataVisible}
				      {...{on: listeners }}></avue-table-data-list>
				);
			}
		}
      let scopedSlots = {};
    if (this.confFields[this.fieldsIndex].__config__.children && this.confFields[this.fieldsIndex].__config__.children.length > 0) {
      this.confFields[this.fieldsIndex].__config__.children.forEach((ele, index) => {
          if(ele&&ele.__config__&&ele.__config__.avueType){
            let bindTableField= ele.__config__.bindTableField;
            if(bindTableField&&ele.__config__.avueType){
              let conf = {...ele
            };
              let disabled  = false;
            //是否为查看
            let isView = false;
            if(this.isEdit==2){
              isView = true;
              disabled = true;
            }else{
              if(!ele.__config__.edit){
                disabled = true;
              }
            }
              if(ele.__config__.avueType=="asso-select"){
                scopedSlots[bindTableField] = scopeData => {
                    return (
                      <avue-asso-select {...{
                        props:{
                          value:scopeData.row[bindTableField],
                          index:scopeData.row.$index,
                          conf:conf,
                          isView,
                          disabled,
                          reRenderSubform:this.reRenderSubform,
                          dicData:this.columnChildren[index].dicData
                        }
                      }}  {...{ on: childrenListeners }}></avue-asso-select>
                    );
                  }
              } else if (ele.__config__.avueType == "mutiple-popup") {
                scopedSlots[bindTableField] = scopeData => {
                    return (
                      <avue-mutiple-popup {...{
                        props:{
                          value:scopeData.row[bindTableField],
                          index:scopeData.row.$index,
                          conf:conf,
                          isView,
                           disabled,
                          reRenderSubform:this.reRenderSubform,
                          dicData:this.columnChildren[index].dicData
                        }
                      }}  {...{ on: childrenListeners }}></avue-mutiple-popup>
                    );
                  }
              }else if(ele.__config__.avueType=="asso-popup"){
                scopedSlots[bindTableField] = scopeData => {
                    return (
                      <avue-asso-popup {...{
                        props:{
                          value:scopeData.row[bindTableField],
                          index:scopeData.row.$index,
                          conf:conf,
                          isView,
                           disabled,
                          reRenderSubform:this.reRenderSubform,
                          dicData:this.columnChildren[index].dicData
                        }
                      }}  {...{ on: childrenListeners }}></avue-asso-popup>
                    );
                  }
              } else if (ele.__config__.avueType == "load-tree") {
                scopedSlots[bindTableField] = scopeData => {
                  return (
                    <avue-load-tree {...{
                      props: {
                          value: scopeData.row[bindTableField],
                          index: scopeData.row.$index,
                          conf:conf,
                          isView,
                          disabled,
                          bindTable:ele.__config__.bindTable,
                        __type__: ele.__type__,
                        }
                      }}  {...{ on: childrenListeners }}></avue-load-tree>
                    );
                }
              }
               
            }
          }
        });
      }
    let className  = this.confFields[this.fieldsIndex].__config__.showLabel?'':"avueFormNoLable";
    className += this.confFields[this.fieldsIndex].__config__.showComponentBorder==false?' avueFormNoInputBorder ':'';
    className += this.confFields[this.fieldsIndex].__config__.showFormBorder==false?' avueFormNoBorder ':'';
    className += this.confFields[this.fieldsIndex].__config__.showFormIndex==false?' avueFormNoIndex ':'';
    className += this.confFields[this.fieldsIndex].__config__.doesTheTitleWrap?' avueFormTitleWrap':' avueFormTitleNoWrap ';
    className +=  ' subTableForm ';
    let span = this.confFields[this.fieldsIndex].__config__.span;
		let selectTableData=this.confFields[this.fieldsIndex].__config__.isSelectData;
		let buttonname=this.confFields[this.fieldsIndex].__config__.buttonName;
		let buttonCss="margin-left:"+this.options.labelWidth+"px";
		let buttonSlot=null;
		if(selectTableData){
		 	className +=  ' selectTableData ';
			buttonSlot=(<template slot="menuForm">
				<el-button type="primary" size="medium"
					style={buttonCss}
					{...{on: selectListeners }}
					 >{buttonname}</el-button>
			</template>)
		}
		
    return (
      <el-col span={span}>
      <avue-form
        v-loading={this.loading}
         class={className}
        element-loading-text="数据预加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
        option={this.options}
        v-model={this.confFields[this.fieldsIndex].__config__.defaultValue}
        {...{ on: listeners }}
        ref={this.confFields[this.fieldsIndex].__config__.bindTable}
        {...{ scopedSlots }}
      > 
			{buttonSlot}
      </avue-form>
			{this.dialogSlot}
			
      </el-col>
    );
  },
  methods: {
    getDynamicDefaultValue(){
      return this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic;
    },
	  async validate(fn) {
		  const promise = await new Promise((res,rej) =>{
			  this.$refs[this.confFields[this.fieldsIndex].__config__.bindTable].validate((valid,obj) => {
			  	res(valid)
			  })
		  })
		  return fn(promise);
	  },
    async preloadData(curElement){
      if(curElement.__config__.dataType){
        let dataType = curElement.__config__.dataType;
        try {
          if(dataType){
              let tempData = await getOptions(curElement.__config__);
               this.showPreloadData(tempData);
          }
        } catch (error) {
        }
      }
    },
    showPreloadData(resultData,type){
      let dynamic = [];
      //记录预加载字段信息
      let prestrainFieldConf = {};
      this.columnChildrenConf.forEach(item=>{
        prestrainFieldConf[item.__config__.bindTableField] = item.__config__.prestrainField;
      });
      //根据预加载字段信息 拼接子表单数据
      resultData.map((item,idx)=>{
        let _obj = {};
        for(let key in prestrainFieldConf){
          _obj[key] = item[prestrainFieldConf[key]];
        }
        //最终数据 的展示
        dynamic.push(_obj);
      });
			if(type=='buttonSelect'){
				this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic = this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic.concat(dynamic);
			}else{
				this.confFields[this.fieldsIndex].__config__.defaultValue.dynamic = dynamic;
			}
      
      this.loading = false;
    },
    async getChild() {
      let children = this.confFields[this.fieldsIndex].__config__.children;
      let columnChildren = [];
      //是否为查看
      let isView = false;
      if(this.isEdit==2){
        isView = true;
      }
      if (children && children.length > 0) {
        this.columnChildrenConf = children;
        for (const [index,element] of children.entries()) {
          let elementConfig = element.__config__;
          let rules = [];
          if (elementConfig.required) {
            rules = this.changeData(elementConfig)
          }
          let type = "input";
          let disabled = elementConfig.disabled;
          let value = elementConfig.defaultValue;
          let format = "";
          let valueFormat = "";
          let dicData = [];
          let isHide = false;
		  if(this.formEnCodeList){
			  if(this.formEnCodeList[elementConfig.bindTable]?.includes(elementConfig.bindTableField)){
				  isHide=false
			  }else{
				  isHide=true
			  }
		  }
          let otherParams = {};
          let placeholderStr = element.placeholder?element.placeholder:" ";
          if(elementConfig.view===undefined){
            isHide = false;
          }else  if(elementConfig.view==true){
            if(!elementConfig.edit){
              disabled = true;
            }
          }else{
            isHide = true;
          }
          format =  element.format ? element.format : "";
          valueFormat=element['value-format']?element['value-format']:"";
          type = elementConfig.avueType ? elementConfig.avueType : "input";
          
         if(elementConfig.tag =='xjr-select-user'){//人员
             type = "select-user";
          }
          //开关
          else if(elementConfig.tag=='el-switch'){
            otherParams['active-color'] = element['active-color'];
            otherParams['inactive-color'] = element['inactive-color'];
            dicData = [{
              label:element['active-text'],
              value:element['active-value']
            },{
              label:element['inactive-text'],
              value:element['inactive-value']
            }]
          }else if(elementConfig.tag=='avue-information-body'){
            if(this.isEdit==1){
              otherParams['operationVal'] = "add";
            }else if(this.isEdit==2){
              otherParams['operationVal'] = "look";
            }else if(this.isEdit==3){
              otherParams['operationVal'] = "edit";
            }
            otherParams['infoType'] = element.infoType;
            otherParams['whetherToRebindSecondaryEditing'] = elementConfig.whetherToRebindSecondaryEditing;
          }
          otherParams['isEdit'] = this.isEdit;
          //DicData数据
          if (elementConfig.dataType){
             dicData = await getOptions(elementConfig);
          }
          // if (elementConfig.tag == "avue-load-tree") {//公司树 部门树
          //   type = "input-tree";
          //   let tagIcon = elementConfig.tagIcon;
          //   if (tagIcon == "company") {
          //     await this.getCompanyDic();
          //     dicData = this.companiesDic;
          //   } else if (tagIcon == "department") {
          //     await this.getDepartmentDic();
          //     dicData = this.departmentsDic;
          //   }
          // }
          if (elementConfig.defaultValue) {
            this.columnDefault[elementConfig.bindTableField] =
              elementConfig.defaultValue?elementConfig.defaultValue:null;
          }
           if(element.isCapitalized){//大写
            if (element.computationalConfiguration&&element.computationalConfiguration.length > 0) {
              disabled = true;
            }
          }
          //联想组件
          let formslot = false;
          if(type=='asso-select'||type=='asso-popup'||type=='mutiple-popup' || type=='load-tree'){
            formslot = true;
            if (type !== 'load-tree'){
              this.confFields[this.fieldsIndex].__config__.children[index].__config__.dicData = dicData;
            }
          }

		  let lgmarkString = '';
		  if(elementConfig.F_LgMarkCode === '' || elementConfig.F_LgMarkCode === null|| elementConfig.F_LgMarkCode === undefined){
		    lgmarkString = elementConfig.label
		  }else{
		    lgmarkString = this.$t(elementConfig.F_LgMarkCode);
		  }
          if(elementConfig.bindTableField){
            let temp = {
            label: lgmarkString,
            prop: elementConfig.bindTableField,
            type,
            width: (element&&element.style&&element.style.width&&element.style.width!="100%")?element.style.width:null,
            rules: rules,
            dicData,
            value,
            disabled:isView?isView:disabled,
            readonly:isView,
            format,
            valueFormat,
            hide:isHide,
            formslot,
            placeholder:placeholderStr,
            ...otherParams
          };
          columnChildren.push(temp);
          this.$set(this.columnChildren,index,temp);	
          }
        }
      
      }
    },

    getInfoDicDataValue(infoType = "company") {
      let dicData = [];
      let userInfo = localStorage.getItem("avue-userInfo")
        ? JSON.parse(localStorage.getItem("avue-userInfo")).content
        : {};
      // if (infoType == "department") {
      //   userInfo.F_Department.forEach(item => {
      //     dicData.push({
      //       label: item.F_FullName,
      //       value: item.F_DepartmentId
      //     });
      //   });
      // } else if (infoType == "company") {
      //   dicData.push({
      //     label: userInfo["F_Company"].F_FullName,
      //     value: userInfo["F_Company"].F_CompanyId
      //   });
      // } else
      if (infoType == "user") {
        dicData.push({
          label: userInfo.F_RealName,
          value: userInfo.F_UserId
        });
      } else if (infoType == "date") {
        dicData.push({
          label: this.format("yyyy-MM-dd hh:mm:ss"),
          value: this.format("yyyy-MM-dd hh:mm:ss")
        });
      }
      return dicData;
    },
    format(fmt) {
      var now = new Date();
      var o = {
        "M+": now.getMonth() + 1, //月份
        "d+": now.getDate(), //日
        "h+": now.getHours(), //小时
        "m+": now.getMinutes(), //分
        "s+": now.getSeconds(), //秒
        "q+": Math.floor((now.getMonth() + 3) / 3), //季度
        S: now.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (now.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    getDateVal() {
      return new Date().valueOf();
    },
    // async getCompanyDic() {
    //   let res = await getAllCompanies();
    //   if (res.data.success) {
    //     this.companiesDic = this.formateDicData(
    //       res.data.data,
    //       "F_FullName",
    //       "F_CompanyId"
    //     );
    //   }
    // },
    // async getDepartmentDic() {
    //   let res = await getCompanyDepartments();
    //   if (res.data.success) {
    //     this.departmentsDic = this.formateDicData(
    //       res.data.data,
    //       "F_FullName",
    //       "F_DepartmentId"
    //     );
    //   }
    // },
    formateDicData(data, labelKey, valueKey) {
      if (data.length <= 0) {
        return false;
      }
      let dicData = [];
      data.forEach(ele => {
        let children = [];
        if (ele.children.length > 0) {
          children = this.formateDicData(ele.children, labelKey, valueKey);
        }
        dicData.push({
          label: ele[labelKey],
          value: ele[valueKey],
          disabled: ele[valueKey] ? false : true,
          children: children
        });
      });
      return dicData;
    },
	changeData(conf) {
	  let rules=[]
    if(conf.required){
		let str=conf.label+'不能为空';

		if(this.formEnCodeList&&(!this.formEnCodeList[conf.bindTable]||!this.formEnCodeList[conf.bindTable].includes(conf.bindTableField))){
			str+=','+this.$t('noFormAuth')
		}
      if(conf.tag=='el-time-picker'&&conf.avueType=="timerange"){
         //时间范围
         rules.push({required:true, message:str})
         rules.push({
                message: str,
                trigger: 'change',
                validator: (rule, value, callback) => {
          if (value&&Array.isArray(value)) {
            if (value.length > 0) {
              if (value[0] == "") {
                callback(new Error('时间范围不能为空'));
              }
              else {
                callback();
              }
            }
            else {
              callback(new Error('时间范围不能为空'));
            }
          }
          callback();
        }
        });
    }else{
       rules.push({required:true, message:str})
    }
      if ( conf.regList && conf.regList.length > 0){   
        conf.regList.forEach(item => {
          if (item.pattern) {
            rules.push({
              pattern: item.pattern,
              message : item.message?item.message:(conf.label+"验证不通过"),
              trigger: "change"
            });
          }
        });
      }
    }
	  
	  return rules;
	}
  }
};
</script>
<style scoped>
  div /deep/ .el-loading-spinner{
    top: 50px!important;
  }
  div /deep/ .el-table__body{
    transform: perspective(500px) translate3d(0px,0px,0px);
  }
  div /deep/ .el-table__body tbody tr{
    transform: perspective(500px) translate3d(0px,0px,0px);
  }
</style>