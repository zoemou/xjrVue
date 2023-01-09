<template>
  <div>
    <el-form-item class="item-box">
      <label>{{$t('workFlow.selectNodes.restrictiveCondition')}}</label>
      <el-checkbox-group v-model="checkIndexList">
        <el-checkbox
          v-for="(item, index) in options"
          :key="item.value"
          :label="index"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="item-box">
      <label>{{$t('workFlow.selectNodes.roleSelect')}}</label>
       <List class="content-list" type="specialPost" :list="list" @clickSelected="clickSelected"></List>
    </el-form-item>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { getAllSpecialPostList } from "@/api/organization/department";
import List from "@/components/organization/components/List";
export default {
  components: {
    List,
  },
  props: {
    selectedList: {
      type: Array,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      checkIndexList: [],
      options: [],
      list: [],
      changeSelectedList: [],
    };
  },
  async mounted() {
    let type = this.type;
    let typeName = type == 1 ? this.$t('company'): this.$t('code.leftScrollbar.component.department');
    let topName = this.$t('originatorBelongs') + typeName;
    this.options = [
      { label:this.$t('noLimit'), value: "" },
      { label: topName + "", value: "same" },
      { label: topName + this.$t('superior') + typeName, value: "sameS1" },
      { label: topName + this.$t('specialPostTwoLevels') + typeName, value: "sameS2" },
      { label: topName + this.$t('specialPostThreeLevels') + typeName, value: "sameS3" },
      { label: topName + this.$t('highest') + typeName, value: "sameMax" },
    ];
    let checkIds = [];
    let optionsValues = [];
    if (this.selectedList.length > 0) {
      this.selectedList.forEach((ele) => {
        checkIds.push(ele.F_ObjId);
        if (ele.limitType) {
          optionsValues.push(ele.limitType);
        }
        if (ele.limitType == undefined) {
          optionsValues.push("");
        }
      });
      this.options.forEach((element, index) => {
        if (optionsValues.includes(element.value)) {
          this.checkIndexList.push(index);
        }
      });
    }
      if (this.checkIndexList.length == 0) {
        this.checkIndexList.push(0); //给默认选中不限制
      }
    let res = await getAllSpecialPostList(type);
    if (res.data.success) {
      this.list = res.data.data.map((ele, index) => {
        if (checkIds.includes(ele.F_Id)) {
          this.changeSelectedList.push(ele);
          return Object.assign({}, { id: index, selected: true }, {...ele, value: ele.F_Id,label: ele.F_Name});
        } else {
          return Object.assign({}, { id: index, selected: false }, {...ele, value: ele.F_Id,label: ele.F_Name});
        }
      });
    }
  },
  methods: {
    clickSelected(index) {
      this.list[index].selected = !this.list[index].selected;
      if (this.list[index].selected) {
        this.changeSelectedList.push(this.list[index]);
        if (this.singleSelectd) {
          this.changeSelectedList = [];
        }
      } else {
        this.changeSelectedList.splice(index, 1);
      }
    },
    pushParentData() {
      let result = [];
      this.checkIndexList.forEach((index) => {
        let checkedValue = this.options[index];
        let limitType = checkedValue.value;
        let limitName = checkedValue.label;

        this.changeSelectedList.forEach((element) => {
          if (limitType == "") {
            result.push({
              F_Id: uuidv4(),
              F_ObjId: element.F_Id,
              F_ObjName: element.F_Name,
            });
          } else {
            result.push({
              F_Id: uuidv4(),
              F_ObjId: element.F_Id,
              F_ObjName: element.F_Name + "-" + limitName,
              limitType,
              limitName,
            });
          }
        });
      });
      return result;
    },
  },
};
</script>
<style scoped>
.item-box /deep/ .el-form-item__content,
.item-box /deep/ .el-checkbox,
.item-box /deep/ .el-checkbox__label {
  font-size: 12px;
}
</style>
