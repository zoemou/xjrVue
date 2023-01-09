<template>
  <div class="content">
    <div class="left">
      <el-tree
        :data="ruleTreelist"
        @node-click="handleNodeClick"
        :allow-drag="allowDrag"
      >
      </el-tree>
    </div>
    <div class="config-detail">
     <div  class="result-config">
          <CodemirrorSql style="width:100%;"
            :placeholder="ruleTip.content"
            v-model="inputValue"
            ref="sql"
          ></CodemirrorSql>
     </div>
    </div>
  </div>
</template>

<script>
import CodemirrorSql from "@/components/common/CodemirrorSql";
export default {
  components: {
    CodemirrorSql,
  },
  props: {
    iframeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ruleTreelist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    ruleTip: {
      type: Object,
      default: () => {
        return {
          title: "点击左侧到此处进行添加",
          content: "清填写sql"
        };
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      inputValue: ""
    };
  },
  created () {
    this.inputValue = this.iframeData.text;
  },
  methods: {
    handleNodeClick(data) {
      if (data.drag) {
        this.$refs.sql.insertVariable('``'+data.markKey+'``');
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.drag ? draggingNode.data.drag : false;
    },
    getTasksqlText(){
      return this.inputValue;
    },
  }
};
</script>

<style lang="scss" scoped>

.rule-tip-box {
  height: 430px;
  font-size: 24px;
  .tip-title {
    text-align: center;
    font-size: 24px;
    padding-top: 150px;
  }
  .tip-content {
    text-align: center;
    font-size: 12px;
    line-height: 20px;
  }
}

.left{
  width: 300px;
  border-right: 1px solid #dcdfe6;
  height: 100%;
  overflow: auto;
}
.content {
  border: 1px solid #dcdfe6;
  height: 100%;
  display: flex;
  border-radius: 3px 0px 0px 0px;
  .config-detail {
    width: calc(100% - 300px);
    border-radius: 0px 0px 3px 0px;
	.result-config {
	    padding: 10px;
	    display: flex;
	    flex-wrap: wrap;
		height: calc(100% - 20px);
		::v-deep .el-textarea, ::v-deep #textarea{
			height: 100%;
		}
	}	
  }
}
</style>
