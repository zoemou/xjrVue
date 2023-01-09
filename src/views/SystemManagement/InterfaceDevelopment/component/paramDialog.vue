<template>
  <div class="dialog-box">
    <el-dialog v-dialogDrag
      v-bind="$attrs"
      width="980px"
      :close-on-click-modal="false"
      append-to-body
      :before-close="close"
    >
      <div slot="title">
        {{$t('selectParameterAssignmentVariables')}}
      </div>
      <div class="content">
          <div class="left">
            <el-tree :data="treeData" :props="defaultProps" node-key="label" default-expand-all
            @node-click="handleNodeClick" ref="cTree" draggable @node-drag-end="handleDragEnd" :allow-drop="allowDrop"></el-tree>
          </div>
          <div class="config-detail">
            <draggable class="result-config" :sort="true" v-model="ruleList">
              <template>
                <div
                    v-for="(tag,index) in ruleList"
                    :key="index" 
                    class="result-item">
                      {{tag.label}}
                      <i class="el-icon-circle-close" @click="handleClose(index)"></i>
                    </div>
              </template>
            </draggable>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"
                   @click="close()">{{$t('buttonModule.modalCancelBtn')}}</el-button>
        <el-button type="primary"
                   @click="submit"
                   size="small">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import paramMixin from "./paramMixin.js";
import {
  deepClone
} from '@/util/util';
export default {
  components: {
    draggable
  },
  mixins: [paramMixin],
  // computed: {
  //   ...mapGetters(["inputParameter"]),
  // },
  //props: ['param'],
  data() {
    return {
	  ruleList:[]
    };
  },
  mounted(){
	if(this.param){
		this.ruleList=this.param.paramValue||this.param.varValue||this.param.outputValue||[]
	}
  },
  methods: {
	handleDragEnd(draggingNode, dropNode, dropType, ev) {
		this.ruleList.splice(0, 1,draggingNode && draggingNode.data);
	},
	handleClose(index) {
	  this.ruleList.splice(index, 1);
	},
    submit(){
	  this.$emit('changeData',this.ruleList);
      this.$emit('update:visible', false);
    },
    close(){
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style lang="scss" scoped>

  ::v-deep .el-dialog {
	height:calc(100% - 30vh)    
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    height: calc(100% - 95px);
  }
  .content {
    border: 1px solid #dcdfe6;
    margin: 10px;
    display: flex;
    border-radius: 3px 0px 0px 0px;
	height: calc(100% - 22px);
    .left{
      width: 300px;
      border-right: 1px solid #dcdfe6;
	  overflow: auto;
    }
    .config-detail{
      flex: 1;
      border-radius: 0px 0px 3px 0px;
    }
    .result-config{
      padding: 5px 0px 0px 5px;
      min-height: 300px;
      display: flex;
      align-items: baseline;
	  flex-wrap: wrap;
	  align-content: flex-start;
      .result-item{
        color: #909399;
        width: auto;
        padding: 0 4px;
		background: #ecf5ff;
		border: 1px solid #b3d8ff;
		border-radius: 4px;
		margin: 0 5px 10px;
        i{
          display: inline;
          color: #409eff;          
          cursor: pointer;
        }
      }
    }
  }

</style>
