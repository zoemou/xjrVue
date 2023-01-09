<template>
  <div class="sequence-box">
    <el-form label-position="top" :model="formInfo">
      <el-tabs v-if="formInfo.id">
        <el-tab-pane :label="$t('workFlow.Start.tabBasicConfig')">
          <!-- <el-form-item>
            <label>节点标识</label>
            <el-input v-model="formInfo.id" disabled></el-input>
          </el-form-item> -->
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeName')}}</label>
            <el-input v-model="formInfo.name"></el-input>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.Start.nodeDescr')}}</label>
            <el-input
              v-model="formInfo.documentation"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane :label="$t('workFlow.sequenceFlow.cirCondition')">
          <el-form-item>
            <label>{{$t('workFlow.sequenceFlow.variableSource')}}</label>
            <el-select v-model="variableSource.value"  ref="variableSourceSelect">
              <el-option
                :value="variableSource.value"
                :label="variableSource.value"
              >
                <el-tree
                  :data="variableSource.list"
                  :props="sourceDefaultProps"
                  accordion
                  @node-click="changeVariableSource"
                >
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.sequenceFlow.Operator')}}</label>
            <el-select
              v-model="operator.value"
              @change="changeVariableOperator"
            >
              <el-option
                v-for="(item, index) in operator.list"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.sequenceFlow.calculatedValue')}}</label>
            <el-select
              v-if="variableSourceType == 'button'"
              v-model="variableValue.value"
              @change="changeVariableValue"
            >
              <el-option
                v-for="(item, index) in variableValue.list"
                :key="index"
                :label="$t(item.label)"
                :value="index"
              ></el-option>
            </el-select>
            <el-input v-else v-model="variableValue.value"   @change="changeVariableInputValue"></el-input>
          </el-form-item>
          <el-form-item>
            <label>{{$t('workFlow.sequenceFlow.andUnconditional')}}</label>
            <el-select
              v-model="andornot.value"
              @change="changeVariableAndornot"
            >
              <el-option
                v-for="(item, index) in andornot.list"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="tag-box">
            <draggable @end="end">
              <template v-if="conditionsequenceflowArr.length > 0">
                <el-tag
                  v-for="(tag, index) in conditionsequenceflowArr"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index)"
                  >{{ $t(tag.name) }}
                </el-tag></template
              >
              <template v-else>
                <div class="all-p-10 setTableTrBoder mb10 rule-tip-box">
                </div>
              </template>
            </draggable>

            <!-- <el-tag
              v-for="(tag, index) in conditionsequenceflowArr"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
              >{{ tag.name }}
            </el-tag> -->
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import mixinNode from "./../mixin/mixinNode";
import { changeVariableSourceList } from "./../common/util/variable";
import { getProcessParametersData } from "./../common/util/properties";
export default {
  mixins: [mixinNode],
  data() {
    return {
      operator: {
        value: "",
        list: [
          {
            value: "=",
            label: this.$t('equal')
          },
          {
            value: "+",
            label: this.$t('plus')
          },
          {
            value: "-",
            label: this.$t('minus')
          },
          {
            value: "*",
            label: this.$t('multiply')
          },
          {
            value: "/",
            label: this.$t('divide')
          },
          {
            value: "(",
            label: this.$t('(brackets')
          },
          {
            value: ")",
            label: this.$t('brackets)')
          },
          {
            value: "!=",
            label: this.$t('unequal')
          },
          {
            value: ">",
            label: this.$t('greater')
          },
          {
            value: ">=",
            label: this.$t('greaterEqual ')
          },
          {
            value: "<",
            label: this.$t('lessThan')
          },
          {
            value: "<=",
            label: this.$t('lessThanOrEqual')
          },
          {
            value: "⊇",
            label:this.$t('include')
          },
          // {
          //   value: "⊆",
          //   label: "包含于"
          // }
        ]
      },
      andornot: {
        value: "",
        list: [
          {
            value: "and",
            label: this.$t('and')
          },
          {
            value: "or",
            label: this.$t('editorModule.or')
          },
          {
            value: "not",
            label:this.$t('not')
          }
        ]
      },
      variableValue: {
        value: "",
        list: []
      },
      variableSource: {
        value: "",
        list: []
      },
      sourceDefaultProps: {
        children: "children",
        label: "label"
      },
      conditionsequenceflowArr: [],
      variableSourceType: "button"
    };
  },
  mounted() {
    this.conditionsequenceflowArr = this.formInfo.conditionsequenceflow!=""?JSON.parse(this.formInfo.conditionsequenceflow):[];
    //增加流程参数
    let variableRulesList = getProcessParametersData();
     let variableSourcelist =  changeVariableSourceList({needButton:true,needHideComponents:true});
    this.variableSource.list = [...variableRulesList,...variableSourcelist];
  },
  methods: {
    handleClose(index) {
      if (this.conditionsequenceflowArr.length > 0) {
        this.conditionsequenceflowArr.splice(index, 1);
      }
      this.changeFlow();
    },
    changeFlow() {
			if(this.conditionsequenceflowArr.length > 0){
				this.formInfo.conditionsequenceflow = JSON.stringify(
				  this.conditionsequenceflowArr
				);
			}else{
				this.formInfo.conditionsequenceflow = '';
			}
      
    },
    changeVariableSource(value) {
      let type = value.type;
      if (!value.children) {
        this.variableSourceType = type;
        if (type == "button") {
          let temp = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            name: value.resourceName + "•" + value.label
          };
          this.addVariable(temp);
          this.variableSource.value = "";
        }
        else if (type == "condition") {
          let temp = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            formId: value.formId,
            formName: value.formName,
            fieldId: value.id,
            fieldName: value.label,
            bindTable:value.bindTable,
            name: value.resourceName + "•" + value.formName + "•" + value.label
          };
          this.addVariable(temp);
          this.variableSource.value = "";
        }else if (type == "hideComponents") {
          let temp = {
            type,
            resourceId: value.resourceId,
            resourceName: value.resourceName,
            formId: value.formId,
            formName: value.formName,
            fieldId: value.id,
            fieldName: value.label,
            bindTable:value.bindTable,
            name: value.resourceName + "•" + value.formName + "•" + value.label,
            hideComponentsType:value.hideComponentsType,
            value:value.hideComponentsvalue,
            sqlConfig:value.sqlConfig,
            apiConfig:value.apiConfig,
          };
          this.addVariable(temp);
          this.variableSource.value = "";
        }else if(type == "parameter"){
          let temp = {
            type,
            resourceId: "",
            resourceName: "",
            formId: "",
            formName:"",
            fieldId: "",
            fieldName: "",
            bindTable:"",
            id:value.id,
            name:value.label,
            name:  "流程参数 •" + value.label
          };
          this.addVariable(temp);
          this.variableSource.value = "";
        }
        if (value.variableValueList) {
          this.variableValue.list = value.variableValueList;
        } else {
          this.variableValue.list = [];
        }
      }
    },
    changeVariableOperator(value) {
      let temp = {
        type: "operator",
        value,
        name: value
      };
      this.addVariable(temp);
      this.operator.value = "";
    },
    changeVariableInputValue(value) {
       let temp = {
        type: "value",
        value: value,
        name: value
      };
      this.addVariable(temp);
      this.variableValue.value = "";
    },
    changeVariableValue(index) {
      let temp = {
        type: "value",
        value: this.variableValue.list[index].value,
        name: this.variableValue.list[index].label
      };
      this.addVariable(temp);
      this.variableValue.value = "";
    },
    changeVariableAndornot(value) {
      let temp = {
        type: "andornot",
        value,
        name: value
      };
      this.addVariable(temp);
      this.andornot.value = "";
    },
    addVariable(temp) {
      this.conditionsequenceflowArr.push(temp);
      this.changeFlow();
      this.$refs.variableSourceSelect.handleClose()
    },
    end(e) {
      let oldJson = this.conditionsequenceflowArr[e.oldDraggableIndex];
      let newJson = this.conditionsequenceflowArr[e.newDraggableIndex];
      this.conditionsequenceflowArr[e.oldDraggableIndex] = newJson;
      this.conditionsequenceflowArr[e.newDraggableIndex] = oldJson;
    },
  }
};
</script>

<style lang="css" scoped>
.sequence-box /deep/ .el-form-item__content {
    max-height: 780px;
    overflow: scroll;
  }
.tag-box {
  margin-top: 10px !important; /*强制更改.flow-containers .property-panel .el-form-item*/
  border: 1px solid #d6d6d6;
  min-height: 200px;
  padding: 10px;
}
.tag-box  .el-tag {
    margin: 5px;
  }
</style>
