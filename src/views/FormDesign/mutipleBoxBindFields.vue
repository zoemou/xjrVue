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
		 <template slot="isShow" slot-scope="{row}">
			 <el-checkbox v-model="row.isShow" @change="singleChecked"></el-checkbox>
		 </template>
		 <template slot="width" slot-scope="{row}">
		 	 <el-input v-model="row.width"></el-input>
		 </template>
        </avue-crud>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
    export default {
        name: "IndexAuth",
        data(){
            return {
                visibleDialog: true,
                emptyText: '数据加载中...',
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
                      label: '字段名',
                      prop: "bindField",
                      span: 12
                    },
                    {
                      label: '显示',
                      prop: "isShow",
					  slot: true,
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
                      label: '列宽',
                      prop: "width",
					  slot: true
                    }
                  ]
                },
                currentComFormId: null,
				checkedAll:true
            }
        },
        mounted(){
          this.getTableData();
        },
        methods:{
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

            confirm(){
              let obj = {};
              if(!this.valid()){
                this.$message({type:'warning',message:'组件存在重复绑定,请更改'});
                return false;
              };
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
              this.setFieldBind();
            },
            setFieldBind(){
              this.data.map((item,index)=>{
                let curRowComFormId = item.component;
              });
            },
            getTableData(){
			  let bindFieldMap = this.conf.autoBindFields;
			  console.log(bindFieldMap)

			  this.conf.fields.forEach((item,index)=>{
				  console.log(item)
				 let obj = {};
				 let component = null;
				 let field = '';
				 let show=true;
				 let width=150;
				 bindFieldMap.forEach(el=>{
					if(el.bindField==item){
						field=el.field;
						component=el.component;
						show=el.isShow;
						width=el.width;
					}
				 })
				 
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