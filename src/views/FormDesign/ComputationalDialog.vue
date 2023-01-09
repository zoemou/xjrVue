<template>
  <div class="dialog-box">
    <el-dialog v-dialogDrag
      v-bind="$attrs"
      width="980px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :before-close="close"
    >
      <div slot="title">
        {{$t('code.rightPanel.compConfig')}}
      </div>
      <div class="content">
          <div class="left">
            <div class="text">{{$t('componentList')}}</div>
            <div role="tree" class="el-tree tree-box">
              <template v-for="(item, index) in ruleTreelist">
                <div
                  role="treeitem"
                  class="el-tree-node blue"
                  v-if="!item.disabled"
                  :key="index"
                >
                  <draggable @end="endTreeBtn(item)" :sort="false">
                    <div>
                      {{ item.label }}
                    </div>
                  </draggable>
                </div>
                <div
                  role="treeitem"
                  class="el-tree-node gray disabled"
                  v-if="item.disabled"
                  :key="index"
                  :title="item.errMsg"
                >
                  <div>{{ item.label }}</div>
                </div>
              </template>
            </div>
          </div>
          <div class="config-detail">
            <div class="text">{{$t('BI.group.customBind.chartConfig')}}</div>
            <div class="rule-btn-box" v-if="ruleBtnList.length > 0">
              <draggable @end="endBtn" :sort="false">
                <el-button
                  v-for="(item, index) in ruleBtnList"
                  :key="index"
                  :icon="item.icon ? item.icon : ''"
                  size="mini"
                  @click="addElement(item)"
                  >{{ item.icon ? "" : item.label }}
                </el-button>
              </draggable>
              <div class="num-input">
                <label for="">{{$t('digital')}}：</label>
                <input type="text" placeholder="" v-model="number">
                <el-button type="primary" size="mini" @click="addNumber">{{$t('buttonModule.modalSureBtn')}}</el-button>
              </div>
            </div>
            <draggable class="result-config" :sort="true" v-model="ruleList">
              <template v-if="ruleList.length > 0">
                <!-- <el-tag
                  v-for="(tag, index) in ruleList"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index)"
                  >{{ tag.name }}
                </el-tag> -->
                <div
                    v-for="(tag,index) in ruleList"
                    :key="index" 
                    class="result-item" 
                    data-id="1">
                      {{tag.name}}
                      <i class="el-icon-circle-close" @click="handleClose(index)"></i>
                    </div>
              </template>
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

