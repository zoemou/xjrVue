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
        <i
          class="el-icon-remove"
          v-if="!isForbidDeleteColumn(scope.row.name)"
          @click="deleteData(scope)"
        ></i>
      </template>
      <template slot="isChecked" slot-scope="scope">
        <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
      </template>
      <template slot="searchtype" slot-scope="scope">
        <el-select v-model="scope.row.searchtype" 
				:placeholder="$t('workFlow.filedConfig.placeholderSelect')"
				@change="typeChange(scope)">
          <el-option
            v-for="item in searchtypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
						:disabled="isForbidDeleteColumn(scope.row.name)"
          >
          </el-option>
        </el-select>
      </template>
      <template slot="name" slot-scope="scope">
        <avue-input-tree
          v-if="scope.row.searchtype == 'data'"
          default-expand-all
          v-model="scope.row.name"
          :props="columnDefaultProps"
          :placeholder="$t('workFlow.filedConfig.selectCName')"
          type="tree"
          :dic="fieldOptions"
          size="small"
					@change="changeField(scope.row)"
        ></avue-input-tree>

        <el-input
          v-model="scope.row.name"
					:disabled="isForbidDeleteColumn(scope.row.name)"
          v-else
          :placeholder="$t('workFlow.searchConfig.placeholderEg')"
        ></el-input>
      </template>
      <template slot="field" slot-scope="scope">
        <el-input
          v-model="scope.row.field"
					disabled
          v-if="isForbidDeleteColumn(scope.row.name)"
        ></el-input>       
        <el-select v-else v-model="scope.row.field" :disabled="scope.row.searchtype == 'data'" :placeholder="$t('selectBindField')">
          <el-option
            v-for="item in bindField"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template slot="width" slot-scope="scope">
        <el-input v-model="scope.row.width" disabled></el-input>
      </template>
      <template slot="height" slot-scope="scope">
        <el-input v-model="scope.row.height" disabled></el-input>
      </template>
    </avue-crud>
  </div>
</template>

<script>
export default {
  props: ["fieldOptions", "selectedList","bindTableFiled","bindField"],
  data() {
    return {
      querySelection: [
        {
          isChecked: false,
          searchtype:'time',
          name: "",
          field: "",
          width: "400",
          height: "220",
          table: "",
          type: "",
          fieldId: ""
        }
      ],
      searchtypeOptions: [{ label: this.$t('workFlow.filedConfig.timeQuery'),value:'time' },
	  { label:this.$t('workFlow.searchConfig.dataFieldQ'),value:'data'},
	  {label:this.$t('workFlow.filedConfig.serialNum'),value:'serialNum'}],
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
            renderHeader: h => {
              return h("i", {
                style: { color: "#409EFF", fontSize: "20px", display: "block" },
                class: "el-icon-circle-plus",
                on: {
                  click: this.addRow
                }
              });
            },
            width: "50px",
            slot: true
          },
          {
            label:this.$t('workFlow.searchConfig.tabEnable'),
            prop: "isChecked",
            width: "50px",
            slot: true
          },
          {
            label:this.$t('workFlow.searchConfig.tabQSort'),
            prop: "searchtype",
            slot: true
          },
          {
            label:this.$t('workFlow.searchConfig.tabFieldName'),
            prop: "name",
            slot: true
          },
          {
            label: this.$t('workFlow.searchConfig.tabBoundField'),
            prop: "field",
            slot: true
          },
          {
            label:this.$t('searchBoxWidth'),
            prop: "width",
            slot: true
          },
          {
            label:this.$t('searchBoxHeight'),
            prop: "height",
            slot: true
          }
        ]
      },
      columnDefaultProps: {
        children: "searchChild",
        label: "label"
      },
      forbidDeleteColumn: []
    };
  },
  created() {
    this.forbidDeleteColumn = ["createTime", "serialNumber"];
    if (this.selectedList.length > 0) {
      this.querySelection = this.selectedList;
    } else {
      this.querySelection = [
        {
          isChecked: true,
          searchtype:'time',
          name: "createTime",
          width: "400",
          height: "220",
          field: "createTime",
          table: "",
          type: "",
          fieldId: "createTime"
        },
        {
          isChecked: true,
          searchtype:'serialNum',
          name: "serialNumber",
          width: "400",
          height: "220",
          field: "serialNumber",
          table: "",
          type: "",
          fieldId: "serialNumber"
        },
        {
          isChecked: true,
          searchtype:'data',
          name: "",
          width: "400",
          height: "220",
          field: "",
          table: "",
          type: "",
          fieldId: ""
        }
      ];
    }
  },
  methods: {
		typeChange(scope){			
			if(scope.row.searchtype=="time"){
				scope.row.name="";
			}
		},
    isForbidDeleteColumn(name) {
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
        isChecked: false,
        searchtype:'data',
        name: "",
        width: "400",
        height: "220",
        field: "",
        table: "",
        type: "",
        fieldId: ""
      };
      this.querySelection.push(obj);
    },
		changeField(row){
			if(this.bindTableFiled.get(row.name)){
				row.field=row.name
			}
		}
  }
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
</style>
