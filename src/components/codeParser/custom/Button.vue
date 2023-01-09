<template>
  <div @click="handleClick">
    <avue-custom-button :content="content"></avue-custom-button>
  </div>
</template>

<script>
import {
  triggerEventHandler
} from '@/util/dataApi';
import { getDataAPi } from "@/util/dataApi";
export default {
  props: {
    fieldsIndex: {
      type: Number,
      required: true,
    },
    formConf: {
      type: Object,
      required: true,
    },
    curFormId: {
      type: Number,
    },
    tabChildren: {
      type: Array,
    },
  },
  data() {
    return {
      confFields: [],
    };
  },
  computed: {
    content() {
      if(this.confFields&&this.confFields[this.fieldsIndex]&&this.confFields[this.fieldsIndex].content){
        return this.confFields[this.fieldsIndex].content;
      }else{
        return "按钮";
      }
    }
  },
  created() {
    if (this.tabChildren && this.tabChildren.length) {
      this.confFields = this.tabChildren;
    } else {
      this.confFields = this.formConf.fields;
    }
  },
  methods: {
    async handleClick() {
      let conf = this.confFields[this.fieldsIndex];
      let config = conf.__config__;
      if (
        config.triggerEventData["click"] &&
        config.triggerEventData["click"].length > 0
      ) {
        for (const ele of config.triggerEventData["click"]) {
          if (ele.operationConfiguration) {
            let apiConfig = ele.operationConfiguration;
            if (apiConfig.url) {
              await getDataAPi(apiConfig);
            }
          }
        }
      }
      if (
        config.triggerEventData["clickAfter"] &&
        config.triggerEventData["clickAfter"].length > 0
      ) {
        for (const ele of config.triggerEventData["clickAfter"]) {
        }
      }
      // 组件触发事件
      if(
        config.triggerEventData["clickAfter"] &&
        config.triggerEventData["clickAfter"].length>0
      ){
        let ids = [];
        ids = config.triggerEventData["clickAfter"].map(ele=>{
          return ele.componentFormId;
        });
        triggerEventHandler(ids);
      }

    },
  },
};
</script>

<style lang="scss" scoped></style>