import draggable from "vuedraggable";
import {
  deepClone
} from '@/util/util';
export default {
  components: {
    draggable
  },
  inheritAttrs: false,
  props: ['current','ruleTreelist','allComponent'],
  data() {
    return {
      ruleList: [],
	  tempRule:[],
      ruleBtnList: [],
      ruleTip: {
        title: this.$t('workFlow.callActivity.hint'),
        content:this.$t('variableCalculaByCalculationFormula')
      },
      allComponentObj: {},
      number: ''   //公式数字框
    };
  },
  mounted(){
    let ruleBtnList = [
        {
          id: "1",
          icon: "el-icon-plus",
          type: "operation",
          label: "+",
          formId:0,
          drag: true
        },
        {
          id: "2",
          icon: "el-icon-minus",
          type: "operation",
          label: "-",
          formId:0,
          drag: true
        },
        {
          id: "3",
          icon: "el-icon-close",
          type: "operation",
          label: "*",
          formId:0,
          drag: true
        },
        {
          id: "4",
          icon: "el-icon-except",
          type: "operation",
          label: "/",
          formId:0,
          drag: true
        },
        {
          id: "5",
          icon: "",
          type: "operation",
          label: "(",
          formId:0,
          drag: true
        },
        {
          id: "6",
          icon: "",
          type: "operation",
          label: ")",
          formId:0,
          drag: true
        },
        {
          id: "7",
          icon: "",
          type: "operation",
          label: ".",
          formId:0,
          drag: true
        },
        {
          id: "8",
          icon: "",
          type: "taxRate",
          label: this.$t('code.rightPanel.rate'),
          formId:0,
          drag: true
        }
      ];
    if(this.current.isTax){
      ruleBtnList.splice(8,1);
      let label = this.$t('code.rightPanel.rate')+"("+this.current.taxRate+ "%)";
      ruleBtnList[7].label = label;
    }else{
      ruleBtnList.splice(7,1);
    }
    this.ruleBtnList = ruleBtnList;

    //以自身开始发散禁用关联组件
    this.setCanRelationCom();
    //初始化计算公式
    this.initComputational();
  },
  methods: {
    addNumber(){
      this.ruleList.push({
        name: this.number,
        id: '1',
        type: 'operation',
        formId: 0,
      });
    },
    initComputational(){
      if(this.current.computationalConfigurationValue){
        this.ruleList = deepClone(this.current.computationalConfiguration) || [];
		this.tempRule=deepClone(this.current.computationalConfiguration) || [];
      }
    },

	setRelativeId(fromArr){
		fromArr.forEach(it=>{
		  this.ruleTreelist.forEach(o=>{
			  if(o.formId==it){
				 o.disabled=true;
				 if(o.relativeComObject?.length>0){
				 	this.setRelativeId(o.relativeComObject)
				 }
			  } 
			  
		  })
	    })
	},
    setCanRelationCom(){
		let arr=this.ruleTreelist;
      for(let i=0;i<arr.length;i++){		  
		  if(arr[i].formId==this.current.__config__.formId) this.$set(this.ruleTreelist[i],'disabled',true);
		  if(this.current.relativeComObject?.length>0){
			  this.setRelativeId(this.current.relativeComObject)
		  }
      }                                                                                                                                         
    },

    submit(){
      this.current.computationalConfiguration = [];
      this.current.computationalConfigurationValue = "";
      this.ruleList.forEach((item)=>{
        this.current.computationalConfiguration.push(deepClone(item));
        this.current.computationalConfigurationValue += item.name;
      });
      if(this.ruleList.length){
        this.current.readonly = true;
      }else{
        this.current.readonly = false;
        this.computationalConfiguration = [];
        this.computationalConfigurationValue = '';
      } 
      this.$emit('update:visible', false);
    },
    endTreeBtn(dragJson) {
		console.log(dragJson,this.ruleList,this.current)
      this.ruleList.push({
        name: dragJson.label,
        id: dragJson.id,
        type: dragJson.type,
        formId: dragJson.formId,
      });
		this.allComponent.forEach((item,idx)=>{
		  if(item.__config__.formId == dragJson.formId){
			  if(!item.relativeComObject) item.relativeComObject = [];
		      item.relativeComObject.push(this.current.__config__.formId);
		  }
		});
    },
    endBtn(e) {
      let dragJson = this.ruleBtnList[e.newDraggableIndex];
      this.ruleList.push({
        name: dragJson.label,
        id: dragJson.id,
        type: dragJson.type,
        formId: dragJson.formId,
      });
    },
    addElement(dragJson){
      this.ruleList.push({
        name: dragJson.label,
        id: dragJson.id,
        type: dragJson.type,
        formId: dragJson.formId,
      });
    },
    handleClose(index) {
      if (this.ruleList.length > 0 && this.ruleList[index].formId != 0) {
        //移除父子级关联组件
		let id=this.ruleList[index].formId;
        this.allComponent.forEach(it=>{
			if(it.__config__.formId==id){
				it.relativeComObject=it.relativeComObject.filter(o=>{return o!=this.current.__config__.formId})
			}
        });
        this.ruleList.splice(index, 1);
      }else{
        this.ruleList.splice(index, 1);
      }
    },
    close(){
		this.ruleList.forEach(it=>{
			if(it.formId>0){
				if(!this.tempRule.find(o=>{return o.formId==it.formId})){
					let idx=this.allComponent.findIndex(o=>{return o.__config__.formId==it.formId})
					if(idx>=0){
						this.allComponent[idx].relativeComObject=this.allComponent[idx].relativeComObject.filter(o=>{return o!=this.current.__config__.formId})
					}
				}
			}
		})
      this.$emit('update:visible', false);
    },
    getRuleList() {
      return this.ruleList;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-box {
  ::v-deep .el-dialog {
	background-color: #fff!important;  
    border-radius: 2px;
    margin-bottom: 0;
    margin-top: 4vh !important;
    display: flex;
    flex-direction: column;
    max-height: 92vh;
    overflow: hidden;
    box-sizing: border-box;
    .el-icon-except::before {
      content: "÷";
    }
    .el-dialog__header {
      padding-top: 14px;
	  color: #303133;
	  font-weight: bold;
    }
    .el-dialog__body {
      padding: 0;
      overflow: auto;
    }
  }
  .content {
    border: 1px solid #dcdfe6;
    margin: 10px;
    display: flex;
    border-radius: 3px 0px 0px 0px;
    .left{
      width: 300px;
      border-right: 1px solid #dcdfe6;
      .tree-box {
        display: flex;
        flex-wrap: wrap;
        padding: 5px;
        .el-tree-node {
          white-space: nowrap;
          outline: 0;
          // height: 30px;
          width: auto;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          padding: 3px 8px 3px 8px;
          margin: 4px;
          cursor: move;
          &.disabled{
            cursor: not-allowed;
          }
          &.blue{
            color: #409eff;
            background: #ecf5ff;
            border-color: #b3d8ff;
          }
          &.green{
            color: #67c23a;
            background: #f0f9eb;
            border-color: #c2e7b0;
          }
          &.gray{
            color: #c3c5ca;
            background: #f4f4f5;
            border: none;
          }
        }
      }
    }
    .config-detail{
      flex: 1;
      border-radius: 0px 0px 3px 0px;
    }
    .text{
      font-size: 12px;
      color: #666;
      border-bottom: 1px solid #dcdfe6;
      padding: 5px 8px;
    }
    .rule-box {
      display: flex;
      border: 1px solid #dcdfe6;
    }
    .el-tag {
      font-size: 14px;
      margin: 5px;
    }
    .drag-panel {
      width: 100%;
      margin-left: 10px;
      padding: 10px;
      border: 1px solid #dcdfe6;
    }
    .rule-btn-box {
      padding: 10px;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      justify-content: space-between;
      button{
        height: 30px;
      }
    }
    .num-input{
      label{
        color: #666;
        font-size: 12px;
        margin-right: 5px;
        position: relative;
        top: 5px;
      }
      input{
        border: 1px solid #DCDFE6;
        width: 80px;
        height: 25px;
        border-radius: 3px;
        font-size: 12px;
        color: #666;
        margin-right: 5px;
        padding: 0 3px;
      }
      button{
        padding: 0px 5px;
        height: 25px;
      }
    }
    .rule-btn-box div {
      display: flex;
    }
    .result-config{
      padding: 5px 0px 0px 5px;
      min-height: 300px;
      display: flex;
      align-items: baseline;
      .result-item{
        color: #909399;
        width: auto;
        padding: 0 4px;
        &:hover{
          i{
            display: inline;
          }
          color: #409eff;
          background: #ecf5ff;
          border: 1px solid #b3d8ff;
        }
        i{
          display: none;
          cursor: pointer;
        }
      }
    }
    .input-new-tag {
      margin: 0 10px;
    }
    .rule-tip-box {
      height: 430px;
      font-size: 24px;
      margin: 0 auto;
      .tip-title {
        text-align: center;
        font-size: 24px;
        padding-top: 150px;
      }
      .tip-content {
        text-align: center;
        font-size: 12px;
        line-height: 20px;
        color: #9e9d9d;
      }
    }
  }
}
</style>
