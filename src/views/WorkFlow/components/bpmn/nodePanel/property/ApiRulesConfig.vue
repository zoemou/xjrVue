<template>
  <div class="content">
     <el-tree
     class="left"
      :data="ruleTreelist"
      node-key="id"
      @node-click="handleNodeClick"
      :allow-drag="allowDrag"
    >
    </el-tree>
    <div class="drag-panel config-detail">

      <draggable @end="end">
        <template v-if="ruleList.length > 0">
          <el-tag
            v-for="(tag, index) in ruleList"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
            >{{ tag.name }}
          </el-tag></template
        >
        <template v-else>
          <div class="all-p-10 setTableTrBoder mb10 rule-tip-box">
            <p class="tip-title">
              {{ ruleTip.title }}
            </p>
            <p class="tip-content" v-html="ruleTip.content"></p>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  props: {
    ruleNameList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    ruleTreelist: {
      type: Array,
      default: () => {
        return [];
      },
    },
    ruleTip: {
      type: Object,
      default: () => {
        return {
          title: this.$t('workFlow.callActivity.hint'),
          content: "",
        };
      },
    },
  },
  data() {
    return {
      ruleList:[],
      inputValue: "",
    };
  },
  created () {
    this.ruleList =this.ruleNameList;
  },
  methods: {
    end(e) {
      let oldJson = this.ruleList[e.oldDraggableIndex];
      let newJson = this.ruleList[e.newDraggableIndex];
      this.ruleList[e.oldDraggableIndex] = newJson;
      this.ruleList[e.newDraggableIndex] = oldJson;
    },
    handleNodeClick(data) {
      if (data.drag) {
        this.ruleList.push({
          name: data.label,
          ...data
        });
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.drag ? draggingNode.data.drag : false;
    },
    handleClose(index) {
      if (this.ruleList.length > 0) {
        this.ruleList.splice(index, 1);
      }
    },
    getRuleList(){
      return this.ruleList;
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-box {
  width: 200px;
}
.rule-box {
  display: flex;
}
.el-tag {
  font-size: 14px;
  margin: 5px;
}
.drag-panel {
  width: 100%;
  height: 400px;
}
.rule-btn-box {
  margin-bottom: 20px;
}
.rule-btn-box div {
  display: flex;
}
.input-new-tag {
  margin: 0 10px;
}
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
@media screen and (max-width: 1370px) {
	.tree-box{
		height: 380px;
		overflow: scroll;
	}
}
.content {
  border: 1px solid #dcdfe6;
  margin: 10px;
  display: flex;
  border-radius: 3px 0px 0px 0px;
  .config-detail {
    flex: 1;
    border-radius: 0px 0px 3px 0px;
  }
}
.left{
  width: 300px;
  border-right: 1px solid #dcdfe6;
}
</style>
