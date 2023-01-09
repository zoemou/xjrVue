<template>
  <el-dialog
    v-dialogDrag
    :title="$t('selectData')"
    :visible.sync="visible"
    :append-to-body="true"
    :modal="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :destroy-on-close="true"
    width="60%"
    top="10vh"
  >
    <div class="empty-data" v-if="!avueFormData.data.length">{{$t('user.setting.hintLoading')}}</div>
    <div v-if="avueFormData.data.length" style="width: 100%">
      <div class="search-box">
        <el-input
          v-model="keyword"
          size="small"
          :placeholder="$t('searchModule.searchPlaceholder')"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="search"
          >{{$t('searchModule.searchBtn')}}</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="searchReset"
          >{{$t('searchModule.searchReset')}}</el-button
        >
      </div>
      
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('dataSelect')" name="data">
              <avue-crud
                :data="originOptionList"
                :option="option"
                stripe
								@select="handleSelectionChange"
								@selection-change="handleSelectAll"
								@row-click="handleRowClick"
								@select-all="selectAll"
								ref="multipleTable"
              >
              </avue-crud>
          </el-tab-pane>
          <el-tab-pane :label="$t('selectedData')" name="selected">
            <avue-crud
              v-if="activeName == 'selected'"
              :data="selectedList"
              :option="selectedoption"
              stripe
            >
              <template slot="del" slot-scope="{ row }">
                <el-button
                  type="opr-primary"
                  class="del-btn"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delRow(row)"
                ></el-button>
              </template>
            </avue-crud>
          </el-tab-pane>
        </el-tabs>

    </div>
    <div slot="footer">
      <el-button size="mini" @click="handleClose"> {{$t('buttonModule.modalCancelBtn')}} </el-button>
      <el-button size="mini" type="primary" @click="handelConfirm"> {{$t('buttonModule.modalSureBtn')}} </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {deepClone } from '@/util/util';
export default {
  data() {
    return {
      activeName: "data",
      visible: true,
      keyword: "",
      option: {
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        height:400,
				selection:true,			
				selectionFixed:true,
				tip:false,
        border: true,
        page: false,
        index: false,
        companyId: "",
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [],
      },
      key: '',
			Index:'',
			originOptionList:[],
      selectedList: [],
			selectedTempList:[],
			searchClick:false,
      selectedoption: {
        header: false,
        menu: false,
        highlightCurrentRow: true,
        stripe: true,
        addBtn: false,
        height:400,
        border: true,
        page: false,
        index: false,
        companyId: "",
        align: "center",
        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        column: [],
      }
    };
  },
  props: {
    avueFormData: {
      type: Object,
      default: "",
    }   
  },
  mounted() {
    this.setOptionColumn(this.avueFormData.colum);
  },
  methods: {
		handleRowClick(row,event,column){
		  this.$refs.multipleTable.toggleRowSelection(row);
		},
		handleSelectAll(list){
			// if(this.searchClick){
			// 	this.searchClick=false;
			// }else{
				this.selectedList=list
			// 	list.forEach((o,i)=>{
			// 		let obj=this.selectedList.find(k=>{return k[this.key]==o[this.key]})
			// 		if(obj) return;
			// 		o[this.Index]=this.selectedList.length+1;
			// 		this.selectedList.push(o)
			// 	})
			// }			
		},
		handleSelectionChange(list,row){
			// let idx=this.selectedList.findIndex(k=>{return k[this.key]==row[this.key]})
			// if(idx>=0){
			// 	this.selectedList.splice(idx, 1);
			// }
			///this.selectedList=this.selectedTempList
		},
		selectAll(list){
			// if(list.length==this.originOptionList.length){
			// 	//全选
			// 	this.selectedList=this.avueFormData.data
			// }else{
			// 	//不全选
			// 	this.selectedList=list
			// //}
			// this.selectedTempList=this.selectedList;
		},
    search() {
			//this.selectedTempList=this.selectedList;
      if (this.keyword) {
				//this.searchClick=true;				
        let columns = this.option.column
          .filter((ele) => {
            return !ele.slot;
          })
          .map((ele) => {
            return ele.prop;
          });
        this.originOptionList = this.avueFormData.data.filter((ele) => {
          let hasData = false;
          columns.forEach((col) => {
            let str = new RegExp(this.keyword, "i");
            if (ele[col] && str.test(ele[col])) {
              hasData = true;
            }
          });
          return hasData;
        });
      } else {
        this.originOptionList = this.avueFormData.data;
      }
			this.$nextTick(()=>{
				this.selectedList.forEach(row=>{
					let obj=this.originOptionList.find(o=>{return o[this.key]==row[this.key]})
					if(obj){
						this.handleRowClick(obj)
					}
				})
			})
    },
    searchReset() {
      this.keyword = "";
      this.search();			
    },

    handelConfirm() {
      this.visible = false;
      this.$emit("onHandler", this.selectedList);
      this.$event.$emit("onHandler", this.selectedList);
    },

    setOptionColumn(result) {
			if(result.length<=0&&this.avueFormData.data.length>0){
				console.log(this.avueFormData.data[0],'this.avueFormData.data[0]')
				for(let key in this.avueFormData.data[0]){
					result.push({
						name:key,
						bindField:key
					})
				}
			}
			this.Index=result[0]?result[0].bindField+'Index':"";
			this.key=result[0]?result[0].bindField+'Id':"";
			this.avueFormData.data.forEach((o,i)=>{
				o[this.key]=i;
			})
			this.search()
      this.option.column = [];
			this.selectedoption.column = [];
			this.selectedoption.column.push({
				label: "",
				prop: "del",
				slot: true,
				fixed:true,
				width: 100,
			},{
				label: "#",
				prop: this.Index,
				width: 100,
			});
      for (let key of result) {
        let obj = {};
        obj.label = key.name;
        obj.prop = key.bindField;
        this.option.column.push(obj);
        this.selectedoption.column.push(obj);
      }
      let len = this.option.column.length;
    },
  
    handleClose() {
      this.$emit("onHandler");
    },

    delRow(row) {
      this.selectedList.splice(row.$index, 1);
			let obj=this.originOptionList.find(o=>{return o[this.key]==row[this.key]})
			if(obj){
				this.handleRowClick(obj)
			}
    }
  },
};
</script>
<style scoped>
.empty-data {
  height: 200px;
  color: #666 !important;
  text-align: center;
  padding: 10px 0;
}
.el-radio-group {
  width: 100%;
}
div /deep/ .avue-crud__pagination {
  position: relative;
  top: 10px;
}
div /deep/ .el-button--opr-primary {
  color: #f56c6c;
}
.search-box {
  margin-bottom: 10px;
}
.page-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
