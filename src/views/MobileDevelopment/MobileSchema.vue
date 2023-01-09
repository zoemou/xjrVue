<template>
<div style="height:100%">
  <div class="main-container" style="height: 50%; padding: 0 10px;">
    <main-fixed :title="$t('mobileDev.mobileSchema.fixedTitle')">
      <div slot="list">
        <el-tree :data="treeItem" :props="defaultProps" node-key="F_ItemDetailId" ref="dTree" :default-expand-all="true"
                 @node-click="handleNodeClick"></el-tree>
      </div>
    </main-fixed>
    <main-content :title="contentTitle" :paddingLeft="210" :padding-top="94" :padding-bottom='40' :search="false">
      <div slot="table" style="height:100%">
          <avue-crud ref="crud" :data="designList" :option="selectoption" @selection-change="selectionChange">
          </avue-crud>
      </div>
    </main-content>
  </div>
  <div class="main-container" style="height: 50%; padding: 0 10px;">
    <main-content :title="$t('mobileDev.mobileSchema.titleSelected')" :paddingLeft="0" :padding-top="94" :padding-bottom='40' :search="false">
      <div slot="table" style="height:100%">
          <avue-crud ref="multipleTable" :data="selectedList" :option="selectedOption" @sortable-change="sortableChange">
            <template slot="F_Icon" slot-scope="scope">
              <el-input v-model="scope.row.F_Icon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
                <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon(scope.row)"></i>
              </el-input>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="danger" size="mini" @click="deleteData(scope.row)" v-if="scope.row.enable==false">{{$t('mobileDev.mobileSchema.deleteBtn')}}</el-button>
            </template>
          </avue-crud>
      </div>
    </main-content>
  </div>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.mobileSchema.titleSelectIcon')" :append-to-body="true" :visible.sync="IconVisible" width="80%" style="padding: 10px 20px;">
    <FontHtml v-on:childByValue="childByValue"></FontHtml>
  </el-dialog>
</div>
</template>
<script>
import { getAppFunctionList} from '@/api/code/code.js';
import {mobileCategory} from '@/components/mobileDesign/config';
import FontHtml from '../FontAwesome.vue';
export default {
  props:['selectedList'],
  data () {
    return {
      treeItem:mobileCategory,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      contentTitle:'模板列表',
      itemCode: 'customapp',
      defaultList:[{
        enable:true,
        F_Icon: "fa fa-cog",
        F_Name: "功能列表",
        F_Url: "more-app"
      },{
        enable:true,
        F_Icon: "fa fa-chevron-circle-right",
        F_Name: "组件演示",
        F_Url: "module/module-show"
      }],
      copyList:[],
      designList:[],
      IconVisible:false,
      selectoption: {
        highlightCurrentRow: true,
        stripe: true,
        height: '100%',
        tip:false,
        selectionFixed:false,
        border: true,
        page: false,
        selection: true,
        align: 'center',
        header:false,
        menu:false,
        column: [
          {
            label: this.$t('mobileDev.mobileSchema.tabDesName'),
            prop: 'F_Name'
          }, {
            label: this.$t('mobileDev.mobileSchema.tabSort'),
            prop: 'F_Type',
            formatter:function(row){
              let str="";
              for(let i=0;i<mobileCategory.length;i++){
                if(mobileCategory[i].F_ItemDetailId==row.F_Type){
                  str=mobileCategory[i].label
                }
              }
              return str;
            }
          }, {
            label: this.$t('mobileDev.mobileSchema.tabType'),
            prop: 'F_IsSystem',
            formatter:function(row){
              return row.F_IsSystem==1?'代码开发':'自定义表单'
            }
          }
        ]
      },
      selectedOption:{
        highlightCurrentRow: true,
        stripe: true,
        height: '100%',
        menuFixed:false,
        indexFixed:false,
        border: true,
        page: false,
        index: true,
        indexLabel:this.$t('mobileDev.mobileSchema.tabNum'),
        align: 'center',
        header:false,
        editBtn:false,
        delBtn:false,
        sortable:true,
        menuWidth:80,
        dragHandler: true,
        column: [
          {
            label: this.$t('mobileDev.mobileSchema.tabFunName'),
            prop: 'F_Name'
          },
          {
            label:this.$t('mobileDev.mobileSchema.tabIcon'),
            prop: 'F_Icon',
            slot:true
          }
        ]
      },
      curItem:0
    };
  },
  components: {
    FontHtml
  },
  methods: {
    handleNodeClick(data){
      this.contentTitle = data.label;
      this.itemCode = data.F_ItemDetailId;
      this.getList()
    },
    selectionChange (list) {
      if(list.length>6){
        this.$message({
          message: '最多设置八个菜单',
          type: 'warning'
        });
        this.$refs.crud.toggleSelection([list[6]]);
      }else{
        this.selectedList.forEach((it,i)=>{
          if(it.enable){
            list.push(it)
          }
        })     
        this.selectedList = [...list]
        this.copyList=[...list]
      }     
    },
    sortableChange(oldindex, newindex, row, list) {
      if(this.selectedList[oldindex].enable||this.selectedList[newindex].enable){
        //this.selectedList=arr;
        this.$message({
          message: '固定菜单不可拖拽排序',
          type: 'warning'
        });
        this.selectedList=[]
        this.$nextTick(()=>{
          this.selectedList=[...this.copyList]
        })
        
        return;
      } 
      // let arr=deepClone(this.selectedList)
      // if(row.enable==undefined){
        this.selectedList=[]
        this.copyList=[...list];
        this.$nextTick(()=>{
          this.selectedList=[...list];
        }) 
    },
    getList(){
      getAppFunctionList(this.itemCode).then((res) => {
        if (res.data.success) {
          this.designList=res.data.data;
          this.designList.forEach(it=>it.enable=false)

        }    
      });
    },
    selectMoreIcon (obj) {

      this.curItem=obj.$index;
      this.IconVisible = true;
    },
    childByValue: function (childValue) {
        // childValue就是子组件传过来的值
      this.selectedList[this.curItem].F_Icon = childValue;
      this.copyList[this.curItem].F_Icon = childValue;
      this.IconVisible = false;
    },
    deleteData(obj){
      let idx=this.designList.findIndex(o=>o.F_Id==obj.F_Id);
      this.$refs.crud.toggleSelection([this.designList[idx]]);
    },
    getResult(){
      return this.selectedList;
    }        
  },
  created () {
    this.$nextTick(function () {
      this.$refs.dTree.setCurrentKey(this.treeItem[0].F_ItemDetailId);
      this.handleNodeClick(this.$refs.dTree.getCurrentNode());
    })
  }
};
</script>

<style scoped>
::v-deep .main-table-content{
  padding-bottom: 20px;
}
.avue-crud{
  height: 100%;
}
</style>
