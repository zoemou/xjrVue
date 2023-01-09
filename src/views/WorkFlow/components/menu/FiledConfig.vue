<template>
  <div class="main-container">
    <avue-crud
      ref="queryTable"
      :data="querySelection"
      :option="queryoption"
      stripe
      @sortable-change="sortableChange"
    >
      <template slot="add" slot-scope="scope">
        <i class="el-icon-remove"  @click="deleteData(scope)"></i>
      </template>
			<template slot="showNode" slot-scope="scope">
			  <el-checkbox v-if="scope.row.showNode>=0" v-model="scope.row.showNode"
				 :true-label="1" :false-label="0" :checked="scope.row.showNode"></el-checkbox>
			</template>
      <template slot="name" slot-scope="scope">
         <avue-input-tree
          v-if="!isForbidDeleteColumn(scope.row.name)"
            default-expand-all
            v-model="scope.row.name"
             :props="columnDefaultProps"
            :placeholder="$t('workFlow.filedConfig.selectCName')"
            type="tree"
            :dic="fieldOptions"
            size="small"
          ></avue-input-tree>
        <span v-else>{{scope.row.fieldName}}</span>
      </template>
      <template slot="align" slot-scope="scope">
        <el-select v-if="!isForbidDeleteColumn(scope.row.name)" v-model="scope.row.align" :placeholder="$t('workFlow.filedConfig.placeholderSelect')">
          <el-option
            v-for="item in alignOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
          <span v-else>{{scope.row.align}}</span>
      </template>
      <template slot="width" slot-scope="scope">
        <el-input
          v-model="scope.row.width"
          :placeholder="$t('workFlow.filedConfig.placeholderEg')"
          type="number"
        ></el-input>
        <!-- <span v-else>{{scope.row.width}}</span> -->
      </template>
    </avue-crud>
    <div class="page-box">
       <el-input
          v-model="pageSize"
          type="number"
          :disabled="!isPage"
        ></el-input>
         <el-radio v-model="isPage" :label="true">{{$t('workFlow.filedConfig.pagination')}}</el-radio>
  <el-radio v-model="isPage" :label="false">{{$t('workFlow.filedConfig.noPagination')}}</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  props: ["fieldOptions", "fieldData"],
  data() {
    return {
      isPage:false,
      pageSize:10,
      forbidDeleteColumn:[],
      querySelection: [],
      alignOptions: [
        { value:this.$t('workFlow.filedConfig.centered') },
        { value:this.$t('workFlow.filedConfig.alignLeft') },
        { value:this.$t('workFlow.filedConfig.alignRight') },
      ],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: "auto", //表格高度差（主要用于减去其他部分让表格高度自适应）
        height: "400px", //表格高度
        maxHeight: "auto",
        border: true,
        align: "center",
        menu: false,
        page: false,
        sortable: true,
        dragHandler: true,
        header: false,
        column: [
          {
            label: "",
            prop: "add",
            renderHeader: (h) => {
              return h("i", {
                style: { color: "#409EFF", fontSize: "20px", display: "block" },
                class: "el-icon-circle-plus",
                on: {
                  click: this.addRow,
                },
              });
            },
            width: "50px",
            slot: true,
          },
					{
					  label: this.$t('showNodeInfor'),
					  prop: 'showNode',
					  width: '100px',
					  slot: true
					},
          {
            label:this.$t('workFlow.filedConfig.tabCName'),
            prop: "name",
            slot: true,
          },
          {
            label:this.$t('workFlow.filedConfig.tabAlign'),
            prop: "align",
            slot: true,
          },
          {
            label:this.$t('workFlow.filedConfig.tabWidth'),
            prop: "width",
            slot: true,
          },
        ],
      },
      columnDefaultProps: {
        children: "children",
        label: "label",
      }
    };
  },
  created() {
    this.forbidDeleteColumn = ['createTime','serialNumber','taskName','schemeName','priority','startUser'];
    if (this.fieldData?.fields.length > 0) {
      this.querySelection = this.fieldData.fields;
			this.querySelection.forEach(o=>{
				if(this.forbidDeleteColumn.includes(o.name)){
					o.showNode=-1
				}
			})
      this.isPage = this.fieldData.isPage ;
      this.pageSize = this.fieldData.pageSize;
    } else {
      this.querySelection = [
        {
          name: "createTime",
					showNode:-1,
          fieldName:this.$t('workFlow.filedConfig.timeQuery'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "createTime",
          bindTable: "",
        },
        {
          name: "serialNumber",
					showNode:-1,
          fieldName:this.$t('workFlow.filedConfig.serialNum'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "serialNumber",
          bindTable: "",
        },
        {
          name: "taskName",
					showNode:-1,
          fieldName: this.$t('workFlow.filedConfig.taskName'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "taskName",
          bindTable: "",
        },
        {
          name: "schemeName",
					showNode:-1,
          fieldName:this.$t('workFlow.filedConfig.schemeName'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "schemeName",
          bindTable: "",
        },
        {
          name: "priority",
					showNode:-1,
          fieldName:this.$t('workFlow.filedConfig.priority'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "priority",
          bindTable: "",
        },
        {
          name: "startUser",
					showNode:-1,
          fieldName:this.$t('workFlow.filedConfig.startUser'),
          align:this.$t('workFlow.filedConfig.centered'),
          width: "",
          fieldId: "startUser",
          bindTable: "",
        },
      ];
    }
  },
  methods: {
    isForbidDeleteColumn(name){
      return this.forbidDeleteColumn.includes(name);
    },
    deleteData(scope) {
      this.querySelection.splice(scope.row.$index, 1);
    },
    sortableChange(oldindex, newindex) {
      let oldObj = this.querySelection[oldindex];
      let newObj = this.querySelection[newindex];
      this.querySelection[newindex] = oldObj;
      this.querySelection[oldindex] = newObj;
    },
    addRow() {
      var obj = {
				showNode:0,  //0=false,1=true
        fieldName: "",
        align:this.$t('workFlow.filedConfig.centered'),
        width: "",
        fieldId: "",
      };
      this.querySelection.push(obj);
    }
  },
};
</script>

<style scoped>
.avue-crud {
  height: 100%;
}
.el-icon-remove {
  color: #f56c6c;
  font-size: 20px;
  display: block;
}
.page-box{
      display: flex;
    right: 20px;
    position: absolute;
    justify-content: center;
    align-items: center;
    bottom: 60px;
}
</style>
