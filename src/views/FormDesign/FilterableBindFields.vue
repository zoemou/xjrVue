<template>
    <el-dialog v-dialogDrag
      :title="conf.title"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="1vh"
      :visible.sync="visibleDialog"
      :width="conf.width"
      :before-close="closeDialog"
    >
      <div class="auto-bind-field">
        <avue-crud ref="crud" :option="option" :data="data">
          <template slot="component" slot-scope="{row}">
            <el-select v-model="row.component" :placeholder="$t('code.codeStepFour.placeholderSelect')" @change="handleSelectCom" clearable @clear="clearComps(row)">
              <el-option
                v-for="item in filterComps"
                :key="item.__config__.formId"
                :label="item.__config__.label"
                :value="item.__config__.formId">
              </el-option>
            </el-select>
         </template>
		 <template slot="isShow" slot-scope="{row}">
			 <el-checkbox v-model="row.isShow" @change="singleChecked"></el-checkbox>
		 </template>
		 <template slot="width" slot-scope="{row}">
		 	 <el-input v-model="row.width"></el-input>
		 </template>
        </avue-crud>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
        <el-button size="mini" type="primary" @click="confirm">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
    export default {
        name: "IndexAuth",
        data(){
            return {
                visibleDialog: true,
                emptyText:this.$t('orgRoleManagement.databaseAuth.hintLoading'),
                data:[],
                option: {
                  labelWidth: 110,
                  addBtn: false,
                  refreshBtn: false,
                  columnBtn: false,
                  index: true,
                  align: 'center',
                  menu: false,
                  maxHeight: 500,
                  column: [
                    {
                      label: this.$t('code.codeStepTwoListStructure.fieldName'),
                      prop: "bindField",
                      span: 12
                    },
                    {
                      label: this.$t('fillComponent'),
                      prop: 'component',
                      slot: true
                    },
                    {
                      label:this.$t('populateComponentBindFields'),
                      prop: "field"
                    },
                    {
                      label:this.$t('mobileDev.formRightSide.optionShow'),
                      prop: "isShow",
					  slot: true,
					  hide:this.conf.avueType=="asso-select",
					  renderHeader: (h,{ column }) => {
					    return h('div',
					        [
								column.label,
								h("el-checkbox", {
								  style: "margin-left: 5px;",
								  on: {
									change: this.selectAll
								  },
								  props: {
									value: this.checkedAll
								  }
								})
							]
					    );
					  }
                    },
                    {
                      label:this.$t('mobileDev.tableSet.tabWidth'),
                      prop: "width",
					  slot: true,
					  hide:this.conf.avueType=="asso-select",
                    }
                  ]
                },
                currentComFormId: null,
                filterComps: [],
				checkedAll:true
            }
        },
        mounted(){
          let formIdMapData = this.conf.FormIdMap;
          let formId = (this.activeData&&this.activeData.__config__&&this.activeData.__config__.formId)?this.activeData.__config__.formId:null;
          if(formId&&formIdMapData.has(formId)){
            let val = formIdMapData.get(formId);
            if(val.parentFormId){
              //父级是子表单
              if(val.parentFormConf&&val.parentFormConf.__config__&&val.parentFormConf.__config__.children&&val.parentFormConf.__config__.children.length>0){
                 this.filterComps = this.getComps( val.parentFormConf.__config__.children);
              }
            }else{
              //父级是顶级
              this.filterComps = this.getComps(this.comList);
            }
          }
          
          this.getTableData();
        },
        methods:{
			clearComps(row){
				this.data[row.id].field=""
			},
			selectAll(data){				
				this.checkedAll=data;
				this.data.forEach(it=>{
					it.isShow=data
				})
				console.log(data,this.data)
			},
			singleChecked(){
				let count=0;
				this.data.forEach(it=>{
					count+=it.isShow?1:0
				})
				this.checkedAll=count==this.data.length?true:false
			},
      getComps(arr){
        let comps = [];
        arr.map(item=>{
          if(item?.__config__?.componentName == 'avue-tabs'){
            let childrenObj = item?.__config__?.childrenObj || [];
            for(let key in childrenObj){
              let children = childrenObj[key];
              comps.push(...this.getComps(children));
            }
          }else if(item?.__config__?.componentName == 'table'){
            // let children = item?.__config__?.children || [];
            // comps.push(...this.getComps(children));
          }else{
            if(['h2','el-divider','xjr-opinion-comonent'].includes(item?.__config__?.tag)) return;
            if(!item?.__config__?.filterable) comps.push(item);
          }
        })
        return (()=>{ return comps; })();
      },
      confirm(){
        let obj = {};
        if(!this.valid()){
          this.$message({type:'warning',message:this.$t('thereAreDuplicateBindingsInTheComponent')});
          return false;
        };
        // this.data.forEach(item=>{
        //   if(item.component){
        //     obj[item.component] = item.bindField;
        //   }
        // });
  console.log(this.data)
        this.activeData.__config__.autoBindFields = JSON.stringify(this.data);
        this.closeDialog();
      },
      valid(){
        let len = 0;
        let setArr = new Set();
        let newArr = [];
        let componentLength = this.data.forEach(item=>{
          if(item.component){
            len++;
            setArr.add(item.component);
          } 
        });
        newArr = Array.from(setArr);

        return len == newArr.length;
      },
      handleSelectCom(val){
        this.setFieldBind(val);
      },
      setFieldBind(val){
        this.data.map((item,index)=>{
    console.log(item,val,this.filterComps)
          let curRowComFormId = item.component;
          this.filterComps.map((ele,idx)=>{
            if(ele.__config__.formId == curRowComFormId){
              item.field = ele.__vModel__;
            }
          });
        });
      },
      getTableData(){
				let bindFieldMap =""
			  if(Object.prototype.toString.call(this.conf.autoBindFields) === '[object Array]'){
			  	bindFieldMap = this.conf.autoBindFields;
			  }else if(Object.prototype.toString.call(this.conf.autoBindFields) === '[object Object]'){
				bindFieldMap = new Map();
				for (let key in this.conf.autoBindFields) {
				  let val = this.conf.autoBindFields[key];
				  let keyInt = parseInt(key);
				  let item = this.conf.FormIdMap.get(keyInt);
				  bindFieldMap.set(val,item?item:{});
				}  
			  }
			  this.conf.fields.forEach((item,index)=>{
				 let obj = {};
				 let component = null;
				 let field = '';
				 let show=true;
				 let width=150;
				 if(Object.prototype.toString.call(bindFieldMap) === '[object Array]'){
					 bindFieldMap.forEach(el=>{
						if(el.bindField==item){
							field=el.field;
							component=el.component;
							show=el.isShow;
							width=el.width;
						}
					 })
				 }else if(Object.prototype.toString.call(bindFieldMap) === '[object Object]'){
					 let bindFieldMapItem =  bindFieldMap.get(item);
					 if(bindFieldMapItem&&bindFieldMapItem.formId){
					   component = bindFieldMapItem.formId;
					 }
					 if(bindFieldMapItem&&bindFieldMapItem.bindTableField){
					   field  = bindFieldMapItem.bindTableField;
					 }
				 }
				 
				 obj.id = index;
				 obj.bindField = item;
				 obj.component = component;
				 obj.field = field;
				 obj.isShow = show;
				 obj.width = width;
				 this.data.push(obj);
			  });
            },
            closeDialog(){
                this.visibleDialog = false;
                this.$emit('onHandler', this.activeData);
            }
        },
        props: {
            'conf':{
                type: Object
            },
            'comList': {
                type: Array
            },
            'activeData': {
                type: Object
            }
        }
    }
</script>
<style scoped>
/deep/.dialog-footer{
	display: inline-block;
	margin-top: 10px;
}
/deep/.el-dialog__body{
  padding: 10px;
}
</style>